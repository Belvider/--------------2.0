import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, Clock3, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { PortalShell } from "@/components/PortalShell";
import { requireAuthPageUser } from "@/lib/guards";
import { getProgressStatusLabel } from "@/lib/progress";
import { getCategoryModules } from "@/lib/queries";

type PageProps = {
  params: Promise<{ brand: string; category: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const user = await requireAuthPageUser();
  const { brand, category } = await params;
  const categoryData = await getCategoryModules(brand, category, user.id);

  if (!categoryData) {
    notFound();
  }

  const completedModules = categoryData.modules.filter((m) => m.progresses[0]?.status === "COMPLETED").length;
  const inProgressModules = categoryData.modules.filter((m) => m.progresses[0]?.status === "IN_PROGRESS").length;
  const totalDuration = categoryData.modules.reduce((sum, m) => sum + m.durationMin, 0);
  const nextModule =
    categoryData.modules.find((m) => m.progresses[0]?.status === "IN_PROGRESS") ??
    categoryData.modules.find((m) => !m.progresses[0] || m.progresses[0]?.status === "NOT_STARTED") ??
    categoryData.modules[0] ??
    null;

  return (
    <PortalShell user={user}>

      {/* ── Hero ── */}
      <section className="card px-4 py-5 sm:px-6 sm:py-6 xl:px-7 xl:py-7">
        <Link
          href={`/brands/${brand}`}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-600 transition hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {categoryData.brand.name}
        </Link>

        <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start">
          <div>
            <span className="portal-chip">Навчальна категорія</span>
            <h1 className="portal-page-title mt-4">{categoryData.name}</h1>
            <p className="portal-subtitle mt-4 max-w-3xl">{categoryData.description}</p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 text-xs font-semibold text-slate-500">
                <BookOpenCheck className="size-3.5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                {categoryData.modules.length} модулів
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 text-xs font-semibold text-slate-500">
                <Clock3 className="size-3.5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                ~{totalDuration} хв
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 text-xs font-semibold text-slate-500">
                <CheckCircle2 className="size-3.5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                {completedModules} завершено
              </span>
            </div>
          </div>

          {/* Stat-картки — уніфікований стиль */}
          <div className="portal-summary-grid portal-summary-grid--three grid grid-cols-3 gap-3 xl:grid-cols-1">
            {[
              { label: "Модулів", value: categoryData.modules.length },
              { label: "У процесі", value: inProgressModules },
              { label: "Завершено", value: completedModules }
            ].map((stat) => (
              <div key={stat.label} className="rounded-[14px] border border-white/10 bg-white/[0.025] px-4 py-3.5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                <p className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-ink">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Наступний крок ── */}
      {nextModule && (
        <section className="card p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Наступний крок</p>
              <h2 className="mt-2 font-[var(--font-heading)] text-xl font-semibold text-white">{nextModule.title}</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                {nextModule.progresses[0]?.status === "IN_PROGRESS"
                  ? "Цей модуль уже в роботі."
                  : "Звідси починати зручно — базове входження в категорію."}
              </p>
            </div>
            <Link
              href={`/module/${nextModule.id}`}
              className="focus-ring bg-ink inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
            >
              Відкрити модуль
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* ── Список модулів ── */}
      <section className="space-y-3">
        {categoryData.modules.map((module) => {
          const progress = module.progresses[0];
          const status = progress?.status ?? "NOT_STARTED";
          const statusLabel = getProgressStatusLabel(status, progress?.progressPct ?? 0);
          const progressPct = progress?.progressPct ?? 0;

          return (
            <article key={module.id} className="card p-4 hover-glow sm:p-5">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px] xl:items-center">

                {/* Ліво: назва + мета + прогрес */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                        status === "COMPLETED"
                          ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.1)] text-[color:var(--brand-strong)]"
                          : status === "IN_PROGRESS"
                            ? "border-white/10 bg-white/[0.04] text-white"
                            : "border-white/[0.065] bg-white/[0.015] text-slate-500"
                      }`}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {module.durationMin} хв
                    </span>
                  </div>

                  <h2 className="mt-3 font-[var(--font-heading)] text-lg font-semibold leading-tight text-white sm:text-xl">
                    {module.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 line-clamp-2">{module.description}</p>

                  {/* Прогрес-бар */}
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(40,178,158,0.9),rgba(138,242,223,0.8))] transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  {progressPct > 0 && (
                    <p className="mt-1.5 text-xs text-slate-500">{progressPct}% пройдено</p>
                  )}
                </div>

                {/* Право: кнопка */}
                <div className="flex items-center justify-start xl:justify-end">
                  <Link
                    href={`/module/${module.id}`}
                    className="focus-ring bg-ink inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
                  >
                    <PlayCircle className="size-4" aria-hidden="true" />
                    {status === "IN_PROGRESS" ? "Продовжити" : status === "COMPLETED" ? "Переглянути" : "Почати"}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>

    </PortalShell>
  );
}
