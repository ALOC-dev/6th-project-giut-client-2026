import type { ParticipationType } from '@/types/contest';

export const PARTICIPATION_LABEL: Record<ParticipationType, string> = {
  individual: '개인',
  team: '팀',
  both: '팀 · 개인 모두',
};
