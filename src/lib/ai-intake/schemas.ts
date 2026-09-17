import { z } from 'zod';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import { AI_INTAKE_INTAKE_ID_PATTERN, AI_INTAKE_SHA256_HEX_PATTERN } from '@/lib/ai-intake/constants';
import { isAiIntakePublicPrivacyUrl } from '@/lib/ai-intake/origin';

/** Nine consultation category values reused from the existing public intake. */
export const AI_INTAKE_CATEGORIES = [
  'company_setup',
  'traffic_accident',
  'criminal_investigation',
  'labor',
  'divorce_family',
  'inheritance',
  'logistics',
  'cosmetics',
  'general',
] as const;

export const AI_INTAKE_ERROR_CODES = [
  'UNAUTHENTICATED',
  'INVALID_REQUEST',
  'RATE_LIMITED',
  'BACKEND_UNAVAILABLE',
  'CONFIG_UNAVAILABLE',
  'SENSITIVE_DATA_REJECTED',
  'PREVIEW_MISMATCH',
  'IDEMPOTENCY_CONFLICT',
  'TOKEN_INVALID',
  'TOKEN_EXPIRED',
  'CONSENT_REQUIRED',
  'APPROVAL_REQUIRED',
  'DELIVERY_UNKNOWN',
] as const;

export const AI_INTAKE_SENSITIVE_KINDS = [
  'kr_resident_registration',
  'tw_national_id',
  'payment_card',
  'iban',
  'bank_account',
  'passport',
  'identity_number',
  'header_injection',
  'url',
  'long_number_ambiguous',
] as const;

export const AI_INTAKE_FIELD_ERROR_REASONS = [
  'required',
  'invalid',
  'too_short',
  'too_long',
  'unexpected_field',
] as const;

export const AI_INTAKE_DELIVERY_STATUSES = ['sending', 'sent', 'failed_unknown'] as const;

export const AI_INTAKE_FIELD_KEYS = [
  'name',
  'email',
  'summary',
  'locale',
  'category',
  'phoneOrMessenger',
  'urgency',
  'preferredContact',
  'companyOrOrganization',
  'countryOrResidence',
  'preferredTime',
  'documentsAvailable',
  'idempotencyKey',
  'confirmationToken',
  'privacyConsent',
  'userApprovedExactPreview',
] as const;

export const aiIntakeLocaleSchema = z.enum(siteLocales);
export const aiIntakeCategorySchema = z.enum(AI_INTAKE_CATEGORIES);
export const aiIntakeErrorCodeSchema = z.enum(AI_INTAKE_ERROR_CODES);
export const aiIntakeSensitiveKindSchema = z.enum(AI_INTAKE_SENSITIVE_KINDS);
export const aiIntakeFieldErrorReasonSchema = z.enum(AI_INTAKE_FIELD_ERROR_REASONS);
export const aiIntakeDeliveryStatusSchema = z.enum(AI_INTAKE_DELIVERY_STATUSES);
export const aiIntakeFieldKeySchema = z.enum(AI_INTAKE_FIELD_KEYS);

const optionalBoundedText = (max: number) =>
  z.string().trim().max(max).optional();

export const aiIntakeFieldsSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().min(3).max(254).email(),
    summary: z.string().trim().min(1).max(4000),
    locale: aiIntakeLocaleSchema,
    category: aiIntakeCategorySchema.optional(),
    phoneOrMessenger: optionalBoundedText(120),
    urgency: optionalBoundedText(80),
    preferredContact: optionalBoundedText(80),
    companyOrOrganization: optionalBoundedText(200),
    countryOrResidence: optionalBoundedText(120),
    preferredTime: optionalBoundedText(200),
    documentsAvailable: optionalBoundedText(1000),
  })
  .strict();

export const aiIntakeIdempotencyKeySchema = z.string().trim().uuid().transform((value) => value.toLowerCase());

