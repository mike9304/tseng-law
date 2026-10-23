# German author handoff — ARC 704–706, repair 1

## Current repair 1 handoff — 2026-10-24

Root requested the two required findings in `work/reviews/de-locale-r1.md` only. DE-1 and DE-2 have been repaired by adding the entry-scheme qualification immediately after the professional direct-NIA paragraph in 704 and 705, plus an official source-list entry in each. No other article prose was rewritten. Article 706 is byte-for-byte unchanged from its independently reviewed PASS hash. The repaired 704/705 passages still require the independent reviewer's readback; this is an author completion report, not a reviewer PASS or publication approval.

| Current file | Body words | SHA-256 |
|---|---:|---|
| `704-taiwan-arc-first-application.md` | 965 | `73a4b0125adafe4c03c072d044e97ebab618a082fe08fafb0916bc715ebb64dc` |
| `705-taiwan-visa-residence-work-study-family.md` | 1037 | `f9bfeafeb6371d7999518b130456cb281d764bc5c4e7064cc1872bc15f571882` |
| `706-taiwan-arc-renewal-changes-reentry.md` | 1099 | `5c1f2c6fe78a0232b77beec2ab57e0f19809521a344bd1786a854ea0ea72f42c` |

At 704:37, the three new sentences state that the actual entry type must be checked; identify NIA 0915 restrictions such as trial visa exemption, conditional online travel authorization (TAC), Working Holiday and restrictive annotations; and expressly preserve special statutory exceptions. At 705:39, the same general qualification applies to direct residence applications, including the later qualifying family route. It starts `Auch bei ...` to avoid creating a third `Bei` paragraph. The legal substance is the reviewer's suggested repair, without an absolute ban and without copying the guide's obsolete Article 12 reference.

The [current NIA 0915 §7(1)](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) was directly reread during repair. Its restriction list preserves exceptions under relevant regulations. The existing current Article 16 links and both specified professional/dependent categories remain intact. No one is told that every trial-exemption/TAC arrival is categorically ineligible. The first two paragraphs, FAQs, closings, dates, fees and deadline triggers are unchanged. The new NIA URL is present in each affected article's source list.

### Current shared CLI — German support now available

The shared checker was updated in a separate root-coordinated task. This author did not edit it or choose another language to improve a score. The current default command recognizes `[de]`; all three runs returned exit 0 and `OK — no variety limit violated`. This supersedes the old validation limitation for the current files. The earlier `[ko]` fallback and `--lang de` KeyError below are retained as historical evidence of the earlier checker, not current results.

Exact current commands, run separately:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/704-taiwan-arc-first-application.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/705-taiwan-visa-residence-work-study-family.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/706-taiwan-arc-renewal-changes-reentry.md
```

Actual current output:

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/704-taiwan-arc-first-application.md [de] sentences=65 mean=13.5 cv=0.556 short=0.308 run3=0.032 opener_rep=0.05 cite_end=0.0 cite_para=0.25 contrast=0 caveat=0 q=1
  OK — no variety limit violated
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/705-taiwan-visa-residence-work-study-family.md [de] sentences=65 mean=15.5 cv=0.494 short=0.138 run3=0.032 opener_rep=0.211 cite_end=0.0 cite_para=0.368 contrast=0 caveat=0 q=2
  OK — no variety limit violated
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/706-taiwan-arc-renewal-changes-reentry.md [de] sentences=69 mean=14.9 cv=0.478 short=0.217 run3=0.075 opener_rep=0.19 cite_end=0.0 cite_para=0.476 contrast=0 caveat=0 q=1
  OK — no variety limit violated
```

Checker identity at this execution:

```text
0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb  /Users/son7/tseng-lanes-shared/variety/variety_metrics.py
53fe3e3dbf3f151e06e2629672ce0c57ccea9484b14433d220bfd53d4e5c35b4  /Users/son7/tseng-lanes-shared/variety/variety_multilingual.py
```

