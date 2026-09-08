import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createHomePageCanvasDocument } from '@/lib/builder/canvas/seed-home';
import { normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import savedJulyHome from '@/lib/builder/canvas/__tests__/fixtures/legacy-zh-home-july.json';
import {
  hasLegacyJulyZhHantHomeDualTree,
  normalizeLegacyZhHantHome,
  normalizeLegacyZhHantHomeRead,
} from '@/lib/builder/canvas/home-zh-hant-parity';
import {
  CURRENT9_COMPOSITE_RENDER_ORDER,
  JULY_NATURAL_FLOW_SECTION_IDS,
  JULY_PRIMARY_FLOW_SECTION_IDS,
  CURRENT9_PUBLISHED_HOME_EDITORIAL_CSS,
  JULY_PUBLISHED_HOME_EDITORIAL_CSS,
  JULY_SECONDARY_FLOW_SECTION_IDS,
  JULY_SHARED_RESULTS_PRIMITIVE_ID,
  deriveJulyHeroEditorialPresentation,
  isSafeNormalizedDocumentEnvelope,
  matchCurrent9PublishedHomeEditorial,
  publishedHomeEditorialCompositeProps,
  reorderCurrent9PublishedHomeNodes,
  shouldSkipJulyPublishedGeometry,
} from '@/lib/builder/site/published-home-editorial';

const LOCALES = ['ko', 'en', 'zh-hant'] as const;

function normalizedFactory(locale: (typeof LOCALES)[number]) {
  return normalizeCanvasDocument(createHomePageCanvasDocument(locale), locale);
}

function julyFixture() {
  return normalizeLegacyZhHantHome(
    normalizeCanvasDocument(structuredClone(savedJulyHome), 'zh-hant'),
    'zh-hant',
    true,
  );
}

function contentString(node: { content: Record<string, unknown> } | undefined, keys: string[]) {
  if (!node) return '';
  for (const key of keys) {
    const value = node.content[key];
    if (typeof value === 'string') return value;
  }
  return '';
}

function findJulySearchInput(nodes: Array<{ id: string; content: Record<string, unknown> }>) {
  return nodes.find((node) => node.id === 'home-hero-search-input' || node.content.name === 'q');
}

function findJulySearchSubmit(nodes: Array<{ id: string; content: Record<string, unknown> }>) {
  return nodes.find((node) => (
    node.id === 'home-hero-search-btn'
    || node.id === 'home-hero-search-button'
    || node.id === 'home-hero-search-submit'
  ));
}

describe('current9 published home editorial admission', () => {
  it.each(LOCALES)('admits independently generated normalized %s factory documents', (locale) => {
    const document = normalizedFactory(locale);
    expect(matchCurrent9PublishedHomeEditorial({
      document,
      locale,
      slugPath: '',
    })).toEqual({ locale });
    expect(document.nodes.map((node) => node.id)).toEqual([
      'home-hero',
      'home-insights',
      'home-services',
      'home-attorney',
      'home-case-results',
      'home-stats',
      'home-faq',
      'home-offices',
      'home-contact',
    ]);
    expect(reorderCurrent9PublishedHomeNodes(document.nodes).map((node) => node.id)).toEqual([
      ...CURRENT9_COMPOSITE_RENDER_ORDER,
    ]);
    expect(CURRENT9_PUBLISHED_HOME_EDITORIAL_CSS).toContain("[data-cta='home-ai-intake-entry']");
    expect(CURRENT9_PUBLISHED_HOME_EDITORIAL_CSS).toContain('.split-image--portrait::after');
    expect(CURRENT9_PUBLISHED_HOME_EDITORIAL_CSS).toContain('max-height: 180px');
  });

  it('accepts root timestamp changes and parentId undefined equivalence only', () => {
    const document = normalizedFactory('ko');
    const shifted = {
      ...document,
      updatedAt: '2026-09-07T00:00:00.000Z',
      updatedBy: 'reviewer',
      nodes: document.nodes.map((node) => ({ ...node, parentId: undefined })),
    };
    expect(matchCurrent9PublishedHomeEditorial({
      document: shifted,
      locale: 'ko',
      slugPath: '',
    })).toEqual({ locale: 'ko' });
  });

  it('rejects a copied nonhome slug even when the document is factory home', () => {
    const document = normalizedFactory('ko');
    expect(matchCurrent9PublishedHomeEditorial({
      document,
      locale: 'ko',
      slugPath: 'about',
    })).toBeNull();
  });

  it('rejects locale mismatch between renderer and document', () => {
    const document = normalizedFactory('ko');
    expect(matchCurrent9PublishedHomeEditorial({
      document,
      locale: 'en',
      slugPath: '',
    })).toBeNull();
  });

  it.each([
    'order',
    'rect',
    'style',
    'responsive',
    'content',
    'component',
    'empty-override',
    'binding',
    'visibility',
    'extra-node',
    'missing-node',
  ] as const)('rejects authored %s changes', (change) => {
    const document = structuredClone(normalizedFactory('en'));
    const hero = document.nodes.find((node) => node.id === 'home-hero');
    expect(hero?.kind).toBe('composite');
    if (hero?.kind !== 'composite') throw new Error('expected composite hero');
    if (change === 'order') {
      document.nodes.reverse();
    }
    if (change === 'rect') hero.rect.height += 1;
    if (change === 'style') hero.style = { ...hero.style, opacity: 91 };
    if (change === 'responsive') {
      hero.responsive = { tablet: { hidden: true } };
    }
    if (change === 'content') {
      hero.content = { ...hero.content, config: { locale: 'en', extra: true } };
    }
    if (change === 'component') {
      hero.content = { ...hero.content, componentKey: 'home-stats' };
    }
    if (change === 'empty-override') {
      hero.content = {
        ...hero.content,
        config: { locale: 'en', overrides: { headline: '' } },
      };
    }
    if (change === 'binding') {
      hero.dataBinding = {
        targetId: 'home.insights.feed',
        recordIndex: 0,
        fields: { title: 'author' },
      };
    }
    if (change === 'visibility') hero.visible = false;
    if (change === 'extra-node') document.nodes.push({ ...hero, id: 'author-addition' });
    if (change === 'missing-node') document.nodes.pop();
    expect(matchCurrent9PublishedHomeEditorial({
      document,
      locale: 'en',
      slugPath: '',
    })).toBeNull();
  });

  it('rejects accessors, symbols, nonenumerable keys and array holes without invoking getters', () => {
    const document = normalizedFactory('zh-hant');
    let accessed = false;
    Object.defineProperty(document, 'trap', {
      enumerable: true,
      get() {
        accessed = true;
        return 'nope';
      },
    });
    expect(isSafeNormalizedDocumentEnvelope(document)).toBe(false);
    expect(matchCurrent9PublishedHomeEditorial({
      document,
      locale: 'zh-hant',
      slugPath: '',
    })).toBeNull();
    expect(accessed).toBe(false);

    const withSymbol = normalizedFactory('zh-hant') as unknown as Record<PropertyKey, unknown>;
    Object.defineProperty(withSymbol, Symbol('extra'), { enumerable: true, value: 1 });
    expect(matchCurrent9PublishedHomeEditorial({
      document: withSymbol,
      locale: 'zh-hant',
      slugPath: '',
    })).toBeNull();

    const withHidden = normalizedFactory('ko');
    Object.defineProperty(withHidden, 'hiddenExtra', { enumerable: false, value: 1 });
    expect(matchCurrent9PublishedHomeEditorial({
      document: withHidden,
      locale: 'ko',
      slugPath: '',
    })).toBeNull();

    const holed = normalizedFactory('en');
    const holedNodes = holed.nodes.slice();
    delete holedNodes[1];
    expect(matchCurrent9PublishedHomeEditorial({
      document: { ...holed, nodes: holedNodes },
      locale: 'en',
      slugPath: '',
    })).toBeNull();
  });

  it('wires current9 hero, services, attorney, insights and offices composites', () => {
    const document = normalizedFactory('ko');
    const hero = document.nodes.find((node) => node.id === 'home-hero')!;
    const services = document.nodes.find((node) => node.id === 'home-services')!;
    const insights = document.nodes.find((node) => node.id === 'home-insights')!;
    const attorney = document.nodes.find((node) => node.id === 'home-attorney')!;
    const offices = document.nodes.find((node) => node.id === 'home-offices')!;
    expect(publishedHomeEditorialCompositeProps(hero, { current9: true, july: null })).toEqual({
      homeEditorialPresentation: 'editorial',
    });
    expect(publishedHomeEditorialCompositeProps(services, { current9: true, july: null })).toEqual({
      homeEditorialPresentation: 'editorial',
    });
    expect(publishedHomeEditorialCompositeProps(insights, { current9: true, july: null })).toEqual({
      homeEditorialPresentation: 'editorial',
    });
    expect(publishedHomeEditorialCompositeProps(attorney, { current9: true, july: null })).toEqual({
      homeEditorialPresentation: 'editorial',
    });
    expect(publishedHomeEditorialCompositeProps(offices, { current9: true, july: null })).toEqual({
      homeEditorialPresentation: 'editorial',
    });
    expect(publishedHomeEditorialCompositeProps(hero, { current9: false, july: null })).toEqual({});
  });
});

describe('july published home editorial derivation', () => {
  it('uses the real fixture and unchanged SHA guard, preserving 聯絡 and primitive hero strings', async () => {
    const rawCount = savedJulyHome.nodes.length;
    const normalized = julyFixture();
    const read = await normalizeLegacyZhHantHomeRead(normalized, 'zh-hant', true);
    const before = structuredClone(read);
    expect(rawCount).toBe(420);
    expect(normalized.nodes.length).toBeGreaterThanOrEqual(422);
    expect(read.nodes.length).toBeGreaterThanOrEqual(422);
    expect(await hasLegacyJulyZhHantHomeDualTree(read, 'zh-hant', true)).toBe(true);
    expect(isSafeNormalizedDocumentEnvelope(read)).toBe(true);
    const derived = deriveJulyHeroEditorialPresentation(read, 'zh-hant');
    expect(derived).not.toBeNull();
    expect(read).toEqual(before);
    const title = read.nodes.find((node) => node.id === 'home-hero-title');
    const label = read.nodes.find((node) => node.id === 'home-hero-label');
    const subtitle = read.nodes.find((node) => node.id === 'home-hero-subtitle');
    const columns = read.nodes.find((node) => node.id === 'home-hero-columns-link');
    expect(derived?.overrides.headline).toBe(contentString(title, ['text', 'label']));
    expect(derived?.overrides['section-label']).toBe(contentString(label, ['text', 'label']));
    expect(derived?.overrides.subtitle).toBe(contentString(subtitle, ['text', 'label']));
    expect(derived?.overrides['columns-link']).toBe(contentString(columns, ['label', 'text']));
    expect(derived?.quickMenus).toHaveLength(6);
    expect(derived?.quickMenus.map((item) => item.label)).toHaveLength(6);
    expect(derived?.quickMenus[5]?.label).toBe('聯絡');
    expect(derived?.quickMenus[5]?.href).toBe('/zh-hant/contact');
    expect(derived?.quickMenus.some((item) => item.label === '聯絡資訊')).toBe(false);
    const parityHero = read.nodes.find((node) => node.anchorName === 'mobile-parity-home-hero')!;
    const wired = publishedHomeEditorialCompositeProps(parityHero, { current9: false, july: derived });
    expect(wired.homeEditorialPresentation).toBe('editorial');
    expect(wired.publishedSurfaceOverrides).toEqual(derived?.overrides);
    expect(wired.publishedHeroQuickMenus).toEqual(derived?.quickMenus);
    expect(wired.publishedHeroQuickMenus?.[5]?.label).toBe('聯絡');
  });

  it('rejects an actual search-input mismatch without mutating the document', async () => {
    const read = await normalizeLegacyZhHantHomeRead(julyFixture(), 'zh-hant', true);
    const copy = structuredClone(read);
    const control = findJulySearchInput(copy.nodes);
    expect(control).toBeDefined();
    (control!.content as { placeholder?: string }).placeholder = 'not-the-stock-placeholder';
    const before = structuredClone(copy);
    expect(deriveJulyHeroEditorialPresentation(copy, 'zh-hant')).toBeNull();
    expect(copy).toEqual(before);
  });

  it('rejects an actual submit accessible-label mismatch without treating the glyph as the spoken label', async () => {
    const read = await normalizeLegacyZhHantHomeRead(julyFixture(), 'zh-hant', true);
    const copy = structuredClone(read);
    const submit = findJulySearchSubmit(copy.nodes);
    expect(submit).toBeDefined();
    const content = submit!.content as { ariaLabel?: string; 'aria-label'?: string; text?: string; label?: string };
    const originalGlyph = content.text;
    const originalLabel = content.label;
    content.ariaLabel = 'not-the-stock-submit-label';
    content['aria-label'] = 'not-the-stock-submit-label';
    const before = structuredClone(copy);
    expect(deriveJulyHeroEditorialPresentation(copy, 'zh-hant')).toBeNull();
    expect(copy).toEqual(before);
    const stock = structuredClone(read);
    expect(deriveJulyHeroEditorialPresentation(stock, 'zh-hant')).not.toBeNull();
    const stockSubmit = findJulySearchSubmit(stock.nodes);
    expect(stockSubmit).toBeDefined();
    expect((stockSubmit!.content as { text?: string }).text).toBe(originalGlyph);
    expect((stockSubmit!.content as { label?: string }).label).toBe(originalLabel);
  });

  it('does not inject FAQ, contact href, stats label, or about summary copy via July CSS', async () => {
    const read = await normalizeLegacyZhHantHomeRead(julyFixture(), 'zh-hant', true);
    const faqQuestion = contentString(
      read.nodes.find((node) => node.id === 'home-faq-q-0' || node.id === 'home-faq-item-0-question'),
      ['text', 'label', 'question'],
    );
    const aboutSummary = contentString(
      read.nodes.find((node) => node.id === 'home-attorney-summary' || node.id === 'home-attorney-text'),
      ['text', 'label'],
    );
    const css = JULY_PUBLISHED_HOME_EDITORIAL_CSS;
    expect(css).not.toMatch(/content\s*:\s*['"][^'"]{8,}['"]/);
    if (faqQuestion) {
      expect(css).not.toContain(faqQuestion);
    }
    if (aboutSummary) {
      expect(css).not.toContain(aboutSummary);
    }
    expect(css).not.toContain('mailto:');
    expect(css).not.toContain('tel:');
  });

  it('rejects July title edits instead of substituting shared copy', async () => {
    const read = await normalizeLegacyZhHantHomeRead(julyFixture(), 'zh-hant', true);
    const title = read.nodes.find((node) => node.id === 'home-hero-title');
    if (title && title.kind === 'text') {
      title.content = { ...title.content, text: '作者自行編輯的標題' };
    }
    expect(await hasLegacyJulyZhHantHomeDualTree(read, 'zh-hant', true)).toBe(false);
  });

  it('scopes July body natural-height CSS to admitted marker and omits results primitive display rules', () => {
    expect(JULY_NATURAL_FLOW_SECTION_IDS).toEqual([
      'home-attorney-root',
      'home-stats-root',
      'home-insights-root',
      'home-faq-root',
      'home-offices-root',
      'home-contact-root',
    ]);
    for (const id of JULY_NATURAL_FLOW_SECTION_IDS) {
      expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain(`data-node-id='${id}'`);
    }
    expect(JULY_PRIMARY_FLOW_SECTION_IDS).toEqual([
      'home-attorney-root',
      'home-insights-root',
      'home-faq-root',
      'home-contact-root',
    ]);
    expect(JULY_SECONDARY_FLOW_SECTION_IDS).toEqual([
      'home-stats-root',
      'home-offices-root',
    ]);
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('padding-top: 96px');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('padding-top: 72px');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('position: relative !important');
    expect(JULY_SHARED_RESULTS_PRIMITIVE_ID).toBe('home-case-results-root');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).not.toContain(JULY_SHARED_RESULTS_PRIMITIVE_ID);
    expect(JULY_NATURAL_FLOW_SECTION_IDS).not.toContain(JULY_SHARED_RESULTS_PRIMITIVE_ID);
  });

  it('skips published geometry writes only inside an admitted July main', () => {
    const july = { closest: (selector: string) => (selector.includes('[data-home-editorial="july"]') ? {} : null) };
    const other = { closest: () => null };
    expect(shouldSkipJulyPublishedGeometry(july)).toBe(true);
    expect(shouldSkipJulyPublishedGeometry(other)).toBe(false);
    expect(shouldSkipJulyPublishedGeometry(null)).toBe(false);
    const interactions = readFileSync(
      join(process.cwd(), 'src/components/builder/published/PublishedInteractions.tsx'),
      'utf8',
    );
    expect(interactions).toContain("from '@/lib/builder/site/published-home-editorial'");
    expect(interactions).toContain('shouldSkipJulyPublishedGeometry');
    expect(interactions).toContain('applyJulySafeExpandedGeometry');
    expect(interactions).not.toMatch(/function shouldSkipJulyPublishedGeometry/);
    expect(interactions).toContain('applyExpandedSiblingStack');
    expect(interactions).toContain('setExpandedSectionHeight');
  });
});
