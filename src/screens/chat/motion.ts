import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { easing, useMotion } from '@/theme';

export function useReducedMotion() {
  return useMotion().reduced;
}

export function useEnter(
  ms: number,
  timingEasing = easing.out,
  delay = 0,
  trigger: unknown = true,
) {
  const [v] = useState(() => new Animated.Value(trigger ? 0 : 1));
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!trigger) return;
    if (reduce) {
      v.setValue(1);
      return;
    }
    v.setValue(0);
    const a = Animated.timing(v, {
      toValue: 1,
      duration: ms,
      delay,
      easing: timingEasing,
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [delay, ms, reduce, timingEasing, trigger, v]);
  return v;
}

export function useLoop(ms: number, delay = 0, timingEasing = Easing.linear) {
  const [v] = useState(() => new Animated.Value(0));
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      v.stopAnimation();
      v.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(v, { toValue: 1, duration: ms, easing: timingEasing, useNativeDriver: true }),
    );
    const t = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [delay, ms, reduce, timingEasing, v]);
  return v;
}

export function useTween(target: number, ms: number, timingEasing = easing.out, native = true) {
  const [v] = useState(() => new Animated.Value(target));
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      v.stopAnimation();
      v.setValue(target);
      return;
    }

    const animation = Animated.timing(v, {
      toValue: target,
      duration: ms,
      easing: timingEasing,
      useNativeDriver: native,
    });
    animation.start();
    return () => animation.stop();
  }, [ms, native, reduce, target, timingEasing, v]);
  return v;
}

export function bake(pct: number[], vals: number[], easing: (t: number) => number, steps = 12) {
  const inputRange: number[] = [0];
  const outputRange: number[] = [vals[0]];
  for (let i = 0; i < pct.length - 1; i++) {
    for (let j = 1; j <= steps; j++) {
      const u = j / steps;
      inputRange.push((pct[i] + u * (pct[i + 1] - pct[i])) / 100);
      outputRange.push(vals[i] + (vals[i + 1] - vals[i]) * easing(u));
    }
  }
  return { inputRange, outputRange };
}
