import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  Share,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';

import { Text } from '@/components/ui';
import type { ContestDetail } from '@/screens/contests/contestDetail';
import type { Team } from '@/screens/teams';
import { color, space } from '@/theme';
import { openExternalUrl } from '@/utils/link';

import { ContestBottomCTA } from './ContestBottomCTA';
import { ContestDescription } from './ContestDescription';
import { ContestDetailPanel, ContestDetailSection, ContestDetailTabBar } from './ContestDetailTabs';
import { ContestHeader } from './ContestHeader';
import { ContestInfoCard } from './ContestInfoCard';
import { RecruitingTeamList } from './RecruitingTeamList';

type DetailTab = 'detail' | 'teams';

// 목표 위치 도착을 못 받았을 때 점프 상태를 강제로 푸는 시간 (스크롤 애니메이션보다 넉넉하게)
const JUMP_FALLBACK_MS = 1000;
// 목표 위치 "도착"으로 볼 오차(px). 플랫폼마다 소수점 반올림이 달라서 약간 여유를 둬요.
const ARRIVE_TOLERANCE = 2;

type ContestDetailScreenProps = {
  contest: ContestDetail;
  teams: Team[];
  onCreateTeam: () => void;
};

// 공모전 상세 화면 (데이터는 라우트 파일 app/contest/[id].tsx에서 받아와요)
export function ContestDetailScreen({ contest, teams, onCreateTeam }: ContestDetailScreenProps) {
  const [tab, setTab] = useState<DetailTab>('detail');

  const scrollRef = useRef<ScrollViewInstance>(null);
  // 각 영역의 위치 (onLayout으로 측정)
  const tabBarHeight = useRef(0);
  const panelY = useRef(0);
  const teamsY = useRef(0);
  // 스크롤 가능한 최대 위치 계산용
  const viewportHeight = useRef(0);
  const contentHeight = useRef(0);
  const scrollY = useRef(0);

  // 탭을 눌러 이동하는 중에는 스크롤 위치로 탭을 바꾸지 않아요 (깜빡임 방지)
  // 목표 위치에 도착하면 바로 풀고, 혹시 도착 이벤트를 못 받으면 타이머로 풀어요.
  const jumpTarget = useRef<number | null>(null);
  const jumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const endJump = () => {
    if (jumpTimer.current) clearTimeout(jumpTimer.current);
    jumpTimer.current = null;
    jumpTarget.current = null;
  };

  // 화면을 나갈 때 남은 타이머 정리
  useEffect(() => endJump, []);
  // TODO: API 연결 전까지 화면 안에서만 저장 상태를 기억해요
  const [bookmarked, setBookmarked] = useState(false);

  // 개인 참가 공모전은 팀 모집이 없어서 탭 없이 상세 내용만 보여줘요
  const isTeamable = contest.participationType !== 'individual';

  // 탭바 바로 아래에서 해당 영역이 시작되는 스크롤 위치
  const scrollYOf = (key: DetailTab) =>
    key === 'detail'
      ? panelY.current - tabBarHeight.current
      : panelY.current + teamsY.current - tabBarHeight.current;

  const handlePressTab = (key: DetailTab) => {
    setTab(key);

    // 아직 영역 위치를 못 쟀으면(첫 렌더 직후) 엉뚱한 곳으로 가지 않게 이동하지 않아요
    const isMeasured = tabBarHeight.current > 0 && panelY.current > 0 && teamsY.current > 0;
    if (!isMeasured) return;

    // 내용이 짧으면 목표 위치까지 못 가니까, 갈 수 있는 최대 위치로 맞춰요
    const maxY = Math.max(contentHeight.current - viewportHeight.current, 0);
    const target = Math.min(Math.max(scrollYOf(key), 0), maxY);
    if (Math.abs(scrollY.current - target) < ARRIVE_TOLERANCE) return; // 이미 그 위치

    // 이전 점프의 타이머가 이번 점프를 먼저 풀지 않도록 새로 시작해요
    endJump();
    jumpTarget.current = target;
    jumpTimer.current = setTimeout(endJump, JUMP_FALLBACK_MS);
    scrollRef.current?.scrollTo({ y: target, animated: true });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const y = contentOffset.y;
    scrollY.current = y;

    if (jumpTarget.current !== null) {
      // 목표에 도착하면 점프 끝. 도착 전에는 탭을 바꾸지 않아요.
      if (Math.abs(y - jumpTarget.current) < ARRIVE_TOLERANCE) endJump();
      else return;
    }

    // 모집 중인 팀 영역이 짧아서 탭바 아래까지 못 올라와도, 맨 아래에 닿으면 팀 탭으로
    const isAtBottom = y + layoutMeasurement.height >= contentSize.height - 1;
    const next: DetailTab = y >= scrollYOf('teams') - 1 || isAtBottom ? 'teams' : 'detail';
    setTab((prev) => (prev === next ? prev : next));
  };

  // 휴대폰 기본 공유 창을 열어요 (카카오톡, 메시지 등)
  const handleShare = () => {
    // 원문 링크가 없는 공모전은 제목만 보내요
    const message = [contest.title, contest.sourceUrl].filter(Boolean).join('\n');
    Share.share({ message }).catch(() => {});
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
        contentContainerStyle={S.content}
        stickyHeaderIndices={isTeamable ? [1] : undefined}
        onScroll={isTeamable ? handleScroll : undefined}
        scrollEventThrottle={16}
        // 이동 중에 손으로 스크롤하면 점프를 멈추고 손 스크롤을 따라가요
        onScrollBeginDrag={endJump}
        // 스크롤 애니메이션이 끝났다는 신호를 받으면 그때도 점프를 끝내요 (위치 판단과 함께 이중 안전장치)
        onMomentumScrollEnd={endJump}
        onLayout={(e) => {
          viewportHeight.current = e.nativeEvent.layout.height;
        }}
        onContentSizeChange={(_, height) => {
          contentHeight.current = height;
        }}
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

      {isTeamable ? (
        <ContestBottomCTA label="팀 구성하기" onPress={onCreateTeam} />
      ) : (
        <ContestBottomCTA
          label="원문에서 신청하기 ↗"
          onPress={() => openExternalUrl(contest.sourceUrl)}
        />
      )}
    </View>
  );
}

// 공모전을 찾지 못했을 때
export function ContestNotFoundScreen() {
  return (
    <View style={S.screen}>
      <ContestHeader />
      <View style={S.notFound}>
        <Text variant="titleLg">존재하지 않는 공모전이에요.</Text>
      </View>
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
    paddingBottom: space[8], // 하단 버튼이 따로 있어서 기기 아래 여백은 버튼 쪽에서 챙겨요
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
