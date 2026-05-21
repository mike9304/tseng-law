'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { BuilderPortfolioListCanvasNode } from '@/lib/builder/canvas/types';
import type { PortfolioProject } from '@/lib/builder/portfolio/portfolio-shared';
import { DEFAULT_PORTFOLIO_CATEGORIES, categoryLabel } from '@/lib/builder/portfolio/portfolio-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './PortfolioList.module.css';

interface PortfolioListElementProps {
  node: BuilderPortfolioListCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

type RootStyle = CSSProperties & {
  '--portfolio-list-columns': string;
};

const MOCK_PROJECTS: PortfolioProject[] = [
  {
    projectId: 'portfolio-widget-mock-1',
    slug: 'taiwan-company-setup-case',
    title: '한국 기업 대만 법인 설립 지원',
    summary: '투자 구조, 법인 등기, 세무 등록까지 한 번에 정리한 회사 설립 사례입니다.',
    description: '대만 회사 설립 자문 사례',
    body: '대만 회사 설립 자문 사례',
    category: 'company-setup',
    client: '익명 기업',
    completedAt: '2026-03-20',
    tags: ['회사설립'],
    locale: 'ko',
    status: 'published',
    featured: true,
    order: 1,
    coverImageUrl: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
    gallery: [],
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  },
  {
    projectId: 'portfolio-widget-mock-2',
    slug: 'taiwan-labor-dispute-case',
    title: '대만 노동 분쟁 자문',
    summary: '해고 통지, 퇴직금, 시간외 수당 쟁점을 정리한 노동법 대응 사례입니다.',
    description: '대만 노동법 자문 사례',
    body: '대만 노동법 자문 사례',
    category: 'labor',
    completedAt: '2026-02-12',
    tags: ['노동법'],
    locale: 'ko',
    status: 'published',
    featured: false,
    order: 2,
    coverImageUrl: '/images/blog/008-taiwan-labor-severance-law/featured-01.jpg',
    gallery: [],
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  },
];

export default function PortfolioListElement({ node, mode = 'edit', locale }: PortfolioListElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const [projects, setProjects] = useState<PortfolioProject[] | null>(null);
  const [activeCategory, setActiveCategory] = useState(c.category ?? '');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setProjects(null);
    setFailed(false);
    setLoading(!isBuilder);
    const params = new URLSearchParams({
      locale: effectiveLocale,
      scope: isBuilder ? 'all' : 'public',
      status: isBuilder ? 'all' : 'published',
      sort: c.sortBy,
      limit: String(c.limit),
    });
    if (activeCategory) params.set('category', activeCategory);
    if (c.featuredOnly) params.set('featured', 'true');

    fetch(`/api/builder/portfolio?${params.toString()}`)
      .then((response) => response.json())
      .then((json) => {
        if (!cancelled && json?.ok && Array.isArray(json.projects)) setProjects(json.projects as PortfolioProject[]);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCategory, c.featuredOnly, c.limit, c.sortBy, effectiveLocale, isBuilder]);

  useEffect(() => {
    setActiveCategory(c.category ?? '');
  }, [c.category]);

  const items = useMemo(() => {
    const source = projects ?? (isBuilder ? MOCK_PROJECTS : []);
    return source.slice(0, c.limit);
  }, [c.limit, isBuilder, projects]);

  if (!isBuilder && loading) {
    return <div className={styles.state} data-builder-portfolio-list="true" role="status">Loading portfolio...</div>;
  }

  if (!isBuilder && failed) {
    return <div className={styles.state} data-builder-portfolio-list="true" role="status">포트폴리오를 불러오지 못했습니다.</div>;
  }

  const rootStyle: RootStyle = {
    '--portfolio-list-columns': String(Math.max(1, Math.min(4, c.columns))),
  };

  return (
    <section
      className={styles.root}
      data-builder-portfolio-list="true"
      data-builder-portfolio-layout={c.layout}
      style={rootStyle}
    >
      {c.showCategoryFilter ? (
        <div className={styles.toolbar} aria-label="Portfolio category filter">
          <button
            type="button"
            className={styles.filter}
            aria-pressed={!activeCategory}
            onClick={() => setActiveCategory('')}
          >
            전체
          </button>
          {DEFAULT_PORTFOLIO_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={styles.filter}
              aria-pressed={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name[effectiveLocale]}
            </button>
          ))}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className={styles.state}>표시할 포트폴리오가 없습니다.</div>
      ) : (
        <div className={`${styles.grid} ${c.layout === 'list' ? styles.list : ''}`}>
          {items.map((project) => {
            const href = isBuilder ? '#' : `/${effectiveLocale}/portfolio/${project.slug}`;
            return (
              <a key={project.projectId} className={styles.card} href={href} data-builder-portfolio-card={project.projectId}>
                {project.coverImageUrl ? <img src={project.coverImageUrl} alt="" /> : <div className={styles.fallback} aria-hidden />}
                <span className={styles.body}>
                  <span className={styles.badge}>{categoryLabel(project.category, effectiveLocale)}</span>
                  <strong className={styles.title}>{project.title}</strong>
                  {c.showDate ? <span className={styles.meta}>{project.completedAt}</span> : null}
                  {c.showSummary ? <span className={styles.summary}>{project.summary}</span> : null}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
