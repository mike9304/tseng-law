import { describe, expect, it } from 'vitest';
import { getBuilderUsersApiErrorPayload } from '../users-api-copy';

describe('builder users API copy', () => {
  it('returns localized validation errors', () => {
    expect(getBuilderUsersApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '사용자 권한 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
  });

  it('returns localized missing-permission errors', () => {
    expect(getBuilderUsersApiErrorPayload('zh-hant', 'missing_manage_roles_permission')).toEqual({
      error: '需要角色管理權限。',
      errorCode: 'missing_manage_roles_permission',
    });
  });

  it('returns localized list failures', () => {
    expect(getBuilderUsersApiErrorPayload('en', 'users_list_failed')).toEqual({
      error: 'Unable to load user permissions.',
      errorCode: 'users_list_failed',
    });
  });

  it('returns localized delete failures', () => {
    expect(getBuilderUsersApiErrorPayload('ko', 'user_delete_failed')).toEqual({
      error: '사용자 권한을 삭제하지 못했습니다.',
      errorCode: 'user_delete_failed',
    });
  });
});
