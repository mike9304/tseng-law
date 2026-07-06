import { useCallback, useState } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { CheckResult, PublishCheckSuite } from '@/lib/builder/publish-gate/gate-runner';
import type { TranslationReleaseApprovalRequirement } from '@/lib/builder/publish-gate/translation-release-approval';
import type { TranslationReleasePolicy } from '@/lib/builder/publish-gate/translation-release-policy';
import type { TranslationSiteWarningSummary } from '@/lib/builder/publish-gate/translation-site-summary';
import {
  checkBrokenLinks,
  checkEmptyContent,
  checkFormTarget,
  checkH1Count,
  checkImageAlt,
} from '@/lib/builder/publish-gate/checks';
import type { PublishModalCopy } from './publish-copy';
import { parsePublishChecksResponse } from './publish-checks-response';

type PublishCheckReadyState = 'checking' | 'ready';
type PublishCheckCopy = Pick<
  PublishModalCopy,
  'seoServerCheckUnavailableMessage' | 'seoServerCheckUnavailableHint'
>;

interface UsePublishChecksParams {
  readonly document: BuilderCanvasDocument | null;
  readonly activePageId?: string | null;
  readonly locale: string;
  readonly siteId: string;
  readonly copy: PublishCheckCopy;
  readonly setPublishState: (state: PublishCheckReadyState) => void;
}

function buildFallbackSuite(
  document: BuilderCanvasDocument,
  activePageId: string | null | undefined,
  copy: PublishCheckCopy,
): PublishCheckSuite {
  const fallbackResults: CheckResult[] = [
    ...checkEmptyContent(document),
    ...checkBrokenLinks(document),
    ...checkImageAlt(document),
    ...checkFormTarget(document),
    ...checkH1Count(document),
  ];
  if (activePageId) {
    fallbackResults.push({
      id: 'seo-server-check-unavailable',
      severity: 'warning',
      category: 'seo',
      message: copy.seoServerCheckUnavailableMessage,
      fixHint: copy.seoServerCheckUnavailableHint,
    });
  }
  return {
    results: fallbackResults,
    hasBlocker: fallbackResults.some((result) => result.severity === 'blocker'),
    blockerCount: fallbackResults.filter((result) => result.severity === 'blocker').length,
    warningCount: fallbackResults.filter((result) => result.severity === 'warning').length,
    infoCount: fallbackResults.filter((result) => result.severity === 'info').length,
    checkedAt: new Date().toISOString(),
  };
}

export function usePublishChecks({
  document,
  activePageId,
  locale,
  siteId,
  copy,
  setPublishState,
}: UsePublishChecksParams): {
  readonly suite: PublishCheckSuite | null;
  readonly setSuite: (suite: PublishCheckSuite | null) => void;
  readonly translationSiteWarnings: TranslationSiteWarningSummary | null;
  readonly translationReleasePolicy: TranslationReleasePolicy | null;
  readonly translationReleaseApproval: TranslationReleaseApprovalRequirement | null;
  readonly translationSiteWarningsAcknowledged: boolean;
  readonly setTranslationSiteWarningsAcknowledged: (acknowledged: boolean) => void;
  readonly overrideWarnings: boolean;
  readonly setOverrideWarnings: (overrideWarnings: boolean) => void;
  readonly resetPublishChecks: () => void;
  readonly runChecks: () => Promise<void>;
} {
  const [suite, setSuite] = useState<PublishCheckSuite | null>(null);
  const [translationSiteWarnings, setTranslationSiteWarnings] =
    useState<TranslationSiteWarningSummary | null>(null);
  const [translationReleasePolicy, setTranslationReleasePolicy] =
    useState<TranslationReleasePolicy | null>(null);
  const [translationReleaseApproval, setTranslationReleaseApproval] =
    useState<TranslationReleaseApprovalRequirement | null>(null);
  const [translationSiteWarningsAcknowledged, setTranslationSiteWarningsAcknowledged] =
    useState(false);
  const [overrideWarnings, setOverrideWarnings] = useState(false);

  const resetPublishChecks = useCallback(() => {
    setSuite(null);
    setTranslationSiteWarnings(null);
    setTranslationReleasePolicy(null);
    setTranslationReleaseApproval(null);
    setTranslationSiteWarningsAcknowledged(false);
    setOverrideWarnings(false);
  }, []);

  const runChecks = useCallback(async () => {
    if (!document) return;
    setPublishState('checking');
    resetPublishChecks();
    if (activePageId) {
      try {
        const response = await fetch('/api/builder/site/publish-checks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            siteId,
            pageId: activePageId,
            locale,
            document,
          }),
        });
        if (response.ok) {
          const data = parsePublishChecksResponse(await response.json());
          if (data?.ok && data.suite) {
            setSuite(data.suite);
            setTranslationSiteWarnings(data.translationSiteWarnings ?? null);
            setTranslationReleasePolicy(data.translationReleasePolicy ?? null);
            setTranslationReleaseApproval(data.translationReleaseApproval ?? null);
            setPublishState('ready');
            return;
          }
        }
      } catch (error) {
        if (!(error instanceof Error)) throw error;
      }
    }

    setSuite(buildFallbackSuite(document, activePageId, copy));
    setTranslationSiteWarnings(null);
    setTranslationReleasePolicy(null);
    setTranslationReleaseApproval(null);
    setPublishState('ready');
  }, [activePageId, copy, document, locale, resetPublishChecks, setPublishState, siteId]);

  return {
    suite,
    setSuite,
    translationSiteWarnings,
    translationReleasePolicy,
    translationReleaseApproval,
    translationSiteWarningsAcknowledged,
    setTranslationSiteWarningsAcknowledged,
    overrideWarnings,
    setOverrideWarnings,
    resetPublishChecks,
    runChecks,
  };
}
