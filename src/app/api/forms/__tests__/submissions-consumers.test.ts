import { NextRequest } from 'next/server';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { __setUserRoleStorageRootForTests, __resetUserRoleStorageRootForTests } from '@/lib/builder/security/user-role-store';
import type { FormSubmission } from '@/lib/builder/forms/form-engine';
import { listSubmissions, saveSubmission } from '@/lib/builder/forms/form-engine';
import { GET, PATCH } from '@/app/api/builder/forms/submissions/route';
import FormsAdminPage from '@/app/(builder)/[locale]/admin-builder/forms/page';
import FormSubmissionsPage from '@/app/(builder)/[locale]/admin-builder/forms/submissions/page';
import SubmissionsListView from '@/components/builder/forms/SubmissionsListView';

const requestContext = vi.hoisted(() => ({ headers: new Headers() }));
// Only Next request context is synthetic: the page permission/auth/role helper stays real.
vi.mock('next/headers', () => ({ headers: async () => requestContext.headers }));

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'editor@example.test' })),
  guardMutation: vi.fn(async () => ({ username: 'editor@example.test' })),
}));

vi.mock('@/lib/builder/forms/form-engine', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/forms/form-engine')>(
    '@/lib/builder/forms/form-engine',
  );
  return {
    ...actual,
    listSubmissions: vi.fn(),
    listSubmissionFormIds: vi.fn(),
    saveSubmission: vi.fn(),
  };
});

vi.mock('@/components/builder/forms/FormSubmissionsDashboard', () => ({
  default: (props: { initialSubmissions: FormSubmission[] }) =>
    React.createElement('div', {
      'data-dashboard-count': String(props.initialSubmissions.length),
    }),
}));

const pair: FormSubmission[] = [
  {
    submissionId: 'fs-dup-1',
    formId: 'lead-form',
    formName: 'Lead form',
    data: { email: 'client@example.test', _locale: 'ko' },
    submittedAt: '2026-09-07T11:00:00.000Z',
    read: false,
  },
  {
    submissionId: 'fs-dup-2',
    formId: 'lead-form',
    formName: 'Lead form',
    data: { email: 'client@example.test', _locale: 'ko' },
    submittedAt: '2026-09-07T11:00:01.000Z',
    read: false,
  },
];

let roleRoot: string;
beforeAll(async () => {
  roleRoot = await mkdtemp(path.join(os.tmpdir(), 'submission-consumer-roles-'));
  __setUserRoleStorageRootForTests(roleRoot);
  vi.stubEnv('CMS_ADMIN_USERNAME', 'synthetic-consumer-owner');
  vi.stubEnv('CMS_ADMIN_PASSWORD', 'synthetic-consumer-password');
  vi.stubEnv('BUILDER_BASIC_AUTH_USERS', '');
});
afterAll(async () => {
  __resetUserRoleStorageRootForTests();
  vi.unstubAllEnvs();
  await rm(roleRoot, { recursive: true, force: true });
});

describe('FN-06 listSubmissions consumers pin duplicate pair', () => {
  beforeEach(() => {
    requestContext.headers = new Headers({
      authorization: `Basic ${Buffer.from('synthetic-consumer-owner:synthetic-consumer-password').toString('base64')}`,
    });
    vi.mocked(listSubmissions).mockResolvedValue(pair);
    vi.mocked(saveSubmission).mockResolvedValue(undefined);
  });

  it('GET /api/builder/forms/submissions returns both rows with no rejected marker', async () => {
    const response = await GET(new NextRequest('http://localhost/api/builder/forms/submissions?formId=lead-form'));
    const body = await response.json() as { submissions: FormSubmission[] };
    expect(body.submissions).toHaveLength(2);
    expect(body.submissions.map((row) => row.submissionId)).toEqual(['fs-dup-1', 'fs-dup-2']);
    for (const row of body.submissions) {
      expect(row).not.toHaveProperty('rejected');
      expect(row.data).not.toHaveProperty('rejected');
      expect(row.data).not.toHaveProperty('duplicate');
      expect(row.data.email).toBe('client@example.test');
    }
  });

  it('CSV export of the list payload yields two data rows with identical field data', () => {
    const keys = Array.from(new Set(pair.flatMap((submission) => Object.keys(submission.data))));
    const dataRows = pair.map((submission) => keys.map((key) => String(submission.data[key] ?? '')));
    expect(dataRows).toHaveLength(2);
    expect(dataRows[0]).toEqual(dataRows[1]);
    const html = renderToStaticMarkup(
      React.createElement(SubmissionsListView, {
        formIds: ['lead-form'],
        initialFormId: 'lead-form',
        initialSubmissions: pair,
        locale: 'ko',
      }),
    );
    expect(html).toContain('lead-form · 2건 표시');
  });

  it('PATCH mark-read on the second row succeeds and re-saves that body', async () => {
    const response = await PATCH(new NextRequest('http://localhost/api/builder/forms/submissions', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(pair[1]),
    }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      ok: true,
      submission: { submissionId: 'fs-dup-2', read: true },
    });
    expect(saveSubmission).toHaveBeenCalledWith({
      ...pair[1],
      read: true,
    });
  });

  it('dashboard and list data loaders pass count 2', async () => {
    const { listSubmissionFormIds } = await import('@/lib/builder/forms/form-engine');
    vi.mocked(listSubmissionFormIds).mockResolvedValue(['lead-form']);

    const dashboard = await FormsAdminPage({
      params: Promise.resolve({ locale: 'ko' }),
      searchParams: Promise.resolve({ formId: 'lead-form' }),
    });
    expect(renderToStaticMarkup(dashboard)).toContain('data-dashboard-count="2"');

    const list = await FormSubmissionsPage({
      params: Promise.resolve({ locale: 'ko' }),
      searchParams: Promise.resolve({ formId: 'lead-form' }),
    });
    expect(renderToStaticMarkup(list)).toContain('lead-form · 2건 표시');
  });
});
