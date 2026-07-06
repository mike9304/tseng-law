'use client';

import { useMemo, useState } from 'react';
import type { BookingCancellationPolicy, BookingResource, BookingService, Staff } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import { usePagination } from '@/components/builder/shared/usePagination';
import { BookingServiceCards } from './BookingServiceCards';
import { draftFromService, servicePayload, type ServiceDraft } from './BookingServiceDraft';
import { BookingServiceEditorModal } from './BookingServiceEditorModal';
import { getBookingServicesAdminCopy } from './BookingServicesAdmin.copy';
import styles from './BookingsAdmin.module.css';

function sortServicesForAdmin(services: readonly BookingService[]): BookingService[] {
  return [...services].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export default function BookingServicesAdmin({
  locale,
  initialServices,
  staff,
  resources,
  cancellationPolicies,
  initialEditServiceId,
}: {
  locale: Locale;
  initialServices: BookingService[];
  staff: Staff[];
  resources: BookingResource[];
  cancellationPolicies: BookingCancellationPolicy[];
  initialEditServiceId?: string;
}) {
  const [services, setServices] = useState(() => sortServicesForAdmin(initialServices));
  const initialEditService = initialEditServiceId
    ? initialServices.find((service) => service.serviceId === initialEditServiceId)
    : null;
  const [draft, setDraft] = useState<ServiceDraft | null>(() => (initialEditService ? draftFromService(initialEditService) : null));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const staffById = useMemo(() => new Map(staff.map((member) => [member.staffId, member])), [staff]);
  const resourceById = useMemo(() => new Map(resources.map((resource) => [resource.resourceId, resource])), [resources]);
  const policyById = useMemo(() => new Map(cancellationPolicies.map((policy) => [policy.policyId, policy])), [cancellationPolicies]);
  const pagination = usePagination(services, { storageKey: 'booking-services-page-size' });
  const c = getBookingServicesAdminCopy(locale);

  const save = async () => {
    if (!draft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const url = draft.serviceId
        ? `/api/builder/bookings/services/${draft.serviceId}?${params.toString()}`
        : `/api/builder/bookings/services?${params.toString()}`;
      const res = await fetch(url, {
        body: JSON.stringify(servicePayload(draft)),
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: draft.serviceId ? 'PATCH' : 'POST',
      });
      const data = (await res.json().catch(() => null)) as { service?: BookingService; error?: string } | null;
      if (!res.ok || !data?.service) throw new Error(data?.error || 'save failed');
      const savedService = data.service;
      setServices((current) => {
        const without = current.filter((item) => item.serviceId !== savedService.serviceId);
        return sortServicesForAdmin([...without, savedService]);
      });
      setDraft(null);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== 'save failed'
          ? err.message
          : locale === 'ko'
            ? '서비스를 저장하지 못했습니다.'
            : locale === 'zh-hant'
              ? '無法儲存服務。'
              : 'Unable to save service.',
      );
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (service: BookingService) => {
    const params = new URLSearchParams({ locale });
    const res = await fetch(`/api/builder/bookings/services/${service.serviceId}?${params.toString()}`, {
      credentials: 'same-origin',
      method: 'DELETE',
    });
    if (res.ok) {
      const data = (await res.json()) as { service: BookingService };
      setServices((current) => current.map((item) => (item.serviceId === service.serviceId ? data.service : item)));
    }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.muted}>{c.toolbar(services.length)}</div>
        <button className={styles.button} type="button" onClick={() => setDraft(draftFromService())}>{c.newService}</button>
      </div>
      <BookingServiceCards
        copy={c}
        locale={locale}
        pagination={pagination}
        policyById={policyById}
        resourceById={resourceById}
        staffById={staffById}
        onDeactivate={deactivate}
        onEdit={(service) => setDraft(draftFromService(service))}
      />
      {draft ? (
        <BookingServiceEditorModal
          cancellationPolicies={cancellationPolicies}
          copy={c}
          draft={draft}
          error={error}
          locale={locale}
          resourceById={resourceById}
          resources={resources}
          saving={saving}
          staff={staff}
          staffById={staffById}
          onClose={() => setDraft(null)}
          onDraftChange={setDraft}
          onSave={save}
        />
      ) : null}
    </>
  );
}
