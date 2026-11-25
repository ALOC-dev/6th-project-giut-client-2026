import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { color, radius, space } from '@/theme';
import { formatMonthPeriod } from '@/utils/date';

import type { ActivityHistory } from './myProfile';
import { SectionHeader } from './SectionHeader';

type ActivityHistorySectionProps = {
  items: ActivityHistory[];
  emptyMessage: string;
  onPressEdit?: () => void; // 없으면 편집 버튼 숨김
};

// 수상, 대외활동, 동아리, 인턴, 자격증
export function ActivityHistorySection({
  items,
  emptyMessage,
  onPressEdit,
}: ActivityHistorySectionProps) {
  // 최근에 끝난 활동부터
  const sorted = [...items].sort((a, b) => b.endMonth.localeCompare(a.endMonth));

  return (
    <View style={S.section}>
      <SectionHeader title="활동 이력" count={items.length} onPressEdit={onPressEdit} />

      {items.length > 0 ? (
        <Card corner="2xl" elevation="raised" padding={0} style={S.card}>
          {sorted.map((item, index) => (
            <ActivityRow key={item.id} item={item} divided={index > 0} />
          ))}
        </Card>
      ) : (
        <View style={S.empty}>
          <Text color="textMuted" style={S.emptyText}>
            {emptyMessage}
          </Text>
        </View>
      )}
    </View>
  );
}

function ActivityRow({ item, divided }: { item: ActivityHistory; divided: boolean }) {
  const period = formatMonthPeriod(item.startMonth, item.endMonth);

  return (
    <View
      style={[S.row, divided && S.rowDivider]}
      accessible
      accessibilityLabel={`${item.categoryName}, ${item.title}, ${item.organization}, ${period}`}
    >
      <View style={S.badge}>
        <Text variant="badge" color="brandStrong">
          {item.categoryName}
        </Text>
      </View>
      <Text variant="label" numberOfLines={2}>
        {item.title}
      </Text>
      <Text variant="caption" color="textMuted" numberOfLines={1}>
        {item.organization} · {period}
      </Text>
    </View>
  );
}

const S = StyleSheet.create({
  section: {
    gap: space[3],
  },
  card: {
    borderWidth: 1,
    borderColor: color.lineSoft,
  },
  row: {
    alignItems: 'flex-start',
    gap: space[1],
    paddingVertical: space[3.5],
    marginHorizontal: space[4],
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  badge: {
    paddingVertical: space[0.5],
    paddingHorizontal: space[2],
    borderRadius: radius.sm,
    backgroundColor: color.brandTint,
  },
  empty: {
    paddingVertical: space[8],
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});
