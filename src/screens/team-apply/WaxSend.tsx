import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  type EasingFunction,
  type StyleProp,
  type ViewInstance,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Text } from '@/components/ui';
import { color, radius, space, useMotion } from '@/theme';

const EASE = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.42, 0, 0.58, 1),
  easeOut: Easing.bezier(0, 0, 0.58, 1),
};

function bake(percentages: number[], values: number[], easing: EasingFunction, steps = 12) {
  const inputRange: number[] = [0];
  const outputRange: number[] = [values[0]];
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

function useEnter(duration: number, delay = 0, easing: EasingFunction = Easing.linear) {
  const { reduced } = useMotion();
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, duration, easing, progress, reduced]);
  return progress;
}

function useLoop(duration: number, delay = 0, enabled = true) {
  const { reduced } = useMotion();
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced || !enabled) {
      progress.setValue(0);
      return;
    }
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    ]);
    animation.start();
    return () => animation.stop();
  }, [delay, duration, enabled, progress, reduced]);
  return progress;
}

type Box = { x: number; y: number; w: number; h: number };

const ENVELOPE = { width: 132, height: 92, lift: 40 };
const EASE_CSS = Easing.bezier(0.25, 0.1, 0.25, 1);
const SEND_END_MS = 4450;

export function WaxSendOverlay({
  width,
  height,
  from,
  onCardHide,
  onDone,
}: {
  width: number;
  height: number;
  from: Box | null;
  onCardHide: () => void;
  onDone: () => void;
}) {
  const completed = useRef(false);
  const finish = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    onDone();
  }, [onDone]);

  const buttonCenterY = height - 62;
  const startWidth = width - space[5] * 2;
  const envelopeLeft = width / 2 - ENVELOPE.width / 2;
  const envelopeTop = buttonCenterY - ENVELOPE.lift - ENVELOPE.height / 2;

  const [shape] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.timing(shape, {
      toValue: 1,
      duration: 650,
      easing: Easing.bezier(0.6, 0, 0.3, 1),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [shape]);

  const label = useEnter(200, 0, EASE_CSS);
  const inside = useEnter(250, 500, EASE_CSS);
  const flapShow = useEnter(10, 500);
  const flapClose = useEnter(500, 1750, Easing.bezier(0.45, 0, 0.3, 1));
  const [flapFront, setFlapFront] = useState(false);
  const wax = useEnter(800, 2200);
  const emboss = useEnter(300, 2850);
  const [fly] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.timing(fly, {
      toValue: 1,
      duration: 1000,
      delay: 3300,
      easing: Easing.bezier(0.5, 0, 0.6, 1),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [fly]);
  const hint = useEnter(300, 500, EASE.easeOut);
  const [paper] = useState(() => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    width: new Animated.Value(0),
    height: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }));

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (delay: number, action: () => void) => timers.push(setTimeout(action, delay));
    const timing = (
      value: Animated.Value,
      toValue: number,
      duration: number,
      easing: EasingFunction,
    ) => Animated.timing(value, { toValue, duration, easing, useNativeDriver: false });

    if (from) {
      const foldedHeight = from.h * 0.34;
      const targetWidth = 112;
      const targetHeight = Math.max(26, Math.min(40, foldedHeight * (targetWidth / from.w)));
      schedule(700, () => {
        onCardHide();
        paper.x.setValue(from.x - envelopeLeft);
        paper.y.setValue(from.y - envelopeTop);
        paper.width.setValue(from.w);
        paper.height.setValue(foldedHeight);
        paper.opacity.setValue(1);
        const easing = Easing.bezier(0.45, 0, 0.3, 1);
        Animated.parallel([
          timing(paper.x, (ENVELOPE.width - targetWidth) / 2, 650, easing),
          timing(paper.y, -targetHeight - 6, 650, easing),
          timing(paper.width, targetWidth, 650, easing),
          timing(paper.height, targetHeight, 650, easing),
        ]).start();
      });
      schedule(1400, () => timing(paper.y, 24, 400, Easing.bezier(0.5, 0, 0.75, 0)).start());
      schedule(2050, () => timing(paper.opacity, 0, 200, Easing.linear).start());
    }
    schedule(1750, () => setFlapFront(true));
    schedule(SEND_END_MS, finish);
    return () => timers.forEach(clearTimeout);
  }, [envelopeLeft, envelopeTop, finish, from, onCardHide, paper]);

  const flap = (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.flap,
        {
          zIndex: flapFront ? 6 : 1,
          opacity: flapShow,
          transform: [
            { perspective: 500 },
            {
              rotateX: flapClose.interpolate({
                inputRange: [0, 1],
                outputRange: ['180deg', '0deg'],
              }),
            },
          ],
        },
      ]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 64 30" preserveAspectRatio="none">
        <Path
          d="M1 6 Q1 1 6 1 L58 1 Q63 1 63 6 L63 15 L32 30 L1 15 Z"
          fill="#F6F8FF"
          stroke="#C9D4F2"
          strokeWidth={0.9}
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );

  const waxPercentages = [0, 35, 55, 70, 82, 100];
  const waxEasing = Easing.bezier(0.3, 0.7, 0.4, 1);
  const flyX = (250 * width) / 390;
  const flyY = -(buttonCenterY - ENVELOPE.lift - 82);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: shape.interpolate({
            inputRange: [0, 1],
            outputRange: [width / 2 - startWidth / 2, envelopeLeft],
          }),
          top: shape.interpolate({
            inputRange: [0, 1],
            outputRange: [buttonCenterY - 28, buttonCenterY - ENVELOPE.height / 2],
          }),
          width: shape.interpolate({
            inputRange: [0, 1],
            outputRange: [startWidth, ENVELOPE.width],
          }),
          height: shape.interpolate({
            inputRange: [0, 1],
            outputRange: [56, ENVELOPE.height],
          }),
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            shadowColor: color.brand,
            shadowOpacity: 0.22,
            shadowRadius: 9,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
            borderRadius: shape.interpolate({
              inputRange: [0, 1],
              outputRange: [radius.xl, radius.lg],
            }),
            backgroundColor: shape.interpolate({
              inputRange: [0, 1],
              outputRange: [color.brand, '#E6ECFA'],
            }),
            opacity: fly.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
            transform: [
              { translateX: fly.interpolate({ inputRange: [0, 1], outputRange: [0, flyX] }) },
              {
                translateY: Animated.add(
                  shape.interpolate({ inputRange: [0, 1], outputRange: [0, -ENVELOPE.lift] }),
                  fly.interpolate({ inputRange: [0, 1], outputRange: [0, flyY] }),
                ),
              },
              { rotate: fly.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '22deg'] }) },
              { scale: fly.interpolate({ inputRange: [0, 1], outputRange: [1, 0.35] }) },
            ],
          }}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.center,
              { opacity: label.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) },
            ]}
          >
            <Text variant="button" color="surface" numberOfLines={1}>
              지원서 보내기
            </Text>
          </Animated.View>

          {!flapFront ? flap : null}

          <Animated.View
            style={[
              styles.paper,
              {
                left: paper.x,
                top: paper.y,
                width: paper.width,
                height: paper.height,
                opacity: paper.opacity,
              },
            ]}
          >
            <View style={styles.paperFold} />
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { zIndex: 3, opacity: inside }]}
          >
            <Svg width="100%" height="100%" viewBox="0 0 64 46" preserveAspectRatio="none">
              <Path
                d="M1 14 L26 26 L38 26 L63 14 L63 40 Q63 45 58 45 L6 45 Q1 45 1 40 Z"
                fill={color.surface}
              />
              <Path
                d="M1.5 14.3 L26 26 L38 26 L62.5 14.3"
                stroke="#C9D4F2"
                strokeWidth={0.9}
                strokeLinejoin="round"
                fill="none"
              />
              <Rect
                x={1}
                y={1}
                width={62}
                height={44}
                rx={5}
                fill="none"
                stroke="#C9D4F2"
                strokeWidth={0.9}
              />
              <Path
                d="M2 44 L26 24 M62 44 L38 24"
                stroke="#DCE4FA"
                strokeWidth={1}
                strokeLinecap="round"
              />
            </Svg>
          </Animated.View>

          {flapFront ? flap : null}

          <Animated.View
            pointerEvents="none"
            style={[
              styles.wax,
              {
                opacity: wax.interpolate(bake(waxPercentages, [0, 1, 1, 1, 1, 1], waxEasing)),
                transform: [
                  {
                    scaleX: wax.interpolate(
                      bake(waxPercentages, [0, 1.25, 0.9, 1, 0.88, 1], waxEasing),
                    ),
                  },
                  {
                    scaleY: wax.interpolate(
                      bake(waxPercentages, [0, 0.8, 1.1, 1, 0.88, 1], waxEasing),
                    ),
                  },
                ],
              },
            ]}
          >
            <WaxLayer emboss={emboss} />
          </Animated.View>
        </Animated.View>
      </Animated.View>

      <Pressable
        onPress={finish}
        accessibilityRole="button"
        accessibilityLabel="전송 애니메이션 건너뛰기"
        style={StyleSheet.absoluteFill}
      >
        <Animated.View style={[styles.skip, { opacity: hint }]}>
          <Text variant="meta" color="textSecondary">
            탭해서 건너뛰기
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

