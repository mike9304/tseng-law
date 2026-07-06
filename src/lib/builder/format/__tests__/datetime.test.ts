import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, formatTime } from '../datetime';

// 2026-06-21T05:47:10 local time → known values for each locale string.
const ISO = '2026-06-21T05:47:10';
const ISO_PM = '2026-06-21T14:05:02';

describe('formatDateTime', () => {
  it('formats Korean morning like Chrome toLocaleString("ko-KR")', () => {
    expect(formatDateTime(ISO, 'ko')).toBe('2026. 6. 21. 오전 5:47:10');
  });

  it('formats Korean afternoon', () => {
    expect(formatDateTime(ISO_PM, 'ko')).toBe('2026. 6. 21. 오후 2:05:02');
  });

  it('formats Traditional Chinese morning', () => {
    expect(formatDateTime(ISO, 'zh-hant')).toBe('2026/6/21 上午 5:47:10');
  });

  it('formats English morning with month/day/year', () => {
    expect(formatDateTime(ISO, 'en')).toBe('6/21/2026, 5:47:10 AM');
  });

  it('formats English afternoon', () => {
    expect(formatDateTime(ISO_PM, 'en')).toBe('6/21/2026, 2:05:02 PM');
  });

  it('falls back to ISO string on invalid input', () => {
    expect(formatDateTime('not-a-date', 'ko')).toBe('not-a-date');
  });
});

describe('formatTime', () => {
  it('formats Korean time only', () => {
    expect(formatTime(ISO, 'ko')).toBe('오전 5:47:10');
  });

  it('formats English time only with AM/PM suffix', () => {
    expect(formatTime(ISO, 'en')).toBe('5:47:10 AM');
  });
});

describe('formatDate', () => {
  it('formats Korean date with trailing dot', () => {
    expect(formatDate(ISO, 'ko')).toBe('2026. 6. 21.');
  });

  it('formats English date as M/D/Y', () => {
    expect(formatDate(ISO, 'en')).toBe('6/21/2026');
  });
});
