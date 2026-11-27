import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DetailHeader } from '@/components/header/DetailHeader';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { FolderTabBar } from '@/components/tabs/FolderTabBar';
import { Text } from '@/components/ui';
import {
  ActivityHistorySection,
  PortfolioSection,
  useSectionTabs,
  type PortfolioItem,
} from '@/screens/mypage';
import { color, space } from '@/theme';

import type { PublicProfileDetail } from './publicProfile';
import { UserProfileActions } from './UserProfileActions';

type UserProfileTab = 'portfolio' | 'activity';

// 화면에 나오는 순서
const TABS: readonly { key: UserProfileTab; label: string }[] = [
  { key: 'portfolio', label: '포트폴리오' },
  { key: 'activity', label: '활동 이력' },
];
const TAB_KEYS = TABS.map(({ key }) => key);

type UserProfileScreenProps = {
  detail: PublicProfileDetail;
  onPressMore: () => void;
  onPressPropose: () => void;
  onPressMessage: () => void;
  onPressPortfolio: (item: PortfolioItem) => void;
};

export function UserProfileScreen({
  detail,
  onPressMore,
  onPressPropose,
  onPressMessage,
  onPressPortfolio,
}: UserProfileScreenProps) {
  const { profile } = detail;

  // TODO: API 연결 전까지 화면 안에서만 추천 상태를 기억해요
  const [recommended, setRecommended] = useState(detail.recommended);

  // 처음 받은 수에서 내 추천을 바꾼 만큼만 더하고 빼요
  const recommendationCount =
    detail.recommendationCount + Number(recommended) - Number(detail.recommended);

  const {
    tab,
    handlePressTab,
    scrollRef,
    scrollProps,
    onTabBarLayout,
    onSectionsLayout,
    onSectionLayout,
  } = useSectionTabs(TAB_KEYS, space[4]);

  return (
    <View style={S.screen}>
      <DetailHeader
        background="surface"
        recommended={recommended}
        onPressRecommend={() => setRecommended((prev) => !prev)}
        onPressMore={onPressMore}
      />

      {/* stickyHeaderIndices가 순서를 세기 때문에 [프로필, 탭, 구역들] 순서를 지켜요 */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={S.content}
        stickyHeaderIndices={[1]}
        {...scrollProps}
      >
        <View style={S.profile}>
          <ProfileCard
            profile={profile}
            recommendationCount={recommendationCount}
            collaborationCount={detail.collaborationCount}
            actions={
              <UserProfileActions onPressPropose={onPressPropose} onPressMessage={onPressMessage} />
            }
          />
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
              items={profile.portfolioItems}
              count={profile.portfolioItems.length}
              emptyMessage="아직 공개한 포트폴리오가 없어요"
              onPressItem={onPressPortfolio}
            />
          </View>
          <View onLayout={onSectionLayout('activity')}>
            <ActivityHistorySection
              items={profile.activityHistories}
              emptyMessage="아직 등록한 활동 이력이 없어요"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export function UserProfileNotFoundScreen() {
  return (
    <View style={S.screen}>
      <DetailHeader background="surface" />
      <View style={S.notFound}>
        <Text variant="titleLg">존재하지 않는 프로필이에요.</Text>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surface,
  },
  content: {
    paddingTop: space[2],
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
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
