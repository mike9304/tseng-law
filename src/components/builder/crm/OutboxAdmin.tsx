import type { CrmEmailSimulationEntry } from '@/lib/builder/crm/automation-model';
import type { Locale } from '@/lib/locales';

interface Props {
  initialEntries: CrmEmailSimulationEntry[];
  locale: Locale;
}

const OUTBOX_COPY = {
  ko: {
    title: '이메일 시뮬레이션 기록',
    summary: '개발 환경의 자동화 이메일 시뮬레이션 기록입니다. 실제 발송 내역이 아닙니다.',
    total: '전체',
    automation: '자동화',
    contact: '연락처',
    template: '템플릿',
    triggered: '생성 시각',
    empty: '이메일 시뮬레이션 기록이 없습니다.',
    none: '없음',
    dateLocale: 'ko-KR',
  },
  'zh-hant': {
    title: 'Email 模擬紀錄',
    summary: '開發環境中的 Email 模擬紀錄，並非實際寄送紀錄。',
    total: '總計',
    automation: '自動化',
    contact: '聯絡人',
    template: '範本',
    triggered: '建立時間',
    empty: '沒有 Email 模擬紀錄。',
    none: '無',
    dateLocale: 'zh-TW',
  },
  en: {
    title: 'Email simulation records',
    summary: 'Development email simulations created by CRM automations. These are not deliveries.',
    total: 'Total',
    automation: 'Automation',
    contact: 'Contact',
    template: 'Template',
    triggered: 'Created',
    empty: 'No email simulation records.',
    none: 'None',
    dateLocale: 'en-US',
  },
} as const satisfies Record<Locale, {
  title: string;
  summary: string;
  total: string;
  automation: string;
  contact: string;
  template: string;
  triggered: string;
  empty: string;
  none: string;
  dateLocale: string;
}>;

function formatDateTime(locale: Locale, value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(OUTBOX_COPY[locale].dateLocale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function OutboxAdmin({ initialEntries, locale }: Props) {
  const copy = OUTBOX_COPY[locale];
  const entries = [...initialEntries].sort((left, right) => right.triggeredAt.localeCompare(left.triggeredAt));

  return (
    <section
      data-testid="crm-outbox-admin"
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{copy.title}</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{copy.summary}</p>
        </div>
        <div
          style={{
            minWidth: 88,
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{copy.total}</div>
          <div style={{ fontSize: 20, color: '#0f172a', fontWeight: 800 }}>{entries.length}</div>
        </div>
      </header>

      {entries.length === 0 ? (
        <div
          style={{
            padding: 18,
            border: '1px dashed #cbd5e1',
            borderRadius: 8,
            background: '#fff',
            color: '#64748b',
            fontSize: 13,
          }}
        >
          {copy.empty}
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px' }}>{copy.contact}</th>
              <th style={{ padding: '8px 12px' }}>{copy.automation}</th>
              <th style={{ padding: '8px 12px' }}>{copy.template}</th>
              <th style={{ padding: '8px 12px' }}>{copy.triggered}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.entryId} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: '9px 12px', color: '#0f172a', fontWeight: 700 }}>{entry.contactEmail}</td>
                <td style={{ padding: '9px 12px', color: '#334155' }}>{entry.automationId}</td>
                <td style={{ padding: '9px 12px', color: '#334155' }}>{entry.templateId ?? copy.none}</td>
                <td style={{ padding: '9px 12px', color: '#64748b' }}>{formatDateTime(locale, entry.triggeredAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
