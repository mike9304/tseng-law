import { NextRequest, NextResponse } from 'next/server';
import { requireConsultationAdminAuth } from '@/lib/consultation/admin/auth';
import { normalizeLocale } from '@/lib/locales';
import type { ConsultationCategory } from '@/lib/consultation/types';
import {
  archiveAttorneyKnowledgeEntry,
  readAttorneyKnowledgeEntries,
  saveAttorneyKnowledgeEntry,
} from '@/lib/consultation/attorney-knowledge';

export const runtime = 'nodejs';

const VALID_CATEGORIES: ConsultationCategory[] = [
  'company_setup',
  'traffic_accident',
  'criminal_investigation',
  'labor',
  'divorce_family',
  'inheritance',
  'logistics',
  'cosmetics',
  'general',
  'unknown',
];

function normalizeCategory(value: FormDataEntryValue | string | null): ConsultationCategory {
  const raw = typeof value === 'string' ? value : '';
  return VALID_CATEGORIES.includes(raw as ConsultationCategory)
    ? raw as ConsultationCategory
    : 'general';
}

function redirectBack(request: NextRequest, status: string): NextResponse {
  const referer = request.headers.get('referer') || `/${normalizeLocale('ko')}/admin-consultation`;
  const url = new URL(referer);
  url.searchParams.set('knowledge', status);
  return NextResponse.redirect(url, { status: 303 });
}

export async function GET(request: NextRequest) {
  const auth = requireConsultationAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const entries = await readAttorneyKnowledgeEntries();
  return NextResponse.json({
    success: true,
    count: entries.length,
    entries,
  });
}

export async function POST(request: NextRequest) {
  const auth = requireConsultationAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const contentType = request.headers.get('content-type') || '';
  const wantsJson = contentType.includes('application/json');

  try {
    if (wantsJson) {
      const body = await request.json() as {
        action?: string;
        id?: string;
        locale?: string;
        category?: string;
        question?: string;
        answer?: string;
        keywords?: string[] | string;
        reviewedBy?: string;
        sourceNote?: string;
      };
      if (body.action === 'archive' && body.id) {
        await archiveAttorneyKnowledgeEntry(body.id);
        return NextResponse.json({ success: true, archived: body.id });
      }
      if (!body.question?.trim() || !body.answer?.trim()) {
        return NextResponse.json({ success: false, error: 'question_and_answer_required' }, { status: 400 });
      }
      const entry = await saveAttorneyKnowledgeEntry({
        id: body.id,
        locale: normalizeLocale(body.locale),
        category: normalizeCategory(body.category ?? null),
        question: body.question,
        answer: body.answer,
        keywords: body.keywords,
        reviewedBy: body.reviewedBy || auth.username,
        sourceNote: body.sourceNote,
      });
      return NextResponse.json({ success: true, entry });
    }

    const form = await request.formData();
    const action = String(form.get('action') || 'upsert');
    const id = String(form.get('id') || '').trim();
    if (action === 'archive' && id) {
      await archiveAttorneyKnowledgeEntry(id);
      return redirectBack(request, 'archived');
    }

    const question = String(form.get('question') || '').trim();
    const answer = String(form.get('answer') || '').trim();
    if (!question || !answer) {
      return redirectBack(request, 'missing');
    }

    await saveAttorneyKnowledgeEntry({
      id: id || undefined,
      locale: normalizeLocale(String(form.get('locale') || 'ko')),
      category: normalizeCategory(form.get('category')),
      question,
      answer,
      keywords: String(form.get('keywords') || ''),
      reviewedBy: String(form.get('reviewedBy') || auth.username),
      sourceNote: String(form.get('sourceNote') || ''),
    });
    return redirectBack(request, 'saved');
  } catch (error) {
    console.error('[consultation knowledge] save failed:', error);
    if (wantsJson) {
      return NextResponse.json({ success: false, error: 'knowledge_save_failed' }, { status: 500 });
    }
    return redirectBack(request, 'error');
  }
}
