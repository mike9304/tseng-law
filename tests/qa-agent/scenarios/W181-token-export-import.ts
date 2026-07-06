import type { Page } from '@playwright/test';
import { promises as fs } from 'node:fs';
import * as nodePath from 'node:path';
import * as os from 'node:os';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { dismissOverlays, gotoBuilder } from '../helpers';

const SETTINGS_TITLE_LABELS = ['사이트 설정', 'Site settings', '網站設定'];
const PRESETS_TAB_LABELS = ['프리셋', 'Presets', '預設'];
const BRAND_TAB_LABELS = ['브랜드 키트', 'Brand kit', '品牌包'];
const EXPORT_LABELS = ['디자인 토큰 내보내기', 'Export design tokens', '匯出設計 token'];
const IMPORT_ERROR_LABELS = ['Design token JSON을 읽지 못했습니다', 'Unable to read design token JSON', '無法讀取設計 token'];

const DOWNLOAD_FILENAME = 'hojeong-design-tokens.json';
const IMPORT_INPUT_SEL = '[data-design-token-import-input]';
// importDesignTokens(SiteSettingsModal.tsx) 은 normalizeDesignTokenTheme 으로
// theme.colors 를 갱신하고 setBrandKit(createBrandKitFromTheme) 까지 수행한다.
// 따라서 수정된 색상을 Brand 탭 color input 으로 관측하면 "적용 효과" 를 단언할 수 있다.
const QA_PRIMARY_COLOR = '#01a2c8';

// createDesignTokenBundle(theme.ts) 결과 shape: { schemaVersion:1, exportedAt, siteName?, theme }.
type TokenBundle = {
  schemaVersion?: number;
  exportedAt?: string;
  siteName?: unknown;
  theme?:
    | { colors?: Record<string, unknown>; fonts?: unknown; radii?: unknown }
    | unknown;
};

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

function exportButton(page: Page) {
  return modalShell(page)
    .locator('button', { hasText: new RegExp(EXPORT_LABELS.join('|')) })
    .first();
}

