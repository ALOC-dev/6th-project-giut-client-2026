import { router } from 'expo-router';
import { BookmarkSimpleIcon } from 'phosphor-react-native/src/icons/BookmarkSimple';
import { CaretLeftIcon } from 'phosphor-react-native/src/icons/CaretLeft';
import { ExportIcon } from 'phosphor-react-native/src/icons/Export';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Press, Text } from '@/components/ui';
import { color, space } from '@/theme';

type DetailHeaderProps = {
  title?: string;
  bookmarked?: boolean;
  onPressBookmark?: () => void; // 없으면 버튼 숨김
  onPressShare?: () => void; // 없으면 버튼 숨김
};

// 상세 화면 공통 헤더 (공모전 상세, 팀 상세)
export function DetailHeader({
  title,
  bookmarked = false,
  onPressBookmark,
  onPressShare,
}: DetailHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[S.wrap, { paddingTop: insets.top }]}>
      <View style={S.bar}>
        {/* 제목은 버튼 개수와 상관없이 항상 가운데 */}
        {title && (
          <View style={S.titleWrap} pointerEvents="none">
            <Text variant="titleSm">{title}</Text>
          </View>
        )}

        <Press
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          style={S.iconButton}
        >
          <CaretLeftIcon size={24} color={color.ink} />
        </Press>

        <View style={S.right}>
          {onPressBookmark && (
            <Press
              onPress={onPressBookmark}
              accessibilityRole="button"
              accessibilityLabel={bookmarked ? '저장 취소' : '저장'}
              accessibilityState={{ selected: bookmarked }}
              style={S.iconButton}
            >
              <BookmarkSimpleIcon
                size={24}
                color={bookmarked ? color.brand : color.ink}
                weight={bookmarked ? 'fill' : 'regular'}
              />
            </Press>
          )}
          {onPressShare && (
            <Press
              onPress={onPressShare}
              accessibilityRole="button"
              accessibilityLabel="공유"
              style={S.iconButton}
            >
              <ExportIcon size={24} color={color.ink} />
            </Press>
          )}
        </View>
      </View>
    </View>
  );
}

const ICON_BUTTON_SIZE = 44;

const S = StyleSheet.create({
  wrap: {
    backgroundColor: color.surfaceSunken,
  },
  bar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[2],
  },
  titleWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 최소 터치 영역 44pt
  iconButton: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
