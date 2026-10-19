import type { Metadata, Route } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Award, BarChart3, BookOpenCheck, CalendarDays, ChevronDown, Clock3, Sparkles, Trophy } from "lucide-react";
import { OnboardingModal } from "@/components/OnboardingModal";
import { PortalShell } from "@/components/PortalShell";
import { QuickPractice } from "@/components/home/QuickPractice";
import { LearningPulse } from "@/components/home/LearningPulse";
import { getActivityDay } from "@/lib/activity-days";
import { requireAuthPageUser } from "@/lib/guards";
import { getDashboardData } from "@/lib/queries";
import { cn, formatDate } from "@/lib/ui";
import styles from "./home.module.css";

export const metadata: Metadata = { title: "Головна | Портал навчання" };

function getGreetingName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 3) return parts[1];
  return parts[0] ?? fullName;
}

export default async function HomePage() {
  const user = await requireAuthPageUser();
  const data = await getDashboardData(user.id);
  const openAssignments = data.assignments.filter((item) => !item.isCompleted);
  const overdue = openAssignments.find((item) => item.isOverdue);
  const dueSoon = openAssignments.find((item) => item.isDueSoon);
  const featuredAssignment = overdue ?? dueSoon ?? (data.continueModule ? null : openAssignments[0]) ?? null;
  const featuredId = featuredAssignment?.moduleId ?? data.continueModule?.id;
  const featuredProgress = featuredAssignment?.progress.progressPct ?? data.continueModuleProgress;
  const featuredBrand = featuredAssignment?.brand.name ?? data.continueModule?.category.brand.name;
  const featuredCategory = featuredAssignment?.category.name ?? data.continueModule?.category.name;
  const featuredDuration = featuredAssignment?.durationMin ?? data.continueModule?.durationMin;
  const quizReady = featuredProgress >= 100 && data.continueModule !== null
    && data.continueModule.id === featuredId && data.continueModule._count.questions > 0;
  const allComplete = data.totalModules > 0 && data.completedModules === data.totalModules;
  const featuredTitle = featuredAssignment?.title ?? data.continueModule?.title
    ?? (allComplete ? "Ви завершили всі модулі" : data.totalModules > 0 ? "Оберіть наступний матеріал" : "Матеріали незабаром з’являться");
  const featuredDescription = quizReady ? "Матеріал переглянуто. Залишилося перевірити знання."
    : overdue ? "Термін виконання минув. Поверніться до призначеного модуля."
    : dueSoon ? "У цього призначення наближається термін виконання."
    : featuredAssignment ? "Цей модуль призначено вам для навчання."
    : data.continueModule ? "Продовжіть з останнього відкритого матеріалу."
    : allComplete ? "Поверніться до матеріалів, коли потрібно освіжити знання."
    : data.totalModules > 0 ? "Знайдіть потрібний бренд або напрямок у каталозі."
    : "Загляньте пізніше, щоб почати навчання.";
  const featuredHref = (featuredId ? "/module/" + featuredId + (quizReady ? "/quiz" : "") : "/brands") as Route;
  const featuredCta = featuredId ? quizReady ? "Перейти до тесту" : featuredProgress > 0 ? "Продовжити навчання" : "Почати модуль"
    : allComplete ? "Повторити матеріали" : "Відкрити каталог";
  const remainingAssignments = openAssignments.filter((item) => item.moduleId !== featuredId);
  const progressPct = Math.min(100, Math.max(0, data.progressPct));
  const now = new Date();
  const activityDay = getActivityDay(now);
  const practiceIndex = Math.floor(Date.parse(activityDay + "T00:00:00Z") / 86_400_000);
  const today = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", timeZone: "Europe/Kyiv" }).format(now);
  const metrics = [
    {
      icon: BarChart3,
      label: "Середній результат",
      value: data.averageQuizScore !== null ? data.averageQuizScore + "%" : "—",
      note: data.averageQuizScore !== null ? "Найкращі спроби за модулями" : "Після першого тесту"
    },
    { icon: Award, label: "Сертифікати", value: data.certificatesCount, note: "За успішні тести" },
    { icon: CalendarDays, label: "Активні дні", value: data.activeDaysLast14 + " / 14", note: "За останні два тижні" }
  ];

  return (
    <PortalShell user={user}>
      {data.completedModules === 0 && data.activeDaysLast14 === 0 && (
        <OnboardingModal firstName={user.firstName?.trim() || getGreetingName(user.name)} totalModules={data.totalModules} userId={user.id} />
      )}
      <div className={styles.home}>
        <header className={styles.header}>
          <div>
            <p className={styles.headerEyebrow}><span aria-hidden="true" />Ваш простір навчання</p>
            <h1>Головна</h1>
            <p className={styles.subtitle}>Від знань про техніку — до впевненої консультації.</p>
          </div>
          <div className={styles.headerActions}>
            <p className={styles.date}><CalendarDays size={14} aria-hidden="true" />{today}</p>
            <Link href="/brands" className={cn("focus-ring", styles.catalogLink)}>
              Усі матеріали <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <section className={styles.learningGrid} aria-label="Навчання та прогрес">
          <article className={cn("card", styles.panel, styles.feature, overdue && styles.featureUrgent)}>
            <div className={styles.featureArt} aria-hidden="true">
              <span className={styles.orbit} /><span className={styles.orbitInner} />
              <div className={styles.featureGlyph}><BookOpenCheck strokeWidth={1.15} /></div>
              <span className={styles.artSpark}><Sparkles size={18} /></span>
            </div>
            <div className={styles.featureTop}>
              <span className={styles.eyebrow}><BookOpenCheck size={15} aria-hidden="true" />Наступний крок</span>
              {featuredAssignment?.dueAt ? (
                <span className={cn(styles.badge, overdue && styles.overdueBadge)}>
                  {overdue ? "Термін минув · " : "До "}{formatDate(featuredAssignment.dueAt)}
                </span>
              ) : quizReady ? <span className={styles.badge}>Матеріал переглянуто</span> : null}
            </div>
            <h2 className={styles.featureTitle}>{featuredTitle}</h2>
            {featuredId && (
              <div className={styles.moduleMeta}>
                <span>{featuredBrand} · {featuredCategory}</span>
                <span><Clock3 size={13} aria-hidden="true" />{featuredDuration} хв</span>
              </div>
            )}
            <p className={styles.featureDescription}>{featuredDescription}</p>
            {featuredId && featuredProgress > 0 && (
              <div className={styles.materialProgress}>
                <span>Переглянуто матеріалу</span><strong>{featuredProgress}%</strong>
              </div>
            )}
            <Link href={featuredHref} className={cn("focus-ring", styles.primaryButton)}>
              {featuredCta}<ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>

          <article className={cn("card", styles.panel, styles.progressPanel)}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.eyebrow}>Ваш прогрес</h2>
              <Link href="/profile" className={cn("focus-ring", styles.iconLink)} aria-label="Прогрес і досягнення у профілі"><ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className={styles.progressSummary}>
              <div className={styles.progressRing} style={{ "--progress": progressPct + "%" } as CSSProperties}
                role="progressbar" aria-label="Завершені модулі" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct}>
                <div className={styles.progressValue}>{progressPct}<span>%</span><small>завершено</small></div>
              </div>
              <dl className={styles.progressDetails}>
                <div><dt><span className={styles.completedDot} />Завершено</dt><dd>{data.completedModules}<small> / {data.totalModules}</small></dd></div>
                <div><dt><span className={styles.inProgressDot} />У процесі</dt><dd>{data.inProgressModules}</dd></div>
              </dl>
            </div>
            <p className={styles.progressDescription}>Залишилося модулів: {Math.max(data.totalModules - data.completedModules, 0)}</p>
            <section className={styles.stats} aria-label="Показники навчання">
              {metrics.map((stat) => {
                const Icon = stat.icon;
                return (
                  <article key={stat.label} className={styles.stat}>
                    <Icon size={16} className={styles.statIcon} aria-hidden="true" />
                    <p className={styles.statValue}>{stat.value}</p>
                    <h2>{stat.label}</h2>
                    <p className={styles.statNote}>{stat.note}</p>
                  </article>
                );
              })}
            </section>
          </article>
        </section>

        <section className={styles.exploreGrid} aria-label="Мініпрактика та навчальна активність">
          <QuickPractice key={activityDay} initialIndex={practiceIndex} />
          <LearningPulse days={data.weeklyActivity} />
        </section>

        {remainingAssignments.length > 0 && (
          <section className={cn("card", styles.panel)} aria-labelledby="home-assignments-title">
            <div className={styles.sectionHeader}>
              <div><p className={styles.eyebrow}>Ваш план</p><h2 id="home-assignments-title">Призначені вам</h2></div>
              <Link href="/profile" className={cn("focus-ring", styles.textLink)}>Усі призначення<ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
            <div className={styles.assignmentList}>
              {remainingAssignments.slice(0, 3).map((assignment) => (
                <Link key={assignment.id} href={("/module/" + assignment.moduleId) as Route}
                  className={cn("focus-ring", styles.assignment, assignment.isOverdue && styles.assignmentOverdue)}>
                  <span className={styles.assignmentDot} aria-hidden="true" />
                  <div className={styles.rowCopy}>
                    <h3>{assignment.title}</h3>
                    <p>{assignment.brand.name} · {assignment.durationMin} хв
                      {assignment.dueAt ? " · До " + formatDate(assignment.dueAt) : ""}
                    </p>
                  </div>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ))}
            </div>
            {remainingAssignments.length > 3 && <p className={styles.moreNote}>Ще {remainingAssignments.length - 3} — у вашому профілі.</p>}
          </section>
        )}

        <section className={cn("card", styles.panel, styles.catalogPanel)} aria-labelledby="home-materials-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.eyebrow}>Знайдіть свою тему</p><h2 id="home-materials-title">Останні матеріали</h2></div>
            <Link href="/brands" className={cn("focus-ring", styles.iconLink)} aria-label="Усі навчальні матеріали">
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.materialList}>
            {data.newMaterials.slice(0, 3).map((item, index) => (
              <Link key={item.id} href={("/module/" + item.id) as Route} className={cn("focus-ring", styles.material)}>
                <span className={styles.materialNumber} aria-hidden="true">0{index + 1}</span>
                <div className={styles.rowCopy}>
                  <p className={styles.materialBrand}>{item.category.brand.name}</p>
                  <h3>{item.title}</h3>
                  <p><Clock3 size={12} aria-hidden="true" />{item.durationMin} хв</p>
                </div>
                <span className={styles.materialArrow}><ArrowUpRight size={17} aria-hidden="true" /></span>
              </Link>
            ))}
            {data.newMaterials.length === 0 && <p className={styles.empty}>Нових матеріалів поки немає.</p>}
          </div>
        </section>

        {data.leaderboard.length > 0 && (
          <details className={cn("card", styles.team)}>
            <summary className="focus-ring">
              <Trophy size={17} aria-hidden="true" /><span>Рейтинг команди</span><small>За завершеними модулями</small><ChevronDown size={16} className={styles.chevron} aria-hidden="true" />
            </summary>
            <ol className={styles.leaderboard}>
              {data.leaderboard.slice(0, 5).map((row, index) => (
                <li key={row.userId} className={cn(styles.leader, row.userId === user.id && styles.currentUser)}>
                  <span className={styles.rank}>{index + 1}</span>
                  <div className={styles.rowCopy}><h3>{row.name}{row.userId === user.id ? " · Ви" : ""}</h3><p>{row.department}</p></div>
                  <strong>{row.completed}<small>модулів</small></strong>
                </li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </PortalShell>
  );
}
