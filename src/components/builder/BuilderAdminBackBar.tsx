'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  if (!match) return null;
  const [, locale, rest] = match;
  // No bar on the editor root — it has its own chrome.
  if (!rest) return null;

  return (
    <Link
      href={`/${locale}/admin-builder`}
      data-builder-admin-back-bar="true"
      aria-label="사이트 빌더로 돌아가기"
      style={{
        position: 'fixed',
        top: 12,
        left: 12,
        zIndex: 10500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 999,
        border: '1px solid #cbd5e1',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(8px)',
        color: '#0f172a',
        fontSize: 12,
        fontWeight: 700,
        textDecoration: 'none',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden>←</span>
      <span>사이트 빌더</span>
    </Link>
  );
}
