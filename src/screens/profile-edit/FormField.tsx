import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { space } from '@/theme';

type FormFieldProps = {
  label: string;
  hint?: string; // 제목 오른쪽 안내 (예: 최대 3개 선택 가능)
  children: ReactNode;
};

// 프로필 편집의 항목 하나 (제목 + 입력)
export function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <View style={S.field}>
      <View style={S.header}>
        <Text variant="titleSm">{label}</Text>
        {hint && (
          <Text variant="caption" color="textFaint">
            {hint}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}

const S = StyleSheet.create({
  field: {
    gap: space[2.5],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
});
