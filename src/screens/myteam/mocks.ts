import type { Applicant, Application, Member, Team } from './types';

export const MOCK_TEAMS: Team[] = [
  {
    id: 'esg',
    kind: 'pending',
    role: '지원 대기',
    name: 'ESG 임팩트 캠페인',
    contest: '디자인으로 만드는 ESG 캠페인',
    filled: ['기획', '디자인', '개발'],
    total: 4,
    dday: 12,
    myPosition: '데이터 시각화',
  },
  {
    id: 'seoul',
    kind: 'leader',
    role: '팀장',
    name: '데이터로 서울을',
    contest: '2026 서울시 데이터 활용 공모전',
    filled: ['기획', '개발', '디자인'],
    total: 5,
    newCount: 3,
    dday: 21,
    myPosition: '기획',
  },
  {
    id: 'green',
    kind: 'member',
    role: '팀원',
    name: 'ESG 그린 리포트',
    contest: '대학생 ESG 아이디어 공모전',
    filled: ['기획', '디자인', '마케팅', '개발', '개발', '디자인'],
    total: 6,
    dday: 9,
    myPosition: '데이터 시각화',
  },
  {
    id: 'ai',
    kind: 'member',
    role: '팀원',
    name: 'AI 헬스케어 메이트',
    contest: '2026 AI 헬스케어 해커톤',
    filled: ['개발', '기획', '디자인', '개발'],
    total: 5,
    dday: 14,
    myPosition: '프론트엔드',
  },
  {
    id: 'campus',
    kind: 'leader',
    role: '팀장',
    name: '캠퍼스 푸드맵',
    contest: '대학 창업 아이디어 경진대회',
    filled: ['기획', '개발'],
    total: 4,
    dday: 30,
    myPosition: '기획',
  },
];

export const MOCK_APPLICATION: Application = {
  name: '이루매',
  position: '데이터 시각화',
  field: '디자인',
  hours: 10,
  availableSlots: [12, 15, 17, 19],
  answers: [
    {
      tag: '팀장 질문 1',
      question: '이 팀에 지원한 이유를 알려주세요',
      answer:
        '서울시 교통 공공데이터를 다루는 경험이 있어 이번 공모전 주제와 잘 맞을 것 같아 지원했습니다.',
    },
    {
      tag: '팀장 질문 2',
      question: '지원한 포지션에서 맡을 수 있는 역할은 무엇인가요?',
      answer: '기획 단계부터 마무리까지 맡은 역할을 책임지고 수행하겠습니다.',
    },
  ],
};

export const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'applicant-1',
    name: '김서연',
    position: 'UI/UX 디자이너',
    field: '디자인',
    hours: 8,
    appliedAt: '방금',
    availableSlots: [8, 10, 17, 19],
    answers: [
      {
        tag: '팀장 질문 1',
        question: '이 팀에 지원한 이유를 알려주세요',
        answer:
          '서울시 공공데이터로 지도 시각화 프로젝트를 해 봤어요. 이번에는 시민이 쓰기 쉬운 화면을 맡고 싶어요.',
      },
      {
        tag: '팀장 질문 2',
        question: '지원한 포지션에서 맡을 수 있는 역할은 무엇인가요?',
        answer:
          '서비스 흐름 설계부터 최종 화면까지 맡을 수 있어요. 발표용 화면 시안도 함께 준비할게요.',
      },
    ],
  },
  {
    id: 'applicant-2',
    name: '이준호',
    position: '백엔드 개발자',
    field: '개발',
    hours: 10,
    appliedAt: '2시간 전',
    availableSlots: [14, 15, 17, 19],
    answers: [
      {
        tag: '팀장 질문 1',
        question: '이 팀에 지원한 이유를 알려주세요',
        answer:
          '공공데이터 API 서버를 만들어 본 경험이 있어 데이터 수집과 정리를 책임질 수 있어요.',
      },
      {
        tag: '팀장 질문 2',
        question: '지원한 포지션에서 맡을 수 있는 역할은 무엇인가요?',
        answer: '데이터 수집 서버와 API를 맡고 배포와 운영까지 책임지고 마무리하겠습니다.',
      },
    ],
  },
  {
    id: 'applicant-3',
    name: '박하늘',
    position: '마케터',
    field: '마케팅',
    hours: 5,
    appliedAt: '어제',
    availableSlots: [5, 6, 12, 13],
    answers: [
      {
        tag: '팀장 질문 1',
        question: '이 팀에 지원한 이유를 알려주세요',
        answer: '데이터를 한눈에 보이게 정리하는 일을 좋아해요. 발표 자료도 같이 만들 수 있어요.',
      },
      {
        tag: '팀장 질문 2',
        question: '지원한 포지션에서 맡을 수 있는 역할은 무엇인가요?',
        answer: '캠페인 메시지와 홍보 계획을 맡고 발표 대본 정리도 도울 수 있어요.',
      },
    ],
  },
];

export const MOCK_MEMBERS: Member[] = [
  { name: '정다은', role: '기획', field: '기획', isLeader: true },
  { name: '이루매', role: '데이터 시각화', field: '디자인', isMe: true },
  { name: '최민수', role: '마케터', field: '마케팅' },
  { name: '한지호', role: '프론트엔드', field: '개발' },
  { name: '윤서아', role: '백엔드', field: '개발' },
  { name: '오지민', role: '그래픽 디자인', field: '디자인' },
];
