import type { ComponentLibraryEntry, ComponentLibraryEntryVersion } from './component-library-panel.helpers';

const COMPONENT_LIBRARY_VERSION_HISTORY_LIMIT = 5;
const COMPONENT_LIBRARY_VERSION_LABEL_LIMIT = 80;

export interface ComponentLibraryRestoreEntryOptions {
  readonly id: string;
  readonly restoredAt: string;
  readonly versionIndex?: number;
}

export interface ComponentLibraryRenameEntryVersionOptions {
  readonly id: string;
  readonly versionIndex: number;
  readonly label: string;
}

export interface ComponentLibraryDeleteEntryVersionOptions {
  readonly id: string;
  readonly versionIndex: number;
}

export interface ComponentLibraryUpdateEntryPayloadOptions {
  readonly id: string;
  readonly nextNodeJson: string;
  readonly updatedAt: string;
  readonly snapshotLabel?: string;
}

function normalizeEntryName(value: string): string {
  return value.trim().slice(0, 80);
}

function normalizeVersionLabel(value: string | undefined): string | undefined {
  const label = value?.trim().slice(0, COMPONENT_LIBRARY_VERSION_LABEL_LIMIT) ?? '';
  return label.length > 0 ? label : undefined;
}

function compactComponentLibraryVersions(
  versions: readonly ComponentLibraryEntryVersion[],
): readonly ComponentLibraryEntryVersion[] {
  const seen = new Set<string>();
  const compacted: ComponentLibraryEntryVersion[] = [];
  for (const version of versions) {
    const nodeJson = version.nodeJson.trim();
    const savedAt = version.savedAt.trim();
    if (!nodeJson || !savedAt) continue;
    const key = `${savedAt}\u0000${nodeJson}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const label = normalizeVersionLabel(version.label);
    compacted.push({
      nodeJson,
      savedAt,
      ...(label ? { label } : {}),
    });
    if (compacted.length >= COMPONENT_LIBRARY_VERSION_HISTORY_LIMIT) break;
  }
  return compacted;
}

function makeComponentLibraryEntryVersion(
  entry: ComponentLibraryEntry,
  snapshotLabel?: string,
): ComponentLibraryEntryVersion {
  const label = normalizeVersionLabel(snapshotLabel);
  return {
    nodeJson: entry.nodeJson,
    savedAt: entry.updatedAt ?? entry.createdAt,
    ...(label ? { label } : {}),
  };
}

function withVersions(
  entry: Omit<ComponentLibraryEntry, 'versions'>,
  versions: readonly ComponentLibraryEntryVersion[],
): ComponentLibraryEntry {
  const compacted = compactComponentLibraryVersions(versions);
  return compacted.length > 0 ? { ...entry, versions: compacted } : entry;
}

function withEntryVersions(
  entry: ComponentLibraryEntry,
  versions: readonly ComponentLibraryEntryVersion[],
): ComponentLibraryEntry {
  const base = {
    id: entry.id,
    name: entry.name,
    nodeJson: entry.nodeJson,
    createdAt: entry.createdAt,
    ...(entry.updatedAt ? { updatedAt: entry.updatedAt } : {}),
    ...(entry.pinned === true ? { pinned: true } : {}),
  };
  return withVersions(base, versions);
}

function omitPinned(entry: ComponentLibraryEntry): ComponentLibraryEntry {
  const base = {
    id: entry.id,
    name: entry.name,
    nodeJson: entry.nodeJson,
    createdAt: entry.createdAt,
  };
  const unpinned = entry.updatedAt ? { ...base, updatedAt: entry.updatedAt } : base;
  return withVersions(unpinned, entry.versions ?? []);
}

export function renameComponentLibraryEntry(
  entries: readonly ComponentLibraryEntry[],
  id: string,
  nextName: string,
): readonly ComponentLibraryEntry[] {
  const name = normalizeEntryName(nextName);
  if (!name) return entries;
  let changed = false;
  const renamed = entries.map((entry) => {
    if (entry.id !== id) return entry;
    if (entry.name === name) return entry;
    changed = true;
    return { ...entry, name };
  });
  return changed ? renamed : entries;
}

export function duplicateComponentLibraryEntry(
  entries: readonly ComponentLibraryEntry[],
  id: string,
  nextId: string,
  createdAt: string,
  duplicateName: string,
): readonly ComponentLibraryEntry[] {
  const source = entries.find((entry) => entry.id === id);
  const name = normalizeEntryName(duplicateName);
  if (!source || !nextId.trim() || !createdAt.trim() || !name) return entries;
  if (entries.some((entry) => entry.id === nextId)) return entries;
  return [
    ...entries,
    {
      id: nextId,
      name,
      nodeJson: source.nodeJson,
      createdAt,
    },
  ];
}

export function toggleComponentLibraryEntryPinned(
  entries: readonly ComponentLibraryEntry[],
  id: string,
): readonly ComponentLibraryEntry[] {
  let changed = false;
  const updated = entries.map((entry) => {
    if (entry.id !== id) return entry;
    changed = true;
    if (entry.pinned === true) return omitPinned(entry);
    return { ...entry, pinned: true };
  });
  return changed ? updated : entries;
}

export function renameComponentLibraryEntryVersion(
  entries: readonly ComponentLibraryEntry[],
  options: ComponentLibraryRenameEntryVersionOptions,
): readonly ComponentLibraryEntry[] {
  const id = options.id.trim();
  const versionIndex = options.versionIndex;
  if (!id || !Number.isInteger(versionIndex) || versionIndex < 0) return entries;
  const label = normalizeVersionLabel(options.label);
  let changed = false;
  const updated = entries.map((entry) => {
    if (entry.id !== id) return entry;
    const versions = entry.versions ?? [];
    const version = versions[versionIndex];
    if (!version || normalizeVersionLabel(version.label) === label) return entry;
    changed = true;
    const renamedVersion = {
      nodeJson: version.nodeJson,
      savedAt: version.savedAt,
      ...(label ? { label } : {}),
    };
    return withEntryVersions(
      entry,
      versions.map((candidate, index) => (index === versionIndex ? renamedVersion : candidate)),
    );
  });
  return changed ? updated : entries;
}

export function deleteComponentLibraryEntryVersion(
  entries: readonly ComponentLibraryEntry[],
  options: ComponentLibraryDeleteEntryVersionOptions,
): readonly ComponentLibraryEntry[] {
  const id = options.id.trim();
  const versionIndex = options.versionIndex;
  if (!id || !Number.isInteger(versionIndex) || versionIndex < 0) return entries;
  let changed = false;
  const updated = entries.map((entry) => {
    if (entry.id !== id) return entry;
    const versions = entry.versions ?? [];
    if (!versions[versionIndex]) return entry;
    changed = true;
    return withEntryVersions(entry, versions.filter((_, index) => index !== versionIndex));
  });
  return changed ? updated : entries;
}

export function updateComponentLibraryEntryPayload(
  entries: readonly ComponentLibraryEntry[],
  options: ComponentLibraryUpdateEntryPayloadOptions,
): readonly ComponentLibraryEntry[] {
  const id = options.id.trim();
  const nodeJson = options.nextNodeJson.trim();
  const timestamp = options.updatedAt.trim();
  if (!id || !nodeJson || !timestamp) return entries;
  let changed = false;
  const updated = entries.map((entry) => {
    if (entry.id !== id) return entry;
    if (entry.nodeJson === nodeJson && entry.updatedAt === timestamp) return entry;
    changed = true;
    if (entry.nodeJson === nodeJson) return { ...entry, updatedAt: timestamp };
    return {
      ...entry,
      nodeJson,
      updatedAt: timestamp,
      versions: compactComponentLibraryVersions([
        makeComponentLibraryEntryVersion(entry, options.snapshotLabel),
        ...(entry.versions ?? []),
      ]),
    };
  });
  return changed ? updated : entries;
}

export function restoreComponentLibraryEntryVersion(
  entries: readonly ComponentLibraryEntry[],
  options: ComponentLibraryRestoreEntryOptions,
): readonly ComponentLibraryEntry[] {
  const entryId = options.id.trim();
  const timestamp = options.restoredAt.trim();
  const versionIndex = options.versionIndex ?? 0;
  if (!entryId || !timestamp || !Number.isInteger(versionIndex) || versionIndex < 0) return entries;
  let changed = false;
  const updated = entries.map((entry) => {
    if (entry.id !== entryId) return entry;
    const versions = entry.versions ?? [];
    const version = versions[versionIndex];
    const nodeJson = version?.nodeJson.trim() ?? '';
    if (!nodeJson || entry.nodeJson === nodeJson) return entry;
    changed = true;
    return {
      ...entry,
      nodeJson,
      updatedAt: timestamp,
      versions: compactComponentLibraryVersions([
        makeComponentLibraryEntryVersion(entry),
        ...versions.filter((_, index) => index !== versionIndex),
      ]),
    };
  });
  return changed ? updated : entries;
}
