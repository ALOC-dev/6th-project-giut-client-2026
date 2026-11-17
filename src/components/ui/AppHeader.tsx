import { Image, View, type StyleProp, type ViewStyle } from 'react-native';

import { color, space } from '@/theme';

import { BellButton } from './BellButton';
import { Press } from './Press';
import { SearchButton } from './SearchButton';
import { Text } from './Text';

export type AppHeaderProps = {
  onPressLogo?: () => void;
  onPressNotification: () => void;
  onPressSearch: () => void;
  hasUnreadNotification?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppHeader({
  onPressLogo,
  onPressNotification,
  onPressSearch,
  hasUnreadNotification = false,
  style,
}: AppHeaderProps) {
  return (
    <View
      style={[
        {
          height: 56,
          paddingHorizontal: space[4],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: color.surface,
          borderBottomWidth: 1,
          borderBottomColor: color.lineSoft,
        },
        style,
      ]}
    >
      <Press
        onPress={onPressLogo}
        accessibilityRole={onPressLogo ? 'button' : undefined}
        accessibilityLabel="홈으로 이동"
        scaleOnPress={!!onPressLogo}
        style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6 }}
      >
        <Text
          variant="titleXl"
          color="brand"
          maxFontSizeMultiplier={1.5}
          style={{ fontSize: 28, lineHeight: 34, letterSpacing: -0.8 }}
        >
          기웃
        </Text>
        <Image
          source={require('../../../assets/images/giut-symbol.png')}
          accessible={false}
          resizeMode="contain"
          style={{ width: 27, height: 24 }}
        />
      </Press>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <BellButton unread={hasUnreadNotification} onPress={onPressNotification} />
        <SearchButton onPress={onPressSearch} />
      </View>
    </View>
  );
}
