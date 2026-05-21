'use client';

import { FormEvent, useMemo, useState } from 'react';
import type {
  BuilderFaqCategory,
  BuilderFaqItem,
  FaqStatus,
} from '@/lib/builder/faq/faq-shared';
import type { Locale } from '@/lib/locales';
import styles from './FaqAdmin.module.css';

interface FaqAdminClientProps {
  locale: Locale;
  initialItems: BuilderFaqItem[];
  categories: BuilderFaqCategory[];
}

function statusLabel(status: FaqStatus): string {
  return status === 'published' ? '공개' : '초안';
}

function categoryLabel(categories: BuilderFaqCategory[], categoryId: string, locale: Locale): string {
  return categories.find((category) => category.categoryId === categoryId)?.label[locale] ?? categoryId;
}

function parseTags(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export default function FaqAdminClient({ locale, initialItems, categories }: FaqAdminClientProps) {
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState<FaqStatus | 'all'>('all');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (category !== 'all' && item.categoryId !== category) return false;
      if (!normalizedQuery) return true;
      return [
        item.question,
        item.answer,
        categoryLabel(categories, item.categoryId, locale),
        ...item.tags,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [categories, category, items, locale, query, status]);

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = {
      locale,
      question: String(form.get('question') ?? ''),
      answer: String(form.get('answer') ?? ''),
      categoryId: String(form.get('categoryId') ?? 'company-setup'),
      tags: parseTags(form.get('tags')),
      status: String(form.get('status') ?? 'published'),
      sortOrder: Number(form.get('sortOrder') ?? 1000),
      schemaEnabled: form.get('schemaEnabled') === 'on',
    };

    try {
      const response = await fetch('/api/builder/faq', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || 'FAQ 저장 실패');
      setItems((current) => [json.item as BuilderFaqItem, ...current.filter((item) => item.faqId !== json.item.faqId)]);
      setMessage('FAQ 항목이 생성되었습니다.');
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'FAQ 저장 실패');
    } finally {
      setPending(false);
    }
  }

  async function patchItem(faqId: string, patch: Partial<BuilderFaqItem>) {
    setMessage('');
    try {
      const response = await fetch(`/api/builder/faq/${encodeURIComponent(faqId)}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || 'FAQ 수정 실패');
      setItems((current) => current.map((item) => item.faqId === faqId ? json.item as BuilderFaqItem : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'FAQ 수정 실패');
    }
  }

  async function deleteItem(faqId: string) {
    setMessage('');
    try {
      const response = await fetch(`/api/builder/faq/${encodeURIComponent(faqId)}`, { method: 'DELETE' });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || 'FAQ 삭제 실패');
      setItems((current) => current.filter((item) => item.faqId !== faqId));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'FAQ 삭제 실패');
    }
  }

  const publishedCount = items.filter((item) => item.status === 'published').length;
  const draftCount = items.filter((item) => item.status === 'draft').length;
  const schemaCount = items.filter((item) => item.schemaEnabled && item.status === 'published').length;

  return (
    <main className={styles.root} data-builder-faq-admin="true">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Native FAQ</p>
          <h1>FAQ 관리</h1>
          <p>카테고리, 공개 상태, 검색 색인, FAQPage schema에 쓰일 질문을 한 곳에서 관리합니다.</p>
        </div>
        <a className={styles.publicLink} href={`/${locale}/faq`} target="_blank" rel="noreferrer">
          공개 FAQ 보기
        </a>
      </header>

      <section className={styles.stats} aria-label="FAQ 요약">
        <div><strong>{items.length}</strong><span>전체</span></div>
        <div><strong>{publishedCount}</strong><span>공개</span></div>
        <div><strong>{draftCount}</strong><span>초안</span></div>
        <div><strong>{schemaCount}</strong><span>Schema</span></div>
      </section>

      <section className={styles.layout}>
        <form className={styles.form} onSubmit={createItem} data-builder-faq-create-form="true">
          <h2>새 질문</h2>
          <label>
            질문
            <input name="question" required placeholder="대만 법인설립은 어떤 절차로 진행되나요?" />
          </label>
          <label>
            답변
            <textarea name="answer" rows={5} required placeholder="답변을 입력하세요." />
          </label>
          <div className={styles.twoCols}>
            <label>
              카테고리
              <select name="categoryId" defaultValue={categories[0]?.categoryId ?? 'company-setup'}>
                {categories.map((item) => (
                  <option key={item.categoryId} value={item.categoryId}>{item.label[locale]}</option>
                ))}
              </select>
            </label>
            <label>
              상태
              <select name="status" defaultValue="published">
                <option value="published">공개</option>
                <option value="draft">초안</option>
              </select>
            </label>
          </div>
          <div className={styles.twoCols}>
            <label>
              정렬
              <input name="sortOrder" type="number" min={0} defaultValue={1000} />
            </label>
            <label>
              태그
              <input name="tags" placeholder="회사설립, 투자" />
            </label>
          </div>
          <label className={styles.checkbox}>
            <input name="schemaEnabled" type="checkbox" defaultChecked />
            FAQPage schema에 포함
          </label>
          <button type="submit" disabled={pending}>{pending ? '저장 중...' : 'FAQ 생성'}</button>
          {message ? <p className={styles.message} role="status">{message}</p> : null}
        </form>

        <section className={styles.list} aria-label="FAQ 목록">
          <div className={styles.listHeader}>
            <h2>질문</h2>
            <div className={styles.filters}>
              <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="검색" aria-label="FAQ 검색" />
              <select value={category} onChange={(event) => setCategory(event.currentTarget.value)} aria-label="카테고리 필터">
                <option value="all">전체 카테고리</option>
                {categories.map((item) => (
                  <option key={item.categoryId} value={item.categoryId}>{item.label[locale]}</option>
                ))}
              </select>
              <select value={status} onChange={(event) => setStatus(event.currentTarget.value as FaqStatus | 'all')} aria-label="상태 필터">
                <option value="all">전체 상태</option>
                <option value="published">공개</option>
                <option value="draft">초안</option>
              </select>
            </div>
          </div>
          {filteredItems.length === 0 ? (
            <div className={styles.empty}>FAQ 항목이 없습니다.</div>
          ) : (
            <div className={styles.cards}>
              {filteredItems.map((item) => (
                <article key={item.faqId} className={styles.card} data-builder-faq-admin-card={item.faqId}>
                  <div className={styles.cardBody}>
                    <div className={styles.badges}>
                      <span className={styles.badge}>{statusLabel(item.status)}</span>
                      <span className={styles.badgeMuted}>{categoryLabel(categories, item.categoryId, locale)}</span>
                    </div>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                    <small>{item.schemaEnabled ? 'Schema 포함' : 'Schema 제외'} · sort {item.sortOrder}</small>
                  </div>
                  <div className={styles.actions}>
                    <button type="button" onClick={() => patchItem(item.faqId, { status: item.status === 'published' ? 'draft' : 'published' })}>
                      {item.status === 'published' ? '초안으로' : '공개'}
                    </button>
                    <button type="button" onClick={() => patchItem(item.faqId, { schemaEnabled: !item.schemaEnabled })}>
                      {item.schemaEnabled ? 'Schema 끄기' : 'Schema 켜기'}
                    </button>
                    <button type="button" className={styles.danger} onClick={() => deleteItem(item.faqId)}>
                      삭제
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
