import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type ScrollViewInstance,
} from 'react-native';
import {
  BellIcon,
  BellOffIcon,
  CheckIcon,
  ChevronIcon,
  CopyIcon,
  DeletedIcon,
  LeaveIcon,
  MoreIcon,
  SendIcon,
  TrashIcon,
} from '@/components/icons';
import { C } from './theme';
import { EASE, bake, useEnter, useReducedMotion, useTween } from './motion';
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
import { DAY_LABEL, OFFER_CARD, fmtClock, seedMessages } from './data';
import type { Msg } from './data';

type Props = {
  partner?: string;
  partnerColor?: string;
  partnerTint?: string;
  /** 문의: 내가 팀장에게 연락한 방 · 제안: 팀장이 합류를 제안한 방 */
  scenario?: '문의' | '제안';
  /** 내 말풍선·버튼 색 (캔버스 accent) */
  accent?: string;
  /** 처음 메시지. 없으면 캔버스 샘플 */
  initialMessages?: Msg[];
  onBack?: () => void;
  /** 복사하기 — 앱에서 expo-clipboard 등으로 복사 */
  onCopy?: (text: string) => void;
  onSend?: (text: string) => void;
  onDelete?: (id: number) => void;
  onLeave?: () => void;
  onMuteChange?: (muted: boolean) => void;
  onAccept?: () => void;
  onDecline?: () => void;
  topInset?: number;
  bottomInset?: number;
};

type SheetKind = null | 'more' | 'leave' | 'msg' | 'del';

