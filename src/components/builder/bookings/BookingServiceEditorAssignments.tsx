'use client';

import type { BookingResource, Staff } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import type { BookingServicesAdminCopy } from './BookingServicesAdmin.copy';
import type { ServiceDraft } from './BookingServiceDraft';
import styles from './BookingsAdmin.module.css';

type BookingServiceEditorAssignmentsProps = {
  readonly locale: Locale;
  readonly draft: ServiceDraft;
  readonly staff: readonly Staff[];
  readonly resources: readonly BookingResource[];
  readonly staffById: ReadonlyMap<string, Staff>;
  readonly resourceById: ReadonlyMap<string, BookingResource>;
  readonly inactiveResourceNames: readonly string[];
  readonly copy: BookingServicesAdminCopy;
  readonly onDraftChange: (draft: ServiceDraft) => void;
};

function nextStaffDraft(draft: ServiceDraft, staffId: string, checked: boolean): ServiceDraft {
  const staffIds = checked ? [...draft.staffIds, staffId] : draft.staffIds.filter((id) => id !== staffId);
  const staffPriceOverrides = { ...draft.staffPriceOverrides };
  if (!checked) delete staffPriceOverrides[staffId];
  return { ...draft, staffIds, staffPriceOverrides };
}

function nextResourceDraft(draft: ServiceDraft, resourceId: string, checked: boolean): ServiceDraft {
  const requiredResourceIds = checked
    ? [...draft.requiredResourceIds, resourceId]
    : draft.requiredResourceIds.filter((id) => id !== resourceId);
  const resourcePriceOverrides = { ...draft.resourcePriceOverrides };
  if (!checked) delete resourcePriceOverrides[resourceId];
  return { ...draft, requiredResourceIds, resourcePriceOverrides };
}

function overrideRecordWithAmount(current: Record<string, number>, id: string, rawValue: string): Record<string, number> {
  const amount = Number(rawValue);
  const next = { ...current };
  if (Number.isFinite(amount) && amount > 0) next[id] = amount;
  else delete next[id];
  return next;
}

export function BookingServiceEditorAssignments({
  locale,
  draft,
  staff,
  resources,
  staffById,
  resourceById,
  inactiveResourceNames: inactiveNames,
  copy: c,
  onDraftChange,
}: BookingServiceEditorAssignmentsProps) {
  return (
    <>
      <label className={`${styles.field} ${styles.fieldFull}`}>
        <span className={styles.label}>{c.staff}</span>
        <div className={styles.metaRow}>
          {staff.map((member) => (
            <label className={styles.chip} key={member.staffId}>
              <input
                checked={draft.staffIds.includes(member.staffId)}
                type="checkbox"
                onChange={(event) => onDraftChange(nextStaffDraft(draft, member.staffId, event.target.checked))}
              />{' '}
              {textForLocale(member.name, locale)}
            </label>
          ))}
        </div>
      </label>
      {draft.paymentMode === 'paid' && draft.staffIds.length > 0 ? (
        <fieldset className={`${styles.field} ${styles.fieldFull}`} data-booking-staff-price-override-section="true">
          <legend className={styles.label}>{c.staffPriceOverrides}</legend>
          <p className={styles.muted}>{c.staffPriceOverrideHint}</p>
          <div className={styles.formGrid}>
            {draft.staffIds.map((staffId) => {
              const member = staffById.get(staffId);
              return (
                <label className={styles.field} key={`override-${staffId}`}>
                  <span className={styles.label}>{member ? textForLocale(member.name, locale) : staffId}</span>
                  <input
                    className={styles.input}
                    data-booking-staff-price-override={staffId}
                    min={0}
                    type="number"
                    value={draft.staffPriceOverrides[staffId] ?? ''}
                    onChange={(event) => onDraftChange({
                      ...draft,
                      staffPriceOverrides: overrideRecordWithAmount(draft.staffPriceOverrides, staffId, event.target.value),
                    })}
                  />
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}
      <label className={`${styles.field} ${styles.fieldFull}`}>
        <span className={styles.label}>{c.requiredResources}</span>
        <div className={styles.metaRow}>
          {resources.map((resource) => (
            <label className={styles.chip} key={resource.resourceId}>
              <input
                checked={draft.requiredResourceIds.includes(resource.resourceId)}
                type="checkbox"
                onChange={(event) => onDraftChange(nextResourceDraft(draft, resource.resourceId, event.target.checked))}
              />{' '}
              {textForLocale(resource.name, locale)}
            </label>
          ))}
        </div>
        {inactiveNames.length > 0 ? (
          <p className={styles.warning} data-booking-service-resource-warning-editor="true">
            {c.inactiveResourcesList([...inactiveNames])}
          </p>
        ) : null}
        <p className={styles.muted}>{c.resourceHint}</p>
      </label>
      {draft.paymentMode === 'paid' && draft.requiredResourceIds.length > 0 ? (
        <fieldset className={`${styles.field} ${styles.fieldFull}`} data-booking-resource-price-override-section="true">
          <legend className={styles.label}>{c.resourcePriceOverrides}</legend>
          <p className={styles.muted}>{c.resourcePriceOverrideHint}</p>
          <div className={styles.formGrid}>
            {draft.requiredResourceIds.map((resourceId) => {
              const resource = resourceById.get(resourceId);
              return (
                <label className={styles.field} key={`resource-override-${resourceId}`}>
                  <span className={styles.label}>{resource ? textForLocale(resource.name, locale) : resourceId}</span>
                  <input
                    className={styles.input}
                    data-booking-resource-price-override={resourceId}
                    min={0}
                    type="number"
                    value={draft.resourcePriceOverrides[resourceId] ?? ''}
                    onChange={(event) => onDraftChange({
                      ...draft,
                      resourcePriceOverrides: overrideRecordWithAmount(draft.resourcePriceOverrides, resourceId, event.target.value),
                    })}
                  />
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}
    </>
  );
}
