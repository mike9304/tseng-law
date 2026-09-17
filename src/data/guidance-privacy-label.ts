/**
 * Single source for the Indonesian name of the privacy-policy page.
 *
 * The same destination is linked from two places that live in different
 * modules: the guidance navigation/footer (`guidanceContent.id.nav.privacy`)
 * and the inquiry form's consent line
 * (`internationalInquiryCopy.id.privacyLinkLabel`). They used to carry two
 * different names for one page, so the label is defined here once and imported
 * by both, which makes drifting apart impossible.
 *
 * This module deliberately has no imports: `international-inquiry-copy.ts` is
 * pulled into client components on every public page, so it must not reach the
 * much larger `international-guidance-content.ts` to read this string.
 *
 * Indonesian and Arabic only. No other locale's label is defined or changed
 * here.
 */
export const ID_PRIVACY_POLICY_LABEL = 'Kebijakan privasi';

/**
 * Single source for the Arabic name of the privacy-policy page.
 *
 * Same reason as the Indonesian label above: the Arabic guidance navigation
 * (`guidanceContent.ar.nav.privacy`) and the inquiry form's consent line
 * (`internationalInquiryCopy.ar.privacyLinkLabel`) point at the same page and
 * used to name it two different ways (`الخصوصية` vs `سياسة الخصوصية`), so the
 * page name is defined once here and imported by both.
 */
export const AR_PRIVACY_POLICY_LABEL = 'سياسة الخصوصية';
