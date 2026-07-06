export const relationColumnListDefaultWindowConfig = {
  overscan: 3,
  rowHeight: 64,
  viewportHeight: 180,
} as const;

export type RelationColumnListWindowConfig = {
  readonly overscan: number;
  readonly rowHeight: number;
  readonly viewportHeight: number;
};

export type RelationColumnListWindowInput = {
  readonly config?: RelationColumnListWindowConfig;
  readonly itemCount: number;
  readonly scrollTop: number;
};

export type RelationColumnListWindow = {
  readonly bottomSpacerHeight: number;
  readonly endIndex: number;
  readonly renderedCount: number;
  readonly startIndex: number;
  readonly topSpacerHeight: number;
  readonly totalHeight: number;
};

export function getRelationColumnListWindow({
  config = relationColumnListDefaultWindowConfig,
  itemCount,
  scrollTop,
}: RelationColumnListWindowInput): RelationColumnListWindow {
  if (itemCount <= 0) {
    return {
      bottomSpacerHeight: 0,
      endIndex: 0,
      renderedCount: 0,
      startIndex: 0,
      topSpacerHeight: 0,
      totalHeight: 0,
    };
  }

  const totalHeight = itemCount * config.rowHeight;
  const boundedScrollTop = Math.max(0, Math.min(scrollTop, totalHeight));
  const maxFirstVisibleIndex = Math.max(0, itemCount - 1);
  const firstVisibleIndex = Math.min(
    Math.floor(boundedScrollTop / config.rowHeight),
    maxFirstVisibleIndex,
  );
  const visibleCount = Math.ceil(config.viewportHeight / config.rowHeight);
  const startIndex = Math.max(0, firstVisibleIndex - config.overscan);
  const endIndex = Math.min(itemCount, firstVisibleIndex + visibleCount + config.overscan);

  return {
    bottomSpacerHeight: Math.max(0, (itemCount - endIndex) * config.rowHeight),
    endIndex,
    renderedCount: endIndex - startIndex,
    startIndex,
    topSpacerHeight: startIndex * config.rowHeight,
    totalHeight,
  };
}
