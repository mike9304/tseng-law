import { describe, expect, it } from 'vitest';
import { slugFromFilename } from '../columns';

describe('column filename number prefix', () => {
  it('strips a 4-digit number prefix from the slug', () => {
    expect(slugFromFilename('1011-taiwan-scooter-accident.md')).toBe('taiwan-scooter-accident');
    expect(slugFromFilename('1000-some-topic.md')).toBe('some-topic');
  });

  it('keeps 3-digit prefixes unchanged', () => {
    expect(slugFromFilename('976-taiwan-traffic-accident.md')).toBe('taiwan-traffic-accident');
    expect(slugFromFilename('001-2024-tax-reform.md')).toBe('2024-tax-reform');
  });

  it('does not strip 5+ digit or 2-digit prefixes', () => {
    expect(slugFromFilename('12345-x.md')).toBe('12345-x');
    expect(slugFromFilename('12-x.md')).toBe('12-x');
  });
});
