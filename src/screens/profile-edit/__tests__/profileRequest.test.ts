import type { Profile } from '@/screens/mypage/myProfile';

import { toUpdateProfileRequest, type ProfileForm } from '../profileRequest';

const original: Profile = {
  userId: 12,
  nickname: '김민재',
  departmentName: '컴퓨터과학부',
  grade: 3,
  primaryRoles: [{ code: 'DEVELOPMENT', name: '개발' }],
  activityStatusName: '팀 찾는 중',
  profileImageUrl: 'https://example.com/me.png',
  bio: '원래 자기소개',
  searchable: true,
  roles: [{ code: 'FRONTEND_DEVELOPER', name: '프론트엔드 개발자' }],
  tags: [
    { id: 1, type: 'SKILL', name: 'Python' },
    { id: 41, type: 'INTEREST', name: '관심 분야' },
    { id: 46, type: 'EXPERIENCE', name: '활동 경험' },
  ],
  portfolioItems: [],
  activityHistories: [
    {
      id: 1,
      category: 'AWARD',
      categoryName: '수상',
      title: '데이터 공모전 우수상',
      organization: '서울특별시',
      startMonth: '2025-03',
      endMonth: '2025-06',
    },
  ],
};

const form: ProfileForm = {
  name: '  새 이름 ',
  department: '통계학과',
  grade: 4,
  activityStatus: 'RESTING',
  roleSelection: { primaryKeys: ['design'], roles: ['UI_UX_DESIGNER'] },
  skills: [{ id: 3, type: 'SKILL', name: 'React' }],
  bio: ' 바꾼 자기소개 ',
};

describe('toUpdateProfileRequest', () => {
  it('uses the edited values from the form', () => {
    const request = toUpdateProfileRequest(original, form);

    expect(request.nickname).toBe('새 이름');
    expect(request.department).toBe('통계학과');
    expect(request.grade).toBe(4);
    expect(request.activityStatus).toBe('RESTING');
    expect(request.primaryRoles).toEqual(['DESIGN']);
    expect(request.roles).toEqual(['UI_UX_DESIGNER']);
    expect(request.skillTagIds).toEqual([3]);
    expect(request.bio).toBe('바꾼 자기소개');
  });

  it('keeps values that the screen does not edit', () => {
    const request = toUpdateProfileRequest(original, form);

    expect(request.interestTagIds).toEqual([41]);
    expect(request.experienceTagIds).toEqual([46]);
    expect(request.searchable).toBe(true);
    expect(request.profileImageUrl).toBe('https://example.com/me.png');
    expect(request.activityHistories).toEqual([
      {
        category: 'AWARD',
        title: '데이터 공모전 우수상',
        organization: '서울특별시',
        startMonth: '2025-03',
        endMonth: '2025-06',
      },
    ]);
  });
});
