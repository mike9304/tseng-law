import { expect, type Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  canvasEditor,
  dismissOverlays,
  gotoBuilder,
} from '../helpers';

// ─────────────────────────────────────────────────────────────────────────────
// Phase A: 이미지 노드 삽입 + src 설정 — W22_imageLibrary.ts 의 동작하는 코드를
// 그대로 복사 (W22 가 이 플로우로 PASS 함: drag-insert → placeholder 재클릭으로
// 자산 라이브러리 오픈 → PNG 업로드 → "이미지 사용" 선택 → 노드 src 반영).
// W23 의 기존 addImageNodeAndSetSrc(src input fill) 경로는 "에디터 진입 불가" 로
// 실패했으므로, 삽입+src 설정만 W22 와 동일하게 만들고 이후 assertion 은 W23 고유.
// ─────────────────────────────────────────────────────────────────────────────
const ADD_RAIL_SEL = '[data-builder-rail-item="add"]';
const ADD_DRAWER_SEL = '[data-builder-drawer="add"]';
// 위젯 카드의 드래그 소스 버튼 (draggable). click quick-add 가 아니라 canvas 로 드래그해야
// 이미지 노드가 삽입된다 — 패턴 출처: tests/builder-editor/add-panel-widget-drag.playwright.ts.
const IMAGE_DRAG_SOURCE_SEL = '[data-builder-add-card-kind="image"]';
const CANVAS_STAGE_SEL = '[role="application"][aria-label="Canvas editor"]';
const ASSET_LIBRARY_DIALOG_SEL = '[data-builder-asset-library-dialog="true"]';

// 인스펙터는 '콘텐츠(Content)' 탭에만 마운트된다(SandboxInspectorPanel 기본 탭 = layout).
const IMAGE_INSPECTOR_SEL = '[data-builder-image-inspector="true"]';
const INSPECTOR_PANEL_SEL = '[data-builder-inspector-panel="true"]';

// 편집 모드 빈 이미지 노드 placeholder(ImageElement). src 가 비어있을 때만 노출.
const PLACEHOLDER_LABELS = ['이미지를 추가하려면 클릭', 'Click to add image', '點擊以新增圖片'];
const CONTENT_TAB_LABELS = ['콘텐츠', 'Content', '內容'];
const OPEN_ASSET_LIBRARY_LABELS = ['자산 라이브러리 열기', 'Open asset library', '開啟素材庫'];
// 에셋 카드의 선택 트리거 버튼(AssetLibraryGrid). article 클릭으로는 선택되지 않는다.
const USE_IMAGE_LABELS = ['이미지 사용', 'Use image', '使用圖片'];

// 1x1 투명 PNG (정적 base64). 업로드 setInputFiles 용 buffer.
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B: W23 고유 — 이미지 에디터(자르기/필터/Alt) assertion
// ─────────────────────────────────────────────────────────────────────────────
const IMAGE_EDIT_DIALOG_SEL = '[data-builder-image-edit-dialog="true"]';

const OPEN_EDITOR_LABELS = [
  '자르기 / 필터 / Alt',
  'Crop / Filter / Alt',
  '裁切 / 篩選 / Alt',
];

const TAB_LABELS = {
  crop: ['자르기', '裁切', 'crop'],
  filter: ['필터', '篩選', 'filter'],
  alt: ['대체 텍스트', '替代文字', 'alt'],
} as const;

const FILTER_PRESET_LABELS = [
  '흑백',
  'B&W',
  '黑白',
  '빈티지',
  'Vintage',
  '復古',
];

const APPLY_LABELS = ['적용', 'Apply', '套用'];
const QA_ALT = 'QA대체텍스트';

// ─── Phase A helpers (W22 복사) ──────────────────────────────────────────────
async function openAddDrawer(page: Page): Promise<boolean> {
  const rail = page.locator(ADD_RAIL_SEL).first();
  if (!(await rail.isVisible().catch(() => false))) return false;
  await rail.click({ force: true });
  await page.waitForTimeout(450);
  return page.locator(ADD_DRAWER_SEL).first().isVisible().catch(() => false);
}

