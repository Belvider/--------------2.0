import type { Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Flame,
  GraduationCap,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
  Zap
} from "lucide-react";
import { AssignedModulesSection } from "@/components/assignments/AssignedModulesSection";
import { OnboardingModal } from "@/components/OnboardingModal";
import { PortalShell } from "@/components/PortalShell";
import { ProgressRing } from "@/components/ProgressRing";
import { requireAuthPageUser } from "@/lib/guards";
import { getDashboardData } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/ui";

function getGreetingName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fullName;
  if (parts.length === 1) return parts[0];
  if (parts.length >= 3) return parts[1];
  const [first, second] = parts;
  const likelySurnamePattern = /(енко|єнко|чук|щук|нюк|юк|ук|як|ик|ко|ський|зький|цький|ов|ова|ев|єв|ін|іна|ин)$/i;
  return likelySurnamePattern.test(first) && !likelySurnamePattern.test(second) ? second : first;
}

function pluralizeUk(value: number, one: string, few: string, many: string) {
  const mod10 = value % 10, mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function formatLearningMinutes(totalMinutes: number) {
  if (totalMinutes <= 0) return "0 хв";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} хв`;
  if (minutes === 0) return `${hours} год`;
  return `${hours} год ${minutes} хв`;
}

function formatProjection(days: number | null) {
  if (days === null) return "формується";
  if (days <= 0) return "закрито";
  if (days < 7) return `≈ ${days} ${pluralizeUk(days, "день", "дні", "днів")}`;
  if (days < 30) { const w = Math.ceil(days / 7); return `≈ ${w} ${pluralizeUk(w, "тиждень", "тижні", "тижнів")}`; }
  const m = Math.ceil(days / 30); return `≈ ${m} ${pluralizeUk(m, "місяць", "місяці", "місяців")}`;
}

const DAY_LABELS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

export default async function DashboardPage() {
  const user = await requireAuthPageUser();

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [data, weeklyProgress] = await Promise.all([
    getDashboardData(user.id),
    prisma.userProgress.findMany({
      where: { userId: user.id, lastSeenAt: { gte: sevenDaysAgo } },
      select: { lastSeenAt: true, completedAt: true, status: true, module: { select: { durationMin: true } } }
    })
  ]);

  // Будуємо дані для 7-денного графіку
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const dayOfWeek = (d.getDay() + 6) % 7; // Mon=0
    const active = weeklyProgress.filter((p) =>
      p.lastSeenAt?.toISOString().slice(0, 10) === iso ||
      p.completedAt?.toISOString().slice(0, 10) === iso
    );
    const completed = active.filter((p) => p.completedAt?.toISOString().slice(0, 10) === iso).length;
    const minutes = active.reduce((s, p) => s + p.module.durationMin, 0);
    return { iso, dayLabel: DAY_LABELS_SHORT[dayOfWeek], active: active.length, completed, minutes, isToday: iso === now.toISOString().slice(0, 10) };
  });

  const maxDayActive = Math.max(...dailyData.map((d) => d.active), 1);
  const weeklyActivedays = dailyData.filter((d) => d.active > 0).length;

  // Завжди використовуємо getGreetingName — вона правильно визначає ім'я
  // з українського формату "Прізвище Ім'я По-батькові"
  const firstName = getGreetingName(user.name);
  const modulesLeft = Math.max(data.totalModules - data.completedModules, 0);
  const leaderboardPosition = data.leaderboard.findIndex((row) => row.userId === user.id);
  const overdueAssignment = data.assignments.find((a) => a.isOverdue && !a.isCompleted) ?? null;
  const dueSoonAssignment = data.assignments.find((a) => a.isDueSoon && !a.isCompleted) ?? null;
  const nextOpenAssignment = data.assignments.find((a) => !a.isCompleted) ?? null;
  const riskCount = data.assignmentSummary.overdue + data.assignmentSummary.dueSoon;

  const paceLabel = data.completedLast30Days >= 4 || data.activeDaysLast14 >= 6 ? "Стабільний" :
    data.completedLast30Days >= 1 || data.activeDaysLast14 >= 3 ? "Можна підсилити" : "Просідає";

  const primaryAction = overdueAssignment
    ? { href: `/module/${overdueAssignment.moduleId}` as Route, label: "Прострочено — закрити першим", sublabel: overdueAssignment.title, tone: "rose" as const }
    : data.continueModule
      ? { href: `/module/${data.continueModule.id}` as Route, label: `${data.continueModuleProgress}% пройдено — продовжити`, sublabel: data.continueModule.title, tone: "teal" as const }
      : dueSoonAssignment
        ? { href: `/module/${dueSoonAssignment.moduleId}` as Route, label: "Скоро дедлайн — взяти в роботу", sublabel: dueSoonAssignment.title, tone: "amber" as const }
        : nextOpenAssignment
          ? { href: `/module/${nextOpenAssignment.moduleId}` as Route, label: "Наступне призначення", sublabel: nextOpenAssignment.title, tone: "teal" as const }
          : { href: "/brands" as Route, label: "Відкрити каталог навчання", sublabel: `${data.totalModules} модулів по ${data.leaderboard.length > 0 ? "всіх" : ""} напрямках`, tone: "slate" as const };

  const toneRing = {
    rose: "border-rose-500/25 bg-rose-500/[0.08]",
    amber: "border-amber-500/25 bg-amber-500/[0.08]",
    teal: "border-[rgba(40,178,158,0.25)] bg-[rgba(40,178,158,0.08)]",
    slate: "border-white/10 bg-white/[0.025]"
  }[primaryAction.tone];

  const priorities: Array<{ title: string; description: string; href: Route; cta: string; meta: string; tone: "rose"|"amber"|"teal"|"slate" }> = [];
  if (overdueAssignment) priorities.push({ title: "Закрити прострочене", description: overdueAssignment.title, href: `/module/${overdueAssignment.moduleId}` as Route, cta: "Відкрити", meta: overdueAssignment.dueAt ? `Дедлайн: ${formatDate(overdueAssignment.dueAt)}` : "Потрібно закрити", tone: "rose" });
  if (data.continueModule) priorities.push({ title: data.continueModuleProgress >= 70 ? "Добити — майже готово" : "Повернутись до модуля", description: data.continueModule.title, href: `/module/${data.continueModule.id}` as Route, cta: "Продовжити", meta: `${data.continueModuleProgress}% · ще ${formatLearningMinutes(data.continueModuleRemainingMin)}`, tone: "teal" });
  if (dueSoonAssignment && dueSoonAssignment.moduleId !== overdueAssignment?.moduleId) priorities.push({ title: "Підхопити до дедлайну", description: dueSoonAssignment.title, href: `/module/${dueSoonAssignment.moduleId}` as Route, cta: "Взяти", meta: dueSoonAssignment.dueAt ? formatDate(dueSoonAssignment.dueAt) : "Скоро", tone: "amber" });
  if (priorities.length < 3 && !data.continueModule && nextOpenAssignment) priorities.push({ title: "Стартувати наступне", description: nextOpenAssignment.title, href: `/module/${nextOpenAssignment.moduleId}` as Route, cta: "Почати", meta: `${nextOpenAssignment.durationMin} хв · ${nextOpenAssignment.brand.name}`, tone: "teal" });
  while (priorities.length < 3) priorities.push({ title: "Рівномірний ритм — ключ", description: "15–20 хв регулярно дають кращий результат, ніж рідкі тривалі сесії.", href: "/brands" as Route, cta: "Каталог", meta: "1 модуль за сесію", tone: "slate" });

  return (
    <PortalShell user={user}>
      {data.completedModules === 0 && data.activeDaysLast14 === 0 && (
        <OnboardingModal firstName={firstName} totalModules={data.totalModules} userId={user.id} />
      )}

      {/* ════════════════════════════════════════
          HERO — вітання + прогрес + головна дія
      ════════════════════════════════════════ */}
      <section className="card px-4 py-6 sm:px-6 sm:py-8 xl:px-8 animate-fadeUp">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">

          {/* Ліво */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="portal-chip">Дашборд</span>
              {riskCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-[11px] font-bold text-rose-300">
                  {riskCount} потребує уваги
                </span>
              )}
              {weeklyActivedays >= 4 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(230,191,114,0.25)] bg-[rgba(230,191,114,0.1)] px-3 py-1 text-[11px] font-bold text-[#e6bf72]">
                  <Flame className="size-3" aria-hidden="true" />
                  {weeklyActivedays} днів цього тижня
                </span>
              )}
            </div>

            <h1 className="portal-page-title mt-4">Привіт, {firstName}</h1>
            <p className="portal-subtitle mt-2 max-w-xl">
              {overdueAssignment
                ? `Є прострочений модуль «${overdueAssignment.title}» — краще закрити зараз.`
                : data.continueModule
                  ? `Поточний модуль «${data.continueModule.title}» пройдено на ${data.continueModuleProgress}%.`
                  : `${data.completedModules} модулів завершено з ${data.totalModules}. Залишилось ${modulesLeft}.`}
            </p>

            {/* Головна дія */}
            <Link
              href={primaryAction.href}
              className={`focus-ring group mt-5 inline-flex w-full items-center gap-3 rounded-[16px] border p-4 transition hover:-translate-y-[2px] sm:max-w-md ${toneRing}`}
            >
              <div className={`flex size-10 flex-none items-center justify-center rounded-[10px] border ${
                primaryAction.tone === "rose" ? "border-rose-500/30 bg-rose-500/15 text-rose-300"
                : primaryAction.tone === "amber" ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                : primaryAction.tone === "teal" ? "border-[rgba(40,178,158,0.3)] bg-[rgba(40,178,158,0.15)] text-[color:var(--brand-strong)]"
                : "border-white/10 bg-white/[0.04] text-slate-400"
              }`}>
                <BookOpenCheck className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{primaryAction.label}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-white">{primaryAction.sublabel}</p>
              </div>
              <ArrowRight className="size-4 flex-none text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-[color:var(--brand-strong)]" aria-hidden="true" />
            </Link>

            {/* Швидкі метрики */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: GraduationCap, label: "Завершено", value: `${data.completedModules}`, sub: `з ${data.totalModules}` },
                { icon: BarChart3, label: "Середній бал", value: data.averageQuizScore !== null ? `${data.averageQuizScore}%` : "—", sub: data.quizAttemptsCount > 0 ? `${data.quizAttemptsCount} спроб` : "ще попереду" },
                { icon: Clock3, label: "Час навчання", value: formatLearningMinutes(data.learnedMinutes), sub: `залишилось ${formatLearningMinutes(data.remainingMinutes)}` },
                { icon: Trophy, label: "Позиція", value: leaderboardPosition >= 0 ? `#${leaderboardPosition + 1}` : "—", sub: leaderboardPosition >= 0 ? "у команді" : "поза топом" }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-[12px] border border-white/[0.07] bg-white/[0.025] px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <Icon className="size-3.5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                    </div>
                    <p className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-ink">{stat.value}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{stat.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Право: прогрес-кільце */}
          <div className="hidden w-[240px] flex-none rounded-[16px] border border-white/10 bg-white/[0.025] p-5 xl:block">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Загальний прогрес</p>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                paceLabel === "Стабільний" ? "border-[rgba(40,178,158,0.25)] bg-[rgba(40,178,158,0.1)] text-[color:var(--brand-strong)]" :
                paceLabel === "Можна підсилити" ? "border-amber-500/20 bg-amber-500/10 text-amber-300" :
                "border-rose-500/20 bg-rose-500/10 text-rose-300"
              }`}>{paceLabel}</span>
            </div>
            <div className="mt-4 flex justify-center">
              <ProgressRing value={data.progressPct} size={160} stroke={11} />
            </div>
            <Link
              href={data.continueModule ? `/module/${data.continueModule.id}` : "/brands"}
              className="focus-ring bg-ink mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
            >
              {data.continueModule ? "Продовжити" : "До каталогу"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WELCOME STATE
      ════════════════════════════════════════ */}
      {data.completedModules === 0 && data.quizAttemptsCount === 0 && data.totalModules > 0 && (
        <section className="card p-5 sm:p-7 animate-fadeUp" style={{ animationDelay: "60ms" }}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(40,178,158,0.22)] bg-[rgba(40,178,158,0.1)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                <Sparkles className="size-3" aria-hidden="true" />
                Починаємо
              </span>
              <h2 className="mt-4 font-[var(--font-heading)] text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Ласкаво просимо до навчального порталу
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { n: 1, icon: BookOpenCheck, t: "Оберіть бренд", s: "Apple, Dyson, Garmin і ще 8 напрямків" },
                  { n: 2, icon: Clock3, t: "Пройдіть модуль", s: "Середній час: 15–30 хвилин" },
                  { n: 3, icon: GraduationCap, t: "Складіть тест і отримайте сертифікат", s: "Прохідний бал 70%" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.n} className="rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-[7px] border border-[rgba(40,178,158,0.25)] bg-[rgba(40,178,158,0.12)] text-sm font-bold text-[color:var(--brand-strong)]">{item.n}</span>
                        <Icon className="size-4 text-slate-400" aria-hidden="true" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-white">{item.t}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.s}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <Link href="/brands" className="focus-ring bg-ink inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold">
              Відкрити каталог <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════
          ПРИЗНАЧЕННЯ
      ════════════════════════════════════════ */}
      {data.assignments.length > 0 && (
        <div className="animate-fadeUp" style={{ animationDelay: "100ms" }}>
          <AssignedModulesSection
            label="Призначене навчання"
            title="Що потрібно пройти"
            subtitle="Модулі призначені персонально або через відділ."
            emptyText="Активних призначень поки немає."
            maxItems={3}
            assignments={data.assignments}
            summary={data.assignmentSummary}
          />
        </div>
      )}

      {/* ════════════════════════════════════════
          ПЛАН + ТИЖНЕВА АКТИВНІСТЬ
      ════════════════════════════════════════ */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.25fr)_0.75fr] animate-fadeUp" style={{ animationDelay: "180ms" }}>

        {/* Пріоритети */}
        <article className="card p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <Target className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">План дій</p>
          </div>
          <h2 className="font-[var(--font-heading)] text-xl font-semibold text-white">Що зробити зараз</h2>

          <div className="mt-5 space-y-2.5">
            {priorities.map((p, i) => {
              const toneClasses = {
                rose: "border-rose-500/20 bg-rose-500/[0.06]",
                amber: "border-amber-500/20 bg-amber-500/[0.06]",
                teal: "border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.06)]",
                slate: "border-white/[0.065] bg-white/[0.015]"
              }[p.tone];
              const numClasses = {
                rose: "border-rose-500/25 bg-rose-500/15 text-rose-300",
                amber: "border-amber-500/25 bg-amber-500/15 text-amber-300",
                teal: "border-[rgba(40,178,158,0.3)] bg-[rgba(40,178,158,0.14)] text-[color:var(--brand-strong)]",
                slate: "border-white/10 bg-white/[0.04] text-slate-500"
              }[p.tone];
              return (
                <div key={`${p.title}-${i}`} className={`group flex items-center gap-3 rounded-[14px] border p-3.5 transition hover:-translate-y-[1px] ${toneClasses}`}>
                  <span className={`flex size-6 flex-none items-center justify-center rounded-full border text-[10px] font-bold ${numClasses}`}>{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{p.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">{p.description}</p>
                  </div>
                  <div className="flex-none text-right">
                    <p className="text-[10px] text-slate-500">{p.meta}</p>
                    <Link
                      href={p.href}
                      className="focus-ring mt-1 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-slate-300 transition hover:bg-white/[0.07]"
                    >
                      {p.cta} <ArrowRight className="size-2.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        {/* Тижнева активність + аналітика */}
        <div className="space-y-4">

          {/* 7-денний графік */}
          <article className="card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Цей тиждень</p>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {weeklyActivedays}/7 днів
              </span>
            </div>

            {/* Бари */}
            <div className="mt-4 flex items-end gap-1.5" style={{ height: 64 }}>
              {dailyData.map((day) => {
                const heightPct = day.active > 0 ? Math.max(20, Math.round((day.active / maxDayActive) * 100)) : 8;
                return (
                  <div key={day.iso} className="flex flex-1 flex-col items-center gap-1.5">
                    <div
                      className={`w-full rounded-[4px] transition-all ${
                        day.isToday
                          ? "bg-[rgba(40,178,158,0.9)]"
                          : day.active > 0
                            ? "bg-[rgba(40,178,158,0.45)]"
                            : "bg-white/[0.06]"
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`${day.iso}: ${day.active} активностей, ${day.completed} завершено`}
                    />
                    <span className={`text-[9px] font-semibold ${day.isToday ? "text-[color:var(--brand-strong)]" : "text-slate-600"}`}>
                      {day.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4">
              <div>
                <p className="text-[10px] text-slate-500">Завершено</p>
                <p className="mt-0.5 font-[var(--font-heading)] text-xl font-semibold text-ink">{data.completedLast7Days}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">За 30 днів</p>
                <p className="mt-0.5 font-[var(--font-heading)] text-xl font-semibold text-ink">{data.completedLast30Days}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Прогноз</p>
                <p className="mt-0.5 font-[var(--font-heading)] text-base font-semibold text-ink">{formatProjection(data.projectedCompletionDays)}</p>
              </div>
            </div>
          </article>

          {/* Ключові показники */}
          <article className="card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Показники</p>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Середній бал тестів",
                  value: data.averageQuizScore !== null ? `${data.averageQuizScore}%` : "—",
                  sub: data.quizAttemptsCount > 0 ? `${data.quizAttemptsCount} спроб` : "тести попереду",
                  pct: data.averageQuizScore
                },
                {
                  label: "Активність (14 днів)",
                  value: `${data.activeDaysLast14}/14`,
                  sub: `${Math.round((data.activeDaysLast14 / 14) * 100)}% покриття`,
                  pct: Math.round((data.activeDaysLast14 / 14) * 100)
                },
                {
                  label: "Завершено каталогу",
                  value: `${data.progressPct}%`,
                  sub: `${modulesLeft} ${pluralizeUk(modulesLeft, "модуль", "модулі", "модулів")} залишилось`,
                  pct: data.progressPct
                }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(40,178,158,0.8),rgba(138,242,223,0.7))]"
                      style={{ width: `${item.pct ?? 0}%`, transition: "width 0.5s ease" }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-600">{item.sub}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* ════════════════════════════════════════
          НОВІ МАТЕРІАЛИ + РЕЙТИНГ
      ════════════════════════════════════════ */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2 animate-fadeUp" style={{ animationDelay: "260ms" }}>

        {/* Нові матеріали */}
        <article className="card p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Свіжий контент</p>
            </div>
            <Link href="/brands" className="focus-ring text-xs font-semibold text-[color:var(--brand-strong)]">
              Каталог →
            </Link>
          </div>
          <h2 className="mt-2 font-[var(--font-heading)] text-xl font-semibold text-white">Нові матеріали</h2>

          <div className="mt-4 space-y-2">
            {data.newMaterials.slice(0, 5).map((module) => (
              <Link
                key={module.id}
                href={`/module/${module.id}`}
                className="focus-ring group flex items-center gap-3 rounded-[12px] border border-white/[0.065] bg-white/[0.02] p-3 transition hover:border-[rgba(40,178,158,0.15)] hover:bg-white/[0.04]"
              >
                <div className="flex size-10 flex-none items-center justify-center rounded-[8px] border border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.08)] text-xs font-bold text-[color:var(--brand-strong)]">
                  {module.durationMin}м
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{module.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{module.category.brand.name} · {module.category.name}</p>
                </div>
                <ArrowRight className="size-3.5 flex-none text-slate-600 group-hover:text-[color:var(--brand-strong)]" aria-hidden="true" />
              </Link>
            ))}
            {data.newMaterials.length === 0 && (
              <p className="rounded-[12px] border border-white/[0.065] bg-white/[0.02] px-4 py-5 text-sm text-slate-500">
                Нових матеріалів поки немає.
              </p>
            )}
          </div>
        </article>

        {/* Рейтинг */}
        <article className="card p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Команда</p>
            </div>
            {leaderboardPosition >= 0 && (
              <span className="rounded-full border border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.08)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--brand-strong)]">
                Ви #{leaderboardPosition + 1}
              </span>
            )}
          </div>
          <h2 className="mt-2 font-[var(--font-heading)] text-xl font-semibold text-white">Рейтинг</h2>

          <ol className="mt-4 space-y-1.5">
            {data.leaderboard.slice(0, 8).map((row, index) => {
              const isMe = row.userId === user.id;
              const isFirst = index === 0;
              return (
                <li
                  key={row.userId}
                  className={`flex items-center gap-3 rounded-[12px] border px-3 py-2.5 ${
                    isMe ? "border-[rgba(40,178,158,0.22)] bg-[rgba(40,178,158,0.07)]" : "border-white/[0.065] bg-white/[0.015]"
                  }`}
                >
                  <div className={`flex size-7 flex-none items-center justify-center rounded-[7px] border text-[11px] font-bold ${
                    isFirst ? "border-[rgba(230,191,114,0.3)] bg-[rgba(230,191,114,0.12)] text-[#e6bf72]" :
                    isMe ? "border-[rgba(40,178,158,0.3)] bg-[rgba(40,178,158,0.14)] text-[color:var(--brand-strong)]" :
                    "border-white/10 bg-white/[0.025] text-slate-500"
                  }`}>
                    {isFirst ? "🥇" : index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{row.name}{isMe ? " · Ви" : ""}</p>
                    <p className="text-[10px] text-slate-500">{row.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-[var(--font-heading)] text-base font-semibold text-ink">{row.completed}</p>
                    {row.avgScore !== null && (
                      <p className="text-[10px] text-slate-500">{row.avgScore}%</p>
                    )}
                  </div>
                </li>
              );
            })}
            {data.leaderboard.length === 0 && (
              <li className="rounded-[12px] border border-white/[0.065] bg-white/[0.02] px-4 py-5 text-sm text-slate-500">
                Поки немає даних
              </li>
            )}
          </ol>
        </article>
      </section>

    </PortalShell>
  );
}
