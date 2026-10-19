import Link from "next/link";
import { ArrowRight, Compass, Layers3, Sparkles, SwatchBook } from "lucide-react";
import { BrandsCatalogExplorer } from "@/components/brands/BrandsCatalogExplorer";
import { PortalShell } from "@/components/PortalShell";
import { requireAuthPageUser } from "@/lib/guards";
import { getBrandsCatalog } from "@/lib/queries";
import { compareUkText } from "@/lib/ui";

export default async function BrandsPage() {
  const user = await requireAuthPageUser();
  const brands = await getBrandsCatalog();

  const categoriesCount = brands.reduce((sum, brand) => sum + brand.categories.length, 0);
  const modulesCount = brands.reduce(
    (sum, brand) => sum + brand.categories.reduce((categorySum, category) => categorySum + category._count.modules, 0),
    0
  );
  const newBrandsCount = brands.filter((brand) => ["harman", "whoop", "portable-power"].includes(brand.slug)).length;
  const spotlightBrand = [...brands]
    .sort(
      (left, right) =>
        right.categories.reduce((sum, category) => sum + category._count.modules, 0) -
          left.categories.reduce((sum, category) => sum + category._count.modules, 0) ||
        compareUkText(left.name, right.name) ||
        left.id - right.id
    )[0];

  const catalogBrands = brands.map((brand) => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
    logoUrl: brand.logoUrl,
    categories: brand.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      modulesCount: category._count.modules
    }))
  }));

  return (
    <PortalShell user={user}>
      <section className="card px-4 py-5 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-end">
          <div>
            <span className="portal-chip">Каталог навчання</span>
            <h1 className="portal-page-title mt-4">Бренди та напрямки</h1>
            <p className="portal-subtitle mt-4 max-w-3xl">
              Оберіть бренд, знайдіть потрібну категорію й переходьте до навчання.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { slug: "harman", label: "Harman" },
                { slug: "whoop", label: "Whoop" },
                { slug: "portable-power", label: "Портативні станції" }
              ].map((item) => (
                <Link
                  key={item.slug}
                  href={`#brand-${item.slug}`}
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 transition hover:bg-white/[0.05]"
                >
                  <Sparkles className="size-3.5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="portal-summary-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.025] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Брендів</p>
                <Compass className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-ink">{brands.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.025] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Категорій</p>
                <Layers3 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-ink">{categoriesCount}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.025] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Модулів</p>
                <SwatchBook className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-ink">{modulesCount}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.025] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Нова хвиля</p>
                <Sparkles className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-ink">{newBrandsCount}</p>
            </div>
          </div>
        </div>

        {spotlightBrand ? (
          <div className="relative mt-5 rounded-[24px] border border-white/10 bg-white/[0.025] p-4 sm:mt-6 sm:rounded-[28px] sm:p-6">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Рекомендований старт</p>
                <p className="portal-display-title-tight mt-3 text-2xl text-ink">{spotlightBrand.name}</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  Почніть із найповнішого розділу каталогу: оберіть категорію, опрацюйте матеріал і перевірте знання.
                </p>
              </div>

              <Link
                href={`/brands/${spotlightBrand.slug}`}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/[0.05]"
              >
                Відкрити бренд
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      <BrandsCatalogExplorer brands={catalogBrands} />

      <section className="card p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="inline-flex size-11 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <Sparkles className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
          </div>
          <div className="max-w-3xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Підказка</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Якщо працюєте під конкретний запит клієнта, краще заходити через бренд. Якщо потрібно освіжити аргументи
              для супутніх продажів або сервісу, паралельно використовуйте розділи “Аксесуари”, “Сервіс” і “Кредити”.
            </p>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
