import { describe, expect, it } from 'vitest';
import { getBuilderBlogApiErrorPayload } from '@/lib/builder/blog/blog-api-copy';

describe('builder blog API copy', () => {
  it('returns localized stable-code blog API errors', () => {
    expect(getBuilderBlogApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '블로그 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getBuilderBlogApiErrorPayload('zh-hant', 'blog_admin_load_failed')).toEqual({
      error: '無法載入部落格管理模型。',
      errorCode: 'blog_admin_load_failed',
    });
    expect(getBuilderBlogApiErrorPayload('en', 'blog_posts_load_failed')).toEqual({
      error: 'Unable to load blog posts.',
      errorCode: 'blog_posts_load_failed',
    });
  });
});
