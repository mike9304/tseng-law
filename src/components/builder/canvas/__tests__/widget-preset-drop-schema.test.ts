import { describe, expect, it } from 'vitest';
import {
  builderCanvasDocumentSchema,
  createBlankCanvasDocument,
} from '@/lib/builder/canvas/types';
import {
  createCatalogDropNode,
  encodeCatalogWidgetPresetDragData,
  parseCatalogWidgetPresetDragData,
  resolveCanvasDropTargetContext,
} from '../canvasCatalogDrop';
import {
  DECORATIVE_WIDGET_PRESETS,
  DESIGNER_WIDGET_PRESETS,
  GALLERY_WIDGET_PRESETS,
  INTERACTIVE_WIDGET_PRESETS,
  LAYOUT_WIDGET_PRESETS,
  LOCATION_WIDGET_PRESETS,
  MEDIA_WIDGET_PRESETS,
  NAVIGATION_WIDGET_PRESETS,
  SOCIAL_WIDGET_PRESETS,
  TEXT_WIDGET_PRESETS,
  type DecorativeWidgetPreset,
  type DesignerWidgetPreset,
  type GalleryWidgetPreset,
  type InteractiveWidgetPreset,
  type LayoutWidgetPreset,
  type LocationWidgetPreset,
  type MediaWidgetPreset,
  type NavigationWidgetPreset,
  type SocialWidgetPreset,
  type TextWidgetPreset,
} from '../SandboxCatalogPanel.presets';
import { containerNode } from './component-library-panel-test-fixtures';

type WidgetPreset =
  | TextWidgetPreset
  | MediaWidgetPreset
  | GalleryWidgetPreset
  | LayoutWidgetPreset
  | InteractiveWidgetPreset
  | NavigationWidgetPreset
  | SocialWidgetPreset
  | LocationWidgetPreset
  | DecorativeWidgetPreset
  | DesignerWidgetPreset;

const WIDGET_PRESET_GROUPS: readonly (readonly WidgetPreset[])[] = [
  TEXT_WIDGET_PRESETS,
  MEDIA_WIDGET_PRESETS,
  GALLERY_WIDGET_PRESETS,
  LAYOUT_WIDGET_PRESETS,
  INTERACTIVE_WIDGET_PRESETS,
  NAVIGATION_WIDGET_PRESETS,
  SOCIAL_WIDGET_PRESETS,
  LOCATION_WIDGET_PRESETS,
  DECORATIVE_WIDGET_PRESETS,
  DESIGNER_WIDGET_PRESETS,
];

describe('Add panel widget preset drag/drop schema compatibility', () => {
  it('builds canvas-schema-valid drop nodes for every widget preset payload', () => {
    const presets = WIDGET_PRESET_GROUPS.flat();

    for (const [index, preset] of presets.entries()) {
      const payload = parseCatalogWidgetPresetDragData(encodeCatalogWidgetPresetDragData(preset));
      if (!payload) throw new Error(`${preset.id}: drag payload did not parse`);

      const node = createCatalogDropNode({
        appWidget: null,
        kind: preset.kind,
        nodeCount: index,
        parentId: null,
        position: { x: 48 + index, y: 64 + index },
        preset: payload,
      });

      const parsed = builderCanvasDocumentSchema.safeParse({
        ...createBlankCanvasDocument('ko'),
        nodes: [node],
      });

      if (!parsed.success) {
        throw new Error(`${preset.id}: ${JSON.stringify(parsed.error.issues)}`);
      }
    }
  });

  it('targets the deepest unlocked container with parent-local drop coordinates', () => {
    const outer = containerNode({
      id: 'outer-container',
      rect: { x: 100, y: 80, width: 640, height: 420 },
      zIndex: 2,
    });
    const inner = containerNode({
      id: 'inner-container',
      parentId: outer.id,
      rect: { x: 40, y: 52, width: 260, height: 180 },
      zIndex: 4,
    });
    const locked = containerNode({
      id: 'locked-inner-container',
      locked: true,
      parentId: inner.id,
      rect: { x: 16, y: 20, width: 120, height: 80 },
      zIndex: 12,
    });
    const nodesById = new Map([
      [outer.id, outer],
      [inner.id, inner],
      [locked.id, locked],
    ]);
    const context = resolveCanvasDropTargetContext({
      absoluteRectById: new Map([
        [outer.id, outer.rect],
        [inner.id, { x: 140, y: 132, width: 260, height: 180 }],
        [locked.id, { x: 156, y: 152, width: 120, height: 80 }],
      ]),
      nodesById,
      position: { x: 176, y: 164 },
      viewport: 'desktop',
      visibleContainerNodes: [outer, inner, locked],
    });

    expect(context).toEqual({
      parentId: inner.id,
      position: { x: 36, y: 32 },
      stagePosition: { x: 176, y: 164 },
    });
  });
});
