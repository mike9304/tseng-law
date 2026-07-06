import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';

// W218 — Shift+G → 픽셀 그리드 표시 토글.
// toggleGrid 액션(Shift+G)이 editorPrefs.pixelGrid.enabled 를 반전시키고
// CanvasContainer 가 [data-builder-grid="true"] 오버레이를 조건부 렌더한다.
// 상단 스테이지 툴바의 '그리드' 버튼(data-builder-stage-toolbar)도 data-active/aria-pressed 로 상태를 반영한다.
export const W218_gridSnap: CheckpointDefinition = {
  id: 'W218',
  title: 'Shift+G 픽셀 그리드 토글',
  verification: 'Shift+G → 그리드 오버레이/토글 상태 반전 → 다시 Shift+G 로 원복',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    const gridOverlay = page.locator('[data-builder-grid="true"]');
    const gridButton = page
      .locator('[data-builder-stage-toolbar="true"] button')
      .filter({ hasText: /그리드|grid|Grid/i })
      .first();

    const gridInitiallyVisible = await gridOverlay.isVisible().catch(() => false);
    const buttonInitially = await gridButton.isVisible().catch(() => false);
    log(`초기 그리드 오버레이 visible=${gridInitiallyVisible}, 툴바 버튼 visible=${buttonInitially}`);
    await recordEvidence('grid-initial');

    log('Shift+G 로 그리드 토글 (1차)');
    await page.keyboard.press('Shift+G');
    await page.waitForTimeout(350);

    const gridAfterToggle = await gridOverlay.isVisible().catch(() => false);
    const pressedAfter = await gridButton.getAttribute('aria-pressed').catch(() => null);
    const activeAfter = await gridButton.getAttribute('data-active').catch(() => null);
    log(`1차 토글 후 오버레이 visible=${gridAfterToggle}, aria-pressed=${pressedAfter}, data-active=${activeAfter}`);
    await recordEvidence('grid-after-first-toggle');

    const toggledOn = gridAfterToggle !== gridInitiallyVisible;
    if (!toggledOn) {
      // 오버레이 외에 버튼 상태라도 반전되었는지 확인.
      const buttonToggled = pressedAfter !== null && pressedAfter !== String(gridInitiallyVisible);
      if (!buttonToggled) {
        findings.push({
          severity: 'blocker',
          summary:
            'Shift+G 후 그리드 오버레이([data-builder-grid]) 도 툴바 버튼 상태(aria-pressed) 도 반전되지 않음',
        });
        return { findings };
      }
      findings.push({
        severity: 'visual',
        summary: 'Shift+G 로 툴바 버튼 상태는 반전되나 그리드 오버레이 요소가 보이지 않음',
      });
    }

    log('Shift+G 로 그리드 토글 (2차, 원복)');
    await page.keyboard.press('Shift+G');
    await page.waitForTimeout(350);

    const gridRestored = await gridOverlay.isVisible().catch(() => false);
    const pressedRestored = await gridButton.getAttribute('aria-pressed').catch(() => null);
    log(`2차 토글 후 오버레이 visible=${gridRestored}, aria-pressed=${pressedRestored}`);
    await recordEvidence('grid-after-second-toggle');

    if (gridRestored !== gridInitiallyVisible) {
      findings.push({
        severity: 'visual',
        summary: 'Shift+G 두 번 눌렀을 때 그리드 상태가 초기 상태로 돌아가지 않음',
      });
    }

    // 그리드 크기(px) 입력이 존재하는지 확인 — 툴바 옆 number input.
    const gridSizeInput = page.locator(
      '[data-builder-stage-toolbar="true"] input[type="number"]',
    );
    const sizeInputVisible = await gridSizeInput.isVisible().catch(() => false);
    log(`그리드 크기 input visible=${sizeInputVisible}`);
    if (!sizeInputVisible) {
      findings.push({
        severity: 'minor',
        summary: '그리드 크기(px) 입력 필드가 스테이지 툴바에 보이지 않음',
      });
    }

    return { findings };
  },
};
