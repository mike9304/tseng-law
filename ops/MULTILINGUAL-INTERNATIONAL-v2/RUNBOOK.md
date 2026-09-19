# RUNBOOK — MULTILINGUAL-INTERNATIONAL-v2

From `/Users/son7/Projects/tseng-law-en-international-20260917`:

```bash
npx tsc -p tsconfig.json --noEmit --incremental false
npx vitest run \
  src/data/__tests__/intent-pages-en-growth.test.ts \
  src/components/__tests__/multilingual-international-v2.test.tsx \
  src/components/__tests__/en-international-v1.test.tsx \
  src/components/__tests__/intent-contact-paths.test.tsx \
  src/data/__tests__/intent-pages-ja.test.ts \
  src/components/__tests__/en-acquisition-guide-links.test.tsx \
  src/app/\[locale\]/__tests__/canonical-public-route-identity.test.ts
```

Logs of the last Grok run: `ops/MULTILINGUAL-INTERNATIONAL-v2/logs/`.

Local preview (unpublished, do not deploy):

```bash
# do not set NEXT_DIST_DIR to a new folder; Next.js rewrites tracked tsconfig/next-env
npx next dev -p 3044
```

Do not commit, push, deploy, or submit live forms.
