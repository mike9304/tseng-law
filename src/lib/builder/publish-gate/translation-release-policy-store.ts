import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { get, put } from '@vercel/blob';
import { z } from 'zod';
import {
  isBuilderRoleNameValue,
  type BuilderRoleName,
} from '@/lib/builder/security/user-role-store';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';

export const TRANSLATION_RELEASE_POLICY_MODES = [
  'acknowledge-other-page-warnings',
  'block-other-page-warnings',
] as const;

export type TranslationReleasePolicyMode = (typeof TRANSLATION_RELEASE_POLICY_MODES)[number];

export interface TranslationReleasePolicy {
  readonly siteId: string;
  readonly mode: TranslationReleasePolicyMode;
  readonly approvalRequiredForRoles: readonly BuilderRoleName[];
  readonly updatedAt: string;
  readonly updatedBy?: string;
}

export interface TranslationReleasePolicyWriteInput {
  readonly mode: TranslationReleasePolicyMode;
  readonly approvalRequiredForRoles?: readonly BuilderRoleName[];
  readonly updatedBy?: string;
}

const builderRoleNameSchema: z.ZodType<BuilderRoleName> = z.custom<BuilderRoleName>(
  isBuilderRoleNameValue,
  'Invalid builder role.',
);

export const translationReleasePolicyPayloadSchema = z.object({
  mode: z.enum(TRANSLATION_RELEASE_POLICY_MODES),
  approvalRequiredForRoles: z.array(builderRoleNameSchema).max(5).optional(),
}).strict();

const storedTranslationReleasePolicySchema = z.object({
  siteId: z.string().trim().min(1).max(120),
  mode: z.enum(TRANSLATION_RELEASE_POLICY_MODES),
  approvalRequiredForRoles: z.array(builderRoleNameSchema).max(5).default([]),
  updatedAt: z.string().trim().min(1).max(80),
  updatedBy: z.string().trim().min(1).max(120).optional(),
}).strict();

const BLOB_PREFIX = 'builder-translation-release-policy';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
  if (process.env.BUILDER_SITE_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

function localRoot(): string {
  return process.env.BUILDER_TRANSLATION_RELEASE_POLICY_ROOT
    || path.join(process.cwd(), 'runtime-data', 'builder-translation-release-policy');
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9_.-]/g, '_') || 'default';
}

function blobPath(siteId: string): string {
  return `${BLOB_PREFIX}/${safeSegment(siteId)}.json`;
}

function localPath(siteId: string): string {
  return path.join(localRoot(), `${safeSegment(siteId)}.json`);
}

function defaultPolicy(siteId: string): TranslationReleasePolicy {
  return {
    siteId,
    mode: 'acknowledge-other-page-warnings',
    approvalRequiredForRoles: [],
    updatedAt: new Date(0).toISOString(),
  };
}

function parseStoredPolicy(siteId: string, raw: string): TranslationReleasePolicy {
  const parsed = storedTranslationReleasePolicySchema.safeParse(JSON.parse(raw));
  if (!parsed.success) return defaultPolicy(siteId);
  return parsed.data;
}

async function readRawPolicy(siteId: string): Promise<string | null> {
  if (isBlobBackend()) {
    try {
      const result = await get(blobPath(siteId), { access: 'private', useCache: false });
      if (!result?.stream || result.statusCode !== 200) return null;
      return new Response(result.stream).text();
    } catch (error) {
      if (error instanceof Error) return null;
      throw error;
    }
  }

  try {
    return await readFile(localPath(siteId), 'utf8');
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}

export async function readTranslationReleasePolicy(siteId: string): Promise<TranslationReleasePolicy> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  const raw = await readRawPolicy(normalizedSiteId);
  if (!raw) return defaultPolicy(normalizedSiteId);
  return parseStoredPolicy(normalizedSiteId, raw);
}

export async function writeTranslationReleasePolicy(
  siteId: string,
  input: TranslationReleasePolicyWriteInput,
): Promise<TranslationReleasePolicy> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  const policy: TranslationReleasePolicy = {
    siteId: normalizedSiteId,
    mode: input.mode,
    approvalRequiredForRoles: input.approvalRequiredForRoles ?? [],
    updatedAt: new Date().toISOString(),
    ...(input.updatedBy ? { updatedBy: input.updatedBy } : {}),
  };
  const body = JSON.stringify(policy, null, 2);
  if (isBlobBackend()) {
    await put(blobPath(normalizedSiteId), body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return policy;
  }
  const file = localPath(normalizedSiteId);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body, 'utf8');
  return policy;
}
