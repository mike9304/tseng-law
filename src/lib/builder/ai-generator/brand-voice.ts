/**
 * F86 — AI Brand voice.
 *
 * Pure analyzer + dual blob/file storage for a site-wide brand voice
 * profile. The analyzer derives formality, warmth, technicality,
 * vocabulary band, taboos, and signature phrases from existing site
 * copy samples — no LLM call. The profile is then consumable by
 * downstream generators via `applyBrandVoiceToPrompt`.
 *
 * Storage mirrors the dual store pattern used in
 * `dynamic-template-drafts.ts` (Vercel Blob with private access when
 * `BLOB_READ_WRITE_TOKEN` is set, else writes to runtime-data on disk).
 */

import { get, put } from '@vercel/blob';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';

const BRAND_VOICE_STORAGE_ROOT = 'ai-generator';
const BRAND_VOICE_RUNTIME_ROOT = path.join(
  process.cwd(),
  'runtime-data',
  'ai-generator',
);
const BRAND_VOICE_PATH = `${BRAND_VOICE_STORAGE_ROOT}/brand-voice.json`;

export const FORMALITIES = ['casual', 'neutral', 'formal'] as const;
export type Formality = (typeof FORMALITIES)[number];

export const WARMTHS = ['cool', 'balanced', 'warm'] as const;
export type Warmth = (typeof WARMTHS)[number];

export const TECHNICALITIES = ['plain', 'mixed', 'technical'] as const;
export type Technicality = (typeof TECHNICALITIES)[number];

export const VOCABULARY_BANDS = [
  'basic',
  'everyday',
  'advanced',
  'specialized',
] as const;
export type VocabularyBand = (typeof VOCABULARY_BANDS)[number];

export interface BrandVoiceProfile {
  version: 1;
  locale: Locale;
  formality: Formality;
  warmth: Warmth;
  technicality: Technicality;
  vocabularyBand: VocabularyBand;
  taboos: string[];
  signaturePhrases: string[];
  notes?: string;
  savedAt: string | null;
  updatedBy: string | null;
  /** Hash-ish identifier so callers can detect drift in cached prompts. */
  fingerprint: string;
}

export const brandVoiceInputSchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']),
  samples: z.array(z.string().trim().min(1).max(2000)).max(40).optional(),
  taboos: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  signaturePhrases: z
    .array(z.string().trim().min(1).max(80))
    .max(20)
    .optional(),
  notes: z.string().trim().max(600).optional(),
  /** When provided, overrides the analyzer output. */
  overrides: z
    .object({
      formality: z.enum(FORMALITIES).optional(),
      warmth: z.enum(WARMTHS).optional(),
      technicality: z.enum(TECHNICALITIES).optional(),
      vocabularyBand: z.enum(VOCABULARY_BANDS).optional(),
    })
    .optional(),
});

export type BrandVoiceInput = z.infer<typeof brandVoiceInputSchema>;

// --- Analyzer ---------------------------------------------------------------

const FORMAL_MARKERS_KO =
  /(습니다|합니다|드립니다|주십시오|입니다|이올시다|되시겠습니다)/g;
const CASUAL_MARKERS_KO = /(요\b|해요|네요|이에요|예요|돼요|잖아요)/g;
const FORMAL_MARKERS_EN =
  /\b(thus|therefore|furthermore|moreover|hereby|kindly|please|notwithstanding|accordingly)\b/gi;
const CASUAL_MARKERS_EN =
  /\b(hey|yeah|gonna|wanna|stuff|cool|awesome|grab|chat|hop on|btw|lol)\b/gi;

const TECHNICAL_KEYWORDS_EN =
  /\b(api|sdk|kpi|saas|throughput|latency|orchestration|workflow|jurisdiction|liability|provision|statute|clause|cag|llm|inference|embeddings|tokens|sla)\b/gi;
const TECHNICAL_KEYWORDS_KO =
  /(조항|관할|책임|약관|규정|시행령|판례|API|SDK|토큰|아키텍처|레이턴시|워크플로우)/g;

const WARM_KEYWORDS_EN =
  /\b(welcome|care|together|family|friend|trust|gentle|warm|kindly|thank|gladly)\b/gi;
