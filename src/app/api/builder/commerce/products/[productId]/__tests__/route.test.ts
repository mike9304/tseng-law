import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  archiveProduct,
  deleteProduct,
  duplicateProduct,
  loadProduct,
  saveProduct,
  validateProduct,
} from '@/lib/builder/commerce/products-engine';
import { DELETE, GET, PATCH, POST } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/commerce/products-engine', () => ({
  archiveProduct: vi.fn(async () => null),
  deleteProduct: vi.fn(async () => undefined),
  duplicateProduct: vi.fn(async () => null),
  loadProduct: vi.fn(async () => null),
  saveProduct: vi.fn(async (product: unknown) => product),
  validateProduct: vi.fn(() => []),
}));

const product = {
  productId: 'product-1',
  locale: 'ko',
  slug: 'product',
  title: 'Product',
  description: 'Product description',
  body: 'Product body',
  status: 'active',
  sku: 'SKU-1',
  priceCents: 12000,
  currency: 'TWD',
  inventory: {
    trackInventory: false,
    quantity: 0,
    lowStockThreshold: 0,
    allowBackorder: true,
  },
  media: [],
  options: [],
  variants: [],
  categoryIds: ['consultation'],
  tags: ['featured'],
  seo: {},
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const duplicate = {
  ...product,
  productId: 'product-copy',
  slug: 'product-copy',
  status: 'draft',
  sku: 'SKU-1-COPY',
};

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const guardMutationMock = vi.mocked(guardMutation);
const archiveProductMock = vi.mocked(archiveProduct);
const deleteProductMock = vi.mocked(deleteProduct);
const duplicateProductMock = vi.mocked(duplicateProduct);
const loadProductMock = vi.mocked(loadProduct);
const saveProductMock = vi.mocked(saveProduct);
const validateProductMock = vi.mocked(validateProduct);

function request(query = '', method = 'GET', body?: string | unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/products/product-1${query ? `?${query}` : ''}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const params = { params: { productId: 'product-1' } };

describe('builder commerce product detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    archiveProductMock.mockResolvedValue({ ...product, status: 'archived' } as never);
    deleteProductMock.mockResolvedValue(undefined as never);
    duplicateProductMock.mockResolvedValue(duplicate as never);
    loadProductMock.mockResolvedValue(product as never);
    saveProductMock.mockImplementation(async (nextProduct) => nextProduct as never);
    validateProductMock.mockReturnValue([]);
  });

  it('returns localized missing-product errors', async () => {
    loadProductMock.mockResolvedValueOnce(null);

    const response = await GET(request('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到商品。',
      errorCode: 'product_not_found',
    });
    expect(requireBuilderAdminAuthMock).not.toHaveBeenCalled();
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadProductMock.mockRejectedValueOnce(new Error('product detail secret leaked'));

    const response = await GET(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '상품을 불러오지 못했습니다.',
      errorCode: 'products_failed',
    });
    expect(payload.error).not.toContain('product detail secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/products/:productId] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns a product while preserving success response shape', async () => {
    const response = await GET(request('locale=en&scope=all'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, product });
    expect(requireBuilderAdminAuthMock).toHaveBeenCalled();
  });

  it('returns localized missing-product update errors', async () => {
    loadProductMock.mockResolvedValueOnce(null);

    const response = await PATCH(request('locale=zh-hant', 'PATCH', { title: 'Next product' }), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到商品。',
      errorCode: 'product_not_found',
    });
    expect(saveProductMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid-json update errors', async () => {
    const response = await PATCH(request('locale=zh-hant', 'PATCH', '{'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認商品請求格式。',
      errorCode: 'invalid_json',
    });
    expect(saveProductMock).not.toHaveBeenCalled();
  });

  it('returns localized SKU conflicts without leaking conflict details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveProductMock.mockRejectedValueOnce(new Error('commerce_product_sku_conflict:SECRET-SKU'));

    const response = await PATCH(request('locale=ko', 'PATCH', { sku: 'SECRET-SKU' }), params);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: '이미 사용 중인 SKU입니다.',
      errorCode: 'sku_conflict',
    });
    expect(JSON.stringify(payload)).not.toContain('SECRET-SKU');
    expect(payload.message).toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/products/:productId] PATCH failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('preserves product validation details while localizing update errors', async () => {
    validateProductMock.mockReturnValueOnce(['bad product']);

    const response = await PATCH(request('locale=en', 'PATCH', { title: 'Next product' }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the product request.',
      errorCode: 'validation_error',
      errors: ['bad product'],
    });
  });

  it('updates products while preserving success response shape', async () => {
    const response = await PATCH(request('locale=ko', 'PATCH', {
      status: 'draft',
      inventory: { quantity: 4 },
    }), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      product: {
        ...product,
        status: 'draft',
        inventory: { ...product.inventory, quantity: 4 },
      },
    });
    expect(saveProductMock).toHaveBeenCalledWith(expect.objectContaining({
      productId: 'product-1',
      status: 'draft',
      inventory: { ...product.inventory, quantity: 4 },
    }));
  });

  it('returns localized action validation errors', async () => {
    const response = await POST(request('locale=ko', 'POST', { action: 'publish' }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '상품 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(duplicateProductMock).not.toHaveBeenCalled();
  });

  it('returns localized missing-product action errors', async () => {
    duplicateProductMock.mockResolvedValueOnce(null);

    const response = await POST(request('locale=zh-hant', 'POST', { action: 'duplicate' }), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到商品。',
      errorCode: 'product_not_found',
    });
  });

  it('duplicates products while preserving success response shape', async () => {
    const response = await POST(request('locale=en', 'POST', { action: 'duplicate' }), params);
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toEqual({ ok: true, product: duplicate });
    expect(duplicateProductMock).toHaveBeenCalledWith('product-1');
  });

  it('archives products while preserving success response shape', async () => {
    const response = await POST(request('locale=en', 'POST', { action: 'archive' }), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, product: { ...product, status: 'archived' } });
    expect(archiveProductMock).toHaveBeenCalledWith('product-1');
  });

  it('deletes products while preserving success response shape', async () => {
    const response = await DELETE(request('', 'DELETE'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(deleteProductMock).toHaveBeenCalledWith('product-1');
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteProductMock.mockRejectedValueOnce(new Error('delete product secret leaked'));

    const response = await DELETE(request('locale=en', 'DELETE'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to complete product action.',
      errorCode: 'product_action_failed',
    });
    expect(payload.error).not.toContain('delete product secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/products/:productId] DELETE failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });
});
