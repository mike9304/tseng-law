import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { readNativeBlogAdminModel } from '@/lib/builder/blog/admin-storage';
import { columnLocaleSchema } from '@/lib/builder/columns/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = columnLocaleSchema.parse(request.nextUrl.searchParams.get('locale') ?? 'ko');
    const model = await readNativeBlogAdminModel(locale);
    return NextResponse.json({ ok: true, model });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: 'validation_error', issues: error.flatten() },
        { status: 400 },
      );
    }
    console.error('[builder/blog/admin] GET failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}
