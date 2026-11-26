import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import bold from 'expo-symbols/androidWeights/bold';
import semiBold from 'expo-symbols/androidWeights/semiBold';
import { CirclesThreeIcon } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
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
import { scheduleOnRN } from 'react-native-worklets';

import { color, layout, radius, shadow, space, text as typography } from '@/theme';

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
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const handlePress = () => {
    if (!reduceMotion) {
      cancelAnimation(translateY);
      cancelAnimation(scale);
      translateY.set(0);
      scale.set(1);
      translateY.set(
        withSequence(
          withTiming(-3, { duration: 80, easing: Easing.out(Easing.cubic) }),
          withSpring(0, settleSpring),
        ),
      );
      scale.set(
        withSequence(
          withTiming(0.94, { duration: 70, easing: Easing.in(Easing.cubic) }),
          withSpring(1, settleSpring),
        ),
      );
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
        style={{
          fontWeight: selected ? typography.badge.fontWeight : typography.meta.fontWeight,
        }}
      >
        {item.label}
      </Text>
    </Press>
  );
}

export function BottomNavigation({ items, value, onChange, style }: BottomNavigationProps) {
  const supportsLiquidGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();
  const reduceMotion = useReducedMotion();
  const [tabsWidth, setTabsWidth] = useState(0);
  const selectedX = useSharedValue(0);
  const previousValue = useRef<string | null>(null);
  const pendingValue = useRef<string | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRequestedValue = useRef(value);
  const selectedIndex = items.findIndex((item) => item.key === value);
  const cellWidth = items.length > 0 ? Math.max(0, (tabsWidth - space[2] * 2) / items.length) : 0;

  const selectDraggedTab = (index: number) => {
    const item = items[index];

    if (!item || item.key === lastRequestedValue.current) return;

    lastRequestedValue.current = item.key;
    pendingValue.current = item.key;
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    pendingTimer.current = setTimeout(() => {
      if (pendingValue.current === item.key) pendingValue.current = null;
    }, 500);
    onChange(item.key);
  };

  const dragStartTouchX = useSharedValue(0);
  const dragTargetX = useSharedValue(0);
  const isCatchingUp = useSharedValue(false);
  const panGesture = usePanGesture({
    enabled: items.length > 1 && cellWidth > 0,
    activeOffsetX: [-2, 2],
    failOffsetY: [-12, 12],
    onBegin: (event) => {
      'worklet';
      dragStartTouchX.set(event.x);
    },
    onActivate: (event) => {
      'worklet';
      cancelAnimation(selectedX);
      const maxX = Math.max(0, (items.length - 1) * cellWidth);
      const indicatorCenter = space[2] + space[1] + (cellWidth - space[2]) / 2;
      const startX = dragStartTouchX.value - indicatorCenter;
      const clampedStartX = Math.min(maxX, Math.max(0, startX));
      const needsCatchUp =
        !reduceMotion && Math.abs(clampedStartX - selectedX.value) > cellWidth / 2;

      dragTargetX.set(clampedStartX);
      isCatchingUp.set(needsCatchUp);
      selectedX.set(
        needsCatchUp
          ? withSpring(clampedStartX, {
              damping: 24,
              stiffness: 320,
              mass: 0.45,
              overshootClamping: true,
            })
          : clampedStartX,
      );
    },
    onUpdate: (event) => {
      'worklet';
      const maxX = Math.max(0, (items.length - 1) * cellWidth);
      const indicatorCenter = space[2] + space[1] + (cellWidth - space[2]) / 2;
      const nextX = event.x - indicatorCenter;
      const clampedNextX = Math.min(maxX, Math.max(0, nextX));

      dragTargetX.set(clampedNextX);
      if (isCatchingUp.value) {
        if (Math.abs(clampedNextX - selectedX.value) < 2) {
          isCatchingUp.set(false);
          selectedX.set(clampedNextX);
          return;
        }

        selectedX.set(
          withSpring(clampedNextX, {
            damping: 24,
            stiffness: 320,
            mass: 0.45,
            overshootClamping: true,
          }),
        );
        return;
      }

      selectedX.set(clampedNextX);
    },
    onDeactivate: () => {
      'worklet';
      const maxIndex = Math.max(0, items.length - 1);
      const nextIndex = Math.min(maxIndex, Math.max(0, Math.round(dragTargetX.value / cellWidth)));
      const target = nextIndex * cellWidth;

      isCatchingUp.set(false);
      selectedX.set(
        reduceMotion
          ? target
          : withSpring(target, {
              damping: 19,
              stiffness: 220,
              mass: 0.7,
            }),
      );
      scheduleOnRN(selectDraggedTab, nextIndex);
    },
  });

  useEffect(() => {
    if (selectedIndex < 0 || cellWidth <= 0) return;

    if (pendingValue.current) {
      if (pendingValue.current === value) {
        pendingValue.current = null;
        lastRequestedValue.current = value;
        previousValue.current = value;
        if (pendingTimer.current) clearTimeout(pendingTimer.current);
        pendingTimer.current = null;
      }
      return;
    }

    const target = selectedIndex * cellWidth;
    const shouldAnimate =
      previousValue.current !== null && previousValue.current !== value && !reduceMotion;

    selectedX.set(
      shouldAnimate
        ? withSpring(target, {
            damping: 19,
            stiffness: 220,
            mass: 0.7,
          })
        : target,
    );
    lastRequestedValue.current = value;
    previousValue.current = value;
  }, [cellWidth, reduceMotion, selectedIndex, selectedX, value]);

  useEffect(
    () => () => {
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
    },
    [],
  );

  const handleTabPress = (item: BottomNavigationItem, index: number) => {
    if (item.key === lastRequestedValue.current) {
      onChange(item.key);
      return;
    }

    const target = index * cellWidth;
    lastRequestedValue.current = item.key;
    pendingValue.current = item.key;
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    pendingTimer.current = setTimeout(() => {
      if (pendingValue.current === item.key) pendingValue.current = null;
    }, 500);
    selectedX.set(
      reduceMotion
        ? target
        : withSpring(target, {
            damping: 19,
            stiffness: 220,
            mass: 0.7,
          }),
    );
    onChange(item.key);
  };

  const selectedStyle = useAnimatedStyle(() => ({
    width: Math.max(0, cellWidth - space[2]),
    transform: [{ translateX: selectedX.value }],
  }));

  return (
    <View style={[styles.shell, shadow.raised, style]}>
      {supportsLiquidGlass ? (
        <GlassView
          colorScheme="light"
          glassEffectStyle="regular"
          tintColor={color.surfaceGlass}
          style={styles.glass}
        />
      ) : (
        <View style={[styles.glass, styles.fallback]} />
      )}

      <View pointerEvents="none" style={styles.border} />

      <GestureDetector gesture={panGesture}>
        <View
          onLayout={(event) => setTabsWidth(event.nativeEvent.layout.width)}
          style={styles.tabs}
        >
          {cellWidth > 0 && selectedIndex >= 0 ? (
            <Animated.View pointerEvents="none" style={[styles.selectedGlass, selectedStyle]} />
          ) : null}

          {items.map((item, index) => (
            <BottomNavigationTab
              key={item.key}
              item={item}
              selected={item.key === value}
              onPress={() => handleTabPress(item, index)}
            />
          ))}
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginHorizontal: space[3],
    borderRadius: radius['2xl'],
    backgroundColor: color.surface,
  },
  glass: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius['2xl'],
    overflow: 'hidden',
  },
  fallback: {
    backgroundColor: color.surface,
  },
  border: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius['2xl'],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.lineGlass,
  },
  tabs: {
    minHeight: layout.bottomNavigationMinHeight,
    paddingHorizontal: space[2],
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  selectedGlass: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: space[2] + space[1],
    borderRadius: radius.xl,
    backgroundColor: color.surface,
    ...shadow.selection,
  },
});
