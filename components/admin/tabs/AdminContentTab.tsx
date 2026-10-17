"use client";

import { getRequestError } from "@/lib/http-client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import { BookPlus, Building2, FolderKanban, ImagePlus, LayoutTemplate } from "lucide-react";
import { AdminContentTree, type AdminContentBrandRow } from "@/components/admin/AdminContentTree";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { AdminPortalPagesTree } from "@/components/admin/AdminPortalPagesTree";
import type { PortalPageContent, PortalPageSlug } from "@/lib/portal-pages";

type PortalPage = {
  slug: PortalPageSlug;
  path: string;
  adminLabel: string;
  description: string;
  content: PortalPageContent;
};

type AdminContentTabProps = {
  role: Role;
  initialBrands: AdminContentBrandRow[];
  portalPages: PortalPage[];
  onNotice: (msg: string) => void;
};

export function AdminContentTab({ role, initialBrands, portalPages, onNotice }: AdminContentTabProps) {
  const router = useRouter();
  const [brandRows, setBrandRows] = useState(initialBrands);
  const [categoryBrandId, setCategoryBrandId] = useState(initialBrands[0] ? String(initialBrands[0].id) : "");
  const [moduleBrandId, setModuleBrandId] = useState(initialBrands[0] ? String(initialBrands[0].id) : "");
  const [moduleCategoryId, setModuleCategoryId] = useState(
    initialBrands[0]?.categories[0] ? String(initialBrands[0].categories[0].id) : ""
  );
  const [newBrandLogoUrl, setNewBrandLogoUrl] = useState("");
  const [newModuleImageUrl, setNewModuleImageUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => { setBrandRows(initialBrands); }, [initialBrands]);

  useEffect(() => {
    const b = brandRows.find((b) => String(b.id) === moduleBrandId);
    if (!b) return;
    const hasSelected = b.categories.some((c) => String(c.id) === moduleCategoryId);
    if (!hasSelected) setModuleCategoryId(b.categories[0] ? String(b.categories[0].id) : "");
  }, [brandRows, moduleBrandId, moduleCategoryId]);

  const moduleCategories = useMemo(
    () => brandRows.find((b) => String(b.id) === moduleBrandId)?.categories ?? [],
    [brandRows, moduleBrandId]
  );

  const totalCategories = brandRows.reduce((s, b) => s + b.categoryCount, 0);
  const totalModules = brandRows.reduce((s, b) => s + b.moduleCount, 0);

  async function createBrand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCreating) return;
    try {
      setIsCreating(true);
      const form = event.currentTarget;
      const fd = new FormData(form);
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          entity: "brand",
          name: String(fd.get("name") ?? ""),
          slug: String(fd.get("slug") ?? ""),
          logoUrl: String(fd.get("logoUrl") ?? ""),
          description: String(fd.get("description") ?? "")
        })
      });
      const data = (await res.json()) as { brand?: { id: number; name: string }; error?: string };
      if (!res.ok || !data.brand) { onNotice(data.error ?? "Помилка"); return; }
      onNotice(`Бренд «${data.brand.name}» додано`);
      form.reset();
      setNewBrandLogoUrl("");
      if (!categoryBrandId) setCategoryBrandId(String(data.brand.id));
      if (!moduleBrandId) setModuleBrandId(String(data.brand.id));
      router.refresh();
    } catch (requestError) {
      onNotice(getRequestError(requestError));
    } finally {
      setIsCreating(false);
    }
  }

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCreating) return;
    try {
      setIsCreating(true);
      const form = event.currentTarget;
      const fd = new FormData(form);
      const brandId = Number(fd.get("brandId"));
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          entity: "category",
          brandId,
          name: String(fd.get("name") ?? ""),
          slug: String(fd.get("slug") ?? ""),
          description: String(fd.get("description") ?? "")
        })
      });
      const data = (await res.json()) as { category?: { id: number; name: string }; error?: string };
      if (!res.ok || !data.category) { onNotice(data.error ?? "Помилка"); return; }
      onNotice(`Категорію «${data.category.name}» додано`);
      setModuleBrandId(String(brandId));
      setModuleCategoryId(String(data.category.id));
      form.reset();
      router.refresh();
    } catch (requestError) {
      onNotice(getRequestError(requestError));
    } finally {
      setIsCreating(false);
    }
  }

  async function createModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCreating) return;
    try {
      setIsCreating(true);
      const form = event.currentTarget;
      const fd = new FormData(form);
      const categoryId = Number(fd.get("categoryId"));
      const introText = String(fd.get("introText") ?? "").trim();
      const facts = String(fd.get("facts") ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
      const videoUrl = String(fd.get("videoUrl") ?? "").trim();
      const imageUrl = String(fd.get("imageUrl") ?? "").trim();
      const imageCaption = String(fd.get("imageCaption") ?? "").trim();
      const pdfUrl = String(fd.get("pdfUrl") ?? "").trim();
  
      const payload: Record<string, unknown> = {
        entity: "module",
        categoryId,
        title: String(fd.get("title") ?? "").trim(),
        description: String(fd.get("description") ?? "").trim(),
        durationMin: Number(fd.get("durationMin"))
      };
      if (introText) payload.introText = introText;
      if (facts.length) payload.facts = facts;
      if (videoUrl) payload.videoUrl = videoUrl;
      if (imageUrl) payload.imageUrl = imageUrl;
      if (imageCaption) payload.imageCaption = imageCaption;
      if (pdfUrl) payload.pdfUrl = pdfUrl;
  
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await res.json()) as { module?: { id: number; title: string }; error?: string };
      if (!res.ok || !data.module) { onNotice(data.error ?? "Помилка"); return; }
      onNotice(`Чернетку модуля «${data.module.title}» створено`);
      form.reset();
      setNewModuleImageUrl("");
      router.refresh();
    } catch (requestError) {
      onNotice(getRequestError(requestError));
    } finally {
      setIsCreating(false);
    }
  }

  const inputCls = "focus-ring rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="mt-6 space-y-5">
      {/* Статистика */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Бренди", value: brandRows.length },
          { label: "Категорії", value: totalCategories },
          { label: "Модулі", value: totalModules },
          { label: "Тип доступу", value: role === "ADMIN" ? "Повний" : "Перегляд" }
        ].map((s) => (
          <div key={s.label} className="rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{s.label}</p>
            <p className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Portal pages */}
      <section className="rounded-[14px] border border-white/10 bg-white/[0.025] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
              <LayoutTemplate className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Сторінки порталу</p>
              <h3 className="mt-0.5 font-[var(--font-heading)] text-base font-semibold text-white">Сервіс, кредити та аксесуари</h3>
            </div>
          </div>
          {role === "ADMIN" && (
            <Link href="/admin/media" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-ink">
              <ImagePlus className="size-4" aria-hidden="true" />
              Медіабібліотека
            </Link>
          )}
        </div>
        <div className="mt-5">
          <AdminPortalPagesTree role={role} pages={portalPages} />
        </div>
      </section>

      {role === "ADMIN" ? (
        <div className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
            {/* Новий бренд */}
            <section className="rounded-[14px] border border-white/10 bg-white/[0.025] p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex size-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
                  <BookPlus className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Створення</p>
                  <h3 className="font-[var(--font-heading)] text-base font-semibold text-white">Новий бренд</h3>
                </div>
              </div>
              <form onSubmit={createBrand} className="grid gap-3">
                <input name="name" placeholder="Назва бренду" required className={inputCls} />
                <input name="slug" placeholder="slug" required className={inputCls} />
                <AdminImageField value={newBrandLogoUrl} onChange={setNewBrandLogoUrl} folder="brands" placeholder="URL логотипа" helperText="Завантажте логотип у медіабібліотеку і вставте URL." />
                <input type="hidden" name="logoUrl" value={newBrandLogoUrl} />
                <textarea name="description" placeholder="Короткий опис бренду" required rows={3} className={inputCls} />
                <button type="submit" disabled={isCreating} className="focus-ring rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white">Додати бренд</button>
              </form>
            </section>

            {/* Нова категорія */}
            <section className="rounded-[14px] border border-white/10 bg-white/[0.025] p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex size-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
                  <Building2 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Створення</p>
                  <h3 className="font-[var(--font-heading)] text-base font-semibold text-white">Нова категорія</h3>
                </div>
              </div>
              <form onSubmit={createCategory} className="grid gap-3">
                <select name="brandId" value={categoryBrandId} onChange={(e) => setCategoryBrandId(e.target.value)} className={inputCls}>
                  {brandRows.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <input name="name" placeholder="Назва категорії" required className={inputCls} />
                <input name="slug" placeholder="slug" required className={inputCls} />
                <textarea name="description" placeholder="Опис категорії" required rows={3} className={inputCls} />
                <button type="submit" disabled={isCreating} className="focus-ring rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white">Додати категорію</button>
              </form>
            </section>
          </div>

          {/* Новий модуль */}
          <section className="rounded-[14px] border border-white/10 bg-white/[0.025] p-5">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
                  <FolderKanban className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Створення</p>
                  <h3 className="font-[var(--font-heading)] text-base font-semibold text-white">Новий модуль</h3>
                </div>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1 text-[10px] font-semibold text-slate-500">Без ручного JSON</span>
            </div>
            <p className="mb-4 text-sm leading-6 text-slate-400">Новий модуль зберігається як чернетка. Наповніть його в редакторі та ввімкніть «Опубліковано», щоб відкрити доступ працівникам.</p>
            <form onSubmit={createModule} className="grid gap-3 lg:grid-cols-2">
              <select value={moduleBrandId} onChange={(e) => setModuleBrandId(e.target.value)} className={inputCls}>
                {brandRows.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <select name="categoryId" value={moduleCategoryId} onChange={(e) => setModuleCategoryId(e.target.value)} required disabled={!moduleCategories.length} className={inputCls + " disabled:opacity-50"}>
                {moduleCategories.length ? moduleCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>) : <option value="">Немає категорій</option>}
              </select>
              <input name="title" placeholder="Назва модуля" required className={inputCls + " lg:col-span-2"} />
              <textarea name="description" placeholder="Короткий опис" required rows={3} className={inputCls + " lg:col-span-2"} />
              <input name="durationMin" type="number" min={1} defaultValue={18} required className={inputCls} />
              <input name="videoUrl" placeholder="Відео URL (опц.)" className={inputCls} />
              <textarea name="introText" placeholder="Основний текст" rows={5} className={inputCls + " lg:col-span-2"} />
              <textarea name="facts" placeholder="Ключові факти (кожен з нового рядка)" rows={4} className={inputCls} />
              <div className="grid gap-3">
                <AdminImageField value={newModuleImageUrl} onChange={setNewModuleImageUrl} folder="modules" placeholder="Зображення URL (опц.)" helperText="Використайте медіабібліотеку для завантаження зображень." />
                <input type="hidden" name="imageUrl" value={newModuleImageUrl} />
                <input name="imageCaption" placeholder="Підпис до зображення (опц.)" className={inputCls} />
                <input name="pdfUrl" placeholder="PDF URL (опц.)" className={inputCls} />
              </div>
              <button type="submit" disabled={isCreating || !moduleCategories.length} className="focus-ring w-full rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 lg:col-span-2">Створити модуль</button>
            </form>
          </section>
        </div>
      ) : (
        <div className="rounded-[14px] border border-white/10 bg-white/[0.025] px-4 py-4 text-sm text-slate-600">
          Створення контенту доступне лише адміністраторам.
        </div>
      )}

      <AdminContentTree role={role} brands={brandRows} />
    </div>
  );
}
