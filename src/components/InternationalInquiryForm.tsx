'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import Link from 'next/link';
import { z } from 'zod';
import {
  internationalInquiryCopy,
  type InquiryCopyLocale,
} from '@/data/international-inquiry-copy';
import {
  CONSULTATION_LANGUAGES,
  inquiryLanguageSchema,
} from '@/lib/consultation/intake-language-contract';
import styles from './InternationalInquiryForm.module.css';

const PREFERRED_CONSULTATION_VALUES = [
  ...CONSULTATION_LANGUAGES,
  'needs-method-confirmation',
] as const;

type PreferredConsultationLanguage =
  (typeof PREFERRED_CONSULTATION_VALUES)[number];

type FieldKey =
  | 'name'
  | 'email'
  | 'originalLanguage'
  | 'preferredConsultationLanguage'
  | 'originalText'
  | 'consent';

type FieldErrors = Partial<Record<FieldKey, string>>;

type FormValues = {
  name: string;
  email: string;
  originalLanguage: string;
  preferredConsultationLanguage: string;
  originalText: string;
  consent: boolean;
};

type FormStatus =
  | { kind: 'idle'; message: string }
  | { kind: 'success'; message: string; intakeId: string }
  | { kind: 'pending'; message: string; intakeId: string }
  | { kind: 'failure'; message: string };

type InquiryCopy = (typeof internationalInquiryCopy)[InquiryCopyLocale] & {
  receiptIdLabel: string;
};

type NormalizedInquiryPayload = {
  name: string;
  email: string;
  uiLocale: InquiryCopyLocale;
  originalLanguage: string;
  preferredConsultationLanguage: PreferredConsultationLanguage;
  originalText: string;
  consent: true;
};

const EMPTY_VALUES: FormValues = {
  name: '',
  email: '',
  originalLanguage: '',
  preferredConsultationLanguage: '',
  originalText: '',
  consent: false,
};

const inquiryNameSchema = z.string().trim().min(1).max(120);
const inquiryEmailSchema = z.string().trim().email().max(254);
const FETCH_TIMEOUT_MS = 30000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const FIELD_FOCUS_ORDER: FieldKey[] = [
  'name',
  'email',
  'originalLanguage',
  'preferredConsultationLanguage',
  'originalText',
  'consent',
];

function isPreferredConsultationLanguage(
  value: string,
): value is PreferredConsultationLanguage {
  return (PREFERRED_CONSULTATION_VALUES as readonly string[]).includes(value);
}

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isSuccessfulInquiryResponse(value: unknown): value is {
  success: true;
  intakeId: string;
  notification: 'sent' | 'pending';
} {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (
    !('success' in value) ||
    !('intakeId' in value) ||
    !('notification' in value)
  ) {
    return false;
  }
  return (
    value.success === true &&
    typeof value.intakeId === 'string' &&
    isUuid(value.intakeId) &&
    (value.notification === 'sent' || value.notification === 'pending')
  );
}

function serializeNormalizedPayload(
  payload: NormalizedInquiryPayload,
): string {
  return JSON.stringify({
    name: payload.name,
    email: payload.email,
    uiLocale: payload.uiLocale,
    originalLanguage: payload.originalLanguage,
    preferredConsultationLanguage: payload.preferredConsultationLanguage,
    originalText: payload.originalText,
    consent: true,
  });
}

function issueIsTooLong(issue: z.ZodIssue): boolean {
  return issue.code === 'too_big';
}

function validateForm(
  locale: InquiryCopyLocale,
  copy: InquiryCopy,
  values: FormValues,
): FieldErrors {
  const errors: FieldErrors = {};

  const trimmedName = values.name.trim();
  if (trimmedName.length === 0) {
    errors.name = copy.requiredMessage;
  } else if (trimmedName.length > 120) {
    errors.name = copy.tooLongMessage;
  } else if (!inquiryNameSchema.safeParse(values.name).success) {
    errors.name = copy.requiredMessage;
  }

  const trimmedEmail = values.email.trim();
  if (trimmedEmail.length === 0) {
    errors.email = copy.requiredMessage;
  } else if (trimmedEmail.length > 254) {
    errors.email = copy.tooLongMessage;
  } else if (!inquiryEmailSchema.safeParse(values.email).success) {
    errors.email = copy.invalidEmailMessage;
  }

  const languageResult = inquiryLanguageSchema.safeParse({
    uiLocale: locale,
    originalLanguage: values.originalLanguage,
    preferredConsultationLanguage: values.preferredConsultationLanguage,
    originalText: values.originalText,
    consent: values.consent === true ? true : undefined,
  });

  if (!languageResult.success) {
    for (const issue of languageResult.error.issues) {
      const field = issue.path[0];
      if (
        field !== 'originalLanguage' &&
        field !== 'preferredConsultationLanguage' &&
        field !== 'originalText' &&
        field !== 'consent'
      ) {
        continue;
      }
      if (errors[field]) {
        continue;
      }
      errors[field] = issueIsTooLong(issue)
        ? copy.tooLongMessage
        : copy.requiredMessage;
    }
  }

  return errors;
}

