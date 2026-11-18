import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { space } from '@/theme';

// BottomNavigation의 높이 (src/components/ui/BottomNavigation.tsx의 minHeight)
const BOTTOM_NAVIGATION_HEIGHT = 64;

/**
 * 화면 위에 떠 있는 바텀 네비게이션의 위치와, 콘텐츠가 가려지지 않기 위한 여백을 계산합니다.
 *
 * - bottomOffset: 화면 아래에서 바텀 네비게이션까지의 거리 (기기별 Safe Area 반영)
 * - contentPaddingBottom: 탭 화면의 스크롤 영역 하단에 줄 여백
 *   예) <ScrollView contentContainerStyle={{ paddingBottom: contentPaddingBottom }} />
 */
export function useBottomNavigationInset() {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, space[3]);

  return {
    bottomOffset,
    contentPaddingBottom: bottomOffset + BOTTOM_NAVIGATION_HEIGHT + space[4],
  };
}
