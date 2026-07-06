import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder, SHORTCUT_MODIFIER } from '../helpers';

// W224 — 줌 버튼 + 키보드 (25~200%).
// CanvasZoomDock([data-builder-zoom-dock]) 가 data-builder-zoom-action="out|in|100|fit" 버튼과
// data-builder-zoom-label 라벨(25~200% 슬라이더)을 렌더. 키보드 Mod+= / Mod+- / Mod+0(zoomReset) 도 지원.

function parseZoomPercent(text: string): number | null {
  const match = /(\d+(\.\d+)?)/.exec(text ?? '');
  return match ? Number(match[1]) : null;
}

export const W224_zoomControls: CheckpointDefinition = {
  id: 'W224',
  title: '줌 컨트롤 (버튼 + 키보드, 25~200%)',
  verification: '줌 dock 확인 → + 버튼으로 확대 → 라벨 증가 → 키보드 Mod+= 추가 확대 → fit 원복',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    const dock = page.locator('[data-builder-zoom-dock="true"]');
    const dockVisible = await dock.first().isVisible().catch(() => false);
    if (!dockVisible) {
      findings.push({
        severity: 'blocker',
        summary: '줌 dock([data-builder-zoom-dock])이 렌더되지 않음',
      });
      return { findings };
    }

    const zoomInBtn = dock.locator('[data-builder-zoom-action="in"]');
    const zoomOutBtn = dock.locator('[data-builder-zoom-action="out"]');
    const fitBtn = dock.locator('[data-builder-zoom-action="fit"]');
    const label = dock.locator('[data-builder-zoom-label="true"]');

    const inVisible = await zoomInBtn.first().isVisible().catch(() => false);
    const outVisible = await zoomOutBtn.first().isVisible().catch(() => false);
    log(`zoom-in 버튼=${inVisible}, zoom-out 버튼=${outVisible}`);
    if (!inVisible || !outVisible) {
      findings.push({
        severity: 'blocker',
        summary: '줌 +/- 버튼이 보이지 않음',
      });
      return { findings };
    }

    const labelBeforeText = await label.first().textContent().catch(() => '');
    const before = parseZoomPercent(labelBeforeText ?? '');
    log(`초기 줌 라벨: ${labelBeforeText?.trim()} (${before}%)`);
    await recordEvidence('zoom-initial');

    log('zoom-in 버튼 3회 클릭');
    for (let i = 0; i < 3; i += 1) {
      await zoomInBtn.first().click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(200);
    const labelAfterBtnText = await label.first().textContent().catch(() => '');
    const afterBtn = parseZoomPercent(labelAfterBtnText ?? '');
    log(`버튼 확대 후 줌 라벨: ${labelAfterBtnText?.trim()} (${afterBtn}%)`);
    await recordEvidence('zoom-after-button-in');

    if (before !== null && afterBtn !== null && afterBtn <= before) {
      findings.push({
        severity: 'blocker',
        summary: `zoom-in 버튼 후 줌이 증가하지 않음 (${before}% → ${afterBtn}%)`,
      });
    }

    log('키보드 Mod+= 2회 추가 확대');
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+=`);
    await page.waitForTimeout(150);
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+=`);
    await page.waitForTimeout(250);
    const labelAfterKbText = await label.first().textContent().catch(() => '');
    const afterKb = parseZoomPercent(labelAfterKbText ?? '');
    log(`키보드 확대 후 줌 라벨: ${labelAfterKbText?.trim()} (${afterKb}%)`);
    await recordEvidence('zoom-after-keyboard-in');

    if (afterBtn !== null && afterKb !== null && afterKb < afterBtn) {
      findings.push({
        severity: 'visual',
        summary: `키보드 Mod+= 후 줌이 증가하지 않거나 감소함 (${afterBtn}% → ${afterKb}%)`,
      });
    }

    log('fit 버튼(또는 Mod+0)으로 원복');
    const fitVisible = await fitBtn.first().isVisible().catch(() => false);
    if (fitVisible) {
      await fitBtn.first().click({ force: true }).catch(() => undefined);
    } else {
      await page.keyboard.press(`${SHORTCUT_MODIFIER}+0`);
    }
    await page.waitForTimeout(350);
    const labelResetText = await label.first().textContent().catch(() => '');
    const resetPct = parseZoomPercent(labelResetText ?? '');
    log(`fit 후 줌 라벨: ${labelResetText?.trim()} (${resetPct}%)`);
    await recordEvidence('zoom-reset');

    if (resetPct !== null && (resetPct < 25 || resetPct > 200)) {
      findings.push({
        severity: 'visual',
        summary: `fit 후 줌이 25~200% 범위를 벗어남 (${resetPct}%)`,
      });
    }

    return { findings };
  },
};
