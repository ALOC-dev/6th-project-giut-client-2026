import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import bold from 'expo-symbols/androidWeights/bold';
import semiBold from 'expo-symbols/androidWeights/semiBold';
import { CirclesThreeIcon } from 'phosphor-react-native/src/icons/CirclesThree';
import {
  Image,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { color, space } from '@/theme';

import { Press } from './Press';
import { Text } from './Text';

export type BottomNavigationIcon =
  | {
      ios: SFSymbol;
      android: AndroidSymbol;
      web: AndroidSymbol;
    }
  | {
      phosphor: 'circles-three';
    }
  | {
      image: ImageSourcePropType;
    };

const settleSpring = {
  damping: 12,
  stiffness: 260,
  mass: 0.5,
};

export type BottomNavigationItem = {
  key: string;
  label: string;
  icon: BottomNavigationIcon;
  activeIcon?: BottomNavigationIcon;
};

export type BottomNavigationProps = {
  items: BottomNavigationItem[];
  value: string;
  onChange: (key: string) => void;
  style?: StyleProp<ViewStyle>;
};

type BottomNavigationTabProps = {
  item: BottomNavigationItem;
  selected: boolean;
  onPress: () => void;
};

function BottomNavigationTab({ item, selected, onPress }: BottomNavigationTabProps) {
  const reduceMotion = useReducedMotion();
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const icon = selected && item.activeIcon ? item.activeIcon : item.icon;
  const iconColor = selected ? color.brand : color.textMuted;

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handlePress = () => {
    if (!reduceMotion) {
      cancelAnimation(translateY);
      cancelAnimation(scale);
      translateY.set(0);
      scale.set(1);
      translateY.set(withSequence(
        withTiming(-3, { duration: 80, easing: Easing.out(Easing.cubic) }),
        withSpring(0, settleSpring),
      ));
      scale.set(withSequence(
        withTiming(0.94, { duration: 70, easing: Easing.in(Easing.cubic) }),
        withSpring(1, settleSpring),
      ));
    }

    onPress();
  };

  return (
    <Press
      onPress={handlePress}
      accessibilityRole="tab"
      accessibilityLabel={`${item.label} 탭`}
      accessibilityState={{ selected }}
      scaleOnPress={false}
      style={{
        flex: 1,
        minHeight: 62,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      <Animated.View
        style={[
          {
            height: 28,
            alignItems: 'center',
            justifyContent: 'center',
          },
          animatedIconStyle,
        ]}
      >
        {'phosphor' in icon ? (
          <CirclesThreeIcon size={28} color={iconColor} weight="bold" />
        ) : 'image' in icon ? (
          <Image
            source={icon.image}
            accessible={false}
            resizeMode="contain"
            style={{ width: 29, height: 24, tintColor: iconColor }}
          />
        ) : (
          <SymbolView
            name={icon}
            size={25}
            tintColor={iconColor}
            weight={{
              ios: selected ? 'bold' : 'semibold',
              android: selected ? bold : semiBold,
            }}
          />
        )}
      </Animated.View>
      <Text
        variant="badge"
        color={selected ? 'brand' : 'textMuted'}
        maxFontSizeMultiplier={1.5}
        style={{ fontWeight: selected ? '800' : '700' }}
      >
        {item.label}
      </Text>
    </Press>
  );
}

export function BottomNavigation({ items, value, onChange, style }: BottomNavigationProps) {
  return (
    <View
      style={[
        {
          minHeight: 62,
          flexDirection: 'row',
          alignItems: 'stretch',
          borderTopWidth: 1,
          borderTopColor: color.lineSoft,
          backgroundColor: color.surface,
          paddingHorizontal: space[2],
        },
        style,
      ]}
    >
      {items.map((item) => (
        <BottomNavigationTab
          key={item.key}
          item={item}
          selected={item.key === value}
          onPress={() => onChange(item.key)}
        />
      ))}
    </View>
  );
}
