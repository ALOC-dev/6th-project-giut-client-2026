import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Polygon, Rect } from 'react-native-svg';

import { Text } from '@/components/ui';
import { radius } from '@/theme';

import { CREATE_COLOR, MAX_RECRUIT, ROLE_COLOR, type TeamRole } from './constants';
import {
  createSpringCurve,
  linearLoop,
  mapCurve,
  pingPong,
  playOnce,
  TEAM_CREATE_EASING,
} from './TeamCreateParts';

const TRAIN_TOP = 62;
const CAR_WIDTH = 68;
const LOCOMOTIVE_WIDTH = 76;
const CAR_GAP = 6;
const EXIT_EASING = Easing.bezier(0.55, 0, 0.8, 0.4);
const DROP_CURVE = createSpringCurve(0.56, 14.5, 0.6);
const POP_CURVE = createSpringCurve(0.52, 15, 0.6);
const ENTRANCE_DURATION = 600;
export const TRAIN_COLOR = {
  cardGradientStart: '#F4F7FF',
  cardGradientEnd: '#E9EFFF',
  cardBorder: '#E6EAF7',
  backHill: '#D9E3FF',
  frontHill: '#D2EEDF',
  treeTrunk: '#A9B6D8',
  treeCrown: '#A8DDC0',
  sun: '#FFE08A',
  sunHalo: 'rgba(255,224,138,0.25)',
  metal: '#9AA8D6',
  window: '#E3EAFF',
  wheelRim: '#C3CCE8',
  railTie: '#B9C6E8',
} as const;

type PassengerData = { key: string; role: TeamRole };
type TrainCarData = { key: string; x: number; passengers: PassengerData[] };
type PresenceEntry<T> = { item: T; leaving: boolean };

export function TrainIllustration({
  width = 344,
  myRole,
  people,
}: {
  width?: number;
  myRole: TeamRole | null;
  people: PassengerData[];
}) {
  const reduced = useReducedMotion();
  const shown = useMemo(() => people.slice(0, MAX_RECRUIT), [people]);
  const overflow = people.length - shown.length;
  const carCount = Math.max(1, Math.ceil(shown.length / 3));
  const startX = (width - (LOCOMOTIVE_WIDTH + carCount * (CAR_WIDTH + CAR_GAP))) / 2;
  const leadColor = myRole ? ROLE_COLOR[myRole] : CREATE_COLOR.brand;
  const [chug] = useState(() => new Animated.Value(0));
  const cars = useMemo<TrainCarData[]>(
    () =>
      Array.from({ length: carCount }, (_, carIndex) => ({
        key: `car-${carIndex}`,
        x: startX + carIndex * (CAR_WIDTH + CAR_GAP),
        passengers: shown.slice(carIndex * 3, carIndex * 3 + 3),
      })),
    [carCount, shown, startX],
  );
  const { entries: visibleCars, remove: removeCar } = usePresence(cars);

  useEffect(() => {
    if (reduced) return;
    const animation = pingPong(chug, 300);
    animation.start();
    return () => animation.stop();
  }, [chug, reduced]);

  return (
    <View style={styles.root} pointerEvents="none">
      <View style={[styles.sunHalo, { left: width - 68 }]} />
      <View style={[styles.sun, { left: width - 60 }]} />

      <MovingScenery width={width} top={6} height={30} tile={160} duration={14000} kind="clouds" />
      <MovingScenery
        width={width}
        top={TRAIN_TOP - 14}
        height={62}
        tile={160}
        duration={9000}
        kind="backHills"
      />
      <MovingScenery
        width={width}
        top={TRAIN_TOP + 6}
        height={42}
        tile={120}
        duration={4500}
        kind="frontHills"
      />
      <MovingScenery
        width={width}
        top={TRAIN_TOP + 12}
        height={36}
        tile={60}
        duration={1500}
        kind="trees"
      />

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              { translateY: chug.interpolate({ inputRange: [0, 1], outputRange: [0, -1.5] }) },
            ],
          },
        ]}
      >
        {visibleCars.map(({ item, leaving }) => (
          <TrainCar
            key={item.key}
            itemKey={item.key}
            x={item.x}
            passengers={item.passengers}
            leaving={leaving}
            onGone={removeCar}
          />
        ))}
        <Locomotive x={startX + carCount * (CAR_WIDTH + CAR_GAP)} fill={leadColor} />
        {overflow > 0 ? (
          <View style={[styles.more, { left: startX, top: TRAIN_TOP - 18 }]}>
            <Text variant="badge" color="brand">
              +{overflow}
            </Text>
          </View>
        ) : null}
      </Animated.View>

      <RailTies />
      <View style={styles.rail} />
    </View>
  );
}

