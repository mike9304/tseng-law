/**
 * A real, tracked editorial image with a Taiwan-law visual language. It is used
 * for incomplete legacy records instead of exposing a generic placeholder in
 * the published archive.
 *
 * Kept in its own module so server components (the guidance home archive) can
 * reuse the resolver without pulling in the client archive component.
 */
export const INSIGHTS_IMAGE_FALLBACK =
  '/images/blog/016-taiwan-inheritance-custody-analysis/featured-generic.webp';

export function resolveInsightsImageSrc(src?: string | null): string {
  const normalized = src?.trim() ?? '';
  if (!normalized || /(?:^|\/)placeholder(?:[-./]|$)/i.test(normalized)) {
    return INSIGHTS_IMAGE_FALLBACK;
  }
  return normalized;
}
