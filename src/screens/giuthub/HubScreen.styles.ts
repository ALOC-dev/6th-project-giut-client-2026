import { StyleSheet } from 'react-native';

import { color, radius, space, text } from '@/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surface,
  },
  fill: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space[4],
    paddingBottom: space[5],
  },
  emptyContent: {
    flexGrow: 1,
  },
  column: {
    justifyContent: 'space-between',
    marginBottom: space[6],
  },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 10,
    paddingHorizontal: space[4],
    backgroundColor: color.surfaceHeader,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.lineSoft,
  },
  titleRow: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    marginBottom: space[2],
    justifyContent: 'flex-start',
  },
  titleIcon: {
    width: 30,
    height: 26,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingBottom: space[3],
  },
  search: {
    flex: 1,
    minWidth: 0,
    height: 46,
    position: 'relative',
    borderRadius: radius.full,
  },
  searchGlass: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.full,
  },
  searchFallback: {
    backgroundColor: color.surfaceGlassFallback,
  },
  searchHighlight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: color.surfaceGlassBorder,
  },
  searchContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[3],
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    ...text.label,
    color: color.ink,
  },
});
