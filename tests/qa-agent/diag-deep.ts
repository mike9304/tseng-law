import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-deep-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const allConsole: Array<{ type: string; text: string }> = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      allConsole.push({ type: msg.type(), text: msg.text() });
    }
  });
  page.on('pageerror', e => allConsole.push({ type: 'pageerror', text: e.message }));

  const findings: Array<{ area: string; status: 'ok' | 'issue' | 'note'; detail: string }> = [];
  const record = (area: string, status: 'ok' | 'issue' | 'note', detail: string) => {
    findings.push({ area, status, detail });
    console.log(`[${status.toUpperCase()}] ${area}: ${detail}`);
  };

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // ===== 1) Inspector — select node and probe right panel =====
  console.log('\n=== Inspector ===');
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(500);
  const inspectorInfo = await page.evaluate(() => {
    const inspectorCandidates = Array.from(document.querySelectorAll('aside, [class*="inspector"], [class*="rightPanel"], [class*="propertiesPanel"]')) as HTMLElement[];
    const rightside = inspectorCandidates
      .filter(el => {
        const r = el.getBoundingClientRect();
        return r.x > 1000 && r.width > 200 && r.height > 200;
      })
      .map(el => ({
        tag: el.tagName,
        classes: el.className.toString().slice(0, 120),
        rect: el.getBoundingClientRect(),
        inputs: el.querySelectorAll('input, select, textarea, button').length,
        text: (el.textContent ?? '').slice(0, 200),
      }));
    return rightside.slice(0, 3);
  });
  if (inspectorInfo.length === 0) record('Inspector', 'issue', '우측 인스펙터 패널을 찾지 못함');
  else record('Inspector', 'ok', `인스펙터 패널 ${inspectorInfo.length}개 — inputs=${inspectorInfo[0].inputs}`);
  await page.screenshot({ path: join(OUT, '01-inspector.png') });

  // Try editing first input in inspector and observe DOM update
  const inspectorInputs = await page.evaluate(() => {
    const inspectors = Array.from(document.querySelectorAll('aside, [class*="inspector"], [class*="rightPanel"], [class*="propertiesPanel"]')) as HTMLElement[];
    const target = inspectors.find(el => {
      const r = el.getBoundingClientRect();
      return r.x > 1000 && r.width > 200;
    });
    if (!target) return null;
    const inputs = Array.from(target.querySelectorAll('input[type="text"], input[type="number"], textarea')) as HTMLInputElement[];
    return inputs.slice(0, 6).map(i => ({
      type: i.type ?? i.tagName,
      placeholder: i.placeholder,
      value: i.value,
      name: i.name,
      ariaLabel: i.getAttribute('aria-label'),
    }));
  });
  if (inspectorInputs && inspectorInputs.length > 0) {
    record('Inspector inputs', 'ok', `첫 6개 입력 노출: ${JSON.stringify(inspectorInputs.map(i => i.placeholder ?? i.ariaLabel ?? i.name).filter(Boolean).slice(0, 4))}`);
  } else {
    record('Inspector inputs', 'note', '인스펙터 내 텍스트/숫자 입력 0건 (현재 선택 노드의 인스펙터 종류에 따라 다름)');
  }

  // ===== 2) Site Settings modal =====
  console.log('\n=== Site Settings ===');
  // Find Settings button (top toolbar)
  const settingsBtn = page.locator('button:has-text("Settings"), button:has-text("설정"), [title*="Settings"], [aria-label*="Settings"]').first();
  const sCount = await settingsBtn.count();
  if (sCount > 0) {
    await settingsBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(OUT, '02-settings.png') });
    const modalInfo = await page.evaluate(() => {
      const modal = document.querySelector('[data-modal-shell="true"], [role="dialog"]');
      if (!modal) return null;
      const inputs = modal.querySelectorAll('input, textarea, select').length;
      const buttons = modal.querySelectorAll('button').length;
      const tabs = Array.from(modal.querySelectorAll('button')).filter(b => /general|typography|brand|advanced|콘텐츠|글꼴|색상/i.test(b.textContent ?? '')).length;
      return { inputs, buttons, tabs, rect: modal.getBoundingClientRect() };
    });
    if (modalInfo) record('Site Settings', 'ok', `모달 노출. inputs=${modalInfo.inputs}, buttons=${modalInfo.buttons}, tabs=${modalInfo.tabs}`);
    else record('Site Settings', 'issue', 'Settings 클릭 후 모달이 나타나지 않음');
    // close it (Escape)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  } else {
    record('Site Settings', 'note', 'Settings 버튼을 toolbar에서 못 찾음 (셀렉터 후보 부족)');
  }

  // ===== 3) Publish modal =====
  console.log('\n=== Publish ===');
  const publishBtn = page.locator('button:has-text("Publish"), button:has-text("발행"), button:has-text("게시")').first();
  if (await publishBtn.count() > 0) {
    await publishBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(OUT, '03-publish.png') });
    const publishModal = await page.evaluate(() => {
      const modal = document.querySelector('[data-modal-shell="true"], [role="dialog"]');
      if (!modal) return null;
      return {
        text: (modal.textContent ?? '').slice(0, 400),
        rect: modal.getBoundingClientRect(),
      };
    });
    if (publishModal) record('Publish modal', 'ok', `노출. 텍스트 일부: ${publishModal.text.slice(0, 80)}...`);
    else record('Publish modal', 'note', 'Publish 클릭 후 모달이 별도로 안 뜸 (즉시 게시 또는 inline)');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  } else {
    record('Publish', 'note', 'Publish 버튼 못 찾음');
  }

  // ===== 4) Other pages via Pages drawer =====
  console.log('\n=== Pages — switch to about ===');
  // open pages drawer
  await page.locator('[class*="iconRail"] [title="Pages"]').click({ force: true });
  await page.waitForTimeout(600);
  // Click '호정 소개/about' button
  const aboutBtn = page.locator('button:has-text("호정 소개"), button:has-text("about")').first();
  if (await aboutBtn.count() > 0) {
    await aboutBtn.click({ force: true });
    await page.waitForTimeout(2000);
    const aboutPage = await page.evaluate(() => {
      const nodes = document.querySelectorAll('[data-node-id]').length;
      const url = window.location.href;
      return { nodes, url };
    });
    record('Pages switch (about)', aboutPage.nodes > 5 ? 'ok' : 'issue', `nodes=${aboutPage.nodes}, url=${aboutPage.url.slice(-80)}`);
    await page.screenshot({ path: join(OUT, '04-about.png') });
  } else {
    record('Pages switch (about)', 'note', 'about 버튼 못 찾음');
  }

  // close pages drawer
  await page.locator('[class*="iconRail"] [title="Pages"]').click({ force: true });
  await page.waitForTimeout(400);

  // ===== 5) History undo/redo =====
  console.log('\n=== History ===');
  // First make a change: select a node and move it via keyboard
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(400);
  const beforeMove = await page.locator('[data-node-id="home-hero-label"]').first().boundingBox().catch(() => null);
  // Press arrow key to nudge
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);
  const afterMove = await page.locator('[data-node-id="home-hero-label"]').first().boundingBox().catch(() => null);
  const moved = beforeMove && afterMove ? Math.round(afterMove.x - beforeMove.x) : 0;
  record('Arrow nudge', moved !== 0 ? 'ok' : 'issue', `dx=${moved}px (3× arrow-right)`);

  // Undo with Cmd+Z
  await page.keyboard.press('Meta+z');
  await page.waitForTimeout(400);
  await page.keyboard.press('Meta+z');
  await page.waitForTimeout(400);
  await page.keyboard.press('Meta+z');
  await page.waitForTimeout(400);
  const afterUndo = await page.locator('[data-node-id="home-hero-label"]').first().boundingBox().catch(() => null);
  const undone = beforeMove && afterUndo ? Math.round(afterUndo.x - beforeMove.x) : 0;
  record('Undo (Cmd+Z×3)', undone === 0 ? 'ok' : 'note', `dx after undo=${undone}px (expected 0)`);

  // Redo with Cmd+Shift+Z
  await page.keyboard.press('Meta+Shift+z');
  await page.waitForTimeout(300);
  await page.keyboard.press('Meta+Shift+z');
  await page.waitForTimeout(300);
  await page.keyboard.press('Meta+Shift+z');
  await page.waitForTimeout(500);
  const afterRedo = await page.locator('[data-node-id="home-hero-label"]').first().boundingBox().catch(() => null);
  const redone = beforeMove && afterRedo ? Math.round(afterRedo.x - beforeMove.x) : 0;
  record('Redo (Cmd+Shift+Z×3)', redone === moved ? 'ok' : 'note', `dx after redo=${redone}px (expected ${moved})`);

  // Restore: undo back
  for (let i = 0; i < 6; i++) { await page.keyboard.press('Meta+z'); await page.waitForTimeout(100); }

  // ===== 6) Design panel =====
  console.log('\n=== Design panel ===');
  await page.locator('[class*="iconRail"] [title="Design"]').click({ force: true });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(OUT, '06-design.png') });
  const designInfo = await page.evaluate(() => {
    const drawer = document.querySelector('[data-builder-drawer="design"], [aria-hidden="false"][class*="drawer"]');
    if (!drawer) return null;
    return {
      buttons: drawer.querySelectorAll('button').length,
      inputs: drawer.querySelectorAll('input').length,
      text: (drawer.textContent ?? '').slice(0, 200),
    };
  });
  if (designInfo) record('Design panel', 'ok', `buttons=${designInfo.buttons} inputs=${designInfo.inputs}`);
  else record('Design panel', 'issue', 'Design 패널 컨텐츠 못 찾음');

  // ===== 7) Layers panel =====
  console.log('\n=== Layers panel ===');
  await page.locator('[class*="iconRail"] [title="Design"]').click({ force: true });
  await page.waitForTimeout(300);
  await page.locator('[class*="iconRail"] [title="Layers"]').click({ force: true });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(OUT, '07-layers.png') });
  const layersInfo = await page.evaluate(() => {
    const drawer = document.querySelector('[data-builder-drawer="layers"], [aria-hidden="false"][class*="drawer"]');
    if (!drawer) return null;
    return {
      rows: drawer.querySelectorAll('[class*="layerRow"], [data-layer-row], button[role="treeitem"]').length,
      buttons: drawer.querySelectorAll('button').length,
    };
  });
  if (layersInfo) record('Layers panel', layersInfo.buttons > 5 ? 'ok' : 'note', `treeRows≈${layersInfo.rows}, buttons=${layersInfo.buttons}`);
  else record('Layers panel', 'issue', 'Layers 패널 컨텐츠 못 찾음');

  // ===== 8) Navigation drawer =====
  console.log('\n=== Navigation drawer ===');
  await page.locator('[class*="iconRail"] [title="Layers"]').click({ force: true });
  await page.waitForTimeout(300);
  await page.locator('[class*="iconRail"] [title="Navigation"]').click({ force: true });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(OUT, '08-navigation.png') });
  const navInfo = await page.evaluate(() => {
    const drawer = document.querySelector('[data-builder-drawer="navigation"], [aria-hidden="false"][class*="drawer"]');
    if (!drawer) return null;
    return {
      navRows: drawer.querySelectorAll('[data-builder-nav-item-row], [class*="navItem"]').length,
      buttons: drawer.querySelectorAll('button').length,
      inputs: drawer.querySelectorAll('input').length,
    };
  });
  if (navInfo) record('Navigation drawer', 'ok', `navRows=${navInfo.navRows}, buttons=${navInfo.buttons}`);

  // ===== 9) Toolbar buttons =====
  console.log('\n=== Toolbar ===');
  const toolbarInfo = await page.evaluate(() => {
    const tops = Array.from(document.querySelectorAll('header button, [class*="toolbar"] button, [class*="topBar"] button, [data-builder-top-toolbar] button')).slice(0, 30);
    return tops.map(b => ({ text: (b.textContent ?? '').trim().slice(0, 30), title: b.getAttribute('title') }));
  });
  console.log('Toolbar btns:', toolbarInfo.slice(0, 15));

  // ===== summarize errors/warnings =====
  console.log('\n=== Console summary ===');
  console.log('Errors/Warnings total:', allConsole.length);
  for (const e of allConsole.slice(0, 10)) console.log(`  [${e.type}] ${e.text.slice(0, 180)}`);

  writeFileSync(join(OUT, 'findings.json'), JSON.stringify({ findings, allConsole, toolbarInfo, inspectorInfo, inspectorInputs }, null, 2));
  console.log('\nDIAG_OUT=', OUT);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
