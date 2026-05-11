'use client';

import { useState } from 'react';
import {
  COLOR_PREFERENCES,
  INDUSTRIES,
  TONES,
  type ColorPreference,
  type Industry,
  type SiteSpec,
  type Tone,
} from '@/lib/builder/ai-generator/site-spec';
import type { Locale } from '@/lib/locales';

interface DraftResponse {
  ok?: boolean;
  cached?: boolean;
  draft?: {
    spec: SiteSpec;
    palette: { primary: string; secondary: string; accent: string; background: string };
    content: {
      hero: { headline: string; body: string; ctaLabel?: string };
      sections: Array<{ sectionId: string; headline: string; body: string; bullets?: string[]; ctaLabel?: string }>;
      metaDescription: string;
    };
  };
  error?: string;
}

interface Props {
  locale: Locale;
}

export default function AiGeneratorWizard({ locale }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [industry, setIndustry] = useState<Industry>('law');
  const [companyName, setCompanyName] = useState('호정국제법률사무소');
  const [slogan, setSlogan] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [colorPreference, setColorPreference] = useState<ColorPreference>('cool');
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<DraftResponse['draft'] | null>(null);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedPageId, setAppliedPageId] = useState<string | null>(null);

  async function apply() {
    if (!draft) return;
    const slug = window.prompt('새 페이지 slug', `ai-${Date.now()}`);
    if (!slug) return;
    setApplying(true);
    setError('');
    setAppliedPageId(null);
    try {
      const res = await fetch('/api/builder/ai-generator/apply', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spec: {
            industry, companyName: companyName.trim(), slogan: slogan.trim() || undefined,
            tone, colorPreference, locale,
          },
          slug,
          title: companyName.trim(),
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { pageId?: string; error?: string };
      if (!res.ok || !payload.pageId) {
        setError(payload.error ?? '적용 실패');
        return;
      }
      setAppliedPageId(payload.pageId);
    } finally {
      setApplying(false);
    }
  }

  async function generate() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/builder/ai-generator', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry,
          companyName: companyName.trim(),
          slogan: slogan.trim() || undefined,
          tone,
          colorPreference,
          locale,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as DraftResponse;
      if (!res.ok || !payload.draft) {
        setError(payload.error ?? '생성 실패');
        return;
      }
      setDraft(payload.draft);
      setStep(5);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <strong style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>5-step 생성</strong>
        {([
          [1, '1. 업종'],
          [2, '2. 회사명·슬로건'],
          [3, '3. 톤'],
          [4, '4. 컬러'],
          [5, '5. 미리보기·생성'],
        ] as Array<[1 | 2 | 3 | 4 | 5, string]>).map(([n, label]) => (
          <button
            key={n}
            type="button"
            onClick={() => setStep(n)}
            disabled={n === 5 && !draft}
            style={{
              textAlign: 'left',
              padding: '8px 12px',
              border: step === n ? '2px solid #0f172a' : '1px solid #cbd5e1',
              background: step === n ? '#0f172a' : '#fff',
              color: step === n ? '#fff' : '#0f172a',
              borderRadius: 8,
              cursor: n === 5 && !draft ? 'not-allowed' : 'pointer',
              fontSize: 13,
              opacity: n === 5 && !draft ? 0.5 : 1,
            }}
          >
            {label}
          </button>
        ))}
      </aside>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {step === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>어떤 업종인가요?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {INDUSTRIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setIndustry(value)}
                  style={{
                    padding: '8px 10px',
                    border: industry === value ? '2px solid #0f172a' : '1px solid #cbd5e1',
                    background: industry === value ? '#0f172a' : '#fff',
                    color: industry === value ? '#fff' : '#0f172a',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setStep(2)} style={{ alignSelf: 'flex-end', padding: '8px 16px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>다음</button>
          </div>
        ) : null}

        {step === 2 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>회사명 + 슬로건</h2>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="회사명" style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }} />
            <input type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)} placeholder="슬로건 (옵션)" style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => setStep(1)} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, cursor: 'pointer' }}>이전</button>
              <button type="button" disabled={!companyName.trim()} onClick={() => setStep(3)} style={{ padding: '8px 16px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>다음</button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>톤</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TONES.map((value) => (
                <button key={value} type="button" onClick={() => setTone(value)} style={{ padding: '8px 14px', border: tone === value ? '2px solid #0f172a' : '1px solid #cbd5e1', background: tone === value ? '#0f172a' : '#fff', color: tone === value ? '#fff' : '#0f172a', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>{value}</button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => setStep(2)} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, cursor: 'pointer' }}>이전</button>
              <button type="button" onClick={() => setStep(4)} style={{ padding: '8px 16px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>다음</button>
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>컬러 선호</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLOR_PREFERENCES.map((value) => (
                <button key={value} type="button" onClick={() => setColorPreference(value)} style={{ padding: '8px 14px', border: colorPreference === value ? '2px solid #0f172a' : '1px solid #cbd5e1', background: colorPreference === value ? '#0f172a' : '#fff', color: colorPreference === value ? '#fff' : '#0f172a', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>{value}</button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => setStep(3)} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, cursor: 'pointer' }}>이전</button>
              <button type="button" disabled={busy} onClick={generate} style={{ padding: '8px 16px', border: 0, background: busy ? '#94a3b8' : '#16a34a', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer' }}>
                {busy ? 'AI 생성 중...' : '생성하기'}
              </button>
            </div>
            {error ? <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div> : null}
          </div>
        ) : null}

        {step === 5 && draft ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>미리보기</h2>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, alignItems: 'center' }}>
              <span>팔레트:</span>
              {(['primary', 'secondary', 'accent', 'background'] as const).map((k) => (
                <span key={k} title={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 6px', border: '1px solid #cbd5e1', borderRadius: 4 }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: draft.palette[k], border: '1px solid #cbd5e1', borderRadius: 2 }} />
                  {draft.palette[k]}
                </span>
              ))}
            </div>
            <div style={{ padding: 24, background: draft.palette.background, borderRadius: 12 }}>
              <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h1 style={{ fontSize: 28, margin: 0, color: draft.palette.primary }}>{draft.content.hero.headline}</h1>
                <p style={{ margin: 0, color: '#334155', fontSize: 15 }}>{draft.content.hero.body}</p>
                {draft.content.hero.ctaLabel ? (
                  <button type="button" style={{ alignSelf: 'flex-start', padding: '8px 16px', border: 0, background: draft.palette.accent, color: '#fff', borderRadius: 8, fontWeight: 700 }}>
                    {draft.content.hero.ctaLabel}
                  </button>
                ) : null}
                {draft.content.sections.map((section) => (
                  <div key={section.sectionId} style={{ padding: 16, background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 18, color: draft.palette.secondary }}>{section.headline}</h3>
                    <p style={{ margin: 0, fontSize: 14, color: '#334155' }}>{section.body}</p>
                    {section.bullets && section.bullets.length > 0 ? (
                      <ul style={{ margin: '8px 0 0', paddingLeft: 20, fontSize: 13, color: '#475569' }}>
                        {section.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    ) : null}
                    {section.ctaLabel ? (
                      <button type="button" style={{ marginTop: 8, padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 12 }}>{section.ctaLabel}</button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              meta description: {draft.content.metaDescription}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => setStep(4)} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, cursor: 'pointer' }}>다시 생성</button>
              <button
                type="button"
                disabled={applying}
                onClick={apply}
                style={{
                  padding: '8px 16px',
                  border: 0,
                  background: applying ? '#94a3b8' : '#16a34a',
                  color: '#fff',
                  borderRadius: 8,
                  cursor: applying ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                }}
              >
                {applying ? '적용 중...' : '사이트에 적용'}
              </button>
            </div>
            {appliedPageId ? (
              <div style={{ fontSize: 12, color: '#15803d' }}>
                새 페이지 생성됨 — pageId: <code>{appliedPageId}</code>
              </div>
            ) : null}
            {error ? <div style={{ fontSize: 12, color: '#dc2626' }}>{error}</div> : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
