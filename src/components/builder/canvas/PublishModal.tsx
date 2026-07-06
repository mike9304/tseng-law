'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDocumentDiffCopy } from '@/lib/builder/canvas/document-diff-copy';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { Locale } from '@/lib/locales';
import ModalShell from './ModalShell';
import { buildPreflightItems, defaultScheduleInput } from './PublishModalPreflight';
import { PublishModalDiffPanel } from './PublishModalDiffPanel';
import { PublishModalIssues } from './PublishModalIssues';
import { PublishModalFooter } from './PublishModalFooter';
import { PublishModalPreflightGrid } from './PublishModalPreflightGrid';
import { PublishModalSchedulePanel } from './PublishModalSchedulePanel';
import { buildPublishSubmitState, buildTranslationSiteReviewInput, groupPublishCheckResults } from './PublishModalState';
import { getPublishModalCopy } from './publish-copy';
import type { PublishModalProps, PublishState, ScheduledPublishJob } from './PublishModalTypes';
import { usePublishActions } from './usePublishActions';
import { usePublishChecks } from './usePublishChecks';
import { usePublishDiff } from './usePublishDiff';
import { useScheduledPublishActions } from './useScheduledPublishActions';
import { useScheduledPublishLoader } from './useScheduledPublishLoader';
import { useTranslationReleaseApprovalRequest } from './useTranslationReleaseApprovalRequest';
import styles from './PublishModal.module.css';

