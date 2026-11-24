import { useMemo, useState } from 'react';

import { ROLE_LABEL, type RoleKey, type Team } from '@/screens/teams';

export const APPLY_DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;
export const APPLY_TIMES = ['오전', '오후', '저녁'] as const;
export const APPLY_HOURS = [5, 10, 15, 20] as const;
export const ANSWER_MAX = 300;

const POSITION_LABEL: Record<RoleKey, string> = {
  dev: '개발자',
  design: 'UI/UX 디자이너',
  plan: '기획자',
  mkt: '마케터',
};

export type ApplySlot = {
  id: string;
  role: RoleKey;
  label: string;
  filled: boolean;
};

export type ApplyTeam = {
  id: string;
  name: string;
  slots: ApplySlot[];
};

export type ApplyQuestion = {
  id: string;
  question: string;
  placeholder?: string;
};

export type TeamApplyDraft = {
  slotId: string | null;
  answers: Record<string, string>;
  hours: number;
  availableSlots: number[];
};

export const APPLY_QUESTIONS: ApplyQuestion[] = [
  { id: 'reason', question: '이 팀에 지원한 이유를 알려주세요' },
  {
    id: 'experience',
    question: '비슷한 프로젝트를 해 본 경험이 있다면 알려주세요',
    placeholder: '없다면 배우고 싶은 점을 적어도 좋아요',
  },
];

export function createApplyTeam(team: Team): ApplyTeam {
  const filledSlots: ApplySlot[] = team.members.map((member) => ({
    id: `member-${member.id}`,
    role: member.role,
    label: member.isLeader ? `팀장 · ${ROLE_LABEL[member.role]}` : POSITION_LABEL[member.role],
    filled: true,
  }));
  const openSlots: ApplySlot[] = team.recruitingRoles.flatMap(({ role, count }) =>
    Array.from({ length: count }, (_, index) => ({
      id: `${role}-${index + 1}`,
      role,
      label: POSITION_LABEL[role],
      filled: false,
    })),
  );

  return {
    id: team.id,
    name: team.name,
    slots: [...filledSlots, ...openSlots],
  };
}

const EMPTY_DRAFT: TeamApplyDraft = {
  slotId: null,
  answers: {},
  hours: 0,
  availableSlots: [],
};

export function useTeamApplyDraft(team: ApplyTeam, questions: ApplyQuestion[]) {
  const [draft, setDraft] = useState<TeamApplyDraft>(EMPTY_DRAFT);
  const slot = team.slots.find((item) => item.id === draft.slotId) ?? null;
  const required = useMemo(() => {
    const answered = questions.filter((question) => draft.answers[question.id]?.trim()).length;
    return { done: answered + (draft.hours > 0 ? 1 : 0), total: questions.length + 1 };
  }, [draft.answers, draft.hours, questions]);

  const canContinue = (step: number) => {
    if (step === 1) return slot !== null;
    if (step === 2) return required.done === required.total;
    return true;
  };

  return {
    draft,
    slot,
    required,
    canContinue,
    selectSlot: (slotId: string) => setDraft((current) => ({ ...current, slotId })),
    setAnswer: (id: string, answer: string) =>
      setDraft((current) => ({
        ...current,
        answers: { ...current.answers, [id]: answer },
      })),
    setHours: (hours: number) => setDraft((current) => ({ ...current, hours })),
    setAvailableSlots: (slotIndexes: number[], selected: boolean) =>
      setDraft((current) => {
        const next = new Set(current.availableSlots);
        slotIndexes.forEach((slotIndex) => {
          if (selected) next.add(slotIndex);
          else next.delete(slotIndex);
        });
        return { ...current, availableSlots: [...next].sort((a, b) => a - b) };
      }),
  };
}

export type TeamApplyDraftApi = ReturnType<typeof useTeamApplyDraft>;
