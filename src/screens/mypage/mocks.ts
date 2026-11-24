import { getContestDetail } from '@/screens/contests/detailMocks';
import { getTeam, isTeamClosed } from '@/screens/teams';

import type { CodeName, MyProfile, ProfileTag } from './myProfile';
import type { Scrap } from './scrap';

const ROLE = {
  frontend: { code: 'FRONTEND_DEVELOPER', name: '프론트엔드' },
  data: { code: 'DATA_ANALYST', name: '데이터 분석' },
} satisfies Record<string, CodeName>;

const TAG = {
  python: { id: 1, type: 'SKILL', name: 'Python' },
  sql: { id: 2, type: 'SKILL', name: 'SQL' },
  react: { id: 3, type: 'SKILL', name: 'React' },
  typescript: { id: 4, type: 'SKILL', name: 'TypeScript' },
  pandas: { id: 5, type: 'SKILL', name: 'Pandas' },
  figma: { id: 6, type: 'SKILL', name: 'Figma' },
  git: { id: 7, type: 'SKILL', name: 'Git' },
} satisfies Record<string, ProfileTag>;

export const MOCK_MY_PROFILE: MyProfile = {
  profileCompleted: true,
  universityVerified: true,
  profile: {
    userId: 12,
    nickname: '김민재',
    departmentName: '컴퓨터과학부',
    grade: 3,
    primaryRoles: [{ code: 'DEVELOPMENT', name: '개발' }],
    activityStatusName: '팀 찾는 중',
    profileImageUrl: null,
    bio: '데이터로 문제를 풀고 쓰기 쉬운 서비스로 만드는 걸 좋아해요. 주로 프론트엔드와 데이터 분석을 맡아요. 끝까지 함께 완주할 팀원을 찾고 있어요! 그리고 저는 물범을 좋아합니다. 점박이물범을 좋아합니다. ',
    searchable: true,
    roles: [ROLE.frontend, ROLE.data],
    tags: [TAG.python, TAG.sql, TAG.react, TAG.typescript, TAG.pandas, TAG.figma, TAG.git],
    portfolioItems: [
      {
        id: 15,
        imageUrl: null,
        title: "캠퍼스 분실물 찾기 앱 '찾아줘'",
        caption:
          '교내 분실물 게시판을 지도 기반 앱으로 옮겨, 잃어버린 물건을 더 빨리 찾을 수 있게 만들었어요.',
        projectStartDate: '2025-05-01',
        projectEndDate: '2025-07-31',
        teamSize: 4,
        roles: [ROLE.frontend],
        markdownContent:
          '## 프로젝트 소개\n\n잃어버린 물건의 위치를 지도에 남기고 찾을 수 있는 앱이에요.',
        skillTags: [TAG.typescript, TAG.react, TAG.git],
        showcaseOrder: 1,
        representative: true,
      },
      {
        id: 16,
        imageUrl: null,
        title: '공공데이터로 본 서울 따릉이 수요 예측',
        caption: '따릉이 대여 데이터를 분석해 대여소별 수요를 예측했어요.',
        projectStartDate: '2025-03-01',
        projectEndDate: '2025-03-31',
        teamSize: 3,
        roles: [ROLE.data],
        markdownContent: '## 프로젝트 소개\n\n- 시간대별 이용 패턴 분석\n- 대여소별 수요 예측',
        skillTags: [TAG.python, TAG.pandas, TAG.sql],
        showcaseOrder: 2,
        representative: false,
      },
      {
        id: 17,
        imageUrl: null,
        title: '학과 행사 신청 웹페이지',
        caption: '행사 신청과 명단 관리를 할 수 있는 웹페이지를 만들었어요.',
        projectStartDate: '2024-11-01',
        projectEndDate: '2024-11-30',
        teamSize: 2,
        roles: [ROLE.frontend],
        markdownContent: '## 프로젝트 소개\n\n학과 행사 신청을 한곳에서 받는 웹페이지예요.',
        skillTags: [TAG.react, TAG.figma],
        showcaseOrder: 3,
        representative: false,
      },
    ],
    activityHistories: [
      {
        id: 1,
        category: 'AWARD',
        categoryName: '수상',
        title: '서울시 데이터 활용 공모전 우수상',
        organization: '서울특별시',
        startMonth: '2025-03',
        endMonth: '2025-06',
      },
      {
        id: 2,
        category: 'CERTIFICATION',
        categoryName: '자격증',
        title: 'SQL 개발자(SQLD)',
        organization: '한국데이터산업진흥원',
        startMonth: '2025-09',
        endMonth: '2025-09',
      },
      {
        id: 3,
        category: 'EXTERNAL_ACTIVITY',
        categoryName: '대외활동',
        title: '공공데이터 청년 서포터즈',
        organization: 'OO데이터진흥원',
        startMonth: '2024-07',
        endMonth: '2024-12',
      },
      {
        id: 4,
        category: 'CLUB',
        categoryName: '동아리',
        title: '교내 개발 동아리 프론트엔드 파트',
        organization: '서울시립대학교',
        startMonth: '2024-03',
        endMonth: '2025-02',
      },
    ],
  },
  summary: {
    portfolioCount: 3,
    showcaseCount: 3,
    myTeamCount: 7,
    scrapCount: 9,
    competitionScrapCount: 6,
    teamScrapCount: 3,
    receivedProposalCount: 2,
    receivedRecommendationCount: 24,
    collaborationCount: 7,
  },
};

// 기존 공모전·팀 목데이터를 참조해서 카드를 누르면 상세 화면으로 이동할 수 있어요
function postScrap(contestId: string): Scrap[] {
  const contest = getContestDetail(contestId);
  if (!contest) return [];
  const { activityType, title, org, deadline } = contest;
  return [{ kind: 'post', contestId, activityType, title, org, deadline }];
}

function teamScrap(teamId: string): Scrap[] {
  const team = getTeam(teamId);
  if (!team) return [];
  return [
    {
      kind: 'team',
      teamId,
      name: team.name,
      contestTitle: getContestDetail(team.contestId)?.title ?? '',
      memberCount: team.members.length,
      capacity: team.capacity,
      closed: isTeamClosed(team),
    },
  ];
}

// 게시물 6 + 팀 3 (summary의 개수와 같아요)
export const MOCK_SCRAPS: Scrap[] = [
  ...postScrap('11'),
  ...teamScrap('12'),
  ...postScrap('07'),
  ...postScrap('25'),
  ...teamScrap('7'),
  ...postScrap('08'),
  ...postScrap('26'),
  ...teamScrap('5'),
  ...postScrap('04'),
];
