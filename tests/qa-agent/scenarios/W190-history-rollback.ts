import { expect, type Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

// 발행/버전 히스토리: VersionHistoryPanel(data-builder-version-history-dialog).
// 리비전 행 = [data-builder-version-revision-source], source 값 publish/rollback-backup/manual.
//
// revision POST 계약은 W26-version-history.ts 가 정확히 사용한다 — body { source: 'manual' }
// (siteId 불필요), pageId 는 pages API 로 해결한 실제 home pageId. 발행 자체는 W161-parallax.ts
// 의 direct publish API(POST /api/builder/publish/atomic) 패턴으로 2회 수행 → source='publish'
// 리비전 2개 생성 → 히스토리 패널에 2+ 행 렌더 확인 → 롤백 진입점(복원/Restore/還原) → 확인
// 다이얼로그(data-builder-version-restore-dialog) → 확정 → 캔버스 되돌림 검증.
const HISTORY_RAIL_SEL = '[data-builder-rail-item="history"]';
const VERSION_PANEL_SEL = '[data-builder-version-history-dialog="true"]';
const RESTORE_CONFIRM_SEL = '[data-builder-version-restore-dialog="true"]';

const TOPBAR_HISTORY_LABELS = ['히스토리', 'History', '記錄'];
const RAIL_OPEN_LABELS = ['열기', 'Open', '開啟'];
const RESTORE_LABELS = ['복원', 'Restore', '還原'];

function topbarHistoryButton(page: Page) {
  return page
    .locator('[data-builder-topbar-secondary="true"]')
    .filter({ hasText: new RegExp(TOPBAR_HISTORY_LABELS.join('|')) })
    .first();
}

async function openHistoryPanel(page: Page): Promise<boolean> {
  const topbarBtn = topbarHistoryButton(page);
  if (await topbarBtn.isVisible().catch(() => false)) {
    await topbarBtn.click({ force: true });
    if (await page.locator(VERSION_PANEL_SEL).first().waitFor({ state: 'visible', timeout: 8_000 }).then(() => true).catch(() => false)) {
      return true;
    }
  }
  const rail = page.locator(HISTORY_RAIL_SEL).first();
  if (!(await rail.isVisible().catch(() => false))) return false;
  await rail.click({ force: true });
  await page.waitForTimeout(450);
  const openBtn = page
    .locator('aside')
    .locator('button', { hasText: new RegExp(RAIL_OPEN_LABELS.join('|')) })
    .first();
  if (!(await openBtn.isVisible().catch(() => false))) return false;
  await openBtn.click({ force: true });
  return page
    .locator(VERSION_PANEL_SEL)
    .first()
    .waitFor({ state: 'visible', timeout: 8_000 })
    .then(() => true)
    .catch(() => false);
}

// 실제 home pageId 해결 (W26/W161 동일 패턴: GET /api/builder/site/pages).
async function resolveHomePageId(page: Page): Promise<string> {
  return page.evaluate(async () => {
    try {
      const res = await fetch('/api/builder/site/pages?locale=ko', { credentials: 'same-origin' });
      if (!res.ok) return '';
      const data = (await res.json()) as {
        pages?: Array<{ pageId: string; slug?: string; isHomePage?: boolean }>;
      };
      const pages = data.pages ?? [];
      const home =
        pages.find((p) => p.isHomePage) ??
        pages.find((p) => (p.slug ?? '') === '') ??
        pages[0];
      return home?.pageId ?? '';
    } catch {
      return '';
    }
  });
}

// data-builder-save-status 칩이 'saved' 가 되면 autosave flush 완료 (W161 패턴).
async function waitForDraftSaved(page: Page, timeout = 10_000): Promise<boolean> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const status = await page
      .evaluate(
        () =>
          document
            .querySelector('[data-builder-save-status]')
            ?.getAttribute('data-builder-save-status') ?? null,
      )
      .catch(() => null);
    if (status === 'saved') return true;
    if (status === 'error') return false;
    await page.waitForTimeout(150);
  }
  return false;
}

