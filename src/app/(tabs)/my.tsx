import { MOCK_MY_PROFILE, MyPageScreen } from '@/screens/mypage';

export default function MyPageRoute() {
  // TODO: API 연결 시 로딩 / 실패 화면 추가
  return (
    <MyPageScreen
      myProfile={MOCK_MY_PROFILE}
      // TODO: 메뉴 화면이 생기면 이동
      onPressMenu={() => {}}
      // TODO: 프로필 편집 화면이 생기면 이동
      onPressEditProfile={() => {}}
      // TODO: 포트폴리오 편집 화면이 생기면 이동
      onPressEditPortfolio={() => {}}
      // TODO: 포트폴리오 상세 화면이 생기면 이동
      onPressPortfolio={() => {}}
    />
  );
}
