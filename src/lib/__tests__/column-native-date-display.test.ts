import { describe, expect, it } from 'vitest';
import { formatColumnPublicationDate, parseColumnPublicationDate } from '@/lib/column-post';

describe('authored column dates in additional locales', () => {
  it.each([
    ['id', '27 September 2026'],
    ['vi', '27 tháng 9 năm 2026'],
    ['th', '27 กันยายน 2026'],
    ['fil', '27 Setyembre 2026'],
    ['zh-hans', '2026年9月27日'],
  ])('preserves the native display for %s alongside a sortable ISO date', (locale, display) => {
    expect(parseColumnPublicationDate('2026-09-27')).toBe('2026-09-27');
    expect(formatColumnPublicationDate('2026-09-27', locale, display)).toBe(display);
  });
  it('continues canonical formatting for the original locales', () => {
    expect(formatColumnPublicationDate('2026-09-27', 'ko', 'stale')).toBe('2026년 9월 27일');
    expect(formatColumnPublicationDate('2026-09-27', 'en', 'stale')).toBe('September 27, 2026');
  });
});
