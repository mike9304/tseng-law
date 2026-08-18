import { expect, type APIRequestContext } from '@playwright/test';
import type { Locale } from '@/lib/locales';
import {
  BUILDER_AUTHORING_LOCALES,
  createIsolatedHomeDecomposeBody,
  createIsolatedHomePublishBody,
  createIsolatedHomeSeedBody,
} from '@/lib/builder/site/isolated-locale-home';

export { BUILDER_AUTHORING_LOCALES };

type JsonRecord = Record<string, unknown>;

async function postJson(
  request: APIRequestContext,
  path: string,
  data: unknown,
): Promise<{ status: number; body: JsonRecord }> {
  const response = await request.post(path, {
    headers: { 'content-type': 'application/json' },
    data,
    timeout: 90_000,
  });
  const body = (await response.json().catch(() => ({}))) as JsonRecord;
  return { status: response.status(), body };
}

export async function seedSiteLocale(request: APIRequestContext, locale: Locale): Promise<void> {
  const { status, body } = await postJson(
    request,
    `/api/builder/site/seed?locale=${locale}`,
    createIsolatedHomeSeedBody(locale),
  );
  expect(status, `seed ${locale}: ${JSON.stringify(body)}`).toBe(200);
  expect(body).toMatchObject({ ok: true, locale });
}

export async function decomposeHomeLocale(
  request: APIRequestContext,
  locale: Locale,
): Promise<{ pageId: string }> {
  const { status, body } = await postJson(
    request,
    `/api/builder/site/pages/decompose?locale=${locale}`,
    createIsolatedHomeDecomposeBody(locale),
  );
  expect(status, `decompose ${locale}: ${JSON.stringify(body)}`).toBe(200);
  expect(body).toMatchObject({ ok: true, locale, slug: '' });
  const pageId = typeof body.pageId === 'string' ? body.pageId : '';
  expect(pageId).not.toBe('');
  return { pageId };
}

export async function publishHomeLocale(
  request: APIRequestContext,
  pageId: string,
  locale: Locale,
): Promise<void> {
  const { status, body } = await postJson(
    request,
    '/api/builder/publish/atomic',
    createIsolatedHomePublishBody(pageId, locale),
  );
  expect(status, `publish ${locale}: ${JSON.stringify(body)}`).toBe(200);
  expect(body.ok).toBe(true);
}

export async function seedDecomposePublishHome(
  request: APIRequestContext,
  locale: Locale,
): Promise<{ pageId: string }> {
  await seedSiteLocale(request, locale);
  const decomposed = await decomposeHomeLocale(request, locale);
  await publishHomeLocale(request, decomposed.pageId, locale);
  return decomposed;
}

export async function seedDecomposePublishBuilderHomes(
  request: APIRequestContext,
): Promise<Record<Locale, { pageId: string }>> {
  const results = {} as Record<Locale, { pageId: string }>;
  for (const locale of BUILDER_AUTHORING_LOCALES) {
    results[locale] = await seedDecomposePublishHome(request, locale);
  }
  return results;
}
