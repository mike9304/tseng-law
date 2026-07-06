import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder, selectFirstNode } from '../helpers';

// PublishModalDiffPanel 은 발행 모달 내에서 "초안 대 발행본" diff/요약 섹션을 렌더한다.
// diffTitle: ko '초안 대 발행본', en 'Draft vs published', zh '草稿對已發佈版本'.
// 발행 기준이 없으면 상태는 'missing'(첫 발행) 이지만 diffTitle 헤더는 항상 렌더된다.
const DIFF_TITLE_LABELS = ['초안 대 발행본', 'Draft vs published', '草稿對已發佈版本', '草稿對已發佈'];

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

async function diffPanelVisible(page: Page): Promise<boolean> {
  return page
    .locator('[data-modal-shell="true"]')
    .getByText(new RegExp(DIFF_TITLE_LABELS.join('|')))
    .first()
    .isVisible()
    .catch(() => false);
}

export const W195_publishDiff: CheckpointDefinition = {
  id: 'W195',
  title: '발행 Diff: 초안 편집 → 발행 모달 → 초안 vs 발행본 diff/요약 렌더 → 발행 않고 닫기 → undo',
  verification:
    '노드 nudge 로 초안 변경 → 발행 모달 오픈 → diff/요약 섹션(초안 대 발행본/Draft vs published) 렌더 확인 → Escape 로 닫기(미발행) → Ctrl+Z 로 초안 원복',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('노드 선택 후 nudge (초안 변경 발생)');
    await selectFirstNode(page).catch(() => null);
    await page.waitForTimeout(300);
    const beforeBox = await page
      .locator('[data-node-id]:visible')
      .first()
      .boundingBox()
      .catch(() => null);
    for (let i = 0; i < 3; i += 1) {
      await page.keyboard.press('ArrowRight').catch(() => undefined);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(500);
    const afterBox = await page
      .locator('[data-node-id]:visible')
      .first()
      .boundingBox()
      .catch(() => null);
    const moved = !!beforeBox && !!afterBox && Math.abs(beforeBox.x - afterBox.x) > 0.5;
    log(`nudge 로 인한 x 이동: ${moved ? '있음' : '없음/불확정'}`);
    await recordEvidence('draft-nudged');

    log('발행 모달 오픈');
    const pubBtn = publishButton(page);
    const pubVisible = await pubBtn.isVisible().catch(() => false);
    if (!pubVisible || !(await pubBtn.isEnabled().catch(() => true))) {
      findings.push({
        severity: 'blocker',
        summary: '발행(Publish) 버튼을 찾을 수 없거나 비활성화됨 — diff 패널 검증 불가',
      });
      await recordEvidence('publish-button-missing');
      return { findings };
    }
    await pubBtn.click({ force: true });
    const modalOpen = await page
      .locator('[data-modal-shell="true"]')
      .first()
      .waitFor({ state: 'visible', timeout: 12_000 })
      .then(() => true)
      .catch(() => false);
    if (!modalOpen) {
      findings.push({ severity: 'blocker', summary: '발행 모달([data-modal-shell])이 열리지 않음' });
      await recordEvidence('publish-modal-not-open');
      return { findings };
    }

    log('diff 패널 렌더 대기 (diffTitle)');
    const diffReady = await diffPanelVisible(page);
    // diff 는 비동기 로드될 수 있어 추가 대기 후 재확인.
    if (!diffReady) {
      await page.waitForTimeout(2500);
    }
    const diffShown = diffReady || (await diffPanelVisible(page));
    log(`diff/요약 섹션 렌더: ${diffShown}`);
    await recordEvidence('publish-diff-panel');
    if (!diffShown) {
      findings.push({
        severity: 'blocker',
        summary: '발행 모달에 초안 vs 발행본 diff/요약 섹션(초안 대 발행본/Draft vs published)이 렌더되지 않음',
      });
    }

    log('발행하지 않고 모달 닫기 (Escape)');
    let closed = await page
      .locator('[data-modal-shell="true"]')
      .first()
      .isHidden()
      .catch(() => false);
    if (!closed) {
      await page.keyboard.press('Escape').catch(() => undefined);
      await page.waitForTimeout(500);
      closed = await page.locator('[data-modal-shell="true"]').first().isHidden().catch(() => false);
    }
    if (!closed) {
      // 취소/닫기 버튼 폴백.
      const cancelBtn = page
        .locator('[data-modal-shell="true"] button', { hasText: /^(취소|Cancel|取消|닫기|Close|關閉)$/ })
        .first();
      if (await cancelBtn.isVisible().catch(() => false)) {
        await cancelBtn.click({ force: true }).catch(() => undefined);
        await page.waitForTimeout(500);
      }
    }
    const stillOpen = await page.locator('[data-modal-shell="true"]').first().isVisible().catch(() => false);
    const publishedAnyway = await page.locator('text="발행 완료"').first().isVisible().catch(() => false);
    if (publishedAnyway) {
      findings.push({ severity: 'blocker', summary: '검증 중 실제로 발행이 실행됨 (발행 완료 메시지 노출)' });
    }
    if (stillOpen) {
      findings.push({ severity: 'visual', summary: 'Escape/취소로 발행 모달이 닫히지 않음' });
    }
    await recordEvidence('publish-modal-closed-no-publish');

    log('초안 변경 undo (Ctrl+Z x5)');
    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press('Control+z').catch(() => undefined);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(500);
    await recordEvidence('draft-undone');

    return { findings };
  },
};
