export const adminMediaFolderValues = ["general", "brands", "modules", "portal-pages"] as const;

export type AdminMediaFolder = (typeof adminMediaFolderValues)[number];

export const adminMediaFolderLabels: Record<AdminMediaFolder | "all", string> = {
  all: "Усе медіа",
  general: "Загальне",
  brands: "Бренди",
  modules: "Модулі",
  "portal-pages": "Сторінки порталу"
};

export type AdminMediaItem = {
  name: string;
  url: string;
  folder: AdminMediaFolder;
  size: number;
  updatedAt: string;
  type: "image";
};

export function isAdminMediaFolder(value: string | null | undefined): value is AdminMediaFolder {
  return Boolean(value && adminMediaFolderValues.includes(value as AdminMediaFolder));
}
