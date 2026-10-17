const ACTIVITY_TIME_ZONE = "Europe/Kyiv";

/** Calendar dates use the portal timezone, independently of server/browser timezone. */
export function getActivityDay(value: Date | string | number = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: ACTIVITY_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function shiftActivityDay(day: string, offset: number) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function getActivityStreak(days: Iterable<string>, today = getActivityDay()) {
  const active = new Set(days);
  let current = active.has(today) ? today : shiftActivityDay(today, -1);
  let streak = 0;
  while (active.has(current)) {
    streak += 1;
    current = shiftActivityDay(current, -1);
  }
  return streak;
}
