# AI consultation intake — Phase 2 adapters

Status: local endpoint and help-page code only. No live deploy, no live SMTP, no consumer-provider registration, and no OAuth publication happened in this phase.

## Environment variable names

Configure names only. This document does not include values, example secrets, or key material.

Phase 1 names remain required for actual send:

- `AI_INTAKE_CLIENTS`
- `AI_INTAKE_HMAC_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `CONSULTATION_NOTIFY_EMAIL` / `NOTIFY_EMAIL`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `BLOB_READ_WRITE_TOKEN`
- `NEXT_PUBLIC_SITE_URL` / `SITE_URL`

Phase 2 adapter name:

- `AI_INTAKE_MCP_ALLOWED_HOSTS` — comma-separated exact hostnames (no scheme, no port, no `*.vercel.app` wildcard). Required. Missing, blank, invalid, wildcard, or oversized values fail closed and do not enable a hardcoded public hostname. Once this explicit nonempty exact list is valid, it may be combined with the hostname from `NEXT_PUBLIC_SITE_URL` or `SITE_URL` when those are set, and with an exact current-deployment hostname from `VERCEL_URL` / `VERCEL_PROJECT_PRODUCTION_URL` when that platform value is set.

## Machine endpoints

- MCP Streamable HTTP: `/api/ai/mcp` (Node runtime, per-request/stateless). Official `@modelcontextprotocol/server@2.0.0` serves 2026-07-28 plus default 2025-era stateless fallback.
- OpenAPI 3.1: `GET /api/ai/openapi.json`
- Help pages: `/[locale]/ai-intake` for `ko`, `zh-hant`, `en`, `ja`

## Tools

Exactly three MCP tools, which call Phase 1 `buildRequirementsPayload`, `previewAiIntake`, and `submitAiIntake` in process:

1. `get_consultation_intake_requirements`
2. `preview_consultation_email`
3. `submit_consultation_email` — requires the same external `userApprovedExactPreview: true` as HTTP/OpenAPI submit, in addition to `privacyConsent: true`

There is no generic proxy, browser, or email-compose tool. Adapters must not import nodemailer or construct SMTP options.

## Connection steps (high level)

1. Deploy the site with the Phase 1 mail and auth names configured.
2. Set `AI_INTAKE_MCP_ALLOWED_HOSTS` to the exact public hostname(s).
3. Issue a client credential into `AI_INTAKE_CLIENTS`.
4. Point a hosted MCP or OpenAPI client at `/api/ai/mcp` or `/api/ai/openapi.json` with `Authorization: Bearer`.
5. Keep the requirements → preview → display exact subject/body → explicit user approval → submit sequence.

Provider-specific setup, separate credential attribution, tool allowlists, and production release gates are documented in `docs/ai/AI-CONSULTATION-INTAKE-PROVIDERS.md`.

## Provider limitations

- The server cannot cryptographically observe a natural-language chat utterance. `userApprovedExactPreview` is a provider-neutral, auditable calling-software attestation common to HTTP/OpenAPI and MCP external submits, not cryptographic proof of the user’s words. The signed token/digest remains the server-enforceable content-binding boundary.
- Consumer ChatGPT Apps, Grok custom/remote MCP, and Gemini/developer function-calling are not connected merely because this code exists.
- Platform review, OAuth, app-store listing, and provider-side publication are future separately authorized work.

## Residual trust

Submit still sends only after Phase 1 token, digest, consent, durable claim, and Upstash-only production rate-limit checks. Replay of the same idempotency key does not send again. This is not exactly-once SMTP.
