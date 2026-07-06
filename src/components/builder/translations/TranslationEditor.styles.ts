import type React from 'react';

export const editorToolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 16,
  flexWrap: 'wrap',
};

export const sectionPanelStyle: React.CSSProperties = {
  marginBottom: 24,
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: 16,
  background: '#f8fafc',
};

export const sectionHeading: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#1f2937',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  margin: '0 0 12px',
};

export const twoCol: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

export const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  marginBottom: 10,
};

export const labelText: React.CSSProperties = {
  fontSize: 11,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  padding: '8px 10px',
  fontSize: 13,
  fontFamily: 'inherit',
  background: '#fff',
};

export const inputReadOnly: React.CSSProperties = {
  ...inputStyle,
  background: '#f1f5f9',
  color: '#475569',
};

export const readOnlyBlock: React.CSSProperties = {
  fontSize: 13,
  color: '#1f2937',
  background: '#f1f5f9',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  padding: '8px 10px',
  whiteSpace: 'pre-wrap',
  minHeight: 36,
};

export const btnPrimary: React.CSSProperties = {
  fontSize: 13,
  padding: '8px 14px',
  borderRadius: 6,
  border: '1px solid #123b63',
  background: '#123b63',
  color: '#fff',
  cursor: 'pointer',
};

export const btnSecondary: React.CSSProperties = {
  fontSize: 13,
  padding: '8px 14px',
  borderRadius: 6,
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#1f2937',
  cursor: 'pointer',
};

export const statusSuccessStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#166534',
};

export const statusErrorStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#991b1b',
};

export const statusWarningStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#9a3412',
};
