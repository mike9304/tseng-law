import { describe, expect, it } from 'vitest';
import savedColumns from './fixtures/legacy-columns-stock.json';
import { hasLegacyColumnsScaffold } from '../legacy-columns-scaffold';
import { normalizeCanvasDocument, type BuilderCanvasDocument } from '../types';

function fixture(locale: 'ko' | 'zh-hant'): BuilderCanvasDocument {
  const saved = savedColumns.find((entry) => entry.locale === locale)!;
  return { version: 1, locale, stageWidth: 1280, stageHeight: 2660,
    updatedAt: '2026-07-28T00:00:00.000Z', updatedBy: 'author-record-kept',
    nodes: structuredClone(saved.nodes) as BuilderCanvasDocument['nodes'] };
}

describe('legacy columns live-content scaffold boundary', () => {
  it.each(['ko', 'zh-hant'] as const)('matches the actual public %s two-node scaffold without changing data', (locale) => {
    const doc = fixture(locale); const original = structuredClone(doc);
    expect(hasLegacyColumnsScaffold(doc, locale, 'columns')).toBe(true);
    expect(hasLegacyColumnsScaffold(normalizeCanvasDocument(doc, locale), locale, 'columns')).toBe(true);
    expect(doc).toEqual(original);
  });
  it.each(['extra-node', 'height', 'width', 'offset', 'stage', 'style', 'responsive', 'hidden', 'binding', 'parent', 'content', 'config', 'component', 'layout', 'order', 'active-index', 'sticky'])(
    'preserves authored %s by opting out of flow compatibility', (change) => {
      const doc = fixture('ko'); const root = doc.nodes[0]; const composite = doc.nodes[1];
      if (root.kind !== 'container' || composite.kind !== 'composite') throw new Error('stock kinds expected');
      if (change === 'extra-node') doc.nodes.push({ ...structuredClone(root), id: 'author-note' });
      if (change === 'height') root.rect.height = 3000;
      if (change === 'width') composite.rect.width = 1100;
      if (change === 'offset') root.rect.y = 8;
      if (change === 'stage') doc.stageHeight = 3000;
      if (change === 'style') root.style.opacity = 90;
      if (change === 'responsive') root.responsive = { tablet: { rect: { height: 2900 } } };
      if (change === 'hidden') composite.visible = false;
      if (change === 'binding') composite.dataBinding = { datasetId: 'author', field: 'list' } as never;
      if (change === 'parent') composite.parentId = 'author-container';
      if (change === 'content') root.content.label = 'Author archive';
      if (change === 'config') composite.content.config = { locale: 'ko', category: 'author-choice' };
      if (change === 'component') composite.content.componentKey = 'legacy-page-about';
      if (change === 'layout') root.content.layoutMode = 'flex';
      if (change === 'order') doc.nodes.reverse();
      if (change === 'active-index') root.content.activeIndex = 1;
      if (change === 'sticky') root.content.sticky = true;
      const original = structuredClone(doc);
      expect(hasLegacyColumnsScaffold(doc, 'ko', 'columns')).toBe(false);
      expect(doc).toEqual(original);
    },
  );
  it('rejects copied pages, other locales and inconsistent content locale', () => {
    const doc = fixture('ko');
    for (const slug of ['', 'copied-columns', 'about', 'columns/author']) expect(hasLegacyColumnsScaffold(doc, 'ko', slug)).toBe(false);
    for (const locale of ['zh-hant', 'en', 'ja'] as const) expect(hasLegacyColumnsScaffold(doc, locale, 'columns')).toBe(false);
    const composite = doc.nodes[1];
    if (composite.kind === 'composite') composite.content.config = { locale: 'zh-hant' };
    expect(hasLegacyColumnsScaffold(doc, 'ko', 'columns')).toBe(false);
  });
});
