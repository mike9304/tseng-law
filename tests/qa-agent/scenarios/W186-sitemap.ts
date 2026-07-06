import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';

// sitemap.ts(src/app/sitemap.ts)는 /sitemap.xml 에서 force-dynamic 으로 렌더된다.
// 모든 locale(ko/zh-hant/en) × STATIC_PATHS + builder 발행 페이지를 <loc> URL 로 포함해야 한다.
async function fetchSitemap(page: Page, baseUrl: string): Promise<{ status: number; body: string }> {
  const url = new URL('/sitemap.xml', baseUrl).toString();
  try {
    const res = await page.request.get(url, { timeout: 30_000 });
    const body = await res.text();
    return { status: res.status(), body };
  } catch {
    return { status: 0, body: '' };
  }
}

export const W186_sitemap: CheckpointDefinition = {
  id: 'W186',
  title: '사이트맵: GET /sitemap.xml → 200 + 다수의 다국어 페이지 URL 포함',
  verification:
    'page.request.get("/sitemap.xml") → 200. 본문 <loc> URL 중 ko/zh-hant/en locale 경로가 최소 2개 이상 존재하고 총 URL 개수가 충분함',
  async run({ page, baseUrl, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];

    log('GET /sitemap.xml');
    const { status, body } = await fetchSitemap(page, baseUrl);
    log(`status=${status}, bodyLength=${body.length}`);

    if (status !== 200) {
      findings.push({
        severity: 'blocker',
        summary: `/sitemap.xml 이 200 이 아님 (status=${status}) — src/app/sitemap.ts (force-dynamic) 미동작 의심`,
      });
      await recordEvidence('sitemap-not-200');
      return { findings };
    }
    await recordEvidence('sitemap-200');

    const locs = Array.from(body.matchAll(/<loc>([^<]+)<\/loc>/gi)).map((m) => m[1].trim());
    log(`URL 개수: ${locs.length}`);

    if (locs.length === 0) {
      findings.push({
        severity: 'blocker',
        summary: '/sitemap.xml 본문에 <loc> URL 이 하나도 없음',
      });
      await recordEvidence('sitemap-no-urls');
      return { findings };
    }

    const hasKo = locs.some((u) => /\/ko(\/|$|\?)/.test(u));
    const hasZh = locs.some((u) => /\/zh-hant(\/|$|\?)/.test(u));
    const hasEn = locs.some((u) => /\/en(\/|$|\?)/.test(u));
    const localeCount = [hasKo, hasZh, hasEn].filter(Boolean).length;
    log(`다국어 URL: ko=${hasKo}, zh-hant=${hasZh}, en=${hasEn}`);

    if (localeCount < 2) {
      findings.push({
        severity: 'blocker',
        summary: `다국어 페이지 URL 이 부족함 (ko=${hasKo}, zh-hant=${hasZh}, en=${hasEn}, 총 ${locs.length}개) — 최소 2개 locale 경로 필요`,
      });
    }

    if (locs.length < 5) {
      findings.push({
        severity: 'minor',
        summary: `/sitemap.xml URL 개수가 예상보다 적음 (${locs.length}개) — STATIC_PATHS × 3 locale 미출력 가능`,
      });
    }

    await recordEvidence('sitemap-multi-locale');
    return { findings };
  },
};
