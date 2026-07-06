import { expect, test, type APIRequestContext, type Browser, type Page } from '@playwright/test';
import { openBuilder, openSiteSettings } from './helpers/editor';

type TranslationReleasePolicyMode =
  | 'acknowledge-other-page-warnings'
  | 'block-other-page-warnings';

type ReviewerCredentials = {
  readonly username: string;
  readonly password: string;
};

const reviewerCredentials: ReviewerCredentials = {
  username: process.env.BUILDER_REVIEWER_SMOKE_USERNAME ?? 'reviewer',
  password: process.env.BUILDER_REVIEWER_SMOKE_PASSWORD ?? 'reviewer-pass',
};

test.skip(
  process.env.BUILDER_MULTI_ACCOUNT_SMOKE !== '1',
  'Set BUILDER_MULTI_ACCOUNT_SMOKE=1 with BUILDER_BASIC_AUTH_USERS for the two-account approval smoke.',
);

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'translation-release-approval';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function setTranslationReleasePolicy(
  request: APIRequestContext,
  mode: TranslationReleasePolicyMode,
  approvalRequiredForRoles: readonly string[],
  token: string,
): Promise<void> {
  const response = await request.put('/api/builder/site/translation-release-policy?locale=ko', {
    headers: mutationHeaders(`${token}-policy`),
    data: { mode, approvalRequiredForRoles },
  });
  expect(response.status()).toBe(200);
}

async function upsertReviewerUser(
  request: APIRequestContext,
  username: string,
  token: string,
): Promise<void> {
  const response = await request.post('/api/builder/security/users?locale=ko', {
    headers: mutationHeaders(`${token}-reviewer-user`),
    data: { username, role: 'owner', locale: 'ko' },
  });
  expect(response.status()).toBe(201);
}

async function removeReviewerUser(
  request: APIRequestContext,
  username: string,
  token: string,
): Promise<void> {
  await request.delete(`/api/builder/security/users/${encodeURIComponent(username)}?locale=ko`, {
    headers: mutationHeaders(`${token}-reviewer-user-cleanup`),
    failOnStatusCode: false,
  });
}

async function requestTranslationReleaseApproval(
  request: APIRequestContext,
  token: string,
): Promise<string> {
  const response = await request.post('/api/builder/site/translation-release-approvals', {
    headers: mutationHeaders(`${token}-request`),
    data: {
      pageId: `multi-account-${token}`,
      locale: 'ko',
      summary: {
        sourceLocale: 'ko',
        syncedAt: new Date().toISOString(),
        totalCount: 4,
        currentPageCount: 1,
        otherPageCount: 3,
        warningCount: 3,
        errorCount: 1,
        reviewHref: `/ko/admin-builder/translations?multiAccount=${token}`,
        warningFingerprint: `multi-account-${token}`,
      },
    },
  });
  expect(response.status()).toBe(201);
  const payload: unknown = await response.json();
  if (!isObjectRecord(payload) || !isObjectRecord(payload.approval)) {
    throw new Error('Expected approval payload.');
  }
  const approvalId = payload.approval.id;
  if (typeof approvalId !== 'string') throw new Error('Expected approval id.');
  return approvalId;
}

async function readApprovalStatus(
  request: APIRequestContext,
  approvalId: string,
): Promise<string> {
  const response = await request.get(`/api/builder/site/translation-release-approvals/${approvalId}`, {
    headers: mutationHeaders('multi-account-read-approval'),
  });
  expect(response.status()).toBe(200);
  const payload: unknown = await response.json();
  if (!isObjectRecord(payload) || !isObjectRecord(payload.approval)) {
    throw new Error('Expected approval status payload.');
  }
  const status = payload.approval.status;
  if (typeof status !== 'string') throw new Error('Expected approval status.');
  return status;
}

async function openReviewerPage(browser: Browser, baseURL: string | undefined): Promise<Page> {
  const context = await browser.newContext({
    baseURL,
    httpCredentials: reviewerCredentials,
    viewport: { width: 1440, height: 1000 },
  });
  return context.newPage();
}

function collectCriticalBrowserErrors(page: Page): readonly string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  return errors;
}

test('/ko/admin-builder lets a separate reviewer credential approve a pending translation release', async ({
  page,
  browser,
  baseURL,
}) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  let approvalId: string | null = null;
  const reviewerPage = await openReviewerPage(browser, baseURL);
  const browserErrors = collectCriticalBrowserErrors(reviewerPage);

  try {
    await setTranslationReleasePolicy(page.request, 'acknowledge-other-page-warnings', ['owner'], token);
    await upsertReviewerUser(page.request, reviewerCredentials.username, token);
    approvalId = await requestTranslationReleaseApproval(page.request, token);

    await openBuilder(reviewerPage, `/ko/admin-builder?translationReleaseMultiAccount=${token}`);
    const modal = await openSiteSettings(reviewerPage);
    await modal.getByRole('button', { name: /고급|Advanced/ }).click();

    const panel = modal.locator('[data-builder-translation-release-settings]');
    await expect(panel).toBeVisible();
    const approvalRow = panel
      .locator('[data-builder-translation-release-approval-row]')
      .filter({ hasText: `multi-account-${token}` });
    await expect(approvalRow).toBeVisible();
    await expect(approvalRow.locator('[data-builder-translation-release-self-review-disabled]'))
      .toHaveCount(0);
    await expect(approvalRow.locator('[data-builder-translation-release-approval-approve]'))
      .toBeEnabled();

    await approvalRow.locator('[data-builder-translation-release-approval-approve]').click();
    await expect(panel.locator('[data-builder-translation-release-save-state]')).toContainText(/승인됨|Approved/);

    const verifiedApprovalId = approvalId;
    await expect.poll(() => readApprovalStatus(page.request, verifiedApprovalId)).toBe('approved');
    expect(browserErrors).toEqual([]);
  } finally {
    await reviewerPage.context().close();
    await setTranslationReleasePolicy(page.request, 'acknowledge-other-page-warnings', [], `${token}-cleanup`)
      .catch(() => undefined);
    await removeReviewerUser(page.request, reviewerCredentials.username, token).catch(() => undefined);
  }
});
