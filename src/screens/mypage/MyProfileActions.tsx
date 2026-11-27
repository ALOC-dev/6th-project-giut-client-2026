import { ExportIcon, PencilSimpleIcon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import { Button, Press } from '@/components/ui';
import { color, radius, shadow, space } from '@/theme';

type MyProfileActionsProps = {
  onPressEdit: () => void;
  onPressShare: () => void;
};

// 내 프로필 카드 아래 버튼 (프로필 편집, 공유)
export function MyProfileActions({ onPressEdit, onPressShare }: MyProfileActionsProps) {
  return (
    <View style={S.actions}>
      <Button
        variant="secondary"
        label="프로필 편집"
        left={<PencilSimpleIcon size={16} color={color.ink} weight="bold" />}
        onPress={onPressEdit}
        style={[S.action, S.edit]}
      />
      <Press
        onPress={onPressShare}
        accessibilityRole="button"
        accessibilityLabel="프로필 공유"
        style={[S.action, S.share]}
      >
        <ExportIcon size={20} color={color.ink} />
      </Press>
    </View>
  );
}

const S = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: space[2],
  },
  action: {
    ...shadow.card,
    height: 48,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.lineSoft,
    backgroundColor: color.surface,
  },
  edit: {
    flex: 1,
  },
  share: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
