export const ACTIVITY_TYPES = [
  'COMPETITION',
  'CONTEST',
  'HACKATHON',
  'SUPPORTERS',
  'VOLUNTEERING',
  'STARTUP',
  'EDUCATION_PROGRAM',
  'OVERSEAS_EXPLORATION',
  'EVENT_NETWORKING',
  'ETC',
  'NOT_ACTIVITY',
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const CATEGORIES = [
  'PLANNING_IDEA',
  'ADVERTISING_MARKETING',
  'AI_DATA',
  'PAPER_REPORT',
  'VIDEO_UCC_PHOTO',
  'DESIGN_CHARACTER_WEBTOON',
  'WEB_MOBILE_IT',
  'GAME_SOFTWARE',
  'SCIENCE_ENGINEERING',
  'LITERATURE_WRITING_SCENARIO',
  'ARCHITECTURE_CONSTRUCTION_INTERIOR',
  'NAMING_SLOGAN',
  'ENTERTAINMENT_ART_MUSIC',
  'ETC',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CONTEST_STATUSES = ['UPCOMING', 'OPEN', 'CLOSED'] as const;

export type ContestStatus = (typeof CONTEST_STATUSES)[number];

export type Contest = {
  id: string;
  org: string;
  title: string;
  deadline: string;
  category: Category;
  activityType: ActivityType;
  status: ContestStatus;
  teamCount: number;
  views: number;
  scraps: number;
  activityFrom: string;
  activityTo: string;
};

export type ContestFilter = {
  activityType: ActivityType | null;
  categories: Category[];
  from: string | null;
  to: string | null;
};

export const EMPTY_FILTER: ContestFilter = {
  activityType: null,
  categories: [],
  from: null,
  to: null,
};

export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  CONTEST: '공모전',
  COMPETITION: '경진대회',
  HACKATHON: '해커톤',
  SUPPORTERS: '서포터즈',
  VOLUNTEERING: '봉사활동',
  STARTUP: '창업',
  EDUCATION_PROGRAM: '교육 프로그램',
  OVERSEAS_EXPLORATION: '해외탐방',
  EVENT_NETWORKING: '행사/네트워킹',
  ETC: '기타',
  NOT_ACTIVITY: '해당 없음',
};

export const CATEGORY_LABEL: Record<Category, string> = {
  PLANNING_IDEA: '기획/아이디어',
  ADVERTISING_MARKETING: '광고/마케팅',
  AI_DATA: 'AI/데이터',
  PAPER_REPORT: '논문/리포트',
  VIDEO_UCC_PHOTO: '영상/UCC/사진',
  DESIGN_CHARACTER_WEBTOON: '디자인/캐릭터/웹툰',
  WEB_MOBILE_IT: '웹/모바일/IT',
  GAME_SOFTWARE: '게임/소프트웨어',
  SCIENCE_ENGINEERING: '과학/공학',
  LITERATURE_WRITING_SCENARIO: '문학/글쓰기/시나리오',
  ARCHITECTURE_CONSTRUCTION_INTERIOR: '건축/건설/인테리어',
  NAMING_SLOGAN: '네이밍/슬로건',
  ENTERTAINMENT_ART_MUSIC: '엔터/예술/음악',
  ETC: '기타',
};

export const ACTIVITY_TABS: ActivityType[] = [
  'CONTEST',
  'COMPETITION',
  'HACKATHON',
  'SUPPORTERS',
  'VOLUNTEERING',
  'STARTUP',
  'EDUCATION_PROGRAM',
  'OVERSEAS_EXPLORATION',
  'EVENT_NETWORKING',
  'ETC',
];

export const CATEGORY_OPTIONS: Category[] = (Object.keys(CATEGORY_LABEL) as Category[]).sort(
  (a, b) => {
    if (a === 'ETC') return 1;
    if (b === 'ETC') return -1;
    return CATEGORY_LABEL[a].localeCompare(CATEGORY_LABEL[b], 'ko');
  },
);

export function countFilters(filter: ContestFilter): number {
  return filter.categories.length + (filter.from && filter.to ? 1 : 0);
}

export function parseDay(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function daysUntil(iso: string, today = startOfToday()): number {
  return Math.round((parseDay(iso).getTime() - today.getTime()) / 86400000);
}

const WEEK = '일월화수목금토';

export function formatDay(iso: string): string {
  const date = parseDay(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())} (${WEEK[date.getDay()]})`;
}

export function formatDeadline(iso: string, today = startOfToday()): string {
  return daysUntil(iso, today) <= 1 ? formatDay(iso) : `${formatDay(iso)} 마감`;
}

export function ddayLabel(iso: string, today = startOfToday()): string {
  const days = daysUntil(iso, today);
  if (days < 0) return '마감';
  if (days === 0) return '오늘 마감';
  if (days === 1) return '내일 마감';
  return '';
}

export function overlaps(aFrom: string, aTo: string, bFrom: string, bTo: string): boolean {
  return parseDay(aFrom) <= parseDay(bTo) && parseDay(aTo) >= parseDay(bFrom);
}
