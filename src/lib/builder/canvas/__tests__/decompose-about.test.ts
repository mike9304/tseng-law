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
  it('keeps ko attorney source captions below education and experience rows', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.about('ko');
    const nodes = nodesById(doc);
    const cardIds = [
      'page-about-lead-card',
      'page-about-staff-card-0',
      'page-about-staff-card-1',
      'page-about-partner-card',
    ] as const;

    for (const cardId of cardIds) {
      const source = expectNode(nodes, `${cardId}-source`);
      const education = expectNode(nodes, `${cardId}-education-section`);
      const experience = expectNode(nodes, `${cardId}-experience-section`);
      const actions = expectNode(nodes, `${cardId}-actions`);
      const card = expectNode(nodes, cardId);
      const sourceFloor = Math.max(
        education.rect.y + education.rect.height,
        experience.rect.y + experience.rect.height,
      );

      expect(source.rect.y - sourceFloor, cardId).toBeGreaterThanOrEqual(32);
      expect(actions.rect.y).toBeGreaterThanOrEqual(source.rect.y + source.rect.height);
      expect(actions.rect.y + actions.rect.height).toBeLessThanOrEqual(card.rect.height);
    }
  });

  it('keeps section labels clear of the previous list rows after the ≥32px save clamp', () => {
    // normalizeCanvasDocument clamps every persisted rect to height ≥ 32; the
    // stacking math must already account for that or single-line rows (est.
    // 24–27px) stick out below their section and collide with the next label
    // (the ko about '학력'/'경력' editor overlap).
    const clamp = (height: number) => Math.max(32, Math.round(height));
    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const doc = STANDARD_PAGE_DECOMPOSERS.about(locale);
      const byParent = new Map<string, BuilderCanvasNode[]>();
      for (const node of doc.nodes) {
        if (!node.parentId) continue;
        const list = byParent.get(node.parentId) ?? [];
        list.push(node);
        byParent.set(node.parentId, list);
      }
      const sections = doc.nodes.filter((node) => /-(intro|education|experience)-section$/.test(node.id));
      for (const section of sections) {
        for (const child of byParent.get(section.id) ?? []) {
          if (child.id.endsWith('-label')) continue;
          const rows = byParent.get(child.id) ?? [];
          const rowsBottom = rows.reduce(
            (max, row) => Math.max(max, row.rect.y + clamp(row.rect.height)),
            0,
          );
          expect(
            child.rect.y + child.rect.height,
            `${locale} ${child.id} must contain its clamped rows`,
          ).toBeGreaterThanOrEqual(child.rect.y + rowsBottom);
          expect(
            section.rect.height,
            `${locale} ${section.id} must contain ${child.id}`,
          ).toBeGreaterThanOrEqual(child.rect.y + child.rect.height);
        }
      }
      expect(sections.length).toBeGreaterThan(0);
    }
  });

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
