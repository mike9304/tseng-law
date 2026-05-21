'use client';

import { useMemo, useState } from 'react';
import type { BookingPackage, BookingPackageCredit, BookingService } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

type PackageDraft = {
  packageId?: string;
  nameKo: string;
  nameZh: string;
  nameEn: string;
  descriptionKo: string;
  descriptionZh: string;
  descriptionEn: string;
  eligibleServiceIds: string[];
  credits: number;
  validityDays: number;
  priceAmount: number;
  priceCurrency: 'KRW' | 'USD' | 'TWD' | 'JPY' | 'EUR';
  isActive: boolean;
};

type CreditDraft = {
  creditId?: string;
  packageId: string;
  customerEmail: string;
  customerName: string;
  totalCredits: number;
  remainingCredits: number;
  expiresAtDate: string;
  status: BookingPackageCredit['status'];
  note: string;
};

function draftFromPackage(pkg?: BookingPackage): PackageDraft {
  return {
    packageId: pkg?.packageId,
    nameKo: pkg?.name.ko || '',
    nameZh: pkg?.name['zh-hant'] || '',
    nameEn: pkg?.name.en || '',
    descriptionKo: pkg?.description?.ko || '',
    descriptionZh: pkg?.description?.['zh-hant'] || '',
    descriptionEn: pkg?.description?.en || '',
    eligibleServiceIds: pkg?.eligibleServiceIds || [],
    credits: pkg?.credits ?? 3,
    validityDays: pkg?.validityDays ?? 180,
    priceAmount: pkg?.priceAmount ?? 0,
    priceCurrency: pkg?.priceCurrency ?? 'TWD',
    isActive: pkg?.isActive ?? true,
  };
}

function packagePayload(draft: PackageDraft) {
  const fallback = draft.nameKo || draft.nameEn || 'Session package';
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
    eligibleServiceIds: draft.eligibleServiceIds,
    credits: draft.credits,
    validityDays: draft.validityDays || undefined,
    priceAmount: draft.priceAmount || undefined,
    priceCurrency: draft.priceCurrency,
    isActive: draft.isActive,
  };
}

function toDateValue(iso?: string): string {
  return iso ? iso.slice(0, 10) : '';
}

function fromDateValue(value: string): string | undefined {
  return value ? new Date(`${value}T23:59:59.000Z`).toISOString() : undefined;
}

function draftFromCredit(credit: BookingPackageCredit | undefined, fallbackPackageId: string): CreditDraft {
  return {
    creditId: credit?.creditId,
    packageId: credit?.packageId || fallbackPackageId,
    customerEmail: credit?.customerEmail || '',
    customerName: credit?.customerName || '',
    totalCredits: credit?.totalCredits ?? 3,
    remainingCredits: credit?.remainingCredits ?? credit?.totalCredits ?? 3,
    expiresAtDate: toDateValue(credit?.expiresAt),
    status: credit?.status ?? 'active',
    note: credit?.note || '',
  };
}

function creditPayload(draft: CreditDraft, editing: boolean) {
  const expiresAt = fromDateValue(draft.expiresAtDate);
  if (editing) {
    return {
      customerName: draft.customerName,
      totalCredits: draft.totalCredits,
      remainingCredits: draft.remainingCredits,
      expiresAt: expiresAt ?? '',
      status: draft.status,
      note: draft.note,
    };
  }
  return {
    packageId: draft.packageId,
    customerEmail: draft.customerEmail,
    customerName: draft.customerName,
    totalCredits: draft.totalCredits,
    expiresAt,
    note: draft.note,
    status: draft.status,
  };
}

