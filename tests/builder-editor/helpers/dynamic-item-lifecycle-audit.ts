import { expect, type Page } from '@playwright/test';
import { z } from 'zod';

const auditResponseSchema = z.object({
  ok: z.boolean(),
  events: z.array(z.object({
    type: z.string(),
    collectionId: z.string().optional(),
    action: z.string().optional(),
    status: z.string().optional(),
    changedCount: z.number().optional(),
    recordIds: z.array(z.string()).optional(),
  })),
});

export async function expectDynamicItemLifecycleAuditEvents(
  page: Page,
  opts: { readonly collectionId: string; readonly token: string },
): Promise<void> {
  const collectionAuditResponse = await page.request.get(
    `/api/builder/site/audit?locale=ko&limit=100&collectionId=${encodeURIComponent(opts.collectionId)}`,
  );
  expect(collectionAuditResponse.status()).toBe(200);
  const collectionAudit = auditResponseSchema.parse(await collectionAuditResponse.json());
  expect(collectionAudit.events).toEqual(expect.arrayContaining([
    expect.objectContaining({
      type: 'cms.records.bulk_lifecycle',
      action: 'delete',
      changedCount: 1,
      recordIds: [`recipe-delete-${opts.token}`],
    }),
    expect.objectContaining({
      type: 'cms.records.bulk_lifecycle',
      action: 'status',
      status: 'archived',
      changedCount: 1,
      recordIds: [`recipe-draft-${opts.token}`],
    }),
    expect.objectContaining({
      type: 'cms.records.bulk_lifecycle',
      action: 'status',
      status: 'published',
      changedCount: 1,
      recordIds: [`recipe-draft-${opts.token}`],
    }),
  ]));

  const recordAuditResponse = await page.request.get(
    `/api/builder/site/audit?locale=ko&limit=100&collectionId=${encodeURIComponent(opts.collectionId)}&recordId=recipe-draft-${opts.token}`,
  );
  expect(recordAuditResponse.status()).toBe(200);
  const recordAudit = auditResponseSchema.parse(await recordAuditResponse.json());
  expect(recordAudit.events.every((event) => event.recordIds?.includes(`recipe-draft-${opts.token}`))).toBe(true);
  expect(recordAudit.events).toEqual(expect.arrayContaining([
    expect.objectContaining({ status: 'archived' }),
    expect.objectContaining({ status: 'draft' }),
    expect.objectContaining({ status: 'published' }),
  ]));
}
