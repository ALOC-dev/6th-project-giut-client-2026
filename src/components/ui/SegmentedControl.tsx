import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect, useRef, useState } from 'react';
import { color, radius, shadow, text as type, useMotion } from '@/theme';
import { Press } from './Press';
import { Text } from './Text';

export type Segment = { key: string; label: string; count?: number };

export type SegmentedControlProps = {
  segments: Segment[];
  value: string;
  onChange: (key: string) => void;
  style?: StyleProp<ViewStyle>;
};

export function SegmentedControl({ segments, value, onChange, style }: SegmentedControlProps) {
  const { duration, easing, reduced } = useMotion();
  const [width, setWidth] = useState(0);

  const selectedIndex = segments.findIndex((s) => s.key === value);
  const n = segments.length;
  const cell = width > 0 && n > 0 ? (width - 6) / n : 0;

  const x = useSharedValue(0);
  const previousValue = useRef<string | null>(null);

  useEffect(() => {
    if (selectedIndex < 0) {
      previousValue.current = null;
      return;
    }
    if (cell <= 0) return;

    const target = Math.max(0, selectedIndex) * cell;
    const shouldAnimate =
      previousValue.current !== null && previousValue.current !== value && !reduced;

    x.value = shouldAnimate
      ? withTiming(target, { duration: duration.d3, easing: easing.out })
      : target;
    previousValue.current = value;
  }, [selectedIndex, cell, reduced, duration.d3, easing.out, value, x]);

  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  if (n === 0) return null;

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[
        {
          flexDirection: 'row',
          padding: 3,
          borderRadius: radius.lg,
          borderCurve: 'continuous',
          backgroundColor: color.surfaceSunken,
        },
        style,
      ]}
    >
      {cell > 0 && selectedIndex >= 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 3,
              bottom: 3,
              left: 3,
              width: cell,
              borderRadius: radius.md,
              borderCurve: 'continuous',
              backgroundColor: color.surface,
            },
            shadow.card,
            pill,
          ]}
        />
      ) : null}

      {segments.map((s) => {
        const on = s.key === value;
        return (
          <Press
            key={s.key}
            onPress={() => onChange(s.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={{ flex: 1, height: 36, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              variant="caption"
              maxFontSizeMultiplier={1.5}
              style={{
                fontWeight: on ? type.bodyStrong.fontWeight : type.body.fontWeight,
                color: on ? color.ink : color.textMuted,
              }}
            >
              {s.count === undefined ? s.label : `${s.label} ${s.count}`}
            </Text>
          </Press>
        );
      })}
    </View>
  );
}
