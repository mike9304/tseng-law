# Polish author handoff — 940–941

Date: 2026-10-25. Author: AI Polish drafting role `/root/expand_author_pl`. This is author evidence, not independent locale or legal certification. No push or publication by the author.

## Frozen files after locale and measurement repairs

| ID | Article | SHA-256 |
| --- | --- | --- |
| 940 | `repo/src/content/columns-pl/940-polish-importer-taiwan-invoice-bank-change-payment.md` | `06813fc5597240ed39d513e1e88df483dec85cd8f277f89d1baaa41003b6f4ca` |
| 941 | `repo/src/content/columns-pl/941-polish-brand-taiwan-consumer-injury-importer-recall.md` | `17382511050d47b947e9ff81276b2b5f8cb5999ebe62aa86f679eb0546c580e7` |

Exact claim sources, the opening sentence deletion test, manual §5 answers and command output are recorded in `pl-author.json`. Actual source-tool responses are in `pl-author-source-evidence.json`, not reconstructed source text. Hero prompts, original image paths, dimensions, inspection and image hashes are in `../images/pl-generation.json`.

## Reader and market choice

940 addresses a Polish buyer of Taiwan goods who has sent money to a changed account and must assess whether the supplier debt remains. It separates contractual discharge, third-party receipt exceptions and apparent agency; it does not decide Polish bank liability or promise recovery.

941 addresses a Polish consumer-product manufacturer or exporter receiving a Taiwan safety or injury report. It covers importer/manufacturer/distributor roles, the grounds for recall and separate business cost recourse. It is not a B2B machine-warranty guide. Product-specific choice of law under PIL26 is stated before the Taiwan substantive rules, while contractual recourse is addressed under PIL20.

