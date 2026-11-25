/** 캔버스 샘플 데이터 — 실제 API 응답으로 바꿔 끼우세요 */

export type Field = '개발' | '디자인' | '기획' | '마케팅';

export type Room = {
  id: string;
  name: string;
  /** 직군 — 프로필 색을 정한다 */
  field: Field;
  last: string;
  /** 분 단위 시각. 0 = 오늘 00:00, 음수 = 어제 이전 */
  t: number;
  unread: number;
  muted?: boolean;
  /** 상대가 팀 합류 제안을 보낸 방 */
  offer?: boolean;
};

/** 1:1 대화만 있다 (단체 채팅 없음) */
export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'dm-1',
    name: '박준호',
    field: '기획',
    last: 'React랑 TypeScript 주로 써요. 회의는 얼마나 자주 하세요?',
    t: 1116,
    unread: 0,
  },
  {
    id: 'dm-2',
    name: '김하린',
    field: '디자인',
    offer: true,
    last: '프로필 보고 연락드렸어요. 같이 해보실 생각 있으세요?',
    t: 850,
    unread: 1,
  },
  {
    id: 'dm-3',
    name: '정민재',
    field: '개발',
    last: '혹시 디자이너 자리도 아직 모집하시나요?',
    t: 750,
    unread: 2,
  },
  {
    id: 'dm-4',
    name: '최유나',
    field: '디자인',
    last: '참고 자료 링크 보내드렸어요',
    t: -300,
    unread: 4,
    muted: true,
  },
  {
    id: 'dm-5',
    name: '이서준',
    field: '마케팅',
    last: '감사합니다! 다음에 기회 되면 같이 해요',
    t: -4000,
    unread: 0,
  },
];

/** 라이브 데모 — 3초 뒤 박준호에게서 새 메시지 */
export const LIVE_MESSAGE = {
  id: 'dm-1',
  last: '주 1회 온라인으로 해요! 편하게 오세요 🙂',
  t: 1190,
};

/** 목록의 시간 표기 */
export const fmtListTime = (t: number) => {
  if (t < -1440) return '11월 21일';
  if (t < 0) return '어제';
  return fmtClock(t);
};

/** 오전/오후 h:mm */
export const fmtClock = (min: number) => {
  const h = Math.floor(min / 60),
    m = min % 60;
  const hh = h % 12 === 0 ? 12 : h % 12;
  return (h < 12 ? '오전 ' : '오후 ') + hh + ':' + String(m).padStart(2, '0');
};

export type Msg = {
  id: number;
  who: 'me' | 'lead' | 'sys';
  kind: 'text' | 'offer';
  min: number;
  text?: string;
  /** 내 메시지 — 상대가 아직 안 읽음 */
  unread?: number;
  deleted?: boolean;
};

export const DAY_LABEL = '11월 9일 월요일';

/** 문의 — 내가 모집글을 보고 팀장에게 연락한 방 */
export const INQUIRY: Omit<Msg, 'id' | 'kind'>[] = [
  { min: 1102, who: 'me', text: '안녕하세요! 모집글 보고 연락드려요.' },
  { min: 1102, who: 'me', text: '프론트엔드 포지션 아직 모집 중인가요?' },
  { min: 1110, who: 'lead', text: '안녕하세요, 연락 주셔서 감사해요.' },
  {
    min: 1110,
    who: 'lead',
    text: '네, 프론트엔드 한 자리 아직 남아 있어요. 주로 어떤 스택 쓰시는지 여쭤봐도 될까요?',
  },
  {
    min: 1116,
    who: 'me',
    text: 'React랑 TypeScript 주로 써요. 회의는 얼마나 자주 하세요?',
    unread: 1,
  },
];

/** 제안 — 팀장이 내 프로필을 보고 합류를 제안한 방 */
export const OFFER: (Omit<Msg, 'id' | 'kind'> & { kind?: Msg['kind'] })[] = [
  { min: 1050, who: 'sys', text: '{P}님이 팀 합류를 제안했어요' },
  { min: 1050, who: 'lead', text: '안녕하세요, 프로필 보고 연락드렸어요.' },
  {
    min: 1050,
    who: 'lead',
    text: '저희 팀에 프론트엔드 자리가 비어 있는데, 같이 해보실 생각 있으세요? 궁금한 건 편하게 물어보셔도 돼요.',
  },
  { min: 1051, who: 'lead', kind: 'offer' },
];

export const seedMessages = (scenario: '문의' | '제안', partner: string): Msg[] =>
  (scenario === '제안' ? OFFER : INQUIRY).map((m, i) => ({
    id: i,
    kind: 'text',
    ...m,
    ...(m.text ? { text: m.text.replace('{P}', partner) } : {}),
  })) as Msg[];

/** 제안 카드 내용 */
export const OFFER_CARD = {
  team: '데이터 길잡이',
  contest: '2026 공공데이터 활용 창업경진대회',
  position: '프론트엔드',
  members: '기획 1 · 디자인 1 · 백엔드 1',
  activity: '온라인 · 주 1회 회의',
};
