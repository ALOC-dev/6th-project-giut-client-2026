import type { Team } from '@/types/team';

import { getDday } from './date';

// 모집 마감: 모집 기간이 지났거나, 정원이 다 찼을 때
export function isTeamClosed(team: Team) {
  return getDday(team.recruitEndDate) < 0 || team.members.length >= team.capacity;
}
