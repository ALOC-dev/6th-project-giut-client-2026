import type { ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, easing, text } from '@/theme';
import { useEnter, useTween } from './motion';

type ChatMenuRowProps = {
  icon: ReactNode;
  label: string;
  danger?: boolean;
  onPress: () => void;
  right?: ReactNode;
  role?: 'switch';
  checked?: boolean;
};

export function ChatMenuRow({
  icon,
  label,
  danger,
  onPress,
  right,
  role,
  checked,
}: ChatMenuRowProps) {
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
        backgroundColor: pressed ? color.surfaceMuted : 'transparent',
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: danger ? color.dangerTint : color.surfaceMuted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <Text style={[text.button, { flex: 1, color: danger ? color.danger : color.ink }]}>
        {label}
      </Text>
      {right}
    </Pressable>
  );
}

export const ChatMenuDivider = () => (
  <View
    style={{ height: 1, backgroundColor: color.lineSoft, marginVertical: 6, marginHorizontal: 8 }}
  />
);

export function ChatSwitch({ on, accent = color.brand }: { on: boolean; accent?: string }) {
  const knob = useTween(on ? 1 : 0, 250, easing.spring);
  const track = useTween(on ? 1 : 0, 200, easing.inOut, false);

  return (
    <Animated.View
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        backgroundColor: track.interpolate({
          inputRange: [0, 1],
          outputRange: [color.line, accent],
        }),
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
          backgroundColor: color.surface,
          shadowColor: color.ink,
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

type ChatConfirmDialogProps = {
  visible: boolean;
  title: string;
  body: string;
  okLabel: string;
  onCancel: () => void;
  onOk: () => void;
};

export function ChatConfirmDialog({
  visible,
  title,
  body,
  okLabel,
  onCancel,
  onOk,
}: ChatConfirmDialogProps) {
  if (!visible) return null;

  return (
    <ConfirmDialogBody
      visible={visible}
      title={title}
      body={body}
      okLabel={okLabel}
      onCancel={onCancel}
      onOk={onOk}
    />
  );
}

function ConfirmDialogBody({ title, body, okLabel, onCancel, onOk }: ChatConfirmDialogProps) {
  const value = useEnter(240);

  return (
    <View style={[StyleSheet.absoluteFill, styles.dialogRoot]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessible={false} />
      <Animated.View
        accessibilityViewIsModal
        accessibilityRole="alert"
        accessibilityLabel={title}
        style={[
          styles.dialog,
          {
            opacity: value,
            transform: [
              { scale: value.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
            ],
          },
        ]}
      >
        <Text style={[text.titleLg, { color: color.ink }]}>{title}</Text>
        <Text style={[text.body, { color: color.textSecondary, fontWeight: '400', marginTop: 8 }]}>
          {body}
        </Text>
        <View style={styles.actions}>
          <Pressable onPress={onCancel} accessibilityRole="button" style={styles.cancelButton}>
            <Text style={[text.label, { color: color.textBody }]}>취소</Text>
          </Pressable>
          <Pressable onPress={onOk} accessibilityRole="button" style={styles.okButton}>
            <Text style={[text.label, { color: color.surface }]}>{okLabel}</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogRoot: {
    zIndex: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: color.overlayDim,
  },
  dialog: {
    width: '100%',
    backgroundColor: color.surface,
    borderRadius: 22,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: color.ink,
    shadowOpacity: 0.2,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 20 },
    elevation: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: color.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: color.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
