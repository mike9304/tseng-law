import { describe, expect, it } from 'vitest';
import {
  createHistory,
  jumpHistory,
  pushHistory,
  redoHistory,
  renameHistoryEntry,
  undoHistory,
} from '@/lib/builder/canvas/history';

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

  it('jumps directly to an indexed snapshot and preserves the redo branch', () => {
    let history = createHistory(doc(0));
    history = pushHistory(history, doc(1));
    history = pushHistory(history, doc(2));

    const jumpToInitial = jumpHistory(history, 0);
    expect(jumpToInitial?.snapshot.id).toBe('doc-0');
    expect(jumpToInitial?.state.cursor).toBe(0);
    expect(jumpToInitial?.state.canUndo).toBe(false);
    expect(jumpToInitial?.state.canRedo).toBe(true);

    const jumpToLatest = jumpHistory(jumpToInitial!.state, 2);
    expect(jumpToLatest?.snapshot.id).toBe('doc-2');
    expect(jumpToLatest?.state.cursor).toBe(2);
    expect(jumpToLatest?.state.canUndo).toBe(true);
    expect(jumpToLatest?.state.canRedo).toBe(false);
  });

  it('stores and clears an explicit history entry name without mutating snapshots', () => {
    let history = createHistory(doc(0));
    history = pushHistory(history, doc(1));

    const named = renameHistoryEntry(history, 1, '  Attorney hero aligned  ');

    expect(named?.entries[1]?.name).toBe('Attorney hero aligned');
    expect(named?.entries[1]?.snapshot).toBe(history.entries[1]?.snapshot);
    expect(named?.cursor).toBe(history.cursor);
    expect(named?.canUndo).toBe(history.canUndo);

    const cleared = renameHistoryEntry(named!, 1, '   ');

    expect(cleared?.entries[1]?.name).toBeUndefined();
    expect(cleared?.entries[1]?.snapshot).toBe(history.entries[1]?.snapshot);
  });
});
