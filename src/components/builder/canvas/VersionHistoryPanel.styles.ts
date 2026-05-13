import type { CSSProperties } from 'react';

export const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 21000,
  background: 'rgba(15, 23, 42, 0.45)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fadeIn 150ms ease',
};

export const panelStyle: CSSProperties = {
  width: 720,
  maxWidth: '95vw',
  maxHeight: '85vh',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 24px 64px rgba(15, 23, 42, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: 'fadeIn 180ms ease',
};

export const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid #e2e8f0',
};

export const titleStyle: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#0f172a',
};

export const closeBtnStyle: CSSProperties = {
  padding: '4px 12px',
  fontSize: '0.78rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#64748b',
  cursor: 'pointer',
};

export const bodyStyle: CSSProperties = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  minHeight: 0,
};

export const timelineStyle: CSSProperties = {
  position: 'relative',
  borderRight: '1px solid #e2e8f0',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '16px 14px 16px 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  background: '#f8fafc',
};

export const timelineRailStyle: CSSProperties = {
  position: 'absolute',
  top: 22,
  bottom: 22,
  left: 16,
  width: 2,
  borderRadius: 999,
  background: '#dbe2ea',
};

export const previewStyle: CSSProperties = {
  padding: '16px 20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

export function timelineItemStyle(active: boolean): CSSProperties {
  return {
    position: 'relative',
    padding: '12px 12px',
    borderRadius: 10,
    border: active ? '1px solid #116dff' : '1px solid #e2e8f0',
    background: active ? '#eff6ff' : '#fff',
    cursor: 'pointer',
    transition: 'background 120ms ease, border-color 120ms ease',
    boxShadow: active ? '0 8px 22px rgba(17, 109, 255, 0.12)' : '0 1px 2px rgba(15, 23, 42, 0.04)',
  };
}

export function timelineDotStyle(active: boolean): CSSProperties {
  return {
    position: 'absolute',
    top: 17,
    left: -19,
    width: 10,
    height: 10,
    borderRadius: 999,
    border: active ? '2px solid #116dff' : '2px solid #94a3b8',
    background: active ? '#fff' : '#f8fafc',
    boxShadow: '0 0 0 3px #f8fafc',
  };
}

export const dateStyle: CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: 600,
  color: '#0f172a',
};

export const metaStyle: CSSProperties = {
  fontSize: '0.72rem',
  color: '#64748b',
  marginTop: 2,
};

export const summaryStyle: CSSProperties = {
  marginTop: 7,
  color: '#334155',
  fontSize: '0.75rem',
  fontWeight: 650,
};

export const revisionCardFooterStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  marginTop: 10,
};

export const inlineRestoreButtonStyle: CSSProperties = {
  padding: '4px 10px',
  border: '1px solid #c7d2fe',
  borderRadius: 7,
  background: '#fff',
  color: '#1d4ed8',
  fontSize: '0.72rem',
  fontWeight: 750,
  cursor: 'pointer',
};

export const diffPreviewChipStyle: CSSProperties = {
  position: 'absolute',
  right: 10,
  top: 10,
  padding: '4px 8px',
  borderRadius: 999,
  background: '#0f172a',
  color: '#fff',
  fontSize: '0.68rem',
  fontWeight: 750,
  boxShadow: '0 10px 22px rgba(15, 23, 42, 0.2)',
  pointerEvents: 'none',
};

export const sourceBadgeStyle = (source?: string): CSSProperties => {
  let bg = '#e2e8f0';
  let fg = '#475569';
  if (source === 'publish') {
    bg = '#dcfce7';
    fg = '#166534';
  } else if (source === 'rollback-backup') {
    bg = '#fef3c7';
    fg = '#92400e';
  } else if (source === 'manual') {
    bg = '#dbeafe';
    fg = '#1e40af';
  }
  return {
    display: 'inline-block',
    padding: '1px 6px',
    fontSize: '0.66rem',
    fontWeight: 700,
    borderRadius: 4,
    background: bg,
    color: fg,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };
};

export const restoreBtnStyle: CSSProperties = {
  padding: '6px 14px',
  fontSize: '0.8rem',
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  background: '#116dff',
  color: '#fff',
  cursor: 'pointer',
};

export const restoreBtnDisabledStyle: CSSProperties = {
  ...restoreBtnStyle,
  background: '#94a3b8',
  cursor: 'not-allowed',
};

export const diffStatStyle: CSSProperties = {
  display: 'flex',
  gap: 14,
  padding: '10px 12px',
  borderRadius: 10,
  background: '#f1f5f9',
  border: '1px solid #e2e8f0',
  fontSize: '0.82rem',
  fontWeight: 600,
};

export const confirmOverlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(255,255,255,0.95)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  borderRadius: 16,
  zIndex: 1,
};

export const confirmTextStyle: CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#0f172a',
  textAlign: 'center',
};

export const confirmBtnRow: CSSProperties = {
  display: 'flex',
  gap: 8,
};

export const cancelBtnStyle: CSSProperties = {
  padding: '6px 16px',
  fontSize: '0.8rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

export const confirmRestoreBtnStyle: CSSProperties = {
  padding: '6px 16px',
  fontSize: '0.8rem',
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  background: '#116dff',
  color: '#fff',
  cursor: 'pointer',
};

export const sectionHeading: CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  margin: '6px 0',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

export const diffListStyle: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

export function diffItemStyle(kind: 'add' | 'remove' | 'modify'): CSSProperties {
  const base: CSSProperties = {
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: '0.78rem',
    border: '1px solid',
  };
  if (kind === 'add') return { ...base, background: '#f0fdf4', borderColor: '#86efac', color: '#166534' };
  if (kind === 'remove') return { ...base, background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b' };
  return { ...base, background: '#fefce8', borderColor: '#fde68a', color: '#854d0e' };
}

export const codeStyle: CSSProperties = {
  background: 'rgba(0,0,0,0.06)',
  padding: '1px 4px',
  borderRadius: 4,
  fontSize: '0.74rem',
  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
};
