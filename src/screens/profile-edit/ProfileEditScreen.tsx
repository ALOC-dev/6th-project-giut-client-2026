import { usePreventRemove } from 'expo-router';
import { XIcon } from 'phosphor-react-native';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ScrollViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Press, SegmentedControl, Text } from '@/components/ui';
import { MOCK_DEPARTMENTS } from '@/screens/giuthub';
import type { Profile } from '@/screens/mypage';
import { color, shadow, space } from '@/theme';

import { toActivityStatus } from './activityStatus';
import { ActivityStatusField } from './ActivityStatusField';
import { groupByCollege } from './colleges';
import { confirmLeave } from './confirmLeave';
import { CountedInput } from './CountedInput';
import { CountedTextArea } from './CountedTextArea';
import { DepartmentField } from './DepartmentField';
import { FormField } from './FormField';
import { ProfilePhotoField } from './ProfilePhotoField';
import {
  toUpdateProfileRequest,
  type ProfileForm,
  type UpdateProfileRequest,
} from './profileRequest';
import { RoleField } from './RoleField';
import { MAX_DETAIL_ROLES, toRoleSelection } from './roles';
import { SkillField } from './SkillField';
import { MAX_SKILLS, MOCK_SKILL_OPTIONS } from './skills';

const MAX_NAME_LENGTH = 10;
const MAX_BIO_LENGTH = 200; // API 최대 길이 (시안은 300)
// 키보드가 다 올라온 뒤에 스크롤하려고 기다리는 시간
const KEYBOARD_WAIT_MS = 300;
// 세부 역할 상자를 보여줄 때 화면 아래와 띄울 간격
const REVEAL_MARGIN = space[6];

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
  onSave: (request: UpdateProfileRequest) => void;
};

export function ProfileEditScreen({ profile, onClose, onSave }: ProfileEditScreenProps) {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(profile.nickname);
  const [department, setDepartment] = useState(profile.departmentName);
  const [grade, setGrade] = useState(profile.grade);
  const [activityStatus, setActivityStatus] = useState(() =>
    toActivityStatus(profile.activityStatusName),
  );
  const [roleSelection, setRoleSelection] = useState(() => toRoleSelection(profile));
  const [skills, setSkills] = useState(() =>
    profile.tags.filter(({ type }) => type === 'SKILL').slice(0, MAX_SKILLS),
  );
  const [bio, setBio] = useState(profile.bio ?? '');

  const form: ProfileForm = {
    name,
    department,
    grade,
    activityStatus,
    roleSelection,
    skills,
    bio,
  };
  // 처음 값과 비교해서 바뀐 게 있을 때만 저장할 수 있어요
  const [initialForm] = useState(form);
  const isChanged = JSON.stringify(form) !== JSON.stringify(initialForm);
  const isValid = name.trim().length > 0 && department.length > 0;

  // 바뀐 게 있으면 X, 안드로이드 뒤로 가기, 쓸어서 닫기 모두 확인 창을 먼저 띄워요
  const [leaving, setLeaving] = useState(false);
  const disablePrevention = usePreventRemove(isChanged && !leaving, ({ repeat }) => {
    confirmLeave(() => {
      setLeaving(true);
      repeat();
    });
  });

  const handleSave = () => {
    // 저장하고 나갈 때는 확인 창 없이
    setLeaving(true);
    disablePrevention();
    onSave(toUpdateProfileRequest(profile, form));
  };

  const { height: windowHeight } = useWindowDimensions();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrollY = useRef(0);
  const bottomBarHeight = useRef(0);

  // 새로 열린 세부 역할 상자가 화면 아래(저장 버튼 위)로 넘치면 그만큼만 살짝 스크롤해요
  const revealBottom = (bottomInWindow: number) => {
    const visibleBottom = windowHeight - bottomBarHeight.current - REVEAL_MARGIN;
    const overflow = bottomInWindow - visibleBottom;
    if (overflow <= 0) return;
    scrollRef.current?.scrollTo({ y: scrollY.current + overflow, animated: true });
  };

  // 자기소개는 맨 아래라서 키보드가 올라오면 끝까지 내려서 보여줘요
  const handleBioFocus = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), KEYBOARD_WAIT_MS);
  };

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

      {/* iOS는 키보드 높이만큼 아래를 비워요. 안드로이드는 화면이 알아서 줄어들어요 */}
      <KeyboardAvoidingView style={S.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={S.content}
          keyboardShouldPersistTaps="handled"
          onScroll={(e) => {
            scrollY.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
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

          <FormField label="내 역할" hint={`세부 역할 최대 ${MAX_DETAIL_ROLES}개 선택 가능`}>
            <RoleField value={roleSelection} onChange={setRoleSelection} onReveal={revealBottom} />
          </FormField>

          <FormField label="기술 스택" hint={`${skills.length}/${MAX_SKILLS}개 선택`}>
            <SkillField options={MOCK_SKILL_OPTIONS} value={skills} onChange={setSkills} />
          </FormField>

          <FormField label="자기소개">
            <CountedTextArea
              value={bio}
              onChangeText={setBio}
              maxLength={MAX_BIO_LENGTH}
              label="자기소개"
              placeholder="어떤 일을 좋아하고 어떤 팀원을 찾는지 적어 주세요"
              onFocus={handleBioFocus}
            />
          </FormField>
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        style={[S.bottomBar, { paddingBottom: Math.max(insets.bottom, space[3]) }]}
        onLayout={(e) => {
          bottomBarHeight.current = e.nativeEvent.layout.height;
        }}
      >
        <Button
          label="저장하기"
          disabled={!isChanged || !isValid}
          onPress={handleSave}
          // 파란 그림자는 버튼이 파란색일 때만 (꺼진 회색 버튼에는 없음)
          style={isChanged && isValid && S.saveButton}
        />
      </View>
    </View>
  );
}

const CLOSE_BUTTON_SIZE = 44;

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surface,
  },
  body: {
    flex: 1,
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
  bottomBar: {
    paddingTop: space[3],
    paddingHorizontal: space[5],
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
    backgroundColor: color.surface,
  },
  saveButton: {
    ...shadow.brand,
  },
});
