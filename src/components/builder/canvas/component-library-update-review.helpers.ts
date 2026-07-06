import {
  getComponentLibraryEntrySummary,
  type ComponentLibraryEntry,
  type ComponentLibraryEntrySummary,
} from './component-library-panel.helpers';
import {
  makeComponentLibraryReviewDiff,
  type ComponentLibraryReviewDiffSummary,
} from './component-library-review-diff.helpers';

export interface ComponentLibraryUpdateReview {
  readonly entryId: string;
  readonly entryName: string;
  readonly savedNodeJson: string;
  readonly nextNodeJson: string;
  readonly savedSummary: ComponentLibraryEntrySummary;
  readonly nextSummary: ComponentLibraryEntrySummary;
  readonly diffSummary: ComponentLibraryReviewDiffSummary;
}

export function makeComponentLibraryUpdateReview(
  entry: ComponentLibraryEntry,
  nextNodeJson: string,
): ComponentLibraryUpdateReview | null {
  const nodeJson = nextNodeJson.trim();
  if (!nodeJson) return null;

  const nextEntry: ComponentLibraryEntry = { ...entry, nodeJson };
  const nextSummary = getComponentLibraryEntrySummary(nextEntry);
  if (!nextSummary.isValid) return null;

  const savedSummary = getComponentLibraryEntrySummary(entry);
  return {
    entryId: entry.id,
    entryName: entry.name,
    savedNodeJson: entry.nodeJson,
    nextNodeJson: nodeJson,
    savedSummary,
    nextSummary,
    diffSummary: makeComponentLibraryReviewDiff({
      previousEntry: entry,
      nextEntry,
      previousSummary: savedSummary,
      nextSummary,
    }),
  };
}
