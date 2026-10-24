# Turkish draft repairs — independent review r1

Review: `reviews/grok-tr-r1.md`. Rules: `briefs/BRIEF.md`, repository editorial voice/frontmatter rules, shared sentence-variety rule and lessons. Checked on 24 October 2026.

Disposition: 9 items addressed. ACCEPTED: 862 M1 and 861 S2 repaired; six conditional source-check SHOULD items verified and retained. REBUTTED: 862 S1's proposed immediate-exercise condition. Only two substantive passages and the corresponding new source-list entry changed. Article 863 and all three frontmatter blocks, including every summary and FAQ, are byte-identical to the starting files.

## 861 — turkish-exporter-taiwan-unpaid-marble-invoices

### S1 — ACCEPTED (verification requested; original retained)

Old → new: “Tayvan Uluslararası Ticaret İdaresinin 2026 tarihli Türkiye raporu, 2025’te Türkiye’den başlıca ithalat kalemleri arasında mermeri sayar.” → same text and existing link.

The [official Türkiye economic/trade report dated 17 April 2026](https://www.trade.gov.tw/Files/PageFile/721527/721527upc0e20260417161307.pdf), PDF page 6 (zero-based page 5), lists “大理石” under “主要進口項目”, with the year “(2025 年)”. This supports the specific Taiwan-imports-from-Türkiye claim. The reviewer expressly requested retention if the PDF contains marble, so this is verification accepted, not an error attributed to the reviewer. Text extraction checked; the screenshot endpoint returned a cache-miss error, so no visual PDF verification is claimed.

### S2 — ACCEPTED (small legal-strength correction)

Old:

> Etkisiz kalan emir, zamanaşımını kesme sonucunu da kaybettirebilir; Medeni Kanun [madde 132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=132) bu riski düzenler.

New:

> Bu durumda, Medeni Kanun [madde 132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=132) uyarınca zamanaşımı kesilmemiş sayılır.

Evidence: `python3 tools/law.py B0000001 132` and the [current official Article 132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=132): “時效因聲請發支付命令而中斷者，若撤回聲請，或受駁回之裁判，或支付命令失其效力時，視為不中斷。”

“視為不中斷” is a definite deemed-non-interruption consequence. “Kaybettirebilir” incorrectly weakened it to a possibility. “Bu durumda” confines the corrected sentence to the immediately preceding Article 515 failure to serve within three months; the distinct Article 519 objection-to-suit/mediation passage remains unchanged.

FAQ/summary: no derivative change. Neither summarizes the Article 515/132 service-failure consequence; FAQ 3 addresses timely objections and the distinct Article 519 result.

## 862 — turkish-importer-taiwan-machine-defect-notice

### M1 — ACCEPTED (foreign-service restriction)

Old:

> Bedelin ödenmemesi de uyuşmazlığa eklenirse, [ihracat faturası ve ödeme emri](/tr/columns/turkish-exporter-taiwan-unpaid-marble-invoices) yazısı diğer tarafın başvurabileceği usulü açıklar.

New:

> Bedelin ödenmemesi de uyuşmazlığa eklenirse, ödeme emri borçluya yurt dışında tebliğ edilecekse bu usul kullanılamaz ([Hukuk Muhakemeleri Kanunu madde 509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509)). [İhracat faturası ve ödeme emri](/tr/columns/turkish-exporter-taiwan-unpaid-marble-invoices) yazısı aynı sınırı Türkiye’den ihracat yapan alacaklı yönünden açıklar.

Evidence: `python3 tools/law.py B0010001 509` and [current official Article 509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509): “督促程序，如聲請人應為對待給付尚未履行，或支付命令之送達應於外國為之，或依公示送達為之者，不得行之。”

The old cross-link implied that the Taiwan seller could use the linked payment-order procedure against this Turkish buyer without stating the foreign-service exclusion. The new passage states the actual test: whether the order must be served abroad. It does not infer an automatic prohibition from Turkish nationality or an overseas creditor's location. The linked article remains relevant to the Turkish exporter's Taiwan collection perspective.

Source list, old → new: no Article 509 entry → “- Tayvan Hukuk Muhakemeleri Kanunu: [madde 509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509).” This matches the new inline source.

FAQ/summary: no derivative change. They concern defect inspection/notification, the Article 365 periods, and replacement of goods, and contain no payment-order availability claim.

### S1 — REBUTTED (proposed condition unsupported; body and FAQ retained)

The reviewer would change “Madde 364 ise sadece türüyle belirlenmiş mallarda ayıpsız mal teslimini istemeye izin verir.” by adding “talebin derhâl ileri sürülmesi kaydıyla”, and would add an immediate-demand requirement to FAQ 3.

Evidence: `python3 tools/law.py B0000001 364` and [current official Article 364](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=364): “買受人得不解除契約或請求減少價金，而即時請求另行交付無瑕疵之物。” The [official English text, Article 364](https://mojlaw.moj.gov.tw/eng/LawContentE.aspx?LSID=fl001351&media=print), uses “the buyer may” and “immediately request the seller”; the [official provision history](https://mojlaw.moj.gov.tw/LawContentExtentHistory.aspx?LSID=FL001351&LawNo=364) confirms the unchanged wording.

This grants the buyer an immediate alternative replacement remedy. It does not express the reviewer's proposed “only on condition that the demand is made immediately” deadline or loss of the right for not doing so. Adding “kaydıyla” would turn permission into a condition. The body sentence, FAQ 3 and summary remain unchanged. This rebuttal does not claim that replacement claims have no applicable time limits; the separate Article 356 prompt inspection/notice duties remain fully stated in the draft.

## 863 — turkish-professionals-taiwan-work-permit-residence

### S1 — ACCEPTED (verification requested; original retained)

Old → new: “Resmî Gold Card açıklamasına göre önceden iş teklifi veya işveren sponsorluğu gerekmez; başvuru sahibinin seçtiği mesleki alanın yeterlilik koşullarını karşılaması gerekir.” → same text and existing link.

The [official Gold Card overview](https://goldcard.nat.gov.tw/en/about/) says “without sponsorship” and “You don’t need to have already secured a job in Taiwan.” Its eligibility section directs the applicant to the relevant ministry and qualification criterion. Both parts of the existing sentence are supported.

### S2 — ACCEPTED (verification requested; original retained)

Old → new: “Bu yolda çalışma izninde kalan istihdam süresinin, oturma vizesi başvurusu sırasında altı aydan fazla olması istenir.” → same text.

[BOCA's resident-visa guide for white-collar workers](https://www.boca.gov.tw/cp-166-276-48430-2.html), work-permit requirement item 2, requires the remaining employment period to be “more than 6 months” at the resident-visa application. The draft correctly describes remaining time, not the permit's total original duration. No numerical correction is needed.

### S3 — ACCEPTED (verification requested; body and FAQ retained)

Old → new, body: “BOCA, Tayvan’a geldikten sonra oturma vizesi alan kişinin süresini ise vizenin düzenlendiği tarihten itibaren otuz gün olarak açıklar.” → same text and link.

Old → new, FAQ 2: “BOCA, Tayvan’a geldikten sonra oturma vizesi alan kişi için vizenin düzenlendiği tarihten itibaren otuz gün belirtir.” → same text.

[The same BOCA guide](https://www.boca.gov.tw/cp-166-276-48430-2.html), Notices item 6, distinguishes entry with a resident visa from obtaining that visa after arrival. For the latter it specifies “within 30 days from the Resident Visa issuance date”. Both draft locations preserve the separate starting events, so no repair is justified.

### S4 — ACCEPTED (verification requested; original retained)

Old → new:

> NIA’nın ilk ikamet başvurusu rehberi, pasaport ve vizeye ek olarak başvuru formu, fotoğraf, ikamet nedenini gösteren belgeler ve adres kanıtı ister. Yurt dışında düzenlenen belgeler için temsilcilik tasdiki gerekir; NIA ayrıca usulüne uygun doğrulanmış veya Tayvan’da noter onaylı Çince çeviri isteyebilir.

→ same text and existing link.

[NIA guideline 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), section 3, covers foreign-document authentication and a discretionary request for verified or domestically notarized Chinese translations: “Documents produced overseas must be authenticated”; “the NIA may request”. Section 3(1)(a)–(d) lists form, photo, passport/residence visa and residence-purpose evidence; 3(1)(g) is “Proof of Current Residence”. The summarized list and mandatory/discretionary distinction match the guide. The draft does not claim an exhaustive list for every application route.

### S5 — ACCEPTED (verification requested; original retained)

Old → new: “NIA rehberindeki bazı sağlık raporu muafiyetleri, deneme programları dışındaki vizesiz ülke vatandaşlığına bağlıdır” → same clause, continuing sentence and existing link.

[NIA guideline 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news), required-documents health-certificate item (4)(b), covers specified dependants of approved professional workers, investors, foreign-company responsible persons and valid Gold Card holders, with the nationality qualification “nationals of visa-exempt countries (excluding countries under visa-exemption trial programs)”. The draft carefully says some exemptions and discusses family members; it does not make this a condition for every health-certificate exemption. No deletion is warranted.

All five items were conditional requests to verify official pages, rather than findings that the existing claims were false. Article 863 remains byte-identical.

## Verification and limits

- Used the existing, sufficiently sized `html/B0000001.html` and `html/B0010001.html` caches with the unmodified `tools/law.py`; no cache was created or changed. The three relevant provisions were also opened on live official MOJ pages. The Civil Code's pending-effect banner names Articles 166-1 and 1223, not Articles 132 or 364. The official database displays a consolidation cutoff of 16 October 2026; the source-access date for this repair is 24 October 2026.
- Exact before/after text comparison passed: 861 has one replaced sentence; 862 has one replaced paragraph and one added source-list bullet; 863 is unchanged. All frontmatter bytes, field order, filenames, summaries and FAQs are unchanged.
- Ruby YAML parsing passed for all three files: 16 ordered fields, three FAQs, `audience: ["tr"]`, and `author: "legal-ai-assistant"`. No bold or body H1. Every substantive inline source is repeated in the source list; internal column links resolve to the read-only Turkish snapshot or these assigned drafts.
- Read the summaries/FAQs against the changed conclusions. No additional FAQ or summary assertion needs repair.
- Only `drafts/tr/861-turkish-exporter-taiwan-unpaid-marble-invoices.md`, `drafts/tr/862-turkish-importer-taiwan-machine-defect-notice.md`, and this log were written.

Final manuscript identities and main-text counts (metadata/source section excluded; visible headings, table cells and contact paragraph included; URLs removed and whitespace normalized):

| Article | SHA-256 | Main-text words | Characters including spaces |
| --- | --- | ---: | ---: |
| 861 | `030a4b71c43dab230cde45b16123e564fb4a45850f123e7462f3880ab8531f9d` | 700 | 5560 |
| 862 | `64ea59531817dc2c5881bff3ccad40058e3a80a2840cd9e26e10f18c2d793945` | 809 | 6408 |
| 863 | `6859d9d7b5d0d86ea13052cb227db1b7e95a698c1b87b4aea0a7167329692888` | 810 | 6468 |

### Sentence-variety command and section 5 self-check

Ran the prescribed shared command with bytecode writing disabled:

```text
PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/tr/861-turkish-exporter-taiwan-unpaid-marble-invoices.md drafts/tr/862-turkish-importer-taiwan-machine-defect-notice.md drafts/tr/863-turkish-professionals-taiwan-work-permit-residence.md
```

Exit 2 for all three: “ERROR measurement unavailable: cannot infer language …; supply --lang”. The tool's supported-language list does not include `tr`. This is unavailable measurement, not an official Turkish PASS or FAIL 0.

Supplementary diagnostic only: reused the author note's Unicode/Turkish parsing approach in memory, accommodating the current optional sentence-map arguments, with unchanged word-based thresholds and `Kaynaklar` as the source boundary. No shared script was edited. This diagnostic returned zero threshold failures; it is not native Turkish support or human language certification.

| Article | Sentences | Length CV | Short share | Similar-length triples | Max repeated paragraph opener | Same-start adjacent pairs | Citation-ending share |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 861 | 49 | .476 | .245 | .043 | 1 | 0 | .224 |
| 862 | 58 | .483 | .207 | .107 | 2 | 0 | .052 |
| 863 | 56 | .457 | .214 | .130 | 1 | 0 | .018 |

Section 5 manual check:

1. Official automatic Turkish measurement unavailable, as above; supplementary thresholds have zero failures.
2. Openings remain distinct: labelled shipment example, reader's machine-test question, official passport fact. No stock hypothetical formula introduced.
3. At least two very short sentences remain in each article: “Toplam tek başına yetmez.” / “Her vade ayrı hesaplanır.”; “Güvenlik önceliklidir.” / “Sonraki müdahaleler de kaydedilir.”; “İşveren adı da karşılaştırılır.” / “Başlangıç olayı farklıdır.” No paragraph contains two sentences of 32 words or more in the supplementary segmentation.
4. No paragraph opener occurs three times; no consecutive same-start pair was found.
5. No three-paragraph claim/citation/caveat formula; uncited practical-record paragraphs remain in each article.
6. No unnecessary opposition template was added. The new overseas-service restriction directly answers the review's identified legal issue.
7. Final substantive paragraphs still concern the oldest invoice file, the removed machine part/test record, and the family document calendar.
8. No bold, invented lawyer first-person voice or imperative checklist headings. Korean/Japanese register rules are inapplicable to these Turkish texts.
9. Compared the authorized changes against the starting text: no existing legal provision, period, source, exception or hypothetical label removed. Article 509's new condition has both inline and end-list citations.

Independent bounded readback: PASS from a separate `tseng-editor-final` AI reviewer for all three exact manuscript hashes above and all nine dispositions. The reviewer independently read the actual drafts/log, relevant `law.py` provisions and live official sources; confirmed the corrected Turkish passages and preserved Article 364 body/FAQ; and found no affected summary or FAQ requiring alteration. The reviewer also reproduced the unsupported-Turkish exit 2 and PDF screenshot limitation. No further changes requested.

Review scope is the specified repairs and dispositions, not a new verification of every claim in all three articles, human/native-speaker review, or publication approval. This record concerns local draft repair only.

