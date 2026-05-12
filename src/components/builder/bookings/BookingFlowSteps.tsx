'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { BookingService, Staff } from '@/lib/builder/bookings/types';
import type { Slot } from '@/lib/builder/bookings/availability';
import { textForLocale } from '@/lib/builder/bookings/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './BookingFlowSteps.module.css';

type FlowStep = 0 | 1 | 2 | 3;
type PaymentStatus = 'idle' | 'creating' | 'ready' | 'confirming' | 'confirmed' | 'error';
type WaitlistStatus = 'idle' | 'joining' | 'joined' | 'error';

interface StripeElementsLike {
  create(type: 'payment'): { mount(target: HTMLElement | string): void; unmount?(): void };
}

interface StripeLike {
  elements(options: { clientSecret: string }): StripeElementsLike;
  confirmPayment(options: {
    elements: StripeElementsLike;
    redirect: 'if_required';
  }): Promise<{ error?: { message?: string }; paymentIntent?: { id?: string; status?: string } }>;
}

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeLike | null;
  }
}

export interface BookingFlowStepsProps {
  locale?: Locale | string;
  serviceId?: string;
  staffId?: string;
  successMessage?: string;
  redirectAfterBooking?: string;
  showCaseSummary?: boolean;
  caseSummaryLabel?: string;
  showAttachmentLinks?: boolean;
  attachmentLinksLabel?: string;
  customFieldLabels?: string;
}

function todayPlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Seoul';
  } catch {
    return 'Asia/Seoul';
  }
}

function formatInTimezone(iso: string, locale: Locale, timezone: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function parseAttachmentLinks(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function parseCustomFieldLabels(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function loadStripeJs(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('window unavailable'));
  if (window.Stripe) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://js.stripe.com/v3/"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Stripe.js load failed')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Stripe.js load failed'));
    document.head.appendChild(script);
  });
}

