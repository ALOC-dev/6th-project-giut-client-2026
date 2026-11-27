import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Animated, Easing, FlatList, Platform, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { BellIcon, BellOffIcon, LeaveIcon } from '@/components/icons';
import { BottomSheet, Toast, useToast } from '@/components/ui';
import { color, duration, easing, layout, radius, space, text } from '@/theme';
import { ChatAvatar } from './ChatAvatar';
import { ChatConfirmDialog, ChatMenuDivider, ChatMenuRow, ChatSwitch } from './ChatMenu';
import { bake, useEnter, useLoop, useReducedMotion } from './motion';
import { LIVE_MESSAGE, SAMPLE_ROOMS, fmtListTime } from './mocks';
import type { ChatRoom } from './mocks';

export type OpenedRoom = {
  id: string;
  name: string;
  field: ChatRoom['field'];
  offer: boolean;
};

type Props = {
  rooms?: ChatRoom[];
  empty?: boolean;
  liveDemo?: boolean;
  onOpen?: (room: OpenedRoom) => void;
  onBrowse?: () => void;
  onMuteChange?: (id: string, muted: boolean) => void;
  onLeave?: (id: string) => void;
  topInset?: number;
};

type SheetKind = null | 'menu';
type ConfirmKind = null | 'leave';

const LIVE_MESSAGE_DELAY_MS = 3000;
const LEAVE_COLLAPSE_DELAY_MS = 320;
const MESSAGE_FLASH_DURATION_MS = 1200;
const EMPTY_BOB_DURATION_MS = 3400;
const EMPTY_DOT_DURATION_MS = 1200;
const EMPTY_CONTENT_TOP_OFFSET = 110;

export default function ChatListScreen({
  rooms: initial = SAMPLE_ROOMS,
  empty = false,
  liveDemo = true,
  onOpen,
  onBrowse,
  onMuteChange,
  onLeave,
  topInset = 0,
}: Props) {
  const [rooms, setRooms] = useState<ChatRoom[]>(() => initial.map((r) => ({ ...r })));
  const [fresh, setFresh] = useState<string | null>(null);
  const [freshN, setFreshN] = useState(0);
  const [leaving, setLeaving] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [confirm, setConfirm] = useState<ConfirmKind>(null);
  const pendingConfirm = useRef<ConfirmKind>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const toast = useToast();
  const handleSheetDismiss = useCallback(() => {
    setConfirm(pendingConfirm.current);
    pendingConfirm.current = null;
  }, [setConfirm]);

  useEffect(() => {
    if (!liveDemo || empty) return;
    const t = setTimeout(() => {
      setRooms((rs) =>
        rs.map((r) =>
          r.id === LIVE_MESSAGE.id
            ? { ...r, last: LIVE_MESSAGE.last, t: LIVE_MESSAGE.t, unread: r.unread + 1 }
            : r,
        ),
      );
      setFresh(LIVE_MESSAGE.id);
      setFreshN((n) => n + 1);
    }, LIVE_MESSAGE_DELAY_MS);
    return () => clearTimeout(t);
  }, [liveDemo, empty]);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    [],
  );

  const list = useMemo(() => (empty ? [] : [...rooms].sort((a, b) => b.t - a.t)), [rooms, empty]);
  const tgt = rooms.find((r) => r.id === target);

  const openMenu = (id: string) => {
    setTarget(id);
    setSheet('menu');
    if (Platform.OS === 'android') {
      void Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press);
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const toggleMute = () => {
    if (!tgt) return;
    const m = !tgt.muted;
    setRooms((rs) => rs.map((x) => (x.id === tgt.id ? { ...x, muted: m } : x)));
    onMuteChange?.(tgt.id, m);
    toast.show(m ? '이 채팅방 알림을 껐어요' : '이 채팅방 알림을 켰어요');
  };
  const doLeave = () => {
    if (!target) return;
    const id = target;
    setConfirm(null);
    setLeaving(id);
    toast.show('채팅방을 나갔어요');
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      leaveTimer.current = null;
      setLeaving(null);
      setRooms((rs) => rs.filter((x) => x.id !== id));
      onLeave?.(id);
    }, LEAVE_COLLAPSE_DELAY_MS);
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.surface }}>
      <View style={{ height: topInset }} />
      <View
        style={{
          height: layout.appHeaderHeight,
          paddingHorizontal: space[5],
          justifyContent: 'center',
        }}
      >
        <Text style={[text.titleXl, { color: color.ink }]}>채팅</Text>
      </View>

      <FlatList
        data={list}
        keyExtractor={(room) => room.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: space[1], paddingBottom: space[4] }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: room }) => (
          <RoomRow
            room={room}
            fresh={fresh === room.id ? freshN : 0}
            leaving={leaving === room.id}
            onPress={() => {
              if (room.unread > 0) {
                setRooms((rs) =>
                  rs.map((item) => (item.id === room.id ? { ...item, unread: 0 } : item)),
                );
                setFresh(null);
              }
              onOpen?.({
                id: room.id,
                name: room.name,
                field: room.field,
                offer: !!room.offer,
              });
            }}
            onLongPress={() => openMenu(room.id)}
          />
        )}
        ListEmptyComponent={<Empty onBrowse={onBrowse} />}
      />

      <Toast {...toast.props} bottom={space[6]} />

      <BottomSheet
        visible={sheet === 'menu'}
        onClose={() => setSheet(null)}
        onDismiss={handleSheetDismiss}
        accessibilityLabel="채팅방 메뉴"
      >
        <ChatMenuRow
          icon={<BellIcon />}
          label="채팅방 알림"
          role="switch"
          checked={!tgt?.muted}
          onPress={toggleMute}
          right={<ChatSwitch on={!tgt?.muted} />}
        />
        <ChatMenuDivider />
        <ChatMenuRow
          icon={<LeaveIcon />}
          label="채팅방 나가기"
          danger
          onPress={() => {
            pendingConfirm.current = 'leave';
            setSheet(null);
          }}
        />
      </BottomSheet>
      <ChatConfirmDialog
        visible={confirm === 'leave'}
        title="채팅방을 나갈까요?"
        body="나가면 대화 내용이 내 채팅 목록에서 사라지고, 다시 볼 수 없어요."
        okLabel="나가기"
        onCancel={() => setConfirm(null)}
        onOk={doLeave}
      />
    </View>
  );
}

