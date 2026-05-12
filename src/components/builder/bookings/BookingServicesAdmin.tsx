'use client';

import { useMemo, useState } from 'react';
import type { BookingService, Staff } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

type ServiceDraft = {
  serviceId?: string;
  nameKo: string;
  nameZh: string;
  nameEn: string;
  descriptionKo: string;
  descriptionZh: string;
  descriptionEn: string;
  durationMinutes: number;
  priceTwd: number;
  image: string;
  category: string;
  staffIds: string[];
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  slotStepMinutes: number;
  isActive: boolean;
  paymentMode: 'free' | 'paid';
  priceAmount: number;
  priceCurrency: 'KRW' | 'USD' | 'TWD' | 'JPY' | 'EUR';
  meetingMode: 'in-person' | 'zoom' | 'phone' | 'hybrid';
  cancellationPolicyId: string;
};

function draftFromService(service?: BookingService): ServiceDraft {
  return {
    serviceId: service?.serviceId,
    nameKo: service?.name.ko || '',
    nameZh: service?.name['zh-hant'] || '',
    nameEn: service?.name.en || '',
    descriptionKo: service?.description.ko || '',
    descriptionZh: service?.description['zh-hant'] || '',
    descriptionEn: service?.description.en || '',
    durationMinutes: service?.durationMinutes || 30,
    priceTwd: service?.priceTwd || 0,
    image: service?.image || '',
    category: service?.category || 'consultation',
    staffIds: service?.staffIds || [],
    bufferBeforeMinutes: service?.bufferBeforeMinutes || 0,
    bufferAfterMinutes: service?.bufferAfterMinutes ?? 15,
    slotStepMinutes: service?.slotStepMinutes ?? 30,
    isActive: service?.isActive ?? true,
    paymentMode: service?.paymentMode ?? 'free',
    priceAmount: service?.priceAmount ?? service?.priceTwd ?? 0,
    priceCurrency: service?.priceCurrency ?? 'TWD',
    meetingMode: service?.meetingMode ?? 'in-person',
    cancellationPolicyId: service?.cancellationPolicyId ?? '',
  };
}

function servicePayload(draft: ServiceDraft) {
  const fallback = draft.nameKo || draft.nameEn || 'Consultation';
  return {
    name: {
      ko: draft.nameKo || fallback,
      'zh-hant': draft.nameZh || fallback,
      en: draft.nameEn || fallback,
    },
    description: {
      ko: draft.descriptionKo,
      'zh-hant': draft.descriptionZh || draft.descriptionKo,
      en: draft.descriptionEn || draft.descriptionKo,
    },
    durationMinutes: draft.durationMinutes,
    priceTwd: draft.priceTwd,
    image: draft.image,
    category: draft.category,
    staffIds: draft.staffIds,
    bufferBeforeMinutes: draft.bufferBeforeMinutes,
    bufferAfterMinutes: draft.bufferAfterMinutes,
    slotStepMinutes: draft.slotStepMinutes,
    isActive: draft.isActive,
    paymentMode: draft.paymentMode,
    priceAmount: draft.paymentMode === 'paid' ? draft.priceAmount : undefined,
    priceCurrency: draft.priceCurrency,
    meetingMode: draft.meetingMode,
    cancellationPolicyId: draft.cancellationPolicyId || undefined,
  };
}

