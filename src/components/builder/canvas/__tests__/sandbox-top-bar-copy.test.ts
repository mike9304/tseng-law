import { describe, expect, it } from 'vitest';
import { getSandboxTopBarCopy } from '../sandbox-top-bar-copy';

describe('sandbox top bar copy', () => {
  it('returns ko top bar chrome copy', () => {
    const copy = getSandboxTopBarCopy('ko');
    expect(copy.siteSettingsTitle).toBe('사이트 설정');
    expect(copy.defaultSiteName).toBe('호정국제');
    expect(copy.homePageLabel).toBe('홈');
    expect(copy.memberPreviewLabels['signed-out']).toBe('방문자');
    expect(copy.collaborationLabel).toBe('협업');
    expect(copy.presenceActiveLabel(2)).toBe('2명 접속 중');
    expect(copy.presenceTitle(2, ['admin', 'mike'])).toContain('2명');
    expect(copy.viewportLabels.desktop).toBe('데스크톱');
    expect(copy.responsiveAiLabel).toBe('AI');
    expect(copy.responsiveAiTitle('모바일')).toContain('반응형 AI');
    expect(copy.selectionCountLabel(2)).toBe('2개 선택됨');
    expect(copy.saveStateLabels.saving).toBe('저장 중...');
    expect(copy.publishLabel).toBe('발행');
    expect(copy.quickJumpEmptyState).toBe('결과가 없습니다.');
  });

  it('returns zh-hant top bar chrome copy without Hangul', () => {
    const copy = getSandboxTopBarCopy('zh-hant');
    const text = [
      copy.siteSettingsTitle,
      copy.defaultSiteName,
      copy.pageSelectTitle,
      copy.homePageLabel,
      copy.quickJumpSelectLabel,
      copy.quickJumpButtonLabel,
      copy.memberPreviewLabel,
      copy.collaborationLabel,
      ...Object.values(copy.memberPreviewLabels),
      ...Object.values(copy.viewportLabels),
      copy.responsiveResetLabel,
      copy.responsiveOverrideBadgeLabel,
      copy.responsiveAiLabel,
      copy.responsiveAiTitle(copy.viewportLabels.mobile),
      copy.responsiveAiDisabledTitle,
      copy.selectionCountLabel(3),
      ...Object.values(copy.saveStateLabels),
      copy.saveBlockedLabel,
      copy.historyLabel,
      copy.previewLabel,
      copy.publishLabel,
      copy.quickJumpModalTitle,
      copy.quickJumpSearchPlaceholder,
      copy.quickJumpEmptyState,
    ].join(' ');

    expect(copy.defaultSiteName).toBe('浩正國際');
    expect(copy.memberPreviewLabels.premium).toBe('進階會員');
    expect(copy.collaborationLabel).toBe('協作');
    expect(copy.viewportLabels.mobile).toBe('手機');
    expect(copy.saveStateLabels.error).toBe('儲存失敗');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en top bar chrome copy without CJK', () => {
    const copy = getSandboxTopBarCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    const text = [
      copy.siteSettingsTitle,
      copy.defaultSiteName,
      copy.pageSelectTitle,
      copy.homePageLabel,
      copy.quickJumpSelectLabel,
      copy.quickJumpButtonLabel,
      copy.memberPreviewLabel,
      copy.collaborationLabel,
      ...Object.values(copy.memberPreviewLabels),
      ...Object.values(copy.viewportLabels),
      copy.responsiveResetLabel,
      copy.responsiveOverrideBadgeLabel,
      copy.responsiveAiLabel,
      copy.responsiveAiTitle(copy.viewportLabels.mobile),
      copy.responsiveAiDisabledTitle,
      copy.selectionCountLabel(4),
      ...Object.values(copy.saveStateLabels),
      copy.saveBlockedLabel,
      copy.historyLabel,
      copy.previewLabel,
      copy.publishLabel,
      copy.quickJumpModalTitle,
      copy.quickJumpSearchPlaceholder,
      copy.quickJumpEmptyState,
    ].join(' ');

    expect(copy.defaultSiteName).toBe('Tseng Law');
    expect(copy.memberPreviewLabels['signed-out']).toBe('Visitor');
    expect(copy.presenceActiveLabel(3)).toBe('3 online');
    expect(copy.viewportLabels.tablet).toBe('Tablet');
    expect(copy.saveStateLabels.error).toBe('Save failed');
    expect(text).not.toMatch(cjk);
  });
});