const WARM_KEYWORDS_KO = /(함께|마음|진심|소중|친절|따뜻|고객님|환영|감사)/g;

function countMatches(text: string, pattern: RegExp): number {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function averageSentenceLength(samples: string[]): number {
  const joined = samples.join(' ');
  if (joined.trim().length === 0) return 0;
  const sentences = joined.split(/[.!?。！？\n]+/).filter((part) => part.trim().length > 0);
  if (sentences.length === 0) return 0;
  const wordCount = joined.split(/\s+/).filter(Boolean).length;
  return wordCount / sentences.length;
}

function detectFormality(samples: string[], locale: Locale): Formality {
  const text = samples.join(' ');
  const formal = locale === 'ko'
    ? countMatches(text, FORMAL_MARKERS_KO)
    : countMatches(text, FORMAL_MARKERS_EN);
  const casual = locale === 'ko'
    ? countMatches(text, CASUAL_MARKERS_KO)
    : countMatches(text, CASUAL_MARKERS_EN);
  const exclamations = countMatches(text, /!/g);
  const score = formal - casual - exclamations * 0.5;
  if (score >= 3) return 'formal';
  if (score <= -2) return 'casual';
  return 'neutral';
}

function detectWarmth(samples: string[], locale: Locale): Warmth {
  const text = samples.join(' ');
  const warm = locale === 'ko'
    ? countMatches(text, WARM_KEYWORDS_KO)
    : countMatches(text, WARM_KEYWORDS_EN);
  const cool = countMatches(text, /\b(efficient|precise|exact|metric|return|roi|leverage)\b/gi);
  if (warm - cool >= 3) return 'warm';
  if (cool - warm >= 3) return 'cool';
  return 'balanced';
}

function detectTechnicality(samples: string[], locale: Locale): Technicality {
  const text = samples.join(' ');
  const technical = locale === 'ko'
    ? countMatches(text, TECHNICAL_KEYWORDS_KO)
    : countMatches(text, TECHNICAL_KEYWORDS_EN);
  if (technical >= 5) return 'technical';
  if (technical >= 2) return 'mixed';
  return 'plain';
}

function detectVocabularyBand(samples: string[]): VocabularyBand {
  const avg = averageSentenceLength(samples);
  const text = samples.join(' ');
  const longWords = text.split(/\s+/).filter((word) => word.length >= 12).length;
  if (avg >= 22 || longWords >= 6) return 'specialized';
  if (avg >= 16) return 'advanced';
  if (avg >= 10) return 'everyday';
  return 'basic';
}

function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out;
}

function fingerprintFor(profile: Omit<BrandVoiceProfile, 'fingerprint' | 'savedAt' | 'updatedBy'>): string {
  const parts = [
    profile.locale,
    profile.formality,
    profile.warmth,
    profile.technicality,
    profile.vocabularyBand,
    profile.taboos.join('|'),
    profile.signaturePhrases.join('|'),
    profile.notes ?? '',
  ];
  const blob = parts.join('::');
  let hash = 5381;
  for (let i = 0; i < blob.length; i += 1) {
    hash = ((hash << 5) + hash + blob.charCodeAt(i)) & 0xffffffff;
  }
  return `bv_${(hash >>> 0).toString(36)}`;
}

export function analyzeBrandVoice(input: BrandVoiceInput): BrandVoiceProfile {
  const locale = normalizeLocale(input.locale);
  const samples = (input.samples ?? []).filter((sample) => sample.trim().length > 0);
  const formality = input.overrides?.formality ?? detectFormality(samples, locale);
  const warmth = input.overrides?.warmth ?? detectWarmth(samples, locale);
  const technicality = input.overrides?.technicality ?? detectTechnicality(samples, locale);
  const vocabularyBand = input.overrides?.vocabularyBand ?? detectVocabularyBand(samples);
  const taboos = dedupeStrings(input.taboos ?? []).slice(0, 12);
  const signaturePhrases = dedupeStrings(input.signaturePhrases ?? []).slice(0, 12);

  const base: Omit<BrandVoiceProfile, 'fingerprint' | 'savedAt' | 'updatedBy'> = {
    version: 1,
    locale,
    formality,
    warmth,
    technicality,
    vocabularyBand,
    taboos,
    signaturePhrases,
    notes: input.notes?.trim() ? input.notes.trim() : undefined,
  };

  return {
    ...base,
    fingerprint: fingerprintFor(base),
    savedAt: null,
    updatedBy: null,
  };
}

