'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  TranslationReleaseApprovalSummary,
} from '@/lib/builder/publish-gate/translation-release-approval-model';
import type {
  TranslationReleaseApprovalReviewerReport,
} from '@/lib/builder/publish-gate/translation-release-approval-report';
import type {
  TranslationReleasePolicyMode,
} from '@/lib/builder/publish-gate/translation-release-policy';
import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';
import type { Locale } from '@/lib/locales';
import styles from './SiteSettingsAdvancedTab.module.css';
import { TranslationReleaseReviewerReport } from './TranslationReleaseReviewerReport';
import {
  isPolicyMode,
  parseApprovalPayload,
  parsePolicyPayload,
  POLICY_MODES,
  ROLE_OPTIONS,
} from './translation-release-settings-payload';
import { getTranslationReleaseSettingsCopy } from './translation-release-settings-copy';

function usernamesMatch(left: string | null, right: string): boolean {
  if (!left) return false;
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

export function TranslationReleaseSettingsPanel({ locale }: { readonly locale: Locale }) {
  const copy = getTranslationReleaseSettingsCopy(locale);
  const [mode, setMode] = useState<TranslationReleasePolicyMode>('acknowledge-other-page-warnings');
  const [roles, setRoles] = useState<readonly BuilderRoleName[]>([]);
  const [approvals, setApprovals] = useState<readonly TranslationReleaseApprovalSummary[]>([]);
  const [report, setReport] = useState<TranslationReleaseApprovalReviewerReport | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [policyResponse, approvalsResponse] = await Promise.all([
        fetch('/api/builder/site/translation-release-policy', { credentials: 'same-origin', signal }),
        fetch('/api/builder/site/translation-release-approvals?status=pending', { credentials: 'same-origin', signal }),
      ]);
      if (!policyResponse.ok || !approvalsResponse.ok) throw new Error(copy.loadError);
      const policy = parsePolicyPayload(await policyResponse.json());
      if (!policy) throw new Error(copy.loadError);
      setMode(policy.mode);
      setRoles(policy.approvalRequiredForRoles);
      const approvalPayload = parseApprovalPayload(await approvalsResponse.json());
      setApprovals(approvalPayload.approvals);
      setReport(approvalPayload.report);
      setCurrentUsername(approvalPayload.currentActor?.username ?? null);
    } catch (caught) {
      if (signal?.aborted) return;
      setError(caught instanceof Error ? caught.message : copy.loadError);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [copy.loadError]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  function updateRole(role: BuilderRoleName, checked: boolean): void {
    setRoles((current) => {
      const next = checked ? [...current, role] : current.filter((candidate) => candidate !== role);
      return ROLE_OPTIONS.filter((candidate) => next.includes(candidate));
    });
  }

  async function savePolicy(): Promise<void> {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch('/api/builder/site/translation-release-policy', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode, approvalRequiredForRoles: roles }),
      });
      if (!response.ok) throw new Error(copy.saveError);
      const policy = parsePolicyPayload(await response.json());
      if (!policy) throw new Error(copy.saveError);
      setRoles(policy.approvalRequiredForRoles);
      setMessage(copy.saved);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.saveError);
    } finally {
      setSaving(false);
    }
  }

  async function decide(id: string, decision: 'approve' | 'reject'): Promise<void> {
    setDecidingId(id);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/builder/site/translation-release-approvals/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      if (!response.ok) throw new Error(copy.loadError);
      setMessage(decision === 'approve' ? copy.approved : copy.rejected);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.loadError);
    } finally {
      setDecidingId(null);
    }
  }

  return (
    <section className={styles.policyPanel} data-builder-translation-release-settings="true">
      <div className={styles.policyHeader}>
        <div>
          <div className={styles.sectionHeading}>{copy.heading}</div>
          <p className={styles.description}>{copy.description}</p>
        </div>
        <button className={styles.secondaryButton} type="button" onClick={() => void load()} disabled={loading}>
          {copy.refresh}
        </button>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{copy.modeLabel}</label>
        <select
          className={styles.input}
          value={mode}
          data-builder-translation-release-policy-mode="true"
          onChange={(event) => {
            if (isPolicyMode(event.target.value)) setMode(event.target.value);
          }}
        >
          {POLICY_MODES.map((value) => (
            <option key={value} value={value}>{copy.modeLabels[value]}</option>
          ))}
        </select>
      </div>

      <div className={styles.roleGrid}>
        {ROLE_OPTIONS.map((role) => (
          <label key={role} className={styles.roleToggle}>
            <input
              type="checkbox"
              checked={roles.includes(role)}
              data-builder-translation-release-role={role}
              data-builder-translation-release-role-owner={role === 'owner' ? 'true' : undefined}
              data-builder-translation-release-role-admin={role === 'admin' ? 'true' : undefined}
              onChange={(event) => updateRole(role, event.target.checked)}
            />
            <span>{copy.roleLabels[role]}</span>
          </label>
        ))}
      </div>

      <div className={styles.policyActions}>
        <button
          className={styles.primaryButton}
          type="button"
          disabled={saving || loading}
          data-builder-translation-release-policy-save="true"
          onClick={() => void savePolicy()}
        >
          {saving ? copy.loading : copy.save}
        </button>
        <span className={error ? styles.errorText : styles.successText} data-builder-translation-release-save-state="true">
          {error ?? message}
        </span>
      </div>

      <div className={styles.queueHeader}>{copy.queueHeading}</div>
      <TranslationReleaseReviewerReport copy={copy} report={report} />
      {loading ? (
        <div className={styles.queueEmpty}>{copy.loading}</div>
      ) : approvals.length === 0 ? (
        <div className={styles.queueEmpty} data-builder-translation-release-empty="true">{copy.queueEmpty}</div>
      ) : (
        <div className={styles.approvalQueue}>
          {approvals.map((approval) => {
            const selfReviewDisabled = usernamesMatch(currentUsername, approval.requestedBy);
            const actionDisabled = decidingId === approval.id || selfReviewDisabled;
            return (
              <div
                key={approval.id}
                className={styles.approvalRow}
                data-builder-translation-release-approval-row="true"
              >
                <div className={styles.approvalMeta}>
                  <strong>{approval.pageId}</strong>
                  <span>{approval.locale} · {copy.roleLabels[approval.requestedRole]} · {approval.requestedBy}</span>
                  {selfReviewDisabled ? (
                    <span data-builder-translation-release-self-review-disabled="true">
                      {copy.selfReviewDisabled}
                    </span>
                  ) : null}
                </div>
                <div className={styles.approvalActions}>
                  <button
                    className={styles.primaryButton}
                    type="button"
                    disabled={actionDisabled}
                    data-builder-translation-release-approval-approve="true"
                    onClick={() => void decide(approval.id, 'approve')}
                  >
                    {copy.approve}
                  </button>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    disabled={actionDisabled}
                    data-builder-translation-release-approval-reject="true"
                    onClick={() => void decide(approval.id, 'reject')}
                  >
                    {copy.reject}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
