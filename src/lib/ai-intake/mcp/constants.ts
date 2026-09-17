export const AI_INTAKE_MCP_ALLOWED_HOSTS_ENV = 'AI_INTAKE_MCP_ALLOWED_HOSTS';

export const AI_INTAKE_MCP_SERVER_NAME = 'tseng-law-ai-intake';
export const AI_INTAKE_MCP_SERVER_VERSION = '1.0.0';

export const AI_INTAKE_MCP_TOOL_NAMES = [
  'get_consultation_intake_requirements',
  'preview_consultation_email',
  'submit_consultation_email',
] as const;

export type AiIntakeMcpToolName = (typeof AI_INTAKE_MCP_TOOL_NAMES)[number];

export const AI_INTAKE_MCP_REQUIREMENTS_DESCRIPTION =
  'Read localized consultation intake requirements and the bounded questions the AI may ask. Call this first. Ask only those initial bounded questions. Do not request national ID, passport, bank, card, uploads, document contents, or file URLs.';

export const AI_INTAKE_MCP_PREVIEW_DESCRIPTION =
  'Create a server-owned consultation email preview. Display the exact returned subject and body to the user. Do not submit yet. Do not send mail yourself. Delivery is an email to the firm inbox, not a calendar reservation.';

export const AI_INTAKE_MCP_SUBMIT_DESCRIPTION =
  'Send the previously previewed consultation email to the firm inbox. Call only after the user explicitly approves that exact subject and body from preview and consents to privacy processing. userApprovedExactPreview must be literal true (400 APPROVAL_REQUIRED if missing). Distinct from privacyConsent. Auditable calling-software attestation, not cryptographic proof. Not a calendar appointment.';

export const AI_INTAKE_MCP_PREVIEW_RESULT_INSTRUCTION =
  'Show the user this exact subject and body before any submit. Do not call submit_consultation_email until the user explicitly approves this exact content and privacy processing.';