export const aiIntakePreviewRequestSchema = aiIntakeFieldsSchema
  .extend({
    idempotencyKey: aiIntakeIdempotencyKeySchema,
  })
  .strict();

export const aiIntakeSubmitRequestSchema = aiIntakeFieldsSchema
  .extend({
    idempotencyKey: aiIntakeIdempotencyKeySchema,
    confirmationToken: z.string().min(16).max(2048),
    privacyConsent: z.literal(true),
  })
  .strict();

/** Literal true only. Shared by HTTP/OpenAPI and MCP external submit adapters. */
export const aiIntakeUserApprovedExactPreviewSchema = z.literal(true).describe(
  'Calling software asserts it displayed the exact server-returned preview subject and body and the user explicitly approved sending that exact content. Distinct from privacyConsent. Auditable calling-software attestation, not cryptographic proof. Missing or non-literal true yields 400 APPROVAL_REQUIRED.',
);

export const aiIntakeExternalSubmitRequestSchema = aiIntakeSubmitRequestSchema
  .extend({
    userApprovedExactPreview: aiIntakeUserApprovedExactPreviewSchema,
  })
  .strict();

export const aiIntakeRequirementsQuerySchema = z
  .object({
    locale: aiIntakeLocaleSchema,
    category: aiIntakeCategorySchema.optional(),
  })
  .strict();

export const aiIntakeFieldErrorSchema = z
  .object({
    name: z.string().min(1).max(64),
    reason: aiIntakeFieldErrorReasonSchema,
  })
  .strict();

export const aiIntakeSensitiveFindingSchema = z
  .object({
    kind: aiIntakeSensitiveKindSchema,
    count: z.number().int().positive().max(99),
    severity: z.enum(['reject', 'warning']),
  })
  .strict();

export const aiIntakeErrorBodySchema = z
  .object({
    code: aiIntakeErrorCodeSchema,
    message: z.string().min(1).max(500),
    fields: z.array(aiIntakeFieldErrorSchema).max(16).optional(),
    findings: z.array(aiIntakeSensitiveFindingSchema).max(16).optional(),
    retryAfterSeconds: z.number().int().positive().max(86_400).optional(),
  })
  .strict();

export const aiIntakeErrorResponseSchema = z
  .object({
    ok: z.literal(false),
    error: aiIntakeErrorBodySchema,
  })
  .strict();

export const aiIntakePreviewResponseSchema = z
  .object({
    ok: z.literal(true),
    intakeId: z.string().regex(AI_INTAKE_INTAKE_ID_PATTERN),
    subject: z.string().min(1).max(200),
    body: z.string().min(1).max(12_000),
    digest: z.string().regex(AI_INTAKE_SHA256_HEX_PATTERN),
    findings: z.array(aiIntakeSensitiveFindingSchema).max(16),
    expiresAt: z.string().min(20).max(40),
    confirmationToken: z.string().min(16).max(2048),
    confirmationInstruction: z.string().min(1).max(800),
    requirementsVersion: z.string().min(1).max(80),
  })
  .strict();

export const aiIntakeSubmitResponseSchema = z
  .object({
    ok: z.literal(true),
    intakeId: z.string().regex(AI_INTAKE_INTAKE_ID_PATTERN),
    status: aiIntakeDeliveryStatusSchema,
    duplicate: z.boolean(),
    message: z.string().min(1).max(500),
  })
  .strict();

export const aiIntakeDeliveryUnknownResponseSchema = z
  .object({
    ok: z.literal(false),
    intakeId: z.string().regex(AI_INTAKE_INTAKE_ID_PATTERN).optional(),
    status: z.literal('failed_unknown').optional(),
    duplicate: z.boolean().optional(),
    error: aiIntakeErrorBodySchema,
  })
  .strict();

export const aiIntakeRequirementsCategoryEntrySchema = z
  .object({
    value: aiIntakeCategorySchema,
    label: z.string().min(1).max(80),
    description: z.string().min(1).max(400),
  })
  .strict();

