import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  listSubmissionFormIds,
  listSubmissions,
  saveSubmission,
} from '@/lib/builder/forms/form-engine';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import { GET, PATCH } from '../route';

vi.mock('@/lib/builder/forms/form-engine', () => ({
  listSubmissionFormIds: vi.fn(),
  listSubmissions: vi.fn(),
  saveSubmission: vi.fn(),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(),
  guardMutation: vi.fn(),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const listSubmissionFormIdsMock = vi.mocked(listSubmissionFormIds);
const listSubmissionsMock = vi.mocked(listSubmissions);
const saveSubmissionMock = vi.mocked(saveSubmission);

function request(query = ''): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/forms/submissions${query ? `?${query}` : ''}`,
  );
}

function patchRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/forms/submissions', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('builder form submissions API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'forms-admin',
      permission: 'manage-forms',
    });
    guardMutationMock.mockResolvedValue({
      username: 'forms-admin',
      permission: 'manage-forms',
    });
    listSubmissionFormIdsMock.mockResolvedValue(['contact-form']);
    listSubmissionsMock.mockResolvedValue([]);
  });

  it('requires manage-forms permission before listing submission data', async () => {
    const response = await GET(request());

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'manage-forms',
    );
    expect(listSubmissionFormIdsMock).toHaveBeenCalledOnce();
  });

  it.each([
    ['unauthenticated', 401],
    ['authenticated without permission', 403],
  ])('returns %s denial without reading submission data', async (_label, status) => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'missing_permission' }, { status }),
    );

    const response = await GET(request('formId=contact-form'));

    expect(response.status).toBe(status);
    expect(listSubmissionFormIdsMock).not.toHaveBeenCalled();
    expect(listSubmissionsMock).not.toHaveBeenCalled();
    expect(saveSubmissionMock).not.toHaveBeenCalled();
  });

  it('preserves the manage-forms mutation guard', async () => {
    const submission = {
      submissionId: 'submission-1',
      formId: 'contact-form',
      submittedAt: '2026-07-30T00:00:00.000Z',
      data: {},
      read: false,
    };

    const response = await PATCH(patchRequest(submission));

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      { permission: 'manage-forms' },
    );
    expect(saveSubmissionMock).toHaveBeenCalledWith({
      ...submission,
      read: true,
    });
  });
});
