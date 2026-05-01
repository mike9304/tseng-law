/**
 * SEO maturity — JSON-LD orchestrator for builder-published pages.
 *
 * Walks a canvas document and emits the schema.org JSON-LD payloads
 * appropriate to the widgets present on the page. The actual schema
 * generation lives in `./schema-org.ts` (re-used here, never
 * re-implemented).
 *
 * Detected node kinds:
 *   - `faqList`         → FAQPage
 *   - `attorneyCard`    → Attorney / Person
 *
 * The site-wide LegalService schema is mounted by `public-page.tsx`
 * directly via `generateLegalServiceSchema`; including it here would
 * duplicate the JSON-LD on every page.
 *
 * Article schema for column posts is owned by the legacy column page
 * route (`buildArticleJsonLd` in `src/lib/seo.ts`); builder pages are
 * not articles, so we don't emit Article from this orchestrator.
 */

import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  generateAttorneySchema,
  generateFAQSchema,
} from '@/lib/builder/seo/schema-org';

export interface StructuredDataPayload {
  /** Stable key for React `key=` when rendering. */
  id: string;
  /** The JSON-LD object to mount inside a `<script type="application/ld+json">`. */
  data: Record<string, unknown>;
}

interface FaqListContent {
  items?: Array<{ question?: string; answer?: string }>;
}

interface AttorneyCardContent {
  name?: string;
  title?: string;
  photo?: string;
  specialties?: string[];
}

function isVisible(node: BuilderCanvasNode): boolean {
  return node.visible !== false;
}

function collectFaqPayloads(canvas: BuilderCanvasDocument): StructuredDataPayload[] {
  const out: StructuredDataPayload[] = [];
  for (const node of canvas.nodes) {
    if (node.kind !== 'faqList' || !isVisible(node)) continue;
    const content = (node.content ?? {}) as FaqListContent;
    const items = (content.items ?? [])
      .map((item) => ({
        question: (item.question ?? '').trim(),
        answer: (item.answer ?? '').trim(),
      }))
      .filter((item) => item.question && item.answer);
    if (items.length === 0) continue;
    out.push({
      id: `faq-${node.id}`,
      data: generateFAQSchema(items),
    });
  }
  return out;
}

function collectAttorneyPayloads(canvas: BuilderCanvasDocument): StructuredDataPayload[] {
  const out: StructuredDataPayload[] = [];
  for (const node of canvas.nodes) {
    if (node.kind !== 'attorneyCard' || !isVisible(node)) continue;
    const content = (node.content ?? {}) as AttorneyCardContent;
    const name = (content.name ?? '').trim();
    const title = (content.title ?? '').trim();
    if (!name || !title) continue;
    out.push({
      id: `attorney-${node.id}`,
      data: generateAttorneySchema({
        name,
        title,
        photo: content.photo ? content.photo.trim() : undefined,
        specialties: content.specialties?.filter((s) => typeof s === 'string' && s.trim()),
      }),
    });
  }
  return out;
}

/**
 * Public entry point. Returns 0..n schema payloads for the page —
 * caller decides how to mount them (one `<JsonLd>` per item).
 */
export function buildStructuredDataPayloads(
  canvas: BuilderCanvasDocument,
): StructuredDataPayload[] {
  return [
    ...collectFaqPayloads(canvas),
    ...collectAttorneyPayloads(canvas),
  ];
}
