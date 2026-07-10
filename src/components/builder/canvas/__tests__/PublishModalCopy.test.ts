import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { PublishCheckSuite } from '@/lib/builder/publish-gate/gate-runner';
import type { TranslationSiteWarningSummary } from '@/lib/builder/publish-gate/translation-site-summary';
import { getDocumentDiffCopy } from '@/lib/builder/canvas/document-diff-copy';
import { buildPreflightItems, CheckListItem, formatScheduledAt } from '../PublishModalPreflight';
import {
  PublishTranslationSiteReview,
  PublishWarningOverrideReview,
} from '../PublishModalIssues';
import { PublishModalDiffPanel } from '../PublishModalDiffPanel';
import type { PublishDiffState } from '../PublishModalTypes';
import { getPublishModalCopy } from '../publish-copy';

const suite: PublishCheckSuite = {
  results: [
    {
      id: 'image-alt',
      severity: 'warning',
      category: 'images',
      message: 'Image alt required',
    },
    {
      id: 'seo-title',
      severity: 'blocker',
      category: 'seo',
      message: 'SEO title missing',
    },
    {
      id: 'translation-outdated-page-about-ko-en',
      severity: 'warning',
      category: 'translations',
      message: 'About page translation is stale',
      action: {
        href: '/ko/admin-builder/translations?sourceLocale=ko&category=pages&search=page-about-ko&status=outdated&target=en',
      },
    },
    {
      id: 'form-webhook',
      severity: 'info',
      category: 'forms',
      message: 'Form webhook configured',
    },
    {
      id: 'code-slot-function-missing',
      severity: 'blocker',
      category: 'dev',
      message: 'Code slot function is missing',
    },
  ],
  hasBlocker: true,
  blockerCount: 2,
  warningCount: 2,
  infoCount: 1,
  checkedAt: new Date().toISOString(),
};

const warningOnlySuite: PublishCheckSuite = {
  results: suite.results.filter((result) => result.severity === 'warning'),
  hasBlocker: false,
  blockerCount: 0,
  warningCount: 2,
  infoCount: 0,
  checkedAt: suite.checkedAt,
};

