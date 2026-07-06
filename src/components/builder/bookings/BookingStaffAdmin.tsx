'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Staff } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

const copy = {
  ko: {
    summary: (count: number) => `${count}명의 예약 프로필 담당자`,
    newStaff: '새 담당자',
    active: '활성',
    inactive: '비활성',
    noNotificationEmail: '알림 이메일 없음',
    edit: '편집',
    availability: '가능 시간',
    deactivate: '비활성화',
    editStaff: '담당자 편집',
    newStaffDialog: '새 담당자',
    close: '닫기',
    nameKo: '이름 (KO)',
    nameEn: '이름 (EN)',
    nameZh: '이름 (ZH)',
    email: '이메일',
    titleKo: '직책 (KO)',
    titleEn: '직책 (EN)',
    titleZh: '직책 (ZH)',
    photoUrl: '사진 URL',
    bioKo: '소개 (KO)',
    bioEn: '소개 (EN)',
    bioZh: '소개 (ZH)',
    activeLabel: '활성',
    save: '담당자 저장',
    saving: '저장 중...',
    cancel: '취소',
    loading: '불러오는 중...',
    notificationEmailLabel: '알림 이메일',
  },
  'zh-hant': {
    summary: (count: number) => `${count} 位具有預約檔案的員工`,
    newStaff: '新增員工',
    active: '啟用',
    inactive: '停用',
    noNotificationEmail: '沒有通知電子郵件',
    edit: '編輯',
    availability: '可用時段',
    deactivate: '停用',
    editStaff: '編輯員工',
    newStaffDialog: '新增員工',
    close: '關閉',
    nameKo: '名稱（韓文）',
    nameEn: '名稱（英文）',
    nameZh: '名稱（繁中）',
    email: '電子郵件',
    titleKo: '職稱（韓文）',
    titleEn: '職稱（英文）',
    titleZh: '職稱（繁中）',
    photoUrl: '照片網址',
    bioKo: '簡介（韓文）',
    bioEn: '簡介（英文）',
    bioZh: '簡介（繁中）',
    activeLabel: '啟用',
    save: '儲存員工',
    saving: '儲存中...',
    cancel: '取消',
    loading: '載入中...',
    notificationEmailLabel: '通知電子郵件',
  },
  en: {
    summary: (count: number) => `${count} team members with booking profiles`,
    newStaff: 'New staff',
    active: 'Active',
    inactive: 'Inactive',
    noNotificationEmail: 'No notification email',
    edit: 'Edit',
    availability: 'Availability',
    deactivate: 'Deactivate',
    editStaff: 'Edit staff',
    newStaffDialog: 'New staff',
    close: 'Close',
    nameKo: 'Name KO',
    nameEn: 'Name EN',
    nameZh: 'Name ZH',
    email: 'Email',
    titleKo: 'Title KO',
    titleEn: 'Title EN',
    titleZh: 'Title ZH',
    photoUrl: 'Photo URL',
    bioKo: 'Bio KO',
    bioEn: 'Bio EN',
    bioZh: 'Bio ZH',
    activeLabel: 'Active',
    save: 'Save staff',
    saving: 'Saving...',
    cancel: 'Cancel',
    loading: 'Loading...',
    notificationEmailLabel: 'Notification email',
  },
} as const;

type StaffDraft = {
  staffId?: string;
  nameKo: string;
  nameZh: string;
  nameEn: string;
  titleKo: string;
  titleZh: string;
  titleEn: string;
  bioKo: string;
  bioZh: string;
  bioEn: string;
  email: string;
  photo: string;
  isActive: boolean;
};

function draftFromStaff(staff?: Staff): StaffDraft {
  return {
    staffId: staff?.staffId,
    nameKo: staff?.name.ko || '',
    nameZh: staff?.name['zh-hant'] || '',
    nameEn: staff?.name.en || '',
    titleKo: staff?.title.ko || '변호사',
    titleZh: staff?.title['zh-hant'] || '律師',
    titleEn: staff?.title.en || 'Attorney',
    bioKo: staff?.bio?.ko || '',
    bioZh: staff?.bio?.['zh-hant'] || '',
    bioEn: staff?.bio?.en || '',
    email: staff?.email || '',
    photo: staff?.photo || '',
    isActive: staff?.isActive ?? true,
  };
}

function staffPayload(draft: StaffDraft) {
  const fallback = draft.nameKo || draft.nameEn || 'Attorney';
  return {
    name: { ko: draft.nameKo || fallback, 'zh-hant': draft.nameZh || fallback, en: draft.nameEn || fallback },
    title: { ko: draft.titleKo || '변호사', 'zh-hant': draft.titleZh || draft.titleKo, en: draft.titleEn || draft.titleKo },
    bio: { ko: draft.bioKo, 'zh-hant': draft.bioZh || draft.bioKo, en: draft.bioEn || draft.bioKo },
    email: draft.email,
    photo: draft.photo,
    isActive: draft.isActive,
  };
}

