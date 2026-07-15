import type {
  ReadinessReason,
  ReadinessState,
  ReadinessVerification,
  VerifiedReadinessRow,
} from './readiness-manifest';
import { REQUIRED_P0_READINESS_REQUIREMENTS } from './readiness-manifest';

export interface ReadinessCounts {
  VERIFIED: number;
  'LOCAL-VERIFIED': number;
  STUB: number;
  WAIVED: number;
  OPEN: number;
}

export interface ReadinessGate {
  passed: boolean;
  totalP0: number;
  passedP0: number;
  failedP0: number;
  failures: Array<{ id: string; title: string; effectiveState: ReadinessState; reasons: ReadinessReason[] }>;
}

export interface ReadinessReportRow {
  id: string;
  title: string;
  priority: string;
  claimedState: ReadinessState;
  effectiveState: ReadinessState;
  downgraded: boolean;
  reasons: ReadinessReason[];
  provider?: string;
  requiresRealProvider?: boolean;
  waiver?: { reason?: string; expiresAt?: string };
}

export interface ReadinessReport {
  version: 1;
  generatedAt: string;
  claimedCounts: ReadinessCounts;
  effectiveCounts: ReadinessCounts;
  downgrades: ReadinessReportRow[];
  rows: ReadinessReportRow[];
  missingRequiredRows: string[];
  operationalGate: ReadinessGate;
}

const STATES: ReadinessState[] = ['VERIFIED', 'LOCAL-VERIFIED', 'STUB', 'WAIVED', 'OPEN'];

function emptyCounts(): ReadinessCounts {
  return { VERIFIED: 0, 'LOCAL-VERIFIED': 0, STUB: 0, WAIVED: 0, OPEN: 0 };
}

function reportRow(row: VerifiedReadinessRow): ReadinessReportRow {
  return {
    id: row.id,
    title: row.title,
    priority: row.priority,
    claimedState: row.claimedState,
    effectiveState: row.effectiveState,
    downgraded: row.downgraded,
    reasons: row.reasons,
    ...(row.provider === undefined ? {} : { provider: row.provider }),
    ...(row.requiresRealProvider === undefined ? {} : { requiresRealProvider: row.requiresRealProvider }),
    ...(row.waiver === undefined ? {} : { waiver: row.waiver }),
  };
}

export function createReadinessReport(verification: ReadinessVerification): ReadinessReport {
  const claimedCounts = emptyCounts();
  const effectiveCounts = emptyCounts();
  const rows = verification.rows.map(reportRow);
  const presentIds = new Set(rows.map((row) => row.id));
  const missingRequiredRows = REQUIRED_P0_READINESS_REQUIREMENTS
    .filter((requirement) => !presentIds.has(requirement.id))
    .map((requirement) => requirement.id);
  for (const id of missingRequiredRows) {
    rows.push({
      id,
      title: 'Required readiness row missing from manifest',
      priority: 'P0',
      claimedState: 'OPEN',
      effectiveState: 'OPEN',
      downgraded: false,
      reasons: [{ code: 'REQUIRED_ROW_MISSING', message: 'required P0 readiness row is missing from the manifest' }],
    });
  }
  for (const row of verification.rows) {
    claimedCounts[row.claimedState] += 1;
  }
  for (const row of rows) {
    effectiveCounts[row.effectiveState] += 1;
  }
  const requiredIds = new Set<string>(REQUIRED_P0_READINESS_REQUIREMENTS.map((requirement) => requirement.id));
  const p0Rows = rows.filter((row) => row.priority === 'P0' || requiredIds.has(row.id));
  const failures = p0Rows.filter((row) => row.effectiveState !== 'VERIFIED' && row.effectiveState !== 'WAIVED');
  const operationalGate: ReadinessGate = {
    passed: failures.length === 0,
    totalP0: p0Rows.length,
    passedP0: p0Rows.length - failures.length,
    failedP0: failures.length,
    failures,
  };
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    claimedCounts,
    effectiveCounts,
    downgrades: rows.filter((row) => row.downgraded),
    rows,
    missingRequiredRows,
    operationalGate,
  };
}

/** A separate renderer keeps verification/report data usable by JSON consumers. */
export function renderReadinessReport(report: ReadinessReport): string {
  const lines = [
    '# Readiness manifest report',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '## Counts',
    '',
    '| State | Claimed | Effective |',
    '| --- | ---: | ---: |',
    ...STATES.map((state) => `| ${state} | ${report.claimedCounts[state]} | ${report.effectiveCounts[state]} |`),
    '',
    '## Operational gate',
    '',
    `- P0 gate: **${report.operationalGate.passed ? 'PASS' : 'FAIL'}** (${report.operationalGate.passedP0}/${report.operationalGate.totalP0} passing)`,
    '',
    '## Rows',
    '',
    '| ID | Priority | Claimed | Effective | Provider | Waiver | Downgraded | Reasons |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...report.rows.map((row) => {
      const reasons = row.reasons.length === 0 ? '—' : row.reasons.map((item) => `${item.code}: ${item.message}`).join('<br>');
      const provider = row.provider ?? '—';
      const waiver = row.waiver?.reason && row.waiver.expiresAt
        ? `${row.waiver.reason} (expires ${row.waiver.expiresAt})`
        : '—';
      return `| ${row.id} | ${row.priority} | ${row.claimedState} | ${row.effectiveState} | ${provider} | ${waiver} | ${row.downgraded ? 'yes' : 'no'} | ${reasons} |`;
    }),
  ];
  return `${lines.join('\n')}\n`;
}

export const buildReadinessReport = createReadinessReport;
