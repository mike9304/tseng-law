import { NextRequest, NextResponse } from 'next/server';
import { requireConsultationAdminAuth } from '@/lib/consultation/admin/auth';
import { readConsultationLogLines, type LogKind } from '@/lib/consultation/log-storage';

export const runtime = 'nodejs';

/**
 * GET /api/consultation/data/export?sessionId=xxx
 *
 * Wave 10 (PDPA compliance) — exports all consultation events and
 * feedback for a specific session. Returns a JSON array of raw JSONL
 * records so the data subject (or the operator on their behalf) can
 * verify what data is held.
 *
 * Protected by route-level Basic Auth because middleware excludes
 * /api paths. The caller must provide credentials via Authorization
 * header.
 */
export async function GET(request: NextRequest) {
  const auth = requireConsultationAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId || sessionId.length > 200) {
    return NextResponse.json({ error: 'sessionId query param required' }, { status: 400 });
  }

  const windowStartTs = 0;
  const kinds: LogKind[] = ['events', 'feedback'];
  const allLines: unknown[] = [];

  for (const kind of kinds) {
    const lines = await readConsultationLogLines(kind, windowStartTs);
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line) as { sessionId?: string };
        if (parsed.sessionId === sessionId) {
          allLines.push(parsed);
        }
      } catch {
        // skip malformed
      }
    }
  }

  return NextResponse.json({
    sessionId,
    recordCount: allLines.length,
    records: allLines,
    exportedAt: new Date().toISOString(),
  });
}
