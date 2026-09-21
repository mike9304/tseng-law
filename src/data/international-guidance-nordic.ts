/**
 * Swedish, Danish, Norwegian Bokmål and Finnish guidance packs. Same contract
 * as the western German pack: page language ≠ consultation language.
 * Consultations are only English, Chinese, Japanese and Korean. No interpreter,
 * reply-time, appointment, fee figure, outcome or residency promise.
 *
 * Formal address: Swedish ni, Danish De, Norwegian De, Finnish te.
 * Attorney Wei Tseng is female: Swedish/Danish/Norwegian advokat + hon/henne
 * (sv), hun/hende (da), hun/henne (nb). Finnish asianajaja (no grammatical
 * gender).
 */
import type { GuidanceLocaleContent } from '@/data/international-guidance-content';

export const swedishGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Svenska',
  nav: {
    home: 'Hem',
    services: 'Tjänster',
    about: 'Byrån',
    lawyers: 'Advokater',
    pricing: 'Kostnader',
    contact: 'Kontakt',
    faq: 'Frågor',
    privacy: 'Integritet',
    disclaimer: 'Ansvar',
    columns: 'Artiklar',
  },
  contactCta: 'Skicka en begäran om rådgivning',
  footerNotice:
    'Denna sida på svenska innehåller endast allmänna anvisningar om byråns arbete enligt Taiwans rätt. Den är inte juridisk rådgivning för ett konkret ärende, och att skicka ett meddelande skapar i sig inte ett förhållande mellan advokat och klient.',
  skipLink: 'Hoppa över navigeringen och gå till innehållet',
  menuLabel: 'Sidförteckning',
  languageLabel: 'Visningsspråk',
  mega: {
    services: {
      description: 'Byrån behandlar de väsentliga arbetsgrupperna enligt Taiwans rätt.',
      viewAllLabel: 'Visa alla',
    },
    columns: {
      description: 'Artiklar om vanliga frågor i Taiwans rätt.',
      viewAllLabel: 'Visa alla',
    },
    lawyers: {
      description: 'Presentation av verksamma advokater och kontaktvägar.',
      viewAllLabel: 'Visa alla',
    },
    pricing: {
      description: 'Den här sidan förklarar arbetets omfattning och hur kostnaderna fastställs.',
      viewAllLabel: 'Visa alla',
    },
    faq: {
      description: 'Vanliga frågor om byråns arbete i Taiwan.',
      viewAllLabel: 'Visa alla',
    },
  },
  notFoundTitle: 'Sidan hittades inte',
  notFoundText:
    'Den sökta sidan finns inte eller har flyttats. Ni kan återvända till startsidan på svenska för att se de anvisningar som finns.',
  backHomeLabel: 'Till startsidan',
  readSourceLabel: 'Öppna artikellistan på originalspråket',
  home: {
    heroScrollLabel: 'Rulla nedåt',
    heroColumnsCtaLabel: 'Se artiklarna',
    servicesDetailLabel: 'Se detaljerna',
    servicesAssistanceBefore: 'Om det är oklart vilken grupp ert ärende tillhör, förklarar sidan ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter:
      ' hur ni formulerar en sammanfattning som en advokat granskar.',
    columnsViewAllLabel: 'Se alla artiklar',
    columnsReadMoreLabel: 'Läs vidare',
    columnsReviewLabel: 'Granskad av advokat Wei Tseng',
    columnsOriginalLanguageBadge: 'Originalspråk',
    columnsOriginalLanguageNote:
      'Följande artiklar finns ännu inte på svenska. Listan stannar på originalspråket och öppnar den aktuella språksidan; innehållet översätts inte automatiskt.',
    imageBandAlt: 'Traditionell taiwanesisk sanheyuan (三合院) och en modern paviljong i dagsljus',
    videoPauseLabel: 'Pausa videon',
    videoPlayLabel: 'Spela videon',
    videoReplayLabel: 'Spela videon igen',
  },
  pages: {
    home: {
      eyebrow: 'ANVISNINGAR',
      title: 'Juridiska tjänster i Taiwan — anvisningar på svenska',
      description:
        'Allmänna förklaringar på svenska om Hovering International Law Firms arbetsområde i Taiwan, rådgivningsspråken och den första kontakten.',
      intro:
        'Hovering International Law Firm följer klienter från utlandet, även med anknytning till Taiwan, i frågor enligt Taiwans rätt: investering och bolagsbildning, civilrättsliga tvister, äktenskap, familj och arv, arbetsrätt, straffrätt och immaterialrätt. Den här svenska delen hjälper er att se vilket arbete som faller inom vårt område, vad som ska förberedas och hur ni når oss. Det är allmänna uppgifter, inte juridisk rådgivning för ert eget ärende.',
      sections: [
        {
          heading: 'Vad vi gör',
          paragraphs: [
            'Hovering International Law Firm är en advokatbyrå etablerad i Taiwan. Den arbetar enligt Taiwans rätt och har kontor i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) och Pingtung (屏東). Vi ger råd till företag och driver förfaranden i domstol och följer klienter från utlandet genom de steg som krävs i Taiwan.',
            'Hela innehållet här är allmänt. Utgången av ett ärende beror på fakta, tillämpliga regler och tidpunkten. Dessa anvisningar ersätter inte samtalet med en advokat om era handlingar.',
          ],
        },
        {
          heading: 'Sidans språk och rådgivningsspråket är inte samma sak',
          paragraphs: [
            'Den här sidan är skriven på svenska, men rådgivningen med en advokat sker endast på de fyra rådgivningsspråken engelska, kinesiska (中文), japanska och koreanska. Att läsa anvisningarna på svenska betyder inte att samtalet med advokaten sker på svenska.',
            'Vi lovar inte en tolk, en svarstid eller en tid via den här sidan. Om ni inte kan använda något av de fyra språken förklarar sidan »Kontakt« hur vi prövar en kommunikationsväg.',
          ],
        },
        {
          heading: 'Arbetsgrupper',
          paragraphs: [
            'Arbetsområdet omfattar följande sex grupper. Sidan »Tjänster« beskriver varje grupp mer precist och anger vad som inte utlovas.',
          ],
          items: [
            'Investering och bolagsbildning i Taiwan',
            'Civilrättsliga tvister och skadestånd',
            'Äktenskap, familj och arv',
            'Arbetsrättsliga tvister',
            'Straffrättsliga frågor',
            'Immaterialrätt: varumärken, patent och upphovsrätt',
          ],
        },
        {
          heading: 'Var ni bör börja',
          paragraphs: [
            'Läs sidan »Tjänster« för att se om ert ärende faller inom vårt område, därefter »Kostnader« och »Kontakt« för att veta hur omfattningen fastställs och hur kostnaderna bekräftas innan arbetet börjar.',
            'När ni skickar ett meddelande får ni skriva sammanfattningen på ert eget språk. Originaltexten sparas som ni skrev den och översätts inte automatiskt. Ett skickat meddelande är en begäran som väntar på granskning: det är ännu inte rådgivning och inte en bekräftad tid.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'TJÄNSTER',
      title: 'Vilka ärenden vi behandlar',
      description:
        'Sex arbetsgrupper hos byrån i Taiwan och de gränser ni först bör känna till.',
      intro:
        'Nedan de grupper vi faktiskt behandlar och frågor som ofta ställs i inledningen. Framställningen hjälper er att bedöma om ert ärende faller inom vårt område; den är allmän och inte en juridisk analys av ett enskilt ärende.',
      sections: [
        {
          heading: 'Investering och bolagsbildning i Taiwan',
          paragraphs: [
            'Vi följer utländska investerare och företag vid bildande eller drift av ett bolag i Taiwan: val av rättsform, förberedelse och ingivande av handlingar, kapitalinsats, bankfrågor, prövning av lokalen samt branschkrav. Vi stöder också bokföring och skatt som följer av bildande och drift i Taiwan.',
            'Förlopp och tid skiljer sig efter form, investerare, bransch, bank och redan tillgängliga handlingar. En bolagsbildning leder inte av sig själv till uppehållstillstånd (居留) eller arbetstillstånd (工作許可): det är skilda förfaranden som bedöms efter personens läge.',
          ],
        },
        {
          heading: 'Civilrättsliga tvister och skadestånd',
          paragraphs: [
            'Den här gruppen omfattar avtals tvister, skadestånd från otillåten handling och konsumenttvister. Arbetet börjar i regel med en kronologi, granskning av befintliga handlingar och bevis och först därefter med nästa steg.',
            'Frister, inbegripet preskription, och bevisens fullständighet präglar förloppet. Ange därför kända datum så tidigt som möjligt. Bevara avtal, meddelanden, betalningskvitton eller foton av läget på plats och nämn dem i det första meddelandet.',
          ],
        },
        {
          heading: 'Äktenskap, familj och arv',
          paragraphs: [
            'Vi behandlar skilsmässa (離婚), bodelning, utövande och bärande av rättigheter och skyldigheter mot minderåriga barn (未成年子女權利義務之行使或負擔), umgänge (會面交往) och arv (繼承), även när parter eller tillgångar finns i olika stater. Gränsöverskridande familjeärenden kräver ofta ytterligare prövning av folkbokföring (戶籍), handlingars form och deras bevisvärde i Taiwan.',
            'Eftersom familjeärenden ofta medför frister och parallella förfaranden bör den första sammanfattningen ange parternas förhållande, nuvarande bostad och redan pågående förfaranden.',
          ],
        },
        {
          heading: 'Arbetsrättsliga tvister',
          paragraphs: [
            'Den här gruppen omfattar upphörande av anställning, avgångsvederlag enligt Taiwans rätt (資遣費; inte att likställa med institut i andra stater), lön och tvister ur anställningsavtalet (勞動契約), både på arbetstagar- och arbetsgivarsidan. Vid prövningen skiljer vi uppsägningsgrunden från frågor om underrättelse, betalning och frister.',
            'Anställningsavtal, arbetsordning (工作規則), lönebesked och parternas skriftväxling är oftast de avgörande handlingarna. Om ni fortfarande har dem, nämn det i sammanfattningen.',
          ],
        },
        {
          heading: 'Straffrättsliga frågor',
          paragraphs: [
            'Vi följer i förundersökning och inför domstol, för misstänkta eller tilltalade liksom för målsägande, och bedömer straffrättsliga risker i företagsverksamhet.',
            'Straffrättsliga ärenden har ofta korta frister och fastlagda steg. Om ni redan har fått en skrivelse från åklagare eller domstol, nämn datumet på skrivelsen tidigt så att innehållet prövas i rätt ordning.',
          ],
        },
        {
          heading: 'Immaterialrätt',
          paragraphs: [
            'Vi stöder vid registrering av varumärken (商標) och patent (專利), vid upphovsrätt och vid tvister om dessa rättigheter i Taiwan.',
            'I den här gruppen avgör ordningen på stegen: skyddsomfång, ansökningstidpunkt och faktisk användning påverkar valet. Att ge in en ansökan betyder inte av sig själv att den beviljas.',
          ],
        },
        {
          heading: 'Omfattning och dess bekräftelse',
          paragraphs: [
            'Byrån arbetar enligt Taiwans rätt och behandlar ärenden i de ovannämnda grupperna. Omfattningen av varje ärende bekräftas särskilt efter att en advokat har granskat ert meddelande.',
            'Uppehållsstatus, arbetstillstånd och jämförbara frågor bedöms utifrån handlingarna och personens läge, inte utifrån medborgarskapet. Om en del av ert ärende rör sådana frågor, nämn det vid kontakten. Den här sidan lovar varken ett resultat eller en svarstid.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'BYRÅN',
      title: 'Om Hovering International Law Firm',
      description:
        'Grunduppgifter om denna taiwanesiska advokatbyrå, dess kontor och arbetet med utländska parter.',
      intro:
        'Hovering International Law Firm är en advokatbyrå i Taiwan. Advokaterna arbetar från företagsrådgivning till rättegång. Den här delen beskriver byråns tillkomst, orterna och arbetet med utländska parter.',
      sections: [
        {
          heading: 'Grundande och uppbyggnad',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) grundades 2016 av advokater som studerat vid National Taiwan University (國立臺灣大學). Det kinesiska namnet 昊鼎 förenar tecknet 昊 (»vid himmel«) med 鼎 (»fast grund«) och beskriver byråns inriktning sedan grundandet.',
            'Vi har kontor i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) och Pingtung (屏東). Kontoret i Kaohsiung är inriktat på företagsledning och behandlar civil-, straff- och förvaltningsrättsliga tvister. Kontoret i Taichung behandlar byggärenden, immaterialrätt och ärenden med anknytning till Korea och Japan. Kontoret i Pingtung öppnades 2017 för det lokala behovet.',
            'Vid sidan av det advokatmässiga arbetet finns sedan 2020 också Hovering Accounting Office, som erbjuder bokföring och skatteplanering för företagare och förmögna privatpersoner.',
          ],
        },
        {
          heading: 'Arbete med utländska parter',
          paragraphs: [
            'Det gränsöverskridande arbetet omfattar bolagsbildning, visum, varumärkes- och patentansökningar, juridisk riskprövning och skatterådgivning för företag. Kontoret i Taichung behandlar särskilt byggärenden, immaterialrätt och ärenden med anknytning till Korea och Japan. Advokat Wei Tseng (曾雋崴) följer klienter från Korea, Japan och andra internationella klienter i de nämnda grupperna.',
            'Om vi kan ta ett ärende beror på innehållet och på kommunikationens språk. Faller ert ärende inom de nämnda grupperna och kan det diskuteras på ett av de fyra rådgivningsspråken, kan ni skicka en sammanfattning för granskning.',
          ],
        },
        {
          heading: 'När ni kontaktar oss',
          paragraphs: [
            'När er sammanfattning kommit in granskar en advokat innehållet och talar därefter om möjlig arbetsomfattning, ännu behövliga handlingar och nästa steg. Vid skatte- eller bokföringsfrågor kan byrån arbeta med bokföringsavdelningen i ett och samma flöde.',
            'Resultatet av varje ärende beror på fakta och de handlingar som finns; vi lovar inget resultat. Om ni behöver ett bindande svar för er situation måste handlingarna diskuteras med en advokat på ett av de fyra rådgivningsspråken.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKATER',
      title: 'Hoverings internationella team',
      description: 'Profiler för advokater, driftsledning och partnerrevision hos Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'KOSTNADER',
      title: 'Hur arbetsomfattning och kostnader fastställs',
      description:
        'Förklaring av ordningen: först arbetsomfattningen, därefter kostnadsbekräftelsen, och varför den här sidan inte innehåller en prislista.',
      intro:
        'Den här sidan förklarar hur kostnader fastställs, inte deras belopp. Beloppet beror på arbetsomfattningen i det enskilda ärendet och är meningsfullt först när den omfattningen är klar.',
      sections: [
        {
          heading: 'Först fastställs arbetsomfattningen',
          paragraphs: [
            'Ärenden av samma slag kan ha mycket olika arbetsinsats, beroende på antalet parter, tillgängliga handlingar, frister som ska iakttas och om ett förfarande redan har börjat. Därför är det första steget alltid att fastställa vad som hör till arbetet och vad som inte gör det.',
            'Sammanfattningen ni skickar i början är grunden för den omfattningen. Ju tydligare den beskriver förloppet, er begäran och fristerna, desto preciserare kan omfattningen bestämmas.',
          ],
        },
        {
          heading: 'Kostnaderna bekräftas innan arbetet börjar',
          paragraphs: [
            'När arbetsomfattningen är klar diskuteras belopp och beräkningssätt med er och bekräftas innan arbetet börjar. Ändras omfattningen under vägen måste det bekräftas på nytt.',
            'Den här sidan är inte ett priserbjudande och skapar ingen betalningsskyldighet.',
          ],
        },
        {
          heading: 'Rådgivningen kan vara mot betalning',
          paragraphs: [
            'Rådgivningen med en advokat kan vara en prestation mot betalning. Den här sidan säger inte att det första samtalet är kostnadsfritt, och ingen del får läsas på det sättet.',
            'Om rådgivningen är mot betalning meddelas belopp och betalningssätt innan den äger rum.',
          ],
        },
        {
          heading: 'Varför den här sidan inte anger taxor',
          paragraphs: [
            'Kostnaderna beror på ärendet självt: på insatsen, antalet parter, handlingarna, fristerna och om ett förfarande redan pågår. Ett i förväg satt tal skulle inte visa kostnaderna för ert ärende. Därför fastställer vi först arbetsomfattningen och meddelar er därefter kostnaderna, innan arbetet börjar.',
            'Utöver advokatarvodet kan rättegångs-, myndighets- eller tredjepartskostnader uppstå. De är skilda från arvodet och beror på det aktuella förfarandet.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Hur ni når byrån',
      description:
        'Sidans språk, rådgivningsspråken, tillvägagångssättet om ni inte kan använda något av de fyra språken, och vad den här sidan inte utlovar.',
      intro:
        'Innan ni skriver till oss, skilj på följande tre punkter. De blandas ofta, men betyder olika saker.',
      sections: [
        {
          heading: 'Tre saker som måste hållas isär',
          paragraphs: [
            'Sidans visningsspråk, rådgivningsspråket med advokaten och språket ni skriver på är tre skilda saker.',
          ],
          items: [
            'Sidans språk: Dessa anvisningar är skrivna på svenska.',
            'Rådgivningsspråk: Rådgivningen sker på engelska, kinesiska (中文), japanska och koreanska.',
            'Ert skriftspråk: Ni får skriva sammanfattningen på ert eget språk; originaltexten sparas oförändrad.',
          ],
        },
        {
          heading: 'Om ni inte kan använda något av de fyra rådgivningsspråken',
          paragraphs: [
            'I kontaktformuläret kan ni välja »Kommunikationssättet måste bekräftas«. Vi svarar för att pröva en farbar kommunikationsväg, om en sådan finns; en prestation på ett annat språk utlovas inte och en svarstid utlovas inte.',
            'Det är bara ett prövningssteg, inte ett löfte. Vi lovar inte en tolk, inte en prestation på svenska eller på ett annat språk utanför de fyra nämnda språken, och inte att vi tar emot varje ärende.',
          ],
        },
        {
          heading: 'Vad som bör stå i det första meddelandet',
          paragraphs: [
            'Ange vad som har hänt, vilken hjälp ni behöver, vilket samband ärendet har med Taiwan och fristen, om ni känner en. Om ni redan har fått en skrivelse från en domstol eller en myndighet, nämn datumet på skrivelsen.',
            'I inledningen behöver ni ännu inte skicka passnummer, identitetsnummer, kontouppgifter, journaler eller hela bevisningen. Vänta på anvisningar från advokaten och skicka då känsliga handlingar på en säker väg.',
          ],
        },
        {
          heading: 'Vad den här sidan inte utlovar',
          paragraphs: [
            'Vi lovar ingen svarstid, bekräftar ingen tid via den här sidan, lovar inte en viss advokat och ställer inte en tolk. Skriftlig översättning är något annat: ert meddelande översätts inte automatiskt.',
            'När ni skickar en begäran sparas innehållet och väntar på granskning. Om ni efter en tid inte får svar kan ni skriva på nytt till den e-postadress som anges på kontaktsidan.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'FRÅGOR',
      title: 'Vanliga frågor',
      description:
        'Förklaringar om arbetsområde, förberedelse, språk, kostnader och vad en skickad begäran betyder.',
      intro:
        'Följande frågor besvaras på nivån allmänna uppgifter. Ett svar för ert eget ärende är möjligt först efter att en advokat har granskat handlingarna.',
      sections: [
        {
          heading: 'Hur ni använder den här delen',
          paragraphs: [
            'Hittar ni inget svar för er situation beror svaret oftast på särskilda fakta. Skriv då dessa fakta i sammanfattningen i stället för att själva dra slutsatser från den här sidan.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Vilka ärenden behandlar byrån?',
          answer:
            'Vi behandlar sex grupper: investering och bolagsbildning i Taiwan, civilrättsliga tvister och skadestånd, äktenskap, familj och arv, arbetsrättsliga tvister, straffrättsliga frågor och immaterialrätt. Om ett ärende tas emot avgörs efter granskning av innehållet.',
        },
        {
          question: 'Vad bör jag förbereda före kontakten?',
          answer:
            'Förbered en kort sammanfattning av förloppet, er begäran, sambandet med Taiwan och fristen, om en finns. Finns redan en skrivelse från en domstol eller en myndighet, nämn datumet. I det här skedet behöver ni ännu inte skicka identitetshandlingar eller hela bevisningen.',
        },
        {
          question: 'Kan jag få rådgivning på svenska?',
          answer:
            'Nej. Dessa anvisningar är skrivna på svenska, men rådgivningen med en advokat sker endast på engelska, kinesiska (中文), japanska och koreanska. Vi lovar inte heller en tolk. Skriftlig översättning är något annat: den ursprungliga text ni skriver sparas som den är och översätts inte automatiskt.',
        },
        {
          question: 'Vad om jag inte kan använda något av de fyra språken?',
          answer:
            'Välj vid sändningen »Kommunikationssättet måste bekräftas«. Vi svarar för att pröva ett kommunikationssätt, men en prestation på ett annat språk utlovas inte. Det är ett prövningssteg, inte ett löfte om att vi kan arbeta på ett annat språk.',
        },
        {
          question: 'Hur behandlas min svenska text?',
          answer:
            'Originaltexten ni skriver sparas som den är och översätts inte automatiskt. Om det behövs bekräftas språket för den fortsatta kommunikationen med er.',
        },
        {
          question: 'Har rådgivningen redan skett när begäran är skickad?',
          answer:
            'Nej. En skickad begäran väntar på granskning av en advokat. Det är inte juridisk rådgivning, inte en bekräftad tid, och sändningen skapar i sig inte ett förhållande mellan advokat och klient.',
        },
        {
          question: 'Hur beräknas kostnaderna?',
          answer:
            'Först fastställs arbetsomfattningen, därefter bekräftas belopp och beräkningssätt med er innan arbetet börjar. Den här sidan anger inga tal och säger inte att det första samtalet är kostnadsfritt.',
        },
        {
          question: 'Vad om mitt ärende är mycket brådskande?',
          answer:
            'Ange fristen eller datumet på en officiell skrivelse i början av er sammanfattning, så att dessa data syns vid granskningen. Den här sidan har ingen nödkanal och utlovar ingen svarstid; om ert ärende inte kan vänta bör ni parallellt söka andra vägar på er ort.',
        },
      ],
    },
    privacy: {
      eyebrow: 'INTEGRITET',
      title: 'Uppgifter som samlas in via kontaktformuläret',
      description:
        'Vad kontaktformuläret i den här svenska delen samlar in, hur originaltexten behandlas och hur ni når oss om era uppgifter.',
      intro:
        'Den här delen gäller endast kontaktformuläret på dessa anvisningssidor. Den beskriver behandlingen av uppgifter, inte ett tekniskt löfte.',
      sections: [
        {
          heading: 'Vilka uppgifter som samlas in',
          paragraphs: [
            'När ni skickar en begäran via formuläret i den här delen antecknas följande:',
          ],
          items: [
            'Det namn ni uppger',
            'E-postadressen för svaret',
            'Sidans visningsspråk vid sändningen',
            'Språket ni skrev på',
            'Det rådgivningsspråk ni önskar',
            'Originaltexten ni skrev',
            'Ert samtycke till att skicka begäran',
            'Ett mottagningsnummer för att återfinna begäran',
          ],
        },
        {
          heading: 'Originaltexten sparas oförändrad',
          paragraphs: [
            'Er text sparas precis som ni skrev den och översätts inte automatiskt. Behövs en översättning för behandlingen, tas det upp särskilt med er.',
            'Eftersom originaltexten sparas, skriv i inledningen inget som ännu inte behövs, till exempel passnummer, identitetsnummer eller kontouppgifter.',
          ],
        },
        {
          heading: 'Lagringsplats och åtkomst',
          paragraphs: [
            'Innehållet i er sändning lagras på en plats som inte är offentligt tillgänglig. Endast behöriga personer på byrån får komma åt det för att behandla begäran.',
            'Den här sidan ger inget absolut säkerhetslöfte. Ingen överföringsväg och ingen lagringsplats är helt säker; känsliga handlingar bör därför skickas endast efter särskild anvisning från advokaten.',
          ],
        },
        {
          heading: 'Ändamålet med användningen',
          paragraphs: [
            'De skickade uppgifterna tjänar till att granska begäran, återkoppla till er, klargöra kommunikationssättet och behandla ärendet om arbetet tas upp.',
            'Uppgifterna används inte för marknadsföring utan ett särskilt samtycke.',
          ],
        },
        {
          heading: 'Underrättelse och mottagningsnummer',
          paragraphs: [
            'Skickas en begäran framgångsrikt underrättar systemet byrån. Är den underrättelsen ännu inte bekräftad, stannar er text sparad och går inte förlorad.',
            'Mottagningsnumret tjänar till att återfinna er begäran i våra handlingar. Det visas efter sparandet; ni kan ange det vid en ny kontakt.',
          ],
        },
        {
          heading: 'Era rättigheter och kontaktvägen',
          paragraphs: [
            'Ni kan begära insyn, rättelse eller radering av era uppgifter eller återkalla samtycket, via den e-postadress som anges på kontaktsidan. Finns en laglig eller processuell skyldighet att bevara, förklarar vi begränsningen.',
            'Den här sidan anger ingen fast bevarandetid, eftersom den faktiska tiden beror på om ärendet fortsätter och på de skyldigheter som följer. Önskar ni en tidigare radering, meddela det vid kontakten.',
          ],
        },
        {
          heading: 'Lagringsplats och leverantörer',
          paragraphs: [
            'Den här webbplatsen hostas hos Vercel, och er sändning lagras i ett icke-offentligt objektlager hos den tjänsten. E-post skickas via den e-posttjänst byrån använder.',
            'Enskilda leverantörers servrar kan stå utanför Taiwan, så att era uppgifter kan lagras och behandlas där. När lagringsändamålet är uppfyllt raderas uppgifterna utan dröjsmål; uppgifter som måste bevaras enligt tillämpliga regler stannar under den tiden. Förfrågningar om personuppgifter tas emot av wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'ANSVAR',
      title: 'Omfattning och gränser för uppgifterna på den här sidan',
      description:
        'Uppgifternas allmänna karaktär, det rättsliga tillämpningsområdet och förutsättningarna för ett förhållande mellan advokat och klient.',
      intro:
        'Den här delen klargör vad dessa svenska anvisningssidor kan göra för er och vad de inte kan.',
      sections: [
        {
          heading: 'Endast allmänna uppgifter',
          paragraphs: [
            'Innehållet på dessa sidor är skrivet som allmän information. Det är inte juridisk rådgivning för ert ärende och ersätter inte granskningen av era egna handlingar.',
            'Utgången av ett ärende beror på fakta, tillämpliga regler och tidpunkten; två till synes lika lägen kan sluta olika.',
          ],
        },
        {
          heading: 'Rättsligt tillämpningsområde',
          paragraphs: [
            'Byrån verkar enligt Taiwans rätt, och den här sidan talar endast om arbete inom den ramen.',
            'Innehållet är inte rådgivning enligt rätten i en annan rättsordning än Taiwan, inbegripet rätten på er bostadsort. Rör en del av ert ärende en annan rättsordning, klargör vi med er vilken kvalificerad fackperson som behövs för den delen.',
          ],
        },
        {
          heading: 'Ett förhållande mellan advokat och klient uppstår inte av sig självt',
          paragraphs: [
            'Att läsa den här sidan, att skicka ett formulär eller ett e-postmeddelande skapar i sig inte ett förhållande mellan advokat och klient.',
            'Det förhållandet uppstår först efter att ärendet har granskats och båda sidor har bekräftat att arbetet tas upp.',
          ],
        },
        {
          heading: 'Inget löfte om resultat',
          paragraphs: [
            'Ingen del av den här sidan är ett löfte om resultatet av ett ärende, om beviljande av en ansökan eller om uppehålls- och arbetsstatus.',
            'Externa länkar tjänar till orientering; vi utlovar varken riktigheten eller aktualiteten i tredje parts innehåll.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTIKLAR',
      title: 'Artiklar om Taiwans rätt',
      description:
        'Artiklar på svenska om vanliga frågor i Taiwans rätt. Innehållet är allmän information vid publiceringstidpunkten, inte juridisk rådgivning för ert ärende.',
      intro:
        'Byrån publicerar artiklar om vanliga frågor i Taiwans rätt. Artiklar som finns på svenska står på den här sidan; därtill finns fyra länkar som var och en öppnar artikellistan för ett originalspråk.',
      sections: [
        {
          heading: 'Fyra listor efter språk',
          paragraphs: [
            'Den här delen innehåller fyra länkar: artikellistan på koreanska, på kinesiska, på engelska och på japanska. Varje länk anger listans språk, så att ni i förväg vet på vilket språk innehållet öppnas.',
            'Dessa fyra listor är listor efter artiklarnas originalspråk, inte översättningslistor. Artiklar som finns på svenska står särskilt på den här sidan.',
          ],
        },
        {
          heading: 'Vart länkarna leder',
          paragraphs: [
            'När ni väljer en av de fyra länkarna öppnas artikellistan för det språket. Ur listan väljer ni själva texten; hela innehållet visas på artikelns originalspråk.',
            'Den här sidan sammanfattar inte artiklarnas innehåll och utlovar inte att ett ämne finns på alla fyra språken. Varje lista innehåller endast texter som är publicerade på det språket.',
          ],
        },
        {
          heading: 'Hur långt en artikel kan tjäna som orientering',
          paragraphs: [
            'Artiklar är allmänna uppgifter vid publiceringstidpunkten. Regler och deras tillämpning kan ändras, och en artikel innehåller inte alla omständigheter i ert ärende.',
            'Stöd därför ingen handling i ett verkligt ärende enbart på en artikel. Använd den för överblick och diskutera era handlingar särskilt med en advokat; den här sidan är inte rådgivningssteget.',
          ],
        },
      ],
    },
  },
};

export const danishGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Dansk',
  nav: {
    home: 'Hjem',
    services: 'Ydelser',
    about: 'Kontoret',
    lawyers: 'Advokater',
    pricing: 'Omkostninger',
    contact: 'Kontakt',
    faq: 'Spørgsmål',
    privacy: 'Privatliv',
    disclaimer: 'Forbehold',
    columns: 'Artikler',
  },
  contactCta: 'Send en anmodning om rådgivning',
  footerNotice:
    'Denne side på dansk indeholder kun almindelige vejledninger om kontorets arbejde efter Taiwans ret. Den er ikke juridisk rådgivning for en konkret sag, og afsendelse af en meddelelse skaber i sig selv ikke et forhold mellem advokat og klient.',
  skipLink: 'Spring navigeringen over og gå til indholdet',
  menuLabel: 'Sidefortegnelse',
  languageLabel: 'Visningssprog',
  mega: {
    services: {
      description: 'Kontoret behandler de væsentlige arbejdsgrupper efter Taiwans ret.',
      viewAllLabel: 'Vis alle',
    },
    columns: {
      description: 'Artikler om hyppige spørgsmål i Taiwans ret.',
      viewAllLabel: 'Vis alle',
    },
    lawyers: {
      description: 'Præsentation af de virkende advokater og kontaktveje.',
      viewAllLabel: 'Vis alle',
    },
    pricing: {
      description: 'Denne side forklarer arbejdets omfang og, hvordan omkostningerne fastlægges.',
      viewAllLabel: 'Vis alle',
    },
    faq: {
      description: 'Hyppige spørgsmål om kontorets arbejde i Taiwan.',
      viewAllLabel: 'Vis alle',
    },
  },
  notFoundTitle: 'Siden blev ikke fundet',
  notFoundText:
    'Den søgte side findes ikke eller er flyttet. De kan vende tilbage til startsiden på dansk for at se de vejledninger, der findes.',
  backHomeLabel: 'Til startsiden',
  readSourceLabel: 'Åbn artikellisten på originalsproget',
  home: {
    heroScrollLabel: 'Rul nedad',
    heroColumnsCtaLabel: 'Se artiklerne',
    servicesDetailLabel: 'Se detaljerne',
    servicesAssistanceBefore: 'Hvis det er uklart, hvilken gruppe Deres sag tilhører, forklarer siden ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter:
      ' hvordan De formulerer et resumé, som en advokat gennemgår.',
    columnsViewAllLabel: 'Se alle artikler',
    columnsReadMoreLabel: 'Læs videre',
    columnsReviewLabel: 'Gennemgået af advokat Wei Tseng',
    columnsOriginalLanguageBadge: 'Originalsprog',
    columnsOriginalLanguageNote:
      'Følgende artikler findes endnu ikke på dansk. Listen bliver på originalsproget og åbner den pågældende sprogside; indholdet oversættes ikke automatisk.',
    imageBandAlt: 'Traditionel taiwansk sanheyuan (三合院) og en moderne pavillon i dagslys',
    videoPauseLabel: 'Sæt videoen på pause',
    videoPlayLabel: 'Afspil videoen',
    videoReplayLabel: 'Afspil videoen igen',
  },
  pages: {
    home: {
      eyebrow: 'VEJLEDNINGER',
      title: 'Juridiske tjenester i Taiwan — vejledninger på dansk',
      description:
        'Almindelige forklaringer på dansk om Hovering International Law Firms arbejdsområde i Taiwan, rådgivningssprogene og den første kontakt.',
      intro:
        'Hovering International Law Firm ledsager klienter fra udlandet, også med tilknytning til Taiwan, i sager efter Taiwans ret: investering og selskabsstiftelse, civile tvister, ægteskab, familie og arv, arbejdsret, strafferet og immaterialret. Denne danske del hjælper Dem med at se, hvilket arbejde der falder inden for vores område, hvad der skal forberedes, og hvordan De når os. Det er almindelige oplysninger, ikke juridisk rådgivning for Deres egen sag.',
      sections: [
        {
          heading: 'Hvad vi gør',
          paragraphs: [
            'Hovering International Law Firm er et advokatkontor etableret i Taiwan. Det arbejder efter Taiwans ret og har kontorer i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) og Pingtung (屏東). Vi rådgiver virksomheder og fører sager for retten og ledsager klienter fra udlandet gennem de skridt, der kræves i Taiwan.',
            'Hele indholdet her er almindeligt. Udfaldet af en sag afhænger af fakta, de gældende regler og tidspunktet. Disse vejledninger erstatter ikke samtalen med en advokat om Deres dokumenter.',
          ],
        },
        {
          heading: 'Sidens sprog og rådgivningssproget er ikke det samme',
          paragraphs: [
            'Denne side er skrevet på dansk, men rådgivningen med en advokat foregår kun på de fire rådgivningssprog engelsk, kinesisk (中文), japansk og koreansk. At læse vejledningerne på dansk betyder ikke, at samtalen med advokaten foregår på dansk.',
            'Vi lover ikke en tolk, en svartid eller en tid via denne side. Hvis De ikke kan bruge noget af de fire sprog, forklarer siden »Kontakt«, hvordan vi prøver en kommunikationsvej.',
          ],
        },
        {
          heading: 'Arbejdsgrupper',
          paragraphs: [
            'Arbejdsområdet omfatter følgende seks grupper. Siden »Ydelser« beskriver hver gruppe nøjere og angiver, hvad der ikke udlovés.',
          ],
          items: [
            'Investering og selskabsstiftelse i Taiwan',
            'Civile tvister og erstatning',
            'Ægteskab, familie og arv',
            'Arbejdsretlige tvister',
            'Strafferetlige sager',
            'Immaterialret: varemærker, patenter og ophavsret',
          ],
        },
        {
          heading: 'Hvor De bør begynde',
          paragraphs: [
            'Læs siden »Ydelser« for at se, om Deres sag falder inden for vores område, derefter »Omkostninger« og »Kontakt« for at vide, hvordan omfanget fastlægges, og hvordan omkostningerne bekræftes, før arbejdet begynder.',
            'Når De sender en meddelelse, må De skrive resuméet på Deres eget sprog. Originalteksten gemmes, som De skrev den, og oversættes ikke automatisk. En sendt meddelelse er en anmodning, der venter på gennemgang: det er endnu ikke rådgivning og ikke en bekræftet tid.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'YDELSER',
      title: 'Hvilke sager vi behandler',
      description:
        'Seks arbejdsgrupper hos kontoret i Taiwan og de grænser, De først bør kende.',
      intro:
        'Nedenfor de grupper, vi faktisk behandler, og spørgsmål, der ofte stilles i begyndelsen. Fremstillingen hjælper Dem med at vurdere, om Deres sag falder inden for vores område; den er almindelig og ikke en juridisk analyse af en enkelt sag.',
      sections: [
        {
          heading: 'Investering og selskabsstiftelse i Taiwan',
          paragraphs: [
            'Vi ledsager udenlandske investorer og virksomheder ved stiftelse eller drift af et selskab i Taiwan: valg af retsform, forberedelse og indgivelse af dokumenter, kapitalindskud, bankspørgsmål, prøvelse af lokalet samt branchekrav. Vi støtter også bogføring og skat, der følger af stiftelse og drift i Taiwan.',
            'Forløb og tid adskiller sig efter form, investor, branche, bank og allerede tilgængelige dokumenter. En selskabsstiftelse fører ikke af sig selv til opholdstilladelse (居留) eller arbejdstilladelse (工作許可): det er særskilte forløb, der vurderes efter personens situation.',
          ],
        },
        {
          heading: 'Civile tvister og erstatning',
          paragraphs: [
            'Denne gruppe omfatter kontrakt tvister, erstatning fra retsstridig handling og forbrugertvister. Arbejdet begynder som regel med en kronologi, gennemgang af eksisterende dokumenter og beviser og først derefter med de næste skridt.',
            'Frister, herunder forældelse, og bevisernes fuldstændighed præger forløbet. Angiv derfor kendte datoer så tidligt som muligt. Bevar kontrakter, meddelelser, betalingskvitteringer eller fotos af situationen på stedet og nævn dem i den første meddelelse.',
          ],
        },
        {
          heading: 'Ægteskab, familie og arv',
          paragraphs: [
            'Vi behandler skilsmisse (離婚), bodeling, udøvelse og bæring af rettigheder og pligter over for mindreårige børn (未成年子女權利義務之行使或負擔), samvær (會面交往) og arv (繼承), også når parter eller formue findes i forskellige stater. Grænseoverskridende familiesager kræver ofte yderligere prøvelse af folkeregister (戶籍), dokumenters form og deres bevisværdi i Taiwan.',
            'Fordi familiesager ofte medfører frister og parallelle forløb, bør det første resumé nævne parternes forhold, den aktuelle bopæl og allerede igangværende forløb.',
          ],
        },
        {
          heading: 'Arbejdsretlige tvister',
          paragraphs: [
            'Denne gruppe omfatter ophør af ansættelse, fratrædelsesgodtgørelse efter Taiwans ret (資遣費; ikke atligestille med institutter i andre stater), løn og tvister ur ansættelseskontrakten (勞動契約), både på arbejdstager- og arbejdsgiverside. Ved prøvelsen adskiller vi ophørsgrunden fra spørgsmål om varsel, betaling og frister.',
            'Ansættelseskontrakt, arbejdsordning (工作規則), lønsedler og parternes korrespondance er oftest de afgørende dokumenter. Hvis De stadig har dem, nævn det i resuméet.',
          ],
        },
        {
          heading: 'Strafferetlige sager',
          paragraphs: [
            'Vi ledsager i efterforskningen og for retten, for sigtede eller tiltalte såvel som for forurettede, og vurderer strafferetlige risici ved erhvervsvirksomhed.',
            'Strafferetlige sager har ofte korte frister og fastlagte trin. Hvis De allerede har fået en skrivelse fra anklagemyndighed eller ret, nævn datoen på skrivelsen tidligt, så indholdet prøves i den rigtige rækkefølge.',
          ],
        },
        {
          heading: 'Immaterialret',
          paragraphs: [
            'Vi støtter ved registrering af varemærker (商標) og patenter (專利), ved ophavsret og ved tvister om disse rettigheder i Taiwan.',
            'I denne gruppe afgør rækkefølgen af skridtene: beskyttelsesomfang, ansøgningstidspunkt og faktisk brug påvirker valget. At indgive en ansøgning betyder ikke af sig selv, at den imødekommes.',
          ],
        },
        {
          heading: 'Omfang og dets bekræftelse',
          paragraphs: [
            'Kontoret arbejder efter Taiwans ret og behandler sager i de nævnte grupper. Omfanget af hver sag bekræftes særskilt, efter at en advokat har gennemgået Deres meddelelse.',
            'Opholdsstatus, arbejdstilladelse og sammenlignelige spørgsmål vurderes ud fra dokumenterne og personens situation, ikke ud fra statsborgerskabet. Hvis en del af Deres sag rører sådanne spørgsmål, nævn det ved kontakten. Denne side lover hverken et resultat eller en svartid.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'KONTORET',
      title: 'Om Hovering International Law Firm',
      description:
        'Grundoplysninger om dette taiwanske advokatkontor, dets kontorer og arbejdet med udenlandske parter.',
      intro:
        'Hovering International Law Firm er et advokatkontor i Taiwan. Advokaterne arbejder fra virksomhedsrådgivning til retssag. Denne del beskriver kontorets tilblivelse, stederne og arbejdet med udenlandske parter.',
      sections: [
        {
          heading: 'Stiftelse og opbygning',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) blev stiftet i 2016 af advokater, der har studeret ved National Taiwan University (國立臺灣大學). Det kinesiske navn 昊鼎 forener tegnet 昊 (»vid himmel«) med 鼎 (»fast grund«) og beskriver kontorets retning siden stiftelsen.',
            'Vi har kontorer i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) og Pingtung (屏東). Kontoret i Kaohsiung er indrettet på virksomhedsledelse og behandler civile, strafferetlige og forvaltningsretlige tvister. Kontoret i Taichung behandler byggesager, immaterialret og sager med tilknytning til Korea og Japan. Kontoret i Pingtung blev åbnet i 2017 til det lokale behov.',
            'Ved siden af det advokatmæssige arbejde findes siden 2020 også Hovering Accounting Office, som tilbyder bogføring og skatteplanlægning for erhvervsdrivende og formuende privatpersoner.',
          ],
        },
        {
          heading: 'Arbejde med udenlandske parter',
          paragraphs: [
            'Det grænseoverskridende arbejde omfatter selskabsstiftelse, visum, varemærke- og patentansøgninger, juridisk risikovurdering og skatterådgivning for virksomheder. Kontoret i Taichung behandler navnlig byggesager, immaterialret og sager med tilknytning til Korea og Japan. Advokat Wei Tseng (曾雋崴) ledsager klienter fra Korea, Japan og andre internationale klienter i de nævnte grupper.',
            'Om vi kan tage en sag afhænger af indholdet og af kommunikationens sprog. Falder Deres sag inden for de nævnte grupper og kan den drøftes på et af de fire rådgivningssprog, kan De sende et resumé til gennemgang.',
          ],
        },
        {
          heading: 'Når De kontakter os',
          paragraphs: [
            'Når Deres resumé er kommet ind, gennemgår en advokat indholdet og taler derefter om det mulige arbejdsomfang, endnu nødvendige dokumenter og de næste skridt. Ved skatte- eller bogføringsspørgsmål kan kontoret arbejde med bogføringsafdelingen i ét forløb.',
            'Resultatet af hver sag afhænger af fakta og de dokumenter, der findes; vi lover intet resultat. Hvis De har brug for et bindende svar for Deres situation, skal dokumenterne drøftes med en advokat på et af de fire rådgivningssprog.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKATER',
      title: 'Hoverings internationale team',
      description: 'Profiler for advokater, driftsledelse og partnerrevision hos Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'OMKOSTNINGER',
      title: 'Hvordan arbejdsomfang og omkostninger fastlægges',
      description:
        'Forklaring af rækkefølgen: først arbejdsomfanget, derefter omkostningsbekræftelsen, og hvorfor denne side ikke indeholder en prisliste.',
      intro:
        'Denne side forklarer, hvordan omkostninger fastlægges, ikke deres beløb. Beløbet afhænger af arbejdsomfanget i den enkelte sag og er meningsfuldt først, når det omfang er klart.',
      sections: [
        {
          heading: 'Først fastlægges arbejdsomfanget',
          paragraphs: [
            'Sager af samme slags kan have meget forskellig indsats, afhængigt af antallet af parter, tilgængelige dokumenter, frister der skal overholdes, og om et forløb allerede er begyndt. Derfor er det første skridt altid at fastlægge, hvad der hører til arbejdet, og hvad der ikke gør det.',
            'Resuméet, De sender i begyndelsen, er grundlaget for det omfang. Jo klarere det beskriver forløbet, Deres anmodning og fristerne, desto mere præcist kan omfanget bestemmes.',
          ],
        },
        {
          heading: 'Omkostningerne bekræftes, før arbejdet begynder',
          paragraphs: [
            'Når arbejdsomfanget er klart, drøftes beløb og beregningsmåde med Dem og bekræftes, før arbejdet begynder. Ændrer omfanget sig undervejs, skal det bekræftes på ny.',
            'Denne side er ikke et pristilbud og skaber ingen betalingspligt.',
          ],
        },
        {
          heading: 'Rådgivningen kan være mod betaling',
          paragraphs: [
            'Rådgivningen med en advokat kan være en ydelse mod betaling. Denne side siger ikke, at den første samtale er uden betaling, og ingen del må læses på den måde.',
            'Hvis rådgivningen er mod betaling, meddeles beløb og betalingsmåde, før den finder sted.',
          ],
        },
        {
          heading: 'Hvorfor denne side ikke angiver takster',
          paragraphs: [
            'Omkostningerne afhænger af sagen selv: af indsatsen, antallet af parter, dokumenterne, fristerne og om et forløb allerede er i gang. Et tal sat på forhånd ville ikke vise omkostningerne for Deres sag. Derfor fastlægger vi først arbejdsomfanget og meddeler Dem derefter omkostningerne, før arbejdet begynder.',
            'Udover advokathonoraret kan rets-, myndigheds- eller tredjepartsomkostninger opstå. De er adskilt fra honoraret og afhænger af det pågældende forløb.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Hvordan De når kontoret',
      description:
        'Sidens sprog, rådgivningssprogene, fremgangsmåden, hvis De ikke kan bruge noget af de fire sprog, og hvad denne side ikke udlover.',
      intro:
        'Før De skriver til os, adskil følgende tre punkter. De blandes ofte, men betyder forskellige ting.',
      sections: [
        {
          heading: 'Tre ting, der skal holdes adskilt',
          paragraphs: [
            'Sidens visningssprog, rådgivningssproget med advokaten og det sprog, De skriver på, er tre adskilte ting.',
          ],
          items: [
            'Sidens sprog: Disse vejledninger er skrevet på dansk.',
            'Rådgivningssprog: Rådgivningen foregår på engelsk, kinesisk (中文), japansk og koreansk.',
            'Deres skriftsprog: De må skrive resuméet på Deres eget sprog; originalteksten gemmes uændret.',
          ],
        },
        {
          heading: 'Hvis De ikke kan bruge noget af de fire rådgivningssprog',
          paragraphs: [
            'I kontaktformularen kan De vælge »Kommunikationsmåden skal bekræftes«. Vi svarer for at prøve en farbar kommunikationsvej, hvis en sådan findes; en ydelse på et andet sprog udlovés ikke, og en svartid udlovés ikke.',
            'Det er kun et prøvelsesskridt, ikke et løfte. Vi lover ikke en tolk, ikke en ydelse på dansk eller på et andet sprog uden for de fire nævnte sprog, og ikke at vi tager imod hver sag.',
          ],
        },
        {
          heading: 'Hvad der bør stå i den første meddelelse',
          paragraphs: [
            'Angiv, hvad der er sket, hvilken hjælp De har brug for, hvilket forhold sagen har til Taiwan, og fristen, hvis De kender en. Hvis De allerede har fået en skrivelse fra en ret eller en myndighed, nævn datoen på skrivelsen.',
            'I begyndelsen behøver De endnu ikke sende pasnummer, identitetsnummer, kontooplysninger, journaler eller hele beviset. Vent på anvisninger fra advokaten og send da følsomme dokumenter ad en sikker vej.',
          ],
        },
        {
          heading: 'Hvad denne side ikke udlover',
          paragraphs: [
            'Vi lover ingen svartid, bekræfter ingen tid via denne side, lover ikke en bestemt advokat og stiller ikke en tolk. Skriftlig oversættelse er noget andet: Deres meddelelse oversættes ikke automatisk.',
            'Når De sender en anmodning, gemmes indholdet og venter på gennemgang. Hvis De efter nogen tid ikke får svar, kan De skrive på ny til den e-mailadresse, der er angivet på kontaktsiden.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'SPØRGSMÅL',
      title: 'Ofte stillede spørgsmål',
      description:
        'Forklaringer om arbejdsområde, forberedelse, sprog, omkostninger og betydningen af en sendt anmodning.',
      intro:
        'De følgende spørgsmål besvares på niveauet almindelige oplysninger. Et svar for Deres egen sag er først muligt, efter at en advokat har gennemgået dokumenterne.',
      sections: [
        {
          heading: 'Hvordan De bruger denne del',
          paragraphs: [
            'Finder De intet svar for Deres situation, afhænger svaret oftest af særlige fakta. Skriv da disse fakta i resuméet i stedet for selv at udlede dem fra denne side.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Hvilke sager behandler kontoret?',
          answer:
            'Vi behandler seks grupper: investering og selskabsstiftelse i Taiwan, civile tvister og erstatning, ægteskab, familie og arv, arbejdsretlige tvister, strafferetlige sager og immaterialret. Om en sag tages imod afgøres efter gennemgang af indholdet.',
        },
        {
          question: 'Hvad bør jeg forberede før kontakten?',
          answer:
            'Forbered et kort resumé af forløbet, Deres anmodning, forholdet til Taiwan og fristen, hvis en findes. Findes allerede en skrivelse fra en ret eller en myndighed, nævn datoen. I dette stadium behøver De endnu ikke sende identitetsdokumenter eller hele beviset.',
        },
        {
          question: 'Kan jeg få rådgivning på dansk?',
          answer:
            'Nej. Disse vejledninger er skrevet på dansk, men rådgivningen med en advokat foregår kun på engelsk, kinesisk (中文), japansk og koreansk. Vi lover heller ikke en tolk. Skriftlig oversættelse er noget andet: den oprindelige tekst, De skriver, gemmes som den er og oversættes ikke automatisk.',
        },
        {
          question: 'Hvad hvis jeg ikke kan bruge noget af de fire sprog?',
          answer:
            'Vælg ved afsendelsen »Kommunikationsmåden skal bekræftes«. Vi svarer for at prøve en kommunikationsmåde, men en ydelse på et andet sprog udlovés ikke. Det er et prøvelsesskridt, ikke et løfte om at vi kan arbejde på et andet sprog.',
        },
        {
          question: 'Hvordan behandles min danske tekst?',
          answer:
            'Originalteksten, De skriver, gemmes som den er og oversættes ikke automatisk. Hvis det er nødvendigt, bekræftes sproget for den videre kommunikation med Dem.',
        },
        {
          question: 'Er rådgivningen allerede sket, når anmodningen er sendt?',
          answer:
            'Nej. En sendt anmodning venter på gennemgang af en advokat. Det er ikke juridisk rådgivning, ikke en bekræftet tid, og afsendelsen skaber i sig selv ikke et forhold mellem advokat og klient.',
        },
        {
          question: 'Hvordan beregnes omkostningerne?',
          answer:
            'Først fastlægges arbejdsomfanget, derefter bekræftes beløb og beregningsmåde med Dem, før arbejdet begynder. Denne side angiver ingen tal og siger ikke, at den første samtale er uden betaling.',
        },
        {
          question: 'Hvad hvis min sag er meget hastende?',
          answer:
            'Angiv fristen eller datoen på en officiel skrivelse i begyndelsen af Deres resumé, så disse data er synlige ved gennemgangen. Denne side har ingen nødkanal og udlover ingen svartid; hvis Deres sag ikke kan vente, bør De parallelt søge andre veje på Deres sted.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVATLIV',
      title: 'Data, der indsamles via kontaktformularen',
      description:
        'Hvad kontaktformularen i denne danske del indsamler, hvordan originalteksten behandles, og hvordan De når os om Deres data.',
      intro:
        'Denne del vedrører kun kontaktformularen på disse vejledningssider. Den beskriver behandlingen af data, ikke et teknisk løfte.',
      sections: [
        {
          heading: 'Hvilke data der indsamles',
          paragraphs: [
            'Når De sender en anmodning via formularen i denne del, registreres følgende:',
          ],
          items: [
            'Det navn, De opgiver',
            'E-mailadressen til svaret',
            'Sidens visningssprog ved afsendelsen',
            'Det sprog, De skrev på',
            'Det rådgivningssprog, De ønsker',
            'Originalteksten, De skrev',
            'Deres samtykke til at sende anmodningen',
            'Et modtagelsesnummer for at genfinde anmodningen',
          ],
        },
        {
          heading: 'Originalteksten gemmes uændret',
          paragraphs: [
            'Deres tekst gemmes præcis, som De skrev den, og oversættes ikke automatisk. Er en oversættelse nødvendig for behandlingen, tages det op særskilt med Dem.',
            'Fordi originalteksten gemmes, skriv i begyndelsen ikke noget, der endnu ikke er nødvendigt, for eksempel pasnummer, identitetsnummer eller kontooplysninger.',
          ],
        },
        {
          heading: 'Lagringssted og adgang',
          paragraphs: [
            'Indholdet af Deres afsendelse gemmes et sted, der ikke er offentligt tilgængeligt. Kun berettigede personer på kontoret må få adgang for at behandle anmodningen.',
            'Denne side giver intet absolut sikkerhedsløfte. Ingen overførselsvej og intet lagringssted er helt sikkert; følsomme dokumenter bør derfor kun sendes efter særlig anvisning fra advokaten.',
          ],
        },
        {
          heading: 'Formålet med brugen',
          paragraphs: [
            'De sendte data tjener til at gennemgå anmodningen, give Dem tilbagemelding, afklare kommunikationsmåden og behandle sagen, hvis arbejdet tages op.',
            'Dataene bruges ikke til markedsføring uden et særskilt samtykke.',
          ],
        },
        {
          heading: 'Underretning og modtagelsesnummer',
          paragraphs: [
            'Sendes en anmodning med held, underretter systemet kontoret. Er denne underretning endnu ikke bekræftet, forbliver Deres tekst gemt og går ikke tabt.',
            'Modtagelsesnummeret tjener til at genfinde Deres anmodning i vore akter. Det vises efter gemningen; De kan angive det ved en ny kontakt.',
          ],
        },
        {
          heading: 'Deres rettigheder og kontaktvejen',
          paragraphs: [
            'De kan begære indsigt, berigtigelse eller sletning af Deres data eller tilbagekalde samtykket via den e-mailadresse, der er angivet på kontaktsiden. Findes en lovlig eller processuel pligt til at bevare, forklarer vi begrænsningen.',
            'Denne side angiver ingen fast bevaringsfrist, fordi den faktiske tid afhænger af, om sagen fortsættes, og af de dertil hørende pligter. Ønsker De en tidligere sletning, meddel det ved kontakten.',
          ],
        },
        {
          heading: 'Lagringssted og leverandører',
          paragraphs: [
            'Denne hjemmeside hostes hos Vercel, og Deres afsendelse gemmes i et ikke-offentligt objektlager hos denne tjeneste. E-mails sendes via den e-mailtjeneste, kontoret bruger.',
            'Enkelte leverandørers servere kan stå uden for Taiwan, så Deres data kan gemmes og behandles dér. Når lagringsformålet er opfyldt, slettes dataene uden forsinkelse; data, der skal bevares efter gældende regler, bliver i den tid. Forespørgsler om persondata tages imod af wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'FORBEHOLD',
      title: 'Omfang og grænser for oplysningerne på denne side',
      description:
        'Oplysningernes almindelige karakter, det retlige anvendelsesområde og forudsætningerne for et forhold mellem advokat og klient.',
      intro:
        'Denne del gør klart, hvad disse danske vejledningssider kan gøre for Dem, og hvad de ikke kan.',
      sections: [
        {
          heading: 'Kun almindelige oplysninger',
          paragraphs: [
            'Indholdet på disse sider er skrevet som almindelig information. Det er ikke juridisk rådgivning for Deres sag og erstatter ikke gennemgangen af Deres egne dokumenter.',
            'Udfaldet af en sag afhænger af fakta, de gældende regler og tidspunktet; to tilsyneladende ens situationer kan ende forskelligt.',
          ],
        },
        {
          heading: 'Retligt anvendelsesområde',
          paragraphs: [
            'Kontoret virker efter Taiwans ret, og denne side taler kun om arbejde inden for den ramme.',
            'Indholdet er ikke rådgivning efter retten i en anden retsorden end Taiwan, herunder retten på Deres bopæl. Rører en del af Deres sag en anden retsorden, afklarer vi med Dem, hvilken kvalificeret fagperson der behøves til den del.',
          ],
        },
        {
          heading: 'Et forhold mellem advokat og klient opstår ikke af sig selv',
          paragraphs: [
            'At læse denne side, at sende en formular eller en e-mail skaber i sig selv ikke et forhold mellem advokat og klient.',
            'Dette forhold opstår først, efter at sagen er gennemgået, og begge sider har bekræftet, at arbejdet tages op.',
          ],
        },
        {
          heading: 'Intet løfte om resultat',
          paragraphs: [
            'Ingen del af denne side er et løfte om resultatet af en sag, om imødekommelse af en ansøgning eller om opholds- og arbejdsstatus.',
            'Eksterne links tjener til orientering; vi udlover hverken rigtigheden eller aktualiteten af tredjepartsindhold.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTIKLER',
      title: 'Artikler om Taiwans ret',
      description:
        'Artikler på dansk om hyppige spørgsmål i Taiwans ret. Indholdet er almindelig information på tidspunktet for offentliggørelsen, ikke juridisk rådgivning for Deres sag.',
      intro:
        'Kontoret offentliggør artikler om hyppige spørgsmål i Taiwans ret. Artikler, der findes på dansk, står på denne side; dertil er der fire links, som hver åbner artikellisten for et originalsprog.',
      sections: [
        {
          heading: 'Fire lister efter sprog',
          paragraphs: [
            'Denne del indeholder fire links: artikellisten på koreansk, på kinesisk, på engelsk og på japansk. Hvert link angiver listen sprog, så De på forhånd ved, på hvilket sprog indholdet åbnes.',
            'Disse fire lister er lister efter artiklernes originalsprog, ikke oversættelseslister. Artikler, der findes på dansk, står særskilt på denne side.',
          ],
        },
        {
          heading: 'Hvor linksene fører hen',
          paragraphs: [
            'Når De vælger et af de fire links, åbnes artikellisten for det sprog. Ud af listen vælger De selv teksten; hele indholdet vises på artikelns originalsprog.',
            'Denne side sammenfatter ikke artiklernes indhold og udlover ikke, at et emne findes på alle fire sprog. Hver liste indeholder kun tekster, der er offentliggjort på det sprog.',
          ],
        },
        {
          heading: 'Hvor langt en artikel kan tjene som orientering',
          paragraphs: [
            'Artikler er almindelige oplysninger på tidspunktet for offentliggørelsen. Regler og deres anvendelse kan ændre sig, og en artikel indeholder ikke alle omstændigheder i Deres sag.',
            'Støt derfor ingen handling i en virkelig sag alene på en artikel. Brug den til overblik og drøft Deres dokumenter særskilt med en advokat; denne side er ikke rådgivningsskridtet.',
          ],
        },
      ],
    },
  },
};

export const norwegianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Norsk',
  nav: {
    home: 'Hjem',
    services: 'Tjenester',
    about: 'Kontoret',
    lawyers: 'Advokater',
    pricing: 'Kostnader',
    contact: 'Kontakt',
    faq: 'Spørsmål',
    privacy: 'Personvern',
    disclaimer: 'Forbehold',
    columns: 'Artikler',
  },
  contactCta: 'Send en forespørsel om rådgivning',
  footerNotice:
    'Denne siden på norsk inneholder bare alminnelige veiledninger om kontorets arbeid etter Taiwans rett. Den er ikke juridisk rådgivning for en konkret sak, og å sende en melding skaper i seg selv ikke et forhold mellom advokat og klient.',
  skipLink: 'Hopp over navigasjonen og gå til innholdet',
  menuLabel: 'Meny',
  languageLabel: 'Visningsspråk',
  mega: {
    services: {
      description: 'Kontoret behandler de viktigste fagområdene i taiwansk rett.',
      viewAllLabel: 'Vis alle',
    },
    columns: {
      description: 'Artikler om vanlige spørsmål i Taiwans rett.',
      viewAllLabel: 'Vis alle',
    },
    lawyers: {
      description: 'Presentasjon av advokatene og hvordan du tar kontakt.',
      viewAllLabel: 'Vis alle',
    },
    pricing: {
      description: 'Denne siden forklarer arbeidets omfang og hvordan kostnadene fastsettes.',
      viewAllLabel: 'Vis alle',
    },
    faq: {
      description: 'Vanlige spørsmål om kontorets arbeid i Taiwan.',
      viewAllLabel: 'Vis alle',
    },
  },
  notFoundTitle: 'Siden ble ikke funnet',
  notFoundText:
    'Siden du søkte etter, finnes ikke eller er flyttet. Du kan gå tilbake til startsiden på norsk for å se veiledningene som finnes.',
  backHomeLabel: 'Til startsiden',
  readSourceLabel: 'Åpne artikkellisten på originalspråket',
  home: {
    heroScrollLabel: 'Rull nedover',
    heroColumnsCtaLabel: 'Se artiklene',
    servicesDetailLabel: 'Se detaljene',
    servicesAssistanceBefore: 'Hvis det er uklart hvilket fagområde saken din hører inn under, forklarer siden ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter:
      ' hvordan du skriver et sammendrag som en advokat kan vurdere.',
    columnsViewAllLabel: 'Se alle artikler',
    columnsReadMoreLabel: 'Les videre',
    columnsReviewLabel: 'Vurdert av advokat Wei Tseng',
    columnsOriginalLanguageBadge: 'Originalspråk',
    columnsOriginalLanguageNote:
      'Artiklene nedenfor finnes ennå ikke på norsk. Listen står på originalspråket og åpner den aktuelle språksiden; innholdet oversettes ikke automatisk.',
    imageBandAlt: 'Tradisjonell taiwansk sanheyuan (三合院) og en moderne paviljong i dagslys',
    videoPauseLabel: 'Sett videoen på pause',
    videoPlayLabel: 'Spill av videoen',
    videoReplayLabel: 'Spill av videoen på nytt',
  },
  pages: {
    home: {
      eyebrow: 'VEILEDNINGER',
      title: 'Juridiske tjenester i Taiwan — veiledninger på norsk',
      description:
        'Alminnelige forklaringer på norsk om Hovering International Law Firms arbeidsområde i Taiwan, rådgivningsspråkene og den første kontakten.',
      intro:
        'Hovering International Law Firm bistår klienter i utlandet, også med tilknytning til Taiwan, i saker etter taiwansk rett: investering og selskapsstiftelse, sivile tvister, ekteskap, familie og arv, arbeidsrett, strafferett og immaterialrett. Denne norske delen hjelper deg med å se hvilket arbeid som faller innenfor vårt område, hva du bør forberede, og hvordan du når oss. Det er alminnelige opplysninger, ikke juridisk rådgivning i din egen sak.',
      sections: [
        {
          heading: 'Hva vi gjør',
          paragraphs: [
            'Hovering International Law Firm er et advokatkontor etablert i Taiwan. Vi arbeider etter taiwansk rett og har kontorer i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) og Pingtung (屏東). Vi gir råd til virksomheter, fører saker for domstolene og bistår klienter fra utlandet gjennom de trinnene som kreves i Taiwan.',
            'Alt innholdet her er alminnelig. Utfallet av en sak avhenger av fakta, av reglene som gjelder, og av tidspunktet. Disse veiledningene erstatter ikke en samtale med advokat om dine egne dokumenter.',
          ],
        },
        {
          heading: 'Sidens språk og rådgivningsspråket er ikke det samme',
          paragraphs: [
            'Denne siden er skrevet på norsk, men rådgivningen med en advokat foregår bare på de fire rådgivningsspråkene engelsk, kinesisk (中文), japansk og koreansk. Å lese veiledningene på norsk betyr ikke at samtalen med advokaten foregår på norsk.',
            'Vi lover ikke tolk, svartid eller time via denne siden. Hvis du ikke behersker noen av de fire språkene, forklarer siden «Kontakt» hvordan vi forsøker å finne en kommunikasjonsvei.',
          ],
        },
        {
          heading: 'Fagområder',
          paragraphs: [
            'Arbeidet vårt omfatter følgende seks fagområder. Siden «Tjenester» beskriver hvert fagområde nærmere og angir hva vi ikke lover.',
          ],
          items: [
            'Investering og selskapsstiftelse i Taiwan',
            'Sivile tvister og erstatning',
            'Ekteskap, familie og arv',
            'Arbeidsrettslige tvister',
            'Strafferettslige saker',
            'Immaterialrett: varemerker, patenter og opphavsrett',
          ],
        },
        {
          heading: 'Hvor du bør begynne',
          paragraphs: [
            'Les siden «Tjenester» for å se om saken din faller innenfor vårt område, deretter «Kostnader» og «Kontakt» for å se hvordan omfanget fastsettes, og hvordan kostnadene bekreftes før arbeidet begynner.',
            'Når du sender en melding, kan du skrive sammendraget på ditt eget språk. Originalteksten lagres slik du skrev den, og oversettes ikke automatisk. En sendt melding er en forespørsel som venter på vurdering: det er ennå ikke rådgivning, og det er ingen bekreftet time.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'TJENESTER',
      title: 'Hvilke saker vi behandler',
      description:
        'Kontorets seks fagområder i Taiwan og grensene du bør kjenne til først.',
      intro:
        'Nedenfor følger fagområdene vi faktisk behandler, og spørsmål som ofte stilles i begynnelsen. Fremstillingen hjelper deg med å vurdere om saken din faller innenfor vårt område; den er alminnelig og er ingen juridisk analyse av en enkeltsak.',
      sections: [
        {
          heading: 'Investering og selskapsstiftelse i Taiwan',
          paragraphs: [
            'Vi bistår utenlandske investorer og virksomheter ved stiftelse eller drift av et selskap i Taiwan: valg av selskapsform, forberedelse og innlevering av dokumenter, kapitalinnskudd, bankspørsmål, kontroll av forretningslokalet og bransjekrav. Vi bistår også med bokføring og skatt som følger av stiftelse og drift i Taiwan.',
            'Fremgangsmåte og tidsbruk varierer med selskapsform, investor, bransje, bank og hvilke dokumenter som allerede foreligger. En selskapsstiftelse gir ikke i seg selv oppholdstillatelse (居留) eller arbeidstillatelse (工作許可): det er egne søknadsløp som vurderes ut fra den enkeltes situasjon.',
          ],
        },
        {
          heading: 'Sivile tvister og erstatning',
          paragraphs: [
            'Dette fagområdet omfatter kontraktstvister, erstatning utenfor kontrakt og forbrukertvister. Arbeidet begynner som regel med en tidslinje og en gjennomgang av dokumentene og bevisene som finnes, og først deretter med de neste trinnene.',
            'Frister, blant annet foreldelse, og hvor fullstendige bevisene er, preger saksgangen. Oppgi derfor kjente datoer så tidlig som mulig. Ta vare på kontrakter, meldinger, betalingskvitteringer og bilder fra stedet, og nevn dem i den første meldingen.',
          ],
        },
        {
          heading: 'Ekteskap, familie og arv',
          paragraphs: [
            'Vi behandler skilsmisse (離婚), deling av formue, foreldreansvar for mindreårige barn (未成年子女權利義務之行使或負擔), samvær (會面交往) og arv (繼承), også når parter eller formue befinner seg i ulike land. Grenseoverskridende familiesaker krever ofte en ekstra kontroll av folkeregistreringen (戶籍), av dokumentenes form og av bevisverdien de har i Taiwan.',
            'Fordi familiesaker ofte har frister og parallelle prosesser, bør det første sammendraget nevne forholdet mellom partene, hvor de bor nå, og hvilke prosesser som allerede pågår.',
          ],
        },
        {
          heading: 'Arbeidsrettslige tvister',
          paragraphs: [
            'Dette fagområdet omfatter opphør av arbeidsforhold, sluttvederlag etter taiwansk rett (資遣費; ikke å likestille med tilsvarende ordninger i andre land), lønn og tvister som springer ut av arbeidsavtalen (勞動契約), både på arbeidstaker- og arbeidsgiversiden. I vurderingen skiller vi opphørsgrunnen fra spørsmål om varsel, betaling og frister.',
            'Arbeidsavtalen, arbeidsreglementet (工作規則), lønnsslippene og korrespondansen mellom partene er som regel de avgjørende dokumentene. Hvis du fortsatt har dem, nevn det i sammendraget.',
          ],
        },
        {
          heading: 'Strafferettslige saker',
          paragraphs: [
            'Vi bistår siktede, tiltalte og fornærmede under etterforskningen og i retten, og vi vurderer strafferettslig risiko i næringsvirksomhet.',
            'Straffesaker har ofte korte frister og faste trinn. Hvis du allerede har fått en skrivelse fra påtalemyndigheten eller domstolen, nevn datoen på skrivelsen tidlig, slik at innholdet gjennomgås i riktig rekkefølge.',
          ],
        },
        {
          heading: 'Immaterialrett',
          paragraphs: [
            'Vi bistår ved registrering av varemerker (商標) og patenter (專利), i opphavsrettslige spørsmål og i tvister om disse rettighetene i Taiwan.',
            'På dette fagområdet er rekkefølgen av trinnene avgjørende: vernets omfang, søknadstidspunktet og den faktiske bruken påvirker valget. At en søknad sendes inn, betyr ikke i seg selv at den blir innvilget.',
          ],
        },
        {
          heading: 'Omfang og dets bekreftelse',
          paragraphs: [
            'Kontoret arbeider etter taiwansk rett og behandler saker på de fagområdene som er nevnt. Omfanget i den enkelte sak bekreftes særskilt etter at en advokat har vurdert meldingen din.',
            'Oppholdsstatus, arbeidstillatelse og lignende spørsmål vurderes ut fra dokumentene og den enkeltes situasjon, ikke ut fra statsborgerskap. Hvis en del av saken din berører slike spørsmål, nevn det når du tar kontakt. Denne siden lover verken et resultat eller en svartid.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'KONTORET',
      title: 'Om Hovering International Law Firm',
      description:
        'Grunnopplysninger om dette taiwanske advokatkontoret, dets kontorer og arbeidet med utenlandske parter.',
      intro:
        'Hovering International Law Firm er et advokatkontor i Taiwan. Advokatene arbeider med alt fra forretningsjuridisk rådgivning til prosedyre. Denne delen beskriver hvordan kontoret ble til, hvor vi holder til, og arbeidet med utenlandske parter.',
      sections: [
        {
          heading: 'Stiftelse og oppbygning',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) ble stiftet i 2016 av advokater som har studert ved National Taiwan University (國立臺灣大學). Det kinesiske navnet 昊鼎 forener tegnet 昊 («den vide himmelen») med 鼎 («det faste grunnlaget») og beskriver kontorets retning helt siden stiftelsen.',
            'Vi har kontorer i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) og Pingtung (屏東). Kontoret i Kaohsiung er innrettet på virksomhetsledelse og behandler sivile, strafferettslige og forvaltningsrettslige tvister. Kontoret i Taichung behandler byggesaker, immaterialrett og saker med tilknytning til Korea og Japan. Kontoret i Pingtung ble åpnet i 2017 for det lokale behovet.',
            'Ved siden av advokatvirksomheten har vi siden 2020 også Hovering Accounting Office, som tilbyr bokføring og skatteplanlegging for næringsdrivende og formuende privatpersoner.',
          ],
        },
        {
          heading: 'Arbeid med utenlandske parter',
          paragraphs: [
            'Det grenseoverskridende arbeidet omfatter selskapsstiftelse, visum, varemerke- og patentsøknader, juridisk risikovurdering og skatterådgivning for virksomheter. Kontoret i Taichung behandler særlig byggesaker, immaterialrett og saker med tilknytning til Korea og Japan. Advokat Wei Tseng (曾雋崴) bistår klienter fra Korea og Japan og andre internasjonale klienter på de fagområdene som er nevnt.',
            'Om vi kan ta en sak, avhenger av innholdet og av hvilket språk kommunikasjonen kan foregå på. Faller saken din innenfor de fagområdene som er nevnt, og kan den drøftes på et av de fire rådgivningsspråkene, kan du sende et sammendrag til vurdering.',
          ],
        },
        {
          heading: 'Når du kontakter oss',
          paragraphs: [
            'Når sammendraget ditt er kommet inn, vurderer en advokat innholdet og tar deretter opp mulig arbeidsomfang, dokumenter som fortsatt trengs, og de neste trinnene. I skatte- og bokføringsspørsmål kan kontoret arbeide sammen med regnskapsavdelingen i én og samme prosess.',
            'Utfallet i den enkelte sak avhenger av fakta og av dokumentene som finnes; vi lover ikke noe resultat. Trenger du et bindende svar for din situasjon, må dokumentene drøftes med en advokat på et av de fire rådgivningsspråkene.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKATER',
      title: 'Hoverings internasjonale team',
      description: 'Profiler for Hoverings advokater, den operative ledelsen og det tilknyttede revisjonskontoret.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'KOSTNADER',
      title: 'Hvordan arbeidsomfang og kostnader fastsettes',
      description:
        'Forklaring av rekkefølgen: først arbeidsomfanget, deretter kostnadsbekreftelsen, og hvorfor denne siden ikke inneholder en prisliste.',
      intro:
        'Denne siden forklarer hvordan kostnader fastsettes, ikke beløpet. Beløpet avhenger av arbeidsomfanget i den enkelte sak og er meningsfullt først når det omfanget er klart.',
      sections: [
        {
          heading: 'Først fastsettes arbeidsomfanget',
          paragraphs: [
            'Saker av samme type kan kreve svært ulik innsats, avhengig av antall parter, hvilke dokumenter som finnes, hvilke frister som må overholdes, og om en prosess allerede er i gang. Derfor er det første trinnet alltid å fastsette hva som hører til arbeidet, og hva som ikke gjør det.',
            'Sammendraget du sender i begynnelsen, er grunnlaget for dette omfanget. Jo klarere det beskriver saksgangen, forespørselen din og fristene, desto mer presist kan omfanget fastsettes.',
          ],
        },
        {
          heading: 'Kostnadene bekreftes før arbeidet begynner',
          paragraphs: [
            'Når arbeidsomfanget er klart, drøfter vi beløp og beregningsmåte med deg, og de bekreftes før arbeidet begynner. Endrer omfanget seg underveis, må det bekreftes på nytt.',
            'Denne siden er ikke et pristilbud og skaper ingen betalingsplikt.',
          ],
        },
        {
          heading: 'Rådgivningen kan være mot betaling',
          paragraphs: [
            'Rådgivning hos advokat kan være en betalt tjeneste. Denne siden sier ikke at den første samtalen er uten betaling, og ingen del av den skal leses slik.',
            'Er rådgivningen mot betaling, opplyser vi om beløp og betalingsmåte før den finner sted.',
          ],
        },
        {
          heading: 'Hvorfor denne siden ikke angir takster',
          paragraphs: [
            'Kostnadene avhenger av saken selv: av innsatsen, antall parter, dokumentene, fristene og om en prosess allerede pågår. Et tall satt på forhånd ville ikke vise hva din sak koster. Derfor fastsetter vi først arbeidsomfanget og opplyser deg deretter om kostnadene, før arbeidet begynner.',
            'I tillegg til advokathonoraret kan det påløpe retts-, myndighets- eller tredjepartskostnader. Disse kommer utenom honoraret og avhenger av den enkelte saken.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Slik når du kontoret',
      description:
        'Sidens språk, rådgivningsspråkene, fremgangsmåten hvis du ikke behersker noen av de fire språkene, og hva denne siden ikke lover.',
      intro:
        'Før du skriver til oss, bør du skille mellom disse tre punktene. De blandes ofte sammen, men betyr ulike ting.',
      sections: [
        {
          heading: 'Tre ting som må holdes atskilt',
          paragraphs: [
            'Sidens visningsspråk, språket rådgivningen med advokaten foregår på, og språket du selv skriver på, er tre atskilte ting.',
          ],
          items: [
            'Sidens språk: Disse veiledningene er skrevet på norsk.',
            'Rådgivningsspråk: Rådgivningen foregår bare på engelsk, kinesisk (中文), japansk og koreansk.',
            'Ditt skriftspråk: Du kan skrive sammendraget på ditt eget språk; originalteksten lagres uendret.',
          ],
        },
        {
          heading: 'Hvis du ikke behersker noen av de fire rådgivningsspråkene',
          paragraphs: [
            'I kontaktskjemaet kan du velge «Kommunikasjonsmåten må bekreftes». Vi svarer for å undersøke om det finnes en brukbar kommunikasjonsvei; rådgivning på et annet språk loves ikke, og vi lover ingen svartid.',
            'Det er bare et forsøk, ikke et løfte. Vi lover ikke tolk, ikke bistand på norsk eller på andre språk enn de fire nevnte, og ikke at vi tar imot enhver sak.',
          ],
        },
        {
          heading: 'Hva som bør stå i den første meldingen',
          paragraphs: [
            'Fortell hva som har skjedd, hvilken hjelp du trenger, hvilken tilknytning saken har til Taiwan, og fristen, hvis du kjenner en. Har du allerede fått en skrivelse fra en domstol eller en myndighet, nevn datoen på skrivelsen.',
            'I begynnelsen trenger du ennå ikke sende passnummer, identitetsnummer, kontoopplysninger, pasientjournaler eller hele bevismaterialet. Vent på anvisning fra advokaten, og send da sensitive dokumenter på en sikker måte.',
          ],
        },
        {
          heading: 'Hva denne siden ikke lover',
          paragraphs: [
            'Vi lover ingen svartid, bekrefter ingen time via denne siden, lover ikke en bestemt advokat og stiller ikke tolk. Skriftlig oversettelse er noe annet: meldingen din oversettes ikke automatisk.',
            'Når du sender en forespørsel, lagres innholdet og venter på vurdering. Får du ikke svar etter en tid, kan du skrive på nytt til e-postadressen som er oppgitt på kontaktsiden.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'SPØRSMÅL',
      title: 'Ofte stilte spørsmål',
      description:
        'Forklaringer om arbeidsområde, forberedelse, språk, kostnader og betydningen av en sendt forespørsel.',
      intro:
        'Spørsmålene nedenfor besvares på et alminnelig informasjonsnivå. Et svar for din egen sak er først mulig etter at en advokat har vurdert dokumentene.',
      sections: [
        {
          heading: 'Slik bruker du denne delen',
          paragraphs: [
            'Finner du ikke noe svar for din situasjon, avhenger svaret som regel av særlige fakta. Skriv da disse faktaene i sammendraget i stedet for å trekke slutninger selv fra denne siden.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Hvilke saker behandler kontoret?',
          answer:
            'Vi behandler seks fagområder: investering og selskapsstiftelse i Taiwan, sivile tvister og erstatning, ekteskap, familie og arv, arbeidsrettslige tvister, straffesaker og immaterialrett. Om vi tar imot en sak, avgjøres etter en vurdering av innholdet.',
        },
        {
          question: 'Hva bør jeg forberede før kontakten?',
          answer:
            'Forbered et kort sammendrag av saksgangen, forespørselen din, tilknytningen til Taiwan og fristen, hvis det finnes en. Finnes det allerede en skrivelse fra en domstol eller en myndighet, nevn datoen. På dette stadiet trenger du ennå ikke sende identitetsdokumenter eller hele bevismaterialet.',
        },
        {
          question: 'Kan jeg få rådgivning på norsk?',
          answer:
            'Nei. Disse veiledningene er skrevet på norsk, men rådgivningen med en advokat foregår bare på engelsk, kinesisk (中文), japansk og koreansk. Vi lover heller ikke tolk. Skriftlig oversettelse er noe annet: den opprinnelige teksten du skriver, lagres slik den er, og oversettes ikke automatisk.',
        },
        {
          question: 'Hva hvis jeg ikke kan bruke noe av de fire språkene?',
          answer:
            'Velg «Kommunikasjonsmåten må bekreftes» når du sender inn. Vi svarer for å undersøke en mulig kommunikasjonsmåte, men rådgivning på et annet språk loves ikke. Det er et forsøk, ikke et løfte om at vi kan arbeide på et annet språk.',
        },
        {
          question: 'Hvordan behandles min norske tekst?',
          answer:
            'Originalteksten du skriver, lagres slik den er, og oversettes ikke automatisk. Om det er nødvendig, avtaler vi med deg hvilket språk den videre kommunikasjonen skal foregå på.',
        },
        {
          question: 'Har rådgivningen allerede skjedd når forespørselen er sendt?',
          answer:
            'Nei. En innsendt forespørsel venter på vurdering hos en advokat. Det er ikke juridisk rådgivning, det er ingen bekreftet time, og innsendingen skaper i seg selv ikke et forhold mellom advokat og klient.',
        },
        {
          question: 'Hvordan beregnes kostnadene?',
          answer:
            'Først fastsettes arbeidsomfanget, deretter bekreftes beløp og beregningsmåte med deg før arbeidet begynner. Denne siden oppgir ingen tall og sier ikke at den første samtalen er uten betaling.',
        },
        {
          question: 'Hva hvis saken min er svært hastende?',
          answer:
            'Oppgi fristen eller datoen på en offisiell skrivelse øverst i sammendraget ditt, slik at opplysningene er synlige ved vurderingen. Denne siden har ingen nødlinje og lover ingen svartid; kan saken din ikke vente, bør du parallelt søke andre veier der du befinner deg.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PERSONVERN',
      title: 'Data som samles inn via kontaktskjemaet',
      description:
        'Hva kontaktskjemaet i denne norske delen samler inn, hvordan originalteksten behandles, og hvordan du når oss om opplysningene dine.',
      intro:
        'Denne delen gjelder bare kontaktskjemaet på disse veiledningssidene. Den beskriver hvordan opplysningene behandles, og er ikke et teknisk løfte.',
      sections: [
        {
          heading: 'Hvilke data som samles inn',
          paragraphs: [
            'Når du sender en forespørsel via skjemaet i denne delen, registreres følgende:',
          ],
          items: [
            'Navnet du oppgir',
            'E-postadressen for svaret',
            'Sidens visningsspråk ved sendingen',
            'Språket du skrev på',
            'Rådgivningsspråket du ønsker',
            'Originalteksten du skrev',
            'Samtykket ditt til å sende forespørselen',
            'Et mottaksnummer for å finne forespørselen igjen',
          ],
        },
        {
          heading: 'Originalteksten lagres uendret',
          paragraphs: [
            'Teksten din lagres nøyaktig slik du skrev den, og oversettes ikke automatisk. Trengs det en oversettelse for behandlingen, tar vi det opp særskilt med deg.',
            'Fordi originalteksten lagres, bør du i begynnelsen ikke skrive noe som ennå ikke trengs, for eksempel passnummer, identitetsnummer eller kontoopplysninger.',
          ],
        },
        {
          heading: 'Lagringssted og tilgang',
          paragraphs: [
            'Innholdet i det du sender, lagres på et sted som ikke er offentlig tilgjengelig. Bare autoriserte personer på kontoret får tilgang, og bare for å behandle forespørselen.',
            'Denne siden gir ingen absolutt sikkerhet. Ingen overføringsvei og ingen lagringsplass er helt trygg; sensitive dokumenter bør derfor bare sendes etter særskilt anvisning fra advokaten.',
          ],
        },
        {
          heading: 'Formålet med bruken',
          paragraphs: [
            'Opplysningene du sender inn, brukes til å vurdere forespørselen, gi deg tilbakemelding, avklare kommunikasjonsmåten og behandle saken dersom arbeidet tas opp.',
            'Opplysningene brukes ikke til markedsføring uten et særskilt samtykke.',
          ],
        },
        {
          heading: 'Underretning og mottaksnummer',
          paragraphs: [
            'Når en forespørsel blir sendt, varsler systemet kontoret. Er varselet ennå ikke bekreftet, blir teksten din liggende lagret og går ikke tapt.',
            'Mottaksnummeret brukes til å finne igjen forespørselen din i saksdokumentene våre. Det vises etter lagringen, og du kan oppgi det når du tar kontakt på nytt.',
          ],
        },
        {
          heading: 'Rettighetene dine og kontaktveien',
          paragraphs: [
            'Du kan be om innsyn, retting eller sletting av opplysningene dine, eller trekke tilbake samtykket, via e-postadressen som er oppgitt på kontaktsiden. Finnes det en lovpålagt eller prosessuell plikt til å oppbevare dem, forklarer vi begrensningen.',
            'Denne siden oppgir ingen fast oppbevaringsfrist, fordi den faktiske tiden avhenger av om saken føres videre, og av pliktene som følger av det. Ønsker du tidligere sletting, si fra når du tar kontakt.',
          ],
        },
        {
          heading: 'Lagringssted og leverandører',
          paragraphs: [
            'Dette nettstedet driftes hos Vercel, og det du sender inn, lagres i et ikke-offentlig lager hos denne tjenesten. E-post sendes via e-posttjenesten kontoret bruker.',
            'Enkelte leverandørers servere kan stå utenfor Taiwan, slik at opplysningene dine kan lagres og behandles der. Når formålet med lagringen er oppfylt, slettes opplysningene uten opphold; opplysninger som må oppbevares etter gjeldende regler, beholdes i den perioden. Henvendelser om personopplysninger tas imot på wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'FORBEHOLD',
      title: 'Omfang og grenser for opplysningene på denne siden',
      description:
        'Opplysningenes alminnelige karakter, det rettslige anvendelsesområdet og forutsetningene for et forhold mellom advokat og klient.',
      intro:
        'Denne delen gjør det klart hva disse norske veiledningssidene kan gjøre for deg, og hva de ikke kan.',
      sections: [
        {
          heading: 'Bare alminnelige opplysninger',
          paragraphs: [
            'Innholdet på disse sidene er skrevet som alminnelig informasjon. Det er ikke juridisk rådgivning i din sak, og det erstatter ikke en vurdering av dine egne dokumenter.',
            'Utfallet av en sak avhenger av fakta, av reglene som gjelder, og av tidspunktet; to tilsynelatende like situasjoner kan ende ulikt.',
          ],
        },
        {
          heading: 'Rettslig anvendelsesområde',
          paragraphs: [
            'Kontoret arbeider etter taiwansk rett, og denne siden handler bare om arbeid innenfor den rammen.',
            'Innholdet er ikke rådgivning etter retten i noen annen jurisdiksjon enn Taiwan, heller ikke retten der du bor. Berører en del av saken din en annen jurisdiksjon, avklarer vi med deg hvilken kvalifisert fagperson som trengs for den delen.',
          ],
        },
        {
          heading: 'Et forhold mellom advokat og klient oppstår ikke av seg selv',
          paragraphs: [
            'Å lese denne siden, å sende et skjema eller en e-post skaper i seg selv ikke et forhold mellom advokat og klient.',
            'Dette forholdet oppstår først etter at saken er vurdert, og begge sider har bekreftet at arbeidet tas opp.',
          ],
        },
        {
          heading: 'Intet løfte om resultat',
          paragraphs: [
            'Ingen del av denne siden er et løfte om resultatet av en sak, om innvilgelse av en søknad eller om oppholds- og arbeidsstatus.',
            'Eksterne lenker er til orientering; vi lover verken at innhold fra tredjeparter er riktig, eller at det er oppdatert.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTIKLER',
      title: 'Artikler om Taiwans rett',
      description:
        'Artikler på norsk om vanlige spørsmål i taiwansk rett. Innholdet er alminnelig informasjon på publiseringstidspunktet, ikke juridisk rådgivning i din sak.',
      intro:
        'Kontoret publiserer artikler om vanlige spørsmål i taiwansk rett. Artiklene som finnes på norsk, står på denne siden; i tillegg er det fire lenker som hver åpner artikkellisten for ett originalspråk.',
      sections: [
        {
          heading: 'Fire lister etter språk',
          paragraphs: [
            'Denne delen inneholder fire lenker: artikkellisten på koreansk, på kinesisk, på engelsk og på japansk. Hver lenke oppgir hvilket språk listen er på, slik at du på forhånd vet hvilket språk innholdet åpnes på.',
            'De fire listene er ordnet etter artiklenes originalspråk og er ikke oversettelseslister. Artiklene som finnes på norsk, står særskilt på denne siden.',
          ],
        },
        {
          heading: 'Hvor lenkene fører',
          paragraphs: [
            'Når du velger en av de fire lenkene, åpnes artikkellisten for det språket. Fra listen velger du selv teksten; hele innholdet vises på artikkelens originalspråk.',
            'Denne siden sammenfatter ikke innholdet i artiklene og lover ikke at et emne finnes på alle fire språkene. Hver liste inneholder bare tekster som er publisert på det språket.',
          ],
        },
        {
          heading: 'Hvor langt en artikkel kan tjene som orientering',
          paragraphs: [
            'Artiklene er alminnelige opplysninger på publiseringstidspunktet. Regler og praksis kan endre seg, og en artikkel dekker ikke alle omstendighetene i din sak.',
            'Ikke bygg en beslutning i en virkelig sak bare på en artikkel. Bruk den til å få oversikt, og drøft dine egne dokumenter særskilt med en advokat; denne siden er ikke et rådgivningsmøte.',
          ],
        },
      ],
    },
  },
};

export const finnishGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Suomi',
  nav: {
    home: 'Etusivu',
    services: 'Palvelut',
    about: 'Toimisto',
    lawyers: 'Asianajajat',
    pricing: 'Kulut',
    contact: 'Yhteys',
    faq: 'Kysymykset',
    privacy: 'Tietosuoja',
    disclaimer: 'Vastuuvapaus',
    columns: 'Artikkelit',
  },
  contactCta: 'Lähettäkää neuvontapyyntö',
  footerNotice:
    'Tämä suomenkielinen sivu sisältää vain yleisiä ohjeita toimiston työstä Taiwanin oikeuden mukaan. Se ei ole oikeudellista neuvontaa yksittäisessä asiassa, eikä viestin lähettäminen yksinään synnytä suhdetta asianajajan ja päämiehen välillä.',
  skipLink: 'Ohittakaa navigointi ja siirtykää sisältöön',
  menuLabel: 'Sivuhakemisto',
  languageLabel: 'Näyttökieli',
  mega: {
    services: {
      description: 'Toimisto käsittelee Taiwanin oikeuden mukaiset keskeiset työryhmät.',
      viewAllLabel: 'Näytä kaikki',
    },
    columns: {
      description: 'Artikkeleita Taiwanin oikeuden yleisistä kysymyksistä.',
      viewAllLabel: 'Näytä kaikki',
    },
    lawyers: {
      description: 'Esittely toimivista asianajajista ja yhteystavoista.',
      viewAllLabel: 'Näytä kaikki',
    },
    pricing: {
      description: 'Tämä sivu selittää työn laajuuden ja sen, miten kulut vahvistetaan.',
      viewAllLabel: 'Näytä kaikki',
    },
    faq: {
      description: 'Usein kysyttyä toimiston työstä Taiwanissa.',
      viewAllLabel: 'Näytä kaikki',
    },
  },
  notFoundTitle: 'Sivua ei löytynyt',
  notFoundText:
    'Etsittyä sivua ei ole tai se on siirretty. Voitte palata suomenkieliselle etusivulle nähdäksenne saatavilla olevat ohjeet.',
  backHomeLabel: 'Etusivulle',
  readSourceLabel: 'Avatkaa artikkeliluettelo alkuperäiskielellä',
  home: {
    heroScrollLabel: 'Vierittäkää alaspäin',
    heroColumnsCtaLabel: 'Katsokaa artikkelit',
    servicesDetailLabel: 'Katsokaa tiedot',
    servicesAssistanceBefore: 'Jos on epäselvää, mihin ryhmään asianne kuuluu, sivu ',
    servicesAssistanceLinkLabel: 'Yhteys',
    servicesAssistanceAfter:
      ' selittää, miten laaditte yhteenvedon, jonka asianajaja tarkistaa.',
    columnsViewAllLabel: 'Katsokaa kaikki artikkelit',
    columnsReadMoreLabel: 'Lukekaa lisää',
    columnsReviewLabel: 'Tarkistanut asianajaja Wei Tseng',
    columnsOriginalLanguageBadge: 'Alkuperäiskieli',
    columnsOriginalLanguageNote:
      'Seuraavia artikkeleita ei ole vielä suomeksi. Luettelo pysyy alkuperäiskielellä ja avaa kyseisen kielisivun; sisältöä ei käännetä automaattisesti.',
    imageBandAlt: 'Perinteinen taiwanilainen sanheyuan (三合院) ja nykyaikainen paviljonki päivänvalossa',
    videoPauseLabel: 'Keskeyttäkää video',
    videoPlayLabel: 'Toistakaa video',
    videoReplayLabel: 'Toistakaa video uudelleen',
  },
  pages: {
    home: {
      eyebrow: 'OHJEET',
      title: 'Oikeudelliset palvelut Taiwanissa — ohjeita suomeksi',
      description:
        'Yleisiä selityksiä suomeksi Hovering International Law Firm -toimiston työalasta Taiwanissa, neuvontakielistä ja ensimmäisestä yhteydenotosta.',
      intro:
        'Hovering International Law Firm seuraa ulkomaisia päämiehiä, myös Taiwanin yhteyden omaavia, Taiwanin oikeuden mukaisissa asioissa: sijoittaminen ja yhtiön perustaminen, siviiliriidat, avioliitto, perhe ja perintö, työlainsäädäntö, rikosasiat ja immateriaalioikeus. Tämä suomenkielinen osa auttaa teitä näkemään, mikä työ kuuluu alaamme, mitä on valmisteltava ja miten tavoitatte meidät. Kyse on yleisistä tiedoista, ei oikeudellisesta neuvonnasta omassa asiassanne.',
      sections: [
        {
          heading: 'Mitä teemme',
          paragraphs: [
            'Hovering International Law Firm on Taiwanissa perustettu asianajotoimisto. Se toimii Taiwanin oikeuden mukaan ja sillä on toimistot Taipeissa (臺北), Kaohsiungissa (高雄), Taichungissa (臺中) ja Pingtungissa (屏東). Neuvomme yrityksiä ja hoidamme menettelyjä tuomioistuimessa sekä seuraamme ulkomaisia päämiehiä Taiwanissa tarvittavissa vaiheissa.',
            'Koko sisältö täällä on yleistä. Asian tulos riippuu tosiseikoista, sovellettavista säännöistä ja ajankohdasta. Nämä ohjeet eivät korvaa keskustelua asianajajan kanssa asiakirjoistanne.',
          ],
        },
        {
          heading: 'Sivun kieli ja neuvontakieli eivät ole sama asia',
          paragraphs: [
            'Tämä sivu on kirjoitettu suomeksi, mutta neuvonta asianajajan kanssa tapahtuu vain neljällä neuvontakielellä: englanti, kiina (中文), japani ja korea. Ohjeiden lukeminen suomeksi ei tarkoita, että keskustelu asianajajan kanssa tapahtuisi suomeksi.',
            'Emme lupaa tulkkia, vastausaikaa emmekä tapaamista tämän sivun kautta. Jos ette voi käyttää mitään neljästä kielestä, sivu »Yhteys« selittää, miten tutkimme viestintätapaa.',
          ],
        },
        {
          heading: 'Työryhmät',
          paragraphs: [
            'Työalaan kuuluu seuraavat kuusi ryhmää. Sivu »Palvelut« kuvaa kunkin ryhmän tarkemmin ja kertoo, mitä ei luvata.',
          ],
          items: [
            'Sijoittaminen ja yhtiön perustaminen Taiwanissa',
            'Siviiliriidat ja vahingonkorvaus',
            'Avioliitto, perhe ja perintö',
            'Työoikeudelliset riidat',
            'Rikosasiat',
            'Immateriaalioikeus: tavaramerkit, patentit ja tekijänoikeus',
          ],
        },
        {
          heading: 'Mistä kannattaa aloittaa',
          paragraphs: [
            'Lukekaa sivu »Palvelut« nähdäksenne, kuuluuko asianne alaamme, sen jälkeen »Kulut« ja »Yhteys« tietääksenne, miten laajuus vahvistetaan ja miten kulut vahvistetaan ennen työn alkamista.',
            'Viestiä lähettäessänne voitte kirjoittaa yhteenvedon omalla kielellänne. Alkuperäinen teksti säilytetään sellaisena kuin kirjoititte sen, eikä sitä käännetä automaattisesti. Lähetetty viesti on tarkistusta odottava pyyntö: se ei ole vielä neuvontaa eikä vahvistettu tapaaminen.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'PALVELUT',
      title: 'Mitä asioita käsittelemme',
      description:
        'Kuusi työryhmää Taiwanin toimistossa ja rajat, jotka teidän on hyvä tuntea ensin.',
      intro:
        'Alla ryhmät, joita tosiasiassa käsittelemme, ja kysymykset, joita alkuvaiheessa usein esitetään. Esitys auttaa teitä arvioimaan, kuuluuko asianne alaamme; se on yleinen eikä yksittäisen asian oikeudellinen analyysi.',
      sections: [
        {
          heading: 'Sijoittaminen ja yhtiön perustaminen Taiwanissa',
          paragraphs: [
            'Seuraamme ulkomaisia sijoittajia ja yrityksiä yhtiön perustamisessa tai toiminnassa Taiwanissa: oikeudellisen muodon valinta, asiakirjojen valmistelu ja jättäminen, pääomansijoitus, pankkiasiat, toimitilan tarkastus sekä toimialavaatimukset. Tuemme myös kirjanpitoa ja veroja, jotka syntyvät perustamisesta ja toiminnasta Taiwanissa.',
            'Kulku ja kesto eroavat muodon, sijoittajan, toimialan, pankin ja jo olemassa olevien asiakirjojen mukaan. Yhtiön perustaminen ei yksin johda oleskelulupaan (居留) tai työlupaan (工作許可): ne ovat erillisiä menettelyjä, jotka arvioidaan henkilön tilanteen mukaan.',
          ],
        },
        {
          heading: 'Siviiliriidat ja vahingonkorvaus',
          paragraphs: [
            'Tähän ryhmään kuuluvat sopimusriidat, vahingonkorvaus oikeudenvastaisesta teosta ja kuluttajariidat. Työ alkaa yleensä aikajärjestyksellä, olemassa olevien asiakirjojen ja todisteiden tarkastuksella ja vasta sen jälkeen seuraavilla vaiheilla.',
            'Määräajat, myös vanhentuminen, ja todisteiden täydellisyys leimaavat kulkua. Ilmoittakaa siksi tunnetut päivämäärät mahdollisimman varhain. Säilyttäkää sopimukset, viestit, maksutositteet tai valokuvat paikan tilanteesta ja mainitkaa ne ensimmäisessä viestissä.',
          ],
        },
        {
          heading: 'Avioliitto, perhe ja perintö',
          paragraphs: [
            'Käsittelemme avioeroa (離婚), omaisuuden jakoa, oikeuksien ja velvollisuuksien käyttämistä ja kantamista alaikäisiä lapsia kohtaan (未成年子女權利義務之行使或負擔), tapaamista (會面交往) ja perintöä (繼承), myös kun osapuolet tai varallisuus ovat eri valtioissa. Rajat ylittävät perheasiat edellyttävät usein lisätarkastusta väestörekisteristä (戶籍), asiakirjojen muodosta ja niiden todistusarvosta Taiwanissa.',
            'Koska perheasioihin liittyy usein määräaikoja ja rinnakkaisia menettelyjä, ensimmäisen yhteenvedon tulisi nimetä osapuolten suhde, nykyinen asuinpaikka ja jo käynnissä olevat menettelyt.',
          ],
        },
        {
          heading: 'Työoikeudelliset riidat',
          paragraphs: [
            'Tähän ryhmään kuuluvat yhtymäsuhteen päättyminen, Taiwanin oikeuden mukainen irtisanomiskorvaus (資遣費; ei rinnastettavissa toisten valtioiden instituutteihin), palkka ja riidat työsopimuksesta (勞動契約), sekä työntekijän että työnantajan puolella. Tarkastuksessa erotamme päättämisperusteen ilmoitusta, maksua ja määräaikoja koskevista kysymyksistä.',
            'Työsopimus, työjärjestys (工作規則), palkkalaskelmat ja osapuolten kirjeenvaihto ovat yleensä ratkaisevat asiakirjat. Jos teillä on ne vielä, mainitkaa se yhteenvedossa.',
          ],
        },
        {
          heading: 'Rikosasiat',
          paragraphs: [
            'Seuraamme esitutkinnassa ja tuomioistuimessa, sekä epäiltyjen tai syytettyjen että asianomistajien puolesta, ja arvioimme yritystoiminnan rikosoikeudellisia riskejä.',
            'Rikosasioissa on usein lyhyet määräajat ja määrätyt vaiheet. Jos olette jo saaneet kirjoituksen syyttäjältä tai tuomioistuimelta, mainitkaa kirjoituksen päivämäärä varhain, jotta sisältö tarkistetaan oikeassa järjestyksessä.',
          ],
        },
        {
          heading: 'Immateriaalioikeus',
          paragraphs: [
            'Tuemme tavaramerkkien (商標) ja patenttien (專利) rekisteröinnissä, tekijänoikeudessa ja näitä oikeuksia koskevissa riidoissa Taiwanissa.',
            'Tässä ryhmässä vaiheiden järjestys ratkaisee: suojan laajuus, hakemusajankohta ja tosiasiallinen käyttö vaikuttavat valintaan. Hakemuksen jättäminen ei yksin merkitse, että se hyväksytään.',
          ],
        },
        {
          heading: 'Laajuus ja sen vahvistaminen',
          paragraphs: [
            'Toimisto toimii Taiwanin oikeuden mukaan ja käsittelee asioita edellä mainituissa ryhmissä. Kunkin asian laajuus vahvistetaan erikseen sen jälkeen, kun asianajaja on tarkistanut viestinne.',
            'Oleskeluasema, työlupa ja vastaavat kysymykset arvioidaan asiakirjoista ja henkilön tilanteesta, ei kansalaisuudesta. Jos osa asiastanne koskee tällaisia kysymyksiä, mainitkaa se yhteydenotossa. Tämä sivu ei lupaa tulosta eikä vastausaikaa.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'TOIMISTO',
      title: 'Hovering International Law Firmistä',
      description:
        'Perustiedot tästä taiwanilaisesta asianajotoimistosta, sen toimistoista ja työstä ulkomaisten osapuolten kanssa.',
      intro:
        'Hovering International Law Firm on asianajotoimisto Taiwanissa. Asianajajat toimivat yrityksen neuvonnasta oikeudenkäyntiin. Tämä osa kuvaa toimiston syntyä, paikkoja ja työtä ulkomaisten osapuolten kanssa.',
      sections: [
        {
          heading: 'Perustaminen ja rakentuminen',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) perustettiin vuonna 2016 asianajajien toimesta, jotka ovat opiskelleet National Taiwan Universityssa (國立臺灣大學). Kiinankielinen nimi 昊鼎 yhdistää merkin 昊 (»laaja taivas«) merkkiin 鼎 (»luja perusta«) ja kuvaa toimiston suuntaa perustamisesta lähtien.',
            'Meillä on toimistot Taipeissa (臺北), Kaohsiungissa (高雄), Taichungissa (臺中) ja Pingtungissa (屏東). Kaohsiungin toimisto keskittyy yrityksen johtamiseen ja käsittelee siviili-, rikos- ja hallinto-oikeudellisia riitoja. Taichungin toimisto käsittelee rakennusasioita, immateriaalioikeutta ja Korean ja Japanin yhteyden omaavia asioita. Pingtungin toimisto avattiin vuonna 2017 paikallista tarvetta varten.',
            'Asianajotyön rinnalla on vuodesta 2020 myös Hovering Accounting Office, joka tarjoaa kirjanpitoa ja verosuunnittelua yrittäjille ja varakkaille yksityishenkilöille.',
          ],
        },
        {
          heading: 'Työ ulkomaisten osapuolten kanssa',
          paragraphs: [
            'Rajat ylittävään työhön kuuluvat yhtiön perustaminen, viisumit, tavaramerkki- ja patenttihakemukset, oikeudellinen riskitarkastus ja yritysten veroneuvonta. Taichungin toimisto käsittelee erityisesti rakennusasioita, immateriaalioikeutta ja Korean ja Japanin yhteyden omaavia asioita. Asianajaja Wei Tseng (曾雋崴) seuraa päämiehiä Koreasta, Japanista ja muita kansainvälisiä päämiehiä mainituissa ryhmissä.',
            'Voimmeko ottaa asian, riippuu sisällöstä ja viestinnän kielestä. Jos asianne kuuluu mainittuihin ryhmiin ja sitä voidaan käsitellä yhdellä neljästä neuvontakielestä, voitte lähettää yhteenvedon tarkistettavaksi.',
          ],
        },
        {
          heading: 'Kun otatte meihin yhteyttä',
          paragraphs: [
            'Kun yhteenvedonne on saapunut, asianajaja tarkistaa sisällön ja puhuu sitten mahdollisesta työn laajuudesta, vielä tarvittavista asiakirjoista ja seuraavista vaiheista. Vero- tai kirjanpitokysymyksissä toimisto voi työskennellä kirjanpito-osaston kanssa yhdessä kulussa.',
            'Kunkin asian tulos riippuu tosiseikoista ja olemassa olevista asiakirjoista; emme lupaa tulosta. Jos tarvitsette sitovan vastauksen tilanteeseenne, asiakirjat on käsiteltävä asianajajan kanssa yhdellä neljästä neuvontakielestä.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ASIANAJAJAT',
      title: 'Hoveringin kansainvälinen tiimi',
      description: 'Hoveringin asianajajien, operatiivisen johdon ja kumppanitilintarkastuksen profiilit.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'KULUT',
      title: 'Miten työn laajuus ja kulut vahvistetaan',
      description:
        'Selitys järjestyksestä: ensin työn laajuus, sitten kulujen vahvistaminen, ja miksi tällä sivulla ei ole hinnastoa.',
      intro:
        'Tämä sivu selittää, miten kulut vahvistetaan, ei niiden määrää. Määrä riippuu yksittäisen asian työn laajuudesta ja on mielekäs vasta, kun tuo laajuus on selvä.',
      sections: [
        {
          heading: 'Ensin vahvistetaan työn laajuus',
          paragraphs: [
            'Samanlaisissa asioissa työmäärä voi olla hyvin erilainen osapuolten määrän, käytettävissä olevien asiakirjojen, noudatettavien määräaikojen ja sen mukaan, onko menettely jo alkanut. Siksi ensimmäinen vaihe on aina vahvistaa, mikä kuuluu työhön ja mikä ei.',
            'Yhteenveto, jonka lähetätte alussa, on tämän laajuuden perusta. Mitä selkeämmin se kuvaa kulkua, pyyntöänne ja määräaikoja, sitä tarkemmin laajuus voidaan määrätä.',
          ],
        },
        {
          heading: 'Kulut vahvistetaan ennen työn alkamista',
          paragraphs: [
            'Kun työn laajuus on selvä, määrästä ja laskentatavasta keskustellaan teidän kanssanne ja ne vahvistetaan ennen työn alkamista. Jos laajuus muuttuu matkan varrella, se on vahvistettava uudelleen.',
            'Tämä sivu ei ole tarjous hinnasta eikä synnytä maksuvelvollisuutta.',
          ],
        },
        {
          heading: 'Neuvonta voi olla maksullinen',
          paragraphs: [
            'Neuvonta asianajajan kanssa voi olla maksullinen suoritus. Tämä sivu ei sano, että ensimmäinen keskustelu olisi maksuton, eikä mitään osaa saa lukea niin.',
            'Jos neuvonta on maksullinen, määrä ja maksutapa ilmoitetaan ennen sen tapahtumista.',
          ],
        },
        {
          heading: 'Miksi tällä sivulla ei ole taksoja',
          paragraphs: [
            'Kulut riippuvat asiasta itsestään: työmäärästä, osapuolten määrästä, asiakirjoista, määräajoista ja siitä, onko menettely jo käynnissä. Ennakolta asetettu luku ei näyttäisi kuluja asiassanne. Siksi vahvistamme ensin työn laajuuden ja ilmoitamme teille sitten kulut, ennen kuin työ alkaa.',
            'Asianajopalkkion lisäksi voi syntyä tuomioistuin-, viranomais- tai kolmannen osapuolen kuluja. Ne ovat erillisiä palkkiosta ja riippuvat kyseisestä menettelystä.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'YHTEYS',
      title: 'Miten tavoitatte toimiston',
      description:
        'Sivun kieli, neuvontakielet, menettely, jos ette voi käyttää mitään neljästä kielestä, ja mitä tämä sivu ei lupaa.',
      intro:
        'Ennen kuin kirjoitatte meille, erottakaa seuraavat kolme seikkaa. Ne sekoitetaan usein, mutta merkitsevät eri asioita.',
      sections: [
        {
          heading: 'Kolme asiaa, jotka on pidettävä erillään',
          paragraphs: [
            'Sivun näyttökieli, neuvontakieli asianajajan kanssa ja kieli, jolla kirjoitatte, ovat kolme erillistä asiaa.',
          ],
          items: [
            'Sivun kieli: Nämä ohjeet on kirjoitettu suomeksi.',
            'Neuvontakieli: Neuvonta tapahtuu englanniksi, kiinaksi (中文), japaniksi ja koreaksi.',
            'Kirjoituskielenne: Voitte kirjoittaa yhteenvedon omalla kielellänne; alkuperäinen teksti säilytetään muuttamattomana.',
          ],
        },
        {
          heading: 'Jos ette voi käyttää mitään neljästä neuvontakielestä',
          paragraphs: [
            'Yhteydenottolomakkeessa voitte valita »Viestintätapa on vahvistettava«. Vastaamme tutkiaksemme käyttökelpoisen viestintätavan, jos sellainen on; suoritusta muulla kielellä ei luvata eikä vastausaikaa luvata.',
            'Tämä on vain tutkimisvaihe, ei lupaus. Emme lupaa tulkkia, emme suoritusta suomeksi tai muulla kielellä neljän mainitun kielen ulkopuolella, emmekä sitä, että otamme vastaan jokaista asiaa.',
          ],
        },
        {
          heading: 'Mitä ensimmäisessä viestissä tulisi olla',
          paragraphs: [
            'Ilmoittakaa, mitä on tapahtunut, millaista apua tarvitsette, mikä yhteys asialla on Taiwaniin, ja määräaika, jos tunnette sen. Jos olette jo saaneet kirjoituksen tuomioistuimelta tai viranomaiselta, mainitkaa kirjoituksen päivämäärä.',
            'Alkuvaiheessa teidän ei vielä tarvitse lähettää passinumeroa, henkilötunnusta, tilitietoja, sairauskertomuksia tai koko todistusaineistoa. Odottakaa asianajajan ohjeita ja lähettäkää sitten arkaluonteiset asiakirjat turvallista tietä.',
          ],
        },
        {
          heading: 'Mitä tämä sivu ei lupaa',
          paragraphs: [
            'Emme lupaa vastausaikaa, emme vahvista tapaamista tämän sivun kautta, emme lupaa tiettyä asianajajaa emmekä järjestä tulkkia. Kirjallinen käännös on eri asia: viestiänne ei käännetä automaattisesti.',
            'Kun lähetätte pyynnön, sisältö säilytetään ja odottaa tarkistusta. Jos ette jonkin ajan kuluttua saa vastausta, voitte kirjoittaa uudelleen yhteyssivulla ilmoitettuun sähköpostiosoitteeseen.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'KYSYMYKSET',
      title: 'Usein kysytyt kysymykset',
      description:
        'Selityksiä työalasta, valmistelusta, kielistä, kuluista ja lähetetyn pyynnön merkityksestä.',
      intro:
        'Seuraaviin kysymyksiin vastataan yleisten tietojen tasolla. Vastaus omaan asiaanne on mahdollinen vasta sen jälkeen, kun asianajaja on tarkistanut asiakirjat.',
      sections: [
        {
          heading: 'Miten käytätte tätä osaa',
          paragraphs: [
            'Jos ette löydä vastausta tilanteeseenne, vastaus riippuu yleensä erityisistä tosiseikoista. Kirjoittakaa nämä tosiseikat yhteenvetoon sen sijaan, että johtaisitte ne itse tältä sivulta.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Mitä asioita toimisto käsittelee?',
          answer:
            'Käsittelemme kuutta ryhmää: sijoittaminen ja yhtiön perustaminen Taiwanissa, siviiliriidat ja vahingonkorvaus, avioliitto, perhe ja perintö, työoikeudelliset riidat, rikosasiat ja immateriaalioikeus. Otetaanko asia vastaan, ratkeaa sisällön tarkistuksen jälkeen.',
        },
        {
          question: 'Mitä minun tulisi valmistella ennen yhteydenottoa?',
          answer:
            'Valmistakaa lyhyt yhteenveto kulusta, pyynnöstänne, Taiwan-yhteydestä ja määräajasta, jos sellainen on. Jos tuomioistuimen tai viranomaisen kirjoitus on jo olemassa, mainitkaa päivämäärä. Tässä vaiheessa teidän ei vielä tarvitse lähettää henkilöllisyysasiakirjoja tai koko todistusaineistoa.',
        },
        {
          question: 'Voinko saada neuvontaa suomeksi?',
          answer:
            'Ei. Nämä ohjeet on kirjoitettu suomeksi, mutta neuvonta asianajajan kanssa tapahtuu vain englanniksi, kiinaksi (中文), japaniksi ja koreaksi. Emme lupaa tulkkiakaan. Kirjallinen käännös on eri asia: alkuperäinen teksti, jonka kirjoitatte, säilytetään sellaisenaan eikä sitä käännetä automaattisesti.',
        },
        {
          question: 'Entä jos en voi käyttää mitään neljästä kielestä?',
          answer:
            'Valitkaa lähettäessä »Viestintätapa on vahvistettava«. Vastaamme tutkiaksemme viestintätapaa, mutta suoritusta muulla kielellä ei luvata. Tämä on tutkimisvaihe, ei lupaus siitä, että voimme työskennellä muulla kielellä.',
        },
        {
          question: 'Miten suomenkielistä tekstiäni käsitellään?',
          answer:
            'Alkuperäinen teksti, jonka kirjoitatte, säilytetään sellaisenaan eikä sitä käännetä automaattisesti. Tarvittaessa jatkoviestinnän kieli vahvistetaan teidän kanssanne.',
        },
        {
          question: 'Onko neuvonta jo tapahtunut, kun pyyntö on lähetetty?',
          answer:
            'Ei. Lähetetty pyyntö odottaa asianajajan tarkistusta. Se ei ole oikeudellinen neuvo, ei vahvistettu tapaaminen, eikä lähettäminen yksinään synnytä suhdetta asianajajan ja päämiehen välillä.',
        },
        {
          question: 'Miten kulut lasketaan?',
          answer:
            'Ensin vahvistetaan työn laajuus, sen jälkeen määrä ja laskentatapa vahvistetaan teidän kanssanne ennen työn alkamista. Tämä sivu ei ilmoita lukuja eikä sano, että ensimmäinen keskustelu olisi maksuton.',
        },
        {
          question: 'Entä jos asiani on hyvin kiireellinen?',
          answer:
            'Ilmoittakaa määräaika tai virallisen kirjoituksen päivämäärä yhteenvedon alussa, jotta nämä tiedot näkyvät tarkistuksessa. Tällä sivulla ei ole hätäkanavaa eikä se lupaa vastausaikaa; jos asianne ei voi odottaa, teidän tulisi rinnakkain etsiä muita teitä paikkakunnallanne.',
        },
      ],
    },
    privacy: {
      eyebrow: 'TIETOSUOJA',
      title: 'Yhteydenottolomakkeella kerättävät tiedot',
      description:
        'Mitä yhteydenottolomake tässä suomenkielisessä osassa kerää, miten alkuperäinen teksti käsitellään ja miten tavoitatte meidät tietojanne koskien.',
      intro:
        'Tämä osa koskee vain näiden ohjesivujen yhteydenottolomaketta. Se kuvaa tietojen käsittelyä, ei teknistä lupausta.',
      sections: [
        {
          heading: 'Mitä tietoja kerätään',
          paragraphs: [
            'Kun lähetätte pyynnön tämän osan lomakkeella, merkitään seuraavat tiedot:',
          ],
          items: [
            'Ilmoittamanne nimi',
            'Sähköpostiosoite vastausta varten',
            'Sivun näyttökieli lähettäessä',
            'Kieli, jolla kirjoititte',
            'Toivomanne neuvontakieli',
            'Alkuperäinen teksti, jonka kirjoititte',
            'Suostumuksenne pyynnön lähettämiseen',
            'Vastaanottonumero pyynnön löytämiseksi',
          ],
        },
        {
          heading: 'Alkuperäinen teksti säilytetään muuttamattomana',
          paragraphs: [
            'Tekstinne säilytetään juuri sellaisena kuin kirjoititte sen, eikä sitä käännetä automaattisesti. Jos käännös on tarpeen käsittelyä varten, se otetaan esiin erikseen teidän kanssanne.',
            'Koska alkuperäinen teksti säilytetään, älkää alkuvaiheessa kirjoittako sellaista, mitä ei vielä tarvita, esimerkiksi passinumeroa, henkilötunnusta tai tilitietoja.',
          ],
        },
        {
          heading: 'Säilytyspaikka ja pääsy',
          paragraphs: [
            'Lähetyksenne sisältö säilytetään paikassa, joka ei ole julkisesti saatavilla. Vain toimiston valtuutetut henkilöt saavat käyttää sitä pyynnön käsittelemiseksi.',
            'Tämä sivu ei anna ehdotonta turvallisuuslupausta. Mikään siirtotie eikä mikään säilytyspaikka ole täysin turvallinen; arkaluonteiset asiakirjat tulisi siksi lähettää vain asianajajan erityisen ohjeen jälkeen.',
          ],
        },
        {
          heading: 'Käytön tarkoitus',
          paragraphs: [
            'Lähetetyt tiedot palvelevat pyynnön tarkistusta, palautetta teille, viestintätavan selvittämistä ja käsittelyä, jos työ otetaan vastaan.',
            'Tietoja ei käytetä markkinointiin ilman erillistä suostumusta.',
          ],
        },
        {
          heading: 'Ilmoitus ja vastaanottonumero',
          paragraphs: [
            'Jos pyyntö lähetetään onnistuneesti, järjestelmä ilmoittaa toimistolle. Jos tätä ilmoitusta ei ole vielä vahvistettu, tekstinne jää säilytetyksi eikä katoa.',
            'Vastaanottonumero palvelee pyyntönne löytämistä asiakirjoistamme. Se näytetään säilytyksen jälkeen; voitte ilmoittaa sen uudessa yhteydenotossa.',
          ],
        },
        {
          heading: 'Oikeutenne ja yhteystie',
          paragraphs: [
            'Voitte pyytää tietojenne tarkastusta, oikaisua tai poistamista tai peruuttaa suostumuksen yhteyssivulla ilmoitetun sähköpostiosoitteen kautta. Jos on lakisääteinen tai menettelyyn liittyvä säilytysvelvollisuus, selitämme rajoituksen.',
            'Tämä sivu ei ilmoita kiinteää säilytysaikaa, koska tosiasiallinen kesto riippuu siitä, jatketaanko asiaa, ja siihen liittyvistä velvollisuuksista. Jos toivotte aikaisempaa poistoa, ilmoittakaa se yhteydenotossa.',
          ],
        },
        {
          heading: 'Säilytyspaikka ja palveluntarjoajat',
          paragraphs: [
            'Tätä sivustoa isännöi Vercel, ja lähetyksenne säilytetään tämän palvelun ei-julkisessa objektivarastossa. Sähköpostit lähetetään toimiston käyttämän sähköpostipalvelun kautta.',
            'Yksittäisten palveluntarjoajien palvelimet voivat sijaita Taiwanin ulkopuolella, joten tietojanne voidaan säilyttää ja käsitellä siellä. Kun säilytystarkoitus on täytetty, tiedot poistetaan viivytyksettä; tiedot, jotka on säilytettävä sovellettavien sääntöjen mukaan, jäävät siksi ajaksi. Henkilötietopyynnöt ottaa vastaan wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'VASTUUVAPAUS',
      title: 'Tämän sivun tietojen laajuus ja rajat',
      description:
        'Tietojen yleinen luonne, oikeudellinen soveltamisala ja edellytykset suhteelle asianajajan ja päämiehen välillä.',
      intro:
        'Tämä osa tekee selväksi, mitä nämä suomenkieliset ohjesivut voivat tehdä teille ja mitä eivät.',
      sections: [
        {
          heading: 'Vain yleisiä tietoja',
          paragraphs: [
            'Näiden sivujen sisältö on kirjoitettu yleisenä tietona. Se ei ole oikeudellista neuvontaa asiassanne eikä korvaa omien asiakirjojenne tarkastusta.',
            'Asian tulos riippuu tosiseikoista, sovellettavista säännöistä ja ajankohdasta; kaksi näennäisesti samanlaista tilannetta voi päättyä eri tavoin.',
          ],
        },
        {
          heading: 'Oikeudellinen soveltamisala',
          paragraphs: [
            'Toimisto harjoittaa ammattia Taiwanin oikeuden mukaan, ja tämä sivu puhuu vain työstä tässä kehyksessä.',
            'Sisältö ei ole neuvontaa muun oikeusjärjestyksen kuin Taiwanin mukaan, mukaan lukien asuinpaikkanne oikeus. Jos osa asiastanne koskee toista oikeusjärjestystä, selvitämme teidän kanssanne, mikä pätevä asiantuntija tarvitaan siihen osaan.',
          ],
        },
        {
          heading: 'Suhde asianajajan ja päämiehen välillä ei synny itsestään',
          paragraphs: [
            'Tämän sivun lukeminen, lomakkeen tai sähköpostin lähettäminen ei yksinään synnytä suhdetta asianajajan ja päämiehen välillä.',
            'Tämä suhde syntyy vasta sen jälkeen, kun asia on tarkistettu ja molemmat osapuolet ovat vahvistaneet työn vastaanottamisen.',
          ],
        },
        {
          heading: 'Ei lupausta tuloksesta',
          paragraphs: [
            'Mikään osa tästä sivusta ei ole lupaus asian tuloksesta, hakemuksen hyväksymisestä tai oleskelu- ja työasemasta.',
            'Ulkoiset linkit palvelevat suuntautumista; emme lupaa kolmansien sisältöjen oikeellisuutta emmekä ajantasaisuutta.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTIKKELIT',
      title: 'Artikkeleita Taiwanin oikeudesta',
      description:
        'Suomenkielisiä artikkeleita Taiwanin oikeuden yleisistä kysymyksistä. Sisältö on yleistä tietoa julkaisuajankohtana, ei oikeudellista neuvontaa asiassanne.',
      intro:
        'Toimisto julkaisee artikkeleita Taiwanin oikeuden yleisistä kysymyksistä. Suomenkieliset artikkelit ovat tällä sivulla; lisäksi on neljä linkkiä, joista kukin avaa yhden alkuperäiskielen artikkeliluettelon.',
      sections: [
        {
          heading: 'Neljä luetteloa kielen mukaan',
          paragraphs: [
            'Tässä osassa on neljä linkkiä: artikkeliluettelo koreaksi, kiinaksi, englanniksi ja japaniksi. Kukin linkki ilmoittaa luettelon kielen, jotta tiedätte etukäteen, millä kielellä sisältö avautuu.',
            'Nämä neljä luetteloa ovat luetteloita artikkeleiden alkuperäiskielen mukaan, eivät käännösluetteloita. Suomenkieliset artikkelit ovat erikseen tällä sivulla.',
          ],
        },
        {
          heading: 'Mihin linkit johtavat',
          paragraphs: [
            'Kun valitsette yhden neljästä linkistä, kyseisen kielen artikkeliluettelo avautuu. Luettelosta valitsette itse tekstin; koko sisältö näkyy artikkelin alkuperäiskielellä.',
            'Tämä sivu ei tiivistä artikkeleiden sisältöä eikä lupaa, että aihe on saatavilla kaikilla neljällä kielellä. Kukin luettelo sisältää vain tekstejä, jotka on julkaistu sillä kielellä.',
          ],
        },
        {
          heading: 'Mihin asti artikkeli voi palvella suuntautumisena',
          paragraphs: [
            'Artikkelit ovat yleisiä tietoja julkaisuajankohtana. Säännöt ja niiden soveltaminen voivat muuttua, eikä artikkeli sisällä kaikkia asianne olosuhteita.',
            'Älkää siksi perustako toimea todellisessa asiassa yksin artikkeliin. Käyttäkää sitä yleiskuvaan ja keskustelkaa asiakirjoistanne erikseen asianajajan kanssa; tämä sivu ei ole neuvontavaihe.',
          ],
        },
      ],
    },
  },
};

