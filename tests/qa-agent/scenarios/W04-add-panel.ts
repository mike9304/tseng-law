import { expect } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';

export const W04_addPanel: CheckpointDefinition = {
  id: 'W04',
  title: '좌측 + Add 패널: 카테고리별 컴포넌트 리스트',
  verification: '+ 버튼 클릭 → 카테고리 탭 → 아이콘 그리드',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    const findings: CheckpointFinding[] = [];

    log('좌측 dark rail 진입');
    const addRailButton = page.locator(
      'button[aria-label*="Add"], button[aria-label*="추가"], [data-rail-item="add"], [data-builder-rail-item="add"]',
    ).first();

    const railVisible = await addRailButton.isVisible().catch(() => false);
    if (!railVisible) {
      findings.push({
        severity: 'blocker',
        summary: '좌측 + Add rail 버튼을 찾을 수 없음 (aria-label/data-rail-item 셀렉터 미스)',
      });
      await recordEvidence('rail-missing');
      return { findings };
    }
    await recordEvidence('rail-visible');

    log('+ 버튼 클릭');
    await addRailButton.click({ force: true });
    await page.waitForTimeout(400);

    const drawer = page.locator(
      '[data-builder-drawer="add"], [aria-label*="Add panel"], [class*="addPanel"], [class*="AddPanel"]',
    ).first();
    const drawerVisible = await drawer.isVisible().catch(() => false);
    if (!drawerVisible) {
      findings.push({
        severity: 'blocker',
        summary: '+ 클릭 후 Add drawer가 열리지 않음',
      });
      await recordEvidence('drawer-not-open');
      return { findings };
    }
    await recordEvidence('drawer-open');

    log('카테고리 탭 개수 확인');
    const categories = drawer.locator(
      '[role="tab"], [data-add-category], [class*="categoryTab"], [class*="CategoryTab"]',
    );
    const categoryCount = await categories.count();
    if (categoryCount < 3) {
      findings.push({
        severity: 'visual',
        summary: `Add panel 카테고리 탭이 너무 적음 (${categoryCount}개) — 최소 Text/Image/Layout 3개 이상 기대`,
      });
    }

    log('컴포넌트 아이콘 그리드 확인');
    const items = drawer.locator('[draggable="true"], [data-add-item], [class*="addItem"]');
    const itemCount = await items.count();
    if (itemCount === 0) {
      findings.push({
        severity: 'blocker',
        summary: 'Add panel 안에 드래그 가능한 컴포넌트 아이콘이 0개',
      });
    }
    await recordEvidence('items-grid');

    return { findings };
  },
};
