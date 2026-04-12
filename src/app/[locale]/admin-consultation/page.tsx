import type { Metadata } from 'next';
import {
  readDashboardMetrics,
  type AdminDashboardMetrics,
} from '@/lib/consultation/admin/read-logs';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Consultation Admin',
  robots: { index: false, follow: false },
};

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

function FunnelTable({ metrics }: { metrics: AdminDashboardMetrics }): React.ReactElement {
  const rows: Array<{ label: string; count: number; note?: string }> = [
    { label: 'Session started', count: metrics.funnel.session_started },
    { label: 'Chat received', count: metrics.funnel.chat_received },
    { label: 'Chat answered', count: metrics.funnel.chat_answered },
    { label: 'Escalation shown', count: metrics.funnel.escalation_shown },
    { label: 'Form opened', count: metrics.funnel.form_opened },
    { label: 'Form submit attempted', count: metrics.funnel.form_submit_attempted },
    { label: 'Submit received', count: metrics.funnel.submit_received },
    { label: 'Submit validated', count: metrics.funnel.submit_validated },
    { label: 'Submit email sent', count: metrics.funnel.submit_email_sent },
  ];
  return (
    <table className="admin-console-table">
      <thead>
        <tr>
          <th>Stage</th>
          <th>Count</th>
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

function ConversionTable({ metrics }: { metrics: AdminDashboardMetrics }): React.ReactElement {
  const rows = [
    { label: 'Chat received → answered', value: metrics.conversion.received_to_answered },
    { label: 'Chat received → submit received', value: metrics.conversion.received_to_submit_received },
    { label: 'Submit received → email sent', value: metrics.conversion.submit_received_to_email_sent },
    { label: 'Full funnel (chat → email sent)', value: metrics.conversion.full_funnel },
  ];
  return (
    <table className="admin-console-table admin-console-table--wide">
      <thead>
        <tr>
          <th>Conversion step</th>
          <th>Rate</th>
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

function CategoryTable({ metrics }: { metrics: AdminDashboardMetrics }): React.ReactElement {
  return (
    <table className="admin-console-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Chats</th>
          <th>Submissions</th>
          <th>👍</th>
          <th>👎</th>
        </tr>
      </thead>
      <tbody>
        {metrics.byCategory.length === 0 ? (
          <tr>
            <td colSpan={5} className="admin-console-empty">
              (no chat events in window)
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
}: {
  items: AdminDashboardMetrics['recentNegativeFeedback'];
}): React.ReactElement {
  if (items.length === 0) {
    return <p className="admin-console-empty-note">👎 피드백이 없습니다.</p>;
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
}: {
  items: AdminDashboardMetrics['recentSubmissions'];
}): React.ReactElement {
  if (items.length === 0) {
    return <p className="admin-console-empty-note">기간 내 제출 이벤트가 없습니다.</p>;
  }
  return (
    <table className="admin-console-table admin-console-table--wide">
      <thead>
        <tr>
          <th>Time (Taipei)</th>
          <th>Intake ID</th>
          <th>Category</th>
          <th>Risk</th>
          <th>Urgency</th>
          <th>Contact</th>
          <th>Status</th>
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
}: {
  items: AdminDashboardMetrics['recentChatSamples'];
}): React.ReactElement {
  if (items.length === 0) {
    return <p className="admin-console-empty-note">기간 내 채팅 이벤트가 없습니다.</p>;
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
        </li>
      ))}
    </ul>
  );
}

export default async function AdminConsultationPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { days?: string };
}): Promise<React.ReactElement> {
  // Authentication happens in src/middleware.ts before this Server
  // Component even runs. If the request reached here, the caller has
  // already satisfied the Basic Auth challenge.
  const locale: Locale = normalizeLocale(params.locale);
  void locale; // currently unused at the UI level but kept for future i18n

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
    };
  }

  return (
    <main className="admin-console">
      <header className="admin-console-header">
        <div>
          <h1>호정 AI 상담 운영 대시보드</h1>
          <p>
            최근 <strong>{metrics.timeWindowDays}</strong>일 구간 ·{' '}
            총 이벤트 <strong>{metrics.totalEvents.toLocaleString()}</strong>개 ·{' '}
            피드백 <strong>{metrics.totalFeedback.toLocaleString()}</strong>개 ·{' '}
            생성 시각 {formatTimestamp(metrics.generatedAt)}
          </p>
        </div>
        <nav className="admin-console-window-nav" aria-label="Time window">
          {[1, 7, 14, 30, 90].map((d) => (
            <a
              key={d}
              href={`?days=${d}`}
              className={d === metrics.timeWindowDays ? 'is-active' : ''}
            >
              {d}일
            </a>
          ))}
        </nav>
      </header>

      {loadError ? (
        <Section
          title="Dashboard fallback mode"
          description="메트릭 로딩에 실패했지만 페이지 자체는 열어 둡니다."
        >
          <p className="admin-console-empty-note">
            로그 스토리지 읽기 실패: <code>{loadError}</code>
          </p>
          <p className="admin-console-empty-note">
            현재는 0값 fallback으로 렌더링 중입니다. 로컬 리뷰에서는 파일 로그를 우선 사용하도록 조정했습니다.
          </p>
        </Section>
      ) : null}

      <div className="admin-console-grid">
        <Section title="Conversion funnel" description="세션 발생부터 이메일 접수 완료까지 단계별 드롭오프.">
          <div className="admin-console-split">
            <FunnelTable metrics={metrics} />
            <ConversionTable metrics={metrics} />
          </div>
        </Section>

        <Section
          title="Performance & cost"
          description={`최근 ${metrics.timeWindowDays}일 LLM 호출 ${metrics.performance.sampleCount}건 기준. gpt-4o-mini 가격 (입력 $0.15 / 출력 $0.60 per 1M tokens).`}
        >
          <table className="admin-console-table">
            <tbody>
              <tr>
                <td>Latency p50</td>
                <td className="admin-console-num">
                  {metrics.performance.latencyP50Ms.toLocaleString()} ms
                </td>
              </tr>
              <tr>
                <td>Latency p95</td>
                <td className="admin-console-num">
                  {metrics.performance.latencyP95Ms.toLocaleString()} ms
                </td>
              </tr>
              <tr>
                <td>Latency p99</td>
                <td className="admin-console-num">
                  {metrics.performance.latencyP99Ms.toLocaleString()} ms
                </td>
              </tr>
              <tr>
                <td>Avg latency</td>
                <td className="admin-console-num">
                  {metrics.performance.avgLatencyMs.toLocaleString()} ms
                </td>
              </tr>
              <tr>
                <td>Total prompt tokens</td>
                <td className="admin-console-num">
                  {metrics.performance.totalPromptTokens.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Total completion tokens</td>
                <td className="admin-console-num">
                  {metrics.performance.totalCompletionTokens.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Estimated total cost (USD)</td>
                <td className="admin-console-num">
                  ${metrics.performance.estimatedCostUsd.toFixed(4)}
                </td>
              </tr>
              <tr>
                <td>Avg cost per chat (USD)</td>
                <td className="admin-console-num">
                  ${metrics.performance.avgCostPerChatUsd.toFixed(4)}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section title="Safety & rate limits">
          <table className="admin-console-table">
            <tbody>
              <tr>
                <td>Chat failed</td>
                <td className="admin-console-num">{metrics.funnel.chat_failed}</td>
              </tr>
              <tr>
                <td>Chat rate-limited (IP)</td>
                <td className="admin-console-num">{metrics.safety.rateLimitedChat}</td>
              </tr>
              <tr>
                <td>Prompt injection blocked</td>
                <td className="admin-console-num">{metrics.funnel.chat_injection_blocked}</td>
              </tr>
              <tr>
                <td>Submit rate-limited (session)</td>
                <td className="admin-console-num">{metrics.safety.rateLimitedSubmit}</td>
              </tr>
              <tr>
                <td>Submit duplicate</td>
                <td className="admin-console-num">{metrics.funnel.submit_duplicate}</td>
              </tr>
              <tr>
                <td>Submit consent missing</td>
                <td className="admin-console-num">{metrics.funnel.submit_consent_missing}</td>
              </tr>
              <tr>
                <td>Submit email failed</td>
                <td className="admin-console-num">{metrics.funnel.submit_email_failed}</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section title="Category breakdown">
          <CategoryTable metrics={metrics} />
        </Section>

        <Section title="Risk level distribution">
          <table className="admin-console-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Count</th>
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

        <Section title="Locale distribution">
          <table className="admin-console-table">
            <thead>
              <tr>
                <th>Locale</th>
                <th>Count</th>
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
          title="Feedback overview"
          description={`전체 피드백 ${metrics.feedback.total}건 중 👍 ${metrics.feedback.helpful}건 (${metrics.feedback.helpfulRatio}%), 👎 ${metrics.feedback.unhelpful}건.`}
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
        title="Recent 👎 feedback"
        description="변호사 재검토 대상. 메시지 본문은 저장되지 않고, 사용자가 남긴 코멘트만 PII 마스킹 후 노출됩니다."
      >
        <RecentNegativeFeedback items={metrics.recentNegativeFeedback} />
      </Section>

      <Section title="Recent submissions" description="최근 10건의 상담 접수 (실제 수신 이메일 내용은 본 문서에 노출되지 않습니다).">
        <RecentSubmissions items={metrics.recentSubmissions} />
      </Section>

      <Section title="Recent chat samples" description="최근 15개 채팅 이벤트. 메시지는 이메일/전화번호/RRN이 서버 저장 시점에 redact된 상태입니다.">
        <RecentChatSamples items={metrics.recentChatSamples} />
      </Section>
    </main>
  );
}