function usePresence<T extends { key: string }>(items: T[]) {
  const [previousItems, setPreviousItems] = useState(items);
  const [entries, setEntries] = useState<PresenceEntry<T>[]>(() =>
    items.map((item) => ({ item, leaving: false })),
  );

  if (items !== previousItems) {
    setPreviousItems(items);
    setEntries((current) => {
      const incoming = new Map(items.map((item) => [item.key, item] as const));
      const next = current.map((entry) => {
        const updated = incoming.get(entry.item.key);
        if (!updated) return entry.leaving ? entry : { ...entry, leaving: true };
        incoming.delete(entry.item.key);
        return { item: updated, leaving: false };
      });

      incoming.forEach((item) => next.push({ item, leaving: false }));
      return next;
    });
  }

  const remove = useCallback((key: string) => {
    setEntries((current) => current.filter((entry) => entry.item.key !== key || !entry.leaving));
  }, []);

  return { entries, remove };
}

function useSlideX(x: number, frozen = false) {
  const reduced = useReducedMotion();
  const [value] = useState(() => new Animated.Value(x));

  useEffect(() => {
    if (frozen) return;
    const animation = Animated.timing(value, {
      toValue: x,
      duration: reduced ? 0 : 450,
      easing: TEAM_CREATE_EASING.spring,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [frozen, reduced, value, x]);

  return value;
}

function useEntrance(duration: number) {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(reduced ? 1 : 0));

  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    const animation = playOnce(progress, duration);
    animation.start();
    return () => animation.stop();
  }, [duration, progress, reduced]);

  return progress;
}

function useLeave(leaving: boolean, duration: number, onGone: () => void) {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: leaving ? 1 : 0,
      duration: reduced ? 0 : leaving ? duration : 200,
      easing: leaving ? EXIT_EASING : TEAM_CREATE_EASING.spring,
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished && leaving) onGone();
    });
    return () => animation.stop();
  }, [duration, leaving, onGone, progress, reduced]);

  return progress;
}

function Wheel({ left }: { left: number }) {
  return <View style={[styles.wheel, { left }]} />;
}

