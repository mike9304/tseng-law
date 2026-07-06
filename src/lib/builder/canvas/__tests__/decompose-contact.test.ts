import { describe, expect, it } from 'vitest';
import { createContactPageDecomposedNodes } from '../decompose-page-contact';
import { STANDARD_PAGE_DECOMPOSERS } from '../seed-pages';
import type { BuilderCanvasNode } from '../types';

function nodesById(nodes: readonly BuilderCanvasNode[]): Map<string, BuilderCanvasNode> {
  return new Map(nodes.map((node) => [node.id, node]));
}

function expectNode(nodes: Map<string, BuilderCanvasNode>, nodeId: string): BuilderCanvasNode {
  const node = nodes.get(nodeId);
  if (!node) throw new Error(`expected ${nodeId} to exist`);
  return node;
}

function expectContainedByParent(nodes: Map<string, BuilderCanvasNode>, nodeId: string): void {
  const node = expectNode(nodes, nodeId);
  if (!node.parentId) throw new Error(`${nodeId} should have a parent`);
  const parent = expectNode(nodes, node.parentId);
  expect(node.rect.x).toBeGreaterThanOrEqual(0);
  expect(node.rect.y).toBeGreaterThanOrEqual(0);
  expect(node.rect.x + node.rect.width).toBeLessThanOrEqual(parent.rect.width + 1);
  // Live-parity typography (1.82 line-height) makes card detail lists intentionally
  // overhang their fixed-height card frames; the renderer draws the overhang, matching live.
  if (!/-list$/.test(node.id) && node.id !== 'page-contact-guide-grid') {
    expect(node.rect.y + node.rect.height).toBeLessThanOrEqual(parent.rect.height + 1);
  }
}

describe('standard contact page decomposer', () => {
  it('matches the published contact page desktop section geometry', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.contact('ko');
    const nodes = nodesById(doc.nodes);

    expect(doc.stageHeight).toBe(3057);
    expect(nodes.get('page-contact-page-header-root')?.rect).toMatchObject({ y: 0, width: 1280, height: 428 });
    expect(nodes.get('page-contact-guide-root')?.rect).toMatchObject({ y: 428, width: 1280, height: 843 });
    expect(nodes.get('page-contact-contact-root')?.rect).toMatchObject({ y: 1271, width: 1280, height: 867 });
    expect(nodes.get('home-offices-root')?.rect).toMatchObject({ y: 2138, width: 1280, height: 909 });

    expect(nodes.get('page-contact-guide-container')?.rect).toMatchObject({ x: 51, y: 141, width: 1178, height: 529 });
    expect(nodes.get('page-contact-guide-grid')?.rect).toMatchObject({ y: 246, width: 1178, height: 284 });
    expect(nodes.get('page-contact-guide-card-0')?.rect).toMatchObject({ x: 0, width: 382, height: 284 });
    expect(nodes.get('page-contact-guide-card-1')?.rect).toMatchObject({ x: 398, width: 382, height: 284 });
    expect(nodes.get('page-contact-guide-card-2')?.rect).toMatchObject({ x: 796, width: 382, height: 284 });

    expect(nodes.get('page-contact-contact-container')?.rect).toMatchObject({ x: 51, y: 141, width: 1178, height: 585 });
    expect(nodes.get('page-contact-inquiries-grid')?.rect).toMatchObject({ y: 48, width: 1178, height: 192 });
    expect(nodes.get('page-contact-inquiries-card-0')?.rect).toMatchObject({ x: 0, y: 0, width: 282, height: 192 });
    expect(nodes.get('page-contact-inquiries-card-1')?.rect).toMatchObject({ x: 299, y: 0, width: 282, height: 192 });
    expect(nodes.get('page-contact-inquiries-card-2')?.rect).toMatchObject({ x: 597, y: 0, width: 282, height: 192 });
    expect(nodes.get('page-contact-inquiries-card-3')?.rect).toMatchObject({ x: 895, y: 0, width: 282, height: 192 });
    [0, 1, 2, 3].forEach((index) => {
      expect(nodes.get(`page-contact-inquiries-card-${index}-title`)?.rect).toMatchObject({ width: 234 });
      expect(nodes.get(`page-contact-inquiries-block-${index}-list`)?.rect).toMatchObject({ width: 234 });
      expectContainedByParent(nodes, `page-contact-inquiries-card-${index}`);
      expectContainedByParent(nodes, `page-contact-inquiries-card-${index}-title`);
      expectContainedByParent(nodes, `page-contact-inquiries-block-${index}-list`);
    });
    expect(nodes.get('page-contact-locations-grid')?.rect).toMatchObject({ y: 343, width: 1178, height: 163 });
    expect(nodes.get('page-contact-contact-cta')?.rect).toMatchObject({ y: 538, width: 115, height: 47 });

    expect(nodes.get('home-offices-container')?.rect).toMatchObject({ x: 51, y: 141, width: 1178, height: 628 });
    expect(nodes.get('home-offices-layout-0')?.rect).toMatchObject({ y: 206, width: 1178, height: 422 });
    expect(nodes.get('home-offices-layout-0-map')?.rect).toMatchObject({ x: 0, width: 687, height: 422 });
    expect(nodes.get('home-offices-layout-0-card')?.rect).toMatchObject({ x: 704, width: 474, height: 422 });
  });

  it('keeps section offsets relative when built below an existing canvas region', () => {
    const nodes = nodesById(createContactPageDecomposedNodes(200, 'ko', 0));

    expect(nodes.get('page-contact-page-header-root')?.rect).toMatchObject({ y: 200 });
    expect(nodes.get('page-contact-guide-root')?.rect).toMatchObject({ y: 628 });
    expect(nodes.get('page-contact-contact-root')?.rect).toMatchObject({ y: 1471 });
    expect(nodes.get('home-offices-root')?.rect).toMatchObject({ y: 2338 });
  });
});
