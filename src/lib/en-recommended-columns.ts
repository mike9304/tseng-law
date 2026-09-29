/** Back-compat re-exports: recommendations are now driven by frontmatter `audience`. */
export {
  COLUMN_AUDIENCE_GLOBAL,
  RECOMMENDED_SECTION_TITLE,
  columnAudienceRank,
  isRecommendedColumn,
  normalizeColumnAudience,
  prioritizeRecommendedColumns,
  splitRecommendedColumns,
} from '@/lib/column-audience';
