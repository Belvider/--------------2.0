import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const PUBLIC_UPLOAD_ROOT = "/uploads";
const NETLIFY_UPLOAD_STORE_NAME = "portal-uploads";

const MIME_TYPES = new Map([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
  ["avif", "image/avif"],
  ["svg", "image/svg+xml"],
  ["pdf", "application/pdf"]
]);

type UploadMetadata = {
  kind: "avatar" | "media";
  contentType?: string;
  size?: number;
  updatedAt?: string;
  originalName?: string;
  folder?: string;
  type?: string;
};

type UploadResult = {
  key: string;
  url: string;
  contentType: string;
  size?: number;
  updatedAt: string;
};

type StoredUpload = {
  data: ArrayBuffer;
  contentType: string;
};

type BlobListItem = {
  key: string;
  metadata: Record<string, unknown>;
};

function sanitizeUploadKey(value: string) {
  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }
  // Backslashes and drive/stream separators are paths on Windows even when
  // the URL parser treats them as one segment.
  if (/[\\:\u0000]/.test(decoded)) return null;
  const segments = decoded
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0 || segments.some((segment) => segment === "." || segment === "..")) {
    return null;
  }

  return segments.join("/");
}

export function isNetlifyBlobStorageEnabled() {
  return process.env.NETLIFY === "true" || Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function getNetlifyUploadStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore(NETLIFY_UPLOAD_STORE_NAME);
}

export function inferContentTypeFromKey(key: string) {
  const extension = key.split(".").pop()?.toLowerCase() ?? "";
  return MIME_TYPES.get(extension) ?? "application/octet-stream";
}

export function buildUploadUrl(key: string) {
  const safeKey = sanitizeUploadKey(key);
  if (!safeKey) {
    throw new Error("Некоректний ключ файлу");
  }

  return `${PUBLIC_UPLOAD_ROOT}/${safeKey}`;
}

export function getUploadKeyFromUrl(url: string) {
  let pathname = url.trim();

  try {
    if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
      pathname = new URL(pathname).pathname;
    }
  } catch {
    return null;
  }

  pathname = pathname.split("?")[0]?.split("#")[0] ?? pathname;

  if (pathname.startsWith("/api/uploads/")) {
    pathname = pathname.slice("/api/uploads/".length);
  } else if (pathname.startsWith("/uploads/")) {
    pathname = pathname.slice("/uploads/".length);
  } else {
    return null;
  }

  return sanitizeUploadKey(pathname);
}

export function getLocalUploadPathFromKey(key: string) {
  const safeKey = sanitizeUploadKey(key);
  if (!safeKey) {
    return null;
  }

  const resolved = path.resolve(path.join(LOCAL_UPLOAD_ROOT, safeKey));
  const root = path.resolve(LOCAL_UPLOAD_ROOT);

  const relative = path.relative(root, resolved);
  if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return null;
  }

  return resolved;
}

export async function saveUploadFile({
  key,
  file,
  metadata
}: {
  key: string;
  file: File;
  metadata: UploadMetadata;
}): Promise<UploadResult> {
  const safeKey = sanitizeUploadKey(key);
  if (!safeKey) {
    throw new Error("Некоректний шлях до файлу");
  }

  const updatedAt = metadata.updatedAt ?? new Date().toISOString();
  const contentType = metadata.contentType || file.type || inferContentTypeFromKey(safeKey);
  const arrayBuffer = await file.arrayBuffer();

  if (isNetlifyBlobStorageEnabled()) {
    const store = await getNetlifyUploadStore();
    await store.set(safeKey, arrayBuffer, {
      metadata: {
        ...metadata,
        contentType,
        size: metadata.size ?? file.size,
        updatedAt
      }
    });
  } else {
    const outputPath = getLocalUploadPathFromKey(safeKey);
    if (!outputPath) {
      throw new Error("Некоректний шлях до локального файлу");
    }

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, Buffer.from(arrayBuffer));
  }

  return {
    key: safeKey,
    url: buildUploadUrl(safeKey),
    contentType,
    size: metadata.size ?? file.size,
    updatedAt
  };
}

export async function deleteUploadByKey(key: string) {
  const safeKey = sanitizeUploadKey(key);
  if (!safeKey) {
    throw new Error("Некоректний шлях до файлу");
  }

  if (isNetlifyBlobStorageEnabled()) {
    const store = await getNetlifyUploadStore();
    await store.delete(safeKey);
    return;
  }

  const localPath = getLocalUploadPathFromKey(safeKey);
  if (!localPath) {
    throw new Error("Некоректний шлях до локального файлу");
  }

  await unlink(localPath);
}

export async function deleteUploadByUrl(url: string) {
  const key = getUploadKeyFromUrl(url);
  if (!key) {
    return;
  }

  try {
    await deleteUploadByKey(key);
  } catch {
    // ignore missing files
  }
}

export async function getStoredUpload(key: string): Promise<StoredUpload | null> {
  const safeKey = sanitizeUploadKey(key);
  if (!safeKey) {
    return null;
  }

  if (isNetlifyBlobStorageEnabled()) {
    const store = await getNetlifyUploadStore();
    const result = await store.getWithMetadata(safeKey, { type: "arrayBuffer" });

    if (!result) {
      return null;
    }

    return {
      data: result.data,
      contentType:
        typeof result.metadata.contentType === "string" ? result.metadata.contentType : inferContentTypeFromKey(safeKey)
    };
  }

  const localPath = getLocalUploadPathFromKey(safeKey);
  if (!localPath) {
    return null;
  }

  try {
    const data = await readFile(localPath);
    return {
      data: data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
      contentType: inferContentTypeFromKey(safeKey)
    };
  } catch {
    return null;
  }
}

export async function listBlobUploads(prefix: string): Promise<BlobListItem[]> {
  if (!isNetlifyBlobStorageEnabled()) {
    return [];
  }

  const safePrefix = sanitizeUploadKey(prefix);
  if (!safePrefix) throw new Error("Некоректна папка файлів");
  const store = await getNetlifyUploadStore();
  const result = await store.list({ prefix: safePrefix });

  const entries = await Promise.all(
    result.blobs.map(async ({ key }) => {
      const metadataResult = await store.getMetadata(key);
      return {
        key,
        metadata: metadataResult?.metadata ?? {}
      };
    })
  );

  return entries;
}
