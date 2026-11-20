import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Text } from '@/components/ui';
import { color, radius, shadow, space, useMotion } from '@/theme';

const ICON_SIZE = 18;
const VIEWBOX_SIZE = 24;
const UNIT = ICON_SIZE / VIEWBOX_SIZE;
const DURATION = 550;
const LOWER_KNOB_DELAY = 60;

const KNOB_INPUT = [0, 0.087, 0.175, 0.263, 0.35, 0.438, 0.525, 0.613, 0.7, 0.775, 0.85, 0.925, 1];
const UPPER_KNOB = [0, -6.61, -8.391, -8.218, -8, 0.262, 2.488, 2.273, 2, 0.348, -0.098, -0.055, 0];
const LOWER_KNOB = [0, 7.436, 9.439, 9.246, 9, -0.088, -2.537, -2.3, -2, -0.348, 0.098, 0.055, 0];

type HubFilterButtonProps = {
  count: number;
  onPress: () => void;
};

export function HubFilterButton({ count, onPress }: HubFilterButtonProps) {
  const { reduced } = useMotion();
  const [upperProgress] = useState(() => new Animated.Value(0));
  const [lowerProgress] = useState(() => new Animated.Value(0));
  const active = count > 0;
  const iconColor = active ? color.brand : color.ink;
  const supportsLiquidGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();

  const animate = () => {
    if (reduced) return;

    upperProgress.stopAnimation();
    lowerProgress.stopAnimation();
    upperProgress.setValue(0);
    lowerProgress.setValue(0);

    Animated.parallel([
      Animated.timing(upperProgress, {
        toValue: 1,
        duration: DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(lowerProgress, {
        toValue: 1,
        duration: DURATION,
        delay: LOWER_KNOB_DELAY,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const upperTranslateX = upperProgress.interpolate({
    inputRange: KNOB_INPUT,
    outputRange: UPPER_KNOB.map((value) => value * UNIT),
  });
  const lowerTranslateX = lowerProgress.interpolate({
    inputRange: KNOB_INPUT,
    outputRange: LOWER_KNOB.map((value) => value * UNIT),
  });

  return (
    <Pressable
      onPress={() => {
        animate();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={active ? `필터, 선택한 조건 ${count}개` : '필터'}
      style={[styles.button, shadow.card]}
    >
      {supportsLiquidGlass ? (
        <GlassView
          colorScheme="light"
          glassEffectStyle="regular"
          tintColor="rgba(255,255,255,0.58)"
          pointerEvents="none"
          style={styles.glass}
        />
      ) : (
        <View pointerEvents="none" style={[styles.glass, styles.fallback]} />
      )}
      <View pointerEvents="none" style={styles.highlight} />

      <View style={styles.icon}>
        <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" accessible={false}>
          <Path
            d="M3 7h18M3 17h18"
            stroke={iconColor}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.35}
          />
        </Svg>
        <Animated.View
          pointerEvents="none"
          style={[styles.iconLayer, { transform: [{ translateX: upperTranslateX }] }]}
        >
          <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" accessible={false}>
            <Path d="M3 7h11" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
            <Circle
              cx={16}
              cy={7}
              r={2.2}
              fill={color.surface}
              stroke={iconColor}
              strokeWidth={2}
            />
          </Svg>
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[styles.iconLayer, { transform: [{ translateX: lowerTranslateX }] }]}
        >
          <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" accessible={false}>
            <Path d="M10 17h11" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
            <Circle
              cx={8}
              cy={17}
              r={2.2}
              fill={color.surface}
              stroke={iconColor}
              strokeWidth={2}
            />
          </Svg>
        </Animated.View>
      </View>

      <Text variant="label" color={active ? 'brand' : 'ink'}>
        필터
      </Text>
      {active ? (
        <View style={styles.badge}>
          <Text variant="meta" color="surface">
            {count}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: space[3],
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  glass: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.full,
  },
  fallback: {
    backgroundColor: 'rgba(255,255,255,0.78)',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.92)',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  iconLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: space[1],
    borderRadius: radius.full,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
