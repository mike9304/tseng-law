import { describe, expect, it } from 'vitest';
import {
  guidanceContent,
  type GuidanceLocale,
  type GuidancePageKey,
} from '@/data/international-guidance-content';
import { guidanceAnswers } from '@/data/international-guidance-answers';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';

/**
 * Disclosure-element parity across the four guidance languages.
 *
 * Why this test exists (WO-O37): the guidance copy has no source-language
 * original. vi/id/th/fil sit side by side in the data files and nothing was
 * ever compared across them, so a disclaimer element could be present in one
 * language and simply absent in another — and a per-language review could not
 * see it, because each language reads fine on its own. The four-language pivot
 * back-gloss found exactly that: `contact/1/p0` carried three limiting
 * statements in Vietnamese, two in Indonesian and one in Thai and Filipino.
 *
 * What the test asserts, and what it deliberately does not:
 *
 *   - It never asserts a sentence. No expected copy is written down here, so
 *     rewording a paragraph in one language does not break it.
 *   - Each disclosure element is named by a stable KEY. For every key the
 *     registry records, per locale, the marker that language uses for that
 *     element — the token, not the sentence.
 *   - The assertion is differential: for each surface it derives the SET OF
 *     KEYS actually present in the live data for each locale, and requires the
 *     four sets to be equal. Dropping a limiting statement from one language
 *     makes that language's set smaller than the other three and fails.
 *
 * A reader-protection statement is a union, never a majority vote: if one
 * language carries it, its absence anywhere else is the defect. Each surface's `required` list
 * therefore also has a second test demanding that every registered element be
 * present in all four, so "all four dropped it" cannot pass as parity alone.
 */

const LOCALES = ['vi', 'id', 'th', 'fil', 'ar', 'de', 'es', 'fr', 'pt', 'zh-hans', 'ms', 'ru', 'tr', 'it', 'nl', 'pl', 'hi', 'sv', 'da', 'nb', 'fi', 'cs', 'hu', 'ro', 'uk', 'el', 'he'] as const satisfies readonly GuidanceLocale[];

/** Per-locale marker for one disclosure element. */
type ElementMarkers = Record<GuidanceLocale, RegExp>;

/**
 * The disclosure elements, by key.
 *
 * Each marker is the shortest token that identifies the element in that
 * language. Markers are intentionally not full sentences: the point is to
 * detect the presence of a proposition, not to freeze its wording.
 */
