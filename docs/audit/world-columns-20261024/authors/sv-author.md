# Svenska författaranteckningar — 837–839

Datum: 24 oktober 2026. Leverans: tre svenska utkast, inte publicerade.

## Lästa instruktioner och avgränsning

BRIEF.md, ASSIGNMENTS.md, IMAGE-MENU.md och repo/docs/columns/FRONTMATTER.md har lästs. Stilgrund: hela repo/docs/columns/EDITORIAL-VOICE.md, båda versionerna av SENTENCE-VARIETY-RULE.md och LESSONS.md (batchens rules/ samt /Users/son7/tseng-lanes-shared/), samt /Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md. Den angivna centrala filen /Users/son7/agent-library/knowledge/editorial-voice.md saknas på denna maskin; den fullständiga redaktionella texten i den föreskrivna repositorykopian har därför tillämpats. Den korta COLUMN-VOICE-RULE-filen är en hänvisning, inte ersättning för fulltexten. Äldre Fable-gater har inte återinförts.

Tre befintliga svenska texter lästa i sin helhet för jämförelse: 009-taiwan-voluntary-resignation-severance.md, 013-taiwan-company-establishment-advanced-1.md och 015-taiwan-company-setup-pitch-location.md. Deras kategorier är exakt “Juridisk information om Taiwan” respektive “Bolagsbildning i Taiwan”; datum och lästid följer deras svenska mönster.

Strukturkällor lästa: B-SETUP: en/004, en/001, es/656, en/507. P-WORK: en/705, en/704, en/706, en/352. L-HEIR: fr/677, it/687, ar/702, en/016. Koreaspecifika skatteavtal, USA-specifika skatteslutsatser, franska legaliseringsregler och äldre kontaktuppgifter har inte övertagits.

Sverigeraderna i research/country-facts.md granskades i sin helhet: visering, working holiday, skatteavtal, äktenskapsintervju, fastighetsreciprocitet, arbetskraftsursprung och körkort. Endast belagda uppgifter om visering, working holiday-listan, skatteavtal och fastighetsreciprocitet används. Körkortsraden är UNVERIFIED och används inte. Relevanta uppgifter kontrollerades också mot de officiella Taiwan-sidorna nedan. Inga påståenden görs om svensk materiell rätt, svenska domars erkännande, marknadsstorlek eller byråns erfarenhet.

## Lagkontroll och versioner

Varje laghänvisning i utkasten kördes genom tools/law.py och jämfördes mot den kinesiska texten före användning. Skriptet kördes oförändrat med runpy och vanliga pcode/artikel-argument. Endast dess hårdkodade cacheadress omdirigerades i processen till drafts/sv/.law-cache via os.path.expanduser, för att respektera skrivgränsen. Cachen togs bort efter kontrollen; inga filer utanför drafts/sv/ och denna arbetsanteckning skrevs.

Kontrollerade relevanta versioner: 公司法 2025-12-26; 外國人投資條例 1997-11-19; 就業服務法 2025-01-20; 外國專業人才延攬及僱用法 2025-09-24; 入出國及移民法 2023-06-28; 涉外民事法律適用法 2010-05-26; 土地法 2024-08-07; 遺產及贈與稅法 2026-09-11. Dessa är lagarnas visade ändringsdatum, inte påståenden om varje enskild artikels ändringsdatum.

Civillagen visade uttryckligen “部分或全部條文尚未生效”: artikel 166-1 har obestämd start och ändringen av 1223, kungjord 2026-08-17, börjar gälla sex månader senare. [Ändringshistoriken](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) kontrollerades: de använda 1148, 1156 och 1163 är från 2009 års ändring, 1174 från 2008; varningen gäller inte dessa bestämmelser. Inga nya laglottsregler används. Artikel 839 anger gällande rätt den 24 oktober 2026.

