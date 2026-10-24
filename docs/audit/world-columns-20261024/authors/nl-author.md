# Nederlandse auteursnotitie — 834–836

Datum en juridische peildatum: 24 oktober 2026. Opdracht: uitsluitend Nederlandse concepten, zonder publicatie. Dit is een auteurscontrole met brononderzoek, geen verklaring van advocaatcontrole of moedertaalcontrole.

## Gelezen materiaal en werkwijze

Volledig gelezen: `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md` en `rules/LESSONS.md`. Ook de afzonderlijke bestanden `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md` en `/Users/son7/tseng-lanes-shared/LESSONS.md` zijn gelezen. De laatste twee wijken af van de batchkopieën; onder meer de lokale checker ondersteunt minder talen dan de bijgewerkte batchregel beschrijft.

Het genoemde algemene bestand `/Users/son7/agent-library/knowledge/editorial-voice.md` ontbreekt op deze machine. De verplichte volledige huisstijl in `repo/docs/columns/EDITORIAL-VOICE.md` is daarom toegepast, naast de aanwezige verwijzingsregel `COLUMN-VOICE-RULE.md`. Er is geen gelijkheid met het ontbrekende bestand geclaimd. De historische Fable-verplichtingen zijn niet toegepast, overeenkomstig de gebruikersbeslissing.

De drie volledig gelezen Nederlandse vergelijkingscolumns zijn:

- `repo/src/content/columns-nl/009-taiwan-voluntary-resignation-severance.md`;
- `repo/src/content/columns-nl/013-taiwan-company-establishment-advanced-1.md`;
- `repo/src/content/columns-nl/015-taiwan-company-setup-pitch-location.md`.

Zij leveren de gebruikte categorieën, de datumvorm `24 oktober 2026` en het patroon `N minuten leestijd`. Hun publieke datumaanduiding is gelijk; ze worden hier niet voorgesteld als een bewezen chronologische top drie. De keuze is inhoudelijk: arbeidsrecht, oprichting en vestigingsadres.

Volledig gelezen structurele bronnen: EN 001, EN 004, ES 656 en EN 507 voor B-SETUP; EN 352 voor B-HIRE; FR 654 voor P-WHV. Hun opbouw en juridische onderscheidingen zijn benut, hun Koreaanse, Amerikaanse, Franse, Belgische of Canadese landvoorwaarden niet overgenomen. Ook oudere contactgegevens, openbare auteursvoeten en niet-onderbouwde ervaringsclaims zijn niet overgenomen.

`research/country-facts.md` was zowel bij de eerste controle als bij de controle na het schrijven afwezig. De Nederlandse programmacondities en verdragsstatus zijn rechtstreeks met Taiwanese overheidsbronnen geverifieerd. De keuze P-WHV in plaats van P-WORK is de expliciet toegestane keuze uit de Nederlandse toewijzing; er is geen vervangend onderwerp buiten die toewijzing gekozen.

Iedere gebruikte verwijzing naar Taiwanese wetgeving is vóór gebruik met `tools/law.py` opgehaald en met de Chinese tekst vergeleken. Het script schrijft normaal een cache buiten de toegestane uitvoerpaden. Daarom is hetzelfde, ongewijzigde script via `runpy.run_path` uitgevoerd, met uitsluitend zijn hardgecodeerde cachepad tijdelijk in het proces omgeleid naar `drafts/nl/.law-cache`. `HOME`, het script en de gedeelde cache zijn niet gewijzigd. De onderstaande tabellen bewaren de relevante gecontroleerde fragmenten. De eigen tijdelijke cache is na de laatste controle verwijderd.

De inkomstenbelastingwet gaf de waarschuwing `部分條文尚未生效`. De toelichting op de officiële pagina koppelt die aan het in 2016 toegevoegde artikel 43-4, waarvan de ingangsdatum nog niet is bepaald. Dat artikel wordt nergens gebruikt. Ook artikel 126 is met `tools/law.py` gecontroleerd. De gebruikte artikelen 7, 8, 10, 71-1 en 124 vallen niet onder die openstaande inwerkingtreding. De twee belastingpassages vermelden daarom uitdrukkelijk de peildatum 24 oktober 2026.

De belastingovereenkomst is afzonderlijk in het officiële Engelse PDF van het Taiwanese ministerie van Buitenlandse Zaken gelezen; het is geen via een pcode door `law.py` ontsloten Taiwanese wet. De verdragsstatus is daarnaast gecontroleerd in de actuele lijst van het ministerie van Financiën.

## 834 — Nederlandse onderneming met lokale onderhoudsactiviteiten

Bestand: `drafts/nl/834-dutch-company-taiwan-subsidiary-branch-office.md`.

Lezer en aanleiding: de beslisser bij een Nederlandse leverancier die in Taiwan onderhoud wil uitvoeren en onderdelen wil aanhouden, terwijl de contractpartij nog niet vaststaat. De openingssituatie is in de zin zelf als fictief gemarkeerd.

