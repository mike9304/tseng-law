/**
 * FN-09 CSV fixture vs route persist shapes (quoted from
 * src/app/api/forms/submit/route.ts, read-only).
 *
 * saveSubmission (what SubmissionsListView.exportCsv actually consumes):
 * {
 *   submissionId,
 *   formId: schema.formId,
 *   formName: schema.name,
 *   data: { ...fields, _pageSlug: body.pageSlug, _locale: body.locale },
 *   files: files.length > 0 ? files : undefined,
 *   submittedAt: new Date().toISOString(),
 *   ip,
 *   userAgent: request.headers.get('user-agent') || undefined,
 *   read: false,
 * }
 *
 * writeSubmissionToCms → createEditableBuilderCmsRecord payload (not CSV input):
 * { status: mapping.status ?? 'pending', locale: recordLocale, fields: recordFields }
 * collection-read catch uses collectionDetail?.fields ?? [] as mapping schema, not
 * a FormSubmission. CSV serializer is not given that CMS object.
 */
import { describe, expect, it } from 'vitest';
import type { FormSubmission } from '@/lib/builder/forms/form-engine';
import { serializeSubmissionsCsv } from '@/components/builder/forms/submissionsCsv';
import {
  countUnread,
  deriveCategories,
  filterSubmissions,
} from '@/lib/builder/forms/submission-derive';

const persistedShape: FormSubmission = {
  submissionId: 'fs-route-1',
  formId: 'lead-form',
  formName: 'Lead form',
  data: {
    email: 'client@example.test',
    _pageSlug: 'contact',
    _locale: 'ko',
  },
  submittedAt: '2026-09-07T12:00:00.000Z',
  ip: '203.0.113.10',
  userAgent: 'vitest',
  read: false,
};

describe('FN-09 submission consumers', () => {
  it('serializes the exact shape written by writeSubmissionToCms', () => {
    const csv = serializeSubmissionsCsv([persistedShape]);
    const rows = csv.split('\n');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toBe('"submissionId","formId","submittedAt","read","email","_pageSlug","_locale"');
    expect(rows[0]).toContain('"email"');
    expect(rows[0]).toContain('"_pageSlug"');
    expect(rows[0]).toContain('"_locale"');
    expect(rows[1]).toBe(
      '"fs-route-1","lead-form","2026-09-07T12:00:00.000Z","unread","client@example.test","contact","ko"',
    );
  });

  it('does not throw on fields: [] fallback record', () => {
    const record = {
      submissionId: 'fs-empty',
      formId: 'lead-form',
      submittedAt: '2026-09-07T12:00:00.000Z',
      read: false,
      data: {},
      fields: [],
    } as FormSubmission & { fields: unknown[] };
    expect(() => serializeSubmissionsCsv([record])).not.toThrow();
    expect(serializeSubmissionsCsv([record])).toBe(
      '"submissionId","formId","submittedAt","read"\n"fs-empty","lead-form","2026-09-07T12:00:00.000Z","unread"',
    );
  });

  it('escapes comma, quote and newline in a field value', () => {
    const record: FormSubmission = {
      ...persistedShape,
      submissionId: 'fs-escape',
      data: { message: 'hello, "world"\nnext' },
    };
    const csv = serializeSubmissionsCsv([record]);
    expect(csv).toBe(
      '"submissionId","formId","submittedAt","read","message"\n"fs-escape","lead-form","2026-09-07T12:00:00.000Z","unread","hello, ""world""\nnext"',
    );
  });

  it('serializes two records into three rows in insertion order', () => {
    const second: FormSubmission = {
      ...persistedShape,
      submissionId: 'fs-route-2',
      submittedAt: '2026-09-07T12:00:01.000Z',
      data: { ...persistedShape.data, email: 'second@example.test' },
    };
    const csv = serializeSubmissionsCsv([persistedShape, second]);
    const rows = csv.split('\n');
    expect(rows).toHaveLength(3);
    expect(rows[1]).toContain('"fs-route-1"');
    expect(rows[2]).toContain('"fs-route-2"');
    expect(rows[1]).toContain('"client@example.test"');
    expect(rows[2]).toContain('"second@example.test"');
  });

  it('dashboard helpers accept the saveSubmission shape (FN-09 B6)', () => {
    const now = Date.UTC(2026, 8, 7, 12, 0, 0);
    expect(deriveCategories([persistedShape])).toEqual([]);
    expect(countUnread([persistedShape])).toBe(1);
    expect(
      filterSubmissions(
        [persistedShape],
        { search: '', categoryFilter: 'all', dateRange: 'all', readFilter: 'all' },
        now,
      ),
    ).toEqual([persistedShape]);
  });

  it.todo('SSR forms page UNVERIFIED — needs Next runtime, out of FN-09 scope');
});
