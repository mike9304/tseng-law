import type { Locale } from '@/lib/locales';

export type BuilderMembersApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'duplicate_email'
  | 'members_list_failed'
  | 'member_create_failed'
  | 'member_load_failed'
  | 'member_not_found'
  | 'member_update_failed'
  | 'member_delete_failed';

export interface BuilderMembersApiErrorPayload {
  error: string;
  errorCode: BuilderMembersApiErrorCode;
}

const builderMembersApiErrorMessages: Record<Locale, Record<BuilderMembersApiErrorCode, string>> = {
  ko: {
    validation_error: '회원 관리자 요청을 확인해 주세요.',
    invalid_json: '회원 관리자 요청 형식을 확인해 주세요.',
    duplicate_email: '이미 가입된 이메일입니다.',
    members_list_failed: '회원 목록을 불러오지 못했습니다.',
    member_create_failed: '회원을 생성하지 못했습니다.',
    member_load_failed: '회원 정보를 불러오지 못했습니다.',
    member_not_found: '회원 정보를 찾을 수 없습니다.',
    member_update_failed: '회원 정보를 저장하지 못했습니다.',
    member_delete_failed: '회원 삭제를 완료하지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認會員管理請求。',
    invalid_json: '請確認會員管理請求格式。',
    duplicate_email: '此電子郵件已註冊。',
    members_list_failed: '無法載入會員清單。',
    member_create_failed: '無法建立會員。',
    member_load_failed: '無法載入會員資料。',
    member_not_found: '找不到會員資料。',
    member_update_failed: '無法儲存會員資料。',
    member_delete_failed: '無法完成會員刪除。',
  },
  en: {
    validation_error: 'Check the member admin request.',
    invalid_json: 'Check the member admin request format.',
    duplicate_email: 'That email is already registered.',
    members_list_failed: 'Unable to load members.',
    member_create_failed: 'Unable to create the member.',
    member_load_failed: 'Unable to load member details.',
    member_not_found: 'Member not found.',
    member_update_failed: 'Unable to save member details.',
    member_delete_failed: 'Unable to delete the member.',
  },
};

export function getBuilderMembersApiErrorPayload(
  locale: Locale,
  errorCode: BuilderMembersApiErrorCode,
): BuilderMembersApiErrorPayload {
  return { error: builderMembersApiErrorMessages[locale][errorCode], errorCode };
}
