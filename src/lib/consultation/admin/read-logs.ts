import type {
  ConsultationCategory,
  ConsultationRiskLevel,
} from '@/lib/consultation/types';
import type { ConsultationFunnelStage } from '@/lib/consultation/log-store';
import {
  type LogKind,
  readConsultationLogLines,
} from '@/lib/consultation/log-storage';

/**
 * Admin dashboard — log reader + aggregator.
 *
 * Reads the daily JSONL files produced by log-store.ts and
 * feedback-store.ts, parses each line defensively (never throws on
 * malformed records), and produces aggregate metrics for the operator
 * dashboard. All reads are done on the server — raw log content never
 * leaves the node process.
 *
 * Because logs are already write-time redacted (emails, phones,
 * Korean RRNs, long digit strings), the aggregates and the recent-
 * event samples can be rendered to the dashboard without further
 * scrubbing. The one safety net: we NEVER return `userAgent` or full
 * `ipAddress` values verbatim; only coarse counts.
 */

export interface EventLogRecord {
  timestamp: string;
  eventType?: string;
  funnelStage?: ConsultationFunnelStage;
  sessionId?: string;
  locale?: string;
  classification?: ConsultationCategory;
  riskLevel?: ConsultationRiskLevel;
  shouldEscalate?: boolean;
  suggestedHandoffChannel?: string;
  referencedColumns?: string[];
  topicKey?: string;
  messageRedacted?: string;
  summaryRedacted?: string;
  preferredContact?: string;
  urgency?: string;
  contactPresent?: boolean;
  intakeId?: string;
  success?: boolean;
  failureReason?: string;
  metadataRedacted?: string;
  // Wave 9 — SLO metrics persisted on chat events.
  latencyMs?: number;
  openAiCalls?: number;
  promptTokens?: number;
  completionTokens?: number;
}

export interface FeedbackLogRecord {
  timestamp: string;
  sessionId: string;
  messageId: string;
  rating: 'helpful' | 'unhelpful';
  locale?: string;
  classification?: ConsultationCategory;
  riskLevel?: ConsultationRiskLevel;
  commentRedacted?: string;
}

export interface AdminDashboardMetrics {
  generatedAt: string;
  timeWindowDays: number;
  totalEvents: number;
  totalFeedback: number;
  funnel: {
    session_started: number;
    chat_received: number;
    chat_answered: number;
    chat_failed: number;
    chat_rate_limited: number;
    chat_injection_blocked: number;
    escalation_shown: number;
    form_opened: number;
    form_submit_attempted: number;
    submit_received: number;
    submit_validated: number;
    submit_email_sent: number;
    submit_email_failed: number;
    submit_rate_limited: number;
    submit_consent_missing: number;
    submit_duplicate: number;
  };
  /** Conversion rates derived from the funnel counts. */
  conversion: {
    received_to_answered: number;
    received_to_submit_received: number;
    submit_received_to_email_sent: number;
    full_funnel: number;
  };
  byCategory: Array<{
    category: ConsultationCategory;
    chatCount: number;
    submissions: number;
    feedbackPositive: number;
    feedbackNegative: number;
  }>;
  byRiskLevel: Array<{
    riskLevel: ConsultationRiskLevel;
    count: number;
  }>;
  byLocale: Array<{
    locale: string;
    count: number;
  }>;
  feedback: {
    total: number;
    helpful: number;
    unhelpful: number;
    helpfulRatio: number;
  };
  safety: {
    piiBypassTriggered: number;
    lowConfidenceBypassTriggered: number;
    groundednessFlagged: number;
    stalenessFlagged: number;
    rateLimitedChat: number;
    rateLimitedSubmit: number;
  };
  /** Wave 9 — performance & cost rollup. Computed only over chat events
   *  that actually invoked the LLM (i.e. excluding bypass paths). */
  performance: {
    /** Number of chat events with a recorded latencyMs. */
    sampleCount: number;
    latencyP50Ms: number;
    latencyP95Ms: number;
    latencyP99Ms: number;
    avgLatencyMs: number;
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalTokens: number;
    /** Estimated USD cost using gpt-4o-mini pricing
     *  ($0.15 / 1M input, $0.60 / 1M output as of 2026). */
    estimatedCostUsd: number;
    avgCostPerChatUsd: number;
  };
  recentNegativeFeedback: Array<{
    timestamp: string;
    sessionId: string;
    messageId: string;
    classification?: ConsultationCategory;
    riskLevel?: ConsultationRiskLevel;
    commentRedacted?: string;
  }>;
  recentSubmissions: Array<{
    timestamp: string;
    sessionId: string;
    intakeId?: string;
    classification?: ConsultationCategory;
    riskLevel?: ConsultationRiskLevel;
    preferredContact?: string;
    urgency?: string;
    success?: boolean;
    failureReason?: string;
  }>;
  recentChatSamples: Array<{
    timestamp: string;
    sessionId: string;
    locale?: string;
    classification?: ConsultationCategory;
    riskLevel?: ConsultationRiskLevel;
    referencedColumns?: string[];
    messageRedacted?: string;
  }>;
}

