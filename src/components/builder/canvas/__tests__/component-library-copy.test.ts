import { describe, expect, it } from 'vitest';
import { getComponentLibraryCopy } from '../component-library-copy';

describe('component library copy', () => {
  it('returns ko component library copy', () => {
    const copy = getComponentLibraryCopy('ko');

    expect(copy.eyebrow).toBe('내 디자인');
    expect(copy.title(2)).toBe('컴포넌트 라이브러리 · 2');
    expect(copy.description).toBe('선택한 요소나 섹션을 저장해 다른 페이지에서 빠르게 재사용하세요.');
    expect(copy.namePlaceholder).toBe('이름');
    expect(copy.saveAction).toBe('저장');
    expect(copy.emptyTitle).toBe('아직 저장한 항목 없음');
    expect(copy.emptyState).toBe('저장된 컴포넌트가 없습니다.');
    expect(copy.searchLabel).toBe('검색');
    expect(copy.sortRecent).toBe('최신');
    expect(copy.viewLabel).toBe('보기 방식');
    expect(copy.viewList).toBe('목록');
    expect(copy.viewGrid).toBe('격자');
    expect(copy.viewListAriaLabel).toBe('목록 보기');
    expect(copy.viewGridAriaLabel).toBe('격자 보기');
    expect(copy.shortcutTitle).toBe('내 디자인 바로가기');
    expect(copy.shortcutDescription(2)).toBe('저장된 컴포넌트 2개를 바로 열기');
    expect(copy.shortcutAction).toBe('열기');
    expect(copy.shortcutAriaLabel).toBe('컴포넌트 라이브러리로 이동');
    expect(copy.shortcutRecentTitle).toBe('최근 내 디자인');
    expect(copy.shortcutPinnedTitle).toBe('고정한 디자인');
    expect(copy.shortcutInvalidNotice(1)).toBe('저장 데이터 확인이 필요한 항목 1개는 전체 라이브러리에서 확인하세요.');
    expect(copy.shortcutQuickInsertAction).toBe('삽입');
    expect(copy.shortcutQuickInsertAriaLabel('Hero')).toBe('"Hero" 바로 삽입');
    expect(copy.remapNoticeTitle).toBe('데이터 필드 자동 맞춤');
    expect(copy.remapNoticeSummary(1, 2)).toBe('변경 1개 · 제외 2개');
    expect(copy.remapNoticeTargetLabel('home.services.list')).toBe('대상: home.services.list');
    expect(copy.remapNoticeChangedLabel('readTime', 'description')).toBe('readTime -> description');
    expect(copy.remapNoticeDroppedLabel('featuredImage')).toBe('featuredImage 제외');
    expect(copy.remapReviewTitle).toBe('필드 연결 확인');
    expect(copy.remapReviewDescription(2, 'home.services.list')).toBe('home.services.list에 맞출 필드 2개');
    expect(copy.remapReviewFieldLabel('Read time', 'text')).toBe('Read time · text');
    expect(copy.remapReviewCurrentLabel('description')).toBe('현재: description');
    expect(copy.remapReviewCurrentLabel(null)).toBe('현재: 제외');
    expect(copy.remapReviewSelectAriaLabel('Read time')).toBe('Read time 대상 필드 선택');
    expect(copy.remapReviewDropOption).toBe('이 필드 제외');
    expect(copy.remapReviewNoOptions).toBe('호환 필드 없음');
    expect(copy.remapReviewConfirmAction).toBe('삽입');
    expect(copy.remapReviewCancelAction).toBe('취소');
    expect(copy.resultsLabel(1, 2)).toBe('표시 1/2');
    expect(copy.searchEmptyState('Hero')).toBe('"Hero"와 일치하는 저장된 컴포넌트가 없습니다.');
    expect(copy.insertAriaLabel('Hero')).toBe('"Hero" 삽입');
    expect(copy.invalidInsertAriaLabel('Hero')).toBe('"Hero" 저장 데이터를 확인해야 삽입할 수 있음');
    expect(copy.invalidInsertTitle).toBe('저장 데이터를 확인한 뒤 삽입할 수 있습니다.');
    expect(copy.replaceAction).toBe('교체');
    expect(copy.replaceAriaLabel('Hero')).toBe('"Hero"로 선택 요소 교체');
    expect(copy.replaceDisabledTitle).toBe('교체할 요소 하나를 캔버스에서 선택하세요.');
    expect(copy.duplicateAction).toBe('복제');
    expect(copy.duplicateAriaLabel('Hero')).toBe('"Hero" 복제');
    expect(copy.duplicateName('Hero')).toBe('Hero 복사본');
    expect(copy.updateAction).toBe('현재 선택으로 업데이트');
    expect(copy.updateAriaLabel('Hero')).toBe('"Hero" 현재 선택으로 업데이트');
    expect(copy.updateDisabledTitle).toBe('먼저 캔버스에서 업데이트할 요소를 선택하세요.');
    expect(copy.updateReviewTitle).toBe('업데이트 확인');
    expect(copy.updateReviewDescription('Hero')).toBe('"Hero"을 현재 선택으로 덮어쓰기 전에 비교하세요.');
    expect(copy.updateReviewSavedLabel).toBe('저장됨');
    expect(copy.updateReviewCurrentLabel).toBe('현재 선택');
    expect(copy.updateReviewSnapshotLabel).toBe('스냅샷 이름');
    expect(copy.updateReviewSnapshotPlaceholder).toBe('예: 원본 히어로');
    expect(copy.reviewDiffTitle).toBe('구조 변경');
    expect(copy.reviewDiffEmptyLabel).toBe('변경 없음');
    expect(copy.reviewDiffRootKindLabel('text', 'container')).toBe('텍스트 → 컨테이너');
    expect(copy.reviewDiffNodeDeltaLabel(2)).toBe('요소 +2');
    expect(copy.reviewDiffNodeDeltaLabel(-1)).toBe('요소 -1');
    expect(copy.reviewDiffTextChangedLabel).toBe('텍스트 변경');
    expect(copy.reviewDiffBindingChangedLabel).toBe('연결 변경');
    expect(copy.reviewDiffDetailsTitle).toBe('상세 변경');
    expect(copy.reviewDiffTextDetailLabel('저장', '현재')).toBe('텍스트: 저장 → 현재');
    expect(copy.reviewDiffBindingDetailLabel('title', 'description')).toBe('연결: title → description');
    expect(copy.updateReviewConfirmAction).toBe('업데이트');
    expect(copy.updateReviewCancelAction).toBe('취소');
    expect(copy.updatedBadge).toBe('업데이트됨');
    expect(copy.restoreAction).toBe('이전 버전 복원');
    expect(copy.restoreAriaLabel('Hero')).toBe('"Hero" 이전 버전 복원');
    expect(copy.restoreReviewTitle).toBe('복원 확인');
    expect(copy.restoreReviewDescription('Hero')).toBe('"Hero"을 직전 버전으로 되돌리기 전에 비교하세요.');
    expect(copy.restoreReviewCurrentLabel).toBe('현재 저장됨');
    expect(copy.restoreReviewPreviousLabel).toBe('이전 버전');
    expect(copy.restoreReviewVersionGroupLabel).toBe('복원할 버전');
    expect(copy.restoreReviewVersionLabel(2, '2026. 6. 1.')).toBe('버전 2 · 2026. 6. 1.');
    expect(copy.restoreReviewVersionLabel(2, '2026. 6. 1.', '원본 히어로')).toBe('버전 2 · 원본 히어로');
    expect(copy.restoreReviewVersionAriaLabel(2, '2026. 6. 1.')).toBe('버전 2, 2026. 6. 1. 선택');
    expect(copy.restoreReviewVersionAriaLabel(2, '2026. 6. 1.', '원본 히어로')).toBe(
      '버전 2, 원본 히어로, 2026. 6. 1. 선택',
    );
    expect(copy.restoreReviewSnapshotLabel).toBe('스냅샷 이름');
    expect(copy.restoreReviewSnapshotPlaceholder).toBe('예: 원본 히어로');
    expect(copy.restoreReviewSnapshotSaveAction).toBe('이름 저장');
    expect(copy.restoreReviewSnapshotDeleteAction).toBe('버전 삭제');
    expect(copy.restoreReviewSnapshotDeleteAriaLabel(2)).toBe('버전 2 삭제');
    expect(copy.restoreReviewConfirmAction).toBe('복원');
    expect(copy.restoreReviewCancelAction).toBe('취소');
    expect(copy.versionBadge(2)).toBe('이전 버전 2');
    expect(copy.entryMetaLabel('text', 1, true)).toBe('텍스트 · 1개 요소');
    expect(copy.entryMetaLabel('container', 2, true)).toBe('컨테이너 · 2개 요소');
    expect(copy.entryMetaLabel('repeaterTemplateGroup', 3, true)).toBe('템플릿 그룹 · 3개 요소');
    expect(copy.entryMetaLabel('unknown', 0, false)).toBe('저장 데이터 확인 필요');
    expect(copy.pinAction).toBe('고정');
    expect(copy.pinAriaLabel('Hero')).toBe('"Hero" 고정');
    expect(copy.unpinAction).toBe('고정 해제');
    expect(copy.unpinAriaLabel('Hero')).toBe('"Hero" 고정 해제');
    expect(copy.pinnedBadge).toBe('고정됨');
    expect(copy.renameAction).toBe('이름 변경');
    expect(copy.renameAriaLabel('Hero')).toBe('"Hero" 이름 변경');
    expect(copy.renameSaveAction).toBe('저장');
    expect(copy.renameCancelAction).toBe('취소');
  });

  it('returns zh-hant component library copy without Hangul', () => {
    const copy = getComponentLibraryCopy('zh-hant');
    const text = [
      copy.eyebrow,
      copy.title(2),
      copy.description,
      copy.namePlaceholder,
      copy.saveAction,
      copy.selectFirstHint,
      copy.emptyTitle,
      copy.emptyState,
      copy.searchLabel,
      copy.searchPlaceholder,
      copy.sortLabel,
      copy.sortRecent,
      copy.sortName,
      copy.viewLabel,
      copy.viewList,
      copy.viewGrid,
      copy.viewListAriaLabel,
      copy.viewGridAriaLabel,
      copy.shortcutTitle,
      copy.shortcutDescription(2),
      copy.shortcutAction,
      copy.shortcutAriaLabel,
      copy.shortcutRecentTitle,
      copy.shortcutPinnedTitle,
      copy.shortcutInvalidNotice(1),
      copy.shortcutQuickInsertAction,
      copy.shortcutQuickInsertAriaLabel('Hero'),
      copy.remapNoticeTitle,
      copy.remapNoticeSummary(1, 2),
      copy.remapNoticeTargetLabel('home.services.list'),
      copy.remapNoticeChangedLabel('readTime', 'description'),
      copy.remapNoticeDroppedLabel('featuredImage'),
      copy.remapNoticeDismissAction,
      copy.remapReviewTitle,
      copy.remapReviewDescription(2, 'home.services.list'),
      copy.remapReviewFieldLabel('Read time', 'text'),
      copy.remapReviewCurrentLabel('description'),
      copy.remapReviewCurrentLabel(null),
      copy.remapReviewSelectAriaLabel('Read time'),
      copy.remapReviewDropOption,
      copy.remapReviewNoOptions,
      copy.remapReviewConfirmAction,
      copy.remapReviewCancelAction,
      copy.resultsLabel(1, 2),
      copy.searchEmptyState('Hero'),
      copy.insertAction,
      copy.insertAriaLabel('Hero'),
      copy.invalidInsertAriaLabel('Hero'),
      copy.invalidInsertTitle,
      copy.replaceAction,
      copy.replaceAriaLabel('Hero'),
      copy.replaceDisabledTitle,
      copy.duplicateAction,
      copy.duplicateAriaLabel('Hero'),
      copy.duplicateName('Hero'),
      copy.updateAction,
      copy.updateAriaLabel('Hero'),
      copy.updateDisabledTitle,
      copy.updateReviewTitle,
      copy.updateReviewDescription('Hero'),
      copy.updateReviewSavedLabel,
      copy.updateReviewCurrentLabel,
      copy.updateReviewSnapshotLabel,
      copy.updateReviewSnapshotPlaceholder,
      copy.reviewDiffTitle,
      copy.reviewDiffEmptyLabel,
      copy.reviewDiffRootKindLabel('text', 'container'),
      copy.reviewDiffNodeDeltaLabel(2),
      copy.reviewDiffNodeDeltaLabel(-1),
      copy.reviewDiffTextChangedLabel,
      copy.reviewDiffBindingChangedLabel,
      copy.reviewDiffDetailsTitle,
      copy.reviewDiffTextDetailLabel('Saved', 'Current'),
      copy.reviewDiffBindingDetailLabel('title', 'description'),
      copy.updateReviewConfirmAction,
      copy.updateReviewCancelAction,
      copy.updatedBadge,
      copy.restoreAction,
      copy.restoreAriaLabel('Hero'),
      copy.restoreReviewTitle,
      copy.restoreReviewDescription('Hero'),
      copy.restoreReviewCurrentLabel,
      copy.restoreReviewPreviousLabel,
      copy.restoreReviewVersionGroupLabel,
      copy.restoreReviewVersionLabel(2, '2026/6/1'),
      copy.restoreReviewVersionLabel(2, '2026/6/1', 'Hero baseline'),
      copy.restoreReviewVersionAriaLabel(2, '2026/6/1'),
      copy.restoreReviewVersionAriaLabel(2, '2026/6/1', 'Hero baseline'),
      copy.restoreReviewSnapshotLabel,
      copy.restoreReviewSnapshotPlaceholder,
      copy.restoreReviewSnapshotSaveAction,
      copy.restoreReviewSnapshotDeleteAction,
      copy.restoreReviewSnapshotDeleteAriaLabel(2),
      copy.restoreReviewConfirmAction,
      copy.restoreReviewCancelAction,
      copy.versionBadge(2),
      copy.entryMetaLabel('text', 1, true),
      copy.entryMetaLabel('container', 2, true),
      copy.entryMetaLabel('repeaterTemplateGroup', 3, true),
      copy.entryMetaLabel('unknown', 0, false),
      copy.pinAction,
      copy.pinAriaLabel('Hero'),
      copy.unpinAction,
      copy.unpinAriaLabel('Hero'),
      copy.pinnedBadge,
      copy.renameAction,
      copy.renameAriaLabel('Hero'),
      copy.renamePlaceholder,
      copy.renameSaveAction,
      copy.renameCancelAction,
      copy.deleteAction,
      copy.deleteAriaLabel('Hero'),
      copy.dateLocale,
    ].join(' ');

    expect(copy.eyebrow).toBe('我的設計');
    expect(copy.title(2)).toBe('元件庫 · 2');
    expect(copy.emptyTitle).toBe('尚無儲存項目');
    expect(copy.reviewDiffDetailsTitle).toBe('變更明細');
    expect(copy.reviewDiffTextDetailLabel('已儲存', '目前')).toBe('文字：已儲存 → 目前');
    expect(copy.reviewDiffBindingDetailLabel('title', 'description')).toBe('連結：title → description');
    expect(copy.dateLocale).toBe('zh-TW');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en component library copy without CJK', () => {
    const copy = getComponentLibraryCopy('en');
    const text = [
      copy.eyebrow,
      copy.title(2),
      copy.description,
      copy.namePlaceholder,
      copy.saveAction,
      copy.selectFirstHint,
      copy.emptyTitle,
      copy.emptyState,
      copy.searchLabel,
      copy.searchPlaceholder,
      copy.sortLabel,
      copy.sortRecent,
      copy.sortName,
      copy.viewLabel,
      copy.viewList,
      copy.viewGrid,
      copy.viewListAriaLabel,
      copy.viewGridAriaLabel,
      copy.shortcutTitle,
      copy.shortcutDescription(2),
      copy.shortcutAction,
      copy.shortcutAriaLabel,
      copy.shortcutRecentTitle,
      copy.shortcutPinnedTitle,
      copy.shortcutInvalidNotice(1),
      copy.shortcutQuickInsertAction,
      copy.shortcutQuickInsertAriaLabel('Hero'),
      copy.remapNoticeTitle,
      copy.remapNoticeSummary(1, 2),
      copy.remapNoticeTargetLabel('home.services.list'),
      copy.remapNoticeChangedLabel('readTime', 'description'),
      copy.remapNoticeDroppedLabel('featuredImage'),
      copy.remapNoticeDismissAction,
      copy.remapReviewTitle,
      copy.remapReviewDescription(2, 'home.services.list'),
      copy.remapReviewFieldLabel('Read time', 'text'),
      copy.remapReviewCurrentLabel('description'),
      copy.remapReviewCurrentLabel(null),
      copy.remapReviewSelectAriaLabel('Read time'),
      copy.remapReviewDropOption,
      copy.remapReviewNoOptions,
      copy.remapReviewConfirmAction,
      copy.remapReviewCancelAction,
      copy.resultsLabel(1, 2),
      copy.searchEmptyState('Hero'),
      copy.insertAction,
      copy.insertAriaLabel('Hero'),
      copy.invalidInsertAriaLabel('Hero'),
      copy.invalidInsertTitle,
      copy.replaceAction,
      copy.replaceAriaLabel('Hero'),
      copy.replaceDisabledTitle,
      copy.duplicateAction,
      copy.duplicateAriaLabel('Hero'),
      copy.duplicateName('Hero'),
      copy.updateAction,
      copy.updateAriaLabel('Hero'),
      copy.updateDisabledTitle,
      copy.updateReviewTitle,
      copy.updateReviewDescription('Hero'),
      copy.updateReviewSavedLabel,
      copy.updateReviewCurrentLabel,
      copy.updateReviewSnapshotLabel,
      copy.updateReviewSnapshotPlaceholder,
      copy.reviewDiffTitle,
      copy.reviewDiffEmptyLabel,
      copy.reviewDiffRootKindLabel('text', 'container'),
      copy.reviewDiffNodeDeltaLabel(2),
      copy.reviewDiffNodeDeltaLabel(-1),
      copy.reviewDiffTextChangedLabel,
      copy.reviewDiffBindingChangedLabel,
      copy.reviewDiffDetailsTitle,
      copy.reviewDiffTextDetailLabel('Saved', 'Current'),
      copy.reviewDiffBindingDetailLabel('title', 'description'),
      copy.updateReviewConfirmAction,
      copy.updateReviewCancelAction,
      copy.updatedBadge,
      copy.restoreAction,
      copy.restoreAriaLabel('Hero'),
      copy.restoreReviewTitle,
      copy.restoreReviewDescription('Hero'),
      copy.restoreReviewCurrentLabel,
      copy.restoreReviewPreviousLabel,
      copy.restoreReviewVersionGroupLabel,
      copy.restoreReviewVersionLabel(2, '6/1/2026'),
      copy.restoreReviewVersionLabel(2, '6/1/2026', 'Hero baseline'),
      copy.restoreReviewVersionAriaLabel(2, '6/1/2026'),
      copy.restoreReviewVersionAriaLabel(2, '6/1/2026', 'Hero baseline'),
      copy.restoreReviewSnapshotLabel,
      copy.restoreReviewSnapshotPlaceholder,
      copy.restoreReviewSnapshotSaveAction,
      copy.restoreReviewSnapshotDeleteAction,
      copy.restoreReviewSnapshotDeleteAriaLabel(2),
      copy.restoreReviewConfirmAction,
      copy.restoreReviewCancelAction,
      copy.versionBadge(2),
      copy.entryMetaLabel('text', 1, true),
      copy.entryMetaLabel('container', 2, true),
      copy.entryMetaLabel('repeaterTemplateGroup', 3, true),
      copy.entryMetaLabel('unknown', 0, false),
      copy.pinAction,
      copy.pinAriaLabel('Hero'),
      copy.unpinAction,
      copy.unpinAriaLabel('Hero'),
      copy.pinnedBadge,
      copy.renameAction,
      copy.renameAriaLabel('Hero'),
      copy.renamePlaceholder,
      copy.renameSaveAction,
      copy.renameCancelAction,
      copy.deleteAction,
      copy.deleteAriaLabel('Hero'),
      copy.dateLocale,
    ].join(' ');

    expect(copy.eyebrow).toBe('My designs');
    expect(copy.title(2)).toBe('Component library · 2');
    expect(copy.emptyTitle).toBe('No saved items yet');
    expect(copy.emptyState).toBe('No saved components yet.');
    expect(copy.updateReviewTitle).toBe('Review update');
    expect(copy.updateReviewDescription('Hero')).toBe('Compare before replacing "Hero" with the current selection.');
    expect(copy.updateReviewSnapshotLabel).toBe('Snapshot name');
    expect(copy.updateReviewSnapshotPlaceholder).toBe('Example: original hero');
    expect(copy.reviewDiffRootKindLabel('text', 'container')).toBe('Text → Container');
    expect(copy.reviewDiffNodeDeltaLabel(2)).toBe('2 elements added');
    expect(copy.reviewDiffNodeDeltaLabel(-1)).toBe('1 element removed');
    expect(copy.reviewDiffTextChangedLabel).toBe('Text changed');
    expect(copy.reviewDiffBindingChangedLabel).toBe('Bindings changed');
    expect(copy.reviewDiffDetailsTitle).toBe('Change details');
    expect(copy.reviewDiffTextDetailLabel('Saved', 'Current')).toBe('Text: Saved → Current');
    expect(copy.reviewDiffBindingDetailLabel('title', 'description')).toBe('Binding: title → description');
    expect(copy.restoreReviewVersionGroupLabel).toBe('Version to restore');
    expect(copy.restoreReviewVersionLabel(2, '6/1/2026')).toBe('Version 2 · 6/1/2026');
    expect(copy.restoreReviewVersionLabel(2, '6/1/2026', 'Original hero')).toBe('Version 2 · Original hero');
    expect(copy.restoreReviewVersionAriaLabel(2, '6/1/2026')).toBe('Select version 2 from 6/1/2026');
    expect(copy.restoreReviewVersionAriaLabel(2, '6/1/2026', 'Original hero')).toBe(
      'Select version 2, Original hero, from 6/1/2026',
    );
    expect(copy.restoreReviewSnapshotLabel).toBe('Snapshot name');
    expect(copy.restoreReviewSnapshotPlaceholder).toBe('Example: original hero');
    expect(copy.restoreReviewSnapshotSaveAction).toBe('Save name');
    expect(copy.restoreReviewSnapshotDeleteAction).toBe('Delete version');
    expect(copy.restoreReviewSnapshotDeleteAriaLabel(2)).toBe('Delete version 2');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
