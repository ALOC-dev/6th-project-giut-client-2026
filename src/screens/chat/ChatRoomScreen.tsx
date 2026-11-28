import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import {
  Animated,
  Easing,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  type ListRenderItem,
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
import {
  color as C,
  duration,
  easing,
  layout,
  radius,
  role,
  shadowCompat,
  space,
  text,
} from '@/theme';
import { ChatAvatar } from './ChatAvatar';
import { ChatConfirmDialog, ChatMenuDivider, ChatMenuRow, ChatSwitch } from './ChatMenu';
import { bake, useEnter, useReducedMotion, useTween } from './motion';
import { DAY_LABEL, OFFER_CARD, fmtClock, seedMessages } from './mocks';
import type { ChatField, ChatMessage } from './mocks';

type Props = {
  partner?: string;
  partnerField?: ChatField;
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

type SheetKind = null | 'more' | 'msg';
type ConfirmKind = null | 'leave' | 'del';
type MessageRow = { m: ChatMessage; first: boolean; last: boolean };

const READ_RECEIPT_DELAY_MS = 1800;
const CHAT_MESSAGE_MAX_LENGTH = 2000;

export default function ChatRoomScreen({
  partner = '박준호',
  partnerField = '기획',
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
  topInset = 0,
  bottomInset = 0,
}: Props) {
  const [msgs, setMsgs] = useState<ChatMessage[]>(
    () => initialMessages ?? seedMessages(scenario, partner),
  );
  const nextId = useRef(Math.max(0, ...msgs.map((message) => message.id)) + 1);
  const [fresh, setFresh] = useState(-1);
  const [swapped, setSwapped] = useState(-1);
  const [draft, setDraft] = useState('');
  const [offer, setOffer] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [confirm, setConfirm] = useState<ConfirmKind>(null);
  const pendingConfirm = useRef<ConfirmKind>(null);
  const [target, setTarget] = useState(-1);
  const [muted, setMuted] = useState(false);
  const [composerHeight, setComposerHeight] = useState(0);
  const toast = useToast();
  const handleSheetDismiss = useCallback(() => {
    setConfirm(pendingConfirm.current);
    pendingConfirm.current = null;
  }, [setConfirm]);
  const scroll = useRef<FlatList<MessageRow>>(null);
  const shouldScrollToEnd = useRef(true);
  const mountedRef = useRef(true);
  const readT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      mountedRef.current = false;
      clearTimeout(readT.current);
    },
    [],
  );

  const push = useCallback((items: Partial<ChatMessage>[]) => {
    const d = new Date();
    const currentMinute = d.getHours() * 60 + d.getMinutes();
    const drafts = items.map((item) => ({
      id: nextId.current++,
      kind: 'text' as const,
      who: 'me' as const,
      ...item,
    }));

    shouldScrollToEnd.current = true;
    setMsgs((current) => {
      const lastMinute = current.reduce((latest, message) => Math.max(latest, message.min), 0);
      const min = Math.max(currentMinute, lastMinute);
      const added = drafts.map((item) => ({ min, ...item }) as ChatMessage);
      return [...current, ...added];
    });
    setFresh(drafts[drafts.length - 1].id);
  }, []);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    push([{ who: 'me', text, unread: 1 }]);
    setDraft('');
    onSend?.(text);
    clearTimeout(readT.current);
    readT.current = setTimeout(
      () => setMsgs((cur) => cur.map((m) => (m.who === 'me' ? { ...m, unread: 0 } : m))),
      READ_RECEIPT_DELAY_MS,
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

  const openMsgMenu = useCallback((id: number) => {
    Keyboard.dismiss();
    setTarget(id);
    setSheet('msg');
    if (Platform.OS === 'android') {
      void Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press);
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleAccept = useCallback(() => {
    setOffer('accepted');
    push([
      {
        who: 'sys',
        text: `${OFFER_CARD.team} 팀에 합류했어요. 팀 채팅방에 초대됐어요.`,
      },
    ]);
    onAccept?.();
  }, [onAccept, push]);

  const handleDecline = useCallback(() => {
    setOffer('declined');
    push([
      {
        who: 'sys',
        text: '제안을 거절했어요. 대화는 계속 이어갈 수 있어요.',
      },
    ]);
    onDecline?.();
  }, [onDecline, push]);

  const renderMessage = useCallback<ListRenderItem<MessageRow>>(
    ({ item }) => (
      <ChatMessageRow
        message={item.m}
        first={item.first}
        last={item.last}
        isFresh={item.m.id === fresh}
        partner={partner}
        partnerField={partnerField}
        accent={accent}
        offer={offer}
        swapped={item.m.id === swapped}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onOpenMenu={openMsgMenu}
      />
    ),
    [
      accent,
      fresh,
      handleAccept,
      handleDecline,
      offer,
      openMsgMenu,
      partner,
      partnerField,
      swapped,
    ],
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.surface }}>
      <View style={{ height: topInset }} />

      <View
        style={{
          height: layout.appHeaderHeight,
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[1.5],
          paddingRight: space[2],
          paddingLeft: space[1.5],
          borderBottomWidth: 1,
          borderBottomColor: C.lineSoft,
        }}
      >
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          style={{
            width: layout.minimumTouchTargetSize,
            height: layout.minimumTouchTargetSize,
            borderRadius: radius.control,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronIcon size={24} dir="left" />
        </Pressable>
        <ChatAvatar size={40} field={partnerField} />
        <View
          style={{
            flex: 1,
            minWidth: 0,
            flexDirection: 'row',
            alignItems: 'center',
            gap: space[1.5],
            paddingLeft: space[1],
          }}
        >
          <Text numberOfLines={1} style={[text.titleMd, { color: C.ink, fontWeight: '700' }]}>
            {partner}
          </Text>
          {muted && <MutedMark />}
        </View>
        <Pressable
          onPress={() => setSheet('more')}
          accessibilityRole="button"
          accessibilityLabel="더보기"
          style={{
            width: layout.minimumTouchTargetSize,
            height: layout.minimumTouchTargetSize,
            borderRadius: radius.control,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MoreIcon />
        </Pressable>
      </View>

      <FlatList
        ref={scroll}
        data={rows}
        keyExtractor={(row) => String(row.m.id)}
        style={{ flex: 1, backgroundColor: C.surfaceMuted }}
        contentContainerStyle={{
          paddingTop: space[2],
          paddingHorizontal: space[4],
          paddingBottom: space[4],
        }}
        onContentSizeChange={() => {
          if (!shouldScrollToEnd.current) return;
          scroll.current?.scrollToEnd({ animated: false });
          shouldScrollToEnd.current = false;
        }}
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ alignItems: 'center', paddingTop: space[4], paddingBottom: space[1.5] }}>
            <View
              style={{
                backgroundColor: C.line,
                borderRadius: radius.full,
                paddingVertical: space[1],
                paddingHorizontal: space[3],
              }}
            >
              <Text style={[text.meta, { color: C.textSecondary, fontWeight: '600' }]}>
                {DAY_LABEL}
              </Text>
            </View>
          </View>
        }
        renderItem={renderMessage}
      />

      <KeyboardStickyView
        offset={{ opened: Math.max(bottomInset - 6, 0) }}
        onLayout={(event) => setComposerHeight(event.nativeEvent.layout.height)}
        style={{ backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.lineSoft }}
      >
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
      </KeyboardStickyView>

      <Toast
        {...toast.props}
        bottom={Math.max(composerHeight, layout.minimumTouchTargetSize) + space[3]}
      />

      <BottomSheet
        visible={sheet === 'more'}
        onClose={() => setSheet(null)}
        onDismiss={handleSheetDismiss}
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
            setSheet(null);
            toast.show(m ? '이 채팅방 알림을 껐어요' : '이 채팅방 알림을 켰어요');
          }}
          right={<ChatSwitch on={!muted} accent={accent} />}
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

      <BottomSheet
        visible={sheet === 'msg'}
        onClose={() => setSheet(null)}
        onDismiss={handleSheetDismiss}
        accessibilityLabel="메시지 메뉴"
      >
        <ChatMenuRow
          icon={<CopyIcon />}
          label="복사하기"
          onPress={async () => {
            if (!onCopy || !targetMsg?.text || targetMsg.deleted) {
              setSheet(null);
              toast.show('메시지를 복사하지 못했어요');
              return;
            }

            const message = targetMsg.text;
            setSheet(null);
            try {
              await onCopy(message);
              if (!mountedRef.current) return;
              toast.show('메시지를 복사했어요');
            } catch {
              if (!mountedRef.current) return;
              toast.show('메시지를 복사하지 못했어요');
            }
          }}
        />
        <ChatMenuRow
          icon={<TrashIcon />}
          label="삭제하기"
          danger
          onPress={() => {
            pendingConfirm.current = 'del';
            setSheet(null);
          }}
        />
      </BottomSheet>

      <ChatConfirmDialog
        visible={confirm === 'leave' || confirm === 'del'}
        title={confirm === 'del' ? '메시지를 삭제할까요?' : '채팅방을 나갈까요?'}
        body={
          confirm === 'del'
            ? partner + "님 화면에서도 '삭제된 메시지예요'로 바뀌어요."
            : '나가면 대화 내용이 내 채팅 목록에서 사라지고, 다시 볼 수 없어요.'
        }
        okLabel={confirm === 'del' ? '삭제' : '나가기'}
        onCancel={() => setConfirm(null)}
        onOk={() => {
          if (confirm === 'del') {
            setMsgs((cur) => cur.map((m) => (m.id === target ? { ...m, deleted: true } : m)));
            setSwapped(target);
            setFresh(-1);
            setConfirm(null);
            onDelete?.(target);
            return;
          }
          setConfirm(null);
          onLeave?.();
        }}
      />
    </View>
  );
}

