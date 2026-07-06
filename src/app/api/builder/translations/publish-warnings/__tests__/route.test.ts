import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { buildTranslationPublishWarningsPayload } from '@/lib/builder/translations/publish-warnings';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'translator@example.test' })),
}));

vi.mock('@/lib/builder/translations/publish-warnings', () => ({
  buildTranslationPublishWarningsPayload: vi.fn(),
}));

const guardBuilderReadMock = vi.mocked(guardBuilderRead);
const buildTranslationPublishWarningsPayloadMock = vi.mocked(buildTranslationPublishWarningsPayload);

const warningsPayload = {
  ok: true,
  siteId: 'site-a',
  sourceLocale: 'ko',
  syncedAt: '2026-06-03T00:00:00.000Z',
  warnings: [],
};

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/translations/publish-warnings${query ? `?${query}` : ''}`);
}

describe('builder translations publish-warnings API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadMock.mockReturnValue({ username: 'translator@example.test' } as never);
    buildTranslationPublishWarningsPayloadMock.mockResolvedValue(warningsPayload as never);
  });

  it('returns publish warnings while preserving GET success response shape', async () => {
    const response = await GET(request('siteId=site-a&sourceLocale=ko'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(buildTranslationPublishWarningsPayloadMock).toHaveBeenCalledWith('site-a', 'ko');
    expect(data).toEqual(warningsPayload);
  });

  it('returns localized publish-warning failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    buildTranslationPublishWarningsPayloadMock.mockRejectedValueOnce(new Error('publish warning secret leaked'));

    const response = await GET(request('locale=en&sourceLocale=ko'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to load translation publish warnings.',
      errorCode: 'translation_publish_warnings_failed',
    });
    expect(JSON.stringify(data)).not.toContain('publish warning secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/translations/publish-warnings] load failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
