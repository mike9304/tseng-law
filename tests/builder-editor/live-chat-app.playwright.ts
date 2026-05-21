import { expect, test, type APIRequestContext } from '@playwright/test';

const LOCALE = 'ko';
const APP_ID = 'live-chat';

type TestDocument = {
  version: 1;
  locale: typeof LOCALE;
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: Array<Record<string, unknown>>;
};

const baseStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'live-chat-app';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeLiveChatPageDocument(token: string): TestDocument {
  return {
    version: 1,
    locale: LOCALE,
    updatedAt: new Date().toISOString(),
    updatedBy: 'live-chat-app-playwright',
    stageWidth: 1280,
    stageHeight: 420,
    nodes: [
      {
        id: `live-chat-page-title-${token}`,
        kind: 'text',
        rect: { x: 96, y: 96, width: 680, height: 80 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Live Chat App ${token}`,
          tag: 'h1',
          fontSize: 42,
          fontFamily: 'system-ui',
          fontWeight: 'bold',
          color: '#0f172a',
          align: 'left',
          lineHeight: 1.15,
        },
      },
      {
        id: `live-chat-app-trigger-${token}`,
        kind: 'floating-chat',
        rect: { x: 96, y: 220, width: 64, height: 64 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        appWidget: {
          appId: APP_ID,
          widgetId: 'chat-launcher',
        },
        content: {
          provider: 'live-chat',
          href: '',
          label: '페이지 안 상담',
          placement: 'bottom-right',
          showLabel: true,
          color: '#1d4ed8',
        },
      },
    ],
  };
}

async function uninstallIfPresent(request: APIRequestContext, scope: string) {
  await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

async function installApp(request: APIRequestContext, scope: string) {
  const response = await request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: { appId: APP_ID },
  });
  expect([200, 201]).toContain(response.status());
}

async function updateAppSettings(request: APIRequestContext, scope: string, token: string) {
  const response = await request.put(`/api/builder/apps/installations/${APP_ID}/settings?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: {
      settings: {
        'launcher-enabled': true,
        'launcher-label': `실시간 상담 ${token}`,
        title: `대만 법률 상담 ${token}`,
        'intro-text': '방문자 문의 내용을 입력해 주세요.',
        'offline-message': '운영 시간 외에는 이메일로 이어서 답변합니다.',
        'accent-color': '#1d4ed8',
        placement: 'bottom-left',
        'email-required': true,
        'notify-email': 'chat@example.com',
      },
    },
  });
  expect(response.status()).toBe(200);
}

async function disableApp(request: APIRequestContext, scope: string) {
  const response = await request.patch(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: { status: 'disabled' },
  });
  expect(response.status()).toBe(200);
}

async function createPublishedPage(request: APIRequestContext, slug: string, token: string): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(`live-chat-create-${token}`),
    data: {
      locale: LOCALE,
      slug,
      title: `Live Chat App ${token}`,
      document: makeLiveChatPageDocument(token),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  expect(created.pageId).toBeTruthy();

  const publishResponse = await request.post(`/api/builder/site/pages/${created.pageId}/publish?locale=${LOCALE}`, {
    headers: mutationHeaders(`live-chat-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);

  return created.pageId!;
}

test('live chat app settings control the public launcher and app widget trigger', async ({ page }) => {
  const token = Date.now().toString(36);
  const slug = `live-chat-app-${token}`;
  let pageId: string | null = null;

  await uninstallIfPresent(page.request, `live-chat-clean-before-${token}`);

  try {
    await installApp(page.request, `live-chat-install-${token}`);
    await updateAppSettings(page.request, `live-chat-settings-${token}`, token);
    pageId = await createPublishedPage(page.request, slug, token);

    await page.addInitScript(() => window.localStorage.removeItem('tw_live_chat_session_v1'));
    await page.goto(`/${LOCALE}/${slug}?enabled=${token}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const launcher = page.locator('[data-builder-live-chat-widget="true"]');
    await expect(launcher).toBeVisible();
    await expect(launcher).toHaveAttribute('data-builder-live-chat-placement', 'bottom-left');
    const launcherButton = page.getByRole('button', { name: `실시간 상담 ${token} 열기` });
    await expect(launcherButton).toBeVisible();

    const appWidget = page.locator(`[data-node-id="live-chat-app-trigger-${token}"]`);
    await expect(appWidget).toHaveAttribute('data-builder-app-widget', 'app:live-chat:chat-launcher');
    await expect(appWidget).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    await appWidget.locator('[data-builder-live-chat-trigger="true"]').click();

    const dialog = page.getByRole('dialog', { name: `대만 법률 상담 ${token}` });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('방문자 문의 내용을 입력해 주세요.');
    await expect(dialog).toContainText('운영 시간 외에는 이메일로 이어서 답변합니다.');

    await dialog.getByPlaceholder('문의 내용을 입력하세요').fill('이메일 없이 시작합니다.');
    await dialog.getByRole('button', { name: '시작' }).click();
    await expect(dialog.getByRole('status')).toContainText('이메일을 입력해 주세요.');

    await dialog.getByLabel('이메일').fill(`visitor-${token}@example.com`);
    await dialog.getByPlaceholder('문의 내용을 입력하세요').fill('대만 법률 상담을 문의합니다.');
    await dialog.getByRole('button', { name: '시작' }).click();
    await expect(dialog).toContainText('대만 법률 상담을 문의합니다.');

    await disableApp(page.request, `live-chat-disable-${token}`);
    await page.goto(`/${LOCALE}/${slug}?disabled=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-builder-live-chat-widget="true"]')).toHaveCount(0);
    await expect(page.locator(`[data-node-id="live-chat-app-trigger-${token}"]`))
      .toHaveAttribute('data-builder-app-runtime-status', 'disabled');
    await expect(page.locator(`[data-node-id="live-chat-app-trigger-${token}"] [data-builder-app-runtime-placeholder="true"]`))
      .toContainText('이 기능은 일시적으로 사용할 수 없습니다.');
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${LOCALE}`, {
        headers: mutationHeaders(`live-chat-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    await uninstallIfPresent(page.request, `live-chat-clean-after-${token}`);
  }
});
