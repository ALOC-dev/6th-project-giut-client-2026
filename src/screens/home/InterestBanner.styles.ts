import { StyleSheet } from 'react-native';

import { color, radius, space } from '@/theme';

export const S = StyleSheet.create({
  wrapper: {
    marginTop: space[6],
    marginHorizontal: space[4],
  },
  card: {
    gap: space[4],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  texts: {
    flex: 1,
    paddingLeft: space[1],
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.full,
    backgroundColor: color.brand,
  },
  toggleButtonExpanded: {
    backgroundColor: color.surfaceMuted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  submit: {
    height: 48,
    borderRadius: radius.md,
  },
});
