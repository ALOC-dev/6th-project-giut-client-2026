import { StyleSheet } from 'react-native';

import { color, radius, space, text } from '@/theme';

export const S = StyleSheet.create({
  wrap: {
    gap: space[3],
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  chip: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    paddingHorizontal: space[3.5],
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.full,
    backgroundColor: color.surface,
  },
  // 검은색 대신 연한 파랑 배경 + 파란 테두리 + 체크
  chipSelected: {
    borderColor: color.brand,
    backgroundColor: color.brandTint,
  },
  moreChip: {
    borderColor: color.surfaceMuted,
    backgroundColor: color.surfaceMuted,
  },
  addChip: {
    borderStyle: 'dashed',
    borderColor: color.brandBorder,
  },
  disabled: {
    opacity: 0.4,
  },
  addRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: space[4],
    borderWidth: 1,
    borderColor: color.brand,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
  },
  // 한 줄 입력 칸에 lineHeight를 주면 iOS에서 글자가 아래로 붙어서 크기와 굵기만 써요
  addInput: {
    flex: 1,
    fontSize: text.body.fontSize,
    fontWeight: text.body.fontWeight,
    paddingVertical: space[3],
    color: color.ink,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  addAction: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: space[3],
  },
});
