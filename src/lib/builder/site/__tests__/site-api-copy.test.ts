import { describe, expect, it } from 'vitest';
import { getBuilderSiteApiErrorPayload } from '@/lib/builder/site/site-api-copy';

describe('builder site API copy', () => {
  it('returns localized stable-code site API errors', () => {
    expect(getBuilderSiteApiErrorPayload('ko', 'navigation_required')).toEqual({
      error: '내비게이션 항목 배열이 필요합니다.',
      errorCode: 'navigation_required',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'lightbox_not_found')).toEqual({
      error: '找不到燈箱。',
      errorCode: 'lightbox_not_found',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'section_root_missing')).toEqual({
      error: 'The saved section root element was not found.',
      errorCode: 'section_root_missing',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'global_header_draft_not_found')).toEqual({
      error: '전역 헤더 초안을 찾을 수 없습니다.',
      errorCode: 'global_header_draft_not_found',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'invalid_brand_asset_id')).toEqual({
      error: '請確認品牌資產路徑。',
      errorCode: 'invalid_brand_asset_id',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'seo_settings_save_failed')).toEqual({
      error: 'SEO 설정을 저장하지 못했습니다.',
      errorCode: 'seo_settings_save_failed',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'seo_bulk_update_failed')).toEqual({
      error: 'Unable to apply the SEO bulk update.',
      errorCode: 'seo_bulk_update_failed',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'page_seo_request_failed')).toEqual({
      error: '페이지 SEO 요청을 처리하지 못했습니다.',
      errorCode: 'page_seo_request_failed',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'seo_assistant_request_failed')).toEqual({
      error: '無法處理 SEO 助理請求。',
      errorCode: 'seo_assistant_request_failed',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'audit_events_load_failed')).toEqual({
      error: 'Unable to load the site audit log.',
      errorCode: 'audit_events_load_failed',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'site_settings_load_failed')).toEqual({
      error: '無法載入網站設定。',
      errorCode: 'site_settings_load_failed',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'custom_code_too_long')).toEqual({
      error: '사용자 지정 코드가 너무 깁니다.',
      errorCode: 'custom_code_too_long',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'page_not_found')).toEqual({
      error: 'Page not found.',
      errorCode: 'page_not_found',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'redirect_rule_invalid')).toEqual({
      error: '리디렉션 규칙을 확인해 주세요.',
      errorCode: 'redirect_rule_invalid',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'redirect_not_found')).toEqual({
      error: '找不到重新導向規則。',
      errorCode: 'redirect_not_found',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'redirects_load_failed')).toEqual({
      error: 'Unable to load the redirect list.',
      errorCode: 'redirects_load_failed',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'draft_canvas_not_found')).toEqual({
      error: '초안 캔버스를 찾을 수 없습니다.',
      errorCode: 'draft_canvas_not_found',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'scheduled_publish_save_failed')).toEqual({
      error: '無法儲存排程發布。',
      errorCode: 'scheduled_publish_save_failed',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'revision_create_failed')).toEqual({
      error: 'Unable to create the page revision.',
      errorCode: 'revision_create_failed',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'rollback_failed')).toEqual({
      error: '페이지 롤백을 완료하지 못했습니다.',
      errorCode: 'rollback_failed',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'page_order_save_failed')).toEqual({
      error: 'Unable to save the page order.',
      errorCode: 'page_order_save_failed',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'seed_body_invalid')).toEqual({
      error: '請確認初始化請求內容。',
      errorCode: 'seed_body_invalid',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'linked_pages_load_failed')).toEqual({
      error: '연결된 다국어 페이지를 불러오지 못했습니다.',
      errorCode: 'linked_pages_load_failed',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'draft_conflict')).toEqual({
      error: '已有其他變更先被儲存。請重新載入最新草稿。',
      errorCode: 'draft_conflict',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'draft_expected_revision_required')).toEqual({
      error: 'Check the latest draft revision before saving again.',
      errorCode: 'draft_expected_revision_required',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'page_publish_failed')).toEqual({
      error: '페이지를 게시하지 못했습니다.',
      errorCode: 'page_publish_failed',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'pages_list_failed')).toEqual({
      error: 'Unable to load the page list.',
      errorCode: 'pages_list_failed',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'duplicate_slug')).toEqual({
      error: '같은 언어에 동일한 페이지 주소가 이미 있습니다.',
      errorCode: 'duplicate_slug',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'move_source_write_failed')).toEqual({
      error: '已儲存到目標頁面，但無法從來源頁面移除元素。請再試一次。',
      errorCode: 'move_source_write_failed',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'home_snapshot_save_conflict')).toEqual({
      error: '다른 변경 사항이 먼저 저장되었습니다. 최신 홈 스냅샷을 다시 불러와 주세요.',
      errorCode: 'home_snapshot_save_conflict',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'home_publish_draft_not_found')).toEqual({
      error: '找不到可發布的首頁草稿。',
      errorCode: 'home_publish_draft_not_found',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'home_rollback_failed')).toEqual({
      error: 'Unable to complete the home snapshot rollback.',
      errorCode: 'home_rollback_failed',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'page_dataset_save_conflict')).toEqual({
      error: '다른 변경 사항이 먼저 저장되었습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.',
      errorCode: 'page_dataset_save_conflict',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'page_dataset_expected_revision_required')).toEqual({
      error: 'The latest page revision is required. Refresh the page and try again.',
      errorCode: 'page_dataset_expected_revision_required',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'page_dataset_preview_failed')).toEqual({
      error: '無法建立資料集預覽。',
      errorCode: 'page_dataset_preview_failed',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'page_dataset_seed_failed')).toEqual({
      error: 'Unable to reset the dataset binding.',
      errorCode: 'page_dataset_seed_failed',
    });
    expect(getBuilderSiteApiErrorPayload('zh-hant', 'revision_kind_invalid')).toEqual({
      error: '請確認修訂類型。',
      errorCode: 'revision_kind_invalid',
    });
    expect(getBuilderSiteApiErrorPayload('ko', 'page_publish_conflict')).toEqual({
      error: '다른 변경 사항이 먼저 저장되었습니다. 최신 초안을 다시 불러온 뒤 게시해 주세요.',
      errorCode: 'page_publish_conflict',
    });
    expect(getBuilderSiteApiErrorPayload('en', 'page_publish_validation_failed')).toEqual({
      error: 'The page did not pass pre-publish validation.',
      errorCode: 'page_publish_validation_failed',
    });
  });
});
