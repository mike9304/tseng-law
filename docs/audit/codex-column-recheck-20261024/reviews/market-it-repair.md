# Market IT686 / IT688 bounded author repair

Date: 2026-10-24 (Asia/Seoul). Author role: `/root/market_review_it/market_it_repair`, an AI editorial role. This is an author repair and self-check record, not independent approval or a claim of human/native/lawyer review. Independent recheck belongs to `/root/market_review_it`; publication belongs to root.

Owned manuscript paths:

- `repo/src/content/columns-it/686-taiwan-oem-molds-design-files-handover.md`
- `repo/src/content/columns-it/688-italian-business-visitor-taiwan-summons-interpreter-defense.md`

No other manuscript, code, image, checker, or report was edited by this repair author. No commit or publication was attempted.

## Instructions read

Read `work/MARKET-REVIEW-BRIEF.md`, repository `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md`, `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `~/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, `~/tseng-lanes-shared/LESSONS.md`, the `tseng-law-editorial` skill and its independent-review criteria. The retired Fable instructions in historical files were not applied.

## IT688: legal-aid scope clarified

Location: `688-italian-business-visitor-taiwan-summons-interpreter-defense.md:40`.

Before:

> Per l’assistenza legale restano necessari i requisiti previsti dalla norma.

After:

> L’accesso al sistema taiwanese di assistenza legale (法律扶助) richiede invece i requisiti previsti dalla norma.

Reason: the previous generic `assistenza legale` could attach eligibility requirements to the preceding ordinary right to appoint defense counsel. The replacement explicitly identifies Taiwan's legal-aid system. This is a legal-scope clarification, not merely a rhythm edit. It does not make ordinary counsel appointment conditional and does not promise automatic or free assistance. The next sentence, denying automatic entitlement from foreign citizenship alone, is unchanged.

Direct official access on 2026-10-24:

- [Criminal Procedure Code Article 95](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=95): paragraph 1(3) distinguishes selection of counsel from statutory eligibility for legal aid. The latter includes the categories and legally eligible persons identified by the provision. Paragraph 2 concerns suspension when an unrepresented accused says counsel has already been appointed, subject to consent to continue.
- [Article 27](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=27): the accused may appoint counsel at any time; the rule also covers suspects investigated by judicial police. The manuscript's Article 27 and Article 95 general-counsel statements are unchanged.

No Italian legal-aid system name was imported. `法律扶助` names the Taiwan institution unambiguously.

## IT686: three repetitive tails removed; surrounding prose connected

| Location | Before | After | Reason / preserved meaning |
|---|---|---|---|
| Line 34 | `Nome, versione e formato del file delimitano la richiesta. Il responsabile tecnico può aggiungere la funzione prevista e indicare il materiale già ricevuto. Non serve copiare l’intero archivio. L’elenco consente di separare una consegna incompleta da una richiesta nuova, mai compresa nel prezzo.` | `La richiesta identifica nome, versione e formato. Il responsabile tecnico può indicare anche la funzione prevista e il materiale già ricevuto, così da distinguere una consegna incompleta da ciò che non era compreso nel prezzo.` | Deleted the archive-copying tail; connected the technical officer's annotations directly to the inventory's purpose. Name/version/format, intended function, received materials and the boundary between incomplete delivery and extra work remain. The longer sentence joins one action and its purpose; no unrelated legal tests were merged. |
| Line 52 | `Nei rapporti commerciali, il collegamento può estendersi oltre la sola fattura dello stampo. È un punto da risolvere prima del ritiro.` | `Nei rapporti commerciali possono rilevare altri crediti.` | Removed the generic timing admonition and stated the existing practical consequence directly. The preceding sentence still requires checking retention's statutory requirements and exclusions, with both Articles 928 and 929 links intact. This does not state that every unpaid invoice permits retention. |
| Line 62 | `Vanno verificati oggetto protetto, rapporti con il creatore e accordi sui diritti. Il pagamento non risolve tutto.` | `Non automaticamente. Vanno verificati l’oggetto protetto, i rapporti con il creatore e gli accordi sui diritti.` | Removed the vague payment tail. The FAQ now directly answers whether payment automatically gives the commissioner all rights, then supplies the concrete checks. This agrees with the unchanged frontmatter FAQ and Article 12 discussion; `Non automaticamente` answers the actual question rather than adding a generic warning. |

