import {
  Easing,
  Keyframe,
  useReducedMotion,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export const easing = {
  out: Easing.bezierFn(0.22, 1, 0.36, 1),
  spring: Easing.bezierFn(0.34, 1.56, 0.64, 1),
  springSoft: Easing.bezierFn(0.34, 1.4, 0.64, 1),
  inOut: Easing.bezierFn(0.45, 0, 0.35, 1),
  exit: Easing.bezierFn(0.55, 0, 0.8, 0.4),
} as const;

export const duration = {
  d1: 200,
  d2: 250,
  d3: 300,
  d4: 350,
  d5: 400,
  d6: 450,
  d7: 600,
} as const;

export const ambient = {
  float: 3200,
  pulse: 1800,
  shimmer: 1400,
} as const;

export const stagger = { tight: 40, card: 80, maxSteps: 5 } as const;

export const delayOf = (index: number, step: number = stagger.card) =>
  Math.min(index, stagger.maxSteps - 1) * step;

export const press = {
  scale: 0.95,
  duration: duration.d2,
  easing: easing.spring,
} as const;

export const enter = {
  fadeUp: (index = 0, step = stagger.card) =>
    new Keyframe({
      0: { opacity: 0, transform: [{ translateY: 10 }] },
      100: { opacity: 1, transform: [{ translateY: 0 }], easing: easing.out },
    })
      .duration(duration.d4)
      .delay(delayOf(index, step)),

  selectionFadeUp: () =>
    new Keyframe({
      0: { opacity: 0, transform: [{ translateY: 10 }] },
      100: {
        opacity: 1,
        transform: [{ translateY: 0 }],
        easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
      },
    }).duration(duration.d4),

  fade: (index = 0, step = stagger.tight) =>
    new Keyframe({
      0: { opacity: 0 },
      100: { opacity: 1, easing: easing.out },
    })
      .duration(duration.d4)
      .delay(delayOf(index, step)),

  menu: () =>
    new Keyframe({
      0: { opacity: 0, transform: [{ translateY: -6 }, { scale: 0.97 }] },
      100: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }], easing: easing.out },
    }).duration(duration.d1),

  step: (dir: 'left' | 'right' = 'right', index = 0) =>
    new Keyframe({
      0: { opacity: 0, transform: [{ translateX: dir === 'right' ? 32 : -32 }] },
      100: { opacity: 1, transform: [{ translateX: 0 }], easing: easing.out },
    })
      .duration(duration.d4)
      .delay(delayOf(index, stagger.tight)),

  pop: (index = 0) =>
    new Keyframe({
      0: { opacity: 0, transform: [{ scale: 0.4 }] },
      60: { opacity: 1, transform: [{ scale: 1.15 }] },
      100: { opacity: 1, transform: [{ scale: 1 }], easing: easing.spring },
    })
      .duration(duration.d5)
      .delay(delayOf(index, stagger.tight)),

  pill: () =>
    new Keyframe({
      0: { opacity: 0, transform: [{ translateX: 24 }, { scale: 0.9 }] },
      100: { opacity: 1, transform: [{ translateX: 0 }, { scale: 1 }], easing: easing.out },
    })
      .duration(duration.d3)
      .delay(60),

  toast: () =>
    new Keyframe({
      0: { opacity: 0, transform: [{ translateY: 10 }] },
      100: { opacity: 1, transform: [{ translateY: 0 }], easing: easing.out },
    }).duration(duration.d3),
} as const;

export const slide = {
  sheet: {
    in: { duration: duration.d3, easing: easing.out },
    out: { duration: duration.d2, easing: easing.exit },
  },
  page: {
    in: { duration: duration.d3, easing: easing.out },
    out: { duration: 280, easing: easing.exit },
  },
} as const;

type Enter = typeof enter;
type EnterOff = { [K in keyof Enter]: (...args: never[]) => undefined };

export function useMotion() {
  const reduced = useReducedMotion();
  const off = Object.fromEntries(Object.keys(enter).map((k) => [k, () => undefined])) as EnterOff;
  return {
    reduced,
    easing,
    duration,
    ambient,
    stagger,
    delayOf,
    slide,
    press: reduced ? { ...press, scale: 1 } : press,
    enter: (reduced ? off : enter) as Enter,
  };
}

export function usePulse(enabled = true, delay = 0) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);

  useEffect(() => {
    if (!enabled || reduced) {
      p.value = 0;
      return;
    }
    p.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: ambient.pulse, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );
  }, [delay, enabled, reduced, p]);

  return useAnimatedStyle(() => ({
    transform: [{ scale: 0.7 + p.value * 0.8 }],
    opacity: 0.6 * (1 - p.value),
  }));
}

export function useFloat(enabled = true, delay = 0) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);

  useEffect(() => {
    if (!enabled || reduced) {
      p.value = 0;
      return;
    }
    p.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: ambient.float / 2, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: ambient.float / 2, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, [enabled, reduced, delay, p]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: -8 * p.value }, { rotate: `${-0.4 * p.value}deg` }],
  }));
}
