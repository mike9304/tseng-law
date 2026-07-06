'use client';

import type { BookingCancellationPolicy, BookingDiscountRule } from '@/lib/builder/bookings/types';
import type { BookingServicesAdminCopy } from './BookingServicesAdmin.copy';
import type { ServiceDraft } from './BookingServiceDraft';
import { toggleReminderHour } from './BookingServiceDraft';
import styles from './BookingsAdmin.module.css';

type BookingServiceEditorBasicsProps = {
  readonly draft: ServiceDraft;
  readonly cancellationPolicies: readonly BookingCancellationPolicy[];
  readonly copy: BookingServicesAdminCopy;
  readonly onDraftChange: (draft: ServiceDraft) => void;
};

export function BookingServiceEditorBasics({ draft, cancellationPolicies, copy: c, onDraftChange }: BookingServiceEditorBasicsProps) {
  const updateDiscountCode = (index: number, patch: Partial<BookingDiscountRule>) => {
    onDraftChange({
      ...draft,
      discountCodes: draft.discountCodes.map((rule, currentIndex) => currentIndex === index ? { ...rule, ...patch } : rule),
    });
  };
  const addDiscountCode = () => {
    onDraftChange({
      ...draft,
      discountCodes: [...draft.discountCodes, { code: '', type: 'percent', value: 10, active: true, locale: 'all' }],
    });
  };
  const removeDiscountCode = (index: number) => {
    onDraftChange({
      ...draft,
      discountCodes: draft.discountCodes.filter((_, currentIndex) => currentIndex !== index),
    });
  };

  return (
    <>
      <label className={styles.field}>
        <span className={styles.label}>{c.nameKo}</span>
        <input className={styles.input} value={draft.nameKo} onChange={(event) => onDraftChange({ ...draft, nameKo: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.nameEn}</span>
        <input className={styles.input} value={draft.nameEn} onChange={(event) => onDraftChange({ ...draft, nameEn: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.nameZh}</span>
        <input className={styles.input} value={draft.nameZh} onChange={(event) => onDraftChange({ ...draft, nameZh: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.durationMinutes}</span>
        <input className={styles.input} min={15} type="number" value={draft.durationMinutes} onChange={(event) => onDraftChange({ ...draft, durationMinutes: Number(event.target.value) })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.priceTwd}</span>
        <input className={styles.input} min={0} type="number" value={draft.priceTwd} onChange={(event) => onDraftChange({ ...draft, priceTwd: Number(event.target.value) })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.paymentMode}</span>
        <select
          className={styles.select}
          value={draft.paymentMode}
          onChange={(event) => onDraftChange({
            ...draft,
            collectPaymentLater: event.target.value === 'paid' ? draft.collectPaymentLater : false,
            paymentMode: event.target.value as ServiceDraft['paymentMode'],
          })}
        >
          <option value="free">{c.freeOption}</option>
          <option value="paid">{c.paidOption}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>
          <input
            checked={draft.collectPaymentLater}
            disabled={draft.paymentMode !== 'paid'}
            type="checkbox"
            onChange={(event) => onDraftChange({
              ...draft,
              collectPaymentLater: event.target.checked,
              depositAmount: event.target.checked ? 0 : draft.depositAmount,
            })}
          /> {c.collectPaymentLater}
        </span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.paymentAmount}</span>
        <input className={styles.input} min={0} type="number" value={draft.priceAmount} onChange={(event) => onDraftChange({ ...draft, priceAmount: Number(event.target.value) })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.depositDueNow}</span>
        <input
          className={styles.input}
          disabled={draft.collectPaymentLater}
          min={0}
          type="number"
          value={draft.depositAmount}
          onChange={(event) => onDraftChange({ ...draft, depositAmount: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.paymentCurrency}</span>
        <select className={styles.select} value={draft.priceCurrency} onChange={(event) => onDraftChange({ ...draft, priceCurrency: event.target.value as ServiceDraft['priceCurrency'] })}>
          <option value="TWD">TWD</option>
          <option value="KRW">KRW</option>
          <option value="USD">USD</option>
          <option value="JPY">JPY</option>
          <option value="EUR">EUR</option>
        </select>
      </label>
      {draft.paymentMode === 'paid' ? (
        <fieldset className={`${styles.field} ${styles.fieldFull}`}>
          <legend className={styles.label}>{c.discountCodes}</legend>
          <div className={styles.discountRows}>
            {draft.discountCodes.map((rule, index) => (
              <div className={styles.discountRow} data-booking-service-discount-row="true" key={`${index}-${rule.code}`}>
                <label className={styles.field}>
                  <span className={styles.label}>{c.discountCode}</span>
                  <input
                    className={styles.input}
                    data-booking-service-discount-code-input="true"
                    value={rule.code}
                    onChange={(event) => updateDiscountCode(index, { code: event.target.value.toUpperCase().slice(0, 32) })}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>{c.discountType}</span>
                  <select
                    className={styles.select}
                    data-booking-service-discount-type="true"
                    value={rule.type}
                    onChange={(event) => updateDiscountCode(index, { type: event.target.value as BookingDiscountRule['type'] })}
                  >
                    <option value="percent">{c.discountPercent}</option>
                    <option value="fixed">{c.discountFixed}</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>{c.discountValue}</span>
                  <input
                    className={styles.input}
                    data-booking-service-discount-value="true"
                    max={rule.type === 'percent' ? 100 : undefined}
                    min={1}
                    type="number"
                    value={rule.value}
                    onChange={(event) => updateDiscountCode(index, { value: Number(event.target.value) })}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>{c.discountLocale}</span>
                  <select
                    className={styles.select}
                    value={rule.locale ?? 'all'}
                    onChange={(event) => updateDiscountCode(index, { locale: event.target.value as BookingDiscountRule['locale'] })}
                  >
                    <option value="all">{c.discountAllLocales}</option>
                    <option value="ko">KO</option>
                    <option value="en">EN</option>
                    <option value="zh-hant">ZH</option>
                  </select>
                </label>
                <label className={styles.label}>
                  <input
                    checked={rule.active !== false}
                    data-booking-service-discount-active="true"
                    type="checkbox"
                    onChange={(event) => updateDiscountCode(index, { active: event.target.checked })}
                  /> {c.discountActive}
                </label>
                <button
                  className={styles.buttonSecondary}
                  data-booking-service-discount-remove="true"
                  type="button"
                  onClick={() => removeDiscountCode(index)}
                >
                  {c.removeDiscountCode}
                </button>
              </div>
            ))}
          </div>
          <div className={styles.inlineActions}>
            <button className={styles.buttonSecondary} data-booking-service-discount-add="true" type="button" onClick={addDiscountCode}>
              {c.addDiscountCode}
            </button>
          </div>
          <p className={styles.muted}>{c.discountCodesHint}</p>
        </fieldset>
      ) : null}
      <label className={styles.field}>
        <span className={styles.label}>{c.meetingMode}</span>
        <select className={styles.select} value={draft.meetingMode} onChange={(event) => onDraftChange({ ...draft, meetingMode: event.target.value as ServiceDraft['meetingMode'] })}>
          <option value="in-person">{c.inPerson}</option>
          <option value="zoom">{c.zoom}</option>
          <option value="phone">{c.phone}</option>
          <option value="hybrid">{c.hybrid}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.cancellationPolicy}</span>
        <select
          className={styles.select}
          data-booking-service-policy-select="true"
          value={draft.cancellationPolicyId}
          onChange={(event) => onDraftChange({ ...draft, cancellationPolicyId: event.target.value })}
        >
          <option value="">{c.noPolicy}</option>
          {cancellationPolicies.map((policy) => <option key={policy.policyId} value={policy.policyId}>{c.policyLabel(policy)}</option>)}
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.category}</span>
        <input className={styles.input} value={draft.category} onChange={(event) => onDraftChange({ ...draft, category: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>
          <input checked={draft.isActive} type="checkbox" onChange={(event) => onDraftChange({ ...draft, isActive: event.target.checked })} /> {c.activeLabel}
        </span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.bufferBefore}</span>
        <input className={styles.input} min={0} type="number" value={draft.bufferBeforeMinutes} onChange={(event) => onDraftChange({ ...draft, bufferBeforeMinutes: Number(event.target.value) })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.bufferAfter}</span>
        <input className={styles.input} min={0} type="number" value={draft.bufferAfterMinutes} onChange={(event) => onDraftChange({ ...draft, bufferAfterMinutes: Number(event.target.value) })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.capacity}</span>
        <input className={styles.input} max={250} min={1} type="number" value={draft.maxParticipants} onChange={(event) => onDraftChange({ ...draft, maxParticipants: Number(event.target.value) })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{c.bookingInterval}</span>
        <input className={styles.input} min={5} type="number" value={draft.slotStepMinutes} onChange={(event) => onDraftChange({ ...draft, slotStepMinutes: Number(event.target.value) })} />
      </label>
      <fieldset className={`${styles.field} ${styles.fieldFull}`}>
        <legend className={styles.label}>{c.reminderSchedule}</legend>
        <div className={styles.metaRow}>
          {[24, 1].map((hour) => (
            <label className={styles.chip} key={hour}>
              <input
                checked={draft.reminderOffsetsHours.includes(hour as 1 | 24)}
                type="checkbox"
                onChange={(event) => onDraftChange({
                  ...draft,
                  reminderOffsetsHours: toggleReminderHour(draft.reminderOffsetsHours, hour as 1 | 24, event.target.checked),
                })}
              />{' '}
              {hour === 24 ? c.hoursBefore24 : c.hoursBefore1}
            </label>
          ))}
        </div>
        <p className={styles.muted}>{c.reminderHint}</p>
      </fieldset>
      <label className={`${styles.field} ${styles.fieldFull}`}>
        <span className={styles.label}>{c.imageUrl}</span>
        <input className={styles.input} value={draft.image} onChange={(event) => onDraftChange({ ...draft, image: event.target.value })} />
      </label>
      <label className={`${styles.field} ${styles.fieldFull}`}>
        <span className={styles.label}>{c.descriptionKo}</span>
        <textarea className={styles.textarea} value={draft.descriptionKo} onChange={(event) => onDraftChange({ ...draft, descriptionKo: event.target.value })} />
      </label>
      <label className={`${styles.field} ${styles.fieldFull}`}>
        <span className={styles.label}>{c.descriptionEn}</span>
        <textarea className={styles.textarea} value={draft.descriptionEn} onChange={(event) => onDraftChange({ ...draft, descriptionEn: event.target.value })} />
      </label>
      <label className={`${styles.field} ${styles.fieldFull}`}>
        <span className={styles.label}>{c.descriptionZh}</span>
        <textarea className={styles.textarea} value={draft.descriptionZh} onChange={(event) => onDraftChange({ ...draft, descriptionZh: event.target.value })} />
      </label>
    </>
  );
}