// --- Prompt application ----------------------------------------------------

const FORMALITY_PROMPT: Record<Formality, string> = {
  casual: 'Use a casual, friendly register. Contractions are welcome.',
  neutral: 'Use a balanced register that fits both individual and B2B readers.',
  formal: 'Use a formal, polished register. Avoid contractions and slang.',
};

const WARMTH_PROMPT: Record<Warmth, string> = {
  cool: 'Stay matter-of-fact and outcome-focused. Avoid effusive language.',
  balanced: 'Stay measured and reassuring without being overly emotive.',
  warm: 'Be warm, human, and welcoming. Use second-person where natural.',
};

const TECHNICALITY_PROMPT: Record<Technicality, string> = {
  plain: 'Avoid jargon entirely. Use plain words a layperson would know.',
  mixed: 'Use light domain terminology only when it earns its place.',
  technical: 'Use precise domain terminology; assume an informed reader.',
};

const VOCAB_PROMPT: Record<VocabularyBand, string> = {
  basic: 'Vocabulary band: basic. Prefer short, common words.',
  everyday: 'Vocabulary band: everyday. Familiar words a general reader knows.',
  advanced: 'Vocabulary band: advanced. Higher-register, but not specialized.',
  specialized: 'Vocabulary band: specialized. Industry-specific terms are expected.',
};

export function applyBrandVoiceToPrompt(
  prompt: string,
  profile: BrandVoiceProfile | null | undefined,
): string {
  if (!profile) return prompt;
  const lines = [
    prompt.trim(),
    '',
    'Brand voice profile to respect:',
    `- ${FORMALITY_PROMPT[profile.formality]}`,
    `- ${WARMTH_PROMPT[profile.warmth]}`,
    `- ${TECHNICALITY_PROMPT[profile.technicality]}`,
    `- ${VOCAB_PROMPT[profile.vocabularyBand]}`,
  ];
  if (profile.signaturePhrases.length > 0) {
    lines.push(
      `- Signature phrases to favor when natural: ${profile.signaturePhrases
        .slice(0, 6)
        .join(', ')}.`,
    );
  }
  if (profile.taboos.length > 0) {
    lines.push(
      `- Never use these words or phrases (case-insensitive): ${profile.taboos
        .slice(0, 12)
        .join(', ')}.`,
    );
  }
  if (profile.notes) {
    lines.push(`- Additional editorial guidance: ${profile.notes}`);
  }
  return lines.join('\n');
}

export function describeBrandVoice(profile: BrandVoiceProfile): string {
  return `${profile.formality} / ${profile.warmth} / ${profile.technicality} / ${profile.vocabularyBand}`;
}

// --- Storage ---------------------------------------------------------------

interface BrandVoiceStore {
  backend: 'blob' | 'file';
  read(pathname: string): Promise<string | null>;
  write(pathname: string, content: string): Promise<void>;
}

function isNodeNotFoundError(error: unknown): boolean {
  return Boolean(
    error
      && typeof error === 'object'
      && 'code' in error
      && (error as { code?: string }).code === 'ENOENT',
  );
}

function isBlobNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const message = 'message' in error ? String((error as { message?: unknown }).message) : '';
  return /not found/i.test(message) || /404/.test(message);
}

function createBlobStore(): BrandVoiceStore {
  return {
    backend: 'blob',
    async read(pathname: string) {
      try {
        const result = await get(pathname, {
          access: 'private',
          useCache: false,
        });
        if (!result || result.statusCode !== 200 || !result.stream) return null;
        return await new Response(result.stream).text();
      } catch (error) {
        if (isBlobNotFoundError(error)) return null;
        throw error;
      }
    },
    async write(pathname: string, content: string) {
      await put(pathname, content, {
        access: 'private',
        allowOverwrite: true,
        contentType: 'application/json',
      });
    },
  };
}

