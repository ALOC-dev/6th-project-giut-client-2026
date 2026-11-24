import type { role } from '@/theme';
import { getDday } from '@/utils/date';

export type RoleKey = keyof typeof role;

export type Member = {
  id: string;
  name: string;
  role: RoleKey;
  position: string;
  isLeader: boolean;
};

export type RecruitingRole = {
  role: RoleKey;
  position: string;
  count: number;
};

export type OperationMethod = 'offline' | 'online' | 'both';

export type ActivityFrequency = '주 1회' | '주 2회' | '주 3회' | '주 4회+';

export type ActivityPlace = '교내' | '서울 전체' | '수도권' | '상관 없음';

export type CooperationTool = '디스코드' | '줌' | '구글 밋' | '노션' | '슬랙';

export type Team = {
  id: string;
  contestId: string;
  name: string;
  capacity: number;
  recruitEndDate: string;
  members: Member[];
  recruitingRoles: RecruitingRole[];
  description: string;
  operationMethod: OperationMethod;
  activityFrequency: ActivityFrequency;
  activityPlace: ActivityPlace;
  cooperationTools: CooperationTool[];
};

export const OPERATION_LABEL: Record<OperationMethod, string> = {
  online: '온라인',
  offline: '오프라인',
  both: '온라인 + 오프라인',
};

export const ROLE_LABEL: Record<RoleKey, string> = {
  dev: '개발',
  design: '디자인',
  plan: '기획',
  mkt: '마케팅',
};

// 세부 포지션별 모집 인원을 큰 역할별로 합쳐요
export function getRecruitingCounts(team: Team) {
  const counts = new Map<RoleKey, number>();
  team.recruitingRoles.forEach(({ role: key, count }) => {
    counts.set(key, (counts.get(key) ?? 0) + count);
  });
  return Array.from(counts, ([key, count]) => ({ role: key, count }));
}

export function isTeamClosed(team: Team) {
  return getDday(team.recruitEndDate) < 0 || team.members.length >= team.capacity;
}
