import { expect, type Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder, selectFirstNode } from '../helpers';

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

async function openVersionHistoryPanel(page: Page): Promise<boolean> {
  // 1차: 상단바 히스토리 버튼 직접 오픈.
  const topbarBtn = topbarHistoryButton(page);
  if (await topbarBtn.isVisible().catch(() => false)) {
    await topbarBtn.click({ force: true });
    if (
      await page
        .locator(VERSION_PANEL_SEL)
        .first()
        .waitFor({ state: 'visible', timeout: 8_000 })
        .then(() => true)
        .catch(() => false)
    ) {
      return true;
    }
  }
  // 2차: rail history → drawer → "열기/Open/開啟" 버튼.
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

export const W26_versionHistory: CheckpointDefinition = {
  id: 'W26',
  title: '버전 히스토리 패널: 노드 편집 → 리비전 목록 → 이전 리비전 복원',
  verification:
    '노드 위치 이동(nudge) → 히스토리 패널 오픈 → 리비전 목록 렌더 확인 → 이전 리비전 복원 진입점이 있으면 복원 후 되돌림 검증, 없으면 정직 blocker',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    // Hard rule 1: 이전 시나리오가 남긴 popover/drawer 정리.
    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('노드 선택 후 nudge (위치 이동으로 변경 발생)');
    await selectFirstNode(page).catch(() => null);
    await page.waitForTimeout(300);
    // 방향키로 살짝 이동 → undo 스택 + autosave 트리거.
    for (let i = 0; i < 3; i += 1) {
      await page.keyboard.press('ArrowRight').catch(() => undefined);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(800);
    await recordEvidence('node-nudged');

    // 히스토리 패널의 리비전 목록은 서버에 저장된 리비전이 있어야 채워진다.
    // seed fixture 에는 리비전이 없으므로, 현재 draft 를 수동 스냅샷(POST /revisions)
    // 하여 최소 1개 리비전을 만든다.
    //
    // 주의: pageId 는 'home' 이 아니다 — site 문서의 실제 home page pageId 이다.
    // pages API 로 해결 (isHomePage 또는 slug='' 또는 첫 페이지). siteId 는 동일 페이지
    // 컨텍스트의 fetch 가 referer/default 로 동일하게 해결하므로 명시 전달하지 않는다.
    log('실제 home pageId 해결 (GET /api/builder/site/pages)');
    const homePageId = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/builder/site/pages?locale=ko', {
          credentials: 'same-origin',
        });
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
    log(`home pageId 해결: "${homePageId}"`);
    if (!homePageId) {
      findings.push({
        severity: 'blocker',
        summary: 'pages API(GET /api/builder/site/pages)에서 home pageId 를 해결하지 못함 — 복원 플로우 검증 불가',
      });
      await recordEvidence('home-pageid-unresolved');
      return { findings };
    }

    log('수동 리비전 스냅샷 생성 (POST /revisions, pageId=실제 home)');
    const revisionCreated = await page.evaluate(
      async (pageId) => {
        try {
          const res = await fetch(
            `/api/builder/site/pages/${encodeURIComponent(pageId)}/revisions?locale=ko`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'same-origin',
              // document 를 생략하면 서버가 현재 draft 를 읽어 스냅샷한다 (route POST 참조).
              body: JSON.stringify({ source: 'manual' }),
            },
          );
          return res.ok;
        } catch {
          return false;
        }
      },
      homePageId,
    );
    log(`리비전 생성: ${revisionCreated ? '성공' : '실패'} (pageId=${homePageId})`);
    if (!revisionCreated) {
      findings.push({
        severity: 'blocker',
        summary: `수동 리비전 스냅샷 생성 실패 (POST /api/builder/site/pages/${homePageId}/revisions) — 복원 플로우 검증 불가`,
      });
      await recordEvidence('revision-create-failed');
      return { findings };
    }

    log('버전 히스토리 패널 오픈');
    const opened = await openVersionHistoryPanel(page);
    if (!opened) {
      findings.push({
        severity: 'blocker',
        summary:
          '버전 히스토리 패널(data-builder-version-history-dialog)이 열리지 않음 (상단바 히스토리 버튼 및 rail→열기 경로 모두 실패)',
      });
      await recordEvidence('history-panel-not-open');
      return { findings };
    }
    await recordEvidence('history-panel-open');

    log('리비전 목록 확인');
    // 패널이 로딩 후 리비전을 렌더할 때까지 대기.
    await page.waitForTimeout(1500);
    const revisionRows = page.locator(`${VERSION_PANEL_SEL} [data-builder-version-revision-source]`);
    const revisionCount = await revisionRows.count().catch(() => 0);
    log(`리비전 행 수: ${revisionCount}`);

    // 빈 상태 메시지도 유효한 패널 동작이다.
    const emptyNotice = await page
      .locator(`${VERSION_PANEL_SEL}`)
      .getByText(/저장된 리비전이 없습니다|No saved revisions|沒有已儲存的修訂/)
      .first()
      .isVisible()
      .catch(() => false);
    await recordEvidence('history-revision-list');

    if (revisionCount === 0) {
      findings.push({
        severity: 'blocker',
        summary:
          emptyNotice
            ? '히스토리 패널은 정상 동작하나 저장된 리비전이 없어 복원(restore) 플로우를 검증할 수 없음 — 발행/수동 스냅샷 선행 필요'
            : '히스토리 패널에 리비전 행이 0개이고 빈 상태 안내도 보이지 않음 (로딩/렌더 의심)',
      });
      return { findings };
    }

    log('이전 리비전 복원 진입점(inlineRestoreButton) 확인');
    // 첫 리비전(가장 오래된 쪽이 아닌 첫 행)의 복원 버튼.
    const restoreEntry = revisionRows
      .first()
      .locator('button', { hasText: new RegExp(RESTORE_LABELS.join('|')) })
      .first();
    const restoreEntryVisible = await restoreEntry.isVisible().catch(() => false);
    if (!restoreEntryVisible) {
      findings.push({
        severity: 'blocker',
        summary: '리비전 행에 복원 진입점 버튼(복원/Restore/還原)이 보이지 않음',
      });
      await recordEvidence('restore-entry-missing');
      return { findings };
    }
    await recordEvidence('restore-entry-visible');

    log('복원 확인 다이얼로그 오픈');
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
        summary: '복원 확인 다이얼로그(data-builder-version-restore-dialog)가 열리지 않음',
      });
      await recordEvidence('restore-confirm-not-open');
      return { findings };
    }
    await recordEvidence('restore-confirm-open');

    log('복원 확정 버튼 클릭');
    const confirmRestore = page
      .locator(`${RESTORE_CONFIRM_SEL} button`, { hasText: new RegExp(RESTORE_LABELS.join('|')) })
      .last();
    await confirmRestore.click({ force: true });
    // 복원 완료 대기 — 확인 다이얼로그 닫힘.
    await expect
      .poll(
        async () => page.locator(RESTORE_CONFIRM_SEL).first().isVisible().catch(() => false),
        { timeout: 12_000 },
      )
      .toBe(false)
      .catch(() => undefined);
    await page.waitForTimeout(800);
    await recordEvidence('restore-confirmed');

    log('복원 후 캔버스 정상 렌더 확인 (노드 존재)');
    const nodeCount = await page.locator('[data-node-id]:visible').count().catch(() => 0);
    log(`복원 후 보이는 노드 수: ${nodeCount}`);
    if (nodeCount === 0) {
      findings.push({
        severity: 'blocker',
        summary: '이전 리비전 복원 후 캔버스에 노드가 하나도 렌더되지 않음 (복원 결과 비정상)',
      });
    } else {
      log('복원 정상 완료 — 노드 렌더됨');
    }

    return { findings };
  },
};
