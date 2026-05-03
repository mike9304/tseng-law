import type { Locale } from '@/lib/locales';
import type {
  ConsultationCategory,
  ConsultationRiskLevel,
  ConsultationTranscriptMessage,
} from '@/lib/consultation/types';

/**
 * A single ground-truth evaluation pair. Authored by a human and treated
 * as the reference outcome the engine should match.
 */
export interface EvalPair {
  id: string;
  locale: Locale;
  question: string;
  /** A short description of what this pair is testing (e.g. "L4 police arrest"). */
  rationale: string;
  /**
   * Optional prior conversation turns for multi-turn scenarios. When
   * set, run-eval passes them to generateConsultationChatResponse so
   * the engine/LLM can resolve context-dependent references like
   * "that second step you mentioned".
   */
  priorTurns?: ConsultationTranscriptMessage[];
  expected: {
    classification: ConsultationCategory;
    riskLevel: ConsultationRiskLevel;
    shouldEscalate: boolean;
    /**
     * Column slugs that MUST appear in response.referencedColumns.
     * Any additional slugs returned by the engine are allowed — the
     * harness measures RECALL of expected slugs, not exact set match.
     */
    requiredColumnSlugs?: string[];
    /**
     * If true, the engine must bypass the LLM and return the canned PII
     * warning. run-eval verifies this via a substring check.
     */
    piiBypass?: boolean;
    /**
     * If true, the query is expected to trigger the low-confidence
     * bypass (relevance score below threshold) and return the canned
     * out-of-scope response. The citation check is skipped for these
     * pairs because the LLM is never invoked.
     */
    lowConfidenceBypass?: boolean;
    /**
     * Maximum character length for the assistant message body (before
     * the appended attorney notice). L4 responses should be short.
     */
    maxResponseChars?: number;
  };
}

export interface EvalPerPairResult {
  id: string;
  question: string;
  locale: Locale;
  rationale: string;
  observed: {
    classification: ConsultationCategory;
    riskLevel: ConsultationRiskLevel;
    shouldEscalate: boolean;
    referencedColumns: string[];
    responseChars: number;
    piiWarningPresent: boolean;
    /** Number of [Column: slug] citations the LLM emitted in its response. */
    citationCount: number;
    /** Of the citations found, how many point at a slug present in referencedColumns. */
    validCitationCount: number;
    /** True when the assistant message matches the canned low-confidence bypass template. */
    lowConfidenceBypassPresent: boolean;
  };
  checks: {
    classificationPass: boolean;
    riskLevelPass: boolean;
    escalationPass: boolean;
    columnsPass: boolean;
    piiBypassPass: boolean;
    responseLengthPass: boolean;
    /**
     * Citation-quality check:
     * - L1/L2/L3 non-PII non-adversarial pairs with references: REQUIRE ≥1 valid citation.
     * - L4 pairs: no citations expected (L4 mode forbids column quotes).
     * - PII bypass pairs: no citations expected.
     * - Low-confidence bypass pairs: no citations expected.
     * - Fallback-only pairs (no references available): pass through.
     */
    citationPass: boolean;
    /**
     * Low-confidence bypass check: pairs with expected.lowConfidenceBypass
     * must present the canned out-of-scope message. Other pairs must NOT.
     */
    lowConfidencePass: boolean;
  };
  allPassed: boolean;
}

export interface EvalReport {
  runStartedAt: string;
  runFinishedAt: string;
  durationMs: number;
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  byCategory: Record<string, { total: number; passed: number; passRate: number }>;
  byScenario: Record<string, { total: number; passed: number; passRate: number }>;
  byMetric: {
    classification: { passed: number; total: number };
    riskLevel: { passed: number; total: number };
    escalation: { passed: number; total: number };
    columns: { passed: number; total: number };
    piiBypass: { passed: number; total: number };
    responseLength: { passed: number; total: number };
    citation: { passed: number; total: number };
    lowConfidence: { passed: number; total: number };
  };
  /** Aggregate citation statistics across non-L4 pairs. */
  citationStats: {
    totalCitationsEmitted: number;
    totalValidCitations: number;
    averageCitationsPerEligiblePair: number;
    eligiblePairs: number;
  };
  failures: EvalPerPairResult[];
  results: EvalPerPairResult[];
}
