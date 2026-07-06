import type { Locale } from '@/lib/locales';
import type { BookingPaymentAttributionItem } from '@/lib/builder/bookings/analytics-attribution';
import styles from './BookingsAdmin.module.css';

type BookingPaymentAttributionPanelProps = {
  readonly items: readonly BookingPaymentAttributionItem[];
  readonly locale: Locale;
  readonly title: string;
  readonly subtitle: string;
};

function channelLabel(locale: Locale): string {
  if (locale === 'ko') return '채널';
  if (locale === 'zh-hant') return '管道';
  return 'channels';
}

function formatAmount(locale: Locale, amount: number): string {
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US').format(amount);
}

export function BookingPaymentAttributionPanel({
  items,
  locale,
  title,
  subtitle,
}: BookingPaymentAttributionPanelProps) {
  if (items.length === 0) return null;

  return (
    <section className={styles.panel} data-booking-payment-attribution="true">
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.muted}>{subtitle}</p>
        </div>
        <span className={styles.chip}>{items.length} {channelLabel(locale)}</span>
      </div>
      <div className={styles.breakdownCard}>
        {items.map((item) => (
          <div
            className={styles.breakdownRow}
            data-booking-payment-attribution-row={item.provider}
            key={item.provider}
          >
            <span>{item.label}</span>
            <strong>{item.paidBookings}/{item.total} · {formatAmount(locale, item.revenueAmount)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
