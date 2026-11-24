import { ScrollView, Share, StyleSheet, View } from 'react-native';

import { color, space } from '@/theme';

import { ActivityHistorySection } from './ActivityHistorySection';
import { MyPageHeader } from './MyPageHeader';
import type { MyProfile, PortfolioItem } from './myProfile';
import { PortfolioSection } from './PortfolioSection';
import { ProfileCard } from './ProfileCard';
import { ProfileEmptyCard } from './ProfileEmptyCard';
import type { Scrap } from './scrap';
import { ScrapSection } from './ScrapSection';

type MyPageScreenProps = {
  myProfile: MyProfile;
  scraps: Scrap[];
  onPressMenu: () => void;
  onPressCreateProfile: () => void;
  onPressEditProfile: () => void;
  onPressEditPortfolio: () => void;
  onPressPortfolio: (item: PortfolioItem) => void;
  onPressEditActivity: () => void;
  onPressScrap: (scrap: Scrap) => void;
};

export function MyPageScreen({
  myProfile,
  scraps,
  onPressMenu,
  onPressCreateProfile,
  onPressEditProfile,
  onPressEditPortfolio,
  onPressPortfolio,
  onPressEditActivity,
  onPressScrap,
}: MyPageScreenProps) {
  const { profile, summary } = myProfile;

  // TODO: API 연결 시 공유 링크 발급(POST /api/users/me/profile-share-links) 후 링크도 함께 공유
  const handleShare = (nickname: string) => {
    Share.share({ message: `${nickname}님의 기웃 프로필` }).catch(() => {});
  };

  return (
    <View style={S.screen}>
      <MyPageHeader onPressMenu={onPressMenu} />

      <ScrollView contentContainerStyle={S.content}>
        {profile ? (
          <>
            <ProfileCard
              profile={profile}
              summary={summary}
              onPressEdit={onPressEditProfile}
              onPressShare={() => handleShare(profile.nickname)}
            />
            <PortfolioSection
              items={profile.portfolioItems}
              count={summary.portfolioCount}
              onPressEdit={onPressEditPortfolio}
              onPressItem={onPressPortfolio}
            />
            <ActivityHistorySection
              items={profile.activityHistories}
              onPressEdit={onPressEditActivity}
            />
          </>
        ) : (
          <ProfileEmptyCard onPressCreate={onPressCreateProfile} />
        )}
        <ScrapSection scraps={scraps} summary={summary} onPressScrap={onPressScrap} />
        {/* TODO: 구역 이동 탭 */}
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
    gap: space[6],
  },
});
