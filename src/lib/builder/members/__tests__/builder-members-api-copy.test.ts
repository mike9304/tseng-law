import { describe, expect, it } from 'vitest';
import { getBuilderMembersApiErrorPayload } from '@/lib/builder/members/builder-members-api-copy';

describe('builder members API copy', () => {
  it('returns localized stable-code member admin API errors', () => {
    expect(getBuilderMembersApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '회원 관리자 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getBuilderMembersApiErrorPayload('zh-hant', 'duplicate_email')).toEqual({
      error: '此電子郵件已註冊。',
      errorCode: 'duplicate_email',
    });
    expect(getBuilderMembersApiErrorPayload('en', 'member_load_failed')).toEqual({
      error: 'Unable to load member details.',
      errorCode: 'member_load_failed',
    });
    expect(getBuilderMembersApiErrorPayload('ko', 'member_delete_failed')).toEqual({
      error: '회원 삭제를 완료하지 못했습니다.',
      errorCode: 'member_delete_failed',
    });
  });
});
