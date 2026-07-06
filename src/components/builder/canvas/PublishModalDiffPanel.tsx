import {
  formatDiffNodeKind,
  formatDocumentDiffSummary,
  summarizeDiffNode,
} from '@/lib/builder/canvas/document-diff';
import type { DocumentDiffCopy } from '@/lib/builder/canvas/document-diff-copy';
import type { Locale } from '@/lib/locales';
import { formatScheduledAt } from './PublishModalPreflight';
import type { PublishModalCopy } from './publish-copy';
import type { PublishDiffState } from './PublishModalTypes';
import styles from './PublishModal.module.css';

interface PublishModalDiffPanelProps {
  readonly copy: PublishModalCopy;
  readonly diffCopy: DocumentDiffCopy;
  readonly locale: Locale;
  readonly publishDiff: PublishDiffState;
}

export function PublishModalDiffPanel({
  copy,
  diffCopy,
  locale,
  publishDiff,
}: PublishModalDiffPanelProps): JSX.Element {
  const changedCount = publishDiff.status === 'ready'
    ? publishDiff.summary.added + publishDiff.summary.removed + publishDiff.summary.modified
    : 0;
  const examples = publishDiff.status === 'ready'
    ? [
        ...publishDiff.diff.added.slice(0, 2).map((node) => ({
          id: node.id,
          tone: copy.diffAdded,
          detail: summarizeDiffNode(node, diffCopy),
        })),
        ...publishDiff.diff.removed.slice(0, 2).map((node) => ({
          id: node.id,
          tone: copy.diffRemoved,
          detail: summarizeDiffNode(node, diffCopy),
        })),
        ...publishDiff.diff.modified.slice(0, 3).map((node) => ({
          id: node.id,
          tone: copy.diffModified,
          detail: `${formatDiffNodeKind(node.kind, diffCopy)} - ${node.changes.join(' / ')}`,
        })),
      ].slice(0, 5)
    : [];

  return (
    <div className={styles.publishDiffPanel}>
      <div className={styles.checklistLabel}>
        <span>{copy.diffTitle}</span>
        <span className={styles.checklistStatus}>
          {publishDiff.status === 'ready'
            ? formatDocumentDiffSummary(publishDiff.summary, diffCopy)
            : publishDiff.status === 'loading'
              ? copy.diffStatus.loading
              : publishDiff.status === 'missing'
                ? copy.diffStatus.missing
                : publishDiff.status === 'error'
                  ? copy.diffStatus.error
                  : copy.diffStatus.idle}
        </span>
      </div>

      {publishDiff.status === 'ready' ? (
        <>
          <div className={styles.publishDiffStatRow}>
            <span className={styles.publishDiffStat} data-tone="added">{copy.diffAdded} {publishDiff.summary.added}</span>
            <span className={styles.publishDiffStat} data-tone="removed">{copy.diffRemoved} {publishDiff.summary.removed}</span>
            <span className={styles.publishDiffStat} data-tone="modified">{copy.diffModified} {publishDiff.summary.modified}</span>
            <span className={styles.checklistDetailInline}>
              {copy.publishedRevisionLabel(
                publishDiff.publishedRevision,
                publishDiff.publishedSavedAt ? formatScheduledAt(publishDiff.publishedSavedAt, locale) : undefined,
              )}
            </span>
          </div>
          {changedCount === 0 ? (
            <div className={styles.checklistDetail}>
              {copy.diffNoChanges}
            </div>
          ) : (
            <ul className={styles.publishDiffList} aria-label={copy.changedNodesLabel}>
              {examples.map((item) => (
                <li key={`${item.tone}-${item.id}`} className={styles.publishDiffItem}>
                  <strong>{item.tone}</strong>{' '}
                  <code>{item.id}</code> · {item.detail}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className={styles.checklistDetail}>
          {publishDiff.status === 'loading'
            ? copy.diffStatus.loading
            : publishDiff.status === 'missing' || publishDiff.status === 'error'
              ? publishDiff.message
              : copy.diffFallback}
        </div>
      )}
    </div>
  );
}
