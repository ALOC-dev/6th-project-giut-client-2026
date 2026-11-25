import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, Vibration, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { BellIcon, BellOffIcon, LeaveIcon } from '@/components/icons';
import { C, ROLE } from './theme';
import { EASE, bake, useEnter, useLoop, useReducedMotion } from './motion';
import {
  Avatar,
  ConfirmDialog,
  Dim,
  Sheet,
  SheetDivider,
  SheetRow,
  Switch,
  T,
  Toast,
  useToast,
} from './parts';
import { LIVE_MESSAGE, SAMPLE_ROOMS, fmtListTime } from './data';
import type { Room } from './data';

export type OpenedRoom = { id: string; name: string; color: string; tint: string; offer: boolean };

type Props = {
  /** 방 목록. 없으면 캔버스 샘플 */
  rooms?: Room[];
  /** 빈 화면 보기 */
  empty?: boolean;
  /** 3초 뒤 새 메시지가 오는 데모 (캔버스 liveDemo). 기본 켜짐 */
  liveDemo?: boolean;
  /** 방을 누름 — 읽음 처리 후 호출. ChatFlow가 받아서 대화 화면을 밀어 넣는다 */
  onOpen?: (room: OpenedRoom) => void;
  /** 빈 화면 '공모전 둘러보기' */
  onBrowse?: () => void;
  /** 알림 켬/끔, 나가기 — 서버에 반영할 때 */
  onMuteChange?: (id: string, muted: boolean) => void;
  onLeave?: (id: string) => void;
  /** 상태 표시줄 높이 */
  topInset?: number;
};

type SheetKind = null | 'menu' | 'leave';

export default function ChatListScreen({
  rooms: initial = SAMPLE_ROOMS,
  empty = false,
  liveDemo = true,
  onOpen,
  onBrowse,
  onMuteChange,
  onLeave,
  topInset = 50,
}: Props) {
  const [rooms, setRooms] = useState<Room[]>(() => initial.map((r) => ({ ...r })));
  const [fresh, setFresh] = useState<string | null>(null);
  const [freshN, setFreshN] = useState(0);
  const [leaving, setLeaving] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [target, setTarget] = useState<string | null>(null);
  const toast = useToast();

  // 라이브 데모 — 3초 뒤 박준호에게서 새 메시지 (맨 위로 올라오며 반짝)
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
    }, 3000);
    return () => clearTimeout(t);
  }, [liveDemo, empty]);

  const list = useMemo(() => (empty ? [] : [...rooms].sort((a, b) => b.t - a.t)), [rooms, empty]);
  const tgt = rooms.find((r) => r.id === target);

  const openMenu = (id: string) => {
    setTarget(id);
    setSheet('menu');
    Vibration.vibrate(10);
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
    setSheet(null);
    setLeaving(id);
    toast.show('채팅방을 나갔어요');
    setTimeout(() => {
      setLeaving(null);
      setRooms((rs) => rs.filter((x) => x.id !== id));
      onLeave?.(id);
    }, 320);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <View style={{ height: topInset }} />
      <View
        style={{
          height: 54,
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}
      >
        <Text style={T(24, '800', C.ink, { letterSpacing: -0.5 })}>채팅</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {list.map((r) => (
          <RoomRow
            key={r.id}
            room={r}
            fresh={fresh === r.id ? freshN : 0}
            leaving={leaving === r.id}
            onPress={() => {
              const [c, tint] = ROLE[r.field];
              if (r.unread > 0) {
                setRooms((rs) => rs.map((x) => (x.id === r.id ? { ...x, unread: 0 } : x)));
                setFresh(null);
              }
              onOpen?.({ id: r.id, name: r.name, color: c, tint, offer: !!r.offer });
            }}
            onLongPress={() => openMenu(r.id)}
          />
        ))}
        {list.length === 0 && <Empty onBrowse={onBrowse} />}
      </ScrollView>

      <Toast text={toast.text} bottom={24} />

      {sheet && <Dim onPress={() => setSheet(null)} />}
      {sheet === 'menu' && (
        <Sheet label="채팅방 메뉴">
          <Text
            numberOfLines={1}
            style={[
              T(13, '700', C.muted),
              { paddingTop: 4, paddingHorizontal: 8, paddingBottom: 10, marginTop: -4 },
            ]}
          >
            {tgt?.name}
          </Text>
          <SheetRow
            icon={<BellIcon />}
            label="채팅방 알림"
            role="switch"
            checked={!tgt?.muted}
            onPress={toggleMute}
            right={<Switch on={!tgt?.muted} />}
          />
          <SheetDivider />
          <SheetRow
            icon={<LeaveIcon />}
            label="채팅방 나가기"
            danger
            onPress={() => setSheet('leave')}
          />
        </Sheet>
      )}
      {sheet === 'leave' && (
        <ConfirmDialog
          title="채팅방을 나갈까요?"
          body="나가면 대화 내용이 내 채팅 목록에서 사라지고, 다시 볼 수 없어요."
          okLabel="나가기"
          onCancel={() => setSheet(null)}
          onOk={doLeave}
        />
      )}
    </View>
  );
}

/* ───────── 한 줄 */