För professionallagen kontrollerades [ikraftträdandehistoriken](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295): de använda artiklarna 5, 9, 15 och 16 gäller från 2026-01-01. De särskilt uppskjutna delarna började gälla 2026-06-30 och styr inte de beskrivna tillståndsvägarna. Webbläsarverktyget kunde inte läsa denna historiksida; curl gav läsbar officiell fulltext. Samma reservmetod användes för working holiday-listan och reciprocitetslistan.

## 837 — svenskt företag och avtalspart i Taiwan

Läsare och utlösande fråga: ett svenskt företag ska börja sälja eller bemanna en verksamhet i Taiwan och behöver välja avtalspart och etableringsform före kapitalöverföringen. Läsarprofilen är en redaktionell hypotes, inte ett påstående om hur vanliga svenska etableringar är.

Landanknytning: Sverige står som part i ett gällande heltäckande inkomstskatteavtal på Taiwans finansministeriums lista. Det motiverar att texten tar upp en prövning enligt Sverigeavtalet och uttryckligen skiljer denna från kopierade Korea-/USA-antaganden. Handlingarna och den första frågan gäller det svenska moderbolagets roll, finansiering och avtal.

Överlapp och egen vinkel: befintliga svenska 001/004 behandlar etablering generellt, 013 dokument/adressfrågor och 015 lokalen. Den nya texten begränsar sig till kundavtalets juridiska part, tillåten verksamhet, investeringskapital och chefens separata arbetsbehörighet. Den länkar till 015 samt den egna 838, inte till de Koreaorienterade 001/004.

### Påstående → rättskälla

