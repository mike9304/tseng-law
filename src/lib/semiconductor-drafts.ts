import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import matter from 'gray-matter';
import {
  CONSULTATION_EMAIL,
  getConsultationEmailTemplate,
} from '@/lib/consultation/public-contact';

export const SEMICONDUCTOR_DRAFT_PACKAGE_ID = 'tseng-law-semiconductor-2026-09-16';
export const SEMICONDUCTOR_DRAFT_CATEGORY_ID = 'semiconductor-practical-guide';
export const SEMICONDUCTOR_DRAFT_CATEGORY_LABEL_KO = '반도체 기업 실무가이드';

export const SEMICONDUCTOR_TOPIC_LABELS_KO = {
  'taiwan-entry': '대만 진출·인력',
  'commercial-contracts': '계약·기술자료',
  'transaction-disputes': '대금회수·분쟁',
} as const;

export type SemiconductorTopicId = keyof typeof SEMICONDUCTOR_TOPIC_LABELS_KO;

export type SemiconductorInquiryKind = 'taiwan-entry' | 'commercial-contracts' | 'transaction-disputes';

export type SemiconductorDraftKind = 'service' | 'article';

export interface SemiconductorDraftRecord {
  id: string;
  kind: SemiconductorDraftKind;
  language: 'ko';
  title: string;
  slug: string;
  suggestedRoute: string;
  previewPath: string;
  adminPreviewPath: string;
  categoryId: string | null;
  topicId: SemiconductorTopicId | null;
  excerpt: string;
  metaDescription: string;
  relatedIds: string[];
  ctaKey: string | null;
  sourceCheckedAt: string | null;
  sourceConsolidationCutoff: string | null;
  reviewStatus: 'NEEDS_LAWYER_REVIEW';
  humanReviewRequired: true;
  publish: false;
  author: null;
  legalReviewer: null;
  legalReviewedAt: null;
  publishedAt: null;
  robots: 'noindex,nofollow';
  bodyMarkdown: string;
  bodyCharacters: number;
  sha256File: string;
  sha256Body: string;
  sourceFile: string;
}

const DRAFTS_DIR = path.join(process.cwd(), 'src/content/semiconductor-drafts');

const SOURCE_FILES: Record<string, string> = {
  'semi-service-ko': '00_semiconductor_service_page.ko.md',
  'semi-ko-001': '01_taiwan_semiconductor_market_entry.ko.md',
  'semi-ko-002': '02_taiwan_semiconductor_unpaid_invoices.ko.md',
  'semi-ko-003': '03_taiwan_semiconductor_supply_contract.ko.md',
};

const INQUIRY_SUBJECTS: Record<SemiconductorInquiryKind, string> = {
  'taiwan-entry': '[tseng-law.com 상담문의] 반도체 기업 — 대만 진출',
  'commercial-contracts': '[tseng-law.com 상담문의] 반도체 기업 — 공급계약',
  'transaction-disputes': '[tseng-law.com 상담문의] 반도체 기업 — 대금분쟁',
};

