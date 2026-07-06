import type { Locale } from '@/lib/locales';

export type BuilderUsersApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'missing_manage_roles_permission'
  | 'users_list_failed'
  | 'user_create_failed'
  | 'user_update_failed'
  | 'user_delete_failed'
  | 'user_not_found';

export interface BuilderUsersApiErrorPayload {
  error: string;
  errorCode: BuilderUsersApiErrorCode;
}

const builderUsersApiErrorMessages: Record<Locale, Record<BuilderUsersApiErrorCode, string>> = {
  ko: {
    validation_error: '사용자 권한 요청을 확인해 주세요.',
    invalid_json: '사용자 권한 요청 형식을 확인해 주세요.',
    missing_manage_roles_permission: '역할 관리 권한이 필요합니다.',
    users_list_failed: '사용자 권한 목록을 불러오지 못했습니다.',
    user_create_failed: '사용자 권한을 추가하지 못했습니다.',
    user_update_failed: '사용자 권한을 저장하지 못했습니다.',
    user_delete_failed: '사용자 권한을 삭제하지 못했습니다.',
    user_not_found: '사용자 권한을 찾을 수 없습니다.',
  },
  'zh-hant': {
    validation_error: '請確認使用者權限請求。',
    invalid_json: '請確認使用者權限請求格式。',
    missing_manage_roles_permission: '需要角色管理權限。',
    users_list_failed: '無法載入使用者權限清單。',
    user_create_failed: '無法新增使用者權限。',
    user_update_failed: '無法儲存使用者權限。',
    user_delete_failed: '無法刪除使用者權限。',
    user_not_found: '找不到使用者權限。',
  },
  en: {
    validation_error: 'Check the user permissions request.',
    invalid_json: 'Check the user permissions request format.',
    missing_manage_roles_permission: 'Role management permission is required.',
    users_list_failed: 'Unable to load user permissions.',
    user_create_failed: 'Unable to add user permissions.',
    user_update_failed: 'Unable to save user permissions.',
    user_delete_failed: 'Unable to delete user permissions.',
    user_not_found: 'User permissions not found.',
  },
};

export function getBuilderUsersApiErrorPayload(
  locale: Locale,
  errorCode: BuilderUsersApiErrorCode,
): BuilderUsersApiErrorPayload {
  return { error: builderUsersApiErrorMessages[locale][errorCode], errorCode };
}
