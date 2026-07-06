import type { Locale } from '@/lib/locales';

export type BuilderSiteApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'navigation_required'
  | 'invalid_lightbox_slug'
  | 'lightbox_slug_conflict'
  | 'lightbox_not_found'
  | 'lightbox_draft_not_found'
  | 'lightbox_update_failed'
  | 'section_root_missing'
  | 'section_not_found'
  | 'section_create_failed'
  | 'section_update_failed'
  | 'global_header_draft_not_found'
  | 'global_footer_draft_not_found'
  | 'invalid_brand_asset_id'
  | 'brand_kit_load_failed'
  | 'brand_kit_save_failed'
  | 'seo_overview_failed'
  | 'seo_preview_failed'
  | 'seo_checklist_load_failed'
  | 'seo_checklist_save_failed'
  | 'seo_settings_load_failed'
  | 'seo_settings_save_failed'
  | 'seo_bulk_update_failed'
  | 'page_seo_request_failed'
  | 'seo_assistant_request_failed'
  | 'audit_events_load_failed'
  | 'site_settings_load_failed'
  | 'site_settings_save_failed'
  | 'custom_code_load_failed'
  | 'custom_code_save_failed'
  | 'custom_code_too_long'
  | 'page_custom_code_save_failed'
  | 'page_not_found'
  | 'redirect_rule_invalid'
  | 'redirect_not_found'
  | 'redirects_public_unavailable'
  | 'redirects_load_failed'
  | 'redirect_save_failed'
  | 'redirect_delete_failed'
  | 'page_id_required'
  | 'draft_canvas_not_found'
  | 'publish_checks_failed'
  | 'scheduled_publish_invalid_timestamp'
  | 'scheduled_publish_past'
  | 'scheduled_publish_load_failed'
  | 'scheduled_publish_save_failed'
  | 'scheduled_publish_cancel_failed'
  | 'revision_not_found'
  | 'revision_draft_not_found'
  | 'revision_load_failed'
  | 'revision_kind_invalid'
  | 'revision_create_failed'
  | 'rollback_revision_required'
  | 'rollback_failed'
  | 'page_order_unknown_page'
  | 'page_order_duplicate_page'
  | 'page_order_save_failed'
  | 'seed_body_invalid'
  | 'seed_failed'
  | 'linked_pages_load_failed'
  | 'draft_not_found'
  | 'draft_load_failed'
  | 'draft_save_failed'
  | 'draft_document_invalid'
  | 'draft_expected_revision_required'
  | 'draft_conflict'
  | 'draft_locale_mismatch'
  | 'page_publish_validation_failed'
  | 'page_publish_conflict'
  | 'page_publish_failed'
  | 'pages_list_failed'
  | 'unsupported_dynamic_list_collection'
  | 'unsupported_dynamic_item_collection'
  | 'ambiguous_dynamic_page_kind'
  | 'invalid_slug'
  | 'duplicate_slug'
  | 'page_create_failed'
  | 'page_update_failed'
  | 'page_delete_failed'
  | 'localized_slug_invalid'
  | 'localized_slug_duplicate'
  | 'home_page_delete_blocked'
  | 'home_snapshot_kind_invalid'
  | 'home_snapshot_body_invalid'
  | 'home_snapshot_page_unsupported'
  | 'home_snapshot_locale_mismatch'
  | 'home_snapshot_load_failed'
  | 'home_snapshot_save_failed'
  | 'home_snapshot_save_conflict'
  | 'home_publish_draft_not_found'
  | 'home_publish_validation_failed'
  | 'home_publish_conflict'
  | 'home_publish_failed'
  | 'home_revision_not_found'
  | 'home_revisions_load_failed'
  | 'home_rollback_revision_required'
  | 'home_rollback_revision_not_found'
  | 'home_rollback_conflict'
  | 'home_rollback_failed'
  | 'builder_site_not_found'
  | 'builder_page_not_found'
  | 'page_dataset_body_invalid'
  | 'page_dataset_target_invalid'
  | 'page_dataset_target_unapproved'
  | 'page_dataset_collection_required'
  | 'page_dataset_collection_unapproved'
  | 'page_dataset_cms_collection_not_found'
  | 'page_dataset_mode_unapproved'
  | 'page_dataset_limit_invalid'
  | 'page_dataset_load_failed'
  | 'page_dataset_expected_revision_required'
  | 'page_dataset_save_conflict'
  | 'page_dataset_save_failed'
  | 'page_dataset_preview_binding_failed'
  | 'page_dataset_preview_failed'
  | 'page_dataset_seed_conflict'
  | 'page_dataset_seed_failed'
  | 'move_source_page_required'
  | 'move_same_page'
  | 'move_node_ids_required'
  | 'move_source_draft_not_found'
  | 'move_target_draft_not_found'
  | 'move_no_matching_nodes'
  | 'move_drafts_load_failed'
  | 'move_target_write_failed'
  | 'move_source_write_failed';

