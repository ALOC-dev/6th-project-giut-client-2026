import { ScrollView, Share, StyleSheet, View } from 'react-native';

import { color, space } from '@/theme';

import { MyPageHeader } from './MyPageHeader';
import type { MyProfile } from './myProfile';
import { ProfileCard } from './ProfileCard';

type MyPageScreenProps = {
  myProfile: MyProfile;
  onPressMenu: () => void;
  onPressEditProfile: () => void;
};

export function MyPageScreen({ myProfile, onPressMenu, onPressEditProfile }: MyPageScreenProps) {
  const { profile, summary } = myProfile;

  // TODO: 다른 사람이 보는 프로필 화면이 생기면 링크도 함께 공유
  const handleShare = () => {
    Share.share({ message: `${profile.nickname}님의 기웃 프로필` }).catch(() => {});
  };

  return (
    <View style={S.screen}>
      <MyPageHeader onPressMenu={onPressMenu} />

      <ScrollView contentContainerStyle={S.content}>
        <ProfileCard
          profile={profile}
          summary={summary}
          onPressEdit={onPressEditProfile}
          onPressShare={handleShare}
        />
        {/* TODO: 포트폴리오 / 내 팀 / 스크랩 구역 */}
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surface,
  },
  content: {
    paddingTop: space[4],
    paddingHorizontal: space[4],
    paddingBottom: space[8],
  },
});
