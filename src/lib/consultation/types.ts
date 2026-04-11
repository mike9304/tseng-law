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
}

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
