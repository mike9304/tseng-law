'use client';

import { useState } from 'react';
import type { BlockedDate, BookingResource } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

type ResourceDraft = {
  resourceId?: string;
  nameKo: string;
  nameZh: string;
  nameEn: string;
  descriptionKo: string;
  descriptionZh: string;
  descriptionEn: string;
  location: string;
  capacity: number;
  blockedDates: BlockedDate[];
  blockedStart: string;
  blockedEnd: string;
  blockedReason: string;
  isActive: boolean;
};

function datetimeLocalValue(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function datetimeLocalToIso(value: string): string {
  return new Date(value).toISOString();
}

function draftFromResource(resource?: BookingResource): ResourceDraft {
  return {
    resourceId: resource?.resourceId,
    nameKo: resource?.name.ko || '',
    nameZh: resource?.name['zh-hant'] || '',
    nameEn: resource?.name.en || '',
    descriptionKo: resource?.description?.ko || '',
    descriptionZh: resource?.description?.['zh-hant'] || '',
    descriptionEn: resource?.description?.en || '',
    location: resource?.location || '',
    capacity: resource?.capacity ?? 1,
    blockedDates: resource?.blockedDates || [],
    blockedStart: '',
    blockedEnd: '',
    blockedReason: '',
    isActive: resource?.isActive ?? true,
  };
}

function resourcePayload(draft: ResourceDraft) {
  const fallback = draft.nameKo || draft.nameEn || 'Booking resource';
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
    location: draft.location,
    capacity: draft.capacity,
    blockedDates: draft.blockedDates,
    isActive: draft.isActive,
  };
}

function nextBlockedLabel(resource: BookingResource, locale: Locale): string {
  const now = new Date().toISOString();
  const next = (resource.blockedDates ?? [])
    .filter((blocked) => blocked.end >= now)
    .sort((a, b) => a.start.localeCompare(b.start))[0];
  return next ? `Next blocked ${new Date(next.start).toLocaleString(locale)}` : 'No upcoming blocks';
}