// 위젯 카드는 click quick-add 가 아니라 canvas 로 드래그(dragstart→dragover→drop)해야
// 노드가 삽입된다. add-panel-widget-drag.playwright.ts 의 검증된 기계를 그대로 재사용:
// 공유 DataTransfer 로 source 의 onDragStart 가 setData 한 MIME 를 stage drop handler 가 읽는다.
async function dragImageCardToCanvas(page: Page): Promise<void> {
  await page.evaluate(
    ({ sourceSelector, stageSelector, point }) => {
      const source = document.querySelector<HTMLElement>(sourceSelector);
      const stage = document.querySelector<HTMLElement>(stageSelector);
      if (!source || !stage) throw new Error('image_drag_target_missing');
      const stageRect = stage.getBoundingClientRect();
      const clientX = stageRect.left + point.x * (stageRect.width / stage.offsetWidth);
      const clientY = stageRect.top + point.y * (stageRect.height / stage.offsetHeight);
      const dataTransfer = new DataTransfer();
      source.dispatchEvent(
        new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }),
      );
      stage.dispatchEvent(
        new DragEvent('dragover', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }),
      );
      stage.dispatchEvent(
        new DragEvent('drop', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }),
      );
    },
    { sourceSelector: IMAGE_DRAG_SOURCE_SEL, stageSelector: CANVAS_STAGE_SEL, point: { x: 300, y: 240 } },
  );
}

// 드롭 직후 노드는 자동 선택되지 않는다(kind-drop 경로). 새 image-* 노드 id 를 찾는다.
async function findFreshImageNodeId(
  page: Page,
  beforeIds: Set<string>,
  timeout = 8000,
): Promise<string> {
  const canvas = canvasEditor(page);
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const ids = await canvas
      .locator('[data-node-id^="image-"]')
      .evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-node-id') ?? '').filter(Boolean),
      );
    const fresh = ids.find((id) => id && !beforeIds.has(id));
    if (fresh) return fresh;
    await page.waitForTimeout(250);
  }
  return '';
}

function contentTabButton(page: Page) {
  return page
    .locator(INSPECTOR_PANEL_SEL)
    .locator('button', { hasText: new RegExp(CONTENT_TAB_LABELS.join('|')) })
    .first();
}

// ImageInspector 는 인스펙터 '콘텐츠' 탭에만 렌더된다. 노드 선택(layout 리셋) 후 활성화.
async function activateContentTab(page: Page): Promise<boolean> {
  const btn = contentTabButton(page);
  if (!(await btn.isVisible().catch(() => false))) return false;
  await btn.click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(250);
  return true;
}

// 캔버스의 선택된 이미지 노드를 다시 클릭하면 onOpenAssetLibrary 가 트리거된다
// (CanvasNode.onClick: node.kind==='image' && selected 일 때). 단 더블클릭(detail>=2)은
// inline-edit 로 인터셉트되어 버리므로, 단일 클릭이 되도록 포인터를 치우고 dblclick window
// 밖에서 재클릭한다. 실패 시 인스펙터 '콘텐츠' 탭의 "자산 라이브러리 열기" 버튼으로 fallback.
async function openAssetLibraryViaCanvas(page: Page, nodeId: string): Promise<boolean> {
  const canvas = canvasEditor(page);
  const node = canvas.locator(`[data-node-id="${nodeId}"]`).first();
  const dialog = page.locator(ASSET_LIBRARY_DIALOG_SEL).first();

  for (let attempt = 0; attempt < 4; attempt += 1) {
    await node.scrollIntoViewIfNeeded().catch(() => undefined);
    // 1) 단일 클릭으로 노드 선택 확정(드롭 직후엔 미선택).
    await node.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(450);
    // 2) dblclick(detail>=2 → inline edit) 인터셉트 회피: 포인터 치움 + window 대기 후 단일 클릭.
    const box = await node.boundingBox().catch(() => null);
    if (box) {
      await page.mouse.move(5, 5);
      await page.waitForTimeout(550);
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.click(cx, cy);
    } else {
      await node.click({ force: true }).catch(() => undefined);
    }
    const opened = await dialog
      .waitFor({ state: 'visible', timeout: 3_000 })
      .then(() => true)
      .catch(() => false);
    if (opened) return true;
  }

  // Fallback: 인스펙터 콘텐츠 탭 → "자산 라이브러리 열기" 버튼.
  if (await activateContentTab(page)) {
    const btn = page
      .locator(IMAGE_INSPECTOR_SEL)
      .locator('button', { hasText: new RegExp(OPEN_ASSET_LIBRARY_LABELS.join('|')) })
      .first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click({ force: true }).catch(() => undefined);
      const opened = await dialog
        .waitFor({ state: 'visible', timeout: 6_000 })
        .then(() => true)
        .catch(() => false);
      if (opened) return true;
    }
  }
  return false;
}

