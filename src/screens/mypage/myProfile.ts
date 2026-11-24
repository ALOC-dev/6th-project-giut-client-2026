import { ROLE_LABEL, type RoleKey } from '@/screens/teams';

// 내 프로필 조회 API 응답 타입
// TODO: 전체 코드 목록(enum)과 null 가능 여부가 확인되면 string을 좁히기

export type CodeName = {
  code: string;
  name: string;
};

export type ProfileTag = {
  id: number;
  type: string;
  name: string;
};

export type PortfolioItem = {
  id: number;
  imageUrl: string | null;
  title: string;
  caption: string;
  projectStartDate: string; // 'YYYY-MM-DD'
  projectEndDate: string; // 'YYYY-MM-DD'
  teamSize: number;
  roles: CodeName[];
  markdownContent: string;
  skillTags: ProfileTag[];
  showcaseOrder: number;
  representative: boolean;
};

export type ActivityHistory = {
  id: number;
  category: string;
  categoryName: string;
  title: string;
  organization: string;
  startMonth: string; // 'YYYY-MM'
  endMonth: string; // 'YYYY-MM'
};

export type Profile = {
  userId: number;
  nickname: string;
  departmentName: string;
  grade: number;
  primaryRoles: CodeName[]; // 큰 역할 (개발, 디자인 등)
  activityStatusName: string;
  profileImageUrl: string | null;
  bio: string; // 최대 200자
  searchable: boolean;
  roles: CodeName[]; // 세부 포지션
  tags: ProfileTag[];
  portfolioItems: PortfolioItem[];
  activityHistories: ActivityHistory[];
};

export type ProfileSummary = {
  portfolioCount: number;
  showcaseCount: number;
  myTeamCount: number;
  scrapCount: number;
  competitionScrapCount: number;
  teamScrapCount: number;
  receivedProposalCount: number;
  receivedRecommendationCount: number;
  collaborationCount: number;
};

export type MyProfile = {
  profileCompleted: boolean;
  universityVerified: boolean;
  profile: Profile;
  summary: ProfileSummary;
};

// TODO: API가 세부 포지션의 큰 역할도 내려주면 제거 (지금은 응답에 없어서 색을 직접 연결)
const ROLE_KEY_BY_CODE: Record<string, RoleKey | undefined> = {
  FRONTEND_DEVELOPER: 'dev',
  BACKEND_DEVELOPER: 'dev',
  DATA_ANALYST: 'plan',
};

export function getRoleKey(code: string) {
  return ROLE_KEY_BY_CODE[code];
}

export function getPrimaryRoleKey(profile: Profile) {
  const name = profile.primaryRoles[0]?.name;
  return (Object.keys(ROLE_LABEL) as RoleKey[]).find((key) => ROLE_LABEL[key] === name);
}
