import { router } from 'expo-router';

import {
  MOCK_APPLICATION,
  MOCK_APPLICANTS,
  MOCK_MEMBERS,
  MOCK_TEAMS,
  MyTeamScreen,
} from '@/screens/myteam';

export default function TeamScreen() {
  return (
    <MyTeamScreen
      teams={MOCK_TEAMS}
      application={MOCK_APPLICATION}
      applicants={MOCK_APPLICANTS}
      members={MOCK_MEMBERS}
      onBrowseContests={() => router.navigate('/contest')}
      onOpenTeam={(team) => router.push({ pathname: '/team/[id]', params: { id: team.id } })}
    />
  );
}
