import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { radius, space } from '@/theme';

import {
  ACTIVITY_MODES,
  COLLABORATION_TOOLS,
  CREATE_COLOR,
  MEETING_PLACES,
  type ActivityMode,
} from './constants';
import { OptionChip, SectionTitle, StepBody } from './TeamCreateParts';
import type { TeamDraftApi } from './useTeamDraft';

type Props = { api: Pick<TeamDraftApi, 'draft' | 'set' | 'toggleTool'> };

export function TeamCreateStepActivity({ api: { draft, set, toggleTool } }: Props) {
  const showPlace = draft.mode === '오프라인' || draft.mode === '온·오프 혼합';
  const showTools = draft.mode === '온라인' || draft.mode === '온·오프 혼합';

  const handleModeChange = (mode: ActivityMode) => {
    if (mode === '온라인') {
      set({ mode, place: null });
      return;
    }

    if (mode === '오프라인') {
      set({ mode, tools: [] });
      return;
    }

    set({ mode });
  };

  return (
    <StepBody contentStyle={styles.body}>
      <View>
        <SectionTitle>어디서 활동하나요?</SectionTitle>
        <View style={styles.modeList} accessibilityRole="radiogroup">
          {ACTIVITY_MODES.map(([mode, description]) => {
            const selected = draft.mode === mode;
            return (
              <Pressable
                key={mode}
                onPress={() => handleModeChange(mode)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                style={({ pressed }) => [
                  styles.modeCard,
                  selected && styles.modeCardSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.radio, selected && styles.radioSelected]} />
                <View style={styles.modeCopy}>
                  <Text variant="label">{mode}</Text>
                  <Text variant="meta" color="textSecondary">
                    {description}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View>
        <SectionTitle>회의는 얼마나 자주 하나요?</SectionTitle>
        <View style={styles.meetingRow}>
          {[1, 2, 3, 4].map((count) => (
            <OptionChip
              key={count}
              label={count === 4 ? '주 4회+' : `주 ${count}회`}
              selected={draft.meetings === count}
              onPress={() => set({ meetings: draft.meetings === count ? 0 : count })}
              style={styles.meetingChip}
            />
          ))}
        </View>
      </View>

      {showPlace ? (
        <View>
          <SectionTitle>주로 만나는 곳</SectionTitle>
          <View style={styles.chipRow}>
            {MEETING_PLACES.map((place) => (
              <OptionChip
                key={place}
                label={place}
                selected={draft.place === place}
                onPress={() => set({ place: draft.place === place ? null : place })}
              />
            ))}
          </View>
        </View>
      ) : null}

      {showTools ? (
        <View>
          <SectionTitle>주로 쓰는 협업 도구</SectionTitle>
          <View style={styles.chipRow}>
            {COLLABORATION_TOOLS.map((tool) => (
              <OptionChip
                key={tool}
                label={tool}
                selected={draft.tools.includes(tool)}
                onPress={() => toggleTool(tool)}
              />
            ))}
          </View>
        </View>
      ) : null}
    </StepBody>
  );
}

const styles = StyleSheet.create({
  body: { gap: space[6] },
  modeList: { gap: space[2] },
  modeCard: {
    paddingHorizontal: space[4],
    paddingVertical: space[3.5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    borderWidth: 1,
    borderColor: CREATE_COLOR.line,
    borderRadius: radius.lg,
    backgroundColor: CREATE_COLOR.surface,
  },
  modeCardSelected: {
    borderColor: CREATE_COLOR.brand,
    backgroundColor: CREATE_COLOR.brandTint,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: CREATE_COLOR.disabled,
  },
  radioSelected: {
    borderWidth: 6,
    borderColor: CREATE_COLOR.brand,
  },
  modeCopy: { flex: 1, gap: space[0.5] },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[1.5] },
  meetingRow: { flexDirection: 'row', gap: space[1.5] },
  meetingChip: { flex: 1, paddingHorizontal: 0 },
  pressed: { opacity: 0.82 },
});
