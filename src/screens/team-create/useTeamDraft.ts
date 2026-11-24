import { useMemo, useState } from 'react';

import {
  DEFAULT_QUESTIONS,
  MAX_RECRUIT,
  MAX_TEAM_NAME_LENGTH,
  ROLE_OPTIONS,
  TEAM_ROLES,
  type ActivityMode,
  type TeamRole,
} from './constants';

export type TeamDraft = {
  name: string;
  myRole: TeamRole | null;
  myPosition: string | null;
  recruitRoles: TeamRole[];
  recruit: Record<string, number>;
  mode: ActivityMode | null;
  meetings: number;
  place: string | null;
  tools: string[];
  description: string;
  questions: string[];
};

const emptyDraft = (): TeamDraft => ({
  name: '',
  myRole: null,
  myPosition: null,
  recruitRoles: [],
  recruit: {},
  mode: null,
  meetings: 0,
  place: null,
  tools: [],
  description: '',
  questions: [...DEFAULT_QUESTIONS],
});

export const recruitKey = (role: TeamRole, position: string) => `${role}|${position}`;

export const hasDuplicateQuestions = (questions: string[]) => {
  const normalizedQuestions = questions.map((question) => question.trim()).filter(Boolean);

  return new Set(normalizedQuestions).size !== normalizedQuestions.length;
};

export function useTeamDraft() {
  const [draft, setDraft] = useState<TeamDraft>(emptyDraft);
  const [warningKey, setWarningKey] = useState(0);

  const total = useMemo(
    () => Object.values(draft.recruit).reduce((sum, count) => sum + count, 0),
    [draft.recruit],
  );

  const people = useMemo(() => {
    const result: { key: string; role: TeamRole }[] = [];
    TEAM_ROLES.forEach((role) =>
      ROLE_OPTIONS[role].forEach((position) => {
        const count = draft.recruit[recruitKey(role, position)] ?? 0;
        for (let index = 0; index < count; index += 1) {
          result.push({ key: `${recruitKey(role, position)}-${index}`, role });
        }
      }),
    );
    return result;
  }, [draft.recruit]);

  const canContinue = (step: number) => {
    switch (step) {
      case 1:
        return draft.name.trim().length >= 2;
      case 2:
        return Boolean(draft.myPosition) && draft.recruitRoles.length > 0;
      case 3:
        return (
          draft.recruitRoles.length > 0 &&
          draft.recruitRoles.every((role) =>
            ROLE_OPTIONS[role].some(
              (position) => (draft.recruit[recruitKey(role, position)] ?? 0) > 0,
            ),
          )
        );
      case 4:
        if (!draft.mode || draft.meetings === 0) return false;
        if (draft.mode === '온라인') return draft.tools.length > 0;
        if (draft.mode === '오프라인') return Boolean(draft.place);
        return Boolean(draft.place) && draft.tools.length > 0;
      case 5:
        return (
          draft.description.trim().length > 0 &&
          draft.questions.every((question) => question.trim().length > 0) &&
          !hasDuplicateQuestions(draft.questions)
        );
      default:
        return true;
    }
  };

  const set = (patch: Partial<TeamDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const setName = (name: string) =>
    setDraft((current) => ({ ...current, name: name.slice(0, MAX_TEAM_NAME_LENGTH) }));

  const pickMyRole = (role: TeamRole) =>
    setDraft((current) => ({
      ...current,
      myRole: role,
      myPosition: current.myRole === role ? current.myPosition : null,
    }));

  const toggleRecruitRole = (role: TeamRole) =>
    setDraft((current) => {
      if (current.recruitRoles.includes(role)) {
        const recruit = { ...current.recruit };
        Object.keys(recruit).forEach((key) => {
          if (key.startsWith(`${role}|`)) delete recruit[key];
        });
        return {
          ...current,
          recruitRoles: current.recruitRoles.filter((item) => item !== role),
          recruit,
        };
      }
      return {
        ...current,
        recruitRoles: TEAM_ROLES.filter(
          (item) => item === role || current.recruitRoles.includes(item),
        ),
      };
    });

  const setRecruitCount = (key: string, delta: number) =>
    setDraft((current) => {
      const currentTotal = Object.values(current.recruit).reduce((sum, count) => sum + count, 0);
      if (delta > 0 && currentTotal >= MAX_RECRUIT) {
        setWarningKey((value) => value + 1);
        return current;
      }

      const nextCount = Math.max(0, (current.recruit[key] ?? 0) + delta);
      const recruit = { ...current.recruit };
      if (nextCount > 0) recruit[key] = nextCount;
      else delete recruit[key];
      return { ...current, recruit };
    });

  const toggleTool = (tool: string) =>
    setDraft((current) => ({
      ...current,
      tools: current.tools.includes(tool)
        ? current.tools.filter((item) => item !== tool)
        : [...current.tools, tool],
    }));

  const reset = () => setDraft(emptyDraft());

  return {
    draft,
    total,
    people,
    warningKey,
    canContinue,
    set,
    setName,
    pickMyRole,
    toggleRecruitRole,
    setRecruitCount,
    toggleTool,
    reset,
  };
}

export type TeamDraftApi = ReturnType<typeof useTeamDraft>;
