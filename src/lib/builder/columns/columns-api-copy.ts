import type { Locale } from '@/lib/locales';

export type BuilderColumnsApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'invalid_slug'
  | 'columns_list_failed'
  | 'column_create_failed'
  | 'column_load_failed'
  | 'column_update_failed'
  | 'column_delete_failed'
  | 'column_publish_failed'
  | 'column_not_found'
  | 'column_already_exists'
  | 'column_slug_conflict'
  | 'draft_not_found'
  | 'legacy_delete_blocked'
  | 'slug_redirect_failed';

export interface BuilderColumnsApiErrorPayload {
  error: string;
  errorCode: BuilderColumnsApiErrorCode;
}

const builderColumnsApiErrorMessages: Record<Locale, Record<BuilderColumnsApiErrorCode, string>> = {
  ko: {
    validation_error: '칼럼 요청 내용을 확인해 주세요.',
    invalid_json: '칼럼 요청 형식을 확인해 주세요.',
    invalid_slug: '칼럼 주소는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.',
    columns_list_failed: '칼럼 목록을 불러오지 못했습니다.',
    column_create_failed: '칼럼을 만들지 못했습니다.',
    column_load_failed: '칼럼을 불러오지 못했습니다.',
    column_update_failed: '칼럼을 저장하지 못했습니다.',
    column_delete_failed: '칼럼을 삭제하지 못했습니다.',
    column_publish_failed: '칼럼 발행을 완료하지 못했습니다.',
    column_not_found: '칼럼을 찾을 수 없습니다.',
    column_already_exists: '이미 같은 주소의 칼럼이 있습니다.',
    column_slug_conflict: '이미 같은 주소의 칼럼이 있습니다.',
    draft_not_found: '발행할 칼럼 초안을 찾을 수 없습니다.',
    legacy_delete_blocked: '가져온 기존 칼럼은 빌더 정리 경로에서 삭제할 수 없습니다.',
    slug_redirect_failed: '칼럼 주소 리디렉션을 만들지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認專欄請求內容。',
    invalid_json: '請確認專欄請求格式。',
    invalid_slug: '專欄網址只能使用英文小寫、數字與連字號。',
    columns_list_failed: '無法載入專欄清單。',
    column_create_failed: '無法建立專欄。',
    column_load_failed: '無法載入專欄。',
    column_update_failed: '無法儲存專欄。',
    column_delete_failed: '無法刪除專欄。',
    column_publish_failed: '無法完成專欄發布。',
    column_not_found: '找不到專欄。',
    column_already_exists: '已存在相同網址的專欄。',
    column_slug_conflict: '已存在相同網址的專欄。',
    draft_not_found: '找不到要發布的專欄草稿。',
    legacy_delete_blocked: '匯入的既有專欄無法透過建構器清理路徑刪除。',
    slug_redirect_failed: '無法建立專欄網址重新導向。',
  },
  en: {
    validation_error: 'Check the column request.',
    invalid_json: 'Check the column request format.',
    invalid_slug: 'Column slugs can use lowercase letters, numbers, and hyphens only.',
    columns_list_failed: 'Unable to load columns.',
    column_create_failed: 'Unable to create the column.',
    column_load_failed: 'Unable to load the column.',
    column_update_failed: 'Unable to save the column.',
    column_delete_failed: 'Unable to delete the column.',
    column_publish_failed: 'Unable to publish the column.',
    column_not_found: 'Column not found.',
    column_already_exists: 'A column with this slug already exists.',
    column_slug_conflict: 'A column with this slug already exists.',
    draft_not_found: 'Draft column not found.',
    legacy_delete_blocked: 'Imported legacy columns cannot be deleted from the builder cleanup route.',
    slug_redirect_failed: 'Unable to create the column slug redirect.',
  },
};

export function getBuilderColumnsApiErrorPayload(
  locale: Locale,
  errorCode: BuilderColumnsApiErrorCode,
): BuilderColumnsApiErrorPayload {
  return { error: builderColumnsApiErrorMessages[locale][errorCode], errorCode };
}
