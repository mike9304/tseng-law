import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'redirect-manager';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

type RedirectRecord = {
  redirectId: string;
  from: string;
  to: string;
  type: number;
  isActive: boolean;
};

async function listRedirects(
  request: APIRequestContext,
  scope: string,
): Promise<RedirectRecord[]> {
  const response = await request.get('/api/builder/site/redirects?locale=ko', {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { redirects?: RedirectRecord[] };
  return payload.redirects ?? [];
}

async function deleteRedirect(
  request: APIRequestContext,
  redirectId: string,
  scope: string,
): Promise<void> {
  await request.delete(`/api/builder/site/redirects/${encodeURIComponent(redirectId)}?locale=ko`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

async function createRedirectViaUi(
  page: Page,
  options: {
    from: string;
    to: string;
    type: '301' | '308';
    note: string;
  },
): Promise<void> {
  await page.getByRole('textbox', { name: 'Source path', exact: true }).fill(options.from);
  await page.getByRole('textbox', { name: 'Destination path', exact: true }).fill(options.to);
  await page.getByRole('combobox', { name: 'Redirect status', exact: true }).selectOption(options.type);
  await page.getByRole('textbox', { name: 'Note', exact: true }).fill(options.note);
  await page.getByRole('button', { name: 'Add rule' }).click();
  await expect(page.getByText('Redirect rule created.')).toBeVisible();
  await expect.poll(async () => (
    page.locator('input').evaluateAll((inputs, value) => (
      inputs.some((input) => (input as HTMLInputElement).value === value)
    ), options.from)
  )).toBe(true);
}

test.describe('W188 redirect manager', () => {
  test('creates redirect rules in the UI and middleware returns public redirects', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const scope = `w188-${token}`;
    const source301 = `/ko/w188-old-${token}`;
    const target301 = `/ko/contact?w188=${token}`;
    const source308 = `/ko/w188-permanent-${token}`;
    const target308 = `/ko/services/investment?w188=${token}`;
    const createdIds: string[] = [];

    await page.setExtraHTTPHeaders(mutationHeaders(scope));

    try {
      await page.goto('/ko/admin-builder/seo/redirects', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: 'Redirect Rules' })).toBeVisible();

      await createRedirectViaUi(page, {
        from: source301,
        to: target301,
        type: '301',
        note: `W188 301 ${token}`,
      });
      await createRedirectViaUi(page, {
        from: source308,
        to: target308,
        type: '308',
        note: `W188 308 ${token}`,
      });

      const redirects = await listRedirects(page.request, scope);
      for (const source of [source301, source308]) {
        const redirect = redirects.find((candidate) => candidate.from === source);
        expect(redirect).toBeTruthy();
        createdIds.push(redirect!.redirectId);
      }

      const redirect301 = await page.request.get(source301, {
        failOnStatusCode: false,
        maxRedirects: 0,
      });
      expect(redirect301.status()).toBe(301);
      expect(redirect301.headers().location).toContain(target301);

      const redirect308 = await page.request.get(source308, {
        failOnStatusCode: false,
        maxRedirects: 0,
      });
      expect(redirect308.status()).toBe(308);
      expect(redirect308.headers().location).toContain(target308);
    } finally {
      const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
      for (const source of [source301, source308]) {
        const redirect = redirects.find((candidate) => candidate.from === source);
        if (redirect && !createdIds.includes(redirect.redirectId)) {
          createdIds.push(redirect.redirectId);
        }
      }
      for (const redirectId of createdIds) {
        await deleteRedirect(page.request, redirectId, `${scope}-cleanup`);
      }
    }
  });
});
