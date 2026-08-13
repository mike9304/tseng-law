'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { PortfolioProject } from '@/lib/builder/portfolio/portfolio-shared';
import styles from './PortfolioAdmin.module.css';

type Category = { id: string; name: Record<Locale, string> };

const copy: Record<Locale, {
  title: string;
  description: string;
  statsLabel: string;
  editTitle: string;
  newTitle: string;
  newButton: string;
  titleLabel: string;
  slugLabel: string;
  slugPlaceholder: string;
  summaryLabel: string;
  descriptionLabel: string;
  bodyLabel: string;
  categoryLabel: string;
  completedAtLabel: string;
  statusLabel: string;
  orderLabel: string;
  clientLabel: string;
  tagsLabel: string;
  coverLabel: string;
  galleryLabel: string;
  galleryPlaceholder: string;
  featuredLabel: string;
  saveButton: string;
  statusOptions: { all: string; published: string; draft: string; archived: string };
  categoryOptions: { all: string };
  countLabels: { total: string; published: string; draft: string; featured: string };
  notices: { saving: string; saved: string; saveFailed: string; deleting: string; deleteFailed: string; deleted: string };
  empty: string;
  editButton: string;
  deleteButton: string;
}> = {
  ko: {
    title: '포트폴리오',
    description: '사례/프로젝트, 카테고리, 갤러리를 관리합니다.',
    statsLabel: '포트폴리오 요약',
    editTitle: '프로젝트 편집',
    newTitle: '새 프로젝트',
    newButton: '새로 작성',
    titleLabel: '제목',
    slugLabel: '슬러그',
    slugPlaceholder: '자동 생성 가능',
    summaryLabel: '요약',
    descriptionLabel: '설명',
    bodyLabel: '본문',
    categoryLabel: '카테고리',
    completedAtLabel: '완료일',
    statusLabel: '상태',
    orderLabel: '정렬',
    clientLabel: '클라이언트',
    tagsLabel: '태그',
    coverLabel: '대표 이미지 URL',
    galleryLabel: '갤러리 이미지',
    galleryPlaceholder: 'url|alt|caption 한 줄에 하나',
    featuredLabel: '추천 프로젝트',
    saveButton: '프로젝트 만들기',
    statusOptions: { all: '모든 상태', published: '공개', draft: '초안', archived: '보관' },
    categoryOptions: { all: '모든 카테고리' },
    countLabels: { total: '전체', published: '공개', draft: '초안', featured: '추천' },
    notices: { saving: '저장 중...', saved: '저장되었습니다.', saveFailed: '저장 실패', deleting: '삭제 중...', deleteFailed: '삭제 실패', deleted: '삭제되었습니다.' },
    empty: '표시할 프로젝트가 없습니다.',
    editButton: '편집',
    deleteButton: '삭제',
  },
  'zh-hant': {
    title: '作品集',
    description: '管理案例/專案、分類與圖庫。',
    statsLabel: '作品集摘要',
    editTitle: '編輯專案',
    newTitle: '新增專案',
    newButton: '建立新項目',
    titleLabel: '標題',
    slugLabel: '網址代稱',
    slugPlaceholder: '可自動產生',
    summaryLabel: '摘要',
    descriptionLabel: '說明',
    bodyLabel: '內文',
    categoryLabel: '類別',
    completedAtLabel: '完工日',
    statusLabel: '狀態',
    orderLabel: '排序',
    clientLabel: '客戶',
    tagsLabel: '標籤',
    coverLabel: '主圖 URL',
    galleryLabel: '圖庫圖片',
    galleryPlaceholder: '每行一筆：url|alt|caption',
    featuredLabel: '精選專案',
    saveButton: '建立專案',
    statusOptions: { all: '所有狀態', published: '公開', draft: '草稿', archived: '封存' },
    categoryOptions: { all: '所有類別' },
    countLabels: { total: '總數', published: '公開', draft: '草稿', featured: '精選' },
    notices: { saving: '儲存中...', saved: '已儲存。', saveFailed: '儲存失敗', deleting: '刪除中...', deleteFailed: '刪除失敗', deleted: '已刪除。' },
    empty: '沒有可顯示的專案。',
    editButton: '編輯',
    deleteButton: '刪除',
  },
  en: {
    title: 'Portfolio',
    description: 'Manage case studies, categories, and galleries.',
    statsLabel: 'Portfolio stats',
    editTitle: 'Edit project',
    newTitle: 'New project',
    newButton: 'New project',
    titleLabel: 'Title',
    slugLabel: 'Slug',
    slugPlaceholder: 'Can be auto-generated',
    summaryLabel: 'Summary',
    descriptionLabel: 'Description',
    bodyLabel: 'Body',
    categoryLabel: 'Category',
    completedAtLabel: 'Completed',
    statusLabel: 'Status',
    orderLabel: 'Order',
    clientLabel: 'Client',
    tagsLabel: 'Tags',
    coverLabel: 'Cover image URL',
    galleryLabel: 'Gallery images',
    galleryPlaceholder: 'one per line: url|alt|caption',
    featuredLabel: 'Featured project',
    saveButton: 'Create project',
    statusOptions: { all: 'All statuses', published: 'Published', draft: 'Draft', archived: 'Archived' },
    categoryOptions: { all: 'All categories' },
    countLabels: { total: 'Total', published: 'Published', draft: 'Draft', featured: 'Featured' },
    notices: { saving: 'Saving...', saved: 'Saved.', saveFailed: 'Save failed', deleting: 'Deleting...', deleteFailed: 'Delete failed', deleted: 'Deleted.' },
    empty: 'No projects to show.',
    editButton: 'Edit',
    deleteButton: 'Delete',
  },
};

