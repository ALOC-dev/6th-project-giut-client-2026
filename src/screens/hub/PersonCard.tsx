import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Press, Text } from '@/components/ui';
import { color, radius, space } from '@/theme';

import { ROLE_COLOR } from './constants';
import type { Person } from './types';

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
    gap: 5,
    marginTop: space[3],
    paddingBottom: 7,
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
    marginTop: 7,
    lineHeight: 18,
    fontFamily: 'Pretendard-Medium',
  },
  tags: {
    marginTop: space[1],
    fontFamily: 'Pretendard-SemiBold',
  },
});
