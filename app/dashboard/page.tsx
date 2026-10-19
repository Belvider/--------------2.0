import type { Metadata, Route } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Award, BarChart3, BookOpenCheck, CalendarDays, ChevronDown, Clock3, Trophy } from "lucide-react";
import { OnboardingModal } from "@/components/OnboardingModal";
import { PortalShell } from "@/components/PortalShell";
import { requireAuthPageUser } from "@/lib/guards";
import { getDashboardData } from "@/lib/queries";
import { cn, formatDate } from "@/lib/ui";
import styles from "./home.module.css";

export const metadata: Metadata = { title: "Головна | Портал навчання" };

const DAY_LABELS = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

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
  const activeDays = data.weeklyActivity.filter((item) => item.modulesCount > 0).length;
  const progressPct = Math.min(100, Math.max(0, data.progressPct));
  const today = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", timeZone: "Europe/Kyiv" }).format(new Date());

  return (
    <PortalShell user={user}>
      {data.completedModules === 0 && data.activeDaysLast14 === 0 && (
        <OnboardingModal firstName={user.firstName?.trim() || getGreetingName(user.name)} totalModules={data.totalModules} userId={user.id} />
      )}
      <div className={styles.home}>
        <header className={styles.header}>
          <div>
            <p className={styles.date}><CalendarDays size={14} aria-hidden="true" />{today}</p>
            <h1>Головна</h1>
            <p className={styles.subtitle}>Ваш наступний крок і прогрес навчання.</p>
          </div>
          <Link href="/brands" className={cn("focus-ring", styles.catalogLink)}>
            Усі матеріали <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </header>

        <section className={styles.learningGrid} aria-label="Навчання та прогрес">
          <article className={cn("card", styles.panel, styles.feature, overdue && styles.featureUrgent)}>
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
            <p className={styles.eyebrow}>Ваш прогрес</p>
            <div className={styles.progressValue}>{progressPct}<span>%</span></div>
            <p className={styles.progressDescription}>Завершено модулів: {data.completedModules} із {data.totalModules}</p>
            <div className={styles.progressTrack} role="progressbar" aria-label="Завершені модулі"
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct}>
              <span style={{ width: progressPct + "%" }} />
            </div>
            <dl className={styles.progressDetails}>
              <div><dt>У процесі</dt><dd>{data.inProgressModules}</dd></div>
              <div><dt>Залишилося</dt><dd>{Math.max(data.totalModules - data.completedModules, 0)}</dd></div>
            </dl>
            <Link href="/profile" className={cn("focus-ring", styles.textLink)}>
              Детальніше у профілі <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
        </section>

        <section className={styles.stats} aria-label="Показники навчання">
          {[
            { icon: BarChart3, label: "Середній результат", value: data.averageQuizScore !== null ? data.averageQuizScore + "%" : "—", note: data.averageQuizScore !== null ? "Найкращі спроби за модулями" : "Після першого тесту" },
            { icon: Award, label: "Сертифікати", value: data.certificatesCount, note: "За успішні тести" },
            { icon: CalendarDays, label: "Активні дні", value: data.activeDaysLast14 + " / 14", note: "За останні два тижні" }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.label} className={cn("card", styles.stat)}>
                <Icon size={19} className={styles.statIcon} aria-hidden="true" />
                <p className={styles.statValue}>{stat.value}</p>
                <h2>{stat.label}</h2>
                <p className={styles.statNote}>{stat.note}</p>
              </article>
            );
          })}
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

        <section className={styles.materialsGrid} aria-label="Матеріали та активність">
          <article className={cn("card", styles.panel)}>
            <div className={styles.sectionHeader}>
              <div><p className={styles.eyebrow}>Каталог</p><h2>Останні матеріали</h2></div>
              <Link href="/brands" className={cn("focus-ring", styles.iconLink)} aria-label="Усі навчальні матеріали">
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.materialList}>
              {data.newMaterials.slice(0, 3).map((item) => (
                <Link key={item.id} href={("/module/" + item.id) as Route} className={cn("focus-ring", styles.material)}>
                  <span className={styles.materialIcon}><BookOpenCheck size={20} aria-hidden="true" /></span>
                  <div className={styles.rowCopy}>
                    <h3>{item.title}</h3>
                    <p>{item.category.brand.name} · {item.durationMin} хв</p>
                  </div>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ))}
              {data.newMaterials.length === 0 && <p className={styles.empty}>Нових матеріалів поки немає.</p>}
            </div>
          </article>

          <article className={cn("card", styles.panel, styles.activityPanel)}>
            <div className={styles.sectionHeader}>
              <div><p className={styles.eyebrow}>Навчальний ритм</p><h2>Останні 7 днів</h2></div>
              <span className={styles.activityCount}>{activeDays} / 7</span>
            </div>
            <ol className={styles.activityWeek} aria-label="Активність за останні сім днів">
              {data.weeklyActivity.map((day) => {
                const date = new Date(day.day + "T12:00:00Z");
                const label = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", timeZone: "Europe/Kyiv" }).format(date);
                return (
                  <li key={day.day} aria-current={day.isToday ? "date" : undefined}
                    className={cn(styles.activityDay, day.modulesCount > 0 && styles.activeDay, day.isToday && styles.today)}
                    title={label + ": модулів — " + day.modulesCount}>
                    <span>{day.modulesCount || "—"}</span>
                    <small>{DAY_LABELS[date.getUTCDay()]}</small>
                  </li>
                );
              })}
            </ol>
            <p className={styles.activityNote}>{activeDays > 0 ? "Модулі, з якими ви працювали щодня." : "За цей період активності ще немає."}</p>
            <Link href="/profile" className={cn("focus-ring", styles.textLink)}>Історія навчання<ArrowRight size={14} aria-hidden="true" /></Link>
          </article>
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
