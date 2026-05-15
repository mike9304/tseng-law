import type { CSSProperties } from 'react';

export const PREVIEW_GAP_STYLE: CSSProperties = {
  height: 7,
  background: 'rgba(37, 99, 235, 0.10)',
  border: '1.5px dashed #2563eb',
  borderRadius: 3,
  margin: '3px 0',
  width: '100%',
  boxSizing: 'border-box',
  pointerEvents: 'none',
  opacity: 0.9,
  flexShrink: 0,
  flexGrow: 0,
  alignSelf: 'stretch',
  transition: 'all 0.16s cubic-bezier(0.23, 1.0, 0.32, 1)',
  boxShadow: '0 1px 2px rgba(37, 99, 235, 0.15) inset',
};
