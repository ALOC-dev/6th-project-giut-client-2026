import { useEffect, useState } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  View,
  type KeyboardEvent,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';

import { Text } from '@/components/ui';
import { layout, space, text } from '@/theme';

import { CREATE_COLOR } from './constants';
import { pingPong, StepBody, TEAM_CREATE_EASING } from './TeamCreateParts';
import type { TeamDraftApi } from './useTeamDraft';

export function TeamCreateStepName({ api }: { api: TeamDraftApi }) {
  const reduced = useReducedMotion();
  const [keyboardOffset] = useState(() => new Animated.Value(0));
  const name = api.draft.name;
  const [lineLength, setLineLength] = useState(() => countCharacters(name));
  const full = name.length >= 12;
  const valid = name.trim().length >= 2;
  const hint = full ? '최대 12자까지 입력할 수 있어요' : valid ? ' ' : '2자 이상 입력해주세요';
  const hintColor = full ? CREATE_COLOR.danger : valid ? CREATE_COLOR.success : CREATE_COLOR.body;
  const lineColor = full ? CREATE_COLOR.danger : name ? CREATE_COLOR.brand : CREATE_COLOR.line;

  const handleChangeName = (value: string) => {
    const nextLength = countCharacters(value.slice(0, 12));
    setLineLength((current) => (nextLength === 0 ? 0 : Math.max(current, nextLength)));
    api.setName(value);
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    let animation: Animated.CompositeAnimation | undefined;

    const moveContent = (toValue: number, event: KeyboardEvent) => {
      animation?.stop();
      animation = Animated.timing(keyboardOffset, {
        toValue,
        duration: reduced ? 0 : Math.max(event.duration ?? 250, 180),
        easing: TEAM_CREATE_EASING.out,
        useNativeDriver: true,
      });
      animation.start();
    };

    const showSubscription = Keyboard.addListener(showEvent, (event) =>
      moveContent(-space[8], event),
    );
    const hideSubscription = Keyboard.addListener(hideEvent, (event) => moveContent(0, event));

    return () => {
      animation?.stop();
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardOffset, reduced]);

  return (
    <StepBody contentStyle={styles.content}>
      <Animated.View style={[styles.form, { transform: [{ translateY: keyboardOffset }] }]}>
        <WavingFlag />
        <Text variant="label" color="textBody">
          우리 팀 이름은
        </Text>
        <View style={styles.inputGroup}>
          <View style={styles.inputField}>
            <TextInput
              value={name}
              onChangeText={handleChangeName}
              onEndEditing={() => setLineLength(countCharacters(name))}
              maxLength={12}
              placeholder="팀 이름 입력"
              placeholderTextColor={CREATE_COLOR.disabled}
              selectionColor={CREATE_COLOR.brand}
              returnKeyType="next"
              textAlignVertical="center"
              accessibilityLabel="팀 이름"
              style={[styles.input, { color: name ? CREATE_COLOR.brand : CREATE_COLOR.ink }]}
            />
          </View>
          <GrowingLine length={lineLength} color={lineColor} />
        </View>
        <Text variant="caption" style={{ color: hintColor }}>
          {hint}
        </Text>
      </Animated.View>
    </StepBody>
  );
}

function countCharacters(value: string) {
  return Array.from(value.normalize('NFC')).length;
}

function WavingFlag() {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduced) return;
    const animation = pingPong(progress, 800);
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);

  return (
    <View style={styles.flagWrap}>
      <View style={styles.flagPole} />
      <Animated.View
        style={[
          styles.flag,
          {
            transform: [
              { scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] }) },
              {
                skewY: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-4deg'] }),
              },
            ],
          },
        ]}
      >
        <Svg width={36} height={26}>
          <Polygon points="0,0 36,0 29.52,13 36,26 0,26" fill={CREATE_COLOR.brand} />
        </Svg>
      </Animated.View>
    </View>
  );
}

function GrowingLine({ length, color }: { length: number; color: string }) {
  const reduced = useReducedMotion();
  const targetScale = Math.min(1, 0.2 + length / 15);
  const [scale] = useState(() => new Animated.Value(targetScale));

  useEffect(() => {
    const animation = Animated.timing(scale, {
      toValue: targetScale,
      duration: reduced ? 0 : 180,
      easing: TEAM_CREATE_EASING.easeOut,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [reduced, scale, targetScale]);

  return (
    <View style={styles.lineTrack}>
      <Animated.View
        style={[styles.line, { backgroundColor: color, transform: [{ scaleX: scale }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: space[6],
    paddingBottom: layout.teamCreateNameBottomPadding,
  },
  form: { alignSelf: 'stretch', alignItems: 'center', gap: space[2] },
  flagWrap: { width: 56, height: 60, marginBottom: space[1.5] },
  flagPole: {
    position: 'absolute',
    left: 12,
    top: 4,
    width: 4,
    height: 54,
    borderRadius: 2,
    backgroundColor: CREATE_COLOR.ink,
  },
  flag: { position: 'absolute', left: 16, top: 6, width: 36, height: 26 },
  inputGroup: { width: '100%', alignItems: 'center', gap: space[2] },
  inputField: {
    width: '100%',
    height: 64,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  input: {
    ...text.displayNumber,
    height: 64,
    padding: 0,
    textAlign: 'center',
    includeFontPadding: false,
    fontSize: 34,
    lineHeight: 42,
  },
  lineTrack: { width: '72%', maxWidth: 260, height: 3 },
  line: { width: '100%', height: 3, borderRadius: 2 },
});
