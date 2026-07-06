import type { CSSProperties } from 'react';

export const PAGE_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(240px, 320px) minmax(0, 1fr)',
  gap: 20,
  padding: 24,
};

export const PANEL_STYLE: CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
};

export const LIST_STYLE: CSSProperties = {
  ...PANEL_STYLE,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

export const EDITOR_STYLE: CSSProperties = {
  ...PANEL_STYLE,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
};

export const TOOLBAR_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
  padding: 16,
  borderBottom: '1px solid #e2e8f0',
};

export const FIELD_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 12,
  fontWeight: 700,
  color: '#334155',
};

export const INPUT_STYLE: CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '10px 12px',
  font: 'inherit',
  color: '#0f172a',
  background: '#fff',
};

export const BUTTON_STYLE: CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#0f172a',
  fontWeight: 700,
  padding: '9px 12px',
  cursor: 'pointer',
};

export const PRIMARY_BUTTON_STYLE: CSSProperties = {
  ...BUTTON_STYLE,
  background: '#0f172a',
  color: '#fff',
  borderColor: '#0f172a',
};

export const DANGER_BUTTON_STYLE: CSSProperties = {
  ...BUTTON_STYLE,
  color: '#b91c1c',
  borderColor: '#fecaca',
};

export const CODE_STYLE: CSSProperties = {
  ...INPUT_STYLE,
  minHeight: 360,
  resize: 'vertical',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
  lineHeight: 1.5,
};
