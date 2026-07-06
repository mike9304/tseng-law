import { rm } from 'fs/promises';
import path from 'path';
import { expect, test, type Page } from '@playwright/test';

const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

const liveChatRoot = path.join(process.cwd(), 'runtime-data', 'live-chat');

async function createConversation(page: Page, tokenSeed: string, payload: { visitorName?: string; visitorEmail?: string; pagePath: string; message: string; forwardedFor: string; }) {
  const response = await page.request.post('/api/live-chat/start', {
    headers: { 'content-type': 'application/json', 'x-forwarded-for': payload.forwardedFor },
    data: {
      visitorName: payload.visitorName,
      visitorEmail: payload.visitorEmail,
      pagePath: payload.pagePath,
      message: payload.message,
    },
  });
  expect(response.ok(), `${tokenSeed} conversation should be created`).toBe(true);
  const body = (await response.json()) as { conversationId: string; visitorToken: string };
  expect(body.conversationId).toBeTruthy();
  expect(body.visitorToken).toBeTruthy();
  return body;
}

test.describe('/admin-builder/inbox localization', () => {
  test('renders localized inbox shell and seeded conversations in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);
    await rm(liveChatRoot, { recursive: true, force: true });
    await page.setExtraHTTPHeaders({ Authorization: authHeader });

    const closedSeed = await createConversation(page, 'closed', {
      pagePath: '/zh-hant/contact',
      message: '첫 번째 대화',
      forwardedFor: '127.0.0.71',
    });
    const openSeed = await createConversation(page, 'open', {
      visitorName: '김민지',
      visitorEmail: 'minji@example.com',
      pagePath: '/ko/services',
      message: '두 번째 대화',
      forwardedFor: '127.0.0.72',
    });

    const closeResponse = await page.request.patch(`/api/builder/live-chat/${closedSeed.conversationId}`, {
      headers: { Authorization: authHeader, 'content-type': 'application/json' },
      data: { status: 'closed' },
    });
    expect(closeResponse.ok(), 'closed conversation should be closable').toBe(true);

    const listResponse = await page.request.get('/api/builder/live-chat', {
      headers: { Authorization: authHeader },
    });
    expect(listResponse.ok()).toBe(true);
    const listPayload = (await listResponse.json()) as { total: number; conversations: Array<{ conversationId: string; status: string }> };
    expect(listPayload.total).toBeGreaterThanOrEqual(2);
    expect(listPayload.conversations.some((conv) => conv.conversationId === openSeed.conversationId && conv.status === 'open')).toBe(true);
    expect(listPayload.conversations.some((conv) => conv.conversationId === closedSeed.conversationId && conv.status === 'closed')).toBe(true);

    await page.goto('/ko/admin-builder/inbox', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/받은편지함/);
    await expect(page.getByRole('heading', { name: '실시간 대화' })).toBeVisible();
    await expect(page.getByText('방문자의 실시간 대화. SSE 기반 (Fluid Compute streaming). 폴링 1.5초.')).toBeVisible();
    await expect(page.locator('[data-inbox-admin-shell="true"]')).toBeVisible();
    await expect(page.getByRole('button', { name: '새로고침' })).toBeVisible();
    await expect(page.locator(`[data-inbox-conversation-item="${openSeed.conversationId}"]`)).toContainText('김민지');
    await expect(page.locator(`[data-inbox-conversation-item="${openSeed.conversationId}"]`)).toContainText('minji@example.com');
    await expect(page.locator(`[data-inbox-conversation-item="${closedSeed.conversationId}"]`)).toContainText('익명 방문자');
    await expect(page.locator(`[data-inbox-conversation-item="${closedSeed.conversationId}"] [data-inbox-status="closed"]`)).toContainText('닫힘');
    await expect(page.getByRole('button', { name: '대화 종료' })).toBeVisible();
    await expect(page.getByPlaceholder('답장 입력...')).toBeVisible();
    await expect(page.getByRole('button', { name: '보내기' })).toBeVisible();

    await page.goto('/zh-hant/admin-builder/inbox', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/收件匣/);
    await expect(page.getByRole('heading', { name: '即時對話' })).toBeVisible();
    await expect(page.getByText('訪客的即時對話。以 SSE（Fluid Compute 串流）提供，輪詢 1.5 秒。')).toBeVisible();
    await expect(page.locator('[data-inbox-admin-shell="true"]')).toBeVisible();
    await expect(page.getByRole('button', { name: '重新整理' })).toBeVisible();
    await expect(page.locator(`[data-inbox-conversation-item="${openSeed.conversationId}"]`)).toContainText('김민지');
    await expect(page.locator(`[data-inbox-conversation-item="${closedSeed.conversationId}"]`)).toContainText('匿名訪客');
    await expect(page.locator(`[data-inbox-conversation-item="${closedSeed.conversationId}"] [data-inbox-status="closed"]`)).toContainText('已關閉');
    await expect(page.getByRole('button', { name: '結束對話' })).toBeVisible();
    await expect(page.getByPlaceholder('輸入回覆...')).toBeVisible();
    await expect(page.getByRole('button', { name: '送出' })).toBeVisible();
  });
});
