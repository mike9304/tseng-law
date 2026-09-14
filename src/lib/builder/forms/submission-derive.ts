import type { FormSubmission } from './form-engine';

export type DateRange = 'all' | '7d' | '30d';
export type ReadFilter = 'all' | 'read' | 'unread';

export type SubmissionFilters = {
  search: string;
  categoryFilter: string;
  dateRange: DateRange;
  readFilter: ReadFilter;
};

export function deriveCategories(submissions: FormSubmission[]): string[] {
  const cats = new Set<string>();
  for (const sub of submissions) {
    const cat = String(sub.data?.category || '');
    if (cat && cat !== '-') cats.add(cat);
  }
  return Array.from(cats).sort();
}

export function filterSubmissions(
  submissions: FormSubmission[],
  filters: SubmissionFilters,
  now: number = Date.now(),
): FormSubmission[] {
  const query = filters.search.toLowerCase().trim();

  return submissions.filter((sub) => {
    if (query) {
      const name = String(sub.data?.name || '').toLowerCase();
      const email = String(sub.data?.email || '').toLowerCase();
      const message = String(sub.data?.message || '').toLowerCase();
      if (!name.includes(query) && !email.includes(query) && !message.includes(query)) {
        return false;
      }
    }

    if (filters.categoryFilter !== 'all') {
      if (String(sub.data?.category || '') !== filters.categoryFilter) return false;
    }

    if (filters.dateRange !== 'all') {
      const submittedAt = new Date(sub.submittedAt).getTime();
      const days = filters.dateRange === '7d' ? 7 : 30;
      if (now - submittedAt > days * 24 * 60 * 60 * 1000) return false;
    }

    if (filters.readFilter === 'read' && !sub.read) return false;
    if (filters.readFilter === 'unread' && sub.read) return false;

    return true;
  });
}

export function countUnread(submissions: FormSubmission[]): number {
  return submissions.filter((s) => !s.read).length;
}

export function truncate(text: string, maxLen: number): string {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
