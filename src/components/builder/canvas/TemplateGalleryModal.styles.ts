import type { CSSProperties } from 'react';
import type { PageTemplate } from '@/lib/builder/templates/types';
import { getTemplatePalette } from '@/lib/builder/templates/design-system';

export type TemplatePreviewViewportSize = {
  width: number;
  height: number;
};

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

export function getCategoryButtonStyle(active: boolean): CSSProperties {
  return {
    ...categoryButtonBase,
    borderColor: active ? '#bfdbfe' : 'transparent',
    borderLeftColor: active ? '#123b63' : 'transparent',
    background: active ? '#eff6ff' : 'transparent',
    color: active ? '#123b63' : '#475569',
  };
}

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
  marginBottom: 20,
  padding: 14,
  border: '1px solid #dbe3ef',
  borderRadius: 12,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
};

export const searchRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 12,
};

export const searchInputStyle: CSSProperties = {
  width: '100%',
  height: 42,
  boxSizing: 'border-box',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  padding: '0 14px',
  color: '#0f172a',
  fontSize: '0.92rem',
  fontWeight: 700,
  outline: 'none',
  background: '#fff',
  boxShadow: '0 1px 0 rgba(255, 255, 255, 0.7) inset',
};

export const resultCountStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 34,
  border: '1px solid #dbe3ef',
  borderRadius: 999,
  background: '#ffffff',
  padding: '0 11px',
  whiteSpace: 'nowrap',
  fontSize: '0.78rem',
  color: '#475569',
  fontWeight: 850,
};

export const filterRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  alignItems: 'center',
};

export const selectStyle: CSSProperties = {
  minWidth: 142,
  height: 38,
  border: '1px solid #d8e2ee',
  borderRadius: 9,
  background: '#ffffff',
  color: '#172033',
  fontSize: '0.78rem',
  fontWeight: 850,
  padding: '0 11px',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
};

export const resetButtonStyle: CSSProperties = {
  height: 38,
  border: '1px solid #bfd3ea',
  borderRadius: 9,
  background: '#f8fbff',
  color: '#123b63',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 800,
  padding: '0 12px',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
};

export const sectionHeaderStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
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

export function getTemplateCardFrameStyle(template: PageTemplate, hovered: boolean): CSSProperties {
  const palette = getTemplatePalette(template.paletteKey);
  return {
    ...cardStyle,
    borderColor: hovered ? palette.accent : '#dbe3ef',
    boxShadow: hovered ? `0 18px 40px ${palette.ink}22` : '0 1px 2px rgba(15, 23, 42, 0.04)',
    transform: hovered ? 'translateY(-2px)' : 'none',
  };
}

export function getTemplatePreviewButtonStyle(template: PageTemplate): CSSProperties {
  const palette = getTemplatePalette(template.paletteKey);
  return {
    display: 'block',
    width: '100%',
    height: 168,
    border: 0,
    padding: 0,
    background: palette.canvas,
    cursor: 'pointer',
    borderBottom: '1px solid #dbe3ef',
  };
}

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
  boxSizing: 'border-box',
  width: 'fit-content',
  borderRadius: 999,
  background: '#eff6ff',
  color: '#123b63',
  border: '1px solid transparent',
  padding: '3px 8px',
  fontSize: '0.68rem',
  fontWeight: 850,
  lineHeight: 1.2,
};

export function getTemplateCategoryChipStyle(template: PageTemplate): CSSProperties {
  const palette = getTemplatePalette(template.paletteKey);
  return {
    ...chipStyle,
    background: palette.accentSoft,
    borderColor: `${palette.accent}55`,
    color: palette.ink,
  };
}

export const featuredTemplateChipStyle: CSSProperties = {
  ...chipStyle,
  background: '#ecfeff',
  borderColor: '#a5f3fc',
  color: '#0e7490',
};

