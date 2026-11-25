import { ScrollView, Share, StyleSheet, View } from 'react-native';

import { FolderTabBar } from '@/components/tabs/FolderTabBar';
import { color, space } from '@/theme';

import { ActivityHistorySection } from './ActivityHistorySection';
import { MyPageHeader } from './MyPageHeader';
import type { MyProfile, PortfolioItem } from './myProfile';
import { PortfolioSection } from './PortfolioSection';
import { ProfileCard } from './ProfileCard';
import { ProfileEmptyCard } from './ProfileEmptyCard';
import type { Scrap } from './scrap';
import { ScrapSection } from './ScrapSection';
import { useSectionTabs } from './useSectionTabs';

type MyPageTab = 'portfolio' | 'activity' | 'scrap';

// 화면에 나오는 순서
const TABS: readonly { key: MyPageTab; label: string }[] = [
  { key: 'portfolio', label: '포트폴리오' },
  { key: 'activity', label: '활동 이력' },
  { key: 'scrap', label: '스크랩' },
];
const TAB_KEYS = TABS.map(({ key }) => key);

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

  const {
    tab,
    handlePressTab,
    scrollRef,
    scrollProps,
    onTabBarLayout,
    onSectionsLayout,
    onSectionLayout,
  } = useSectionTabs(TAB_KEYS, space[4]);

  // TODO: API 연결 시 공유 링크 발급(POST /api/users/me/profile-share-links) 후 링크도 함께 공유
  const handleShare = (nickname: string) => {
    Share.share({ message: `${nickname}님의 기웃 프로필` }).catch(() => {});
  };

  return (
    <View style={S.screen}>
      <MyPageHeader onPressMenu={onPressMenu} />

      {/* stickyHeaderIndices가 순서를 세기 때문에 [프로필, 탭, 구역들] 순서를 지켜요 */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={S.content}
        stickyHeaderIndices={[1]}
        {...scrollProps}
      >
        <View style={S.profile}>
          {profile ? (
            <ProfileCard
              profile={profile}
              summary={summary}
              onPressEdit={onPressEditProfile}
              onPressShare={() => handleShare(profile.nickname)}
            />
          ) : (
            <ProfileEmptyCard onPressCreate={onPressCreateProfile} />
          )}
        </View>

        <FolderTabBar
          tabs={TABS}
          value={tab}
          variant="outlined"
          onChange={handlePressTab}
          onLayout={onTabBarLayout}
        />

        <View style={S.sections} onLayout={onSectionsLayout}>
          <View onLayout={onSectionLayout('portfolio')}>
            <PortfolioSection
              items={profile?.portfolioItems ?? []}
              count={summary.portfolioCount}
              emptyMessage={
                profile
                  ? '아직 등록한 포트폴리오가 없어요'
                  : '프로필을 먼저 생성하고 포트폴리오를 추가해 주세요'
              }
              onPressEdit={profile ? onPressEditPortfolio : undefined}
              onPressItem={onPressPortfolio}
            />
          </View>
          <View onLayout={onSectionLayout('activity')}>
            <ActivityHistorySection
              items={profile?.activityHistories ?? []}
              emptyMessage={
                profile
                  ? '아직 등록한 활동 이력이 없어요'
                  : '프로필을 먼저 생성하고 활동 이력을 추가해 주세요'
              }
              onPressEdit={profile ? onPressEditActivity : undefined}
            />
          </View>
          <View onLayout={onSectionLayout('scrap')}>
            <ScrapSection scraps={scraps} summary={summary} onPressScrap={onPressScrap} />
          </View>
        </View>
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
    paddingBottom: space[8],
  },
  profile: {
    paddingHorizontal: space[4],
  },
  sections: {
    paddingTop: space[4],
    paddingHorizontal: space[4],
    gap: space[8],
  },
});
