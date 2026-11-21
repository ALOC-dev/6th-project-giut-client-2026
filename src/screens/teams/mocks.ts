import type { Team } from './team';

export const MOCK_TEAMS: Team[] = [
  // 공모전 21: 서울시립대 홍보 콘텐츠
  {
    id: '1',
    contestId: '21',
    name: '시립대 숏폼 연구소',
    capacity: 4,
    recruitEndDate: '2026-11-18',
    members: [
      { id: 'm1', name: '김민재', role: 'plan', isLeader: true },
      { id: 'm2', name: '이서연', role: 'design', isLeader: false },
    ],
    recruitingRoles: [
      { role: 'design', count: 1 },
      { role: 'mkt', count: 1 },
    ],
    description:
      '학교 홍보 숏폼 영상을 함께 기획하고 촬영할 팀원을 찾아요. 편집 경험이 있으면 더 좋아요!',
    operationMethod: 'both',
    activityFrequency: '주 2회',
    activityPlace: '교내',
    cooperationTools: ['디스코드', '노션'],
  },

  // 공모전 22: 스마트 캠퍼스 연구논문 (모집 중인 팀 3)
  {
    id: '2',
    contestId: '22',
    name: '캠퍼스 데이터랩',
    capacity: 10,
    recruitEndDate: '2026-11-20',
    members: [
      { id: 'm3', name: '박지훈', role: 'dev', isLeader: true },
      { id: 'm4', name: '최유나', role: 'plan', isLeader: false },
      { id: 'm25', name: '송현우', role: 'dev', isLeader: false },
      { id: 'm26', name: '김나래', role: 'design', isLeader: false },
      { id: 'm27', name: '이준서', role: 'mkt', isLeader: false },
    ],
    recruitingRoles: [
      { role: 'dev', count: 2 },
      { role: 'design', count: 1 },
      { role: 'mkt', count: 2 },
    ],
    description:
      '강의실 이용 데이터를 분석해서 공간 효율화 논문을 쓰려고 해요. 파이썬 데이터 분석 가능한 분 환영!',
    operationMethod: 'online',
    activityFrequency: '주 1회',
    activityPlace: '상관 없음',
    cooperationTools: ['줌', '노션'],
  },
  {
    id: '3',
    contestId: '22',
    name: '스마트 강의실 실험연구',
    capacity: 3,
    recruitEndDate: '2026-11-21',
    members: [
      { id: 'm5', name: '정하늘', role: 'plan', isLeader: true },
      { id: 'm28', name: '권태양', role: 'dev', isLeader: false },
    ],
    recruitingRoles: [{ role: 'design', count: 1 }],
    description: '출결·조명 IoT 실험을 설계해요. 실험 결과를 보기 좋게 정리해줄 디자이너를 찾아요.',
    operationMethod: 'offline',
    activityFrequency: '주 1회',
    activityPlace: '서울 전체',
    cooperationTools: ['구글 밋', '노션'],
  },
  {
    id: '4',
    contestId: '22',
    name: '에너지 절감 리포트',
    capacity: 5,
    recruitEndDate: '2026-11-23',
    members: [
      { id: 'm6', name: '한도윤', role: 'plan', isLeader: true },
      { id: 'm7', name: '오수빈', role: 'dev', isLeader: false },
    ],
    recruitingRoles: [
      { role: 'dev', count: 1 },
      { role: 'design', count: 1 },
      { role: 'mkt', count: 1 },
    ],
    description: '건물별 전력 사용량으로 절감 시나리오를 분석해요. 처음 논문 쓰는 분도 괜찮아요.',
    operationMethod: 'both',
    activityFrequency: '주 2회',
    activityPlace: '수도권',
    cooperationTools: ['디스코드', '슬랙', '노션'],
  },

  // 공모전 23: 개인 참가라 팀 없음

  // 공모전 24: 캠퍼스 해커톤
  {
    id: '5',
    contestId: '24',
    name: '밤샘 코더즈',
    capacity: 4,
    recruitEndDate: '2026-11-20',
    members: [
      { id: 'm9', name: '서준호', role: 'dev', isLeader: true },
      { id: 'm10', name: '임다은', role: 'dev', isLeader: false },
    ],
    recruitingRoles: [
      { role: 'design', count: 1 },
      { role: 'plan', count: 1 },
    ],
    description: '해커톤 수상 목표로 달릴 디자이너와 기획자를 찾아요. 개발은 저희가 맡을게요.',
    operationMethod: 'offline',
    activityFrequency: '주 3회',
    activityPlace: '서울 전체',
    cooperationTools: ['디스코드', '노션'],
  },
  {
    id: '6',
    contestId: '24',
    name: '픽셀 앤 로직',
    capacity: 4,
    recruitEndDate: '2026-11-21',
    members: [
      { id: 'm11', name: '강예린', role: 'design', isLeader: true },
      { id: 'm12', name: '조민혁', role: 'dev', isLeader: false },
      { id: 'm13', name: '신지우', role: 'plan', isLeader: false },
    ],
    recruitingRoles: [{ role: 'dev', count: 1 }],
    description: '프론트엔드 개발자 한 분만 더 모시면 완성이에요! React Native 경험자 우대.',
    operationMethod: 'both',
    activityFrequency: '주 4회+',
    activityPlace: '수도권',
    cooperationTools: ['디스코드', '슬랙'],
  },

  // 공모전 25: 로컬 브랜드 서포터즈
  {
    id: '7',
    contestId: '25',
    name: '동네 브랜드 크루',
    capacity: 3,
    recruitEndDate: '2026-11-30',
    members: [{ id: 'm14', name: '문서윤', role: 'mkt', isLeader: true }],
    recruitingRoles: [
      { role: 'mkt', count: 1 },
      { role: 'design', count: 1 },
    ],
    description:
      '동네 가게를 인스타그램으로 알리는 활동을 해요. 카드뉴스 만들 수 있는 분 환영해요.',
    operationMethod: 'offline',
    activityFrequency: '주 1회',
    activityPlace: '서울 전체',
    cooperationTools: ['노션'],
  },

  // 공모전 26: 서비스 디자인 경진대회는 "모집 중인 팀 0" 확인용으로 팀 없음

  // 공모전 27: Z세대 브랜드 캠페인 (모집 중인 팀 3)
  {
    id: '8',
    contestId: '27',
    name: '브랜드 실험실',
    capacity: 4,
    recruitEndDate: '2026-11-19',
    members: [
      { id: 'm15', name: '유하진', role: 'mkt', isLeader: true },
      { id: 'm16', name: '백승아', role: 'design', isLeader: false },
    ],
    recruitingRoles: [
      { role: 'plan', count: 1 },
      { role: 'design', count: 1 },
    ],
    description: 'Z세대 감성 캠페인을 같이 기획할 분을 찾아요.',
    operationMethod: 'online',
    activityFrequency: '주 2회',
    activityPlace: '상관 없음',
    cooperationTools: ['디스코드', '노션'],
  },
  {
    id: '9',
    contestId: '27',
    name: '캠페인 메이커스',
    capacity: 3,
    recruitEndDate: '2026-11-19',
    members: [{ id: 'm17', name: '남궁민', role: 'plan', isLeader: true }],
    recruitingRoles: [
      { role: 'mkt', count: 1 },
      { role: 'design', count: 1 },
    ],
    description: '광고 공모전 수상 경험 있는 팀장과 함께해요.',
    operationMethod: 'both',
    activityFrequency: '주 1회',
    activityPlace: '서울 전체',
    cooperationTools: ['노션'],
  },
  {
    id: '10',
    contestId: '27',
    name: '숏폼 크리에이터즈',
    capacity: 3,
    recruitEndDate: '2026-11-19',
    members: [
      { id: 'm18', name: '전다인', role: 'design', isLeader: true },
      { id: 'm19', name: '황재민', role: 'mkt', isLeader: false },
    ],
    recruitingRoles: [{ role: 'plan', count: 1 }],
    description: '영상 위주 캠페인으로 갈 예정이에요. 기획자 한 분 모셔요!',
    operationMethod: 'offline',
    activityFrequency: '주 2회',
    activityPlace: '수도권',
    cooperationTools: ['디스코드'],
  },

  // 공모전 28: 생성형 AI 서비스 (모집 중인 팀 2)
  {
    id: '11',
    contestId: '28',
    name: 'AI 놀이터',
    capacity: 4,
    recruitEndDate: '2026-11-24',
    members: [
      { id: 'm20', name: '김도현', role: 'dev', isLeader: true },
      { id: 'm21', name: '이수아', role: 'plan', isLeader: false },
    ],
    recruitingRoles: [
      { role: 'design', count: 1 },
      { role: 'dev', count: 1 },
    ],
    description: 'LLM으로 대학생 생활 도우미 서비스를 만들어요.',
    operationMethod: 'online',
    activityFrequency: '주 2회',
    activityPlace: '상관 없음',
    cooperationTools: ['디스코드', '노션'],
  },
  {
    id: '12',
    contestId: '28',
    name: '프롬프트 크루',
    capacity: 4,
    recruitEndDate: '2026-11-25',
    members: [{ id: 'm22', name: '박서진', role: 'plan', isLeader: true }],
    recruitingRoles: [
      { role: 'dev', count: 2 },
      { role: 'design', count: 1 },
    ],
    description: '아이디어 단계부터 같이 고민할 개발자, 디자이너 환영해요.',
    operationMethod: 'both',
    activityFrequency: '주 1회',
    activityPlace: '서울 전체',
    cooperationTools: ['슬랙', '노션'],
  },

  // 공모전 29: 공공 사이니지 UX (모집 중인 팀 1)
  {
    id: '13',
    contestId: '29',
    name: '사인 앤 서비스',
    capacity: 3,
    recruitEndDate: '2026-11-28',
    members: [
      { id: 'm23', name: '최윤서', role: 'design', isLeader: true },
      { id: 'm24', name: '정민규', role: 'design', isLeader: false },
    ],
    recruitingRoles: [{ role: 'plan', count: 1 }],
    description: '버스정류장 안내판 UX를 리서치부터 함께 개선해요.',
    operationMethod: 'offline',
    activityFrequency: '주 1회',
    activityPlace: '서울 전체',
    cooperationTools: ['노션', '구글 밋'],
  },
];

export function getTeam(id: string): Team | undefined {
  return MOCK_TEAMS.find((team) => team.id === id);
}

export function getTeamsByContest(contestId: string): Team[] {
  return MOCK_TEAMS.filter((team) => team.contestId === contestId);
}