describe('publish modal copy', () => {
  it('returns localized ko strings for the modal and preflight labels', () => {
    const copy = getPublishModalCopy('ko');
    expect(copy.title).toBe('페이지 발행');
    expect(copy.preflightTitle).toBe('자동 사전 검사');
    expect(copy.scheduleInputAria).toBe('예약 발행 시각');
    expect(copy.scheduleDraftRevisionLabel).toBe('초안 v');
    expect(copy.scheduledJobStatus('published')).toBe('발행 완료');
    expect(copy.subtitle(3)).toBe('초안 3 기준 발행 예정');
    expect(copy.diffTitle).toBe('초안 대 발행본');
    expect(copy.diffNoChanges).toBe('마지막 발행 버전과 현재 초안이 동일합니다.');
    expect(copy.diffFallback).toBe('발행 기준이 준비되면 발행 전 변경 요약이 표시됩니다.');
    expect(copy.warningOverrideReviewTitle).toBe('경고 검토');
    expect(copy.warningOverrideAcknowledged(2)).toContain('경고 2개');
    expect(copy.warningOverrideCategoryLabel('번역', 2)).toBe('번역: 2개 경고');
    expect(copy.blockersTitle(2)).toBe('차단 문제 (2) — 발행 불가');
    expect(copy.publishBlockedMessage).toContain('수정');
    expect(copy.publishSandboxSaveError).toContain('발행 전 초안');
    expect(copy.publishStaleMessage(7)).toContain('현재 버전: 7');
    expect(copy.toastPublishScheduleNetworkError).toContain('예약 발행 저장');
    expect(copy.publishedRevisionLabel(12, '2026-05-31 12:00')).toBe('발행본 v12 · 2026-05-31 12:00');
    expect(copy.publishedRevisionLabel(null)).toBe('발행본 v?');
    expect(copy.scheduleDraftRevisionLabel + '12').toBe('초안 v12');

    const items = buildPreflightItems(suite, 'ko');
    expect(items.map((item) => item.label)).toEqual(['이미지', '링크', 'CMS 데이터', 'SEO', '번역', '양식', '개발']);
    expect(items[0].detail).toContain('빈 alt 이미지');
    expect(items[4]).toEqual(expect.objectContaining({ key: 'translations', tone: 'warning', warningCount: 1 }));
    expect(items[6]).toEqual(expect.objectContaining({ key: 'dev', tone: 'blocker', blockerCount: 1 }));
    expect(formatScheduledAt('2026-06-01T12:00:00.000Z', 'ko')).toMatch(/2026/);
  });

  it('returns localized zh-hant strings for the modal and preflight labels', () => {
    const copy = getPublishModalCopy('zh-hant');
    expect(copy.title).toBe('頁面發佈');
    expect(copy.preflightTitle).toBe('自動預檢');
    expect(copy.scheduleInputAria).toBe('排程發佈時間');
    expect(copy.scheduleDraftRevisionLabel).toBe('草稿 v');
    expect(copy.scheduledJobStatus('cancelled')).toBe('已取消');
    expect(copy.subtitle(5)).toBe('將依草稿版本 5 發佈');
    expect(copy.diffTitle).toBe('草稿對已發佈版本');
    expect(copy.blockersTitle(2)).toBe('阻擋問題 (2) — 無法發佈');
    expect(copy.publishBlockedMessage).toContain('修正');
    expect(copy.publishSandboxSaveError).toContain('儲存草稿');
    expect(copy.publishStaleMessage(9)).toContain('目前版本：9');
    expect(copy.toastPublishScheduleNetworkError).toContain('排程發佈');
    expect(copy.publishedRevisionLabel(7, '2026-05-31 12:00')).toBe('已發佈版本 v7 · 2026-05-31 12:00');
    expect(copy.publishedRevisionLabel(undefined)).toBe('已發佈版本 v?');
    expect(copy.scheduleDraftRevisionLabel + '7').toBe('草稿 v7');

    const items = buildPreflightItems(suite, 'zh-hant');
    expect(items.map((item) => item.label)).toEqual(['圖片', '連結', 'CMS 資料', 'SEO', '翻譯', '表單', '開發']);
    expect(items[1].detail).toContain('空白連結');
    expect(formatScheduledAt('2026-06-01T12:00:00.000Z', 'zh-hant')).toMatch(/2026/);
  });

  it('renders localized action links for issue rows with review destinations', () => {
    const markup = renderToStaticMarkup(createElement(CheckListItem, {
      result: {
        id: 'translation-outdated-page-about-ko-en',
        severity: 'warning',
        category: 'translations',
        message: 'About page translation is stale',
        action: {
          href: '/ko/admin-builder/translations?sourceLocale=ko&category=pages&search=page-about-ko&status=outdated&target=en',
        },
      },
      locale: 'ko',
    }));

    expect(markup).toContain('href="/ko/admin-builder/translations?sourceLocale=ko&amp;category=pages&amp;search=page-about-ko&amp;status=outdated&amp;target=en"');
    expect(markup).toContain('검토');
  });

  it('renders warning override review status and category counts', () => {
    const pendingMarkup = renderToStaticMarkup(createElement(PublishWarningOverrideReview, {
      warnings: warningOnlySuite.results,
      preflightItems: buildPreflightItems(warningOnlySuite, 'ko'),
      locale: 'ko',
      overrideWarnings: false,
    }));
    const acknowledgedMarkup = renderToStaticMarkup(createElement(PublishWarningOverrideReview, {
      warnings: warningOnlySuite.results,
      preflightItems: buildPreflightItems(warningOnlySuite, 'ko'),
      locale: 'ko',
      overrideWarnings: true,
    }));

    expect(pendingMarkup).toContain('data-builder-publish-warning-override-review="pending"');
    expect(pendingMarkup).toContain('data-builder-publish-warning-override-count="2"');
    expect(pendingMarkup).toContain('이미지: 1개 경고');
    expect(pendingMarkup).toContain('번역: 1개 경고');
    expect(acknowledgedMarkup).toContain('data-builder-publish-warning-override-review="acknowledged"');
    expect(acknowledgedMarkup).toContain('경고 2개를 확인했습니다.');
  });

  it('renders the site-wide translation review summary', () => {
    const copy = getPublishModalCopy('ko');
    const summary: TranslationSiteWarningSummary = {
      sourceLocale: 'ko',
      syncedAt: '2026-06-20T00:00:00.000Z',
      totalCount: 5,
      currentPageCount: 2,
      otherPageCount: 3,
      warningCount: 4,
      errorCount: 1,
      reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
      warningFingerprint: 'modal-copy-summary-fingerprint',
    };
    const pendingMarkup = renderToStaticMarkup(createElement(PublishTranslationSiteReview, {
      summary,
      locale: 'ko',
      acknowledged: false,
      onAcknowledge: () => undefined,
    }));
    const acknowledgedMarkup = renderToStaticMarkup(createElement(PublishTranslationSiteReview, {
      summary,
      locale: 'ko',
      acknowledged: true,
      onAcknowledge: () => undefined,
    }));

    expect(copy.translationSiteReviewTitle).toBe('사이트 번역 검토');
    expect(pendingMarkup).toContain('data-builder-publish-site-translation-review="true"');
    expect(pendingMarkup).toContain('data-builder-publish-site-translation-total="5"');
    expect(pendingMarkup).toContain('data-builder-publish-site-translation-current="2"');
    expect(pendingMarkup).toContain('data-builder-publish-site-translation-review-state="pending"');
    expect(pendingMarkup).toContain('data-builder-publish-site-translation-acknowledge="true"');
    expect(pendingMarkup).toContain('다른 페이지 번역 경고 3개를 확인해야 발행 또는 예약을 계속할 수 있습니다.');
    expect(pendingMarkup).toContain('사이트 전체 번역 경고 5개 중 다른 페이지 경고 3개가 있습니다.');
    expect(pendingMarkup).toContain('현재 페이지: 2개');
    expect(pendingMarkup).toContain('href="/ko/admin-builder/translations?sourceLocale=ko&amp;category=pages"');
    expect(pendingMarkup).toContain('전체 번역 검토');
    expect(acknowledgedMarkup).toContain('data-builder-publish-site-translation-review-state="acknowledged"');
    expect(acknowledgedMarkup).toContain('다른 페이지 번역 경고 3개를 확인했습니다.');
  });

  it('does not require site-wide translation acknowledgement when only the current page has warnings', () => {
    const markup = renderToStaticMarkup(createElement(PublishTranslationSiteReview, {
      summary: {
        sourceLocale: 'ko',
        syncedAt: '2026-06-20T00:00:00.000Z',
        totalCount: 2,
        currentPageCount: 2,
        otherPageCount: 0,
        warningCount: 2,
        errorCount: 0,
        reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
        warningFingerprint: 'modal-copy-current-page-fingerprint',
      },
      locale: 'ko',
      acknowledged: false,
      onAcknowledge: () => undefined,
    }));

    expect(markup).toContain('data-builder-publish-site-translation-review="true"');
    expect(markup).toContain('data-builder-publish-site-translation-review-state="not-required"');
    expect(markup).not.toContain('data-builder-publish-site-translation-acknowledge="true"');
  });

  it('renders the diff panel as an accessible named region scoped for screenshots', () => {
    const copy = getPublishModalCopy('ko');
    const diffCopy = getDocumentDiffCopy('ko');
    const publishDiff: PublishDiffState = {
      status: 'ready',
      diff: {
        added: [],
        removed: [],
        modified: [{ id: 'title-1', kind: 'text', changes: ['text'] }],
      },
      summary: { added: 0, removed: 0, modified: 1 },
      publishedRevision: 1,
      publishedRevisionId: 'rev-1',
    };
    const markup = renderToStaticMarkup(createElement(PublishModalDiffPanel, {
      copy,
      diffCopy,
      locale: 'ko',
      publishDiff,
    }));

    expect(markup).toContain('<section');
    expect(markup).toContain('data-builder-publish-diff-summary="true"');
    expect(markup).toContain(`aria-label="${copy.diffTitle}"`);
    expect(markup).toContain(copy.diffTitle);
  });
});
