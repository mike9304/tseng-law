# G-Editor Completion Audit

Audit date: 2026-05-09
Current HEAD at audit time: `071eb4e G-Editor: update manual QA evidence`

## Objective Restated

Make `/ko/admin-builder` feel visually and behaviorally close to Wix Editor for the desktop editor track, covering M1-M8:

- Wix-like selection, hover, drag/snap, resize, rotate, save, undo/redo, clipboard, editor chrome, rail, context menu, asset/image editing, version history, publish gates, and SEO.
- Keep out-of-scope tracks out of this goal: mobile/responsive follow-up tracks, 70-widget library expansion, Bookings track, and broad Wix product work orders.
- Verify with actual dev-server interaction and Playwright scenarios.
- Keep documentation and milestone commits current.
- Do not mark complete until the user performs the required 5-minute manual QA and confirms the Wix-like feel.

## Current Automated Evidence

- `npm run typecheck`: passed
- `npm run lint`: passed, existing `<img>` warnings only
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1`: passed, 27/27
- `npm run test:unit`: passed, 26 files / 735 tests
- `npm run security:builder-routes`: passed, 71 route files / 62 mutation handlers
- `npm run build`: passed, Google Fonts stylesheet download warning + existing `<img>` warnings only
- `curl -I http://localhost:3000/ko`: 200
- `curl -I -u admin:local-review-2026! http://localhost:3000/ko/admin-builder`: 200

Latest documentation evidence:

