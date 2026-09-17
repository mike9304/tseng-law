/**
 * FN-10 expected values are hand-traced from FormSubmissionsDashboard.tsx
 * (categories useMemo, filteredSubmissions useMemo, unreadCount, truncate,
 * formatDate) before the extract is wired.
 *
 * Category sentinel: 'all'
 * 7d/30d operator: `now - submittedAt > days * 24 * 60 * 60 * 1000`
 * (equal-to-window is kept; strictly older is dropped)
 * Search: toLowerCase + trim; matches name OR email OR message
 * unreadCount: over the full submissions array, not the filtered subset
 * truncate: empty → ''; length > maxLen → slice(0, maxLen) + '...'
 */
import { describe, expect, it } from 'vitest';
import type { FormSubmission } from '@/lib/builder/forms/form-engine';
import {
  countUnread,
  deriveCategories,
  filterSubmissions,
  formatDate,
  truncate,
  type SubmissionFilters,
} from '@/lib/builder/forms/submission-derive';

const NOW = Date.UTC(2026, 8, 7, 12, 0, 0);
const DAY_MS = 24 * 60 * 60 * 1000;

const ALL: SubmissionFilters = {
  search: '',
  categoryFilter: 'all',
  dateRange: 'all',
  readFilter: 'all',
};

function sub(
  id: string,
  data: Record<string, unknown>,
  extra: Partial<FormSubmission> = {},
): FormSubmission {
  return {
    submissionId: id,
    formId: 'lead-form',
    data,
    submittedAt: extra.submittedAt ?? '2026-09-07T12:00:00.000Z',
    read: extra.read ?? false,
    ...extra,
  };
}

function isoDaysBefore(days: number): string {
  return new Date(NOW - days * DAY_MS).toISOString();
}

describe('FN-10 submission-derive', () => {
  it('T1 deriveCategories coercion+exclusion+sort', () => {
    const submissions = [
      sub('c-b', { category: 'b' }),
      sub('c-a1', { category: 'a' }),
      sub('c-empty', { category: '' }),
      sub('c-dash', { category: '-' }),
      sub('c-a2', { category: 'a' }),
      sub('c-42', { category: 42 }),
      sub('c-undef', { category: undefined }),
    ];
    expect(deriveCategories(submissions)).toEqual(['42', 'a', 'b']);
  });

  it('T2 filterSubmissions search is case-insensitive on name/email/message', () => {
    const alice = sub('s-alice', { name: 'alice', email: 'a@example.test', message: 'hello' });
    const bob = sub('s-bob', { name: 'bob', email: 'b@example.test', message: 'world' });
    const note = sub('s-note', { name: 'x', email: 'y@example.test', message: 'unique-token' });
    const list = [alice, bob, note];

    expect(filterSubmissions(list, { ...ALL, search: 'ALICE' }, NOW)).toEqual([alice]);
    expect(filterSubmissions(list, { ...ALL, search: 'unique-token' }, NOW)).toEqual([note]);
    expect(filterSubmissions(list, { ...ALL, search: 'no-such' }, NOW)).toEqual([]);
  });

  it('T3 filterSubmissions categoryFilter sentinel all vs exact', () => {
    const legal = sub('s-legal', { category: 'legal' });
    const tax = sub('s-tax', { category: 'tax' });
    const list = [legal, tax];
    expect(filterSubmissions(list, { ...ALL, categoryFilter: 'all' }, NOW)).toEqual(list);
    expect(filterSubmissions(list, { ...ALL, categoryFilter: 'legal' }, NOW)).toEqual([legal]);
  });

  it('T4 filterSubmissions dateRange uses injected now and > window', () => {
    const d6 = sub('d6', {}, { submittedAt: isoDaysBefore(6) });
    const d7 = sub('d7', {}, { submittedAt: isoDaysBefore(7) });
    const d8 = sub('d8', {}, { submittedAt: isoDaysBefore(8) });
    const d29 = sub('d29', {}, { submittedAt: isoDaysBefore(29) });
    const d31 = sub('d31', {}, { submittedAt: isoDaysBefore(31) });
    const list = [d6, d7, d8, d29, d31];

    expect(filterSubmissions(list, { ...ALL, dateRange: '7d' }, NOW).map((s) => s.submissionId)).toEqual([
      'd6',
      'd7',
    ]);
    expect(filterSubmissions(list, { ...ALL, dateRange: '30d' }, NOW).map((s) => s.submissionId)).toEqual([
      'd6',
      'd7',
      'd8',
      'd29',
    ]);
    expect(filterSubmissions(list, { ...ALL, dateRange: 'all' }, NOW)).toEqual(list);
  });

  it('T5 filterSubmissions readFilter', () => {
    const unread = sub('u1', {}, { read: false });
    const read = sub('r1', {}, { read: true });
    const unread2 = sub('u2', {}, { read: false });
    const list = [unread, read, unread2];
    expect(filterSubmissions(list, { ...ALL, readFilter: 'read' }, NOW)).toEqual([read]);
    expect(filterSubmissions(list, { ...ALL, readFilter: 'unread' }, NOW)).toEqual([unread, unread2]);
    expect(filterSubmissions(list, { ...ALL, readFilter: 'all' }, NOW)).toEqual(list);
  });

  it('T6 countUnread', () => {
    expect(countUnread([])).toBe(0);
    expect(
      countUnread([
        sub('u', {}, { read: false }),
        sub('r', {}, { read: true }),
        sub('u2', {}, { read: false }),
      ]),
    ).toBe(2);
  });

  it('T7 truncate under/at/over limit', () => {
    expect(truncate('ab', 5)).toBe('ab');
    expect(truncate('abcde', 5)).toBe('abcde');
    expect(truncate('abcdef', 5)).toBe('abcde...');
    expect(truncate('', 5)).toBe('');
  });

  it('T8 formatDate contains year and pins invalid ISO', () => {
    const formatted = formatDate('2026-09-07T12:00:00.000Z');
    expect(formatted).toEqual(expect.stringContaining('2026'));
    expect(() => formatDate('not-a-date')).not.toThrow();
    expect(formatDate('not-a-date')).toBe(
      new Date('not-a-date').toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    );
  });
});
