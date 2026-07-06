import { expect, test, type APIRequestContext } from '@playwright/test';

const LOCALE = 'ko';
const APP_ID = 'native-events';

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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'events-app';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function installEventsApp(request: APIRequestContext, token: string) {
  const response = await request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
    headers: mutationHeaders(`f45-install-${token}`),
    data: { appId: APP_ID },
  });
  expect([200, 201]).toContain(response.status());
}

async function uninstallEventsApp(request: APIRequestContext, token: string) {
  await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(`f45-uninstall-${token}`),
    failOnStatusCode: false,
  });
}

async function createEvent(request: APIRequestContext, token: string) {
  const slug = `f45-event-${token}`;
  const response = await request.post('/api/builder/events', {
    headers: mutationHeaders(`f45-event-create-${token}`),
    data: {
      locale: LOCALE,
      title: `F45 이벤트 앱 세미나 ${token}`,
      slug,
      description: `F45 Events app public page and widget verification ${token}`,
      date: '2026-06-18',
      time: '14:00',
      location: '타이베이 오피스',
      category: 'seminar',
      capacity: 12,
      status: 'published',
      rsvpEnabled: true,
      ticketType: 'paid',
      ticketPriceTwd: 1200,
      ticketCurrency: 'TWD',
    },
  });
  expect(response.status()).toBe(201);
  const json = await response.json() as { ok?: boolean; event?: { eventId: string; slug: string }; error?: string };
  expect(json.ok, json.error).toBe(true);
  expect(json.event?.eventId).toBeTruthy();
  return json.event!;
}

async function deleteEvent(request: APIRequestContext, eventId: string, token: string) {
  await request.delete(`/api/builder/events/${eventId}`, {
    headers: mutationHeaders(`f45-event-delete-${token}`),
    failOnStatusCode: false,
  });
}

function widgetNode(
  id: string,
  kind: string,
  y: number,
  height: number,
  appWidget: { appId: string; widgetId: string },
  content: Record<string, unknown>,
) {
  return {
    id,
    kind,
    rect: { x: 80, y, width: 1120, height },
    style: baseStyle,
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    appWidget,
    content,
  };
}

function makePublishedEventsWidgetDocument(eventId: string, token: string) {
  return {
    version: 1,
    locale: LOCALE,
    updatedAt: new Date().toISOString(),
    updatedBy: `f45-events-widgets-${token}`,
    stageWidth: 1280,
    stageHeight: 1680,
    nodes: [
      widgetNode('f45-event-list', 'event-list', 40, 560, { appId: APP_ID, widgetId: 'events-list' }, {
        layout: 'cards',
        limit: 6,
        timeFilter: 'upcoming',
        showDescription: true,
        showCapacity: true,
        showRsvp: true,
        columns: 3,
      }),
      widgetNode('f45-event-calendar', 'event-calendar', 660, 500, { appId: APP_ID, widgetId: 'events-calendar' }, {
        months: 3,
        showPast: false,
        showCapacity: true,
      }),
      widgetNode('f45-event-rsvp', 'event-rsvp', 1220, 420, { appId: APP_ID, widgetId: 'event-rsvp' }, {
        eventId,
        title: '이벤트 신청',
        showTicketInfo: true,
        successMessage: `F45 신청 완료 ${token}`,
      }),
    ],
  };
}

async function createPublishedPage(request: APIRequestContext, slug: string, eventId: string, token: string): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(`f45-page-create-${token}`),
    data: {
      locale: LOCALE,
      slug,
      title: `F45 Events Widgets ${token}`,
      document: makePublishedEventsWidgetDocument(eventId, token),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  expect(created.pageId).toBeTruthy();

  const publishResponse = await request.post(`/api/builder/site/pages/${created.pageId}/publish?locale=${LOCALE}`, {
    headers: mutationHeaders(`f45-page-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);
  return created.pageId!;
}

test('native Events app publishes admin-created event pages, widgets, calendar, and RSVP', async ({ page }) => {
  const token = Date.now().toString(36);
  const pageSlug = `f45-events-widgets-${token}`;
  let event: { eventId: string; slug: string } | null = null;
  let pageId: string | null = null;

  await uninstallEventsApp(page.request, token);

  try {
    await installEventsApp(page.request, token);
    event = await createEvent(page.request, token);
    pageId = await createPublishedPage(page.request, pageSlug, event.eventId, token);

    const adminResponse = await page.request.get(`/api/builder/events?locale=${LOCALE}&scope=all&status=all&time=all&q=${token}`);
    expect(adminResponse.status()).toBe(200);
    const adminJson = await adminResponse.json() as { total?: number; error?: string };
    expect(adminJson.total ?? 0, adminJson.error).toBeGreaterThan(0);

    await page.goto(`/${LOCALE}/events`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-public-events-page="true"]')).toContainText('이벤트');

    await page.goto(`/${LOCALE}/events/${event.slug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-public-event-detail="true"]')).toContainText(`F45 이벤트 앱 세미나 ${token}`);
    await expect(page.locator('[data-public-event-detail="true"]')).toContainText('이벤트 목록으로');
    await expect(page.locator('[data-public-event-detail="true"]')).toContainText('이벤트');
    await expect(page.locator('[data-builder-event-rsvp="true"]')).toContainText('이벤트 신청');
    await expect(page.locator('[data-builder-event-rsvp="true"]')).toContainText('TWD 1,200');
    await page.locator('[data-builder-event-rsvp="true"] input[name="name"]').fill('F45 RSVP User');
    await page.locator('[data-builder-event-rsvp="true"] input[name="email"]').fill(`f45-${token}@example.com`);
    await page.locator('[data-builder-event-rsvp="true"] input[name="ticketQuantity"]').fill('1');
    await page.locator('[data-builder-event-rsvp="true"] button[type="submit"]').click();
    await expect(page.locator('[data-builder-event-rsvp="true"]')).toContainText('신청이 접수되었습니다.');

    const afterRsvp = await page.request.get(`/api/builder/events/${event.eventId}?scope=all`);
    expect(afterRsvp.status()).toBe(200);
    expect(((await afterRsvp.json()) as { event?: { registeredCount?: number } }).event?.registeredCount).toBe(1);

    await page.goto(`/${LOCALE}/${pageSlug}`, { waitUntil: 'domcontentloaded' });
    for (const nodeId of ['f45-event-list', 'f45-event-calendar', 'f45-event-rsvp']) {
      await expect(page.locator(`[data-node-id="${nodeId}"]`)).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    }
    await expect(page.locator('[data-builder-event-list="true"]')).toContainText(`F45 이벤트 앱 세미나 ${token}`);
    await expect(page.locator('[data-builder-event-calendar="true"]')).toContainText(`F45 이벤트 앱 세미나 ${token}`);
    await expect(page.locator('[data-builder-event-rsvp="true"]')).toContainText(`F45 이벤트 앱 세미나 ${token}`);
    await expect(
      page.locator('[data-builder-event-list="true"] a').filter({ hasText: `F45 이벤트 앱 세미나 ${token}` }).first(),
    ).toHaveAttribute('href', `/${LOCALE}/events/${event.slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${LOCALE}`, {
        headers: mutationHeaders(`f45-page-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    if (event) await deleteEvent(page.request, event.eventId, token);
    await uninstallEventsApp(page.request, token);
  }
});
