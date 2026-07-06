'use client';

import { useState } from 'react';
import type { BookingCancellationPolicy } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

type PolicyDraft = {
  policyId?: string;
  name: string;
  description: string;
  cancelHoursBefore: number;
  rescheduleHoursBefore: number;
  fullRefundHoursBefore: number;
  partialRefundHoursBefore: number;
  partialRefundPercent: number;
  cancellationFeePercent: number;
  isActive: boolean;
};

function draftFromPolicy(policy?: BookingCancellationPolicy): PolicyDraft {
  return {
    policyId: policy?.policyId,
    name: policy?.name ?? '',
    description: policy?.description ?? '',
    cancelHoursBefore: policy?.cancelHoursBefore ?? 0,
    rescheduleHoursBefore: policy?.rescheduleHoursBefore ?? 0,
    fullRefundHoursBefore: policy?.fullRefundHoursBefore ?? 0,
    partialRefundHoursBefore: policy?.partialRefundHoursBefore ?? 0,
    partialRefundPercent: policy?.partialRefundPercent ?? 0,
    cancellationFeePercent: policy?.cancellationFeePercent ?? 0,
    isActive: policy?.isActive ?? true,
  };
}

function policyPayload(draft: PolicyDraft) {
  return {
    name: draft.name,
    description: draft.description || undefined,
    cancelHoursBefore: draft.cancelHoursBefore,
    rescheduleHoursBefore: draft.rescheduleHoursBefore,
    fullRefundHoursBefore: draft.fullRefundHoursBefore,
    partialRefundHoursBefore: draft.partialRefundHoursBefore,
    partialRefundPercent: draft.partialRefundPercent,
    cancellationFeePercent: draft.cancellationFeePercent,
    isActive: draft.isActive,
  };
}

