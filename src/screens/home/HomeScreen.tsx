import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/ui';
import type { ContestDetail } from '@/screens/contests/contestDetail';
import { color } from '@/theme';
import { getDday } from '@/utils/date';

import { CategorySection } from './CategorySection';
import { DeadlineSection } from './DeadlineSection';
import { InterestBanner } from './InterestBanner';

type HomeScreenProps = {
  contests: ContestDetail[];
};

// 홈 화면 (데이터는 라우트 파일 app/(tabs)/index.tsx에서 받아와요)
export function HomeScreen({ contests }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [showBanner, setShowBanner] = useState(true);

  // 오늘부터 6일 안에 마감되는 공모전
  const closingThisWeek = useMemo(
    () =>
      contests.filter((contest) => {
        const dday = getDday(contest.deadline);
        return dday >= 0 && dday <= 6;
      }),
    [contests],
  );

  return (
    <View style={S.container}>
      <View style={{ paddingTop: insets.top }}>
        <AppHeader onPressNotification={() => {}} onPressSearch={() => {}} />
      </View>
      <ScrollView>
        {/* 이번 주 마감 공모전이 없으면 섹션을 숨겨요 */}
        {closingThisWeek.length > 0 && <DeadlineSection contests={closingThisWeek} />}
        <CategorySection />
        {showBanner && (
          <InterestBanner
            onSubmit={() => setShowBanner(false)}
            onClose={() => setShowBanner(false)}
          />
        )}
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.surface },
});
