import type {
  CheckResult,
  PublishCheckSuite,
} from '@/lib/builder/publish-gate/gate-runner';
import type { Locale } from '@/lib/locales';
import styles from './PublishModal.module.css';
import {
  formatScheduledAt as formatScheduledAtCopy,
  getPublishModalCopy,
  type PreflightTone,
} from './publish-copy';

export interface PreflightItem {
  key: string;
  label: string;
  detail: string;
  tone: PreflightTone;
  blockerCount: number;
  warningCount: number;
}

export function blockerSuite(blockers: readonly CheckResult[]): PublishCheckSuite {
  return {
    results: blockers,
    hasBlocker: blockers.some((result) => result.severity === 'blocker'),
    blockerCount: blockers.filter((result) => result.severity === 'blocker').length,
    warningCount: blockers.filter((result) => result.severity === 'warning').length,
    infoCount: blockers.filter((result) => result.severity === 'info').length,
    checkedAt: new Date().toISOString(),
  };
}

function toLocalDateTimeInput(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function defaultScheduleInput(): string {
  return toLocalDateTimeInput(new Date(Date.now() + 60 * 60 * 1000));
}

export function formatScheduledAt(value: string, locale: Locale): string {
  return formatScheduledAtCopy(value, locale);
}

export function formatScheduleInput(value: string): string {
  return toLocalDateTimeInput(new Date(value));
}

function severityIcon(sev: 'blocker' | 'warning' | 'info'): string {
  if (sev === 'blocker') return '✕';
  if (sev === 'warning') return '!';
  return 'ℹ';
}

function itemTone(results: CheckResult[]): PreflightTone {
  if (results.some((result) => result.severity === 'blocker')) return 'blocker';
  if (results.some((result) => result.severity === 'warning')) return 'warning';
  return 'ok';
}

export function itemStatus(item: PreflightItem, locale: Locale): string {
  const copy = getPublishModalCopy(locale);
  return copy.itemStatus(item.tone, item.blockerCount, item.warningCount);
}

export function buildPreflightItems(suite: PublishCheckSuite | null, locale: Locale): PreflightItem[] {
  const results = suite?.results ?? [];
  const imageResults = results.filter((result) =>
    result.category === 'images'
    || (result.category === 'accessibility' && result.id.startsWith('image-')),
  );
  const linkResults = results.filter((result) => result.category === 'links');
  const dataResults = results.filter((result) => result.category === 'data');
  const seoResults = results.filter((result) => result.category === 'seo');
  const translationResults = results.filter((result) => result.category === 'translations');
  const formResults = results.filter((result) => result.category === 'forms');
  const devResults = results.filter((result) => result.category === 'dev');
  const copy = getPublishModalCopy(locale);

  return [
    {
      key: 'images',
      label: copy.preflight.images.label,
      detail: copy.preflight.images.detail,
      tone: itemTone(imageResults),
      blockerCount: imageResults.filter((result) => result.severity === 'blocker').length,
      warningCount: imageResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'links',
      label: copy.preflight.links.label,
      detail: copy.preflight.links.detail,
      tone: itemTone(linkResults),
      blockerCount: linkResults.filter((result) => result.severity === 'blocker').length,
      warningCount: linkResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'data',
      label: copy.preflight.data.label,
      detail: copy.preflight.data.detail,
      tone: itemTone(dataResults),
      blockerCount: dataResults.filter((result) => result.severity === 'blocker').length,
      warningCount: dataResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'seo',
      label: copy.preflight.seo.label,
      detail: copy.preflight.seo.detail,
      tone: itemTone(seoResults),
      blockerCount: seoResults.filter((result) => result.severity === 'blocker').length,
      warningCount: seoResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'translations',
      label: copy.preflight.translations.label,
      detail: copy.preflight.translations.detail,
      tone: itemTone(translationResults),
      blockerCount: translationResults.filter((result) => result.severity === 'blocker').length,
      warningCount: translationResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'forms',
      label: copy.preflight.forms.label,
      detail: copy.preflight.forms.detail,
      tone: itemTone(formResults),
      blockerCount: formResults.filter((result) => result.severity === 'blocker').length,
      warningCount: formResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'dev',
      label: copy.preflight.dev.label,
      detail: copy.preflight.dev.detail,
      tone: itemTone(devResults),
      blockerCount: devResults.filter((result) => result.severity === 'blocker').length,
      warningCount: devResults.filter((result) => result.severity === 'warning').length,
    },
  ];
}

export function CheckListItem({
  result,
  locale,
  onFix,
}: {
  result: CheckResult;
  locale: Locale;
  onFix?: (nodeId: string) => void;
}): JSX.Element {
  const firstNode = result.affectedNodeIds?.[0];
  const copy = getPublishModalCopy(locale);
  const issueActionLabel = result.action?.label ?? copy.issueActionLabel;
  return (
    <li className={styles.severityItem} data-severity={result.severity}>
      <div className={styles.severityContent}>
        <div className={styles.severityHeader}>
          <span className={styles.severityIcon}>{severityIcon(result.severity)}</span>
          <span className={styles.severityMessage}>{result.message}</span>
        </div>
        {result.fixHint ? (
          <div className={styles.fixHint}>
            ↳ {result.fixHint}
          </div>
        ) : null}
      </div>
      {result.action ? (
        <a
          href={result.action.href}
          className={styles.fixButton}
          aria-label={issueActionLabel}
          data-builder-publish-issue-action={result.id}
        >
          {issueActionLabel}
        </a>
      ) : null}
      {firstNode && onFix ? (
        <button
          type="button"
          className={styles.fixButton}
          onClick={() => onFix(firstNode)}
          aria-label={copy.fixButtonLabel}
        >
          {copy.fixButtonLabel}
        </button>
      ) : null}
    </li>
  );
}
