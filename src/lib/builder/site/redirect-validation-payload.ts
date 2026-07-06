import type { RedirectValidationError } from './redirects';

export interface RedirectValidationErrorPayload extends Record<string, unknown> {
  readonly field: RedirectValidationError['field'];
  readonly diagnostic?: RedirectValidationError['diagnostic'];
}

export function getRedirectValidationErrorPayload(
  error: RedirectValidationError,
): RedirectValidationErrorPayload {
  if (error.diagnostic) {
    return {
      field: error.field,
      diagnostic: error.diagnostic,
    };
  }
  return { field: error.field };
}
