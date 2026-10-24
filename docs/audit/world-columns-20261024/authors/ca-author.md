# Nota d’autoria — ca, 852–854

Data de verificació: 24 d’octubre de 2026. Autoria interna: `legal-ai-assistant`. Tres esborranys en català; cap publicació ni operació git. La revisió descrita és una comprovació de l’autor amb eines i fonts oficials, no una revisió independent d’un advocat o d’un parlant nadiu.

## Abast, lectures i decisions comunes

S’han seguit `briefs/BRIEF.md`, la fila `ca` de `briefs/ASSIGNMENTS.md` i `briefs/IMAGE-MENU.md`: 852 B-TM, 853 P-WORK i 854 L-DIVORCE. No s’ha substituït cap tema.

Normes consultades: `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md`, `rules/LESSONS.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md` i les còpies compartides de SENTENCE-VARIETY-RULE i LESSONS. La ruta `~/agent-library/knowledge/editorial-voice.md` no existeix en aquesta màquina; s’ha aplicat la versió completa de `repo/docs/columns/EDITORIAL-VOICE.md`. El fitxer COLUMN-VOICE-RULE és un recordatori que remet a aquell original absent. La decisió de l’usuari del 15 d’octubre preval sobre les mencions històriques a Fable. La cerca d’entrades del pont no ha trobat instruccions per a aquest lot.

Mostra catalana llegida íntegrament per comparar registre, metadades, entrades, subtítols i finals: 009 `taiwan-voluntary-resignation-severance`, 012 `taiwan-overtaking-accident-liability` i 015 `taiwan-company-setup-pitch-location`. La categoria exacta escollida, present a 009 i 012, és `Informació jurídica de Taiwan`; dates del tipus `24 d’octubre de 2026` i durada `5 min de lectura`. Les altres columnes catalanes examinades parcialment no es compten com a mostra completa.

Fonts estructurals llegides: fr/675 i it/685 per a marques; en/705, en/704, en/706 i en/352 per a treball; es/693 i en/019, en/020, en/021 per a divorci. S’ha reutilitzat el fil jurídic, amb verificació pròpia de les disposicions, sense reproduir-ne les introduccions, els contactes antics ni les conclusions. Els exemples professionals i comercials són hipòtesis de lector del brief; no s’han convertit en estadístiques de mercat.

Del registre `research/country-facts.md` s’han examinat les files d’Espanya i Andorra i les advertències de verificació. Només s’utilitza la dada positiva d’exempció de visat, comprovada també directament a BOCA. La llengua catalana no s’ha tractat com una nacionalitat ni s’ha estès el tractament d’un passaport a tots els catalanoparlants. No s’afirma res sobre convenis fiscals, permisos de conduir, reciprocitat immobiliària, entrevistes matrimonials o programes de vacances i treball.

## Verificació legal i límits de les eines

S’ha executat el codi original de `tools/law.py` amb `runpy.run_path`, passant els codis i articles indicats més avall. El programa fixa la memòria cau a `html/`; per respectar l’ordre d’escriure només als espais assignats, s’ha redirigit exclusivament aquesta ruta a `drafts/ca/.law-cache` en memòria. No s’ha editat el programa ni el text de les lleis. La memòria cau temporal es retira després de les comprovacions; els fragments contrastats i els URL queden en aquesta nota.

Articles recuperats abans d’utilitzar-los:

- `J0070001`: 2, 6, 19, 30, 33, 35, 42, 48, 57, 58.
- `N0090001`: 43, 46, 48, 53.
- `A0030295`: 4, 5, 9, 15, 16, 17, 31.
- `D0080132`: 22, 31.
- `B0000007`: 50, 55.
- `B0000001`: 1049, 1050, 1052, 1055, 1055-1.
- `B0010048`: 13, 23.

No tots els articles consultats es citen: s’han descartat desviacions cap a canvi d’ocupador, pensió, feina del cònjuge d’un nacional taiwanès i altres qüestions que ampliarien massa el text.

### Vigència

