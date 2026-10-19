"use client";

import Link from "next/link";
import { ArrowUpRight, ChartNoAxesColumnIncreasing } from "lucide-react";
import { useState, type CSSProperties } from "react";
import styles from "./LearningPulse.module.css";

type ActivityDay = {
  day: string;
  modulesCount: number;
  isToday: boolean;
};

type LearningPulseProps = {
  days: ActivityDay[];
  className?: string;
};

const DAY_LABELS = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const dateFormat = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric", month: "long", timeZone: "Europe/Kyiv"
});
const accessibleDateFormat = new Intl.DateTimeFormat("uk-UA", {
  weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Kyiv"
});
const modulePlural = new Intl.PluralRules("uk-UA");

function moduleCountLabel(count: number) {
  const form = modulePlural.select(count);
  return count + " " + (form === "one" ? "модуль" : form === "few" ? "модулі" : "модулів");
}

function dayDate(day: string) {
  const date = new Date(day + "T12:00:00Z");
  return Number.isNaN(date.getTime()) ? null : date;
}

export function LearningPulse({ days, className }: LearningPulseProps) {
  const activity = days.map((day) => ({
    ...day,
    modulesCount: Number.isFinite(day.modulesCount) ? Math.max(0, Math.floor(day.modulesCount)) : 0
  }));
  const defaultDay = activity.find((day) => day.isToday) ?? activity.at(-1);
  const [selectedDay, setSelectedDay] = useState<string | null>(() => defaultDay?.day ?? null);
  const selected = activity.find((day) => day.day === selectedDay) ?? defaultDay;
  const selectedDate = selected ? dayDate(selected.day) : null;
  const maximum = Math.max(1, ...activity.map((day) => day.modulesCount));
  const activeDays = activity.filter((day) => day.modulesCount > 0).length;

  return (
    <section className={[styles.pulse, className].filter(Boolean).join(" ")} aria-label="Навчальний ритм">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}><ChartNoAxesColumnIncreasing size={14} aria-hidden="true" /> Останні 7 днів</p>
          <h2>Навчальний ритм</h2>
        </div>
        <span className={styles.activeDays}><strong>{activeDays}</strong><span>/ 7 днів</span></span>
      </div>

      {activity.length > 0 ? (
        <div className={styles.chart} role="group" aria-label="Виберіть день, щоб переглянути активність">
          {activity.map((day) => {
            const date = dayDate(day.day);
            const isSelected = selected?.day === day.day;
            const ratio = day.modulesCount / maximum;
            const barStyle = { "--bar-height": day.modulesCount > 0 ? Math.max(12, ratio * 100) + "%" : "3px" } as CSSProperties;
            return (
              <button
                key={day.day}
                type="button"
                className={[styles.day, isSelected ? styles.selected : "", day.isToday ? styles.today : ""].filter(Boolean).join(" ")}
                aria-pressed={isSelected}
                aria-label={(date ? accessibleDateFormat.format(date) : day.day) + ": " + moduleCountLabel(day.modulesCount) + (day.isToday ? ", сьогодні" : "")}
                onClick={() => setSelectedDay(day.day)}
              >
                <span className={styles.barArea} aria-hidden="true">
                  <span className={[styles.bar, day.modulesCount === 0 ? styles.zero : ""].filter(Boolean).join(" ")} style={barStyle} />
                </span>
                <span className={styles.dayLabel}>{date ? DAY_LABELS[date.getUTCDay()] : "—"}</span>
                <span className={styles.todayDot} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      ) : <p className={styles.empty}>Активність з’явиться після перегляду навчальних матеріалів.</p>}

      <div className={styles.selection} aria-live="polite" aria-atomic="true">
        <p>{selected ? (selected.isToday ? "Сьогодні · " : "") + (selectedDate ? dateFormat.format(selectedDate) : selected.day) : "За останні 7 днів"}</p>
        <strong>{moduleCountLabel(selected?.modulesCount ?? 0)}<span> у навчанні</span></strong>
      </div>
      <div className={styles.footer}>
        <p>Дні, коли ви працювали з матеріалами.</p>
        <Link href="/profile" className={styles.historyLink}>Історія <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
