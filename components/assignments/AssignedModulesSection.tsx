import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarClock, ClipboardList } from "lucide-react";
import { formatDate } from "@/lib/ui";

type AssignedModulesSectionProps = {
  title: string;
  label: string;
  subtitle: string;
  emptyText: string;
  maxItems?: number;
  assignments: Array<{
    id: number;
    moduleId: number;
    title: string;
    description: string;
    durationMin: number;
    dueAt: string | Date | null;
    required: boolean;
    note: string | null;
    brand: { name: string; slug: string };
    category: { name: string; slug: string };
    progress: {
      status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
      progressPct: number;
      completedAt: string | Date | null;
    };
    isCompleted: boolean;
    isOverdue: boolean;
    isDueSoon: boolean;
  }>;
  summary: {
    total: number;
    required: number;
    completed: number;
    open: number;
    overdue: number;
    dueSoon: number;
  };
};

function StatusDot({ isCompleted, isOverdue, isDueSoon }: { isCompleted: boolean; isOverdue: boolean; isDueSoon: boolean }) {
  if (isCompleted) return <span className="size-2 rounded-full bg-[color:var(--brand-strong)]" />;
  if (isOverdue) return <span className="size-2 animate-pulse rounded-full bg-rose-400" />;
  if (isDueSoon) return <span className="size-2 rounded-full bg-amber-400" />;
  return <span className="size-2 rounded-full bg-white/20" />;
}

export function AssignedModulesSection({
  title,
  label,
  subtitle,
  emptyText,
  maxItems,
  assignments,
  summary
}: AssignedModulesSectionProps) {
  const visibleAssignments = maxItems ? assignments.slice(0, maxItems) : assignments;
  const hasMore = maxItems && assignments.length > maxItems;

  return (
    <article className="card p-4 sm:p-6">
      {/* Заголовок */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
            <ClipboardList className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <h2 className="mt-0.5 font-[var(--font-heading)] text-lg font-semibold text-white">{title}</h2>
          </div>
        </div>

        {/* Компактні лічильники */}
        <div className="flex items-center gap-2">
          {summary.overdue > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-300">
              <AlertTriangle className="size-3" aria-hidden="true" />
              {summary.overdue}
            </span>
          )}
          {summary.dueSoon > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-300">
              <CalendarClock className="size-3" aria-hidden="true" />
              {summary.dueSoon}
            </span>
          )}
          <span className="rounded-full border border-white/10 bg-white/[0.025] px-2.5 py-1 text-[11px] font-semibold text-slate-500">
            {summary.open} відкритих
          </span>
        </div>
      </div>

      {/* Список призначень */}
      <div className="mt-4 space-y-2">
        {visibleAssignments.map((assignment) => {
          const progressPct = assignment.progress.progressPct;

          return (
            <div
              key={assignment.id}
              className={`group flex items-center gap-3 rounded-[12px] border px-4 py-3 transition hover:-translate-y-[1px] ${
                assignment.isCompleted
                  ? "border-[rgba(40,178,158,0.15)] bg-[rgba(40,178,158,0.04)]"
                  : assignment.isOverdue
                    ? "border-rose-500/15 bg-rose-500/5"
                    : assignment.isDueSoon
                      ? "border-amber-500/15 bg-amber-500/5"
                      : "border-white/[0.065] bg-white/[0.02]"
              }`}
            >
              {/* Статус-крапка */}
              <div className="flex-none pt-0.5">
                <StatusDot
                  isCompleted={assignment.isCompleted}
                  isOverdue={assignment.isOverdue}
                  isDueSoon={assignment.isDueSoon}
                />
              </div>

              {/* Назва + мета */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{assignment.title}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                  <span>{assignment.brand.name}</span>
                  <span>·</span>
                  <span>{assignment.durationMin} хв</span>
                  {assignment.dueAt && !assignment.isCompleted && (
                    <>
                      <span>·</span>
                      <span className={assignment.isOverdue ? "text-rose-300" : assignment.isDueSoon ? "text-amber-300" : ""}>
                        {assignment.isOverdue ? "!" : ""} {formatDate(assignment.dueAt)}
                      </span>
                    </>
                  )}
                  {assignment.isCompleted && assignment.progress.completedAt && (
                    <>
                      <span>·</span>
                      <span className="text-[color:var(--brand-strong)]">Виконано {formatDate(assignment.progress.completedAt)}</span>
                    </>
                  )}
                </div>

                {/* Прогрес-бар — тонкий, під текстом */}
                {!assignment.isCompleted && progressPct > 0 && (
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(40,178,158,0.8),rgba(138,242,223,0.7))]"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                )}
              </div>

              {/* CTA */}
              <Link
                href={`/module/${assignment.moduleId}`}
                className="focus-ring inline-flex flex-none items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition group-hover:border-[rgba(40,178,158,0.2)] group-hover:text-[color:var(--brand-strong)]"
              >
                {assignment.isCompleted ? "Переглянути" : assignment.progress.status === "IN_PROGRESS" ? "Продовжити" : "Відкрити"}
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          );
        })}

        {visibleAssignments.length === 0 && (
          <p className="rounded-[12px] border border-white/[0.065] bg-white/[0.02] px-4 py-5 text-sm text-slate-500">
            {emptyText}
          </p>
        )}

        {hasMore && (
          <p className="pt-1 text-center text-xs text-slate-500">
            Ще {assignments.length - maxItems!} призначень · перейдіть на{" "}
            <Link href="/profile" className="text-[color:var(--brand-strong)] hover:underline">
              Профіль
            </Link>{" "}
            щоб побачити всі
          </p>
        )}
      </div>
    </article>
  );
}
