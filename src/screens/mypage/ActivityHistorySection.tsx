import { CaretDownIcon, CaretUpIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Card, Press, Text } from '@/components/ui';
import { color, role } from '@/theme';
import { formatMonthPeriod } from '@/utils/date';

import { S } from './ActivityHistorySection.styles';
import type { ActivityCategory, ActivityHistory } from './myProfile';
import { SectionHeader } from './SectionHeader';

const MAX_VISIBLE = 2;

// 화면에 나오는 순서
const CATEGORY_ORDER: ActivityCategory[] = [
  'AWARD',
  'EXTERNAL_ACTIVITY',
  'CLUB',
  'INTERNSHIP',
  'CERTIFICATION',
];

const BADGE_COLOR: Record<ActivityCategory, { tint: string; text: string }> = {
  AWARD: role.mkt,
  EXTERNAL_ACTIVITY: role.design,
  CLUB: { tint: color.lineSoft, text: color.textSecondary },
  INTERNSHIP: role.plan,
  CERTIFICATION: role.dev,
};

type ActivityHistorySectionProps = {
  items: ActivityHistory[];
  emptyMessage: string;
  onPressEdit?: () => void; // 없으면 편집 버튼 숨김
};

export function ActivityHistorySection({
  items,
  emptyMessage,
  onPressEdit,
}: ActivityHistorySectionProps) {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category).sort(compareLatest),
  })).filter((group) => group.items.length > 0);

  return (
    <View style={S.section}>
      <SectionHeader title="활동 이력" count={items.length} onPressEdit={onPressEdit} />

      {groups.map((group) => (
        <ActivityCard key={group.category} category={group.category} items={group.items} />
      ))}

      {items.length === 0 && (
        <View style={S.empty}>
          <Text color="textMuted" style={S.emptyText}>
            {emptyMessage}
          </Text>
        </View>
      )}
    </View>
  );
}

type ActivityCardProps = {
  category: ActivityCategory;
  items: ActivityHistory[]; // 1개 이상, 최신순
};

// 같은 종류의 활동을 묶은 카드
function ActivityCard({ category, items }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { categoryName } = items[0];
  const hiddenCount = items.length - MAX_VISIBLE;
  const visibleItems = expanded ? items : items.slice(0, MAX_VISIBLE);
  const toggleLabel = expanded ? '접기' : `${hiddenCount}개 더보기`;
  const ToggleIcon = expanded ? CaretUpIcon : CaretDownIcon;

  return (
    <Card corner="2xl" elevation="raised" style={S.card}>
      <View style={[S.badge, { backgroundColor: BADGE_COLOR[category].tint }]}>
        <Text
          variant="badge"
          color={BADGE_COLOR[category].text}
          accessibilityLabel={`${categoryName} ${items.length}개`}
        >
          {items.length > 1 ? `${categoryName} ${items.length}` : categoryName}
        </Text>
      </View>

      {visibleItems.map((item, index) => (
        <ActivityRow key={item.id} item={item} divided={index > 0} />
      ))}

      {hiddenCount > 0 && (
        <Press
          onPress={() => setExpanded((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={`${categoryName} ${toggleLabel}`}
          accessibilityState={{ expanded }}
          style={S.toggle}
        >
          <Text variant="caption" color="textMuted">
            {toggleLabel}
          </Text>
          <ToggleIcon size={14} color={color.textMuted} />
        </Press>
      )}
    </Card>
  );
}

function ActivityRow({ item, divided }: { item: ActivityHistory; divided: boolean }) {
  const period = formatMonthPeriod(item.startMonth, item.endMonth);

  return (
    <View
      style={[S.row, divided ? S.dividedRow : S.firstRow]}
      accessible
      accessibilityLabel={`${item.title}, ${item.organization}, ${period}`}
    >
      <Text variant="titleSm" numberOfLines={2}>
        {item.title}
      </Text>
      <View style={S.meta}>
        <Text variant="caption" color="textMuted" numberOfLines={1} style={S.organization}>
          {item.organization}
        </Text>
        <Text variant="caption" color="textMuted">
          {` · ${period}`}
        </Text>
      </View>
    </View>
  );
}

// 최근에 끝난 활동부터, 같으면 최근에 시작한 활동부터
function compareLatest(a: ActivityHistory, b: ActivityHistory) {
  return b.endMonth.localeCompare(a.endMonth) || b.startMonth.localeCompare(a.startMonth);
}
