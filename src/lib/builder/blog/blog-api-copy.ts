import type { Locale } from '@/lib/locales';

export type BuilderBlogApiErrorCode =
  | 'validation_error'
  | 'blog_admin_load_failed'
  | 'blog_posts_load_failed';

export interface BuilderBlogApiErrorPayload {
  error: string;
  errorCode: BuilderBlogApiErrorCode;
}

const builderBlogApiErrorMessages: Record<Locale, Record<BuilderBlogApiErrorCode, string>> = {
  ko: {
    validation_error: '블로그 요청을 확인해 주세요.',
    blog_admin_load_failed: '블로그 관리자 모델을 불러오지 못했습니다.',
    blog_posts_load_failed: '블로그 글 목록을 불러오지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認部落格請求。',
    blog_admin_load_failed: '無法載入部落格管理模型。',
    blog_posts_load_failed: '無法載入部落格文章清單。',
  },
  en: {
    validation_error: 'Check the blog request.',
    blog_admin_load_failed: 'Unable to load the blog admin model.',
    blog_posts_load_failed: 'Unable to load blog posts.',
  },
};

export function getBuilderBlogApiErrorPayload(
  locale: Locale,
  errorCode: BuilderBlogApiErrorCode,
): BuilderBlogApiErrorPayload {
  return { error: builderBlogApiErrorMessages[locale][errorCode], errorCode };
}
