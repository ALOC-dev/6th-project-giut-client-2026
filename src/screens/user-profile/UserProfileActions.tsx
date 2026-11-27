import { ChatCenteredTextIcon, UserPlusIcon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui';
import { color, radius, shadow, space } from '@/theme';

type UserProfileActionsProps = {
  onPressPropose: () => void;
  onPressMessage: () => void;
};

// 다른 사람 프로필 카드 아래 버튼 (팀 제안 보내기, 메시지 보내기)
export function UserProfileActions({ onPressPropose, onPressMessage }: UserProfileActionsProps) {
  return (
    <View style={S.actions}>
      <Button
        label="팀 제안 보내기"
        left={<UserPlusIcon size={18} color={color.surface} weight="bold" />}
        onPress={onPressPropose}
        style={[S.action, S.propose]}
      />
      <Button
        variant="secondary"
        label="메시지 보내기"
        left={<ChatCenteredTextIcon size={18} color={color.ink} />}
        onPress={onPressMessage}
        style={[S.action, S.message]}
      />
    </View>
  );
}

const S = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: space[2],
  },
  action: {
    flex: 1,
    height: 48,
    paddingHorizontal: space[2],
    borderRadius: radius.xl,
  },
  propose: {
    ...shadow.brand,
  },
  message: {
    ...shadow.card,
    borderWidth: 1,
    borderColor: color.lineSoft,
    backgroundColor: color.surface,
  },
});
