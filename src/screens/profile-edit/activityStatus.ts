import { color } from '@/theme';

// 프로필 수정 API의 activityStatus 값
export type ActivityStatus = 'LOOKING_FOR_TEAM' | 'OPEN_TO_OFFERS' | 'RESTING';

type ActivityStatusOption = {
  key: ActivityStatus;
  label: string;
  description: string;
  dotColor: string;
};

// TODO: 이름과 설명은 임시. 서버가 내려주는 activityStatusName과 기획 문구가 정해지면 맞추기
export const ACTIVITY_STATUS_OPTIONS: ActivityStatusOption[] = [
  {
    key: 'LOOKING_FOR_TEAM',
    label: '팀 찾는 중',
    description: '팀장들에게 내 프로필이 추천돼요',
    dotColor: color.success,
  },
  {
    key: 'OPEN_TO_OFFERS',
    label: '제안 받는 중',
    description: '직접 찾지는 않지만 팀 제안은 받을 수 있어요',
    dotColor: color.pending,
  },
  {
    key: 'RESTING',
    label: '쉬는 중',
    description: '기웃허브에 내 프로필이 보이지 않아요',
    dotColor: color.textFaint,
  },
];

// 조회 응답에는 이름만 있어서 이름으로 찾아요. 모르는 이름이면 팀 찾는 중
export function toActivityStatus(name: string): ActivityStatus {
  return ACTIVITY_STATUS_OPTIONS.find((it) => it.label === name)?.key ?? 'LOOKING_FOR_TEAM';
}
