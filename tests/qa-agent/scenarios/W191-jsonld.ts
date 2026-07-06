import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';

// 발행 페이지(PublishedSitePageView)는 LegalService/Organization/LocalBusiness/BreadcrumbList/
// FAQPage 등의 schema.org JSON-LD 를 <script type="application/ld+json"> 로 렌더한다(JsonLd 컴포넌트).
const JSONLD_BLOCK_RE = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;

interface JsonLdProbe {
  path: string;
  status: number;
  blockCount: number;
  types: string[];
  rawOk: boolean;
}

async function probeJsonLd(page: Page, baseUrl: string, path: string): Promise<JsonLdProbe> {
  const url = new URL(path, baseUrl).toString();
  try {
    const res = await page.request.get(url, { timeout: 30_000 });
    const status = res.status();
    const body = await res.text();
    const blocks = Array.from(body.matchAll(JSONLD_BLOCK_RE)).map((m) => m[1]);
    const types: string[] = [];
    let rawOk = true;
    for (const block of blocks) {
      try {
        const parsed = JSON.parse(block);
        const t = parsed['@type'];
        if (Array.isArray(t)) types.push(...t.map(String));
        else if (typeof t === 'string') types.push(t);
        if (!parsed['@context'] || !/schema\.org/i.test(String(parsed['@context']))) rawOk = false;
      } catch {
        rawOk = false;
      }
    }
    return { path, status, blockCount: blocks.length, types, rawOk };
  } catch {
    return { path, status: 0, blockCount: 0, types: [], rawOk: false };
  }
}

async function findColumnPath(page: Page, baseUrl: string): Promise<string | null> {
  // 사이트맵에서 /columns/... URL 하나를 찾아 column 페이지 검증에 사용한다.
  try {
    const res = await page.request.get(new URL('/sitemap.xml', baseUrl).toString(), { timeout: 30_000 });
    if (!res.ok()) return null;
    const body = await res.text();
    const locs = Array.from(body.matchAll(/<loc>([^<]+)<\/loc>/gi)).map((m) => m[1]);
    const column = locs.find((u) => /\/columns\/[^/]+/.test(u));
    if (!column) return null;
    return new URL(column).pathname;
  } catch {
    return null;
  }
}

export const W191_jsonld: CheckpointDefinition = {
  id: 'W191',
  title: 'JSON-LD 구조화 데이터: GET /ko + 칼럼 페이지 → schema.org JSON-LD script 포함',
  verification:
    'page.request.get("/ko") 와 하나의 칼럼 페이지 → <script type="application/ld+json"> 가 존재하고 @context(schema.org) + @type(LegalService/Organization/Article 등) 포함',
  async run({ page, baseUrl, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];

    log('GET /ko — JSON-LD 확인');
    const home = await probeJsonLd(page, baseUrl, '/ko');
    log(`/ko status=${home.status}, blocks=${home.blockCount}, types=[${home.types.join(',')}]`);
    await recordEvidence('jsonld-home');
    if (home.status !== 200) {
      findings.push({ severity: 'blocker', summary: `GET /ko 가 200 이 아님 (status=${home.status})` });
    } else if (home.blockCount === 0) {
      findings.push({ severity: 'blocker', summary: '/ko 페이지에 application/ld+json script 가 하나도 없음' });
    } else if (home.types.length === 0) {
      findings.push({ severity: 'blocker', summary: '/ko JSON-LD 블록에 schema.org @type 이 없음' });
    } else if (!home.rawOk) {
      findings.push({
        severity: 'visual',
        summary: `/ko JSON-LD 가 존재하나 일부 블록이 @context(schema.org) 누락 또는 JSON 파싱 실패 (types=[${home.types.join(',')}])`,
      });
    }

    // 칼럼 페이지를 사이트맵에서 찾는다. 없으면 /ko/about 을 보조 콘텐츠 페이지로 사용.
    let columnPath = await findColumnPath(page, baseUrl);
    if (columnPath) {
      log(`사이트맵에서 칼럼 페이지 발견: ${columnPath}`);
    } else {
      log('사이트맵에 칼럼 URL 없음 — 보조 발행 페이지 /ko/about 으로 JSON-LD 검증');
      columnPath = '/ko/about';
    }

    log(`GET ${columnPath} — JSON-LD 확인`);
    const column = await probeJsonLd(page, baseUrl, columnPath);
    log(`${columnPath} status=${column.status}, blocks=${column.blockCount}, types=[${column.types.join(',')}]`);
    await recordEvidence('jsonld-content-page');
    if (column.status !== 200) {
      findings.push({
        severity: 'visual',
        summary: `칼럼/콘텐츠 페이지 ${columnPath} 가 200 이 아님 (status=${column.status}) — 페이지 미발행 가능`,
      });
    } else if (column.blockCount === 0) {
      findings.push({
        severity: 'blocker',
        summary: `${columnPath} 페이지에 application/ld+json script 가 없음 — 발행 페이지 JSON-LD 누락`,
      });
    } else if (column.types.length === 0) {
      findings.push({ severity: 'blocker', summary: `${columnPath} JSON-LD 블록에 schema.org @type 이 없음` });
    }

    return { findings };
  },
};
