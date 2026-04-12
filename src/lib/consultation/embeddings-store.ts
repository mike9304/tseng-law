import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import type { Locale } from '@/lib/locales';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';

/**
 * Embeddings store for semantic column retrieval.
 *
 * Design:
 * - OpenAI text-embedding-3-small produces 1536-dimensional vectors
 *   and is multilingual (handles ko / zh-hant / en in one space).
 * - We pre-compute one embedding per (locale, slug) so a query can be
 *   compared against columns in the same locale first, with a
 *   fall-through to other locales if the user happened to switch
 *   languages mid-session.
 * - The store lives on disk as a JSON file at
 *   src/content/column-embeddings.json. It's ~600KB for 17 columns ×
 *   3 locales × 1536 floats, which is small enough to commit and to
 *   load fully into memory at engine init.
 * - At query time we embed the user message once and compute cosine
 *   similarity against every stored vector; with 51 vectors this is
 *   sub-millisecond and does not justify an ANN index.
 */

/** Fixed dimensionality of text-embedding-3-small output. */
export const EMBEDDING_DIM = 1536;

/** OpenAI embedding model id. Keep in sync with build-embeddings.ts. */
export const EMBEDDING_MODEL = 'text-embedding-3-small';

/** Absolute path of the pre-computed embeddings file. */
const EMBEDDINGS_FILE = path.join(
  process.cwd(),
  'src',
  'content',
  'column-embeddings.json',
);

export interface StoredColumnEmbedding {
  slug: string;
  locale: Locale;
  title: string;
  /** First ~120 chars of the summary/body used for the embedding input (for debugging). */
  snippet: string;
  /** 1536-dim float vector from OpenAI text-embedding-3-small. */
  vector: number[];
}

export interface ColumnEmbeddingsFile {
  version: 1;
  model: string;
  dim: number;
  builtAt: string;
  embeddings: StoredColumnEmbedding[];
}

/** In-memory cache of the loaded embeddings. */
let cachedStore: ColumnEmbeddingsFile | null = null;

/**
 * Load the stored embeddings file from disk. Returns null (not throw)
 * when the file does not exist — the calling code should fall back to
 * the static category-to-column mapping instead of crashing.
 */
export async function loadColumnEmbeddings(): Promise<ColumnEmbeddingsFile | null> {
  if (cachedStore) return cachedStore;
  try {
    const raw = await readFile(EMBEDDINGS_FILE, 'utf8');
    const parsed = JSON.parse(raw) as ColumnEmbeddingsFile;
    if (
      parsed &&
      parsed.version === 1 &&
      Array.isArray(parsed.embeddings) &&
      typeof parsed.dim === 'number'
    ) {
      cachedStore = parsed;
      return parsed;
    }
    console.error('[embeddings] invalid embeddings file shape');
    return null;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code !== 'ENOENT') {
      console.error('[embeddings] failed to read embeddings file:', error);
    }
    return null;
  }
}

/** Reset the module-level cache. Useful for tests or re-building at runtime. */
export function invalidateEmbeddingsCache(): void {
  cachedStore = null;
}

/** Cosine similarity between two equal-length vectors. */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dot += ai * bi;
    na += ai * ai;
    nb += bi * bi;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/**
 * Call the OpenAI embeddings endpoint. Returns null if the API is not
 * configured or the call fails. Never throws — the caller should fall
 * back to non-semantic retrieval rather than surface the error.
 */
export async function embedText(input: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!input || input.trim().length === 0) return null;
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: input.slice(0, 6000),
      }),
    });
    if (!response.ok) {
      console.error(`[embeddings] API returned ${response.status}`);
      return null;
    }
    const data = (await response.json()) as {
      data?: Array<{ embedding?: number[] }>;
    };
    const vector = data.data?.[0]?.embedding;
    if (!Array.isArray(vector) || vector.length === 0) {
      return null;
    }
    return vector;
  } catch (error) {
    console.error('[embeddings] embedText fetch failed:', error);
    return null;
  }
}

export interface SemanticSearchHit {
  slug: string;
  locale: Locale;
  title: string;
  similarity: number;
}

/**
 * Embed the query and return the top-k most similar columns across
 * the stored embeddings. Prefers columns matching the query's locale
 * but falls back to cross-locale matches if in-locale similarity is
 * weak. Returns an empty array when the store or the embeddings API
 * is unavailable.
 *
 * @param query   User message (will be embedded via OpenAI)
 * @param locale  Preferred locale for results
 * @param topK    How many hits to return (default 3)
 */