export default function PublishModal({
  open,
  document,
  locale,
  siteId,
  activePageId,
  draftMeta,
  onDraftSaved,
  onToast,
  onClose,
}: PublishModalProps) {
  const setSelectedNodeId = useBuilderCanvasStore((s) => s.setSelectedNodeId);
  const copy = useMemo(() => getPublishModalCopy(locale as Locale), [locale]);
  const diffCopy = useMemo(() => getDocumentDiffCopy(locale), [locale]);
  const [publishState, setPublishState] = useState<PublishState>('checking');
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [scheduledAtInput, setScheduledAtInput] = useState(defaultScheduleInput);
  const [scheduledJob, setScheduledJob] = useState<ScheduledPublishJob | null>(null);
  const [schedulePending, setSchedulePending] = useState(false);
  const [scheduleCancelPending, setScheduleCancelPending] = useState(false);
  const {
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
  } = usePublishChecks({ document, activePageId, locale, siteId, copy, setPublishState });
  const { publishDiff, resetPublishDiff, loadPublishDiff } =
    usePublishDiff({ activePageId, copy, diffCopy, document, locale, siteId });
  const {
    requestState: translationReleaseApprovalRequestState,
    requestApproval: requestTranslationReleaseApproval,
  } = useTranslationReleaseApprovalRequest({
    activePageId,
    locale,
    translationSiteWarnings,
    runChecks,
  });

  useEffect(() => {
    if (!open) {
      setPublishState('checking');
      setPublishError(null);
      setPublishedSlug(null);
      resetPublishChecks();
      setScheduledJob(null);
      setSchedulePending(false);
      setScheduleCancelPending(false);
      resetPublishDiff();
      return;
    }
    void runChecks();
    void loadPublishDiff();
  }, [open, runChecks, loadPublishDiff, resetPublishChecks, resetPublishDiff]);

  useScheduledPublishLoader({
    activePageId,
    locale,
    siteId,
    open,
    setScheduledAtInput,
    setScheduledJob,
  });

  const grouped = groupPublishCheckResults(suite);
  const preflightItems = useMemo(() => buildPreflightItems(suite, locale as Locale), [suite, locale]);
  const { canSubmitPublish, hasWarningsOnly } = buildPublishSubmitState({
    suite,
    publishState,
    overrideWarnings,
    translationSiteWarnings,
    translationSiteWarningsAcknowledged,
  });
  const translationSiteReview = buildTranslationSiteReviewInput(
    translationSiteWarnings,
    translationSiteWarningsAcknowledged,
  );

  const handleFix = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
      onClose();
    },
    [setSelectedNodeId, onClose],
  );

  const {
    handlePublish,
  } = usePublishActions({
    activePageId,
    canSubmitPublish,
    copy,
    document,
    draftMeta,
    locale,
    siteId,
    onDraftSaved,
    onToast,
    translationSiteReview,
    setPublishError,
    setPublishedSlug,
    setPublishState,
    setSuite,
  });
  const {
    handleSchedulePublish,
    handleCancelScheduledPublish,
  } = useScheduledPublishActions({
    activePageId,
    canSubmitPublish,
    copy,
    document,
    draftMeta,
    locale,
    siteId,
    onDraftSaved,
    onToast,
    translationSiteReview,
    scheduledAtInput,
    scheduledJob,
    setPublishError,
    setPublishState,
    setScheduleCancelPending,
    setScheduledAtInput,
    setScheduledJob,
    setSchedulePending,
  });

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={copy.title}
      subtitle={activePageId ? copy.subtitle(draftMeta?.revision ?? 0) : undefined}
      size="lg"
    >

          {publishState === 'checking' && (
            <p className={styles.checkingText}>
              {copy.checking}
            </p>
          )}

          {publishState !== 'checking' && suite && (
            <>
              <PublishModalPreflightGrid
                copy={copy}
                items={preflightItems}
                locale={locale as Locale}
              />

              {activePageId ? (
                <PublishModalDiffPanel
                  copy={copy}
                  diffCopy={diffCopy}
                  locale={locale as Locale}
                  publishDiff={publishDiff}
                />
              ) : null}

              <PublishModalIssues
                grouped={grouped}
                preflightItems={preflightItems}
                locale={locale as Locale}
                overrideWarnings={overrideWarnings}
                translationSiteWarnings={translationSiteWarnings}
                translationReleasePolicy={translationReleasePolicy}
                translationReleaseApproval={translationReleaseApproval}
                translationReleaseApprovalRequestState={translationReleaseApprovalRequestState}
                translationSiteWarningsAcknowledged={translationSiteWarningsAcknowledged}
                onAcknowledgeTranslationSiteWarnings={() => setTranslationSiteWarningsAcknowledged(true)}
                onRequestTranslationReleaseApproval={() => void requestTranslationReleaseApproval()}
                onFix={handleFix}
              />

              {suite.results.length === 0 && publishState === 'ready' && (
                <p className={styles.sectionTitle} data-tone="ready">
                  {copy.readyTitle}
                </p>
              )}

              {activePageId ? (
                <PublishModalSchedulePanel
                  canSubmitPublish={canSubmitPublish}
                  copy={copy}
                  handleCancelScheduledPublish={() => void handleCancelScheduledPublish()}
                  handleSchedulePublish={() => void handleSchedulePublish()}
                  locale={locale as Locale}
                  scheduleCancelPending={scheduleCancelPending}
                  schedulePending={schedulePending}
                  scheduledAtInput={scheduledAtInput}
                  scheduledJob={scheduledJob}
                  setScheduledAtInput={setScheduledAtInput}
                />
              ) : null}
            </>
          )}

          {publishState === 'success' && publishedSlug && (
            <div className={styles.successBox}>
              {copy.successMessage}{' '}
              <a
                href={publishedSlug}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.successLink}
              >
                {copy.successLink(publishedSlug)}
              </a>
            </div>
          )}

          {publishState === 'error' && publishError && (
            <div className={styles.errorBox}>
              {publishError}
            </div>
          )}

      <PublishModalFooter
        canSubmitPublish={canSubmitPublish}
        copy={copy}
        hasWarningsOnly={hasWarningsOnly}
        handlePublish={() => void handlePublish()}
        onClose={onClose}
        overrideWarnings={overrideWarnings}
        publishState={publishState}
        setOverrideWarnings={setOverrideWarnings}
        warningCount={suite?.warningCount ?? 0}
      />
    </ModalShell>
  );
}
