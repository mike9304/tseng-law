import type { Locale } from '@/lib/locales';

export type BuilderCrmApiErrorCode =
  | 'invalid_json'
  | 'invalid_contact_payload'
  | 'contacts_list_failed'
  | 'contact_create_failed'
  | 'contact_load_failed'
  | 'contact_update_failed'
  | 'contact_delete_failed'
  | 'contact_not_found'
  | 'invalid_automation_payload'
  | 'invalid_automation_patch'
  | 'automations_list_failed'
  | 'automation_create_failed'
  | 'automation_update_failed'
  | 'automation_delete_failed'
  | 'automation_not_found'
  | 'invalid_integration_payload'
  | 'integrations_list_failed'
  | 'integration_create_failed'
  | 'integration_update_failed'
  | 'integration_delete_failed'
  | 'integration_not_found'
  | 'invalid_segment_payload'
  | 'segments_list_failed'
  | 'segment_create_failed'
  | 'segment_preview_failed'
  | 'outbox_list_failed'
  | 'send_queue_stats_failed'
  | 'tracking_not_configured'
  | 'tracking_invalid_token';

export interface BuilderCrmApiErrorPayload {
  error: string;
  errorCode: BuilderCrmApiErrorCode;
}

const builderCrmApiErrorMessages: Record<Locale, Record<BuilderCrmApiErrorCode, string>> = {
  ko: {
    invalid_json: 'CRM 요청 형식을 확인해 주세요.',
    invalid_contact_payload: '연락처 정보를 확인해 주세요.',
    contacts_list_failed: '연락처 목록을 불러오지 못했습니다.',
    contact_create_failed: '연락처를 만들지 못했습니다.',
    contact_load_failed: '연락처를 불러오지 못했습니다.',
    contact_update_failed: '연락처를 업데이트하지 못했습니다.',
    contact_delete_failed: '연락처를 삭제하지 못했습니다.',
    contact_not_found: '연락처를 찾을 수 없습니다.',
    invalid_automation_payload: '자동화 정보를 확인해 주세요.',
    invalid_automation_patch: '자동화 업데이트 정보를 확인해 주세요.',
    automations_list_failed: '자동화 목록을 불러오지 못했습니다.',
    automation_create_failed: '자동화를 만들지 못했습니다.',
    automation_update_failed: '자동화를 업데이트하지 못했습니다.',
    automation_delete_failed: '자동화를 삭제하지 못했습니다.',
    automation_not_found: '자동화를 찾을 수 없습니다.',
    invalid_integration_payload: '연동 정보를 확인해 주세요.',
    integrations_list_failed: '외부 연동 목록을 불러오지 못했습니다.',
    integration_create_failed: '외부 연동을 만들지 못했습니다.',
    integration_update_failed: '외부 연동을 수정하지 못했습니다.',
    integration_delete_failed: '외부 연동을 삭제하지 못했습니다.',
    integration_not_found: '외부 연동을 찾을 수 없습니다.',
    invalid_segment_payload: '세그먼트 정보를 확인해 주세요.',
    segments_list_failed: '세그먼트 목록을 불러오지 못했습니다.',
    segment_create_failed: '세그먼트를 만들지 못했습니다.',
    segment_preview_failed: '세그먼트 미리보기를 불러오지 못했습니다.',
    outbox_list_failed: '발송 기록을 불러오지 못했습니다.',
    send_queue_stats_failed: '전송 큐 통계를 불러오지 못했습니다.',
    tracking_not_configured: '추적 설정이 완료되지 않았습니다.',
    tracking_invalid_token: '유효하지 않은 추적 토큰입니다.',
  },
  'zh-hant': {
    invalid_json: '請確認 CRM 請求格式。',
    invalid_contact_payload: '請確認聯絡人資料。',
    contacts_list_failed: '無法載入聯絡人清單。',
    contact_create_failed: '無法建立聯絡人。',
    contact_load_failed: '無法載入聯絡人。',
    contact_update_failed: '無法更新聯絡人。',
    contact_delete_failed: '無法刪除聯絡人。',
    contact_not_found: '找不到聯絡人。',
    invalid_automation_payload: '請確認自動化資料。',
    invalid_automation_patch: '請確認自動化更新資料。',
    automations_list_failed: '無法載入自動化清單。',
    automation_create_failed: '無法建立自動化。',
    automation_update_failed: '無法更新自動化。',
    automation_delete_failed: '無法刪除自動化。',
    automation_not_found: '找不到自動化。',
    invalid_integration_payload: '請確認整合資料。',
    integrations_list_failed: '無法載入外部整合清單。',
    integration_create_failed: '無法建立外部整合。',
    integration_update_failed: '無法更新外部整合。',
    integration_delete_failed: '無法刪除外部整合。',
    integration_not_found: '找不到外部整合。',
    invalid_segment_payload: '請確認分眾資料。',
    segments_list_failed: '無法載入分眾清單。',
    segment_create_failed: '無法建立分眾。',
    segment_preview_failed: '無法載入分眾預覽。',
    outbox_list_failed: '無法載入寄送紀錄。',
    send_queue_stats_failed: '無法載入傳送佇列統計。',
    tracking_not_configured: '追蹤設定尚未完成。',
    tracking_invalid_token: '追蹤權杖無效。',
  },
  en: {
    invalid_json: 'Check the CRM request format.',
    invalid_contact_payload: 'Check the contact details.',
    contacts_list_failed: 'Unable to load contacts.',
    contact_create_failed: 'Unable to create the contact.',
    contact_load_failed: 'Unable to load the contact.',
    contact_update_failed: 'Unable to update the contact.',
    contact_delete_failed: 'Unable to delete the contact.',
    contact_not_found: 'Contact not found.',
    invalid_automation_payload: 'Check the automation details.',
    invalid_automation_patch: 'Check the automation update details.',
    automations_list_failed: 'Unable to load automations.',
    automation_create_failed: 'Unable to create the automation.',
    automation_update_failed: 'Unable to update the automation.',
    automation_delete_failed: 'Unable to delete the automation.',
    automation_not_found: 'Automation not found.',
    invalid_integration_payload: 'Check the integration details.',
    integrations_list_failed: 'Unable to load external integrations.',
    integration_create_failed: 'Unable to create the external integration.',
    integration_update_failed: 'Unable to update the external integration.',
    integration_delete_failed: 'Unable to delete the external integration.',
    integration_not_found: 'External integration not found.',
    invalid_segment_payload: 'Check the segment details.',
    segments_list_failed: 'Unable to load segments.',
    segment_create_failed: 'Unable to create the segment.',
    segment_preview_failed: 'Unable to load the segment preview.',
    outbox_list_failed: 'Unable to load outbox records.',
    send_queue_stats_failed: 'Unable to load send queue stats.',
    tracking_not_configured: 'Tracking is not configured.',
    tracking_invalid_token: 'The tracking token is invalid.',
  },
};

export function getBuilderCrmApiErrorPayload(
  locale: Locale,
  errorCode: BuilderCrmApiErrorCode,
): BuilderCrmApiErrorPayload {
  return { error: builderCrmApiErrorMessages[locale][errorCode], errorCode };
}
