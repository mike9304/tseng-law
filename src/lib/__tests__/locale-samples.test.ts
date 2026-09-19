import { describe, expect, it } from 'vitest';
import { siteLocales } from '@/lib/locales';
import {
  GUIDANCE_LOCALES_4,
  PUBLIC_LOCALES_8,
  isGuidanceLocale4,
  isRoutedPublicLocale,
} from '@/lib/public-guidance';
import {
  GUIDANCE_ONLY_LOCALE_SAMPLES,
  UNROUTABLE_LOCALE_SAMPLES,
} from '@/lib/test-support/locale-samples';

/**
 * Meta guard. The rejection tests across the app import their samples from
 * `@/lib/test-support/locale-samples`; this file asserts those samples still
 * mean what the importing tests assume. If a new guidance batch claims one of
 * them, this test fails by name instead of letting unrelated tests pass for the
 * wrong reason.
 */
describe('locale samples used by rejection tests', () => {
  it.each(UNROUTABLE_LOCALE_SAMPLES)(
    '%s stays unroutable, so 404 assertions keep testing a 404',
    (sample) => {
      expect(isRoutedPublicLocale(sample), `${sample} became routable`).toBe(false);
      expect(
        (PUBLIC_LOCALES_8 as readonly string[]).includes(sample),
        `${sample} joined PUBLIC_LOCALES_8 — pick a new sample`,
      ).toBe(false);
      expect(
        (GUIDANCE_LOCALES_4 as readonly string[]).includes(sample),
        `${sample} joined GUIDANCE_LOCALES_4 — pick a new sample`,
      ).toBe(false);
    },
  );

  it.each(GUIDANCE_ONLY_LOCALE_SAMPLES)(
    '%s stays a guidance-only locale, so site-locale APIs still reject it',
    (sample) => {
      expect(isGuidanceLocale4(sample), `${sample} is no longer a guidance locale`).toBe(true);
      expect(
        (siteLocales as readonly string[]).includes(sample),
        `${sample} became a site locale — site-locale APIs would now accept it`,
      ).toBe(false);
    },
  );

  it('keeps the two sample families disjoint', () => {
    const unroutable = new Set<string>(UNROUTABLE_LOCALE_SAMPLES);
    for (const sample of GUIDANCE_ONLY_LOCALE_SAMPLES) {
      expect(unroutable.has(sample), `${sample} is in both sample lists`).toBe(false);
    }
  });
});
