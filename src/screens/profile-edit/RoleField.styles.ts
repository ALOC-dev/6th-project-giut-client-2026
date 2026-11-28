import { StyleSheet } from 'react-native';

import { color, radius, space } from '@/theme';

export const S = StyleSheet.create({
  wrap: {
    gap: space[3],
  },
  primaryRow: {
    flexDirection: 'row',
    gap: space[2],
  },
  primary: {
    flex: 1,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
    borderWidth: 1.5,
    borderColor: color.line,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    backgroundColor: color.surface,
  },
  // 3개를 다 골랐을 때 더 고를 수 없는 버튼
  disabled: {
    opacity: 0.4,
  },
  panel: {
    gap: space[3],
    padding: space[4],
    borderRadius: radius.xl,
    borderCurve: 'continuous',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  chip: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: space[3.5],
    borderWidth: 1,
    borderRadius: radius.full,
    backgroundColor: color.surface,
  },
});
