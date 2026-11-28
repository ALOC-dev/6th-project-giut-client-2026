import type { ActivityCategory, Profile, ProfileTag } from '@/screens/mypage/myProfile';

import type { ActivityStatus } from './activityStatus';
import { fromRoleSelection, type RoleSelection } from './roles';

// 편집 화면에서 고치는 값
export type ProfileForm = {
  name: string;
  department: string;
  grade: number;
  activityStatus: ActivityStatus;
  roleSelection: RoleSelection;
  skills: ProfileTag[];
  bio: string;
};

// 프로필 수정 API(PUT /api/userprofile/me/profile) 요청 모양
export type UpdateProfileRequest = {
  // TODO: 지금 API는 이름과 학과를 바꾸지 않아요. 백엔드가 지원하면 맞추기
  nickname: string;
  department: string;
  grade: number;
  activityStatus: ActivityStatus;
  primaryRoles: string[];
  roles: string[];
  profileImageUrl: string | null;
  bio: string;
  searchable: boolean;
  skillTagIds: number[];
  interestTagIds: number[];
  experienceTagIds: number[];
  activityHistories: {
    category: ActivityCategory;
    title: string;
    organization: string;
    startMonth: string;
    endMonth: string;
  }[];
};

const tagIdsOf = (profile: Profile, type: ProfileTag['type']) =>
  profile.tags.filter((tag) => tag.type === type).map(({ id }) => id);

// 수정 API는 보낸 값으로 통째로 덮어써요
// 그래서 화면에 없는 값(관심 분야, 활동 경험, 활동 이력, 공개 여부, 사진)은 처음 값을 그대로 보내요
// TODO: 백엔드가 부분 수정(PATCH)을 지원하면 화면에서 고친 값만 보내기
export function toUpdateProfileRequest(original: Profile, form: ProfileForm): UpdateProfileRequest {
  const { primaryRoles, roles } = fromRoleSelection(form.roleSelection);

  return {
    // 화면에서 고친 값
    nickname: form.name.trim(),
    department: form.department,
    grade: form.grade,
    activityStatus: form.activityStatus,
    primaryRoles,
    roles,
    bio: form.bio.trim(),
    skillTagIds: form.skills.map(({ id }) => id),

    // 화면에 없는 값은 처음 값 그대로
    profileImageUrl: original.profileImageUrl,
    searchable: original.searchable,
    interestTagIds: tagIdsOf(original, 'INTEREST'),
    experienceTagIds: tagIdsOf(original, 'EXPERIENCE'),
    // 활동 이력은 다시 보내면 서버에서 id가 새로 생겨요
    activityHistories: original.activityHistories.map(
      ({ category, title, organization, startMonth, endMonth }) => ({
        category,
        title,
        organization,
        startMonth,
        endMonth,
      }),
    ),
  };
}