export default function BookingFlowSteps({
  locale: rawLocale = 'ko',
  serviceId: fixedServiceId,
  staffId: fixedStaffId,
  successMessage = '예약이 완료되었습니다',
  redirectAfterBooking,
  showCaseSummary = true,
  caseSummaryLabel = '사건 개요',
  showAttachmentLinks = true,
  attachmentLinksLabel = '첨부 링크',
  customFieldLabels = '',
}: BookingFlowStepsProps) {
  const locale = normalizeLocale(rawLocale);
  const customerTimezone = browserTimezone();
  const customLabels = useMemo(() => parseCustomFieldLabels(customFieldLabels), [customFieldLabels]);
  const [step, setStep] = useState<FlowStep>(0);
  const [services, setServices] = useState<BookingService[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [serviceId, setServiceId] = useState(fixedServiceId || '');
  const [staffId, setStaffId] = useState(fixedStaffId || '');
  const [date, setDate] = useState(todayPlus(1));
  const [slot, setSlot] = useState<Slot | null>(null);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    caseSummary: '',
    attachmentLinks: '',
    customFieldValues: {} as Record<string, string>,
    consent: false,
    company: '',
  });
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitlist, setWaitlist] = useState<{ status: WaitlistStatus; error?: string; duplicate?: boolean }>({ status: 'idle' });
  const [payment, setPayment] = useState<{
    status: PaymentStatus;
    paymentIntentId?: string;
    clientSecret?: string;
    publishableKey?: string;
    amount?: number;
    currency?: string;
    stub?: boolean;
    error?: string;
  }>({ status: 'idle' });
  const stripeRefs = useRef<{ stripe: StripeLike; elements: StripeElementsLike; element: { unmount?(): void } } | null>(null);
  const paymentElementRef = useRef<HTMLDivElement | null>(null);

  const selectedService = useMemo(() => services.find((service) => service.serviceId === serviceId), [serviceId, services]);
  const selectedStaff = useMemo(() => staff.find((member) => member.staffId === staffId), [staffId, staff]);
  const paidService = selectedService?.paymentMode === 'paid';

  useEffect(() => {
    fetch(`/api/booking/services?locale=${locale}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data: { services: BookingService[] }) => {
        setServices(data.services);
        if (!fixedServiceId && data.services[0]) setServiceId(data.services[0].serviceId);
      })
      .catch(() => setError('서비스 목록을 불러오지 못했습니다.'));
  }, [fixedServiceId, locale]);

  useEffect(() => {
    if (!serviceId) return;
    fetch(`/api/booking/staff?serviceId=${encodeURIComponent(serviceId)}&locale=${locale}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data: { staff: Staff[] }) => {
        setStaff(data.staff);
        if (!fixedStaffId && data.staff[0]) setStaffId(data.staff[0].staffId);
      })
      .catch(() => setError('담당자 목록을 불러오지 못했습니다.'));
  }, [fixedStaffId, locale, serviceId]);

  useEffect(() => {
    if (!serviceId || !staffId || !date) return;
    setLoading(true);
    setSlot(null);
    setWaitlist({ status: 'idle' });
    const params = new URLSearchParams({ serviceId, staffId, date });
    fetch(`/api/booking/availability?${params.toString()}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data: { slots: Slot[] }) => setSlots(data.slots))
      .catch(() => setError('예약 가능 시간을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [date, serviceId, staffId]);

  useEffect(() => {
    stripeRefs.current?.element.unmount?.();
    stripeRefs.current = null;
    setPayment({ status: 'idle' });
  }, [customer.email, customer.name, serviceId]);

  useEffect(() => {
    if (!paidService || payment.status !== 'ready' || payment.stub || !payment.clientSecret || !payment.publishableKey) return;
    let cancelled = false;
    async function mountStripeElement() {
      try {
        await loadStripeJs();
        if (cancelled || !window.Stripe || !paymentElementRef.current || !payment.publishableKey || !payment.clientSecret) return;
        const stripe = window.Stripe(payment.publishableKey);
        if (!stripe) throw new Error('Stripe.js 초기화 실패');
        const elements = stripe.elements({ clientSecret: payment.clientSecret });
        const element = elements.create('payment');
        element.mount(paymentElementRef.current);
        stripeRefs.current = { stripe, elements, element };
      } catch (err) {
        setPayment((current) => ({
          ...current,
          status: 'error',
          error: err instanceof Error ? err.message : 'Stripe Payment Element를 불러오지 못했습니다.',
        }));
      }
    }
    void mountStripeElement();
    return () => {
      cancelled = true;
      stripeRefs.current?.element.unmount?.();
      stripeRefs.current = null;
    };
  }, [paidService, payment.clientSecret, payment.publishableKey, payment.status, payment.stub]);

  const preparePayment = async () => {
    if (!paidService) return;
    if (!customer.name || !customer.email) {
      setError('결제 전 이름과 이메일을 입력해 주세요.');
      return;
    }
    setPayment({ status: 'creating' });
    setError(null);
    try {
      const paymentRes = await fetch('/api/booking/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          customer: { name: customer.name, email: customer.email },
        }),
      });
      const payload = (await paymentRes.json().catch(() => ({}))) as {
        paymentIntentId?: string;
        clientSecret?: string;
        publishableKey?: string;
        amount?: number;
        currency?: string;
        stub?: boolean;
        error?: string;
      };
      if (!paymentRes.ok || !payload.clientSecret) {
        throw new Error(payload.error || 'payment intent failed');
      }
      setPayment({
        status: 'ready',
        paymentIntentId: payload.paymentIntentId ?? (payload.stub ? 'pi_stub_dev' : undefined),
        clientSecret: payload.clientSecret,
        publishableKey: payload.publishableKey,
        amount: payload.amount,
        currency: payload.currency,
        stub: payload.stub,
      });
    } catch (err) {
      setPayment({
        status: 'error',
        error: err instanceof Error ? err.message : '결제를 준비하지 못했습니다.',
      });
    }
  };

  const confirmPayment = async () => {
    if (!paidService) return;
    if (payment.stub) {
      setPayment((current) => ({
        ...current,
        status: 'confirmed',
        paymentIntentId: current.paymentIntentId ?? 'pi_stub_dev',
      }));
      return;
    }
    if (!payment.paymentIntentId || !stripeRefs.current) {
      setPayment((current) => ({ ...current, status: 'error', error: 'Payment Element가 아직 준비되지 않았습니다.' }));
      return;
    }
    setPayment((current) => ({ ...current, status: 'confirming', error: undefined }));
    try {
      const result = await stripeRefs.current.stripe.confirmPayment({
        elements: stripeRefs.current.elements,
        redirect: 'if_required',
      });
      if (result.error) throw new Error(result.error.message || 'Stripe 결제 확인 실패');
      const status = result.paymentIntent?.status;
      if (status && !['succeeded', 'processing', 'requires_capture'].includes(status)) {
        throw new Error(`PaymentIntent status: ${status}`);
      }
      setPayment((current) => ({
        ...current,
        status: 'confirmed',
        paymentIntentId: result.paymentIntent?.id ?? current.paymentIntentId,
      }));
    } catch (err) {
      setPayment((current) => ({
        ...current,
        status: 'error',
        error: err instanceof Error ? err.message : '결제 확인에 실패했습니다.',
      }));
    }
  };

  const submit = async () => {
    if (!slot || !customer.consent) {
      setError('예약 시간과 개인정보 동의를 확인해 주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let paymentIntentId: string | undefined;
      if (paidService) {
        if (payment.status !== 'confirmed' || !payment.paymentIntentId) {
          throw new Error('payment confirmation required');
        }
        paymentIntentId = payment.paymentIntentId;
      }
      const customFields = customLabels.map((label) => ({
        label,
        value: customer.customFieldValues[label] ?? '',
      }));
      const res = await fetch('/api/booking/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          staffId: slot.staffId,
          startAt: slot.startAt,
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            notes: customer.notes,
            caseSummary: showCaseSummary ? customer.caseSummary : undefined,
            attachmentUrls: showAttachmentLinks ? parseAttachmentLinks(customer.attachmentLinks) : undefined,
            customFields: customFields.length > 0 ? customFields : undefined,
            locale,
          },
          customerTimezone,
          paymentIntentId,
          company: customer.company,
        }),
      });
      if (!res.ok) throw new Error('booking failed');
      setCompleted(true);
      if (redirectAfterBooking) window.location.href = redirectAfterBooking;
    } catch {
      setError('예약을 완료하지 못했습니다. 다른 시간을 선택해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const submitWaitlist = async () => {
    if (!serviceId || !staffId || !date) return;
    if (!customer.name || !customer.email || !customer.consent) {
      setWaitlist({ status: 'error', error: '이름, 이메일, 개인정보 동의를 확인해 주세요.' });
      return;
    }
    setWaitlist({ status: 'joining' });
    setError(null);
    try {
      const customFields = customLabels.map((label) => ({
        label,
        value: customer.customFieldValues[label] ?? '',
      }));
      const res = await fetch('/api/booking/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          staffId,
          requestedDate: date,
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            notes: customer.notes,
            caseSummary: showCaseSummary ? customer.caseSummary : undefined,
            attachmentUrls: showAttachmentLinks ? parseAttachmentLinks(customer.attachmentLinks) : undefined,
            customFields: customFields.length > 0 ? customFields : undefined,
            locale,
          },
          customerTimezone,
          company: customer.company,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { duplicate?: boolean; error?: string };
      if (!res.ok && res.status !== 200) throw new Error(payload.error || 'waitlist failed');
      setWaitlist({ status: 'joined', duplicate: payload.duplicate });
    } catch (err) {
      setWaitlist({
        status: 'error',
        error: err instanceof Error ? err.message : '대기 등록을 완료하지 못했습니다.',
      });
    }
  };

  if (completed) {
    return (
      <div className={styles.flow} data-booking-flow="true">
        <div className={styles.notice}>{successMessage}</div>
        <div className={styles.panel} style={{ boxShadow: 'none' }}>
          <h2 className={styles.cardTitle}>{textForLocale(selectedService?.name, locale)}</h2>
          <p className={styles.muted}>{selectedStaff ? textForLocale(selectedStaff.name, locale) : ''}</p>
          <p className={styles.muted}>{slot ? `${new Date(slot.startAt).toLocaleString(locale)} · ${customerTimezone}` : ''}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.flow} data-booking-flow="true">
      <div className={styles.steps}>
        {['Service', 'Staff', 'Date & time', 'Info'].map((label, index) => (
          <div className={styles.step} data-active={step === index} key={label}>{index + 1}. {label}</div>
        ))}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}

      {step === 0 ? (
        <div className={styles.optionGrid}>
          {services.map((service) => (
            <button className={styles.option} data-active={service.serviceId === serviceId} data-booking-service-id={service.serviceId} key={service.serviceId} type="button" onClick={() => setServiceId(service.serviceId)}>
              <strong>{textForLocale(service.name, locale)}</strong>
              <p className={styles.muted}>
                {service.durationMinutes} min · {service.paymentMode === 'paid'
                  ? `${service.priceCurrency ?? 'TWD'} ${(service.priceAmount ?? service.priceTwd ?? 0).toLocaleString()}`
                  : `TWD ${service.priceTwd?.toLocaleString() || 0}`}
              </p>
              <p className={styles.muted}>
                {service.paymentMode === 'paid' ? '결제 후 예약 확정' : '결제 없이 예약 확정'} · {service.slotStepMinutes ?? 30}분 간격
              </p>
              <p className={styles.muted}>{textForLocale(service.description, locale)}</p>
            </button>
          ))}
        </div>
      ) : null}

      {step === 1 ? (
        <div className={styles.optionGrid}>
          {staff.map((member) => (
            <button className={styles.option} data-active={member.staffId === staffId} data-booking-staff-id={member.staffId} key={member.staffId} type="button" onClick={() => setStaffId(member.staffId)}>
              <strong>{textForLocale(member.name, locale)}</strong>
              <p className={styles.muted}>{textForLocale(member.title, locale)}</p>
              <p className={styles.muted}>{textForLocale(member.bio, locale)}</p>
            </button>
          ))}
        </div>
      ) : null}

      {step === 2 ? (
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.label}>Date</span>
            <input className={styles.input} type="date" min={todayPlus(0)} value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <span className={styles.label}>{loading ? 'Loading slots...' : 'Available times'}</span>
            <p className={styles.muted}>내 시간대: {customerTimezone}</p>
            <div className={styles.slots}>
              {slots.map((item) => (
                <button className={styles.slot} data-active={slot?.startAt === item.startAt} data-booking-slot-start={item.startAt} key={`${item.staffId}-${item.startAt}`} type="button" onClick={() => setSlot(item)}>
                  {formatInTimezone(item.startAt, locale, customerTimezone)}
                  {item.timezone !== customerTimezone ? ` / ${formatInTimezone(item.startAt, locale, item.timezone)} ${item.timezone}` : ''}
                </button>
              ))}
              {!loading && slots.length === 0 ? <span className={styles.muted}>No available slots for this date.</span> : null}
            </div>
          </div>
          {!loading && slots.length === 0 ? (
            <div className={`${styles.waitlistPanel} ${styles.fieldFull}`} data-booking-waitlist="true">
              <div>
                <span className={styles.label}>Waitlist</span>
                <p className={styles.muted}>취소나 새 시간이 생기면 이 날짜의 대기자 명단에서 먼저 연락할 수 있게 등록합니다.</p>
              </div>
              <input style={{ display: 'none' }} tabIndex={-1} autoComplete="off" value={customer.company} onChange={(event) => setCustomer({ ...customer, company: event.target.value })} />
              <div className={styles.waitlistFields}>
                <label className={styles.field}><span className={styles.label}>Name</span><input className={styles.input} value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
                <label className={styles.field}><span className={styles.label}>Email</span><input className={styles.input} type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
                <label className={styles.field}><span className={styles.label}>Phone</span><input className={styles.input} value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
                <label className={styles.field}><span className={styles.label}>Notes</span><input className={styles.input} value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} /></label>
              </div>
              <label className={styles.label}>
                <input type="checkbox" checked={customer.consent} onChange={(event) => setCustomer({ ...customer, consent: event.target.checked })} /> 개인정보 수집 및 대기자 연락 안내에 동의합니다.
              </label>
              {waitlist.status === 'joined' ? (
                <div className={styles.notice} data-booking-waitlist-confirmed="true">
                  {waitlist.duplicate ? '이미 같은 날짜 대기자 명단에 등록되어 있습니다.' : '대기자 명단에 등록되었습니다.'}
                </div>
              ) : null}
              {waitlist.status === 'error' ? <p className={styles.error}>{waitlist.error}</p> : null}
              <button
                className={styles.button}
                type="button"
                onClick={submitWaitlist}
                disabled={waitlist.status === 'joining' || !customer.name || !customer.email || !customer.consent}
              >
                {waitlist.status === 'joining' ? 'Joining...' : 'Join waitlist'}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 3 ? (
        <div className={styles.formGrid}>
          <input style={{ display: 'none' }} tabIndex={-1} autoComplete="off" value={customer.company} onChange={(event) => setCustomer({ ...customer, company: event.target.value })} />
          <label className={styles.field}><span className={styles.label}>Name</span><input className={styles.input} value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
          <label className={styles.field}><span className={styles.label}>Email</span><input className={styles.input} type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
          <label className={styles.field}><span className={styles.label}>Phone</span><input className={styles.input} value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
          <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>Notes</span><textarea className={styles.textarea} value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} /></label>
          {showCaseSummary ? (
            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span className={styles.label}>{caseSummaryLabel}</span>
              <textarea className={styles.textarea} value={customer.caseSummary} onChange={(event) => setCustomer({ ...customer, caseSummary: event.target.value })} />
            </label>
          ) : null}
          {showAttachmentLinks ? (
            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span className={styles.label}>{attachmentLinksLabel}</span>
              <textarea className={styles.textarea} value={customer.attachmentLinks} onChange={(event) => setCustomer({ ...customer, attachmentLinks: event.target.value })} placeholder="https://drive.google.com/..." />
            </label>
          ) : null}
          {customLabels.map((label) => (
            <label className={`${styles.field} ${styles.fieldFull}`} key={label}>
              <span className={styles.label}>{label}</span>
              <input
                className={styles.input}
                value={customer.customFieldValues[label] ?? ''}
                onChange={(event) => setCustomer({
                  ...customer,
                  customFieldValues: { ...customer.customFieldValues, [label]: event.target.value },
                })}
              />
            </label>
          ))}
          {paidService ? (
            <div className={`${styles.paymentPanel} ${styles.fieldFull}`} data-booking-payment-panel="true">
              <div className={styles.paymentHeader}>
                <div>
                  <span className={styles.label}>Payment Element</span>
                  <p className={styles.muted}>
                    {selectedService?.priceCurrency ?? 'TWD'} {(selectedService?.priceAmount ?? selectedService?.priceTwd ?? 0).toLocaleString()} 결제 확인 후 예약이 확정됩니다.
                  </p>
                </div>
                <span className={styles.paymentChip} data-payment-status={payment.status}>
                  {payment.status}
                </span>
              </div>
              {payment.status === 'idle' || payment.status === 'error' ? (
                <button className={styles.buttonSecondary} type="button" onClick={preparePayment} disabled={!customer.name || !customer.email}>
                  결제 준비
                </button>
              ) : null}
              {payment.status === 'creating' ? <p className={styles.muted}>결제창을 준비 중입니다...</p> : null}
              {payment.status === 'ready' && payment.stub ? (
                <div className={styles.paymentElementMock} data-booking-payment-element="stub">
                  <strong>Stripe Payment Element</strong>
                  <span>개발 환경 테스트 결제</span>
                  <button className={styles.button} type="button" onClick={confirmPayment}>테스트 결제 완료</button>
                </div>
              ) : null}
              {(payment.status === 'ready' || payment.status === 'confirming') && !payment.stub ? (
                <>
                  <div className={styles.paymentElement} data-booking-payment-element="stripe" ref={paymentElementRef} />
                  {payment.status === 'ready' ? <button className={styles.button} type="button" onClick={confirmPayment}>결제 확인</button> : null}
                </>
              ) : null}
              {payment.status === 'confirming' ? <p className={styles.muted}>Stripe 결제를 확인 중입니다...</p> : null}
              {payment.status === 'confirmed' ? (
                <div className={styles.notice} data-booking-payment-confirmed="true">
                  결제가 확인되었습니다. 이제 예약을 확정할 수 있습니다.
                </div>
              ) : null}
              {payment.error ? <p className={styles.error}>{payment.error}</p> : null}
            </div>
          ) : null}
          <label className={`${styles.field} ${styles.fieldFull}`}>
            <span className={styles.label}>
              <input type="checkbox" checked={customer.consent} onChange={(event) => setCustomer({ ...customer, consent: event.target.checked })} /> 개인정보 수집 및 상담 예약 안내에 동의합니다.
            </span>
          </label>
        </div>
      ) : null}

      <div className={styles.actions}>
        {step > 0 ? <button className={styles.buttonSecondary} type="button" onClick={() => setStep((step - 1) as FlowStep)}>Back</button> : null}
        {step < 3 ? (
          <button className={styles.button} type="button" onClick={() => setStep((step + 1) as FlowStep)} disabled={(step === 0 && !serviceId) || (step === 1 && !staffId) || (step === 2 && !slot)}>Continue</button>
        ) : (
          <button
            className={styles.button}
            type="button"
            onClick={submit}
            disabled={loading || !customer.name || !customer.email || (paidService && payment.status !== 'confirmed')}
          >
            {loading ? 'Booking...' : 'Confirm booking'}
          </button>
        )}
      </div>
    </div>
  );
}
