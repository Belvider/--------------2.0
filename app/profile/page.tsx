import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  FileBadge2,
  Flame,
  GraduationCap,
  LineChart,
  Target,
  TrendingUp,
  XCircle
} from "lucide-react";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { AssignedModulesSection } from "@/components/assignments/AssignedModulesSection";
import { ProfileIdentityCard } from "@/components/profile/ProfileIdentityCard";
import { PortalShell } from "@/components/PortalShell";
import { requireAuthPageUser } from "@/lib/guards";
import { getProfileData } from "@/lib/queries";
import { formatDate } from "@/lib/ui";
import { getActivityDay, getActivityStreak } from "@/lib/activity-days";

function pluralizeUk(value: number, one: string, few: string, many: string) {
  const mod10 = value % 10, mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function formatMinutes(m: number) {
  if (m < 60) return `${m} хв`;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return min > 0 ? `${h}г ${min}хв` : `${h} год`;
}

export default async function ProfilePage() {
  const currentUser = await requireAuthPageUser();
  const profile = await getProfileData(currentUser.id);

  if (!profile.user) return null;

  const today = getActivityDay();
  const streak = getActivityStreak(profile.activityDays.map((item) => item.day), today);

  // Групування прогресу по брендах
  const brandGroups = new Map<string, {
    brandName: string;
    brandSlug: string;
    total: number;
    completed: number;
    inProgress: number;
    totalMinutes: number;
    completedMinutes: number;
    lastActivity: string | null;
  }>();

  for (const learningModule of profile.publishedModules) {
    const key = learningModule.category.brand.slug;
    const ex = brandGroups.get(key) ?? {
      brandName: learningModule.category.brand.name,
      brandSlug: key,
      total: 0, completed: 0, inProgress: 0,
      totalMinutes: 0, completedMinutes: 0,
      lastActivity: null
    };
    ex.total += 1;
    ex.totalMinutes += learningModule.durationMin;
    brandGroups.set(key, ex);
  }
  for (const entry of profile.progressList) {
    const key = entry.module.category.brand.slug;
    const ex = brandGroups.get(key);
    if (!ex || !entry.module.isPublished) continue;
    if (entry.status === "COMPLETED") { ex.completed += 1; ex.completedMinutes += entry.module.durationMin; }
    if (entry.status === "IN_PROGRESS") ex.inProgress += 1;
    const entryDate = entry.lastSeenAt ? getActivityDay(entry.lastSeenAt) : null;
    if (entryDate && (!ex.lastActivity || entryDate > ex.lastActivity)) ex.lastActivity = entryDate;
    brandGroups.set(key, ex);
  }

  const sortedBrands = [...brandGroups.values()].sort((a, b) => b.completed - a.completed || b.total - a.total);

  // Останні 5 завершених модулів
  const recentCompleted = profile.progressList
    .filter((e) => e.status === "COMPLETED")
    .sort((a, b) => {
      const aDate = a.completedAt?.getTime() ?? 0;
      const bDate = b.completedAt?.getTime() ?? 0;
      return bDate - aDate;
    })
    .slice(0, 5);

  // Останні тест-спроби
  const recentAttempts = [...profile.attempts]
    .sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())
    .slice(0, 6);

  return (
    <PortalShell user={currentUser}>
      <ProfileIdentityCard user={profile.user} />

      {/* ════════════════════════════════════════
          СТАТИСТИКА — 4 + streak
      ════════════════════════════════════════ */}
      <section className="portal-summary-grid portal-profile-stats grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {
            icon: GraduationCap,
            label: "Завершено модулів",
            value: profile.stats.completedModules,
            sub: `${profile.certificates.length} ${pluralizeUk(profile.certificates.length, "сертифікат", "сертифікати", "сертифікатів")}`,
            accent: false
          },
          {
            icon: LineChart,
            label: "Середній бал",
            value: profile.stats.testedModules > 0 ? `${profile.stats.avgScore}%` : "—",
            sub: profile.stats.testedModules > 0 ? `${profile.stats.testedModules} модулів` : "немає спроб",
            accent: profile.stats.avgScore >= 80
          },
          {
            icon: Target,
            label: "Pass rate",
            value: profile.stats.testedModules > 0 ? `${profile.stats.passRate}%` : "—",
            sub: "кращі спроби",
            accent: profile.stats.passRate >= 80
          },
          {
            icon: Clock3,
            label: "Час навчання",
            value: profile.stats.totalMinutes >= 60
              ? `${Math.floor(profile.stats.totalMinutes / 60)}г ${profile.stats.totalMinutes % 60 > 0 ? `${profile.stats.totalMinutes % 60}хв` : ""}`
              : `${profile.stats.totalMinutes} хв`,
            sub: "навчального контенту",
            accent: false
          }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="card p-4 sm:p-5">
              <div className={`inline-flex size-9 items-center justify-center rounded-[10px] border ${
                stat.accent
                  ? "border-[rgba(40,178,158,0.25)] bg-[rgba(40,178,158,0.12)]"
                  : "border-white/10 bg-white/[0.03]"
              }`}>
                <Icon className={`size-4 ${stat.accent ? "text-[color:var(--brand-strong)]" : "text-[color:var(--brand-strong)]"}`} aria-hidden="true" />
              </div>
              <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
              <p className="mt-2 font-[var(--font-heading)] text-4xl font-semibold text-ink">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.sub}</p>
            </article>
          );
        })}

        {/* Streak card */}
        <article className={`card p-4 sm:p-5 ${streak >= 3 ? "border-[rgba(230,191,114,0.2)]" : ""}`}>
          <div className={`inline-flex size-9 items-center justify-center rounded-[10px] border ${
            streak >= 3 ? "border-[rgba(230,191,114,0.25)] bg-[rgba(230,191,114,0.12)]" : "border-white/10 bg-white/[0.03]"
          }`}>
            <Flame className={`size-4 ${streak >= 3 ? "text-[#e6bf72]" : "text-slate-500"}`} aria-hidden="true" />
          </div>
          <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500">Streak</p>
          <p className="mt-2 font-[var(--font-heading)] text-4xl font-semibold text-ink">{streak}</p>
          <p className="mt-1 text-xs text-slate-500">
            {streak === 0 ? "Немає активних днів" : streak === 1 ? "активний день" : `${pluralizeUk(streak, "день", "дні", "днів")} поспіль`}
          </p>
        </article>
      </section>

      {/* ════════════════════════════════════════
          ПРИЗНАЧЕННЯ
      ════════════════════════════════════════ */}
      <AssignedModulesSection
        label="Навчальні завдання"
        title="Призначені модулі"
        subtitle="Модулі призначені персонально або через відділ."
        emptyText="Активних призначень зараз немає."
        assignments={profile.assignments}
        summary={profile.assignmentSummary}
      />

      {/* ════════════════════════════════════════
          АКТИВНІСТЬ HEATMAP + ОСТАННЯ АКТИВНІСТЬ
      ════════════════════════════════════════ */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_0.6fr]">
        <article className="card p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Активність</p>
          </div>
          <ActivityHeatmap activityDays={profile.activityDays} totalDays={84} today={today} />
        </article>

        <article className="card p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpenCheck className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Останні завершення</p>
          </div>
          {recentCompleted.length > 0 ? (
            <div className="space-y-2.5">
              {recentCompleted.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/module/${entry.moduleId}`}
                  className="focus-ring group flex items-start gap-3 rounded-[12px] border border-white/[0.065] bg-white/[0.02] p-3 transition hover:border-[rgba(40,178,158,0.15)]"
                >
                  <CheckCircle2 className="mt-0.5 size-4 flex-none text-[color:var(--brand-strong)]" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white group-hover:text-[color:var(--brand-strong)]">
                      {entry.module.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {entry.module.category.brand.name} · {entry.completedAt ? formatDate(entry.completedAt) : "—"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Ще нічого не завершено.</p>
          )}
        </article>
      </section>

      {/* ════════════════════════════════════════
          ПРОГРЕС ПО БРЕНДАХ — детальний
      ════════════════════════════════════════ */}
      <section className="card p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate-500">Прогрес навчання</p>
            <h2 className="mt-1 font-[var(--font-heading)] text-xl font-semibold text-white">По брендах</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1 text-[11px] font-semibold text-slate-500">
            {sortedBrands.length} брендів
          </span>
        </div>

        {sortedBrands.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sortedBrands.map((brand) => {
              const pct = brand.total > 0 ? Math.round((brand.completed / brand.total) * 100) : 0;
              const isDone = pct === 100;
              return (
                <Link
                  key={brand.brandSlug}
                  href={`/brands/${brand.brandSlug}`}
                  className="focus-ring group rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-[rgba(40,178,158,0.2)] hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-[var(--font-heading)] text-base font-semibold text-white group-hover:text-[color:var(--brand-strong)] transition">
                      {brand.brandName}
                    </p>
                    {isDone && (
                      <CheckCircle2 className="size-4 flex-none text-[color:var(--brand-strong)]" aria-hidden="true" />
                    )}
                  </div>

                  {/* Прогрес бар */}
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDone
                          ? "bg-[linear-gradient(90deg,rgba(40,178,158,0.95),rgba(138,242,223,0.85))]"
                          : pct >= 50
                            ? "bg-[linear-gradient(90deg,rgba(40,178,158,0.7),rgba(138,242,223,0.6))]"
                            : "bg-[rgba(40,178,158,0.45)]"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Метаданні */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                    <span className={`font-bold ${isDone ? "text-[color:var(--brand-strong)]" : "text-white"}`}>
                      {pct}%
                    </span>
                    <span className="text-slate-500">{brand.completed}/{brand.total} модулів</span>
                    {brand.inProgress > 0 && (
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-300">
                        {brand.inProgress} в процесі
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-600">
                    <span>{formatMinutes(brand.completedMinutes)} навчання</span>
                    {brand.lastActivity && (
                      <span>· {brand.lastActivity}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[12px] border border-white/[0.065] bg-white/[0.02] px-4 py-8 text-center">
            <p className="text-sm text-slate-500">Ще немає пройдених модулів.</p>
            <Link href="/brands" className="focus-ring mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(40,178,158,0.22)] bg-[rgba(40,178,158,0.1)] px-4 py-2 text-sm font-semibold text-[color:var(--brand-strong)]">
              Відкрити каталог
            </Link>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          ТЕСТИ + СЕРТИФІКАТИ + БЕЙДЖІ
      ════════════════════════════════════════ */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">

        {/* Історія тестів */}
        <article className="card p-4 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="inline-flex size-9 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
              <BarChart3 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate-500">Тестування</p>
              <h2 className="mt-0.5 text-base font-semibold text-white">Остання активність</h2>
            </div>
          </div>

          {recentAttempts.length > 0 ? (
            <div className="space-y-2">
              {recentAttempts.map((attempt) => (
                <div key={attempt.id} className={`flex items-center gap-3 rounded-[10px] border px-3 py-2.5 ${
                  attempt.passed
                    ? "border-[rgba(40,178,158,0.15)] bg-[rgba(40,178,158,0.05)]"
                    : "border-white/[0.065] bg-white/[0.02]"
                }`}>
                  {attempt.passed
                    ? <CheckCircle2 className="size-4 flex-none text-[color:var(--brand-strong)]" aria-hidden="true" />
                    : <XCircle className="size-4 flex-none text-slate-500" aria-hidden="true" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white">{attempt.module.title}</p>
                    <p className="text-[10px] text-slate-500">{formatDate(attempt.attemptedAt)}</p>
                  </div>
                  <span className={`flex-none rounded-full border px-2 py-0.5 text-xs font-bold ${
                    attempt.passed
                      ? "border-[rgba(40,178,158,0.25)] bg-[rgba(40,178,158,0.1)] text-[color:var(--brand-strong)]"
                      : "border-white/10 bg-white/[0.025] text-slate-400"
                  }`}>
                    {attempt.score}%
                  </span>
                </div>
              ))}

              {profile.stats.testedModules > 0 && (
                <div className="mt-3 rounded-[10px] border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Середній бал</span>
                    <span className="font-bold text-white">{profile.stats.avgScore}%</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-[rgba(40,178,158,0.8)]" style={{ width: `${profile.stats.avgScore}%` }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Тести ще не здавались.</p>
          )}
        </article>

        {/* Сертифікати */}
        <article className="card p-4 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="inline-flex size-9 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
              <FileBadge2 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate-500">Офіційні результати</p>
              <h2 className="mt-0.5 text-base font-semibold text-white">Сертифікати</h2>
            </div>
          </div>

          <div className="space-y-2">
            {profile.certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificate/${cert.id}`}
                className="focus-ring flex items-center gap-3 rounded-[10px] border border-[rgba(40,178,158,0.15)] bg-[rgba(40,178,158,0.05)] px-3 py-2.5 transition hover:border-[rgba(40,178,158,0.3)] hover:bg-[rgba(40,178,158,0.09)]"
              >
                <CheckCircle2 className="size-4 flex-none text-[color:var(--brand-strong)]" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">{cert.module.title}</p>
                  <p className="text-[10px] text-slate-500">{formatDate(cert.issuedAt)}</p>
                </div>
                <span className="text-[10px] font-semibold text-[color:var(--brand-strong)]">→</span>
              </Link>
            ))}
            {profile.certificates.length === 0 && (
              <p className="text-sm text-slate-500">Сертифікатів поки немає. Пройдіть модуль і здайте тест.</p>
            )}
          </div>
        </article>

        {/* Бейджі */}
        <article className="card p-4 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="inline-flex size-9 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
              <Award className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate-500">Визнання</p>
              <h2 className="mt-0.5 text-base font-semibold text-white">Бейджі</h2>
            </div>
          </div>

          {profile.badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((entry) => (
                <span
                  key={entry.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(230,191,114,0.22)] bg-[rgba(230,191,114,0.1)] px-3 py-1.5 text-sm font-semibold text-[#e6bf72]"
                >
                  {entry.badge.icon && <span aria-hidden="true">{entry.badge.icon}</span>}
                  {entry.badge.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">Бейджів ще немає.</p>
              <div className="rounded-[12px] border border-white/[0.065] bg-white/[0.02] p-3">
                <p className="text-[11px] font-semibold text-slate-400">Як отримати бейдж?</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  Завершіть перший модуль, пройдіть тест або досягніть 100% по бренду — система видасть бейдж автоматично.
                </p>
              </div>
            </div>
          )}
        </article>
      </section>

    </PortalShell>
  );
}
