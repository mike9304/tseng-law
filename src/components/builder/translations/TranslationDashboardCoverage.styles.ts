import type { CSSProperties } from 'react';

export const coverageSection: CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  background: '#f8fafc',
};

export const coverageSectionHeader: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 10,
};

export const coverageHeading: CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
  color: '#0f172a',
};

export const coverageDescription: CSSProperties = {
  margin: '4px 0 0',
  fontSize: 12,
  color: '#64748b',
};

export const coverageCardGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 10,
};

export const coverageCard: CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: 12,
  background: '#fff',
};

export const coverageCardHeader: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
};

export const coverageCardLabel: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#0f172a',
};

export const coverageCardMeta: CSSProperties = {
  marginTop: 2,
  fontSize: 11,
  color: '#64748b',
};

export const coverageRate: CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: '#1e5a96',
  lineHeight: 1,
};

export const coverageRail: CSSProperties = {
  marginTop: 10,
  height: 7,
  borderRadius: 999,
  background: '#e2e8f0',
  overflow: 'hidden',
};

export const coverageFill: CSSProperties = {
  height: '100%',
  borderRadius: 999,
  background: 'linear-gradient(90deg, #2563eb 0%, #16a34a 100%)',
};

export const coverageStatusRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  marginTop: 8,
  fontSize: 12,
  color: '#475569',
};

export const coverageLocaleGrid: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginTop: 10,
};

export const coverageLocaleChip: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  border: '1px solid #cbd5e1',
  borderRadius: 999,
  padding: '3px 8px',
  fontSize: 11,
  color: '#334155',
  background: '#fff',
};

export const coverageDrillDownList: CSSProperties = {
  display: 'grid',
  gap: 6,
  marginTop: 10,
  paddingTop: 10,
  borderTop: '1px solid #e2e8f0',
};

export const coverageDrillDownItem: CSSProperties = {
  display: 'grid',
  gap: 6,
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: 8,
  background: '#f8fafc',
};

export const coverageDrillDownHeader: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 8,
  fontSize: 11,
  color: '#334155',
};

export const coverageMetricRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
};

export const coverageMetric: CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: 999,
  padding: '2px 7px',
  fontSize: 11,
  color: '#475569',
  background: '#fff',
};

export const coverageReviewLink: CSSProperties = {
  display: 'inline-flex',
  fontSize: 12,
  color: '#1e5a96',
  textDecoration: 'none',
};
