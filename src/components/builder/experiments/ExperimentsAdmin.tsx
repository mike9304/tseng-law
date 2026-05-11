'use client';

import { useState } from 'react';
import type { Experiment, ExperimentStatus } from '@/lib/builder/experiments/types';

interface Props {
  initialExperiments: Experiment[];
}

const STATUS_COLOR: Record<ExperimentStatus, string> = {
  draft: '#94a3b8',
  running: '#16a34a',
  paused: '#f59e0b',
  completed: '#0f172a',
};

export default function ExperimentsAdmin({ initialExperiments }: Props) {
  const [experiments, setExperiments] = useState(initialExperiments);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [goalEvent, setGoalEvent] = useState('cta-click');
  const [variantsRaw, setVariantsRaw] = useState('control:50\ntest:50');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    const res = await fetch('/api/builder/experiments', { credentials: 'same-origin' });
    if (!res.ok) return;
    const payload = (await res.json()) as { experiments: Experiment[] };
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
        setError('변형 2개 이상 필요');
        return;
      }
      const res = await fetch('/api/builder/experiments', {
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
    const res = await fetch(`/api/builder/experiments/${experiment.experimentId}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await refresh();
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex' }}>
        <button type="button" onClick={() => setShowCreate((v) => !v)} style={{ marginLeft: 'auto', padding: '6px 12px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          + 새 실험
        </button>
      </div>

      {showCreate ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' }}>
          <input type="text" placeholder="실험 이름" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
          <input type="text" placeholder="대상 경로 (예: /ko/services, 비우면 site-wide)" value={targetPath} onChange={(e) => setTargetPath(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
          <input type="text" placeholder="goal event (예: cta-click)" value={goalEvent} onChange={(e) => setGoalEvent(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
          <textarea
            value={variantsRaw}
            onChange={(e) => setVariantsRaw(e.target.value)}
            rows={5}
            placeholder={"variantId:weight\ncontrol:50\nvariantA:50"}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontFamily: 'ui-monospace, Menlo, monospace', resize: 'vertical' }}
          />
          {error ? <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div> : null}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" onClick={() => setShowCreate(false)} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>취소</button>
            <button type="button" disabled={busy || !name.trim()} onClick={create} style={{ padding: '6px 12px', border: 0, background: busy ? '#94a3b8' : '#16a34a', color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: busy ? 'not-allowed' : 'pointer' }}>저장</button>
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
                {exp.targetPath || 'site-wide'} · goal: {exp.goalEvent}
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                {exp.status === 'draft' || exp.status === 'paused' ? (
                  <button type="button" onClick={() => setStatus(exp, 'running')} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>시작</button>
                ) : null}
                {exp.status === 'running' ? (
                  <button type="button" onClick={() => setStatus(exp, 'paused')} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>일시중지</button>
                ) : null}
                {exp.status !== 'completed' ? (
                  <button type="button" onClick={() => setStatus(exp, 'completed')} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>종료</button>
                ) : null}
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              누적 노출 {totalExp} · 전환 {totalConv} · 변형 {exp.variants.length}개
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px' }}>variant</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px' }}>weight</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px' }}>노출</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px' }}>전환</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px' }}>전환율</th>
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
          실험이 없습니다.
        </div>
      ) : null}
    </div>
  );
}
