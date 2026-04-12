/**
 * Phase 8 — Template system.
 *
 * Templates are pre-built page layouts stored as BuilderCanvasDocument
 * snapshots. Users can:
 * 1. Create a new page FROM a template (starter templates)
 * 2. Save the current page AS a template (user templates)
 * 3. Browse templates in a gallery modal
 *
 * Starter templates are shipped as code (this file). User templates
 * are persisted to Vercel Blob alongside the site document.
 */

import type { Locale } from '@/lib/locales';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import { get, put, list, del } from '@vercel/blob';

export interface TemplateMetadata {
  templateId: string;
  name: string;
  description: string;
  category: 'landing' | 'service' | 'attorney' | 'columns' | 'contact' | 'custom';
  thumbnail?: string;
  locale: Locale;
  nodeCount: number;
  createdAt: string;
  isStarter: boolean;
}

export interface Template extends TemplateMetadata {
  document: BuilderCanvasDocument;
}

function toTemplateMetadata(template: Template): TemplateMetadata {
  return {
    templateId: template.templateId,
    name: template.name,
    description: template.description,
    category: template.category,
    thumbnail: template.thumbnail,
    locale: template.locale,
    nodeCount: template.nodeCount,
    createdAt: template.createdAt,
    isStarter: template.isStarter,
  };
}

// ─── Starter templates (code-shipped) ─────────────────────────────

const STARTER_TEMPLATES: Template[] = [
  {
    templateId: 'starter-landing',
    name: '법률사무소 랜딩',
    description: '히어로 + 서비스 소개 + 변호사 + CTA + 연락처',
    category: 'landing',
    locale: 'ko',
    nodeCount: 5,
    createdAt: '2026-04-12T00:00:00Z',
    isStarter: true,
    document: {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-04-12T00:00:00Z',
      updatedBy: 'template-system',
      nodes: [
        { id: 'hero-title', kind: 'text', rect: { x: 80, y: 80, width: 500, height: 80 }, style: createDefaultCanvasNodeStyle(), zIndex: 0, rotation: 0, locked: false, visible: true, content: { text: '호정국제 법률사무소', fontSize: 42, color: '#0f172a', fontWeight: 'bold', align: 'left' } },
        { id: 'hero-subtitle', kind: 'text', rect: { x: 80, y: 180, width: 450, height: 60 }, style: createDefaultCanvasNodeStyle(), zIndex: 1, rotation: 0, locked: false, visible: true, content: { text: '대만 법률 문제, 한국어로 상담받으세요', fontSize: 20, color: '#475569', fontWeight: 'regular', align: 'left' } },
        { id: 'hero-cta', kind: 'button', rect: { x: 80, y: 270, width: 180, height: 52 }, style: createDefaultCanvasNodeStyle(), zIndex: 2, rotation: 0, locked: false, visible: true, content: { label: '상담 요청하기', href: '/ko/contact', style: 'primary' } },
        { id: 'hero-image', kind: 'image', rect: { x: 600, y: 60, width: 400, height: 300 }, style: createDefaultCanvasNodeStyle(), zIndex: 3, rotation: 0, locked: false, visible: true, content: { src: '/images/header-skyline-ratio.webp', alt: '타이베이 스카이라인', fit: 'cover' } },
        { id: 'services-title', kind: 'text', rect: { x: 80, y: 420, width: 300, height: 40 }, style: createDefaultCanvasNodeStyle(), zIndex: 4, rotation: 0, locked: false, visible: true, content: { text: '주요 업무 분야', fontSize: 28, color: '#0f172a', fontWeight: 'bold', align: 'left' } },
      ],
    },
  },
  {
    templateId: 'starter-contact',
    name: '연락처 페이지',
    description: '사무실 정보 + 상담 폼 + 지도',
    category: 'contact',
    locale: 'ko',
    nodeCount: 3,
    createdAt: '2026-04-12T00:00:00Z',
    isStarter: true,
    document: {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-04-12T00:00:00Z',
      updatedBy: 'template-system',
      nodes: [
        { id: 'contact-title', kind: 'text', rect: { x: 80, y: 60, width: 400, height: 50 }, style: createDefaultCanvasNodeStyle(), zIndex: 0, rotation: 0, locked: false, visible: true, content: { text: '문의 및 연락처', fontSize: 32, color: '#0f172a', fontWeight: 'bold', align: 'left' } },
        { id: 'contact-info', kind: 'text', rect: { x: 80, y: 140, width: 400, height: 100 }, style: createDefaultCanvasNodeStyle(), zIndex: 1, rotation: 0, locked: false, visible: true, content: { text: '이메일: wei@hoveringlaw.com.tw\n전화: +886-2-xxxx-xxxx\n주소: 台北市大安區...', fontSize: 16, color: '#374151', fontWeight: 'regular', align: 'left' } },
        { id: 'contact-cta', kind: 'button', rect: { x: 80, y: 270, width: 200, height: 48 }, style: createDefaultCanvasNodeStyle(), zIndex: 2, rotation: 0, locked: false, visible: true, content: { label: '상담 신청하기', href: '/ko/contact', style: 'primary' } },
      ],
    },
  },
  {
    templateId: 'starter-attorney',
    name: '변호사 소개',
    description: '프로필 사진 + 약력 + 전문 분야',
    category: 'attorney',
    locale: 'ko',
    nodeCount: 3,
    createdAt: '2026-04-12T00:00:00Z',
    isStarter: true,
    document: {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-04-12T00:00:00Z',
      updatedBy: 'template-system',
      nodes: [
        { id: 'attorney-photo', kind: 'image', rect: { x: 80, y: 60, width: 280, height: 350 }, style: createDefaultCanvasNodeStyle(), zIndex: 0, rotation: 0, locked: false, visible: true, content: { src: '', alt: '변호사 프로필', fit: 'cover' } },
        { id: 'attorney-name', kind: 'text', rect: { x: 400, y: 80, width: 400, height: 50 }, style: createDefaultCanvasNodeStyle(), zIndex: 1, rotation: 0, locked: false, visible: true, content: { text: '대표 변호사', fontSize: 28, color: '#0f172a', fontWeight: 'bold', align: 'left' } },
        { id: 'attorney-bio', kind: 'text', rect: { x: 400, y: 150, width: 400, height: 200 }, style: createDefaultCanvasNodeStyle(), zIndex: 2, rotation: 0, locked: false, visible: true, content: { text: '전문 분야, 학력, 경력 등을 여기에 작성합니다.', fontSize: 16, color: '#374151', fontWeight: 'regular', align: 'left' } },
      ],
    },
  },
];

