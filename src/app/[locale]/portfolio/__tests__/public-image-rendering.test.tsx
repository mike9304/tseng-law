import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PortfolioProject } from '@/lib/builder/portfolio/portfolio-shared';

const { findProjectBySlug, listProjects } = vi.hoisted(() => ({
  findProjectBySlug: vi.fn(),
  listProjects: vi.fn(),
}));

vi.mock('@/lib/builder/portfolio/portfolio-engine', () => ({
  DEFAULT_PORTFOLIO_CATEGORIES: [
    { id: 'company-setup', name: { ko: '회사 설립', 'zh-hant': '公司設立', en: 'Company Setup' } },
  ],
  categoryLabel: () => 'Company Setup',
  filterProjectsByCategory: (projects: PortfolioProject[]) => projects,
  filterProjectsByLocale: (projects: PortfolioProject[]) => projects,
  filterProjectsByStatus: (projects: PortfolioProject[]) => projects,
  findProjectBySlug,
  listProjects,
  sortProjects: (projects: PortfolioProject[]) => projects,
}));

import PortfolioPage from '../page';
import PortfolioDetailPage from '../[slug]/page';

const project: PortfolioProject = {
  projectId: 'public-image-contract',
  slug: 'public-image-contract',
  title: 'Public image contract',
  summary: 'Portfolio image behavior.',
  description: 'Description',
  body: 'Body',
  category: 'company-setup',
  completedAt: '2026-07-30',
  tags: [],
  locale: 'en',
  status: 'published',
  featured: true,
  order: 1,
  coverImageUrl: 'https://portfolio-images.example.com/cover.jpg',
  gallery: [
    {
      imageId: 'local-gallery-image',
      url: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
      alt: 'Local gallery image',
    },
    {
      imageId: 'remote-gallery-image',
      url: 'https://portfolio-images.example.com/gallery.jpg',
      alt: 'Remote gallery image',
    },
  ],
  createdAt: '2026-07-30T00:00:00.000Z',
  updatedAt: '2026-07-30T00:00:00.000Z',
};

describe('public portfolio image rendering', () => {
  beforeEach(() => {
    listProjects.mockResolvedValue([project]);
    findProjectBySlug.mockResolvedValue(project);
  });

  it('keeps arbitrary remote card media direct, lazy, and intrinsically sized', async () => {
    const page = await PortfolioPage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({}),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('src="https://portfolio-images.example.com/cover.jpg"');
    expect(html).toContain('width="800"');
    expect(html).toContain('height="500"');
    expect(html).toContain('loading="lazy"');
    expect(html).not.toContain('/_next/image?url=https%3A%2F%2Fportfolio-images.example.com');
  });

  it('optimizes local gallery media while preserving remote URLs, alt text, dimensions, and lazy loading', async () => {
    const page = await PortfolioDetailPage({
      params: Promise.resolve({ locale: 'en', slug: project.slug }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain(
      encodeURIComponent('/images/001-taiwan-company-establishment-basics/featured-01.jpg'),
    );
    expect(html).toContain('alt="Local gallery image"');
    expect(html).toContain('sizes="(max-width: 640px) calc(100vw - 76px), (max-width: 900px) calc(50vw - 56px), 336px"');
    expect(html).toContain('src="https://portfolio-images.example.com/gallery.jpg"');
    expect(html).toContain('alt="Remote gallery image"');
    expect(html).toContain('width="800"');
    expect(html).toContain('height="600"');
    expect(html.match(/loading="lazy"/g)).toHaveLength(2);
  });
});