These hashes were read with `shasum -a 256` in the same verification batch as the manuscript hashes. No `--lang en`, threshold change, replacement checker or sentence-boundary override was used.

The original read-only Node structural script reproduced below was rerun on the repaired files (exit 0): `structuralErrors: []`; FAQ counts 3/3/3; indexed source URLs 13/15/14; current body counts and hashes match the table above. The rerun command extracted that exact code block from this report and invoked Node via stdin. All local German targets resolve and every body external source is listed. This is structural verification, not an HTTP or rendered-page check.

Section 5 manual check was repeated for the affected paragraphs and their surroundings. The added qualification is not a new opening or ending, keeps the Article 16 permission and its exceptions, uses one three-sentence explanation per article, and introduces no repeated three-paragraph opener or formulaic contrast. The brief final sentence preserves the exception rather than serving as filler. First-two-paragraph deletion results and the three actual German comparisons remain applicable because those passages did not change. No further style repair was needed and 706 remained untouched.

Repair rounds used: 1. Scope: 704/705 plus this author report. Independent repaired-hash readback and publication remain the root team's next steps. Every section after this notice records the original author freeze and its then-current checker limitation; its old hashes and `[ko]` outputs must not be used as the current repair-1 result.

## Historical initial author freeze — before independent r1

Date: 2026-10-24, Asia/Seoul. Author: `/root/author_de`. Status: three German drafts written and author checks completed; independent locale/legal review is still required. These are unpublished files. The `published` frontmatter value is planned content metadata, not evidence of publication.

Only the three assigned German articles and this report were written. No other author's files, checker, rendering code, existing articles or research brief were changed. No commit, push, deployment, application submission, payment or third-party contact was made.

## Historical frozen files

| File under `repo/src/content/columns-de/` | Title | Body word count | SHA-256 |
|---|---|---:|---|
| `704-taiwan-arc-first-application.md` | Die erste ARC in Taiwan: Antrag, Unterlagen und Abholung | 929 | `789e355c19a1e6193f77eaa2653dd313f93df170f638c7c040d1c1d0d150e9cf` |
| `705-taiwan-visa-residence-work-study-family.md` | Arbeit, Studium oder Familie in Taiwan: Welcher Aufenthaltsweg passt? | 1001 | `9ad37234154086aee71b45cdc99134b9ac8b69a03f96d77168f210a9f1589aa9` |
| `706-taiwan-arc-renewal-changes-reentry.md` | ARC verlängern: neue Arbeit, andere Adresse und Reisen aus Taiwan | 1099 | `5c1f2c6fe78a0232b77beec2ab57e0f19809521a344bd1786a854ea0ea72f42c` |

Word counts use JavaScript `Intl.Segmenter('de', {granularity:'word'})`, including headings/table/disclaimer and excluding frontmatter and the source list. They are a length diagnostic, not a shared variety PASS. Each article has exactly three FAQs, `topic: visa`, `audience: ["de"]`, `author: legal-ai-assistant`, and quoted published/lastmod dates `2026-10-24`. The provenance author is internal metadata; no public author/AI byline was added.

## Rules and research read

