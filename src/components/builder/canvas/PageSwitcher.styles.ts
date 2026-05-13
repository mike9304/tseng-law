import type { CSSProperties } from 'react';

export const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '8px 0',
};

export const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 8px',
  marginBottom: 4,
};

export const headerLabelStyle: CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
};

export const addButtonStyle: CSSProperties = {
  padding: '2px 10px',
  fontSize: '0.75rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

export function pageRowStyle(active: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '2px 6px',
    borderRadius: 8,
    border: active ? '1px solid #123b63' : '1px solid transparent',
    background: active ? '#eff6ff' : 'transparent',
    transition: 'background 150ms ease, border-color 150ms ease',
    position: 'relative',
  };
}

export function pageButtonStyle(active: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    flex: 1,
    padding: '6px 4px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: active ? 600 : 400,
    color: active ? '#123b63' : '#334155',
    textAlign: 'left',
  };
}

export const moreButtonBaseStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: 'none',
  background: 'transparent',
  color: '#64748b',
  cursor: 'pointer',
  fontSize: '1rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 120ms ease, background 120ms ease',
};

export const menuStyle: CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: 6,
  minWidth: 120,
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.16)',
  padding: 4,
  zIndex: 30,
};

export function menuItemStyle(destructive = false, disabled = false): CSSProperties {
  return {
    width: '100%',
    padding: '8px 10px',
    border: 'none',
    borderRadius: 8,
    background: 'transparent',
    color: disabled ? '#94a3b8' : destructive ? '#b91c1c' : '#334155',
    fontSize: '0.8rem',
    fontWeight: 500,
    textAlign: 'left',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

export const editContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
  padding: '8px 6px',
};

export const editInputStyle: CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: '0.82rem',
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
};

export const editHintStyle: CSSProperties = {
  fontSize: '0.72rem',
  color: '#64748b',
};

export const statusMessageStyle: CSSProperties = {
  padding: '0 8px 4px',
  fontSize: '0.75rem',
  color: '#b91c1c',
};

export const emptyStateStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
  margin: '4px 8px',
  padding: 12,
  border: '1px dashed #cbd5e1',
  borderRadius: 10,
  background: '#f8fafc',
  color: '#334155',
};

export const emptyStateTitleStyle: CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: 800,
  color: '#0f172a',
};

export const emptyStateCopyStyle: CSSProperties = {
  fontSize: '0.73rem',
  lineHeight: 1.45,
  color: '#64748b',
};

export const titleTextStyle: CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const homeBadgeStyle: CSSProperties = {
  fontSize: '0.65rem',
  color: '#123b63',
  fontWeight: 700,
};

export const actionDotsStyle: CSSProperties = {
  fontSize: '0.9rem',
  lineHeight: 1,
};

export const slugStyle: CSSProperties = {
  fontSize: '0.7rem',
  color: '#475569',
  marginLeft: 'auto',
  flexShrink: 0,
};

export const statusDotStyle = (published: boolean): CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: published ? '#22c55e' : '#e2e8f0',
  flexShrink: 0,
});

export const clipboardPillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: 6,
  minHeight: 24,
  margin: '0 8px 8px',
  padding: '0 9px',
  border: '1px solid #bfdbfe',
  borderRadius: 999,
  background: '#eff6ff',
  color: '#1d4ed8',
  fontSize: '0.72rem',
  fontWeight: 800,
};

export const columnsQuickCardStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 8,
  margin: '0 8px 10px',
  padding: 10,
  border: '1px solid #bfdbfe',
  borderRadius: 10,
  background: '#eff6ff',
  color: '#0f172a',
};

export const columnsQuickTitleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  fontSize: '0.8rem',
  fontWeight: 800,
};

export const columnsQuickMetaStyle: CSSProperties = {
  color: '#475569',
  fontSize: '0.72rem',
  fontWeight: 600,
};

export const columnsQuickActionsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 6,
};

export const columnsQuickButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 30,
  padding: '0 8px',
  border: '1px solid #93c5fd',
  borderRadius: 8,
  background: '#fff',
  color: '#1d4ed8',
  fontSize: '0.73rem',
  fontWeight: 800,
  textDecoration: 'none',
  cursor: 'pointer',
};
