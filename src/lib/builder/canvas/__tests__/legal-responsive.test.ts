import { describe, expect, it } from 'vitest';
import { legalPageContent } from '@/data/legal-pages';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { repairLegalPageMobileLayout } from '@/lib/builder/canvas/legal-responsive';
import { STANDARD_PAGE_DECOMPOSERS } from '@/lib/builder/canvas/seed-pages';

function mobileRect(node: BuilderCanvasNode | undefined) {
  const rect = node?.responsive?.mobile?.rect;
  expect(rect).toBeDefined();
  expect(rect).toEqual(expect.objectContaining({ x: expect.any(Number), y: expect.any(Number), width: expect.any(Number), height: expect.any(Number) }));
  return rect as Required<NonNullable<typeof rect>>;
}

function desktopFingerprint(nodes: BuilderCanvasNode[]): string {
  return JSON.stringify(nodes.map((node) => [node.id, node.rect]));
}

function withoutMobileOverride(node: BuilderCanvasNode) {
  const { responsive, ...rest } = node;
  if (!responsive) return rest;
  const { mobile: _mobile, ...nonMobileResponsive } = responsive;
  return { ...rest, responsive: nonMobileResponsive };
}

function withBrokenLegacyMobileRects(nodes: BuilderCanvasNode[], prefix: string): BuilderCanvasNode[] {
  return nodes.map((node) => (
    node.id.startsWith(`${prefix}-legal`)
    || node.id.startsWith(`${prefix}-card`)
    || node.id.startsWith(`${prefix}-section`)
  )
    ? {
        ...node,
        responsive: {
          ...(node.responsive ?? {}),
          mobile: {
            ...(node.responsive?.mobile ?? {}),
            rect: { x: 176, y: 0, width: 169, height: 60 },
          },
        },
      }
    : node);
}

describe('legal page mobile repair', () => {
  for (const slug of ['privacy', 'disclaimer'] as const) {
    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      it(`overwrites broken legacy ${slug}/${locale} overrides with a fitted one-column tree`, () => {
        const prefix = `page-${slug}`;
        const seeded = STANDARD_PAGE_DECOMPOSERS[slug](locale).nodes;
        const broken = withBrokenLegacyMobileRects(seeded, prefix);
        const beforeJson = JSON.stringify(broken);
        const beforeDesktop = desktopFingerprint(broken);

        const repaired = repairLegalPageMobileLayout(broken);
        const byId = new Map(repaired.map((node) => [node.id, node]));
        const cards = repaired
          .filter((node) => new RegExp(`^${prefix}-card-\\d+$`).test(node.id))
          .sort((left, right) => left.zIndex - right.zIndex);

        expect(JSON.stringify(broken)).toBe(beforeJson);
        expect(desktopFingerprint(repaired)).toBe(beforeDesktop);
        expect(repaired.map(withoutMobileOverride)).toEqual(broken.map(withoutMobileOverride));
        expect(cards).toHaveLength(legalPageContent[locale][slug].sections.length);
        expect(mobileRect(byId.get(`${prefix}-legal-root`))).toMatchObject({ x: 0, y: 350, width: 375 });
        expect(mobileRect(byId.get(`${prefix}-legal-container`))).toMatchObject({ x: 0, width: 375 });
        expect(mobileRect(byId.get(`${prefix}-legal-grid`))).toMatchObject({ x: 16, width: 343 });

        let previousBottom = 0;
        for (const card of cards) {
          const cardRect = mobileRect(card);
          expect(cardRect.x).toBe(0);
          expect(cardRect.width).toBe(343);
          expect(cardRect.y).toBeGreaterThanOrEqual(previousBottom);

          const descendants = repaired.filter((node) => {
            let current = node;
            while (current.parentId) {
              if (current.parentId === card.id) return true;
              const parent = byId.get(current.parentId);
              if (!parent) return false;
              current = parent;
            }
            return false;
          });
          for (const descendant of descendants) {
            const rect = mobileRect(descendant);
            expect(rect.width).toBe(295);
            expect(rect.x).toBeGreaterThanOrEqual(0);
            expect(rect.y).toBeGreaterThanOrEqual(0);
            const parent = descendant.parentId ? byId.get(descendant.parentId) : undefined;
            const parentRect = mobileRect(parent);
            expect(rect.x + rect.width).toBeLessThanOrEqual(parentRect.width);
            expect(rect.y + rect.height).toBeLessThanOrEqual(parentRect.height);
          }
          previousBottom = cardRect.y + cardRect.height;
        }

        const gridRect = mobileRect(byId.get(`${prefix}-legal-grid`));
        const containerRect = mobileRect(byId.get(`${prefix}-legal-container`));
        const rootRect = mobileRect(byId.get(`${prefix}-legal-root`));
        expect(gridRect.height).toBe(previousBottom);
        expect(containerRect.height).toBe(gridRect.height);
        expect(containerRect.y + containerRect.height).toBeLessThanOrEqual(rootRect.height);
      });
    }
  }

  it('reserves rendered article height for zh-Hant clauses without shifting Korean geometry', () => {
    const koNodes = STANDARD_PAGE_DECOMPOSERS.disclaimer('ko').nodes;
    const koCards = koNodes
      .filter((node) => node.parentId === 'page-disclaimer-legal-grid')
      .map((node) => mobileRect(node));
    expect(koCards).toEqual([
      { x: 0, y: 0, width: 343, height: 334 },
      { x: 0, y: 350, width: 343, height: 278 },
      { x: 0, y: 644, width: 343, height: 306 },
    ]);

    const zhNodes = STANDARD_PAGE_DECOMPOSERS.disclaimer('zh-hant').nodes;
    const zhById = new Map(zhNodes.map((node) => [node.id, node]));
    const cardRect = mobileRect(zhById.get('page-disclaimer-card-2'));
    const copyRect = mobileRect(zhById.get('page-disclaimer-card-2-copy'));
    const firstParagraphRect = mobileRect(zhById.get('page-disclaimer-section-2-paragraph-0'));
    const secondParagraphRect = mobileRect(zhById.get('page-disclaimer-section-2-paragraph-1'));

    expect(firstParagraphRect.height).toBe(112);
    expect(secondParagraphRect.height).toBe(84);
    expect(secondParagraphRect.y).toBeGreaterThanOrEqual(firstParagraphRect.y + firstParagraphRect.height + 14);
    // The real .card has a 1px border on each edge: compare its client-height equivalent.
    expect(cardRect.height - 2).toBeGreaterThanOrEqual(copyRect.y + copyRect.height + 24);
  });
});
