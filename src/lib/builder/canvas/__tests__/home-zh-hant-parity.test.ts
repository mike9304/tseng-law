import { describe, expect, it } from 'vitest';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
import type { SiteLocale } from '@/lib/locales';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { normalizeCanvasDocument, type BuilderCanvasDocument, type BuilderCanvasNode } from '../types';
import { getLegacyZhHantFluidContainerStyle, getLegacyZhHantHeroButtonIcon, hasLegacyJulyZhHantHomeDualTree, normalizeLegacyZhHantHome, normalizeLegacyZhHantHomeRead } from '../home-zh-hant-parity';

import { legacyZhHomeFixture as fixture } from './fixtures/legacy-zh-home';
import savedHome from './fixtures/legacy-zh-home-july.json';

function node(doc: BuilderCanvasDocument, id: string): BuilderCanvasNode {
  const found = doc.nodes.find((item) => item.id === id);
  if (!found) throw new Error(`Missing ${id}`);
  return found;
}
function heroOnly(): BuilderCanvasDocument {
  const doc = fixture();
  doc.nodes = doc.nodes.filter((item) => item.id.startsWith('home-hero-'));
  return doc;
}
function run(doc: BuilderCanvasDocument) { return normalizeLegacyZhHantHome(doc, 'zh-hant', true); }

const LEGACY_ATTORNEY_STOCK_TEXT = {
  'home-attorney-title': '曾雋崴律師，專注服務韓國客戶的台灣法律夥伴',
  'home-attorney-summary': '擁有 10+ 年實務經驗，曾參與韓國 SBS 晨間節目並持續經營 WEI Lawyer 法律內容。',
  'home-attorney-intro-2': '曾代理韓國留學生健身傷害求償案，獲判新台幣 157 萬元。',
} as const;
type AttorneyStockId = keyof typeof LEGACY_ATTORNEY_STOCK_TEXT;
const ATTORNEY_STOCK_IDS = Object.keys(LEGACY_ATTORNEY_STOCK_TEXT) as AttorneyStockId[];

function canonicalAttorneyStockText(id: AttorneyStockId): string {
  const text = id === 'home-attorney-title' ? siteContent['zh-hant'].homeAttorney.title
    : id === 'home-attorney-summary' ? siteContent['zh-hant'].homeAttorney.summary
      : teamContent['zh-hant'].members.find((member) => member.id === 'tseng-junwei')?.intro?.[1];
  if (typeof text !== 'string') throw new Error(`Missing canonical copy for ${id}`);
  return text;
}
function attorneyStockDocument(): BuilderCanvasDocument {
  const source = fixture();
  return {
    ...source,
    nodes: [
      structuredClone(node(source, 'home-hero-root')),
      ...ATTORNEY_STOCK_IDS.map((id) => {
        const item = structuredClone(node(source, id));
        if (item.kind !== 'text') throw new Error(`${id} text expected`);
        item.parentId = 'home-attorney-content';
        item.content.text = LEGACY_ATTORNEY_STOCK_TEXT[id];
        return item;
      }),
    ],
  };
}

