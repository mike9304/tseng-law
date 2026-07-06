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
} satisfies CSSProperties;

export const helperStyle = {
  color: '#64748b',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.45,
} satisfies CSSProperties;

export const previewStyle = {
  alignItems: 'center',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  display: 'grid',
  gap: 12,
  gridTemplateColumns: '72px minmax(0, 1fr)',
  padding: 14,
} satisfies CSSProperties;

export const previewImageStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  height: 72,
  objectFit: 'cover',
  width: 72,
} satisfies CSSProperties;
