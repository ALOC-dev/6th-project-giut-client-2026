import { StyleSheet, View } from 'react-native';

import { Press, Text } from '@/components/ui';
import type { ActivityType } from '@/screens/contests/contest';
import { color, space } from '@/theme';

import { HOME_CATEGORIES } from './categories';

type CategorySectionProps = {
  onPressAll: () => void;
  onPressCategory: (activityType: ActivityType) => void;
};

export function CategorySection({ onPressAll, onPressCategory }: CategorySectionProps) {
  return (
    <View style={S.section}>
      <View style={S.header}>
        <Text variant="titleLg">분야별로 둘러보기</Text>
        <Press
          onPress={onPressAll}
          touchSize={20}
          accessibilityRole="button"
          accessibilityLabel="공모전 전체 보기"
        >
          <Text variant="caption" color="textMuted">
            전체 보기 ›
          </Text>
        </Press>
      </View>
      <View style={S.grid}>
        {HOME_CATEGORIES.map(({ label, Icon, activityType }) => (
          <Press
            key={label}
            style={S.item}
            onPress={() => onPressCategory(activityType)}
            accessibilityRole="button"
            accessibilityLabel={`${label} 목록 보기`}
          >
            <Icon size={24} color={color.ink} />
            <Text variant="caption">{label}</Text>
          </Press>
        ))}
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  section: {
    paddingTop: space[6],
    gap: space[3],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space[4],
  },
  grid: {
    paddingTop: space[4],
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: space[4],
    rowGap: space[5],
  },
  item: {
    width: '20%',
    alignItems: 'center',
    paddingBottom: space[2.5],
    gap: space[2],
  },
});
