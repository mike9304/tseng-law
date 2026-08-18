import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readCanvasSandboxDraft } from '@/lib/builder/canvas/persistence';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'edit-pages',
  })),
  guardMutation: vi.fn(),
}));

vi.mock('@/lib/builder/canvas/persistence', () => ({
  readCanvasSandboxDraft: vi.fn(),
  writeCanvasSandboxDraft: vi.fn(),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const readCanvasSandboxDraftMock = vi.mocked(readCanvasSandboxDraft);

function request(): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/sandbox/draft?locale=ko');
}

describe('/api/builder/sandbox/draft GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'edit-pages',
    });
    readCanvasSandboxDraftMock.mockResolvedValue({
      backend: 'file',
      persisted: false,
      document: { id: 'sandbox-draft' },
    } as never);
  });

  it('requires edit-pages before returning a sandbox draft', async () => {
    const req = request();
    const response = await GET(req);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(req, 'edit-pages');
    expect(readCanvasSandboxDraftMock).toHaveBeenCalledWith('ko');
    expect(payload.requestedBy).toBe('admin');
  });

  it('short-circuits a missing edit-pages permission with 403', async () => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: edit-pages' }, { status: 403 }),
    );
    const req = request();

    const response = await GET(req);

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(req, 'edit-pages');
    expect(readCanvasSandboxDraftMock).not.toHaveBeenCalled();
  });
});
