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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const promptSelectionRequestSchema = z.union([
  siteSpecSchema,
  z.object({
    spec: siteSpecSchema,
    promptVersion: z.string().trim().max(120).optional(),
  }),
]);

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
  if (cached) {
    return NextResponse.json({ ok: true, cached: true, draft: cached });
  }
  const draft = await generateSiteDraft(spec, { promptVersion });
  writeDraftCache(spec, draft);
  return NextResponse.json({ ok: true, cached: false, draft });
}
