import { expect, test, type Page } from '@playwright/test';

const dtpScope = `pw-dtp-${Date.now().toString(36)}`;
const dtpHeaders = { 'x-forwarded-for': dtpScope };

const dynamicTemplateEndpoint =
  '/api/builder/sites/default/dynamic-templates/service-areas.item-template?locale=ko';
const dynamicTemplatePublishEndpoint =
  '/api/builder/sites/default/dynamic-templates/service-areas.item-template/publish?locale=ko';
const baselineSelectedRecordId = 'investment';

type DynamicTemplateDraftState = {
  version: 1;
  visibleBlockIds: string[];
  selectedRecordId: string | null;
};

type DynamicTemplateSnapshot = {
  updatedBy?: string;
  state?: {
    version?: unknown;
    visibleBlockIds?: unknown;
    selectedRecordId?: unknown;
  };
};

type DynamicTemplateApiPayload = {
  ok?: boolean;
  detail?: {
    editableBlocks?: Array<{ blockId?: unknown; defaultVisible?: unknown }>;
  };
  draft?: {
    persisted?: boolean;
    snapshot?: DynamicTemplateSnapshot;
  };
  published?: {
    persisted?: boolean;
    snapshot?: DynamicTemplateSnapshot;
  };
};

type DynamicTemplateSavedState = {
  draft: DynamicTemplateDraftState | null;
  published: DynamicTemplateDraftState | null;
  fallback: DynamicTemplateDraftState;
};

let originalServiceAreaItemState: DynamicTemplateSavedState | null = null;

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  originalServiceAreaItemState = await readCurrentDynamicTemplateState(page);
  await seedDynamicTemplateBaseline(page);
});

test.afterEach(async ({ page }) => {
  if (!originalServiceAreaItemState) return;
  await restoreDynamicTemplateState(page, originalServiceAreaItemState);
  originalServiceAreaItemState = null;
});

test('passes selected dynamic-route preview record into the linked template editor', async ({ page }) => {
  await page.goto('/ko/builder/dynamic-routes/service-areas.item?previewRecordId=civil');
  await expect(page.locator('aside[aria-label="빌더 탐색"]')).toBeVisible();

  const templateHref =
    '/ko/builder/dynamic-templates/service-areas.item-template?previewRecordId=civil';
  const templateLink = page.locator(`a[href="${templateHref}"]`).first();
  await expect(templateLink).toBeVisible();

  await templateLink.click();
  await expect(page).toHaveURL(
    /\/ko\/builder\/dynamic-templates\/service-areas\.item-template\?previewRecordId=civil$/
  );

  const selectedRecord = page.locator('[data-builder-dynamic-template-record="civil"]');
  await expect(selectedRecord).toBeVisible();
  await expect(selectedRecord).toHaveClass(/is-active/);
  await expect(selectedRecord).toContainText('Selected');

  await expect(page.locator('[data-builder-dynamic-template-preview="true"]')).toContainText(
    '/ko/services/civil'
  );

  const bindingMap = page.locator('[data-builder-dynamic-template-binding-map="true"]');
  await expect(bindingMap).toContainText('record.primaryLabel:');
  await expect(bindingMap).toContainText('record.routePath: /ko/services/civil');
  await expect(bindingMap).toContainText('seo.canonicalPath: /ko/services/civil');

  await page.locator('[data-builder-dynamic-template-record="family"]').click();
  await expect(page.locator('[data-builder-dynamic-template-record="family"]')).toHaveClass(
    /is-active/
  );
  await expect(bindingMap).toContainText('record.routePath: /ko/services/family');
  await expect(bindingMap).toContainText('seo.canonicalPath: /ko/services/family');
  await expect(page.locator('[data-builder-dynamic-template-preview="true"]')).toContainText(
    '/ko/services/family'
  );

  const seoToggle = page.locator(
    '[data-builder-dynamic-template-block-toggle="service-areas.item.seo"]'
  );
  await expect(page.locator('[data-builder-dynamic-template-preview="true"]')).toContainText(
    'Record SEO card'
  );
  await seoToggle.click();
  await expect(seoToggle).toHaveText('Hidden');
  await expect(seoToggle).toHaveAttribute('aria-pressed', 'false');
  await expect(
    page.locator('[data-builder-dynamic-template-binding-block="service-areas.item.seo"]')
  ).toContainText('Hidden template block');
  await expect(
    page.locator('[data-builder-dynamic-template-binding-block="service-areas.item.seo"]')
  ).toContainText('seo.canonicalPath: /ko/services/family');
  await expect(page.locator('[data-builder-dynamic-template-preview="true"]')).not.toContainText(
    'Record SEO card'
  );

  await page.goto('/zh-hant/builder/dynamic-routes/service-areas.item?previewRecordId=civil');
  await expect(page.locator('aside[aria-label="建構器導覽"]')).toBeVisible();
});

