import type { Locale } from '@/lib/locales';

export type BuilderPortfolioApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'portfolio_list_failed'
  | 'portfolio_create_failed'
  | 'portfolio_load_failed'
  | 'portfolio_update_failed'
  | 'portfolio_delete_failed'
  | 'portfolio_project_not_found';

export interface BuilderPortfolioApiErrorPayload {
  error: string;
  errorCode: BuilderPortfolioApiErrorCode;
}

const builderPortfolioApiErrorMessages: Record<Locale, Record<BuilderPortfolioApiErrorCode, string>> = {
  ko: {
    validation_error: '포트폴리오 요청 내용을 확인해 주세요.',
    invalid_json: '포트폴리오 요청 형식을 확인해 주세요.',
    portfolio_list_failed: '포트폴리오 프로젝트 목록을 불러오지 못했습니다.',
    portfolio_create_failed: '포트폴리오 프로젝트를 만들지 못했습니다.',
    portfolio_load_failed: '포트폴리오 프로젝트를 불러오지 못했습니다.',
    portfolio_update_failed: '포트폴리오 프로젝트를 저장하지 못했습니다.',
    portfolio_delete_failed: '포트폴리오 프로젝트를 삭제하지 못했습니다.',
    portfolio_project_not_found: '포트폴리오 프로젝트를 찾을 수 없습니다.',
  },
  'zh-hant': {
    validation_error: '請確認作品集請求內容。',
    invalid_json: '請確認作品集請求格式。',
    portfolio_list_failed: '無法載入作品集專案清單。',
    portfolio_create_failed: '無法建立作品集專案。',
    portfolio_load_failed: '無法載入作品集專案。',
    portfolio_update_failed: '無法儲存作品集專案。',
    portfolio_delete_failed: '無法刪除作品集專案。',
    portfolio_project_not_found: '找不到作品集專案。',
  },
  en: {
    validation_error: 'Check the portfolio request.',
    invalid_json: 'Check the portfolio request format.',
    portfolio_list_failed: 'Unable to load portfolio projects.',
    portfolio_create_failed: 'Unable to create the portfolio project.',
    portfolio_load_failed: 'Unable to load the portfolio project.',
    portfolio_update_failed: 'Unable to save the portfolio project.',
    portfolio_delete_failed: 'Unable to delete the portfolio project.',
    portfolio_project_not_found: 'Portfolio project not found.',
  },
};

export function getBuilderPortfolioApiErrorPayload(
  locale: Locale,
  errorCode: BuilderPortfolioApiErrorCode,
): BuilderPortfolioApiErrorPayload {
  return { error: builderPortfolioApiErrorMessages[locale][errorCode], errorCode };
}
