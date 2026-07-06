import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

const SETTINGS_TITLE_LABELS = ['사이트 설정', 'Site settings', '網站設定'];
const PRESETS_TAB_LABELS = ['프리셋', 'Presets', '預設'];

// 반경 프리셋 키 (theme.ts THEME_RADIUS_PRESETS): sharp / medium / soft.
const RADIUS_KEYS = ['soft', 'sharp', 'medium'] as const;
// 그림자 프리셋 키 (THEME_SHADOW_PRESETS): none / soft / medium / strong.
const SHADOW_KEYS = ['strong', 'none', 'medium', 'soft'] as const;

function settingsEntryButton(page: Page) {
  return page
    .locator(
      SETTINGS_TITLE_LABELS.map((label) => `button[title="${label}"]`).join(', '),
    )
    .first();
}

function modalShell(page: Page) {
  return page.locator('[data-site-settings-modal-shell="true"]');
}

function tabButton(page: Page, labels: string[]) {
  return modalShell(page)
    .locator('button')
    .filter({ hasText: new RegExp(labels.join('|')) })
    .first();
}

async function activeRadiusKey(page: Page): Promise<string | null> {
  for (const key of RADIUS_KEYS) {
    const active = await modalShell(page)
      .locator(`[data-theme-radius-preset="${key}"][data-active="true"]`)
      .count()
      .catch(() => 0);
    if (active > 0) return key;
  }
  return null;
}

async function activeShadowKey(page: Page): Promise<string | null> {
  for (const key of SHADOW_KEYS) {
    const active = await modalShell(page)
      .locator(`[data-theme-shadow-preset="${key}"][data-active="true"]`)
      .count()
      .catch(() => 0);
    if (active > 0) return key;
  }
  return null;
}

async function applyRadiusPreset(page: Page, key: string): Promise<boolean> {
  const card = modalShell(page).locator(`[data-theme-radius-preset="${key}"]`);
  if ((await card.count().catch(() => 0)) === 0) return false;
  await card.locator('button').first().click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(250);
  return true;
}

async function applyShadowPreset(page: Page, key: string): Promise<boolean> {
  const card = modalShell(page).locator(`[data-theme-shadow-preset="${key}"]`);
  if ((await card.count().catch(() => 0)) === 0) return false;
  await card.locator('button').first().click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(250);
  return true;
}

export const W183_cornerShadowPreset: CheckpointDefinition = {
  id: 'W183',
  title: '코너 반경/그림자 글로벌 프리셋: Soft/Medium/Sharp(및 shadow) 선택 → 적용(data-active) → 복원',
  verification:
    '사이트 설정 → Presets 탭 → 반경 프리셋(Sharp/Medium/Soft) 다른 것 선택 → data-active 전환 확인 → 그림자 프리셋도 동일 → 원래값 복원',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];

    log('상단바 사이트 설정 진입');
    const entryBtn = settingsEntryButton(page);
    const entryVisible = await entryBtn.isVisible().catch(() => false);
    if (!entryVisible) {
      findings.push({
        severity: 'blocker',
        summary: `상단바 사이트 설정 진입 버튼(title=${SETTINGS_TITLE_LABELS.join('/')})을 찾을 수 없음`,
      });
      await recordEvidence('corner-shadow-entry-missing');
      return { findings };
    }
    await entryBtn.click({ force: true });
    const shellVisible = await modalShell(page)
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (!shellVisible) {
      findings.push({
        severity: 'blocker',
        summary: '사이트 설정 모달(data-site-settings-modal-shell)이 열리지 않음',
      });
      await recordEvidence('corner-shadow-modal-not-open');
      return { findings };
    }
    await tabButton(page, PRESETS_TAB_LABELS).click({ force: true });
    await page.waitForTimeout(250);
    await recordEvidence('corner-shadow-presets-tab');

    // ---------- 반경(radius) 프리셋 ----------
    log('반경 프리셋: 현재 active 키 캡처');
    const originalRadius = await activeRadiusKey(page);
    log(`현재 반경 active: "${originalRadius ?? '(탐지 안됨, 기본 medium 가정)'}"`);
    const radiusTarget = RADIUS_KEYS.find((key) => key !== originalRadius) ?? 'sharp';
    log(`반경 프리셋을 "${radiusTarget}"(으)로 변경`);

    const radiusCards = await modalShell(page).locator('[data-theme-radius-preset]').count().catch(() => 0);
    if (radiusCards === 0) {
      findings.push({
        severity: 'blocker',
        summary: '반경 프리셋 카드(data-theme-radius-preset)가 하나도 렌더되지 않음',
      });
    } else {
      const applied = await applyRadiusPreset(page, radiusTarget);
      const newActive = await activeRadiusKey(page);
      log(`변경 후 반경 active: "${newActive}"`);
      await recordEvidence('corner-radius-applied');
      if (!applied || newActive !== radiusTarget) {
        findings.push({
          severity: 'blocker',
          summary: `반경 프리셋 "${radiusTarget}" 적용 후 data-active 가 전환되지 않음 (현재 active="${newActive}")`,
        });
      }
    }

    // ---------- 그림자(shadow) 프리셋 ----------
    log('그림자 프리셋: 현재 active 키 캡처');
    const originalShadow = await activeShadowKey(page);
    log(`현재 그림자 active: "${originalShadow ?? '(탐지 안됨, 기본 soft 가정)'}"`);
    const shadowTarget = SHADOW_KEYS.find((key) => key !== originalShadow) ?? 'strong';
    log(`그림자 프리셋을 "${shadowTarget}"(으)로 변경`);

    const shadowCards = await modalShell(page).locator('[data-theme-shadow-preset]').count().catch(() => 0);
    if (shadowCards === 0) {
      findings.push({
        severity: 'blocker',
        summary: '그림자 프리셋 카드(data-theme-shadow-preset)가 하나도 렌더되지 않음',
      });
    } else {
      const applied = await applyShadowPreset(page, shadowTarget);
      const newActive = await activeShadowKey(page);
      log(`변경 후 그림자 active: "${newActive}"`);
      await recordEvidence('corner-shadow-applied');
      if (!applied || newActive !== shadowTarget) {
        findings.push({
          severity: 'blocker',
          summary: `그림자 프리셋 "${shadowTarget}" 적용 후 data-active 가 전환되지 않음 (현재 active="${newActive}")`,
        });
      }
    }

    // ---------- 복원 ----------
    log('cleanup: 반경/그림자 프리셋 원래값 복원');
    if (originalRadius) {
      await applyRadiusPreset(page, originalRadius).catch(() => undefined);
      const restored = await activeRadiusKey(page);
      log(`반경 복원 후 active: "${restored}" (기대 "${originalRadius}")`);
      if (restored !== originalRadius) {
        findings.push({
          severity: 'minor',
          summary: `반경 프리셋이 원래값("${originalRadius}")으로 복원되지 않음 (현재="${restored}")`,
        });
      }
    }
    if (originalShadow) {
      await applyShadowPreset(page, originalShadow).catch(() => undefined);
      const restored = await activeShadowKey(page);
      log(`그림자 복원 후 active: "${restored}" (기대 "${originalShadow}")`);
      if (restored !== originalShadow) {
        findings.push({
          severity: 'minor',
          summary: `그림자 프리셋이 원래값("${originalShadow}")으로 복원되지 않음 (현재="${restored}")`,
        });
      }
    }
    await recordEvidence('corner-shadow-restored');

    // 모달 취소 — preset 변경은 로컬 theme state 만 바꿨으므로 취소 시 폐기됨.
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);

    return { findings };
  },
};
