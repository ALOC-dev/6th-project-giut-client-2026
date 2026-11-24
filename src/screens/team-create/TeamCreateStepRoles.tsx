import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { ChevronIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { radius, shadow, space } from '@/theme';

import {
  CREATE_COLOR,
  ROLE_COLOR,
  ROLE_DESCRIPTION,
  ROLE_OPTIONS,
  ROLE_TINT,
  TEAM_ROLES,
  type TeamRole,
} from './constants';
import {
  FadeUp,
  FigureBox,
  PersonFigure,
  SectionDivider,
  StepBody,
  TEAM_CREATE_EASING,
} from './TeamCreateParts';
import type { TeamDraftApi } from './useTeamDraft';

export function TeamCreateStepRoles({ api }: { api: TeamDraftApi }) {
  const { myRole, myPosition, recruitRoles } = api.draft;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  const roleLabel = myPosition ?? (myRole ? `${myRole} · ?` : '?');
  const crewText = recruitRoles.length
    ? `나 + ${recruitRoles.join(' · ')}`
    : '함께할 직군을 골라주세요';

  return (
    <StepBody>
      <View style={styles.content}>
        <SectionDivider style={styles.firstDivider} />

        <View>
          <View style={styles.sentence}>
            <Text variant="titleMd">나는 </Text>
            <Text
              variant="titleMd"
              style={{ color: myRole ? ROLE_COLOR[myRole] : CREATE_COLOR.disabled }}
            >
              {roleLabel}
            </Text>
            <Text variant="titleMd"> 담당이에요</Text>
          </View>

          <View
            style={styles.roleGrid}
            accessibilityRole="radiogroup"
            onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
          >
            {TEAM_ROLES.map((role) => (
              <RoleTile
                key={role}
                role={role}
                selected={myRole === role}
                onPress={() => {
                  if (myRole !== role) setDropdownOpen(false);
                  api.pickMyRole(role);
                }}
              />
            ))}
          </View>

          {myRole ? (
            <FadeUp duration={350}>
              <View style={styles.positionPanelWrap}>
                <PanelNotch index={TEAM_ROLES.indexOf(myRole)} gridWidth={gridWidth} />
                <View style={styles.positionPanel}>
                  <Text variant="caption" color="textBody" style={styles.positionTitle}>
                    {myRole}에서 어떤 걸 맡나요?
                  </Text>
                  <View style={styles.dropdownPadding}>
                    <PositionDropdown
                      role={myRole}
                      value={myPosition}
                      open={dropdownOpen}
                      onToggle={() => setDropdownOpen((current) => !current)}
                      onPick={(position) => {
                        api.set({ myPosition: position });
                        setDropdownOpen(false);
                      }}
                    />
                  </View>
                </View>
              </View>
            </FadeUp>
          ) : null}
        </View>

        <SectionDivider />

        <View>
          <Text variant="titleMd">누구와 함께할까요?</Text>
          <View style={styles.crewSummary}>
            <View style={styles.crewFigures}>
              <View
                style={[
                  styles.crewDot,
                  { backgroundColor: myRole ? ROLE_COLOR[myRole] : CREATE_COLOR.disabled },
                ]}
              >
                <Text variant="micro" color="surface">
                  나
                </Text>
              </View>
              {recruitRoles.map((role) => (
                <FigureBox
                  key={role}
                  style={[styles.crewDot, { backgroundColor: ROLE_TINT[role] }]}
                >
                  <PersonFigure
                    head={9}
                    bodyWidth={16}
                    bodyHeight={8}
                    gap={1}
                    fill={ROLE_COLOR[role]}
                  />
                </FigureBox>
              ))}
            </View>
            <Text variant="caption">{crewText}</Text>
          </View>

          <View style={styles.recruitList}>
            {TEAM_ROLES.map((role) => (
              <RecruitRoleRow
                key={role}
                role={role}
                selected={recruitRoles.includes(role)}
                onPress={() => api.toggleRecruitRole(role)}
              />
            ))}
          </View>
        </View>
      </View>
    </StepBody>
  );
}

function RoleTile({
  role,
  selected,
  onPress,
}: {
  role: TeamRole;
  selected: boolean;
  onPress: () => void;
}) {
  const reduced = useReducedMotion();
  const [scale] = useState(() => new Animated.Value(selected ? 1.04 : 1));

  useEffect(() => {
    const animation = Animated.timing(scale, {
      toValue: selected ? 1.04 : 1,
      duration: reduced ? 0 : 250,
      easing: TEAM_CREATE_EASING.pop,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [reduced, scale, selected]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={role}
      style={styles.roleTilePressable}
    >
      <Animated.View
        style={[
          styles.roleTile,
          {
            backgroundColor: selected ? ROLE_COLOR[role] : ROLE_TINT[role],
            transform: [{ scale }],
          },
          selected && styles.roleTileSelected,
        ]}
      >
        <FigureBox style={styles.roleFigure}>
          <PersonFigure
            head={30}
            bodyWidth={52}
            bodyHeight={26}
            gap={4}
            fill={selected ? CREATE_COLOR.surface : ROLE_COLOR[role]}
            bodyOpacity={0.9}
          />
        </FigureBox>
      </Animated.View>
      <Text variant="bodyStrong" style={{ color: selected ? ROLE_COLOR[role] : CREATE_COLOR.ink }}>
        {role}
      </Text>
    </Pressable>
  );
}

function PanelNotch({ index, gridWidth }: { index: number; gridWidth: number }) {
  const reduced = useReducedMotion();
  const center = ((gridWidth - 24) / 4) * index + index * 8 + (gridWidth - 24) / 8;
  const [x] = useState(() => new Animated.Value(center));
  const first = useRef(true);

  useEffect(() => {
    if (first.current || reduced) {
      x.setValue(center);
      if (gridWidth) first.current = false;
      return;
    }
    const animation = Animated.timing(x, {
      toValue: center,
      duration: 300,
      easing: TEAM_CREATE_EASING.pop,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [center, gridWidth, reduced, x]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.notch,
        { transform: [{ translateX: Animated.subtract(x, 6) }, { rotate: '45deg' }] },
      ]}
    />
  );
}

function PositionDropdown({
  role,
  value,
  open,
  onToggle,
  onPick,
}: {
  role: TeamRole;
  value: string | null;
  open: boolean;
  onToggle: () => void;
  onPick: (position: string) => void;
}) {
  const reduced = useReducedMotion();
  const [rotation] = useState(() => new Animated.Value(open ? 1 : 0));

  useEffect(() => {
    const animation = Animated.timing(rotation, {
      toValue: open ? 1 : 0,
      duration: reduced ? 0 : 250,
      easing: TEAM_CREATE_EASING.inOut,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [open, reduced, rotation]);

  return (
    <View>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={[styles.dropdown, open && { borderColor: ROLE_COLOR[role] }]}
      >
        <View
          style={[
            styles.dropdownDot,
            { backgroundColor: ROLE_COLOR[role], opacity: value ? 1 : 0 },
          ]}
        />
        <Text variant={value ? 'label' : 'body'} numberOfLines={1} style={styles.dropdownText}>
          {value ?? '세부 역할을 선택해주세요'}
        </Text>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        >
          <ChevronIcon dir="down" size={16} color={CREATE_COLOR.faint} />
        </Animated.View>
      </Pressable>

      {open ? (
        <FadeUp duration={200}>
          <View style={styles.dropdownMenu} accessibilityRole="radiogroup">
            {ROLE_OPTIONS[role].map((position) => {
              const selected = value === position;
              return (
                <Pressable
                  key={position}
                  onPress={() => onPick(position)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={position}
                  style={({ pressed }) => [
                    styles.dropdownItem,
                    selected && { backgroundColor: ROLE_TINT[role] },
                    pressed && !selected && { backgroundColor: CREATE_COLOR.surfaceMuted },
                  ]}
                >
                  <Text
                    variant={selected ? 'bodyStrong' : 'body'}
                    style={{ color: selected ? ROLE_COLOR[role] : CREATE_COLOR.body }}
                  >
                    {position}
                  </Text>
                  <Text
                    variant="bodyStrong"
                    style={{ color: selected ? ROLE_COLOR[role] : 'transparent' }}
                  >
                    ✓
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FadeUp>
      ) : null}
    </View>
  );
}

function RecruitRoleRow({
  role,
  selected,
  onPress,
}: {
  role: TeamRole;
  selected: boolean;
  onPress: () => void;
}) {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(selected ? 1 : 0));

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: selected ? 1 : 0,
      duration: reduced ? 0 : 250,
      easing: TEAM_CREATE_EASING.pop,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced, selected]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityState={{ checked: selected }}
      style={[styles.recruitRow, selected && { backgroundColor: ROLE_TINT[role] }]}
    >
      <FigureBox
        style={[
          styles.recruitFigure,
          { backgroundColor: selected ? ROLE_COLOR[role] : ROLE_TINT[role] },
        ]}
      >
        <PersonFigure
          head={11}
          bodyWidth={20}
          bodyHeight={10}
          gap={2}
          fill={selected ? CREATE_COLOR.surface : ROLE_COLOR[role]}
        />
      </FigureBox>
      <View style={styles.recruitCopy}>
        <Text variant="label" style={{ color: selected ? ROLE_COLOR[role] : CREATE_COLOR.ink }}>
          {role}
        </Text>
        <Text variant="meta" color="textBody" numberOfLines={1}>
          {ROLE_DESCRIPTION[role]}
        </Text>
      </View>
      <View
        style={[
          styles.switchTrack,
          { backgroundColor: selected ? ROLE_COLOR[role] : CREATE_COLOR.line },
        ]}
      >
        <Animated.View
          style={[
            styles.switchKnob,
            {
              transform: [
                { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) },
              ],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: space[7] },
  firstDivider: { marginTop: -space[1.5] },
  sentence: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: space[4],
  },
  roleGrid: { flexDirection: 'row', gap: space[2] },
  roleTilePressable: { flex: 1, alignItems: 'center', gap: space[2] },
  roleTile: { alignSelf: 'stretch', aspectRatio: 1, borderRadius: radius['2xl'] },
  roleTileSelected: { ...shadow.brand },
  roleFigure: { flex: 1, alignSelf: 'stretch', borderRadius: radius['2xl'] },
  positionPanelWrap: { marginTop: space[3.5] },
  notch: {
    position: 'absolute',
    top: -6,
    left: 0,
    width: 12,
    height: 12,
    zIndex: 2,
    backgroundColor: CREATE_COLOR.surface,
    borderLeftWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: CREATE_COLOR.line,
  },
  positionPanel: {
    borderWidth: 1.5,
    borderColor: CREATE_COLOR.line,
    borderRadius: radius.xl,
    backgroundColor: CREATE_COLOR.surface,
  },
  positionTitle: { paddingHorizontal: space[4], paddingTop: space[3.5], paddingBottom: space[2.5] },
  dropdownPadding: { paddingHorizontal: space[3], paddingBottom: space[3.5] },
  dropdown: {
    height: 52,
    paddingHorizontal: space[3.5],
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: CREATE_COLOR.line,
    backgroundColor: CREATE_COLOR.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
  },
  dropdownDot: { width: 10, height: 10, borderRadius: radius.full },
  dropdownText: { flex: 1 },
  dropdownMenu: {
    marginTop: space[1.5],
    padding: space[1.5],
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: CREATE_COLOR.line,
    backgroundColor: CREATE_COLOR.surface,
    ...shadow.menu,
  },
  dropdownItem: {
    height: 44,
    paddingHorizontal: space[3],
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crewSummary: {
    marginTop: space[2],
    marginBottom: space[3.5],
    paddingLeft: space[1.5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  crewFigures: { flexDirection: 'row' },
  crewDot: {
    width: 28,
    height: 28,
    marginLeft: -space[1.5],
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: CREATE_COLOR.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recruitList: { gap: space[1] },
  recruitRow: {
    height: 64,
    paddingHorizontal: space[3],
    borderRadius: radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  recruitFigure: { width: 36, height: 36, borderRadius: radius.full },
  recruitCopy: { flex: 1, minWidth: 0, gap: space[0.5] },
  switchTrack: { width: 44, height: 26, borderRadius: radius.full },
  switchKnob: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: CREATE_COLOR.surface,
    ...shadow.control,
  },
});
