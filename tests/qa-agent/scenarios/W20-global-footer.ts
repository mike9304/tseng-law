import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { canvasEditor, gotoBuilder } from '../helpers';

async function canvasFingerprint(page: Page): Promise<string> {
  const nodes = canvasEditor(page).locator('[data-node-id]');
  const count = await nodes.count();
  const firstId = count > 0 ? (await nodes.first().getAttribute('data-node-id')) ?? '' : '';
  return `${count}|${firstId}`;
}

async function openPagesDrawer(page: Page): Promise<boolean> {
  const rail = page.locator(
    '[data-builder-rail-item="pages"], button[aria-label*="Pages"], button[aria-label*="페이지"]',
  ).first();
  if (!(await rail.isVisible().catch(() => false))) return false;
  await rail.click({ force: true });
  await page.waitForTimeout(500);
  const drawer = page.locator('[data-builder-drawer="pages"], [data-page-switcher="true"]').first();
  return drawer.isVisible().catch(() => false);
}

async function clickPageRow(page: Page, idx: number): Promise<void> {
  const drawer = page.locator('[data-builder-drawer="pages"], [data-page-switcher="true"]').first();
  const row = drawer.locator('[data-builder-page-row], [data-page-id]').nth(idx);
  const selectBtn = row
    .locator('button:not([data-builder-page-drag-handle]):not([data-page-menu-trigger])')
    .first();
  if (await selectBtn.isVisible().catch(() => false)) {
    await selectBtn.click({ force: true }).catch(() => undefined);
    return;
  }
  await row.click({ force: true }).catch(() => undefined);
}

async function switchToDifferentPage(
  page: Page,
): Promise<{ switched: boolean; pageCount: number; reason?: string }> {
  const beforeFp = await canvasFingerprint(page);
  if (!(await openPagesDrawer(page))) {
    return { switched: false, pageCount: 0, reason: 'Pages drawer가 열리지 않음' };
  }
  const drawer = page.locator('[data-builder-drawer="pages"], [data-page-switcher="true"]').first();
  const rowCount = await drawer.locator('[data-builder-page-row], [data-page-id]').count();
  if (rowCount < 2) {
    await page.keyboard.press('Escape').catch(() => undefined);
    return { switched: false, pageCount: rowCount, reason: `페이지가 ${rowCount}개뿐` };
  }
  for (const idx of [rowCount - 1, 0]) {
    await clickPageRow(page, idx);
    await page.waitForTimeout(1000);
    if ((await canvasFingerprint(page)) !== beforeFp) {
      return { switched: true, pageCount: rowCount };
    }
    await openPagesDrawer(page);
  }
  await page.keyboard.press('Escape').catch(() => undefined);
  return { switched: false, pageCount: rowCount, reason: '전환 후 캔버스 변화 없음' };
}

async function footerSignature(page: Page): Promise<string | null> {
  const footer = page.locator('footer.site-footer').first();
  if (!(await footer.isVisible().catch(() => false))) return null;
  const text = (await footer.innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 100);
  return text || null;
}

export const W20_globalFooter: CheckpointDefinition = {
  id: 'W20',
  title: 'Footer 가 모든 페이지 공유 (글로벌 요소)',
  verification: '페이지 전환 후에도 동일한 글로벌 푸터가 유지되는지 확인',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    const findings: CheckpointFinding[] = [];

    log('글로벌 푸터 시그니처 캡처 (페이지 A)');
    const sigA = await footerSignature(page);
    if (!sigA) {
      findings.push({ severity: 'blocker', summary: '글로벌 푸터(footer.site-footer)를 찾을 수 없음' });
      await recordEvidence('footer-missing-page-a');
      return { findings };
    }
    await recordEvidence('footer-page-a');

    log('다른 페이지로 전환');
    const result = await switchToDifferentPage(page);
    if (result.pageCount > 0 && result.pageCount < 2) {
      findings.push({
        severity: 'visual',
        summary: '페이지가 1개뿐이라 글로벌 푸터 비교 불가 (fixture 제약)',
      });
      return { findings };
    }
    if (!result.switched) {
      findings.push({ severity: 'blocker', summary: `다른 페이지로 전환 실패 — ${result.reason ?? ''}` });
      await recordEvidence('footer-switch-failed');
      return { findings };
    }

    log('전환 후 글로벌 푸터 시그니처 비교 (페이지 B)');
    const sigB = await footerSignature(page);
    if (!sigB) {
      findings.push({ severity: 'blocker', summary: '페이지 전환 후 글로벌 푸터가 사라짐 (글로벌 아님)' });
      await recordEvidence('footer-missing-page-b');
      return { findings };
    }
    if (sigA !== sigB) {
      findings.push({
        severity: 'blocker',
        summary: '페이지마다 푸터 내용이 다름 (글로벌 아님)',
      });
    }
    await recordEvidence('footer-page-b');

    return { findings };
  },
};
