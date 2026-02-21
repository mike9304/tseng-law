'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';

export default function QuickContactWidget({ locale }: { locale: Locale }) {
  const content = siteContent[locale].quickContact;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeLabel = locale === 'ko' ? '빠른 상담 닫기' : locale === 'zh-hant' ? '關閉快速諮詢' : 'Close quick consult';
  const toggleText = locale === 'ko' ? '상담' : locale === 'zh-hant' ? '諮詢' : 'Consult';

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <div className="quick-contact" data-visible="true" data-open={open ? 'true' : 'false'} ref={rootRef}>
      {open ? (
        <div className="quick-contact-panel" role="dialog" aria-modal="false" aria-label={content.panelTitle}>
          <div className="quick-contact-head">
            <strong>{content.panelTitle}</strong>
            <button type="button" className="icon-button" onClick={() => setOpen(false)} aria-label={closeLabel}>
              ×
            </button>
          </div>
          <ul className="quick-contact-list">
            {content.actions.map((item) => {
              const isExternal = item.href.startsWith('http');
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span>{item.label}</span>
                    <strong className="phone-number">{item.value}</strong>
                  </a>
                </li>
              );
            })}
          </ul>
          <Link className="button" href={content.cta.href}>
            {content.cta.label}
          </Link>
        </div>
      ) : null}
      <button
        type="button"
        className="quick-contact-toggle"
        aria-label={content.buttonLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {toggleText}
      </button>
    </div>
  );
}
