import { StyleSheet, View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { CATEGORIES } from '@/constants/category';
import { color, space } from '@/theme';

export function CategorySection() {
  return (
    <View style={S.section}>
      <View style={S.header}>
        <Text variant="titleMd">분야별로 둘러보기</Text>
        <Text variant="caption" color="textMuted">
          전체 보기 ›
        </Text>
      </View>
      <View style={S.grid}>
        {CATEGORIES.map(({ label, Icon }) => (
          <Press key={label} style={S.item} onPress={() => {}}>
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
