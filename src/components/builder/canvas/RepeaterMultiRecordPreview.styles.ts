import type { CSSProperties } from 'react';

export const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 20,
  borderRadius: 14,
  border: '1px solid var(--editor-border-hairline)',
  background: 'var(--editor-panel)',
  boxShadow: 'var(--editor-shadow-panel)',
};

export const emptyContainerStyle: CSSProperties = {
  ...containerStyle,
  alignItems: 'flex-start',
};

export const loadingContainerStyle: CSSProperties = {
  ...containerStyle,
  alignItems: 'stretch',
};

export const headerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

export const headingStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
  color: 'var(--editor-fg-primary)',
  fontWeight: 600,
};

export const descriptionStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: 'var(--editor-fg-secondary)',
};

export const metaStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--editor-fg-muted)',
};

export const emptyMessageStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: 'var(--editor-fg-secondary)',
};

export const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
  gap: 12,
};

export const skeletonGridStyle: CSSProperties = {
  ...gridStyle,
  opacity: 0.9,
};

export const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  margin: 0,
  width: '100%',
  borderRadius: 12,
  border: '1px solid var(--editor-border-hairline)',
  background: 'var(--editor-bg)',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  textAlign: 'left',
  font: 'inherit',
};

export const cardActiveStyle: CSSProperties = {
  ...cardStyle,
  borderColor: 'var(--editor-accent)',
  background: 'var(--editor-accent-soft)',
  boxShadow: '0 0 0 2px var(--editor-accent-soft)',
};

export const skeletonCardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  borderRadius: 12,
  border: '1px solid var(--editor-border-hairline)',
  background: 'var(--editor-bg)',
  minHeight: 220,
};

export const skeletonImageStyle: CSSProperties = {
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: 10,
  background: 'linear-gradient(90deg, var(--editor-divider) 0%, var(--editor-panel) 50%, var(--editor-divider) 100%)',
  backgroundSize: '200% 100%',
};

export const skeletonBodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const skeletonLineBaseStyle: CSSProperties = {
  borderRadius: 999,
  background: 'linear-gradient(90deg, var(--editor-divider) 0%, var(--editor-panel) 50%, var(--editor-divider) 100%)',
  backgroundSize: '200% 100%',
};

export const skeletonLineWideStyle: CSSProperties = {
  ...skeletonLineBaseStyle,
  height: 18,
  width: '72%',
};

export const skeletonLineMediumStyle: CSSProperties = {
  ...skeletonLineBaseStyle,
  height: 14,
  width: '52%',
};

export const skeletonLineShortStyle: CSSProperties = {
  ...skeletonLineBaseStyle,
  height: 12,
  width: '40%',
};

export const imageStyle: CSSProperties = {
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: 8,
  overflow: 'hidden',
  background: 'var(--editor-accent-soft)',
};

export const imagePlaceholderStyle: CSSProperties = {
  ...imageStyle,
  background: 'linear-gradient(135deg, var(--editor-accent-soft), var(--editor-divider))',
};

export const recordImageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

export const cardBodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

export const primaryLabelStyle: CSSProperties = {
  fontSize: 14,
  color: 'var(--editor-fg-primary)',
};

export const secondaryLabelStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--editor-fg-secondary)',
};

export const routePathStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--editor-accent-strong)',
  background: 'var(--editor-accent-soft)',
  padding: '2px 6px',
  borderRadius: 6,
  alignSelf: 'flex-start',
};

export const switcherStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
};

export const chipStyle: CSSProperties = {
  border: '1px solid var(--editor-border-strong)',
  background: 'var(--editor-panel)',
  color: 'var(--editor-accent-strong)',
  fontSize: 12,
  padding: '4px 10px',
  borderRadius: 999,
  cursor: 'pointer',
};

export const chipActiveStyle: CSSProperties = {
  ...chipStyle,
  background: 'var(--editor-accent-strong)',
  borderColor: 'var(--editor-accent-strong)',
  color: 'var(--editor-fg-inverse)',
};
