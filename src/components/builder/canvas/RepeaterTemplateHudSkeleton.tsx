import type { CSSProperties } from 'react';

const SKELETON_CARD_COUNT = 3;

export function RepeaterTemplateHudSkeleton() {
  return (
    <div style={skeletonGridStyle} aria-hidden="true">
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
        <span
          key={`repeater-template-skeleton-${index}`}
          data-builder-repeater-template-skeleton-card="true"
          style={skeletonCardStyle}
        >
          <i style={skeletonLineWideStyle} />
          <i style={skeletonLineMediumStyle} />
        </span>
      ))}
    </div>
  );
}

const skeletonGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 4,
  paddingTop: 4,
};

const skeletonCardStyle: CSSProperties = {
  display: 'grid',
  gap: 4,
  minWidth: 0,
  padding: 5,
  borderRadius: 6,
  background: '#eff6ff',
};

const skeletonLineWideStyle: CSSProperties = {
  display: 'block',
  height: 6,
  borderRadius: 999,
  background: 'linear-gradient(90deg, #bfdbfe, #dbeafe, #bfdbfe)',
};

const skeletonLineMediumStyle: CSSProperties = {
  display: 'block',
  width: '72%',
  height: 6,
  borderRadius: 999,
  background: 'linear-gradient(90deg, #dbeafe, #e0f2fe, #dbeafe)',
};
