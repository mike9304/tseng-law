import type { Locale } from '@/lib/locales';

export type BuilderMarketingApiErrorCode =
  | 'invalid_json'
  | 'invalid_campaign_payload'
  | 'campaigns_list_failed'
  | 'campaign_create_failed'
  | 'campaign_load_failed'
  | 'campaign_not_found'
  | 'campaign_in_flight'
  | 'invalid_campaign_update'
  | 'campaign_update_failed'
  | 'campaign_stats_failed'
  | 'invalid_send_payload'
  | 'campaign_test_send_failed'
  | 'campaign_batch_send_failed'
  | 'deliverability_report_failed'
  | 'invalid_deliverability_payload'
  | 'deliverability_check_failed'
  | 'deliverability_test_failed'
  | 'subscribers_list_failed'
  | 'invalid_subscriber_payload'
  | 'subscriber_create_failed'
  | 'invalid_import_payload'
  | 'import_payload_too_large'
  | 'subscriber_import_row_failed'
  | 'templates_list_failed'
  | 'invalid_template_payload'
  | 'template_create_failed'
  | 'template_load_failed'
  | 'template_not_found'
  | 'template_render_failed'
  | 'invalid_template_update'
  | 'template_update_failed';

export type PublicMarketingApiErrorCode =
  | 'too_many_requests'
  | 'unauthorized'
  | 'invalid_json'
  | 'invalid_subscribe_payload'
  | 'missing_token'
  | 'invalid_token'
  | 'expired_token'
  | 'invalid_redirect';

export interface BuilderMarketingApiErrorPayload {
  error: string;
  errorCode: BuilderMarketingApiErrorCode;
}

export interface PublicMarketingApiErrorPayload {
  error: string;
  errorCode: PublicMarketingApiErrorCode;
}

export interface PublicMarketingUnsubscribePageCopy {
  alreadyDonePageTitle: string;
  alreadyDoneTitle: string;
  alreadyDoneBody: string;
  confirmationPageTitle: string;
  confirmationTitle: string;
  confirmationBody: string;
  confirmButton: string;
  accidentalHint: string;
}

