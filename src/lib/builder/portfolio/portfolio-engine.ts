/**
 * Phase 18 — Portfolio Module.
 *
 * PFL-01: Project model (title, description, images, category, client, date, tags)
 * PFL-02: Portfolio gallery config (grid/masonry layout)
 * PFL-03: Case study format (법률사무소: 판례/성공 사례 전시)
 */

import type { Locale } from '@/lib/locales';
import { get, put, list } from '@vercel/blob';

// ─── Project Model ───────────────────────────────────────────────

export interface PortfolioProject {
  projectId: string;
  title: string;
  description: string;
  bodyHtml?: string;
  images: string[];           // array of image URLs
  thumbnailUrl?: string;
  category: string;
  client?: string;
  date: string;               // YYYY-MM-DD
  tags: string[];
  locale: Locale;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Case Study (법률사무소 전용) ─────────────────────────────────

export interface CaseStudy extends PortfolioProject {
  caseType: string;           // e.g. '교통사고', '이혼', '형사'
  court?: string;             // 관할 법원
  outcome: string;            // 판결 결과 요약
  clientTestimonial?: string; // 의뢰인 후기 (익명화)
  durationMonths?: number;    // 사건 소요 기간
  isAnonymized: boolean;      // 개인정보 비식별화 여부
}

// ─── Gallery Config ──────────────────────────────────────────────

export type GalleryLayout = 'grid' | 'masonry';

export interface GalleryConfig {
  configId: string;
  layout: GalleryLayout;
  columns: number;            // 2, 3, or 4
  gap: number;                // px
  showTitle: boolean;
  showCategory: boolean;
  showDate: boolean;
  showClient: boolean;
  showTags: boolean;
  itemsPerPage: number;
  filterByCategory?: string;
  locale: Locale;
}

export const DEFAULT_GALLERY_CONFIG: GalleryConfig = {
  configId: 'default-gallery',
  layout: 'grid',
  columns: 3,
  gap: 24,
  showTitle: true,
  showCategory: true,
  showDate: true,
  showClient: false,
  showTags: true,
  itemsPerPage: 12,
  locale: 'ko',
};

// ─── Blob Prefixes ───────────────────────────────────────────────

const PROJECTS_PREFIX = 'builder-portfolio/projects/';
const CONFIG_PREFIX = 'builder-portfolio/config/';

// ─── Project CRUD ────────────────────────────────────────────────

export async function saveProject(project: PortfolioProject): Promise<void> {
  await put(`${PROJECTS_PREFIX}${project.projectId}.json`, JSON.stringify(project), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadProject(projectId: string): Promise<PortfolioProject | null> {
  try {
    const result = await get(`${PROJECTS_PREFIX}${projectId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as PortfolioProject;
    }
  } catch { /* empty */ }
  return null;
}

export async function listProjects(): Promise<PortfolioProject[]> {
  try {
    const result = await list({ prefix: PROJECTS_PREFIX });
    const projects: PortfolioProject[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          projects.push(JSON.parse(await new Response(res.stream).text()) as PortfolioProject);
        }
      } catch { /* skip */ }
    }
    return projects;
  } catch { return []; }
}

export async function deleteProject(projectId: string): Promise<void> {
  await put(`${PROJECTS_PREFIX}${projectId}.json`, JSON.stringify({ deleted: true }), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

// ─── Gallery Config CRUD ─────────────────────────────────────────

export async function saveGalleryConfig(config: GalleryConfig): Promise<void> {
  await put(`${CONFIG_PREFIX}${config.configId}.json`, JSON.stringify(config), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadGalleryConfig(configId: string): Promise<GalleryConfig | null> {
  try {
    const result = await get(`${CONFIG_PREFIX}${configId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as GalleryConfig;
    }
  } catch { /* empty */ }
  return null;
}

// ─── Case Study CRUD ─────────────────────────────────────────────

export async function saveCaseStudy(caseStudy: CaseStudy): Promise<void> {
  await saveProject(caseStudy);
}

export async function loadCaseStudy(projectId: string): Promise<CaseStudy | null> {
  const project = await loadProject(projectId);
  if (!project) return null;
  return project as CaseStudy;
}

// ─── Sorting / Filtering ────────────────────────────────────────

export function sortProjectsByDate(projects: PortfolioProject[], direction: 'asc' | 'desc' = 'desc'): PortfolioProject[] {
  return [...projects].sort((a, b) =>
    direction === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
  );
}

export function sortProjectsByOrder(projects: PortfolioProject[]): PortfolioProject[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

export function filterProjectsByCategory(projects: PortfolioProject[], category: string): PortfolioProject[] {
  return projects.filter((p) => p.category === category);
}

export function filterProjectsByTag(projects: PortfolioProject[], tag: string): PortfolioProject[] {
  return projects.filter((p) => p.tags.includes(tag));
}

export function filterProjectsByLocale(projects: PortfolioProject[], locale: Locale): PortfolioProject[] {
  return projects.filter((p) => p.locale === locale);
}

export function filterFeaturedProjects(projects: PortfolioProject[]): PortfolioProject[] {
  return projects.filter((p) => p.featured);
}

export function paginateProjects(
  projects: PortfolioProject[],
  page: number,
  perPage: number,
): { projects: PortfolioProject[]; totalPages: number; currentPage: number } {
  const totalPages = Math.ceil(projects.length / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * perPage;
  return {
    projects: projects.slice(start, start + perPage),
    totalPages,
    currentPage,
  };
}

// ─── Validation ──────────────────────────────────────────────────

export function validateProject(project: Partial<PortfolioProject>): string[] {
  const errors: string[] = [];
  if (!project.title?.trim()) errors.push('프로젝트 제목을 입력하세요.');
  if (!project.description?.trim()) errors.push('프로젝트 설명을 입력하세요.');
  if (!project.date || !/^\d{4}-\d{2}-\d{2}$/.test(project.date)) errors.push('날짜 형식이 올바르지 않습니다 (YYYY-MM-DD).');
  if (!project.category?.trim()) errors.push('카테고리를 선택하세요.');
  return errors;
}

export function validateCaseStudy(caseStudy: Partial<CaseStudy>): string[] {
  const errors = validateProject(caseStudy);
  if (!caseStudy.caseType?.trim()) errors.push('사건 유형을 입력하세요.');
  if (!caseStudy.outcome?.trim()) errors.push('판결 결과를 입력하세요.');
  if (caseStudy.isAnonymized === false) {
    errors.push('개인정보 비식별화가 필요합니다.');
  }
  return errors;
}

// ─── Default law-firm portfolio categories ───────────────────────

export const DEFAULT_PORTFOLIO_CATEGORIES: Array<{ id: string; name: Record<Locale, string> }> = [
  { id: 'traffic-accident', name: { ko: '교통사고', 'zh-hant': '交通事故', en: 'Traffic Accident' } },
  { id: 'divorce', name: { ko: '이혼/가사', 'zh-hant': '離婚/家事', en: 'Divorce / Family' } },
  { id: 'criminal', name: { ko: '형사 사건', 'zh-hant': '刑事案件', en: 'Criminal Case' } },
  { id: 'company-setup', name: { ko: '회사 설립', 'zh-hant': '公司設立', en: 'Company Setup' } },
  { id: 'labor', name: { ko: '노동법', 'zh-hant': '勞動法', en: 'Labor Law' } },
  { id: 'inheritance', name: { ko: '상속', 'zh-hant': '繼承', en: 'Inheritance' } },
  { id: 'real-estate', name: { ko: '부동산', 'zh-hant': '不動產', en: 'Real Estate' } },
];

export function createDefaultCaseStudy(): CaseStudy {
  const now = new Date().toISOString();
  return {
    projectId: 'case-sample-01',
    title: '교통사고 손해배상 성공 사례',
    description: '의뢰인이 교통사고로 인한 손해배상 청구 소송에서 승소한 사례입니다.',
    images: [],
    category: 'traffic-accident',
    client: '익명',
    date: '2025-06-15',
    tags: ['교통사고', '손해배상', '승소'],
    locale: 'ko',
    featured: true,
    order: 0,
    createdAt: now,
    updatedAt: now,
    caseType: '교통사고',
    court: '서울중앙지방법원',
    outcome: '원고 승소, 손해배상금 전액 인정',
    clientTestimonial: '전문적이고 신속한 대응에 감사합니다.',
    durationMonths: 8,
    isAnonymized: true,
  };
}
