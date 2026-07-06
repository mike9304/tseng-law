import type { Locale } from '@/lib/locales';
import type { PreflightItem } from './PublishModalPreflight';
import { itemStatus } from './PublishModalPreflight';
import type { PublishModalCopy } from './publish-copy';
import styles from './PublishModal.module.css';

interface PublishModalPreflightGridProps {
  readonly copy: PublishModalCopy;
  readonly items: readonly PreflightItem[];
  readonly locale: Locale;
}

export function PublishModalPreflightGrid({
  copy,
  items,
  locale,
}: PublishModalPreflightGridProps): JSX.Element {
  return (
    <>
      <p className={styles.sectionTitle}>
        {copy.preflightTitle}
      </p>
      <div className={styles.checklistGrid}>
        {items.map((item) => (
          <div
            key={item.key}
            className={styles.checklistCard}
            data-tone={item.tone}
            data-builder-publish-preflight-item={item.key}
          >
            <div className={styles.checklistLabel}>
              <span>{item.label}</span>
              <span className={styles.checklistStatus}>{itemStatus(item, locale)}</span>
            </div>
            <div className={styles.checklistDetail}>{item.detail}</div>
          </div>
        ))}
      </div>
    </>
  );
}