test('shows a recoverable message for missing dynamic route preview records', async ({ page }) => {
  await page.goto('/ko/builder/dynamic-routes/service-areas.item?previewRecordId=missing-record');

  await expect(page.getByText('Preview record not found').first()).toBeVisible();
  await expect(page.getByText('missing-record').first()).toBeVisible();
  await expect(page.getByText(/No resolved live route|해결된 라이브 경로 없음/).first()).toBeVisible();

  const sampleRecordLink = page.getByRole('link', { name: /Use preview record|미리보기 레코드 사용/ }).first();
  const sampleHref = await sampleRecordLink.getAttribute('href');
  expect(sampleHref).toMatch(/previewRecordId=[^&]+/);

  await sampleRecordLink.click();
  await expect(page).toHaveURL(/\/ko\/builder\/dynamic-routes\/service-areas\.item\?previewRecordId=[^&]+$/);
  await expect(page.getByText('record-selected').first()).toBeVisible();
  await expect(page.getByText(/No resolved live route|해결된 라이브 경로 없음/).first()).toHaveCount(0);
});

test('shows a recoverable message for missing dynamic template preview records', async ({ page }) => {
  await page.goto('/ko/builder/dynamic-templates/service-areas.item-template?previewRecordId=missing-record');

  const missingRecordAlert = page.locator('[data-builder-dynamic-template-missing-record="true"]');
  await expect(missingRecordAlert).toBeVisible();
  await expect(missingRecordAlert).toContainText('Preview record not found');
  await expect(missingRecordAlert).toContainText('missing-record');

  const activeRecordId = await page
    .locator('[data-builder-dynamic-template-record].is-active')
    .first()
    .getAttribute('data-builder-dynamic-template-record');
  expect(activeRecordId).toBeTruthy();
  await expect(missingRecordAlert).toContainText(`Showing ${activeRecordId} instead`);
  await expect(page.locator('[data-builder-dynamic-template-binding-map="true"]')).toContainText(
    `record.routePath: /ko/services/${activeRecordId}`
  );
});

test('persists selected dynamic template preview records across reloads', async ({ page }) => {
  await page.goto('/ko/builder/dynamic-templates/service-areas.item-template');

  const recordIds = await page.locator('[data-builder-dynamic-template-record]').evaluateAll((records) =>
    records
      .map((record) => record.getAttribute('data-builder-dynamic-template-record'))
      .filter((recordId): recordId is string => Boolean(recordId))
  );
  expect(recordIds.length).toBeGreaterThan(1);

  const initialRecordId = await page
    .locator('[data-builder-dynamic-template-record].is-active')
    .first()
    .getAttribute('data-builder-dynamic-template-record');
  const targetRecordId = recordIds.find((recordId) => recordId !== initialRecordId);
  expect(targetRecordId).toBeTruthy();

  const targetRecord = page.locator(`[data-builder-dynamic-template-record="${targetRecordId}"]`);
  const targetRecordText = (await targetRecord.textContent()) ?? '';
  const targetRoutePath = targetRecordText.match(/\/ko\/services\/[\w-]+/)?.[0];
  expect(targetRoutePath).toBeTruthy();

  await targetRecord.click();
  await expect(targetRecord).toHaveClass(/is-active/);

  const saveButton = page.locator('[data-builder-dynamic-template-save="true"]');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();
  await expect(saveButton).toBeDisabled();
  await expect(
    page.locator('[data-builder-dynamic-template-draft-controls="true"]')
  ).toContainText('No unsaved changes');

  await page.goto('/ko/builder/dynamic-templates/service-areas.item-template');
  await expect(page.locator(`[data-builder-dynamic-template-record="${targetRecordId}"]`)).toHaveClass(
    /is-active/
  );
  await expect(page.locator('[data-builder-dynamic-template-binding-map="true"]')).toContainText(
    `record.routePath: ${targetRoutePath}`
  );
});

