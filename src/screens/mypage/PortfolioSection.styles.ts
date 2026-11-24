import { StyleSheet } from 'react-native';

import { color, radius, space } from '@/theme';

const THUMBNAIL = 52;
const CARD_RADIUS = radius['2xl'];
const CARD_BORDER = 1;

export const S = StyleSheet.create({
  section: {
    gap: space[3],
  },
  card: {
    borderWidth: CARD_BORDER,
    borderColor: color.lineSoft,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: color.brandTint,
  },
  // 카드에 overflow: hidden을 주면 그림자가 잘릴 수 있어서 이미지 모서리만 따로 둥글게
  cover: {
    width: '100%',
    aspectRatio: 2.4,
    borderTopLeftRadius: CARD_RADIUS - CARD_BORDER,
    borderTopRightRadius: CARD_RADIUS - CARD_BORDER,
    borderCurve: 'continuous',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  featuredBody: {
    padding: space[4],
    gap: space[1.5],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  badge: {
    paddingVertical: space[0.5],
    paddingHorizontal: space[2],
    borderRadius: radius.sm,
    backgroundColor: color.brand,
  },
  meta: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3.5],
    marginHorizontal: space[4],
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  thumbnail: {
    width: THUMBNAIL,
    height: THUMBNAIL,
    borderRadius: radius.lg,
  },
  rowTexts: {
    flex: 1,
    gap: space[0.5],
  },
  empty: {
    paddingVertical: space[8],
    alignItems: 'center',
  },
});
