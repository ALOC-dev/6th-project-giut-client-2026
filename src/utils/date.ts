function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// base: 기준 날짜 (기본은 지금)
export function getDday(endDate: string, base: Date = new Date()) {
  const today = new Date(base);
  today.setHours(0, 0, 0, 0);
  const diff = parseDate(endDate).getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function formatDday(endDate: string) {
  const dday = getDday(endDate);
  if (dday < 0) return '마감';
  if (dday === 0) return 'D-DAY';
  return `D-${dday}`;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// '2026-11-10' → '11.10'
export function formatMonthDay(value: string) {
  const date = parseDate(value);
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

// '2026-11-10' → '화'
export function formatWeekday(value: string) {
  return WEEKDAYS[parseDate(value).getDay()];
}

// '2026-11-10' → '11.10 (화)'
export function formatShortDate(value: string) {
  return `${formatMonthDay(value)} (${formatWeekday(value)})`;
}

// '2026-11-25' → '2026.11.25'
export function formatFullDate(value: string) {
  const date = parseDate(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

// '2025-05-01' → '2025.05'
function formatYearMonth(value: string) {
  return formatFullDate(value).slice(0, 7);
}

// '2025-05-01', '2025-07-31' → '2025.05 – 2025.07' (같은 달이면 '2025.05')
export function formatMonthPeriod(startDate: string, endDate: string) {
  const start = formatYearMonth(startDate);
  const end = formatYearMonth(endDate);
  return start === end ? start : `${start} – ${end}`;
}

export function formatPeriod(startDate: string, endDate: string) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const pad = (n: number) => String(n).padStart(2, '0');

  const startText = `${start.getFullYear()}.${pad(start.getMonth() + 1)}.${pad(start.getDate())}`;
  const endText = `${pad(end.getMonth() + 1)}.${pad(end.getDate())}`;
  return `${startText} ~ ${endText}`;
}