- `J0070001`, 商標法: el programa mostra `!!! 部分條文尚未生效`. El text de l’avís afecta els articles 68, 70 i 95–97 de la reforma de 2022, que no es fan servir. L’[historial oficial](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0070001) confirma que la reforma de 2023, inclosos els articles 6, 19 i 30 consultats, va entrar en vigor l’1 de maig de 2024: `定自一百十三年五月一日施行`. La resta del règim citat deriva del text entrat en vigor l’1 de juliol de 2012. L’article 852 explicita la data de vigència de la seva anàlisi a Fonts.
- `B0000001`, 民法: l’avís afecta 166-1, amb data pendent, i la reforma de 1223 publicada el 17 d’agost de 2026, amb entrada en vigor sis mesos després. No s’utilitza cap d’aquests articles. S’ha comprovat l’[historial del Codi civil](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001); les disposicions de divorci emprades no són les afectades per l’avís. La consulta de 1052 no s’ha convertit en una explicació exhaustiva de la culpa ni de la seva jurisprudència constitucional: el text només remet a la necessitat d’examinar motius legals i prova. L’article 854 també fixa expressament la data de vigència a Fonts.
- `A0030295`, 外國專業人才延攬及僱用法: l’[historial oficial](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) confirma la reforma de 24 de setembre de 2025 i l’entrada en vigor general l’1 de gener de 2026: `其餘條文，定自一百十五年一月一日施行`. Les excepcions referides a 4.4.4, 28 i 29 van entrar en vigor el 30 de juny de 2026. Les vies descrites són posteriors a totes dues dates.
- Les altres normes citades no han mostrat l’avís de disposicions pendents a la consulta.

### Imatges: incidència pendent d’integració

Les imatges escollides són exactament I02, I04 i I25 del menú, sense repetició. Les descripcions i la llegenda s’han traduït sense afegir objectes. No s’ha generat cap imatge.

La instantània `repo/` no conté `public/`. En executar les comprovacions de `tools/gate.mjs`, els únics errors de contingut reportats són l’absència dels tres fitxers d’imatge; també hi ha els avisos de vigència ja resolts més amunt. Les tres peticions HTTP HEAD als URL de `https://tseng-law.com` retornen `404 text/html`. Sis alternatives del mateix menú també retornen 404, per la qual cosa no s’ha fet una substitució sense cap benefici verificable. Cal que la integració recuperi o serveixi els recursos del menú. No es presenta la disponibilitat de les imatges ni el gate complet com a superats.

El gate es va executar en memòria, apuntant la memòria cau als arxius propis i fent servir `gray-matter` ja instal·lat a `/Users/son7/Projects/tseng-law/node_modules/`; la instantània tampoc no conté aquella dependència. No s’ha instal·lat ni modificat cap dependència, programa o fitxer aliè.

## 852 — Marca catalana i distribuïdor

Fitxer: `drafts/ca/852-catalan-brand-taiwan-trademark-distributor.md`.

Lector i desencadenant: responsable d’una empresa catalana que prepara etiquetes i distribució a Taiwan, o descobreix que el distribuïdor ha registrat el signe al seu nom. La pregunta inicial identifica el sol·licitant abans que un encàrrec gràfic es confongui amb un consentiment de registre.

Adequació territorial: hipòtesi de treball explícita del brief sobre empreses de marques, alimentació i disseny. L’empresa de Girona és un exemple hipotètic indicat dins la primera frase. No s’afirma que aquests sectors dominin les exportacions ni que el despatx tingui clients d’aquest perfil. L’angle català és la convivència del nom en català, el logotip i la denominació xinesa en una única preparació comercial.

Solapament i angle nou: fr/675 i it/685 parteixen del conflicte de titularitat ja produït. Aquí s’obre amb la preparació del llançament, es concreta qui presenta la sol·licitud, i després es tracta l’oposició, la nul·litat i la cessió. Dins el corpus català, 015 tracta el local comercial; s’hi enllaça només per al supòsit d’establiment propi, sense presentar-lo com a font de dret de marques. No hi ha una traducció nova del tema societari genèric.

### Afirmacions i fonts contrastades

