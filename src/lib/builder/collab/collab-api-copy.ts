import type { Locale } from '@/lib/locales';

export type BuilderCollabApiErrorCode =
  | 'invalid_request'
  | 'comments_load_failed'
  | 'comment_create_failed'
  | 'comment_not_found'
  | 'comment_update_failed'
  | 'comment_delete_failed'
  | 'cursors_load_failed'
  | 'cursor_update_failed'
  | 'presence_load_failed'
  | 'presence_update_failed'
  | 'review_markers_load_failed'
  | 'review_marker_create_failed'
  | 'review_marker_not_found'
  | 'review_marker_update_failed'
  | 'review_marker_delete_failed';

export interface BuilderCollabApiErrorPayload {
  error: string;
  errorCode: BuilderCollabApiErrorCode;
}

const builderCollabApiErrorMessages: Record<Locale, Record<BuilderCollabApiErrorCode, string>> = {
  ko: {
    invalid_request: '협업 요청을 확인해 주세요.',
    comments_load_failed: '댓글을 불러오지 못했습니다.',
    comment_create_failed: '댓글을 만들지 못했습니다.',
    comment_not_found: '댓글을 찾을 수 없습니다.',
    comment_update_failed: '댓글 상태를 저장하지 못했습니다.',
    comment_delete_failed: '댓글을 삭제하지 못했습니다.',
    cursors_load_failed: '커서 위치를 불러오지 못했습니다.',
    cursor_update_failed: '커서 위치를 저장하지 못했습니다.',
    presence_load_failed: '접속 중인 편집자를 불러오지 못했습니다.',
    presence_update_failed: '접속 상태를 저장하지 못했습니다.',
    review_markers_load_failed: '리뷰 마커를 불러오지 못했습니다.',
    review_marker_create_failed: '리뷰 마커를 만들지 못했습니다.',
    review_marker_not_found: '리뷰 마커를 찾을 수 없습니다.',
    review_marker_update_failed: '리뷰 마커를 저장하지 못했습니다.',
    review_marker_delete_failed: '리뷰 마커를 삭제하지 못했습니다.',
  },
  'zh-hant': {
    invalid_request: '請確認協作請求。',
    comments_load_failed: '無法載入留言。',
    comment_create_failed: '無法建立留言。',
    comment_not_found: '找不到留言。',
    comment_update_failed: '無法儲存留言狀態。',
    comment_delete_failed: '無法刪除留言。',
    cursors_load_failed: '無法載入游標位置。',
    cursor_update_failed: '無法儲存游標位置。',
    presence_load_failed: '無法載入線上編輯者。',
    presence_update_failed: '無法儲存連線狀態。',
    review_markers_load_failed: '無法載入審閱標記。',
    review_marker_create_failed: '無法建立審閱標記。',
    review_marker_not_found: '找不到審閱標記。',
    review_marker_update_failed: '無法儲存審閱標記。',
    review_marker_delete_failed: '無法刪除審閱標記。',
  },
  en: {
    invalid_request: 'Check the collaboration request.',
    comments_load_failed: 'Unable to load comments.',
    comment_create_failed: 'Unable to create the comment.',
    comment_not_found: 'Comment not found.',
    comment_update_failed: 'Unable to save comment status.',
    comment_delete_failed: 'Unable to delete the comment.',
    cursors_load_failed: 'Unable to load cursor positions.',
    cursor_update_failed: 'Unable to save cursor position.',
    presence_load_failed: 'Unable to load active editors.',
    presence_update_failed: 'Unable to save presence status.',
    review_markers_load_failed: 'Unable to load review markers.',
    review_marker_create_failed: 'Unable to create the review marker.',
    review_marker_not_found: 'Review marker not found.',
    review_marker_update_failed: 'Unable to save the review marker.',
    review_marker_delete_failed: 'Unable to delete the review marker.',
  },
};

export function getBuilderCollabApiErrorPayload(
  locale: Locale,
  errorCode: BuilderCollabApiErrorCode,
): BuilderCollabApiErrorPayload {
  return { error: builderCollabApiErrorMessages[locale][errorCode], errorCode };
}
