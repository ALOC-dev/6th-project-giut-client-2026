import { CategorySection } from '@/components/home/CategorySection';
import { DeadlineSection } from '@/components/home/DeadlineSection';
import { AppHeader } from '@/components/ui';
import { useBottomNavigationInset } from '@/hooks/useBottomNavigationInset';
import { CONTESTS } from '@/mocks/contests';
import { color } from '@/theme';
import { getDday } from '@/utils/date';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { contentPaddingBottom } = useBottomNavigationInset();
  const insets = useSafeAreaInsets();
  const closingThisWeek = CONTESTS.filter((contest) => {
    const dday = getDday(contest.endDate);
    return dday >= 0 && dday <= 6;
  });

  return (
    <View style={S.container}>
      <View style={{ paddingTop: insets.top }}>
        <AppHeader onPressNotification={() => {}} onPressSearch={() => {}} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: contentPaddingBottom }}>
        <DeadlineSection contests={closingThisWeek} />
        <CategorySection />
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.surface },
});
