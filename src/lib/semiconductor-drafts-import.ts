import { writeDraftColumn, readColumnBundle } from '@/lib/builder/columns/storage';
import { sanitizeColumnBodyHtml } from '@/lib/builder/columns/sanitize-body-html';
import {
  listSemiconductorArticleDrafts,
  type SemiconductorDraftRecord,
} from '@/lib/semiconductor-drafts';
import type { ColumnDocument } from '@/lib/builder/columns/types';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
    .replace(/\[\^([^\]]+)\]/g, '<sup>[$1]</sup>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function markdownToPreviewHtml(markdown: string): string {
  const lines = markdown.split('\n');
  const out: string[] = [];
  let tableRows: string[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    out.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushTable = () => {
    if (tableRows.length === 0) return;
    const rows = tableRows.filter((row) => !/^\|?\s*:?-{3,}/.test(row.replace(/\|/g, '')));
    const htmlRows = rows.map((row, index) => {
      const cells = row.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
      const tag = index === 0 ? 'th' : 'td';
      return `<tr>${cells.map((cell) => `<${tag}>${inlineMarkdown(cell)}</${tag}>`).join('')}</tr>`;
    });
    out.push(`<table><tbody>${htmlRows.join('')}</tbody></table>`);
    tableRows = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('|')) {
      flushParagraph();
      tableRows.push(line);
      continue;
    }
    flushTable();
    if (!line.trim()) {
      flushParagraph();
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    if (line.startsWith('[^') && line.includes(']:')) {
      flushParagraph();
      out.push(`<p>${inlineMarkdown(line)}</p>`);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushTable();
  return out.join('\n') || '<p></p>';
}

function toDraftDocument(record: SemiconductorDraftRecord, now: string): ColumnDocument {
  return {
    version: 1,
    slug: record.slug,
    locale: 'ko',
    title: record.title,
    summary: record.excerpt || record.metaDescription,
    bodyMarkdown: record.bodyMarkdown,
    bodyHtml: sanitizeColumnBodyHtml(markdownToPreviewHtml(record.bodyMarkdown)),
    linkedSlugs: {},
    frontmatter: {
      lastmod: now,
      attorneyReviewStatus: 'pending',
      freshness: 'unknown',
      category: 'legal',
      blogCategory: 'semiconductor-practical-guide',
      tags: record.topicId ? [record.topicId] : [],
      featured: false,
      seo: {
        title: record.title,
        description: record.metaDescription,
        noIndex: true,
      },
    },
    draft: true,
    revision: 1,
    updatedAt: now,
    updatedBy: 'semiconductor-draft-import',
  };
}

export async function importSemiconductorColumnDrafts(): Promise<{
  imported: Array<{ id: string; slug: string; path: string; duplicate: boolean }>;
}> {
  const now = new Date().toISOString();
  const imported = [];
  for (const record of listSemiconductorArticleDrafts()) {
    const existing = await readColumnBundle('ko', record.slug);
    if (existing.published) {
      throw new Error(`Refusing to overwrite published column ${record.slug}`);
    }
    const duplicate = Boolean(existing.draft);
    const previousRevision = existing.draft?.revision ?? 0;
    const document = toDraftDocument(record, now);
    document.revision = previousRevision + 1;
    await writeDraftColumn(document);
    imported.push({
      id: record.id,
      slug: record.slug,
      path: `runtime-data/consultation-columns/ko/${record.slug}.json`,
      duplicate,
    });
  }
  return { imported };
}

async function main() {
  const result = await importSemiconductorColumnDrafts();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && /semiconductor-drafts-import/.test(process.argv[1])) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
