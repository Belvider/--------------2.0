"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { getRequestError } from "@/lib/http-client";
import {
  Check,
  Copy,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud
} from "lucide-react";
import {
  adminMediaFolderLabels,
  adminMediaFolderValues,
  type AdminMediaFolder,
  type AdminMediaItem
} from "@/lib/admin-media-config";

type AdminMediaLibraryProps = {
  fixedFolder?: AdminMediaFolder;
  selectedUrl?: string;
  onSelect?: (url: string) => void;
  compact?: boolean;
  className?: string;
  title?: string;
  description?: string;
};

type FolderFilter = AdminMediaFolder | "all";

function formatFileSize(size: number) {
  if (size < 1024) return `${size} Б`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`;
  return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

export function AdminMediaLibrary({
  fixedFolder,
  selectedUrl,
  onSelect,
  compact = false,
  className,
  title = "Медіабібліотека",
  description = "Завантажуйте та перевикористовуйте зображення для брендів, модулів і сторінок порталу."
}: AdminMediaLibraryProps) {
  const [items, setItems] = useState<AdminMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingUrl, setIsDeletingUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [folder, setFolder] = useState<FolderFilter>(fixedFolder ?? "all");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const requestIdRef = useRef(0);
  const folderRef = useRef(folder);
  folderRef.current = folder;

  const uploadFolder = useMemo<AdminMediaFolder>(() => {
    if (fixedFolder) {
      return fixedFolder;
    }

    return folder === "all" ? "general" : folder;
  }, [fixedFolder, folder]);

  const loadMedia = useCallback(async (nextFolder: FolderFilter, signal?: AbortSignal) => {
    if (folderRef.current !== nextFolder) return;
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/media?folder=${nextFolder}`, { signal });
      const data = (await response.json()) as { items?: AdminMediaItem[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Не вдалося отримати файли");
      }

      if (!signal?.aborted && requestId === requestIdRef.current && folderRef.current === nextFolder) setItems(data.items ?? []);
    } catch (requestError) {
      if (!signal?.aborted && requestId === requestIdRef.current) setError(getRequestError(requestError));
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadMedia(folder, controller.signal);
    return () => controller.abort();
  }, [folder, loadMedia]);

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", uploadFolder);

    setIsUploading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData
      });

      const data = (await response.json()) as { item?: AdminMediaItem; error?: string };

      if (!response.ok || !data.item) {
        throw new Error(data.error ?? "Не вдалося завантажити файл");
      }

      setNotice(`Файл «${data.item.name}» додано до бібліотеки`);
      if (onSelect) {
        onSelect(data.item.url);
      }

      await loadMedia(folder);
    } catch (requestError) {
      setError(getRequestError(requestError));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDelete(url: string) {
    const confirmed = window.confirm("Видалити цей файл із медіабібліотеки?");
    if (!confirmed) {
      return;
    }

    setIsDeletingUrl(url);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Не вдалося видалити файл");
      }

      setNotice("Файл видалено");
      await loadMedia(folder);
    } catch (requestError) {
      setError(getRequestError(requestError));
    } finally {
      setIsDeletingUrl(null);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setNotice("URL скопійовано");
      setError(null);
    } catch {
      setError("Не вдалося скопіювати URL");
    }
  }

  return (
    <section className={clsx(compact ? "rounded-[24px] border border-white/10 bg-white/[0.025] p-4" : "card p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-[var(--font-heading)] text-xl font-semibold text-ink">{title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isUploading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <UploadCloud className="size-4" aria-hidden="true" />}
            Завантажити
          </button>
          <button
            type="button"
            onClick={() => void loadMedia(folder)}
            disabled={isLoading}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-ink disabled:opacity-60"
          >
            <RefreshCw className={clsx("size-4", isLoading && "animate-spin")} aria-hidden="true" />
            Оновити
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleUpload(file);
          }
        }}
      />

      {!fixedFolder ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFolder("all")}
            className={clsx(
              "focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              folder === "all"
                ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)] text-[color:var(--brand-strong)]"
                : "border-white/10 bg-white/[0.03] text-slate-500"
            )}
          >
            {adminMediaFolderLabels.all}
          </button>
          {adminMediaFolderValues.map((folderOption) => (
            <button
              key={folderOption}
              type="button"
              onClick={() => setFolder(folderOption)}
              className={clsx(
                "focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                folder === folderOption
                  ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)] text-[color:var(--brand-strong)]"
                  : "border-white/10 bg-white/[0.03] text-slate-500"
              )}
            >
              {adminMediaFolderLabels[folderOption]}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-500">
          Папка: {adminMediaFolderLabels[fixedFolder]}
        </div>
      )}

      {notice ? <p className="mt-4 text-sm text-emerald-300">{notice}</p> : null}
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}

      <div className={clsx("mt-5 grid gap-4", compact ? "sm:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4")}>
        {isLoading ? (
          <div className="col-span-full flex items-center gap-2 rounded-[22px] border border-white/10 bg-white/[0.025] px-4 py-5 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Завантажую бібліотеку...
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full rounded-[22px] border border-dashed border-white/10 bg-white/[0.025] px-4 py-8 text-center text-sm text-slate-500">
            У цій папці ще немає файлів. Можемо почати з першого завантаження.
          </div>
        ) : (
          items.map((item) => (
            <article key={item.url} className="overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(8,10,18,0.18)]">
              <div className="aspect-[4/3] overflow-hidden bg-[rgba(8,10,18,0.34)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="truncate text-sm font-semibold text-slate-100">{item.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                      {adminMediaFolderLabels[item.folder]}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                      {formatFileSize(item.size)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(item.updatedAt)}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {onSelect ? (
                    <button
                      type="button"
                      onClick={() => onSelect(item.url)}
                      className={clsx(
                        "focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold",
                        selectedUrl === item.url
                          ? "border border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)] text-[color:var(--brand-strong)]"
                          : "border border-white/10 bg-white/[0.03] text-ink"
                      )}
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      {selectedUrl === item.url ? "Обрано" : "Обрати"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void copyUrl(item.url)}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink"
                  >
                    <Copy className="size-3.5" aria-hidden="true" />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(item.url)}
                    disabled={isDeletingUrl === item.url}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100 disabled:opacity-60"
                  >
                    {isDeletingUrl === item.url ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <Trash2 className="size-3.5" aria-hidden="true" />}
                    Видалити
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
