'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { EmailTemplate } from '@/lib/builder/marketing/templates/types';
import type { Locale } from '@/lib/locales';

interface Props {
  initialTemplates: EmailTemplate[];
  locale: Locale;
}

export default function TemplatesAdmin({ initialTemplates, locale }: Props) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    const res = await fetch('/api/builder/marketing/templates', { credentials: 'same-origin' });
    if (res.ok) {
      const payload = (await res.json()) as { templates: EmailTemplate[] };
      setTemplates(payload.templates);
    }
  }

  async function create() {
    if (!name.trim()) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/builder/marketing/templates', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim() || undefined,
          blocks: [],
          pageBackground: '#f1f5f9',
          contentBackground: '#ffffff',
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || res.statusText);
        return;
      }
      setName('');
      setCategory('');
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="text" placeholder="새 템플릿 이름" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }} />
        <input type="text" placeholder="카테고리 (옵션)" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 200, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }} />
        <button type="button" disabled={busy || !name.trim()} onClick={create} style={{ padding: '8px 16px', border: 0, background: busy ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: busy ? 'not-allowed' : 'pointer' }}>
          템플릿 생성
        </button>
      </div>
      {error ? <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>이름</th>
            <th style={{ padding: '8px 12px' }}>카테고리</th>
            <th style={{ padding: '8px 12px' }}>블록</th>
            <th style={{ padding: '8px 12px' }}>업데이트</th>
            <th style={{ padding: '8px 12px' }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {templates.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                템플릿이 없습니다.
              </td>
            </tr>
          ) : (
            templates.map((t) => (
              <tr key={t.templateId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px' }}>
                  <strong>{t.name}</strong>
                  {t.description ? <div style={{ fontSize: 11, color: '#94a3b8' }}>{t.description}</div> : null}
                </td>
                <td style={{ padding: '8px 12px', color: '#475569' }}>{t.category || '—'}</td>
                <td style={{ padding: '8px 12px' }}>{t.blocks.length}</td>
                <td style={{ padding: '8px 12px', color: '#64748b' }}>{new Date(t.updatedAt).toLocaleString('ko-KR')}</td>
                <td style={{ padding: '8px 12px' }}>
                  <Link
                    href={`/${locale}/admin-builder/marketing/templates/${t.templateId}/edit`}
                    style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, color: '#0f172a', textDecoration: 'none' }}
                  >
                    편집
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
