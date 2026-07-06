import type { Locale } from '@/lib/locales';

export type BuilderWorkspaceApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'account_load_failed'
  | 'account_update_failed'
  | 'sites_list_failed'
  | 'site_create_failed'
  | 'members_list_failed'
  | 'member_create_failed'
  | 'member_update_failed'
  | 'member_delete_failed'
  | 'member_not_found'
  | 'owner_role_required'
  | 'assets_list_failed'
  | 'asset_invalid_upload'
  | 'asset_file_required'
  | 'asset_unsupported_media'
  | 'asset_payload_too_large'
  | 'asset_upload_failed'
  | 'asset_invalid_filename'
  | 'asset_not_found'
  | 'asset_load_failed'
  | 'asset_in_use'
  | 'asset_delete_failed'
  | 'analytics_load_failed'
  | 'cms_collections_failed'
  | 'cms_site_not_found'
  | 'cms_collection_not_found'
  | 'cms_collection_create_failed'
  | 'cms_collection_update_failed'
  | 'cms_collection_delete_failed';

export interface BuilderWorkspaceApiErrorPayload {
  error: string;
  errorCode: BuilderWorkspaceApiErrorCode;
}

const builderWorkspaceApiErrorMessages: Record<Locale, Record<BuilderWorkspaceApiErrorCode, string>> = {
  ko: {
    validation_error: '작업 공간 요청을 확인해 주세요.',
    invalid_json: '작업 공간 요청 형식을 확인해 주세요.',
    account_load_failed: '작업 공간 계정을 불러오지 못했습니다.',
    account_update_failed: '작업 공간 계정을 저장하지 못했습니다.',
    sites_list_failed: '작업 공간 사이트 목록을 불러오지 못했습니다.',
    site_create_failed: '작업 공간 사이트를 추가하지 못했습니다.',
    members_list_failed: '작업 공간 구성원 목록을 불러오지 못했습니다.',
    member_create_failed: '작업 공간 구성원을 추가하지 못했습니다.',
    member_update_failed: '작업 공간 구성원 역할을 저장하지 못했습니다.',
    member_delete_failed: '작업 공간 구성원을 삭제하지 못했습니다.',
    member_not_found: '작업 공간 구성원을 찾을 수 없습니다.',
    owner_role_required: '작업 공간에는 최소 한 명의 소유자가 필요합니다.',
    assets_list_failed: '공유 에셋 목록을 불러오지 못했습니다.',
    asset_invalid_upload: '공유 에셋 업로드 요청을 확인해 주세요.',
    asset_file_required: '업로드할 이미지 파일을 선택해 주세요.',
    asset_unsupported_media: '지원되는 이미지 파일만 업로드할 수 있습니다.',
    asset_payload_too_large: '파일 크기가 허용 한도를 초과했습니다.',
    asset_upload_failed: '공유 에셋을 업로드하지 못했습니다.',
    asset_invalid_filename: '공유 에셋 파일 이름을 확인해 주세요.',
    asset_not_found: '공유 에셋을 찾을 수 없습니다.',
    asset_load_failed: '공유 에셋을 불러오지 못했습니다.',
    asset_in_use: '이 공유 에셋은 빌더 문서에서 사용 중입니다.',
    asset_delete_failed: '공유 에셋을 삭제하지 못했습니다.',
    analytics_load_failed: '작업 공간 분석을 불러오지 못했습니다.',
    cms_collections_failed: '작업 공간 CMS 컬렉션을 불러오지 못했습니다.',
    cms_site_not_found: '작업 공간 사이트를 찾을 수 없습니다.',
    cms_collection_not_found: '작업 공간 CMS 컬렉션을 찾을 수 없습니다.',
    cms_collection_create_failed: '작업 공간 CMS 컬렉션을 만들지 못했습니다.',
    cms_collection_update_failed: '작업 공간 CMS 컬렉션을 저장하지 못했습니다.',
    cms_collection_delete_failed: '작업 공간 CMS 컬렉션을 삭제하지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認工作區請求。',
    invalid_json: '請確認工作區請求格式。',
    account_load_failed: '無法載入工作區帳號。',
    account_update_failed: '無法儲存工作區帳號。',
    sites_list_failed: '無法載入工作區網站清單。',
    site_create_failed: '無法新增工作區網站。',
    members_list_failed: '無法載入工作區成員清單。',
    member_create_failed: '無法新增工作區成員。',
    member_update_failed: '無法儲存工作區成員角色。',
    member_delete_failed: '無法移除工作區成員。',
    member_not_found: '找不到工作區成員。',
    owner_role_required: '工作區至少需要一位擁有者。',
    assets_list_failed: '無法載入共用素材清單。',
    asset_invalid_upload: '請確認共用素材上傳請求。',
    asset_file_required: '請選擇要上傳的圖片檔案。',
    asset_unsupported_media: '只能上傳支援的圖片檔案。',
    asset_payload_too_large: '檔案大小超過允許上限。',
    asset_upload_failed: '無法上傳共用素材。',
    asset_invalid_filename: '請確認共用素材檔名。',
    asset_not_found: '找不到共用素材。',
    asset_load_failed: '無法載入共用素材。',
    asset_in_use: '此共用素材仍在建構器文件中使用。',
    asset_delete_failed: '無法刪除共用素材。',
    analytics_load_failed: '無法載入工作區分析。',
    cms_collections_failed: '無法載入工作區 CMS 清單。',
    cms_site_not_found: '找不到工作區網站。',
    cms_collection_not_found: '找不到工作區 CMS 集合。',
    cms_collection_create_failed: '無法建立工作區 CMS 集合。',
    cms_collection_update_failed: '無法儲存工作區 CMS 集合。',
    cms_collection_delete_failed: '無法刪除工作區 CMS 集合。',
  },
  en: {
    validation_error: 'Check the workspace request.',
    invalid_json: 'Check the workspace request format.',
    account_load_failed: 'Unable to load the workspace account.',
    account_update_failed: 'Unable to save the workspace account.',
    sites_list_failed: 'Unable to load workspace sites.',
    site_create_failed: 'Unable to add the workspace site.',
    members_list_failed: 'Unable to load workspace members.',
    member_create_failed: 'Unable to add the workspace member.',
    member_update_failed: 'Unable to save the workspace member role.',
    member_delete_failed: 'Unable to remove the workspace member.',
    member_not_found: 'Workspace member not found.',
    owner_role_required: 'A workspace must keep at least one owner.',
    assets_list_failed: 'Unable to load shared assets.',
    asset_invalid_upload: 'Check the shared asset upload request.',
    asset_file_required: 'Choose an image file to upload.',
    asset_unsupported_media: 'Only supported image files can be uploaded.',
    asset_payload_too_large: 'The file exceeds the allowed size limit.',
    asset_upload_failed: 'Unable to upload the shared asset.',
    asset_invalid_filename: 'Check the shared asset filename.',
    asset_not_found: 'Shared asset not found.',
    asset_load_failed: 'Unable to load the shared asset.',
    asset_in_use: 'This shared asset is still used in builder documents.',
    asset_delete_failed: 'Unable to delete the shared asset.',
    analytics_load_failed: 'Unable to load workspace analytics.',
    cms_collections_failed: 'Unable to load workspace CMS collections.',
    cms_site_not_found: 'Workspace site not found.',
    cms_collection_not_found: 'Workspace CMS collection not found.',
    cms_collection_create_failed: 'Unable to create the workspace CMS collection.',
    cms_collection_update_failed: 'Unable to save the workspace CMS collection.',
    cms_collection_delete_failed: 'Unable to delete the workspace CMS collection.',
  },
};

export function getBuilderWorkspaceApiErrorPayload(
  locale: Locale,
  errorCode: BuilderWorkspaceApiErrorCode,
): BuilderWorkspaceApiErrorPayload {
  return { error: builderWorkspaceApiErrorMessages[locale][errorCode], errorCode };
}
