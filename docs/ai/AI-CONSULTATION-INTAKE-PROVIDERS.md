# AI consultation intake — provider connection contract

Status: documented operator kit for a configured inquiry path. This document does not claim a live deployment, a registered consumer app, working SMTP, a completed provider review, inbox delivery, or organic U.S./Japan acquisition. English and Japanese preparation exists so an operator can configure an actual inquiry, not so that ChatGPT, Grok, or Gemini can be said to recommend the firm.

Paste-ready EN/JA agent instructions: [`AI-CONSULTATION-INTAKE-AGENT-INSTRUCTIONS.md`](./AI-CONSULTATION-INTAKE-AGENT-INSTRUCTIONS.md).

The firm server exposes one email-intake workflow through two compatible surfaces. The server implements all three operations. Do not treat a server boolean as proof that a human approved the email.

- OpenAPI 3.1: `/api/ai/openapi.json`
- MCP Streamable HTTP: `/api/ai/mcp`

1. `get_consultation_intake_requirements`
2. `preview_consultation_email`
3. `submit_consultation_email` (consequential; email to the firm inbox, not a calendar booking)

Until a controlled client is approved for send, advertise **requirements and preview only** where that client has an allowlist (Grok `allowed_tools`, Gemini function declarations). ChatGPT Actions imports the full OpenAPI document, including consequential submit; do not public-test submit until editor and privacy checks pass.

These preview-only allowlists are for operator transport testing without the paste-ready instruction block, not for publication to visitors. The pasted blocks intentionally fail closed when submit is absent. Actual visitor-workflow testing requires all three tools in an authorized controlled client, while retaining exact-preview approval, separate privacy consent, and the application's send gate; a transport-only test does not prove that workflow.

## Production candidates to verify

Do not treat these as live. Observed 2026-09-05: the API paths returned 404. Confirm each URL before any provider editor import.

Candidate host: `https://tseng-law.com`

- OpenAPI: `https://tseng-law.com/api/ai/openapi.json`
- MCP: `https://tseng-law.com/api/ai/mcp`
- English privacy: `https://tseng-law.com/en/privacy`
- Japanese privacy: `https://tseng-law.com/ja/privacy`
- English contact: `https://tseng-law.com/en/contact`
- Japanese contact: `https://tseng-law.com/ja/contact`

Local/dev hosts still use `/api/ai/openapi.json` and `/api/ai/mcp` on whatever public origin the server is configured to emit.

## Credential and attribution

Issue a separate server credential and immutable `clientId` for every provider or published agent. Do not share one key across ChatGPT, Grok, and Gemini.

Recommended identifiers:

- `chatgpt-tseng-intake`
- `grok-tseng-intake`
- `gemini-tseng-intake`

The authenticated `clientId`, not a caller-supplied `source` field, is the authoritative provider attribution. Rotate a provider key without changing its `clientId` when continuity is required. Create a new `clientId` when a different public agent or campaign must be measured separately.

The shared OpenAPI/MCP URL may accept **any active client credential**. A valid Grok key is not rejected merely because the request hit the ChatGPT URL. What must fail is **cross-client confirmation-token replay**: a preview token issued to client A must not submit under client B.

Allow exactly the three operation names above. Do not expose the server as a generic mail, browser, or proxy tool.

`userApprovedExactPreview: true` is an auditable calling-software attestation. It is not independent cryptographic proof that a human saw and approved the exact email. Prompting behavior is proven only by an actual model trace plus the human’s replies.

## ChatGPT (Actions — immediate Bearer fit)

Use a custom GPT Action with the OpenAPI URL. In the GPT editor, set Authentication to **API Key** and send it as built-in **Bearer**. Do not add unsupported custom headers.

OpenAI documents Action authentication as None, API Key, or OAuth using those built-in editor methods:

- <https://developers.openai.com/api/docs/actions/authentication>

Production checks to apply in the editor (do not claim they were already imported or timed in a live GPT): HTTPS on port 443 with TLS 1.2+, 45-second round trip, endpoint/action descriptions ≤300 characters, parameter descriptions ≤700 characters, payloads under 100,000 characters, no custom headers, and a confirmation prompt for consequential actions every time:

- <https://developers.openai.com/api/docs/actions/production>

The generated OpenAPI document already marks requirements and preview as non-consequential and submit as consequential (`x-openai-isConsequential`). The platform prompt does not replace the instruction-file STOP: the model must still obtain separate explicit yeses for the exact preview and for privacy.

