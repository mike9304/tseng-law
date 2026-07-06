'use client';

import { FormEvent, useState } from 'react';
import type { PublicSiteMember } from '@/lib/builder/members/members-engine';
import type { Locale } from '@/lib/locales';
import styles from './MembersArea.module.css';

interface MemberProfileClientProps {
  member: PublicSiteMember;
  locale: Locale;
}

export default function MemberProfileClient({ member, locale }: MemberProfileClientProps) {
  const [current, setCurrent] = useState(member);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const profileNote = current.customFields?.profileNote?.trim() || '';
  const bookingEmailReminders = current.customFields?.bookingEmailReminders === 'true';
  const bookingSmsReminders = current.customFields?.bookingSmsReminders === 'true';
  const billingEmails = current.customFields?.billingEmails === 'true';
  const memberEmailAliases = (() => {
    try {
      return current.customFields?.memberEmailAliases ? JSON.parse(current.customFields.memberEmailAliases) : [];
    } catch {
      return [];
    }
  })() as string[];
  const notificationSummary = [
    bookingEmailReminders ? (locale === 'ko' ? '예약 이메일' : locale === 'zh-hant' ? '預約信件' : 'Booking email') : null,
    bookingSmsReminders ? (locale === 'ko' ? '예약 SMS' : locale === 'zh-hant' ? '預約簡訊' : 'Booking SMS') : null,
    billingEmails ? (locale === 'ko' ? '청구서 이메일' : locale === 'zh-hant' ? '帳單信件' : 'Billing email') : null,
  ].filter(Boolean) as string[];
  const savedLabel = locale === 'ko' ? '저장되었습니다.' : locale === 'zh-hant' ? '已儲存。' : 'Saved.';
  const savingLabel = locale === 'ko' ? '저장 중...' : locale === 'zh-hant' ? '儲存中...' : 'Saving...';
  const saveLabel = locale === 'ko' ? '프로필 저장' : locale === 'zh-hant' ? '儲存個人資料' : 'Save profile';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/members/me?locale=${locale}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale,
          email: String(form.get('email') ?? ''),
          name: String(form.get('name') ?? ''),
          phone: String(form.get('phone') ?? ''),
          profilePhoto: String(form.get('profilePhoto') ?? ''),
          customFields: {
            ...(current.customFields ?? {}),
            profileNote: String(form.get('profileNote') ?? '').trim(),
            bookingEmailReminders: form.get('bookingEmailReminders') === 'on' ? 'true' : 'false',
            bookingSmsReminders: form.get('bookingSmsReminders') === 'on' ? 'true' : 'false',
            billingEmails: form.get('billingEmails') === 'on' ? 'true' : 'false',
          },
        }),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || 'save_failed');
      setCurrent(json.member as PublicSiteMember);
      setMessage(savedLabel);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'save_failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.profileForm} onSubmit={submit} data-member-profile-form="true">
      <div className={styles.memberProfileSummary} data-member-profile-summary="true">
        <div className={styles.memberProfilePhotoWrap}>
          {current.profilePhoto ? (
            <img
              className={styles.memberProfilePhoto}
              src={current.profilePhoto}
              alt={current.name}
              data-member-profile-photo-preview="true"
            />
          ) : (
            <div className={styles.memberProfilePhotoPlaceholder} data-member-profile-photo-preview="empty">
              {current.name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.memberBadge}>
          <span>{current.role}</span>
          <strong>{current.email}</strong>
        </div>
        {memberEmailAliases.length > 0 ? (
          <div className={styles.memberProfileChipRow} data-member-profile-aliases="true">
            <span className={styles.memberProfileChipLabel}>
              {locale === 'ko' ? '연결된 이전 이메일' : locale === 'zh-hant' ? '已連結舊信箱' : 'Linked previous emails'}
            </span>
            {memberEmailAliases.map((email) => (
              <span key={email} className={styles.memberProfileChip}>
                {email}
              </span>
            ))}
          </div>
        ) : null}
        <div className={styles.memberProfileSummaryCopy}>
          <strong>{current.name}</strong>
          <p>{current.phone || (locale === 'ko' ? '전화번호 없음' : locale === 'zh-hant' ? '未填電話' : 'No phone on file')}</p>
          {profileNote ? (
            <small data-member-profile-note-preview="true">{profileNote}</small>
          ) : null}
          <div className={styles.memberProfileChipRow} data-member-profile-notification-summary="true">
            <span className={styles.memberProfileChipLabel}>
              {locale === 'ko' ? '알림' : locale === 'zh-hant' ? '通知' : 'Notifications'}
            </span>
            {notificationSummary.length > 0 ? (
              notificationSummary.map((item) => (
                <span key={item} className={styles.memberProfileChip}>
                  {item}
                </span>
              ))
            ) : (
              <small>{locale === 'ko' ? '현재 알림 없음' : locale === 'zh-hant' ? '目前沒有通知偏好' : 'No notification preferences set'}</small>
            )}
          </div>
        </div>
      </div>
      <label>
        {locale === 'ko' ? '이메일' : locale === 'zh-hant' ? '電子郵件' : 'Email'}
        {/* Email is read-only: the booking/billing portal authorizes by email, so a
            self-service change is blocked server-side (email_change_requires_verification)
            until a verified email-change flow exists. Keeping it in the form (readOnly)
            preserves the unchanged value so saving other fields still works. */}
        <input name="email" type="email" defaultValue={current.email} required readOnly aria-readonly="true" disabled={pending} data-member-profile-email-readonly="true" />
        <small>
          {locale === 'ko'
            ? '이메일 변경은 보안 확인이 필요합니다. 고객센터에 문의해 주세요.'
            : locale === 'zh-hant'
              ? '變更電子郵件需安全驗證，請聯絡客服。'
              : 'Email changes require verification — please contact support.'}
        </small>
      </label>
      <label>
        {locale === 'ko' ? '이름' : locale === 'zh-hant' ? '姓名' : 'Name'}
        <input name="name" defaultValue={current.name} required disabled={pending} />
      </label>
      <label>
        {locale === 'ko' ? '전화번호' : locale === 'zh-hant' ? '電話' : 'Phone'}
        <input name="phone" defaultValue={current.phone ?? ''} disabled={pending} />
      </label>
      <label>
        {locale === 'ko' ? '프로필 사진 URL' : locale === 'zh-hant' ? '個人照片網址' : 'Profile photo URL'}
        <input
          name="profilePhoto"
          defaultValue={current.profilePhoto ?? ''}
          placeholder="data:image/svg+xml;utf8,..."
          disabled={pending}
          data-member-profile-photo-input="true"
        />
      </label>
      <label>
        {locale === 'ko' ? '프로필 메모' : locale === 'zh-hant' ? '個人備註' : 'Profile note'}
        <textarea
          name="profileNote"
          defaultValue={profileNote}
          rows={3}
          disabled={pending}
          data-member-profile-note-input="true"
        />
      </label>
      <fieldset className={styles.memberProfileNotifications} disabled={pending}>
        <legend>{locale === 'ko' ? '알림 설정' : locale === 'zh-hant' ? '通知設定' : 'Notification preferences'}</legend>
        <label className={styles.memberProfileOption}>
          <input
            type="checkbox"
            name="bookingEmailReminders"
            defaultChecked={bookingEmailReminders}
            data-member-profile-booking-email="true"
          />
          <span>{locale === 'ko' ? '예약 이메일 알림' : locale === 'zh-hant' ? '預約電子郵件提醒' : 'Booking email reminders'}</span>
        </label>
        <label className={styles.memberProfileOption}>
          <input
            type="checkbox"
            name="bookingSmsReminders"
            defaultChecked={bookingSmsReminders}
            data-member-profile-booking-sms="true"
          />
          <span>{locale === 'ko' ? '예약 SMS 알림' : locale === 'zh-hant' ? '預約簡訊提醒' : 'Booking SMS reminders'}</span>
        </label>
        <label className={styles.memberProfileOption}>
          <input
            type="checkbox"
            name="billingEmails"
            defaultChecked={billingEmails}
            data-member-profile-billing-email="true"
          />
          <span>{locale === 'ko' ? '청구서 이메일 알림' : locale === 'zh-hant' ? '帳單電子郵件提醒' : 'Billing email updates'}</span>
        </label>
      </fieldset>
      <button type="submit" disabled={pending}>{pending ? savingLabel : saveLabel}</button>
      {message ? <p className={styles.message} role="status">{message === 'duplicate_email' ? (locale === 'ko' ? '이미 가입된 이메일입니다.' : locale === 'zh-hant' ? '此電子郵件已註冊。' : 'That email is already registered.') : message}</p> : null}
    </form>
  );
}
