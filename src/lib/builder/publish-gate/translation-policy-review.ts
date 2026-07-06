import { z } from 'zod';
import { locales } from '@/lib/locales';

export const translationSiteReviewInputSchema = z
  .object({
    sourceLocale: z.enum(locales),
    syncedAt: z.string().datetime({ offset: true }),
    totalCount: z.number().int().nonnegative(),
    currentPageCount: z.number().int().nonnegative(),
    otherPageCount: z.number().int().nonnegative(),
    warningCount: z.number().int().nonnegative(),
    errorCount: z.number().int().nonnegative(),
    reviewHref: z.string().trim().min(1).max(320),
    warningFingerprint: z.string().trim().min(1).max(80).optional(),
  })
  .strict();

export type TranslationSiteReviewInput = z.infer<typeof translationSiteReviewInputSchema>;

export type TranslationSiteReviewParseResult =
  | { readonly status: 'absent' }
  | { readonly status: 'valid'; readonly review: TranslationSiteReviewInput }
  | { readonly status: 'invalid' };

export function parseOptionalTranslationSiteReview(
  value: unknown,
): TranslationSiteReviewParseResult {
  if (value === undefined || value === null) return { status: 'absent' };

  const result = translationSiteReviewInputSchema.safeParse(value);
  if (!result.success) return { status: 'invalid' };

  return { status: 'valid', review: result.data };
}
