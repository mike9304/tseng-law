import { describe, expect, it } from 'vitest';
import { STANDARD_PAGE_DECOMPOSERS } from '../seed-pages';
import type { BuilderCanvasNode } from '../types';

function nodesById(nodes: readonly BuilderCanvasNode[]): Map<string, BuilderCanvasNode> {
  return new Map(nodes.map((node) => [node.id, node]));
}

describe('standard reviews page decomposer', () => {
  it('keeps the ko reviews section flush after the page header', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.reviews('ko');
    const nodes = nodesById(doc.nodes);

    expect(doc.stageHeight).toBe(1711);
    expect(nodes.get('page-reviews-page-header-root')?.rect).toMatchObject({ y: 0, height: 428 });
    expect(nodes.get('page-reviews-section-root')?.rect).toMatchObject({ y: 428, height: 1282 });
  });

  it('keeps the zh-hant standalone baseline gap after the page header', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.reviews('zh-hant');
    const nodes = nodesById(doc.nodes);

    expect(doc.stageHeight).toBe(1754);
    expect(nodes.get('page-reviews-page-header-root')?.rect).toMatchObject({ y: 0, height: 428 });
    expect(nodes.get('page-reviews-section-root')?.rect).toMatchObject({ y: 472, height: 1282 });
    expect(nodes.get('page-reviews-section-container')?.rect).toMatchObject({ x: 51, y: 141, width: 1178, height: 1001 });
    expect(nodes.get('page-reviews-form-wrap')?.rect).toMatchObject({ x: 269, y: 0, width: 640, height: 759 });
    expect(nodes.get('page-reviews-list-title')?.rect).toMatchObject({ y: 816, width: 1178, height: 24 });
    expect(nodes.get('page-reviews-empty')?.rect).toMatchObject({ y: 864, width: 1178, height: 137 });
  });
});