const builderMarketingApiErrorMessages: Record<Locale, Record<BuilderMarketingApiErrorCode, string>> = {
  ko: {
    invalid_json: '마케팅 요청 형식을 확인해 주세요.',
    invalid_campaign_payload: '캠페인 정보를 확인해 주세요.',
    campaigns_list_failed: '캠페인 목록을 불러오지 못했습니다.',
    campaign_create_failed: '캠페인을 만들지 못했습니다.',
    campaign_load_failed: '캠페인을 불러오지 못했습니다.',
    campaign_not_found: '캠페인을 찾을 수 없습니다.',
    campaign_in_flight: '이미 발송 중이거나 발송된 캠페인은 수정할 수 없습니다.',
    invalid_campaign_update: '캠페인 업데이트 정보를 확인해 주세요.',
    campaign_update_failed: '캠페인을 업데이트하지 못했습니다.',
    campaign_stats_failed: '캠페인 통계를 불러오지 못했습니다.',
    invalid_send_payload: '캠페인 발송 요청을 확인해 주세요.',
    campaign_test_send_failed: '테스트 메일을 발송하지 못했습니다.',
    campaign_batch_send_failed: '캠페인 발송을 완료하지 못했습니다.',
    deliverability_report_failed: '발송 준비 상태를 확인하지 못했습니다.',
    invalid_deliverability_payload: '발송 테스트 정보를 확인해 주세요.',
    deliverability_check_failed: '운영 발송 준비가 완료되지 않았습니다.',
    deliverability_test_failed: '발송 테스트 메일을 보내지 못했습니다.',
    subscribers_list_failed: '구독자 목록을 불러오지 못했습니다.',
    invalid_subscriber_payload: '구독자 정보를 확인해 주세요.',
    subscriber_create_failed: '구독자를 저장하지 못했습니다.',
    invalid_import_payload: '구독자 가져오기 정보를 확인해 주세요.',
    import_payload_too_large: '가져오기 파일이 너무 큽니다.',
    subscriber_import_row_failed: '구독자 행을 가져오지 못했습니다.',
    templates_list_failed: '템플릿 목록을 불러오지 못했습니다.',
    invalid_template_payload: '템플릿 정보를 확인해 주세요.',
    template_create_failed: '템플릿을 만들지 못했습니다.',
    template_load_failed: '템플릿을 불러오지 못했습니다.',
    template_not_found: '템플릿을 찾을 수 없습니다.',
    template_render_failed: '템플릿 미리보기를 렌더링하지 못했습니다.',
    invalid_template_update: '템플릿 업데이트 정보를 확인해 주세요.',
    template_update_failed: '템플릿을 업데이트하지 못했습니다.',
  },
  'zh-hant': {
    invalid_json: '請確認行銷請求格式。',
    invalid_campaign_payload: '請確認活動資料。',
    campaigns_list_failed: '無法載入活動清單。',
    campaign_create_failed: '無法建立活動。',
    campaign_load_failed: '無法載入活動。',
    campaign_not_found: '找不到活動。',
    campaign_in_flight: '發送中或已發送的活動無法修改。',
    invalid_campaign_update: '請確認活動更新資料。',
    campaign_update_failed: '無法更新活動。',
    campaign_stats_failed: '無法載入活動統計。',
    invalid_send_payload: '請確認活動發送請求。',
    campaign_test_send_failed: '無法發送測試郵件。',
    campaign_batch_send_failed: '無法完成活動發送。',
    deliverability_report_failed: '無法檢查發送準備狀態。',
    invalid_deliverability_payload: '請確認發送測試資料。',
    deliverability_check_failed: '正式發送準備尚未完成。',
    deliverability_test_failed: '無法發送測試郵件。',
    subscribers_list_failed: '無法載入訂閱者清單。',
    invalid_subscriber_payload: '請確認訂閱者資料。',
    subscriber_create_failed: '無法儲存訂閱者。',
    invalid_import_payload: '請確認訂閱者匯入資料。',
    import_payload_too_large: '匯入檔案過大。',
    subscriber_import_row_failed: '無法匯入訂閱者列。',
    templates_list_failed: '無法載入範本清單。',
    invalid_template_payload: '請確認範本資料。',
    template_create_failed: '無法建立範本。',
    template_load_failed: '無法載入範本。',
    template_not_found: '找不到範本。',
    template_render_failed: '無法渲染範本預覽。',
    invalid_template_update: '請確認範本更新資料。',
    template_update_failed: '無法更新範本。',
  },
  en: {
    invalid_json: 'Check the marketing request format.',
    invalid_campaign_payload: 'Check the campaign details.',
    campaigns_list_failed: 'Unable to load campaigns.',
    campaign_create_failed: 'Unable to create the campaign.',
    campaign_load_failed: 'Unable to load the campaign.',
    campaign_not_found: 'Campaign not found.',
    campaign_in_flight: 'Campaigns already sending or sent cannot be edited.',
    invalid_campaign_update: 'Check the campaign update details.',
    campaign_update_failed: 'Unable to update the campaign.',
    campaign_stats_failed: 'Unable to load campaign stats.',
    invalid_send_payload: 'Check the campaign send request.',
    campaign_test_send_failed: 'Unable to send the test email.',
    campaign_batch_send_failed: 'Unable to complete the campaign send.',
    deliverability_report_failed: 'Unable to check delivery readiness.',
    invalid_deliverability_payload: 'Check the deliverability test details.',
    deliverability_check_failed: 'Production delivery readiness is incomplete.',
    deliverability_test_failed: 'Unable to send the deliverability test email.',
    subscribers_list_failed: 'Unable to load subscribers.',
    invalid_subscriber_payload: 'Check the subscriber details.',
    subscriber_create_failed: 'Unable to save the subscriber.',
    invalid_import_payload: 'Check the subscriber import details.',
    import_payload_too_large: 'The import file is too large.',
    subscriber_import_row_failed: 'Unable to import the subscriber row.',
    templates_list_failed: 'Unable to load templates.',
    invalid_template_payload: 'Check the template details.',
    template_create_failed: 'Unable to create the template.',
    template_load_failed: 'Unable to load the template.',
    template_not_found: 'Template not found.',
    template_render_failed: 'Unable to render the template preview.',
    invalid_template_update: 'Check the template update details.',
    template_update_failed: 'Unable to update the template.',
  },
};

