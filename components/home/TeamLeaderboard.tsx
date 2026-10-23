"use client";

import { useId, useState } from "react";
import { ChevronDown, Trophy } from "lucide-react";
import styles from "./TeamLeaderboard.module.css";

type LeaderboardEntry = {
  userId: string;
  name: string;
  department: string;
  completed: number;
};

function completedLabel(count: number) {
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return "модулів";
  if (last === 1) return "модуль";
  if (last >= 2 && last <= 4) return "модулі";
  return "модулів";
}

export function TeamLeaderboard({ entries, currentUserId }: { entries: LeaderboardEntry[]; currentUserId: string }) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  if (!entries.length) return null;
  const visible = expanded ? entries : entries.slice(0, 5);

  return (
    <details className={`card ${styles.team}`}>
      <summary className="focus-ring">
        <Trophy size={17} aria-hidden="true" />
        <span>Рейтинг команди</span>
        <span className={styles.count} aria-label={`Учасників: ${entries.length}`}>{entries.length}</span>
        <ChevronDown size={16} className={styles.chevron} aria-hidden="true" />
      </summary>
      <p className={styles.description}>Усі учасники порталу · за завершеними модулями</p>
      <ol id={listId} className={styles.leaderboard}>
        {visible.map((row, index) => (
          <li key={row.userId} className={`${styles.leader}${row.userId === currentUserId ? ` ${styles.currentUser}` : ""}`}>
            <span className={styles.rank} aria-hidden="true">{index + 1}</span>
            <div className={styles.copy}>
              <h3>{row.name}{row.userId === currentUserId ? <span className={styles.you}> · Ви</span> : null}</h3>
              {row.department && <p>{row.department}</p>}
            </div>
            <strong>{row.completed}<small>{completedLabel(row.completed)}</small></strong>
          </li>
        ))}
      </ol>
      {entries.length > 5 && (
        <footer className={styles.footer}>
          <span role="status" aria-live="polite">Показано {visible.length} із {entries.length}</span>
          <button type="button" className="focus-ring" aria-expanded={expanded} aria-controls={listId} onClick={() => setExpanded(!expanded)}>
            {expanded ? "Згорнути" : `Показати всіх (${entries.length})`}
            <ChevronDown size={14} className={expanded ? styles.expanded : undefined} aria-hidden="true" />
          </button>
        </footer>
      )}
    </details>
  );
}
