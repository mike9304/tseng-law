import type { Locale } from '@/lib/locales';
import { locales } from '@/lib/locales';
import {
  listPages,
  readPageCanvas,
} from '@/lib/builder/site/persistence';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import type { SearchDoc } from './types';

/**
 * PR #5 — Collect publishable docs to feed the search index.
 *
 * For now we pull builder pages (published variant) and extract every text-ish
 * node's content into `body`. Blog (columns) and FAQ adapters are kept as
 * separate helpers so they can be wired later without disturbing this entry.
 */

function extractTextFromNode(node: BuilderCanvasNode): string {
  const content = (node as { content?: Record<string, unknown> }).content;
  if (!content) return '';
  const out: string[] = [];
  const visit = (value: unknown): void => {
    if (!value) return;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0 && trimmed.length < 2000) out.push(trimmed);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (typeof value === 'object') {
      for (const v of Object.values(value as Record<string, unknown>)) visit(v);
    }
  };
  visit(content);
  return out.join('\n');
}

function extractTextFromDocument(nodes: BuilderCanvasNode[]): string {
  return nodes.map(extractTextFromNode).filter((s) => s.length > 0).join('\n');
}

async function collectPageDocsForLocale(siteId: string, locale: Locale): Promise<SearchDoc[]> {
  const pages = await listPages(siteId, locale);
  const docs: SearchDoc[] = [];
  for (const page of pages) {
    if (page.noIndex || page.seo?.noIndex) continue;
    const canvas = await readPageCanvas(siteId, page.pageId, 'published');
    const body = canvas ? extractTextFromDocument(canvas.nodes) : '';
    const title = page.title[locale] || page.title.ko || page.slug;
    docs.push({
      id: `page:${locale}:${page.pageId}`,
      kind: 'page',
      locale,
      title,
      url: buildSitePagePath(locale, page.isHomePage ? '' : page.slug),
      summary: page.seo?.description,
      body,
      publishedAt: page.publishedAt,
    });
  }
  return docs;
}

export async function collectAllSearchDocs(siteId = 'default'): Promise<SearchDoc[]> {
  const out: SearchDoc[] = [];
  for (const locale of locales) {
    try {
      const localeDocs = await collectPageDocsForLocale(siteId, locale);
      out.push(...localeDocs);
    } catch (err) {
      console.warn('[search/source-collector] failed for locale', locale, err);
    }
  }
  return out;
}
