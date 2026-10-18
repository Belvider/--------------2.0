import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenCheck, ChevronRight, Clock3, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { PortalShell } from "@/components/PortalShell";
import { ModuleViewer } from "@/components/module/ModuleViewer";
import { requireAuthPageUser } from "@/lib/guards";
import { parseModuleContentBlocks } from "@/lib/module-content";
import { getProgressStatusLabel } from "@/lib/progress";
import { getModuleDetails } from "@/lib/queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ModulePage({ params }: PageProps) {
  const user = await requireAuthPageUser();
  const { id } = await params;
  const moduleId = Number(id);

  if (!Number.isSafeInteger(moduleId) || moduleId <= 0 || moduleId > 2147483647) {
    notFound();
  }

  const learningModule = await getModuleDetails(moduleId, user.id);

  if (!learningModule) {
    notFound();
  }

  const blocks = parseModuleContentBlocks(learningModule.contentBlocks);
  const progress = learningModule.progresses[0];
  const progressPct = progress?.progressPct ?? 0;
  const hasQuiz = learningModule.questions.length > 0;
  const canTakeQuiz = progressPct >= 100 || progress?.status === "COMPLETED";
  const lastAttempt = learningModule.attempts[0] ?? null;
  const progressStatusLabel = getProgressStatusLabel(progress?.status ?? "NOT_STARTED", progressPct);

  return (
    <PortalShell user={user}>
      <section className="card px-4 py-5 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
        <div>
          <nav aria-label="Хлібні крихти" className="breadcrumb">
            <Link href="/brands" className="breadcrumb-link">Бренди</Link>
            <ChevronRight className="breadcrumb-sep size-3.5" aria-hidden="true" />
            <Link href={`/brands/${learningModule.category.brand.slug}`} className="breadcrumb-link">
              {learningModule.category.brand.name}
            </Link>
            <ChevronRight className="breadcrumb-sep size-3.5" aria-hidden="true" />
            <Link href={`/brands/${learningModule.category.brand.slug}/${learningModule.category.slug}`} className="breadcrumb-link">
              {learningModule.category.name}
            </Link>
          </nav>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
            <div className="max-w-4xl">
              <span className="portal-chip">Навчальний матеріал</span>
              <h1 className="portal-page-title mt-3">{learningModule.title}</h1>
              <p className="portal-subtitle mt-3 max-w-3xl">{learningModule.description}</p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5">
                  <Clock3 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  {learningModule.durationMin} хв
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5">
                  <Layers3 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  Тем: {blocks.length}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5">
                  <BookOpenCheck className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  {hasQuiz ? `Запитань у тесті: ${learningModule.questions.length}` : "Самостійне опрацювання"}
                </span>
              </div>

              <div className="mt-5 rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                  <span>Переглянуто матеріалу</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(40,178,158,0.95),rgba(138,242,223,0.88))]"
                    style={{ width: `${progressPct}%` }}
                    role="progressbar"
                    aria-label="Переглянуто матеріалу"
                    aria-valuenow={progressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {progressStatusLabel}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {hasQuiz && (
                <div className="rounded-[14px] border border-white/10 bg-white/[0.025] p-5">
                  <h2 className="font-[var(--font-heading)] text-lg font-semibold text-white">Перевірка знань</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {canTakeQuiz ? "Матеріал переглянуто. Перевірте, як ви застосовуєте знання на практиці." : "Опрацюйте всі розділи матеріалу, щоб відкрити підсумковий тест."}
                  </p>
                  {lastAttempt && (
                    <p className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-300">
                      Останній результат: <strong className="text-white">{lastAttempt.score}%</strong>
                      <span className="mt-1 block text-slate-400">{lastAttempt.passed ? "Тест складено" : "Тест ще не складено"}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                <Link
                  href={`/brands/${learningModule.category.brand.slug}/${learningModule.category.slug}`}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  До категорії
                </Link>

                {hasQuiz && (canTakeQuiz ? (
                  <Link
                    href={`/module/${learningModule.id}/quiz`}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,rgba(40,178,158,0.96),rgba(15,78,67,0.96))] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(6,95,82,0.32)] transition hover:brightness-105"
                  >
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    Перейти до тесту
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-500">
                    <Sparkles className="size-4" aria-hidden="true" />
                    Спочатку опрацюйте матеріал
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModuleViewer moduleId={learningModule.id} blocks={blocks} initialProgressPct={progress?.progressPct ?? 0} hasQuiz={learningModule.questions.length > 0} />
    </PortalShell>
  );
}
