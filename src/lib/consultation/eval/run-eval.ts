import { readFile } from 'fs/promises';
import path from 'path';
import { generateConsultationChatResponse } from '@/lib/consultation/engine';
import { getAttorneyReviewNotice } from '@/lib/consultation/public-contact';
import type { Locale } from '@/lib/locales';
import type {
  EvalPair,
  EvalPerPairResult,
  EvalReport,
} from '@/lib/consultation/eval/types';

const DEFAULT_MAX_RESPONSE_CHARS = 2500;

function stripAttorneyNotice(message: string, locale: Locale): string {
  const noticeNormal = getAttorneyReviewNotice(locale, { emphasizeImmediate: false });
  const noticeUrgent = getAttorneyReviewNotice(locale, { emphasizeImmediate: true });
  // Trim either variant regardless of which escalation flag fired.
  return message
    .replace(noticeNormal, '')
    .replace(noticeUrgent, '')
    .replace(/\s+$/g, '');
}

function setsIntersect<T>(a: Set<T>, b: Set<T>): boolean {
  for (const item of a) {
    if (b.has(item)) return true;
  }
  return false;
}

function isSubset<T>(required: Set<T>, actual: Set<T>): boolean {
  for (const item of required) {
    if (!actual.has(item)) return false;
  }
  return true;
}

function isPiiWarningMessage(message: string): boolean {
  // All three locales start with the same warning emoji + keyword.
  return message.includes('⚠️') && (
    message.includes('민감정보') ||
    message.includes('敏感個資') ||
    message.includes('Sensitive personal information')
  );
}

/**
 * Detect the canned low-confidence (out-of-scope) message. The engine
 * emits one of three fixed strings whenever it refuses to answer due
 * to a weak query↔column vocabulary overlap.
 */
function isLowConfidenceMessage(message: string): boolean {
  return (
    message.includes('공개 칼럼의 범위를 벗어나') ||
    message.includes('公開文章能涵蓋的範圍') ||
    message.includes('sits outside the scope of our public columns')
  );
}

/**
 * Extract every [Column: slug] citation the LLM emitted in its response.
 * Accepts either plain slugs or slugs with whitespace, and tolerates the
 * bracket content being wrapped with extra spaces. The regex captures the
 * slug body up until the closing bracket so we can validate it against
 * the response.referencedColumns list.
 */
const CITATION_PATTERN = /\[Column:\s*([a-zA-Z0-9][a-zA-Z0-9_-]*)\s*\]/g;

function extractCitations(message: string): string[] {
  const hits: string[] = [];
  let match: RegExpExecArray | null;
  // The regex has the 'g' flag, so we re-create a local copy each call
  // to avoid cross-call lastIndex state leaking between pairs.
  const rx = new RegExp(CITATION_PATTERN.source, 'g');
  while ((match = rx.exec(message)) !== null) {
    const slug = match[1];
    if (slug) hits.push(slug);
  }
  return hits;
}

async function loadGoldStandard(): Promise<EvalPair[]> {
  const filePath = path.join(
    process.cwd(),
    'src',
    'lib',
    'consultation',
    'eval',
    'gold-standard.json',
  );
  const raw = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error('gold-standard.json must be an array of EvalPair');
  }
  return parsed as EvalPair[];
}

async function runPair(pair: EvalPair): Promise<EvalPerPairResult> {
  const response = await generateConsultationChatResponse(pair.locale, {
    locale: pair.locale,
    sessionId: `eval-${pair.id}-${Date.now()}`,
    message: pair.question,
    collectedFields: {},
    priorTurns: pair.priorTurns,
  });

  const strippedMessage = stripAttorneyNotice(response.assistantMessage, pair.locale);
  const responseChars = strippedMessage.length;
  const piiWarningPresent = isPiiWarningMessage(response.assistantMessage);
  const lowConfidenceBypassPresent = isLowConfidenceMessage(response.assistantMessage);
  const emittedCitations = extractCitations(response.assistantMessage);
  const referencedSet = new Set(response.referencedColumns);
  const validCitations = emittedCitations.filter((slug) => referencedSet.has(slug));

  const requiredSlugs = new Set(pair.expected.requiredColumnSlugs ?? []);
  const actualSlugs = new Set(response.referencedColumns);
  const columnsPass = requiredSlugs.size === 0 ? true : isSubset(requiredSlugs, actualSlugs);

  const classificationPass = response.classification === pair.expected.classification;
  const riskLevelPass = response.riskLevel === pair.expected.riskLevel;
  const escalationPass = response.shouldEscalate === pair.expected.shouldEscalate;

  // PII bypass: when the pair expects piiBypass=true, the canned warning
  // must be present. When it expects false/undefined, we don't verify.
  const piiBypassPass = pair.expected.piiBypass
    ? piiWarningPresent
    : true;

  // Low-confidence bypass: expected true → canned message must appear.
  // Expected false/undefined → canned message must NOT appear.
  const lowConfidencePass = pair.expected.lowConfidenceBypass
    ? lowConfidenceBypassPresent
    : !lowConfidenceBypassPresent;

  const maxChars = pair.expected.maxResponseChars ?? DEFAULT_MAX_RESPONSE_CHARS;
  const responseLengthPass = responseChars <= maxChars;

  // Citation quality check:
  // - L4 pairs: no citations expected (L4 mode forbids column quotes).
  // - PII bypass pairs: no citations expected (canned warning).
  // - Low-confidence bypass pairs: no citations expected (canned warning).
  // - Otherwise, when the engine DID attach references to this response,
  //   the LLM must emit ≥1 valid [Column: slug] tag pointing at one of
  //   those references. If no references were attached (e.g. fallback),
  //   the check passes through.
  let citationPass: boolean;
  if (
    pair.expected.piiBypass ||
    pair.expected.lowConfidenceBypass ||
    pair.expected.riskLevel === 'L4'
  ) {
    citationPass = true;
  } else if (lowConfidenceBypassPresent) {
    // Engine chose to refuse; treat as a valid non-citation path.
    citationPass = true;
  } else if (response.referencedColumns.length === 0) {
    citationPass = true;
  } else {
    citationPass = validCitations.length >= 1;
  }

  const allPassed =
    classificationPass &&
    riskLevelPass &&
    escalationPass &&
    columnsPass &&
    piiBypassPass &&
    responseLengthPass &&
    citationPass &&
    lowConfidencePass;

  // Mark setsIntersect as referenced so eslint doesn't complain; it is
  // intentionally kept in the module for future use (fuzzy match mode).
  void setsIntersect;

  return {
    id: pair.id,
    question: pair.question,
    locale: pair.locale,
    rationale: pair.rationale,
    observed: {
      classification: response.classification,
      riskLevel: response.riskLevel,
      shouldEscalate: response.shouldEscalate,
      referencedColumns: response.referencedColumns,
      responseChars,
      piiWarningPresent,
      citationCount: emittedCitations.length,
      validCitationCount: validCitations.length,
      lowConfidenceBypassPresent,
    },
    checks: {
      classificationPass,
      riskLevelPass,
      escalationPass,
      columnsPass,
      piiBypassPass,
      responseLengthPass,
      citationPass,
      lowConfidencePass,
    },
    allPassed,
  };
}

