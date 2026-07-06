import { describe, expect, it } from 'vitest';
import { getBuilderAppsApiErrorPayload } from '@/lib/builder/apps/apps-api-copy';

describe('builder apps API copy', () => {
  it('returns localized stable-code app API errors', () => {
    expect(getBuilderAppsApiErrorPayload('ko', 'app_not_found')).toEqual({
      error: '앱을 찾을 수 없습니다.',
      errorCode: 'app_not_found',
    });
    expect(getBuilderAppsApiErrorPayload('zh-hant', 'app_migration_failed')).toEqual({
      error: '無法完成應用遷移。',
      errorCode: 'app_migration_failed',
    });
    expect(getBuilderAppsApiErrorPayload('en', 'invalid_app_settings')).toEqual({
      error: 'Check the app settings.',
      errorCode: 'invalid_app_settings',
    });
    expect(getBuilderAppsApiErrorPayload('ko', 'app_scope_not_granted')).toEqual({
      error: '앱에 필요한 권한이 없습니다.',
      errorCode: 'app_scope_not_granted',
    });
    expect(getBuilderAppsApiErrorPayload('zh-hant', 'invalid_hook_id')).toEqual({
      error: '請確認應用 Hook ID。',
      errorCode: 'invalid_hook_id',
    });
    expect(getBuilderAppsApiErrorPayload('en', 'app_catalog_failed')).toEqual({
      error: 'Unable to load the app catalog.',
      errorCode: 'app_catalog_failed',
    });
  });
});
