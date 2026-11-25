import { StyleSheet } from 'react-native';

import { color, radius, space } from '@/theme';

export const S = StyleSheet.create({
  frame: {
    aspectRatio: 4 / 3,
    marginHorizontal: space[4],
    borderRadius: radius['2xl'],
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: color.brandTint,
  },
  placeholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  counter: {
    position: 'absolute',
    right: space[3],
    bottom: space[3],
    paddingVertical: space[1],
    paddingHorizontal: space[2.5],
    borderRadius: radius.full,
    backgroundColor: 'rgba(25,27,32,0.55)',
  },
});
