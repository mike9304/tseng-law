import type { Locale } from '@/lib/locales';

export type CommerceProductsApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'products_failed'
  | 'product_save_failed'
  | 'product_bulk_update_failed'
  | 'product_action_failed'
  | 'product_not_found'
  | 'sku_conflict';

export interface CommerceProductsApiErrorPayload {
  error: string;
  errorCode: CommerceProductsApiErrorCode;
}

const commerceProductsApiErrorMessages: Record<Locale, Record<CommerceProductsApiErrorCode, string>> = {
  ko: {
    validation_error: '상품 요청을 확인해 주세요.',
    invalid_json: '상품 요청 형식을 확인해 주세요.',
    products_failed: '상품을 불러오지 못했습니다.',
    product_save_failed: '상품을 저장하지 못했습니다.',
    product_bulk_update_failed: '상품 일괄 업데이트에 실패했습니다.',
    product_action_failed: '상품 작업을 완료하지 못했습니다.',
    product_not_found: '상품을 찾을 수 없습니다.',
    sku_conflict: '이미 사용 중인 SKU입니다.',
  },
  'zh-hant': {
    validation_error: '請確認商品請求。',
    invalid_json: '請確認商品請求格式。',
    products_failed: '無法載入商品。',
    product_save_failed: '無法儲存商品。',
    product_bulk_update_failed: '商品批次更新失敗。',
    product_action_failed: '無法完成商品操作。',
    product_not_found: '找不到商品。',
    sku_conflict: '此 SKU 已被使用。',
  },
  en: {
    validation_error: 'Check the product request.',
    invalid_json: 'Check the product request format.',
    products_failed: 'Unable to load products.',
    product_save_failed: 'Unable to save product.',
    product_bulk_update_failed: 'Unable to bulk update products.',
    product_action_failed: 'Unable to complete product action.',
    product_not_found: 'Product not found.',
    sku_conflict: 'This SKU is already in use.',
  },
};

export function getCommerceProductsApiErrorPayload(
  locale: Locale,
  errorCode: CommerceProductsApiErrorCode,
): CommerceProductsApiErrorPayload {
  return {
    error: commerceProductsApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
