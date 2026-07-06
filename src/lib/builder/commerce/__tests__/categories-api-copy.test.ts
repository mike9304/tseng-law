import { describe, expect, it } from 'vitest';
import { getCommerceCategoriesApiErrorPayload } from '@/lib/builder/commerce/categories-api-copy';

describe('commerce categories API copy', () => {
  it('returns localized API error payloads with stable codes', () => {
    expect(getCommerceCategoriesApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '상품 카테고리 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getCommerceCategoriesApiErrorPayload('zh-hant', 'validation_error')).toEqual({
      error: '請確認商品類別請求。',
      errorCode: 'validation_error',
    });
    expect(getCommerceCategoriesApiErrorPayload('zh-hant', 'categories_failed')).toEqual({
      error: '無法載入商品類別。',
      errorCode: 'categories_failed',
    });
    expect(getCommerceCategoriesApiErrorPayload('en', 'categories_failed')).toEqual({
      error: 'Unable to load product categories.',
      errorCode: 'categories_failed',
    });
  });
});
