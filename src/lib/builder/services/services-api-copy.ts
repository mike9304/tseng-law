import type { Locale } from '@/lib/locales';

export type BuilderServicesApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'service_area_not_found'
  | 'service_area_conflict'
  | 'service_area_load_failed'
  | 'service_area_update_failed'
  | 'service_area_reset_failed';

export interface BuilderServicesApiErrorPayload {
  error: string;
  errorCode: BuilderServicesApiErrorCode;
}

const builderServicesApiErrorMessages: Record<Locale, Record<BuilderServicesApiErrorCode, string>> = {
  ko: {
    validation_error: '서비스 영역 요청을 확인해 주세요.',
    invalid_json: '서비스 영역 요청 형식을 확인해 주세요.',
    service_area_not_found: '서비스 영역을 찾을 수 없습니다.',
    service_area_conflict: '서비스 영역 설정이 다른 항목과 충돌합니다.',
    service_area_load_failed: '서비스 영역을 불러오지 못했습니다.',
    service_area_update_failed: '서비스 영역을 저장하지 못했습니다.',
    service_area_reset_failed: '서비스 영역 재설정을 완료하지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認服務領域請求。',
    invalid_json: '請確認服務領域請求格式。',
    service_area_not_found: '找不到服務領域。',
    service_area_conflict: '服務領域設定與其他項目衝突。',
    service_area_load_failed: '無法載入服務領域。',
    service_area_update_failed: '無法儲存服務領域。',
    service_area_reset_failed: '無法完成服務領域重設。',
  },
  en: {
    validation_error: 'Check the service area request.',
    invalid_json: 'Check the service area request format.',
    service_area_not_found: 'Service area not found.',
    service_area_conflict: 'The service area settings conflict with another item.',
    service_area_load_failed: 'Unable to load the service area.',
    service_area_update_failed: 'Unable to save the service area.',
    service_area_reset_failed: 'Unable to reset the service area.',
  },
};

export function getBuilderServicesApiErrorPayload(
  locale: Locale,
  errorCode: BuilderServicesApiErrorCode,
): BuilderServicesApiErrorPayload {
  return { error: builderServicesApiErrorMessages[locale][errorCode], errorCode };
}
