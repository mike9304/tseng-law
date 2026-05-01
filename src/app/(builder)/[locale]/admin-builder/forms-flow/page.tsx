import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listPages, readPageCanvas } from '@/lib/builder/site/persistence';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

export const dynamic = 'force-dynamic';

interface FormFlowEntry {
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  formId: string;
  formName: string;
  fieldCount: number;
  stepCount: number;
  conditionalCount: number;
}

export function generateMetadata(): Metadata {
  return {
    title: 'Forms Flow',
    description: 'Review builder forms, steps, and conditional fields.',
    robots: 'noindex,nofollow',
  };
}

export default async function FormsFlowPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const pages = await listPages('default', locale);
  const entries: FormFlowEntry[] = [];

  for (const page of pages) {
    const canvas = await readPageCanvas('default', page.pageId, 'draft').catch(() => null);
    if (!canvas) continue;
    const nodesByParent = new Map<string, BuilderCanvasNode[]>();
    for (const node of canvas.nodes) {
      if (!node.parentId) continue;
      nodesByParent.set(node.parentId, [...(nodesByParent.get(node.parentId) ?? []), node]);
    }
    for (const node of canvas.nodes) {
      if (node.kind !== 'form') continue;
      const children = nodesByParent.get(node.id) ?? [];
      entries.push({
        pageId: page.pageId,
        pageTitle: page.title[locale] || page.title[page.locale] || page.slug || 'Home',
        pageSlug: page.slug,
        formId: node.id,
        formName: String(node.content.name || node.id),
        fieldCount: children.filter((child) => String(child.kind).startsWith('form-') && child.kind !== 'form-submit').length,
        stepCount: Array.isArray(node.content.steps) ? node.content.steps.length : 0,
        conditionalCount: children.filter((child) => Boolean((child.content as { showIf?: unknown }).showIf)).length,
      });
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Forms flow</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
          Form nodes across draft pages. Detailed step and conditional editing stays in the page builder inspector.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 12 }}>
        {entries.map((entry) => (
          <article key={entry.formId} style={cardStyle}>
            <div>
              <strong style={{ display: 'block', fontSize: 16 }}>{entry.formName}</strong>
              <span style={{ color: '#64748b', fontSize: 13 }}>
                {entry.pageTitle} · /{locale}{entry.pageSlug ? `/p/${entry.pageSlug}` : ''}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', color: '#334155', fontSize: 13 }}>
              <span style={pillStyle}>{entry.fieldCount} fields</span>
              <span style={pillStyle}>{entry.stepCount} steps</span>
              <span style={pillStyle}>{entry.conditionalCount} conditions</span>
            </div>
            <Link href={`/${locale}/admin-builder?pageId=${encodeURIComponent(entry.pageId)}`} style={linkStyle}>
              Open in builder
            </Link>
          </article>
        ))}
        {entries.length === 0 ? (
          <div style={{ padding: 36, border: '1px dashed #cbd5e1', borderRadius: 10, textAlign: 'center', color: '#94a3b8', background: '#fff' }}>
            No form nodes found in draft pages.
          </div>
        ) : null}
      </section>
    </main>
  );
}

const cardStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto auto',
  alignItems: 'center',
  gap: 14,
  padding: 16,
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  background: '#fff',
  boxShadow: '0 10px 26px rgba(15, 23, 42, 0.05)',
};

const pillStyle: CSSProperties = {
  padding: '5px 8px',
  borderRadius: 999,
  background: '#f1f5f9',
};

const linkStyle: CSSProperties = {
  padding: '8px 10px',
  borderRadius: 8,
  background: '#123b63',
  color: '#fff',
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 700,
};
