/** Opening hours in America/Sao_Paulo (minutes from midnight). 0 = Sunday. */
const SCHEDULE: Record<number, [number, number] | null> = {
  0: null,
  1: [9 * 60, 18 * 60 + 30],
  2: [9 * 60, 18 * 60 + 30],
  3: [9 * 60, 18 * 60 + 30],
  4: [9 * 60, 18 * 60 + 30],
  5: [9 * 60, 18 * 60 + 30],
  6: [8 * 60, 17 * 60],
};

const WEEKDAY: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function spParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: WEEKDAY[get("weekday")] ?? 0, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}`;

/** Ignores holidays — those are communicated through notices. */
export function openingStatus(now: Date = new Date()): { open: boolean; label: string } {
  const { day, minutes } = spParts(now);
  const today = SCHEDULE[day];
  if (today && minutes >= today[0] && minutes < today[1]) return { open: true, label: `Aberto agora · até ${fmt(today[1])}` };
  if (today && minutes < today[0]) return { open: false, label: `Fechado · abre hoje às ${fmt(today[0])}` };
  for (let i = 1; i <= 7; i++) {
    const next = SCHEDULE[(day + i) % 7];
    if (next) return { open: false, label: `Fechado · abre ${i === 1 ? "amanhã" : "segunda"} às ${fmt(next[0])}` };
  }
  return { open: false, label: "Fechado" };
}