export default function ChatRoomScreen({
  partner = '박준호',
  partnerColor = '#1FB57F',
  partnerTint = '#E6F7F0',
  scenario = '문의',
  accent = C.brand,
  initialMessages,
  onBack,
  onCopy,
  onSend,
  onDelete,
  onLeave,
  onMuteChange,
  onAccept,
  onDecline,
  topInset = 50,
  bottomInset = 28,
}: Props) {
  const [msgs, setMsgs] = useState<Msg[]>(() => initialMessages ?? seedMessages(scenario, partner));
  const [nextId, setNextId] = useState(100);
  const [fresh, setFresh] = useState(-1);
  const [swapped, setSwapped] = useState(-1);
  const [draft, setDraft] = useState('');
  const [offer, setOffer] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [target, setTarget] = useState(-1);
  const [left, setLeft] = useState(false);
  const [muted, setMuted] = useState(false);
  const toast = useToast();
  const scroll = useRef<ScrollViewInstance>(null);
  const readT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(readT.current), []);

  const push = (items: Partial<Msg>[]) => {
    const d = new Date();
    const last = msgs.reduce((a, m) => Math.max(a, m.min), 0);
    const min = Math.max(d.getHours() * 60 + d.getMinutes(), last);
    let id = nextId;
    const added = items.map((it) => ({ id: id++, kind: 'text', min, who: 'me', ...it }) as Msg);
    setMsgs((cur) => [...cur, ...added]);
    setNextId(id);
    setFresh(added[added.length - 1].id);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    push([{ who: 'me', text, unread: 1 }]);
    setDraft('');
    onSend?.(text);
    // 1.8초 뒤 상대가 읽음 → '1' 사라짐
    clearTimeout(readT.current);
    readT.current = setTimeout(
      () => setMsgs((cur) => cur.map((m) => (m.who === 'me' ? { ...m, unread: 0 } : m))),
      1800,
    );
  };

  const rows = useMemo(() => {
    const sorted = [...msgs].sort((a, b) => a.min - b.min || a.id - b.id);
    return sorted.map((m, i) => {
      const prev = sorted[i - 1],
        next = sorted[i + 1];
      const same = (a?: Msg) => !!a && a.who === m.who && a.min === m.min;
      return { m, first: !same(prev), last: !same(next) };
    });
  }, [msgs]);

  const empty = draft.trim() === '';
  const targetMsg = msgs.find((m) => m.id === target);

  const openMsgMenu = (id: number) => {
    if (left) return;
    setTarget(id);
    setSheet('msg');
    if (Platform.OS === 'android') {
      void Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press);
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <View style={{ height: topInset }} />

      {/* 상단 — 뒤로 · 상대 · ⋯ */}
      <View
        style={{
          height: 52,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingRight: 8,
          paddingLeft: 6,
          borderBottomWidth: 1,
          borderBottomColor: C.lineSoft,
        }}
      >
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronIcon size={24} dir="left" />
        </Pressable>
        <Avatar size={40} color={partnerColor} tint={partnerTint} />
        <View
          style={{
            flex: 1,
            minWidth: 0,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingLeft: 4,
          }}
        >
          <Text numberOfLines={1} style={T(17, '700', C.ink, { letterSpacing: -0.3 })}>
            {partner}
          </Text>
          {muted && <MutedMark />}
        </View>
        <Pressable
          onPress={() => !left && setSheet('more')}
          accessibilityRole="button"
          accessibilityLabel="더보기"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MoreIcon />
        </Pressable>
      </View>

      {/* 대화 */}
      <ScrollView
        ref={scroll}
        style={{ flex: 1, backgroundColor: C.chatBg }}
        contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 16, paddingBottom: 16 }}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 6 }}>
          <View
            style={{
              backgroundColor: C.datePill,
              borderRadius: 999,
              paddingVertical: 5,
              paddingHorizontal: 12,
            }}
          >
            <Text style={T(12, '600', C.secondary)}>{DAY_LABEL}</Text>
          </View>
        </View>

        {rows.map(({ m, first, last }) => {
          const isFresh = m.id === fresh;
          if (m.who === 'sys') {
            return (
              <MsgIn
                key={'s' + m.id}
                on={isFresh}
                style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 2 }}
              >
                <View
                  style={{
                    backgroundColor: C.sysPill,
                    borderRadius: 10,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text style={T(12, '400', C.secondary, { textAlign: 'center', lineHeight: 18 })}>
                    {m.text}
                  </Text>
                </View>
              </MsgIn>
            );
          }
          const mine = m.who === 'me';
          const mt = first ? 14 : 4;
          if (!mine) {
            return (
              <MsgIn
                key={'m' + m.id}
                on={isFresh}
                style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: mt }}
              >
                {first ? (
                  <Avatar size={36} color={partnerColor} tint={partnerTint} />
                ) : (
                  <View style={{ width: 36 }} />
                )}
                <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
                  {first && (
                    <Text style={[T(13, '700', C.ink), { paddingLeft: 2 }]}>{partner}</Text>
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
                    {m.kind === 'offer' ? (
                      <OfferCard
                        accent={accent}
                        first={first}
                        state={offer}
                        onAccept={() => {
                          setOffer('accepted');
                          push([
                            {
                              who: 'sys',
                              text: '데이터 길잡이 팀에 합류했어요. 팀 채팅방에 초대됐어요.',
                            },
                          ]);
                          onAccept?.();
                        }}
                        onDecline={() => {
                          setOffer('declined');
                          push([
                            {
                              who: 'sys',
                              text: '제안을 거절했어요. 대화는 계속 이어갈 수 있어요.',
                            },
                          ]);
                          onDecline?.();
                        }}
                      />
                    ) : (
                      <View
                        style={[
                          bubbleR(false, first),
                          {
                            maxWidth: 236,
                            backgroundColor: C.white,
                            paddingVertical: 10,
                            paddingHorizontal: 14,
                            shadowColor: C.ink,
                            shadowOpacity: 0.04,
                            shadowRadius: 1,
                            shadowOffset: { width: 0, height: 1 },
                            elevation: 1,
                          },
                        ]}
                      >
                        <Text style={T(15, '400', C.ink, { lineHeight: 21.75 })}>{m.text}</Text>
                      </View>
                    )}
                    {last && (
                      <Text style={[T(11, '400', C.muted), { paddingBottom: 2 }]}>
                        {fmtClock(m.min)}
                      </Text>
                    )}
                  </View>
                </View>
              </MsgIn>
            );
          }
          return (
            <MsgIn
              key={'m' + m.id}
              on={isFresh}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                gap: 6,
                marginTop: mt,
              }}
            >
              <View style={{ alignItems: 'flex-end', gap: 1, paddingBottom: 2 }}>
                {!!m.unread && <Text style={T(11, '800', accent)}>1</Text>}
                {last && <Text style={T(11, '400', C.muted)}>{fmtClock(m.min)}</Text>}
              </View>
              {m.deleted ? (
                <DeletedBubble first={first} swap={m.id === swapped} />
              ) : (
                <MyBubble
                  text={m.text ?? ''}
                  accent={accent}
                  first={first}
                  onLongPress={() => openMsgMenu(m.id)}
                  disabled={left}
                />
              )}
            </MsgIn>
          );
        })}
      </ScrollView>

      {/* 입력 */}
      <KeyboardStickyView
        offset={{ opened: Math.max(bottomInset - 6, 0) }}
        style={{ backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.lineSoft }}
      >
        {left ? (
          <Text
            style={[
              T(14, '600', C.muted, { textAlign: 'center' }),
              { paddingTop: 14, paddingHorizontal: 16, paddingBottom: 32 },
            ]}
          >
            나간 채팅방이에요. 메시지를 보낼 수 없어요.
          </Text>
        ) : (
          <Composer
            value={draft}
            onChange={setDraft}
            onSend={send}
            empty={empty}
            accent={accent}
            placeholder={
              scenario === '문의' ? '팀장에게 궁금한 점을 물어보세요' : '답장을 입력하세요'
            }
            bottomInset={bottomInset}
          />
        )}
      </KeyboardStickyView>

      <Toast text={toast.text} bottom={sheet === 'more' ? 196 : 96} />

      {sheet && <Dim onPress={() => setSheet(null)} />}

      {sheet === 'more' && (
        <Sheet label="채팅방 메뉴">
          <SheetRow
            icon={<BellIcon />}
            label="채팅방 알림"
            role="switch"
            checked={!muted}
            onPress={() => {
              const m = !muted;
              setMuted(m);
              onMuteChange?.(m);
              toast.show(m ? '이 채팅방 알림을 껐어요' : '이 채팅방 알림을 켰어요');
            }}
            right={<Switch on={!muted} accent={accent} />}
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

      {sheet === 'msg' && (
        <Sheet label="메시지 메뉴">
          <SheetRow
            icon={<CopyIcon />}
            label="복사하기"
            onPress={() => {
              onCopy?.(targetMsg?.text ?? '');
              setSheet(null);
              toast.show('메시지를 복사했어요');
            }}
          />
          <SheetRow icon={<TrashIcon />} label="삭제하기" danger onPress={() => setSheet('del')} />
        </Sheet>
      )}

      {(sheet === 'leave' || sheet === 'del') && (
        <ConfirmDialog
          title={sheet === 'del' ? '메시지를 삭제할까요?' : '채팅방을 나갈까요?'}
          body={
            sheet === 'del'
              ? partner + "님 화면에서도 '삭제된 메시지예요'로 바뀌어요."
              : '나가면 대화 내용이 내 채팅 목록에서 사라지고, 다시 볼 수 없어요.'
          }
          okLabel={sheet === 'del' ? '삭제' : '나가기'}
          onCancel={() => setSheet(null)}
          onOk={() => {
            if (sheet === 'del') {
              setMsgs((cur) => cur.map((m) => (m.id === target ? { ...m, deleted: true } : m)));
              setSwapped(target);
              setFresh(-1);
              setSheet(null);
              onDelete?.(target);
              return;
            }
            setSheet(null);
            setLeft(true);
            setDraft('');
            push([{ who: 'sys', text: '채팅방을 나갔어요' }]);
            onLeave?.();
          }}
        />
      )}
    </View>
  );
}

