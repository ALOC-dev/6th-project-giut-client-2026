import type { RoleKey } from '@/screens/teams';

// 내 프로필 조회 API(GET /api/userprofile/me/profile) 응답 타입
// 응답 스펙에 null 여부가 없어서, 등록 요청에서 필수가 아닌 값은 null일 수 있다고 봐요

export type CodeName = {
  code: string;
  name: string;
};

export type ProfileTagType = 'SKILL' | 'INTEREST' | 'EXPERIENCE';

export type ProfileTag = {
  id: number;
  type: ProfileTagType;
  name: string;
};

export type PortfolioItem = {
  id: number;
  imageUrl: string | null;
  title: string;
  caption: string;
  projectStartDate: string | null; // 'YYYY-MM-DD'
  projectEndDate: string | null; // 'YYYY-MM-DD'
  teamSize: number | null;
  roles: CodeName[];
  markdownContent: string;
  skillTags: ProfileTag[];
  showcaseOrder: number | null; // 공개 프로필에 보이는 순서. null이면 숨김
  representative: boolean;
};

export type ActivityCategory =
  'AWARD' | 'EXTERNAL_ACTIVITY' | 'CLUB' | 'INTERNSHIP' | 'CERTIFICATION';

export type ActivityHistory = {
  id: number;
  category: ActivityCategory;
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
  grade: number; // 1~5
  primaryRoles: CodeName[]; // 큰 역할 (개발, 디자인 등)
  activityStatusName: string;
  profileImageUrl: string | null;
  bio: string | null; // 최대 200자
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
  competitionScrapCount: number; // 마감된 공모전도 포함
  teamScrapCount: number;
  receivedProposalCount: number;
  receivedRecommendationCount: number;
  collaborationCount: number; // 참여했던 팀의 누적 수 (탈퇴·강퇴한 팀도 포함)
};

export type MyProfile = {
  profileCompleted: boolean;
  universityVerified: boolean;
  profile: Profile | null; // 프로필 미등록이면 null
  summary: ProfileSummary;
};

// TODO: API 연결 시 GET /api/profile/roles(대표 역할별 세부 역할)로 교체
const ROLE_KEY_BY_CODE: Record<string, RoleKey | undefined> = {
  FRONTEND_DEVELOPER: 'dev',
  BACKEND_DEVELOPER: 'dev',
  DATA_ANALYST: 'plan',
};

export function getRoleKey(code: string) {
  return ROLE_KEY_BY_CODE[code];
}

const PRIMARY_ROLE_KEY: Record<string, RoleKey | undefined> = {
  DEVELOPMENT: 'dev',
  DESIGN: 'design',
  PLANNING: 'plan',
  MARKETING: 'mkt',
};

export function getPrimaryRoleKey(profile: Profile) {
  const code = profile.primaryRoles[0]?.code;
  return code ? PRIMARY_ROLE_KEY[code] : undefined;
}
