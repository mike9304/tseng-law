/**
 * Phase 2 — Undo/redo history for the canvas store.
 *
 * Stores immutable document snapshots. The canvas store updates documents
 * with structural sharing, so history can keep references instead of deep
 * cloning every node on each commit.
 *
 * Usage: wrap the store's mutating actions with `history.push(nodes)`
 * before mutation, then the user can call `undo()` / `redo()` to
 * navigate the timeline.
 */

export interface HistoryEntry<T> {
  snapshot: T;
  timestamp: number;
  name?: string;
}

export interface HistoryState<T> {
  entries: HistoryEntry<T>[];
  cursor: number;
  canUndo: boolean;
  canRedo: boolean;
}

export function createHistory<T>(initial: T): HistoryState<T> {
  return {
    entries: [{ snapshot: initial, timestamp: Date.now() }],
    cursor: 0,
    canUndo: false,
    canRedo: false,
  };
}

export function pushHistory<T>(state: HistoryState<T>, snapshot: T): HistoryState<T> {
  const newCursor = state.cursor + 1;
  // Drop anything after current cursor (discard redo stack on new action)
  const entries = state.entries.slice(0, newCursor);
  entries.push({ snapshot, timestamp: Date.now() });

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
    snapshot: entry.snapshot,
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
    snapshot: entry.snapshot,
  };
}

export function jumpHistory<T>(state: HistoryState<T>, cursor: number): { state: HistoryState<T>; snapshot: T } | null {
  if (!Number.isInteger(cursor) || cursor < 0 || cursor >= state.entries.length) return null;
  const entry = state.entries[cursor];
  if (!entry) return null;
  return {
    state: {
      ...state,
      cursor,
      canUndo: cursor > 0,
      canRedo: cursor < state.entries.length - 1,
    },
    snapshot: entry.snapshot,
  };
}

const HISTORY_ENTRY_NAME_LIMIT = 80;

function normalizeHistoryEntryName(name: string): string {
  const collapsed = name.trim().replace(/\s+/g, ' ');
  return collapsed.length > HISTORY_ENTRY_NAME_LIMIT
    ? collapsed.slice(0, HISTORY_ENTRY_NAME_LIMIT).trim()
    : collapsed;
}

export function renameHistoryEntry<T>(
  state: HistoryState<T>,
  cursor: number,
  name: string,
): HistoryState<T> | null {
  if (!Number.isInteger(cursor) || cursor < 0 || cursor >= state.entries.length) return null;
  const entry = state.entries[cursor];
  if (!entry) return null;

  const normalized = normalizeHistoryEntryName(name);
  const nextEntry: HistoryEntry<T> = normalized
    ? { ...entry, name: normalized }
    : { snapshot: entry.snapshot, timestamp: entry.timestamp };
  if (entry.name === nextEntry.name) return state;

  return {
    ...state,
    entries: state.entries.map((candidate, index) => (index === cursor ? nextEntry : candidate)),
  };
}
