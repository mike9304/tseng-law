import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { CheckpointResult } from './types';

const STATUS_BADGE: Record<CheckpointResult['status'], string> = {
  pass: '🟢 PASS',
  fail: '🔴 FAIL',
  unclear: '🟡 UNCLEAR',
  skipped: '⚪ SKIPPED',
};

const SEVERITY_BADGE = {
  blocker: '🔴 blocker',
  visual: '🟡 visual',
  minor: '⚪ minor',
} as const;

export interface ReportInputs {
  reportDir: string;
  baseUrl: string;
  startedAt: Date;
  finishedAt: Date;
  results: CheckpointResult[];
}

export async function writeReport(input: ReportInputs): Promise<string> {
  const { reportDir, baseUrl, startedAt, finishedAt, results } = input;
  await fs.mkdir(reportDir, { recursive: true });
  const lines: string[] = [];

  const totals = {
    pass: results.filter((r) => r.status === 'pass').length,
    fail: results.filter((r) => r.status === 'fail').length,
    unclear: results.filter((r) => r.status === 'unclear').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
  };
  const durationSec = ((finishedAt.getTime() - startedAt.getTime()) / 1000).toFixed(1);

  lines.push('# QA Agent Report');
  lines.push('');
  lines.push(`- Base URL: \`${baseUrl}\``);
  lines.push(`- Started: ${startedAt.toISOString()}`);
  lines.push(`- Finished: ${finishedAt.toISOString()}`);
  lines.push(`- Duration: ${durationSec}s`);
  lines.push(`- Totals: 🟢 ${totals.pass} / 🔴 ${totals.fail} / 🟡 ${totals.unclear} / ⚪ ${totals.skipped} (of ${results.length})`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push('| ID | Title | Status | Findings | Duration |');
  lines.push('|---|---|---|---|---|');
  for (const r of results) {
    const ms = r.durationMs.toFixed(0);
    lines.push(`| ${r.id} | ${escapePipe(r.title)} | ${STATUS_BADGE[r.status]} | ${r.findings.length} | ${ms}ms |`);
  }
  lines.push('');

  lines.push('## Failed / Unclear Detail');
  lines.push('');
  const focus = results.filter((r) => r.status === 'fail' || r.status === 'unclear');
  if (focus.length === 0) {
    lines.push('_(모두 통과)_');
    lines.push('');
  } else {
    for (const r of focus) {
      lines.push(`### ${r.id} — ${r.title} (${STATUS_BADGE[r.status]})`);
      lines.push('');
      lines.push('**재현 절차:**');
      lines.push('');
      for (const step of r.steps) {
        lines.push(`1. ${step}`);
      }
      lines.push('');
      if (r.findings.length > 0) {
        lines.push('**발견된 이슈:**');
        lines.push('');
        for (const f of r.findings) {
          lines.push(`- ${SEVERITY_BADGE[f.severity]} — ${f.summary}`);
          if (f.detail) {
            lines.push(`  - ${f.detail.replace(/\n/g, '\n    ')}`);
          }
        }
        lines.push('');
      }
      if (r.error) {
        lines.push('**예외:**');
        lines.push('');
        lines.push('```');
        lines.push(r.error.message);
        if (r.error.stack) {
          lines.push(r.error.stack.split('\n').slice(0, 6).join('\n'));
        }
        lines.push('```');
        lines.push('');
      }
      if (r.evidence.length > 0) {
        lines.push('**증거 스크린샷:**');
        lines.push('');
        for (const e of r.evidence) {
          const rel = path.relative(reportDir, e.screenshotPath);
          lines.push(`- \`${e.label}\` → ![${e.label}](${rel})`);
        }
        lines.push('');
      }
      if (r.consoleErrors.length > 0) {
        lines.push('**콘솔 에러:**');
        lines.push('');
        lines.push('```');
        lines.push(r.consoleErrors.slice(0, 10).join('\n'));
        lines.push('```');
        lines.push('');
      }
      if (r.networkFailures.length > 0) {
        lines.push('**네트워크 실패 (4xx/5xx):**');
        lines.push('');
        lines.push('```');
        lines.push(r.networkFailures.slice(0, 10).join('\n'));
        lines.push('```');
        lines.push('');
      }
    }
  }

  lines.push('## Claude 작업 지시');
  lines.push('');
  if (focus.length === 0) {
    lines.push('_(수정할 항목 없음)_');
  } else {
    lines.push('아래 항목을 우선순위 순으로 처리하세요. 각 항목의 재현 절차 + 발견 이슈 + 증거 스크린샷 + 콘솔/네트워크 로그를 함께 참고하세요.');
    lines.push('');
    const blockers = focus.filter((r) => r.findings.some((f) => f.severity === 'blocker') || r.status === 'fail');
    const visuals = focus.filter((r) => !blockers.includes(r));
    if (blockers.length > 0) {
      lines.push('### Priority 1 — Blocker / 기능 실패');
      for (const r of blockers) {
        lines.push(`- ${r.id} ${r.title}`);
      }
      lines.push('');
    }
    if (visuals.length > 0) {
      lines.push('### Priority 2 — 시각/UX');
      for (const r of visuals) {
        lines.push(`- ${r.id} ${r.title}`);
      }
      lines.push('');
    }
  }

  const reportPath = path.join(reportDir, 'report.md');
  await fs.writeFile(reportPath, lines.join('\n'), 'utf8');

  const jsonPath = path.join(reportDir, 'report.json');
  await fs.writeFile(jsonPath, JSON.stringify({
    baseUrl,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    totals,
    results,
  }, null, 2), 'utf8');

  return reportPath;
}

function escapePipe(value: string): string {
  return value.replace(/\|/g, '\\|');
}
