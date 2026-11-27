import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import type { ProfileTag } from '@/screens/mypage';
import { color, radius, space } from '@/theme';

import { DetailSection } from './DetailSection';

type PortfolioSkillSectionProps = {
  skills: ProfileTag[];
};

export function PortfolioSkillSection({ skills }: PortfolioSkillSectionProps) {
  if (skills.length === 0) return null;

  return (
    <DetailSection title="사용 기술">
      <View style={S.tags}>
        {skills.map((skill) => (
          <View key={skill.id} style={S.tag}>
            <Text variant="caption" color="textBody">
              {skill.name}
            </Text>
          </View>
        ))}
      </View>
    </DetailSection>
  );
}

const S = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[1.5],
  },
  tag: {
    paddingVertical: space[1.5],
    paddingHorizontal: space[2.5],
    borderRadius: radius.md,
    backgroundColor: color.surfaceMuted,
  },
});
