import type { ContestDetail, ContestDetailInfo } from './contestDetail';
import { MOCK_CONTESTS } from './mocks';

const SAMPLE_DESCRIPTION = `캠퍼스는 매일 수천 명이 머무는 작은 도시입니다.
한국캠퍼스혁신연구회는 데이터와 기술로 더 편리하고 지속가능한 캠퍼스를 만들 연구 아이디어를 찾습니다.
학부생의 첫 연구도 환영합니다.

■ 공모 주제
· 공간·시설 데이터를 활용한 캠퍼스 운영 효율화
· IoT·AI 기반 학습 환경 개선
· 캠퍼스 에너지 절감 및 탄소중립 방안

■ 제출 방법
· 원문 페이지의 신청 양식으로 제출`;

// 상세 정보가 아직 없는 공모전에 쓰는 기본값
const DEFAULT_DETAIL: ContestDetailInfo = {
  participationType: 'team',
  targets: ['대학생'],
  benefit: '원문에서 확인해 주세요',
  sourceUrl: '',
  sourceName: '주최 측 공식 홈페이지',
  description: '상세 내용을 준비하고 있어요.',
};

// 공모전 id → 상세 정보 (목록 정보는 mocks.ts의 MOCK_CONTESTS)
const MOCK_CONTEST_DETAILS: Record<string, ContestDetailInfo> = {
  '21': {
    applyFrom: '2026-11-02',
    participationType: 'both',
    targets: ['서울시립대학교 재학생'],
    benefit: '총 상금 300만원 · 우수작 학교 SNS 게재',
    sourceUrl: 'https://example.com/contests/1',
    sourceName: '서울시립대학교 홍보팀',
    posterUrl: 'https://picsum.photos/seed/giut-contest-1/600/800',
    description: SAMPLE_DESCRIPTION,
  },
  '22': {
    applyFrom: '2026-10-26',
    participationType: 'both',
    targets: ['대학생', '대학원생'],
    benefit: '총 상금 500만원 · 학회 발표 기회',
    sourceUrl: 'https://example.com/contests/2',
    sourceName: '한국캠퍼스혁신연구회 공식 홈페이지',
    description: SAMPLE_DESCRIPTION,
  },
  '23': {
    applyFrom: '2026-11-01',
    participationType: 'individual',
    targets: ['만 19~29세 청년'],
    benefit: '대상 200만원 · 재단 인턴십 연계',
    sourceUrl: 'https://example.com/contests/3',
    sourceName: '그린내일재단 공식 홈페이지',
    description: SAMPLE_DESCRIPTION,
  },
  '24': {
    applyFrom: '2026-11-10',
    participationType: 'team',
    targets: ['대학생', '휴학생'],
    benefit: '총 상금 1,000만원 · 스폰서 기업 채용 연계',
    sourceUrl: 'https://example.com/contests/4',
    sourceName: '대학연합 개발자 커뮤니티',
    description: SAMPLE_DESCRIPTION,
  },
  '25': {
    applyFrom: '2026-11-15',
    participationType: 'team',
    targets: ['대학생'],
    benefit: '월 활동비 30만원 · 수료증 발급',
    sourceUrl: 'https://example.com/contests/5',
    sourceName: '로컬상생협회 공식 홈페이지',
    description: SAMPLE_DESCRIPTION,
  },
  // "모집 중인 팀 0" 확인용
  '26': {
    applyFrom: '2026-11-17',
    participationType: 'team',
    targets: ['대학생', '대학원생', '일반인'],
    benefit: '총 상금 700만원 · 수상작 전시',
    sourceUrl: 'https://example.com/contests/6',
    sourceName: '데이터디자인포럼',
    description: SAMPLE_DESCRIPTION,
  },
  // 27~29: 홈 "○○님을 위한 추천" 시안 데이터
  '27': {
    applyFrom: '2026-11-01',
    participationType: 'both',
    targets: ['대학생'],
    benefit: '총 상금 400만원 · 우수작 실제 캠페인 집행',
    sourceUrl: 'https://example.com/contests/7',
    sourceName: '한국광고홍보학회',
    description: SAMPLE_DESCRIPTION,
  },
  '28': {
    applyFrom: '2026-11-05',
    participationType: 'team',
    targets: ['대학생', '대학원생', '일반인'],
    benefit: '총 상금 1,000만원 · 사업화 지원',
    sourceUrl: 'https://example.com/contests/8',
    sourceName: '청년디지털재단 공식 홈페이지',
    description: SAMPLE_DESCRIPTION,
  },
  '29': {
    applyFrom: '2026-11-10',
    participationType: 'both',
    targets: ['대학생', '일반인'],
    benefit: '총 상금 300만원 · 수상작 시범 설치',
    sourceUrl: 'https://example.com/contests/9',
    sourceName: '서울디자인센터',
    description: SAMPLE_DESCRIPTION,
  },
};

// 목록 정보 + 상세 정보를 합쳐서 돌려줘요. 상세 정보가 없으면 기본값을 써요.
export function getContestDetail(id: string): ContestDetail | undefined {
  const contest = MOCK_CONTESTS.find((item) => item.id === id);
  if (!contest) return undefined;
  return { ...contest, ...(MOCK_CONTEST_DETAILS[id] ?? DEFAULT_DETAIL) };
}

export function getContestDetails(): ContestDetail[] {
  return MOCK_CONTESTS.map((contest) => getContestDetail(contest.id)).filter(
    (contest) => contest !== undefined,
  );
}

// 추천 공모전 (나중에 서버의 추천 결과로 바뀔 자리)
const RECOMMENDED_IDS = ['27', '28', '29'];

export function getRecommendedContests(): ContestDetail[] {
  return RECOMMENDED_IDS.map(getContestDetail).filter((contest) => contest !== undefined);
}
