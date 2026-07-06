import { z } from 'zod';

export const OPS_ALERT_SEVERITIES = ['info', 'warn', 'error'] as const;
export const OPS_ALERT_CATEGORIES = ['logs', 'security', 'perf', 'cache', 'storage'] as const;
export const OPS_ALERT_STATES = ['open', 'ok'] as const;
export const OPS_ALERT_RULE_IDS = [
  'security-denied-requests',
  'logs-error-volume',
  'perf-heap-ratio',
  'perf-rss-growth',
  'backup-missing',
  'cache-empty',
] as const;

export const opsAlertSeveritySchema = z.enum(OPS_ALERT_SEVERITIES);
export const opsAlertCategorySchema = z.enum(OPS_ALERT_CATEGORIES);
export const opsAlertStateSchema = z.enum(OPS_ALERT_STATES);
export const opsAlertRuleIdSchema = z.enum(OPS_ALERT_RULE_IDS);

export type OpsAlertSeverity = z.infer<typeof opsAlertSeveritySchema>;
export type OpsAlertCategory = z.infer<typeof opsAlertCategorySchema>;
export type OpsAlertState = z.infer<typeof opsAlertStateSchema>;
export type OpsAlertRuleId = z.infer<typeof opsAlertRuleIdSchema>;

export const opsAlertEvaluationSchema = z.object({
  id: opsAlertRuleIdSchema,
  severity: opsAlertSeveritySchema,
  category: opsAlertCategorySchema,
  state: opsAlertStateSchema,
  title: z.string(),
  detail: z.string(),
  metricValue: z.number(),
  threshold: z.number(),
  generatedAt: z.string(),
  action: z.string(),
});

export const opsAlertReportSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string(),
  openAlerts: z.array(opsAlertEvaluationSchema),
  okAlerts: z.array(opsAlertEvaluationSchema),
  historyWindow: z.object({
    points: z.number(),
    firstAt: z.string().optional(),
    lastAt: z.string().optional(),
  }),
});

export type OpsAlertEvaluation = z.infer<typeof opsAlertEvaluationSchema>;
export type OpsAlertReport = z.infer<typeof opsAlertReportSchema>;
