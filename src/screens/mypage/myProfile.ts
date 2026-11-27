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

export type PortfolioLink = {
  title: string;
  url: string;
};

export type PortfolioItem = {
  id: number;
  imageUrl: string | null; // 목록에 보이는 이미지
  // TODO: 아직 API에 없는 값. 백엔드와 정해지면 맞추기 (최대 10장)
  imageUrls: string[];
  title: string;
  caption: string;
  projectStartDate: string | null; // 'YYYY-MM-DD'
  projectEndDate: string | null; // 'YYYY-MM-DD'
  teamSize: number | null;
  roles: CodeName[];
  markdownContent: string; // API 이름은 markdown이지만 일반 글로 보여줘요
  skillTags: ProfileTag[];
  // TODO: 아직 API에 없는 값. 백엔드와 정해지면 맞추기 (최대 5개)
  links: PortfolioLink[];
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
  roles: CodeName[]; // 세부 역할 (최대 3개, 첫 번째가 프로필 색)
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

// 큰 역할별 세부 역할. 프로필에는 세부 역할을 최대 3개까지 고르고, 첫 번째가 프로필 색을 정해요
// TODO: API 연결 시 GET /api/profile/roles로 교체. 프론트엔드, 백엔드, 데이터 분석 외의 코드는 임시
export const ROLE_CATALOG: Record<RoleKey, CodeName[]> = {
  dev: [
    { code: 'BACKEND_DEVELOPER', name: '백엔드 개발자' },
    { code: 'FRONTEND_DEVELOPER', name: '프론트엔드 개발자' },
    { code: 'MOBILE_DEVELOPER', name: '모바일 개발자' },
    { code: 'DATA_ANALYST', name: '데이터 분석' },
    { code: 'DATA_ENGINEER', name: '데이터 엔지니어' },
    { code: 'AI_ENGINEER', name: 'AI 엔지니어' },
  ],
  design: [
    { code: 'UI_UX_DESIGNER', name: 'UI/UX 디자이너' },
    { code: 'GRAPHIC_DESIGNER', name: '그래픽 디자이너' },
    { code: 'PRODUCT_DESIGNER', name: '프로덕트 디자이너' },
  ],
  plan: [
    { code: 'SERVICE_PLANNER', name: '서비스 기획' },
    { code: 'BUSINESS_PLANNER', name: '사업 기획' },
    { code: 'PROJECT_MANAGER', name: '프로젝트 매니저' },
  ],
  mkt: [
    { code: 'DIGITAL_MARKETER', name: '디지털 마케터' },
    { code: 'CONTENT_MARKETER', name: '콘텐츠 마케터' },
    { code: 'BRAND_MARKETER', name: '브랜드 마케터' },
  ],
};

const ROLE_KEYS = Object.keys(ROLE_CATALOG) as RoleKey[];

// 세부 역할 코드 → 큰 역할
export function getRoleKey(code: string) {
  return ROLE_KEYS.find((key) => ROLE_CATALOG[key].some((it) => it.code === code));
}

const PRIMARY_ROLE_KEY: Record<string, RoleKey | undefined> = {
  DEVELOPMENT: 'dev',
  DESIGN: 'design',
  PLANNING: 'plan',
  MARKETING: 'mkt',
};

// 프로필 색을 정하는 큰 역할. 첫 번째 세부 역할 기준, 없으면 대표 역할
export function getPrimaryRoleKey(profile: Profile) {
  const first = profile.roles[0];
  if (first) return getRoleKey(first.code);
  const code = profile.primaryRoles[0]?.code;
  return code ? PRIMARY_ROLE_KEY[code] : undefined;
}
