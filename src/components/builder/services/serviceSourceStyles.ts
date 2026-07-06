import type { CSSProperties } from 'react';

export const panelStyle = {
  alignItems: 'start',
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
} satisfies CSSProperties;

export const listStyle = {
  display: 'grid',
  gap: 8,
} satisfies CSSProperties;

export const formGridStyle = {
  display: 'grid',
  gap: 12,
} satisfies CSSProperties;

export const inputStyle = {
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: 13,
  minWidth: 0,
  padding: '9px 10px',
  width: '100%',
} satisfies CSSProperties;

export const textareaStyle = {
  ...inputStyle,
  minHeight: 118,
  resize: 'vertical',
} satisfies CSSProperties;

export const labelStyle = {
  color: '#475569',
  display: 'grid',
  fontSize: 12,
  fontWeight: 700,
  gap: 6,
  minWidth: 0,
} satisfies CSSProperties;

export const helperStyle = {
  color: '#64748b',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.45,
  overflowWrap: 'anywhere',
} satisfies CSSProperties;
