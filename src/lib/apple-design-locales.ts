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

/**
 * Root attributes for an Apple-system page body: `id="zh-hant-<page>" data-zh-hant-design` for zh-hant,
 * `id="ko-<page>" data-ko-design` for ko. The page modules are scoped to :is(#zh-hant-<page>, #ko-<page>), and
 * globals.css releases builder-published heights for either data attribute.
 */
export function appleDesignRootProps(
  locale: AppleDesignLocale,
  page: string,
): { id: string; 'data-zh-hant-design'?: string; 'data-ko-design'?: string } {
  return locale === 'ko'
    ? { id: `ko-${page}`, 'data-ko-design': page }
    : { id: `zh-hant-${page}`, 'data-zh-hant-design': page };
}
