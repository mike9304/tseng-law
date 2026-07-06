import { mkdir, readFile, writeFile } from 'fs/promises';

import type { OpsDashboardSnapshot, OpsDashboardTrendPoint } from './dashboard';
import { opsAlertReportFile, opsRoot } from './paths';
import {
  opsAlertReportSchema,
  type OpsAlertCategory,
  type OpsAlertEvaluation,
  type OpsAlertReport,
  type OpsAlertRuleId,
  type OpsAlertSeverity,
} from './alert-report-model';

type AlertRule = {
  readonly id: OpsAlertRuleId;
  readonly severity: OpsAlertSeverity;
  readonly category: OpsAlertCategory;
  readonly title: string;
  readonly threshold: number;
  readonly opensWhen: 'at-least' | 'below';
  readonly action: string;
  readonly metric: (snapshot: OpsDashboardSnapshot, history: readonly OpsDashboardTrendPoint[]) => number;
  readonly detail: (metricValue: number) => string;
};

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function heapRatio(snapshot: OpsDashboardSnapshot): number {
  if (snapshot.perf.memory.heapTotalBytes <= 0) return 0;
  return snapshot.perf.memory.heapUsedBytes / snapshot.perf.memory.heapTotalBytes;
}

function rssGrowth(history: readonly OpsDashboardTrendPoint[]): number {
  if (history.length < 2) return 1;
  const sorted = [...history].sort((a, b) => a.generatedAt.localeCompare(b.generatedAt));
  const first = sorted.find((entry) => entry.rssBytes > 0);
  const latest = sorted.at(-1);
  if (!first || !latest || first.rssBytes <= 0) return 1;
  return latest.rssBytes / first.rssBytes;
}

const ALERT_RULES = [
  {
    id: 'security-denied-requests',
    severity: 'error',
    category: 'security',
    title: '보안 거부 이벤트',
    threshold: 1,
    opensWhen: 'at-least',
    action: 'Security 탭에서 actor와 publish failure 원인을 확인하세요.',
    metric: (snapshot) => snapshot.health.security.deniedRequests,
    detail: (metricValue) => `${metricValue}개의 publish 거부/실패 이벤트가 최근 24시간 안에 기록됨`,
  },
  {
    id: 'logs-error-volume',
    severity: 'warn',
    category: 'logs',
    title: '로그 오류 감지',
    threshold: 1,
    opensWhen: 'at-least',
    action: 'Logs 탭에서 error scope를 열고 최근 오류 요약을 확인하세요.',
    metric: (snapshot) => snapshot.health.logs.errorCount,
    detail: (metricValue) => `${metricValue}개의 error 로그가 최근 24시간 안에 기록됨`,
  },
  {
    id: 'perf-heap-ratio',
    severity: 'warn',
    category: 'perf',
    title: 'Heap 사용률 높음',
    threshold: 0.85,
    opensWhen: 'at-least',
    action: 'Perf 탭에서 heap/rss 추이를 확인하고 최근 배포 또는 장기 작업을 점검하세요.',
    metric: (snapshot) => heapRatio(snapshot),
    detail: (metricValue) => `Heap 사용률이 ${percent(metricValue)}로 85% 기준을 넘음`,
  },
  {
    id: 'perf-rss-growth',
    severity: 'warn',
    category: 'perf',
    title: 'RSS 증가율 높음',
    threshold: 2,
    opensWhen: 'at-least',
    action: '최근 history window에서 RSS가 계속 증가하는지 확인하세요.',
    metric: (_snapshot, history) => rssGrowth(history),
    detail: (metricValue) => `History window RSS가 시작점 대비 ${metricValue.toFixed(2)}배`,
  },
  {
    id: 'backup-missing',
    severity: 'warn',
    category: 'storage',
    title: '복구 백업 없음',
    threshold: 1,
    opensWhen: 'below',
    action: 'Backups 탭에서 운영 JSON 백업을 생성하고 복원 드릴을 실행하세요.',
    metric: (snapshot) => snapshot.health.storage.backupCount,
    detail: () => '운영 복구에 사용할 backup index가 비어 있음',
  },
  {
    id: 'cache-empty',
    severity: 'info',
    category: 'cache',
    title: '캐시 비어 있음',
    threshold: 1,
    opensWhen: 'below',
    action: 'Cache 탭에서 runtime cache inventory를 확인하세요.',
    metric: (snapshot) => snapshot.health.cache.runtimeCacheKeys,
    detail: () => 'runtime cache key가 없어 초기화 직후이거나 캐시 예열이 필요할 수 있음',
  },
] satisfies readonly AlertRule[];

function evaluateRule(
  rule: AlertRule,
  snapshot: OpsDashboardSnapshot,
  history: readonly OpsDashboardTrendPoint[],
): OpsAlertEvaluation {
  const metricValue = rule.metric(snapshot, history);
  const opens = rule.opensWhen === 'at-least'
    ? metricValue >= rule.threshold
    : metricValue < rule.threshold;
  const state = opens ? 'open' : 'ok';
  return {
    id: rule.id,
    severity: rule.severity,
    category: rule.category,
    state,
    title: rule.title,
    detail: rule.detail(metricValue),
    metricValue,
    threshold: rule.threshold,
    generatedAt: snapshot.generatedAt,
    action: rule.action,
  };
}

function historyWindow(history: readonly OpsDashboardTrendPoint[]): OpsAlertReport['historyWindow'] {
  const sorted = [...history].sort((a, b) => a.generatedAt.localeCompare(b.generatedAt));
  const first = sorted[0];
  const last = sorted.at(-1);
  return {
    points: sorted.length,
    ...(first ? { firstAt: first.generatedAt } : {}),
    ...(last ? { lastAt: last.generatedAt } : {}),
  };
}

export function buildOpsAlertReport(
  snapshot: OpsDashboardSnapshot,
  history: readonly OpsDashboardTrendPoint[],
): OpsAlertReport {
  const evaluations = ALERT_RULES.map((rule) => evaluateRule(rule, snapshot, history));
  return {
    version: 1,
    generatedAt: snapshot.generatedAt,
    openAlerts: evaluations.filter((alert) => alert.state === 'open'),
    okAlerts: evaluations.filter((alert) => alert.state === 'ok'),
    historyWindow: historyWindow(history),
  };
}

export function legacyAlertsFromReport(report: OpsAlertReport): {
  readonly severity: OpsAlertSeverity;
  readonly title: string;
  readonly detail: string;
}[] {
  return report.openAlerts.map((alert) => ({
    severity: alert.severity,
    title: alert.title,
    detail: alert.detail,
  }));
}

export async function persistOpsAlertReport(report: OpsAlertReport): Promise<void> {
  await mkdir(opsRoot(), { recursive: true });
  await writeFile(opsAlertReportFile(), JSON.stringify(report, null, 2), 'utf8');
}

export async function readLatestOpsAlertReport(): Promise<OpsAlertReport | null> {
  try {
    const text = await readFile(opsAlertReportFile(), 'utf8');
    const parsed: unknown = JSON.parse(text);
    const report = opsAlertReportSchema.safeParse(parsed);
    return report.success ? report.data : null;
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}
