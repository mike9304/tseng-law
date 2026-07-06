import { describe, expect, it } from 'vitest';
import { getBuilderDomainsApiErrorPayload } from '../domains-api-copy';

describe('getBuilderDomainsApiErrorPayload', () => {
  it('returns localized stable-code domain API payloads', () => {
    expect(getBuilderDomainsApiErrorPayload('ko', 'domain_dns_pending')).toEqual({
      error: 'DNS 레코드를 아직 확인하지 못했습니다.',
      errorCode: 'domain_dns_pending',
    });
    expect(getBuilderDomainsApiErrorPayload('zh-hant', 'domain_not_found')).toEqual({
      error: '找不到網域。',
      errorCode: 'domain_not_found',
    });
    expect(getBuilderDomainsApiErrorPayload('en', 'domain_attach_failed')).toEqual({
      error: 'Unable to attach the Vercel domain.',
      errorCode: 'domain_attach_failed',
    });
  });
});
