import { StyleSheet } from 'react-native';

import { color, radius, space } from '@/theme';

export const S = StyleSheet.create({
  section: {
    paddingTop: space[6],
    gap: space[3],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space[4],
  },
  list: {
    paddingHorizontal: space[4],
    gap: space[3],
  },
  card: {
    height: 230,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: color.overlayDim,
  },
  fallbackSymbol: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    opacity: 0.35,
  },
  content: {
    ...StyleSheet.absoluteFill,
    padding: space[5],
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  badgeFallback: {
    backgroundColor: color.surface,
  },
  ddayRow: {
    flexDirection: 'row',
    gap: space[1],
  },
  ddayBox: {
    minWidth: 45,
    paddingVertical: space[3],
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  ddayBoxFallback: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  ddayDash: {
    minWidth: 24,
  },
  ddayLineWrap: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
  ddayLine: {
    height: 1.5,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  ddayLineFallback: {
    backgroundColor: color.line,
  },

  bottom: {
    gap: space[1],
  },
  ddayText: {
    fontSize: 38,
    lineHeight: 42,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
