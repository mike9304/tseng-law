import { describe, expect, it } from 'vitest';
import { getBuilderWorkspaceApiErrorPayload } from '@/lib/builder/workspace/workspace-api-copy';

describe('builder workspace API copy', () => {
  it('returns localized stable-code workspace API errors', () => {
    expect(getBuilderWorkspaceApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '작업 공간 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getBuilderWorkspaceApiErrorPayload('zh-hant', 'member_not_found')).toEqual({
      error: '找不到工作區成員。',
      errorCode: 'member_not_found',
    });
    expect(getBuilderWorkspaceApiErrorPayload('en', 'owner_role_required')).toEqual({
      error: 'A workspace must keep at least one owner.',
      errorCode: 'owner_role_required',
    });
    expect(getBuilderWorkspaceApiErrorPayload('ko', 'asset_file_required')).toEqual({
      error: '업로드할 이미지 파일을 선택해 주세요.',
      errorCode: 'asset_file_required',
    });
    expect(getBuilderWorkspaceApiErrorPayload('zh-hant', 'analytics_load_failed')).toEqual({
      error: '無法載入工作區分析。',
      errorCode: 'analytics_load_failed',
    });
    expect(getBuilderWorkspaceApiErrorPayload('en', 'cms_collections_failed')).toEqual({
      error: 'Unable to load workspace CMS collections.',
      errorCode: 'cms_collections_failed',
    });
  });
});
