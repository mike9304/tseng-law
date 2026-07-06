import { useCallback, useState } from 'react';
import type { TranslationSiteWarningSummary } from '@/lib/builder/publish-gate/translation-site-summary';

export type TranslationReleaseApprovalRequestState = 'idle' | 'pending' | 'error';

export function useTranslationReleaseApprovalRequest({
  activePageId,
  locale,
  translationSiteWarnings,
  runChecks,
}: {
  readonly activePageId?: string | null;
  readonly locale: string;
  readonly translationSiteWarnings: TranslationSiteWarningSummary | null;
  readonly runChecks: () => Promise<void>;
}): {
  readonly requestState: TranslationReleaseApprovalRequestState;
  readonly requestApproval: () => Promise<void>;
} {
  const [requestState, setRequestState] =
    useState<TranslationReleaseApprovalRequestState>('idle');

  const requestApproval = useCallback(async () => {
    if (!activePageId || !translationSiteWarnings) return;
    setRequestState('pending');
    try {
      const response = await fetch('/api/builder/site/translation-release-approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          pageId: activePageId,
          locale,
          summary: translationSiteWarnings,
        }),
      });
      if (!response.ok) {
        setRequestState('error');
        return;
      }
      await runChecks();
      setRequestState('idle');
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      setRequestState('error');
    }
  }, [activePageId, locale, runChecks, translationSiteWarnings]);

  return { requestState, requestApproval };
}
