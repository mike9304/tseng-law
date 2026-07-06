import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { z } from 'zod';
import { openBuilder } from './helpers/editor';

const SCREENSHOT_PATH = '/tmp/tseng-law-scheduled-publish-ui.png';

const createPagePayloadSchema = z.object({
  error: z.string().optional(),
  pageId: z.string().optional(),
  success: z.boolean().optional(),
});

const scheduledPublishPayloadSchema = z.object({
  job: z.object({
    expectedDraftRevision: z.number().optional(),
    jobId: z.string(),
    scheduledAt: z.string(),
    status: z.enum(['scheduled', 'publishing', 'published', 'failed', 'cancelled']),
  }).nullable().optional(),
  ok: z.boolean().optional(),
});

const baseStyle = {
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

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scheduled-publish-ui';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeDocument(token: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `scheduled-publish-ui-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: `root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 720 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Scheduled publish root',
          background: '#ffffff',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'main',
        },
      },
      {
        id: `title-${token}`,
        kind: 'text',
        parentId: `root-${token}`,
        rect: { x: 96, y: 96, width: 780, height: 104 },
        style: { ...baseStyle, borderRadius: 12 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `예약 발행 UI 검증 ${token}`,
          fontSize: 42,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'h1',
        },
      },
    ],
  };
}

function localDateTimeInputFromNow(hoursFromNow: number): string {
  const date = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function isoFromLocalDateTimeInput(value: string): string {
  return new Date(value).toISOString();
}

async function createScheduledPublishPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(token),
    data: {
      locale: 'ko',
      slug: `scheduled-publish-ui-${token}`,
      title: `Scheduled Publish UI ${token}`,
      addToNavigation: false,
      document: makeDocument(token),
    },
  });
  expect(response.status()).toBe(200);
  const payload = createPagePayloadSchema.parse(await response.json());
  expect(payload.success, payload.error).toBe(true);
  if (!payload.pageId) throw new Error('Expected created page id.');
  return payload.pageId;
}

async function deletePage(request: APIRequestContext, pageId: string | null, token: string): Promise<void> {
  if (!pageId) return;
  await request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}/scheduled-publish?locale=ko`, {
    failOnStatusCode: false,
    headers: mutationHeaders(`${token}-schedule-cleanup`),
  });
  await request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
    failOnStatusCode: false,
    headers: mutationHeaders(`${token}-page-cleanup`),
  });
}

async function readScheduledPublish(
  request: APIRequestContext,
  pageId: string,
  token: string,
): Promise<z.infer<typeof scheduledPublishPayloadSchema>> {
  const response = await request.get(
    `/api/builder/site/pages/${encodeURIComponent(pageId)}/scheduled-publish?locale=ko`,
    { headers: mutationHeaders(`${token}-schedule-read`) },
  );
  expect(response.status()).toBe(200);
  return scheduledPublishPayloadSchema.parse(await response.json());
}

async function acknowledgePublishReviewIfNeeded(publishDialog: ReturnType<Page['getByRole']>): Promise<void> {
  const warningOverride = publishDialog.getByRole('button', { name: /^경고 무시하고 발행$|^Publish anyway$/ });
  if (await warningOverride.isVisible().catch(() => false)) {
    await warningOverride.click();
  }

  const translationReview = publishDialog.locator('[data-builder-publish-site-translation-review="true"]');
  const translationAcknowledge = translationReview.locator('[data-builder-publish-site-translation-acknowledge="true"]');
  if (await translationAcknowledge.isVisible().catch(() => false)) {
    await translationAcknowledge.click();
    await expect(translationReview).toHaveAttribute('data-builder-publish-site-translation-acknowledged', 'true');
  }
}

async function openPublishDialog(page: Page) {
  await page.getByRole('button', { name: /^Publish$|^게시$|^발행$/ }).click();
  const publishDialog = page.getByRole('dialog', { name: /페이지 발행|Publish Page/ });
  await expect(publishDialog).toBeVisible();
  await expect(page.locator('[data-builder-publish-preflight-item]').first()).toBeVisible();
  await acknowledgePublishReviewIfNeeded(publishDialog);
  return publishDialog;
}

test('/ko/admin-builder schedules, reloads, and cancels publish from the modal', async ({ page }) => {
  test.setTimeout(120_000);
  const token = Date.now().toString(36);
  const scheduledInput = localDateTimeInputFromNow(48);
  const scheduledIso = isoFromLocalDateTimeInput(scheduledInput);
  let pageId: string | null = null;

  try {
    pageId = await createScheduledPublishPage(page.request, token);
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&scheduledPublishUi=${token}`);

    const publishDialog = await openPublishDialog(page);
    const scheduleInput = publishDialog.getByLabel('예약 발행 시각');
    await scheduleInput.fill(scheduledInput);
    await expect(scheduleInput).toHaveValue(scheduledInput);

    const scheduleButton = publishDialog.locator('[data-builder-publish-schedule-action="schedule"]').first();
    await expect(scheduleButton).toBeEnabled();
    const scheduleResponse = page.waitForResponse((response) => (
      response.request().method() === 'POST'
      && response.url().includes(`/api/builder/site/pages/${pageId}/scheduled-publish?`)
    ));
    await scheduleButton.click();
    expect((await scheduleResponse).status()).toBe(200);
    await expect(publishDialog.locator('[data-builder-publish-schedule-status="scheduled"]')).toBeVisible();
    await expect(publishDialog.locator('[data-builder-publish-schedule-action="cancel"]').first()).toBeEnabled();

    const scheduledPayload = await readScheduledPublish(page.request, pageId, token);
    expect(scheduledPayload.ok).toBe(true);
    expect(scheduledPayload.job?.status).toBe('scheduled');
    expect(scheduledPayload.job?.scheduledAt).toBe(scheduledIso);

    await publishDialog.screenshot({ path: SCREENSHOT_PATH });
    await publishDialog.getByRole('button', { name: /^닫기$|^취소$|^Close$|^Cancel$/ }).first().click();
    await expect(publishDialog).not.toBeVisible();

    const reopenedDialog = await openPublishDialog(page);
    await expect(reopenedDialog.getByLabel('예약 발행 시각')).toHaveValue(scheduledInput);
    await expect(reopenedDialog.locator('[data-builder-publish-schedule-status="scheduled"]')).toBeVisible();
    const cancelButton = reopenedDialog.locator('[data-builder-publish-schedule-action="cancel"]').first();
    await expect(cancelButton).toBeEnabled();
    const cancelResponse = page.waitForResponse((response) => (
      response.request().method() === 'DELETE'
      && response.url().includes(`/api/builder/site/pages/${pageId}/scheduled-publish?`)
    ));
    await cancelButton.click();
    expect((await cancelResponse).status()).toBe(200);
    await expect(reopenedDialog.locator('[data-builder-publish-schedule-action="schedule"]').first()).toBeEnabled();
    await expect(reopenedDialog.locator('[data-builder-publish-schedule-status]')).toHaveCount(0);

    const cancelledPayload = await readScheduledPublish(page.request, pageId, token);
    expect(cancelledPayload.ok).toBe(true);
    expect(cancelledPayload.job).toBeNull();
  } finally {
    await deletePage(page.request, pageId, token);
  }
});
