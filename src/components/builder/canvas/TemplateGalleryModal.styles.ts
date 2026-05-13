import type { CSSProperties } from 'react';
import type { PageTemplate } from '@/lib/builder/templates/types';
import { getTemplatePalette } from '@/lib/builder/templates/design-system';

export const bodyStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '230px minmax(0, 1fr)',
  flex: 1,
  minHeight: 0,
};

export const sidebarStyle: CSSProperties = {
  borderRight: '1px solid #dbe3ef',
  background: '#ffffff',
  padding: '16px 12px',
  overflowY: 'auto',
};

export const categoryButtonBase: CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '26px minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 8,
  border: '1px solid transparent',
  borderLeft: '4px solid transparent',
  borderRadius: 8,
  background: 'transparent',
  color: '#475569',
  padding: '8px 9px 8px 7px',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: '0.82rem',
  fontWeight: 750,
};

export const categoryCountStyle: CSSProperties = {
  color: '#94a3b8',
  fontSize: '0.72rem',
  fontWeight: 850,
};

export const contentStyle: CSSProperties = {
  minWidth: 0,
  minHeight: 0,
  padding: 22,
  overflowY: 'auto',
};

export const toolbarStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  marginBottom: 18,
};

export const searchRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 14,
};

export const searchInputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  padding: '11px 13px',
  color: '#0f172a',
  fontSize: '0.92rem',
  outline: 'none',
  background: '#fff',
};

export const resultCountStyle: CSSProperties = {
  whiteSpace: 'nowrap',
  fontSize: '0.78rem',
  color: '#64748b',
  fontWeight: 750,
};

export const filterRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
};

export const selectStyle: CSSProperties = {
  minWidth: 132,
  height: 36,
  border: '1px solid #cbd5e1',
  borderRadius: 9,
  background: '#ffffff',
  color: '#172033',
  fontSize: '0.78rem',
  fontWeight: 750,
  padding: '0 10px',
};

export const resetButtonStyle: CSSProperties = {
  height: 36,
  border: '1px solid #dbe3ef',
  borderRadius: 9,
  background: '#ffffff',
  color: '#475569',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 800,
  padding: '0 12px',
};

export const sectionHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  margin: '0 0 12px',
};

export const sectionTitleStyle: CSSProperties = {
  margin: 0,
  color: '#0f172a',
  fontSize: '0.98rem',
  fontWeight: 850,
};

export const cardStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  border: '1px solid #dbe3ef',
  borderRadius: 12,
  background: '#fff',
  overflow: 'hidden',
  textAlign: 'left',
  transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
};

export const cardBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
  padding: '13px 14px 14px',
};

export const cardTitleStyle: CSSProperties = {
  fontSize: '0.96rem',
  fontWeight: 850,
  color: '#0f172a',
  lineHeight: 1.25,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const descriptionStyle: CSSProperties = {
  color: '#64748b',
  fontSize: '0.78rem',
  lineHeight: 1.45,
  minHeight: 36,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

export const badgeRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 5,
  alignItems: 'center',
};

export const chipStyle: CSSProperties = {
  width: 'fit-content',
  borderRadius: 999,
  background: '#eff6ff',
  color: '#123b63',
  padding: '3px 8px',
  fontSize: '0.68rem',
  fontWeight: 850,
};

export const metaStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  color: '#64748b',
  fontSize: '0.7rem',
  fontWeight: 750,
};

export const actionRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  padding: '0 14px 14px',
};

export const actionButtonBase: CSSProperties = {
  minHeight: 36,
  borderRadius: 9,
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: 850,
};

export const emptyStateStyle: CSSProperties = {
  padding: 36,
  border: '1px dashed #cbd5e1',
  borderRadius: 12,
  background: '#fff',
  color: '#64748b',
  textAlign: 'center',
  fontSize: '0.9rem',
};

export const blankCardStyle: CSSProperties = {
  ...cardStyle,
  minHeight: 304,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
  padding: 22,
  background: '#ffffff',
};

export function getQualityBadgeStyle(template: PageTemplate): CSSProperties {
  if (template.qualityTier === 'premium') {
    const palette = getTemplatePalette(template.paletteKey);
    return { ...chipStyle, background: palette.ink, color: palette.inverse };
  }
  if (template.qualityTier === 'under-review') return { ...chipStyle, background: '#fff7ed', color: '#9a3412' };
  if (template.qualityTier === 'draft') return { ...chipStyle, background: '#f1f5f9', color: '#64748b' };
  return { ...chipStyle, background: '#f8fafc', color: '#475569' };
}
