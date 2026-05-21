import { expect } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder, selectFirstNode } from '../helpers';

export const W08_rotation: CheckpointDefinition = {
  id: 'W08',
  title: '회전 핸들로 rotation',
  verification: '노드 선택 → 상단 회전 핸들 → 각도 바뀜',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('첫 visible 노드 선택');
    const selected = await selectFirstNode(page);
    await expect(selected).toBeVisible({ timeout: 5_000 });
    await recordEvidence('before-rotate');

    const findings: CheckpointFinding[] = [];

    const rotationHandle = selected.locator('[class*="rotationHandle"]').first();
    if (!(await rotationHandle.isVisible().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: '회전 핸들이 보이지 않음' });
      return { findings };
    }

    const initialTransform = await selected.evaluate((el) => window.getComputedStyle(el).transform);
    const handleBox = await rotationHandle.boundingBox();
    const nodeBox = await selected.boundingBox();
    if (!handleBox || !nodeBox) {
      findings.push({ severity: 'blocker', summary: 'rotation handle/node box 측정 실패' });
      return { findings };
    }

    log('회전 핸들 시계방향 ~30° drag');
    const cx = nodeBox.x + nodeBox.width / 2;
    const cy = nodeBox.y + nodeBox.height / 2;
    const startX = handleBox.x + handleBox.width / 2;
    const startY = handleBox.y + handleBox.height / 2;
    const radius = Math.hypot(startX - cx, startY - cy);
    const startAngle = Math.atan2(startY - cy, startX - cx);
    const targetAngle = startAngle + (Math.PI / 180) * 30;
    const targetX = cx + Math.cos(targetAngle) * radius;
    const targetY = cy + Math.sin(targetAngle) * radius;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(targetX, targetY, { steps: 12 });
    await recordEvidence('mid-rotate');
    await page.mouse.up();
    await page.waitForTimeout(400);

    const afterTransform = await selected.evaluate((el) => window.getComputedStyle(el).transform);
    if (afterTransform === initialTransform) {
      findings.push({
        severity: 'blocker',
        summary: 'rotation drag 후 transform이 변하지 않음',
        detail: `before=${initialTransform}\nafter=${afterTransform}`,
      });
    }
    await recordEvidence('after-rotate');

    log('degree chip 확인');
    const chip = page.locator('[class*="rotationReadout"], [data-builder-rotation-chip], [class*="degreeChip"], [class*="rotationChip"]').first();
    const chipVisible = await chip.isVisible().catch(() => false);
    if (!chipVisible) {
      findings.push({
        severity: 'visual',
        summary: 'rotation 중 degree chip이 표시되지 않음 (Wix UX 차이)',
      });
    }

    log('undo로 원복');
    await page.keyboard.press(`${process.platform === 'darwin' ? 'Meta' : 'Control'}+Z`);
    await page.waitForTimeout(400);

    return { findings };
  },
};