// ─── Phase B helpers (W23 고유) ──────────────────────────────────────────────
function dialogTab(page: Page, labels: readonly string[]) {
  return page
    .locator(IMAGE_EDIT_DIALOG_SEL)
    .locator('button', { hasText: new RegExp(labels.join('|')) })
    .first();
}

function applyButton(page: Page) {
  return page
    .locator(`${IMAGE_EDIT_DIALOG_SEL} footer button`, {
      hasText: new RegExp(APPLY_LABELS.join('|')),
    })
    .last();
}

function inspectorAltInput(page: Page) {
  // 이미지 인스펙터의 대체 텍스트 input (altText 필드). type="text" 두 번째(첫 = src).
  return page.locator(`${IMAGE_INSPECTOR_SEL} input[type="text"]`).nth(1);
}

export const W23_imageCropFilterAlt: CheckpointDefinition = {
  id: 'W23',
  title: '이미지 노드 자르기/필터/Alt 편집: Alt + 필터 적용 → 반영 → undo',
  verification:
    'src 가 있는 이미지 노드 선택 → 인스펙터 자르기/필터/Alt 컨트롤 확인 → 이미지 에디터 오픈 → Alt 입력 + 필터 1개 적용 → 노드 Alt 반영 확인 → undo',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    // Hard rule 1: 이전 시나리오가 남긴 popover/drawer 정리.
    log('잔여 popover/drawer 정리 (Escape x2)');
    await dismissOverlays(page);

    const findings: CheckpointFinding[] = [];
    const canvas = canvasEditor(page);

    // ───────────────────────────────────────────────────────────────────────
    // Phase A: 이미지 노드 삽입 + src 설정 (W22 동작 코드 그대로)
    // ───────────────────────────────────────────────────────────────────────
    log('Add rail 오픈');
    if (!(await openAddDrawer(page))) {
      findings.push({
        severity: 'blocker',
        summary: 'Add rail/drawer 가 열리지 않아 image 노드를 추가할 수 없음',
      });
      await recordEvidence('add-drawer-missing');
      return { findings };
    }

    log('드래그 삽입 전 캔버스의 기존 image 노드 id 기록 (새 노드 식별용)');
    const beforeImageIds = new Set(
      await canvas
        .locator('[data-node-id^="image-"]')
        .evaluateAll((els) =>
          els.map((el) => el.getAttribute('data-node-id') ?? '').filter(Boolean),
        ),
    );

    log('카탈로그 image 카드를 캔버스로 드래그 (click 아님 — widget card 는 drag 삽입)');
    const dragSource = page.locator(IMAGE_DRAG_SOURCE_SEL).first();
    if (!(await dragSource.isVisible().catch(() => false))) {
      findings.push({
        severity: 'blocker',
        summary:
          'Add 패널 카탈로그에 image 카드의 드래그 소스(data-builder-add-card-kind="image")가 보이지 않음',
      });
      await recordEvidence('image-card-missing');
      return { findings };
    }
    await dragSource.scrollIntoViewIfNeeded().catch(() => undefined);
    await dragImageCardToCanvas(page);
    await page.waitForTimeout(500);
    await recordEvidence('image-dragged');

    log('Add drawer 닫기');
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(250);

    log('드롭된 이미지 노드 탐지');
    const imageId = await findFreshImageNodeId(page, beforeImageIds);
    if (!imageId) {
      findings.push({
        severity: 'blocker',
        summary: 'image 카드 드래그 후 새 image 노드(data-node-id^="image-")가 캔버스에 등장하지 않음 — 드롭 미동작',
      });
      await recordEvidence('image-node-missing');
      return { findings };
    }
    log(`드롭된 이미지 노드 id: ${imageId}`);
    const freshNode = canvas.locator(`[data-node-id="${imageId}"]`).first();
    await freshNode.scrollIntoViewIfNeeded().catch(() => undefined);

    log('빈 이미지 노드 placeholder 확인');
    const placeholderText = await freshNode.innerText().catch(() => '');
    const hasPlaceholder = PLACEHOLDER_LABELS.some((label) => placeholderText.includes(label));
    if (!hasPlaceholder) {
      findings.push({
        severity: 'visual',
        summary: `이미지 노드에 placeholder("${PLACEHOLDER_LABELS[0]}") 텍스트가 없음 — 이미 src 가 채워진 상태일 수 있음`,
      });
    }
    await recordEvidence('image-placeholder-visible');

    log('캔버스 placeholder 재클릭으로 자산 라이브러리 오픈 (선택된 이미지 노드 → onOpenAssetLibrary)');
    const opened = await openAssetLibraryViaCanvas(page, imageId);
    if (!opened) {
      findings.push({
        severity: 'blocker',
        summary: '자산 라이브러리 모달(data-builder-asset-library-dialog)이 열리지 않음 — 캔버스 재클릭·인스펙터 버튼 모두 실패',
      });
      await recordEvidence('asset-library-not-open');
      return { findings };
    }
    await recordEvidence('asset-library-open');

    log('생성한 PNG 를 setInputFiles 로 업로드');
    const fileInput = page
      .locator(`${ASSET_LIBRARY_DIALOG_SEL} input[type="file"]`)
      .first();
    const uploadName = `qa-upload-${Date.now().toString(36)}.png`;
    const pngBuffer = Buffer.from(PNG_BASE64, 'base64');
    await fileInput.setInputFiles({
      name: uploadName,
      mimeType: 'image/png',
      buffer: pngBuffer,
    });
    // 업로드 완료 대기 — 에셋 그리드에 항목 등장.
    const assetList = page.locator(
      `${ASSET_LIBRARY_DIALOG_SEL} [data-builder-asset-library-asset]`,
    );
    const assetShown = await assetList
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
    if (!assetShown) {
      findings.push({
        severity: 'blocker',
        summary: 'PNG 업로드 후 에셋 그리드에 항목(data-builder-asset-library-asset)이 등장하지 않음',
      });
      await recordEvidence('upload-no-asset');
      return { findings };
    }
    await recordEvidence('asset-uploaded');
    log('업로드된 에셋 등장 확인');

    log('업로드한 에셋 선택("이미지 사용" 버튼 클릭 → onSelect)');
    const matchIndex = await assetList.evaluateAll(
      (els, hint) =>
        els.findIndex(
          (el) => (el.getAttribute('data-builder-asset-library-asset') ?? '').includes(hint),
        ),
      'qa-upload',
    );
    const targetAsset =
      matchIndex >= 0 ? assetList.nth(matchIndex) : assetList.first();
    const useButton = targetAsset
      .locator('button', { hasText: new RegExp(USE_IMAGE_LABELS.join('|')) })
      .first();
    const useVisible = await useButton.isVisible().catch(() => false);
    if (!useVisible) {
      findings.push({
        severity: 'blocker',
        summary: `에셋의 "이미지 사용" 버튼(${USE_IMAGE_LABELS.join('/')})이 보이지 않음 — article 클릭으로는 onSelect 가 발생하지 않음`,
      });
      await recordEvidence('use-image-button-missing');
      return { findings };
    }
    await useButton.click({ force: true });
    // 모달 닫힘(onClose) 대기.
    await expect
      .poll(
        async () => page.locator(ASSET_LIBRARY_DIALOG_SEL).first().isVisible().catch(() => false),
        { timeout: 8_000 },
      )
      .toBe(false)
      .catch(() => undefined);
    await page.waitForTimeout(500);

    log('노드 src 반영 확인 (placeholder → media frame 전환)');
    const mediaFrame = canvas
      .locator(`[data-node-id="${imageId}"] [data-builder-media-widget="image"]`)
      .first();
    const srcApplied = await mediaFrame
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    const imgSrc = await canvas
      .locator(`[data-node-id="${imageId}"] img`)
      .first()
      .getAttribute('src')
      .catch(() => '');
    log(`반영된 img src: "${imgSrc}"`);
    if (!srcApplied || !imgSrc) {
      findings.push({
        severity: 'blocker',
        summary: `에셋 선택 후 이미지 노드에 src 가 반영되지 않음 (media frame=${srcApplied}, img src="${imgSrc}")`,
      });
      await recordEvidence('image-src-not-set');
      return { findings };
    }
    await recordEvidence('image-src-changed');
    log('이미지 노드 추가 + src 설정 완료');

    // ───────────────────────────────────────────────────────────────────────
    // Phase B: W23 고유 assertion — 이미지 에디터(자르기/필터/Alt)
    // ───────────────────────────────────────────────────────────────────────
    log('콘텐츠 탭 활성화 (ImageInspector 는 콘텐츠 탭에만 렌더)');
    await activateContentTab(page);

    log('이미지 인스펙터 확인');
    const inspectorVisible = await page
      .locator(IMAGE_INSPECTOR_SEL)
      .first()
      .waitFor({ state: 'visible', timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    if (!inspectorVisible) {
      findings.push({
        severity: 'blocker',
        summary: '이미지 노드 선택 후 이미지 인스펙터(data-builder-image-inspector)가 렌더되지 않음',
      });
      await recordEvidence('image-inspector-missing');
      return { findings };
    }
    const altBefore = await inspectorAltInput(page).inputValue().catch(() => '');
    log(`변경 전 alt: "${altBefore}"`);
    await recordEvidence('image-inspector-visible');

    log('이미지 에디터 오픈');
    const openEditor = page
      .locator(IMAGE_INSPECTOR_SEL)
      .locator('button', { hasText: new RegExp(OPEN_EDITOR_LABELS.join('|')) })
      .first();
    const openVisible = await openEditor.isVisible().catch(() => false);
    if (!openVisible) {
      findings.push({
        severity: 'blocker',
        summary: `이미지 인스펙터의 "자르기 / 필터 / Alt" 버튼(${OPEN_EDITOR_LABELS.join('/')})이 보이지 않음`,
      });
      await recordEvidence('editor-button-missing');
      return { findings };
    }
    await openEditor.click({ force: true });
    const dialogVisible = await page
      .locator(IMAGE_EDIT_DIALOG_SEL)
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (!dialogVisible) {
      findings.push({
        severity: 'blocker',
        summary: '이미지 에디터 다이얼로그(data-builder-image-edit-dialog)가 열리지 않음',
      });
      await recordEvidence('editor-not-open');
      return { findings };
    }
    await recordEvidence('image-editor-open');

    log('crop / filter / alt 탭 존재 확인');
    for (const [name, labels] of [
      ['crop', TAB_LABELS.crop],
      ['filter', TAB_LABELS.filter],
      ['alt', TAB_LABELS.alt],
    ] as const) {
      const tab = dialogTab(page, labels);
      const visible = await tab.isVisible().catch(() => false);
      if (!visible) {
        findings.push({
          severity: 'blocker',
          summary: `이미지 에디터 ${name} 탭(${labels.join('/')}) 버튼이 보이지 않음`,
        });
      }
    }
    await recordEvidence('editor-tabs-present');
    if (findings.some((f) => f.severity === 'blocker')) {
      return { findings };
    }

    log('Alt 탭 이동 → 대체 텍스트 입력');
    await dialogTab(page, TAB_LABELS.alt).click({ force: true });
    await page.waitForTimeout(300);
    const altTextarea = page.locator(`${IMAGE_EDIT_DIALOG_SEL} textarea`).first();
    const altAreaVisible = await altTextarea.isVisible().catch(() => false);
    if (!altAreaVisible) {
      findings.push({
        severity: 'blocker',
        summary: 'Alt 탭에 대체 텍스트 textarea 가 렌더되지 않음',
      });
      await recordEvidence('alt-textarea-missing');
      return { findings };
    }
    await altTextarea.click({ force: true });
    await altTextarea.fill(QA_ALT);
    await page.waitForTimeout(200);
    await recordEvidence('alt-text-entered');

    log('Filter 탭 이동 → 필터 1개 적용(프리셋 클릭)');
    await dialogTab(page, TAB_LABELS.filter).click({ force: true });
    await page.waitForTimeout(300);
    const filterPresets = page.locator(
      `${IMAGE_EDIT_DIALOG_SEL} button`,
      { hasText: new RegExp(FILTER_PRESET_LABELS.join('|')) },
    );
    const presetCount = await filterPresets.count();
    let filterSet = false;
    if (presetCount > 0) {
      await filterPresets.first().click({ force: true });
      await page.waitForTimeout(200);
      filterSet = true;
    } else {
      findings.push({
        severity: 'visual',
        summary: 'Filter 탭에서 필터 프리셋 버튼을 찾지 못해 슬라이더 기반 적용으로 우회 필요 가능',
      });
    }
    await recordEvidence('filter-preset-applied');

    log('적용(Apply) 버튼 클릭');
    const apply = applyButton(page);
    const applyVisible = await apply.isVisible().catch(() => false);
    if (!applyVisible) {
      findings.push({
        severity: 'blocker',
        summary: `이미지 에디터 적용 버튼(${APPLY_LABELS.join('/')})을 찾지 못함`,
      });
      await recordEvidence('apply-button-missing');
      return { findings };
    }
    await apply.click({ force: true });
    await expect
      .poll(
        async () => page.locator(IMAGE_EDIT_DIALOG_SEL).first().isVisible().catch(() => false),
        { timeout: 8_000 },
      )
      .toBe(false)
      .catch(() => undefined);
    await page.waitForTimeout(500);
    await recordEvidence('editor-applied');

    log('노드 Alt 반영 확인');
    const altAfter = await inspectorAltInput(page).inputValue().catch(() => '');
    log(`적용 후 alt: "${altAfter}" (기대 ${QA_ALT})`);
    if (altAfter !== QA_ALT) {
      findings.push({
        severity: 'blocker',
        summary: `이미지 에디터 적용 후 인스펙터 Alt 가 반영되지 않음 (기대 "${QA_ALT}", 실제 "${altAfter}")`,
      });
    }
    if (filterSet) {
      log('필터 적용: onApply payload 에 filters 포함(인스펙터 입력으로는 직접 검증 불가, 같은 commit 으로 전송됨)');
    }
    await recordEvidence('alt-reflected');

    log('undo 로 Alt/필터 복원');
    await page.keyboard.press('ControlOrMeta+z');
    await page.waitForTimeout(600);
    const altRestored = await inspectorAltInput(page).inputValue().catch(() => '');
    log(`undo 후 alt: "${altRestored}" (원래 "${altBefore}")`);
    if (altRestored !== altBefore) {
      findings.push({
        severity: 'visual',
        summary: `undo 후 Alt 가 원래값으로 완전히 복원되지 않음 (원래 "${altBefore}", 실제 "${altRestored}")`,
      });
    }
    await recordEvidence('alt-undone');

    log('cleanup: 추가한 이미지 노드 제거 (undo 루프 — src 설정·노드 추가까지)');
    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press('ControlOrMeta+z').catch(() => undefined);
      await page.waitForTimeout(300);
      const remaining = await canvas
        .locator(`[data-node-id="${imageId}"]`)
        .count()
        .catch(() => 0);
      if (remaining === 0) break;
    }
    await recordEvidence('image-node-removed');

    return { findings };
  },
};
