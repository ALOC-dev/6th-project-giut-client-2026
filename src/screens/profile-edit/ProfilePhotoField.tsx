import { Image, StyleSheet, View } from 'react-native';

import { PersonSilhouetteIcon } from '@/components/icons';
import { Press, Text } from '@/components/ui';
import { color, radius, space } from '@/theme';

const PHOTO = 96;
// 프로필 카드와 같은 비율 (원 52, 아이콘 44)
const PHOTO_ICON = (PHOTO * 44) / 52;

type ProfilePhotoFieldProps = {
  imageUrl: string | null;
  onPressEdit: () => void;
};

export function ProfilePhotoField({ imageUrl, onPressEdit }: ProfilePhotoFieldProps) {
  return (
    <View style={S.wrap}>
      <View style={S.photo} accessible accessibilityRole="image" accessibilityLabel="프로필 사진">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={S.image} />
        ) : (
          <PersonSilhouetteIcon color={color.textDisabled} style={S.icon} />
        )}
      </View>

      <Press
        onPress={onPressEdit}
        accessibilityRole="button"
        accessibilityLabel="프로필 사진 편집"
        style={S.editButton}
      >
        <Text variant="caption" color="brand">
          프로필 사진 편집
        </Text>
      </Press>
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: space[1],
  },
  photo: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.surfaceMuted,
  },
  image: {
    width: PHOTO,
    height: PHOTO,
  },
  icon: {
    width: PHOTO_ICON,
    height: PHOTO_ICON,
    overflow: 'visible',
  },
  editButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: space[2],
  },
});
