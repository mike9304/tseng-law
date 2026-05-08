import { expect, test, type APIRequestContext } from '@playwright/test';

type TestDocument = {
  version: 1;
  locale: 'ko';
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

const baseContainerContent = {
  background: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  padding: 0,
  layoutMode: 'absolute',
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'published-interactions';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

function containerNode(
  id: string,
  rect: Record<string, number>,
  className: string,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    id,
    kind: 'container',
    rect,
    style: { ...baseStyle, borderRadius: 12 },
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      ...baseContainerContent,
      label: id,
      className,
      as: 'div',
      ...extra,
    },
  };
}

function textNode(id: string, parentId: string, y: number, text: string): Record<string, unknown> {
  return {
    id,
    kind: 'text',
    parentId,
    rect: { x: 24, y, width: 640, height: 28 },
    style: baseStyle,
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      fontSize: 18,
      color: '#0f172a',
      fontWeight: 'medium',
      align: 'left',
      lineHeight: 1.3,
      letterSpacing: 0,
      fontFamily: 'system-ui',
      as: 'p',
    },
  };
}

function makePublishedInteractionDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  const rootId = `interaction-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `published-interactions-${token}`,
    stageWidth: 1280,
    stageHeight: 900,
    nodes: [
      containerNode(rootId, { x: 0, y: 0, width: 1280, height: 900 }, 'section section--light', {
        as: 'main',
      }),
      {
        ...containerNode('home-services-card-0', { x: 80, y: 80, width: 920, height: 170 }, 'services-detail-card', {
          as: 'article',
          htmlId: 'corp',
        }),
        parentId: rootId,
        zIndex: 1,
      },
      {
        ...containerNode('home-services-card-0-toggle', { x: 0, y: 0, width: 920, height: 70 }, 'services-detail-toggle'),
        parentId: 'home-services-card-0',
      },
      textNode('home-services-card-0-title', 'home-services-card-0-toggle', 20, '기업 법무'),
      {
        ...containerNode('home-services-card-0-body', { x: 0, y: 72, width: 920, height: 80 }, 'services-detail-body'),
        parentId: 'home-services-card-0',
      },
      textNode('home-services-card-0-detail', 'home-services-card-0-body', 12, '계약 검토와 분쟁 대응을 한 번에 봅니다.'),
      {
        ...containerNode('home-services-card-1', { x: 80, y: 270, width: 920, height: 170 }, 'services-detail-card', {
          as: 'article',
        }),
        parentId: rootId,
        zIndex: 2,
      },
      {
        ...containerNode('home-services-card-1-toggle', { x: 0, y: 0, width: 920, height: 70 }, 'services-detail-toggle'),
        parentId: 'home-services-card-1',
      },
      textNode('home-services-card-1-title', 'home-services-card-1-toggle', 20, '국제 소송'),
      {
        ...containerNode('home-services-card-1-body', { x: 0, y: 72, width: 920, height: 80 }, 'services-detail-body'),
        parentId: 'home-services-card-1',
      },
      textNode('home-services-card-1-detail', 'home-services-card-1-body', 12, '국경 간 소송 전략을 설계합니다.'),
      {
        ...containerNode('home-faq-item-0', { x: 80, y: 500, width: 920, height: 130 }, 'faq-item', {
          as: 'article',
        }),
        parentId: rootId,
        zIndex: 3,
      },
      {
        ...containerNode('home-faq-item-0-question', { x: 0, y: 0, width: 920, height: 58 }, 'faq-question'),
        parentId: 'home-faq-item-0',
      },
      textNode('home-faq-item-0-question-text', 'home-faq-item-0-question', 18, '상담은 어떻게 예약하나요?'),
      {
        ...containerNode('home-faq-item-0-answer-wrap', { x: 0, y: 58, width: 920, height: 68 }, 'faq-answer-wrap'),
        parentId: 'home-faq-item-0',
      },
      textNode('home-faq-item-0-answer', 'home-faq-item-0-answer-wrap', 12, '전화나 온라인 문의로 예약할 수 있습니다.'),
    ],
  };
}

async function createBuilderPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  document: TestDocument,
): Promise<string> {
  let response: Awaited<ReturnType<APIRequestContext['post']>> | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await request.post('/api/builder/site/pages', {
      data: { locale: 'ko', slug, title, document },
      headers: mutationHeaders(slug),
    });
    if (!(await waitForRateLimit(response))) break;
  }
  expect(response).toBeTruthy();
  response = response!;
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

test.describe('/ko published builder interactions', () => {
  test('keeps services and FAQ sections interactive after publish', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-published-interactions-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Published Interactions ${token}`,
        makePublishedInteractionDocument(token),
      );

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(slug),
        data: {},
      });
      expect(publishResponse.status()).toBe(200);

      const htmlResponse = await page.request.get(`/ko/${slug}`);
      expect(htmlResponse.status()).toBe(200);
      const html = await htmlResponse.text();
      expect(html).toContain('home-services-card-0');
      expect(html).toContain('home-faq-item-0');

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });

      const service0 = page.locator('[data-node-id="home-services-card-0"]').first();
      const service1 = page.locator('[data-node-id="home-services-card-1"]').first();
      await expect(service0.locator('.services-detail-body')).not.toHaveClass(/is-open/);
      await service0.locator('.services-detail-toggle').click();
      await expect(service0.locator('.services-detail-body')).toHaveClass(/is-open/);
      await expect(service0.locator('.services-detail-toggle')).toHaveAttribute('aria-expanded', 'true');
      await service1.locator('.services-detail-toggle').click();
      await expect(service1.locator('.services-detail-body')).toHaveClass(/is-open/);
      await expect(service0.locator('.services-detail-body')).not.toHaveClass(/is-open/);

      const faq = page.locator('[data-node-id="home-faq-item-0"]').first();
      await expect(faq.locator('.faq-answer-wrap')).not.toHaveClass(/is-open/);
      await faq.locator('.faq-question').click();
      await expect(faq.locator('.faq-answer-wrap')).toHaveClass(/is-open/);
      await expect(faq.locator('.faq-question')).toHaveAttribute('aria-expanded', 'true');
      await faq.locator('.faq-question').click();
      await expect(faq.locator('.faq-answer-wrap')).not.toHaveClass(/is-open/);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });
});
