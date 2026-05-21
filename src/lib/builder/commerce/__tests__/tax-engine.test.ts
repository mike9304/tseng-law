import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadTaxRules, saveTaxRules } from '../tax-engine';

let tmpRoot = '';
let previousRoot: string | undefined;
let previousBackend: string | undefined;

beforeEach(async () => {
  previousRoot = process.env.BUILDER_COMMERCE_ROOT;
  previousBackend = process.env.BUILDER_COMMERCE_BACKEND;
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'commerce-tax-'));
  process.env.BUILDER_COMMERCE_ROOT = tmpRoot;
  process.env.BUILDER_COMMERCE_BACKEND = 'local';
});

afterEach(async () => {
  process.env.BUILDER_COMMERCE_ROOT = previousRoot;
  process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
  if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('commerce tax engine', () => {
  it('loads defaults and persists custom tax rules', async () => {
    expect(await loadTaxRules()).toEqual(expect.arrayContaining([
      expect.objectContaining({ ruleId: 'tax-tw', rateBps: 500 }),
    ]));

    await saveTaxRules([
      {
        ruleId: 'custom-tw',
        label: 'Custom TW',
        country: 'TW',
        rateBps: 750,
        active: true,
        locale: 'all',
        priority: 10,
      },
    ], '2026-05-20T00:00:00.000Z');

    expect(await loadTaxRules()).toEqual([
      expect.objectContaining({
        ruleId: 'custom-tw',
        label: 'Custom TW',
        rateBps: 750,
        updatedAt: '2026-05-20T00:00:00.000Z',
      }),
    ]);
  });
});
