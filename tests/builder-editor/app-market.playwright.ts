import { expect, test, type APIRequestContext } from '@playwright/test';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';

const LOCALE = 'ko';
const APP_ID = 'site-search';
const BOOKING_APP_ID = 'appointments-lite';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'app-market';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function uninstallIfPresent(request: APIRequestContext, scope: string, appId = APP_ID) {
  await request.delete(`/api/builder/apps/installations/${appId}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

async function setInstalledAppVersion(appId: string, version: string) {
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, LOCALE);
  const now = new Date().toISOString();
  await writeSiteDocument({
    ...site,
    installedApps: (site.installedApps ?? []).map((app) => (
      app.appId === appId
        ? {
          ...app,
          version,
          updatedAt: now,
          audit: app.audit ?? [],
        }
        : app
    )),
    updatedAt: now,
  });
}

test('/ko/admin-builder/apps supports catalog search and app lifecycle controls', async ({ page }) => {
  const token = Date.now().toString(36);
  await uninstallIfPresent(page.request, `app-market-cleanup-before-${token}`);

  try {
    await page.goto(`/${LOCALE}/admin-builder/apps?appMarket=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-app-market]')).toBeVisible();
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toBeVisible();

    await page.locator('[data-app-market-search]').fill('search');
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toBeVisible();
    await page.locator('[data-app-market-category]').selectOption('utility');
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toBeVisible();

    await page.locator(`[data-app-action="install-${APP_ID}"]`).click();
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toHaveAttribute('data-app-status', 'enabled');
    await expect(page.locator(`[data-app-action="disable-${APP_ID}"]`)).toBeVisible();
    await expect(page.locator(`[data-app-version-health="${APP_ID}"]`)).toHaveAttribute('data-app-update-state', 'current');
    await expect(page.locator(`[data-app-version-health="${APP_ID}"]`)).toHaveAttribute('data-app-compat-state', 'compatible');
    await expect(page.locator(`[data-app-version-health="${APP_ID}"]`)).toHaveAttribute('data-app-rollback-state', 'unavailable');
    await expect(page.locator(`[data-app-version-health="${APP_ID}"]`)).toContainText('Installed v1.0.0');
    await expect(page.locator(`[data-app-migration-summary="${APP_ID}"]`)).toContainText('1/1 migrations applied');
    await expect(page.locator(`[data-app-migration-summary="${APP_ID}"]`)).toContainText('search-install-v1');
    await expect(page.locator('[data-native-app-dashboard]')).toBeVisible();
    await expect(page.locator(`[data-native-app-dashboard-card="${APP_ID}"]`)).toHaveAttribute('data-native-app-dashboard-status', 'enabled');
    await expect(page.locator(`[data-native-app-dashboard-card="${APP_ID}"]`)).toHaveAttribute('data-native-app-dashboard-update', 'current');
    await expect(page.locator(`[data-native-app-admin-link="${APP_ID}:search-admin"]`)).toHaveAttribute('href', `/${LOCALE}/admin-builder/search`);
    await expect(page.locator(`[data-native-app-settings-link="${APP_ID}"]`)).toHaveAttribute('href', `#settings-${APP_ID}`);

    const rollbackUnavailableResponse = await page.request.patch(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
      headers: mutationHeaders(`app-market-rollback-unavailable-${token}`),
      data: { action: 'rollback' },
      failOnStatusCode: false,
    });
    expect(rollbackUnavailableResponse.status()).toBe(409);
    const rollbackUnavailablePayload = await rollbackUnavailableResponse.json() as { error?: string };
    expect(rollbackUnavailablePayload.error).toBe('app_rollback_unavailable');

    await setInstalledAppVersion(APP_ID, '0.9.0');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-native-app-dashboard-card="${APP_ID}"]`)).toHaveAttribute('data-native-app-dashboard-update', 'available');
    await expect(page.locator(`[data-native-app-update-action="${APP_ID}"]`)).toBeVisible();
    await expect(page.locator(`[data-app-action="update-${APP_ID}"]`)).toBeVisible();
    await page.locator(`[data-app-action="update-${APP_ID}"]`).click();
    await expect(page.locator(`[data-app-version-health="${APP_ID}"]`)).toHaveAttribute('data-app-update-state', 'current');
    await expect(page.locator(`[data-app-version-health="${APP_ID}"]`)).toHaveAttribute('data-app-rollback-state', 'available');
    await expect(page.locator(`[data-native-app-dashboard-card="${APP_ID}"]`)).toHaveAttribute('data-native-app-dashboard-update', 'current');
    await expect(page.locator(`[data-app-action="update-${APP_ID}"]`)).toHaveCount(0);

    const placeholder = `Search Taiwan law ${token}`;
    await page.locator(`[data-app-setting-field="${APP_ID}:placeholder"]`).fill(placeholder);
    await page.locator(`[data-app-setting-field="${APP_ID}:include-cms"]`).uncheck();
    await page.locator(`[data-app-settings-save="${APP_ID}"]`).click();
    await expect(page.getByText('settings saved')).toBeVisible();

    const settingsResponse = await page.request.get(`/api/builder/apps/installations?locale=${LOCALE}`, {
      headers: mutationHeaders(`app-market-settings-read-${token}`),
    });
    expect(settingsResponse.status()).toBe(200);
    const settingsPayload = await settingsResponse.json() as {
      entries?: Array<{
        manifest: { appId: string };
        installation?: { settings?: Record<string, unknown> };
      }>;
    };
    const settingsEntry = settingsPayload.entries?.find((entry) => entry.manifest.appId === APP_ID);
    expect(settingsEntry?.installation?.settings).toMatchObject({
      placeholder,
      'include-cms': false,
    });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toHaveAttribute('data-app-status', 'enabled');
    await expect(page.locator(`[data-app-setting-field="${APP_ID}:placeholder"]`)).toHaveValue(placeholder);
    await expect(page.locator(`[data-app-setting-field="${APP_ID}:include-cms"]`)).not.toBeChecked();

    await page.locator('[data-app-market-status-filter]').selectOption('enabled');
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toBeVisible();

    const installedResponse = await page.request.get(`/api/builder/apps/installations?locale=${LOCALE}`, {
      headers: mutationHeaders(`app-market-read-${token}`),
    });
    expect(installedResponse.status()).toBe(200);
    const installedPayload = await installedResponse.json() as {
      entries?: Array<{
        manifest: { appId: string };
        installation?: {
          status: string;
          audit: Array<{ type: string }>;
          migrations?: Array<{ migrationId: string; status: string; toVersion: string }>;
        };
        versionState?: {
          installedVersion?: string;
          latestVersion: string;
          updateAvailable: boolean;
          compatibility: string;
          canRollback: boolean;
        };
      }>;
    };
    const installedEntry = installedPayload.entries?.find((entry) => entry.manifest.appId === APP_ID);
    expect(installedEntry?.installation).toMatchObject({
      status: 'enabled',
      audit: expect.arrayContaining([expect.objectContaining({ type: 'installed' })]),
      migrations: [
        expect.objectContaining({
          migrationId: 'search-install-v1',
          status: 'applied',
          toVersion: '1.0.0',
        }),
      ],
    });
    expect(installedEntry?.versionState).toMatchObject({
      installedVersion: '1.0.0',
      latestVersion: '1.0.0',
      updateAvailable: false,
      compatibility: 'compatible',
      canRollback: true,
      rollbackVersion: '0.9.0',
    });

    await page.locator(`[data-app-action="disable-${APP_ID}"]`).click();
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toBeHidden();

    await page.locator('[data-app-market-status-filter]').selectOption('disabled');
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toBeVisible();
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toHaveAttribute('data-app-status', 'disabled');

    await page.locator(`[data-app-action="enable-${APP_ID}"]`).click();
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toBeHidden();
    await page.locator('[data-app-market-status-filter]').selectOption('enabled');
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toBeVisible();
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toHaveAttribute('data-app-status', 'enabled');

    await page.locator('[data-app-market-status-filter]').selectOption('installed');
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toBeVisible();
    await expect(page.locator(`[data-app-uninstall-cleanup="${APP_ID}"]`)).toHaveValue('keep-data');

    await page.locator(`[data-app-action="uninstall-${APP_ID}"]`).click();
    await page.locator('[data-app-market-status-filter]').selectOption('not-installed');
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toHaveAttribute('data-app-status', 'not-installed');
    await expect(page.locator(`[data-app-uninstall-summary="${APP_ID}"]`)).toHaveAttribute('data-app-uninstall-reversible', 'true');
    await expect(page.locator(`[data-app-uninstall-summary="${APP_ID}"]`)).toContainText('Data kept for restore');
    await expect(page.locator(`[data-app-action="restore-${APP_ID}"]`)).toBeVisible();

    await page.locator(`[data-app-action="restore-${APP_ID}"]`).click();
    await page.locator('[data-app-market-status-filter]').selectOption('enabled');
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toHaveAttribute('data-app-status', 'enabled');
    await expect(page.locator(`[data-app-setting-field="${APP_ID}:placeholder"]`)).toHaveValue(placeholder);

    await page.locator(`[data-app-uninstall-cleanup="${APP_ID}"]`).selectOption('remove-data');
    await page.locator(`[data-app-action="uninstall-${APP_ID}"]`).click();
    await page.locator('[data-app-market-status-filter]').selectOption('not-installed');
    await expect(page.locator(`[data-app-card="${APP_ID}"]`)).toHaveAttribute('data-app-status', 'not-installed');
    await expect(page.locator(`[data-app-uninstall-summary="${APP_ID}"]`)).toHaveAttribute('data-app-uninstall-reversible', 'false');
    await expect(page.locator(`[data-app-uninstall-summary="${APP_ID}"]`)).toContainText('Data removed');
    await expect(page.locator(`[data-app-action="restore-${APP_ID}"]`)).toHaveCount(0);
  } finally {
    await uninstallIfPresent(page.request, `app-market-cleanup-after-${token}`);
  }
});

test('/ko/admin-builder/apps exposes native app admin surfaces from the unified dashboard', async ({ page }) => {
  const token = Date.now().toString(36);
  await uninstallIfPresent(page.request, `app-market-native-cleanup-before-${token}`, BOOKING_APP_ID);

  try {
    const installResponse = await page.request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
      headers: mutationHeaders(`app-market-native-install-${token}`),
      data: { appId: BOOKING_APP_ID },
    });
    expect(installResponse.status()).toBe(201);

    await page.goto(`/${LOCALE}/admin-builder/apps?nativeAppDashboard=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-native-app-dashboard]')).toBeVisible();
    await expect(page.locator(`[data-native-app-dashboard-card="${BOOKING_APP_ID}"]`)).toHaveAttribute('data-native-app-dashboard-status', 'enabled');
    await expect(page.locator(`[data-native-app-admin-link="${BOOKING_APP_ID}:appointments-dashboard"]`)).toHaveAttribute('href', `/${LOCALE}/admin-builder/bookings/dashboard`);
    await expect(page.locator(`[data-native-app-admin-link="${BOOKING_APP_ID}:appointments-services"]`)).toHaveAttribute('href', `/${LOCALE}/admin-builder/bookings/services`);
    await expect(page.locator(`[data-native-app-admin-link="${BOOKING_APP_ID}:appointments-calendar"]`)).toHaveAttribute('href', `/${LOCALE}/admin-builder/bookings/calendar`);
    await expect(page.locator(`[data-native-app-settings-link="${BOOKING_APP_ID}"]`)).toHaveAttribute('href', `#settings-${BOOKING_APP_ID}`);
  } finally {
    await uninstallIfPresent(page.request, `app-market-native-cleanup-after-${token}`, BOOKING_APP_ID);
  }
});
