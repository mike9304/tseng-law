'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteContent } from '@/data/site-content';
import type { SiteLocale } from '@/lib/locales';
import type { PublicSiteMember } from '@/lib/builder/members/members-engine';
import LocaleFlagSwitcher from '@/components/LocaleFlagSwitcher';

type MemberNavState = {
  status: 'loading' | 'signed-out' | 'signed-in';
  member?: PublicSiteMember;
};

type MemberLabels = {
  login: string;
  account: string;
  premium: string;
  logout: string;
};

export default function MobileNavDrawer({
  open,
  onClose,
  locale,
  onSearch,
  memberNav,
  memberLabels,
  memberLoginHref,
  onMemberLogout
}: {
  open: boolean;
  onClose: () => void;
  locale: SiteLocale;
  onSearch: () => void;
  memberNav?: MemberNavState;
  memberLabels?: MemberLabels;
  memberLoginHref?: string;
  onMemberLogout?: () => void | Promise<void>;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const content = siteContent[locale];
  const pathname = usePathname();
  const current = pathname ?? '';

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
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    const getFocusable = () => (
      Array.from(panel?.querySelectorAll<HTMLElement>('a, button, input, [tabindex]:not([tabindex="-1"])') ?? [])
        .filter((element) => !element.hasAttribute('disabled') && element.getClientRects().length > 0)
    );
    const focusInitial = () => {
      closeButtonRef.current?.focus();
      if (document.activeElement === closeButtonRef.current) return;
      getFocusable()[0]?.focus();
    };
    focusInitial();

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        const focusable = getFocusable();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (dialog?.contains(event.target as Node | null)) return;
      event.preventDefault();
      focusInitial();
    };

    document.addEventListener('keydown', handler, true);
    document.addEventListener('focusin', handleFocusIn, true);
    return () => {
      document.removeEventListener('keydown', handler, true);
      document.removeEventListener('focusin', handleFocusIn, true);
    };
  }, [open, onClose]);

  if (!open) return null;

  const closeLabel = locale === 'ko' ? '닫기' : locale === 'zh-hant' ? '關閉' : 'Close';
  const drawerLabel = locale === 'ko' ? '모바일 메뉴' : locale === 'zh-hant' ? '行動選單' : 'Mobile menu';
  const navLabel = locale === 'ko' ? '모바일 주요 메뉴' : locale === 'zh-hant' ? '行動主要選單' : 'Mobile main menu';
  const brandText = locale === 'ko' ? '법무법인 호정' : locale === 'zh-hant' ? '昊鼎國際法律事務所' : 'Hovering International Law Firm';
  const labels =
    memberLabels ??
    (locale === 'ko'
      ? { login: '로그인', account: '내 계정', premium: '프리미엄', logout: '로그아웃' }
      : locale === 'zh-hant'
        ? { login: '登入', account: '我的帳戶', premium: '進階內容', logout: '登出' }
        : { login: 'Log in', account: 'My account', premium: 'Premium', logout: 'Log out' });
  const memberState = memberNav ?? { status: 'signed-out' };
  const loginHref = memberLoginHref ?? `/${locale}/login?next=${encodeURIComponent(current || `/${locale}/account`)}`;
  const canSeePremium = memberState.member?.role === 'premium' || memberState.member?.role === 'admin';

  return (
    <div
      className="drawer"
      id="public-mobile-nav-drawer"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label={drawerLabel}
      ref={dialogRef}
      onClick={onClose}
    >
      <div className="drawer-panel" ref={panelRef} onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <Link className="header-logo drawer-brand" href={`/${locale}`} onClick={onClose}>
            <span className="logo-mark" aria-hidden>
              <Image src="/images/brand/hovering-seal-official.png" alt="" width={40} height={40} />
            </span>
            <span className="logo-kr">{brandText}</span>
          </Link>
          <button className="icon-button" type="button" onClick={onClose} aria-label={closeLabel} ref={closeButtonRef}>
            ×
          </button>
        </div>
        <div className="drawer-utilities">
          <button className="chip" type="button" onClick={onSearch} aria-label={content.nav.searchLabel}>
            {content.nav.searchLabel}
          </button>
          <LocaleFlagSwitcher
            locale={locale}
            className="locale-flag-switcher--mobile"
            linkClassName="chip"
            onLocaleSelect={onClose}
          />
        </div>
        <nav className="drawer-nav" aria-label={navLabel}>
          {content.nav.primary.map((item) => (
            <Link key={item.href} href={item.href} className="drawer-nav-link" onClick={onClose}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="drawer-footer">
          <div className="utility-member-nav drawer-member-nav" data-member-nav-state={memberState.status}>
            {memberState.status === 'signed-in' ? (
              <>
                <Link href={`/${locale}/account`} data-member-role-link="account" onClick={onClose}>
                  {labels.account}
                </Link>
                {canSeePremium ? (
                  <Link href={`/${locale}/account/premium`} data-member-role-link="premium" onClick={onClose}>
                    {labels.premium}
                  </Link>
                ) : null}
                <button
                  type="button"
                  data-member-role-link="logout"
                  onClick={() => {
                    void onMemberLogout?.();
                    onClose();
                  }}
                >
                  {labels.logout}
                </button>
              </>
            ) : (
              <Link href={loginHref} data-member-role-link="login" onClick={onClose}>
                {labels.login}
              </Link>
            )}
          </div>
          <Link href={content.nav.cta.href} className="button" onClick={onClose}>
            {content.nav.cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