// ─── API ──────────────────────────────────────────────────────────

export function getStarterTemplates(locale?: Locale): TemplateMetadata[] {
  return STARTER_TEMPLATES
    .filter((t) => !locale || t.locale === locale)
    .map(toTemplateMetadata);
}

export function getStarterTemplate(templateId: string): Template | undefined {
  return STARTER_TEMPLATES.find((t) => t.templateId === templateId);
}

// ─── Backend selector (Wave 5b pattern) ───────────────────────────

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
  return true;
}

// ─── User templates (Blob with local fallback) ───────────────────

const USER_TEMPLATE_PREFIX = 'builder-templates/';

export async function saveAsTemplate(
  name: string,
  description: string,
  category: Template['category'],
  locale: Locale,
  document: BuilderCanvasDocument,
): Promise<TemplateMetadata> {
  const templateId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const meta: TemplateMetadata = {
    templateId,
    name,
    description,
    category,
    locale,
    nodeCount: document.nodes.length,
    createdAt: new Date().toISOString(),
    isStarter: false,
  };
  const template: Template = { ...meta, document };
  if (isBlobBackend()) {
    await put(
      `${USER_TEMPLATE_PREFIX}${templateId}.json`,
      JSON.stringify(template),
      { access: 'private', allowOverwrite: true, contentType: 'application/json' },
    );
  } else {
    const fs = await import('fs/promises');
    const path = await import('path');
    const dir = path.join(process.cwd(), 'runtime-data', 'builder-templates');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${templateId}.json`), JSON.stringify(template), 'utf8');
  }
  return meta;
}

export async function listUserTemplates(): Promise<TemplateMetadata[]> {
  try {
    const result = await list({ prefix: USER_TEMPLATE_PREFIX });
    const templates: TemplateMetadata[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          const t = JSON.parse(await new Response(res.stream).text()) as Template;
          templates.push(toTemplateMetadata(t));
        }
      } catch { /* skip malformed */ }
    }
    return templates;
  } catch {
    return [];
  }
}

export async function getUserTemplate(templateId: string): Promise<Template | null> {
  try {
    const res = await get(`${USER_TEMPLATE_PREFIX}${templateId}.json`, { access: 'private', useCache: false });
    if (res?.statusCode === 200 && res.stream) {
      return JSON.parse(await new Response(res.stream).text()) as Template;
    }
  } catch { /* not found */ }
  return null;
}

export async function deleteUserTemplate(templateId: string): Promise<void> {
  try {
    await del(`${USER_TEMPLATE_PREFIX}${templateId}.json`);
  } catch { /* ignore */ }
}
