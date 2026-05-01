import { z } from 'zod';
import { locales, type Locale } from '@/lib/locales';

export const columnLocaleSchema = z.enum(locales);

export const columnSlugSchema = z
  .string()
  .trim()
  .min(1, 'slug is required')
  .max(120, 'slug is too long')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case ascii');

export const columnTitleSchema = z
  .string()
  .trim()
  .min(1, 'title is required')
  .max(200, 'title is too long');

export const columnSummarySchema = z
  .string()
  .max(2000, 'summary is too long');

export const columnBodyMarkdownSchema = z
  .string()
  .max(500_000, 'bodyMarkdown is too long');

export const columnBodyHtmlSchema = z
  .string()
  .max(1_000_000, 'bodyHtml is too long');

export const columnCategorySchema = z.enum(['formation', 'legal', 'case']);
export const attorneyReviewStatusSchema = z.enum(['pending', 'reviewed', 'needs-revision']);
export const freshnessSchema = z.enum(['fresh', 'review_needed', 'unknown']);

export const columnLinkedSlugsSchema = z.object({
  ko: columnSlugSchema.optional(),
  'zh-hant': columnSlugSchema.optional(),
  en: columnSlugSchema.optional(),
});

// Phase 14 — Blog metadata (additive, optional). Keeps legacy `category` enum intact.
export const blogAuthorSchema = z.object({
  name: z.string().trim().min(1).max(120),
  photo: z.string().max(2000).optional(),
  title: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
});

export const blogSeoSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  ogImage: z.string().max(2000).optional(),
  noIndex: z.boolean().optional(),
});

export const blogCategorySlugSchema = z
  .string()
  .trim()
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'category slug must be kebab-case ascii');

export const blogTagSchema = z.string().trim().min(1).max(80);

export const columnFrontmatterSchema = z.object({
  lastmod: z.string().datetime({ offset: true }),
  attorneyReviewStatus: attorneyReviewStatusSchema,
  freshness: freshnessSchema,
  category: columnCategorySchema.optional(),
  // Phase 14 blog meta (optional, additive)
  blogCategory: blogCategorySlugSchema.optional(),
  tags: z.array(blogTagSchema).max(20).optional(),
  author: blogAuthorSchema.optional(),
  featuredImage: z.string().max(2000).optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().datetime({ offset: true }).optional(),
  seo: blogSeoSchema.optional(),
});

export const columnDocumentSchema = z.object({
  version: z.literal(1),
  slug: columnSlugSchema,
  locale: columnLocaleSchema,
  title: columnTitleSchema,
  summary: columnSummarySchema,
  bodyMarkdown: columnBodyMarkdownSchema,
  bodyHtml: columnBodyHtmlSchema,
  frontmatter: columnFrontmatterSchema,
  linkedSlugs: columnLinkedSlugsSchema,
  draft: z.boolean(),
  revision: z.number().int().positive(),
  updatedAt: z.string().datetime({ offset: true }),
  updatedBy: z.string().trim().min(1).max(120),
});

const frontmatterInputBase = {
  lastmod: z.string().datetime({ offset: true }).optional(),
  attorneyReviewStatus: attorneyReviewStatusSchema.optional(),
  freshness: freshnessSchema.optional(),
  // Phase 14 blog meta (additive)
  blogCategory: blogCategorySlugSchema.nullable().optional(),
  tags: z.array(blogTagSchema).max(20).nullable().optional(),
  author: blogAuthorSchema.nullable().optional(),
  featuredImage: z.string().max(2000).nullable().optional(),
  featured: z.boolean().nullable().optional(),
  publishedAt: z.string().datetime({ offset: true }).nullable().optional(),
  seo: blogSeoSchema.nullable().optional(),
};

export const createColumnInputSchema = z.object({
  slug: columnSlugSchema,
  locale: columnLocaleSchema,
  title: columnTitleSchema,
  summary: columnSummarySchema.optional(),
  bodyMarkdown: columnBodyMarkdownSchema.optional(),
  bodyHtml: columnBodyHtmlSchema.optional(),
  linkedSlugs: columnLinkedSlugsSchema.optional(),
  frontmatter: z.object({
    ...frontmatterInputBase,
    category: columnCategorySchema.optional(),
  }).optional(),
});

export const patchColumnInputSchema = z.object({
  title: columnTitleSchema.optional(),
  summary: columnSummarySchema.optional(),
  bodyMarkdown: columnBodyMarkdownSchema.optional(),
  bodyHtml: columnBodyHtmlSchema.optional(),
  linkedSlugs: columnLinkedSlugsSchema.partial().optional(),
  frontmatter: z.object({
    ...frontmatterInputBase,
    category: columnCategorySchema.nullable().optional(),
  }).optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided for patch.',
});

export type ColumnDocument = z.infer<typeof columnDocumentSchema>;
export type ColumnFrontmatter = z.infer<typeof columnFrontmatterSchema>;
export type ColumnLinkedSlugs = z.infer<typeof columnLinkedSlugsSchema>;
export type CreateColumnInput = z.infer<typeof createColumnInputSchema>;
export type PatchColumnInput = z.infer<typeof patchColumnInputSchema>;
export type ColumnLocale = Locale;

export interface ColumnDocumentBundle {
  slug: string;
  locale: Locale;
  draft: ColumnDocument | null;
  published: ColumnDocument | null;
  preferred: ColumnDocument | null;
  backend: 'blob' | 'file';
}

export interface ColumnListItem {
  slug: string;
  locale: Locale;
  title: string;
  summary: string;
  linkedSlugs: ColumnLinkedSlugs;
  frontmatter: ColumnFrontmatter;
  hasDraft: boolean;
  hasPublished: boolean;
  draftRevision: number | null;
  publishedRevision: number | null;
  updatedAt: string;
  publishedUpdatedAt: string | null;
  preferredSource: 'draft' | 'published';
}
