import { XIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Press, Text } from '@/components/ui';
import type { Profile } from '@/screens/mypage';
import { color, space } from '@/theme';

import { CountedInput } from './CountedInput';
import { FormField } from './FormField';
import { ProfilePhotoField } from './ProfilePhotoField';

const MAX_NAME_LENGTH = 10;

type ProfileEditScreenProps = {
  profile: Profile;
  onClose: () => void;
};

// TODO: 학과, 학년, 활동 상태, 역할, 기술 스택, 자기소개, 저장 버튼 추가
export function ProfileEditScreen({ profile, onClose }: ProfileEditScreenProps) {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(profile.nickname);

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

      <ScrollView contentContainerStyle={S.content} keyboardShouldPersistTaps="handled">
        <Text variant="titleXl" accessibilityRole="header">
          프로필 편집
        </Text>

        <ProfilePhotoField
          imageUrl={profile.profileImageUrl}
          // TODO: 사진 선택 기능과 이미지 업로드 API가 생기면 연결
          onPressEdit={() => {}}
        />

        <FormField label="이름">
          <CountedInput
            value={name}
            onChangeText={setName}
            maxLength={MAX_NAME_LENGTH}
            label="이름"
            placeholder="이름을 입력해 주세요"
          />
        </FormField>
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
    gap: space[6],
  },
});
