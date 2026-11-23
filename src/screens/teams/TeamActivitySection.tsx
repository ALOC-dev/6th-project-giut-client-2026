import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { color, radius, space } from '@/theme';

import { OPERATION_LABEL, type Team } from './team';

type TeamActivitySectionProps = {
  team: Team;
};

export function TeamActivitySection({ team }: TeamActivitySectionProps) {
  return (
    <View style={S.wrap}>
      <Text variant="titleMd">활동 방식</Text>

      <View>
        <Row label="진행 방식" first>
          <Tag label={OPERATION_LABEL[team.operationMethod]} tone="brand" />
        </Row>
        <Row label="모임 횟수">
          <Text variant="bodyStrong">{team.activityFrequency}</Text>
        </Row>
        <Row label="협업 도구">
          {team.cooperationTools.map((tool) => (
            <Tag key={tool} label={tool} />
          ))}
        </Row>
        <Row label="모임 장소">
          <Text variant="bodyStrong">{team.activityPlace}</Text>
        </Row>
      </View>
    </View>
  );
}

function Row({
  label,
  first = false,
  children,
}: {
  label: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <View style={[S.row, !first && S.divider]}>
      <Text variant="body" color="textMuted" style={S.label}>
        {label}
      </Text>
      <View style={S.value}>{children}</View>
    </View>
  );
}

function Tag({ label, tone = 'gray' }: { label: string; tone?: 'brand' | 'gray' }) {
  const isBrand = tone === 'brand';

  return (
    <View style={[S.tag, isBrand && S.tagBrand]}>
      <Text variant="caption" color={isBrand ? 'brand' : 'textBody'}>
        {label}
      </Text>
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    padding: space[5],
    gap: space[1],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space[3],
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.line,
  },
  label: {
    width: 76,
  },
  value: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: space[1.5],
  },
  tag: {
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: space[2.5],
    borderRadius: radius.md,
    backgroundColor: color.surfaceMuted,
  },
  tagBrand: {
    backgroundColor: color.brandTint,
  },
});