const BADGE_POP = bake([0, 60, 100], [0, 1.25, 1], EASE.pop);

function RoomRow({
  room: r,
  fresh,
  leaving,
  onPress,
  onLongPress,
}: {
  room: Room;
  fresh: number;
  leaving: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const [c, tint] = ROLE[r.field];
  const has = r.unread > 0;
  const reduce = useReducedMotion();

  // 누르는 동안 살짝 작아짐 (.18s)
  const [press] = useState(() => new Animated.Value(0));
  const pressTo = (v: number) =>
    Animated.timing(press, {
      toValue: v,
      duration: 180,
      easing: EASE.out,
      useNativeDriver: true,
    }).start();

  // 새 메시지: rowIn .4s + rowFlash 1.2s(.3s 뒤) + previewIn .35s + badgePop .4s
  const rowIn = useEnter(400, EASE.out, 0, fresh);
  const [flash] = useState(() => new Animated.Value(0));
  const badge = useEnter(400, Easing.linear, 0, fresh);
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
      duration: 1200,
      delay: 300,
      easing: EASE.ease,
      useNativeDriver: true,
    });
    Animated.sequence([animation, fade]).start();
    return () => {
      animation.stop();
      fade.stop();
    };
  }, [flash, fresh, reduce]);
  const preview = useEnter(350, EASE.out, 0, fresh);

  // 나가기: 높이가 접히며(.3s) 흐려진다(.25s)
  const [h, setH] = useState(0);
  const [leave] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (!leaving) return;
    Animated.parallel([
      Animated.timing(leave, {
        toValue: 1,
        duration: 300,
        easing: EASE.std,
        useNativeDriver: false,
      }),
      Animated.timing(fade, {
        toValue: 0,
        duration: 250,
        easing: EASE.ease,
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
            { translateY: rowIn.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] }) },
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
            backgroundColor: C.brandTint,
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
            paddingHorizontal: 22,
          }}
        >
          <Avatar size={52} color={c} tint={tint} />
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text
                numberOfLines={1}
                style={[T(16, '700', C.ink, { letterSpacing: -0.3 }), { flexShrink: 1 }]}
              >
                {r.name}
              </Text>
              {r.muted && <BellOffIcon />}
            </View>
            <Animated.Text
              numberOfLines={1}
              style={[
                T(14, has ? '600' : '400', has ? C.ink : C.muted),
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
              paddingTop: 3,
              paddingBottom: 4,
            }}
          >
            <Text style={T(12, '500', C.faint)}>{fmtListTime(r.t)}</Text>
            {has && (
              <Animated.View
                style={{
                  minWidth: 22,
                  height: 22,
                  paddingHorizontal: 7,
                  borderRadius: 11,
                  backgroundColor: C.badge,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ scale: badge.interpolate(BADGE_POP) }],
                }}
              >
                <Text style={T(12, '800', C.white)}>{r.unread > 99 ? '99+' : r.unread}</Text>
              </Animated.View>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

/* ───────── 빈 화면 */

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const BOB_Y = bake([0, 50, 100], [0, -8, 0], EASE.inOut);
const BOB_R = bake([0, 50, 100], [-3, 2, -3], EASE.inOut);
const BLINK = bake([0, 50, 100], [0.35, 1, 0.35], EASE.inOut);

function Empty({ onBrowse }: { onBrowse?: () => void }) {
  const bob = useLoop(3400);
  const d0 = useLoop(1200, 0);
  const d1 = useLoop(1200, 200);
  const d2 = useLoop(1200, 400);
  // 점 깜빡임은 SVG 속성이라 JS로 돈다
  const blink = (v: Animated.Value) => v.interpolate(BLINK);
  return (
    <View style={{ alignItems: 'center', paddingTop: 110, paddingHorizontal: 32 }}>
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
            fill={C.brandTint}
          />
          <Path
            d="M50 34h38a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8h-4v10l-12-10H50a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8z"
            fill={C.brand}
          />
          <AnimatedCircle cx={58} cy={54} r={3} fill={C.white} opacity={blink(d0)} />
          <AnimatedCircle cx={69} cy={54} r={3} fill={C.white} opacity={blink(d1)} />
          <AnimatedCircle cx={80} cy={54} r={3} fill={C.white} opacity={blink(d2)} />
        </Svg>
      </Animated.View>
      <Text style={[T(19, '800', C.ink, { letterSpacing: -0.4 }), { marginTop: 22 }]}>
        아직 대화가 없어요
      </Text>
      <Text
        style={[
          T(14, '400', C.secondary, { lineHeight: 22.4, textAlign: 'center' }),
          { marginTop: 8 },
        ]}
      >
        {'마음에 드는 팀에 문의하거나\n팀 제안을 받으면 대화가 시작돼요.'}
      </Text>
      <Pressable
        onPress={onBrowse}
        accessibilityRole="button"
        style={{
          marginTop: 22,
          height: 44,
          paddingHorizontal: 18,
          borderRadius: 12,
          backgroundColor: C.brandTint,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={T(14, '700', C.brandStrong)}>공모전 둘러보기</Text>
      </Pressable>
    </View>
  );
}
