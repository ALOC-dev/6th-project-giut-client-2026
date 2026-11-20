import { color } from '@/theme';

import type { Role, Status } from './types';

export const ROLE_COLOR: Record<Role, { main: string; tint: string; text: string }> = {
  개발: { main: color.roleDev, tint: color.roleDevTint, text: color.roleDevText },
  디자인: { main: color.roleDesign, tint: color.roleDesignTint, text: color.roleDesignText },
  기획: { main: color.rolePlan, tint: color.rolePlanTint, text: color.rolePlanText },
  마케팅: { main: color.roleMkt, tint: color.roleMktTint, text: color.roleMktText },
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  개발: '프론트 · 백엔드 · AI',
  디자인: 'UI/UX · 그래픽 · 리서치',
  기획: '서비스 · PM · 데이터',
  마케팅: '콘텐츠 · SNS · 브랜딩',
};

export const STATUS_DESCRIPTION: Record<Status, string> = {
  '팀 찾는 중': '지금 함께할 팀을 찾고 있어요',
  '둘러보는 중': '좋은 제안이 오면 생각해볼게요',
  '팀 있음': '이미 팀에 속해 있어요',
};

export const DEPARTMENTS = [
  { code: 'PUBLIC_ADMINISTRATION', name: '행정학과' },
  { code: 'INTERNATIONAL_RELATIONS', name: '국제관계학과' },
  { code: 'ECONOMICS', name: '경제학부' },
  { code: 'SOCIAL_WELFARE', name: '사회복지학과' },
  { code: 'TAXATION', name: '세무학과' },
  { code: 'BUSINESS_ADMINISTRATION', name: '경영학부' },
  { code: 'ELECTRICAL_AND_COMPUTER_ENGINEERING', name: '전자전기컴퓨터공학부' },
  { code: 'CHEMICAL_ENGINEERING', name: '화학공학과' },
  { code: 'MECHANICAL_AND_INFORMATION_ENGINEERING', name: '기계정보공학과' },
  { code: 'MATERIALS_SCIENCE_AND_ENGINEERING', name: '신소재공학과' },
  { code: 'CIVIL_ENGINEERING', name: '토목공학과' },
  { code: 'ENGLISH_LANGUAGE_AND_LITERATURE', name: '영어영문학과' },
  { code: 'KOREAN_LANGUAGE_AND_LITERATURE', name: '국어국문학과' },
  { code: 'KOREAN_HISTORY', name: '국사학과' },
  { code: 'PHILOSOPHY', name: '철학과' },
  { code: 'CHINESE_LANGUAGE_AND_CULTURE', name: '중국어문화학과' },
  { code: 'MATHEMATICS', name: '수학과' },
  { code: 'STATISTICS', name: '통계학과' },
  { code: 'PHYSICS', name: '물리학과' },
  { code: 'LIFE_SCIENCE', name: '생명과학과' },
  { code: 'ENVIRONMENTAL_HORTICULTURE', name: '환경원예학과' },
  { code: 'CONVERGENCE_APPLIED_CHEMISTRY', name: '융합응용화학과' },
  { code: 'URBAN_ADMINISTRATION', name: '도시행정학과' },
  { code: 'URBAN_SOCIOLOGY', name: '도시사회학과' },
  { code: 'ARCHITECTURE', name: '건축학부' },
  { code: 'URBAN_ENGINEERING', name: '도시공학과' },
  { code: 'TRANSPORTATION_ENGINEERING', name: '교통공학과' },
  { code: 'LANDSCAPE_ARCHITECTURE', name: '조경학과' },
  { code: 'ENVIRONMENTAL_ENGINEERING', name: '환경공학부' },
  { code: 'GEOINFORMATICS_ENGINEERING', name: '공간정보공학과' },
  { code: 'DESIGN', name: '디자인학과' },
  { code: 'SCULPTURE', name: '조각학과' },
  { code: 'MUSIC', name: '음악학과' },
  { code: 'SPORTS_SCIENCE', name: '스포츠과학과' },
  { code: 'LIBERAL_STUDIES', name: '자유전공학부' },
  { code: 'CONVERGENCE_STUDIES', name: '융합전공학부' },
  { code: 'COMPUTER_SCIENCE', name: '컴퓨터과학부' },
  { code: 'ARTIFICIAL_INTELLIGENCE', name: '인공지능학과' },
  { code: 'ADVANCED_CONVERGENCE', name: '첨단융합학부' },
] as const;

export const DEPARTMENT_NAMES = DEPARTMENTS.map((department) => department.name).sort(
  (left, right) => left.localeCompare(right, 'ko'),
);

export const LOADING_CAPTIONS = [
  '함께할 사람들을 찾고 있어요',
  '관심 분야가 맞는 사람을 고르는 중',
  '프로필을 정리하고 있어요',
];
