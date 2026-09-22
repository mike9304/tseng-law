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
    disclaimer: 'Friskrivning',
    columns: 'Artiklar',
  },
  contactCta: 'Skicka en begäran om rådgivning',
  footerNotice:
    'Den här sidan på svenska ger bara allmän vägledning om byråns arbete enligt Taiwans rätt. Den är inte juridisk rådgivning för ett konkret ärende, och att skicka ett meddelande skapar i sig inte ett förhållande mellan advokat och klient.',
  skipLink: 'Hoppa över navigeringen och gå till innehållet',
  menuLabel: 'Meny',
  languageLabel: 'Visningsspråk',
  mega: {
    services: {
      description: 'Byrån arbetar inom de centrala verksamhetsområdena enligt Taiwans rätt.',
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
    'Den sökta sidan finns inte eller har flyttats. Du kan gå tillbaka till startsidan på svenska för att se den vägledning som finns.',
  backHomeLabel: 'Till startsidan',
  readSourceLabel: 'Öppna artikellistan på originalspråket',
  home: {
    heroScrollLabel: 'Rulla nedåt',
    heroColumnsCtaLabel: 'Se artiklarna',
    servicesDetailLabel: 'Se detaljerna',
    servicesAssistanceBefore: 'Om det är oklart vilket område ditt ärende hör till förklarar sidan ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter:
      ' hur du formulerar en sammanfattning som en advokat granskar.',
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
      eyebrow: 'VÄGLEDNING',
      title: 'Juridiska tjänster i Taiwan — vägledning på svenska',
      description:
        'Allmänna förklaringar på svenska om Hovering International Law Firms arbetsområde i Taiwan, rådgivningsspråken och den första kontakten.',
      intro:
        'Hovering International Law Firm biträder klienter från utlandet i frågor enligt Taiwans rätt: investering och bolagsbildning, civilrättsliga tvister, äktenskap, familj och arv, arbetsrätt, straffrätt och immaterialrätt. Den här svenska delen hjälper dig att se vilket arbete som ligger inom vårt område, vad du bör förbereda och hur du når oss. Det är allmän information, inte juridisk rådgivning för ditt eget ärende.',
      sections: [
        {
          heading: 'Vad vi gör',
          paragraphs: [
            'Hovering International Law Firm är en advokatbyrå etablerad i Taiwan. Den arbetar enligt Taiwans rätt och har kontor i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) och Pingtung (屏東). Vi ger råd till företag, för talan i domstol och lotsar klienter från utlandet genom de steg som krävs i Taiwan.',
            'Hela innehållet här är allmänt. Utgången av ett ärende beror på fakta, tillämpliga regler och tidpunkten. Den här vägledningen ersätter inte ett samtal med en advokat om dina handlingar.',
          ],
        },
        {
          heading: 'Sidans språk och rådgivningsspråket är inte samma sak',
          paragraphs: [
            'Den här sidan är skriven på svenska, men rådgivningen med en advokat sker endast på de fyra rådgivningsspråken engelska, kinesiska (中文), japanska och koreanska. Att läsa vägledningen på svenska betyder inte att samtalet med advokaten sker på svenska.',
            'Vi lovar varken en tolk, en svarstid eller en bokad tid via den här sidan. Om du inte kan använda något av de fyra språken förklarar sidan ”Kontakt” hur vi undersöker en möjlig kommunikationsväg.',
          ],
        },
        {
          heading: 'Verksamhetsområden',
          paragraphs: [
            'Arbetet omfattar följande sex områden. Sidan ”Tjänster” beskriver varje område närmare och anger vad som inte utlovas.',
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
          heading: 'Var du bör börja',
          paragraphs: [
            'Läs sidan ”Tjänster” för att se om ditt ärende ligger inom vårt område, därefter ”Kostnader” och ”Kontakt” för att se hur omfattningen fastställs och hur kostnaderna bekräftas innan arbetet börjar.',
            'När du skickar ett meddelande får du skriva sammanfattningen på ditt eget språk. Originaltexten sparas som du skrev den och översätts inte automatiskt. Ett skickat meddelande är en begäran som väntar på granskning: det är ännu inte rådgivning och inte en bekräftad tid.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'TJÄNSTER',
      title: 'Vilka ärenden vi behandlar',
      description:
        'Sex verksamhetsområden hos byrån i Taiwan och de gränser du först bör känna till.',
      intro:
        'Nedan följer de områden vi faktiskt arbetar med och frågor som ofta ställs i inledningen. Framställningen hjälper dig att bedöma om ditt ärende ligger inom vårt område; den är allmän och inte en juridisk analys av ett enskilt ärende.',
      sections: [
        {
          heading: 'Investering och bolagsbildning i Taiwan',
          paragraphs: [
            'Vi biträder utländska investerare och företag vid bildande eller drift av ett bolag i Taiwan: val av rättsform, förberedelse och ingivande av handlingar, kapitalinsats, bankfrågor, prövning av lokalen samt branschkrav. Vi hjälper också till med bokföring och skatt som följer av bildande och drift i Taiwan.',
            'Förlopp och tid skiljer sig åt beroende på bolagsform, investerare, bransch, bank och vilka handlingar som redan finns. En bolagsbildning leder inte av sig själv till uppehållstillstånd (居留) eller arbetstillstånd (工作許可): det är skilda förfaranden som bedöms utifrån personens situation.',
          ],
        },
        {
          heading: 'Civilrättsliga tvister och skadestånd',
          paragraphs: [
            'Det här området omfattar avtalstvister, utomobligatoriskt skadestånd och konsumenttvister. Arbetet börjar i regel med en kronologi och en genomgång av befintliga handlingar och bevis, och först därefter tas nästa steg.',
            'Frister, inbegripet preskription, och hur fullständig bevisningen är präglar förloppet. Ange därför kända datum så tidigt som möjligt. Spara avtal, meddelanden, betalningskvitton eller foton från platsen och nämn dem i det första meddelandet.',
          ],
        },
        {
          heading: 'Äktenskap, familj och arv',
          paragraphs: [
            'Vi behandlar skilsmässa (離婚), bodelning, vårdnad och föräldraansvar för minderåriga barn (未成年子女權利義務之行使或負擔), umgänge (會面交往) och arv (繼承), även när parter eller tillgångar finns i olika stater. Gränsöverskridande familjeärenden kräver ofta ytterligare prövning av hushållsregistreringen (戶籍), handlingars form och deras bevisvärde i Taiwan.',
            'Eftersom familjeärenden ofta medför frister och parallella förfaranden bör den första sammanfattningen ange parternas relation, var de bor nu och vilka förfaranden som redan pågår.',
          ],
        },
        {
          heading: 'Arbetsrättsliga tvister',
          paragraphs: [
            'Det här området omfattar upphörande av anställning, ersättning vid arbetsgivarens uppsägning enligt Taiwans rätt (資遣費; inte detsamma som avgångsvederlag eller uppsägningsskydd enligt andra länders rätt), lön och tvister om anställningsavtalet (勞動契約), både på arbetstagar- och arbetsgivarsidan. Vid prövningen skiljer vi uppsägningsgrunden från frågor om underrättelse, betalning och frister.',
            'Anställningsavtal, arbetsreglemente (工作規則), lönebesked och parternas skriftväxling är oftast de avgörande handlingarna. Om du fortfarande har dem, nämn det i sammanfattningen.',
          ],
        },
        {
          heading: 'Straffrättsliga frågor',
          paragraphs: [
            'Vi biträder misstänkta, tilltalade och målsägande under förundersökning och i domstol, och bedömer straffrättsliga risker i företagsverksamhet.',
            'Straffrättsliga ärenden har ofta korta frister och fasta steg. Om du redan har fått en skrivelse från åklagare eller domstol, nämn datumet på skrivelsen tidigt så att innehållet kan prövas i rätt ordning.',
          ],
        },
        {
          heading: 'Immaterialrätt',
          paragraphs: [
            'Vi hjälper till vid registrering av varumärken (商標) och patent (專利), i upphovsrättsliga frågor och vid tvister om dessa rättigheter i Taiwan.',
            'Inom det här området är ordningen på stegen avgörande: skyddsomfång, tidpunkt för ansökan och faktisk användning påverkar valet. Att ge in en ansökan betyder inte i sig att den beviljas.',
          ],
        },
        {
          heading: 'Omfattning och dess bekräftelse',
          paragraphs: [
            'Byrån arbetar enligt Taiwans rätt och tar ärenden inom de områden som nämns ovan. Omfattningen av varje ärende bekräftas särskilt efter att en advokat har granskat ditt meddelande.',
            'Uppehållsstatus, arbetstillstånd och liknande frågor bedöms utifrån handlingarna och personens situation, inte utifrån medborgarskapet. Om en del av ditt ärende rör sådana frågor, nämn det vid kontakten. Den här sidan lovar varken ett resultat eller en svarstid.',
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
        'Hovering International Law Firm är en advokatbyrå i Taiwan. Advokaterna arbetar med allt från affärsjuridisk rådgivning till processer i domstol. Den här delen beskriver byråns bakgrund, orterna och arbetet med utländska parter.',
      sections: [
        {
          heading: 'Grundande och uppbyggnad',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) grundades 2016 av advokater som studerat vid National Taiwan University (國立臺灣大學). Det kinesiska namnet 昊鼎 förenar tecknet 昊 (”den vida himlen”) med 鼎 (”fast grund”) och beskriver byråns inriktning sedan grundandet.',
            'Vi har kontor i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) och Pingtung (屏東). Kontoret i Kaohsiung är inriktat på företagsledning och behandlar civil-, straff- och förvaltningsrättsliga tvister. Kontoret i Taichung behandlar byggärenden, immaterialrätt och ärenden med anknytning till Korea och Japan. Kontoret i Pingtung öppnades 2017 för det lokala behovet.',
            'Vid sidan av advokatverksamheten finns sedan 2020 också Hovering Accounting Office, som erbjuder bokföring och skatteplanering för företagare och förmögna privatpersoner.',
          ],
        },
        {
          heading: 'Arbete med utländska parter',
          paragraphs: [
            'Det gränsöverskridande arbetet omfattar bolagsbildning, visum, varumärkes- och patentansökningar, juridisk riskprövning och skatterådgivning för företag. Kontoret i Taichung behandlar särskilt byggärenden, immaterialrätt och ärenden med anknytning till Korea och Japan. Advokat Wei Tseng (曾雋崴) biträder klienter från Korea och Japan samt andra internationella klienter inom de områden som nämns ovan.',
            'Om vi kan ta ett ärende beror på innehållet och på vilket språk kommunikationen sker. Ligger ditt ärende inom de områden som nämns ovan och kan det diskuteras på ett av de fyra rådgivningsspråken, kan du skicka en sammanfattning för granskning.',
          ],
        },
        {
          heading: 'När du kontaktar oss',
          paragraphs: [
            'När din sammanfattning har kommit in granskar en advokat innehållet och går därefter igenom möjlig arbetsomfattning, vilka handlingar som ännu behövs och nästa steg. Vid skatte- eller bokföringsfrågor kan byrån arbeta tillsammans med redovisningsavdelningen i ett och samma ärende.',
            'Resultatet i varje ärende beror på fakta och på de handlingar som finns; vi lovar inget resultat. Om du behöver ett bindande svar för din situation måste handlingarna gås igenom med en advokat på ett av de fyra rådgivningsspråken.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKATER',
      title: 'Hoverings internationella team',
      description: 'Profiler för Hoverings advokater, operativ ledning för Korea och anknuten revisionsbyrå.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'KOSTNADER',
      title: 'Hur arbetsomfattning och kostnader fastställs',
      description:
        'Förklaring av ordningen: först arbetsomfattningen, därefter kostnadsbekräftelsen, och varför den här sidan inte innehåller en prislista.',
      intro:
        'Den här sidan förklarar hur kostnaderna fastställs, inte hur stora de blir. Beloppet beror på arbetets omfattning i det enskilda ärendet och går att ange först när omfattningen är klar.',
      sections: [
        {
          heading: 'Först fastställs arbetsomfattningen',
          paragraphs: [
            'Ärenden av samma slag kan kräva en mycket olika stor arbetsinsats, beroende på antalet parter, vilka handlingar som finns, vilka frister som ska hållas och om ett förfarande redan har inletts. Därför är det första steget alltid att bestämma vad som hör till uppdraget och vad som inte gör det.',
            'Sammanfattningen du skickar i början är grunden för omfattningen. Ju tydligare den beskriver förloppet, vad du vill ha hjälp med och fristerna, desto mer exakt kan omfattningen bestämmas.',
          ],
        },
        {
          heading: 'Kostnaderna bekräftas innan arbetet börjar',
          paragraphs: [
            'När arbetets omfattning är klar går vi igenom belopp och beräkningssätt med dig och bekräftar dem innan arbetet börjar. Ändras omfattningen under arbetets gång måste det bekräftas på nytt.',
            'Den här sidan är inte en offert och medför ingen betalningsskyldighet. Att skicka en begäran via den här sidan är också kostnadsfritt.',
          ],
        },
        {
          heading: 'Rådgivningen kan vara avgiftsbelagd',
          paragraphs: [
            'Rådgivningen med en advokat kan ske mot betalning. Den här sidan säger inte att det första samtalet är kostnadsfritt, och ingen del av den får läsas på det sättet.',
            'Sker rådgivningen mot betalning får du besked om belopp och betalningssätt innan den äger rum.',
          ],
        },
        {
          heading: 'Varför den här sidan inte anger taxor',
          paragraphs: [
            'Kostnaderna beror på ärendet självt: på arbetsinsatsen, antalet parter, handlingarna, fristerna och om ett förfarande redan pågår. Ett belopp som satts i förväg skulle inte visa vad just ditt ärende kostar. Därför fastställer vi först arbetets omfattning och ger dig därefter besked om kostnaderna, innan arbetet börjar.',
            'Utöver advokatarvodet kan kostnader för domstol, myndigheter eller tredje man tillkomma. De är skilda från arvodet och beror på det aktuella förfarandet.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Hur du når byrån',
      description:
        'Sidans språk, rådgivningsspråken, vad som gäller om du inte kan använda något av de fyra språken, och vad den här sidan inte utlovar.',
      intro:
        'Innan du skriver till oss bör du skilja på följande tre saker. De blandas ofta ihop, men betyder olika saker.',
      sections: [
        {
          heading: 'Tre saker som måste hållas isär',
          paragraphs: [
            'Sidans visningsspråk, rådgivningsspråket med advokaten och språket du skriver på är tre skilda saker.',
          ],
          items: [
            'Sidans språk: Den här vägledningen är skriven på svenska.',
            'Rådgivningsspråk: Rådgivningen sker endast på engelska, kinesiska (中文), japanska och koreanska.',
            'Språket du skriver på: Du får skriva sammanfattningen på ditt eget språk; originaltexten sparas oförändrad.',
          ],
        },
        {
          heading: 'Om du inte kan använda något av de fyra rådgivningsspråken',
          paragraphs: [
            'I kontaktformuläret kan du välja ”Kommunikationsvägen måste bekräftas”. Vi hör av oss för att undersöka om det finns en användbar kommunikationsväg; rådgivning på ett annat språk utlovas inte och ingen svarstid utlovas.',
            'Det är bara ett steg för att undersöka saken, inte ett löfte. Vi lovar inte en tolk, inte rådgivning på svenska eller på ett annat språk utanför de fyra som nämns, och inte att vi tar emot varje ärende.',
          ],
        },
        {
          heading: 'Vad som bör stå i det första meddelandet',
          paragraphs: [
            'Ange vad som har hänt, vilken hjälp du behöver, vilket samband ärendet har med Taiwan och vilken frist som gäller, om du känner till någon. Om du redan har fått en skrivelse från en domstol eller en myndighet, nämn datumet på skrivelsen.',
            'I inledningen behöver du ännu inte skicka passnummer, identitetsnummer, kontouppgifter, journaler eller hela bevisningen. Vänta på besked från advokaten och skicka då känsliga handlingar på ett säkert sätt.',
          ],
        },
        {
          heading: 'Vad den här sidan inte utlovar',
          paragraphs: [
            'Vi lovar ingen svarstid, bekräftar ingen tid via den här sidan, lovar inte en viss advokat och ordnar inte en tolk. Skriftlig översättning är något annat: ditt meddelande översätts inte automatiskt.',
            'När du skickar en begäran sparas innehållet och väntar på granskning. Om du efter en tid inte får svar kan du skriva på nytt till den e-postadress som anges på kontaktsidan.',
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
        'Frågorna nedan besvaras på en allmän nivå. Ett svar för ditt eget ärende är möjligt först efter att en advokat har granskat handlingarna.',
      sections: [
        {
          heading: 'Hur du använder den här delen',
          paragraphs: [
            'Hittar du inget svar som passar din situation beror svaret oftast på omständigheterna i det enskilda fallet. Skriv då dessa omständigheter i sammanfattningen i stället för att själv dra slutsatser av den här sidan.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Vilka ärenden behandlar byrån?',
          answer:
            'Vi arbetar inom sex områden: investering och bolagsbildning i Taiwan, civilrättsliga tvister och skadestånd, äktenskap, familj och arv, arbetsrättsliga tvister, straffrättsliga frågor och immaterialrätt. Om ett ärende tas emot avgörs efter granskning av innehållet.',
        },
        {
          question: 'Vad bör jag förbereda före kontakten?',
          answer:
            'Förbered en kort sammanfattning av förloppet, vad du vill ha hjälp med, sambandet med Taiwan och fristen, om det finns någon. Finns redan en skrivelse från en domstol eller en myndighet, nämn datumet. I det här skedet behöver du ännu inte skicka identitetshandlingar eller hela bevisningen.',
        },
        {
          question: 'Kan jag få rådgivning på svenska?',
          answer:
            'Nej. Den här vägledningen är skriven på svenska, men rådgivningen med en advokat sker endast på engelska, kinesiska (中文), japanska och koreanska. Vi lovar inte heller en tolk. Skriftlig översättning är något annat: den text du skriver sparas i original och översätts inte automatiskt.',
        },
        {
          question: 'Vad händer om jag inte kan använda något av de fyra språken?',
          answer:
            'Välj ”Kommunikationsvägen måste bekräftas” när du skickar begäran. Vi hör av oss för att undersöka om det finns ett användbart kommunikationssätt, men rådgivning på ett annat språk utlovas inte. Det är ett steg för att undersöka saken, inte ett löfte om att vi kan arbeta på ett annat språk.',
        },
        {
          question: 'Hur behandlas min svenska text?',
          answer:
            'Den text du skriver sparas i original och översätts inte automatiskt. Om det behövs bekräftar vi språket för den fortsatta kommunikationen med dig.',
        },
        {
          question: 'Har rådgivningen redan skett när begäran är skickad?',
          answer:
            'Nej. En skickad begäran väntar på att granskas av en advokat. Det är inte juridisk rådgivning, inte en bekräftad tid, och att skicka den skapar i sig inte ett förhållande mellan advokat och klient.',
        },
        {
          question: 'Hur beräknas kostnaderna?',
          answer:
            'Först fastställs arbetets omfattning, därefter bekräftas belopp och beräkningssätt med dig innan arbetet börjar. Den här sidan anger inga belopp och säger inte att det första samtalet är kostnadsfritt.',
        },
        {
          question: 'Vad händer om mitt ärende är mycket brådskande?',
          answer:
            'Ange fristen eller datumet på en officiell skrivelse i början av din sammanfattning, så att uppgifterna syns vid granskningen. Den här sidan har ingen jour och utlovar ingen svarstid; om ditt ärende inte kan vänta bör du parallellt söka andra vägar där du befinner dig.',
        },
      ],
    },
    privacy: {
      eyebrow: 'INTEGRITET',
      title: 'Uppgifter som samlas in via kontaktformuläret',
      description:
        'Vad kontaktformuläret i den här svenska delen samlar in, hur originaltexten behandlas och hur du når oss om dina uppgifter.',
      intro:
        'Den här delen gäller endast kontaktformuläret på de svenska vägledningssidorna. Den beskriver hur uppgifter behandlas och är inte en teknisk utfästelse.',
      sections: [
        {
          heading: 'Vilka uppgifter som samlas in',
          paragraphs: [
            'När du skickar en begäran via formuläret i den här delen antecknas följande:',
          ],
          items: [
            'Det namn du uppger',
            'E-postadressen för svaret',
            'Sidans visningsspråk vid sändningen',
            'Språket du skrev på',
            'Det rådgivningsspråk du önskar',
            'Originaltexten du skrev',
            'Ditt samtycke till att skicka begäran',
            'Ett mottagningsnummer för att återfinna begäran',
          ],
        },
        {
          heading: 'Originaltexten sparas oförändrad',
          paragraphs: [
            'Din text sparas precis som du skrev den och översätts inte automatiskt. Behövs en översättning för handläggningen tar vi upp det särskilt med dig.',
            'Eftersom originaltexten sparas, skriv i inledningen inget som ännu inte behövs, till exempel passnummer, identitetsnummer eller kontouppgifter.',
          ],
        },
        {
          heading: 'Lagringsplats och åtkomst',
          paragraphs: [
            'Det du skickar lagras på en plats som inte är offentligt tillgänglig. Endast behöriga personer på byrån får komma åt innehållet för att handlägga begäran.',
            'Den här sidan ger inget absolut säkerhetslöfte. Ingen överföringsväg och ingen lagringsplats är helt säker; känsliga handlingar bör därför skickas endast efter särskild anvisning från advokaten.',
          ],
        },
        {
          heading: 'Ändamålet med användningen',
          paragraphs: [
            'Uppgifterna du skickar används för att granska begäran, återkoppla till dig, klargöra kommunikationssättet och handlägga ärendet om arbetet tas upp.',
            'Uppgifterna används inte för marknadsföring utan ett särskilt samtycke.',
          ],
        },
        {
          heading: 'Underrättelse och mottagningsnummer',
          paragraphs: [
            'När en begäran har skickats underrättar systemet byrån. Är underrättelsen ännu inte bekräftad ligger din text kvar sparad och går inte förlorad.',
            'Mottagningsnumret används för att hitta din begäran i våra handlingar. Det visas när begäran har sparats, och du kan ange det vid en ny kontakt.',
          ],
        },
        {
          heading: 'Dina rättigheter och kontaktvägen',
          paragraphs: [
            'Du kan begära insyn, rättelse eller radering av dina uppgifter eller återkalla ditt samtycke via den e-postadress som anges på kontaktsidan. Finns en skyldighet enligt lag eller processregler att bevara uppgifterna förklarar vi begränsningen.',
            'Den här sidan anger ingen fast bevarandetid, eftersom den faktiska tiden beror på om ärendet fortsätter och på de skyldigheter som följer av det. Vill du att uppgifterna raderas tidigare, meddela det vid kontakten.',
          ],
        },
        {
          heading: 'Lagringsplats och leverantörer',
          paragraphs: [
            'Den här webbplatsen drivs hos Vercel, och det du skickar lagras i icke-offentlig objektlagring hos den tjänsten. E-post skickas via den e-posttjänst byrån använder.',
            'Enskilda leverantörers servrar kan stå utanför Taiwan, så att dina uppgifter kan lagras och behandlas där. När ändamålet med lagringen är uppfyllt raderas uppgifterna utan dröjsmål; uppgifter som måste bevaras enligt tillämpliga regler ligger kvar under den tiden. Frågor om personuppgifter skickas till wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'FRISKRIVNING',
      title: 'Omfattning och gränser för uppgifterna på den här sidan',
      description:
        'Uppgifternas allmänna karaktär, det rättsliga tillämpningsområdet och förutsättningarna för ett förhållande mellan advokat och klient.',
      intro:
        'Den här delen klargör vad de svenska vägledningssidorna kan göra för dig och vad de inte kan.',
      sections: [
        {
          heading: 'Endast allmänna uppgifter',
          paragraphs: [
            'Innehållet på de här sidorna är skrivet som allmän information. Det är inte juridisk rådgivning för ditt ärende och ersätter inte en genomgång av dina egna handlingar.',
            'Utgången av ett ärende beror på fakta, tillämpliga regler och tidpunkten; två till synes lika fall kan få olika utgång.',
          ],
        },
        {
          heading: 'Rättsligt tillämpningsområde',
          paragraphs: [
            'Byrån är verksam enligt Taiwans rätt, och den här sidan handlar endast om arbete inom den ramen.',
            'Innehållet är inte rådgivning enligt rätten i någon annan rättsordning än Taiwans, inbegripet rätten där du är bosatt. Rör en del av ditt ärende en annan rättsordning reder vi tillsammans med dig ut vilken kvalificerad fackperson som behövs för den delen.',
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
        'Artiklar på svenska om vanliga frågor i Taiwans rätt. Innehållet är allmän information vid publiceringstidpunkten, inte juridisk rådgivning för ditt ärende.',
      intro:
        'Byrån publicerar artiklar om vanliga frågor i Taiwans rätt. Artiklar som finns på svenska står på den här sidan; därtill finns fyra länkar som var och en öppnar artikellistan för ett originalspråk.',
      sections: [
        {
          heading: 'Fyra listor på originalspråk',
          paragraphs: [
            'Den här delen innehåller fyra länkar: artikellistan på koreanska, på kinesiska, på engelska och på japanska. Varje länk anger listans språk, så att du i förväg vet på vilket språk innehållet öppnas.',
            'Dessa fyra listor följer artiklarnas originalspråk; de är inte översättningar. Artiklar som finns på svenska står särskilt på den här sidan.',
          ],
        },
        {
          heading: 'Vart länkarna leder',
          paragraphs: [
            'När du väljer en av de fyra länkarna öppnas artikellistan för det språket. Ur listan väljer du själv texten; hela innehållet visas på artikelns originalspråk.',
            'Den här sidan sammanfattar inte artiklarnas innehåll och utlovar inte att ett ämne finns på alla fyra språken. Varje lista innehåller endast texter som är publicerade på det språket.',
          ],
        },
        {
          heading: 'Hur långt en artikel kan tjäna som orientering',
          paragraphs: [
            'Artiklar är allmän information vid publiceringstidpunkten. Regler och deras tillämpning kan ändras, och en artikel täcker inte alla omständigheter i ditt ärende.',
            'Grunda därför inte ett beslut i ett verkligt ärende enbart på en artikel. Använd den för överblick och gå igenom dina handlingar särskilt med en advokat; den här sidan ersätter inte rådgivningen.',
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
  skipLink: 'Spring navigationen over og gå til indholdet',
  menuLabel: 'Menu',
  languageLabel: 'Visningssprog',
  mega: {
    services: {
      description: 'Kontoret behandler de væsentlige praksisområder i taiwansk ret.',
      viewAllLabel: 'Vis alle',
    },
    columns: {
      description: 'Artikler om hyppige spørgsmål i Taiwans ret.',
      viewAllLabel: 'Vis alle',
    },
    lawyers: {
      description: 'Præsentation af kontorets advokater og kontaktvejene.',
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
    'Den søgte side findes ikke eller er flyttet. Du kan gå tilbage til startsiden på dansk og se de vejledninger, der findes.',
  backHomeLabel: 'Til startsiden',
  readSourceLabel: 'Åbn artikellisten på originalsproget',
  home: {
    heroScrollLabel: 'Rul nedad',
    heroColumnsCtaLabel: 'Se artiklerne',
    servicesDetailLabel: 'Se detaljerne',
    servicesAssistanceBefore: 'Hvis det er uklart, hvilket område din sag hører under, forklarer siden ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter:
      ' hvordan du skriver et resumé, som en advokat gennemgår.',
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
        'Hovering International Law Firm bistår klienter i udlandet, også med tilknytning til Taiwan, i sager efter taiwansk ret: investering og selskabsstiftelse, civile tvister, ægteskab, familie og arv, arbejdsret, strafferet og immaterialret. Denne danske del hjælper dig med at se, hvilket arbejde der falder inden for vores område, hvad du skal forberede, og hvordan du kontakter os. Det er almindelige oplysninger, ikke juridisk rådgivning for din egen sag.',
      sections: [
        {
          heading: 'Hvad vi gør',
          paragraphs: [
            'Hovering International Law Firm er et advokatkontor i Taiwan. Kontoret arbejder efter taiwansk ret og har kontorer i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) og Pingtung (屏東). Vi rådgiver virksomheder, fører sager for retten og bistår klienter fra udlandet gennem de skridt, der kræves i Taiwan.',
            'Her står kun almindelige oplysninger. Udfaldet af en sag afhænger af fakta, de gældende regler og tidspunktet. Disse vejledninger erstatter ikke samtalen med en advokat om dine dokumenter.',
          ],
        },
        {
          heading: 'Sidens sprog og rådgivningssproget er ikke det samme',
          paragraphs: [
            'Denne side er skrevet på dansk, men rådgivningen med en advokat foregår kun på de fire rådgivningssprog engelsk, kinesisk (中文), japansk og koreansk. At læse vejledningerne på dansk betyder ikke, at samtalen med advokaten foregår på dansk.',
            'Vi lover ikke en tolk, en svartid eller en tid via denne side. Hvis du ikke behersker noget af de fire sprog, forklarer siden »Kontakt«, hvordan vi prøver en kommunikationsvej.',
          ],
        },
        {
          heading: 'Praksisområder',
          paragraphs: [
            'Arbejdsområdet omfatter følgende seks områder. Siden »Ydelser« beskriver hvert område nærmere og angiver, hvad der ikke loves.',
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
          heading: 'Hvor du bør begynde',
          paragraphs: [
            'Læs siden »Ydelser« for at se, om din sag falder inden for vores område, derefter »Omkostninger« og »Kontakt« for at vide, hvordan omfanget fastlægges, og hvordan omkostningerne bekræftes, før arbejdet begynder.',
            'Når du sender en meddelelse, må du skrive resuméet på dit eget sprog. Originalteksten gemmes, som du skrev den, og oversættes ikke automatisk. En sendt meddelelse er en anmodning, der venter på gennemgang: det er endnu ikke rådgivning og ikke en bekræftet tid.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'YDELSER',
      title: 'Hvilke sager vi behandler',
      description:
        'Seks praksisområder hos kontoret i Taiwan og de grænser, du først bør kende.',
      intro:
        'Nedenfor står de områder, vi faktisk behandler, og de spørgsmål, der ofte stilles i begyndelsen. Fremstillingen hjælper dig med at vurdere, om din sag falder inden for vores område; den er almindelig og ikke en juridisk analyse af en konkret sag.',
      sections: [
        {
          heading: 'Investering og selskabsstiftelse i Taiwan',
          paragraphs: [
            'Vi bistår udenlandske investorer og virksomheder ved stiftelse eller drift af et selskab i Taiwan: valg af selskabsform, forberedelse og indgivelse af dokumenter, kapitalindskud, bankforhold, gennemgang af forretningsstedet samt branchekrav. Vi bistår også med bogføring og skat, der følger af stiftelse og drift i Taiwan.',
            'Forløb og tid adskiller sig efter form, investor, branche, bank og allerede tilgængelige dokumenter. En selskabsstiftelse fører ikke af sig selv til opholdstilladelse (居留) eller arbejdstilladelse (工作許可): det er særskilte forløb, der vurderes efter personens situation.',
          ],
        },
        {
          heading: 'Civile tvister og erstatning',
          paragraphs: [
            'Dette område omfatter kontraktstvister, erstatning uden for kontrakt og forbrugertvister. Arbejdet begynder som regel med en kronologi, gennemgang af eksisterende dokumenter og beviser og først derefter med de næste skridt.',
            'Frister, herunder forældelse, og bevisernes fuldstændighed præger forløbet. Angiv derfor kendte datoer så tidligt som muligt. Bevar kontrakter, meddelelser, betalingskvitteringer eller fotos af situationen på stedet og nævn dem i den første meddelelse.',
          ],
        },
        {
          heading: 'Ægteskab, familie og arv',
          paragraphs: [
            'Vi behandler skilsmisse (離婚), bodeling, forældremyndighed og forældreansvar for mindreårige børn (未成年子女權利義務之行使或負擔), samvær (會面交往) og arv (繼承), også når parter eller formue findes i forskellige stater. Grænseoverskridende familiesager kræver ofte yderligere kontrol af husstandsregistreringen (戶籍), dokumenternes form og deres bevisværdi i Taiwan.',
            'Fordi familiesager ofte medfører frister og parallelle forløb, bør det første resumé nævne parternes forhold, den aktuelle bopæl og allerede igangværende forløb.',
          ],
        },
        {
          heading: 'Arbejdsretlige tvister',
          paragraphs: [
            'Dette område omfatter ophør af ansættelse, godtgørelse ved afskedigelse efter taiwansk ret (資遣費; ikke det samme som fratrædelsesgodtgørelse eller lignende ordninger efter andre landes ret), løn og tvister om ansættelseskontrakten (勞動契約), både på arbejdstager- og arbejdsgiverside. Ved gennemgangen adskiller vi ophørsgrunden fra spørgsmål om varsel, betaling og frister.',
            'Ansættelseskontrakt, arbejdsreglement (工作規則), lønsedler og parternes korrespondance er oftest de afgørende dokumenter. Hvis du stadig har dem, nævn det i resuméet.',
          ],
        },
        {
          heading: 'Strafferetlige sager',
          paragraphs: [
            'Vi bistår sigtede, tiltalte og forurettede under efterforskningen og i retten og vurderer strafferetlige risici ved erhvervsvirksomhed.',
            'Strafferetlige sager har ofte korte frister og fastlagte trin. Hvis du allerede har fået en skrivelse fra anklagemyndighed eller ret, nævn datoen på skrivelsen tidligt, så indholdet kan gennemgås i den rigtige rækkefølge.',
          ],
        },
        {
          heading: 'Immaterialret',
          paragraphs: [
            'Vi bistår ved registrering af varemærker (商標) og patenter (專利), ved ophavsret og ved tvister om disse rettigheder i Taiwan.',
            'På dette område er rækkefølgen af skridtene afgørende: beskyttelsesomfang, ansøgningstidspunkt og faktisk brug påvirker valget. At indgive en ansøgning betyder ikke af sig selv, at den imødekommes.',
          ],
        },
        {
          heading: 'Omfang og dets bekræftelse',
          paragraphs: [
            'Kontoret arbejder efter taiwansk ret og behandler sager inden for de nævnte områder. Omfanget af hver sag bekræftes særskilt, efter at en advokat har gennemgået din meddelelse.',
            'Opholdsstatus, arbejdstilladelse og sammenlignelige spørgsmål vurderes ud fra dokumenterne og personens situation, ikke ud fra statsborgerskabet. Hvis en del af din sag rører sådanne spørgsmål, nævn det ved kontakten. Denne side lover hverken et resultat eller en svartid.',
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
        'Hovering International Law Firm er et advokatkontor i Taiwan. Advokaterne arbejder med alt fra virksomhedsrådgivning til retssager. Denne del beskriver kontorets tilblivelse, stederne og arbejdet med udenlandske parter.',
      sections: [
        {
          heading: 'Stiftelse og opbygning',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) blev stiftet i 2016 af advokater, der har studeret ved National Taiwan University (國立臺灣大學). Det kinesiske navn 昊鼎 forener tegnet 昊 (»den vide himmel«) med 鼎 (»fast grund«) og beskriver kontorets retning siden stiftelsen.',
            'Vi har kontorer i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) og Pingtung (屏東). Kontoret i Kaohsiung er indrettet på virksomhedsledelse og behandler civile, strafferetlige og forvaltningsretlige tvister. Kontoret i Taichung behandler byggesager, immaterialret og sager med tilknytning til Korea og Japan. Kontoret i Pingtung blev åbnet i 2017 for at dække det lokale behov.',
            'Ved siden af det advokatmæssige arbejde findes siden 2020 også Hovering Accounting Office, som tilbyder bogføring og skatteplanlægning for erhvervsdrivende og formuende privatpersoner.',
          ],
        },
        {
          heading: 'Arbejde med udenlandske parter',
          paragraphs: [
            'Det grænseoverskridende arbejde omfatter selskabsstiftelse, visum, varemærke- og patentansøgninger, juridisk risikovurdering og skatterådgivning for virksomheder. Kontoret i Taichung behandler navnlig byggesager, immaterialret og sager med tilknytning til Korea og Japan. Advokat Wei Tseng (曾雋崴) bistår klienter fra Korea og Japan og andre internationale klienter inden for de nævnte områder.',
            'Om vi kan tage en sag, afhænger af indholdet og af kommunikationssproget. Falder din sag inden for de nævnte områder, og kan den drøftes på et af de fire rådgivningssprog, kan du sende et resumé til gennemgang.',
          ],
        },
        {
          heading: 'Når du kontakter os',
          paragraphs: [
            'Når dit resumé er kommet ind, gennemgår en advokat indholdet og drøfter derefter det mulige arbejdsomfang, de dokumenter der endnu mangler, og de næste skridt. Ved skatte- eller bogføringsspørgsmål kan kontoret arbejde med bogføringsafdelingen i ét forløb.',
            'Resultatet af hver sag afhænger af fakta og de dokumenter, der findes; vi lover intet resultat. Hvis du har brug for et bindende svar for din situation, skal dokumenterne drøftes med en advokat på et af de fire rådgivningssprog.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKATER',
      title: 'Hoverings internationale team',
      description: 'Profiler for Hoverings advokater, den operative ledelse og det tilknyttede revisionskontor.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'OMKOSTNINGER',
      title: 'Hvordan arbejdsomfang og omkostninger fastlægges',
      description:
        'Forklaring af rækkefølgen: først arbejdsomfanget, derefter omkostningsbekræftelsen, og hvorfor denne side ikke indeholder en prisliste.',
      intro:
        'Denne side forklarer, hvordan omkostninger fastlægges, ikke deres beløb. Beløbet afhænger af arbejdsomfanget i den enkelte sag og giver først mening, når det omfang er klart.',
      sections: [
        {
          heading: 'Først fastlægges arbejdsomfanget',
          paragraphs: [
            'Sager af samme slags kan kræve meget forskellig indsats, afhængigt af antallet af parter, tilgængelige dokumenter, frister der skal overholdes, og om et forløb allerede er begyndt. Derfor er det første skridt altid at fastlægge, hvad der hører til arbejdet, og hvad der ikke gør det.',
            'Resuméet, du sender i begyndelsen, er grundlaget for det omfang. Jo klarere det beskriver forløbet, din anmodning og fristerne, desto mere præcist kan omfanget bestemmes.',
          ],
        },
        {
          heading: 'Omkostningerne bekræftes, før arbejdet begynder',
          paragraphs: [
            'Når arbejdsomfanget er klart, drøftes beløb og beregningsmåde med dig og bekræftes, før arbejdet begynder. Ændrer omfanget sig undervejs, skal det bekræftes på ny.',
            'Denne side er ikke et pristilbud og skaber ingen betalingspligt.',
          ],
        },
        {
          heading: 'Rådgivningen kan være mod betaling',
          paragraphs: [
            'Rådgivningen med en advokat kan være en ydelse mod betaling. Denne side siger ikke, at den første samtale er uden betaling.',
            'Hvis rådgivningen er mod betaling, meddeles beløb og betalingsmåde, før den finder sted.',
          ],
        },
        {
          heading: 'Hvorfor denne side ikke angiver takster',
          paragraphs: [
            'Omkostningerne afhænger af sagen selv: af indsatsen, antallet af parter, dokumenterne, fristerne og om et forløb allerede er i gang. Et beløb fastsat på forhånd ville ikke vise omkostningerne for din sag. Derfor fastlægger vi først arbejdsomfanget og meddeler dig derefter omkostningerne, før arbejdet begynder.',
            'Ud over advokathonoraret kan der komme rets-, myndigheds- eller tredjepartsomkostninger. De er adskilt fra honoraret og afhænger af det pågældende forløb.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Sådan kontakter du kontoret',
      description:
        'Sidens sprog, rådgivningssprogene, fremgangsmåden, hvis du ikke behersker noget af de fire sprog, og hvad denne side ikke lover.',
      intro:
        'Før du skriver til os, bør du holde følgende tre punkter adskilt. De blandes ofte, men betyder forskellige ting.',
      sections: [
        {
          heading: 'Tre ting, der skal holdes adskilt',
          paragraphs: [
            'Sidens visningssprog, rådgivningssproget med advokaten og det sprog, du skriver på, er tre adskilte ting.',
          ],
          items: [
            'Sidens sprog: Disse vejledninger er skrevet på dansk.',
            'Rådgivningssprog: Rådgivningen foregår kun på engelsk, kinesisk (中文), japansk og koreansk.',
            'Dit skriftsprog: Du må skrive resuméet på dit eget sprog; originalteksten gemmes uændret.',
          ],
        },
        {
          heading: 'Hvis du ikke behersker noget af de fire rådgivningssprog',
          paragraphs: [
            'I kontaktformularen kan du vælge »Kommunikationsvejen skal bekræftes«. Vi vender tilbage for at undersøge, om der findes en brugbar kommunikationsvej; rådgivning på et andet sprog loves ikke, og der loves ingen svartid.',
            'Det er kun en afklaring, ikke et løfte. Vi lover ikke en tolk, ikke rådgivning på dansk eller på et andet sprog end de fire nævnte, og ikke at vi tager imod enhver sag.',
          ],
        },
        {
          heading: 'Hvad der bør stå i den første meddelelse',
          paragraphs: [
            'Angiv, hvad der er sket, hvilken hjælp du har brug for, hvilket forhold sagen har til Taiwan, og fristen, hvis du kender en. Hvis du allerede har fået en skrivelse fra en ret eller en myndighed, nævn datoen på skrivelsen.',
            'I begyndelsen behøver du endnu ikke sende pasnummer, identitetsnummer, kontooplysninger, patientjournaler eller hele bevismaterialet. Vent på anvisninger fra advokaten og send da følsomme dokumenter ad en sikker vej.',
          ],
        },
        {
          heading: 'Hvad denne side ikke lover',
          paragraphs: [
            'Vi lover ingen svartid, bekræfter ingen tid via denne side, lover ikke en bestemt advokat og stiller ikke en tolk til rådighed. Skriftlig oversættelse er noget andet: Din meddelelse oversættes ikke automatisk.',
            'Når du sender en anmodning, gemmes indholdet og venter på gennemgang. Hvis du efter nogen tid ikke får svar, kan du skrive på ny til den e-mailadresse, der er angivet på kontaktsiden.',
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
        'Spørgsmålene nedenfor besvares på niveauet almindelige oplysninger. Et svar på din egen sag er først muligt, efter at en advokat har gennemgået dokumenterne.',
      sections: [
        {
          heading: 'Hvordan du bruger denne del',
          paragraphs: [
            'Finder du intet svar på din situation, afhænger svaret oftest af særlige fakta. Skriv da disse fakta i resuméet i stedet for selv at udlede dem fra denne side.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Hvilke sager behandler kontoret?',
          answer:
            'Vi behandler seks områder: investering og selskabsstiftelse i Taiwan, civile tvister og erstatning, ægteskab, familie og arv, arbejdsretlige tvister, strafferetlige sager og immaterialret. Om en sag tages imod afgøres efter gennemgang af indholdet.',
        },
        {
          question: 'Hvad bør jeg forberede før kontakten?',
          answer:
            'Forbered et kort resumé af forløbet, din anmodning, forholdet til Taiwan og fristen, hvis en findes. Findes allerede en skrivelse fra en ret eller en myndighed, nævn datoen. I dette stadium behøver du endnu ikke sende identitetsdokumenter eller hele beviset.',
        },
        {
          question: 'Kan jeg få rådgivning på dansk?',
          answer:
            'Nej. Disse vejledninger er skrevet på dansk, men rådgivningen med en advokat foregår kun på engelsk, kinesisk (中文), japansk og koreansk. Vi lover heller ikke en tolk. Skriftlig oversættelse er noget andet: den oprindelige tekst, du skriver, gemmes som den er og oversættes ikke automatisk.',
        },
        {
          question: 'Hvad hvis jeg ikke behersker noget af de fire sprog?',
          answer:
            'Vælg ved afsendelsen »Kommunikationsvejen skal bekræftes«. Vi vender tilbage for at undersøge, om der findes en brugbar kommunikationsvej, men rådgivning på et andet sprog loves ikke. Det er kun en afklaring, ikke et løfte om, at vi kan arbejde på et andet sprog.',
        },
        {
          question: 'Hvordan behandles min danske tekst?',
          answer:
            'Originalteksten, du skriver, gemmes som den er og oversættes ikke automatisk. Hvis det er nødvendigt, bekræftes sproget for den videre kommunikation med dig.',
        },
        {
          question: 'Er rådgivningen allerede sket, når anmodningen er sendt?',
          answer:
            'Nej. En sendt anmodning venter på gennemgang af en advokat. Det er ikke juridisk rådgivning, ikke en bekræftet tid, og afsendelsen skaber i sig selv ikke et forhold mellem advokat og klient.',
        },
        {
          question: 'Hvordan beregnes omkostningerne?',
          answer:
            'Først fastlægges arbejdsomfanget, derefter bekræftes beløb og beregningsmåde med dig, før arbejdet begynder. Denne side angiver ingen tal og siger ikke, at den første samtale er uden betaling.',
        },
        {
          question: 'Hvad hvis min sag er meget hastende?',
          answer:
            'Angiv fristen eller datoen på en officiel skrivelse i begyndelsen af dit resumé, så disse data er synlige ved gennemgangen. Denne side har ingen akut linje og lover ingen svartid; hvis din sag ikke kan vente, bør du parallelt søge andre muligheder dér, hvor du befinder dig.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVATLIV',
      title: 'Data, der indsamles via kontaktformularen',
      description:
        'Hvad kontaktformularen i denne danske del indsamler, hvordan originalteksten behandles, og hvordan du kontakter os om dine data.',
      intro:
        'Denne del vedrører kun kontaktformularen på disse vejledningssider. Den beskriver behandlingen af data, ikke et teknisk løfte.',
      sections: [
        {
          heading: 'Hvilke data der indsamles',
          paragraphs: [
            'Når du sender en anmodning via formularen i denne del, registreres følgende:',
          ],
          items: [
            'Det navn, du opgiver',
            'E-mailadressen til svaret',
            'Sidens visningssprog ved afsendelsen',
            'Det sprog, du skrev på',
            'Det rådgivningssprog, du ønsker',
            'Originalteksten, du skrev',
            'Dit samtykke til at sende anmodningen',
            'Et modtagelsesnummer for at genfinde anmodningen',
          ],
        },
        {
          heading: 'Originalteksten gemmes uændret',
          paragraphs: [
            'Din tekst gemmes præcis, som du skrev den, og oversættes ikke automatisk. Er en oversættelse nødvendig for behandlingen, tages det op særskilt med dig.',
            'Fordi originalteksten gemmes, skriv i begyndelsen ikke noget, der endnu ikke er nødvendigt, for eksempel pasnummer, identitetsnummer eller kontooplysninger.',
          ],
        },
        {
          heading: 'Lagringssted og adgang',
          paragraphs: [
            'Indholdet af din indsendelse gemmes et sted, der ikke er offentligt tilgængeligt. Kun berettigede personer på kontoret må få adgang for at behandle anmodningen.',
            'Denne side giver intet absolut sikkerhedsløfte. Ingen overførselsvej og intet lagringssted er helt sikkert; følsomme dokumenter bør derfor kun sendes efter særlig anvisning fra advokaten.',
          ],
        },
        {
          heading: 'Formålet med brugen',
          paragraphs: [
            'De sendte data tjener til at gennemgå anmodningen, give dig tilbagemelding, afklare kommunikationsmåden og behandle sagen, hvis arbejdet tages op.',
            'Dataene bruges ikke til markedsføring uden et særskilt samtykke.',
          ],
        },
        {
          heading: 'Underretning og modtagelsesnummer',
          paragraphs: [
            'Når en anmodning går igennem, underretter systemet kontoret. Er kontorets modtagelse af underretningen endnu ikke bekræftet, forbliver din tekst gemt og går ikke tabt.',
            'Modtagelsesnummeret tjener til at genfinde din anmodning i vores sagsakter. Det vises efter gemningen; du kan angive det ved en ny kontakt.',
          ],
        },
        {
          heading: 'Dine rettigheder og kontaktvejen',
          paragraphs: [
            'Du kan begære indsigt, berigtigelse eller sletning af dine data eller tilbagekalde samtykket via den e-mailadresse, der er angivet på kontaktsiden. Findes en lovbestemt eller processuel pligt til at opbevare oplysningerne, forklarer vi begrænsningen.',
            'Denne side angiver ingen fast bevaringsfrist, fordi den faktiske tid afhænger af, om sagen fortsættes, og af de dertil hørende pligter. Ønsker du en tidligere sletning, meddel det ved kontakten.',
          ],
        },
        {
          heading: 'Lagringssted og leverandører',
          paragraphs: [
            'Denne hjemmeside drives hos Vercel, og din indsendelse gemmes i et ikke-offentligt lager hos denne tjeneste. E-mails sendes via den e-mailtjeneste, kontoret bruger.',
            'Enkelte leverandørers servere kan stå uden for Taiwan, så dine data kan gemmes og behandles dér. Når lagringsformålet er opfyldt, slettes dataene uden forsinkelse; data, der skal bevares efter gældende regler, bliver i den tid. Forespørgsler om persondata sendes til wei@hoveringlaw.com.tw.',
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
        'Denne del gør klart, hvad disse danske vejledningssider kan gøre for dig, og hvad de ikke kan.',
      sections: [
        {
          heading: 'Kun almindelige oplysninger',
          paragraphs: [
            'Indholdet på disse sider er skrevet som almindelig information. Det er ikke juridisk rådgivning for din sag og erstatter ikke gennemgangen af dine egne dokumenter.',
            'Udfaldet af en sag afhænger af fakta, de gældende regler og tidspunktet; to tilsyneladende ens situationer kan ende forskelligt.',
          ],
        },
        {
          heading: 'Retligt anvendelsesområde',
          paragraphs: [
            'Kontoret arbejder efter taiwansk ret, og denne side handler kun om arbejde inden for den ramme.',
            'Indholdet er ikke rådgivning efter retten i en anden retsorden end Taiwan, herunder retten på din bopæl. Rører en del af din sag en anden retsorden, afklarer vi med dig, hvilken kvalificeret fagperson der behøves til den del.',
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
            'Eksterne links tjener til orientering; vi indestår hverken for rigtigheden eller aktualiteten af tredjepartsindhold.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTIKLER',
      title: 'Artikler om Taiwans ret',
      description:
        'Artikler på dansk om hyppige spørgsmål i Taiwans ret. Indholdet er almindelig information på tidspunktet for offentliggørelsen, ikke juridisk rådgivning for din sag.',
      intro:
        'Kontoret offentliggør artikler om hyppige spørgsmål i Taiwans ret. Artikler, der findes på dansk, står på denne side; dertil er der fire links, som hver åbner artikellisten for et originalsprog.',
      sections: [
        {
          heading: 'Fire lister efter sprog',
          paragraphs: [
            'Denne del indeholder fire links: artikellisten på koreansk, på kinesisk, på engelsk og på japansk. Hvert link angiver listens sprog, så du på forhånd ved, på hvilket sprog indholdet åbnes.',
            'Disse fire lister er lister efter artiklernes originalsprog, ikke oversættelseslister. Artikler, der findes på dansk, står særskilt på denne side.',
          ],
        },
        {
          heading: 'Hvor linkene fører hen',
          paragraphs: [
            'Når du vælger et af de fire links, åbnes artikellisten for det sprog. Ud af listen vælger du selv teksten; hele indholdet vises på artiklens originalsprog.',
            'Denne side sammenfatter ikke artiklernes indhold og lover ikke, at et emne findes på alle fire sprog. Hver liste indeholder kun tekster, der er offentliggjort på det sprog.',
          ],
        },
        {
          heading: 'Hvor langt en artikel kan tjene som orientering',
          paragraphs: [
            'Artikler er almindelige oplysninger på tidspunktet for offentliggørelsen. Regler og deres anvendelse kan ændre sig, og en artikel indeholder ikke alle omstændigheder i din sag.',
            'Byg derfor ikke en beslutning i en virkelig sag alene på en artikel. Brug den til overblik og drøft dine dokumenter særskilt med en advokat; denne side er ikke selve rådgivningen.',
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
    'Denne siden på norsk inneholder bare alminnelige veiledninger om kontorets arbeid etter Taiwans rett. Den er ikke juridisk rådgivning for en konkret sak, og å sende en melding skaper i seg selv ikke et klientforhold.',
  skipLink: 'Hopp over navigasjonen og gå til innholdet',
  menuLabel: 'Meny',
  languageLabel: 'Visningsspråk',
  mega: {
    services: {
      description: 'Kontoret behandler de sentrale fagområdene i taiwansk rett.',
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
        'Alminnelige forklaringer på norsk om arbeidsområdet til Hovering International Law Firm i Taiwan, rådgivningsspråkene og den første kontakten.',
      intro:
        'Hovering International Law Firm bistår klienter i utlandet, også med tilknytning til Taiwan, i saker etter taiwansk rett: investering og selskapsstiftelse, sivile tvister, ekteskap, familie og arv, arbeidsrett, strafferett og immaterialrett. Denne norske delen hjelper deg med å se hvilket arbeid som faller innenfor vårt område, hva du bør forberede, og hvordan du når oss. Det er alminnelige opplysninger, ikke juridisk rådgivning i din egen sak.',
      sections: [
        {
          heading: 'Hva vi gjør',
          paragraphs: [
            'Hovering International Law Firm er et advokatkontor etablert i Taiwan. Vi arbeider etter taiwansk rett og har kontorer i Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) og Pingtung (屏東). Vi gir råd til virksomheter, fører saker for domstolene og bistår klienter fra utlandet gjennom de trinnene som kreves i Taiwan.',
            'Alt innholdet her er alminnelig informasjon. Utfallet av en sak avhenger av fakta, av reglene som gjelder, og av tidspunktet. Disse veiledningene erstatter ikke en samtale med advokat om dine egne dokumenter.',
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
            'Vi behandler skilsmisse (離婚), deling av formue, foreldreansvar for mindreårige barn (未成年子女權利義務之行使或負擔), samvær (會面交往) og arv (繼承), også når parter eller formue befinner seg i ulike land. Grenseoverskridende familiesaker krever ofte en ekstra kontroll av husholdningsregisteret (戶籍), av dokumentenes form og av bevisverdien de har i Taiwan.',
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
          heading: 'Omfanget og hvordan det bekreftes',
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
            'Når sammendraget ditt er kommet inn, vurderer en advokat innholdet og tar deretter opp mulig arbeidsomfang, dokumenter som fortsatt trengs, og de neste trinnene. I skatte- og bokføringsspørsmål kan kontoret arbeide sammen med regnskapsavdelingen i én og samme sak.',
            'Utfallet i den enkelte sak avhenger av fakta og av dokumentene som finnes; vi lover ikke noe resultat. Trenger du et bindende svar for din situasjon, må dokumentene drøftes med en advokat på et av de fire rådgivningsspråkene.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOKATER',
      title: 'Hoverings internasjonale team',
      description: 'Profiler for Hoverings advokater, den operative ledelsen og revisjonspartneren.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'KOSTNADER',
      title: 'Hvordan arbeidsomfang og kostnader fastsettes',
      description:
        'Forklaring av rekkefølgen: først arbeidsomfanget, deretter kostnadsbekreftelsen, og hvorfor denne siden ikke inneholder en prisliste.',
      intro:
        'Denne siden forklarer hvordan kostnader fastsettes, ikke beløpet. Beløpet avhenger av arbeidsomfanget i den enkelte sak og gir først mening når omfanget er klart.',
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
            'Denne siden er ikke et pristilbud og skaper ingen betalingsplikt. Å sende en forespørsel via denne siden er også kostnadsfritt.',
          ],
        },
        {
          heading: 'Rådgivningen kan være mot betaling',
          paragraphs: [
            'Rådgivning hos advokat kan være en betalt tjeneste. Denne siden sier ikke at den første samtalen er uten betaling, og ingen del av siden skal leses slik.',
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
            'Språket du skriver på: Du kan skrive sammendraget på ditt eget språk; originalteksten lagres uendret.',
          ],
        },
        {
          heading: 'Hvis du ikke behersker noen av de fire rådgivningsspråkene',
          paragraphs: [
            'I kontaktskjemaet kan du velge «Kommunikasjonsveien må bekreftes». Vi svarer for å undersøke om det finnes en brukbar kommunikasjonsvei; rådgivning på et annet språk loves ikke, og vi lover ingen svartid.',
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
            'Vi lover ingen svartid, bekrefter ingen time via denne siden, lover ikke en bestemt advokat og stiller ikke med tolk. Skriftlig oversettelse er noe annet: meldingen din oversettes ikke automatisk.',
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
            'Vi behandler seks fagområder: investering og selskapsstiftelse i Taiwan, sivile tvister og erstatning, ekteskap, familie og arv, arbeidsrettslige tvister, straffesaker og immaterialrett. Hvorvidt vi tar imot en sak, avgjøres etter at innholdet er vurdert.',
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
          question: 'Hva hvis jeg ikke kan bruke noen av de fire språkene?',
          answer:
            'Velg «Kommunikasjonsveien må bekreftes» når du sender inn. Vi svarer for å undersøke en mulig kommunikasjonsvei, men rådgivning på et annet språk loves ikke. Det er et forsøk, ikke et løfte om at vi kan arbeide på et annet språk.',
        },
        {
          question: 'Hvordan behandles min norske tekst?',
          answer:
            'Originalteksten du skriver, lagres slik den er, og oversettes ikke automatisk. Om det er nødvendig, avtaler vi med deg hvilket språk den videre kommunikasjonen skal foregå på.',
        },
        {
          question: 'Har rådgivningen allerede skjedd når forespørselen er sendt?',
          answer:
            'Nei. En innsendt forespørsel venter på vurdering hos en advokat. Det er ikke juridisk rådgivning, det er ingen bekreftet time, og innsendingen skaper i seg selv ikke et klientforhold.',
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
        'Denne delen gjelder bare kontaktskjemaet på disse veiledningssidene. Den beskriver hvordan opplysningene behandles, og gir ingen teknisk sikkerhet.',
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
            'Mottaksnummeret brukes til å finne igjen forespørselen din hos oss. Det vises etter lagringen, og du kan oppgi det når du tar kontakt på nytt.',
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
            'Dette nettstedet driftes hos Vercel, og det du sender inn, lagres i en ikke-offentlig skylagring hos denne tjenesten. E-post sendes via e-posttjenesten kontoret bruker.',
            'Enkelte leverandørers servere kan stå utenfor Taiwan, slik at opplysningene dine kan lagres og behandles der. Når formålet med lagringen er oppfylt, slettes opplysningene uten ugrunnet opphold; opplysninger som må oppbevares etter gjeldende regler, beholdes i den perioden. Henvendelser om personopplysninger sendes til wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'FORBEHOLD',
      title: 'Omfang og grenser for opplysningene på denne siden',
      description:
        'Opplysningenes alminnelige karakter, det rettslige anvendelsesområdet og forutsetningene for et klientforhold.',
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
          heading: 'Et klientforhold oppstår ikke av seg selv',
          paragraphs: [
            'Å lese denne siden, å sende et skjema eller en e-post skaper i seg selv ikke et klientforhold.',
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
            'De fire listene er ordnet etter artiklenes originalspråk. De er ikke oversettelser. Artiklene som finnes på norsk, står særskilt på denne siden.',
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
          heading: 'Hva en artikkel kan brukes til som orientering',
          paragraphs: [
            'Artiklene er alminnelige opplysninger på publiseringstidspunktet. Regler og praksis kan endre seg, og en artikkel dekker ikke alle omstendighetene i din sak.',
            'Ikke ta en beslutning i en konkret sak bare ut fra en artikkel. Bruk den til å få oversikt, og drøft dine egne dokumenter særskilt med en advokat; denne siden er ikke et rådgivningsmøte.',
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
    pricing: 'Palkkiot',
    contact: 'Yhteystiedot',
    faq: 'Usein kysyttyä',
    privacy: 'Tietosuoja',
    disclaimer: 'Vastuuvapaus',
    columns: 'Artikkelit',
  },
  contactCta: 'Lähettäkää yhteydenottopyyntö',
  footerNotice:
    'Tämä suomenkielinen sivu sisältää vain yleisiä ohjeita toimiston työstä Taiwanin oikeuden mukaan. Se ei ole oikeudellista neuvontaa yksittäisessä asiassa, eikä viestin lähettäminen yksinään synnytä suhdetta asianajajan ja päämiehen välillä.',
  skipLink: 'Ohittakaa navigointi ja siirtykää sisältöön',
  menuLabel: 'Valikko',
  languageLabel: 'Näyttökieli',
  mega: {
    services: {
      description: 'Toimisto käsittelee Taiwanin oikeuden keskeisiä oikeudenaloja.',
      viewAllLabel: 'Näytä kaikki',
    },
    columns: {
      description: 'Artikkeleita Taiwanin oikeuden yleisistä kysymyksistä.',
      viewAllLabel: 'Näytä kaikki',
    },
    lawyers: {
      description: 'Esittely toimiston asianajajista ja yhteydenottotavoista.',
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
    servicesAssistanceBefore: 'Jos on epäselvää, mihin oikeudenalaan asianne kuuluu, sivu ',
    servicesAssistanceLinkLabel: 'Yhteystiedot',
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
        'Hovering International Law Firm avustaa ulkomaisia päämiehiä, myös Taiwan-yhteyden omaavia, Taiwanin oikeuden mukaisissa asioissa: sijoittaminen ja yhtiön perustaminen, siviiliriidat, avioliitto, perhe ja perintö, työlainsäädäntö, rikosasiat ja immateriaalioikeus. Tämä suomenkielinen osa auttaa teitä näkemään, mikä työ kuuluu alaamme, mitä on valmisteltava ja miten tavoitatte meidät. Kyse on yleisistä tiedoista, ei oikeudellisesta neuvonnasta omassa asiassanne.',
      sections: [
        {
          heading: 'Mitä teemme',
          paragraphs: [
            'Hovering International Law Firm on Taiwanissa perustettu asianajotoimisto. Se toimii Taiwanin oikeuden mukaan ja sillä on toimistot Taipeissa (臺北), Kaohsiungissa (高雄), Taichungissa (臺中) ja Pingtungissa (屏東). Neuvomme yrityksiä ja hoidamme oikeudenkäyntejä sekä avustamme ulkomaisia päämiehiä Taiwanissa tarvittavissa vaiheissa.',
            'Koko sisältö täällä on yleistä. Asian tulos riippuu tosiseikoista, sovellettavista säännöistä ja ajankohdasta. Nämä ohjeet eivät korvaa keskustelua asianajajan kanssa asiakirjoistanne.',
          ],
        },
        {
          heading: 'Sivun kieli ja neuvontakieli eivät ole sama asia',
          paragraphs: [
            'Tämä sivu on kirjoitettu suomeksi, mutta neuvonta asianajajan kanssa tapahtuu vain neljällä neuvontakielellä: englanti, kiina (中文), japani ja korea. Ohjeiden lukeminen suomeksi ei tarkoita, että keskustelu asianajajan kanssa tapahtuisi suomeksi.',
            'Emme lupaa tulkkia, vastausaikaa emmekä tapaamista tämän sivun kautta. Jos ette osaa mitään neljästä kielestä, sivu ”Yhteystiedot” selittää, miten viestintätapaa selvitetään.',
          ],
        },
        {
          heading: 'Oikeudenalat',
          paragraphs: [
            'Työalaamme kuuluvat seuraavat kuusi oikeudenalaa. Sivu ”Palvelut” kuvaa kunkin oikeudenalan tarkemmin ja kertoo, mitä ei luvata.',
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
            'Lukekaa ensin sivu ”Palvelut” nähdäksenne, kuuluuko asianne alaamme, ja sen jälkeen sivut ”Palkkiot” ja ”Yhteystiedot”, joista käy ilmi, miten työn laajuus ja kulut vahvistetaan ennen työn alkamista.',
            'Viestiä lähettäessänne voitte kirjoittaa yhteenvedon omalla kielellänne. Alkuperäinen teksti säilytetään sellaisena kuin kirjoititte sen, eikä sitä käännetä automaattisesti. Lähetetty viesti on tarkistusta odottava pyyntö: se ei ole vielä neuvontaa eikä vahvistettu tapaaminen.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'PALVELUT',
      title: 'Mitä asioita käsittelemme',
      description:
        'Kuusi oikeudenalaa Taiwanin toimistossa ja rajat, jotka teidän on hyvä tuntea ensin.',
      intro:
        'Alla ovat oikeudenalat, joita tosiasiassa käsittelemme, ja kysymykset, joita alkuvaiheessa usein esitetään. Esitys auttaa teitä arvioimaan, kuuluuko asianne alaamme; se on yleinen eikä yksittäisen asian oikeudellinen analyysi.',
      sections: [
        {
          heading: 'Sijoittaminen ja yhtiön perustaminen Taiwanissa',
          paragraphs: [
            'Avustamme ulkomaisia sijoittajia ja yrityksiä yhtiön perustamisessa ja toiminnassa Taiwanissa: oikeudellisen muodon valinta, asiakirjojen valmistelu ja jättäminen, pääomansijoitus, pankkiasiat, toimitilan tarkastus sekä toimialavaatimukset. Tuemme myös kirjanpitoa ja veroja, jotka syntyvät perustamisesta ja toiminnasta Taiwanissa.',
            'Menettelyn vaiheet ja kesto vaihtelevat yhtiömuodon, sijoittajan, toimialan, pankin ja jo olemassa olevien asiakirjojen mukaan. Yhtiön perustaminen ei yksin johda oleskelulupaan (居留) tai työlupaan (工作許可): ne ovat erillisiä menettelyjä, jotka arvioidaan henkilön tilanteen mukaan.',
          ],
        },
        {
          heading: 'Siviiliriidat ja vahingonkorvaus',
          paragraphs: [
            'Tähän oikeudenalaan kuuluvat sopimusriidat, sopimuksen ulkopuolinen vahingonkorvausvastuu ja kuluttajariidat. Työ alkaa yleensä tapahtumien aikajärjestyksen selvittämisestä sekä olemassa olevien asiakirjojen ja todisteiden läpikäynnistä, ja vasta sen jälkeen sovitaan seuraavista vaiheista.',
            'Määräajat, myös vanhentuminen, ja todisteiden kattavuus vaikuttavat ratkaisevasti asian etenemiseen. Ilmoittakaa siksi tunnetut päivämäärät mahdollisimman varhain. Säilyttäkää sopimukset, viestit, maksutositteet tai valokuvat paikan tilanteesta ja mainitkaa ne ensimmäisessä viestissä.',
          ],
        },
        {
          heading: 'Avioliitto, perhe ja perintö',
          paragraphs: [
            'Käsittelemme avioeroa (離婚), omaisuuden jakoa, alaikäisten lasten huoltoa (未成年子女權利義務之行使或負擔), tapaamisoikeutta (會面交往) ja perintöä (繼承), myös kun osapuolet tai varallisuus ovat eri valtioissa. Rajat ylittävät perheasiat edellyttävät usein lisäselvitystä kotitalousrekisteröinnistä (戶籍), asiakirjojen muodosta ja niiden todistusarvosta Taiwanissa.',
            'Koska perheasioihin liittyy usein määräaikoja ja rinnakkaisia menettelyjä, ensimmäisen yhteenvedon tulisi nimetä osapuolten suhde, nykyinen asuinpaikka ja jo käynnissä olevat menettelyt.',
          ],
        },
        {
          heading: 'Työoikeudelliset riidat',
          paragraphs: [
            'Tähän oikeudenalaan kuuluvat työsuhteen päättyminen, Taiwanin oikeuden mukainen eroraha (資遣費; ei rinnastettavissa muiden valtioiden vastaaviin järjestelyihin), palkka ja riidat työsopimuksesta (勞動契約), sekä työntekijän että työnantajan puolella. Tarkastuksessa erotamme päättämisperusteen ilmoitusta, maksua ja määräaikoja koskevista kysymyksistä.',
            'Työsopimus, työsäännöt (工作規則), palkkalaskelmat ja osapuolten kirjeenvaihto ovat yleensä ratkaisevat asiakirjat. Jos teillä on ne vielä, mainitkaa se yhteenvedossa.',
          ],
        },
        {
          heading: 'Rikosasiat',
          paragraphs: [
            'Avustamme esitutkinnassa ja tuomioistuimessa sekä epäiltyjä tai syytettyjä että asianomistajia, ja arvioimme yritystoiminnan rikosoikeudellisia riskejä.',
            'Rikosasioissa on usein lyhyet määräajat ja määrätyt vaiheet. Jos olette jo saaneet asiakirjan syyttäjältä tai tuomioistuimelta, mainitkaa sen päivämäärä varhain, jotta sisältö käydään läpi oikeassa järjestyksessä.',
          ],
        },
        {
          heading: 'Immateriaalioikeus',
          paragraphs: [
            'Avustamme tavaramerkkien (商標) ja patenttien (專利) rekisteröinnissä, tekijänoikeudessa ja näitä oikeuksia koskevissa riidoissa Taiwanissa.',
            'Tällä oikeudenalalla vaiheiden järjestys ratkaisee: suojan laajuus, hakemusajankohta ja tosiasiallinen käyttö vaikuttavat valintaan. Hakemuksen jättäminen ei yksin merkitse, että se hyväksytään.',
          ],
        },
        {
          heading: 'Laajuus ja sen vahvistaminen',
          paragraphs: [
            'Toimisto toimii Taiwanin oikeuden mukaan ja käsittelee asioita edellä mainituilla oikeudenaloilla. Kunkin asian laajuus vahvistetaan erikseen sen jälkeen, kun asianajaja on tarkistanut viestinne.',
            'Oleskeluasema, työlupa ja vastaavat kysymykset arvioidaan asiakirjoista ja henkilön tilanteesta, ei kansalaisuudesta. Jos osa asiastanne koskee tällaisia kysymyksiä, mainitkaa se yhteydenotossa. Tämä sivu ei lupaa tulosta eikä vastausaikaa.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'TOIMISTO',
      title: 'Tietoa toimistosta Hovering International Law Firm',
      description:
        'Perustiedot tästä taiwanilaisesta asianajotoimistosta, sen toimistoista ja työstä ulkomaisten osapuolten kanssa.',
      intro:
        'Hovering International Law Firm on asianajotoimisto Taiwanissa. Asianajajat hoitavat sekä yritysten neuvontaa että oikeudenkäyntejä. Tämä osa kuvaa toimiston syntyä, paikkoja ja työtä ulkomaisten osapuolten kanssa.',
      sections: [
        {
          heading: 'Perustaminen ja rakentuminen',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) perustivat vuonna 2016 asianajajat, jotka ovat opiskelleet National Taiwan Universityssa (國立臺灣大學). Kiinankielinen nimi 昊鼎 yhdistää merkin 昊 (”laaja taivas”) merkkiin 鼎 (”luja perusta”) ja kuvaa toimiston suuntaa perustamisesta lähtien.',
            'Meillä on toimistot Taipeissa (臺北), Kaohsiungissa (高雄), Taichungissa (臺中) ja Pingtungissa (屏東). Kaohsiungin toimisto keskittyy yhtiöoikeuteen ja yritysten hallintoon ja käsittelee siviili-, rikos- ja hallinto-oikeudellisia riitoja. Taichungin toimisto käsittelee rakennusasioita, immateriaalioikeutta ja Korean ja Japanin yhteyden omaavia asioita. Pingtungin toimisto avattiin vuonna 2017 paikallista tarvetta varten.',
            'Asianajotyön rinnalla on vuodesta 2020 myös Hovering Accounting Office, joka tarjoaa kirjanpitoa ja verosuunnittelua yrittäjille ja varakkaille yksityishenkilöille.',
          ],
        },
        {
          heading: 'Työ ulkomaisten osapuolten kanssa',
          paragraphs: [
            'Rajat ylittävään työhön kuuluvat yhtiön perustaminen, viisumit, tavaramerkki- ja patenttihakemukset, oikeudellinen riskitarkastus ja yritysten veroneuvonta. Taichungin toimisto käsittelee erityisesti rakennusasioita, immateriaalioikeutta ja Korean ja Japanin yhteyden omaavia asioita. Asianajaja Wei Tseng (曾雋崴) avustaa päämiehiä Koreasta, Japanista ja muualta maailmasta näillä oikeudenaloilla.',
            'Se, voimmeko ottaa asian vastaan, riippuu sisällöstä ja viestinnän kielestä. Jos asianne kuuluu mainittuihin oikeudenaloihin ja sitä voidaan käsitellä yhdellä neljästä neuvontakielestä, voitte lähettää yhteenvedon tarkistettavaksi.',
          ],
        },
        {
          heading: 'Kun otatte meihin yhteyttä',
          paragraphs: [
            'Kun yhteenvedonne on saapunut, asianajaja tarkistaa sisällön ja puhuu sitten mahdollisesta työn laajuudesta, vielä tarvittavista asiakirjoista ja seuraavista vaiheista. Vero- tai kirjanpitokysymyksissä toimisto voi työskennellä kirjanpito-osaston kanssa saman toimeksiannon puitteissa.',
            'Kunkin asian tulos riippuu tosiseikoista ja olemassa olevista asiakirjoista; emme lupaa tulosta. Jos tarvitsette sitovan vastauksen tilanteeseenne, asiakirjat on käsiteltävä asianajajan kanssa yhdellä neljästä neuvontakielestä.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ASIANAJAJAT',
      title: 'Hoveringin kansainvälinen tiimi',
      description: 'Hoveringin asianajajien, operatiivisen johdon ja yhteistyökumppanina toimivan tilitoimiston profiilit.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'PALKKIOT',
      title: 'Miten työn laajuus ja kulut vahvistetaan',
      description:
        'Selitys järjestyksestä: ensin työn laajuus, sitten kulujen vahvistaminen, ja miksi tällä sivulla ei ole hinnastoa.',
      intro:
        'Tämä sivu selittää, miten kulut vahvistetaan, ei niiden määrää. Määrä riippuu yksittäisen asian työn laajuudesta ja on mielekäs vasta, kun tuo laajuus on selvä.',
      sections: [
        {
          heading: 'Ensin vahvistetaan työn laajuus',
          paragraphs: [
            'Samanlaisissakin asioissa työmäärä voi vaihdella suuresti osapuolten määrän, käytettävissä olevien asiakirjojen, määräaikojen ja sen mukaan, onko menettely jo alkanut. Siksi ensimmäinen vaihe on aina vahvistaa, mikä kuuluu työhön ja mikä ei.',
            'Yhteenveto, jonka lähetätte alussa, on tämän laajuuden perusta. Mitä selkeämmin se kuvaa tapahtumien kulun, pyyntönne ja määräajat, sitä tarkemmin laajuus voidaan määrittää.',
          ],
        },
        {
          heading: 'Kulut vahvistetaan ennen työn alkamista',
          paragraphs: [
            'Kun työn laajuus on selvä, määrästä ja laskentatavasta keskustellaan teidän kanssanne ja ne vahvistetaan ennen työn alkamista. Jos laajuus muuttuu matkan varrella, se on vahvistettava uudelleen.',
            'Tämä sivu ei ole tarjous hinnasta eikä synnytä maksuvelvollisuutta. Pyynnön lähettäminen tältä sivulta on myös maksutonta.',
          ],
        },
        {
          heading: 'Neuvonta voi olla maksullinen',
          paragraphs: [
            'Neuvonta asianajajan kanssa voi olla maksullinen palvelu. Tämä sivu ei sano, että ensimmäinen keskustelu olisi maksuton, eikä mitään osaa saa lukea niin.',
            'Jos neuvonta on maksullinen, määrä ja maksutapa ilmoitetaan ennen sen tapahtumista.',
          ],
        },
        {
          heading: 'Miksi tällä sivulla ei ole taksoja',
          paragraphs: [
            'Kulut riippuvat asiasta itsestään: työmäärästä, osapuolten määrästä, asiakirjoista, määräajoista ja siitä, onko menettely jo käynnissä. Etukäteen ilmoitettu summa ei kertoisi, mitä kulut teidän asiassanne olisivat. Siksi vahvistamme ensin työn laajuuden ja ilmoitamme teille sitten kulut, ennen kuin työ alkaa.',
            'Asianajopalkkion lisäksi voi syntyä tuomioistuin-, viranomais- tai kolmannen osapuolen kuluja. Ne ovat erillisiä palkkiosta ja riippuvat kyseisestä menettelystä.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'YHTEYSTIEDOT',
      title: 'Miten tavoitatte toimiston',
      description:
        'Sivun kieli, neuvontakielet, menettely, jos ette osaa mitään neljästä kielestä, ja mitä tämä sivu ei lupaa.',
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
            'Neuvontakieli: Neuvonta tapahtuu vain englanniksi, kiinaksi (中文), japaniksi ja koreaksi.',
            'Kieli, jolla kirjoitatte: Voitte kirjoittaa yhteenvedon omalla kielellänne; alkuperäinen teksti säilytetään muuttamattomana.',
          ],
        },
        {
          heading: 'Jos ette osaa mitään neljästä neuvontakielestä',
          paragraphs: [
            'Yhteydenottolomakkeessa voitte valita ”En osaa mitään neljästä kielestä — viestintätapa on vahvistettava”. Otamme yhteyttä selvittääksemme, onko käyttökelpoista viestintätapaa olemassa; neuvontaa muulla kielellä ei luvata eikä vastausaikaa luvata.',
            'Tämä on vain selvitysvaihe, ei lupaus. Emme lupaa tulkkia, emme neuvontaa suomeksi tai muulla kielellä näiden neljän kielen ulkopuolella, emmekä sitä, että otamme vastaan jokaista asiaa.',
          ],
        },
        {
          heading: 'Mitä ensimmäisessä viestissä tulisi olla',
          paragraphs: [
            'Ilmoittakaa, mitä on tapahtunut, millaista apua tarvitsette, mikä yhteys asialla on Taiwaniin, ja määräaika, jos tunnette sen. Jos olette jo saaneet asiakirjan tuomioistuimelta tai viranomaiselta, mainitkaa sen päivämäärä.',
            'Alkuvaiheessa teidän ei vielä tarvitse lähettää passinumeroa, henkilötunnusta, tilitietoja, potilasasiakirjoja tai koko todistusaineistoa. Odottakaa asianajajan ohjeita ja lähettäkää sitten arkaluonteiset asiakirjat suojattua kanavaa pitkin.',
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
      eyebrow: 'USEIN KYSYTTYÄ',
      title: 'Usein kysytyt kysymykset',
      description:
        'Selityksiä työalasta, valmistelusta, kielistä, kuluista ja lähetetyn pyynnön merkityksestä.',
      intro:
        'Seuraaviin kysymyksiin vastataan yleisten tietojen tasolla. Vastaus omaan asiaanne on mahdollinen vasta sen jälkeen, kun asianajaja on tarkistanut asiakirjat.',
      sections: [
        {
          heading: 'Miten käytätte tätä osaa',
          paragraphs: [
            'Jos ette löydä vastausta tilanteeseenne, vastaus riippuu yleensä erityisistä tosiseikoista. Kirjoittakaa nämä tosiseikat yhteenvetoon sen sijaan, että yrittäisitte päätellä vastauksen itse tältä sivulta.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Mitä asioita toimisto käsittelee?',
          answer:
            'Käsittelemme kuutta oikeudenalaa: sijoittaminen ja yhtiön perustaminen Taiwanissa, siviiliriidat ja vahingonkorvaus, avioliitto, perhe ja perintö, työoikeudelliset riidat, rikosasiat ja immateriaalioikeus. Se, otammeko asian vastaan, ratkeaa sisällön läpikäynnin jälkeen.',
        },
        {
          question: 'Mitä teidän tulisi valmistella ennen yhteydenottoa?',
          answer:
            'Valmistelkaa lyhyt yhteenveto tapahtumien kulusta, pyynnöstänne, Taiwan-yhteydestä ja määräajasta, jos sellainen on. Jos tuomioistuimen tai viranomaisen asiakirja on jo olemassa, mainitkaa sen päivämäärä. Tässä vaiheessa teidän ei vielä tarvitse lähettää henkilöllisyysasiakirjoja tai koko todistusaineistoa.',
        },
        {
          question: 'Voitteko saada neuvontaa suomeksi?',
          answer:
            'Ei. Nämä ohjeet on kirjoitettu suomeksi, mutta neuvonta asianajajan kanssa tapahtuu vain englanniksi, kiinaksi (中文), japaniksi ja koreaksi. Emme myöskään lupaa tulkkia. Kirjallinen käännös on eri asia: alkuperäinen teksti, jonka kirjoitatte, säilytetään sellaisenaan eikä sitä käännetä automaattisesti.',
        },
        {
          question: 'Entä jos ette osaa mitään neljästä kielestä?',
          answer:
            'Valitkaa lähettäessänne ”En osaa mitään neljästä kielestä — viestintätapa on vahvistettava”. Otamme yhteyttä selvittääksemme, onko käyttökelpoista viestintätapaa olemassa, mutta neuvontaa muulla kielellä ei luvata. Tämä on selvitysvaihe, ei lupaus siitä, että voimme työskennellä muulla kielellä.',
        },
        {
          question: 'Miten suomenkielistä tekstiänne käsitellään?',
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
          question: 'Entä jos asianne on hyvin kiireellinen?',
          answer:
            'Ilmoittakaa määräaika tai virallisen kirjoituksen päivämäärä yhteenvedon alussa, jotta nämä tiedot näkyvät tarkistuksessa. Tällä sivulla ei ole päivystystä eikä se lupaa vastausaikaa; jos asianne ei voi odottaa, teidän on syytä samalla hakea muuta apua omalta paikkakunnaltanne.',
        },
      ],
    },
    privacy: {
      eyebrow: 'TIETOSUOJA',
      title: 'Yhteydenottolomakkeella kerättävät tiedot',
      description:
        'Mitä yhteydenottolomake tässä suomenkielisessä osassa kerää, miten alkuperäinen teksti käsitellään ja miten tavoitatte meidät tietojanne koskien.',
      intro:
        'Tämä osa koskee vain näiden ohjesivujen yhteydenottolomaketta. Se kuvaa tietojen käsittelyä, ei teknistä takausta.',
      sections: [
        {
          heading: 'Mitä tietoja kerätään',
          paragraphs: [
            'Kun lähetätte pyynnön tämän osan lomakkeella, merkitään seuraavat tiedot:',
          ],
          items: [
            'Ilmoittamanne nimi',
            'Sähköpostiosoite vastausta varten',
            'Sivun näyttökieli lähettäessänne',
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
            'Tekstinne säilytetään juuri sellaisena kuin kirjoititte sen, eikä sitä käännetä automaattisesti. Jos käännös on tarpeen käsittelyä varten, siitä sovitaan erikseen teidän kanssanne.',
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
            'Lähetettyjä tietoja käytetään pyynnön tarkistamiseen, vastaukseen teille, viestintätavan selvittämiseen ja käsittelyyn, jos työ otetaan vastaan.',
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
          heading: 'Oikeutenne ja yhteydenotto',
          paragraphs: [
            'Voitte pyytää tietojenne tarkastusta, oikaisua tai poistamista tai peruuttaa suostumuksen yhteyssivulla ilmoitetun sähköpostiosoitteen kautta. Jos on lakisääteinen tai menettelyyn liittyvä säilytysvelvollisuus, selitämme rajoituksen.',
            'Tämä sivu ei ilmoita kiinteää säilytysaikaa, koska tosiasiallinen kesto riippuu siitä, jatketaanko asiaa, ja siihen liittyvistä velvollisuuksista. Jos toivotte aikaisempaa poistoa, ilmoittakaa se yhteydenotossa.',
          ],
        },
        {
          heading: 'Säilytyspaikka ja palveluntarjoajat',
          paragraphs: [
            'Tätä sivustoa isännöi Vercel, ja lähetyksenne säilytetään tämän palvelun ei-julkisessa tallennustilassa. Sähköpostit lähetetään toimiston käyttämän sähköpostipalvelun kautta.',
            'Yksittäisten palveluntarjoajien palvelimet voivat sijaita Taiwanin ulkopuolella, joten tietojanne voidaan säilyttää ja käsitellä siellä. Kun säilytystarkoitus on täytetty, tiedot poistetaan viivytyksettä; tiedot, jotka on säilytettävä sovellettavien sääntöjen mukaan, jäävät siksi ajaksi. Henkilötietopyynnöt voi lähettää osoitteeseen wei@hoveringlaw.com.tw.',
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
            'Sisältö ei ole neuvontaa muun oikeusjärjestyksen kuin Taiwanin mukaan, mukaan lukien asuinpaikkanne oikeus. Jos osa asiastanne koskee toista oikeusjärjestystä, selvitämme teidän kanssanne, millaista pätevää asiantuntemusta siihen osaan tarvitaan.',
          ],
        },
        {
          heading: 'Suhde asianajajan ja päämiehen välillä ei synny itsestään',
          paragraphs: [
            'Tämän sivun lukeminen, lomakkeen tai sähköpostin lähettäminen ei yksinään synnytä suhdetta asianajajan ja päämiehen välillä.',
            'Tämä suhde syntyy vasta sen jälkeen, kun asia on tarkistettu ja molemmat osapuolet ovat vahvistaneet, että toimisto ottaa toimeksiannon vastaan.',
          ],
        },
        {
          heading: 'Ei lupausta tuloksesta',
          paragraphs: [
            'Mikään osa tästä sivusta ei ole lupaus asian tuloksesta, hakemuksen hyväksymisestä tai oleskeluluvasta ja työluvasta.',
            'Ulkoiset linkit on tarkoitettu yleiskuvan saamiseen; emme vastaa kolmansien sisältöjen oikeellisuudesta emmekä ajantasaisuudesta.',
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
          heading: 'Mihin asti artikkelista voi olla apua',
          paragraphs: [
            'Artikkelit ovat yleistä tietoa julkaisuajankohtana. Säännöt ja niiden soveltaminen voivat muuttua, eikä artikkeli kata kaikkia asianne olosuhteita.',
            'Älkää siksi tehkö todellisessa asiassa päätöksiä pelkästään artikkelin perusteella. Käyttäkää sitä yleiskuvan saamiseen ja keskustelkaa asiakirjoistanne erikseen asianajajan kanssa; tämä sivu ei ole neuvontavaihe.',
          ],
        },
      ],
    },
  },
};

