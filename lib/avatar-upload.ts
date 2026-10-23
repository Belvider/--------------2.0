// Leave room for multipart metadata below the hosting request limit.
export const MAX_AVATAR_FILE_SIZE = 4 * 1024 * 1024;
export const AVATAR_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
export const AVATAR_MIME_TYPES: ReadonlyMap<string, string> = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"]
]);

export function getAvatarFileError(file: { type: string; size: number }): string | null {
  if (!AVATAR_MIME_TYPES.has(file.type)) return "Підтримуються лише JPG, PNG, WEBP або AVIF.";
  if (file.size <= 0) return "Фото порожнє. Виберіть інший файл.";
  if (file.size > MAX_AVATAR_FILE_SIZE) return "Максимальний розмір фото — 4 МБ.";
  return null;
}
