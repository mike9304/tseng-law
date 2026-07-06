'use client';

import { useState } from 'react';
import type {
  ComponentLibraryEntry,
  ComponentLibraryEntryVersion,
} from './component-library-panel.helpers';
import {
  makeComponentLibraryRestoreReview,
  type ComponentLibraryRestoreReview,
} from './component-library-restore-review.helpers';

interface ComponentLibraryRestoreReviewStateOptions {
  readonly entries: readonly ComponentLibraryEntry[];
  readonly restoreEntryVersion: (id: string, versionIndex: number) => void;
  readonly renameEntryVersion: (options: {
    readonly id: string;
    readonly versionIndex: number;
    readonly label: string;
  }) => void;
  readonly deleteEntryVersion: (options: {
    readonly id: string;
    readonly versionIndex: number;
  }) => void;
  readonly onOpen: () => void;
}

function normalizeSnapshotLabel(value: string): string | undefined {
  const label = value.trim().slice(0, 80);
  return label.length > 0 ? label : undefined;
}

function getSelectedSnapshotLabel(review: ComponentLibraryRestoreReview): string {
  return review.versions.find((version) => version.index === review.selectedVersionIndex)?.label ?? '';
}

function makeEntryWithVersions(
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
  return versions.length > 0 ? { ...base, versions } : base;
}

function renameVersionDraft(
  versions: readonly ComponentLibraryEntryVersion[],
  versionIndex: number,
  label: string | undefined,
): readonly ComponentLibraryEntryVersion[] {
  return versions.map((version, index) => {
    if (index !== versionIndex) return version;
    return {
      nodeJson: version.nodeJson,
      savedAt: version.savedAt,
      ...(label ? { label } : {}),
    };
  });
}

export function useComponentLibraryRestoreReviewState({
  entries,
  restoreEntryVersion,
  renameEntryVersion,
  deleteEntryVersion,
  onOpen,
}: ComponentLibraryRestoreReviewStateOptions) {
  const [review, setReview] = useState<ComponentLibraryRestoreReview | null>(null);
  const [snapshotLabel, setSnapshotLabel] = useState('');

  function findEntry(id: string): ComponentLibraryEntry | undefined {
    return entries.find((entry) => entry.id === id);
  }

  function syncReview(entry: ComponentLibraryEntry, versionIndex: number): boolean {
    const nextReview = makeComponentLibraryRestoreReview(entry, versionIndex);
    if (!nextReview) return false;
    setReview(nextReview);
    setSnapshotLabel(getSelectedSnapshotLabel(nextReview));
    return true;
  }

  function close() {
    setReview(null);
    setSnapshotLabel('');
  }

  function clearIfEntry(entryId: string) {
    if (review?.entryId === entryId) close();
  }

  function open(entryId: string, versionIndex = 0) {
    const entry = findEntry(entryId);
    if (!entry) return;
    const nextReview = makeComponentLibraryRestoreReview(entry, versionIndex);
    if (!nextReview) return;
    onOpen();
    setReview(nextReview);
    setSnapshotLabel(getSelectedSnapshotLabel(nextReview));
  }

  function selectVersion(versionIndex: number) {
    if (!review) return;
    const entry = findEntry(review.entryId);
    if (!entry) return;
    syncReview(entry, versionIndex);
  }

  function confirm() {
    if (!review) return;
    restoreEntryVersion(review.entryId, review.selectedVersionIndex);
    close();
  }

  function saveSnapshotLabel() {
    if (!review) return;
    const entry = findEntry(review.entryId);
    if (!entry) return;
    const label = normalizeSnapshotLabel(snapshotLabel);
    renameEntryVersion({
      id: review.entryId,
      versionIndex: review.selectedVersionIndex,
      label: snapshotLabel,
    });
    const nextEntry = makeEntryWithVersions(
      entry,
      renameVersionDraft(entry.versions ?? [], review.selectedVersionIndex, label),
    );
    syncReview(nextEntry, review.selectedVersionIndex);
  }

  function deleteSelectedVersion() {
    if (!review) return;
    const entry = findEntry(review.entryId);
    if (!entry) return;
    deleteEntryVersion({ id: review.entryId, versionIndex: review.selectedVersionIndex });
    const nextEntry = makeEntryWithVersions(
      entry,
      (entry.versions ?? []).filter((_, index) => index !== review.selectedVersionIndex),
    );
    if (!syncReview(nextEntry, review.selectedVersionIndex)) close();
  }

  return {
    review,
    snapshotLabel,
    setSnapshotLabel,
    open,
    close,
    clearIfEntry,
    selectVersion,
    confirm,
    saveSnapshotLabel,
    deleteSelectedVersion,
  };
}
