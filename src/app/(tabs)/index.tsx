import { useMemo } from 'react';

import { getContestDetails } from '@/screens/contests/detailMocks';
import { HomeScreen } from '@/screens/home';

export default function HomeRoute() {
  // TODO: API 연결 시 서버에서 받아온 목록으로 교체
  const contests = useMemo(() => getContestDetails(), []);

  return <HomeScreen contests={contests} />;
}
