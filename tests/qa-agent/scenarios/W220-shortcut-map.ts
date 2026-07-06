import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';

// W220 — Help → 단축키 cheatsheet.
// 하단 상태바에 '단축키: ?' 힌트. '?'(Shift+/) 또는 Mod+/ 가 showHelp 액션 →
// builder:show-help 이벤트 → ShortcutsHelpModal(ModalShell, [data-modal-shell="true"]) 오픈.
// 모달은 '키보드 단축키' 제목 + 단축키 row(kbd) 목록을 렌더. Escape 로 닫힌다.
export const W220_shortcutMap: CheckpointDefinition = {
  id: 'W220',
  title: '단축키 cheatsheet (Help 모달)',
  verification: '하단 힌트 ?/Shift+/ → 단축키 모달 오픈 → 단축키 row 존재 → Escape 닫기',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    const statusBarHint = page.locator('text=/단축키\\s*[:：]\\s*\\?/i');
    const hintVisible = await statusBarHint.first().isVisible().catch(() => false);
    log(`하단 단축키 힌트 visible=${hintVisible}`);
    if (!hintVisible) {
      findings.push({
        severity: 'minor',
        summary: "하단 상태바에 '단축키: ?' 힌트가 보이지 않음",
      });
    }

    log("'?'(Shift+/) 로 단축키 모달 오픈");
    await page.keyboard.press('Shift+/');
    await page.waitForTimeout(500);

    const modal = page.locator('[data-modal-shell="true"]');
    const modalVisible = await modal.first().isVisible().catch(() => false);
    log(`모달 visible=${modalVisible}`);
    await recordEvidence('shortcut-modal-open');

    if (!modalVisible) {
      // Mod+/ 폴백 시도.
      log('Shift+/ 미동작 → Mod+/ 폴백');
      await page.keyboard.press('ControlOrMeta+/');
      await page.waitForTimeout(500);
    }
    const modalVisibleAfterFallback = await modal.first().isVisible().catch(() => false);
    if (!modalVisible && !modalVisibleAfterFallback) {
      findings.push({
        severity: 'blocker',
        summary:
          "'?' / Mod+/ 입력 후 단축키 cheatsheet 모달([data-modal-shell])이 열리지 않음",
      });
      return { findings };
    }

    // 모달 제목/단축키 row 확인.
    const titleEl = modal.locator('h2, [class*="title" i]').first();
    const titleText = await titleEl.textContent().catch(() => '');
    log(`모달 제목 텍스트: ${titleText?.trim()}`);

    const shortcutRows = modal.locator('kbd, [class*="shortcutKey" i]');
    const rowCount = await shortcutRows.count().catch(() => 0);
    log(`단축키 row(kbd) 수: ${rowCount}`);
    if (rowCount === 0) {
      findings.push({
        severity: 'blocker',
        summary: '단축키 모달에 단축키 항목(kbd/row)이 하나도 렌더되지 않음',
      });
    }
    await recordEvidence('shortcut-modal-rows');

    // 단축키 설명에 복사/붙여넣기 등 핵심 항목이 있는지 확인.
    const modalText = await modal.textContent().catch(() => '');
    const hasCopyPaste = /복사|붙여넣기|copy|paste/i.test(modalText ?? '');
    log(`모달 본문에 복사/붙여넣기 항목 포함=${hasCopyPaste}`);

    log('Escape 로 모달 닫기');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(350);
    const modalClosed = await modal.first().isVisible().catch(() => true);
    log(`Escape 후 모달 visible=${modalClosed}`);
    await recordEvidence('shortcut-modal-closed');
    if (modalClosed) {
      findings.push({
        severity: 'blocker',
        summary: 'Escape 입력 후 단축키 모달이 닫히지 않음',
      });
    }

    return { findings };
  },
};
