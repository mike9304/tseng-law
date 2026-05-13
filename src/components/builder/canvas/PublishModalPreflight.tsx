import type {
  CheckResult,
  PublishCheckSuite,
} from '@/lib/builder/publish-gate/gate-runner';
import {
  fixButtonStyle,
  severityBoxStyle,
  type PreflightTone,
} from './PublishModal.styles';

export interface PreflightItem {
  key: string;
  label: string;
  detail: string;
  tone: PreflightTone;
  blockerCount: number;
  warningCount: number;
}

export function blockerSuite(blockers: CheckResult[]): PublishCheckSuite {
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

export function formatScheduledAt(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
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

export function itemStatus(item: PreflightItem): string {
  if (item.tone === 'blocker') return `${item.blockerCount} blocker`;
  if (item.tone === 'warning') return `${item.warningCount} warning`;
  return 'Passed';
}

export function buildPreflightItems(suite: PublishCheckSuite | null): PreflightItem[] {
  const results = suite?.results ?? [];
  const imageResults = results.filter((result) =>
    result.category === 'images'
    || (result.category === 'accessibility' && result.id.startsWith('image-')),
  );
  const linkResults = results.filter((result) => result.category === 'links');
  const seoResults = results.filter((result) => result.category === 'seo');
  const formResults = results.filter((result) => result.category === 'forms');

  return [
    {
      key: 'images',
      label: 'Images',
      detail: '빈 alt 이미지 / 비어 있는 이미지 소스',
      tone: itemTone(imageResults),
      blockerCount: imageResults.filter((result) => result.severity === 'blocker').length,
      warningCount: imageResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'links',
      label: 'Links',
      detail: '빈 링크 / 잘못된 URL / 없는 내부 경로',
      tone: itemTone(linkResults),
      blockerCount: linkResults.filter((result) => result.severity === 'blocker').length,
      warningCount: linkResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'seo',
      label: 'SEO',
      detail: 'title / description 누락 및 권장 길이',
      tone: itemTone(seoResults),
      blockerCount: seoResults.filter((result) => result.severity === 'blocker').length,
      warningCount: seoResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'forms',
      label: 'Forms',
      detail: 'form action / email / webhook 대상',
      tone: itemTone(formResults),
      blockerCount: formResults.filter((result) => result.severity === 'blocker').length,
      warningCount: formResults.filter((result) => result.severity === 'warning').length,
    },
  ];
}

export function CheckListItem({
  result,
  onFix,
}: {
  result: CheckResult;
  onFix?: (nodeId: string) => void;
}): JSX.Element {
  const firstNode = result.affectedNodeIds?.[0];
  return (
    <li style={severityBoxStyle(result.severity)}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700 }}>{severityIcon(result.severity)}</span>
          <span style={{ fontWeight: 600 }}>{result.message}</span>
        </div>
        {result.fixHint ? (
          <div style={{ marginTop: 4, opacity: 0.8, fontSize: '0.74rem' }}>
            ↳ {result.fixHint}
          </div>
        ) : null}
      </div>
      {firstNode && onFix ? (
        <button
          type="button"
          style={fixButtonStyle}
          onClick={() => onFix(firstNode)}
          aria-label="Fix this issue"
        >
          Fix
        </button>
      ) : null}
    </li>
  );
}
