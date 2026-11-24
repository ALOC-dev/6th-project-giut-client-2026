import { router } from 'expo-router';

import { MOCK_MY_PROFILE, MOCK_SCRAPS, MyPageScreen, type Scrap } from '@/screens/mypage';

function openScrap(scrap: Scrap) {
  if (scrap.kind === 'post') {
    router.push({ pathname: '/contest/[id]', params: { id: scrap.contestId } });
  } else {
    router.push({ pathname: '/team/[id]', params: { id: scrap.teamId } });
  }
}

export default function MyPageRoute() {
  // TODO: API 연결 시 로딩 / 실패 화면 추가
  return (
    <MyPageScreen
      myProfile={MOCK_MY_PROFILE}
      scraps={MOCK_SCRAPS}
      // TODO: 메뉴 화면이 생기면 이동
      onPressMenu={() => {}}
      // TODO: 프로필 등록 화면이 생기면 이동
      onPressCreateProfile={() => {}}
      // TODO: 프로필 편집 화면이 생기면 이동
      onPressEditProfile={() => {}}
      // TODO: 포트폴리오 편집 화면이 생기면 이동
      onPressEditPortfolio={() => {}}
      // TODO: 포트폴리오 상세 화면이 생기면 이동
      onPressPortfolio={() => {}}
      // TODO: 활동 이력 편집 화면이 생기면 이동
      onPressEditActivity={() => {}}
      onPressScrap={openScrap}
    />
  );
}
