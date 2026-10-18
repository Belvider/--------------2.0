import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import {
  adminMediaFolderValues,
  isAdminMediaFolder,
  type AdminMediaFolder,
  type AdminMediaItem
} from "@/lib/admin-media-config";
import {
  buildUploadUrl,
  deleteUploadByUrl,
  isLocalUploadStorageEnabled,
  listBlobUploads,
  saveUploadFile
} from "@/lib/upload-storage";

const ADMIN_MEDIA_ROOT = path.join(process.cwd(), "public", "uploads", "media");
const MAX_MEDIA_FILE_SIZE = 12 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/svg+xml", "svg"]
]);

function getFolderPath(folder: AdminMediaFolder) {
  return path.join(ADMIN_MEDIA_ROOT, folder);
}

function sanitizeBaseName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 48);
}

function toPublicUrl(folder: AdminMediaFolder, fileName: string) {
  return buildUploadUrl(`media/${folder}/${fileName}`);
}

function toItem(folder: AdminMediaFolder, fileName: string, fileStat: Awaited<ReturnType<typeof stat>>): AdminMediaItem {
  return {
    name: fileName,
    url: toPublicUrl(folder, fileName),
    folder,
    size: Number(fileStat.size),
    updatedAt: fileStat.mtime.toISOString(),
    type: "image"
  };
}

export async function ensureAdminMediaDirectories() {
  if (!isLocalUploadStorageEnabled()) return;

  await mkdir(ADMIN_MEDIA_ROOT, { recursive: true });

  await Promise.all(
    adminMediaFolderValues.map((folder) =>
      mkdir(getFolderPath(folder), {
        recursive: true
      })
    )
  );
}

export async function listAdminMedia(folder: AdminMediaFolder | "all" = "all") {
  if (!isLocalUploadStorageEnabled()) {
    const prefix = folder === "all" ? "media" : `media/${folder}`;
    const items = await listBlobUploads(prefix);

    return items
      .map(({ key, metadata }) => {
        const parts = key.split("/");
        const folderName = parts[1];
        const fileName = parts.at(-1);

        if (!fileName || !isAdminMediaFolder(folderName)) {
          return null;
        }

        return {
          name: fileName,
          url: buildUploadUrl(key),
          folder: folderName,
          size: typeof metadata.size === "number" ? metadata.size : Number(metadata.size ?? 0),
          updatedAt: typeof metadata.updatedAt === "string" ? metadata.updatedAt : new Date(0).toISOString(),
          type: "image" as const
        };
      })
      .filter((item): item is AdminMediaItem => Boolean(item))
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
  }

  await ensureAdminMediaDirectories();

  const folders = folder === "all" ? adminMediaFolderValues : [folder];
  const items: AdminMediaItem[] = [];

  for (const currentFolder of folders) {
    const entries = await readdir(getFolderPath(currentFolder), { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }

      const filePath = path.join(getFolderPath(currentFolder), entry.name);
      const fileStat = await stat(filePath);
      items.push(toItem(currentFolder, entry.name, fileStat));
    }
  }

  return items.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}

export async function saveAdminMedia(file: File, folder: AdminMediaFolder) {
  const extension = ALLOWED_IMAGE_TYPES.get(file.type);

  if (!extension) {
    throw new Error("Підтримуються лише JPG, PNG, WEBP, AVIF або SVG");
  }

  if (file.size > MAX_MEDIA_FILE_SIZE) {
    throw new Error("Максимальний розмір файлу — 12 МБ");
  }

  await ensureAdminMediaDirectories();

  const safeBaseName = sanitizeBaseName(file.name) || folder;
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeBaseName}.${extension}`;
  const saved = await saveUploadFile({
    key: `media/${folder}/${fileName}`,
    file,
    metadata: {
      kind: "media",
      folder,
      type: "image",
      size: file.size,
      updatedAt: new Date().toISOString(),
      originalName: file.name
    }
  });

  return {
    name: fileName,
    url: saved.url,
    folder,
    size: saved.size ?? file.size,
    updatedAt: saved.updatedAt,
    type: "image"
  };
}

export async function deleteAdminMedia(url: string) {
  await deleteUploadByUrl(url);
}
