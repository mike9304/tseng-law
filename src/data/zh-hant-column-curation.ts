import type { ColumnTopic } from '@/lib/column-topics';

/**
 * zh-hant columns for Taiwanese readers (2026-10-01 operator direction): disputes and family matters
 * first, company setup — mainly sought by foreign clients — last.
 */
export const ZH_HANT_COLUMN_TOPIC_ORDER: readonly ColumnTopic[] = [
  'litigation',
  'family',
  'inheritance',
  'labor',
  'tax',
  'other',
  'lawyer',
  'visa',
  'company',
];

/** Opening picks on the zh-hant columns index: everyday disputes Taiwanese readers look up. */
export const ZH_HANT_FEATURED_COLUMN_SLUGS: readonly string[] = [
  'taiwan-accident-police-records',
  'taiwan-criminal-accessory-civil-suit-fraud',
  'taiwan-labor-severance-law',
];
