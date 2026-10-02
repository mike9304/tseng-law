import type { BuilderDividerCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor } from '@/lib/builder/site/theme';
import styles from './Divider.module.css';

function DividerRender({
  node,
  theme,
}: {
  node: BuilderDividerCanvasNode;
  theme?: BuilderTheme;
}) {
  const orientation = node.content.orientation ?? 'horizontal';
  const thickness = Math.max(1, Math.min(10, node.content.thickness ?? 2));
  const style = node.content.style ?? 'solid';
  const color = resolveThemeColor(node.content.color, theme) ?? '#cbd5e1';

  if (orientation === 'vertical') {
    return (
      <div
        className={`${styles.frame} ${styles.vertical}`}
      >
        <div
          className={styles.line}
          style={{
            width: thickness,
            height: '100%',
            borderLeft: `${thickness}px ${style} ${color}`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.frame} ${styles.horizontal}`}
    >
      <hr
        className={styles.line}
        style={{
          width: '100%',
          border: 'none',
          borderTop: `${thickness}px ${style} ${color}`,
          margin: 0,
        }}
      />
    </div>
  );
}

export default DividerRender;
