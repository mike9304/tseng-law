'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { BuilderPortfolioListCanvasNode } from '@/lib/builder/canvas/types';
import type { PortfolioProject } from '@/lib/builder/portfolio/portfolio-shared';
import { DEFAULT_PORTFOLIO_CATEGORIES, categoryLabel } from '@/lib/builder/portfolio/portfolio-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { WidgetDataDisclosure } from '../_shared/WidgetDataDisclosure';
import { getPortfolioListCopy } from './portfolio-list-copy';
import styles from './PortfolioList.module.css';

interface PortfolioListElementProps {
  node: BuilderPortfolioListCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

type RootStyle = CSSProperties & {
  '--portfolio-list-columns': string;
};

export default function PortfolioListElement({ node, mode = 'edit', locale }: PortfolioListElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = getPortfolioListCopy(effectiveLocale);
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
    const source = projects ?? (isBuilder ? copy.mockProjects : []);
    return source.slice(0, c.limit);
  }, [c.limit, copy.mockProjects, isBuilder, projects]);

  if (!isBuilder && loading) {
    return <div className={styles.state} data-builder-portfolio-list="true" role="status">{copy.loading}</div>;
  }

  if (!isBuilder && failed) {
    return <div className={styles.state} data-builder-portfolio-list="true" role="status">{copy.loadError}</div>;
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
      {isBuilder ? <WidgetDataDisclosure locale={effectiveLocale} /> : null}
      {c.showCategoryFilter ? (
        <div className={styles.toolbar} aria-label={copy.categoryFilterLabel}>
          <button
            type="button"
            className={styles.filter}
            aria-pressed={!activeCategory}
            onClick={() => setActiveCategory('')}
          >
            {copy.allCategories}
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
        <div className={styles.state}>{copy.empty}</div>
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
