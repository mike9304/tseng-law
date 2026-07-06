import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';

export const W28_publishPreflight: CheckpointDefinition = {
  id: 'W28',
  title: 'Publish 전 체크 (빈 alt, 빈 링크 경고)',
  verification: '발행 버튼 → 실제 발행 전에 preflight/준비 점검 모달이 표시되는지 확인 (발행 안 함)',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    const findings: CheckpointFinding[] = [];

    log('상단 발행(Publish) 버튼 클릭');
    const publishBtn = page.locator(
      'button[title="사이트 발행"], button[title*="發布"], button[title*="Publish"], button[aria-label*="발행"]',
    ).first();
    if (!(await publishBtn.isVisible().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: '상단 발행(Publish) 버튼을 찾을 수 없음' });
      await recordEvidence('publish-button-missing');
      return { findings };
    }
    const enabled = await publishBtn.isEnabled().catch(() => true);
    if (!enabled) {
      findings.push({ severity: 'blocker', summary: '발행 버튼이 비활성화 상태라 preflight 모달을 열 수 없음' });
      await recordEvidence('publish-button-disabled');
      return { findings };
    }
    await publishBtn.click({ force: true });
    await page.waitForTimeout(800);

    log('발행(preflight) 모달 표시 확인');
    const modal = page.locator('[data-modal-shell="true"]').first();
    if (!(await modal.isVisible().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: '발행 버튼 클릭 후 preflight 모달이 열리지 않음' });
      await recordEvidence('publish-modal-not-open');
      return { findings };
    }
    await recordEvidence('publish-modal-open');

    log('preflight 체크리스트 영역 대기');
    const preflightItems = page.locator('[data-builder-publish-preflight-item]');
    const hasItems = await preflightItems
      .first()
      .waitFor({ state: 'visible', timeout: 12_000 })
      .then(() => true)
      .catch(() => false);
    const itemCount = hasItems ? await preflightItems.count() : 0;
    if (itemCount < 1) {
      findings.push({
        severity: 'blocker',
        summary: 'preflight/준비 점검 체크리스트(빈 alt·링크 경고 영역)가 모달에 표시되지 않음',
      });
    } else {
      log(`preflight 항목 ${itemCount}개 확인`);
    }
    await recordEvidence('publish-preflight-checklist');

    log('발행하지 않고 모달 닫기 (Escape)');
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(500);
    let stillOpen = await modal.isVisible().catch(() => false);
    if (stillOpen) {
      const cancelBtn = page.locator(
        '[data-modal-shell="true"] button:has-text("취소"), [data-modal-shell="true"] button:has-text("Cancel"), [data-modal-shell="true"] button:has-text("닫기"), [data-modal-shell="true"] button:has-text("Close")',
      ).first();
      if (await cancelBtn.isVisible().catch(() => false)) {
        await cancelBtn.click({ force: true }).catch(() => undefined);
        await page.waitForTimeout(500);
      }
    }
    stillOpen = await modal.isVisible().catch(() => false);

    const publishedAnyway = await page.locator('text="발행 완료"').first().isVisible().catch(() => false);
    if (publishedAnyway) {
      findings.push({ severity: 'blocker', summary: '검증 중 실제로 발행이 실행됨 (발행 완료 메시지 노출)' });
    }
    if (stillOpen) {
      findings.push({ severity: 'visual', summary: 'Escape/취소로 preflight 모달이 닫히지 않음' });
    }
    await recordEvidence('publish-modal-closed');

    return { findings };
  },
};