export default function BookingResourcesAdmin({
  locale,
  initialResources,
}: {
  locale: Locale;
  initialResources: BookingResource[];
}) {
  const [resources, setResources] = useState(initialResources);
  const [draft, setDraft] = useState<ResourceDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!draft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const url = draft.resourceId
        ? `/api/builder/bookings/resources/${draft.resourceId}`
        : '/api/builder/bookings/resources';
      const res = await fetch(url, {
        method: draft.resourceId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(resourcePayload(draft)),
      });
      if (!res.ok) throw new Error('save failed');
      const data = (await res.json()) as { resource: BookingResource };
      setResources((current) => {
        const without = current.filter((item) => item.resourceId !== data.resource.resourceId);
        return [...without, data.resource].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      });
      setDraft(null);
    } catch {
      setError('리소스를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (resource: BookingResource) => {
    const res = await fetch(`/api/builder/bookings/resources/${resource.resourceId}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) {
      const data = (await res.json()) as { resource: BookingResource };
      setResources((current) => current.map((item) => item.resourceId === resource.resourceId ? data.resource : item));
    }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.muted}>{resources.length} rooms and shared booking resources.</div>
        <button className={styles.button} type="button" onClick={() => setDraft(draftFromResource())}>
          New resource
        </button>
      </div>
      <div className={styles.grid} data-booking-resources-admin="true">
        {resources.map((resource) => (
          <article className={styles.card} key={resource.resourceId} data-booking-resource-card={resource.resourceId}>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{textForLocale(resource.name, locale)}</h2>
              <p className={styles.muted}>{textForLocale(resource.description, locale) || 'No resource notes.'}</p>
              <div className={styles.metaRow}>
                <span className={styles.chip}>{resource.location || 'No location'}</span>
                <span className={styles.chip}>{resource.capacity ?? 1} capacity</span>
                <span className={styles.chip} data-booking-resource-blocked-count={resource.resourceId}>{resource.blockedDates?.length ?? 0} blocked</span>
                <span className={styles.chip}>{resource.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <p className={styles.muted} data-booking-resource-next-blocked={resource.resourceId}>{nextBlockedLabel(resource, locale)}</p>
              <div className={styles.actions}>
                <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(draftFromResource(resource))}>Edit</button>
                {resource.isActive ? (
                  <button className={styles.buttonSecondary} type="button" onClick={() => deactivate(resource)}>Deactivate</button>
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
              <h2 className={styles.modalTitle}>{draft.resourceId ? 'Edit resource' : 'New resource'}</h2>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>Close</button>
            </div>
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span className={styles.label}>Name KO</span>
                <input className={styles.input} value={draft.nameKo} onChange={(event) => setDraft({ ...draft, nameKo: event.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Name EN</span>
                <input className={styles.input} value={draft.nameEn} onChange={(event) => setDraft({ ...draft, nameEn: event.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Name ZH</span>
                <input className={styles.input} value={draft.nameZh} onChange={(event) => setDraft({ ...draft, nameZh: event.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Location</span>
                <input className={styles.input} value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Capacity</span>
                <input className={styles.input} type="number" min={1} max={500} value={draft.capacity} onChange={(event) => setDraft({ ...draft, capacity: Number(event.target.value) })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>
                  <input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} /> Active
                </span>
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Description KO</span>
                <textarea className={styles.textarea} value={draft.descriptionKo} onChange={(event) => setDraft({ ...draft, descriptionKo: event.target.value })} />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Description EN</span>
                <textarea className={styles.textarea} value={draft.descriptionEn} onChange={(event) => setDraft({ ...draft, descriptionEn: event.target.value })} />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Description ZH</span>
                <textarea className={styles.textarea} value={draft.descriptionZh} onChange={(event) => setDraft({ ...draft, descriptionZh: event.target.value })} />
              </label>
              <fieldset
                className={`${styles.field} ${styles.fieldFull}`}
                data-booking-resource-blocked-editor="true"
                data-resource-blocked-times="true"
              >
                <legend className={styles.label}>Blocked time</legend>
                <p className={styles.muted}>Block room maintenance or outside use. Services requiring this resource will hide overlapping slots.</p>
                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <span className={styles.label}>Start</span>
                    <input
                      className={styles.input}
                      type="datetime-local"
                      value={draft.blockedStart}
                      onChange={(event) => setDraft({ ...draft, blockedStart: event.target.value })}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>End</span>
                    <input
                      className={styles.input}
                      type="datetime-local"
                      value={draft.blockedEnd}
                      onChange={(event) => setDraft({ ...draft, blockedEnd: event.target.value })}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>Reason</span>
                    <input
                      className={styles.input}
                      placeholder="Maintenance, private event, unavailable"
                      value={draft.blockedReason}
                      onChange={(event) => setDraft({ ...draft, blockedReason: event.target.value })}
                    />
                  </label>
                  <div className={styles.field}>
                    <span className={styles.label}>Add</span>
                    <button
                      className={styles.buttonSecondary}
                      type="button"
                      data-booking-resource-blocked-add="true"
                      data-resource-blocked-add="true"
                      disabled={!draft.blockedStart || !draft.blockedEnd || draft.blockedStart >= draft.blockedEnd}
                      onClick={() => {
                        const blockedDates = [
                          ...draft.blockedDates,
                          {
                            start: datetimeLocalToIso(draft.blockedStart),
                            end: datetimeLocalToIso(draft.blockedEnd),
                            ...(draft.blockedReason ? { reason: draft.blockedReason } : {}),
                          },
                        ].sort((a, b) => a.start.localeCompare(b.start));
                        setDraft({
                          ...draft,
                          blockedDates,
                          blockedStart: '',
                          blockedEnd: '',
                          blockedReason: '',
                        });
                      }}
                    >
                      Add block
                    </button>
                  </div>
                </div>
                <div className={styles.metaRow}>
                  {draft.blockedDates.length === 0 ? <span className={styles.muted}>No blocked times.</span> : null}
                  {draft.blockedDates.map((blocked, index) => (
                    <span
                      className={styles.chip}
                      key={`${blocked.start}-${blocked.end}`}
                      data-booking-resource-blocked-row={index}
                      data-resource-blocked-row={index}
                    >
                      {datetimeLocalValue(blocked.start).replace('T', ' ')} - {datetimeLocalValue(blocked.end).replace('T', ' ')}
                      {blocked.reason ? ` · ${blocked.reason}` : ''}
                      {' '}
                      <button
                        className={styles.buttonSecondary}
                        type="button"
                        data-resource-blocked-remove={index}
                        onClick={() => setDraft({
                          ...draft,
                          blockedDates: draft.blockedDates.filter((_, currentIndex) => currentIndex !== index),
                        })}
                      >
                        Remove
                      </button>
                    </span>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save resource'}</button>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
