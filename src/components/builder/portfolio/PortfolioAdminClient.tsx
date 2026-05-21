'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { PortfolioProject } from '@/lib/builder/portfolio/portfolio-shared';
import styles from './PortfolioAdmin.module.css';

type Category = { id: string; name: Record<Locale, string> };

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

function galleryFromText(value: string) {
  return value
    .split('\n')
    .map((line, index) => {
      const [url = '', alt = '', caption = ''] = line.split('|').map((part) => part.trim());
      if (!url) return null;
      return {
        imageId: `gallery-${index + 1}`,
        url,
        alt: alt || 'Portfolio image',
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
    gallery: galleryFromText(draft.galleryText),
  };
}

export default function PortfolioAdminClient({
  locale,
  siteTitle,
  initialProjects,
  categories,
}: PortfolioAdminClientProps) {
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
    setNotice('저장 중...');
    try {
      const body = payloadFromDraft(locale, draft);
      const response = await fetch(
        draft.projectId
          ? `/api/builder/portfolio/${encodeURIComponent(draft.projectId)}`
          : '/api/builder/portfolio',
        {
          method: draft.projectId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; project?: PortfolioProject; error?: string };
      if (!response.ok || !payload.ok || !payload.project) {
        setNotice(payload.error ?? '저장 실패');
        return;
      }
      setDraft(draftFromProject(payload.project));
      await refresh();
      setNotice('저장되었습니다.');
    } finally {
      setBusy(false);
    }
  }

  async function removeProject(projectId: string) {
    setBusy(true);
    setNotice('삭제 중...');
    try {
      const response = await fetch(`/api/builder/portfolio/${encodeURIComponent(projectId)}`, { method: 'DELETE' });
      if (!response.ok) {
        setNotice('삭제 실패');
        return;
      }
      await refresh();
      if (draft.projectId === projectId) setDraft(newDraft(categories[0]?.id ?? 'company-setup'));
      setNotice('삭제되었습니다.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page} data-builder-portfolio-admin="true">
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>{siteTitle}</span>
          <h1>Portfolio</h1>
          <p>사례/프로젝트, 카테고리, 갤러리를 관리합니다.</p>
        </div>
        <div className={styles.stats} aria-label="Portfolio stats">
          <span><strong>{counts.total}</strong> 전체</span>
          <span><strong>{counts.published}</strong> 공개</span>
          <span><strong>{counts.draft}</strong> 초안</span>
          <span><strong>{counts.featured}</strong> 추천</span>
        </div>
      </header>

      <section className={styles.shell}>
        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void saveDraft(); }}>
          <div className={styles.formHeader}>
            <h2>{draft.projectId ? '프로젝트 편집' : '새 프로젝트'}</h2>
            <button type="button" onClick={() => setDraft(newDraft(categories[0]?.id ?? 'company-setup'))}>새로 작성</button>
          </div>
          <label><span>제목</span><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></label>
          <label><span>Slug</span><input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="자동 생성 가능" /></label>
          <label><span>요약</span><textarea value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} rows={3} required /></label>
          <label><span>설명</span><textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={4} /></label>
          <label><span>본문</span><textarea value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} rows={6} /></label>
          <div className={styles.grid2}>
            <label><span>카테고리</span><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name[locale]}</option>)}</select></label>
            <label><span>완료일</span><input type="date" value={draft.completedAt} onChange={(event) => setDraft({ ...draft, completedAt: event.target.value })} required /></label>
            <label><span>상태</span><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as PortfolioProject['status'] })}><option value="published">공개</option><option value="draft">초안</option><option value="archived">보관</option></select></label>
            <label><span>정렬</span><input type="number" value={draft.order} onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })} /></label>
          </div>
          <label><span>클라이언트</span><input value={draft.client} onChange={(event) => setDraft({ ...draft, client: event.target.value })} /></label>
          <label><span>태그</span><input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="쉼표로 구분" /></label>
          <label><span>대표 이미지 URL</span><input value={draft.coverImageUrl} onChange={(event) => setDraft({ ...draft, coverImageUrl: event.target.value })} /></label>
          <label><span>갤러리 이미지</span><textarea value={draft.galleryText} onChange={(event) => setDraft({ ...draft, galleryText: event.target.value })} rows={5} placeholder="url|alt|caption 한 줄에 하나" /></label>
          <label className={styles.checkbox}><input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} /><span>추천 프로젝트</span></label>
          <button className={styles.primary} type="submit" disabled={busy}>{draft.projectId ? '변경 저장' : '프로젝트 만들기'}</button>
          {notice ? <p className={styles.notice} role="status">{notice}</p> : null}
        </form>

        <section className={styles.listPanel} aria-label="Portfolio projects">
          <div className={styles.toolbar}>
            <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
              <option value="all">모든 상태</option>
              <option value="published">공개</option>
              <option value="draft">초안</option>
              <option value="archived">보관</option>
            </select>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">모든 카테고리</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name[locale]}</option>)}
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className={styles.empty}>표시할 프로젝트가 없습니다.</div>
          ) : (
            <div className={styles.cards}>
              {filtered.map((project) => (
                <article key={project.projectId} className={styles.card} data-portfolio-admin-project={project.projectId}>
                  {project.coverImageUrl ? <img src={project.coverImageUrl} alt="" /> : <div className={styles.imageFallback} />}
                  <div>
                    <span>{categories.find((item) => item.id === project.category)?.name[locale] ?? project.category} · {project.status}</span>
                    <strong>{project.title}</strong>
                    <p>{project.summary}</p>
                    <div className={styles.cardActions}>
                      <button type="button" onClick={() => setDraft(draftFromProject(project))}>편집</button>
                      <button type="button" onClick={() => void removeProject(project.projectId)} disabled={busy}>삭제</button>
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
