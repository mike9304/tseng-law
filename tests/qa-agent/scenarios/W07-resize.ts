import { expect } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { canvasEditor, gotoBuilder, selectFirstNode } from '../helpers';

export const W07_resize: CheckpointDefinition = {
  id: 'W07',
  title: '코너 핸들 드래그로 크기 조절 (Shift = 비율 유지)',
  verification: '노드 선택 → SE 코너 드래그 → 크기 바뀜',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('첫 visible 노드 선택');
    const selected = await selectFirstNode(page);
    await expect(selected).toBeVisible({ timeout: 5_000 });

    const findings: CheckpointFinding[] = [];

    const initialBox = await selected.boundingBox();
    if (!initialBox) {
      findings.push({ severity: 'blocker', summary: '선택된 노드 bounding box를 얻을 수 없음' });
      return { findings };
    }
    await recordEvidence('before-resize');

    log('SE resize handle 잡고 +40px,+40px drag');
    // aria-label은 "Resize {kind} node se" 형태 — SE 핸들만 끝이 " se"
    const seHandle = selected.locator('button[aria-label$=" se"], [data-resize-handle="se"]').first();
    let useHandle = seHandle;
    if (!(await seHandle.isVisible().catch(() => false))) {
      const handles = selected.locator('[class*="resizeHandle"]:visible');
      const count = await handles.count();
      if (count === 0) {
        findings.push({ severity: 'blocker', summary: 'resize handle이 보이지 않음' });
        return { findings };
      }
      // RESIZE_HANDLES = ['nw','n','ne','e','se','s','sw','w'] → SE는 index 4
      useHandle = handles.nth(Math.min(4, count - 1));
    }

    const handleBox = await useHandle.boundingBox();
    if (!handleBox) {
      findings.push({ severity: 'blocker', summary: 'SE handle box 측정 실패' });
      return { findings };
    }

    const startX = handleBox.x + handleBox.width / 2;
    const startY = handleBox.y + handleBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 40, startY + 40, { steps: 8 });
    await recordEvidence('mid-drag');
    await page.mouse.up();
    await page.waitForTimeout(400);

    const afterBox = await selected.boundingBox();
    if (!afterBox) {
      findings.push({ severity: 'blocker', summary: 'drag 후 노드 bounding box 사라짐' });
      return { findings };
    }
    const dw = afterBox.width - initialBox.width;
    const dh = afterBox.height - initialBox.height;
    log(`크기 변화: dw=${dw.toFixed(1)} dh=${dh.toFixed(1)}`);
    if (Math.abs(dw) < 5 && Math.abs(dh) < 5) {
      findings.push({
        severity: 'blocker',
        summary: `SE handle drag(+40,+40) 후에도 크기 변화 거의 없음 (dw=${dw.toFixed(1)}, dh=${dh.toFixed(1)})`,
      });
    }
    await recordEvidence('after-resize');

    log('Saving/Saved chip 확인');
    const savedChip = page.locator('[class*="savedChip"], [data-builder-save-status]').first();
    const savedVisible = await savedChip.isVisible().catch(() => false);
    if (!savedVisible) {
      findings.push({
        severity: 'minor',
        summary: 'resize 후 Saving/Saved 인디케이터가 보이지 않음 (자동저장 인식 어려움)',
      });
    }

    log('undo로 원복');
    await page.keyboard.press(`${process.platform === 'darwin' ? 'Meta' : 'Control'}+Z`);
    await page.waitForTimeout(400);
    await recordEvidence('after-undo');

    return { findings };
  },
};
