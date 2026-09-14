import { getContactFormLocalCopy } from './contact-form-copy';
import { planContactFormSubmit } from './submit-adapter';

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type SubmitOutcome =
  | { status: 'blocked'; reason: string; message: string }
  | { status: 'success'; message: string; intakeId: string }
  | { status: 'error'; message: string };

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

export function classifyConsultationResponse(input: {
  kind: 'custom' | 'consultation';
  ok: boolean;
  json: unknown;
  locale: string;
}): SubmitOutcome {
  const copy = getContactFormLocalCopy(input.locale);
  if (input.kind === 'custom') {
    return input.ok
      ? { status: 'success', message: '', intakeId: '' }
      : { status: 'error', message: copy.error };
  }

  const record = asRecord(input.json);
  const intakeId = typeof record?.intakeId === 'string' ? record.intakeId.trim() : '';
  const serverError = typeof record?.error === 'string' ? record.error.trim() : '';
  if (input.ok && record?.success === true && intakeId.length > 0) {
    return {
      status: 'success',
      intakeId,
      message: record.duplicate === true
        ? copy.alreadyReceived(intakeId)
        : copy.sendingConfirmation(intakeId),
    };
  }
  return {
    status: 'error',
    message: serverError || copy.error,
  };
}

export async function submitContactForm(
  input: {
    action: string;
    locale: string;
    sessionId: string;
    enabledFields: string[];
    values: Record<string, string>;
    consentChecked: boolean;
  },
  fetchImpl: FetchLike = fetch,
): Promise<SubmitOutcome> {
  const planned = planContactFormSubmit(input);
  if (planned.kind === 'blocked') {
    return { status: 'blocked', reason: planned.reason, message: planned.message };
  }

  const copy = getContactFormLocalCopy(input.locale);

  try {
    const response = await fetchImpl(input.action, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planned.body),
    });
    const json = await readJson(response);
    return classifyConsultationResponse({
      kind: planned.kind,
      ok: response.ok,
      json,
      locale: input.locale,
    });
  } catch {
    return { status: 'error', message: copy.networkError };
  }
}
