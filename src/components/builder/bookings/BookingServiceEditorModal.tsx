'use client';

import type { BookingCancellationPolicy, BookingResource, Staff } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import type { BookingServicesAdminCopy } from './BookingServicesAdmin.copy';
import type { ServiceDraft } from './BookingServiceDraft';
import { inactiveResourceNamesFromIds } from './BookingServiceDraft';
import { BookingServiceEditorAssignments } from './BookingServiceEditorAssignments';
import { BookingServiceEditorBasics } from './BookingServiceEditorBasics';
import styles from './BookingsAdmin.module.css';

type BookingServiceEditorModalProps = {
  readonly locale: Locale;
  readonly draft: ServiceDraft;
  readonly saving: boolean;
  readonly error: string | null;
  readonly staff: readonly Staff[];
  readonly resources: readonly BookingResource[];
  readonly cancellationPolicies: readonly BookingCancellationPolicy[];
  readonly staffById: ReadonlyMap<string, Staff>;
  readonly resourceById: ReadonlyMap<string, BookingResource>;
  readonly copy: BookingServicesAdminCopy;
  readonly onDraftChange: (draft: ServiceDraft) => void;
  readonly onSave: () => void;
  readonly onClose: () => void;
};

export function BookingServiceEditorModal({
  locale,
  draft,
  saving,
  error,
  staff,
  resources,
  cancellationPolicies,
  staffById,
  resourceById,
  copy: c,
  onDraftChange,
  onSave,
  onClose,
}: BookingServiceEditorModalProps) {
  const inactiveNames = inactiveResourceNamesFromIds(draft.requiredResourceIds, resourceById, locale);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal} data-booking-service-editor-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle} data-booking-service-editor="true">
            {draft.serviceId ? c.editServiceTitle : c.newServiceTitle}
          </h2>
          <button className={styles.buttonSecondary} type="button" onClick={onClose}>{c.close}</button>
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.formGrid}>
          <BookingServiceEditorBasics
            cancellationPolicies={cancellationPolicies}
            copy={c}
            draft={draft}
            onDraftChange={onDraftChange}
          />
          <BookingServiceEditorAssignments
            copy={c}
            draft={draft}
            inactiveResourceNames={inactiveNames}
            locale={locale}
            resourceById={resourceById}
            resources={resources}
            staff={staff}
            staffById={staffById}
            onDraftChange={onDraftChange}
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.button} disabled={saving} type="button" onClick={onSave}>
            {saving ? c.saving : c.saveService}
          </button>
          <button className={styles.buttonSecondary} type="button" onClick={onClose}>{c.cancel}</button>
        </div>
      </div>
    </div>
  );
}
