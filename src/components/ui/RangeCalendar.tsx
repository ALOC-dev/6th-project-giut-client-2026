import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronIcon } from '@/components/icons';
import { color, space, text } from '@/theme';

import { Text } from './Text';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const CELL_SIZE = 36;
const CELL_TOUCH_SIZE = 44;
const RANGE_BAND_INSET = (CELL_TOUCH_SIZE - CELL_SIZE) / 2;

type CalendarCell =
  { key: string; day: number; iso: string; timestamp: number } | { key: string; day: null };

export type RangeCalendarProps = {
  from: string | null;
  to: string | null;
  onChange: (next: { from: string | null; to: string | null }) => void;
};

function toIsoDay(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toTimestamp(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
}

function formatAccessibilityDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

function getMonthCells(base: Date): CalendarCell[] {
  const firstWeekday = base.getDay();
  const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const day = index - firstWeekday + 1;

    if (day < 1 || day > daysInMonth) {
      cells.push({ key: `empty-${index}`, day: null });
      continue;
    }

    const date = new Date(base.getFullYear(), base.getMonth(), day);
    cells.push({
      key: `day-${index}`,
      day,
      iso: toIsoDay(date),
      timestamp: date.getTime(),
    });
  }

  return cells;
}

export function RangeCalendar({ from, to, onChange }: RangeCalendarProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const cells = getMonthCells(base);
  const startTimestamp = from ? toTimestamp(from) : null;
  const endTimestamp = to ? toTimestamp(to) : null;

  const selectDay = (timestamp: number, iso: string) => {
    if (timestamp === startTimestamp && timestamp === endTimestamp) {
      onChange({ from: null, to: null });
      return;
    }

    if (timestamp === startTimestamp) {
      onChange(to ? { from: to, to: null } : { from: null, to: null });
      return;
    }

    if (timestamp === endTimestamp) {
      onChange({ from, to: null });
      return;
    }

    if (startTimestamp === null || endTimestamp !== null) {
      onChange({ from: iso, to: null });
      return;
    }

    if (timestamp < startTimestamp) {
      onChange({ from: iso, to: toIsoDay(new Date(startTimestamp)) });
      return;
    }

    onChange({ from: toIsoDay(new Date(startTimestamp)), to: iso });
  };

  return (
    <View>
      <View style={styles.header}>
        <Pressable
          onPress={() => setMonthOffset((current) => current - 1)}
          accessibilityRole="button"
          accessibilityLabel="이전 달"
          style={styles.navigationButton}
        >
          <ChevronIcon dir="left" size={18} />
        </Pressable>
        <Text variant="label">{`${base.getFullYear()}년 ${base.getMonth() + 1}월`}</Text>
        <Pressable
          onPress={() => setMonthOffset((current) => current + 1)}
          accessibilityRole="button"
          accessibilityLabel="다음 달"
          style={styles.navigationButton}
        >
          <ChevronIcon dir="right" size={18} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((weekday, index) => (
          <Text
            key={weekday}
            variant="badge"
            style={[
              styles.weekday,
              { color: index === 0 ? color.daySun : index === 6 ? color.daySat : color.ink },
            ]}
          >
            {weekday}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell) => {
          if (cell.day === null) return <View key={cell.key} style={styles.cell} />;

          const isStart = startTimestamp !== null && cell.timestamp === startTimestamp;
          const isEnd = endTimestamp !== null && cell.timestamp === endTimestamp;
          const isInRange =
            startTimestamp !== null &&
            endTimestamp !== null &&
            cell.timestamp > startTimestamp &&
            cell.timestamp < endTimestamp;
          const isSelected = isStart || isEnd;
          const isSingleDay = isStart && isEnd;
          const hasRange = startTimestamp !== null && endTimestamp !== null;
          const hasLeftBand = isInRange || (isEnd && hasRange && !isSingleDay);
          const hasRightBand = isInRange || (isStart && hasRange && !isSingleDay);
          const selectionLabel = isSingleDay
            ? '시작일 및 종료일'
            : isStart
              ? '시작일'
              : isEnd
                ? '종료일'
                : isInRange
                  ? '선택 범위 내'
                  : null;
          const accessibilityLabel = [formatAccessibilityDate(cell.iso), selectionLabel]
            .filter(Boolean)
            .join(', ');

          return (
            <Pressable
              key={cell.key}
              onPress={() => selectDay(cell.timestamp, cell.iso)}
              accessibilityRole="button"
              accessibilityLabel={accessibilityLabel}
              accessibilityState={{ selected: isSelected || isInRange }}
              style={styles.cell}
            >
              {hasLeftBand && <View style={[styles.band, styles.bandLeft]} />}
              {hasRightBand && <View style={[styles.band, styles.bandRight]} />}
              <View style={[styles.circle, isSelected && styles.circleSelected]}>
                <Text
                  style={[
                    styles.dayText,
                    isSelected && {
                      color: color.surface,
                      fontWeight: text.badge.fontWeight,
                    },
                  ]}
                >
                  {cell.day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[1],
    paddingBottom: space[4.5],
  },
  navigationButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: { flexDirection: 'row', marginBottom: space[4] },
  weekday: { flex: 1, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: space[1] },
  cell: {
    width: `${100 / 7}%`,
    height: CELL_TOUCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  band: {
    position: 'absolute',
    top: RANGE_BAND_INSET,
    bottom: RANGE_BAND_INSET,
    width: '50%',
    backgroundColor: color.brandTint,
  },
  bandLeft: { left: 0 },
  bandRight: { right: 0 },
  circle: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSelected: { backgroundColor: color.brand },
  dayText: { ...text.caption, color: color.ink },
});