- `work/BRIEF.md` and the complete applicable `repo/AGENTS.md`.
- Full `repo/docs/columns/EDITORIAL-VOICE.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, and `/Users/son7/tseng-lanes-shared/LESSONS.md`.
- Full `/Users/son7/.codex/skills/tseng-law-editorial/SKILL.md` and its `references/review-criteria.md`. The root agent owns independent review; this author report is not that review.
- `work/research-arc.md`, `work/research-paths.md`, `work/research-europe.md`, including the final supplements A01–A16, P01–P19, the DE brief, actual recent-corpus table and E01–E05 service/source limits. The late A03 entrepreneur/Gold Card distinction and A16 overseas-loss route were incorporated before this freeze.
- The global Obsidian index, web/business MOC and tseng-law project note were read for current project context. No vault file was edited because this author's ownership is restricted to four paths; the root integrator owns the aggregate task/vault update.
- The older pointer `/Users/son7/agent-library/knowledge/editorial-voice.md` was absent. The actual repository voice file named in the brief was read in full. No rule was invented from the missing pointer.

Memory registry lines 550–557 supplied only the provenance/current-corpus verification reminder. Current legal propositions were checked against official sources and the current research ledger, not inferred from memory. Applicable Fable retirement was preserved.

## Legal and practical boundaries retained

704 separates entry with residence permission (30 days counted from the next day) from a Resident Visa issued inside Taiwan (BOCA: 30 days from issuance), and from statutory direct NIA routes. Article 16 is the current professionals provision; the obsolete Article 12 number in some NIA guides was not copied. A work authorization is not an ARC application. The final wording uses `bereits erteilte Beschäftigungserlaubnis`, avoiding an inaccurate employer-issued-permit implication.

The initial documents cover application/photo/passport/visa/address and the proper employment, study or family evidence. NIA photo recency (two years) and BOCA visa photos (six months) are different steps. Foreign-document certification/translation is tied to the actual category. The Taiwanese spouse's attendance and first-year ARC are limited to that route. General card fees, the eligible in-country surcharge and the overseas-compatriot-student reduction are not treated as universal student discounts or permission to buy a longer term.

Both real NIA portal URLs are in 704. The professional/dependent portal is not offered to all foreign workers. Its 15-day-before-expiry online condition and counter alternative are scoped to that online route. The student process explains account, color uploads, correction, approval, payment and collection. In the current English NIA 0929 guide, approval is followed by payment within five working days; chip-card pickup is three working days after payment with the printed receipt at the chosen office; an electronic ARC of at most six months is downloaded after payment. These are not overall guaranteed processing times. The English guide's own update date is 2026-08-28; no website footer date was treated as a law's effective date.

705 keeps actual work activity, permission to work, visa and ARC separate. The German project/installation opening does not classify all installations as automatically allowed business visits. The body covers professional employment, full-time degree study, Mandarin study, Taiwanese-spouse and qualifying foreign-professional-family routes. Ordinary student/Mandarin conversion restrictions do not erase the professionals' direct NIA exception. Mandarin conditions retain four completed months, at least three further months, 15 classroom hours per week and the attendance ceiling. Student work permission and Article 50's 20-hour rule are distinct from the ARC. Taiwanese-spouse work-permit exemption retains both household registration and permitted residence. Other dependents are not promised blanket work permission.

Gold Card and entrepreneurship appear briefly as separate pathways. German-language readership is not German citizenship. The Deutsche Institut Taipei link is a German-language orientation source for German nationals, while Taiwan agencies control the actual application. No German consultation, visa-agency service, lawyer qualification, approval or processing guarantee is claimed. No contact or sales CTA was needed.

706 explicitly confines the three-month window to `gewöhnliche ARC-Verlängerung` in the opening, heading and table. Its short exception paragraph links the Gold Card's four-month window and the entrepreneur pathway's four months while the business continues; the latter guide separately has three months when the business has ceased and further residence is sought. It does not say every ARC or every entrepreneur extension has one window.

Address/workplace registration is 30 days from the day after the change. A qualifying residence-purpose change under Article 23-1 and Regulation Article 7 is 30 days from the event day. The separate 15-day BOCA route for other cases is expressly qualified. Loss of the residence basis can matter before the printed expiry. New employment permissions are not replaced by an NIA data update.

No universal 30-day deadline for every new passport was invented. Domestic card loss accepts the official declaration/police-evidence alternatives. Overseas loss now links the official online/Taiwan representative routes; authentication and representation requirements depend on the route. The article does not promise boarding or return from a scan, receipt or pending application. Article 34 and the multiple-reentry notation are distinguished from e-Gate convenience. Exit-ending rules are scoped to the professional online process and the specified first student ARC application after visitor entry. The under-30-day overstay provision is not a grace period.

Additional official pages personally checked during the final supplement:

- [NIA entrepreneur guide, notes 3 and 6](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/), content updated 2025-02-17: different extension windows.
- [Current English NIA 0921 Gold Card guide, 7(6)](https://www.immigration.gov.tw/5475/5478/141465/141808/411634/), content updated 2026-04-21: four-month renewal application window. The Chinese 406403 page was also opened; the English guide supplied the directly readable paragraph used here.
- [NIA overseas loss notice](https://www.immigration.gov.tw/5385/7229/7232/368785/), issued/updated 2024-05-17, sections 2–4: routes and certification/older-card exceptions.
- [Employment Service Act](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090001), Articles 43, 48, 50 and 53: ordinary authorization, exemptions, student work and employer change.
- [WDA student work-permit FAQ](https://ezworktaiwan.wda.gov.tw/News_Content.aspx?Create=1&n=77054B15FD1F5128&s=5C73DC0C790B04D9&sms=2E02279676D3E77B), Q4: actual dedicated application system; own update 2025-09-01, check date 2026-07-15.

## Three recent actual German comparisons

Primary samples were selected by displayed publication date, with lastmod used to distinguish the older tie. They are actual local German files read for their opening, structure and ending, not translated summaries. Initial inspection also read 017; the Europe research's corrected publication-order sample was then used. Thus the primary three are 018, 011, 016, rather than simply the three highest file numbers.

| Actual German source | Dates shown | Observed prose and new-series distinction |
|---|---|---|
| `018-taiwan-semiconductor-market-entry.md` | 17 September 2026; lastmod 2026-10-07 | Opens with a long headquarters/customer operational inventory, then who performs which tasks. Numbered company-form sections and a long consultation/document ending. New 705 asks about the individual's actual activity, links this article, and does not repeat company formation or the unpublished 679–683 commercial-dispute batch. 704/706 use filing and expiry events. |
| `011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md` | 4 February 2026; lastmod 2026-07-25 | Opens with importer/PIF/registration/advertising responsibility lists and an `Im Folgenden` forecast. Numbered regulatory categories, then crosslinks, broad disclaimer and a human name. New articles avoid that inventory/forecast opening and do not import its old public byline. |
| `016-taiwan-inheritance-custody-analysis.md` | 13 September 2025; lastmod 2026-10-11 | Opens with death and several simultaneous procedures; paragraph two divides legal fields and forecasts `Das Folgende`. Eleven numbered sections, broad source/version advice and human byline at the end. New articles have unnumbered action-specific sections and different closing tasks rather than the same abstract separation formula. |

The additional 017 logistics article was also read; its long scope/definition opening and numbered structure were not copied. These local comparisons do not prove today's public deployment. The Europe researcher reported a stale German-list crawl; that is not live release evidence.

## First-two-paragraph deletion test

704: retained sentence 1 because it identifies the eligible entry and filing period; sentence 2 fixes the next-day trigger. Paragraph two defines the ARC, separates the work permit/NIA duties, then supplies the existing-ARC-function-document exception. Deleting any of those loses a condition or practical distinction. An earlier empty source-announcement sentence was removed and the source was attached to the substantive claim. The employer-permit wording was corrected without dropping the distinction.

705: the opening question distinguishes customer conversation from installation/training. The following legal sentence states the work-permit rule and exceptions. The travel-form label sentence explains why the internal booking description does not decide it. Paragraph two assigns BOCA/mission and NIA roles, states the Resident Visa purpose and preserves direct NIA alternatives. The redundant draft sentence `Für die Planung zählt die tatsächliche Tätigkeit.` was deleted: the preceding concrete question already does that work. No condition, authority or exception was lost.

706: the first sentence addresses the actual contract-extension mistake. The next sentence supplies the pre-expiry application duty and agency; the third gives the ordinary ARC window with its source and scope. Paragraph two explains an earlier loss-of-basis event, its legal consequence and exceptions, a concrete employment trigger, and the three documents to compare. The empty draft sentence `So bestimmen es ...` was removed; the same two sources now support their actual propositions inline. The three-month scope was narrowed before freeze.

## Sentence-variety §5 author check

1. Exact shared CLI executed for all three files. It auto-selects `[ko]`; all three exit 1 on its Korean short-sentence threshold. An explicit `--lang de` probe raises `KeyError: 'de'`. German support is absent. Therefore §5.1 FAIL-zero is not established. No English fallback was run, no checker was edited and no automatic PASS is claimed.
2. Openings differ: 704 one filing-period number, 705 a reader's activity question, 706 a contract/card misconception. No formulaic hypothetical opening or invented client story.
3. Each article has actual short sentences, not added filler. Examples: 704 `Sie beginnt am Tag nach der Einreise.` and `Ein Mietvertrag kann als Adressnachweis dienen.`; 705 `Die Zulassung allein genügt nicht.` and `Die Studien-ARC ersetzt diese Erlaubnis nicht.`; 706 `Fehlt der neue Beschäftigungsbescheid noch?` and `Gezählt wird ab dem Tag nach der Änderung.` Long legal conditions are followed by shorter explanations. Read-only German segmentation was used only to find passages needing manual attention, not to certify the shared metric.
4. Paragraph openers were read vertically. On the final text each first word appears at most twice. The added 706 exception paragraph was rephrased from `Für ...` to `Das Antragsfenster ...` after it would otherwise have become the third `Für` paragraph. This was a prose edit; the conditions and source URLs were retained.
5. No three-paragraph `claim (citation) → caveat` sequence. Citations appear with the acting agency, at clause beginnings and at paragraph ends. Each article has an uncited practical closing paragraph. Body question counts, excluding FAQs/headings, are 1/2/1.
6. No repeated `nicht X, sondern Y` template or invented rebuttal. Necessary legal limits concern actual confusions: work authorization/card, admission/residence, and application receipt/re-entry. The legal qualifications were not removed for rhythm.
7. Closings differ: 704 card-data comparison and calendar entry; 705 activity/entry basis/agency before booking; 706 a dated account of expiry/change/travel. Scope notes are separate structural tails and are not copied promotional endings.
8. Professional German throughout. No body H1, bold, invented first-person experience, public human/AI byline or imperative checklist heading. `Sie` is used sparingly where it expresses a concrete portal action.
9. Sources, article numbers, deadline triggers and fees were checked after edits. The final A03/A16 amendments increased precision. No legal fact was deleted merely to improve a score. English segmentation thresholds were not substituted for an unsupported German gate.

## Exact shared CLI evidence

Commands were run separately; each exit code is 1.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/704-taiwan-arc-first-application.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/705-taiwan-visa-residence-work-study-family.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/706-taiwan-arc-renewal-changes-reentry.md
```

