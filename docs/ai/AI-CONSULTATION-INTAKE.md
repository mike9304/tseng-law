# AI consultation intake — Phase 1 HTTP core

Provider-neutral authenticated HTTP API for sending a user-confirmed consultation email to the firm’s server-owned inbox. This phase is the shared core that later MCP/OpenAPI/platform adapters must call. Consumer ChatGPT, Grok, Gemini, or other chats cannot call these endpoints until a later adapter is connected and given a client credential. Phase 1 does not publish those adapters.

This phase does not book calendar appointments, does not create a reservation, and does not invoke an LLM on this server.

## Confirmation sequence

1. `GET /api/ai/intake/requirements?locale={ko|zh-hant|en|ja}&category={optional}` — read intake questions, notices, and field descriptions.
2. Collect the bounded fields. Do not collect transcripts, attachments, file URLs, or identity/financial credentials. Optional opposing or related party **names only** may be placed in `summary`. Do not collect identity numbers.
3. `POST /api/ai/intake/preview` with those fields and a client-generated UUID `idempotencyKey`.
4. Show the returned `subject` and `body` to the user. They are exactly what SMTP will send.
5. Only after the user confirms that displayed content and consents to privacy processing, `POST /api/ai/intake/submit` with the **same fields**, the **same** `idempotencyKey`, the `confirmationToken`, `userApprovedExactPreview: true`, and `privacyConsent: true`. Both HTTP and MCP external submit surfaces require those two separate literal attestations.
6. `userApprovedExactPreview: true` is an auditable calling-software attestation that the exact server-returned preview subject/body was displayed and the user explicitly approved sending that exact content. It is not cryptographic proof of the human action. The confirmation token plus digest remains the server-enforceable content-binding boundary. There is no `userConfirmed` boolean.

## Auth environment names only

Configure these names in the server environment. This document does not include values, example secrets, or key material.

- `AI_INTAKE_CLIENTS` — JSON array of `{ clientId, keySha256 }` (optional bounded `limits` only).
- `AI_INTAKE_HMAC_SECRET` — HMAC secret for confirmation tokens (fail-closed if missing or weak).
- Existing mail transport names: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONSULTATION_NOTIFY_EMAIL` / `NOTIFY_EMAIL`.
- Durable claim backends: explicit `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, or if both of those names are absent/blank the complete `KV_REST_API_URL` + `KV_REST_API_TOKEN` pair; plus `BLOB_READ_WRITE_TOKEN`. An incomplete explicit Upstash pair is rejected even when a complete KV pair exists. The resolver never mixes a URL from one pair with a token from the other, and does not use `KV_REST_API_READ_ONLY_TOKEN`, `REDIS_URL`, or `KV_URL`.
- Production submit rate limiting requires a resolved Redis REST pair as above. There is no Blob or process-memory fallback for submit rate limits in production.

Clients authenticate with `Authorization: Bearer <secret>` only. Origin/Referer is not authentication. Browser CSRF validation is not used on this API.

## Canonical digest

UTF-8 SHA-256 over:

```
ai-intake-canonical-v1
<subject>
<body>
```

The separator is a single LF (`\n`). `ai-intake-canonical-v1` is the serialization version. Subject is server-generated and contains no CR/LF. The SMTP call uses that exact subject and exact plain-text body. HTML is only an escaped presentation of the same body.

## Confirmation token

HMAC-SHA256 over a base64url canonical JSON payload. Payload fields: `v`, `digest`, `intakeId`, `clientId`, `idempotencyKeyHash`, `jti`, `requirementsVersion`, `iat`, `exp`. No PII, body, or email. TTL is 10 minutes with 30 seconds of documented clock skew.

## Error codes

| Code | Typical HTTP |
| --- | --- |
| `UNAUTHENTICATED` | 401 |
| `INVALID_REQUEST` | 400 |
| `CONSENT_REQUIRED` | 400 |
| `APPROVAL_REQUIRED` | 400 |
| `TOKEN_INVALID` | 400 |
| `TOKEN_EXPIRED` | 400 |
| `SENSITIVE_DATA_REJECTED` | 422 |
| `PREVIEW_MISMATCH` | 409 |
| `IDEMPOTENCY_CONFLICT` | 409 |
| `RATE_LIMITED` | 429 |
| `DELIVERY_UNKNOWN` | 502 |
| `BACKEND_UNAVAILABLE` | 503 |
| `CONFIG_UNAVAILABLE` | 503 |

