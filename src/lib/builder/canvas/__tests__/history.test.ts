import { describe, expect, it } from 'vitest';
import { createHistory, pushHistory, redoHistory, undoHistory } from '@/lib/builder/canvas/history';

type TestDocument = {
  id: string;
  nodes: Array<{
    id: string;
    x: number;
  }>;
};

function doc(index: number, sharedNode = { id: 'shared', x: 0 }): TestDocument {
  return {
    id: `doc-${index}`,
    nodes: [
      sharedNode,
      { id: 'moving', x: index },
    ],
  };
}

describe('canvas history', () => {
  it('keeps unlimited session history without the old 100-entry cap', () => {
    let history = createHistory(doc(0));
    for (let index = 1; index <= 125; index += 1) {
      history = pushHistory(history, doc(index));
    }

    expect(history.entries).toHaveLength(126);
    expect(history.canUndo).toBe(true);

    let current = history;
    for (let index = 125; index >= 1; index -= 1) {
      const result = undoHistory(current);
      expect(result?.snapshot.id).toBe(`doc-${index - 1}`);
      current = result!.state;
    }

    expect(current.canUndo).toBe(false);
    expect(current.canRedo).toBe(true);
  });

  it('drops redo entries after a new branch while preserving shared node references', () => {
    const sharedNode = { id: 'shared', x: 0 };
    let history = createHistory(doc(0, sharedNode));
    history = pushHistory(history, doc(1, sharedNode));
    history = pushHistory(history, doc(2, sharedNode));

    const undo = undoHistory(history);
    expect(undo?.snapshot.id).toBe('doc-1');
    expect(undo?.snapshot.nodes[0]).toBe(sharedNode);

    const branched = pushHistory(undo!.state, doc(99, sharedNode));

    expect(branched.entries.map((entry) => entry.snapshot.id)).toEqual(['doc-0', 'doc-1', 'doc-99']);
    expect(branched.canRedo).toBe(false);
    expect(redoHistory(branched)).toBeNull();
    expect(branched.entries[2]?.snapshot.nodes[0]).toBe(sharedNode);
  });
});
