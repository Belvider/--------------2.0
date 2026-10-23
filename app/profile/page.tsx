import Link from "next/link";
import { ArrowRight, Award, BookOpenCheck, CheckCircle2, ChevronDown, ClipboardList, Clock3, FileBadge2, Flame, Layers3, Target, TrendingUp } from "lucide-react";
import { ProfileIdentityCard } from "@/components/profile/ProfileIdentityCard";
import { ProfileHistory } from "@/components/profile/ProfileHistory";
import { PortalShell } from "@/components/PortalShell";
import { requireAuthPageUser } from "@/lib/guards";
import { getProfileData } from "@/lib/queries";
import { getActivityDay, getActivityStreak, shiftActivityDay } from "@/lib/activity-days";
import { getQuizStatistics } from "@/lib/learning-statistics";
import { formatDate } from "@/lib/ui";
import styles from "./profile.module.css";

function pluralize(value: number, one: string, few: string, many: string) {
  const mod10 = value % 10, mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
function formatMinutes(value: number) {
  const minutes = Math.max(0, Math.round(value));
  if (minutes < 60) return `${minutes} хв`;
  const hours = Math.floor(minutes / 60), rest = minutes % 60;
  return rest ? `${hours} год ${rest} хв` : `${hours} год`;
}
function timestamp(value: Date | string | null | undefined) {
  return value ? new Date(value instanceof Date ? value.getTime() : value).getTime() : 0;
}
function iso(value: Date | string | null | undefined) {
  return value ? new Date(timestamp(value)).toISOString() : null;
}

export default async function ProfilePage() {
  const currentUser = await requireAuthPageUser();
  const profile = await getProfileData(currentUser.id);
  if (!profile.user) return null;

  const publishedIds = new Set(profile.publishedModules.map(module => module.id));
  const progress = profile.progressList.filter(entry => publishedIds.has(entry.moduleId));
  const attempts = profile.attempts.filter(entry => publishedIds.has(entry.moduleId));
  const completed = progress.filter(entry => entry.status === "COMPLETED");
  const inProgress = progress.filter(entry => entry.status === "IN_PROGRESS").sort((a, b) => timestamp(b.lastSeenAt) - timestamp(a.lastSeenAt));
  const total = profile.publishedModules.length;
  const progressPct = total ? Math.min(100, Math.round(completed.length / total * 100)) : 0;
  const stats = getQuizStatistics(attempts);
  const nominalMinutes = progress.reduce((sum, entry) => sum + (entry.status === "COMPLETED" ? entry.module.durationMin : Math.round(entry.module.durationMin * Math.max(0, Math.min(100, entry.progressPct)) / 100)), 0);
  const today = getActivityDay();
  const streak = getActivityStreak(profile.activityDays.filter(day => day.count > 0).map(day => day.day), today);
  const activityMap = new Map(profile.activityDays.map(day => [day.day, day.count]));
  const last28Days = Array.from({ length: 28 }, (_, index) => {
    const day = shiftActivityDay(today, index - 27);
    return { day, count: activityMap.get(day) ?? 0 };
  });
  const activeDays = last28Days.filter(day => day.count > 0).length;
  const openAssignments = profile.assignments.filter(item => !item.isCompleted).sort((a, b) => Number(b.isOverdue) - Number(a.isOverdue) || Number(b.required) - Number(a.required) || (timestamp(a.dueAt) || Infinity) - (timestamp(b.dueAt) || Infinity));
  const latestAttempts = [...attempts].sort((a, b) => timestamp(b.attemptedAt) - timestamp(a.attemptedAt));
  const review = latestAttempts.find(item => !item.passed && !attempts.some(other => other.moduleId === item.moduleId && other.passed));
  const assignment = openAssignments[0], continuing = inProgress[0];
  const next = assignment ? {
    title: assignment.title, brand: assignment.brand.name, durationMin: assignment.durationMin, href: `/module/${assignment.moduleId}` as const,
    label: assignment.isOverdue ? "Призначення потребує уваги" : "Ваше призначення", action: assignment.progress.status === "IN_PROGRESS" ? "Продовжити модуль" : "Відкрити модуль",
    detail: assignment.dueAt ? `${assignment.isOverdue ? "Термін минув" : "Виконати до"}: ${formatDate(assignment.dueAt)}` : "Модуль у вашій навчальній траєкторії."
  } : review ? {
    title: review.module.title, brand: review.module.category.brand.name, durationMin: review.module.durationMin, href: `/module/${review.moduleId}` as const,
    label: "Закріпіть знання", action: "Повторити матеріал", detail: `Останній результат цього модуля — ${Math.round(review.score)}%. Перегляньте матеріал перед наступною спробою.`
  } : continuing ? {
    title: continuing.module.title, brand: continuing.module.category.brand.name, durationMin: continuing.module.durationMin, href: `/module/${continuing.moduleId}` as const,
    label: "Продовжуйте з місця зупинки", action: "Продовжити модуль", detail: `${continuing.progressPct}% матеріалу вже переглянуто.`
  } : null;

  const brandMap = new Map<string, { name: string; slug: string; total: number; completed: number; inProgress: number }>();
  for (const learningModule of profile.publishedModules) {
    const brand = learningModule.category.brand;
    const group = brandMap.get(brand.slug) ?? { name: brand.name, slug: brand.slug, total: 0, completed: 0, inProgress: 0 };
    group.total++; brandMap.set(brand.slug, group);
  }
  for (const entry of progress) {
    const group = brandMap.get(entry.module.category.brand.slug);
    if (group) { if (entry.status === "COMPLETED") group.completed++; else if (entry.status === "IN_PROGRESS") group.inProgress++; }
  }
  const brands = [...brandMap.values()].sort((a, b) => Number(b.completed + b.inProgress > 0) - Number(a.completed + a.inProgress > 0) || b.completed / b.total - a.completed / a.total || a.name.localeCompare(b.name, "uk"));
  const visibleBrands = brands.slice(0, 6), remainingBrands = brands.slice(6);
  const brandRow = (brand: typeof brands[number]) => {
    const pct = Math.min(100, Math.round(brand.completed / brand.total * 100));
    return <Link key={brand.slug} href={`/brands/${brand.slug}`} className={`focus-ring ${styles.brand}`}>
      <div className={styles.brandTop}><span className={styles.brandMark} aria-hidden="true">{brand.name.slice(0, 1)}</span><span className={styles.brandName}>{brand.name}</span><strong>{pct}%</strong>{pct === 100 && <CheckCircle2 className="size-3.5 text-[#a2dfcf]" aria-label="Усі модулі бренду завершено" />}</div>
      <div className={styles.rail} aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
      <div className={styles.brandMeta}><span>{brand.completed} із {brand.total} {pluralize(brand.total, "модуля", "модулів", "модулів")} завершено</span><span>{brand.inProgress ? `${brand.inProgress} у процесі` : pct === 100 ? "Усе опрацьовано" : "Є що відкрити"}</span></div>
    </Link>;
  };

  return <PortalShell user={currentUser}>
    <div className={styles.profile}>
      <ProfileIdentityCard user={profile.user} />
      <section className={styles.overview} aria-label="Огляд навчання">
        <article className={`${styles.panel} ${styles.overviewPanel}`}>
          <div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Навчальний шлях</p><h2>Ваш прогрес у матеріалах</h2></div><Layers3 className="size-4 text-[#b6a0df]" aria-hidden="true" /></div>
          <div className={styles.progressHeading}><div><strong>{progressPct}<small>%</small></strong><p>опублікованих модулів завершено</p></div><span className={styles.progressFraction}>{completed.length} із {total}</span></div>
          <div className={styles.rail} role="progressbar" aria-label="Завершені модулі опублікованого каталогу" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progressPct}%` }} /></div>
          <div className={styles.progressLegend}><span><strong>{inProgress.length}</strong> у процесі</span><span><strong>{Math.max(0, total - completed.length - inProgress.length)}</strong> ще не розпочато</span></div>
          <p className={styles.volume}><Clock3 className="size-3.5" aria-hidden="true" /><span><strong>Обсяг опрацьованих матеріалів — {formatMinutes(nominalMinutes)}.</strong><br />За орієнтовною тривалістю модулів, з урахуванням переглянутого прогресу.</span></p>
        </article>
        <div className={styles.metrics}>
          {[
            { Icon: TrendingUp, value: stats.testedModules ? `${stats.avgScore}%` : "—", title: "Середній результат", note: "Найкращий бал кожного модуля" },
            { Icon: Target, value: stats.testedModules ? `${stats.passRate}%` : "—", title: "Успішно складені тести", note: stats.testedModules ? `${stats.testedModules} ${pluralize(stats.testedModules, "модуль із тестом", "модулі з тестами", "модулів із тестами")}` : "Після першої спроби" },
            { Icon: FileBadge2, value: profile.certificates.length, title: "Сертифікати", note: "Усі збережені результати" },
            { Icon: Flame, value: streak, title: "Серія активності", note: streak ? `${pluralize(streak, "День", "Дні", "Днів")} поспіль` : "Поверніться до матеріалів" }
          ].map(({ Icon, value, title, note }) => <article key={title} className={styles.metric}><Icon aria-hidden="true" /><strong>{value}</strong><h3>{title}</h3><p>{note}</p></article>)}
        </div>
      </section>
      <section className={styles.nextGrid} aria-label="Наступний крок і активність">
        <article className={`${styles.panel} ${styles.nextPanel}`}>
          <p className={styles.eyebrow}>{next?.label ?? (completed.length ? "Продовжуйте розвиватися" : "Почнімо навчання")}</p>
          <h2 className={styles.nextTitle}>{next?.title ?? (total ? "Знайдіть наступний напрям для себе" : "Нові матеріали готуються")}</h2>
          {next ? <><p className={styles.nextMeta}><span>{next.brand}</span><span>{formatMinutes(next.durationMin)} · орієнтовна тривалість</span></p><p className={styles.nextDescription}>{next.detail}</p></> : <p className={styles.nextDescription}>Оберіть бренд, познайомтеся з продуктами й перевірте знання в тесті.</p>}
          <Link href={next?.href ?? "/brands"} className={`focus-ring ${styles.primaryLink}`}>{next?.action ?? "Перейти до каталогу"}<ArrowRight className="size-4" aria-hidden="true" /></Link>
        </article>
        <article className={styles.panel}>
          <div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Останні 28 днів</p><h2>Ритм навчання</h2></div></div>
          <p className={styles.activityValue}><strong>{activeDays}</strong>{pluralize(activeDays, "активний день", "активні дні", "активних днів")}</p>
          <div className={styles.activityTrack} role="img" aria-label={`${activeDays} ${pluralize(activeDays, "активний день", "активні дні", "активних днів")} за останні 28 днів`}>
            {last28Days.map(day => <span key={day.day} title={`${formatDate(`${day.day}T12:00:00Z`)}: ${day.count} ${pluralize(day.count, "модуль", "модулі", "модулів")}`} className={day.count >= 3 ? styles.activityHigh : day.count === 2 ? styles.activityMedium : day.count === 1 ? styles.activityLow : undefined} />)}
          </div>
          <div className={styles.activityDates}><span>{formatDate(`${last28Days[0].day}T12:00:00Z`)}</span><span>Сьогодні</span></div>
          <p className={styles.activityNote}><BookOpenCheck aria-hidden="true" /><span>Перегляди матеріалів і спроби тестів. Вища колонка — більше модулів цього дня.</span></p>
        </article>
      </section>
      {profile.assignments.length > 0 && <details className={`${styles.panel} ${styles.assignmentDetails}`} id="profile-assignments">
        <summary className="focus-ring"><ClipboardList className="size-4" aria-hidden="true" /><span>Навчальні призначення<small>{profile.assignmentSummary.open} відкритих · {profile.assignmentSummary.completed} виконано{profile.assignmentSummary.overdue ? ` · ${profile.assignmentSummary.overdue} із простроченим терміном` : ""}</small></span><ChevronDown className="size-4" aria-hidden="true" /></summary>
        <div className={styles.assignmentRows}>{profile.assignments.map(item => <div key={item.id} className={styles.assignmentRow}>
          {item.isCompleted ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <BookOpenCheck className="size-4" aria-hidden="true" />}
          <div className={styles.rowCopy}><h3>{item.title}</h3><p>{item.brand.name} · {formatMinutes(item.durationMin)}{item.isCompleted ? " · Виконано" : item.required ? " · Обов’язковий" : ""}</p>{item.dueAt && !item.isCompleted && <p className={item.isOverdue ? styles.due : undefined}>{item.isOverdue ? "Термін минув" : "Виконати до"}: {formatDate(item.dueAt)}</p>}{item.note && <p>{item.note}</p>}</div>
          <Link href={`/module/${item.moduleId}`} className={`focus-ring ${styles.textLink}`} aria-label={`${item.isCompleted ? "Переглянути" : "Відкрити"} модуль ${item.title}`}><ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>)}</div>
      </details>}
      {brands.length > 0 && <section className={styles.panel}>
        <header className={styles.sectionHeader}><div><p className={styles.eyebrow}>Сильні сторони та нові напрями</p><h2>Знання за брендами</h2></div><p>{brands.length} {pluralize(brands.length, "бренд", "бренди", "брендів")}</p></header>
        <div className={styles.brandGrid}>{visibleBrands.map(brandRow)}</div>
        {remainingBrands.length > 0 && <details className={styles.moreBrands}><summary className="focus-ring">Ще {remainingBrands.length} {pluralize(remainingBrands.length, "напрям", "напрями", "напрямів")}<ChevronDown className="size-3.5" aria-hidden="true" /></summary><div className={styles.brandGrid}>{remainingBrands.map(brandRow)}</div></details>}
      </section>}
      <ProfileHistory
        modules={[...progress].sort((a, b) => timestamp(b.lastSeenAt) - timestamp(a.lastSeenAt)).map(entry => ({ id: entry.id, moduleId: entry.moduleId, title: entry.module.title, brand: entry.module.category.brand.name, status: entry.status, progressPct: Math.max(0, Math.min(100, entry.progressPct)), date: iso(entry.completedAt ?? entry.lastSeenAt), href: `/module/${entry.moduleId}` }))}
        attempts={latestAttempts.map(entry => ({ id: entry.id, moduleId: entry.moduleId, title: entry.module.title, brand: entry.module.category.brand.name, score: entry.score, passed: entry.passed, date: iso(entry.attemptedAt)!, href: `/module/${entry.moduleId}` }))}
        certificates={profile.certificates.map(entry => ({ id: entry.id, title: entry.module.title, date: iso(entry.issuedAt)!, href: `/certificate/${entry.id}` }))}
      />
      {profile.badges.length > 0 && <section className={styles.panel}><header className={styles.sectionHeader}><div><p className={styles.eyebrow}>Ваші досягнення</p><h2>Здобуті відзнаки</h2></div><Award className="size-4 text-[#d9c69e]" aria-hidden="true" /></header><div className={styles.badges}>{profile.badges.map(entry => <span key={entry.id} className={styles.badge} title={entry.badge.description}>{entry.badge.icon && <span aria-hidden="true">{entry.badge.icon}</span>}{entry.badge.name}</span>)}</div></section>}
    </div>
  </PortalShell>;
}
