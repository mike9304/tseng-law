import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';

export const W14_pagesCrud: CheckpointDefinition = {
  id: 'W14',
  title: 'Pages 드로어 표면 체크 (리스트/+New/Rename·Delete 진입점)',
  verification: '좌측 페이지 스위처 열어서 표면 UI 확인 (CRUD 실제 부작용 없이 진입점만)',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    const findings: CheckpointFinding[] = [];

    log('Pages rail 열기');
    const pagesRail = page.locator(
      'button[aria-label*="Pages"], button[aria-label*="페이지"], [data-rail-item="pages"], [data-builder-rail-item="pages"]',
    ).first();
    if (!(await pagesRail.isVisible().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: '좌측 Pages rail 버튼을 찾을 수 없음' });
      await recordEvidence('rail-missing');
      return { findings };
    }
    await pagesRail.click({ force: true });
    await page.waitForTimeout(500);
    await recordEvidence('pages-drawer-open');

    const drawer = page.locator(
      '[data-builder-drawer="pages"], [aria-label*="Pages panel"], [class*="pagesPanel"], [class*="PagesPanel"]',
    ).first();
    const drawerVisible = await drawer.isVisible().catch(() => false);
    if (!drawerVisible) {
      findings.push({ severity: 'blocker', summary: 'Pages drawer가 열리지 않음' });
      return { findings };
    }

    log('페이지 목록 항목 개수 확인');
    const items = drawer.locator('[data-page-id], [class*="pageRow"], [class*="PageRow"], li[role="option"]');
    const itemCount = await items.count();
    if (itemCount === 0) {
      findings.push({
        severity: 'blocker',
        summary: 'Pages drawer에 페이지 row가 0개',
      });
    } else {
      log(`페이지 목록 ${itemCount}개 확인`);
    }

    log('+ New Page 버튼 존재 여부');
    const addBtn = drawer.locator(
      'button:has-text("새 페이지"), button:has-text("+ New"), button[aria-label*="새 페이지"], button[aria-label*="Add page"]',
    ).first();
    const addVisible = await addBtn.isVisible().catch(() => false);
    if (!addVisible) {
      findings.push({
        severity: 'blocker',
        summary: '+ New Page 버튼이 Pages drawer에 보이지 않음',
      });
    }

    log('Rename/Delete UI 진입 가능 여부 (메뉴 트리거 hover/click)');
    if (itemCount > 0) {
      const firstRow = items.first();
      await firstRow.hover({ force: true }).catch(() => undefined);
      await page.waitForTimeout(200);
      const moreBtn = firstRow.locator('button[aria-label*="More"], button[aria-label*="더보기"], [data-page-menu-trigger]').first();
      const moreVisible = await moreBtn.isVisible().catch(() => false);
      if (!moreVisible) {
        findings.push({
          severity: 'visual',
          summary: '페이지 row hover 시 Rename/Delete 메뉴 트리거 (more 버튼) 노출 안됨',
        });
      }
      await recordEvidence('page-row-hover');
    }

    return { findings };
  },
};
