export type CmsRecordSelectionRangeInput = {
  anchorRecordId: string | null;
  currentSelectedRecordIds: string[];
  selected: boolean;
  shiftKey: boolean;
  targetRecordId: string;
  visibleRecordIds: string[];
};

export type CmsRecordSelectionRangeResult = {
  nextAnchorRecordId: string | null;
  nextSelectedRecordIds: string[];
};

export function resolveCmsRecordSelectionRange(input: CmsRecordSelectionRangeInput): CmsRecordSelectionRangeResult {
  const {
    anchorRecordId,
    currentSelectedRecordIds,
    selected,
    shiftKey,
    targetRecordId,
    visibleRecordIds,
  } = input;

  if (selected && shiftKey && anchorRecordId) {
    const anchorIndex = visibleRecordIds.indexOf(anchorRecordId);
    const targetIndex = visibleRecordIds.indexOf(targetRecordId);
    if (anchorIndex >= 0 && targetIndex >= 0) {
      const rangeStart = Math.min(anchorIndex, targetIndex);
      const rangeEnd = Math.max(anchorIndex, targetIndex);
      const next = new Set(currentSelectedRecordIds);
      visibleRecordIds.slice(rangeStart, rangeEnd + 1).forEach((candidate) => next.add(candidate));
      return {
        nextAnchorRecordId: anchorRecordId,
        nextSelectedRecordIds: [...next],
      };
    }
  }

  if (selected) {
    return {
      nextAnchorRecordId: targetRecordId,
      nextSelectedRecordIds: currentSelectedRecordIds.includes(targetRecordId)
        ? currentSelectedRecordIds
        : [...currentSelectedRecordIds, targetRecordId],
    };
  }

  const nextSelectedRecordIds = currentSelectedRecordIds.filter((candidate) => candidate !== targetRecordId);
  return {
    nextAnchorRecordId: nextSelectedRecordIds.length === 0
      ? null
      : anchorRecordId === targetRecordId
        ? nextSelectedRecordIds[0] ?? null
        : anchorRecordId,
    nextSelectedRecordIds,
  };
}
