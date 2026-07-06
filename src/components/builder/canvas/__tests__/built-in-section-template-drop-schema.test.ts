import { describe, expect, it } from 'vitest';
import {
  builderCanvasDocumentSchema,
  createBlankCanvasDocument,
} from '@/lib/builder/canvas/types';
import { BUILT_IN_SECTIONS } from '@/lib/builder/sections/templates';
import {
  createBuiltInSectionDropSnapshot,
  encodeBuiltInSectionTemplateDragData,
  parseBuiltInSectionTemplateDragData,
} from '../canvasCatalogDrop';

describe('built-in section template drag/drop schema compatibility', () => {
  it('builds canvas-schema-valid section snapshots for every built-in template payload', () => {
    for (const [index, template] of BUILT_IN_SECTIONS.entries()) {
      const payload = parseBuiltInSectionTemplateDragData(
        encodeBuiltInSectionTemplateDragData(template),
      );
      if (!payload) throw new Error(`${template.id}: drag payload did not parse`);

      const position = { x: 120 + index, y: 240 + index };
      const result = createBuiltInSectionDropSnapshot(payload, position);
      const root = result.nodes.find((node) => node.id === result.rootNodeId);

      expect(payload.templateId).toBe(template.id);
      expect(root?.rect.x).toBe(position.x);
      expect(root?.rect.y).toBe(position.y);

      const parsed = builderCanvasDocumentSchema.safeParse({
        ...createBlankCanvasDocument('ko'),
        nodes: result.nodes,
      });

      if (!parsed.success) {
        throw new Error(`${template.id}: ${JSON.stringify(parsed.error.issues)}`);
      }
    }
  });
});
