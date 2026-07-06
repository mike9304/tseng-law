import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { canvasEditor, dismissOverlays, gotoBuilder } from '../helpers';
import { createBlankPage, deletePageBySlug, waitForStableCanvas } from './_builderPageNav';

// PublishModal(src/components/builder/canvas/PublishModal.tsx) 의 PublishModalSchedulePanel.
// schedule input = datetime-local, schedule 버튼 = [data-builder-publish-schedule-action="schedule"],
// 예약 작업 상태 = [data-builder-publish-schedule-status="scheduled"], 취소 버튼 = action="cancel".
//
// 예약(schedule) 버튼은 canSubmitPublish(= 사전검사 통과 + warning override + translation site
// review 확인) 일 때만 활성화된다. home 은 번역 site-wide warning 으로 canSubmitPublish=false 가
// 되므로, (1) 빈 페이지를 새로 만들어 per-page blocker 를 회피하고, (2) 필요시 모달의
// acknowledgement 패널(translation 확인 버튼 + warning override 버튼)을 눌러 site-wide 게이트를
// 푼다. 그 후 미래 시간 예약 → 예약 작업 노출 → 취소 → 페이지 삭제 cleanup.
function publishButton(page: Page) {
  return page
    .locator(
      [
        'button[title="사이트 발행"]',
        'button[title*="發布"]',
        'button[title*="發佈"]',
        'button[title*="Publish"]',
        'button[aria-label*="발행"]',
        'button[aria-label*="Publish"]',
        'button[aria-label*="發佈"]',
      ].join(', '),
    )
    .first();
}

const SCHEDULE_ACTION_SEL = '[data-builder-publish-schedule-action]';
const SCHEDULE_STATUS_SEL = '[data-builder-publish-schedule-status="scheduled"]';
const OVERRIDE_LABELS = ['경고 무시하고 발행', 'Publish anyway', '忽略警告並發佈'];
const ACK_SEL = '[data-builder-publish-site-translation-acknowledge="true"]';

// ─── 텍스트 노드 1개 추가 (page-empty blocker 해소) ───────────────────────────
// 빈 페이지(nodes.length === 0)는 checkEmptyContent(src/lib/builder/publish-gate/
// checks.ts) 가 'page-empty' BLOCKER 를 발생시켜 canSubmitPublish 가 영구 false 가
// 된다. BLOCKER 는 acknowledgement/override 로 풀 수 없다(override = warning 전용).
// 그래서 Add rail 의 text 카드 quick-add(handleQuickAdd('text') → addNode) 로 노드를
// 하나 올린다. text 컴포넌트 defaultContent.text = '텍스트를 입력하세요'(비어있지 않아
// text-empty warning 도 없음). 패턴 출처: W15(add rail 오픈), W22/W23(catalog 카드 삽입).
const ADD_RAIL_SEL =
  '[data-builder-rail-item="add"], button[aria-label*="Add"], button[aria-label*="추가"]';
const ADD_DRAWER_SEL =
  '[data-builder-drawer="add"], [aria-label*="Add panel"], [class*="addPanel"], [class*="AddPanel"]';
const TEXT_CARD_SEL = '[data-builder-add-card="text"]';
const TEXT_DRAG_SOURCE_SEL = '[data-builder-add-card-kind="text"]';
const CANVAS_STAGE_SEL = '[role="application"][aria-label="Canvas editor"]';

async function openAddDrawer(page: Page): Promise<boolean> {
  const rail = page.locator(ADD_RAIL_SEL).first();
  if (!(await rail.isVisible().catch(() => false))) return false;
  await rail.click({ force: true });
  await page.waitForTimeout(450);
  return page.locator(ADD_DRAWER_SEL).first().isVisible().catch(() => false);
}

async function canvasNodeIds(page: Page): Promise<string[]> {
  return canvasEditor(page)
    .locator('[data-node-id]')
    .evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-node-id') ?? '').filter(Boolean),
    );
}

async function freshNodeAppeared(page: Page, beforeIds: Set<string>): Promise<boolean> {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    const ids = await canvasNodeIds(page);
    if (ids.some((id) => !beforeIds.has(id))) return true;
    await page.waitForTimeout(250);
  }
  return false;
}

