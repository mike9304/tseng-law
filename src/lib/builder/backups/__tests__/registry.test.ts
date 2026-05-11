import { describe, expect, it } from 'vitest';
import { BACKUP_SOURCES } from '@/lib/builder/backups/registry';

describe('backup source registry', () => {
  it('contains every JSON-backed feature surface added so far', () => {
    const prefixes = BACKUP_SOURCES.map((s) => s.prefix);
    expect(prefixes).toContain('builder-bookings/');
    expect(prefixes).toContain('builder-forms/');
    expect(prefixes).toContain('marketing/');
    expect(prefixes).toContain('search/');
    expect(prefixes).toContain('webhooks/');
    expect(prefixes).toContain('errors/');
    expect(prefixes).toContain('migrations/');
  });

  it('keeps every prefix unique', () => {
    const prefixes = BACKUP_SOURCES.map((s) => s.prefix);
    expect(new Set(prefixes).size).toBe(prefixes.length);
  });

  it('uses trailing-slash convention so listing scopes correctly', () => {
    for (const source of BACKUP_SOURCES) {
      expect(source.prefix.endsWith('/')).toBe(true);
    }
  });
});
