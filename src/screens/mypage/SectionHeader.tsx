import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';

type SectionHeaderProps = {
  title: string;
  count: number;
  right?: ReactNode;
};

// 마이페이지 구역 제목 (포트폴리오, 내 팀, 스크랩)
export function SectionHeader({ title, count, right }: SectionHeaderProps) {
  return (
    <View style={S.wrap}>
      <Text variant="titleLg" accessibilityRole="header">
        {title}
        <Text variant="titleLg" color="textFaint">
          {` ${count}`}
        </Text>
      </Text>
      {right}
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