Final outputs:

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/704-taiwan-arc-first-application.md [ko] sentences=63 mean=90.5 cv=0.599 short=0.032 run3=0.033 opener_rep=0.053 cite_end=0.0 cite_para=0.263 contrast=0 caveat=0 q=1
  FAIL short_share=0.032 (limit >= 0.08): need at least ~1 in 12 sentences that is very short

/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/705-taiwan-visa-residence-work-study-family.md [ko] sentences=63 mean=111.3 cv=0.516 short=0.016 run3=0.066 opener_rep=0.167 cite_end=0.0 cite_para=0.389 contrast=0 caveat=0 q=2
  FAIL short_share=0.016 (limit >= 0.08): need at least ~1 in 12 sentences that is very short

/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/706-taiwan-arc-renewal-changes-reentry.md [ko] sentences=70 mean=96.6 cv=0.48 short=0.029 run3=0.044 opener_rep=0.19 cite_end=0.0 cite_para=0.381 contrast=0 caveat=0 q=1
  FAIL short_share=0.029 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
```

Support probe, also exit 1:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/704-taiwan-arc-first-application.md --lang de
```

```text
Traceback (most recent call last):
  File "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py", line 211, in <module>
    for p in a.path: rc |= check(p, a.lang or guess_lang(p))
  File "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py", line 182, in check
    m = metrics(open(path, encoding='utf-8').read(), lang)
  File "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py", line 104, in metrics
    short_th = {'ko': 15, 'ja': 18, 'zh-hant': 12, 'en': 8}[lang]
KeyError: 'de'
```

