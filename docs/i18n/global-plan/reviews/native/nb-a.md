# Norwegian Bokmål native review — part a (nb)
reviewer: Grok 4.6 · date: 2026-09-21 · scope: nb-guidance.txt (365 strings); columns 001–009 pending

## Verdict
naturalness (1 = machine, 5 = native professional): 3/5 for guidance pack, pending for columns
variety used: Bokmål (riksmål-leaning formal), consistent; no Nynorsk mix in the pack. Capital **De / Deres / Dem** throughout (German *Sie*). Number punctuation follows English/German (`TWD 1.57M`), not Norwegian (`1,57 millioner`).
systemic patterns (max 6, each one line, with 1 example quote):
- German pivot, not Norwegian legal style: "arbeidsgrupper", "farbar kommunikasjonsvei", "institutter i andre stater", "Vi følger klienter".
- Capital **De** throughout (German *Sie*); 2026 Norwegian professional sites use **du**.
- English UI leftovers: `OUR TEAM`, `OFFICES`, `(English)`, `(Managing Attorney)`.
- Stock German-legal glue (utlove, prøvingsskritt, ytelse, underretning, uten opphold) in every paragraph.
- Consultation-language lock is intact on FAQ/answers; the inquiry notice drops "bare/kun".
- Gender: Wei Tseng is correctly **hun**; no masculine form in the pack.

