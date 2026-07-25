# WO-CONSULTATION-KNOWLEDGE-TIMESTAMP-TIE

Date: 2026-07-26 KST
Manager: Codex `/root`

## Failure evidence

`src/lib/consultation/__tests__/attorney-knowledge.test.ts` consistently fails
when two upserts for the same id receive the same millisecond ISO timestamp.
`readAttorneyKnowledgeEntries()` currently accepts a later record only when
`record.updatedAt > previous.updatedAt`; an equal timestamp therefore leaves
the earlier log line active even though the append-only log's later line is
the latest write.

## Scope

Allowed runtime file:

- `src/lib/consultation/attorney-knowledge.ts`

Do not edit the existing test, storage backend, embeddings, consultation copy,
or any other file. Do not change timestamp generation or id generation.

## Required behavior

When records for the same id have equal `updatedAt`, the later log line must
replace the earlier one. Preserve the current behavior for strictly older and
strictly newer timestamps and for archive records.

## Gates

1. Existing isolated `attorney-knowledge.test.ts` passes repeatedly.
2. Consultation engine and knowledge-route regressions pass.
3. Typecheck, scoped lint, and `git diff --check` pass.
4. Manager-owned local commit, separate from generated embeddings.
