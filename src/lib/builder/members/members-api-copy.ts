import type { Locale } from '@/lib/locales';

export type MembersApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'invalid_credentials'
  | 'member_not_found'
  | 'session_create_failed'
  | 'duplicate_email'
  | 'member_login_failed'
  | 'member_signup_failed'
  | 'public_signup_disabled'
  | 'not_authenticated'
  | 'email_change_requires_verification'
  | 'profile_update_failed'
  | 'member_bookings_failed';

export interface MembersApiErrorPayload {
  error: string;
  errorCode: MembersApiErrorCode;
}

const membersApiErrorMessages: Record<Locale, Record<MembersApiErrorCode, string>> = {
  ko: {
    validation_error: '회원 요청을 확인해 주세요.',
    invalid_json: '회원 요청 형식을 확인해 주세요.',
    invalid_credentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
    member_not_found: '회원 정보를 찾을 수 없습니다.',
    session_create_failed: '회원 세션을 만들지 못했습니다.',
    duplicate_email: '이미 가입된 이메일입니다.',
    member_login_failed: '로그인하지 못했습니다.',
    member_signup_failed: '회원가입을 완료하지 못했습니다.',
    public_signup_disabled: '공개 회원가입은 지원하지 않습니다. 회원 계정은 담당자가 확인 후 발급합니다.',
    not_authenticated: '로그인이 필요합니다.',
    email_change_requires_verification: '이메일 변경에는 인증 절차가 필요합니다.',
    profile_update_failed: '회원 프로필을 저장하지 못했습니다.',
    member_bookings_failed: '회원 예약 정보를 불러오지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認會員請求。',
    invalid_json: '請確認會員請求格式。',
    invalid_credentials: '電子郵件或密碼不正確。',
    member_not_found: '找不到會員資料。',
    session_create_failed: '無法建立會員工作階段。',
    duplicate_email: '此電子郵件已註冊。',
    member_login_failed: '無法登入。',
    member_signup_failed: '無法完成會員註冊。',
    public_signup_disabled: '目前不提供公開註冊。會員帳戶將由事務所確認後建立。',
    not_authenticated: '需要登入。',
    email_change_requires_verification: '變更電子郵件需要先完成驗證。',
    profile_update_failed: '無法儲存會員個人資料。',
    member_bookings_failed: '無法載入會員預約資訊。',
  },
  en: {
    validation_error: 'Check the member request.',
    invalid_json: 'Check the member request format.',
    invalid_credentials: 'Email or password is incorrect.',
    member_not_found: 'Member not found.',
    session_create_failed: 'Unable to create a member session.',
    duplicate_email: 'That email is already registered.',
    member_login_failed: 'Unable to sign in.',
    member_signup_failed: 'Unable to create the member account.',
    public_signup_disabled: 'Public signup is unavailable. Member accounts are issued by the firm after review.',
    not_authenticated: 'Sign in is required.',
    email_change_requires_verification: 'Email changes require verification.',
    profile_update_failed: 'Unable to save member profile.',
    member_bookings_failed: 'Unable to load member bookings.',
  },
};

export function getMembersApiErrorPayload(
  locale: Locale,
  errorCode: MembersApiErrorCode,
): MembersApiErrorPayload {
  return {
    error: membersApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
