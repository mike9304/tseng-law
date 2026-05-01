'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Staff } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

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

  const save = async () => {
    if (!draft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const url = draft.staffId ? `/api/builder/bookings/staff/${draft.staffId}` : '/api/builder/bookings/staff';
      const res = await fetch(url, {
        method: draft.staffId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(staffPayload(draft)),
      });
      if (!res.ok) throw new Error('save failed');
      const data = (await res.json()) as { staff: Staff };
      setStaff((current) => {
        const without = current.filter((item) => item.staffId !== data.staff.staffId);
        return [...without, data.staff].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      });
      setDraft(null);
    } catch {
      setError('담당자를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (member: Staff) => {
    const res = await fetch(`/api/builder/bookings/staff/${member.staffId}`, {
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
        <div className={styles.muted}>{staff.length} team members with booking profiles.</div>
        <button className={styles.button} type="button" onClick={() => setDraft(draftFromStaff())}>New staff</button>
      </div>
      <div className={styles.grid}>
        {staff.map((member) => (
          <article className={styles.card} key={member.staffId}>
            <div className={styles.cardImage}>
              {member.photo ? <img src={member.photo} alt="" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} /> : textForLocale(member.name, locale).slice(0, 2)}
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{textForLocale(member.name, locale)}</h2>
              <div className={styles.metaRow}>
                <span className={styles.chip}>{textForLocale(member.title, locale)}</span>
                <span className={styles.chip}>{member.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <p className={styles.muted}>{textForLocale(member.bio, locale)}</p>
              <p className={styles.muted}>{member.email || 'No notification email'}</p>
              <div className={styles.actions}>
                <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(draftFromStaff(member))}>Edit</button>
                <Link className={styles.buttonSecondary} href={`/${locale}/admin-builder/bookings/staff/${member.staffId}/availability`}>Availability</Link>
                {member.isActive ? <button className={styles.buttonSecondary} type="button" onClick={() => deactivate(member)}>Deactivate</button> : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {draft ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{draft.staffId ? 'Edit staff' : 'New staff'}</h2>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>Close</button>
            </div>
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.formGrid}>
              <label className={styles.field}><span className={styles.label}>Name KO</span><input className={styles.input} value={draft.nameKo} onChange={(e) => setDraft({ ...draft, nameKo: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>Name EN</span><input className={styles.input} value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>Name ZH</span><input className={styles.input} value={draft.nameZh} onChange={(e) => setDraft({ ...draft, nameZh: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>Email</span><input className={styles.input} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>Title KO</span><input className={styles.input} value={draft.titleKo} onChange={(e) => setDraft({ ...draft, titleKo: e.target.value })} /></label>
              <label className={styles.field}><span className={styles.label}>Title EN</span><input className={styles.input} value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} /></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>Photo URL</span><input className={styles.input} value={draft.photo} onChange={(e) => setDraft({ ...draft, photo: e.target.value })} /></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>Bio KO</span><textarea className={styles.textarea} value={draft.bioKo} onChange={(e) => setDraft({ ...draft, bioKo: e.target.value })} /></label>
              <label className={`${styles.field} ${styles.fieldFull}`}><span className={styles.label}>Bio EN</span><textarea className={styles.textarea} value={draft.bioEn} onChange={(e) => setDraft({ ...draft, bioEn: e.target.value })} /></label>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save staff'}</button>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
