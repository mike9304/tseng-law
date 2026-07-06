import type { APIResponse, Locator, Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  canvasEditor,
  dismissOverlays,
  SHORTCUT_MODIFIER,
} from '../helpers';

const SETTINGS_TITLE_LABELS = ['사이트 설정', 'Site settings', '網站設定'];
const PRESETS_TAB_LABELS = ['프리셋', 'Presets', '預設'];
const CONTENT_TAB_LABELS = ['콘텐츠', 'Content', '內容'];

type FixtureIds = {
  readonly card: string;
  readonly button: string;
  readonly form: string;
  readonly field: string;
  readonly submit: string;
};

type ComponentPresetValues = {
  readonly button: string | null;
  readonly card: string | null;
  readonly field: string | null;
  readonly submit: string | null;
};

type DraftNode = {
  readonly id: string;
  readonly kind: string;
  readonly content: Record<string, unknown>;
};

type DraftDocument = {
  readonly nodes: readonly DraftNode[];
};

const BASELINE_VALUES: ComponentPresetValues = {
  button: 'primary-solid',
  card: 'flat',
  field: 'default',
  submit: 'primary',
};

const EDITORIAL_VALUES: ComponentPresetValues = {
  button: 'primary-link',
  card: 'editorial',
  field: 'underline',
  submit: 'outline',
};

const VALUE_KEYS: readonly (keyof ComponentPresetValues)[] = [
  'button',
  'card',
  'field',
  'submit',
];

const BASE_NODE_STYLE = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
} as const;

const BUTTON_NODE_ID_CANDIDATES = [
  'component-button',
  'home-hero-search-button',
  'home-contact-primary',
  'home-contact-phone',
  'home-case-results-cta',
  'home-hero-columns-link',
];

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

function inspectorPanel(page: Page) {
  return page.locator('[data-builder-inspector-panel="true"]');
}

function componentPresetCard(page: Page, key: string) {
  return modalShell(page).locator(`[data-component-design-preset="${key}"]`);
}

function fixtureIds(token: string): FixtureIds {
  return {
    card: `component-card-${token}`,
    button: `component-button-${token}`,
    form: `component-form-${token}`,
    field: `component-field-${token}`,
    submit: `component-submit-${token}`,
  };
}

function scopedHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'w179-component';
  return { 'x-forwarded-for': `qa-${safeScope}` };
}

function makeComponentPresetDocument(token: string) {
  const ids = fixtureIds(token);
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: 'qa-w179-component-preset',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: ids.card,
        kind: 'container',
        rect: { x: 96, y: 96, width: 420, height: 220 },
        style: BASE_NODE_STYLE,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        name: 'Component preset card',
        content: {
          label: 'Component preset card',
          variant: 'flat',
          layoutMode: 'absolute',
          background: '#ffffff',
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 12,
          padding: 24,
          as: 'article',
        },
      },
      {
        id: ids.button,
        kind: 'button',
        name: 'Component preset button',
        rect: { x: 128, y: 148, width: 180, height: 48 },
        style: BASE_NODE_STYLE,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: '상담 예약',
          href: '/ko/contact',
          style: 'primary-solid',
        },
      },
      {
        id: ids.form,
        kind: 'form',
        name: 'Component preset form',
        rect: { x: 600, y: 96, width: 430, height: 260 },
        style: BASE_NODE_STYLE,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          name: `component-preset-form-${token}`,
          submitTo: 'storage',
          successMessage: '감사합니다.',
          method: 'POST',
          layoutMode: 'absolute',
          captcha: 'none',
        },
      },
      {
        id: ids.field,
        kind: 'form-input',
        name: 'Component preset field',
        parentId: ids.form,
        rect: { x: 24, y: 28, width: 320, height: 78 },
        style: BASE_NODE_STYLE,
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          name: 'email',
          label: 'Email',
          placeholder: 'client@example.com',
          type: 'email',
          required: true,
          variant: 'default',
        },
      },
      {
        id: ids.submit,
        kind: 'form-submit',
        name: 'Component preset submit',
        parentId: ids.form,
        rect: { x: 24, y: 128, width: 180, height: 48 },
        style: BASE_NODE_STYLE,
        zIndex: 4,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Send',
          style: 'primary',
          fullWidth: false,
          loadingLabel: 'Sending...',
        },
      },
    ],
  };
}

