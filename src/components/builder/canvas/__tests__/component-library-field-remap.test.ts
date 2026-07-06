import { describe, expect, it } from 'vitest';
import { makeComponentLibraryFieldOverrideKey } from '../component-library-field-remap.helpers';
import {
  parseComponentLibraryInsertResult,
  type ComponentLibraryEntry,
} from '../component-library-panel.helpers';
import { containerNode, textNode } from './component-library-panel-test-fixtures';

describe('component library field remap helpers', () => {
  it('remaps saved repeater template fields to compatible fields on the current target', () => {
    const group: ComponentLibraryEntry = {
      id: 'template-group',
      name: 'Portable repeater field group',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'template-group-root',
        nodes: [
          containerNode({ id: 'template-group-root' }),
          textNode({
            id: 'template-read-time',
            parentId: 'template-group-root',
            dataBinding: {
              targetId: 'home.insights.feed',
              recordIndex: 0,
              fields: { text: 'readTime', href: 'href' },
            },
          }),
        ],
      }),
    };

    const result = parseComponentLibraryInsertResult(group, 12, {
      targetIdOverride: 'home.services.list',
    });
    const clonedBinding = result?.nodes.find((node) => node.dataBinding)?.dataBinding;

    expect(clonedBinding).toEqual({
      targetId: 'home.services.list',
      recordIndex: 0,
      fields: { text: 'description', href: 'href' },
    });
    expect(result?.fieldRemapSummary).toEqual({
      targetId: 'home.services.list',
      remappedFields: [
        { fieldKey: 'text', sourceFieldId: 'readTime', targetFieldId: 'description' },
      ],
      droppedFields: [],
    });
  });

  it('drops incompatible fields when the current target cannot render that value kind', () => {
    const imageGroup: ComponentLibraryEntry = {
      id: 'template-image-group',
      name: 'Portable image group',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'template-image-root',
        nodes: [
          containerNode({ id: 'template-image-root' }),
          textNode({
            id: 'template-image-caption',
            parentId: 'template-image-root',
            dataBinding: {
              targetId: 'home.insights.feed',
              recordIndex: 0,
              fields: { src: 'featuredImage' },
            },
          }),
        ],
      }),
    };

    const result = parseComponentLibraryInsertResult(imageGroup, 12, {
      targetIdOverride: 'home.services.list',
    });

    expect(result?.nodes.find((node) => node.id.includes('text-lib'))?.dataBinding).toBeUndefined();
    expect(result?.fieldRemapSummary).toEqual({
      targetId: 'home.services.list',
      remappedFields: [],
      droppedFields: [
        { fieldKey: 'src', sourceFieldId: 'featuredImage' },
      ],
    });
  });

  it('uses an operator-selected compatible target field during cross-target insert', () => {
    const group: ComponentLibraryEntry = {
      id: 'template-group-manual',
      name: 'Manual repeater field group',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'template-group-root',
        nodes: [
          containerNode({ id: 'template-group-root' }),
          textNode({
            id: 'template-read-time',
            parentId: 'template-group-root',
            dataBinding: {
              targetId: 'home.insights.feed',
              recordIndex: 0,
              fields: { text: 'readTime' },
            },
          }),
        ],
      }),
    };

    const result = parseComponentLibraryInsertResult(group, 12, {
      targetIdOverride: 'home.services.list',
      fieldOverrides: { [makeComponentLibraryFieldOverrideKey('text', 'readTime')]: 'title' },
    });

    expect(result?.nodes.find((node) => node.dataBinding)?.dataBinding).toEqual({
      targetId: 'home.services.list',
      recordIndex: 0,
      fields: { text: 'title' },
    });
    expect(result?.fieldRemapSummary?.remappedFields).toEqual([
      { fieldKey: 'text', sourceFieldId: 'readTime', targetFieldId: 'title' },
    ]);
  });

  it('lets replacement callers preserve source geometry and choose the z-index base', () => {
    const entry: ComponentLibraryEntry = {
      id: 'plain-title',
      name: 'Plain title',
      createdAt: '2026-06-30T00:00:00.000Z',
      nodeJson: JSON.stringify(textNode({
        id: 'source-title',
        rect: { x: 44, y: 72, width: 180, height: 36 },
        zIndex: 2,
      })),
    };

    const result = parseComponentLibraryInsertResult(entry, 12, {
      baseZIndex: 30,
      rectOffset: { x: 0, y: 0 },
    });

    expect(result?.nodes[0]?.rect).toEqual({ x: 44, y: 72, width: 180, height: 36 });
    expect(result?.nodes[0]?.zIndex).toBe(30);
  });
});