export async function semanticColumnSearch(
  query: string,
  locale: Locale,
  topK = 3,
): Promise<SemanticSearchHit[]> {
  const store = await loadColumnEmbeddings();
  if (!store || store.embeddings.length === 0) return [];

  const queryVector = await embedText(query);
  if (!queryVector) return [];

  // Compute similarity for every stored embedding.
  const scored = store.embeddings.map((entry) => ({
    slug: entry.slug,
    locale: entry.locale,
    title: entry.title,
    similarity: cosineSimilarity(queryVector, entry.vector),
  }));

  // Sort by similarity desc, prefer same-locale entries on ties.
  scored.sort((a, b) => {
    if (b.similarity !== a.similarity) return b.similarity - a.similarity;
    if (a.locale === locale && b.locale !== locale) return -1;
    if (b.locale === locale && a.locale !== locale) return 1;
    return 0;
  });

  // De-duplicate by slug, preferring the first (highest-score) hit per slug.
  const seen = new Set<string>();
  const unique: SemanticSearchHit[] = [];
  for (const hit of scored) {
    if (seen.has(hit.slug)) continue;
    seen.add(hit.slug);
    unique.push(hit);
    if (unique.length >= topK) break;
  }
  return unique;
}

/**
 * Re-rank a fixed list of slugs by semantic similarity to the query.
 * Unlike semanticColumnSearch, this does NOT search across ALL stored
 * embeddings — it ONLY compares against the given candidate slugs,
 * which means the classifier's category filter is preserved and a
 * labor query cannot cross-match traffic accident columns even if the
 * multilingual embedding happens to put them close in vector space.
 *
 * Use this when you have a trusted category-based candidate list and
 * want to pick the single best column for a specific question from
 * within that list (e.g. "subsidiary vs branch" picking the
 * subsidiary column from the company_setup bag, instead of the
 * generic basics column that always sits at position 0).
 */
export async function reRankSlugsByQuery(
  query: string,
  slugs: string[],
  locale: Locale,
): Promise<Array<{ slug: string; similarity: number }> | null> {
  if (slugs.length === 0) return [];
  const store = await loadColumnEmbeddings();
  if (!store || store.embeddings.length === 0) return null;
  const queryVector = await embedText(query);
  if (!queryVector) return null;

  const scored: Array<{ slug: string; similarity: number }> = [];
  for (const slug of slugs) {
    // Prefer same-locale embedding; fall back to any locale for this slug.
    const entry =
      store.embeddings.find((e) => e.slug === slug && e.locale === locale) ||
      store.embeddings.find((e) => e.slug === slug);
    if (!entry) {
      // No embedding for this slug — place last so it doesn't get dropped
      // if the caller still wants to include all candidates.
      scored.push({ slug, similarity: 0 });
      continue;
    }
    scored.push({
      slug,
      similarity: cosineSimilarity(queryVector, entry.vector),
    });
  }

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored;
}

/**
 * Build the embeddings file from scratch by iterating every available
 * column across the three locales. Exposed so both a build-time script
 * and a dev-mode API endpoint can trigger the process.
 */
export async function buildColumnEmbeddingsFile(): Promise<{
  total: number;
  written: number;
  skipped: number;
  outputPath: string;
}> {
  const locales: Locale[] = ['ko', 'zh-hant', 'en'];
  const embeddings: StoredColumnEmbedding[] = [];
  let total = 0;
  let skipped = 0;

  for (const locale of locales) {
    // Sprint 0: include both file-based columns AND lawyer-authored
    // columns from Vercel Blob (`consultation-columns/{locale}/...`).
    // The merged reader handles backend selection + slug deduplication.
    const posts = await getAllColumnPostsIncludingBlob(locale);
    for (const post of posts) {
      total += 1;
      // Compose the embedding input: title + summary + first 2000 chars
      // of the body. This gives the model enough content to build a
      // topic-aware vector without blowing up token usage.
      const bodyExcerpt = (post.content || '').slice(0, 2000);
      const input = `${post.title}\n\n${post.summary || ''}\n\n${bodyExcerpt}`;
      const vector = await embedText(input);
      if (!vector) {
        skipped += 1;
        continue;
      }
      embeddings.push({
        slug: post.slug,
        locale,
        title: post.title,
        snippet: (post.summary || bodyExcerpt).slice(0, 120),
        vector,
      });
    }
  }

  const payload: ColumnEmbeddingsFile = {
    version: 1,
    model: EMBEDDING_MODEL,
    dim: EMBEDDING_DIM,
    builtAt: new Date().toISOString(),
    embeddings,
  };

  await mkdir(path.dirname(EMBEDDINGS_FILE), { recursive: true });
  await writeFile(EMBEDDINGS_FILE, JSON.stringify(payload), { encoding: 'utf8' });
  invalidateEmbeddingsCache();

  return {
    total,
    written: embeddings.length,
    skipped,
    outputPath: EMBEDDINGS_FILE,
  };
}