const BADGE_POP = bake([0, 60, 100], [0, 1.25, 1], easing.spring);
const ROOM_MENU_ACCESSIBILITY_ACTIONS = [{ name: 'openMenu', label: '채팅방 메뉴 열기' }];

function RoomRow({
  room: r,
  fresh,
  leaving,
  onPress,
  onLongPress,
}: {
  room: ChatRoom;
  fresh: number;
  leaving: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const has = r.unread > 0;
  const reduce = useReducedMotion();

  const [press] = useState(() => new Animated.Value(0));
  const pressTo = (v: number) =>
    Animated.timing(press, {
      toValue: v,
      duration: duration.d1,
      easing: easing.out,
      useNativeDriver: true,
    }).start();

  const rowIn = useEnter(duration.d5, easing.out, 0, fresh);
  const [flash] = useState(() => new Animated.Value(0));
  const badge = useEnter(duration.d5, Easing.linear, 0, fresh);
  useEffect(() => {
    if (!fresh || reduce) return;
    flash.setValue(1);
    const animation = Animated.timing(flash, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    });
    const fade = Animated.timing(flash, {
      toValue: 0,
      duration: MESSAGE_FLASH_DURATION_MS,
      delay: duration.d3,
      easing: easing.inOut,
      useNativeDriver: true,
    });
    Animated.sequence([animation, fade]).start();
    return () => {
      animation.stop();
      fade.stop();
    };
  }, [flash, fresh, reduce]);
  const preview = useEnter(duration.d4, easing.out, 0, fresh);

  const [h, setH] = useState(0);
  const [leave] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (!leaving) return;
    Animated.parallel([
      Animated.timing(leave, {
        toValue: 1,
        duration: duration.d3,
        easing: easing.inOut,
        useNativeDriver: false,
      }),
      Animated.timing(fade, {
        toValue: 0,
        duration: duration.d2,
        easing: easing.inOut,
        useNativeDriver: false,
      }),
    ]).start();
  }, [fade, leave, leaving]);

  return (
    <Animated.View
      onLayout={(e) => !leaving && setH(e.nativeEvent.layout.height)}
      style={[
        { overflow: 'hidden', opacity: fade },
        leaving && h
          ? { height: leave.interpolate({ inputRange: [0, 1], outputRange: [h, 0] }) }
          : null,
      ]}
    >
      <Animated.View
        style={{
          opacity: rowIn,
          transform: [
            {
              translateY: rowIn.interpolate({ inputRange: [0, 1], outputRange: [-space[3.5], 0] }),
            },
            { scale: press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.98] }) },
          ],
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: color.brandTint,
            opacity: flash,
          }}
        />
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={450}
          onPressIn={() => pressTo(1)}
          onPressOut={() => pressTo(0)}
          accessibilityRole="button"
          accessibilityLabel={r.name + (has ? ', 안 읽은 메시지 ' + r.unread + '개' : '')}
          accessibilityHint="추가 메뉴에서 알림을 설정하거나 채팅방을 나갈 수 있습니다"
          accessibilityActions={ROOM_MENU_ACCESSIBILITY_ACTIONS}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'openMenu') onLongPress();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: space[3],
            paddingVertical: space[3],
            paddingHorizontal: space[5],
          }}
        >
          <ChatAvatar size={52} field={r.field} />
          <View style={{ flex: 1, minWidth: 0, gap: space[1] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[1] }}>
              <Text
                numberOfLines={1}
                style={[text.button, { color: color.ink, letterSpacing: -0.3, flexShrink: 1 }]}
              >
                {r.name}
              </Text>
              {r.muted && <BellOffIcon />}
            </View>
            <Animated.Text
              numberOfLines={1}
              style={[
                text.body,
                {
                  color: has ? color.ink : color.textMuted,
                  fontWeight: has ? '600' : '400',
                },
                {
                  opacity: preview,
                  transform: [
                    {
                      translateY: preview.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }),
                    },
                  ],
                },
              ]}
            >
              {r.last}
            </Animated.Text>
          </View>
          <View
            style={{
              alignSelf: 'stretch',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingTop: space[1],
              paddingBottom: space[1],
            }}
          >
            <Text style={[text.meta, { color: color.textFaint, fontWeight: '500' }]}>
              {fmtListTime(r.t)}
            </Text>
            {has && (
              <Animated.View
                style={{
                  minWidth: space[5],
                  height: space[5],
                  paddingHorizontal: space[1.5],
                  borderRadius: radius.lg,
                  backgroundColor: color.alert,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ scale: badge.interpolate(BADGE_POP) }],
                }}
              >
                <Text style={[text.meta, { color: color.surface, fontWeight: '800' }]}>
                  {r.unread > 99 ? '99+' : r.unread}
                </Text>
              </Animated.View>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const BOB_Y = bake([0, 50, 100], [0, -8, 0], easing.inOut);
