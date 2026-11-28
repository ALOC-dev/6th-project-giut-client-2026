import { getRoleKey, ROLE_CATALOG, type CodeName, type Profile } from '@/screens/mypage';
import type { RoleKey } from '@/screens/teams';

// 세부 역할은 큰 역할에 상관없이 합쳐서 최대 3개. 처음 고른 세부 역할이 프로필 색을 정해요
export const MAX_DETAIL_ROLES = 3;

export const ROLE_KEYS: RoleKey[] = ['dev', 'design', 'plan', 'mkt'];

// 큰 역할의 API 코드
const PRIMARY_ROLE_CODE: Record<RoleKey, string> = {
  dev: 'DEVELOPMENT',
  design: 'DESIGN',
  plan: 'PLANNING',
  mkt: 'MARKETING',
};

export type RoleSelection = {
  primaryKeys: RoleKey[]; // 펼친 큰 역할
  roles: string[]; // 고른 세부 역할 코드 (고른 순서)
};

export function getDetailRoles(key: RoleKey): CodeName[] {
  return ROLE_CATALOG[key];
}

// 프로필의 큰 역할과, 세부 역할이 속한 큰 역할을 펼친 채로 시작해요
export function toRoleSelection(profile: Profile): RoleSelection {
  const roles = profile.roles.map(({ code }) => code).slice(0, MAX_DETAIL_ROLES);
  const primaryKeys = ROLE_KEYS.filter(
    (key) =>
      profile.primaryRoles.some(({ code }) => code === PRIMARY_ROLE_CODE[key]) ||
      roles.some((code) => getRoleKey(code) === key),
  );
  return { primaryKeys, roles };
}

// 저장할 때 API 모양으로 바꿔요
export function fromRoleSelection({ primaryKeys, roles }: RoleSelection) {
  return {
    primaryRoles: primaryKeys.map((key) => PRIMARY_ROLE_CODE[key]),
    roles,
  };
}