The Article 12 paragraph, including default authorship/economic-rights allocation and the commissioner's ability to use the work when rights remain with the contractor, was preserved byte-for-byte.

Direct official access on 2026-10-24 also checked [Civil Code Article 928](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=928) and [Article 929](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=929). Article 929 concerns the deemed connection for movables possessed and debts arising through business relations between merchants; the manuscript continues to make retention dependent on the referenced statutory conditions. The official page's commencement warning concerns Articles 166-1 and 1223, not these provisions.

## Metadata and preservation evidence

Both files changed `lastmod` only from `2026-10-23` to `2026-10-24`. Their frontmatter otherwise matches the exact pre-repair version, including `published: "2026-10-23"`, `date_display: "23 ottobre 2026"`, internal author provenance, image path/alt/caption and all FAQ metadata.

An in-memory pre-repair snapshot was compared with the final actual files:

| Check | 686 | 688 |
|---|---|---|
| Ordered Markdown link target list unchanged | true | true |
| Ordered body numeric tokens unchanged | true | true |
| Frontmatter differs only in `lastmod` | true | true |

No time limit, sum, statutory number, source URL, qualification, or FAQ conclusion was deleted. Original source consultation labels remain 23 October; this report records the narrower 24 October live refresh rather than claiming every original source was reopened by this author.

## Actual verification

Executed separately against each final manuscript:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-revision-20261024/repo/src/content/columns-it/686-taiwan-oem-molds-design-files-handover.md
[it] sentences=44 mean=16.1 cv=0.462 short=0.182 run3=0.071 opener_rep=0.25 cite_end=0.0 cite_para=0.438 contrast=0 caveat=0 q=3
OK — no variety limit violated

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-revision-20261024/repo/src/content/columns-it/688-italian-business-visitor-taiwan-summons-interpreter-defense.md
[it] sentences=50 mean=15.6 cv=0.454 short=0.2 run3=0.042 opener_rep=0.176 cite_end=0.0 cite_para=0.529 contrast=0 caveat=0 q=0
OK — no variety limit violated

git diff --check -- src/content/columns-it/686-taiwan-oem-molds-design-files-handover.md src/content/columns-it/688-italian-business-visitor-taiwan-summons-interpreter-defense.md
(no output; exit 0)
```

The initial literal deletion of IT686's three tails returned CV 0.416; the connected inventory paragraph and concise retention consequence returned 0.441. Neither was represented as a pass. The final FAQ gives the direct answer already supported by the unchanged legal discussion, resulting in 0.462. The metric checker was not changed; no filler was restored, invented anecdote added, or unrelated long sentence assembled.

Section 5 manual self-check:

1. Actual CLI: FAIL 0 for both files; prose reviewed independently of the numerical result.
2. Openings unchanged: 686 starts with the new producer's file-use question; 688 explains the actual document terms 證人 / 被告. Neither has the stock hypothetical opener. Whole-batch comparison remains the locale reviewer's scope.
3. Both retain more than two short sentences; the new inventory sentence connects one officer's action with its practical purpose. No new stacked legal rules or numeric lists were introduced.
4. Re-read paragraph openings and repaired transitions; no mechanical sequence of repeated instruction openings was added.
5. The inventory and document-preparation passages remain uncited practical prose; the repair does not create a repeated statute/caveat template.
6. The legal-aid distinction answers an actual ambiguity; no imagined counterclaim was added. CLI contrast count remains 0 for both.
7. Existing endings still concern the missing-material inventory (686) and the hearing's language/role (688); no sales ending was added.
8. No bold, fictional first-person experience, author claim, checklist command heading or new marketing text.
9. Link targets and numeric sequence were compared directly; Article 12 and ordinary defense rights remain intact. IT688's scope clarification is separately labeled above.

## Versions for independent recheck

| File | Pre-repair SHA-256 | Final SHA-256 |
|---|---|---|
| 686 | `1610512cf140b0f1dfc662e07e0c4b9fcdf853954870fbc587b7ec311d2957dc` | `4a6134359ae66e9dd30dfa1b6774cdc64579427868224774012b05997f7353b6` |
| 688 | `b8151fd32065919b6ef9bd23feec236187bba6eae8fc440c89820af29659c82d` | `b0c866e001db2cf49f9011dd173d9b428359d86a68718ae195913f860d1029a3` |

Author status: bounded repairs complete and ready for independent recheck. No independent PASS or public deployment is claimed here. Image visual review and the other three Italian market articles remain with the assigned locale reviewer.
