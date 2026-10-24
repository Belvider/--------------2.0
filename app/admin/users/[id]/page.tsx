import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, Clock3, FileBadge2, GraduationCap, History, LineChart, Shield, Sparkles } from "lucide-react";
import { Role } from "@prisma/client";
import { AdminUserActions } from "@/components/admin/AdminUserActions";
import { AdminUserAccessPanel } from "@/components/admin/AdminUserAccessPanel";
import { AdminUserProfileForm } from "@/components/admin/AdminUserProfileForm";
import { AssignedModulesSection } from "@/components/assignments/AssignedModulesSection";
import { UserAvatar } from "@/components/UserAvatar";
import { requireAdminOrManagerPageUser } from "@/lib/guards";
import { getProgressStatusLabel } from "@/lib/progress";
import { getProfileData } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/ui";

type PageProps = {
  params: Promise<{ id: string }>;
};

const auditFieldLabels: Record<string, string> = {
  name: "ПІБ",
  firstName: "Ім'я",
  lastName: "Прізвище",
  middleName: "По батькові",
  email: "Email",
  phone: "Телефон",
  birthday: "Дата народження",
  role: "Роль",
  position: "Посада",
  department: "Відділ",
  store: "Магазин",
  city: "Місто",
  hireDate: "Дата найму",
  notes: "Нотатки",
  isActive: "Статус"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatAuditValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Активно" : "Вимкнено";
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return formatDate(value);
  }

  return String(value);
}

function getAuditChangePreview(details: unknown) {
  if (!isRecord(details) || !isRecord(details.before) || !isRecord(details.after)) {
    return [];
  }

  const before = details.before;
  const after = details.after;

  return Array.from(new Set([...Object.keys(before), ...Object.keys(after)]))
    .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
    .slice(0, 4)
    .map((key) => ({
      key,
      label: auditFieldLabels[key] ?? key,
      before: formatAuditValue(before[key]),
      after: formatAuditValue(after[key])
    }));
}

