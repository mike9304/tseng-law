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
};

export const panelStyle: CSSProperties = {
  width: 760,
  maxWidth: '94vw',
  maxHeight: '88vh',
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 24px 64px rgba(15, 23, 42, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

export const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '16px 20px',
  borderBottom: '1px solid #e2e8f0',
};

export const formStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px 20px',
  display: 'grid',
  gap: 14,
};

export const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 14,
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#fff',
};

export const twoColumnStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: 12,
};

export const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
};

export const labelStyle: CSSProperties = {
  fontSize: '0.77rem',
  fontWeight: 700,
  color: '#334155',
};

export const helpTextStyle: CSSProperties = {
  fontSize: '0.73rem',
  color: '#64748b',
  lineHeight: 1.45,
};

export const inputStyle: CSSProperties = {
  padding: '8px 10px',
  border: '1px solid #dbe2ea',
  borderRadius: 8,
  fontSize: '0.84rem',
  color: '#0f172a',
  outline: 'none',
};

export const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: 86,
  resize: 'vertical',
  fontFamily: 'inherit',
};

export const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.86rem',
  fontWeight: 800,
  color: '#0f172a',
};

export const footerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 20px',
  borderTop: '1px solid #e2e8f0',
};

export const ghostButtonStyle: CSSProperties = {
  padding: '8px 14px',
  fontSize: '0.82rem',
  fontWeight: 700,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

export const primaryButtonStyle: CSSProperties = {
  padding: '8px 16px',
  fontSize: '0.82rem',
  fontWeight: 800,
  border: 'none',
  borderRadius: 8,
  background: '#123b63',
  color: '#fff',
  cursor: 'pointer',
};

export const previewCardStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
  padding: 12,
  border: '1px solid #dbe2ea',
  borderRadius: 8,
  background: '#f8fafc',
};

export const checkboxGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
  gap: 8,
};

export const checkboxRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  padding: '9px 10px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#f8fafc',
  fontSize: '0.78rem',
  color: '#334155',
};

export const formActionsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 8,
  alignItems: 'center',
};

export const tabBarStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  padding: '10px 20px',
  borderBottom: '1px solid #e2e8f0',
  background: '#f8fafc',
};

export const tabButtonStyle = (active: boolean): CSSProperties => ({
  border: '1px solid',
  borderColor: active ? '#123b63' : '#cbd5e1',
  borderRadius: 8,
  background: active ? '#123b63' : '#fff',
  color: active ? '#fff' : '#334155',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 800,
  padding: '7px 10px',
});
