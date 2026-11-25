import type { ActivityType } from '@/screens/contests/contest';

// TODO: 스크랩 목록 조회 API가 아직 없어요 (추가·삭제와 개수만 있음). 생기면 필드 이름 맞추기
export type PostScrap = {
  kind: 'post';
  contestId: string;
  activityType: ActivityType;
  title: string;
  org: string;
  deadline: string;
};

export type TeamScrap = {
  kind: 'team';
  teamId: string;
  name: string;
  contestTitle: string;
  memberCount: number;
  capacity: number;
  closed: boolean;
};

export type Scrap = PostScrap | TeamScrap;

export type ScrapKind = Scrap['kind'];

export function getScrapKey(scrap: Scrap) {
  return scrap.kind === 'post' ? `post-${scrap.contestId}` : `team-${scrap.teamId}`;
}
