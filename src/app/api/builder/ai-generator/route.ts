import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { siteSpecSchema } from '@/lib/builder/ai-generator/site-spec';
import {
  generateSiteDraft,
  isSupportedAiGeneratorPromptVersion,
  resolveAiGeneratorPromptVersion,
} from '@/lib/builder/ai-generator/orchestrator';
import {
  readDraftCache,
  writeDraftCache,
} from '@/lib/builder/ai-generator/cache';
import {
  appendAiIntakeVersion,
  normalizeAiIntakeSiteId,
} from '@/lib/builder/ai-generator/intake-versions-store';
import type { GeneratedSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import type { SiteSpec } from '@/lib/builder/ai-generator/site-spec';
import {
  isAiContentGenerationError,
  isProviderGeneratedSiteContent,
} from '@/lib/builder/ai-generator/content-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const promptSelectionRequestSchema = z.union([
  siteSpecSchema,
  z.object({
    spec: siteSpecSchema,
    promptVersion: z.string().trim().max(120).optional(),
  }),
]);

interface RecordGeneratedDraftInput {
  request: NextRequest;
  createdBy: string;
  spec: SiteSpec;
  draft: GeneratedSiteDraft;
  promptVersion: string;
}

interface RecordGeneratedDraftResult {
  versionId?: string;
  versionWarning?: 'server_version_record_failed';
}

async function recordGeneratedDraftVersion(input: RecordGeneratedDraftInput): Promise<RecordGeneratedDraftResult> {
  const siteId = normalizeAiIntakeSiteId(input.request.nextUrl.searchParams.get('siteId') ?? undefined);
  try {
    const version = await appendAiIntakeVersion({
      siteId,
      createdBy: input.createdBy,
      spec: input.spec,
      draft: input.draft,
      promptVersion: input.promptVersion,
    });
    return { versionId: version.id };
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    console.warn(`[ai-generator] Failed to record intake version for ${siteId}: ${error.message}`);
    return { versionWarning: 'server_version_record_failed' };
  }
}

function generationFailureResponse(error: unknown): NextResponse | null {
  if (!isAiContentGenerationError(error)) return null;
  return NextResponse.json({
    ok: false,
    error: error.code,
    message: error.message,
  }, { status: error.httpStatus });
}

function localDemoFailureResponse(): NextResponse {
  return NextResponse.json({
    ok: false,
    error: 'ai_content_local_demo_only',
    message: 'Local demo content cannot be used as generated site content.',
    source: 'local-demo',
    stub: true,
  }, { status: 503 });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = promptSelectionRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid site spec', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }
  const spec = 'spec' in parsed.data ? parsed.data.spec : parsed.data;
  const promptVersion = 'spec' in parsed.data
    ? resolveAiGeneratorPromptVersion(parsed.data.promptVersion)
    : resolveAiGeneratorPromptVersion();
  if ('spec' in parsed.data && parsed.data.promptVersion && !isSupportedAiGeneratorPromptVersion(parsed.data.promptVersion)) {
    return NextResponse.json({
      error: 'unsupported_prompt_version',
      message: 'Selected AI generator prompt version is not available.',
    }, { status: 400 });
  }

  const cached = readDraftCache(spec, promptVersion);
  if (cached && isProviderGeneratedSiteContent(cached.content)) {
    const versionResult = await recordGeneratedDraftVersion({
      request,
      createdBy: auth.username,
      spec,
      draft: cached,
      promptVersion,
    });
    return NextResponse.json({ ok: true, cached: true, ...versionResult, draft: cached });
  }
  let draft: GeneratedSiteDraft;
  try {
    draft = await generateSiteDraft(spec, { promptVersion });
  } catch (error) {
    const failure = generationFailureResponse(error);
    if (failure) return failure;
    throw error;
  }
  if (!isProviderGeneratedSiteContent(draft.content)) {
    return localDemoFailureResponse();
  }
  writeDraftCache(spec, draft);
  const versionResult = await recordGeneratedDraftVersion({
    request,
    createdBy: auth.username,
    spec,
    draft,
    promptVersion,
  });
  return NextResponse.json({ ok: true, cached: false, ...versionResult, draft });
}
