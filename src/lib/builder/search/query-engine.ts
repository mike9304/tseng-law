import type { Locale } from '@/lib/locales';
import type { SearchDoc, SearchHit, SearchIndex } from './types';
import { tokenize } from './tokenize';

interface QueryArgs {
  index: SearchIndex;
  query: string;
  locale: Locale;
  limit?: number;
  kinds?: Array<SearchDoc['kind']>;
}

function parseEntry(entry: string): { docIdx: number; tf: number } {
  const [docIdx, tf] = entry.split(':');
  return { docIdx: Number(docIdx), tf: Number(tf) };
}

function makeHighlights(doc: SearchDoc, terms: string[]): string[] {
  const haystack = `${doc.summary ?? ''}\n${doc.body}`;
  const out: string[] = [];
  for (const term of terms) {
    const idx = haystack.toLowerCase().indexOf(term);
    if (idx === -1) continue;
    const start = Math.max(0, idx - 30);
    const end = Math.min(haystack.length, idx + term.length + 60);
    out.push(haystack.slice(start, end).replace(/\s+/g, ' ').trim());
    if (out.length >= 2) break;
  }
  return out;
}

export function runSearchQuery({
  index,
  query,
  locale,
  limit = 20,
  kinds,
}: QueryArgs): SearchHit[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const localeDocs = index.byLocale[locale] ?? [];
  const inverted = index.invertedByLocale[locale] ?? {};
  if (localeDocs.length === 0) return [];

  const totalDocs = localeDocs.length;
  const scoreByDoc = new Map<number, number>();
  const matchedTermsByDoc = new Map<number, Set<string>>();

  for (const term of terms) {
    const entries = inverted[term];
    if (!entries || entries.length === 0) continue;
    const df = entries.length;
    const idf = Math.log(1 + totalDocs / df);
    for (const entry of entries) {
      const { docIdx, tf } = parseEntry(entry);
      const score = (1 + Math.log(tf)) * idf;
      scoreByDoc.set(docIdx, (scoreByDoc.get(docIdx) ?? 0) + score);
      if (!matchedTermsByDoc.has(docIdx)) matchedTermsByDoc.set(docIdx, new Set());
      matchedTermsByDoc.get(docIdx)!.add(term);
    }
  }

  const hits: SearchHit[] = [];
  for (const [docIdx, score] of scoreByDoc.entries()) {
    const doc = localeDocs[docIdx];
    if (!doc) continue;
    if (kinds && kinds.length > 0 && !kinds.includes(doc.kind)) continue;
    // Boost title hits — quick check: any term substring in lowercased title.
    let titleBoost = 1;
    const lowerTitle = doc.title.toLowerCase();
    for (const term of matchedTermsByDoc.get(docIdx) ?? []) {
      if (lowerTitle.includes(term)) titleBoost = 1.5;
    }
    hits.push({
      doc,
      score: score * titleBoost,
      highlights: makeHighlights(doc, Array.from(matchedTermsByDoc.get(docIdx) ?? [])),
    });
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
