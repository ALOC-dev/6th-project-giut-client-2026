import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { C, FONT } from './theme';
import { EASE, useEnter, useTween } from './motion';

export const T = (
  size: number,
  weight: '400' | '500' | '600' | '700' | '800',
  color: string = C.ink,
  extra?: object,
) => ({
  fontSize: size,
  fontWeight: weight,
  color,
  fontFamily: FONT.family,
  ...extra,
});

/** 동그라미 안 사람 모양 (머리 + 어깨) */
export function Avatar({ size, color, tint }: { size: number; color: string; tint: string }) {
  // 캔버스: 52 → 머리 17, 어깨 30×15 / 40 → 13, 24×12 / 36 → 12, 22×11
  const head = Math.round(size * 0.33);
  const bodyW = Math.round(size * 0.58);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: tint,
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      <View style={{ width: head, height: head, borderRadius: head / 2, backgroundColor: color }} />
      <View
        style={{
          width: bodyW,
          height: bodyW / 2,
          marginTop: size >= 50 ? 3 : 2,
          borderTopLeftRadius: bodyW / 2,
          borderTopRightRadius: bodyW / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

/** 토스트 — 1.6초 뒤 사라진다. toastIn .25s */
export function useToast() {
  const [text, setText] = useState('');
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return {
    text,
    show: (s: string) => {
      setText(s);
      clearTimeout(t.current);
      t.current = setTimeout(() => setText(''), 1600);
    },
  };
}

export function Toast({ text, bottom }: { text: string; bottom: number }) {
  if (!text) return null;
  return <ToastBody key={text} text={text} bottom={bottom} />;
}
function ToastBody({ text, bottom }: { text: string; bottom: number }) {
  const v = useEnter(250);
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 45, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: bottom },
      ]}
    >
      <Animated.View
        accessibilityRole="alert"
        style={{
          backgroundColor: C.toast,
          borderRadius: 12,
          paddingVertical: 10,
          paddingHorizontal: 16,
          opacity: v,
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
        }}
      >
        <Text style={T(13, '600', C.white)}>{text}</Text>
      </Animated.View>
    </View>
  );
}

/** 어두운 바탕 — fadeIn .2s */
export function Dim({ onPress }: { onPress: () => void }) {
  const v = useEnter(200, EASE.ease);
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { zIndex: 40, backgroundColor: C.dim, opacity: v }]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onPress} accessibilityLabel="닫기" />
    </Animated.View>
  );
}

/** 바텀시트 — 손잡이 + 내용. sheetUp .32s */
export function Sheet({ children, label }: { children: ReactNode; label: string }) {
  const v = useEnter(320);
  return (
    <Animated.View
      accessibilityViewIsModal
      accessibilityLabel={label}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 41,
        backgroundColor: C.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 34,
        transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }) }],
      }}
    >
      <View
        style={{
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: C.line,
          alignSelf: 'center',
          marginBottom: 14,
        }}
      />
      {children}
    </Animated.View>
  );
}

/** 시트 안 한 줄 — 왼쪽 36 아이콘 상자 + 글자 (+ 오른쪽 요소) */
export function SheetRow({
  icon,
  label,
  danger,
  onPress,
  right,
  role,
  checked,
}: {
  icon: ReactNode;
  label: string;
  danger?: boolean;
  onPress: () => void;
  right?: ReactNode;
  role?: 'switch';
  checked?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role ?? 'button'}
      accessibilityState={role ? { checked } : undefined}
      style={({ pressed }) => ({
        height: 56,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 8,
        backgroundColor: pressed ? C.surface : 'transparent',
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: danger ? C.dangerTint : C.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <Text style={[T(16, '700', danger ? C.danger : C.ink), { flex: 1 }]}>{label}</Text>
      {right}
    </Pressable>
  );
}

export const SheetDivider = () => (
  <View
    style={{ height: 1, backgroundColor: C.lineSoft, marginVertical: 6, marginHorizontal: 8 }}
  />
);

/** 스위치 — 바탕색 .2s, 손잡이 .25s 살짝 튐 */
export function Switch({ on, accent = C.brand }: { on: boolean; accent?: string }) {
  const knob = useTween(on ? 1 : 0, 250, EASE.pop);
  const track = useTween(on ? 1 : 0, 200, EASE.ease, false);
  return (
    <Animated.View
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        backgroundColor: track.interpolate({ inputRange: [0, 1], outputRange: [C.line, accent] }),
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: C.white,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 1.5,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
          transform: [
            { translateX: knob.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) },
          ],
        }}
      />
    </Animated.View>
  );
}

/** 확인 창 — dlgIn .24s */
export function ConfirmDialog({
  title,
  body,
  okLabel,
  onCancel,
  onOk,
}: {
  title: string;
  body: string;
  okLabel: string;
  onCancel: () => void;
  onOk: () => void;
}) {
  const v = useEnter(240);
  return (
    <View
      pointerEvents="box-none"
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 42, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
      ]}
    >
      <Animated.View
        accessibilityRole="alert"
        accessibilityLabel={title}
        style={{
          width: '100%',
          backgroundColor: C.white,
          borderRadius: 22,
          paddingTop: 24,
          paddingHorizontal: 20,
          paddingBottom: 16,
          shadowColor: C.ink,
          shadowOpacity: 0.2,
          shadowRadius: 25,
          shadowOffset: { width: 0, height: 20 },
          elevation: 12,
          opacity: v,
          transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }],
        }}
      >
        <Text style={T(18, '800', C.ink, { letterSpacing: -0.3 })}>{title}</Text>
        <Text style={T(14, '400', C.secondary, { lineHeight: 21.7, marginTop: 8 })}>{body}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
          <Pressable
            onPress={onCancel}
            accessibilityRole="button"
            style={{
              flex: 1,
              height: 48,
              borderRadius: 14,
              backgroundColor: C.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={T(15, '700', C.body)}>취소</Text>
          </Pressable>
          <Pressable
            onPress={onOk}
            accessibilityRole="button"
            style={{
              flex: 1,
              height: 48,
              borderRadius: 14,
              backgroundColor: C.danger,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={T(15, '700', C.white)}>{okLabel}</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