Responses never include stack traces, config values, provider error text, recipient configuration, or raw detected sensitive values. Field errors are bounded names and reasons only. Unknown JSON keys are reported as `body` / `unexpected_field` and never reflect the received key.

## Privacy boundary

Initial intake is limited to identity/company, contact, category, a short factual summary, optional opposing or related party **names only** in `summary` for later conflict screening, residence, preferred language/contact/time, and document *types* (not contents or uploads). This intake never requests identity numbers. Korean resident-registration numbers, Taiwan national IDs, payment cards (Luhn), IBANs, and clearly labelled bank/passport/identity sequences are rejected. URLs are warnings and remain untrusted plain text; the server does not fetch them.

The flow does not create an attorney-client relationship and does not promise confidentiality, a response time, or a legal outcome. Emergencies should use local emergency services or authorities; this API does not invent jurisdiction-specific numbers. This is consultation email intake, not a calendar reservation.

## Delivery and idempotency (honest guarantee)

- One accepted send attempt per `(clientId, idempotencyKey)` **within the 30-day claim-retention window**. After a claim expires, a new operation requires a fresh preview, a fresh UUID idempotency key, and explicit user approval. Deduplication is not perpetual and is not exactly-once delivery.
- The preview token binds that idempotency key, so token replay is covered by the same claim while that claim remains unexpired.
- When a durable claim already exists for the key, submit resolves sent, in-flight, failed-unknown, stale-sending, and digest-conflict outcomes from that record **before** SMTP configuration is read or a transporter is created. A missing key validates and prepares mail first, then takes the atomic claim, so a bad mail config cannot poison a fresh key. Only an acquired claim performs the single SMTP attempt. This depends on the configured durable claim backend being available. A timeout after SMTP accepted DATA is ambiguous and does not trigger a retry. Definite success still requires a message ID.
- Duplicate `sent`: HTTP 200, `duplicate:true`, no second send.
- Fresh duplicate `sending`: HTTP 202 in-flight, `duplicate:true`, no second send.
- Duplicate `failed_unknown`: HTTP 502 `DELIVERY_UNKNOWN`, `duplicate:true`, no resend.
- Stale duplicate `sending`: never resend; HTTP 502 `DELIVERY_UNKNOWN`, `duplicate:true`. The server best-effort atomically marks the claim `failed_unknown`. If that state write is unavailable or conflicted, the HTTP response remains delivery-unknown and **storage may remain `sending`**.
- Same key + different digest is `409 IDEMPOTENCY_CONFLICT`, never a benign duplicate.
- This is **not** exactly-once SMTP. A durable claim/outbox does not make SMTP exactly-once. If SMTP or the post-send state update is ambiguous, the record is `failed_unknown` (or may remain `sending` if the update cannot be stored) and **replay does not resend**.
- Recovery after ambiguous or stale state requires a new preview, a new idempotency key, and another explicit user confirmation. There is no automatic resend.
- After SMTP reports success, a lost `sent` state write may be retried **once**. That retry is state-only and never sends mail again. If the retry still cannot confirm `sent`, the HTTP result is `DELIVERY_UNKNOWN` and storage may remain `sending`.
- Production submit rate limiting is **Upstash-only**. If the atomic Redis/Upstash backend is missing or fails, submit returns backend-unavailable and does not send mail. There is no Blob or process-memory fallback for submit rate limits.
- Durable claim storage prefers Upstash, then private Blob with ETag conditional writes. Production never falls back to process-local memory for claims. If neither Upstash nor private Blob can take a durable claim, submit fails closed with 503 before SMTP.
- Blob claim expiry is logical (`createdAt` TTL) plus ETag replacement and best-effort cleanup. Blob does not provide native key TTL.

## Phase 2

Local adapter and help-page code now exist. They call this Phase 1 core in process and do not send mail themselves.

- Help pages: `/ko/ai-intake`, `/zh-hant/ai-intake`, `/en/ai-intake`, `/ja/ai-intake`
- OpenAPI: `/api/ai/openapi.json`
- MCP: `/api/ai/mcp`
- Ops notes: `docs/ai/AI-CONSULTATION-INTAKE-PHASE2.md`

Consumer ChatGPT, Grok, and Gemini are not connected yet. Deployment, server configuration, a client credential, provider connection, and where applicable platform review or OAuth remain separately authorized work. This document does not claim those consumer products can already use the API.
