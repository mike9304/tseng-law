import type { ReactNode } from 'react';
import shellStyles from '@/components/zh-hant-pages/ZhHantPageShell.module.css';

/**
 * Wrapper for every ko subpage on the Apple system (2026-10-06; the ko home is KoHomeBody).
 * `id="ko-<page>"` and `data-ko-design` let the shared zh-hant/ko rules in globals.css and the page modules
 * reach the page (every selector reads :is(#zh-hant-<page>, #ko-<page>)), and let the builder-published page
 * sizing rule release the saved canvas height — without it a ko page whose content outgrew its saved height
 * (the lawyers page after the team grew) ran over the footer. The shell module gives the white header band, the
 * large sans H1 and pill buttons. Children pass through untouched: copy, links and JSON-LD stay as rendered.
 */
export default function KoPageShell({
  page,
  className,
  children,
}: {
  page: string;
  className?: string;
  children: ReactNode;
}) {
  const classes = [shellStyles.shell, className].filter(Boolean).join(' ');
  return (
    <div className={classes} id={`ko-${page}`} data-ko-design={page}>
      {children}
    </div>
  );
}
