import type { ApplicationCardData } from '@/components/application';

export type TeamKind = 'pending' | 'leader' | 'member' | 'ended';

export type Team = {
  id: string;
  kind: TeamKind;
  role: string;
  name: string;
  contest: string;
  filled: string[];
  total: number;
  newCount?: number;
  dday?: number;
  myPosition?: string;
};

export type TeamFilter = 'all' | 'leader' | 'member' | 'pending';

export type Application = ApplicationCardData;

export type Applicant = Application & {
  id: string;
  appliedAt: string;
};

export type Member = {
  name: string;
  role: string;
  field: string;
  isLeader?: boolean;
  isMe?: boolean;
};

export type ApplicantDecision = 'accepted' | 'rejected';

export const VISIBLE_TEAM_LIMIT = 3;

export const matchesTeamFilter = (team: Team, filter: TeamFilter) =>
  filter === 'all' || team.kind === filter;

export const teamPriority = (team: Team) =>
  (team.kind === 'pending' ? 0 : team.newCount ? 1 : 2) * 1000 + (team.dday ?? 999);