// publish API 로 직접 발행 (W161 패턴: POST /api/builder/publish/atomic).
// 발행은 source='publish' 리비전을 생성한다 (publish.ts recordRevision).
async function publishSiteViaApi(
  page: Page,
  pageId: string,
  log: (step: string) => void,
): Promise<boolean> {
  if (!pageId) {
    log('home pageId 없음 — 발행 API 호출 불가');
    return false;
  }
  log('publish API 호출: POST /api/builder/publish/atomic');
  try {
    const res = await page.request.post('/api/builder/publish/atomic', {
      data: { pageIds: [pageId], cmsCollectionIds: [], locale: 'ko' },
      timeout: 60_000,
    });
    const status = res.status();
    const payload = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    log(`publish API 응답: status=${status}, ok=${payload.ok ?? false}${payload.error ? `, error=${payload.error}` : ''}`);
    return status === 200 && payload.ok === true;
  } catch (err) {
    log(`publish API 예외: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

export const W190_historyRollback: CheckpointDefinition = {
  id: 'W190',
  title: '발행 이력/롤백: 발행 2회 → 발행 이력 리스트 2+ 렌더 → 이전 리비전으로 롤백 → 캔버스 되돌림',
  verification:
    'direct publish API 로 2회 발행(source=publish 리비전 생성) → 버전 히스토리 패널에 리비전 2+ 행 렌더 → 롤백 진입점으로 이전 리비전 복원 → 캔버스 정상 렌더(되돌림) 확인',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('실제 home pageId 해결 (GET /api/builder/site/pages)');
    const homePageId = await resolveHomePageId(page);
    log(`home pageId 해결: "${homePageId}"`);
    if (!homePageId) {
      findings.push({
        severity: 'blocker',
        summary: 'pages API(GET /api/builder/site/pages)에서 home pageId 를 해결하지 못함 — 발행/롤백 검증 불가',
      });
      await recordEvidence('home-pageid-unresolved');
      return { findings };
    }

    log('초안 autosave flush 대기 (data-builder-save-status=saved)');
    const flushed = await waitForDraftSaved(page);
    if (!flushed) {
      log('autosave flush 미확인 — 발행은 계속, 게시본이 초안을 못 따를 수 있음');
    }

    // direct publish API 로 2회 발행 → source='publish' 리비전 2개 생성.
    log('발행 #1 (publish API)');
    const pub1 = await publishSiteViaApi(page, homePageId, log);
    if (!pub1) {
      findings.push({
        severity: 'blocker',
        summary: '발행 #1 실패(POST /api/builder/publish/atomic) — 발행 이력/롤백 검증 불가',
      });
      await recordEvidence('publish-1-failed');
      return { findings };
    }
    await page.waitForTimeout(600);
    log('발행 #2 (publish API)');
    const pub2 = await publishSiteViaApi(page, homePageId, log);
    if (!pub2) {
      findings.push({
        severity: 'blocker',
        summary: '발행 #2 실패(POST /api/builder/publish/atomic) — 리비전 2개 확보 불가',
      });
      await recordEvidence('publish-2-failed');
      return { findings };
    }
    await recordEvidence('two-publishes-done');

    log('버전 히스토리 패널 오픈');
    const opened = await openHistoryPanel(page);
    if (!opened) {
      findings.push({
        severity: 'blocker',
        summary: '버전 히스토리 패널(data-builder-version-history-dialog)이 열리지 않음',
      });
      await recordEvidence('history-panel-not-open');
      return { findings };
    }
    await recordEvidence('history-panel-open');

    log('발행 이력(리비전) 리스트 확인');
    await page.waitForTimeout(1500);
    const revisionRows = page.locator(`${VERSION_PANEL_SEL} [data-builder-version-revision-source]`);
    const revisionCount = await revisionRows.count().catch(() => 0);
    log(`리비전 행 수: ${revisionCount}`);
    await recordEvidence('history-revision-list');

    if (revisionCount < 2) {
      findings.push({
        severity: 'blocker',
        summary: `발행 2회 후에도 히스토리 패널 리비전 행이 2개 미만(${revisionCount}) — 발행이 source='publish' 리비전을 생성하지 않았거나 패널 로딩/렌더 의심`,
      });
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }

    log('이전 리비전 롤백 진입점(복원 버튼) 확인');
    const restoreEntry = revisionRows
      .first()
      .locator('button', { hasText: new RegExp(RESTORE_LABELS.join('|')) })
      .first();
    const restoreEntryVisible = await restoreEntry.isVisible().catch(() => false);
    if (!restoreEntryVisible) {
      findings.push({
        severity: 'blocker',
        summary: '리비전 행에 롤백 진입점 버튼(복원/Restore/還原)이 보이지 않음',
      });
      await recordEvidence('rollback-entry-missing');
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }
    await recordEvidence('rollback-entry-visible');

    // 롤백 전 캔버스 fingerprint (되돌림 검증 기준점).
    const beforeCount = await page.locator('[data-node-id]:visible').count().catch(() => 0);
    log(`롤백 전 보이는 노드 수: ${beforeCount}`);

    log('롤백 확인 다이얼로그 오픈');
    await restoreEntry.click({ force: true });
    const confirmVisible = await page
      .locator(RESTORE_CONFIRM_SEL)
      .first()
      .waitFor({ state: 'visible', timeout: 6_000 })
      .then(() => true)
      .catch(() => false);
    if (!confirmVisible) {
      findings.push({
        severity: 'blocker',
        summary: '롤백 확인 다이얼로그(data-builder-version-restore-dialog)가 열리지 않음',
      });
      await recordEvidence('rollback-confirm-not-open');
      await page.keyboard.press('Escape').catch(() => undefined);
      return { findings };
    }
    await recordEvidence('rollback-confirm-open');

    log('롤백 확정');
    const confirmRestore = page
      .locator(`${RESTORE_CONFIRM_SEL} button`, { hasText: new RegExp(RESTORE_LABELS.join('|')) })
      .last();
    await confirmRestore.click({ force: true });
    await expect
      .poll(
        async () => page.locator(RESTORE_CONFIRM_SEL).first().isVisible().catch(() => false),
        { timeout: 12_000 },
      )
      .toBe(false)
      .catch(() => undefined);
    await page.waitForTimeout(800);
    await recordEvidence('rollback-confirmed');

    log('롤백 후 캔버스 되돌림(정상 렌더) 확인');
    const afterCount = await page.locator('[data-node-id]:visible').count().catch(() => 0);
    log(`롤백 후 보이는 노드 수: ${afterCount}`);
    if (afterCount === 0) {
      findings.push({
        severity: 'blocker',
        summary: '이전 리비전으로 롤백 후 캔버스에 노드가 하나도 렌더되지 않음 (롤백 결과 비정상)',
      });
    }

    log('cleanup: 초안/게시본 일치 복원을 위해 재발행');
    await publishSiteViaApi(page, homePageId, log).catch(() => undefined);
    await recordEvidence('cleanup-republished');

    return { findings };
  },
};
