import { useLocalSearchParams } from 'expo-router';

import { getContestDetail } from '@/screens/contests/detailMocks';
import { getTeam, TeamDetailScreen, TeamNotFoundScreen } from '@/screens/teams';

export default function TeamDetailRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // TODO: API 연결 시 로딩 / 실패 화면 추가
  const team = id ? getTeam(id) : undefined;
  if (!team) return <TeamNotFoundScreen />;

  const contest = getContestDetail(team.contestId);

  // TODO: 하단 버튼 (팀장에게 문의 / 지원하기). 보는 사람(팀장·팀원·지원자)에 따라 여기서 바꿔 넣어요
  return <TeamDetailScreen team={team} contestTitle={contest?.title} />;
}
