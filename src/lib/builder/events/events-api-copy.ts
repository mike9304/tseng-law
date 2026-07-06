import type { Locale } from '@/lib/locales';

export type BuilderEventsApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'events_list_failed'
  | 'event_create_failed'
  | 'event_load_failed'
  | 'event_update_failed'
  | 'event_delete_failed'
  | 'event_not_found'
  | 'event_rsvp_failed'
  | 'event_rsvp_unavailable'
  | 'event_rsvp_closed'
  | 'event_rsvp_full'
  | 'too_many_requests';

export interface BuilderEventsApiErrorPayload {
  error: string;
  errorCode: BuilderEventsApiErrorCode;
}

const builderEventsApiErrorMessages: Record<Locale, Record<BuilderEventsApiErrorCode, string>> = {
  ko: {
    validation_error: '이벤트 요청 내용을 확인해 주세요.',
    invalid_json: '이벤트 요청 형식을 확인해 주세요.',
    events_list_failed: '이벤트 목록을 불러오지 못했습니다.',
    event_create_failed: '이벤트를 만들지 못했습니다.',
    event_load_failed: '이벤트를 불러오지 못했습니다.',
    event_update_failed: '이벤트를 저장하지 못했습니다.',
    event_delete_failed: '이벤트를 삭제하지 못했습니다.',
    event_not_found: '이벤트를 찾을 수 없습니다.',
    event_rsvp_failed: '이벤트 신청을 완료하지 못했습니다.',
    event_rsvp_unavailable: '공개된 이벤트만 신청할 수 있습니다.',
    event_rsvp_closed: '이 이벤트는 신청을 받지 않습니다.',
    event_rsvp_full: '이벤트 신청 정원이 마감되었습니다.',
    too_many_requests: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  },
  'zh-hant': {
    validation_error: '請確認活動請求內容。',
    invalid_json: '請確認活動請求格式。',
    events_list_failed: '無法載入活動清單。',
    event_create_failed: '無法建立活動。',
    event_load_failed: '無法載入活動。',
    event_update_failed: '無法儲存活動。',
    event_delete_failed: '無法刪除活動。',
    event_not_found: '找不到活動。',
    event_rsvp_failed: '無法完成活動報名。',
    event_rsvp_unavailable: '只能報名已公開的活動。',
    event_rsvp_closed: '此活動目前不接受報名。',
    event_rsvp_full: '活動報名名額已滿。',
    too_many_requests: '請求過於頻繁，請稍後再試。',
  },
  en: {
    validation_error: 'Check the event request.',
    invalid_json: 'Check the event request format.',
    events_list_failed: 'Unable to load events.',
    event_create_failed: 'Unable to create the event.',
    event_load_failed: 'Unable to load the event.',
    event_update_failed: 'Unable to save the event.',
    event_delete_failed: 'Unable to delete the event.',
    event_not_found: 'Event not found.',
    event_rsvp_failed: 'Unable to complete the event RSVP.',
    event_rsvp_unavailable: 'Only published events can accept RSVPs.',
    event_rsvp_closed: 'This event is not accepting RSVPs.',
    event_rsvp_full: 'This event is fully booked.',
    too_many_requests: 'Too many requests. Try again shortly.',
  },
};

export function getBuilderEventsApiErrorPayload(
  locale: Locale,
  errorCode: BuilderEventsApiErrorCode,
): BuilderEventsApiErrorPayload {
  return { error: builderEventsApiErrorMessages[locale][errorCode], errorCode };
}
