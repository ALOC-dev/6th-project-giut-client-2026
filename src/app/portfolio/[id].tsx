import { useLocalSearchParams } from 'expo-router';

import { MOCK_MY_PROFILE } from '@/screens/mypage';
import { PortfolioDetailScreen, PortfolioNotFoundScreen } from '@/screens/portfolio-detail';
import { getPublicProfile } from '@/screens/user-profile';

const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

// userId가 있으면 다른 사람의 포트폴리오, 없으면 내 포트폴리오
export default function PortfolioDetailRoute() {
  const params = useLocalSearchParams<{ id?: string | string[]; userId?: string | string[] }>();
  const id = first(params.id);
  const userId = first(params.userId);

  // TODO: API 연결 시 포트폴리오 목록에서 찾기, 로딩 / 실패 화면 추가
  const items = userId
    ? (getPublicProfile(userId)?.profile.portfolioItems ?? [])
    : (MOCK_MY_PROFILE.profile?.portfolioItems ?? []);
  const item = items.find((it) => String(it.id) === id);
  if (!item) return <PortfolioNotFoundScreen />;

  return (
    <PortfolioDetailScreen
      key={item.id}
      item={item}
      // 다른 사람의 포트폴리오는 편집 버튼 숨김
      // TODO: 포트폴리오 편집 화면이 생기면 이동
      onPressEdit={userId ? undefined : () => {}}
    />
  );
}
