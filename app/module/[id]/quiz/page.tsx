import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgressStatus } from "@prisma/client";
import { ArrowLeft, Award, BookOpenCheck, ChevronRight, ShieldCheck } from "lucide-react";
import { PortalShell } from "@/components/PortalShell";
import { ModuleQuiz } from "@/components/module/ModuleQuiz";
import { requireAuthPageUser } from "@/lib/guards";
import { getModuleDetails } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { parseQuizRules } from "@/lib/quiz";
import { formatDate } from "@/lib/ui";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ModuleQuizPage({ params }: PageProps) {
  const user = await requireAuthPageUser();
  const { id } = await params;
  const moduleId = Number(id);

  if (!Number.isSafeInteger(moduleId) || moduleId <= 0 || moduleId > 2147483647) {
    notFound();
  }

  const [module, quizRulesSetting] = await Promise.all([
    getModuleDetails(moduleId, user.id),
    prisma.appSetting.findUnique({ where: { key: "quiz_rules" } })
  ]);

  if (!module) {
    notFound();
  }

  const progress = module.progresses[0];
  const quizRules = parseQuizRules(quizRulesSetting?.value);
  const canTakeQuiz = (progress?.progressPct ?? 0) >= 100 || progress?.status === ProgressStatus.COMPLETED;
  const lastAttempt = module.attempts[0] ?? null;

  return (
    <PortalShell user={user}>
      <section className="card px-5 py-6 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
        <div>
          <nav aria-label="Хлібні крихти" className="breadcrumb">
            <Link href="/brands" className="breadcrumb-link">Бренди</Link>
            <ChevronRight className="breadcrumb-sep size-3.5" aria-hidden="true" />
            <Link href={`/brands/${module.category.brand.slug}`} className="breadcrumb-link">
              {module.category.brand.name}
            </Link>
            <ChevronRight className="breadcrumb-sep size-3.5" aria-hidden="true" />
            <Link href={`/brands/${module.category.brand.slug}/${module.category.slug}`} className="breadcrumb-link">
              {module.category.name}
            </Link>
            <ChevronRight className="breadcrumb-sep size-3.5" aria-hidden="true" />
            <Link href={`/module/${module.id}`} className="breadcrumb-link">
              {module.title}
            </Link>
            <ChevronRight className="breadcrumb-sep size-3.5" aria-hidden="true" />
            <span className="text-slate-700">Тест</span>
          </nav>

          <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
            <div className="max-w-3xl">
              <span className="portal-chip">Перевірка знань</span>
              <h1 className="portal-page-title mt-4">Тест за модулем</h1>
              <p className="portal-subtitle mt-4">
                Перевірте, як ви застосовуєте матеріал у консультації. Якщо потрібно освіжити знання, поверніться до теми перед початком тесту.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5">
                  <BookOpenCheck className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  {module.questions.length} питань
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5">
                  <ShieldCheck className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  Прохідний бал: {quizRules.passScore}%
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-4 shadow-soft">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Готовність модуля</p>
                <p className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-ink">{progress?.progressPct ?? 0}%</p>
                <p className="mt-2 text-sm text-slate-600">
                  {canTakeQuiz ? "Матеріал завершено, можна проходити тест." : "Спершу потрібно дочитати всі блоки модуля."}
                </p>
              </div>

              <Link
                href={`/module/${module.id}`}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Повернутися до матеріалу
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-[14px] border border-white/10 bg-white/[0.025] px-4 py-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Прохідний бал</p>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-ink">{quizRules.passScore}%</p>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-white/[0.025] px-4 py-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Макс. спроб</p>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-ink">{quizRules.maxAttempts}</p>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-white/[0.025] px-4 py-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Остання спроба</p>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-ink">
                {lastAttempt ? `${lastAttempt.score}%` : "—"}
              </p>
              <p className="mt-2 text-sm text-slate-600">{lastAttempt ? formatDate(lastAttempt.attemptedAt) : "Ще немає історії"}</p>
            </div>
          </div>
        </div>
      </section>

      {!canTakeQuiz ? (
        <section className="card p-5 sm:p-6">
          <h2 className="portal-display-title text-2xl text-ink">Спершу завершіть матеріал</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Тест відкривається після перегляду всіх блоків модуля. Поверніться до матеріалу, завершіть вивчення і після цього
            переходьте до перевірки знань.
          </p>
          <Link
            href={`/module/${module.id}`}
            className="focus-ring mt-4 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Повернутися до модуля
          </Link>
        </section>
      ) : module.questions.length === 0 ? (
        <section className="card p-5 sm:p-6">
          <h2 className="portal-display-title text-2xl text-ink">Тест ще не додано</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Для цього модуля поки немає налаштованих питань. Матеріал можна проходити, а блок перевірки знань додамо окремо.
          </p>
        </section>
      ) : (
        <ModuleQuiz
          moduleId={module.id}
          passScore={quizRules.passScore}
          questions={module.questions.map((question) => ({
            id: question.id,
            question: question.question,
            type: question.type,
            options: question.options
          }))}
        />
      )}

      {module.attempts.length > 0 && (
        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
                <Award className="size-4.5 text-[color:var(--brand-strong)]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Попередні спроби</p>
                <h2 className="mt-0.5 text-base font-semibold text-white">Історія тестування</h2>
              </div>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-slate-500">
              {module.attempts.length} спроб
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {module.attempts.map((attempt, index) => {
              const isBest = attempt.score === Math.max(...module.attempts.map((a) => a.score));
              return (
                <div
                  key={attempt.id}
                  className={`flex items-center gap-4 rounded-[14px] border px-4 py-3.5 ${
                    attempt.passed
                      ? "border-[rgba(40,178,158,0.15)] bg-[rgba(40,178,158,0.05)]"
                      : "border-white/[0.07] bg-white/[0.02]"
                  }`}
                >
                  <span className="w-6 text-center text-[11px] font-semibold text-slate-500">
                    #{module.attempts.length - index}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">{formatDate(attempt.attemptedAt)}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {attempt.passed ? "Зараховано" : "Не зараховано"}
                      {isBest && module.attempts.length > 1 ? " · Найкращий результат" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isBest && module.attempts.length > 1 && (
                      <span className="hidden rounded-full border border-[rgba(230,191,114,0.2)] bg-[rgba(230,191,114,0.08)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e6bf72] sm:inline-flex">
                        Рекорд
                      </span>
                    )}
                    <span className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
                      attempt.passed
                        ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)] text-[color:var(--brand-strong)]"
                        : "border-white/10 bg-white/[0.04] text-slate-400"
                    }`}>
                      {attempt.score}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </PortalShell>
  );
}
