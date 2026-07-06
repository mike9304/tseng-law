export type CheckSeverity = 'blocker' | 'warning' | 'info';

export type CheckCategory =
  | 'links'
  | 'images'
  | 'seo'
  | 'forms'
  | 'data'
  | 'dev'
  | 'translations'
  | 'responsive'
  | 'accessibility'
  | 'performance';

export interface CheckResultAction {
  readonly href: string;
  readonly label?: string;
}

export interface CheckResult {
  readonly id: string;
  readonly severity: CheckSeverity;
  readonly category: CheckCategory;
  readonly message: string;
  readonly affectedNodeIds?: readonly string[];
  readonly fixHint?: string;
  readonly action?: CheckResultAction;
}

export interface PublishCheckSuite {
  readonly results: readonly CheckResult[];
  readonly hasBlocker: boolean;
  readonly warningCount: number;
  readonly blockerCount: number;
  readonly infoCount: number;
  readonly checkedAt: string;
}
