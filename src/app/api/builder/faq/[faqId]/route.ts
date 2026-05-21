import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteFaqItem,
  loadFaqItem,
  saveFaqItem,
  validateFaqItem,
} from '@/lib/builder/faq/faq-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  question: z.string().trim().min(1).max(500).optional(),
  answer: z.string().trim().min(1).max(5000).optional(),
  categoryId: z.string().trim().min(1).max(120).optional(),
  tags: z.array(z.string().trim().max(60)).max(20).optional(),
  status: z.enum(['draft', 'published']).optional(),
  sortOrder: z.coerce.number().int().min(0).max(100000).optional(),
  schemaEnabled: z.boolean().optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest, { params }: { params: { faqId: string } }) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const item = await loadFaqItem(params.faqId);
  if (!item) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}

export async function PATCH(request: NextRequest, { params }: { params: { faqId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const item = await loadFaqItem(params.faqId);
    if (!item) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    const patch = patchSchema.parse(await request.json());
    const saved = await saveFaqItem({ ...item, ...patch });
    const errors = validateFaqItem(saved);
    if (errors.length > 0) {
      return NextResponse.json({ ok: false, error: 'validation_error', errors }, { status: 400 });
    }
    return NextResponse.json({ ok: true, item: saved });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    console.error('[builder/faq/:faqId] PATCH failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { faqId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  await deleteFaqItem(params.faqId);
  return NextResponse.json({ ok: true });
}
