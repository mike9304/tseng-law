import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listEditableBuilderCmsCollections } from '@/lib/builder/cms-editable';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  authorizeBuilderAppScope,
  BuilderAppScopeError,
} from '@/lib/builder/apps/scopes';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'apps-admin@example.test' })),
}));

vi.mock('@/lib/builder/cms-editable', () => ({
  listEditableBuilderCmsCollections: vi.fn(),
}));

vi.mock('@/lib/builder/apps/scopes', () => {
  class MockBuilderAppScopeError extends Error {
    constructor(public readonly code: string, message: string) {
      super(message);
      this.name = 'BuilderAppScopeError';
    }
  }
  return {
    authorizeBuilderAppScope: vi.fn(),
    BuilderAppScopeError: MockBuilderAppScopeError,
  };
});

const guardMutationMock = vi.mocked(guardMutation);
const authorizeBuilderAppScopeMock = vi.mocked(authorizeBuilderAppScope);
const listEditableBuilderCmsCollectionsMock = vi.mocked(listEditableBuilderCmsCollections);
const routeContext = { params: { appId: 'site-search' } };

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/apps/installations/site-search/cms/collections${query ? `?${query}` : ''}`);
}

describe('builder app CMS collections scope API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'apps-admin@example.test' } as never);
    authorizeBuilderAppScopeMock.mockResolvedValue({ appId: 'site-search', scope: 'cms:read' } as never);
    listEditableBuilderCmsCollectionsMock.mockResolvedValue([{ collectionId: 'columns' }] as never);
  });

  it('returns editable collections while preserving GET success response shape', async () => {
    const response = await GET(request('locale=en'), routeContext);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(authorizeBuilderAppScopeMock).toHaveBeenCalledWith('tseng-law-main-site', 'en', 'site-search', 'cms:read');
    expect(data).toEqual({
      ok: true,
      appId: 'site-search',
      scope: 'cms:read',
      editableCollections: [{ collectionId: 'columns' }],
    });
  });

  it('returns localized app scope errors without leaking scope exception details', async () => {
    authorizeBuilderAppScopeMock.mockRejectedValueOnce(
      new BuilderAppScopeError('app_scope_not_granted', 'App does not declare cms:read.'),
    );

    const response = await GET(request('locale=zh-hant'), routeContext);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toEqual({
      ok: false,
      error: '應用缺少必要權限。',
      errorCode: 'app_scope_not_granted',
    });
    expect(JSON.stringify(data)).not.toContain('cms:read');
  });

  it('returns localized scope-check failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    authorizeBuilderAppScopeMock.mockRejectedValueOnce(new Error('scope secret leaked'));

    const response = await GET(request('locale=en'), routeContext);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to check app permissions.',
      errorCode: 'app_scope_check_failed',
    });
    expect(JSON.stringify(data)).not.toContain('scope secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder-app-cms-collections] failed', expect.any(Error));
    consoleError.mockRestore();
  });
});