| Afirmació de l’article | Disposició i URL | Fragment xinès comprovat i condicions conservades |
|---|---|---|
| Cal registre per obtenir el dret previst per la llei. | [Llei de marques, 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=2) | `欲取得商標權…應依本法申請註冊。` No s’ha afirmat que no existeixi cap altra tutela. |
| El dret neix amb la publicació. | [33](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=33) | `商標自註冊公告當日起，由權利人取得商標權` — no des de la petició ni des de la descoberta. |
| Sol·licitant, signe i productes/serveis; classificació no decisiva sobre similitud. | [19, apartats 1 i 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=19) | `載明申請人、商標圖樣及指定使用之商品或服務` i `類似商品或服務之認定，不受前項商品或服務分類之限制。` |
| L’empresa sense domicili ni establiment a Taiwan necessita representant qualificat. | [6, apartats 1 i 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=6) | `在中華民國境內無住所或營業所者，應委任代理人辦理之` i `代理人以在國內有住所，並具備下列資格之一者為限` — representació no equival a titularitat. |
| Impugnació per coneixement i imitació de marca usada prèviament. | [30.1.12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=30) | `相同或近似於他人先使用於同一或類似商品或服務之商標` + `契約、地緣、業務往來或其他關係` + `知悉他人商標存在，意圖仿襲而申請註冊者` + `但經其同意申請註冊者，不在此限。` S’han mantingut totes les condicions acumulatives i el consentiment. |
| Oposició dins de tres mesos des de la publicació, per qualsevol persona i pels motius enumerats. | [48.1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=48) | `任何人得自商標註冊公告日後三個月內…提出異議` — no es calcula des que el fabricant se n’assabenta. |
| La persona interessada pot demanar la nul·litat pels motius previstos. | [57.1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=57) | `利害關係人或審查人員得申請或提請…評定其註冊。` Possibilitat, no resultat assegurat. |
| Cinc anys per al motiu 30.1.12; excepció de mala fe limitada a 9 i 11. | [58, apartats 1 i 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=58) | `自註冊公告日後滿五年者，不得申請或提請評定` i `第三十條第一項第九款、第十一款…係屬惡意者，不受前項期間之限制。` No s’ha traslladat l’excepció al punt 12. |
| Cessió oposable a tercers després de la inscripció. | [42](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=42) | `商標權之移轉，非經商標專責機關登記者，不得對抗第三人。` No es confon l’eficàcia davant tercers amb una afirmació general de nul·litat del contracte. |

La conservació de correus, catàlegs, versions i accessos és una proposta de preparació probatòria i contractual, no una llista legal tancada ni una garantia que una prova concreta serà suficient.

### Prova d’eliminació dels dos primers paràgrafs

| Frase examinada | Decisió i informació que aporta |
|---|---|
| «Una empresa de Girona envia el logotip… (exemple hipotètic).» | Mantinguda: identifica el desencadenant, el signe i la proposta de nom xinès; la marca d’hipòtesi es conserva. |
| «Qui figurarà com a sol·licitant?» | Mantinguda: pregunta concreta sobre la titularitat inicial, sense repetir el títol. |
| «El correu que autoritza a preparar les etiquetes pot deixar aquesta qüestió sense resposta.» | Mantinguda: distingeix l’encàrrec gràfic de l’abast de l’autorització, amb formulació condicional. |
| «Per adquirir el dret de marca… cal sol·licitar-ne el registre…» | Mantinguda: requisit legal amb font. |
| «El dret neix amb la publicació del registre…» | Mantinguda: moment jurídic diferent del de la sol·licitud. |
| «Això situa una decisió abans del llançament comercial: quina empresa presentarà la sol·licitud i amb quins signes.» | Eliminada: repetia la pregunta inicial i anticipava el subtítol següent; no es perd cap requisit. |

Comparació amb les tres columnes catalanes: 009 obre amb una dificultat general de cobrar indemnització i acaba amb una advertència temporal; 012 introdueix un risc general de conducció, encadena normativa/cas/recomanacions i acaba amb un avís general; 015 parteix de trobar un local, inclou una pregunta explícita i tanca amb «Amb això conclou l’explicació». En 852 s’ha escollit una escena marcada com a hipotètica, subtítols sobre signes, coneixement, terminis i cessió, i un final material sobre la carpeta de llançament. No s’ha imitat cap experiència atribuïda al despatx.

