import type { CSSProperties } from 'react';

export type PreflightTone = 'ok' | 'warning' | 'blocker';

export const sectionTitleStyle: CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  margin: '16px 0 6px',
};

export const checklistGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 8,
  marginTop: 12,
};

export function checklistCardStyle(tone: PreflightTone): CSSProperties {
  const palette = tone === 'blocker'
    ? { background: '#fef2f2', border: '#fca5a5', color: '#991b1b' }
    : tone === 'warning'
      ? { background: '#fffbeb', border: '#fde68a', color: '#92400e' }
      : { background: '#f0fdf4', border: '#86efac', color: '#166534' };
  return {
    minHeight: 78,
    padding: '10px 12px',
    borderRadius: 10,
    border: `1px solid ${palette.border}`,
    background: palette.background,
    color: palette.color,
  };
}

export const checklistLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  fontSize: '0.8rem',
  fontWeight: 800,
};

export const checklistDetailStyle: CSSProperties = {
  marginTop: 6,
  fontSize: '0.72rem',
  lineHeight: 1.35,
  opacity: 0.82,
};

export const checklistStatusStyle: CSSProperties = {
  flexShrink: 0,
  padding: '2px 7px',
  borderRadius: 999,
  background: 'rgba(255,255,255,0.68)',
  fontSize: '0.66rem',
  fontWeight: 850,
};

export const listStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

export function severityBoxStyle(sev: 'blocker' | 'warning' | 'info'): CSSProperties {
  if (sev === 'blocker') {
    return {
      padding: '8px 12px',
      borderRadius: 8,
      background: '#fef2f2',
      color: '#991b1b',
      fontSize: '0.82rem',
      border: '1px solid #fca5a5',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    };
  }
  if (sev === 'warning') {
    return {
      padding: '8px 12px',
      borderRadius: 8,
      background: '#fffbeb',
      color: '#92400e',
      fontSize: '0.82rem',
      border: '1px solid #fde68a',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    };
  }
  return {
    padding: '8px 12px',
    borderRadius: 8,
    background: '#eff6ff',
    color: '#1e40af',
    fontSize: '0.82rem',
    border: '1px solid #bfdbfe',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  };
}

export const fixButtonStyle: CSSProperties = {
  flexShrink: 0,
  padding: '4px 10px',
  fontSize: '0.72rem',
  fontWeight: 600,
  border: '1px solid currentColor',
  background: 'rgba(255,255,255,0.7)',
  color: 'inherit',
  borderRadius: 6,
  cursor: 'pointer',
};

export const successBoxStyle: CSSProperties = {
  padding: '14px 16px',
  borderRadius: 10,
  background: '#f0fdf4',
  border: '1px solid #86efac',
  color: '#166534',
  fontSize: '0.88rem',
  fontWeight: 500,
  textAlign: 'center',
};

export const buttonRowStyle: CSSProperties = {
  display: 'flex',
  gap: 10,
  justifyContent: 'flex-end',
  marginTop: 20,
  flexWrap: 'wrap',
};

export const cancelButtonStyle: CSSProperties = {
  padding: '8px 18px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
};

export const publishWarnButtonStyle: CSSProperties = {
  padding: '8px 16px',
  borderRadius: 8,
  border: '1px solid #f59e0b',
  background: '#fff',
  color: '#92400e',
  fontSize: '0.82rem',
  fontWeight: 600,
  cursor: 'pointer',
};

export function publishButtonStyle(enabled: boolean): CSSProperties {
  return {
    padding: '8px 20px',
    borderRadius: 8,
    border: 'none',
    background: enabled ? '#123b63' : '#94a3b8',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.6,
  };
}

export const schedulePanelStyle: CSSProperties = {
  marginTop: 16,
  padding: 12,
  borderRadius: 10,
  border: '1px solid #dbeafe',
  background: '#eff6ff',
  display: 'grid',
  gap: 8,
};

export const publishDiffPanelStyle: CSSProperties = {
  marginTop: 16,
  padding: 12,
  borderRadius: 10,
  border: '1px solid #c7d2fe',
  background: '#f8fafc',
  display: 'grid',
  gap: 10,
};

export const publishDiffStatRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 8,
};

export const publishDiffStatStyle = (color: string): CSSProperties => ({
  padding: '4px 8px',
  borderRadius: 999,
  background: '#fff',
  border: '1px solid #e2e8f0',
  color,
  fontSize: '0.72rem',
  fontWeight: 850,
});

export const publishDiffListStyle: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: 4,
};

export const publishDiffItemStyle: CSSProperties = {
  padding: '6px 8px',
  borderRadius: 7,
  background: '#fff',
  border: '1px solid #e2e8f0',
  color: '#334155',
  fontSize: '0.74rem',
  lineHeight: 1.35,
};

export const scheduleRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const scheduleInputStyle: CSSProperties = {
  flex: '1 1 190px',
  minWidth: 0,
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #bfdbfe',
  background: '#fff',
  color: '#0f172a',
  fontSize: '0.82rem',
};

export const scheduleButtonStyle: CSSProperties = {
  padding: '8px 14px',
  borderRadius: 8,
  border: '1px solid #2563eb',
  background: '#fff',
  color: '#1d4ed8',
  fontSize: '0.82rem',
  fontWeight: 700,
  cursor: 'pointer',
};
