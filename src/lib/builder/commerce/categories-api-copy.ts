import type { Locale } from '@/lib/locales';

export type CommerceCategoriesApiErrorCode =
  | 'validation_error'
  | 'categories_failed';

export interface CommerceCategoriesApiErrorPayload {
  error: string;
  errorCode: CommerceCategoriesApiErrorCode;
}

const commerceCategoriesApiErrorMessages: Record<Locale, Record<CommerceCategoriesApiErrorCode, string>> = {
  ko: {
    validation_error: '상품 카테고리 요청을 확인해 주세요.',
    categories_failed: '상품 카테고리를 불러오지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認商品類別請求。',
    categories_failed: '無法載入商品類別。',
  },
  en: {
    validation_error: 'Check the product category request.',
    categories_failed: 'Unable to load product categories.',
  },
};

export function getCommerceCategoriesApiErrorPayload(
  locale: Locale,
  errorCode: CommerceCategoriesApiErrorCode,
): CommerceCategoriesApiErrorPayload {
  return {
    error: commerceCategoriesApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
