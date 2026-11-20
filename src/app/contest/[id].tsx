import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ScrollView,
  Share,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ContestDescription } from '@/components/contest/ContestDescription';
import {
  ContestDetailPanel,
  ContestDetailSection,
  ContestDetailTabBar,
} from '@/components/contest/ContestDetailTabs';
import { ContestHeader } from '@/components/contest/ContestHeader';
import { ContestInfoCard } from '@/components/contest/ContestInfoCard';
import { RecruitingTeamList } from '@/components/contest/RecruitingTeamList';
import { Text } from '@/components/ui';
import { getContest } from '@/mocks/contests';
import { getTeamsByContest } from '@/mocks/teams';
import { color, space } from '@/theme';

type DetailTab = 'detail' | 'teams';

export default function ContestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<DetailTab>('detail');

  const scrollRef = useRef<ScrollViewInstance>(null);
  // 각 영역의 위치 (onLayout으로 측정)
  const tabBarHeight = useRef(0);
  const panelY = useRef(0);
  const teamsY = useRef(0);
  // 탭을 눌러 이동하는 중에는 스크롤 위치로 탭을 바꾸지 않아요 (깜빡임 방지)
  const isJumping = useRef(false);
  // TODO: API 연결 전까지 화면 안에서만 저장 상태를 기억해요
  const [bookmarked, setBookmarked] = useState(false);

  const contest = getContest(id);

  if (!contest) {
    return (
      <View style={S.screen}>
        <ContestHeader />
        <View style={S.notFound}>
          <Text variant="titleLg">존재하지 않는 공모전이에요.</Text>
        </View>
      </View>
    );
  }

  const teams = getTeamsByContest(contest.id);
  // 개인 참가 공모전은 팀 모집이 없어서 탭 없이 상세 내용만 보여줘요
  const isTeamable = contest.participationType !== 'individual';

  // 탭바 바로 아래에서 해당 영역이 시작되는 스크롤 위치
  const scrollYOf = (key: DetailTab) =>
    key === 'detail'
      ? panelY.current - tabBarHeight.current
      : panelY.current + teamsY.current - tabBarHeight.current;

  const handlePressTab = (key: DetailTab) => {
    setTab(key);
    isJumping.current = true;
    scrollRef.current?.scrollTo({ y: scrollYOf(key), animated: true });
    setTimeout(() => {
      isJumping.current = false;
    }, 500);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isJumping.current) return;
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const y = contentOffset.y;
    // 모집 중인 팀 영역이 짧아서 탭바 아래까지 못 올라와도, 맨 아래에 닿으면 팀 탭으로
    const isAtBottom = y + layoutMeasurement.height >= contentSize.height - 1;
    const next: DetailTab = y >= scrollYOf('teams') - 1 || isAtBottom ? 'teams' : 'detail';
    setTab((prev) => (prev === next ? prev : next));
  };

  // 휴대폰 기본 공유 창을 열어요 (카카오톡, 메시지 등)
  const handleShare = () => {
    Share.share({ message: `${contest.title}\n${contest.sourceUrl}` }).catch(() => {});
  };

  return (
    <View style={S.screen}>
      <ContestHeader
        bookmarked={bookmarked}
        onPressBookmark={() => setBookmarked((prev) => !prev)}
        onPressShare={handleShare}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[S.content, { paddingBottom: insets.bottom + space[8] }]}
        stickyHeaderIndices={isTeamable ? [1] : undefined}
        onScroll={isTeamable ? handleScroll : undefined}
        scrollEventThrottle={16}
      >
        <ContestInfoCard contest={contest} />

        {isTeamable && (
          <ContestDetailTabBar<DetailTab>
            tabs={[
              { key: 'detail', label: '상세 내용' },
              { key: 'teams', label: '모집 중인 팀', count: teams.length },
            ]}
            value={tab}
            onChange={handlePressTab}
            onLayout={(e) => {
              tabBarHeight.current = e.nativeEvent.layout.height;
            }}
          />
        )}

        {isTeamable ? (
          <ContestDetailPanel
            joinLeftTab={tab === 'detail'}
            onLayout={(e) => {
              panelY.current = e.nativeEvent.layout.y;
            }}
          >
            <ContestDetailSection>
              <ContestDescription
                description={contest.description}
                sourceName={contest.sourceName}
              />
            </ContestDetailSection>
            <ContestDetailSection
              title="모집 중인 팀"
              count={teams.length}
              // TODO: 팀 전체 목록 화면이 생기면 이동 연결
              onPressMore={teams.length > 0 ? () => {} : undefined}
              onLayout={(e) => {
                teamsY.current = e.nativeEvent.layout.y;
              }}
            >
              <RecruitingTeamList teams={teams} />
            </ContestDetailSection>
          </ContestDetailPanel>
        ) : (
          <ContestDetailPanel title="상세 내용">
            <ContestDescription description={contest.description} sourceName={contest.sourceName} />
          </ContestDetailPanel>
        )}
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surfaceSunken,
  },
  content: {
    paddingTop: space[2],
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