function firstInvalidField(errors: FieldErrors): FieldKey | null {
  return FIELD_FOCUS_ORDER.find((field) => Boolean(errors[field])) ?? null;
}

export function InternationalInquiryNotice({
  locale,
  showContactLink = false,
}: {
  locale: InquiryCopyLocale;
  showContactLink?: boolean;
}) {
  const copy = internationalInquiryCopy[locale];

  return (
    <aside className={styles.notice} lang={locale}>
      <p className={styles.noticeText}>{copy.guidanceNotice}</p>
      <p className={styles.noticeText}>{copy.consultationNotice}</p>
      <p className={styles.noticeText}>{copy.methodConfirmationNotice}</p>
      <p className={styles.noticeText}>{copy.preparationNotice}</p>
      {showContactLink ? (
        <p className={styles.noticeText}>
          <Link href={`/${locale}/contact`} className={styles.contactLink}>
            {copy.heading}
          </Link>
        </p>
      ) : null}
    </aside>
  );
}

export default function InternationalInquiryForm({
  locale,
}: {
  locale: InquiryCopyLocale;
}) {
  const uid = useId();
  const copy = internationalInquiryCopy[locale];
  const statusRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef<string | null>(null);
  const submittedSnapshotRef = useRef<string | null>(null);
  const pendingStatusFocusRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({
    kind: 'idle',
    message: '',
  });

  const ids = {
    heading: `${uid}-heading`,
    intro: `${uid}-intro`,
    name: `${uid}-name`,
    nameError: `${uid}-name-error`,
    email: `${uid}-email`,
    emailError: `${uid}-email-error`,
    originalLanguage: `${uid}-original-language`,
    originalLanguageError: `${uid}-original-language-error`,
    originalLanguageHint: `${uid}-original-language-hint`,
    preferredConsultationLanguage: `${uid}-preferred-consultation-language`,
    preferredConsultationLanguageError: `${uid}-preferred-consultation-language-error`,
    preferredConsultationLanguageHint: `${uid}-preferred-consultation-language-hint`,
    originalText: `${uid}-original-text`,
    originalTextError: `${uid}-original-text-error`,
    consent: `${uid}-consent`,
    consentError: `${uid}-consent-error`,
    status: `${uid}-status`,
    receiptLabel: `${uid}-receipt-label`,
    receiptId: `${uid}-receipt-id`,
  };

  const fieldIds: Record<FieldKey, string> = {
    name: ids.name,
    email: ids.email,
    originalLanguage: ids.originalLanguage,
    preferredConsultationLanguage: ids.preferredConsultationLanguage,
    originalText: ids.originalText,
    consent: ids.consent,
  };

  useEffect(() => {
    if (!pendingStatusFocusRef.current) {
      return;
    }
    pendingStatusFocusRef.current = false;
    statusRef.current?.focus();
  }, [status]);

  function updateField<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current) || !current[key as FieldKey]) {
        return current;
      }
      const next = { ...current };
      delete next[key as FieldKey];
      return next;
    });
    setStatus((current) => {
      if (current.kind !== 'success' && current.kind !== 'pending') {
        return current;
      }
      return { kind: 'idle', message: '' };
    });
  }

  function showFailureStatus() {
    pendingStatusFocusRef.current = true;
    setStatus({
      kind: 'failure',
      message: copy.failureMessage,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) {
      return;
    }

    setStatus({ kind: 'idle', message: '' });

    const nextErrors = validateForm(locale, copy, values);
    setErrors(nextErrors);
    const invalidField = firstInvalidField(nextErrors);
    if (invalidField) {
      const node = document.getElementById(fieldIds[invalidField]);
      node?.focus();
      return;
    }

    if (values.consent !== true) {
      setErrors({ consent: copy.requiredMessage });
      document.getElementById(ids.consent)?.focus();
      return;
    }

    const languageResult = inquiryLanguageSchema.safeParse({
      uiLocale: locale,
      originalLanguage: values.originalLanguage,
      preferredConsultationLanguage: values.preferredConsultationLanguage,
      originalText: values.originalText,
      consent: true,
    });
    const nameResult = inquiryNameSchema.safeParse(values.name);
    const emailResult = inquiryEmailSchema.safeParse(values.email);

    if (!languageResult.success || !nameResult.success || !emailResult.success) {
      const fallbackErrors = validateForm(locale, copy, values);
      setErrors(fallbackErrors);
      const fallbackField = firstInvalidField(fallbackErrors);
      if (fallbackField) {
        document.getElementById(fieldIds[fallbackField])?.focus();
      }
      return;
    }

    if (
      !isPreferredConsultationLanguage(
        languageResult.data.preferredConsultationLanguage,
      )
    ) {
      setErrors({
        preferredConsultationLanguage: copy.requiredMessage,
      });
      document.getElementById(ids.preferredConsultationLanguage)?.focus();
      return;
    }

    const normalized: NormalizedInquiryPayload = {
      name: nameResult.data,
      email: emailResult.data,
      uiLocale: languageResult.data.uiLocale,
      originalLanguage: languageResult.data.originalLanguage,
      preferredConsultationLanguage:
        languageResult.data.preferredConsultationLanguage,
      originalText: languageResult.data.originalText,
      consent: true,
    };

    const snapshot = serializeNormalizedPayload(normalized);
    if (
      submittedSnapshotRef.current !== snapshot ||
      requestIdRef.current === null
    ) {
      requestIdRef.current = crypto.randomUUID();
      submittedSnapshotRef.current = snapshot;
    }

    const requestId = requestIdRef.current;
    if (!requestId) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, FETCH_TIMEOUT_MS);

    try {
      const response = await fetch('/api/consultation/international', {
        method: 'POST',
        credentials: 'same-origin',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          name: normalized.name,
          email: normalized.email,
          uiLocale: locale,
          originalLanguage: normalized.originalLanguage,
          preferredConsultationLanguage:
            normalized.preferredConsultationLanguage,
          originalText: normalized.originalText,
          consent: true,
        }),
      });

      if (!response.ok) {
        showFailureStatus();
        return;
      }

      let body: unknown;
      try {
        body = await response.json();
      } catch {
        showFailureStatus();
        return;
      }

      if (!isSuccessfulInquiryResponse(body)) {
        showFailureStatus();
        return;
      }

      pendingStatusFocusRef.current = true;
      if (body.notification === 'sent') {
        setStatus({
          kind: 'success',
          message: copy.successMessage,
          intakeId: body.intakeId,
        });
        return;
      }

      setStatus({
        kind: 'pending',
        message: copy.savedNotificationPendingMessage,
        intakeId: body.intakeId,
      });
    } catch {
      showFailureStatus();
    } finally {
      window.clearTimeout(timeoutId);
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  const showPreparationNotice = values.originalLanguage.trim().length > 0;
  const showMethodConfirmationNotice =
    values.preferredConsultationLanguage === 'needs-method-confirmation';

  const statusClassName =
    status.kind === 'failure'
      ? `${styles.status} ${styles.statusFailure}`
      : status.kind === 'success' || status.kind === 'pending'
        ? `${styles.status} ${styles.statusSuccess}`
        : styles.status;
  const receiptId =
    status.kind === 'success' || status.kind === 'pending'
      ? status.intakeId
      : null;

  return (
    <form
      className={styles.form}
      lang={locale}
      noValidate
      aria-labelledby={ids.heading}
      aria-describedby={ids.intro}
      aria-busy={isSubmitting}
      onSubmit={handleSubmit}
    >
      <h2 id={ids.heading} className={styles.heading}>
        {copy.heading}
      </h2>
      <p id={ids.intro} className={styles.intro}>
        {copy.intro}
      </p>

      <div className={styles.fields}>
        <div className={styles.identityRow}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={ids.name}>
              {copy.nameLabel}
            </label>
            <input
              id={ids.name}
              className={
                errors.name
                  ? `${styles.input} ${styles.invalid}`
                  : styles.input
              }
              type="text"
              name="name"
              autoComplete="name"
              maxLength={120}
              value={values.name}
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? ids.nameError : undefined}
              onChange={(event) => updateField('name', event.target.value)}
            />
            {errors.name ? (
              <p className={styles.error} id={ids.nameError}>
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={ids.email}>
              {copy.emailLabel}
            </label>
            <input
              id={ids.email}
              className={
                errors.email
                  ? `${styles.input} ${styles.emailInput} ${styles.invalid}`
                  : `${styles.input} ${styles.emailInput}`
              }
              type="email"
              name="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              maxLength={254}
              value={values.email}
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? ids.emailError : undefined}
              onChange={(event) => updateField('email', event.target.value)}
            />
            {errors.email ? (
              <p className={styles.error} id={ids.emailError}>
                {errors.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={ids.originalLanguage}>
            {copy.originalLanguageLabel}
          </label>
          <input
            id={ids.originalLanguage}
            className={
              errors.originalLanguage
                ? `${styles.input} ${styles.invalid}`
                : styles.input
            }
            type="text"
            name="originalLanguage"
            autoComplete="off"
            maxLength={80}
            placeholder={copy.originalLanguagePlaceholder}
            value={values.originalLanguage}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={Boolean(errors.originalLanguage)}
            aria-describedby={
              [
                errors.originalLanguage ? ids.originalLanguageError : null,
                showPreparationNotice ? ids.originalLanguageHint : null,
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
            onChange={(event) =>
              updateField('originalLanguage', event.target.value)
            }
          />
          {showPreparationNotice ? (
            <p className={styles.hint} id={ids.originalLanguageHint}>
              {copy.preparationNotice}
            </p>
          ) : null}
          {errors.originalLanguage ? (
            <p className={styles.error} id={ids.originalLanguageError}>
              {errors.originalLanguage}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label
            className={styles.label}
            htmlFor={ids.preferredConsultationLanguage}
          >
            {copy.preferredConsultationLanguageLabel}
          </label>
          <select
            id={ids.preferredConsultationLanguage}
            className={
              errors.preferredConsultationLanguage
                ? `${styles.select} ${styles.invalid}`
                : styles.select
            }
            name="preferredConsultationLanguage"
            value={values.preferredConsultationLanguage}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={Boolean(errors.preferredConsultationLanguage)}
            aria-describedby={
              [
                errors.preferredConsultationLanguage
                  ? ids.preferredConsultationLanguageError
                  : null,
                showMethodConfirmationNotice
                  ? ids.preferredConsultationLanguageHint
                  : null,
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
            onChange={(event) =>
              updateField(
                'preferredConsultationLanguage',
                event.target.value,
              )
            }
          >
            <option value="">
              {copy.preferredConsultationLanguageLabel}
            </option>
            {CONSULTATION_LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {copy.languageOptions[language]}
              </option>
            ))}
            <option value="needs-method-confirmation">
              {copy.languageOptions['needs-method-confirmation']}
            </option>
          </select>
          {showMethodConfirmationNotice ? (
            <p
              className={styles.hint}
              id={ids.preferredConsultationLanguageHint}
            >
              {copy.methodConfirmationNotice}
            </p>
          ) : null}
          {errors.preferredConsultationLanguage ? (
            <p
              className={styles.error}
              id={ids.preferredConsultationLanguageError}
            >
              {errors.preferredConsultationLanguage}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={ids.originalText}>
            {copy.originalTextLabel}
          </label>
          <textarea
            id={ids.originalText}
            className={
              errors.originalText
                ? `${styles.textarea} ${styles.invalid}`
                : styles.textarea
            }
            name="originalText"
            rows={8}
            maxLength={10000}
            placeholder={copy.originalTextPlaceholder}
            value={values.originalText}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={Boolean(errors.originalText)}
            aria-describedby={
              errors.originalText ? ids.originalTextError : undefined
            }
            onChange={(event) =>
              updateField('originalText', event.target.value)
            }
          />
          {errors.originalText ? (
            <p className={styles.error} id={ids.originalTextError}>
              {errors.originalText}
            </p>
          ) : null}
        </div>

        <div className={styles.consentBlock}>
          <div className={styles.consentRow}>
            <input
              id={ids.consent}
              className={styles.checkbox}
              type="checkbox"
              name="consent"
              checked={values.consent === true}
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={
                errors.consent ? ids.consentError : undefined
              }
              onChange={(event) =>
                updateField('consent', event.target.checked === true)
              }
            />
            <div className={styles.consentText}>
              <label className={styles.consentLabel} htmlFor={ids.consent}>
                {copy.consentLabel}
              </label>
              <Link
                href={`/${locale}/privacy`}
                className={styles.privacyLink}
              >
                {copy.privacyLinkLabel}
              </Link>
            </div>
          </div>
          {errors.consent ? (
            <p className={styles.error} id={ids.consentError}>
              {errors.consent}
            </p>
          ) : null}
        </div>
      </div>

      <div className={styles.ctaBlock}>
        <InternationalInquiryNotice locale={locale} />
        <button
          className={styles.submit}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? copy.submittingLabel : copy.submitLabel}
        </button>
        <div
          ref={statusRef}
          id={ids.status}
          className={statusClassName}
          tabIndex={-1}
          role={status.kind === 'failure' ? 'alert' : 'status'}
          aria-live={status.kind === 'failure' ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          {status.message ? (
            <p className={styles.statusMessage}>{status.message}</p>
          ) : null}
          {receiptId ? (
            <p className={styles.receipt}>
              <span id={ids.receiptLabel} className={styles.receiptLabel}>
                {copy.receiptIdLabel}
              </span>
              <code
                id={ids.receiptId}
                className={styles.receiptId}
                aria-labelledby={ids.receiptLabel}
              >
                {receiptId}
              </code>
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
