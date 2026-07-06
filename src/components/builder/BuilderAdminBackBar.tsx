'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getAdminNavCopy } from '@/lib/builder/admin-nav/nav-copy';

/**
 * Small floating "back to builder editor" pill rendered on every
 * /admin-builder/* sub-route. Hidden on the canvas root itself so it
 * doesn't duplicate the editor's own chrome.
 *
 * The button is fixed-position so it survives whatever per-page chrome
 * the sub-route renders (modal-shell, BuilderWorkspaceFrame, plain
 * `<main>`, etc.) without depending on a shared header element.
 */
export default function BuilderAdminBackBar() {
  const pathname = usePathname() ?? '';
  const match = pathname.match(/^\/(ko|en|zh-hant)\/admin-builder(?:\/(.*))?$/);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (!match) return null;
  const [, locale, rest] = match;
  const copy = getAdminNavCopy(locale);
  // No bar on the editor root — it has its own chrome.
  if (!rest) return null;
  if (!isMobile) return null;

  const editorHref = `/${locale}/admin-builder`;

  return (
    <a
      href={editorHref}
      data-builder-admin-back-bar="true"
      aria-label={copy.backLabel}
      style={{
        position: 'fixed',
        top: 58,
        left: 12,
        right: 12,
        zIndex: 10500,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '10px 18px',
        borderRadius: 999,
        border: '1px solid #0f172a',
        background: '#0f172a',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 800,
        textDecoration: 'none',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.28)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
      }}
      onMouseEnter={(event) => {
        (event.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
        (event.currentTarget as HTMLAnchorElement).style.boxShadow = '0 18px 40px rgba(15, 23, 42, 0.38)';
      }}
      onMouseLeave={(event) => {
        (event.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
        (event.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.28)';
      }}
    >
      <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>←</span>
      <span>{copy.backLabel}</span>
    </a>
  );
}
