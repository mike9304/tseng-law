import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createProduct,
  filterProductsByCategory,
  filterProductsByLocale,
  filterProductsByStatus,
  listProducts,
  loadProduct,
  saveProduct,
  searchProducts,
  sortProducts,
  validateProduct,
} from '@/lib/builder/commerce/products-engine';
import { GET, PATCH, POST } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/commerce/products-engine', () => ({
  createProduct: vi.fn(async (input: unknown) => input),
  filterProductsByCategory: vi.fn((products: unknown[]) => products),
  filterProductsByLocale: vi.fn((products: unknown[]) => products),
  filterProductsByStatus: vi.fn((products: unknown[]) => products),
  listProducts: vi.fn(async () => []),
  loadProduct: vi.fn(async () => null),
  saveProduct: vi.fn(async (product: unknown) => product),
  searchProducts: vi.fn((products: unknown[]) => products),
  sortProducts: vi.fn((products: unknown[]) => products),
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

const productInput = {
  locale: 'ko',
  title: 'Product',
  description: 'Product description',
  body: 'Product body',
  status: 'active',
  sku: 'SKU-1',
  priceCents: 12000,
  currency: 'TWD',
  inventory: product.inventory,
  media: [],
  options: [],
  variants: [],
  categoryIds: ['consultation'],
  tags: ['featured'],
  seo: {},
};

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const guardMutationMock = vi.mocked(guardMutation);
const createProductMock = vi.mocked(createProduct);
const filterProductsByCategoryMock = vi.mocked(filterProductsByCategory);
const filterProductsByLocaleMock = vi.mocked(filterProductsByLocale);
const filterProductsByStatusMock = vi.mocked(filterProductsByStatus);
const listProductsMock = vi.mocked(listProducts);
const loadProductMock = vi.mocked(loadProduct);
const saveProductMock = vi.mocked(saveProduct);
const searchProductsMock = vi.mocked(searchProducts);
const sortProductsMock = vi.mocked(sortProducts);
const validateProductMock = vi.mocked(validateProduct);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/products${query ? `?${query}` : ''}`);
}

function request(method: 'POST' | 'PATCH', query = '', body: string | unknown = productInput): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/products${query ? `?${query}` : ''}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder commerce products API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    createProductMock.mockResolvedValue(product as never);
    filterProductsByCategoryMock.mockImplementation((products) => products as never);
    filterProductsByLocaleMock.mockImplementation((products) => products as never);
    filterProductsByStatusMock.mockImplementation((products) => products as never);
    listProductsMock.mockResolvedValue([product] as never);
    loadProductMock.mockResolvedValue(product as never);
    saveProductMock.mockImplementation(async (nextProduct) => nextProduct as never);
    searchProductsMock.mockImplementation((products) => products as never);
    sortProductsMock.mockImplementation((products) => products as never);
    validateProductMock.mockReturnValue([]);
  });

  it('returns localized query validation errors with stable codes', async () => {
    const response = await GET(getRequest('locale=zh-hant&status=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認商品請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(listProductsMock).not.toHaveBeenCalled();
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listProductsMock.mockRejectedValueOnce(new Error('product storage secret leaked'));

    const response = await GET(getRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '상품을 불러오지 못했습니다.',
      errorCode: 'products_failed',
    });
    expect(payload.error).not.toContain('product storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/products] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns products while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en&scope=all&status=all&q=sku&sort=price-desc&limit=25'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, locale: 'en', total: 1, products: [product] });
    expect(requireBuilderAdminAuthMock).toHaveBeenCalled();
    expect(filterProductsByLocaleMock).toHaveBeenCalledWith([product], 'en');
    expect(filterProductsByStatusMock).toHaveBeenCalledWith([product], 'all');
    expect(filterProductsByCategoryMock).toHaveBeenCalledWith([product], undefined);
    expect(searchProductsMock).toHaveBeenCalledWith([product], 'sku');
    expect(sortProductsMock).toHaveBeenCalledWith([product], 'price-desc');
  });

  it('returns localized invalid-json create errors', async () => {
    const response = await POST(request('POST', 'locale=zh-hant', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認商品請求格式。',
      errorCode: 'invalid_json',
    });
    expect(createProductMock).not.toHaveBeenCalled();
  });

  it('returns localized SKU conflicts without leaking conflict details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createProductMock.mockRejectedValueOnce(new Error('commerce_product_sku_conflict:SECRET-SKU'));

    const response = await POST(request('POST', 'locale=ko'));
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
      '[builder/commerce/products] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('preserves product validation details while localizing create errors', async () => {
    validateProductMock.mockReturnValueOnce(['bad product']);

    const response = await POST(request('POST', 'locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the product request.',
      errorCode: 'validation_error',
      errors: ['bad product'],
    });
  });

  it('returns localized invalid-json bulk update errors', async () => {
    const response = await PATCH(request('PATCH', 'locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the product request format.',
      errorCode: 'invalid_json',
    });
    expect(loadProductMock).not.toHaveBeenCalled();
  });

  it('bulk updates products while preserving success response shape', async () => {
    const response = await PATCH(request('PATCH', 'locale=ko', {
      productIds: ['product-1'],
      status: 'archived',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      products: [{ ...product, status: 'archived' }],
      updated: 1,
    });
    expect(loadProductMock).toHaveBeenCalledWith('product-1');
    expect(saveProductMock).toHaveBeenCalledWith(expect.objectContaining({
      productId: 'product-1',
      status: 'archived',
    }));
  });
});
