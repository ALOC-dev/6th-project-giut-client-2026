import { getContestDetail } from '@/screens/contests/detailMocks';
import { getTeam, isTeamClosed } from '@/screens/teams';

import type { CodeName, MyProfile, ProfileTag } from './myProfile';
import type { Scrap } from './scrap';

const ROLE = {
  frontend: { code: 'FRONTEND_DEVELOPER', name: '프론트엔드 개발자' },
  data: { code: 'DATA_ANALYST', name: '데이터 분석' },
  service: { code: 'SERVICE_PLANNER', name: '서비스 기획' },
} satisfies Record<string, CodeName>;

const TAG = {
  python: { id: 1, type: 'SKILL', name: 'Python' },
  sql: { id: 2, type: 'SKILL', name: 'SQL' },
  react: { id: 3, type: 'SKILL', name: 'React' },
  typescript: { id: 4, type: 'SKILL', name: 'TypeScript' },
  pandas: { id: 5, type: 'SKILL', name: 'Pandas' },
  figma: { id: 6, type: 'SKILL', name: 'Figma' },
  git: { id: 7, type: 'SKILL', name: 'Git' },
  reactNative: { id: 8, type: 'SKILL', name: 'React Native' },
  expo: { id: 9, type: 'SKILL', name: 'Expo' },
  firebase: { id: 10, type: 'SKILL', name: 'Firebase' },
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
    roles: [ROLE.frontend, ROLE.data, ROLE.service],
    tags: [TAG.python, TAG.sql, TAG.react, TAG.typescript, TAG.pandas, TAG.figma, TAG.git],
    portfolioItems: [
      {
        id: 15,
        imageUrl: 'https://picsum.photos/seed/giut-portfolio-15-1/800/600',
        imageUrls: [
          'https://picsum.photos/seed/giut-portfolio-15-1/800/600',
          'https://picsum.photos/seed/giut-portfolio-15-2/800/600',
          'https://picsum.photos/seed/giut-portfolio-15-3/800/600',
          'https://picsum.photos/seed/giut-portfolio-15-4/800/600',
          'https://picsum.photos/seed/giut-portfolio-15-5/800/600',
        ],
        title: "캠퍼스 분실물 찾기 앱 '찾아줘'",
        caption:
          '교내 분실물 게시판을 지도 기반 앱으로 옮겨, 잃어버린 물건을 더 빨리 찾을 수 있게 만들었어요.',
        projectStartDate: '2025-05-01',
        projectEndDate: '2025-07-31',
        teamSize: 4,
        roles: [ROLE.frontend],
        markdownContent:
          "교내 분실물은 학과 게시판, 단톡방, 학생회 SNS에 흩어져 올라와서 정작 주인이 찾기 어려웠어요. '찾아줘'는 분실물과 습득물을 지도 위에 모아, 잃어버린 위치 근처의 물건을 바로 확인할 수 있게 만든 앱이에요.\n\n프론트엔드를 맡아 지도 화면과 등록 화면을 만들었어요. 물건이 많아지면 지도가 느려져서, 가까운 물건을 하나로 묶어 보여주는 방식으로 바꿨어요.\n\n학과 학생 30명과 2주 동안 써 보고 의견을 모았고, 등록 단계를 5단계에서 3단계로 줄였어요.",
        skillTags: [TAG.reactNative, TAG.typescript, TAG.expo, TAG.firebase, TAG.figma],
        links: [
          { title: 'GitHub 저장소', url: 'https://github.com/example/chajajwo' },
          { title: '시연 영상', url: 'https://youtu.be/example' },
          { title: '발표 자료', url: 'https://drive.google.com/file/example' },
        ],
        showcaseOrder: 1,
        representative: true,
      },
      {
        id: 16,
        imageUrl: 'https://picsum.photos/seed/giut-portfolio-16-1/800/600',
        imageUrls: ['https://picsum.photos/seed/giut-portfolio-16-1/800/600'],
        title: '공공데이터로 본 서울 따릉이 수요 예측',
        caption: '따릉이 대여 데이터를 분석해 대여소별 수요를 예측했어요.',
        projectStartDate: '2025-03-01',
        projectEndDate: '2025-03-31',
        teamSize: 3,
        roles: [ROLE.data],
        markdownContent:
          '서울시 따릉이 대여 데이터를 모아 시간대별 이용 패턴을 분석했어요.\n날씨와 요일을 함께 넣어 대여소별 수요를 예측했어요.',
        skillTags: [TAG.python, TAG.pandas, TAG.sql],
        links: [
          { title: '분석 결과 페이지', url: 'https://example.com/seoul-bike-demand-forecast-2025' },
        ],
        showcaseOrder: 2,
        representative: false,
      },
      {
        id: 17,
        imageUrl: null,
        imageUrls: [],
        title: '학과 행사 신청 웹페이지',
        caption: '행사 신청과 명단 관리를 할 수 있는 웹페이지를 만들었어요.',
        projectStartDate: '2024-11-01',
        projectEndDate: '2024-11-30',
        teamSize: 2,
        roles: [ROLE.frontend],
        markdownContent: '',
        skillTags: [TAG.react, TAG.figma],
        links: [],
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
      {
        id: 5,
        category: 'INTERNSHIP',
        categoryName: '인턴',
        title: '프론트엔드 개발 인턴',
        organization: 'OO소프트',
        startMonth: '2025-12',
        endMonth: '2026-02',
      },
      {
        id: 6,
        category: 'CERTIFICATION',
        categoryName: '자격증',
        title: 'TOEIC',
        organization: 'ETS',
        startMonth: '2026-03',
        endMonth: '2026-03',
      },
      {
        id: 7,
        category: 'CERTIFICATION',
        categoryName: '자격증',
        title: '데이터분석 준전문가(ADsP)',
        organization: '한국데이터산업진흥원',
        startMonth: '2025-11',
        endMonth: '2025-11',
      },
      {
        id: 8,
        category: 'CERTIFICATION',
        categoryName: '자격증',
        title: '컴퓨터활용능력 1급',
        organization: '대한상공회의소',
        startMonth: '2024-08',
        endMonth: '2024-08',
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

// 프로필 미등록 상태 확인용
export const MOCK_EMPTY_PROFILE: MyProfile = {
  profileCompleted: false,
  universityVerified: false,
  profile: null,
  summary: {
    portfolioCount: 0,
    showcaseCount: 0,
    myTeamCount: 0,
    scrapCount: 0,
    competitionScrapCount: 0,
    teamScrapCount: 0,
    receivedProposalCount: 0,
    receivedRecommendationCount: 0,
    collaborationCount: 0,
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