export const templateMetaChipStyle: CSSProperties = {
  ...chipStyle,
  background: '#f8fafc',
  borderColor: '#e2e8f0',
  color: '#475569',
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

export function getTemplateActionButtonStyle(template: PageTemplate, variant: 'preview' | 'use'): CSSProperties {
  const palette = getTemplatePalette(template.paletteKey);
  if (variant === 'use') {
    return {
      ...actionButtonBase,
      border: `1px solid ${palette.ink}`,
      background: palette.ink,
      color: palette.inverse,
    };
  }
  return {
    ...actionButtonBase,
    border: '1px solid #dbe3ef',
    background: '#ffffff',
    color: '#334155',
  };
}

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

export function getBlankCardStyle(hovered: boolean): CSSProperties {
  return {
    ...blankCardStyle,
    borderColor: hovered ? '#123b63' : '#dbe3ef',
    boxShadow: hovered ? '0 18px 38px rgba(15, 23, 42, 0.12)' : 'none',
    transform: hovered ? 'translateY(-2px)' : 'none',
  };
}

export const blankCardIconStyle: CSSProperties = {
  color: '#123b63',
  fontSize: '2rem',
  lineHeight: 1,
};

export const blankCardDescriptionStyle: CSSProperties = {
  ...descriptionStyle,
  minHeight: 0,
  textAlign: 'center',
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

export const previewToolbarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 6,
  padding: '10px 12px',
};

export function getPreviewViewportButtonStyle(template: PageTemplate, active: boolean): CSSProperties {
  const palette = getTemplatePalette(template.paletteKey);
  return {
    minHeight: 34,
    border: `1px solid ${active ? palette.ink : '#dbe3ef'}`,
    borderRadius: 8,
    background: active ? palette.ink : '#ffffff',
    color: active ? palette.inverse : '#475569',
    cursor: 'pointer',
    fontSize: '0.72rem',
    fontWeight: 850,
    padding: '0 12px',
    boxShadow: active ? `0 8px 18px ${palette.ink}24` : 'none',
    transition: 'background 140ms ease, border-color 140ms ease, box-shadow 140ms ease',
  };
}

export const previewPanelBodyStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 300px',
  minHeight: 0,
  overflow: 'hidden',
};

export const previewCanvasPaneStyle: CSSProperties = {
  minWidth: 0,
  padding: 28,
  background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 54%, #e2e8f0 100%)',
  overflow: 'auto',
};

export const previewCanvasCenterStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%',
};

export function getPreviewViewportFrameStyle(size: TemplatePreviewViewportSize): CSSProperties {
  return {
    width: size.width,
    maxWidth: '100%',
    height: size.height,
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 20px 44px rgba(15, 23, 42, 0.16), 0 1px 0 rgba(255, 255, 255, 0.72) inset',
  };
}

export const previewDetailAsideStyle: CSSProperties = {
  display: 'grid',
  alignContent: 'start',
  gap: 16,
  padding: 20,
  borderLeft: '1px solid #e2e8f0',
  background: '#ffffff',
};

export function getPreviewQualityChipStyle(template: PageTemplate): CSSProperties {
  const palette = getTemplatePalette(template.paletteKey);
  return {
    ...chipStyle,
    marginBottom: 8,
    background: palette.accentSoft,
    color: palette.ink,
  };
}

export const previewTitleStyle: CSSProperties = {
  margin: 0,
  color: '#0f172a',
  fontSize: '1.1rem',
  lineHeight: 1.25,
};

export const previewDescriptionStyle: CSSProperties = {
  margin: '8px 0 0',
  color: '#64748b',
  fontSize: '0.82rem',
  lineHeight: 1.5,
};

export const previewDefinitionListStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
  margin: 0,
  color: '#475569',
  fontSize: '0.78rem',
};

export const previewDefinitionLabelStyle: CSSProperties = {
  fontWeight: 850,
};

export const previewDefinitionValueStyle: CSSProperties = {
  margin: 0,
};

export const previewTagChipStyle: CSSProperties = {
  ...templateMetaChipStyle,
};
