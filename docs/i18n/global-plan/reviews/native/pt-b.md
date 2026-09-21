# Portuguese native review — part b (pt)
reviewer: Grok 4.6 · date: 2026-09-21 · scope: columns-pt/010-taiwan-gym-injury-lawsuit.md, 011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md, 012-taiwan-overtaking-accident-liability.md (013–018 pending)

## Verdict
naturalness (1 = machine, 5 = native professional): N/A for guidance pack (out of scope), 2/5 so far for columns 010–012
variety used: European Portuguese (pt_PT) as the consistent target — pessoa coletiva, a contar de, « »; 010–012 are French legal prose in Portuguese clothes. Incremental write: 010–012 only.
systemic patterns (max 6, each one line, with 1 example quote):
- French legal lexicon: `"postos de indemnização"`, `"O só facto"`, `"Em contrapartida"` for “by contrast”, `"persiguições … engajadas"`.
- French verbs that reverse or blur meaning: `"sobrepostas"` (overwritten), `"assegurados"` (secured), `"aproximação"` (cross-check).
- Digit-words left as numerals: `"2 veículos"`, `"buzinar 2 vezes"`.
- Gender of attorney Wei Tseng: feminine in 010 (`Fui advogada`) and 011 (`Advogada Wei Tseng`). 012 has no byline.
- 011 correctly generalizes `"As marcas estrangeiras"` (English already dropped Korea). `lang=jpn` on Invest Taiwan is a leftover.
- No file in this batch is native professional Portuguese.

## Findings
| # | sev | cat | file | quote (≤120 chars, verbatim) | problem (English, one line) | suggested Portuguese rewrite |
|---|-----|-----|------|------|------|------|
| 1 | P1 | A | columns-pt/010-taiwan-gym-injury-lawsuit.md | "persiguições possam ser engajadas (告訴乃論之罪)" | Misspelt; French poursuites engagées: 告訴乃論 is prosecution only upon complaint. | "a persecução penal só pode ter lugar mediante queixa (告訴乃論之罪)" |
| 2 | P1 | A | columns-pt/010-taiwan-gym-injury-lawsuit.md | "Qual é a postura da pessoa que treina?" | English headline is “mindset”, not physical posture. | "Qual era a atitude de quem treina?" |
| 3 | P1 | A | columns-pt/010-taiwan-gym-injury-lawsuit.md | "As imagens podem ser sobrepostas na expiração do período de conservação" | English: footage may be overwritten; “sobrepostas” means superimposed. | "As imagens podem ser sobrescritas no termo do período de conservação" |
| 4 | P1 | A | columns-pt/010-taiwan-gym-injury-lawsuit.md | "a fim de facilitar em seguida a aproximação dos documentos" | French rapprochement; English is so materials can be cross-checked. | "para que os documentos possam depois ser confrontados entre si" |
| 5 | P1 | A | columns-pt/010-taiwan-gym-injury-lawsuit.md | "documentos ainda suscetíveis de serem assegurados antes de desaparecerem" | English: evidence that can still be secured; “assegurados” means insured. | "documentos que ainda se possam pôr a salvo antes de desaparecerem" |
| 6 | P1 | A | columns-pt/010-taiwan-gym-injury-lawsuit.md | "infração de ferimento por imprudência (過失傷害)" | French infraction/imprudence; Portuguese criminal law says lesões por negligência. | "crime de ofensa à integridade física por negligência (過失傷害)" |
| 7 | P1 | A | columns-pt/010-taiwan-gym-injury-lawsuit.md | "intimação ao ginásio de pagar 1,57 milhão TWD" | Intimação is a summons; the court ordered payment. also later headlines in 010 | "condenação do ginásio a pagar 1,57 milhões de TWD" |
| 8 | P1 | G | columns-pt/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md | "lang=jpn" | Portuguese page links Invest Taiwan in Japanese. | Keep the same path family but `lang=por` (or `eng` if Portuguese is unavailable). |
| 9 | P1 | A | columns-pt/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md | "Em contrapartida, se os dados do PIF estiverem incompletos" | French en contrepartie (“by contrast”) ≠ Portuguese “contrapartida” (consideration). also 011 later | "Pelo contrário, se os dados do PIF estiverem incompletos" |
| 10 | P1 | A | columns-pt/012-taiwan-overtaking-accident-liability.md | "Esta ordem de sinais e de cessão na mesma via" | “Cessão” is assignment of rights, not yielding the lane. also later “sinal claro de cessão” | "Esta ordem de sinais e de cedência de passagem na mesma via" |
