/**
 * Legacy domain (wei-wei-lawyer.com) -> tseng-law.com 301 redirect table.
 *
 * Source of truth: `docs/seo/wix-redirect-map.csv` (33 rows = 18 exact / 15
 * suggested). This module is a build-time snapshot of that CSV — the CSV is
 * the human-editable mapping, this file is the runtime lookup. When the CSV
 * changes, regenerate the entries below.
 *
 * Host scope: requests whose host is `wei-wei-lawyer.com` or
 * `www.wei-wei-lawyer.com` are redirected wholesale to tseng-law.com:
 *   - a known `fromPath` maps to its exact `toUrl`
 *   - any unmapped path falls back to the Korean home (`https://tseng-law.com/ko`)
 *
 * Korean paths are stored as decoded literals and matched against both the
 * raw and the percent-decoded incoming pathname so SERP/cached links work
 * whether they carry UTF-8 bytes or `%xx` escapes.
 */

export type WixRedirectType = 'exact' | 'suggested';

export type WixRedirectEntry = {
  /** Decoded pathname only, e.g. "/post/taiwan-...". Home is "/". */
  readonly fromPath: string;
  /** Absolute target URL. */
  readonly toUrl: string;
  readonly type: WixRedirectType;
};

/** Target for any legacy-host path that has no explicit mapping. */
export const WIX_FALLBACK_TARGET = 'https://tseng-law.com/ko';

/** Hosts that trigger the whole-site legacy redirect. */
export const WIX_LEGACY_HOSTS: ReadonlySet<string> = new Set([
  'wei-wei-lawyer.com',
  'www.wei-wei-lawyer.com',
]);