// W23 의 검증된 drag 기계(공유 DataTransfer 로 onDragStart → dragover → drop).
async function dragTextCardToCanvas(page: Page): Promise<void> {
  await page.evaluate(
    ({ sourceSelector, stageSelector, point }) => {
      const source = document.querySelector<HTMLElement>(sourceSelector);
      const stage = document.querySelector<HTMLElement>(stageSelector);
      if (!source || !stage) throw new Error('text_drag_target_missing');
      const stageRect = stage.getBoundingClientRect();
      const clientX = stageRect.left + point.x * (stageRect.width / stage.offsetWidth);
      const clientY = stageRect.top + point.y * (stageRect.height / stage.offsetHeight);
      const dataTransfer = new DataTransfer();
      source.dispatchEvent(
        new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }),
      );
      stage.dispatchEvent(
        new DragEvent('dragover', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }),
      );
      stage.dispatchEvent(
        new DragEvent('drop', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }),
      );
    },
    { sourceSelector: TEXT_DRAG_SOURCE_SEL, stageSelector: CANVAS_STAGE_SEL, point: { x: 300, y: 240 } },
  );
}

// 빈 페이지에 텍스트 노드 1개 추가. 1차 quick-add 버튼 클릭, 2차 drag fallback.
async function addTextNode(page: Page, log: (s: string) => void): Promise<boolean> {
  if (!(await openAddDrawer(page))) {
    log('Add drawer 가 열리지 않음 — 텍스트 노드 추가 불가');
    return false;
  }
  const beforeIds = new Set(await canvasNodeIds(page));

  const card = page.locator(TEXT_CARD_SEL).first();
  if (await card.isVisible().catch(() => false)) {
    await card.scrollIntoViewIfNeeded().catch(() => undefined);
    // quick-add 버튼 = text 카드 내에서 drag 소스(data-builder-add-card-kind)가 아닌 버튼.
    const quickBtn = page
      .locator(`${TEXT_CARD_SEL} button:not([data-builder-add-card-kind])`)
      .first();
    if (await quickBtn.isVisible().catch(() => false)) {
      log('text 카드 quick-add 버튼 클릭');
      await quickBtn.click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(450);
      if (await freshNodeAppeared(page, beforeIds)) {
        await page.keyboard.press('Escape').catch(() => undefined);
        await page.waitForTimeout(250);
        return true;
      }
      log('quick-add 후 새 노드 미등장 — drag fallback 시도');
    } else {
      log('quick-add 버튼을 찾지 못함 — drag fallback 시도');
    }
  } else {
    log('text 카드(data-builder-add-card="text")가 보이지 않음 — drag fallback 시도');
  }

  const dragSource = page.locator(TEXT_DRAG_SOURCE_SEL).first();
  if (await dragSource.isVisible().catch(() => false)) {
    await dragSource.scrollIntoViewIfNeeded().catch(() => undefined);
    await dragTextCardToCanvas(page);
    await page.waitForTimeout(500);
    if (await freshNodeAppeared(page, beforeIds)) {
      await page.keyboard.press('Escape').catch(() => undefined);
      await page.waitForTimeout(250);
      return true;
    }
  }
  await page.keyboard.press('Escape').catch(() => undefined);
  await page.waitForTimeout(250);
  return false;
}

