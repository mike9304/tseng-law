'use client';

import { useMemo } from 'react';
import {
  checkAccessibility,
  type A11yIssue,
  type A11ySeverity,
} from '@/lib/builder/a11y/a11y-checker';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { Locale } from '@/lib/locales';
import { getSandboxA11yPanelCopy } from './sandbox-a11y-panel-copy';
import { getSandboxLayersPanelCopy } from './sandbox-layers-panel-copy';
import styles from './A11yPanel.module.css';

type A11yIssueCounts = Record<A11ySeverity, number>;

function countA11yIssues(issues: A11yIssue[]): A11yIssueCounts {
  const counts: A11yIssueCounts = {
    error: 0,
    warning: 0,
    info: 0,
  };

  for (const issue of issues) {
    counts[issue.severity] += 1;
  }

  return counts;
}

/* ── Component ──────────────────────────────────────────────────── */

export default function A11yPanel({ locale = 'ko' }: { locale?: Locale }) {
  const document = useBuilderCanvasStore((s) => s.document);
  const setSelectedNodeId = useBuilderCanvasStore((s) => s.setSelectedNodeId);
  const copy = getSandboxA11yPanelCopy(locale);
  const kindLabels = getSandboxLayersPanelCopy(locale).kindLabels;

  const issues: A11yIssue[] = useMemo(() => {
    if (!document) return [];
    return checkAccessibility(document, locale);
  }, [document, locale]);
  const issueCounts = useMemo(() => countA11yIssues(issues), [issues]);

  return (
    <div className={styles.root}>
      {issues.length === 0 ? (
        <div className={styles.passCard}>
          <span className={styles.passIcon} aria-hidden />
          <span>{copy.passMessage}</span>
        </div>
      ) : (
        <>
          <div className={styles.summary}>
            {copy.summaryLabel({
              total: issues.length,
              error: issueCounts.error,
              warning: issueCounts.warning,
              info: issueCounts.info,
            })}
          </div>
          <div className={styles.issueList}>
            {issues.map((issue, idx) => (
              <button
                key={`${issue.nodeId}-${issue.rule}-${idx}`}
                type="button"
                className={styles.issueCard}
                data-severity={issue.severity}
                aria-disabled={!issue.nodeId}
                onClick={() => {
                  if (issue.nodeId) {
                    setSelectedNodeId(issue.nodeId);
                  }
                }}
              >
                <div className={styles.issueHeader}>
                  <span className={styles.severityIcon} data-severity={issue.severity} aria-hidden />
                  <span className={styles.issueMessage}>{issue.message}</span>
                </div>
                {issue.suggestion ? (
                  <div className={styles.suggestion}>{issue.suggestion}</div>
                ) : null}
                {issue.nodeId ? (
                  <div className={styles.nodeMeta}>
                    {issue.nodeKind === 'page'
                      ? copy.pageKindLabel
                      : kindLabels[issue.nodeKind] ?? issue.nodeKind} &middot; {issue.nodeId}
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
