import { describe, expect, it } from 'vitest';
import {
  getComponentLibraryEntrySummary,
  parseComponentLibraryInsertResult,
  resolveComponentLibraryInsertionContext,
  resolveComponentLibraryInsertionParentId,
  type ComponentLibraryEntry,
} from '../component-library-panel.helpers';
import { containerNode, textNode } from './component-library-panel-test-fixtures';

describe('component library payload helpers', () => {
  it('clones nested nodes and remaps the saved root when inserting', () => {
    const section: ComponentLibraryEntry = {
      id: 'lib-1',
      name: 'Hero split',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'container',
        nodes: [
          containerNode({
            id: 'container',
            rect: { x: 12, y: 24, width: 480, height: 320 },
          }),
          textNode({
            id: 'headline',
            parentId: 'container',
            rect: { x: 40, y: 48, width: 240, height: 40 },
          }),
        ],
      }),
    };

    const result = parseComponentLibraryInsertResult(section, 17);

    expect(result).not.toBeNull();
    expect(result?.rootNodeId).toBeTruthy();
    expect(result?.nodes).toHaveLength(2);
    expect(result?.nodes[0]?.id).not.toBe('container');
    expect(result?.nodes[0]?.rect).toEqual({ x: 44, y: 56, width: 480, height: 320 });
    expect(result?.nodes[1]?.parentId).toBe(result?.rootNodeId);
    expect(result?.nodes[0]?.zIndex).toBe(17);
    expect(result?.nodes[1]?.zIndex).toBe(18);
  });

  it('summarizes and selects saved repeater template field groups by cloned root', () => {
    const group: ComponentLibraryEntry = {
      id: 'template-group',
      name: 'Repeater field group',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'template-group-root',
        nodes: [
          containerNode({
            id: 'template-group-root',
            content: { label: 'Case meta group' },
          }),
          textNode({
            id: 'template-title',
            parentId: 'template-group-root',
            dataBinding: {
              targetId: 'home.insights.feed',
              recordIndex: 0,
              fields: { text: 'title' },
            },
          }),
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

    const result = parseComponentLibraryInsertResult(group, 22);

    expect(getComponentLibraryEntrySummary(group)).toEqual({
      rootKind: 'repeaterTemplateGroup',
      nodeCount: 3,
      isValid: true,
    });
    expect(result?.rootNodeId).toBeTruthy();
    expect(result?.selectionNodeIds).toEqual([result?.rootNodeId]);
    expect(result?.nodes.filter((node) => node.parentId === result.rootNodeId)).toHaveLength(2);
  });

  it('resolves the current repeater parent for saved template group insertion', () => {
    const targetId = 'home.insights.feed';
    const group: ComponentLibraryEntry = {
      id: 'template-group',
      name: 'Repeater field group',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'template-group-root',
        nodes: [
          containerNode({ id: 'template-group-root' }),
          textNode({
            id: 'template-title',
            parentId: 'template-group-root',
            dataBinding: {
              targetId,
              recordIndex: 0,
              fields: { text: 'title' },
            },
          }),
        ],
      }),
    };
    const repeater = containerNode({
      id: 'current-repeater',
      content: { layoutMode: 'repeater' },
      dataBinding: {
        targetId,
        recordIndex: 0,
        fields: { title: 'title' },
      },
    });
    const currentGroup = containerNode({ id: 'current-group', parentId: repeater.id });
    const nodesById = new Map([
      [repeater.id, repeater],
      [currentGroup.id, currentGroup],
    ]);

    expect(resolveComponentLibraryInsertionParentId(group, ['current-group'], nodesById)).toBe('current-repeater');
    expect(resolveComponentLibraryInsertionContext(group, ['current-group'], nodesById)).toEqual({
      parentNodeId: 'current-repeater',
    });
  });

  it('rebinds saved template groups to the current repeater target when inserting across repeaters', () => {
    const savedTargetId = 'home.insights.feed';
    const currentTargetId = 'home.services.list';
    const group: ComponentLibraryEntry = {
      id: 'template-group',
      name: 'Portable repeater field group',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'template-group-root',
        nodes: [
          containerNode({ id: 'template-group-root' }),
          textNode({
            id: 'template-title',
            parentId: 'template-group-root',
            dataBinding: {
              targetId: savedTargetId,
              recordIndex: 0,
              fields: { text: 'title' },
            },
          }),
          textNode({
            id: 'template-description',
            parentId: 'template-group-root',
            dataBinding: {
              targetId: savedTargetId,
              recordIndex: 0,
              fields: { text: 'description' },
            },
          }),
        ],
      }),
    };
    const repeater = containerNode({
      id: 'services-repeater',
      content: { layoutMode: 'repeater' },
      dataBinding: {
        targetId: currentTargetId,
        recordIndex: 0,
        fields: { title: 'title' },
      },
    });
    const selectedGroup = containerNode({ id: 'selected-service-group', parentId: repeater.id });
    const nodesById = new Map([
      [repeater.id, repeater],
      [selectedGroup.id, selectedGroup],
    ]);

    const context = resolveComponentLibraryInsertionContext(group, [selectedGroup.id], nodesById);
    const result = parseComponentLibraryInsertResult(group, 30, {
      targetIdOverride: context?.targetIdOverride,
    });
    const clonedBindingTargetIds = new Set(
      result?.nodes
        .map((node) => node.dataBinding?.targetId)
        .filter((targetId): targetId is typeof currentTargetId => targetId === currentTargetId),
    );

    expect(context).toEqual({
      parentNodeId: repeater.id,
      targetIdOverride: currentTargetId,
    });
    expect(result?.selectionNodeIds).toEqual([result?.rootNodeId]);
    expect(clonedBindingTargetIds).toEqual(new Set([currentTargetId]));
    expect(result?.nodes.filter((node) => node.dataBinding?.targetId === savedTargetId)).toHaveLength(0);
  });

  it('parses legacy single-node saves and rejects invalid stored nodes', () => {
    const legacyEntry: ComponentLibraryEntry = {
      id: 'lib-legacy',
      name: 'Legacy text',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify(textNode({ id: 'legacy-text', rect: { x: 3, y: 4, width: 120, height: 40 } })),
    };
    const invalidEntry: ComponentLibraryEntry = {
      id: 'lib-invalid',
      name: 'Invalid',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({ id: 'missing-kind' }),
    };

    const result = parseComponentLibraryInsertResult(legacyEntry, 4);

    expect(result?.nodes).toHaveLength(1);
    expect(result?.nodes[0]?.rect).toEqual({ x: 35, y: 36, width: 120, height: 40 });
    expect(parseComponentLibraryInsertResult(invalidEntry, 4)).toBeNull();
  });

  it('summarizes saved component composition from current and legacy payloads', () => {
    const section: ComponentLibraryEntry = {
      id: 'section',
      name: 'Section',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'container',
        nodes: [
          containerNode({ id: 'container' }),
          textNode({ id: 'headline', parentId: 'container' }),
        ],
      }),
    };
    const legacyEntry: ComponentLibraryEntry = {
      id: 'legacy',
      name: 'Legacy text',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify(textNode({ id: 'legacy-text' })),
    };
    const invalidEntry: ComponentLibraryEntry = {
      id: 'invalid',
      name: 'Invalid',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({ id: 'missing-kind' }),
    };

    expect(getComponentLibraryEntrySummary(section)).toEqual({
      rootKind: 'container',
      nodeCount: 2,
      isValid: true,
    });
    expect(getComponentLibraryEntrySummary(legacyEntry)).toEqual({
      rootKind: 'text',
      nodeCount: 1,
      isValid: true,
    });
    expect(getComponentLibraryEntrySummary(invalidEntry)).toEqual({
      rootKind: 'unknown',
      nodeCount: 0,
      isValid: false,
    });
  });
});
