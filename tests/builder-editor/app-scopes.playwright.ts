import { expect, test, type APIRequestContext } from '@playwright/test';

const LOCALE = 'ko';
const CMS_APP_ID = 'site-search';
const NO_CMS_APP_ID = 'appointments-lite';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'app-scopes';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function installApp(request: APIRequestContext, appId: string, scope: string) {
  const response = await request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: { appId },
  });
  expect([200, 201]).toContain(response.status());
}

async function disableApp(request: APIRequestContext, appId: string, scope: string) {
  const response = await request.patch(`/api/builder/apps/installations/${appId}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: { status: 'disabled' },
  });
  expect(response.status()).toBe(200);
}

async function uninstallIfPresent(request: APIRequestContext, appId: string, scope: string) {
  await request.delete(`/api/builder/apps/installations/${appId}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

test('installed app scope gate allows declared CMS read access and blocks missing or disabled scopes', async ({ page }) => {
  const token = Date.now().toString(36);
  await uninstallIfPresent(page.request, CMS_APP_ID, `app-scope-clean-cms-before-${token}`);
  await uninstallIfPresent(page.request, NO_CMS_APP_ID, `app-scope-clean-no-cms-before-${token}`);

  try {
    await installApp(page.request, CMS_APP_ID, `app-scope-install-cms-${token}`);
    const allowedResponse = await page.request.get(
      `/api/builder/apps/installations/${CMS_APP_ID}/cms/collections?locale=${LOCALE}`,
      { headers: mutationHeaders(`app-scope-allow-${token}`) },
    );
    expect(allowedResponse.status()).toBe(200);
    const allowed = await allowedResponse.json() as { ok?: boolean; scope?: string; editableCollections?: unknown[] };
    expect(allowed.ok).toBe(true);
    expect(allowed.scope).toBe('cms:read');
    expect(Array.isArray(allowed.editableCollections)).toBe(true);

    await installApp(page.request, NO_CMS_APP_ID, `app-scope-install-no-cms-${token}`);
    const deniedScopeResponse = await page.request.get(
      `/api/builder/apps/installations/${NO_CMS_APP_ID}/cms/collections?locale=${LOCALE}`,
      { headers: mutationHeaders(`app-scope-deny-scope-${token}`) },
    );
    expect(deniedScopeResponse.status()).toBe(403);
    const deniedScopePayload = await deniedScopeResponse.json() as { ok?: boolean; error?: string; errorCode?: string };
    expect(deniedScopePayload.ok).toBe(false);
    expect(deniedScopePayload.errorCode ?? deniedScopePayload.error).toBe('app_scope_not_granted');

    await disableApp(page.request, CMS_APP_ID, `app-scope-disable-${token}`);
    const disabledResponse = await page.request.get(
      `/api/builder/apps/installations/${CMS_APP_ID}/cms/collections?locale=${LOCALE}`,
      { headers: mutationHeaders(`app-scope-deny-disabled-${token}`) },
    );
    expect(disabledResponse.status()).toBe(403);
    const disabledPayload = await disabledResponse.json() as { ok?: boolean; error?: string; errorCode?: string };
    expect(disabledPayload.ok).toBe(false);
    expect(disabledPayload.errorCode ?? disabledPayload.error).toBe('app_disabled');
  } finally {
    await uninstallIfPresent(page.request, CMS_APP_ID, `app-scope-clean-cms-after-${token}`);
    await uninstallIfPresent(page.request, NO_CMS_APP_ID, `app-scope-clean-no-cms-after-${token}`);
  }
});
