"use client";

import { getActivityDay, getActivityStreak, shiftActivityDay } from "@/lib/activity-days";

type ActivityHeatmapProps = {
  activityDays: { day: string; count: number }[];
  totalDays?: number;
  today?: string;
};

const DAY_LABELS = ["Пн", "", "Ср", "", "Пт", "", "Нд"];
const MONTH_UA = ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"];

function getCellColor(count: number): string {
  if (count === 0) return "bg-white/[0.04] border-white/[0.04]";
  if (count === 1) return "bg-[rgba(40,178,158,0.25)] border-[rgba(40,178,158,0.2)]";
  if (count === 2) return "bg-[rgba(40,178,158,0.45)] border-[rgba(40,178,158,0.35)]";
  return "bg-[rgba(40,178,158,0.75)] border-[rgba(40,178,158,0.6)]";
}

export function ActivityHeatmap({ activityDays, totalDays = 84, today = getActivityDay() }: ActivityHeatmapProps) {
  const activityMap = new Map(activityDays.map((item) => [item.day, item.count]));

  // Build grid: totalDays cells, padded to start on Monday
  const cells: { date: Date; iso: string; count: number }[] = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const iso = shiftActivityDay(today, -i);
    const d = new Date(`${iso}T12:00:00Z`);
    cells.push({ date: d, iso, count: activityMap.get(iso) ?? 0 });
  }

  // Group into weeks (columns)
  const firstDay = cells[0].date;
  const dayOfWeek = (firstDay.getUTCDay() + 6) % 7;
  const paddedCells: (typeof cells[0] | null)[] = [
    ...Array.from({ length: dayOfWeek }, () => null),
    ...cells
  ];

  const weeks: (typeof cells[0] | null)[][] = [];
  for (let i = 0; i < paddedCells.length; i += 7) {
    weeks.push(paddedCells.slice(i, i + 7));
  }

  // Month labels: find where each month starts
  const monthLabels: { weekIndex: number; month: number }[] = [];
  weeks.forEach((week, wi) => {
    const firstCell = week.find((c) => c !== null);
    if (firstCell) {
      const m = firstCell.date.getUTCMonth();
      const d = firstCell.date.getUTCDate();
      if (d <= 7 && (monthLabels.length === 0 || monthLabels[monthLabels.length - 1].month !== m)) {
        monthLabels.push({ weekIndex: wi, month: m });
      }
    }
  });

  const activeDaysCount = cells.filter((cell) => cell.count > 0).length;
  const streakDays = getActivityStreak(activityMap.keys(), today);

  return (
    <div>
      {/* Статистика */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-500">
        <span>
          <span className="font-semibold text-white">{activeDaysCount}</span> активних днів за {Math.round(totalDays / 7)} тижнів
        </span>
        {streakDays > 1 && (
          <span>
            <span className="font-semibold text-[color:var(--brand-strong)]">{streakDays}</span> днів поспіль
          </span>
        )}
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-max">
          {/* Month labels */}
          <div className="mb-1 flex" style={{ paddingLeft: "1.5rem" }}>
            {weeks.map((_, wi) => {
              const label = monthLabels.find((m) => m.weekIndex === wi);
              return (
                <div key={wi} className="w-4 text-[9px] text-slate-600 mr-0.5">
                  {label ? MONTH_UA[label.month] : ""}
                </div>
              );
            })}
          </div>

          {/* Days */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="h-3.5 w-4 text-[9px] leading-none text-slate-600 flex items-center">
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {Array.from({ length: 7 }).map((_, di) => {
                  const cell = week[di] ?? null;
                  if (!cell) {
                    return <div key={di} className="h-3.5 w-3.5" />;
                  }
                  return (
                    <div
                      key={di}
                      title={`${cell.iso}: ${cell.count > 0 ? `${cell.count} активностей` : "немає активності"}`}
                      className={`h-3.5 w-3.5 rounded-[2px] border transition-opacity hover:opacity-80 ${getCellColor(cell.count)}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-2 flex items-center gap-1.5 text-[9px] text-slate-600">
            <span>Менше</span>
            {[0, 1, 2, 3].map((v) => (
              <div key={v} className={`h-3 w-3 rounded-[2px] border ${getCellColor(v)}`} />
            ))}
            <span>Більше</span>
          </div>
        </div>
      </div>
    </div>
  );
}