async function readJson(response: APIResponse): Promise<unknown> {
  return response.json().catch(() => null);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function createFixturePage(
  page: Page,
  token: string,
): Promise<{ readonly pageId: string | null; readonly status: number }> {
  const slug = `qa-w179-component-${token}`;
  const response = await page.request.post('/api/builder/site/pages', {
    headers: scopedHeaders(slug),
    data: {
      locale: 'ko',
      slug,
      title: `QA W179 ${token}`,
      document: makeComponentPresetDocument(token),
    },
  });
  const payload = await readJson(response);
  const pageId = isRecord(payload) && typeof payload.pageId === 'string' ? payload.pageId : null;
  return { pageId, status: response.status() };
}

async function deleteFixturePage(page: Page, pageId: string, token: string): Promise<void> {
  const slug = `qa-w179-component-${token}`;
  await page.request
    .delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
      headers: scopedHeaders(slug),
    })
    .catch(() => undefined);
}

async function gotoFixtureBuilder(page: Page, baseUrl: string, pageId: string, token: string) {
  const url = new URL('/ko/admin-builder', baseUrl);
  url.searchParams.set('pageId', pageId);
  url.searchParams.set('w179', token);
  await page.goto(url.toString(), { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const canvas = canvasEditor(page);
  const canvasVisible = await canvas
    .waitFor({ state: 'visible', timeout: 30_000 })
    .then(() => true)
    .catch(() => false);
  if (!canvasVisible) return false;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const hydrated = await canvas
      .getAttribute('data-builder-hydrated')
      .then((value) => value === 'true')
      .catch(() => false);
    if (hydrated) return true;
    await page.waitForTimeout(250);
  }
  return false;
}

function parseDraftDocument(value: unknown): DraftDocument | null {
  if (!isRecord(value) || !Array.isArray(value.nodes)) return null;
  const nodes: DraftNode[] = [];
  for (const candidate of value.nodes) {
    if (!isRecord(candidate)) continue;
    const { id, kind, content } = candidate;
    if (typeof id !== 'string' || typeof kind !== 'string' || !isRecord(content)) continue;
    nodes.push({ id, kind, content });
  }
  return { nodes };
}

async function fetchDraftDocument(
  page: Page,
  pageId: string,
  token: string,
): Promise<DraftDocument | null> {
  const slug = `qa-w179-component-${token}`;
  const response = await page.request.get(
    `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`,
    { headers: scopedHeaders(slug) },
  );
  if (response.status() !== 200) return null;
  const payload = await readJson(response);
  if (!isRecord(payload)) return null;
  return parseDraftDocument(payload.document);
}

function readDraftValues(document: DraftDocument, ids: FixtureIds): ComponentPresetValues {
  const readValue = (nodeId: string, key: string) => {
    const node = document.nodes.find((candidate) => candidate.id === nodeId);
    const value = node?.content[key];
    return typeof value === 'string' ? value : null;
  };
  return {
    button: readValue(ids.button, 'style'),
    card: readValue(ids.card, 'variant'),
    field: readValue(ids.field, 'variant'),
    submit: readValue(ids.submit, 'style'),
  };
}

function valuesMatch(actual: ComponentPresetValues | null, expected: ComponentPresetValues) {
  if (actual === null) return false;
  return VALUE_KEYS.every((key) => actual[key] === expected[key]);
}

function formatValues(values: ComponentPresetValues | null) {
  if (values === null) return '(draft 없음)';
  return VALUE_KEYS.map((key) => `${key}=${values[key] ?? 'null'}`).join(', ');
}

async function waitForDraftValues(
  page: Page,
  pageId: string,
  token: string,
  ids: FixtureIds,
  expected: ComponentPresetValues,
  attempts = 14,
  intervalMs = 500,
): Promise<ComponentPresetValues | null> {
  let lastValues: ComponentPresetValues | null = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const document = await fetchDraftDocument(page, pageId, token);
    if (document !== null) {
      lastValues = readDraftValues(document, ids);
      if (valuesMatch(lastValues, expected)) return lastValues;
    }
    await page.waitForTimeout(intervalMs);
  }
  return lastValues;
}