## Structural and hash verification

Executed from `/Users/son7/tseng-arc-visas-20261024/repo`, read-only, exit 0:

```sh
node <<'JS'
const fs=require('fs'),crypto=require('crypto'),matter=require('gray-matter');
const dir='src/content/columns-de';
const files=fs.readdirSync(dir).filter(f=>/^(704|705|706)-/.test(f)).sort();
const all=fs.readdirSync(dir),errors=[],rows=[];
for(const file of files){
 const raw=fs.readFileSync(`${dir}/${file}`,'utf8'),{data,content}=matter(raw);
 const [body,source='']=content.split('## Amtliche Quellen');
 const urls=s=>[...s.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(m=>m[1]);
 for(const key of ['title','seoTitle','summary','published','lastmod','date_display','read_time','topic','author'])if(typeof data[key]!=='string'||!data[key])errors.push(`${file}: ${key}`);
 if(data.published!=='2026-10-24'||data.lastmod!=='2026-10-24'||data.topic!=='visa'||data.author!=='legal-ai-assistant'||JSON.stringify(data.audience)!=='["de"]')errors.push(`${file}: metadata`);
 if(!Array.isArray(data.faq)||data.faq.length!==3||data.faq.some(x=>!x.q||!x.a))errors.push(`${file}: FAQ`);
 if(!Array.isArray(data.categories)||!data.categories.length||!Array.isArray(data.tags)||!data.tags.length)errors.push(`${file}: arrays`);
 if(/^#\s/m.test(content)||/\*\*|<strong\b|<b\b/i.test(content)||/[\t ]+$/m.test(raw))errors.push(`${file}: formatting`);
 for(const u of urls(body)){
  if(/^https?:/.test(u)&&!urls(source).includes(u))errors.push(`${file}: source ${u}`);
  if(u.startsWith('/de/columns/')&&!all.some(f=>f.replace(/^\d+-/,'').replace(/\.md$/,'')===u.slice(12)))errors.push(`${file}: link ${u}`);
 }
 const plain=body.replace(/\[([^\]]+)\]\([^)]*\)/g,'$1');
 const bodyWords=[...new Intl.Segmenter('de',{granularity:'word'}).segment(plain)].filter(x=>x.isWordLike).length;
 rows.push({file,sha256:crypto.createHash('sha256').update(raw).digest('hex'),bodyWords,faq:data.faq.length,sourceUrls:new Set(urls(source)).size});
}
console.log(JSON.stringify({rows,structuralErrors:errors},null,2));
process.exit(errors.length?1:0);
JS
```

Output: `structuralErrors: []`. The three SHA-256 values and body counts were exactly those in the freeze table. FAQ counts were 3/3/3; indexed source URL counts were 12/14/14. All body external links occur in their article's source list. All local `/de/columns/` links resolve to real German filenames. This is not a network-wide HTTP-status check, browser render check or independent legal review.

## Remaining handoff

Root should assign the independent German reviewer to these exact hashes and retain the unsupported-variety evidence. The author has not declared the shared FAIL-zero condition satisfied. No claim is made that the site loader, rendered page, public AI-label behavior or production deployment was independently verified by this author. A German Gold Card/spouse/APRC article does not exist in this repository, so fabricated local links were not added; 705 links the existing 018 and the two new companion drafts.

The unchanged limits are deliberate: no universal new-passport deadline, no blanket right to convert visa-free entry, no automatic effect from a receipt, no promise of German-language legal consultation, and no guarantee of return after card loss. Specific unusual entry categories, older migrant-worker cards and individual overseas travel documents require their route's actual official instructions.