function TrainCar({
  itemKey,
  x,
  passengers,
  leaving,
  onGone,
}: {
  itemKey: string;
  x: number;
  passengers: PassengerData[];
  leaving: boolean;
  onGone: (key: string) => void;
}) {
  const translateX = useSlideX(x, leaving);
  const entrance = useEntrance(ENTRANCE_DURATION);
  const handleGone = useCallback(() => onGone(itemKey), [itemKey, onGone]);
  const exit = useLeave(leaving, 300, handleGone);

  return (
    <Animated.View style={[styles.carWrap, { transform: [{ translateX }] }]}>
      <Animated.View
        style={[
          styles.carLink,
          {
            opacity: exit.interpolate({
              inputRange: [0, 0.4],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.carMotion,
          {
            opacity: Animated.multiply(
              entrance.interpolate({
                inputRange: [0, 0.25],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
              exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
            ),
            transform: [
              {
                translateY: Animated.add(
                  entrance.interpolate(mapCurve(POP_CURVE, 14, 0)),
                  exit.interpolate({ inputRange: [0, 1], outputRange: [0, 14] }),
                ),
              },
              {
                scale: Animated.multiply(
                  entrance.interpolate(mapCurve(POP_CURVE, 0.2, 1)),
                  exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }),
                ),
              },
            ],
          },
        ]}
      >
        <View style={styles.carBody} />
        {[0, 1, 2].map((index) => (
          <View key={index} style={[styles.window, { left: 6 + index * 20 }]}>
            <Seat passenger={passengers[index]} />
          </View>
        ))}
        <View style={styles.carStripe} />
        <Wheel left={10} />
        <Wheel left={CAR_WIDTH - 24} />
      </Animated.View>
    </Animated.View>
  );
}

function Seat({ passenger }: { passenger?: PassengerData }) {
  const passengers = useMemo(() => (passenger ? [passenger] : []), [passenger]);
  const { entries, remove } = usePresence(passengers);

  return (
    <>
      {entries.map(({ item, leaving }) => (
        <Passenger
          key={item.key}
          itemKey={item.key}
          fill={ROLE_COLOR[item.role]}
          leaving={leaving}
          onGone={remove}
        />
      ))}
    </>
  );
}

function Passenger({
  itemKey,
  fill,
  leaving,
  onGone,
}: {
  itemKey: string;
  fill: string;
  leaving: boolean;
  onGone: (key: string) => void;
}) {
  const entrance = useEntrance(ENTRANCE_DURATION);
  const handleGone = useCallback(() => onGone(itemKey), [itemKey, onGone]);
  const exit = useLeave(leaving, 260, handleGone);

  return (
    <Animated.View
      style={[
        styles.passenger,
        {
          backgroundColor: fill,
          opacity: Animated.multiply(
            entrance.interpolate({
              inputRange: [0, 0.3],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          ),
          transform: [
            {
              translateY: Animated.add(
                entrance.interpolate(mapCurve(DROP_CURVE, -34, 0)),
                exit.interpolate({ inputRange: [0, 1], outputRange: [0, -22] }),
              ),
            },
          ],
        },
      ]}
    />
  );
}

function Locomotive({ x, fill }: { x: number; fill: string }) {
  const reduced = useReducedMotion();
  const translateX = useSlideX(x);
  const [smoke] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduced) return;
    const animation = pingPong(smoke, 1200);
    animation.start();
    return () => animation.stop();
  }, [reduced, smoke]);

  return (
    <Animated.View style={[styles.locomotive, { transform: [{ translateX }] }]}>
      <View style={styles.chimney} />
      <Animated.View
        style={[
          styles.smoke,
          {
            transform: [
              { translateX: smoke.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) },
            ],
          },
        ]}
      />
      <View style={[styles.locomotiveBody, { backgroundColor: fill }]} />
      <View style={styles.cab}>
        <View style={[styles.driverHead, { backgroundColor: fill }]} />
        <View style={[styles.driverBody, { backgroundColor: fill }]} />
      </View>
      <View style={styles.plate}>
        <Text variant="micro" style={{ color: fill }}>
          나
        </Text>
      </View>
      <Svg width={12} height={10} style={styles.cowcatcher}>
        <Polygon points="0,0 12,10 0,10" fill={CREATE_COLOR.body} />
      </Svg>
      <Wheel left={8} />
      <Wheel left={42} />
    </Animated.View>
  );
}

function MovingScenery({
  width,
  top,
  height,
  tile,
  duration,
  kind,
}: {
  width: number;
  top: number;
  height: number;
  tile: number;
  duration: number;
  kind: 'clouds' | 'backHills' | 'frontHills' | 'trees';
}) {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduced) return;
    const animation = linearLoop(progress, duration);
    animation.start();
    return () => animation.stop();
  }, [duration, progress, reduced]);

  const sceneryWidth = width + tile;
  const count = Math.ceil(sceneryWidth / tile) + 2;
  const offsets = Array.from({ length: count }, (_, index) => (index - 1) * tile);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: sceneryWidth,
        height,
        transform: [
          { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -tile] }) },
        ],
      }}
    >
      <Svg width={sceneryWidth} height={height}>
        {offsets.map((offset) => {
          if (kind === 'clouds') {
            return (
              <Fragment key={offset}>
                <Ellipse cx={offset + 40} cy={12} rx={18} ry={7} fill={CREATE_COLOR.surface} />
                <Ellipse cx={offset + 120} cy={22} rx={12} ry={5} fill={CREATE_COLOR.surface} />
              </Fragment>
            );
          }
          if (kind === 'backHills') {
            return (
              <Ellipse
                key={offset}
                cx={offset + 80}
                cy={height}
                rx={90}
                ry={40}
                fill={TRAIN_COLOR.backHill}
              />
            );
          }
          if (kind === 'frontHills') {
            return (
              <Ellipse
                key={offset}
                cx={offset + 30}
                cy={height}
                rx={54}
                ry={26}
                fill={TRAIN_COLOR.frontHill}
              />
            );
          }
          return (
            <Fragment key={offset}>
              <Rect x={offset + 29} y={16} width={2} height={20} fill={TRAIN_COLOR.treeTrunk} />
              <Circle cx={offset + 30} cy={9} r={9} fill={TRAIN_COLOR.treeCrown} />
            </Fragment>
          );
        })}
      </Svg>
    </Animated.View>
  );
}

