/**
 * Phase 2 — Undo/redo history for the canvas store.
 *
 * Stores full snapshots of the nodes array (not patches — simpler and
 * more reliable for a flat node list that's typically < 100 entries).
 * Ring buffer capped at MAX_HISTORY so memory stays bounded.
 *
 * Usage: wrap the store's mutating actions with `history.push(nodes)`
 * before mutation, then the user can call `undo()` / `redo()` to
 * navigate the timeline.
 */

export interface HistoryEntry<T> {
  snapshot: T;
  timestamp: number;
}

export interface HistoryState<T> {
  entries: HistoryEntry<T>[];
  cursor: number;
  canUndo: boolean;
  canRedo: boolean;
}

const MAX_HISTORY = 100;

export function createHistory<T>(initial: T): HistoryState<T> {
  return {
    entries: [{ snapshot: structuredClone(initial), timestamp: Date.now() }],
    cursor: 0,
    canUndo: false,
    canRedo: false,
  };
}

export function pushHistory<T>(state: HistoryState<T>, snapshot: T): HistoryState<T> {
  const cloned = structuredClone(snapshot);
  const newCursor = state.cursor + 1;
  // Drop anything after current cursor (discard redo stack on new action)
  const entries = state.entries.slice(0, newCursor);
  entries.push({ snapshot: cloned, timestamp: Date.now() });

  // Enforce ring buffer cap
  if (entries.length > MAX_HISTORY) {
    entries.shift();
    return {
      entries,
      cursor: entries.length - 1,
      canUndo: entries.length > 1,
      canRedo: false,
    };
  }

  return {
    entries,
    cursor: newCursor,
    canUndo: newCursor > 0,
    canRedo: false,
  };
}

export function undoHistory<T>(state: HistoryState<T>): { state: HistoryState<T>; snapshot: T } | null {
  if (state.cursor <= 0) return null;
  const newCursor = state.cursor - 1;
  const entry = state.entries[newCursor];
  if (!entry) return null;
  return {
    state: {
      ...state,
      cursor: newCursor,
      canUndo: newCursor > 0,
      canRedo: true,
    },
    snapshot: structuredClone(entry.snapshot),
  };
}

export function redoHistory<T>(state: HistoryState<T>): { state: HistoryState<T>; snapshot: T } | null {
  if (state.cursor >= state.entries.length - 1) return null;
  const newCursor = state.cursor + 1;
  const entry = state.entries[newCursor];
  if (!entry) return null;
  return {
    state: {
      ...state,
      cursor: newCursor,
      canUndo: true,
      canRedo: newCursor < state.entries.length - 1,
    },
    snapshot: structuredClone(entry.snapshot),
  };
}
