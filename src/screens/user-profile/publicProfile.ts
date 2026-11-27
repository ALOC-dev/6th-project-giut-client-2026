import type { Profile } from '@/screens/mypage';

// 다른 사람 프로필 조회 API(GET /api/profile/{userId}) 응답 타입
export type PublicProfileDetail = {
  nickname: string;
  universityVerified: boolean;
  receivedProposalCount: number;
  recommended: boolean; // 내가 이 프로필을 추천했는지
  recommendationCount: number;
  // TODO: 아직 API에 없는 값. 백엔드와 정해지면 맞추기
  collaborationCount?: number;
  profile: Profile;
};
