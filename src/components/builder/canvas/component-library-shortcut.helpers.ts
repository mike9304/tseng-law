import {
  filterAndSortComponentLibraryEntries,
  getComponentLibraryEntrySummary,
  type ComponentLibraryEntry,
} from './component-library-panel.helpers';

export interface ComponentLibraryShortcutGroupOptions {
  readonly pinnedLimit: number;
  readonly recentLimit: number;
}

export interface ComponentLibraryShortcutGroups {
  readonly pinned: ComponentLibraryEntry[];
  readonly recent: ComponentLibraryEntry[];
  readonly invalidCount: number;
  readonly validCount: number;
}

export function getComponentLibraryShortcutEntries(
  entries: readonly ComponentLibraryEntry[],
  limit: number,
): ComponentLibraryEntry[] {
  const normalizedLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;
  if (normalizedLimit === 0) return [];
  return filterAndSortComponentLibraryEntries(entries, '', 'recent')
    .filter((entry) => getComponentLibraryEntrySummary(entry).isValid)
    .slice(0, normalizedLimit);
}

export function getComponentLibraryShortcutGroups(
  entries: readonly ComponentLibraryEntry[],
  options: ComponentLibraryShortcutGroupOptions,
): ComponentLibraryShortcutGroups {
  const pinnedLimit = Number.isFinite(options.pinnedLimit) ? Math.max(0, Math.floor(options.pinnedLimit)) : 0;
  const recentLimit = Number.isFinite(options.recentLimit) ? Math.max(0, Math.floor(options.recentLimit)) : 0;
  const validEntries = filterAndSortComponentLibraryEntries(entries, '', 'recent')
    .filter((entry) => getComponentLibraryEntrySummary(entry).isValid);
  const pinned = validEntries
    .filter((entry) => entry.pinned === true)
    .slice(0, pinnedLimit);
  const pinnedIds = new Set(pinned.map((entry) => entry.id));
  const recent = validEntries
    .filter((entry) => entry.pinned !== true && !pinnedIds.has(entry.id))
    .slice(0, recentLimit);

  return {
    pinned,
    recent,
    invalidCount: entries.length - validEntries.length,
    validCount: validEntries.length,
  };
}