describe('legacy ZH home read projection', () => {
  it('does not regroup attorney details around an additional authored sibling', () => {
    const doc = fixture();
    const summary = node(doc, 'home-attorney-summary');
    doc.nodes.push({ ...structuredClone(summary), id: 'author-detail-note', rect: { x: 77, y: 525, width: 540, height: 20 } });
    const next = run(doc);
    expect(next.nodes.some((item) => item.id === 'home-attorney-detail-flow')).toBe(false);
    expect(node(next, 'home-attorney-cta')).toBe(node(doc, 'home-attorney-cta'));
    expect(node(next, 'author-detail-note')).toBe(node(doc, 'author-detail-note'));
  });
  it('flows the known overlapping attorney paragraphs and CTA without dropping nodes', () => {
    const doc = fixture();
    const original = structuredClone(doc);
    const next = run(doc);
    const ids = ['home-attorney-summary', 'home-attorney-contact-line', 'home-attorney-cta'];
    expect(node(next, 'home-attorney-detail-flow').content).toMatchObject({ layoutMode: 'flex', flexConfig: { direction: 'column', gap: 16 } });
    for (const id of ids) {
      expect(node(next, id).parentId).toBe('home-attorney-detail-flow');
      const before = node(original, id);
      if (id === 'home-attorney-summary' && before.kind === 'text'
        && before.content.text === LEGACY_ATTORNEY_STOCK_TEXT['home-attorney-summary']) {
        expect(node(next, id).content).toEqual({
          ...before.content, text: canonicalAttorneyStockText('home-attorney-summary'),
        });
      } else {
        expect(node(next, id).content).toEqual(before.content);
      }
    }
    expect(original.nodes.every((item) => next.nodes.some((candidate) => candidate.id === item.id))).toBe(true);
    expect(doc).toEqual(original);
    expect(run(next)).toBe(next);
  });

  it.each(['geometry', 'binding', 'extra-style'])('leaves authored attorney %s untouched', (variant) => {
    const doc = fixture();
    const summary = node(doc, 'home-attorney-summary');
    if (variant === 'geometry') summary.rect.y += 1;
    if (variant === 'binding') summary.dataBinding = { datasetId: 'author', field: 'summary' } as never;
    if (variant === 'extra-style') summary.style.opacity = 90;
    const next = run(doc);
    expect(next.nodes.some((item) => item.id === 'home-attorney-detail-flow')).toBe(false);
    const staleSummary = summary.kind === 'text'
      && summary.content.text === LEGACY_ATTORNEY_STOCK_TEXT['home-attorney-summary'];
    if (variant === 'binding' || !staleSummary) {
      expect(node(next, summary.id)).toBe(summary);
    } else {
      expect(node(next, summary.id)).toEqual({
        ...summary,
        content: { ...summary.content, text: canonicalAttorneyStockText('home-attorney-summary') },
      });
    }
  });
  it('adds one locale-correct email CTA without rewriting author copy or metadata', () => {
    const doc = heroOnly();
    const title = node(doc, 'home-hero-title');
    if (title.kind !== 'text') throw new Error('text expected');
    title.content.text = '作者保留的標題';
    const original = structuredClone(doc);
    const next = run(doc);
    expect(doc).toEqual(original);
    expect(next.nodes).toHaveLength(doc.nodes.length + 1);
    expect(node(next, title.id)).toBe(title);
    expect(node(next, 'home-hero-email-consultation-link').content).toMatchObject({
      label: '申請電子郵件諮詢', href: getConsultationPublicMailto('zh-hant'),
    });
    expect(node(next, 'home-hero-copy').content).toMatchObject({ layoutMode: 'flex', flexConfig: { direction: 'column' } });
    expect(node(next, 'home-hero-links').content).toMatchObject({ layoutMode: 'flex', flexConfig: { wrap: true } });
    expect({ ...next, nodes: [] }).toEqual({ ...original, nodes: [] });
    expect(run(next)).toBe(next);
  });

  it('also recognizes the real fixture after schema normalization', () => {
    const next = run(normalizeCanvasDocument(heroOnly(), 'zh-hant'));
    expect(next.nodes.some((item) => item.id === 'home-hero-email-consultation-link')).toBe(true);
  });

  it.each(['ko', 'en', 'ja'] as SiteLocale[])('does not project locale %s', (locale) => {
    const doc = fixture();
    expect(normalizeLegacyZhHantHome(doc, locale, true)).toBe(doc);
  });
  it('requires the matching home and document locale', () => {
    const doc = fixture();
    expect(normalizeLegacyZhHantHome(doc, 'zh-hant', false)).toBe(doc);
    doc.locale = 'en';
    expect(run(doc)).toBe(doc);
  });

  const customizations: Array<[string, (item: BuilderCanvasNode) => void]> = [
    ['geometry', (item) => { item.rect.x += 1; }],
    ['style', (item) => { item.style.backgroundColor = '#123456'; }],
    ['responsive', (item) => { item.responsive = { mobile: { hidden: true } }; }],
    ['hidden', (item) => { item.visible = false; }],
    ['rotation', (item) => { item.rotation = 5; }],
    ['anchor', (item) => { item.anchorName = 'authored-copy'; }],
    ['locked', (item) => { item.locked = true; }],
    ['bound content', (item) => { item.dataBinding = { targetId: 'home.insights.feed', recordIndex: 0, fields: { text: 'title' } }; }],
  ];
  it.each(customizations)('retains a customized %s subtree unchanged', (_label, customize) => {
    const doc = heroOnly();
    customize(node(doc, 'home-hero-copy'));
    expect(run(doc)).toBe(doc);
  });
  it('retains authored links and extra child widgets', () => {
    for (const mode of ['link', 'extra', 'existing'] as const) {
      const doc = heroOnly();
      const link = node(doc, 'home-hero-columns-link');
      if (link.kind !== 'button') throw new Error('button expected');
      if (mode === 'link') link.content.href = '/zh-hant/custom';
      else doc.nodes.push({ ...structuredClone(link), id: mode === 'existing'
        ? 'home-hero-email-consultation-link' : 'custom-link' });
      expect(run(doc)).toBe(doc);
    }
  });
  it('keeps unrelated custom nodes and composite surface overrides by reference', () => {
    const doc = heroOnly();
    const composite: BuilderCanvasNode = { id: 'custom-composite', kind: 'composite',
      rect: { x: 0, y: 9000, width: 1280, height: 100 }, style: node(doc, 'home-hero-copy').style,
      zIndex: 999, rotation: 0, locked: false, visible: true,
      content: { componentKey: 'hero-search', config: { locale: 'zh-hant', overrides: { headline: '自訂' } } } };
    doc.nodes.push(composite);
    expect(node(run(doc), composite.id)).toBe(composite);
  });

  it('uses stock container geometry only, without changing its stored rect', () => {
    const doc = fixture();
    const item = node(doc, 'home-insights-container');
    const original = structuredClone(item);
    expect(getLegacyZhHantFluidContainerStyle(item, 'zh-hant')?.left).toContain('1200px');
    expect(item).toEqual(original);
    expect(getLegacyZhHantFluidContainerStyle(item, 'ko')).toBeUndefined();
    item.rect.x += 1;
    expect(getLegacyZhHantFluidContainerStyle(item, 'zh-hant')).toBeUndefined();
  });
  it('does not restyle an authored class or reparented container', () => {
    for (const mode of ['parent', 'class'] as const) {
      const item = node(fixture(), 'home-insights-container');
      if (mode === 'parent') item.parentId = 'custom-section';
      else if (item.kind === 'container') item.content.className = 'authored-container';
      expect(getLegacyZhHantFluidContainerStyle(item, 'zh-hant')).toBeUndefined();
    }
  });

  it('recognizes only the exact legacy search and scroll affordances', () => {
    const doc = fixture();
    const search = node(doc, 'home-hero-search-button');
    const scroll = node(doc, 'home-hero-scroll-arrow');
    expect(getLegacyZhHantHeroButtonIcon(search, 'zh-hant')).toBe('search');
    expect(getLegacyZhHantHeroButtonIcon(scroll, 'zh-hant')).toBe('scroll');
    expect(getLegacyZhHantHeroButtonIcon(search, 'en')).toBeNull();
    if (search.kind !== 'button' || scroll.kind !== 'button') throw new Error('button expected');
    search.content.label = '作者按鈕'; scroll.content.href = '#custom';
    expect(getLegacyZhHantHeroButtonIcon(search, 'zh-hant')).toBeNull();
    expect(getLegacyZhHantHeroButtonIcon(scroll, 'zh-hant')).toBeNull();
  });

  it('repairs Taipei by its city/address/map identity at any numeric index', () => {
    for (const index of ['2', '8']) {
      const doc = fixture();
      doc.nodes = doc.nodes.filter((item) => item.id === 'home-hero-root' || item.id.includes('offices-'));
      for (const item of doc.nodes) {
        item.id = item.id.replace('layout-2', `layout-${index}`).replace('tab-2', `tab-${index}`);
        item.parentId = item.parentId?.replace('layout-2', `layout-${index}`);
      }
      const original = structuredClone(doc);
      const next = run(doc);
      expect(doc).toEqual(original);
      expect(node(next, `home-offices-layout-${index}-card-address`).content).toMatchObject({ text: '103臺北市大同區承德路一段35號7樓之2' });
      expect(node(next, `home-offices-layout-${index}-card-phone`)).toMatchObject({ visible: false, content: { href: 'tel:0423261862' } });
      expect(node(next, `home-offices-layout-${index}-card-fax`).visible).toBe(false);
      expect(next.nodes).toHaveLength(doc.nodes.length);
      expect(run(next)).toBe(next);
    }
  });
  it('retains a custom phone and blocks contact repair when map identity differs', () => {
    const doc = fixture();
    const phone = node(doc, 'home-offices-layout-2-card-phone');
    if (phone.kind !== 'button') throw new Error('button expected');
    phone.content.href = 'tel:123456789'; phone.content.label = '作者聯絡電話';
    expect(node(run(doc), phone.id)).toBe(phone);
    const mapLink = node(doc, 'home-offices-layout-2-card-map-link');
    if (mapLink.kind !== 'button') throw new Error('button expected');
    mapLink.content.href = 'https://example.com/custom-map';
    const next = run(doc);
    expect(node(next, 'home-offices-layout-2-card-address')).toBe(node(doc, 'home-offices-layout-2-card-address'));
  });

  it('replaces seeded legacy attorney stock text with current zh-hant copy', () => {
    const doc = attorneyStockDocument();
    for (const id of ATTORNEY_STOCK_IDS) node(doc, id).anchorName = `author-${id}`;
    const original = structuredClone(doc);
    const next = run(doc);
    expect(doc).toEqual(original);
    expect(next.updatedBy).toBe(doc.updatedBy);
    expect(next.updatedAt).toBe(doc.updatedAt);
    expect(next.locale).toBe(doc.locale);
    expect(next.version).toBe(doc.version);
    expect(next.nodes).toHaveLength(doc.nodes.length);
    expect(next.nodes.some((item) => item.id === 'home-attorney-detail-flow')).toBe(false);
    expect(node(next, 'home-hero-root')).toBe(node(doc, 'home-hero-root'));
    for (const id of ATTORNEY_STOCK_IDS) {
      const before = node(original, id);
      const after = node(next, id);
      if (before.kind !== 'text' || after.kind !== 'text') throw new Error(`${id} text expected`);
      const canonical = canonicalAttorneyStockText(id);
      expect(canonical).not.toBe(LEGACY_ATTORNEY_STOCK_TEXT[id]);
      expect(after).not.toBe(node(doc, id));
      expect(after).toEqual({ ...before, content: { ...before.content, text: canonical } });
      expect(after.parentId).toBe('home-attorney-content');
      expect(after.anchorName).toBe(`author-${id}`);
    }
    expect(run(next)).toBe(next);
  });

  const attorneyStockGuards: Array<[string, (item: BuilderCanvasNode) => void]> = [
    ['custom authored text', (item) => {
      if (item.kind !== 'text') throw new Error('text expected');
      item.content.text = '作者自訂的律師介紹';
    }],
    ['bound text', (item) => {
      item.dataBinding = { datasetId: 'author', field: 'summary' } as never;
    }],
    ['richText', (item) => {
      if (item.kind !== 'text') throw new Error('text expected');
      (item.content as { richText?: unknown }).richText = { type: 'doc', content: [] };
    }],
    ['wrong parent', (item) => { item.parentId = 'authored-attorney-column'; }],
  ];
  it.each(attorneyStockGuards)('does not rewrite seeded attorney stock with %s', (_label, customize) => {
    const doc = attorneyStockDocument();
    const summary = node(doc, 'home-attorney-summary');
    customize(summary);
    const original = structuredClone(doc);
    const next = run(doc);
    expect(doc).toEqual(original);
    expect(node(next, summary.id)).toBe(summary);
    expect(next.updatedBy).toBe(doc.updatedBy);
    expect(next.updatedAt).toBe(doc.updatedAt);
    for (const id of ['home-attorney-title', 'home-attorney-intro-2'] as const) {
      const before = node(original, id);
      const after = node(next, id);
      if (before.kind !== 'text' || after.kind !== 'text') throw new Error(`${id} text expected`);
      expect(after).not.toBe(node(doc, id));
      expect(after).toEqual({
        ...before, content: { ...before.content, text: canonicalAttorneyStockText(id) },
      });
      expect(after.parentId).toBe('home-attorney-content');
      expect(after.rect).toEqual(before.rect);
    }
    expect(run(next)).toBe(next);
  });

  it('does not repair seeded attorney stock off the zh-hant home', () => {
    for (const locale of ['ko', 'en', 'ja'] as SiteLocale[]) {
      const doc = attorneyStockDocument();
      expect(normalizeLegacyZhHantHome(doc, locale, true)).toBe(doc);
      for (const id of ATTORNEY_STOCK_IDS) {
        const item = node(doc, id);
        if (item.kind !== 'text') throw new Error(`${id} text expected`);
        expect(item.content.text).toBe(LEGACY_ATTORNEY_STOCK_TEXT[id]);
      }
    }
    const doc = attorneyStockDocument();
    expect(normalizeLegacyZhHantHome(doc, 'zh-hant', false)).toBe(doc);
    doc.locale = 'en';
    expect(run(doc)).toBe(doc);
  });

  it('repairs pre-G43 saved 422 stock when only the summary parent is the detail flow', async () => {
    const saved = run(normalizeCanvasDocument(structuredClone(savedHome), 'zh-hant'));
    for (const id of ATTORNEY_STOCK_IDS) {
      const item = node(saved, id);
      if (item.kind !== 'text') throw new Error(`${id} text expected`);
      item.content.text = LEGACY_ATTORNEY_STOCK_TEXT[id];
    }
    expect(saved.nodes).toHaveLength(422);
    expect(node(saved, 'home-attorney-summary').parentId).toBe('home-attorney-detail-flow');
    expect(node(saved, 'home-attorney-title').parentId).toBe('home-attorney-content');
    expect(node(saved, 'home-attorney-intro-2').parentId).toBe('home-attorney-content');
    const original = structuredClone(saved);
    const next = await normalizeLegacyZhHantHomeRead(saved, 'zh-hant', true);
    expect(saved).toEqual(original);
    for (const id of ATTORNEY_STOCK_IDS) {
      const after = node(next, id);
      if (after.kind !== 'text') throw new Error(`${id} text expected`);
      expect(after.content.text).toBe(canonicalAttorneyStockText(id));
      expect(after.parentId).toBe(id === 'home-attorney-summary' ? 'home-attorney-detail-flow' : 'home-attorney-content');
    }
    const intro = node(next, 'home-attorney-intro-1');
    const stats = node(next, 'home-stats-number-1');
    if (intro.kind !== 'text' || stats.kind !== 'text') throw new Error('text expected');
    expect(intro.content.text).toBe('專精企業與個人案件。事務所可提供韓文、中文、日文、英文法律溝通。');
    expect(stats.content.text).toBe('4');
    expect(next.nodes).toHaveLength(424);
    expect(await hasLegacyJulyZhHantHomeDualTree(next, 'zh-hant', true)).toBe(true);
    expect(await normalizeLegacyZhHantHomeRead(next, 'zh-hant', true)).toBe(next);
  });
});
