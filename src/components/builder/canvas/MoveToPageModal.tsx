'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import { getMoveToPageModalCopy } from './move-to-page-modal-copy';
import ModalShell from './ModalShell';
import styles from './MoveToPageModal.module.css';

interface PageOption {
  pageId: string;
  slug: string;
  isHomePage?: boolean;
  title?: string;
}

export default function MoveToPageModal({
  pages,
  currentPageId,
  sourceNodeIds,
  locale,
  siteId,
  onMoved,
  onClose,
}: {
  pages: PageOption[];
  currentPageId: string;
  sourceNodeIds: string[];
  locale: Locale;
  siteId: string;
  onMoved: (result: {
    movedCount: number;
    movedRootIds: string[];
    targetPageId: string;
    targetSlug: string;
  }) => void;
  onClose: () => void;
}) {
  const copy = getMoveToPageModalCopy(locale);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targets = pages.filter((page) => page.pageId !== currentPageId);

  async function handleMove(target: PageOption) {
    if (submitting) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/pages/${target.pageId}/move-from?${new URLSearchParams({ locale, siteId }).toString()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            siteId,
            sourcePageId: currentPageId,
            nodeIds: sourceNodeIds,
          }),
        },
      );
      const data = (await response.json()) as {
        ok: boolean;
        movedCount?: number;
        movedRootIds?: string[];
        error?: string;
        errorCode?: string;
        message?: string;
      };
      if (!response.ok || !data.ok) {
        setErrorMessage(data.message ?? data.error ?? copy.moveFailed);
        return;
      }
      onMoved({
        movedCount: data.movedCount ?? 0,
        movedRootIds: data.movedRootIds ?? [],
        targetPageId: target.pageId,
        targetSlug: target.slug,
      });
    } catch {
      setErrorMessage(copy.moveFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      title={copy.title}
      description={copy.description(sourceNodeIds.length)}
      ariaLabel={copy.ariaLabel}
      closeAriaLabel={copy.closeAriaLabel}
      size="sm"
      onClose={onClose}
    >
      {errorMessage ? (
        <div className={styles.error}>
          {errorMessage}
        </div>
      ) : null}

      <div className={styles.targetList}>
        {targets.length === 0 ? (
          <div className={styles.emptyState}>
            {copy.noTargetsTitle}<br />
            {copy.noTargetsHint}
          </div>
        ) : (
          targets.map((page) => (
            <button
              key={page.pageId}
              type="button"
              className={styles.targetButton}
              disabled={submitting}
              onClick={() => { void handleMove(page); }}
            >
              <span className={styles.targetIcon}>
                →
              </span>
              <span className={styles.targetText}>
                <span className={styles.targetTitle}>
                  {page.title || page.slug || copy.untitledPage}
                </span>
                <span className={styles.targetMeta}>
                  /{page.slug}
                  {page.isHomePage ? ` - ${copy.homeBadge}` : ''}
                </span>
              </span>
            </button>
          ))
        )}
      </div>

      {submitting ? (
        <div className={styles.status} data-tone="moving">
          {copy.moving}
        </div>
      ) : (
        <div className={styles.status}>
          {copy.closeHint}
        </div>
      )}
    </ModalShell>
  );
}
