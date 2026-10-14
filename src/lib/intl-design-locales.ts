/**
 * Locales on the shared "Folio" design (2026-10-15, operator 2026-10-14: 「인도네시아 태국 그리고 유럽쪽은 디자인 같게
 * 해서, 한번에 배포하고 언어만 다르게하고」). Indonesian, Thai and the 27 European guidance languages share one scoped
 * stylesheet (src/components/intl-design/IntlDesign.module.css) and one font sheet; only the text and the
 * :lang(th) / :lang(el) typesetting values differ. Presentation only — copy, links and data stay per locale.
 * Direction: ~/tseng-country-design-20261013/intl/DIRECTION.md.
 */
export const INTL_DESIGN_LOCALES = [
  'id',
  'th',
  'de',
  'es',
  'fr',
  'it',
  'pt',
  'nl',
  'pl',
  'ru',
  'uk',
  'el',
  'sv',
  'da',
  'nb',
  'fi',
  'cs',
  'hu',
  'ro',
  'sk',
  'bg',
  'hr',
  'sr',
  'sl',
  'lt',
  'lv',
  'et',
  'ca',
  'is',
] as const;

export type IntlDesignLocale = (typeof INTL_DESIGN_LOCALES)[number];

const INTL_DESIGN_LOCALE_SET: ReadonlySet<string> = new Set(INTL_DESIGN_LOCALES);

export function isIntlDesignLocale(locale: string | null | undefined): locale is IntlDesignLocale {
  return typeof locale === 'string' && INTL_DESIGN_LOCALE_SET.has(locale);
}
