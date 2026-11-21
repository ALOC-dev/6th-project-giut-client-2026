import { StyleSheet, View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { color, space } from '@/theme';

import { HOME_CATEGORIES } from './categories';

export function CategorySection() {
  return (
    <View style={S.section}>
      <View style={S.header}>
        <Text variant="titleMd">분야별로 둘러보기</Text>
        {/* TODO: 공모전 목록 연결 후 disabled 제거 */}
        <Press
          disabled
          touchSize={20}
          accessibilityRole="button"
          accessibilityLabel="분야 전체 보기"
          accessibilityState={{ disabled: true }}
        >
          <Text variant="caption" color="textMuted">
            전체 보기 ›
          </Text>
        </Press>
      </View>
      <View style={S.grid}>
        {HOME_CATEGORIES.map(({ label, Icon }) => (
          // TODO: 해당 분야로 필터한 공모전 목록 연결 후 disabled 제거
          <Press
            key={label}
            style={S.item}
            disabled
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled: true }}
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
    width: '25%',
    alignItems: 'center',
    gap: space[2],
  },
});
