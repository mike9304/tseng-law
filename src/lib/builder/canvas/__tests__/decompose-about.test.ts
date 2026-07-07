import { describe, expect, it } from 'vitest';
import { STANDARD_PAGE_DECOMPOSERS } from '../seed-pages';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '../types';

function nodesById(doc: BuilderCanvasDocument): Map<string, BuilderCanvasNode> {
  return new Map(doc.nodes.map((node) => [node.id, node]));
}

function expectNode(nodes: Map<string, BuilderCanvasNode>, id: string): BuilderCanvasNode {
  const node = nodes.get(id);
  if (!node) throw new Error(`expected ${id} to exist`);
  return node;
}

describe('standard about page decomposer', () => {
  it('keeps zh-hant desktop height aligned to the legacy composite reserve without moving sections', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.about('zh-hant');
    const nodes = nodesById(doc);

    expect(doc.stageHeight).toBe(4943);
    expect(expectNode(nodes, 'page-about-page-header-root').rect).toMatchObject({ y: 0, width: 1280, height: 428 });
    expect(expectNode(nodes, 'page-about-firm-intro-root').rect).toMatchObject({ y: 428, width: 1280, height: 1027 });
    expect(expectNode(nodes, 'page-about-attorney-root').rect).toMatchObject({ y: 1455, width: 1280, height: 2207 });
    expect(expectNode(nodes, 'page-about-contact-root').rect).toMatchObject({ y: 3662, width: 1280, height: 1106 });

    const contentBottom = expectNode(nodes, 'page-about-contact-root').rect.y
      + expectNode(nodes, 'page-about-contact-root').rect.height;
    expect(doc.stageHeight - contentBottom).toBe(175);
  });

  it('uses the zh-hant standalone legacy parity overlays', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.about('zh-hant');
    const nodes = nodesById(doc);
    const desktopParityNode = expectNode(nodes, 'about-desktop-parity');
    const parityNode = expectNode(nodes, 'about-mobile-parity');

    expect(expectNode(nodes, 'page-about-page-header-root').zIndex).toBe(0);
    expect(desktopParityNode.parentId).toBeUndefined();
    expect(desktopParityNode.anchorName).toBe('desktop-parity-standalone-about');
    expect(desktopParityNode.rect).toEqual({ x: 0, y: 0, width: 1280, height: 4943 });
    expect(parityNode.parentId).toBeUndefined();
    expect(parityNode.anchorName).toBe('mobile-parity-standalone-about');
    expect(parityNode.rect).toEqual({ x: 0, y: 0, width: 1, height: 1 });
    expect(parityNode.responsive?.mobile?.rect).toEqual({ x: 0, y: 0, width: 375, height: 8205 });
    expect(parityNode.responsive?.tablet?.rect).toEqual({ x: 0, y: 0, width: 768, height: 7498 });
  });
});
