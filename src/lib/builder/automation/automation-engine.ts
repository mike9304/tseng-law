/**
 * Phase 12 — Automation Engine.
 *
 * AUT-01: Trigger/action model
 * AUT-02: Form submitted trigger
 * AUT-03: Email/task/chat actions
 * AUT-04: Recommended patterns (recipes)
 * AUT-05: App-connected boundaries
 */

export type TriggerType = 'form_submitted' | 'page_published' | 'comment_added' | 'member_signup' | 'scheduled';

export type ActionType = 'send_email' | 'create_task' | 'webhook' | 'update_cms' | 'notify_slack';

export interface AutomationTrigger {
  type: TriggerType;
  config: Record<string, unknown>;
}

export interface AutomationAction {
  type: ActionType;
  config: Record<string, unknown>;
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  conditions?: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'not_equals' | 'greater_than' | 'less_than';
    value: string;
  }>;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  runCount: number;
}

export interface AutomationRunLog {
  runId: string;
  ruleId: string;
  triggerData: Record<string, unknown>;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  executedActions: string[];
  timestamp: string;
  durationMs: number;
}

// ─── Recipe presets ───────────────────────────────────────────────

export const AUTOMATION_RECIPES: Array<{
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
}> = [
  {
    id: 'recipe-contact-notify',
    name: '상담 문의 접수 알림',
    description: '상담 폼 제출 시 변호사에게 이메일 알림',
    trigger: { type: 'form_submitted', config: { formId: 'default-contact' } },
    actions: [
      {
        type: 'send_email',
        config: {
          to: 'wei@hoveringlaw.com.tw',
          subject: '[호정 AI상담] 새 상담 문의 접수',
          bodyTemplate: '{{name}} 님이 {{category}} 관련 상담을 요청했습니다.\n\n{{message}}',
        },
      },
    ],
  },
  {
    id: 'recipe-publish-notify',
    name: '페이지 발행 알림',
    description: '페이지 발행 시 팀에게 알림',
    trigger: { type: 'page_published', config: {} },
    actions: [
      {
        type: 'send_email',
        config: {
          to: 'team@hoveringlaw.com.tw',
          subject: '[호정] 페이지 발행됨: {{pageTitle}}',
          bodyTemplate: '{{actor}} 님이 {{pageTitle}} 페이지를 발행했습니다.',
        },
      },
    ],
  },
  {
    id: 'recipe-negative-feedback',
    name: '부정 피드백 즉시 알림',
    description: 'AI 상담사 👎 피드백 시 변호사에게 즉시 알림',
    trigger: { type: 'form_submitted', config: { formId: 'ai-feedback-negative' } },
    actions: [
      {
        type: 'send_email',
        config: {
          to: 'wei@hoveringlaw.com.tw',
          subject: '[호정 AI상담 👎] 변호사 재검토 필요',
          bodyTemplate: '세션: {{sessionId}}\n카테고리: {{classification}}\n코멘트: {{comment}}',
        },
      },
    ],
  },
];

// ─── Execution ────────────────────────────────────────────────────

export async function executeAutomation(
  rule: AutomationRule,
  triggerData: Record<string, unknown>,
): Promise<AutomationRunLog> {
  const startTime = Date.now();
  const executedActions: string[] = [];
  let status: 'success' | 'failed' | 'skipped' = 'success';
  let error: string | undefined;

  // Check conditions
  if (rule.conditions) {
    for (const cond of rule.conditions) {
      const value = String(triggerData[cond.field] || '');
      let match = false;
      switch (cond.operator) {
        case 'equals': match = value === cond.value; break;
        case 'not_equals': match = value !== cond.value; break;
        case 'contains': match = value.includes(cond.value); break;
        case 'greater_than': match = Number(value) > Number(cond.value); break;
        case 'less_than': match = Number(value) < Number(cond.value); break;
      }
      if (!match) {
        return {
          runId: `run-${Date.now()}`,
          ruleId: rule.id,
          triggerData,
          status: 'skipped',
          executedActions: [],
          timestamp: new Date().toISOString(),
          durationMs: Date.now() - startTime,
        };
      }
    }
  }

  // Execute actions
  for (const action of rule.actions) {
    try {
      switch (action.type) {
        case 'send_email':
          // Template interpolation
          let body = String(action.config.bodyTemplate || '');
          let subject = String(action.config.subject || '');
          for (const [key, val] of Object.entries(triggerData)) {
            body = body.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(val));
            subject = subject.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(val));
          }
          // Actual email send would go here (reuse existing SMTP transport)
          console.log(`[automation] send_email: ${subject} → ${action.config.to}`);
          executedActions.push(`send_email:${action.config.to}`);
          break;

        case 'webhook':
          // Actual webhook call would go here
          console.log(`[automation] webhook: ${action.config.url}`);
          executedActions.push(`webhook:${action.config.url}`);
          break;

        default:
          executedActions.push(`${action.type}:noop`);
      }
    } catch (err) {
      status = 'failed';
      error = err instanceof Error ? err.message : 'unknown';
      break;
    }
  }

  return {
    runId: `run-${Date.now()}`,
    ruleId: rule.id,
    triggerData,
    status,
    error,
    executedActions,
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - startTime,
  };
}