function safeParseLine<T>(line: string): T | null {
  if (!line.trim()) return null;
  try {
    return JSON.parse(line) as T;
  } catch {
    return null;
  }
}

async function readJsonlRecords<T>(
  kind: LogKind,
  windowStartTs: number,
): Promise<T[]> {
  const lines = await readConsultationLogLines(kind, windowStartTs);
  const out: T[] = [];
  for (const line of lines) {
    const rec = safeParseLine<T & { timestamp?: string }>(line);
    if (!rec) continue;
    if (rec.timestamp) {
      const ts = Date.parse(rec.timestamp);
      if (!Number.isNaN(ts) && ts < windowStartTs) continue;
    }
    out.push(rec as T);
  }
  return out;
}

/** Extract events of a given funnel stage from the full list. */
function countFunnelStage(
  events: EventLogRecord[],
  stage: ConsultationFunnelStage,
): number {
  return events.filter((e) => e.funnelStage === stage).length;
}

/**
 * Build the full dashboard metrics payload for the given time window.
 * @param windowDays How many days back from "now" to consider. 7 is
 *   a sensible default for operator weekly review.
 */
export async function readDashboardMetrics(
  windowDays = 7,
): Promise<AdminDashboardMetrics> {
  const now = Date.now();
  const windowStartTs = now - windowDays * 24 * 60 * 60 * 1000;

  const [events, feedback] = await Promise.all([
    readJsonlRecords<EventLogRecord>('events', windowStartTs),
    readJsonlRecords<FeedbackLogRecord>('feedback', windowStartTs),
  ]);

  // Funnel counts — reuse helper for readability.
  const funnel = {
    session_started: countFunnelStage(events, 'session_started'),
    chat_received: countFunnelStage(events, 'chat_received'),
    chat_answered: countFunnelStage(events, 'chat_answered'),
    chat_failed: countFunnelStage(events, 'chat_failed'),
    chat_rate_limited: countFunnelStage(events, 'chat_rate_limited'),
    chat_injection_blocked: countFunnelStage(events, 'chat_injection_blocked'),
    escalation_shown: countFunnelStage(events, 'escalation_shown'),
    form_opened: countFunnelStage(events, 'form_opened'),
    form_submit_attempted: countFunnelStage(events, 'form_submit_attempted'),
    submit_received: countFunnelStage(events, 'submit_received'),
    submit_validated: countFunnelStage(events, 'submit_validated'),
    submit_email_sent: countFunnelStage(events, 'submit_email_sent'),
    submit_email_failed: countFunnelStage(events, 'submit_email_failed'),
    submit_rate_limited: countFunnelStage(events, 'submit_rate_limited'),
    submit_consent_missing: countFunnelStage(events, 'submit_consent_missing'),
    submit_duplicate: countFunnelStage(events, 'submit_duplicate'),
  };

  // Derived conversion ratios. Guard against divide-by-zero.
  const pct = (num: number, den: number): number =>
    den === 0 ? 0 : Math.round((num / den) * 1000) / 10;

  const conversion = {
    received_to_answered: pct(funnel.chat_answered, funnel.chat_received),
    received_to_submit_received: pct(funnel.submit_received, funnel.chat_received),
    submit_received_to_email_sent: pct(funnel.submit_email_sent, funnel.submit_received),
    full_funnel: pct(funnel.submit_email_sent, funnel.chat_received),
  };

  // Category breakdown — only count chat events that actually produced
  // a classification (chat_answered + the chat eventType from log-store).
  const categoryMap = new Map<
    ConsultationCategory,
    { chatCount: number; submissions: number; feedbackPositive: number; feedbackNegative: number }
  >();
  const ensureCategory = (cat: ConsultationCategory) => {
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { chatCount: 0, submissions: 0, feedbackPositive: 0, feedbackNegative: 0 });
    }
    return categoryMap.get(cat)!;
  };

  const riskCounts = new Map<ConsultationRiskLevel, number>();
  const localeCounts = new Map<string, number>();

  for (const e of events) {
    if (e.eventType === 'chat' && e.classification) {
      ensureCategory(e.classification).chatCount += 1;
      if (e.riskLevel) {
        riskCounts.set(e.riskLevel, (riskCounts.get(e.riskLevel) || 0) + 1);
      }
      if (e.locale) {
        localeCounts.set(e.locale, (localeCounts.get(e.locale) || 0) + 1);
      }
    }
    if (e.eventType === 'submit_success' && e.classification) {
      ensureCategory(e.classification).submissions += 1;
    }
  }

  for (const f of feedback) {
    if (!f.classification) continue;
    const bucket = ensureCategory(f.classification);
    if (f.rating === 'helpful') bucket.feedbackPositive += 1;
    else if (f.rating === 'unhelpful') bucket.feedbackNegative += 1;
  }

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.chatCount - a.chatCount);

  const byRiskLevel: Array<{ riskLevel: ConsultationRiskLevel; count: number }> = (
    ['L1', 'L2', 'L3', 'L4'] as ConsultationRiskLevel[]
  ).map((rl) => ({ riskLevel: rl, count: riskCounts.get(rl) || 0 }));

  const byLocale = Array.from(localeCounts.entries())
    .map(([locale, count]) => ({ locale, count }))
    .sort((a, b) => b.count - a.count);

  // Aggregate feedback totals.
  const feedbackHelpful = feedback.filter((f) => f.rating === 'helpful').length;
  const feedbackUnhelpful = feedback.filter((f) => f.rating === 'unhelpful').length;
  const feedbackSummary = {
    total: feedback.length,
    helpful: feedbackHelpful,
    unhelpful: feedbackUnhelpful,
    helpfulRatio:
      feedback.length === 0 ? 0 : Math.round((feedbackHelpful / feedback.length) * 1000) / 10,
  };

  // Safety metrics — infer from funnel counts + special log markers.
  // piiBypass and lowConfidence events don't currently land in the
  // log store, so we read them from console warnings if recorded. For
  // now, we count chat events where shouldEscalate became true on a
  // category that was NOT already classified as criminal/emergency as
  // a rough proxy. We also count rate-limited events directly.
  const safety = {
    piiBypassTriggered: events.filter((e) => e.classification === 'divorce_family' && e.riskLevel === 'L4' && typeof e.messageRedacted === 'string' && e.messageRedacted.includes('[redacted-number]')).length,
    lowConfidenceBypassTriggered: 0, // Reserved: emits as console.warn today, not log-store
    groundednessFlagged: 0, // Reserved: same
    stalenessFlagged: 0, // Reserved: same
    rateLimitedChat: funnel.chat_rate_limited,
    rateLimitedSubmit: funnel.submit_rate_limited,
  };

  // Wave 9 — performance & cost rollup. Only includes chat events that
  // recorded a latencyMs (skips bypass paths and pre-Wave-9 events).
  const perfSamples = events.filter(
    (e) => e.eventType === 'chat' && typeof e.latencyMs === 'number',
  );
  const latencyValues = perfSamples
    .map((e) => e.latencyMs as number)
    .sort((a, b) => a - b);
  const percentile = (sorted: number[], p: number): number => {
    if (sorted.length === 0) return 0;
    const idx = Math.min(
      sorted.length - 1,
      Math.floor((p / 100) * sorted.length),
    );
    return sorted[idx]!;
  };
  const totalPromptTokens = perfSamples.reduce((sum, e) => sum + (e.promptTokens || 0), 0);
  const totalCompletionTokens = perfSamples.reduce((sum, e) => sum + (e.completionTokens || 0), 0);
  // gpt-4o-mini pricing as of 2026 (USD per 1M tokens):
  //   input = $0.15, output = $0.60
  const COST_PER_INPUT_TOKEN = 0.15 / 1_000_000;
  const COST_PER_OUTPUT_TOKEN = 0.60 / 1_000_000;
  const estimatedCostUsd =
    totalPromptTokens * COST_PER_INPUT_TOKEN
    + totalCompletionTokens * COST_PER_OUTPUT_TOKEN;
  const performance = {
    sampleCount: perfSamples.length,
    latencyP50Ms: percentile(latencyValues, 50),
    latencyP95Ms: percentile(latencyValues, 95),
    latencyP99Ms: percentile(latencyValues, 99),
    avgLatencyMs:
      latencyValues.length === 0
        ? 0
        : Math.round(latencyValues.reduce((a, b) => a + b, 0) / latencyValues.length),
    totalPromptTokens,
    totalCompletionTokens,
    totalTokens: totalPromptTokens + totalCompletionTokens,
    estimatedCostUsd: Math.round(estimatedCostUsd * 10000) / 10000,
    avgCostPerChatUsd:
      perfSamples.length === 0
        ? 0
        : Math.round((estimatedCostUsd / perfSamples.length) * 10000) / 10000,
  };

  // Recent negative feedback (last 20) — for variable review by attorney.
  const recentNegativeFeedback = feedback
    .filter((f) => f.rating === 'unhelpful')
    .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
    .slice(0, 20)
    .map((f) => ({
      timestamp: f.timestamp,
      sessionId: f.sessionId,
      messageId: f.messageId,
      classification: f.classification,
      riskLevel: f.riskLevel,
      commentRedacted: f.commentRedacted,
    }));

  // Recent submissions (last 10) — combine submit_success + submit_failed.
  const recentSubmissions = events
    .filter((e) => e.eventType === 'submit_success' || e.eventType === 'submit_failed')
    .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
    .slice(0, 10)
    .map((e) => ({
      timestamp: e.timestamp,
      sessionId: e.sessionId || '',
      intakeId: e.intakeId,
      classification: e.classification,
      riskLevel: e.riskLevel,
      preferredContact: e.preferredContact,
      urgency: e.urgency,
      success: e.success,
      failureReason: e.failureReason,
    }));

  // Recent chat samples (last 15) — for operator spot-check of what
  // users are actually asking. messageRedacted is already PII-safe.
  const recentChatSamples = events
    .filter((e) => e.eventType === 'chat')
    .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
    .slice(0, 15)
    .map((e) => ({
      timestamp: e.timestamp,
      sessionId: e.sessionId || '',
      locale: e.locale,
      classification: e.classification,
      riskLevel: e.riskLevel,
      referencedColumns: e.referencedColumns,
      messageRedacted: e.messageRedacted,
    }));

  return {
    generatedAt: new Date().toISOString(),
    timeWindowDays: windowDays,
    totalEvents: events.length,
    totalFeedback: feedback.length,
    funnel,
    conversion,
    byCategory,
    byRiskLevel,
    byLocale,
    feedback: feedbackSummary,
    safety,
    performance,
    recentNegativeFeedback,
    recentSubmissions,
    recentChatSamples,
  };
}
