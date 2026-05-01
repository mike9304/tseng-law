'use client';

import { useMemo, type CSSProperties } from 'react';
import type { BuiltInSectionTemplate } from '@/lib/builder/sections/templates';
import { buildSavedSectionThumbnailSvg } from '@/lib/builder/sections/thumbnail';

const cardButtonStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
  padding: 8,
  border: '1px solid #dbe4ee',
  borderRadius: 10,
  background: '#ffffff',
  boxShadow: '0 4px 10px rgba(15, 23, 42, 0.04)',
  cursor: 'pointer',
  textAlign: 'left',
};

const thumbnailStyle: CSSProperties = {
  width: '100%',
  height: 70,
  overflow: 'hidden',
  borderRadius: 6,
  background: '#f8fafc',
};

const nameStyle: CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#0f172a',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const descriptionStyle: CSSProperties = {
  minHeight: 28,
  fontSize: '0.68rem',
  lineHeight: 1.35,
  color: '#64748b',
};

const metaStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  width: 'fit-content',
  padding: '1px 6px',
  borderRadius: 999,
  background: '#eef2ff',
  color: '#3730a3',
  fontSize: '0.64rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

export function SectionTemplateCard({
  template,
  onClick,
}: {
  template: BuiltInSectionTemplate;
  onClick: () => void;
}) {
  const svg = useMemo(
    () => buildSavedSectionThumbnailSvg(template.nodes, template.rootNodeId, 200, 70),
    [template.nodes, template.rootNodeId],
  );

  return (
    <button
      type="button"
      style={cardButtonStyle}
      title={`${template.name} 섹션 추가`}
      onClick={onClick}
    >
      <div
        style={thumbnailStyle}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <span style={nameStyle}>{template.name}</span>
      <span style={descriptionStyle}>{template.description}</span>
      <span style={metaStyle}>{template.thumbnailHint ?? template.category}</span>
    </button>
  );
}
