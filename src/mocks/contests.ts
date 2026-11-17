import type { Contest } from '@/types/contest';

const SAMPLE_DESCRIPTION = `캠퍼스는 매일 수천 명이 머무는 작은 도시입니다.
한국캠퍼스혁신연구회는 데이터와 기술로 더 편리하고 지속가능한 캠퍼스를 만들 연구 아이디어를 찾습니다.
학부생의 첫 연구도 환영합니다.

■ 공모 주제
· 공간·시설 데이터를 활용한 캠퍼스 운영 효율화
· IoT·AI 기반 학습 환경 개선
· 캠퍼스 에너지 절감 및 탄소중립 방안

■ 제출 방법
· 원문 페이지의 신청 양식으로 제출`;

export const CONTESTS: Contest[] = [
  {
    id: '1',
    title: '2026 서울시립대학교 홍보 콘텐츠 공모전',
    host: '서울시립대학교',
    participationType: 'both',
    category: '공모전',
    field: '영상/콘텐츠',
    targets: ['서울시립대학교 재학생'],
    benefit: '총 상금 300만원 · 우수작 학교 SNS 게재',
    sourceUrl: 'https://example.com/contests/1',
    sourceName: '서울시립대학교 홍보팀',
    posterUrl: 'https://picsum.photos/seed/giut-contest-1/600/800',
    startDate: '2026-11-02',
    endDate: '2026-11-19',
    description: SAMPLE_DESCRIPTION,
  },
  {
    id: '2',
    title: '스마트 캠퍼스 연구논문 공모전',
    host: '한국캠퍼스혁신연구회',
    participationType: 'both',
    category: '공모전',
    field: '논문/리포트',
    targets: ['대학생', '대학원생'],
    benefit: '총 상금 500만원 · 학회 발표 기회',
    sourceUrl: 'https://example.com/contests/2',
    sourceName: '한국캠퍼스혁신연구회 공식 홈페이지',
    posterUrl: 'https://picsum.photos/seed/giut-contest-2/600/800',
    startDate: '2026-10-26',
    endDate: '2026-11-25',
    description: SAMPLE_DESCRIPTION,
  },
  {
    id: '3',
    title: '청년 에코 아이디어 챌린지',
    host: '그린내일재단',
    participationType: 'individual',
    category: '공모전',
    field: '기획/아이디어',
    targets: ['만 19~29세 청년'],
    benefit: '대상 200만원 · 재단 인턴십 연계',
    sourceUrl: 'https://example.com/contests/3',
    sourceName: '그린내일재단 공식 홈페이지',
    posterUrl: 'https://picsum.photos/seed/giut-contest-3/600/800',
    startDate: '2026-11-01',
    endDate: '2026-11-21',
    description: SAMPLE_DESCRIPTION,
  },
  {
    id: '4',
    title: '캠퍼스 해커톤 2026 겨울',
    host: '대학연합 개발자 커뮤니티',
    participationType: 'team',
    category: '해커톤',
    field: 'IT/개발',
    targets: ['대학생', '휴학생'],
    benefit: '총 상금 1,000만원 · 스폰서 기업 채용 연계',
    sourceUrl: 'https://example.com/contests/4',
    sourceName: '대학연합 개발자 커뮤니티',
    posterUrl: 'https://picsum.photos/seed/giut-contest-4/600/800',
    startDate: '2026-11-10',
    endDate: '2026-11-22',
    description: SAMPLE_DESCRIPTION,
  },
  {
    id: '5',
    title: '로컬 브랜드 마케팅 서포터즈 7기',
    host: '로컬상생협회',
    participationType: 'team',
    category: '서포터즈',
    field: '광고/마케팅',
    targets: ['대학생'],
    benefit: '월 활동비 30만원 · 수료증 발급',
    sourceUrl: 'https://example.com/contests/5',
    sourceName: '로컬상생협회 공식 홈페이지',
    posterUrl: 'https://picsum.photos/seed/giut-contest-5/600/800',
    startDate: '2026-11-15',
    endDate: '2026-12-06',
    description: SAMPLE_DESCRIPTION,
  },
  {
    id: '6',
    title: '공공데이터 활용 서비스 디자인 경진대회',
    host: '데이터디자인포럼',
    participationType: 'team',
    category: '경진대회',
    field: '디자인',
    targets: ['대학생', '대학원생', '일반인'],
    benefit: '총 상금 700만원 · 수상작 전시',
    sourceUrl: 'https://example.com/contests/6',
    sourceName: '데이터디자인포럼',
    posterUrl: 'https://picsum.photos/seed/giut-contest-6/600/800',
    startDate: '2026-11-17',
    endDate: '2026-12-20',
    description: SAMPLE_DESCRIPTION,
  },
];

export function getContest(id: string): Contest | undefined {
  return CONTESTS.find((contest) => contest.id === id);
}