export default async function AdminUserProfilePage({ params }: PageProps) {
  const currentUser = await requireAdminOrManagerPageUser();
  const { id } = await params;

  const profile = await getProfileData(id);

  if (!profile.user) {
    notFound();
  }

  const [loginAttempts, auditTrail] = await Promise.all([
    prisma.loginAttempt.findMany({
      where: { email: profile.user.email },
      orderBy: { attemptedAt: "desc" },
      take: 8
    }),
    prisma.adminAuditLog.findMany({
      where: {
        targetType: "user",
        targetId: id
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        action: true,
        summary: true,
        ipAddress: true,
        createdAt: true,
        details: true,
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })
  ]);

  const canManage = currentUser.role === Role.ADMIN && currentUser.id !== profile.user.id;
  const canEditProfile = currentUser.role === Role.ADMIN;

  return (
    <>
      <section className="card relative overflow-hidden px-5 py-6 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(40,178,158,0.16),transparent_26%),linear-gradient(145deg,rgba(255,255,255,0.04),transparent_54%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
          <div className="flex items-center justify-center">
            <UserAvatar
              name={profile.user.name}
              avatarUrl={profile.user.avatarUrl}
              size="lg"
              className="shadow-[0_22px_40px_rgba(0,0,0,0.18)]"
              initialsClassName="text-xl"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link href="/admin" className="underline">
                Адмін-панель
              </Link>
              <span>/</span>
              <span className="text-slate-300">Профіль працівника</span>
            </div>

            <span className="portal-chip mt-5 inline-flex">Профіль користувача</span>
            <h1 className="portal-page-title mt-4">{profile.user.name}</h1>
            <p className="portal-subtitle mt-3 max-w-2xl">
              Детальний кабінет працівника для адміністратора: прогрес навчання, спроби тестів, сертифікати, бейджі,
              історія активності й керування доступом.
            </p>

            {currentUser.role === Role.ADMIN && <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/admin/users/${profile.user.id}/profile`} className="focus-ring inline-flex items-center gap-2 rounded-full border border-[rgba(40,178,158,0.25)] bg-[rgba(40,178,158,0.08)] px-4 py-2 text-sm font-semibold text-[#8fe3d3]">
                Навчальний профіль
              </Link>
              <a href="#profile-data" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
                {currentUser.id === profile.user.id ? "Редагувати мої дані" : "Редагувати дані"}
              </a>
            </div>}

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-600">
                {profile.user.position}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-600">
                {profile.user.department}
                {profile.user.store ? ` · ${profile.user.store}` : ""}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-600">
                {profile.user.email}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-600">
                {profile.user.role}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-600">
                {profile.user.isActive ? "Активний акаунт" : "Заблокований акаунт"}
              </span>
            </div>
          </div>

          <AdminUserActions
            userId={profile.user.id}
            userName={profile.user.name}
            initialIsActive={profile.user.isActive}
            canManage={canManage}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="card p-5">
          <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <GraduationCap className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
          </div>
          <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Пройдено модулів</p>
          <p className="mt-3 font-[var(--font-heading)] text-4xl font-semibold text-ink">{profile.stats.completedModules}</p>
        </article>

        <article className="card p-5">
          <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <LineChart className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
          </div>
          <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Середній бал</p>
          <p className="mt-3 font-[var(--font-heading)] text-4xl font-semibold text-ink">{profile.stats.avgScore}%</p>
        </article>

        <article className="card p-5">
          <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <Clock3 className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
          </div>
          <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Час у навчанні</p>
          <p className="mt-3 font-[var(--font-heading)] text-4xl font-semibold text-ink">{profile.stats.totalMinutes} хв</p>
        </article>

        <article className="card p-5">
          <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <FileBadge2 className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
          </div>
          <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Сертифікати</p>
          <p className="mt-3 font-[var(--font-heading)] text-4xl font-semibold text-ink">{profile.certificates.length}</p>
        </article>
      </section>

      <AdminUserProfileForm
        user={profile.user}
        canEdit={canEditProfile}
        canChangeAccess={canManage}
      />

      <AdminUserAccessPanel userId={profile.user.id} userName={profile.user.name} canManage={canManage} />

      <AssignedModulesSection
        label="Призначення"
        title="Що закріплено за працівником"
        subtitle="Цей блок дає адміністратору повну картину по активних навчальних завданнях працівника: що видано персонально або через відділ, де дедлайн уже горить і де потрібне швидке підсилення."
        emptyText="Активних призначень у цього працівника зараз немає."
        assignments={profile.assignments}
        summary={profile.assignmentSummary}
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_0.85fr]">
        <article className="card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Sparkles className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Історія проходження</p>
              <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Прогрес по модулях</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {profile.progressList.map((entry) => (
              <div key={entry.id} className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/module/${entry.module.id}`} className="font-medium text-slate-100 underline-offset-4 hover:underline">
                      {entry.module.title}
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {entry.module.category.brand.name} · {entry.module.category.name}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                      entry.status === "COMPLETED"
                        ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)] text-[color:var(--brand-strong)]"
                        : entry.status === "IN_PROGRESS"
                          ? "border-white/10 bg-white/[0.04] text-white"
                          : "border-white/10 bg-white/[0.025] text-slate-500"
                    }`}
                    >
                    {getProgressStatusLabel(entry.status, entry.progressPct)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span>Прогрес: {entry.progressPct}%</span>
                  <span>{entry.completedAt ? `Завершено: ${formatDate(entry.completedAt)}` : "Ще не завершено"}</span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(40,178,158,0.95),rgba(138,242,223,0.88))]"
                    style={{ width: `${entry.progressPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4">
          <article className="card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <Award className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Визнання</p>
                <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Бейджі та сертифікати</h2>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Бейджі</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.badges.map((entry) => (
                    <span
                      key={entry.id}
                      className="rounded-full border border-[rgba(230,191,114,0.28)] bg-[rgba(230,191,114,0.12)] px-3 py-1.5 text-sm font-semibold text-amber-900"
                    >
                      {entry.badge.name}
                    </span>
                  ))}
                  {profile.badges.length === 0 && <span className="text-sm text-slate-500">Бейджів ще немає.</span>}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Сертифікати</p>
                <div className="mt-3 space-y-3">
                  {profile.certificates.map((certificate) => (
                    <div key={certificate.id} className="rounded-[18px] border border-white/10 bg-white/[0.02] p-3 text-sm">
                      <p className="font-medium text-slate-100">{certificate.module.title}</p>
                      <p className="mt-1 text-slate-500">Видано: {formatDate(certificate.issuedAt)}</p>
                    </div>
                  ))}
                  {profile.certificates.length === 0 && <p className="text-sm text-slate-500">Сертифікатів ще немає.</p>}
                </div>
              </div>
            </div>
          </article>

          <article className="card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <Shield className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Активність</p>
                <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Тести та входи</h2>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Спроби тестів</p>
                <div className="mt-3 space-y-3">
                  {profile.attempts.map((attempt) => (
                    <div key={attempt.id} className="rounded-[18px] border border-white/10 bg-white/[0.02] p-3 text-sm">
                      <p className="font-medium text-slate-100">{attempt.module.title}</p>
                      <p className="mt-1 text-slate-500">
                        {formatDate(attempt.attemptedAt)} · {attempt.score}% · {attempt.passed ? "Успішно" : "Неуспішно"}
                      </p>
                    </div>
                  ))}
                  {profile.attempts.length === 0 && <p className="text-sm text-slate-500">Спроб тестів ще немає.</p>}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Останні входи</p>
                <div className="mt-3 space-y-3">
                  {loginAttempts.map((attempt) => (
                    <div key={attempt.id} className="rounded-[18px] border border-white/10 bg-white/[0.02] p-3 text-sm">
                      <p className="font-medium text-slate-100">{attempt.successful ? "Успішний вхід" : "Невдала спроба"}</p>
                      <p className="mt-1 text-slate-500">
                        {formatDate(attempt.attemptedAt)} · {attempt.ipAddress ?? "IP недоступна"}
                      </p>
                    </div>
                  ))}
                  {loginAttempts.length === 0 && <p className="text-sm text-slate-500">Історія входів відсутня.</p>}
                </div>
              </div>
            </div>
          </article>

          <article className="card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <History className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Журнал змін</p>
                <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Історія профілю</h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {auditTrail.map((entry) => {
                const changes = getAuditChangePreview(entry.details);

                return (
                  <div key={entry.id} className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-100">{entry.summary}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {entry.actor ? `${entry.actor.name} · ${entry.actor.role}` : "Системна дія"}
                        </p>
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        <p>{formatDate(entry.createdAt)}</p>
                        <p className="mt-1">{entry.ipAddress ?? "IP не визначено"}</p>
                      </div>
                    </div>

                    {changes.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {changes.map((change) => (
                          <div key={`${entry.id}-${change.key}`} className="rounded-[18px] border border-white/10 bg-white/[0.02] px-3 py-3 text-sm">
                            <p className="font-medium text-slate-100">{change.label}</p>
                            <p className="mt-1 text-slate-500">
                              Було: {change.before} → Стало: {change.after}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {auditTrail.length === 0 && <p className="text-sm text-slate-500">Історія змін профілю поки відсутня.</p>}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
