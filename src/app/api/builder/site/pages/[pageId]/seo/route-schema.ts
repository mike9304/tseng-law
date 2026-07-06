import { z } from 'zod';
import { normalizeSeoSlugInput } from '@/lib/builder/seo/validation';
import type { BuilderSeoMetadata } from '@/lib/builder/site/types';

const optionalSeoString = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(max).optional(),
  );

const builderSeoMetadataSchema = z.object({
  title: optionalSeoString(300),
  description: optionalSeoString(500),
  ogTitle: optionalSeoString(300),
  ogDescription: optionalSeoString(500),
  ogImage: optionalSeoString(2000),
  twitterCard: z.enum(['summary', 'summary_large_image']).optional(),
  twitterTitle: optionalSeoString(300),
  twitterDescription: optionalSeoString(500),
  twitterImage: optionalSeoString(2000),
  canonical: optionalSeoString(2000),
  noIndex: z.boolean().optional(),
  noFollow: z.boolean().optional(),
  additionalMetaTags: z.array(z.object({
    id: z.string().trim().min(1).max(120),
    name: z.string().trim().min(1).max(120),
    content: z.string().trim().min(1).max(1000),
  }).strict()).max(10).optional(),
  structuredData: z.object({
    legalService: z.boolean().optional(),
    organization: z.boolean().optional(),
    localBusiness: z.boolean().optional(),
    faqPage: z.enum(['auto', 'off']).optional(),
    breadcrumbList: z.boolean().optional(),
  }).strict().optional(),
  overrideState: z.record(z.string(), z.boolean()).optional(),
  focusKeyword: optionalSeoString(80),
  structuredDataBlocks: z.array(z.object({
    id: z.string().trim().min(1).max(120),
    type: z.enum(['LegalService', 'Organization', 'LocalBusiness', 'FAQPage', 'Article', 'BreadcrumbList', 'Custom']),
    label: optionalSeoString(120),
    enabled: z.boolean(),
    json: optionalSeoString(10000),
  }).strict()).max(5).optional(),
}).strict();

const seoRequestSchema = z.object({
  slug: optionalSeoString(200),
  seo: builderSeoMetadataSchema.optional(),
  createRedirect: z.boolean().optional(),
}).strict();

export interface ParsedSeoRequest {
  readonly slug?: string;
  readonly seoPayload: BuilderSeoMetadata;
  readonly rawSeoBody: unknown;
  readonly createRedirect: boolean;
}

export function parseSeoRequest(rawBody: unknown): ParsedSeoRequest {
  if (typeof rawBody === 'object' && rawBody !== null && ('seo' in rawBody || 'slug' in rawBody)) {
    const payload = seoRequestSchema.parse(rawBody);
    const normalizedSlug = payload.slug ? normalizeSeoSlugInput(payload.slug) : undefined;
    return {
      ...(normalizedSlug !== undefined ? { slug: normalizedSlug } : {}),
      seoPayload: payload.seo ?? {},
      rawSeoBody: payload.seo ?? {},
      createRedirect: payload.createRedirect === true,
    };
  }

  return {
    seoPayload: builderSeoMetadataSchema.parse(rawBody),
    rawSeoBody: rawBody,
    createRedirect: false,
  };
}
