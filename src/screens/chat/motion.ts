import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';

/** 캔버스의 CSS 곡선 그대로 */
export const EASE = {
  /** cubic-bezier(.22,1,.36,1) — 시트·대화창·메시지 등장 */
  out: Easing.bezier(0.22, 1, 0.36, 1),
  /** cubic-bezier(.34,1.56,.64,1) — 배지 튀기, 스위치 손잡이, 합류 확정 */
  pop: Easing.bezier(0.34, 1.56, 0.64, 1),
  /** cubic-bezier(.4,0,.2,1) — 나간 방이 접히는 높이 */
  std: Easing.bezier(0.4, 0, 0.2, 1),
  /** CSS ease */
  ease: Easing.bezier(0.25, 0.1, 0.25, 1),
  /** CSS ease-in-out */
  inOut: Easing.bezier(0.42, 0, 0.58, 1),
};

export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => live && setR(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setR);
    return () => {
      live = false;
      sub.remove();
    };
  }, []);
  return r;
}

/** 처음 그려지거나 trigger가 바뀔 때 0→1 */
export function useEnter(ms: number, easing = EASE.out, delay = 0, trigger: unknown = true) {
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
      easing,
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [delay, easing, ms, reduce, trigger, v]);
  return v;
}

/** 무한 반복 0→1 (CSS infinite) */
export function useLoop(ms: number, delay = 0, easing = Easing.linear) {
  const [v] = useState(() => new Animated.Value(0));
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.timing(v, { toValue: 1, duration: ms, easing, useNativeDriver: true }),
    );
    const t = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [delay, easing, ms, reduce, v]);
  return v;
}

/** 값이 바뀔 때마다 부드럽게 따라가는 0/1 (CSS transition) */
export function useTween(target: number, ms: number, easing = EASE.out, native = true) {
  const [v] = useState(() => new Animated.Value(target));
  useEffect(() => {
    Animated.timing(v, { toValue: target, duration: ms, easing, useNativeDriver: native }).start();
  }, [easing, ms, native, target, v]);
  return v;
}

/**
 * 키프레임을 0→1 한 줄로 굽는다 (구간마다 곡선 적용, CSS와 같은 모양).
 * Animated.sequence로 이어 붙이면 구간마다 한 프레임씩 멈칫해서 이렇게 한다.
 */
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
