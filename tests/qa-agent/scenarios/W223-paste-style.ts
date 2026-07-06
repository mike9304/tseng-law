import type { Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  clickCenter,
  gotoBuilder,
  pickLeafNode,
  selectFirstNode,
  SHORTCUT_MODIFIER,
} from '../helpers';

const STYLE_TAB_LABELS = ['스타일', '樣式', 'Style'];
const STYLE_TAB_TITLE = '배경, 테두리, 그림자, 투명도 설정';
const SOLID_MODE_LABELS = ['단색', '純色', 'Solid'];
const COLOR_HEX = '#ff5a5a';

async function bodyEl(nodeLocator: Locator): Promise<Locator> {
  return nodeLocator.locator('[data-builder-node-body="true"]').first();
}

async function readBodyBg(nodeLocator: Locator): Promise<string> {
  const body = await bodyEl(nodeLocator);
  return body
    .evaluate((el: Element) => window.getComputedStyle(el).backgroundColor)
    .catch(() => '');
}

async function readBodyCssText(nodeLocator: Locator): Promise<string> {
  const body = await bodyEl(nodeLocator);
  return body
    .evaluate((el: Element) => (el as HTMLElement).style.cssText)
    .catch(() => '');
}

async function setBackgroundOnSelected(page: Page, hex: string): Promise<boolean> {
  const styleTab = page
    .locator('button')
    .filter({ hasText: new RegExp(`^(${STYLE_TAB_LABELS.join('|')})$`) })
    .first();
  if (await styleTab.isVisible().catch(() => false)) {
    await styleTab.click({ force: true }).catch(() => undefined);
  } else {
    const byTitle = page.locator(`button[title="${STYLE_TAB_TITLE}"]`).first();
    if (!(await byTitle.isVisible().catch(() => false))) return false;
    await byTitle.click({ force: true }).catch(() => undefined);
  }
  await page.waitForTimeout(250);

  const solidModeButton = page
    .locator('button')
    .filter({ hasText: new RegExp(`^(${SOLID_MODE_LABELS.join('|')})$`) })
    .first();
  if (!(await solidModeButton.isVisible().catch(() => false))) return false;
  await solidModeButton.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(250);

  const trigger = page.locator('[data-color-picker-advanced] button').first();
  if (!(await trigger.isVisible().catch(() => false))) return false;
  await trigger.click({ force: true }).catch(() => undefined);
  const dialog = page.locator('[data-builder-color-picker-dialog="true"]').first();
  const opened = await dialog
    .waitFor({ state: 'visible', timeout: 3000 })
    .then(() => true)
    .catch(() => false);
  if (!opened) return false;

  const native = dialog.locator('input[type="color"]').first();
  if (!(await native.isVisible().catch(() => false))) return false;
  await native.fill(hex).catch(() => undefined);
  await page.waitForTimeout(200);

  await page.keyboard.press('Escape').catch(() => undefined);
  await page.waitForTimeout(200);
  return true;
}

export const W223_pasteStyle: CheckpointDefinition = {
  id: 'W223',
  title: '스타일 복사/붙여넣기 (copy style → paste style)',
  verification: 'A 배경색 지정(비어있지 않은 payload 보장) → 복사 → B 붙여넣기 → B body 배경 변화 → undo',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const findings: CheckpointFinding[] = [];

    log('노드 A 선택');
    const nodeA = await selectFirstNode(page);
    const idA = await nodeA.getAttribute('data-node-id').catch(() => null);
    const bgA0 = await readBodyBg(nodeA);
    log(`노드 A id=${idA}, body bg(before)=${bgA0}`);

    log(`A 배경색 지정("${COLOR_HEX}") — pasteStyle payload 비어있음 회피`);
    const setOk = await setBackgroundOnSelected(page, COLOR_HEX);
    if (!setOk) {
      findings.push({
        severity: 'visual',
        summary: 'StyleTab 배경색 지정 흐름을 완료하지 못함 — 비어있지 않은 payload 보장이 약해짐',
      });
    }
    await page.waitForTimeout(150);
    const bgA = await readBodyBg(nodeA);
    const cssTextA = await readBodyCssText(nodeA);
    log(`A body bg(after set)=${bgA}, cssText len=${cssTextA.length}`);

    const payloadGuaranteed = bgA !== '' && bgA !== 'rgba(0, 0, 0, 0)';
    if (!payloadGuaranteed) {
      findings.push({
        severity: 'blocker',
        summary:
          'source 노드(A) 의 body 배경이 투명한 채로 남아 copyStyle payload 가 비어있을 것으로 추정 — pasteStyle 검증 신뢰 불가',
      });
      await recordEvidence('paste-style-source-empty');
      return { findings };
    }

    log('스타일 복사 (Mod+Alt+C)');
    await nodeA.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(150);
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+Alt+c`);
    await page.waitForTimeout(250);
    await recordEvidence('paste-style-copied');

    log('노드 B 선택');
    const pickedB = await pickLeafNode(page, idA ? [idA] : [], { minWidth: 12, minHeight: 12 });
    if (!pickedB) {
      findings.push({
        severity: 'blocker',
        summary: '스타일을 붙여넣을 두 번째 노드를 찾지 못함',
      });
      return { findings };
    }
    const nodeB = pickedB.locator;
    const idB = pickedB.id;
    await clickCenter(nodeB);
    await page.waitForTimeout(300);

    const bgB0 = await readBodyBg(nodeB);
    const cssTextB0 = await readBodyCssText(nodeB);
    log(`노드 B id=${idB}, body bg(before)=${bgB0}, cssText len=${cssTextB0.length}`);

    log('스타일 붙여넣기 (Mod+Alt+V)');
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+Alt+v`);
    await page.waitForTimeout(450);
    await recordEvidence('paste-style-applied');

    const bgB1 = await readBodyBg(nodeB);
    const cssTextB1 = await readBodyCssText(nodeB);
    log(`B body bg(after)=${bgB1}, cssText len=${cssTextB1.length}`);

    const changed = bgB1 !== bgB0 || cssTextB1 !== cssTextB0;
    const converged = bgA.length > 0 && bgB1 === bgA;

    if (!changed) {
      findings.push({
        severity: 'blocker',
        summary:
          'Mod+Alt+V 후 노드 B 의 body 스타일(배경/cssText) 이 전혀 변하지 않음 — pasteStyle 이 적용되지 않음',
      });
    } else if (!converged) {
      findings.push({
        severity: 'visual',
        summary: '붙여넣기 후 B body 스타일은 변했으나 A 의 배경으로 완전 수렴하지 않음(부분 스타일만 복사될 수 있음)',
      });
    }

    log('undo 로 원복 (붙여넣기 + A 배경 지정)');
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`).catch(() => undefined);
    await page.waitForTimeout(300);
    await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`).catch(() => undefined);
    await page.waitForTimeout(300);
    await recordEvidence('paste-style-undone');

    return { findings };
  },
};
