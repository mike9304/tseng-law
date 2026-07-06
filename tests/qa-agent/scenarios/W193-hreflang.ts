import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';

// 발행 페이지 메타데이터(public-page.tsx buildPublishedSitePageMetadata)의 alternates.languages 는
// Next.js 에 의해 <link rel="alternate" hrefLang="..." href="..."> 로 렌더된다.
// ko/zh-hant/en 3 locale 의 hreflang 이 모두 present 해야 한다.
async function fetchHead(page: Page, baseUrl: string, path: string): Promise<{ status: number; body: string }> {
  const url = new URL(path, baseUrl).toString();
  try {
    const res = await page.request.get(url, { timeout: 30_000 });
    const body = await res.text();
    return { status: res.status(), body };
  } catch {
    return { status: 0, body: '' };
  }
}

function extractHreflangs(body: string): { hreflang: string; href: string }[] {
  // Next.js 렌더링: <link rel="alternate" hrefLang="ko" href="..."/>
  // 속성 순서/대소문자가 달라질 수 있어 rel=alternate 링크 태그 전체에서 hreflang/href 를 추출한다.
  const out: { hreflang: string; href: string }[] = [];
  const linkRe = /<link\b[^>]*rel=["']alternate["'][^>]*>/gi;
  const tags = body.match(linkRe) ?? [];
  for (const tag of tags) {
    const hl = tag.match(/hreflang=["']([^"']+)["']/i);
    const href = tag.match(/href=["']([^"']+)["']/i);
    if (hl) out.push({ hreflang: hl[1], href: href ? href[1] : '' });
  }
  return out;
}

export const W193_hreflang: CheckpointDefinition = {
  id: 'W193',
  title: 'Hreflang: GET /ko → link[rel=alternate][hreflang] 에 ko/zh-hant/en 포함',
  verification:
    'page.request.get("/ko") → <link rel="alternate" hreflang="..."> 에 ko, zh-hant(zh-Hant), en 이 모두 존재',
  async run({ page, baseUrl, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];

    log('GET /ko — hreflang 확인');
    const { status, body } = await fetchHead(page, baseUrl, '/ko');
    log(`status=${status}`);
    if (status !== 200) {
      findings.push({ severity: 'blocker', summary: `GET /ko 가 200 이 아님 (status=${status})` });
      await recordEvidence('hreflang-home-not-200');
      return { findings };
    }

    const alternates = extractHreflangs(body);
    log(`alternate link 수: ${alternates.length}, hreflangs=[${alternates.map((a) => a.hreflang).join(',')}]`);
    await recordEvidence('hreflang-alternates');

    if (alternates.length === 0) {
      findings.push({
        severity: 'blocker',
        summary: '/ko head 에 <link rel="alternate" hreflang> 태그가 하나도 없음 — alternates.languages 미출력',
      });
      return { findings };
    }

    const has = (locale: string) =>
      alternates.some((a) => a.hreflang.toLowerCase() === locale.toLowerCase());
    const ko = has('ko');
    const zh = has('zh-hant') || has('zh-Hant') || has('zh-hant');
    const en = has('en');
    log(`hreflang 존재: ko=${ko}, zh-hant=${zh}, en=${en}`);

    const missing: string[] = [];
    if (!ko) missing.push('ko');
    if (!zh) missing.push('zh-hant');
    if (!en) missing.push('en');

    if (missing.length > 0) {
      findings.push({
        severity: 'blocker',
        summary: `/ko hreflang 에 일부 locale 이 누락됨 (누락: ${missing.join(', ')}, 검출된 hreflang=[${alternates.map((a) => a.hreflang).join(',')}])`,
      });
    }

    return { findings };
  },
};
