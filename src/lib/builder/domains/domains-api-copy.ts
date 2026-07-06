import type { Locale } from '@/lib/locales';

export type BuilderDomainsApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'domains_list_failed'
  | 'domain_create_failed'
  | 'domain_load_failed'
  | 'domain_delete_failed'
  | 'domain_detach_failed'
  | 'domain_verify_failed'
  | 'domain_dns_pending'
  | 'domain_attach_failed'
  | 'domain_not_found';

export interface BuilderDomainsApiErrorPayload {
  error: string;
  errorCode: BuilderDomainsApiErrorCode;
}

const builderDomainsApiErrorMessages: Record<Locale, Record<BuilderDomainsApiErrorCode, string>> = {
  ko: {
    validation_error: '도메인 요청 내용을 확인해 주세요.',
    invalid_json: '도메인 요청 형식을 확인해 주세요.',
    domains_list_failed: '도메인 목록을 불러오지 못했습니다.',
    domain_create_failed: '도메인을 등록하지 못했습니다.',
    domain_load_failed: '도메인을 불러오지 못했습니다.',
    domain_delete_failed: '도메인을 제거하지 못했습니다.',
    domain_detach_failed: 'Vercel 도메인 연결을 해제하지 못했습니다.',
    domain_verify_failed: '도메인 검증을 완료하지 못했습니다.',
    domain_dns_pending: 'DNS 레코드를 아직 확인하지 못했습니다.',
    domain_attach_failed: 'Vercel 도메인 연결을 완료하지 못했습니다.',
    domain_not_found: '도메인을 찾을 수 없습니다.',
  },
  'zh-hant': {
    validation_error: '請確認網域請求內容。',
    invalid_json: '請確認網域請求格式。',
    domains_list_failed: '無法載入網域清單。',
    domain_create_failed: '無法註冊網域。',
    domain_load_failed: '無法載入網域。',
    domain_delete_failed: '無法移除網域。',
    domain_detach_failed: '無法解除 Vercel 網域連線。',
    domain_verify_failed: '無法完成網域驗證。',
    domain_dns_pending: '尚未確認 DNS 記錄。',
    domain_attach_failed: '無法完成 Vercel 網域連線。',
    domain_not_found: '找不到網域。',
  },
  en: {
    validation_error: 'Check the domain request.',
    invalid_json: 'Check the domain request format.',
    domains_list_failed: 'Unable to load domains.',
    domain_create_failed: 'Unable to register the domain.',
    domain_load_failed: 'Unable to load the domain.',
    domain_delete_failed: 'Unable to remove the domain.',
    domain_detach_failed: 'Unable to detach the Vercel domain.',
    domain_verify_failed: 'Unable to complete domain verification.',
    domain_dns_pending: 'DNS records are not verified yet.',
    domain_attach_failed: 'Unable to attach the Vercel domain.',
    domain_not_found: 'Domain not found.',
  },
};

export function getBuilderDomainsApiErrorPayload(
  locale: Locale,
  errorCode: BuilderDomainsApiErrorCode,
): BuilderDomainsApiErrorPayload {
  return { error: builderDomainsApiErrorMessages[locale][errorCode], errorCode };
}
