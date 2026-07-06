import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/locales';
import { getBookingsAdminCopy } from '@/lib/builder/bookings/bookings-copy';
import styles from './BookingsAdmin.module.css';

const navItems = [
  { key: 'dashboard', href: 'dashboard' },
  { key: 'services', href: 'services' },
  { key: 'policies', href: 'policies' },
  { key: 'packages', href: 'packages' },
  { key: 'resources', href: 'resources' },
  { key: 'staff', href: 'staff' },
  { key: 'calendar', href: 'calendar' },
  { key: 'email-templates', href: 'email-templates' },
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
  const copy = getBookingsAdminCopy(locale);
  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <nav className={styles.nav} aria-label={copy.ariaLabel}>
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}/admin-builder/bookings/${item.href}`}
              data-active={active === item.key}
            >
              {copy.nav[item.key === 'email-templates' ? 'emailTemplates' : item.key]}
            </Link>
          ))}
        </nav>
      </div>
      <div className={styles.content}>{children}</div>
    </main>
  );
}
