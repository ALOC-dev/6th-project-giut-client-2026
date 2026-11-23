import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { PersonSilhouetteIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { color, radius, role, space } from '@/theme';

import { isTeamClosed, ROLE_LABEL, type Member, type RoleKey, type Team } from './team';

const AVATAR = 52;
const ICON = 44;
const MAX_COLUMNS = 5;
const MIN_COLUMNS = 3;
const COLUMN_SHARE = 22;

function getColumns(total: number) {
  const rows = Math.max(Math.ceil(total / MAX_COLUMNS), 1);
  return Math.max(Math.ceil(total / rows), MIN_COLUMNS);
}

type TeamMemberSectionProps = {
  team: Team;
};

export function TeamMemberSection({ team }: TeamMemberSectionProps) {
  const members = [...team.members].sort((a, b) => Number(b.isLeader) - Number(a.isLeader));

  const closed = isTeamClosed(team);
  // 마감된 팀은 빈자리를 보여주지 않아요
  const openSlots = closed ? 0 : Math.max(team.capacity - team.members.length, 0);
  const vacancies = team.recruitingRoles
    .flatMap(({ role: key, count }) => Array.from({ length: count }, () => key))
    .slice(0, openSlots);

  const columns = getColumns(members.length + vacancies.length);
  const gridWidth = `${Math.min(columns * COLUMN_SHARE, 100)}%` as const;
  const cellWidth = `${100 / columns}%` as const;

  return (
    <View style={S.wrap}>
      <View style={S.header}>
        <Text variant="titleMd">팀원</Text>
        {closed ? (
          <Text variant="body" color="textMuted">
            빈자리가 없어요
          </Text>
        ) : (
          vacancies.length > 0 && (
            <Text variant="body" color="textMuted">
              빈자리 {vacancies.length}
            </Text>
          )
        )}
      </View>

      <View style={[S.grid, { width: gridWidth }]}>
        {members.map((member) => (
          <MemberCell key={member.id} member={member} width={cellWidth} />
        ))}
        {vacancies.map((key, i) => (
          <VacancyCell key={`vacancy-${i}`} roleKey={key} width={cellWidth} />
        ))}
      </View>
    </View>
  );
}

type CellWidth = `${number}%`;

function MemberCell({ member, width }: { member: Member; width: CellWidth }) {
  const tone = role[member.role];

  return (
    <View
      style={[S.cell, { width }]}
      accessible
      accessibilityLabel={`${member.isLeader ? '팀장 ' : ''}${member.name}, ${member.position}`}
    >
      {member.isLeader && (
        <View style={S.leaderBadge}>
          <Text variant="micro" color="surface">
            팀장
          </Text>
        </View>
      )}
      <View style={[S.avatar, { backgroundColor: tone.tint }]}>
        <PersonSilhouetteIcon color={tone.base} style={S.personIcon} />
      </View>
      <Text variant="caption" numberOfLines={1}>
        {member.name}
      </Text>
      <Text variant="badge" style={{ color: tone.text }} numberOfLines={1}>
        {member.position}
      </Text>
    </View>
  );
}

function VacancyCell({ roleKey, width }: { roleKey: RoleKey; width: CellWidth }) {
  const tone = role[roleKey];

  return (
    <View
      style={[S.cell, { width }]}
      accessible
      accessibilityLabel={`${ROLE_LABEL[roleKey]} 빈자리`}
    >
      <View style={[S.avatar, S.vacancy]}>
        <DashedSilhouette color={tone.base} />
      </View>
      <Text variant="caption" color="textMuted" numberOfLines={1}>
        빈자리
      </Text>
      <Text variant="badge" style={{ color: tone.text }} numberOfLines={1}>
        {ROLE_LABEL[roleKey]}
      </Text>
    </View>
  );
}

// PersonSilhouetteIcon과 같은 비율의 점선 사람. 몸통 아래는 원 밖으로 잘려요
function DashedSilhouette({ color: stroke }: { color: string }) {
  const offset = (AVATAR - ICON) / 2;
  const center = AVATAR / 2;
  const headR = ICON * 0.19;
  const bodyR = ICON * 0.36;
  const dash = { fill: 'none', stroke, strokeWidth: 1.5, strokeDasharray: '3 2.5' };

  return (
    <Svg width={AVATAR} height={AVATAR} style={StyleSheet.absoluteFill}>
      <Circle cx={center} cy={offset + ICON * 0.2 + headR} r={headR} {...dash} />
      <Circle cx={center} cy={offset + ICON} r={bodyR} {...dash} />
    </Svg>
  );
}

const S = StyleSheet.create({
  wrap: {
    padding: space[5],
    gap: space[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    rowGap: space[5],
    paddingTop: space[4],
  },
  cell: {
    alignItems: 'center',
    gap: space[0.5],
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    marginBottom: space[1],
    borderRadius: radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personIcon: {
    width: ICON,
    height: ICON,
    overflow: 'visible',
  },
  vacancy: {
    backgroundColor: color.surfaceMuted,
  },
  // 팀 탭(MemberStrip)의 팀장 뱃지와 같은 모양
  leaderBadge: {
    position: 'absolute',
    top: -space[4],
    zIndex: 1,
    paddingVertical: space[1],
    paddingHorizontal: space[1.5],
    borderRadius: radius.sm,
    backgroundColor: color.ink,
  },
});
