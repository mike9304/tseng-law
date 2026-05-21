import { describe, expect, it } from 'vitest';
import {
  builderCanvasDocumentSchema,
  builderCanvasNodeSchema,
  type BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import { checkStaleDatasetBindings } from '../checks';
import { runAllChecks } from '../gate-runner';

function makeDocument(nodes: BuilderCanvasDocument['nodes']): BuilderCanvasDocument {
  return builderCanvasDocumentSchema.parse({
    version: 1,
    locale: 'ko',
    updatedAt: '2026-05-18T00:00:00.000Z',
    updatedBy: 'publish-gate-test',
    stageWidth: 1280,
    stageHeight: 720,
    nodes,
  });
}

function makeTextNode(fieldId: string) {
  return builderCanvasNodeSchema.parse({
    id: 'stale-text',
    kind: 'text',
    rect: { x: 0, y: 0, width: 320, height: 80 },
    zIndex: 1,
    content: {
      text: 'Placeholder',
      richText: richTextFromPlainText('Placeholder'),
      fontSize: 24,
      color: '#111827',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: { text: fieldId },
    },
  });
}

function makeImageNode(fieldId: string) {
  return builderCanvasNodeSchema.parse({
    id: 'incompatible-image',
    kind: 'image',
    rect: { x: 0, y: 100, width: 320, height: 180 },
    zIndex: 2,
    content: {
      src: '/images/placeholder-image.svg',
      alt: 'Placeholder',
      fit: 'cover',
      link: null,
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: { src: fieldId },
    },
  });
}

describe('publish gate dataset binding checks', () => {
  it('warns about missing and incompatible dataset field mappings before publish', async () => {
    const document = makeDocument([
      makeTextNode('removedTitle'),
      makeImageNode('title'),
    ]);

    const results = checkStaleDatasetBindings(document);

    expect(results).toEqual([
      expect.objectContaining({
        id: 'data-binding-stale-inventory',
        severity: 'warning',
        category: 'data',
        affectedNodeIds: ['stale-text', 'incompatible-image'],
        message: expect.stringContaining('2 elements / 2 fields'),
      }),
    ]);
    expect(results[0]?.message).toContain('stale-text text: removedTitle');
    expect(results[0]?.message).toContain('incompatible-image src: title');

    const suite = await runAllChecks(document);
    expect(suite.hasBlocker).toBe(false);
    expect(suite.results.some((result) => result.category === 'data')).toBe(true);
    expect(suite.warningCount).toBeGreaterThanOrEqual(2);
  });

  it('passes valid dataset field mappings', () => {
    const document = makeDocument([
      makeTextNode('title'),
      makeImageNode('featuredImage'),
    ]);

    expect(checkStaleDatasetBindings(document)).toEqual([]);
  });
});
