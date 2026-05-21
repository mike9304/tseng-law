import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createProject,
  deleteProject,
  filterProjectsByCategory,
  filterProjectsByLocale,
  filterProjectsByStatus,
  findProjectBySlug,
  listProjects,
  saveProject,
  sortProjects,
} from '@/lib/builder/portfolio/portfolio-engine';

let root: string;
const previousRoot = process.env.BUILDER_PORTFOLIO_ROOT;

describe('portfolio engine', () => {
  beforeEach(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-engine-'));
    process.env.BUILDER_PORTFOLIO_ROOT = root;
    process.env.BUILDER_PORTFOLIO_BACKEND = 'local';
  });

  afterEach(async () => {
    process.env.BUILDER_PORTFOLIO_ROOT = previousRoot;
    delete process.env.BUILDER_PORTFOLIO_BACKEND;
    await rm(root, { recursive: true, force: true });
  });

  it('creates, finds, updates, filters, and soft deletes projects', async () => {
    const created = await createProject({
      locale: 'ko',
      title: '대만 투자 포트폴리오',
      summary: '대만 투자 자문 사례',
      description: '투자 구조 검토',
      body: '법인 설립 전 투자 구조를 검토했습니다.',
      category: 'company-setup',
      completedAt: '2026-05-20',
      status: 'published',
      featured: true,
      order: 5,
      gallery: [{ imageId: 'one', url: '/images/hero-bg-01.webp', alt: '타이베이' }],
    });

    expect(created.slug).toBe('대만-투자-포트폴리오');
    expect(await findProjectBySlug('ko', created.slug)).toMatchObject({ projectId: created.projectId });

    const saved = await saveProject({ ...created, status: 'draft', order: 2 });
    expect(saved.status).toBe('draft');
    const listed = await listProjects();
    expect(filterProjectsByLocale(listed, 'ko').some((project) => project.projectId === created.projectId)).toBe(true);
    expect(filterProjectsByStatus(listed, 'draft')).toEqual([expect.objectContaining({ projectId: created.projectId })]);
    expect(filterProjectsByCategory(listed, 'company-setup').some((project) => project.projectId === created.projectId)).toBe(true);
    expect(sortProjects([created, saved], 'order-asc')[0]?.order).toBe(2);

    await deleteProject(created.projectId);
    expect(await loadAllIds()).not.toContain(created.projectId);
  });
});

async function loadAllIds(): Promise<string[]> {
  return (await listProjects()).map((project) => project.projectId);
}