/* ───────── 조각 */

/** 말풍선 모서리 — 묶음 첫 말풍선만 상대 쪽 위 모서리가 뾰족(6) */
const bubbleR = (mine: boolean, first: boolean) =>
  first
    ? mine
      ? {
          borderTopLeftRadius: 18,
          borderTopRightRadius: 6,
          borderBottomRightRadius: 18,
          borderBottomLeftRadius: 18,
        }
      : {
          borderTopLeftRadius: 6,
          borderTopRightRadius: 18,
          borderBottomRightRadius: 18,
          borderBottomLeftRadius: 18,
        }
    : { borderRadius: 18 };

/** 새 메시지 등장 — msgIn .3s (아래에서 10px, 96% → 100%) */
function MsgIn({ on, style, children }: { on: boolean; style: object; children: React.ReactNode }) {
  const v = useEnter(300, EASE.out, 0, on);
  return (
    <Animated.View
      style={[
        style,
        on
          ? {
              opacity: v,
              transform: [
                { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
                { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
              ],
            }
          : null,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** 이름 옆 알림 꺼짐 — dlgIn .24s */
function MutedMark() {
  const v = useEnter(240);
  return (
    <Animated.View
      accessibilityLabel="알림 꺼짐"
      style={{
        opacity: v,
        transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }],
      }}
    >
      <BellOffIcon size={15} />
    </Animated.View>
  );
}

/** 내 말풍선 — 길게(0.45초) 누르면 메시지 메뉴. 누르는 동안 96% + 살짝 어둡게 (.18s) */
function MyBubble({
  text,
  accent,
  first,
  onLongPress,
  disabled,
}: {
  text: string;
  accent: string;
  first: boolean;
  onLongPress: () => void;
  disabled: boolean;
}) {
  const [p] = useState(() => new Animated.Value(0));
  const to = (v: number) =>
    Animated.timing(p, {
      toValue: v,
      duration: 180,
      easing: EASE.out,
      useNativeDriver: true,
    }).start();
  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={450}
      disabled={disabled}
      onPressIn={() => to(1)}
      onPressOut={() => to(0)}
      style={{ maxWidth: 250 }}
    >
      <Animated.View
        style={[
          bubbleR(true, first),
          {
            backgroundColor: accent,
            paddingVertical: 10,
            paddingHorizontal: 14,
            overflow: 'hidden',
            transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [1, 0.96] }) }],
          },
        ]}
      >
        <Text style={T(15, '400', C.white, { lineHeight: 21.75 })}>{text}</Text>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: C.ink,
            opacity: p.interpolate({ inputRange: [0, 1], outputRange: [0, 0.08] }),
          }}
        />
      </Animated.View>
    </Pressable>
  );
}

