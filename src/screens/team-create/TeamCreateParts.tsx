import { useEffect, useState, type ReactNode, type Ref } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type EasingFunction,
  type ScrollViewInstance,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { radius, space } from '@/theme';

import { CREATE_COLOR } from './constants';

export const TEAM_CREATE_EASING = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  spring: Easing.bezier(0.34, 1.5, 0.64, 1),
  pop: Easing.bezier(0.34, 1.56, 0.64, 1),
  stretch: Easing.bezier(0.34, 1.4, 0.64, 1),
  inOut: Easing.bezier(0.42, 0, 0.58, 1),
  easeOut: Easing.bezier(0, 0, 0.58, 1),
  shake: Easing.bezier(0.36, 0.07, 0.19, 0.97),
  fall: Easing.bezier(0.25, 0.6, 0.5, 1),
} as const;

export type MotionCurve = { inputRange: number[]; outputRange: number[] };

export function bakeKeyframes(
  percentages: number[],
  values: number[],
  easing: EasingFunction,
  steps = 12,
): MotionCurve {
  const inputRange = [0];
  const outputRange = [values[0]];

  for (let index = 0; index < percentages.length - 1; index += 1) {
    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      inputRange.push(
        (percentages[index] + progress * (percentages[index + 1] - percentages[index])) / 100,
      );
      outputRange.push(values[index] + (values[index + 1] - values[index]) * easing(progress));
    }
  }

  return { inputRange, outputRange };
}

export function createSpringCurve(
  dampingRatio: number,
  angularFrequency: number,
  seconds: number,
  steps = 48,
): MotionCurve {
  const dampedFrequency = angularFrequency * Math.sqrt(1 - dampingRatio * dampingRatio);
  const inputRange: number[] = [];
  const outputRange: number[] = [];

  for (let index = 0; index <= steps; index += 1) {
    const time = (index / steps) * seconds;
    inputRange.push(index / steps);
    outputRange.push(
      index === steps
        ? 1
        : 1 -
            Math.exp(-dampingRatio * angularFrequency * time) *
              (Math.cos(dampedFrequency * time) +
                ((dampingRatio * angularFrequency) / dampedFrequency) *
                  Math.sin(dampedFrequency * time)),
    );
  }

  return { inputRange, outputRange };
}

export function mapCurve(curve: MotionCurve, from: number, to: number): MotionCurve {
  return {
    inputRange: curve.inputRange,
    outputRange: curve.outputRange.map((value) => from + (to - from) * value),
  };
}

export function playOnce(value: Animated.Value, duration: number, delay = 0) {
  value.setValue(0);
  return Animated.timing(value, {
    toValue: 1,
    duration,
    delay,
    easing: Easing.linear,
    useNativeDriver: true,
  });
}

export function pingPong(
  value: Animated.Value,
  halfDuration: number,
  easing: EasingFunction = TEAM_CREATE_EASING.inOut,
) {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1,
        duration: halfDuration,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: halfDuration,
        easing,
        useNativeDriver: true,
      }),
    ]),
  );
}

export function linearLoop(value: Animated.Value, duration: number) {
  return Animated.loop(
    Animated.timing(value, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  );
}

export function PersonFigure({
  head,
  bodyWidth,
  bodyHeight,
  gap,
  fill,
  bodyOpacity = 1,
}: {
  head: number;
  bodyWidth: number;
  bodyHeight: number;
  gap: number;
  fill: string;
  bodyOpacity?: number;
}) {
  return (
    <>
      <View style={{ width: head, height: head, borderRadius: head / 2, backgroundColor: fill }} />
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          marginTop: gap,
          borderTopLeftRadius: bodyHeight,
          borderTopRightRadius: bodyHeight,
          backgroundColor: fill,
          opacity: bodyOpacity,
        }}
      />
    </>
  );
}

export function FigureBox({
  style,
  children,
}: {
  style: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  return <View style={[styles.figureBox, style]}>{children}</View>;
}

export function StepTransition({
  direction,
  children,
}: {
  direction: 'right' | 'left';
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: reduced ? 0 : 420,
      easing: TEAM_CREATE_EASING.out,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);

  const start = direction === 'right' ? 32 : -32;
  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: progress,
        transform: [
          {
            translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [start, 0] }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

export function FadeUp({ children, duration = 400 }: { children: ReactNode; duration?: number }) {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: reduced ? 0 : duration,
      easing: TEAM_CREATE_EASING.out,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [duration, progress, reduced]);

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

export function StepBody({
  children,
  contentStyle,
  scrollViewRef,
  ...props
}: ScrollViewProps & {
  contentStyle?: StyleProp<ViewStyle>;
  scrollViewRef?: Ref<ScrollViewInstance>;
}) {
  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.stepContent, contentStyle]}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

export function SectionDivider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Text variant="label" style={styles.sectionTitle}>
      {children}
    </Text>
  );
}

export function OptionChip({
  label,
  selected,
  onPress,
  style,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text variant="caption" color={selected ? 'surface' : 'textBody'} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  figureBox: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  stepContent: {
    paddingHorizontal: space[5],
    paddingTop: space[5],
    paddingBottom: space[6],
  },
  divider: {
    height: space[2],
    marginHorizontal: -space[5],
    backgroundColor: CREATE_COLOR.surfaceMuted,
  },
  sectionTitle: { marginBottom: space[3] },
  chip: {
    minHeight: 44,
    paddingHorizontal: space[3.5],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: CREATE_COLOR.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CREATE_COLOR.surface,
  },
  chipSelected: {
    borderColor: CREATE_COLOR.brand,
    backgroundColor: CREATE_COLOR.brand,
  },
  pressed: { opacity: 0.82 },
});