type ChatMessageRowProps = {
  message: ChatMessage;
  first: boolean;
  last: boolean;
  isFresh: boolean;
  partner: string;
  partnerField: ChatField;
  accent: string;
  offer: 'pending' | 'accepted' | 'declined';
  swapped: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onOpenMenu: (id: number) => void;
};

const ChatMessageRow = React.memo(function ChatMessageRow({
  message,
  first,
  last,
  isFresh,
  partner,
  partnerField,
  accent,
  offer,
  swapped,
  onAccept,
  onDecline,
  onOpenMenu,
}: ChatMessageRowProps) {
  if (message.who === 'sys') {
    return (
      <MsgIn
        on={isFresh}
        style={{ alignItems: 'center', paddingTop: space[2.5], paddingBottom: space[0.5] }}
      >
        <View
          style={{
            backgroundColor: C.lineSoft,
            borderRadius: radius.lg,
            paddingVertical: space[1.5],
            paddingHorizontal: space[3],
          }}
        >
          <Text
            style={[text.meta, { color: C.textSecondary, fontWeight: '400', textAlign: 'center' }]}
          >
            {message.text}
          </Text>
        </View>
      </MsgIn>
    );
  }

  const marginTop = first ? space[3.5] : space[1];
  if (message.who !== 'me') {
    return (
      <MsgIn
        on={isFresh}
        style={{
          flexDirection: 'row',
          gap: space[2],
          alignItems: 'flex-start',
          marginTop,
        }}
      >
        {first ? <ChatAvatar size={36} field={partnerField} /> : <View style={{ width: 36 }} />}
        <View style={{ flex: 1, minWidth: 0, gap: space[1] }}>
          {first && (
            <Text
              style={[text.caption, { color: C.ink, fontWeight: '700', paddingLeft: space[0.5] }]}
            >
              {partner}
            </Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space[1.5] }}>
            {message.kind === 'offer' ? (
              <OfferCard
                accent={accent}
                first={first}
                state={offer}
                onAccept={onAccept}
                onDecline={onDecline}
              />
            ) : (
              <View
                style={[
                  bubbleR(false, first),
                  {
                    maxWidth: layout.chatIncomingMessageMaxWidth,
                    backgroundColor: C.surface,
                    paddingVertical: space[2.5],
                    paddingHorizontal: space[3.5],
                    ...shadowCompat.card,
                  },
                ]}
              >
                <Text style={[text.label, { color: C.ink, fontWeight: '400' }]}>
                  {message.text}
                </Text>
              </View>
            )}
            {last && (
              <Text
                style={[
                  text.badge,
                  { color: C.textMuted, fontWeight: '400', paddingBottom: space[0.5] },
                ]}
              >
                {fmtClock(message.min)}
              </Text>
            )}
          </View>
        </View>
      </MsgIn>
    );
  }

  return (
    <MsgIn
      on={isFresh}
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: space[1.5],
        marginTop,
      }}
    >
      <View style={{ alignItems: 'flex-end', gap: space[0.5], paddingBottom: space[0.5] }}>
        {!!message.unread && <Text style={[text.badge, { color: accent }]}>1</Text>}
        {last && (
          <Text style={[text.badge, { color: C.textMuted, fontWeight: '400' }]}>
            {fmtClock(message.min)}
          </Text>
        )}
      </View>
      {message.deleted ? (
        <DeletedBubble first={first} swap={swapped} />
      ) : (
        <MyBubble
          text={message.text ?? ''}
          accent={accent}
          first={first}
          onLongPress={() => onOpenMenu(message.id)}
        />
      )}
    </MsgIn>
  );
});

