import type { ComponentProps } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Circle, FileText, Layers3 } from "lucide-react";
import { PortalShell } from "@/components/PortalShell";

type PortalArticleSection = {
  id: string;
  title: string;
  html: string;
};

type PortalArticlePageData = {
  label: string;
  title: string;
  subtitle: string;
  sideLabel: string;
  sideText: string;
  sections: PortalArticleSection[];
};

type PortalArticlePageProps = {
  user: ComponentProps<typeof PortalShell>["user"];
  page: PortalArticlePageData;
  backHref: ComponentProps<typeof Link>["href"];
  backLabel: string;
  sectionContentClassName: string;
};

export function PortalArticlePage({
  user,
  page,
  backHref,
  backLabel,
  sectionContentClassName
}: PortalArticlePageProps) {
  return (
    <PortalShell user={user}>

      {/* ── Hero ── */}
      <section id="top" className="card px-4 py-5 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
        <Link
          href={backHref}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-600 transition hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </Link>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end">
          <div>
            <span className="portal-chip">{page.label}</span>
            <h1 className="portal-page-title mt-4">{page.title}</h1>
            <p className="portal-subtitle mt-4 max-w-3xl">{page.subtitle}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm">
                <Layers3 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                <span className="font-semibold text-white">{page.sections.length}</span>
                <span className="text-slate-500">розділів</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-500">
                <FileText className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                Повний затверджений матеріал
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{page.sideLabel}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{page.sideText}</p>
          </div>
        </div>
      </section>

      {/* ── Контент: структура як ModuleViewer ── */}
      <div className="grid gap-3 sm:gap-4 2xl:grid-cols-[minmax(0,1fr)_220px] 2xl:items-start">

        {/* Головний контент — один card з усіма секціями (як у ModuleViewer) */}
        <div className="card min-w-0 space-y-0 p-4 sm:p-6">
          {page.sections.map((section, index) => (
            <div
              key={section.id}
              id={section.id}
              className={`scroll-mt-6 ${index > 0 ? "border-t border-white/[0.07] pt-7 mt-7" : ""}`}
            >
              {/* Заголовок секції — ідентично ModuleViewer block title */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h2
                  className="font-[var(--font-heading)] text-[1.9rem] font-semibold tracking-[-0.03em] text-[color:var(--brand-strong)] sm:text-3xl"
                  style={{ lineHeight: "1.02" }}
                >
                  {section.title}
                </h2>
                <a
                  href="#top"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] px-3 py-1.5 text-xs text-slate-500 transition hover:text-slate-300"
                >
                  До початку
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </div>

              {/* HTML контент — точно як у ModuleViewer rich-text */}
              <div className={`mt-5 ${sectionContentClassName}`} dangerouslySetInnerHTML={{ __html: section.html }} />
            </div>
          ))}
        </div>

        {/* Sticky sidebar — як у ModuleViewer */}
        <aside className="card h-fit p-3.5 sm:p-4 2xl:sticky 2xl:top-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Розділи</p>

          <div className="mt-3 grid gap-1.5">
            {page.sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="module-nav-page module-nav-page-idle focus-ring"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[12px] border border-white/8 bg-white/[0.03]">
                    <Circle className="size-4 text-slate-500" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{section.title}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">Розділ {index + 1}</span>
                  </span>
                </span>
              </a>
            ))}
          </div>

          {/* Підказка */}
          <div className="mt-4 rounded-[16px] border border-white/[0.07] bg-white/[0.02] p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Матеріал</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Читайте зручним темпом. Зміст фіксований і доступний у будь-який час.
            </p>
          </div>
        </aside>

      </div>

    </PortalShell>
  );
}
