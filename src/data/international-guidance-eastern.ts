/**
 * Czech guidance pack (batch 5). Same contract as the German and Italian packs:
 * page language ≠ consultation language. Consultations happen only in English,
 * Chinese, Japanese and Korean. No interpreter, reply-time, appointment, fee
 * figure, outcome, success-rate or residency promise, and no "free first
 * consultation" claim — "free" appears only inside a negation.
 *
 * Formal address: Czech vykání, with Vy/Vás/Vám/Vaše capitalised as in written
 * correspondence. Attorney Wei Tseng (曾雋崴) is female, so the pack uses the
 * feminine form advokátka and feminine verb agreement throughout; the mixed
 * team is named "advokátky a advokáti".
 *
 * Terminology follows the Taiwanese source: Taiwanese legal terms keep the
 * Chinese term in brackets on first use, exactly as the published packs do.
 */
import type { GuidanceLocaleContent } from '@/data/international-guidance-content';

export const czechGuidanceContent: GuidanceLocaleContent = {
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
    imageBandAlt: 'Tradiční tchajwanský dům typu sanheyuan (三合院) a moderní pavilon za denního světla',
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
            'Hovering International Law Firm je advokátní kancelář se sídlem na Tchaj-wanu. Pracuje podle tchajwanského práva a má pobočky v Tchaj-peji (臺北), Kao-siungu (高雄), Tchaj-čungu (臺中) a Pching-tungu (屏東). Radíme podnikům, vedeme soudní řízení a provázíme zahraniční klienty při úkonech, které je na Tchaj-wanu třeba učinit.',
            'Celý zdejší obsah je obecný. Výsledek věci závisí na skutkovém stavu, na použitelných předpisech a na okamžiku, v němž se věc posuzuje. Tyto informace nenahrazují konzultaci s advokátkou nebo advokátem nad Vašimi dokumenty.',
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
            'Při odeslání zprávy můžete shrnutí napsat ve svém jazyce. Původní text se uchová přesně tak, jak jste jej napsal(a), a automaticky se nepřekládá. Odeslaná zpráva je žádostí čekající na posouzení: není to ještě porada ani potvrzená schůzka.',
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
            'Tato agenda zahrnuje spory ze smluv, náhradu škody z protiprávního jednání a spotřebitelské spory. Práce zpravidla začíná časovým přehledem událostí, posouzením dokumentů a existujících důkazů a teprve poté následují další kroky.',
            'Průběh určují lhůty, včetně promlčecích, a úplnost důkazů. Uveďte proto známá data co nejdříve. Uschovejte smlouvy, zprávy, doklady o platbě nebo fotografie stavu na místě a zmiňte je v první zprávě.',
          ],
        },
        {
          heading: 'Manželství, rodina a dědictví',
          paragraphs: [
            'Vedeme rozvod (離婚), vypořádání majetku, výkon práv a nesení povinností vůči nezletilým dětem (未成年子女權利義務之行使或負擔), styk s dítětem (會面交往) a dědictví (繼承), a to i tehdy, nacházejí-li se strany nebo majetek v různých státech. Přeshraniční rodinné věci často vyžadují další posouzení záznamů evidence domácností (戶籍), formy listin a jejich průkaznosti na Tchaj-wanu.',
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
            'Máme pobočky v Tchaj-peji (臺北), Kao-siungu (高雄), Tchaj-čungu (臺中) a Pching-tungu (屏東). Pobočka v Kao-siungu se soustředí na korporátní agendu a vede občanskoprávní, trestní a správní spory. Pobočka v Tchaj-čungu vede stavební věci, duševní vlastnictví a věci s vazbou na Koreu a Japonsko. Pobočka v Pching-tungu byla otevřena v roce 2017 pro místní potřebu.',
            'Vedle advokátní práce působí od roku 2020 také Hovering Accounting Office, která nabízí účetnictví a daňové plánování podnikatelům a zámožným soukromým osobám.',
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
            'Po doručení Vašeho shrnutí posoudí advokátka nebo advokát obsah a poté hovoří o možném rozsahu práce, o dokumentech, které jsou ještě potřeba, a o dalších krocích. U daňových nebo účetních otázek může kancelář postupovat společně s účetním úsekem.',
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
            'Tato stránka není cenovou nabídkou a nezakládá povinnost k platbě. Odeslání žádosti prostřednictvím této stránky je rovněž bezplatné.',
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
            'Náklady závisejí na věci samé: na úsilí, počtu stran, dokumentech, lhůtách a na tom, zda již řízení probíhá. Částka stanovená předem by náklady Vaší věci neukázala. Proto nejprve stanovíme rozsah práce a náklady Vám sdělíme poté, dříve než práce začne.',
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
            'Jde pouze o posouzení, nikoli o příslib. Neslibujeme tlumočníka, službu v češtině ani v jiném jazyce mimo čtyři uvedené jazyky, ani to, že každou věc přijmeme.',
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
          question: 'Co dělat, neovládám-li žádný ze čtyř jazyků?',
          answer:
            'Při odeslání žádosti zvolte „Způsob komunikace je třeba potvrdit“. Odpovíme, abychom posoudili způsob komunikace, ale služba v jiném jazyce zaručena není. Jde o posouzení, nikoli o příslib, že můžeme pracovat v jiném jazyce.',
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
            'Uveďte lhůtu nebo datum z úřední písemnosti hned na začátku shrnutí, aby byla tato data při posouzení vidět. Tato stránka nemá nouzový kanál a nezajišťuje lhůtu k odpovědi; nesnese-li Vaše věc odkladu, měli byste souběžně hledat další cesty tam, kde se nacházíte.',
        },
      ],
    },
    privacy: {
      eyebrow: 'SOUKROMÍ',
      title: 'Osobní údaje shromažďované kontaktním formulářem',
      description:
        'Co shromažďuje kontaktní formulář v této české části, jak se nakládá s původním textem a jak nás oslovit ohledně Vašich údajů.',
      intro:
        'Tato část se týká pouze kontaktního formuláře na těchto informačních stránkách. Popisuje nakládání s údaji, nikoli technickou záruku.',
      sections: [
        {
          heading: 'Které údaje se shromažďují',
          paragraphs: [
            'Odešlete-li žádost prostřednictvím formuláře v této části, zaznamenají se tyto údaje:',
          ],
          items: [
            'Jméno, které uvedete',
            'E-mailová adresa pro odpověď',
            'Jazyk zobrazení stránky v okamžiku odeslání',
            'Jazyk, v němž jste psal(a)',
            'Jazyk konzultace, který si přejete',
            'Původní text, který jste napsal(a)',
            'Váš souhlas s odesláním žádosti',
            'Číslo podání pro dohledání žádosti',
          ],
        },
        {
          heading: 'Původní text se uchová beze změny',
          paragraphs: [
            'Váš text se uchová přesně tak, jak jste jej napsal(a), a automaticky se nepřekládá. Je-li pro vyřízení potřebný překlad, projedná se to s Vámi zvlášť.',
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
            'Tyto stránky jsou hostovány u společnosti Vercel a Vaše podání se uchovává v neveřejném objektovém úložišti této služby. E-maily se odesílají e-mailovou službou, kterou kancelář užívá.',
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
            'Výsledek věci závisí na skutkovém stavu, na použitelných předpisech a na okamžiku, v němž se věc posuzuje; dvě zdánlivě podobné situace mohou skončit různě.',
          ],
        },
        {
          heading: 'Právní rámec',
          paragraphs: [
            'Kancelář působí podle tchajwanského práva a tato stránka hovoří pouze o práci v tomto rámci.',
            'Obsah není poradenstvím podle jiného právního řádu než tchajwanského, včetně práva místa Vašeho pobytu. Týká-li se část Vaší věci jiného právního řádu, ujasníme s Vámi, jaká kvalifikovaná osoba je pro tuto část potřebná.',
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
            'Nezakládejte proto postup ve skutečné věci pouze na článku. Užijte jej k přehledu a své dokumenty projednejte zvlášť s advokátkou nebo advokátem; tato stránka není poradou.',
          ],
        },
      ],
    },
  },
};

/**
 * Hungarian guidance pack (batch 5). Hungarian has no grammatical gender, so
 * the attorney's title `ügyvéd` needs no feminine form; her gender is carried by
 * the surrounding text where the source text carries it. Formal address: Ön.
 */
