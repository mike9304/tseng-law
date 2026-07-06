import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder, openSiteSettings } from './helpers/editor';

type TranslationReleasePolicyMode =
  | 'acknowledge-other-page-warnings'
  | 'block-other-page-warnings';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'translation-release-settings';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
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
  username: string | null,
  token: string,
): Promise<void> {
  if (!username) return;
  await request.delete(`/api/builder/security/users/${encodeURIComponent(username)}?locale=ko`, {
    headers: mutationHeaders(`${token}-reviewer-user-cleanup`),
    failOnStatusCode: false,
  });
}

async function readTranslationReleasePolicyRoles(
  request: APIRequestContext,
): Promise<readonly string[]> {
  const response = await request.get('/api/builder/site/translation-release-policy?locale=ko', {
    headers: mutationHeaders('settings-read-policy'),
  });
  expect(response.status()).toBe(200);
  const payload: unknown = await response.json();
  if (!isObjectRecord(payload) || !isObjectRecord(payload.policy)) {
    throw new Error('Expected translation release policy payload.');
  }
  const roles = payload.policy.approvalRequiredForRoles;
  if (!isStringArray(roles)) throw new Error('Expected policy role list.');
  return roles;
}

async function requestTranslationReleaseApproval(
  request: APIRequestContext,
  token: string,
): Promise<string> {
  const response = await request.post('/api/builder/site/translation-release-approvals', {
    headers: mutationHeaders(`${token}-request`),
    data: {
      pageId: `settings-${token}`,
      locale: 'ko',
      summary: {
        sourceLocale: 'ko',
        syncedAt: new Date().toISOString(),
        totalCount: 4,
        currentPageCount: 1,
        otherPageCount: 3,
        warningCount: 3,
        errorCount: 1,
        reviewHref: `/ko/admin-builder/translations?settings=${token}`,
        warningFingerprint: `settings-${token}`,
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

async function resolveApprovalIfPending(
  request: APIRequestContext,
  approvalId: string | null,
  token: string,
): Promise<void> {
  if (!approvalId) return;
  await request.patch(`/api/builder/site/translation-release-approvals/${approvalId}`, {
    headers: mutationHeaders(`${token}-approval-cleanup`),
    data: { decision: 'approve', comment: 'Playwright cleanup.' },
    failOnStatusCode: false,
  });
}

async function readApprovalStatus(
  request: APIRequestContext,
  approvalId: string,
): Promise<string> {
  const response = await request.get(`/api/builder/site/translation-release-approvals/${approvalId}`, {
    headers: mutationHeaders('settings-read-approval'),
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

async function expectSelfReviewBlocked(
  request: APIRequestContext,
  approvalId: string,
  token: string,
): Promise<void> {
  const response = await request.patch(`/api/builder/site/translation-release-approvals/${approvalId}`, {
    headers: mutationHeaders(`${token}-self-review`),
    data: { decision: 'approve', comment: 'Self-review should be blocked.' },
  });
  expect(response.status()).toBe(409);
  const payload: unknown = await response.json();
  if (!isObjectRecord(payload)) throw new Error('Expected self-review error payload.');
  expect(payload.error).toBe('approval_self_review_forbidden');
}

function collectCriticalBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  return errors;
}

test('/ko/admin-builder manages translation release approval settings and reviewer queue', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const reviewerUsername = `release-reviewer-${token}`;
  const browserErrors = collectCriticalBrowserErrors(page);
  let approvalId: string | null = null;
  let createdReviewerUsername: string | null = null;

  try {
    await upsertReviewerUser(page.request, reviewerUsername, token);
    createdReviewerUsername = reviewerUsername;
    await setTranslationReleasePolicy(page.request, 'acknowledge-other-page-warnings', ['owner'], token);
    approvalId = await requestTranslationReleaseApproval(page.request, token);

    await openBuilder(page, `/ko/admin-builder?translationReleaseSettings=${token}`);
    const modal = await openSiteSettings(page);
    await modal.getByRole('button', { name: /고급|Advanced/ }).click();

    const panel = modal.locator('[data-builder-translation-release-settings]');
    await expect(panel).toBeVisible();
    await expect(panel.locator('[data-builder-translation-release-policy-mode]'))
      .toHaveValue('acknowledge-other-page-warnings');
    await expect(panel.locator('[data-builder-translation-release-role-owner]')).toBeChecked();

    const adminRole = panel.locator('[data-builder-translation-release-role-admin]');
    if (!(await adminRole.isChecked())) await adminRole.check();
    await panel.locator('[data-builder-translation-release-policy-save]').click();
    await expect(panel.locator('[data-builder-translation-release-save-state]')).toContainText(/저장|Saved/);

    const savedRoles = await readTranslationReleasePolicyRoles(page.request);
    expect(savedRoles).toEqual(expect.arrayContaining(['owner', 'admin']));

    const approvalRow = panel
      .locator('[data-builder-translation-release-approval-row]')
      .filter({ hasText: `settings-${token}` });
    await expect(approvalRow).toBeVisible();
    const report = panel.locator('[data-builder-translation-release-report]');
    await expect(report).toContainText(/대기 \d+/);
    await expect(report).toContainText(/Owner \d+/);
    await expect(panel.locator('[data-builder-translation-release-activity-report]'))
      .toContainText(/admin 요청 \d+ · 검토 \d+/);
    await expect(panel.locator('[data-builder-translation-release-assignment-report]'))
      .toContainText(reviewerUsername);
    await expect(panel.locator('[data-builder-translation-release-escalation-report]'))
      .toContainText(/지연 \d+ · 기준 24h/);
    await expect(approvalRow.locator('[data-builder-translation-release-self-review-disabled]'))
      .toContainText(/본인 요청은 다른 담당자가 검토해야 합니다/);
    await expect(approvalRow.locator('[data-builder-translation-release-approval-approve]'))
      .toBeDisabled();
    await expect(approvalRow.locator('[data-builder-translation-release-approval-reject]'))
      .toBeDisabled();

    if (!approvalId) throw new Error('Expected approval id before review decision.');
    const verifiedApprovalId = approvalId;
    await expectSelfReviewBlocked(page.request, verifiedApprovalId, token);
    await expect.poll(() => readApprovalStatus(page.request, verifiedApprovalId)).toBe('pending');
    await expect(approvalRow).toBeVisible();

    await panel.screenshot({ path: '/private/tmp/translation-release-approval-settings-ko.png' });
    expect(browserErrors).toEqual([]);
  } finally {
    await resolveApprovalIfPending(page.request, approvalId, token);
    await setTranslationReleasePolicy(page.request, 'acknowledge-other-page-warnings', [], `${token}-cleanup`)
      .catch(() => undefined);
    await removeReviewerUser(page.request, createdReviewerUsername, token).catch(() => undefined);
  }
});
