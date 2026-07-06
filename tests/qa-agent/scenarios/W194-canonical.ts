import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

// 발행 페이지 메타데이터 의 alternates.canonical 은 <link rel="canonical" href="..."> 로 렌더된다.
// SEO 패널 기본 탭의 #builder-seo-canonical 입력으로 페이지별 canonical override 가 가능하다.
const SEO_PANEL_SEL = '[data-builder-seo-panel-dialog="true"]';

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

function extractCanonical(body: string): string | null {
  const m = body.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i);
  if (!m) return null;
  const href = m[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1] : null;
}

function seoButton(page: Page) {
  return page
    .locator('[data-builder-topbar-secondary="true"]')
    .filter({ hasText: 'SEO' })
    .first();
}

export const W194_canonical: CheckpointDefinition = {
  id: 'W194',
  title: 'Canonical: GET /ko + 서브페이지 → link[rel=canonical] 올바름 + SEO 패널 canonical 필드 존재',
  verification:
    'page.request.get("/ko") 와 "/ko/about" → <link rel="canonical" href> 가 각 경로에 맞게 출력. SEO 패널 기본 탭에 canonical 입력(#builder-seo-canonical) 존재',
  async run({ page, baseUrl, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];

    log('GET /ko — canonical 확인');
    const home = await fetchHead(page, baseUrl, '/ko');
    const homeCanonical = home.status === 200 ? extractCanonical(home.body) : null;
    log(`/ko status=${home.status}, canonical=${homeCanonical}`);
    await recordEvidence('canonical-home');
    if (home.status !== 200) {
      findings.push({ severity: 'blocker', summary: `GET /ko 가 200 이 아님 (status=${home.status})` });
    } else if (!homeCanonical) {
      findings.push({ severity: 'blocker', summary: '/ko head 에 <link rel="canonical"> 가 없음' });
    } else if (!/\/ko\/?([?#]|$)/.test(homeCanonical)) {
      findings.push({
        severity: 'visual',
        summary: `/ko canonical 이 홈 경로를 가리키지 않음 (canonical=${homeCanonical})`,
      });
    }

    log('GET /ko/about — canonical 확인');
    const about = await fetchHead(page, baseUrl, '/ko/about');
    const aboutCanonical = about.status === 200 ? extractCanonical(about.body) : null;
    log(`/ko/about status=${about.status}, canonical=${aboutCanonical}`);
    await recordEvidence('canonical-subpage');
    if (about.status !== 200) {
      findings.push({
        severity: 'visual',
        summary: `GET /ko/about 가 200 이 아님 (status=${about.status}) — 페이지 미발행 가능`,
      });
    } else if (!aboutCanonical) {
      findings.push({ severity: 'blocker', summary: '/ko/about head 에 <link rel="canonical"> 가 없음' });
    } else if (!/\/ko\/about/.test(aboutCanonical)) {
      findings.push({
        severity: 'visual',
        summary: `/ko/about canonical 이 about 경로를 가리키지 않음 (canonical=${aboutCanonical})`,
      });
    }

    // SEO 패널에 canonical 필드가 있는지 확인(저장 없이).
    log('admin-builder 진입 → SEO 패널의 canonical 필드 확인');
    await gotoBuilder(page, baseUrl);
    await dismissOverlays(page);

    const seoBtn = seoButton(page);
    if (!(await seoBtn.isVisible().catch(() => false)) || !(await seoBtn.isEnabled().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: '상단바 SEO 버튼을 찾을 수 없거나 비활성화됨' });
      await recordEvidence('canonical-seo-button-missing');
      return { findings };
    }
    await seoBtn.click({ force: true });
    const panelOpen = await page
      .locator(SEO_PANEL_SEL)
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (!panelOpen) {
      findings.push({ severity: 'blocker', summary: 'SEO 패널이 열리지 않음' });
      await recordEvidence('canonical-panel-not-open');
      return { findings };
    }

    const canonicalInput = page.locator('#builder-seo-canonical').first();
    const canonicalVisible = await canonicalInput
      .waitFor({ state: 'visible', timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    await recordEvidence('canonical-field-check');
    if (!canonicalVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'SEO 패널 기본 탭에 canonical 입력(#builder-seo-canonical)이 없음',
      });
    }

    log('저장 없이 패널 닫기 (Escape)');
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(400);

    return { findings };
  },
};
