# ja-gap-20261024 — 日本の顧客向け新規コラム10本（711–720）

2026-10-24 user request: write the Japanese columns the site lacks for Japanese clients, and deploy them, in goal mode. Author: Claude Code (Opus 5.5). Reviewer chosen by the user: an independent Opus subagent. Count chosen by the user: 10.

## Topic selection

The ja library had 201 files on origin/main 048d9c61. A grep of `src/content/columns-ja/*.md` on 2026-10-24 found no Japanese column on these topics (some exist in other locales: en 053 franchise, zh 062 overtime, zh 164 promissory note, en 136 / zh 214 SHTC, ko 517 bankruptcy, en 351 arbitration):

| No | Topic | Main sources (law.moj.gov.tw unless noted) |
|---|---|---|
| 711 | Franchise disclosure for Japanese restaurant/retail chains | 公平交易法 §19·25·42, 施行細則 §25, FTC 加盟業主經營行為案件之處理原則 |
| 712 | Joint venture with a Taiwanese partner | 公司法 §11·102·111·157·163·175-1·198·202·356-1/3/5/7/9, 涉外民事法律適用法 §13·14·20 |
| 713 | Enforcing a Japanese arbitral award in Taiwan | 仲裁法 §47–52, 民事訴訟法 §402·522·526, 非訟事件法 §41, e-Gov 仲裁法 §45 |
| 714 | Government procurement bids by Japanese companies | 政府採購法 §17·25·30·31·36·43·44·65·67·75·76·101–103, 外國廠商參與非條約協定採購處理辦法, 政府採購公告及公報發行辦法 §7·19, WTO GPA parties page |
| 715 | Cartel investigation, fines, leniency | 公平交易法 §14·15·27·30·31·34·35·40·44, 聯合行為違法案件免除或減輕罰鍰實施辦法 §2·6–10·15 |
| 716 | Overtime pay and the 責任制 (§84-1) | 勞動基準法 §24·30·32·32-1·36·39·40·79·80-1·84-1, 勞動事件法 §38, 民法 §126, e-Gov 労働基準法 §41 |
| 717 | SHTC export control and the entity list | 貿易法 §13·27·27-1·27-2, 戰略性高科技貨品輸出入管理辦法 §15–19·21, 國際貿易署 press releases 2025-06-15 and 2026-06-09 |
| 718 | Customer reorganization (重整) or bankruptcy | 公司法 §282·287·294·296·297·311, 破產法 §1·57·58·65·99·108·110·111·113, 民法 §265 |
| 719 | Promissory note (本票) as security | 票據法 §5·6·11·22·95·120·123·124, 非訟事件法 §42–44·194·195 |
| 720 | Advertising Japanese supplements in Taiwan | 食品安全衛生管理法 §8·28·45, 認定準則 §3–5, 健康食品管理法 §2·3·6·14·24, 消費者庁 page |

Statute texts were fetched with curl from LawAll pages on 2026-10-24 and compared article by article. Working files (research extracts, HTML cache, image sources) are kept outside the repo in `~/tseng-ja-gap-20261024/` on the MacBook Air.

## Openings (EDITORIAL-VOICE step 2, SENTENCE-VARIETY 2-4)

Previous three ja columns: 650 opens with a number (3か月), 651 with a judgment fact, 652 with the reader's question. The new batch mixes types: number/fact (711, 713, 720), reader's question (712, 718), quoted statute or official release (714, 717), labelled scene (715, 719 — 2 of 10, under the 1/3 cap), common misconception (716). No stock hypothetical formula opens a column; both scenes carry the 架空 label after the scene.

## Checks

- `python3 ~/tseng-lanes-shared/variety/variety_metrics.py check <file> --lang ja`: 0 FAIL on all 10 (only the register WARN on です・ます endings).
- No bold, no phone number, contact = email and office address, no public author; frontmatter `audience: ["ja"]`, internal `author: "legal-ai-assistant"`.
- Internal links point to existing ja files; link text matches the target title.

## Images

Ten new hero images, generated with Grok Imagine (grok CLI, grok-4.7, image_gen tool only) and converted to WebP 1280×720 q82. Contact-sheet check: no people, faces, text, numbers, logos or readable documents. Provenance with sha256 is in [images-provenance.json](./images-provenance.json).

## Review

Independent Opus subagent (user-chosen reviewer), files in [reviews/](./reviews/):

- r1: 5 FIX (9 MUST: §42/§40/§44 "may" turned into certain outcomes, franchise contract-delivery exception narrowed, §198 opt-out misstated, unsupported §163 claim, §15② extension missing, rest-day sentence and §79 amounts in 716, §289 filing period missing in 718) and 5 PASS. All MUST applied; SHOULD applied except where the source could not be verified (see r1-fixlog.md).
- r2: all r1 MUST resolved; 3 new one-phrase MUST (712 有限公司 has no shareholders' meeting, 716 citation §36③, 718 title limited to 重整 and §64 added). Applied.
- r3: the six edited files (711, 712, 713, 716, 718, 719) PASS against the source; with r2 PASS for 714, 715, 717, 720, all 10 PASS (r2-opus.md, "## r3").

Titles of 712–715 and 717–719 were rewritten in r1 to avoid the same three-item pattern; contact sentences differ per column (email and office address only).

## Known issue outside this batch

`column-embeddings-content-sync.test.ts` fails on origin/main 14768aca (before this commit) because the ARC 704–706 ko/zh-hant/en files have no entry in `column-embeddings-pending.json`. Not changed here.