export const hungarianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Magyar',
  nav: {
    home: 'Kezdőlap',
    services: 'Szolgáltatások',
    about: 'Az iroda',
    lawyers: 'Ügyvédek',
    pricing: 'Költségek',
    contact: 'Kapcsolat',
    faq: 'Kérdések',
    privacy: 'Adatvédelem',
    disclaimer: 'Jogi közlemény',
    columns: 'Cikkek',
  },
  contactCta: 'Megkeresés elküldése',
  footerNotice:
    'Ez a magyar oldal csak általános tájékoztatást ad az iroda tajvani jog szerinti munkájáról. Nem jogi tanácsadás egyedi ügyben, és egy üzenet elküldése önmagában nem hoz létre ügyvéd–ügyfél viszonyt.',
  skipLink: 'Ugrás a tartalomra',
  menuLabel: 'Oldalak áttekintése',
  languageLabel: 'Megjelenítés nyelve',
  mega: {
    services: {
      description: 'Az iroda a tajvani jog szerinti fő ügycsoportokban jár el.',
      viewAllLabel: 'Összes megtekintése',
    },
    columns: {
      description: 'Cikkek a tajvani jog gyakori kérdéseiről.',
      viewAllLabel: 'Összes megtekintése',
    },
    lawyers: {
      description: 'Az ügyvédek bemutatása és a kapcsolatfelvétel módjai.',
      viewAllLabel: 'Összes megtekintése',
    },
    pricing: {
      description: 'Ez az oldal a munka terjedelmét és a költségek tisztázását ismerteti.',
      viewAllLabel: 'Összes megtekintése',
    },
    faq: {
      description: 'Gyakori kérdések az iroda tajvani munkájáról.',
      viewAllLabel: 'Összes megtekintése',
    },
  },
  notFoundTitle: 'Az oldal nem található',
  notFoundText:
    'A keresett oldal nem létezik, vagy áthelyezték. Visszatérhet a magyar kezdőlapra, és megtekintheti az elérhető tájékoztatást.',
  backHomeLabel: 'A kezdőlapra',
  readSourceLabel: 'A cikkek listájának megnyitása az eredeti nyelven',
  home: {
    heroScrollLabel: 'Görgetés lefelé',
    heroColumnsCtaLabel: 'Cikkek megtekintése',
    servicesDetailLabel: 'Részletek megtekintése',
    servicesAssistanceBefore: 'Ha nem egyértelmű, melyik csoportba tartozik az ügye, a ',
    servicesAssistanceLinkLabel: 'Kapcsolat',
    servicesAssistanceAfter: ' oldal elmagyarázza, hogyan készítsen olyan összefoglalót, amelyet egy ügyvéd megvizsgál.',
    columnsViewAllLabel: 'Az összes cikk megtekintése',
    columnsReadMoreLabel: 'Tovább olvasom',
    columnsReviewLabel: 'Ellenőrizte Wei Tseng ügyvédnő',
    columnsOriginalLanguageBadge: 'Eredeti nyelv',
    columnsOriginalLanguageNote:
      'A következő cikkek magyarul még nem érhetők el. A lista az eredeti nyelven marad, és a megfelelő nyelvi oldalt nyitja meg; a tartalmat automatikusan nem fordítjuk le.',
    imageBandAlt: 'Hagyományos tajvani háromszárnyú udvarház (三合院) és egy modern pavilon nappali fényben',
    videoPauseLabel: 'Videó szüneteltetése',
    videoPlayLabel: 'Videó lejátszása',
    videoReplayLabel: 'Videó újrajátszása',
  },
  pages: {
    home: {
      eyebrow: 'TÁJÉKOZTATÁS',
      title: 'Jogi szolgáltatások Tajvanon – magyar nyelvű tájékoztatás',
      description:
        'Általános magyar nyelvű ismertetés a Hovering International Law Firm tajvani munkájának köréről, a tanácsadás nyelveiről és az első kapcsolatfelvételről.',
      intro:
        'A Hovering International Law Firm külföldi ügyfeleket képvisel és támogat – köztük tajvani kötődésűeket – tajvani jogi ügyekben: befektetés és cégalapítás, polgári jogviták, házasság, család és öröklés, munkajog, büntetőügyek és szellemi tulajdon. Ez a magyar rész abban segít, hogy felismerje, milyen munka tartozik a körünkbe, mit készítsen elő, és hogyan érhet el minket. Általános tájékoztatás, nem az Ön ügyére szabott jogi tanácsadás.',
      sections: [
        {
          heading: 'Mivel foglalkozunk',
          paragraphs: [
            'A Hovering International Law Firm Tajvanon bejegyzett ügyvédi iroda. Tajvani jog szerint dolgozik, irodái Tajpejben (臺北), Kaohsziungban (高雄), Tajcsungban (臺中) és Pingtungban (屏東) működnek. Vállalatoknak adunk tanácsot, peres eljárásokban járunk el, és külföldi ügyfeleket támogatunk a Tajvanon szükséges lépésekben.',
            'Az itteni tartalom mind általános. Egy ügy kimenetele a tényektől, az alkalmazandó szabályoktól és az időponttól függ. Ez a tájékoztatás nem pótolja az ügyvéddel folytatott, az Ön iratain alapuló megbeszélést.',
          ],
        },
        {
          heading: 'Az oldal nyelve és a tanácsadás nyelve nem ugyanaz',
          paragraphs: [
            'Ez az oldal magyarul készült, de az ügyvéddel folytatott tanácsadás kizárólag a négy tanácsadási nyelven zajlik: angolul, kínaiul (中文), japánul és koreaiul. A magyar tájékoztatás olvasása nem jelenti azt, hogy az ügyvéddel folytatott megbeszélés magyarul történik.',
            'Nem ígérünk tolmácsot, válaszadási határidőt és ezen az oldalon keresztül időpontot sem. Ha a négy nyelv egyikét sem tudja használni, a „Kapcsolat” oldal elmagyarázza, hogyan vizsgáljuk meg a kommunikáció módját.',
          ],
        },
        {
          heading: 'Ügycsoportok',
          paragraphs: [
            'A munka köre az alábbi hat csoportot foglalja magában. A „Szolgáltatások” oldal mindegyiket pontosabban írja le, és megjelöli, mit nem ígérünk.',
          ],
          items: [
            'Befektetés és cégalapítás Tajvanon',
            'Polgári jogviták és kártérítés',
            'Házasság, család és öröklés',
            'Munkaügyi jogviták',
            'Büntetőügyek',
            'Szellemi tulajdon: védjegy, szabadalom és szerzői jog',
          ],
        },
        {
          heading: 'Hol kezdje',
          paragraphs: [
            'Olvassa el a „Szolgáltatások” oldalt annak ellenőrzésére, hogy ügye a körünkbe tartozik-e, majd a „Költségek” és a „Kapcsolat” oldalt, hogy megtudja, hogyan rögzítjük a terjedelmet, és hogyan erősítjük meg a költségeket a munka megkezdése előtt.',
            'Az üzenet küldésekor az összefoglalót a saját nyelvén is megírhatja. Az eredeti szöveget úgy őrizzük meg, ahogyan megírta, és nem fordítjuk le automatikusan. Az elküldött üzenet vizsgálatra váró megkeresés: még nem tanácsadás és nem megerősített időpont.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'SZOLGÁLTATÁSOK',
      title: 'Milyen ügyekben járunk el',
      description:
        'Az iroda hat tajvani ügycsoportja és azok a korlátok, amelyeket érdemes elsőként ismerni.',
      intro:
        'Az alábbiakban azok a csoportok szerepelnek, amelyekben ténylegesen eljárunk, és azok a kérdések, amelyek a kezdeti szakaszban gyakran felmerülnek. A leírás abban segít, hogy megítélje, ügye a körünkbe tartozik-e; általános, és nem egyedi ügy jogi elemzése.',
      sections: [
        {
          heading: 'Befektetés és cégalapítás Tajvanon',
          paragraphs: [
            'Külföldi befektetőket és vállalkozásokat támogatunk tajvani társaság alapításában vagy működtetésében: társasági forma megválasztása, iratok előkészítése és benyújtása, tőke befizetése, banki kérdések, a székhely vizsgálata és ágazati követelmények. Támogatjuk a Tajvanon történő alapításból és működésből eredő könyvviteli és adózási feladatokat is.',
            'Az eljárás menete és a határidők a formától, a befektetőtől, az ágazattól, a banktól és a már rendelkezésre álló iratoktól függően eltérnek. A cégalapítás önmagában nem vezet tartózkodási engedélyhez (居留) vagy munkavállalási engedélyhez (工作許可): ezek külön eljárások, amelyeket az adott személy helyzete alapján bírálnak el.',
          ],
        },
        {
          heading: 'Polgári jogviták és kártérítés',
          paragraphs: [
            'Ez a csoport szerződéses jogvitákat, jogellenes károkozásból eredő kártérítést és fogyasztói jogvitákat foglal magában. A munka rendszerint az események időrendjével, az iratok és a meglévő bizonyítékok áttekintésével kezdődik, és csak ezután következnek a további lépések.',
            'A menetet a határidők – köztük az elévülés – és a bizonyítékok teljessége szabják meg. Ezért az ismert dátumokat minél előbb adja meg. Őrizze meg a szerződéseket, üzeneteket, fizetési bizonylatokat vagy a helyszínről készült fényképeket, és említse meg őket az első üzenetben.',
          ],
        },
        {
          heading: 'Házasság, család és öröklés',
          paragraphs: [
            'Válást (離婚), vagyonmegosztást, a szülői felügyeletet (未成年子女權利義務之行使或負擔), a kapcsolattartást (會面交往) és az öröklést (繼承) érintő ügyekben járunk el, akkor is, ha a felek vagy a vagyon különböző államokban vannak. A határon átnyúló családi ügyek gyakran igénylik a háztartás-nyilvántartás (戶籍), az okiratok formája és tajvani bizonyító ereje további vizsgálatát.',
            'Mivel a családi ügyekhez gyakran határidők és párhuzamos eljárások társulnak, az első összefoglalónak meg kell jelölnie a felek viszonyát, a jelenlegi lakóhelyet és a már folyamatban lévő eljárásokat.',
          ],
        },
        {
          heading: 'Munkaügyi jogviták',
          paragraphs: [
            'Ez a csoport a munkaviszony megszűnését, a tajvani jog szerinti végkielégítést (資遣費; nem azonosítható más államok hasonló jogintézményeivel), a díjazást és a munkaszerződésből (勞動契約) eredő jogvitákat foglalja magában, munkavállalói és munkáltatói oldalon egyaránt. A vizsgálat során elkülönítjük a megszűnés okát a felmondási idő, a kifizetés és a határidők kérdéseitől.',
            'A döntő iratok rendszerint a munkaszerződés, a belső munkaügyi szabályzat (工作規則), a bérjegyzékek és a felek levelezése. Ha ezek még megvannak, említse meg az összefoglalóban.',
          ],
        },
        {
          heading: 'Büntetőügyek',
          paragraphs: [
            'A nyomozási szakaszban és a bíróság előtt egyaránt képviseljük az ügyfeleket, gyanúsítottakat és vádlottakat éppúgy, mint sértetteket, és vizsgáljuk az üzleti tevékenység büntetőjogi kockázatait.',
            'A büntetőügyekben gyakran rövidek a határidők, és a szakaszok kötöttek. Ha már kapott iratot a nyomozó hatóságtól vagy a bíróságtól, adja meg időben az iraton szereplő dátumot, hogy a tartalmat a megfelelő sorrendben tudjuk megvizsgálni.',
          ],
        },
        {
          heading: 'Szellemi tulajdon',
          paragraphs: [
            'Támogatjuk a védjegyek (商標) és szabadalmak (專利) bejegyzését, a szerzői jogot és az e jogokkal kapcsolatos tajvani jogvitákat.',
            'Ebben a csoportban a lépések sorrendje dönt: az oltalom terjedelme, a bejelentés időpontja és a tényleges használat befolyásolja a választást. A bejelentés benyújtása önmagában nem jelenti, hogy annak helyt is adnak.',
          ],
        },
        {
          heading: 'A terjedelem és annak megerősítése',
          paragraphs: [
            'Az iroda tajvani jog szerint dolgozik, és a fenti csoportokba tartozó ügyekben jár el. Az egyes ügyek terjedelmét külön erősítjük meg azt követően, hogy egy ügyvéd megvizsgálta az üzenetét.',
            'A tartózkodási jogállást, a munkavállalási engedélyt és a hasonló kérdéseket az iratok és az adott személy helyzete alapján ítélik meg, nem az állampolgárság alapján. Ha ügyének egy része ezeket érinti, jelezze a kapcsolatfelvételkor. Ez az oldal nem ígér eredményt és válaszadási határidőt sem.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'AZ IRODA',
      title: 'A Hovering International Law Firmről',
      description:
        'Alapadatok erről a tajvani ügyvédi irodáról, annak irodáiról és a külföldi felekkel végzett munkáról.',
      intro:
        'A Hovering International Law Firm tajvani ügyvédi iroda. Ügyvédei vállalatoknak adnak tanácsot, és peres eljárásokban is eljárnak. Ez a rész az iroda létrejöttét, székhelyeit és a külföldi felekkel végzett munkát mutatja be.',
      sections: [
        {
          heading: 'Alapítás és felépítés',
          paragraphs: [
            'A Hovering International Law Firmet (昊鼎國際法律事務所) 2016-ban a National Taiwan Universityn (國立臺灣大學) végzett ügyvédek alapították. A kínai név, a 昊鼎, a 昊 („tágas ég”) írásjegyet köti össze a 鼎 („szilárd alap”) írásjeggyel, és az iroda alapítása óta követett irányát fejezi ki.',
            'Irodáink Tajpejben (臺北), Kaohsziungban (高雄), Tajcsungban (臺中) és Pingtungban (屏東) működnek. A kaohsziungi iroda a vállalatirányításra összpontosít, és polgári, büntető- és közigazgatási jogvitákban jár el. A tajcsungi iroda építési ügyekkel, szellemi tulajdonnal, valamint koreai és japán kötődésű ügyekkel foglalkozik. A pingtungi irodát 2017-ben nyitottuk a helyi igények miatt.',
            'Az ügyvédi munka mellett 2020 óta működik a Hovering Accounting Office is, amely könyvvitelt és adótervezést kínál vállalkozóknak és vagyonos magánszemélyeknek.',
          ],
        },
        {
          heading: 'Munka külföldi felekkel',
          paragraphs: [
            'A határon átnyúló munka cégalapítást, vízumokat, védjegy- és szabadalmi bejelentéseket, jogi kockázatvizsgálatot és vállalati adótanácsadást foglal magában. A tajcsungi iroda különösen építési ügyekkel, szellemi tulajdonnal, valamint koreai és japán kötődésű ügyekkel foglalkozik. Wei Tseng ügyvédnő (曾雋崴) koreai, japán és további nemzetközi ügyfeleket képvisel a megjelölt csoportokban.',
            'Hogy elvállalhatunk-e egy ügyet, a tartalomtól és a kommunikáció nyelvétől függ. Ha ügye a megjelölt csoportokba tartozik, és a négy tanácsadási nyelv valamelyikén megtárgyalható, összefoglalót küldhet vizsgálatra.',
          ],
        },
        {
          heading: 'Amikor megkeres minket',
          paragraphs: [
            'Az összefoglaló beérkezése után egy ügyvéd megvizsgálja a tartalmat, majd beszél a munka lehetséges terjedelméről, a még szükséges iratokról és a következő lépésekről. Adó- vagy könyvviteli kérdésekben az iroda a könyvviteli részleggel együtt dolgozhat.',
            'Minden ügy kimenetele a tényektől és a rendelkezésre álló iratoktól függ; eredményt nem ígérünk. Ha helyzetére kötelező erejű választ kíván, az iratokat a négy tanácsadási nyelv valamelyikén kell megtárgyalni egy ügyvéddel.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ÜGYVÉDEK',
      title: 'A Hovering nemzetközi csapata',
      description: 'A Hovering ügyvédeinek, a működési vezetőnek és a társult könyvvizsgálónak a bemutatása.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'KÖLTSÉGEK',
      title: 'Hogyan rögzítjük a munka terjedelmét és a költségeket',
      description:
        'A sorrend ismertetése: előbb a munka terjedelme, majd a költségek megerősítése, és hogy ez az oldal miért nem tartalmaz árlistát.',
      intro:
        'Ez az oldal azt ismerteti, hogyan alakulnak a költségek, nem pedig azok összegét. Az összeg az adott ügy munkaterjedelmétől függ, és csak akkor értelmezhető, ha ez a terjedelem világos.',
      sections: [
        {
          heading: 'Először a munka terjedelmét rögzítjük',
          paragraphs: [
            'Az azonos típusú ügyek nagyon eltérő ráfordítást igényelhetnek a felek számától, a rendelkezésre álló iratoktól, a betartandó határidőktől és attól függően, hogy megindult-e már eljárás. Ezért az első lépés mindig annak rögzítése, mi tartozik a munkába és mi nem.',
            'Az elején küldött összefoglaló ennek a terjedelemnek az alapja. Minél világosabban írja le az eseményeket, a kérését és a határidőket, annál pontosabban határozható meg a terjedelem.',
          ],
        },
        {
          heading: 'A költségeket a munka megkezdése előtt erősítjük meg',
          paragraphs: [
            'Ha a munka terjedelme világos, a költségek összegét és számítási módját a munka megkezdése előtt megbeszéljük és megerősítjük Önnel. Ha a terjedelem közben változik, azt újból meg kell erősíteni.',
            'Ez az oldal nem árajánlat, és nem keletkeztet fizetési kötelezettséget.',
          ],
        },
        {
          heading: 'A tanácsadás díjköteles lehet',
          paragraphs: [
            'Az ügyvéddel folytatott tanácsadás díjköteles szolgáltatás lehet. Ez az oldal nem állítja, hogy az első beszélgetés ingyenes, és egyetlen része sem értelmezhető így.',
            'Ha a tanácsadás díjköteles, annak összegét és a fizetés módját a tanácsadás előtt közöljük.',
          ],
        },
        {
          heading: 'Miért nem szerepelnek itt díjszabások',
          paragraphs: [
            'A költségek magától az ügytől függenek: a ráfordítástól, a felek számától, az iratoktól, a határidőktől és attól, hogy folyik-e már eljárás. Egy előre rögzített szám nem mutatná meg az Ön ügyének költségeit. Ezért előbb a munka terjedelmét rögzítjük, és a költségeket azután, a munka megkezdése előtt közöljük.',
            'A munkadíjon felül bírósági, hatósági vagy harmadik személyeknél felmerülő költségek keletkezhetnek. Ezek a munkadíjtól elkülönülnek, és az adott eljárástól függenek.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KAPCSOLAT',
      title: 'Hogyan érheti el az irodát',
      description:
        'Az oldal nyelve, a tanácsadás nyelvei, a teendő akkor, ha a négy nyelv egyikét sem tudja használni, és amit ez az oldal nem ígér.',
      intro:
        'Mielőtt írna nekünk, különítse el az alábbi három dolgot. Gyakran keverednek, pedig mást jelentenek.',
      sections: [
        {
          heading: 'Három dolog, amelyet külön kell tartani',
          paragraphs: [
            'Az oldal megjelenítési nyelve, az ügyvéddel folytatott tanácsadás nyelve és az a nyelv, amelyen ír, három különböző dolog.',
          ],
          items: [
            'Az oldal nyelve: ez a tájékoztatás magyarul készült.',
            'A tanácsadás nyelve: a tanácsadás angolul, kínaiul (中文), japánul és koreaiul zajlik.',
            'Az Ön írásának nyelve: az összefoglalót a saját nyelvén írhatja; az eredeti szöveg változatlanul megmarad.',
          ],
        },
        {
          heading: 'Ha a négy tanácsadási nyelv egyikét sem tudja használni',
          paragraphs: [
            'A kapcsolatfelvételi űrlapon választhatja azt, hogy „A kommunikáció módját meg kell erősíteni”. Válaszolunk, hogy megvizsgáljuk a kommunikáció járható módját, ha van ilyen; más nyelvű szolgáltatás nem garantált, és válaszadási határidőt nem ígérünk.',
            'Ez csak vizsgálati lépés, nem ígéret. Nem ígérünk tolmácsot, magyar vagy a négy megjelölt nyelven kívüli más nyelvű szolgáltatást, és azt sem, hogy minden ügyet elvállalunk.',
          ],
        },
        {
          heading: 'Mit tartalmazzon az első üzenet',
          paragraphs: [
            'Adja meg, mi történt, milyen segítségre van szüksége, milyen kötődése van az ügynek Tajvanhoz, és a határidőt, ha ismer ilyet. Ha már kapott bírósági vagy hatósági iratot, adja meg az iraton szereplő dátumot.',
            'A kezdeti szakaszban még nem kell útlevélszámot, okmányszámot, bankszámlaadatokat, egészségügyi dokumentációt vagy a bizonyítékok összességét elküldenie. Várja meg az ügyvéd útmutatását, és az érzékeny iratokat csak azután, biztonságos úton küldje el.',
          ],
        },
        {
          heading: 'Amit ez az oldal nem ígér',
          paragraphs: [
            'Nem ígérünk válaszadási határidőt, ezen az oldalon keresztül nem erősítünk meg időpontot, nem ígérünk meghatározott ügyvédet, és tolmácsot sem biztosítunk. Az írásbeli fordítás más kérdés: az üzenetét automatikusan nem fordítjuk le.',
            'Ha megkeresést küld, a tartalmát megőrizzük, és az vizsgálatra vár. Ha egy idő után nem kap választ, újra írhat a kapcsolatfelvételi oldalon megadott e-mail-címre.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'KÉRDÉSEK',
      title: 'Gyakori kérdések',
      description:
        'Magyarázatok a munka köréről, az előkészületekről, a nyelvekről, a költségekről és arról, mit jelent egy elküldött megkeresés.',
      intro:
        'Az alábbi kérdésekre általános tájékoztatás szintjén válaszolunk. Az Ön ügyére szabott válasz csak azután lehetséges, hogy egy ügyvéd megvizsgálta az iratokat.',
      sections: [
        {
          heading: 'Hogyan használja ezt a részt',
          paragraphs: [
            'Ha nem talál választ a saját helyzetére, a válasz rendszerint az ügy konkrét tényeitől függ. Ezeket a tényeket írja bele az összefoglalóba, ahelyett hogy a választ vezetné le ebből az oldalból.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Milyen ügyekben jár el az iroda?',
          answer:
            'Hat ügycsoportban járunk el: befektetés és cégalapítás Tajvanon, polgári jogviták és kártérítés, házasság, család és öröklés, munkaügyi jogviták, büntetőügyek és szellemi tulajdon. Hogy egy ügyet elvállalunk-e, a tartalom vizsgálata után dől el.',
        },
        {
          question: 'Mit készítsek elő a kapcsolatfelvétel előtt?',
          answer:
            'Készítsen rövid összefoglalót az eseményekről, a kéréséről, a Tajvanhoz fűződő kapcsolatról és a határidőről, ha van ilyen. Ha már van bírósági vagy hatósági irat, adja meg a dátumot. Ebben a szakaszban még nem kell személyazonosító okmányokat vagy a bizonyítékok összességét elküldenie.',
        },
        {
          question: 'Lehetséges magyar nyelvű tanácsadás?',
          answer:
            'Nem. Ez a tájékoztatás magyarul készült, de az ügyvéddel folytatott tanácsadás kizárólag angolul, kínaiul (中文), japánul és koreaiul zajlik. Tolmácsot sem ígérünk. Az írásbeli fordítás más kérdés: az eredeti szöveget úgy őrizzük meg, ahogyan megírta, és nem fordítjuk le automatikusan.',
        },
        {
          question: 'Mi a teendő, ha a négy nyelv egyikét sem tudom használni?',
          answer:
            'A megkeresés küldésekor válassza azt, hogy „A kommunikáció módját meg kell erősíteni”. Válaszolunk, hogy megvizsgáljuk a kommunikáció módját, de más nyelvű szolgáltatás nem garantált. Ez vizsgálati lépés, nem ígéret arra, hogy más nyelven tudunk dolgozni.',
        },
        {
          question: 'Mi történik a magyar nyelvű szövegemmel?',
          answer:
            'Az eredeti szöveget úgy őrizzük meg, ahogyan megírta, és nem fordítjuk le automatikusan. Ha szükséges, a további kommunikáció nyelvét megerősítjük Önnel.',
        },
        {
          question: 'Az elküldött megkeresés már tanácsadásnak számít?',
          answer:
            'Nem. Az elküldött megkeresés ügyvédi vizsgálatra vár. Nem jogi állásfoglalás, nem megerősített időpont, és az elküldés önmagában nem hoz létre ügyvéd–ügyfél viszonyt.',
        },
        {
          question: 'Hogyan számítják a költségeket?',
          answer:
            'Először a munka terjedelmét rögzítjük, majd a költségek összegét és számítási módját a munka megkezdése előtt megerősítjük Önnel. Ez az oldal nem ad meg összegeket, és nem állítja, hogy az első beszélgetés ingyenes.',
        },
        {
          question: 'Mi a teendő, ha az ügyem nagyon sürgős?',
          answer:
            'A határidőt vagy a hivatalos iraton szereplő dátumot írja az összefoglaló elejére, hogy ezek a dátumok a vizsgálatkor láthatók legyenek. Ennek az oldalnak nincs sürgősségi csatornája, és nem biztosít válaszadási határidőt; ha ügye nem tűr halasztást, párhuzamosan keressen más utakat a lakóhelyén.',
        },
      ],
    },
    privacy: {
      eyebrow: 'ADATVÉDELEM',
      title: 'A kapcsolatfelvételi űrlapon gyűjtött adatok',
      description:
        'Mit gyűjt a kapcsolatfelvételi űrlap ebben a magyar részben, hogyan kezeljük az eredeti szöveget, és hogyan érhet el minket az adataival kapcsolatban.',
      intro:
        'Ez a rész csak az e tájékoztató oldalakon található kapcsolatfelvételi űrlapra vonatkozik. Az adatkezelést írja le, nem műszaki garanciát.',
      sections: [
        {
          heading: 'Milyen adatokat gyűjtünk',
          paragraphs: [
            'Ha ebben a részben az űrlapon keresztül megkeresést küld, a következő adatokat rögzítjük:',
          ],
          items: [
            'Az Ön által megadott név',
            'A válaszhoz használt e-mail-cím',
            'Az oldal megjelenítési nyelve a küldés pillanatában',
            'Az a nyelv, amelyen írt',
            'Az Ön által kívánt tanácsadási nyelv',
            'Az eredeti szöveg, amelyet írt',
            'Az Ön hozzájárulása a megkeresés elküldéséhez',
            'Egy iktatószám a megkeresés visszakereséséhez',
          ],
        },
        {
          heading: 'Az eredeti szöveg változatlanul marad',
          paragraphs: [
            'A szövegét pontosan úgy őrizzük meg, ahogyan megírta, és nem fordítjuk le automatikusan. Ha az ügyintézéshez fordítás szükséges, azt külön megbeszéljük Önnel.',
            'Mivel az eredeti szöveget megőrizzük, a kezdeti szakaszban ne írja le azt, ami még nem szükséges, például az útlevélszámot, az okmányszámot vagy a bankszámlaadatokat.',
          ],
        },
        {
          heading: 'A tárolás helye és a hozzáférés',
          paragraphs: [
            'A küldemény tartalmát nyilvánosan nem hozzáférhető helyen tároljuk. Csak az irodán belüli jogosult személyek férhetnek hozzá, a megkeresés intézése céljából.',
            'Ez az oldal nem ad feltétlen biztonsági garanciát. Egyetlen továbbítási út és egyetlen tárolási hely sem teljesen biztonságos; az érzékeny iratokat ezért csak az ügyvéd külön útmutatása után küldje el.',
          ],
        },
        {
          heading: 'A felhasználás célja',
          paragraphs: [
            'Az elküldött adatok a megkeresés vizsgálatát, az Önnek adott választ, a kommunikáció módjának tisztázását és – ha a munkát elvállaljuk – az ügyintézést szolgálják.',
            'Az adatokat külön hozzájárulás nélkül nem használjuk marketingre.',
          ],
        },
        {
          heading: 'Értesítés és iktatószám',
          paragraphs: [
            'Ha a megkeresés elküldése sikerül, a rendszer értesíti az irodát. Ha ez az értesítés nem jut el az irodához, a szövege akkor is tárolva marad, és nem vész el.',
            'Az iktatószám a megkeresés visszakeresésére szolgál a nyilvántartásunkban. A mentés után jelenik meg; új kapcsolatfelvételkor megadhatja.',
          ],
        },
        {
          heading: 'Az Ön jogai és a kapcsolatfelvétel útja',
          paragraphs: [
            'Kérheti adataihoz a hozzáférést, azok helyesbítését vagy törlését, illetve visszavonhatja a hozzájárulást a kapcsolatfelvételi oldalon megadott e-mail-címen. Ha jogszabályi vagy eljárási megőrzési kötelezettség áll fenn, elmagyarázzuk a korlátozást.',
            'Ez az oldal nem ad meg rögzített megőrzési időt, mert a tényleges időtartam az ügy további alakulásától és a kapcsolódó kötelezettségektől függ. Ha korábbi törlést kíván, jelezze a kapcsolatfelvételkor.',
          ],
        },
        {
          heading: 'Tárolási hely és szolgáltatók',
          paragraphs: [
            'Ezt a webhelyet a Vercel üzemelteti, és a küldeménye e szolgáltatás nem nyilvános tárhelyén marad. Az e-maileket az iroda által használt levelezőszolgáltatáson keresztül küldjük.',
            'Egyes szolgáltatók kiszolgálói Tajvanon kívül is lehetnek, így adatai ott is tárolhatók és kezelhetők. Ha a tárolás célja teljesült, az adatokat késedelem nélkül töröljük; azok az adatok, amelyeket az alkalmazandó szabályok szerint meg kell őrizni, erre az időre megmaradnak. A személyes adatokkal kapcsolatos kéréseket a wei@hoveringlaw.com.tw címen fogadjuk.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'JOGI KÖZLEMÉNY',
      title: 'Az oldalon szereplő tájékoztatás köre és korlátai',
      description:
        'A tájékoztatás általános jellege, a jogi keret és az ügyvéd–ügyfél viszony létrejöttének feltételei.',
      intro:
        'Ez a rész tisztázza, mire jók ezek a magyar tájékoztató oldalak, és mire nem.',
      sections: [
        {
          heading: 'Csak általános tájékoztatás',
          paragraphs: [
            'Ezeknek az oldalaknak a tartalma általános tájékoztatásként készült. Nem jogi tanácsadás az Ön ügyében, és nem pótolja iratainak vizsgálatát.',
            'Egy ügy kimenetele a tényektől, az alkalmazandó szabályoktól és az időponttól függ; két látszólag hasonló helyzet eltérően végződhet.',
          ],
        },
        {
          heading: 'Jogi keret',
          paragraphs: [
            'Az iroda tajvani jog szerint működik, és ez az oldal csak az e keretben végzett munkáról szól.',
            'A tartalom nem tanácsadás a tajvanitól eltérő más jogrend szerint, ideértve az Ön lakóhelyének jogát is. Ha ügyének egy része más jogrendet érint, tisztázzuk Önnel, milyen szakember szükséges ahhoz a részhez.',
          ],
        },
        {
          heading: 'Az ügyvéd–ügyfél viszony nem jön létre magától',
          paragraphs: [
            'Ennek az oldalnak az elolvasása, egy űrlap vagy e-mail elküldése önmagában nem hoz létre ügyvéd–ügyfél viszonyt.',
            'Ez a viszony csak azt követően jön létre, hogy az ügyet megvizsgálták, és mindkét fél megerősítette a munka elvállalását.',
          ],
        },
        {
          heading: 'Nincs ígéret az eredményre',
          paragraphs: [
            'Ennek az oldalnak egyetlen része sem ígéret egy ügy kimenetelére, egy bejelentés vagy kérelem elfogadására, illetve a tartózkodási és munkavállalási jogállásra.',
            'A külső hivatkozások tájékozódást szolgálnak; harmadik személyek tartalmának sem helyességét, sem naprakészségét nem ígérjük.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'CIKKEK',
      title: 'Cikkek a tajvani jogról',
      description:
        'Magyar nyelvű cikkek a tajvani jog gyakori kérdéseiről. A tartalom a közzététel időpontjában érvényes általános tájékoztatás, nem az Ön ügyére szabott jogi tanácsadás.',
      intro:
        'Az iroda cikkeket tesz közzé a tajvani jog gyakori kérdéseiről. A magyarul elérhető cikkek ezen az oldalon vannak; mellettük négy hivatkozás található, amelyek egy-egy eredeti nyelvű cikklistát nyitnak meg.',
      sections: [
        {
          heading: 'Négy lista, nyelvek szerint',
          paragraphs: [
            'Ez a rész négy hivatkozást tartalmaz: a koreai, a kínai, az angol és a japán nyelvű cikkek listáját. Mindegyik hivatkozás megjelöli a lista nyelvét, így előre tudja, milyen nyelven nyílik meg a tartalom.',
            'Ez a négy lista a cikkek eredeti nyelve szerinti lista, nem a fordításoké. A magyarul elérhető cikkek külön, ezen az oldalon találhatók.',
          ],
        },
        {
          heading: 'Hová vezetnek a hivatkozások',
          paragraphs: [
            'Ha a négy hivatkozás egyikét választja, az adott nyelv cikklistája nyílik meg. A listából Ön választja ki a szöveget; a teljes tartalom a cikk eredeti nyelvén jelenik meg.',
            'Ez az oldal nem foglalja össze a cikkek tartalmát, és nem garantálja, hogy egy téma mind a négy nyelven elérhető. Minden lista csak az adott nyelven közzétett szövegeket tartalmazza.',
          ],
        },
        {
          heading: 'Mennyiben szolgálhat egy cikk tájékozódásul',
          paragraphs: [
            'A cikkek a közzététel időpontjában érvényes általános tájékoztatást adnak. A szabályok és azok alkalmazása változhat, és egy cikk nem tartalmazza az Ön ügyének minden körülményét.',
            'Ezért valós ügyben ne alapozzon eljárást pusztán egy cikkre. Használja áttekintésre, és iratait külön beszélje meg egy ügyvéddel; ez az oldal nem helyettesíti a tanácsadást.',
          ],
        },
      ],
    },
  },
};

/**
 * Romanian guidance pack (batch 5). Formal address: dumneavoastră. Attorney Wei
 * Tseng is female, so the pack uses `avocata` and feminine agreement; the mixed
 * team is named "avocatele și avocații".
 */
export const romanianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Română',
  nav: {
    home: 'Acasă',
    services: 'Servicii',
    about: 'Cabinetul',
    lawyers: 'Avocați',
    pricing: 'Costuri',
    contact: 'Contact',
    faq: 'Întrebări',
    privacy: 'Date personale',
    disclaimer: 'Note juridice',
    columns: 'Articole',
  },
  contactCta: 'Trimiteți o solicitare',
  footerNotice:
    'Această pagină în limba română conține doar informații generale despre activitatea cabinetului potrivit dreptului taiwanez. Nu este consultanță juridică pentru un caz concret, iar trimiterea unui mesaj nu creează prin ea însăși o relație între avocat și client.',
  skipLink: 'Treceți la conținut',
  menuLabel: 'Lista paginilor',
  languageLabel: 'Limba de afișare',
  mega: {
    services: {
      description: 'Cabinetul acoperă principalele domenii de practică din dreptul taiwanez.',
      viewAllLabel: 'Vedeți toate',
    },
    columns: {
      description: 'Articole despre întrebări frecvente din dreptul taiwanez.',
      viewAllLabel: 'Vedeți toate',
    },
    lawyers: {
      description: 'Prezentarea avocaților și a modalităților de contact.',
      viewAllLabel: 'Vedeți toate',
    },
    pricing: {
      description: 'Această pagină explică obiectul mandatului și modul de clarificare a onorariilor.',
      viewAllLabel: 'Vedeți toate',
    },
    faq: {
      description: 'Întrebări frecvente despre activitatea cabinetului în Taiwan.',
      viewAllLabel: 'Vedeți toate',
    },
  },
  notFoundTitle: 'Pagina nu a fost găsită',
  notFoundText:
    'Pagina căutată nu există sau a fost mutată. Vă puteți întoarce la pagina de start în limba română pentru a vedea informațiile disponibile.',
  backHomeLabel: 'La pagina de start',
  readSourceLabel: 'Deschideți lista articolelor în limba originală',
  home: {
    heroScrollLabel: 'Derulați în jos',
    heroColumnsCtaLabel: 'Vedeți articolele',
    servicesDetailLabel: 'Vedeți detaliile',
    servicesAssistanceBefore: 'Dacă nu este clar din ce domeniu face parte cazul dumneavoastră, pagina ',
    servicesAssistanceLinkLabel: 'Contact',
    servicesAssistanceAfter: ' explică cum să alcătuiți un rezumat pe care un avocat îl va examina.',
    columnsViewAllLabel: 'Vedeți toate articolele',
    columnsReadMoreLabel: 'Citiți mai departe',
    columnsReviewLabel: 'Verificat de avocata Wei Tseng',
    columnsOriginalLanguageBadge: 'Limba originală',
    columnsOriginalLanguageNote:
      'Articolele următoare nu sunt încă disponibile în limba română. Lista rămâne în limba originală și deschide pagina în limba respectivă; conținutul nu este tradus automat.',
    imageBandAlt: 'Ansamblu tradițional taiwanez sanheyuan (三合院) și un pavilion modern în lumina zilei',
    videoPauseLabel: 'Opriți videoclipul',
    videoPlayLabel: 'Redați videoclipul',
    videoReplayLabel: 'Redați din nou videoclipul',
  },
  pages: {
    home: {
      eyebrow: 'INFORMAȚII',
      title: 'Servicii juridice în Taiwan — informații în limba română',
      description:
        'Explicații generale în limba română despre aria de lucru a Hovering International Law Firm în Taiwan, despre limbile de consultanță și despre primul contact.',
      intro:
        'Hovering International Law Firm asistă clienți din străinătate, inclusiv pe cei cu legătură cu Taiwanul, în chestiuni de drept taiwanez: investiții și înființare de societăți, litigii civile, căsătorie, familie și succesiuni, dreptul muncii, cauze penale și proprietate intelectuală. Această parte în limba română vă ajută să recunoașteți ce cauze intră în aria noastră, ce să pregătiți și cum ne puteți contacta. Sunt informații generale, nu consultanță juridică pentru cazul dumneavoastră.',
      sections: [
        {
          heading: 'Cu ce ne ocupăm',
          paragraphs: [
            'Hovering International Law Firm este un cabinet de avocatură stabilit în Taiwan. Lucrează potrivit dreptului taiwanez și are birouri în Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) și Pingtung (屏東). Cabinetul consiliază întreprinderi, susține cauze în fața instanțelor și asistă clienți din străinătate în pașii necesari în Taiwan.',
            'Tot conținutul de aici este general. Rezultatul unei cauze depinde de fapte, de normele aplicabile și de momentul respectiv. Aceste informații nu înlocuiesc discuția cu un avocat asupra documentelor dumneavoastră.',
          ],
        },
        {
          heading: 'Limba paginii și limba consultanței nu sunt același lucru',
          paragraphs: [
            'Această pagină este scrisă în limba română, dar consultanța cu un avocat se desfășoară numai în cele patru limbi de consultanță: engleză, chineză (中文), japoneză și coreeană. Citirea informațiilor în limba română nu înseamnă că discuția cu avocatul va avea loc în limba română.',
            'Nu promitem interpret, termen de răspuns sau programare prin această pagină. Dacă nu puteți folosi niciuna dintre cele patru limbi, pagina „Contact” explică modul în care căutăm o cale de comunicare.',
          ],
        },
        {
          heading: 'Domeniile de practică',
          paragraphs: [
            'Aria de lucru cuprinde următoarele șase domenii. Pagina „Servicii” descrie fiecare domeniu mai exact și arată ce nu se promite.',
          ],
          items: [
            'Investiții și înființare de societăți în Taiwan',
            'Litigii civile și despăgubiri',
            'Căsătorie, familie și succesiuni',
            'Litigii de muncă',
            'Cauze penale',
            'Proprietate intelectuală: mărci, brevete și drept de autor',
          ],
        },
        {
          heading: 'De unde să începeți',
          paragraphs: [
            'Citiți pagina „Servicii” pentru a verifica dacă situația dumneavoastră intră în aria noastră, apoi „Costuri” și „Contact”, pentru a afla cum se stabilește obiectul mandatului și cum se confirmă onorariile înainte de începerea lucrării.',
            'La trimiterea mesajului puteți scrie rezumatul în limba dumneavoastră. Textul original se păstrează exact așa cum l-ați scris și nu este tradus automat. Un mesaj trimis este o solicitare care așteaptă examinarea: nu este încă nici consultanță, nici programare confirmată.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'SERVICII',
      title: 'Ce cauze tratăm',
      description:
        'Cele șase domenii de practică ale cabinetului în Taiwan și limitele pe care este util să le cunoașteți mai întâi.',
      intro:
        'Mai jos sunt domeniile pe care le tratăm efectiv și întrebările care apar cel mai des în faza inițială. Expunerea vă ajută să apreciați dacă situația dumneavoastră intră în aria noastră; este generală și nu constituie o analiză juridică a unui dosar anume.',
      sections: [
        {
          heading: 'Investiții și înființare de societăți în Taiwan',
          paragraphs: [
            'Asistăm investitori și întreprinderi străine la înființarea sau conducerea unei societăți în Taiwan: alegerea formei juridice, pregătirea și depunerea documentelor, vărsarea capitalului, chestiuni bancare, examinarea sediului și cerințele specifice domeniului. Sprijinim și contabilitatea și impozitele care decurg din înființarea și funcționarea în Taiwan.',
            'Parcursul și termenele diferă după formă, investitor, domeniu, bancă și după documentele deja disponibile. Înființarea unei societăți nu duce prin ea însăși la un drept de ședere (居留) sau la o autorizație de muncă (工作許可): acestea sunt proceduri distincte, apreciate după situația persoanei.',
          ],
        },
        {
          heading: 'Litigii civile și despăgubiri',
          paragraphs: [
            'Acest domeniu cuprinde litigii din contracte, despăgubiri din fapte ilicite și litigii cu consumatorii. Lucrarea începe de regulă cu o cronologie, cu examinarea documentelor și a probelor existente, iar abia apoi urmează pașii următori.',
            'Termenele, inclusiv prescripția, și caracterul complet al probelor determină parcursul. De aceea indicați cât mai devreme datele cunoscute. Păstrați contractele, mesajele, dovezile de plată sau fotografiile situației de la fața locului și menționați-le în primul mesaj.',
          ],
        },
        {
          heading: 'Căsătorie, familie și succesiuni',
          paragraphs: [
            'Tratăm divorțul (離婚), împărțirea bunurilor, autoritatea părintească asupra copiilor minori (未成年子女權利義務之行使或負擔), legăturile personale (會面交往) și succesiunile (繼承), inclusiv atunci când părțile sau bunurile se află în state diferite. Cauzele de familie transfrontaliere cer adesea o examinare suplimentară a evidenței populației (戶籍), a formei înscrisurilor și a puterii lor doveditoare în Taiwan.',
            'Întrucât cauzele de familie aduc adesea termene și proceduri paralele, primul rezumat ar trebui să arate raportul dintre părți, domiciliul actual și procedurile deja în curs.',
          ],
        },
        {
          heading: 'Litigii de muncă',
          paragraphs: [
            'Acest domeniu cuprinde încetarea raportului de muncă, indemnizația potrivit dreptului taiwanez (資遣費; a nu se confunda cu instituții asemănătoare din alte state), remunerația și litigiile din contractul de muncă (勞動契約), atât din partea salariatului, cât și a angajatorului. La examinare deosebim motivul încetării de chestiunile privind preavizul, plata și termenele.',
            'Documentele hotărâtoare sunt de obicei contractul de muncă, regulamentul intern (工作規則), fluturașii de salariu și corespondența părților. Dacă le mai aveți, menționați acest lucru în rezumat.',
          ],
        },
        {
          heading: 'Cauze penale',
          paragraphs: [
            'Reprezentăm, în faza de urmărire penală și în fața instanței, atât suspecți sau inculpați, cât și persoane vătămate, și apreciem riscurile penale ale activității de afaceri.',
            'Cauzele penale au adesea termene scurte și etape fixe. Dacă ați primit deja un act de la organul de urmărire penală sau de la instanță, indicați din timp data de pe act, pentru ca conținutul să fie examinat în ordinea potrivită.',
          ],
        },
        {
          heading: 'Proprietate intelectuală',
          paragraphs: [
            'Sprijinim înregistrarea mărcilor (商標) și a brevetelor (專利), dreptul de autor și litigiile privind aceste drepturi în Taiwan.',
            'În acest domeniu hotărăște ordinea pașilor: întinderea protecției, momentul depunerii și folosirea efectivă influențează alegerea. Depunerea unei cereri nu înseamnă prin ea însăși că aceasta va fi admisă.',
          ],
        },
        {
          heading: 'Obiectul mandatului și confirmarea lui',
          paragraphs: [
            'Cabinetul lucrează potrivit dreptului taiwanez și tratează cauze din domeniile arătate mai sus. Obiectul fiecărui mandat se confirmă separat, după ce un avocat a examinat mesajul dumneavoastră.',
            'Statutul de ședere, autorizația de muncă și chestiunile asemănătoare se apreciază după documente și după situația persoanei, nu după cetățenie. Dacă o parte a cauzei dumneavoastră atinge aceste puncte, arătați acest lucru la contactare. Această pagină nu promite un rezultat și niciun termen de răspuns.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'CABINETUL',
      title: 'Despre Hovering International Law Firm',
      description:
        'Date de bază despre acest cabinet de avocatură taiwanez, despre birourile sale și despre lucrul cu părți străine.',
      intro:
        'Hovering International Law Firm este un cabinet de avocatură din Taiwan. Avocații cabinetului lucrează de la consultanța pentru întreprinderi până la procedura în fața instanței. Această parte descrie înființarea cabinetului, sediile și lucrul cu părți străine.',
      sections: [
        {
          heading: 'Înființare și structură',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) a fost înființat în 2016 de avocați care au studiat la National Taiwan University (國立臺灣大學). Denumirea chineză 昊鼎 unește caracterul 昊 („cer larg”) cu 鼎 („temelie solidă”) și descrie orientarea cabinetului încă de la înființare.',
            'Avem birouri în Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) și Pingtung (屏東). Biroul din Kaohsiung se concentrează pe consultanța pentru conducerea societăților și tratează litigii civile, penale și administrative. Biroul din Taichung tratează cauze din construcții, proprietate intelectuală și cauze cu legătură cu Coreea și Japonia. Biroul din Pingtung a fost deschis în 2017 pentru nevoile locale.',
            'Pe lângă activitatea de avocatură există din 2020 și Hovering Accounting Office, care oferă contabilitate și planificare fiscală întreprinzătorilor și persoanelor fizice înstărite.',
          ],
        },
        {
          heading: 'Lucrul cu părți străine',
          paragraphs: [
            'Activitatea transfrontalieră cuprinde înființarea de societăți, vize, depuneri de mărci și brevete, examinarea riscului juridic și consultanță fiscală pentru întreprinderi. Biroul din Taichung tratează îndeosebi cauze din construcții, proprietate intelectuală și cauze cu legătură cu Coreea și Japonia. Avocata Wei Tseng (曾雋崴) asistă clienți din Coreea, din Japonia și alți clienți internaționali în domeniile arătate.',
            'Preluarea unei cauze depinde de conținut și de limba comunicării. Dacă situația dumneavoastră intră în domeniile arătate și poate fi discutată într-una dintre cele patru limbi de consultanță, puteți trimite un rezumat spre examinare.',
          ],
        },
        {
          heading: 'Când ne contactați',
          paragraphs: [
            'După sosirea rezumatului dumneavoastră, un avocat examinează conținutul și vorbește apoi despre obiectul posibil al mandatului, despre documentele încă necesare și despre pașii următori. Pentru chestiuni fiscale sau contabile, cabinetul poate lucra împreună cu Hovering Accounting Office, în același demers.',
            'Rezultatul fiecărei cauze depinde de fapte și de documentele disponibile; nu promitem un rezultat. Dacă aveți nevoie de un răspuns pe care să vă puteți întemeia în situația dumneavoastră, documentele trebuie discutate cu un avocat într-una dintre cele patru limbi de consultanță.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'AVOCAȚI',
      title: 'Echipa internațională Hovering',
      description: 'Profilurile avocaților, ale conducerii operaționale și ale cabinetului de contabilitate asociat Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'COSTURI',
      title: 'Cum se stabilesc obiectul mandatului și onorariile',
      description:
        'Explicarea ordinii: mai întâi obiectul mandatului, apoi confirmarea onorariilor, și de ce această pagină nu cuprinde o listă de prețuri.',
      intro:
        'Această pagină explică modul în care se stabilesc costurile, nu cuantumul lor. Cuantumul depinde de obiectul mandatului în cauza concretă și capătă înțeles abia atunci când acest obiect este clar.',
      sections: [
        {
          heading: 'Mai întâi se stabilește obiectul mandatului',
          paragraphs: [
            'Cauze de același fel pot cere un efort foarte diferit, după numărul părților, documentele disponibile, termenele de respectat și după faptul dacă a început deja o procedură. De aceea primul pas este întotdeauna să se stabilească ce intră în mandat și ce nu.',
            'Rezumatul pe care îl trimiteți la început este baza de la care se stabilește acest obiect. Cu cât rezumatul descrie mai limpede desfășurarea, cererea dumneavoastră și termenele, cu atât mai exact poate fi delimitat mandatul.',
          ],
        },
        {
          heading: 'Onorariile se confirmă înainte de începerea lucrării',
          paragraphs: [
            'Când obiectul mandatului este clar, cuantumul onorariului și modul lui de calcul se discută și se confirmă cu dumneavoastră înainte ca lucrarea să înceapă. Dacă obiectul se schimbă pe parcurs, el trebuie confirmat din nou.',
            'Această pagină nu este o ofertă de preț și nu creează o obligație de plată.',
          ],
        },
        {
          heading: 'Consultanța poate fi contra cost',
          paragraphs: [
            'Consultanța cu un avocat poate fi o prestație contra cost. Această pagină nu spune că prima discuție este gratuită și nimic din ea nu trebuie înțeles în acest sens.',
            'Dacă consultanța este contra cost, cuantumul și modul de plată se comunică înainte ca aceasta să aibă loc.',
          ],
        },
        {
          heading: 'De ce această pagină nu arată tarife',
          paragraphs: [
            'Costurile depind de cauza însăși: de efort, de numărul părților, de documente, de termene și de faptul dacă o procedură este deja în curs. O sumă stabilită dinainte nu ar arăta costurile dosarului dumneavoastră. De aceea stabilim mai întâi obiectul mandatului și vă comunicăm apoi onorariul, înainte ca lucrarea să înceapă.',
            'Pe lângă onorariu pot apărea taxe de instanță, cheltuieli ale autorităților sau ale terților. Acestea sunt distincte de onorariu și depind de procedura respectivă.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'CONTACT',
      title: 'Cum puteți contacta cabinetul',
      description:
        'Limba paginii, limbile de consultanță, ce este de făcut dacă nu puteți folosi niciuna dintre cele patru limbi și ce nu promite această pagină.',
      intro:
        'Înainte de a ne scrie, deosebiți următoarele trei puncte. Sunt adesea amestecate, dar înseamnă lucruri diferite.',
      sections: [
        {
          heading: 'Trei lucruri care trebuie ținute separat',
          paragraphs: [
            'Limba de afișare a paginii, limba consultanței cu avocatul și limba în care scrieți sunt trei lucruri distincte.',
          ],
          items: [
            'Limba paginii: aceste informații sunt scrise în limba română.',
            'Limba consultanței: consultanța se desfășoară în engleză, chineză (中文), japoneză și coreeană.',
            'Limba în care scrieți: puteți scrie rezumatul în limba dumneavoastră; textul original se păstrează nemodificat.',
          ],
        },
        {
          heading: 'Dacă nu puteți folosi niciuna dintre cele patru limbi de consultanță',
          paragraphs: [
            'În formularul de contact puteți alege „Calea de comunicare trebuie confirmată”. Vă putem scrie pentru a vedea dacă există o cale de comunicare pe care o putem folosi; o prestație în altă limbă nu este garantată, iar un termen de răspuns nu se promite.',
            'Acesta este doar un pas de examinare, nu o promisiune. Nu promitem interpret și nicio prestație în limba română sau în altă limbă în afara celor patru arătate; nu preluăm orice cauză.',
          ],
        },
        {
          heading: 'Ce ar trebui să cuprindă primul mesaj',
          paragraphs: [
            'Arătați ce s-a întâmplat, de ce ajutor aveți nevoie, ce legătură are cauza cu Taiwanul și termenul, dacă îl cunoașteți. Dacă ați primit deja un act de la o instanță sau de la o autoritate, indicați data de pe act.',
            'În faza inițială nu trebuie să trimiteți încă numărul de pașaport, numărul actului de identitate, datele unui cont, documente medicale sau întregul material probator. Așteptați îndrumarea avocatului și trimiteți abia atunci documentele sensibile pe o cale sigură.',
          ],
        },
        {
          heading: 'Ce nu promite această pagină',
          paragraphs: [
            'Nu promitem un termen de răspuns, nu confirmăm o programare prin această pagină, nu promitem un anumit avocat și nu punem la dispoziție un interpret. Traducerea scrisă este altceva: mesajul dumneavoastră nu este tradus automat.',
            'Dacă trimiteți o solicitare, conținutul se păstrează și așteaptă examinarea. Dacă după un timp nu primiți răspuns, puteți scrie din nou la adresa de e-mail arătată pe pagina de contact.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'ÎNTREBĂRI',
      title: 'Întrebări frecvente',
      description:
        'Explicații despre aria de lucru, pregătire, limbi, costuri și despre înțelesul unei solicitări trimise.',
      intro:
        'Întrebările următoare sunt lămurite la nivelul informațiilor generale. Un răspuns pentru cazul dumneavoastră este posibil abia după ce un avocat a examinat documentele.',
      sections: [
        {
          heading: 'Cum să folosiți această parte',
          paragraphs: [
            'Dacă nu găsiți un răspuns pentru situația dumneavoastră, răspunsul depinde, de regulă, de fapte deosebite. Scrieți-le atunci în rezumat, în loc să le deduceți din această pagină.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Ce cauze tratează cabinetul?',
          answer:
            'Tratăm șase domenii: investiții și înființare de societăți în Taiwan, litigii civile și despăgubiri, căsătorie, familie și succesiuni, litigii de muncă, cauze penale și proprietate intelectuală. Preluarea unei cauze se hotărăște după examinarea conținutului.',
        },
        {
          question: 'Ce ar trebui să pregătesc înainte de contactare?',
          answer:
            'Pregătiți un scurt rezumat al desfășurării, al cererii dumneavoastră, al legăturii cu Taiwanul și al termenului, dacă există unul. Dacă există deja un act al unei instanțe sau al unei autorități, indicați data. În această fază nu trebuie să trimiteți încă acte de identitate sau întregul material probator.',
        },
        {
          question: 'Este posibilă o consultanță în limba română?',
          answer:
            'Nu. Aceste informații sunt scrise în limba română, dar consultanța cu un avocat se desfășoară numai în engleză, chineză (中文), japoneză și coreeană. Nu promitem niciun interpret. Traducerea scrisă este altceva: textul original pe care îl scrieți se păstrează așa cum este și nu este tradus automat.',
        },
        {
          question: 'Ce fac dacă nu pot folosi niciuna dintre cele patru limbi?',
          answer:
            'La trimiterea solicitării alegeți „Calea de comunicare trebuie confirmată”. Vă putem scrie pentru a vedea dacă există o cale de comunicare pe care o putem folosi, dar o prestație în altă limbă nu este garantată. Acesta este un pas de examinare, nu o promisiune că putem lucra în altă limbă.',
        },
        {
          question: 'Cum este tratat textul meu în limba română?',
          answer:
            'Textul original pe care îl scrieți se păstrează așa cum este și nu este tradus automat. Dacă este nevoie, limba comunicării următoare se confirmă cu dumneavoastră.',
        },
        {
          question: 'Consultanța a avut deja loc prin trimiterea solicitării?',
          answer:
            'Nu. O solicitare trimisă așteaptă examinarea de către un avocat. Nu este o opinie juridică, nu este o programare confirmată, iar trimiterea nu creează prin ea însăși o relație între avocat și client.',
        },
        {
          question: 'Cum se calculează costurile?',
          answer:
            'Mai întâi se stabilește obiectul mandatului, apoi cuantumul onorariului și modul lui de calcul se confirmă cu dumneavoastră înainte ca lucrarea să înceapă. Această pagină nu arată sume și nu spune că prima discuție este gratuită.',
        },
        {
          question: 'Ce fac dacă situația mea este foarte urgentă?',
          answer:
            'Arătați termenul sau data de pe un act oficial chiar la începutul rezumatului, astfel încât aceste date să fie vizibile la examinare. Această pagină nu are un canal de urgență și nu asigură un termen de răspuns; dacă situația dumneavoastră nu poate aștepta, ar trebui să căutați în paralel și alte căi în localitatea dumneavoastră.',
        },
      ],
    },
    privacy: {
      eyebrow: 'DATE PERSONALE',
      title: 'Datele culese prin formularul de contact',
      description:
        'Ce culege formularul de contact din această parte în limba română, cum este tratat textul original și cum ne puteți contacta în privința datelor dumneavoastră.',
      intro:
        'Această parte privește numai formularul de contact de pe aceste pagini de informare. Descrie tratarea datelor, nu o garanție tehnică.',
      sections: [
        {
          heading: 'Ce date se culeg',
          paragraphs: [
            'Când trimiteți o solicitare prin formularul din această parte, se înregistrează următoarele date:',
          ],
          items: [
            'Numele pe care îl indicați',
            'Adresa de e-mail pentru răspuns',
            'Limba de afișare a paginii în momentul trimiterii',
            'Limba în care ați scris',
            'Limba de consultanță pe care o doriți',
            'Textul original pe care l-ați scris',
            'Consimțământul dumneavoastră pentru trimiterea solicitării',
            'Un număr de înregistrare pentru regăsirea solicitării',
          ],
        },
        {
          heading: 'Textul original se păstrează nemodificat',
          paragraphs: [
            'Textul dumneavoastră se păstrează exact așa cum l-ați scris și nu este tradus automat. Dacă pentru soluționare este nevoie de o traducere, aceasta se discută separat cu dumneavoastră.',
            'Întrucât textul original se păstrează, în faza inițială nu scrieți ceea ce nu este încă necesar, de pildă numărul de pașaport, numărul actului de identitate sau datele unui cont.',
          ],
        },
        {
          heading: 'Locul păstrării și accesul',
          paragraphs: [
            'Conținutul trimiterii dumneavoastră se păstrează într-un loc care nu este accesibil publicului. Numai persoanele autorizate din cabinet au acces la el, pentru soluționarea solicitării.',
            'Această pagină nu dă o garanție absolută de securitate. Nicio cale de transmitere și niciun loc de păstrare nu sunt pe deplin sigure; de aceea, documentele sensibile ar trebui trimise abia după o îndrumare anume din partea avocatului.',
          ],
        },
        {
          heading: 'Scopul folosirii',
          paragraphs: [
            'Datele trimise servesc la examinarea solicitării, la răspunsul către dumneavoastră, la lămurirea căii de comunicare și la soluționare, dacă lucrarea este preluată.',
            'Datele nu se folosesc pentru marketing fără un consimțământ distinct.',
          ],
        },
        {
          heading: 'Înștiințarea și numărul de înregistrare',
          paragraphs: [
            'Dacă o solicitare este trimisă cu succes, sistemul înștiințează cabinetul. Dacă această înștiințare nu ajunge la cabinet, textul dumneavoastră rămâne păstrat și nu se pierde.',
            'Numărul de înregistrare servește la regăsirea solicitării dumneavoastră în evidențele noastre. Numărul se afișează după salvarea solicitării; îl puteți indica la o nouă contactare.',
          ],
        },
        {
          heading: 'Drepturile dumneavoastră și calea de contact',
          paragraphs: [
            'Puteți cere accesul la datele dumneavoastră, rectificarea sau ștergerea lor ori vă puteți retrage consimțământul, prin adresa de e-mail arătată pe pagina de contact. Dacă există o obligație legală sau procesuală de păstrare, explicăm limitarea.',
            'Această pagină nu arată un termen fix de păstrare, fiindcă durata efectivă depinde de desfășurarea ulterioară a cauzei și de obligațiile legate de aceasta. Dacă doriți o ștergere mai devreme, arătați acest lucru la contactare.',
          ],
        },
        {
          heading: 'Locul păstrării și furnizorii',
          paragraphs: [
            'Acest site este găzduit la Vercel, iar mesajul dumneavoastră este stocat într-un spațiu de stocare privat al acestui serviciu, neaccesibil publicului. E-mailurile se trimit prin serviciul de poștă electronică folosit de cabinet.',
            'Serverele unor furnizori se pot afla în afara Taiwanului, astfel încât datele dumneavoastră pot fi păstrate și prelucrate acolo. Când scopul păstrării este îndeplinit, datele se șterg fără întârziere; datele care trebuie păstrate potrivit normelor aplicabile rămân pe acea durată. Cererile privind datele cu caracter personal se primesc la wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'NOTE JURIDICE',
      title: 'Întinderea și limitele informațiilor de pe această pagină',
      description:
        'Caracterul general al informațiilor, cadrul juridic și condițiile nașterii unei relații între avocat și client.',
      intro:
        'Această parte lămurește ce pot face pentru dumneavoastră aceste pagini de informare în limba română și ce nu.',
      sections: [
        {
          heading: 'Numai informații generale',
          paragraphs: [
            'Conținutul acestor pagini este scris ca informare generală. Nu este consultanță juridică pentru cazul dumneavoastră și nu înlocuiește examinarea documentelor dumneavoastră.',
            'Rezultatul unei cauze depinde de fapte, de normele aplicabile și de momentul respectiv; două situații aparent asemănătoare se pot sfârși diferit.',
          ],
        },
        {
          heading: 'Cadrul juridic',
          paragraphs: [
            'Cabinetul lucrează potrivit dreptului taiwanez, iar această pagină vorbește numai despre activitatea din acest cadru.',
            'Conținutul nu este consultanță potrivit dreptului unei alte ordini juridice decât cea taiwaneză, inclusiv dreptul locului dumneavoastră de ședere. Dacă o parte a cauzei dumneavoastră privește o altă ordine juridică, vom lămuri împreună ce persoană calificată este necesară pentru acea parte.',
          ],
        },
        {
          heading: 'Relația dintre avocat și client nu se naște de la sine',
          paragraphs: [
            'Citirea acestei pagini, trimiterea unui formular sau a unui e-mail nu creează prin ea însăși o relație între avocat și client.',
            'Această relație ia naștere abia după ce cauza a fost examinată și ambele părți au confirmat preluarea lucrării.',
          ],
        },
        {
          heading: 'Nicio promisiune privind rezultatul',
          paragraphs: [
            'Nicio parte a acestei pagini nu este o promisiune privind rezultatul unei cauze, admiterea unei cereri ori statutul de ședere și de muncă.',
            'Legăturile externe servesc orientării; nu promitem nici exactitatea, nici actualitatea conținuturilor terților.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTICOLE',
      title: 'Articole despre dreptul taiwanez',
      description:
        'Articole în limba română despre întrebări frecvente din dreptul taiwanez. Conținutul este informare generală la momentul publicării, nu consultanță juridică pentru cazul dumneavoastră.',
      intro:
        'Cabinetul publică articole despre întrebări frecvente din dreptul taiwanez. Articolele disponibile în limba română se află pe această pagină; alături sunt patru legături care deschid fiecare lista articolelor dintr-o limbă originală.',
      sections: [
        {
          heading: 'Patru liste după limbă',
          paragraphs: [
            'Această parte cuprinde patru legături: lista articolelor în coreeană, în chineză, în engleză și în japoneză. Fiecare legătură arată limba listei, astfel încât să știți dinainte în ce limbă se deschide conținutul.',
            'Aceste patru liste sunt liste după limba originală a articolelor, nu liste de traduceri. Articolele disponibile în limba română se află separat, pe această pagină.',
          ],
        },
        {
          heading: 'Unde duc legăturile',
          paragraphs: [
            'Dacă alegeți una dintre cele patru legături, se deschide lista articolelor din acea limbă. Din listă alegeți dumneavoastră textul; întregul conținut apare în limba originală a articolului.',
            'Această pagină nu rezumă conținutul articolelor și nu garantează că o temă este disponibilă în toate cele patru limbi. Fiecare listă cuprinde numai texte publicate în acea limbă.',
          ],
        },
        {
          heading: 'În ce măsură un articol poate servi drept orientare',
          paragraphs: [
            'Articolele sunt informații generale la momentul publicării. Normele și aplicarea lor se pot schimba, iar un articol nu cuprinde toate împrejurările cazului dumneavoastră.',
            'De aceea nu întemeiați un demers într-o cauză reală numai pe un articol. Folosiți-l pentru o privire de ansamblu și discutați documentele dumneavoastră separat cu un avocat; această pagină nu ține loc de consultanță.',
          ],
        },
      ],
    },
  },
};

/**
 * Ukrainian guidance pack (batch 5). Formal address: Ви, capitalised as in
 * written correspondence. The professional noun `адвокат` is epicene here and
 * carries feminine agreement on the verb for attorney Wei Tseng, matching the
 * Russian pack (`уповноважена`) rather than coining a separate title.
 */
export const ukrainianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Українська',
  nav: {
    home: 'Головна',
    services: 'Послуги',
    about: 'Фірма',
    lawyers: 'Адвокати',
    pricing: 'Вартість',
    contact: 'Контакти',
    faq: 'Часті питання',
    privacy: 'Захист даних',
    disclaimer: 'Застереження',
    columns: 'Статті',
  },
  contactCta: 'Надіслати запит на розгляд',
  footerNotice:
    'Ця сторінка українською містить лише загальні відомості про роботу фірми за правом Тайваню. Це не юридична консультація в конкретній справі, і саме лише надсилання повідомлення не створює відносин між адвокатом і клієнтом.',
  skipLink: 'Пропустити навігацію та перейти до змісту',
  menuLabel: 'Перелік сторінок',
  languageLabel: 'Мова відображення',
  mega: {
    services: {
      description: 'Фірма веде основні групи справ за правом Тайваню.',
      viewAllLabel: 'Показати все',
    },
    columns: {
      description: 'Статті про часті питання права Тайваню.',
      viewAllLabel: 'Показати все',
    },
    lawyers: {
      description: 'Хто веде справи і як до них звернутися.',
      viewAllLabel: 'Показати все',
    },
    pricing: {
      description: 'Ця сторінка пояснює обсяг роботи та порядок з’ясування витрат.',
      viewAllLabel: 'Показати все',
    },
    faq: {
      description: 'Часті питання про роботу фірми на Тайвані.',
      viewAllLabel: 'Показати все',
    },
  },
  notFoundTitle: 'Сторінку не знайдено',
  notFoundText:
    'Шуканої сторінки немає або її переміщено. Ви можете повернутися на головну сторінку українською та переглянути доступні відомості.',
  backHomeLabel: 'На головну сторінку',
  readSourceLabel: 'Відкрити перелік статей мовою оригіналу',
  home: {
    heroScrollLabel: 'Прогорнути вниз',
    heroColumnsCtaLabel: 'Переглянути статті',
    servicesDetailLabel: 'Переглянути подробиці',
    servicesAssistanceBefore: 'Якщо не зрозуміло, до якої групи належить Ваша справа, сторінка ',
    servicesAssistanceLinkLabel: 'Контакти',
    servicesAssistanceAfter: ' пояснює, як скласти виклад, який розгляне адвокат.',
    columnsViewAllLabel: 'Переглянути всі статті',
    columnsReadMoreLabel: 'Читати далі',
    columnsReviewLabel: 'Перевірила адвокатка Wei Tseng',
    columnsOriginalLanguageBadge: 'Мова оригіналу',
    columnsOriginalLanguageNote:
      'Наступні статті ще не доступні українською. Перелік залишається мовою оригіналу та відкриває відповідну мовну сторінку; зміст не перекладається автоматично.',
    imageBandAlt: 'Традиційна тайванська садиба саньхеюань (三合院) і сучасний павільйон у денному світлі',
    videoPauseLabel: 'Зупинити відео',
    videoPlayLabel: 'Відтворити відео',
    videoReplayLabel: 'Відтворити відео ще раз',
  },
  pages: {
    home: {
      eyebrow: 'ВІДОМОСТІ',
      title: 'Юридичні послуги на Тайвані — відомості українською',
      description:
        'Загальні пояснення українською про обсяг роботи Hovering International Law Firm на Тайвані, про мови консультації та про перше звернення.',
      intro:
        'Hovering International Law Firm супроводжує клієнтів з-за кордону, зокрема тих, хто має зв’язок із Тайванем, у справах за правом Тайваню: інвестиції та створення товариств, цивільні спори, шлюб, сім’я та спадкування, трудове право, кримінальні справи та інтелектуальна власність. Ця українська частина допоможе Вам зрозуміти, яка робота належить до нашого обсягу, що підготувати та як до нас звернутися. Це загальні відомості, а не юридична консультація у Вашій справі.',
      sections: [
        {
          heading: 'Чим ми займаємося',
          paragraphs: [
            'Hovering International Law Firm — адвокатська фірма, заснована на Тайвані. Вона працює за правом Тайваню та має офіси в містах Тайбей (臺北), Гаосюн (高雄), Тайчжун (臺中) і Піндун (屏東). Ми консультуємо підприємства, ведемо судові процеси та супроводжуємо клієнтів з-за кордону на тих етапах, які на Тайвані справді потрібні.',
            'Увесь зміст цієї сторінки має загальний характер. Результат справи залежить від обставин, від застосовних приписів і від моменту, на який справу оцінюють. Ці відомості не замінюють розмови з адвокатом щодо Ваших документів.',
          ],
        },
        {
          heading: 'Мова сторінки й мова консультації — не те саме',
          paragraphs: [
            'Ця сторінка написана українською, але консультація з адвокатом відбувається лише чотирма мовами консультації: англійською, китайською (中文), японською та корейською. Читання відомостей українською не означає, що розмова з адвокатом відбудеться українською.',
            'Ми не обіцяємо перекладача, строку відповіді та зустрічі через цю сторінку. Якщо Ви не володієте жодною з чотирьох мов, сторінка «Контакти» пояснює, як ми розглядаємо спосіб спілкування.',
          ],
        },
        {
          heading: 'Групи справ',
          paragraphs: [
            'Обсяг роботи охоплює такі шість груп. Сторінка «Послуги» описує кожну групу докладніше та зазначає, чого не обіцяно.',
          ],
          items: [
            'Інвестиції та створення товариств на Тайвані',
            'Цивільні спори та відшкодування шкоди',
            'Шлюб, сім’я та спадкування',
            'Трудові спори',
            'Кримінальні справи',
            'Інтелектуальна власність: торговельні марки, патенти та авторське право',
          ],
        },
        {
          heading: 'З чого почати',
          paragraphs: [
            'Прочитайте сторінку «Послуги», щоб перевірити, чи належить Ваша справа до нашого обсягу, потім «Вартість» і «Контакти», щоб дізнатися, як визначається обсяг і як витрати підтверджуються до початку роботи.',
            'Надсилаючи повідомлення, виклад справи можете написати своєю мовою. Первинний текст зберігається саме таким, яким Ви його написали, і не перекладається автоматично. Надіслане повідомлення — це запит, що очікує розгляду: це ще не консультація і не підтверджена зустріч.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'ПОСЛУГИ',
      title: 'Які справи ми ведемо',
      description:
        'Шість груп роботи фірми на Тайвані та межі, які варто знати насамперед.',
      intro:
        'Нижче наведено групи, які ми справді ведемо, і питання, що найчастіше виникають на початковому етапі. Виклад допоможе Вам оцінити, чи належить Ваша справа до нашого обсягу; він загальний і не є юридичним аналізом окремої справи.',
      sections: [
        {
          heading: 'Інвестиції та створення товариств на Тайвані',
          paragraphs: [
            'Ми супроводжуємо іноземних інвесторів і підприємства у створенні або веденні товариства на Тайвані: вибір організаційно-правової форми, підготовка та подання документів, внесення капіталу, банківські питання, перевірка місцезнаходження та галузеві вимоги. Ми також супроводжуємо бухгалтерський облік і податки, що випливають зі створення та діяльності на Тайвані.',
            'Перебіг і строки різняться залежно від форми, інвестора, галузі, банку та вже наявних документів. Створення товариства саме по собі не веде до дозволу на проживання (居留) чи дозволу на роботу (工作許可): це окремі провадження, які оцінюють за становищем конкретної особи.',
          ],
        },
        {
          heading: 'Цивільні спори та відшкодування шкоди',
          paragraphs: [
            'Ця група охоплює спори з договорів, відшкодування деліктної шкоди і споживчі спори. Робота зазвичай починається з хронології, перевірки документів і наявних доказів, і лише потім настають подальші кроки.',
            'Перебіг визначають строки, зокрема позовна давність, і повнота доказів. Тому зазначайте відомі дати якнайраніше. Збережіть договори, повідомлення, підтвердження платежів або світлини з місця події та згадайте про них у першому повідомленні.',
          ],
        },
        {
          heading: 'Шлюб, сім’я та спадкування',
          paragraphs: [
            'Ми ведемо розірвання шлюбу (離婚), поділ майна, здійснення та виконання прав і обов’язків щодо неповнолітніх дітей (未成年子女權利義務之行使或負擔), спілкування з дитиною (會面交往) і спадкування (繼承), зокрема й тоді, коли сторони або майно перебувають у різних державах. Транскордонні сімейні справи часто потребують додаткової перевірки записів реєстрації домогосподарства (戶籍), форми документів і їхньої доказової сили на Тайвані.',
            'Оскільки сімейні справи часто мають строки та паралельні провадження, перший виклад має зазначати відносини між сторонами, теперішнє місце проживання та вже розпочаті провадження.',
          ],
        },
        {
          heading: 'Трудові спори',
          paragraphs: [
            'Ця група охоплює припинення трудових відносин, вихідну допомогу за правом Тайваню (資遣費; її не можна ототожнювати з подібними інститутами інших держав), оплату праці та спори з трудового договору (勞動契約) — як з боку працівника, так і з боку роботодавця. Під час розгляду ми відрізняємо підставу припинення від питань попередження, виплати та строків.',
            'Вирішальними документами зазвичай є трудовий договір, робочі правила (工作規則), розрахункові листки та листування сторін. Якщо вони у Вас збереглися, згадайте про це у викладі.',
          ],
        },
        {
          heading: 'Кримінальні справи',
          paragraphs: [
            'Ми супроводжуємо на стадії досудового розслідування та в суді — як підозрюваних і обвинувачених, так і потерпілих, — і оцінюємо кримінальні ризики господарської діяльності.',
            'Кримінальні справи часто мають короткі строки та усталені стадії. Якщо Ви вже одержали документ від органу розслідування чи суду, зазначте дату на документі завчасно, щоб зміст розглянули в належному порядку.',
          ],
        },
        {
          heading: 'Інтелектуальна власність',
          paragraphs: [
            'Ми супроводжуємо реєстрацію торговельних марок (商標) і патентів (專利), авторське право та спори про ці права на Тайвані.',
            'У цій групі вирішальною є послідовність кроків: обсяг охорони, момент подання та фактичне використання впливають на вибір. Подання заявки саме по собі не означає, що її буде задоволено.',
          ],
        },
        {
          heading: 'Обсяг роботи та його підтвердження',
          paragraphs: [
            'Фірма працює за правом Тайваню та веде справи з наведених вище груп. Обсяг кожної справи підтверджують окремо після того, як адвокат розгляне Ваше повідомлення.',
            'Статус перебування, дозвіл на роботу та подібні питання оцінюють за документами та за становищем конкретної особи, а не за громадянством. Якщо частина Вашої справи стосується цих питань, зазначте це у зверненні. Ця сторінка не обіцяє ані результату, ані строку відповіді.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'ФІРМА',
      title: 'Про Hovering International Law Firm',
      description:
        'Основні відомості про цю тайванську адвокатську фірму, її офіси та роботу з іноземними сторонами.',
      intro:
        'Hovering International Law Firm — адвокатська фірма на Тайвані. Її адвокати працюють від консультування підприємств до ведення судових справ. Ця частина описує історію фірми, її офіси та роботу з іноземними сторонами.',
      sections: [
        {
          heading: 'Заснування та структура',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) заснували 2016 року адвокати, які навчалися в National Taiwan University (國立臺灣大學). Китайська назва 昊鼎 поєднує знак 昊 («широке небо») зі знаком 鼎 («міцна основа») й описує спрямування фірми від заснування.',
            'Ми маємо офіси в містах Тайбей (臺北), Гаосюн (高雄), Тайчжун (臺中) і Піндун (屏東). Офіс у Гаосюні зосереджений на корпоративному управлінні й веде цивільні, кримінальні та адміністративні спори. Офіс у Тайчжуні веде будівельні справи, інтелектуальну власність і справи, пов’язані з Кореєю та Японією. Офіс у Піндуні відкрито 2017 року для місцевих потреб.',
            'Крім адвокатської роботи, від 2020 року діє також Hovering Accounting Office, що пропонує бухгалтерський облік і податкове планування підприємцям і заможним приватним особам.',
          ],
        },
        {
          heading: 'Робота з іноземними сторонами',
          paragraphs: [
            'Транскордонна робота охоплює створення товариств, візи, подання заявок на торговельні марки та патенти, перевірку правового ризику та податкове консультування підприємств. Офіс у місті Тайчжун веде передусім будівельні справи, інтелектуальну власність і справи, пов’язані з Кореєю та Японією. Адвокатка Wei Tseng (曾雋崴) супроводжує клієнтів з Кореї, Японії та інших країн у зазначених групах.',
            'Чи можемо ми взяти справу, залежить від змісту та від мови спілкування. Якщо Ваша справа належить до зазначених груп і її можна обговорити однією з чотирьох мов консультації, Ви можете надіслати виклад на розгляд.',
          ],
        },
        {
          heading: 'Коли Ви до нас звертаєтеся',
          paragraphs: [
            'Після надходження Вашого викладу адвокат розглядає зміст, а потім говорить про можливий обсяг роботи, про ще потрібні документи та про подальші кроки. У податкових і бухгалтерських питаннях фірма може працювати спільно з бухгалтерським відділом у межах однієї справи.',
            'Результат кожної справи залежить від обставин і наявних документів; результату ми не обіцяємо. Якщо Вам потрібна відповідь, на яку можна спертися у Вашій ситуації, документи слід обговорити однією з чотирьох мов консультації з адвокатом.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'АДВОКАТИ',
      title: 'Міжнародна команда Hovering',
      description: 'Профілі адвокатів, операційного керівництва та бухгалтера-партнера Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'ВАРТІСТЬ',
      title: 'Як визначають обсяг роботи та витрати',
      description:
        'Пояснення послідовності: спершу обсяг роботи, потім підтвердження витрат, і чому на цій сторінці немає переліку цін.',
      intro:
        'Ця сторінка пояснює, як визначають витрати, а не їхній розмір. Розмір залежить від обсягу роботи в окремій справі й має значення лише тоді, коли цей обсяг зрозумілий.',
      sections: [
        {
          heading: 'Спершу визначають обсяг роботи',
          paragraphs: [
            'Справи одного виду можуть потребувати дуже різних зусиль — залежно від кількості сторін, наявних документів, строків, яких треба додержати, і від того, чи вже розпочато провадження. Тому першим кроком завжди є визначення того, що належить до роботи, а що ні.',
            'Виклад, який Ви надсилаєте на початку, є основою цього обсягу. Що ясніше він описує перебіг, Ваше прохання та строки, то точніше можна визначити обсяг.',
          ],
        },
        {
          heading: 'Витрати підтверджують до початку роботи',
          paragraphs: [
            'Коли обсяг роботи зрозумілий, розмір і спосіб обчислення витрат обговорюють і підтверджують із Вами до того, як робота почнеться. Якщо обсяг змінюється під час роботи, це треба підтвердити знову.',
            'Ця сторінка не є ціновою пропозицією і не створює обов’язку платити. Надсилання запиту через цю сторінку також безоплатне.',
          ],
        },
        {
          heading: 'Консультація може бути платною',
          paragraphs: [
            'Консультація з адвокатом може бути платною послугою. Ця сторінка не каже, що перша розмова безоплатна, і жодну її частину не можна тлумачити в цьому розумінні.',
            'Якщо консультація платна, розмір і спосіб оплати повідомляють до того, як вона відбудеться.',
          ],
        },
        {
          heading: 'Чому на цій сторінці немає тарифів',
          paragraphs: [
            'Витрати залежать від самої справи: від зусиль, кількості сторін, документів, строків і від того, чи вже триває провадження. Заздалегідь названа сума не показала б, скільки коштуватиме саме Ваша справа. Тому ми спершу визначаємо обсяг роботи, а витрати повідомляємо потім, до початку роботи.',
            'Крім гонорару можуть виникнути судові збори, витрати органів влади чи третіх осіб. Вони відокремлені від гонорару та залежать від відповідного провадження.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'КОНТАКТИ',
      title: 'Як звернутися до фірми',
      description:
        'Мова сторінки, мови консультації, що робити, якщо Ви не володієте жодною з чотирьох мов, і чого ця сторінка не обіцяє.',
      intro:
        'Перш ніж написати нам, розрізніть такі три речі. Їх часто змішують, але вони означають різне.',
      sections: [
        {
          heading: 'Три речі, які треба тримати окремо',
          paragraphs: [
            'Мова відображення сторінки, мова консультації з адвокатом і мова, якою Ви пишете, — це три різні речі.',
          ],
          items: [
            'Мова сторінки: ці відомості написано українською.',
            'Мова консультації: консультація відбувається англійською, китайською (中文), японською та корейською.',
            'Ваша мова письма: виклад справи можете написати своєю мовою; первинний текст зберігається без змін.',
          ],
        },
        {
          heading: 'Якщо Ви не володієте жодною з чотирьох мов консультації',
          paragraphs: [
            'У формі звернення Ви можете обрати «Спосіб спілкування потребує підтвердження». Ми відповідаємо, щоб розглянути придатний спосіб спілкування, якщо такий є; послуги іншою мовою не гарантовано, а строку відповіді не обіцяно.',
            'Це лише етап розгляду, а не обіцянка. Ми не обіцяємо перекладача, послуги українською чи іншою мовою поза чотирма зазначеними, і не обіцяємо, що візьмемо кожну справу.',
          ],
        },
        {
          heading: 'Що має містити перше повідомлення',
          paragraphs: [
            'Зазначте, що сталося, якої допомоги Ви потребуєте, який зв’язок справа має з Тайванем, і строк, якщо Ви його знаєте. Якщо Ви вже одержали документ суду чи органу влади, зазначте дату на документі.',
            'На початковому етапі Вам ще не потрібно надсилати номер паспорта, номер документа, дані рахунку, медичні документи чи всю сукупність доказів. Дочекайтеся вказівок адвоката та надішліть чутливі документи лише після цього безпечним способом.',
          ],
        },
        {
          heading: 'Чого ця сторінка не обіцяє',
          paragraphs: [
            'Ми не обіцяємо строку відповіді, не підтверджуємо зустріч через цю сторінку, не обіцяємо певного адвоката і не надаємо перекладача. Усний перекладач і письмовий переклад Вашого звернення — різні речі: Ваше повідомлення не перекладається автоматично.',
            'Якщо Ви надішлете запит, зміст збережеться й очікуватиме розгляду. Якщо через деякий час Ви не одержите відповіді, можете написати ще раз на адресу електронної пошти, зазначену на сторінці контактів.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'ЧАСТІ ПИТАННЯ',
      title: 'Часті питання',
      description:
        'Пояснення щодо обсягу роботи, підготовки, мов, витрат і того, що означає надісланий запит.',
      intro:
        'На наведені нижче питання відповідають на рівні загальних відомостей. Відповідь для Вашої справи можлива лише після того, як адвокат розгляне документи.',
      sections: [
        {
          heading: 'Як користуватися цією частиною',
          paragraphs: [
            'Якщо Ви не знайдете відповіді для свого становища, відповідь зазвичай залежить від особливих обставин. Тоді напишіть їх у викладі, замість того, щоб самим виводити відповідь із цієї сторінки.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Які справи веде фірма?',
          answer:
            'Ми ведемо шість груп: інвестиції та створення товариств на Тайвані, цивільні спори та відшкодування шкоди, шлюб, сім’я та спадкування, трудові спори, кримінальні справи та інтелектуальна власність. Чи буде справу прийнято, вирішують після розгляду змісту.',
        },
        {
          question: 'Що підготувати перед зверненням?',
          answer:
            'Підготуйте короткий виклад перебігу, Вашого прохання, зв’язку з Тайванем і строку, якщо він є. Якщо вже є документ суду чи органу влади, зазначте дату. На цьому етапі Вам ще не потрібно надсилати документи, що посвідчують особу, чи всю сукупність доказів.',
        },
        {
          question: 'Чи можлива консультація українською?',
          answer:
            'Ні. Ці відомості написано українською, але консультація з адвокатом відбувається лише англійською, китайською (中文), японською та корейською. Перекладача ми теж не обіцяємо. Письмовий переклад — це окреме питання: первинний текст, який Ви пишете, зберігається без змін і не перекладається автоматично.',
        },
        {
          question: 'Що робити, якщо я не володію жодною з чотирьох мов?',
          answer:
            'Надсилаючи запит, оберіть «Спосіб спілкування потребує підтвердження». Ми відповідаємо, щоб розглянути спосіб спілкування, але послуги іншою мовою не гарантовано. Це етап розгляду, а не обіцянка, що ми зможемо працювати іншою мовою.',
        },
        {
          question: 'Як опрацьовують мій текст українською?',
          answer:
            'Первинний текст, який Ви пишете, зберігається без змін і не перекладається автоматично. За потреби мову подальшого спілкування підтверджують із Вами.',
        },
        {
          question: 'Чи консультація вже відбулася, якщо запит надіслано?',
          answer:
            'Ні. Надісланий запит очікує розгляду адвокатом. Це не юридичний висновок, не підтверджена зустріч, і саме лише надсилання не створює відносин між адвокатом і клієнтом.',
        },
        {
          question: 'Як обчислюють витрати?',
          answer:
            'Спершу визначають обсяг роботи, потім розмір і спосіб обчислення витрат підтверджують із Вами до початку роботи. Ця сторінка не наводить сум і не каже, що перша розмова безоплатна.',
        },
        {
          question: 'Що робити, якщо моя справа дуже нагальна?',
          answer:
            'Зазначте строк або дату з офіційного документа на самому початку викладу, щоб ці дати були видні під час розгляду. Ця сторінка не має каналу для невідкладних звернень і не забезпечує строку відповіді; якщо Ваша справа не терпить зволікання, Вам варто паралельно шукати інші шляхи за місцем перебування.',
        },
      ],
    },
    privacy: {
      eyebrow: 'ЗАХИСТ ДАНИХ',
      title: 'Дані, які збирає форма звернення',
      description:
        'Що збирає форма звернення в цій українській частині, як опрацьовують первинний текст і як звернутися до нас щодо Ваших даних.',
      intro:
        'Ця частина стосується лише форми звернення на цих сторінках з відомостями. Вона описує поводження з даними, а не технічну гарантію.',
      sections: [
        {
          heading: 'Які дані збирають',
          paragraphs: [
            'Коли Ви надсилаєте запит через форму в цій частині, записують такі дані:',
          ],
          items: [
            'Ім’я, яке Ви зазначаєте',
            'Адресу електронної пошти для відповіді',
            'Мову відображення сторінки в момент надсилання',
            'Мову, якою Ви писали',
            'Бажану мову консультації',
            'Первинний текст, який Ви написали',
            'Вашу згоду на надсилання запиту',
            'Реєстраційний номер, за яким можна знайти запит',
          ],
        },
        {
          heading: 'Первинний текст зберігається без змін',
          paragraphs: [
            'Ваш текст зберігається саме таким, яким Ви його написали, і не перекладається автоматично. Якщо для опрацювання потрібен переклад, це обговорюють із Вами окремо.',
            'Оскільки первинний текст зберігається, на початковому етапі не пишіть того, що ще не потрібне, наприклад номера паспорта, номера документа чи даних рахунку.',
          ],
        },
        {
          heading: 'Місце зберігання та доступ',
          paragraphs: [
            'Зміст надісланого запиту зберігають у місці, що не є загальнодоступним. Доступ до нього мають лише уповноважені особи у фірмі — для опрацювання запиту.',
            'Ця сторінка не дає безумовної гарантії безпеки. Жоден шлях передавання та жодне місце зберігання не є цілком безпечними; тому чутливі документи слід надсилати лише після окремої вказівки адвоката.',
          ],
        },
        {
          heading: 'Мета використання',
          paragraphs: [
            'Надіслані дані слугують розглядові запиту, відповіді Вам, з’ясуванню способу спілкування та опрацюванню справи, якщо ми візьмемося за неї.',
            'Дані не використовують для маркетингу без окремої згоди.',
          ],
        },
        {
          heading: 'Сповіщення та реєстраційний номер',
          paragraphs: [
            'Якщо запит надіслано успішно, система сповіщає фірму. Якщо це сповіщення не надійде до фірми, Ваш текст залишається збереженим і не втрачається.',
            'Реєстраційний номер потрібен, щоб знайти Ваш запит у наших записах. Його показують після збереження; Ви можете зазначити його при новому зверненні.',
          ],
        },
        {
          heading: 'Ваші права та шлях звернення',
          paragraphs: [
            'Ви можете вимагати доступу до своїх даних, їх виправлення або видалення чи відкликати згоду — через адресу електронної пошти, зазначену на сторінці контактів. Якщо існує законний або процесуальний обов’язок зберігання, ми пояснюємо обмеження.',
            'Ця сторінка не зазначає твердого строку зберігання, бо дійсна тривалість залежить від подальшого перебігу справи та пов’язаних обов’язків. Якщо Ви бажаєте раннішого видалення, повідомте про це при зверненні.',
          ],
        },
        {
          heading: 'Місце зберігання та надавачі послуг',
          paragraphs: [
            'Цей сайт розміщено у Vercel, і надісланий запит зберігається в непублічному об’єктному сховищі цієї служби. Листи надсилають через службу електронної пошти, якою користується фірма.',
            'Сервери окремих надавачів можуть перебувати поза Тайванем, тож Ваші дані можуть зберігатися й опрацьовуватися там. Коли мету зберігання досягнуто, дані видаляють без зволікання; дані, які треба зберігати за застосовними приписами, залишаються на цей строк. Запити щодо персональних даних приймають на wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'ЗАСТЕРЕЖЕННЯ',
      title: 'Обсяг і межі відомостей на цій сторінці',
      description:
        'Загальний характер відомостей, правові рамки та передумови виникнення відносин між адвокатом і клієнтом.',
      intro:
        'Ця частина з’ясовує, що ці українські сторінки з відомостями можуть для Вас зробити, а чого — ні.',
      sections: [
        {
          heading: 'Лише загальні відомості',
          paragraphs: [
            'Зміст цих сторінок написано як загальну інформацію. Це не юридична консультація у Вашій справі й не заміна перевірки Ваших документів.',
            'Результат справи залежить від обставин, від застосовних приписів і від моменту, на який справу оцінюють; дві на вигляд подібні ситуації можуть скінчитися по-різному.',
          ],
        },
        {
          heading: 'Правові рамки',
          paragraphs: [
            'Фірма діє за правом Тайваню, і ця сторінка говорить лише про роботу в цих рамках.',
            'Зміст не є консультацією за правом іншого правопорядку, ніж тайванський, зокрема за правом місця Вашого перебування. Якщо частина Вашої справи стосується іншого правопорядку, ми з’ясуємо з Вами, яка кваліфікована особа потрібна для цієї частини.',
          ],
        },
        {
          heading: 'Відносини між адвокатом і клієнтом не виникають самі собою',
          paragraphs: [
            'Читання цієї сторінки, надсилання форми чи листа саме по собі не створює відносин між адвокатом і клієнтом.',
            'Ці відносини виникають лише після того, як справу розглянуто й обидві сторони підтвердили прийняття доручення.',
          ],
        },
        {
          heading: 'Жодної обіцянки результату',
          paragraphs: [
            'Жодна частина цієї сторінки не є обіцянкою щодо результату справи, задоволення заявки чи щодо статусу перебування та роботи.',
            'Зовнішні посилання слугують орієнтуванню; ми не обіцяємо ані правильності, ані актуальності змісту третіх осіб.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'СТАТТІ',
      title: 'Статті про право Тайваню',
      description:
        'Статті українською про часті питання права Тайваню. Зміст є загальною інформацією на момент оприлюднення, а не юридичною консультацією у Вашій справі.',
      intro:
        'Фірма оприлюднює статті про часті питання права Тайваню. Статті, доступні українською, розміщено на цій сторінці; поряд є чотири посилання, кожне з яких відкриває перелік статей однією мовою оригіналу.',
      sections: [
        {
          heading: 'Чотири переліки за мовами',
          paragraphs: [
            'Ця частина містить чотири посилання: перелік статей корейською, китайською, англійською та японською. Кожне посилання зазначає мову переліку, тож Ви наперед знаєте, якою мовою відкриється зміст.',
            'Ці чотири переліки — це переліки за мовою оригіналу статей, а не переліки перекладів. Статті, доступні українською, розміщено окремо на цій сторінці.',
          ],
        },
        {
          heading: 'Куди ведуть посилання',
          paragraphs: [
            'Якщо Ви оберете одне з чотирьох посилань, відкриється перелік статей тією мовою. З переліку текст обираєте Ви самі; увесь зміст з’являється мовою оригіналу статті.',
            'Ця сторінка не переказує змісту статей і не гарантує, що тема доступна всіма чотирма мовами. Кожен перелік містить лише тексти, оприлюднені тією мовою.',
          ],
        },
        {
          heading: 'Наскільки стаття може слугувати орієнтиром',
          paragraphs: [
            'Статті — це загальні відомості на момент оприлюднення. Приписи та їх застосування можуть змінитися, і стаття не містить усіх обставин Вашої справи.',
            'Тому не ґрунтуйте рішень у реальній справі лише на статті. Користуйтеся нею для загального огляду, а свої документи обговоріть із адвокатом окремо; читання цієї сторінки не є консультацією.',
          ],
        },
      ],
    },
  },
};

/**
 * Greek guidance pack (batch 5). Formal address: plural εσείς/σας. Attorney Wei
 * Tseng is female, so the pack uses the feminine δικηγόρος with feminine
 * articles (η δικηγόρος) and feminine agreement; the mixed team is named
 * "οι δικηγόροι".
 *
 * Greek needs its own font subset: the shared Noto Sans loader must list
 * `greek` alongside latin/latin-ext/vietnamese/cyrillic, otherwise the page
 * falls back to a system face.
 */
export const greekGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Ελληνικά',
  nav: {
    home: 'Αρχική',
    services: 'Υπηρεσίες',
    about: 'Το γραφείο',
    lawyers: 'Δικηγόροι',
    pricing: 'Κόστος',
    contact: 'Επικοινωνία',
    faq: 'Ερωτήσεις',
    privacy: 'Απόρρητο',
    disclaimer: 'Αποποίηση',
    columns: 'Άρθρα',
  },
  contactCta: 'Αποστολή αιτήματος για εξέταση',
  footerNotice:
    'Αυτή η σελίδα στα ελληνικά περιέχει μόνο γενικές πληροφορίες για την εργασία του γραφείου κατά το δίκαιο της Ταϊβάν. Δεν αποτελεί νομική συμβουλή για συγκεκριμένη υπόθεση, και η αποστολή ενός μηνύματος δεν δημιουργεί από μόνη της σχέση δικηγόρου και εντολέα.',
  skipLink: 'Παράλειψη πλοήγησης και μετάβαση στο περιεχόμενο',
  menuLabel: 'Κατάλογος σελίδων',
  languageLabel: 'Γλώσσα εμφάνισης',
  mega: {
    services: {
      description: 'Το γραφείο χειρίζεται τους βασικούς τομείς δραστηριότητας κατά το δίκαιο της Ταϊβάν.',
      viewAllLabel: 'Δείτε όλα',
    },
    columns: {
      description: 'Άρθρα για συχνά ερωτήματα του δικαίου της Ταϊβάν.',
      viewAllLabel: 'Δείτε όλα',
    },
    lawyers: {
      description: 'Παρουσίαση των δικηγόρων και των τρόπων επικοινωνίας.',
      viewAllLabel: 'Δείτε όλα',
    },
    pricing: {
      description: 'Η σελίδα αυτή εξηγεί το αντικείμενο της εντολής και τον τρόπο αποσαφήνισης του κόστους.',
      viewAllLabel: 'Δείτε όλα',
    },
    faq: {
      description: 'Συχνά ερωτήματα για την εργασία του γραφείου στην Ταϊβάν.',
      viewAllLabel: 'Δείτε όλα',
    },
  },
  notFoundTitle: 'Η σελίδα δεν βρέθηκε',
  notFoundText:
    'Η σελίδα που αναζητήσατε δεν υπάρχει ή μεταφέρθηκε. Μπορείτε να επιστρέψετε στην αρχική σελίδα στα ελληνικά και να δείτε τις διαθέσιμες πληροφορίες.',
  backHomeLabel: 'Στην αρχική σελίδα',
  readSourceLabel: 'Άνοιγμα του καταλόγου άρθρων στη γλώσσα του πρωτοτύπου',
  home: {
    heroScrollLabel: 'Κύλιση προς τα κάτω',
    heroColumnsCtaLabel: 'Προβολή άρθρων',
    servicesDetailLabel: 'Προβολή λεπτομερειών',
    servicesAssistanceBefore: 'Αν δεν είναι σαφές σε ποια κατηγορία ανήκει η υπόθεσή σας, η σελίδα ',
    servicesAssistanceLinkLabel: 'Επικοινωνία',
    servicesAssistanceAfter: ' εξηγεί πώς να συντάξετε μια περίληψη την οποία θα εξετάσει δικηγόρος.',
    columnsViewAllLabel: 'Προβολή όλων των άρθρων',
    columnsReadMoreLabel: 'Συνέχεια ανάγνωσης',
    columnsReviewLabel: 'Ελέγχθηκε από τη δικηγόρο Wei Tseng',
    columnsOriginalLanguageBadge: 'Γλώσσα πρωτοτύπου',
    columnsOriginalLanguageNote:
      'Τα ακόλουθα άρθρα δεν είναι ακόμη διαθέσιμα στα ελληνικά. Ο κατάλογος παραμένει στη γλώσσα του πρωτοτύπου και ο σύνδεσμος οδηγεί στη σελίδα της αντίστοιχης γλώσσας· το περιεχόμενο δεν μεταφράζεται αυτόματα.',
    imageBandAlt: 'Παραδοσιακή ταϊβανέζικη αυλή σανχεγιουάν (三合院) και ένα σύγχρονο περίπτερο στο φως της ημέρας',
    videoPauseLabel: 'Παύση του βίντεο',
    videoPlayLabel: 'Αναπαραγωγή του βίντεο',
    videoReplayLabel: 'Επανάληψη του βίντεο',
  },
  pages: {
    home: {
      eyebrow: 'ΠΛΗΡΟΦΟΡΙΕΣ',
      title: 'Νομικές υπηρεσίες στην Ταϊβάν — πληροφορίες στα ελληνικά',
      description:
        'Γενικές εξηγήσεις στα ελληνικά για το αντικείμενο της εντολής της Hovering International Law Firm στην Ταϊβάν, για τις γλώσσες της συμβουλευτικής και για την πρώτη επικοινωνία.',
      intro:
        'Η Hovering International Law Firm αναλαμβάνει εντολείς από το εξωτερικό, και όσους έχουν δεσμό με την Ταϊβάν, σε ζητήματα του δικαίου της Ταϊβάν: επενδύσεις και σύσταση εταιρειών, αστικές διαφορές, γάμος, οικογένεια και κληρονομικά, εργατικό δίκαιο, ποινικές υποθέσεις και διανοητική ιδιοκτησία. Αυτές οι ελληνικές σελίδες σας βοηθούν να αναγνωρίσετε ποια εργασία εμπίπτει στο αντικείμενό μας, τι να ετοιμάσετε και πώς να επικοινωνήσετε μαζί μας. Πρόκειται για γενικές πληροφορίες, όχι για νομική συμβουλή για τη δική σας υπόθεση.',
      sections: [
        {
          heading: 'Με τι ασχολούμαστε',
          paragraphs: [
            'Η Hovering International Law Firm είναι δικηγορικό γραφείο εγκατεστημένο στην Ταϊβάν. Εργάζεται κατά το δίκαιο της Ταϊβάν και διατηρεί γραφεία στην Ταϊπέι (臺北), στο Καοσιούνγκ (高雄), στο Ταϊτσούνγκ (臺中) και στο Πινγκτούνγκ (屏東). Συμβουλεύουμε επιχειρήσεις, διεξάγουμε δίκες και υποστηρίζουμε εντολείς από το εξωτερικό στα βήματα που απαιτούνται στην Ταϊβάν.',
            'Όλο το περιεχόμενο εδώ είναι γενικό. Η έκβαση μιας υπόθεσης εξαρτάται από τα πραγματικά περιστατικά, από τους εφαρμοστέους κανόνες και από τη χρονική στιγμή. Οι πληροφορίες αυτές δεν υποκαθιστούν τη συζήτηση με δικηγόρο με βάση τα έγγραφά σας.',
          ],
        },
        {
          heading: 'Η γλώσσα της σελίδας και η γλώσσα της συμβουλευτικής δεν ταυτίζονται',
          paragraphs: [
            'Η σελίδα αυτή είναι γραμμένη στα ελληνικά, αλλά η συμβουλευτική με δικηγόρο διεξάγεται μόνο στις τέσσερις γλώσσες συμβουλευτικής: αγγλικά, κινεζικά (中文), ιαπωνικά και κορεατικά. Η ανάγνωση των πληροφοριών στα ελληνικά δεν σημαίνει ότι η συζήτηση με δικηγόρο θα γίνει στα ελληνικά.',
            'Δεν υποσχόμαστε ούτε διερμηνέα, ούτε προθεσμία απάντησης, ούτε ραντεβού μέσω αυτής της σελίδας. Αν δεν μιλάτε καμία από τις τέσσερις γλώσσες, η σελίδα «Επικοινωνία» εξηγεί πώς εξετάζουμε έναν τρόπο επικοινωνίας.',
          ],
        },
        {
          heading: 'Τομείς δραστηριότητας',
          paragraphs: [
            'Το αντικείμενο της εντολής περιλαμβάνει τις ακόλουθες έξι κατηγορίες. Η σελίδα «Υπηρεσίες» περιγράφει κάθε κατηγορία ακριβέστερα και αναφέρει τι δεν υπόσχεται.',
          ],
          items: [
            'Επενδύσεις και σύσταση εταιρειών στην Ταϊβάν',
            'Αστικές διαφορές και αποζημίωση',
            'Γάμος, οικογένεια και κληρονομικά',
            'Εργατικές διαφορές',
            'Ποινικές υποθέσεις',
            'Διανοητική ιδιοκτησία: σήματα, διπλώματα ευρεσιτεχνίας και πνευματικά δικαιώματα',
          ],
        },
        {
          heading: 'Από πού να ξεκινήσετε',
          paragraphs: [
            'Διαβάστε τη σελίδα «Υπηρεσίες» για να ελέγξετε αν η υπόθεσή σας εμπίπτει στο αντικείμενό μας, έπειτα τις σελίδες «Κόστος» και «Επικοινωνία», για να μάθετε πώς καθορίζεται το αντικείμενο της εντολής και πώς επιβεβαιώνεται το κόστος πριν αρχίσει η εργασία.',
            'Κατά την αποστολή του μηνύματος μπορείτε να γράψετε την περίληψη στη γλώσσα σας. Το πρωτότυπο κείμενο διατηρείται ακριβώς όπως το γράψατε και δεν μεταφράζεται αυτόματα. Ένα μήνυμα που έχει σταλεί είναι αίτημα που αναμένει εξέταση: δεν είναι ακόμη συμβουλευτική ούτε επιβεβαιωμένο ραντεβού.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'ΥΠΗΡΕΣΙΕΣ',
      title: 'Ποιες υποθέσεις χειριζόμαστε',
      description:
        'Οι έξι τομείς δραστηριότητας του γραφείου στην Ταϊβάν και τα όρια που αξίζει να γνωρίζετε πρώτα.',
      intro:
        'Ακολουθούν οι κατηγορίες υποθέσεων που πράγματι χειριζόμαστε και τα ερωτήματα που τίθενται συχνά στο αρχικό στάδιο. Η παρουσίαση σας βοηθά να κρίνετε αν η υπόθεσή σας εμπίπτει στο αντικείμενό μας· είναι γενική και δεν αποτελεί νομική ανάλυση συγκεκριμένου φακέλου.',
      sections: [
        {
          heading: 'Επενδύσεις και σύσταση εταιρειών στην Ταϊβάν',
          paragraphs: [
            'Υποστηρίζουμε ξένους επενδυτές και επιχειρήσεις στη σύσταση ή τη λειτουργία εταιρείας στην Ταϊβάν: επιλογή νομικής μορφής, προετοιμασία και κατάθεση εγγράφων, καταβολή κεφαλαίου, τραπεζικά ζητήματα, έλεγχος της έδρας και κλαδικές απαιτήσεις. Υποστηρίζουμε επίσης τη λογιστική και τη φορολογία που προκύπτουν από τη σύσταση και τη λειτουργία στην Ταϊβάν.',
            'Η πορεία και οι προθεσμίες διαφέρουν ανάλογα με τη μορφή, τον επενδυτή, τον κλάδο, την τράπεζα και τα ήδη διαθέσιμα έγγραφα. Η σύσταση εταιρείας δεν οδηγεί από μόνη της σε άδεια διαμονής (居留) ή σε άδεια εργασίας (工作許可): πρόκειται για χωριστές διαδικασίες, που κρίνονται κατά την κατάσταση του κάθε προσώπου.',
          ],
        },
        {
          heading: 'Αστικές διαφορές και αποζημίωση',
          paragraphs: [
            'Η κατηγορία αυτή περιλαμβάνει διαφορές από συμβάσεις, αποζημίωση από αδικοπραξία και καταναλωτικές διαφορές. Η εργασία αρχίζει κατά κανόνα με χρονολόγιο, με εξέταση των εγγράφων και των υπαρχόντων αποδεικτικών στοιχείων, και μόνο κατόπιν ακολουθούν τα επόμενα βήματα.',
            'Οι προθεσμίες, μεταξύ αυτών και η παραγραφή, καθώς και η πληρότητα των αποδείξεων καθορίζουν την πορεία. Αναφέρετε επομένως τις γνωστές ημερομηνίες όσο το δυνατόν νωρίτερα. Φυλάξτε συμβάσεις, μηνύματα, αποδείξεις πληρωμών ή φωτογραφίες της κατάστασης επί τόπου και αναφέρετέ τα στο πρώτο μήνυμα.',
          ],
        },
        {
          heading: 'Γάμος, οικογένεια και κληρονομικά',
          paragraphs: [
            'Χειριζόμαστε το διαζύγιο (離婚), τη διανομή περιουσίας, τη γονική μέριμνα ανήλικων τέκνων (未成年子女權利義務之行使或負擔), την επικοινωνία με το τέκνο (會面交往) και τα κληρονομικά (繼承), ακόμη και όταν τα μέρη ή τα περιουσιακά στοιχεία βρίσκονται σε διαφορετικά κράτη. Οι διασυνοριακές οικογενειακές υποθέσεις απαιτούν συχνά πρόσθετο έλεγχο των μητρώων κατοίκων (戶籍), του τύπου των εγγράφων και της αποδεικτικής τους ισχύος στην Ταϊβάν.',
            'Επειδή οι οικογενειακές υποθέσεις φέρνουν συχνά προθεσμίες και παράλληλες διαδικασίες, η πρώτη περίληψη πρέπει να αναφέρει τη σχέση των μερών, τη σημερινή κατοικία και τις ήδη εκκρεμείς διαδικασίες.',
          ],
        },
        {
          heading: 'Εργατικές διαφορές',
          paragraphs: [
            'Η κατηγορία αυτή περιλαμβάνει τη λύση της εργασιακής σχέσης, την αποζημίωση απόλυσης κατά το δίκαιο της Ταϊβάν (資遣費· δεν εξομοιώνεται με αντίστοιχους θεσμούς άλλων κρατών), τις αποδοχές και τις διαφορές από τη σύμβαση εργασίας (勞動契約), τόσο από την πλευρά του εργαζομένου όσο και από την πλευρά του εργοδότη. Κατά την εξέταση διακρίνουμε τον λόγο της λύσης από τα ζητήματα προειδοποίησης, καταβολής και προθεσμιών.',
            'Καθοριστικά έγγραφα είναι συνήθως η σύμβαση εργασίας, ο εσωτερικός κανονισμός (工作規則), οι μισθοδοτικές καταστάσεις και η αλληλογραφία των μερών. Αν τα διατηρείτε ακόμη, αναφέρετέ το στην περίληψη.',
          ],
        },
        {
          heading: 'Ποινικές υποθέσεις',
          paragraphs: [
            'Εκπροσωπούμε υπόπτους, κατηγορουμένους και παθόντες κατά την ποινική προανάκριση και ενώπιον του δικαστηρίου, και αξιολογούμε τους ποινικούς κινδύνους της επιχειρηματικής δραστηριότητας.',
            'Οι ποινικές υποθέσεις έχουν συχνά σύντομες προθεσμίες και καθορισμένα στάδια. Αν έχετε ήδη λάβει έγγραφο από την ανακριτική αρχή ή από το δικαστήριο, αναφέρετε εγκαίρως την ημερομηνία του εγγράφου, ώστε το περιεχόμενο να εξεταστεί με τη σωστή σειρά.',
          ],
        },
        {
          heading: 'Διανοητική ιδιοκτησία',
          paragraphs: [
            'Υποστηρίζουμε την καταχώριση σημάτων (商標) και διπλωμάτων ευρεσιτεχνίας (專利), τα πνευματικά δικαιώματα και τις διαφορές για τα δικαιώματα αυτά στην Ταϊβάν.',
            'Στην κατηγορία αυτή καθοριστική είναι η σειρά των βημάτων: το εύρος της προστασίας, ο χρόνος της κατάθεσης και η πραγματική χρήση επηρεάζουν την επιλογή. Η κατάθεση αίτησης δεν σημαίνει από μόνη της ότι θα γίνει δεκτή.',
          ],
        },
        {
          heading: 'Το αντικείμενο της εντολής και η επιβεβαίωσή του',
          paragraphs: [
            'Το γραφείο εργάζεται κατά το δίκαιο της Ταϊβάν και χειρίζεται υποθέσεις των κατηγοριών που αναφέρθηκαν. Το εύρος κάθε υπόθεσης επιβεβαιώνεται χωριστά, αφού δικηγόρος εξετάσει το μήνυμά σας.',
            'Το καθεστώς διαμονής, η άδεια εργασίας και παρόμοια ζητήματα κρίνονται από τα έγγραφα και από την κατάσταση του προσώπου, όχι από την ιθαγένεια. Αν μέρος της υπόθεσής σας άπτεται αυτών των σημείων, αναφέρετέ το κατά την επικοινωνία. Η σελίδα αυτή δεν υπόσχεται ούτε αποτέλεσμα ούτε προθεσμία απάντησης.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'ΤΟ ΓΡΑΦΕΙΟ',
      title: 'Σχετικά με τη Hovering International Law Firm',
      description:
        'Βασικά στοιχεία για αυτό το ταϊβανέζικο δικηγορικό γραφείο, για τα γραφεία του και για την εργασία με αλλοδαπά μέρη.',
      intro:
        'Η Hovering International Law Firm είναι δικηγορικό γραφείο στην Ταϊβάν. Οι δικηγόροι μας συμβουλεύουν επιχειρήσεις και τις εκπροσωπούν στο δικαστήριο. Η σελίδα αυτή περιγράφει την ίδρυση του γραφείου, τα γραφεία του και την εργασία με αλλοδαπά μέρη.',
      sections: [
        {
          heading: 'Ίδρυση και δομή',
          paragraphs: [
            'Η Hovering International Law Firm (昊鼎國際法律事務所) ιδρύθηκε το 2016 από δικηγόρους που σπούδασαν στο National Taiwan University (國立臺灣大學). Η κινεζική ονομασία 昊鼎 συνδέει τον χαρακτήρα 昊 («πλατύς ουρανός») με τον χαρακτήρα 鼎 («στέρεο θεμέλιο») και περιγράφει τον προσανατολισμό του γραφείου από την ίδρυσή του.',
            'Διατηρούμε γραφεία στην Ταϊπέι (臺北), στο Καοσιούνγκ (高雄), στο Ταϊτσούνγκ (臺中) και στο Πινγκτούνγκ (屏東). Το γραφείο στο Καοσιούνγκ εστιάζει σε θέματα εταιρικής διοίκησης και χειρίζεται αστικές, ποινικές και διοικητικές διαφορές. Το γραφείο στο Ταϊτσούνγκ χειρίζεται υποθέσεις κατασκευών, διανοητικής ιδιοκτησίας και υποθέσεις με δεσμό προς την Κορέα και την Ιαπωνία. Το γραφείο στο Πινγκτούνγκ άνοιξε το 2017 για τις τοπικές ανάγκες.',
            'Πέρα από τη δικηγορική εργασία λειτουργεί από το 2020 και το Hovering Accounting Office, που προσφέρει λογιστική και φορολογικό σχεδιασμό σε επιχειρηματίες και σε ιδιώτες με περιουσία.',
          ],
        },
        {
          heading: 'Εργασία με αλλοδαπά μέρη',
          paragraphs: [
            'Η διασυνοριακή εργασία περιλαμβάνει σύσταση εταιρειών, θεωρήσεις εισόδου, καταθέσεις σημάτων και διπλωμάτων ευρεσιτεχνίας, έλεγχο νομικού κινδύνου και φορολογική συμβουλευτική επιχειρήσεων. Το γραφείο στο Ταϊτσούνγκ χειρίζεται ιδίως υποθέσεις κατασκευών, διανοητικής ιδιοκτησίας και υποθέσεις με δεσμό προς την Κορέα και την Ιαπωνία. Η δικηγόρος Wei Tseng (曾雋崴) αναλαμβάνει υποθέσεις εντολέων από την Κορέα και την Ιαπωνία, καθώς και άλλων διεθνών εντολέων, στις κατηγορίες που αναφέρθηκαν.',
            'Το αν μπορούμε να αναλάβουμε μια υπόθεση εξαρτάται από το περιεχόμενο και από τη γλώσσα της επικοινωνίας. Αν η υπόθεσή σας εμπίπτει στις κατηγορίες που αναφέρθηκαν και μπορεί να συζητηθεί σε μία από τις τέσσερις γλώσσες συμβουλευτικής, μπορείτε να στείλετε περίληψη προς εξέταση.',
          ],
        },
        {
          heading: 'Όταν επικοινωνείτε μαζί μας',
          paragraphs: [
            'Μετά την άφιξη της περίληψής σας, δικηγόρος εξετάζει το περιεχόμενο και μιλά κατόπιν για το πιθανό αντικείμενο της εντολής, για τα έγγραφα που χρειάζονται ακόμη και για τα επόμενα βήματα. Σε φορολογικά ή λογιστικά ζητήματα το γραφείο μπορεί να εργαστεί από κοινού με το λογιστικό τμήμα.',
            'Η έκβαση κάθε υπόθεσης εξαρτάται από τα πραγματικά περιστατικά και από τα διαθέσιμα έγγραφα· δεν υποσχόμαστε αποτέλεσμα. Αν χρειάζεστε δεσμευτική απάντηση για την κατάστασή σας, τα έγγραφα πρέπει να συζητηθούν σε μία από τις τέσσερις γλώσσες συμβουλευτικής με δικηγόρο.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ΔΙΚΗΓΟΡΟΙ',
      title: 'Η διεθνής ομάδα της Hovering',
      description: 'Προφίλ των δικηγόρων, της νομικής συνεργάτιδας, του υπευθύνου λειτουργιών και του συνεργαζόμενου λογιστή της Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'ΚΟΣΤΟΣ',
      title: 'Πώς καθορίζονται το αντικείμενο της εντολής και το κόστος',
      description:
        'Εξήγηση της σειράς: πρώτα το αντικείμενο της εντολής, έπειτα η επιβεβαίωση του κόστους, και γιατί η σελίδα αυτή δεν περιέχει τιμοκατάλογο.',
      intro:
        'Η σελίδα αυτή εξηγεί πώς καθορίζεται το κόστος, όχι το ύψος του. Το ύψος εξαρτάται από το αντικείμενο της εντολής στη συγκεκριμένη υπόθεση και έχει νόημα μόνο όταν το εύρος αυτό είναι σαφές.',
      sections: [
        {
          heading: 'Πρώτα καθορίζεται το αντικείμενο της εντολής',
          paragraphs: [
            'Υποθέσεις του ίδιου είδους μπορεί να απαιτούν πολύ διαφορετική προσπάθεια, ανάλογα με τον αριθμό των μερών, τα διαθέσιμα έγγραφα, τις προθεσμίες που πρέπει να τηρηθούν και το αν έχει ήδη αρχίσει διαδικασία. Γι’ αυτό το πρώτο βήμα είναι πάντοτε να καθοριστεί τι ανήκει στην εργασία και τι όχι.',
            'Η περίληψη που στέλνετε στην αρχή είναι η βάση αυτού του αντικειμένου. Όσο σαφέστερα περιγράφει την εξέλιξη, το αίτημά σας και τις προθεσμίες, τόσο ακριβέστερα μπορεί να προσδιοριστεί το αντικείμενο.',
          ],
        },
        {
          heading: 'Το κόστος επιβεβαιώνεται πριν αρχίσει η εργασία',
          paragraphs: [
            'Όταν το αντικείμενο της εντολής είναι σαφές, το ύψος και ο τρόπος υπολογισμού του κόστους συζητούνται και επιβεβαιώνονται μαζί σας πριν αρχίσει η εργασία. Αν το αντικείμενο μεταβληθεί στην πορεία, πρέπει να επιβεβαιωθεί εκ νέου.',
            'Η σελίδα αυτή δεν είναι προσφορά τιμής και δεν δημιουργεί υποχρέωση πληρωμής.',
          ],
        },
        {
          heading: 'Η συμβουλευτική μπορεί να είναι με αμοιβή',
          paragraphs: [
            'Η συμβουλευτική με δικηγόρο μπορεί να είναι υπηρεσία με αμοιβή. Η σελίδα αυτή δεν λέει ότι η πρώτη συζήτηση είναι δωρεάν, και τίποτα σε αυτή τη σελίδα δεν πρέπει να εκληφθεί έτσι.',
            'Αν η συμβουλευτική είναι με αμοιβή, το ύψος και ο τρόπος πληρωμής γνωστοποιούνται πριν αυτή λάβει χώρα.',
          ],
        },
        {
          heading: 'Γιατί η σελίδα αυτή δεν αναφέρει τιμές',
          paragraphs: [
            'Το κόστος εξαρτάται από την ίδια την υπόθεση: από την προσπάθεια, τον αριθμό των μερών, τα έγγραφα, τις προθεσμίες και από το αν εκκρεμεί ήδη διαδικασία. Ένας αριθμός ορισμένος εκ των προτέρων δεν θα έδειχνε το κόστος του δικού σας φακέλου. Γι’ αυτό καθορίζουμε πρώτα το αντικείμενο της εντολής και σας γνωστοποιούμε κατόπιν το κόστος, πριν αρχίσει η εργασία.',
            'Πέρα από την αμοιβή μπορεί να προκύψουν δικαστικά τέλη, έξοδα αρχών ή τρίτων. Αυτά είναι χωριστά από την αμοιβή και εξαρτώνται από την εκάστοτε διαδικασία.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'ΕΠΙΚΟΙΝΩΝΙΑ',
      title: 'Πώς να επικοινωνήσετε με το γραφείο',
      description:
        'Η γλώσσα της σελίδας, οι γλώσσες της συμβουλευτικής, τι ισχύει αν δεν μιλάτε καμία από τις τέσσερις γλώσσες, και τι δεν υπόσχεται η σελίδα αυτή.',
      intro:
        'Πριν μας γράψετε, ξεχωρίστε τα ακόλουθα τρία σημεία. Συχνά συγχέονται, αλλά σημαίνουν διαφορετικά πράγματα.',
      sections: [
        {
          heading: 'Τρία πράγματα που πρέπει να μένουν χωριστά',
          paragraphs: [
            'Η γλώσσα εμφάνισης της σελίδας, η γλώσσα της συμβουλευτικής με δικηγόρο και η γλώσσα στην οποία γράφετε είναι τρία διαφορετικά πράγματα.',
          ],
          items: [
            'Γλώσσα της σελίδας: οι πληροφορίες αυτές είναι γραμμένες στα ελληνικά.',
            'Γλώσσα της συμβουλευτικής: η συμβουλευτική διεξάγεται στα αγγλικά, κινεζικά (中文), ιαπωνικά και κορεατικά.',
            'Η γλώσσα στην οποία γράφετε: μπορείτε να γράψετε την περίληψη στη γλώσσα σας· το πρωτότυπο κείμενο διατηρείται αμετάβλητο.',
          ],
        },
        {
          heading: 'Αν δεν μιλάτε καμία από τις τέσσερις γλώσσες συμβουλευτικής',
          paragraphs: [
            'Στη φόρμα επικοινωνίας μπορείτε να επιλέξετε «Ο τρόπος επικοινωνίας χρειάζεται επιβεβαίωση». Απαντούμε για να εξετάσουμε έναν εφικτό τρόπο επικοινωνίας, αν υπάρχει τέτοιος· υπηρεσία σε άλλη γλώσσα δεν είναι εγγυημένη, ούτε δίνεται υπόσχεση για προθεσμία απάντησης.',
            'Αυτό είναι μόνο ένα βήμα εξέτασης, όχι υπόσχεση. Δεν υποσχόμαστε ούτε διερμηνέα, ούτε υπηρεσία στα ελληνικά ή σε άλλη γλώσσα εκτός των τεσσάρων που αναφέρθηκαν, ούτε ότι αναλαμβάνουμε κάθε υπόθεση.',
          ],
        },
        {
          heading: 'Τι πρέπει να περιέχει το πρώτο μήνυμα',
          paragraphs: [
            'Αναφέρετε τι συνέβη, ποια βοήθεια χρειάζεστε, ποιον δεσμό έχει η υπόθεση με την Ταϊβάν και την προθεσμία, αν τη γνωρίζετε. Αν έχετε ήδη λάβει έγγραφο δικαστηρίου ή αρχής, αναφέρετε την ημερομηνία του εγγράφου.',
            'Στο αρχικό στάδιο δεν χρειάζεται ακόμη να στείλετε αριθμό διαβατηρίου, αριθμό ταυτότητας, στοιχεία λογαριασμού, ιατρικά έγγραφα ή το σύνολο των αποδεικτικών στοιχείων. Περιμένετε τις οδηγίες της δικηγόρου ή του δικηγόρου και στείλτε τότε τα ευαίσθητα έγγραφα με ασφαλή τρόπο.',
          ],
        },
        {
          heading: 'Τι δεν υπόσχεται η σελίδα αυτή',
          paragraphs: [
            'Δεν υποσχόμαστε προθεσμία απάντησης, δεν επιβεβαιώνουμε ραντεβού μέσω αυτής της σελίδας, δεν υποσχόμαστε συγκεκριμένο δικηγόρο και δεν παρέχουμε διερμηνέα. Η γραπτή μετάφραση είναι άλλο ζήτημα: το μήνυμά σας δεν μεταφράζεται αυτόματα.',
            'Αν στείλετε αίτημα, το περιεχόμενο διατηρείται και αναμένει εξέταση. Αν μετά από κάποιο διάστημα δεν λάβετε απάντηση, μπορείτε να γράψετε ξανά στη διεύθυνση ηλεκτρονικού ταχυδρομείου που αναφέρεται στη σελίδα επικοινωνίας.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'ΕΡΩΤΗΣΕΙΣ',
      title: 'Συχνές ερωτήσεις',
      description:
        'Εξηγήσεις για το αντικείμενο της εντολής, την προετοιμασία, τις γλώσσες, το κόστος και για το τι σημαίνει ένα αίτημα που έχει σταλεί.',
      intro:
        'Στις ακόλουθες ερωτήσεις απαντάμε στο επίπεδο γενικών πληροφοριών. Απάντηση για τη δική σας υπόθεση είναι δυνατή μόνο αφού δικηγόρος εξετάσει τα έγγραφα.',
      sections: [
        {
          heading: 'Πώς να χρησιμοποιήσετε αυτές τις σελίδες',
          paragraphs: [
            'Αν δεν βρείτε απάντηση για την κατάστασή σας, η απάντηση εξαρτάται κατά κανόνα από ιδιαίτερα πραγματικά περιστατικά. Γράψτε τότε τα περιστατικά αυτά στην περίληψη, αντί να συναγάγετε την απάντηση από αυτή τη σελίδα.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Ποιες υποθέσεις χειρίζεται το γραφείο;',
          answer:
            'Χειριζόμαστε έξι τομείς δραστηριότητας: επενδύσεις και σύσταση εταιρειών στην Ταϊβάν, αστικές διαφορές και αποζημίωση, γάμο, οικογένεια και κληρονομικά, εργατικές διαφορές, ποινικές υποθέσεις και διανοητική ιδιοκτησία. Το αν μια υπόθεση γίνεται δεκτή κρίνεται μετά την εξέταση του περιεχομένου.',
        },
        {
          question: 'Τι πρέπει να ετοιμάσω πριν την επικοινωνία;',
          answer:
            'Ετοιμάστε σύντομη περίληψη της εξέλιξης, του αιτήματός σας, του δεσμού με την Ταϊβάν και της προθεσμίας, αν υπάρχει. Αν υπάρχει ήδη έγγραφο δικαστηρίου ή αρχής, αναφέρετε την ημερομηνία. Στο στάδιο αυτό δεν χρειάζεται ακόμη να στείλετε έγγραφα ταυτότητας ή το σύνολο των αποδεικτικών στοιχείων.',
        },
        {
          question: 'Είναι δυνατή η συμβουλευτική στα ελληνικά;',
          answer:
            'Όχι. Οι πληροφορίες αυτές είναι γραμμένες στα ελληνικά, αλλά η συμβουλευτική με δικηγόρο διεξάγεται μόνο στα αγγλικά, κινεζικά (中文), ιαπωνικά και κορεατικά. Ούτε διερμηνέα υποσχόμαστε. Η γραπτή μετάφραση είναι άλλο ζήτημα: το πρωτότυπο κείμενο που γράφετε διατηρείται όπως είναι και δεν μεταφράζεται αυτόματα.',
        },
        {
          question: 'Τι κάνω αν δεν μιλάω καμία από τις τέσσερις γλώσσες;',
          answer:
            'Κατά την αποστολή του αιτήματος επιλέξτε «Ο τρόπος επικοινωνίας χρειάζεται επιβεβαίωση». Απαντούμε για να εξετάσουμε έναν τρόπο επικοινωνίας, αλλά υπηρεσία σε άλλη γλώσσα δεν είναι εγγυημένη. Αυτό είναι βήμα εξέτασης, όχι υπόσχεση ότι μπορούμε να εργαστούμε σε άλλη γλώσσα.',
        },
        {
          question: 'Πώς αντιμετωπίζεται το ελληνικό μου κείμενο;',
          answer:
            'Το πρωτότυπο κείμενο που γράφετε διατηρείται όπως είναι και δεν μεταφράζεται αυτόματα. Αν χρειαστεί, η γλώσσα της περαιτέρω επικοινωνίας επιβεβαιώνεται μαζί σας.',
        },
        {
          question: 'Έχει ήδη γίνει η συμβουλευτική με την αποστολή του αιτήματος;',
          answer:
            'Όχι. Ένα αίτημα που έχει σταλεί αναμένει την εξέταση από δικηγόρο. Δεν είναι νομική γνώμη, δεν είναι επιβεβαιωμένο ραντεβού, και η αποστολή δεν δημιουργεί από μόνη της σχέση δικηγόρου και εντολέα.',
        },
        {
          question: 'Πώς υπολογίζεται το κόστος;',
          answer:
            'Πρώτα καθορίζεται το αντικείμενο της εντολής, έπειτα το ύψος και ο τρόπος υπολογισμού του κόστους επιβεβαιώνονται μαζί σας πριν αρχίσει η εργασία. Η σελίδα αυτή δεν αναφέρει ποσά και δεν λέει ότι η πρώτη συζήτηση είναι δωρεάν.',
        },
        {
          question: 'Τι κάνω αν η υπόθεσή μου είναι πολύ επείγουσα;',
          answer:
            'Αναφέρετε την προθεσμία ή την ημερομηνία επίσημου εγγράφου στην αρχή της περίληψης, ώστε οι ημερομηνίες αυτές να φαίνονται κατά την εξέταση. Η σελίδα αυτή δεν έχει δίαυλο έκτακτης ανάγκης και δεν εξασφαλίζει προθεσμία απάντησης· αν η υπόθεσή σας δεν αντέχει αναμονή, θα πρέπει να αναζητήσετε παράλληλα βοήθεια και στον τόπο σας.',
        },
      ],
    },
    privacy: {
      eyebrow: 'ΑΠΟΡΡΗΤΟ',
      title: 'Δεδομένα που συλλέγει η φόρμα επικοινωνίας',
      description:
        'Τι συλλέγει η φόρμα επικοινωνίας σε αυτές τις ελληνικές σελίδες, πώς αντιμετωπίζεται το πρωτότυπο κείμενο και πώς να επικοινωνήσετε μαζί μας για τα δεδομένα σας.',
      intro:
        'Η ενότητα αυτή αφορά μόνο τη φόρμα επικοινωνίας σε αυτές τις σελίδες πληροφοριών. Περιγράφει τη μεταχείριση των δεδομένων, όχι τεχνική εγγύηση.',
      sections: [
        {
          heading: 'Ποια δεδομένα συλλέγονται',
          paragraphs: [
            'Όταν στέλνετε αίτημα μέσω της φόρμας σε αυτές τις σελίδες, καταγράφονται τα ακόλουθα δεδομένα:',
          ],
          items: [
            'Το όνομα που δηλώνετε',
            'Η διεύθυνση ηλεκτρονικού ταχυδρομείου για την απάντηση',
            'Η γλώσσα εμφάνισης της σελίδας κατά τη στιγμή της αποστολής',
            'Η γλώσσα στην οποία γράψατε',
            'Η γλώσσα της συμβουλευτικής που επιθυμείτε',
            'Το πρωτότυπο κείμενο που γράψατε',
            'Η συγκατάθεσή σας για την αποστολή του αιτήματος',
            'Ένας αριθμός πρωτοκόλλου για την ανεύρεση του αιτήματος',
          ],
        },
        {
          heading: 'Το πρωτότυπο κείμενο διατηρείται αμετάβλητο',
          paragraphs: [
            'Το κείμενό σας διατηρείται ακριβώς όπως το γράψατε και δεν μεταφράζεται αυτόματα. Αν για τον χειρισμό χρειάζεται μετάφραση, αυτό συζητείται μαζί σας χωριστά.',
            'Επειδή το πρωτότυπο κείμενο διατηρείται, στο αρχικό στάδιο μη γράφετε ό,τι δεν είναι ακόμη απαραίτητο, για παράδειγμα τον αριθμό διαβατηρίου, τον αριθμό ταυτότητας ή στοιχεία λογαριασμού.',
          ],
        },
        {
          heading: 'Χώρος αποθήκευσης και πρόσβαση',
          paragraphs: [
            'Το περιεχόμενο της αποστολής σας αποθηκεύεται σε χώρο που δεν είναι προσβάσιμος στο κοινό. Πρόσβαση έχουν μόνο εξουσιοδοτημένα πρόσωπα του γραφείου, για τον χειρισμό του αιτήματος.',
            'Η σελίδα αυτή δεν δίνει απόλυτη εγγύηση ασφάλειας. Κανένα μέσο μετάδοσης και κανένας χώρος αποθήκευσης δεν είναι απολύτως ασφαλής· τα ευαίσθητα έγγραφα θα πρέπει επομένως να αποστέλλονται μόνο μετά από ειδική οδηγία της δικηγόρου ή του δικηγόρου.',
          ],
        },
        {
          heading: 'Σκοπός της χρήσης',
          paragraphs: [
            'Τα δεδομένα που στέλνονται χρησιμεύουν στην εξέταση του αιτήματος, στην απάντηση προς εσάς, στην αποσαφήνιση του τρόπου επικοινωνίας και στον χειρισμό, αν η εργασία αναληφθεί.',
            'Τα δεδομένα δεν χρησιμοποιούνται για εμπορική προώθηση χωρίς χωριστή συγκατάθεση.',
          ],
        },
        {
          heading: 'Ειδοποίηση και αριθμός πρωτοκόλλου',
          paragraphs: [
            'Αν ένα αίτημα σταλεί επιτυχώς, το σύστημα ειδοποιεί το γραφείο. Αν η ειδοποίηση αυτή δεν φτάσει στο γραφείο, το κείμενό σας παραμένει φυλαγμένο και δεν χάνεται.',
            'Ο αριθμός πρωτοκόλλου χρησιμεύει στην ανεύρεση του αιτήματός σας στα αρχεία μας. Εμφανίζεται μετά τη φύλαξη· μπορείτε να τον αναφέρετε σε νέα επικοινωνία.',
          ],
        },
        {
          heading: 'Τα δικαιώματά σας και ο τρόπος επικοινωνίας',
          paragraphs: [
            'Μπορείτε να ζητήσετε πρόσβαση στα δεδομένα σας, διόρθωση ή διαγραφή τους ή να ανακαλέσετε τη συγκατάθεση, μέσω της διεύθυνσης ηλεκτρονικού ταχυδρομείου που αναφέρεται στη σελίδα επικοινωνίας. Αν υπάρχει νόμιμη ή δικονομική υποχρέωση φύλαξης, εξηγούμε τον περιορισμό.',
            'Η σελίδα αυτή δεν αναφέρει σταθερή διάρκεια φύλαξης, επειδή η πραγματική διάρκεια εξαρτάται από την περαιτέρω πορεία της υπόθεσης και από τις συναφείς υποχρεώσεις. Αν θέλετε τα δεδομένα να διαγραφούν νωρίτερα, αναφέρετέ το κατά την επικοινωνία.',
          ],
        },
        {
          heading: 'Χώρος αποθήκευσης και πάροχοι',
          paragraphs: [
            'Ο ιστότοπος αυτός φιλοξενείται στη Vercel, και η αποστολή σας φυλάσσεται σε ιδιωτικό χώρο αποθήκευσης της ίδιας υπηρεσίας. Τα μηνύματα ηλεκτρονικού ταχυδρομείου αποστέλλονται μέσω της υπηρεσίας ηλεκτρονικού ταχυδρομείου που χρησιμοποιεί το γραφείο.',
            'Οι διακομιστές ορισμένων παρόχων μπορεί να βρίσκονται εκτός Ταϊβάν, οπότε τα δεδομένα σας μπορεί να φυλάσσονται και να υποβάλλονται σε επεξεργασία εκεί. Όταν ο σκοπός της φύλαξης εκπληρωθεί, τα δεδομένα διαγράφονται χωρίς καθυστέρηση· τα δεδομένα που πρέπει να φυλάσσονται κατά τους εφαρμοστέους κανόνες παραμένουν για το διάστημα αυτό. Τα αιτήματα για δεδομένα προσωπικού χαρακτήρα υποβάλλονται στη διεύθυνση wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'ΑΠΟΠΟΙΗΣΗ ΕΥΘΥΝΗΣ',
      title: 'Εύρος και όρια των πληροφοριών αυτής της σελίδας',
      description:
        'Ο γενικός χαρακτήρας των πληροφοριών, το νομικό πλαίσιο και οι προϋποθέσεις γένεσης σχέσης δικηγόρου και εντολέα.',
      intro:
        'Η ενότητα αυτή αποσαφηνίζει τι μπορούν να κάνουν για εσάς αυτές οι ελληνικές σελίδες πληροφοριών και τι όχι.',
      sections: [
        {
          heading: 'Μόνο γενικές πληροφορίες',
          paragraphs: [
            'Το περιεχόμενο των σελίδων αυτών είναι γραμμένο ως γενική ενημέρωση. Δεν είναι νομική συμβουλή για τη δική σας υπόθεση και δεν υποκαθιστά την εξέταση των εγγράφων σας.',
            'Η έκβαση μιας υπόθεσης εξαρτάται από τα πραγματικά περιστατικά, από τους εφαρμοστέους κανόνες και από τη χρονική στιγμή· δύο φαινομενικά όμοιες καταστάσεις μπορεί να καταλήξουν διαφορετικά.',
          ],
        },
        {
          heading: 'Νομικό πλαίσιο',
          paragraphs: [
            'Το γραφείο δραστηριοποιείται κατά το δίκαιο της Ταϊβάν, και η σελίδα αυτή μιλά μόνο για την εργασία μέσα σε αυτό το πλαίσιο.',
            'Το περιεχόμενο δεν αποτελεί συμβουλή κατά το δίκαιο άλλης έννομης τάξης πλην της ταϊβανέζικης, περιλαμβανομένου του δικαίου του τόπου διαμονής σας. Αν μέρος της υπόθεσής σας αφορά άλλη έννομη τάξη, θα αποσαφηνίσουμε μαζί σας ποιο ειδικευμένο πρόσωπο χρειάζεται για το μέρος αυτό.',
          ],
        },
        {
          heading: 'Η σχέση δικηγόρου και εντολέα δεν γεννιέται από μόνη της',
          paragraphs: [
            'Η ανάγνωση της σελίδας αυτής, η αποστολή φόρμας ή μηνύματος ηλεκτρονικού ταχυδρομείου δεν δημιουργεί από μόνη της σχέση δικηγόρου και εντολέα.',
            'Η σχέση αυτή γεννιέται μόνο αφού η υπόθεση εξεταστεί και αμφότερα τα μέρη επιβεβαιώσουν την ανάληψη της εργασίας.',
          ],
        },
        {
          heading: 'Καμία υπόσχεση αποτελέσματος',
          paragraphs: [
            'Κανένα μέρος της σελίδας αυτής δεν αποτελεί υπόσχεση για την έκβαση υπόθεσης, για την αποδοχή αίτησης ή για το καθεστώς διαμονής και εργασίας.',
            'Οι εξωτερικοί σύνδεσμοι χρησιμεύουν στον προσανατολισμό· δεν υποσχόμαστε ούτε την ορθότητα ούτε την επικαιρότητα περιεχομένου τρίτων.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ΑΡΘΡΑ',
      title: 'Άρθρα για το δίκαιο της Ταϊβάν',
      description:
        'Άρθρα στα ελληνικά για συχνά ερωτήματα του δικαίου της Ταϊβάν. Το περιεχόμενο είναι γενική ενημέρωση κατά τον χρόνο της δημοσίευσης, όχι νομική συμβουλή για τη δική σας υπόθεση.',
      intro:
        'Το γραφείο δημοσιεύει άρθρα για συχνά ερωτήματα του δικαίου της Ταϊβάν. Τα άρθρα που είναι διαθέσιμα στα ελληνικά βρίσκονται σε αυτή τη σελίδα· δίπλα υπάρχουν τέσσερις σύνδεσμοι, καθένας από τους οποίους ανοίγει τον κατάλογο άρθρων μιας γλώσσας πρωτοτύπου.',
      sections: [
        {
          heading: 'Τέσσερις κατάλογοι κατά γλώσσα',
          paragraphs: [
            'Η ενότητα αυτή περιέχει τέσσερις συνδέσμους: τον κατάλογο άρθρων στα κορεατικά, στα κινεζικά, στα αγγλικά και στα ιαπωνικά. Κάθε σύνδεσμος αναφέρει τη γλώσσα του καταλόγου, ώστε να γνωρίζετε εκ των προτέρων σε ποια γλώσσα ανοίγει το περιεχόμενο.',
            'Οι τέσσερις αυτοί κατάλογοι είναι κατάλογοι κατά τη γλώσσα του πρωτοτύπου των άρθρων, όχι κατάλογοι μεταφράσεων. Τα άρθρα που είναι διαθέσιμα στα ελληνικά βρίσκονται χωριστά σε αυτή τη σελίδα.',
          ],
        },
        {
          heading: 'Πού οδηγούν οι σύνδεσμοι',
          paragraphs: [
            'Αν επιλέξετε έναν από τους τέσσερις συνδέσμους, ανοίγει ο κατάλογος άρθρων εκείνης της γλώσσας. Από τον κατάλογο επιλέγετε εσείς το κείμενο· όλο το περιεχόμενο εμφανίζεται στη γλώσσα του πρωτοτύπου του άρθρου.',
            'Η σελίδα αυτή δεν συνοψίζει το περιεχόμενο των άρθρων και δεν εγγυάται ότι ένα θέμα είναι διαθέσιμο και στις τέσσερις γλώσσες. Κάθε κατάλογος περιέχει μόνο κείμενα που δημοσιεύτηκαν σε εκείνη τη γλώσσα.',
          ],
        },
        {
          heading: 'Σε ποιον βαθμό ένα άρθρο μπορεί να χρησιμεύσει ως προσανατολισμός',
          paragraphs: [
            'Τα άρθρα είναι γενικές πληροφορίες κατά τον χρόνο της δημοσίευσης. Οι κανόνες και η εφαρμογή τους μπορεί να μεταβληθούν, και ένα άρθρο δεν καλύπτει όλες τις περιστάσεις της υπόθεσής σας.',
            'Γι’ αυτό μην προβαίνετε σε ενέργειες για πραγματική υπόθεση στηριζόμενοι μόνο σε ένα άρθρο. Χρησιμοποιήστε το για τη γενική εικόνα και συζητήστε τα έγγραφά σας χωριστά με δικηγόρο· η σελίδα αυτή δεν αποτελεί συμβουλευτική.',
          ],
        },
      ],
    },
  },
};

/**
 * Hebrew guidance pack (batch 5), right-to-left. Hebrew has grammatical gender,
 * so the pack addresses the reader with the neutral plural form used in formal
 * writing and names attorney Wei Tseng with the feminine עורכת הדין; the mixed
 * team is "עורכות ועורכי הדין".
 *
 * Wiring notes for this locale, beyond the usual registry entries:
 *  - `RTL_PUBLIC_LOCALES` and `isRtlDocumentLanguage()` in `public-guidance.ts`
 *    must both accept `he`; the second one currently hardcodes `ar`.
 *  - a Hebrew font loader is needed, as for Arabic and Devanagari — the shared
 *    Noto Sans latin loader has no Hebrew subset.
 * The existing `html[dir='rtl']` rules in `globals.css` were written for Arabic
 * and are script-agnostic, so they apply to Hebrew unchanged.
 */
export const hebrewGuidanceContent: GuidanceLocaleContent = {
  languageName: 'עברית',
  nav: {
    home: 'דף הבית',
    services: 'תחומים',
    about: 'המשרד',
    lawyers: 'עורכי דין',
    pricing: 'עלויות',
    contact: 'יצירת קשר',
    faq: 'שאלות',
    privacy: 'פרטיות',
    disclaimer: 'הסתייגויות',
    columns: 'מאמרים',
  },
  contactCta: 'שליחת פנייה לבדיקה',
  footerNotice:
    'עמוד זה בעברית כולל מידע כללי בלבד על עבודת המשרד לפי דין טאיוואן. אין בו ייעוץ משפטי בעניין מסוים, ושליחת הודעה כשלעצמה אינה יוצרת יחסי עורך דין–לקוח.',
  skipLink: 'דילוג על הניווט ומעבר לתוכן',
  menuLabel: 'רשימת העמודים',
  languageLabel: 'שפת התצוגה',
  mega: {
    services: {
      description: 'המשרד מטפל בתחומי העיסוק המרכזיים לפי דין טאיוואן.',
      viewAllLabel: 'הצגת הכול',
    },
    columns: {
      description: 'מאמרים על שאלות נפוצות בדין טאיוואן.',
      viewAllLabel: 'הצגת הכול',
    },
    lawyers: {
      description: 'הצגת עורכות ועורכי הדין ודרכי הפנייה.',
      viewAllLabel: 'הצגת הכול',
    },
    pricing: {
      description: 'עמוד זה מסביר את היקף העבודה ואת אופן בירור העלויות.',
      viewAllLabel: 'הצגת הכול',
    },
    faq: {
      description: 'שאלות נפוצות על עבודת המשרד בטאיוואן.',
      viewAllLabel: 'הצגת הכול',
    },
  },
  notFoundTitle: 'העמוד לא נמצא',
  notFoundText:
    'העמוד המבוקש אינו קיים או שהועבר. אפשר לחזור לעמוד הפתיחה בעברית ולעיין במידע הזמין.',
  backHomeLabel: 'לעמוד הפתיחה',
  readSourceLabel: 'פתיחת רשימת המאמרים בשפת המקור',
  home: {
    heroScrollLabel: 'גלילה למטה',
    heroColumnsCtaLabel: 'הצגת המאמרים',
    servicesDetailLabel: 'הצגת פרטים',
    servicesAssistanceBefore: 'אם אינכם בטוחים לאיזה תחום שייך העניין שלכם, העמוד ',
    servicesAssistanceLinkLabel: 'יצירת קשר',
    servicesAssistanceAfter: ' מסביר כיצד לנסח תקציר שעורכת דין או עורך דין יבדקו.',
    columnsViewAllLabel: 'הצגת כל המאמרים',
    columnsReadMoreLabel: 'המשך קריאה',
    columnsReviewLabel: 'נבדק בידי עורכת הדין Wei Tseng',
    columnsOriginalLanguageBadge: 'שפת המקור',
    columnsOriginalLanguageNote:
      'המאמרים הבאים אינם זמינים עדיין בעברית. הרשימה נשארת בשפת המקור ופותחת את עמוד השפה המתאים; התוכן אינו מתורגם אוטומטית.',
    imageBandAlt: 'חצר טאיוואנית מסורתית מסוג סאנהייוואן (三合院) וביתן מודרני באור יום',
    videoPauseLabel: 'השהיית הסרטון',
    videoPlayLabel: 'הפעלת הסרטון',
    videoReplayLabel: 'הפעלת הסרטון מחדש',
  },
  pages: {
    home: {
      eyebrow: 'מידע',
      title: 'שירותים משפטיים בטאיוואן — מידע בעברית',
      description:
        'הסברים כלליים בעברית על היקף העבודה של Hovering International Law Firm בטאיוואן, על שפות הייעוץ ועל הפנייה הראשונה.',
      intro:
        'Hovering International Law Firm מלווה לקוחות מחוץ לטאיוואן, ובכללם בעלי זיקה לטאיוואן, בעניינים לפי דין טאיוואן: השקעה והקמת חברות, סכסוכים אזרחיים, נישואין, משפחה וירושה, דיני עבודה, עניינים פליליים וקניין רוחני. החלק הזה בעברית יסייע לכם לזהות איזו עבודה נכללת בהיקף שלנו, מה להכין וכיצד לפנות אלינו. זהו מידע כללי, ולא ייעוץ משפטי בעניין שלכם.',
      sections: [
        {
          heading: 'במה אנו עוסקים',
          paragraphs: [
            'Hovering International Law Firm הוא משרד עורכי דין הפועל בטאיוואן. הוא עובד לפי דין טאיוואן ולו סניפים בטאיפיי (臺北), בקאושיונג (高雄), בטאיצ׳ונג (臺中) ובפינגטונג (屏東). אנו מייעצים לעסקים, מנהלים הליכים בבית המשפט ומלווים לקוחות מחוץ לטאיוואן בצעדים הנדרשים שם.',
            'כל התוכן כאן כללי. תוצאת עניין תלויה בעובדות, בכללים החלים ובעיתוי. מידע זה אינו מחליף שיחה עם עורכת דין או עורך דין על המסמכים שלכם.',
          ],
        },
        {
          heading: 'שפת העמוד ושפת הייעוץ אינן אותו דבר',
          paragraphs: [
            'עמוד זה כתוב בעברית, אך הייעוץ עם עורכת דין או עורך דין מתקיים רק בארבע שפות הייעוץ: אנגלית, סינית (中文), יפנית וקוריאנית. קריאת המידע בעברית אינה אומרת שהשיחה עם עורכת הדין או עורך הדין תתקיים בעברית.',
            'איננו מבטיחים מתורגמן, איננו מבטיחים מועד למענה, ואין פגישה הנקבעת דרך עמוד זה. אם אינכם יכולים להשתמש באף אחת מארבע השפות, העמוד "יצירת קשר" מסביר כיצד אנו בוחנים דרך תקשורת.',
          ],
        },
        {
          heading: 'תחומי העיסוק',
          paragraphs: [
            'היקף העבודה כולל את ששת תחומי העיסוק הבאים. העמוד "תחומים" מתאר כל תחום בפירוט רב יותר ומציין מה אינו מובטח.',
          ],
          items: [
            'השקעה והקמת חברות בטאיוואן',
            'סכסוכים אזרחיים ופיצויים',
            'נישואין, משפחה וירושה',
            'סכסוכי עבודה',
            'עניינים פליליים',
            'קניין רוחני: סימני מסחר, פטנטים וזכויות יוצרים',
          ],
        },
        {
          heading: 'היכן להתחיל',
          paragraphs: [
            'קראו את העמוד "תחומים" כדי לבדוק אם העניין שלכם נכלל בהיקף שלנו, ולאחר מכן את "עלויות" ואת "יצירת קשר", כדי לדעת כיצד נקבע ההיקף וכיצד מאושרות העלויות לפני תחילת העבודה.',
            'בשליחת ההודעה אפשר לכתוב את התקציר בשפתכם. הטקסט המקורי נשמר בדיוק כפי שנכתב ואינו מתורגם אוטומטית. הודעה שנשלחה היא פנייה הממתינה לבדיקה: אין זה ייעוץ ואין זו פגישה מאושרת.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'תחומים',
      title: 'באילו עניינים אנו מטפלים',
      description:
        'ששת תחומי העיסוק של המשרד בטאיוואן והגבולות שכדאי להכיר תחילה.',
      intro:
        'להלן תחומי העיסוק שבהם אנו מטפלים בפועל והשאלות העולות לעיתים קרובות בשלב הראשון. התיאור יסייע לכם להעריך אם העניין שלכם נכלל בהיקף שלנו; הוא כללי ואינו ניתוח משפטי של תיק מסוים.',
      sections: [
        {
          heading: 'השקעה והקמת חברות בטאיוואן',
          paragraphs: [
            'אנו מלווים משקיעים ועסקים זרים בהקמת חברה בטאיוואן או בניהולה: בחירת צורת ההתאגדות, הכנת מסמכים והגשתם, הזרמת הון, עניינים בנקאיים, בדיקת כתובת העסק ודרישות ענפיות. אנו מלווים גם בהנהלת חשבונות ובמיסוי הנובעים מההקמה ומהפעילות בטאיוואן.',
            'המסלול והמועדים משתנים לפי צורת ההתאגדות, המשקיע, הענף, הבנק והמסמכים הקיימים. הקמת חברה אינה מובילה כשלעצמה לאישור שהייה (居留) או להיתר עבודה (工作許可): אלה הליכים נפרדים, הנבחנים לפי מצבו של כל אדם.',
          ],
        },
        {
          heading: 'סכסוכים אזרחיים ופיצויים',
          paragraphs: [
            'תחום זה כולל סכסוכים חוזיים, פיצויים בשל עוולה וסכסוכי צרכנות. העבודה מתחילה בדרך כלל בציר זמן, בבדיקת המסמכים והראיות הקיימות, ורק לאחר מכן באים הצעדים הבאים.',
            'המועדים, ובכללם ההתיישנות, ושלמות הראיות מכתיבים את המהלך. ציינו אפוא את התאריכים הידועים מוקדם ככל האפשר. שמרו חוזים, הודעות, אישורי תשלום או תצלומים של המצב בשטח, והזכירו אותם בהודעה הראשונה.',
          ],
        },
        {
          heading: 'נישואין, משפחה וירושה',
          paragraphs: [
            'אנו מטפלים בגירושין (離婚), בחלוקת רכוש, בהפעלת זכויות ילדים קטינים ובנשיאה בחובותיהם (未成年子女權利義務之行使或負擔), בקשר עם הילד (會面交往) ובירושה (繼承), גם כאשר הצדדים או הנכסים מצויים במדינות שונות. עניינים משפחתיים חוצי גבולות מצריכים לעיתים קרובות בדיקה נוספת של מרשם התושבים (戶籍), של צורת המסמכים ושל כוחם הראייתי בטאיוואן.',
            'מאחר שעניינים משפחתיים כרוכים לעיתים קרובות במועדים ובהליכים מקבילים, על התקציר הראשון לציין את הקשר בין הצדדים, את מקום המגורים הנוכחי ואת ההליכים שכבר מתנהלים.',
          ],
        },
        {
          heading: 'סכסוכי עבודה',
          paragraphs: [
            'תחום זה כולל סיום יחסי עבודה, דמי פיטורים לפי דין טאיוואן (資遣費; אין להשוותם למוסדות דומים במדינות אחרות), שכר וסכסוכים מחוזה העבודה (勞動契約), הן מצד העובד והן מצד המעסיק. בבדיקה אנו מבחינים בין עילת הסיום לבין שאלות של הודעה מוקדמת, תשלום ומועדים.',
            'המסמכים המכריעים הם בדרך כלל חוזה העבודה, תקנון העבודה (工作規則), תלושי השכר והתכתובת בין הצדדים. אם הם עדיין ברשותכם, ציינו זאת בתקציר.',
          ],
        },
        {
          heading: 'עניינים פליליים',
          paragraphs: [
            'אנו מלווים בהליך החקירה ובבית המשפט, הן חשודים ונאשמים והן נפגעי עבירה, ובוחנים סיכונים פליליים בפעילות עסקית.',
            'לעניינים פליליים יש לעיתים קרובות מועדים קצרים ושלבים קבועים. אם כבר קיבלתם מסמך מרשות החקירה או מבית המשפט, ציינו בהקדם את התאריך הנקוב בו, כדי שהתוכן ייבדק בסדר הנכון.',
          ],
        },
        {
          heading: 'קניין רוחני',
          paragraphs: [
            'אנו מלווים ברישום סימני מסחר (商標) ופטנטים (專利), בזכויות יוצרים ובסכסוכים על זכויות אלה בטאיוואן.',
            'בתחום זה סדר הצעדים מכריע: היקף ההגנה, מועד ההגשה והשימוש בפועל משפיעים על הבחירה. הגשת בקשה אינה אומרת כשלעצמה שהיא תתקבל.',
          ],
        },
        {
          heading: 'ההיקף ואישורו',
          paragraphs: [
            'המשרד עובד לפי דין טאיוואן ומטפל בעניינים מתחומי העיסוק שצוינו. היקף כל עניין מאושר בנפרד לאחר שעורכת דין או עורך דין בדקו את ההודעה שלכם.',
            'מעמד שהייה, היתר עבודה ושאלות דומות נבחנים לפי המסמכים ולפי מצבו של האדם, ולא לפי אזרחות. אם חלק מהעניין שלכם נוגע לנקודות אלה, ציינו זאת בפנייה. עמוד זה אינו מבטיח תוצאה ואינו מבטיח מועד למענה.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'המשרד',
      title: 'על Hovering International Law Firm',
      description:
        'נתוני יסוד על משרד עורכי דין טאיוואני זה, על סניפיו ועל העבודה עם צדדים זרים.',
      intro:
        'Hovering International Law Firm הוא משרד עורכי דין בטאיוואן. עורכות ועורכי הדין עוסקים בייעוץ לעסקים ובניהול הליכים בבית המשפט. חלק זה מתאר את היווסדות המשרד, את מקומותיו ואת העבודה עם צדדים זרים.',
      sections: [
        {
          heading: 'ייסוד ומבנה',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) נוסד בשנת 2016 בידי עורכות ועורכי דין שלמדו ב־National Taiwan University (國立臺灣大學). השם הסיני 昊鼎 מחבר את הסימן 昊 ("שמיים רחבים") עם הסימן 鼎 ("יסוד איתן") ומתאר את כיוון המשרד מאז ייסודו.',
            'יש לנו סניפים בטאיפיי (臺北), בקאושיונג (高雄), בטאיצ׳ונג (臺中) ובפינגטונג (屏東). הסניף בקאושיונג מתמקד בניהול עסקים ומטפל בסכסוכים אזרחיים, פליליים ומנהליים. הסניף בטאיצ׳ונג מטפל בענייני בנייה, בקניין רוחני ובעניינים בעלי זיקה לקוריאה וליפן. הסניף בפינגטונג נפתח בשנת 2017 לצרכים המקומיים.',
            'לצד העבודה המשפטית פועל מאז שנת 2020 גם Hovering Accounting Office, המציע הנהלת חשבונות ותכנון מס ליזמים וליחידים אמידים.',
          ],
        },
        {
          heading: 'עבודה עם צדדים זרים',
          paragraphs: [
            'העבודה חוצת הגבולות כוללת הקמת חברות, אשרות, רישום סימני מסחר ופטנטים, בדיקת סיכון משפטי וייעוץ מס לעסקים. הסניף בטאיצ׳ונג מטפל במיוחד בענייני בנייה, בקניין רוחני ובעניינים בעלי זיקה לקוריאה וליפן. עורכת הדין Wei Tseng (曾雋崴) מלווה לקוחות מקוריאה, מיפן ולקוחות בין־לאומיים נוספים בתחומים שצוינו.',
            'קבלת עניין תלויה בתוכן ובשפת התקשורת. אם העניין שלכם נכלל בתחומים שצוינו וניתן לדון בו באחת מארבע שפות הייעוץ, אפשר לשלוח תקציר לבדיקה.',
          ],
        },
        {
          heading: 'כאשר אתם פונים אלינו',
          paragraphs: [
            'לאחר קבלת התקציר שלכם עורכת דין או עורך דין בודקים את התוכן, ולאחר מכן משוחחים על היקף העבודה האפשרי, על המסמכים הנדרשים עדיין ועל הצעדים הבאים. בעניינים של מס או הנהלת חשבונות יכול המשרד לעבוד עם מחלקת הנהלת החשבונות בהליך משותף.',
            'תוצאת כל עניין תלויה בעובדות ובמסמכים הקיימים; איננו מבטיחים תוצאה. אם דרושה לכם תשובה מחייבת למצבכם, יש לדון במסמכים באחת מארבע שפות הייעוץ עם עורכת דין או עורך דין.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'עורכי דין',
      title: 'הצוות הבין־לאומי של Hovering',
      description: 'פרופילים של עורכות ועורכי הדין, של ההנהלה התפעולית ושל רואה החשבון השותף של Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'עלויות',
      title: 'כיצד נקבעים היקף העבודה והעלויות',
      description:
        'לפי הסדר: תחילה היקף העבודה, אחר כך אישור העלויות, ומדוע אין בעמוד זה מחירון.',
      intro:
        'עמוד זה מסביר כיצד נקבעות העלויות, ולא מה גובהן. הגובה תלוי בהיקף העבודה בעניין המסוים, ויש לו משמעות רק כאשר היקף זה ברור.',
      sections: [
        {
          heading: 'תחילה נקבע היקף העבודה',
          paragraphs: [
            'עניינים מאותו סוג עשויים לדרוש מאמץ שונה מאוד, לפי מספר הצדדים, המסמכים הקיימים, המועדים שיש לעמוד בהם והשאלה אם כבר החל הליך. לפיכך הצעד הראשון הוא תמיד לקבוע מה נכלל בעבודה ומה אינו נכלל.',
            'התקציר שאתם שולחים בתחילה הוא הבסיס להיקף זה. ככל שיתאר ביתר בהירות את ההשתלשלות, את בקשתכם ואת המועדים, כך אפשר יהיה לקבוע את ההיקף בדיוק רב יותר.',
          ],
        },
        {
          heading: 'העלויות מאושרות לפני תחילת העבודה',
          paragraphs: [
            'כאשר היקף העבודה ברור, גובה העלויות ואופן חישובן נדונים ומאושרים עמכם לפני שהעבודה מתחילה. אם ההיקף משתנה במהלך העבודה, יש לאשר זאת מחדש.',
            'עמוד זה אינו הצעת מחיר ואינו יוצר חובת תשלום.',
          ],
        },
        {
          heading: 'הייעוץ עשוי להיות בתשלום',
          paragraphs: [
            'הייעוץ עם עורכת דין או עורך דין עשוי להיות שירות בתשלום. עמוד זה אינו אומר שהשיחה הראשונה היא ללא תשלום, ואין לקרוא אף חלק ממנו כאילו נאמר כך.',
            'אם הייעוץ הוא בתשלום, גובהו ואופן התשלום נמסרים לפני שהוא מתקיים.',
          ],
        },
        {
          heading: 'מדוע אין בעמוד זה תעריפים',
          paragraphs: [
            'העלויות תלויות בעניין עצמו: במאמץ, במספר הצדדים, במסמכים, במועדים ובשאלה אם כבר מתנהל הליך. מספר שנקבע מראש לא היה מראה את עלויות התיק שלכם. לפיכך אנו קובעים תחילה את היקף העבודה ומוסרים לכם את העלויות לאחר מכן, לפני שהעבודה מתחילה.',
            'מלבד שכר הטרחה עשויות להיווצר אגרות בית משפט, הוצאות רשויות או הוצאות של צדדים שלישיים. אלה נפרדות משכר הטרחה ותלויות בהליך הנוגע בדבר.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'יצירת קשר',
      title: 'כיצד לפנות אל המשרד',
      description:
        'שפת העמוד, שפות הייעוץ, מה לעשות אם אינכם יכולים להשתמש באף אחת מארבע השפות, ומה עמוד זה אינו מבטיח.',
      intro:
        'לפני שתכתבו לנו, הבחינו בין שלוש הנקודות הבאות. הן מעורבבות לעיתים קרובות, אך משמעותן שונה.',
      sections: [
        {
          heading: 'שלושה דברים שיש להפריד ביניהם',
          paragraphs: [
            'שפת התצוגה של העמוד, שפת הייעוץ עם עורכת הדין או עורך הדין והשפה שבה אתם כותבים הן שלושה דברים נפרדים.',
          ],
          items: [
            'שפת העמוד: מידע זה כתוב בעברית.',
            'שפת הייעוץ: הייעוץ מתקיים באנגלית, בסינית (中文), ביפנית ובקוריאנית.',
            'שפת הכתיבה שלכם: אפשר לכתוב את התקציר בשפתכם; הטקסט המקורי נשמר ללא שינוי.',
          ],
        },
        {
          heading: 'אם אינכם יכולים להשתמש באף אחת מארבע שפות הייעוץ',
          paragraphs: [
            'בטופס יצירת הקשר אפשר לבחור "יש לאשר את דרך התקשורת". אנו משיבים כדי לבחון דרך תקשורת מעשית, אם קיימת כזו; שירות בשפה אחרת אינו מובטח ומועד למענה אינו מובטח.',
            'זהו צעד בדיקה בלבד, ולא הבטחה. איננו מבטיחים מתורגמן, שירות בעברית או בשפה אחרת מלבד ארבע השפות שצוינו, ואיננו מבטיחים שנקבל כל עניין.',
          ],
        },
        {
          heading: 'מה צריכה לכלול ההודעה הראשונה',
          paragraphs: [
            'ציינו מה קרה, לאיזו עזרה אתם זקוקים, מהי זיקת העניין לטאיוואן, ואת המועד אם הוא ידוע לכם. אם כבר קיבלתם מסמך מבית משפט או מרשות, ציינו את התאריך הנקוב בו.',
            'בשלב הראשון אין צורך לשלוח עדיין מספר דרכון, מספר תעודה, פרטי חשבון, מסמכים רפואיים או את מכלול הראיות. המתינו להנחיית עורכת הדין או עורך הדין, ורק אז שלחו מסמכים רגישים בדרך מאובטחת.',
          ],
        },
        {
          heading: 'מה עמוד זה אינו מבטיח',
          paragraphs: [
            'איננו מבטיחים מועד למענה, איננו מאשרים פגישה דרך עמוד זה, איננו מבטיחים עורכת דין או עורך דין מסוימים ואיננו מעמידים מתורגמן. תרגום בכתב הוא עניין אחר: ההודעה שלכם אינה מתורגמת אוטומטית.',
            'אם תשלחו פנייה, התוכן יישמר וימתין לבדיקה. אם לאחר זמן מה לא תקבלו מענה, אפשר לכתוב שוב לכתובת הדואר האלקטרוני המצוינת בעמוד יצירת הקשר.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'שאלות',
      title: 'שאלות נפוצות',
      description:
        'הסברים על היקף העבודה, ההכנה, השפות, העלויות ועל משמעותה של פנייה שנשלחה.',
      intro:
        'השאלות שלהלן נענות ברמת מידע כללי. מענה לעניין שלכם אפשרי רק לאחר שעורכת דין או עורך דין בדקו את המסמכים.',
      sections: [
        {
          heading: 'כיצד להשתמש בחלק זה',
          paragraphs: [
            'אם לא תמצאו מענה למצבכם, המענה תלוי בדרך כלל בעובדות מיוחדות. כתבו אותן אפוא בתקציר, במקום להסיקן מעמוד זה.',
          ],
        },
      ],
      faqs: [
        {
          question: 'באילו עניינים מטפל המשרד?',
          answer:
            'אנו מטפלים בשישה תחומים: השקעה והקמת חברות בטאיוואן, סכסוכים אזרחיים ופיצויים, נישואין, משפחה וירושה, סכסוכי עבודה, עניינים פליליים וקניין רוחני. אם עניין יתקבל — הדבר נקבע לאחר בדיקת התוכן.',
        },
        {
          question: 'מה עליי להכין לפני הפנייה?',
          answer:
            'הכינו תקציר קצר של ההשתלשלות, של בקשתכם, של הזיקה לטאיוואן ושל המועד, אם קיים. אם כבר קיים מסמך של בית משפט או של רשות, ציינו את התאריך. בשלב זה אין צורך לשלוח עדיין מסמכי זיהוי או את מכלול הראיות.',
        },
        {
          question: 'האם אפשר לקבל ייעוץ בעברית?',
          answer:
            'לא. מידע זה כתוב בעברית, אך הייעוץ עם עורכת דין או עורך דין מתקיים רק באנגלית, בסינית (中文), ביפנית ובקוריאנית. גם מתורגמן איננו מבטיחים. תרגום בכתב הוא עניין אחר: הטקסט המקורי שאתם כותבים נשמר כפי שהוא ואינו מתורגם אוטומטית.',
        },
        {
          question: 'מה לעשות אם איני יכול או יכולה להשתמש באף אחת מארבע השפות?',
          answer:
            'בשליחת הפנייה בחרו "יש לאשר את דרך התקשורת". אנו משיבים כדי לבחון דרך תקשורת, אך שירות בשפה אחרת אינו מובטח. זהו צעד בדיקה, ולא הבטחה שנוכל לעבוד בשפה אחרת.',
        },
        {
          question: 'כיצד מטופל הטקסט שלי בעברית?',
          answer:
            'הטקסט המקורי שאתם כותבים נשמר כפי שהוא ואינו מתורגם אוטומטית. במידת הצורך, שפת ההתכתבות הבאה מאושרת עמכם.',
        },
        {
          question: 'האם הייעוץ כבר התקיים משנשלחה הפנייה?',
          answer:
            'לא. פנייה שנשלחה ממתינה לבדיקת עורכת דין או עורך דין. אין זו חוות דעת משפטית, אין זו פגישה מאושרת, והשליחה כשלעצמה אינה יוצרת יחסי עורך דין–לקוח.',
        },
        {
          question: 'כיצד מחושבות העלויות?',
          answer:
            'תחילה נקבע היקף העבודה, ולאחר מכן גובה העלויות ואופן חישובן מאושרים עמכם לפני שהעבודה מתחילה. עמוד זה אינו נוקב בסכומים ואינו אומר שהשיחה הראשונה היא ללא תשלום.',
        },
        {
          question: 'מה לעשות אם העניין שלי דחוף מאוד?',
          answer:
            'ציינו את המועד או את התאריך שעל מסמך רשמי כבר בתחילת התקציר, כדי שתאריכים אלה יהיו גלויים בבדיקה. לעמוד זה אין ערוץ חירום והוא אינו מבטיח מועד למענה; אם העניין שלכם אינו סובל דיחוי, כדאי לחפש במקביל דרכים נוספות במקום מגוריכם.',
        },
      ],
    },
    privacy: {
      eyebrow: 'פרטיות',
      title: 'נתונים הנאספים בטופס יצירת הקשר',
      description:
        'מה אוסף טופס יצירת הקשר בחלק זה בעברית, כיצד מטופל הטקסט המקורי וכיצד לפנות אלינו בעניין הנתונים שלכם.',
      intro:
        'חלק זה נוגע רק לטופס יצירת הקשר שבעמודי המידע האלה. הוא מתאר את הטיפול בנתונים, ולא ערובה טכנית.',
      sections: [
        {
          heading: 'אילו נתונים נאספים',
          paragraphs: [
            'כאשר אתם שולחים פנייה בטופס שבחלק זה, נרשמים הנתונים הבאים:',
          ],
          items: [
            'השם שציינתם',
            'כתובת הדואר האלקטרוני למענה',
            'שפת התצוגה של העמוד בעת השליחה',
            'השפה שבה כתבתם',
            'שפת הייעוץ הרצויה לכם',
            'הטקסט המקורי שכתבתם',
            'הסכמתכם לשליחת הפנייה',
            'מספר קליטה לאיתור הפנייה',
          ],
        },
        {
          heading: 'הטקסט המקורי נשמר ללא שינוי',
          paragraphs: [
            'הטקסט שלכם נשמר בדיוק כפי שנכתב ואינו מתורגם אוטומטית. אם דרוש תרגום לצורך הטיפול, הדבר נדון עמכם בנפרד.',
            'מאחר שהטקסט המקורי נשמר, אל תכתבו בשלב הראשון את מה שאינו נדרש עדיין, למשל מספר דרכון, מספר תעודה או פרטי חשבון.',
          ],
        },
        {
          heading: 'מקום השמירה והגישה',
          paragraphs: [
            'תוכן הפנייה שלכם נשמר במקום שאינו נגיש לציבור. רק בעלי הרשאה במשרד יכולים לגשת אליו, לצורך הטיפול בפנייה.',
            'עמוד זה אינו נותן ערובה מוחלטת לאבטחה. שום דרך העברה ושום מקום אחסון אינם בטוחים לחלוטין; לפיכך יש לשלוח מסמכים רגישים רק לאחר הנחיה מיוחדת של עורכת הדין או עורך הדין.',
          ],
        },
        {
          heading: 'מטרת השימוש',
          paragraphs: [
            'הנתונים הנשלחים משמשים לבדיקת הפנייה, למענה לכם, לבירור דרך התקשורת ולטיפול, אם העבודה מתקבלת.',
            'הנתונים אינם משמשים לשיווק ללא הסכמה נפרדת.',
          ],
        },
        {
          heading: 'הודעה ומספר קליטה',
          paragraphs: [
            'אם פנייה נשלחה בהצלחה, המערכת מודיעה למשרד. אם הודעה זו אינה מגיעה אל המשרד, הטקסט שלכם נותר שמור ואינו אובד.',
            'מספר הקליטה משמש לאיתור הפנייה שלכם ברישומינו. הוא מוצג לאחר השמירה; אפשר לציינו בפנייה חוזרת.',
          ],
        },
        {
          heading: 'זכויותיכם ודרך הפנייה',
          paragraphs: [
            'אפשר לבקש גישה לנתונים שלכם, תיקונם או מחיקתם, או לחזור בכם מן ההסכמה, באמצעות כתובת הדואר האלקטרוני המצוינת בעמוד יצירת הקשר. אם קיימת חובה חוקית או דיונית לשמירה, נסביר את ההגבלה.',
            'עמוד זה אינו נוקב בתקופת שמירה קבועה, משום שמשך הזמן בפועל תלוי בהתפתחות העניין ובחובות הכרוכות בו. אם ברצונכם לבקש מחיקה מוקדמת יותר, ציינו זאת בפנייה.',
          ],
        },
        {
          heading: 'מקום השמירה וספקים',
          paragraphs: [
            'אתר זה מתארח אצל Vercel, ותוכן הפנייה שלכם נשמר באחסון ענן שאינו פומבי של שירות זה. הודעות הדואר האלקטרוני נשלחות באמצעות שירות הדואר שבו משתמש המשרד.',
            'שרתיהם של ספקים מסוימים עשויים להימצא מחוץ לטאיוואן, ולפיכך ייתכן שהנתונים שלכם יישמרו ויעובדו שם. בהתמלא מטרת השמירה נמחקים הנתונים ללא דיחוי; נתונים שיש לשמור לפי הכללים החלים נותרים לאותה תקופה. פניות בעניין נתונים אישיים מתקבלות בכתובת wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'הסתייגויות',
      title: 'היקף המידע שבעמוד זה וגבולותיו',
      description:
        'אופיו הכללי של המידע, המסגרת המשפטית והתנאים להיווצרות יחסי עורך דין–לקוח.',
      intro:
        'חלק זה מבהיר מה יכולים עמודי המידע האלה בעברית לעשות עבורכם ומה לא.',
      sections: [
        {
          heading: 'מידע כללי בלבד',
          paragraphs: [
            'תוכן העמודים האלה כתוב כמידע כללי. אין בו ייעוץ משפטי לעניין שלכם ואין הוא מחליף בדיקה של המסמכים שלכם.',
            'תוצאת עניין תלויה בעובדות, בכללים החלים ובעיתוי; שני מצבים הנראים דומים עשויים להסתיים אחרת.',
          ],
        },
        {
          heading: 'המסגרת המשפטית',
          paragraphs: [
            'המשרד פועל לפי דין טאיוואן, ועמוד זה מדבר רק על העבודה במסגרת זו.',
            'התוכן אינו ייעוץ לפי דין של שיטת משפט אחרת מזו של טאיוואן, ובכלל זה דין מקום מגוריכם. אם חלק מהעניין שלכם נוגע לשיטת משפט אחרת, נברר עמכם איזה איש מקצוע, המוסמך באותה שיטת משפט, נדרש לאותו חלק.',
          ],
        },
        {
          heading: 'יחסי עורך דין–לקוח אינם נוצרים מאליהם',
          paragraphs: [
            'קריאת עמוד זה, שליחת טופס או דואר אלקטרוני אינן יוצרות כשלעצמן יחסי עורך דין–לקוח.',
            'יחסים אלה נוצרים רק לאחר שהעניין נבדק ושני הצדדים אישרו את קבלת העבודה.',
          ],
        },
        {
          heading: 'אין הבטחת תוצאה',
          paragraphs: [
            'אף חלק מעמוד זה אינו הבטחה בדבר תוצאת עניין, בדבר קבלת בקשה או בדבר מעמד שהייה ועבודה.',
            'קישורים חיצוניים משמשים להתמצאות; איננו מבטיחים את נכונותם או את עדכניותם של תכני צדדים שלישיים.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'מאמרים',
      title: 'מאמרים על דין טאיוואן',
      description:
        'מאמרים בעברית על שאלות נפוצות בדין טאיוואן. התוכן הוא מידע כללי נכון למועד הפרסום, ולא ייעוץ משפטי לעניין שלכם.',
      intro:
        'המשרד מפרסם מאמרים על שאלות נפוצות בדין טאיוואן. המאמרים הזמינים בעברית נמצאים בעמוד זה; לצידם ארבעה קישורים, שכל אחד מהם פותח את רשימת המאמרים בשפת מקור אחת.',
      sections: [
        {
          heading: 'ארבע רשימות לפי שפה',
          paragraphs: [
            'חלק זה כולל ארבעה קישורים: רשימת המאמרים בקוריאנית, בסינית, באנגלית וביפנית. כל קישור מציין את שפת הרשימה, כך שתדעו מראש באיזו שפה ייפתח התוכן.',
            'ארבע הרשימות האלה הן רשימות לפי שפת המקור של המאמרים, ולא רשימות תרגום. המאמרים הזמינים בעברית נמצאים בנפרד בעמוד זה.',
          ],
        },
        {
          heading: 'לאן מובילים הקישורים',
          paragraphs: [
            'אם תבחרו באחד מארבעת הקישורים, תיפתח רשימת המאמרים באותה שפה. מתוך הרשימה אתם בוחרים את הטקסט; כל התוכן מופיע בשפת המקור של המאמר.',
            'עמוד זה אינו מסכם את תוכן המאמרים ואינו מבטיח שנושא מסוים זמין בכל ארבע השפות. כל רשימה כוללת רק טקסטים שפורסמו באותה שפה.',
          ],
        },
        {
          heading: 'עד כמה מאמר יכול לשמש להתמצאות',
          paragraphs: [
            'המאמרים הם מידע כללי נכון למועד הפרסום. הכללים ואופן יישומם עשויים להשתנות, ומאמר אינו כולל את כל נסיבות העניין שלכם.',
            'לפיכך אל תבססו פעולה בעניין ממשי על מאמר בלבד. השתמשו בו לקבלת תמונה כללית ודונו במסמכים שלכם בנפרד עם עורכת דין או עורך דין; עמוד זה אינו שלב הייעוץ.',
          ],
        },
      ],
    },
  },
};
