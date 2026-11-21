function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getDday(endDate: string) {
  const today = new Date();
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

export function formatShortDate(value: string) {
  const date = parseDate(value);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}.${day} (${WEEKDAYS[date.getDay()]})`;
}

// '2026-11-25' → '2026.11.25'
export function formatFullDate(value: string) {
  const date = parseDate(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

export function formatPeriod(startDate: string, endDate: string) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const pad = (n: number) => String(n).padStart(2, '0');

  const startText = `${start.getFullYear()}.${pad(start.getMonth() + 1)}.${pad(start.getDate())}`;
  const endText = `${pad(end.getMonth() + 1)}.${pad(end.getDate())}`;
  return `${startText} ~ ${endText}`;
}
