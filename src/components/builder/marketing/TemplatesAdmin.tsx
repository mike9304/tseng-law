'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { EmailTemplate } from '@/lib/builder/marketing/templates/types';
import type { Locale } from '@/lib/locales';

interface Props {
  initialTemplates: EmailTemplate[];
  locale: Locale;
}

const copy = {
  ko: {
    namePlaceholder: '새 템플릿 이름',
    categoryPlaceholder: '카테고리 (옵션)',
    create: '템플릿 생성',
    failed: '실패',
    name: '이름',
    category: '카테고리',
    blocks: '블록',
    updatedAt: '업데이트',
    actions: '액션',
    empty: '템플릿이 없습니다.',
    edit: '편집',
    dateLocale: 'ko-KR',
  },
  'zh-hant': {
    namePlaceholder: '新範本名稱',
    categoryPlaceholder: '分類（選填）',
    create: '建立範本',
    failed: '失敗',
    name: '名稱',
    category: '分類',
    blocks: '區塊',
    updatedAt: '更新時間',
    actions: '操作',
    empty: '沒有範本。',
    edit: '編輯',
    dateLocale: 'zh-TW',
  },
  en: {
    namePlaceholder: 'New template name',
    categoryPlaceholder: 'Category (optional)',
    create: 'Create template',
    failed: 'Failed',
    name: 'Name',
    category: 'Category',
    blocks: 'Blocks',
    updatedAt: 'Updated',
    actions: 'Actions',
    empty: 'No templates.',
    edit: 'Edit',
    dateLocale: 'en-US',
  },
} as const;

function localizedMarketingApiPath(locale: Locale, path: string): string {
  if (locale === 'ko') return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}locale=${locale}`;
}

export default function TemplatesAdmin({ initialTemplates, locale }: Props) {
  const text = copy[locale];
  const [templates, setTemplates] = useState(initialTemplates);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    const res = await fetch(localizedMarketingApiPath(locale, '/api/builder/marketing/templates'), { credentials: 'same-origin' });
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
      const res = await fetch(localizedMarketingApiPath(locale, '/api/builder/marketing/templates'), {
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
        setError(payload.error || text.failed);
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
        <input type="text" placeholder={text.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }} />
        <input type="text" placeholder={text.categoryPlaceholder} value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 200, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }} />
        <button type="button" disabled={busy || !name.trim()} onClick={create} style={{ padding: '8px 16px', border: 0, background: busy ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: busy ? 'not-allowed' : 'pointer' }}>
          {text.create}
        </button>
      </div>
      {error ? <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>{text.name}</th>
            <th style={{ padding: '8px 12px' }}>{text.category}</th>
            <th style={{ padding: '8px 12px' }}>{text.blocks}</th>
            <th style={{ padding: '8px 12px' }}>{text.updatedAt}</th>
            <th style={{ padding: '8px 12px' }}>{text.actions}</th>
          </tr>
        </thead>
        <tbody>
          {templates.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                {text.empty}
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
                <td style={{ padding: '8px 12px', color: '#64748b' }}>{new Date(t.updatedAt).toLocaleString(text.dateLocale)}</td>
                <td style={{ padding: '8px 12px' }}>
                  <Link
                    href={`/${locale}/admin-builder/marketing/templates/${t.templateId}/edit`}
                    style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, color: '#0f172a', textDecoration: 'none' }}
                  >
                    {text.edit}
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
