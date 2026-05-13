export const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])',
].join(',');

function readPageErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;
  const body = payload as {
    error?: unknown;
    message?: unknown;
    issues?: unknown;
    validation?: unknown;
  };

  if (body.error === 'duplicate_slug') {
    return '같은 locale 안에 동일한 slug를 쓰는 페이지가 있습니다.';
  }

  const issueSource = Array.isArray(body.issues)
    ? body.issues
    : Array.isArray(body.validation)
      ? body.validation
      : [];
  const firstIssue = issueSource.find((issue): issue is { message?: unknown; fixHint?: unknown; field?: unknown } => (
    Boolean(issue) && typeof issue === 'object'
  ));
  if (firstIssue) {
    if (typeof firstIssue.message === 'string' && firstIssue.message.trim()) {
      return firstIssue.message;
    }
    if (typeof firstIssue.fixHint === 'string' && firstIssue.fixHint.trim()) {
      return firstIssue.fixHint;
    }
  }

  if (typeof body.message === 'string' && body.message.trim()) return body.message;
  if (typeof body.error === 'string' && body.error.trim()) return body.error;
  return fallback;
}

export async function readPageResponseError(response: Response, fallback: string): Promise<string> {
  const payload = await response.json().catch(() => null) as unknown;
  return readPageErrorMessage(payload, fallback);
}