const publicMarketingApiErrorMessages: Record<Locale, Record<PublicMarketingApiErrorCode, string>> = {
  ko: {
    too_many_requests: '잠시 후 다시 시도해 주세요.',
    unauthorized: '인증되지 않은 마케팅 요청입니다.',
    invalid_json: '요청 형식을 확인해 주세요.',
    invalid_subscribe_payload: '구독 정보를 확인해 주세요.',
    missing_token: '확인 토큰이 필요합니다.',
    invalid_token: '유효하지 않은 확인 토큰입니다.',
    expired_token: '확인 링크가 만료되었습니다. 다시 구독해 주세요.',
    invalid_redirect: '이동할 링크를 확인해 주세요.',
  },
  'zh-hant': {
    too_many_requests: '請稍後再試。',
    unauthorized: '行銷請求未通過授權。',
    invalid_json: '請確認請求格式。',
    invalid_subscribe_payload: '請確認訂閱資料。',
    missing_token: '需要確認權杖。',
    invalid_token: '確認權杖無效。',
    expired_token: '確認連結已過期。請重新訂閱。',
    invalid_redirect: '請確認要前往的連結。',
  },
  en: {
    too_many_requests: 'Try again shortly.',
    unauthorized: 'The marketing request is not authorized.',
    invalid_json: 'Check the request format.',
    invalid_subscribe_payload: 'Check the subscription details.',
    missing_token: 'A confirmation token is required.',
    invalid_token: 'The confirmation token is invalid.',
    expired_token: 'The confirmation link has expired. Please subscribe again.',
    invalid_redirect: 'Check the destination link.',
  },
};

const publicMarketingUnsubscribePageCopy: Record<Locale, PublicMarketingUnsubscribePageCopy> = {
  ko: {
    alreadyDonePageTitle: '구독 해지 완료',
    alreadyDoneTitle: '이미 구독이 해지된 상태입니다',
    alreadyDoneBody: '{email} 주소는 더 이상 메일을 받지 않습니다.',
    confirmationPageTitle: '구독 해지 확인',
    confirmationTitle: '구독 해지를 확인해주세요',
    confirmationBody: '{email} 주소로 발송되는 마케팅 메일 수신을 중단합니다.',
    confirmButton: '구독 해지 확정',
    accidentalHint: '실수로 클릭하신 경우 그냥 이 페이지를 닫으세요.',
  },
  'zh-hant': {
    alreadyDonePageTitle: '取消訂閱完成',
    alreadyDoneTitle: '此訂閱已取消',
    alreadyDoneBody: '{email} 將不再收到行銷郵件。',
    confirmationPageTitle: '確認取消訂閱',
    confirmationTitle: '請確認取消訂閱',
    confirmationBody: '我們將停止向 {email} 發送行銷郵件。',
    confirmButton: '確認取消訂閱',
    accidentalHint: '如果是不小心點擊，請直接關閉此頁面。',
  },
  en: {
    alreadyDonePageTitle: 'Unsubscribed',
    alreadyDoneTitle: 'This subscription is already canceled',
    alreadyDoneBody: '{email} will no longer receive marketing email.',
    confirmationPageTitle: 'Confirm unsubscribe',
    confirmationTitle: 'Confirm unsubscribe',
    confirmationBody: 'Marketing email to {email} will stop.',
    confirmButton: 'Confirm unsubscribe',
    accidentalHint: 'If you clicked by mistake, close this page.',
  },
};

export function getBuilderMarketingApiErrorPayload(
  locale: Locale,
  errorCode: BuilderMarketingApiErrorCode,
): BuilderMarketingApiErrorPayload {
  return { error: builderMarketingApiErrorMessages[locale][errorCode], errorCode };
}

export function getPublicMarketingApiErrorPayload(
  locale: Locale,
  errorCode: PublicMarketingApiErrorCode,
): PublicMarketingApiErrorPayload {
  return { error: publicMarketingApiErrorMessages[locale][errorCode], errorCode };
}

export function getPublicMarketingUnsubscribePageCopy(
  locale: Locale,
): PublicMarketingUnsubscribePageCopy {
  return publicMarketingUnsubscribePageCopy[locale];
}
