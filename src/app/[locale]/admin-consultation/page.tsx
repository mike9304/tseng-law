import type { Metadata } from 'next';
import {
  readDashboardMetrics,
  type AdminDashboardMetrics,
} from '@/lib/consultation/admin/read-logs';
import { getConsultationCopy, type ConsultationCopy } from './copy';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko' ? '상담 관리' : locale === 'zh-hant' ? '諮詢管理' : 'Consultation admin';
  return {
    title,
    robots: { index: false, follow: false },
  };
}


const KNOWLEDGE_ACTION_PATH = '/api/consultation/knowledge';

const CATEGORY_OPTIONS = [
  'general',
  'company_setup',
  'traffic_accident',
  'criminal_investigation',
  'labor',
  'divorce_family',
  'inheritance',
  'logistics',
  'cosmetics',
  'unknown',
] as const;


function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d
      .toLocaleString('ko-KR', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(/\s+/g, ' ');
  } catch {
    return iso;
  }
}

function Percent({ value }: { value: number }): React.ReactElement {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <span className="admin-console-pct-cell">
      <span className="admin-console-pct-value">{clamped.toFixed(1)}%</span>
      <span className="admin-console-pct-bar" aria-hidden>
        <span style={{ width: `${clamped}%` }} />
      </span>
    </span>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <section className="admin-console-section">
      <header>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

function FunnelTable({
  metrics,
  copy,
}: {
  metrics: AdminDashboardMetrics;
  copy: ConsultationCopy;
}): React.ReactElement {
  const rows: Array<{ label: string; count: number }> = [
    { label: copy.funnelStages[0] || 'Session started', count: metrics.funnel.session_started },
    { label: copy.funnelStages[1] || 'Chat received', count: metrics.funnel.chat_received },
    { label: copy.funnelStages[2] || 'Chat answered', count: metrics.funnel.chat_answered },
    { label: copy.funnelStages[3] || 'Escalation shown', count: metrics.funnel.escalation_shown },
    { label: copy.funnelStages[4] || 'Form opened', count: metrics.funnel.form_opened },
    { label: copy.funnelStages[5] || 'Form submit attempted', count: metrics.funnel.form_submit_attempted },
    { label: copy.funnelStages[6] || 'Submit received', count: metrics.funnel.submit_received },
    { label: copy.funnelStages[7] || 'Submit validated', count: metrics.funnel.submit_validated },
    { label: copy.funnelStages[8] || 'Submit email sent', count: metrics.funnel.submit_email_sent },
  ];
  return (
    <table className="admin-console-table">
      <thead>
        <tr>
          <th>{copy.funnelHeaders.stage}</th>
          <th>{copy.funnelHeaders.count}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <td>{r.label}</td>
            <td className="admin-console-num">{r.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ConversionTable({
  metrics,
  copy,
}: {
  metrics: AdminDashboardMetrics;
  copy: ConsultationCopy;
}): React.ReactElement {
  const rows = [
    { label: copy.conversionSteps[0] || 'Chat received → answered', value: metrics.conversion.received_to_answered },
    { label: copy.conversionSteps[1] || 'Chat received → submit received', value: metrics.conversion.received_to_submit_received },
    { label: copy.conversionSteps[2] || 'Submit received → email sent', value: metrics.conversion.submit_received_to_email_sent },
    { label: copy.conversionSteps[3] || 'Full funnel (chat → email sent)', value: metrics.conversion.full_funnel },
  ];
  return (
    <table className="admin-console-table admin-console-table--wide">
      <thead>
        <tr>
          <th>{copy.conversionHeaders.step}</th>
          <th>{copy.conversionHeaders.rate}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <td>{r.label}</td>
            <td>
              <Percent value={r.value} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CategoryTable({
  metrics,
  copy,
}: {
  metrics: AdminDashboardMetrics;
  copy: ConsultationCopy;
}): React.ReactElement {
  return (
    <table className="admin-console-table">
      <thead>
        <tr>
          <th>{copy.categoryTableHeader}</th>
          <th>{copy.categoryTableHeaders.chats}</th>
          <th>{copy.categoryTableHeaders.submissions}</th>
          <th>{copy.categoryTableHeaders.positive}</th>
          <th>{copy.categoryTableHeaders.negative}</th>
        </tr>
      </thead>
      <tbody>
        {metrics.byCategory.length === 0 ? (
          <tr>
            <td colSpan={5} className="admin-console-empty">
              {copy.categoryTableHeaders.empty}
            </td>
          </tr>
        ) : (
          metrics.byCategory.map((row) => (
            <tr key={row.category}>
              <td>{row.category}</td>
              <td className="admin-console-num">{row.chatCount}</td>
              <td className="admin-console-num">{row.submissions}</td>
              <td className="admin-console-num admin-console-pos">{row.feedbackPositive}</td>
              <td className="admin-console-num admin-console-neg">{row.feedbackNegative}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function RecentNegativeFeedback({
  items,
  copy,
}: {
  items: AdminDashboardMetrics['recentNegativeFeedback'];
  copy: ConsultationCopy;
}): React.ReactElement {
  if (items.length === 0) {
    return <p className="admin-console-empty-note">{copy.recentNegativeEmpty}</p>;
  }
  return (
    <ul className="admin-console-feedback-list">
      {items.map((f) => (
        <li key={`${f.sessionId}-${f.messageId}`}>
          <div className="admin-console-feedback-meta">
            <span className="admin-console-feedback-time">{formatTimestamp(f.timestamp)}</span>
            {f.classification ? <span className="admin-console-tag">{f.classification}</span> : null}
            {f.riskLevel ? <span className="admin-console-tag">{f.riskLevel}</span> : null}
          </div>
          <div className="admin-console-feedback-session">
            session: <code>{f.sessionId}</code> · msg: <code>{f.messageId}</code>
          </div>
          {f.commentRedacted ? (
            <p className="admin-console-feedback-comment">{f.commentRedacted}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function RecentSubmissions({
  items,
  copy,
}: {
  items: AdminDashboardMetrics['recentSubmissions'];
  copy: ConsultationCopy;
}): React.ReactElement {
  if (items.length === 0) {
    return <p className="admin-console-empty-note">{copy.recentSubmissionsEmpty}</p>;
  }
  return (
    <table className="admin-console-table admin-console-table--wide">
      <thead>
        <tr>
          <th>{copy.recentSubmissionsHeaders.time}</th>
          <th>{copy.recentSubmissionsHeaders.intakeId}</th>
          <th>{copy.recentSubmissionsHeaders.category}</th>
          <th>{copy.recentSubmissionsHeaders.risk}</th>
          <th>{copy.recentSubmissionsHeaders.urgency}</th>
          <th>{copy.recentSubmissionsHeaders.contact}</th>
          <th>{copy.recentSubmissionsHeaders.status}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((s, i) => (
          <tr key={`${s.sessionId}-${i}`}>
            <td className="admin-console-time">{formatTimestamp(s.timestamp)}</td>
            <td>
              <code>{s.intakeId || '-'}</code>
            </td>
            <td>{s.classification || '-'}</td>
            <td>{s.riskLevel || '-'}</td>
            <td>{s.urgency || '-'}</td>
            <td>{s.preferredContact || '-'}</td>
            <td>
              {s.success ? (
                <span className="admin-console-status-ok">sent</span>
              ) : (
                <span className="admin-console-status-fail">
                  {s.failureReason || 'failed'}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RecentChatSamples({
  items,
  copy,
}: {
  items: AdminDashboardMetrics['recentChatSamples'];
  copy: ConsultationCopy;
}): React.ReactElement {
  if (items.length === 0) {
    return <p className="admin-console-empty-note">{copy.recentChatEmpty}</p>;
  }
  return (
    <ul className="admin-console-chat-list">
      {items.map((e, i) => (
        <li key={`${e.sessionId}-${i}`}>
          <div className="admin-console-chat-meta">
            <span className="admin-console-chat-time">{formatTimestamp(e.timestamp)}</span>
            {e.locale ? <span className="admin-console-tag">{e.locale}</span> : null}
            {e.classification ? <span className="admin-console-tag">{e.classification}</span> : null}
            {e.riskLevel ? <span className="admin-console-tag">{e.riskLevel}</span> : null}
          </div>
          {e.messageRedacted ? (
            <p className="admin-console-chat-message">{e.messageRedacted}</p>
          ) : null}
          {e.referencedColumns && e.referencedColumns.length > 0 ? (
            <p className="admin-console-chat-refs">
              refs: {e.referencedColumns.join(', ')}
            </p>
          ) : null}
          {e.referencedKnowledgeIds && e.referencedKnowledgeIds.length > 0 ? (
            <p className="admin-console-chat-refs">
              attorney Q&A: {e.referencedKnowledgeIds.join(', ')}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function KnowledgeStatusNotice({
  status,
  copy,
}: {
  status?: string;
  copy: ConsultationCopy;
}): React.ReactElement | null {
  if (!status) return null;
  const labels: Record<string, string> = copy.knowledgeStatus;
  const message = labels[status];
  if (!message) return null;
  return (
    <p className={`admin-console-knowledge-status admin-console-knowledge-status--${status}`}>
      {message}
    </p>
  );
}

function KnowledgeCategorySelect({
  defaultValue,
  copy,
}: {
  defaultValue?: string;
  copy: ConsultationCopy;
}): React.ReactElement {
  return (
    <label className="admin-console-field">
      <span>{copy.knowledgeForm.categoryLabel}</span>
      <select name="category" defaultValue={defaultValue || 'general'}>
        {CATEGORY_OPTIONS.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}

function AttorneyKnowledgeCreateForm({
  locale,
  defaultQuestion,
  defaultCategory,
  defaultKeywords,
  sourceNote,
  copy,
  submitLabel = copy.knowledgeForm.submitLabel,
}: {
  locale: Locale;
  defaultQuestion?: string;
  defaultCategory?: string;
  defaultKeywords?: string[];
  sourceNote?: string;
  copy: ConsultationCopy;
  submitLabel?: string;
}): React.ReactElement {
  return (
    <form className="admin-console-knowledge-form" method="post" action={KNOWLEDGE_ACTION_PATH}>
      <input type="hidden" name="locale" value={locale} />
      {sourceNote ? <input type="hidden" name="sourceNote" value={sourceNote} /> : null}
      <label className="admin-console-field">
        <span>{copy.knowledgeForm.questionLabel}</span>
        <textarea
          name="question"
          defaultValue={defaultQuestion || ''}
          rows={2}
          placeholder={copy.knowledgeForm.questionPlaceholder}
          required
        />
      </label>
      <KnowledgeCategorySelect defaultValue={defaultCategory} copy={copy} />
      <label className="admin-console-field">
        <span>{copy.knowledgeForm.answerLabel}</span>
        <textarea
          name="answer"
          rows={5}
          placeholder={copy.knowledgeForm.answerPlaceholder}
          required
        />
        <small>{copy.knowledgeForm.answerHint}</small>
      </label>
      <label className="admin-console-field">
        <span>{copy.knowledgeForm.keywordsLabel}</span>
        <input
          name="keywords"
          defaultValue={(defaultKeywords || []).join(', ')}
          placeholder={copy.knowledgeForm.keywordsPlaceholder}
        />
      </label>
      <label className="admin-console-field">
        <span>{copy.knowledgeForm.reviewerLabel}</span>
        <input name="reviewedBy" placeholder={copy.knowledgeForm.reviewerPlaceholder} />
      </label>
      <div className="admin-console-form-actions">
        <button type="submit" className="admin-console-primary-btn">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function ApprovedAttorneyKnowledge({
  entries,
  copy,
}: {
  entries: AdminDashboardMetrics['attorneyKnowledge']['approved'];
  copy: ConsultationCopy;
}): React.ReactElement {
  if (entries.length === 0) {
    return (
      <p className="admin-console-empty-note">
        {copy.emptyStates.approvedKnowledge}
      </p>
    );
  }

  return (
    <div className="admin-console-knowledge-list">
      {entries.map((entry) => (
        <article key={entry.id} className="admin-console-knowledge-card">
          <div className="admin-console-knowledge-card-head">
            <div>
              <h3>{entry.question}</h3>
              <p>
                {entry.category} · {entry.locale} · 최근 검토 {formatTimestamp(entry.reviewedAt)}
              </p>
            </div>
            <form method="post" action={KNOWLEDGE_ACTION_PATH}>
              <input type="hidden" name="action" value="archive" />
              <input type="hidden" name="id" value={entry.id} />
              <button type="submit" className="admin-console-danger-btn">
                {copy.knowledgeForm.archiveLabel}
              </button>
            </form>
          </div>
          <form className="admin-console-knowledge-form" method="post" action={KNOWLEDGE_ACTION_PATH}>
            <input type="hidden" name="id" value={entry.id} />
            <input type="hidden" name="locale" value={entry.locale} />
            <input type="hidden" name="sourceNote" value={entry.sourceNote || 'approved attorney knowledge update'} />
            <label className="admin-console-field">
              <span>{copy.knowledgeForm.questionLabel}</span>
              <textarea name="question" defaultValue={entry.question} rows={2} required />
            </label>
            <KnowledgeCategorySelect defaultValue={entry.category} copy={copy} />
            <label className="admin-console-field">
              <span>{copy.knowledgeForm.answerLabel}</span>
              <textarea name="answer" defaultValue={entry.answer} rows={5} required />
            </label>
            <label className="admin-console-field">
              <span>{copy.knowledgeForm.keywordsLabel}</span>
              <input name="keywords" defaultValue={entry.keywords.join(', ')} />
            </label>
            <label className="admin-console-field">
              <span>{copy.knowledgeForm.reviewerLabel}</span>
              <input name="reviewedBy" defaultValue={entry.reviewedBy || ''} />
            </label>
            <div className="admin-console-form-actions">
              <button type="submit" className="admin-console-ghost-btn">
                {copy.knowledgeForm.saveLabel}
              </button>
            </div>
          </form>
        </article>
      ))}
    </div>
  );
}

function KnowledgeGapCandidates({
  locale,
  items,
  copy,
}: {
  locale: Locale;
  items: AdminDashboardMetrics['attorneyKnowledge']['gapCandidates'];
  copy: ConsultationCopy;
}): React.ReactElement {
  if (items.length === 0) {
    return (
      <p className="admin-console-empty-note">
        {copy.emptyStates.gapCandidates}
      </p>
    );
  }

  return (
    <div className="admin-console-knowledge-list">
      {items.slice(0, 8).map((item) => (
        <article
          key={`${item.locale || locale}-${item.classification || 'general'}-${item.question}-${item.reason}`}
          className="admin-console-knowledge-candidate"
        >
          <div className="admin-console-knowledge-candidate-head">
            <strong>{item.question}</strong>
            <span>{item.count}회 · {item.reason}</span>
          </div>
          <AttorneyKnowledgeCreateForm
            locale={normalizeLocale(item.locale || locale)}
            defaultQuestion={item.question}
            defaultCategory={item.classification || 'general'}
            defaultKeywords={item.keywords}
            sourceNote={`dashboard gap candidate: ${item.reason}`}
            submitLabel={copy.knowledgeForm.candidateSaveLabel}
            copy={copy}
          />
        </article>
      ))}
    </div>
  );
}

function SuggestedAttorneyQuestions({
  locale,
  items,
  copy,
}: {
  locale: Locale;
  items: AdminDashboardMetrics['attorneyKnowledge']['suggestedQuestions'];
  copy: ConsultationCopy;
}): React.ReactElement {
  const visibleItems = items.filter((item) => item.locale === locale).slice(0, 8);
  if (visibleItems.length === 0) {
    return <p className="admin-console-empty-note">{copy.emptyStates.suggestedQuestions}</p>;
  }

  return (
    <div className="admin-console-knowledge-list">
      {visibleItems.map((item) => (
        <article key={item.id} className="admin-console-knowledge-candidate">
          <div className="admin-console-knowledge-candidate-head">
            <strong>{item.question}</strong>
            <span>{item.priority} · {item.why}</span>
          </div>
          <AttorneyKnowledgeCreateForm
            locale={item.locale}
            defaultQuestion={item.question}
            defaultCategory={item.category}
            defaultKeywords={item.keywords}
            sourceNote={`expected attorney question: ${item.id}`}
            submitLabel={copy.knowledgeForm.suggestedSaveLabel}
            copy={copy}
          />
        </article>
      ))}
    </div>
  );
}

export default async function AdminConsultationPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { days?: string; knowledge?: string };
}): Promise<React.ReactElement> {
  // Authentication happens in src/middleware.ts before this Server
  // Component even runs. If the request reached here, the caller has
  // already satisfied the Basic Auth challenge.
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getConsultationCopy(locale);

  const requestedDays = Number.parseInt(searchParams?.days ?? '7', 10);
  const windowDays = Number.isFinite(requestedDays) && requestedDays > 0 && requestedDays <= 90 ? requestedDays : 7;

  let metrics: AdminDashboardMetrics;
  let loadError: string | null = null;

  try {
    metrics = await readDashboardMetrics(windowDays);
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Unknown dashboard error';
    metrics = {
      generatedAt: new Date().toISOString(),
      timeWindowDays: windowDays,
      totalEvents: 0,
      totalFeedback: 0,
      funnel: {
        session_started: 0,
        chat_received: 0,
        chat_answered: 0,
        chat_failed: 0,
        chat_rate_limited: 0,
        chat_injection_blocked: 0,
        escalation_shown: 0,
        form_opened: 0,
        form_submit_attempted: 0,
        submit_received: 0,
        submit_validated: 0,
        submit_email_sent: 0,
        submit_email_failed: 0,
        submit_rate_limited: 0,
        submit_consent_missing: 0,
        submit_duplicate: 0,
      },
      conversion: {
        received_to_answered: 0,
        received_to_submit_received: 0,
        submit_received_to_email_sent: 0,
        full_funnel: 0,
      },
      byCategory: [],
      byRiskLevel: [],
      byLocale: [],
      feedback: {
        total: 0,
        helpful: 0,
        unhelpful: 0,
        helpfulRatio: 0,
      },
      safety: {
        piiBypassTriggered: 0,
        lowConfidenceBypassTriggered: 0,
        groundednessFlagged: 0,
        stalenessFlagged: 0,
        rateLimitedChat: 0,
        rateLimitedSubmit: 0,
      },
      performance: {
        sampleCount: 0,
        latencyP50Ms: 0,
        latencyP95Ms: 0,
        latencyP99Ms: 0,
        avgLatencyMs: 0,
        totalPromptTokens: 0,
        totalCompletionTokens: 0,
        totalTokens: 0,
        estimatedCostUsd: 0,
        avgCostPerChatUsd: 0,
      },
      recentNegativeFeedback: [],
      recentSubmissions: [],
      recentChatSamples: [],
      attorneyKnowledge: {
        approvedCount: 0,
        approved: [],
        suggestedQuestions: [],
        gapCandidates: [],
      },
    };
  }

  return (
    <main className="admin-console">
      <header className="admin-console-header">
        <div>
          <h1>{copy.heroTitle}</h1>
          <p>
            {copy.heroDescription
              .replace('{days}', String(metrics.timeWindowDays))
              .replace('{events}', metrics.totalEvents.toLocaleString())
              .replace('{feedback}', metrics.totalFeedback.toLocaleString())
              .replace('{generatedAt}', formatTimestamp(metrics.generatedAt))}
          </p>
        </div>
        <p className="admin-console-window-label">{copy.windowLabel}</p>
        <nav className="admin-console-window-nav" aria-label={copy.windowAriaLabel}>
          {copy.windowOptions.map((option) => (
            <a
              key={option.days}
              href={`?days=${option.days}`}
              className={option.days === metrics.timeWindowDays ? 'is-active' : ''}
            >
              {option.label}
            </a>
          ))}
        </nav>
      </header>

      {loadError ? (
        <Section
          title={copy.loadErrorTitle}
          description={copy.loadErrorDescription}
        >
          <p className="admin-console-empty-note">
            {copy.loadErrorFallbackPrefix}: <code>{loadError}</code>
          </p>
          <p className="admin-console-empty-note">
            {copy.loadErrorSecondaryNote}
          </p>
        </Section>
      ) : null}

      <div className="admin-console-grid">
        <Section title={copy.conversionTitle} description={copy.conversionDescription}>
          <div className="admin-console-split">
            <FunnelTable metrics={metrics} copy={copy} />
            <ConversionTable metrics={metrics} copy={copy} />
          </div>
        </Section>

        <Section
          title={copy.performanceTitle}
          description={copy.performanceDescription
            .replace('{days}', String(metrics.timeWindowDays))
            .replace('{samples}', metrics.performance.sampleCount.toLocaleString())}
        >
          <table className="admin-console-table">
            <tbody>
              <tr>
                <td>{copy.performanceRowLabels.latencyP50}</td>
                <td className="admin-console-num">
                  {metrics.performance.latencyP50Ms.toLocaleString()} ms
                </td>
              </tr>
              <tr>
                <td>{copy.performanceRowLabels.latencyP95}</td>
                <td className="admin-console-num">
                  {metrics.performance.latencyP95Ms.toLocaleString()} ms
                </td>
              </tr>
              <tr>
                <td>{copy.performanceRowLabels.latencyP99}</td>
                <td className="admin-console-num">
                  {metrics.performance.latencyP99Ms.toLocaleString()} ms
                </td>
              </tr>
              <tr>
                <td>{copy.performanceRowLabels.avgLatency}</td>
                <td className="admin-console-num">
                  {metrics.performance.avgLatencyMs.toLocaleString()} ms
                </td>
              </tr>
              <tr>
                <td>{copy.performanceRowLabels.totalPromptTokens}</td>
                <td className="admin-console-num">
                  {metrics.performance.totalPromptTokens.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>{copy.performanceRowLabels.totalCompletionTokens}</td>
                <td className="admin-console-num">
                  {metrics.performance.totalCompletionTokens.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>{copy.performanceRowLabels.estimatedTotalCost}</td>
                <td className="admin-console-num">
                  ${metrics.performance.estimatedCostUsd.toFixed(4)}
                </td>
              </tr>
              <tr>
                <td>{copy.performanceRowLabels.avgCostPerChat}</td>
                <td className="admin-console-num">
                  ${metrics.performance.avgCostPerChatUsd.toFixed(4)}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section title={copy.safetyTitle}>
          <table className="admin-console-table">
            <tbody>
              <tr>
                <td>{copy.safetyRowLabels.chatFailed}</td>
                <td className="admin-console-num">{metrics.funnel.chat_failed}</td>
              </tr>
              <tr>
                <td>{copy.safetyRowLabels.chatRateLimited}</td>
                <td className="admin-console-num">{metrics.safety.rateLimitedChat}</td>
              </tr>
              <tr>
                <td>{copy.safetyRowLabels.promptInjectionBlocked}</td>
                <td className="admin-console-num">{metrics.funnel.chat_injection_blocked}</td>
              </tr>
              <tr>
                <td>{copy.safetyRowLabels.piiBypassTriggered}</td>
                <td className="admin-console-num">{metrics.safety.piiBypassTriggered}</td>
              </tr>
              <tr>
                <td>{copy.safetyRowLabels.lowConfidenceBypass}</td>
                <td className="admin-console-num">{metrics.safety.lowConfidenceBypassTriggered}</td>
              </tr>
              <tr>
                <td>{copy.safetyRowLabels.groundednessFlagged}</td>
                <td className="admin-console-num">{metrics.safety.groundednessFlagged}</td>
              </tr>
              <tr>
                <td>{copy.safetyRowLabels.stalenessWarningShown}</td>
                <td className="admin-console-num">{metrics.safety.stalenessFlagged}</td>
              </tr>
              <tr>
                <td>{copy.safetyRowLabels.submitRateLimited}</td>
                <td className="admin-console-num">{metrics.safety.rateLimitedSubmit}</td>
              </tr>
              <tr>
                <td>{copy.safetyRowLabels.submitDuplicate}</td>
                <td className="admin-console-num">{metrics.funnel.submit_duplicate}</td>
              </tr>
              <tr>
                <td>{copy.safetyRowLabels.submitConsentMissing}</td>
                <td className="admin-console-num">{metrics.funnel.submit_consent_missing}</td>
              </tr>
              <tr>
                <td>{copy.safetyRowLabels.submitEmailFailed}</td>
                <td className="admin-console-num">{metrics.funnel.submit_email_failed}</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section title={copy.categoryTitle}>
          <CategoryTable metrics={metrics} copy={copy} />
        </Section>

        <Section title={copy.riskTitle}>
          <table className="admin-console-table">
            <thead>
              <tr>
                <th>{copy.riskTableHeaders.level}</th>
                <th>{copy.riskTableHeaders.count}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.byRiskLevel.map((r) => (
                <tr key={r.riskLevel}>
                  <td>{r.riskLevel}</td>
                  <td className="admin-console-num">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title={copy.localeTitle}>
          <table className="admin-console-table">
            <thead>
              <tr>
                <th>{copy.localeTableHeaders.locale}</th>
                <th>{copy.localeTableHeaders.count}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.byLocale.length === 0 ? (
                <tr>
                  <td colSpan={2} className="admin-console-empty">(none)</td>
                </tr>
              ) : (
                metrics.byLocale.map((r) => (
                  <tr key={r.locale}>
                    <td>{r.locale}</td>
                    <td className="admin-console-num">{r.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Section>

        <Section
          title={copy.feedbackTitle}
          description={copy.feedbackDescription
            .replace('{total}', metrics.feedback.total.toLocaleString())
            .replace('{helpful}', metrics.feedback.helpful.toLocaleString())
            .replace('{ratio}', String(metrics.feedback.helpfulRatio))
            .replace('{unhelpful}', metrics.feedback.unhelpful.toLocaleString())}
        >
          <div className="admin-console-feedback-bar" aria-hidden>
            <span
              className="admin-console-feedback-bar-pos"
              style={{ width: `${metrics.feedback.helpfulRatio}%` }}
            />
          </div>
        </Section>
      </div>

      <Section
        title={copy.recentNegativeTitle}
        description={copy.recentNegativeDescription}
      >
        <RecentNegativeFeedback items={metrics.recentNegativeFeedback} copy={copy} />
      </Section>

      <Section title={copy.recentSubmissionsTitle} description={copy.recentSubmissionsDescription}>
        <RecentSubmissions items={metrics.recentSubmissions} copy={copy} />
      </Section>

      <Section
        title={copy.knowledgeTitle}
        description={copy.knowledgeDescription.replace('{approvedCount}', metrics.attorneyKnowledge.approvedCount.toLocaleString())}
      >
        <KnowledgeStatusNotice status={searchParams?.knowledge} copy={copy} />
        <div className="admin-console-knowledge-grid">
          <div>
            <h3 className="admin-console-subtitle">{copy.knowledgeDirectTitle}</h3>
            <AttorneyKnowledgeCreateForm locale={locale} sourceNote="manual attorney knowledge entry" copy={copy} />
          </div>
          <div>
            <h3 className="admin-console-subtitle">{copy.knowledgeApprovedTitle}</h3>
            <ApprovedAttorneyKnowledge entries={metrics.attorneyKnowledge.approved} copy={copy} />
          </div>
        </div>
      </Section>

      <Section
        title={copy.knowledgeGapTitle}
        description={copy.knowledgeForm.answerHint}
      >
        <div className="admin-console-knowledge-grid">
          <div>
            <h3 className="admin-console-subtitle">{copy.knowledgeGapTitle}</h3>
            <KnowledgeGapCandidates locale={locale} items={metrics.attorneyKnowledge.gapCandidates} copy={copy} />
          </div>
          <div>
            <h3 className="admin-console-subtitle">{copy.knowledgeSuggestedTitle}</h3>
            <SuggestedAttorneyQuestions locale={locale} items={metrics.attorneyKnowledge.suggestedQuestions} copy={copy} />
          </div>
        </div>
      </Section>

      <Section title={copy.recentChatTitle} description={copy.recentChatDescription}>
        <RecentChatSamples items={metrics.recentChatSamples} copy={copy} />
      </Section>
    </main>
  );
}
