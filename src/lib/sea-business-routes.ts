// Client-safe availability policy: these eight pages exist only in the SEA four.
export const SEA_BUSINESS_LOCALES = ['vi', 'id', 'th', 'fil'] as const;
export type SeaBusinessLocale = typeof SEA_BUSINESS_LOCALES[number];
export const SEA_BUSINESS_PAGES = ['company-setup', 'debt-collection'] as const;
export type SeaBusinessPageKey = typeof SEA_BUSINESS_PAGES[number];
export function isSeaBusinessLocale(value: string): value is SeaBusinessLocale {
  return (SEA_BUSINESS_LOCALES as readonly string[]).includes(value);
}
export function isSeaBusinessPage(value: string): value is SeaBusinessPageKey {
  return (SEA_BUSINESS_PAGES as readonly string[]).includes(value);
}
