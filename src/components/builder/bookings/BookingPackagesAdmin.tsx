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
  const copy = {
    ko: {
      toolbar: (packageCount: number, creditCount: number) => `${packageCount}개의 패키지 · ${creditCount}개의 고객 크레딧 장부`,
      grantCredit: '크레딧 지급',
      newPackage: '새 패키지',
      sessionPackages: '세션 패키지',
      packagesDescription: '패키지는 고객 크레딧이 사용할 수 있는 서비스를 정의합니다.',
      customerCredits: '고객 크레딧',
      customerCreditsDescription: '크레딧은 고객 이메일로 매칭되며 적합한 유료 예약이 확정되면 차감됩니다.',
      noPackageNotes: '패키지 메모 없음.',
      noExpiryDefault: '기본 만료 없음',
      manualPrice: '수동 가격',
      active: '활성',
      inactive: '비활성',
      servicesLabel: '서비스',
      allServices: '모든 서비스',
      edit: '편집',
      deactivate: '비활성화',
      editPackageTitle: '패키지 편집',
      newPackageTitle: '새 패키지',
      editCreditTitle: '고객 크레딧 편집',
      newCreditTitle: '고객 크레딧 지급',
      close: '닫기',
      nameKo: '이름 KO',
      nameEn: '이름 EN',
      nameZh: '이름 ZH',
      credits: '크레딧',
      validityDays: '유효 기간(일)',
      priceAmount: '가격 금액',
      currency: '통화',
      descriptionKo: '설명 KO',
      descriptionEn: '설명 EN',
      descriptionZh: '설명 ZH',
      activeLabel: '활성',
      eligibleServices: '적용 가능한 서비스',
      eligibleServicesHint: '모두 선택 해제하면 모든 유료 예약 서비스에 크레딧을 적용합니다.',
      savePackage: '패키지 저장',
      saveCredit: '크레딧 저장',
      saving: '저장 중...',
      cancel: '취소',
      packageLabel: '패키지',
      customerEmail: '고객 이메일',
      customerName: '고객 이름',
      totalCredits: '총 크레딧',
      remainingCredits: '남은 크레딧',
      expires: '만료일',
      status: '상태',
      note: '메모',
      revoke: '회수',
      activeStatus: '활성',
      usedStatus: '사용됨',
      expiredStatus: '만료됨',
      revokedStatus: '회수됨',
      packagePrefix: '패키지:',
      redemptions: '사용 내역:',
      remaining: (remaining: number, total: number) => `${remaining}/${total}개 남음`,
      expiresAt: (date: string) => `만료 ${date}`,
      noExpiry: '만료 없음',
      saveFailed: '패키지를 저장하지 못했습니다.',
      creditSaveFailed: '고객 크레딧을 저장하지 못했습니다.',
    },
    'zh-hant': {
      toolbar: (packageCount: number, creditCount: number) => `${packageCount} 個方案 · ${creditCount} 個客戶點數帳本`,
      grantCredit: '發放點數',
      newPackage: '新增方案',
      sessionPackages: '方案套組',
      packagesDescription: '方案可定義客戶點數可兌換哪些服務。',
      customerCredits: '客戶點數',
      customerCreditsDescription: '點數會依客戶電子郵件配對，當符合資格的付費預約確認後即扣減。',
      noPackageNotes: '沒有方案備註。',
      noExpiryDefault: '預設沒有到期日',
      manualPrice: '手動價格',
      active: '啟用',
      inactive: '停用',
      servicesLabel: '服務',
      allServices: '所有服務',
      edit: '編輯',
      deactivate: '停用',
      editPackageTitle: '編輯方案',
      newPackageTitle: '新增方案',
      editCreditTitle: '編輯客戶點數',
      newCreditTitle: '發放客戶點數',
      close: '關閉',
      nameKo: '名稱 KO',
      nameEn: '名稱 EN',
      nameZh: '名稱 ZH',
      credits: '點數',
      validityDays: '有效天數',
      priceAmount: '價格金額',
      currency: '幣別',
      descriptionKo: '說明 KO',
      descriptionEn: '說明 EN',
      descriptionZh: '說明 ZH',
      activeLabel: '啟用',
      eligibleServices: '適用服務',
      eligibleServicesHint: '全部取消勾選時，點數可套用到任何付費預約服務。',
      savePackage: '儲存方案',
      saveCredit: '儲存點數',
      saving: '儲存中...',
      cancel: '取消',
      packageLabel: '方案',
      customerEmail: '客戶電子郵件',
      customerName: '客戶名稱',
      totalCredits: '總點數',
      remainingCredits: '剩餘點數',
      expires: '到期日',
      status: '狀態',
      note: '備註',
      revoke: '撤銷',
      activeStatus: '啟用',
      usedStatus: '已使用',
      expiredStatus: '已過期',
      revokedStatus: '已撤銷',
      packagePrefix: '方案：',
      redemptions: '兌換次數：',
      remaining: (remaining: number, total: number) => `剩餘 ${remaining}/${total} 點`,
      expiresAt: (date: string) => `到期 ${date}`,
      noExpiry: '沒有到期日',
      saveFailed: '無法儲存方案。',
      creditSaveFailed: '無法儲存客戶點數。',
    },
    en: {
      toolbar: (packageCount: number, creditCount: number) => `${packageCount} packages · ${creditCount} customer credit ledgers.`,
      grantCredit: 'Grant credit',
      newPackage: 'New package',
      sessionPackages: 'Session packages',
      packagesDescription: 'Packages define which services customer credits can redeem.',
      customerCredits: 'Customer credits',
      customerCreditsDescription: 'Credits are matched by customer email and consumed when an eligible paid booking is confirmed.',
      noPackageNotes: 'No package notes.',
      noExpiryDefault: 'No expiry default',
      manualPrice: 'Manual price',
      active: 'Active',
      inactive: 'Inactive',
      servicesLabel: 'Services',
      allServices: 'All services',
      edit: 'Edit',
      deactivate: 'Deactivate',
      editPackageTitle: 'Edit package',
      newPackageTitle: 'New package',
      editCreditTitle: 'Edit customer credit',
      newCreditTitle: 'Grant customer credit',
      close: 'Close',
      nameKo: 'Name KO',
      nameEn: 'Name EN',
      nameZh: 'Name ZH',
      credits: 'Credits',
      validityDays: 'Validity days',
      priceAmount: 'Price amount',
      currency: 'Currency',
      descriptionKo: 'Description KO',
      descriptionEn: 'Description EN',
      descriptionZh: 'Description ZH',
      activeLabel: 'Active',
      eligibleServices: 'Eligible services',
      eligibleServicesHint: 'Leave all unchecked to let credits apply to any paid booking service.',
      savePackage: 'Save package',
      saveCredit: 'Save credit',
      saving: 'Saving...',
      cancel: 'Cancel',
      packageLabel: 'Package',
      customerEmail: 'Customer email',
      customerName: 'Customer name',
      totalCredits: 'Total credits',
      remainingCredits: 'Remaining credits',
      expires: 'Expires',
      status: 'Status',
      note: 'Note',
      revoke: 'Revoke',
      activeStatus: 'Active',
      usedStatus: 'Used',
      expiredStatus: 'Expired',
      revokedStatus: 'Revoked',
      packagePrefix: 'Package:',
      redemptions: 'Redemptions:',
      remaining: (remaining: number, total: number) => `${remaining}/${total} remaining`,
      expiresAt: (date: string) => `Expires ${date}`,
      noExpiry: 'No expiry',
      saveFailed: 'Unable to save package.',
      creditSaveFailed: 'Unable to save customer credit.',
    },
  } as const;
  const c = copy[locale];
  const packageById = useMemo(() => new Map(packages.map((pkg) => [pkg.packageId, pkg])), [packages]);
  const serviceById = useMemo(() => new Map(services.map((service) => [service.serviceId, service])), [services]);
  const activePackages = packages.filter((pkg) => pkg.isActive);
  const defaultPackageId = activePackages[0]?.packageId ?? packages[0]?.packageId ?? '';

  const savePackage = async () => {
    if (!packageDraft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const url = packageDraft.packageId
        ? `/api/builder/bookings/packages/${packageDraft.packageId}?${params.toString()}`
        : `/api/builder/bookings/packages?${params.toString()}`;
      const res = await fetch(url, {
        method: packageDraft.packageId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(packagePayload(packageDraft)),
      });
      const data = (await res.json().catch(() => null)) as { package?: BookingPackage; error?: string } | null;
      const savedPackage = data?.package;
      if (!res.ok || !savedPackage) throw new Error(data?.error || 'save failed');
      setPackages((current) => {
        const without = current.filter((item) => item.packageId !== savedPackage.packageId);
        return [...without, savedPackage].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      });
      setPackageDraft(null);
    } catch (err) {
      const message = err instanceof Error && err.message !== 'save failed' ? err.message : c.saveFailed;
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const saveCredit = async () => {
    if (!creditDraft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const url = creditDraft.creditId
        ? `/api/builder/bookings/package-credits/${creditDraft.creditId}?${params.toString()}`
        : `/api/builder/bookings/package-credits?${params.toString()}`;
      const res = await fetch(url, {
        method: creditDraft.creditId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(creditPayload(creditDraft, Boolean(creditDraft.creditId))),
      });
      const data = (await res.json().catch(() => null)) as { credit?: BookingPackageCredit; error?: string } | null;
      const savedCredit = data?.credit;
      if (!res.ok || !savedCredit) throw new Error(data?.error || 'save failed');
      setCredits((current) => {
        const without = current.filter((item) => item.creditId !== savedCredit.creditId);
        return [...without, savedCredit].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      });
      setCreditDraft(null);
    } catch (err) {
      const message = err instanceof Error && err.message !== 'save failed' ? err.message : c.creditSaveFailed;
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const deactivatePackage = async (pkg: BookingPackage) => {
    const params = new URLSearchParams({ locale });
    const res = await fetch(`/api/builder/bookings/packages/${pkg.packageId}?${params.toString()}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) {
      const data = (await res.json()) as { package: BookingPackage };
      setPackages((current) => current.map((item) => item.packageId === pkg.packageId ? data.package : item));
    }
  };

  const revokeCredit = async (credit: BookingPackageCredit) => {
    const params = new URLSearchParams({ locale });
    const res = await fetch(`/api/builder/bookings/package-credits/${credit.creditId}?${params.toString()}`, {
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
        <div className={styles.muted}>{c.toolbar(packages.length, credits.length)}</div>
        <div className={styles.inlineActions}>
          <button
            className={styles.buttonSecondary}
            type="button"
            data-booking-credit-grant="true"
            onClick={() => setCreditDraft(draftFromCredit(undefined, defaultPackageId))}
            disabled={!defaultPackageId}
          >
            {c.grantCredit}
          </button>
          <button className={styles.button} type="button" onClick={() => setPackageDraft(draftFromPackage())}>
            {c.newPackage}
          </button>
        </div>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}

      <section className={styles.panel} data-booking-packages-admin="true">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.cardTitle}>{c.sessionPackages}</h2>
            <p className={styles.muted}>{c.packagesDescription}</p>
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
                  <p className={styles.muted}>{textForLocale(pkg.description, locale) || c.noPackageNotes}</p>
                  <div className={styles.metaRow}>
                    <span className={styles.chip}>{`${pkg.credits} ${c.credits}`}</span>
                    <span className={styles.chip}>{pkg.validityDays ? `${pkg.validityDays} ${locale === 'ko' ? '일' : locale === 'zh-hant' ? '天' : 'days'}` : c.noExpiryDefault}</span>
                    <span className={styles.chip}>{pkg.priceAmount ? `${pkg.priceCurrency ?? 'TWD'} ${pkg.priceAmount.toLocaleString()}` : c.manualPrice}</span>
                    <span className={styles.chip}>{pkg.isActive ? c.active : c.inactive}</span>
                  </div>
                  <p className={styles.muted}>{`${c.servicesLabel}: ${serviceNames.join(', ') || c.allServices}`}</p>
                  <div className={styles.actions}>
                    <button className={styles.buttonSecondary} type="button" onClick={() => setPackageDraft(draftFromPackage(pkg))}>{c.edit}</button>
                    {pkg.isActive ? <button className={styles.buttonSecondary} type="button" onClick={() => deactivatePackage(pkg)}>{c.deactivate}</button> : null}
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
            <h2 className={styles.cardTitle}>{c.customerCredits}</h2>
            <p className={styles.muted}>{c.customerCreditsDescription}</p>
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
                    <span className={styles.chip} data-booking-credit-remaining={credit.creditId}>{c.remaining(credit.remainingCredits, credit.totalCredits)}</span>
                    <span className={styles.chip}>{credit.status === 'active' ? c.activeStatus : credit.status === 'used' ? c.usedStatus : credit.status === 'expired' ? c.expiredStatus : c.revokedStatus}</span>
                    <span className={styles.chip} data-booking-credit-expiry={credit.creditId}>{credit.expiresAt ? c.expiresAt(credit.expiresAt.slice(0, 10)) : c.noExpiry}</span>
                  </div>
                  <p className={styles.muted}>{`${c.packageLabel} ${textForLocale(pkg?.name, locale) || credit.packageId}`}</p>
                  <p className={styles.muted}>{`${c.redemptions} ${credit.redemptions?.filter((entry) => !entry.restoredAt).length ?? 0}`}</p>
                  <div className={styles.actions}>
                    <button className={styles.buttonSecondary} type="button" onClick={() => setCreditDraft(draftFromCredit(credit, defaultPackageId))}>{c.edit}</button>
                    {credit.status !== 'revoked' ? <button className={styles.buttonSecondary} type="button" data-booking-credit-revoke={credit.creditId} onClick={() => revokeCredit(credit)}>{c.revoke}</button> : null}
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
              <h2 className={styles.modalTitle}>{packageDraft.packageId ? c.editPackageTitle : c.newPackageTitle}</h2>
              <button className={styles.buttonSecondary} type="button" onClick={() => setPackageDraft(null)}>{c.close}</button>
            </div>
            <div className={styles.formGrid}>
              <label className={styles.field}><span className={styles.label}>{c.nameKo}</span><input className={styles.input} value={packageDraft.nameKo} onChange={(event) => setPackageDraft({ ...packageDraft, nameKo: event.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.nameEn}</span><input className={styles.input} value={packageDraft.nameEn} onChange={(event) => setPackageDraft({ ...packageDraft, nameEn: event.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.nameZh}</span><input className={styles.input} value={packageDraft.nameZh} onChange={(event) => setPackageDraft({ ...packageDraft, nameZh: event.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.credits}</span><input className={styles.input} type="number" min={1} max={250} value={packageDraft.credits} onChange={(event) => setPackageDraft({ ...packageDraft, credits: Number(event.target.value) })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.validityDays}</span><input className={styles.input} type="number" min={1} value={packageDraft.validityDays} onChange={(event) => setPackageDraft({ ...packageDraft, validityDays: Number(event.target.value) })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.priceAmount}</span><input className={styles.input} type="number" min={0} value={packageDraft.priceAmount} onChange={(event) => setPackageDraft({ ...packageDraft, priceAmount: Number(event.target.value) })} /></label>
              <label className={styles.field}>
                <span className={styles.label}>{c.currency}</span>
                <select className={styles.select} value={packageDraft.priceCurrency} onChange={(event) => setPackageDraft({ ...packageDraft, priceCurrency: event.target.value as PackageDraft['priceCurrency'] })}>
                  <option value="TWD">TWD</option>
                  <option value="KRW">KRW</option>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
              <label className={styles.field}><span className={styles.label}><input type="checkbox" checked={packageDraft.isActive} onChange={(event) => setPackageDraft({ ...packageDraft, isActive: event.target.checked })} /> {c.activeLabel}</span></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>{c.descriptionKo}</span><textarea className={styles.textarea} value={packageDraft.descriptionKo} onChange={(event) => setPackageDraft({ ...packageDraft, descriptionKo: event.target.value })} /></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>{c.descriptionEn}</span><textarea className={styles.textarea} value={packageDraft.descriptionEn} onChange={(event) => setPackageDraft({ ...packageDraft, descriptionEn: event.target.value })} /></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>{c.descriptionZh}</span><textarea className={styles.textarea} value={packageDraft.descriptionZh} onChange={(event) => setPackageDraft({ ...packageDraft, descriptionZh: event.target.value })} /></label>
              <fieldset className={`${styles.field} ${styles.fieldFull}`}>
                <legend className={styles.label}>{c.eligibleServices}</legend>
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
                <p className={styles.muted}>{c.eligibleServicesHint}</p>
              </fieldset>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={savePackage} disabled={saving}>{saving ? c.saving : c.savePackage}</button>
              <button className={styles.buttonSecondary} type="button" onClick={() => setPackageDraft(null)}>{c.cancel}</button>
            </div>
          </div>
        </div>
      ) : null}

      {creditDraft ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{creditDraft.creditId ? c.editCreditTitle : c.newCreditTitle}</h2>
              <button className={styles.buttonSecondary} type="button" onClick={() => setCreditDraft(null)}>{c.close}</button>
            </div>
            <div className={styles.formGrid}>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>{c.packageLabel}</span>
                <select className={styles.select} value={creditDraft.packageId} onChange={(event) => setCreditDraft({ ...creditDraft, packageId: event.target.value })} disabled={Boolean(creditDraft.creditId)}>
                  {packages.map((pkg) => <option key={pkg.packageId} value={pkg.packageId}>{textForLocale(pkg.name, locale)}</option>)}
                </select>
              </label>
              <label className={styles.field}><span className={styles.label}>{c.customerEmail}</span><input className={styles.input} type="email" value={creditDraft.customerEmail} onChange={(event) => setCreditDraft({ ...creditDraft, customerEmail: event.target.value })} disabled={Boolean(creditDraft.creditId)} /></label>
              <label className={styles.field}><span className={styles.label}>{c.customerName}</span><input className={styles.input} value={creditDraft.customerName} onChange={(event) => setCreditDraft({ ...creditDraft, customerName: event.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.totalCredits}</span><input className={styles.input} type="number" min={1} max={250} value={creditDraft.totalCredits} onChange={(event) => setCreditDraft({ ...creditDraft, totalCredits: Number(event.target.value) })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.remainingCredits}</span><input className={styles.input} type="number" min={0} max={250} value={creditDraft.remainingCredits} onChange={(event) => setCreditDraft({ ...creditDraft, remainingCredits: Number(event.target.value) })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.expires}</span><input className={styles.input} type="date" value={creditDraft.expiresAtDate} onChange={(event) => setCreditDraft({ ...creditDraft, expiresAtDate: event.target.value })} /></label>
              <label className={styles.field}>
                <span className={styles.label}>{c.status}</span>
                <select className={styles.select} value={creditDraft.status} onChange={(event) => setCreditDraft({ ...creditDraft, status: event.target.value as CreditDraft['status'] })}>
                  <option value="active">{c.activeStatus}</option>
                  <option value="used">{c.usedStatus}</option>
                  <option value="expired">{c.expiredStatus}</option>
                  <option value="revoked">{c.revokedStatus}</option>
                </select>
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>{c.note}</span><textarea className={styles.textarea} value={creditDraft.note} onChange={(event) => setCreditDraft({ ...creditDraft, note: event.target.value })} /></label>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={saveCredit} disabled={saving || !creditDraft.packageId || !creditDraft.customerEmail}>{saving ? c.saving : c.saveCredit}</button>
              <button className={styles.buttonSecondary} type="button" onClick={() => setCreditDraft(null)}>{c.cancel}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
