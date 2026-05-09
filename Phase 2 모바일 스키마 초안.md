# Phase 2 모바일 스키마 초안

Lock: 2026-05-10T03:00:00+09:00
Milestone: M07 — 모바일 스키마 결정 + 잠금

## Locked Decisions

1. Per-viewport font size override
   - Locked path: `node.responsive.<viewport>.fontSize`
   - Viewports: `tablet`, `mobile`
   - Resolver default: desktop `node.content.fontSize`; mobile inherits tablet when mobile is unset.

2. Per-viewport visibility
   - Locked path: `node.responsive.<viewport>.hidden`
   - Rejected path: `hiddenOnViewports[]`
   - Resolver default: desktop `node.visible`; mobile inherits tablet when mobile is unset.

3. Mobile sticky header
   - Locked path: `site.headerFooter.mobileSticky`
   - Default: `false`
   - Runtime/UI implementation target: M10 / W43.

4. Mobile bottom CTA bar
   - Locked path: `site.mobileBottomBar`
   - Default: `{ enabled: false, actions: [call, consultation] }`
   - Runtime/UI implementation target: M10 / W44.

5. Mobile hamburger conversion
   - Locked path: `site.headerFooter.mobileHamburger`
   - Values: `auto | off | force`
   - Default: `auto`
   - Runtime/UI implementation target: M09 / W39.

## Migration

Dry-run:

```bash
node scripts/migrate-builder-mobile-schema.mjs --site tseng-law-main-site --dry-run
```

Apply:

```bash
node scripts/migrate-builder-mobile-schema.mjs --site tseng-law-main-site
```

Backup key format:

```text
builder-site/<siteId>/backups/before-M07-<timestamp>.json
```

Local backup path:

```text
runtime-data/builder-site/<siteId>/backups/before-M07-<timestamp>.json
```

Rollback:

```bash
cp runtime-data/builder-site/<siteId>/backups/before-M07-<timestamp>.json runtime-data/builder-site/<siteId>/site.json
```

## Code Evidence

- `src/lib/builder/canvas/types.ts`: responsive override schema lock comment and zod fields.
- `src/lib/builder/canvas/responsive.ts`: rect/font size/hidden cascade resolvers.
- `src/lib/builder/site/types.ts`: `headerFooter.mobileSticky`, `headerFooter.mobileHamburger`, `mobileBottomBar`.
- `src/lib/builder/site/mobile-schema.ts`: default normalizer for site-level mobile schema.
- `src/lib/builder/site/persistence.ts`: site document lifecycle normalization applies M07 defaults.
- `scripts/migrate-builder-mobile-schema.mjs`: dry-run/apply migration with backup key.
