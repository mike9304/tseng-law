import type { Locale } from '@/lib/locales';

export type BuilderAppsApiErrorCode =
  | 'invalid_request'
  | 'invalid_json'
  | 'apps_list_failed'
  | 'app_catalog_failed'
  | 'app_not_found'
  | 'app_not_installed'
  | 'app_migration_failed'
  | 'app_rollback_unavailable'
  | 'app_restore_unavailable'
  | 'invalid_app_settings'
  | 'app_disabled'
  | 'app_scope_not_granted'
  | 'app_scope_check_failed'
  | 'app_action_failed'
  | 'app_settings_save_failed'
  | 'hooks_list_failed'
  | 'invalid_app_id'
  | 'invalid_hook_id'
  | 'hook_register_failed'
  | 'hook_invoke_failed'
  | 'hook_deliveries_failed'
  | 'hook_delivery_not_found'
  | 'hook_retry_unavailable'
  | 'hook_retry_failed';

export interface BuilderAppsApiErrorPayload {
  error: string;
  errorCode: BuilderAppsApiErrorCode;
}

const builderAppsApiErrorMessages: Record<Locale, Record<BuilderAppsApiErrorCode, string>> = {
  ko: {
    invalid_request: '앱 요청을 확인해 주세요.',
    invalid_json: '앱 요청 형식을 확인해 주세요.',
    apps_list_failed: '앱 목록을 불러오지 못했습니다.',
    app_catalog_failed: '앱 카탈로그를 불러오지 못했습니다.',
    app_not_found: '앱을 찾을 수 없습니다.',
    app_not_installed: '설치된 앱을 찾을 수 없습니다.',
    app_migration_failed: '앱 마이그레이션을 완료하지 못했습니다.',
    app_rollback_unavailable: '이 앱은 롤백할 수 없습니다.',
    app_restore_unavailable: '이 앱은 복원할 수 없습니다.',
    invalid_app_settings: '앱 설정값을 확인해 주세요.',
    app_disabled: '앱이 비활성화되어 있습니다.',
    app_scope_not_granted: '앱에 필요한 권한이 없습니다.',
    app_scope_check_failed: '앱 권한을 확인하지 못했습니다.',
    app_action_failed: '앱 작업을 완료하지 못했습니다.',
    app_settings_save_failed: '앱 설정을 저장하지 못했습니다.',
    hooks_list_failed: '앱 훅 목록을 불러오지 못했습니다.',
    invalid_app_id: '앱 ID를 확인해 주세요.',
    invalid_hook_id: '앱 훅 ID를 확인해 주세요.',
    hook_register_failed: '앱 훅을 등록하지 못했습니다.',
    hook_invoke_failed: '앱 훅을 실행하지 못했습니다.',
    hook_deliveries_failed: '앱 훅 전달 기록을 불러오지 못했습니다.',
    hook_delivery_not_found: '앱 훅 전달 기록을 찾을 수 없습니다.',
    hook_retry_unavailable: '이 앱 훅 전달은 다시 실행할 수 없습니다.',
    hook_retry_failed: '앱 훅 전달을 다시 실행하지 못했습니다.',
  },
  'zh-hant': {
    invalid_request: '請確認應用請求。',
    invalid_json: '請確認應用請求格式。',
    apps_list_failed: '無法載入應用清單。',
    app_catalog_failed: '無法載入應用目錄。',
    app_not_found: '找不到應用。',
    app_not_installed: '找不到已安裝的應用。',
    app_migration_failed: '無法完成應用遷移。',
    app_rollback_unavailable: '此應用無法回復。',
    app_restore_unavailable: '此應用無法還原。',
    invalid_app_settings: '請確認應用設定值。',
    app_disabled: '應用已停用。',
    app_scope_not_granted: '應用缺少必要權限。',
    app_scope_check_failed: '無法確認應用權限。',
    app_action_failed: '無法完成應用操作。',
    app_settings_save_failed: '無法儲存應用設定。',
    hooks_list_failed: '無法載入應用 Hook 清單。',
    invalid_app_id: '請確認應用 ID。',
    invalid_hook_id: '請確認應用 Hook ID。',
    hook_register_failed: '無法註冊應用 Hook。',
    hook_invoke_failed: '無法執行應用 Hook。',
    hook_deliveries_failed: '無法載入應用 Hook 傳遞記錄。',
    hook_delivery_not_found: '找不到應用 Hook 傳遞記錄。',
    hook_retry_unavailable: '此應用 Hook 傳遞無法重新執行。',
    hook_retry_failed: '無法重新執行應用 Hook 傳遞。',
  },
  en: {
    invalid_request: 'Check the app request.',
    invalid_json: 'Check the app request format.',
    apps_list_failed: 'Unable to load apps.',
    app_catalog_failed: 'Unable to load the app catalog.',
    app_not_found: 'App not found.',
    app_not_installed: 'Installed app not found.',
    app_migration_failed: 'Unable to complete app migrations.',
    app_rollback_unavailable: 'This app cannot be rolled back.',
    app_restore_unavailable: 'This app cannot be restored.',
    invalid_app_settings: 'Check the app settings.',
    app_disabled: 'The app is disabled.',
    app_scope_not_granted: 'The app does not have the required permission.',
    app_scope_check_failed: 'Unable to check app permissions.',
    app_action_failed: 'Unable to complete the app action.',
    app_settings_save_failed: 'Unable to save app settings.',
    hooks_list_failed: 'Unable to load app hooks.',
    invalid_app_id: 'Check the app ID.',
    invalid_hook_id: 'Check the app hook ID.',
    hook_register_failed: 'Unable to register the app hook.',
    hook_invoke_failed: 'Unable to invoke the app hook.',
    hook_deliveries_failed: 'Unable to load app hook deliveries.',
    hook_delivery_not_found: 'App hook delivery not found.',
    hook_retry_unavailable: 'This app hook delivery cannot be retried.',
    hook_retry_failed: 'Unable to retry the app hook delivery.',
  },
};

export function getBuilderAppsApiErrorPayload(
  locale: Locale,
  errorCode: BuilderAppsApiErrorCode,
): BuilderAppsApiErrorPayload {
  return { error: builderAppsApiErrorMessages[locale][errorCode], errorCode };
}
