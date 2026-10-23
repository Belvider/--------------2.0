"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight, Check, ChevronDown, Layers3 } from "lucide-react";
import type { LearningOverview } from "@/lib/learning-overview";
import styles from "./LearningDirections.module.css";

const filters = [
  { id: "all", label: "Усі" },
  { id: "started", label: "Розпочаті" },
  { id: "completed", label: "Завершені" }
] as const;

export function LearningDirections({ brands }: { brands: LearningOverview["brands"] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [expanded, setExpanded] = useState(false);
  if (!brands.length) return null;
  const filtered = brands.filter(brand => filter === "all" || (filter === "completed"
    ? brand.completed === brand.total && brand.total > 0
    : brand.inProgress > 0 || brand.completed > 0 && brand.completed < brand.total));
  const visible = expanded ? filtered : filtered.slice(0, 4);

  return (
    <section className={styles.directions} aria-labelledby="learning-directions-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}><Layers3 size={14} aria-hidden="true" />Карта знань</p>
          <h2 id="learning-directions-title">Ваші напрями</h2>
          <p className={styles.description}>Оберіть бренд, щоб продовжити навчання.</p>
        </div>
        <div className={styles.filters} aria-label="Фільтр напрямів">
          {filters.map(item => <button key={item.id} type="button" aria-pressed={filter === item.id}
            className="focus-ring" onClick={() => { setFilter(item.id); setExpanded(false); }}>{item.label}</button>)}
        </div>
      </header>
      <div className={styles.grid}>
        {visible.map(brand => (
          <Link href={("/brands/" + brand.slug) as Route} key={brand.id} className={`focus-ring ${styles.direction}`}>
            <div className={styles.brandLine}>
              <span className={styles.monogram} aria-hidden="true">{brand.name.slice(0, 2)}</span>
              <h3>{brand.name}</h3>
              {brand.progressPct === 100 ? <Check size={15} className={styles.complete} aria-hidden="true" /> : <ArrowUpRight size={15} aria-hidden="true" />}
            </div>
            <div className={styles.bar} role="progressbar" aria-label={`${brand.name}: завершені модулі`}
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={brand.progressPct}>
              <span style={{ width: brand.progressPct + "%" }} />
            </div>
            <div className={styles.caption}><span>{brand.completed} із {brand.total}</span><strong>{brand.progressPct}%</strong></div>
          </Link>
        ))}
      </div>
      {!filtered.length && <p className={styles.empty}>{filter === "completed"
        ? "Завершені напрями з’являться тут після проходження всіх модулів бренду."
        : "Виберіть напрям у вкладці «Усі», щоб почати навчання."}</p>}
      <footer className={styles.footer}>
        <span role="status" aria-live="polite">Показано {visible.length} із {filtered.length}</span>
        {filtered.length > 4 && <button type="button" className="focus-ring" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Згорнути" : "Показати всі"}<ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : undefined }} aria-hidden="true" />
        </button>}
      </footer>
    </section>
  );
}
