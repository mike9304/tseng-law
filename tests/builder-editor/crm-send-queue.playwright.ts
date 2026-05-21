import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('GET /api/builder/crm/send-queue returns stats shape', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `sendq-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const res = await page.request.get('/api/builder/crm/send-queue?recent=5');
  expect(res.status()).toBe(200);
  const body = (await res.json()) as {
    ok: boolean;
    stats: {
      total: number;
      pending: number;
      sent: number;
      failed: number;
      bounced: number;
      byCampaign: Record<string, unknown>;
      recent: unknown[];
    };
  };
  expect(body.ok).toBe(true);
  expect(typeof body.stats.total).toBe('number');
  expect(typeof body.stats.pending).toBe('number');
  expect(typeof body.stats.sent).toBe('number');
  expect(typeof body.stats.failed).toBe('number');
  expect(typeof body.stats.bounced).toBe('number');
  expect(Array.isArray(body.stats.recent)).toBe(true);
  expect(body.stats.recent.length).toBeLessThanOrEqual(5);
  expect(typeof body.stats.byCampaign).toBe('object');
});