function RailTies() {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduced) return;
    const animation = linearLoop(progress, 500);
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);

  return (
    <Animated.View
      style={[
        styles.ties,
        {
          transform: [
            { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -16] }) },
          ],
        },
      ]}
    >
      {Array.from({ length: 40 }, (_, index) => (
        <View key={index} style={styles.tie} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', inset: 0, overflow: 'hidden' },
  sun: {
    position: 'absolute',
    top: -4,
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: TRAIN_COLOR.sun,
  },
  sunHalo: {
    position: 'absolute',
    top: -12,
    width: 46,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: TRAIN_COLOR.sunHalo,
  },
  carWrap: { position: 'absolute', left: 0, top: TRAIN_TOP, width: CAR_WIDTH, height: 40 },
  carMotion: { flex: 1, transformOrigin: 'center bottom' },
  carLink: {
    position: 'absolute',
    left: CAR_WIDTH,
    top: 26,
    width: CAR_GAP,
    height: 3,
    backgroundColor: TRAIN_COLOR.metal,
  },
  carBody: {
    position: 'absolute',
    inset: 0,
    borderRadius: radius.md,
    backgroundColor: CREATE_COLOR.surface,
    shadowColor: CREATE_COLOR.brand,
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  window: {
    position: 'absolute',
    top: 7,
    width: 16,
    height: 18,
    borderRadius: radius.xs,
    backgroundColor: TRAIN_COLOR.window,
    overflow: 'hidden',
  },
  passenger: {
    position: 'absolute',
    left: 2,
    top: 4,
    width: 12,
    height: 12,
    borderRadius: radius.full,
  },
  carStripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 6,
    height: 3,
    backgroundColor: CREATE_COLOR.brand,
    opacity: 0.7,
  },
  wheel: {
    position: 'absolute',
    bottom: -8,
    width: 14,
    height: 14,
    borderRadius: radius.full,
    backgroundColor: CREATE_COLOR.body,
    borderWidth: 3,
    borderColor: TRAIN_COLOR.wheelRim,
  },
  locomotive: {
    position: 'absolute',
    left: 0,
    top: TRAIN_TOP - 16,
    width: LOCOMOTIVE_WIDTH,
    height: 56,
  },
  chimney: {
    position: 'absolute',
    left: 14,
    top: 0,
    width: 10,
    height: 14,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: CREATE_COLOR.body,
  },
  smoke: {
    position: 'absolute',
    left: 8,
    top: -14,
    width: 18,
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: CREATE_COLOR.surface,
    opacity: 0.9,
  },
  locomotiveBody: {
    position: 'absolute',
    left: 0,
    top: 12,
    width: LOCOMOTIVE_WIDTH - 8,
    height: 44,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: 22,
    borderBottomRightRadius: radius.md,
    borderBottomLeftRadius: radius.md,
  },
  cab: {
    position: 'absolute',
    left: 36,
    top: 17,
    width: 26,
    height: 24,
    borderRadius: radius.sm,
    backgroundColor: TRAIN_COLOR.window,
    overflow: 'hidden',
  },
  driverHead: {
    position: 'absolute',
    left: 7,
    top: 4,
    width: 12,
    height: 12,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: CREATE_COLOR.surface,
  },
  driverBody: {
    position: 'absolute',
    left: 4,
    top: 16,
    width: 18,
    height: 12,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    opacity: 0.85,
  },
  plate: {
    position: 'absolute',
    left: 8,
    top: 22,
    width: 18,
    height: 14,
    borderRadius: radius.xs,
    backgroundColor: CREATE_COLOR.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cowcatcher: { position: 'absolute', right: 0, top: 44 },
  rail: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: TRAIN_TOP + 48,
    height: 2,
    backgroundColor: TRAIN_COLOR.metal,
  },
  ties: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: TRAIN_TOP + 48,
    height: 8,
    flexDirection: 'row',
  },
  tie: { width: 4, height: 8, marginRight: 12, backgroundColor: TRAIN_COLOR.railTie },
  more: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.sm,
    backgroundColor: CREATE_COLOR.surface,
  },
});
