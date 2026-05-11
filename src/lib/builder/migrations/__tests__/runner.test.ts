import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runMigrations } from '@/lib/builder/migrations/runner';
import type { Migration } from '@/lib/builder/migrations/types';
import * as journal from '@/lib/builder/migrations/journal';

describe('migration runner', () => {
  let saved: { applied: { id: string; description: string; appliedAt: string; durationMs: number; touched: number }[]; version: number };

  beforeEach(() => {
    saved = { version: 1, applied: [] };
    vi.spyOn(journal, 'loadMigrationJournal').mockImplementation(async () => ({ version: saved.version, applied: [...saved.applied] }));
    vi.spyOn(journal, 'saveMigrationJournal').mockImplementation(async (j) => {
      saved.version = j.version;
      saved.applied = [...j.applied];
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('applies pending migrations in id order', async () => {
    const order: string[] = [];
    const mB: Migration = {
      id: '2026-05-11-b',
      description: 'B',
      async up() {
        order.push('B');
        return { touched: 0 };
      },
    };
    const mA: Migration = {
      id: '2026-05-11-a',
      description: 'A',
      async up() {
        order.push('A');
        return { touched: 0 };
      },
    };
    const result = await runMigrations([mB, mA], { logger: () => undefined });
    expect(result.ok).toBe(true);
    expect(order).toEqual(['A', 'B']);
    expect(result.applied).toHaveLength(2);
    expect(saved.applied).toHaveLength(2);
  });

  it('skips already-applied migrations', async () => {
    saved.applied = [
      { id: '2026-05-11-a', description: 'A', appliedAt: '2026-05-11T00:00:00Z', durationMs: 1, touched: 0 },
    ];
    const m: Migration = {
      id: '2026-05-11-a',
      description: 'A',
      async up() {
        throw new Error('should not run');
      },
    };
    const result = await runMigrations([m], { logger: () => undefined });
    expect(result.ok).toBe(true);
    expect(result.applied).toHaveLength(0);
    expect(result.skipped).toContain('2026-05-11-a');
  });

  it('stops at first failure and reports the offending migration', async () => {
    const mGood: Migration = {
      id: '2026-05-11-a-good',
      description: 'good',
      async up() {
        return { touched: 1 };
      },
    };
    const mBad: Migration = {
      id: '2026-05-11-b-bad',
      description: 'bad',
      async up() {
        throw new Error('boom');
      },
    };
    const mLater: Migration = {
      id: '2026-05-11-c-later',
      description: 'later',
      async up() {
        throw new Error('should not run');
      },
    };
    const result = await runMigrations([mGood, mBad, mLater], { logger: () => undefined });
    expect(result.ok).toBe(false);
    expect(result.failed?.id).toBe('2026-05-11-b-bad');
    expect(result.applied.map((r) => r.id)).toEqual(['2026-05-11-a-good']);
    expect(saved.applied.map((r) => r.id)).toEqual(['2026-05-11-a-good']);
  });
});
