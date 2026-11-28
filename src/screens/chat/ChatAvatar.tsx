import { View } from 'react-native';
import { role } from '@/theme';
import type { ChatField } from './mocks';

type ChatAvatarProps = {
  size: number;
  field: ChatField;
};

const FIELD_COLOR: Record<ChatField, { color: string; tint: string }> = {
  개발: { color: role.dev.base, tint: role.dev.tint },
  디자인: { color: role.design.base, tint: role.design.tint },
  기획: { color: role.plan.base, tint: role.plan.tint },
  마케팅: { color: role.mkt.base, tint: role.mkt.tint },
};

export function ChatAvatar({ size, field }: ChatAvatarProps) {
  const head = Math.round(size * 0.33);
  const bodyWidth = Math.round(size * 0.58);
  const { color, tint } = FIELD_COLOR[field];

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
          width: bodyWidth,
          height: bodyWidth / 2,
          marginTop: size >= 50 ? 3 : 2,
          borderTopLeftRadius: bodyWidth / 2,
          borderTopRightRadius: bodyWidth / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
