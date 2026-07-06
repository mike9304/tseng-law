import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  canvasEditor,
  clickCenter,
  dismissOverlays,
  gotoBuilder,
  pickLeafNode,
  SHORTCUT_MODIFIER,
} from '../helpers';

export const W29_duplicate: CheckpointDefinition = {
  id: 'W29',
  title: '요소 복제 (Ctrl+D)',
  verification: '노드 선택 → Ctrl/Cmd+D → 노드 수 증가 → undo 로 원복',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('leaf 노드 선택');
    const leaf = await pickLeafNode(page);
    if (!leaf) {
      findings.push({
        severity: 'blocker',
        summary: '복제 대상 leaf 노드를 찾지 못함 (root container 외에 편집 가능 leaf 없음)',
      });
      return { findings };
    }
    await clickCenter(leaf.locator);
    await page.waitForTimeout(300);

    const nodes = canvasEditor(page).locator('[data-node-id]');

    const before = await nodes.count();
    log(`복제 전 노드 수: ${before}`);
    await recordEvidence('duplicate-before');

    log('Ctrl/Cmd+D 로 복제');
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+d`);
    await page.waitForTimeout(700);
    const after = await nodes.count();
    log(`복제 후 노드 수: ${after} (delta=${after - before})`);
    if (after <= before) {
      findings.push({
        severity: 'blocker',
        summary: `Ctrl/Cmd+D 후 노드 수가 증가하지 않음 (before=${before}, after=${after})`,
      });
    }
    await recordEvidence('duplicate-after');

    log('undo 로 원복');
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
    await page.waitForTimeout(600);
    const restored = await nodes.count();
    log(`undo 후 노드 수: ${restored}`);
    if (restored !== before) {
      findings.push({
        severity: 'visual',
        summary: `undo 후 노드 수가 원래로 돌아가지 않음 (before=${before}, restored=${restored})`,
      });
    }
    await recordEvidence('duplicate-after-undo');

    return { findings };
  },
};
