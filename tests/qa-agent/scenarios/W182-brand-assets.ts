import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

const SETTINGS_TITLE_LABELS = ['사이트 설정', 'Site settings', '網站設定'];
const BRAND_TAB_LABELS = ['브랜드 키트', 'Brand kit', '品牌包'];
// BrandKitPanel.tsx 의 컨트롤 텍스트(text-controls-copy.ts brandKit). 진입/렌더 확인용.
const BRAND_APPLY_LABELS = ['브랜드 키트 적용', 'Apply brand kit', '套用品牌套件'];
// 로고 변형 슬롯 라벨 — assetLabels(logoLight/logoDark/favicon/ogImage).
const LOGO_LABELS = {
  light: ['밝은 로고', 'Light logo', '淺色標誌'],
  dark: ['어두운 로고', 'Dark logo', '深色標誌'],
  favicon: ['파비콘', 'Favicon', '網站圖示'],
  og: ['OG 이미지', 'OG image', 'OG 圖片'],
};
// 컬러 팔레트 라벨 — colorLabels(primary/secondary/accent/background/text). 고정 5개.
const COLOR_LABELS = {
  primary: ['기본', 'Primary', '主要'],
  secondary: ['보조', 'Secondary', '次要'],
  accent: ['강조', 'Accent', '強調'],
  background: ['배경', 'Background', '背景'],
  text: ['텍스트', 'Text', '文字'],
};
const COLOR_ARIA = {
  primary: ['기본 색상', 'Primary color', '主要顏色'],
};
const ADD_COLOR_LABELS = ['색상 추가', '컬러 추가', 'Add color', '新增顏色'];
const REMOVE_COLOR_LABELS = ['색상 제거', '컬러 제거', 'Remove color', '移除顏色', '삭제', 'Delete'];
const QA_HEX = '#ff0000';

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

