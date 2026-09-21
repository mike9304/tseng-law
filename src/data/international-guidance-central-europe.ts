import type { GuidanceLocaleContent } from './international-guidance-content';

// SCAFFOLD: sk, bg, hr, sr, sl — cloned from template packs; every string must be translated and the SCAFFOLD markers removed.

// SCAFFOLD(cs) locale sk
export const slovakGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Čeština',
  nav: {
    home: 'Úvod',
    services: 'Služby',
    about: 'Kancelář',
    lawyers: 'Advokáti',
    pricing: 'Náklady',
    contact: 'Kontakt',
    faq: 'Otázky',
    privacy: 'Soukromí',
    disclaimer: 'Upozornění',
    columns: 'Články',
  },
  contactCta: 'Odeslat žádost o posouzení',
  footerNotice:
    'Tato česká stránka obsahuje pouze obecné informace o práci kanceláře podle tchajwanského práva. Není právní radou k jednotlivému případu a samotné odeslání zprávy nezakládá vztah mezi advokátkou nebo advokátem a klientem.',
  skipLink: 'Přeskočit navigaci a přejít k obsahu',
  menuLabel: 'Přehled stránek',
  languageLabel: 'Jazyk zobrazení',
  mega: {
    services: {
      description: 'Kancelář se zabývá hlavními agendami tchajwanského práva.',
      viewAllLabel: 'Zobrazit vše',
    },
    columns: {
      description: 'Články k častým otázkám tchajwanského práva.',
      viewAllLabel: 'Zobrazit vše',
    },
    lawyers: {
      description: 'Představení advokátek a advokátů a způsobů kontaktu.',
      viewAllLabel: 'Zobrazit vše',
    },
    pricing: {
      description: 'Tato stránka vysvětluje rozsah práce a způsob ujasnění nákladů.',
      viewAllLabel: 'Zobrazit vše',
    },
    faq: {
      description: 'Časté otázky k práci kanceláře na Tchaj-wanu.',
      viewAllLabel: 'Zobrazit vše',
    },
  },
  notFoundTitle: 'Stránka nenalezena',
  notFoundText:
    'Hledaná stránka neexistuje nebo byla přesunuta. Můžete se vrátit na českou úvodní stránku a prohlédnout si dostupné informace.',
  backHomeLabel: 'Na úvodní stránku',
  readSourceLabel: 'Otevřít seznam článků v původním jazyce',
  home: {
    heroScrollLabel: 'Posunout dolů',
    heroColumnsCtaLabel: 'Zobrazit články',
    servicesDetailLabel: 'Zobrazit podrobnosti',
    servicesAssistanceBefore: 'Není-li zřejmé, do které agendy Vaše věc patří, stránka ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter: ' vysvětluje, jak sestavit shrnutí, které advokátka nebo advokát posoudí.',
    columnsViewAllLabel: 'Zobrazit všechny články',
    columnsReadMoreLabel: 'Číst dál',
    columnsReviewLabel: 'Posoudila advokátka Wei Tseng',
    columnsOriginalLanguageBadge: 'Původní jazyk',
    columnsOriginalLanguageNote:
      'Následující články zatím nejsou k dispozici v češtině. Seznam zůstává v původním jazyce a otevře příslušnou jazykovou stránku; obsah se automaticky nepřekládá.',
    imageBandAlt: 'Tradiční tchajwanský dvorec sanheyuan (三合院) a moderní pavilon za denního světla',
    videoPauseLabel: 'Pozastavit video',
    videoPlayLabel: 'Přehrát video',
    videoReplayLabel: 'Přehrát video znovu',
  },
  pages: {
    home: {
      eyebrow: 'INFORMACE',
      title: 'Právní služby na Tchaj-wanu — informace v češtině',
      description:
        'Obecné vysvětlení v češtině o rozsahu práce Hovering International Law Firm na Tchaj-wanu, o jazycích konzultace a o prvním kontaktu.',
      intro:
        'Hovering International Law Firm zastupuje zahraniční klienty, včetně osob s vazbou na Tchaj-wan, ve věcech tchajwanského práva: investice a zakládání společností, občanskoprávní spory, manželství, rodina a dědictví, pracovní právo, trestní věci a duševní vlastnictví. Tato česká část Vám pomůže rozpoznat, která práce spadá do našeho rozsahu, co si připravit a jak nás oslovit. Jde o obecné informace, nikoli o právní radu k Vašemu případu.',
      sections: [
        {
          heading: 'Čím se zabýváme',
          paragraphs: [
            'Hovering International Law Firm je advokátní kancelář se sídlem na Tchaj-wanu. Pracuje podle tchajwanského práva a má pobočky v Tchaj-peji (臺北), Kao-siungu (高雄), Tchaj-čungu (臺中) a Pching-tungu (屏東). Radíme podnikům, vedeme soudní řízení a zastupujeme zahraniční klienty v krocích, které je na Tchaj-wanu třeba učinit.',
            'Celý zdejší obsah je obecný. Výsledek věci závisí na skutkovém stavu, na použitelných předpisech a na okamžiku. Tyto informace nenahrazují konzultaci s advokátkou nebo advokátem nad Vašimi dokumenty.',
          ],
        },
        {
          heading: 'Jazyk stránky a jazyk konzultace nejsou totéž',
          paragraphs: [
            'Tato stránka je psána česky, ale konzultace s advokátkou nebo advokátem probíhá pouze ve čtyřech jazycích: anglicky, čínsky (中文), japonsky a korejsky. Čtení informací v češtině neznamená, že konzultace s advokátkou nebo advokátem proběhne česky.',
            'Neslibujeme tlumočníka, lhůtu k odpovědi ani schůzku prostřednictvím této stránky. Pokud neovládáte žádný ze čtyř jazyků konzultace, stránka „Kontakt“ vysvětluje, jak posuzujeme způsob komunikace.',
          ],
        },
        {
          heading: 'Agendy kanceláře',
          paragraphs: [
            'Rozsah práce zahrnuje následujících šest agend. Stránka „Služby“ popisuje každou z nich přesněji a uvádí, co se neslibuje.',
          ],
          items: [
            'Investice a zakládání společností na Tchaj-wanu',
            'Občanskoprávní spory a náhrada škody',
            'Manželství, rodina a dědictví',
            'Pracovněprávní spory',
            'Trestní věci',
            'Duševní vlastnictví: ochranné známky, patenty a autorské právo',
          ],
        },
        {
          heading: 'Kde začít',
          paragraphs: [
            'Přečtěte si stránku „Služby“ a ověřte, zda Vaše věc spadá do našeho rozsahu, poté „Náklady“ a „Kontakt“, abyste věděli, jak se stanoví rozsah a jak se náklady potvrzují před zahájením práce.',
            'Při odeslání zprávy můžete shrnutí napsat ve svém jazyce. Původní text se uchová přesně tak, jak jste jej napsali, a automaticky se nepřekládá. Odeslaná zpráva je žádostí čekající na posouzení: není to ještě porada ani potvrzená schůzka.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'SLUŽBY',
      title: 'V čem klienty zastupujeme',
      description:
        'Šest agend, které kancelář na Tchaj-wanu vede, a hranice, které je užitečné znát nejdříve.',
      intro:
        'Níže jsou agendy, které skutečně vedeme, a otázky, jež se v počáteční fázi kladou nejčastěji. Výklad Vám pomůže posoudit, zda Vaše věc spadá do našeho rozsahu; je obecný a není právním rozborem jednotlivého spisu.',
      sections: [
        {
          heading: 'Investice a zakládání společností na Tchaj-wanu',
          paragraphs: [
            'Zastupujeme zahraniční investory a podniky při založení nebo vedení společnosti na Tchaj-wanu: volba právní formy, příprava a podání dokumentů, vklad kapitálu, bankovní otázky, posouzení sídla a odvětvové požadavky. Podporujeme také účetnictví a daně, které ze založení a z provozu na Tchaj-wanu vyplývají.',
            'Postup a lhůty se liší podle formy, investora, odvětví, banky a podle již dostupných dokumentů. Založení společnosti samo o sobě nevede k pobytovému oprávnění (居留) ani k pracovnímu povolení (工作許可): jde o samostatná řízení posuzovaná podle situace konkrétní osoby.',
          ],
        },
        {
          heading: 'Občanskoprávní spory a náhrada škody',
          paragraphs: [
            'Tato agenda zahrnuje spory ze smluv, náhradu škody z protiprávního jednání a spotřebitelské spory. Práce zpravidla začíná časovou osou, posouzením dokumentů a existujících důkazů a teprve poté následují další kroky.',
            'Průběh určují lhůty, včetně promlčecích, a úplnost důkazů. Uveďte proto známá data co nejdříve. Uschovejte smlouvy, zprávy, doklady o platbě nebo fotografie stavu na místě a zmiňte je v první zprávě.',
          ],
        },
        {
          heading: 'Manželství, rodina a dědictví',
          paragraphs: [
            'Vedeme rozvod (離婚), vypořádání majetku, výkon a převzetí práv a povinností k nezletilým dětem (未成年子女權利義務之行使或負擔), styk s dítětem (會面交往) a dědictví (繼承), a to i tehdy, nacházejí-li se strany nebo majetek v různých státech. Přeshraniční rodinné věci často vyžadují další posouzení matričních záznamů (戶籍), formy listin a jejich průkaznosti na Tchaj-wanu.',
            'Protože rodinné věci s sebou často nesou lhůty a souběžná řízení, mělo by první shrnutí uvést vztah mezi stranami, současné bydliště a již probíhající řízení.',
          ],
        },
        {
          heading: 'Pracovněprávní spory',
          paragraphs: [
            'Tato agenda zahrnuje skončení pracovního poměru, odstupné podle tchajwanského práva (資遣費; nelze je ztotožňovat s obdobnými instituty jiných států), odměnu a spory z pracovní smlouvy (勞動契約), a to jak na straně zaměstnance, tak na straně zaměstnavatele. Při posouzení odlišujeme důvod skončení od otázek výpovědní doby, výplaty a lhůt.',
            'Rozhodujícími dokumenty bývají pracovní smlouva, vnitřní pracovní řád (工作規則), výplatní pásky a korespondence stran. Máte-li je stále k dispozici, zmiňte to ve shrnutí.',
          ],
        },
        {
          heading: 'Trestní věci',
          paragraphs: [
            'Zastupujeme v přípravném řízení i před soudem podezřelé a obviněné i poškozené a posuzujeme trestní rizika podnikatelské činnosti.',
            'Trestní věci mívají krátké lhůty a pevně stanovené fáze. Obdrželi-li jste již písemnost orgánu činného v trestním řízení nebo soudu, uveďte datum na písemnosti včas, aby byl obsah posouzen ve správném pořadí.',
          ],
        },
        {
          heading: 'Duševní vlastnictví',
          paragraphs: [
            'Podporujeme zápis ochranných známek (商標) a patentů (專利), autorské právo a spory o tato práva na Tchaj-wanu.',
            'V této agendě rozhoduje pořadí kroků: rozsah ochrany, okamžik podání přihlášky a skutečné užívání ovlivňují volbu. Podání přihlášky samo o sobě neznamená, že jí bude vyhověno.',
          ],
        },
        {
          heading: 'Rozsah a jeho potvrzení',
          paragraphs: [
            'Kancelář pracuje podle tchajwanského práva a vede věci z výše uvedených agend. Rozsah každé věci se potvrzuje zvlášť poté, co advokátka nebo advokát posoudí Vaši zprávu.',
            'Pobytový status, pracovní povolení a obdobné otázky se posuzují podle dokumentů a podle situace konkrétní osoby, nikoli podle státní příslušnosti. Dotýká-li se část Vaší věci těchto bodů, uveďte to při kontaktu. Tato stránka neslibuje výsledek ani lhůtu k odpovědi.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'KANCELÁŘ',
      title: 'O Hovering International Law Firm',
      description:
        'Základní údaje o této tchajwanské advokátní kanceláři, o jejích pobočkách a o práci se zahraničními stranami.',
      intro:
        'Hovering International Law Firm je advokátní kancelář na Tchaj-wanu. Advokátky a advokáti pracují od poradenství podnikům až po soudní řízení. Tato část popisuje vznik kanceláře, sídla a práci se zahraničními stranami.',
      sections: [
        {
          heading: 'Založení a struktura',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) byla založena v roce 2016 advokátkami a advokáty, kteří studovali na National Taiwan University (國立臺灣大學). Čínský název 昊鼎 spojuje znak 昊 („širé nebe“) se znakem 鼎 („pevný základ“) a vystihuje zaměření kanceláře od jejího založení.',
            'Máme pobočky v Tchaj-peji (臺北), Kao-siungu (高雄), Tchaj-čungu (臺中) a Pching-tungu (屏東). Pobočka v Kao-siungu se soustředí na vedení podniků a vede občanskoprávní, trestní a správní spory. Pobočka v Tchaj-čungu vede stavební věci, duševní vlastnictví a věci s vazbou na Koreu a Japonsko. Pobočka v Pching-tungu byla otevřena v roce 2017 pro místní potřebu.',
            'Vedle advokátní práce působí od roku 2020 také Hovering Accounting Office, která nabízí účetnictví a daňové plánování podnikatelům a soukromým osobám s majetkem.',
          ],
        },
        {
          heading: 'Práce se zahraničními stranami',
          paragraphs: [
            'Přeshraniční práce zahrnuje zakládání společností, víza, přihlášky ochranných známek a patentů, posouzení právního rizika a daňové poradenství podnikům. Pobočka v Tchaj-čungu vede zejména stavební věci, duševní vlastnictví a věci s vazbou na Koreu a Japonsko. Advokátka Wei Tseng (曾雋崴) zastupuje klienty z Koreje, z Japonska a další mezinárodní klienty v uvedených agendách.',
            'Zda můžeme věc převzít, závisí na obsahu a na jazyku komunikace. Spadá-li Vaše věc do uvedených agend a lze-li ji projednat v některém ze čtyř jazyků konzultace, můžete zaslat shrnutí k posouzení.',
          ],
        },
        {
          heading: 'Když nás oslovíte',
          paragraphs: [
            'Po doručení Vašeho shrnutí posoudí advokátka nebo advokát obsah a poté hovoří o možném rozsahu práce, o dosud potřebných dokumentech a o dalších krocích. U daňových nebo účetních otázek může kancelář postupovat s účetním úsekem v jednom navazujícím postupu.',
            'Výsledek každé věci závisí na skutkovém stavu a na dostupných dokumentech; výsledek neslibujeme. Potřebujete-li závaznou odpověď pro svou situaci, musí být dokumenty projednány s advokátkou nebo advokátem v některém ze čtyř jazyků konzultace.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKÁTI',
      title: 'Mezinárodní tým Hovering',
      description: 'Profily advokátek a advokátů, provozního vedení a přidruženého účetnictví a auditu Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'NÁKLADY',
      title: 'Jak se stanoví rozsah práce a náklady',
      description:
        'Vysvětlení pořadí: nejprve rozsah práce, poté potvrzení nákladů, a proč tato stránka neobsahuje ceník.',
      intro:
        'Tato stránka vysvětluje, jak se náklady stanoví, nikoli jejich výši. Výše závisí na rozsahu práce v jednotlivé věci a má smysl teprve tehdy, je-li tento rozsah zřejmý.',
      sections: [
        {
          heading: 'Nejprve se stanoví rozsah práce',
          paragraphs: [
            'Věci téhož druhu mohou vyžadovat velmi rozdílné úsilí, podle počtu stran, dostupných dokumentů, lhůt, které je třeba dodržet, a podle toho, zda již bylo zahájeno řízení. Prvním krokem je proto vždy stanovit, co do práce patří a co nikoli.',
            'Shrnutí, které na začátku zašlete, je základem tohoto rozsahu. Čím jasněji popisuje průběh, Váš požadavek a lhůty, tím přesněji lze rozsah určit.',
          ],
        },
        {
          heading: 'Náklady se potvrzují před zahájením práce',
          paragraphs: [
            'Je-li rozsah práce zřejmý, výše a způsob výpočtu nákladů se s Vámi projedná a potvrdí dříve, než práce začne. Změní-li se rozsah v průběhu, musí být potvrzen znovu.',
            'Tato stránka není cenovou nabídkou a nezakládá povinnost k platbě.',
          ],
        },
        {
          heading: 'Porada může být úplatná',
          paragraphs: [
            'Porada s advokátkou nebo advokátem může být úplatnou službou. Tato stránka neříká, že první konzultace je bezplatná, a žádnou její část nelze v tomto smyslu vykládat.',
            'Je-li porada úplatná, sdělí se výše a způsob platby dříve, než se porada uskuteční.',
          ],
        },
        {
          heading: 'Proč tato stránka neuvádí sazby',
          paragraphs: [
            'Náklady závisejí na věci samé: na úsilí, počtu stran, dokumentech, lhůtách a na tom, zda již řízení probíhá. Číslo stanovené předem by náklady Vašeho spisu neukázalo. Proto nejprve stanovíme rozsah práce a náklady Vám sdělíme poté, dříve než práce začne.',
            'Vedle odměny mohou vzniknout soudní poplatky, náklady orgánů nebo třetích osob. Ty jsou od odměny oddělené a závisejí na příslušném řízení.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Jak kancelář oslovit',
      description:
        'Jazyk stránky, jazyky konzultace, postup pro případ, že neovládáte žádný ze čtyř jazyků, a co tato stránka neslibuje.',
      intro:
        'Než nám napíšete, rozlište následující tři body. Bývají směšovány, ale znamenají různé věci.',
      sections: [
        {
          heading: 'Tři věci, které je třeba držet odděleně',
          paragraphs: [
            'Jazyk zobrazení stránky, jazyk konzultace s advokátkou nebo advokátem a jazyk, v němž píšete, jsou tři různé věci.',
          ],
          items: [
            'Jazyk stránky: tyto informace jsou psány česky.',
            'Jazyk konzultace: porada probíhá pouze anglicky, čínsky (中文), japonsky a korejsky.',
            'Váš jazyk psaní: shrnutí můžete napsat ve svém jazyce; původní text se uchová beze změny.',
          ],
        },
        {
          heading: 'Pokud neovládáte žádný ze čtyř jazyků konzultace',
          paragraphs: [
            'V kontaktním formuláři můžete zvolit „Způsob komunikace je třeba potvrdit“. Odpovíme, abychom posoudili schůdný způsob komunikace, existuje-li takový; služba v jiném jazyce zaručena není a lhůta k odpovědi se neslibuje.',
            'Jde pouze o krok posouzení, nikoli o příslib. Neslibujeme tlumočníka, službu v češtině ani v jiném jazyce mimo čtyři uvedené jazyky, ani to, že každou věc přijmeme.',
          ],
        },
        {
          heading: 'Co by měla obsahovat první zpráva',
          paragraphs: [
            'Uveďte, co se stalo, jakou pomoc potřebujete, jakou vazbu má věc na Tchaj-wan a lhůtu, znáte-li ji. Obdrželi-li jste již písemnost soudu nebo úřadu, uveďte datum na písemnosti.',
            'V počáteční fázi zatím nemusíte zasílat číslo pasu, číslo dokladu, údaje o účtu, zdravotní dokumentaci ani soubor důkazů. Vyčkejte pokynů advokátky nebo advokáta a citlivé dokumenty zašlete až poté bezpečnou cestou.',
          ],
        },
        {
          heading: 'Co tato stránka neslibuje',
          paragraphs: [
            'Neslibujeme lhůtu k odpovědi, nepotvrzujeme schůzku prostřednictvím této stránky, neslibujeme určitou advokátku ani určitého advokáta a neposkytujeme tlumočníka. Písemný překlad je něco jiného: Vaše zpráva se automaticky nepřekládá.',
            'Odešlete-li žádost, obsah se uchová a čeká na posouzení. Neobdržíte-li po nějaké době odpověď, můžete napsat znovu na e-mailovou adresu uvedenou na kontaktní stránce.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'OTÁZKY',
      title: 'Časté otázky',
      description:
        'Vysvětlení k rozsahu práce, přípravě, jazykům, nákladům a k tomu, co znamená odeslaná žádost.',
      intro:
        'Následující otázky jsou zodpovězeny na úrovni obecných informací. Odpověď pro Váš případ je možná teprve poté, co advokátka nebo advokát posoudí dokumenty.',
      sections: [
        {
          heading: 'Jak tuto část užívat',
          paragraphs: [
            'Nenajdete-li odpověď pro svou situaci, závisí odpověď zpravidla na zvláštních skutečnostech. Napište je proto do shrnutí, namísto abyste je dovozovali z této stránky.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Které věci kancelář vede?',
          answer:
            'Vedeme šest agend: investice a zakládání společností na Tchaj-wanu, občanskoprávní spory a náhradu škody, manželství, rodinu a dědictví, pracovněprávní spory, trestní věci a duševní vlastnictví. Zda bude věc přijata, se rozhodne po posouzení obsahu.',
        },
        {
          question: 'Co si připravit před kontaktem?',
          answer:
            'Připravte si krátké shrnutí průběhu, svého požadavku, vazby na Tchaj-wan a lhůty, existuje-li nějaká. Je-li již k dispozici písemnost soudu nebo úřadu, uveďte datum. V této fázi zatím nemusíte zasílat doklady totožnosti ani soubor důkazů.',
        },
        {
          question: 'Je možná porada v češtině?',
          answer:
            'Ne. Tyto informace jsou psány česky, ale porada s advokátkou nebo advokátem probíhá pouze anglicky, čínsky (中文), japonsky a korejsky. Neslibujeme ani tlumočníka. Písemný překlad je něco jiného: původní text, který napíšete, se uchová tak, jak je, a automaticky se nepřekládá.',
        },
        {
          question: 'Co dělat, nemohu-li užít žádný ze čtyř jazyků?',
          answer:
            'Při odeslání žádosti zvolte „Způsob komunikace je třeba potvrdit“. Odpovíme, abychom posoudili způsob komunikace, ale služba v jiném jazyce zaručena není. Jde o krok posouzení, nikoli o příslib, že můžeme pracovat v jiném jazyce.',
        },
        {
          question: 'Jak se nakládá s mým textem v češtině?',
          answer:
            'Původní text, který napíšete, se uchová tak, jak je, a automaticky se nepřekládá. Je-li to potřeba, jazyk další komunikace se s Vámi potvrdí.',
        },
        {
          question: 'Proběhla porada již tím, že je žádost odeslána?',
          answer:
            'Ne. Odeslaná žádost čeká na posouzení advokátkou nebo advokátem. Není to právní stanovisko, není to potvrzená schůzka a samotné odeslání nezakládá vztah mezi advokátkou nebo advokátem a klientem.',
        },
        {
          question: 'Jak se počítají náklady?',
          answer:
            'Nejprve se stanoví rozsah práce, poté se s Vámi potvrdí výše a způsob výpočtu nákladů, dříve než práce začne. Tato stránka neuvádí částky a neříká, že první konzultace je bezplatná.',
        },
        {
          question: 'Co dělat, je-li má věc velmi naléhavá?',
          answer:
            'Uveďte lhůtu nebo datum z úřední písemnosti hned na začátku shrnutí, aby byla tato data při posouzení vidět. Tato stránka nemá nouzový kanál a nezajišťuje lhůtu k odpovědi; nesnese-li Vaše věc odkladu, měli byste souběžně hledat další cesty ve svém místě.',
        },
      ],
    },
    privacy: {
      eyebrow: 'SOUKROMÍ',
      title: 'Údaje sbírané kontaktním formulářem',
      description:
        'Co sbírá kontaktní formulář v této české části, jak se nakládá s původním textem a jak nás oslovit ohledně Vašich údajů.',
      intro:
        'Tato část se týká pouze kontaktního formuláře na těchto informačních stránkách. Popisuje nakládání s údaji, nikoli technickou záruku.',
      sections: [
        {
          heading: 'Které údaje se sbírají',
          paragraphs: [
            'Odešlete-li žádost prostřednictvím formuláře v této části, zaznamenají se tyto údaje:',
          ],
          items: [
            'Jméno, které uvedete',
            'E-mailová adresa pro odpověď',
            'Jazyk zobrazení stránky v okamžiku odeslání',
            'Jazyk, v němž jste psali',
            'Jazyk konzultace, který si přejete',
            'Původní text, který jste napsali',
            'Váš souhlas s odesláním žádosti',
            'Číslo podání pro dohledání žádosti',
          ],
        },
        {
          heading: 'Původní text se uchová beze změny',
          paragraphs: [
            'Váš text se uchová přesně tak, jak jste jej napsali, a automaticky se nepřekládá. Je-li pro vyřízení potřebný překlad, projedná se to s Vámi zvlášť.',
            'Protože se původní text uchovává, nepište v počáteční fázi to, co zatím není potřebné, například číslo pasu, číslo dokladu nebo údaje o účtu.',
          ],
        },
        {
          heading: 'Místo uchování a přístup',
          paragraphs: [
            'Obsah Vašeho podání se uchovává na místě, které není veřejně přístupné. Přístup k němu mají pouze oprávněné osoby v kanceláři, a to za účelem vyřízení žádosti.',
            'Tato stránka nedává absolutní záruku bezpečnosti. Žádná cesta přenosu a žádné místo uchování není zcela bezpečné; citlivé dokumenty by proto měly být zasílány až po zvláštním pokynu advokátky nebo advokáta.',
          ],
        },
        {
          heading: 'Účel užití',
          paragraphs: [
            'Odeslané údaje slouží k posouzení žádosti, k odpovědi Vám, k ujasnění způsobu komunikace a k vyřízení, je-li práce převzata.',
            'Údaje se bez zvláštního souhlasu neužívají k marketingu.',
          ],
        },
        {
          heading: 'Oznámení a číslo podání',
          paragraphs: [
            'Je-li žádost úspěšně odeslána, systém uvědomí kancelář. Není-li toto oznámení zatím potvrzeno, Váš text zůstává uchován a neztrácí se.',
            'Číslo podání slouží k dohledání Vaší žádosti v našich záznamech. Zobrazí se po uložení; můžete je uvést při novém kontaktu.',
          ],
        },
        {
          heading: 'Vaše práva a cesta ke kontaktu',
          paragraphs: [
            'Můžete žádat o přístup ke svým údajům, o jejich opravu nebo výmaz, případně odvolat souhlas, a to prostřednictvím e-mailové adresy uvedené na kontaktní stránce. Existuje-li zákonná nebo procesní povinnost uchování, vysvětlíme omezení.',
            'Tato stránka neuvádí pevnou dobu uchování, protože skutečná doba závisí na dalším průběhu věci a na souvisejících povinnostech. Přejete-li si dřívější výmaz, sdělte to při kontaktu.',
          ],
        },
        {
          heading: 'Místo uchování a poskytovatelé',
          paragraphs: [
            'Tyto stránky jsou hostovány u společnosti Vercel a Vaše podání se uchovává v neveřejném objektovém úložišti této služby. E-maily se odesílají poštovní službou, kterou kancelář užívá.',
            'Servery jednotlivých poskytovatelů se mohou nacházet mimo Tchaj-wan, takže Vaše údaje tam mohou být uchovávány a zpracovávány. Je-li účel uchování naplněn, údaje se bez zbytečného odkladu vymažou; údaje, které je třeba uchovávat podle použitelných předpisů, zůstávají po tuto dobu. Žádosti o osobní údaje přijímá wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'UPOZORNĚNÍ',
      title: 'Rozsah a hranice informací na této stránce',
      description:
        'Obecná povaha informací, právní rámec a předpoklady vzniku vztahu mezi advokátkou nebo advokátem a klientem.',
      intro:
        'Tato část objasňuje, co pro Vás tyto české informační stránky mohou udělat a co nikoli.',
      sections: [
        {
          heading: 'Pouze obecné informace',
          paragraphs: [
            'Obsah těchto stránek je psán jako obecná informace. Není právní radou k Vašemu případu a nenahrazuje posouzení Vašich dokumentů.',
            'Výsledek věci závisí na skutkovém stavu, na použitelných předpisech a na okamžiku; dvě zdánlivě podobné situace mohou skončit různě.',
          ],
        },
        {
          heading: 'Právní rámec',
          paragraphs: [
            'Kancelář působí podle tchajwanského práva a tato stránka hovoří pouze o práci v tomto rámci.',
            'Obsah není poradenstvím podle práva jiného řádu než tchajwanského, včetně práva místa Vašeho pobytu. Týká-li se část Vaší věci jiného právního řádu, ujasníme s Vámi, jaká kvalifikovaná osoba je pro tuto část potřebná.',
          ],
        },
        {
          heading: 'Vztah mezi advokátkou nebo advokátem a klientem nevzniká sám od sebe',
          paragraphs: [
            'Přečtení této stránky, odeslání formuláře nebo e-mailu samo o sobě nezakládá vztah mezi advokátkou nebo advokátem a klientem.',
            'Tento vztah vzniká teprve poté, co byla věc posouzena a obě strany potvrdily převzetí práce.',
          ],
        },
        {
          heading: 'Žádný příslib výsledku',
          paragraphs: [
            'Žádná část této stránky není příslibem ohledně výsledku věci, vyhovění přihlášce nebo žádosti či ohledně pobytového a pracovního statusu.',
            'Vnější odkazy slouží k orientaci; neslibujeme správnost ani aktuálnost obsahu třetích osob.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ČLÁNKY',
      title: 'Články o tchajwanském právu',
      description:
        'Články v češtině k častým otázkám tchajwanského práva. Obsah je obecnou informací k okamžiku zveřejnění, nikoli právní radou k Vašemu případu.',
      intro:
        'Kancelář zveřejňuje články k častým otázkám tchajwanského práva. Články dostupné v češtině jsou na této stránce; vedle nich jsou čtyři odkazy, z nichž každý otevře seznam článků v jednom původním jazyce.',
      sections: [
        {
          heading: 'Čtyři seznamy podle jazyka',
          paragraphs: [
            'Tato část obsahuje čtyři odkazy: seznam článků v korejštině, v čínštině, v angličtině a v japonštině. Každý odkaz uvádí jazyk seznamu, takže předem víte, v jakém jazyce se obsah otevře.',
            'Tyto čtyři seznamy jsou seznamy podle původního jazyka článků, nikoli seznamy překladů. Články dostupné v češtině jsou zvlášť na této stránce.',
          ],
        },
        {
          heading: 'Kam odkazy vedou',
          paragraphs: [
            'Zvolíte-li jeden ze čtyř odkazů, otevře se seznam článků v daném jazyce. Ze seznamu si text vyberete sami; celý obsah se zobrazí v původním jazyce článku.',
            'Tato stránka obsah článků neshrnuje a nezaručuje, že určité téma je k dispozici ve všech čtyřech jazycích. Každý seznam obsahuje pouze texty zveřejněné v daném jazyce.',
          ],
        },
        {
          heading: 'Nakolik může článek sloužit k orientaci',
          paragraphs: [
            'Články jsou obecnými informacemi k okamžiku zveřejnění. Předpisy a jejich používání se mohou změnit a článek neobsahuje všechny okolnosti Vašeho případu.',
            'Nezakládejte proto postup ve skutečné věci pouze na článku. Užijte jej k přehledu a své dokumenty projednejte zvlášť s advokátkou nebo advokátem; tato stránka není krokem porady.',
          ],
        },
      ],
    },
  },
};

// SCAFFOLD(ru) locale bg
export const bulgarianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Русский',
  nav: {
    home: 'Главная',
    services: 'Услуги',
    about: 'Фирма',
    lawyers: 'Адвокаты',
    pricing: 'Стоимость',
    contact: 'Контакты',
    faq: 'Частые вопросы',
    privacy: 'Данные',
    disclaimer: 'Оговорка',
    columns: 'Материалы',
  },
  contactCta: 'Отправить запрос на консультацию',
  footerNotice:
    'Эта русскоязычная страница содержит лишь общие сведения о работе фирмы по праву Тайваня. Это не юридическая консультация по конкретному делу, и отправка сообщения сама по себе не создаёт отношений между адвокатом и доверителем.',
  skipLink: 'Пропустить навигацию и перейти к содержанию',
  menuLabel: 'Каталог страниц',
  languageLabel: 'Язык отображения',
  mega: {
    services: {
      description: 'Фирма ведёт основные группы дел по праву Тайваня.',
      viewAllLabel: 'Показать все',
    },
    columns: {
      description: 'Материалы по частым вопросам права Тайваня.',
      viewAllLabel: 'Показать все',
    },
    lawyers: {
      description: 'Представление адвокатов и способов связи.',
      viewAllLabel: 'Показать все',
    },
    pricing: {
      description: 'Эта страница объясняет объём работы и то, как определяется стоимость.',
      viewAllLabel: 'Показать все',
    },
    faq: {
      description: 'Частые вопросы о работе фирмы на Тайване.',
      viewAllLabel: 'Показать все',
    },
  },
  notFoundTitle: 'Страница не найдена',
  notFoundText:
    'Искомая страница не существует или была перемещена. Вы можете вернуться на русскую главную страницу, чтобы увидеть доступные сведения.',
  backHomeLabel: 'На главную',
  readSourceLabel: 'Открыть список материалов на языке оригинала',
  home: {
    heroScrollLabel: 'Прокрутить вниз',
    heroColumnsCtaLabel: 'Смотреть материалы',
    servicesDetailLabel: 'Смотреть подробности',
    servicesAssistanceBefore: 'Если неясно, к какой группе относится Ваш вопрос, страница ',
    servicesAssistanceLinkLabel: 'Контакты',
    servicesAssistanceAfter:
      ' объясняет, как составить краткое изложение, которое рассмотрит адвокат.',
    columnsViewAllLabel: 'Смотреть все материалы',
    columnsReadMoreLabel: 'Читать далее',
    columnsReviewLabel: 'Проверено адвокатом Wei Tseng (曾雋崴)',
    columnsOriginalLanguageBadge: 'Язык оригинала',
    columnsOriginalLanguageNote:
      'Следующие материалы ещё не подготовлены на русском языке. Список остаётся на языке оригинала и открывает соответствующую языковую страницу; содержание автоматически не переводится.',
    imageBandAlt: 'Традиционный тайваньский санхэюань (三合院) и современный павильон при дневном свете',
    videoPauseLabel: 'Приостановить видео',
    videoPlayLabel: 'Воспроизвести видео',
    videoReplayLabel: 'Воспроизвести видео снова',
  },
  pages: {
    home: {
      eyebrow: 'СВЕДЕНИЯ',
      title: 'Юридические услуги на Тайване — сведения на русском языке',
      description:
        'Общие пояснения на русском языке о сфере работы Hovering International Law Firm на Тайване, о языках консультации и о первом обращении.',
      intro:
        'Hovering International Law Firm сопровождает доверителей из-за рубежа, в том числе связанных с Тайванем, в делах по праву Тайваня: инвестиции и учреждение компаний, гражданские споры, брак, семья и наследство, трудовое право, уголовные дела и интеллектуальная собственность. Этот русский раздел помогает понять, какая работа входит в нашу сферу, что подготовить и как с нами связаться. Это общие сведения, а не юридическая консультация по Вашему делу.',
      sections: [
        {
          heading: 'Чем мы занимаемся',
          paragraphs: [
            'Hovering International Law Firm — адвокатская фирма, учреждённая на Тайване. Она работает по праву Тайваня и имеет офисы в городах Тайбэй (臺北), Гаосюн (高雄), Тайчжун (臺中) и Пиндун (屏東). Мы консультируем компании, ведём дела в суде и сопровождаем доверителей из-за рубежа через шаги, необходимые на Тайване.',
            'Всё содержание здесь носит общий характер. Исход дела зависит от фактов, применимых норм и момента времени. Эти сведения не заменяют беседу с адвокатом о Ваших документах.',
          ],
        },
        {
          heading: 'Язык страницы и язык консультации — не одно и то же',
          paragraphs: [
            'Эта страница написана на русском языке, но консультация с адвокатом проводится только на четырёх языках консультации: английском, китайском (中文), японском и корейском. Чтение русских сведений не означает, что беседа с адвокатом состоится на русском языке.',
            'Мы не обещаем переводчика, срок ответа и запись через эту страницу. Если Вы не можете пользоваться ни одним из четырёх языков, страница «Контакты» объясняет, как мы рассматриваем способ связи.',
          ],
        },
        {
          heading: 'Направления работы',
          paragraphs: [
            'Сфера работы включает следующие шесть групп. Страница «Направления работы» описывает каждую группу подробнее и указывает, что не обещается.',
          ],
          items: [
            'Инвестиции и учреждение компании на Тайване',
            'Гражданские дела и возмещение вреда',
            'Брак, семья и наследство',
            'Трудовые споры',
            'Уголовные дела',
            'Интеллектуальная собственность: товарные знаки, патенты и авторское право',
          ],
        },
        {
          heading: 'С чего следует начать',
          paragraphs: [
            'Прочитайте страницу «Направления работы», чтобы проверить, входит ли Ваш вопрос в нашу сферу, затем «Объём и стоимость» и «Контакты», чтобы узнать, как определяется объём и как стоимость подтверждается до начала работы.',
            'При отправке сообщения Вы можете написать краткое изложение на своём языке. Исходный текст сохраняется так, как Вы его написали, и автоматически не переводится. Отправленное сообщение — запрос, ожидающий рассмотрения: это ещё не консультация и ещё не подтверждённая запись.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'НАПРАВЛЕНИЯ РАБОТЫ',
      title: 'Какие дела мы ведём',
      description:
        'Шесть групп работы фирмы на Тайване и границы, которые следует знать сначала.',
      intro:
        'Ниже — группы, которые мы действительно ведём, и вопросы, которые часто задают на начальном этапе. Изложение помогает оценить, входит ли Ваш вопрос в нашу сферу; оно носит общий характер и не является юридическим разбором отдельного дела.',
      sections: [
        {
          heading: 'Инвестиции и учреждение компании на Тайване',
          paragraphs: [
            'Мы сопровождаем иностранных инвесторов и компании при учреждении или ведении общества на Тайване: выбор правовой формы, подготовка и подача документов, внесение капитала, банковские вопросы, проверка места деятельности и отраслевые требования. Мы также помогаем с бухгалтерией и налогами, которые возникают из учреждения и деятельности на Тайване.',
            'Порядок и сроки различаются в зависимости от правовой формы, инвестора, отрасли, банка и имеющихся документов. Учреждение компании само по себе не ведёт к виду на жительство (居留) или разрешению на работу (工作許可): это отдельные процедуры, которые оцениваются по положению конкретного лица.',
          ],
        },
        {
          heading: 'Гражданские дела и возмещение вреда',
          paragraphs: [
            'Эта группа включает договорные споры, возмещение вреда из деликта и потребительские споры. Работа обычно начинается с хронологии, проверки имеющихся документов и доказательств и лишь затем — со следующих шагов.',
            'Сроки, включая законные сроки подачи иска, и полнота доказательств формируют ход дела. Поэтому известные даты следует назвать как можно раньше. Сохраняйте договоры, сообщения, платёжные документы или фотографии обстановки на месте и упомяните их в первом сообщении.',
          ],
        },
        {
          heading: 'Брак, семья и наследство',
          paragraphs: [
            'Мы ведём развод (離婚), раздел имущества, осуществление и несение прав и обязанностей в отношении несовершеннолетних детей (未成年子女權利義務之行使或負擔), общение (會面交往) и наследование (繼承), в том числе если стороны или имущество находятся в разных государствах. Трансграничные семейные дела часто требуют дополнительной проверки документов о регистрации по месту жительства (戶籍), формы актов и их доказательственной силы на Тайване.',
            'Поскольку семейные дела часто связаны со сроками и параллельными процедурами, первое краткое изложение должно назвать отношения сторон, нынешнее место жительства и уже идущие процедуры.',
          ],
        },
        {
          heading: 'Трудовые споры',
          paragraphs: [
            'Эта группа включает прекращение трудовых отношений, выходное пособие по праву Тайваня (資遣費; его не следует отождествлять с институтами других государств), заработную плату и споры из трудового договора (勞動契約) — как на стороне работника, так и на стороне работодателя. При рассмотрении мы отделяем основание прекращения от вопросов уведомления, выплаты и сроков.',
            'Трудовой договор, правила работы (工作規則), расчётные листки и переписка сторон обычно являются решающими документами. Если они у Вас ещё есть, упомяните это в кратком изложении.',
          ],
        },
        {
          heading: 'Уголовные дела',
          paragraphs: [
            'Мы сопровождаем в расследовании и в суде — как для подозреваемых или обвиняемых, так и для потерпевших — и оцениваем уголовные риски предпринимательской деятельности.',
            'У уголовных дел часто короткие сроки и установленные стадии. Если Вы уже получили письмо органа уголовного преследования или суда, укажите дату письма как можно раньше, чтобы содержание рассмотрели в верном порядке.',
          ],
        },
        {
          heading: 'Интеллектуальная собственность',
          paragraphs: [
            'Мы помогаем при регистрации товарных знаков (商標) и патентов (專利), при авторском праве и при спорах об этих правах на Тайване.',
            'В этой группе важен порядок шагов: объём охраны, момент подачи и фактическое использование влияют на выбор. Подача заявления сама по себе не означает, что оно будет удовлетворено.',
          ],
        },
        {
          heading: 'Объём и его подтверждение',
          paragraphs: [
            'Фирма работает по праву Тайваня и ведёт дела названных групп. Объём каждого дела подтверждается отдельно после того, как адвокат рассмотрит Ваше сообщение.',
            'Статус пребывания, разрешение на работу и сходные вопросы оцениваются по документам и положению конкретного лица, а не по гражданству. Если часть Вашего вопроса затрагивает такие темы, назовите это при обращении. Эта страница не обещает ни результата, ни срока ответа.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'ФИРМА',
      title: 'О Hovering International Law Firm',
      description:
        'Основные сведения об этой тайваньской адвокатской фирме, её офисах и работе с иностранными участниками.',
      intro:
        'Hovering International Law Firm — адвокатская фирма на Тайване. Адвокаты ведут работу от консультирования компаний до судебных разбирательств. Этот раздел описывает возникновение фирмы, места и работу с иностранными участниками.',
      sections: [
        {
          heading: 'Основание и структура',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) основана в 2016 году адвокатами, учившимися в National Taiwan University (國立臺灣大學). Китайское название 昊鼎 соединяет знак 昊 («широкое небо») со знаком 鼎 («прочное основание») и описывает направление фирмы с момента основания.',
            'У нас есть офисы в городах Тайбэй (臺北), Гаосюн (高雄), Тайчжун (臺中) и Пиндун (屏東). Офис в Гаосюне сосредоточен на корпоративной практике и ведёт гражданские, уголовные и административные споры. Офис в Тайчжуне ведёт строительные дела, интеллектуальную собственность и дела, связанные с Кореей и Японией. Офис в Пиндуне открыт в 2017 году для местных нужд.',
            'Помимо адвокатской работы с 2020 года существует также Hovering Accounting Office, которое предлагает бухгалтерию и налоговое планирование предпринимателям и состоятельным частным лицам.',
          ],
        },
        {
          heading: 'Работа с иностранными участниками',
          paragraphs: [
            'Трансграничная работа включает учреждение компаний, визы, подачу заявок на товарные знаки и патенты, проверку правовых рисков и налоговое консультирование компаний. Офис в Тайчжуне особенно ведёт строительные дела, интеллектуальную собственность и дела, связанные с Кореей и Японией. Адвокат Wei Tseng (曾雋崴) сопровождает доверителей из Кореи, Японии и других международных доверителей в названных группах.',
            'Можем ли мы принять дело, зависит от содержания и языка общения. Если Ваш вопрос входит в названные группы и его можно обсудить на одном из четырёх языков консультации, Вы можете отправить краткое изложение на рассмотрение.',
          ],
        },
        {
          heading: 'Когда Вы обращаетесь к нам',
          paragraphs: [
            'После поступления Вашего краткого изложения адвокат рассматривает содержание и затем обсуждает возможный объём работы, ещё нужные документы и следующие шаги. При налоговых или бухгалтерских вопросах фирма может вести их вместе с бухгалтерским подразделением.',
            'Исход каждого дела зависит от фактов и имеющихся документов; мы не обещаем результата. Если Вам нужен обязывающий ответ для Вашей ситуации, документы необходимо обсудить с адвокатом на одном из четырёх языков консультации.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'АДВОКАТЫ',
      title: 'Международная команда Hovering',
      description: 'Профили адвокатов, операционного менеджера и партнёра-бухгалтера Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'ОБЪЁМ И СТОИМОСТЬ',
      title: 'Как определяются объём работы и стоимость',
      description:
        'Пояснение порядка: сначала объём работы, затем подтверждение стоимости, и почему на этой странице нет прейскуранта.',
      intro:
        'Эта страница объясняет, как определяется стоимость, а не её размер. Размер зависит от объёма работы конкретного дела и имеет смысл лишь тогда, когда этот объём ясен.',
      sections: [
        {
          heading: 'Сначала определяется объём работы',
          paragraphs: [
            'Дела одного вида могут требовать очень разного труда в зависимости от числа участников, имеющихся документов, сроков, которые нужно соблюсти, и того, началась ли уже процедура. Поэтому первый шаг всегда — определить, что входит в работу, а что нет.',
            'Краткое изложение, которое Вы отправляете в начале, — основа этого объёма. Чем яснее оно описывает ход событий, Ваш запрос и сроки, тем точнее можно определить объём.',
          ],
        },
        {
          heading: 'Стоимость подтверждается до начала работы',
          paragraphs: [
            'Когда объём работы ясен, размер и способ расчёта стоимости обсуждаются и подтверждаются с Вами до начала работы. Если объём меняется по ходу, это нужно подтвердить снова.',
            'Эта страница не является предложением цены и не создаёт обязанности платить. Отправка запроса через эту страницу также не требует оплаты.',
          ],
        },
        {
          heading: 'Консультация может быть возмездной услугой',
          paragraphs: [
            'Консультация с адвокатом может быть возмездной услугой. Эта страница не говорит, что первая беседа проводится без оплаты, и никакая часть не должна так читаться.',
            'Если консультация возмездна, размер и способ оплаты сообщаются до её проведения.',
          ],
        },
        {
          heading: 'Почему эта страница не называет тарифы',
          paragraphs: [
            'Стоимость зависит от самого дела: от труда, числа участников, документов, сроков и того, идёт ли уже процедура. Заранее названная цифра не показала бы стоимость Вашего дела. Поэтому мы сначала определяем объём работы и затем сообщаем Вам стоимость до начала работы.',
            'Помимо гонорара адвоката могут возникнуть судебные и административные расходы, а также расходы третьих лиц. Они отделены от гонорара и зависят от соответствующей процедуры.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'КОНТАКТЫ',
      title: 'Как связаться с фирмой',
      description:
        'Язык страницы, языки консультации, порядок, если Вы не можете пользоваться ни одним из четырёх языков, и что эта страница не обещает.',
      intro:
        'Прежде чем писать нам, различайте следующие три пункта. Их часто смешивают, но они означают разное.',
      sections: [
        {
          heading: 'Три вещи, которые нужно держать раздельно',
          paragraphs: [
            'Язык отображения страницы, язык консультации с адвокатом и язык, на котором Вы пишете, — три разные вещи.',
          ],
          items: [
            'Язык страницы: эти сведения написаны на русском языке.',
            'Язык консультации: консультация проводится на английском, китайском (中文), японском и корейском языках.',
            'Язык Вашего письма: Вы можете написать краткое изложение на своём языке; исходный текст сохраняется без изменений.',
          ],
        },
        {
          heading: 'Если Вы не можете пользоваться ни одним из четырёх языков консультации',
          paragraphs: [
            'В контактной форме Вы можете выбрать «Способ связи должен быть подтверждён». Мы отвечаем, чтобы рассмотреть возможный способ связи, если такой способ есть; услуга на другом языке не обеспечивается, и срок ответа не обещается.',
            'Это лишь шаг проверки, а не обещание. Мы не обещаем переводчика, не обещаем услугу на русском или ином языке вне четырёх названных и не обещаем, что примем каждое дело.',
          ],
        },
        {
          heading: 'Что должно быть в первом сообщении',
          paragraphs: [
            'Назовите, что произошло, какая помощь Вам нужна, какое отношение дело имеет к Тайваню, и срок, если Вы его знаете. Если Вы уже получили письмо суда или органа, укажите дату письма.',
            'На начальном этапе ещё не нужно отправлять номер паспорта, номер удостоверения, данные счёта, медицинскую карту или все доказательства. Дождитесь указаний адвоката и затем отправьте чувствительные документы безопасным путём.',
          ],
        },
        {
          heading: 'Что эта страница не обещает',
          paragraphs: [
            'Мы не обещаем срок ответа, не подтверждаем запись через эту страницу, не обещаем конкретного адвоката и не предоставляем переводчика. Устный переводчик и письменный перевод обращения — разные вещи: Ваше сообщение автоматически не переводится.',
            'Если Вы отправляете запрос, содержание сохраняется и ждёт рассмотрения. Если ответа нет, Вы можете снова написать на адрес электронной почты, указанный на странице контактов.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'ЧАСТЫЕ ВОПРОСЫ',
      title: 'Часто задаваемые вопросы',
      description:
        'Пояснения о сфере работы, подготовке, языках, стоимости и о значении отправленного запроса.',
      intro:
        'Ответы ниже даны на уровне общих сведений. Ответ по Вашему делу возможен лишь после того, как адвокат рассмотрит документы.',
      sections: [
        {
          heading: 'Как пользоваться этим разделом',
          paragraphs: [
            'Если Вы не находите ответа для Вашей ситуации, ответ обычно зависит от особых фактов. Тогда запишите эти факты в краткое изложение, вместо того чтобы выводить их самостоятельно с этой страницы.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Какие дела ведёт фирма?',
          answer:
            'Мы ведём шесть групп: инвестиции и учреждение компании на Тайване, гражданские дела и возмещение вреда, брак, семья и наследство, трудовые споры, уголовные дела и интеллектуальную собственность. Принимается ли дело, решается после рассмотрения содержания.',
        },
        {
          question: 'Что подготовить до обращения?',
          answer:
            'Подготовьте краткое изложение хода событий, Вашего запроса, связи с Тайванем и срока, если он есть. Если уже есть письмо суда или органа, назовите дату. На этой стадии ещё не нужно отправлять документы, удостоверяющие личность, или все доказательства.',
        },
        {
          question: 'Возможна ли консультация на русском языке?',
          answer:
            'Нет. Эти сведения написаны на русском языке, но консультация с адвокатом проводится только на английском, китайском (中文), японском и корейском языках. Мы также не обещаем переводчика. Устный переводчик и письменный перевод обращения — разные вещи: исходный текст, который Вы пишете, сохраняется без изменений и автоматически не переводится.',
        },
        {
          question: 'Что, если я не могу пользоваться ни одним из четырёх языков?',
          answer:
            'При отправке запроса выберите «Способ связи должен быть подтверждён». Мы отвечаем, чтобы рассмотреть способ связи, но услуга на другом языке не обеспечивается. Это шаг проверки, а не обещание, что мы можем работать на другом языке.',
        },
        {
          question: 'Как обрабатывается мой русский текст?',
          answer:
            'Исходный текст, который Вы пишете, сохраняется без изменений и автоматически не переводится. При необходимости язык дальнейшего общения подтверждается вместе с Вами.',
        },
        {
          question: 'Состоялась ли консультация, если запрос уже отправлен?',
          answer:
            'Нет. Отправленный запрос ожидает рассмотрения адвокатом. Это не юридическая консультация, не подтверждённая запись, и отправка сама по себе не создаёт отношений между адвокатом и доверителем.',
        },
        {
          question: 'Как рассчитывается стоимость?',
          answer:
            'Сначала определяется объём работы, затем размер и способ расчёта стоимости подтверждаются с Вами до начала работы. Эта страница не называет цифр и не говорит, что первая беседа проводится без оплаты.',
        },
        {
          question: 'Что, если мой вопрос очень срочный?',
          answer:
            'Назовите срок или дату на официальном письме в начале краткого изложения, чтобы эти даты были видны при рассмотрении. У этой страницы нет канала для неотложных случаев, и срок ответа не обеспечивается; если Ваш вопрос не может ждать, Вам следует параллельно искать другие пути по месту нахождения.',
        },
      ],
    },
    privacy: {
      eyebrow: 'КОНФИДЕНЦИАЛЬНОСТЬ',
      title: 'Данные, собираемые через контактную форму',
      description:
        'Что собирает контактная форма в этом русском разделе, как обрабатывается исходный текст и как связаться с нами по поводу Ваших данных.',
      intro:
        'Этот раздел касается только контактной формы на этих информационных страницах. Он описывает обращение с данными, а не техническую абсолютную защиту.',
      sections: [
        {
          heading: 'Какие данные собираются',
          paragraphs: [
            'Когда Вы отправляете запрос через форму в этом разделе, фиксируются следующие сведения:',
          ],
          items: [
            'Указанное Вами имя',
            'Адрес электронной почты для ответа',
            'Язык отображения страницы в момент отправки',
            'Язык, на котором Вы писали',
            'Желаемый Вами язык консультации',
            'Исходный текст, который Вы написали',
            'Ваше согласие на отправку запроса',
            'Номер обращения, чтобы найти запрос снова',
          ],
        },
        {
          heading: 'Исходный текст сохраняется без изменений',
          paragraphs: [
            'Ваш текст сохраняется точно так, как Вы его написали, и автоматически не переводится. Если для обработки нужен перевод, это отдельно обсуждается с Вами.',
            'Поскольку исходный текст сохраняется, на первом этапе не пишите то, что ещё не нужно: номер паспорта, номер удостоверения или данные счёта.',
          ],
        },
        {
          heading: 'Место хранения и доступ',
          paragraphs: [
            'Отправленные Вами данные хранятся в месте, недоступном публично. Только уполномоченные лица в фирме могут получать к нему доступ для обработки запроса.',
            'Эта страница не даёт абсолютного обещания безопасности. Ни один путь передачи и ни одно место хранения не являются полностью безопасными; поэтому чувствительные документы следует отправлять только после особого указания адвоката.',
          ],
        },
        {
          heading: 'Цель использования',
          paragraphs: [
            'Отправленные данные служат рассмотрению запроса, ответу Вам, выяснению способа связи и обработке, если работа будет начата.',
            'Данные не используются для маркетинга без отдельного согласия.',
          ],
        },
        {
          heading: 'Уведомление и номер обращения',
          paragraphs: [
            'Если запрос успешно отправлен, система уведомляет фирму. Если это уведомление ещё не подтверждено, Ваш текст остаётся сохранённым и не теряется.',
            'Номер обращения служит тому, чтобы найти Ваш запрос в наших записях. Он показывается после сохранения; Вы можете назвать его при повторном обращении.',
          ],
        },
        {
          heading: 'Ваши права и способ связи',
          paragraphs: [
            'Вы можете запросить сведения, исправление или удаление Ваших данных либо отозвать согласие через адрес электронной почты, указанный на странице контактов. Если есть законная или процессуальная обязанность хранения, мы объясним ограничение.',
            'Эта страница не называет фиксированный срок хранения, потому что фактическая длительность зависит от того, продолжается ли дело, и от связанных обязанностей. Если Вы хотите более раннее удаление, сообщите это при обращении.',
          ],
        },
        {
          heading: 'Место хранения и поставщики услуг',
          paragraphs: [
            'Этот сайт размещён у Vercel, и отправленные Вами данные хранятся в закрытом облачном хранилище этой службы. Письма отправляются через почтовую службу, которой пользуется фирма.',
            'Серверы отдельных поставщиков могут находиться за пределами Тайваня, поэтому Ваши данные могут там храниться и обрабатываться. Когда цель хранения достигнута, данные удаляются без промедления; данные, которые по действующим нормам должны храниться, остаются на этот срок. Запросы о персональных данных принимает wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ',
      title: 'Объём и границы сведений на этой странице',
      description:
        'Общий характер сведений, правовая сфера действия и условия возникновения отношений между адвокатом и доверителем.',
      intro:
        'Этот раздел разъясняет, что эти русские информационные страницы могут и не могут сделать для Вас.',
      sections: [
        {
          heading: 'Только общие сведения',
          paragraphs: [
            'Содержание этих страниц написано как общая информация. Это не юридическая консультация по Вашему делу и не заменяет проверку Ваших собственных документов.',
            'Исход дела зависит от фактов, применимых норм и момента времени; два внешне сходных положения могут завершиться по-разному.',
          ],
        },
        {
          heading: 'Правовая сфера действия',
          paragraphs: [
            'Фирма ведёт дела по праву Тайваня, и эта страница говорит только о работе в этих рамках.',
            'Содержание не является консультацией по праву иной правовой системы, кроме Тайваня, включая право места Вашего проживания. Если часть Вашего дела затрагивает иную правовую систему, мы выясним с Вами, какой квалифицированный специалист нужен для этой части.',
          ],
        },
        {
          heading: 'Отношения между адвокатом и доверителем не возникают сами собой',
          paragraphs: [
            'Чтение этой страницы, отправка формы или письма сами по себе не создают отношений между адвокатом и доверителем.',
            'Эти отношения возникают лишь после того, как дело рассмотрено и обе стороны подтвердили принятие работы.',
          ],
        },
        {
          heading: 'Нет обещания результата',
          paragraphs: [
            'Никакая часть этой страницы не является обещанием результата дела, удовлетворения заявления или статуса пребывания и работы.',
            'Внешние ссылки служат ориентиром; мы не обещаем ни правильность, ни актуальность содержания третьих лиц.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'МАТЕРИАЛЫ',
      title: 'Материалы о праве Тайваня',
      description:
        'Русские материалы по частым вопросам права Тайваня. Содержание — общая информация на момент публикации, а не юридическая консультация по Вашему делу.',
      intro:
        'Фирма публикует материалы по частым вопросам права Тайваня. Материалы, имеющиеся на русском языке, находятся на этой странице; рядом есть четыре ссылки, каждая из которых открывает список материалов языка оригинала.',
      sections: [
        {
          heading: 'Четыре списка по языкам',
          paragraphs: [
            'В этом разделе четыре ссылки: список материалов на корейском, китайском, английском и японском языках. Каждая ссылка называет язык списка, чтобы Вы заранее знали, на каком языке откроется содержание.',
            'Эти четыре списка — списки по языку оригинала материалов, а не списки переводов. Материалы, имеющиеся на русском языке, приведены отдельно на этой странице.',
          ],
        },
        {
          heading: 'Куда ведут ссылки',
          paragraphs: [
            'Если Вы выбираете одну из четырёх ссылок, открывается список материалов этого языка. Из списка Вы сами выбираете текст; всё содержание появляется на языке оригинала материала.',
            'Эта страница не излагает содержание материалов и не обещает, что тема есть на всех четырёх языках. Каждый список содержит только тексты, опубликованные на этом языке.',
          ],
        },
        {
          heading: 'Насколько материал может служить ориентиром',
          paragraphs: [
            'Материалы — общие сведения на момент публикации. Нормы и их применение могут измениться, и материал не содержит всех обстоятельств Вашего дела.',
            'Поэтому не опирайтесь на материал как на основание действий в реальном деле. Используйте его для обзора и отдельно обсудите Ваши документы с адвокатом; эта страница не является шагом консультации.',
          ],
        },
      ],
    },
  },
};

// SCAFFOLD(cs) locale hr
export const croatianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Čeština',
  nav: {
    home: 'Úvod',
    services: 'Služby',
    about: 'Kancelář',
    lawyers: 'Advokáti',
    pricing: 'Náklady',
    contact: 'Kontakt',
    faq: 'Otázky',
    privacy: 'Soukromí',
    disclaimer: 'Upozornění',
    columns: 'Články',
  },
  contactCta: 'Odeslat žádost o posouzení',
  footerNotice:
    'Tato česká stránka obsahuje pouze obecné informace o práci kanceláře podle tchajwanského práva. Není právní radou k jednotlivému případu a samotné odeslání zprávy nezakládá vztah mezi advokátkou nebo advokátem a klientem.',
  skipLink: 'Přeskočit navigaci a přejít k obsahu',
  menuLabel: 'Přehled stránek',
  languageLabel: 'Jazyk zobrazení',
  mega: {
    services: {
      description: 'Kancelář se zabývá hlavními agendami tchajwanského práva.',
      viewAllLabel: 'Zobrazit vše',
    },
    columns: {
      description: 'Články k častým otázkám tchajwanského práva.',
      viewAllLabel: 'Zobrazit vše',
    },
    lawyers: {
      description: 'Představení advokátek a advokátů a způsobů kontaktu.',
      viewAllLabel: 'Zobrazit vše',
    },
    pricing: {
      description: 'Tato stránka vysvětluje rozsah práce a způsob ujasnění nákladů.',
      viewAllLabel: 'Zobrazit vše',
    },
    faq: {
      description: 'Časté otázky k práci kanceláře na Tchaj-wanu.',
      viewAllLabel: 'Zobrazit vše',
    },
  },
  notFoundTitle: 'Stránka nenalezena',
  notFoundText:
    'Hledaná stránka neexistuje nebo byla přesunuta. Můžete se vrátit na českou úvodní stránku a prohlédnout si dostupné informace.',
  backHomeLabel: 'Na úvodní stránku',
  readSourceLabel: 'Otevřít seznam článků v původním jazyce',
  home: {
    heroScrollLabel: 'Posunout dolů',
    heroColumnsCtaLabel: 'Zobrazit články',
    servicesDetailLabel: 'Zobrazit podrobnosti',
    servicesAssistanceBefore: 'Není-li zřejmé, do které agendy Vaše věc patří, stránka ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter: ' vysvětluje, jak sestavit shrnutí, které advokátka nebo advokát posoudí.',
    columnsViewAllLabel: 'Zobrazit všechny články',
    columnsReadMoreLabel: 'Číst dál',
    columnsReviewLabel: 'Posoudila advokátka Wei Tseng',
    columnsOriginalLanguageBadge: 'Původní jazyk',
    columnsOriginalLanguageNote:
      'Následující články zatím nejsou k dispozici v češtině. Seznam zůstává v původním jazyce a otevře příslušnou jazykovou stránku; obsah se automaticky nepřekládá.',
    imageBandAlt: 'Tradiční tchajwanský dvorec sanheyuan (三合院) a moderní pavilon za denního světla',
    videoPauseLabel: 'Pozastavit video',
    videoPlayLabel: 'Přehrát video',
    videoReplayLabel: 'Přehrát video znovu',
  },
  pages: {
    home: {
      eyebrow: 'INFORMACE',
      title: 'Právní služby na Tchaj-wanu — informace v češtině',
      description:
        'Obecné vysvětlení v češtině o rozsahu práce Hovering International Law Firm na Tchaj-wanu, o jazycích konzultace a o prvním kontaktu.',
      intro:
        'Hovering International Law Firm zastupuje zahraniční klienty, včetně osob s vazbou na Tchaj-wan, ve věcech tchajwanského práva: investice a zakládání společností, občanskoprávní spory, manželství, rodina a dědictví, pracovní právo, trestní věci a duševní vlastnictví. Tato česká část Vám pomůže rozpoznat, která práce spadá do našeho rozsahu, co si připravit a jak nás oslovit. Jde o obecné informace, nikoli o právní radu k Vašemu případu.',
      sections: [
        {
          heading: 'Čím se zabýváme',
          paragraphs: [
            'Hovering International Law Firm je advokátní kancelář se sídlem na Tchaj-wanu. Pracuje podle tchajwanského práva a má pobočky v Tchaj-peji (臺北), Kao-siungu (高雄), Tchaj-čungu (臺中) a Pching-tungu (屏東). Radíme podnikům, vedeme soudní řízení a zastupujeme zahraniční klienty v krocích, které je na Tchaj-wanu třeba učinit.',
            'Celý zdejší obsah je obecný. Výsledek věci závisí na skutkovém stavu, na použitelných předpisech a na okamžiku. Tyto informace nenahrazují konzultaci s advokátkou nebo advokátem nad Vašimi dokumenty.',
          ],
        },
        {
          heading: 'Jazyk stránky a jazyk konzultace nejsou totéž',
          paragraphs: [
            'Tato stránka je psána česky, ale konzultace s advokátkou nebo advokátem probíhá pouze ve čtyřech jazycích: anglicky, čínsky (中文), japonsky a korejsky. Čtení informací v češtině neznamená, že konzultace s advokátkou nebo advokátem proběhne česky.',
            'Neslibujeme tlumočníka, lhůtu k odpovědi ani schůzku prostřednictvím této stránky. Pokud neovládáte žádný ze čtyř jazyků konzultace, stránka „Kontakt“ vysvětluje, jak posuzujeme způsob komunikace.',
          ],
        },
        {
          heading: 'Agendy kanceláře',
          paragraphs: [
            'Rozsah práce zahrnuje následujících šest agend. Stránka „Služby“ popisuje každou z nich přesněji a uvádí, co se neslibuje.',
          ],
          items: [
            'Investice a zakládání společností na Tchaj-wanu',
            'Občanskoprávní spory a náhrada škody',
            'Manželství, rodina a dědictví',
            'Pracovněprávní spory',
            'Trestní věci',
            'Duševní vlastnictví: ochranné známky, patenty a autorské právo',
          ],
        },
        {
          heading: 'Kde začít',
          paragraphs: [
            'Přečtěte si stránku „Služby“ a ověřte, zda Vaše věc spadá do našeho rozsahu, poté „Náklady“ a „Kontakt“, abyste věděli, jak se stanoví rozsah a jak se náklady potvrzují před zahájením práce.',
            'Při odeslání zprávy můžete shrnutí napsat ve svém jazyce. Původní text se uchová přesně tak, jak jste jej napsali, a automaticky se nepřekládá. Odeslaná zpráva je žádostí čekající na posouzení: není to ještě porada ani potvrzená schůzka.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'SLUŽBY',
      title: 'V čem klienty zastupujeme',
      description:
        'Šest agend, které kancelář na Tchaj-wanu vede, a hranice, které je užitečné znát nejdříve.',
      intro:
        'Níže jsou agendy, které skutečně vedeme, a otázky, jež se v počáteční fázi kladou nejčastěji. Výklad Vám pomůže posoudit, zda Vaše věc spadá do našeho rozsahu; je obecný a není právním rozborem jednotlivého spisu.',
      sections: [
        {
          heading: 'Investice a zakládání společností na Tchaj-wanu',
          paragraphs: [
            'Zastupujeme zahraniční investory a podniky při založení nebo vedení společnosti na Tchaj-wanu: volba právní formy, příprava a podání dokumentů, vklad kapitálu, bankovní otázky, posouzení sídla a odvětvové požadavky. Podporujeme také účetnictví a daně, které ze založení a z provozu na Tchaj-wanu vyplývají.',
            'Postup a lhůty se liší podle formy, investora, odvětví, banky a podle již dostupných dokumentů. Založení společnosti samo o sobě nevede k pobytovému oprávnění (居留) ani k pracovnímu povolení (工作許可): jde o samostatná řízení posuzovaná podle situace konkrétní osoby.',
          ],
        },
        {
          heading: 'Občanskoprávní spory a náhrada škody',
          paragraphs: [
            'Tato agenda zahrnuje spory ze smluv, náhradu škody z protiprávního jednání a spotřebitelské spory. Práce zpravidla začíná časovou osou, posouzením dokumentů a existujících důkazů a teprve poté následují další kroky.',
            'Průběh určují lhůty, včetně promlčecích, a úplnost důkazů. Uveďte proto známá data co nejdříve. Uschovejte smlouvy, zprávy, doklady o platbě nebo fotografie stavu na místě a zmiňte je v první zprávě.',
          ],
        },
        {
          heading: 'Manželství, rodina a dědictví',
          paragraphs: [
            'Vedeme rozvod (離婚), vypořádání majetku, výkon a převzetí práv a povinností k nezletilým dětem (未成年子女權利義務之行使或負擔), styk s dítětem (會面交往) a dědictví (繼承), a to i tehdy, nacházejí-li se strany nebo majetek v různých státech. Přeshraniční rodinné věci často vyžadují další posouzení matričních záznamů (戶籍), formy listin a jejich průkaznosti na Tchaj-wanu.',
            'Protože rodinné věci s sebou často nesou lhůty a souběžná řízení, mělo by první shrnutí uvést vztah mezi stranami, současné bydliště a již probíhající řízení.',
          ],
        },
        {
          heading: 'Pracovněprávní spory',
          paragraphs: [
            'Tato agenda zahrnuje skončení pracovního poměru, odstupné podle tchajwanského práva (資遣費; nelze je ztotožňovat s obdobnými instituty jiných států), odměnu a spory z pracovní smlouvy (勞動契約), a to jak na straně zaměstnance, tak na straně zaměstnavatele. Při posouzení odlišujeme důvod skončení od otázek výpovědní doby, výplaty a lhůt.',
            'Rozhodujícími dokumenty bývají pracovní smlouva, vnitřní pracovní řád (工作規則), výplatní pásky a korespondence stran. Máte-li je stále k dispozici, zmiňte to ve shrnutí.',
          ],
        },
        {
          heading: 'Trestní věci',
          paragraphs: [
            'Zastupujeme v přípravném řízení i před soudem podezřelé a obviněné i poškozené a posuzujeme trestní rizika podnikatelské činnosti.',
            'Trestní věci mívají krátké lhůty a pevně stanovené fáze. Obdrželi-li jste již písemnost orgánu činného v trestním řízení nebo soudu, uveďte datum na písemnosti včas, aby byl obsah posouzen ve správném pořadí.',
          ],
        },
        {
          heading: 'Duševní vlastnictví',
          paragraphs: [
            'Podporujeme zápis ochranných známek (商標) a patentů (專利), autorské právo a spory o tato práva na Tchaj-wanu.',
            'V této agendě rozhoduje pořadí kroků: rozsah ochrany, okamžik podání přihlášky a skutečné užívání ovlivňují volbu. Podání přihlášky samo o sobě neznamená, že jí bude vyhověno.',
          ],
        },
        {
          heading: 'Rozsah a jeho potvrzení',
          paragraphs: [
            'Kancelář pracuje podle tchajwanského práva a vede věci z výše uvedených agend. Rozsah každé věci se potvrzuje zvlášť poté, co advokátka nebo advokát posoudí Vaši zprávu.',
            'Pobytový status, pracovní povolení a obdobné otázky se posuzují podle dokumentů a podle situace konkrétní osoby, nikoli podle státní příslušnosti. Dotýká-li se část Vaší věci těchto bodů, uveďte to při kontaktu. Tato stránka neslibuje výsledek ani lhůtu k odpovědi.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'KANCELÁŘ',
      title: 'O Hovering International Law Firm',
      description:
        'Základní údaje o této tchajwanské advokátní kanceláři, o jejích pobočkách a o práci se zahraničními stranami.',
      intro:
        'Hovering International Law Firm je advokátní kancelář na Tchaj-wanu. Advokátky a advokáti pracují od poradenství podnikům až po soudní řízení. Tato část popisuje vznik kanceláře, sídla a práci se zahraničními stranami.',
      sections: [
        {
          heading: 'Založení a struktura',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) byla založena v roce 2016 advokátkami a advokáty, kteří studovali na National Taiwan University (國立臺灣大學). Čínský název 昊鼎 spojuje znak 昊 („širé nebe“) se znakem 鼎 („pevný základ“) a vystihuje zaměření kanceláře od jejího založení.',
            'Máme pobočky v Tchaj-peji (臺北), Kao-siungu (高雄), Tchaj-čungu (臺中) a Pching-tungu (屏東). Pobočka v Kao-siungu se soustředí na vedení podniků a vede občanskoprávní, trestní a správní spory. Pobočka v Tchaj-čungu vede stavební věci, duševní vlastnictví a věci s vazbou na Koreu a Japonsko. Pobočka v Pching-tungu byla otevřena v roce 2017 pro místní potřebu.',
            'Vedle advokátní práce působí od roku 2020 také Hovering Accounting Office, která nabízí účetnictví a daňové plánování podnikatelům a soukromým osobám s majetkem.',
          ],
        },
        {
          heading: 'Práce se zahraničními stranami',
          paragraphs: [
            'Přeshraniční práce zahrnuje zakládání společností, víza, přihlášky ochranných známek a patentů, posouzení právního rizika a daňové poradenství podnikům. Pobočka v Tchaj-čungu vede zejména stavební věci, duševní vlastnictví a věci s vazbou na Koreu a Japonsko. Advokátka Wei Tseng (曾雋崴) zastupuje klienty z Koreje, z Japonska a další mezinárodní klienty v uvedených agendách.',
            'Zda můžeme věc převzít, závisí na obsahu a na jazyku komunikace. Spadá-li Vaše věc do uvedených agend a lze-li ji projednat v některém ze čtyř jazyků konzultace, můžete zaslat shrnutí k posouzení.',
          ],
        },
        {
          heading: 'Když nás oslovíte',
          paragraphs: [
            'Po doručení Vašeho shrnutí posoudí advokátka nebo advokát obsah a poté hovoří o možném rozsahu práce, o dosud potřebných dokumentech a o dalších krocích. U daňových nebo účetních otázek může kancelář postupovat s účetním úsekem v jednom navazujícím postupu.',
            'Výsledek každé věci závisí na skutkovém stavu a na dostupných dokumentech; výsledek neslibujeme. Potřebujete-li závaznou odpověď pro svou situaci, musí být dokumenty projednány s advokátkou nebo advokátem v některém ze čtyř jazyků konzultace.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKÁTI',
      title: 'Mezinárodní tým Hovering',
      description: 'Profily advokátek a advokátů, provozního vedení a přidruženého účetnictví a auditu Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'NÁKLADY',
      title: 'Jak se stanoví rozsah práce a náklady',
      description:
        'Vysvětlení pořadí: nejprve rozsah práce, poté potvrzení nákladů, a proč tato stránka neobsahuje ceník.',
      intro:
        'Tato stránka vysvětluje, jak se náklady stanoví, nikoli jejich výši. Výše závisí na rozsahu práce v jednotlivé věci a má smysl teprve tehdy, je-li tento rozsah zřejmý.',
      sections: [
        {
          heading: 'Nejprve se stanoví rozsah práce',
          paragraphs: [
            'Věci téhož druhu mohou vyžadovat velmi rozdílné úsilí, podle počtu stran, dostupných dokumentů, lhůt, které je třeba dodržet, a podle toho, zda již bylo zahájeno řízení. Prvním krokem je proto vždy stanovit, co do práce patří a co nikoli.',
            'Shrnutí, které na začátku zašlete, je základem tohoto rozsahu. Čím jasněji popisuje průběh, Váš požadavek a lhůty, tím přesněji lze rozsah určit.',
          ],
        },
        {
          heading: 'Náklady se potvrzují před zahájením práce',
          paragraphs: [
            'Je-li rozsah práce zřejmý, výše a způsob výpočtu nákladů se s Vámi projedná a potvrdí dříve, než práce začne. Změní-li se rozsah v průběhu, musí být potvrzen znovu.',
            'Tato stránka není cenovou nabídkou a nezakládá povinnost k platbě.',
          ],
        },
        {
          heading: 'Porada může být úplatná',
          paragraphs: [
            'Porada s advokátkou nebo advokátem může být úplatnou službou. Tato stránka neříká, že první konzultace je bezplatná, a žádnou její část nelze v tomto smyslu vykládat.',
            'Je-li porada úplatná, sdělí se výše a způsob platby dříve, než se porada uskuteční.',
          ],
        },
        {
          heading: 'Proč tato stránka neuvádí sazby',
          paragraphs: [
            'Náklady závisejí na věci samé: na úsilí, počtu stran, dokumentech, lhůtách a na tom, zda již řízení probíhá. Číslo stanovené předem by náklady Vašeho spisu neukázalo. Proto nejprve stanovíme rozsah práce a náklady Vám sdělíme poté, dříve než práce začne.',
            'Vedle odměny mohou vzniknout soudní poplatky, náklady orgánů nebo třetích osob. Ty jsou od odměny oddělené a závisejí na příslušném řízení.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Jak kancelář oslovit',
      description:
        'Jazyk stránky, jazyky konzultace, postup pro případ, že neovládáte žádný ze čtyř jazyků, a co tato stránka neslibuje.',
      intro:
        'Než nám napíšete, rozlište následující tři body. Bývají směšovány, ale znamenají různé věci.',
      sections: [
        {
          heading: 'Tři věci, které je třeba držet odděleně',
          paragraphs: [
            'Jazyk zobrazení stránky, jazyk konzultace s advokátkou nebo advokátem a jazyk, v němž píšete, jsou tři různé věci.',
          ],
          items: [
            'Jazyk stránky: tyto informace jsou psány česky.',
            'Jazyk konzultace: porada probíhá pouze anglicky, čínsky (中文), japonsky a korejsky.',
            'Váš jazyk psaní: shrnutí můžete napsat ve svém jazyce; původní text se uchová beze změny.',
          ],
        },
        {
          heading: 'Pokud neovládáte žádný ze čtyř jazyků konzultace',
          paragraphs: [
            'V kontaktním formuláři můžete zvolit „Způsob komunikace je třeba potvrdit“. Odpovíme, abychom posoudili schůdný způsob komunikace, existuje-li takový; služba v jiném jazyce zaručena není a lhůta k odpovědi se neslibuje.',
            'Jde pouze o krok posouzení, nikoli o příslib. Neslibujeme tlumočníka, službu v češtině ani v jiném jazyce mimo čtyři uvedené jazyky, ani to, že každou věc přijmeme.',
          ],
        },
        {
          heading: 'Co by měla obsahovat první zpráva',
          paragraphs: [
            'Uveďte, co se stalo, jakou pomoc potřebujete, jakou vazbu má věc na Tchaj-wan a lhůtu, znáte-li ji. Obdrželi-li jste již písemnost soudu nebo úřadu, uveďte datum na písemnosti.',
            'V počáteční fázi zatím nemusíte zasílat číslo pasu, číslo dokladu, údaje o účtu, zdravotní dokumentaci ani soubor důkazů. Vyčkejte pokynů advokátky nebo advokáta a citlivé dokumenty zašlete až poté bezpečnou cestou.',
          ],
        },
        {
          heading: 'Co tato stránka neslibuje',
          paragraphs: [
            'Neslibujeme lhůtu k odpovědi, nepotvrzujeme schůzku prostřednictvím této stránky, neslibujeme určitou advokátku ani určitého advokáta a neposkytujeme tlumočníka. Písemný překlad je něco jiného: Vaše zpráva se automaticky nepřekládá.',
            'Odešlete-li žádost, obsah se uchová a čeká na posouzení. Neobdržíte-li po nějaké době odpověď, můžete napsat znovu na e-mailovou adresu uvedenou na kontaktní stránce.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'OTÁZKY',
      title: 'Časté otázky',
      description:
        'Vysvětlení k rozsahu práce, přípravě, jazykům, nákladům a k tomu, co znamená odeslaná žádost.',
      intro:
        'Následující otázky jsou zodpovězeny na úrovni obecných informací. Odpověď pro Váš případ je možná teprve poté, co advokátka nebo advokát posoudí dokumenty.',
      sections: [
        {
          heading: 'Jak tuto část užívat',
          paragraphs: [
            'Nenajdete-li odpověď pro svou situaci, závisí odpověď zpravidla na zvláštních skutečnostech. Napište je proto do shrnutí, namísto abyste je dovozovali z této stránky.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Které věci kancelář vede?',
          answer:
            'Vedeme šest agend: investice a zakládání společností na Tchaj-wanu, občanskoprávní spory a náhradu škody, manželství, rodinu a dědictví, pracovněprávní spory, trestní věci a duševní vlastnictví. Zda bude věc přijata, se rozhodne po posouzení obsahu.',
        },
        {
          question: 'Co si připravit před kontaktem?',
          answer:
            'Připravte si krátké shrnutí průběhu, svého požadavku, vazby na Tchaj-wan a lhůty, existuje-li nějaká. Je-li již k dispozici písemnost soudu nebo úřadu, uveďte datum. V této fázi zatím nemusíte zasílat doklady totožnosti ani soubor důkazů.',
        },
        {
          question: 'Je možná porada v češtině?',
          answer:
            'Ne. Tyto informace jsou psány česky, ale porada s advokátkou nebo advokátem probíhá pouze anglicky, čínsky (中文), japonsky a korejsky. Neslibujeme ani tlumočníka. Písemný překlad je něco jiného: původní text, který napíšete, se uchová tak, jak je, a automaticky se nepřekládá.',
        },
        {
          question: 'Co dělat, nemohu-li užít žádný ze čtyř jazyků?',
          answer:
            'Při odeslání žádosti zvolte „Způsob komunikace je třeba potvrdit“. Odpovíme, abychom posoudili způsob komunikace, ale služba v jiném jazyce zaručena není. Jde o krok posouzení, nikoli o příslib, že můžeme pracovat v jiném jazyce.',
        },
        {
          question: 'Jak se nakládá s mým textem v češtině?',
          answer:
            'Původní text, který napíšete, se uchová tak, jak je, a automaticky se nepřekládá. Je-li to potřeba, jazyk další komunikace se s Vámi potvrdí.',
        },
        {
          question: 'Proběhla porada již tím, že je žádost odeslána?',
          answer:
            'Ne. Odeslaná žádost čeká na posouzení advokátkou nebo advokátem. Není to právní stanovisko, není to potvrzená schůzka a samotné odeslání nezakládá vztah mezi advokátkou nebo advokátem a klientem.',
        },
        {
          question: 'Jak se počítají náklady?',
          answer:
            'Nejprve se stanoví rozsah práce, poté se s Vámi potvrdí výše a způsob výpočtu nákladů, dříve než práce začne. Tato stránka neuvádí částky a neříká, že první konzultace je bezplatná.',
        },
        {
          question: 'Co dělat, je-li má věc velmi naléhavá?',
          answer:
            'Uveďte lhůtu nebo datum z úřední písemnosti hned na začátku shrnutí, aby byla tato data při posouzení vidět. Tato stránka nemá nouzový kanál a nezajišťuje lhůtu k odpovědi; nesnese-li Vaše věc odkladu, měli byste souběžně hledat další cesty ve svém místě.',
        },
      ],
    },
    privacy: {
      eyebrow: 'SOUKROMÍ',
      title: 'Údaje sbírané kontaktním formulářem',
      description:
        'Co sbírá kontaktní formulář v této české části, jak se nakládá s původním textem a jak nás oslovit ohledně Vašich údajů.',
      intro:
        'Tato část se týká pouze kontaktního formuláře na těchto informačních stránkách. Popisuje nakládání s údaji, nikoli technickou záruku.',
      sections: [
        {
          heading: 'Které údaje se sbírají',
          paragraphs: [
            'Odešlete-li žádost prostřednictvím formuláře v této části, zaznamenají se tyto údaje:',
          ],
          items: [
            'Jméno, které uvedete',
            'E-mailová adresa pro odpověď',
            'Jazyk zobrazení stránky v okamžiku odeslání',
            'Jazyk, v němž jste psali',
            'Jazyk konzultace, který si přejete',
            'Původní text, který jste napsali',
            'Váš souhlas s odesláním žádosti',
            'Číslo podání pro dohledání žádosti',
          ],
        },
        {
          heading: 'Původní text se uchová beze změny',
          paragraphs: [
            'Váš text se uchová přesně tak, jak jste jej napsali, a automaticky se nepřekládá. Je-li pro vyřízení potřebný překlad, projedná se to s Vámi zvlášť.',
            'Protože se původní text uchovává, nepište v počáteční fázi to, co zatím není potřebné, například číslo pasu, číslo dokladu nebo údaje o účtu.',
          ],
        },
        {
          heading: 'Místo uchování a přístup',
          paragraphs: [
            'Obsah Vašeho podání se uchovává na místě, které není veřejně přístupné. Přístup k němu mají pouze oprávněné osoby v kanceláři, a to za účelem vyřízení žádosti.',
            'Tato stránka nedává absolutní záruku bezpečnosti. Žádná cesta přenosu a žádné místo uchování není zcela bezpečné; citlivé dokumenty by proto měly být zasílány až po zvláštním pokynu advokátky nebo advokáta.',
          ],
        },
        {
          heading: 'Účel užití',
          paragraphs: [
            'Odeslané údaje slouží k posouzení žádosti, k odpovědi Vám, k ujasnění způsobu komunikace a k vyřízení, je-li práce převzata.',
            'Údaje se bez zvláštního souhlasu neužívají k marketingu.',
          ],
        },
        {
          heading: 'Oznámení a číslo podání',
          paragraphs: [
            'Je-li žádost úspěšně odeslána, systém uvědomí kancelář. Není-li toto oznámení zatím potvrzeno, Váš text zůstává uchován a neztrácí se.',
            'Číslo podání slouží k dohledání Vaší žádosti v našich záznamech. Zobrazí se po uložení; můžete je uvést při novém kontaktu.',
          ],
        },
        {
          heading: 'Vaše práva a cesta ke kontaktu',
          paragraphs: [
            'Můžete žádat o přístup ke svým údajům, o jejich opravu nebo výmaz, případně odvolat souhlas, a to prostřednictvím e-mailové adresy uvedené na kontaktní stránce. Existuje-li zákonná nebo procesní povinnost uchování, vysvětlíme omezení.',
            'Tato stránka neuvádí pevnou dobu uchování, protože skutečná doba závisí na dalším průběhu věci a na souvisejících povinnostech. Přejete-li si dřívější výmaz, sdělte to při kontaktu.',
          ],
        },
        {
          heading: 'Místo uchování a poskytovatelé',
          paragraphs: [
            'Tyto stránky jsou hostovány u společnosti Vercel a Vaše podání se uchovává v neveřejném objektovém úložišti této služby. E-maily se odesílají poštovní službou, kterou kancelář užívá.',
            'Servery jednotlivých poskytovatelů se mohou nacházet mimo Tchaj-wan, takže Vaše údaje tam mohou být uchovávány a zpracovávány. Je-li účel uchování naplněn, údaje se bez zbytečného odkladu vymažou; údaje, které je třeba uchovávat podle použitelných předpisů, zůstávají po tuto dobu. Žádosti o osobní údaje přijímá wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'UPOZORNĚNÍ',
      title: 'Rozsah a hranice informací na této stránce',
      description:
        'Obecná povaha informací, právní rámec a předpoklady vzniku vztahu mezi advokátkou nebo advokátem a klientem.',
      intro:
        'Tato část objasňuje, co pro Vás tyto české informační stránky mohou udělat a co nikoli.',
      sections: [
        {
          heading: 'Pouze obecné informace',
          paragraphs: [
            'Obsah těchto stránek je psán jako obecná informace. Není právní radou k Vašemu případu a nenahrazuje posouzení Vašich dokumentů.',
            'Výsledek věci závisí na skutkovém stavu, na použitelných předpisech a na okamžiku; dvě zdánlivě podobné situace mohou skončit různě.',
          ],
        },
        {
          heading: 'Právní rámec',
          paragraphs: [
            'Kancelář působí podle tchajwanského práva a tato stránka hovoří pouze o práci v tomto rámci.',
            'Obsah není poradenstvím podle práva jiného řádu než tchajwanského, včetně práva místa Vašeho pobytu. Týká-li se část Vaší věci jiného právního řádu, ujasníme s Vámi, jaká kvalifikovaná osoba je pro tuto část potřebná.',
          ],
        },
        {
          heading: 'Vztah mezi advokátkou nebo advokátem a klientem nevzniká sám od sebe',
          paragraphs: [
            'Přečtení této stránky, odeslání formuláře nebo e-mailu samo o sobě nezakládá vztah mezi advokátkou nebo advokátem a klientem.',
            'Tento vztah vzniká teprve poté, co byla věc posouzena a obě strany potvrdily převzetí práce.',
          ],
        },
        {
          heading: 'Žádný příslib výsledku',
          paragraphs: [
            'Žádná část této stránky není příslibem ohledně výsledku věci, vyhovění přihlášce nebo žádosti či ohledně pobytového a pracovního statusu.',
            'Vnější odkazy slouží k orientaci; neslibujeme správnost ani aktuálnost obsahu třetích osob.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ČLÁNKY',
      title: 'Články o tchajwanském právu',
      description:
        'Články v češtině k častým otázkám tchajwanského práva. Obsah je obecnou informací k okamžiku zveřejnění, nikoli právní radou k Vašemu případu.',
      intro:
        'Kancelář zveřejňuje články k častým otázkám tchajwanského práva. Články dostupné v češtině jsou na této stránce; vedle nich jsou čtyři odkazy, z nichž každý otevře seznam článků v jednom původním jazyce.',
      sections: [
        {
          heading: 'Čtyři seznamy podle jazyka',
          paragraphs: [
            'Tato část obsahuje čtyři odkazy: seznam článků v korejštině, v čínštině, v angličtině a v japonštině. Každý odkaz uvádí jazyk seznamu, takže předem víte, v jakém jazyce se obsah otevře.',
            'Tyto čtyři seznamy jsou seznamy podle původního jazyka článků, nikoli seznamy překladů. Články dostupné v češtině jsou zvlášť na této stránce.',
          ],
        },
        {
          heading: 'Kam odkazy vedou',
          paragraphs: [
            'Zvolíte-li jeden ze čtyř odkazů, otevře se seznam článků v daném jazyce. Ze seznamu si text vyberete sami; celý obsah se zobrazí v původním jazyce článku.',
            'Tato stránka obsah článků neshrnuje a nezaručuje, že určité téma je k dispozici ve všech čtyřech jazycích. Každý seznam obsahuje pouze texty zveřejněné v daném jazyce.',
          ],
        },
        {
          heading: 'Nakolik může článek sloužit k orientaci',
          paragraphs: [
            'Články jsou obecnými informacemi k okamžiku zveřejnění. Předpisy a jejich používání se mohou změnit a článek neobsahuje všechny okolnosti Vašeho případu.',
            'Nezakládejte proto postup ve skutečné věci pouze na článku. Užijte jej k přehledu a své dokumenty projednejte zvlášť s advokátkou nebo advokátem; tato stránka není krokem porady.',
          ],
        },
      ],
    },
  },
};

// SCAFFOLD(cs) locale sr
export const serbianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Čeština',
  nav: {
    home: 'Úvod',
    services: 'Služby',
    about: 'Kancelář',
    lawyers: 'Advokáti',
    pricing: 'Náklady',
    contact: 'Kontakt',
    faq: 'Otázky',
    privacy: 'Soukromí',
    disclaimer: 'Upozornění',
    columns: 'Články',
  },
  contactCta: 'Odeslat žádost o posouzení',
  footerNotice:
    'Tato česká stránka obsahuje pouze obecné informace o práci kanceláře podle tchajwanského práva. Není právní radou k jednotlivému případu a samotné odeslání zprávy nezakládá vztah mezi advokátkou nebo advokátem a klientem.',
  skipLink: 'Přeskočit navigaci a přejít k obsahu',
  menuLabel: 'Přehled stránek',
  languageLabel: 'Jazyk zobrazení',
  mega: {
    services: {
      description: 'Kancelář se zabývá hlavními agendami tchajwanského práva.',
      viewAllLabel: 'Zobrazit vše',
    },
    columns: {
      description: 'Články k častým otázkám tchajwanského práva.',
      viewAllLabel: 'Zobrazit vše',
    },
    lawyers: {
      description: 'Představení advokátek a advokátů a způsobů kontaktu.',
      viewAllLabel: 'Zobrazit vše',
    },
    pricing: {
      description: 'Tato stránka vysvětluje rozsah práce a způsob ujasnění nákladů.',
      viewAllLabel: 'Zobrazit vše',
    },
    faq: {
      description: 'Časté otázky k práci kanceláře na Tchaj-wanu.',
      viewAllLabel: 'Zobrazit vše',
    },
  },
  notFoundTitle: 'Stránka nenalezena',
  notFoundText:
    'Hledaná stránka neexistuje nebo byla přesunuta. Můžete se vrátit na českou úvodní stránku a prohlédnout si dostupné informace.',
  backHomeLabel: 'Na úvodní stránku',
  readSourceLabel: 'Otevřít seznam článků v původním jazyce',
  home: {
    heroScrollLabel: 'Posunout dolů',
    heroColumnsCtaLabel: 'Zobrazit články',
    servicesDetailLabel: 'Zobrazit podrobnosti',
    servicesAssistanceBefore: 'Není-li zřejmé, do které agendy Vaše věc patří, stránka ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter: ' vysvětluje, jak sestavit shrnutí, které advokátka nebo advokát posoudí.',
    columnsViewAllLabel: 'Zobrazit všechny články',
    columnsReadMoreLabel: 'Číst dál',
    columnsReviewLabel: 'Posoudila advokátka Wei Tseng',
    columnsOriginalLanguageBadge: 'Původní jazyk',
    columnsOriginalLanguageNote:
      'Následující články zatím nejsou k dispozici v češtině. Seznam zůstává v původním jazyce a otevře příslušnou jazykovou stránku; obsah se automaticky nepřekládá.',
    imageBandAlt: 'Tradiční tchajwanský dvorec sanheyuan (三合院) a moderní pavilon za denního světla',
    videoPauseLabel: 'Pozastavit video',
    videoPlayLabel: 'Přehrát video',
    videoReplayLabel: 'Přehrát video znovu',
  },
  pages: {
    home: {
      eyebrow: 'INFORMACE',
      title: 'Právní služby na Tchaj-wanu — informace v češtině',
      description:
        'Obecné vysvětlení v češtině o rozsahu práce Hovering International Law Firm na Tchaj-wanu, o jazycích konzultace a o prvním kontaktu.',
      intro:
        'Hovering International Law Firm zastupuje zahraniční klienty, včetně osob s vazbou na Tchaj-wan, ve věcech tchajwanského práva: investice a zakládání společností, občanskoprávní spory, manželství, rodina a dědictví, pracovní právo, trestní věci a duševní vlastnictví. Tato česká část Vám pomůže rozpoznat, která práce spadá do našeho rozsahu, co si připravit a jak nás oslovit. Jde o obecné informace, nikoli o právní radu k Vašemu případu.',
      sections: [
        {
          heading: 'Čím se zabýváme',
          paragraphs: [
            'Hovering International Law Firm je advokátní kancelář se sídlem na Tchaj-wanu. Pracuje podle tchajwanského práva a má pobočky v Tchaj-peji (臺北), Kao-siungu (高雄), Tchaj-čungu (臺中) a Pching-tungu (屏東). Radíme podnikům, vedeme soudní řízení a zastupujeme zahraniční klienty v krocích, které je na Tchaj-wanu třeba učinit.',
            'Celý zdejší obsah je obecný. Výsledek věci závisí na skutkovém stavu, na použitelných předpisech a na okamžiku. Tyto informace nenahrazují konzultaci s advokátkou nebo advokátem nad Vašimi dokumenty.',
          ],
        },
        {
          heading: 'Jazyk stránky a jazyk konzultace nejsou totéž',
          paragraphs: [
            'Tato stránka je psána česky, ale konzultace s advokátkou nebo advokátem probíhá pouze ve čtyřech jazycích: anglicky, čínsky (中文), japonsky a korejsky. Čtení informací v češtině neznamená, že konzultace s advokátkou nebo advokátem proběhne česky.',
            'Neslibujeme tlumočníka, lhůtu k odpovědi ani schůzku prostřednictvím této stránky. Pokud neovládáte žádný ze čtyř jazyků konzultace, stránka „Kontakt“ vysvětluje, jak posuzujeme způsob komunikace.',
          ],
        },
        {
          heading: 'Agendy kanceláře',
          paragraphs: [
            'Rozsah práce zahrnuje následujících šest agend. Stránka „Služby“ popisuje každou z nich přesněji a uvádí, co se neslibuje.',
          ],
          items: [
            'Investice a zakládání společností na Tchaj-wanu',
            'Občanskoprávní spory a náhrada škody',
            'Manželství, rodina a dědictví',
            'Pracovněprávní spory',
            'Trestní věci',
            'Duševní vlastnictví: ochranné známky, patenty a autorské právo',
          ],
        },
        {
          heading: 'Kde začít',
          paragraphs: [
            'Přečtěte si stránku „Služby“ a ověřte, zda Vaše věc spadá do našeho rozsahu, poté „Náklady“ a „Kontakt“, abyste věděli, jak se stanoví rozsah a jak se náklady potvrzují před zahájením práce.',
            'Při odeslání zprávy můžete shrnutí napsat ve svém jazyce. Původní text se uchová přesně tak, jak jste jej napsali, a automaticky se nepřekládá. Odeslaná zpráva je žádostí čekající na posouzení: není to ještě porada ani potvrzená schůzka.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'SLUŽBY',
      title: 'V čem klienty zastupujeme',
      description:
        'Šest agend, které kancelář na Tchaj-wanu vede, a hranice, které je užitečné znát nejdříve.',
      intro:
        'Níže jsou agendy, které skutečně vedeme, a otázky, jež se v počáteční fázi kladou nejčastěji. Výklad Vám pomůže posoudit, zda Vaše věc spadá do našeho rozsahu; je obecný a není právním rozborem jednotlivého spisu.',
      sections: [
        {
          heading: 'Investice a zakládání společností na Tchaj-wanu',
          paragraphs: [
            'Zastupujeme zahraniční investory a podniky při založení nebo vedení společnosti na Tchaj-wanu: volba právní formy, příprava a podání dokumentů, vklad kapitálu, bankovní otázky, posouzení sídla a odvětvové požadavky. Podporujeme také účetnictví a daně, které ze založení a z provozu na Tchaj-wanu vyplývají.',
            'Postup a lhůty se liší podle formy, investora, odvětví, banky a podle již dostupných dokumentů. Založení společnosti samo o sobě nevede k pobytovému oprávnění (居留) ani k pracovnímu povolení (工作許可): jde o samostatná řízení posuzovaná podle situace konkrétní osoby.',
          ],
        },
        {
          heading: 'Občanskoprávní spory a náhrada škody',
          paragraphs: [
            'Tato agenda zahrnuje spory ze smluv, náhradu škody z protiprávního jednání a spotřebitelské spory. Práce zpravidla začíná časovou osou, posouzením dokumentů a existujících důkazů a teprve poté následují další kroky.',
            'Průběh určují lhůty, včetně promlčecích, a úplnost důkazů. Uveďte proto známá data co nejdříve. Uschovejte smlouvy, zprávy, doklady o platbě nebo fotografie stavu na místě a zmiňte je v první zprávě.',
          ],
        },
        {
          heading: 'Manželství, rodina a dědictví',
          paragraphs: [
            'Vedeme rozvod (離婚), vypořádání majetku, výkon a převzetí práv a povinností k nezletilým dětem (未成年子女權利義務之行使或負擔), styk s dítětem (會面交往) a dědictví (繼承), a to i tehdy, nacházejí-li se strany nebo majetek v různých státech. Přeshraniční rodinné věci často vyžadují další posouzení matričních záznamů (戶籍), formy listin a jejich průkaznosti na Tchaj-wanu.',
            'Protože rodinné věci s sebou často nesou lhůty a souběžná řízení, mělo by první shrnutí uvést vztah mezi stranami, současné bydliště a již probíhající řízení.',
          ],
        },
        {
          heading: 'Pracovněprávní spory',
          paragraphs: [
            'Tato agenda zahrnuje skončení pracovního poměru, odstupné podle tchajwanského práva (資遣費; nelze je ztotožňovat s obdobnými instituty jiných států), odměnu a spory z pracovní smlouvy (勞動契約), a to jak na straně zaměstnance, tak na straně zaměstnavatele. Při posouzení odlišujeme důvod skončení od otázek výpovědní doby, výplaty a lhůt.',
            'Rozhodujícími dokumenty bývají pracovní smlouva, vnitřní pracovní řád (工作規則), výplatní pásky a korespondence stran. Máte-li je stále k dispozici, zmiňte to ve shrnutí.',
          ],
        },
        {
          heading: 'Trestní věci',
          paragraphs: [
            'Zastupujeme v přípravném řízení i před soudem podezřelé a obviněné i poškozené a posuzujeme trestní rizika podnikatelské činnosti.',
            'Trestní věci mívají krátké lhůty a pevně stanovené fáze. Obdrželi-li jste již písemnost orgánu činného v trestním řízení nebo soudu, uveďte datum na písemnosti včas, aby byl obsah posouzen ve správném pořadí.',
          ],
        },
        {
          heading: 'Duševní vlastnictví',
          paragraphs: [
            'Podporujeme zápis ochranných známek (商標) a patentů (專利), autorské právo a spory o tato práva na Tchaj-wanu.',
            'V této agendě rozhoduje pořadí kroků: rozsah ochrany, okamžik podání přihlášky a skutečné užívání ovlivňují volbu. Podání přihlášky samo o sobě neznamená, že jí bude vyhověno.',
          ],
        },
        {
          heading: 'Rozsah a jeho potvrzení',
          paragraphs: [
            'Kancelář pracuje podle tchajwanského práva a vede věci z výše uvedených agend. Rozsah každé věci se potvrzuje zvlášť poté, co advokátka nebo advokát posoudí Vaši zprávu.',
            'Pobytový status, pracovní povolení a obdobné otázky se posuzují podle dokumentů a podle situace konkrétní osoby, nikoli podle státní příslušnosti. Dotýká-li se část Vaší věci těchto bodů, uveďte to při kontaktu. Tato stránka neslibuje výsledek ani lhůtu k odpovědi.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'KANCELÁŘ',
      title: 'O Hovering International Law Firm',
      description:
        'Základní údaje o této tchajwanské advokátní kanceláři, o jejích pobočkách a o práci se zahraničními stranami.',
      intro:
        'Hovering International Law Firm je advokátní kancelář na Tchaj-wanu. Advokátky a advokáti pracují od poradenství podnikům až po soudní řízení. Tato část popisuje vznik kanceláře, sídla a práci se zahraničními stranami.',
      sections: [
        {
          heading: 'Založení a struktura',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) byla založena v roce 2016 advokátkami a advokáty, kteří studovali na National Taiwan University (國立臺灣大學). Čínský název 昊鼎 spojuje znak 昊 („širé nebe“) se znakem 鼎 („pevný základ“) a vystihuje zaměření kanceláře od jejího založení.',
            'Máme pobočky v Tchaj-peji (臺北), Kao-siungu (高雄), Tchaj-čungu (臺中) a Pching-tungu (屏東). Pobočka v Kao-siungu se soustředí na vedení podniků a vede občanskoprávní, trestní a správní spory. Pobočka v Tchaj-čungu vede stavební věci, duševní vlastnictví a věci s vazbou na Koreu a Japonsko. Pobočka v Pching-tungu byla otevřena v roce 2017 pro místní potřebu.',
            'Vedle advokátní práce působí od roku 2020 také Hovering Accounting Office, která nabízí účetnictví a daňové plánování podnikatelům a soukromým osobám s majetkem.',
          ],
        },
        {
          heading: 'Práce se zahraničními stranami',
          paragraphs: [
            'Přeshraniční práce zahrnuje zakládání společností, víza, přihlášky ochranných známek a patentů, posouzení právního rizika a daňové poradenství podnikům. Pobočka v Tchaj-čungu vede zejména stavební věci, duševní vlastnictví a věci s vazbou na Koreu a Japonsko. Advokátka Wei Tseng (曾雋崴) zastupuje klienty z Koreje, z Japonska a další mezinárodní klienty v uvedených agendách.',
            'Zda můžeme věc převzít, závisí na obsahu a na jazyku komunikace. Spadá-li Vaše věc do uvedených agend a lze-li ji projednat v některém ze čtyř jazyků konzultace, můžete zaslat shrnutí k posouzení.',
          ],
        },
        {
          heading: 'Když nás oslovíte',
          paragraphs: [
            'Po doručení Vašeho shrnutí posoudí advokátka nebo advokát obsah a poté hovoří o možném rozsahu práce, o dosud potřebných dokumentech a o dalších krocích. U daňových nebo účetních otázek může kancelář postupovat s účetním úsekem v jednom navazujícím postupu.',
            'Výsledek každé věci závisí na skutkovém stavu a na dostupných dokumentech; výsledek neslibujeme. Potřebujete-li závaznou odpověď pro svou situaci, musí být dokumenty projednány s advokátkou nebo advokátem v některém ze čtyř jazyků konzultace.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKÁTI',
      title: 'Mezinárodní tým Hovering',
      description: 'Profily advokátek a advokátů, provozního vedení a přidruženého účetnictví a auditu Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'NÁKLADY',
      title: 'Jak se stanoví rozsah práce a náklady',
      description:
        'Vysvětlení pořadí: nejprve rozsah práce, poté potvrzení nákladů, a proč tato stránka neobsahuje ceník.',
      intro:
        'Tato stránka vysvětluje, jak se náklady stanoví, nikoli jejich výši. Výše závisí na rozsahu práce v jednotlivé věci a má smysl teprve tehdy, je-li tento rozsah zřejmý.',
      sections: [
        {
          heading: 'Nejprve se stanoví rozsah práce',
          paragraphs: [
            'Věci téhož druhu mohou vyžadovat velmi rozdílné úsilí, podle počtu stran, dostupných dokumentů, lhůt, které je třeba dodržet, a podle toho, zda již bylo zahájeno řízení. Prvním krokem je proto vždy stanovit, co do práce patří a co nikoli.',
            'Shrnutí, které na začátku zašlete, je základem tohoto rozsahu. Čím jasněji popisuje průběh, Váš požadavek a lhůty, tím přesněji lze rozsah určit.',
          ],
        },
        {
          heading: 'Náklady se potvrzují před zahájením práce',
          paragraphs: [
            'Je-li rozsah práce zřejmý, výše a způsob výpočtu nákladů se s Vámi projedná a potvrdí dříve, než práce začne. Změní-li se rozsah v průběhu, musí být potvrzen znovu.',
            'Tato stránka není cenovou nabídkou a nezakládá povinnost k platbě.',
          ],
        },
        {
          heading: 'Porada může být úplatná',
          paragraphs: [
            'Porada s advokátkou nebo advokátem může být úplatnou službou. Tato stránka neříká, že první konzultace je bezplatná, a žádnou její část nelze v tomto smyslu vykládat.',
            'Je-li porada úplatná, sdělí se výše a způsob platby dříve, než se porada uskuteční.',
          ],
        },
        {
          heading: 'Proč tato stránka neuvádí sazby',
          paragraphs: [
            'Náklady závisejí na věci samé: na úsilí, počtu stran, dokumentech, lhůtách a na tom, zda již řízení probíhá. Číslo stanovené předem by náklady Vašeho spisu neukázalo. Proto nejprve stanovíme rozsah práce a náklady Vám sdělíme poté, dříve než práce začne.',
            'Vedle odměny mohou vzniknout soudní poplatky, náklady orgánů nebo třetích osob. Ty jsou od odměny oddělené a závisejí na příslušném řízení.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Jak kancelář oslovit',
      description:
        'Jazyk stránky, jazyky konzultace, postup pro případ, že neovládáte žádný ze čtyř jazyků, a co tato stránka neslibuje.',
      intro:
        'Než nám napíšete, rozlište následující tři body. Bývají směšovány, ale znamenají různé věci.',
      sections: [
        {
          heading: 'Tři věci, které je třeba držet odděleně',
          paragraphs: [
            'Jazyk zobrazení stránky, jazyk konzultace s advokátkou nebo advokátem a jazyk, v němž píšete, jsou tři různé věci.',
          ],
          items: [
            'Jazyk stránky: tyto informace jsou psány česky.',
            'Jazyk konzultace: porada probíhá pouze anglicky, čínsky (中文), japonsky a korejsky.',
            'Váš jazyk psaní: shrnutí můžete napsat ve svém jazyce; původní text se uchová beze změny.',
          ],
        },
        {
          heading: 'Pokud neovládáte žádný ze čtyř jazyků konzultace',
          paragraphs: [
            'V kontaktním formuláři můžete zvolit „Způsob komunikace je třeba potvrdit“. Odpovíme, abychom posoudili schůdný způsob komunikace, existuje-li takový; služba v jiném jazyce zaručena není a lhůta k odpovědi se neslibuje.',
            'Jde pouze o krok posouzení, nikoli o příslib. Neslibujeme tlumočníka, službu v češtině ani v jiném jazyce mimo čtyři uvedené jazyky, ani to, že každou věc přijmeme.',
          ],
        },
        {
          heading: 'Co by měla obsahovat první zpráva',
          paragraphs: [
            'Uveďte, co se stalo, jakou pomoc potřebujete, jakou vazbu má věc na Tchaj-wan a lhůtu, znáte-li ji. Obdrželi-li jste již písemnost soudu nebo úřadu, uveďte datum na písemnosti.',
            'V počáteční fázi zatím nemusíte zasílat číslo pasu, číslo dokladu, údaje o účtu, zdravotní dokumentaci ani soubor důkazů. Vyčkejte pokynů advokátky nebo advokáta a citlivé dokumenty zašlete až poté bezpečnou cestou.',
          ],
        },
        {
          heading: 'Co tato stránka neslibuje',
          paragraphs: [
            'Neslibujeme lhůtu k odpovědi, nepotvrzujeme schůzku prostřednictvím této stránky, neslibujeme určitou advokátku ani určitého advokáta a neposkytujeme tlumočníka. Písemný překlad je něco jiného: Vaše zpráva se automaticky nepřekládá.',
            'Odešlete-li žádost, obsah se uchová a čeká na posouzení. Neobdržíte-li po nějaké době odpověď, můžete napsat znovu na e-mailovou adresu uvedenou na kontaktní stránce.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'OTÁZKY',
      title: 'Časté otázky',
      description:
        'Vysvětlení k rozsahu práce, přípravě, jazykům, nákladům a k tomu, co znamená odeslaná žádost.',
      intro:
        'Následující otázky jsou zodpovězeny na úrovni obecných informací. Odpověď pro Váš případ je možná teprve poté, co advokátka nebo advokát posoudí dokumenty.',
      sections: [
        {
          heading: 'Jak tuto část užívat',
          paragraphs: [
            'Nenajdete-li odpověď pro svou situaci, závisí odpověď zpravidla na zvláštních skutečnostech. Napište je proto do shrnutí, namísto abyste je dovozovali z této stránky.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Které věci kancelář vede?',
          answer:
            'Vedeme šest agend: investice a zakládání společností na Tchaj-wanu, občanskoprávní spory a náhradu škody, manželství, rodinu a dědictví, pracovněprávní spory, trestní věci a duševní vlastnictví. Zda bude věc přijata, se rozhodne po posouzení obsahu.',
        },
        {
          question: 'Co si připravit před kontaktem?',
          answer:
            'Připravte si krátké shrnutí průběhu, svého požadavku, vazby na Tchaj-wan a lhůty, existuje-li nějaká. Je-li již k dispozici písemnost soudu nebo úřadu, uveďte datum. V této fázi zatím nemusíte zasílat doklady totožnosti ani soubor důkazů.',
        },
        {
          question: 'Je možná porada v češtině?',
          answer:
            'Ne. Tyto informace jsou psány česky, ale porada s advokátkou nebo advokátem probíhá pouze anglicky, čínsky (中文), japonsky a korejsky. Neslibujeme ani tlumočníka. Písemný překlad je něco jiného: původní text, který napíšete, se uchová tak, jak je, a automaticky se nepřekládá.',
        },
        {
          question: 'Co dělat, nemohu-li užít žádný ze čtyř jazyků?',
          answer:
            'Při odeslání žádosti zvolte „Způsob komunikace je třeba potvrdit“. Odpovíme, abychom posoudili způsob komunikace, ale služba v jiném jazyce zaručena není. Jde o krok posouzení, nikoli o příslib, že můžeme pracovat v jiném jazyce.',
        },
        {
          question: 'Jak se nakládá s mým textem v češtině?',
          answer:
            'Původní text, který napíšete, se uchová tak, jak je, a automaticky se nepřekládá. Je-li to potřeba, jazyk další komunikace se s Vámi potvrdí.',
        },
        {
          question: 'Proběhla porada již tím, že je žádost odeslána?',
          answer:
            'Ne. Odeslaná žádost čeká na posouzení advokátkou nebo advokátem. Není to právní stanovisko, není to potvrzená schůzka a samotné odeslání nezakládá vztah mezi advokátkou nebo advokátem a klientem.',
        },
        {
          question: 'Jak se počítají náklady?',
          answer:
            'Nejprve se stanoví rozsah práce, poté se s Vámi potvrdí výše a způsob výpočtu nákladů, dříve než práce začne. Tato stránka neuvádí částky a neříká, že první konzultace je bezplatná.',
        },
        {
          question: 'Co dělat, je-li má věc velmi naléhavá?',
          answer:
            'Uveďte lhůtu nebo datum z úřední písemnosti hned na začátku shrnutí, aby byla tato data při posouzení vidět. Tato stránka nemá nouzový kanál a nezajišťuje lhůtu k odpovědi; nesnese-li Vaše věc odkladu, měli byste souběžně hledat další cesty ve svém místě.',
        },
      ],
    },
    privacy: {
      eyebrow: 'SOUKROMÍ',
      title: 'Údaje sbírané kontaktním formulářem',
      description:
        'Co sbírá kontaktní formulář v této české části, jak se nakládá s původním textem a jak nás oslovit ohledně Vašich údajů.',
      intro:
        'Tato část se týká pouze kontaktního formuláře na těchto informačních stránkách. Popisuje nakládání s údaji, nikoli technickou záruku.',
      sections: [
        {
          heading: 'Které údaje se sbírají',
          paragraphs: [
            'Odešlete-li žádost prostřednictvím formuláře v této části, zaznamenají se tyto údaje:',
          ],
          items: [
            'Jméno, které uvedete',
            'E-mailová adresa pro odpověď',
            'Jazyk zobrazení stránky v okamžiku odeslání',
            'Jazyk, v němž jste psali',
            'Jazyk konzultace, který si přejete',
            'Původní text, který jste napsali',
            'Váš souhlas s odesláním žádosti',
            'Číslo podání pro dohledání žádosti',
          ],
        },
        {
          heading: 'Původní text se uchová beze změny',
          paragraphs: [
            'Váš text se uchová přesně tak, jak jste jej napsali, a automaticky se nepřekládá. Je-li pro vyřízení potřebný překlad, projedná se to s Vámi zvlášť.',
            'Protože se původní text uchovává, nepište v počáteční fázi to, co zatím není potřebné, například číslo pasu, číslo dokladu nebo údaje o účtu.',
          ],
        },
        {
          heading: 'Místo uchování a přístup',
          paragraphs: [
            'Obsah Vašeho podání se uchovává na místě, které není veřejně přístupné. Přístup k němu mají pouze oprávněné osoby v kanceláři, a to za účelem vyřízení žádosti.',
            'Tato stránka nedává absolutní záruku bezpečnosti. Žádná cesta přenosu a žádné místo uchování není zcela bezpečné; citlivé dokumenty by proto měly být zasílány až po zvláštním pokynu advokátky nebo advokáta.',
          ],
        },
        {
          heading: 'Účel užití',
          paragraphs: [
            'Odeslané údaje slouží k posouzení žádosti, k odpovědi Vám, k ujasnění způsobu komunikace a k vyřízení, je-li práce převzata.',
            'Údaje se bez zvláštního souhlasu neužívají k marketingu.',
          ],
        },
        {
          heading: 'Oznámení a číslo podání',
          paragraphs: [
            'Je-li žádost úspěšně odeslána, systém uvědomí kancelář. Není-li toto oznámení zatím potvrzeno, Váš text zůstává uchován a neztrácí se.',
            'Číslo podání slouží k dohledání Vaší žádosti v našich záznamech. Zobrazí se po uložení; můžete je uvést při novém kontaktu.',
          ],
        },
        {
          heading: 'Vaše práva a cesta ke kontaktu',
          paragraphs: [
            'Můžete žádat o přístup ke svým údajům, o jejich opravu nebo výmaz, případně odvolat souhlas, a to prostřednictvím e-mailové adresy uvedené na kontaktní stránce. Existuje-li zákonná nebo procesní povinnost uchování, vysvětlíme omezení.',
            'Tato stránka neuvádí pevnou dobu uchování, protože skutečná doba závisí na dalším průběhu věci a na souvisejících povinnostech. Přejete-li si dřívější výmaz, sdělte to při kontaktu.',
          ],
        },
        {
          heading: 'Místo uchování a poskytovatelé',
          paragraphs: [
            'Tyto stránky jsou hostovány u společnosti Vercel a Vaše podání se uchovává v neveřejném objektovém úložišti této služby. E-maily se odesílají poštovní službou, kterou kancelář užívá.',
            'Servery jednotlivých poskytovatelů se mohou nacházet mimo Tchaj-wan, takže Vaše údaje tam mohou být uchovávány a zpracovávány. Je-li účel uchování naplněn, údaje se bez zbytečného odkladu vymažou; údaje, které je třeba uchovávat podle použitelných předpisů, zůstávají po tuto dobu. Žádosti o osobní údaje přijímá wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'UPOZORNĚNÍ',
      title: 'Rozsah a hranice informací na této stránce',
      description:
        'Obecná povaha informací, právní rámec a předpoklady vzniku vztahu mezi advokátkou nebo advokátem a klientem.',
      intro:
        'Tato část objasňuje, co pro Vás tyto české informační stránky mohou udělat a co nikoli.',
      sections: [
        {
          heading: 'Pouze obecné informace',
          paragraphs: [
            'Obsah těchto stránek je psán jako obecná informace. Není právní radou k Vašemu případu a nenahrazuje posouzení Vašich dokumentů.',
            'Výsledek věci závisí na skutkovém stavu, na použitelných předpisech a na okamžiku; dvě zdánlivě podobné situace mohou skončit různě.',
          ],
        },
        {
          heading: 'Právní rámec',
          paragraphs: [
            'Kancelář působí podle tchajwanského práva a tato stránka hovoří pouze o práci v tomto rámci.',
            'Obsah není poradenstvím podle práva jiného řádu než tchajwanského, včetně práva místa Vašeho pobytu. Týká-li se část Vaší věci jiného právního řádu, ujasníme s Vámi, jaká kvalifikovaná osoba je pro tuto část potřebná.',
          ],
        },
        {
          heading: 'Vztah mezi advokátkou nebo advokátem a klientem nevzniká sám od sebe',
          paragraphs: [
            'Přečtení této stránky, odeslání formuláře nebo e-mailu samo o sobě nezakládá vztah mezi advokátkou nebo advokátem a klientem.',
            'Tento vztah vzniká teprve poté, co byla věc posouzena a obě strany potvrdily převzetí práce.',
          ],
        },
        {
          heading: 'Žádný příslib výsledku',
          paragraphs: [
            'Žádná část této stránky není příslibem ohledně výsledku věci, vyhovění přihlášce nebo žádosti či ohledně pobytového a pracovního statusu.',
            'Vnější odkazy slouží k orientaci; neslibujeme správnost ani aktuálnost obsahu třetích osob.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ČLÁNKY',
      title: 'Články o tchajwanském právu',
      description:
        'Články v češtině k častým otázkám tchajwanského práva. Obsah je obecnou informací k okamžiku zveřejnění, nikoli právní radou k Vašemu případu.',
      intro:
        'Kancelář zveřejňuje články k častým otázkám tchajwanského práva. Články dostupné v češtině jsou na této stránce; vedle nich jsou čtyři odkazy, z nichž každý otevře seznam článků v jednom původním jazyce.',
      sections: [
        {
          heading: 'Čtyři seznamy podle jazyka',
          paragraphs: [
            'Tato část obsahuje čtyři odkazy: seznam článků v korejštině, v čínštině, v angličtině a v japonštině. Každý odkaz uvádí jazyk seznamu, takže předem víte, v jakém jazyce se obsah otevře.',
            'Tyto čtyři seznamy jsou seznamy podle původního jazyka článků, nikoli seznamy překladů. Články dostupné v češtině jsou zvlášť na této stránce.',
          ],
        },
        {
          heading: 'Kam odkazy vedou',
          paragraphs: [
            'Zvolíte-li jeden ze čtyř odkazů, otevře se seznam článků v daném jazyce. Ze seznamu si text vyberete sami; celý obsah se zobrazí v původním jazyce článku.',
            'Tato stránka obsah článků neshrnuje a nezaručuje, že určité téma je k dispozici ve všech čtyřech jazycích. Každý seznam obsahuje pouze texty zveřejněné v daném jazyce.',
          ],
        },
        {
          heading: 'Nakolik může článek sloužit k orientaci',
          paragraphs: [
            'Články jsou obecnými informacemi k okamžiku zveřejnění. Předpisy a jejich používání se mohou změnit a článek neobsahuje všechny okolnosti Vašeho případu.',
            'Nezakládejte proto postup ve skutečné věci pouze na článku. Užijte jej k přehledu a své dokumenty projednejte zvlášť s advokátkou nebo advokátem; tato stránka není krokem porady.',
          ],
        },
      ],
    },
  },
};

export const slovenianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Slovenščina',
  nav: {
    home: 'Domov',
    services: 'Področja',
    about: 'Pisarna',
    lawyers: 'Odvetniki',
    pricing: 'Stroški',
    contact: 'Stik',
    faq: 'Vprašanja',
    privacy: 'Zasebnost',
    disclaimer: 'Izjava',
    columns: 'Članki',
  },
  contactCta: 'Pošljite prošnjo za pregled',
  footerNotice:
    'Ta slovenska stran vsebuje le splošne informacije o delu pisarne po tajvanskem pravu. Ni pravni nasvet za posamezno zadevo in samo pošiljanje sporočila ne vzpostavi razmerja med odvetnico ali odvetnikom in stranko.',
  skipLink: 'Preskočite krmarjenje in pojdite na vsebino',
  menuLabel: 'Pregled strani',
  languageLabel: 'Jezik prikaza',
  mega: {
    services: {
      description: 'Pisarna vodi glavna področja tajvanskega prava.',
      viewAllLabel: 'Pokaži vse',
    },
    columns: {
      description: 'Članki o pogostih vprašanjih tajvanskega prava.',
      viewAllLabel: 'Pokaži vse',
    },
    lawyers: {
      description: 'Predstavitev odvetnic in odvetnikov ter načinov stika.',
      viewAllLabel: 'Pokaži vse',
    },
    pricing: {
      description: 'Ta stran pojasnjuje obseg dela in način določitve stroškov.',
      viewAllLabel: 'Pokaži vse',
    },
    faq: {
      description: 'Pogosta vprašanja o delu pisarne na Tajvanu.',
      viewAllLabel: 'Pokaži vse',
    },
  },
  notFoundTitle: 'Strani ni mogoče najti',
  notFoundText:
    'Iskana stran ne obstaja ali je bila premaknjena. Lahko se vrnete na slovensko domačo stran in si ogledate razpoložljive informacije.',
  backHomeLabel: 'Na domačo stran',
  readSourceLabel: 'Odprite seznam člankov v izvirnem jeziku',
  home: {
    heroScrollLabel: 'Pomaknite se navzdol',
    heroColumnsCtaLabel: 'Oglejte si članke',
    servicesDetailLabel: 'Oglejte si podrobnosti',
    servicesAssistanceBefore: 'Če ni jasno, v katero področje spada vaša zadeva, stran ',
    servicesAssistanceLinkLabel: 'Stik',
    servicesAssistanceAfter: ' pojasnjuje, kako sestaviti povzetek, ki ga bo ocenila odvetnica ali odvetnik.',
    columnsViewAllLabel: 'Oglejte si vse članke',
    columnsReadMoreLabel: 'Berite dalje',
    columnsReviewLabel: 'Pregledala odvetnica Wei Tseng',
    columnsOriginalLanguageBadge: 'Izvirni jezik',
    columnsOriginalLanguageNote:
      'Naslednji članki še niso na voljo v slovenščini. Seznam ostane v izvirnem jeziku in odpre ustrezno jezikovno stran; vsebina se ne prevaja samodejno.',
    imageBandAlt: 'Tradicionalno tajvansko dvorišče sanheyuan (三合院) in sodoben paviljon pri dnevni svetlobi',
    videoPauseLabel: 'Zaustavi video',
    videoPlayLabel: 'Predvajaj video',
    videoReplayLabel: 'Predvajaj video znova',
  },
  pages: {
    home: {
      eyebrow: 'NAPOTKI',
      title: 'Pravne storitve na Tajvanu — napotki v slovenščini',
      description:
        'Splošna pojasnila v slovenščini o obsegu dela Hovering International Law Firm na Tajvanu, o jezikih posveta in o prvem stiku.',
      intro:
        'Hovering International Law Firm zastopa tuje stranke, tudi osebe z vezjo na Tajvan, v zadevah tajvanskega prava: naložbe in ustanavljanje družb, civilni spori, zakonska zveza, družina in dedovanje, delovno pravo, kazenske zadeve in intelektualna lastnina. Ta slovenski del vam pomaga prepoznati, katero delo spada v naš obseg, kaj pripraviti in kako nas poklicati. Gre za splošne informacije, ne za pravni nasvet za vaš primer.',
      sections: [
        {
          heading: 'S čim se ukvarjamo',
          paragraphs: [
            'Hovering International Law Firm je odvetniška pisarna s sedežem na Tajvanu. Deluje po tajvanskem pravu in ima pisarne v Tajpeju (臺北), Gaosjungu (高雄), Tajdžongu (臺中) in Pingdongu (屏東). Svetujemo podjetjem, vodimo sodne postopke in zastopamo tuje stranke pri korakih, ki jih je treba opraviti na Tajvanu.',
            'Vsa vsebina tukaj je splošna. Izid zadeve je odvisen od dejanskega stanja, od uporabnih predpisov in od trenutka. Ti napotki ne nadomeščajo pogovora z odvetnico ali odvetnikom o vaših dokumentih.',
          ],
        },
        {
          heading: 'Jezik strani in jezik posveta nista isto',
          paragraphs: [
            'Ta stran je napisana v slovenščini, vendar posvet z odvetnico ali odvetnikom poteka samo v štirih jezikih: v angleščini, kitajščini (中文), japonščini in korejščini. Branje napotkov v slovenščini ne pomeni, da bo posvet z odvetnico ali odvetnikom potekal v slovenščini.',
            'Ne obljubljamo tolmača, roka za odgovor niti sestanka prek te strani. Če ne obvladate nobenega od štirih jezikov posveta, stran »Stik« pojasnjuje, kako ocenjujemo način sporazumevanja.',
          ],
        },
        {
          heading: 'Področja pisarne',
          paragraphs: [
            'Obseg dela obsega naslednjih šest področij. Stran »Področja« vsako od njih opiše natančneje in navede, česa ne obljubljamo.',
          ],
          items: [
            'Naložbe in ustanavljanje družb na Tajvanu',
            'Civilni spori in odškodnina',
            'Zakonska zveza, družina in dedovanje',
            'Delovnopravni spori',
            'Kazenske zadeve',
            'Intelektualna lastnina: znamke, patenti in avtorska pravica',
          ],
        },
        {
          heading: 'Kje začeti',
          paragraphs: [
            'Preberite stran »Področja« in preverite, ali vaša zadeva spada v naš obseg, nato »Stroški« in »Stik«, da veste, kako se določi obseg in kako se stroški potrdijo pred začetkom dela.',
            'Pri pošiljanju sporočila smete povzetek napisati v svojem jeziku. Izvirno besedilo se shrani natanko tako, kot ste ga napisali, in se ne prevaja samodejno. Poslano sporočilo je prošnja, ki čaka na oceno: to še ni posvet in še ni potrjen sestanek.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'PODROČJA',
      title: 'Katere zadeve vodimo',
      description:
        'Šest področij, ki jih pisarna vodi na Tajvanu, in meje, ki jih je koristno poznati najprej.',
      intro:
        'Spodaj so področja, ki jih resnično vodimo, in vprašanja, ki se v začetni fazi zastavljajo najpogosteje. Razlaga vam pomaga oceniti, ali vaša zadeva spada v naš obseg; je splošna in ni pravna analiza posameznega spisa.',
      sections: [
        {
          heading: 'Naložbe in ustanavljanje družb na Tajvanu',
          paragraphs: [
            'Zastopamo tuje vlagatelje in podjetja pri ustanovitvi ali vodenju družbe na Tajvanu: izbira pravne oblike, priprava in vložitev dokumentov, vložek kapitala, bančna vprašanja, ocena sedeža in panožne zahteve. Podpiramo tudi računovodstvo in davke, ki izhajajo iz ustanovitve in poslovanja na Tajvanu.',
            'Postopek in roki se razlikujejo glede na obliko, vlagatelja, panogo, banko in glede na že razpoložljive dokumente. Ustanovitev družbe sama po sebi ne vodi do dovoljenja za prebivanje (居留) niti do delovnega dovoljenja (工作許可): gre za ločene postopke, ki se ocenjujejo glede na položaj konkretne osebe.',
          ],
        },
        {
          heading: 'Civilni spori in odškodnina',
          paragraphs: [
            'To področje obsega spore iz pogodb, odškodnino iz protipravnega dejanja in potrošniške spore. Delo se praviloma začne s časovnico, oceno dokumentov in obstoječih dokazov in šele nato sledijo nadaljnji koraki.',
            'Potek določajo roki, vključno z zastaralnimi, in popolnost dokazov. Zato navedite znane datume čim prej. Shranite pogodbe, sporočila, dokazila o plačilu ali fotografije stanja na kraju in jih omenite v prvem sporočilu.',
          ],
        },
        {
          heading: 'Zakonska zveza, družina in dedovanje',
          paragraphs: [
            'Vodimo ločitev (離婚), delitev premoženja, izvrševanje in prevzem pravic ter dolžnosti do mladoletnih otrok (未成年子女權利義務之行使或負擔), stike z otrokom (會面交往) in dedovanje (繼承), tudi kadar so stranke ali premoženje v različnih državah. Čezmejne družinske zadeve pogosto zahtevajo nadaljnjo oceno matičnih evidenc (戶籍), oblike listin in njihove dokazne moči na Tajvanu.',
            'Ker družinske zadeve pogosto prinašajo roke in vzporedne postopke, naj prvi povzetek navede razmerje med strankami, trenutno prebivališče in že potekajoče postopke.',
          ],
        },
        {
          heading: 'Delovnopravni spori',
          paragraphs: [
            'To področje obsega prenehanje delovnega razmerja, odpravnino po tajvanskem pravu (資遣費; ni je mogoče enačiti s podobnimi instituti drugih držav), plačilo in spore iz pogodbe o zaposlitvi (勞動契約), tako na strani delavca kot na strani delodajalca. Pri oceni ločimo razlog prenehanja od vprašanj odpovednega roka, izplačila in rokov.',
            'Odločilni dokumenti so običajno pogodba o zaposlitvi, interni delovni red (工作規則), plačilne liste in korespondenca strank. Če jih še imate, to omenite v povzetku.',
          ],
        },
        {
          heading: 'Kazenske zadeve',
          paragraphs: [
            'Zastopamo v predkazenskem postopku in pred sodiščem osumljene in obdolžene ter oškodovance in ocenjujemo kazenska tveganja podjetniške dejavnosti.',
            'Kazenske zadeve imajo pogosto kratke roke in vnaprej določene faze. Če ste že prejeli pisanje organa, ki vodi kazenski postopek, ali sodišča, navedite datum na pisanju pravočasno, da se vsebina oceni v pravilnem vrstnem redu.',
          ],
        },
        {
          heading: 'Intelektualna lastnina',
          paragraphs: [
            'Podpiramo vpis znamk (商標) in patentov (專利), avtorsko pravico in spore o teh pravicah na Tajvanu.',
            'Na tem področju odloča vrstni red korakov: obseg varstva, trenutek vložitve prijave in dejanska uporaba vplivajo na izbiro. Vložitev prijave sama po sebi ne pomeni, da ji bo ugodeno.',
          ],
        },
        {
          heading: 'Obseg in njegova potrditev',
          paragraphs: [
            'Pisarna dela po tajvanskem pravu in vodi zadeve z zgoraj navedenih področij. Obseg vsake zadeve se potrdi posebej, potem ko odvetnica ali odvetnik oceni vaše sporočilo.',
            'Status prebivanja, delovno dovoljenje in podobna vprašanja se ocenjujejo glede na dokumente in glede na položaj konkretne osebe, ne glede na državljanstvo. Če se del vaše zadeve nanaša na te točke, to navedite pri stiku. Ta stran ne obljublja izida niti roka za odgovor.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'PISARNA',
      title: 'O Hovering International Law Firm',
      description:
        'Osnovni podatki o tej tajvanski odvetniški pisarni, o njenih pisarnah in o delu s tujimi strankami.',
      intro:
        'Hovering International Law Firm je odvetniška pisarna na Tajvanu. Odvetnice in odvetniki delajo od svetovanja podjetjem do sodnih postopkov. Ta del opisuje nastanek pisarne, sedeže in delo s tujimi strankami.',
      sections: [
        {
          heading: 'Ustanovitev in zgradba',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) so leta 2016 ustanovile odvetnice in odvetniki, ki so študirali na National Taiwan University (國立臺灣大學). Kitajsko ime 昊鼎 povezuje znak 昊 (»široko nebo«) z znakom 鼎 (»trdna podlaga«) in izraža usmeritev pisarne od njene ustanovitve.',
            'Imamo pisarne v Tajpeju (臺北), Gaosjungu (高雄), Tajdžongu (臺中) in Pingdongu (屏東). Pisarna v Gaosjungu se osredotoča na vodenje podjetij in vodi civilne, kazenske in upravne spore. Pisarna v Tajdžongu vodi gradbene zadeve, intelektualno lastnino in zadeve z vezjo na Korejo in Japonsko. Pisarna v Pingdongu je bila odprta leta 2017 za lokalne potrebe.',
            'Poleg odvetniškega dela od leta 2020 deluje tudi Hovering Accounting Office, ki ponuja računovodstvo in davčno načrtovanje podjetnikom in zasebnim osebam s premoženjem.',
          ],
        },
        {
          heading: 'Delo s tujimi strankami',
          paragraphs: [
            'Čezmejno delo obsega ustanavljanje družb, vizume, prijave znamk in patentov, oceno pravnega tveganja in davčno svetovanje podjetjem. Pisarna v Tajdžongu vodi zlasti gradbene zadeve, intelektualno lastnino in zadeve z vezjo na Korejo in Japonsko. Odvetnica Wei Tseng (曾雋崴) zastopa stranke iz Koreje, z Japonske in druge mednarodne stranke na navedenih področjih.',
            'Ali lahko zadevo prevzamemo, je odvisno od vsebine in od jezika sporazumevanja. Če vaša zadeva spada na navedena področja in jo je mogoče obravnavati v enem od štirih jezikov posveta, lahko pošljete povzetek v oceno.',
          ],
        },
        {
          heading: 'Ko nas pokličete',
          paragraphs: [
            'Po prejemu vašega povzetka odvetnica ali odvetnik oceni vsebino in nato govori o morebitnem obsegu dela, o še potrebnih dokumentih in o nadaljnjih korakih. Pri davčnih ali računovodskih vprašanjih lahko pisarna sodeluje z računovodskim oddelkom v enem povezanem postopku.',
            'Izid vsake zadeve je odvisen od dejanskega stanja in od razpoložljivih dokumentov; izida ne obljubljamo. Če potrebujete zavezujoč odgovor za svoj položaj, morajo biti dokumenti obravnavani z odvetnico ali odvetnikom v enem od štirih jezikov posveta.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ODVETNIKI',
      title: 'Mednarodna ekipa Hovering',
      description: 'Profili odvetnic in odvetnikov, operativnega vodenja in pridruženega računovodstva Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'STROŠKI',
      title: 'Kako se določita obseg dela in stroški',
      description:
        'Pojasnilo vrstnega reda: najprej obseg dela, nato potrditev stroškov, in zakaj ta stran ne vsebuje cenika.',
      intro:
        'Ta stran pojasnjuje, kako se stroški določijo, ne pa njihove višine. Višina je odvisna od obsega dela v posamezni zadevi in ima smisel šele, ko je ta obseg jasen.',
      sections: [
        {
          heading: 'Najprej se določi obseg dela',
          paragraphs: [
            'Zadeve iste vrste lahko zahtevajo zelo različno prizadevanje, glede na število strank, razpoložljive dokumente, roke, ki jih je treba upoštevati, in glede na to, ali je postopek že začet. Prvi korak je zato vedno določiti, kaj spada v delo in kaj ne.',
            'Povzetek, ki ga na začetku pošljete, je podlaga tega obsega. Bolj ko jasno opiše potek, vašo zahtevo in roke, natančneje je mogoče obseg določiti.',
          ],
        },
        {
          heading: 'Stroški se potrdijo pred začetkom dela',
          paragraphs: [
            'Ko je obseg dela jasen, se višina in način izračuna stroškov z vami obravnavata in potrdita, preden delo začne. Če se obseg med potekom spremeni, mora biti potrjen znova.',
            'Ta stran ni cenovna ponudba in ne vzpostavi obveznosti plačila. Tudi pošiljanje prošnje prek te strani je brezplačno.',
          ],
        },
        {
          heading: 'Posvet je lahko plačljiv',
          paragraphs: [
            'Posvet z odvetnico ali odvetnikom je lahko plačljiva storitev. Ta stran ne pravi, da je prvi posvet brezplačen, in nobenega njenega dela ni mogoče razumeti v tem smislu.',
            'Če je posvet plačljiv, se višina in način plačila sporočita, preden se posvet opravi.',
          ],
        },
        {
          heading: 'Zakaj ta stran ne navaja tarif',
          paragraphs: [
            'Stroški so odvisni od zadeve same: od prizadevanja, števila strank, dokumentov, rokov in od tega, ali postopek že teče. Številka, določena vnaprej, ne bi pokazala stroškov vašega spisa. Zato najprej določimo obseg dela in vam stroške sporočimo nato, preden delo začne.',
            'Poleg nagrade lahko nastanejo sodne takse, stroški organov ali tretjih oseb. Ti so od nagrade ločeni in so odvisni od ustreznega postopka.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'STIK',
      title: 'Kako pisarno pokličete',
      description:
        'Jezik strani, jeziki posveta, postopek, če ne obvladate nobenega od štirih jezikov, in česa ta stran ne obljublja.',
      intro:
        'Preden nam pišete, ločite naslednje tri točke. Pogosto se mešajo, pomenijo pa različne stvari.',
      sections: [
        {
          heading: 'Tri stvari, ki jih je treba držati ločeno',
          paragraphs: [
            'Jezik prikaza strani, jezik posveta z odvetnico ali odvetnikom in jezik, v katerem pišete, so tri različne stvari.',
          ],
          items: [
            'Jezik strani: ti napotki so napisani v slovenščini.',
            'Jezik posveta: posvet poteka samo v angleščini, kitajščini (中文), japonščini in korejščini.',
            'Vaš jezik pisanja: povzetek smete napisati v svojem jeziku; izvirno besedilo se shrani nespremenjeno.',
          ],
        },
        {
          heading: 'Če ne obvladate nobenega od štirih jezikov posveta',
          paragraphs: [
            'V obrazcu za stik lahko izberete »Način sporazumevanja je treba potrditi«. Odgovorimo, da ocenimo, ali obstaja izvedljiv način sporazumevanja; storitev v drugem jeziku ni zagotovljena in rok za odgovor se ne obljublja.',
            'Gre le za korak ocene, ne za obljubo. Ne obljubljamo tolmača, storitve v slovenščini niti v drugem jeziku zunaj štirih navedenih jezikov, niti tega, da vsako zadevo sprejmemo.',
          ],
        },
        {
          heading: 'Kaj naj vsebuje prvo sporočilo',
          paragraphs: [
            'Navedite, kaj se je zgodilo, kakšno pomoč potrebujete, kakšno vez ima zadeva s Tajvanom in rok, če ga poznate. Če ste že prejeli pisanje sodišča ali organa, navedite datum na pisanju.',
            'V začetni fazi še ni treba pošiljati številke potnega lista, številke osebnega dokumenta, podatkov o računu, zdravstvene dokumentacije niti zbirke dokazov. Počakajte na navodila odvetnice ali odvetnika in občutljive dokumente pošljite šele nato po varni poti.',
          ],
        },
        {
          heading: 'Česa ta stran ne obljublja',
          paragraphs: [
            'Ne obljubljamo roka za odgovor, ne potrjujemo sestanka prek te strani, ne obljubljamo določene odvetnice niti določenega odvetnika in ne zagotavljamo tolmača. Pisni prevod je nekaj drugega: vaše sporočilo se ne prevaja samodejno.',
            'Če pošljete prošnjo, se vsebina shrani in čaka na oceno. Če po nekaj časa ne prejmete odgovora, lahko znova pišete na e-naslov, naveden na strani za stik.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'VPRAŠANJA',
      title: 'Pogosta vprašanja',
      description:
        'Pojasnila o obsegu dela, pripravi, jezikih, stroških in o tem, kaj pomeni poslana prošnja.',
      intro:
        'Na naslednja vprašanja odgovarjamo na ravni splošnih informacij. Odgovor za vaš primer je mogoč šele, potem ko odvetnica ali odvetnik oceni dokumente.',
      sections: [
        {
          heading: 'Kako ta del uporabljati',
          paragraphs: [
            'Če ne najdete odgovora za svoj položaj, je odgovor praviloma odvisen od posebnih dejstev. Zato jih napišite v povzetek, namesto da bi jih izpeljevali s te strani.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Katere zadeve pisarna vodi?',
          answer:
            'Vodimo šest področij: naložbe in ustanavljanje družb na Tajvanu, civilne spore in odškodnino, zakonsko zvezo, družino in dedovanje, delovnopravne spore, kazenske zadeve in intelektualno lastnino. Ali bo zadeva sprejeta, se odloči po oceni vsebine.',
        },
        {
          question: 'Kaj pripraviti pred stikom?',
          answer:
            'Pripravite kratek povzetek poteka, svoje zahteve, vezi s Tajvanom in roka, če obstaja. Če je že na voljo pisanje sodišča ali organa, navedite datum. V tej fazi še ni treba pošiljati osebnih dokumentov niti zbirke dokazov.',
        },
        {
          question: 'Ali je mogoč posvet v slovenščini?',
          answer:
            'Ne. Ti napotki so napisani v slovenščini, vendar posvet z odvetnico ali odvetnikom poteka samo v angleščini, kitajščini (中文), japonščini in korejščini. Ne obljubljamo niti tolmača. Pisni prevod je nekaj drugega: izvirno besedilo, ki ga napišete, se shrani tako, kot je, in se ne prevaja samodejno.',
        },
        {
          question: 'Kaj storiti, če ne morem uporabiti nobenega od štirih jezikov?',
          answer:
            'Pri pošiljanju prošnje izberite »Način sporazumevanja je treba potrditi«. Odgovorimo, da ocenimo način sporazumevanja, vendar storitev v drugem jeziku ni zagotovljena. Gre za korak ocene, ne za obljubo, da lahko delamo v drugem jeziku.',
        },
        {
          question: 'Kako se ravna z mojim besedilom v slovenščini?',
          answer:
            'Izvirno besedilo, ki ga napišete, se shrani tako, kot je, in se ne prevaja samodejno. Če je potrebno, se jezik nadaljnjega sporazumevanja z vami potrdi.',
        },
        {
          question: 'Ali je posvet že opravljen s tem, da je prošnja poslana?',
          answer:
            'Ne. Poslana prošnja čaka na oceno odvetnice ali odvetnika. Ni pravno mnenje, ni potrjen sestanek in samo pošiljanje ne vzpostavi razmerja med odvetnico ali odvetnikom in stranko.',
        },
        {
          question: 'Kako se izračunajo stroški?',
          answer:
            'Najprej se določi obseg dela, nato se z vami potrdita višina in način izračuna stroškov, preden delo začne. Ta stran ne navaja zneskov in ne pravi, da je prvi posvet brezplačen.',
        },
        {
          question: 'Kaj storiti, če je moja zadeva zelo nujna?',
          answer:
            'Navedite rok ali datum z uradnega pisanja takoj na začetku povzetka, da bodo ti podatki pri oceni vidni. Ta stran nima nujnega kanala in ne zagotavlja roka za odgovor; če vaša zadeva ne more čakati, bi morali vzporedno iskati nadaljnje poti v svojem kraju.',
        },
      ],
    },
    privacy: {
      eyebrow: 'ZASEBNOST',
      title: 'Podatki, ki jih zbira obrazec za stik',
      description:
        'Kaj zbira obrazec za stik v tem slovenskem delu, kako se ravna z izvirnim besedilom in kako nas pokličete glede vaših podatkov.',
      intro:
        'Ta del se nanaša samo na obrazec za stik na teh napotilnih straneh. Opisuje ravnanje s podatki, ne pa tehničnega jamstva.',
      sections: [
        {
          heading: 'Kateri podatki se zbirajo',
          paragraphs: [
            'Če pošljete prošnjo prek obrazca v tem delu, se zabeležijo ti podatki:',
          ],
          items: [
            'Ime, ki ga navedete',
            'E-naslov za odgovor',
            'Jezik prikaza strani v trenutku pošiljanja',
            'Jezik, v katerem ste pisali',
            'Jezik posveta, ki si ga želite',
            'Izvirno besedilo, ki ste ga napisali',
            'Vaše soglasje s pošiljanjem prošnje',
            'Številka prejema za iskanje prošnje',
          ],
        },
        {
          heading: 'Izvirno besedilo se shrani nespremenjeno',
          paragraphs: [
            'Vaše besedilo se shrani natanko tako, kot ste ga napisali, in se ne prevaja samodejno. Če je za obravnavo potreben prevod, se to z vami obravnava posebej.',
            'Ker se izvirno besedilo shranjuje, v začetni fazi ne pišite tistega, kar še ni potrebno, na primer številke potnega lista, številke osebnega dokumenta ali podatkov o računu.',
          ],
        },
        {
          heading: 'Kraj hrambe in dostop',
          paragraphs: [
            'Vsebina vaše pošiljke se hrani na mestu, ki ni javno dostopno. Dostop do nje imajo samo pooblaščene osebe v pisarni, in sicer zaradi obravnave prošnje.',
            'Ta stran ne daje absolutnega jamstva varnosti. Nobena pot prenosa in nobeno mesto hrambe ni povsem varno; občutljive dokumente je zato treba pošiljati šele po posebnem navodilu odvetnice ali odvetnika.',
          ],
        },
        {
          heading: 'Namen uporabe',
          paragraphs: [
            'Poslani podatki služijo oceni prošnje, odgovoru vam, pojasnitvi načina sporazumevanja in obravnavi, če se delo prevzame.',
            'Podatki se brez posebnega soglasja ne uporabljajo za trženje.',
          ],
        },
        {
          heading: 'Obvestilo in številka prejema',
          paragraphs: [
            'Če je prošnja uspešno poslana, sistem obvesti pisarno. Če to obvestilo še ni potrjeno, vaše besedilo ostane shranjeno in se ne izgubi.',
            'Številka prejema služi iskanju vaše prošnje v naših evidencah. Prikaže se po shranitvi; lahko jo navedete pri novem stiku.',
          ],
        },
        {
          heading: 'Vaše pravice in pot do stika',
          paragraphs: [
            'Lahko zahtevate vpogled v svoje podatke, njihov popravek ali izbris oziroma prekličete soglasje, in sicer prek e-naslova, navedenega na strani za stik. Če obstaja zakonska ali postopkovna obveznost hrambe, pojasnimo omejitev.',
            'Ta stran ne navaja stalnega roka hrambe, ker je dejanski rok odvisen od nadaljnjega poteka zadeve in od povezanih obveznosti. Če želite zgodnejši izbris, to sporočite pri stiku.',
          ],
        },
        {
          heading: 'Kraj hrambe in ponudniki',
          paragraphs: [
            'Te strani gosti družba Vercel in vaša pošiljka se hrani v nejavnem objektnem shrambišču te storitve. E-pošta se pošilja poštno storitvijo, ki jo pisarna uporablja.',
            'Strežniki posameznih ponudnikov so lahko zunaj Tajvana, zato se vaši podatki tam lahko hranijo in obdelujejo. Ko je namen hrambe izpolnjen, se podatki brez nepotrebnega odlašanja izbrišejo; podatki, ki jih je treba hraniti po uporabnih predpisih, ostanejo za to obdobje. Prošnje za osebne podatke sprejema wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'IZJAVA',
      title: 'Obseg in meje informacij na tej strani',
      description:
        'Splošna narava informacij, pravni okvir in predpostavke nastanka razmerja med odvetnico ali odvetnikom in stranko.',
      intro:
        'Ta del pojasnjuje, kaj vam te slovenske napotilne strani lahko dajo in česa ne.',
      sections: [
        {
          heading: 'Samo splošne informacije',
          paragraphs: [
            'Vsebina teh strani je napisana kot splošna informacija. Ni pravni nasvet za vaš primer in ne nadomešča ocene vaših dokumentov.',
            'Izid zadeve je odvisen od dejanskega stanja, od uporabnih predpisov in od trenutka; dve navidezno podobni situaciji se lahko končata različno.',
          ],
        },
        {
          heading: 'Pravni okvir',
          paragraphs: [
            'Pisarna deluje po tajvanskem pravu in ta stran govori samo o delu v tem okviru.',
            'Vsebina ni svetovanje po pravu drugega reda kot tajvanskega, vključno s pravom kraja vašega prebivanja. Če se del vaše zadeve nanaša na drug pravni red, z vami pojasnimo, katera usposobljena oseba je za ta del potrebna.',
          ],
        },
        {
          heading: 'Razmerje med odvetnico ali odvetnikom in stranko ne nastane samo od sebe',
          paragraphs: [
            'Branje te strani, pošiljanje obrazca ali e-pošte samo po sebi ne vzpostavi razmerja med odvetnico ali odvetnikom in stranko.',
            'To razmerje nastane šele, potem ko je zadeva ocenjena in sta obe strani potrdili prevzem dela.',
          ],
        },
        {
          heading: 'Nobene obljube izida',
          paragraphs: [
            'Noben del te strani ni obljuba glede izida zadeve, ugoditve prijavi ali prošnji oziroma glede statusa prebivanja in dela.',
            'Zunanje povezave služijo orientaciji; ne jamčimo pravilnosti niti ažurnosti vsebine tretjih oseb.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ČLANKI',
      title: 'Članki o tajvanskem pravu',
      description:
        'Članki v slovenščini o pogostih vprašanjih tajvanskega prava. Vsebina je splošna informacija ob trenutku objave, ne pravni nasvet za vaš primer.',
      intro:
        'Pisarna objavlja članke o pogostih vprašanjih tajvanskega prava. Članki, ki so na voljo v slovenščini, so na tej strani; poleg njih so štiri povezave, od katerih vsaka odpre seznam člankov v enem izvirnem jeziku.',
      sections: [
        {
          heading: 'Štirje seznami po jeziku',
          paragraphs: [
            'Ta del vsebuje štiri povezave: seznam člankov v korejščini, v kitajščini, v angleščini in v japonščini. Vsaka povezava navede jezik seznama, zato vnaprej veste, v katerem jeziku se vsebina odpre.',
            'Ti štirje seznami so seznami po izvirnem jeziku člankov, ne seznami prevodov. Članki, ki so na voljo v slovenščini, so posebej na tej strani.',
          ],
        },
        {
          heading: 'Kam vodijo povezave',
          paragraphs: [
            'Če izberete eno od štirih povezav, se odpre seznam člankov v tem jeziku. S seznama si besedilo izberete sami; vsa vsebina se prikaže v izvirnem jeziku članka.',
            'Ta stran vsebine člankov ne povzema in ne jamči, da je določena tema na voljo v vseh štirih jezikih. Vsak seznam vsebuje samo besedila, objavljena v tem jeziku.',
          ],
        },
        {
          heading: 'Koliko lahko članek služi za orientacijo',
          paragraphs: [
            'Članki so splošne informacije ob trenutku objave. Predpisi in njihova uporaba se lahko spremenijo in članek ne vsebuje vseh okoliščin vašega primera.',
            'Zato ne opirajte postopka v resnični zadevi samo na članek. Uporabite ga za pregled in svoje dokumente obravnavajte posebej z odvetnico ali odvetnikom; ta stran ni korak posveta.',
          ],
        },
      ],
    },
  },
};
