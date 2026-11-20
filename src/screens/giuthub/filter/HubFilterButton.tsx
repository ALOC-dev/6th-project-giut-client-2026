import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AnimatedFilterIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { color, radius, shadow, space } from '@/theme';

const ICON_SIZE = 18;

type HubFilterButtonProps = {
  count: number;
  onPress: () => void;
};

export function HubFilterButton({ count, onPress }: HubFilterButtonProps) {
  const [animationKey, setAnimationKey] = useState(0);
  const active = count > 0;
  const iconColor = active ? color.brand : color.ink;
  const supportsLiquidGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();

  return (
    <Pressable
      onPress={() => {
        setAnimationKey((current) => current + 1);
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
          tintColor={color.surfaceGlassTint}
          pointerEvents="none"
          style={styles.glass}
        />
      ) : (
        <View pointerEvents="none" style={[styles.glass, styles.fallback]} />
      )}
      <View pointerEvents="none" style={styles.highlight} />

      <View style={styles.icon}>
        <AnimatedFilterIcon size={ICON_SIZE} color={iconColor} animationKey={animationKey} />
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
    gap: space[1],
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
    backgroundColor: color.surfaceGlassFallback,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: color.surfaceGlassBorder,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
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