// prettier-ignore
export const WIX_REDIRECT_ENTRIES: readonly WixRedirectEntry[] = [
  { fromPath: '/',                                                                                                  toUrl: 'https://tseng-law.com/ko',                                                                                                                type: 'exact' },
  { fromPath: '/about-1',                                                                                           toUrl: 'https://tseng-law.com/ko',                                                                                                                type: 'suggested' },
  { fromPath: '/about-8',                                                                                           toUrl: 'https://tseng-law.com/ko',                                                                                                                type: 'suggested' },
  { fromPath: '/blog',                                                                                              toUrl: 'https://tseng-law.com/ko/columns',                                                                                                        type: 'suggested' },
  { fromPath: '/blog/categories/대만-법률정보-교통사고-이혼가사-건축-부동-등',                                            toUrl: 'https://tseng-law.com/ko/columns',                                                                                                        type: 'suggested' },
  { fromPath: '/blog/categories/대만-법인설립',                                                                       toUrl: 'https://tseng-law.com/ko/columns',                                                                                                        type: 'suggested' },
  { fromPath: '/blog/categories/소송사례-분석',                                                                       toUrl: 'https://tseng-law.com/ko/columns',                                                                                                        type: 'suggested' },
  { fromPath: '/book-online',                                                                                       toUrl: 'https://tseng-law.com/ko',                                                                                                                type: 'suggested' },
  { fromPath: '/general-clean',                                                                                     toUrl: 'https://tseng-law.com/ko/services',                                                                                                       type: 'suggested' },
  { fromPath: '/my-addresses',                                                                                      toUrl: 'https://tseng-law.com/ko',                                                                                                                type: 'suggested' },
  { fromPath: '/p67epvdewfign56z7',                                                                                 toUrl: 'https://tseng-law.com/ko',                                                                                                                type: 'suggested' },
  { fromPath: '/post/taiwan-company-establishment-advanced-1',                                                      toUrl: 'https://tseng-law.com/ko/columns/taiwan-company-establishment-advanced-1',                                                                type: 'exact' },
  { fromPath: '/post/taiwan-company-establishment-advanced-2',                                                      toUrl: 'https://tseng-law.com/ko/columns/taiwan-company-establishment-advanced-2',                                                                type: 'exact' },
  { fromPath: '/post/taiwan-company-establishment-basics',                                                          toUrl: 'https://tseng-law.com/ko/columns/taiwan-company-establishment-basics',                                                                    type: 'exact' },
  { fromPath: '/post/taiwan-company-setup-pitch-location',                                                          toUrl: 'https://tseng-law.com/ko/columns/taiwan-company-setup-pitch-location',                                                                    type: 'exact' },
  { fromPath: '/post/taiwan-company-subsidiary-vs-branch',                                                          toUrl: 'https://tseng-law.com/ko/columns/taiwan-company-subsidiary-vs-branch',                                                                    type: 'exact' },
  { fromPath: '/post/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',               toUrl: 'https://tseng-law.com/ko/columns/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',                         type: 'exact' },
  { fromPath: '/post/taiwan-divorce-lawsuit-qna',                                                                   toUrl: 'https://tseng-law.com/ko/columns/taiwan-divorce-lawsuit-qna',                                                                             type: 'exact' },
  { fromPath: '/post/taiwan-gym-injury-lawsuit',                                                                    toUrl: 'https://tseng-law.com/ko/columns/taiwan-gym-injury-lawsuit',                                                                              type: 'exact' },
  { fromPath: '/post/taiwan-inheritance-custody-analysis',                                                          toUrl: 'https://tseng-law.com/ko/columns/taiwan-inheritance-custody-analysis',                                                                    type: 'exact' },
  { fromPath: '/post/taiwan-logistics-business-setup',                                                              toUrl: 'https://tseng-law.com/ko/columns/taiwan-logistics-business-setup',                                                                        type: 'exact' },
  { fromPath: '/post/taiwan-mandatory-employment-period',                                                           toUrl: 'https://tseng-law.com/ko/columns/taiwan-mandatory-employment-period',                                                                     type: 'exact' },
  { fromPath: '/post/taiwan-massage-history-law',                                                                   toUrl: 'https://tseng-law.com/ko/columns/taiwan-massage-history-law',                                                                             type: 'exact' },
  { fromPath: '/post/taiwan-overtaking-accident-liability',                                                         toUrl: 'https://tseng-law.com/ko/columns/taiwan-overtaking-accident-liability',                                                                   type: 'exact' },
  { fromPath: '/post/taiwan-traffic-accident-procedure',                                                            toUrl: 'https://tseng-law.com/ko/columns/taiwan-traffic-accident-procedure',                                                                      type: 'exact' },
  { fromPath: '/post/withdraw-capital-taiwan-company',                                                              toUrl: 'https://tseng-law.com/ko/columns/withdraw-capital-taiwan-company',                                                                        type: 'exact' },
  { fromPath: '/post/대만-노동법：대만에서-퇴직금-받기-어렵다고',                                                       toUrl: 'https://tseng-law.com/ko/columns/taiwan-labor-severance-law',                                                                            type: 'exact' },
  { fromPath: '/post/직원이-자발적으로-퇴사해도-퇴직금을-받을-수-있는-예외',                                            toUrl: 'https://tseng-law.com/ko/columns/taiwan-voluntary-resignation-severance',                                                                 type: 'exact' },
  { fromPath: '/service-page/법률자문-상담',                                                                          toUrl: 'https://tseng-law.com/ko/services',                                                                                                       type: 'suggested' },
  { fromPath: '/services-3',                                                                                        toUrl: 'https://tseng-law.com/ko/services',                                                                                                       type: 'suggested' },
  { fromPath: '/복제-대표변호사-증준외',                                                                              toUrl: 'https://tseng-law.com/ko',                                                                                                                type: 'suggested' },
  { fromPath: '/복제-대표변호사-증준외-1',                                                                            toUrl: 'https://tseng-law.com/ko',                                                                                                                type: 'suggested' },
  { fromPath: '/복제-대표변호사-증준외-2',                                                                            toUrl: 'https://tseng-law.com/ko',                                                                                                                type: 'suggested' },
];

const WIX_LOOKUP: ReadonlyMap<string, string> = new Map(
  WIX_REDIRECT_ENTRIES.map((entry) => [entry.fromPath, entry.toUrl]),
);

/** Normalize a Host header value: drop port, lowercase, trim. */
function normalizeHost(host: string | null | undefined): string {
  if (!host) return '';
  return host.split(':')[0].trim().toLowerCase();
}

/** True when the given host header belongs to the legacy domain. */
export function isWixLegacyHost(host: string | null | undefined): boolean {
  return WIX_LEGACY_HOSTS.has(normalizeHost(host));
}

function safeDecodeURIComponent(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

/**
 * Resolve a legacy-host pathname to its 301 target. Always returns a target:
 * an explicit mapping wins, otherwise the Korean home fallback is used.
 * Matches both percent-encoded and already-decoded incoming paths.
 */
export function resolveWixRedirectTarget(pathname: string): string {
  const candidates = new Set<string>([pathname, safeDecodeURIComponent(pathname)]);
  for (const candidate of candidates) {
    const target = WIX_LOOKUP.get(candidate);
    if (target) return target;
  }
  return WIX_FALLBACK_TARGET;
}