export const W182_brandAssets: CheckpointDefinition = {
  id: 'W182',
  title: '브랜드 키트: 로고 변형 + 컬러 팔레트 UI 렌더 확인; 팔레트 색상 추가/제거(honest blocker)',
  verification:
    '사이트 설정 → 브랜드 키트 탭(패널 렌더 대기) → 로고 4종(밝은/어두운/파비콘/OG) + 팔레트 5색 렌더 확인 → 팔레트 색상 추가/제거 시도(기능 부재 시 honest blocker) → 기존 색상 변경으로 팔레트 상호작용 검증 → 복원',
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
      await recordEvidence('brand-entry-missing');
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
      await recordEvidence('brand-modal-not-open');
      return { findings };
    }

    log('브랜드 키트 탭 이동');
    await tabButton(page, BRAND_TAB_LABELS).click({ force: true });
    await page.waitForTimeout(150);

    // 진입 신뢰화: BrandKitPanel 이 실제로 렌더될 때까지 대기.
    // 모달 fetchSettings 로딩 중에는 content area 가 loading 표시라 패널이 늦게 뜰 수 있어
    // color input(BrandKitPanel 전용) 이 visible 할 때까지 기다린다.
    const brandPanelReady = await modalShell(page)
      .locator('input[type="color"]')
      .first()
      .waitFor({ state: 'visible', timeout: 12_000 })
      .then(() => true)
      .catch(() => false);
    if (!brandPanelReady) {
      // fallback: 적용 버튼이라도 보이는지 확인.
      const applySeen = await modalShell(page)
        .getByRole('button', { name: new RegExp(BRAND_APPLY_LABELS.join('|')) })
        .first()
        .isVisible()
        .catch(() => false);
      if (!applySeen) {
        findings.push({
          severity: 'blocker',
          summary: `브랜드 키트 탭 진입 후 BrandKitPanel(input[type=color] / 적용 버튼 "${BRAND_APPLY_LABELS.join('/')}")이 렌더되지 않음 — 탭 전환 미작동 또는 로딩 지연`,
        });
        await recordEvidence('brand-panel-not-rendered');
        await page.keyboard.press('Escape').catch(() => undefined);
        return { findings };
      }
    }
    await recordEvidence('brand-tab-open');

    // 1) 로고 변형 슬롯 4종 라벨 렌더 확인.
    log('로고 변형 슬롯 라벨 확인');
    const missingLogos: string[] = [];
    for (const [key, labels] of Object.entries(LOGO_LABELS)) {
      const found = await modalShell(page)
        .getByText(new RegExp(labels.join('|')))
        .first()
        .isVisible()
        .catch(() => false);
      log(`로고 슬롯 ${key}(${labels.join('/')}): ${found}`);
      if (!found) missingLogos.push(`${key}(${labels.join('/')})`);
    }
    if (missingLogos.length > 0) {
      findings.push({
        severity: 'blocker',
        summary: `로고 변형 슬롯 라벨 누락: ${missingLogos.join(', ')}`,
      });
    }
    await recordEvidence('brand-logo-slots');

    // 2) 컬러 팔레트 5색 swatch + color input 렌더 확인.
    log('컬러 팔레트 swatch / input 확인');
    const swatchCount = await modalShell(page)
      .locator('[aria-label$="색상"], [aria-label$="color"], [aria-label$="顏色"]')
      .count()
      .catch(() => 0);
    const colorInputCount = await modalShell(page).locator('input[type="color"]').count().catch(() => 0);
    log(`팔레트 swatch 수: ${swatchCount}, color input 수: ${colorInputCount}`);
    if (swatchCount < 5 || colorInputCount < 5) {
      findings.push({
        severity: 'blocker',
        summary: `컬러 팔레트가 5색 미만 렌더됨 (swatch=${swatchCount}, color input=${colorInputCount}, 기대=5)`,
      });
    }
    // 색상 라벨 각각 노출 확인.
    const missingColors: string[] = [];
    for (const [key, labels] of Object.entries(COLOR_LABELS)) {
      const found = await modalShell(page)
        .getByText(new RegExp(`^(${labels.join('|')})$`))
        .first()
        .isVisible()
        .catch(() => false);
      if (!found) missingColors.push(`${key}(${labels.join('/')})`);
    }
    if (missingColors.length > 0) {
      findings.push({
        severity: 'minor',
        summary: `컬러 팔레트 라벨 일부 누락(텍스트 노출 방식 차이일 수 있음): ${missingColors.join(', ')}`,
      });
    }
    await recordEvidence('brand-palette-render');

    // 3) 팔레트 색상 "추가/제거" 시도 — UI 가 존재하는지 확인 (현재 구조는 고정 5색, 추가/제거 UI 없음).
    log('팔레트 색상 추가/제거 컨트롤 탐색 (honest blocker 예상)');
    let addControl: string | null = null;
    for (const label of ADD_COLOR_LABELS) {
      const visible = await modalShell(page)
        .getByRole('button', { name: label })
        .first()
        .isVisible()
        .catch(() => false);
      if (visible) {
        addControl = label;
        break;
      }
    }
    let removeControl: string | null = null;
    for (const label of REMOVE_COLOR_LABELS) {
      const visible = await modalShell(page)
        .getByRole('button', { name: label })
        .first()
        .isVisible()
        .catch(() => false);
      if (visible) {
        removeControl = label;
        break;
      }
    }
    log(`추가 컨트롤: ${addControl ?? '(없음)'}, 제거 컨트롤: ${removeControl ?? '(없음)'}`);
    if (!addControl && !removeControl) {
      findings.push({
        severity: 'blocker',
        summary:
          '브랜드 키트 팔레트 색상 "추가/제거" UI 가 존재하지 않음 — 현재 BrandKitPanel 은 고정 5색(primary/secondary/accent/background/text) 만 렌더하며 add/remove 컨트롤이 없음 (W182 요구사항 중 add→list→remove 불가)',
        detail:
          '대신 기존 색상 값 변경으로 팔레트 상호작용을 검증한다 (아래 단계). 팔레트 확장 기능이 구현되면 이 blocker 는 해소됨.',
      });
    }
    await recordEvidence('brand-add-remove-probe');

    // 4) 팔레트 상호작용 검증(대체): primary 색상 값을 QA_HEX 로 변경 → swatch 배경 반영 → 복원.
    log('primary 색상 값 변경으로 팔레트 상호작용 검증');
    const primaryColorInput = modalShell(page).locator('input[type="color"]').first();
    const primarySwatch = modalShell(page)
      .locator(
        `[aria-label="${COLOR_ARIA.primary[0]}"], [aria-label="${COLOR_ARIA.primary[1]}"], [aria-label="${COLOR_ARIA.primary[2]}"]`,
      )
      .first();
    const originalBg = await primarySwatch
      .evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor)
      .catch(() => '');
    log(`변경 전 primary swatch backgroundColor: "${originalBg}"`);

    let paletteInteractive = false;
    if ((await primaryColorInput.count().catch(() => 0)) > 0) {
      // color input 은 fill 보다 evaluate 로 값을 주입하고 input 이벤트를 쏘는 것이 안정적.
      await primaryColorInput
        .evaluate((el, hex) => {
          const input = el as HTMLInputElement;
          input.value = hex;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }, QA_HEX)
        .catch(() => undefined);
      await page.waitForTimeout(250);
      const changedBg = await primarySwatch
        .evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor)
        .catch(() => '');
      log(`변경 후 primary swatch backgroundColor: "${changedBg}"`);
      paletteInteractive = changedBg !== originalBg && changedBg !== '';
      if (!paletteInteractive) {
        findings.push({
          severity: 'minor',
          summary: 'primary 색상 변경 후 swatch 배경이 갱신되지 않음 (팔레트가 읽기 전용이거나 갱신 지연)',
        });
      }
      await recordEvidence('brand-color-changed');

      // 복원: 이전 값을 알기 어려우므로 모달 취소로 로컬 변경을 폐기한다(아래 cleanup).
    } else {
      findings.push({
        severity: 'minor',
        summary: 'primary color input(input[type=color])을 찾지 못해 팔레트 상호작용 검증을 건너뜀',
      });
    }

    // cleanup: 모달 취소 — brand kit 변경은 서버에 저장하지 않았으므로 폐기됨.
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);
    await recordEvidence('brand-cleaned-up');

    return { findings };
  },
};
