'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { siteContent, type SiteContent } from '@/data/site-content';
import FloatingAiChat from '@/components/FloatingAiChat';

export default function QuickContactWidget({
  locale,
  content,
}: {
  locale: Locale;
  content?: SiteContent['quickContact'];
}) {
  const resolvedContent = content ?? siteContent[locale].quickContact;
  const [open, setOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
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

  function handleActionClick(href: string) {
    if (href === '#ai-consultation') {
      setOpen(false);
      setAiChatOpen(true);
      return true;
    }
    return false;
  }

  return (
    <>
      <div className="quick-contact" data-visible="true" data-open={open ? 'true' : 'false'} ref={rootRef}>
        {open ? (
          <div className="quick-contact-panel" role="dialog" aria-modal="false" aria-label={resolvedContent.panelTitle}>
            <div className="quick-contact-head">
              <strong>{resolvedContent.panelTitle}</strong>
              <button type="button" className="icon-button" onClick={() => setOpen(false)} aria-label={closeLabel}>
                ×
              </button>
            </div>
            <ul className="quick-contact-list">
              {resolvedContent.actions.map((item) => {
                const isAi = item.href === '#ai-consultation';
                const isExternal = item.href.startsWith('http');
                return (
                  <li key={item.label}>
                    {isAi ? (
                      <button
                        type="button"
                        className="quick-contact-action-btn"
                        onClick={() => handleActionClick(item.href)}
                      >
                        <span>{item.label}</span>
                        <strong className="phone-number">{item.value}</strong>
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        <span>{item.label}</span>
                        <strong className="phone-number">{item.value}</strong>
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link className="button" href={resolvedContent.cta.href}>
              {resolvedContent.cta.label}
            </Link>
          </div>
        ) : null}
        <button
          type="button"
          className="quick-contact-toggle"
          aria-label={resolvedContent.buttonLabel}
          aria-expanded={open}
          onClick={() => {
            if (aiChatOpen) {
              setAiChatOpen(false);
            } else {
              setOpen((prev) => !prev);
            }
          }}
        >
          {aiChatOpen ? '×' : toggleText}
        </button>
      </div>
      <FloatingAiChat locale={locale} open={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </>
  );
}
