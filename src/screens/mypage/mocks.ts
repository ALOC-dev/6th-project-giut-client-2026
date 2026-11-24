import type { CodeName, MyProfile, ProfileTag } from './myProfile';

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
        title: '서울시 데이터 공모전 발표',
        caption: '데이터 분석과 발표를 담당했어요.',
        projectStartDate: '2026-03-01',
        projectEndDate: '2026-06-30',
        teamSize: 4,
        roles: [ROLE.frontend, ROLE.data],
        markdownContent:
          '## 프로젝트 소개\n\n따릉이 대여 데이터를 분석해 대여소별 수요를 예측했어요.\n\n- 시간대별 이용 패턴 분석\n- 결과를 볼 수 있는 대시보드 제작',
        skillTags: [TAG.python, TAG.pandas, TAG.react],
        showcaseOrder: 1,
        representative: true,
      },
      {
        id: 16,
        imageUrl: null,
        title: '캠퍼스 빈 강의실 찾기',
        caption: '지도 화면과 시간표 검색을 만들었어요.',
        projectStartDate: '2025-09-01',
        projectEndDate: '2025-12-20',
        teamSize: 5,
        roles: [ROLE.frontend],
        markdownContent:
          '## 프로젝트 소개\n\n지금 비어 있는 강의실을 지도에서 찾아주는 서비스예요.',
        skillTags: [TAG.typescript, TAG.react, TAG.git],
        showcaseOrder: 2,
        representative: false,
      },
      {
        id: 17,
        imageUrl: null,
        title: '학식 만족도 분석 리포트',
        caption: '설문 데이터를 정리하고 시각화했어요.',
        projectStartDate: '2025-03-10',
        projectEndDate: '2025-05-31',
        teamSize: 3,
        roles: [ROLE.data],
        markdownContent: '## 프로젝트 소개\n\n재학생 설문을 바탕으로 학식 만족도를 분석했어요.',
        skillTags: [TAG.python, TAG.sql],
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