const BOB_R = bake([0, 50, 100], [-3, 2, -3], easing.inOut);
const BLINK = bake([0, 50, 100], [0.35, 1, 0.35], easing.inOut);

function Empty({ onBrowse }: { onBrowse?: () => void }) {
  const bob = useLoop(EMPTY_BOB_DURATION_MS);
  const d0 = useLoop(EMPTY_DOT_DURATION_MS, 0);
  const d1 = useLoop(EMPTY_DOT_DURATION_MS, duration.d1);
  const d2 = useLoop(EMPTY_DOT_DURATION_MS, duration.d5);
  const blink = (v: Animated.Value) => v.interpolate(BLINK);
  return (
    <View
      style={{
        alignItems: 'center',
        paddingTop: EMPTY_CONTENT_TOP_OFFSET,
        paddingHorizontal: space[8],
      }}
    >
      <Animated.View
        style={{
          width: 104,
          height: 92,
          transform: [
            { translateY: bob.interpolate(BOB_Y) },
            {
              rotate: bob.interpolate({
                inputRange: BOB_R.inputRange,
                outputRange: BOB_R.outputRange.map((d) => d + 'deg'),
              }),
            },
          ],
        }}
      >
        <Svg width={104} height={92} viewBox="0 0 104 92" fill="none">
          <Path
            d="M14 8h62a10 10 0 0 1 10 10v34a10 10 0 0 1-10 10H38L22 76V62h-8A10 10 0 0 1 4 52V18A10 10 0 0 1 14 8z"
            fill={color.brandTint}
          />
          <Path
            d="M50 34h38a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8h-4v10l-12-10H50a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8z"
            fill={color.brand}
          />
          <AnimatedCircle cx={58} cy={54} r={3} fill={color.surface} opacity={blink(d0)} />
          <AnimatedCircle cx={69} cy={54} r={3} fill={color.surface} opacity={blink(d1)} />
          <AnimatedCircle cx={80} cy={54} r={3} fill={color.surface} opacity={blink(d2)} />
        </Svg>
      </Animated.View>
      <Text style={[text.titleLg, { color: color.ink, marginTop: space[5] }]}>
        아직 대화가 없어요
      </Text>
      <Text
        style={[
          text.body,
          { color: color.textSecondary, fontWeight: '400', textAlign: 'center' },
          { marginTop: space[2] },
        ]}
      >
        {'마음에 드는 팀에 문의하거나\n팀 제안을 받으면 대화가 시작돼요.'}
      </Text>
      <Pressable
        onPress={onBrowse}
        accessibilityRole="button"
        style={{
          marginTop: space[5],
          height: layout.minimumTouchTargetSize,
          paddingHorizontal: space[4.5],
          borderRadius: radius.control,
          backgroundColor: color.brandTint,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={[text.bodyStrong, { color: color.brandStrong }]}>공모전 둘러보기</Text>
      </Pressable>
    </View>
  );
}
