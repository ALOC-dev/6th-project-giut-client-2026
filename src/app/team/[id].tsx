import { useLocalSearchParams } from 'expo-router';

import { getContestDetail } from '@/screens/contests/detailMocks';
import {
  getTeam,
  isTeamClosed,
  TeamBottomBar,
  TeamDetailScreen,
  TeamNotFoundScreen,
} from '@/screens/teams';

export default function TeamDetailRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // TODO: API 연결 시 로딩 / 실패 화면 추가
  const team = id ? getTeam(id) : undefined;
  if (!team) return <TeamNotFoundScreen />;

  const contest = getContestDetail(team.contestId);

  // TODO: 내가 팀장인 팀이면 팀 삭제 / 팀 정보 수정하기 버튼으로 (내 정보 목데이터가 생기면)
  const bottomBar = (
    <TeamBottomBar
      closed={isTeamClosed(team)}
      // TODO: 채팅 화면이 생기면 팀장과의 대화로 이동
      onPressInquiry={() => {}}
      // TODO: 지원하기 화면이 생기면 이동
      onPressApply={() => {}}
    />
  );

  return (
    <TeamDetailScreen
      key={team.id}
      team={team}
      contestTitle={contest?.title}
      bottomBar={bottomBar}
    />
  );
}