The author opened the [Polish Office economic guide](https://poland.tw/web/tajwan/informator-ekonomiczny) and [official July 2025 mission report](https://www.gov.pl/web/development-technology/polish-business-mission-to-taiwan--a-new-opening-in-economic-relations). The economic guide distinguishes full-year 2025 Taiwan statistics from January–November Polish statistics; the figures are not mixed. These sources establish trade activity, not search volume, fraud prevalence, product incidents or expected clients. Statistics were omitted from article openings because they do not change either reader's immediate decision.

## Three actual Polish comparators

All three were read in full and are dated 2026-10-24:

- `repo/src/content/columns-pl/870-polish-company-taiwan-subsidiary-branch-office.md`: question opening; legal form, investment and tax. Neither new article repeats this structure.
- `repo/src/content/columns-pl/871-polish-working-holiday-taiwan-six-month-work.md`: number opening; visa, work and insurance sequence. The new articles are commercial disputes, not residence advice.
- `repo/src/content/columns-pl/872-polish-exporter-taiwan-unpaid-euro-invoices.md`: explicitly hypothetical exporter receiving no payment, limitation and recovery. 940 concerns a Polish importer who already paid a wrong recipient; 941 concerns consumer injury and recall, not ordinary unpaid invoices.

The new openings use payment effect and importer statutory status. Both final substantive paragraphs return to the particular records needed: the account-change chronology in 940 and consistent batch identification in 941. There is no generic summary conclusion or copied checklist sequence.

## Official law and evidence limits

Directly opened Civil Code169/309/310, PIL18/20/26 and Consumer Protection Act2/7/7-1/8/9/10/10-1. The MOJ histories were checked. Civil Code's pending166-1/1223 notices do not concern the articles used here; the Consumer Protection Act provisions discussed are effective. PIL's 2010 full revision and one-year commencement rule were verified through the official history link after the direct history open failed.

Civil310 follows Chinese `債務人不知其非債權人者`, not the English mistranslation identified in the researcher ledger. The direct English310 attempt failed and is not treated as evidence. Agency under169 is explicitly conditional on the applicable law, with PIL18 cited separately from contract law20.

Europol `pl_0.pdf` was successfully opened as nine pages and 436 extracted lines. The invoice-fraud section is PDF page3 (zero-index page2), with previously obtained contact information at lines142–153 and the impersonated supplier/new bank account at175–183. This actual result is in `pl-author-source-evidence.json`, results[3]. A later screenshot attempt failed; no screenshot inspection is claimed. Bank contact is presented as practical advice, not a legal guarantee or an undertaking by the firm.

## Locale repair 1

Applied the independent Polish locale review's five specified changes:

- 940: `uregulował cenę wobec` → `zapłacił cenę należną`; `prawo zobowiązania umownego` → `prawo właściwe dla zobowiązania umownego`.
- 941: `rozróżnia importera od` → `odróżnia importera od`; naturalized the sentence about reading the insurance policy.
- 941 Art10(2): replaced wording that could suggest both warning and emergency information must be absent with `jeśli nie spełniono obowiązku zamieszczenia widocznego ostrzeżenia wraz z informacjami o postępowaniu w razie niebezpieczeństwa`. The independent final legal reviewer agreed this clarification was appropriate; that message does not replace final exact-hash certification.

No legal exception, source, FAQ, market scope or deadline was removed for stylistic convenience.

## Actual variety commands — unsupported, not PASS

Executed the original shared command against both articles:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-market-expansion-20261025/repo/src/content/columns-pl/940-polish-importer-taiwan-invoice-bank-change-payment.md
exit 2: ERROR measurement unavailable: cannot infer language ...; supply --lang

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-market-expansion-20261025/repo/src/content/columns-pl/941-polish-brand-taiwan-consumer-injury-importer-recall.md
exit 2: ERROR measurement unavailable: cannot infer language ...; supply --lang

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-market-expansion-20261025/repo/src/content/columns-pl/940-polish-importer-taiwan-invoice-bank-change-payment.md --lang pl
exit 2: invalid choice: 'pl'
```

The shared CLI supports14 locales and PL is not one of them. No English relabeling or invented score was used. The two automatic-routing commands were rerun against the exact final full SHAs recorded above; they remain exit2. The explicit `--lang pl` rejection was additionally checked on the earlier locale-repair draft. Earlier runs are preserved in JSON. This is a language-support limitation, not a content score.

## Approved task-local measurement and bounded repairs

After independent method approval, the task-local wrapper was actually executed:

```text
python3 /Users/son7/tseng-market-expansion-20261025/work/variety-candidate/variety_metrics.py check FILE --lang pl
940: sentences=44 mean=15.4 cv=0.464 short=0.205 run3=0.048 opener_rep=0.0 cite_end=0.0 cite_para=0.4 contrast=0 caveat=0 q=1
941: sentences=51 mean=15.3 cv=0.457 short=0.216 run3=0.0 opener_rep=0.059 cite_end=0.0 cite_para=0.588 contrast=0 caveat=0 q=1
Both exit0: OK — no variety limit violated.
```

Exact commands/output and source hashes are in `pl-author-metric-final.json`; method SHA-256 is `44c287ea5f6e26b694881418acebf4c9c115b87b2a965ea0c10a43fb1830e2e5`. The method's independent approval is `../variety-review/review-final.json`. The shared checker, its profiles and all thresholds were left unchanged.

The independent locale review found only CV failures at first: 940 was 0.441 and 941 was 0.426. 940's one-paragraph repair connects authorization records with the intrusion path, followed by the specific limit that intrusion location alone does not establish authority; the remaining payment/damages distinction is unchanged. It passed on the first measurement repair.

941's first measurement repair failed at CV 0.421 and was retained. Its second repair joins the importer's report fields to the purpose of comparing the report with photographs and the examination of the preserved product. The original separate sentences requiring evidence preservation alongside hazard removal, and rejecting continued sale of a recalled batch, remain. It passed at CV 0.457. Art. 10(2), FAQs, all sources and every legal exception are unchanged. No filler sentence or unsupported incident fact was added.

The initial two failed drafts and the failed 941 first repair remain under `pl-author-*-FAIL.md`. During the second 941 backup attempt, a concurrent caption normalization to `Scena fikcyjna` caused the expected-hash assertion to fail. That normalization was preserved. The failed draft was reconstructed from the already preserved baseline plus the exact recorded first-repair paragraph; its SHA matches the original failed measurement byte-for-byte. `pl-author-failure-preservation.json` documents this distinction. Both final captions retain the normalized wording.

## Images and remaining handoff

Two separate native imagegen calls produced distinct 1536×1024 images. Original PNGs remain under the returned `.codex/generated_images` paths; project WebPs are `repo/public/images/columns/940-market-expansion-20261025.webp` and `941-market-expansion-20261025.webp`. Both generated images and final WebPs were actually viewed. They are fictional, unbranded object scenes without faces, identity documents, readable documents or purported case evidence. No CLI/API fallback was used.

The author read all required voice, variety, lessons, editorial skill/review and imagegen files. Internal `author: legal-ai-assistant` is preserved; public authorship/review claims, bold markup and duplicate H1 are absent. Contact appears once per article and states only the four verified consultation languages. Receipt does not mean acceptance of a retainer.

Supported task-local measurement is complete. Ready for independent locale/final certification of these hashes. Publication and public readback belong to the root agent. No human-native or attorney review, browser QA or public deployment is claimed by this handoff.

Independent locale certification subsequently completed: `pl-locale.json`, SHA-256 `ef78fa420ae1f373b69ab28acc8a554e5b1d4fc52aed6920b50e2f1de496837b`, reports PASS for both final article hashes after independent CLI reruns and review of the repaired prose. This author merely records that separate review; independent final legal certification remains separate. The manuscripts remain frozen.