export const aiIntakeRequirementsFieldSpecSchema = z
  .object({
    name: aiIntakeFieldKeySchema,
    required: z.boolean(),
    description: z.string().min(1).max(400),
    maxLength: z.number().int().positive().max(10_000).optional(),
  })
  .strict();

export const aiIntakeRequirementsFieldsGroupSchema = z
  .object({
    required: z.array(aiIntakeRequirementsFieldSpecSchema).min(1).max(16),
    optional: z.array(aiIntakeRequirementsFieldSpecSchema).min(1).max(16),
  })
  .strict();

export const aiIntakeRequirementsSensitiveDataSchema = z
  .object({
    prohibitedKinds: z.array(aiIntakeSensitiveKindSchema).min(1).max(16),
    warning: z.string().min(1).max(2_000),
  })
  .strict();

export const aiIntakeRequirementsNoticesSchema = z
  .object({
    privacy: z.string().min(1).max(2_000),
    aiLimit: z.string().min(1).max(2_000),
    noRepresentation: z.string().min(1).max(2_000),
    emergency: z.string().min(1).max(2_000),
  })
  .strict();

export const aiIntakeRequirementsResponseSchema = z
  .object({
    ok: z.literal(true),
    requirementsVersion: z.string().min(1).max(80),
    locale: aiIntakeLocaleSchema,
    categories: z.array(aiIntakeRequirementsCategoryEntrySchema).min(9).max(9),
    fields: aiIntakeRequirementsFieldsGroupSchema,
    questions: z.array(z.string().min(1).max(800)).min(1).max(32),
    sensitiveData: aiIntakeRequirementsSensitiveDataSchema,
    notices: aiIntakeRequirementsNoticesSchema,
    confirmationInstruction: z.string().min(1).max(800),
    privacyUrl: z.string().min(8).max(300).refine(isAiIntakePublicPrivacyUrl),
  })
  .strict();

export type AiIntakeLocale = SiteLocale;
export type AiIntakeCategory = (typeof AI_INTAKE_CATEGORIES)[number];
export type AiIntakeErrorCode = (typeof AI_INTAKE_ERROR_CODES)[number];
export type AiIntakeSensitiveKind = (typeof AI_INTAKE_SENSITIVE_KINDS)[number];
export type AiIntakeFieldErrorReason = (typeof AI_INTAKE_FIELD_ERROR_REASONS)[number];
export type AiIntakeDeliveryStatus = (typeof AI_INTAKE_DELIVERY_STATUSES)[number];
export type AiIntakeFieldKey = (typeof AI_INTAKE_FIELD_KEYS)[number];
export type AiIntakeFields = z.infer<typeof aiIntakeFieldsSchema>;
export type AiIntakePreviewRequest = z.infer<typeof aiIntakePreviewRequestSchema>;
export type AiIntakeSubmitRequest = z.infer<typeof aiIntakeSubmitRequestSchema>;
export type AiIntakeExternalSubmitRequest = z.infer<typeof aiIntakeExternalSubmitRequestSchema>;

/** Strip the external approval attestation before calling core submit. */
export function stripAiIntakeExternalSubmitRequest(
  request: AiIntakeExternalSubmitRequest,
): AiIntakeSubmitRequest {
  const { userApprovedExactPreview: _userApprovedExactPreview, ...core } = request;
  return core;
}

/**
 * Stable adapter precedence for the two external attestations.
 * Consent is first, including absent values. Approval is second.
 * Returns null when both are literal true; other fields are not inspected.
 */
