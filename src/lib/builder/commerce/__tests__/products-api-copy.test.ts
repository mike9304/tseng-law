import { describe, expect, it } from 'vitest';
import { getCommerceProductsApiErrorPayload } from '@/lib/builder/commerce/products-api-copy';

describe('commerce products API copy', () => {
  it('returns localized API error payloads with stable codes', () => {
    expect(getCommerceProductsApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '상품 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getCommerceProductsApiErrorPayload('zh-hant', 'products_failed')).toEqual({
      error: '無法載入商品。',
      errorCode: 'products_failed',
    });
    expect(getCommerceProductsApiErrorPayload('ko', 'sku_conflict')).toEqual({
      error: '이미 사용 중인 SKU입니다.',
      errorCode: 'sku_conflict',
    });
    expect(getCommerceProductsApiErrorPayload('en', 'product_not_found')).toEqual({
      error: 'Product not found.',
      errorCode: 'product_not_found',
    });
    expect(getCommerceProductsApiErrorPayload('zh-hant', 'product_bulk_update_failed')).toEqual({
      error: '商品批次更新失敗。',
      errorCode: 'product_bulk_update_failed',
    });
  });
});
