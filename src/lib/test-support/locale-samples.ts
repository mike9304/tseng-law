/**
 * Locale samples for tests that assert a rejection.
 *
 * Why this file exists: every guidance batch turns yesterday's "obviously
 * invalid" language code into a live locale. When that happens the assertion
 * does not fail — it silently stops testing anything. The route starts
 * answering 200, the API starts accepting the value, and the test name still
 * says "404" or "invalid". This already happened three times in one merge
 * (`uiLocale: 'it'`, the 404 fallback sample `/fr/...`, and the llms.txt 404
 * sample `fr`), and `cs` was queued to be the fourth.
 *
 * So the samples live here instead of inline, and `locale-samples.test.ts`
 * asserts what each list promises. Add a locale that collides with a sample and
 * one clearly named test fails immediately, instead of several unrelated tests
 * quietly going green for the wrong reason.
 *
 * This module is imported only by tests. It is a plain module, not a spec file,
 * so the vitest `include` globs (`*.{test,spec}.{ts,tsx}`) skip it.
 */

/**
 * Strings the public router must never accept, in any batch.
 *
 * - `xx` is not an assigned ISO 639-1 language code, so it can never become a locale.
 * - `vi-VN` is a region-tagged form; routing uses bare language subtags plus
 *   script (`zh-hant`, `zh-hans`), never a region.
 * - `zh` alone is ambiguous by design: the site routes `zh-hant` and `zh-hans`.
 */
export const UNROUTABLE_LOCALE_SAMPLES = ['xx', 'vi-VN', 'zh'] as const;
export type UnroutableLocaleSample = (typeof UNROUTABLE_LOCALE_SAMPLES)[number];

/**
 * Public guidance locales that are deliberately NOT site locales.
 *
 * These are valid URLs — `/fr/services` answers 200 — but APIs whose contract is
 * the four site/consultation languages must still reject them. A test that wants
 * "a real language the consultation surface does not serve" belongs here, not in
 * {@link UNROUTABLE_LOCALE_SAMPLES}.
 */
export const GUIDANCE_ONLY_LOCALE_SAMPLES = ['fr'] as const;
export type GuidanceOnlyLocaleSample = (typeof GUIDANCE_ONLY_LOCALE_SAMPLES)[number];
