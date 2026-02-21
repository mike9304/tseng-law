'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteContent } from '@/data/site-content';
import type { Locale } from '@/lib/locales';
import { buildLocalePath } from '@/lib/path-utils';

export default function MobileNavDrawer({
  open,
  onClose,
  locale,
  onSearch
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  onSearch: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const content = siteContent[locale];
  const pathname = usePathname();
  const current = pathname ?? '';
  const koPath = buildLocalePath(current, 'ko');
  const zhPath = buildLocalePath(current, 'zh-hant');
  const enPath = buildLocalePath(current, 'en');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>('a, button, input, [tabindex]:not([tabindex="-1"])');
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && focusable && focusable.length > 0) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [open, onClose]);

  if (!open) return null;

  const closeLabel = locale === 'ko' ? '닫기' : locale === 'zh-hant' ? '關閉' : 'Close';
  const drawerLabel = locale === 'ko' ? '모바일 메뉴' : locale === 'zh-hant' ? '行動選單' : 'Mobile menu';
  const brandText = locale === 'ko' ? '법무법인 호정국제' : locale === 'zh-hant' ? '昊鼎國際法律事務所' : 'Hovering International Law Firm';
  const brandLogo = locale === 'zh-hant' ? '/images/brand/hovering-logo-zh.png' : '/images/brand/hovering-logo-ko.png';

  return (
    <div className="drawer" data-open={open} role="dialog" aria-modal="true" aria-label={drawerLabel} onClick={onClose}>
      <div className="drawer-panel" ref={panelRef} onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <Link className="header-logo drawer-brand" href={`/${locale}`} onClick={onClose}>
            <span className="logo-mark" aria-hidden>
              <Image src={brandLogo} alt="" width={508} height={80} />
            </span>
            <span className="logo-kr">{brandText}</span>
          </Link>
          <button className="icon-button" type="button" onClick={onClose} aria-label={closeLabel}>
            ×
          </button>
        </div>
        <div className="drawer-utilities">
          <button className="chip" type="button" onClick={onSearch} aria-label={content.nav.searchLabel}>
            {content.nav.searchLabel}
          </button>
          <Link className="chip" href={koPath}>
            KO
          </Link>
          <Link className="chip" href={zhPath}>
            繁中
          </Link>
          <Link className="chip" href={enPath}>
            EN
          </Link>
        </div>
        <nav className="drawer-nav">
          {content.nav.primary.map((item) => (
            <Link key={item.href} href={item.href} className="drawer-nav-link" onClick={onClose}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="drawer-footer">
          <Link href={content.nav.cta.href} className="button" onClick={onClose}>
            {content.nav.cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
