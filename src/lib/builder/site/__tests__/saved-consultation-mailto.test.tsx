import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import ButtonElement from '@/components/builder/canvas/elements/ButtonElement';
import { createHomeButtonNode } from '@/lib/builder/canvas/decompose-home-shared';
import { createHomePageCanvasDocument } from '@/lib/builder/canvas/seed-home';
import { normalizeCanvasDocument, type BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';
import { PublishedSitePageView, type ResolvedPublishedSitePage } from '@/lib/builder/site/public-page';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import historicalTemplates from '@/lib/consultation/__tests__/fixtures/historical-consultation-mailto.json';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import type { Locale, SiteLocale } from '@/lib/locales';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

function historicalHref(locale: SiteLocale) {
  const template = historicalTemplates.find((row) => row.locale === locale)!;
  return `mailto:wei@hoveringlaw.com.tw?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
}

function button(href: string, structured: boolean, classed: boolean, id = 'saved-body'): BuilderButtonCanvasNode {
  const node = createHomeButtonNode({
    id, href, label: id, rect: { x: 0, y: 0, width: 500, height: 60 }, zIndex: 0,
    ...(classed ? { className: 'authored-consultation' } : {}),
  });
  if (node.kind !== 'button') throw new Error('Expected a button');
  const metadata = { target: '_blank' as const, rel: 'author noopener noreferrer', title: id, ariaLabel: id };
  node.content = structured
    ? { ...node.content, href: '/unused-legacy-link', link: { href, ...metadata } }
    : { ...node.content, ...metadata };
  return node;
}

function anchors(html: string) {
  return [...html.matchAll(/<a\b[^>]*>/g)].map(([tag]) => tag.replace(/&amp;/g, '&'));
}

function expectLink(html: string, id: string, href: string) {
  const tag = anchors(html).find((anchor) => anchor.includes(`title="${id}"`));
  expect(tag).toBeDefined();
  expect(tag).toContain(`href="${href}"`);
  expect(tag).toContain('target="_blank"');
  expect(tag).toContain('rel="author noopener noreferrer"');
  expect(tag).toContain(`aria-label="${id}"`);
}

function resolvedPage(locale: Locale, structured: boolean, classed: boolean): ResolvedPublishedSitePage {
  const now = '2026-10-18T00:00:00.000Z';
  const base = createHomePageCanvasDocument(locale);
  const canvas = (id: string) => normalizeCanvasDocument({
    ...base, nodes: [button(historicalHref(locale), structured, classed, id)], stageHeight: 100,
  }, locale);
  return {
    locale, slugPath: 'saved-consultation', canvas: canvas('saved-body'),
    site: {
      version: 1, siteId: 'saved-consultation', name: 'Saved consultation', locale,
      navigation: [], theme: DEFAULT_THEME, settings: { firmName: 'Saved consultation' },
      pages: [], createdAt: now, updatedAt: now,
    },
    pageMeta: {
      pageId: 'saved-consultation', slug: 'saved-consultation', title: { ko: 'Saved consultation', 'zh-hant': 'Saved consultation', en: 'Saved consultation' },
      locale, createdAt: now, updatedAt: now, publishedAt: now, noIndex: true,
    },
    headerCanvas: canvas('saved-header'), footerCanvas: canvas('saved-footer'),
    lightboxes: [], popups: [], cookieConsent: null, datasetPreviewTargets: [],
    columnPosts: [], faqCategories: [], faqItems: [],
  };
}

describe.each([false, true])('saved consultation buttons (structured link: %s)', (structured) => {
  describe.each([false, true])('classed: %s', (classed) => {
    it.each(['ko', 'zh-hant', 'en'] as const)('upgrades saved %s body, header and footer links without mutating snapshots', async (locale) => {
      const resolved = resolvedPage(locale, structured, classed);
      const before = structuredClone(resolved);
      const html = renderToStaticMarkup(await PublishedSitePageView({ resolved }));
      const href = getConsultationPublicMailto(locale);
      expectLink(html, 'saved-body', href);
      expectLink(html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? '', 'saved-header', href);
      expectLink(html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? '', 'saved-footer', href);
      expect(resolved).toEqual(before);
    });

    it('derives the replacement locale from the effective saved href, retaining metadata', () => {
      const node = button(historicalHref('ja'), structured, classed);
      const before = structuredClone(node);
      expectLink(renderToStaticMarkup(<ButtonElement node={node} mode="published" locale="ko" />), 'saved-body', getConsultationPublicMailto('ja'));
      expect(node).toEqual(before);
    });

    it('keeps an authored structured href even when the legacy href is stock', () => {
      const node = button(historicalHref('en'), structured, classed);
      node.content.href = historicalHref('ko');
      const href = `${historicalHref('en')}&cc=author@example.com`;
      node.content.link = { href, target: '_blank', rel: 'author noopener noreferrer', title: 'saved-body', ariaLabel: 'saved-body' };
      expectLink(renderToStaticMarkup(<ButtonElement node={node} mode="published" />), 'saved-body', href);
    });

    it('does not upgrade a non-exact padded href when the existing sanitizer trims it', () => {
      const href = historicalHref('en');
      const node = button(` ${href} `, structured, classed);
      expectLink(renderToStaticMarkup(<ButtonElement node={node} mode="published" />), 'saved-body', href);
    });

    it.each(['edit', 'preview'] as const)('keeps %s canvas buttons non-interactive', (mode) => {
      const node = button(historicalHref('ko'), structured, classed);
      const before = structuredClone(node);
      const html = renderToStaticMarkup(<ButtonElement node={node} mode={mode} />);
      expect(anchors(html)[0]).not.toContain('href=');
      expect(html).toContain('pointer-events:none');
      expect(node).toEqual(before);
    });
  });
});
