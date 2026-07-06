import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { slugifyFaqQuestion } from '@/lib/builder/faq/faq-engine';

export const LOCALE = 'ko';

const APP_ID = 'faq-manager';
const AUTH_HEADER = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

type FaqStatus = 'draft' | 'published';

type CreateFaqOverrides = Partial<{
  readonly question: string;
  readonly answer: string;
  readonly categoryId: string;
  readonly tags: readonly string[];
  readonly status: FaqStatus;
  readonly sortOrder: number;
  readonly schemaEnabled: boolean;
}>;

export type CreatedFaq = {
  readonly faqId: string;
  readonly slug: string;
  readonly question: string;
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
} as const;

export function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'faq-app';
  return {
    Authorization: AUTH_HEADER,
    'x-forwarded-for': `pw-${safeScope}`,
  };
}

export function expectPresent<T>(value: T | null | undefined, message: string): asserts value is T {
  expect(value, message).toBeTruthy();
}

function expectTeardownStatus(response: APIResponse, action: string): void {
  expect([200, 204, 404], action).toContain(response.status());
}

export async function installFaqApp(request: APIRequestContext, token: string): Promise<void> {
  const response = await request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
    headers: mutationHeaders(`f47-install-${token}`),
    data: { appId: APP_ID },
  });
  expect([200, 201]).toContain(response.status());
}

export async function uninstallFaqApp(request: APIRequestContext, token: string): Promise<void> {
  const response = await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(`f47-uninstall-${token}`),
    failOnStatusCode: false,
    timeout: 10000,
  });
  expectTeardownStatus(response, 'uninstall FAQ app teardown');
}

export async function createFaq(
  request: APIRequestContext,
  token: string,
  status: FaqStatus = 'published',
): Promise<CreatedFaq> {
  return createFaqWithOverrides(request, token, {}, status);
}

export async function createFaqWithOverrides(
  request: APIRequestContext,
  token: string,
  overrides: CreateFaqOverrides,
  status: FaqStatus = 'published',
): Promise<CreatedFaq> {
  const question = overrides.question ?? `F47 FAQ 앱 검색 질문 ${token}`;
  const answer = overrides.answer ?? `F47 FAQ 앱 공개 답변 ${token} category search schema`;
  const categoryId = overrides.categoryId ?? 'consultation';
  const tags = overrides.tags ?? ['f47', token];
  const nextStatus = overrides.status ?? status;
  const sortOrder = overrides.sortOrder ?? 3;
  const schemaEnabled = overrides.schemaEnabled ?? true;
  const response = await request.post('/api/builder/faq', {
    headers: mutationHeaders(`f47-faq-create-${token}-${status}`),
    data: {
      locale: LOCALE,
      question,
      answer,
      categoryId,
      tags,
      status: nextStatus,
      sortOrder,
      schemaEnabled,
    },
  });
  expect(response.status()).toBe(201);
  const json = await response.json() as { ok?: boolean; item?: { faqId: string }; error?: string };
  expect(json.ok, json.error).toBe(true);
  const faqId = json.item?.faqId;
  expectPresent(faqId, json.error ?? 'created FAQ id');
  return {
    faqId,
    slug: slugifyFaqQuestion(question),
    question,
  };
}

export async function deleteFaq(request: APIRequestContext, faqId: string, token: string): Promise<void> {
  const response = await request.delete(`/api/builder/faq/${faqId}`, {
    headers: mutationHeaders(`f47-faq-delete-${token}`),
    failOnStatusCode: false,
    timeout: 10000,
  });
  expectTeardownStatus(response, `delete FAQ teardown ${faqId}`);
}

type AppWidgetRef = {
  readonly appId: string;
  readonly widgetId: string;
};

function widgetNode(
  id: string,
  kind: string,
  y: number,
  height: number,
  appWidget: AppWidgetRef,
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

function makePublishedFaqWidgetDocument(token: string) {
  return {
    version: 1,
    locale: LOCALE,
    updatedAt: new Date().toISOString(),
    updatedBy: `f47-faq-widgets-${token}`,
    stageWidth: 1280,
    stageHeight: 780,
    nodes: [
      widgetNode('f47-faq-list', 'faqList', 40, 560, { appId: APP_ID, widgetId: 'faq-list' }, {
        source: 'app',
        categoryId: 'consultation',
        showSearch: true,
        showCategoryFilter: true,
        expandFirst: true,
        schemaEnabled: true,
        limit: 50,
      }),
      widgetNode('f47-faq-search', 'site-search', 640, 64, { appId: APP_ID, widgetId: 'faq-search' }, {
        placeholder: 'FAQ 검색',
        submitLabel: '검색',
        showResultsInline: true,
        kinds: ['faq'],
        locale: '',
        maxResults: 8,
      }),
    ],
  };
}

export async function createPublishedPage(
  request: APIRequestContext,
  slug: string,
  token: string,
): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(`f47-page-create-${token}`),
    data: {
      locale: LOCALE,
      slug,
      title: `F47 FAQ Widgets ${token}`,
      document: makePublishedFaqWidgetDocument(token),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  const pageId = created.pageId;
  expectPresent(pageId, created.error ?? 'created builder page id');

  const publishResponse = await request.post(`/api/builder/site/pages/${pageId}/publish?locale=${LOCALE}`, {
    headers: mutationHeaders(`f47-page-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);
  return pageId;
}

export async function deletePublishedPage(
  request: APIRequestContext,
  pageId: string,
  token: string,
): Promise<void> {
  const response = await request.delete(`/api/builder/site/pages/${pageId}?locale=${LOCALE}`, {
    headers: mutationHeaders(`f47-page-delete-${token}`),
    failOnStatusCode: false,
    timeout: 10000,
  });
  expectTeardownStatus(response, `delete builder page teardown ${pageId}`);
}

export async function rebuildSearch(request: APIRequestContext, token: string): Promise<void> {
  const response = await request.post('/api/builder/search/rebuild', {
    headers: mutationHeaders(`f47-search-rebuild-${token}`),
  });
  expect(response.status()).toBe(200);
}