Waarom Nederland: de opdracht noemt Nederlandse technische leveranciers. De officiële [toespraak over de economische relatie met Nederland](https://en.mofa.gov.tw/News_Content.aspx?n=1575&s=121232) beschrijft de verbinding tussen Nederlandse apparatuur en Taiwanese halfgeleiderproductie. Dat ondersteunt de sectorale aansluiting, niet de frequentie van een bepaald juridisch probleem. De behoefte aan onderhoudscontracten, onderdelenvoorraad en een eerste vestiging blijft een redactionele hypothese. Geen handelscijfers, marktposities of klantenaantallen zijn uit de toespraak overgenomen. De concrete Nederlandse juridische aanknoping is de geverifieerde belastingovereenkomst.

Overlap en nieuwe invalshoek: 013 behandelt losse oprichtingsvragen, 015 het adres en 004 de algemene structuurkeuze. Dit concept vertrekt vanuit het onderhoudscontract en de partij die verplichtingen aangaat. Het laat de oprichting, investeringsgoedkeuring, kapitaalcontrole en toestemming om zelf te werken afzonderlijk zien. Het Nederlandse verdrag vervangt de Koreaanse verdragspassages uit de structurele bronnen. EN 507 heeft geholpen bij het onderscheid tussen aandeelhouder, buitenlandse moeder en lokale rechtspersoon; een geschil over inzagerechten valt buiten deze column.

### Bewering → bron → gecontroleerde tekst

| Bewering | Officiële bron | Gecontroleerd Chinees fragment of brongegeven |
|---|---|---|
| Taiwanese vennootschap is een rechtspersoon | [Vennootschapswet 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=1) | `依照本法組織、登記、成立之社團法人` |
| Een filiaal maakt deel uit van de hoofdonderneming | [Vennootschapswet 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=3) | `所稱分公司，為受本公司管轄之分支機構` |
| Eén aandeelhouder volstaat voor de limited company | [Vennootschapswet 98](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=98) | `有限公司由一人以上股東所組成` |
| Buitenlandse rechtspersonen kunnen investeerders zijn | [Buitenlandse-investeringenwet 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=3) | `本條例所稱外國人包括外國法人` |
| Inbreng beperkt de aandeelhoudersaansprakelijkheid, met een nauw omschreven misbruikuitzondering | [Vennootschapswet 99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=99) | `以其出資額為限`; `股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者，該股東應負清償之責` |
| Bedrijfsuitoefening onder de buitenlandse naam vergt filiaalregistratie | [Vennootschapswet 371](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371) | `非經辦理分公司登記，不得以外國公司名義在中華民國境內經營業務` |
| Filiaal vereist afzonderlijke bedrijfsmiddelen en een verantwoordelijke vertegenwoordiger in Taiwan | [Vennootschapswet 372](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=372) | `應專撥其營業所用之資金，並指定代表為在中華民國境內之負責人` |
| Vertegenwoordigingskantoor wordt geregistreerd; geen vrijbrief voor lokale betaalde dienstverlening | [Vennootschapswet 386](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=386), gelezen met 371 | `因無意在中華民國境內設立分公司營業`; `設置辦事處者，應申請主管機關登記`. Het gevolg voor onderhoud is uitdrukkelijk een toepassing van beide bepalingen, geen verbod op ieder vertegenwoordigend contract. |
| Verboden en beperkte investeringssectoren | [Buitenlandse-investeringenwet 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=7) | `下列事業禁止投資人投資`; voor beperkte sectoren: `應取得目的事業主管機關之許可或同意` |
| Investering en planwijziging vereisen goedkeuring | [Buitenlandse-investeringenwet 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=8) | `應填具投資申請書，檢附投資計畫及有關證件，向主管機關申請核准。投資計畫變更時，亦同` |
| Inbreng binnen individuele termijn; controle en vaststelling bedrag | [Buitenlandse-investeringenwet 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) | `於核定期限內全部到達，並將到達情形報請主管機關查核`; `實行出資後，應向主管機關申請審定投資額` |
| Kapitaalcontrole door accountant; stukken bij aanvraag of binnen dertig dagen na registratie | [Vennootschapswet 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=7) | `應經會計師查核簽證`; `於申請設立登記時或設立登記後三十日內，檢送` |
| Oprichting geeft geen automatische werktoestemming | [Wet op de arbeidsbemiddeling 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作` |
| Algemene Nederlandse belastingovereenkomst in werking | [MOF-verdragenlijst, Nederland](https://www.mof.gov.tw/singlehtml/191?cntId=63930) | `荷蘭`; ondertekening `2001/02/27`; inwerkingtreding `2001/05/16`. Niet verward met een uitsluitend scheep- of luchtvaartverdrag. |
| Verdrag vereist toets van de fiscale woonplaats en passende inkomstenbepaling | [Overeenkomst, artikelen 1 en 4](https://no06.mofa.gov.tw/mofatreatys/ShowPicOut.aspx?FileFolder=14&FileName=14210_E.PDF) | Officieel Engels gecontroleerd: `resident of a territory`; geen zelfgemaakte Chinese vertaling als gecontroleerde brontekst gepresenteerd. |

### Eerste twee alinea's: schrappingstest

| Zin | Beslissing en reden |
|---|---|
| “Een Nederlandse leverancier wil … (fictief voorbeeld).” | Behouden: onderhoud en voorraad bepalen het concrete bedrijfsmodel; fictiemarkering blijft staan. |
| “Moet de Nederlandse onderneming zelf contractpartij worden …?” | Behouden: geeft de nog te nemen juridische keuze. |
| “Leg daarvoor het conceptcontract naast de geplande werkzaamheden.” | Behouden: noemt de twee te vergelijken documenten/gegevens. |
| “Noteer wie de factuur verstuurt …” | Behouden: specificeert facturering, uitvoering en goederenlocatie. |
| “Voeg de verlangde garanties toe.” | Behouden: afzonderlijk gegeven dat de betrokkenheid van de moeder kan beïnvloeden. |
| “Het antwoord bepaalt welke oprichtingsroute moet worden uitgewerkt.” | Geschrapt: herhaalde slechts de vraag. Geen voorwaarde of bron verloren. |
| “Zo wordt zichtbaar welke verplichtingen de klant … wil laten …” | Geschrapt: herhaalde de contractpartijkeuze zonder nieuwe voorbereiding. |

### Vergelijking met drie Nederlandse columns

| Bestaande column | Opening, koppen en einde | Keuze voor 834 |
|---|---|---|
| 009 | Verwijst terug naar eerdere uitleg; genummerde uitzonderingen; algemene aansporing over timing. | Zelfstandig fictief contractprobleem, vier inhoudelijke koppen, afsluiting met een concreet overzicht bij het contract. |
| 013 | Begint met oprichtingservaringen en een aankondiging van vragen; vijf Q&A's; algemene contactverwijzing. | Geen ervaringsclaim of Q&A-raamwerk. Rechtsvormen en investeringsmomenten volgen de voorgenomen activiteit. |
| 015 | Begint met een geografische beperking en adresprobleem; een vraagvorm en herhaalde controleaansporing; algemene verwijzing naar advocaat en gewijzigde regels. | Adrescontrole krijgt slechts een gerichte interne verwijzing. Het einde gaat over contractpartijen, niet over een algemene voorzichtigheidsboodschap. |

Niet opgenomen: een vaste oprichtingsduur, een gegarandeerde bankacceptatie en een universeel vereist investeringsbedrag. De officiële Invest Taiwan-pagina over kapitaal leverde een geïndexeerd overheidsfragment, maar volledige herhaalde directe opening liep vast; de afwezigheid van een algemeen minimum is daarom niet als zelfstandig geverifieerde stelling gepubliceerd. De kapitaalpassage beperkt zich tot het volledig opgehaalde artikel 7 en een praktische kasbegroting. Verdragspercentages, Nederlandse belastinguitkomsten en vergunningdrempels voor buitenlandse managers zijn buiten de gekozen vraag gehouden.

## 835 — Al geselecteerde kandidaat, nog geen lokale onderneming

Bestand: `drafts/nl/835-dutch-employer-taiwan-first-hire-eor.md`.

Lezer en aanleiding: een Nederlandse leverancier die een Taiwanese service-engineer al heeft gesproken of geselecteerd en daarna een EOR wil inschakelen. De opening is een echte voorbereidingsvraag, geen verzonnen klantgeschiedenis.

Waarom Nederland: het profiel van een technische leverancier sluit aan bij de opdracht en de hierboven genoemde officiële economische relatie. Dat Nederlandse ondernemingen juist deze wervingsvolgorde zouden gebruiken, is een redactionele hypothese, geen gemeten gedrag. Het Nederlandse belastingverdrag maakt de fiscale analyse inhoudelijk anders dan de Amerikaanse structurele bron EN 352. De dienstenbepaling voor hetzelfde of een samenhangend project past bij de werkzaamheden van de gekozen lezer.

Overlap en nieuwe invalshoek: bestaande Nederlandse arbeidscolumns behandelen vooral vertrek en vergoedingen. Deze tekst begint vóór de eerste werkdag, met de al gemaakte selectie. B-SETUP krijgt slechts een interne link. Het verband tussen de wervingschronologie, verplichte werkgevershandelingen en de verdragsdefinitie van een vaste inrichting vormt de nieuwe invalshoek.

### Bewering → bron → gecontroleerde tekst

| Bewering | Officiële bron | Gecontroleerd Chinees fragment of brongegeven |
|---|---|---|
| Ondergeschiktheid en feitelijke aansturing zijn relevant voor arbeids- en uitzendrelatie | [Arbeidsnormenwet 2, onderdelen 6–10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2) | `約定勞雇關係而具有從屬性之契約`; inlener: `實際指揮監督管理派遣勞工從事工作者`. De analyse is voorwaardelijk, niet elke aanbieder met het etiket EOR is automatisch hetzelfde. |
| Arbeidscontract tussen uitlener en werknemer is voor onbepaalde tijd | [Arbeidsnormenwet 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=9) | `派遣事業單位與派遣勞工訂定之勞動契約，應為不定期契約` |
| Verbod interview/aanwijzing vóór het contract bij de uitlener | [Arbeidsnormenwet 17-1, lid 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=17-1) | `不得於…簽訂勞動契約前，有面試該派遣勞工或其他指定特定派遣勞工之行為` |
| Negentig dagen: overtreding én ontvangen arbeid én schriftelijk verzoek | [Arbeidsnormenwet 17-1, lid 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=17-1) | `違反前項規定，且已受領…勞務者`; `自…提供勞務之日起九十日內，以書面…提出` |
| Tien dagen na ontvangst; contract vanaf volgende dag bij uitblijven onderhandeling of overeenstemming; bescherming tegen benadeling | [Arbeidsnormenwet 17-1, leden 3–5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=17-1) | `意思表示到達之日起十日內`; `逾期未協商或協商不成立者`; `自期滿翌日成立勞動契約`; `前項行為之一者，無效` |
| Reikwijdte werknemerspensioen en werkgeversbijdrage minstens 6% | [Pensioenwet 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030020&flno=7), [14](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030020&flno=14) | `適用勞動基準法`; `但依私立學校法…不適用之`; `一、本國籍勞工`; `不得低於勞工每月工資百分之六`. Uitzondering is in de tekst behouden. |
| Werkgever/betrokken organisatie verzorgt NHI-inschrijving; drie dagen vanaf voldoen aan voorwaarden | [Zorgverzekeringswet 15](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0060001&flno=15) | `以其服務機關、學校、事業、機構、雇主或所屬團體為投保單位`; `合於投保條件之日起三日內` |
| Buitenlander op eigen naam voor een ander aannemen is verboden | [Arbeidsbemiddelingswet 57, onderdeel 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=57) | `以本人名義聘僱外國人為他人工作`. Geen algemene belofte dat een EOR een vergunning kan sponsoren. |
| Binnenlandse vaste bedrijfsplaats/bedrijfsagent | [Inkomstenbelastingwet 10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=10) | `經營事業之固定場所`; `除代理採購事務外，並有權經常…接洽業務，並簽訂契約者`. De inkoopuitzondering staat in de tekst. |
| Verdragsanalyse: bedrijfsplaats, contractsluitende vertegenwoordiger, uitzonderingen en winsttoerekening | [Overeenkomst, artikelen 5 en 7](https://no06.mofa.gov.tw/mofatreatys/ShowPicOut.aspx?FileFolder=14&FileName=14210_E.PDF) | Engels gecontroleerd: art. 5 leden 1, 4, 5 en 6; art. 7 lid 1. Voorbereidende/ondersteunende activiteiten en de onafhankelijk-agentuitzondering zijn behouden. Geen automatische belastingvrijstelling door de EOR. |
| Diensten via personeel: hetzelfde of samenhangend project, meer dan 183 dagen in twaalf maanden | [Overeenkomst, artikel 5 lid 3 onder b](https://no06.mofa.gov.tw/mofatreatys/ShowPicOut.aspx?FileFolder=14&FileName=14210_E.PDF) | `same or a connected project`; `more than 183 days within any 12-month period`. Geen kalenderjaargrens; andere vestigingsgronden blijven afzonderlijk gelden. |

### Eerste twee alinea's: schrappingstest

| Zin | Beslissing en reden |
|---|---|
| “Kan een Nederlandse leverancier … eerst zelf selecteren …?” | Behouden: geeft de concrete handeling en de voorgenomen constructie. |
| “Bij een arbeidsuitzendconstructie verbiedt artikel 17-1 …” | Behouden: direct antwoord met de exacte volgorde en reikwijdte. |
| “Die volgorde raakt juist bedrijven … nog geen Taiwanese vestiging.” | Behouden: benoemt de specifieke organisatorische uitgangssituatie. |
| “Bewaar daarom de data van het eerste gesprek …” | Behouden: vier verschillende momenten voor de feitencontrole. |
| “Achteraf kan een discussie ontstaan over wat al was afgesproken.” | Geschrapt: algemene mogelijkheid zonder nieuwe informatie. |
| “Een chronologie maakt dat controleerbaar.” | Geschrapt: herhaalde het nut van de voorgaande concrete voorbereiding. |

### Vergelijking met drie Nederlandse columns

| Bestaande column | Opening, koppen en einde | Keuze voor 835 |
|---|---|---|
| 009 | Terugverwijzing, uitzonderingenlijst, algemene timingwaarschuwing. | Directe vraag vóór indiensttreding; termijnkop met negentig en tien dagen; einde vraagt naar interviewdatum en werkstart. |
| 013 | Ervaringsintro, vijf vragen als raamwerk, algemene taal/contactzin. | Geen praktijkervaring geclaimd. De wervingsregel staat al vóór de eerste kop; EOR, tijdlijn, maandfactuur en fiscale activiteit volgen een eigen volgorde. |
| 015 | Adresprobleem, lokale controle en instructies, algemene afloop. | Geen kantooradres als ingang. De koppen noemen werkgeversrol, termijnen, factuur en verkoopbevoegdheid; de afsluiting blijft bij de gekozen kandidaat. |

Niet opgenomen: de ongeclausuleerde stelling dat iedere rechtstreeks ingehuurde persoon automatisch werknemer is, dat iedere EOR exact dezelfde juridische constructie heeft, of dat een buitenlandse onderneming zonder registratie categorisch geen enkele verzekeringsoplossing kan hebben. Ook een gegarandeerde vergunning via een EOR is niet gepubliceerd. Er is geen onderbouwde uitspraak over een specifieke aanbieder beschikbaar. De Amerikaanse stelling uit EN 352 dat een algemeen belastingverdrag ontbreekt is voor Nederland juist ongeschikt en is vervangen. Nederlandse arbeidsrechtelijke en fiscale uitkomsten zijn niet behandeld.

## 836 — Nederlandse werkvakantie, werk en vertrekdatum

Bestand: `drafts/nl/836-dutch-working-holiday-taiwan-work-insurance-tax.md`.

Lezer en aanleiding: een Nederlander binnen de leeftijdsgrens die een reis met tijdelijk werk wil financieren, of al in Taiwan verblijft en werk, verzekering en vertrek moet organiseren.

Waarom Nederland: het programma is rechtstreeks bevestigd in de Taiwanese landenlijst en de Nederland-specifieke BOCA-pagina. De keuze berust dus op een bestaand programma. De behoefte aan uitleg over een verblijf dat de jaarwisseling passeert is een redactionele hypothese; geen aantallen deelnemers, aanvragen of geschillen worden beweerd.

Overlap en nieuwe invalshoek: de bestaande Nederlandse columns bevatten arbeidsrecht en algemene bedrijfsoprichting, maar de geselecteerde voorbeelden behandelen niet de Nederlandse werkvakantie. FR 654 levert de scheiding tussen werktoestemming, bezoekersstatus, verzekering en belasting. De Nederlandse leeftijd, middelenvereiste, permanente-werkbeperking en aanvraaglocatie zijn afzonderlijk gecontroleerd; Belgische beperkingen en Canadese aanvraaguitzonderingen zijn niet overgenomen.

### Bewering → bron → gecontroleerde tekst

| Bewering | Officiële bron | Gecontroleerd Chinees fragment of brongegeven |
|---|---|---|
| Nederlands programma, jaarlijks quotum en leeftijd | [MOFA-partnerlandenlijst](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6426) | Nederlandse rij gecontroleerd: 100; 18–30; programma sinds 2020-04-01. Quotum is niet gepresenteerd als actuele beschikbaarheid. |
| Eigen land, eerste deelname, vakantiedoel, persoonlijke aanvraag en visumwijziging | [MOFA-programmavragen](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6440) | Vragen 1–9 gecontroleerd. Algemene bedragen/leeftijden uit deze FAQ zijn niet gebruikt waar de Nederlandse fiche specifieker is. |
| Nederlandse documenten, startmiddelen, visumtermijnen en werkvoorwaarden | [BOCA, Nederlandse deelnemers](https://www.boca.gov.tw/fp-153-5491-8dfd1-2.html) | Nederland-specifieke onderdelen over aanvraag, visumcategorie en werk gelezen. Voor permanent werk staat: `not engage in work of a permanent nature`. De genoemde voorwaarden zijn een selectie, geen vervanging van de volledige aanvraaglijst. |
| Verlengingsaanvraag en totale jaargrens | [MOFA, vraag 14](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6440) | Verlenging bij het plaatselijke NIA-servicecentrum; gelezen naast de preciezere Nederlandse BOCA-fiche voor de eerste binnenkomst en de dag na aankomst. |
| Werkvakantievisum geldt als werkvergunning, maximaal één jaar | [Tewerkstellingsregeling 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=4) | `非以入國工作為主要目的之國際書面協定`; `入國簽證，視為工作許可`; `期限，最長為一年` |
| NHI vereist verblijfsdocument én aanvullende grond | [Zorgverzekeringswet 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0060001&flno=9) | `領有居留證明文件，並符合下列各款資格之一者`; `在臺居留滿六個月`; `有一定雇主之受僱者`. Geen verwisseling van EN met OF tussen document en aanvullende grond. |
| Alleen het werkvakantiebezoekersvisum vervult die NHI-documentvoorwaarde niet | Artikel 9, gelezen met [BOCA-visumcategorie](https://www.boca.gov.tw/fp-153-5491-8dfd1-2.html) | Juridische gevolgtrekking uit beide bronnen. De algemene MOFA-NHI-FAQ noemt Nederland niet afzonderlijk; zij is daarom niet als expliciete bevestiging voor Nederlanders gebruikt. |
| Arbeidsongevallenverzekering voor werknemers vanaf vijftien jaar bij onder meer geregistreerde/fiscaal ingeschreven werkgevers; geen personeelsminimum | [Arbeidsongevallenwet 6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=6) | `年滿十五歲以上`; `依法已辦理登記、設有稅籍`; `應以其雇主為投保單位`. De onder-vijftien-uitzondering valt buiten de 18–30-doelgroep en is niet ontkend. |
| Zonder Taiwanese woonplaats: 183 dagen in één belastingjaar voor fiscaal inwonerschap | [Inkomstenbelastingwet 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=7) | `在中華民國境內無住所，而於一課稅年度內…居留合計滿一百八十三天者` |
| Belastingjaar volgt kalenderjaar | [eTax-uitleg, onderdeel 3](https://www.etax.nat.gov.tw/etwmain/en/announcement/alien-individual-income-tax/instructions) | Definitie van het belastingjaar gecontroleerd; geen belastingtarieven of vrijstellingen uit een ander jaar overgenomen. |
| Broninkomen voor werk in Taiwan; beperkte negentigdagenuitzondering | [Inkomstenbelastingwet 8, onderdeel 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=8) | `在中華民國境內提供勞務之報酬`; uitzondering: `非…居住之個人`; `不超過九十天`; `境外僱主`. Alle voorwaarden blijven samen staan. |
| Bijzondere regels van toepasselijk verdrag gaan voor | [Inkomstenbelastingwet 124](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=124) | `所得稅協定中，另有特別規定者，依其規定` |
| Afrekening vóór vertrek bij beëindiging woon-/verblijfplaats; uitzondering achterblijvende echtgenoot | [Inkomstenbelastingwet 71-1, lid 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=71-1) | `於年度中廢止…住所或居所離境者，應於離境前…辦理結算申報納稅`; `但其配偶如為…居住之個人，仍繼續居住…應由其配偶…合併辦理` |

### Eerste twee alinea's: schrappingstest

| Zin | Beslissing en reden |
|---|---|
| “Honderd plaatsen per jaar …” | Behouden: concreet Nederlands quotum, met primaire bron. |
| “De leeftijdsgrens is 18 tot en met 30 jaar bij de aanvraag.” | Behouden: zelfstandige toelatingsvoorwaarde en correct toetsmoment. |
| “Een plaats op die lijst zegt nog niets …” | Behouden: voorkomt verwarring tussen jaarlijks quotum en werkelijk beschikbare plaatsen. |
| “Wie reizen wil combineren … vakantiedoel vooropstellen.” | Behouden: doelvoorwaarde maakt duidelijk voor welke lezer de route past. |
| “Voor een vaste baan die al vóór vertrek het hoofddoel vormt …” | Behouden: concrete grens van het programma, zonder een andere vergunning te beloven. |
| “Dat onderscheid staat in de officiële programma-uitleg.” | Als afzonderlijke zin geschrapt; de bron is naar de inhoudelijke zin verplaatst. Feit en link behouden. |

### Vergelijking met drie Nederlandse columns

| Bestaande column | Opening, koppen en einde | Keuze voor 836 |
|---|---|---|
| 009 | Algemene terugverwijzing, genummerde arbeidsrechtelijke uitzonderingen, tijdswaarschuwing. | Begin met geverifieerd Nederlands quotum. Vier koppen behandelen aanvraag, twee einddata, dekking en belastingjaar; einde noemt loonstrook en vlucht. |
| 013 | Algemene ervaring met oprichting en verblijfskaart, Q&A, kantoorcontact. | Geen oprichting of ARC als ingang; bezoekersvisum precies benoemd. De bronnenlijst is het enige structurele slot. |
| 015 | Lokaal adresvoorbeeld, herhaalde controle-instructies, algemene afsluiting. | Tijdlijn van een tijdelijke reiziger. De verzekeringsvraag staat in de lopende tekst, zonder alle koppen in vraagvorm te zetten. |

Niet opgenomen: actuele resterende plaatsen, een gegarandeerde behandelingstermijn, een maximumduur bij dezelfde werkgever dat niet in de Nederlandse fiche is aangetroffen, Belgische zesmaandsbeperkingen, Canadese indiening vanuit Taiwan, een automatisch recht op omzetting, of Nederlandse verzekeringsdekking. Uit de algemene MOFA-FAQ is het lagere generieke middelenbedrag niet overgenomen; de Nederlandse fiche is leidend. De status van Nederlandse zorgverzekeringen vereist beoordeling van de concrete polis en valt buiten deze Taiwanese column. Geen belastingvrijstelling uitsluitend op grond van het visum of minder dan 183 dagen wordt beloofd.

## Redactionele correcties en betekenisbehoud

| Probleemzin of patroon | Reden | Herziening | Betekenisbehoud |
|---|---|---|---|
| 834: vier alinea's begonnen met “Een”; drie met “Voor”. | MONOTONY: gelijke alinea-aanzetten — “Een filiaal …”, “Een gehuurd adres …” — onderwerp en handelende partij variëren. | Filiaal begint met “Het filiaal”; adres met “De column”; contact met “U kunt”. | Bronlinks en rollen behouden. |
| 834: opeenvolgende zinnen over kapitaalcontrole en indiening waren vrijwel gelijk van lengte. | MONOTONY: ritme — “Voor het kapitaal …” / “De stukken moeten …” — samenhangende handelingen verbinden. | Eén zin over controle plus indieningsmoment; daarop kortere begrotingszinnen. | Accountant, alternatieve indieningsmomenten en dertig dagen behouden. |
| 834: “kan die begrenzing doorbreken”. | Te weinig zicht op noodzakelijkheid en op het verplichte gevolg zodra de voorwaarden van art. 99 zijn vervuld. | Ernstig misbruik, specifieke schuld, duidelijke betalingsmoeilijkheid, noodzakelijkheid en betalingsplicht expliciet gemaakt. | Juridische voorwaarden verduidelijkt; geen nieuwe grond toegevoegd. |
| 835: “als verzekeringsinstantie”. | Kan klinken alsof de werkgever zelf verzekeraar is. | “als partij die de inschrijving verzorgt”. | 投保單位 en de driedagentermijn behouden. |
| 835: drie alinea's begonnen met “Een”. | MONOTONY: alinea-aanzet — “Een eerste vraag …” — zin vanuit de handeling formuleren. | “Voor een eerste vraag kunt u …” | Contactgegevens en eerste-inquirybeperkingen behouden. |
| 836: algemene NHI-FAQ als expliciete bevestiging voor Nederlanders. | De lijst in die FAQ noemt Nederland niet afzonderlijk. | Gevolgtrekking rechtstreeks uit zorgverzekeringswet 9 en BOCA-bezoekersstatus. | Zelfde beperkte conclusie over alleen dit visum; juiste bewijsketen. |
| 836: “Een eigen ongevallen- en zorgverzekering …” en herhaalde “Een”-aanzetten. | MONOTONY: alinea-aanzetten — verzekering en aanbod hadden dezelfde vorm — duur/aanleiding vooropzetten. | “Voor het hele verblijf …” en “Bij een aanbod …”; daarnaast een concrete polisvraag. | Verzekeringsduur, dekking en voorwaarden behouden. |

## Eindcontrole, metingen en begrenzing

De lokale `variety_metrics.py` heeft geen Nederlandse taalmodus. De voorgeschreven tool is daarom ongewijzigd uitgevoerd met `--lang en` als technische benadering voor een taal met spaties. Dit is uitdrukkelijk geen geclaimde Nederlandstalige validatie. De tool telt de Nederlandse bronkop niet als bronstop en neemt de korte controledatum mee; daarom is aanvullend de eigenlijke tekst vóór `## Bronnen` onderzocht met Unicode-woordherkenning. Daarbij zijn Nederlandse herhaalde aanzetten, vergelijkingsformules, vraagzinnen, zinslengtes en lange zinnen per alinea afzonderlijk bekeken. Er zijn geen externe modellen of nieuwe testbestanden aangemaakt.

De negen punten uit sectie 5 zijn uitgevoerd:

1. De technische checker is op de definitieve bestanden opnieuw gedraaid; de definitieve resultaten staan in de meettabellen hieronder.
2. Openingen verschillen: 834 een als fictief gemarkeerde bedrijfssituatie, 835 een concrete lezersvraag, 836 een officieel geverifieerd getal. Geen standaard “stel dat”-begin; één fictieve scène op drie columns.
3. Elke tekst bevat meer dan twee zinnen van maximaal acht woorden. De Unicode-controle vond nergens meer dan één zin van minstens 32 woorden in dezelfde alinea.
4. De eigenlijke Nederlandse tekst heeft per column geen alinea-aanzet die meer dan tweemaal voorkomt.
5. Geen reeks van drie “stelling–bron–voorbehoud”-alinea's. In elke tekst bestaan bronloze alinea's met praktische voorbereiding; juridische claims hebben hun eigen bron.
6. Geen herhaalde “niet X maar Y”-constructies in de lopende tekst. Relevante onderscheidingen over werktoestemming, verblijf en belasting zijn behouden. De contrastkop in 836 wordt eenmalig gebruikt.
7. Eindes zijn verschillend en concreet: contractoverzicht, interview-/startdatum, loonstrook en uiterste verblijfsdag. Geen samenvattend verkooppraatje.
8. Rustig Nederlands met “u”; geen vet, openbare auteursvoet, verzonnen ervaring of imperatieve checklistkoppen. De verplichte interne `author: legal-ai-assistant` blijft aanwezig.
9. Bronlinks, wetsartikelen, wettelijke kracht, getallen, alternatieve voorwaarden, uitzonderingen en fictiemarkering zijn na de edits opnieuw vergeleken. Drie FAQ's per column sluiten aan op de tekst.

De volledige metadata-volgorde, SEO- en samenvattingslengtes, datum, categorie, drie verschillende menufoto's, drie unieke ASCII-slugs en bestaande/toegestane interne links zijn gecontroleerd. De publieke afbeeldingsbestanden zelf zijn niet aanwezig in deze tekstsnapshot; de drie exacte afbeeldingspaden zijn daarom aan `briefs/IMAGE-MENU.md` getoetst, zonder lokale beschikbaarheid te claimen. Alle externe bronlinks in de lopende tekst staan ook onder Bronnen; contactlinks zijn kantoorhandelingen, geen bronnen.

Telling: leesbare hoofdtekst inclusief tussenkoppen en contactpassage, exclusief frontmatter en Bronnen. Markdown-linkdoelen en opmaak tellen niet mee; witruimte is tot enkele spaties genormaliseerd. Woorden zijn door witruimte gescheiden eenheden; tekens zijn Unicode-tekens inclusief spaties. Dit is een reproduceerbare redactionele telling, geen tokenaantal.

| Column | Woorden hoofdtekst | Tekens hoofdtekst | Unicode-zinnen | Lengte-CV | Aandeel ≤8 woorden | Maximum gelijke alinea-aanzet |
|---|---:|---:|---:|---:|---:|---:|
| 834 | 666 | 5.037 | 46 | 0,479 | 21,7% | 2 |
| 835 | 858 | 6.000 | 54 | 0,472 | 16,7% | 2 |
| 836 | 855 | 6.182 | 63 | 0,483 | 28,6% | 2 |

De laatste tekstcontrole verwijderde bovendien “Het moment van overboeken verdient aandacht” uit 834: de daaropvolgende wettelijke termijn geeft de relevante informatie al. In 835 zijn de bevoegdheid om namens de onderneming contracten te sluiten en de plaatsing van de bronlinks aangescherpt. De cijfers hierboven horen bij die definitieve teksten.

Definitieve ongewijzigde checker, uitgevoerd met:

```text
PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/nl/834-dutch-company-taiwan-subsidiary-branch-office.md drafts/nl/835-dutch-employer-taiwan-first-hire-eor.md drafts/nl/836-dutch-working-holiday-taiwan-work-insurance-tax.md --lang en
```

| Column | Technische zinnen | Lengte-CV | Korte zinnen | Gelijke-lengtereeksen | FAIL | Exitcode |
|---|---:|---:|---:|---:|---:|---:|
| 834 | 47 | 0,487 | 23,4% | 4,4% | 0 | 0 |
| 835 | 55 | 0,479 | 18,2% | 0,0% | 0 | 0 |
| 836 | 64 | 0,489 | 28,1% | 6,5% | 0 | 0 |

De aanvullende Unicode-meting zonder bronnen geeft respectievelijk 4,5%, 0,0% en 8,2% gelijke-lengtereeksen. Alle drie blijven onder de grens van 30%. De kleine verschillen met de technische tabel volgen uit de expliciet beschreven segmentatie en bronafbakening.

Daarnaast zijn alle unieke daadwerkelijk gelinkte wetsartikelen uit de drie bestanden geëxtraheerd en nogmaals door het ongewijzigde `tools/law.py` gehaald. Resultaat: 28 artikelen, geen `NOT FOUND`, alle wetstitels passend. Verdeling: G0340003 (7, 8, 10, 71-1, 124); J0040002 (3, 7, 8, 9); J0080001 (1, 3, 7, 98, 99, 371, 372, 386); L0060001 (9, 15); N0030001 (2, 9, 17-1); N0030020 (7, 14); N0050031 (6); N0090001 (43, 57); N0090027 (4). De enige uitgestelde-inwerkingtredingsbanner was de hierboven besproken inkomstenbelastingbanner.

Voor wie de volledige Markdown-bestanden telt, inclusief metadata, FAQ, bronvermeldingen en URL's, gelden de volgende afzonderlijke tellingen. Woorden zijn hier `text.split()`-eenheden; tekens zijn alle Unicode-tekens inclusief witruimte en opmaak.

| Bestand | Woorden volledig bestand | Tekens volledig bestand |
|---|---:|---:|
| `drafts/nl/834-dutch-company-taiwan-subsidiary-branch-office.md` | 956 | 9.845 |
| `drafts/nl/835-dutch-employer-taiwan-first-hire-eor.md` | 1.192 | 10.506 |
| `drafts/nl/836-dutch-working-holiday-taiwan-work-insurance-tax.md` | 1.196 | 11.079 |

De formaat- en linkcontrole eindigde met `FORMAT, LINKS, MENU, LENGTH AND SUPPLEMENTARY DUTCH METRICS: PASS`. Er zijn geen wijzigingen buiten de toegestane Nederlandse uitvoerpaden aangebracht, geen git-opdrachten uitgevoerd, geen pakketten geïnstalleerd en geen artikelen gepubliceerd.
