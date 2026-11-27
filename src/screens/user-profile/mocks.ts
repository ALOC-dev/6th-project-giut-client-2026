import { MOCK_PEOPLE, type Person } from '@/screens/giuthub';
import { ROLE_CATALOG, type CodeName } from '@/screens/mypage';

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
      roles: person.positions.flatMap((name) => ALL_ROLES.filter((it) => it.name === name)),
      tags: person.tags.map((name, index) => ({ id: userId * 100 + index, type: 'SKILL', name })),
      portfolioItems: [],
      activityHistories: [],
    },
  };
}

export function getPublicProfile(userId: string) {
  const person = MOCK_PEOPLE.find((it) => it.id === userId);
  return person ? toPublicProfile(person) : undefined;
}
