import { describe, expect, it } from 'vitest';
import type { ComponentLibraryEntry } from '../component-library-panel.helpers';
import { makeComponentLibraryRestoreReview } from '../component-library-restore-review.helpers';
import { containerNode, textNode } from './component-library-panel-test-fixtures';

describe('component library restore review helpers', () => {
  it('builds a review comparing the current saved entry with the previous version', () => {
    const previousNodeJson = JSON.stringify(textNode({ id: 'saved-title' }));
    const entry: ComponentLibraryEntry = {
      id: 'hero',
      name: 'Hero title',
      nodeJson: JSON.stringify({ rootNodeId: 'current-container', nodes: [
        containerNode({ id: 'current-container' }),
      ] }),
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
      versions: [{ nodeJson: ` ${previousNodeJson} `, savedAt: '2026-06-01T00:00:00.000Z', label: ' Launch hero ' }],
    };
    const currentNodeJson = entry.nodeJson.trim();

    const review = makeComponentLibraryRestoreReview(entry);

    expect(review).toEqual({
      entryId: 'hero',
      entryName: 'Hero title',
      currentNodeJson,
      restoredNodeJson: previousNodeJson,
      selectedVersionIndex: 0,
      versions: [
        {
          index: 0,
          nodeJson: previousNodeJson,
          savedAt: '2026-06-01T00:00:00.000Z',
          label: 'Launch hero',
          summary: { rootKind: 'text', nodeCount: 1, isValid: true },
        },
      ],
      currentSummary: { rootKind: 'container', nodeCount: 1, isValid: true },
      previousSummary: { rootKind: 'text', nodeCount: 1, isValid: true },
      diffSummary: {
        hasChanges: true,
        items: [
          { kind: 'rootKind', previousRootKind: 'container', nextRootKind: 'text' },
          { kind: 'text' },
        ],
        details: [
          { kind: 'text', previousText: 'Container', nextText: 'Node' },
        ],
      },
    });
  });

  it('selects an older valid restore version by its original history index', () => {
    const previousNodeJson = JSON.stringify(textNode({ id: 'previous-title' }));
    const oldestNodeJson = JSON.stringify(textNode({ id: 'oldest-title' }));
    const entry: ComponentLibraryEntry = {
      id: 'hero',
      name: 'Hero title',
      nodeJson: JSON.stringify(containerNode({ id: 'current-container' })),
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
      versions: [
        { nodeJson: previousNodeJson, savedAt: '2026-06-02T00:00:00.000Z' },
        { nodeJson: '{"id":"missing-kind"}', savedAt: '2026-06-01T12:00:00.000Z' },
        { nodeJson: oldestNodeJson, savedAt: '2026-06-01T00:00:00.000Z' },
      ],
    };

    const review = makeComponentLibraryRestoreReview(entry, 2);

    expect(review?.restoredNodeJson).toBe(oldestNodeJson);
    expect(review?.selectedVersionIndex).toBe(2);
    expect(review?.versions.map((version) => version.index)).toEqual([0, 2]);
    expect(review?.previousSummary).toEqual({ rootKind: 'text', nodeCount: 1, isValid: true });
    expect(review?.diffSummary.items).toContainEqual({
      kind: 'rootKind',
      previousRootKind: 'container',
      nextRootKind: 'text',
    });
  });

  it('does not create a review without a valid previous version', () => {
    const entry: ComponentLibraryEntry = {
      id: 'hero',
      name: 'Hero title',
      nodeJson: JSON.stringify(textNode({ id: 'saved-title' })),
      createdAt: '2026-06-01T00:00:00.000Z',
    };

    expect(makeComponentLibraryRestoreReview(entry)).toBeNull();
    expect(makeComponentLibraryRestoreReview({
      ...entry,
      versions: [{ nodeJson: '{"id":"missing-kind"}', savedAt: '2026-06-01T00:00:00.000Z' }],
    })).toBeNull();
    expect(makeComponentLibraryRestoreReview({
      ...entry,
      versions: [{ nodeJson: entry.nodeJson, savedAt: '2026-06-01T00:00:00.000Z' }],
    })).toBeNull();
  });
});