export default function BookingServicesAdmin({
  locale,
  initialServices,
  staff,
}: {
  locale: Locale;
  initialServices: BookingService[];
  staff: Staff[];
}) {
  const [services, setServices] = useState(initialServices);
  const [draft, setDraft] = useState<ServiceDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const staffById = useMemo(() => new Map(staff.map((member) => [member.staffId, member])), [staff]);

  const save = async () => {
    if (!draft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const url = draft.serviceId
        ? `/api/builder/bookings/services/${draft.serviceId}`
        : '/api/builder/bookings/services';
      const res = await fetch(url, {
        method: draft.serviceId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(servicePayload(draft)),
      });
      if (!res.ok) throw new Error('save failed');
      const data = (await res.json()) as { service: BookingService };
      setServices((current) => {
        const without = current.filter((item) => item.serviceId !== data.service.serviceId);
        return [...without, data.service].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      });
      setDraft(null);
    } catch {
      setError('서비스를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (service: BookingService) => {
    const res = await fetch(`/api/builder/bookings/services/${service.serviceId}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) {
      const data = (await res.json()) as { service: BookingService };
      setServices((current) => current.map((item) => item.serviceId === service.serviceId ? data.service : item));
    }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.muted}>{services.length} services, including inactive drafts.</div>
        <button className={styles.button} type="button" onClick={() => setDraft(draftFromService())}>
          New service
        </button>
      </div>
      <div className={styles.grid}>
        {services.map((service) => (
          <article className={styles.card} key={service.serviceId}>
            <div className={styles.cardImage}>
              {service.image ? <img src={service.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'BOOK'}
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{textForLocale(service.name, locale)}</h2>
              <p className={styles.muted}>{textForLocale(service.description, locale)}</p>
              <div className={styles.metaRow}>
                <span className={styles.chip}>{service.durationMinutes} min</span>
                <span className={styles.chip}>TWD {service.priceTwd?.toLocaleString() || 0}</span>
                <span className={styles.chip}>{service.paymentMode === 'paid' ? `Paid ${service.priceCurrency ?? 'TWD'} ${(service.priceAmount ?? service.priceTwd ?? 0).toLocaleString()}` : 'Free booking'}</span>
                <span className={styles.chip}>{service.meetingMode ?? 'in-person'}</span>
                {service.cancellationPolicyId ? <span className={styles.chip}>Policy {service.cancellationPolicyId}</span> : null}
                <span className={styles.chip}>Every {service.slotStepMinutes ?? 30} min</span>
                <span className={styles.chip}>{service.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <p className={styles.muted}>
                Staff: {service.staffIds.map((id) => textForLocale(staffById.get(id)?.name, locale)).filter(Boolean).join(', ') || 'Any active staff'}
              </p>
              <div className={styles.actions}>
                <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(draftFromService(service))}>Edit</button>
                {service.isActive ? (
                  <button className={styles.buttonSecondary} type="button" onClick={() => deactivate(service)}>Deactivate</button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {draft ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{draft.serviceId ? 'Edit service' : 'New service'}</h2>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>Close</button>
            </div>
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span className={styles.label}>Name KO</span>
                <input className={styles.input} value={draft.nameKo} onChange={(e) => setDraft({ ...draft, nameKo: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Name EN</span>
                <input className={styles.input} value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Name ZH</span>
                <input className={styles.input} value={draft.nameZh} onChange={(e) => setDraft({ ...draft, nameZh: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Duration minutes</span>
                <input className={styles.input} type="number" min={15} value={draft.durationMinutes} onChange={(e) => setDraft({ ...draft, durationMinutes: Number(e.target.value) })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Price TWD</span>
                <input className={styles.input} type="number" min={0} value={draft.priceTwd} onChange={(e) => setDraft({ ...draft, priceTwd: Number(e.target.value) })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Payment mode</span>
                <select className={styles.select} value={draft.paymentMode} onChange={(e) => setDraft({ ...draft, paymentMode: e.target.value as ServiceDraft['paymentMode'] })}>
                  <option value="free">Free booking</option>
                  <option value="paid">Paid before booking</option>
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Payment amount</span>
                <input className={styles.input} type="number" min={0} value={draft.priceAmount} onChange={(e) => setDraft({ ...draft, priceAmount: Number(e.target.value) })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Payment currency</span>
                <select className={styles.select} value={draft.priceCurrency} onChange={(e) => setDraft({ ...draft, priceCurrency: e.target.value as ServiceDraft['priceCurrency'] })}>
                  <option value="TWD">TWD</option>
                  <option value="KRW">KRW</option>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Meeting mode</span>
                <select className={styles.select} value={draft.meetingMode} onChange={(e) => setDraft({ ...draft, meetingMode: e.target.value as ServiceDraft['meetingMode'] })}>
                  <option value="in-person">In-person</option>
                  <option value="zoom">Zoom auto link</option>
                  <option value="phone">Phone</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Cancellation policy</span>
                <select className={styles.select} value={draft.cancellationPolicyId} onChange={(e) => setDraft({ ...draft, cancellationPolicyId: e.target.value })}>
                  <option value="">No policy</option>
                  <option value="standard-24h">Standard: full 24h / partial 6h</option>
                  <option value="strict-48h">Strict: full 48h / partial 24h</option>
                  <option value="flexible-6h">Flexible: full 6h</option>
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Category</span>
                <input className={styles.input} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>
                  <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} /> Active
                </span>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Buffer before</span>
                <input className={styles.input} type="number" min={0} value={draft.bufferBeforeMinutes} onChange={(e) => setDraft({ ...draft, bufferBeforeMinutes: Number(e.target.value) })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Buffer after</span>
                <input className={styles.input} type="number" min={0} value={draft.bufferAfterMinutes} onChange={(e) => setDraft({ ...draft, bufferAfterMinutes: Number(e.target.value) })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Booking interval</span>
                <input className={styles.input} type="number" min={5} value={draft.slotStepMinutes} onChange={(e) => setDraft({ ...draft, slotStepMinutes: Number(e.target.value) })} />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Image URL</span>
                <input className={styles.input} value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Description KO</span>
                <textarea className={styles.textarea} value={draft.descriptionKo} onChange={(e) => setDraft({ ...draft, descriptionKo: e.target.value })} />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Description EN</span>
                <textarea className={styles.textarea} value={draft.descriptionEn} onChange={(e) => setDraft({ ...draft, descriptionEn: e.target.value })} />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Description ZH</span>
                <textarea className={styles.textarea} value={draft.descriptionZh} onChange={(e) => setDraft({ ...draft, descriptionZh: e.target.value })} />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Staff</span>
                <div className={styles.metaRow}>
                  {staff.map((member) => (
                    <label className={styles.chip} key={member.staffId}>
                      <input
                        type="checkbox"
                        checked={draft.staffIds.includes(member.staffId)}
                        onChange={(event) => {
                          const staffIds = event.target.checked
                            ? [...draft.staffIds, member.staffId]
                            : draft.staffIds.filter((id) => id !== member.staffId);
                          setDraft({ ...draft, staffIds });
                        }}
                      />{' '}
                      {textForLocale(member.name, locale)}
                    </label>
                  ))}
                </div>
              </label>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save service'}</button>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
