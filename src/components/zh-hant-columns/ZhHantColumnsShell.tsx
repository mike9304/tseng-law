import type { ReactNode } from 'react';
import ZhHantSnapRowFocus from '@/components/zh-hant-home/ZhHantSnapRowFocus';
import { appleDesignRootProps, type AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantColumns.module.css';

/**
 * zh-hant columns list, second pass (son7-87 / Opus 5.5, 2026-10-01): scopes the green header,
 * the board tabs and the ColumnsGrid restyle (feature mosaic for recommended columns, a label
 * rail beside each category). Markup, filters, search and links are unchanged.
 * ko shares it since 2026-10-06 (`locale="ko"`: id ko-columns, data-ko-design).
 */
export default function ZhHantColumnsShell({ children, locale = 'zh-hant' }: { children: ReactNode; locale?: AppleDesignLocale }) {
  const root = appleDesignRootProps(locale, 'columns');
  return (
    <div className={styles.root} {...root}>
      {children}
      <ZhHantSnapRowFocus rootSelector={`#${root.id}`} />
    </div>
  );
}