Getting-started loop: import the schema, set auth, paste the English or Japanese instruction, test in the editor. This pass did not run that importer.

- <https://developers.openai.com/api/docs/actions/getting-started>

Operator steps still required:

1. Deploy the HTTPS endpoint and confirm the candidate URLs above (API paths returned 404 on 2026-09-05).
2. Create the ChatGPT-specific server credential (`chatgpt-tseng-intake`).
3. Import `/api/ai/openapi.json` and set built-in API Key / Bearer auth.
4. Paste one language block from the instruction file. Editor-test requirements and preview first.
5. Public GPT: complete actual account, editor verification, and privacy-URL setup. Not done in this pass.

This connection, once verified, is one custom GPT. It does not make every ChatGPT conversation discover or invoke the intake API.

## Grok — three different products

Do not collapse these. None of them is a live connection in this pass.

### 1. Grok API (Remote MCP)

xAI documents Remote MCP with `server_url`, `authorization` / `headers`, and `allowed_tools`. `require_approval` is **unsupported**. Do not set it, and do not treat that missing flag as user consent. A controlled application must show the exact preview and collect the two yeses before calling submit.

- <https://docs.x.ai/developers/tools/remote-mcp>

Documented field names (not a verified live connection):

```json
{
  "type": "mcp",
  "server_url": "https://tseng-law.com/api/ai/mcp",
  "server_label": "tseng_consultation",
  "server_description": "Preview and send a user-approved consultation email to the tseng-law.com consultation intake (Taiwan); no calendar booking.",
  "allowed_tools": [
    "get_consultation_intake_requirements",
    "preview_consultation_email"
  ],
  "authorization": "Bearer <grok-specific-server-credential>"
}
```

Add `submit_consultation_email` to `allowed_tools` only after that controlled client is approved for send. Observed 2026-09-05: the candidate MCP URL returned 404.

### 2. Grok CLI

xAI documents adding a remote HTTP MCP server with a static `Authorization` header, at project scope. That is a developer CLI configuration, not the consumer Grok app.

- <https://docs.x.ai/build/features/mcp-servers>

### 3. Consumer Custom MCP Connector

Documented UI path: **Connectors → New Connector → Custom**, with a publicly reachable MCP URL. Team/admin prerequisites are described in xAI’s connectors doc. Actual account authentication and header UI have **not** been verified here. Do not claim the consumer connector is connected.

- <https://docs.x.ai/grok/connectors>

## Gemini — HTTP adapter now; remote MCP candidate-only

**Concrete documented path:** a controlled application using Gemini function calling over the intake HTTP API. The model proposes a function call; the operator’s application executes `GET /api/ai/intake/requirements` and `POST /api/ai/intake/preview` (and later submit) with the Gemini-specific Bearer token. The application, not the model, must stop for the two human yeses before any submit. Google documents this propose-then-execute pattern:

- <https://ai.google.dev/gemini-api/docs/function-calling>

Declare only requirements and preview until that client is approved for send. This pass does **not** implement a new adapter.

**Remote MCP:** candidate only, until a pinned model, API version, and schema-accurate request actually work. The function-calling page mentions remote MCP, but as of 2026-09-05 compatibility with the Gemini Interactions overview and API reference (model support and `allowed_tools`) remains unresolved. Exact Interactions overview/reference URLs are not pinned here; do not invent them. Do not paste an untested string-array `allowed_tools` block as a working config. Do not invent a replacement snippet. Keep Gemini as a goal; re-open remote MCP only after a real pinned request/response.

Consumer Gemini (Google app chat) availability, authentication, and any Japan or worldwide consumer loading of custom tools remain **unverified**. This kit does not claim that Japanese or global consumer Gemini can attach this intake.

## Operator test checklist (synthetic only)

Use `.example.test` addresses. Do not use real client or staff mail. A passing HTTP status is not proof of prompting: save an actual model trace and the human replies. Local transport tests are not a live provider connection.

English synthetic draft:

- `name`: Alex Rivera
- `email`: alex.rivera@example.test
- `locale`: `en`
- `category`: `company_setup`
- `summary`: Short Taiwan branch-setup question. No documents attached.
- `idempotencyKey`: one fresh UUID, reused for that draft’s preview and submit

Japanese synthetic draft:

