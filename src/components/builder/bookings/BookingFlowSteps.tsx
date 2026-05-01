'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BookingService, Staff } from '@/lib/builder/bookings/types';
import type { Slot } from '@/lib/builder/bookings/availability';
import { textForLocale } from '@/lib/builder/bookings/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

type FlowStep = 0 | 1 | 2 | 3;

export interface BookingFlowStepsProps {
  locale?: Locale | string;
  serviceId?: string;
  staffId?: string;
  successMessage?: string;
  redirectAfterBooking?: string;
}

function todayPlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function BookingFlowSteps({
  locale: rawLocale = 'ko',
  serviceId: fixedServiceId,
  staffId: fixedStaffId,
  successMessage = '예약이 완료되었습니다',
  redirectAfterBooking,
}: BookingFlowStepsProps) {
  const locale = normalizeLocale(rawLocale);
  const [step, setStep] = useState<FlowStep>(0);
  const [services, setServices] = useState<BookingService[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [serviceId, setServiceId] = useState(fixedServiceId || '');
  const [staffId, setStaffId] = useState(fixedStaffId || '');
  const [date, setDate] = useState(todayPlus(1));
  const [slot, setSlot] = useState<Slot | null>(null);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', notes: '', consent: false, company: '' });
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedService = useMemo(() => services.find((service) => service.serviceId === serviceId), [serviceId, services]);
  const selectedStaff = useMemo(() => staff.find((member) => member.staffId === staffId), [staffId, staff]);

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
    const params = new URLSearchParams({ serviceId, staffId, date });
    fetch(`/api/booking/availability?${params.toString()}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data: { slots: Slot[] }) => setSlots(data.slots))
      .catch(() => setError('예약 가능 시간을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [date, serviceId, staffId]);

  const submit = async () => {
    if (!slot || !customer.consent) {
      setError('예약 시간과 개인정보 동의를 확인해 주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
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
            locale,
          },
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

  if (completed) {
    return (
      <div className={styles.flow}>
        <div className={styles.notice}>{successMessage}</div>
        <div className={styles.panel} style={{ boxShadow: 'none' }}>
          <h2 className={styles.cardTitle}>{textForLocale(selectedService?.name, locale)}</h2>
          <p className={styles.muted}>{selectedStaff ? textForLocale(selectedStaff.name, locale) : ''}</p>
          <p className={styles.muted}>{slot ? new Date(slot.startAt).toLocaleString(locale) : ''}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.flow}>
      <div className={styles.steps}>
        {['Service', 'Staff', 'Date & time', 'Info'].map((label, index) => (
          <div className={styles.step} data-active={step === index} key={label}>{index + 1}. {label}</div>
        ))}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}

      {step === 0 ? (
        <div className={styles.optionGrid}>
          {services.map((service) => (
            <button className={styles.option} data-active={service.serviceId === serviceId} key={service.serviceId} type="button" onClick={() => setServiceId(service.serviceId)}>
              <strong>{textForLocale(service.name, locale)}</strong>
              <p className={styles.muted}>{service.durationMinutes} min · TWD {service.priceTwd?.toLocaleString() || 0}</p>
              <p className={styles.muted}>{textForLocale(service.description, locale)}</p>
            </button>
          ))}
        </div>
      ) : null}

      {step === 1 ? (
        <div className={styles.optionGrid}>
          {staff.map((member) => (
            <button className={styles.option} data-active={member.staffId === staffId} key={member.staffId} type="button" onClick={() => setStaffId(member.staffId)}>
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
            <div className={styles.slots}>
              {slots.map((item) => (
                <button className={styles.slot} data-active={slot?.startAt === item.startAt} key={`${item.staffId}-${item.startAt}`} type="button" onClick={() => setSlot(item)}>
                  {new Date(item.startAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
              {!loading && slots.length === 0 ? <span className={styles.muted}>No available slots for this date.</span> : null}
            </div>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className={styles.formGrid}>
          <input style={{ display: 'none' }} tabIndex={-1} autoComplete="off" value={customer.company} onChange={(event) => setCustomer({ ...customer, company: event.target.value })} />
          <label className={styles.field}><span className={styles.label}>Name</span><input className={styles.input} value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
          <label className={styles.field}><span className={styles.label}>Email</span><input className={styles.input} type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
          <label className={styles.field}><span className={styles.label}>Phone</span><input className={styles.input} value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
          <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>Notes</span><textarea className={styles.textarea} value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} /></label>
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
          <button className={styles.button} type="button" onClick={submit} disabled={loading || !customer.name || !customer.email}>{loading ? 'Booking...' : 'Confirm booking'}</button>
        )}
      </div>
    </div>
  );
}
