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
  const copy = getFaqAdminCopy(locale);
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
      const response = await fetch(`/api/builder/faq?locale=${locale}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || copy.saveFailedLabel);
      setItems((current) => [json.item as BuilderFaqItem, ...current.filter((item) => item.faqId !== json.item.faqId)]);
      setMessage(copy.createdLabel);
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.saveFailedLabel);
    } finally {
      setPending(false);
    }
  }

  async function patchItem(faqId: string, patch: Partial<BuilderFaqItem>) {
    setMessage('');
    try {
      const response = await fetch(`/api/builder/faq/${encodeURIComponent(faqId)}?locale=${locale}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...patch, locale }),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || copy.updateFailedLabel);
      setItems((current) => current.map((item) => item.faqId === faqId ? json.item as BuilderFaqItem : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.updateFailedLabel);
    }
  }

  async function deleteItem(faqId: string) {
    setMessage('');
    try {
      const response = await fetch(`/api/builder/faq/${encodeURIComponent(faqId)}?locale=${locale}`, { method: 'DELETE' });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || copy.deleteFailedLabel);
      setItems((current) => current.filter((item) => item.faqId !== faqId));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.deleteFailedLabel);
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
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
        <a className={styles.publicLink} href={`/${locale}/faq`} target="_blank" rel="noreferrer">
          {copy.publicLinkLabel}
        </a>
      </header>

      <section className={styles.stats} aria-label={copy.statsLabel}>
        <div><strong>{items.length}</strong><span>{copy.allLabel}</span></div>
        <div><strong>{publishedCount}</strong><span>{copy.publishedLabel}</span></div>
        <div><strong>{draftCount}</strong><span>{copy.draftLabel}</span></div>
        <div><strong>{schemaCount}</strong><span>{copy.schemaLabel}</span></div>
      </section>

      <section className={styles.layout}>
        <form className={styles.form} onSubmit={createItem} data-builder-faq-create-form="true">
          <h2>{copy.createTitle}</h2>
          <label>
            {copy.questionLabel}
            <input name="question" required placeholder={copy.questionPlaceholder} />
          </label>
          <label>
            {copy.answerLabel}
            <textarea name="answer" rows={5} required placeholder={copy.answerPlaceholder} />
          </label>
          <div className={styles.twoCols}>
            <label>
              {copy.categoryLabel}
              <select name="categoryId" defaultValue={categories[0]?.categoryId ?? 'company-setup'}>
                {categories.map((item) => (
                  <option key={item.categoryId} value={item.categoryId}>{item.label[locale]}</option>
                ))}
              </select>
            </label>
            <label>
              {copy.statusLabel}
              <select name="status" defaultValue="published">
                <option value="published">{copy.publishedLabel}</option>
                <option value="draft">{copy.draftLabel}</option>
              </select>
            </label>
          </div>
          <div className={styles.twoCols}>
            <label>
              {copy.sortLabel}
              <input name="sortOrder" type="number" min={0} defaultValue={1000} />
            </label>
            <label>
              {copy.tagsLabel}
              <input name="tags" placeholder={copy.tagsPlaceholder} />
            </label>
          </div>
          <label className={styles.checkbox}>
            <input name="schemaEnabled" type="checkbox" defaultChecked />
            {copy.schemaIncludedLabel}
          </label>
          <button type="submit" disabled={pending}>{pending ? copy.savingLabel : copy.createButtonLabel}</button>
          {message ? <p className={styles.message} role="status">{message}</p> : null}
        </form>

        <section className={styles.list} aria-label={copy.listLabel}>
          <div className={styles.listHeader}>
            <h2>{copy.questionsTitle}</h2>
            <div className={styles.filters}>
              <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder={copy.searchPlaceholder} aria-label={copy.searchLabel} />
              <select value={category} onChange={(event) => setCategory(event.currentTarget.value)} aria-label={copy.categoryFilterLabel}>
                <option value="all">{copy.allCategoriesLabel}</option>
                {categories.map((item) => (
                  <option key={item.categoryId} value={item.categoryId}>{item.label[locale]}</option>
                ))}
              </select>
              <select value={status} onChange={(event) => setStatus(event.currentTarget.value as FaqStatus | 'all')} aria-label={copy.statusFilterLabel}>
                <option value="all">{copy.allStatusLabel}</option>
                <option value="published">{copy.publishedLabel}</option>
                <option value="draft">{copy.draftLabel}</option>
              </select>
            </div>
          </div>
          {filteredItems.length === 0 ? (
            <div className={styles.empty}>{copy.emptyLabel}</div>
          ) : (
            <div className={styles.cards}>
              {filteredItems.map((item) => (
                <article key={item.faqId} className={styles.card} data-builder-faq-admin-card={item.faqId}>
                  <div className={styles.cardBody}>
                    <div className={styles.badges}>
                      <span className={styles.badge}>{item.status === 'published' ? copy.publishedLabel : copy.draftLabel}</span>
                      <span className={styles.badgeMuted}>{categoryLabel(categories, item.categoryId, locale)}</span>
                    </div>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                    <small>{item.schemaEnabled ? copy.schemaIncludedSmallLabel : copy.schemaExcludedSmallLabel} · {copy.sortPrefixLabel} {item.sortOrder}</small>
                  </div>
                  <div className={styles.actions}>
                    <button type="button" onClick={() => patchItem(item.faqId, { status: item.status === 'published' ? 'draft' : 'published' })}>
                      {item.status === 'published' ? copy.moveToDraftLabel : copy.moveToPublishedLabel}
                    </button>
                    <button type="button" onClick={() => patchItem(item.faqId, { schemaEnabled: !item.schemaEnabled })}>
                      {item.schemaEnabled ? copy.disableSchemaLabel : copy.enableSchemaLabel}
                    </button>
                    <button type="button" className={styles.danger} onClick={() => deleteItem(item.faqId)}>
                      {copy.deleteLabel}
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

function getFaqAdminCopy(locale: Locale) {
  return {
    title: locale === 'ko' ? 'FAQ 관리자' : locale === 'zh-hant' ? 'FAQ 管理員' : 'FAQ Admin',
    description:
      locale === 'ko'
        ? 'FAQ 질문, 카테고리, 공개 상태와 schema 설정을 한 곳에서 관리합니다.'
        : locale === 'zh-hant'
          ? '在同一處管理 FAQ 問題、分類、公開狀態與 schema 設定。'
          : 'Manage FAQ questions, categories, publication state, and schema settings in one place.',
    publicLinkLabel: locale === 'ko' ? '공개 FAQ 보기' : locale === 'zh-hant' ? '查看公開 FAQ' : 'View public FAQ',
    statsLabel: locale === 'ko' ? 'FAQ 요약' : locale === 'zh-hant' ? 'FAQ 摘要' : 'FAQ summary',
    allLabel: locale === 'ko' ? '전체' : locale === 'zh-hant' ? '全部' : 'All',
    publishedLabel: locale === 'ko' ? '공개' : locale === 'zh-hant' ? '公開' : 'Published',
    draftLabel: locale === 'ko' ? '초안' : locale === 'zh-hant' ? '草稿' : 'Draft',
    schemaLabel: locale === 'ko' ? 'Schema' : locale === 'zh-hant' ? 'Schema' : 'Schema',
    createTitle: locale === 'ko' ? '새 질문' : locale === 'zh-hant' ? '新增問題' : 'New question',
    questionLabel: locale === 'ko' ? '질문' : locale === 'zh-hant' ? '問題' : 'Question',
    answerLabel: locale === 'ko' ? '답변' : locale === 'zh-hant' ? '答案' : 'Answer',
    categoryLabel: locale === 'ko' ? '카테고리' : locale === 'zh-hant' ? '分類' : 'Category',
    statusLabel: locale === 'ko' ? '상태' : locale === 'zh-hant' ? '狀態' : 'Status',
    sortLabel: locale === 'ko' ? '정렬' : locale === 'zh-hant' ? '排序' : 'Sort order',
    tagsLabel: locale === 'ko' ? '태그' : locale === 'zh-hant' ? '標籤' : 'Tags',
    schemaIncludedLabel: locale === 'ko' ? 'FAQPage schema에 포함' : locale === 'zh-hant' ? '包含在 FAQPage schema 中' : 'Include in FAQPage schema',
    savingLabel: locale === 'ko' ? '저장 중...' : locale === 'zh-hant' ? '儲存中...' : 'Saving...',
    createButtonLabel: locale === 'ko' ? 'FAQ 생성' : locale === 'zh-hant' ? '建立 FAQ' : 'Create FAQ',
    listLabel: locale === 'ko' ? 'FAQ 목록' : locale === 'zh-hant' ? 'FAQ 清單' : 'FAQ list',
    questionsTitle: locale === 'ko' ? '질문' : locale === 'zh-hant' ? '問題' : 'Questions',
    searchPlaceholder: locale === 'ko' ? '검색' : locale === 'zh-hant' ? '搜尋' : 'Search',
    searchLabel: locale === 'ko' ? 'FAQ 검색' : locale === 'zh-hant' ? '搜尋 FAQ' : 'Search FAQ',
    categoryFilterLabel: locale === 'ko' ? '카테고리 필터' : locale === 'zh-hant' ? '分類篩選' : 'Category filter',
    statusFilterLabel: locale === 'ko' ? '상태 필터' : locale === 'zh-hant' ? '狀態篩選' : 'Status filter',
    allCategoriesLabel: locale === 'ko' ? '전체 카테고리' : locale === 'zh-hant' ? '所有分類' : 'All categories',
    allStatusLabel: locale === 'ko' ? '전체 상태' : locale === 'zh-hant' ? '所有狀態' : 'All statuses',
    emptyLabel: locale === 'ko' ? 'FAQ 항목이 없습니다.' : locale === 'zh-hant' ? '沒有 FAQ 項目。' : 'No FAQ items.',
    schemaIncludedSmallLabel: locale === 'ko' ? 'Schema 포함' : locale === 'zh-hant' ? '包含 Schema' : 'Schema included',
    schemaExcludedSmallLabel: locale === 'ko' ? 'Schema 제외' : locale === 'zh-hant' ? '不含 Schema' : 'Schema excluded',
    sortPrefixLabel: locale === 'ko' ? '정렬' : locale === 'zh-hant' ? '排序' : 'sort',
    moveToDraftLabel: locale === 'ko' ? '초안으로' : locale === 'zh-hant' ? '轉為草稿' : 'Move to draft',
    moveToPublishedLabel: locale === 'ko' ? '공개' : locale === 'zh-hant' ? '公開' : 'Publish',
    disableSchemaLabel: locale === 'ko' ? 'Schema 끄기' : locale === 'zh-hant' ? '停用 Schema' : 'Disable schema',
    enableSchemaLabel: locale === 'ko' ? 'Schema 켜기' : locale === 'zh-hant' ? '啟用 Schema' : 'Enable schema',
    deleteLabel: locale === 'ko' ? '삭제' : locale === 'zh-hant' ? '刪除' : 'Delete',
    questionPlaceholder:
      locale === 'ko'
        ? '대만 법인설립은 어떤 절차로 진행되나요?'
        : locale === 'zh-hant'
          ? '在台灣成立公司需要哪些步驟？'
          : 'What is the process for forming a company in Taiwan?',
    answerPlaceholder: locale === 'ko' ? '답변을 입력하세요.' : locale === 'zh-hant' ? '請輸入答案。' : 'Enter an answer.',
    tagsPlaceholder: locale === 'ko' ? '회사설립, 투자' : locale === 'zh-hant' ? '公司設立, 投資' : 'company setup, investment',
    saveFailedLabel: locale === 'ko' ? 'FAQ 저장 실패' : locale === 'zh-hant' ? 'FAQ 儲存失敗' : 'FAQ save failed',
    updateFailedLabel: locale === 'ko' ? 'FAQ 수정 실패' : locale === 'zh-hant' ? 'FAQ 更新失敗' : 'FAQ update failed',
    deleteFailedLabel: locale === 'ko' ? 'FAQ 삭제 실패' : locale === 'zh-hant' ? 'FAQ 刪除失敗' : 'FAQ delete failed',
    createdLabel: locale === 'ko' ? 'FAQ 항목이 생성되었습니다.' : locale === 'zh-hant' ? 'FAQ 項目已建立。' : 'FAQ item created.',
  } as const;
}
