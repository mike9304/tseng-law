import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadShippingRules, saveShippingRules } from '../shipping-engine';

let tmpRoot = '';
let previousRoot: string | undefined;
let previousBackend: string | undefined;

beforeEach(async () => {
  previousRoot = process.env.BUILDER_COMMERCE_ROOT;
  previousBackend = process.env.BUILDER_COMMERCE_BACKEND;
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'commerce-shipping-'));
  process.env.BUILDER_COMMERCE_ROOT = tmpRoot;
  process.env.BUILDER_COMMERCE_BACKEND = 'local';
});

afterEach(async () => {
  process.env.BUILDER_COMMERCE_ROOT = previousRoot;
  process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
  if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('commerce shipping engine', () => {
  it('loads defaults and persists custom shipping rules', async () => {
    expect(await loadShippingRules()).toEqual(expect.arrayContaining([
      expect.objectContaining({ ruleId: 'ship-standard-twd', amountCents: 12000 }),
    ]));

    await saveShippingRules([
      {
        ruleId: 'custom-pickup',
        method: 'pickup',
        label: 'Custom Pickup',
        currency: 'TWD',
        country: 'TW',
        amountCents: 0,
        active: true,
        locale: 'all',
        priority: 10,
        estimatedDays: '1',
      },
    ], '2026-05-20T00:00:00.000Z');

    expect(await loadShippingRules()).toEqual([
      expect.objectContaining({
        ruleId: 'custom-pickup',
        label: 'Custom Pickup',
        updatedAt: '2026-05-20T00:00:00.000Z',
      }),
    ]);
  });
});