export function classifyAiIntakeExternalSubmitAttestation(
  value: unknown,
): 'CONSENT_REQUIRED' | 'APPROVAL_REQUIRED' | null {
  const record = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
  if (!record || record.privacyConsent !== true) return 'CONSENT_REQUIRED';
  if (record.userApprovedExactPreview !== true) return 'APPROVAL_REQUIRED';
  return null;
}
export type AiIntakeRequirementsQuery = z.infer<typeof aiIntakeRequirementsQuerySchema>;
export type AiIntakeFieldError = z.infer<typeof aiIntakeFieldErrorSchema>;
export type AiIntakeSensitiveFinding = z.infer<typeof aiIntakeSensitiveFindingSchema>;
export type AiIntakeErrorBody = z.infer<typeof aiIntakeErrorBodySchema>;
export type AiIntakeErrorResponse = z.infer<typeof aiIntakeErrorResponseSchema>;
export type AiIntakePreviewResponse = z.infer<typeof aiIntakePreviewResponseSchema>;
export type AiIntakeSubmitResponse = z.infer<typeof aiIntakeSubmitResponseSchema>;
export type AiIntakeRequirementsCategoryEntry = z.infer<typeof aiIntakeRequirementsCategoryEntrySchema>;
export type AiIntakeRequirementsFieldSpec = z.infer<typeof aiIntakeRequirementsFieldSpecSchema>;
export type AiIntakeRequirementsResponse = z.infer<typeof aiIntakeRequirementsResponseSchema>;

const ALLOWLISTED_FIELD_NAMES = new Set<string>(['body', ...AI_INTAKE_FIELD_KEYS]);

function mapIssueReason(issue: { code: string; input?: unknown }): AiIntakeFieldErrorReason {
  if (issue.code === 'too_small') return 'too_short';
  if (issue.code === 'too_big') return 'too_long';
  if (issue.code === 'unrecognized_keys') return 'unexpected_field';
  if (issue.code === 'invalid_type' && issue.input === undefined) return 'required';
  return 'invalid';
}

function allowlistedFieldName(raw: string): string {
  if (ALLOWLISTED_FIELD_NAMES.has(raw)) return raw;
  return 'body';
}

/** Map Zod failures to bounded field names/reasons. Never includes received values, messages, or internals. */
export function sanitizeZodIssues(error: z.ZodError): AiIntakeFieldError[] {
  const fields: AiIntakeFieldError[] = [];
  for (const issue of error.issues) {
    if (fields.length >= 16) break;
    if (issue.code === 'unrecognized_keys') {
      fields.push({ name: 'body', reason: 'unexpected_field' });
      continue;
    }
    const path = issue.path.map((part) => String(part)).filter(Boolean).join('.');
    const name = allowlistedFieldName(path || 'body');
    fields.push({ name, reason: mapIssueReason(issue) });
  }
  return fields;
}

const REQUIREMENTS_QUERY_KEYS = new Set(['locale', 'category']);

export function parseAiIntakeRequirementsQuery(
  params: URLSearchParams,
): { ok: true; data: AiIntakeRequirementsQuery } | { ok: false } {
  const collected = new Map<string, string[]>();
  for (const [key, value] of params.entries()) {
    if (!REQUIREMENTS_QUERY_KEYS.has(key)) return { ok: false };
    const list = collected.get(key);
    if (list) list.push(value);
    else collected.set(key, [value]);
  }

  const locales = collected.get('locale');
  if (!locales || locales.length !== 1) return { ok: false };
  const localeRaw = locales[0]?.trim() ?? '';
  if (!localeRaw) return { ok: false };

  let category: string | undefined;
  if (collected.has('category')) {
    const categories = collected.get('category') ?? [];
    if (categories.length !== 1) return { ok: false };
    const categoryRaw = categories[0]?.trim() ?? '';
    if (!categoryRaw) return { ok: false };
    category = categoryRaw;
  }

  const parsed = aiIntakeRequirementsQuerySchema.safeParse({
    locale: localeRaw,
    ...(category ? { category } : {}),
  });
  if (!parsed.success) return { ok: false };
  return { ok: true, data: parsed.data };
}
