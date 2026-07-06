import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { PageTemplate } from '../types';
import { computeTemplateQaScore, getTemplateMetadata } from '../metadata';
import { getTemplateById, getAllTemplates } from '../registry';

function node(kind: BuilderCanvasNode['kind'], id: string): BuilderCanvasNode {
  return {
    id,
    kind,
    rect: { x: 0, y: 0, width: 10, height: 10 },
    style: {} as BuilderCanvasNode['style'],
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {} as BuilderCanvasNode['content'],
  } as BuilderCanvasNode;
}

function makeTemplate(nodes: BuilderCanvasNode[], over: Partial<PageTemplate> = {}): PageTemplate {
  return {
    id: 'x-home',
    name: 'X',
    category: 'agency',
    subcategory: 'home',
    description: 'd',
    document: {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-06-02T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1280,
      stageHeight: 2000,
      nodes,
    } as unknown as PageTemplate['document'],
    ...over,
  };
}

describe('computed template qaScore (WIX-PERFECT #2)', () => {
  it('scores an image-rich, well-sized, varied page higher than a thin one', () => {
    const rich: BuilderCanvasNode[] = [];
    for (let i = 0; i < 50; i++) {
      const kind = (['container', 'heading', 'text', 'button', 'image'] as const)[i % 5];
      rich.push(node(kind, `r${i}`));
    }
    const thin = [node('container', 't0'), node('text', 't1'), node('text', 't2')];

    const richScore = computeTemplateQaScore(makeTemplate(rich));
    const thinScore = computeTemplateQaScore(makeTemplate(thin));
    expect(richScore).toBeGreaterThan(thinScore);
    expect(richScore).toBeGreaterThanOrEqual(85); // image-rich + sized + varied → premium band
    expect(thinScore).toBeLessThan(70); // thin/no-image → not standard+
  });

  it('keeps an explicitly curated qaScore (hero templates win over computed)', () => {
    const lawHome = getTemplateById('law-home');
    expect(lawHome).toBeTruthy();
    const meta = getTemplateMetadata(lawHome!);
    expect(meta.qaScore).toBe(88); // curated literal preserved
    expect(meta.qualityTier).toBe('premium');
  });

  it('gives every rebuilt Track-C home a real (non-blanket) computed score', () => {
    const trackC = ['agency-home', 'saas-home', 'dental-home', 'wedding-home', 'podcast-home'];
    for (const id of trackC) {
      const t = getTemplateById(id);
      expect(t, id).toBeTruthy();
      const meta = getTemplateMetadata(t!);
      // image-rich rebuilds should land at/above the standard band, not stuck at a blanket default
      expect(meta.qaScore, `${id} qaScore`).toBeGreaterThanOrEqual(70);
    }
  });

  it('every template ends up with a qaScore in 0–100 and a tier', () => {
    for (const t of getAllTemplates()) {
      const meta = getTemplateMetadata(t);
      expect(meta.qaScore, `${t.id}`).toBeGreaterThanOrEqual(0);
      expect(meta.qaScore, `${t.id}`).toBeLessThanOrEqual(100);
      expect(meta.qualityTier, `${t.id}`).toBeTruthy();
    }
  });
});
