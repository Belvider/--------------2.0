import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FolderOpen, Layers3, Sparkles, Store } from "lucide-react";
import { notFound } from "next/navigation";
import { PortalShell } from "@/components/PortalShell";
import { getBrandVisual } from "@/lib/brand-visuals";
import { requireAuthPageUser } from "@/lib/guards";
import { getBrandBySlug } from "@/lib/queries";

type PageProps = {
  params: Promise<{ brand: string }>;
};

export default async function BrandPage({ params }: PageProps) {
  const user = await requireAuthPageUser();
  const { brand: brandSlug } = await params;
  const brand = await getBrandBySlug(brandSlug);

  if (!brand) {
    notFound();
  }

  const brandVisual = getBrandVisual(brand.slug, brand.logoUrl);
  const modulesCount = brand.categories.reduce((sum, category) => sum + category._count.modules, 0);
  const featuredCategory = [...brand.categories].sort((left, right) => right._count.modules - left._count.modules)[0] ?? null;

  return (
    <PortalShell user={user}>
      <section className="card px-4 py-5 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
        <div>
          <Link href="/brands" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-500">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Усі бренди
          </Link>

          <div className="mt-5 grid gap-5 xl:grid-cols-[240px_minmax(0,1fr)_300px] xl:items-center">
            <div className="relative min-h-[160px] overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.025] sm:min-h-[190px]">
              <Image
                src={brandVisual.src}
                alt={`Прев'ю бренду ${brand.name}`}
                fill
                sizes="240px"
                className={brandVisual.headerImageClassName ?? "object-contain p-4"}
              />
            </div>

            <div>
              <span className="portal-chip">Брендовий розділ</span>
              <h1 className="portal-page-title mt-4">{brand.name}</h1>
              <p className="portal-subtitle mt-4 max-w-3xl">{brand.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {brand.categories.slice(0, 4).map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="portal-summary-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[14px] border border-white/10 bg-white/[0.025] px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Підкатегорій</p>
                <p className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-ink">{brand.categories.length}</p>
              </div>
              <div className="rounded-[14px] border border-white/10 bg-white/[0.025] px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Модулів</p>
                <p className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-ink">{modulesCount}</p>
              </div>
              <div className="portal-summary-note rounded-[14px] border border-white/10 bg-white/[0.025] px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Фокус</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {featuredCategory ? `${featuredCategory.name} · ${featuredCategory._count.modules} мод.` : "Каталог бренду"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {brand.categories.map((category) => (
          <article key={category.id} className="card flex h-full flex-col p-4 hover-glow sm:p-6">
            <div className="flex h-full flex-col">
              <div className="min-h-[4.75rem] sm:min-h-[5.75rem]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Підкатегорія</p>
                    <h2 className="portal-display-title mt-3 text-2xl text-ink">{category.name}</h2>
                  </div>
                  <div className="inline-flex size-11 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[color:var(--brand-strong)]">
                    <FolderOpen className="size-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <p className="mt-3 min-h-0 text-sm leading-7 text-slate-600 sm:min-h-[6.5rem]">{category.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[14px] border border-white/10 bg-white/[0.02] px-3 py-3">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Модулів</p>
                  <p className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-ink">{category._count.modules}</p>
                </div>
                <div className="rounded-[14px] border border-white/10 bg-white/[0.02] px-3 py-3">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Формат</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <Layers3 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                    Курс
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-5">
                <Link
                  href={`/brands/${brand.slug}/${category.slug}`}
                  className="focus-ring bg-ink inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
                >
                  Відкрити підкатегорію
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_0.8fr]">
        <article className="card p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="inline-flex size-11 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Sparkles className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div className="max-w-3xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Як працювати з брендом</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Найкращий маршрут тут простий: обираємо потрібну підкатегорію, проходимо базовий модуль, потім закріплюємо
                аргументи через сценарії продажу. Так бренд сприймається не як список товарів, а як зручна консультаційна система.
              </p>
            </div>
          </div>
        </article>

        <article className="card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Store className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Швидкий вхід</p>
              <h2 className="portal-display-title mt-1 text-2xl text-ink">Рекомендований старт</h2>
            </div>
          </div>

          {featuredCategory ? (
            <div className="mt-5 rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
              <p className="portal-display-title-tight text-xl text-slate-100">{featuredCategory.name}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{featuredCategory.description}</p>
              <Link
                href={`/brands/${brand.slug}/${featuredCategory.slug}`}
                className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
              >
                Відкрити першою
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </article>
      </section>
    </PortalShell>
  );
}