async function findVisibleButtonNode(page: Page, preferredId?: string): Promise<Locator | null> {
  const canvas = canvasEditor(page);
  if (preferredId) {
    const preferred = canvas.locator(`[data-node-id="${preferredId}"]:visible`).first();
    if ((await preferred.count().catch(() => 0)) > 0) {
      return preferred;
    }
  }
  for (const id of BUTTON_NODE_ID_CANDIDATES) {
    const node = canvas.locator(`[data-node-id="${id}"]:visible`).first();
    if ((await node.count().catch(() => 0)) > 0) {
      return node;
    }
  }
  // fallback: kind 추론 불가하므로 button/cta/btn 아이디 패턴.
  const patterns = ['cta', 'btn', 'button'];
  for (const pat of patterns) {
    const node = canvas.locator(`[data-node-id*="${pat}"]:visible`).first();
    if ((await node.count().catch(() => 0)) > 0) {
      return node;
    }
  }
  return null;
}

// ButtonInspector.tsx variant <select> 의 option value 들(component-variants.ts BUTTON_VARIANT_KEYS).
// 이 값들을 option 으로 갖는 <select> 가 유일하게 content.style(variant) 셀렉트다.
// LinkPicker target select(_self/_blank)나 htmlTag select 와 혼동을 피하기 위해 option 값으로 식별.
const BUTTON_VARIANT_OPTION_KEYS = [
  'primary-solid',
  'primary-outline',
  'primary-ghost',
  'primary-link',
  'secondary-solid',
  'secondary-outline',
  'cta-shadow',
  'cta-arrow',
] as const;

// 버튼 노드 선택 → inspector content 탭 → 버튼 variant <select> 값(content.style) 읽기.
// 적용 가능한 버튼이 없거나 inspector 접근이 안 되면 null.
async function readButtonVariant(page: Page): Promise<string | null> {
  const panel = inspectorPanel(page);
  const buttonInspector = panel.locator('[data-builder-button-inspector="true"]');
  // content 탭이 아니면 버튼 inspector 가 안 보인다 — 탭 전환.
  if ((await buttonInspector.count().catch(() => 0)) === 0) {
    const contentTab = panel
      .locator('button')
      .filter({ hasText: new RegExp(`^(${CONTENT_TAB_LABELS.join('|')})$`) })
      .first();
    if ((await contentTab.count().catch(() => 0)) > 0) {
      await contentTab.click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(150);
    }
  }
  const visible = await buttonInspector
    .first()
    .waitFor({ state: 'visible', timeout: 5_000 })
    .then(() => true)
    .catch(() => false);
  if (!visible) return null;
  // variant <select> 식별: option value 집합이 BUTTON_VARIANT_OPTION_KEYS 를 포함하는 select.
  // ButtonInspector.tsx 의 variant select(스타일/樣式/Variant)만이 이 key 들을 option value 로 갖는다.
  // .first()/선행 select 를 믿으면 LinkPicker target select 가 _self 를 반환하는 버그 재발.
  const selects = buttonInspector.first().locator('select');
  const selectCount = await selects.count().catch(() => 0);
  for (let i = 0; i < selectCount; i += 1) {
    const sel = selects.nth(i);
    const optionValues = await sel
      .locator('option')
      .evaluateAll((opts) => opts.map((o) => (o as HTMLOptionElement).value))
      .catch(() => [] as string[]);
    const isVariantSelect = BUTTON_VARIANT_OPTION_KEYS.some((key) => optionValues.includes(key));
    if (!isVariantSelect) continue;
    return sel.inputValue().catch(() => null);
  }
  return null;
}

