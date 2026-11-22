import { StyleSheet } from 'react-native';

import { color, radius, shadow, space } from '@/theme';

export const S = StyleSheet.create({
  card: {
    marginHorizontal: space[4],
    paddingHorizontal: space[5],
    paddingTop: space[5],
    paddingBottom: space[4],
    borderRadius: radius['2xl'],
    borderCurve: 'continuous',
    backgroundColor: color.surface,
    ...shadow.card,
  },

  top: {
    gap: space[1],
    paddingBottom: space[4],
  },
  host: {
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
    paddingVertical: space[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.line,
  },
  rowLast: {
    paddingBottom: 0,
  },
  label: {
    width: 64,
  },
  value: {
    flex: 1,
    alignItems: 'flex-end',
  },
  valueText: {
    fontWeight: '700',
    textAlign: 'right',
  },
  dday: {
    fontWeight: '800',
  },

  source: {
    alignItems: 'flex-end',
    gap: 2,
  },
});
