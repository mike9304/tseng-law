import type { Locale } from '@/lib/locales';

export type ConsultationCategory =
  | 'company_setup'
  | 'traffic_accident'
  | 'criminal_investigation'
  | 'labor'
  | 'divorce_family'
  | 'inheritance'
  | 'logistics'
  | 'cosmetics'
  | 'general'
  | 'unknown';

export type ConsultationRiskLevel = 'L1' | 'L2' | 'L3' | 'L4';
export type ConsultationSourceFreshness = 'fresh' | 'review_needed' | 'unknown';
export type ConsultationSourceConfidence = 'high' | 'medium' | 'low';
export type ConsultationAttorneyReviewStatus = 'confirmed' | 'pending';
export type ConsultationNextField =
  | 'name'
  | 'email'
  | 'phone_or_messenger'
  | 'category'
  | 'urgency'
  | 'summary'
  | 'preferred_contact'
  | 'consent'
  | 'none';

export interface ConsultationCollectedFields {
  name?: string;
  email?: string;
  phoneOrMessenger?: string;
  category?: ConsultationCategory;
  urgency?: string;
  summary?: string;
  preferredContact?: string;
  companyOrOrganization?: string;
  countryOrResidence?: string;
  preferredTime?: string;
  hasDocuments?: string;
  consent?: boolean;
}

export interface ConsultationTranscriptMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp?: string;
}

export interface ConsultationColumnReference {
  slug: string;
  title: string;
  summary: string;
  lastmod: string;
  staleRisk: 'low' | 'medium' | 'high';
  freshness: ConsultationSourceFreshness;
  attorneyReviewStatus: ConsultationAttorneyReviewStatus;
  attorneyReviewedAt?: string;
  attorneyReviewedBy?: string;
  attorneyReviewNote?: string;
}

export interface ConsultationChatRequestBody {
  locale?: Locale;
  sessionId?: string;
  message?: string;
  collectedFields?: ConsultationCollectedFields;
  /**
   * Optional conversation history from prior turns in this session.
   * The engine will use at most the last 5 turns as structured context
   * for the LLM. Sent only by clients that support multi-turn memory;
   * omitting this field keeps the single-turn behaviour intact.
   */
  priorTurns?: ConsultationTranscriptMessage[];
  /**
   * When true, the server returns a `text/event-stream` SSE response
   * instead of a single JSON payload. The client can progressively
   * render assistant tokens as they arrive. Eval harness and other
   * internal callers keep `stream: false` to get the flat response.
   */
  stream?: boolean;
}

/**
 * Metadata payload delivered as the FIRST chunk of a streaming chat
 * response, before any assistant tokens. Mirrors the non-streaming
 * ConsultationChatResponse minus the assistantMessage + disclaimer.
 */
export interface ConsultationChatStreamMetadata {
  classification: ConsultationCategory;
  riskLevel: ConsultationRiskLevel;
  shouldEscalate: boolean;
  nextRequiredField: ConsultationNextField;
  completionReady: boolean;
  disclaimer: string;
  referencedColumns: string[];
  references: ConsultationColumnReference[];
  sourceFreshness: ConsultationSourceFreshness;
  sourceConfidence: ConsultationSourceConfidence;
  suggestedHandoffChannel: 'line' | 'kakao' | 'email' | 'phone' | 'none';
  /** Server-side diagnostic; see ConsultationChatResponse. */
  promptInjectionDetected?: boolean;
}

/** Discriminated union of server → client chunks. */
export type ConsultationChatStreamChunk =
  | { type: 'metadata'; data: ConsultationChatStreamMetadata }
  | { type: 'delta'; text: string }
  | {
      type: 'warning';
      variant: 'groundedness' | 'staleness';
      text: string;
    }
  | { type: 'attorney_notice'; text: string }
  | { type: 'error'; error: string }
  | { type: 'done' };

export interface ConsultationChatResponse {
  assistantMessage: string;
  classification: ConsultationCategory;
  riskLevel: ConsultationRiskLevel;
  shouldEscalate: boolean;
  nextRequiredField: ConsultationNextField;
  completionReady: boolean;
  disclaimer: string;
  referencedColumns: string[];
  references: ConsultationColumnReference[];
  sourceFreshness: ConsultationSourceFreshness;
  sourceConfidence: ConsultationSourceConfidence;
  suggestedHandoffChannel: 'line' | 'kakao' | 'email' | 'phone' | 'none';
  /** Server-side diagnostic: true when the engine refused this request
   *  via the prompt-injection detector. The chat route consumes this
   *  to emit a `chat_injection_blocked` funnel event for the operator
   *  dashboard. Never rendered in the UI. */
  promptInjectionDetected?: boolean;
  /** Wave 9 SLO metrics — wall time and aggregate token usage across
   *  every OpenAI/Anthropic call this engine pass made (main answer +
   *  citation retry + groundedness verifier). The chat route persists
   *  these on each chat event so the admin dashboard can compute
   *  p50/p95/p99 latency and total token cost over a time window. */
  perfMetrics?: {
    latencyMs: number;
    openAiCalls: number;
    promptTokens: number;
    completionTokens: number;
  };
}

export interface ConsultationSubmitRequestBody {
  locale?: Locale;
  sessionId?: string;
  collectedFields?: ConsultationCollectedFields;
  transcript?: ConsultationTranscriptMessage[];
  classification?: ConsultationCategory;
  riskLevel?: ConsultationRiskLevel;
  referencedColumns?: string[];
}

export interface ConsultationSubmitSuccessResponse {
  success: true;
  intakeId: string;
  message: string;
}

export interface ConsultationSubmitFailureResponse {
  success: false;
  error: string;
}

export type ConsultationSubmitResponse =
  | ConsultationSubmitSuccessResponse
  | ConsultationSubmitFailureResponse;