## Findings
| # | sev | cat | file | quote (≤120 chars, verbatim) | problem (English, one line) | suggested Norwegian Bokmål rewrite |
|---|-----|-----|------|------|------|------|
| 1 | P1 | E | nb-guidance.txt | "Rådgivningen foregår på fire språk: engelsk, kinesisk (中文), japansk og koreansk." | Inquiry notice lists the four languages without exclusive "bare/kun"; on a Norwegian page that can be read as Norwegian consult being extra. Also in `pages.contact.sections[0].items[1]`. | Rådgivningen foregår bare på fire språk: engelsk, kinesisk (中文), japansk og koreansk. |
| 2 | P1 | A | nb-guidance.txt | "ikke å likestille med institutter i andre stater" | German *Institute* (legal schemes) became Norwegian *institutter* (academic institutes); the 資遣費 caveat is lost. | (資遣費; dette er ikke det samme som sluttvederlag eller etterlønn i norsk rett) |
| 3 | P1 | A | nb-guidance.txt | "Støtt derfor ingen handling i en virkelig sak alene på en artikkel." | Calque of German *stützen Sie keine Handlung*; a native cannot parse the instruction. | Ikke grunn en beslutning i en virkelig sak bare på en artikkel. |
| 4 | P1 | A | nb-guidance.txt | "den lover ikke søkeplassering, støtte, anbefaling fra kunstig intelligens eller synlighet." | *søkeplassering* / *støtte* do not mean search ranking or endorsement; the llms.txt disclaimer lost its meaning. | den lover ikke plassering i søkeresultater, ingen anbefaling, ingen KI-anbefaling og ingen synlighet. |
| 5 | P1 | G | nb-guidance.txt | "OUR TEAM" | English section label left untranslated on the Norwegian lawyers page. | Vårt team |
| 6 | P1 | G | nb-guidance.txt | "OFFICES" | English section label left untranslated on the Norwegian offices block. | Kontorer |
| 7 | P1 | G | nb-guidance.txt | "Fullstendig profil (English)" | English leftover in a Norwegian UI string. | Fullstendig profil (på engelsk) |
| 8 | P2 | C | nb-guidance.txt | "De kan gå tilbake til startsiden på norsk" | Capital **De** (German *Sie*) is archaic after the du-reform; no Norwegian law-firm site writes this in 2026. Throughout the pack. | Du kan gå tilbake til startsiden på norsk |
| 9 | P2 | C | nb-guidance.txt | "Kontoret behandler de vesentlige arbeidsgruppene etter Taiwans rett." | Internal "working groups"; Norwegian firms say fagområder / praksisområder. Also mega, home, services, answers. | Kontoret behandler de viktigste fagområdene i taiwansk rett. |
| 10 | P2 | C | nb-guidance.txt | "Hovering International Law Firm følger klienter fra utlandet" | "følge" = tag along; German *begleiten*. Also about: "Advokat Wei Tseng (曾雋崴) følger klienter fra Korea". | Hovering International Law Firm bistår klienter i utlandet, også med tilknytning til Taiwan, |
| 11 | P2 | C | nb-guidance.txt | "en farbar kommunikasjonsvei" | *gangbarer Weg* calque; "farbar" is for roads. Inquiry copy already has the better "brukbar". | en brukbar kommunikasjonsvei |
| 12 | P2 | C | nb-guidance.txt | "en ytelse på et annet språk utloves ikke" | German *Leistung* / *zusagen*; Norwegian "ytelse" here sounds like a benefit or exam. Also FAQ 3 and contact §1. | rådgivning på et annet språk loves ikke |
| 13 | P2 | B | nb-guidance.txt | "Denne gruppen omfatter kontrakts tvister, erstatning fra rettsstridig handling" | Missing compound "kontraktstvister"; "rettsstridig handling" is German *unerlaubte Handlung*, not Norwegian tort language. | Denne gruppen omfatter kontraktstvister, erstatning utenfor kontrakt og forbrukertvister. |
| 14 | P2 | C | nb-guidance.txt | "utøvelse og bæring av rettigheter og plikter overfor mindreårige barn" | Word-for-word 未成年子女權利義務之行使或負擔; no Norwegian family lawyer writes this. Keep the Chinese gloss; say foreldreansvar. | foreldreansvar for mindreårige barn (未成年子女權利義務之行使或負擔) |
| 15 | P2 | B | nb-guidance.txt | "Vi følger i etterforskningen og for retten, for siktede eller tiltalte like så vel som for fornærmede" | Sentence has no object (German ellipsis); "følger i etterforskningen" is not Norwegian. | Vi bistår siktede, tiltalte og fornærmede under etterforskning og i retten, |
| 16 | P2 | C | nb-guidance.txt | "Sidefortegnelse" | *Seitenverzeichnis* calque for the menu label; Norwegian UI is "Meny". | Meny |
| 17 | P2 | C | nb-guidance.txt | "Presentasjon av de virkende advokatene og kontaktveiene." | German *die tätigen Anwälte*; Norwegian is just "advokatene". | Presentasjon av advokatene og hvordan du tar kontakt. |
| 18 | P2 | C | nb-guidance.txt | "Profiler for Hoverings advokater, operative ledelse og tilknyttede revisjon." | Agreement missing; "tilknyttede revisjon" is not a firm type (German *Partner-Wirtschaftsprüfung*). Also lawyers.description, answers.nb.lawyers, partnerTitle. | Profiler for Hoverings advokater, den operative ledelsen og det tilknyttede revisjonskontoret. |
| 19 | P2 | C | nb-guidance.txt | "Nedenfor de gruppene vi faktisk behandler" | Missing verb; German *Nachfolgend die Gruppen*. | Nedenfor følger gruppene vi faktisk behandler |
| 20 | P2 | C | nb-guidance.txt | "og taler deretter om det mulige arbeidsomfanget, enda nødvendige dokumenter" | "enda" ≠ German *noch* (“still needed”); reads as “even more documents”. | og tar deretter opp mulig arbeidsomfang, dokumenter som fortsatt trengs |
| 21 | P2 | C | nb-guidance.txt | "Ingen av de fire språkene er brukbare — kommunikasjonsveien må bekreftes" | Sounds as if the four languages are useless, not that the user does not speak them. | Jeg behersker ikke noen av de fire språkene — kommunikasjonsmåten må bekreftes |
| 22 | P2 | C | nb-guidance.txt | "Dette nettstedet hostes hos Vercel" | English "hosted" left as a verb; not Norwegian. | Dette nettstedet driftes hos Vercel |
| 23 | P2 | C | nb-guidance.txt | "Deres sending lagres i et ikke-offentlig objektlager" | *objektlager* is a raw calque of object storage. | meldingen din lagres i et ikke-offentlig lager hos denne tjenesten |
| 24 | P2 | C | nb-guidance.txt | "Denne siden har ingen nødkanal" | *nødkanal* is a German *Notkanal* coinage. | Denne siden har ingen nødlinje og lover ingen svartid |
| 25 | P2 | C | nb-guidance.txt | "denne siden er ikke rådgivningssteget." | German *Beratungsschritt* coinage; not a Norwegian noun. | denne siden er ikke et rådgivningsmøte. |
| 26 | P2 | C | nb-guidance.txt | "Sendes en forespørsel med hell" | German *mit Erfolg*; Norwegian does not send "with luck/success" this way. | Når en forespørsel blir sendt, varsler systemet kontoret. |
| 27 | P2 | C | nb-guidance.txt | "Hver lenke angir listen språk" | Ungrammatical: "listen språk" has no genitive/preposition. | Hver lenke oppgir hvilket språk listen er på |
| 28 | P2 | C | nb-guidance.txt | "Kartforhåndsvisning" | German *Kartenvorschau*; Norwegian UI is "Forhåndsvisning av kartet". | Forhåndsvisning av kartet |
| 29 | P2 | C | nb-guidance.txt | "Område Korea-drift, Hovering International Law Firm" | Machine rendering of “Korea Operations”. | Korea-drift, Hovering International Law Firm |
| 30 | P2 | D | nb-guidance.txt | "og oppnådde en dom i første instans på TWD 1.57M" | English million shorthand and `.` decimal; a Norwegian reader may not parse the amount. Also reads as a won-result boast. | og fikk i første instans et erstatningskrav på 1,57 millioner TWD |
| 31 | P2 | B | nb-guidance.txt | "Bachelor (B.A.) med dobbelt løp rett og finans" | German *Doppelstudium* / *Recht*; Norwegian says jus, not "rett" as a study name. | Bachelor (B.A.) med to studieretninger, jus og finans, National Chengchi University |
| 32 | P2 | G | nb-guidance.txt | "Ledende advokat i Taiwan (Managing Attorney)" | English job titles left in parentheses on every role line. | Ledende advokat i Taiwan |
| 33 | P2 | C | nb-guidance.txt | "昊 («vid himmel»)" | Ungrammatical gloss (missing article). | 昊 («den vide himmelen») |
| 34 | P2 | C | nb-guidance.txt | "Kort fremstilling av saken (på Deres språk)" | German *kurze Darstellung*; the form field should say beskrivelse. | Kort beskrivelse av saken (på ditt språk) |
