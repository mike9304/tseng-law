export const FORBIDDEN_KEYS = new Set([
  'body',
  'rawBody',
  'request',
  'response',
  'authorization',
  'cookie',
  'password',
  'token',
  'apiKey',
  'submission',
  'formValue',
  'webhook',
  'webhookUrl',
  'fileBytes',
  'imageBytes',
]);

export function assertNoForbiddenKeys(value: unknown): void {
  visitAuditValue(value, new Set(), []);
}

function visitAuditValue(value: unknown, seen: Set<object>, path: string[]): void {
  if (!value || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((entry, index) => visitAuditValue(entry, seen, [...path, String(index)]));
    return;
  }

  for (const [key, entry] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase();
    for (const forbiddenKey of FORBIDDEN_KEYS) {
      if (normalizedKey === forbiddenKey.toLowerCase()) {
        const dottedPath = [...path, key].join('.');
        throw new Error(`Audit event contains forbidden key: ${dottedPath}`);
      }
    }
    visitAuditValue(entry, seen, [...path, key]);
  }
}
