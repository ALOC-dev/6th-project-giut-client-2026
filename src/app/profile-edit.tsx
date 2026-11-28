import { Redirect, router } from 'expo-router';

import { MOCK_MY_PROFILE } from '@/screens/mypage';
import { ProfileEditScreen } from '@/screens/profile-edit';

export default function ProfileEditRoute() {
  // TODO: API 연결 시 GET /api/userprofile/me/profile로 교체, 로딩 / 실패 화면 추가
  const profile = MOCK_MY_PROFILE.profile;

  // 프로필이 없으면 편집할 게 없어서 마이페이지로
  if (!profile) return <Redirect href="/my" />;

  return (
    <ProfileEditScreen
      key={profile.userId}
      profile={profile}
      onClose={() => router.back()}
      // TODO: API 연결 시 PUT /api/userprofile/me/profile로 저장하고, 저장 중 / 실패 처리 추가
      onSave={() => router.back()}
    />
  );
}
