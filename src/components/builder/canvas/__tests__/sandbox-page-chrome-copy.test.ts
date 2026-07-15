import { describe, expect, it } from 'vitest';
import {
  getDraftConflictCopy,
  getSandboxPageFeedbackCopy,
  isBuilderAdminNavigationHref,
} from '../SandboxPageChrome';

describe('sandbox page chrome copy', () => {
  it('recognizes every locale-scoped and absolute admin-builder navigation href', () => {
    expect(isBuilderAdminNavigationHref('/ko/admin-builder/cms')).toBe(true);
    expect(isBuilderAdminNavigationHref('/zh-hant/admin-builder/columns/post/edit?tab=seo')).toBe(true);
    expect(isBuilderAdminNavigationHref('https://example.test/en/admin-builder/apps')).toBe(true);
    expect(isBuilderAdminNavigationHref('/ko/columns')).toBe(false);
    expect(isBuilderAdminNavigationHref('#section')).toBe(false);
  });

  it('returns ko draft conflict copy', () => {
    const copy = getDraftConflictCopy('ko');
    expect(copy.message).toContain('충돌');
    expect(copy.message).toContain('로컬 편집본');
    expect(copy.serverLatestLabel).toBe('서버 최신본 사용');
    expect(copy.saveLocalUnavailableReason).toContain('멱등 키');
    expect(copy.publishBlockedReason).toContain('예약 발행');
  });

  it('returns zh-hant draft conflict copy without Hangul', () => {
    const copy = getDraftConflictCopy('zh-hant');
    expect(copy.message).toContain('衝突');
    expect(copy.serverLatestLabel).toBe('使用伺服器最新版');
    expect(copy.saveLocalUnavailableReason).toContain('冪等鍵');
    expect(Object.values(copy).join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en draft conflict copy without CJK', () => {
    const copy = getDraftConflictCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.heading).toContain('conflict');
    expect(copy.serverLatestLabel).toBe('Use server latest');
    expect(copy.saveLocalUnavailableReason).toContain('idempotency key');
    expect(Object.values(copy).join(' ')).not.toMatch(cjk);
  });

  it('returns ko sandbox page feedback copy', () => {
    const copy = getSandboxPageFeedbackCopy('ko');
    expect(copy.currentPageNotLoaded).toBe('현재 페이지 문서를 아직 불러오지 못했습니다.');
    expect(copy.componentPresetAlreadyMatches('Soft')).toBe('Soft 프리셋이 이미 이 페이지와 일치합니다.');
    expect(copy.componentPresetApplied('Soft', 3)).toBe('Soft 프리셋을 3개 컴포넌트에 적용했습니다.');
    expect(copy.pastedItems(2)).toBe('2개 항목을 붙여넣었습니다.');
    expect(copy.navOrderSaved).toBe('메뉴 순서를 저장했습니다.');
    expect(copy.savedSectionAdded('Hero')).toBe('"Hero" 섹션을 추가했습니다.');
    expect(copy.selectionSummaryNone).toBe('없음');
  });

  it('returns zh-hant sandbox page feedback copy without Hangul', () => {
    const copy = getSandboxPageFeedbackCopy('zh-hant');
    const text = [
      copy.currentPageNotLoaded,
      copy.componentPresetAlreadyMatches('Soft'),
      copy.componentPresetNoTargets,
      copy.componentPresetApplied('Soft', 3),
      copy.pastedItems(2),
      copy.navItemNotFound,
      copy.navNameSaved,
      copy.navNameSaveFailed,
      copy.navMoveUnavailable,
      copy.navOrderSaved,
      copy.navOrderSaveFailed,
      copy.selectedContainerNotFound,
      copy.savedSectionLoadFailed,
      copy.savedSectionInvalid,
      copy.savedSectionInsertFailed,
      copy.savedSectionAdded('Hero'),
      copy.savedSectionAddError,
      copy.savedSectionSaved('Hero'),
      copy.footerContactSettings,
      copy.footerNavigationOpened,
      copy.footerNavigationFallback,
      copy.selectionSummaryMultiple(2),
      copy.selectionSummaryNone,
    ].join(' ');

    expect(copy.navNameSaved).toBe('已儲存選單名稱。');
    expect(copy.savedSectionSaved('Hero')).toBe('已儲存「Hero」區段。');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en sandbox page feedback copy without CJK', () => {
    const copy = getSandboxPageFeedbackCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    const text = [
      copy.currentPageNotLoaded,
      copy.componentPresetAlreadyMatches('Soft'),
      copy.componentPresetNoTargets,
      copy.componentPresetApplied('Soft', 3),
      copy.pastedItems(1),
      copy.pastedItems(2),
      copy.navItemNotFound,
      copy.navNameSaved,
      copy.navNameSaveFailed,
      copy.navMoveUnavailable,
      copy.navOrderSaved,
      copy.navOrderSaveFailed,
      copy.selectedContainerNotFound,
      copy.savedSectionLoadFailed,
      copy.savedSectionInvalid,
      copy.savedSectionInsertFailed,
      copy.savedSectionAdded('Hero'),
      copy.savedSectionAddError,
      copy.savedSectionSaved('Hero'),
      copy.footerContactSettings,
      copy.footerNavigationOpened,
      copy.footerNavigationFallback,
      copy.selectionSummaryMultiple(2),
      copy.selectionSummaryNone,
    ].join(' ');

    expect(copy.pastedItems(1)).toBe('Pasted 1 item');
    expect(copy.pastedItems(2)).toBe('Pasted 2 items');
    expect(copy.savedSectionSaved('Hero')).toBe('Saved "Hero" section.');
    expect(text).not.toMatch(cjk);
  });
});
