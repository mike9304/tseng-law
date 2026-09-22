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
    bn: /ব্যবহারযোগ্য/,
    ur: /قابلِ عمل/,
    fa: /روش ممکن/,
    my: /အသုံးပြုနိုင်သော/,
    ta: /சாத்தியமான/,
    ne: /व्यवहार्य/,
    km: /អាចប្រើបាន/,
    mn: /хэрэгжүүлж болох/,
    sk: /schodný/,
    bg: /приложим начин/,
    hr: /provediv/,
    sr: /izvodljiv/,
    sl: /izvedljiv/,
    lt: /tinkam[ąa]s? bendravimo būd/,
    lv: /izmantojamu/,
    et: /kasutatav/,
    ca: /via possible/,
    is: /nothæf/,
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
    bn: /অন্য ভাষা/,
    ur: /کسی اور زبان/,
    fa: /زبان دیگر/,
    my: /အခြားဘာသာ/,
    ta: /பிற மொழி/,
    ne: /अर्को भाषा/,
    km: /ភាសាផ្សេង/,
    mn: /өөр хэл дээрх үйлчилгээ баталгаажихгүй/,
    sk: /v inom jazyku zaručená nie je/,
    bg: /друг език/,
    hr: /na drugom jeziku nije zajamčena/,
    sr: /na drugom jeziku nije zagarantovana/,
    sl: /v drugem jeziku ni zagotovljena/,
    lt: /kita kalba nėra garantuojama/,
    lv: /citā valodā nav garantēts/,
    et: /muus keeles ei tagata/,
    ca: /un altre idioma/,
    is: /öðru tungumáli/,
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
    bn: /উত্তরের সময়সীমা/,
    ur: /جواب کی مدت/,
    fa: /مهلت پاسخ/,
    my: /ပြန်ကြားချိန်/,
    ta: /பதிலளிக்கும் காலக்கெடு/,
    ne: /जवाफको समयसीमा/,
    km: /រយៈពេលឆ្លើយតប/,
    mn: /хариу өгөх хугацаа/,
    sk: /lehotu na odpoveď|lehota na odpoveď/,
    bg: /срок за отговор/,
    hr: /rok za odgovor/,
    sr: /rok za odgovor/,
    sl: /rok za odgovor|roka za odgovor/,
    lt: /atsakymo termino|atsakymo terminas/,
    lv: /atbildes termiņ/,
    et: /vastamise tähtaeg/,
    ca: /termini de resposta/,
    is: /svarfrest/,
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
    bn: /প্রতিশ্রুতি নয়/,
    ur: /وعدہ نہیں/,
    fa: /نه وعده/,
    my: /ကတိမဟုတ်/,
    ta: /வாக்குறுதி அல்ல/,
    ne: /वाचा होइन/,
    km: /មិនមែនជាការសន្យា/,
    mn: /амлалт биш/,
    sk: /prísľub/,
    bg: /не обещание/,
    hr: /ne o obećanju|nije obećanje/,
    sr: /nije obećanje/,
    sl: /obljub/,
    lt: /pažad/,
    lv: /nevis solījums/,
    et: /mitte lubadus/,
    ca: /no és una promesa/,
    is: /ekki loforð/,
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
    bn: /দোভাষী/,
    ur: /ترجمان/,
    fa: /مترجم شفاهی/,
    my: /စကားပြန်/,
    ta: /மொழிபெயர்ப்பாளர/,
    ne: /दोभाषे/,
    km: /អ្នកបកប្រែផ្ទាល់មាត់/,
    mn: /орчуулагч/,
    sk: /tlmočník/,
    bg: /преводач/,
    hr: /tumač/,
    sr: /tumača/,
    sl: /tolmač/,
    lt: /vertėjo žodžiu|vertėjas žodžiu/,
    lv: /tulku/,
    et: /tõlki/,
    ca: /intèrpret/,
    is: /túlk/,
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
    bn: /প্রতিটি মামলা/,
    ur: /ہر مقدمہ/,
    fa: /پذیرش هر پرونده/,
    my: /အမှုအားလုံး/,
    ta: /ஒவ்வொரு வழக்கையும்/,
    ne: /हरेक मुद्दा/,
    km: /ទទួលគ្រប់រឿង/,
    mn: /ямар ч хэргийг/,
    sk: /každú vec/,
    bg: /всяко дело/,
    hr: /svaki predmet/,
    sr: /svaku stvar/,
    sl: /vsak[oe] zadev/,
    lt: /kiekvieną bylą/,
    lv: /katru lietu/,
    et: /iga asja/,
    ca: /tots els assumptes/,
    is: /hvert mál/,
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
    bn: /ফলাফল/,
    ur: /نتیجے/,
    fa: /تعهد به نتیجه/,
    my: /ရလဒ်ကို အာမမခံ/,
    ta: /முடிவை உறுதி/,
    ne: /नतिजा/,
    km: /មិនធានាលទ្ធផល/,
    mn: /үр дүн/,
    sk: /výsledok/,
    bg: /резултат/,
    hr: /ishod/,
    sr: /ishod/,
    sl: /izid/,
    lt: /rezultat/,
    lv: /iznākum/,
    et: /ei luba tulemust|tulemust me ei luba/,
    ca: /resultat/,
    is: /niðurstöðu/,
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
    bn: /চার পরামর্শ ভাষা/,
    ur: /چار مشورے کی زبان/,
    fa: /چهار زبان/,
    my: /တိုင်ပင်ဆွေးနွေးရာတွင် သုံးသော ဘာသာစကား လေးမျိုး/,
    ta: /நான்கு ஆலோசனை மொழி/,
    ne: /चारवटा परामर्श भाषा/,
    km: /៤ ភាសានៃការពិគ្រោះយោបល់/,
    mn: /дөрвөн зөвлөгөөний хэл/,
    sk: /štyroch/,
    bg: /четирите езика за консултация/,
    hr: /četiri/,
    sr: /četiri jezika/,
    sl: /štirih/,
    lt: /ketur/,
    lv: /četr/,
    et: /neljast nõustamiskeelest/,
    ca: /quatre idiomes de consulta/,
    is: /fjórum ráðgjafarmál/,
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
    bn: /পরামর্শের ধাপ/,
    ur: /مشورے کا مرحلہ/,
    fa: /گام مشاوره/,
    my: /တိုင်ပင်ဆွေးနွေးသည့်အဆင့်/,
    ta: /ஆலோசனைப் படி அல்ல/,
    ne: /परामर्शको चरण/,
    km: /នីតិវិធីពិគ្រោះយោបល់/,
    mn: /зөвлөгөөний алхам биш/,
    sk: /nenahrádza poradu/,
    bg: /стъпка от консултацията/,
    hr: /korak savjetovanja/,
    sr: /korak konsultacije/,
    sl: /korak posveta/,
    lt: /konsultacijos žingsnis/,
    lv: /konsultācijas solis/,
    et: /nõustamissamm/,
    ca: /pas de consulta/,
    is: /ráðgjafarþrep/,
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
    bn: /আইনি মতামত/,
    ur: /قانونی رائے/,
    fa: /نظر حقوقی/,
    my: /ဥပဒေအကြံဉာဏ်/,
    ta: /சட்டக் கருத்து அல்ல/,
    ne: /कानुनी राय/,
    km: /យោបល់ផ្លូវច្បាប់/,
    mn: /эрх зүйн зөвлөгөө биш/,
    sk: /právn\w* stanovisk/,
    bg: /правна консултация/,
    hr: /pravn\w* mišljenj/,
    sr: /pravno mišljenje/,
    sl: /pravn\w* mnenj/,
    lt: /teisinė nuomonė/,
    lv: /juridisks atzinums/,
    et: /õiguslik seisukoht/,
    ca: /assessorament jurídic/,
    is: /lögfræðilegt álit/,
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
    bn: /সাক্ষাৎ নির্ধারণ/,
    ur: /ملاقات کا وقت/,
    fa: /وقت ملاقات/,
    my: /ချိန်းဆိုမှု/,
    ta: /சந்திப்ப/,
    ne: /निर्धारित भेट/,
    km: /ការណាត់ជួប/,
    mn: /цаг товлолт/,
    sk: /stretnut/,
    bg: /среща/,
    hr: /sastanak/,
    sr: /sastanak/,
    sl: /sestank/,
    lt: /susitikim/,
    lv: /tikšan/,
    et: /kohtumist|kohtumine/,
    ca: /cita/,
    is: /tíma í gegnum|staðfestur tími/,
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
    bn: /আইনজীবী ও মক্কেল/,
    ur: /وکیل اور موکل/,
    fa: /رابطه میان وکیل/,
    my: /ရှေ့နေနှင့်အမှုသည် ဆက်ဆံရေး/,
    ta: /வழக்கறிஞருக்கும் கட்சிக்காரருக்கும்/,
    ne: /अधिवक्ता तथा पक्षकार/,
    km: /ទំនាក់ទំនងមេធាវី/,
    mn: /өмгөөлөгч ба үйлчлүүлэгчийн харилцаа/,
    sk: /vzťah medzi advokát/,
    bg: /отношения между адвокатка или адвокат и клиент/,
    hr: /odnos između odvjetnic/,
    sr: /odnos između advokat/,
    sl: /razmerje med odvetnic/,
    lt: /advokato ir kliento santyk/,
    lv: /attiecības starp advokāt/,
    et: /suhet advokaadi ja kliendi vahel/,
    ca: /relació entre advocad/,
    is: /samband milli lögmanns/,
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
    bn: /স্বয়ংক্রিয়/,
    ur: /خودکار ترجمہ/,
    fa: /ترجمهٔ ماشینی/,
    my: /အလိုအလျောက် ဘာသာပြန်/,
    ta: /தானியங்கியாக மொழிபெயர்க்கப்படாது/,
    ne: /स्वतः अनुवाद/,
    km: /បកប្រែដោយស្វ័យប្រវត្តិ/,
    mn: /автоматаар орчуулагдахгүй|автоматаар орчуулахгүй/,
    sk: /automaticky/,
    bg: /не се превежда автоматично/,
    hr: /automatski/,
    sr: /automatski/,
    sl: /samodejno/,
    lt: /automatišk/,
    lv: /automātiski/,
    et: /automaatselt/,
    ca: /de forma automàtica/,
    is: /sjálfkrafa/,
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
    bn: /বিবাহ/,
    ur: /شادی/,
    fa: /ازدواج/,
    my: /အိမ်ထောင်ရေး/,
    ta: /திருமணம்/,
    ne: /विवाह/,
    km: /អាពាហ៍ពិពាហ៍/,
    mn: /гэрлэлт/i,
    sk: /manželstvo/i,
    bg: /брак/i,
    hr: /brak/i,
    sr: /brak/i,
    sl: /zakonsk/i,
    lt: /santuok/i,
    lv: /laulīb/i,
    et: /abielu/i,
    ca: /matrimoni/i,
    is: /hjúskap/i,
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
    bn: /মূল্য পরিশোধসাপেক্ষ/,
    ur: /معاوضے/,
    fa: /خدمتی با هزینه/,
    my: /အခကြေးငွေပေးရသော/,
    ta: /கட்டணச் சேவை/,
    ne: /दस्तुर/,
    km: /សេវាដែលមានថ្លៃ/,
    mn: /төлбөртэй/,
    sk: /odplatn/,
    bg: /платен/,
    hr: /naplatn/,
    sr: /uz naknadu/,
    sl: /plačljiv/,
    lt: /mokam/,
    lv: /maksas|pret samaksu/,
    et: /tasuline/,
    ca: /servei de pagament/,
    is: /greidd/,
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
