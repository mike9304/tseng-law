import type { Page } from '@playwright/test';

export type CheckpointSeverity = 'blocker' | 'visual' | 'minor';

export type CheckpointStatus = 'pass' | 'fail' | 'unclear' | 'skipped';

export interface CheckpointFinding {
  severity: CheckpointSeverity;
  summary: string;
  detail?: string;
}

export interface CheckpointEvidence {
  label: string;
  screenshotPath: string;
}

export interface CheckpointResult {
  id: string;
  title: string;
  status: CheckpointStatus;
  steps: string[];
  findings: CheckpointFinding[];
  evidence: CheckpointEvidence[];
  consoleErrors: string[];
  networkFailures: string[];
  durationMs: number;
  error?: { message: string; stack?: string };
}

export interface CheckpointContext {
  page: Page;
  screenshotDir: string;
  baseUrl: string;
  recordEvidence: (label: string, page?: Page) => Promise<CheckpointEvidence>;
  log: (step: string) => void;
}

export interface CheckpointDefinition {
  id: string;
  title: string;
  verification: string;
  run: (ctx: CheckpointContext) => Promise<{
    findings: CheckpointFinding[];
  }>;
}
