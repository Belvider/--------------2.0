"use client";

import { getRequestError } from "@/lib/http-client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import {
  Eye,
  FilePenLine,
  Loader2,
  Save,
  TestTube2,
  Trash2
} from "lucide-react";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { formatDate } from "@/lib/ui";

export type AdminContentModuleRow = {
  id: number;
  title: string;
  description: string;
  durationMin: number;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string | Date;
};

export type AdminContentCategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  modulesCount: number;
  modules: AdminContentModuleRow[];
};

export type AdminContentBrandRow = {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  sortOrder: number;
  categoryCount: number;
  moduleCount: number;
  categories: AdminContentCategoryRow[];
};

type AdminContentTreeProps = {
  role: Role;
  brands: AdminContentBrandRow[];
};

type BrandDraft = {
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  sortOrder: string;
};

type CategoryDraft = {
  name: string;
  slug: string;
  description: string;
  sortOrder: string;
  brandId: string;
};

export function AdminContentTree({ role, brands }: AdminContentTreeProps) {
  const router = useRouter();
  const isAdmin = role === "ADMIN";
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);
  const [bulkModuleAction, setBulkModuleAction] = useState<"publish" | "unpublish" | "delete">("publish");
  const [brandDrafts, setBrandDrafts] = useState<Record<number, BrandDraft>>({});
  const [categoryDrafts, setCategoryDrafts] = useState<Record<number, CategoryDraft>>({});
  const [isPending, startTransition] = useTransition();

  const brandOptions = useMemo(
    () => brands.map((brand) => ({ id: brand.id, name: brand.name, slug: brand.slug })),
    [brands]
  );

  const brandColumns = useMemo(() => {
    const columns: [AdminContentBrandRow[], AdminContentBrandRow[]] = [[], []];

    brands.forEach((brand, index) => {
      columns[index % 2].push(brand);
    });

    return columns;
  }, [brands]);
  const allModuleIds = useMemo(
    () => brands.flatMap((brand) => brand.categories.flatMap((category) => category.modules.map((module) => module.id))),
    [brands]
  );
  const allModulesSelected = allModuleIds.length > 0 && allModuleIds.every((moduleId) => selectedModuleIds.includes(moduleId));

  useEffect(() => {
    setBrandDrafts((prev) => {
      const next = { ...prev };

      for (const brand of brands) {
        next[brand.id] = {
          name: brand.name,
          slug: brand.slug,
          logoUrl: brand.logoUrl,
          description: brand.description,
          sortOrder: String(brand.sortOrder)
        };
      }

      return next;
    });

    setCategoryDrafts((prev) => {
      const next = { ...prev };

      for (const brand of brands) {
        for (const category of brand.categories) {
          next[category.id] = {
            name: category.name,
            slug: category.slug,
            description: category.description,
            sortOrder: String(category.sortOrder),
            brandId: String(brand.id)
          };
        }
      }

      return next;
    });
  }, [brands]);

  useEffect(() => {
    setSelectedModuleIds((prev) => prev.filter((id) => allModuleIds.includes(id)));
  }, [allModuleIds]);

  function setBrandDraft(id: number, patch: Partial<BrandDraft>) {
    setBrandDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch
      }
    }));
  }

  function setCategoryDraft(id: number, patch: Partial<CategoryDraft>) {
    setCategoryDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch
      }
    }));
  }

  function toggleModuleSelection(moduleId: number, checked: boolean) {
    setSelectedModuleIds((prev) => {
      if (checked) {
        return prev.includes(moduleId) ? prev : [...prev, moduleId];
      }

      return prev.filter((id) => id !== moduleId);
    });
  }

  function toggleAllModules(checked: boolean) {
    setSelectedModuleIds(checked ? allModuleIds : []);
  }

  function saveBrand(brandId: number) {
    const draft = brandDrafts[brandId];
    if (!draft || !isAdmin || isPending) {
      return;
    }

    startTransition(async () => {
      try {
        setPendingKey(`brand:${brandId}`);
        setError(null);
        setNotice(null);
  
        const response = await fetch("/api/admin/content", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            entity: "brand",
            id: brandId,
            name: draft.name.trim(),
            slug: draft.slug.trim(),
            logoUrl: draft.logoUrl.trim(),
            description: draft.description.trim(),
            sortOrder: Number(draft.sortOrder)
          })
        });
  
        const data = (await response.json()) as { error?: string };
  
        if (!response.ok) {
          setError(data.error ?? "Не вдалося оновити бренд");
          setPendingKey(null);
          return;
        }
  
        setNotice(`Бренд «${draft.name.trim()}» оновлено`);
        setPendingKey(null);
        router.refresh();
      } catch (requestError) {
        setError(getRequestError(requestError));
      } finally {
        setPendingKey(null);
      }
    });
  }

  function saveCategory(categoryId: number) {
    const draft = categoryDrafts[categoryId];
    if (!draft || !isAdmin || isPending) {
      return;
    }

    startTransition(async () => {
      try {
        setPendingKey(`category:${categoryId}`);
        setError(null);
        setNotice(null);
  
        const response = await fetch("/api/admin/content", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            entity: "category",
            id: categoryId,
            brandId: Number(draft.brandId),
            name: draft.name.trim(),
            slug: draft.slug.trim(),
            description: draft.description.trim(),
            sortOrder: Number(draft.sortOrder)
          })
        });
  
        const data = (await response.json()) as { error?: string };
  
        if (!response.ok) {
          setError(data.error ?? "Не вдалося оновити категорію");
          setPendingKey(null);
          return;
        }
  
        setNotice(`Категорію «${draft.name.trim()}» оновлено`);
        setPendingKey(null);
        router.refresh();
      } catch (requestError) {
        setError(getRequestError(requestError));
      } finally {
        setPendingKey(null);
      }
    });
  }

  function deleteEntity(entity: "brand" | "category" | "module", id: number, label: string) {
    if (!isAdmin || isPending) {
      return;
    }

    const entityLabel =
      entity === "brand" ? "бренд" : entity === "category" ? "категорію" : "модуль";
    const confirmed = window.confirm(`Видалити ${entityLabel} «${label}»? Цю дію не можна скасувати.`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      try {
        setPendingKey(`${entity}:${id}`);
        setError(null);
        setNotice(null);
  
        const response = await fetch(`/api/admin/content?entity=${entity}&id=${id}`, {
          method: "DELETE"
        });
  
        const data = (await response.json()) as { error?: string };
  
        if (!response.ok) {
          setError(data.error ?? "Не вдалося видалити сутність");
          setPendingKey(null);
          return;
        }
  
        setNotice(`Сутність «${label}» видалено`);
        setPendingKey(null);
        router.refresh();
      } catch (requestError) {
        setError(getRequestError(requestError));
      } finally {
        setPendingKey(null);
      }
    });
  }

  function applyBulkModuleAction() {
    if (isPending) return;
    if (!isAdmin || selectedModuleIds.length === 0) {
      setError("Оберіть хоча б один модуль для масової дії");
      return;
    }

    if (bulkModuleAction === "delete") {
      const confirmed = window.confirm(`Видалити ${selectedModuleIds.length} модулів? Цю дію не можна скасувати.`);

      if (!confirmed) {
        return;
      }
    }

    startTransition(async () => {
      try {
        setPendingKey("module:bulk");
        setError(null);
        setNotice(null);
  
        const response = await fetch("/api/admin/content/bulk", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            moduleIds: selectedModuleIds,
            action: bulkModuleAction
          })
        });
  
        const data = (await response.json()) as { affectedCount?: number; error?: string };
  
        if (!response.ok) {
          setError(data.error ?? "Не вдалося виконати масову дію над модулями");
          setPendingKey(null);
          return;
        }
  
        setSelectedModuleIds([]);
        setNotice(
          bulkModuleAction === "publish"
            ? `Опубліковано ${data.affectedCount ?? 0} модулів`
            : bulkModuleAction === "unpublish"
              ? `Знято з публікації ${data.affectedCount ?? 0} модулів`
              : `Видалено ${data.affectedCount ?? 0} модулів`
        );
        setPendingKey(null);
        router.refresh();
      } catch (requestError) {
        setError(getRequestError(requestError));
      } finally {
        setPendingKey(null);
      }
    });
  }

  function renderBrandCard(brand: AdminContentBrandRow) {
    const brandDraft = brandDrafts[brand.id];

    return (
      <article key={brand.id} className="rounded-[28px] border border-white/10 bg-white/[0.025] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center overflow-hidden rounded-[14px] border border-white/10 bg-white/[0.03] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.logoUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="font-[var(--font-heading)] text-2xl font-semibold text-ink">{brand.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{brand.slug}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{brand.description}</p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Link
              href={`/brands/${brand.slug}`}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink sm:w-auto"
            >
              <Eye className="size-3.5" aria-hidden="true" />
              Відкрити
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
            {brand.categoryCount} категорій
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
            {brand.moduleCount} модулів
          </span>
        </div>

        {isAdmin && brandDraft ? (
          <details className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-100">Редагувати бренд</summary>

            <div className="mt-4 grid gap-3">
              <input
                value={brandDraft.name}
                onChange={(event) => setBrandDraft(brand.id, { name: event.target.value })}
                placeholder="Назва бренду"
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
              <input
                value={brandDraft.slug}
                onChange={(event) => setBrandDraft(brand.id, { slug: event.target.value })}
                placeholder="Slug"
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
              <AdminImageField
                value={brandDraft.logoUrl}
                onChange={(nextUrl) => setBrandDraft(brand.id, { logoUrl: nextUrl })}
                folder="brands"
                placeholder="URL логотипа"
                helperText="Логотип можна завантажити у медіабібліотеку й одразу підставити тут без ручного копіювання шляху."
                previewClassName="max-w-sm"
              />
              <textarea
                value={brandDraft.description}
                onChange={(event) => setBrandDraft(brand.id, { description: event.target.value })}
                rows={4}
                placeholder="Опис бренду"
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
              <input
                value={brandDraft.sortOrder}
                onChange={(event) => setBrandDraft(brand.id, { sortOrder: event.target.value })}
                type="number"
                min={0}
                placeholder="Порядок"
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => saveBrand(brand.id)}
                  disabled={isPending}
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
                >
                  {pendingKey === `brand:${brand.id}` ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Save className="size-4" aria-hidden="true" />
                  )}
                  Зберегти бренд
                </button>
                <button
                  type="button"
                  onClick={() => deleteEntity("brand", brand.id, brand.name)}
                  disabled={isPending}
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 disabled:opacity-60 sm:w-auto"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Видалити бренд
                </button>
              </div>
            </div>
          </details>
        ) : null}

        <div className="mt-5 space-y-3">
          {brand.categories.length > 0 ? (
            brand.categories.map((category) => {
              const categoryDraft = categoryDrafts[category.id];

              return (
                <div key={category.id} className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-100">{category.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                        {category.slug} · порядок {category.sortOrder}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {category.modulesCount} мод.
                      </span>
                      <Link
                        href={`/brands/${brand.slug}/${category.slug}`}
                        className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink"
                      >
                        <Eye className="size-3.5" aria-hidden="true" />
                        Категорія
                      </Link>
                    </div>
                  </div>

                  {isAdmin && categoryDraft ? (
                    <details className="mt-4 rounded-[20px] border border-white/10 bg-[rgba(8,10,18,0.18)] p-4">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-slate-100">
                        Редагувати категорію
                      </summary>

                      <div className="mt-4 grid gap-3">
                        <select
                          value={categoryDraft.brandId}
                          onChange={(event) => setCategoryDraft(category.id, { brandId: event.target.value })}
                          className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                        >
                          {brandOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                        <input
                          value={categoryDraft.name}
                          onChange={(event) => setCategoryDraft(category.id, { name: event.target.value })}
                          placeholder="Назва категорії"
                          className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                        />
                        <input
                          value={categoryDraft.slug}
                          onChange={(event) => setCategoryDraft(category.id, { slug: event.target.value })}
                          placeholder="Slug"
                          className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                        />
                        <textarea
                          value={categoryDraft.description}
                          onChange={(event) => setCategoryDraft(category.id, { description: event.target.value })}
                          rows={4}
                          placeholder="Опис категорії"
                          className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                        />
                        <input
                          value={categoryDraft.sortOrder}
                          onChange={(event) => setCategoryDraft(category.id, { sortOrder: event.target.value })}
                          type="number"
                          min={0}
                          placeholder="Порядок"
                          className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                        />

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => saveCategory(category.id)}
                            disabled={isPending}
                            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
                          >
                            {pendingKey === `category:${category.id}` ? (
                              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Save className="size-4" aria-hidden="true" />
                            )}
                            Зберегти категорію
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEntity("category", category.id, category.name)}
                            disabled={isPending}
                            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 disabled:opacity-60 sm:w-auto"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                            Видалити категорію
                          </button>
                        </div>
                      </div>
                    </details>
                  ) : null}

                  <div className="mt-4 space-y-2">
                    {category.modules.length > 0 ? (
                      category.modules.map((module) => (
                        <div key={module.id} className="rounded-[20px] border border-white/10 bg-white/[0.025] p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-slate-100">{module.title}</p>
                              <p className="mt-2 text-sm leading-7 text-slate-600">{module.description}</p>
                            </div>
                            <span
                              className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                module.isPublished
                                  ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)] text-[color:var(--brand-strong)]"
                                  : "border-white/10 bg-white/[0.025] text-slate-500"
                              }`}
                            >
                              {module.isPublished ? "Опубліковано" : "Чернетка"}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                            {isAdmin ? (
                              <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                                <input
                                  type="checkbox"
                                  checked={selectedModuleIds.includes(module.id)}
                                  onChange={(event) => toggleModuleSelection(module.id, event.target.checked)}
                                  className="size-4 rounded border-white/20 bg-white/5"
                                />
                                Обрати
                              </label>
                            ) : null}
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                              {module.durationMin} хв
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                              Порядок {module.sortOrder}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                              {formatDate(module.createdAt)}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                              href={`/module/${module.id}`}
                              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink sm:w-auto"
                            >
                              <Eye className="size-3.5" aria-hidden="true" />
                              Матеріал
                            </Link>
                            <Link
                              href={`/module/${module.id}/quiz`}
                              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink sm:w-auto"
                            >
                              <TestTube2 className="size-3.5" aria-hidden="true" />
                              Тест
                            </Link>
                            {isAdmin ? (
                              <>
                                <Link
                                  href={`/admin/modules/${module.id}`}
                                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink sm:w-auto"
                                >
                                  <FilePenLine className="size-3.5" aria-hidden="true" />
                                  Редагувати
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => deleteEntity("module", module.id, module.title)}
                                  disabled={isPending}
                                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100 disabled:opacity-60 sm:w-auto"
                                >
                                  {pendingKey === `module:${module.id}` ? (
                                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                                  ) : (
                                    <Trash2 className="size-3.5" aria-hidden="true" />
                                  )}
                                  Видалити
                                </button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-white/10 bg-white/[0.025] px-4 py-5 text-sm text-slate-500">
                        У категорії ще немає модулів.
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-[20px] border border-dashed border-white/10 bg-white/[0.025] px-4 py-5 text-sm text-slate-500">
              Категорій ще немає.
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <div className="space-y-4">
      {notice ? (
        <div className="rounded-[22px] border border-[rgba(40,178,158,0.24)] bg-[rgba(40,178,158,0.1)] px-4 py-3 text-sm text-white">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[22px] border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {brands.length === 0 ? (
        <article className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.025] p-5 text-sm text-slate-500">
          Брендів ще немає. Почніть зі створення першого бренду, а потім додайте категорії та модулі.
        </article>
      ) : (
        <>
          {isAdmin ? (
            <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Масові дії з модулями</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Вибрано {selectedModuleIds.length} модулів. Тут можна пакетно опублікувати чернетки, зняти модулі
                    з публікації або видалити зайве без проходу по кожній картці окремо.
                  </p>
                </div>

                <div className="grid w-full gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-wrap lg:items-center">
                  <button
                    type="button"
                    onClick={() => toggleAllModules(true)}
                    className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink"
                  >
                    Обрати всі модулі
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModuleIds([])}
                    className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink"
                  >
                    Очистити
                  </button>
                  <select
                    value={bulkModuleAction}
                    onChange={(event) => setBulkModuleAction(event.target.value as typeof bulkModuleAction)}
                    className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white"
                  >
                    <option value="publish">Опублікувати</option>
                    <option value="unpublish">Зняти з публікації</option>
                    <option value="delete">Видалити</option>
                  </select>
                  <button
                    type="button"
                    onClick={applyBulkModuleAction}
                    disabled={selectedModuleIds.length === 0 || isPending}
                    className="focus-ring w-full rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 lg:w-auto"
                  >
                    {pendingKey === "module:bulk" ? "Застосовую..." : "Застосувати"}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-500">
                  <input
                    type="checkbox"
                    checked={allModulesSelected}
                    onChange={(event) => toggleAllModules(event.target.checked)}
                    className="size-4 rounded border-white/20 bg-white/5"
                  />
                  Увесь каталог
                </label>
              </div>
            </section>
          ) : null}

          <div className="space-y-4 xl:hidden">
            {brands.map((brand) => renderBrandCard(brand))}
          </div>

          <div className="hidden xl:grid xl:grid-cols-2 xl:items-start xl:gap-4">
            {brandColumns.map((column, index) => (
              <div key={index} className="space-y-4">
                {column.map((brand) => renderBrandCard(brand))}
              </div>
            ))}
          </div>
        </>
      )}

      {isPending && !pendingKey ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Застосовую зміни...
        </div>
      ) : null}
    </div>
  );
}
