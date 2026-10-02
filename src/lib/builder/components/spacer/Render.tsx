import type { BuilderSpacerCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getLayoutNavigationWidgetsCopy } from '../layout-navigation-widgets-copy';
import styles from './Spacer.module.css';

function SpacerRender({
  node,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderSpacerCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const size = Math.max(8, Math.min(400, node.content.size ?? 32));
  const isEdit = mode === 'edit';
  const copy = getLayoutNavigationWidgetsCopy(normalizeLocale(locale)).spacer;

  if (isEdit) {
    return (
      <div
        aria-hidden="true"
        className={styles.edit}
        style={{
          minHeight: size,
        }}
      >
        {copy.editLabel(size)}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={styles.spacer}
      style={{
        height: size,
      }}
    />
  );
}

export default SpacerRender;