export async function runConsultationEval(): Promise<EvalReport> {
  const runStartedAt = new Date().toISOString();
  const startTs = Date.now();

  const pairs = await loadGoldStandard();
  const results: EvalPerPairResult[] = [];

  // Run sequentially to keep OpenAI rate-limit pressure bounded and to
  // preserve ordering in logs. Eval sets are <= 50 pairs.
  for (const pair of pairs) {
    try {
      results.push(await runPair(pair));
    } catch (error) {
      results.push({
        id: pair.id,
        question: pair.question,
        locale: pair.locale,
        rationale: pair.rationale,
        observed: {
          classification: 'unknown',
          riskLevel: 'L1',
          shouldEscalate: false,
          referencedColumns: [],
          responseChars: 0,
          piiWarningPresent: false,
          citationCount: 0,
          validCitationCount: 0,
          lowConfidenceBypassPresent: false,
        },
        checks: {
          classificationPass: false,
          riskLevelPass: false,
          escalationPass: false,
          columnsPass: false,
          piiBypassPass: false,
          responseLengthPass: false,
          citationPass: false,
          lowConfidencePass: false,
        },
        allPassed: false,
      });
      console.error(`[eval] pair ${pair.id} raised an error:`, error);
    }
  }

  const total = results.length;
  const passed = results.filter((r) => r.allPassed).length;
  const failed = total - passed;
  const passRate = total === 0 ? 0 : passed / total;

  const byCategory: Record<string, { total: number; passed: number; passRate: number }> = {};
  for (let i = 0; i < pairs.length; i++) {
    const cat = pairs[i]!.expected.classification;
    const existing = byCategory[cat] ?? { total: 0, passed: 0, passRate: 0 };
    existing.total += 1;
    if (results[i]!.allPassed) existing.passed += 1;
    existing.passRate = existing.total === 0 ? 0 : existing.passed / existing.total;
    byCategory[cat] = existing;
  }

  const tally = (pick: (r: EvalPerPairResult) => boolean) => ({
    passed: results.filter(pick).length,
    total,
  });

  const byMetric = {
    classification: tally((r) => r.checks.classificationPass),
    riskLevel: tally((r) => r.checks.riskLevelPass),
    escalation: tally((r) => r.checks.escalationPass),
    columns: tally((r) => r.checks.columnsPass),
    piiBypass: tally((r) => r.checks.piiBypassPass),
    responseLength: tally((r) => r.checks.responseLengthPass),
    citation: tally((r) => r.checks.citationPass),
    lowConfidence: tally((r) => r.checks.lowConfidencePass),
  };

  // Aggregate citation stats across pairs that were actually expected to
  // produce citations (i.e. the citation check was "real", not a pass-through).
  const eligibleForCitation = results.filter((r) => {
    const pair = pairs.find((p) => p.id === r.id);
    if (!pair) return false;
    if (pair.expected.piiBypass) return false;
    if (pair.expected.riskLevel === 'L4') return false;
    return r.observed.referencedColumns.length > 0;
  });
  const totalCitationsEmitted = eligibleForCitation.reduce(
    (sum, r) => sum + r.observed.citationCount,
    0,
  );
  const totalValidCitations = eligibleForCitation.reduce(
    (sum, r) => sum + r.observed.validCitationCount,
    0,
  );
  const citationStats = {
    totalCitationsEmitted,
    totalValidCitations,
    averageCitationsPerEligiblePair:
      eligibleForCitation.length === 0
        ? 0
        : totalCitationsEmitted / eligibleForCitation.length,
    eligiblePairs: eligibleForCitation.length,
  };

  const finishTs = Date.now();

  return {
    runStartedAt,
    runFinishedAt: new Date(finishTs).toISOString(),
    durationMs: finishTs - startTs,
    total,
    passed,
    failed,
    passRate,
    byCategory,
    byMetric,
    citationStats,
    failures: results.filter((r) => !r.allPassed),
    results,
  };
}
