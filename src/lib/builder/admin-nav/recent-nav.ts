import {
  adminHref,
  findActiveAdminNavLink,
  findActiveItem,
  type AdminNavTree,
} from '@/lib/builder/admin-nav/nav-config';
import {
  getAdminNavItemLabel,
  getAdminNavSectionLabel,
} from '@/lib/builder/admin-nav/nav-copy';
import { locales } from '@/lib/locales';

export interface AdminNavHistoryEntry {
  label: string;
  href: string;
  sectionHeading: string;
}

const RECENT_ADMIN_NAV_KEY = 'builder:recent-admin-nav';
const MAX_RECENT_ADMIN_NAV = 6;
const DEFAULT_RECENT_ADMIN_TRAIL = 4;

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeEntry(entry: AdminNavHistoryEntry): AdminNavHistoryEntry | null {
  const label = entry.label.trim();
  const href = entry.href.trim();
  const sectionHeading = entry.sectionHeading.trim();
  if (!label || !href || !sectionHeading) return null;
  return { label, href, sectionHeading };
}

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseStorageEntry(value: unknown): AdminNavHistoryEntry | null {
  if (!isStringRecord(value)) return null;
  const label = value.label;
  const href = value.href;
  const sectionHeading = value.sectionHeading;
  if (typeof label !== 'string' || typeof href !== 'string' || typeof sectionHeading !== 'string') return null;
  return normalizeEntry({ label, href, sectionHeading });
}

function parseStoredEntries(raw: string | null): AdminNavHistoryEntry[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(parseStorageEntry)
      .filter((entry): entry is AdminNavHistoryEntry => Boolean(entry))
      .slice(0, MAX_RECENT_ADMIN_NAV);
  } catch (error) {
    if (error instanceof SyntaxError) return [];
    throw error;
  }
}

function normalizeEntryForLocale(
  tree: AdminNavTree,
  locale: string,
  entry: AdminNavHistoryEntry,
): AdminNavHistoryEntry | null {
  const normalizedEntry = normalizeEntry(entry);
  if (!normalizedEntry) return null;

  for (const candidateLocale of locales) {
    const activeLink = findActiveAdminNavLink(tree, candidateLocale, normalizedEntry.href);
    if (!activeLink) continue;
    return {
      label: getAdminNavItemLabel(locale, activeLink.label),
      href: adminHref(locale, activeLink.href),
      sectionHeading: getAdminNavSectionLabel(locale, activeLink.sectionHeading),
    };
  }

  return {
    label: getAdminNavItemLabel(locale, normalizedEntry.label),
    href: normalizedEntry.href,
    sectionHeading: getAdminNavSectionLabel(locale, normalizedEntry.sectionHeading),
  };
}

export function adminNavHistoryEntryForPath(
  tree: AdminNavTree,
  locale: string,
  pathname: string,
): AdminNavHistoryEntry | null {
  const item = findActiveItem(tree, locale, pathname);
  if (!item) return null;

  for (const section of tree.sections) {
    if (section.items.includes(item)) {
      return {
        label: getAdminNavItemLabel(locale, item.label),
        href: adminHref(locale, item.href),
        sectionHeading: getAdminNavSectionLabel(locale, section.heading),
      };
    }
  }

  return null;
}

export function normalizeAdminNavHistoryEntries(
  tree: AdminNavTree,
  locale: string,
  entries: AdminNavHistoryEntry[],
): AdminNavHistoryEntry[] {
  const normalizedEntries: AdminNavHistoryEntry[] = [];
  const seenHrefs = new Set<string>();

  for (const entry of entries) {
    const normalizedEntry = normalizeEntryForLocale(tree, locale, entry);
    if (!normalizedEntry || seenHrefs.has(normalizedEntry.href)) continue;
    seenHrefs.add(normalizedEntry.href);
    normalizedEntries.push(normalizedEntry);
    if (normalizedEntries.length >= MAX_RECENT_ADMIN_NAV) break;
  }

  return normalizedEntries;
}

export function readRecentAdminNav(): AdminNavHistoryEntry[] {
  if (!canUseStorage()) return [];
  return parseStoredEntries(window.localStorage.getItem(RECENT_ADMIN_NAV_KEY));
}

export function writeRecentAdminNav(entries: AdminNavHistoryEntry[]): void {
  if (!canUseStorage()) return;
  const next = entries
    .map(normalizeEntry)
    .filter((entry): entry is AdminNavHistoryEntry => Boolean(entry))
    .slice(0, MAX_RECENT_ADMIN_NAV);
  window.localStorage.setItem(RECENT_ADMIN_NAV_KEY, JSON.stringify(next));
}

export function pushRecentAdminNav(current: AdminNavHistoryEntry[], nextEntry: AdminNavHistoryEntry): AdminNavHistoryEntry[] {
  const entry = normalizeEntry(nextEntry);
  if (!entry) return current;
  return [entry, ...current.filter((item) => item.href !== entry.href)].slice(0, MAX_RECENT_ADMIN_NAV);
}

export function buildRecentAdminNavTrail(
  entries: AdminNavHistoryEntry[],
  currentHref = '',
  limit = DEFAULT_RECENT_ADMIN_TRAIL,
): AdminNavHistoryEntry[] {
  const href = currentHref.trim();
  return entries
    .filter((entry) => entry.href !== href && !href.startsWith(`${entry.href}/`) && !href.startsWith(`${entry.href}?`))
    .slice(0, limit);
}
