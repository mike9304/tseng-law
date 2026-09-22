import { locales, type Locale } from '@/lib/locales';
import type { BuilderPageMeta } from './types';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';
import { compileOwnershipRules, type OwnershipToken } from './public-route-matcher.mjs';

/** Source app-router catalog, not a prefix deny-list. Coverage test detects added/removed routes. */
export const PUBLIC_FILE_ROUTES = [
  "/admin-builder/_dev/flex",
  "/admin-builder/_dev/functions",
  "/admin-builder/_dev/logs",
  "/admin-builder/_dev/sdk",
  "/admin-builder/_dev/secrets",
  "/admin-builder/ai-generator",
  "/admin-builder/apps",
  "/admin-builder/backups",
  "/admin-builder/bookings/calendar",
  "/admin-builder/bookings/calendar-sync",
  "/admin-builder/bookings/dashboard",
  "/admin-builder/bookings/email-templates",
  "/admin-builder/bookings/packages",
  "/admin-builder/bookings",
  "/admin-builder/bookings/policies",
  "/admin-builder/bookings/resources",
  "/admin-builder/bookings/services",
  "/admin-builder/bookings/staff/[id]/availability",
  "/admin-builder/bookings/staff",
  "/admin-builder/cms",
  "/admin-builder/columns/[slug]/edit",
  "/admin-builder/columns",
  "/admin-builder/commerce/currency",
  "/admin-builder/commerce/documents",
  "/admin-builder/commerce/notifications",
  "/admin-builder/commerce/orders",
  "/admin-builder/commerce",
  "/admin-builder/commerce/payments",
  "/admin-builder/commerce/products",
  "/admin-builder/commerce/shipping",
  "/admin-builder/commerce/tax",
  "/admin-builder/commerce/webhooks",
  "/admin-builder/crm",
  "/admin-builder/custom-code",
  "/admin-builder/dev/sdk",
  "/admin-builder/domains",
  "/admin-builder/errors",
  "/admin-builder/events",
  "/admin-builder/experiments",
  "/admin-builder/faq",
  "/admin-builder/footer",
  "/admin-builder/forms/builder/[formId]",
  "/admin-builder/forms",
  "/admin-builder/forms/submissions",
  "/admin-builder/forms-flow",
  "/admin-builder/header",
  "/admin-builder/inbox",
  "/admin-builder/lawyers",
  "/admin-builder/lightboxes/[id]/edit",
  "/admin-builder/lightboxes",
  "/admin-builder/marketing/campaigns/[campaignId]/edit",
  "/admin-builder/marketing",
  "/admin-builder/marketing/subscribers",
  "/admin-builder/marketing/templates/[templateId]/edit",
  "/admin-builder/marketing/templates",
  "/admin-builder/members",
  "/admin-builder/migrations",
  "/admin-builder/ops",
  "/admin-builder",
  "/admin-builder/portfolio",
  "/admin-builder/reviews",
  "/admin-builder/sandbox",
  "/admin-builder/search",
  "/admin-builder/semiconductor-preview",
  "/admin-builder/semiconductor-preview/columns/[slug]",
  "/admin-builder/seo",
  "/admin-builder/seo/redirects",
  "/admin-builder/services",
  "/admin-builder/translations/[pageId]",
  "/admin-builder/translations/dashboard",
  "/admin-builder/translations",
  "/admin-builder/users",
  "/admin-builder/webhooks/[webhookId]",
  "/admin-builder/webhooks",
  "/admin-builder/workspace",
  "/builder/[pageKey]/datasets",
  "/builder/[pageKey]",
  "/builder/[pageKey]/scene",
  "/builder/collections/[collectionId]",
  "/builder/dynamic-routes/[routeId]",
  "/builder/dynamic-templates/[templateId]",
  "/builder",
  "/builder/starter-templates/[templateId]",
  "/builder-preview/about",
  "/builder-preview/contact",
  "/builder-preview",
  "/design-preview",
  "/design-preview/semiconductor",
  "/design-preview/semiconductor/columns/[slug]",
  "/[[...slug]]",
  "/accessibility",
  "/account/billing/documents/[documentId]/payment-link",
  "/account/billing",
  "/account/bookings/[bookingId]/calendar",
  "/account/bookings/[bookingId]/cancel",
  "/account/bookings/[bookingId]/documents/[documentId]/email",
  "/account/bookings/[bookingId]",
  "/account/bookings/[bookingId]/reschedule",
  "/account/bookings/export",
  "/account/bookings",
  "/account",
  "/account/premium",
  "/account/profile",
  "/admin-consultation",
  "/ai-intake",
  "/bookings/manage/[token]",
  "/builder-fixtures/decomposed-home",
  "/columns/[slug]",
  "/columns",
  "/events/[slug]",
  "/events",
  "/faq",
  "/guides/taiwan-company-setup",
  "/insights/[slug]",
  "/insights",
  "/korean-lawyer-in-taiwan",
  "/lawyers/[slug]",
  "/llms.txt",
  "/login",
  "/p/[[...slug]]",
  "/portfolio/[slug]",
  "/portfolio",
  "/search",
  "/semiconductor",
  "/services/[slug]",
  "/store/categories/[slug]",
  "/store/checkout",
  "/store",
  "/store/products/[slug]",
  "/taiwan-company-setup-lawyer",
  "/taiwan-debt-recovery-lawyer",
  "/taiwan-lawyer",
  "/taiwan-litigation-lawyer",
  "/taiwan-semiconductor-supplier-legal",
  "/videos",
] as const;
// Retain the accepted FN39 authentication reservation even when its staged
// reset-password entry is absent from this deployment's file-route catalog.
const RESERVED_PUBLIC_ROUTES = ['/reset-password'] as const;
const BUILDER_LANDINGS = new Set(['/faq', '/videos', '/columns', '/[[...slug]]']);
function tokens(pattern: string): OwnershipToken[] {
  return pattern.slice(1).split('/').map(part => {
    if (part.startsWith('[[...')) return { optionalCatchAll: part.slice(5, -2) };
    if (part.startsWith('[...')) return { catchAll: part.slice(4, -1) };
    if (part.startsWith('[')) return { param: part.slice(1, -1) };
    return { literal: part };
  });
}
const rules = [...PUBLIC_FILE_ROUTES, ...RESERVED_PUBLIC_ROUTES].map(pattern => ({
  id: pattern, owner: BUILDER_LANDINGS.has(pattern) ? 'builder' as const : 'native' as const,
  segments: tokens(pattern),
}));
const classify = compileOwnershipRules({ locales: [...locales], rules });
export function isBuilderOwnedSlug(locale: string, slug: string): boolean {
  return classify({ locale, path: '/' + slug }).owner === 'builder';
}
/** Only affected effective URLs: pre-existing collisions do not freeze unrelated edits/recovery. */
export function changedNativeRoute(previous: BuilderPageMeta, next: BuilderPageMeta): boolean {
  return locales.some(locale => {
    const before = previous.isHomePage ? '' : resolveLocaleSlug(previous, locale);
    const after = next.isHomePage ? '' : resolveLocaleSlug(next, locale);
    return before !== after && !isBuilderOwnedSlug(locale, after);
  });
}
/** Wildcard redirects run before file routing; test the whole prefix language, never literal '*'. */
export function hasNativeDescendant(slug: string): boolean {
  const prefix = slug ? slug.split('/') : [];
  return rules.some(rule => {
    if (rule.owner !== 'native') return false;
    for (let i = 0; i < prefix.length; i++) {
      const token = rule.segments[i];
      if (!token) return false;
      if ('catchAll' in token || 'optionalCatchAll' in token) return true;
      if ('literal' in token && token.literal !== prefix[i]) return false;
    }
    // Exact shorter/equal routes cannot own descendants; a remaining token can.
    return rule.segments.length > prefix.length;
  });
}
export function nativeRedirectWarning(locale: Locale, slug: string, nextSlug: string, wildcard = false) {
  const suffix = wildcard ? '/*' : '';
  return { from: `/${locale}/${slug}${suffix}`, to: `/${locale}/${nextSlug}${suffix}`,
    field: 'from' as const, message: 'Automatic redirect skipped because its source overlaps an address used by a site feature.' };
}
