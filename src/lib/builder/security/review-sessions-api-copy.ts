import type { Locale } from '@/lib/locales';

export type BuilderReviewSessionsApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'review_sessions_list_failed'
  | 'review_session_create_failed'
  | 'review_token_invalid'
  | 'review_token_verify_failed';

export interface BuilderReviewSessionsApiErrorPayload {
  error: string;
  errorCode: BuilderReviewSessionsApiErrorCode;
}

const builderReviewSessionsApiErrorMessages: Record<
  Locale,
  Record<BuilderReviewSessionsApiErrorCode, string>
> = {
  ko: {
    validation_error: '리뷰 세션 요청을 확인해 주세요.',
    invalid_json: '리뷰 세션 요청 형식을 확인해 주세요.',
    review_sessions_list_failed: '리뷰 세션 목록을 불러오지 못했습니다.',
    review_session_create_failed: '리뷰 세션을 만들지 못했습니다.',
    review_token_invalid: '리뷰 링크가 만료되었거나 유효하지 않습니다.',
    review_token_verify_failed: '리뷰 링크를 확인하지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認審閱工作階段請求。',
    invalid_json: '請確認審閱工作階段請求格式。',
    review_sessions_list_failed: '無法載入審閱工作階段清單。',
    review_session_create_failed: '無法建立審閱工作階段。',
    review_token_invalid: '審閱連結已過期或無效。',
    review_token_verify_failed: '無法確認審閱連結。',
  },
  en: {
    validation_error: 'Check the review session request.',
    invalid_json: 'Check the review session request format.',
    review_sessions_list_failed: 'Unable to load review sessions.',
    review_session_create_failed: 'Unable to create the review session.',
    review_token_invalid: 'The review link is expired or invalid.',
    review_token_verify_failed: 'Unable to verify the review link.',
  },
};

export function getBuilderReviewSessionsApiErrorPayload(
  locale: Locale,
  errorCode: BuilderReviewSessionsApiErrorCode,
): BuilderReviewSessionsApiErrorPayload {
  return { error: builderReviewSessionsApiErrorMessages[locale][errorCode], errorCode };
}
