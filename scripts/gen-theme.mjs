#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'src/theme');
mkdirSync(out, { recursive: true });

const tokens = JSON.parse(readFileSync(resolve(root, 'tokens.json'), 'utf8'));
const BANNER = '';
const HEADER = BANNER ? `${BANNER}\n` : '';

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const px = (v) => (typeof v === 'string' ? parseFloat(v) : v);
const first = (val) => (typeof val === 'string' ? val : val[Object.keys(val)[0]]);

const ROLE_RE = /^role-(dev|design|plan|mkt)(?:-(tint|text|bold))?$/;
const flat = [];
const roles = { dev: {}, design: {}, plan: {}, mkt: {} };

for (const t of tokens.color.tokens) {
  const value = first(t.value);
  flat.push([camel(t.name), value, t.usage]);
  const m = ROLE_RE.exec(t.name);
  if (m) roles[m[1]][m[2] ?? 'base'] = value;
}

const groupOf = (key) => {
  if (key.startsWith('brand')) return 0;
  if (key === 'ink' || key.startsWith('text')) return 1;
  if (key.startsWith('surface')) return 2;
  if (key.startsWith('line')) return 3;
  if (key.startsWith('role')) return 4;
  if (['danger', 'alert', 'pending', 'highlight'].some((name) => key.startsWith(name))) return 5;
  if (key.startsWith('day')) return 6;
  return 7;
};

const colorBody = Object.values(
  flat.reduce((groups, token) => {
    const group = groupOf(token[0]);
    (groups[group] ??= []).push(token);
    return groups;
  }, {}),
)
  .map((group) => group.map(([key, value]) => `  ${key}: '${value}',`).join('\n'))
  .join('\n\n');

const roleBody = Object.entries(roles)
  .map(
    ([k, v]) =>
      `  ${k}: {\n${['base', 'tint', 'text', 'bold']
        .filter((s) => v[s])
        .map((s) => `    ${s}: '${v[s]}',`)
        .join('\n')}\n  },`,
  )
  .join('\n\n');

writeFileSync(
  resolve(out, 'colors.ts'),
  `${HEADER}export const color = {
${colorBody}
} as const;

export const role = {
${roleBody}
} as const;

export type ColorToken = keyof typeof color;
export type RoleName = keyof typeof role;
`,
);

const styles = tokens.type.groups.flatMap((g) => g.styles.map((s) => ({ ...s, group: g.name })));
const typeBody = styles
  .map((s) => {
    const w = typeof s.fontWeight === 'number' ? s.fontWeight : 400;
    const ls = s.letterSpacing ? `\n    letterSpacing: ${px(s.letterSpacing)},` : '';
    return `  ${camel(s.name)}: {
    fontWeight: '${w}',
    fontSize: ${px(s.fontSize)},
    lineHeight: ${px(s.lineHeight)},${ls}
  },`;
  })
  .join('\n');

writeFileSync(
  resolve(out, 'typography.ts'),
  `${HEADER}import type { TextStyle } from 'react-native';

export const text = {
${typeBody}
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof text;
`,
);

const spaceBody = tokens.spacing.tokens
  .map((t) => `  ${t.name.replace('space-', '')}: ${px(first(t.value))},`)
  .join('\n');
const radiusBody = tokens.radius.tokens
  .map((t) => {
    const k = t.name.replace('radius-', '');
    const key = /^[a-z][a-z0-9]*$/.test(k) ? k : `'${k}'`;
    return `  ${key}: ${px(first(t.value))},`;
  })
  .join('\n');

writeFileSync(
  resolve(out, 'layout.ts'),
  `${HEADER}export const space = {
${spaceBody}
} as const;

export const radius = {
${radiusBody}
} as const;

export const HIT_SLOP_44 = (size: number) => {
  const pad = Math.max(0, Math.round((44 - size) / 2));
  return { top: pad, bottom: pad, left: pad, right: pad };
};

export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;
`,
);

const LAYER = /(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+([\d.]+)(?:px)?\s+(rgba?\([^)]*\))/g;
const mk = (t) => {
  const value = first(t.value);
  const layers = [...value.matchAll(LAYER)].map((m) => ({
    x: +m[1],
    y: +m[2],
    blur: +m[3],
    color: m[4],
  }));
  const big = layers.length
    ? layers[layers.length - 1]
    : { x: 0, y: 1, blur: 2, color: 'rgba(0,0,0,0.05)' };
  return { key: camel(t.name.replace('shadow-', '')), usage: t.usage, value, big };
};
const shadows = tokens.shadow.tokens.map(mk);

const shadowBody = shadows.map((s) => `  ${s.key}: { boxShadow: '${s.value}' },`).join('\n');

const compatBody = shadows
  .map(
    (s) =>
      `  ${s.key}: {
    shadowColor: '${s.big.color}',
    shadowOffset: { width: ${s.big.x}, height: ${s.big.y} },
    shadowOpacity: 1,
    shadowRadius: ${(s.big.blur / 2).toFixed(1)},
    elevation: ${Math.max(1, Math.round(s.big.blur / 3))},
  },`,
  )
  .join('\n');

writeFileSync(
  resolve(out, 'shadows.ts'),
  `${HEADER}import type { ViewStyle } from 'react-native';

export const shadow = {
${shadowBody}
} as const satisfies Record<string, ViewStyle>;

export const shadowCompat = {
${compatBody}
} as const satisfies Record<string, ViewStyle>;

export type ShadowToken = keyof typeof shadow;
`,
);

const n = (f) => readFileSync(resolve(out, f), 'utf8').split('\n').length;
console.log('theme 생성 완료');
for (const f of ['colors.ts', 'typography.ts', 'layout.ts', 'shadows.ts']) {
  console.log(`  src/theme/${f.padEnd(16)} ${n(f)}줄`);
}
console.log(
  `  색 ${flat.length} · 글자 ${styles.length} · 간격 ${tokens.spacing.tokens.length} · 모서리 ${tokens.radius.tokens.length} · 그림자 ${tokens.shadow.tokens.length}`,
);
