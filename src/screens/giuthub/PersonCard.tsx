import { memo, useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Press, Text } from '@/components/ui';
import { color, radius, space, useMotion } from '@/theme';

import { ROLE_COLOR, type Person } from './types';

const ENTER_DURATION = 460;
const ROW_STAGGER_INTERVAL = 110;
const COLUMN_STAGGER_INTERVAL = 28;
const COLUMN_COUNT = 2;
const MAX_STAGGER_ROWS = 4;

type CardEnterProps = {
  index: number;
  generation?: number;
  children: ReactNode;
};

export function CardEnter({ index, generation = 0, children }: CardEnterProps) {
  const { reduced } = useMotion();
  const [progress] = useState(() => new Animated.Value(reduced ? 1 : 0));

  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }

    progress.setValue(0);
    const rowIndex = Math.floor(index / COLUMN_COUNT);
    const columnIndex = index % COLUMN_COUNT;
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: ENTER_DURATION,
      delay:
        Math.min(rowIndex, MAX_STAGGER_ROWS - 1) * ROW_STAGGER_INTERVAL +
        columnIndex * COLUMN_STAGGER_INTERVAL,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [generation, index, progress, reduced]);

  return (
    <Animated.View
      style={[
        styles.enter,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [22, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

type PersonCardProps = {
  person: Person;
  onPress?: (person: Person) => void;
};

function PersonCardBase({ person, onPress }: PersonCardProps) {
  const roleColor = ROLE_COLOR[person.role];

  return (
    <Press
      disabled={!onPress}
      onPress={() => onPress?.(person)}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${person.name}, ${person.dept}, ${person.role}`}
      style={styles.card}
    >
      <View style={[styles.avatar, { backgroundColor: roleColor.tint }]}>
        <Svg width={52} height={52} viewBox="0 0 48 48" fill="none" accessible={false}>
          <Circle cx={24} cy={16} r={9} stroke={roleColor.main} strokeWidth={3} />
          <Path
            d="M8 42c0-8.8 7.2-15 16-15s16 6.2 16 15"
            stroke={roleColor.main}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={styles.nameRow}>
        <Text variant="titleSm" numberOfLines={1} style={styles.name}>
          {person.name}
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={1} style={styles.department}>
          {person.dept}
        </Text>
      </View>

      {person.bio ? (
        <Text variant="caption" color="ink" numberOfLines={2} style={styles.bio}>
          {person.bio}
        </Text>
      ) : null}

      <Text variant="caption" numberOfLines={1} style={[styles.tags, { color: roleColor.text }]}>
        {person.tags.map((tag) => `#${tag}`).join(' ')}
      </Text>
    </Press>
  );
}

export const PersonCard = memo(PersonCardBase);

const styles = StyleSheet.create({
  enter: {
    width: '48%',
    minWidth: 0,
  },
  card: {
    width: '100%',
    minWidth: 0,
  },
  avatar: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[1],
    marginTop: space[3],
    paddingBottom: space[2],
    borderBottomWidth: 1.5,
    borderBottomColor: color.textFaint,
  },
  name: {
    flexShrink: 1,
    minWidth: 0,
  },
  department: {
    flexShrink: 2,
    minWidth: 0,
  },
  bio: {
    minHeight: 36,
    marginTop: space[2],
  },
  tags: {
    marginTop: space[1],
  },
});
