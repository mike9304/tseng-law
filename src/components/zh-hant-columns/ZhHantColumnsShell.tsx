import type { ReactNode } from 'react';
import ZhHantSnapRowFocus from '@/components/zh-hant-home/ZhHantSnapRowFocus';
import styles from './ZhHantColumns.module.css';

/**
 * zh-hant columns list, second pass (son7-87 / Opus 5.5, 2026-10-01): scopes the green header,
 * the board tabs and the ColumnsGrid restyle (feature mosaic for recommended columns, a label
 * rail beside each category). Markup, filters, search and links are unchanged.
 */
export default function ZhHantColumnsShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root} id="zh-hant-columns" data-zh-hant-design="columns">
      {children}
      <ZhHantSnapRowFocus rootSelector="#zh-hant-columns" />
    </div>
  );
}
