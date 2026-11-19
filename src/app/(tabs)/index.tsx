import { CategorySection } from '@/components/home/CategorySection';
import { DeadlineSection } from '@/components/home/DeadlineSection';
import { InterestBanner } from '@/components/home/InterestBanner';
import { AppHeader } from '@/components/ui';
import { CONTESTS } from '@/mocks/contests';
import { color } from '@/theme';
import { getDday } from '@/utils/date';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const closingThisWeek = CONTESTS.filter((contest) => {
    const dday = getDday(contest.endDate);
    return dday >= 0 && dday <= 6;
  });
  const [showBanner, setShowBanner] = useState(true);

  return (
    <View style={S.container}>
      <View style={{ paddingTop: insets.top }}>
        <AppHeader onPressNotification={() => {}} onPressSearch={() => {}} />
      </View>
      <ScrollView>
        <DeadlineSection contests={closingThisWeek} />
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