export default function BookingPackagesAdmin({
  locale,
  initialPackages,
  initialCredits,
  services,
}: {
  locale: Locale;
  initialPackages: BookingPackage[];
  initialCredits: BookingPackageCredit[];
  services: BookingService[];
}) {
  const [packages, setPackages] = useState(initialPackages);
  const [credits, setCredits] = useState(initialCredits);
  const [packageDraft, setPackageDraft] = useState<PackageDraft | null>(null);
  const [creditDraft, setCreditDraft] = useState<CreditDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const packageById = useMemo(() => new Map(packages.map((pkg) => [pkg.packageId, pkg])), [packages]);
  const serviceById = useMemo(() => new Map(services.map((service) => [service.serviceId, service])), [services]);
  const activePackages = packages.filter((pkg) => pkg.isActive);
  const defaultPackageId = activePackages[0]?.packageId ?? packages[0]?.packageId ?? '';

  const savePackage = async () => {
    if (!packageDraft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const url = packageDraft.packageId
        ? `/api/builder/bookings/packages/${packageDraft.packageId}`
        : '/api/builder/bookings/packages';
      const res = await fetch(url, {
        method: packageDraft.packageId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(packagePayload(packageDraft)),
      });
      if (!res.ok) throw new Error('save failed');
      const data = (await res.json()) as { package: BookingPackage };
      setPackages((current) => {
        const without = current.filter((item) => item.packageId !== data.package.packageId);
        return [...without, data.package].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      });
      setPackageDraft(null);
    } catch {
      setError('패키지를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const saveCredit = async () => {
    if (!creditDraft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const url = creditDraft.creditId
        ? `/api/builder/bookings/package-credits/${creditDraft.creditId}`
        : '/api/builder/bookings/package-credits';
      const res = await fetch(url, {
        method: creditDraft.creditId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(creditPayload(creditDraft, Boolean(creditDraft.creditId))),
      });
      if (!res.ok) throw new Error('save failed');
      const data = (await res.json()) as { credit: BookingPackageCredit };
      setCredits((current) => {
        const without = current.filter((item) => item.creditId !== data.credit.creditId);
        return [...without, data.credit].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      });
      setCreditDraft(null);
    } catch {
      setError('고객 크레딧을 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const deactivatePackage = async (pkg: BookingPackage) => {
    const res = await fetch(`/api/builder/bookings/packages/${pkg.packageId}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) {
      const data = (await res.json()) as { package: BookingPackage };
      setPackages((current) => current.map((item) => item.packageId === pkg.packageId ? data.package : item));
    }
  };

  const revokeCredit = async (credit: BookingPackageCredit) => {
    const res = await fetch(`/api/builder/bookings/package-credits/${credit.creditId}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) {
      const data = (await res.json()) as { credit: BookingPackageCredit };
      setCredits((current) => current.map((item) => item.creditId === credit.creditId ? data.credit : item));
    }
  };

  return (
    <>
      <div className={styles.toolbar} data-booking-packages-page="true">
        <div className={styles.muted}>{packages.length} packages · {credits.length} customer credit ledgers.</div>
        <div className={styles.inlineActions}>
          <button
            className={styles.buttonSecondary}
            type="button"
            data-booking-credit-grant="true"
            onClick={() => setCreditDraft(draftFromCredit(undefined, defaultPackageId))}
            disabled={!defaultPackageId}
          >
            Grant credit
          </button>
          <button className={styles.button} type="button" onClick={() => setPackageDraft(draftFromPackage())}>
            New package
          </button>
        </div>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}

      <section className={styles.panel} data-booking-packages-admin="true">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.cardTitle}>Session packages</h2>
            <p className={styles.muted}>Packages define which services customer credits can redeem.</p>
          </div>
        </div>
        <div className={styles.grid}>
          {packages.map((pkg) => {
            const serviceNames = pkg.eligibleServiceIds
              .map((serviceId) => textForLocale(serviceById.get(serviceId)?.name, locale))
              .filter(Boolean);
            return (
              <article className={styles.card} key={pkg.packageId} data-booking-package-card={pkg.packageId}>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{textForLocale(pkg.name, locale)}</h3>
                  <p className={styles.muted}>{textForLocale(pkg.description, locale) || 'No package notes.'}</p>
                  <div className={styles.metaRow}>
                    <span className={styles.chip}>{pkg.credits} credits</span>
                    <span className={styles.chip}>{pkg.validityDays ? `${pkg.validityDays} days` : 'No expiry default'}</span>
                    <span className={styles.chip}>{pkg.priceAmount ? `${pkg.priceCurrency ?? 'TWD'} ${pkg.priceAmount.toLocaleString()}` : 'Manual price'}</span>
                    <span className={styles.chip}>{pkg.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p className={styles.muted}>Services: {serviceNames.join(', ') || 'All services'}</p>
                  <div className={styles.actions}>
                    <button className={styles.buttonSecondary} type="button" onClick={() => setPackageDraft(draftFromPackage(pkg))}>Edit</button>
                    {pkg.isActive ? <button className={styles.buttonSecondary} type="button" onClick={() => deactivatePackage(pkg)}>Deactivate</button> : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.panel} style={{ marginTop: 18 }}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.cardTitle}>Customer credits</h2>
            <p className={styles.muted}>Credits are matched by customer email and consumed when an eligible paid booking is confirmed.</p>
          </div>
        </div>
        <div className={styles.grid}>
          {credits.map((credit) => {
            const pkg = packageById.get(credit.packageId);
            return (
              <article
                className={styles.card}
                key={credit.creditId}
                data-booking-credit-row={credit.creditId}
                data-booking-package-credit-card={credit.creditId}
              >
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{credit.customerName || credit.customerEmail}</h3>
                  <p className={styles.muted}>{credit.customerEmail}</p>
                  <div className={styles.metaRow}>
                    <span className={styles.chip} data-booking-credit-remaining={credit.creditId}>{credit.remainingCredits}/{credit.totalCredits} remaining</span>
                    <span className={styles.chip}>{credit.status}</span>
                    <span className={styles.chip} data-booking-credit-expiry={credit.creditId}>{credit.expiresAt ? `Expires ${credit.expiresAt.slice(0, 10)}` : 'No expiry'}</span>
                  </div>
                  <p className={styles.muted}>Package: {textForLocale(pkg?.name, locale) || credit.packageId}</p>
                  <p className={styles.muted}>Redemptions: {credit.redemptions?.filter((entry) => !entry.restoredAt).length ?? 0}</p>
                  <div className={styles.actions}>
                    <button className={styles.buttonSecondary} type="button" onClick={() => setCreditDraft(draftFromCredit(credit, defaultPackageId))}>Edit</button>
                    {credit.status !== 'revoked' ? <button className={styles.buttonSecondary} type="button" data-booking-credit-revoke={credit.creditId} onClick={() => revokeCredit(credit)}>Revoke</button> : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {packageDraft ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{packageDraft.packageId ? 'Edit package' : 'New package'}</h2>
              <button className={styles.buttonSecondary} type="button" onClick={() => setPackageDraft(null)}>Close</button>
            </div>
            <div className={styles.formGrid}>
              <label className={styles.field}><span className={styles.label}>Name KO</span><input className={styles.input} value={packageDraft.nameKo} onChange={(event) => setPackageDraft({ ...packageDraft, nameKo: event.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>Name EN</span><input className={styles.input} value={packageDraft.nameEn} onChange={(event) => setPackageDraft({ ...packageDraft, nameEn: event.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>Name ZH</span><input className={styles.input} value={packageDraft.nameZh} onChange={(event) => setPackageDraft({ ...packageDraft, nameZh: event.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>Credits</span><input className={styles.input} type="number" min={1} max={250} value={packageDraft.credits} onChange={(event) => setPackageDraft({ ...packageDraft, credits: Number(event.target.value) })} /></label>
              <label className={styles.field}><span className={styles.label}>Validity days</span><input className={styles.input} type="number" min={1} value={packageDraft.validityDays} onChange={(event) => setPackageDraft({ ...packageDraft, validityDays: Number(event.target.value) })} /></label>
              <label className={styles.field}><span className={styles.label}>Price amount</span><input className={styles.input} type="number" min={0} value={packageDraft.priceAmount} onChange={(event) => setPackageDraft({ ...packageDraft, priceAmount: Number(event.target.value) })} /></label>
              <label className={styles.field}>
                <span className={styles.label}>Currency</span>
                <select className={styles.select} value={packageDraft.priceCurrency} onChange={(event) => setPackageDraft({ ...packageDraft, priceCurrency: event.target.value as PackageDraft['priceCurrency'] })}>
                  <option value="TWD">TWD</option>
                  <option value="KRW">KRW</option>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
              <label className={styles.field}><span className={styles.label}><input type="checkbox" checked={packageDraft.isActive} onChange={(event) => setPackageDraft({ ...packageDraft, isActive: event.target.checked })} /> Active</span></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>Description KO</span><textarea className={styles.textarea} value={packageDraft.descriptionKo} onChange={(event) => setPackageDraft({ ...packageDraft, descriptionKo: event.target.value })} /></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>Description EN</span><textarea className={styles.textarea} value={packageDraft.descriptionEn} onChange={(event) => setPackageDraft({ ...packageDraft, descriptionEn: event.target.value })} /></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>Description ZH</span><textarea className={styles.textarea} value={packageDraft.descriptionZh} onChange={(event) => setPackageDraft({ ...packageDraft, descriptionZh: event.target.value })} /></label>
              <fieldset className={`${styles.field} ${styles.fieldFull}`}>
                <legend className={styles.label}>Eligible services</legend>
                <div className={styles.metaRow}>
                  {services.map((service) => (
                    <label className={styles.chip} key={service.serviceId}>
                      <input
                        type="checkbox"
                        checked={packageDraft.eligibleServiceIds.includes(service.serviceId)}
                        onChange={(event) => {
                          const eligibleServiceIds = event.target.checked
                            ? [...packageDraft.eligibleServiceIds, service.serviceId]
                            : packageDraft.eligibleServiceIds.filter((id) => id !== service.serviceId);
                          setPackageDraft({ ...packageDraft, eligibleServiceIds });
                        }}
                      />{' '}
                      {textForLocale(service.name, locale)}
                    </label>
                  ))}
                </div>
                <p className={styles.muted}>Leave all unchecked to let credits apply to any paid booking service.</p>
              </fieldset>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={savePackage} disabled={saving}>{saving ? 'Saving...' : 'Save package'}</button>
              <button className={styles.buttonSecondary} type="button" onClick={() => setPackageDraft(null)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}

      {creditDraft ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{creditDraft.creditId ? 'Edit customer credit' : 'Grant customer credit'}</h2>
              <button className={styles.buttonSecondary} type="button" onClick={() => setCreditDraft(null)}>Close</button>
            </div>
            <div className={styles.formGrid}>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Package</span>
                <select className={styles.select} value={creditDraft.packageId} onChange={(event) => setCreditDraft({ ...creditDraft, packageId: event.target.value })} disabled={Boolean(creditDraft.creditId)}>
                  {packages.map((pkg) => <option key={pkg.packageId} value={pkg.packageId}>{textForLocale(pkg.name, locale)}</option>)}
                </select>
              </label>
              <label className={styles.field}><span className={styles.label}>Customer email</span><input className={styles.input} type="email" value={creditDraft.customerEmail} onChange={(event) => setCreditDraft({ ...creditDraft, customerEmail: event.target.value })} disabled={Boolean(creditDraft.creditId)} /></label>
              <label className={styles.field}><span className={styles.label}>Customer name</span><input className={styles.input} value={creditDraft.customerName} onChange={(event) => setCreditDraft({ ...creditDraft, customerName: event.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>Total credits</span><input className={styles.input} type="number" min={1} max={250} value={creditDraft.totalCredits} onChange={(event) => setCreditDraft({ ...creditDraft, totalCredits: Number(event.target.value) })} /></label>
              <label className={styles.field}><span className={styles.label}>Remaining credits</span><input className={styles.input} type="number" min={0} max={250} value={creditDraft.remainingCredits} onChange={(event) => setCreditDraft({ ...creditDraft, remainingCredits: Number(event.target.value) })} /></label>
              <label className={styles.field}><span className={styles.label}>Expires</span><input className={styles.input} type="date" value={creditDraft.expiresAtDate} onChange={(event) => setCreditDraft({ ...creditDraft, expiresAtDate: event.target.value })} /></label>
              <label className={styles.field}>
                <span className={styles.label}>Status</span>
                <select className={styles.select} value={creditDraft.status} onChange={(event) => setCreditDraft({ ...creditDraft, status: event.target.value as CreditDraft['status'] })}>
                  <option value="active">Active</option>
                  <option value="used">Used</option>
                  <option value="expired">Expired</option>
                  <option value="revoked">Revoked</option>
                </select>
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>Note</span><textarea className={styles.textarea} value={creditDraft.note} onChange={(event) => setCreditDraft({ ...creditDraft, note: event.target.value })} /></label>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={saveCredit} disabled={saving || !creditDraft.packageId || !creditDraft.customerEmail}>{saving ? 'Saving...' : 'Save credit'}</button>
              <button className={styles.buttonSecondary} type="button" onClick={() => setCreditDraft(null)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
