import { color, role } from '@/theme';

export type TeamRole = '개발' | '디자인' | '기획' | '마케팅';
export type ActivityMode = '온라인' | '오프라인' | '온·오프 혼합';

export const TEAM_ROLES: TeamRole[] = ['개발', '디자인', '기획', '마케팅'];

export const ROLE_OPTIONS: Record<TeamRole, string[]> = {
  개발: ['프론트엔드', '백엔드', 'iOS', 'Android', 'AI/데이터'],
  디자인: ['UI/UX', '그래픽', 'BX/브랜딩', '영상/모션'],
  기획: ['서비스 기획', 'PM', '사업 기획'],
  마케팅: ['퍼포먼스', '콘텐츠', 'SNS', '그로스'],
};

export const ROLE_DESCRIPTION: Record<TeamRole, string> = {
  개발: '프론트엔드 · 백엔드 · 앱',
  디자인: 'UI/UX · 그래픽 · 브랜딩',
  기획: '서비스 기획 · PM',
  마케팅: '콘텐츠 · SNS · 그로스',
};

export const ROLE_COLOR: Record<TeamRole, string> = {
  개발: role.dev.base,
  디자인: role.design.base,
  기획: role.plan.base,
  마케팅: role.mkt.base,
};

export const ROLE_TINT: Record<TeamRole, string> = {
  개발: role.dev.tint,
  디자인: role.design.tint,
  기획: role.plan.tint,
  마케팅: role.mkt.tint,
};

export const CREATE_COLOR = {
  brand: color.brand,
  brandStrong: color.brandStrong,
  brandTint: color.brandTint,
  brandSoft: color.brandSoft,
  brandBorder: color.brandBorder,
  ink: color.ink,
  body: color.textBody,
  secondary: color.textSecondary,
  muted: color.textMuted,
  faint: color.textFaint,
  disabled: color.textDisabled,
  line: color.line,
  lineSoft: color.lineSoft,
  surface: color.surface,
  surfaceMuted: color.surfaceMuted,
  surfaceSubtle: color.surfaceSubtle,
  danger: color.danger,
  success: color.success,
  successTint: color.successTint,
} as const;

export const STEP_TITLES: [string, string][] = [
  ['팀 이름', '공모전에 함께할 팀의 이름을 정해주세요.'],
  ['역할과 모집 직군', '내가 맡을 역할과 함께할 직군을 골라주세요.'],
  ['포지션별 인원', '세부 직군마다 몇 명을 뽑을지 정해주세요.'],
  ['활동 방식', '어떻게 함께 일할지 알려주세요. 지원자가 참고해요.'],
  ['팀 소개와 질문', '지원자가 가장 먼저 읽는 글이에요.'],
];

export const ACTIVITY_MODES: [ActivityMode, string][] = [
  ['온라인', '디스코드, 줌 같은 도구로 만나요'],
  ['오프라인', '정해진 장소에서 직접 만나요'],
  ['온·오프 혼합', '평소엔 온라인, 중요한 날엔 오프라인'],
];

export const MEETING_PLACES = ['교내', '서울 전체', '수도권', '상관없음'];
export const COLLABORATION_TOOLS = ['디스코드', '줌', '구글 밋', '노션', '슬랙'];
export const MAX_RECRUIT = 9;
export const MAX_TEAM_NAME_LENGTH = 12;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MAX_QUESTION_COUNT = 5;
export const MAX_QUESTION_LENGTH = 300;

export const INTRO_HINTS: [string, string][] = [
  ['팀 목표', '· 팀 목표: '],
  ['진행 방식', '· 진행 방식: '],
  ['찾는 팀원', '· 이런 분을 찾아요: '],
];

export const QUESTION_SUGGESTIONS = [
  '관련 경험이나 포트폴리오를 공유해주세요.',
  '활동 가능한 요일과 시간대를 알려주세요.',
  '이번 공모전에서 기대하는 점은 무엇인가요?',
];

export const DEFAULT_QUESTIONS = [
  '이 팀에 지원한 이유를 알려주세요.',
  '지원한 포지션에서 맡을 수 있는 역할은 무엇인가요?',
  '프로젝트에 어느 정도 참여하실 수 있나요?',
];
