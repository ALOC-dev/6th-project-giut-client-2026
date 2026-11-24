import { router, useLocalSearchParams } from 'expo-router';

import { ContestDetailScreen, ContestNotFoundScreen } from '@/screens/contest-detail';
import { getContestDetail } from '@/screens/contests/detailMocks';
import { getTeamsByContest } from '@/screens/teams';

export default function ContestDetailRoute() {
  // 주소 파라미터는 배열이나 undefined로 올 수도 있어서 문자열 하나로 정리해요
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // TODO: API 연결 시 로딩 중 / 불러오기 실패 화면을 "존재하지 않는 공모전"과 구분해서 추가
  const contest = id ? getContestDetail(id) : undefined;
  if (!contest) return <ContestNotFoundScreen />;

  return (
    <ContestDetailScreen
      contest={contest}
      teams={getTeamsByContest(contest.id)}
      onCreateTeam={() =>
        router.push({ pathname: '/team/create', params: { contestId: contest.id } })
      }
    />
  );
}