export function FoldingCard({
  folding,
  hidden = false,
  cardRef,
  children,
  style,
  containerStyle,
}: {
  folding: boolean;
  hidden?: boolean;
  cardRef?: React.Ref<ViewInstance>;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  const { reduced } = useMotion();
  const [crease] = useState(() => new Animated.Value(0));
  const [fold] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (folding) {
      Animated.timing(crease, {
        toValue: 1,
        duration: reduced ? 0 : 220,
        useNativeDriver: true,
      }).start();
      Animated.timing(fold, {
        toValue: 1,
        duration: reduced ? 0 : 600,
        easing: Easing.bezier(0.6, 0, 0.4, 1),
        useNativeDriver: true,
      }).start();
      return;
    }
    crease.setValue(0);
    fold.setValue(0);
  }, [crease, fold, folding, reduced]);

  return (
    <Animated.View
      style={[
        {
          opacity: hidden ? 0 : 1,
          transformOrigin: 'top',
          transform: [{ scaleY: fold.interpolate({ inputRange: [0, 1], outputRange: [1, 0.34] }) }],
        },
        containerStyle,
      ]}
    >
      <View
        ref={cardRef}
        collapsable={false}
        style={[styles.foldingCard, { opacity: hidden ? 0 : 1 }, style]}
      >
        {children}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: '#F7F9FF', opacity: crease }]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.foldLine, { top: '33.3%', opacity: crease }]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.foldLine, { top: '66.6%', opacity: crease }]}
        />
      </View>
    </Animated.View>
  );
}