interface PortfolioAdminClientProps {
  locale: Locale;
  siteTitle: string;
  initialProjects: PortfolioProject[];
  categories: Category[];
}

type Draft = {
  projectId?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  body: string;
  category: string;
  client: string;
  completedAt: string;
  tags: string;
  status: PortfolioProject['status'];
  featured: boolean;
  order: number;
  coverImageUrl: string;
  galleryText: string;
};

const today = new Date().toISOString().slice(0, 10);

function newDraft(category: string): Draft {
  return {
    title: '',
    slug: '',
    summary: '',
    description: '',
    body: '',
    category,
    client: '',
    completedAt: today,
    tags: '',
    status: 'published',
    featured: false,
    order: 0,
    coverImageUrl: '',
    galleryText: '',
  };
}

function draftFromProject(project: PortfolioProject): Draft {
  return {
    projectId: project.projectId,
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description,
    body: project.body,
    category: project.category,
    client: project.client ?? '',
    completedAt: project.completedAt,
    tags: project.tags.join(', '),
    status: project.status,
    featured: project.featured,
    order: project.order,
    coverImageUrl: project.coverImageUrl ?? '',
    galleryText: project.gallery.map((image) => [image.url, image.alt, image.caption ?? ''].join('|')).join('\n'),
  };
}

function statusText(locale: Locale, status: PortfolioProject['status']) {
  if (locale === 'ko') {
    return status === 'published' ? '공개' : status === 'draft' ? '초안' : '보관';
  }
  if (locale === 'zh-hant') {
    return status === 'published' ? '公開' : status === 'draft' ? '草稿' : '封存';
  }
  return status === 'published' ? 'Published' : status === 'draft' ? 'Draft' : 'Archived';
}

function galleryFromText(locale: Locale, value: string) {
  return value
    .split('\n')
    .map((line, index) => {
      const [url = '', alt = '', caption = ''] = line.split('|').map((part) => part.trim());
      if (!url) return null;
      return {
        imageId: `gallery-${index + 1}`,
        url,
        alt: alt || (locale === 'ko' ? '포트폴리오 이미지' : locale === 'zh-hant' ? '作品集圖片' : 'Portfolio image'),
        ...(caption ? { caption } : {}),
      };
    })
    .filter(Boolean);
}

