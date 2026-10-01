import { Inter_Tight, IBM_Plex_Mono } from 'next/font/google';

/**
 * en design faces (en lane, 2026-10-01). Loaded only by modules that render the en design, so ko, ja and
 * zh-hant pages never request them. Display: Inter Tight (tight grotesk for the big headlines).
 * Utility: IBM Plex Mono (labels, numerals and "field guide" tags).
 */
export const enDisplay = Inter_Tight({
  display: 'swap',
  preload: true,
  weight: ['500', '600', '700', '800'],
  variable: '--en-font-display-loaded',
  subsets: ['latin'],
});

export const enMono = IBM_Plex_Mono({
  display: 'swap',
  preload: false,
  weight: ['500', '600'],
  variable: '--en-font-mono-loaded',
  subsets: ['latin'],
});

export const EN_FONT_CLASSES = `${enDisplay.variable} ${enMono.variable}`;
