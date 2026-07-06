import type { Locale } from '@/lib/locales';

export type CommerceSubscriptionsApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'subscriptions_list_failed'
  | 'subscription_create_failed'
  | 'subscription_update_failed'
  | 'subscription_delete_failed'
  | 'subscription_load_failed'
  | 'plan_not_found'
  | 'plan_archived'
  | 'plan_delete_failed'
  | 'subscription_not_found'
  | 'customer_email_required'
  | 'transition_not_allowed'
  | 'transition_failed'
  | 'invalid_id'
  | 'id_kind_mismatch';

export interface CommerceSubscriptionsApiErrorPayload {
  error: string;
  errorCode: CommerceSubscriptionsApiErrorCode;
}

const commerceSubscriptionsApiErrorMessages: Record<Locale, Record<CommerceSubscriptionsApiErrorCode, string>> = {
  ko: {
    validation_error: '구독 요청을 확인해 주세요.',
    invalid_json: '구독 요청 형식을 확인해 주세요.',
    subscriptions_list_failed: '구독 목록을 불러오지 못했습니다.',
    subscription_create_failed: '구독을 만들지 못했습니다.',
    subscription_update_failed: '구독을 업데이트하지 못했습니다.',
    subscription_delete_failed: '구독을 삭제하지 못했습니다.',
    subscription_load_failed: '구독 정보를 불러오지 못했습니다.',
    plan_not_found: '구독 플랜을 찾을 수 없습니다.',
    plan_archived: '보관된 구독 플랜에는 가입할 수 없습니다.',
    plan_delete_failed: '사용 중인 구독 플랜은 삭제할 수 없습니다.',
    subscription_not_found: '구독을 찾을 수 없습니다.',
    customer_email_required: '고객 이메일이 필요합니다.',
    transition_not_allowed: '현재 상태에서는 이 구독 작업을 할 수 없습니다.',
    transition_failed: '구독 상태를 변경하지 못했습니다.',
    invalid_id: '구독 또는 플랜 ID를 확인해 주세요.',
    id_kind_mismatch: '요청한 ID 유형과 작업 유형이 일치하지 않습니다.',
  },
  'zh-hant': {
    validation_error: '請確認訂閱請求。',
    invalid_json: '請確認訂閱請求格式。',
    subscriptions_list_failed: '無法載入訂閱列表。',
    subscription_create_failed: '無法建立訂閱。',
    subscription_update_failed: '無法更新訂閱。',
    subscription_delete_failed: '無法刪除訂閱。',
    subscription_load_failed: '無法載入訂閱資訊。',
    plan_not_found: '找不到訂閱方案。',
    plan_archived: '無法加入已封存的訂閱方案。',
    plan_delete_failed: '無法刪除使用中的訂閱方案。',
    subscription_not_found: '找不到訂閱。',
    customer_email_required: '需要顧客電子郵件。',
    transition_not_allowed: '目前狀態無法執行此訂閱操作。',
    transition_failed: '無法變更訂閱狀態。',
    invalid_id: '請確認訂閱或方案 ID。',
    id_kind_mismatch: '請求的 ID 類型與操作類型不一致。',
  },
  en: {
    validation_error: 'Check the subscription request.',
    invalid_json: 'Check the subscription request format.',
    subscriptions_list_failed: 'Unable to load subscriptions.',
    subscription_create_failed: 'Unable to create subscription.',
    subscription_update_failed: 'Unable to update subscription.',
    subscription_delete_failed: 'Unable to delete subscription.',
    subscription_load_failed: 'Unable to load subscription details.',
    plan_not_found: 'Subscription plan not found.',
    plan_archived: 'Archived subscription plans cannot be joined.',
    plan_delete_failed: 'Unable to delete a subscription plan that is in use.',
    subscription_not_found: 'Subscription not found.',
    customer_email_required: 'Customer email is required.',
    transition_not_allowed: 'This subscription action is not allowed in the current state.',
    transition_failed: 'Unable to change subscription status.',
    invalid_id: 'Check the subscription or plan ID.',
    id_kind_mismatch: 'The requested ID type does not match the action type.',
  },
};

export function getCommerceSubscriptionsApiErrorPayload(
  locale: Locale,
  errorCode: CommerceSubscriptionsApiErrorCode,
): CommerceSubscriptionsApiErrorPayload {
  return {
    error: commerceSubscriptionsApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
