import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { color, radius, space, useMotion, type TextVariant } from '@/theme';

import { Text } from './Text';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  titleVariant?: TextVariant;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  sheetStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function BottomSheet({ visible, ...props }: BottomSheetProps) {
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (!visible || mounted) return;

    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [mounted, visible]);

  const handleExited = useCallback(() => setMounted(false), []);

  if (!mounted) return null;
  return <BottomSheetContent visible={visible} onExited={handleExited} {...props} />;
}

type BottomSheetContentProps = BottomSheetProps & {
  onExited: () => void;
};

function BottomSheetContent({
  visible,
  onClose,
  onExited,
  children,
  title,
  titleVariant = 'titleMd',
  headerAction,
  footer,
  contentStyle,
  sheetStyle,
  accessibilityLabel = title ?? '바텀시트',
}: BottomSheetContentProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { reduced, slide } = useMotion();
  const progress = useSharedValue(reduced ? 1 : 0);
  const dragY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      dragY.set(0);
      progress.set(reduced ? 1 : withTiming(1, slide.sheet.in));
      return;
    }

    if (reduced) {
      progress.set(0);
      onExited();
      return;
    }

    progress.set(
      withTiming(0, slide.sheet.out, (finished) => {
        if (finished) runOnJS(onExited)();
      }),
    );
  }, [dragY, onExited, progress, reduced, slide.sheet.in, slide.sheet.out, visible]);

  const close = () => {
    onClose();
  };

  const panGesture = usePanGesture({
    activeOffsetY: [-6, 6],
    failOffsetX: [-20, 20],
    onUpdate: (event) => {
      dragY.set(Math.max(0, event.translationY));
    },
    onDeactivate: (event) => {
      const shouldClose = event.translationY > windowHeight * 0.18 || event.velocityY > 900;

      if (shouldClose) {
        scheduleOnRN(close);
        return;
      }

      dragY.set(
        reduced
          ? 0
          : withSpring(0, {
              damping: 20,
              stiffness: 240,
              mass: 0.7,
            }),
      );
    },
  });

  const backdropStyle = useAnimatedStyle(() => {
    const dragProgress = Math.min(dragY.value / (windowHeight * 0.5), 1);
    return { opacity: progress.value * (1 - dragProgress) };
  });
  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: windowHeight * (1 - progress.value) + dragY.value,
      },
    ],
  }));

  return (
    <Modal
      transparent
      visible
      animationType="none"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={close}
    >
      <View style={styles.root}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: color.overlayDim }, backdropStyle]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={close} accessible={false} />
        </Animated.View>

        <Animated.View
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
          style={[
            styles.sheet,
            {
              maxHeight: windowHeight - Math.max(insets.top + space[5], 64),
              paddingBottom: Math.max(insets.bottom, space[3]),
            },
            sheetAnimatedStyle,
            sheetStyle,
          ]}
        >
          <GestureDetector gesture={panGesture}>
            <View style={styles.handleArea}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>

          {title || headerAction ? (
            <View style={styles.header}>
              {title ? <Text variant={titleVariant}>{title}</Text> : <View />}
              {headerAction}
            </View>
          ) : null}

          <View style={[styles.content, contentStyle]}>{children}</View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: color.surface,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  handleArea: {
    height: space[8],
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 36,
    height: space[1],
    borderRadius: radius.full,
    backgroundColor: color.line,
  },
  header: {
    minHeight: 36,
    paddingHorizontal: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexShrink: 1,
    paddingHorizontal: space[4],
  },
  footer: {
    paddingHorizontal: space[4],
    paddingTop: space[3],
  },
});
