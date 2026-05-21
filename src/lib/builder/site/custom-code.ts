/**
 * F105 — Custom code slot validation & types.
 *
 * Wix-class Developer Platform layer first slice: validate user-supplied HTML
 * / JS snippets for the site-level and per-page custom code injection slots
 * before they hit persistence. Pragmatic strip-and-warn semantics; the
 * runtime renderer (PublishedSitePageView) is responsible for injecting the
 * sanitized output via `dangerouslySetInnerHTML`.
 *
 * Pure module — no I/O. Tested in __tests__/custom-code.test.ts.
 */
export const CUSTOM_CODE_MAX_LENGTH = 8000;

export interface SiteCustomCode {
  siteHead?: string;
  siteBodyStart?: string;
  siteBodyEnd?: string;
}

export interface PageCustomCode {
  head?: string;
  bodyStart?: string;
  bodyEnd?: string;
}

export type CustomCodeSlot = 'head' | 'bodyStart' | 'bodyEnd';

export const CUSTOM_CODE_SLOTS: readonly CustomCodeSlot[] = ['head', 'bodyStart', 'bodyEnd'];

export interface CustomCodeWarning {
  code:
    | 'insecure_script_src'
    | 'iframe_blocked'
    | 'eval_warning'
    | 'too_long';
  message: string;
}

export interface CustomCodeValidation {
  sanitized: string;
  warnings: CustomCodeWarning[];
  /** True when input exceeds CUSTOM_CODE_MAX_LENGTH; callers should reject. */
  oversized: boolean;
}

const INSECURE_SCRIPT_PATTERN = /<script\b[^>]*\bsrc\s*=\s*["']http:\/\/[^"']*["'][^>]*>\s*<\/script\s*>/gi;
const IFRAME_OPEN_PATTERN = /<iframe\b[^>]*>/gi;
const IFRAME_CLOSE_PATTERN = /<\/iframe\s*>/gi;
const EVAL_PATTERN = /\beval\s*\(/g;

/**
 * Validate and sanitize a custom-code slot value.
 *
 * Rules (first-slice, pragmatic):
 *   - Strip `<script src="http://...">` (insecure mixed content) → warn
 *   - Strip `<iframe>` open/close tags → warn (sandboxing deferred)
 *   - Detect `eval(` calls → warn but pass through (advanced users may rely on it)
 *   - Length cap CUSTOM_CODE_MAX_LENGTH → flag oversized, return input as-is
 *
 * Pure: does not throw, does not access I/O. Callers (PATCH route) should
 * reject the request when `oversized` is true.
 */
export function validateCustomCode(input: string | undefined | null): CustomCodeValidation {
  if (input === undefined || input === null) {
    return { sanitized: '', warnings: [], oversized: false };
  }
  const raw = String(input);
  const warnings: CustomCodeWarning[] = [];

  if (raw.length > CUSTOM_CODE_MAX_LENGTH) {
    warnings.push({
      code: 'too_long',
      message: `Custom code exceeds ${CUSTOM_CODE_MAX_LENGTH} characters (received ${raw.length}).`,
    });
    return { sanitized: raw, warnings, oversized: true };
  }

  let sanitized = raw;

  if (INSECURE_SCRIPT_PATTERN.test(sanitized)) {
    warnings.push({
      code: 'insecure_script_src',
      message: 'Removed <script src="http://..."> — only HTTPS sources are allowed.',
    });
    sanitized = sanitized.replace(INSECURE_SCRIPT_PATTERN, '');
  }

  if (IFRAME_OPEN_PATTERN.test(sanitized) || IFRAME_CLOSE_PATTERN.test(sanitized)) {
    warnings.push({
      code: 'iframe_blocked',
      message: 'Removed <iframe> tags — embed via an approved widget instead.',
    });
    sanitized = sanitized.replace(IFRAME_OPEN_PATTERN, '').replace(IFRAME_CLOSE_PATTERN, '');
  }

  if (EVAL_PATTERN.test(sanitized)) {
    warnings.push({
      code: 'eval_warning',
      message: 'eval() detected — allowed but discouraged for performance and security.',
    });
  }

  // Reset regex lastIndex (the patterns are global) so subsequent calls are safe.
  INSECURE_SCRIPT_PATTERN.lastIndex = 0;
  IFRAME_OPEN_PATTERN.lastIndex = 0;
  IFRAME_CLOSE_PATTERN.lastIndex = 0;
  EVAL_PATTERN.lastIndex = 0;

  return { sanitized, warnings, oversized: false };
}

/** Validate every slot in a SiteCustomCode object; returns aggregate validation. */
export function validateSiteCustomCode(input: SiteCustomCode): {
  values: SiteCustomCode;
  warnings: Array<{ slot: keyof SiteCustomCode } & CustomCodeWarning>;
  oversized: boolean;
} {
  const warnings: Array<{ slot: keyof SiteCustomCode } & CustomCodeWarning> = [];
  let oversized = false;
  const values: SiteCustomCode = {};
  for (const slot of ['siteHead', 'siteBodyStart', 'siteBodyEnd'] as const) {
    const result = validateCustomCode(input[slot]);
    if (result.oversized) oversized = true;
    for (const warning of result.warnings) warnings.push({ slot, ...warning });
    if (result.sanitized) values[slot] = result.sanitized;
  }
  return { values, warnings, oversized };
}

/** Validate every slot in a PageCustomCode object; returns aggregate validation. */
export function validatePageCustomCode(input: PageCustomCode): {
  values: PageCustomCode;
  warnings: Array<{ slot: keyof PageCustomCode } & CustomCodeWarning>;
  oversized: boolean;
} {
  const warnings: Array<{ slot: keyof PageCustomCode } & CustomCodeWarning> = [];
  let oversized = false;
  const values: PageCustomCode = {};
  for (const slot of CUSTOM_CODE_SLOTS) {
    const result = validateCustomCode(input[slot]);
    if (result.oversized) oversized = true;
    for (const warning of result.warnings) warnings.push({ slot, ...warning });
    if (result.sanitized) values[slot] = result.sanitized;
  }
  return { values, warnings, oversized };
}