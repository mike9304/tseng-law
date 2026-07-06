import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';

export const W18_navMenu: CheckpointDefinition = {
  id: 'W18',
  title: '네비게이션 메뉴 에디터 (페이지 링크, 순서, 중첩)',
  verification: 'Navigation rail → 메뉴 항목 리스트 + 추가/재정렬/중첩 진입점 노출 (표면만)',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    const findings: CheckpointFinding[] = [];

    log('좌측 Navigation rail 버튼 클릭');
    const navRail = page.locator(
      '[data-builder-rail-item="nav"], button[aria-label*="내비게이션"], button[aria-label*="Navigation"], button[aria-label*="導覽"]',
    ).first();
    if (!(await navRail.isVisible().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: '좌측 Navigation rail 버튼을 찾을 수 없음' });
      await recordEvidence('nav-rail-missing');
      return { findings };
    }
    await navRail.click({ force: true });
    await page.waitForTimeout(600);
    await recordEvidence('nav-rail-clicked');

    log('Navigation drawer 열림 확인');
    const drawer = page.locator('[data-builder-drawer="nav"]').first();
    if (!(await drawer.isVisible().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: 'Navigation drawer(data-builder-drawer="nav")가 열리지 않음' });
      await recordEvidence('nav-drawer-closed');
      return { findings };
    }

    log('NavigationEditor 렌더 확인');
    const editor = drawer.locator('[data-builder-navigation-editor="true"]').first();
    if (!(await editor.isVisible().catch(() => false))) {
      findings.push({ severity: 'blocker', summary: 'NavigationEditor가 drawer에 렌더되지 않음' });
      await recordEvidence('nav-editor-missing');
      return { findings };
    }
    await page.waitForTimeout(1000);

    const countAttr = await editor.getAttribute('data-builder-navigation-count');
    const itemCount = Number(countAttr ?? '0');
    const rowCount = await editor.locator('[data-builder-nav-item-row]').count();
    log(`메뉴 항목: count 속성=${itemCount}, row=${rowCount}`);
    if (itemCount < 1 && rowCount < 1) {
      findings.push({ severity: 'blocker', summary: '네비게이션 메뉴 항목이 0개 (빈 상태)' });
    }

    log('추가(Add) 진입점 확인');
    const addAffordance = editor.locator(
      'button:has-text("추가"), button:has-text("Add"), button:has-text("新增")',
    );
    if ((await addAffordance.count()) < 1) {
      findings.push({ severity: 'blocker', summary: '메뉴 추가(Add) 진입점이 NavigationEditor에 보이지 않음' });
    }

    log('재정렬(move up/down) 진입점 확인');
    const reorderAffordance = editor.locator(
      'button[aria-label*="위로"], button[aria-label*="아래로"], button[aria-label*="Move up"], button[aria-label*="Move down"], button[aria-label*="上移"], button[aria-label*="下移"]',
    );
    if ((await reorderAffordance.count()) < 1) {
      findings.push({ severity: 'blocker', summary: '메뉴 재정렬(move up/down) 진입점이 보이지 않음' });
    }

    log('중첩(add child) 진입점 확인');
    const nestedAffordance = editor.locator(
      'button[aria-label*="하위 메뉴 추가"], button[aria-label*="Add submenu"], button[aria-label*="新增子選單"]',
    );
    if ((await nestedAffordance.count()) < 1) {
      findings.push({
        severity: 'visual',
        summary: '중첩(하위 메뉴 추가) 진입점이 root 항목에서 보이지 않음',
      });
    }

    await recordEvidence('nav-editor-state');
    return { findings };
  },
};
