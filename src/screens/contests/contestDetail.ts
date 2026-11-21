import type { Contest } from './contest';

export type ParticipationType = 'individual' | 'team' | 'both';

// 목록용 Contest에는 없고, 상세 화면에서만 쓰는 정보
// TODO: 상세 API 응답이 정해지면 필드 이름 맞추기
export type ContestDetailInfo = {
  applyFrom?: string; // 접수 시작일 (없으면 마감일만 보여줘요)
  participationType: ParticipationType;
  targets: string[];
  benefit: string;
  sourceUrl: string;
  sourceName: string;
  posterUrl?: string;
  description: string;
};

export type ContestDetail = Contest & ContestDetailInfo;

export const PARTICIPATION_LABEL: Record<ParticipationType, string> = {
  individual: '개인',
  team: '팀',
  both: '팀 · 개인 모두',
};