function sha256Hex(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

function splitFrontmatter(raw: string): { frontmatter: string; body: string } {
  const parts = raw.split('---\n');
  if (parts.length < 3 || parts[0] !== '') {
    throw new Error('Missing or malformed YAML frontmatter');
  }
  return {
    frontmatter: parts[1],
    body: parts.slice(2).join('---\n').replace(/^\n/, ''),
  };
}

function readNullField(frontmatter: string, key: string): null {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*null\\s*$`, 'm'));
  if (!match) {
    throw new Error(`Expected ${key}: null`);
  }
  return null;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function loadRecord(id: string): SemiconductorDraftRecord {
  const filename = SOURCE_FILES[id];
  if (!filename) {
    throw new Error(`Unknown semiconductor draft id: ${id}`);
  }
  const sourceFile = path.join(DRAFTS_DIR, filename);
  const raw = fs.readFileSync(sourceFile, 'utf8');
  const { frontmatter, body } = splitFrontmatter(raw);
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;
  const slug = typeof data.slug === 'string' ? data.slug : '';
  const kind: SemiconductorDraftKind = id === 'semi-service-ko' ? 'service' : 'article';
  const topicRaw = typeof data.topic_id === 'string' ? data.topic_id : null;
  const topicId =
    topicRaw && topicRaw in SEMICONDUCTOR_TOPIC_LABELS_KO
      ? (topicRaw as SemiconductorTopicId)
      : null;

  return {
    id,
    kind,
    language: 'ko',
    title: typeof data.title === 'string' ? data.title : '',
    slug,
    suggestedRoute: typeof data.suggested_route === 'string' ? data.suggested_route : '',
    previewPath:
      kind === 'service'
        ? '/ko/design-preview/semiconductor'
        : `/ko/design-preview/semiconductor/columns/${slug}`,
    adminPreviewPath:
      kind === 'service'
        ? '/ko/admin-builder/semiconductor-preview'
        : `/ko/admin-builder/semiconductor-preview/columns/${slug}`,
    categoryId: typeof data.category_id === 'string' ? data.category_id : null,
    topicId,
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    metaDescription: typeof data.meta_description === 'string' ? data.meta_description : '',
    relatedIds: asStringList(data.related_ids),
    ctaKey: typeof data.cta_key === 'string' ? data.cta_key : null,
    sourceCheckedAt: typeof data.source_checked_at === 'string' ? data.source_checked_at : null,
    sourceConsolidationCutoff:
      typeof data.source_consolidation_cutoff === 'string'
        ? data.source_consolidation_cutoff
        : null,
    reviewStatus: 'NEEDS_LAWYER_REVIEW',
    humanReviewRequired: true,
    publish: false,
    author: readNullField(frontmatter, 'author'),
    legalReviewer: readNullField(frontmatter, 'legal_reviewer'),
    legalReviewedAt: readNullField(frontmatter, 'legal_reviewed_at'),
    publishedAt: readNullField(frontmatter, 'published_at'),
    robots: 'noindex,nofollow',
    bodyMarkdown: body,
    bodyCharacters: body.length,
    sha256File: sha256Hex(raw),
    sha256Body: sha256Hex(body),
    sourceFile: `src/content/semiconductor-drafts/${filename}`,
  };
}

let cache: SemiconductorDraftRecord[] | null = null;

export function listSemiconductorDrafts(): SemiconductorDraftRecord[] {
  if (!cache) {
    cache = Object.keys(SOURCE_FILES).map(loadRecord);
  }
  return cache;
}

export function getSemiconductorServiceDraft(): SemiconductorDraftRecord {
  const service = listSemiconductorDrafts().find((item) => item.kind === 'service');
  if (!service) {
    throw new Error('Missing semiconductor service draft');
  }
  return service;
}

export function listSemiconductorArticleDrafts(): SemiconductorDraftRecord[] {
  return listSemiconductorDrafts().filter((item) => item.kind === 'article');
}

export function getSemiconductorDraftBySlug(slug: string): SemiconductorDraftRecord | undefined {
  return listSemiconductorDrafts().find((item) => item.slug === slug);
}

export function getSemiconductorDraftById(id: string): SemiconductorDraftRecord | undefined {
  return listSemiconductorDrafts().find((item) => item.id === id);
}

export function getRelatedSemiconductorDrafts(
  record: SemiconductorDraftRecord,
): SemiconductorDraftRecord[] {
  return record.relatedIds
    .map((id) => getSemiconductorDraftById(id))
    .filter((item): item is SemiconductorDraftRecord => Boolean(item));
}

export function semiconductorInquiryMailto(kind: SemiconductorInquiryKind): string {
  const template = getConsultationEmailTemplate('ko');
  return `mailto:${CONSULTATION_EMAIL}?subject=${encodeURIComponent(INQUIRY_SUBJECTS[kind])}&body=${encodeURIComponent(template.body)}`;
}

export function ctaKeyToInquiryKind(ctaKey: string | null): SemiconductorInquiryKind {
  if (ctaKey === 'semiconductor_supply_contract') return 'commercial-contracts';
  if (ctaKey === 'semiconductor_payment_dispute') return 'transaction-disputes';
  return 'taiwan-entry';
}

export const EXISTING_PUBLIC_RELATED_LINKS = [
  {
    href: '/ko/taiwan-company-setup-lawyer',
    label: '대만 법인설립 변호사 안내',
  },
  {
    href: '/ko/columns/taiwan-company-subsidiary-vs-branch',
    label: '자회사와 지사 비교 칼럼',
  },
  {
    href: '/ko/taiwan-litigation-lawyer',
    label: '대만 소송·미수금 변호사 안내',
  },
  {
    href: '/ko/contact',
    label: '공식 문의 페이지',
  },
  {
    href: '/ko/lawyers/wei-tseng',
    label: '담당 변호사 소개',
  },
] as const;

export function isSemiconductorDraftPreviewEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.DESIGN_PREVIEW === '1';
}

/** Display helper: keep the stored H1, avoid repeating it under the page hero. */
export function semiconductorDraftBodyWithoutLeadingTitle(
  record: SemiconductorDraftRecord,
): string {
  const heading = `# ${record.title}\n`;
  if (record.bodyMarkdown.startsWith(heading)) {
    return record.bodyMarkdown.slice(heading.length).replace(/^\n+/, '');
  }
  if (record.kind === 'service') {
    return record.bodyMarkdown.replace(/^# .+\n+/, '');
  }
  return record.bodyMarkdown;
}

export function semiconductorServiceBodyWithDraftLinks(
  record: SemiconductorDraftRecord,
  admin = false,
): string {
  let body = semiconductorDraftBodyWithoutLeadingTitle(record);
  for (const article of listSemiconductorArticleDrafts()) {
    const href = admin ? article.adminPreviewPath : article.previewPath;
    body = body.split(article.title).join(`[${article.title}](${href})`);
  }
  return body;
}
