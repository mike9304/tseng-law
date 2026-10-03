import type { ReactNode } from 'react';
import { JaPhrases } from './JaPhrases';
import k from './JaKou.module.css';
import h from './JaPageHeader.module.css';

/**
 * Inner-page header (CONCEPT-V2 §9): a still band behind a left-aligned Mincho H1, the existing breadcrumb and lede.
 * Desktop height clamp(440px, 60svh, 640px); phones auto, with the 4:5 crop under a static white scrim. The still
 * settles 1.04 → 1 on entry. Built in the home lane for the lead to mount (not mounted by this lane).
 */
export default function JaPageHeader({
  title,
  lede,
  breadcrumb,
  still,
  children,
}: {
  title: string;
  lede?: string;
  breadcrumb?: ReactNode;
  still: { desktop: string; desktop960: string; mobile: string };
  children?: ReactNode;
}) {
  return (
    <header className={h.header}>
      <picture>
        <source media="(max-width: 767px)" srcSet={still.mobile} type="image/webp" />
        <source srcSet={`${still.desktop960} 960w, ${still.desktop} 1920w`} sizes="100vw" type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-encoded webp still, served as is */}
        <img className={h.still} src={still.desktop} alt="" width={1920} height={1080} decoding="async" />
      </picture>
      <div className={h.inner}>
        {breadcrumb ? <div className={h.crumb}>{breadcrumb}</div> : null}
        <h1 className={`${h.title} ${k.ph}`}>
          <JaPhrases text={title} />
        </h1>
        {lede ? <p className={h.lede}>{lede}</p> : null}
        {children}
      </div>
    </header>
  );
}
