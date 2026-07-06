import type { Locale } from '@/lib/locales';

export type ExperimentsApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'too_many_requests'
  | 'experiments_list_failed'
  | 'experiment_create_failed'
  | 'experiment_load_failed'
  | 'experiment_update_failed'
  | 'experiment_results_failed'
  | 'experiment_assign_failed'
  | 'experiment_event_failed'
  | 'experiment_not_found'
  | 'experiment_id_required'
  | 'duplicate_variant_ids'
  | 'unknown_variant';

export interface ExperimentsApiErrorPayload {
  error: string;
  errorCode: ExperimentsApiErrorCode;
}

const experimentsApiErrorMessages: Record<Locale, Record<ExperimentsApiErrorCode, string>> = {
  ko: {
    validation_error: '실험 요청 내용을 확인해 주세요.',
    invalid_json: '실험 요청 형식을 확인해 주세요.',
    too_many_requests: '실험 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    experiments_list_failed: '실험 목록을 불러오지 못했습니다.',
    experiment_create_failed: '실험을 만들지 못했습니다.',
    experiment_load_failed: '실험을 불러오지 못했습니다.',
    experiment_update_failed: '실험을 저장하지 못했습니다.',
    experiment_results_failed: '실험 결과를 불러오지 못했습니다.',
    experiment_assign_failed: '실험 변형을 배정하지 못했습니다.',
    experiment_event_failed: '실험 전환 이벤트를 저장하지 못했습니다.',
    experiment_not_found: '실험을 찾을 수 없습니다.',
    experiment_id_required: '실험 ID가 필요합니다.',
    duplicate_variant_ids: '변형 ID는 중복될 수 없습니다.',
    unknown_variant: '알 수 없는 실험 변형입니다.',
  },
  'zh-hant': {
    validation_error: '請確認實驗請求內容。',
    invalid_json: '請確認實驗請求格式。',
    too_many_requests: '實驗請求過多，請稍後再試。',
    experiments_list_failed: '無法載入實驗清單。',
    experiment_create_failed: '無法建立實驗。',
    experiment_load_failed: '無法載入實驗。',
    experiment_update_failed: '無法儲存實驗。',
    experiment_results_failed: '無法載入實驗結果。',
    experiment_assign_failed: '無法分配實驗變體。',
    experiment_event_failed: '無法儲存實驗轉換事件。',
    experiment_not_found: '找不到實驗。',
    experiment_id_required: '需要實驗 ID。',
    duplicate_variant_ids: '變體 ID 不可重複。',
    unknown_variant: '未知的實驗變體。',
  },
  en: {
    validation_error: 'Check the experiment request.',
    invalid_json: 'Check the experiment request format.',
    too_many_requests: 'Too many experiment requests. Try again shortly.',
    experiments_list_failed: 'Unable to load experiments.',
    experiment_create_failed: 'Unable to create the experiment.',
    experiment_load_failed: 'Unable to load the experiment.',
    experiment_update_failed: 'Unable to save the experiment.',
    experiment_results_failed: 'Unable to load experiment results.',
    experiment_assign_failed: 'Unable to assign the experiment variant.',
    experiment_event_failed: 'Unable to save the experiment conversion event.',
    experiment_not_found: 'Experiment not found.',
    experiment_id_required: 'experimentId is required.',
    duplicate_variant_ids: 'Variant ids must be unique.',
    unknown_variant: 'Unknown experiment variant.',
  },
};

export function getExperimentsApiErrorPayload(
  locale: Locale,
  errorCode: ExperimentsApiErrorCode,
): ExperimentsApiErrorPayload {
  return { error: experimentsApiErrorMessages[locale][errorCode], errorCode };
}
