/**
 * Phase 6 P6-10 — 301 Redirect management.
 * P6-15 — Auto-redirect on slug change.
 *
 * Stores redirect rules in Vercel Blob. On publish, generates
 * vercel.json-compatible redirect entries.
 */

import { get, put } from '@vercel/blob';

export interface RedirectRule {
  id: string;
  source: string;
  destination: string;
  permanent: boolean;
  createdAt: string;
  reason?: string;
}

const REDIRECTS_BLOB_PATH = 'builder-site/default/redirects.json';

export async function loadRedirects(): Promise<RedirectRule[]> {
  try {
    const result = await get(REDIRECTS_BLOB_PATH, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as RedirectRule[];
    }
  } catch { /* empty */ }
  return [];
}

export async function saveRedirects(rules: RedirectRule[]): Promise<void> {
  await put(REDIRECTS_BLOB_PATH, JSON.stringify(rules), {
    access: 'private',
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export async function addRedirect(
  source: string,
  destination: string,
  reason?: string,
): Promise<RedirectRule> {
  const rules = await loadRedirects();
  const existing = rules.find((r) => r.source === source);
  if (existing) {
    existing.destination = destination;
    existing.reason = reason;
    await saveRedirects(rules);
    return existing;
  }
  const rule: RedirectRule = {
    id: `redir-${Date.now()}`,
    source,
    destination,
    permanent: true,
    createdAt: new Date().toISOString(),
    reason,
  };
  rules.push(rule);
  await saveRedirects(rules);
  return rule;
}

export async function removeRedirect(id: string): Promise<void> {
  const rules = await loadRedirects();
  const filtered = rules.filter((r) => r.id !== id);
  await saveRedirects(filtered);
}

export function toVercelRedirects(rules: RedirectRule[]): Array<{
  source: string;
  destination: string;
  permanent: boolean;
}> {
  return rules.map((r) => ({
    source: r.source,
    destination: r.destination,
    permanent: r.permanent,
  }));
}
