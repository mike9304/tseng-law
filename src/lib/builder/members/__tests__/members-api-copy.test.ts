import { describe, expect, it } from 'vitest';
import { getMembersApiErrorPayload } from '@/lib/builder/members/members-api-copy';

describe('members API copy', () => {
  it('returns localized stable-code member API errors', () => {
    expect(getMembersApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '회원 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getMembersApiErrorPayload('zh-hant', 'invalid_credentials')).toEqual({
      error: '電子郵件或密碼不正確。',
      errorCode: 'invalid_credentials',
    });
    expect(getMembersApiErrorPayload('en', 'duplicate_email')).toEqual({
      error: 'That email is already registered.',
      errorCode: 'duplicate_email',
    });
    expect(getMembersApiErrorPayload('ko', 'email_change_requires_verification')).toEqual({
      error: '이메일 변경에는 인증 절차가 필요합니다.',
      errorCode: 'email_change_requires_verification',
    });
    expect(getMembersApiErrorPayload('zh-hant', 'member_bookings_failed')).toEqual({
      error: '無法載入會員預約資訊。',
      errorCode: 'member_bookings_failed',
    });
  });
});