export function PreviewFloatingCard({
  paused = false,
  children,
}: {
  paused?: boolean;
  children: React.ReactNode;
}) {
  const progress = useLoop(3200, 0, !paused);
  const translateY = bake([0, 50, 100], [0, -8, 0], EASE.inOut);
  const rotation = bake([0, 50, 100], [0, -0.4, 0], EASE.inOut);

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: progress.interpolate(translateY) },
          {
            rotate: progress.interpolate({
              inputRange: rotation.inputRange,
              outputRange: rotation.outputRange.map((value) => `${value}deg`),
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

export function WaxEnvelopeHero() {
  const enter = useEnter(1100, 0, EASE.out);
  const float = useLoop(3400, 1100);
  const bob = useLoop(3400);
  const rotation = bake([0, 50, 100], [-4, 3, -4], EASE.inOut);

  return (
    <View
      style={styles.heroBox}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        style={[
          styles.heroShadow,
          {
            opacity: bob.interpolate(bake([0, 50, 100], [0.22, 0.1, 0.22], EASE.inOut)),
            transform: [
              {
                scale: bob.interpolate(bake([0, 50, 100], [1, 0.72, 1], EASE.inOut)),
              },
            ],
          },
        ]}
      >
        <Svg width={130} height={40}>
          <Defs>
            <RadialGradient id="applyEnvelopeShadow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#8FA6E6" stopOpacity={1} />
              <Stop offset="0.45" stopColor="#8FA6E6" stopOpacity={0.8} />
              <Stop offset="1" stopColor="#8FA6E6" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={65} cy={20} rx={65} ry={20} fill="url(#applyEnvelopeShadow)" />
        </Svg>
      </Animated.View>
      <Animated.View
        style={{
          opacity: enter,
          transform: [
            { translateX: enter.interpolate({ inputRange: [0, 1], outputRange: [-70, 0] }) },
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [70, 0] }) },
            { scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
            { rotate: enter.interpolate({ inputRange: [0, 1], outputRange: ['-25deg', '0deg'] }) },
          ],
        }}
      >
        <Animated.View
          style={{
            transform: [
              {
                translateY: float.interpolate(bake([0, 50, 100], [0, -16, 0], EASE.inOut)),
              },
              {
                rotate: float.interpolate({
                  inputRange: rotation.inputRange,
                  outputRange: rotation.outputRange.map((value) => `${value}deg`),
                }),
              },
            ],
          }}
        >
          <View style={styles.heroEnvelope}>
            <ClosedEnvelope />
            <View style={styles.heroWax}>
              <WaxSeal size={50} />
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function WaxLayer({ emboss }: { emboss: Animated.Value }) {
  return (
    <View style={styles.waxShadow}>
      <WaxSeal size={44} embossOpacity={0} />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: emboss }]}>
        <WaxSeal size={44} />
      </Animated.View>
    </View>
  );
}

