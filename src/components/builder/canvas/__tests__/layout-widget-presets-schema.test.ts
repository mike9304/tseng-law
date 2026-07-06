import { describe, expect, it } from 'vitest';
import {
  builderCanvasDocumentSchema,
  createBlankCanvasDocument,
} from '@/lib/builder/canvas/types';
import {
  createCatalogDropNode,
  encodeCatalogWidgetPresetDragData,
  parseCatalogWidgetPresetDragData,
} from '../canvasCatalogDrop';
import { LAYOUT_WIDGET_PRESETS } from '../SandboxCatalogPanel.presets';
import { resolveCenteredNode } from '../SandboxCatalogPanel.helpers';

describe('layout widget preset schema compatibility', () => {
  it('builds canvas-schema-valid nodes for every Add panel layout widget preset', () => {
    for (const [index, preset] of LAYOUT_WIDGET_PRESETS.entries()) {
      const seed = resolveCenteredNode(preset.kind, index, index);
      const node = {
        ...seed,
        rect: { ...seed.rect, width: preset.width, height: preset.height },
        content: { ...seed.content, ...preset.content },
        style: { ...seed.style, ...(preset.style ?? {}) },
        anchorName: preset.id === 'layout-sticky-anchor' ? 'services' : seed.anchorName,
      };
      const parsed = builderCanvasDocumentSchema.safeParse({
        ...createBlankCanvasDocument('ko'),
        nodes: [node],
      });

      if (!parsed.success) {
        throw new Error(`${preset.id}: ${JSON.stringify(parsed.error.issues)}`);
      }
    }
  });

  it('creates schema-valid layout preset nodes at the dropped canvas position', () => {
    const preset = LAYOUT_WIDGET_PRESETS.find((candidate) => candidate.id === 'layout-tabs');
    if (!preset) throw new Error('layout-tabs preset missing');

    const payload = parseCatalogWidgetPresetDragData(encodeCatalogWidgetPresetDragData(preset));
    if (!payload) throw new Error('layout-tabs payload missing');

    const node = createCatalogDropNode({
      kind: preset.kind,
      nodeCount: 7,
      position: { x: 312, y: 188 },
      preset: payload,
      parentId: null,
      appWidget: null,
    });

    expect(node.rect).toMatchObject({
      x: 312,
      y: 188,
      width: preset.width,
      height: preset.height,
    });
    expect(node.content).toMatchObject(preset.content);

    const parsed = builderCanvasDocumentSchema.safeParse({
      ...createBlankCanvasDocument('ko'),
      nodes: [node],
    });

    if (!parsed.success) {
      throw new Error(`${preset.id}: ${JSON.stringify(parsed.error.issues)}`);
    }
  });
});
