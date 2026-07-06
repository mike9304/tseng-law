import {
  getComponentLibraryEntrySummary,
  type ComponentLibraryEntry,
  type ComponentLibraryEntryVersion,
  type ComponentLibraryEntrySummary,
} from './component-library-panel.helpers';
import {
  makeComponentLibraryReviewDiff,
  type ComponentLibraryReviewDiffSummary,
} from './component-library-review-diff.helpers';

export interface ComponentLibraryRestoreReviewVersion {
  readonly index: number;
  readonly nodeJson: string;
  readonly savedAt: string;
  readonly label?: string;
  readonly summary: ComponentLibraryEntrySummary;
}

export interface ComponentLibraryRestoreReview {
  readonly entryId: string;
  readonly entryName: string;
  readonly currentNodeJson: string;
  readonly restoredNodeJson: string;
  readonly selectedVersionIndex: number;
  readonly versions: readonly ComponentLibraryRestoreReviewVersion[];
  readonly currentSummary: ComponentLibraryEntrySummary;
  readonly previousSummary: ComponentLibraryEntrySummary;
  readonly diffSummary: ComponentLibraryReviewDiffSummary;
}

function makeComponentLibraryRestoreReviewVersion(
  entry: ComponentLibraryEntry,
  version: ComponentLibraryEntryVersion,
  index: number,
): ComponentLibraryRestoreReviewVersion | null {
  const nodeJson = version.nodeJson.trim();
  const savedAt = version.savedAt.trim();
  const label = version.label?.trim().slice(0, 80) ?? '';
  if (!nodeJson || !savedAt || nodeJson === entry.nodeJson) return null;

  const summary = getComponentLibraryEntrySummary({ ...entry, nodeJson });
  if (!summary.isValid) return null;

  return { index, nodeJson, savedAt, ...(label ? { label } : {}), summary };
}

export function makeComponentLibraryRestoreReview(
  entry: ComponentLibraryEntry,
  selectedVersionIndex = 0,
): ComponentLibraryRestoreReview | null {
  const versions = (entry.versions ?? [])
    .map((version, index) => makeComponentLibraryRestoreReviewVersion(entry, version, index))
    .filter((version): version is ComponentLibraryRestoreReviewVersion => version !== null);
  if (versions.length === 0) return null;

  const selectedVersion = versions.find((version) => version.index === selectedVersionIndex) ?? versions[0];
  if (!selectedVersion) return null;

  const currentSummary = getComponentLibraryEntrySummary(entry);
  const previousEntry: ComponentLibraryEntry = { ...entry, nodeJson: selectedVersion.nodeJson };
  return {
    entryId: entry.id,
    entryName: entry.name,
    currentNodeJson: entry.nodeJson.trim(),
    restoredNodeJson: selectedVersion.nodeJson,
    selectedVersionIndex: selectedVersion.index,
    versions,
    currentSummary,
    previousSummary: selectedVersion.summary,
    diffSummary: makeComponentLibraryReviewDiff({
      previousEntry: entry,
      nextEntry: previousEntry,
      previousSummary: currentSummary,
      nextSummary: selectedVersion.summary,
    }),
  };
}
