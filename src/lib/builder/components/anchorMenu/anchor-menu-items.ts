import type { BuilderAnchorMenuCanvasNode } from '@/lib/builder/canvas/types';
import type { getUtilityAdvancedWidgetsCopy } from '../utility-advanced-widgets-copy';

export type AnchorMenuItem = BuilderAnchorMenuCanvasNode['content']['items'][number];
export type AnchorMenuCopy = ReturnType<typeof getUtilityAdvancedWidgetsCopy>['anchorMenu'];

export function anchorLabel(label: string, anchorId: string, copy: AnchorMenuCopy): string {
  return label === copy.legacyLabels[anchorId] ? (copy.defaultLabels[anchorId] ?? label) : label;
}

export function labelForAnchorId(anchorId: string, copy: AnchorMenuCopy): string {
  const defaultLabel = copy.defaultLabels[anchorId];
  if (defaultLabel) return defaultLabel;
  const words = anchorId
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ');
  return words.replace(/\b[a-z]/g, (letter) => letter.toUpperCase()).slice(0, 60) || anchorId;
}

export function normalizeSiteAnchors(siteAnchors: readonly string[] | undefined): string[] {
  const seen = new Set<string>();
  const anchors: string[] = [];
  for (const rawAnchor of siteAnchors ?? []) {
    const anchor = rawAnchor.trim();
    if (!anchor || seen.has(anchor)) continue;
    seen.add(anchor);
    anchors.push(anchor);
  }
  return anchors.slice(0, 20);
}

export function itemsToText(items: readonly AnchorMenuItem[], copy: AnchorMenuCopy): string {
  return items.map((item) => `${anchorLabel(item.label, item.anchorId, copy)} | ${item.anchorId}`).join('\n');
}

export function parseAnchorMenuItemsText(value: string): AnchorMenuItem[] {
  const items: AnchorMenuItem[] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [label, anchorId] = line.split('|').map((part) => part.trim());
    if (!label || !anchorId) continue;
    items.push({ label: label.slice(0, 60), anchorId: anchorId.slice(0, 120) });
  }
  return items.slice(0, 20);
}

export function mergeAnchorMenuItemsWithSiteAnchors(
  items: readonly AnchorMenuItem[],
  siteAnchors: readonly string[] | undefined,
  copy: AnchorMenuCopy,
): AnchorMenuItem[] {
  const normalizedAnchors = normalizeSiteAnchors(siteAnchors);
  const existingByAnchor = new Map<string, AnchorMenuItem>();
  for (const item of items) {
    if (!existingByAnchor.has(item.anchorId)) {
      existingByAnchor.set(item.anchorId, item);
    }
  }
  const merged = normalizedAnchors.map((anchorId) => {
    const existing = existingByAnchor.get(anchorId);
    return existing ?? { label: labelForAnchorId(anchorId, copy), anchorId };
  });
  const customItems = items.filter((item) => !normalizedAnchors.includes(item.anchorId));
  return [...merged, ...customItems].slice(0, 20);
}

export function addAnchorMenuItem(
  items: readonly AnchorMenuItem[],
  anchorId: string,
  copy: AnchorMenuCopy,
): AnchorMenuItem[] {
  const normalizedAnchorId = anchorId.trim();
  if (!normalizedAnchorId || items.some((item) => item.anchorId === normalizedAnchorId)) {
    return [...items];
  }
  return [...items, { label: labelForAnchorId(normalizedAnchorId, copy), anchorId: normalizedAnchorId }].slice(0, 20);
}