export const W181_tokenExportImport: CheckpointDefinition = {
  id: 'W181',
  title: '디자인 토큰 내보내기/가져오기: JSON export → schema 검증 → 색상 수정본 import → Brand 팔레트에 반영(효과 단언)',
  verification:
    '사이트 설정 → Presets 탭 → "디자인 토큰 내보내기" → 다운로드 JSON 의 schemaVersion=1 + theme 구조 확인 → primary 색상을 수정한 JSON "가져오기" → Brand 탭 primary color input 이 수정값으로 반영됨(적용 효과) → 모달 취소로 폐기',
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
      await recordEvidence('token-entry-missing');
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
      await recordEvidence('token-modal-not-open');
      return { findings };
    }
    await tabButton(page, PRESETS_TAB_LABELS).click({ force: true });
    await page.waitForTimeout(250);
    await recordEvidence('token-presets-tab');

    // 1) Export: 다운로드 이벤트 캡처 → 파일 저장 → JSON shape 검증.
    log('디자인 토큰 내보내기(다운로드) 캡처');
    const expBtn = exportButton(page);
    const expVisible = await expBtn.isVisible().catch(() => false);
    if (!expVisible) {
      findings.push({
        severity: 'blocker',
        summary: `"디자인 토큰 내보내기" 버튼(${EXPORT_LABELS.join('/')})을 찾지 못함`,
      });
      await recordEvidence('token-export-button-missing');
      return { findings };
    }

    const tmpDir = await fs.mkdtemp(nodePath.join(os.tmpdir(), 'qa-w181-'));
    const exportedPath = nodePath.join(tmpDir, DOWNLOAD_FILENAME);
    let bundle: TokenBundle | null = null;
    let filename = '';
    try {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 15_000 }),
        expBtn.click({ force: true }),
      ]);
      filename = download.suggestedFilename();
      log(`다운로드 파일명: "${filename}"`);
      await download.saveAs(exportedPath);
      const raw = await fs.readFile(exportedPath, 'utf8');
      bundle = JSON.parse(raw) as TokenBundle;
      log(`exportedAt: ${bundle?.exportedAt ?? '(없음)'}, siteName: ${String(bundle?.siteName ?? '(없음)')}`);
    } catch (err) {
      findings.push({
        severity: 'blocker',
        summary: `디자인 토큰 내보내기 다운로드를 캡처하지 못함 — ${(err as Error).message}`,
      });
      await recordEvidence('token-export-failed');
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => undefined);
      return { findings };
    }
    await recordEvidence('token-exported');

    if (!filename.includes('design-tokens')) {
      findings.push({
        severity: 'minor',
        summary: `다운로드 파일명("${filename}")이 예상(hojeong-design-tokens.json)과 다름`,
      });
    }

    // JSON shape: schemaVersion=1, theme 객체(colors/fonts 포함).
    log('export JSON schema 검증');
    const theme = (bundle?.theme ?? undefined) as
      | { colors?: Record<string, unknown>; fonts?: unknown; radii?: unknown }
      | undefined;
    const schemaOk = bundle?.schemaVersion === 1;
    const themeOk =
      Boolean(theme) && typeof theme === 'object' && Boolean(theme?.colors) && Boolean(theme?.fonts);
    if (!schemaOk) {
      findings.push({
        severity: 'blocker',
        summary: `export JSON 의 schemaVersion 이 1 이 아님 (현재: ${bundle?.schemaVersion})`,
      });
    }
    if (!themeOk) {
      findings.push({
        severity: 'blocker',
        summary: 'export JSON 의 theme 구조(colors/fonts)가 올바르지 않음',
      });
    }
    await recordEvidence('token-schema-verified');

    // 2) 수정본 Import: primary 색상을 QA 색상으로 변경한 JSON 을 숨김 file input 에 주입.
    const originalPrimary =
      typeof theme?.colors?.primary === 'string' ? (theme.colors.primary as string) : '';
    log(`수정 전 theme.colors.primary: "${originalPrimary}" → "${QA_PRIMARY_COLOR}" 로 변경`);

    const modifiedBundle = JSON.parse(JSON.stringify(bundle)) as TokenBundle;
    const modifiedTheme = (modifiedBundle.theme ?? {}) as { colors?: Record<string, unknown> };
    if (!modifiedTheme.colors || typeof modifiedTheme.colors !== 'object') {
      modifiedTheme.colors = {};
    }
    modifiedTheme.colors.primary = QA_PRIMARY_COLOR;
    modifiedBundle.theme = modifiedTheme;
    const modifiedPath = nodePath.join(tmpDir, 'modified-design-tokens.json');
    await fs.writeFile(modifiedPath, JSON.stringify(modifiedBundle, null, 2), 'utf8');

    log('수정본 JSON 디자인 토큰 가져오기');
    const importInput = page.locator(IMPORT_INPUT_SEL).first();
    const inputExists = (await importInput.count().catch(() => 0)) > 0;
    if (!inputExists) {
      findings.push({
        severity: 'blocker',
        summary: `디자인 토큰 가져오기 file input(${IMPORT_INPUT_SEL})을 찾지 못함`,
      });
      await recordEvidence('token-import-input-missing');
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => undefined);
      return { findings };
    }
    try {
      await importInput.setInputFiles(modifiedPath);
    } catch (err) {
      findings.push({
        severity: 'blocker',
        summary: `file input 에 수정본 JSON 주입 실패 — ${(err as Error).message}`,
      });
      await recordEvidence('token-import-setinput-failed');
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => undefined);
      return { findings };
    }
    await page.waitForTimeout(500);

    // 3) 에러 알림 여부(tokenReadError) — 정상 JSON 인데 파싱 실패하면 blocker.
    const errorShown = await modalShell(page)
      .getByText(new RegExp(IMPORT_ERROR_LABELS.join('|')))
      .first()
      .isVisible()
      .catch(() => false);
    const footerTone = await modalShell(page)
      .locator('[data-tone="error"], [data-tone="success"]')
      .last()
      .getAttribute('data-tone')
      .catch(() => null);
    log(`에러 알림: ${errorShown}, footer tone: ${footerTone}`);
    if (errorShown || footerTone === 'error') {
      findings.push({
        severity: 'blocker',
        summary: '수정본 JSON 가져오기에서 에러(tokenReadError) 알림이 표시됨 — 정상 JSON 임에도 파싱 실패',
      });
    }

    // 4) 적용 효과 단언(토스트 대신 실제 효과): Brand 탭 primary color input 이 수정값으로 반영되었는지.
    log('Brand 탭 이동 → primary color input 으로 적용 효과 검증');
    await tabButton(page, BRAND_TAB_LABELS).click({ force: true });
    const brandReady = await modalShell(page)
      .locator('input[type="color"]')
      .first()
      .waitFor({ state: 'visible', timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    if (!brandReady) {
      findings.push({
        severity: 'minor',
        summary: 'Brand 탭의 color input 이 렌더되지 않아 가져오기 적용 효과를 관측하지 못함',
      });
    } else {
      const primaryInputValue = await modalShell(page)
        .locator('input[type="color"]')
        .first()
        .inputValue()
        .catch(() => '');
      log(`Brand primary color input 값: "${primaryInputValue}" (기대 "${QA_PRIMARY_COLOR}")`);
      const reflectsImport = primaryInputValue.toLowerCase() === QA_PRIMARY_COLOR.toLowerCase();
      if (!reflectsImport) {
        findings.push({
          severity: 'blocker',
          summary: `수정본 JSON 가져오기 후 Brand primary color input 이 수정값("${QA_PRIMARY_COLOR}")을 반영하지 않음 (현재="${primaryInputValue}") — importDesignTokens 가 theme/brandKit state 에 반영되지 않음`,
        });
      } else {
        log('적용 효과 확인: 가져온 색상이 Brand 팔레트에 반영됨');
      }
    }
    await recordEvidence('token-import-applied');

    // cleanup: 임시 파일 삭제 + 모달 취소(import 는 로컬 theme state 만 변경, 취소 시 폐기).
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => undefined);
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(200);
    await recordEvidence('token-cleaned-up');

    return { findings };
  },
};
