'use client';

import { useState } from 'react';
import type { Experiment, ExperimentStatus } from '@/lib/builder/experiments/types';

interface Props {
  locale: 'ko' | 'zh-hant' | 'en';
  initialExperiments: Experiment[];
}

const STATUS_COLOR: Record<ExperimentStatus, string> = {
  draft: '#94a3b8',
  running: '#16a34a',
  paused: '#f59e0b',
  completed: '#0f172a',
};

export default function ExperimentsAdmin({ locale, initialExperiments }: Props) {
  const copy = getExperimentsCopy(locale);
  const [experiments, setExperiments] = useState(initialExperiments);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [goalEvent, setGoalEvent] = useState('cta-click');
  const [variantsRaw, setVariantsRaw] = useState('control:50\ntest:50');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    const res = await fetch(`/api/builder/experiments?locale=${encodeURIComponent(locale)}`, { credentials: 'same-origin' });
    const payload = (await res.json().catch(() => ({}))) as { experiments?: Experiment[]; error?: string };
    if (!res.ok) {
      if (payload.error) setError(payload.error);
      return;
    }
    if (!payload.experiments) return;
    setExperiments(payload.experiments);
  }

  function parseVariants(raw: string) {
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [id, weightStr] = line.split(':');
        return {
          variantId: (id ?? '').trim() || `v${Math.random().toString(36).slice(2, 5)}`,
          label: (id ?? '').trim(),
          weight: Math.max(1, Math.min(100, Number((weightStr ?? '50').trim()) || 50)),
        };
      });
  }

  async function create() {
    setBusy(true);
    setError('');
    try {
      const variants = parseVariants(variantsRaw);
      if (variants.length < 2) {
        setError(copy.minVariantsError);
        return;
      }
      const res = await fetch(`/api/builder/experiments?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          targetPath: targetPath.trim(),
          variants,
          goalEvent: goalEvent.trim(),
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || res.statusText);
        return;
      }
      setShowCreate(false);
      setName('');
      setTargetPath('');
      setVariantsRaw('control:50\ntest:50');
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(experiment: Experiment, status: ExperimentStatus) {
    setError('');
    const res = await fetch(`/api/builder/experiments/${experiment.experimentId}?locale=${encodeURIComponent(locale)}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      setError(payload.error || res.statusText);
      return;
    }
    await refresh();
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex' }}>
        <button type="button" onClick={() => setShowCreate((v) => !v)} style={{ marginLeft: 'auto', padding: '6px 12px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          {copy.toggleCreateLabel}
        </button>
      </div>

      {showCreate ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' }}>
          <input type="text" placeholder={copy.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
          <input type="text" placeholder={copy.targetPathPlaceholder} value={targetPath} onChange={(e) => setTargetPath(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
          <input type="text" placeholder={copy.goalEventPlaceholder} value={goalEvent} onChange={(e) => setGoalEvent(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
          <textarea
            value={variantsRaw}
            onChange={(e) => setVariantsRaw(e.target.value)}
            rows={5}
            placeholder={copy.variantsPlaceholder}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontFamily: 'ui-monospace, Menlo, monospace', resize: 'vertical' }}
          />
          {error ? <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div> : null}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" onClick={() => setShowCreate(false)} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>{copy.cancelLabel}</button>
            <button type="button" disabled={busy || !name.trim()} onClick={create} style={{ padding: '6px 12px', border: 0, background: busy ? '#94a3b8' : '#16a34a', color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: busy ? 'not-allowed' : 'pointer' }}>{copy.saveLabel}</button>
          </div>
        </div>
      ) : null}

      {experiments.map((exp) => {
        const totalExp = Object.values(exp.metrics.exposures).reduce((a, b) => a + b, 0);
        const totalConv = Object.values(exp.metrics.conversions).reduce((a, b) => a + b, 0);
        return (
          <div key={exp.experimentId} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong>{exp.name}</strong>
              <span style={{ padding: '2px 8px', borderRadius: 999, background: `${STATUS_COLOR[exp.status]}22`, color: STATUS_COLOR[exp.status], fontSize: 11, fontWeight: 700 }}>
                {exp.status}
              </span>
              <span style={{ color: '#94a3b8', fontSize: 11 }}>
                {exp.targetPath || copy.siteWideLabel} · {copy.goalLabel}: {exp.goalEvent}
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                {exp.status === 'draft' || exp.status === 'paused' ? (
                  <button type="button" onClick={() => setStatus(exp, 'running')} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>{copy.startLabel}</button>
                ) : null}
                {exp.status === 'running' ? (
                  <button type="button" onClick={() => setStatus(exp, 'paused')} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>{copy.pauseLabel}</button>
                ) : null}
                {exp.status !== 'completed' ? (
                  <button type="button" onClick={() => setStatus(exp, 'completed')} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>{copy.completeLabel}</button>
                ) : null}
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              {copy.totalExposuresLabel} {totalExp} · {copy.totalConversionsLabel} {totalConv} · {copy.variantsCountLabel(exp.variants.length)}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px' }}>{copy.variantColumnLabel}</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px' }}>{copy.weightColumnLabel}</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px' }}>{copy.exposuresColumnLabel}</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px' }}>{copy.conversionsColumnLabel}</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px' }}>{copy.rateColumnLabel}</th>
                </tr>
              </thead>
              <tbody>
                {exp.variants.map((v) => {
                  const e = exp.metrics.exposures[v.variantId] ?? 0;
                  const c = exp.metrics.conversions[v.variantId] ?? 0;
                  return (
                    <tr key={v.variantId} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '4px 8px', fontFamily: 'ui-monospace, Menlo, monospace' }}>{v.label}</td>
                      <td style={{ padding: '4px 8px', textAlign: 'right' }}>{v.weight}</td>
                      <td style={{ padding: '4px 8px', textAlign: 'right' }}>{e}</td>
                      <td style={{ padding: '4px 8px', textAlign: 'right' }}>{c}</td>
                      <td style={{ padding: '4px 8px', textAlign: 'right' }}>{e > 0 ? `${((c / e) * 100).toFixed(1)}%` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {experiments.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
          {copy.emptyLabel}
        </div>
      ) : null}
    </div>
  );
}

function getExperimentsCopy(locale: 'ko' | 'zh-hant' | 'en') {
  return {
    toggleCreateLabel: locale === 'ko' ? '+ 새 실험' : locale === 'zh-hant' ? '+ 新增實驗' : '+ New experiment',
    namePlaceholder: locale === 'ko' ? '실험 이름' : locale === 'zh-hant' ? '實驗名稱' : 'Experiment name',
    targetPathPlaceholder:
      locale === 'ko'
        ? '대상 경로 (예: /ko/services, 비우면 site-wide)'
        : locale === 'zh-hant'
          ? '目標路徑（例如：/ko/services；留空則為 site-wide）'
          : 'Target path (e.g. /ko/services, leave empty for site-wide)',
    goalEventPlaceholder:
      locale === 'ko' ? 'goal event (예: cta-click)' : locale === 'zh-hant' ? '目標事件（例如：cta-click）' : 'Goal event (e.g. cta-click)',
    variantsPlaceholder:
      locale === 'ko'
        ? 'variantId:weight\\ncontrol:50\\nvariantA:50'
        : locale === 'zh-hant'
          ? 'variantId:weight\\ncontrol:50\\nvariantA:50'
          : 'variantId:weight\\ncontrol:50\\nvariantA:50',
    cancelLabel: locale === 'ko' ? '취소' : locale === 'zh-hant' ? '取消' : 'Cancel',
    saveLabel: locale === 'ko' ? '저장' : locale === 'zh-hant' ? '儲存' : 'Save',
    siteWideLabel: locale === 'ko' ? '사이트 전체' : locale === 'zh-hant' ? '全站' : 'site-wide',
    goalLabel: locale === 'ko' ? 'goal' : locale === 'zh-hant' ? 'goal' : 'goal',
    startLabel: locale === 'ko' ? '시작' : locale === 'zh-hant' ? '開始' : 'Start',
    pauseLabel: locale === 'ko' ? '일시중지' : locale === 'zh-hant' ? '暫停' : 'Pause',
    completeLabel: locale === 'ko' ? '종료' : locale === 'zh-hant' ? '完成' : 'Complete',
    totalExposuresLabel: locale === 'ko' ? '누적 노출' : locale === 'zh-hant' ? '累計曝光' : 'Total exposures',
    totalConversionsLabel: locale === 'ko' ? '전환' : locale === 'zh-hant' ? '轉換' : 'Conversions',
    variantsCountLabel: (count: number) => (locale === 'ko' ? `변형 ${count}개` : locale === 'zh-hant' ? `變體 ${count} 個` : `${count} variants`),
    variantColumnLabel: locale === 'ko' ? 'variant' : locale === 'zh-hant' ? 'variant' : 'variant',
    weightColumnLabel: locale === 'ko' ? 'weight' : locale === 'zh-hant' ? 'weight' : 'weight',
    exposuresColumnLabel: locale === 'ko' ? '노출' : locale === 'zh-hant' ? '曝光' : 'Exposures',
    conversionsColumnLabel: locale === 'ko' ? '전환' : locale === 'zh-hant' ? '轉換' : 'Conversions',
    rateColumnLabel: locale === 'ko' ? '전환율' : locale === 'zh-hant' ? '轉換率' : 'Conversion rate',
    emptyLabel: locale === 'ko' ? '실험이 없습니다.' : locale === 'zh-hant' ? '沒有實驗。' : 'No experiments.',
    minVariantsError: locale === 'ko' ? '변형 2개 이상 필요' : locale === 'zh-hant' ? '至少需要 2 個變體' : 'At least 2 variants required',
  } as const;
}
