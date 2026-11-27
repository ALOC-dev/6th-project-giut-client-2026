import { useLocalSearchParams } from 'expo-router';

import { MOCK_PEOPLE } from '@/screens/giuthub';
import { UserProfileNotFoundScreen, UserProfileScreen } from '@/screens/user-profile';

export default function UserProfileRoute() {
  const params = useLocalSearchParams<{ userId?: string | string[] }>();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;

  // TODO: API 연결 시 GET /api/profile/{userId}로 교체, 로딩 / 실패 화면 추가
  const person = MOCK_PEOPLE.find((it) => it.id === userId);
  if (!person) return <UserProfileNotFoundScreen />;

  return <UserProfileScreen key={person.id} name={person.name} />;
}
