/**
 * Native Portfolio app engine.
 *
 * F49 requires project records, categories, galleries, public detail pages,
 * and app-backed widgets to read one shared source of truth. Storage mirrors
 * the other native app packs: Vercel Blob in production when configured and
 * local files for dev/tests.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import type { Locale } from '@/lib/locales';
import {
  DEFAULT_PORTFOLIO_CATEGORIES,
  categoryLabel,
  slugifyPortfolioTitle,
} from '@/lib/builder/portfolio/portfolio-shared';
import type { SearchDoc } from '@/lib/builder/search/types';
import type {
  PortfolioGalleryImage,
  PortfolioProject,
  PortfolioSortBy,
  PortfolioStatus,
} from '@/lib/builder/portfolio/portfolio-shared';

export {
  DEFAULT_PORTFOLIO_CATEGORIES,
  categoryLabel,
  slugifyPortfolioTitle,
} from '@/lib/builder/portfolio/portfolio-shared';
export type {
  PortfolioGalleryImage,
  PortfolioLayout,
  PortfolioProject,
  PortfolioSortBy,
  PortfolioStatus,
} from '@/lib/builder/portfolio/portfolio-shared';

type PortfolioBackend = 'blob' | 'file';
type StoredPortfolioProject = PortfolioProject & { deleted?: boolean };

const PROJECTS_PREFIX = 'builder-portfolio/projects/';
const DEFAULT_PORTFOLIO_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-portfolio');

const SEEDED_PROJECTS: PortfolioProject[] = [
  {
    projectId: 'portfolio-company-setup-ko',
    slug: 'taiwan-company-setup-case',
    title: '한국 기업 대만 법인 설립 지원',
    summary: '투자 구조, 법인 등기, 세무 등록까지 한 번에 정리한 회사 설립 사례입니다.',
    description: '한국 본사의 대만 진출 과정에서 지점/자회사 선택, 자본금 송금, 대표자 등록, 세무 신고 준비를 순차적으로 지원했습니다.',
    body: '초기 상담에서 업종 인허가 가능성을 먼저 확인하고, 법인 설립 일정과 은행 계좌 개설 준비물을 병렬로 정리했습니다. 이후 투자심의, 법인 등기, 세무 등록, 노무 기본 문서까지 연결해 운영 개시 리스크를 줄였습니다.',
    category: 'company-setup',
    client: '익명 기업',
    completedAt: '2026-03-20',
    tags: ['회사설립', '외국인투자', '대만진출'],
    locale: 'ko',
    status: 'published',
    featured: true,
    order: 1,
    coverImageUrl: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
    gallery: [
      {
        imageId: 'company-setup-cover',
        url: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
        alt: '대만 회사 설립 관련 서류와 도시 이미지',
        caption: '대만 법인 설립 준비 자료',
      },
      {
        imageId: 'company-setup-detail',
        url: '/images/001-taiwan-company-establishment-basics/img-01.jpg',
        alt: '대만 도심 비즈니스 이미지',
        caption: '법인 설립 후 운영 개시 점검',
      },
    ],
    seoTitle: '한국 기업 대만 법인 설립 지원 사례',
    seoDescription: '대만 회사 설립, 외국인 투자, 세무 등록을 연결한 포트폴리오 사례입니다.',
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  },
  {
    projectId: 'portfolio-labor-ko',
    slug: 'taiwan-labor-dispute-case',
    title: '대만 노동 분쟁 자문',
    summary: '해고 통지, 퇴직금, 시간외 수당 쟁점을 정리한 노동법 대응 사례입니다.',
    description: '외국계 기업의 인사 조정 과정에서 대만 노동기준법 기준을 검토하고 분쟁 가능성을 낮추는 문서 정비를 지원했습니다.',
    body: '근로계약서, 출퇴근 기록, 급여 내역을 기준으로 법적 리스크를 분류하고, 통지 절차와 보상 산정 근거를 문서화했습니다. 협의 단계에서 필요한 한국어/중국어 설명 자료도 함께 정리했습니다.',
    category: 'labor',
    client: '익명 외국계 기업',
    completedAt: '2026-02-12',
    tags: ['노동법', '해고', '퇴직금'],
    locale: 'ko',
    status: 'published',
    featured: false,
    order: 2,
    coverImageUrl: '/images/blog/008-taiwan-labor-severance-law/featured-01.jpg',
    gallery: [
      {
        imageId: 'labor-cover',
        url: '/images/blog/008-taiwan-labor-severance-law/featured-01.jpg',
        alt: '대만 노동법 상담 이미지',
        caption: '노무 문서 검토',
      },
    ],
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  },
];

function getBackend(): PortfolioBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (process.env.BUILDER_PORTFOLIO_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function portfolioRoot(): string {
  return process.env.BUILDER_PORTFOLIO_ROOT?.trim() || DEFAULT_PORTFOLIO_ROOT;
}

function projectBlobPath(projectId: string): string {
  return `${PROJECTS_PREFIX}${projectId}.json`;
}

function projectFilePath(projectId: string): string {
  return path.join(portfolioRoot(), 'projects', `${projectId}.json`);
}

function nowIso(): string {
  return new Date().toISOString();
}

function safeTrim(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

async function writeJson(blobPath: string, filePath: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (getBackend() === 'blob') {
    await put(blobPath, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

async function readJson<T>(blobPath: string, filePath: string): Promise<T | null> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(blobPath, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }

    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

async function listProjectJson(): Promise<StoredPortfolioProject[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: PROJECTS_PREFIX });
    const values: StoredPortfolioProject[] = [];
    for (const blob of result.blobs) {
      const projectId = path.basename(blob.pathname, '.json');
      const parsed = await readJson<StoredPortfolioProject>(blob.pathname, projectFilePath(projectId));
      if (parsed) values.push(parsed);
    }
    return values;
  }

  const dir = path.join(portfolioRoot(), 'projects');
  const files = await fs.readdir(dir).catch(() => []);
  const values: StoredPortfolioProject[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const raw = await fs.readFile(path.join(dir, file), 'utf8').catch(() => '');
    if (!raw) continue;
    try {
      values.push(JSON.parse(raw) as StoredPortfolioProject);
    } catch {
      // Skip malformed local records.
    }
  }
  return values;
}

export function makePortfolioProjectId(): string {
  return `pf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeGallery(input: unknown): PortfolioGalleryImage[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item, index) => {
      if (typeof item === 'string') {
        const url = item.trim().slice(0, 2000);
        if (!url) return null;
        return {
          imageId: `image-${index + 1}`,
          url,
          alt: 'Portfolio image',
        } satisfies PortfolioGalleryImage;
      }
      if (!item || typeof item !== 'object') return null;
      const source = item as Partial<PortfolioGalleryImage>;
      const url = safeTrim(source.url, 2000);
      if (!url) return null;
      return {
        imageId: safeTrim(source.imageId, 120) || `image-${index + 1}`,
        url,
        alt: safeTrim(source.alt, 240) || 'Portfolio image',
        ...(safeTrim(source.caption, 240) ? { caption: safeTrim(source.caption, 240) } : {}),
      } satisfies PortfolioGalleryImage;
    })
    .filter((item): item is PortfolioGalleryImage => Boolean(item))
    .slice(0, 40);
}

export function normalizePortfolioProject(input: Partial<PortfolioProject>): PortfolioProject {
  const at = nowIso();
  const title = safeTrim(input.title, 180) || 'Untitled project';
  const projectId = safeTrim(input.projectId, 120) || makePortfolioProjectId();
  const gallery = normalizeGallery(input.gallery);
  const coverImageUrl = safeTrim(input.coverImageUrl, 2000) || gallery[0]?.url;
  const completedAt = safeTrim(input.completedAt, 10) || at.slice(0, 10);
  const category = safeTrim(input.category, 80) || DEFAULT_PORTFOLIO_CATEGORIES[0].id;

  return {
    projectId,
    slug: safeTrim(input.slug, 120) || slugifyPortfolioTitle(title),
    title,
    summary: safeTrim(input.summary, 320) || safeTrim(input.description, 320) || title,
    description: safeTrim(input.description, 2000),
    body: safeTrim(input.body, 8000) || safeTrim(input.description, 2000),
    category,
    ...(safeTrim(input.client, 180) ? { client: safeTrim(input.client, 180) } : {}),
    completedAt,
    tags: Array.isArray(input.tags)
      ? input.tags.map((tag) => safeTrim(tag, 80)).filter(Boolean).slice(0, 20)
      : [],
    locale: input.locale === 'zh-hant' || input.locale === 'en' ? input.locale : 'ko',
    status: input.status === 'draft' || input.status === 'archived' ? input.status : 'published',
    featured: Boolean(input.featured),
    order: Number.isFinite(input.order) ? Math.round(input.order ?? 0) : 0,
    ...(coverImageUrl ? { coverImageUrl } : {}),
    gallery,
    ...(safeTrim(input.seoTitle, 180) ? { seoTitle: safeTrim(input.seoTitle, 180) } : {}),
    ...(safeTrim(input.seoDescription, 320) ? { seoDescription: safeTrim(input.seoDescription, 320) } : {}),
    createdAt: input.createdAt && Number.isFinite(Date.parse(input.createdAt)) ? input.createdAt : at,
    updatedAt: input.updatedAt && Number.isFinite(Date.parse(input.updatedAt)) ? input.updatedAt : at,
  };
}

export async function saveProject(project: PortfolioProject): Promise<PortfolioProject> {
  const normalized = normalizePortfolioProject({ ...project, updatedAt: nowIso() });
  await writeJson(projectBlobPath(normalized.projectId), projectFilePath(normalized.projectId), normalized);
  return normalized;
}

export async function createProject(input: Partial<PortfolioProject>): Promise<PortfolioProject> {
  const normalized = normalizePortfolioProject(input);
  const existing = await findProjectBySlug(normalized.locale, normalized.slug);
  const project = existing
    ? { ...normalized, slug: `${normalized.slug}-${normalized.projectId.slice(-6)}` }
    : normalized;
  await writeJson(projectBlobPath(project.projectId), projectFilePath(project.projectId), project);
  return project;
}

export async function loadProject(projectId: string): Promise<PortfolioProject | null> {
  const parsed = await readJson<StoredPortfolioProject>(projectBlobPath(projectId), projectFilePath(projectId));
  if (!parsed || parsed.deleted) return null;
  return normalizePortfolioProject(parsed);
}

export async function listProjects(): Promise<PortfolioProject[]> {
  const stored = await listProjectJson();
  const storedIds = new Set(stored.map((project) => project.projectId));
  return [
    ...stored.filter((project) => !project.deleted).map((project) => normalizePortfolioProject(project)),
    ...SEEDED_PROJECTS.filter((project) => !storedIds.has(project.projectId)),
  ];
}

export async function deleteProject(projectId: string): Promise<void> {
  const existing = await loadProject(projectId);
  await writeJson(projectBlobPath(projectId), projectFilePath(projectId), {
    ...(existing ?? { projectId }),
    deleted: true,
    updatedAt: nowIso(),
  });
}

export async function findProjectBySlug(locale: Locale, slug: string): Promise<PortfolioProject | null> {
  return (await listProjects()).find((project) => project.locale === locale && project.slug === slug) ?? null;
}

export async function listPortfolioSearchDocs(locale: Locale): Promise<SearchDoc[]> {
  const projects = (await listProjects()).filter((project) => project.locale === locale && project.status === 'published');
  return projects.map((project): SearchDoc => ({
    id: `portfolio:${locale}:${project.projectId}`,
    kind: 'portfolio',
    locale,
    title: project.title,
    url: `/${locale}/portfolio/${project.slug}`,
    summary: project.summary || project.description,
    body: [
      project.summary,
      project.description,
      project.body,
      categoryLabel(project.category, locale),
      project.client,
      project.completedAt,
      ...(project.tags ?? []),
      ...project.gallery.map((image) => [image.alt, image.caption].filter(Boolean).join(' ')),
    ].filter(Boolean).join('\n'),
    publishedAt: project.completedAt,
    tags: project.tags,
  }));
}

export function filterProjectsByLocale(projects: PortfolioProject[], locale: Locale): PortfolioProject[] {
  return projects.filter((project) => project.locale === locale);
}

export function filterProjectsByStatus(
  projects: PortfolioProject[],
  status: PortfolioStatus | 'all',
): PortfolioProject[] {
  if (status === 'all') return projects;
  return projects.filter((project) => project.status === status);
}

export function filterProjectsByCategory(projects: PortfolioProject[], category?: string): PortfolioProject[] {
  if (!category) return projects;
  return projects.filter((project) => project.category === category);
}

export function filterFeaturedProjects(projects: PortfolioProject[], featuredOnly: boolean): PortfolioProject[] {
  return featuredOnly ? projects.filter((project) => project.featured) : projects;
}

export function searchProjects(projects: PortfolioProject[], query?: string): PortfolioProject[] {
  const q = query?.trim().toLowerCase();
  if (!q) return projects;
  return projects.filter((project) => [
    project.title,
    project.summary,
    project.description,
    project.body,
    project.category,
    ...(project.tags ?? []),
  ].some((value) => value.toLowerCase().includes(q)));
}

export function sortProjects(projects: PortfolioProject[], sortBy: PortfolioSortBy): PortfolioProject[] {
  const sorted = [...projects];
  if (sortBy === 'date-asc') {
    return sorted.sort((a, b) => a.completedAt.localeCompare(b.completedAt) || a.order - b.order);
  }
  if (sortBy === 'order-asc') {
    return sorted.sort((a, b) => a.order - b.order || b.completedAt.localeCompare(a.completedAt));
  }
  return sorted.sort((a, b) => b.completedAt.localeCompare(a.completedAt) || a.order - b.order);
}

export function validateProject(project: Partial<PortfolioProject>): string[] {
  const errors: string[] = [];
  if (!project.title?.trim()) errors.push('프로젝트 제목을 입력하세요.');
  if (!project.summary?.trim() && !project.description?.trim()) errors.push('프로젝트 요약을 입력하세요.');
  if (!project.completedAt || !/^\d{4}-\d{2}-\d{2}$/.test(project.completedAt)) {
    errors.push('완료일 형식이 올바르지 않습니다 (YYYY-MM-DD).');
  }
  if (!project.category?.trim()) errors.push('카테고리를 선택하세요.');
  if (project.status === 'published' && !project.slug?.trim()) errors.push('공개 프로젝트에는 slug가 필요합니다.');
  return errors;
}
