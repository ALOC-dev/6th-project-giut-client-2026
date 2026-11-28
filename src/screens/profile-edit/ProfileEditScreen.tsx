import { XIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Press, SegmentedControl, Text } from '@/components/ui';
import { MOCK_DEPARTMENTS } from '@/screens/giuthub';
import type { Profile } from '@/screens/mypage';
import { color, space } from '@/theme';

import { toActivityStatus } from './activityStatus';
import { ActivityStatusField } from './ActivityStatusField';
import { groupByCollege } from './colleges';
import { CountedInput } from './CountedInput';
import { DepartmentField } from './DepartmentField';
import { FormField } from './FormField';
import { ProfilePhotoField } from './ProfilePhotoField';

const MAX_NAME_LENGTH = 10;

// TODO: API 연결 시 GET /api/departments로 교체
const COLLEGES = groupByCollege(MOCK_DEPARTMENTS);

// API의 학년은 1~5, 5는 졸업
const GRADE_SEGMENTS = [
  { key: '1', label: '1학년' },
  { key: '2', label: '2학년' },
  { key: '3', label: '3학년' },
  { key: '4', label: '4학년' },
  { key: '5', label: '졸업' },
];

type ProfileEditScreenProps = {
  profile: Profile;
  onClose: () => void;
};

// TODO: 역할, 기술 스택, 자기소개, 저장 버튼 추가
export function ProfileEditScreen({ profile, onClose }: ProfileEditScreenProps) {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(profile.nickname);
  const [department, setDepartment] = useState(profile.departmentName);
  const [grade, setGrade] = useState(profile.grade);
  const [activityStatus, setActivityStatus] = useState(() =>
    toActivityStatus(profile.activityStatusName),
  );

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

        <FormField label="학과">
          <DepartmentField value={department} colleges={COLLEGES} onChange={setDepartment} />
          <SegmentedControl
            segments={GRADE_SEGMENTS}
            value={String(grade)}
            onChange={(key) => setGrade(Number(key))}
          />
        </FormField>

        <FormField label="활동 상태">
          <ActivityStatusField value={activityStatus} onChange={setActivityStatus} />
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
