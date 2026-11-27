import { useLocalSearchParams } from 'expo-router';

import {
  getPublicProfile,
  UserProfileNotFoundScreen,
  UserProfileScreen,
} from '@/screens/user-profile';

export default function UserProfileRoute() {
  const params = useLocalSearchParams<{ userId?: string | string[] }>();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;

  // TODO: API 연결 시 GET /api/profile/{userId}로 교체, 로딩 / 실패 화면 추가
  const detail = userId ? getPublicProfile(userId) : undefined;
  if (!detail) return <UserProfileNotFoundScreen />;

  return (
    <UserProfileScreen
      key={detail.profile.userId}
      detail={detail}
      // TODO: 공유 / 신고 / 차단 메뉴 추가
      onPressMore={() => {}}
      // TODO: 팀 제안 화면이 생기면 이동
      onPressPropose={() => {}}
      // TODO: 채팅 화면이 생기면 이 사람과의 대화로 이동
      onPressMessage={() => {}}
    />
  );
}
