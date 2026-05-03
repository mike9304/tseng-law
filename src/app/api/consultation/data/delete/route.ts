import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireConsultationAdminAuth } from '@/lib/consultation/admin/auth';
import {
  appendConsultationLogLine,
  deleteConsultationLogRecordsBySession,
} from '@/lib/consultation/log-storage';

export const runtime = 'nodejs';

/**
 * POST /api/consultation/data/delete
 * Body: { sessionId: string }
 *
 * Wave 10 (PDPA compliance) — "right to erasure". Rewrites each day
 * blob to exclude records matching the given sessionId. In practice
 * this is expensive (read-modify-write per day blob) but PDPA delete
 * requests are rare and the correctness guarantee matters more than
 * latency.
 *
 * After erasure, appends a `data_deleted` audit event so the
 * operator dashboard can track deletion requests.
 */
export async function POST(request: NextRequest) {
  const auth = requireConsultationAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  let body: { sessionId?: string };
  try {
    body = (await request.json()) as { sessionId?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  if (!sessionId || sessionId.length > 200) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  const deletion = await deleteConsultationLogRecordsBySession(sessionId);
  const sessionHash = crypto.createHash('sha256').update(sessionId).digest('hex').slice(0, 16);

  // Audit trail: log that a deletion was requested
  try {
    await appendConsultationLogLine(
      'events',
      new Date().toISOString().slice(0, 10),
      JSON.stringify({
        timestamp: new Date().toISOString(),
        eventType: 'data_deleted',
        sessionId: `deleted:${sessionHash}`,
        targetSessionHash: sessionHash,
        recordsDeleted: deletion.totalRemoved,
        rewrittenDays: deletion.rewrittenDays,
        deletedBy: auth.username,
      }),
    );
  } catch (error) {
    console.error('[data-delete] audit log failed:', error);
  }

  return NextResponse.json({
    success: true,
    sessionId,
    recordsDeleted: deletion.totalRemoved,
    rewrittenDays: deletion.rewrittenDays,
    note: deletion.totalRemoved > 0
      ? 'Matching consultation event and feedback records were deleted from the log backend.'
      : 'No records found for this session.',
    deletedAt: new Date().toISOString(),
  });
}