function createFileStore(): BrandVoiceStore {
  return {
    backend: 'file',
    async read(pathname: string) {
      try {
        return await readFile(resolveRuntimePath(pathname), 'utf8');
      } catch (error) {
        if (isNodeNotFoundError(error)) return null;
        throw error;
      }
    },
    async write(pathname: string, content: string) {
      const resolved = resolveRuntimePath(pathname);
      await mkdir(path.dirname(resolved), { recursive: true, mode: 0o700 });
      await writeFile(resolved, content, { encoding: 'utf8', mode: 0o600 });
    },
  };
}

function resolveStore(): BrandVoiceStore {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return createBlobStore();
  return createFileStore();
}

function resolveRuntimePath(pathname: string): string {
  return path.join(BRAND_VOICE_RUNTIME_ROOT, pathname.replace(/^ai-generator\//, ''));
}

function sanitizeUpdatedBy(value?: string): string {
  return (value ?? 'brand-voice-api').trim().slice(0, 120) || 'brand-voice-api';
}

function parseStoredProfile(raw: string): BrandVoiceProfile | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const candidate = parsed as Partial<BrandVoiceProfile>;
    if (candidate.version !== 1) return null;
    if (!candidate.locale || !candidate.formality || !candidate.warmth) return null;
    const profile: BrandVoiceProfile = {
      version: 1,
      locale: normalizeLocale(candidate.locale),
      formality: candidate.formality as Formality,
      warmth: candidate.warmth as Warmth,
      technicality: (candidate.technicality as Technicality) ?? 'plain',
      vocabularyBand: (candidate.vocabularyBand as VocabularyBand) ?? 'everyday',
      taboos: Array.isArray(candidate.taboos)
        ? dedupeStrings(candidate.taboos.filter((value): value is string => typeof value === 'string'))
        : [],
      signaturePhrases: Array.isArray(candidate.signaturePhrases)
        ? dedupeStrings(
            candidate.signaturePhrases.filter(
              (value): value is string => typeof value === 'string',
            ),
          )
        : [],
      notes: typeof candidate.notes === 'string' ? candidate.notes : undefined,
      savedAt: typeof candidate.savedAt === 'string' ? candidate.savedAt : null,
      updatedBy: typeof candidate.updatedBy === 'string' ? candidate.updatedBy : null,
      fingerprint:
        typeof candidate.fingerprint === 'string' && candidate.fingerprint
          ? candidate.fingerprint
          : '',
    };
    if (!profile.fingerprint) {
      profile.fingerprint = fingerprintFor(profile);
    }
    return profile;
  } catch {
    return null;
  }
}

export interface BrandVoiceReadResult {
  backend: 'blob' | 'file';
  persisted: boolean;
  profile: BrandVoiceProfile | null;
}

export async function readBrandVoiceProfile(): Promise<BrandVoiceReadResult> {
  const store = resolveStore();
  const raw = await store.read(BRAND_VOICE_PATH);
  if (!raw) {
    return { backend: store.backend, persisted: false, profile: null };
  }
  const profile = parseStoredProfile(raw);
  if (!profile) {
    return { backend: store.backend, persisted: false, profile: null };
  }
  return { backend: store.backend, persisted: true, profile };
}

export interface BrandVoiceWriteResult {
  backend: 'blob' | 'file';
  profile: BrandVoiceProfile;
}

export async function writeBrandVoiceProfile(
  input: BrandVoiceInput,
  updatedBy?: string,
): Promise<BrandVoiceWriteResult> {
  const analyzed = analyzeBrandVoice(input);
  const profile: BrandVoiceProfile = {
    ...analyzed,
    savedAt: new Date().toISOString(),
    updatedBy: sanitizeUpdatedBy(updatedBy),
  };
  const store = resolveStore();
  await store.write(BRAND_VOICE_PATH, JSON.stringify(profile, null, 2));
  return { backend: store.backend, profile };
}

export async function deleteBrandVoiceProfile(): Promise<{ backend: 'blob' | 'file' }> {
  const store = resolveStore();
  // Soft-delete: overwrite with an empty placeholder JSON the parser rejects.
  await store.write(BRAND_VOICE_PATH, JSON.stringify({ version: 0, cleared: true }));
  return { backend: store.backend };
}