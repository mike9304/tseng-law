import { ACTION_ITEMS, actionItem } from './action-item-catalog.mjs';
import { buildUrl, contentType, fetchWithTimeout, statusOk } from './check-shared.mjs';
import { addResult } from './reporting.mjs';

export const STATIC_ASSETS = [
  '/images/placeholder-article-hero.jpg',
  '/_next/image?url=%2Fimages%2Fplaceholder-article-hero.jpg&w=1200&q=75',
];

export async function checkStaticAssets(baseUrl, results) {
  for (const assetPath of STATIC_ASSETS) {
    try {
      const response = await fetchWithTimeout(buildUrl(baseUrl, assetPath), {
        headers: { accept: 'image/*,*/*;q=0.8' },
      });
      const type = contentType(response);
      const ok = statusOk(response.status) && type.startsWith('image/');
      addResult(
        results,
        ok ? 'PASS' : 'OPEN',
        `static ${assetPath} status=${response.status} content-type=${type}`,
        ok,
        actionItem(ACTION_ITEMS.publicAsset),
      );
      response.body?.cancel();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addResult(results, 'FAIL', `static ${assetPath} fetch failed: ${message}`, false);
    }
  }
}
