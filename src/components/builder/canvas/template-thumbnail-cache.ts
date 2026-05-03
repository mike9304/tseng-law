import type { ReactElement } from 'react';
import type { PageTemplate } from '@/lib/builder/templates/types';

type ThumbnailKey = string;

interface TemplateCacheEntry {
  insertionOrder: ThumbnailKey[];
  byKey: Map<ThumbnailKey, ReactElement>;
}

const MAX_ENTRIES_PER_TEMPLATE = 6;
const cache = new WeakMap<PageTemplate, TemplateCacheEntry>();

export function buildThumbnailKey(width: number, height: number, tone: string): ThumbnailKey {
  return `${width}x${height}@${tone}`;
}

export function getCachedThumbnail(template: PageTemplate, key: ThumbnailKey): ReactElement | undefined {
  return cache.get(template)?.byKey.get(key);
}

export function setCachedThumbnail(template: PageTemplate, key: ThumbnailKey, element: ReactElement): void {
  let entry = cache.get(template);
  if (!entry) {
    entry = { insertionOrder: [], byKey: new Map() };
    cache.set(template, entry);
  }

  if (entry.byKey.has(key)) {
    entry.insertionOrder = entry.insertionOrder.filter((candidate) => candidate !== key);
  }

  entry.byKey.set(key, element);
  entry.insertionOrder.push(key);

  while (entry.insertionOrder.length > MAX_ENTRIES_PER_TEMPLATE) {
    const evict = entry.insertionOrder.shift();
    if (evict) entry.byKey.delete(evict);
  }
}

export function clearThumbnailCache(template: PageTemplate): void {
  cache.delete(template);
}
