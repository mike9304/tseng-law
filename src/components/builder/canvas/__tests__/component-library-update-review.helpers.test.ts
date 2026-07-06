import { describe, expect, it } from 'vitest';
import type { ComponentLibraryEntry } from '../component-library-panel.helpers';
import { makeComponentLibraryUpdateReview } from '../component-library-update-review.helpers';
import { containerNode, textNode } from './component-library-panel-test-fixtures';

describe('component library update review helpers', () => {
  it('builds a review comparing the saved entry with the next canvas selection', () => {
    const entry: ComponentLibraryEntry = {
      id: 'hero',
      name: 'Hero title',
      nodeJson: JSON.stringify(textNode({ id: 'saved-title' })),
      createdAt: '2026-06-01T00:00:00.000Z',
    };
    const nextNodeJson = ` ${JSON.stringify({ rootNodeId: 'current-container', nodes: [
      containerNode({ id: 'current-container' }),
    ] })} `;

    const review = makeComponentLibraryUpdateReview(entry, nextNodeJson);

    expect(review).toEqual({
      entryId: 'hero',
      entryName: 'Hero title',
      savedNodeJson: entry.nodeJson,
      nextNodeJson: nextNodeJson.trim(),
      savedSummary: { rootKind: 'text', nodeCount: 1, isValid: true },
      nextSummary: { rootKind: 'container', nodeCount: 1, isValid: true },
      diffSummary: {
        hasChanges: true,
        items: [
          { kind: 'rootKind', previousRootKind: 'text', nextRootKind: 'container' },
          { kind: 'text' },
        ],
        details: [
          { kind: 'text', previousText: 'Node', nextText: 'Container' },
        ],
      },
    });
  });

  it('does not create a review for an empty or invalid next selection', () => {
    const entry: ComponentLibraryEntry = {
      id: 'hero',
      name: 'Hero title',
      nodeJson: JSON.stringify(textNode({ id: 'saved-title' })),
      createdAt: '2026-06-01T00:00:00.000Z',
    };

    expect(makeComponentLibraryUpdateReview(entry, '   ')).toBeNull();
    expect(makeComponentLibraryUpdateReview(entry, '{"id":"missing-kind"}')).toBeNull();
  });
});
