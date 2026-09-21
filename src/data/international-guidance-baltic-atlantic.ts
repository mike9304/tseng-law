import type { GuidanceLocaleContent } from './international-guidance-content';

// SCAFFOLD: lt, lv, et, ca, is — cloned from template packs; every string must be translated and the SCAFFOLD markers removed.

// SCAFFOLD(cs) locale lt
export const lithuanianGuidanceContent: GuidanceLocaleContent = {
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

// SCAFFOLD(cs) locale lv
export const latvianGuidanceContent: GuidanceLocaleContent = {
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

// SCAFFOLD(cs) locale et
export const estonianGuidanceContent: GuidanceLocaleContent = {
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

// SCAFFOLD(cs) locale ca
export const catalanGuidanceContent: GuidanceLocaleContent = {
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

// SCAFFOLD(cs) locale is
export const icelandicGuidanceContent: GuidanceLocaleContent = {
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
