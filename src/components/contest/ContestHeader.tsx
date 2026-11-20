import { router } from 'expo-router';
import { BookmarkSimpleIcon } from 'phosphor-react-native/src/icons/BookmarkSimple';
import { CaretLeftIcon } from 'phosphor-react-native/src/icons/CaretLeft';
import { ExportIcon } from 'phosphor-react-native/src/icons/Export';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Press, Text } from '@/components/ui';
import { color, space } from '@/theme';

type ContestHeaderProps = {
  title?: string;
  bookmarked?: boolean;
  onPressBookmark?: () => void; // 없으면 저장 버튼을 숨겨요
  onPressShare?: () => void; // 없으면 공유 버튼을 숨겨요
};

// 공모전 상세 상단 헤더: 뒤로 가기 / 제목 / 저장 · 공유
export function ContestHeader({
  title,
  bookmarked = false,
  onPressBookmark,
  onPressShare,
}: ContestHeaderProps) {
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
          touchSize={40}
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
              touchSize={40}
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
              touchSize={40}
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
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
