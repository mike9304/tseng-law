import type { Locale } from '@/lib/locales';
import { locales } from '@/lib/locales';
import {
  listPages,
  readPageCanvas,
} from '@/lib/builder/site/persistence';
import { listBlogPosts } from '@/lib/builder/blog/column-adapter';
import { listFaqSearchDocs } from '@/lib/builder/faq/faq-engine';
import { listPortfolioSearchDocs } from '@/lib/builder/portfolio/portfolio-engine';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { resolveLocaleSeo } from '@/lib/builder/translations/seo-projection';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';
import { isInternalSandboxPage } from '@/lib/builder/site/internal-pages';
import type { SearchDoc } from './types';

/**
 * PR #5 — Collect publishable docs to feed the search index.
 *
 * Pull builder pages, published Blog/Columns posts, FAQ records, and Portfolio
 * projects into a single index source.
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
    if (isInternalSandboxPage(page)) continue;
    const canvas = await readPageCanvas(siteId, page.pageId, 'published');
    const body = canvas ? extractTextFromDocument(canvas.nodes) : '';
    const title = page.title[locale] || page.title.ko || page.slug;
    const seo = resolveLocaleSeo(page, locale);
    const effectiveSlug = resolveLocaleSlug(page, locale);
    docs.push({
      id: `page:${locale}:${page.pageId}`,
      kind: 'page',
      locale,
      title,
      url: buildSitePagePath(locale, page.isHomePage ? '' : effectiveSlug),
      summary: seo.description ?? page.seo?.description,
      body,
      publishedAt: page.publishedAt,
    });
  }
  return docs;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function collectBlogDocsForLocale(locale: Locale): Promise<SearchDoc[]> {
  const posts = await listBlogPosts(locale);
  return posts.map((post): SearchDoc => ({
    id: `blog:${locale}:${post.slug}`,
    kind: 'blog',
    locale,
    title: post.title,
    url: `/${locale}/columns/${post.slug}`,
    summary: post.excerpt,
    body: [
      post.excerpt,
      post.bodyMarkdown,
      stripHtml(post.bodyHtml),
      post.author?.name,
      post.author?.title,
      post.category,
      ...(post.tags ?? []),
    ].filter(Boolean).join('\n'),
    publishedAt: post.publishedAt ?? post.updatedAt,
    tags: post.tags,
  }));
}

export async function collectAllSearchDocs(siteId = 'default'): Promise<SearchDoc[]> {
  const out: SearchDoc[] = [];
  for (const locale of locales) {
    try {
      const [pageDocs, blogDocs, faqDocs, portfolioDocs] = await Promise.all([
        collectPageDocsForLocale(siteId, locale),
        collectBlogDocsForLocale(locale),
        listFaqSearchDocs(locale),
        listPortfolioSearchDocs(locale),
      ]);
      out.push(...pageDocs, ...blogDocs, ...faqDocs, ...portfolioDocs);
    } catch (err) {
      console.warn('[search/source-collector] failed for locale', locale, err);
    }
  }
  return out;
}
