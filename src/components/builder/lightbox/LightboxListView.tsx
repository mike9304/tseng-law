'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BuilderLightbox } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function LightboxListView({
  locale,
  initialLightboxes,
}: {
  locale: Locale;
  initialLightboxes: BuilderLightbox[];
}) {
  const copy = getLightboxListCopy(locale);
  const [lightboxes, setLightboxes] = useState<BuilderLightbox[]>(initialLightboxes);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedSlug = slug.trim();
    const trimmedName = name.trim() || copy.untitledLabel;
    if (!trimmedSlug || !SLUG_RE.test(trimmedSlug)) {
      setError(copy.slugErrorLabel);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/site/lightboxes?locale=${locale}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: trimmedSlug, name: trimmedName, locale }),
      });
      const data = (await res.json()) as { ok?: boolean; lightbox?: BuilderLightbox; error?: string };
      if (!res.ok || !data.ok || !data.lightbox) {
        setError(data.error ?? copy.createFailedLabel);
        return;
      }
      setLightboxes((prev) => [...prev, data.lightbox!]);
      setName('');
      setSlug('');
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.unknownErrorLabel);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(copy.deleteConfirmLabel)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/site/lightboxes/${id}?locale=${locale}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        setLightboxes((prev) => prev.filter((lb) => lb.id !== id));
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? copy.deleteFailedLabel);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleRename(id: string, currentName: string) {
    const next = window.prompt(copy.renamePromptLabel, currentName);
    if (!next || next.trim() === currentName) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/site/lightboxes/${id}?locale=${locale}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: next.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; lightbox?: BuilderLightbox; error?: string };
      if (data.ok && data.lightbox) {
        setLightboxes((prev) => prev.map((lb) => (lb.id === id ? data.lightbox! : lb)));
      } else {
        setError(data.error ?? copy.renameFailedLabel);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 880, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{copy.title}</h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
        {copy.description}
      </p>

      <form
        onSubmit={handleCreate}
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          padding: 16,
          background: '#f8fafc',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder={copy.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          style={{
            flex: '1 1 200px',
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
          }}
        />
        <input
          type="text"
          placeholder={copy.slugPlaceholder}
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
          disabled={busy}
          style={{
            flex: '1 1 200px',
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
          }}
        />
        <button
          type="submit"
          disabled={busy}
          style={{
            padding: '8px 16px',
            background: '#0b3b2e',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: busy ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {copy.newButtonLabel}
        </button>
      </form>

      {error && (
        <div
          style={{
            padding: 12,
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {lightboxes.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
          {copy.emptyLabel}
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {lightboxes.map((lb) => (
            <li
              key={lb.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{lb.name}</div>
                <div style={{ color: '#64748b', fontSize: 13, fontFamily: 'monospace' }}>
                  lightbox:{lb.slug}
                </div>
              </div>
              <Link
                href={`/${locale}/admin-builder/lightboxes/${lb.id}/edit`}
                style={{
                  padding: '6px 12px',
                  background: '#0b3b2e',
                  color: '#fff',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {copy.editLabel}
              </Link>
              <button
                type="button"
                onClick={() => handleRename(lb.id, lb.name)}
                disabled={busy}
                style={{
                  padding: '6px 12px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                {copy.renameLabel}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(lb.id)}
                disabled={busy}
                style={{
                  padding: '6px 12px',
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                {copy.deleteLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function getLightboxListCopy(locale: Locale) {
  return {
    title: locale === 'ko' ? '라이트박스 관리자' : locale === 'zh-hant' ? '燈箱管理員' : 'Lightbox Admin',
    description:
      locale === 'ko'
        ? '버튼 클릭으로 열리는 라이트박스를 관리합니다. href: lightbox:<slug>로 트리거하세요.'
        : locale === 'zh-hant'
          ? '管理按鈕開啟的燈箱。使用 href: lightbox:<slug> 來觸發。'
          : 'Manage lightboxes opened from buttons. Trigger with href: lightbox:<slug>.',
    untitledLabel: locale === 'ko' ? '이름 없는 라이트박스' : locale === 'zh-hant' ? '未命名燈箱' : 'Untitled lightbox',
    namePlaceholder: locale === 'ko' ? '이름' : locale === 'zh-hant' ? '名稱' : 'Name',
    slugPlaceholder: locale === 'ko' ? 'Slug (예: contact-form)' : locale === 'zh-hant' ? 'Slug（例如：contact-form）' : 'Slug (e.g. contact-form)',
    slugErrorLabel:
      locale === 'ko'
        ? 'Slug는 소문자 영숫자와 하이픈만 사용할 수 있습니다.'
        : locale === 'zh-hant'
          ? 'Slug 必須是小寫英數與連字號。'
          : 'Slug must be lowercase alphanumeric with hyphens',
    createFailedLabel: locale === 'ko' ? '라이트박스 생성 실패' : locale === 'zh-hant' ? '燈箱建立失敗' : 'Failed to create lightbox',
    unknownErrorLabel: locale === 'ko' ? '알 수 없는 오류' : locale === 'zh-hant' ? '未知錯誤' : 'Unknown error',
    deleteConfirmLabel: locale === 'ko' ? '이 라이트박스를 삭제할까요?' : locale === 'zh-hant' ? '要刪除此燈箱嗎？' : 'Delete this lightbox?',
    deleteFailedLabel: locale === 'ko' ? '라이트박스 삭제 실패' : locale === 'zh-hant' ? '燈箱刪除失敗' : 'Failed to delete lightbox',
    renamePromptLabel: locale === 'ko' ? '새 이름' : locale === 'zh-hant' ? '新名稱' : 'New name',
    renameFailedLabel: locale === 'ko' ? '라이트박스 이름 변경 실패' : locale === 'zh-hant' ? '燈箱重新命名失敗' : 'Failed to rename lightbox',
    newButtonLabel: locale === 'ko' ? '+ 새 라이트박스' : locale === 'zh-hant' ? '+ 新增燈箱' : '+ New lightbox',
    emptyLabel: locale === 'ko' ? '라이트박스가 없습니다. 위에서 새로 만드세요.' : locale === 'zh-hant' ? '尚無燈箱。請在上方建立。' : 'No lightboxes yet. Create one above.',
    editLabel: locale === 'ko' ? '편집' : locale === 'zh-hant' ? '編輯' : 'Edit',
    renameLabel: locale === 'ko' ? '이름 변경' : locale === 'zh-hant' ? '重新命名' : 'Rename',
    deleteLabel: locale === 'ko' ? '삭제' : locale === 'zh-hant' ? '刪除' : 'Delete',
  } as const;
}
