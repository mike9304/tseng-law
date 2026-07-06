import { describe, expect, it } from 'vitest';
import { getBuilderColumnsApiErrorPayload } from '@/lib/builder/columns/columns-api-copy';

describe('getBuilderColumnsApiErrorPayload', () => {
  it('returns localized stable-code column errors', () => {
    expect(getBuilderColumnsApiErrorPayload('ko', 'invalid_json')).toEqual({
      error: '칼럼 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(getBuilderColumnsApiErrorPayload('zh-hant', 'column_not_found')).toEqual({
      error: '找不到專欄。',
      errorCode: 'column_not_found',
    });
    expect(getBuilderColumnsApiErrorPayload('en', 'column_publish_failed')).toEqual({
      error: 'Unable to publish the column.',
      errorCode: 'column_publish_failed',
    });
  });
});