| Påstående | Kontrollerad bestämmelse och URL | Kinesiskt textutdrag |
|---|---|---|
| Avtal i det utländska bolagets namn kräver registrerad filial för verksamheten i Taiwan. | [J0080001, artikel 371](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371) | 外國公司非經辦理分公司登記，不得以外國公司名義在中華民國境內經營業務。 |
| Ett bolag bildat enligt bolagslagen är en juridisk person. | [J0080001, artikel 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=1) | 本法所稱公司，謂以營利為目的，依照本法組織、登記、成立之社團法人。 |
| 有限公司 får ha en enda ägare; detta ersätter inte investeringsprövningen. | [J0080001, artikel 98](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=98) | 有限公司由一人以上股東所組成。 |
| Begränsat ansvar och det kvalificerade undantaget vid allvarligt missbruk. | [J0080001, artikel 99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=99) | 各股東對於公司之責任，除第二項規定外，以其出資額為限。 … 股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者，該股東應負清償之責。 |
| Filialen behöver särskilt avsatta rörelsemedel och en ansvarig företrädare. | [J0080001, artikel 372](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=372) | 應專撥其營業所用之資金，並指定代表為在中華民國境內之負責人。 |
| Representationskontor registreras i den situation som beskrivs i artikeln. | [J0080001, artikel 386](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=386) | 未經申請分公司登記而派其代表人在中華民國境內設置辦事處者，應申請主管機關登記。 |
| Investeringsansökan med plan och handlingar; även ändrad plan kräver godkännande. | [J0040002, artikel 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=8) | 應填具投資申請書，檢附投資計畫及有關證件，向主管機關申請核准。投資計畫變更時，亦同。 |
| Tillförsel inom beslutets frist, kontroll, fastställande av belopp och förlängningsansökan före slutdagen. | [J0040002, artikel 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) | 投資人應將所核准之出資於核定期限內全部到達，並將到達情形報請主管機關查核。 … 應於期限屆滿前，申請主管機關核准延展。 … 投資人於實行出資後，應向主管機關申請審定投資額 |
| Kapitalet i 有限公司 ska vara helt betalt. | [J0080001, artikel 100](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=100) | 公司資本總額，應由各股東全部繳足，不得分期繳款或向外招募。 |
| Kapitalet bestyrks av 會計師; dokument vid ansökan eller inom 30 dagar efter registrering. | [J0080001, artikel 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=7) | 公司申請設立登記之資本額，應經會計師查核簽證；公司應於申請設立登記時或設立登記後三十日內，檢送經會計師查核簽證之文件。 |
| Ägande ger inte arbetstillstånd; huvudregel med lagstadgade undantag. | [N0090001, artikel 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。 |

Officiell landkälla: [MOF:s inkomstskatteavtal](https://www.mof.gov.tw/singlehtml/191?cntId=63930), raden “瑞典 / Sweden”, undertecknat 2001/06/08, ikraft 2004/11/24. Artikeln anger endast avtalets existens/status. Inga skattesatser eller PE-gränser hämtades ur ett annat lands avtal.

### De två första styckena, mening för mening

| Mening eller ändring | Beslut och skäl | Betydelsen bevarad |
|---|---|---|
| “Ska kundavtalet i Taiwan stå på det svenska bolaget eller på ett nytt taiwanesiskt dotterbolag?” | Behåll: läsarens konkreta val av avtalspart. | Ja; frågan lovar inget visst val. |
| “Ett utländskt bolag … måste registrera en filial …” | Behåll: handlingen som lagen kräver vid verksamhet i eget namn. | Ja, artikel 371:s villkor är kvar. |
| “Frågan påverkar alltså vad som behöver vara klart före försäljningsstarten.” | Struken: tillför ingen självständig uppgift efter registreringskravet. | Ja; ingen frist eller skyldighet försvann. |
| “På huvudkontoret kan beslutet börja med ett konkret avtalsutkast.” | Behåll: pekar ut underlaget som läsaren kan ta fram. | Ja; praktiskt råd, inget formkrav. |
| “Vem ska sälja, fakturera och ansvara för leveransen?” | Behåll: identifierar de funktioner som ska placeras i rätt enhet. | Ja. |
| “Lägg också till vem som ska anställa personal och finansiera den första tiden.” | Behåll: två andra funktioner som avtalsutkastet inte nödvändigtvis visar. | Ja. |
| “Då går det att bedöma verksamheten bakom ordet ‘Taiwankontor’.” | Struken: sammanfattade redan namngivna funktioner. | Ja. |

Jämförelse med tre svenska artiklar:

| Tidigare text | Öppning, rubriker och slut där | Val i 837 |
|---|---|---|
| 009 | “Som tidigare nämnts”; undantagslista; generell formulering om förberedelse och tid. | Självständig avtalsfråga; ämnesrubriker om organisationsformer och pengar; slutets sista uppgift är avtalsparten. |
| 013 | Påstående om många bolagsbildningar, därefter vad texten ska gå igenom; numrerade frågor; standardiserat språkmeddelande. | Ingen obelagd efterfrågeuppgift eller innehållsannonsering; sammanhängande avsnitt och kontakt i ett stycke. |
| 015 | Inledande områdesbrasklapp; adressproblem och frågerubrik; “Därmed är genomgången avslutad”. | Ingen lånad restaurangscen; lokalen ligger i en relaterad länk; ingen sammanfattande avslutning. |

Övriga redaktionella ändringar: “vem ska skriva kundavtalet?” blev “vem står på kundavtalet?” eftersom frågan gäller avtalspart och inte vem som författar dokumentet. “En revisor” preciserades till “en taiwanesisk auktoriserad revisor (會計師)”. Två närliggande dokumentmeningar fogades samman för varierad rytm utan bortfall av handlingstyper. Den kinesiska bolagsformen fick en svensk förklaring.

Bortvalda obelagda uppgifter: inga påståenden om svensk branschdominans, garanterad banköppning eller handläggningstid, särskilda svenska skattesatser, generell minimikapitalnivå eller automatisk arbets-/uppehållsrätt.

## 838 — svensk yrkesverksam, visering och arbetsstart

Läsare och utlösande fråga: en svensk medborgare med planerad arbetsstart eller erbjudande i Taiwan vill veta om viseringsfri inresa räcker och hur familjen kan följa med. Att detta är en relevant läsargrupp är en redaktionell hypotes; inga antal eller yrkesandelar påstås.

Landanknytning och ämnesval: ASSIGNMENTS tillät P-WHV eller P-WORK. MOFA:s publicerade partnerlista innehåller inte Sverige. Därför valdes P-WORK. Detta är en verifierad listobservation, inte en utfästelse om att ett working holiday-program aldrig kan införas. Svensk viseringsfrihet, passvillkor och frånvaron i programlistan ger en konkret Sverigeanknytning.

Överlapp och egen vinkel: 009 gäller avslutad anställning och 013 bolagsbildning; den här texten rör tiden före första arbetsdagen, Gold Card och familjens egna rättigheter. Den återger inte en generell student-, språkstudie- eller turistguide. Länk till 009 används endast för en senare egen uppsägning.

### Påstående → rättskälla

| Påstående | Kontrollerad bestämmelse och URL | Kinesiskt textutdrag |
|---|---|---|
| Viseringsfrihet är inte arbetsrätt; tillstånd genom arbetsgivaren som huvudregel. | [N0090001, artikel 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。 |
| Arbetsgivaren ansöker normalt hos arbetsministeriet; vissa lärarkategorier hos utbildningsministeriet. | [A0030295, artikel 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | 應檢具相關文件，向勞動部申請許可 … 應檢具相關文件，向教育部申請許可。 |
| Specialistens egen Gold Card-ansökan, fyra funktioner, 1–3 år och visumundantaget för sökande som redan rest in. | [A0030295, artikel 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | 得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡。 … 已入國之外國特定專業人才申請就業金卡時得免申請居留簽證。 … 前項就業金卡有效期間為一年至三年 |
| Vid byte av arbetsgivare krävs som huvudregel ny arbetsgivaransökan; undantag finns. | [N0090001, artikel 53](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=53) | 如需轉換雇主或受聘僱於二以上之雇主者，應由新雇主申請許可。 … 不適用前項之規定。 |
| Direkt NIA-ansökan efter relevant inresa och arbetsbehörighet; kvalificerade familjemedlemmar efter godkänt uppehåll. | [A0030295, artikel 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 以免簽證或持停留簽證入國，經許可或免經許可在我國從事專業工作者，得逕向內政部移民署申請居留 … 其配偶、未成年子女及因身心障礙無法自理生活之成年子女 |
| ARC efter inresa med uppehållstillstånd: 30 dagar från dagen efter inresan, med undantag för kombinationskort. | [D0080132, artikel 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | 應於入國後之翌日起算三十日內，向移民署申請外僑居留證。 … 或其他已含有外僑居留證功能之證件者，得免申請外僑居留證。 |
| Make/maka till specialist eller högkvalificerad yrkesperson kan söka eget arbetstillstånd efter familjeuppehåll; giltigheten begränsas av uppehållet. | [A0030295, artikel 15](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | 外國特定專業人才及外國高級專業人才之配偶，經內政部移民署許可在我國依親居留者，得逕向勞動部申請許可 … 該工作許可期間不得逾其依親居留期間。 |

| Officiell icke-lagkälla | Kontrollerat stöd och begränsning |
|---|---|
| [BOCA, visa-exempt entry](https://www.boca.gov.tw/fp-149-4486-7785a-1.html) | Sweden i 90-dagarsgruppen; start dagen efter ankomst; sex månaders passgiltighet; undantag för provisoriska pass; bekräftad vidare-/återresa och gränsprövning. Engelska original, därför inget kinesiskt utdrag. |
| [MOFA, working holiday partners](https://youthtaiwan.mofa.gov.tw/workingholidayen/cp.aspx?n=6426) | Hela partnerförteckningen kontrollerad; Sverige saknas. Ingen ålder eller kvot för Sverige uppfinns. Engelska original. |
| [Gold Card-kansliet](https://goldcard.nat.gov.tw/en/about/) | Öppet arbetstillstånd och möjlighet att ansöka utan färdig anställning; citerat kort uttryck: “without sponsorship”. Individuell kvalifikation utlovas inte. |
| [NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Kategorispecifika underlag och begränsade inresearrangemang; ingen generell konverteringsrätt påstås. Engelskt original. |
| [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) | Utländska handlingar bestyrks; kinesisk översättning kan begäras. Artikeln gör inte alla dokument till obligatoriska för varje person. Engelskt original. |

### De två första styckena, mening för mening

| Mening eller ändring | Beslut och skäl | Betydelsen bevarad |
|---|---|---|
| “90 dagar är den längsta viseringsfria vistelsen för svenska medborgare …” | Behåll: landets verifierade vistelsetid. | Ja; pass- och inresevillkoren följer i första avsnittet. |
| “Tiden räknas från dagen efter inresan.” | Behåll: nödvändig startpunkt. | Ja. |
| “Den bestämmer inte när du får börja arbeta …” | Behåll: skiljer tillåten vistelse från artikel 43:s arbetsbehörighet med undantag. | Ja. |
| “En svensk som vill kombinera resande med arbete behöver också kontrollera vilken tillståndsväg som finns.” | Struken: allmän uppmaning före det specifika beskedet. | Ja; inget villkor försvann. |
| “Sverige finns inte i … lista över working holiday-partner …” | Behåll: förklarar varför denna tillståndsväg inte används. | Ja; kontrollerad lista och datum anges. |
| “Planera därför inte jobbstarten med ett sådant tillstånd som förutsättning.” | Behåll: konkret följd för läsarens planerade startdag. | Ja; ingen ny rättsregel. |

| Tidigare text | Relevant mönster | Val i 838 |
|---|---|---|
| 009 | Tillbakablick och undantagskatalog; abstrakt slutsats om tiden. | Sifferöppning med exakt startpunkt; avslut med läsarens två datum. |
| 013 | Bolagsbildning kopplas i inledningen till visum/ARC; numrerad FAQ-struktur. | Arbetsbehörighet skiljs uttryckligen från inresa och ARC; rubrikerna följer de skilda besluten. |
| 015 | Geografisk brasklapp och lokalfråga; generell konsultationsuppmaning på slutet. | Svenska passvillkor direkt i sak; familjehandlingar och ett konkret arbetsstartdatum avslutar. |

MONOTONY: upprepade styckestarter — fyra stycken började “För …” — omarbetade till ämnesbundna starter, bland annat “Employment Gold Card”, “Reser du” och “Frågor”. Villkor, tillståndsgivare och frister behölls. “Arbetsrätten är öppen” ändrades till “Arbetstillståndet är öppet” eftersom det är tillståndets räckvidd som avses.

Bortvalda uppgifter: svenskt working holiday-program, allmän rätt att börja medan ansökan väntar, automatisk Gold Card-behörighet, generell arbetsrätt för medföljande, universell lönegräns samt utlovad handläggningstid. Ingen svensk arbets- eller skatterätt beskrivs.

## 839 — arvinge i Sverige och egendom i Taiwan

Läsare och utlösande fråga: någon i Sverige får besked om arvsrätt efter ett dödsfall med bankmedel eller fastighet i Taiwan. Personen behöver välja handlingar och agera inom rätt frist utan att förutsätta att det svenska dokumentnamnet avgör handläggningen. Gruppens storlek är inte verifierad; relevansen är en redaktionell hypotes.

Landanknytning: svenska familjehandlingar och kontakt från Sverige är den faktiska förberedelsesituationen, utan påståenden om deras automatiska godtagbarhet. Sverige finns i den officiella fullreciprocitetsgruppen, vilket ger en kontrollerbar svensk fråga när en fastighet ingår. Klassificeringens ålder och fortsatta krav sägs uttryckligen.

Överlapp och egen vinkel: svenska 016 är ett brett arv-/familjerättsligt sammanhang och används som relaterad länk. Den nya texten koncentrerar sig på olika startpunkter för avstående, förteckning, skatt och arvsregistrering, samt fullmaktens befogenheter när underskriften görs i Sverige. Barnets andelar, laglott och svenska arvsregler räknas inte ut.

### Påstående → rättskälla

| Påstående | Kontrollerad bestämmelse och URL | Kinesiskt textutdrag |
|---|---|---|
| Lagval efter avlidnes nationella lag vid dödsfallet; förbehåll för taiwanesiska arvingar och Taiwanegendom. | [B0000007, artikel 58](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=58) | 繼承，依被繼承人死亡時之本國法。但依中華民國法律中華民國國民應為繼承人者，得就其在中華民國之遺產繼承之。 |
| Flera medborgarskap: närmast anknytning. | [B0000007, artikel 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=2) | 當事人有多數國籍時，依其關係最切之國籍定其本國法。 |
| Skriftligt avstående till domstolen inom 3 månader från kännedom; efterföljande underrättelse och omöjlighetsundantag. | [B0000001, artikel 1174](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1174) | 應於知悉其得繼承之時起三個月內，以書面向法院為之。 … 拋棄繼承後，應以書面通知因其拋棄而應為繼承之人。但不能通知者，不在此限。 |
| Normalt begränsat ansvar för ärvda skulder. | [B0000001, artikel 1148](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1148) | 繼承人對於被繼承人之債務，以因繼承所得遺產為限，負清償責任。 |
| Förteckning inom 3 månader från kännedom, förlängning på ansökan om nödvändigt. | [B0000001, artikel 1156](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1156) | 繼承人於知悉其得繼承之時起三個月內開具遺產清冊陳報法院。 … 法院因繼承人之聲請，認為必要時，得延展之。 |
| Ansvarsbegränsningen får inte åberopas i angivna missbruksfall; allvarlighetskraven bibehålls. | [B0000001, artikel 1163](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1163) | 不得主張第一千一百四十八條第二項所定之利益 … 隱匿遺產情節重大。 … 在遺產清冊為虛偽之記載情節重大。 … 意圖詐害被繼承人之債權人之權利而為遺產之處分。 |
| Arvsskatt normalt 6 månader från dagen efter dödsfallet; särskilda startpunkter behålls i texten. | [G0340072, artikel 23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=23) | 應於被繼承人死亡之次日起算六個月內 … 自法院選任遺產管理人之次日起算。 … 自判決確定或文書作成之次日起算六個月內 |
| Skriftlig förlängningsansökan före skattefristens slut; normalt max 3 månader och undantag. | [G0340072, artikel 26](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=26) | 應於本法規定申報期限屆滿前，以書面申請延長之。 … 前項申請延長期限以三個月為限。但因不可抗力或其他有特殊之事由者 |
| Sakrättsliga frågor följer egendomens belägenhet. | [B0000007, artikel 38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=38) | 關於物權依物之所在地法。 |
| Arvsregistrering inom 6 månader från arvsöppning; en arvinge kan ansöka för alla. | [D0060001, artikel 73](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=73) | 得由任何繼承人為全體繼承人聲請之。 … 其係繼承登記者，得自繼承開始之日起，六個月內為之。 |
| Utländska förvärv omfattas av reciprocitetskravet. | [D0060001, artikel 18](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=18) | 以依條約或其本國法律，中華民國人民得在該國享受同樣權利者為限。 |
| Särskilda markslag: arvsundantag, försäljning till taiwanesisk medborgare inom 3 år efter registrering och offentlig försäljning vid utebliven försäljning. | [D0060001, artikel 17](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=17) | 前項移轉，不包括因繼承而取得土地。但應於辦理繼承登記完畢之日起三年內出售與本國人，逾期未出售者，由直轄市、縣（市）地政機關移請國有財產局辦理公開標售 |

| Officiell icke-lagkälla | Kontrollerat stöd och begränsning |
|---|---|
| [MOF, handlingar i arvsärenden](https://www.etax.nat.gov.tw/etwmain/tax-info/house-land-transfer-taxtation-calculation-area/inheritance/file-process) | Utdrag: “繼承系統表”; “委託他人申報者，應出具委任書”. Används för dokumenttyper i skatteärendet, inte som generell bankchecklista. |
| [New Taipei City, reciprocitet](https://www.land.ntpc.gov.tw/News.aspx?PageSize=200&n=13377&page=1&sms=9730) | Utdrag: “完全平等互惠之國家 瑞典Sweden”. Den publicerade listan motsvarar den nationella tabellen daterad 2021-05 enligt faktaledgern. Ingen nyare svensk landbedömning verifierades; artikeln uppmanar därför till tillämpningskontroll hos fastighetsmyndigheten. |

### De två första styckena, mening för mening

| Mening eller ändring | Beslut och skäl | Betydelsen bevarad |
|---|---|---|
| “Datumet då du fick veta att du är arvsberättigad kan avgöra om ett arvsavstående fortfarande är möjligt.” | Struken: nästa mening anger samma sak med det faktiska villkoret och fristen. | Ja; ingen tidsuppgift försvann. |
| “När taiwanesisk arvsrätt gäller kräver …” | Behåll som öppning: lagvalsvillkor, skriftlighet, domstol, tremånadersfrist och startpunkt. Efter strykningen ersattes “den kännedomen” med “det att du fick kännedom om din arvsrätt”, så att startpunkten står uttryckligen i öppningsmeningen. | Ja, samtliga delar kvar. |
| “Fristen börjar inte först när du reser från Sverige till Taiwan.” | Behåll: den praktiska utlandsfrågan om planerad resa. | Ja; ingen ny startpunkt införs. |
| “Spara meddelandet som gav dig beskedet.” | Behåll: beviset för kännedomstidpunkten. | Ja. |
| “Anteckna också dödsdagen, den avlidnes medborgarskap och vilka tillgångar i Taiwan som är kända.” | Behåll: skilda uppgifter behövs för lagval och de parallella frister som senare beskrivs. | Ja. |
| “Familjen kan då börja utreda lagvalet och fristen medan bankuppgifter och handlingar fortfarande samlas in.” | Behåll: förberedelser kan inledas innan tillgångsundersökningen är färdig. | Ja; ingen förlängning utlovas. |
| “Fullständig kunskap om boet kan saknas.” | Struken: upprepade den föregående meningen. | Ja. |

| Tidigare text | Relevant mönster | Val i 839 |
|---|---|---|
| 009 | Förutsätter tidigare läsning, räknar undantag och slutar med en generell tidsvarning. | En komplett fristregel direkt; avslut med beviset för kännedom, utan allmän varning. |
| 013 | Introducerar vanliga frågor och fortsätter med numrerade frågor/svar. | Fyra sammanhängande avsnitt om lagval, arvsförvaltning, fullmakt och offentliga registreringar. |
| 015 | Öppnar med en avgränsning inom parentes och slutar med att genomgången är klar. | Lagvalsavgränsningen integreras i första sakmeningen; slutet gäller det bevarade meddelandet från familjen. |

MONOTONY: jämna meningslängder — första kontrollens längdvariation var för låg — närliggande meningar om svensk dokumentation och fullmakter förenades, medan skillnaden mellan förteckningens och avståendets frister fick korta meningar. Upprepade “För …”-starter ändrades. Samtliga källor, villkor och startpunkter behölls.

Juridisk precisering vid egen granskning: “kan undanröja ansvarsbegränsningen” ändrades till “medför att begränsningen inte får åberopas”, så att artikel 1163:s förbud inte försvagas till en skönsmässig möjlighet. Artikel 17 fick tydligt “måste säljas” och följden offentlig försäljning. Rubrikens “bouppteckning” ersattes med “förteckningen över arvet” för att inte likställa det taiwanesiska domstolsförfarandet med en svensk handling.

Bortvalda obelagda uppgifter: att svensk apostille ensam räcker, att en svensk bouppteckning godtas automatiskt, att svensk hemvist bestämmer arvsrätten, att svensk arvsskatt eller familjerätt ser ut på visst sätt, och att reciprocitet undanröjer alla markrestriktioner. Ingen slutsats om svensk doms erkännande eller automatisk bankutbetalning.

## Egenkontroll enligt variationsregelns avsnitt 5

1. Det föreskrivna variety_metrics.py kördes på samtliga slututkast med --lang en; inga FAIL. Verktygsversionen på denna maskin stöder enbart ko/ja/en/zh-hant och skulle annars gissa ko för drafts/sv. Detta är därför en proxykontroll, inte ett påstående om inbyggd svensk validering. En separat Unicode-baserad svensk mätning kördes i minnet, utan att ändra verktyget. Den räknar svenska bokstäver som hela ord och skiljer meningar även före Å/Ä/Ö; mått redovisas nedan. Trösklarna används som arbetskontroll, inte som belagd språklig ekvivalens med engelska.
2. Öppningstyperna skiljer sig: 837 avtalspartsfråga; 838 ett konkret tal; 839 villkorad form- och fristregel. Inga påhittade klientfall eller formelmässiga hypotetiska öppningar.
3. Varje text har fler än två mycket korta meningar. Inga två meningar över 32 svenska ord i samma stycke; längre meningar följs av kortare förklaring.
4. Svenska styckestarter upprepas högst två gånger; inga lika ord börjar två intilliggande meningar i slutmätningen.
5. Inga tre stycken följer mallen påstående–laghänvisning–undantag. Minst ett praktiskt stycke i varje text saknar rättsligt påstående och lagcitat.
6. Inga mekaniska “inte X utan Y”-mallar. Sakliga skillnader mellan tillstånd och inresa, förteckning och avstående samt juridiska personer har behållits eftersom de avgör läsarens handlingar.
7. Sista sakuppgiften gäller avtalsparten, arbetsstart/vistelseslut respektive kännedomstidpunkt. Ingen sammanfattning eller resultatutfästelse.
8. Svensk sakprosa, ingen fetstil, ingen H1, inga uppfunna förstapersonserfarenheter, inga uppmanande checklistor som rubriker. Ingen offentlig författarsignatur. Det föreskrivna interna author-fältet finns kvar. Ingen advokat- eller modersmålsgranskning påstås.
9. Alla laglänkar jämförda mot law.py-resultaten. FAQ har tre poster per text och samma relevanta villkor som brödtexten. Skönsmässiga möjligheter och bindande krav hålls isär. Källistan täcker samtliga externa faktakällor i respektive brödtext; interna länkar finns i svenska snapshoten eller egna nya filer.

## Slutmått

Ordmått: synlig löptext före Källor, exklusive YAML, rubriker och källista; länktext ingår men URL:er räknas inte. Ord räknas med blankstegsdelning. Tecken inkluderar blanksteg, med normaliserade styckemellanrum. Hela filens tecken redovisas också för reproducerbarhet.

| Fil | Löptextens ord | Löptextens tecken | Hela filens tecken | Svenska meningar | CV | Korta ≤8 ord | Jämna tre i rad | Högsta lika styckestart |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| drafts/sv/837-swedish-company-taiwan-subsidiary-branch-office.md | 658 | 4835 | 9008 | 52 | 0.512 | 0.288 | 0.020 | 2 |
| drafts/sv/838-swedish-professional-taiwan-work-permit-residence.md | 677 | 5112 | 9708 | 54 | 0.481 | 0.333 | 0.019 | 1 |
| drafts/sv/839-swedish-heir-taiwan-estate-deadlines-documents.md | 762 | 5630 | 10488 | 57 | 0.505 | 0.246 | 0.000 | 2 |

Slutkontroll av metadata: exakt fältordning, publicerings- och ändringsdatum 2026-10-24, tre FAQ, 3–5 taggar, audience sv, author legal-ai-assistant, olika bilder I08/I04/I26 och fyra ämnesrubriker plus Källor per artikel. Titlar, SEO-titlar och sammanfattningar ligger inom briefens längdintervall. Inga ändringar i repositorysnapshoten, andra språk eller gemensam research.
