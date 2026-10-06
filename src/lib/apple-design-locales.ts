/**
 * Locales on the neutral "Apple" design system: zh-hant since 2026-10-01, ko since 2026-10-06
 * (operator 2026-10-06: 「전체적 디자인 아직 밤티 나는데」 → ko adopts the zh-hant system).
 * Presentation only — monoline glyphs, neutral chrome, pill actions. Copy, links and data stay per locale.
 */
export const APPLE_DESIGN_LOCALES = ['zh-hant', 'ko'] as const;

export type AppleDesignLocale = (typeof APPLE_DESIGN_LOCALES)[number];

export function isAppleDesignLocale(locale: string | null | undefined): locale is AppleDesignLocale {
  return locale === 'zh-hant' || locale === 'ko';
}
