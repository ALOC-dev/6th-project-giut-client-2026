
export const space = {
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  4.5: 18,
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
