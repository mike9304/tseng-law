import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  canvasEditor,
  gotoBuilder,
  selectFirstNode,
  SHORTCUT_MODIFIER,
} from '../helpers';
import {
  canvasFingerprint,
  switchToDifferentPage,
  waitForStableCanvas,
} from './_builderPageNav';

export const W30_crossPagePaste: CheckpointDefinition = {
  id: 'W30',
  title: '페이지 간 요소 copy / paste',
  verification: '페이지 A 복사 → 페이지 B 전환(settle) → 붙여넣기 → 노드 증가 → undo',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    // Hard rule 1: 이전 시나리오가 남긴 popover/drawer 정리.
    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    log('페이지 A 첫 노드 선택 후 복사(Ctrl/Cmd+C)');
    await selectFirstNode(page);
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+c`);
    await page.waitForTimeout(300);
    await recordEvidence('paste-copied-page-a');

    log('다른 페이지로 전환 (lesson 1-2: candidate retry + stable-count settle)');
    const fpBefore = await canvasFingerprint(page);
    const result = await switchToDifferentPage(page);
    if (result.pageCount > 0 && result.pageCount < 2) {
      findings.push({
        severity: 'visual',
        summary: '페이지가 1개뿐이라 페이지 간 paste 검증 불가 (fixture 제약)',
      });
      await recordEvidence('paste-single-page');
      return { findings };
    }
    if (!result.switched) {
      findings.push({
        severity: 'blocker',
        summary: `다른 페이지로 전환 실패 — ${result.reason ?? ''}`,
      });
      await recordEvidence('paste-switch-failed');
      return { findings };
    }

    // lesson 1: 페이지 B draft 가 완전히 load 될 때까지 settle 대기.
    log('페이지 B 캔버스 안정 대기 (stable node count)');
    const settle = await waitForStableCanvas(page, { timeout: 8000 });
    log(
      `settle 결과: stable=${settle.stable} count=${settle.count} ` +
        `(A fingerprint=${fpBefore} / B fingerprint=${await canvasFingerprint(page)})`,
    );

    const nodes = canvasEditor(page).locator('[data-node-id]');
    const before = await nodes.count();
    log(`페이지 B 붙여넣기 전 노드 수: ${before}`);

    // paste 전 캔버스 노드를 force 클릭해 포커스/활성 문서 보장 (lesson 4).
    log('캔버스 노드 force 클릭으로 포커스 확보');
    const focusTarget = nodes.first();
    await focusTarget.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(300);

    log('Ctrl/Cmd+V 로 붙여넣기');
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+v`);
    await page.waitForTimeout(1200);
    const after = await nodes.count();
    log(`붙여넣기 후 노드 수: ${after} (delta=${after - before})`);
    if (after - before < 1) {
      findings.push({
        severity: 'blocker',
        summary: `페이지 간 붙여넣기 후 노드 수가 증가하지 않음 (before=${before}, after=${after}, delta=${after - before}) — 페이지 B 로드 미완료 또는 복사 미동작 가능`,
      });
    }
    await recordEvidence('paste-after');

    log('undo 로 원복');
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
    await page.waitForTimeout(700);
    await recordEvidence('paste-after-undo');

    return { findings };
  },
};
