import { describe, expect, it } from 'vitest';
import {
  getComponentLibraryEntrySummary,
  type ComponentLibraryEntry,
} from '../component-library-panel.helpers';
import { makeComponentLibraryReviewDiff } from '../component-library-review-diff.helpers';
import { containerNode, textNode } from './component-library-panel-test-fixtures';

function snapshotNodeJson(nodes: readonly ReturnType<typeof containerNode | typeof textNode>[], rootNodeId: string): string {
  return JSON.stringify({ rootNodeId, nodes });
}

describe('component library review diff helpers', () => {
  it('summarizes root kind, node count, text, and binding changes between saved snapshots', () => {
    const savedEntry: ComponentLibraryEntry = {
      id: 'hero',
      name: 'Hero title',
      nodeJson: JSON.stringify(textNode({
        id: 'saved-title',
        content: { text: 'Saved headline' },
        dataBinding: { targetId: 'home.insights.feed', recordIndex: 0, fields: { text: 'title' } },
      })),
      createdAt: '2026-06-01T00:00:00.000Z',
    };
    const nextEntry: ComponentLibraryEntry = {
      ...savedEntry,
      nodeJson: snapshotNodeJson([
        containerNode({ id: 'next-container' }),
        textNode({
          id: 'next-title',
          parentId: 'next-container',
          content: { text: 'Current headline' },
          dataBinding: { targetId: 'home.services.list', recordIndex: 0, fields: { text: 'description' } },
        }),
      ], 'next-container'),
    };

    const diffSummary = makeComponentLibraryReviewDiff({
      previousEntry: savedEntry,
      nextEntry,
      previousSummary: getComponentLibraryEntrySummary(savedEntry),
      nextSummary: getComponentLibraryEntrySummary(nextEntry),
    });

    expect(diffSummary).toEqual({
      hasChanges: true,
      items: [
        { kind: 'rootKind', previousRootKind: 'text', nextRootKind: 'repeaterTemplateGroup' },
        { kind: 'nodeCount', delta: 1 },
        { kind: 'text' },
        { kind: 'binding' },
      ],
      details: [
        { kind: 'text', previousText: 'Saved headline', nextText: 'Current headline' },
        {
          kind: 'binding',
          previousBinding: 'home.insights.feed · text:title',
          nextBinding: 'home.services.list · text:description',
        },
      ],
    });
  });

  it('returns an empty diff when normalized text and binding signatures match', () => {
    const entry: ComponentLibraryEntry = {
      id: 'hero',
      name: 'Hero title',
      nodeJson: JSON.stringify(textNode({
        id: 'saved-title',
        content: { text: 'Same headline' },
        dataBinding: { targetId: 'home.insights.feed', recordIndex: 0, fields: { text: 'title' } },
      })),
      createdAt: '2026-06-01T00:00:00.000Z',
    };
    const nextEntry: ComponentLibraryEntry = {
      ...entry,
      nodeJson: JSON.stringify(textNode({
        id: 'next-title',
        content: { text: ' Same   headline ' },
        dataBinding: { targetId: 'home.insights.feed', recordIndex: 0, fields: { text: 'title' } },
      })),
    };

    expect(makeComponentLibraryReviewDiff({
      previousEntry: entry,
      nextEntry,
      previousSummary: getComponentLibraryEntrySummary(entry),
      nextSummary: getComponentLibraryEntrySummary(nextEntry),
    })).toEqual({ hasChanges: false, items: [], details: [] });
  });
});
