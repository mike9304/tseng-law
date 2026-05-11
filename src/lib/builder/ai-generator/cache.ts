import crypto from 'node:crypto';
import type { GeneratedSiteDraft } from './orchestrator';
import type { SiteSpec } from './site-spec';

const cache = new Map<string, GeneratedSiteDraft>();
const CAP = 256;

function specKey(spec: SiteSpec): string {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(spec))
    .digest('hex')
    .slice(0, 16);
}

export function readDraftCache(spec: SiteSpec): GeneratedSiteDraft | null {
  return cache.get(specKey(spec)) ?? null;
}

export function writeDraftCache(spec: SiteSpec, draft: GeneratedSiteDraft): void {
  if (cache.size >= CAP) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(specKey(spec), draft);
}
