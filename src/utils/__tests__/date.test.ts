import {
  formatDday,
  formatFullDate,
  formatMonthDay,
  formatMonthPeriod,
  formatPeriod,
  formatShortDate,
  formatWeekday,
  getDday,
} from '@/utils/date';

describe('date utilities', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('calculates D-day from the start of the base date', () => {
    const base = new Date(2026, 10, 25, 23, 59, 59);

    expect(getDday('2026-11-25', base)).toBe(0);
    expect(getDday('2026-11-26', base)).toBe(1);
    expect(getDday('2026-11-24', base)).toBe(-1);
  });

  it('formats deadline labels', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 10, 25, 12));

    expect(formatDday('2026-11-24')).toBe('마감');
    expect(formatDday('2026-11-25')).toBe('D-DAY');
    expect(formatDday('2026-11-28')).toBe('D-3');
  });

  it('formats dates used by contest and profile screens', () => {
    expect(formatMonthDay('2026-11-10')).toBe('11.10');
    expect(formatWeekday('2026-11-10')).toBe('화');
    expect(formatShortDate('2026-11-10')).toBe('11.10 (화)');
    expect(formatFullDate('2026-01-05')).toBe('2026.01.05');
    expect(formatPeriod('2026-01-05', '2026-02-09')).toBe('2026.01.05 ~ 02.09');
  });

  it('removes duplicate months from a profile period', () => {
    expect(formatMonthPeriod('2026-05-01', '2026-05-31')).toBe('2026.05');
    expect(formatMonthPeriod('2026-05-01', '2026-07-31')).toBe('2026.05 – 2026.07');
    expect(formatMonthPeriod(null, null)).toBe('');
  });
});
