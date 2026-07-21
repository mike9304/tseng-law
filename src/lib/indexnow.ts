/**
 * indexnow.ts — minimal IndexNow protocol client (https://www.indexnow.org).
 *
 * Lets us ping participating search engines (Bing, Naver, Seznam, ...) the moment a
 * URL is created or changed, instead of waiting for organic crawl discovery. This
 * matters for tseng-law.com because it is a freshly registered domain (2026-02)
 * with effectively no existing index footprint.
 *
 * The verification key below must match the key file published at
 * `public/<INDEXNOW_KEY>.txt` (see keyLocation) so search engines can confirm we
 * own the host before honoring submissions.
 */

export const INDEXNOW_KEY = 'b6b378b89ef6a56fd063802f06c5a49f0993df505b9311d152be338e20b22544';

export const INDEXNOW_HOST = 'tseng-law.com';

export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export interface SubmitIndexNowResult {
  ok: boolean;
  status?: number;
  error?: string;
  submitted: number;
}

/**
 * Submit a batch of URLs to IndexNow. Never throws — network/parse failures are
 * caught and reported as `{ ok: false, error, submitted: 0 }` so callers (build
 * scripts, publish hooks) can treat this as a best-effort side effect.
 */
export async function submitIndexNow(urls: string[]): Promise<SubmitIndexNowResult> {
  if (urls.length === 0) {
    return { ok: true, submitted: 0 };
  }

  const urlList = urls.slice(0, 10000);

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });

    if (res.ok) {
      return { ok: true, status: res.status, submitted: urlList.length };
    }

    return { ok: false, status: res.status, submitted: 0 };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return { ok: false, error, submitted: 0 };
  }
}
