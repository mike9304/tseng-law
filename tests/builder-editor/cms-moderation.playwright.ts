import { expect, test, type APIRequestContext } from '@playwright/test';

const SITE_ID = 'tseng-law-main-site';
const LOCALE = 'ko';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'cms-moderation';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createCollection(
  request: APIRequestContext,
  collectionId: string,
  name: string,
  scope: string,
): Promise<void> {
  const response = await request.post(`/api/builder/sites/${SITE_ID}/collections?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: {
      collectionId,
      name,
      description: 'Moderation queue regression collection',
      permissions: {
        read: ['admin'],
        create: ['public', 'admin'],
        update: ['admin'],
        delete: ['admin'],
      },
    },
  });
  expect(response.status()).toBe(201);
  const payload = (await response.json()) as { ok?: boolean; error?: string; issues?: string[] };
  expect(payload.ok, payload.error ?? payload.issues?.join('\n')).toBe(true);
}

async function createPendingRecord(
  request: APIRequestContext,
  collectionId: string,
  scope: string,
): Promise<string> {
  const response = await request.post(
    `/api/builder/sites/${SITE_ID}/collections/${encodeURIComponent(collectionId)}/records?locale=${LOCALE}`,
    {
      headers: mutationHeaders(scope),
      data: {
        status: 'pending',
        fields: {
          title: 'Visitor lead',
          slug: 'visitor-lead',
        },
      },
    },
  );
  expect(response.status()).toBe(201);
  const payload = (await response.json()) as {
    ok?: boolean;
    record?: { recordId: string };
    error?: string;
    issues?: string[];
  };
  expect(payload.ok, payload.error ?? payload.issues?.join('\n')).toBe(true);
  expect(payload.record?.recordId).toBeTruthy();
  return payload.record!.recordId;
}

async function deleteCollection(
  request: APIRequestContext,
  collectionId: string,
  scope: string,
): Promise<void> {
  await request.delete(`/api/builder/sites/${SITE_ID}/collections/${encodeURIComponent(collectionId)}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

test('/ko/admin-builder/cms stores moderation reason/history and filters visitor rows', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `pw-moderation-${token}`;
  const collectionName = `Moderation ${token}`;
  const scope = `cms-moderation-${token}`;
  const reason = 'Not enough Taiwan-law details';
  let recordId = '';

  try {
    // Parallel-suite churn on the shared editable-CMS store can drop a freshly
    // created collection (records POST then 404s) — recreate from scratch and
    // retry until the pending record lands.
    await expect(async () => {
      await deleteCollection(page.request, collectionId, `${scope}-heal`);
      await createCollection(page.request, collectionId, collectionName, `${scope}-collection`);
      recordId = await createPendingRecord(page.request, collectionId, `${scope}-record`);
    }).toPass({ timeout: 60_000 });

    await page.goto(`/ko/admin-builder/cms?moderation=${token}`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: new RegExp(collectionName) }).click();
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible();
    await expect(page.getByText(recordId).first()).toBeVisible();

    await page.locator(`[aria-label="Select ${recordId}"]`).check();
    await page.locator('[data-cms-moderation-reason-input]').fill(reason);
    // The reject write can race a concurrent shared-store flush — re-arm the
    // confirm dialog and retry the action until the history row records it.
    // Detect success via the API: once rejected, the Reject button disables
    // and the history row may only materialize under the rejected filter, so
    // DOM text is not a reliable success signal for the retry loop.
    const isRejectedInApi = async (): Promise<boolean> => {
      const res = await page.request.get(
        `/api/builder/sites/${SITE_ID}/collections/${encodeURIComponent(collectionId)}?locale=${LOCALE}`,
        { headers: mutationHeaders(`${scope}-poll`), failOnStatusCode: false },
      );
      if (!res.ok()) return false;
      const data = (await res.json().catch(() => ({}))) as {
        detail?: { records?: Array<{ recordId?: string; status?: string }> };
      };
      return (data.detail?.records ?? []).some((entry) => entry.recordId === recordId && entry.status === 'rejected');
    };
    await expect(async () => {
      if (!(await isRejectedInApi())) {
        page.once('dialog', (dialog) => dialog.accept());
        await page.getByRole('button', { name: 'Reject', exact: true }).click();
      }
      expect(await isRejectedInApi()).toBe(true);
    }).toPass({ timeout: 45_000 });
    // Surface the rejected record's moderation details in the UI. The history
    // block only renders in the Expanded rows grid density.
    await page.locator('[data-cms-moderation-filter="rejected"]').click();
    await page.getByRole('button', { name: 'Expanded rows' }).click();
    await expect(page.locator(`[data-cms-moderation-latest-reason="${recordId}"]`)).toContainText(reason);
    await expect(page.locator(`[data-cms-moderation-history="${recordId}"]`)).toContainText('rejected');
    await expect(page.locator(`[data-cms-moderation-history="${recordId}"]`)).toContainText(reason);

    const detailResponse = await page.request.get(
      `/api/builder/sites/${SITE_ID}/collections/${encodeURIComponent(collectionId)}?locale=${LOCALE}`,
      { headers: mutationHeaders(`${scope}-read`) },
    );
    expect(detailResponse.status()).toBe(200);
    const detailPayload = (await detailResponse.json()) as {
      detail?: {
        records?: Array<{
          recordId: string;
          status: string;
          moderation?: {
            reason?: string;
            history?: Array<{ status: string; reason?: string }>;
          };
        }>;
      };
    };
    const savedRecord = detailPayload.detail?.records?.find((record) => record.recordId === recordId);
    expect(savedRecord).toMatchObject({
      status: 'rejected',
      moderation: {
        reason,
        history: expect.arrayContaining([
          expect.objectContaining({ status: 'pending' }),
          expect.objectContaining({ status: 'rejected', reason }),
        ]),
      },
    });

    await page.locator('[data-cms-moderation-filter="pending"]').click();
    await expect(page.getByText(recordId)).toHaveCount(0);
    await expect(page.getByText('No matching records')).toBeVisible();

    await page.locator('[data-cms-moderation-filter="rejected"]').click();
    await expect(page.getByText(recordId).first()).toBeVisible();
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});
