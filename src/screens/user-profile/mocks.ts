import { MOCK_PEOPLE, type Person } from '@/screens/giuthub';
import {
  ROLE_CATALOG,
  type ActivityHistory,
  type CodeName,
  type PortfolioItem,
} from '@/screens/mypage';

import type { PublicProfileDetail } from './publicProfile';

const PRIMARY_ROLE: Record<Person['role'], CodeName> = {
  개발: { code: 'DEVELOPMENT', name: '개발' },
  디자인: { code: 'DESIGN', name: '디자인' },
  기획: { code: 'PLANNING', name: '기획' },
  마케팅: { code: 'MARKETING', name: '마케팅' },
};

const GRADE: Record<Person['grade'], number> = {
  '1학년': 1,
  '2학년': 2,
  '3학년': 3,
  '4학년': 4,
  졸업생: 5,
};

const ALL_ROLES = Object.values(ROLE_CATALOG).flat();
const roleOf = (name: string) => ALL_ROLES.filter((it) => it.name === name);
const image = (seed: string) => `https://picsum.photos/seed/giut-portfolio-${seed}/800/600`;

// 포트폴리오와 활동 이력이 있는 사람 (나머지는 빈 상태 확인용)
const PORTFOLIOS: Record<string, PortfolioItem[]> = {
  '2': [
    {
      id: 201,
      imageUrl: image('201-1'),
      imageUrls: [image('201-1'), image('201-2'), image('201-3')],
      title: '교내 축제 공식 앱 UX 리디자인',
      caption:
        '학생 30명 인터뷰로 불편한 지점을 찾고, 공연 시간표와 부스 지도를 한 화면에서 볼 수 있게 다시 설계했어요.',
      projectStartDate: '2025-09-01',
      projectEndDate: '2025-11-30',
      teamSize: 5,
      roles: roleOf('UI/UX 디자이너'),
      markdownContent:
        '작년 축제 앱은 시간표와 지도가 따로 있어서 공연을 보러 가는 길을 찾기 어려웠어요.\n\n학생 인터뷰로 자주 쓰는 기능을 추리고, 지금 하는 공연과 위치를 한 화면에 모았어요.',
      skillTags: [
        { id: 211, type: 'SKILL', name: 'Figma' },
        { id: 212, type: 'SKILL', name: 'Protopie' },
      ],
      links: [{ title: '피그마 시안', url: 'https://www.figma.com/example' }],
      showcaseOrder: 1,
      representative: true,
    },
    {
      id: 202,
      imageUrl: null,
      imageUrls: [],
      title: '동네 카페 브랜드 리뉴얼',
      caption: '로고와 메뉴판, 인스타그램 템플릿을 새로 만들었어요.',
      projectStartDate: '2025-03-01',
      projectEndDate: '2025-04-30',
      teamSize: 1,
      roles: roleOf('그래픽 디자이너'),
      markdownContent: '',
      skillTags: [{ id: 213, type: 'SKILL', name: 'Illustrator' }],
      links: [],
      showcaseOrder: 2,
      representative: false,
    },
  ],
};

const ACTIVITIES: Record<string, ActivityHistory[]> = {
  '2': [
    {
      id: 201,
      category: 'AWARD',
      categoryName: '수상',
      title: '대학생 UX 디자인 공모전 장려상',
      organization: '한국디자인진흥원',
      startMonth: '2025-07',
      endMonth: '2025-09',
    },
    {
      id: 202,
      category: 'CLUB',
      categoryName: '동아리',
      title: '교내 디자인 동아리',
      organization: '서울시립대학교',
      startMonth: '2024-03',
      endMonth: '2025-12',
    },
    {
      id: 203,
      category: 'CERTIFICATION',
      categoryName: '자격증',
      title: '컴퓨터그래픽스운용기능사',
      organization: '한국산업인력공단',
      startMonth: '2024-06',
      endMonth: '2024-06',
    },
  ],
};

// 기웃허브 목데이터를 프로필 API 모양으로 바꿔요
function toPublicProfile(person: Person): PublicProfileDetail {
  const userId = Number(person.id);

  return {
    nickname: person.name,
    universityVerified: true,
    receivedProposalCount: 0,
    recommended: false,
    recommendationCount: userId * 7,
    collaborationCount: userId + 2,
    profile: {
      userId,
      nickname: person.name,
      departmentName: person.dept,
      grade: GRADE[person.grade],
      primaryRoles: [PRIMARY_ROLE[person.role]],
      activityStatusName: person.status,
      profileImageUrl: null,
      bio: person.bio,
      searchable: true,
      roles: person.positions.flatMap(roleOf),
      tags: person.tags.map((name, index) => ({ id: userId * 100 + index, type: 'SKILL', name })),
      portfolioItems: PORTFOLIOS[person.id] ?? [],
      activityHistories: ACTIVITIES[person.id] ?? [],
    },
  };
}

export function getPublicProfile(userId: string) {
  const person = MOCK_PEOPLE.find((it) => it.id === userId);
  return person ? toPublicProfile(person) : undefined;
}
