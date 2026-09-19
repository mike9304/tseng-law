'use client';

import { useId, useState, type FormEvent } from 'react';
import {
  SUBSCRIBE_LOCALE_BY_SITE_LOCALE,
  getNewsletterSignupCopy,
} from '@/data/newsletter-signup-copy';
import type { SiteLocale } from '@/lib/locales';
import styles from './NewsletterSignup.module.css';

/**
 * Opt-in newsletter sign-up shown at the bottom of a column page.
 *
 * Double opt-in: this only creates a pending subscriber and asks the API to
 * send a confirmation mail. Nothing is delivered until the person clicks that
 * link, so the widget never claims the subscription is active.
 *
 * The consent box starts unchecked and the request is refused client-side
 * without it. `company` is a honeypot: real people leave it empty.
 */

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'done'; message: string }
  | { kind: 'error'; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup({ locale }: { locale: SiteLocale }) {
  const copy = getNewsletterSignupCopy(locale);
  const preferredLocale = SUBSCRIBE_LOCALE_BY_SITE_LOCALE[locale];
  const fieldId = useId();
  const emailId = `${fieldId}-email`;
  const consentId = `${fieldId}-consent`;
  const statusId = `${fieldId}-status`;

  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === 'sending') return;

    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setStatus({ kind: 'error', message: copy.invalidEmailMessage });
      return;
    }
    if (!consent) {
      setStatus({ kind: 'error', message: copy.consentRequiredMessage });
      return;
    }

    setStatus({ kind: 'sending' });
    try {
      const response = await fetch('/api/marketing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          preferredLocale,
          marketingConsent: true,
          ...(company ? { company } : {}),
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; alreadySubscribed?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        setStatus({ kind: 'error', message: payload?.error || copy.errorMessage });
        return;
      }
      setStatus({
        kind: 'done',
        message: payload.alreadySubscribed ? copy.alreadyMessage : copy.successMessage,
      });
      setEmail('');
      setConsent(false);
    } catch {
      setStatus({ kind: 'error', message: copy.errorMessage });
    }
  }

  return (
    <section className={styles.wrap} aria-labelledby={`${fieldId}-heading`} data-newsletter-signup={locale}>
      <h2 className={styles.heading} id={`${fieldId}-heading`}>{copy.heading}</h2>
      <p className={styles.description}>{copy.description}</p>
      {copy.languageNote ? <p className={styles.note}>{copy.languageNote}</p> : null}

      {status.kind === 'done' ? (
        <p className={styles.success} id={statusId} role="status">{status.message}</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.label} htmlFor={emailId}>{copy.emailLabel}</label>
          <input
            id={emailId}
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder={copy.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby={status.kind === 'error' ? statusId : undefined}
            required
          />

          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor={`${fieldId}-company`}>Company</label>
            <input
              id={`${fieldId}-company`}
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </div>

          <div className={styles.consentRow}>
            <input
              id={consentId}
              className={styles.checkbox}
              type="checkbox"
              name="marketingConsent"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <label className={styles.consentLabel} htmlFor={consentId}>{copy.consentLabel}</label>
          </div>

          <button className={styles.submit} type="submit" disabled={status.kind === 'sending'}>
            {status.kind === 'sending' ? copy.submittingLabel : copy.submitLabel}
          </button>

          {status.kind === 'error' ? (
            <p className={styles.error} id={statusId} role="alert">{status.message}</p>
          ) : null}
          <p className={styles.note}>{copy.unsubscribeNote}</p>
        </form>
      )}
    </section>
  );
}
