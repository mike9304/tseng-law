import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', href: 'dashboard' },
  { key: 'services', label: 'Services', href: 'services' },
  { key: 'staff', label: 'Staff', href: 'staff' },
  { key: 'calendar', label: 'Calendar', href: 'calendar' },
  { key: 'email-templates', label: 'Email', href: 'email-templates' },
] as const;

type BookingsAdminNavKey = (typeof navItems)[number]['key'];

export default function BookingsAdminShell({
  locale,
  active,
  title,
  subtitle,
  children,
}: {
  locale: Locale;
  active: BookingsAdminNavKey;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>Wix Bookings MVP</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <nav className={styles.nav} aria-label="Bookings admin">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}/admin-builder/bookings/${item.href}`}
              data-active={active === item.key}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className={styles.content}>{children}</div>
    </main>
  );
}