const ELEMENTS = {
  /** The reply confirms a way to communicate only if a workable one exists. */
  'feasible-method-only': {
    vi: /khả thi/i,
    id: /memungkinkan/i,
    th: /เป็นไปได้/,
    fil: /posible/i,
    ar: /طريقة ممكنة/,
    de: /praktikabl/,
    es: /forma posible|vía posible/,
    fr: /manière possible/,
    pt: /forma possível/,
    'zh-hans': /可行/,
    ms: /yang boleh digunakan/,
    ru: /возможн/,
    tr: /Kullanılabilir/,
    it: /praticabile/,
    nl: /werkbare/,
    pl: /możliwy sposób/,
    hi: /व्यावहारिक|व्यवहार्य/,
    sv: /farbar|användbar/,
    da: /farbar|brugbar/,
    nb: /farbar|brukbar/,
    fi: /käyttökelpois/,
    cs: /schůdný/,
    hu: /járható/,
    ro: /cale de comunicare pe care o putem folosi/,
    uk: /придатний/,
    el: /εφικτό/,
    he: /מעשית/,
    bn: /व्यावहारिक|व्यवहार्य/, // SCAFFOLD(hi)
    ur: /طريقة ممكنة/, // SCAFFOLD(ar)
    fa: /طريقة ممكنة/, // SCAFFOLD(ar)
    my: /เป็นไปได้/, // SCAFFOLD(th)
    ta: /व्यावहारिक|व्यवहार्य/, // SCAFFOLD(hi)
    ne: /व्यावहारिक|व्यवहार्य/, // SCAFFOLD(hi)
    km: /เป็นไปได้/, // SCAFFOLD(th)
    mn: /возможн/, // SCAFFOLD(ru)
    sk: /schůdný/, // SCAFFOLD(cs)
    bg: /возможн/, // SCAFFOLD(ru)
    hr: /schůdný/, // SCAFFOLD(cs)
    sr: /schůdný/, // SCAFFOLD(cs)
    sl: /izvedljiv/,
    lt: /tinkam[ąa]s? bendravimo būd/,
    lv: /schůdný/, // SCAFFOLD(cs)
    et: /schůdný/, // SCAFFOLD(cs)
    ca: /schůdný/, // SCAFFOLD(cs)
    is: /schůdný/, // SCAFFOLD(cs)
  },
  /** Support in a language outside the four consultation languages is not guaranteed. */
  'no-other-language-guarantee': {
    vi: /ngôn ngữ (nào ngoài|khác)/i,
    id: /bahasa lain/i,
    th: /ภาษาอื่น/,
    fil: /(ibang|alinmang) wika/i,
    ar: /لغة أخرى/,
    de: /anderen Sprache/,
    es: /otro idioma/,
    fr: /autre langue/,
    pt: /outra língua/,
    'zh-hans': /其他语言/,
    ms: /bahasa lain/,
    ru: /друг(?:ом|ого) язык/,
    tr: /başka dil/,
    it: /un’altra lingua/,
    nl: /andere taal/,
    pl: /innym języku/,
    hi: /अन्य भाषा/,
    sv: /annat språk/,
    da: /andet sprog/,
    nb: /annet språk/,
    fi: /muulla kielellä|toisella kielellä/,
    cs: /v jiném jazyce zaručena není/,
    hu: /más nyelvű szolgáltatás nem garantált/,
    ro: /în altă limbă nu este garantată/,
    uk: /іншою мовою не гарантовано/,
    el: /σε άλλη γλώσσα δεν είναι εγγυημένη/,
    he: /בשפה אחרת אינו מובטח/,
    bn: /अन्य भाषा/, // SCAFFOLD(hi)
    ur: /لغة أخرى/, // SCAFFOLD(ar)
    fa: /لغة أخرى/, // SCAFFOLD(ar)
    my: /ภาษาอื่น/, // SCAFFOLD(th)
    ta: /अन्य भाषा/, // SCAFFOLD(hi)
    ne: /अन्य भाषा/, // SCAFFOLD(hi)
    km: /ภาษาอื่น/, // SCAFFOLD(th)
    mn: /друг(?:ом|ого) язык/, // SCAFFOLD(ru)
    sk: /v jiném jazyce zaručena není/, // SCAFFOLD(cs)
    bg: /друг(?:ом|ого) язык/, // SCAFFOLD(ru)
    hr: /v jiném jazyce zaručena není/, // SCAFFOLD(cs)
    sr: /v jiném jazyce zaručena není/, // SCAFFOLD(cs)
    sl: /v drugem jeziku ni zagotovljena/,
    lt: /kita kalba nėra garantuojama/,
    lv: /v jiném jazyce zaručena není/, // SCAFFOLD(cs)
    et: /v jiném jazyce zaručena není/, // SCAFFOLD(cs)
    ca: /v jiném jazyce zaručena není/, // SCAFFOLD(cs)
    is: /v jiném jazyce zaručena není/, // SCAFFOLD(cs)
  },
  /** No reply time is promised. */
  'no-reply-time-promise': {
    vi: /thời gian phản hồi/i,
    id: /waktu balasan/i,
    th: /ระยะเวลา(ในการ)?ตอบกลับ/,
    fil: /panahon ng pagsagot/i,
    ar: /مدة للرد/,
    de: /Antwortfrist/,
    es: /plazo de respuesta/,
    fr: /délai de réponse/,
    pt: /prazo de resposta/,
    'zh-hans': /回复时限/,
    ms: /tempoh jawapan/,
    ru: /срок[а]? ответа/,
    tr: /[Yy]anıt süresi/,
    it: /termine di risposta/,
    nl: /antwoordtermijn/,
    pl: /termin(?:u)? odpowiedzi/,
    hi: /उत्तर की समयसीमा/,
    sv: /svarstid/,
    da: /svartid/,
    nb: /svartid/,
    fi: /vastausaika/,
    cs: /lhůtu k odpovědi|lhůta k odpovědi/,
    hu: /válaszadási határidőt/,
    ro: /termen de răspuns/,
    uk: /строку відповіді|строк відповіді/,
    el: /προθεσμία απάντησης/,
    he: /מועד למענה/,
    bn: /उत्तर की समयसीमा/, // SCAFFOLD(hi)
    ur: /مدة للرد/, // SCAFFOLD(ar)
    fa: /مدة للرد/, // SCAFFOLD(ar)
    my: /ระยะเวลา(ในการ)?ตอบกลับ/, // SCAFFOLD(th)
    ta: /उत्तर की समयसीमा/, // SCAFFOLD(hi)
    ne: /उत्तर की समयसीमा/, // SCAFFOLD(hi)
    km: /ระยะเวลา(ในการ)?ตอบกลับ/, // SCAFFOLD(th)
    mn: /срок[а]? ответа/, // SCAFFOLD(ru)
    sk: /lhůtu k odpovědi|lhůta k odpovědi/, // SCAFFOLD(cs)
    bg: /срок[а]? ответа/, // SCAFFOLD(ru)
    hr: /lhůtu k odpovědi|lhůta k odpovědi/, // SCAFFOLD(cs)
    sr: /lhůtu k odpovědi|lhůta k odpovědi/, // SCAFFOLD(cs)
    sl: /rok za odgovor|roka za odgovor/,
    lt: /atsakymo termino|atsakymo terminas/,
    lv: /lhůtu k odpovědi|lhůta k odpovědi/, // SCAFFOLD(cs)
    et: /lhůtu k odpovědi|lhůta k odpovědi/, // SCAFFOLD(cs)
    ca: /lhůtu k odpovědi|lhůta k odpovědi/, // SCAFFOLD(cs)
    is: /lhůtu k odpovědi|lhůta k odpovědi/, // SCAFFOLD(cs)
  },
  /** The confirmation step is a step, not a promise. */
  'confirmation-is-not-a-promise': {
    vi: /không phải lời hứa/i,
    id: /bukan janji\./i,
    th: /ไม่ใช่คำมั่น/,
    fil: /hindi pangako/i,
    ar: /لا وعد/,
    de: /kein Versprechen/,
    es: /no es una promesa/,
    fr: /non une promesse/,
    pt: /não é uma promessa/,
    'zh-hans': /不是承诺/,
    ms: /bukan janji/,
    ru: /не обещание/,
    tr: /vaat değil/,
    it: /non è una promessa/,
    nl: /geen belofte/,
    pl: /nie jest obietnicą/,
    hi: /वादा नहीं/,
    sv: /inte ett löfte/,
    da: /ikke et løfte/,
    nb: /ikke et løfte/,
    fi: /ei lupaus/,
    cs: /příslib/,
    hu: /nem ígéret/,
    ro: /nu o promisiune/,
    uk: /не обіцянка/,
    el: /όχι υπόσχεση/,
    he: /לא הבטחה/,
    bn: /वादा नहीं/, // SCAFFOLD(hi)
    ur: /لا وعد/, // SCAFFOLD(ar)
    fa: /لا وعد/, // SCAFFOLD(ar)
    my: /ไม่ใช่คำมั่น/, // SCAFFOLD(th)
    ta: /वादा नहीं/, // SCAFFOLD(hi)
    ne: /वादा नहीं/, // SCAFFOLD(hi)
    km: /ไม่ใช่คำมั่น/, // SCAFFOLD(th)
    mn: /не обещание/, // SCAFFOLD(ru)
    sk: /příslib/, // SCAFFOLD(cs)
    bg: /не обещание/, // SCAFFOLD(ru)
    hr: /příslib/, // SCAFFOLD(cs)
    sr: /příslib/, // SCAFFOLD(cs)
    sl: /obljub/,
    lt: /pažad/,
    lv: /příslib/, // SCAFFOLD(cs)
    et: /příslib/, // SCAFFOLD(cs)
    ca: /příslib/, // SCAFFOLD(cs)
    is: /příslib/, // SCAFFOLD(cs)
  },
  /** No interpreter is arranged. */
  'no-interpreter-promise': {
    vi: /phiên dịch/i,
    id: /penerjemah/i,
    th: /ล่าม/,
    fil: /interpreter/i,
    ar: /ترجمة فورية/,
    de: /Dolmetscher/,
    es: /intérprete/,
    fr: /interprétation/,
    pt: /interpretação/,
    'zh-hans': /口译/,
    ms: /jurubahasa/,
    ru: /переводчик/,
    tr: /tercüman/i,
    it: /interprete/,
    nl: /tolk/,
    pl: /tłumacza ustnego/,
    hi: /दुभाषि/,
    sv: /tolk/,
    da: /tolk/,
    nb: /tolk/,
    fi: /tulkk/,
    cs: /tlumočník/,
    hu: /tolmács/i,
    ro: /interpret/,
    uk: /перекладач/i,
    el: /διερμηνέα/,
    he: /מתורגמן/,
    bn: /दुभाषि/, // SCAFFOLD(hi)
    ur: /ترجمة فورية/, // SCAFFOLD(ar)
    fa: /ترجمة فورية/, // SCAFFOLD(ar)
    my: /ล่าม/, // SCAFFOLD(th)
    ta: /दुभाषि/, // SCAFFOLD(hi)
    ne: /दुभाषि/, // SCAFFOLD(hi)
    km: /ล่าม/, // SCAFFOLD(th)
    mn: /переводчик/, // SCAFFOLD(ru)
    sk: /tlumočník/, // SCAFFOLD(cs)
    bg: /переводчик/, // SCAFFOLD(ru)
    hr: /tlumočník/, // SCAFFOLD(cs)
    sr: /tlumočník/, // SCAFFOLD(cs)
    sl: /tolmač/,
    lt: /vertėjo žodžiu|vertėjas žodžiu/,
    lv: /tlumočník/, // SCAFFOLD(cs)
    et: /tlumočník/, // SCAFFOLD(cs)
    ca: /tlumočník/, // SCAFFOLD(cs)
    is: /tlumočník/, // SCAFFOLD(cs)
  },
  /** Not every matter can be accepted. */
  'not-every-matter-accepted': {
    vi: /mọi vụ việc/i,
    id: /setiap perkara/i,
    th: /ได้ทุกเรื่อง/,
    fil: /bawat usapin/i,
    ar: /قبول كل قضية/,
    de: /jede Sache/,
    es: /todos los asuntos/,
    fr: /toutes les affaires/,
    pt: /todos os assuntos/,
    'zh-hans': /每一件事项/,
    ms: /setiap hal/,
    ru: /каждое дело/,
    tr: /her işi/,
    it: /ogni questione/,
    nl: /elke zaak/,
    pl: /każdą sprawę/,
    hi: /प्रत्येक मामला/,
    sv: /varje ärende/,
    da: /hver sag/,
    nb: /hver sak/,
    fi: /jokaista asiaa/,
    cs: /každou věc/,
    hu: /minden ügyet/,
    ro: /orice cauză/,
    uk: /кожну справу/,
    el: /κάθε υπόθεση/,
    he: /כל עניין/,
    bn: /प्रत्येक मामला/, // SCAFFOLD(hi)
    ur: /قبول كل قضية/, // SCAFFOLD(ar)
    fa: /قبول كل قضية/, // SCAFFOLD(ar)
    my: /ได้ทุกเรื่อง/, // SCAFFOLD(th)
    ta: /प्रत्येक मामला/, // SCAFFOLD(hi)
    ne: /प्रत्येक मामला/, // SCAFFOLD(hi)
    km: /ได้ทุกเรื่อง/, // SCAFFOLD(th)
    mn: /каждое дело/, // SCAFFOLD(ru)
    sk: /každou věc/, // SCAFFOLD(cs)
    bg: /каждое дело/, // SCAFFOLD(ru)
    hr: /každou věc/, // SCAFFOLD(cs)
    sr: /každou věc/, // SCAFFOLD(cs)
    sl: /vsak[oe] zadev/,
    lt: /kiekvieną bylą/,
    lv: /každou věc/, // SCAFFOLD(cs)
    et: /každou věc/, // SCAFFOLD(cs)
    ca: /každou věc/, // SCAFFOLD(cs)
    is: /každou věc/, // SCAFFOLD(cs)
  },
  /** No outcome is promised. */
  'no-outcome-promise': {
    vi: /kết quả/i,
    id: /hasil/i,
    th: /รับประกันผล/,
    fil: /resulta/i,
    ar: /التزام ب(?:ال)?نتيجة/,
    de: /Ergebnis/,
    es: /resultado/,
    fr: /résultat/,
    pt: /resultado/,
    'zh-hans': /结果/,
    ms: /hasil/,
    ru: /результат/,
    tr: /sonuç/,
    it: /risultato/,
    nl: /resultaat/,
    pl: /wyniku/,
    hi: /परिणाम/,
    sv: /resultat/,
    da: /resultat/,
    nb: /resultat/,
    fi: /tulosta/,
    cs: /výsledek/,
    hu: /eredményt/,
    ro: /rezultat/,
    uk: /результат/,
    el: /αποτέλεσμα/,
    he: /תוצאה/,
    bn: /परिणाम/, // SCAFFOLD(hi)
    ur: /التزام ب(?:ال)?نتيجة/, // SCAFFOLD(ar)
    fa: /التزام ب(?:ال)?نتيجة/, // SCAFFOLD(ar)
    my: /รับประกันผล/, // SCAFFOLD(th)
    ta: /परिणाम/, // SCAFFOLD(hi)
    ne: /परिणाम/, // SCAFFOLD(hi)
    km: /รับประกันผล/, // SCAFFOLD(th)
    mn: /результат/, // SCAFFOLD(ru)
    sk: /výsledek/, // SCAFFOLD(cs)
    bg: /результат/, // SCAFFOLD(ru)
    hr: /výsledek/, // SCAFFOLD(cs)
    sr: /výsledek/, // SCAFFOLD(cs)
    sl: /izid/,
    lt: /rezultat/,
    lv: /výsledek/, // SCAFFOLD(cs)
    et: /výsledek/, // SCAFFOLD(cs)
    ca: /výsledek/, // SCAFFOLD(cs)
    is: /výsledek/, // SCAFFOLD(cs)
  },
  /** A certain answer needs one of the four consultation languages. */
  'four-consultation-languages': {
    vi: /bốn ngôn ngữ tư vấn/i,
    id: /empat bahasa konsultasi/i,
    th: /4 ภาษาที่ใช้ให้คำปรึกษา/,
    fil: /apat na wika ng konsultasyon/i,
    ar: /اللغات الأربع/,
    de: /vier Beratungssprachen/,
    es: /cuatro idiomas de consulta/,
    fr: /quatre langues de consultation/,
    pt: /quatro línguas de consulta/,
    'zh-hans': /四种咨询语言/,
    ms: /empat bahasa perundingan/,
    ru: /четырёх язык/,
    tr: /dört görüşme dil/,
    it: /quattro lingue di consulenza/,
    nl: /vier consultatietalen/,
    pl: /czterech języ(?:kach|ków) konsultacji/,
    hi: /चार परामर्श भाषा/,
    sv: /fyra rådgivningsspråk/,
    da: /fire rådgivningssprog/,
    nb: /fire rådgivningsspråk/,
    fi: /neljästä neuvontakielestä/,
    cs: /čtyř/,
    hu: /négy nyelv|négy tanácsadási nyelv/,
    ro: /patru limbi|celor patru limbi/,
    uk: /чотир/,
    el: /τέσσερ|τεσσάρ/,
    he: /ארבע/,
    bn: /चार परामर्श भाषा/, // SCAFFOLD(hi)
    ur: /اللغات الأربع/, // SCAFFOLD(ar)
    fa: /اللغات الأربع/, // SCAFFOLD(ar)
    my: /4 ภาษาที่ใช้ให้คำปรึกษา/, // SCAFFOLD(th)
    ta: /चार परामर्श भाषा/, // SCAFFOLD(hi)
    ne: /चार परामर्श भाषा/, // SCAFFOLD(hi)
    km: /4 ภาษาที่ใช้ให้คำปรึกษา/, // SCAFFOLD(th)
    mn: /четырёх язык/, // SCAFFOLD(ru)
    sk: /čtyř/, // SCAFFOLD(cs)
    bg: /четырёх язык/, // SCAFFOLD(ru)
    hr: /čtyř/, // SCAFFOLD(cs)
    sr: /čtyř/, // SCAFFOLD(cs)
    sl: /štirih/,
    lt: /ketur/,
    lv: /čtyř/, // SCAFFOLD(cs)
    et: /čtyř/, // SCAFFOLD(cs)
    ca: /čtyř/, // SCAFFOLD(cs)
    is: /čtyř/, // SCAFFOLD(cs)
  },
  /** This page is not the consultation step. */
  'not-the-consultation-step': {
    vi: /bước tư vấn/i,
    id: /tahap konsultasi/i,
    th: /ขั้นตอนการให้คำปรึกษา/,
    fil: /hakbang ng konsultasyon/i,
    ar: /خطوة استشارة/,
    de: /Beratungsschritt/,
    es: /paso de consulta/,
    fr: /étape de consultation/,
    pt: /passo de consulta/,
    'zh-hans': /咨询步骤/,
    ms: /langkah perundingan/,
    ru: /шагом консультации/,
    tr: /görüşme adımı/,
    it: /passo di consulenza/,
    nl: /consultatiestap/,
    pl: /etapem konsultacji/,
    hi: /परामर्श चरण/,
    sv: /rådgivningssteget/,
    da: /rådgivningsskridtet/,
    nb: /rådgivningsmøte/,
    fi: /neuvontavaihe/,
    cs: /krokem porady|krok porady/,
    hu: /nem helyettesíti a tanácsadást/,
    ro: /pasul consultanței/,
    uk: /не є консультацією/,
    el: /βήμα της συμβουλευτικής/,
    he: /שלב הייעוץ/,
    bn: /परामर्श चरण/, // SCAFFOLD(hi)
    ur: /خطوة استشارة/, // SCAFFOLD(ar)
    fa: /خطوة استشارة/, // SCAFFOLD(ar)
    my: /ขั้นตอนการให้คำปรึกษา/, // SCAFFOLD(th)
    ta: /परामर्श चरण/, // SCAFFOLD(hi)
    ne: /परामर्श चरण/, // SCAFFOLD(hi)
    km: /ขั้นตอนการให้คำปรึกษา/, // SCAFFOLD(th)
    mn: /шагом консультации/, // SCAFFOLD(ru)
    sk: /krokem porady|krok porady/, // SCAFFOLD(cs)
    bg: /шагом консультации/, // SCAFFOLD(ru)
    hr: /krokem porady|krok porady/, // SCAFFOLD(cs)
    sr: /krokem porady|krok porady/, // SCAFFOLD(cs)
    sl: /korak posveta/,
    lt: /konsultacijos žingsnis/,
    lv: /krokem porady|krok porady/, // SCAFFOLD(cs)
    et: /krokem porady|krok porady/, // SCAFFOLD(cs)
    ca: /krokem porady|krok porady/, // SCAFFOLD(cs)
    is: /krokem porady|krok porady/, // SCAFFOLD(cs)
  },
  /** A sent message is not legal advice. */
  'not-legal-advice': {
    vi: /ý kiến pháp lý/i,
    id: /nasihat hukum/i,
    th: /ความเห็นทางกฎหมาย/,
    fil: /legal na payo/i,
    ar: /رأيًا قانوني/,
    de: /keine Rechtsberatung/,
    es: /asesoramiento jurídico/,
    fr: /avis juridique/,
    pt: /parecer jurídico/,
    'zh-hans': /法律意见/,
    ms: /nasihat undang-undang/,
    ru: /юридическ/,
    tr: /hukuki görüş/,
    it: /parere giuridico/,
    nl: /juridisch advies/,
    pl: /poradą prawną/,
    hi: /कानूनी राय/,
    sv: /juridiskt yttrande/,
    da: /juridisk udtalelse/,
    nb: /juridisk uttalelse/,
    fi: /oikeudellinen lausunto/,
    cs: /právní\w* stanovisk/,
    hu: /jogi állásfoglalás/,
    ro: /opinie juridică/,
    uk: /юридичн[а-яіїєґ]* висновк/,
    el: /νομική γνώμη/,
    he: /חוות דעת משפטית/,
    bn: /कानूनी राय/, // SCAFFOLD(hi)
    ur: /رأيًا قانوني/, // SCAFFOLD(ar)
    fa: /رأيًا قانوني/, // SCAFFOLD(ar)
    my: /ความเห็นทางกฎหมาย/, // SCAFFOLD(th)
    ta: /कानूनी राय/, // SCAFFOLD(hi)
    ne: /कानूनी राय/, // SCAFFOLD(hi)
    km: /ความเห็นทางกฎหมาย/, // SCAFFOLD(th)
    mn: /юридическ/, // SCAFFOLD(ru)
    sk: /právní\w* stanovisk/, // SCAFFOLD(cs)
    bg: /юридическ/, // SCAFFOLD(ru)
    hr: /právní\w* stanovisk/, // SCAFFOLD(cs)
    sr: /právní\w* stanovisk/, // SCAFFOLD(cs)
    sl: /pravn\w* mnenj/,
    lt: /teisinė nuomonė/,
    lv: /právní\w* stanovisk/, // SCAFFOLD(cs)
    et: /právní\w* stanovisk/, // SCAFFOLD(cs)
    ca: /právní\w* stanovisk/, // SCAFFOLD(cs)
    is: /právní\w* stanovisk/, // SCAFFOLD(cs)
  },
  /** A sent message is not a confirmed appointment. */
  'not-an-appointment': {
    vi: /lịch hẹn/i,
    id: /janji temu/i,
    th: /การนัดหมาย/,
    fil: /appointment/i,
    ar: /موعد|مواعيد/,
    de: /Termin/,
    es: /cita/,
    fr: /rendez-vous/,
    pt: /marcação/,
    'zh-hans': /预约/,
    ms: /janji temu/,
    ru: /запись/,
    tr: /randevu/,
    it: /appuntamento/,
    nl: /afspraak/,
    pl: /spotkani|terminem/,
    hi: /नियुक्ति/,
    sv: /\btid\b/,
    da: /\btid\b/,
    nb: /\btime\b/,
    fi: /tapaamista|tapaaminen/,
    cs: /schůzk/,
    hu: /időpont/,
    ro: /programare/,
    uk: /зустріч/,
    el: /ραντεβού/,
    he: /פגישה/,
    bn: /नियुक्ति/, // SCAFFOLD(hi)
    ur: /موعد|مواعيد/, // SCAFFOLD(ar)
    fa: /موعد|مواعيد/, // SCAFFOLD(ar)
    my: /การนัดหมาย/, // SCAFFOLD(th)
    ta: /नियुक्ति/, // SCAFFOLD(hi)
    ne: /नियुक्ति/, // SCAFFOLD(hi)
    km: /การนัดหมาย/, // SCAFFOLD(th)
    mn: /запись/, // SCAFFOLD(ru)
    sk: /schůzk/, // SCAFFOLD(cs)
    bg: /запись/, // SCAFFOLD(ru)
    hr: /schůzk/, // SCAFFOLD(cs)
    sr: /schůzk/, // SCAFFOLD(cs)
    sl: /sestank/,
    lt: /susitikim/,
    lv: /schůzk/, // SCAFFOLD(cs)
    et: /schůzk/, // SCAFFOLD(cs)
    ca: /schůzk/, // SCAFFOLD(cs)
    is: /schůzk/, // SCAFFOLD(cs)
  },
  /** Sending a message forms no attorney–client relationship. */
  'no-attorney-client-relationship': {
    vi: /quan hệ giữa luật sư/i,
    id: /hubungan antara advokat/i,
    th: /ความสัมพันธ์ระหว่างทนายความ/,
    fil: /ugnayan ng abogado/i,
    ar: /علاقة بين المحامي/,
    de: /Mandatsverhältnis/,
    es: /relación entre abogado/,
    fr: /relation entre avocate ou avocat/,
    pt: /relação entre advogada ou advogado/,
    'zh-hans': /律师与委托人关系/,
    ms: /hubungan antara peguam/,
    ru: /отношений между адвокатом/,
    tr: /avukat ile müvekkil/,
    it: /rapporto tra avvocata o avvocato/,
    nl: /relatie tussen advocaat/,
    pl: /stosunku między adwokatem/,
    hi: /अधिवक्ता तथा मुवक्किल/,
    sv: /förhållande mellan advokat/,
    da: /forhold mellem advokat/,
    nb: /forhold mellom advokat/,
    fi: /suhdetta asianajajan ja päämiehen/,
    cs: /vztah mezi advokát/,
    hu: /ügyvéd–ügyfél/,
    ro: /relație între avocat/,
    uk: /між адвокатом і клієнтом/,
    el: /σχέση δικηγόρου/,
    he: /עורך דין–לקוח/,
    bn: /अधिवक्ता तथा मुवक्किल/, // SCAFFOLD(hi)
    ur: /علاقة بين المحامي/, // SCAFFOLD(ar)
    fa: /علاقة بين المحامي/, // SCAFFOLD(ar)
    my: /ความสัมพันธ์ระหว่างทนายความ/, // SCAFFOLD(th)
    ta: /अधिवक्ता तथा मुवक्किल/, // SCAFFOLD(hi)
    ne: /अधिवक्ता तथा मुवक्किल/, // SCAFFOLD(hi)
    km: /ความสัมพันธ์ระหว่างทนายความ/, // SCAFFOLD(th)
    mn: /отношений между адвокатом/, // SCAFFOLD(ru)
    sk: /vztah mezi advokát/, // SCAFFOLD(cs)
    bg: /отношений между адвокатом/, // SCAFFOLD(ru)
    hr: /vztah mezi advokát/, // SCAFFOLD(cs)
    sr: /vztah mezi advokát/, // SCAFFOLD(cs)
    sl: /razmerje med odvetnic/,
    lt: /advokato ir kliento santyk/,
    lv: /vztah mezi advokát/, // SCAFFOLD(cs)
    et: /vztah mezi advokát/, // SCAFFOLD(cs)
    ca: /vztah mezi advokát/, // SCAFFOLD(cs)
    is: /vztah mezi advokát/, // SCAFFOLD(cs)
  },
  /** Written text is never machine-translated for the reader. */
  'no-automatic-translation': {
    vi: /dịch tự động/i,
    id: /diterjemahkan secara otomatis/i,
    th: /แปลโดยอัตโนมัติ/,
    fil: /awtomatikong isinasalin/i,
    ar: /ترجمة آلية/,
    de: /nicht automatisch übersetzt/,
    es: /traduce de forma automática|traducción automática/,
    fr: /traduit automatiquement/,
    pt: /traduz de forma automática|traduzido de forma automática/,
    'zh-hans': /自动翻译/,
    ms: /secara automatik/,
    ru: /автоматически не переводится/,
    tr: /kendiliğinden çevril/,
    it: /tradotto automaticamente/,
    nl: /niet automatisch vertaald/,
    pl: /tłumaczon[ay] automatycznie/,
    hi: /स्वचालित/,
    sv: /automatiskt/,
    da: /automatisk/,
    nb: /automatisk/,
    fi: /automaattisesti/,
    cs: /automaticky/,
    hu: /automatikusan/,
    ro: /automat/,
    uk: /автоматично/,
    el: /αυτόματα/,
    he: /אוטומטית/,
    bn: /स्वचालित/, // SCAFFOLD(hi)
    ur: /ترجمة آلية/, // SCAFFOLD(ar)
    fa: /ترجمة آلية/, // SCAFFOLD(ar)
    my: /แปลโดยอัตโนมัติ/, // SCAFFOLD(th)
    ta: /स्वचालित/, // SCAFFOLD(hi)
    ne: /स्वचालित/, // SCAFFOLD(hi)
    km: /แปลโดยอัตโนมัติ/, // SCAFFOLD(th)
    mn: /автоматически не переводится/, // SCAFFOLD(ru)
    sk: /automaticky/, // SCAFFOLD(cs)
    bg: /автоматически не переводится/, // SCAFFOLD(ru)
    hr: /automaticky/, // SCAFFOLD(cs)
    sr: /automaticky/, // SCAFFOLD(cs)
    sl: /samodejno/,
    lt: /automatišk/,
    lv: /automaticky/, // SCAFFOLD(cs)
    et: /automaticky/, // SCAFFOLD(cs)
    ca: /automaticky/, // SCAFFOLD(cs)
    is: /automaticky/, // SCAFFOLD(cs)
  },
  /** The family group is named as covering marriage matters. */
  'marriage-in-family-group': {
    vi: /hôn nhân/i,
    id: /perkawinan/i,
    th: /การสมรส/,
    fil: /pag-aasawa/i,
    ar: /الزواج/,
    de: /Ehe/,
    es: /matrimonio/i,
    fr: /mariage/i,
    pt: /casamento/i,
    'zh-hans': /婚姻/,
    ms: /perkahwinan/i,
    ru: /брак/i,
    tr: /evlilik/i,
    it: /matrimonio/i,
    nl: /huwelijk/i,
    pl: /małżeństwo/i,
    hi: /विवाह/,
    sv: /äktenskap/i,
    da: /ægteskab/i,
    nb: /ekteskap/i,
    fi: /avioliitto/i,
    cs: /manželství/i,
    hu: /házasság/i,
    ro: /căsătorie/i,
    uk: /шлюб/i,
    el: /γάμ/i,
    he: /נישואין/,
    bn: /विवाह/, // SCAFFOLD(hi)
    ur: /الزواج/, // SCAFFOLD(ar)
    fa: /الزواج/, // SCAFFOLD(ar)
    my: /การสมรส/, // SCAFFOLD(th)
    ta: /विवाह/, // SCAFFOLD(hi)
    ne: /विवाह/, // SCAFFOLD(hi)
    km: /การสมรส/, // SCAFFOLD(th)
    mn: /брак/i, // SCAFFOLD(ru)
    sk: /manželství/i, // SCAFFOLD(cs)
    bg: /брак/i, // SCAFFOLD(ru)
    hr: /manželství/i, // SCAFFOLD(cs)
    sr: /manželství/i, // SCAFFOLD(cs)
    sl: /zakonsk/i,
    lt: /santuok/i,
    lv: /manželství/i, // SCAFFOLD(cs)
    et: /manželství/i, // SCAFFOLD(cs)
    ca: /manželství/i, // SCAFFOLD(cs)
    is: /manželství/i, // SCAFFOLD(cs)
  },
  /** Meeting the attorney may be a paid service. */
  'consultation-may-be-paid': {
    vi: /thu phí/i,
    id: /berbayar/i,
    th: /บริการที่มีค่าใช้จ่าย/,
    fil: /bayad na serbisyo/i,
    ar: /خدمة بمقابل/,
    de: /entgeltlich/,
    es: /servicio de pago/,
    fr: /prestation payante/,
    pt: /serviço pago/,
    'zh-hans': /有偿/,
    ms: /berbayar/,
    ru: /возмездн/,
    tr: /ücretli/,
    it: /a pagamento/,
    nl: /tegen betaling/,
    pl: /odpłatn/,
    hi: /शुल्क/,
    sv: /mot betalning/,
    da: /mod betaling/,
    nb: /mot betaling/,
    fi: /maksullinen/,
    cs: /úplatn/,
    hu: /díjköteles/,
    ro: /contra cost/,
    uk: /платn|платн/,
    el: /με αμοιβή/,
    he: /בתשלום/,
    bn: /शुल्क/, // SCAFFOLD(hi)
    ur: /خدمة بمقابل/, // SCAFFOLD(ar)
    fa: /خدمة بمقابل/, // SCAFFOLD(ar)
    my: /บริการที่มีค่าใช้จ่าย/, // SCAFFOLD(th)
    ta: /शुल्क/, // SCAFFOLD(hi)
    ne: /शुल्क/, // SCAFFOLD(hi)
    km: /บริการที่มีค่าใช้จ่าย/, // SCAFFOLD(th)
    mn: /возмездн/, // SCAFFOLD(ru)
    sk: /úplatn/, // SCAFFOLD(cs)
    bg: /возмездн/, // SCAFFOLD(ru)
    hr: /úplatn/, // SCAFFOLD(cs)
    sr: /úplatn/, // SCAFFOLD(cs)
    sl: /plačljiv/,
    lt: /mokam/,
    lv: /úplatn/, // SCAFFOLD(cs)
    et: /úplatn/, // SCAFFOLD(cs)
    ca: /úplatn/, // SCAFFOLD(cs)
    is: /úplatn/, // SCAFFOLD(cs)
  },
} as const satisfies Record<string, ElementMarkers>;

