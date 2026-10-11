import type { ReactNode } from 'react';
import { applePresentationRootProps } from '@/lib/apple-design-locales';
import styles from './ViArticle.module.css';

/** Shared article markup and publication rules, with the Vietnamese reading layout. */
export default function ViArticleShell({ children, kind = 'column' }: { children: ReactNode; kind?: 'column' | 'issue' }) {
  return <div className={styles.root} {...applePresentationRootProps('vi', 'column', kind)}>{children}</div>;
}
