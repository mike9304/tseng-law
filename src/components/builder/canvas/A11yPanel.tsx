'use client';

import { useMemo } from 'react';
import {
  checkAccessibility,
  type A11yIssue,
  type A11ySeverity,
} from '@/lib/builder/a11y/a11y-checker';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';

/* ── Styles ─────────────────────────────────────────────────────── */

const panelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 8,
};

const summaryStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: 700,
  padding: '6px 10px',
  borderRadius: 8,
  background: '#f1f5f9',
  color: '#334155',
};

const passStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '16px 12px',
  borderRadius: 10,
  background: '#f0fdf4',
  color: '#166534',
  fontSize: '0.88rem',
  fontWeight: 600,
};

const issueCardBase: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid transparent',
  cursor: 'pointer',
  fontSize: '0.8rem',
  transition: 'background 120ms ease',
};

function issueCardStyle(severity: A11ySeverity): React.CSSProperties {
  const colors: Record<A11ySeverity, { bg: string; border: string }> = {
    error: { bg: '#fef2f2', border: '#fecaca' },
    warning: { bg: '#fffbeb', border: '#fde68a' },
    info: { bg: '#eff6ff', border: '#bfdbfe' },
  };
  const c = colors[severity];
  return {
    ...issueCardBase,
    background: c.bg,
    borderColor: c.border,
  };
}

const severityIcon: Record<A11ySeverity, string> = {
  error: '\u{1F534}',
  warning: '\u{1F7E1}',
  info: '\u2139\uFE0F',
};

const issueHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontWeight: 600,
  fontSize: '0.82rem',
};

const suggestionStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#64748b',
  marginTop: 2,
};

/* ── Component ──────────────────────────────────────────────────── */

export default function A11yPanel() {
  const document = useBuilderCanvasStore((s) => s.document);
  const setSelectedNodeId = useBuilderCanvasStore((s) => s.setSelectedNodeId);

  const issues: A11yIssue[] = useMemo(() => {
    if (!document) return [];
    return checkAccessibility(document);
  }, [document]);

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  return (
    <div style={panelStyle}>
      {issues.length === 0 ? (
        <div style={passStyle}>
          <span style={{ fontSize: '1.2rem' }}>{'\u2705'}</span>
          <span>접근성 검사 통과!</span>
        </div>
      ) : (
        <>
          <div style={summaryStyle}>
            이슈 {issues.length}개
            {errorCount > 0 ? ` (오류 ${errorCount})` : ''}
            {warningCount > 0 ? ` (경고 ${warningCount})` : ''}
            {infoCount > 0 ? ` (정보 ${infoCount})` : ''}
          </div>
          {issues.map((issue, idx) => (
            <button
              key={`${issue.nodeId}-${issue.rule}-${idx}`}
              type="button"
              style={issueCardStyle(issue.severity)}
              onClick={() => {
                if (issue.nodeId) {
                  setSelectedNodeId(issue.nodeId);
                }
              }}
            >
              <div style={issueHeaderStyle}>
                <span>{severityIcon[issue.severity]}</span>
                <span>{issue.message}</span>
              </div>
              {issue.suggestion ? (
                <div style={suggestionStyle}>{issue.suggestion}</div>
              ) : null}
              {issue.nodeId ? (
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {issue.nodeKind} &middot; {issue.nodeId}
                </div>
              ) : null}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
