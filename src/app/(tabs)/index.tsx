import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';

import type { ActivityType } from '@/screens/contests/contest';
import { getContestDetails } from '@/screens/contests/detailMocks';
import { HomeScreen } from '@/screens/home';

export default function HomeRoute() {
  // TODO: API 연결 시 서버에서 받아온 목록으로 교체
  const contests = useMemo(() => getContestDetails(), []);

  // 공모전 탭으로 이동 (navigate라서 화면이 쌓이지 않고 탭이 바뀌어요)
  // key: 같은 분야를 다시 눌러도 목록 화면이 새 요청으로 알아보도록 매번 바꿔요
  const openContestList = useCallback((activityType?: ActivityType) => {
    router.navigate({
      pathname: '/contest',
      params: { activity: activityType ?? 'ALL', key: String(Date.now()) },
    });
  }, []);

  return <HomeScreen contests={contests} onOpenContestList={openContestList} />;
}