type ElementKey = keyof typeof ELEMENTS;

/** One reader-facing surface whose disclosure elements must match across locales. */
type Surface = {
  /** Human-readable slot name, in the pivot's `{page} / {section}` index form. */
  readonly id: string;
  /** The elements this surface must carry in every language. */
  readonly required: readonly ElementKey[];
  /** Reads the surface's whole text for one locale. */
  readonly read: (locale: GuidanceLocale) => string;
};

function section(page: GuidancePageKey, index: number) {
  return (locale: GuidanceLocale): string => {
    const target = guidanceContent[locale].pages[page].sections[index];
    if (!target) throw new Error(`${locale}: ${page} has no section ${index}`);
    return [target.heading, ...target.paragraphs, ...(target.items ?? [])].join(' ');
  };
}

function lastSection(page: GuidancePageKey) {
  return (locale: GuidanceLocale): string => {
    const sections = guidanceContent[locale].pages[page].sections;
    const target = sections[sections.length - 1];
    if (!target) throw new Error(`${locale}: ${page} has no sections`);
    return [target.heading, ...target.paragraphs, ...(target.items ?? [])].join(' ');
  };
}

function answer(page: 'services' | 'about' | 'pricing' | 'contact' | 'faq') {
  return (locale: GuidanceLocale): string => guidanceAnswers[locale][page]?.answer ?? '';
}

