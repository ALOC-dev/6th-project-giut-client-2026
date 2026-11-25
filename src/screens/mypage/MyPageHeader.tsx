import { ListIcon } from 'phosphor-react-native/src/icons/List';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Press, Text } from '@/components/ui';
import { color, space } from '@/theme';

type MyPageHeaderProps = {
  onPressMenu: () => void;
};

export function MyPageHeader({ onPressMenu }: MyPageHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[S.wrap, { paddingTop: insets.top }]}>
      <View style={S.bar}>
        <View style={S.logo} accessible accessibilityRole="header" accessibilityLabel="기웃">
          <Text variant="displayNumber" color="brand" maxFontSizeMultiplier={1.5}>
            기웃
          </Text>
          <Image
            source={require('../../../assets/images/giut-symbol.png')}
            accessible={false}
            resizeMode="contain"
            style={S.symbol}
          />
        </View>

        <Press
          onPress={onPressMenu}
          accessibilityRole="button"
          accessibilityLabel="메뉴"
          style={S.menu}
        >
          <ListIcon size={24} color={color.ink} weight="bold" />
        </Press>
      </View>
    </View>
  );
}

// 높이, 로고 크기는 AppHeader와 같아요
const S = StyleSheet.create({
  wrap: {
    backgroundColor: color.surface,
    borderBottomWidth: 1,
    borderBottomColor: color.lineSoft,
  },
  bar: {
    height: 56,
    paddingLeft: space[4],
    paddingRight: space[2],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
  symbol: {
    width: 27,
    height: 24,
  },
  menu: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
