import type { AiIntakeFields, AiIntakeSensitiveFinding, AiIntakeSensitiveKind } from '@/lib/ai-intake/schemas';

const REJECT_KINDS: ReadonlySet<AiIntakeSensitiveKind> = new Set([
  'kr_resident_registration',
  'tw_national_id',
  'payment_card',
  'iban',
  'bank_account',
  'passport',
  'identity_number',
  'header_injection',
]);

const USER_STRING_FIELDS = [
  'name',
  'email',
  'summary',
  'phoneOrMessenger',
  'urgency',
  'preferredContact',
  'companyOrOrganization',
  'countryOrResidence',
  'preferredTime',
  'documentsAvailable',
] as const satisfies ReadonlyArray<keyof AiIntakeFields>;

const HEADER_FIELDS = [
  'name',
  'email',
  'phoneOrMessenger',
  'urgency',
  'preferredContact',
  'companyOrOrganization',
  'countryOrResidence',
  'preferredTime',
] as const satisfies ReadonlyArray<keyof AiIntakeFields>;

const TW_LETTER_CODES: Record<string, number> = {
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34, J: 18,
  K: 19, L: 20, M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25, S: 26, T: 27,
  U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33,
};

const LABELLED_BANK = [
  /계좌\s*번호\s*[:：]?\s*[\d][\d \t-]{7,20}/u,
  /帳戶\s*號碼\s*[:：]?\s*[\d][\d \t-]{7,20}/u,
  /銀行帳[戶号號]\s*[:：]?\s*[\d][\d \t-]{7,20}/u,
  /口座番号\s*[:：]?\s*[\d][\d \t-]{7,20}/u,
  /\bbank\s+account\s*(?:number|no\.?|#)?\s*[:：]?\s*[\d][\d \t-]{7,20}/i,
  /\baccount\s*(?:number|no\.?|#)\s*[:：]?\s*[\d][\d \t-]{7,20}/i,
];

const LABELLED_PASSPORT = [
  /여권\s*번호\s*[:：]?\s*([A-Z0-9][A-Z0-9 \t-]{4,18})/iu,
  /護照\s*號碼\s*[:：]?\s*([A-Z0-9][A-Z0-9 \t-]{4,18})/iu,
  /旅券番号\s*[:：]?\s*([A-Z0-9][A-Z0-9 \t-]{4,18})/iu,
  /\bpassport\s*(?:number|no\.?|#)\s*[:：]?\s*([A-Z0-9][A-Z0-9 \t-]{4,18})/i,
];

const LABELLED_IDENTITY = [
  /주민등록번호\s*[:：]?\s*([\d][\d \t-]{8,20})/u,
  /身分證字號\s*[:：]?\s*([A-Z0-9][A-Z0-9 \t-]{7,18})/iu,
  /マイナンバー\s*[:：]?\s*([\d][\d \t-]{8,20})/u,
  /\b(?:national\s+id|identity\s+number|id\s+number)\s*[:：]?\s*([A-Z0-9][A-Z0-9 \t-]{7,18})/i,
];

const IBAN_CANDIDATE = /\b[A-Z]{2}\d{2}(?:[ \-]?[A-Z0-9]){11,30}\b/g;

const URL_PATTERN = /\bhttps?:\/\/[^\s<>"']+/gi;
const WWW_PATTERN = /\bwww\.[^\s<>"']+/gi;

function foldWidth(value: string): string {
  return value
    .replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/\u3000/g, ' ')
    .replace(/[\u2010-\u2015\u2212\uFF0D]/g, '-');
}

function scanText(value: string): string {
  return foldWidth(value.normalize('NFKC'));
}

function countMatches(source: string, tester: (slice: string) => boolean, pattern: RegExp): number {
  let count = 0;
  const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
  for (const match of source.matchAll(re)) {
    const token = match[0];
    if (token && tester(token)) count += 1;
  }
  return count;
}

function isValidDateParts(yearLike: string, month: string, day: string): boolean {
  const mm = Number(month);
  const dd = Number(day);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return false;
  if (yearLike.length === 2) return true;
  const year = Number(yearLike);
  return year >= 1900 && year <= 2100;
}

function koreanRrnChecksum(digits: string): boolean {
  if (digits.length !== 13) return false;
  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  let sum = 0;
  for (let i = 0; i < 12; i += 1) {
    sum += (digits.charCodeAt(i) - 48) * weights[i];
  }
  const check = (11 - (sum % 11)) % 10;
  return check === digits.charCodeAt(12) - 48;
}

function isKoreanRrnToken(token: string): boolean {
  const digits = token.replace(/[^\d]/g, '');
  if (digits.length !== 13) return false;
  const month = digits.slice(2, 4);
  const day = digits.slice(4, 6);
  const gender = digits.charCodeAt(6) - 48;
  if (!isValidDateParts(digits.slice(0, 2), month, day)) return false;
  if (gender < 1 || gender > 8) return false;
  if (token.includes('-')) return true;
  return koreanRrnChecksum(digits);
}

function isTaiwanNationalIdToken(token: string): boolean {
  const id = token.toUpperCase();
  if (!/^[A-Z][12]\d{8}$/.test(id)) return false;
  const letter = TW_LETTER_CODES[id[0]];
  if (!letter) return false;
  const nums = [Math.floor(letter / 10), letter % 10, ...id.slice(1).split('').map((ch) => ch.charCodeAt(0) - 48)];
  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
  let sum = 0;
  for (let i = 0; i < nums.length; i += 1) sum += nums[i] * weights[i];
  return sum % 10 === 0;
}

function luhnOk(digits: string): boolean {
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = digits.charCodeAt(i) - 48;
    if (n < 0 || n > 9) return false;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function ibanChecksumOk(iban: string): boolean {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let rem = 0;
  for (const ch of rearranged) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      const n = code - 55;
      rem = (rem * 10 + Math.floor(n / 10)) % 97;
      rem = (rem * 10 + (n % 10)) % 97;
    } else {
      rem = (rem * 10 + (code - 48)) % 97;
    }
  }
  return rem === 1;
}

function isIbanToken(token: string): boolean {
  const compact = token.replace(/[\s-]/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(compact)) return false;
  if (compact.length < 15 || compact.length > 34) return false;
  return ibanChecksumOk(compact);
}

function isPlausibleLabelledIdentifier(token: string): boolean {
  const compact = token.replace(/[\s-]/g, '');
  if (compact.length < 6 || compact.length > 32) return false;
  if (!/\d/.test(compact)) return false;
  return /^[A-Z0-9]+$/i.test(compact);
}

function countLabelledIdentifiers(source: string, patterns: RegExp[]): number {
  let count = 0;
  for (const pattern of patterns) {
    const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
    for (const match of source.matchAll(re)) {
      const identifier = match[1] ?? match[0];
      if (identifier && isPlausibleLabelledIdentifier(identifier)) count += 1;
    }
  }
  return count;
}

function countRegex(source: string, patterns: RegExp[]): number {
  let count = 0;
  for (const pattern of patterns) {
    const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
    const matches = source.match(re);
    if (matches) count += matches.length;
  }
  return count;
}

function countUrls(source: string): number {
  const found = new Set<string>();
  for (const match of source.matchAll(URL_PATTERN)) found.add(match[0].toLowerCase());
  for (const match of source.matchAll(WWW_PATTERN)) found.add(match[0].toLowerCase());
  return found.size;
}

function countLongNumberAmbiguities(source: string): number {
  const runs = source.match(/\d[\d\s-]{10,24}\d/g) ?? [];
  let count = 0;
  for (const run of runs) {
    const digits = run.replace(/\D/g, '');
    if (digits.length >= 13 && digits.length <= 19 && !luhnOk(digits)) count += 1;
  }
  return count;
}

function addFinding(
  bucket: Map<AiIntakeSensitiveKind, { count: number; severity: 'reject' | 'warning' }>,
  kind: AiIntakeSensitiveKind,
  count: number,
): void {
  if (count <= 0) return;
  const severity = REJECT_KINDS.has(kind) ? 'reject' : 'warning';
  const current = bucket.get(kind);
  const next = Math.min(99, (current?.count ?? 0) + count);
  bucket.set(kind, { count: next, severity });
}

function scanHeaderFields(fields: AiIntakeFields, bucket: Map<AiIntakeSensitiveKind, { count: number; severity: 'reject' | 'warning' }>): void {
  let hits = 0;
  for (const key of HEADER_FIELDS) {
    const value = fields[key];
    if (typeof value === 'string' && /[\r\n]/.test(value)) hits += 1;
  }
  addFinding(bucket, 'header_injection', hits);
}

function collectUserText(fields: AiIntakeFields): string {
  return USER_STRING_FIELDS
    .map((key) => fields[key])
    .filter((value): value is string => Boolean(value))
    .join('\n');
}

/**
 * Conservative scanner over user-controlled free text.
 * Returns kind/count only. Never includes matched values.
 */
export function scanAiIntakeFields(fields: AiIntakeFields): {
  rejected: boolean;
  findings: AiIntakeSensitiveFinding[];
} {
  const bucket = new Map<AiIntakeSensitiveKind, { count: number; severity: 'reject' | 'warning' }>();
  scanHeaderFields(fields, bucket);

  const folded = scanText(collectUserText(fields));
  addFinding(bucket, 'kr_resident_registration', countMatches(folded, isKoreanRrnToken, /\b\d{6}[-\s]?\d{7}\b/g));
  addFinding(bucket, 'tw_national_id', countMatches(folded.toUpperCase(), isTaiwanNationalIdToken, /\b[A-Z][12]\d{8}\b/g));
  addFinding(bucket, 'iban', countMatches(folded.toUpperCase(), isIbanToken, IBAN_CANDIDATE));
  addFinding(
    bucket,
    'payment_card',
    countMatches(folded, (token) => luhnOk(token.replace(/\D/g, '')), /(?:\d[ -]?){13,19}/g),
  );
  addFinding(bucket, 'bank_account', countRegex(folded, LABELLED_BANK));
  addFinding(bucket, 'passport', countLabelledIdentifiers(folded, LABELLED_PASSPORT));
  addFinding(bucket, 'identity_number', countLabelledIdentifiers(folded, LABELLED_IDENTITY));
  addFinding(bucket, 'url', countUrls(folded));
  addFinding(bucket, 'long_number_ambiguous', countLongNumberAmbiguities(folded));

  const findings: AiIntakeSensitiveFinding[] = [...bucket.entries()]
    .map(([kind, value]) => ({ kind, count: value.count, severity: value.severity }))
    .sort((a, b) => a.kind.localeCompare(b.kind));

  return {
    rejected: findings.some((finding) => finding.severity === 'reject'),
    findings,
  };
}

export function rejectFindings(findings: AiIntakeSensitiveFinding[]): AiIntakeSensitiveFinding[] {
  return findings.filter((finding) => finding.severity === 'reject');
}

export function warningFindings(findings: AiIntakeSensitiveFinding[]): AiIntakeSensitiveFinding[] {
  return findings.filter((finding) => finding.severity === 'warning');
}
