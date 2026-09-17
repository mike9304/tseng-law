import { describe, expect, it } from 'vitest';

import { locales, type Locale } from '@/lib/locales';
import { STANDARD_PAGE_DECOMPOSERS } from '../seed-pages';
import { resolveViewportRect, type Viewport } from '../responsive';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '../types';

const VIEWPORTS: readonly Viewport[] = ['desktop', 'tablet', 'mobile'];

function nodeById(doc: BuilderCanvasDocument, id: string): BuilderCanvasNode {
  const node = doc.nodes.find((candidate) => candidate.id === id);
  expect(node, `missing node ${id}`).toBeDefined();
  return node!;
}

function expectButtonInsideWrap(button: ReturnType<typeof resolveViewportRect>, wrap: ReturnType<typeof resolveViewportRect>) {
  expect(button.x).toBeGreaterThanOrEqual(0);
  expect(button.y).toBeGreaterThanOrEqual(0);
  expect(button.x + button.width).toBeLessThanOrEqual(wrap.width);
  expect(button.y + button.height).toBeLessThanOrEqual(wrap.height);
}

describe('pricing CTA + note layout', () => {
  it.each(locales)(
    'keeps the %s CTA button inside the wrap and the note below it at every viewport',
    (locale: Locale) => {
      const doc = STANDARD_PAGE_DECOMPOSERS.pricing(locale);
      const wrapNode = nodeById(doc, 'page-pricing-cta-wrap');
      const buttonNode = nodeById(doc, 'page-pricing-cta');
      const noteNode = nodeById(doc, 'page-pricing-cta-note');
      const containerNode = nodeById(doc, 'page-pricing-section-container');

      for (const viewport of VIEWPORTS) {
        const wrap = resolveViewportRect(wrapNode, viewport);
        const button = resolveViewportRect(buttonNode, viewport);
        const note = resolveViewportRect(noteNode, viewport);
        const container = resolveViewportRect(containerNode, viewport);

        expectButtonInsideWrap(button, wrap);
        expect(note.x).toBeGreaterThanOrEqual(0);
        expect(note.x + note.width).toBeLessThanOrEqual(wrap.width);
        expect(note.y).toBeGreaterThanOrEqual(button.y + button.height + 10);
        expect(note.y + note.height).toBeLessThanOrEqual(wrap.height);
        expect(wrap.y + wrap.height).toBeLessThanOrEqual(container.height);
        expect(button.height).toBeLessThanOrEqual(47);
        if (viewport !== 'desktop') {
          expect(button.width).toBeLessThanOrEqual(340);
        }
      }
    },
  );

  it('sizes the zh-hant desktop CTA from the 12-character label instead of the old 97px pin', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.pricing('zh-hant');
    const wrap = resolveViewportRect(nodeById(doc, 'page-pricing-cta-wrap'), 'desktop');
    const button = resolveViewportRect(nodeById(doc, 'page-pricing-cta'), 'desktop');
    const note = resolveViewportRect(nodeById(doc, 'page-pricing-cta-note'), 'desktop');
    const container = resolveViewportRect(nodeById(doc, 'page-pricing-section-container'), 'desktop');
    const root = resolveViewportRect(nodeById(doc, 'page-pricing-section-root'), 'desktop');

    expect(button.width).toBeGreaterThanOrEqual(220);
    expect(button.width).toBeGreaterThan(97);
    expect(button.height).toBe(47);
    expect(button.x).toBe(Math.round((wrap.width - button.width) / 2));
    expect(note.y).toBe(button.height + 10);
    expect(wrap.height).toBeGreaterThan(47);
    expect(wrap.height).toBeGreaterThanOrEqual(note.y + note.height);
    expect(wrap.y + wrap.height).toBeLessThanOrEqual(container.height);
    expect(root.height).toBeGreaterThanOrEqual(container.y + container.height);
    expect(root.height).toBeGreaterThanOrEqual(875);
  });

  it('leaves zh-hant card, disclaimer, and stage floors unchanged when the note is present', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.pricing('zh-hant');
    const grid = resolveViewportRect(nodeById(doc, 'page-pricing-grid'), 'desktop');
    const disclaimerWrap = resolveViewportRect(nodeById(doc, 'page-pricing-disclaimer-wrap'), 'desktop');
    const disclaimer = resolveViewportRect(nodeById(doc, 'page-pricing-disclaimer'), 'desktop');
    const card0 = resolveViewportRect(nodeById(doc, 'page-pricing-card-0'), 'desktop');

    expect(doc.stageHeight).toBe(1450);
    expect(grid).toMatchObject({ y: 67, height: 457 });
    expect(disclaimerWrap).toMatchObject({ x: 0, y: 524, width: 1178, height: 22 });
    expect(disclaimer).toMatchObject({ width: 1178, height: 22 });
    expect(card0).toMatchObject({ x: 0, y: 0, width: 276, height: 457 });
  });
});
