'use client';

import type { BuilderSeoAssistantTask } from '@/lib/builder/seo/assistant';
import type { BuilderSeoValidationIssue } from '@/lib/builder/seo/validation';
import {
  fieldStyle,
  ghostButtonStyle,
  helpTextStyle,
  inputStyle,
  labelStyle,
  previewCardStyle,
  sectionStyle,
  sectionTitleStyle,
} from './SeoPanel.styles';

function issueTone(issue: BuilderSeoValidationIssue): React.CSSProperties {
  if (issue.severity === 'blocker') return { color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' };
  if (issue.severity === 'warning') return { color: '#b45309', borderColor: '#fed7aa', background: '#fff7ed' };
  return { color: '#0369a1', borderColor: '#bae6fd', background: '#f0f9ff' };
}

interface SeoPanelAssistantTabProps {
  active: boolean;
  focusKeyword: string;
  assistantStatus: string;
  assistantTasks: BuilderSeoAssistantTask[];
  localIssues: BuilderSeoValidationIssue[];
  onChangeFocusKeyword: (value: string) => void;
  onSaveFocusKeyword: () => void;
}

export function SeoPanelAssistantTab({
  active,
  focusKeyword,
  assistantStatus,
  assistantTasks,
  localIssues,
  onChangeFocusKeyword,
  onSaveFocusKeyword,
}: SeoPanelAssistantTabProps) {
  return (
    <>
      <section style={{ ...sectionStyle, display: active ? 'grid' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <h3 style={sectionTitleStyle}>SEO Assistant</h3>
            <span style={helpTextStyle}>포커스 키워드와 자동 점검 항목을 관리합니다.</span>
          </div>
          <button type="button" style={ghostButtonStyle} onClick={onSaveFocusKeyword}>
            키워드 저장
          </button>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="builder-seo-focus-keyword">Focus keyword</label>
          <input
            id="builder-seo-focus-keyword"
            type="text"
            value={focusKeyword}
            style={inputStyle}
            onChange={(event) => onChangeFocusKeyword(event.target.value)}
          />
        </div>
        {assistantStatus ? (
          <div style={{ ...helpTextStyle, color: assistantStatus.includes('실패') ? '#dc2626' : '#15803d' }}>
            {assistantStatus}
          </div>
        ) : null}
        {assistantTasks.length === 0 ? (
          <div style={{ ...previewCardStyle, color: '#64748b', fontSize: '0.78rem' }}>
            Assistant 점검 항목이 없습니다.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {assistantTasks.map((task) => (
              <div key={task.id} style={previewCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>{task.label}</strong>
                  <span style={helpTextStyle}>{task.severity} · {task.status}</span>
                </div>
                <div style={helpTextStyle}>{task.field}: {task.detail}</div>
                {task.applyHint ? <div style={helpTextStyle}>{task.applyHint}</div> : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ ...sectionStyle, display: active ? 'grid' : 'none' }}>
        <h3 style={sectionTitleStyle}>검증</h3>
        {localIssues.length === 0 ? (
          <div style={{ ...previewCardStyle, color: '#15803d', fontWeight: 800 }}>
            SEO 검사 통과
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {localIssues.map((issue) => (
              <div
                key={issue.id}
                style={{
                  ...issueTone(issue),
                  border: '1px solid',
                  borderRadius: 8,
                  padding: '9px 10px',
                  fontSize: '0.78rem',
                  lineHeight: 1.45,
                }}
              >
                <strong>{issue.severity.toUpperCase()} · {issue.field}</strong>
                <div>{issue.message}</div>
                {issue.fixHint ? <div>{issue.fixHint}</div> : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
