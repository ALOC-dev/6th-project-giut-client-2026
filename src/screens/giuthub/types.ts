import { color } from '@/theme';

export const ROLES = ['개발', '디자인', '기획', '마케팅'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_COLOR: Record<Role, { main: string; tint: string; text: string }> = {
  개발: { main: color.roleDev, tint: color.roleDevTint, text: color.roleDevText },
  디자인: { main: color.roleDesign, tint: color.roleDesignTint, text: color.roleDesignText },
  기획: { main: color.rolePlan, tint: color.rolePlanTint, text: color.rolePlanText },
  마케팅: { main: color.roleMkt, tint: color.roleMktTint, text: color.roleMktText },
};

export const GRADES = ['1학년', '2학년', '3학년', '4학년', '졸업생'] as const;
export type Grade = (typeof GRADES)[number];

export const STATUSES = ['팀 찾는 중', '둘러보는 중', '팀 있음'] as const;
export type Status = (typeof STATUSES)[number];

export type Person = {
  id: string;
  name: string;
  dept: string;
  bio: string;
  tags: string[];
  role: Role;
  grade: Grade;
  status: Status;
};

export type HubFilter = {
  roles: Role[];
  depts: string[];
  grades: Grade[];
  statuses: Status[];
  query: string;
};

export const EMPTY_HUB_FILTER: HubFilter = {
  roles: [],
  depts: [],
  grades: [],
  statuses: [],
  query: '',
};

export function countHubFilters(filter: HubFilter) {
  return filter.roles.length + filter.depts.length + filter.grades.length + filter.statuses.length;
}

export function matchesHubFilter(person: Person, filter: HubFilter) {
  if (filter.roles.length && !filter.roles.includes(person.role)) return false;
  if (filter.depts.length && !filter.depts.includes(person.dept)) return false;
  if (filter.grades.length && !filter.grades.includes(person.grade)) return false;
  if (filter.statuses.length && !filter.statuses.includes(person.status)) return false;

  const query = filter.query.trim().toLocaleLowerCase('ko');

  if (!query) return true;

  return [person.name, person.dept, person.bio, person.tags.join(' ')]
    .join(' ')
    .toLocaleLowerCase('ko')
    .includes(query);
}
