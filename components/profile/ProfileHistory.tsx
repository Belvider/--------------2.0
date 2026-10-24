"use client";

import Link from "next/link";
import type { Route } from "next";
import { useId, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, CheckCheck, ChevronDown, FileBadge2, Search } from "lucide-react";
import styles from "@/app/profile/profile.module.css";

export type ProfileModuleHistory = {
  id: number;
  moduleId: number;
  title: string;
  brand: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  progressPct: number;
  date: string | null;
  href: string;
};

export type ProfileAttemptHistory = {
  id: number;
  moduleId: number;
  title: string;
  brand: string;
  score: number;
  passed: boolean;
  date: string;
  href: string;
};

export type ProfileCertificateHistory = {
  id: number;
  title: string;
  date: string;
  href: string;
};

type Props = {
  isOwnProfile?: boolean;
  modules: ProfileModuleHistory[];
  attempts: ProfileAttemptHistory[];
  certificates: ProfileCertificateHistory[];
};
type Tab = "modules" | "attempts" | "certificates";
const PAGE_SIZE = 6;
const dateFormat = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Kyiv" });

export function ProfileHistory({ modules, attempts, certificates, isOwnProfile = true }: Props) {
  const [tab, setTab] = useState<Tab>("modules");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const prefix = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "modules", label: "Модулі", count: modules.length },
    { key: "attempts", label: "Тести", count: attempts.length },
    { key: "certificates", label: "Сертифікати", count: certificates.length }
  ];
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("uk");
    const includes = (row: { title: string; brand?: string }) => `${row.title} ${row.brand ?? ""}`.toLocaleLowerCase("uk").includes(needle);
    if (tab === "modules") return modules.filter(row => includes(row) && (status === "all" || row.status === status));
    if (tab === "attempts") return attempts.filter(includes);
    return certificates.filter(includes);
  }, [tab, query, status, modules, attempts, certificates]);

  function changeTab(next: Tab) { setTab(next); setLimit(PAGE_SIZE); }
  function onTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault(); changeTab(tabs[next].key); tabRefs.current[next]?.focus();
  }

  const visible = filtered.slice(0, limit);
  const hasFilter = !!query || (tab === "modules" && status !== "all");
  return (
    <section id="profile-history" className={styles.panel} aria-labelledby={`${prefix}-title`}>
      <header className={styles.historyHeader}>
        <div><h2 id={`${prefix}-title`}>Історія та результати</h2><p>{isOwnProfile ? "Ваші модулі, спроби тестів і збережені сертифікати." : "Модулі, спроби тестів і збережені сертифікати користувача."}</p></div>
      </header>
      <div className={styles.tabs} role="tablist" aria-label="Розділи історії навчання">
        {tabs.map((item, index) => <button key={item.key} ref={element => { tabRefs.current[index] = element; }}
          id={`${prefix}-tab-${item.key}`} role="tab" type="button" aria-selected={tab === item.key}
          aria-controls={`${prefix}-panel`} tabIndex={tab === item.key ? 0 : -1}
          onClick={() => changeTab(item.key)} onKeyDown={event => onTabKeyDown(event, index)} className={`focus-ring ${styles.tab}`}>
          {item.label}<span>{item.count}</span>
        </button>)}
      </div>
      <div role="tabpanel" id={`${prefix}-panel`} aria-labelledby={`${prefix}-tab-${tab}`}>
        <div className={styles.historyTools}>
          <label className={styles.historySearch}><span className="sr-only">Знайти в історії</span><Search aria-hidden="true" />
            <input type="search" placeholder="Знайти в історії" value={query} className="focus-ring"
              onChange={event => { setQuery(event.target.value); setLimit(PAGE_SIZE); }} />
          </label>
          {tab === "modules" && <label><span className="sr-only">Статус модуля</span>
            <select className="focus-ring" value={status} onChange={event => { setStatus(event.target.value); setLimit(PAGE_SIZE); }}>
              <option value="all">Усі статуси</option><option value="IN_PROGRESS">У процесі</option><option value="COMPLETED">Завершено</option>
            </select></label>}
        </div>
        <div className={styles.historyCount}><p role="status" aria-live="polite">Показано {visible.length} із {filtered.length}</p>
          {hasFilter && <button type="button" className={`focus-ring ${styles.reset}`} onClick={() => { setQuery(""); setStatus("all"); setLimit(PAGE_SIZE); }}>Скинути фільтри</button>}
        </div>
        <div className={styles.historyList}>
          {visible.map(row => {
            const moduleRow = tab === "modules" ? row as ProfileModuleHistory : null;
            const attempt = tab === "attempts" ? row as ProfileAttemptHistory : null;
            const passed = moduleRow?.status === "COMPLETED" || attempt?.passed || tab === "certificates";
            const Icon = tab === "certificates" ? FileBadge2 : passed ? CheckCheck : BookOpen;
            return <article key={row.id} className={styles.historyRow}>
              <span className={`${styles.historyIcon} ${passed ? styles.historyPassed : ""}`}><Icon aria-hidden="true" /></span>
              <div className={styles.rowCopy}>
                <Link href={row.href as Route} aria-label={!isOwnProfile ? `${tab === "certificates" ? "Відкрити сертифікат" : "Відкрити матеріал"}: ${row.title}` : undefined} className={`focus-ring ${styles.historyTitle}`}>{row.title}</Link>
                <div className={styles.historyStatus}>
                  {"brand" in row && <span>{row.brand}</span>}
                  {row.date && <time dateTime={row.date}>{dateFormat.format(new Date(row.date))}</time>}
                  {moduleRow && <span className={passed ? styles.passed : ""}>{passed ? "Завершено" : `${moduleRow.progressPct}% матеріалу переглянуто`}</span>}
                  {attempt && <span className={attempt.passed ? styles.passed : styles.review}>{attempt.passed ? "Тест складено" : isOwnProfile ? "Варто повторити матеріал" : "Тест не складено"}</span>}
                  {tab === "certificates" && <span className={styles.passed}>Відкрити сертифікат →</span>}
                </div>
                {moduleRow && moduleRow.status !== "COMPLETED" && <div className={styles.rowProgress} role="progressbar" aria-label={`Переглянуто матеріал модуля ${moduleRow.title}`} aria-valuenow={moduleRow.progressPct} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${moduleRow.progressPct}%` }} /></div>}
              </div>
              {attempt && <strong className={`${styles.historyScore} ${attempt.passed ? styles.historyScorePassed : ""}`}>{Math.round(attempt.score)}%</strong>}
            </article>;
          })}
        </div>
        {filtered.length === 0 && <div className={styles.empty}>
          <p>{hasFilter ? "За цими умовами нічого не знайдено." : tab === "certificates" ? isOwnProfile ? "Тут зберігатимуться сертифікати після успішного завершення модулів." : "Збережених сертифікатів ще немає." : tab === "attempts" ? "Результати з’являться після першого тесту." : isOwnProfile ? "Оберіть модуль — його прогрес з’явиться тут." : "Користувач ще не розпочав навчальні модулі."}</p>
          {!hasFilter && <Link href="/brands" className="focus-ring">До навчальних матеріалів<ArrowRight className="size-3.5" aria-hidden="true" /></Link>}
        </div>}
        {filtered.length > limit && <button type="button" className={`focus-ring ${styles.showMore}`} onClick={() => setLimit(value => value + PAGE_SIZE)}>
          Показати ще {Math.min(PAGE_SIZE, filtered.length - limit)}<ChevronDown className="size-4" aria-hidden="true" />
        </button>}
      </div>
    </section>
  );
}
