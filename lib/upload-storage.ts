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

export class UploadStorageConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadStorageConfigurationError";
  }
}

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
  return process.env.NETLIFY === "true";
}

export function isVercelBlobStorageEnabled() {
  // On Vercel the SDK can get OIDC from the request context rather than env.
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && (process.env.VERCEL_OIDC_TOKEN || isVercelDeployment()))
  );
}

function isVercelDeployment() {
  return process.env.VERCEL === "1" || process.env.VERCEL === "true" || Boolean(process.env.VERCEL_ENV);
}

// Vercel functions cannot persist writes to the deployed public directory.
// Keep local disk storage available for development and self-hosted installs.
export function isLocalUploadStorageEnabled() {
  return !isVercelBlobStorageEnabled() && !isNetlifyBlobStorageEnabled() && !isVercelDeployment();
}

function requireDurableUploadStorage() {
  if (!isVercelBlobStorageEnabled() && !isNetlifyBlobStorageEnabled() && isVercelDeployment()) {
    throw new UploadStorageConfigurationError(
      "Upload storage is not configured. Connect a private Vercel Blob store to this project and redeploy."
    );
  }
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
  requireDurableUploadStorage();
  const arrayBuffer = await file.arrayBuffer();

  if (isVercelBlobStorageEnabled()) {
    const { put } = await import("@vercel/blob");
    // Keep stable application URLs and store private data behind our upload
    // route. Random/versioned filenames are generated by the caller.
    await put(safeKey, arrayBuffer, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType
    });
  } else if (isNetlifyBlobStorageEnabled()) {
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

  requireDurableUploadStorage();

  if (isVercelBlobStorageEnabled()) {
    const { del } = await import("@vercel/blob");
    await del(safeKey);
    return;
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

  requireDurableUploadStorage();

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

  if (isVercelBlobStorageEnabled()) {
    const { get } = await import("@vercel/blob");
    const result = await get(safeKey, { access: "private" });
    if (result?.statusCode !== 200 || !result.stream) {
      return null;
    }

    return {
      data: await new Response(result.stream).arrayBuffer(),
      contentType: result.blob.contentType || inferContentTypeFromKey(safeKey)
    };
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
  const safePrefix = sanitizeUploadKey(prefix);
  if (!safePrefix) throw new Error("Некоректна папка файлів");

  if (isVercelBlobStorageEnabled()) {
    const { list } = await import("@vercel/blob");
    const entries: BlobListItem[] = [];
    let cursor: string | undefined;

    do {
      const result = await list({ prefix: `${safePrefix}/`, cursor });
      for (const blob of result.blobs) {
        const key = sanitizeUploadKey(blob.pathname);
        if (!key || !key.startsWith(`${safePrefix}/`)) continue;
        entries.push({
          key,
          metadata: {
            contentType: inferContentTypeFromKey(key),
            size: blob.size,
            updatedAt: blob.uploadedAt.toISOString()
          }
        });
      }

      if (!result.hasMore) break;
      if (!result.cursor || result.cursor === cursor) {
        throw new Error("Upload storage returned an invalid pagination cursor");
      }
      cursor = result.cursor;
    } while (cursor);

    return entries;
  }

  if (!isNetlifyBlobStorageEnabled()) {
    return [];
  }

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
