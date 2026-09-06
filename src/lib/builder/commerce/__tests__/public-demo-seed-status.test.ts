import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createProduct,
  deleteProduct,
  filterProductsByStatus,
  listProducts,
  saveProduct,
} from '@/lib/builder/commerce/products-engine';

const SEED_ID = 'product-taiwan-startup-guide-ko';

let root: string;
const previousRoot = process.env.BUILDER_COMMERCE_ROOT;
const previousBackend = process.env.BUILDER_COMMERCE_BACKEND;

describe('public demo seed status', () => {
  beforeEach(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'commerce-demo-seed-'));
    process.env.BUILDER_COMMERCE_ROOT = root;
    process.env.BUILDER_COMMERCE_BACKEND = 'local';
  });

  afterEach(async () => {
    if (previousRoot === undefined) delete process.env.BUILDER_COMMERCE_ROOT;
    else process.env.BUILDER_COMMERCE_ROOT = previousRoot;
    if (previousBackend === undefined) delete process.env.BUILDER_COMMERCE_BACKEND;
    else process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
    await rm(root, { recursive: true, force: true });
  });

  it('exposes the known fallback demo as draft and hides it from the public active filter', async () => {
    const listed = await listProducts();
    const seed = listed.find((product) => product.productId === SEED_ID);
    expect(seed).toMatchObject({
      productId: SEED_ID,
      slug: 'taiwan-startup-guide',
      status: 'draft',
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
    });
    expect(filterProductsByStatus(listed, 'active').some((product) => product.productId === SEED_ID)).toBe(false);
  });

  it('keeps a saved active record with the exact same id active beside unrelated authored actives', async () => {
    const listed = await listProducts();
    const seed = listed.find((product) => product.productId === SEED_ID);
    expect(seed).toBeDefined();

    const saved = await saveProduct({
      ...seed!,
      status: 'active',
      title: 'Authored replacement with the same id',
      body: 'A complete authored product description.',
      priceCents: 1700,
    });
    expect(saved.productId).toBe(SEED_ID);
    expect(saved.status).toBe('active');

    const authored = await createProduct({
      locale: 'ko',
      title: 'Authored active product',
      description: 'Stored authored product',
      status: 'active',
      sku: 'AUTHORED-ACTIVE-1',
      priceCents: 1000,
    });

    const after = await listProducts();
    const sameId = after.filter((product) => product.productId === SEED_ID);
    expect(sameId).toHaveLength(1);
    expect(sameId[0]).toMatchObject({
      status: 'active',
      title: 'Authored replacement with the same id',
      body: 'A complete authored product description.',
      priceCents: 1700,
    });

    const active = filterProductsByStatus(after, 'active');
    expect(active.some((product) => product.productId === SEED_ID)).toBe(true);
    expect(active.some((product) => product.productId === authored.productId)).toBe(true);
  });

  it('lets a stored draft suppress seed resurrection', async () => {
    const listed = await listProducts();
    const seed = listed.find((product) => product.productId === SEED_ID);
    expect(seed).toBeDefined();
    await saveProduct({ ...seed!, status: 'draft', title: 'Stored draft overlay' });

    const after = await listProducts();
    const matches = after.filter((product) => product.productId === SEED_ID);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      productId: SEED_ID,
      status: 'draft',
      title: 'Stored draft overlay',
    });
    expect(filterProductsByStatus(after, 'active').some((product) => product.productId === SEED_ID)).toBe(false);
  });

  it('lets a stored tombstone suppress seed resurrection', async () => {
    await deleteProduct(SEED_ID);
    const after = await listProducts();
    expect(after.some((product) => product.productId === SEED_ID)).toBe(false);
    expect(filterProductsByStatus(after, 'active').some((product) => product.productId === SEED_ID)).toBe(false);
  });
});