function faqItem(index: number) {
  return (locale: GuidanceLocale): string => {
    const item = guidanceContent[locale].pages.faq.faqs?.[index];
    if (!item) throw new Error(`${locale}: faq has no item ${index}`);
    return `${item.question} ${item.answer}`;
  };
}

function pageIntro(page: GuidancePageKey) {
  return (locale: GuidanceLocale): string => guidanceContent[locale].pages[page].intro;
}

const SURFACES: readonly Surface[] = [
  {
    id: 'contact / 1 (when the four consultation languages do not work for you)',
    required: [
      'feasible-method-only',
      'no-other-language-guarantee',
      'no-reply-time-promise',
      'confirmation-is-not-a-promise',
      'no-interpreter-promise',
      'not-every-matter-accepted',
    ],
    read: section('contact', 1),
  },
  {
    id: 'contact / 3 (what this page does not guarantee)',
    required: [
      'no-reply-time-promise',
      'not-an-appointment',
      'no-interpreter-promise',
      'no-automatic-translation',
    ],
    read: section('contact', 3),
  },
  {
    id: 'services / last (scope and how it is confirmed)',
    required: ['no-outcome-promise', 'no-reply-time-promise'],
    read: lastSection('services'),
  },
  {
    id: 'about / 2 (when you contact the office)',
    required: ['no-outcome-promise', 'four-consultation-languages'],
    read: section('about', 2),
  },
  {
    id: 'columns / 2 (how far an article can be relied on)',
    required: ['not-the-consultation-step'],
    read: section('columns', 2),
  },
  {
    id: 'inquiry / methodConfirmationNotice',
    required: [
      'feasible-method-only',
      'no-other-language-guarantee',
      'no-reply-time-promise',
    ],
    read: (locale) => internationalInquiryCopy[locale].methodConfirmationNotice,
  },
  {
    id: 'answers / faq',
    required: [
      'not-legal-advice',
      'not-an-appointment',
      'no-attorney-client-relationship',
    ],
    read: answer('faq'),
  },
  {
    id: 'answers / pricing',
    required: ['consultation-may-be-paid'],
    read: answer('pricing'),
  },
  {
    id: 'answers / contact',
    required: ['no-reply-time-promise', 'not-an-appointment'],
    read: answer('contact'),
  },
  {
    id: 'answers / about',
    required: ['no-outcome-promise'],
    read: answer('about'),
  },
  {
    id: 'faq / q2 (can I be advised in this language?)',
    required: ['no-interpreter-promise', 'no-automatic-translation'],
    read: faqItem(2),
  },
  {
    id: 'faq / q4 (how the text you wrote is handled)',
    required: ['no-automatic-translation'],
    read: faqItem(4),
  },
  {
    id: 'home / intro (matter groups named in the lead)',
    required: ['marriage-in-family-group'],
    read: pageIntro('home'),
  },
  {
    id: 'home / 2 (the six matter groups)',
    required: ['marriage-in-family-group'],
    read: section('home', 2),
  },
  {
    id: 'services / 2 (marriage, family and inheritance)',
    required: ['marriage-in-family-group'],
    read: section('services', 2),
  },
  {
    id: 'faq / q0 (which matters the office takes)',
    required: ['marriage-in-family-group'],
    read: faqItem(0),
  },
  {
    id: 'answers / services',
    required: ['marriage-in-family-group'],
    read: answer('services'),
  },
];

