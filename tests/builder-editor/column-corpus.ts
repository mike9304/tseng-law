import fs from 'node:fs';
import path from 'node:path';
import { COLUMN_CONTENT_DIR_BY_LOCALE } from '@/lib/column-locales';
import type { PublicLocale8 } from '@/lib/public-guidance';

/** Same strip as `src/lib/columns.ts` `slugFromFilename`. */
export function slugFromColumnFilename(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/^\d{3}-/, '');
}

function repoRoot(): string {
  return process.env.QA_INTERNAL_REPOSITORY_ROOT ?? process.cwd();
}

/** Markdown-backed column slugs for a locale. Missing dirs are an empty corpus. */
export function listColumnSlugsFromFs(locale: PublicLocale8): string[] {
  const dir = path.join(repoRoot(), COLUMN_CONTENT_DIR_BY_LOCALE[locale]);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map(slugFromColumnFilename)
    .sort((a, b) => a.localeCompare(b, 'en'));
}
