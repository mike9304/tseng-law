/**
 * zh-hant monoline icon set (2026-10-02). Operator: 「대만페이지는 전체 색감을 다시 정했으니까 초록색 아이콘들
 * 이런거도 다 다시 디자인해야지 심플세련 느낌으로」.
 *
 * One line on a 24px grid, round caps and joins, no box, colour from `currentColor` only, so CSS decides
 * between neutral (#1d1d1f) and the action ink (#16382d). zh-hant only: zh components import it, and shared
 * components render it behind a `locale === 'zh-hant'` branch or an optional prop, so ko / ja / en markup
 * stays as it is.
 *
 * Optical sizing: the rendered stroke grows a little with the glyph (1.25px at 12px, 1.5px at 24px, 2px at
 * 48px) unless `strokePx` pins it. Play and pause are solid, like Apple's media controls. Practice and fee
 * glyphs are keyed by role (civil, family, criminal …), never by the object drawn.
 * Always decorative (aria-hidden): the link or button around it carries the accessible name.
 */
import type { ReactElement } from 'react';

const LINE = {
  'arrow-right': [<path key="a" d="M4.5 12h14.75M13.25 6l6 6-6 6" />],
  'arrow-left': [<path key="a" d="M19.5 12H4.75M10.75 6l-6 6 6 6" />],
  'arrow-up': [<path key="a" d="M12 19.5V4.75M6 10.75l6-6 6 6" />],
  'arrow-down': [<path key="a" d="M12 4.5v14.75M6 13.25l6 6 6-6" />],
  'arrow-up-right': [<path key="a" d="M6.5 17.5 17.25 6.75M8.5 6.75h8.75v8.75" />],
  replay: [<path key="a" d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />, <path key="b" d="M6.75 3v3.75h3.75" />],
  'chevron-right': [<path key="a" d="m9.5 5.5 6.5 6.5-6.5 6.5" />],
  'chevron-left': [<path key="a" d="M14.5 5.5 8 12l6.5 6.5" />],
  'chevron-down': [<path key="a" d="m5.5 8.75 6.5 6.5 6.5-6.5" />],
  check: [<path key="a" d="m5 12.75 4.5 4.5L19 7.25" />],
  close: [<path key="a" d="m6.5 6.5 11 11M17.5 6.5l-11 11" />],
  plus: [<path key="a" d="M12 5v14M5 12h14" />],
  minus: [<path key="a" d="M5 12h14" />],
  search: [<circle key="a" cx="10.75" cy="10.75" r="6.25" />, <path key="b" d="m15.25 15.25 4.75 4.75" />],
  globe: [<circle key="a" cx="12" cy="12" r="9" />, <ellipse key="b" cx="12" cy="12" rx="3.75" ry="9" />, <path key="c" d="M3 12h18" />],
  menu: [<path key="a" d="M4 7h16M4 12h16M4 17h16" />],
  copy: [<rect key="a" x="9" y="9" width="11" height="11" rx="2.5" />, <path key="b" d="M15.5 9V6.5A2.5 2.5 0 0 0 13 4H6.5A2.5 2.5 0 0 0 4 6.5V13a2.5 2.5 0 0 0 2.5 2.5H9" />],
  pencil: [<path key="a" d="M15.5 4.75a2.12 2.12 0 0 1 3 0l.75.75a2.12 2.12 0 0 1 0 3L9.5 18.25 4.5 19.5l1.25-5Z" />, <path key="b" d="m14 6.25 3.75 3.75" />],
  'play-rectangle': [<rect key="a" x="2.75" y="5" width="18.5" height="14" rx="3.5" />, <path key="b" d="M10.25 9.25 15 12l-4.75 2.75Z" />],
  // Practice areas (home #practice, /services) and fees (/pricing).
  civil: [<circle key="a" cx="12" cy="4.5" r="1.25" />, <path key="b" d="M12 5.75V20M8.5 20h7M5 8h14" />, <path key="c" d="M5 8 2.5 14.5a3.6 3.6 0 0 0 5 0Z" />, <path key="d" d="m19 8-2.5 6.5a3.6 3.6 0 0 0 5 0Z" />],
  family: [<circle key="a" cx="7.5" cy="7.75" r="2.75" />, <path key="b" d="M3 20v-1.5a4.5 4.5 0 0 1 9 0V20" />, <circle key="c" cx="17.5" cy="11.75" r="2" />, <path key="d" d="M14.75 20v-.75a2.75 2.75 0 0 1 5.5 0V20" />],
  criminal: [<path key="a" d="M12 3.25 18.75 5.75v5.5c0 4.35-2.85 7.65-6.75 9.5-3.9-1.85-6.75-5.15-6.75-9.5v-5.5Z" />],
  labor: [<rect key="a" x="3.5" y="7.5" width="17" height="12" rx="2.5" />, <path key="b" d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5" />, <path key="c" d="M3.5 12.5h17" />],
  ip: [<path key="a" d="M9.25 16.5c0-2.25-4-3.75-4-7.25a6.75 6.75 0 0 1 13.5 0c0 3.5-4 5-4 7.25Z" />, <path key="b" d="M9.75 19.25h4.5M10.75 21.5h2.5" />],
  company: [<path key="a" d="M4.5 20V5.5A1.5 1.5 0 0 1 6 4h5.5A1.5 1.5 0 0 1 13 5.5V20" />, <path key="b" d="M13 9.5h5a1.5 1.5 0 0 1 1.5 1.5v9" />, <path key="c" d="M3 20h18" />, <path key="d" d="M7.75 8h.01M10.25 8h.01M7.75 11.5h.01M10.25 11.5h.01M7.75 15h.01M10.25 15h.01M16.25 13h.01M16.25 16.5h.01" />],
  consultation: [<path key="a" d="M5.5 4h7A2.5 2.5 0 0 1 15 6.5v4a2.5 2.5 0 0 1-2.5 2.5H8l-2.5 2.75V13A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z" />, <path key="b" d="M15 8.5h3.5A2.5 2.5 0 0 1 21 11v4a2.5 2.5 0 0 1-2.5 2.5V20L16 17.5h-4a2.5 2.5 0 0 1-2.5-2.5v-2" />],
  retainer: [<path key="a" d="M8.5 4.75h-1A2.5 2.5 0 0 0 5 7.25V18.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V7.25a2.5 2.5 0 0 0-2.5-2.5h-1" />, <rect key="b" x="8.5" y="3" width="7" height="3.5" rx="1.25" />, <path key="c" d="m9 13.5 2.25 2.25L15.25 11.5" />],
} satisfies Record<string, ReactElement[]>;

/** Solid media glyphs: filled; the 1.5 stroke only rounds the corners. */
const SOLID = {
  play: [<path key="a" d="M8.25 5.75v12.5L18.5 12Z" />],
  pause: [<rect key="a" x="6.75" y="5.25" width="3.5" height="13.5" rx="0.5" />, <rect key="b" x="13.75" y="5.25" width="3.5" height="13.5" rx="0.5" />],
} satisfies Record<string, ReactElement[]>;

export type ZhHantMonoIconName = keyof typeof LINE | keyof typeof SOLID;

/** Rendered stroke (px) by render size (px), linear between the anchors. */
const OPTICAL: ReadonlyArray<readonly [number, number]> = [
  [12, 1.25], [14, 1.3], [16, 1.35], [18, 1.4], [20, 1.45], [24, 1.5], [28, 1.6], [32, 1.65], [40, 1.8], [48, 2], [56, 2.1],
];

export function zhMonoStrokePx(size: number): number {
  if (size <= OPTICAL[0][0]) return OPTICAL[0][1];
  for (let i = 1; i < OPTICAL.length; i += 1) {
    const [s1, p1] = OPTICAL[i];
    const [s0, p0] = OPTICAL[i - 1];
    if (size <= s1) return p0 + ((p1 - p0) * (size - s0)) / (s1 - s0);
  }
  return OPTICAL[OPTICAL.length - 1][1];
}

type Props = {
  name: ZhHantMonoIconName;
  /** Render size in px (width = height). Default 24. */
  size?: number;
  /** Rendered stroke in px; defaults to the optical value for the size. */
  strokePx?: number;
  className?: string;
};

export default function ZhHantMonoIcon({ name, size = 24, strokePx, className }: Props) {
  const solid = name in SOLID ? SOLID[name as keyof typeof SOLID] : null;
  const px = strokePx ?? zhMonoStrokePx(size);
  const strokeWidth = Math.round(((px * 24) / size) * 1000) / 1000;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={solid ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={solid ? 1.5 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ? `zh-mono ${className}` : 'zh-mono'}
      data-zh-icon={name}
      aria-hidden="true"
      focusable="false"
    >
      {solid ?? LINE[name as keyof typeof LINE]}
    </svg>
  );
}

/** ServicesBento / ServicePracticeIcon index → practice glyph (0 company setup, 1 civil, 2 family, 3 labour, 4 criminal, 5 IP and finance). */
export const ZH_PRACTICE_ICON: Readonly<Record<number, ZhHantMonoIconName>> = {
  0: 'company',
  1: 'civil',
  2: 'family',
  3: 'labor',
  4: 'criminal',
  5: 'ip',
};

/** /pricing fee rows (PricingIconName) → glyph. */
export const ZH_FEE_ICON = {
  consultation: 'consultation',
  litigation: 'civil',
  company: 'company',
  retainer: 'retainer',
} as const satisfies Record<string, ZhHantMonoIconName>;

/** DecorativeAutoplayVideo `controlIcons` for zh-hant: solid pause and play, an outline replay (14px, currentColor). */
export const ZH_VIDEO_CONTROL_ICONS = {
  pause: <ZhHantMonoIcon name="pause" size={14} />,
  play: <ZhHantMonoIcon name="play" size={14} />,
  replay: <ZhHantMonoIcon name="replay" size={14} strokePx={1.6} />,
};