export default function BookingPoliciesAdmin({
  locale,
  initialPolicies,
}: {
  locale: Locale;
  initialPolicies: BookingCancellationPolicy[];
}) {
  const copy = {
    ko: {
      toolbar: (count: number) => `${count}개의 취소 정책(비활성 초안 포함)`,
      newPolicy: '새 정책',
      noPolicyNotes: '정책 메모 없음.',
      active: '활성',
      inactive: '비활성',
      edit: '편집',
      deactivate: '비활성화',
      activate: '활성화',
      editTitle: '취소 정책 편집',
      newTitle: '새 취소 정책',
      policyId: (id: string) => `정책 ID ${id}`,
      close: '닫기',
      name: '이름',
      activeLabel: '활성',
      description: '설명',
      cancelHoursBefore: '취소 가능 시점(시간 전)',
      rescheduleHoursBefore: '일정 변경 가능 시점(시간 전)',
      fullRefundHoursBefore: '전액 환불 가능 시점(시간 전)',
      partialRefundHoursBefore: '부분 환불 가능 시점(시간 전)',
      partialRefundPercent: '부분 환불 비율',
      cancellationFeePercent: '취소 수수료 비율',
      cancelButton: '취소',
      save: '정책 저장',
      saveFailed: '정책을 저장하지 못했습니다.',
      noFullRefundWindow: '전액 환불 기간 없음',
      fullRefund: (hours: number) => `전액 환불 ${hours}시간 전`,
      noPartialRefund: '부분 환불 없음',
      noFee: '수수료 없음',
      partialRefund: (hours: number, percent: number) => `부분 ${hours}시간 전 (${percent}%)`,
      fee: (percent: number) => `수수료 ${percent}%`,
      cancelAnytime: '언제든 취소 가능',
      rescheduleAnytime: '언제든 일정 변경 가능',
      cancelWindow: (hours: number) => `취소 ${hours}시간 전`,
      rescheduleWindow: (hours: number) => `일정 변경 ${hours}시간 전`,
    },
    'zh-hant': {
      toolbar: (count: number) => `${count} 個取消政策（包含停用草稿）`,
      newPolicy: '新增政策',
      noPolicyNotes: '沒有政策備註。',
      active: '啟用',
      inactive: '停用',
      edit: '編輯',
      deactivate: '停用',
      activate: '啟用',
      editTitle: '編輯取消政策',
      newTitle: '新增取消政策',
      policyId: (id: string) => `政策 ID ${id}`,
      close: '關閉',
      name: '名稱',
      activeLabel: '啟用',
      description: '說明',
      cancelHoursBefore: '可取消時間（前幾小時）',
      rescheduleHoursBefore: '可改期時間（前幾小時）',
      fullRefundHoursBefore: '全額退款時間（前幾小時）',
      partialRefundHoursBefore: '部分退款時間（前幾小時）',
      partialRefundPercent: '部分退款比例',
      cancellationFeePercent: '取消手續費比例',
      cancelButton: '取消',
      save: '儲存政策',
      saveFailed: '無法儲存政策。',
      noFullRefundWindow: '沒有全額退款時段',
      fullRefund: (hours: number) => `全額退款 ${hours} 小時前`,
      noPartialRefund: '沒有部分退款',
      noFee: '沒有手續費',
      partialRefund: (hours: number, percent: number) => `部分退款 ${hours} 小時前（${percent}%）`,
      fee: (percent: number) => `手續費 ${percent}%`,
      cancelAnytime: '可隨時取消',
      rescheduleAnytime: '可隨時改期',
      cancelWindow: (hours: number) => `取消 ${hours} 小時前`,
      rescheduleWindow: (hours: number) => `改期 ${hours} 小時前`,
    },
    en: {
      toolbar: (count: number) => `${count} cancellation policies, including inactive drafts.`,
      newPolicy: 'New policy',
      noPolicyNotes: 'No policy notes.',
      active: 'Active',
      inactive: 'Inactive',
      edit: 'Edit',
      deactivate: 'Deactivate',
      activate: 'Activate',
      editTitle: 'Edit cancellation policy',
      newTitle: 'New cancellation policy',
      policyId: (id: string) => `Policy ID ${id}`,
      close: 'Close',
      name: 'Name',
      activeLabel: 'Active',
      description: 'Description',
      cancelHoursBefore: 'Cancel hours before',
      rescheduleHoursBefore: 'Reschedule hours before',
      fullRefundHoursBefore: 'Full refund hours before',
      partialRefundHoursBefore: 'Partial refund hours before',
      partialRefundPercent: 'Partial refund percent',
      cancellationFeePercent: 'Cancellation fee percent',
      cancelButton: 'Cancel',
      save: 'Save policy',
      saveFailed: 'Unable to save policy.',
      noFullRefundWindow: 'no full refund window',
      fullRefund: (hours: number) => `full refund ${hours}h`,
      noPartialRefund: 'no partial refund',
      noFee: 'no fee',
      partialRefund: (hours: number, percent: number) => `partial ${hours}h (${percent}%)`,
      fee: (percent: number) => `fee ${percent}%`,
      cancelAnytime: 'cancel anytime',
      rescheduleAnytime: 'reschedule anytime',
      cancelWindow: (hours: number) => `cancel ${hours}h`,
      rescheduleWindow: (hours: number) => `reschedule ${hours}h`,
    },
  } as const;
  const c = copy[locale];
  const policySummary = (policy: BookingCancellationPolicy): string => {
    const segments = [
      policy.fullRefundHoursBefore > 0 ? c.fullRefund(policy.fullRefundHoursBefore) : c.noFullRefundWindow,
      policy.partialRefundPercent > 0 && policy.partialRefundHoursBefore > 0
        ? c.partialRefund(policy.partialRefundHoursBefore, policy.partialRefundPercent)
        : c.noPartialRefund,
      policy.cancellationFeePercent > 0 ? c.fee(policy.cancellationFeePercent) : c.noFee,
    ];
    return segments.join(' · ');
  };
  const managementSummary = (policy: BookingCancellationPolicy): string => {
    const segments = [
      policy.cancelHoursBefore > 0 ? c.cancelWindow(policy.cancelHoursBefore) : c.cancelAnytime,
      policy.rescheduleHoursBefore > 0 ? c.rescheduleWindow(policy.rescheduleHoursBefore) : c.rescheduleAnytime,
    ];
    return segments.join(' · ');
  };
  const [policies, setPolicies] = useState(initialPolicies);
  const [draft, setDraft] = useState<PolicyDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!draft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const url = draft.policyId
        ? `/api/builder/bookings/cancellation-policies/${draft.policyId}?${params.toString()}`
        : `/api/builder/bookings/cancellation-policies?${params.toString()}`;
      const res = await fetch(url, {
        method: draft.policyId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(policyPayload(draft)),
      });
      const data = (await res.json().catch(() => null)) as { policy?: BookingCancellationPolicy; error?: string } | null;
      const savedPolicy = data?.policy;
      if (!res.ok || !savedPolicy) throw new Error(data?.error || 'save failed');
      setPolicies((current) => {
        const without = current.filter((item) => item.policyId !== savedPolicy.policyId);
        return [...without, savedPolicy].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      });
      setDraft(null);
    } catch (err) {
      const message = err instanceof Error && err.message !== 'save failed' ? err.message : c.saveFailed;
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (policy: BookingCancellationPolicy) => {
    setError(null);
    const params = new URLSearchParams({ locale });
    const res = await fetch(`/api/builder/bookings/cancellation-policies/${policy.policyId}?${params.toString()}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ isActive: !policy.isActive }),
    });
    const data = (await res.json().catch(() => null)) as { policy?: BookingCancellationPolicy; error?: string } | null;
    if (!res.ok || !data?.policy) {
      setError(data?.error ?? c.saveFailed);
      return;
    }
    setPolicies((current) => current.map((item) => (item.policyId === policy.policyId ? data.policy! : item)));
  };

  return (
    <>
      <div className={styles.toolbar} data-booking-policies-admin="true">
        <div className={styles.muted}>
          {c.toolbar(policies.length)}
        </div>
        <button className={styles.button} type="button" onClick={() => setDraft(draftFromPolicy())}>
          {c.newPolicy}
        </button>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.grid}>
        {policies.map((policy) => (
              <article className={styles.card} key={policy.policyId} data-booking-policy-card={policy.policyId}>
              <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{policy.name}</h2>
              <p className={styles.muted}>{policy.description || c.noPolicyNotes}</p>
              <div className={styles.metaRow}>
                <span className={styles.chip} data-booking-policy-id={policy.policyId}>{policy.policyId}</span>
                <span className={styles.chip}>{policySummary(policy)}</span>
                <span className={styles.chip}>{managementSummary(policy)}</span>
                <span className={styles.chip}>{policy.isActive ? c.active : c.inactive}</span>
              </div>
              <div className={styles.actions}>
                <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(draftFromPolicy(policy))}>
                  {c.edit}
                </button>
                <button className={styles.buttonSecondary} type="button" onClick={() => toggleActive(policy)}>
                  {policy.isActive ? c.deactivate : c.activate}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {draft ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{draft.policyId ? c.editTitle : c.newTitle}</h2>
                {draft.policyId ? <p className={styles.muted}>{c.policyId(draft.policyId)}</p> : null}
              </div>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>
                {c.close}
              </button>
            </div>
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span className={styles.label}>{c.name}</span>
                <input className={styles.input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.activeLabel}</span>
                <select className={styles.select} value={draft.isActive ? 'active' : 'inactive'} onChange={(e) => setDraft({ ...draft, isActive: e.target.value === 'active' })}>
                  <option value="active">{c.active}</option>
                  <option value="inactive">{c.inactive}</option>
                </select>
              </label>
              <label className={styles.fieldFull}>
                <span className={styles.label}>{c.description}</span>
                <textarea className={styles.textarea} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.cancelHoursBefore}</span>
                <input className={styles.input} type="number" min={0} max={240} value={draft.cancelHoursBefore} onChange={(e) => setDraft({ ...draft, cancelHoursBefore: Number(e.target.value) || 0 })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.rescheduleHoursBefore}</span>
                <input className={styles.input} type="number" min={0} max={240} value={draft.rescheduleHoursBefore} onChange={(e) => setDraft({ ...draft, rescheduleHoursBefore: Number(e.target.value) || 0 })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.fullRefundHoursBefore}</span>
                <input className={styles.input} type="number" min={0} max={240} value={draft.fullRefundHoursBefore} onChange={(e) => setDraft({ ...draft, fullRefundHoursBefore: Number(e.target.value) || 0 })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.partialRefundHoursBefore}</span>
                <input className={styles.input} type="number" min={0} max={240} value={draft.partialRefundHoursBefore} onChange={(e) => setDraft({ ...draft, partialRefundHoursBefore: Number(e.target.value) || 0 })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.partialRefundPercent}</span>
                <input className={styles.input} type="number" min={0} max={100} value={draft.partialRefundPercent} onChange={(e) => setDraft({ ...draft, partialRefundPercent: Number(e.target.value) || 0 })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.cancellationFeePercent}</span>
                <input className={styles.input} type="number" min={0} max={100} value={draft.cancellationFeePercent} onChange={(e) => setDraft({ ...draft, cancellationFeePercent: Number(e.target.value) || 0 })} />
              </label>
            </div>
            <div className={styles.actions} style={{ marginTop: 18 }}>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>
                {c.cancelButton}
              </button>
              <button className={styles.button} type="button" onClick={save} disabled={saving}>
                {c.save}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
