import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/ui';
import type { ActivityType } from '@/screens/contests/contest';
import type { ContestDetail } from '@/screens/contests/contestDetail';
import { color, space } from '@/theme';
import { getDday } from '@/utils/date';

import { CategorySection } from './CategorySection';
import { DeadlineSection } from './DeadlineSection';
import { InterestBanner } from './InterestBanner';
import { RecommendationSection } from './RecommendationSection';

// TODO: 로그인·관심 분야 기능이 생기면 실제 사용자 정보로 교체 (지금은 '공모전' 선택 가정)
const TEMP_USER_NAME = '김민재';
const TEMP_INTEREST: ActivityType = 'CONTEST';
const RECOMMEND_COUNT = 3;

type HomeScreenProps = {
  contests: ContestDetail[];
  // 분야를 넘기면 그 분야 탭으로, 안 넘기면 전체 탭으로 공모전 목록을 열어요
  onOpenContestList: (activityType?: ActivityType) => void;
};

export function HomeScreen({ contests, onOpenContestList }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [showBanner, setShowBanner] = useState(true);

  const closingThisWeek = useMemo(
    () =>
      contests.filter((contest) => {
        const dday = getDday(contest.deadline);
        return dday >= 0 && dday <= 6;
      }),
    [contests],
  );

  // 관심 분야 + 마감 전 공모전 중 조회수 순
  // TODO: 추천 API가 생기면 서버 추천 결과로 교체
  const recommended = useMemo(
    () =>
      contests
        .filter(
          (contest) => contest.activityType === TEMP_INTEREST && getDday(contest.deadline) >= 0,
        )
        .sort((a, b) => b.views - a.views)
        .slice(0, RECOMMEND_COUNT),
    [contests],
  );

  return (
    <View style={S.container}>
      <View style={{ paddingTop: insets.top }}>
        <AppHeader onPressNotification={() => {}} onPressSearch={() => {}} />
      </View>
      <ScrollView>
        {closingThisWeek.length > 0 && <DeadlineSection contests={closingThisWeek} />}
        <CategorySection
          onPressAll={() => onOpenContestList()}
          onPressCategory={onOpenContestList}
        />
        {showBanner && (
          <InterestBanner
            onSubmit={() => setShowBanner(false)}
            onClose={() => setShowBanner(false)}
          />
        )}
        {recommended.length > 0 && (
          <RecommendationSection
            userName={TEMP_USER_NAME}
            contests={recommended}
            // 배너를 닫으면 분야 섹션과 바로 붙어서 간격을 더 둬요
            style={!showBanner && S.recommendationSpaced}
          />
        )}
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.surface },
  recommendationSpaced: { marginTop: space[4] },
});
