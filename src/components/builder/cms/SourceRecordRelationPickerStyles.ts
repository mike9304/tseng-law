import type { CSSProperties } from 'react';

export const fieldsetStyle = {
  border: 0,
  color: 'var(--editor-fg-primary, #0f172a)',
  display: 'grid',
  fontSize: 12,
  fontWeight: 800,
  gap: 4,
  letterSpacing: 0,
  margin: 0,
  minWidth: 0,
  padding: 0,
} satisfies CSSProperties;

export const inputStyle = {
  border: '1px solid rgba(148, 163, 184, 0.35)',
  borderRadius: 8,
  color: 'var(--editor-fg-primary, #0f172a)',
  font: 'inherit',
  fontSize: 13,
  minWidth: 0,
  padding: '8px 10px',
} satisfies CSSProperties;

export const helperTextStyle = {
  color: 'var(--editor-fg-muted, #64748b)',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0,
  overflowWrap: 'anywhere',
} satisfies CSSProperties;

export const searchRowStyle = {
  alignItems: 'center',
  display: 'grid',
  gap: 8,
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  minWidth: 0,
} satisfies CSSProperties;

export const utilityButtonStyle = {
  background: 'var(--editor-panel, #ffffff)',
  border: '1px solid rgba(148, 163, 184, 0.42)',
  borderRadius: 8,
  color: 'var(--editor-fg-primary, #0f172a)',
  font: 'inherit',
  fontSize: 12,
  fontWeight: 800,
  minBlockSize: 36,
  padding: '0 10px',
} satisfies CSSProperties;

export const selectedOnlyStyle = {
  alignItems: 'center',
  display: 'inline-flex',
  gap: 6,
  minWidth: 0,
} satisfies CSSProperties;

export const relationActionsStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  justifyContent: 'space-between',
  minWidth: 0,
} satisfies CSSProperties;

export const bulkActionsStyle = {
  alignItems: 'center',
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: 6,
  minWidth: 0,
} satisfies CSSProperties;

export const undoButtonStyle = {
  ...utilityButtonStyle,
  background: 'rgba(17, 109, 255, 0.08)',
  border: '1px solid rgba(17, 109, 255, 0.28)',
  color: 'var(--editor-accent, #116dff)',
} satisfies CSSProperties;

export const selectedColumnsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  minWidth: 0,
} satisfies CSSProperties;

export const selectedColumnChipStyle = {
  alignItems: 'center',
  background: 'rgba(17, 109, 255, 0.08)',
  border: '1px solid rgba(17, 109, 255, 0.22)',
  borderRadius: 999,
  color: 'var(--editor-fg-primary, #0f172a)',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 800,
  gap: 6,
  maxWidth: '100%',
  minWidth: 0,
  padding: '4px 4px 4px 8px',
} satisfies CSSProperties;

export const selectedColumnTitleStyle = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} satisfies CSSProperties;

export const removeSelectedColumnStyle = {
  alignItems: 'center',
  background: 'var(--editor-panel, #ffffff)',
  border: '1px solid rgba(148, 163, 184, 0.42)',
  borderRadius: 999,
  color: 'var(--editor-fg-muted, #64748b)',
  display: 'inline-flex',
  font: 'inherit',
  fontSize: 11,
  fontWeight: 900,
  inlineSize: 20,
  justifyContent: 'center',
  lineHeight: 1,
  minInlineSize: 20,
  padding: 0,
} satisfies CSSProperties;

export const relationListStyle = {
  border: '1px solid rgba(148, 163, 184, 0.28)',
  borderRadius: 8,
  maxHeight: 180,
  minWidth: 0,
  overflowY: 'auto',
  padding: 8,
  position: 'relative',
} satisfies CSSProperties;

export const columnRowStyle = {
  alignItems: 'start',
  display: 'grid',
  gap: 8,
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  minWidth: 0,
} satisfies CSSProperties;

export const virtualColumnListSpacerStyle = {
  minWidth: 0,
  position: 'relative',
} satisfies CSSProperties;

export const virtualColumnRowStyle = {
  ...columnRowStyle,
  alignItems: 'center',
  blockSize: 64,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
} satisfies CSSProperties;

export const columnTextStyle = {
  minWidth: 0,
  overflow: 'hidden',
} satisfies CSSProperties;

export const columnTitleStyle = {
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} satisfies CSSProperties;

export const columnSlugStyle = {
  ...helperTextStyle,
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} satisfies CSSProperties;

export const checkboxStyle = {
  blockSize: 16,
  inlineSize: 16,
  justifySelf: 'start',
  margin: '2px 0 0',
} satisfies CSSProperties;