test('publishes dynamic template block visibility to public service routes', async ({ page }) => {
  await page.goto('/ko/builder/dynamic-templates/service-areas.item-template?previewRecordId=family');

  const heroToggle = page.locator(
    '[data-builder-dynamic-template-block-toggle="service-areas.item.hero"]'
  );
  await expect(heroToggle).toHaveText(/Visible|Hidden/);
  const initialHeroState = ((await heroToggle.textContent()) ?? '').trim();
  const nextHeroState = initialHeroState === 'Visible' ? 'Hidden' : 'Visible';
  await heroToggle.click();
  await expect(heroToggle).toHaveText(nextHeroState);

  const saveButton = page.locator('[data-builder-dynamic-template-save="true"]');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();
  await expect(
    page.locator('[data-builder-dynamic-template-draft-controls="true"]')
  ).toContainText('No unsaved changes');

  const publishButton = page.locator('[data-builder-dynamic-template-publish="true"]');
  await expect(publishButton).toBeEnabled();
  await publishButton.click();
  await expect(
    page.locator('[data-builder-dynamic-template-draft-controls="true"]')
  ).toContainText(/Published v[1-9]\d*/);

  await expect.poll(async () => {
    const visibleBlockIds = await readPublishedVisibleBlockIds(page);
    return visibleBlockIds.includes('service-areas.item.hero') ? 'Visible' : 'Hidden';
  }, { timeout: 20_000 }).toBe(nextHeroState);

  await page.goto(`/ko/services/family?dynamic-template-publish-check=${Date.now()}`);
  const koBackLink = page.locator('.svc-back-link');
  if (await koBackLink.count()) {
    await expect(koBackLink).toContainText('업무분야 목록으로');
  }
  if (nextHeroState === 'Hidden') {
    await expect(page.locator('.svc-hero')).toHaveCount(0);
  } else {
    await expect(page.locator('.svc-hero')).toBeVisible();
  }
  await expect(page.locator('.svc-keypoints-title')).toContainText('핵심 요약');
  await expect(page.locator('.svc-columns-heading')).toContainText('관련 칼럼');
  await expect(page.locator('.authority-card-eyebrow')).toContainText('담당 변호사');
  await expect(page.locator('.svc-sidebar-card--attorney')).toContainText('이 분야 담당 변호사');
  const bookingCard = page.locator('.svc-sidebar-card').filter({ hasText: '상담 예약' });
  await expect(bookingCard).toContainText('상담 예약');
  await expect(bookingCard).toContainText('문의하기');
  await expect(page.locator('.svc-article')).toBeVisible();

  await page.goto(`/zh-hant/services/family?dynamic-template-publish-check=${Date.now()}`);
  const zhBackLink = page.locator('.svc-back-link');
  if (await zhBackLink.count()) {
    await expect(zhBackLink).toContainText('返回服務領域');
  }
  await expect(page.locator('.svc-keypoints-title')).toContainText('重點摘要');
  await expect(page.locator('.svc-columns-heading')).toContainText('相關專欄');
  await expect(page.locator('.authority-card-eyebrow')).toContainText('承辦律師');
  await expect(page.locator('.svc-sidebar-card--attorney')).toContainText('此領域承辦律師');
  const bookingCardZh = page.locator('.svc-sidebar-card').filter({ hasText: '預約諮詢' });
  await expect(bookingCardZh).toContainText('預約諮詢');
  await expect(bookingCardZh).toContainText('聯絡我們');
});

async function readPublishedVisibleBlockIds(page: Page): Promise<string[]> {
  const payload = await readDynamicTemplatePayload(page);
  const visibleBlockIds = payload.published?.snapshot?.state?.visibleBlockIds;
  return Array.isArray(visibleBlockIds)
    ? visibleBlockIds.filter((blockId): blockId is string => typeof blockId === 'string')
    : [];
}

