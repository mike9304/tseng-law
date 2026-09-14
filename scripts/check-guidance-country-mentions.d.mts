/**
 * Types for `check-guidance-country-mentions.mjs` (WO-O32 B).
 *
 * Same convention as `src/lib/builder/storage/local-json-write-lease.d.mts`:
 * the gate stays plain ESM so it can be run with bare `node`, and this file is
 * what lets the vitest gate import it under `strict`.
 */

export type GuidanceLocale = 'vi' | 'id' | 'th' | 'fil';

export type GuidanceCountryHit = {
  country: string;
  token: string;
  phrase: string;
  start: number;
  end: number;
};

export type GuidanceCountryViolation = {
  file: string;
  line: number;
  locale: GuidanceLocale;
  key: string | null;
  country: string;
  token: string;
  phrase: string;
  sentence: string;
};

export type GuidanceCountryAllowance = GuidanceCountryViolation & {
  allowedBy: string;
  reason: string;
};

export type GuidanceCountryScan = {
  violations: GuidanceCountryViolation[];
  allowed: GuidanceCountryAllowance[];
  scannedFiles: Array<{ file: string; locales: GuidanceLocale[] }>;
  scannedLines: number;
};

export declare const GUIDANCE_DATA_FILES: string[];
export declare const GUIDANCE_LOCALES: GuidanceLocale[];
export declare const GUIDANCE_COUNTRY_TOKENS: Record<string, string[]>;
export declare const GUIDANCE_LANGUAGE_NAME_PATTERNS: RegExp[];
export declare const GUIDANCE_LANGUAGE_FIELD_KEYS: string[];
export declare const GUIDANCE_ALLOWED_CONTEXTS: Array<{
  id: string;
  reason: string;
  test: (entry: { key: string | null; rawLine: string }) => boolean;
}>;

export declare function extractLocaleBlocks(text: string): Array<{
  locale: GuidanceLocale;
  startLine: number;
  lines: Array<{ line: number; text: string }>;
}>;
export declare function keyForLine(rawLine: string, inheritedKey: string | null): string | null;
export declare function findCountryHits(rawLine: string): GuidanceCountryHit[];
export declare function scanGuidanceCountryMentions(
  files?: string[],
  root?: string,
): GuidanceCountryScan;
export declare function formatReport(result: GuidanceCountryScan): string;