const bubbleR = (mine: boolean, first: boolean) =>
  first
    ? mine
      ? {
          borderTopLeftRadius: radius.bubble,
          borderTopRightRadius: radius.sm,
          borderBottomRightRadius: radius.bubble,
          borderBottomLeftRadius: radius.bubble,
        }
      : {
          borderTopLeftRadius: radius.sm,
          borderTopRightRadius: radius.bubble,
          borderBottomRightRadius: radius.bubble,
          borderBottomLeftRadius: radius.bubble,
        }
    : { borderRadius: radius.bubble };

function MsgIn({ on, style, children }: { on: boolean; style: object; children: React.ReactNode }) {
  const v = useEnter(duration.d3, easing.out, 0, on);
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
  const v = useEnter(duration.d2);
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
}: {
  text: string;
  accent: string;
  first: boolean;
  onLongPress: () => void;
}) {
  const [p] = useState(() => new Animated.Value(0));
  const to = (v: number) =>
    Animated.timing(p, {
      toValue: v,
      duration: duration.d1,
      easing: easing.out,
      useNativeDriver: true,
    }).start();
  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={450}
      onPressIn={() => to(1)}
      onPressOut={() => to(0)}
      accessible
      accessibilityLabel={message}
      accessibilityHint="추가 메뉴에서 메시지를 복사하거나 삭제할 수 있습니다"
      accessibilityActions={MESSAGE_MENU_ACCESSIBILITY_ACTIONS}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'openMenu') onLongPress();
      }}
      style={{ maxWidth: layout.chatMessageMaxWidth }}
    >
      <Animated.View
        style={[
          bubbleR(true, first),
          {
            backgroundColor: accent,
            paddingVertical: space[2.5],
            paddingHorizontal: space[3.5],
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
  const v = useEnter(duration.d3, easing.out, 0, swap);
  return (
    <Animated.View
      style={[
        bubbleR(true, first),
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[1.5],
          backgroundColor: C.surface,
          borderWidth: 1,
          borderColor: C.line,
          paddingVertical: space[2],
          paddingHorizontal: space[3],
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
          width: layout.chatOfferCardWidth,
          backgroundColor: C.surface,
          overflow: 'hidden',
          ...shadowCompat.card,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: accent,
          paddingVertical: space[3.5],
          paddingHorizontal: space[4],
          gap: space[1],
        }}
      >
        <Text style={[text.meta, { color: C.surface }]}>팀 합류 제안</Text>
        <Text style={[text.titleLg, { color: C.surface }]}>{OFFER_CARD.team}</Text>
      </View>
      <View
        style={{
          paddingTop: space[3.5],
          paddingHorizontal: space[4],
          paddingBottom: space[1],
          gap: space[2.5],
        }}
      >
        <OfferDetailRow label="공모전">
          <Text style={[text.caption, { color: C.ink, flex: 1 }]}>{OFFER_CARD.contest}</Text>
        </OfferDetailRow>
        <OfferDetailRow label="포지션">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[1] }}>
            <View
              style={{
                width: space[1.5],
                height: space[1.5],
                borderRadius: radius.full,
                backgroundColor: C.brand,
              }}
            />
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
      <View style={{ padding: space[3] }}>
        {state === 'pending' && (
          <View style={{ flexDirection: 'row', gap: space[2] }}>
            <Pressable
              onPress={onDecline}
              accessibilityRole="button"
              style={{
                flex: 1,
                height: layout.minimumTouchTargetSize,
                borderRadius: radius.control,
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
                height: layout.minimumTouchTargetSize,
                borderRadius: radius.control,
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
    <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
      <Text
        style={[
          text.caption,
          {
            width: layout.minimumTouchTargetSize,
            color: C.textMuted,
            fontWeight: '400',
          },
        ]}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

const POP_OP = (e: (t: number) => number) => bake([0, 60, 100], [0, 1, 1], e);
function OfferResult({ accepted }: { accepted: boolean }) {
  const e = accepted ? easing.spring : easing.inOut;
  const v = useEnter(duration.d4, Easing.linear);
  return (
    <Animated.View
      style={{
        height: layout.minimumTouchTargetSize,
        borderRadius: radius.control,
        backgroundColor: accepted ? C.successTint : C.surfaceMuted,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[1.5],
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
  const on = useTween(empty ? 0 : 1, reduce ? 0 : duration.d1, easing.inOut, false);
  const sc = useTween(empty ? 0 : 1, reduce ? 0 : duration.d1, easing.inOut);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[2],
        paddingTop: space[2.5],
        paddingRight: space[3],
        paddingBottom: bottomInset,
        paddingLeft: space[4],
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          minWidth: 0,
          height: layout.minimumTouchTargetSize,
          borderRadius: layout.minimumTouchTargetSize / 2,
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
          paddingHorizontal: space[4],
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSend}
          submitBehavior="submit"
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
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
              width: layout.minimumTouchTargetSize,
              height: layout.minimumTouchTargetSize,
              borderRadius: layout.minimumTouchTargetSize / 2,
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
