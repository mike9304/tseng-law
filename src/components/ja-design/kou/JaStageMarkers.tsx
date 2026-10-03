import type { CSSProperties } from 'react';
import k from './JaKou.module.css';

/**
 * Step markers for a pinned stage (read by JaMotion). `bounds` are fractions of the stage's runway at which the next
 * step starts, e.g. [0.33, 0.66] gives steps 0, 1 and 2. Each marker is exactly one step tall under the centre line,
 * so the markers are contiguous and only one can meet the line at a time. Decorative, never focusable.
 */
export default function JaStageMarkers({ bounds }: { bounds: readonly number[] }) {
  const edges = [0, ...bounds];
  return (
    <span className={k.markers} aria-hidden="true">
      {edges.map((start, index) => {
        const end = index + 1 < edges.length ? edges[index + 1] : 1;
        const style = { '--a': start, '--b': end } as CSSProperties;
        return (
          <span
            key={index}
            className={k.marker}
            data-stage-marker={String(index)}
            data-first={index === 0 ? '' : undefined}
            data-last={index === edges.length - 1 ? '' : undefined}
            style={style}
          />
        );
      })}
    </span>
  );
}
