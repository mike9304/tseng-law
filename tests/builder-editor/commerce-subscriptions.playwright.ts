import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('subscriptions: POST plan, POST subscription, PATCH transition', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `sub-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const planRes = await page.request.post('/api/builder/commerce/subscriptions', {
    data: {
      kind: 'plan',
      name: { ko: `pw-plan-${token}` },
      amountCents: 9900,
      currency: 'KRW',
      interval: 'month',
      intervalCount: 1,
      status: 'active',
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(planRes.status()).toBe(201);
  const planBody = (await planRes.json()) as { ok: boolean; plan: { id: string } };
  expect(planBody.plan.id.startsWith('plan_')).toBe(true);

  const subRes = await page.request.post('/api/builder/commerce/subscriptions', {
    data: {
      kind: 'subscription',
      planId: planBody.plan.id,
      customer: { email: `pw-${token}@example.com`, name: 'PW User' },
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(subRes.status()).toBe(201);
  const subBody = (await subRes.json()) as { ok: boolean; subscription: { id: string; status: string } };
  expect(subBody.subscription.id.startsWith('sub_')).toBe(true);

  const transitionRes = await page.request.patch(
    `/api/builder/commerce/subscriptions/${encodeURIComponent(subBody.subscription.id)}`,
    {
      data: { kind: 'subscription', transition: 'cancel', note: 'pw cleanup' },
      headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
    },
  );
  expect(transitionRes.status()).toBe(200);
  const transitioned = (await transitionRes.json()) as { ok: boolean; subscription: { status: string } };
  expect(transitioned.subscription.status).toBe('cancelled');
});