- `name`: 山田太郎
- `email`: taro.yamada@example.test
- `locale`: `ja`
- `category`: `company_setup`
- `summary`: 台湾での会社設立に関する短い初期質問。資料は送らない。
- `idempotencyKey`: 別の新しい UUID

| # | Case | Expect |
| --- | --- | --- |
| 1 | Missing-field (omit `email`) | No valid preview. Model asks only the missing human fact, not technical fields or every optional field. |
| 2 | Happy preview | Tool returns `subject`/`body`, which already include the intake reference. Show those verbatim. Hide separate token/digest. Do not redact the intake reference inside subject/body. Privacy question uses the returned `privacyUrl` as a clickable link. |
| 3 | No consent / no exact-preview yes | Refuse submit. Server `CONSENT_REQUIRED` or `APPROVAL_REQUIRED`. Initial “please email a lawyer” is not enough. One reply may explicitly answer both questions. |
| 4 | Revised content + old token | Change `summary` and submit with the **old** `confirmationToken` → must fail. New preview of the revised content needs renewed yeses. |
| 5 | Newer preview does not revoke old token | With an unexpired token, the same authenticated client and original matching fields/key, and no conflicting prior claim, requesting a newer preview alone must not invalidate the old token. This does not bypass expiry, approval, consent or other submit checks. |
| 6 | Invalid credential | `401` / unauthenticated. |
| 7 | Cross-client token replay | Preview under client A, submit under client B with A’s token → fail (`TOKEN_INVALID` or equivalent). A valid other-provider key may still authenticate on the shared URL. |
| 8 | Duplicate suppression | Second submit of the same UUID. `duplicate: true` means no additional send. Read `status`: only `sent` is server-reported sent; a duplicate that is `sending` or `failed_unknown` is not prior success. |
| 9 | Uncertain delivery | `sending`, timeout, `failed_unknown`, or `IDEMPOTENCY_CONFLICT` is not success. Do not automatically re-preview or mint a new key. Report uncertainty and use the ordinary contact URLs. |

Prompting proof (required, both languages): the trace shows (a) requirements called first, (b) only missing human facts asked, (c) no ID/bank/card/attachment or technical-field request, (d) language not used to infer citizenship, (e) exact subject/body shown including the intake reference already in them, (f) returned `privacyUrl` shown as a clickable link, (g) STOP for two distinct yeses, (h) submit refused when either yes is missing.

## Release gate

Do not label a provider “connected” until all of these are verified against the deployed production hostname:

- each provider credential authenticates as its own `clientId`;
- the shared endpoint may accept any **active** client — do not require it to reject other providers’ valid keys;
- cross-client confirmation-token replay fails;
- invalid or inactive credentials fail;
- tool discovery returns exactly the three expected operations;
- requirements are localized (`en` / `ja` at minimum);
- preview subject/body are shown verbatim to the test user, including the intake reference already in them; hide separate token/digest from visitor copy; do not redact or alter that intake reference;
- submit without exact-preview approval or privacy consent is rejected;
- `userApprovedExactPreview` is recorded as attestation, not treated as cryptographic proof of human approval;
- approved submit causes exactly one SMTP attempt for a fresh idempotency key;
- replay of that key does not send a second email;
- the firm inbox receives the exact previewed subject and plain-text body;
- logs attribute the flow to the authenticated provider `clientId` without storing the conversation transcript or API key;
- public help and privacy text describe email intake accurately and do not call it a reservation.

Production deployment, environment values, live email, provider registration, and publication remain separate operator actions.

## Readiness states

These are different evidence levels. Do not promote one with proof of another.

| State | Meaning | This pass |
| --- | --- | --- |
| Documented | Kit and paste-ready EN/JA instructions exist | Yes — these two files |
| Local transport-tested | Native-fetch MCP authentication/discovery, EN/JA requirements and preview, plus local OpenAPI schema checks | Passed on 2026-09-05 against candidate `3e7bc021`; 9 requests, zero submit calls. Send-path checklist and actual model prompting remain pending. |
| Live provider-connected | Real ChatGPT, Grok, or Gemini account authenticated to production | Pending |
| Published | Public GPT / connector / agent listed for visitors | Pending |
| Inbox-verified | Firm inbox received the exact previewed mail | Pending |
| Organic acquisition | A real U.S. or Japan visitor used the path without being a test operator | Pending |

All live states remain pending.
