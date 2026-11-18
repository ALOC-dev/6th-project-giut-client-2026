import type { Team } from '@/types/team';

export const TEAMS: Team[] = [
  // 공모전 1: 서울시립대 홍보 콘텐츠
  {
    id: '1',
    contestId: '1',
    name: '시립대 숏폼 연구소',
    capacity: 4,
    recruitEndDate: '2026-11-18',
    members: [
      { id: 'm1', name: '김민재', role: 'plan', isLeader: true },
      { id: 'm2', name: '이서연', role: 'design', isLeader: false },
    ],
    recruitingRoles: ['design', 'mkt'],
    description:
      '학교 홍보 숏폼 영상을 함께 기획하고 촬영할 팀원을 찾아요. 편집 경험이 있으면 더 좋아요!',
    operationMethod: 'both',
    activityFrequency: '주 2회',
    activityPlace: '교내',
    cooperationTools: ['디스코드', '노션'],
  },

  // 공모전 2: 스마트 캠퍼스 연구논문 (모집 중인 팀 3)
  {
    id: '2',
    contestId: '2',
    name: '캠퍼스 데이터랩',
    capacity: 4,
    recruitEndDate: '2026-11-20',
    members: [
      { id: 'm3', name: '박지훈', role: 'dev', isLeader: true },
      { id: 'm4', name: '최유나', role: 'plan', isLeader: false },
    ],
    recruitingRoles: ['dev', 'plan'],
    description:
      '강의실 이용 데이터를 분석해서 공간 효율화 논문을 쓰려고 해요. 파이썬 데이터 분석 가능한 분 환영!',
    operationMethod: 'online',
    activityFrequency: '주 1회',
    activityPlace: '상관 없음',
    cooperationTools: ['줌', '노션'],
  },
  {
    id: '3',
    contestId: '2',
    name: '에너지 제로 캠퍼스',
    capacity: 3,
    recruitEndDate: '2026-11-21',
    members: [{ id: 'm5', name: '정하늘', role: 'plan', isLeader: true }],
    recruitingRoles: ['plan', 'dev'],
    description: '캠퍼스 에너지 절감 방안을 주제로 연구해요. 처음 논문 쓰는 분도 괜찮아요.',
    operationMethod: 'offline',
    activityFrequency: '주 1회',
    activityPlace: '서울 전체',
    cooperationTools: ['구글 밋', '노션'],
  },
  {
    id: '4',
    contestId: '2',
    name: 'IoT 스터디룸',
    capacity: 5,
    recruitEndDate: '2026-11-23',
    members: [
      { id: 'm6', name: '한도윤', role: 'dev', isLeader: true },
      { id: 'm7', name: '오수빈', role: 'dev', isLeader: false },
      { id: 'm8', name: '윤채원', role: 'design', isLeader: false },
    ],
    recruitingRoles: ['plan', 'design'],
    description:
      'IoT 센서로 학습 환경을 개선하는 연구를 진행해요. 프로토타입까지 만들어볼 예정이에요.',
    operationMethod: 'both',
    activityFrequency: '주 2회',
    activityPlace: '수도권',
    cooperationTools: ['디스코드', '슬랙', '노션'],
  },

  // 공모전 3: 개인 참가라 팀 없음

  // 공모전 4: 캠퍼스 해커톤
  {
    id: '5',
    contestId: '4',
    name: '밤샘 코더즈',
    capacity: 4,
    recruitEndDate: '2026-11-20',
    members: [
      { id: 'm9', name: '서준호', role: 'dev', isLeader: true },
      { id: 'm10', name: '임다은', role: 'dev', isLeader: false },
    ],
    recruitingRoles: ['design', 'plan'],
    description: '해커톤 수상 목표로 달릴 디자이너와 기획자를 찾아요. 개발은 저희가 맡을게요.',
    operationMethod: 'offline',
    activityFrequency: '주 3회',
    activityPlace: '서울 전체',
    cooperationTools: ['디스코드', '노션'],
  },
  {
    id: '6',
    contestId: '4',
    name: '픽셀 앤 로직',
    capacity: 4,
    recruitEndDate: '2026-11-21',
    members: [
      { id: 'm11', name: '강예린', role: 'design', isLeader: true },
      { id: 'm12', name: '조민혁', role: 'dev', isLeader: false },
      { id: 'm13', name: '신지우', role: 'plan', isLeader: false },
    ],
    recruitingRoles: ['dev'],
    description: '프론트엔드 개발자 한 분만 더 모시면 완성이에요! React Native 경험자 우대.',
    operationMethod: 'both',
    activityFrequency: '주 4회+',
    activityPlace: '수도권',
    cooperationTools: ['디스코드', '슬랙'],
  },

  // 공모전 5: 로컬 브랜드 서포터즈
  {
    id: '7',
    contestId: '5',
    name: '동네 브랜드 크루',
    capacity: 3,
    recruitEndDate: '2026-11-30',
    members: [{ id: 'm14', name: '문서윤', role: 'mkt', isLeader: true }],
    recruitingRoles: ['mkt', 'design'],
    description:
      '동네 가게를 인스타그램으로 알리는 활동을 해요. 카드뉴스 만들 수 있는 분 환영해요.',
    operationMethod: 'offline',
    activityFrequency: '주 1회',
    activityPlace: '서울 전체',
    cooperationTools: ['노션'],
  },

  // 공모전 6: 서비스 디자인 경진대회는 "모집 중인 팀 0" 확인용으로 팀 없음
];

export function getTeam(id: string): Team | undefined {
  return TEAMS.find((team) => team.id === id);
}

export function getTeamsByContest(contestId: string): Team[] {
  return TEAMS.filter((team) => team.contestId === contestId);
}
