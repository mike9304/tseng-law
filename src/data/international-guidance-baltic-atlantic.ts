import type { GuidanceLocaleContent } from './international-guidance-content';

// SCAFFOLD: lv, et, ca, is — cloned from template packs; every string must be translated and the SCAFFOLD markers removed.

export const lithuanianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Lietuvių',
  nav: {
    home: 'Pradžia',
    services: 'Paslaugos',
    about: 'Kontora',
    lawyers: 'Advokatai',
    pricing: 'Išlaidos',
    contact: 'Kontaktai',
    faq: 'Klausimai',
    privacy: 'Privatumas',
    disclaimer: 'Įspėjimas',
    columns: 'Straipsniai',
  },
  contactCta: 'Pateikti prašymą įvertinti',
  footerNotice:
    'Šiame lietuviškame puslapyje pateikiama tik bendra informacija apie kontoros darbą pagal Taivano teisę. Tai nėra teisinė konsultacija konkrečioje byloje, o vien pats pranešimo išsiuntimas nesukuria advokato ir kliento santykių.',
  skipLink: 'Praleisti naršymą ir eiti prie turinio',
  menuLabel: 'Puslapių sąrašas',
  languageLabel: 'Rodymo kalba',
  mega: {
    services: {
      description: 'Kontora tvarko pagrindines Taivano teisės sritis.',
      viewAllLabel: 'Rodyti visus',
    },
    columns: {
      description: 'Straipsniai apie dažnus Taivano teisės klausimus.',
      viewAllLabel: 'Rodyti visus',
    },
    lawyers: {
      description: 'Advokačių ir advokatų pristatymas ir kreipimosi būdai.',
      viewAllLabel: 'Rodyti visus',
    },
    pricing: {
      description: 'Šis puslapis paaiškina darbo apimtį ir tai, kaip nustatomos išlaidos.',
      viewAllLabel: 'Rodyti visus',
    },
    faq: {
      description: 'Dažni klausimai apie kontoros darbą Taivane.',
      viewAllLabel: 'Rodyti visus',
    },
  },
  notFoundTitle: 'Puslapis nerastas',
  notFoundText:
    'Ieškomas puslapis neegzistuoja arba buvo perkeltas. Galite grįžti į lietuvišką pradžios puslapį ir peržiūrėti prieinamą informaciją.',
  backHomeLabel: 'Į pradžios puslapį',
  readSourceLabel: 'Atidaryti straipsnių sąrašą originalo kalba',
  home: {
    heroScrollLabel: 'Slinkti žemyn',
    heroColumnsCtaLabel: 'Žiūrėti straipsnius',
    servicesDetailLabel: 'Žiūrėti išsamiau',
    servicesAssistanceBefore: 'Jei neaišku, kuriai sričiai priklauso Jūsų byla, puslapis ',
    servicesAssistanceLinkLabel: 'Kontaktai',
    servicesAssistanceAfter: ' paaiškina, kaip parengti santrauką, kurią įvertins advokatė arba advokatas.',
    columnsViewAllLabel: 'Žiūrėti visus straipsnius',
    columnsReadMoreLabel: 'Skaityti toliau',
    columnsReviewLabel: 'Įvertino advokatė Wei Tseng',
    columnsOriginalLanguageBadge: 'Originalo kalba',
    columnsOriginalLanguageNote:
      'Toliau nurodyti straipsniai lietuvių kalba dar nepateikiami. Sąrašas lieka originalo kalba ir atveria atitinkamą kalbos puslapį; turinys automatiškai neverčiamas.',
    imageBandAlt: 'Tradicinis Taivano kiemas sanheyuan (三合院) ir šiuolaikinis paviljonas dienos šviesoje',
    videoPauseLabel: 'Pristabdyti vaizdo įrašą',
    videoPlayLabel: 'Leisti vaizdo įrašą',
    videoReplayLabel: 'Leisti vaizdo įrašą iš naujo',
  },
  pages: {
    home: {
      eyebrow: 'INFORMACIJA',
      title: 'Teisinės paslaugos Taivane — informacija lietuvių kalba',
      description:
        'Bendra informacija lietuvių kalba apie Hovering International Law Firm darbo Taivane apimtį, konsultacijos kalbas ir pirmąjį kreipimąsi.',
      intro:
        'Hovering International Law Firm atstovauja užsienio klientams, taip pat asmenims, susijusiems su Taivanu, Taivano teisės bylose: investicijos ir įmonių steigimas, civiliniai ginčai, santuoka, šeima ir paveldėjimas, darbo teisė, baudžiamosios bylos ir intelektinė nuosavybė. Ši lietuviška dalis padeda atpažinti, kuris darbas patenka į mūsų apimtį, ką pasirengti ir kaip į mus kreiptis. Tai bendra informacija, o ne teisinė konsultacija Jūsų byloje.',
      sections: [
        {
          heading: 'Kuo užsiimame',
          paragraphs: [
            'Hovering International Law Firm yra advokatų kontora, įsteigta Taivane. Ji dirba pagal Taivano teisę ir turi biurus šiuose miestuose: Taipėjus (臺北), Gaosiongas (高雄), Taidžongas (臺中) ir Pingdongas (屏東). Konsultuojame įmones, vedame teismo procesus ir lydime užsienio klientus per žingsnius, kuriuos Taivane reikia atlikti.',
            'Visas čia pateiktas turinys yra bendras. Bylos rezultatas priklauso nuo faktinių aplinkybių, taikomų teisės aktų ir to, kada byla vertinama. Ši informacija nepakeičia konsultacijos su advokate arba advokatu dėl Jūsų dokumentų.',
          ],
        },
        {
          heading: 'Puslapio kalba ir konsultacijos kalba nėra tas pats',
          paragraphs: [
            'Šis puslapis parašytas lietuviškai, bet konsultacija su advokate arba advokatu vyksta tik keturiomis kalbomis: anglų, kinų (中文), japonų ir korėjiečių. Informacijos skaitymas lietuvių kalba nereiškia, kad pokalbis su advokate arba advokatu vyks lietuviškai.',
            'Nežadame vertėjo žodžiu, atsakymo termino ir susitikimo per šį puslapį. Jei nemokate nė vienos iš keturių konsultacijos kalbų, puslapis „Kontaktai“ paaiškina, kaip vertiname bendravimo būdą.',
          ],
        },
        {
          heading: 'Kontoros sritys',
          paragraphs: [
            'Darbo apimtis apima šias šešias sritis. Puslapis „Paslaugos“ kiekvieną iš jų aprašo tiksliau ir nurodo, kas nėra žadama.',
          ],
          items: [
            'Investicijos ir įmonių steigimas Taivane',
            'Civiliniai ginčai ir žalos atlyginimas',
            'Santuoka, šeima ir paveldėjimas',
            'Darbo ginčai',
            'Baudžiamosios bylos',
            'Intelektinė nuosavybė: prekių ženklai, patentai ir autorių teisė',
          ],
        },
        {
          heading: 'Nuo ko pradėti',
          paragraphs: [
            'Perskaitykite puslapį „Paslaugos“ ir patikrinkite, ar Jūsų byla patenka į mūsų apimtį, tada „Išlaidos“ ir „Kontaktai“, kad žinotumėte, kaip nustatoma apimtis ir kaip išlaidos patvirtinamos prieš pradedant darbą.',
            'Siųsdami pranešimą santrauką galite parašyti savo kalba. Originalus tekstas išsaugomas tiksliai toks, kokį parašėte, ir automatiškai neverčiamas. Išsiųstas pranešimas yra užklausa, laukianti įvertinimo: tai dar nėra konsultacija ir nėra patvirtintas susitikimas.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'PASLAUGOS',
      title: 'Kokiose bylose atstovaujame klientams',
      description:
        'Šešios sritys, kurias kontora veda Taivane, ir ribos, kurias naudinga žinoti pirmiausia.',
      intro:
        'Toliau nurodytos sritys, kurias iš tikrųjų vedame, ir klausimai, dažniausiai kylantys pradiniame etape. Paaiškinimas padeda įvertinti, ar Jūsų byla patenka į mūsų apimtį; jis yra bendras ir nėra atskiros bylos teisinė analizė.',
      sections: [
        {
          heading: 'Investicijos ir įmonių steigimas Taivane',
          paragraphs: [
            'Atstovaujame užsienio investuotojams ir įmonėms steigiant arba vedant bendrovę Taivane: teisinės formos pasirinkimas, dokumentų parengimas ir pateikimas, kapitalo įnašas, banko klausimai, buveinės vertinimas ir šakiniai reikalavimai. Taip pat padedame dėl apskaitos ir mokesčių, kylančių iš steigimo ir veiklos Taivane.',
            'Eiga ir terminai skiriasi pagal formą, investuotoją, šaką, banką ir jau turimus dokumentus. Bendrovės įsteigimas savaime nesuteikia teisės gyventi (居留) ir leidimo dirbti (工作許可): tai atskiros procedūros, vertinamos pagal konkretaus asmens padėtį.',
          ],
        },
        {
          heading: 'Civiliniai ginčai ir žalos atlyginimas',
          paragraphs: [
            'Ši sritis apima ginčus iš sutarčių, žalos atlyginimą dėl neteisėtų veiksmų ir vartotojų ginčus. Darbas paprastai prasideda chronologija, turimų dokumentų ir įrodymų vertinimu, ir tik tada seka tolesni žingsniai.',
            'Eigą lemia terminai, įskaitant senaties terminus, ir įrodymų visuma. Todėl žinomas datas nurodykite kuo anksčiau. Išsaugokite sutartis, pranešimus, mokėjimo dokumentus arba nuotraukas iš įvykio vietos ir paminėkite juos pirmajame pranešime.',
          ],
        },
        {
          heading: 'Santuoka, šeima ir paveldėjimas',
          paragraphs: [
            'Vedame santuokos nutraukimą (離婚), turto padalijimą, nepilnamečių vaikų teisių ir pareigų įgyvendinimą ir prisiėmimą (未成年子女權利義務之行使或負擔), bendravimą su vaiku (會面交往) ir paveldėjimą (繼承), taip pat kai šalys arba turtas yra skirtingose valstybėse. Tarpvalstybinėms šeimos byloms dažnai reikia papildomai įvertinti namų ūkio registro (戶籍) įrašus, dokumentų formą ir jų įrodomąją galią Taivane.',
            'Kadangi šeimos bylos dažnai susijusios su terminais ir lygiagrečiomis procedūromis, pirmoji santrauka turėtų nurodyti šalių santykį, dabartinę gyvenamąją vietą ir jau vykstančias procedūras.',
          ],
        },
        {
          heading: 'Darbo ginčai',
          paragraphs: [
            'Ši sritis apima darbo santykių pabaigą, išeitinę išmoką pagal Taivano teisę (資遣費; jos negalima tapatinti su kitų valstybių panašiais institutais), atlyginimą ir ginčus iš darbo sutarties (勞動契約), tiek darbuotojo, tiek darbdavio pusėje. Vertindami atskiriame pabaigos pagrindą nuo įspėjimo termino, išmokėjimo ir terminų klausimų.',
            'Lemiami dokumentai paprastai būna darbo sutartis, vidaus darbo taisyklės (工作規則), algos lapeliai ir šalių korespondencija. Jei juos vis dar turite, paminėkite tai santraukoje.',
          ],
        },
        {
          heading: 'Baudžiamosios bylos',
          paragraphs: [
            'Atstovaujame ikiteisminiame tyrime ir teisme įtariamuosius ir kaltinamuosius bei nukentėjusiuosius ir vertiname baudžiamąją riziką verslo veikloje.',
            'Baudžiamosiose bylose terminai dažnai trumpi, o etapai nustatyti. Jei jau gavote ikiteisminio tyrimo institucijos arba teismo raštą, kuo anksčiau nurodykite datą, įrašytą rašte, kad turinys būtų įvertintas tinkama tvarka.',
          ],
        },
        {
          heading: 'Intelektinė nuosavybė',
          paragraphs: [
            'Padedame registruoti prekių ženklus (商標) ir patentus (專利) bei spręsti autorių teisių ir ginčų dėl šių teisių Taivane klausimus.',
            'Šioje srityje lemia žingsnių eilė: apsaugos apimtis, paraiškos pateikimo momentas ir faktinis naudojimas daro įtaką pasirinkimui. Paraiškos pateikimas savaime nereiškia, kad jai bus pritarta.',
          ],
        },
        {
          heading: 'Apimtis ir jos patvirtinimas',
          paragraphs: [
            'Kontora dirba pagal Taivano teisę ir veda bylas iš pirmiau nurodytų sričių. Kiekvienos bylos apimtis patvirtinama atskirai po to, kai advokatė arba advokatas įvertina Jūsų pranešimą.',
            'Gyvenamosios vietos statusas, leidimas dirbti ir panašūs klausimai vertinami pagal dokumentus ir konkretaus asmens padėtį, o ne pagal pilietybę. Jei dalis Jūsų bylos paliečia šiuos punktus, nurodykite tai kreipdamiesi. Šis puslapis nežada nei rezultato, nei atsakymo termino.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'KONTORA',
      title: 'Apie Hovering International Law Firm',
      description:
        'Pagrindiniai duomenys apie šią Taivano advokatų kontorą, jos biurus ir tarptautinį darbą.',
      intro:
        'Hovering International Law Firm yra advokatų kontora Taivane. Advokatės ir advokatai dirba nuo konsultacijų įmonėms iki teismo proceso. Ši dalis aprašo kontoros atsiradimą, buveines ir tarptautinį darbą.',
      sections: [
        {
          heading: 'Įsteigimas ir struktūra',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) 2016 m. įsteigė advokatės ir advokatai, studijavę National Taiwan University (國立臺灣大學). Kinų pavadinimas 昊鼎 jungia ženklą 昊 („platus dangus“) su ženklu 鼎 („tvirtas pagrindas“) ir nusako kontoros kryptį nuo įsteigimo.',
            'Turime biurus šiuose miestuose: Taipėjus (臺北), Gaosiongas (高雄), Taidžongas (臺中) ir Pingdongas (屏東). Gaosiongo biuras telkiasi į įmonių valdymą ir veda civilinius, baudžiamuosius ir administracinius ginčus. Taidžongo biuras veda statybos bylas, intelektinę nuosavybę ir bylas, susijusias su Korėja ir Japonija. Pingdongo biuras atidarytas 2017 m. vietos poreikiui tenkinti.',
            'Nuo 2020 m. šalia advokatų darbo veikia ir „Hovering Accounting Office“, teikiantis apskaitą ir mokesčių planavimą verslininkams ir privatiems asmenims, turintiems turto.',
          ],
        },
        {
          heading: 'Tarptautinis darbas',
          paragraphs: [
            'Tarpvalstybinis darbas apima įmonių steigimą, vizas, prekių ženklų ir patentų paraiškas, teisinės rizikos vertinimą ir mokesčių konsultacijas įmonėms. Taidžongo biuras ypač veda statybos bylas, intelektinę nuosavybę ir bylas, susijusias su Korėja ir Japonija. Advokatė Wei Tseng (曾雋崴) atstovauja klientams iš Korėjos, iš Japonijos ir kitiems tarptautiniams klientams nurodytose srityse.',
            'Ar galime bylą priimti, priklauso nuo turinio ir bendravimo kalbos. Jei Jūsų byla patenka į nurodytas sritis ir ją galima aptarti viena iš keturių konsultacijos kalbų, galite atsiųsti santrauką įvertinti.',
          ],
        },
        {
          heading: 'Kai į mus kreipiatės',
          paragraphs: [
            'Gavus Jūsų santrauką, advokatė arba advokatas įvertina turinį ir tada kalba apie galimą darbo apimtį, dar reikalingus dokumentus ir tolesnius žingsnius. Mokesčių ar apskaitos klausimais kontora gali tą pačią bylą tvarkyti kartu su apskaitos padaliniu.',
            'Kiekvienos bylos rezultatas priklauso nuo faktinių aplinkybių ir turimų dokumentų; rezultato nežadame. Jei Jums reikia saistančio atsakymo dėl savo padėties, dokumentus reikia aptarti su advokate arba advokatu viena iš keturių konsultacijos kalbų.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKATAI',
      title: 'Tarptautinė Hovering komanda',
      description: 'Hovering advokačių ir advokatų, Korėjos operacijų vadovo ir susijusios apskaitos bei audito profiliai.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'IŠLAIDOS',
      title: 'Kaip nustatoma darbo apimtis ir išlaidos',
      description:
        'Eigos paaiškinimas: pirmiausia darbo apimtis, tada išlaidų patvirtinimas, ir kodėl šiame puslapyje nėra kainyno.',
      intro:
        'Šis puslapis paaiškina, kaip nustatomos išlaidos, o ne jų dydį. Dydis priklauso nuo darbo apimties konkrečioje byloje ir turi prasmę tik tada, kai ši apimtis aiški.',
      sections: [
        {
          heading: 'Pirmiausia nustatoma darbo apimtis',
          paragraphs: [
            'Tos pačios rūšies bylos gali reikalauti labai skirtingų pastangų, priklausomai nuo šalių skaičiaus, turimų dokumentų ir terminų, kurių reikia laikytis, ir nuo to, ar procesas jau pradėtas. Todėl pirmasis žingsnis visada yra nustatyti, kas į darbą įeina ir kas ne.',
            'Santrauka, kurią atsiunčiate pradžioje, yra šios apimties pagrindas. Kuo aiškiau ji aprašo eigą, Jūsų prašymą ir terminus, tuo tiksliau galima nustatyti apimtį.',
          ],
        },
        {
          heading: 'Išlaidos patvirtinamos prieš pradedant darbą',
          paragraphs: [
            'Kai darbo apimtis aiški, išlaidų dydis ir skaičiavimo būdas su Jumis aptariami ir patvirtinami prieš pradedant darbą. Jei apimtis eigoje pasikeičia, ją reikia patvirtinti iš naujo.',
            'Šis puslapis nėra kainos pasiūlymas ir nesukuria pareigos mokėti.',
          ],
        },
        {
          heading: 'Konsultacija gali būti mokama',
          paragraphs: [
            'Konsultacija su advokate arba advokatu gali būti mokama paslauga. Šis puslapis nesako, kad pirmoji konsultacija nemokama, ir jokios šio puslapio dalies nereikėtų taip suprasti.',
            'Jei konsultacija mokama, dydis ir mokėjimo būdas pranešami prieš jai įvykstant.',
          ],
        },
        {
          heading: 'Kodėl šiame puslapyje nėra tarifų',
          paragraphs: [
            'Išlaidos priklauso nuo pačios bylos: nuo pastangų, šalių skaičiaus, dokumentų, terminų ir nuo to, ar procesas jau vyksta. Iš anksto nustatytas skaičius Jūsų bylos išlaidų neparodytų. Todėl pirmiausia nustatome darbo apimtį ir tada pranešame Jums išlaidas, prieš pradedant darbą.',
            'Šalia atlygio gali atsirasti teismo rinkliavos, institucijų ar trečiųjų asmenų išlaidos. Jos atskirtos nuo atlygio ir priklauso nuo atitinkamo proceso.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKTAI',
      title: 'Kaip kreiptis į kontorą',
      description:
        'Puslapio kalba, konsultacijos kalbos, eiga, jei nemokate nė vienos iš keturių kalbų, ir tai, ko šis puslapis nežada.',
      intro:
        'Prieš rašydami mums, atskirkite šiuos tris punktus. Jie dažnai maišomi, bet reiškia skirtingus dalykus.',
      sections: [
        {
          heading: 'Trys dalykai, kuriuos reikia laikyti skyrium',
          paragraphs: [
            'Puslapio rodymo kalba, konsultacijos su advokate arba advokatu kalba ir kalba, kuria rašote, yra trys skirtingi dalykai.',
          ],
          items: [
            'Puslapio kalba: ši informacija parašyta lietuviškai.',
            'Konsultacijos kalba: konsultacija vyksta tik anglų, kinų (中文), japonų ir korėjiečių kalbomis.',
            'Jūsų rašymo kalba: santrauką galite parašyti savo kalba; originalus tekstas išsaugomas be pakeitimų.',
          ],
        },
        {
          heading: 'Jei nemokate nė vienos iš keturių konsultacijos kalbų',
          paragraphs: [
            'Kontaktinėje formoje galite pasirinkti „Bendravimo būdą reikia patvirtinti“. Atsakysime, kad įvertintume, ar yra tinkamas bendravimo būdas; paslauga kita kalba nėra garantuojama ir atsakymo terminas nežadamas.',
            'Tai tik vertinimo žingsnis, o ne pažadas. Nežadame vertėjo žodžiu, paslaugos lietuvių kalba ar kita kalba už keturių nurodytų kalbų ribų ir to, kad priimsime kiekvieną bylą.',
          ],
        },
        {
          heading: 'Ką turėtų apimti pirmasis pranešimas',
          paragraphs: [
            'Nurodykite, kas įvyko, kokios pagalbos reikia, kokį ryšį byla turi su Taivanu, ir terminą, jei jį žinote. Jei jau gavote teismo ar institucijos raštą, nurodykite datą, įrašytą rašte.',
            'Pradiniame etape dar nereikia siųsti paso numerio, dokumento numerio, sąskaitos duomenų, sveikatos dokumentacijos ar viso įrodymų rinkinio. Palaukite advokatės arba advokato nurodymų ir jautrius dokumentus tada siųskite saugiu keliu.',
          ],
        },
        {
          heading: 'Ko šis puslapis nežada',
          paragraphs: [
            'Nežadame atsakymo termino, nepatvirtiname susitikimo per šį puslapį, nežadame konkrečios advokatės ar konkretaus advokato ir neteikiame vertėjo žodžiu. Rašytinis vertimas yra kas kita: Jūsų pranešimas automatiškai neverčiamas.',
            'Jei išsiųsite užklausą, turinys išsaugomas ir laukia įvertinimo. Jei po kurio laiko atsakymo negausite, galite vėl parašyti el. pašto adresu, nurodytu kontaktų puslapyje.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'KLAUSIMAI',
      title: 'Dažni klausimai',
      description:
        'Paaiškinimai apie darbo apimtį, pasirengimą, kalbas, išlaidas ir tai, ką reiškia išsiųsta užklausa.',
      intro:
        'Toliau pateikti klausimai atsakomi bendros informacijos lygiu. Atsakymas Jūsų byloje galimas tik po to, kai advokatė arba advokatas įvertina dokumentus.',
      sections: [
        {
          heading: 'Kaip naudotis šia dalimi',
          paragraphs: [
            'Jei atsakymo savo padėčiai nerandate, atsakymas paprastai priklauso nuo ypatingų faktų. Todėl įrašykite juos į santrauką, o ne spręskite apie juos vien iš šio puslapio.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Kokias bylas kontora veda?',
          answer:
            'Vedame šešias sritis: investicijas ir įmonių steigimą Taivane, civilinius ginčus ir žalos atlyginimą, santuoką, šeimą ir paveldėjimą, darbo ginčus, baudžiamąsias bylas ir intelektinę nuosavybę. Ar byla bus priimta, sprendžiama įvertinus turinį.',
        },
        {
          question: 'Ką pasirengti prieš kreipiantis?',
          answer:
            'Parenkite trumpą eigos, savo prašymo, ryšio su Taivanu ir termino, jei toks yra, santrauką. Jei jau turite teismo ar institucijos raštą, nurodykite datą. Šiame etape dar nereikia siųsti tapatybės dokumentų ar viso įrodymų rinkinio.',
        },
        {
          question: 'Ar galima konsultacija lietuvių kalba?',
          answer:
            'Ne. Ši informacija parašyta lietuviškai, bet konsultacija su advokate arba advokatu vyksta tik anglų, kinų (中文), japonų ir korėjiečių kalbomis. Nežadame ir vertėjo žodžiu. Rašytinis vertimas yra kas kita: originalus tekstas, kurį parašote, išsaugomas toks, koks yra, ir automatiškai neverčiamas.',
        },
        {
          question: 'Ką daryti, jei negaliu naudoti nė vienos iš keturių kalbų?',
          answer:
            'Siųsdami užklausą pasirinkite „Bendravimo būdą reikia patvirtinti“. Atsakysime, kad įvertintume bendravimo būdą, bet paslauga kita kalba nėra garantuojama. Tai vertinimo žingsnis, o ne pažadas, kad galime dirbti kita kalba.',
        },
        {
          question: 'Kaip elgiamasi su mano tekstu lietuvių kalba?',
          answer:
            'Originalus tekstas, kurį parašote, išsaugomas toks, koks yra, ir automatiškai neverčiamas. Jei reikia, tolesnio bendravimo kalba su Jumis patvirtinama.',
        },
        {
          question: 'Ar konsultacija jau įvyko vien todėl, kad užklausa išsiųsta?',
          answer:
            'Ne. Išsiųsta užklausa laukia, kol ją įvertins advokatė arba advokatas. Tai nėra teisinė nuomonė, nėra patvirtintas susitikimas, ir vien pats išsiuntimas nesukuria advokato ir kliento santykių.',
        },
        {
          question: 'Kaip skaičiuojamos išlaidos?',
          answer:
            'Pirmiausia nustatoma darbo apimtis, tada su Jumis patvirtinamas išlaidų dydis ir skaičiavimo būdas, prieš pradedant darbą. Šis puslapis nenumato sumų ir nesako, kad pirmoji konsultacija nemokama.',
        },
        {
          question: 'Ką daryti, jei mano byla labai skubi?',
          answer:
            'Nurodykite terminą arba datą iš institucijos rašto pačioje santraukos pradžioje, kad šios datos būtų matomos vertinant. Šis puslapis neturi skubos kanalo ir neužtikrina atsakymo termino; jei Jūsų byla negali laukti, lygiagrečiai turėtumėte ieškoti kitų kelių ten, kur esate.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVATUMAS',
      title: 'Duomenys, renkami kontaktine forma',
      description:
        'Ką renka kontaktinė forma šioje lietuviškoje dalyje, kaip elgiamasi su originaliu tekstu ir kaip kreiptis dėl Jūsų duomenų.',
      intro:
        'Ši dalis taikoma tik kontaktinei formai šiuose informaciniuose puslapiuose. Ji aprašo duomenų tvarkymą, o ne techninę garantiją.',
      sections: [
        {
          heading: 'Kokie duomenys renkami',
          paragraphs: [
            'Jei per šios dalies formą išsiųsite užklausą, fiksuojami šie duomenys:',
          ],
          items: [
            'Vardas, kurį nurodote',
            'El. pašto adresas atsakymui',
            'Puslapio rodymo kalba išsiuntimo metu',
            'Kalba, kuria rašėte',
            'Konsultacijos kalba, kurios pageidaujate',
            'Originalus tekstas, kurį parašėte',
            'Jūsų sutikimas išsiųsti užklausą',
            'Pateikimo numeris užklausai rasti',
          ],
        },
        {
          heading: 'Originalus tekstas išsaugomas be pakeitimų',
          paragraphs: [
            'Jūsų tekstas išsaugomas tiksliai toks, kokį parašėte, ir automatiškai neverčiamas. Jei nagrinėjimui reikia vertimo, tai aptariama su Jumis atskirai.',
            'Kadangi originalus tekstas išsaugomas, pradiniame etape nerašykite to, ko dar nereikia, pavyzdžiui, paso numerio, dokumento numerio ar sąskaitos duomenų.',
          ],
        },
        {
          heading: 'Saugojimo vieta ir prieiga',
          paragraphs: [
            'Jūsų pateikimo turinys saugomas vietoje, kuri nėra viešai prieinama. Prieigą prie jo turi tik įgalioti kontoros asmenys, ir tik užklausai nagrinėti.',
            'Šis puslapis neduoda absoliučios saugumo garantijos. Joks perdavimo kelias ir jokia saugojimo vieta nėra visiškai saugi; jautrius dokumentus todėl reikėtų siųsti tik po atskiro advokatės arba advokato nurodymo.',
          ],
        },
        {
          heading: 'Naudojimo tikslas',
          paragraphs: [
            'Išsiųsti duomenys skirti užklausai įvertinti, atsakymui Jums, bendravimo būdui išsiaiškinti ir nagrinėjimui, jei darbas priimamas.',
            'Duomenys be atskiro sutikimo nenaudojami rinkodarai.',
          ],
        },
        {
          heading: 'Pranešimas ir pateikimo numeris',
          paragraphs: [
            'Jei užklausa sėkmingai išsiunčiama, sistema praneša kontorai. Jei šis pranešimas dar nepatvirtintas, Jūsų tekstas lieka išsaugotas ir nedingsta.',
            'Pateikimo numeris skirtas Jūsų užklausai rasti mūsų įrašuose. Jis rodomas po išsaugojimo; galite jį nurodyti kreipdamiesi iš naujo.',
          ],
        },
        {
          heading: 'Jūsų teisės ir kreipimosi kelias',
          paragraphs: [
            'Galite prašyti prieigos prie savo duomenų, jų taisymo ar ištrynimo arba atšaukti sutikimą el. pašto adresu, nurodytu kontaktų puslapyje. Jei yra įstatyminė ar procesinė saugojimo pareiga, paaiškinsime apribojimą.',
            'Šis puslapis nenumato fiksuoto saugojimo termino, nes faktinė trukmė priklauso nuo tolesnės bylos eigos ir susijusių pareigų. Jei pageidaujate ankstesnio ištrynimo, nurodykite tai kreipdamiesi.',
          ],
        },
        {
          heading: 'Saugojimo vieta ir paslaugų teikėjai',
          paragraphs: [
            'Ši svetainė talpinama Vercel, o Jūsų pateikimas saugomas neviešoje šios paslaugos duomenų saugykloje. El. laiškai siunčiami pašto paslauga, kuria naudojasi kontora.',
            'Atskiri paslaugų teikėjų serveriai gali būti už Taivano ribų, todėl Jūsų duomenys ten gali būti saugomi ir tvarkomi. Kai saugojimo tikslas įvykdytas, duomenys ištrinami nedelsiant; duomenys, kuriuos reikia saugoti pagal taikomus teisės aktus, lieka šiam laikotarpiui. Prašymus dėl asmens duomenų priima wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'ĮSPĖJIMAS',
      title: 'Šio puslapio informacijos apimtis ir ribos',
      description:
        'Bendra informacijos prigimtis, teisinė sistema ir sąlygos, kurioms esant atsiranda advokato ir kliento santykiai.',
      intro:
        'Ši dalis paaiškina, kuo šie lietuviški informaciniai puslapiai gali padėti ir kuo negali.',
      sections: [
        {
          heading: 'Tik bendra informacija',
          paragraphs: [
            'Šių puslapių turinys parašytas kaip bendra informacija. Tai nėra teisinė konsultacija Jūsų byloje ir nepakeičia Jūsų dokumentų vertinimo.',
            'Bylos rezultatas priklauso nuo faktinių aplinkybių, taikomų teisės aktų ir to, kada byla vertinama; dvi panašiai atrodančios padėtys gali baigtis skirtingai.',
          ],
        },
        {
          heading: 'Teisinė sistema',
          paragraphs: [
            'Kontora veikia pagal Taivano teisę ir šis puslapis kalba tik apie darbą šioje sistemoje.',
            'Turinys nėra konsultacija pagal kitos valstybės teisę, ne Taivano, įskaitant Jūsų gyvenamosios vietos teisę. Jei dalis Jūsų bylos liečia kitą teisės sistemą, su Jumis išsiaiškinsime, koks kvalifikuotas asmuo šiai daliai reikalingas.',
          ],
        },
        {
          heading: 'Advokato ir kliento santykiai patys savaime nesusidaro',
          paragraphs: [
            'Šio puslapio perskaitymas, formos ar el. laiško išsiuntimas pats savaime nesukuria advokato ir kliento santykių.',
            'Šie santykiai susidaro tik po to, kai byla įvertinta ir abi šalys patvirtino darbo priėmimą.',
          ],
        },
        {
          heading: 'Jokio pažado dėl rezultato',
          paragraphs: [
            'Jokia šio puslapio dalis nėra pažadas dėl bylos rezultato, paraiškos ar prašymo patenkinimo ar dėl gyvenamosios vietos ir darbo statuso.',
            'Išorinės nuorodos skirtos orientacijai; nežadame trečiųjų asmenų turinio teisingumo ar aktualumo.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'STRAIPSNIAI',
      title: 'Straipsniai apie Taivano teisę',
      description:
        'Straipsniai lietuvių kalba apie dažnus Taivano teisės klausimus. Turinys yra bendra informacija paskelbimo metu, o ne teisinė konsultacija Jūsų byloje.',
      intro:
        'Kontora skelbia straipsnius apie dažnus Taivano teisės klausimus. Straipsniai, prieinami lietuvių kalba, yra šiame puslapyje; šalia jų yra keturios nuorodos, iš kurių kiekviena atveria straipsnių sąrašą viena originalo kalba.',
      sections: [
        {
          heading: 'Keturi sąrašai pagal kalbą',
          paragraphs: [
            'Šioje dalyje yra keturios nuorodos: straipsnių sąrašas korėjiečių, kinų, anglų ir japonų kalbomis. Kiekviena nuoroda nurodo sąrašo kalbą, todėl iš anksto žinote, kokia kalba turinys atsivers.',
            'Šie keturi sąrašai yra sąrašai pagal straipsnių originalo kalbą, o ne vertimų sąrašai. Straipsniai, prieinami lietuvių kalba, yra atskirai šiame puslapyje.',
          ],
        },
        {
          heading: 'Kur veda nuorodos',
          paragraphs: [
            'Pasirinkus vieną iš keturių nuorodų, atsidaro straipsnių sąrašas ta kalba. Iš sąrašo tekstą pasirenkate patys; visas turinys rodomas straipsnio originalo kalba.',
            'Šis puslapis straipsnių turinio nesutraukia ir negarantuoja, kad tam tikra tema prieinama visomis keturiomis kalbomis. Kiekviename sąraše yra tik tekstai, paskelbti ta kalba.',
          ],
        },
        {
          heading: 'Kiek straipsnis gali padėti orientuotis',
          paragraphs: [
            'Straipsniai yra bendra informacija paskelbimo metu. Teisės aktai ir jų taikymas gali keistis, ir straipsnis neapima visų Jūsų bylos aplinkybių.',
            'Todėl tikros bylos eigos nesiremkite vien straipsniu. Naudokite jį apžvalgai, o savo dokumentus aptarkite atskirai su advokate arba advokatu; šis puslapis nėra konsultacijos žingsnis.',
          ],
        },
      ],
    },
  },
};

export const latvianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Latviešu',
  nav: {
    home: 'Sākums',
    services: 'Pakalpojumi',
    about: 'Par mums',
    lawyers: 'Advokāti',
    pricing: 'Izmaksas',
    contact: 'Saziņa',
    faq: 'Jautājumi',
    privacy: 'Privātums',
    disclaimer: 'Atruna',
    columns: 'Raksti',
  },
  contactCta: 'Nosūtīt izvērtēšanas pieteikumu',
  footerNotice:
    'Šī latviešu lapa sniedz tikai vispārīgu informāciju par biroja darbu saskaņā ar Taivānas tiesībām. Tā nav juridisks padoms konkrētā lietā, un ziņojuma nosūtīšana pati par sevi nerada attiecības starp advokāti vai advokātu un klientu.',
  skipLink: 'Izlaist navigāciju un pāriet pie satura',
  menuLabel: 'Izvēlne',
  languageLabel: 'Lapas valoda',
  mega: {
    services: {
      description: 'Birojs strādā Taivānas tiesību galvenajās jomās.',
      viewAllLabel: 'Rādīt visus',
    },
    columns: {
      description: 'Raksti par biežiem Taivānas tiesību jautājumiem.',
      viewAllLabel: 'Rādīt visus',
    },
    lawyers: {
      description: 'Advokāšu un advokātu, kā arī saziņas veidu iepazīstināšana.',
      viewAllLabel: 'Rādīt visus',
    },
    pricing: {
      description: 'Šī lapa izskaidro darba apjomu un to, kā tiek noskaidrotas izmaksas.',
      viewAllLabel: 'Rādīt visus',
    },
    faq: {
      description: 'Bieži jautājumi par biroja darbu Taivānā.',
      viewAllLabel: 'Rādīt visus',
    },
  },
  notFoundTitle: 'Lapa nav atrasta',
  notFoundText:
    'Meklētā lapa nepastāv vai ir pārvietota. Varat atgriezties pie latviešu sākumlapas un apskatīt pieejamo informāciju.',
  backHomeLabel: 'Uz sākumlapu',
  readSourceLabel: 'Atvērt rakstu sarakstu sākotnējā valodā',
  home: {
    heroScrollLabel: 'Ritināt lejup',
    heroColumnsCtaLabel: 'Skatīt rakstus',
    servicesDetailLabel: 'Skatīt sīkāku informāciju',
    servicesAssistanceBefore: 'Ja nav skaidrs, kurai jomai Jūsu lieta pieder, lapa ',
    servicesAssistanceLinkLabel: 'Saziņa',
    servicesAssistanceAfter: ' izskaidro, kā sagatavot kopsavilkumu, ko izvērtēs advokāte vai advokāts.',
    columnsViewAllLabel: 'Skatīt visus rakstus',
    columnsReadMoreLabel: 'Lasīt tālāk',
    columnsReviewLabel: 'Pārbaudījusi advokāte Wei Tseng',
    columnsOriginalLanguageBadge: 'Sākotnējā valoda',
    columnsOriginalLanguageNote:
      'Turpmākie raksti latviešu valodā vēl nav pieejami. Saraksts paliek sākotnējā valodā un atver attiecīgo valodas lapu; saturs netiek tulkots automātiski.',
    imageBandAlt: 'Tradicionāla Taivānas sanheyuan (三合院) sēta un mūsdienīgs paviljons dienasgaismā',
    videoPauseLabel: 'Apturēt video',
    videoPlayLabel: 'Atskaņot video',
    videoReplayLabel: 'Atskaņot video no sākuma',
  },
  pages: {
    home: {
      eyebrow: 'INFORMĀCIJA',
      title: 'Juridiskie pakalpojumi Taivānā — informācija latviešu valodā',
      description:
        'Vispārīgs skaidrojums latviešu valodā par Hovering International Law Firm darba jomu Taivānā, par konsultācijas valodām un par pirmo saziņu.',
      intro:
        'Hovering International Law Firm palīdz ārvalstu klientiem, arī tiem, kam ir saikne ar Taivānu, lietās saskaņā ar Taivānas tiesībām: ieguldījumi un sabiedrību dibināšana, civillietas, laulība, ģimene un mantojums, darba tiesības, krimināllietas un intelektuālais īpašums. Šī latviešu daļa palīdz Jums saprast, kurš darbs ietilpst mūsu jomā, kas jāsagatavo un kā mūs sasniegt. Tā ir vispārīga informācija, nevis juridisks padoms Jūsu lietā.',
      sections: [
        {
          heading: 'Ko mēs darām',
          paragraphs: [
            'Hovering International Law Firm ir advokātu birojs, kas dibināts Taivānā. Tas strādā saskaņā ar Taivānas tiesībām un uztur birojus Taipejā (臺北), Gaosjunā (高雄), Taidžunā (臺中) un Pindunā (屏東). Mēs konsultējam uzņēmumus, vedam tiesvedību un palīdzam ārvalstu klientiem veikt soļus, kas Taivānā ir nepieciešami.',
            'Viss šeit sniegtais saturs ir vispārīgs. Lietas iznākums ir atkarīgs no faktiem, piemērojamajiem noteikumiem un laika. Šī informācija neaizstāj pārrunas ar advokāti vai advokātu par Jūsu dokumentiem.',
          ],
        },
        {
          heading: 'Lapas valoda un konsultācijas valoda nav viens un tas pats',
          paragraphs: [
            'Šī lapa ir rakstīta latviešu valodā, bet konsultācija ar advokāti vai advokātu notiek tikai četrās valodās: angļu, ķīniešu (中文), japāņu un korejiešu. Tas, ka lasāt informāciju latviešu valodā, nenozīmē, ka saruna ar advokāti vai advokātu notiks latviski.',
            'Mēs nesolām tulku, atbildes termiņu un tikšanos, izmantojot šo lapu. Ja nevarat lietot nevienu no četrām konsultācijas valodām, lapa „Saziņa“ izskaidro, kā mēs izvērtējam saziņas veidu.',
          ],
        },
        {
          heading: 'Biroja jomas',
          paragraphs: [
            'Darba joma aptver šīs sešas grupas. Lapa „Pakalpojumi“ katru no tām apraksta precīzāk un nosauc to, kas netiek solīts.',
          ],
          items: [
            'Ieguldījumi un sabiedrību dibināšana Taivānā',
            'Civillietas un zaudējumu atlīdzība',
            'Laulība, ģimene un mantojums',
            'Darba strīdi',
            'Krimināllietas',
            'Intelektuālais īpašums: preču zīmes, patenti un autortiesības',
          ],
        },
        {
          heading: 'Kur sākt',
          paragraphs: [
            'Izlasiet lapu „Pakalpojumi“ un pārbaudiet, vai Jūsu lieta ietilpst mūsu jomā, pēc tam „Izmaksas“ un „Saziņa“, lai saprastu, kā tiek noteikts apjoms un kā izmaksas apstiprina pirms darba sākšanas.',
            'Nosūtot ziņojumu, kopsavilkumu varat rakstīt savā valodā. Sākotnējais teksts tiek saglabāts tieši tā, kā to uzrakstījāt, un netiek tulkots automātiski. Nosūtīts ziņojums ir pieteikums, kas gaida izvērtējumu: tā vēl nav konsultācija un nav apstiprināta tikšanās.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'PAKALPOJUMI',
      title: 'Kādās lietās mēs palīdzam',
      description:
        'Sešas jomas, kurās birojs strādā Taivānā, un robežas, kas vispirms ir noderīgi zināt.',
      intro:
        'Zemāk ir jomas, kurās mēs patiešām strādājam, un jautājumi, kas sākumposmā tiek uzdoti visbiežāk. Izklāsts palīdz novērtēt, vai Jūsu lieta ietilpst mūsu jomā; tas ir vispārīgs un nav atsevišķas lietas juridiskā analīze.',
      sections: [
        {
          heading: 'Ieguldījumi un sabiedrību dibināšana Taivānā',
          paragraphs: [
            'Mēs palīdzam ārvalstu ieguldītājiem un uzņēmumiem dibināt vai vadīt sabiedrību Taivānā: tiesiskās formas izvēle, dokumentu sagatavošana un iesniegšana, kapitāla iemaksa, bankas jautājumi, atrašanās vietas izvērtējums un nozares prasības. Atbalstām arī grāmatvedību un nodokļus, kas izriet no dibināšanas un darbības Taivānā.',
            'Gaita un termiņi atšķiras pēc formas, ieguldītāja, nozares, bankas un jau pieejamajiem dokumentiem. Sabiedrības dibināšana pati par sevi nenodrošina uzturēšanās atļauju (居留) un darba atļauju (工作許可): tās ir atsevišķas procedūras, ko izvērtē pēc konkrētās personas situācijas.',
          ],
        },
        {
          heading: 'Civillietas un zaudējumu atlīdzība',
          paragraphs: [
            'Šī joma aptver strīdus no līgumiem, zaudējumu atlīdzību no prettiesiskas rīcības un patērētāju strīdus. Darbs parasti sākas ar hronoloģiju, dokumentu un jau esošo pierādījumu izvērtējumu, un tikai pēc tam seko nākamie soļi.',
            'Gaitu nosaka termiņi, tostarp noilgums, un pierādījumu pilnīgums. Tāpēc zināmos datumus nosauciet pēc iespējas agri. Saglabājiet līgumus, ziņojumus, maksājumu apliecinājumus vai vietas fotogrāfijas un miniet tos pirmajā ziņojumā.',
          ],
        },
        {
          heading: 'Laulība, ģimene un mantojums',
          paragraphs: [
            'Mēs vedam laulības šķiršanu (離婚), mantas sadali, aizgādību un vecāku atbildību par nepilngadīgiem bērniem (未成年子女權利義務之行使或負擔), saskarsmes tiesības (會面交往) un mantojumu (繼承), arī tad, ja puses vai manta atrodas dažādās valstīs. Pārrobežu ģimenes lietās bieži vajadzīgs papildu izvērtējums mājsaimniecības reģistra (戶籍) ierakstiem, aktu formai un to pierādīšanas spējai Taivānā.',
            'Tā kā ģimenes lietām bieži ir termiņi un paralēlas procedūras, pirmajam kopsavilkumam jānorāda pušu attiecības, pašreizējā dzīvesvieta un jau notiekošās procedūras.',
          ],
        },
        {
          heading: 'Darba strīdi',
          paragraphs: [
            'Šī joma aptver darba attiecību izbeigšanu, likumā noteikto atlaišanas pabalstu saskaņā ar Taivānas tiesībām (資遣費; to nedrīkst pielīdzināt līdzīgiem institūtiem citās valstīs), atlīdzību un strīdus no darba līguma (勞動契約), gan darbinieka, gan darba devēja pusē. Izvērtējumā nošķiram izbeigšanas iemeslu no uzteikuma, izmaksas un termiņu jautājumiem.',
            'Bieži izšķirošie dokumenti ir darba līgums, iekšējie darba noteikumi (工作規則), algas lapiņas un pušu sarakste. Ja tie Jums joprojām ir, miniet to kopsavilkumā.',
          ],
        },
        {
          heading: 'Krimināllietas',
          paragraphs: [
            'Mēs pārstāvam aizdomās turētos un apsūdzētos, kā arī cietušos pirmstiesas izmeklēšanā un tiesā un izvērtējam uzņēmējdarbības krimināltiesiskos riskus.',
            'Krimināllietām bieži ir īsi termiņi un noteikti posmi. Ja jau esat saņēmuši kriminālprocesa iestādes vai tiesas rakstu, nosauciet rakstā norādīto datumu laikus, lai saturu izvērtētu pareizā secībā.',
          ],
        },
        {
          heading: 'Intelektuālais īpašums',
          paragraphs: [
            'Mēs atbalstām preču zīmju (商標) un patentu (專利) reģistrāciju, autortiesības un strīdus par šīm tiesībām Taivānā.',
            'Šajā jomā izšķir soļu secība: aizsardzības apjoms, pieteikuma iesniegšanas brīdis un faktiskā lietošana ietekmē izvēli. Pieteikuma iesniegšana pati par sevi nenozīmē, ka tas tiks apstiprināts.',
          ],
        },
        {
          heading: 'Apjoms un tā apstiprināšana',
          paragraphs: [
            'Birojs strādā saskaņā ar Taivānas tiesībām un ved lietas no iepriekš minētajām jomām. Katras lietas apjoms tiek apstiprināts atsevišķi pēc tam, kad advokāte vai advokāts ir izvērtējis Jūsu ziņojumu.',
            'Uzturēšanās statusu, darba atļauju un līdzīgus jautājumus izvērtē pēc dokumentiem un konkrētās personas situācijas, nevis pēc valstspiederības. Ja daļa Jūsu lietas skar šos punktus, miniet to, sazinoties ar mums. Šī lapa nesola iznākumu un atbildes termiņu.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'BIROJS',
      title: 'Par Hovering International Law Firm',
      description:
        'Pamatinformācija par šo Taivānas advokātu biroju, tā birojiem un darbu ar ārvalstu pusēm.',
      intro:
        'Hovering International Law Firm ir advokātu birojs Taivānā. Advokātes un advokāti strādā no uzņēmumu konsultācijām līdz tiesvedībai. Šī daļa apraksta biroja izveidi, atrašanās vietas un darbu ar ārvalstu pusēm.',
      sections: [
        {
          heading: 'Dibināšana un struktūra',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) 2016. gadā dibināja advokātes un advokāti, kuri studēja National Taiwan University (國立臺灣大學). Ķīniešu nosaukums 昊鼎 savieno zīmi 昊 („plašās debesis“) ar zīmi 鼎 („stabils pamats“) un raksturo biroja ievirzi kopš dibināšanas.',
            'Mums ir biroji Taipejā (臺北), Gaosjunā (高雄), Taidžunā (臺中) un Pindunā (屏東). Gaosjunas birojs koncentrējas uz uzņēmumu vadību un ved civillietas, krimināllietas un administratīvos strīdus. Taidžunas birojs ved būvniecības lietas, intelektuālo īpašumu un lietas ar saikni ar Koreju un Japānu. Pindunas birojs tika atvērts 2017. gadā vietējām vajadzībām.',
            'Līdzās advokātu darbam kopš 2020. gada darbojas arī Hovering Accounting Office, kas piedāvā grāmatvedību un nodokļu plānošanu uzņēmējiem un turīgām privātpersonām.',
          ],
        },
        {
          heading: 'Darbs ar ārvalstu pusēm',
          paragraphs: [
            'Pārrobežu darbs aptver sabiedrību dibināšanu, vīzas, preču zīmju un patentu pieteikumus, tiesiskā riska izvērtējumu un nodokļu konsultācijas uzņēmumiem. Taidžunas birojs jo īpaši ved būvniecības lietas, intelektuālo īpašumu un lietas ar saikni ar Koreju un Japānu. Advokāte Wei Tseng (曾雋崴) palīdz klientiem no Korejas, no Japānas un citiem starptautiskiem klientiem minētajās jomās.',
            'Vai lietu varam uzņemties, ir atkarīgs no satura un saziņas valodas. Ja Jūsu lieta ietilpst minētajās jomās un to var pārrunāt kādā no četrām konsultācijas valodām, varat nosūtīt kopsavilkumu izvērtēšanai.',
          ],
        },
        {
          heading: 'Kad sazināties ar mums',
          paragraphs: [
            'Pēc Jūsu kopsavilkuma saņemšanas advokāte vai advokāts izvērtē saturu un pēc tam runā par iespējamo darba apjomu, vēl vajadzīgajiem dokumentiem un nākamajiem soļiem. Nodokļu vai grāmatvedības jautājumos birojs var rīkoties kopā ar grāmatvedības daļu vienā gaitā.',
            'Katras lietas iznākums ir atkarīgs no faktiem un pieejamajiem dokumentiem; iznākumu nesolām. Ja Jums vajadzīga saistoša atbilde savai situācijai, dokumenti jāpārrunā ar advokāti vai advokātu kādā no četrām konsultācijas valodām.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKĀTI',
      title: 'Hovering starptautiskā komanda',
      description: 'Hovering advokātu un līdzstrādnieku, kā arī partnera grāmatvedības un revīzijas profili.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'IZMAKSAS',
      title: 'Kā nosaka darba apjomu un izmaksas',
      description:
        'Skaidrojums par secību: vispirms darba apjoms, pēc tam izmaksu apstiprinājums, un kāpēc šajā lapā nav cenrāža.',
      intro:
        'Šī lapa izskaidro, kā izmaksas nosaka, nevis to apmēru. Apmērs ir atkarīgs no darba apjoma konkrētajā lietā un ir jēgpilns tikai tad, kad šis apjoms ir skaidrs.',
      sections: [
        {
          heading: 'Vispirms nosaka darba apjomu',
          paragraphs: [
            'Viena veida lietas var prasīt ļoti atšķirīgu piepūli atkarībā no pušu skaita, pieejamajiem dokumentiem, termiņiem, kas jāievēro, un no tā, vai procedūra jau ir sākusies. Tāpēc pirmais solis vienmēr ir noteikt, kas darbā ietilpst un kas ne.',
            'Kopsavilkums, ko nosūtāt sākumā, ir šā apjoma pamats. Jo skaidrāk tas apraksta gaitu, Jūsu lūgumu un termiņus, jo precīzāk apjomu var noteikt.',
          ],
        },
        {
          heading: 'Izmaksas apstiprina pirms darba sākšanas',
          paragraphs: [
            'Kad darba apjoms ir skaidrs, izmaksu apmēru un aprēķina veidu ar Jums pārrunā un apstiprina, pirms darbs sākas. Ja apjoms gaitā mainās, tas jāapstiprina no jauna.',
            'Šī lapa nav cenu piedāvājums un nerada maksāšanas pienākumu.',
          ],
        },
        {
          heading: 'Konsultācija var būt pret samaksu',
          paragraphs: [
            'Konsultācija ar advokāti vai advokātu var būt maksas pakalpojums. Šī lapa nesaka, ka pirmā konsultācija ir bez maksas, un nevienu tās daļu nedrīkst tā saprast.',
            'Ja konsultācija ir pret samaksu, apmēru un maksāšanas veidu paziņo, pirms tā notiek.',
          ],
        },
        {
          heading: 'Kāpēc šajā lapā nav tarifu',
          paragraphs: [
            'Izmaksas ir atkarīgas no lietas pašas: no piepūles, pušu skaita, dokumentiem, termiņiem un no tā, vai procedūra jau notiek. Iepriekš noteikts skaitlis Jūsu lietas izmaksas neparādītu. Tāpēc vispirms nosakām darba apjomu un pēc tam paziņojam Jums izmaksas, pirms darbs sākas.',
            'Līdzās honorāram var rasties tiesas nodevas, iestāžu vai trešo personu izmaksas. Tās ir nošķirtas no honorāra un ir atkarīgas no attiecīgās procedūras.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'SAZIŅA',
      title: 'Kā sazināties ar biroju',
      description:
        'Lapas valoda, konsultācijas valodas, rīcība, ja nevarat lietot nevienu no četrām valodām, un tas, ko šī lapa nesola.',
      intro:
        'Pirms mums rakstāt, nošķiriet šos trīs punktus. Tos bieži sajauc, taču tie nozīmē atšķirīgas lietas.',
      sections: [
        {
          heading: 'Trīs lietas, kas jātur nošķirtas',
          paragraphs: [
            'Lapas valoda, konsultācijas valoda ar advokāti vai advokātu un valoda, kurā rakstāt, ir trīs atšķirīgas lietas.',
          ],
          items: [
            'Lapas valoda: šī informācija ir rakstīta latviešu valodā.',
            'Konsultācijas valoda: konsultācija notiek tikai angļu, ķīniešu (中文), japāņu un korejiešu valodā.',
            'Valoda, kurā rakstāt: kopsavilkumu varat rakstīt savā valodā; sākotnējais teksts tiek saglabāts bez izmaiņām.',
          ],
        },
        {
          heading: 'Ja nevarat lietot nevienu no četrām konsultācijas valodām',
          paragraphs: [
            'Saziņas veidlapā varat izvēlēties „Saziņas veids ir jāapstiprina“. Mēs atbildēsim, lai izvērtētu, vai pastāv izmantojams saziņas veids; pakalpojums citā valodā nav garantēts, un atbildes termiņš netiek solīts.',
            'Tas ir tikai izvērtēšanas solis, nevis solījums. Mēs nesolām tulku, pakalpojumu latviešu valodā vai citā valodā ārpus četrām minētajām valodām un nesolām, ka pieņemsim katru lietu.',
          ],
        },
        {
          heading: 'Kas jāietver pirmajā ziņojumā',
          paragraphs: [
            'Nosauciet, kas ir noticis, kāda palīdzība Jums vajadzīga, kāda saikne lietai ir ar Taivānu, un termiņu, ja to zināt. Ja jau esat saņēmuši tiesas vai iestādes rakstu, nosauciet rakstā norādīto datumu.',
            'Sākumposmā vēl nav jānosūta pases numurs, personas dokumenta numurs, konta dati, medicīniskā dokumentācija vai visa pierādījumu kopa. Gaidiet advokātes vai advokāta norādījumus; sensitīvos dokumentus pēc tam sūtiet drošā ceļā.',
          ],
        },
        {
          heading: 'Ko šī lapa nesola',
          paragraphs: [
            'Mēs nesolām atbildes termiņu, neapstiprinām tikšanos, izmantojot šo lapu, nesolām konkrētu advokāti vai konkrētu advokātu un nenodrošinām tulku. Rakstisks tulkojums ir kas cits: Jūsu ziņojums netiek tulkots automātiski.',
            'Ja nosūtāt pieteikumu, saturs tiek saglabāts un gaida izvērtējumu. Ja pēc kāda laika atbildi nesaņemat, varat rakstīt no jauna uz e-pasta adresi, kas norādīta saziņas lapā.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'JAUTĀJUMI',
      title: 'Bieži uzdotie jautājumi',
      description:
        'Skaidrojumi par darba jomu, sagatavošanos, valodām, izmaksām un to, ko nozīmē nosūtīts pieteikums.',
      intro:
        'Turpmākie jautājumi ir atbildēti vispārīgas informācijas līmenī. Atbilde Jūsu lietai ir iespējama tikai pēc tam, kad advokāte vai advokāts ir izvērtējis dokumentus.',
      sections: [
        {
          heading: 'Kā lietot šo daļu',
          paragraphs: [
            'Ja neatrodat atbildi savai situācijai, atbilde parasti ir atkarīga no īpašiem faktiem. Tāpēc ierakstiet tos kopsavilkumā, nevis izseciniet tos no šīs lapas.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Kādas lietas birojs ved?',
          answer:
            'Mēs vedam sešas jomas: ieguldījumus un sabiedrību dibināšanu Taivānā, civillietas un zaudējumu atlīdzību, laulību, ģimeni un mantojumu, darba strīdus, krimināllietas un intelektuālo īpašumu. Vai lieta tiks pieņemta, izlemj pēc satura izvērtējuma.',
        },
        {
          question: 'Kas jāsagatavo pirms saziņas?',
          answer:
            'Sagatavojiet īsu kopsavilkumu par gaitu, savu lūgumu, saikni ar Taivānu un termiņu, ja tāds ir. Ja jau ir tiesas vai iestādes raksts, nosauciet datumu. Šajā posmā vēl nav jānosūta personas dokumenti vai visa pierādījumu kopa.',
        },
        {
          question: 'Vai konsultācija ir iespējama latviešu valodā?',
          answer:
            'Nē. Šī informācija ir rakstīta latviešu valodā, bet konsultācija ar advokāti vai advokātu notiek tikai angļu, ķīniešu (中文), japāņu un korejiešu valodā. Mēs nesolām arī tulku. Rakstisks tulkojums ir kas cits: sākotnējais teksts, ko uzrakstāt, tiek saglabāts tāds, kāds tas ir, un netiek tulkots automātiski.',
        },
        {
          question: 'Ko darīt, ja nevaru lietot nevienu no četrām valodām?',
          answer:
            'Nosūtot pieteikumu, izvēlieties „Saziņas veids ir jāapstiprina“. Mēs atbildēsim, lai izvērtētu saziņas veidu, taču pakalpojums citā valodā nav garantēts. Tas ir izvērtēšanas solis, nevis solījums, ka varam strādāt citā valodā.',
        },
        {
          question: 'Kā rīkojas ar manu tekstu latviešu valodā?',
          answer:
            'Sākotnējais teksts, ko uzrakstāt, tiek saglabāts tāds, kāds tas ir, un netiek tulkots automātiski. Ja tas ir vajadzīgs, turpmākās saziņas valodu apstiprina ar Jums.',
        },
        {
          question: 'Vai konsultācija jau ir notikusi, ja pieteikums ir nosūtīts?',
          answer:
            'Nē. Nosūtīts pieteikums gaida advokātes vai advokāta izvērtējumu. Tas nav juridisks atzinums, nav apstiprināta tikšanās, un pats nosūtījums nerada attiecības starp advokāti vai advokātu un klientu.',
        },
        {
          question: 'Kā aprēķina izmaksas?',
          answer:
            'Vispirms nosaka darba apjomu, pēc tam ar Jums apstiprina izmaksu apmēru un aprēķina veidu, pirms darbs sākas. Šī lapa nenosauc summas un nesaka, ka pirmā konsultācija ir bez maksas.',
        },
        {
          question: 'Ko darīt, ja mana lieta ir ļoti steidzama?',
          answer:
            'Nosauciet termiņu vai datumu no iestādes raksta tūlīt kopsavilkuma sākumā, lai šie datumi izvērtējumā būtu redzami. Šai lapai nav ārkārtas kanāla, un tā nenodrošina atbildes termiņu; ja Jūsu lieta nevar gaidīt, Jums paralēli jāmeklē citi ceļi savā vietā.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVĀTUMS',
      title: 'Dati, ko vāc saziņas veidlapa',
      description:
        'Ko vāc saziņas veidlapa šajā latviešu daļā, kā rīkojas ar sākotnējo tekstu un kā mūs sasniegt par Jūsu datiem.',
      intro:
        'Šī daļa attiecas tikai uz saziņas veidlapu šajās informatīvajās lapās. Tā apraksta rīcību ar datiem, nevis tehnisku garantiju.',
      sections: [
        {
          heading: 'Kādus datus vāc',
          paragraphs: [
            'Ja nosūtāt pieteikumu, izmantojot veidlapu šajā daļā, tiek fiksēti šādi dati:',
          ],
          items: [
            'Vārds, ko norādāt',
            'E-pasta adrese atbildei',
            'Lapas valoda nosūtīšanas brīdī',
            'Valoda, kurā rakstījāt',
            'Konsultācijas valoda, ko vēlaties',
            'Sākotnējais teksts, ko uzrakstījāt',
            'Jūsu piekrišana pieteikuma nosūtīšanai',
            'Iesnieguma numurs pieteikuma atrašanai',
          ],
        },
        {
          heading: 'Sākotnējais teksts tiek saglabāts bez izmaiņām',
          paragraphs: [
            'Jūsu teksts tiek saglabāts tieši tā, kā to uzrakstījāt, un netiek tulkots automātiski. Ja izskatīšanai vajadzīgs tulkojums, to ar Jums pārrunā atsevišķi.',
            'Tā kā sākotnējais teksts tiek saglabāts, sākumposmā nerakstiet to, kas vēl nav vajadzīgs, piemēram, pases numuru, personas dokumenta numuru vai konta datus.',
          ],
        },
        {
          heading: 'Glabāšanas vieta un piekļuve',
          paragraphs: [
            'Jūsu iesnieguma saturs tiek glabāts vietā, kas nav publiski pieejama. Tam drīkst piekļūt tikai pilnvarotas personas birojā, lai izskatītu pieteikumu.',
            'Šī lapa nedod absolūtu drošības garantiju. Neviens pārraides ceļš un neviena glabāšanas vieta nav pilnīgi droša; tāpēc sensitīvie dokumenti jāsūta tikai pēc īpaša advokātes vai advokāta norādījuma.',
          ],
        },
        {
          heading: 'Izmantošanas mērķis',
          paragraphs: [
            'Nosūtītie dati kalpo pieteikuma izvērtēšanai, atbildei Jums, saziņas veida noskaidrošanai un izskatīšanai, ja darbs tiek uzņemts.',
            'Datus bez atsevišķas piekrišanas neizmanto mārketingam.',
          ],
        },
        {
          heading: 'Paziņojums un iesnieguma numurs',
          paragraphs: [
            'Ja pieteikums ir sekmīgi nosūtīts, sistēma paziņo birojam. Ja šis paziņojums vēl nav saņemts, Jūsu teksts paliek saglabāts un nezūd.',
            'Iesnieguma numurs kalpo Jūsu pieteikuma atrašanai mūsu uzskaitē. Tas parādās pēc saglabāšanas; varat to minēt, sazinoties no jauna.',
          ],
        },
        {
          heading: 'Jūsu tiesības un saziņas ceļš',
          paragraphs: [
            'Varat lūgt piekļuvi saviem datiem, to labošanu vai dzēšanu, vai atsaukt piekrišanu, izmantojot e-pasta adresi, kas norādīta saziņas lapā. Ja pastāv likumā vai procesā noteikts glabāšanas pienākums, izskaidrosim ierobežojumu.',
            'Šī lapa nenosauc fiksētu glabāšanas termiņu, jo faktiskais ilgums ir atkarīgs no lietas tālākās gaitas un saistītajiem pienākumiem. Ja vēlaties agrāku dzēšanu, pasakiet to, sazinoties ar mums.',
          ],
        },
        {
          heading: 'Glabāšanas vieta un pakalpojumu sniedzēji',
          paragraphs: [
            'Šīs vietnes mitināšanu nodrošina Vercel, un Jūsu iesniegums tiek glabāts šā pakalpojuma nepubliskajā datu krātuvē. E-pastus sūta pasta pakalpojums, ko birojs lieto.',
            'Atsevišķu pakalpojumu sniedzēju serveri var atrasties ārpus Taivānas, tāpēc Jūsu datus tur var glabāt un apstrādāt. Kad glabāšanas mērķis ir izpildīts, datus dzēš bez liekas kavēšanās; dati, kas jāglabā saskaņā ar piemērojamiem noteikumiem, paliek šajā laikā. Personu datu pieprasījumus pieņem wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'ATRUNA',
      title: 'Informācijas apjoms un robežas šajā lapā',
      description:
        'Informācijas vispārīgais raksturs, tiesiskais ietvars un priekšnoteikumi attiecībām starp advokāti vai advokātu un klientu.',
      intro:
        'Šī daļa skaidro, ko šīs latviešu informatīvās lapas Jums sniedz un ko nesniedz.',
      sections: [
        {
          heading: 'Tikai vispārīga informācija',
          paragraphs: [
            'Šo lapu saturs ir rakstīts kā vispārīga informācija. Tas nav juridisks padoms Jūsu lietā un neaizstāj Jūsu dokumentu izvērtējumu.',
            'Lietas iznākums ir atkarīgs no faktiem, piemērojamajiem noteikumiem un laika; divas šķietami līdzīgas situācijas var beigties atšķirīgi.',
          ],
        },
        {
          heading: 'Tiesiskais ietvars',
          paragraphs: [
            'Birojs darbojas saskaņā ar Taivānas tiesībām, un šī lapa runā tikai par darbu šajā ietvarā.',
            'Saturs nav konsultācija pēc citas valsts tiesībām, izņemot Taivānas tiesības, tostarp Jūsu uzturēšanās vietas tiesības. Ja daļa Jūsu lietas skar citu tiesību kārtību, ar Jums noskaidrosim, kāds kvalificēts speciālists šai daļai ir vajadzīgs.',
          ],
        },
        {
          heading: 'Attiecības starp advokāti vai advokātu un klientu nerodas pašas no sevis',
          paragraphs: [
            'Šīs lapas izlasīšana, veidlapas vai e-pasta nosūtīšana pati par sevi nerada attiecības starp advokāti vai advokātu un klientu.',
            'Šīs attiecības rodas tikai pēc tam, kad lieta ir izvērtēta un abas puses ir apstiprinājušas darba uzņemšanos.',
          ],
        },
        {
          heading: 'Nekāds iznākuma solījums',
          paragraphs: [
            'Neviena šīs lapas daļa nav solījums par lietas iznākumu, pieteikuma apstiprināšanu vai uzturēšanās un darba statusu.',
            'Ārējās saites kalpo orientācijai; mēs negarantējam trešo personu satura pareizību un aktualitāti.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'RAKSTI',
      title: 'Raksti par Taivānas tiesībām',
      description:
        'Raksti latviešu valodā par biežiem Taivānas tiesību jautājumiem. Saturs ir vispārīga informācija publicēšanas brīdī, nevis juridisks padoms Jūsu lietā.',
      intro:
        'Birojs publicē rakstus par biežiem Taivānas tiesību jautājumiem. Raksti, kas pieejami latviešu valodā, ir šajā lapā; blakus ir četras saites, no kurām katra atver rakstu sarakstu vienā sākotnējā valodā.',
      sections: [
        {
          heading: 'Četri saraksti pēc valodas',
          paragraphs: [
            'Šajā daļā ir četras saites: rakstu saraksts korejiešu, ķīniešu, angļu un japāņu valodā. Katra saite nosauc saraksta valodu, lai Jūs iepriekš zinātu, kādā valodā saturs atvērsies.',
            'Šie četri saraksti ir saraksti pēc rakstu sākotnējās valodas, nevis tulkojumu saraksti. Raksti, kas pieejami latviešu valodā, ir atsevišķi šajā lapā.',
          ],
        },
        {
          heading: 'Kur saites ved',
          paragraphs: [
            'Ja izvēlaties vienu no četrām saitēm, atveras rakstu saraksts attiecīgajā valodā. No saraksta tekstu izvēlaties paši; viss saturs parādās raksta sākotnējā valodā.',
            'Šī lapa rakstu saturu neapkopo un negarantē, ka kāds temats ir pieejams visās četrās valodās. Katrā sarakstā ir tikai teksti, kas publicēti attiecīgajā valodā.',
          ],
        },
        {
          heading: 'Cik tālu raksts var kalpot orientācijai',
          paragraphs: [
            'Raksti ir vispārīga informācija publicēšanas brīdī. Noteikumi un to piemērošana var mainīties, un raksts neietver visus Jūsu lietas apstākļus.',
            'Tāpēc nerīkojieties īstā lietā, balstoties tikai uz rakstu. Izmantojiet to pārskatam un savus dokumentus pārrunājiet atsevišķi ar advokāti vai advokātu; šī lapa nav konsultācijas solis.',
          ],
        },
      ],
    },
  },
};

export const estonianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Eesti',
  nav: {
    home: 'Avaleht',
    services: 'Teenused',
    about: 'Büroo',
    lawyers: 'Advokaadid',
    pricing: 'Tasud',
    contact: 'Kontakt',
    faq: 'Küsimused',
    privacy: 'Privaatsus',
    disclaimer: 'Lahtiütlus',
    columns: 'Artiklid',
  },
  contactCta: 'Saatke läbivaatamistaotlus',
  footerNotice:
    'See eestikeelne leht sisaldab ainult üldist teavet büroo töö kohta Taiwani õiguse järgi. See ei ole õigusnõu üksiku asja kohta ja teate saatmine iseenesest ei tekita suhet advokaadi ja kliendi vahel.',
  skipLink: 'Jätke navigeerimine vahele ja minge sisu juurde',
  menuLabel: 'Menüü',
  languageLabel: 'Lehe keel',
  mega: {
    services: {
      description: 'Büroo tegeleb Taiwani õiguse põhiliste valdkondadega.',
      viewAllLabel: 'Kuva kõik',
    },
    columns: {
      description: 'Artikleid Taiwani õiguse korduvatest küsimustest.',
      viewAllLabel: 'Kuva kõik',
    },
    lawyers: {
      description: 'Büroo advokaatide tutvustus ja ühenduse võtmise viisid.',
      viewAllLabel: 'Kuva kõik',
    },
    pricing: {
      description: 'See leht selgitab töö ulatust ja seda, kuidas tasud kinnitatakse.',
      viewAllLabel: 'Kuva kõik',
    },
    faq: {
      description: 'Korduvad küsimused büroo töö kohta Taiwanis.',
      viewAllLabel: 'Kuva kõik',
    },
  },
  notFoundTitle: 'Lehte ei leitud',
  notFoundText:
    'Otsitud lehte ei ole või see on teisaldatud. Võite naasta eestikeelsele avalehele ja tutvuda kättesaadavate juhistega.',
  backHomeLabel: 'Avalehele',
  readSourceLabel: 'Avage artiklite loend algkeeles',
  home: {
    heroScrollLabel: 'Kerige allapoole',
    heroColumnsCtaLabel: 'Vaadake artikleid',
    servicesDetailLabel: 'Vaadake üksikasju',
    servicesAssistanceBefore: 'Kui ei ole selge, millisesse valdkonda teie asi kuulub, selgitab leht ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter:
      ', kuidas koostada kokkuvõte, mille advokaat läbi vaatab.',
    columnsViewAllLabel: 'Vaadake kõiki artikleid',
    columnsReadMoreLabel: 'Lugege edasi',
    columnsReviewLabel: 'Läbi vaadanud advokaat Wei Tseng',
    columnsOriginalLanguageBadge: 'Algkeel',
    columnsOriginalLanguageNote:
      'Järgmisi artikleid ei ole veel eesti keeles. Loend jääb algkeelde ja avab vastava keelelehe; sisu ei tõlgita automaatselt.',
    imageBandAlt: 'Traditsiooniline taiwani sanheyuan (三合院) ja kaasaegne paviljon päevavalguses',
    videoPauseLabel: 'Peatage video',
    videoPlayLabel: 'Esitage video',
    videoReplayLabel: 'Esitage video uuesti',
  },
  pages: {
    home: {
      eyebrow: 'JUHISED',
      title: 'Õigusteenused Taiwanis — juhised eesti keeles',
      description:
        'Üldine seletus eesti keeles Hovering International Law Firmi töövaldkonna kohta Taiwanis, nõustamiskeelte ja esimese ühenduse kohta.',
      intro:
        'Hovering International Law Firm abistab välismaiseid kliente, sealhulgas Taiwaniga seotud isikuid, Taiwani õiguse asjades: investeeringud ja äriühingu asutamine, tsiviilvaidlused, abielu, perekond ja pärimine, tööõigus, kriminaalasjad ning intellektuaalomand. See eestikeelne osa aitab teil näha, milline töö kuulub meie valdkonda, mida ette valmistada ja kuidas meieni jõuda. Tegemist on üldise teabega, mitte õigusnõuga teie asjas.',
      sections: [
        {
          heading: 'Millega tegeleme',
          paragraphs: [
            'Hovering International Law Firm on Taiwanis asutatud advokaadibüroo. Ta töötab Taiwani õiguse järgi ning tal on bürood Taipeis (臺北), Kaohsiungis (高雄), Taichungis (臺中) ja Pingtungis (屏東). Nõustame ettevõtteid, viime läbi kohtumenetlusi ja abistame välismaiseid kliente sammudes, mida Taiwanis on vaja teha.',
            'Kogu siinne sisu on üldine. Asja tulemus sõltub asjaoludest, kohalduvatest sätetest ja ajast. Need juhised ei asenda vestlust advokaadiga teie dokumentide üle.',
          ],
        },
        {
          heading: 'Lehe keel ja nõustamiskeel ei ole sama asi',
          paragraphs: [
            'See leht on kirjutatud eesti keeles, kuid nõustamine advokaadiga toimub ainult neljas nõustamiskeeles: inglise, hiina (中文), jaapani ja korea keeles. Juhiste lugemine eesti keeles ei tähenda, et vestlus advokaadiga toimuks eesti keeles.',
            'Me ei luba tõlki, vastamise tähtaega ega kohtumist selle lehe kaudu. Kui te ei saa kasutada ühtegi neljast keelest, selgitab leht „Kontakt“, kuidas suhtlusviisi kontrollitakse.',
          ],
        },
        {
          heading: 'Töövaldkonnad',
          paragraphs: [
            'Töövaldkond hõlmab järgmisi kuut rühma. Leht „Teenused“ kirjeldab iga rühma täpsemalt ja ütleb, mida ei lubata.',
          ],
          items: [
            'Investeeringud ja äriühingu asutamine Taiwanis',
            'Tsiviilvaidlused ja kahjuhüvitis',
            'Abielu, perekond ja pärimine',
            'Tööõiguslikud vaidlused',
            'Kriminaalasjad',
            'Intellektuaalomand: kaubamärgid, patendid ja autoriõigus',
          ],
        },
        {
          heading: 'Kust alustada',
          paragraphs: [
            'Lugege esmalt lehte „Teenused“, et näha, kas teie asi kuulub meie valdkonda, seejärel lehti „Tasud“ ja „Kontakt“, millest selgub, kuidas töö ulatus kindlaks määratakse ja kuidas tasud enne töö algust kinnitatakse.',
            'Teate saatmisel võite kokkuvõtte kirjutada oma keeles. Algtekst säilitatakse täpselt nii, nagu te selle kirjutasite, ja seda ei tõlgita automaatselt. Saadetud teade on läbivaatamist ootav taotlus: see ei ole veel nõustamine ega kinnitatud kohtumine.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'TEENUSED',
      title: 'Milliste asjadega tegeleme',
      description:
        'Kuus valdkonda Taiwani büroos ja piirid, mida on kasulik esmalt teada.',
      intro:
        'Allpool on valdkonnad, millega tegelikult tegeleme, ja küsimused, mida algfaasis sageli esitatakse. Esitus aitab teil hinnata, kas teie asi kuulub meie valdkonda; see on üldine ega ole üksiku asja õiguslik analüüs.',
      sections: [
        {
          heading: 'Investeeringud ja äriühingu asutamine Taiwanis',
          paragraphs: [
            'Abistame välismaiseid investoreid ja ettevõtteid äriühingu asutamisel või juhtimisel Taiwanis: õigusliku vormi valik, dokumentide ettevalmistamine ja esitamine, kapitali sissemakse, pangaküsimused, tegutsemiskoha hindamine ning valdkonnanõuded. Toetame ka raamatupidamist ja makse, mis tekivad asutamisest ja tegutsemisest Taiwanis.',
            'Menetluse käik ja kestus erinevad vormi, investori, tegevusala, panga ja juba olemasolevate dokumentide järgi. Äriühingu asutamine iseenesest ei too kaasa elamisõigust (居留) ega tööluba (工作許可): need on eraldi menetlused, mida hinnatakse isiku olukorra järgi.',
          ],
        },
        {
          heading: 'Tsiviilvaidlused ja kahjuhüvitis',
          paragraphs: [
            'Sellesse valdkonda kuuluvad lepinguvaidlused, lepinguväline kahjuõiguslik vastutus ja tarbijavaidlused. Töö algab tavaliselt sündmuste ajajärjestuse selgitamisest ning olemasolevate dokumentide ja tõendite läbivaatamisest ning alles seejärel lepitakse kokku järgmised sammud.',
            'Tähtajad, sealhulgas aegumine, ja tõendite täielikkus mõjutavad kulgu otsustavalt. Nimetage seetõttu teadaolevad kuupäevad võimalikult varakult. Säilitage lepingud, teated, maksetõendid või fotod olukorrast kohapeal ja mainige neid esimeses teates.',
          ],
        },
        {
          heading: 'Abielu, perekond ja pärimine',
          paragraphs: [
            'Tegeleme abielulahutusega (離婚), vara jagamisega, alaealiste laste hooldusõiguse ja vanemliku vastutusega (未成年子女權利義務之行使或負擔), suhtlusõigusega (會面交往) ja pärimisega (繼承), ka siis, kui pooled või vara asuvad eri riikides. Piiriülesed perekonnaasjad nõuavad sageli täiendavat kontrolli leibkonnaregistri (戶籍), dokumentide vormi ja nende tõendusväärtuse kohta Taiwanis.',
            'Kuna perekonnaasjadega kaasnevad sageli tähtajad ja paralleelsed menetlused, peaks esimene kokkuvõte nimetama poolte suhte, praeguse elukoha ja juba käimasolevad menetlused.',
          ],
        },
        {
          heading: 'Tööõiguslikud vaidlused',
          paragraphs: [
            'Sellesse valdkonda kuuluvad töösuhte lõpetamine, Taiwani õiguse järgne seadusjärgne lahkumishüvitis (資遣費; seda ei saa samastada teiste riikide lahkumishüvitise ega töötushüvitisega), töötasu ja vaidlused töölepingust (勞動契約), nii töötaja kui ka tööandja poolel. Hindamisel eristame lõpetamise alust etteteatamise, väljamakse ja tähtaegade küsimustest.',
            'Tööleping, töökorralduseeskiri (工作規則), palgalehed ja poolte kirjavahetus on tavaliselt määravad dokumendid. Kui need on teil veel olemas, mainige seda kokkuvõttes.',
          ],
        },
        {
          heading: 'Kriminaalasjad',
          paragraphs: [
            'Abistame eeluurimises ja kohtus nii kahtlustatavaid või süüdistatavaid kui ka kannatanuid ning hindame ettevõtluse kriminaalõiguslikke riske.',
            'Kriminaalasjadel on sageli lühikesed tähtajad ja kindlaksmääratud etapid. Kui olete juba saanud kirja prokuratuurilt või kohtult, nimetage selle kuupäev varakult, et sisu vaadataks läbi õiges järjekorras.',
          ],
        },
        {
          heading: 'Intellektuaalomand',
          paragraphs: [
            'Abistame kaubamärkide (商標) ja patentide (專利) registreerimisel, autoriõiguses ja nende õiguste vaidlustes Taiwanis.',
            'Selles valdkonnas otsustab sammude järjekord: kaitse ulatus, taotluse esitamise hetk ja tegelik kasutamine mõjutavad valikut. Taotluse esitamine iseenesest ei tähenda, et see rahuldatakse.',
          ],
        },
        {
          heading: 'Ulatus ja selle kinnitamine',
          paragraphs: [
            'Büroo töötab Taiwani õiguse järgi ja tegeleb eespool nimetatud valdkondade asjadega. Iga asja ulatus kinnitatakse eraldi pärast seda, kui advokaat on teie teate läbi vaadanud.',
            'Elamisstaatus, tööluba ja sarnased küsimused hinnatakse dokumentide ja isiku olukorra järgi, mitte kodakondsuse järgi. Kui osa teie asjast puudutab selliseid küsimusi, nimetage see ühendust võttes. See leht ei luba tulemust ega vastamise tähtaega.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'BÜROO',
      title: 'Hovering International Law Firmist',
      description:
        'Põhiandmed selle Taiwani advokaadibüroo, selle büroode ja välismaiste osapooltega tehtava töö kohta.',
      intro:
        'Hovering International Law Firm on advokaadibüroo Taiwanis. Advokaadid töötavad ettevõtete nõustamisest kuni kohtumenetluseni. See osa kirjeldab büroo teket, asukohti ja tööd välismaiste osapooltega.',
      sections: [
        {
          heading: 'Asutamine ja ülesehitus',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) asutasid 2016. aastal advokaadid, kes on õppinud National Taiwan Universitys (國立臺灣大學). Hiinakeelne nimi 昊鼎 ühendab märgi 昊 („lai taevas“) märgiga 鼎 („kindel alus“) ja kirjeldab büroo suunda asutamisest saadik.',
            'Meil on bürood Taipeis (臺北), Kaohsiungis (高雄), Taichungis (臺中) ja Pingtungis (屏東). Kaohsiungi büroo keskendub ettevõtte juhtimisele ning tegeleb tsiviil-, kriminaal- ja haldusvaidlustega. Taichungi büroo tegeleb ehitusasjade, intellektuaalomandi ning Korea ja Jaapaniga seotud asjadega. Pingtungi büroo avati 2017. aastal kohaliku vajaduse jaoks.',
            'Advokaaditöö kõrval tegutseb alates 2020. aastast ka Hovering Accounting Office, mis pakub raamatupidamist ja maksude planeerimist ettevõtjatele ja varakatele eraisikutele.',
          ],
        },
        {
          heading: 'Töö välismaiste osapooltega',
          paragraphs: [
            'Piiriülese töö hulka kuuluvad äriühingu asutamine, viisad, kaubamärgi- ja patenditaotlused, õigusliku riski hindamine ja ettevõtete maksunõustamine. Taichungi büroo tegeleb eelkõige ehitusasjade, intellektuaalomandi ning Korea ja Jaapaniga seotud asjadega. Advokaat Wei Tseng (曾雋崴) abistab kliente Koreast, Jaapanist ja mujalt maailmast nimetatud valdkondades.',
            'Kas saame asja vastu võtta, sõltub sisust ja suhtluskeelest. Kui teie asi kuulub nimetatud valdkondadesse ja seda saab arutada ühes neljast nõustamiskeelest, võite saata kokkuvõtte läbivaatamiseks.',
          ],
        },
        {
          heading: 'Kui võtate meiega ühendust',
          paragraphs: [
            'Kui teie kokkuvõte on saabunud, vaatab advokaat sisu läbi ja räägib seejärel võimalikust töö ulatusest, veel vajalikest dokumentidest ja järgmistest sammudest. Maksu- või raamatupidamisküsimustes võib büroo töötada raamatupidamisüksusega ühes menetluses.',
            'Iga asja tulemus sõltub asjaoludest ja olemasolevatest dokumentidest; tulemust me ei luba. Kui vajate siduvat vastust oma olukorrale, tuleb dokumendid arutada advokaadiga ühes neljast nõustamiskeelest.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKAADID',
      title: 'Hoveringi rahvusvaheline meeskond',
      description: 'Hoveringi advokaatide, tegevjuhtimise ja seotud audiitorbüroo profiilid.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'TASUD',
      title: 'Kuidas kinnitatakse töö ulatus ja tasud',
      description:
        'Selgitus järjekorrast: esmalt töö ulatus, seejärel tasude kinnitamine, ja miks sellel lehel ei ole hinnakirja.',
      intro:
        'See leht selgitab, kuidas tasud kinnitatakse, mitte nende suurust. Suurus sõltub üksiku asja töö ulatusest ja on mõttekas alles siis, kui see ulatus on selge.',
      sections: [
        {
          heading: 'Esmalt kinnitatakse töö ulatus',
          paragraphs: [
            'Sama liiki asjades võib töömaht olla väga erinev, olenevalt poolte arvust, olemasolevatest dokumentidest, järgitavatest tähtaegadest ja sellest, kas menetlus on juba alanud. Seepärast on esimene samm alati kindlaks määrata, mis kuulub töösse ja mis mitte.',
            'Kokkuvõte, mille alguses saadate, on selle ulatuse alus. Mida selgemalt see kirjeldab sündmuste käiku, teie soovi ja tähtaegu, seda täpsemalt saab ulatuse määrata.',
          ],
        },
        {
          heading: 'Tasud kinnitatakse enne töö algust',
          paragraphs: [
            'Kui töö ulatus on selge, arutatakse summa ja arvutusviis teiega läbi ja kinnitatakse enne töö algust. Kui ulatus muutub töö käigus, tuleb see uuesti kinnitada.',
            'See leht ei ole hinnapakkumine ega tekita maksekohustust.',
          ],
        },
        {
          heading: 'Nõustamine võib olla tasuline',
          paragraphs: [
            'Nõustamine advokaadiga võib olla tasuline teenus. See leht ei ütle, et esimene vestlus on tasuta, ja ühtegi osa ei tohi nii lugeda.',
            'Kui nõustamine on tasuline, teatatakse summa ja makseviis enne selle toimumist.',
          ],
        },
        {
          heading: 'Miks sellel lehel ei ole tariife',
          paragraphs: [
            'Tasud sõltuvad asjast endast: töömahust, poolte arvust, dokumentidest, tähtaegadest ja sellest, kas menetlus juba käib. Ette kindlaks määratud summa ei näitaks, millised oleksid tasud teie asjas. Seepärast kinnitame esmalt töö ulatuse ja teatame teile seejärel tasud, enne kui töö algab.',
            'Lisaks advokaaditasule võivad tekkida kohtu-, asutuse- või kolmanda isiku kulud. Need on tasust eraldi ja sõltuvad vastavast menetlusest.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Kuidas bürooni jõuda',
      description:
        'Lehe keel, nõustamiskeeled, toimimisviis, kui te ei saa kasutada ühtegi neljast keelest, ja mida see leht ei luba.',
      intro:
        'Enne kui meile kirjutate, eristage järgmised kolm asja. Neid aetakse sageli segi, kuid need tähendavad erinevaid asju.',
      sections: [
        {
          heading: 'Kolm asja, mida tuleb hoida lahus',
          paragraphs: [
            'Lehe kuva keel, nõustamiskeel advokaadiga ja keel, milles te kirjutate, on kolm eri asja.',
          ],
          items: [
            'Lehe keel: need juhised on kirjutatud eesti keeles.',
            'Nõustamiskeel: nõustamine toimub ainult inglise, hiina (中文), jaapani ja korea keeles.',
            'Keel, milles kirjutate: kokkuvõtte võite kirjutada oma keeles; algtekst säilitatakse muutmata kujul.',
          ],
        },
        {
          heading: 'Kui te ei saa kasutada ühtegi neljast nõustamiskeelest',
          paragraphs: [
            'Kontaktvormil võite valida „Suhtlusviis tuleb kinnitada“. Vastame, et kontrollida, kas on olemas kasutatav suhtlusviis; teenust muus keeles ei tagata ja vastamise tähtaega ei lubata.',
            'See on üksnes kontroll, mitte lubadus. Me ei luba tõlki, teenust eesti keeles ega muus keeles väljaspool neid nelja keelt, ega seda, et võtame iga asja vastu.',
          ],
        },
        {
          heading: 'Mis peaks olema esimeses teates',
          paragraphs: [
            'Nimetage, mis on juhtunud, millist abi vajate, milline side on asjal Taiwaniga, ja tähtaeg, kui te selle teate. Kui olete juba saanud kirja kohtult või asutuselt, nimetage kirjal olev kuupäev.',
            'Algfaasis ei ole veel vaja saata passinumbrit, isikutunnistuse numbrit, kontonumbreid, haiguslugu ega kogu tõendusmaterjali. Oodake advokaadi juhiseid ja saatke tundlikud dokumendid seejärel turvalist teed pidi.',
          ],
        },
        {
          heading: 'Mida see leht ei luba',
          paragraphs: [
            'Me ei luba vastamise tähtaega, ei kinnita kohtumist selle lehe kaudu, ei luba konkreetset advokaati ega korralda tõlki. Kirjalik tõlge on midagi muud: teie teadet ei tõlgita automaatselt.',
            'Kui saadate taotluse, säilitatakse sisu ja see ootab läbivaatamist. Kui te mõne aja pärast vastust ei saa, võite kirjutada uuesti kontaktlehel nimetatud e-posti aadressile.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'KÜSIMUSED',
      title: 'Korduma kippuvad küsimused',
      description:
        'Selgitused töövaldkonna, ettevalmistuse, keelte, tasude ja saadetud taotluse tähenduse kohta.',
      intro:
        'Järgmistele küsimustele vastatakse üldise teabe tasemel. Vastus teie asjale on võimalik alles pärast seda, kui advokaat on dokumendid läbi vaadanud.',
      sections: [
        {
          heading: 'Kuidas seda osa kasutada',
          paragraphs: [
            'Kui te ei leia vastust oma olukorrale, sõltub vastus tavaliselt erilistest asjaoludest. Kirjutage need asjaolud kokkuvõttesse, selle asemel et neid ise sellelt lehelt tuletada.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Milliste asjadega büroo tegeleb?',
          answer:
            'Tegeleme kuue valdkonnaga: investeeringud ja äriühingu asutamine Taiwanis, tsiviilvaidlused ja kahjuhüvitis, abielu, perekond ja pärimine, tööõiguslikud vaidlused, kriminaalasjad ning intellektuaalomand. Kas asi võetakse vastu, otsustatakse pärast sisu läbivaatamist.',
        },
        {
          question: 'Mida peaksin ette valmistama enne ühenduse võtmist?',
          answer:
            'Valmistage lühike kokkuvõte sündmuste käigust, oma soovist, Taiwaniga seotud sidemest ja tähtajast, kui see on olemas. Kui kohtu või asutuse kiri on juba olemas, nimetage selle kuupäev. Selles etapis ei ole veel vaja saata isikut tõendavaid dokumente ega kogu tõendusmaterjali.',
        },
        {
          question: 'Kas ma saan nõu eesti keeles?',
          answer:
            'Ei. Need juhised on kirjutatud eesti keeles, kuid nõustamine advokaadiga toimub ainult inglise, hiina (中文), jaapani ja korea keeles. Me ei luba ka tõlki. Kirjalik tõlge on midagi muud: algtekst, mille kirjutate, säilitatakse nii, nagu see on, ja seda ei tõlgita automaatselt.',
        },
        {
          question: 'Mis siis, kui ma ei saa kasutada ühtegi neljast keelest?',
          answer:
            'Valige saatmisel „Suhtlusviis tuleb kinnitada“. Vastame, et kontrollida suhtlusviisi, kuid teenust muus keeles ei tagata. See on kontroll, mitte lubadus, et saame töötada muus keeles.',
        },
        {
          question: 'Kuidas minu eestikeelset teksti käsitletakse?',
          answer:
            'Algtekst, mille kirjutate, säilitatakse nii, nagu see on, ja seda ei tõlgita automaatselt. Kui vaja, kinnitatakse edasise suhtluse keel teiega.',
        },
        {
          question: 'Kas nõustamine on juba toimunud, kui taotlus on saadetud?',
          answer:
            'Ei. Saadetud taotlus ootab advokaadi läbivaatamist. See ei ole õigusnõu, ei ole kinnitatud kohtumine, ja saatmine iseenesest ei tekita suhet advokaadi ja kliendi vahel.',
        },
        {
          question: 'Kuidas tasud arvutatakse?',
          answer:
            'Esmalt kinnitatakse töö ulatus, seejärel kinnitatakse teiega summa ja arvutusviis enne töö algust. See leht ei nimeta arve ega ütle, et esimene vestlus on tasuta.',
        },
        {
          question: 'Mis siis, kui minu asi on väga kiireloomuline?',
          answer:
            'Nimetage tähtaeg või ametikirja kuupäev kokkuvõtte alguses, et need andmed oleksid läbivaatamisel nähtavad. Sellel lehel ei ole valvesidet ega lubata vastamise tähtaega; kui teie asi ei saa oodata, peaksite paralleelselt otsima muid teid oma asukohas.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVAATSUS',
      title: 'Andmed, mida kontaktvorm kogub',
      description:
        'Mida kogub kontaktvorm selles eestikeelses osas, kuidas algteksti käsitletakse ja kuidas meieni oma andmete asjus jõuda.',
      intro:
        'See osa puudutab ainult nende juhislehtede kontaktvormi. See kirjeldab andmete käsitlemist, mitte tehnilist garantiid.',
      sections: [
        {
          heading: 'Milliseid andmeid kogutakse',
          paragraphs: [
            'Kui saadate taotluse selle osa vormiga, märgitakse järgmised andmed:',
          ],
          items: [
            'Nimi, mille te märkisite',
            'E-posti aadress vastuse jaoks',
            'Lehe kuva keel saatmise hetkel',
            'Keel, milles te kirjutasite',
            'Nõustamiskeel, mida soovite',
            'Algtekst, mille te kirjutasite',
            'Teie nõusolek taotluse saatmiseks',
            'Vastuvõtunumber taotluse leidmiseks',
          ],
        },
        {
          heading: 'Algtekst säilitatakse muutmata kujul',
          paragraphs: [
            'Teie tekst säilitatakse täpselt nii, nagu te selle kirjutasite, ja seda ei tõlgita automaatselt. Kui töötlemiseks on vaja tõlget, arutatakse see teiega eraldi.',
            'Kuna algtekst säilitatakse, ärge kirjutage algfaasis seda, mida veel vaja ei ole, näiteks passinumbrit, isikutunnistuse numbrit ega kontonumbreid.',
          ],
        },
        {
          heading: 'Säilitamiskoht ja juurdepääs',
          paragraphs: [
            'Teie saadetise sisu säilitatakse kohas, mis ei ole avalikult kättesaadav. Juurdepääs on ainult büroo volitatud isikutel taotluse menetlemiseks.',
            'See leht ei anna absoluutset turvagarantiid. Ükski edastustee ega ükski säilitamiskoht ei ole täielikult turvaline; tundlikud dokumendid tuleks seetõttu saata alles pärast advokaadi erijuhist.',
          ],
        },
        {
          heading: 'Kasutamise eesmärk',
          paragraphs: [
            'Saadetud andmed teenivad taotluse läbivaatamist, tagasisidet teile, suhtlusviisi selgitamist ja menetlemist, kui töö võetakse vastu.',
            'Andmeid ei kasutata turunduseks ilma eraldi nõusolekuta.',
          ],
        },
        {
          heading: 'Teade ja vastuvõtunumber',
          paragraphs: [
            'Kui taotlus saadetakse edukalt, teavitab süsteem bürood. Kui seda teadet ei ole veel kinnitatud, jääb teie tekst alles ega kao.',
            'Vastuvõtunumber aitab teie taotlust meie toimikutest leida. See kuvatakse pärast säilitamist; võite selle uuel ühendusel nimetada.',
          ],
        },
        {
          heading: 'Teie õigused ja ühenduse võtmise viis',
          paragraphs: [
            'Võite taotleda oma andmete tutvustamist, parandamist või kustutamist või nõusoleku tagasi võtta kontaktlehel nimetatud e-posti aadressi kaudu. Kui on seaduslik või menetlusest tulenev säilitamiskohustus, selgitame piirangut.',
            'See leht ei nimeta kindlat säilitamistähtaega, sest tegelik kestus sõltub sellest, kas asja jätkatakse, ja sellega seotud kohustustest. Kui soovite varasemat kustutamist, teatage sellest ühendust võttes.',
          ],
        },
        {
          heading: 'Säilitamiskoht ja teenuseosutajad',
          paragraphs: [
            'Neid veebilehti majutab Vercel ja teie saadetis säilitatakse selle teenuse mitteavalikus andmesalvestuses. E-kirjad saadetakse büroo kasutatava e-postiteenuse kaudu.',
            'Üksikute teenuseosutajate serverid võivad asuda väljaspool Taiwani, nii et teie andmeid võidakse seal säilitada ja töödelda. Kui säilitamise eesmärk on täidetud, kustutatakse andmed viivituseta; andmed, mida tuleb kohalduvate sätete järgi säilitada, jäävad selleks ajaks. Isikuandmete taotlused võtab vastu wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'LAHTIÜTLUS',
      title: 'Selle lehe teabe ulatus ja piirid',
      description:
        'Teabe üldine iseloom, õiguslik kohaldamisala ja eeldused suhtele advokaadi ja kliendi vahel.',
      intro:
        'See osa teeb selgeks, mida need eestikeelsed juhislehed saavad teie heaks teha ja mida mitte.',
      sections: [
        {
          heading: 'Ainult üldine teave',
          paragraphs: [
            'Nende lehtede sisu on kirjutatud üldise teabena. See ei ole õigusnõu teie asjas ega asenda teie dokumentide läbivaatamist.',
            'Asja tulemus sõltub asjaoludest, kohalduvatest sätetest ja ajast; kaks näiliselt sarnast olukorda võivad lõppeda erinevalt.',
          ],
        },
        {
          heading: 'Õiguslik kohaldamisala',
          paragraphs: [
            'Büroo tegutseb Taiwani õiguse järgi ja see leht räägib ainult tööst selles raamistikus.',
            'Sisu ei ole nõustamine muu õiguskorra kui Taiwani õiguse järgi, sealhulgas teie elukoha õiguse järgi. Kui osa teie asjast puudutab teist õiguskorda, arutame teiega, millist pädevat asjatundjat selle osa jaoks vaja on.',
          ],
        },
        {
          heading: 'Suhe advokaadi ja kliendi vahel ei teki iseenesest',
          paragraphs: [
            'Selle lehe lugemine, vormi või e-kirja saatmine iseenesest ei tekita suhet advokaadi ja kliendi vahel.',
            'See suhe tekib alles pärast seda, kui asi on läbi vaadatud ja mõlemad pooled on kinnitanud, et büroo võtab töö vastu.',
          ],
        },
        {
          heading: 'Tulemust ei lubata',
          paragraphs: [
            'Ükski osa sellest lehest ei ole lubadus asja tulemuse, taotluse rahuldamise ega elamis- ja tööstaatuse kohta.',
            'Välislingid on mõeldud orienteerumiseks; me ei taga kolmandate isikute sisu õigsust ega ajakohasust.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTIKLID',
      title: 'Artikleid Taiwani õigusest',
      description:
        'Eestikeelsed artiklid Taiwani õiguse korduvatest küsimustest. Sisu on üldine teave avaldamise hetkel, mitte õigusnõu teie asjas.',
      intro:
        'Büroo avaldab artikleid Taiwani õiguse korduvatest küsimustest. Eestikeelsed artiklid on sellel lehel; kõrval on neli linki, millest igaüks avab ühe algkeele artiklite loendi.',
      sections: [
        {
          heading: 'Neli loendit keele järgi',
          paragraphs: [
            'Selles osas on neli linki: artiklite loend korea, hiina, inglise ja jaapani keeles. Iga link nimetab loendi keele, et te teaksite ette, millises keeles sisu avaneb.',
            'Need neli loendit on loendid artiklite algkeele järgi, mitte tõlkeloendid. Eestikeelsed artiklid on eraldi sellel lehel.',
          ],
        },
        {
          heading: 'Kuhu lingid viivad',
          paragraphs: [
            'Kui valite ühe neljast lingist, avaneb selle keele artiklite loend. Loendist valite teksti ise; kogu sisu ilmub artikli algkeeles.',
            'See leht ei võta artiklite sisu kokku ega taga, et teema on kättesaadav kõigis neljas keeles. Iga loend sisaldab ainult selles keeles avaldatud tekste.',
          ],
        },
        {
          heading: 'Kui kaugele saab artikkel orienteerida',
          paragraphs: [
            'Artiklid on üldine teave avaldamise hetkel. Sätted ja nende kohaldamine võivad muutuda ning artikkel ei kata kõiki teie asja asjaolusid.',
            'Ärge seetõttu tehke tegelikus asjas otsuseid üksnes artikli põhjal. Kasutage seda ülevaate saamiseks ja arutage oma dokumente eraldi advokaadiga; see leht ei ole nõustamissamm.',
          ],
        },
      ],
    },
  },
};

export const catalanGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Català',
  nav: {
    home: 'Inici',
    services: 'Serveis',
    about: 'El despatx',
    lawyers: 'Advocats',
    pricing: 'Honoraris',
    contact: 'Contacte',
    faq: 'Preguntes',
    privacy: 'Privadesa',
    disclaimer: 'Avís legal',
    columns: 'Articles',
  },
  contactCta: 'Enviar una sol·licitud de consulta',
  footerNotice:
    'Aquesta pàgina en català només ofereix orientació general sobre el treball del despatx segons el dret de Taiwan. No és assessorament jurídic per a un assumpte concret, i l’enviament d’un missatge no crea per si sol una relació entre advocada o advocat i client.',
  skipLink: 'Saltar la navegació i anar al contingut',
  menuLabel: 'Menú',
  languageLabel: 'Idioma de la pàgina',
  mega: {
    services: {
      description: 'El despatx atén les principals àrees de pràctica segons el dret de Taiwan.',
      viewAllLabel: 'Veure-ho tot',
    },
    columns: {
      description: 'Articles que expliquen qüestions freqüents del dret de Taiwan.',
      viewAllLabel: 'Veure-ho tot',
    },
    lawyers: {
      description: 'Presentació dels advocats que atenen els assumptes i de les vies de contacte.',
      viewAllLabel: 'Veure-ho tot',
    },
    pricing: {
      description: 'Aquesta pàgina explica l’abast del treball i com es confirmen els honoraris.',
      viewAllLabel: 'Veure-ho tot',
    },
    faq: {
      description: 'Preguntes freqüents sobre el treball del despatx a Taiwan.',
      viewAllLabel: 'Veure-ho tot',
    },
  },
  notFoundTitle: 'Pàgina no trobada',
  notFoundText:
    'La pàgina que cerca no existeix o s’ha traslladat. Pot tornar a l’inici en català per veure l’orientació disponible.',
  backHomeLabel: 'Tornar a l’inici',
  readSourceLabel: 'Obrir la llista d’articles en l’idioma original',
  home: {
    heroScrollLabel: 'Desplaçar-se cap avall',
    heroColumnsCtaLabel: 'Veure articles',
    servicesDetailLabel: 'Veure detalls',
    servicesAssistanceBefore:
      'Si encara no sap a quina àrea pertany el seu assumpte, la pàgina de ',
    servicesAssistanceLinkLabel: 'Contacte',
    servicesAssistanceAfter:
      ' explica com redactar un resum que una advocada o un advocat revisarà.',
    columnsViewAllLabel: 'Veure tots els articles',
    columnsReadMoreLabel: 'Continuar llegint',
    columnsReviewLabel: 'Revisat per l’advocada Wei Tseng',
    columnsOriginalLanguageBadge: 'Idioma original',
    columnsOriginalLanguageNote:
      'Els articles següents encara no estan en català. Aquesta llista roman en l’idioma original i obre aquella pàgina; el contingut no es tradueix de forma automàtica.',
    imageBandAlt: 'Casa tradicional taiwanesa (三合院) i un pavelló contemporani a plena llum del dia',
    videoPauseLabel: 'Posar el vídeo en pausa',
    videoPlayLabel: 'Reproduir el vídeo',
    videoReplayLabel: 'Tornar a reproduir el vídeo',
  },
  pages: {
    home: {
      eyebrow: 'ORIENTACIÓ',
      title: 'Serveis jurídics a Taiwan — orientació en català',
      description:
        'Explicació general en català sobre l’abast de Hovering International Law Firm a Taiwan, els idiomes de consulta i el primer contacte.',
      intro:
        'Hovering International Law Firm acompanya clients de l’estranger, també qui té un vincle amb Taiwan, en assumptes de dret taiwanès: inversió i constitució de societats, litigis civils, matrimoni, família i successions, dret laboral, dret penal i propietat intel·lectual. Aquesta part en català l’ajuda a saber quin treball entra en el nostre abast, què convé preparar i com contactar-nos. Són indicacions generals, no assessorament jurídic per al seu propi cas.',
      sections: [
        {
          heading: 'Què fem',
          paragraphs: [
            'Hovering International Law Firm és un despatx d’advocats establert a Taiwan. Treballa segons el dret taiwanès i té oficines a Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) i Pingtung (屏東). Assessorem empreses i tramitem procediments davant els tribunals, i acompanyem clients de l’estranger en els tràmits que cal seguir a Taiwan.',
            'Tot el contingut d’aquestes pàgines és general. El resultat d’un assumpte depèn dels fets, de les normes aplicables i del moment, de manera que aquesta orientació no substitueix una conversa directa amb una advocada o un advocat sobre el seu expedient.',
          ],
        },
        {
          heading: 'L’idioma de la pàgina i l’idioma de la consulta no són el mateix',
          paragraphs: [
            'Aquesta pàgina està escrita en català, però la consulta amb una advocada o un advocat es fa únicament en els quatre idiomes de consulta: anglès, xinès (中文), japonès i coreà. Llegir l’orientació en català no vol dir que la conversa amb l’advocada o l’advocat es faci en català.',
            'No prometem intèrpret, no prometem un termini de resposta i no confirmem cites a través d’aquesta pàgina. Si no pot fer servir cap d’aquests quatre idiomes, la pàgina «Contacte» explica com comprovem una forma de comunicar-nos.',
          ],
        },
        {
          heading: 'Àrees de pràctica que atenem',
          paragraphs: [
            'L’abast del despatx cobreix les sis àrees següents. La pàgina «Serveis» descriu cadascuna amb més detall i assenyala el que no es garanteix.',
          ],
          items: [
            'Inversió i constitució de societats a Taiwan',
            'Litigis civils i reclamacions de danys',
            'Matrimoni, família i successions',
            'Conflictes laborals',
            'Assumptes penals',
            'Propietat intel·lectual: marques, patents i drets d’autor',
          ],
        },
        {
          heading: 'Per on convé començar',
          paragraphs: [
            'Llegeixi la pàgina «Serveis» per comprovar si el seu assumpte entra en el nostre abast i, tot seguit, «Honoraris» i «Contacte» per saber com es fixa l’abast i es confirmen els honoraris abans de començar el treball.',
            'En enviar un missatge pot escriure el resum en el seu propi idioma. El text original es guarda tal com l’escriu i no es tradueix de forma automàtica. Un missatge enviat és una sol·licitud que espera revisió: encara no és una consulta ni una cita confirmada.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'SERVEIS',
      title: 'Assumptes que atenem',
      description:
        'Les sis àrees de pràctica del despatx a Taiwan i els límits que convé conèixer d’entrada.',
      intro:
        'A continuació, els assumptes dels quals ens ocupem i les qüestions que solen plantejar-se a l’inici. Aquesta descripció l’ajuda a valorar si el seu assumpte entra en el nostre abast; és informació general, no l’anàlisi jurídica d’un expedient concret.',
      sections: [
        {
          heading: 'Inversió i constitució de societats a Taiwan',
          paragraphs: [
            'Acompanyem inversors i empreses estrangeres que constitueixen o gestionen una societat a Taiwan: elecció de la forma societària, preparació i presentació de documents, aportació de capital, banca, comprovació del local i requisits propis de determinats sectors. També donem suport a la comptabilitat i a la fiscalitat derivades de constituir i operar a Taiwan.',
            'L’ordre i la durada del procés varien segons la forma societària, l’inversor, el sector, el banc i els documents disponibles. Constituir una societat no produeix per si sola un permís de residència (居留) ni un permís de treball (工作許可): són tràmits distints que es valoren segons la situació de cada persona.',
          ],
        },
        {
          heading: 'Litigis civils i danys',
          paragraphs: [
            'Aquesta àrea cobreix conflictes contractuals, reclamacions de danys per acte il·lícit i conflictes de consum. El treball sol començar per una cronologia dels fets, la revisió de documents i proves existents i, només després, els passos següents.',
            'Els terminis, inclosos els terminis legals per demandar, i la integritat de les proves influeixen molt en el curs de l’assumpte civil, així que indiqui des del principi les dates que conegui. Si conserva contractes, missatges, justificants de pagament o fotos del lloc, esmenti-ho en el primer missatge.',
          ],
        },
        {
          heading: 'Matrimoni, família i successions',
          paragraphs: [
            'Atenem divorci (離婚), liquidació de béns, exercici i assumpció de drets i deures respecte dels fills menors (未成年子女權利義務之行使或負擔), règim de visites (會面交往) i successions (繼承), també quan les parts o els béns estan en països distints. Els assumptes de família transfronterers solen exigir un examen addicional de documents del registre de domicili (戶籍), de la forma dels documents i del seu valor probatori a Taiwan.',
            'Com que els assumptes de família solen anar units a terminis i a diversos tràmits en paral·lel, el resum inicial hauria d’indicar la relació entre les parts, el lloc de residència actual i els procediments ja iniciats.',
          ],
        },
        {
          heading: 'Conflictes laborals',
          paragraphs: [
            'Aquesta àrea cobreix l’extinció del contracte de treball, la indemnització segons el dret de Taiwan (資遣費; no s’identifica amb institucions d’altres països), salaris i conflictes derivats del contracte de treball (勞動契約), tant del costat de la persona treballadora com de l’ocupador. En revisar l’assumpte separem el fonament de l’extinció de les qüestions de preavís, pagament i terminis.',
            'El contracte de treball, el reglament intern (工作規則), les nòmines i l’intercanvi escrit entre les parts solen ser els documents decisius. Si encara els conserva, indiqui-ho en el resum.',
          ],
        },
        {
          heading: 'Assumptes penals',
          paragraphs: [
            'Acompanyem en la investigació i davant el tribunal, tant la persona investigada o acusada com la víctima, i valorem el risc penal de l’activitat empresarial.',
            'Els assumptes penals solen tenir terminis curts i etapes ja definides, de manera que si ja ha rebut un escrit de l’autoritat o del tribunal, indiqui la data d’aquest escrit des del principi perquè el contingut es revisi en l’ordre adequat.',
          ],
        },
        {
          heading: 'Propietat intel·lectual',
          paragraphs: [
            'Ajudem en el registre de marques (商標) i patents (專利), en drets d’autor i en conflictes sobre aquests drets a Taiwan.',
            'En aquesta àrea l’ordre dels passos és decisiu: l’abast de la protecció, el moment de la presentació i l’ús efectiu influeixen en l’estratègia. Presentar una sol·licitud no garanteix per si sola que es concedeixi.',
          ],
        },
        {
          heading: 'Abast i com es confirma',
          paragraphs: [
            'El despatx treballa segons el dret de Taiwan i atén assumptes de les àrees anteriors. L’abast de cada assumpte es confirma per separat després que una advocada o un advocat revisi el contingut que vostè envia.',
            'La situació de residència, el permís de treball i qüestions similars es valoren a partir de l’expedient i de la situació de cada persona, no a partir de la nacionalitat. Si alguna part del seu assumpte toca aquests temes, indiqui-ho en contactar-nos. Aquesta pàgina no promet un resultat ni un termini de resposta.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'EL DESPATX',
      title: 'Sobre Hovering International Law Firm',
      description:
        'Informació bàsica sobre aquest despatx d’advocats a Taiwan, les seves oficines i el treball amb parts estrangeres.',
      intro:
        'Hovering International Law Firm és un despatx d’advocats a Taiwan. Les advocades i els advocats treballen des de l’assessorament a empreses fins a l’actuació davant els tribunals. Aquesta part explica com es va fundar el despatx, les seves seus i el treball amb parts estrangeres.',
      sections: [
        {
          heading: 'Fundació i estructura',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) va ser fundat el 2016 per advocats titulats per la National Taiwan University (國立臺灣大學). El nom xinès 昊鼎 uneix el caràcter 昊 («cel ampli») i el caràcter 鼎 («base sòlida»), i expressa l’orientació del despatx des del seu origen.',
            'Tenim oficines a Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) i Pingtung (屏東). L’oficina de Kaohsiung se centra en el govern corporatiu i atén conflictes civils, penals i administratius. L’oficina de Taichung atén assumptes de construcció, de propietat intel·lectual i assumptes relacionats amb Corea i el Japó. L’oficina de Pingtung es va obrir el 2017 per atendre la clientela de la zona.',
            'A més del treball d’advocacia, el 2020 es va crear Hovering Accounting Office, que ofereix comptabilitat i planificació fiscal a empresaris i a particulars amb patrimoni elevat.',
          ],
        },
        {
          heading: 'Treball amb parts estrangeres',
          paragraphs: [
            'El treball transfronterer cobreix constitució de societats, visats, registre de marques i patents, avaluació de riscos jurídics i assessorament fiscal empresarial. L’oficina de Taichung atén en particular assumptes de construcció, de propietat intel·lectual i assumptes relacionats amb Corea i el Japó. L’advocada Wei Tseng (曾雋崴) acompanya clients de Corea, del Japó i altres clients internacionals en les àrees anteriors.',
            'Si podem o no atendre un assumpte depèn del seu contingut i de l’idioma de la comunicació. Si el seu assumpte entra en les àrees anteriors i es pot parlar en un dels quatre idiomes de consulta, pot enviar un resum perquè una advocada o un advocat el revisi.',
          ],
        },
        {
          heading: 'Quan ens contacta',
          paragraphs: [
            'Després de rebre el seu resum, una advocada o un advocat revisa el contingut i després parla de l’abast possible, dels documents que encara calen i dels passos següents. Si l’assumpte planteja qüestions comptables o fiscals, el despatx pot treballar de forma integrada amb l’àrea de comptabilitat.',
            'El resultat de cada assumpte depèn dels fets i dels documents existents, de manera que no prometem un resultat. Si necessita una resposta concreta per a la seva situació, cal tractar aquest expedient directament amb una advocada o un advocat en un dels quatre idiomes de consulta.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOCATS',
      title: 'Equip internacional de Hovering',
      description: 'Perfils dels advocats, de la direcció d’operacions i del soci auditor de Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'HONORARIS',
      title: 'Com es fixen l’abast del treball i els honoraris',
      description:
        'Explicació de l’ordre: primer l’abast, després la confirmació d’honoraris, i per què aquesta pàgina no publica una llista de tarifes.',
      intro:
        'Aquesta pàgina explica com es fixen els honoraris, no la quantia. La quantia depèn de l’abast de cada assumpte i només té sentit quan aquest abast és clar.',
      sections: [
        {
          heading: 'El primer pas és fixar l’abast del treball',
          paragraphs: [
            'Assumptes del mateix tipus poden exigir un treball molt distint, segons el nombre de parts, els documents disponibles, els terminis que calgui complir i si un procediment ja ha començat. Per això el primer pas és sempre aclarir què entra en el treball i què no.',
            'El resum que envia a l’inici és la base d’aquest abast. Com més clar descrigui els fets, el que espera i els terminis, més precís podrà ser l’abast.',
          ],
        },
        {
          heading: 'Els honoraris es confirmen abans de començar el treball',
          paragraphs: [
            'Quan l’abast és clar, la quantia i el mode de càlcul es parlen i es confirmen amb vostè abans de començar. Si l’abast canvia a mig camí, aquest canvi també s’ha de confirmar de nou.',
            'Aquesta pàgina no és una oferta de preu i no genera cap obligació de pagament. Enviar una sol·licitud a través d’aquesta pàgina tampoc no té cost.',
          ],
        },
        {
          heading: 'La consulta pot ser un servei de pagament',
          paragraphs: [
            'La consulta amb una advocada o un advocat pot ser un servei de pagament. Aquesta pàgina no afirma que la primera consulta sigui gratuïta, i cap part no s’ha de llegir en aquest sentit.',
            'Si la consulta té cost, la quantia i la forma de pagament es comuniquen abans que tingui lloc.',
          ],
        },
        {
          heading: 'Per què aquesta pàgina no publica tarifes',
          paragraphs: [
            'La quantia depèn de l’assumpte mateix: del treball que calgui fer, del nombre de parts, dels documents, dels terminis i de si un procediment ja ha començat. Un import indicat d’entrada no reflectiria el cost del seu expedient; per això, en lloc d’una llista de tarifes, fixem primer l’abast del seu assumpte i li comuniquem després els honoraris perquè els valori abans de començar.',
            'A més dels honoraris de l’advocada o l’advocat, un assumpte pot generar taxes que s’hagin de pagar al tribunal, a una autoritat o a un tercer. Aquestes taxes són distintes dels honoraris i depenen del procediment que se segueixi.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'CONTACTE',
      title: 'Com contactar amb el despatx',
      description:
        'Idioma de la pàgina, idiomes de consulta, què passa si no pot fer servir aquests quatre idiomes, i el que aquesta pàgina no garanteix.',
      intro:
        'Abans d’escriure’ns, tingui en compte aquests tres punts per separat. Sovint es confonen, però no volen dir el mateix.',
      sections: [
        {
          heading: 'Tres coses que convé distingir',
          paragraphs: [
            'L’idioma de la pàgina, l’idioma de la consulta amb l’advocada o l’advocat i l’idioma en què vostè escriu són tres coses distintes.',
          ],
          items: [
            'Idioma de la pàgina: aquesta orientació està escrita en català.',
            'Idioma de consulta: la consulta amb una advocada o un advocat es fa únicament en anglès, xinès (中文), japonès i coreà.',
            'Idioma del seu text: pot escriure el resum en el seu propi idioma, i el text original es conserva tal com està.',
          ],
        },
        {
          heading: 'Si no pot fer servir cap dels quatre idiomes de consulta',
          paragraphs: [
            'Al formulari de contacte pot triar «Cal confirmar la forma de comunicar-se». Respondrem per comprovar si existeix una via possible de comunicació; no es garanteix el servei en un altre idioma i no es promet un termini de resposta.',
            'Això és només un pas de comprovació, no és una promesa. No prometem intèrpret, no prometem servei en català ni en un altre idioma fora dels quatre indicats, i no prometem que puguem acceptar tots els assumptes.',
          ],
        },
        {
          heading: 'Què convé escriure en el primer missatge',
          paragraphs: [
            'Indiqui què va passar, quina ajuda necessita, quina relació té l’assumpte amb Taiwan i el termini si el coneix. Si ja ha rebut un escrit d’un tribunal o d’una autoritat, indiqui la data d’aquest escrit.',
            'En aquesta primera fase encara no cal enviar número de passaport, número d’identitat, dades bancàries, historial mèdic ni l’expedient complet de proves. Esperi les indicacions de l’advocada o l’advocat i enviï aleshores el material sensible per un mitjà segur.',
          ],
        },
        {
          heading: 'El que aquesta pàgina no garanteix',
          paragraphs: [
            'No prometem un termini de resposta, no confirmem una cita a través d’aquesta pàgina, no prometem una advocada o un advocat concret i no oferim intèrpret. La traducció escrita és una altra cosa: el missatge que envia no es tradueix de forma automàtica.',
            'Quan envia una sol·licitud, el contingut es guarda i espera revisió. Si al cap d’un temps no rep resposta, pot tornar a escriure a l’adreça de correu que figura a la pàgina de contacte.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'PREGUNTES',
      title: 'Preguntes freqüents',
      description:
        'Explicació de l’abast, de la preparació, dels idiomes, dels honoraris i del significat d’enviar una sol·licitud.',
      intro:
        'Les respostes següents són informació general. La resposta per al seu propi cas només pot donar-se després que una advocada o un advocat revisi l’expedient.',
      sections: [
        {
          heading: 'Com usar aquesta part',
          paragraphs: [
            'Si no troba una resposta per a la seva situació, sol ser senyal que la resposta depèn de fets particulars. En aquest cas, escrigui aquests fets en el resum en contactar-nos, en lloc de deduir-los pel seu compte d’aquesta pàgina.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Quin tipus d’assumptes atén aquest despatx?',
          answer:
            'Atenem sis àrees de pràctica: inversió i constitució de societats a Taiwan, litigis civils i danys, matrimoni, família i successions, conflictes laborals, assumptes penals i propietat intel·lectual. Si un assumpte s’accepta o no, es decideix després de revisar-ne el contingut.',
        },
        {
          question: 'Què he de preparar abans de contactar amb el despatx?',
          answer:
            'Prepari un resum breu del que va passar, del que espera, del vincle amb Taiwan i del termini si n’hi ha. Si ja hi ha un escrit d’un tribunal o d’una autoritat, indiqui la data. En aquesta fase encara no cal enviar documents d’identitat ni totes les proves.',
        },
        {
          question: 'Puc consultar en català?',
          answer:
            'No. Aquesta orientació està escrita en català, però la consulta amb una advocada o un advocat es fa únicament en anglès, xinès (中文), japonès i coreà. Tampoc no prometem intèrpret. La traducció escrita és una altra cosa: el text original que vostè escriu es conserva tal com està i no es tradueix de forma automàtica.',
        },
        {
          question: 'Què passa si no puc fer servir cap d’aquests quatre idiomes?',
          answer:
            'Triï «Cal confirmar la forma de comunicar-se» en enviar la sol·licitud. Respondrem per comprovar una forma de comunicar-nos, però no es garanteix el servei en un altre idioma. És un pas de comprovació, no una promesa que puguem atendre en un altre idioma.',
        },
        {
          question: 'Com es tracta el text que escric en català?',
          answer:
            'El text original que vostè escriu es conserva tal com està i no es tradueix de forma automàtica. Si cal, l’idioma de la comunicació posterior es confirma amb vostè.',
        },
        {
          question: 'Si ja he enviat la sol·licitud, la consulta ja ha tingut lloc?',
          answer:
            'No. Una sol·licitud enviada espera la revisió d’una advocada o un advocat. No és assessorament jurídic, no és una cita confirmada, i l’enviament no crea per si sol una relació entre advocada o advocat i client.',
        },
        {
          question: 'Com es calculen els honoraris?',
          answer:
            'Primer es fixa l’abast del treball i després se’n confirmen amb vostè la quantia i el mode de càlcul abans de començar. Aquesta pàgina no publica xifres i no afirma que la primera consulta sigui gratuïta.',
        },
        {
          question: 'Què faig si el meu assumpte és urgent?',
          answer:
            'Indiqui el termini o la data d’un escrit oficial a l’inici del resum perquè l’advocada o l’advocat vegi aquestes dates en revisar. Aquesta pàgina no té un canal d’emergència i no garanteix un termini de resposta; si el seu assumpte no pot esperar, convé cercar alhora altres vies allà on vostè es trobi.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVADESA',
      title: 'Dades que es recullen a través del formulari de contacte',
      description:
        'Què recull el formulari d’aquesta part en català, com es tracta el text original i com contactar-nos sobre les seves dades.',
      intro:
        'Aquesta part es refereix només al formulari de contacte d’aquestes pàgines d’orientació. Descriu el tractament de les dades, no una garantia tècnica.',
      sections: [
        {
          heading: 'Dades que es recullen',
          paragraphs: [
            'Quan envia una sol·licitud a través del formulari d’aquesta part, es registren els elements següents:',
          ],
          items: [
            'El nom que indica',
            'L’adreça de correu per respondre',
            'L’idioma de la pàgina en el moment de l’enviament',
            'L’idioma en què va escriure',
            'L’idioma de consulta que desitja',
            'El text original que va escriure',
            'El seu consentiment per enviar la sol·licitud',
            'Un número de recepció per tornar a localitzar la sol·licitud',
          ],
        },
        {
          heading: 'El text original es conserva tal com està',
          paragraphs: [
            'El seu escrit es guarda exactament com el va redactar i no es tradueix de forma automàtica. Si cal una traducció per tramitar l’assumpte, se’n parla amb vostè per separat.',
            'Com que el text original es guarda, no escrigui en aquesta primera fase dades que encara no calen, com el número de passaport, el número d’identitat o dades d’un compte bancari.',
          ],
        },
        {
          heading: 'On es guarda i qui pot veure-ho',
          paragraphs: [
            'El contingut del seu enviament es guarda en un lloc que no és d’accés públic, i només les persones autoritzades del despatx hi poden accedir per tramitar aquesta sol·licitud.',
            'Aquesta pàgina no ofereix una garantia absoluta de seguretat. Cap via d’enviament ni d’emmagatzematge no és del tot segura, de manera que el material sensible convé enviar-lo només segons les indicacions concretes de l’advocada o l’advocat.',
          ],
        },
        {
          heading: 'Finalitat de l’ús',
          paragraphs: [
            'Les dades que envia s’usen per revisar la sol·licitud, tornar a contactar-lo, confirmar la forma de comunicar-se i tramitar l’assumpte si el treball arriba a començar.',
            'Aquestes dades no s’usen per a màrqueting sense un consentiment seu donat per separat per a aquesta finalitat.',
          ],
        },
        {
          heading: 'Avís i número de recepció',
          paragraphs: [
            'Quan una sol·licitud s’envia amb èxit, el sistema avisa el despatx. Si aquest avís encara no està confirmat, el que vostè va escriure continua guardat i no es perd.',
            'El número de recepció serveix per tornar a trobar la seva sol·licitud en els nostres registres. Es mostra després de guardar la sol·licitud, i pot esmentar-lo si torna a contactar-nos.',
          ],
        },
        {
          heading: 'Els seus drets i com contactar-nos',
          paragraphs: [
            'Pot demanar accés, rectificació o supressió de les seves dades, o retirar el consentiment, a través de l’adreça de correu que figura a la pàgina de contacte. Si existeix una obligació de conservació segons les normes aplicables o per un assumpte en curs, n’explicarem el motiu de la limitació.',
            'Aquesta pàgina no indica un termini fix de conservació, perquè la durada real depèn de si l’assumpte continua i de les obligacions de conservació associades. Si desitja que se suprimeixin abans, indiqui-ho en contactar-nos.',
          ],
        },
        {
          heading: 'Lloc d’emmagatzematge i prestadors',
          paragraphs: [
            'Aquest lloc s’allotja a Vercel, i el seu enviament es guarda en un emmagatzematge d’objectes no públic d’aquest servei. El correu s’envia a través del servei de correu que utilitza el despatx.',
            'Els servidors d’alguns prestadors poden ser fora de Taiwan, de manera que les seves dades poden emmagatzemar-s’hi i tractar-s’hi. Un cop acomplerta la finalitat de l’emmagatzematge, les dades se suprimeixen sense demora; les dades que s’hagin de conservar segons les normes aplicables es conserven durant aquest termini. Les sol·licituds relatives a dades personals es reben a wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'AVÍS LEGAL',
      title: 'Abast i límits de la informació d’aquesta pàgina',
      description:
        'El caràcter general de la informació, l’àmbit jurídic i les condicions perquè existeixi una relació entre advocada o advocat i client.',
      intro:
        'Aquesta part aclareix què poden i què no poden fer per vostè aquestes pàgines d’orientació en català.',
      sections: [
        {
          heading: 'Només informació general',
          paragraphs: [
            'El contingut d’aquestes pàgines està escrit com a informació general. No és assessorament jurídic per al seu cas i no substitueix la revisió del seu propi expedient.',
            'El resultat d’un assumpte depèn dels fets, de les normes aplicables i del moment, de manera que dues situacions que semblen similars poden acabar de forma distinta.',
          ],
        },
        {
          heading: 'Àmbit jurídic',
          paragraphs: [
            'El despatx exerceix segons el dret de Taiwan, i aquesta pàgina només parla del treball en aquest marc.',
            'El contingut no és assessorament segons el dret de cap jurisdicció distinta de Taiwan, inclòs el dret del lloc on vostè resideix. Si alguna part del seu assumpte es regeix per una altra jurisdicció, confirmarem amb vostè quin professional qualificat cal per a aquesta part.',
          ],
        },
        {
          heading: 'La relació entre advocada o advocat i client no neix per si sola',
          paragraphs: [
            'Llegir aquesta pàgina, enviar el formulari o enviar un correu no crea per si sol una relació entre advocada o advocat i client.',
            'Aquesta relació només neix després de revisar l’assumpte i que ambdues parts confirmin l’acceptació del treball.',
          ],
        },
        {
          heading: 'No hi ha garantia de resultat',
          paragraphs: [
            'Cap part d’aquesta pàgina no és una promesa sobre el resultat d’un assumpte, sobre la concessió d’una sol·licitud o sobre la situació de residència i de treball.',
            'Els enllaços externs s’ofereixen per a la seva comoditat; no en garantim l’exactitud ni l’actualitat del contingut publicat per tercers.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTICLES',
      title: 'Articles sobre el dret de Taiwan',
      description:
        'Articles en català que expliquen qüestions freqüents del dret de Taiwan. El contingut és informació general en el moment de la publicació, no assessorament jurídic per al seu cas.',
      intro:
        'El despatx publica articles que expliquen qüestions freqüents del dret de Taiwan. Els articles disponibles en català figuren en aquesta pàgina; a més hi ha quatre enllaços, cadascun obre la llista d’articles d’un idioma original.',
      sections: [
        {
          heading: 'Quatre llistes segons l’idioma',
          paragraphs: [
            'Aquesta part conté quatre enllaços: la llista d’articles en coreà, la llista en xinès, la llista en anglès i la llista en japonès. Cada enllaç indica l’idioma de la seva llista, perquè sàpiga d’entrada en quin idioma s’obrirà el contingut.',
            'Aquestes quatre llistes són llistes segons l’idioma original de l’article, no llistes de traduccions. Els articles ja disponibles en català figuren per separat en aquesta mateixa pàgina.',
          ],
        },
        {
          heading: 'On porten els enllaços',
          paragraphs: [
            'En triar un dels quatre enllaços s’obre la llista d’articles d’aquest idioma. En aquesta llista vostè tria el text que vol llegir, i tot el contingut apareix en l’idioma original de l’article.',
            'Aquesta pàgina no resumeix el contingut dels articles i no garanteix que un tema existeixi en els quatre idiomes. Cada llista només inclou els textos publicats en aquella llengua.',
          ],
        },
        {
          heading: 'Fins on el pot orientar un article',
          paragraphs: [
            'Els articles es van escriure com a informació general en el moment de la publicació. Les normes i la seva aplicació poden canviar, i un article no recull totes les circumstàncies del seu cas.',
            'Per això, no prengui un article com a base per actuar en un assumpte real. Usi’l per entendre el panorama general i parli després del seu expedient amb una advocada o un advocat; aquesta pàgina no és una consulta.',
          ],
        },
      ],
    },
  },
};

export const icelandicGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Íslenska',
  nav: {
    home: 'Forsíða',
    services: 'Þjónusta',
    about: 'Skrifstofan',
    lawyers: 'Lögmenn',
    pricing: 'Kostnaður',
    contact: 'Hafa samband',
    faq: 'Spurningar',
    privacy: 'Persónuvernd',
    disclaimer: 'Fyrirvari',
    columns: 'Greinar',
  },
  contactCta: 'Senda beiðni um ráðgjöf',
  footerNotice:
    'Þessi síða á íslensku inniheldur aðeins almennar leiðbeiningar um störf skrifstofunnar samkvæmt rétti Taívan. Hún er ekki lögfræðileg ráðgjöf í tilteknu máli og sending skilaboða stofnar ein og sér ekki samband milli lögmanns og skjólstæðings.',
  skipLink: 'Sleppa valmynd og fara í efnið',
  menuLabel: 'Valmynd',
  languageLabel: 'Birtingartungumál',
  mega: {
    services: {
      description: 'Skrifstofan vinnur helstu málaflokka réttar Taívan.',
      viewAllLabel: 'Sýna allt',
    },
    columns: {
      description: 'Greinar um algengar spurningar í rétti Taívan.',
      viewAllLabel: 'Sýna allt',
    },
    lawyers: {
      description: 'Kynning á lögmönnunum og hvernig þú hefur samband.',
      viewAllLabel: 'Sýna allt',
    },
    pricing: {
      description: 'Þessi síða útskýrir umfang vinnunnar og hvernig kostnaður er ákveðinn.',
      viewAllLabel: 'Sýna allt',
    },
    faq: {
      description: 'Algengar spurningar um störf skrifstofunnar á Taívan.',
      viewAllLabel: 'Sýna allt',
    },
  },
  notFoundTitle: 'Síðan fannst ekki',
  notFoundText:
    'Síðan sem leitað var að er ekki til eða hefur verið færð. Þú getur farið aftur á forsíðuna á íslensku til að sjá leiðbeiningarnar sem eru tiltækar.',
  backHomeLabel: 'Á forsíðuna',
  readSourceLabel: 'Opna greinalistann á frummálinu',
  home: {
    heroScrollLabel: 'Fletta niður',
    heroColumnsCtaLabel: 'Sjá greinarnar',
    servicesDetailLabel: 'Sjá nánar',
    servicesAssistanceBefore: 'Ef óljóst er hvaða málaflokki málið þitt tilheyrir útskýrir síðan ',
    servicesAssistanceLinkLabel: 'Hafa samband',
    servicesAssistanceAfter:
      ' hvernig þú setur saman samantekt sem lögmaður metur.',
    columnsViewAllLabel: 'Sjá allar greinar',
    columnsReadMoreLabel: 'Lesa áfram',
    columnsReviewLabel: 'Yfirfarið af lögmanninum Wei Tseng',
    columnsOriginalLanguageBadge: 'Frummál',
    columnsOriginalLanguageNote:
      'Eftirfarandi greinar eru enn ekki tiltækar á íslensku. Listinn stendur á frummálinu og opnar viðkomandi tungumálssíðu; efnið er ekki þýtt sjálfkrafa.',
    imageBandAlt: 'Hefðbundið taívanskt sanheyuan (三合院) og nútímalegur skáli í dagsbirtu',
    videoPauseLabel: 'Gera hlé á myndbandinu',
    videoPlayLabel: 'Spila myndbandið',
    videoReplayLabel: 'Spila myndbandið aftur',
  },
  pages: {
    home: {
      eyebrow: 'LEIÐBEININGAR',
      title: 'Lögfræðiþjónusta á Taívan — leiðbeiningar á íslensku',
      description:
        'Almennar skýringar á íslensku um starfssvið Hovering International Law Firm á Taívan, tungumál ráðgjafarinnar og fyrsta samband.',
      intro:
        'Hovering International Law Firm aðstoðar skjólstæðinga erlendis frá, einnig þá sem tengjast Taívan, í málum samkvæmt rétti Taívan: fjárfestingu og félagastofnun, einkamál, hjúskap, fjölskyldu og erfðir, vinnurétt, refsirétt og hugverkarétt. Þessi íslenski hluti hjálpar þér að sjá hvaða vinna fellur innan sviðs okkar, hvað þú ættir að undirbúa og hvernig þú nærð til okkar. Þetta eru almennar upplýsingar, ekki lögfræðileg ráðgjöf í þínu eigin máli.',
      sections: [
        {
          heading: 'Hvað við gerum',
          paragraphs: [
            'Hovering International Law Firm er lögmannsstofa með aðsetur á Taívan. Hún starfar samkvæmt rétti Taívan og hefur skrifstofur í Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) og Pingtung (屏東). Við ráðleggjum fyrirtækjum, flytjum mál fyrir dómstólum og fylgjum skjólstæðingum erlendis frá í gegnum þau skref sem krafist er á Taívan.',
            'Allt efnið hér er almennt. Úrslit máls ráðast af málsatvikum, gildandi reglum og tímasetningu. Þessar leiðbeiningar koma ekki í stað samtals við lögmann um skjölin þín.',
          ],
        },
        {
          heading: 'Tungumál síðunnar og tungumál ráðgjafarinnar eru ekki það sama',
          paragraphs: [
            'Þessi síða er skrifuð á íslensku, en ráðgjöf við lögmann fer einungis fram á fjórum tungumálum ráðgjafar: ensku, kínversku (中文), japönsku og kóresku. Að lesa leiðbeiningarnar á íslensku þýðir ekki að samtalið við lögmanninn fari fram á íslensku.',
            'Við heitum ekki túlki, svarfresti né tíma í gegnum þessa síðu. Ef þú kannt ekkert af fjórum tungumálunum útskýrir síðan „Hafa samband“ hvernig við könnum samskiptaleið.',
          ],
        },
        {
          heading: 'Málaflokkar',
          paragraphs: [
            'Starfið nær til eftirfarandi sex málaflokka. Síðan „Þjónusta“ lýsir hverjum flokki nánar og tilgreinir það sem ekki er heitið.',
          ],
          items: [
            'Fjárfesting og félagastofnun á Taívan',
            'Einkamál og skaðabætur',
            'Hjúskapur, fjölskylda og erfðir',
            'Vinnuréttardeilur',
            'Refsiréttarmál',
            'Hugverkaréttur: vörumerki, einkaleyfi og höfundarréttur',
          ],
        },
        {
          heading: 'Hvar þú ættir að byrja',
          paragraphs: [
            'Lestu síðuna „Þjónusta“ til að sjá hvort málið þitt falli innan sviðs okkar, síðan „Kostnaður“ og „Hafa samband“ til að sjá hvernig umfangið er ákveðið og hvernig kostnaður er staðfestur áður en vinna hefst.',
            'Þegar þú sendir skilaboð máttu skrifa samantektina á þínu eigin tungumáli. Frumtextinn er vistaður eins og þú skrifaðir hann og er ekki þýddur sjálfkrafa. Send skilaboð eru beiðni sem bíður mats: það er enn ekki ráðgjöf og enn ekki staðfestur tími.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'ÞJÓNUSTA',
      title: 'Hvaða mál við tökum til vinnslu',
      description:
        'Sex málaflokkar skrifstofunnar á Taívan og mörkin sem þú ættir fyrst að þekkja.',
      intro:
        'Hér á eftir eru flokkarnir sem við vinnum raunverulega, og spurningar sem oft koma upp í upphafi. Framsetningin hjálpar þér að meta hvort málið þitt falli innan sviðs okkar; hún er almenn og ekki lögfræðileg greining á einstöku máli.',
      sections: [
        {
          heading: 'Fjárfesting og félagastofnun á Taívan',
          paragraphs: [
            'Við aðstoðum erlenda fjárfesta og fyrirtæki við stofnun eða rekstur félags á Taívan: val á félagaformi, undirbúning og skil gagna, innlegg hlutafjár, bankamál, mat á starfsstöð og greinarkröfur. Við aðstoðum einnig við bókhald og skatta sem leiða af stofnun og rekstri á Taívan.',
            'Ferli og tímalengd eru misjöfn eftir félagaformi, fjárfesti, grein, banka og þeim gögnum sem þegar eru til. Félagastofnun leiðir ekki af sjálfu sér til dvalarleyfis (居留) eða atvinnuleyfis (工作許可): það eru sérstök málsmeðferðir sem metin eru út frá stöðu hvers og eins.',
          ],
        },
        {
          heading: 'Einkamál og skaðabætur',
          paragraphs: [
            'Þessi flokkur nær til samningsdeilna, skaðabóta vegna skaðaverka (侵權行為) og neytendadeilna. Vinna hefst að jafnaði með tímalínu, yfirferð gagna og fyrirliggjandi sönnunargagna og síðan fyrst með næstu skrefum.',
            'Frestir, þar á meðal lögbundnir málshöfðunarfrestir, og hve fullkomin sönnunargögnin eru, móta framvinduna. Tilgreindu því þekktar dagsetningar sem fyrst. Varðveittu samninga, skilaboð, greiðslukvittanir eða ljósmyndir af staðnum og nefndu þau í fyrstu skilaboðunum.',
          ],
        },
        {
          heading: 'Hjúskapur, fjölskylda og erfðir',
          paragraphs: [
            'Við vinnum skilnað (離婚), skiptingu eigna, forsjá og foreldraábyrgð gagnvart ólögráða börnum (未成年子女權利義務之行使或負擔), umgengni (會面交往) og erfðir (繼承), einnig þegar aðilar eða eignir eru í ólíkum ríkjum. Fjölskyldumál yfir landamæri krefjast oft auka athugunar á heimilisskrá (戶籍), formi skjala og sönnunargildi þeirra á Taívan.',
            'Vegna þess að fjölskyldumál hafa oft fresti og samhliða málsmeðferðir ætti fyrsta samantektin að nefna tengsl aðila, núverandi búsetu og mál sem þegar eru í gangi.',
          ],
        },
        {
          heading: 'Vinnuréttardeilur',
          paragraphs: [
            'Þessi flokkur nær til lokunar ráðningarsambands, lögbundins starfslokastyrks samkvæmt rétti Taívan (資遣費; ekki að jafna við sambærilegar reglur annarra ríkja), launa og deilna sem leiða af ráðningarsamningi (勞動契約), bæði af hálfu launþega og vinnuveitanda. Við matið aðgreinum við ástæðu lokunar frá spurningum um uppsagnarfrest, greiðslu og fresti.',
            'Ráðningarsamningur, vinnureglur (工作規則), launaseðlar og bréfaskipti aðila eru yfirleitt lykilgögnin. Ef þú hefur þau enn, nefndu það í samantektinni.',
          ],
        },
        {
          heading: 'Refsiréttarmál',
          paragraphs: [
            'Við flytjum mál sakborninga, ákærðra og brotaþola í rannsókn og fyrir dómi og metum refsiréttaráhættu atvinnurekstrar.',
            'Refsimál hafa oft stutta fresti og fastar stigskiptingar. Ef þú hefur þegar fengið bréf frá ákæruvaldi eða dómstóli, nefndu dagsetninguna á bréfinu snemma svo innihaldið sé metið í réttri röð.',
          ],
        },
        {
          heading: 'Hugverkaréttur',
          paragraphs: [
            'Við aðstoðum við skráningu vörumerkja (商標) og einkaleyfa (專利), við höfundarrétt og við deilur um þessi réttindi á Taívan.',
            'Í þessum flokki skiptir röð skrefanna máli: verndarsvið, umsóknartími og raunveruleg notkun hafa áhrif á valið. Að skila umsókn þýðir ekki af sjálfu sér að henni verði veitt.',
          ],
        },
        {
          heading: 'Umfang og staðfesting þess',
          paragraphs: [
            'Skrifstofan starfar samkvæmt rétti Taívan og vinnur mál í ofangreindum flokkum. Umfang hvers máls er staðfest sérstaklega eftir að lögmaður hefur metið skilaboðin þín.',
            'Dvalarstaða, atvinnuleyfi og sambærilegar spurningar eru metnar út frá gögnum og stöðu hvers og eins, ekki út frá ríkisfangi. Ef hluti málsins þíns snertir slíkar spurningar, nefndu það þegar þú hefur samband. Þessi síða heitir hvorki niðurstöðu né svarfresti.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'SKRIFSTOFAN',
      title: 'Um Hovering International Law Firm',
      description:
        'Grunnupplýsingar um þessa taívönsku lögmannsstofu, skrifstofur hennar og vinnu með erlendum aðilum.',
      intro:
        'Hovering International Law Firm er lögmannsstofa á Taívan. Lögmennirnir vinna allt frá ráðgjöf til fyrirtækja til málflutnings fyrir dómstólum. Þessi hluti lýsir tilurð stofunnar, staðsetningum og vinnu með erlendum aðilum.',
      sections: [
        {
          heading: 'Stofnun og uppbygging',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) var stofnuð árið 2016 af lögmönnum sem stunduðu nám við National Taiwan University (國立臺灣大學). Kínverska nafnið 昊鼎 sameinar táknið 昊 („hinn víði himinn“) og 鼎 („traustur grunnur“) og lýsir stefnu stofunnar frá stofnun.',
            'Við höfum skrifstofur í Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) og Pingtung (屏東). Skrifstofan í Kaohsiung leggur áherslu á stjórnun fyrirtækja og vinnur einkamála-, refsi- og stjórnsýsludeilur. Skrifstofan í Taichung vinnur byggingamál, hugverkarétt og mál sem tengjast Kóreu og Japan. Skrifstofan í Pingtung var opnuð árið 2017 til að þjóna skjólstæðingum á svæðinu.',
            'Til viðbótar við lögmannsstörfin starfar frá 2020 einnig Hovering Accounting Office, sem býður bókhald og skattáætlun fyrir atvinnurekendur og eignamikla einstaklinga.',
          ],
        },
        {
          heading: 'Vinna með erlendum aðilum',
          paragraphs: [
            'Starf yfir landamæri nær til félagastofnunar, vegabréfsáritana, vörumerkja- og einkaleyfisumsókna, mats á lagaáhættu og skattaráðgjafar fyrir fyrirtæki. Skrifstofan í Taichung vinnur einkum byggingamál, hugverkarétt og mál sem tengjast Kóreu og Japan. Lögmaðurinn Wei Tseng (曾雋崴) aðstoðar skjólstæðinga frá Kóreu og Japan og aðra alþjóðlega skjólstæðinga í tilgreindum flokkum.',
            'Hvort við getum tekið mál ræðst af efninu og af tungumálinu sem samskiptin geta farið fram á. Falli málið þitt innan tilgreindra flokka og megi ræða það á einu af fjórum tungumálum ráðgjafar geturðu sent samantekt til mats.',
          ],
        },
        {
          heading: 'Þegar þú hefur samband',
          paragraphs: [
            'Þegar samantektin þín hefur borist, metur lögmaður innihaldið og ræðir síðan mögulegt vinnuumfang, gögn sem enn vantar og næstu skref. Í skatta- eða bókhaldsmálum getur skrifstofan unnið með bókhaldsdeildinni í einu samfelldu ferli.',
            'Úrslit hvers máls ráðast af málsatvikum og þeim gögnum sem eru til; við heitum ekki niðurstöðu. Ef þú þarft bindandi svar við þinni stöðu verða skjölin að vera rædd við lögmann á einu af fjórum tungumálum ráðgjafar.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'LÖGMENN',
      title: 'Alþjóðlegt teymi Hovering',
      description: 'Prófílar lögmanna Hovering, rekstrarstjórnarinnar og tengds endurskoðunarfyrirtækis.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'KOSTNAÐUR',
      title: 'Hvernig vinnuumfang og kostnaður eru ákveðin',
      description:
        'Skýring á röðinni: fyrst vinnuumfangið, síðan staðfesting kostnaðar, og hvers vegna þessi síða inniheldur ekki gjaldskrá.',
      intro:
        'Þessi síða útskýrir hvernig kostnaður er ákveðinn, ekki fjárhæðina. Fjárhæðin ræðst af vinnuumfangi hvers máls og hefur merkingu fyrst þegar það umfang er ljóst.',
      sections: [
        {
          heading: 'Fyrst er vinnuumfangið ákveðið',
          paragraphs: [
            'Mál af sömu gerð geta krafist mjög ólíkrar vinnu, eftir fjölda aðila, fyrirliggjandi gögnum, frestum sem halda þarf og því hvort málsmeðferð er þegar hafin. Fyrsta skrefið er því alltaf að ákveða hvað tilheyrir vinnunni og hvað ekki.',
            'Samantektin sem þú sendir í upphafi er grundvöllur þessa umfangs. Því skýrar sem hún lýsir framvindu, beiðni þinni og frestum, því nákvæmar má ákveða umfangið.',
          ],
        },
        {
          heading: 'Kostnaður er staðfestur áður en vinna hefst',
          paragraphs: [
            'Þegar vinnuumfangið er ljóst eru fjárhæð og útreikningsaðferð ræddar við þig og staðfestar áður en vinna hefst. Breyti umfangið í vinnslunni verður það að vera staðfest að nýju.',
            'Þessi síða er ekki tilboð og stofnar ekki greiðsluskyldu. Að senda beiðni í gegnum þessa síðu er einnig án greiðslu.',
          ],
        },
        {
          heading: 'Ráðgjöfin getur verið greidd',
          paragraphs: [
            'Ráðgjöf lögmanns getur verið greidd þjónusta. Þessi síða segir ekki að fyrsta samtalið sé án greiðslu og engan hluta hennar má lesa þannig.',
            'Sé ráðgjöfin greidd eru fjárhæð og greiðsluháttur tilkynnt áður en hún fer fram.',
          ],
        },
        {
          heading: 'Hvers vegna þessi síða tilgreinir ekki gjaldskrá',
          paragraphs: [
            'Kostnaður ræðst af málinu sjálfu: af vinnunni, fjölda aðila, gögnum, frestum og því hvort málsmeðferð er þegar í gangi. Fjárhæð sem sett er fram fyrir fram sýnir ekki kostnað málsins þíns. Þess vegna ákveðum við fyrst vinnuumfangið og tilkynnum þér síðan kostnaðinn, áður en vinna hefst.',
            'Til viðbótar við lögmannsþóknun geta komið dómstóla-, stjórnvalds- eða þriðja aðila kostnaður. Hann er aðskilinn frá þóknuninni og ræðst af viðkomandi málsmeðferð.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'SAMBAND',
      title: 'Hvernig þú nærð til skrifstofunnar',
      description:
        'Tungumál síðunnar, tungumál ráðgjafarinnar, ferlið ef þú kannt ekkert af fjórum tungumálunum, og það sem þessi síða heitir ekki.',
      intro:
        'Áður en þú skrifar okkur skaltu greina á milli þessara þriggja atriða. Þau eru oft blanduð saman en merkja ólíka hluti.',
      sections: [
        {
          heading: 'Þrír hlutir sem halda þarf aðskildum',
          paragraphs: [
            'Birtingartungumál síðunnar, tungumálið sem ráðgjöf við lögmann fer fram á, og tungumálið sem þú skrifar á, eru þrír aðskildir hlutir.',
          ],
          items: [
            'Tungumál síðunnar: þessar leiðbeiningar eru skrifaðar á íslensku.',
            'Tungumál ráðgjafar: ráðgjöf fer einungis fram á ensku, kínversku (中文), japönsku og kóresku.',
            'Skriftungumál þitt: þú mátt skrifa samantektina á þínu eigin tungumáli; frumtextinn er vistaður óbreyttur.',
          ],
        },
        {
          heading: 'Ef þú kannt ekkert af fjórum tungumálum ráðgjafarinnar',
          paragraphs: [
            'Í tengiliðaeyðublaðinu geturðu valið „Samskiptaleiðina þarf að staðfesta“. Við svörum til að kanna hvort nothæf samskiptaleið sé til; ráðgjöf á öðru tungumáli er ekki heitið og enginn svarfrestur er lofað.',
            'Þetta er aðeins könnunarþrep, ekki loforð. Við heitum ekki túlki, ekki þjónustu á íslensku eða á öðru tungumáli utan fjögurra tilgreindra tungumála, og ekki að við tökum hvert mál.',
          ],
        },
        {
          heading: 'Hvað ætti að standa í fyrstu skilaboðunum',
          paragraphs: [
            'Segðu frá því sem gerðist, hvers konar aðstoð þú þarft, hvaða tengsl málið hefur við Taívan og frestinum, ef þú þekkir hann. Ef þú hefur þegar fengið bréf frá dómstóli eða stjórnvaldi, nefndu dagsetninguna á bréfinu.',
            'Í upphafi þarftu enn ekki að senda vegabréfsnúmer, kennitölu, reikningsupplýsingar, sjúkraskrá eða öll sönnunargögn. Bíddu eftir leiðbeiningum lögmanns og sendu viðkvæm gögn þá um örugga leið.',
          ],
        },
        {
          heading: 'Það sem þessi síða heitir ekki',
          paragraphs: [
            'Við heitum engum svarfresti, staðfestum engan tíma í gegnum þessa síðu, heitum ekki tilteknum lögmanni og útvegum ekki túlk. Skrifleg þýðing er annað: skilaboðin þín eru ekki þýdd sjálfkrafa.',
            'Þegar þú sendir beiðni er innihaldið vistað og bíður mats. Fáirðu ekki svar að einhverjum tíma liðnum geturðu skrifað að nýju á netfangið sem er tilgreint á tengiliðasíðunni.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'SPURNINGAR',
      title: 'Algengar spurningar',
      description:
        'Skýringar á starfssviði, undirbúningi, málum, kostnaði og merkingu sendrar beiðni.',
      intro:
        'Eftirfarandi spurningum er svarað á stigi almennra upplýsinga. Svar við þínu eigin máli er fyrst mögulegt eftir að lögmaður hefur metið skjölin.',
      sections: [
        {
          heading: 'Hvernig þú notar þennan hluta',
          paragraphs: [
            'Ef þú finnur ekki svar við þinni stöðu, ræðst svarið að jafnaði af sérstökum málsatvikum. Skrifaðu þau þá í samantektina í stað þess að draga ályktanir af þessari síðu.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Hvaða mál vinnur skrifstofan?',
          answer:
            'Við vinnum sex málaflokka: fjárfestingu og félagastofnun á Taívan, einkamál og skaðabætur, hjúskap, fjölskyldu og erfðir, vinnuréttardeilur, refsimál og hugverkarétt. Hvort mál er tekið ræðst eftir mat á innihaldinu.',
        },
        {
          question: 'Hvað ætti ég að undirbúa áður en ég hef samband?',
          answer:
            'Undirbúðu stutta samantekt á framvindu, beiðni þinni, tengslum við Taívan og fresti, ef einhver er. Sé þegar til bréf frá dómstóli eða stjórnvaldi, nefndu dagsetninguna. Á þessu stigi þarftu enn ekki að senda persónuskilríki eða öll sönnunargögn.',
        },
        {
          question: 'Get ég fengið ráðgjöf á íslensku?',
          answer:
            'Nei. Þessar leiðbeiningar eru skrifaðar á íslensku, en ráðgjöf við lögmann fer einungis fram á ensku, kínversku (中文), japönsku og kóresku. Við heitum ekki heldur túlki. Skrifleg þýðing er annað: frumtextinn sem þú skrifar er vistaður eins og hann er og er ekki þýddur sjálfkrafa.',
        },
        {
          question: 'Hvað ef ég kann ekkert af fjórum tungumálunum?',
          answer:
            'Veldu „Samskiptaleiðina þarf að staðfesta“ þegar þú sendir beiðnina. Við svörum til að kanna samskiptaleið, en ráðgjöf á öðru tungumáli er ekki heitið. Þetta er könnunarþrep, ekki loforð um að við getum unnið á öðru tungumáli.',
        },
        {
          question: 'Hvernig er farið með íslenska textann minn?',
          answer:
            'Frumtextinn sem þú skrifar er vistaður eins og hann er og er ekki þýddur sjálfkrafa. Ef þörf krefur er tungumál áframhaldandi samskipta staðfest við þig.',
        },
        {
          question: 'Hefur ráðgjöfin þegar farið fram þegar beiðnin er send?',
          answer:
            'Nei. Send beiðni bíður mats lögmanns. Þetta er ekki lögfræðilegt álit, ekki staðfestur tími, og sendingin ein og sér stofnar ekki samband milli lögmanns og skjólstæðings.',
        },
        {
          question: 'Hvernig er kostnaður reiknaður?',
          answer:
            'Fyrst er vinnuumfangið ákveðið, síðan eru fjárhæð og útreikningsaðferð staðfestar við þig áður en vinna hefst. Þessi síða tilgreinir ekki fjárhæðir og segir ekki að fyrsta samtalið sé án greiðslu.',
        },
        {
          question: 'Hvað ef málið mitt er mjög brýnt?',
          answer:
            'Tilgreindu frestinn eða dagsetninguna á opinberu bréfi efst í samantektinni svo þær upplýsingar séu sýnilegar við matið. Þessi síða hefur enga neyðarlínu og heitir engum svarfresti; þoli málið þitt enga bið ættirðu samhliða að leita annarra leiða þar sem þú ert.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PERSÓNUVERND',
      title: 'Gögn sem safnað er með tengiliðaeyðublaðinu',
      description:
        'Hvað tengiliðaeyðublaðið í þessum íslenska hluta safnar, hvernig frumtextinn er meðhöndlaður og hvernig þú nærð til okkar vegna gagna þinna.',
      intro:
        'Þessi hluti varðar einungis tengiliðaeyðublaðið á þessum leiðbeiningarsíðum. Hann lýsir meðferð gagna, ekki tæknilegri tryggingu.',
      sections: [
        {
          heading: 'Hvaða gögnum er safnað',
          paragraphs: [
            'Þegar þú sendir beiðni í gegnum eyðublaðið í þessum hluta eru eftirfarandi atriði skráð:',
          ],
          items: [
            'Nafnið sem þú gefur upp',
            'Netfangið fyrir svarið',
            'Birtingartungumál síðunnar við sendingu',
            'Tungumálið sem þú skrifaðir á',
            'Tungumál ráðgjafarinnar sem þú óskar',
            'Frumtextinn sem þú skrifaðir',
            'Samþykki þitt við sendingu beiðninnar',
            'Móttökunúmer til að finna beiðnina aftur',
          ],
        },
        {
          heading: 'Frumtextinn er vistaður óbreyttur',
          paragraphs: [
            'Textinn þinn er vistaður nákvæmlega eins og þú skrifaðir hann og er ekki þýddur sjálfkrafa. Sé þýðing nauðsynleg til vinnslu er það rætt sérstaklega við þig.',
            'Vegna þess að frumtextinn er vistaður skaltu í upphafi ekki skrifa það sem enn er óþarft, til dæmis vegabréfsnúmer, kennitölu eða reikningsupplýsingar.',
          ],
        },
        {
          heading: 'Geymslustaður og aðgangur',
          paragraphs: [
            'Innihald sendingarinnar er geymt á stað sem er ekki opinn almenningi. Aðeins heimilaðir aðilar á skrifstofunni mega nálgast það til að vinna beiðnina.',
            'Þessi síða veitir enga algjöra öryggistryggingu. Engin sendingarleið og enginn geymslustaður er fullkomlega öruggur; viðkvæm gögn ætti því aðeins að senda eftir sérstaka leiðbeiningu lögmanns.',
          ],
        },
        {
          heading: 'Tilgangur notkunar',
          paragraphs: [
            'Send gögn eru notuð til að meta beiðnina, svara þér, skýra samskiptaleiðina og vinna málið ef vinnan er tekin upp.',
            'Gögnin eru ekki notuð til markaðssetningar án sérstaks samþykkis.',
          ],
        },
        {
          heading: 'Tilkynning og móttökunúmer',
          paragraphs: [
            'Þegar sending beiðni tekst, tilkynnir kerfið skrifstofunni. Hafi þessi tilkynning ekki verið staðfest enn er textinn þinn áfram vistaður og tapast ekki.',
            'Móttökunúmerið þjónar því að finna beiðnina þína í gögnum okkar. Það birtist eftir vistun; þú getur tilgreint það við nýtt samband.',
          ],
        },
        {
          heading: 'Réttindi þín og tengiliðaleiðin',
          paragraphs: [
            'Þú getur óskað aðgangs, leiðréttingar eða eyðingar gagna þinna, eða afturkallað samþykki, í gegnum netfangið sem er tilgreint á tengiliðasíðunni. Sé lögbundin eða málsmeðferðarskylda til varðveislu, skýrum við takmörkunina.',
            'Þessi síða tilgreinir ekki fastan varðveislutíma vegna þess að raunverulegur tími ræðst af því hvort málið er haldið áfram og af skyldum sem því fylgja. Óskirðu fyrr eyðingu, tilkynntu það við samband.',
          ],
        },
        {
          heading: 'Geymslustaður og þjónustuaðilar',
          paragraphs: [
            'Þessi vefur er hýstur hjá Vercel og sendingin þín er geymd í óopinberri hlutageymslu þeirrar þjónustu. Tölvupóstur er sendur um póstþjónustuna sem skrifstofan notar.',
            'Netþjónar einstakra þjónustuaðila geta staðið utan Taívan, svo gögnin þín geta verið geymd og unnin þar. Þegar geymslutilganginum er náð eru gögnin eydd án tafar; gögn sem varðveita ber samkvæmt gildandi reglum eru geymd þann tíma. Fyrirspurnir um persónuupplýsingar berast á wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'FYRIRVARI',
      title: 'Umfang og mörk upplýsinganna á þessari síðu',
      description:
        'Almennt eðli upplýsinganna, lagalegt gildissvið og forsendur sambands milli lögmanns og skjólstæðings.',
      intro:
        'Þessi hluti skýrir hvað þessar íslensku leiðbeiningarsíður geta gert fyrir þig og hvað þær geta ekki.',
      sections: [
        {
          heading: 'Aðeins almennar upplýsingar',
          paragraphs: [
            'Efni þessara síðna er skrifað sem almennar upplýsingar. Það er ekki lögfræðileg ráðgjöf í þínu máli og kemur ekki í stað mats á skjölum þínum.',
            'Úrslit máls ráðast af málsatvikum, gildandi reglum og tímasetningu; tvær að því er virðist svipaðar aðstæður geta endað ólíkt.',
          ],
        },
        {
          heading: 'Lagalegt gildissvið',
          paragraphs: [
            'Skrifstofan starfar samkvæmt rétti Taívan og þessi síða varðar einungis vinnu innan þess ramma.',
            'Efnið er ekki ráðgjöf samkvæmt rétti annars lögsagnarumdæmis en Taívan, þar á meðal rétti búsetustaðar þíns. Snerti hluti málsins þíns annað lögsagnarumdæmi, skýrum við með þér hvers konar hæfur fagaðili þarf fyrir þann hluta.',
          ],
        },
        {
          heading: 'Samband milli lögmanns og skjólstæðings verður ekki til af sjálfu sér',
          paragraphs: [
            'Að lesa þessa síðu, senda eyðublað eða tölvupóst stofnar ein og sér ekki samband milli lögmanns og skjólstæðings.',
            'Þetta samband verður fyrst til eftir að málið hefur verið metið og báðir aðilar hafa staðfest að vinnan sé tekin upp.',
          ],
        },
        {
          heading: 'Ekkert loforð um niðurstöðu',
          paragraphs: [
            'Enginn hluti þessarar síðu er loforð um úrslit máls, veitingu umsóknar eða dvalar- og atvinnustöðu.',
            'Ytri tenglar eru til leiðsagnar; við heitum hvorki að efni þriðja aðila sé rétt né að það sé uppfært.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'GREINAR',
      title: 'Greinar um rétt Taívan',
      description:
        'Greinar á íslensku um algengar spurningar í rétti Taívan. Efnið er almennar upplýsingar á birtingarstundu, ekki lögfræðileg ráðgjöf í þínu máli.',
      intro:
        'Skrifstofan birtir greinar um algengar spurningar í rétti Taívan. Greinar sem eru tiltækar á íslensku standa á þessari síðu; til viðbótar eru fjórir tenglar sem hver opnar greinalista eins frummáls.',
      sections: [
        {
          heading: 'Fjórir listar eftir tungumáli',
          paragraphs: [
            'Þessi hluti inniheldur fjóra tengla: greinalistann á kóresku, á kínversku, á ensku og á japönsku. Hver tengill tilgreinir tungumál listans svo þú vitir fyrirfram á hvaða máli efnið opnast.',
            'Þessir fjórir listar eru listar eftir frummáli greinanna, ekki þýðingarlistar. Greinar sem eru tiltækar á íslensku standa sérstaklega á þessari síðu.',
          ],
        },
        {
          heading: 'Hvert tenglarnir leiða',
          paragraphs: [
            'Þegar þú velur einn af fjórum tenglunum opnast greinalisti þess tungumáls. Af listanum velurðu textann; allt innihaldið birtist á frummáli greinarinnar.',
            'Þessi síða dregur ekki saman innihald greinanna og heitir ekki að tiltekið efni sé tiltækt á öllum fjórum tungumálunum. Hver listi inniheldur aðeins texta sem hafa verið birtir á því tungumáli.',
          ],
        },
        {
          heading: 'Hve langt grein getur þjónað sem leiðsögn',
          paragraphs: [
            'Greinar eru almennar upplýsingar á birtingarstundu. Reglur og beiting þeirra geta breyst og grein inniheldur ekki allar aðstæður málsins þíns.',
            'Ekki byggðu ákvörðun í raunverulegu máli einungis á grein. Notaðu hana til yfirlits og ræddu skjölin þín sérstaklega við lögmann; þessi síða er ekki ráðgjafarþrepið.',
          ],
        },
      ],
    },
  },
};
