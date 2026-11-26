import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import {
  Animated,
  Easing,
  Keyboard,
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
import { BottomSheet, Toast, useToast } from '@/components/ui';
import { color as C, easing, role, text } from '@/theme';
import { ChatAvatar } from './ChatAvatar';
import { ChatConfirmDialog, ChatMenuDivider, ChatMenuRow, ChatSwitch } from './ChatMenu';
import { bake, useEnter, useReducedMotion, useTween } from './motion';
import { DAY_LABEL, OFFER_CARD, fmtClock, seedMessages } from './mocks';
import type { ChatMessage } from './mocks';

type Props = {
  partner?: string;
  partnerColor?: string;
  partnerTint?: string;
  scenario?: '문의' | '제안';
  accent?: string;
  initialMessages?: ChatMessage[];
  onBack?: () => void;
  onCopy?: (text: string) => void | Promise<unknown>;
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
  const [msgs, setMsgs] = useState<ChatMessage[]>(
    () => initialMessages ?? seedMessages(scenario, partner),
  );
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

  const push = (items: Partial<ChatMessage>[]) => {
    const d = new Date();
    const last = msgs.reduce((a, m) => Math.max(a, m.min), 0);
    const min = Math.max(d.getHours() * 60 + d.getMinutes(), last);
    let id = nextId;
    const added = items.map(
      (it) => ({ id: id++, kind: 'text', min, who: 'me', ...it }) as ChatMessage,
    );
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
      const same = (a?: ChatMessage) => !!a && a.who === m.who && a.min === m.min;
      return { m, first: !same(prev), last: !same(next) };
    });
  }, [msgs]);

  const empty = draft.trim() === '';
  const targetMsg = msgs.find((m) => m.id === target);

  const openMsgMenu = (id: number) => {
    if (left) return;
    Keyboard.dismiss();
    setTarget(id);
    setSheet('msg');
    if (Platform.OS === 'android') {
      void Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press);
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.surface }}>
      <View style={{ height: topInset }} />

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
        <ChatAvatar size={40} color={partnerColor} tint={partnerTint} />
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
          <Text numberOfLines={1} style={[text.titleMd, { color: C.ink, fontWeight: '700' }]}>
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

      <ScrollView
        ref={scroll}
        style={{ flex: 1, backgroundColor: C.surfaceMuted }}
        contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 16, paddingBottom: 16 }}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 6 }}>
          <View
            style={{
              backgroundColor: C.line,
              borderRadius: 999,
              paddingVertical: 5,
              paddingHorizontal: 12,
            }}
          >
            <Text style={[text.meta, { color: C.textSecondary, fontWeight: '600' }]}>
              {DAY_LABEL}
            </Text>
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
                    backgroundColor: C.lineSoft,
                    borderRadius: 10,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text
                    style={[
                      text.meta,
                      { color: C.textSecondary, fontWeight: '400', textAlign: 'center' },
                    ]}
                  >
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
                  <ChatAvatar size={36} color={partnerColor} tint={partnerTint} />
                ) : (
                  <View style={{ width: 36 }} />
                )}
                <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
                  {first && (
                    <Text
                      style={[text.caption, { color: C.ink, fontWeight: '700', paddingLeft: 2 }]}
                    >
                      {partner}
                    </Text>
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
                            backgroundColor: C.surface,
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
                        <Text style={[text.label, { color: C.ink, fontWeight: '400' }]}>
                          {m.text}
                        </Text>
                      </View>
                    )}
                    {last && (
                      <Text
                        style={[
                          text.badge,
                          { color: C.textMuted, fontWeight: '400', paddingBottom: 2 },
                        ]}
                      >
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
                {!!m.unread && <Text style={[text.badge, { color: accent }]}>1</Text>}
                {last && (
                  <Text style={[text.badge, { color: C.textMuted, fontWeight: '400' }]}>
                    {fmtClock(m.min)}
                  </Text>
                )}
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

      <KeyboardStickyView
        offset={{ opened: Math.max(bottomInset - 6, 0) }}
        style={{ backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.lineSoft }}
      >
        {left ? (
          <Text
            style={[
              text.body,
              { color: C.textMuted, fontWeight: '600', textAlign: 'center' },
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

      <Toast {...toast.props} bottom={sheet === 'more' ? 196 : 96} />

      <BottomSheet
        visible={sheet === 'more'}
        onClose={() => setSheet(null)}
        accessibilityLabel="채팅방 메뉴"
      >
        <ChatMenuRow
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
          right={<ChatSwitch on={!muted} accent={accent} />}
        />
        <ChatMenuDivider />
        <ChatMenuRow
          icon={<LeaveIcon />}
          label="채팅방 나가기"
          danger
          onPress={() => setSheet('leave')}
        />
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'msg'}
        onClose={() => setSheet(null)}
        accessibilityLabel="메시지 메뉴"
      >
        <ChatMenuRow
          icon={<CopyIcon />}
          label="복사하기"
          onPress={async () => {
            try {
              await onCopy?.(targetMsg?.text ?? '');
              setSheet(null);
              toast.show('메시지를 복사했어요');
            } catch {
              toast.show('메시지를 복사하지 못했어요');
            }
          }}
        />
        <ChatMenuRow icon={<TrashIcon />} label="삭제하기" danger onPress={() => setSheet('del')} />
      </BottomSheet>

      <ChatConfirmDialog
        visible={sheet === 'leave' || sheet === 'del'}
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
    </View>
  );
}

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

function MsgIn({ on, style, children }: { on: boolean; style: object; children: React.ReactNode }) {
  const v = useEnter(300, easing.out, 0, on);
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

const MESSAGE_MENU_ACCESSIBILITY_ACTIONS = [{ name: 'openMenu', label: '메시지 메뉴 열기' }];

function MyBubble({
  text: message,
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
      easing: easing.out,
      useNativeDriver: true,
    }).start();
  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={450}
      disabled={disabled}
      onPressIn={() => to(1)}
      onPressOut={() => to(0)}
      accessible
      accessibilityLabel={message}
      accessibilityHint="추가 메뉴에서 메시지를 복사하거나 삭제할 수 있습니다"
      accessibilityActions={MESSAGE_MENU_ACCESSIBILITY_ACTIONS}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'openMenu') onLongPress();
      }}
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
        <Text style={[text.label, { color: C.surface, fontWeight: '400' }]}>{message}</Text>
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

function DeletedBubble({ first, swap }: { first: boolean; swap: boolean }) {
  const v = useEnter(300, easing.out, 0, swap);
  return (
    <Animated.View
      style={[
        bubbleR(true, first),
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: C.surface,
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
      <Text style={[text.body, { color: C.textMuted, fontWeight: '400' }]}>삭제된 메시지예요</Text>
    </Animated.View>
  );
}

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
          backgroundColor: C.surface,
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
        <Text style={[text.meta, { color: C.surface }]}>팀 합류 제안</Text>
        <Text style={[text.titleLg, { color: C.surface, fontSize: 18 }]}>{OFFER_CARD.team}</Text>
      </View>
      <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 4, gap: 10 }}>
        <OfferDetailRow label="공모전">
          <Text style={[text.caption, { color: C.ink, flex: 1 }]}>{OFFER_CARD.contest}</Text>
        </OfferDetailRow>
        <OfferDetailRow label="포지션">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.brand }} />
            <Text style={[text.caption, { color: C.ink, fontWeight: '700' }]}>
              {OFFER_CARD.position}
            </Text>
          </View>
        </OfferDetailRow>
        <OfferDetailRow label="팀 구성">
          <Text style={[text.caption, { color: C.ink }]}>{OFFER_CARD.members}</Text>
        </OfferDetailRow>
        <OfferDetailRow label="활동">
          <Text style={[text.caption, { color: C.ink }]}>{OFFER_CARD.activity}</Text>
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
                backgroundColor: C.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={[text.bodyStrong, { color: C.textBody }]}>거절하기</Text>
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
              <Text style={[text.bodyStrong, { color: C.surface }]}>수락하기</Text>
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
      <Text style={[text.caption, { width: 44, color: C.textMuted, fontWeight: '400' }]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

const POP_OP = (e: (t: number) => number) => bake([0, 60, 100], [0, 1, 1], e);
function OfferResult({ accepted }: { accepted: boolean }) {
  const e = accepted ? easing.spring : easing.inOut;
  const v = useEnter(350, Easing.linear);
  return (
    <Animated.View
      style={{
        height: 44,
        borderRadius: 12,
        backgroundColor: accepted ? C.successTint : C.surfaceMuted,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        opacity: v.interpolate(POP_OP(e)),
        transform: [{ scale: v.interpolate(bake([0, 60, 100], [0.9, 1.04, 1], e)) }],
      }}
    >
      {accepted && <CheckIcon size={16} color={role.plan.text} />}
      <Text style={[text.bodyStrong, { color: accepted ? role.plan.text : C.textSecondary }]}>
        {accepted ? '제안을 수락했어요' : '제안을 거절했어요'}
      </Text>
    </Animated.View>
  );
}

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
  const on = useTween(empty ? 0 : 1, reduce ? 0 : 200, easing.inOut, false);
  const sc = useTween(empty ? 0 : 1, reduce ? 0 : 200, easing.inOut);
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
          borderColor: on.interpolate({
            inputRange: [0, 1],
            outputRange: [C.surfaceMuted, accent],
          }),
          backgroundColor: on.interpolate({
            inputRange: [0, 1],
            outputRange: [C.surfaceMuted, C.surface],
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
          placeholderTextColor={C.textFaint}
          accessibilityLabel="메시지 입력"
          style={[text.label, { color: C.ink, fontWeight: '400', padding: 0 }]}
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
            <SendIcon color={empty ? C.textFaint : C.surface} />
          </Animated.View>
        </Animated.View>
      </Pressable>
    </View>
  );
}