export interface BuilderSiteApiErrorPayload {
  error: string;
  errorCode: BuilderSiteApiErrorCode;
}

const builderSiteApiErrorMessages: Record<Locale, Record<BuilderSiteApiErrorCode, string>> = {
  ko: {
    validation_error: '사이트 요청을 확인해 주세요.',
    invalid_json: '사이트 요청 형식을 확인해 주세요.',
    navigation_required: '내비게이션 항목 배열이 필요합니다.',
    invalid_lightbox_slug: '라이트박스 주소는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.',
    lightbox_slug_conflict: '같은 주소의 라이트박스가 이미 있습니다.',
    lightbox_not_found: '라이트박스를 찾을 수 없습니다.',
    lightbox_draft_not_found: '라이트박스 초안을 찾을 수 없습니다.',
    lightbox_update_failed: '라이트박스를 저장하지 못했습니다.',
    section_root_missing: '저장할 섹션의 루트 요소를 찾을 수 없습니다.',
    section_not_found: '저장된 섹션을 찾을 수 없습니다.',
    section_create_failed: '섹션을 저장하지 못했습니다.',
    section_update_failed: '섹션을 업데이트하지 못했습니다.',
    global_header_draft_not_found: '전역 헤더 초안을 찾을 수 없습니다.',
    global_footer_draft_not_found: '전역 푸터 초안을 찾을 수 없습니다.',
    invalid_brand_asset_id: '브랜드 자산 경로를 확인해 주세요.',
    brand_kit_load_failed: '브랜드 키트를 불러오지 못했습니다.',
    brand_kit_save_failed: '브랜드 키트를 저장하지 못했습니다.',
    seo_overview_failed: 'SEO 요약을 불러오지 못했습니다.',
    seo_preview_failed: 'SEO 미리보기를 만들지 못했습니다.',
    seo_checklist_load_failed: 'SEO 체크리스트를 불러오지 못했습니다.',
    seo_checklist_save_failed: 'SEO 체크리스트를 저장하지 못했습니다.',
    seo_settings_load_failed: 'SEO 설정을 불러오지 못했습니다.',
    seo_settings_save_failed: 'SEO 설정을 저장하지 못했습니다.',
    seo_bulk_update_failed: 'SEO 일괄 변경을 적용하지 못했습니다.',
    page_seo_request_failed: '페이지 SEO 요청을 처리하지 못했습니다.',
    seo_assistant_request_failed: 'SEO 도우미 요청을 처리하지 못했습니다.',
    audit_events_load_failed: '사이트 감사 로그를 불러오지 못했습니다.',
    site_settings_load_failed: '사이트 설정을 불러오지 못했습니다.',
    site_settings_save_failed: '사이트 설정을 저장하지 못했습니다.',
    custom_code_load_failed: '사용자 지정 코드를 불러오지 못했습니다.',
    custom_code_save_failed: '사용자 지정 코드를 저장하지 못했습니다.',
    custom_code_too_long: '사용자 지정 코드가 너무 깁니다.',
    page_custom_code_save_failed: '페이지 사용자 지정 코드를 저장하지 못했습니다.',
    page_not_found: '페이지를 찾을 수 없습니다.',
    redirect_rule_invalid: '리디렉션 규칙을 확인해 주세요.',
    redirect_not_found: '리디렉션 규칙을 찾을 수 없습니다.',
    redirects_public_unavailable: '리디렉션 목록을 찾을 수 없습니다.',
    redirects_load_failed: '리디렉션 목록을 불러오지 못했습니다.',
    redirect_save_failed: '리디렉션 규칙을 저장하지 못했습니다.',
    redirect_delete_failed: '리디렉션 규칙을 삭제하지 못했습니다.',
    page_id_required: '페이지 ID가 필요합니다.',
    draft_canvas_not_found: '초안 캔버스를 찾을 수 없습니다.',
    publish_checks_failed: '게시 전 점검을 실행하지 못했습니다.',
    scheduled_publish_invalid_timestamp: '예약 게시 시간을 확인해 주세요.',
    scheduled_publish_past: '예약 게시 시간은 현재 이후여야 합니다.',
    scheduled_publish_load_failed: '예약 게시 정보를 불러오지 못했습니다.',
    scheduled_publish_save_failed: '예약 게시를 저장하지 못했습니다.',
    scheduled_publish_cancel_failed: '예약 게시를 취소하지 못했습니다.',
    revision_not_found: '페이지 리비전을 찾을 수 없습니다.',
    revision_draft_not_found: '스냅샷을 만들 초안을 찾을 수 없습니다.',
    revision_load_failed: '페이지 리비전을 불러오지 못했습니다.',
    revision_kind_invalid: '리비전 종류를 확인해 주세요.',
    revision_create_failed: '페이지 리비전을 만들지 못했습니다.',
    rollback_revision_required: '롤백할 리비전을 선택해 주세요.',
    rollback_failed: '페이지 롤백을 완료하지 못했습니다.',
    page_order_unknown_page: '정렬할 페이지를 찾을 수 없습니다.',
    page_order_duplicate_page: '페이지 정렬 목록에 중복 항목이 있습니다.',
    page_order_save_failed: '페이지 순서를 저장하지 못했습니다.',
    seed_body_invalid: '초기화 요청 본문을 확인해 주세요.',
    seed_failed: '사이트 페이지 초기화를 완료하지 못했습니다.',
    linked_pages_load_failed: '연결된 다국어 페이지를 불러오지 못했습니다.',
    draft_not_found: '페이지 초안을 찾을 수 없습니다.',
    draft_load_failed: '페이지 초안을 불러오지 못했습니다.',
    draft_save_failed: '페이지 초안을 저장하지 못했습니다.',
    draft_document_invalid: '전달된 페이지 문서가 손상되어 저장을 거부했습니다. 편집기를 새로고침한 뒤 다시 시도해 주세요.',
    draft_expected_revision_required: '최신 초안 리비전을 확인한 뒤 다시 저장해 주세요.',
    draft_conflict: '다른 변경 사항이 먼저 저장되었습니다. 최신 초안을 다시 불러와 주세요.',
    draft_locale_mismatch: '요청한 언어로 이 페이지를 편집할 수 없습니다.',
    page_publish_validation_failed: '페이지가 게시 전 검증을 통과하지 못했습니다.',
    page_publish_conflict: '다른 변경 사항이 먼저 저장되었습니다. 최신 초안을 다시 불러온 뒤 게시해 주세요.',
    page_publish_failed: '페이지를 게시하지 못했습니다.',
    pages_list_failed: '페이지 목록을 불러오지 못했습니다.',
    unsupported_dynamic_list_collection: '이 버전에서는 칼럼, 서비스, 변호사 컬렉션만 동적 목록 페이지에 사용할 수 있습니다.',
    unsupported_dynamic_item_collection: '이 버전에서는 칼럼, 서비스, 변호사 컬렉션만 동적 상세 페이지에 사용할 수 있습니다.',
    ambiguous_dynamic_page_kind: '동적 목록 페이지와 동적 상세 페이지 중 하나만 만들 수 있습니다.',
    invalid_slug: '페이지 주소는 영문 소문자, 숫자, 하이픈, 슬래시 구분 경로만 사용할 수 있습니다.',
    duplicate_slug: '같은 언어에 동일한 페이지 주소가 이미 있습니다.',
    page_create_failed: '페이지를 만들지 못했습니다.',
    page_update_failed: '페이지를 업데이트하지 못했습니다.',
    page_delete_failed: '페이지를 삭제하지 못했습니다.',
    localized_slug_invalid: '다국어 페이지 주소 형식을 확인해 주세요.',
    localized_slug_duplicate: '같은 언어에 동일한 다국어 페이지 주소가 이미 있습니다.',
    home_page_delete_blocked: '홈 페이지는 삭제할 수 없습니다.',
    home_snapshot_kind_invalid: '홈 스냅샷 종류를 확인해 주세요.',
    home_snapshot_body_invalid: '홈 스냅샷 요청 본문을 확인해 주세요.',
    home_snapshot_page_unsupported: '홈 스냅샷만 저장할 수 있습니다.',
    home_snapshot_locale_mismatch: '요청한 언어와 홈 스냅샷 언어가 일치하지 않습니다.',
    home_snapshot_load_failed: '홈 스냅샷을 불러오지 못했습니다.',
    home_snapshot_save_failed: '홈 스냅샷을 저장하지 못했습니다.',
    home_snapshot_save_conflict: '다른 변경 사항이 먼저 저장되었습니다. 최신 홈 스냅샷을 다시 불러와 주세요.',
    home_publish_draft_not_found: '게시할 홈 초안을 찾을 수 없습니다.',
    home_publish_validation_failed: '게시 전 홈 스냅샷 검증을 통과하지 못했습니다.',
    home_publish_conflict: '다른 변경 사항이 먼저 저장되었습니다. 최신 홈 스냅샷을 다시 불러온 뒤 게시해 주세요.',
    home_publish_failed: '홈 스냅샷 게시를 완료하지 못했습니다.',
    home_revision_not_found: '홈 리비전을 찾을 수 없습니다.',
    home_revisions_load_failed: '홈 리비전 목록을 불러오지 못했습니다.',
    home_rollback_revision_required: '롤백할 홈 리비전을 선택해 주세요.',
    home_rollback_revision_not_found: '게시된 홈 리비전 기록을 찾을 수 없습니다.',
    home_rollback_conflict: '다른 변경 사항이 먼저 저장되었습니다. 최신 공유 초안을 다시 불러온 뒤 롤백해 주세요.',
    home_rollback_failed: '홈 스냅샷 롤백을 완료하지 못했습니다.',
    builder_site_not_found: '빌더 사이트를 찾을 수 없습니다.',
    builder_page_not_found: '빌더 페이지를 찾을 수 없습니다.',
    page_dataset_body_invalid: '페이지 데이터셋 요청 본문을 확인해 주세요.',
    page_dataset_target_invalid: '데이터셋 대상 항목을 확인해 주세요.',
    page_dataset_target_unapproved: '이 페이지에서 사용할 수 없는 데이터셋 대상입니다.',
    page_dataset_collection_required: '연결할 CMS 컬렉션을 선택해 주세요.',
    page_dataset_collection_unapproved: '이 대상에 연결할 수 없는 데이터 컬렉션입니다.',
    page_dataset_cms_collection_not_found: '이 사이트에서 CMS 컬렉션을 찾을 수 없습니다.',
    page_dataset_mode_unapproved: '이 대상에 사용할 수 없는 데이터셋 모드입니다.',
    page_dataset_limit_invalid: '데이터셋 표시 수는 0 이상이어야 합니다.',
    page_dataset_load_failed: '페이지 데이터셋을 불러오지 못했습니다.',
    page_dataset_expected_revision_required: '최신 페이지 리비전이 필요합니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.',
    page_dataset_save_conflict: '다른 변경 사항이 먼저 저장되었습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.',
    page_dataset_save_failed: '페이지 데이터셋을 저장하지 못했습니다.',
    page_dataset_preview_binding_failed: '데이터셋 미리보기 연결을 확인하지 못했습니다.',
    page_dataset_preview_failed: '데이터셋 미리보기를 만들지 못했습니다.',
    page_dataset_seed_conflict: '다른 변경 사항이 먼저 저장되었습니다. 페이지를 새로고침한 뒤 다시 초기화해 주세요.',
    page_dataset_seed_failed: '데이터셋 연결 초기화를 완료하지 못했습니다.',
    move_source_page_required: '원본 페이지 ID가 필요합니다.',
    move_same_page: '같은 페이지로는 요소를 이동할 수 없습니다.',
    move_node_ids_required: '이동할 요소를 선택해 주세요.',
    move_source_draft_not_found: '원본 페이지 초안을 찾을 수 없습니다.',
    move_target_draft_not_found: '대상 페이지 초안을 찾을 수 없습니다.',
    move_no_matching_nodes: '이동할 수 있는 요소를 찾을 수 없습니다.',
    move_drafts_load_failed: '이동할 페이지 초안을 불러오지 못했습니다.',
    move_target_write_failed: '대상 페이지에 요소를 저장하지 못했습니다.',
    move_source_write_failed: '대상 페이지에는 저장했지만 원본 페이지에서 요소를 제거하지 못했습니다. 다시 시도해 주세요.',
  },
  'zh-hant': {
    validation_error: '請確認網站請求。',
    invalid_json: '請確認網站請求格式。',
    navigation_required: '需要導覽項目陣列。',
    invalid_lightbox_slug: '燈箱網址只能使用英文小寫、數字與連字號。',
    lightbox_slug_conflict: '已有使用相同網址的燈箱。',
    lightbox_not_found: '找不到燈箱。',
    lightbox_draft_not_found: '找不到燈箱草稿。',
    lightbox_update_failed: '無法儲存燈箱。',
    section_root_missing: '找不到要儲存區段的根元素。',
    section_not_found: '找不到已儲存區段。',
    section_create_failed: '無法儲存區段。',
    section_update_failed: '無法更新區段。',
    global_header_draft_not_found: '找不到全域頁首草稿。',
    global_footer_draft_not_found: '找不到全域頁尾草稿。',
    invalid_brand_asset_id: '請確認品牌資產路徑。',
    brand_kit_load_failed: '無法載入品牌套件。',
    brand_kit_save_failed: '無法儲存品牌套件。',
    seo_overview_failed: '無法載入 SEO 摘要。',
    seo_preview_failed: '無法產生 SEO 預覽。',
    seo_checklist_load_failed: '無法載入 SEO 檢查清單。',
    seo_checklist_save_failed: '無法儲存 SEO 檢查清單。',
    seo_settings_load_failed: '無法載入 SEO 設定。',
    seo_settings_save_failed: '無法儲存 SEO 設定。',
    seo_bulk_update_failed: '無法套用 SEO 批次變更。',
    page_seo_request_failed: '無法處理頁面 SEO 請求。',
    seo_assistant_request_failed: '無法處理 SEO 助理請求。',
    audit_events_load_failed: '無法載入網站稽核紀錄。',
    site_settings_load_failed: '無法載入網站設定。',
    site_settings_save_failed: '無法儲存網站設定。',
    custom_code_load_failed: '無法載入自訂程式碼。',
    custom_code_save_failed: '無法儲存自訂程式碼。',
    custom_code_too_long: '自訂程式碼過長。',
    page_custom_code_save_failed: '無法儲存頁面自訂程式碼。',
    page_not_found: '找不到頁面。',
    redirect_rule_invalid: '請確認重新導向規則。',
    redirect_not_found: '找不到重新導向規則。',
    redirects_public_unavailable: '找不到重新導向清單。',
    redirects_load_failed: '無法載入重新導向清單。',
    redirect_save_failed: '無法儲存重新導向規則。',
    redirect_delete_failed: '無法刪除重新導向規則。',
    page_id_required: '需要頁面 ID。',
    draft_canvas_not_found: '找不到草稿畫布。',
    publish_checks_failed: '無法執行發布前檢查。',
    scheduled_publish_invalid_timestamp: '請確認排程發布時間。',
    scheduled_publish_past: '排程發布時間必須晚於現在。',
    scheduled_publish_load_failed: '無法載入排程發布資訊。',
    scheduled_publish_save_failed: '無法儲存排程發布。',
    scheduled_publish_cancel_failed: '無法取消排程發布。',
    revision_not_found: '找不到頁面修訂。',
    revision_draft_not_found: '找不到可建立快照的草稿。',
    revision_load_failed: '無法載入頁面修訂。',
    revision_kind_invalid: '請確認修訂類型。',
    revision_create_failed: '無法建立頁面修訂。',
    rollback_revision_required: '請選擇要回復的修訂。',
    rollback_failed: '無法完成頁面回復。',
    page_order_unknown_page: '找不到要排序的頁面。',
    page_order_duplicate_page: '頁面排序清單中有重複項目。',
    page_order_save_failed: '無法儲存頁面順序。',
    seed_body_invalid: '請確認初始化請求內容。',
    seed_failed: '無法完成網站頁面初始化。',
    linked_pages_load_failed: '無法載入已連結的多語頁面。',
    draft_not_found: '找不到頁面草稿。',
    draft_load_failed: '無法載入頁面草稿。',
    draft_save_failed: '無法儲存頁面草稿。',
    draft_document_invalid: '頁面文件已損壞，已拒絕儲存。請重新整理編輯器後再試。',
    draft_expected_revision_required: '請確認最新草稿修訂後再儲存。',
    draft_conflict: '已有其他變更先被儲存。請重新載入最新草稿。',
    draft_locale_mismatch: '無法使用請求的語言編輯此頁面。',
    page_publish_validation_failed: '頁面未通過發布前驗證。',
    page_publish_conflict: '已有其他變更先被儲存。請重新載入最新草稿後再發布。',
    page_publish_failed: '無法發布頁面。',
    pages_list_failed: '無法載入頁面清單。',
    unsupported_dynamic_list_collection: '此版本的動態列表頁僅支援專欄、服務與律師集合。',
    unsupported_dynamic_item_collection: '此版本的動態詳細頁僅支援專欄、服務與律師集合。',
    ambiguous_dynamic_page_kind: '只能建立動態列表頁或動態詳細頁其中一種。',
    invalid_slug: '頁面網址只能使用英文小寫、數字、連字號與斜線分隔路徑。',
    duplicate_slug: '同一語言已有相同頁面網址。',
    page_create_failed: '無法建立頁面。',
    page_update_failed: '無法更新頁面。',
    page_delete_failed: '無法刪除頁面。',
    localized_slug_invalid: '請確認多語頁面網址格式。',
    localized_slug_duplicate: '同一語言已有相同多語頁面網址。',
    home_page_delete_blocked: '首頁無法刪除。',
    home_snapshot_kind_invalid: '請確認首頁快照類型。',
    home_snapshot_body_invalid: '請確認首頁快照請求內容。',
    home_snapshot_page_unsupported: '只能儲存首頁快照。',
    home_snapshot_locale_mismatch: '請求語言與首頁快照語言不一致。',
    home_snapshot_load_failed: '無法載入首頁快照。',
    home_snapshot_save_failed: '無法儲存首頁快照。',
    home_snapshot_save_conflict: '已有其他變更先被儲存。請重新載入最新首頁快照。',
    home_publish_draft_not_found: '找不到可發布的首頁草稿。',
    home_publish_validation_failed: '首頁快照未通過發布前驗證。',
    home_publish_conflict: '已有其他變更先被儲存。請重新載入最新首頁快照後再發布。',
    home_publish_failed: '無法完成首頁快照發布。',
    home_revision_not_found: '找不到首頁修訂。',
    home_revisions_load_failed: '無法載入首頁修訂清單。',
    home_rollback_revision_required: '請選擇要回復的首頁修訂。',
    home_rollback_revision_not_found: '找不到已發布的首頁修訂紀錄。',
    home_rollback_conflict: '已有其他變更先被儲存。請重新載入最新共享草稿後再回復。',
    home_rollback_failed: '無法完成首頁快照回復。',
    builder_site_not_found: '找不到建站器網站。',
    builder_page_not_found: '找不到建站器頁面。',
    page_dataset_body_invalid: '請確認頁面資料集請求內容。',
    page_dataset_target_invalid: '請確認資料集目標。',
    page_dataset_target_unapproved: '此頁面無法使用這個資料集目標。',
    page_dataset_collection_required: '請選擇要連結的 CMS 集合。',
    page_dataset_collection_unapproved: '此目標無法連結這個資料集合。',
    page_dataset_cms_collection_not_found: '在此網站找不到 CMS 集合。',
    page_dataset_mode_unapproved: '此目標無法使用這個資料集模式。',
    page_dataset_limit_invalid: '資料集顯示數量必須為 0 或更大。',
    page_dataset_load_failed: '無法載入頁面資料集。',
    page_dataset_expected_revision_required: '需要最新頁面修訂。請重新整理頁面後再試一次。',
    page_dataset_save_conflict: '已有其他變更先被儲存。請重新整理頁面後再試一次。',
    page_dataset_save_failed: '無法儲存頁面資料集。',
    page_dataset_preview_binding_failed: '無法確認資料集預覽連結。',
    page_dataset_preview_failed: '無法建立資料集預覽。',
    page_dataset_seed_conflict: '已有其他變更先被儲存。請重新整理頁面後再初始化。',
    page_dataset_seed_failed: '無法完成資料集連結初始化。',
    move_source_page_required: '需要來源頁面 ID。',
    move_same_page: '無法將元素移動到同一頁面。',
    move_node_ids_required: '請選擇要移動的元素。',
    move_source_draft_not_found: '找不到來源頁面草稿。',
    move_target_draft_not_found: '找不到目標頁面草稿。',
    move_no_matching_nodes: '找不到可移動的元素。',
    move_drafts_load_failed: '無法載入要移動的頁面草稿。',
    move_target_write_failed: '無法將元素儲存到目標頁面。',
    move_source_write_failed: '已儲存到目標頁面，但無法從來源頁面移除元素。請再試一次。',
  },
  en: {
    validation_error: 'Check the site request.',
    invalid_json: 'Check the site request format.',
    navigation_required: 'A navigation item array is required.',
    invalid_lightbox_slug: 'Lightbox slugs can use lowercase letters, numbers, and hyphens only.',
    lightbox_slug_conflict: 'A lightbox with this slug already exists.',
    lightbox_not_found: 'Lightbox not found.',
    lightbox_draft_not_found: 'Lightbox draft not found.',
    lightbox_update_failed: 'Unable to save the lightbox.',
    section_root_missing: 'The saved section root element was not found.',
    section_not_found: 'Saved section not found.',
    section_create_failed: 'Unable to save the section.',
    section_update_failed: 'Unable to update the section.',
    global_header_draft_not_found: 'Global header draft not found.',
    global_footer_draft_not_found: 'Global footer draft not found.',
    invalid_brand_asset_id: 'Check the brand asset path.',
    brand_kit_load_failed: 'Unable to load the brand kit.',
    brand_kit_save_failed: 'Unable to save the brand kit.',
    seo_overview_failed: 'Unable to load the SEO overview.',
    seo_preview_failed: 'Unable to generate the SEO preview.',
    seo_checklist_load_failed: 'Unable to load the SEO checklist.',
    seo_checklist_save_failed: 'Unable to save the SEO checklist.',
    seo_settings_load_failed: 'Unable to load the SEO settings.',
    seo_settings_save_failed: 'Unable to save the SEO settings.',
    seo_bulk_update_failed: 'Unable to apply the SEO bulk update.',
    page_seo_request_failed: 'Could not process the page SEO request.',
    seo_assistant_request_failed: 'Could not process the SEO assistant request.',
    audit_events_load_failed: 'Unable to load the site audit log.',
    site_settings_load_failed: 'Unable to load the site settings.',
    site_settings_save_failed: 'Unable to save the site settings.',
    custom_code_load_failed: 'Unable to load the custom code.',
    custom_code_save_failed: 'Unable to save the custom code.',
    custom_code_too_long: 'Custom code is too long.',
    page_custom_code_save_failed: 'Unable to save the page custom code.',
    page_not_found: 'Page not found.',
    redirect_rule_invalid: 'Check the redirect rule.',
    redirect_not_found: 'Redirect rule not found.',
    redirects_public_unavailable: 'Redirect list not found.',
    redirects_load_failed: 'Unable to load the redirect list.',
    redirect_save_failed: 'Unable to save the redirect rule.',
    redirect_delete_failed: 'Unable to delete the redirect rule.',
    page_id_required: 'Page ID is required.',
    draft_canvas_not_found: 'Draft canvas not found.',
    publish_checks_failed: 'Unable to run publish checks.',
    scheduled_publish_invalid_timestamp: 'Check the scheduled publish time.',
    scheduled_publish_past: 'The scheduled publish time must be in the future.',
    scheduled_publish_load_failed: 'Unable to load the scheduled publish.',
    scheduled_publish_save_failed: 'Unable to save the scheduled publish.',
    scheduled_publish_cancel_failed: 'Unable to cancel the scheduled publish.',
    revision_not_found: 'Page revision not found.',
    revision_draft_not_found: 'No draft is available to snapshot.',
    revision_load_failed: 'Unable to load the page revision.',
    revision_kind_invalid: 'Check the revision kind.',
    revision_create_failed: 'Unable to create the page revision.',
    rollback_revision_required: 'Select a revision to roll back.',
    rollback_failed: 'Unable to complete the page rollback.',
    page_order_unknown_page: 'The page to order was not found.',
    page_order_duplicate_page: 'The page order list contains a duplicate page.',
    page_order_save_failed: 'Unable to save the page order.',
    seed_body_invalid: 'Check the seed request body.',
    seed_failed: 'Unable to seed the site pages.',
    linked_pages_load_failed: 'Unable to load linked locale pages.',
    draft_not_found: 'Page draft not found.',
    draft_load_failed: 'Unable to load the page draft.',
    draft_save_failed: 'Unable to save the page draft.',
    draft_document_invalid: 'The submitted page document is invalid, so the save was rejected. Refresh the editor and try again.',
    draft_expected_revision_required: 'Check the latest draft revision before saving again.',
    draft_conflict: 'Another change was saved first. Reload the latest draft.',
    draft_locale_mismatch: 'This page cannot be edited in the requested language.',
    page_publish_validation_failed: 'The page did not pass pre-publish validation.',
    page_publish_conflict: 'Another change was saved first. Reload the latest draft before publishing.',
    page_publish_failed: 'Unable to publish the page.',
    pages_list_failed: 'Unable to load the page list.',
    unsupported_dynamic_list_collection: 'Only columns, services, and lawyers can be used for dynamic list pages in this version.',
    unsupported_dynamic_item_collection: 'Only columns, services, and lawyers can be used for dynamic item pages in this version.',
    ambiguous_dynamic_page_kind: 'Create either a dynamic list page or a dynamic item page, not both.',
    invalid_slug: 'Page slugs can use lowercase letters, numbers, hyphens, and slash-separated paths only.',
    duplicate_slug: 'A page with this slug already exists in the same language.',
    page_create_failed: 'Unable to create the page.',
    page_update_failed: 'Unable to update the page.',
    page_delete_failed: 'Unable to delete the page.',
    localized_slug_invalid: 'Check the localized page slug format.',
    localized_slug_duplicate: 'A localized page slug already exists in the same language.',
    home_page_delete_blocked: 'The home page cannot be deleted.',
    home_snapshot_kind_invalid: 'Check the home snapshot kind.',
    home_snapshot_body_invalid: 'Check the home snapshot request body.',
    home_snapshot_page_unsupported: 'Only home snapshots can be saved.',
    home_snapshot_locale_mismatch: 'The requested locale does not match the home snapshot locale.',
    home_snapshot_load_failed: 'Unable to load the home snapshot.',
    home_snapshot_save_failed: 'Unable to save the home snapshot.',
    home_snapshot_save_conflict: 'Another change was saved first. Reload the latest home snapshot.',
    home_publish_draft_not_found: 'No home draft is available to publish.',
    home_publish_validation_failed: 'The home snapshot did not pass pre-publish validation.',
    home_publish_conflict: 'Another change was saved first. Reload the latest home snapshot before publishing.',
    home_publish_failed: 'Unable to publish the home snapshot.',
    home_revision_not_found: 'Home revision not found.',
    home_revisions_load_failed: 'Unable to load home revisions.',
    home_rollback_revision_required: 'Select a home revision to roll back.',
    home_rollback_revision_not_found: 'Published home revision record not found.',
    home_rollback_conflict: 'Another change was saved first. Reload the latest shared draft before rollback.',
    home_rollback_failed: 'Unable to complete the home snapshot rollback.',
    builder_site_not_found: 'Builder site not found.',
    builder_page_not_found: 'Builder page not found.',
    page_dataset_body_invalid: 'Check the page dataset request body.',
    page_dataset_target_invalid: 'Check the dataset target.',
    page_dataset_target_unapproved: 'This dataset target is not available for this page.',
    page_dataset_collection_required: 'Select a CMS collection to connect.',
    page_dataset_collection_unapproved: 'This data collection cannot be connected to this target.',
    page_dataset_cms_collection_not_found: 'CMS collection not found on this site.',
    page_dataset_mode_unapproved: 'This dataset mode is not available for this target.',
    page_dataset_limit_invalid: 'Dataset limit must be zero or greater.',
    page_dataset_load_failed: 'Unable to load the page datasets.',
    page_dataset_expected_revision_required: 'The latest page revision is required. Refresh the page and try again.',
    page_dataset_save_conflict: 'Another change was saved first. Refresh the page and try again.',
    page_dataset_save_failed: 'Unable to save the page dataset.',
    page_dataset_preview_binding_failed: 'Unable to resolve the dataset preview binding.',
    page_dataset_preview_failed: 'Unable to build the dataset preview.',
    page_dataset_seed_conflict: 'Another change was saved first. Refresh the page before resetting the dataset.',
    page_dataset_seed_failed: 'Unable to reset the dataset binding.',
    move_source_page_required: 'Source page ID is required.',
    move_same_page: 'Elements cannot be moved to the same page.',
    move_node_ids_required: 'Select elements to move.',
    move_source_draft_not_found: 'Source page draft not found.',
    move_target_draft_not_found: 'Target page draft not found.',
    move_no_matching_nodes: 'No movable elements were found.',
    move_drafts_load_failed: 'Unable to load the page drafts for moving.',
    move_target_write_failed: 'Unable to save elements to the target page.',
    move_source_write_failed: 'Saved to the target page, but could not remove the elements from the source page. Try again.',
  },
};

export function getBuilderSiteApiErrorPayload(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
): BuilderSiteApiErrorPayload {
  return { error: builderSiteApiErrorMessages[locale][errorCode], errorCode };
}
