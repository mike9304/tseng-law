/**
 * Contact segment rule engine for M171 Marketing/CRM.
 *
 * A segment is a named bundle of rules plus a match mode ("all" / "any").
 * Rules are evaluated against `CrmContact` rows so the same segment can
 * power list filters, automation targeting, and campaign send queues.
 *
 * Pure functions only — no I/O, no clock dependencies aside from rule
 * inputs. Storage lives in `segments-store.ts`.
 */

import type { CrmContact } from './contact-model';

export type SegmentMatchMode = 'all' | 'any';

export type SegmentRule =
  | { kind: 'tag'; tag: string }
  | { kind: 'attribute'; key: string; value: string }
  | { kind: 'email-domain'; domain: string }
  | { kind: 'created-since'; since: string };

export interface CrmSegment {
  id: string;
  name: string;
  description?: string;
  rules: SegmentRule[];
  matchMode: SegmentMatchMode;
  createdAt: string;
  updatedAt: string;
}

export interface CrmSegmentsFile {
  version: 1;
  updatedAt: string;
  segments: CrmSegment[];
}

const MAX_RULES_PER_SEGMENT = 32;
const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 600;

function isIsoDateString(value: string): boolean {
  if (!value) return false;
  const ms = Date.parse(value);
  return Number.isFinite(ms);
}

function normalizeDomain(domain: string): string {
  const trimmed = domain.trim().toLowerCase();
  return trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
}

/** True iff the contact's email host equals `domain` (case-insensitive). */
function matchesEmailDomain(contact: CrmContact, domain: string): boolean {
  const normalized = normalizeDomain(domain);
  if (!normalized) return false;
  const at = contact.email.lastIndexOf('@');
  if (at < 0) return false;
  return contact.email.slice(at + 1).toLowerCase() === normalized;
}

function matchesAttribute(contact: CrmContact, key: string, value: string): boolean {
  if (!key) return false;
  const fields = contact.customFields ?? {};
  const actual = fields[key];
  if (typeof actual !== 'string') return false;
  return actual.trim().toLowerCase() === value.trim().toLowerCase();
}

function matchesCreatedSince(contact: CrmContact, since: string): boolean {
  if (!isIsoDateString(since)) return false;
  return contact.createdAt >= since;
}

/** Evaluate a single rule against a contact. Returns false for unknown kinds. */
export function evaluateRule(rule: SegmentRule, contact: CrmContact): boolean {
  switch (rule.kind) {
    case 'tag':
      return rule.tag ? contact.tags.includes(rule.tag) : false;
    case 'attribute':
      return matchesAttribute(contact, rule.key, rule.value);
    case 'email-domain':
      return matchesEmailDomain(contact, rule.domain);
    case 'created-since':
      return matchesCreatedSince(contact, rule.since);
    default:
      return false;
  }
}

/**
 * Match a segment against a contact. Empty rule lists return false so
 * an unconfigured segment never accidentally targets the entire CRM.
 */
export function matchSegment(segment: CrmSegment, contact: CrmContact): boolean {
  if (segment.rules.length === 0) return false;
  if (segment.matchMode === 'any') {
    return segment.rules.some((rule) => evaluateRule(rule, contact));
  }
  return segment.rules.every((rule) => evaluateRule(rule, contact));
}

/** Return the subset of contacts that match the segment. Order is preserved. */
export function selectContactsBySegment(
  segment: CrmSegment,
  contacts: CrmContact[],
): CrmContact[] {
  return contacts.filter((contact) => matchSegment(segment, contact));
}

// ─── Input validation (no zod dep here so this stays pure/no-side-effect) ─

export interface SegmentInput {
  name: string;
  description?: string;
  matchMode?: SegmentMatchMode;
  rules: SegmentRule[];
}

export interface SegmentValidationError {
  field: string;
  message: string;
}

export interface SegmentValidationResult {
  ok: boolean;
  errors: SegmentValidationError[];
  value?: SegmentInput;
}

function normalizeRule(raw: unknown): SegmentRule | SegmentValidationError {
  if (!raw || typeof raw !== 'object') {
    return { field: 'rules', message: 'rule must be an object' };
  }
  const r = raw as Record<string, unknown>;
  const kind = typeof r.kind === 'string' ? r.kind : '';
  switch (kind) {
    case 'tag': {
      const tag = typeof r.tag === 'string' ? r.tag.trim() : '';
      if (!tag) return { field: 'rules.tag', message: 'tag is required' };
      if (tag.length > 64) return { field: 'rules.tag', message: 'tag too long' };
      return { kind: 'tag', tag };
    }
    case 'attribute': {
      const key = typeof r.key === 'string' ? r.key.trim() : '';
      const value = typeof r.value === 'string' ? r.value.trim() : '';
      if (!key) return { field: 'rules.key', message: 'key is required' };
      if (!value) return { field: 'rules.value', message: 'value is required' };
      if (key.length > 80 || value.length > 2000) {
        return { field: 'rules', message: 'attribute key/value too long' };
      }
      return { kind: 'attribute', key, value };
    }
    case 'email-domain': {
      const domain = typeof r.domain === 'string' ? r.domain.trim() : '';
      if (!domain) return { field: 'rules.domain', message: 'domain is required' };
      if (domain.length > 200) return { field: 'rules.domain', message: 'domain too long' };
      return { kind: 'email-domain', domain };
    }
    case 'created-since': {
      const since = typeof r.since === 'string' ? r.since.trim() : '';
      if (!isIsoDateString(since)) {
        return { field: 'rules.since', message: 'since must be ISO date' };
      }
      return { kind: 'created-since', since };
    }
    default:
      return { field: 'rules.kind', message: `unknown rule kind: ${kind}` };
  }
}

export function validateSegmentInput(raw: unknown): SegmentValidationResult {
  const errors: SegmentValidationError[] = [];
  if (!raw || typeof raw !== 'object') {
    return { ok: false, errors: [{ field: 'body', message: 'must be an object' }] };
  }
  const body = raw as Record<string, unknown>;

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) errors.push({ field: 'name', message: 'name is required' });
  else if (name.length > MAX_NAME_LENGTH) {
    errors.push({ field: 'name', message: 'name too long' });
  }

  const description =
    typeof body.description === 'string' ? body.description.trim() : undefined;
  if (description && description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push({ field: 'description', message: 'description too long' });
  }

  const matchMode: SegmentMatchMode =
    body.matchMode === 'any' ? 'any' : 'all';

  const rulesRaw = Array.isArray(body.rules) ? body.rules : null;
  if (!rulesRaw) {
    errors.push({ field: 'rules', message: 'rules must be an array' });
    return { ok: false, errors };
  }
  if (rulesRaw.length === 0) {
    errors.push({ field: 'rules', message: 'at least one rule required' });
  }
  if (rulesRaw.length > MAX_RULES_PER_SEGMENT) {
    errors.push({ field: 'rules', message: 'too many rules' });
  }

  const parsedRules: SegmentRule[] = [];
  for (const r of rulesRaw) {
    const result = normalizeRule(r);
    if ('field' in result) errors.push(result);
    else parsedRules.push(result);
  }

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    errors: [],
    value: {
      name,
      description: description || undefined,
      matchMode,
      rules: parsedRules,
    },
  };
}