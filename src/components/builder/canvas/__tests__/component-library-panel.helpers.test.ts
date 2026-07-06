import { describe, expect, it } from 'vitest';
import {
  deleteComponentLibraryEntryVersion,
  duplicateComponentLibraryEntry,
  filterAndSortComponentLibraryEntries,
  parseComponentLibrarySortMode,
  renameComponentLibraryEntry,
  renameComponentLibraryEntryVersion,
  restoreComponentLibraryEntryVersion,
  toggleComponentLibraryEntryPinned,
  updateComponentLibraryEntryPayload,
  type ComponentLibraryEntry,
} from '../component-library-panel.helpers';
import {
  getComponentLibraryShortcutEntries,
  getComponentLibraryShortcutGroups,
} from '../component-library-shortcut.helpers';

describe('component library panel helpers', () => {
  it('filters entries by name and sorts them by the selected mode', () => {
    const entries: ComponentLibraryEntry[] = [
      { id: 'old', name: 'Footer strip', nodeJson: '{}', createdAt: '2026-06-01T00:00:00.000Z' },
      { id: 'new', name: 'Hero section', nodeJson: '{}', createdAt: '2026-06-03T00:00:00.000Z' },
      {
        id: 'mid',
        name: 'Hero callout',
        nodeJson: '{}',
        createdAt: '2026-06-02T00:00:00.000Z',
        updatedAt: '2026-06-04T00:00:00.000Z',
        pinned: true,
      },
    ];

    expect(filterAndSortComponentLibraryEntries(entries, 'hero', 'recent').map((entry) => entry.id)).toEqual([
      'mid',
      'new',
    ]);
    expect(filterAndSortComponentLibraryEntries(entries, '', 'recent').map((entry) => entry.id)).toEqual([
      'mid',
      'new',
      'old',
    ]);
    expect(filterAndSortComponentLibraryEntries(entries, '', 'name').map((entry) => entry.id)).toEqual([
      'mid',
      'old',
      'new',
    ]);
    expect(parseComponentLibrarySortMode('name')).toBe('name');
    expect(parseComponentLibrarySortMode('unexpected')).toBe('recent');
  });

  it('renames a saved component without mutating the entry payload', () => {
    const entries: ComponentLibraryEntry[] = [
      { id: 'hero', name: 'Hero title', nodeJson: '{"id":"hero"}', createdAt: '2026-06-01T00:00:00.000Z' },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ];

    const renamed = renameComponentLibraryEntry(entries, 'hero', '  Homepage hero  ');
    const ignored = renameComponentLibraryEntry(entries, 'hero', '   ');

    expect(renamed).toEqual([
      { id: 'hero', name: 'Homepage hero', nodeJson: '{"id":"hero"}', createdAt: '2026-06-01T00:00:00.000Z' },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ]);
    expect(renamed).not.toBe(entries);
    expect(renamed[0]).not.toBe(entries[0]);
    expect(renamed[1]).toBe(entries[1]);
    expect(ignored).toBe(entries);
  });

  it('duplicates a saved component with a fresh id and localized copy name', () => {
    const entries: ComponentLibraryEntry[] = [
      { id: 'hero', name: 'Hero title', nodeJson: '{"id":"hero"}', createdAt: '2026-06-01T00:00:00.000Z' },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ];

    const duplicated = duplicateComponentLibraryEntry(
      entries,
      'hero',
      'hero-copy',
      '2026-06-03T00:00:00.000Z',
      'Hero title copy',
    );
    const ignoredMissing = duplicateComponentLibraryEntry(
      entries,
      'missing',
      'missing-copy',
      '2026-06-03T00:00:00.000Z',
      'Missing copy',
    );
    const ignoredDuplicateId = duplicateComponentLibraryEntry(
      entries,
      'hero',
      'footer',
      '2026-06-03T00:00:00.000Z',
      'Hero title copy',
    );

    expect(duplicated).toEqual([
      { id: 'hero', name: 'Hero title', nodeJson: '{"id":"hero"}', createdAt: '2026-06-01T00:00:00.000Z' },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
      { id: 'hero-copy', name: 'Hero title copy', nodeJson: '{"id":"hero"}', createdAt: '2026-06-03T00:00:00.000Z' },
    ]);
    expect(duplicated).not.toBe(entries);
    expect(ignoredMissing).toBe(entries);
    expect(ignoredDuplicateId).toBe(entries);
  });

  it('toggles a saved component pin without mutating unrelated entries', () => {
    const entries: ComponentLibraryEntry[] = [
      { id: 'hero', name: 'Hero title', nodeJson: '{"id":"hero"}', createdAt: '2026-06-01T00:00:00.000Z' },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ];

    const pinned = toggleComponentLibraryEntryPinned(entries, 'hero');
    const unpinned = toggleComponentLibraryEntryPinned(pinned, 'hero');
    const ignored = toggleComponentLibraryEntryPinned(entries, 'missing');

    expect(pinned).toEqual([
      { id: 'hero', name: 'Hero title', nodeJson: '{"id":"hero"}', createdAt: '2026-06-01T00:00:00.000Z', pinned: true },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ]);
    expect(unpinned).toEqual(entries);
    expect(pinned).not.toBe(entries);
    expect(pinned[0]).not.toBe(entries[0]);
    expect(pinned[1]).toBe(entries[1]);
    expect(ignored).toBe(entries);
  });

  it('updates a saved component payload and names the archived snapshot', () => {
    const entries: ComponentLibraryEntry[] = [
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"old"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        pinned: true,
        versions: [{ nodeJson: '{"id":"first"}', savedAt: '2026-05-31T00:00:00.000Z', label: ' First baseline ' }],
      },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ];

    const updated = updateComponentLibraryEntryPayload(entries, {
      id: 'hero',
      nextNodeJson: '{"id":"new"}',
      updatedAt: '2026-06-03T00:00:00.000Z',
      snapshotLabel: ' First saved hero ',
    });
    const ignoredEmpty = updateComponentLibraryEntryPayload(entries, {
      id: 'hero',
      nextNodeJson: '   ',
      updatedAt: '2026-06-03T00:00:00.000Z',
    });
    const ignoredMissing = updateComponentLibraryEntryPayload(entries, {
      id: 'missing',
      nextNodeJson: '{"id":"new"}',
      updatedAt: '2026-06-03T00:00:00.000Z',
    });

    expect(updated).toEqual([
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"new"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-03T00:00:00.000Z',
        pinned: true,
        versions: [
          { nodeJson: '{"id":"old"}', savedAt: '2026-06-01T00:00:00.000Z', label: 'First saved hero' },
          { nodeJson: '{"id":"first"}', savedAt: '2026-05-31T00:00:00.000Z', label: 'First baseline' },
        ],
      },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ]);
    expect(updated).not.toBe(entries);
    expect(updated[0]).not.toBe(entries[0]);
    expect(updated[1]).toBe(entries[1]);
    expect(ignoredEmpty).toBe(entries);
    expect(ignoredMissing).toBe(entries);
  });

  it('restores the latest saved component version and keeps the displaced payload undoable', () => {
    const entries: ComponentLibraryEntry[] = [
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"current"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-03T00:00:00.000Z',
        versions: [
          { nodeJson: '{"id":"previous"}', savedAt: '2026-06-01T00:00:00.000Z', label: 'Previous named' },
          { nodeJson: '{"id":"oldest"}', savedAt: '2026-05-31T00:00:00.000Z', label: 'Oldest named' },
        ],
      },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ];

    const restored = restoreComponentLibraryEntryVersion(
      entries,
      { id: 'hero', restoredAt: '2026-06-04T00:00:00.000Z' },
    );
    const ignoredMissing = restoreComponentLibraryEntryVersion(
      entries,
      { id: 'missing', restoredAt: '2026-06-04T00:00:00.000Z' },
    );

    expect(restored).toEqual([
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"previous"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-04T00:00:00.000Z',
        versions: [
          { nodeJson: '{"id":"current"}', savedAt: '2026-06-03T00:00:00.000Z' },
          { nodeJson: '{"id":"oldest"}', savedAt: '2026-05-31T00:00:00.000Z', label: 'Oldest named' },
        ],
      },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ]);
    expect(restored).not.toBe(entries);
    expect(restored[0]).not.toBe(entries[0]);
    expect(restored[1]).toBe(entries[1]);
    expect(ignoredMissing).toBe(entries);
  });

  it('restores a selected saved component version and keeps the remaining history', () => {
    const entries: ComponentLibraryEntry[] = [
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"current"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-03T00:00:00.000Z',
        versions: [
          { nodeJson: '{"id":"previous"}', savedAt: '2026-06-01T00:00:00.000Z', label: 'Previous named' },
          { nodeJson: '{"id":"oldest"}', savedAt: '2026-05-31T00:00:00.000Z', label: 'Oldest named' },
        ],
      },
    ];

    const restored = restoreComponentLibraryEntryVersion(
      entries,
      { id: 'hero', restoredAt: '2026-06-04T00:00:00.000Z', versionIndex: 1 },
    );

    expect(restored).toEqual([
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"oldest"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-04T00:00:00.000Z',
        versions: [
          { nodeJson: '{"id":"current"}', savedAt: '2026-06-03T00:00:00.000Z' },
          { nodeJson: '{"id":"previous"}', savedAt: '2026-06-01T00:00:00.000Z', label: 'Previous named' },
        ],
      },
    ]);
  });

  it('renames a saved component history snapshot without changing its payload', () => {
    const entries: ComponentLibraryEntry[] = [
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"current"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        versions: [
          { nodeJson: '{"id":"previous"}', savedAt: '2026-06-01T00:00:00.000Z' },
          { nodeJson: '{"id":"oldest"}', savedAt: '2026-05-31T00:00:00.000Z', label: 'Oldest named' },
        ],
      },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ];

    const renamed = renameComponentLibraryEntryVersion(entries, {
      id: 'hero',
      versionIndex: 0,
      label: ' Launch baseline ',
    });
    const cleared = renameComponentLibraryEntryVersion(renamed, {
      id: 'hero',
      versionIndex: 1,
      label: '   ',
    });
    const ignoredMissing = renameComponentLibraryEntryVersion(entries, {
      id: 'missing',
      versionIndex: 0,
      label: 'Ignored',
    });

    expect(renamed).toEqual([
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"current"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        versions: [
          { nodeJson: '{"id":"previous"}', savedAt: '2026-06-01T00:00:00.000Z', label: 'Launch baseline' },
          { nodeJson: '{"id":"oldest"}', savedAt: '2026-05-31T00:00:00.000Z', label: 'Oldest named' },
        ],
      },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ]);
    expect(cleared[0]?.versions?.[1]).toEqual({
      nodeJson: '{"id":"oldest"}',
      savedAt: '2026-05-31T00:00:00.000Z',
    });
    expect(renamed).not.toBe(entries);
    expect(renamed[0]).not.toBe(entries[0]);
    expect(renamed[1]).toBe(entries[1]);
    expect(ignoredMissing).toBe(entries);
  });

  it('deletes a saved component history snapshot without changing the current payload', () => {
    const entries: ComponentLibraryEntry[] = [
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"current"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-03T00:00:00.000Z',
        pinned: true,
        versions: [
          { nodeJson: '{"id":"previous"}', savedAt: '2026-06-01T00:00:00.000Z', label: 'Previous named' },
          { nodeJson: '{"id":"oldest"}', savedAt: '2026-05-31T00:00:00.000Z', label: 'Oldest named' },
        ],
      },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ];

    const deleted = deleteComponentLibraryEntryVersion(entries, { id: 'hero', versionIndex: 0 });
    const deletedLast = deleteComponentLibraryEntryVersion(deleted, { id: 'hero', versionIndex: 0 });
    const ignoredMissing = deleteComponentLibraryEntryVersion(entries, { id: 'hero', versionIndex: 9 });

    expect(deleted).toEqual([
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"current"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-03T00:00:00.000Z',
        pinned: true,
        versions: [
          { nodeJson: '{"id":"oldest"}', savedAt: '2026-05-31T00:00:00.000Z', label: 'Oldest named' },
        ],
      },
      { id: 'footer', name: 'Footer strip', nodeJson: '{"id":"footer"}', createdAt: '2026-06-02T00:00:00.000Z' },
    ]);
    expect(deletedLast[0]).toEqual({
      id: 'hero',
      name: 'Hero title',
      nodeJson: '{"id":"current"}',
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
      pinned: true,
    });
    expect(deleted).not.toBe(entries);
    expect(deleted[0]).not.toBe(entries[0]);
    expect(deleted[1]).toBe(entries[1]);
    expect(ignoredMissing).toBe(entries);
  });

  it('preserves saved component versions when unpinning', () => {
    const entries: ComponentLibraryEntry[] = [
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"current"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-03T00:00:00.000Z',
        pinned: true,
        versions: [{ nodeJson: '{"id":"previous"}', savedAt: '2026-06-01T00:00:00.000Z', label: 'Previous named' }],
      },
    ];

    const unpinned = toggleComponentLibraryEntryPinned(entries, 'hero');

    expect(unpinned).toEqual([
      {
        id: 'hero',
        name: 'Hero title',
        nodeJson: '{"id":"current"}',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-03T00:00:00.000Z',
        versions: [{ nodeJson: '{"id":"previous"}', savedAt: '2026-06-01T00:00:00.000Z', label: 'Previous named' }],
      },
    ]);
  });

  it('uses updated timestamps for recent sorting inside the same pin group', () => {
    const entries: ComponentLibraryEntry[] = [
      { id: 'old', name: 'Old card', nodeJson: '{}', createdAt: '2026-06-01T00:00:00.000Z' },
      { id: 'updated', name: 'Updated card', nodeJson: '{}', createdAt: '2026-05-01T00:00:00.000Z', updatedAt: '2026-06-03T00:00:00.000Z' },
      { id: 'new', name: 'New card', nodeJson: '{}', createdAt: '2026-06-02T00:00:00.000Z' },
    ];

    expect(filterAndSortComponentLibraryEntries(entries, '', 'recent').map((entry) => entry.id)).toEqual([
      'updated',
      'new',
      'old',
    ]);
  });

  it('selects pinned and recent valid entries for the shortcut tray', () => {
    const validNodeJson = JSON.stringify({
      id: 'text',
      kind: 'text',
      rect: { x: 0, y: 0, width: 120, height: 40 },
      style: {
        backgroundColor: 'transparent',
        borderColor: '#cbd5e1',
        borderStyle: 'solid',
        borderWidth: 0,
        borderRadius: 0,
        shadowX: 0,
        shadowY: 0,
        shadowBlur: 0,
        shadowSpread: 0,
        shadowColor: 'rgba(15, 23, 42, 0.16)',
        opacity: 100,
      },
      zIndex: 1,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        text: 'Shortcut',
        fontSize: 24,
        color: '#0f172a',
        fontWeight: 'bold',
        align: 'left',
        lineHeight: 1.2,
        letterSpacing: 0,
        fontFamily: 'system-ui',
      },
    });
    const entries: ComponentLibraryEntry[] = [
      { id: 'old', name: 'Old valid', nodeJson: validNodeJson, createdAt: '2026-06-01T00:00:00.000Z' },
      { id: 'broken', name: 'Broken recent', nodeJson: '{"id":"missing-kind"}', createdAt: '2026-06-04T00:00:00.000Z' },
      { id: 'new', name: 'New valid', nodeJson: validNodeJson, createdAt: '2026-06-03T00:00:00.000Z' },
      {
        id: 'pinned',
        name: 'Pinned valid',
        nodeJson: validNodeJson,
        createdAt: '2026-06-02T00:00:00.000Z',
        pinned: true,
      },
    ];

    expect(getComponentLibraryShortcutEntries(entries, 3).map((entry) => entry.id)).toEqual([
      'pinned',
      'new',
      'old',
    ]);
    expect(getComponentLibraryShortcutEntries(entries, 2).map((entry) => entry.id)).toEqual([
      'pinned',
      'new',
    ]);
  });

  it('groups pinned and recent valid entries for the shortcut tray', () => {
    const validNodeJson = JSON.stringify({
      id: 'text',
      kind: 'text',
      rect: { x: 0, y: 0, width: 120, height: 40 },
      style: {
        backgroundColor: 'transparent',
        borderColor: '#cbd5e1',
        borderStyle: 'solid',
        borderWidth: 0,
        borderRadius: 0,
        shadowX: 0,
        shadowY: 0,
        shadowBlur: 0,
        shadowSpread: 0,
        shadowColor: 'rgba(15, 23, 42, 0.16)',
        opacity: 100,
      },
      zIndex: 1,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        text: 'Shortcut',
        fontSize: 24,
        color: '#0f172a',
        fontWeight: 'bold',
        align: 'left',
        lineHeight: 1.2,
        letterSpacing: 0,
        fontFamily: 'system-ui',
      },
    });
    const entries: ComponentLibraryEntry[] = [
      { id: 'old', name: 'Old valid', nodeJson: validNodeJson, createdAt: '2026-06-01T00:00:00.000Z' },
      { id: 'broken', name: 'Broken recent', nodeJson: '{"id":"missing-kind"}', createdAt: '2026-06-04T00:00:00.000Z' },
      { id: 'new', name: 'New valid', nodeJson: validNodeJson, createdAt: '2026-06-03T00:00:00.000Z' },
      {
        id: 'pinned-old',
        name: 'Pinned old',
        nodeJson: validNodeJson,
        createdAt: '2026-06-02T00:00:00.000Z',
        pinned: true,
      },
      {
        id: 'pinned-new',
        name: 'Pinned new',
        nodeJson: validNodeJson,
        createdAt: '2026-06-05T00:00:00.000Z',
        pinned: true,
      },
    ];

    const groups = getComponentLibraryShortcutGroups(entries, { pinnedLimit: 1, recentLimit: 2 });

    expect(groups.pinned.map((entry) => entry.id)).toEqual(['pinned-new']);
    expect(groups.recent.map((entry) => entry.id)).toEqual(['new', 'old']);
    expect(groups.invalidCount).toBe(1);
    expect(groups.validCount).toBe(4);
  });
});