function WaxSeal({ size = 44, embossOpacity = 1 }: { size?: number; embossOpacity?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path
        d="M20 2 C27 2 30 6 34 8 C38 12 38 16 37 20 C38 25 36 30 32 33 C29 37 24 38 20 38 C15 38 11 37 8 33 C4 30 2 25 3 20 C2 15 4 10 8 7 C11 4 15 2 20 2 Z"
        fill="#D64545"
      />
      <Circle cx={20} cy={20} r={13} fill="#DE5555" stroke="#B93636" strokeWidth={1.6} />
      <G opacity={embossOpacity}>
        <Circle cx={15.5} cy={15} r={2.3} fill="#B93636" />
        <Circle cx={24.5} cy={15} r={2.3} fill="#B93636" />
        <Path
          d="M12 27 C12 21 15 19 17.5 21.5 L20 24 L22.5 21.5 C25 19 28 21 28 27"
          stroke="#B93636"
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

function ClosedEnvelope({ width = 150, height = 108 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 46" fill="none">
      <Path d="M6 1 H58 Q63 1 63 6 V40 Q63 45 58 45 H6 Q1 45 1 40 V6 Q1 1 6 1 Z" fill="#E6ECFA" />
      <Path
        d="M1 14 L26 26 L38 26 L63 14 L63 40 Q63 45 58 45 L6 45 Q1 45 1 40 Z"
        fill={color.surface}
      />
      <Path d="M1.5 14.3 L26 26 L38 26 L62.5 14.3" stroke="#C9D4F2" strokeWidth={0.8} />
      <Path d="M2 44 L26 24 M62 44 L38 24" stroke="#DCE4FA" strokeWidth={1} strokeLinecap="round" />
      <Path
        d="M6 1 H58 Q63 1 63 6 V40 Q63 45 58 45 H6 Q1 45 1 40 V6 Q1 1 6 1 Z"
        stroke="#C9D4F2"
        strokeWidth={0.8}
      />
      <Path
        d="M1 6 Q1 1 6 1 L58 1 Q63 1 63 6 L63 15 L32 30 L1 15 Z"
        transform="translate(0 1)"
        fill="rgba(30,60,160,0.10)"
      />
      <Path
        d="M1 6 Q1 1 6 1 L58 1 Q63 1 63 6 L63 15 L32 30 L1 15 Z"
        fill="#F6F8FF"
        stroke="#C9D4F2"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      <Circle cx={32} cy={25} r={6.5} fill={color.brand} />
      <Path
        d="M29.2 25.2l1.9 1.9 3.8-4"
        stroke={color.surface}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  flap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '65.2%',
    transformOrigin: ['50%', '3.33%', 0],
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  paper: {
    position: 'absolute',
    zIndex: 2,
    borderWidth: 1,
    borderColor: '#C9D4F2',
    borderRadius: radius.md,
    backgroundColor: '#F7F9FF',
    shadowColor: color.brand,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
  paperFold: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: '#DCE4FA',
  },
  wax: {
    position: 'absolute',
    zIndex: 8,
    left: '50%',
    top: '54.3%',
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
  },
  waxShadow: {
    shadowColor: '#961E1E',
    shadowOpacity: 0.35,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  skip: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingVertical: space[1.5],
    paddingHorizontal: space[3],
    borderRadius: radius.full,
    backgroundColor: color.surfaceHeader,
  },
  foldingCard: { overflow: 'hidden' },
  foldLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#C9D4F2',
  },
  heroBox: { width: 200, height: 180, alignItems: 'center', justifyContent: 'center' },
  heroShadow: { position: 'absolute', left: 35, bottom: -9, width: 130, height: 40 },
  heroEnvelope: { width: 150, height: 108 },
  heroWax: { position: 'absolute', left: 50, top: 33 },
});