// 프리셋 적용/undo 직후 store commit + inspector 재렌더 지연을 흡수하기 위해 기대값에 도달할 때까지 폴링.
async function readButtonVariantPolled(
  page: Page,
  expected: string | null,
  attempts = 6,
  intervalMs = 200,
): Promise<string | null> {
  let last: string | null = null;
  for (let i = 0; i < attempts; i += 1) {
    last = await readButtonVariant(page);
    if (expected !== null && last === expected) return last;
    await page.waitForTimeout(intervalMs);
  }
  return last;
}

async function ensureButtonSelected(page: Page, buttonNode: Locator): Promise<boolean> {
  const id = await buttonNode.getAttribute('data-node-id').catch(() => null);
  const canvas = canvasEditor(page);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const selected = id
      ? canvas.locator(`[data-node-id="${id}"][data-selected="true"]`)
      : null;
    if (selected && (await selected.count().catch(() => 0)) > 0) return true;
    await buttonNode.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(250);
  }
  return false;
}

export const W179_componentPreset: CheckpointDefinition = {
  id: 'W179',
  title: '컴포넌트 디자인 프리셋: 버튼/카드/폼 필드/제출 버튼 일괄 적용 → draft 저장 → undo 복원',
  verification:
    'fixture 페이지 생성 → 버튼 inspector baseline 확인 → 사이트 설정 Presets 탭에서 Editorial 컴포넌트 프리셋 적용 → button/card/form-field/submit 값이 draft 에 저장됨 → undo 로 baseline draft 복원 → fixture 페이지 삭제',
  async run({ page, baseUrl, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const ids = fixtureIds(token);
    let pageId: string | null = null;

    try {
      log('W179 fixture 페이지 생성');
      const fixture = await createFixturePage(page, token);
      pageId = fixture.pageId;
      if (fixture.status !== 200 || pageId === null) {
        findings.push({
          severity: 'blocker',
          summary: `W179 fixture 페이지 생성 실패(status=${fixture.status})`,
        });
        await recordEvidence('component-preset-page-create-failed');
        return { findings };
      }

      log(`admin-builder 진입(pageId=${pageId})`);
      const loaded = await gotoFixtureBuilder(page, baseUrl, pageId, token);
      if (!loaded) {
        findings.push({
          severity: 'blocker',
          summary: 'fixture 페이지의 builder canvas 가 hydrated 상태가 되지 않음',
        });
        await recordEvidence('component-preset-builder-not-ready');
        return { findings };
      }

      log('잔여 popover/drawer 정리');
      await dismissOverlays(page);

      log('fixture 버튼 노드 선택');
      const buttonNode = await findVisibleButtonNode(page, ids.button);
      if (!buttonNode) {
        findings.push({
          severity: 'blocker',
          summary: `fixture 버튼 노드("${ids.button}")가 캔버스에 보이지 않음`,
        });
        await recordEvidence('component-preset-no-button');
        return { findings };
      }
      const selected = await ensureButtonSelected(page, buttonNode);
      if (!selected) {
        findings.push({
          severity: 'blocker',
          summary: `fixture 버튼 노드("${ids.button}")를 선택하지 못함`,
        });
        await recordEvidence('component-preset-select-failed');
        return { findings };
      }

      const baselineVariant = await readButtonVariant(page);
      log(`baseline 버튼 variant(content.style): "${baselineVariant}"`);
      if (baselineVariant !== BASELINE_VALUES.button) {
        findings.push({
          severity: 'blocker',
          summary: `fixture 버튼 baseline variant 가 "${BASELINE_VALUES.button}"가 아님(현재="${baselineVariant}")`,
        });
        await recordEvidence('component-preset-baseline-invalid');
        return { findings };
      }
      const baselineDraft = await waitForDraftValues(page, pageId, token, ids, BASELINE_VALUES, 3, 300);
      if (!valuesMatch(baselineDraft, BASELINE_VALUES)) {
        findings.push({
          severity: 'blocker',
          summary: `fixture baseline draft 값이 예상과 다름(${formatValues(baselineDraft)})`,
        });
        await recordEvidence('component-preset-baseline-draft-invalid');
        return { findings };
      }
      await recordEvidence('component-preset-before');

      log('상단바 사이트 설정 Presets 탭 진입');
      const entryBtn = settingsEntryButton(page);
      const entryVisible = await entryBtn.isVisible().catch(() => false);
      if (!entryVisible) {
        findings.push({
          severity: 'blocker',
          summary: `상단바 사이트 설정 진입 버튼(title=${SETTINGS_TITLE_LABELS.join('/')})을 찾을 수 없음`,
        });
        await recordEvidence('component-preset-entry-missing');
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
        await recordEvidence('component-preset-modal-not-open');
        return { findings };
      }
      await tabButton(page, PRESETS_TAB_LABELS).click({ force: true });
      await page.waitForTimeout(250);
      await recordEvidence('component-preset-presets-tab');

      const editorialCard = componentPresetCard(page, 'editorial');
      if ((await editorialCard.count().catch(() => 0)) === 0) {
        findings.push({
          severity: 'blocker',
          summary: 'Editorial 컴포넌트 프리셋 카드(data-component-design-preset="editorial")를 찾지 못함',
        });
        await recordEvidence('component-preset-card-missing');
        return { findings };
      }
      log(`Editorial 프리셋 적용(기대 buttonVariant="${EDITORIAL_VALUES.button}")`);
      await editorialCard.locator('button').first().click({ force: true });
      await page.waitForTimeout(500);
      await recordEvidence('component-preset-applied');

      log('모달 닫기 후 inspector 와 draft 재측정');
      await page.keyboard.press('Escape').catch(() => undefined);
      await page.waitForTimeout(450);
      await dismissOverlays(page).catch(() => undefined);
      await ensureButtonSelected(page, buttonNode).catch(() => undefined);
      const appliedVariant = await readButtonVariantPolled(page, EDITORIAL_VALUES.button);
      if (appliedVariant !== EDITORIAL_VALUES.button) {
        findings.push({
          severity: 'blocker',
          summary: `Editorial 적용 후 버튼 inspector variant 가 "${EDITORIAL_VALUES.button}"가 아님(현재="${appliedVariant}")`,
        });
        await recordEvidence('component-preset-inspector-mismatch');
        return { findings };
      }

      const appliedDraft = await waitForDraftValues(page, pageId, token, ids, EDITORIAL_VALUES);
      if (!valuesMatch(appliedDraft, EDITORIAL_VALUES)) {
        findings.push({
          severity: 'blocker',
          summary: `Editorial 적용 후 draft 값이 예상과 다름(${formatValues(appliedDraft)})`,
        });
        await recordEvidence('component-preset-draft-mismatch');
        return { findings };
      }
      log(`Editorial draft 저장 확인: ${formatValues(appliedDraft)}`);
      await recordEvidence('component-preset-draft-persisted');

      log('undo 로 baseline 복원 확인');
      await page.keyboard.press(`${SHORTCUT_MODIFIER}+z`);
      await page.waitForTimeout(600);
      await ensureButtonSelected(page, buttonNode).catch(() => undefined);
      const restoredVariant = await readButtonVariantPolled(page, BASELINE_VALUES.button);
      if (restoredVariant !== BASELINE_VALUES.button) {
        findings.push({
          severity: 'blocker',
          summary: `undo 후 버튼 inspector variant 가 baseline("${BASELINE_VALUES.button}")으로 복원되지 않음(현재="${restoredVariant}")`,
        });
        await recordEvidence('component-preset-undo-inspector-mismatch');
        return { findings };
      }

      const restoredDraft = await waitForDraftValues(page, pageId, token, ids, BASELINE_VALUES);
      if (!valuesMatch(restoredDraft, BASELINE_VALUES)) {
        findings.push({
          severity: 'blocker',
          summary: `undo 후 draft 값이 baseline 으로 복원되지 않음(${formatValues(restoredDraft)})`,
        });
        await recordEvidence('component-preset-undo-draft-mismatch');
        return { findings };
      }
      log(`undo draft 복원 확인: ${formatValues(restoredDraft)}`);
      await recordEvidence('component-preset-undone');

      await dismissOverlays(page).catch(() => undefined);
      await recordEvidence('component-preset-final');
      return { findings };
    } finally {
      if (pageId !== null) {
        await deleteFixturePage(page, pageId, token);
      }
    }
  },
};
