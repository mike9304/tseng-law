import { describe, expect, it } from 'vitest';
import type { SiteLocale } from '@/lib/locales';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { normalizeCanvasDocument, type BuilderCanvasDocument, type BuilderCanvasNode } from '../types';
import { getLegacyZhHantFluidContainerStyle, getLegacyZhHantHeroButtonIcon, normalizeLegacyZhHantHome } from '../home-zh-hant-parity';

import { legacyZhHomeFixture as fixture } from './fixtures/legacy-zh-home';

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
  it('flows the known overlapping attorney paragraphs and CTA without changing any copy or dropping nodes', () => {
    const doc = fixture();
    const original = structuredClone(doc);
    const next = run(doc);
    const ids = ['home-attorney-summary', 'home-attorney-contact-line', 'home-attorney-cta'];
    expect(node(next, 'home-attorney-detail-flow').content).toMatchObject({ layoutMode: 'flex', flexConfig: { direction: 'column', gap: 16 } });
    for (const id of ids) {
      expect(node(next, id).parentId).toBe('home-attorney-detail-flow');
      expect(node(next, id).content).toEqual(node(original, id).content);
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
    expect(node(next, summary.id)).toBe(summary);
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
});