export default function BookingStaffAdmin({
  locale,
  initialStaff,
}: {
  locale: Locale;
  initialStaff: Staff[];
}) {
  const [staff, setStaff] = useState(initialStaff);
  const [draft, setDraft] = useState<StaffDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const c = copy[locale];

  const save = async () => {
    if (!draft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const url = draft.staffId
        ? `/api/builder/bookings/staff/${draft.staffId}?${params.toString()}`
        : `/api/builder/bookings/staff?${params.toString()}`;
      const res = await fetch(url, {
        method: draft.staffId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(staffPayload(draft)),
      });
      const data = (await res.json().catch(() => null)) as { staff?: Staff; error?: string } | null;
      if (!res.ok || !data?.staff) throw new Error(data?.error || 'save failed');
      setStaff((current) => {
        const without = current.filter((item) => item.staffId !== data.staff!.staffId);
        return [...without, data.staff!].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      });
      setDraft(null);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== 'save failed'
          ? err.message
          : locale === 'ko'
            ? '담당자를 저장하지 못했습니다.'
            : locale === 'zh-hant'
              ? '無法儲存員工。'
              : 'Unable to save staff.',
      );
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (member: Staff) => {
    const params = new URLSearchParams({ locale });
    const res = await fetch(`/api/builder/bookings/staff/${member.staffId}?${params.toString()}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) {
      const data = (await res.json()) as { staff: Staff };
      setStaff((current) => current.map((item) => item.staffId === member.staffId ? data.staff : item));
    }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.muted}>{c.summary(staff.length)}</div>
        <button className={styles.button} type="button" onClick={() => setDraft(draftFromStaff())}>{c.newStaff}</button>
      </div>
      <div className={styles.grid}>
        {staff.map((member) => (
          <article className={styles.card} key={member.staffId}>
            <div className={styles.cardImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {member.photo ? <img src={member.photo} alt="" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} /> : textForLocale(member.name, locale).slice(0, 2)}
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{textForLocale(member.name, locale)}</h2>
              <div className={styles.metaRow}>
                <span className={styles.chip}>{textForLocale(member.title, locale)}</span>
                <span className={styles.chip}>{member.isActive ? c.active : c.inactive}</span>
              </div>
              <p className={styles.muted}>{textForLocale(member.bio, locale)}</p>
              <p className={styles.muted}><strong>{c.notificationEmailLabel}:</strong> {member.email || c.noNotificationEmail}</p>
              <div className={styles.actions}>
                <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(draftFromStaff(member))}>{c.edit}</button>
                <Link className={styles.buttonSecondary} href={`/${locale}/admin-builder/bookings/staff/${member.staffId}/availability`}>{c.availability}</Link>
                {member.isActive ? <button className={styles.buttonSecondary} type="button" onClick={() => deactivate(member)}>{c.deactivate}</button> : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {draft ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{draft.staffId ? c.editStaff : c.newStaffDialog}</h2>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>{c.close}</button>
            </div>
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.formGrid}>
              <label className={styles.field}><span className={styles.label}>{c.nameKo}</span><input className={styles.input} value={draft.nameKo} onChange={(e) => setDraft({ ...draft, nameKo: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.nameEn}</span><input className={styles.input} value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.nameZh}</span><input className={styles.input} value={draft.nameZh} onChange={(e) => setDraft({ ...draft, nameZh: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.email}</span><input className={styles.input} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.titleKo}</span><input className={styles.input} value={draft.titleKo} onChange={(e) => setDraft({ ...draft, titleKo: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.titleEn}</span><input className={styles.input} value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>{c.titleZh}</span><input className={styles.input} value={draft.titleZh} onChange={(e) => setDraft({ ...draft, titleZh: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}><input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} /> {c.activeLabel}</span></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>{c.photoUrl}</span><input className={styles.input} value={draft.photo} onChange={(e) => setDraft({ ...draft, photo: e.target.value })} /></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>{c.bioKo}</span><textarea className={styles.textarea} value={draft.bioKo} onChange={(e) => setDraft({ ...draft, bioKo: e.target.value })} /></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>{c.bioEn}</span><textarea className={styles.textarea} value={draft.bioEn} onChange={(e) => setDraft({ ...draft, bioEn: e.target.value })} /></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>{c.bioZh}</span><textarea className={styles.textarea} value={draft.bioZh} onChange={(e) => setDraft({ ...draft, bioZh: e.target.value })} /></label>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={save} disabled={saving}>{saving ? c.saving : c.save}</button>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>{c.cancel}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