Descartat: protecció automàtica derivada d’un registre europeu, aplicació del sistema de Madrid a Taiwan, volum d’exportació català, èxit previ d’accions similars i notorietat presumida de marques catalanes. No eren necessaris ni s’havien verificat per a aquest encàrrec.

## 853 — Incorporació professional i residència

Fitxer: `drafts/ca/853-catalan-professional-taiwan-work-permit-residence.md`.

Lector i desencadenant: professional catalanoparlant que rep una oferta a Taiwan i vol fixar la data d’incorporació, possiblement amb cònjuge i fills. L’obertura pregunta si oferta i exempció de visat permeten començar a treballar.

Adequació territorial: Espanya i Andorra consten a la llista oficial de noranta dies. Això justifica explicar la diferència entre l’entrada i el permís necessari per al treball. Els exemples de disseny, comercialització i programari són hipòtesis de tasques possibles, no dades sobre l’ocupació de persones catalanes. La redacció també cobreix explícitament altres passaports sense inferir-ne cap dret.

Solapament i angle nou: en/704–706 són guies generals de vies, primer ARC i canvis; en/352 se centra en contractació sense societat taiwanesa. En 853 es resol la preparació d’una incorporació per a un lector catalanoparlant, amb dos passaports documentats, la via patrocinada, la Gold Card i el permís propi del cònjuge. El text no reprodueix el bloc fiscal ni el model EOR d’en/352. La columna catalana 009 es deixa com a lectura sobre dimissió, sense confondre indemnització amb immigració.

### Afirmacions i fonts contrastades