- `SESSION.md`: latest full gate and perf follow-up recorded.
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`: memo 62 recorded.
- `G-EDITOR-MANUAL-QA.md`: user QA checklist updated to 27/27 automated gate.

## Prompt-To-Artifact Checklist

| Requirement | Evidence | Status |
|---|---|---|
| 1. W02 selected node blue border, 8 white handles, dark-blue handle border, hover border, label | `tests/builder-editor/admin-builder.playwright.ts`; `tests/builder-editor/design-pool.playwright.ts`; checkpoint W02 notes | Automated pass, user QA pending |
| 2. W06 drag snap guides, dimension chip, 6px tolerance | `src/lib/builder/canvas/snap.ts`; `src/lib/builder/canvas/__tests__/snap.test.ts`; `admin-builder.playwright.ts`; `design-pool.playwright.ts` | Automated pass, user QA pending |
| 3. W07 resize tooltip, Shift aspect ratio, handle cursors | `admin-builder.playwright.ts`; `design-pool.playwright.ts`; `src/components/builder/canvas/CanvasContainer.tsx` | Automated pass, user QA pending |
| 4. W08 rotate handle, degree chip, Shift 15-degree snap | `admin-builder.playwright.ts`; rotation handle/chip assertions recorded in `SESSION.md` | Automated pass, user QA pending |
| 5. W11 save chip idle/Saving/Saved/error/fade | `admin-builder.playwright.ts`; W11 checkpoint notes; latest save-chip timing assertions in `SESSION.md` | Automated pass, user QA pending |
| 6. W19-W21 top bar Wix-style layout | `admin-builder.playwright.ts`; `SandboxPage` editor shell styles; `G-EDITOR-MANUAL-QA.md` top bar item | Automated pass, user QA pending |
| 7. Left rail 64px dark icon column, hover tooltip, slide panel | `admin-builder.playwright.ts`; `SandboxPage.module.css`; W04 checkpoint notes | Automated pass, user QA pending |
| 8. ContextMenu Wix-style white card, pink hover, shortcuts, dividers | `admin-builder.playwright.ts`; `design-pool.playwright.ts`; context menu assertions | Automated pass, user QA pending |
| 9. W29 Cmd+D duplicate offset, auto-select, Duplicated toast | `admin-builder.playwright.ts`; `clipboard-persistence.playwright.ts`; store duplicate path | Automated pass, user QA pending |
| 10. W30 cross-page Cmd+C/Cmd+V with clipboard pill and offset paste | `clipboard-persistence.playwright.ts`; `admin-builder.playwright.ts` Pages clipboard pill coverage | Automated pass, user QA pending |
| 11. W10 unlimited undo/redo and activity chip | `src/lib/builder/canvas/history.ts`; `admin-builder.playwright.ts`; `clipboard-persistence.playwright.ts`; checkpoint W10 notes | Automated pass, user QA pending |
| 12. W22 AssetLibrary folder tree/search/tags/sort/new folder/tag | `tests/builder-editor/asset-image-workflow.playwright.ts`; server-persisted asset library notes | Automated pass, user QA pending |
| 13. W23 image Crop / Filter / Alt unified dialog from context/inspector | `asset-image-workflow.playwright.ts`; `ImageEditDialog`; inspector/context paths | Automated pass, user QA pending |
| 14. W26 VersionHistory timeline cards/restore/diff preview | `seo-publish-history.playwright.ts`; `VersionHistoryPanel`; W26 checkpoint notes | Automated pass, user QA pending |
| 15. W28 PublishModal preflight blockers/warnings | `seo-publish-history.playwright.ts`; `PublishModal`; `publish-checks` route | Automated pass, user QA pending |
| 16. W27 SEO title/description counters, Google preview, OG preview, canonical | `seo-publish-history.playwright.ts`; `SeoPanel`; public head reflection assertions | Automated pass, user QA pending |
| 17. 5-minute free-use user QA | `G-EDITOR-MANUAL-QA.md` exists, but user result fields are blank | Missing, blocks goal completion |
| 18. B3/B6/B7 dark tone/color/font/radius token discipline | Checkpoint notes; lint/build; targeted CSS cleanup notes in `SESSION.md` | Automated/code review evidence, user QA pending |
| 19. typecheck/lint/unit/security/build all green | Latest full gate recorded in `SESSION.md` and checkpoint memo 62 | Complete |
| 20. Append `SESSION.md` and update Wix checkpoint | `SESSION.md`; `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` memo 62 | Complete |
| 21. Milestone git commits with `G-Editor:` prefix, no push | Recent commits all use `G-Editor:` prefix; no push performed | Complete |

## Named File And Constraint Audit

| Explicit file / area | Evidence | Status |
|---|---|---|
| `AGENTS.md` | Repo guidance file present; no conflicting edit made | Satisfied |
| `SESSION.md` | Updated through latest full gate and perf follow-up | Satisfied |
| `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` | Updated through checkpoint memo 62 | Satisfied |
| `G-EDITOR-MANUAL-QA.md` | Manual QA checklist exists and references current automated gate | Satisfied, awaiting user fill-in |
| `CODEX-GOAL-WIX-PARITY-COMPLETE.md` | Read as broader future work order; not used as current completion criterion | Satisfied |
| Forbidden files/areas | No intentional edits to `tree.ts`, seed-home version, legacy bodies, widget library, bookings, or PreviewModal/ShowOnDeviceToggles in latest follow-ups | Satisfied by git diff/status review |
| Mutation routes require `guardMutation()` | `npm run security:builder-routes` passed | Satisfied |
| Push forbidden | No push performed | Satisfied |

## Weak Or Uncovered Items

- User manual QA is the only hard blocker. The user must use `/ko/admin-builder` for about 5 minutes and judge whether it feels Wix-like.
- Visual parity is partly subjective. Playwright verifies concrete CSS/DOM/interaction contracts, but cannot honestly certify the user's "Wix 그대로 쓰는 느낌" standard.
- `CODEX-GOAL-WIX-PARITY-COMPLETE.md` describes a broader Wix-class product roadmap beyond this desktop editor goal. That broader work is explicitly not complete and is not treated as this goal's completion scope.

## Completion Decision

Do not call the goal complete yet.

Reason: Done when 17 remains incomplete. The next required input is the user's manual QA result from `G-EDITOR-MANUAL-QA.md`, especially the final Wix-like feel judgment and any fail rows.
