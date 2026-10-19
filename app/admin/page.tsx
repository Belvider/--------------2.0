import Link from "next/link";
import type { Route } from "next";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookCopy,
  Clock3,
  Download,
  FolderKanban,
  GraduationCap,
  LayoutGrid,
  Shield,
  ShieldAlert,
  Target,
  Users2
} from "lucide-react";
import { requireAdminOrManagerPageUser } from "@/lib/guards";
import { getAdminOverview } from "@/lib/queries";
import { formatDate } from "@/lib/ui";

export default async function AdminPage() {
  await requireAdminOrManagerPageUser();
  const overview = await getAdminOverview();

  const activeShare = overview.usersCount > 0
    ? Math.round((overview.activeUsersCount / overview.usersCount) * 100)
    : 0;
  const completionShare = overview.totalProgressRecords > 0
    ? Math.round((overview.completed / overview.totalProgressRecords) * 100)
    : 0;

  const actionItems = [
    {
      key: "overdue",
      title: "Прострочені призначення",
      count: overview.actionCenter.overdueAssignmentsCount,
      sub: `${overview.actionCenter.overdueLearnersCount} людей`,
      href: "/admin/assignments",
      icon: AlertTriangle,
      tone: "rose" as const
    },
    {
      key: "dueSoon",
      title: "Скоро дедлайни",
      count: overview.actionCenter.dueSoonAssignmentsCount,
      sub: `${overview.actionCenter.dueSoonLearnersCount} людей`,
      href: "/admin/assignments",
      icon: Clock3,
      tone: "amber" as const
    },
    {
      key: "noTests",
      title: "Модулі без тестів",
      count: overview.actionCenter.modulesWithoutQuestionsCount,
      sub: "потребують уваги",
      href: "/admin/content",
      icon: BookCopy,
      tone: "amber" as const
    },
    {
      key: "drafts",
      title: "Чернетки",
      count: overview.actionCenter.draftModulesCount,
      sub: "не опубліковано",
      href: "/admin/content",
      icon: FolderKanban,
      tone: "slate" as const
    },
    {
      key: "inactive",
      title: "Неактивні акаунти",
      count: overview.actionCenter.inactiveUsersCount,
      sub: "потрібна перевірка",
      href: "/admin/users",
      icon: Users2,
      tone: "slate" as const
    },
    {
      key: "security",
      title: "Невдалі входи",
      count: overview.actionCenter.failedLoginAttemptsLast7Days,
      sub: "за 7 днів",
      href: "/admin/audit",
      icon: ShieldAlert,
      tone: overview.actionCenter.failedLoginAttemptsLast7Days > 0 ? "rose" as const : "slate" as const
    }
  ];

  const activeSignals = actionItems.filter((i) => i.count > 0).length;

  return (
    <>
      {/* ── Заголовок ── */}
      <section className="card px-4 py-5 sm:px-6 sm:py-7 xl:px-8 xl:py-8 animate-fadeUp">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <span className="portal-chip">Огляд</span>
            <h1 className="portal-page-title mt-4">Центр керування</h1>
            <p className="portal-subtitle mt-3 max-w-2xl">
              Живий стан порталу: команда, контент, прогрес і сигнали безпеки.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="/api/admin/export"
                className="focus-ring bg-ink inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                <Download className="size-4" aria-hidden="true" />
                Експортувати CSV
              </a>
              <Link
                href="/brands"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.04]"
              >
                До каталогу
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Операційна картина */}
          <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:grid-cols-2 xl:w-64">
            {[
              { label: "Активні акаунти", value: `${activeShare}%`, sub: `${overview.activeUsersCount} / ${overview.usersCount}` },
              { label: "Завершення", value: `${completionShare}%`, sub: "треків у прогресі" },
              { label: "Нові за 30 днів", value: overview.newUsersLast30Days, sub: "нових співробітників" },
              { label: "Сигнали входу", value: overview.failedLoginAttemptsLast7Days, sub: "невдалих за 7 днів" }
            ].map((stat) => (
              <div key={stat.label} className="rounded-[14px] border border-white/10 bg-white/[0.025] px-3 py-3.5">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                <p className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-ink">{stat.value}</p>
                <p className="mt-0.5 text-xs text-slate-500">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Action Center ── */}
      <section className="card p-4 sm:p-6 animate-fadeUp" style={{ animationDelay: "100ms" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Action Center</p>
            <h2 className="mt-1 font-[var(--font-heading)] text-xl font-semibold text-white">
              Що потребує уваги
            </h2>
          </div>
          <span className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] ${
            activeSignals > 0
              ? "border-rose-500/20 bg-rose-500/10 text-rose-200"
              : "border-[rgba(40,178,158,0.22)] bg-[rgba(40,178,158,0.1)] text-[color:var(--brand-strong)]"
          }`}>
            {activeSignals > 0 ? `${activeSignals} активних` : "Все стабільно"}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {actionItems.map((item) => {
            const Icon = item.icon;
            const hasSignal = item.count > 0;
            const borderClass = hasSignal
              ? item.tone === "rose" ? "border-rose-500/20 bg-rose-500/[0.07]"
              : item.tone === "amber" ? "border-amber-500/20 bg-amber-500/[0.07]"
              : "border-white/10 bg-white/[0.025]"
              : "border-white/10 bg-white/[0.015]";

            return (
              <Link
                key={item.key}
                href={item.href as Route}
                className={`focus-ring group flex items-center gap-4 rounded-[14px] border p-4 transition hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)] ${borderClass}`}
              >
                <div className={`flex size-10 flex-none items-center justify-center rounded-[10px] border ${
                  hasSignal && item.tone === "rose" ? "border-rose-500/25 bg-rose-500/12"
                  : hasSignal && item.tone === "amber" ? "border-amber-500/25 bg-amber-500/12"
                  : "border-white/10 bg-white/[0.03]"
                }`}>
                  <Icon className={`size-4 ${
                    hasSignal && item.tone === "rose" ? "text-rose-300"
                    : hasSignal && item.tone === "amber" ? "text-amber-300"
                    : "text-[color:var(--brand-strong)]"
                  }`} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.sub}</p>
                </div>
                <div className="flex-none text-right">
                  <p className={`font-[var(--font-heading)] text-2xl font-semibold ${
                    hasSignal && item.tone === "rose" ? "text-rose-200"
                    : hasSignal && item.tone === "amber" ? "text-amber-200"
                    : "text-ink"
                  }`}>{item.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── KPI Метрики ── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-fadeUp" style={{ animationDelay: "200ms" }}>
        {[
          { label: "Всього користувачів", value: overview.usersCount, sub: `${overview.activeUsersCount} активних`, icon: Users2, href: "/admin/users" },
          { label: "Сертифікатів видано", value: overview.certificatesCount, sub: "підтверджені знання", icon: GraduationCap, href: "/admin/reports" },
          { label: "Завершено проходжень", value: overview.completed, sub: `${overview.inProgress} у процесі`, icon: LayoutGrid, href: "/admin/reports" },
          { label: "Тестових спроб", value: overview.attemptsCount, sub: `Середній бал: ${overview.averageScore}%`, icon: Target, href: "/admin/reports" },
          { label: "Брендів", value: overview.brandCount, sub: `${overview.categoryCount} категорій`, icon: FolderKanban, href: "/admin/content" },
          { label: "Модулів", value: overview.modulesCount, sub: "опубліковано", icon: BookCopy, href: "/admin/content" },
          { label: "Активність 7 днів", value: overview.failedLoginAttemptsLast7Days + overview.successfulLoginAttemptsLast7Days, sub: `${overview.successfulLoginAttemptsLast7Days} успішних`, icon: Activity, href: "/admin/audit" },
          { label: "Ролі", value: `${overview.adminsCount}A / ${overview.managersCount}M`, sub: `${overview.sellersCount} продавців`, icon: Shield, href: "/admin/users" }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href as Route}
              className="focus-ring card group flex flex-col gap-3 p-4 transition hover:-translate-y-[1px] hover:border-[rgba(40,178,158,0.15)] sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                <Icon className="size-4 flex-none text-[color:var(--brand-strong)] opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </div>
              <p className="font-[var(--font-heading)] text-2xl font-semibold text-ink sm:text-3xl">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.sub}</p>
            </Link>
          );
        })}
      </section>

      {/* ── Остання активність ── */}
      <section className="grid gap-4 xl:grid-cols-2 animate-fadeUp" style={{ animationDelay: "300ms" }}>
        <article className="card p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Activity className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              <p className="text-sm font-semibold text-white">Остання активність</p>
            </div>
            <Link href="/admin/audit" className="focus-ring text-xs font-semibold text-[color:var(--brand-strong)]">
              До аудиту
            </Link>
          </div>

          <div className="mt-4 space-y-2">
            {overview.recentActivity.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 rounded-[10px] border border-white/[0.065] bg-white/[0.02] px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{entry.user.name}</p>
                  <p className="text-xs text-slate-500">{entry.module.category.brand.name} · {entry.module.title}</p>
                </div>
                <div className="flex-none text-right">
                  <p className="text-sm font-semibold text-ink">{entry.progressPct}%</p>
                  <p className="text-[10px] text-slate-500">{formatDate(entry.lastSeenAt)}</p>
                </div>
              </div>
            ))}
            {overview.recentActivity.length === 0 && (
              <p className="rounded-[10px] border border-white/[0.065] bg-white/[0.02] px-4 py-4 text-sm text-slate-500">
                Активності поки немає
              </p>
            )}
          </div>
        </article>

        <article className="card p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Users2 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              <p className="text-sm font-semibold text-white">Нові користувачі</p>
            </div>
            <Link href="/admin/users" className="focus-ring text-xs font-semibold text-[color:var(--brand-strong)]">
              До команди
            </Link>
          </div>

          <div className="mt-4 space-y-2">
            {overview.recentUsers.slice(0, 5).map((member) => (
              <Link
                key={member.id}
                href={`/admin/users/${member.id}`}
                className="focus-ring flex items-center gap-3 rounded-[10px] border border-white/[0.065] bg-white/[0.02] px-3 py-2.5 transition hover:border-[rgba(40,178,158,0.15)]"
              >
                <div className="flex size-8 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-400">
                  {member.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.department} · {member.role}</p>
                </div>
                <p className="flex-none text-[10px] text-slate-500">{formatDate(member.createdAt)}</p>
              </Link>
            ))}
            {overview.recentUsers.length === 0 && (
              <p className="rounded-[10px] border border-white/[0.065] bg-white/[0.02] px-4 py-4 text-sm text-slate-500">
                Нових користувачів немає
              </p>
            )}
          </div>
        </article>
      </section>
    </>
  );
}