/** 삭제된 메시지 — delSwap .3s */
function DeletedBubble({ first, swap }: { first: boolean; swap: boolean }) {
  const v = useEnter(300, EASE.out, 0, swap);
  return (
    <Animated.View
      style={[
        bubbleR(true, first),
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.line,
          paddingVertical: 9,
          paddingHorizontal: 13,
        },
        swap
          ? {
              opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }),
              transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }],
            }
          : null,
      ]}
    >
      <DeletedIcon />
      <Text style={T(14, '400', C.muted, { lineHeight: 20.3 })}>삭제된 메시지예요</Text>
    </Animated.View>
  );
}

/** 팀 합류 제안 카드 */
function OfferCard({
  accent,
  first,
  state,
  onAccept,
  onDecline,
}: {
  accent: string;
  first: boolean;
  state: 'pending' | 'accepted' | 'declined';
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <View
      style={[
        bubbleR(false, first),
        {
          width: 252,
          backgroundColor: C.white,
          overflow: 'hidden',
          shadowColor: C.ink,
          shadowOpacity: 0.04,
          shadowRadius: 1,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        },
      ]}
    >
      <View style={{ backgroundColor: accent, paddingVertical: 14, paddingHorizontal: 16, gap: 4 }}>
        <Text style={T(12, '700', C.white)}>팀 합류 제안</Text>
        <Text style={T(18, '800', C.white, { letterSpacing: -0.3 })}>{OFFER_CARD.team}</Text>
      </View>
      <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 4, gap: 10 }}>
        <OfferDetailRow label="공모전">
          <Text style={[T(13, '600', C.ink, { lineHeight: 18.2 }), { flex: 1 }]}>
            {OFFER_CARD.contest}
          </Text>
        </OfferDetailRow>
        <OfferDetailRow label="포지션">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.brand }} />
            <Text style={T(13, '700', C.ink)}>{OFFER_CARD.position}</Text>
          </View>
        </OfferDetailRow>
        <OfferDetailRow label="팀 구성">
          <Text style={T(13, '600', C.ink)}>{OFFER_CARD.members}</Text>
        </OfferDetailRow>
        <OfferDetailRow label="활동">
          <Text style={T(13, '600', C.ink)}>{OFFER_CARD.activity}</Text>
        </OfferDetailRow>
      </View>
      <View style={{ padding: 12 }}>
        {state === 'pending' && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={onDecline}
              accessibilityRole="button"
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: C.line,
                backgroundColor: C.white,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={T(14, '700', C.body)}>거절하기</Text>
            </Pressable>
            <Pressable
              onPress={onAccept}
              accessibilityRole="button"
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                backgroundColor: accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={T(14, '700', C.white)}>수락하기</Text>
            </Pressable>
          </View>
        )}
        {state !== 'pending' && <OfferResult accepted={state === 'accepted'} />}
      </View>
    </View>
  );
}

function OfferDetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Text style={[T(13, '400', C.muted), { width: 44 }]}>{label}</Text>
      {children}
    </View>
  );
}

/** 수락/거절 결과 — popIn .35s (수락은 튀는 곡선, 거절은 ease). 키프레임 0→60→100% */
const POP_OP = (e: (t: number) => number) => bake([0, 60, 100], [0, 1, 1], e);
function OfferResult({ accepted }: { accepted: boolean }) {
  const e = accepted ? EASE.pop : EASE.ease;
  const v = useEnter(350, Easing.linear);
  return (
    <Animated.View
      style={{
        height: 44,
        borderRadius: 12,
        backgroundColor: accepted ? C.okTint : C.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        opacity: v.interpolate(POP_OP(e)),
        transform: [{ scale: v.interpolate(bake([0, 60, 100], [0.9, 1.04, 1], e)) }],
      }}
    >
      {accepted && <CheckIcon size={16} color={C.okText} />}
      <Text style={T(14, '700', accepted ? C.okText : C.secondary)}>
        {accepted ? '제안을 수락했어요' : '제안을 거절했어요'}
      </Text>
    </Animated.View>
  );
}

/** 입력창 + 보내기 — 글자가 있으면 테두리·버튼이 accent로 (.2s), 버튼 92% → 100% */
function Composer({
  value,
  onChange,
  onSend,
  empty,
  accent,
  placeholder,
  bottomInset,
}: {
  value: string;
  onChange: (s: string) => void;
  onSend: () => void;
  empty: boolean;
  accent: string;
  placeholder: string;
  bottomInset: number;
}) {
  const reduce = useReducedMotion();
  const on = useTween(empty ? 0 : 1, reduce ? 0 : 200, EASE.ease, false);
  const sc = useTween(empty ? 0 : 1, reduce ? 0 : 200, EASE.ease);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingTop: 10,
        paddingRight: 12,
        paddingBottom: bottomInset,
        paddingLeft: 16,
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          minWidth: 0,
          height: 44,
          borderRadius: 22,
          borderWidth: 1.5,
          borderColor: on.interpolate({ inputRange: [0, 1], outputRange: [C.surface, accent] }),
          backgroundColor: on.interpolate({
            inputRange: [0, 1],
            outputRange: [C.surface, C.white],
          }),
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSend}
          blurOnSubmit={false}
          returnKeyType="send"
          placeholder={placeholder}
          placeholderTextColor={C.placeholder}
          accessibilityLabel="메시지 입력"
          style={[T(15, '400', C.ink), { padding: 0 }]}
        />
      </Animated.View>
      <Pressable
        onPress={onSend}
        disabled={empty}
        accessibilityRole="button"
        accessibilityLabel="보내기"
      >
        <Animated.View
          style={{
            transform: [{ scale: sc.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
          }}
        >
          <Animated.View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: on.interpolate({
                inputRange: [0, 1],
                outputRange: [C.line, accent],
              }),
            }}
          >
            <SendIcon color={empty ? C.placeholder : C.white} />
          </Animated.View>
        </Animated.View>
      </Pressable>
    </View>
  );
}
