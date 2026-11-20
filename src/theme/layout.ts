
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
} as const;

export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export const HIT_SLOP_44 = (size: number) => {
  const pad = Math.max(0, Math.round((44 - size) / 2));
  return { top: pad, bottom: pad, left: pad, right: pad };
};

export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;
