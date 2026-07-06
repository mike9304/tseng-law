'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { BookingService, Staff } from '@/lib/builder/bookings/types';
import type { Slot } from '@/lib/builder/bookings/availability';
import { getBookingFlowCopy } from '@/lib/builder/bookings/bookings-copy';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';
import { textForLocale } from '@/lib/builder/bookings/types';
import { formatDateTimeInTimezone, formatTimeInTimezone } from '@/lib/builder/bookings/timezone';
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
  initialCustomer?: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    caseSummary?: string;
    attachmentLinks?: string;
    customFieldValues?: Record<string, string>;
    consent?: boolean;
    company?: string;
  };
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

function formatBookingAmount(amount: number, currency: string): string {
  return `${currency} ${Math.max(0, amount).toLocaleString()}`;
}

function normalizeDiscountInput(value: string): string {
  return value.trim().toUpperCase().slice(0, 32);
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
  initialCustomer,
}: BookingFlowStepsProps) {
  const locale = normalizeLocale(rawLocale);
  const copy = getBookingFlowCopy(locale);
  const customerTimezone = browserTimezone();
  const customLabels = useMemo(() => parseCustomFieldLabels(customFieldLabels), [customFieldLabels]);
  const [step, setStep] = useState<FlowStep>(0);
  const [services, setServices] = useState<BookingService[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [serviceId, setServiceId] = useState(fixedServiceId || '');
  const [staffId, setStaffId] = useState(fixedStaffId || '');
  const [discountDraft, setDiscountDraft] = useState('');
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('');
  const [date, setDate] = useState(todayPlus(1));
  const [slot, setSlot] = useState<Slot | null>(null);
  const [customer, setCustomer] = useState({
    name: initialCustomer?.name || '',
    email: initialCustomer?.email || '',
    phone: initialCustomer?.phone || '',
    notes: initialCustomer?.notes || '',
    caseSummary: initialCustomer?.caseSummary || '',
    attachmentLinks: initialCustomer?.attachmentLinks || '',
    customFieldValues: { ...(initialCustomer?.customFieldValues || {}) } as Record<string, string>,
    consent: initialCustomer?.consent || false,
    company: initialCustomer?.company || '',
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
    totalAmount?: number;
    depositAmount?: number;
    balanceDueAfterPayment?: number;
    isDeposit?: boolean;
    discountCode?: string;
    discountAmount?: number;
    currency?: string;
    stub?: boolean;
    coveredByPackage?: boolean;
    packageCreditId?: string;
    packageName?: string;
    remainingCredits?: number;
    error?: string;
  }>({ status: 'idle' });
  const stripeRefs = useRef<{ stripe: StripeLike; elements: StripeElementsLike; element: { unmount?(): void } } | null>(null);
  const paymentElementRef = useRef<HTMLDivElement | null>(null);

  const selectedService = useMemo(() => services.find((service) => service.serviceId === serviceId), [serviceId, services]);
  const selectedStaff = useMemo(() => staff.find((member) => member.staffId === staffId), [staffId, staff]);
  const selectedPrice = useMemo(
    () => selectedService
      ? bookingServicePriceSnapshot(selectedService, {
          staffId,
          resourceIds: selectedService.requiredResourceIds,
          discountCode: appliedDiscountCode || undefined,
          locale,
        })
      : null,
    [appliedDiscountCode, locale, selectedService, staffId],
  );
  const requiresUpfrontPayment = Boolean(selectedPrice?.paymentRequired && selectedPrice.amountDueNow > 0);
  const hasDiscountCodes = Boolean(selectedService?.paymentMode === 'paid' && selectedService.discountCodes?.length);
  const discountAppliedMessage = selectedPrice?.discountCode && selectedPrice.discountAmount
    ? copy.labels.discountApplied(selectedPrice.discountCode, formatBookingAmount(selectedPrice.discountAmount, selectedPrice.currency))
    : null;
  const loadErrorCopy = useMemo(() => ({
    services: locale === 'ko' ? '서비스 목록을 불러오지 못했습니다.' : locale === 'zh-hant' ? '無法載入服務清單。' : 'Unable to load services.',
    staff: locale === 'ko' ? '담당자 목록을 불러오지 못했습니다.' : locale === 'zh-hant' ? '無法載入員工清單。' : 'Unable to load staff.',
    availability: locale === 'ko' ? '예약 가능 시간을 불러오지 못했습니다.' : locale === 'zh-hant' ? '無法載入可預約時段。' : 'Unable to load available times.',
  }), [locale]);

  useEffect(() => {
    fetch(`/api/booking/services?locale=${locale}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error((data as { error?: string }).error || loadErrorCopy.services);
        return data;
      })
      .then((data: { services: BookingService[] }) => {
        setServices(data.services);
        if (!fixedServiceId && data.services[0]) setServiceId(data.services[0].serviceId);
      })
      .catch((err) => setError(err instanceof Error ? err.message : loadErrorCopy.services));
  }, [fixedServiceId, loadErrorCopy.services, locale]);

  useEffect(() => {
    if (!serviceId) return;
    fetch(`/api/booking/staff?serviceId=${encodeURIComponent(serviceId)}&locale=${locale}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error((data as { error?: string }).error || loadErrorCopy.staff);
        return data;
      })
      .then((data: { staff: Staff[] }) => {
        setStaff(data.staff);
        if (!fixedStaffId && data.staff[0]) setStaffId(data.staff[0].staffId);
      })
      .catch((err) => setError(err instanceof Error ? err.message : loadErrorCopy.staff));
  }, [fixedStaffId, loadErrorCopy.staff, locale, serviceId]);

  useEffect(() => {
    if (!serviceId || !staffId || !date) return;
    setLoading(true);
    setSlot(null);
    setWaitlist({ status: 'idle' });
    const params = new URLSearchParams({ serviceId, staffId, date, locale });
    fetch(`/api/booking/availability?${params.toString()}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error((data as { error?: string }).error || loadErrorCopy.availability);
        return data;
      })
      .then((data: { slots: Slot[] }) => setSlots(data.slots))
      .catch((err) => setError(err instanceof Error ? err.message : loadErrorCopy.availability))
      .finally(() => setLoading(false));
  }, [date, loadErrorCopy.availability, locale, serviceId, staffId]);

  useEffect(() => {
    setDiscountDraft('');
    setAppliedDiscountCode('');
  }, [serviceId]);

  useEffect(() => {
    stripeRefs.current?.element.unmount?.();
    stripeRefs.current = null;
    setPayment({ status: 'idle' });
  }, [appliedDiscountCode, customer.email, customer.name, serviceId, staffId]);

  useEffect(() => {
    if (!requiresUpfrontPayment || payment.status !== 'ready' || payment.stub || !payment.clientSecret || !payment.publishableKey) return;
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
          error: err instanceof Error ? err.message : (locale === 'ko' ? 'Stripe Payment Element를 불러오지 못했습니다.' : locale === 'zh-hant' ? '無法載入 Stripe 付款元件。' : 'Could not load the Stripe Payment Element.'),
        }));
      }
    }
    void mountStripeElement();
    return () => {
      cancelled = true;
      stripeRefs.current?.element.unmount?.();
      stripeRefs.current = null;
    };
  }, [locale, requiresUpfrontPayment, payment.clientSecret, payment.publishableKey, payment.status, payment.stub]);

  const preparePayment = async () => {
    if (!requiresUpfrontPayment) return;
    if (!customer.name || !customer.email) {
      setError(copy.labels.paymentConfirmNeeded);
      return;
    }
    setPayment({ status: 'creating' });
    setError(null);
    try {
      const paymentRes = await fetch(`/api/booking/payment-intent?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          staffId,
          customer: { name: customer.name, email: customer.email },
          discountCode: selectedPrice?.discountCode,
        }),
      });
      const payload = (await paymentRes.json().catch(() => ({}))) as {
        paymentIntentId?: string;
        clientSecret?: string;
        publishableKey?: string;
        amount?: number;
        totalAmount?: number;
        depositAmount?: number;
        balanceDueAfterPayment?: number;
        isDeposit?: boolean;
        discountCode?: string;
        discountAmount?: number;
        currency?: string;
        stub?: boolean;
        coveredByPackage?: boolean;
        packageCreditId?: string;
        packageName?: { ko: string; 'zh-hant': string; en: string };
        remainingCredits?: number;
        error?: string;
      };
      if (payload.coveredByPackage) {
        setPayment({
          status: 'confirmed',
          coveredByPackage: true,
          packageCreditId: payload.packageCreditId,
          packageName: textForLocale(payload.packageName, locale) || 'Session package',
          remainingCredits: payload.remainingCredits,
        });
        return;
      }
      if (!paymentRes.ok || !payload.clientSecret) {
        throw new Error(payload.error || 'payment intent failed');
      }
      setPayment({
        status: 'ready',
        paymentIntentId: payload.paymentIntentId ?? (payload.stub ? 'pi_stub_dev' : undefined),
        clientSecret: payload.clientSecret,
        publishableKey: payload.publishableKey,
        amount: payload.amount,
        totalAmount: payload.totalAmount,
        depositAmount: payload.depositAmount,
        balanceDueAfterPayment: payload.balanceDueAfterPayment,
        isDeposit: payload.isDeposit,
        discountCode: payload.discountCode,
        discountAmount: payload.discountAmount,
        currency: payload.currency,
        stub: payload.stub,
      });
    } catch (err) {
      setPayment({
        status: 'error',
        error: err instanceof Error ? err.message : (locale === 'ko' ? '결제를 준비하지 못했습니다.' : locale === 'zh-hant' ? '無法準備付款。' : 'Could not prepare payment.'),
      });
    }
  };

  const confirmPayment = async () => {
    if (!requiresUpfrontPayment) return;
    if (payment.stub) {
      setPayment((current) => ({
        ...current,
        status: 'confirmed',
        paymentIntentId: current.paymentIntentId ?? 'pi_stub_dev',
      }));
      return;
    }
    if (!payment.paymentIntentId || !stripeRefs.current) {
      setPayment((current) => ({ ...current, status: 'error', error: locale === 'ko' ? 'Payment Element가 아직 준비되지 않았습니다.' : locale === 'zh-hant' ? '付款元素尚未準備完成。' : 'Payment Element is not ready yet.' }));
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
        error: err instanceof Error ? err.message : (locale === 'ko' ? '결제 확인에 실패했습니다.' : locale === 'zh-hant' ? '付款確認失敗。' : 'Could not confirm payment.'),
      }));
    }
  };

  const submit = async () => {
    const fallbackError =
      locale === 'ko'
        ? '예약을 완료하지 못했습니다. 다른 시간을 선택해 주세요.'
        : locale === 'zh-hant'
          ? '無法完成預約，請選擇其他時段。'
          : 'Could not complete the booking. Please choose another time.';
    if (!slot || !customer.consent) {
      setError(locale === 'ko' ? '예약 시간과 개인정보 동의를 확인해 주세요.' : locale === 'zh-hant' ? '請確認預約時間與個資同意。' : 'Please confirm the booking time and privacy consent.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let paymentIntentId: string | undefined;
      if (requiresUpfrontPayment) {
        if (payment.status !== 'confirmed' || (!payment.paymentIntentId && !payment.coveredByPackage)) {
          throw new Error(copy.labels.paymentConfirmNeeded);
        }
        paymentIntentId = payment.coveredByPackage ? undefined : payment.paymentIntentId;
      }
      const customFields = customLabels.map((label) => ({
        label,
        value: customer.customFieldValues[label] ?? '',
      }));
      const res = await fetch(`/api/booking/book?locale=${encodeURIComponent(locale)}`, {
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
          discountCode: selectedPrice?.discountCode,
          paymentIntentId,
          company: customer.company,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(payload.error || fallbackError);
      setCompleted(true);
      if (redirectAfterBooking) window.location.href = redirectAfterBooking;
    } catch (err) {
      setError(err instanceof Error ? err.message : fallbackError);
    } finally {
      setLoading(false);
    }
  };

  const submitWaitlist = async () => {
    if (!serviceId || !staffId || !date) return;
    if (!customer.name || !customer.email || !customer.consent) {
      setWaitlist({ status: 'error', error: locale === 'ko' ? '이름, 이메일, 개인정보 동의를 확인해 주세요.' : locale === 'zh-hant' ? '請確認姓名、電子郵件與個資同意。' : 'Please confirm your name, email, and privacy consent.' });
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
        error: err instanceof Error ? err.message : (locale === 'ko' ? '대기 등록을 완료하지 못했습니다.' : locale === 'zh-hant' ? '無法完成候補登記。' : 'Could not join the waitlist.'),
      });
    }
  };

  const applyDiscountCode = () => {
    const code = normalizeDiscountInput(discountDraft);
    setDiscountDraft(code);
    setAppliedDiscountCode(code);
  };

  if (completed) {
    return (
      <div className={styles.flow} data-booking-flow="true">
        <div className={styles.notice}>{successMessage}</div>
        <div className={styles.panel} style={{ boxShadow: 'none' }}>
          <h2 className={styles.cardTitle}>{textForLocale(selectedService?.name, locale)}</h2>
          <p className={styles.muted}>{selectedStaff ? textForLocale(selectedStaff.name, locale) : ''}</p>
          <p className={styles.muted} data-booking-confirmed-timezone="true">{slot ? `${formatDateTimeInTimezone(slot.startAt, locale, customerTimezone)} · ${customerTimezone}` : ''}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.flow} data-booking-flow="true">
      <div className={styles.steps}>
        {copy.steps.map((label, index) => (
          <div className={styles.step} data-active={step === index} key={label}>{index + 1}. {label}</div>
        ))}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}

      {step === 0 ? (
        <div className={styles.optionGrid}>
          {services.map((service) => {
            const servicePrice = bookingServicePriceSnapshot(service, { resourceIds: service.requiredResourceIds });
            const paymentSummary = service.paymentMode === 'paid'
              ? servicePrice.payLater
                ? `${formatBookingAmount(servicePrice.totalAmount, servicePrice.currency)} ${copy.labels.laterBalance}`
                : `${formatBookingAmount(servicePrice.amountDueNow, servicePrice.currency)} ${copy.labels.serviceDueNow}${servicePrice.isDeposit ? ` · ${copy.labels.total} ${formatBookingAmount(servicePrice.totalAmount, servicePrice.currency)}` : ''}`
              : `${service.priceCurrency ?? 'TWD'} ${service.priceTwd?.toLocaleString() || 0}`;
            const paymentModeLabel = service.paymentMode === 'paid'
              ? servicePrice.payLater ? copy.labels.paymentModePayLater : copy.labels.paymentModeConfirmed
              : copy.labels.paymentModeFree;
            return (
              <button className={styles.option} data-active={service.serviceId === serviceId} data-booking-service-id={service.serviceId} key={service.serviceId} type="button" onClick={() => setServiceId(service.serviceId)}>
                <strong>{textForLocale(service.name, locale)}</strong>
                <p className={styles.muted}>
                  {service.durationMinutes} {locale === 'ko' ? '분' : locale === 'zh-hant' ? '分鐘' : 'min'} · {paymentSummary}
                </p>
                <p className={styles.muted}>
                  {paymentModeLabel} · {service.slotStepMinutes ?? 30}{locale === 'ko' ? '분 간격' : locale === 'zh-hant' ? '分鐘間隔' : 'min interval'}
                </p>
                {(service.maxParticipants ?? 1) > 1 ? (
                  <p className={styles.muted}>{copy.labels.groupCapacity} {service.maxParticipants}{locale === 'ko' ? '명' : locale === 'zh-hant' ? '位' : 'seats'}</p>
                ) : null}
                <p className={styles.muted}>{textForLocale(service.description, locale)}</p>
              </button>
            );
          })}
        </div>
      ) : null}

      {step === 1 ? (
        <div className={styles.optionGrid}>
          {staff.map((member) => {
            const memberPrice = selectedService
              ? bookingServicePriceSnapshot(selectedService, {
                  staffId: member.staffId,
                  resourceIds: selectedService.requiredResourceIds,
                })
              : null;
            const memberPriceSummary = selectedService?.paymentMode === 'paid' && memberPrice
              ? memberPrice.payLater
                ? `${formatBookingAmount(memberPrice.totalAmount, memberPrice.currency)} ${copy.labels.laterBalance}`
                : `${formatBookingAmount(memberPrice.amountDueNow, memberPrice.currency)} ${copy.labels.serviceDueNow}${memberPrice.isDeposit ? ` · ${copy.labels.total} ${formatBookingAmount(memberPrice.totalAmount, memberPrice.currency)}` : ''}`
              : null;
            return (
              <button className={styles.option} data-active={member.staffId === staffId} data-booking-staff-id={member.staffId} key={member.staffId} type="button" onClick={() => setStaffId(member.staffId)}>
                <strong>{textForLocale(member.name, locale)}</strong>
                <p className={styles.muted}>{textForLocale(member.title, locale)}</p>
                {memberPriceSummary ? <p className={styles.muted} data-booking-staff-price="true">{memberPriceSummary}</p> : null}
                <p className={styles.muted}>{textForLocale(member.bio, locale)}</p>
              </button>
            );
          })}
        </div>
      ) : null}

      {step === 2 ? (
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.label}>{copy.labels.date}</span>
            <input className={styles.input} type="date" min={todayPlus(0)} value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <span className={styles.label}>{loading ? copy.labels.loadingSlots : copy.labels.availableTimes}</span>
            <p className={styles.muted} data-booking-customer-timezone="true">{copy.labels.customerTimezoneLabel}: {customerTimezone}</p>
            <div className={styles.slots}>
              {slots.map((item) => (
                <button className={styles.slot} data-active={slot?.startAt === item.startAt} data-booking-slot-start={item.startAt} key={`${item.staffId}-${item.startAt}`} type="button" onClick={() => setSlot(item)}>
                  <span data-booking-slot-customer-time="true">{formatTimeInTimezone(item.startAt, locale, customerTimezone)}</span>
                  {item.timezone !== customerTimezone ? <span data-booking-slot-office-time="true"> / {formatTimeInTimezone(item.startAt, locale, item.timezone)} {item.timezone}</span> : null}
                  {item.capacityTotal && item.capacityTotal > 1 ? ` · ${item.capacityRemaining ?? item.capacityTotal}/${item.capacityTotal} ${copy.labels.slotCapacity}` : ''}
                </button>
              ))}
              {!loading && slots.length === 0 ? <span className={styles.muted}>{copy.labels.noSlots}</span> : null}
            </div>
          </div>
          {!loading && slots.length === 0 ? (
            <div className={`${styles.waitlistPanel} ${styles.fieldFull}`} data-booking-waitlist="true">
              <div>
                <span className={styles.label}>{copy.labels.waitlist}</span>
                <p className={styles.muted}>{copy.labels.waitlistDescription}</p>
              </div>
              <input style={{ display: 'none' }} tabIndex={-1} autoComplete="off" value={customer.company} onChange={(event) => setCustomer({ ...customer, company: event.target.value })} />
              <div className={styles.waitlistFields}>
                <label className={styles.field}><span className={styles.label}>{copy.labels.name}</span><input className={styles.input} value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
                <label className={styles.field}><span className={styles.label}>{copy.labels.email}</span><input className={styles.input} type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
                <label className={styles.field}><span className={styles.label}>{copy.labels.phone}</span><input className={styles.input} value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
                <label className={styles.field}><span className={styles.label}>{copy.labels.notes}</span><input className={styles.input} value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} /></label>
              </div>
              <label className={styles.label}>
                <input type="checkbox" checked={customer.consent} onChange={(event) => setCustomer({ ...customer, consent: event.target.checked })} /> {copy.labels.consentWaitlist}
              </label>
              {waitlist.status === 'joined' ? (
                <div className={styles.notice} data-booking-waitlist-confirmed="true">
                  {waitlist.duplicate ? copy.labels.waitlistDuplicate : copy.labels.waitlistJoined}
                </div>
              ) : null}
              {waitlist.status === 'error' ? <p className={styles.error}>{waitlist.error}</p> : null}
              <button
                className={styles.button}
                type="button"
                onClick={submitWaitlist}
                disabled={waitlist.status === 'joining' || !customer.name || !customer.email || !customer.consent}
              >
                {waitlist.status === 'joining' ? copy.labels.joining : copy.labels.joinWaitlist}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 3 ? (
        <div className={styles.formGrid}>
          <input style={{ display: 'none' }} tabIndex={-1} autoComplete="off" value={customer.company} onChange={(event) => setCustomer({ ...customer, company: event.target.value })} />
          <label className={styles.field}><span className={styles.label}>{copy.labels.name}</span><input className={styles.input} value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
          <label className={styles.field}><span className={styles.label}>{copy.labels.email}</span><input className={styles.input} type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
          <label className={styles.field}><span className={styles.label}>{copy.labels.phone}</span><input className={styles.input} value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
          <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>{copy.labels.notes}</span><textarea className={styles.textarea} value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} /></label>
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
          {hasDiscountCodes ? (
            <div className={`${styles.discountPanel} ${styles.fieldFull}`} data-booking-discount-panel="true">
              <label className={styles.field}>
                <span className={styles.label}>{copy.labels.discountCode}</span>
                <input
                  className={styles.input}
                  data-booking-discount-input="true"
                  value={discountDraft}
                  onChange={(event) => setDiscountDraft(event.target.value.toUpperCase().slice(0, 32))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      applyDiscountCode();
                    }
                  }}
                />
              </label>
              <button
                className={styles.buttonSecondary}
                data-booking-discount-apply="true"
                disabled={!discountDraft.trim() && !appliedDiscountCode}
                type="button"
                onClick={applyDiscountCode}
              >
                {copy.labels.discountApply}
              </button>
              {discountAppliedMessage ? (
                <p className={styles.discountSuccess} data-booking-discount-applied="true">{discountAppliedMessage}</p>
              ) : appliedDiscountCode ? (
                <p className={styles.discountError} data-booking-discount-error="true">{copy.labels.discountUnavailable}</p>
              ) : null}
            </div>
          ) : null}
          {requiresUpfrontPayment ? (
            <div className={`${styles.paymentPanel} ${styles.fieldFull}`} data-booking-payment-panel="true">
              <div className={styles.paymentHeader}>
                <div>
                  <span className={styles.label}>{copy.labels.paymentElement}</span>
                  <p className={styles.muted}>
                    {payment.coveredByPackage
                      ? `${payment.packageName || copy.labels.sessionPackage} ${locale === 'ko' ? '크레딧으로 예약합니다.' : locale === 'zh-hant' ? '點數將用於此預約。' : 'credit will be used for this booking.'}`
                      : selectedPrice?.isDeposit
                        ? `${formatBookingAmount(selectedPrice.amountDueNow, selectedPrice.currency)} ${copy.labels.serviceDueNow} · ${copy.labels.depositDue} ${copy.labels.laterBalance}`
                        : `${formatBookingAmount(selectedPrice?.amountDueNow ?? 0, selectedPrice?.currency ?? selectedService?.priceCurrency ?? 'TWD')} ${copy.labels.paymentModeConfirmed}`}
                  </p>
                </div>
                <span className={styles.paymentChip} data-payment-status={payment.status}>
                  {copy.labels.paymentStatus[payment.status]}
                </span>
              </div>
              {payment.status === 'idle' || payment.status === 'error' ? (
                <button className={styles.buttonSecondary} type="button" onClick={preparePayment} disabled={!customer.name || !customer.email}>
                  {copy.labels.paymentPrepare}
                </button>
              ) : null}
              {payment.status === 'creating' ? <p className={styles.muted}>{copy.labels.paymentLoading}</p> : null}
              {payment.status === 'ready' && payment.stub ? (
                <div className={styles.paymentElementMock} data-booking-payment-element="stub">
                  <strong>{copy.labels.paymentStubTitle}</strong>
                  <span>{copy.labels.paymentStubSubtitle}</span>
                  <button className={styles.button} type="button" onClick={confirmPayment}>{copy.labels.paymentStubComplete}</button>
                </div>
              ) : null}
              {(payment.status === 'ready' || payment.status === 'confirming') && !payment.stub ? (
                <>
                  <div className={styles.paymentElement} data-booking-payment-element="stripe" ref={paymentElementRef} />
                  {payment.status === 'ready' ? <button className={styles.button} type="button" onClick={confirmPayment}>{copy.labels.paymentConfirm}</button> : null}
                </>
              ) : null}
              {payment.status === 'confirming' ? <p className={styles.muted}>{copy.labels.paymentConfirming}</p> : null}
              {payment.status === 'confirmed' ? (
                <div className={styles.notice} data-booking-payment-confirmed="true">
                  {payment.coveredByPackage
                    ? `${copy.labels.paymentConfirmedPackage}${payment.remainingCredits ? ` ${locale === 'ko' ? `현재 ${payment.remainingCredits}회 남음.` : locale === 'zh-hant' ? `目前剩餘 ${payment.remainingCredits} 次。` : `${payment.remainingCredits} credits remain.`}` : ''}`
                    : copy.labels.paymentConfirmedBooking}
                </div>
              ) : null}
              {payment.error ? <p className={styles.error}>{payment.error}</p> : null}
            </div>
          ) : null}
          <label className={`${styles.field} ${styles.fieldFull}`}>
            <span className={styles.label}>
              <input type="checkbox" checked={customer.consent} onChange={(event) => setCustomer({ ...customer, consent: event.target.checked })} /> {locale === 'ko' ? '개인정보 수집 및 상담 예약 안내에 동의합니다.' : locale === 'zh-hant' ? '我同意個資蒐集與預約通知。' : 'I agree to the privacy collection and booking notice.'}
            </span>
          </label>
        </div>
      ) : null}

      <div className={styles.actions}>
        {step > 0 ? <button className={styles.buttonSecondary} type="button" onClick={() => setStep((step - 1) as FlowStep)}>{copy.labels.back}</button> : null}
        {step < 3 ? (
          <button className={styles.button} type="button" onClick={() => setStep((step + 1) as FlowStep)} disabled={(step === 0 && !serviceId) || (step === 1 && !staffId) || (step === 2 && !slot)}>{copy.labels.continue}</button>
        ) : (
          <button
            className={styles.button}
            type="button"
            onClick={submit}
            disabled={loading || !customer.name || !customer.email || (requiresUpfrontPayment && (payment.status !== 'confirmed' || (!payment.paymentIntentId && !payment.coveredByPackage)))}
          >
            {loading ? copy.labels.bookingInProgress : copy.labels.confirmBooking}
          </button>
        )}
      </div>
    </div>
  );
}
