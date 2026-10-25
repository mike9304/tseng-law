# Czech independent locale review — initial findings

Reviewer: `/root/expand_locale_cs`; independent of author. Both articles read in full, including metadata, FAQs, localized alt/caption. Verdict: REQUEST_CHANGES, bounded repair pass 1 requested.

Original shared variety checker: actual exit 2 for both files, unsupported cs. This is not a measurement PASS. Evidence: `cs-locale-original-variety.json`.

## src/content/columns-cs/942-czech-supplier-taiwan-email-purchase-order-contract.md

Reviewed full-source SHA-256: `ca6314914222ee103f7d88f471066c605c71c1f8a6b1f4f1c2fc214df3e8f30c`. Image SHA-256: `fbe6798bf66fccdd74d1cf80421188c1da0fb122de6f0ad77625bf4491f46543`.

| File:line | Exact text | Reason | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| src/content/columns-cs/942-czech-supplier-taiwan-email-purchase-order-contract.md:52 | umožňuje nahradit zákonem požadovanou písemnost elektronickým dokumentem | Písemnost denotes a document; the source regulates compliance with a requirement of written form. | umožňuje splnit zákonný požadavek písemné formy elektronickým dokumentem | Yes; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=5 |
| src/content/columns-cs/942-czech-supplier-taiwan-email-purchase-order-contract.md:54 | domněnka osobního podpisu | Opaque Czech legal label; explain that the presumption attributes signing to the person. Certificate conditions and company authority must remain distinct. | domněnka, že dokument podepsala přímo daná osoba | Yes; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=6 |
| src/content/columns-cs/942-czech-supplier-taiwan-email-purchase-order-contract.md:58 | stačí necitlivé shrnutí, označení protistrany, sporná verze objednávky a nejbližší termín | Necitlivé is a calque and sporná verze objednávky may ask for the document itself despite the following confidential-attachment boundary. | stačí shrnutí bez důvěrných údajů, označení protistrany a sporné verze objednávky a nejbližší termín | Yes; no legal scope change |
| src/content/columns-cs/942-czech-supplier-taiwan-email-purchase-order-contract.md:28 | U přeshraničního obchodu je ovšem třeba určit rozhodné právo. | Opening-deletion test: adjacent Article 20 and Taiwan-law scope sentences already supply all information. This sentence previews them without adding a condition. | Delete this sentence only; retain the Article 20 rule and Taiwan-law applicability sentence. | Yes; no legal scope change |

## src/content/columns-cs/943-czech-exhibitor-taiwan-patent-disclosure-priority.md

Reviewed full-source SHA-256: `e6395948c90d21c0682a6197b72508560d47e669f63b962c84fd3e2d9a869c2f`. Image SHA-256: `d28c66a04807a5d524c06bd2ee1912a2c23b5bc60a6ebeaa8c6baec5c2ec35d0`.

| File:line | Exact text | Reason | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| src/content/columns-cs/943-czech-exhibitor-taiwan-patent-disclosure-priority.md:44 | stejné obchodní jméno prototypu samo nestačí. | Obchodní jméno identifies a business or trader, whereas this sentence means a product designation; inappropriate legal/business terminology. | stejné označení prototypu samo nestačí. | Yes; no legal scope change |
| src/content/columns-cs/943-czech-exhibitor-taiwan-patent-disclosure-priority.md:51 | nebo už leží za platným prioritním dnem | Figurative chronology obscures the legally relevant before/after relation. | nebo nastalo až po platném prioritním dni | Yes; no legal scope change |
| src/content/columns-cs/943-czech-exhibitor-taiwan-patent-disclosure-priority.md:38 | Zveřejnění si tedy nerezervuje pořadí. | Inanimate disclosure is given an unnatural reflexive action; describe its actual effect directly. | Samotné zveřejnění dřívější pořadí nezajistí. | Yes; no legal scope change |
| src/content/columns-cs/943-czech-exhibitor-taiwan-patent-disclosure-priority.md:65 | necitlivý popis technologie | Necitlivý sounds insensitive rather than nonconfidential in this context. | popis technologie bez důvěrných údajů | Yes; no legal scope change |

## Image inspection

942: actual WebP viewed; closed laptop, blank sheets, folder, pen and machined metal pieces on a supplier desk. Alt matches. 943: actual WebP viewed; generic metal prototype under a clear cover, open transport case and blurred exhibition hall. Alt matches. Both are fictional non-identifying scenes with no readable text, faces, logos, flags or official records; compositions are distinct. Captions truthfully identify fiction.

## Source cross-check limited to terminology

Reviewer directly opened current MOJ electronic-signature Articles 5 and 6 and patent Articles 28 and 29 on 2026-10-25. The form/signing and priority wording findings preserve their relevant conditions. This is not a substitute for the separate final legal review.

Independent AI editorial review only. No claim of human native-speaker or licensed-lawyer review. No publication performed.