async function readCurrentDynamicTemplateState(page: Page): Promise<DynamicTemplateSavedState> {
  const payload = await readDynamicTemplatePayload(page);
  const fallback = createBaselineDynamicTemplateState(payload);
  const draft = payload.draft?.persisted ? normalizeApiState(payload.draft.snapshot, fallback) : null;
  const published = payload.published?.persisted
    ? normalizeApiState(payload.published.snapshot, fallback)
    : null;
  // Only this suite writes the template state in the QA harness, so a captured
  // state whose updatedBy is one of our own markers is residue from an
  // interrupted prior run — restoring it would make the pollution permanent
  // (this exact loop once published the hero block as hidden forever).
  // Treat such residue as "restore to baseline" instead.
  const isOwnResidue = (snapshot?: { updatedBy?: string } | null) =>
    typeof snapshot?.updatedBy === 'string' && snapshot.updatedBy.startsWith('builder-dynamic-template-test');
  return {
    draft: isOwnResidue(payload.draft?.snapshot) ? fallback : draft,
    published: isOwnResidue(payload.published?.snapshot) ? fallback : published,
    fallback,
  };
}

async function seedDynamicTemplateBaseline(page: Page): Promise<void> {
  const payload = await readDynamicTemplatePayload(page);
  const baseline = createBaselineDynamicTemplateState(payload);
  await writeDynamicTemplateDraft(page, baseline, 'builder-dynamic-template-test-baseline');
  await publishDynamicTemplateDraft(page, 'builder-dynamic-template-test-baseline');
  await writeDynamicTemplateDraft(page, baseline, 'builder-dynamic-template-test-baseline');
}

async function restoreDynamicTemplateState(
  page: Page,
  savedState: DynamicTemplateSavedState
): Promise<void> {
  const publishedState = savedState.published ?? savedState.fallback;
  await writeDynamicTemplateDraft(page, publishedState, 'builder-dynamic-template-test-restore');
  await publishDynamicTemplateDraft(page, 'builder-dynamic-template-test-restore');
  await writeDynamicTemplateDraft(
    page,
    savedState.draft ?? savedState.fallback,
    'builder-dynamic-template-test-restore'
  );
}

async function readDynamicTemplatePayload(page: Page): Promise<DynamicTemplateApiPayload> {
  const response = await page.request.get(dynamicTemplateEndpoint);
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as DynamicTemplateApiPayload;
  expect(payload.ok).toBe(true);
  return payload;
}

async function writeDynamicTemplateDraft(
  page: Page,
  state: DynamicTemplateDraftState,
  updatedBy: string
): Promise<void> {
  const response = await page.request.put(dynamicTemplateEndpoint, {
    data: { state, updatedBy },
    headers: dtpHeaders,
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean };
  expect(payload.ok).toBe(true);
}

async function publishDynamicTemplateDraft(page: Page, updatedBy: string): Promise<void> {
  const response = await page.request.post(dynamicTemplatePublishEndpoint, {
    data: { updatedBy },
    headers: dtpHeaders,
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean };
  expect(payload.ok).toBe(true);
}

function createBaselineDynamicTemplateState(
  payload: DynamicTemplateApiPayload
): DynamicTemplateDraftState {
  const visibleBlockIds = payload.detail?.editableBlocks
    ?.map((block) => block.blockId)
    .filter((blockId): blockId is string => typeof blockId === 'string');

  return {
    version: 1,
    visibleBlockIds: visibleBlockIds?.length
      ? visibleBlockIds
      : ['service-areas.item.hero', 'service-areas.item.body', 'service-areas.item.seo'],
    selectedRecordId: baselineSelectedRecordId,
  };
}

function normalizeApiState(
  snapshot: DynamicTemplateSnapshot | undefined,
  fallback: DynamicTemplateDraftState
): DynamicTemplateDraftState {
  const state = snapshot?.state;
  const visibleBlockIds = Array.isArray(state?.visibleBlockIds)
    ? state.visibleBlockIds.filter((blockId): blockId is string => typeof blockId === 'string')
    : fallback.visibleBlockIds;
  const selectedRecordId =
    typeof state?.selectedRecordId === 'string' ? state.selectedRecordId : fallback.selectedRecordId;

  return {
    version: 1,
    visibleBlockIds,
    selectedRecordId,
  };
}
