import type { ProfileTag } from '@/screens/mypage';

export const MAX_SKILLS = 10;
export const MAX_SKILL_NAME_LENGTH = 20;

const SKILL_NAMES = [
  'Python',
  'SQL',
  'React',
  'TypeScript',
  'Pandas',
  'Figma',
  'Git',
  'React Native',
  'Expo',
  'Firebase',
  'JavaScript',
  'Next.js',
  'Node.js',
  'Java',
  'Spring',
  'Kotlin',
  'Swift',
  'Flutter',
  'AWS',
  'Docker',
  'Photoshop',
  'Illustrator',
  'Notion',
  'Excel',
];

// 고를 수 있는 기술 스택 (id는 내 프로필 목데이터와 같게 1부터)
// TODO: API 연결 시 GET /api/profile/tags?type=SKILL로 교체
export const MOCK_SKILL_OPTIONS: ProfileTag[] = SKILL_NAMES.map((name, index) => ({
  id: index + 1,
  type: 'SKILL',
  name,
}));

// 같은 기술인지 비교할 때 대소문자와 띄어쓰기는 무시해요 (예: 'react native' = 'React Native')
export function normalizeSkillName(name: string) {
  return name.replace(/\s/g, '').toLowerCase();
}
