import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { getContestDetails } from '@/screens/contests/detailMocks';
import { HomeScreen } from '@/screens/home';

export default function HomeRoute() {
  // TODO: API 연결 시 서버에서 받아온 목록으로 교체
  const contests = useMemo(() => getContestDetails(), []);

  // 공모전 탭으로 이동 (push가 아니라 navigate라서 탭이 전환돼요)
  const openContestList = useCallback(() => router.navigate('/contest'), []);

  return <HomeScreen contests={contests} onPressAllContests={openContestList} />;
}
