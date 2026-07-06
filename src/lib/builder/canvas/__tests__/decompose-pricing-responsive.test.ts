import { describe, expect, it } from 'vitest';
import { STANDARD_PAGE_DECOMPOSERS } from '../seed-pages';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '../types';

type Viewport = 'mobile' | 'tablet';

function nodesById(doc: BuilderCanvasDocument): Map<string, BuilderCanvasNode> {
  return new Map(doc.nodes.map((node) => [node.id, node]));
}

function rect(node: BuilderCanvasNode | undefined, viewport: Viewport): BuilderCanvasNode['rect'] {
  expect(node, `missing ${viewport} node`).toBeDefined();
  return {
    ...node!.rect,
    ...(node!.responsive?.[viewport]?.rect ?? {}),
  };
}

describe('pricing page responsive decomposition', () => {
  it('stacks mobile pricing cards in source order and keeps CTA after the disclaimer', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.pricing('ko');
    const nodes = nodesById(doc);

    const grid = rect(nodes.get('page-pricing-grid'), 'mobile');
    const disclaimer = rect(nodes.get('page-pricing-disclaimer-wrap'), 'mobile');
    const cta = rect(nodes.get('page-pricing-cta-wrap'), 'mobile');
    const root = rect(nodes.get('page-pricing-section-root'), 'mobile');
    const container = rect(nodes.get('page-pricing-section-container'), 'mobile');
    const cards = [0, 1, 2, 3].map((index) => rect(nodes.get(`page-pricing-card-${index}`), 'mobile'));

    for (let index = 1; index < cards.length; index += 1) {
      expect(cards[index].y).toBeGreaterThan(cards[index - 1].y + cards[index - 1].height);
    }

    expect(grid.height).toBeGreaterThanOrEqual(cards[3].y + cards[3].height);
    expect(disclaimer.y).toBeGreaterThanOrEqual(grid.y + grid.height + 20);
    expect(cta.y).toBeGreaterThanOrEqual(disclaimer.y + disclaimer.height + 20);
    expect(root.height).toBeGreaterThanOrEqual(container.y + cta.y + cta.height + 20);
  });

  it('uses live pricing inline SVG icons instead of number badges', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.pricing('ko');
    const nodes = nodesById(doc);
    const iconNames = ['pricing-consultation', 'pricing-litigation', 'pricing-company', 'pricing-retainer'];

    for (let index = 0; index < 4; index += 1) {
      const icon = nodes.get(`page-pricing-card-${index}-icon-svg`);
      if (!icon || icon.kind !== 'image') {
        throw new Error(`missing pricing icon svg ${index}`);
      }
      expect(icon.content.svg).toMatchObject({ enabled: true, name: iconNames[index], color: 'currentColor' });
      expect(nodes.get(`page-pricing-card-${index}-icon-text`)).toBeUndefined();
    }
  });

  it('matches live mobile pricing card geometry', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.pricing('ko');
    const nodes = nodesById(doc);

    const grid = rect(nodes.get('page-pricing-grid'), 'mobile');
    const cards = [0, 1, 2, 3].map((index) => rect(nodes.get(`page-pricing-card-${index}`), 'mobile'));
    const icon = rect(nodes.get('page-pricing-card-0-icon'), 'mobile');
    const iconSvg = rect(nodes.get('page-pricing-card-0-icon-svg'), 'mobile');
    const title = rect(nodes.get('page-pricing-card-0-title'), 'mobile');
    const price = rect(nodes.get('page-pricing-card-0-price'), 'mobile');
    const details = rect(nodes.get('page-pricing-card-0-details'), 'mobile');

    expect(grid.y).toBe(115);
    expect(grid.height).toBe(1770);
    expect(cards.map((card) => Math.round(card.height))).toEqual([404, 433, 457, 404]);
    expect(cards.map((card) => Math.round(card.y))).toEqual([0, 428, 885, 1366]);
    expect(icon).toMatchObject({ x: 131, y: 33, width: 78, height: 78 });
    expect(iconSvg).toMatchObject({ x: 19, y: 19, width: 40, height: 40 });
    expect(title).toMatchObject({ x: 25, y: 123, width: 290, height: 25 });
    expect(price).toMatchObject({ x: 25, y: 163, width: 290, height: 72 });
    expect(details).toMatchObject({ x: 25, y: 260, width: 290, height: 96 });
  });

  it('keeps tablet pricing CTA below the card grid and disclaimer', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.pricing('ko');
    const nodes = nodesById(doc);

    const grid = rect(nodes.get('page-pricing-grid'), 'tablet');
    const disclaimer = rect(nodes.get('page-pricing-disclaimer-wrap'), 'tablet');
    const cta = rect(nodes.get('page-pricing-cta-wrap'), 'tablet');
    const cards = [0, 1, 2, 3].map((index) => rect(nodes.get(`page-pricing-card-${index}`), 'tablet'));

    expect(cards[0].y).toBe(cards[1].y);
    expect(cards[2].y).toBe(cards[3].y);
    expect(cards[2].y).toBeGreaterThan(cards[1].y + cards[1].height);
    expect(grid.height).toBeGreaterThanOrEqual(Math.max(
      cards[2].y + cards[2].height,
      cards[3].y + cards[3].height,
    ));
    expect(disclaimer.y).toBeGreaterThanOrEqual(grid.y + grid.height + 20);
    expect(cta.y).toBeGreaterThanOrEqual(disclaimer.y + disclaimer.height + 20);
  });
});
