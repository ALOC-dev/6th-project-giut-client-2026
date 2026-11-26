import { StyleSheet } from 'react-native';

import { color, radius, space } from '@/theme';

export const S = StyleSheet.create({
  section: {
    gap: space[3],
  },
  card: {
    borderWidth: 1,
    borderColor: color.lineSoft,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: space[1],
    paddingHorizontal: space[2],
    borderRadius: radius.sm,
  },
  row: {
    gap: space[1],
  },
  firstRow: {
    paddingTop: space[3],
  },
  dividedRow: {
    marginTop: space[2.5],
    paddingTop: space[2.5],
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  meta: {
    flexDirection: 'row',
  },
  organization: {
    flexShrink: 1,
  },
  toggle: {
    minHeight: 46,
    marginTop: space[2.5],
    marginBottom: -space[4], // 카드 아래 여백까지 버튼으로
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  empty: {
    paddingVertical: space[8],
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});
