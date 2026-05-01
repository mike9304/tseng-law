import { mkdir, readFile, appendFile } from 'fs/promises';
import path from 'path';
import { parseAuditEvent, type AuditEvent } from '@/lib/builder/audit/types';

export function resolveAuditLogPath(): string {
  return process.env.BUILDER_AUDIT_LOG_PATH
    ?? path.join(process.cwd(), 'data', 'audit', 'builder-audit.jsonl');
}

export async function writeAuditEvent(event: AuditEvent): Promise<void> {
  const parsed = parseAuditEvent(event);
  const auditLogPath = resolveAuditLogPath();

  try {
    await mkdir(path.dirname(auditLogPath), { recursive: true, mode: 0o700 });
    await appendFile(auditLogPath, `${JSON.stringify(parsed)}\n`, { encoding: 'utf8', mode: 0o600 });
  } catch (error) {
    console.warn('[builder-audit] failed to append audit event', {
      type: parsed.type,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function readRecentAuditEvents(limit = 200): Promise<AuditEvent[]> {
  const normalizedLimit = Math.max(1, Math.min(500, Math.trunc(limit)));

  let content: string;
  try {
    content = await readFile(resolveAuditLogPath(), 'utf8');
  } catch (error) {
    if (isNodeNotFoundError(error)) return [];
    throw error;
  }

  const lines = content.split('\n').filter(Boolean).slice(-normalizedLimit);
  const events: AuditEvent[] = [];

  for (const line of lines) {
    try {
      events.push(parseAuditEvent(JSON.parse(line) as unknown));
    } catch {
      // Skip corrupt or policy-violating lines instead of exposing them.
    }
  }

  return events;
}

function isNodeNotFoundError(error: unknown): boolean {
  return (
    Boolean(error) &&
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === 'ENOENT'
  );
}
