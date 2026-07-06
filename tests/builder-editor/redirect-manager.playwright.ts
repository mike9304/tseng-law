import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { getRedirectManagerCopy } from '@/components/builder/seo/redirect-manager-copy';

const COPY = getRedirectManagerCopy('ko');

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
  const hasRowWithSource = () => page
    .locator('tbody input[aria-label^="Source path for "]')
    .evaluateAll((inputs, value) => (
      inputs.some((input) => (input as HTMLInputElement).value === value)
    ), options.from);

  // Fills can race client hydration (goto uses waitUntil: 'commit'); hydration resets the
  // controlled inputs to empty state and the POST is rejected with validation_error. Verify the
  // form holds the values right before submitting and self-heal by retrying the whole sequence.
  await expect(async () => {
    if (!(await hasRowWithSource())) {
      const sourceInput = page.getByRole('textbox', { name: COPY.sourceLabel, exact: true });
      await sourceInput.fill(options.from);
      await page.getByRole('textbox', { name: COPY.destinationLabel, exact: true }).fill(options.to);
      await page.getByRole('combobox', { name: COPY.statusLabel, exact: true }).selectOption(options.type);
      await page.getByRole('textbox', { name: COPY.noteLabel, exact: true }).fill(options.note);
      await expect(sourceInput).toHaveValue(options.from);
      await page.getByRole('button', { name: COPY.createButton }).click();
    }
    expect(await hasRowWithSource()).toBe(true);
  }).toPass({ timeout: 60_000 });
}

test.describe('W188 redirect manager', () => {
  test('creates redirect rules in the UI and middleware returns public redirects', async ({ page }) => {
    test.setTimeout(120_000);

    const token = Date.now().toString(36);
    const scope = `w188-${token}`;
    const source301 = `/ko/w188-old-${token}`;
    const target301 = `/ko/contact?w188=${token}`;
    const source308 = `/ko/w188-permanent-${token}`;
    const target308 = `/ko/services/investment?w188=${token}`;
    const createdIds: string[] = [];

    await page.setExtraHTTPHeaders(mutationHeaders(scope));

    try {
      await page.goto('/ko/admin-builder/seo/redirects', { waitUntil: 'commit', timeout: 120_000 });
      await expect(page.getByRole('heading', { name: COPY.heading })).toBeVisible();

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

  test('creates wildcard redirect rules in the UI and preserves nested path suffixes', async ({ page }) => {
    test.setTimeout(120_000);

    const token = Date.now().toString(36);
    const scope = `w188-wildcard-${token}`;
    const exactSource = `/ko/w188-exact-${token}`;
    const exactDestination = `/ko/w188-exact-target-${token}`;
    const source = `/ko/w188-wild-${token}/*`;
    const destination = `/ko/w188-target-${token}/*`;
    const nestedPath = `/ko/w188-wild-${token}/post-one`;
    const expectedLocation = `/ko/w188-target-${token}/post-one`;
    const createdIds: string[] = [];

    await page.setExtraHTTPHeaders(mutationHeaders(scope));

    try {
      await page.goto('/ko/admin-builder/seo/redirects', { waitUntil: 'commit', timeout: 120_000 });
      await expect(page.getByRole('heading', { name: COPY.heading })).toBeVisible();

      await createRedirectViaUi(page, {
        from: exactSource,
        to: exactDestination,
        type: '301',
        note: `W188 exact ${token}`,
      });
      await createRedirectViaUi(page, {
        from: source,
        to: destination,
        type: '301',
        note: `W188 wildcard ${token}`,
      });

      const redirects = await listRedirects(page.request, scope);
      const wildcard = redirects.find((candidate) => candidate.from === source);
      const exact = redirects.find((candidate) => candidate.from === exactSource);
      expect(exact).toBeTruthy();
      expect(wildcard).toBeTruthy();
      createdIds.push(exact!.redirectId, wildcard!.redirectId);
      const wildcardRow = page.getByLabel(`Source path for ${wildcard!.redirectId}`).locator('xpath=ancestor::tr');
      await expect(wildcardRow.getByText(COPY.wildcardLabel, { exact: true })).toBeVisible();
      await expect(wildcardRow.getByText(COPY.wildcardDescription)).toBeVisible();
      const exactRow = page.getByLabel(`Source path for ${exact!.redirectId}`).locator('xpath=ancestor::tr');
      await expect(exactRow.getByText(COPY.exactLabel, { exact: true })).toBeVisible();
      const totalVisibleRows = await page.locator('tbody tr').count();

      await page.getByLabel(COPY.searchPlaceholder).fill('w188-wild-');
      await expect(page).toHaveURL(/q=w188-wild-/);
      await expect.poll(async () => page.locator('tbody tr').count()).toBe(1);
      await expect(page.getByLabel(`Source path for ${wildcard!.redirectId}`)).toBeVisible();
      await expect(page.getByLabel(`Source path for ${exact!.redirectId}`)).toHaveCount(0);
      await page.getByRole('button', { name: COPY.clearSearch }).click();
      await expect(page).toHaveURL(/\/ko\/admin-builder\/seo\/redirects$/);
      await expect.poll(async () => page.locator('tbody tr').count()).toBe(totalVisibleRows);

      const redirectResponse = await page.request.get(nestedPath, {
        failOnStatusCode: false,
        maxRedirects: 0,
      });
      expect(redirectResponse.status()).toBe(301);
      expect(redirectResponse.headers().location).toBe(expectedLocation);
    } finally {
      const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
      for (const redirectId of createdIds) {
        await deleteRedirect(page.request, redirectId, `${scope}-cleanup`);
      }
      for (const redirect of redirects) {
        if (redirect.from === source || redirect.to === destination) {
          await deleteRedirect(page.request, redirect.redirectId, `${scope}-cleanup`);
        }
      }
    }
  });
});
