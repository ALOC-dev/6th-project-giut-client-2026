import { XIcon } from 'phosphor-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Press, Text } from '@/components/ui';
import type { Profile } from '@/screens/mypage';
import { color, space } from '@/theme';

type ProfileEditScreenProps = {
  profile: Profile;
  onClose: () => void;
};

// TODO: 사진, 이름, 학과, 학년, 활동 상태, 역할, 기술 스택, 자기소개, 저장 버튼 추가
export function ProfileEditScreen({ profile, onClose }: ProfileEditScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[S.screen, { paddingTop: insets.top }]}>
      <View style={S.topBar}>
        <Press
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="닫기"
          style={S.closeButton}
        >
          <XIcon size={24} color={color.ink} />
        </Press>
      </View>

      <ScrollView contentContainerStyle={S.content}>
        <Text variant="titleXl" accessibilityRole="header">
          프로필 편집
        </Text>
        <Text color="textMuted">{profile.nickname}</Text>
      </ScrollView>
    </View>
  );
}

const CLOSE_BUTTON_SIZE = 44;

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surface,
  },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: space[2],
  },
  closeButton: {
    width: CLOSE_BUTTON_SIZE,
    height: CLOSE_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: space[5],
    paddingBottom: space[8],
    gap: space[2],
  },
});
