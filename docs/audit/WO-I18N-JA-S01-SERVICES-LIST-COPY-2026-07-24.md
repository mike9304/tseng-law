# WO-I18N-JA-S01 — Japanese services list copy

Date: 2026-07-24 KST
Owner: Japanese/legal copy correction worker
Reviewer: independent Japanese-language reviewer
Manager: root

## Objective

Correct the existing six-item Japanese services-list data after a sentence-by-
sentence parity and legal-language review. This work order changes content
data only; it does not publish `/ja/services` or implement detail routes.

## Allowed files

- `src/data/site-content.ts`
- `src/data/__tests__/site-content-ja-services.test.ts` (new)

No other file may be edited.

## Required corrections

Apply the independent review's exact numbered replacement list (1–21)
provided with this work order assignment. It covers:

- natural section description and complete service descriptions;
- current authority name `経済部投資審議司`;
- capital remittance/account, zoning/use, and dissolution terminology;
- first-instance scope of the 157万新台湾ドル civil judgment;
- Taiwan family-law terms including two witnesses, `戸政事務所`,
  `親権（監護権）`, statutory shares, and residual-property distribution;
- labor-law terms `退職金（資遣費）`, new-system formula, employer-breach
  termination, and `最低勤務期間`;
- criminal procedure terms without claiming a separate interpreter service;
- IP/finance terminology and exact related-column titles.

Official terminology sources:

- MOEA Department of Investment Review:
  `https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42879`
- Taiwan household-registration divorce guidance:
  `https://www.ris.gov.tw/documents/html/2/3/1/384.html`
- Labor Standards Act Article 15-1:
  `https://laws.mol.gov.tw/FLAW/FLAWDOC01.aspx?flno=15-1&id=FL014930`

## Invariants

1. Preserve all non-Japanese `siteContent` data byte-for-byte.
2. Preserve the six item hrefs, order, detail counts `[6,5,5,4,4,4]`,
   related-slug arrays, and all 16 Japanese column links exactly.
3. Do not add new services, credentials, outcomes, or unsupported claims.
4. Do not change route/component/metadata/sitemap behavior.

## Required test contract

- Assert six-item order, hrefs, detail counts, and exact related-slug parity.
- Assert critical anchors:
  `経済部投資審議司`, `土地使用分区`, `一審`, `157万新台湾ドル`,
  `戸政事務所`, `残余財産差額分配請求`, `資遣費`, `新制`,
  `最低勤務期間`, `被疑者・被告人`, `先行商標調査`.
- Reject stale or misleading strings:
  `投資審議委員会`, `投審会`, `最低服務期間`, `多言語訴訟支援`,
  `日本語通訳支援`.
- Resolve every related slug through the Japanese column corpus.
- Assert exact corrected titles for logistics, divorce, inheritance/custody,
  worker-initiated termination, and minimum-service-period articles.
- Preserve representative KO/ZH-Hant/EN service copy.

## Worker gates

- Focused Vitest: new test plus existing Japanese content/column tests.
- `npm run typecheck`
- scoped ESLint on the two allowed files
- `git diff --check`

Do not stage, commit, push, deploy, or operate the dev server.

## Manager acceptance

- Independent reviewer compares all 21 corrections to the approved exact text
  and confirms natural, complete, non-overclaiming Japanese.
- Manager reruns all gates and inspects the complete diff.
- Commit only the two allowed files plus this work order.
