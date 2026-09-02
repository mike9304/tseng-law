import { NextRequest, NextResponse } from 'next/server';

import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { buildDailySummary } from '@/lib/metrics/visit-rollup';
import {
  deleteRawBatches,
  listRawBatchKeys,
  listRawDays,
  readRawBatch,
  saveDailyRollup,
} from '@/lib/metrics/visit-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RollupError {
  day: string;
  error: string;
}

function isValidDay(day: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(`${day}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === day;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function run(request: NextRequest): Promise<NextResponse> {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const requestedDay = request.nextUrl.searchParams.get('day');
  if (requestedDay !== null && !isValidDay(requestedDay)) {
    return NextResponse.json({ ok: false, error: 'Invalid day' }, { status: 400 });
  }

  let days: string[];
  if (requestedDay !== null) {
    days = [requestedDay];
  } else {
    try {
      const today = new Date().toISOString().slice(0, 10);
      days = (await listRawDays())
        .filter((day) => day < today)
        .sort()
        .slice(0, 7);
    } catch (error) {
      return NextResponse.json({
        ok: false,
        processed: [],
        errors: [{ day: '', error: errorMessage(error) }],
      }, { status: 500 });
    }
  }

  const processed: Array<{ day: string; events: number; batches: number }> = [];
  const errors: RollupError[] = [];

  for (const day of days) {
    try {
      const keys = await listRawBatchKeys(day);
      if (keys.length === 0) {
        processed.push({ day, events: 0, batches: 0 });
        continue;
      }
      const events = (await Promise.all(keys.map((key) => readRawBatch(key)))).flat();
      const summary = buildDailySummary(day, events);

      await saveDailyRollup(day, events, summary);
      await deleteRawBatches(keys);

      processed.push({ day, events: events.length, batches: keys.length });
    } catch (error) {
      errors.push({ day, error: errorMessage(error) });
    }
  }

  return NextResponse.json({ ok: errors.length === 0, processed, errors });
}

export async function GET(request: NextRequest) {
  return run(request);
}

export async function POST(request: NextRequest) {
  return run(request);
}