function payloadFromDraft(locale: Locale, draft: Draft) {
  return {
    locale,
    title: draft.title,
    ...(draft.slug ? { slug: draft.slug } : {}),
    summary: draft.summary,
    description: draft.description,
    body: draft.body,
    category: draft.category,
    ...(draft.client ? { client: draft.client } : {}),
    completedAt: draft.completedAt,
    tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    status: draft.status,
    featured: draft.featured,
    order: draft.order,
    ...(draft.coverImageUrl ? { coverImageUrl: draft.coverImageUrl } : {}),
    gallery: galleryFromText(locale, draft.galleryText),
  };
}

export default function PortfolioAdminClient({
  locale,
  siteTitle,
  initialProjects,
  categories,
}: PortfolioAdminClientProps) {
  const text = copy[locale];
  const [projects, setProjects] = useState(initialProjects);
  const [status, setStatus] = useState<'all' | PortfolioProject['status']>('all');
  const [category, setCategory] = useState('all');
  const [draft, setDraft] = useState<Draft>(() => newDraft(categories[0]?.id ?? 'company-setup'));
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => projects.filter((project) => (
    (status === 'all' || project.status === status)
    && (category === 'all' || project.category === category)
  )), [category, projects, status]);

  const counts = useMemo(() => ({
    total: projects.length,
    published: projects.filter((project) => project.status === 'published').length,
    draft: projects.filter((project) => project.status === 'draft').length,
    featured: projects.filter((project) => project.featured).length,
  }), [projects]);

  async function refresh() {
    const response = await fetch(`/api/builder/portfolio?locale=${locale}&scope=all&status=all&sort=order-asc`, {
      cache: 'no-store',
    });
    const payload = await response.json() as { ok?: boolean; projects?: PortfolioProject[] };
    if (payload.ok && Array.isArray(payload.projects)) setProjects(payload.projects);
  }

  async function saveDraft() {
    setBusy(true);
    setNotice(text.notices.saving);
    try {
      const body = payloadFromDraft(locale, draft);
      const params = new URLSearchParams({ locale });
      const response = await fetch(
        draft.projectId
          ? `/api/builder/portfolio/${encodeURIComponent(draft.projectId)}?${params.toString()}`
          : `/api/builder/portfolio?${params.toString()}`,
        {
          method: draft.projectId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; project?: PortfolioProject; error?: string };
      if (!response.ok || !payload.ok || !payload.project) {
        setNotice(payload.error ?? text.notices.saveFailed);
        return;
      }
      setDraft(draftFromProject(payload.project));
      await refresh();
      setNotice(text.notices.saved);
    } finally {
      setBusy(false);
    }
  }

  async function removeProject(projectId: string) {
    setBusy(true);
    setNotice(text.notices.deleting);
    try {
      const params = new URLSearchParams({ locale });
      const response = await fetch(`/api/builder/portfolio/${encodeURIComponent(projectId)}?${params.toString()}`, { method: 'DELETE' });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({})) as { error?: string };
        setNotice(payload.error ?? text.notices.deleteFailed);
        return;
      }
      await refresh();
      if (draft.projectId === projectId) setDraft(newDraft(categories[0]?.id ?? 'company-setup'));
      setNotice(text.notices.deleted);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page} data-builder-portfolio-admin="true">
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>{siteTitle}</span>
          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </div>
        <div className={styles.stats} aria-label={text.statsLabel}>
          <span><strong>{counts.total}</strong> {text.countLabels.total}</span>
          <span><strong>{counts.published}</strong> {text.countLabels.published}</span>
          <span><strong>{counts.draft}</strong> {text.countLabels.draft}</span>
          <span><strong>{counts.featured}</strong> {text.countLabels.featured}</span>
        </div>
      </header>

      <section className={styles.shell}>
        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void saveDraft(); }}>
          <div className={styles.formHeader}>
            <h2>{draft.projectId ? text.editTitle : text.newTitle}</h2>
            <button type="button" data-portfolio-admin-new-draft="true" onClick={() => setDraft(newDraft(categories[0]?.id ?? 'company-setup'))}>{text.newButton}</button>
          </div>
          <label><span>{text.titleLabel}</span><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></label>
          <label><span>{text.slugLabel}</span><input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder={text.slugPlaceholder} /></label>
          <label><span>{text.summaryLabel}</span><textarea value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} rows={3} required /></label>
          <label><span>{text.descriptionLabel}</span><textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={4} /></label>
          <label><span>{text.bodyLabel}</span><textarea value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} rows={6} /></label>
          <div className={styles.grid2}>
            <label><span>{text.categoryLabel}</span><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name[locale]}</option>)}</select></label>
            <label><span>{text.completedAtLabel}</span><input type="date" value={draft.completedAt} onChange={(event) => setDraft({ ...draft, completedAt: event.target.value })} required /></label>
            <label><span>{text.statusLabel}</span><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as PortfolioProject['status'] })}><option value="published">{text.statusOptions.published}</option><option value="draft">{text.statusOptions.draft}</option><option value="archived">{text.statusOptions.archived}</option></select></label>
            <label><span>{text.orderLabel}</span><input type="number" value={draft.order} onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })} /></label>
          </div>
          <label><span>{text.clientLabel}</span><input value={draft.client} onChange={(event) => setDraft({ ...draft, client: event.target.value })} /></label>
          <label><span>{text.tagsLabel}</span><input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder={locale === 'ko' ? '쉼표로 구분' : locale === 'zh-hant' ? '以逗號分隔' : 'Comma-separated'} /></label>
          <label><span>{text.coverLabel}</span><input value={draft.coverImageUrl} onChange={(event) => setDraft({ ...draft, coverImageUrl: event.target.value })} /></label>
          <label><span>{text.galleryLabel}</span><textarea value={draft.galleryText} onChange={(event) => setDraft({ ...draft, galleryText: event.target.value })} rows={5} placeholder={text.galleryPlaceholder} /></label>
          <label className={styles.checkbox}><input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} /><span>{text.featuredLabel}</span></label>
          <button className={styles.primary} type="submit" disabled={busy}>{draft.projectId ? locale === 'ko' ? '변경 저장' : locale === 'zh-hant' ? '儲存變更' : 'Save changes' : text.saveButton}</button>
          {notice ? <p className={styles.notice} role="status">{notice}</p> : null}
        </form>

        <section className={styles.listPanel} aria-label={locale === 'ko' ? '포트폴리오 프로젝트' : locale === 'zh-hant' ? '作品集專案' : 'Portfolio projects'}>
          <div className={styles.toolbar}>
            <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
              <option value="all">{text.statusOptions.all}</option>
              <option value="published">{text.statusOptions.published}</option>
              <option value="draft">{text.statusOptions.draft}</option>
              <option value="archived">{text.statusOptions.archived}</option>
            </select>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">{text.categoryOptions.all}</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name[locale]}</option>)}
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className={styles.empty}>{text.empty}</div>
          ) : (
            <div className={styles.cards}>
              {filtered.map((project) => (
                <article key={project.projectId} className={styles.card} data-portfolio-admin-project={project.projectId}>
                  {project.coverImageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element -- Portfolio cover URLs are editor-entered and can be arbitrary remote/blob/data previews. */}
                      <img src={project.coverImageUrl} alt="" />
                    </>
                  ) : <div className={styles.imageFallback} />}
                  <div>
                    <span>{categories.find((item) => item.id === project.category)?.name[locale] ?? project.category} · {statusText(locale, project.status)}</span>
                    <strong>{project.title}</strong>
                    <p>{project.summary}</p>
                    <div className={styles.cardActions}>
                      <button type="button" onClick={() => setDraft(draftFromProject(project))}>{text.editButton}</button>
                      <button type="button" onClick={() => void removeProject(project.projectId)} disabled={busy}>{text.deleteButton}</button>
                    </div>
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
