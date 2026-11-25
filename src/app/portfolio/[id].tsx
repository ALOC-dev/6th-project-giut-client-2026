import { useLocalSearchParams } from 'expo-router';

import { MOCK_MY_PROFILE } from '@/screens/mypage';
import { PortfolioDetailScreen, PortfolioNotFoundScreen } from '@/screens/portfolio-detail';

export default function PortfolioDetailRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // TODO: API 연결 시 포트폴리오 목록에서 찾기, 로딩 / 실패 화면 추가
  const item = MOCK_MY_PROFILE.profile?.portfolioItems.find((it) => String(it.id) === id);
  if (!item) return <PortfolioNotFoundScreen />;

  return (
    <PortfolioDetailScreen
      key={item.id}
      item={item}
      // TODO: 포트폴리오 편집 화면이 생기면 이동
      onPressEdit={() => {}}
    />
  );
}
