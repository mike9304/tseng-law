/**
 * Types for the parts of `check-column-translation.mjs` that other gates
 * import (WO-O33).
 *
 * The checker itself stays plain ESM so it can be run with bare `node`; this
 * declaration is what lets a `strict` TypeScript test import the two detectors
 * the guidance gates reuse — the `english` rule and the `forbidden` rule — so
 * the same definition of "this line is still English" and "this line makes a
 * banned claim" covers the column markdown and the guidance data modules.
 *
 * Only the members the TypeScript side uses are declared. Adding an import
 * here is a deliberate act, not an accident.
 */

export type ColumnTranslationLang = 'vi' | 'id' | 'th' | 'fil';

export type EnglishSentenceHit = {
  text: string;
  line: number;
  endLine: number;
};

export type ForbiddenPhraseHit = {
  line: number;
  id: string;
  note: string;
  text: string;
};

export declare const ENGLISH_WORD_MIN: number;
export declare const ENGLISH_STOPWORD_MIN: number;
export declare const FORBIDDEN_PHRASES: Record<
  ColumnTranslationLang,
  Array<{ id: string; re: RegExp; note: string }>
>;

export declare function findEnglishSentences(
  body: string,
  bodyStartLine: number,
): EnglishSentenceHit[];

export declare function findForbiddenHits(
  body: string,
  lang: string,
  bodyStartLine: number,
): ForbiddenPhraseHit[];

export declare function countHanzi(body: string): number;
