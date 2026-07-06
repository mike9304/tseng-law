import { adminHref, flattenAdminNavTree, type AdminNavQuickLink, type AdminNavTree } from './nav-config';
import { getAdminNavCopy, getAdminNavItemLabel, getAdminNavSectionLabel } from './nav-copy';
import { normalizeAdminNavHistoryEntries, type AdminNavHistoryEntry } from './recent-nav';

export interface AdminQuickJumpItem {
  readonly label: string;
  readonly href: string;
  readonly sectionHeading: string;
}

export interface AdminQuickJumpGroup {
  readonly heading: string;
  readonly items: AdminQuickJumpItem[];
}

export interface AdminQuickJumpResult extends AdminQuickJumpItem {
  readonly groupHeading: string;
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

function createQuickJumpItem(locale: string, item: AdminNavQuickLink): AdminQuickJumpItem {
  return {
    label: getAdminNavItemLabel(locale, item.label),
    href: adminHref(locale, item.href),
    sectionHeading: getAdminNavSectionLabel(locale, item.sectionHeading),
  };
}

function matchesQuery(item: AdminQuickJumpItem, normalizedQuery: string): boolean {
  return !normalizedQuery || [item.label, item.href, item.sectionHeading].some((value) => value.toLowerCase().includes(normalizedQuery));
}

function buildLocalizedQuickJumpItems(locale: string, tree: AdminNavTree): AdminQuickJumpItem[] {
  return flattenAdminNavTree(tree)
    .filter((item) => item.href !== '')
    .map((item) => createQuickJumpItem(locale, item));
}

function normalizeRecentQuickJumpItems(
  locale: string,
  recent: AdminNavHistoryEntry[],
  tree: AdminNavTree,
): AdminQuickJumpItem[] {
  const items: AdminQuickJumpItem[] = [];
  const seenHrefs = new Set<string>();
  for (const item of normalizeAdminNavHistoryEntries(tree, locale, recent)) {
    const normalizedItem = {
      label: item.label,
      href: item.href,
      sectionHeading: item.sectionHeading,
    };
    if (seenHrefs.has(normalizedItem.href)) continue;
    seenHrefs.add(normalizedItem.href);
    items.push(normalizedItem);
  }
  return items;
}

export function buildAdminQuickJumpGroups(
  locale: string,
  recent: AdminNavHistoryEntry[] = [],
  tree: AdminNavTree,
  query = '',
): AdminQuickJumpGroup[] {
  const normalizedQuery = normalizeQuery(query);
  const recentHeading = getAdminNavCopy(locale).recentLabel;
  const allItems = buildLocalizedQuickJumpItems(locale, tree);
  const normalizedRecentItems = normalizeRecentQuickJumpItems(locale, recent, tree);
  const recentHrefSet = new Set(normalizedRecentItems.map((item) => item.href));

  const groups: AdminQuickJumpGroup[] = [];
  const recentItems = normalizedRecentItems.filter((item) => matchesQuery(item, normalizedQuery));

  if (recentItems.length > 0) {
    groups.push({ heading: recentHeading, items: recentItems });
  }

  const grouped = new Map<string, AdminQuickJumpItem[]>();
  for (const item of allItems) {
    if (recentHrefSet.has(item.href)) continue;
    if (!matchesQuery(item, normalizedQuery)) {
      continue;
    }
    const list = grouped.get(item.sectionHeading) ?? [];
    list.push(item);
    grouped.set(item.sectionHeading, list);
  }

  for (const [heading, items] of grouped) {
    groups.push({ heading, items });
  }

  return groups;
}

export function buildAdminQuickJumpResults(
  locale: string,
  recent: AdminNavHistoryEntry[] = [],
  tree: AdminNavTree,
  query = '',
): AdminQuickJumpResult[] {
  const groups = buildAdminQuickJumpGroups(locale, recent, tree, query);
  return groups.flatMap((group) => group.items.map((item) => ({ ...item, groupHeading: group.heading })));
}

export function stepAdminQuickJumpIndex(currentIndex: number, key: string, itemCount: number): number {
  if (itemCount <= 0) return -1;
  if (key === 'Home') return 0;
  if (key === 'End') return itemCount - 1;
  if (key === 'ArrowDown') return currentIndex < 0 ? 0 : Math.min(itemCount - 1, currentIndex + 1);
  if (key === 'ArrowUp') return currentIndex < 0 ? itemCount - 1 : Math.max(0, currentIndex - 1);
  return currentIndex;
}
