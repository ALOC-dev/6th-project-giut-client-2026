import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { space } from '@/theme';

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

// 제목이 있는 구역 (사용 기술, 프로젝트 설명)
export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <View style={S.wrap}>
      <Text variant="titleMd" accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    paddingTop: space[7],
    paddingHorizontal: space[5],
    gap: space[3],
  },
});
