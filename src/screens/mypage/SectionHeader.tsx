import { StyleSheet, View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { color, radius, shadow, space } from '@/theme';

const EDIT_BUTTON_HEIGHT = 36;

type SectionHeaderProps = {
  title: string;
  count: number;
  onPressEdit?: () => void; // 없으면 편집 버튼 숨김
};

// 마이페이지 구역 제목 (포트폴리오, 활동 이력, 스크랩)
export function SectionHeader({ title, count, onPressEdit }: SectionHeaderProps) {
  return (
    <View style={S.wrap}>
      <Text variant="titleLg" accessibilityRole="header">
        {title}
        <Text variant="titleLg" color="textFaint">
          {` ${count}`}
        </Text>
      </Text>
      {onPressEdit && (
        <Press
          onPress={onPressEdit}
          touchSize={EDIT_BUTTON_HEIGHT}
          accessibilityRole="button"
          accessibilityLabel={`${title} 편집`}
          style={S.editButton}
        >
          <Text variant="caption">편집</Text>
        </Press>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    minHeight: EDIT_BUTTON_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    ...shadow.control,
    height: EDIT_BUTTON_HEIGHT,
    paddingHorizontal: space[3.5],
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: color.surface,
  },
});