| Afirmació | Disposició i URL | Fragment contrastat i condicions conservades |
|---|---|---|
| Regla general d’autorització abans de treballar; excepcions legals. | [Llei de serveis d’ocupació, 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。` No es tracta l’ARC ni l’oferta com a permís obert. |
| Espanya i Andorra: fins a noranta dies; condicions de passaport, viatge i admissió. | [BOCA, guia anglesa citada](https://www.boca.gov.tw/fp-149-4486-7785a-1.html); [versió xinesa contrastada](https://www.boca.gov.tw/fp-384-4485-149c7-1.html) | `90天免簽證適用國家` inclou `安道爾(Andorra)` i `西班牙(Spain)`; `護照效期須在6個月以上`; `自入境翌日起算`; `回程機(船)票或次一目的地之機(船)票及有效簽證`. Es parla de passaport ordinari i es manté el control d’admissió. |
| Activitats subjectes a permís també durant una visita sense visat. | Mateixes guies BOCA, notes | `倘擬從事依國內其他機關法令須經許可之活動，仍須取得許可`. El text recomana concretar les activitats; no dicta que tota reunió comercial sigui treball prohibit. |
| Categories professionals i sol·licitud ordinària de l’ocupador, amb excepció docent. | [Llei de professionals, 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) i [5.1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | `外國專業人才：指得在我國從事專業工作之外國人`; `除本法另有規定外…向勞動部申請許可`; l’excepció del mateix apartat diu `向教育部申請許可`. |
| Gold Card: petició directa, quatre funcions, un a tres anys. | [9, apartats 1 i 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | `得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡`; `有效期間為一年至三年`. No es promet concessió ni renovació. |
| Permís obert i absència d’oferta o patrocini previs per a la Gold Card. | [Portal oficial Gold Card](https://goldcard.nat.gov.tw/en/about/) | Font publicada en anglès: `neither pre-confirmed hiring by nor application through any employer`. No s’ha inventat una cita xinesa per a aquesta pàgina. S’exigeix acreditar els criteris de qualificació. |
| Residència directa després d’entrada admesa, amb autorització professional o exempció. | [16.1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16); [guia NIA](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | `以免簽證或持停留簽證入國，經許可或免經許可…從事專業工作者，得逕向…申請居留；經許可者，發給外僑居留證。` Categoria, entrada, autorització i aprovació es mantenen. La guia administrativa es remet al lector per comprovar exclusions i documents, sense donar a tots els visitants dret de conversió. |
| ARC després d’entrada com a resident: trenta dies des de l’endemà; excepció de document integrat. | [Llei d’immigració, 22.2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | `應於入國後之翌日起算三十日內…申請外僑居留證`; `其他已含有外僑居留證功能之證件者，得免申請`. No es converteix en trenta dies extres per a visitants. |
| Família: residència aprovada del professional; cònjuge, menors i adults amb discapacitat que impedeix autonomia; entrada indicada. | [16.2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `經內政部移民署許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女，以免簽證或持停留簽證入國者…` No s’hi afegeix parella no casada ni qualsevol fill adult. |
| Cònjuge de professional especialista o d’alt nivell: petició pròpia de treball després de residència familiar aprovada. | [15.1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | `外國特定專業人才及外國高級專業人才之配偶…許可…依親居留者，得逕向勞動部申請許可`; `不得逾其依親居留期間`. No s’estén a tot cònjuge d’un professional ordinari ni es confon amb l’exempció del cònjuge d’un taiwanès. |

### Prova d’eliminació dels dos primers paràgrafs

| Frase | Decisió i motiu |
|---|---|
| «Podeu començar a treballar a Taipei amb una oferta signada i una entrada sense visat?» | Mantinguda: pregunta concreta que identifica els dos documents insuficients per concloure sobre autorització. |
| «La regla general de l’article 43… exigeix l’autorització… llevat d’una excepció legal.» | Mantinguda: resposta jurídica amb l’excepció preservada. |
| «L’oferta sola no l’acredita.» | Mantinguda: conseqüència pràctica breu per a la data d’incorporació, sense negar vies exemptes. |
| «Per a qui prepara el trasllat… passaport… funcions… empresa contractant.» | Mantinguda: concreta les dades que cal identificar abans de triar via. |
| «Una proposta per coordinar disseny… necessita una descripció de tasques.» | Mantinguda: afegeix el document i la connexió amb la feina prevista, sense prometre elegibilitat per sector. |
| «El títol del lloc pot ser massa vague per identificar la via adequada.» | Eliminada: repetia la justificació de descriure les tasques. No es perd cap criteri legal. |

Comparació: respecte de 009, s’ha evitat una obertura general sobre la dificultat i una advertència final sobre actuar abans. Respecte de 012, no s’ha usat la seqüència norma/cas del despatx/recomanacions. Respecte de 015, no hi ha una pregunta «Pregunta.» separada ni un final que anunciï que l’explicació s’ha acabat. La nova obertura és una pregunta sobre treballar; els subtítols segueixen passaport, qui sol·licita, ARC i família; el final deixa tres dates concretes per preparar la incorporació.

Descartat: salari mínim universal per a tots els professionals, admissió automàtica per tenir titulació catalana, dret de treball per qualsevol ARC familiar, requisits de vacances i treball, exempcions fiscals i terminis garantits de resolució. La guia Gold Card conté més dades, però no se n’han reproduït promeses de durada de tramitació.

## 854 — Divorci, retorn i residència familiar

Fitxer: `drafts/ca/854-catalan-taiwan-divorce-children-residence.md`.

Lector i desencadenant: persona catalanoparlant casada amb un nacional taiwanès, que vol preparar el divorci i un possible retorn a Catalunya, amb fills o una residència vinculada al matrimoni. El text comença amb el mínim de dos testimonis i la necessitat d’inscripció, i després tracta l’autoritat parental i l’ARC.

Adequació territorial: hipòtesi de lector del brief, no afirmació demogràfica sobre matrimonis catalans a Taiwan. La utilitat local es concreta en el retorn, la documentació en català o altres llengües, l’escolarització i les visites entre llocs distants. No s’explica el dret de família català o espanyol ni es promet reconeixement de resolucions en cap país.

Solapament i angle nou: es/693 treballa sobretot la llei patrimonial i l’habitatge. Aquí no es calcula cap liquidació patrimonial: s’encaixen les formalitats d’en/019, l’assistència des de l’estranger d’en/020 i la continuïtat de cures d’en/021 amb l’article 31 d’immigració, verificat de nou. L’enllaç intern al nou 853 remet a una possible via professional amb requisits, no a una solució assegurada després del divorci.

### Afirmacions i fonts contrastades

| Afirmació | Disposició i URL | Fragment xinès comprovat i límits |
|---|---|---|
| Escrit, almenys dos testimonis i registre per al divorci de mutu acord sota dret taiwanès. | [Codi civil, 1050](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1050) | `應以書面為之，有二人以上證人之簽名並應向戶政機關為離婚之登記。` Tots els requisits es mantenen també a la FAQ. |
| Efecte amb la inscripció; compareixença de tots dos com a regla; representació condicionada i documents estrangers. | [Ministeri de l’Interior, registre del divorci](https://www.ris.gov.tw/documents/html/2/3/1/384.html) | `兩願離婚…雙方當事人`; `有正當理由並經戶政事務所核准者，得以書面委託他人辦理`; `應向戶政機關為離婚之登記，始生效力`; `應備證件在國外作成者，應經我駐外館處驗證`; `應另檢附經駐外館處驗證或國內公證人認證之中文譯本`. No es presenta viure fora com a autorització automàtica de representació. |
| Llei del divorci: nacionalitat comuna, domicili comú, connexió més estreta; moment de l’acord o demanda. | [Llei de conflictes, 50](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=50) | `依協議時或起訴時夫妻共同之本國法；無共同之本國法時，依共同之住所地法；無共同之住所地法時，依與夫妻婚姻關係最切地之法律。` No s’equipara una adreça postal a domicili jurídic. |
| El divorci judicial requereix valorar causa legal i prova. | [Codi civil, 1052](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1052) | `夫妻之一方，有下列情形之一者，他方得向法院請求離婚` i `有前項以外之重大事由，難以維持婚姻者…`. No es presenta el desacord o un vol com a causa suficient, ni es formula una regla exhaustiva sobre culpa. |
| Mediació i tractament de la demanda directa, amb excepció de notificació edictal o a l’estranger. | [Llei de procediments de família, 23, apartats 1 i 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010048&flno=23) | `於請求法院裁判前，應經法院調解`; `逕向法院請求裁判者，視為調解之聲請。但當事人應為公示送達或於外國為送達者，不在此限。` L’excepció acompanya la regla de demanda directa. |
| Compareixença personal possible encara amb advocat; mitjans adequats segons l’assumpte. | [13.1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010048&flno=13) | `得命當事人或法定代理人本人到場，或依事件之性質，以適當方法命其陳述或訊問之。` No es promet compareixença remota ni dispensa de viatge. |
| Regla pròpia per a les relacions entre pares i fills. | [Llei de conflictes, 55](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=55) | `父母與子女間之法律關係，依子女之本國法。` El text requereix examinar nacionalitat o nacionalitats, sense resoldre automàticament un supòsit de doble nacionalitat. |
| Acord o decisió judicial sobre responsabilitats parentals i contacte. | [Codi civil, 1055](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1055) | `依協議由一方或雙方共同任之。未為協議或協議不成者，法院得…酌定之`; `酌定其與未成年子女會面交往之方式及期間`. El pla de viatge no es confon amb autorització per traslladar el menor. |
| Interès superior del menor, totes les circumstàncies. | [1055-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1055-1) | `應依子女之最佳利益，審酌一切情狀` — el pla pràctic de cures no es presenta com una llista exhaustiva de factors legals. |
| Desaparició del motiu de residència i supòsits discrecionals de continuïtat. | [Llei d’immigració, 31.4, especialment punts 2 i 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31) | `居留原因消失者，廢止其居留許可，並註銷其外僑居留證。但…得准予繼續居留`; `居住臺灣地區設有戶籍國民之配偶，因遭受家庭暴力離婚，且未再婚`; `對在臺灣地區已設有戶籍未成年子女，有撫育事實、行使負擔權利義務或會面交往`. Es conserven domicili/registre, motiu de violència, absència de nou matrimoni, menoria, registre dels fills i alternatives de relació parental. |

### Prova d’eliminació dels dos primers paràgrafs

| Frase | Decisió i motiu |
|---|---|
| «Dues signatures de testimonis són el mínim exigit…» | Mantinguda: dada concreta, amb l’abast condicionat al dret taiwanès. |
| «L’article 1050… també exigeix un document escrit i la inscripció…» | Mantinguda: dos requisits legals addicionals. |
| «Segons la guia… produeix efecte amb la inscripció.» | Mantinguda: moment de l’efecte, diferent del fet de ser un tràmit exigit. |
| «La signatura dels cònjuges no acaba el tràmit.» | Mantinguda: resposta breu al desencadenant; distingeix cònjuges i testimonis. |
| «Si el retorn a Catalunya és proper… data… fills… residència…» | Mantinguda: defineix els tres fets que el viatge obliga a concretar. |
| «Un bitllet de tornada pot quedar reservat abans que aquests punts s’hagin resolt.» | Eliminada: escena vaga que repetia la urgència del retorn. |
| «Convé separar-los en el calendari.» | Eliminada: recomanació genèrica ja expressada amb dades concretes al final. |

Comparació: 009 acaba amb una advertència general sobre el temps, que aquí es reemplaça per una pregunta específica sobre els dies entre divorci i sortida. A diferència de 012, no s’aporta un cas atribuït al despatx ni es dedueix un resultat personal. A diferència de 015, no es conclou amb una fórmula d’explicació acabada i consulta. L’entrada numèrica, el subtítol condicional sobre falta de consentiment i el final sobre l’ARC són diferents de les altres dues peces noves.

Descartat: liquidació automàtica per meitats, reconeixement recíproc general de divorcis espanyols i taiwanesos, dret automàtic de trasllat dels fills, conservació de l’ARC fins a la caducitat i una guia de dret català/espanyol. També s’ha evitat una regla simplificada sobre la culpa de 1052, que exigiria un examen constitucional específic per explicar-la amb precisió.

## Registre de revisions de llengua i sentit

| Problema detectat | Motiu | Modificació | Preservació del sentit |
|---|---|---|---|
| 853: «Treballar a Taiwan en català…» | Podia semblar una oferta de feines o assessorament en català. | «Professionals catalanoparlants a Taiwan: treball i residència». | Identifica el lector sense prometre idioma professional. |
| MONOTONY: inici de paràgrafs en 852 — quatre iniciats amb «Una» — variar segons el fet. | La repetició superava el límit de dues obertures iguals. | «Quan la cerca mostra…» i «Les converses sobre estoc…». | Es conserven registre, dates, autorització i negociació. |
| MONOTONY: inici de paràgrafs en 853 — quatre iniciats amb «Per» — fer explícit subjecte o context. | Ritme repetitiu de preposició més condició. | «En el treball professional…» i «Qui reuneix els requisits…». | Ministeri competent, categories i condicions Gold Card intactes. |
| MONOTONY: inici de paràgrafs en 854 — repeticions de «La» i «L’article» — variar el tipus d’obertura. | Tres obertures iguals en grups diferents. | «Segons la Llei…» i «Podeu consultar…». | Mediació, excepció i enllaç professional mantinguts. |
| 854: nacional amb registre familiar, sense explicitar residència a Taiwan en el supòsit de violència. | El fragment de 31.4.2 diu també `居住臺灣地區`. | «nacional resident a Taiwan amb registre familiar». | Condició completada; no s’amplia l’excepció. |
| Frases prescindibles als dos primers paràgrafs. | Repetició o anunci del contingut. | Eliminacions detallades en les tres taules anteriors. | No s’ha eliminat cap article, termini, excepció ni marca d’hipòtesi. |

## Varietat i autocomprovació de la secció 5

La còpia instal·lada de `/Users/son7/tseng-lanes-shared/variety/variety_metrics.py` només implementa ko, ja, en i zh-hant. Sense `--lang`, assignaria erròniament ko als fitxers de `drafts/ca/`. S’ha executat el comandament prescrit amb `--lang en` com a comprovació orientativa per a una llengua amb espais. Resultat: tres fitxers mesurats, codi de sortida 0 i zero FAIL. No és una validació lingüística nativa del català: el perfil anglès segmenta imperfectament els accents i no reconeix `Fonts` com a final de prosa.

| Article | Frases, perfil en | CV | Frases curtes | Tres longituds similars seguides | FAIL |
|---|---:|---:|---:|---:|---:|
| 852 | 45 | 0,531 | 22,2% | 0,0% | 0 |
| 853 | 45 | 0,476 | 15,6% | 2,3% | 0 |
| 854 | 47 | 0,465 | 10,6% | 0,0% | 0 |

S’ha afegit un recompte en memòria sobre la prosa catalana real, sense canviar l’eina compartida: exclou frontmatter, encapçalaments i Fonts; substitueix els enllaços pel text visible; segmenta per puntuació final i compta mots Unicode, preservant apòstrofs, punt volat i guions interns. S’ha contrastat la segmentació amb la lectura del text. Els llindars són els de la regla, no una afirmació científica d’equivalència entre llengües.

| Article | Frases | CV | Màxim 8 mots | Tres longituds similars | Màxima repetició d’inici de paràgraf | Inicis iguals en frases consecutives |
|---|---:|---:|---:|---:|---:|---:|
| 852 | 43 | 0,515 | 20,9% | 2,4% | 2 | 0 |
| 853 | 44 | 0,465 | 13,6% | 7,1% | 2 | 1 |
| 854 | 45 | 0,454 | 11,1% | 0,0% | 2 | 0 |

Autocomprovació dels nou punts:

1. Zero FAIL a l’execució orientativa; límit de suport català declarat. Recompte Unicode complementari dins dels llindars.
2. Entrades diferents: escena hipotètica dins la frase (852), pregunta real de permisos (853), nombre mínim de testimonis (854). Una escena en tres articles.
3. Almenys dues frases molt curtes en cada article. Cap paràgraf conté més d’una frase de 32 mots o més en el recompte Unicode.
4. Cap mot d’obertura de paràgraf es repeteix més de dues vegades; màxim una coincidència d’inicis consecutius en el recompte català.
5. Les cites apareixen com a subjecte, dins la frase o al final de l’afirmació. Hi ha paràgrafs de preparació sense afirmacions legals ni cites. No hi ha tres paràgrafs seguits amb la fórmula afirmació/cita/excepció.
6. Lectura manual dels contrastos: la distinció entre entrada i treball, o entre acord i trasllat, respon a preguntes del lector. No hi ha cap sèrie «no X sinó Y» ni refutacions d’afirmacions inventades.
7. Finals propis: carpeta de signes i expedients; dates d’incorporació; situació de residència entre divorci i sortida. Contacte abans del final material, Fonts com a cua estructural.
8. Català formal, cap negreta, H1, byline públic, experiència inventada ni subtítol de llista imperativa. Les consultes en català no es prometen.
9. FAQ contrastades amb el cos; en especial punt 12 i termini de cinc anys, aprovació de residència, categories del cònjuge, interès del menor i excepcions d’ARC. No s’han suprimit condicions per millorar el ritme.

## Recompte i comprovacions finals

Recompte de lliurament: text visible del cos amb els subtítols, abans de `## Fonts`; sense frontmatter ni URL. S’han normalitzat els espais i salts a un espai entre mots. Els caràcters inclouen espais. S’afegeix el recompte brut del fitxer per permetre la reproducció amb una altra convenció.

| Fitxer | Mots del cos | Caràcters del cos amb espais | Mots del fitxer complet, per espais | Caràcters del fitxer complet |
|---|---:|---:|---:|---:|
| `drafts/ca/852-catalan-brand-taiwan-trademark-distributor.md` | 727 | 4662 | 1105 | 8703 |
| `drafts/ca/853-catalan-professional-taiwan-work-permit-residence.md` | 767 | 5105 | 1145 | 9368 |
| `drafts/ca/854-catalan-taiwan-divorce-children-residence.md` | 789 | 5094 | 1182 | 9424 |

Comprovacions pròpies: YAML parsejat; camps en l’ordre exacte; dates correctes; tres FAQ; quatre tags per article; categoria existent; audiència ca; autoria interna; títols de menys de 70 caràcters, SEO de 30–60 i resums de 110–170; quatre subtítols de contingut i Fonts; cap negreta ni H1; una secció de contacte; enllaços interns a fitxers existents o al nou 853; slugs amb `catalan`, sense col·lisions al repositori i de 4–9 mots; totes les cites legals emprades prèviament recuperades amb `tools/law.py`; tots els URL oficials del cos també a Fonts. La disponibilitat dels recursos d’imatge resta com a incidència d’integració, no com a comprovació superada.