/** The keys actually present in one locale's text for one surface. */
function elementsPresent(locale: GuidanceLocale, text: string): ElementKey[] {
  return (Object.keys(ELEMENTS) as ElementKey[]).filter((key) =>
    ELEMENTS[key][locale].test(text),
  );
}

describe('guidance disclosure elements are the same set in all four languages', () => {
  it('derives an identical element-key set per surface for vi, id, th and fil', () => {
    for (const surface of SURFACES) {
      const perLocale = LOCALES.map((locale) => {
        const text = surface.read(locale);
        expect(text.trim().length, `${surface.id} / ${locale} is empty`).toBeGreaterThan(0);
        // Restrict to the elements this surface is about, so an unrelated
        // element that only one language happens to mention nearby does not
        // masquerade as a parity failure.
        const scoped = new Set<string>(surface.required);
        return {
          locale,
          keys: elementsPresent(locale, text).filter((key) => scoped.has(key)),
        };
      });

      const [reference, ...others] = perLocale;
      for (const other of others) {
        expect(
          other.keys.slice().sort(),
          `${surface.id}: ${other.locale} carries a different set of disclosure elements than ${reference.locale}`,
        ).toEqual(reference.keys.slice().sort());
      }
    }
  });

  it('carries every registered element of a surface in every language', () => {
    for (const surface of SURFACES) {
      for (const locale of LOCALES) {
        const text = surface.read(locale);
        for (const key of surface.required) {
          expect(
            ELEMENTS[key][locale].test(text),
            `${surface.id} / ${locale} is missing the "${key}" disclosure element`,
          ).toBe(true);
        }
      }
    }
  });

  /**
   * Chinese-character glosses, e.g. `離婚`, `戶籍`, `勞動契約`, `臺北`.
   *
   * A gloss is a fact the reader can carry to a Taiwanese office or court, so
   * one language annotating a term while another does not is a defect, not a
   * style choice (WO-O37 rule 4). The test reads the glosses out of the copy
   * itself — nothing is written down here except the two tokens the pivot
   * classified as wording rather than fact.
   */
  const HANJA_WORDING_EXEMPTIONS = new Set([
    // Only Indonesian repeats `(中文)` after the word for the Chinese
    // consultation language. The pivot classified this as a per-language
    // spelling habit, not a missing fact: all four name that language.
    '中文',
    // Only Indonesian names the two-character firm short-form `昊鼎` on its
    // own; the other three write 昊 and 鼎 separately in the same sentence and
    // all four carry the full 昊鼎國際法律事務所.
    '昊鼎',
  ]);

  it('annotates the same Chinese-character terms in all four languages', () => {
    const CJK = /[\u3400-\u4dbf\u4e00-\u9fff]+/g;
    const glossesIn = (text: string) =>
      [...new Set(text.match(CJK) ?? [])]
        .filter((token) => !HANJA_WORDING_EXEMPTIONS.has(token))
        .sort();

    const pageGlossesOf = (locale: GuidanceLocale, key: GuidancePageKey) => {
      const page = guidanceContent[locale].pages[key];
      return glossesIn(
        [
          page.eyebrow,
          page.title,
          page.description,
          page.intro,
          ...page.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.items ?? [])]),
          ...(page.faqs ?? []).flatMap((f) => [f.question, f.answer]),
        ].join(' '),
      );
    };

    /**
     * The answer-first summary blocks are a second published surface: a
     * generative engine may quote `guidanceAnswers[locale][key].answer`
     * verbatim, without the page body around it. Comparing only the page copy
     * left that surface unchecked, and WO-O38 found the gap in practice —
     * `國立臺灣大學` was annotated in the Indonesian and Thai `about` answers but
     * not in the Vietnamese and Filipino ones, while all four pages annotated
     * it. Answers are compared as their own set, not merged into the page set,
     * so an omission on one surface cannot be masked by the other.
     *
     * No answers-only exemption is needed: `HANJA_WORDING_EXEMPTIONS` above
     * covers the Indonesian `中文` habit, which recurs in the Indonesian
     * answers for the same reason it recurs in the Indonesian pages.
     */
    const answerGlossesOf = (locale: GuidanceLocale, key: GuidancePageKey) =>
      glossesIn(guidanceAnswers[locale][key]?.answer ?? '');

    // zh-hans is written in Chinese characters, so CJK runs are body text, not
    // Taiwan-term glosses the way they are in the other guidance languages.
    const [reference, ...others] = LOCALES.filter((locale) => locale !== 'zh-hans');
    for (const key of Object.keys(guidanceContent[reference].pages) as GuidancePageKey[]) {
      for (const locale of others) {
        expect(
          pageGlossesOf(locale, key),
          `${key}: ${locale} annotates a different set of Chinese-character terms than ${reference}`,
        ).toEqual(pageGlossesOf(reference, key));
        expect(
          answerGlossesOf(locale, key),
          `${key} answer: ${locale} annotates a different set of Chinese-character terms than ${reference}`,
        ).toEqual(answerGlossesOf(reference, key));
      }
    }
  });

  it('keeps the same page and section shape in all four languages', () => {
    const [reference, ...others] = LOCALES;
    const shapeOf = (locale: GuidanceLocale) =>
      Object.fromEntries(
        Object.entries(guidanceContent[locale].pages).map(([key, page]) => [
          key,
          {
            sections: page.sections.length,
            paragraphs: page.sections.map((s) => s.paragraphs.length),
            items: page.sections.map((s) => s.items?.length ?? 0),
            faqs: page.faqs?.length ?? 0,
          },
        ]),
      );
    for (const locale of others) {
      expect(shapeOf(locale), `${locale} page shape differs from ${reference}`).toEqual(
        shapeOf(reference),
      );
    }
  });
});
