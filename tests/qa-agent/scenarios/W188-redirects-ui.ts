import { type Dialog, type Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';

// 리디렉션 관리자(src/app/(builder)/[locale]/admin-builder/seo/redirects/page.tsx → RedirectsListView)
// 상단 add-form: placeholder="/old-path"(from), "/new-path"(to), status select(기본 301), 제출버튼 "규칙 추가".
// 생성 시 POST /api/builder/site/redirects → 새 규칙이 리스트 맨 앞에 prepended.
// handleDelete 는 window.confirm 을 쓰므로 Playwright dialog handler 로 accept 해야 삭제가 진행된다.
const REDIRECTS_PATH = '/ko/admin-builder/seo/redirects';
const ADD_FROM_SEL = 'input[placeholder="/old-path"]';
const ADD_TO_SEL = 'input[placeholder="/new-path"]';
const CREATE_LABELS = ['규칙 추가', 'Add rule', '新增規則'];
const DELETE_LABELS = ['삭제', 'Delete', '刪除'];
const SOURCE_ARIA_PREFIX = 'Source path for';

function createButton(page: Page) {
  return page
    .locator('form')
    .locator('button[type="submit"]', { hasText: new RegExp(CREATE_LABELS.join('|')) })
    .first();
}

function firstRedirectId(page: Page): Promise<string | null> {
  return page
    .locator(`input[aria-label^="${SOURCE_ARIA_PREFIX} "]`)
    .first()
    .getAttribute('aria-label')
    .then((label) => {
      if (!label) return null;
      const match = label.match(new RegExp(`${SOURCE_ARIA_PREFIX} (.+)$`));
      return match ? match[1] : null;
    })
    .catch(() => null);
}

async function apiDeleteRedirect(page: Page, id: string, locale: string): Promise<boolean> {
  try {
    const res = await page.request.get(
      `/api/builder/site/redirects/${encodeURIComponent(id)}?locale=${locale}`,
    );
    const before = res.status();
    if (before === 404) return true;
    const del = await page.request.delete(
      `/api/builder/site/redirects/${encodeURIComponent(id)}?locale=${locale}`,
    );
    return del.ok();
  } catch {
    return false;
  }
}

async function fetchRedirectStatus(page: Page, baseUrl: string, from: string): Promise<number> {
  const url = new URL(from, baseUrl).toString();
  try {
    const res = await page.request.get(url, { maxRedirects: 0, timeout: 30_000 });
    return res.status();
  } catch {
    return 0;
  }
}

export const W188_redirectsUi: CheckpointDefinition = {
  id: 'W188',
  title: '리디렉션 관리 UI: /qa-old → /ko 규칙 추가 → GET /qa-old 가 301/308 → 규칙 삭제',
  verification:
    '리디렉션 페이지 add-form 에서 from=/qa-old-…, to=/ko 생성 → page.request.get(from, maxRedirects:0) 가 301/308 → 행 삭제(또는 API DELETE) 로 정리',
  async run({ page, baseUrl, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];
    const stamp = Date.now().toString(36);
    const from = `/qa-old-${stamp}`;
    const to = '/ko';
    const note = `QA redirect ${stamp}`;

    log('리디렉션 페이지 진입 (/ko/admin-builder/seo/redirects)');
    await page.goto(new URL(REDIRECTS_PATH, baseUrl).toString(), {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });

    log(`add-form 입력 (from=${from}, to=${to})`);
    const fromInput = page.locator(ADD_FROM_SEL).first();
    const toInput = page.locator(ADD_TO_SEL).first();
    const fromVisible = await fromInput.waitFor({ state: 'visible', timeout: 8_000 }).then(() => true).catch(() => false);
    if (!fromVisible) {
      findings.push({
        severity: 'blocker',
        summary: '리디렉션 add-form 의 원본 입력(placeholder="/old-path")을 찾지 못함',
      });
      await recordEvidence('redirect-add-form-missing');
      return { findings };
    }
    await fromInput.click({ force: true });
    await fromInput.fill(from);
    await toInput.click({ force: true });
    await toInput.fill(to);
    const noteInput = page.locator('input[aria-label="메모"], input[aria-label="Note"], input[aria-label="備註"]').first();
    if (await noteInput.isVisible().catch(() => false)) {
      await noteInput.fill(note).catch(() => undefined);
    }

    log('규칙 생성 버튼 클릭');
    const createBtn = createButton(page);
    const createVisible = await createBtn.isVisible().catch(() => false);
    if (!createVisible) {
      findings.push({
        severity: 'blocker',
        summary: '리디렉션 생성 버튼(규칙 추가/Add rule/新增規則)을 찾지 못함',
      });
      await recordEvidence('redirect-create-button-missing');
      return { findings };
    }
    await createBtn.click({ force: true });
    await page.waitForTimeout(1500);
    await recordEvidence('redirect-created');

    log(`GET ${from} (maxRedirects:0) → 301/308 확인`);
    const status = await fetchRedirectStatus(page, baseUrl, from);
    log(`status=${status}`);
    await recordEvidence('redirect-status-check');
    if (status !== 301 && status !== 308 && status !== 302 && status !== 307) {
      findings.push({
        severity: 'blocker',
        summary: `생성한 리디렉션 ${from} GET 결과가 3xx 리다이렉트가 아님 (status=${status}) — 사이트 리디렉트 미들웨어/rewrite 미적용 가능`,
      });
    }

    log('cleanup: 생성한 규칙 삭제 (UI 삭제 + API DELETE 폴백)');
    const createdId = await firstRedirectId(page);
    let removed = false;

    // window.confirm 자동 수락 핸들러 등록(Playwright 기본은 confirm 을 dismiss 함).
    const dialogHandler = (dialog: Dialog) => void dialog.accept();
    page.on('dialog', dialogHandler);
    try {
      const deleteBtn = page
        .locator('tr')
        .filter({ has: page.locator(`input[aria-label^="${SOURCE_ARIA_PREFIX} "]`).first() })
        .first()
        .locator('button', { hasText: new RegExp(DELETE_LABELS.join('|')) })
        .first();
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click({ force: true }).catch(() => undefined);
        await page.waitForTimeout(1200);
        removed = true;
      }
    } catch {
      removed = false;
    } finally {
      page.off('dialog', dialogHandler);
    }

    if (!removed && createdId) {
      log(`UI 삭제 미동작 → API DELETE 폴백 (id=${createdId})`);
      removed = await apiDeleteRedirect(page, createdId, 'ko');
    }

    // 삭제 검증: from GET 가 더 이상 3xx 가 아니어야 한다(404/200 등).
    if (removed) {
      await page.waitForTimeout(500);
      const afterStatus = await fetchRedirectStatus(page, baseUrl, from);
      log(`삭제 후 GET status=${afterStatus}`);
      if (afterStatus === 301 || afterStatus === 308 || afterStatus === 302 || afterStatus === 307) {
        findings.push({
          severity: 'visual',
          summary: `삭제 후에도 ${from} 가 여전히 3xx 리다이렉트 (status=${afterStatus}) — 캐시/삭제 미반영 가능`,
        });
      }
    } else {
      findings.push({
        severity: 'visual',
        summary: `cleanup 실패(harness concern) — 생성한 리디렉션(${from})을 UI/API 로 삭제하지 못함. 수동 정리 필요.`,
      });
    }
    await recordEvidence('redirect-removed');

    return { findings };
  },
};
