import { View } from 'react-native';

type ChatAvatarProps = {
  size: number;
  color: string;
  tint: string;
};

export function ChatAvatar({ size, color, tint }: ChatAvatarProps) {
  const head = Math.round(size * 0.33);
  const bodyWidth = Math.round(size * 0.58);

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
