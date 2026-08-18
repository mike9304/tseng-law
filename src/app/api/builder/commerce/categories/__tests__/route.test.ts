import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  filterProductsByLocale,
  filterProductsByStatus,
  listProductCategories,
  listProducts,
} from '@/lib/builder/commerce/products-engine';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'view-commerce',
  })),
}));

vi.mock('@/lib/builder/commerce/products-engine', () => ({
  filterProductsByLocale: vi.fn((products: unknown[]) => products),
  filterProductsByStatus: vi.fn((products: unknown[]) => products),
  listProductCategories: vi.fn(async () => []),
  listProducts: vi.fn(async () => []),
}));

const product = { productId: 'prod-1', status: 'active', locale: 'ko', categoryIds: ['consultation'] };
const category = {
  categoryId: 'consultation',
  slug: 'consultation',
  name: 'Consultation',
  productCount: 1,
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const filterProductsByLocaleMock = vi.mocked(filterProductsByLocale);
const filterProductsByStatusMock = vi.mocked(filterProductsByStatus);
const listProductCategoriesMock = vi.mocked(listProductCategories);
const listProductsMock = vi.mocked(listProducts);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/categories${query ? `?${query}` : ''}`);
}

describe('builder commerce categories API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'view-commerce',
    } as never);
    filterProductsByLocaleMock.mockImplementation((products) => products as never);
    filterProductsByStatusMock.mockImplementation((products) => products as never);
    listProductsMock.mockResolvedValue([product] as never);
    listProductCategoriesMock.mockResolvedValue([category] as never);
  });

  it('returns localized validation errors with stable codes', async () => {
    const response = await GET(getRequest('locale=zh-hant&scope=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認商品類別請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(listProductsMock).not.toHaveBeenCalled();
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listProductsMock.mockRejectedValueOnce(new Error('category storage secret leaked'));

    const response = await GET(getRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '상품 카테고리를 불러오지 못했습니다.',
      errorCode: 'categories_failed',
    });
    expect(payload.error).not.toContain('category storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/categories] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns public categories while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, locale: 'en', total: 1, categories: [category] });
    expect(filterProductsByLocaleMock).toHaveBeenCalledWith([product], 'en');
    expect(filterProductsByStatusMock).toHaveBeenCalledWith([product], 'active');
    expect(listProductCategoriesMock).toHaveBeenCalledWith('en', {
      includeHidden: false,
      products: [product],
    });
    expect(guardBuilderReadWithPermissionMock).not.toHaveBeenCalled();
  });

  it('authorizes all-scope categories and preserves all-scope shape', async () => {
    const response = await GET(getRequest('locale=zh-hant&scope=all'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, locale: 'zh-hant', total: 1, categories: [category] });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
    expect(filterProductsByStatusMock).not.toHaveBeenCalled();
    expect(listProductCategoriesMock).toHaveBeenCalledWith('zh-hant', {
      includeHidden: true,
      products: [product],
    });
  });
});
