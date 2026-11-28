import { StyleSheet } from 'react-native';

import { color, radius, space, text } from '@/theme';

const COLLEGE_COLUMN = 104;

export const S = StyleSheet.create({
  // 단과대 열이 시트 왼쪽 끝에 붙도록 기본 좌우 여백을 없애요
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
  },
  headerTexts: {
    gap: space[0.5],
  },
  closeButton: {
    width: 44,
    height: 44,
    marginTop: -space[2],
    marginRight: -space[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    marginTop: space[3],
    marginHorizontal: space[5],
    marginBottom: space[3],
    paddingHorizontal: space[3.5],
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
  },
  // 한 줄 입력 칸에 lineHeight를 주면 iOS에서 글자가 아래로 붙어서 크기와 굵기만 써요
  searchInput: {
    flex: 1,
    fontSize: text.body.fontSize,
    fontWeight: text.body.fontWeight,
    paddingVertical: space[3],
    color: color.ink,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  colleges: {
    width: COLLEGE_COLUMN,
    flexGrow: 0,
    backgroundColor: color.surfaceSunken,
  },
  college: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: space[3],
  },
  collegeSelected: {
    backgroundColor: color.surface,
  },
  collegeTextSelected: {
    fontWeight: '800',
  },
  departments: {
    flex: 1,
  },
  department: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[4],
    borderBottomWidth: 1,
    borderBottomColor: color.lineSoft,
  },
  departmentSelected: {
    backgroundColor: color.brandSoft,
  },
  departmentName: {
    flex: 1,
  },
  noResult: {
    paddingVertical: space[8],
    textAlign: 'center',
  },
});