async function futureLocalDateTime(page: Page, hoursAhead: number): Promise<string> {
  return page.evaluate((ahead) => {
    const d = new Date(Date.now() + ahead * 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, hoursAhead);
}

async function openPublishModal(page: Page, log: (s: string) => void): Promise<boolean> {
  const btn = publishButton(page);
  if (!(await btn.isVisible().catch(() => false))) return false;
  const enabled = await btn.isEnabled().catch(() => true);
  if (!enabled) return false;
  await btn.click({ force: true });
  const opened = await page
    .locator('[data-modal-shell="true"]')
    .first()
    .waitFor({ state: 'visible', timeout: 12_000 })
    .then(() => true)
    .catch(() => false);
  if (!opened) return false;
  // publishState 가 'checking' → 'ready'/issues 로 전환되어야 schedule panel 이 렌더된다.
  log('발행 모달 오픈 — 사전검사 완료 대기');
  const scheduleReady = await page
    .locator(SCHEDULE_ACTION_SEL)
    .first()
    .waitFor({ state: 'visible', timeout: 20_000 })
    .then(() => true)
    .catch(() => false);
  return scheduleReady;
}

// schedule 버튼이 canSubmitPublish 게이트에 막혀 있으면, publish-gate 가 허용하는
// acknowledgement 경로(translation site warning 확인 + warning override)로 푼다.
async function enableScheduleButton(page: Page, log: (s: string) => void): Promise<boolean> {
  const scheduleBtn = () => page.locator('[data-builder-publish-schedule-action="schedule"]').first();
  for (let i = 0; i < 6; i += 1) {
    if (await scheduleBtn().isEnabled().catch(() => false)) {
      log(`schedule 버튼 활성화됨 (ack 루프 ${i}회)`);
      return true;
    }
    const modal = page.locator('[data-modal-shell="true"]').first();
    const overrideBtn = modal.locator('button', { hasText: new RegExp(OVERRIDE_LABELS.join('|')) }).first();
    if (await overrideBtn.isVisible().catch(() => false)) {
      log('warning override 버튼 클릭 (Publish anyway / 경고 무시하고 발행)');
      await overrideBtn.click({ force: true });
      await page.waitForTimeout(300);
      continue;
    }
    const ackBtn = page.locator(ACK_SEL).first();
    if (await ackBtn.isVisible().catch(() => false)) {
      log('translation site warning 확인(acknowledge) 클릭');
      await ackBtn.click({ force: true });
      await page.waitForTimeout(300);
      continue;
    }
    await page.waitForTimeout(500);
  }
  return scheduleBtn().isEnabled().catch(() => false);
}

export const W189_scheduledPublish: CheckpointDefinition = {
  id: 'W189',
  title: '예약 발행: 발행 모달 예약 옵션 → 미래 시간 예약 → 예약 작업 노출 → 취소',
  verification:
    '발행 모달 → schedule 패널의 datetime-local 입력 → 예약 버튼 → [data-builder-publish-schedule-status="scheduled"] 노출 확인 → 예약 취소',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];
    const slug = `qa-w189-${Date.now().toString(36)}`;
    let createdBlank = false;

    // 빈 페이지 생성 — per-page preflight blocker 회피 (W15 패턴). 실패시 현재 페이지로 진행.
    log('빈 페이지 생성 (per-page preflight blocker 회피)');
    const created = await createBlankPage(page, slug).catch(() => null);
    if (created?.created) {
      createdBlank = true;
      log(`빈 페이지 생성됨: /${slug}`);
    } else {
      log(`빈 페이지 생성 실패(${created?.reason ?? '원인 미상'}) — 현재 페이지로 진행`);
    }
    await dismissOverlays(page);
    await recordEvidence('blank-page-prepared');

    // 빈 페이지는 checkEmptyContent 가 'page-empty' BLOCKER 를 발생시켜
    // canSubmitPublish 가 영구 false 가 된다(blocker 는 override 불가). 텍스트 노드 1개를
    // 추가해 nodes.length>0 + 비어있지 않은 텍스트로 page-empty / text-empty 를 모두 해소.
    if (createdBlank) {
      log('빈 페이지에 텍스트 노드 1개 추가 (page-empty blocker 해소)');
      const added = await addTextNode(page, log).catch(() => false);
      if (!added) {
        findings.push({
          severity: 'blocker',
          summary:
            '텍스트 노드 추가 실패 — 빈 페이지의 page-empty blocker 가 남아 schedule 버튼이 비활성화될 가능성 높음',
        });
      } else {
        log('텍스트 노드 추가됨 — 캔버스 안정 대기');
        await waitForStableCanvas(page);
      }
      await dismissOverlays(page);
      await recordEvidence('text-node-added');
    }

    log('발행 모달 오픈');
    const opened = await openPublishModal(page, log);
    if (!opened) {
      findings.push({
        severity: 'blocker',
        summary:
          '발행 모달 또는 schedule 패널([data-builder-publish-schedule-action])이 열리지 않음 — 발행 버튼 미노출/비활성화 또는 사전검사 미완료',
      });
      await recordEvidence('schedule-panel-not-open');
      if (createdBlank) await deletePageBySlug(page, slug).catch(() => undefined);
      return { findings };
    }
    await recordEvidence('schedule-panel-open');

    log('schedule 버튼 활성화 (preflight acknowledgement — translation 확인 / warning override)');
    const enabled = await enableScheduleButton(page, log);
    if (!enabled) {
      // 남은 blocker 목록의 textContent 를 캡처해 감독자가 어떤 blocker 가 canSubmitPublish
      // 를 막고 있는지 판단할 수 있게 한다. 1차: [data-severity="blocker"] 의 message,
      // 2차 fallback: preflight 카테고리 항목([data-builder-publish-preflight-item]) 전체.
      const blockerTexts = await page
        .locator('[data-modal-shell="true"]')
        .first()
        .evaluate((root) => {
          const msgs = Array.from(
            root.querySelectorAll<HTMLElement>('[data-severity="blocker"]'),
          )
            .map((el) => (el.textContent ?? '').replace(/\s+/g, ' ').trim())
            .filter(Boolean);
          if (msgs.length > 0) return msgs;
          return Array.from(
            root.querySelectorAll<HTMLElement>('[data-builder-publish-preflight-item]'),
          )
            .map((el) => (el.textContent ?? '').replace(/\s+/g, ' ').trim())
            .filter(Boolean);
        })
        .catch(() => [] as string[]);
      const detail =
        blockerTexts.length > 0
          ? ` 남은 blocker: ${blockerTexts.join(' | ')}`
          : ' (모달에 blocker 항목이 노출되지 않음 — canSubmitPublish 게이트 원인이 UI에 표시되지 않을 수 있음)';
      findings.push({
        severity: 'blocker',
        summary: `예약 버튼이 비활성화됨 — canSubmitPublish=false. acknowledgement(translation 확인 / warning override) 후에도 해제되지 않음.${detail}`,
      });
      await page.keyboard.press('Escape').catch(() => undefined);
      await recordEvidence('schedule-button-disabled');
      if (createdBlank) await deletePageBySlug(page, slug).catch(() => undefined);
      return { findings };
    }

    log('예약 시각 입력 (now + 2h)');
    const dtInput = page.locator('[data-modal-shell="true"] input[type="datetime-local"]').first();
    const dtVisible = await dtInput.isVisible().catch(() => false);
    if (!dtVisible) {
      findings.push({
        severity: 'blocker',
        summary: '예약 발행 시각 입력(datetime-local)을 찾지 못함',
      });
      await page.keyboard.press('Escape').catch(() => undefined);
      await recordEvidence('schedule-input-missing');
      if (createdBlank) await deletePageBySlug(page, slug).catch(() => undefined);
      return { findings };
    }
    const future = await futureLocalDateTime(page, 2);
    await dtInput.click({ force: true });
    await dtInput.fill(future);
    await page.waitForTimeout(200);
    await recordEvidence('schedule-time-entered');

    log('예약 버튼 클릭');
    const scheduleBtn = page.locator('[data-builder-publish-schedule-action="schedule"]').first();
    await scheduleBtn.click({ force: true });

    log('예약 작업 노출 대기');
    const scheduled = await page
      .locator(SCHEDULE_STATUS_SEL)
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
    log(`예약 작업 노출: ${scheduled}`);
    await recordEvidence('schedule-status-check');
    if (!scheduled) {
      findings.push({
        severity: 'blocker',
        summary: '예약 버튼 클릭 후 [data-builder-publish-schedule-status="scheduled"] 가 노출되지 않음 — 예약 저장 실패(scheduleSaveError) 가능',
      });
      findings.push({
        severity: 'visual',
        summary: '주의: 예약이 부분적으로 저장됐을 수 있음 — 발행 모달 재확인 및 수동 취소 권장',
      });
      await page.keyboard.press('Escape').catch(() => undefined);
      if (createdBlank) await deletePageBySlug(page, slug).catch(() => undefined);
      return { findings };
    }

    log('예약 취소');
    const cancelBtn = page.locator('[data-builder-publish-schedule-action="cancel"]').first();
    const cancelVisible = await cancelBtn.isVisible().catch(() => false);
    if (!cancelVisible) {
      findings.push({
        severity: 'blocker',
        summary: '예약 취소 버튼(action="cancel")이 노출되지 않음 — 수동 취소 필요',
      });
      await page.keyboard.press('Escape').catch(() => undefined);
      await recordEvidence('schedule-cancel-button-missing');
      if (createdBlank) await deletePageBySlug(page, slug).catch(() => undefined);
      return { findings };
    }
    await cancelBtn.click({ force: true });
    const cancelled = await page
      .locator(SCHEDULE_STATUS_SEL)
      .first()
      .waitFor({ state: 'hidden', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
    log(`예약 취소 완료: ${cancelled}`);
    if (!cancelled) {
      findings.push({
        severity: 'visual',
        summary: '예약 취소 버튼 클릭 후 scheduled 상태가 사라지지 않음 — 취소 미반영 가능, 수동 확인 필요',
      });
    }
    await recordEvidence('schedule-cancelled');

    log('발행하지 않고 모달 닫기 (Escape)');
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(500);
    await recordEvidence('publish-modal-closed-no-publish');

    log('cleanup: 생성한 빈 페이지 삭제');
    if (createdBlank) {
      const deleted = await deletePageBySlug(page, slug).catch(() => false);
      if (!deleted) {
        findings.push({
          severity: 'visual',
          summary: `cleanup 실패(harness concern) — 생성한 빈 페이지(/${slug}) 삭제 진입점을 찾지 못했거나 동작하지 않음`,
        });
      }
    }
    await recordEvidence('cleanup-done');

    return { findings };
  },
};
