import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  canvasEditor,
  clickCenter,
  dismissOverlays,
  gotoBuilder,
  pickLeafNode,
  SHORTCUT_MODIFIER,
} from '../helpers';

type RecordEvidence = (label: string) => Promise<unknown>;
type Log = (step: string) => void;

async function nodeIdExists(page: Page, id: string): Promise<boolean> {
  const hit = canvasEditor(page).locator(`[data-node-id="${id}"]`);
  return (await hit.count()) > 0;
}

// Delete / Backspace 공통: leaf 선택 → 키 입력 → 제거 확인 → undo 복원 확인.
async function runDeleteVariant(
  page: Page,
  recordEvidence: RecordEvidence,
  log: Log,
  key: 'Delete' | 'Backspace',
  excludeIds: string[] = [],
): Promise<{ findings: CheckpointFinding[]; usedId: string | null }> {
  const findings: CheckpointFinding[] = [];
  const leaf = await pickLeafNode(page, excludeIds);
  if (!leaf) {
    findings.push({
      severity: 'blocker',
      summary: `${key}: 삭제 대상 leaf 노드를 찾지 못함 (root container 외에 편집 가능 leaf 없음)`,
    });
    return { findings, usedId: null };
  }
  const targetId = leaf.id;
  log(`${key}: leaf 선택 (id=${targetId})`);

  // Hard rule 3: 키보드 단축키는 캔버스 포커스가 필요 — 노드 클릭으로 보장.
  await clickCenter(leaf.locator);
  await page.waitForTimeout(300);
  await recordEvidence(`${key.toLowerCase()}-selected`);

  const nodes = canvasEditor(page).locator('[data-node-id]');
  const before = await nodes.count();
  log(`${key} 키 입력 (before nodes=${before})`);
  await page.keyboard.press(key);
  await page.waitForTimeout(550);

  if (await nodeIdExists(page, targetId)) {
    findings.push({
      severity: 'blocker',
      summary: `${key} 키 후에도 leaf 노드가 캔버스에 남아있음 (id=${targetId})`,
    });
    await recordEvidence(`${key.toLowerCase()}-not-removed`);
  } else {
    log(`${key} 후 노드 제거 확인 (전체 ${before} → ${await nodes.count()})`);
  }
  await recordEvidence(`${key.toLowerCase()}-after`);

  log(`${key}: undo(Ctrl/Cmd+Z) 복원`);
  await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
  await page.waitForTimeout(600);
  if (!(await nodeIdExists(page, targetId))) {
    findings.push({
      severity: 'visual',
      summary: `${key} 후 undo 로 leaf 노드가 복원되지 않음 (id=${targetId})`,
    });
  }
  await recordEvidence(`${key.toLowerCase()}-after-undo`);
  return { findings, usedId: targetId };
}

export const W09_deleteKey: CheckpointDefinition = {
  id: 'W09',
  title: 'Delete 키로 노드 삭제 (및 Backspace)',
  verification: 'leaf 노드 선택 → Del → 사라짐 → undo 복원 (Backspace 2차 검증 포함)',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    // Hard rule 1: 이전 시나리오가 남긴 popover/drawer 정리.
    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    // 1차: Delete 키.
    const del = await runDeleteVariant(page, recordEvidence, log, 'Delete');
    findings.push(...del.findings);

    // 2차: Backspace 도 동일하게 삭제되는지 (가능하면 다른 leaf).
    log('Backspace 2차 검증');
    const exclude = del.usedId ? [del.usedId] : [];
    const bs = await runDeleteVariant(page, recordEvidence, log, 'Backspace', exclude);
    findings.push(...bs.findings);

    return { findings };
  },
};
