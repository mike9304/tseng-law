import { describe, expect, it } from 'vitest';
import { intentPageSlugs } from '@/data/intent-pages';
import { guidanceAnswers } from '@/data/international-guidance-answers';
import type {
  GuidanceLocale,
  GuidancePageKey,
} from '@/data/international-guidance-content';
import { GUIDANCE_LOCALES_4, GUIDANCE_PAGE_KEYS } from '@/lib/public-guidance';

/**
 * The guidance locales this suite covers.
 *
 * Declared here instead of read from `GUIDANCE_LOCALES` in
 * `@/lib/public-guidance`: the routing constants are landed on a separate
 * branch while `ar` is added, so this file must not depend on the count or the
 * name that constant currently carries. The first assertion below pins this
 * list to the key set of `guidanceAnswers`, so a locale can never be added to
 * the data without being covered here.
 */
const GUIDANCE_LOCALES = [
  'vi',
  'id',
  'th',
  'fil',
  'ar',
  'de',
  'es',
  'fr',
  'pt',
  'zh-hans',
  'ms',
  'ru',
  'tr',
  'it',
  'nl',
  'pl',
  'hi',
  'sv',
  'da',
  'nb',
  'fi',
  'cs',
  'hu',
  'ro',
  'uk',
  'el',
  'he',
  'bn',
  'ur',
  'fa',
  'my',
  'ta',
  'ne',
  'km',
  'mn',
  'sk',
  'bg',
  'hr',
  'sr',
  'sl',
  'lt',
  'lv',
  'et',
  'ca',
  'is',
] as const satisfies readonly GuidanceLocale[];

/**
 * Local copy of `guidancePublicPath` for the same reason: it is typed over the
 * public-locale union, which does not list `ar` on this branch yet.
 */
function guidancePathFor(locale: GuidanceLocale, pageKey: GuidancePageKey): string {
  return pageKey === 'home' ? `/${locale}` : `/${locale}/${pageKey}`;
}

/** Page keys that must carry an answer-first block. */
const ANSWER_PAGE_KEYS = [
  'services',
  'about',
  'lawyers',
  'pricing',
  'contact',
  'faq',
] as const satisfies readonly GuidancePageKey[];

/** Page keys that must not carry one. */
const NO_ANSWER_PAGE_KEYS = GUIDANCE_PAGE_KEYS.filter(
  (key) => !(ANSWER_PAGE_KEYS as readonly string[]).includes(key),
);

const MIN_WORDS = 40;
const MAX_WORDS = 80;
const MIN_THAI_CHARS = 120;
const MAX_THAI_CHARS = 400;
// Burmese and Khmer stack combining marks that [...str] counts one by one, so their ceiling is wider.
const MAX_STACKED_SCRIPT_CHARS = 540;
const MIN_ZH_HANS_CHARS = 70;
const MAX_ZH_HANS_CHARS = 400;

/**
 * The four consultation languages, written the way each guidance language
 * writes them. Every answer must name all four, in its own language.
 */
const CONSULTATION_LANGUAGE_TERMS: Record<string, readonly string[]> = {
  vi: ['tiếng Anh', 'tiếng Trung', 'tiếng Nhật', 'tiếng Hàn'],
  id: ['Inggris', 'Mandarin', 'Jepang', 'Korea'],
  th: ['ภาษาอังกฤษ', 'ภาษาจีน', 'ภาษาญี่ปุ่น', 'ภาษาเกาหลี'],
  fil: ['Ingles', 'Tsino', 'Hapon', 'Koreano'],
  ar: ['بالإنجليزية', 'الصينية', 'اليابانية', 'الكورية'],
  de: ['Englisch', 'Chinesisch', 'Japanisch', 'Koreanisch'],
  es: ['inglés', 'chino', 'japonés', 'coreano'],
  fr: ['anglais', 'chinois', 'japonais', 'coréen'],
  pt: ['inglês', 'chinês', 'japonês', 'coreano'],
  'zh-hans': ['英语', '中文', '日语', '韩语'],
  ms: ['Inggeris', 'Cina', 'Jepun', 'Korea'],
  ru: ['английском', 'китайском', 'японском', 'корейском'],
  tr: ['İngilizce', 'Çince', 'Japonca', 'Korece'],
  it: ['inglese', 'cinese', 'giapponese', 'coreano'],
  nl: ['Engels', 'Chinees', 'Japans', 'Koreaans'],
  pl: ['angielsku', 'chińsku', 'japońsku', 'koreańsku'],
  hi: ['अंग्रेज़ी', 'चीनी', 'जापानी', 'कोरियाई'],
  sv: ['engelska', 'kinesiska', 'japanska', 'koreanska'],
  da: ['engelsk', 'kinesisk', 'japansk', 'koreansk'],
  nb: ['engelsk', 'kinesisk', 'japansk', 'koreansk'],
  fi: ['englanniksi', 'kiinaksi', 'japaniksi', 'koreaksi'],
  bn: ['ইংরেজি', 'চীনা', 'জাপানি', 'কোরীয়'],
  ur: ['انگریزی', 'چینی', 'جاپانی', 'کوریائی'],
  fa: ['انگلیسی', 'چینی', 'ژاپنی', 'کره‌ای'],
  ta: ['ஆங்கிலம்', 'சீனம்', 'ஜப்பானியம்', 'கொரியன்'],
  sk: ['anglicky', 'čínsky', 'japonsky', 'kórejsky'],
  bg: ['английски', 'китайски', 'японски', 'корейски'],
  hr: ['engleskom', 'kineskom', 'japanskom', 'korejskom'],
  sr: ['engleskom', 'kineskom', 'japanskom', 'korejskom'],
  sl: ['angleščini', 'kitajščini', 'japonščini', 'korejščini'],
  lt: ['anglų', 'kinų', 'japonų', 'korėjiečių'],
  lv: ['angļu', 'ķīniešu', 'japāņu', 'korejiešu'],
  et: ['inglise', 'hiina', 'jaapani', 'korea'],
  ca: ['anglès', 'xinès', 'japonès', 'coreà'],
  my: ['အင်္ဂလိပ်', 'တရုတ်', 'ဂျပန်', 'ကိုရီးယား'],
  km: ['ភាសាអង់គ្លេស', 'ភាសាចិន', 'ភាសាជប៉ុន', 'ភាសាកូរ៉េ'],
  ne: ['अङ्ग्रेजी', 'चिनियाँ', 'जापानी', 'कोरियाली'],
  mn: ['англи', 'хятад', 'япон', 'солонгос'],
  is: ['ensku', 'kínversku', 'japönsku', 'kóresku'],
};

/**
 * Language-contract guard, part 1.
 *
 * The guidance languages are page languages only. No answer may name one of
 * them at all, so no sentence can be read as an offer of a consultation,
 * interpreting, or support in that language.
 */
const GUIDANCE_LANGUAGE_TOKENS: ReadonlyArray<readonly [string, RegExp]> = [
  ['Vietnamese', /\bVietnamese\b/i],
  ['Indonesian', /\bIndonesian\b/i],
  ['Thai', /\bThai\b/i],
  ['Filipino', /\bFilipino\b/i],
  ['Tagalog', /\bTagalog\b/i],
  ['tiếng Việt', /tiếng Việt/i],
  ['bahasa Indonesia', /bahasa Indonesia/i],
  ['ภาษาไทย', /ภาษาไทย/],
  ['Arabic', /\bArabic\b/i],
  ['عربي', /عربي/],
  ['German', /\bGerman\b/i],
  ['Deutsch', /\bDeutsch\b/],
  ['Spanish', /\bSpanish\b/i],
  ['Español', /\bEspañol\b/],
  ['español', /\bespañol\b/],
  ['French', /\bFrench\b/i],
  ['Français', /\bFrançais\b/],
  ['français', /\bfrançais\b/],
  ['Portuguese', /\bPortuguese\b/i],
  ['Português', /\bPortuguês\b/],
  ['português', /\bportuguês\b/],
  ['Simplified Chinese', /Simplified Chinese/i],
  ['简体中文', /简体中文/],
  ['Malay', /\bMalay\b/i],
  ['Bahasa Melayu', /Bahasa Melayu/i],
  ['Russian', /\bRussian\b/i],
  ['Русский', /Русский/],
  ['русском', /русском/],
  ['Turkish', /\bTurkish\b/i],
  ['Türkçe', /Türkçe/],
  ['Italian', /\bItalian\b/i],
  ['Italiano', /\bItaliano\b/],
  ['italiano', /\bitaliano\b/],
  ['Dutch', /\bDutch\b/i],
  ['Nederlands', /\bNederlands\b/],
  ['Polish', /\bPolish\b/i],
  ['Polski', /\bPolski\b/],
  ['polsku', /po polsku/],
  ['Hindi', /\bHindi\b/],
  ['हिन्दी', /हिन्दी/],
  ['Swedish', /\bSwedish\b/i],
  ['Svenska', /\bSvenska\b/],
  ['svenska', /\bsvenska\b/],
  ['Danish', /\bDanish\b/i],
  ['Dansk', /\bDansk\b/],
  ['dansk', /\bdansk\b/],
  ['Norwegian', /\bNorwegian\b/i],
  ['norsk', /\bnorsk\b/],
  ['Finnish', /\bFinnish\b/i],
  ['suomeksi', /suomeksi/],
  ['bn', /বাংলা/i],
  ['ur', /اردو/i],
  ['fa', /فارسی/i],
  ['my', /မြန်မာဘာသာ/i],
  ['ta', /தமிழ்/i],
  ['ne', /नेपाली/i],
  ['km', /ភាសាខ្មែរ/i],
  ['mn', /монгол хэл/i],
  ['sk', /slovenčin|slovensky/i],
  ['bg', /българск/i],
  ['hr', /hrvatsk/i],
  ['sr', /srpsk/i],
  ['sl', /slovenščin|slovensko/i],
  ['lt', /lietuvi/i],
  ['lv', /latvie/i],
  ['et', /eesti keel/i],
  ['ca', /català/i],
  ['is', /íslensk/i],
];

/**
 * Language-contract guard, part 2: the explicit forbidden-combination list.
 *
 * Each entry is a guidance-language token paired with a consultation token.
 * A single sentence may never contain both, in either order — that is the
 * shape any "consultation available in <guidance language>" claim would take.
 */
const FORBIDDEN_COMBINATIONS: ReadonlyArray<readonly [string, RegExp, RegExp]> = [
  ['Vietnamese + consultation', /\bVietnamese\b/i, /\bconsultation\b/i],
  ['Vietnamese + tư vấn', /\bVietnamese\b/i, /tư vấn/i],
  ['tiếng Việt + consultation', /tiếng Việt/i, /\bconsultation\b/i],
  ['tiếng Việt + tư vấn', /tiếng Việt/i, /tư vấn/i],
  ['Indonesian + consultation', /\bIndonesian\b/i, /\bconsultation\b/i],
  ['Indonesian + konsultasi', /\bIndonesian\b/i, /konsultasi/i],
  ['bahasa Indonesia + consultation', /bahasa Indonesia/i, /\bconsultation\b/i],
  ['bahasa Indonesia + konsultasi', /bahasa Indonesia/i, /konsultasi/i],
  ['Thai + consultation', /\bThai\b/i, /\bconsultation\b/i],
  ['Thai + ปรึกษา', /\bThai\b/i, /ปรึกษา/],
  ['ภาษาไทย + consultation', /ภาษาไทย/, /\bconsultation\b/i],
  ['ภาษาไทย + ปรึกษา', /ภาษาไทย/, /ปรึกษา/],
  ['Filipino + consultation', /\bFilipino\b/i, /\bconsultation\b/i],
  ['Filipino + konsultasyon', /\bFilipino\b/i, /konsultasyon/i],
  ['Tagalog + consultation', /\bTagalog\b/i, /\bconsultation\b/i],
  ['Tagalog + konsultasyon', /\bTagalog\b/i, /konsultasyon/i],
  ['Arabic + consultation', /\bArabic\b/i, /\bconsultation\b/i],
  ['Arabic + استشارة', /\bArabic\b/i, /استشار/],
  ['عربي + استشارة', /عربي/, /استشار/],
  ['عربي + ترجمة فورية', /عربي/, /ترجمة فورية/],
  ['Deutsch + Beratung', /\bDeutsch\b/, /Beratung/],
  ['German + consultation', /\bGerman\b/i, /\bconsultation\b/i],
  ['español + consulta', /\bespañol\b/i, /consulta/i],
  ['Spanish + consultation', /\bSpanish\b/i, /\bconsultation\b/i],
  ['français + consultation', /\bfrançais\b/i, /consultation/i],
  ['French + consultation', /\bFrench\b/i, /\bconsultation\b/i],
  ['português + consulta', /\bportuguês\b/i, /consulta/i],
  ['Portuguese + consultation', /\bPortuguese\b/i, /\bconsultation\b/i],
  ['Bahasa Melayu + perundingan', /Bahasa Melayu/i, /perundingan/i],
  ['русском + консультац', /русском/, /консультац/],
  ['Türkçe + danışma', /Türkçe/, /danışma|görüşme/],
  ['简体中文 + 咨询', /简体中文/, /咨询/],
  ['italiano + consulenza', /\bitaliano\b/i, /consulenza/i],
  ['Nederlands + consultatie', /\bNederlands\b/i, /consultatie/i],
  ['polsku + konsultacja', /po polsku/i, /konsultacj/i],
  ['हिन्दी + परामर्श', /हिन्दी/, /परामर्श/],
  ['svenska + rådgivning', /\bsvenska\b/i, /rådgivning/i],
  ['dansk + rådgivning', /\bdansk\b/i, /rådgivning/i],
  ['norsk + rådgivning', /\bnorsk\b/i, /rådgivning/i],
  ['suomeksi + neuvonta', /suomeksi/, /neuvonta/],
];

/**
 * `services` must restate its own page, not the FAQ page.
 *
 * The services page says the scope of each matter is confirmed separately after
 * an attorney reviews the message ("Phạm vi và cách xác nhận" / "Lingkup dan
 * cara memastikannya" / "ขอบเขตและการยืนยัน" / "Saklaw at kung paano ito
 * kinukumpirma"). Whether a matter is accepted at all is a different sentence
 * that lives on the FAQ page, so it may not be lifted into a services answer.
 */
const SERVICES_SCOPE_TERMS: Record<string, readonly [string, RegExp]> = {
  vi: ['xác nhận riêng', /xác nhận riêng/i],
  id: ['lingkup', /lingkup/i],
  th: ['ขอบเขต', /ขอบเขต/],
  fil: ['saklaw', /saklaw/i],
  ar: ['نطاق كل قضية', /نطاق كل قضية/],
  de: ['Umfang', /Umfang/],
  es: ['alcance', /alcance/i],
  fr: ['étendue', /étendue/i],
  pt: ['âmbito', /âmbito/i],
  'zh-hans': ['另行确认', /另行确认/],
  ms: ['skop', /skop/i],
  ru: ['Объём', /Объём/],
  tr: ['kapsamı', /kapsamı/],
  it: ['ambito', /ambito/i],
  nl: ['omvang', /omvang/i],
  pl: ['zakres', /zakres/i],
  hi: ['दायरा', /दायरा/],
  sv: ['omfattning', /omfattning/i],
  da: ['omfang', /omfang/i],
  nb: ['omfang', /omfang/i],
  fi: ['laajuus', /laajuus/i],
  cs: ['rozsah', /rozsah/i],
  hu: ['terjedelm', /terjedelm/i],
  ro: ['întinderea', /întinderea/i],
  uk: ['обсяг', /обсяг/i],
  el: ['εύρος', /εύρος/i],
  he: ['היקף', /היקף/],
  bn: ['পরিধি', /পরিধি/],
  ur: ['دائرہ', /دائرہ/],
  fa: ['محدودهٔ', /محدوده/],
  ta: ['எல்லை', /எல்லை/],
  sk: ['Rozsah', /rozsah/i],
  bg: ['Обхват', /обхват/i],
  hr: ['Opseg', /opseg/i],
  sr: ['Obim', /obim/i],
  sl: ['Obseg', /obseg/i],
  lt: ['apimtis', /apimtis/i],
  lv: ['apjoms', /apjoms/i],
  et: ['ulatus', /ulatus/i],
  ca: ['abast', /abast/i],
  my: ['အကျယ်အဝန်း', /အကျယ်အဝန်း/],
  km: ['វិសាលភាព', /វិសាលភាព/],
  ne: ['दायरा', /दायरा/],
  mn: ['хэмжээ', /хэмжээ/i],
  is: ['Umfang', /umfang/i],
};

const SERVICES_ACCEPTANCE_PATTERNS: Record<
  string,
  ReadonlyArray<readonly [string, RegExp]>
> = {
  vi: [
    ['có nhận (một vụ việc)', /có nhận/i],
    ['được quyết định', /được quyết định/i],
  ],
  id: [
    ['diterima atau tidaknya', /diterima atau tidaknya/i],
    ['diputuskan', /diputuskan/i],
  ],
  th: [
    ['รับเรื่องใดเรื่องหนึ่ง', /รับเรื่องใดเรื่องหนึ่ง/],
    ['พิจารณาหลังจาก', /พิจารณาหลังจาก/],
  ],
  fil: [
    ['pagtanggap', /pagtanggap/i],
    ['napagpapasyahan', /napagpapasyahan/i],
  ],
  ar: [
    ['قبول قضية بعينها', /قبول قضية بعينها/],
    ['فيتقرّر', /يتقرّر/],
  ],
  de: [
    ['ob eine Sache angenommen', /ob eine Sache angenommen/i],
    ['entscheidet sich nach Prüfung', /entscheidet sich nach Prüfung/i],
  ],
  es: [
    ['si un asunto se acepta', /si un asunto se acepta/i],
    ['se decide después de revisar', /se decide después de revisar/i],
  ],
  fr: [
    ["acceptation d'une affaire", /acceptation d'une affaire/i],
    ['se décide après', /se décide après/i],
  ],
  pt: [
    ['se um assunto se aceita', /se um assunto se aceita/i],
    ['decide-se depois de rever', /decide-se depois de rever/i],
  ],
  'zh-hans': [
    ['不是法律意见', /不是法律意见/],
    ['不是已确认的预约', /不是已确认的预约/],
  ],
  ms: [
    ['bukan nasihat undang-undang', /bukan nasihat undang-undang/i],
    ['bukan janji temu', /bukan janji temu/i],
  ],
  ru: [
    ['не юридическая консультация', /не юридическая консультация/],
    ['не подтверждённая запись', /не подтверждённая запись/],
  ],
  tr: [
    ['hukuki görüş değildir', /hukuki görüş değildir/i],
    ['doğrulanmış randevu değildir', /doğrulanmış randevu değildir/i],
  ],
  it: [
    ['se una questione viene accettata', /se una questione viene accettata/i],
    ['si decide dopo', /si decide dopo/i],
  ],
  nl: [
    ['of een zaak wordt aangenomen', /of een zaak wordt aangenomen/i],
    ['beslist zich na', /beslist zich na/i],
  ],
  pl: [
    ['czy sprawa zostanie przyjęta', /czy sprawa zostanie przyjęta/i],
    ['rozstrzyga się po', /rozstrzyga się po/i],
  ],
  hi: [
    ['मामला स्वीकार', /मामला स्वीकार/],
    ['स्वीकृति का निर्णय', /स्वीकृति का निर्णय/],
  ],
  sv: [
    ['om ett ärende antas', /om ett ärende antas/i],
    ['beslutas efter granskning', /beslutas efter granskning/i],
  ],
  da: [
    ['om en sag antages', /om en sag antages/i],
    ['besluttes efter gennemgang', /besluttes efter gennemgang/i],
  ],
  nb: [
    ['om en sak tas imot', /om en sak tas imot/i],
    ['avgjøres etter gjennomgang', /avgjøres etter gjennomgang/i],
  ],
  fi: [
    ['hyväksytäänkö asia', /hyväksytäänkö asia/i],
    ['päätetään tarkastuksen jälkeen', /päätetään tarkastuksen jälkeen/i],
  ],
  cs: [
    ['bude věc přijata', /bude věc přijata/i],
    ['rozhodne', /rozhodne/i],
  ],
  hu: [
    ['elvállalunk-e', /elvállalunk-e/i],
    ['dől el', /dől el/i],
  ],
  ro: [
    ['este preluată', /este preluată/i],
    ['se hotărăște', /se hotărăște/i],
  ],
  uk: [
    ['буде справу прийнято', /буде справу прийнято/i],
    ['вирішують', /вирішують/i],
  ],
  el: [
    ['γίνεται δεκτή', /γίνεται δεκτή/i],
    ['κρίνεται', /κρίνεται/i],
  ],
  he: [
    ['יתקבל', /יתקבל/],
    ['נקבע', /נקבע/],
  ],
  bn: [['যাচাইয়ের অপেক্ষা', /যাচাইয়ের অপেক্ষা/], ['আইনি মতামত নয়', /আইনি মতামত নয়/]],
  ur: [['جانچ کا انتظار', /جانچ کا انتظار/], ['قانونی رائے نہیں', /قانونی رائے نہیں/]],
  fa: [['در انتظار بررسی', /در انتظار بررسی/], ['نظر حقوقی نیست', /نظر حقوقی نیست/]],
  ta: [['ஆய்வுக்காகக் காத்திருக்', /ஆய்வுக்காகக் காத்திருக்/], ['சட்டக் கருத்து அல்ல', /சட்டக? கருத்து அல்ல/]],
  sk: [['čaká na posúdenie', /čaká na posúdenie/i], ['nie je právnym stanoviskom', /nie je právnym stanoviskom/i]],
  bg: [['чака преглед', /чака преглед/i], ['не е правно становище', /не е правно становище/i]],
  hr: [['čeka pregled', /čeka pregled/i], ['nije pravno mišljenje', /nije pravno mišljenje/i]],
  sr: [['čeka ocenu', /čeka ocenu/i], ['nije pravno mišljenje', /nije pravno mišljenje/i]],
  sl: [['čaka na oceno', /čaka na oceno/i], ['ni pravno mnenje', /ni pravno mnenje/i]],
  lt: [['laukia įvertinimo', /laukia įvertinimo/i], ['nėra teisinė nuomonė', /nėra teisinė nuomonė/i]],
  lv: [['gaida izvērtējumu', /gaida izvērtējumu/i], ['nav juridisks atzinums', /nav juridisks atzinums/i]],
  et: [['ootab läbivaatamist', /ootab läbivaatamist/i], ['ei ole õiguslik seisukoht', /ei ole õiguslik seisukoht/i]],
  ca: [['espera revisió', /espera revisió/i], ['no és assessorament jurídic', /no és assessorament jurídic/i]],
  my: [['စစ်ဆေးရန် စောင့်ဆိုင်း', /စစ်ဆေးရန် စောင့်ဆိုင်း/], ['ဥပဒေအကြံဉာဏ် မဟုတ်', /ဥပဒေအကြံဉာဏ် မဟုတ်/]],
  km: [
    ['រង់ចាំមេធាវីពិនិត្យ', /រង់ចាំមេធាវីពិនិត្យ/],
    ['មិនមែនជាយោបល់ផ្លូវច្បាប់', /មិនមែនជាយោបល់ផ្លូវច្បាប់/],
  ],
  ne: [['जाँचको प्रतीक्षा', /जाँचको प्रतीक्षा/], ['कानुनी राय होइन', /कानुनी राय होइन/]],
  mn: [['хяналтыг хүлээнэ', /хяналтыг хүлээнэ/i], ['эрх зүйн зөвлөгөө биш', /эрх зүйн зөвлөгөө биш/i]],
  is: [['bíður mats', /bíður mats/i], ['ekki lögfræðilegt álit', /ekki lögfræðilegt álit/i]],
};

/** Every site-internal path an answer may cite. */
const ALLOWED_SOURCES = new Set<string>([
  ...GUIDANCE_LOCALES.flatMap((locale) =>
    GUIDANCE_PAGE_KEYS.map((key) => guidancePathFor(locale, key)),
  ),
  ...intentPageSlugs.map((slug) => `/en/${slug}`),
]);

/**
 * Thai has no sentence-final punctuation here, so the whole answer is treated
 * as a single sentence — a stricter check than splitting would give.
 */
function sentencesOf(locale: string, text: string): string[] {
  if (locale === 'th' || locale === 'my' || locale === 'km' || locale === 'zh-hans') return [text];
  return text.split(/(?<=[.!?])\s+/).filter((part) => part.trim().length > 0);
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const entries = GUIDANCE_LOCALES.flatMap((locale) =>
  ANSWER_PAGE_KEYS.map((key) => ({
    locale,
    key,
    entry: guidanceAnswers[locale][key],
  })),
);

describe('guidanceAnswers', () => {
  it('covers every guidance locale x 6 page keys', () => {
    expect(GUIDANCE_LOCALES).toHaveLength(GUIDANCE_LOCALES_4.length);
    expect(ANSWER_PAGE_KEYS).toHaveLength(6);
    expect(Object.keys(guidanceAnswers).sort()).toEqual([...GUIDANCE_LOCALES].sort());

    for (const locale of GUIDANCE_LOCALES) {
      expect(Object.keys(guidanceAnswers[locale]).sort()).toEqual(
        [...ANSWER_PAGE_KEYS].sort(),
      );
      for (const key of ANSWER_PAGE_KEYS) {
        const entry = guidanceAnswers[locale][key];
        expect(entry, `${locale}/${key} answer missing`).toBeDefined();
        expect(entry?.answer.trim().length, `${locale}/${key} answer empty`).toBeGreaterThan(0);
      }
    }
  });

  it('renders nothing for home, privacy, disclaimer and columns', () => {
    expect(NO_ANSWER_PAGE_KEYS).toEqual(['home', 'privacy', 'disclaimer', 'columns']);
    for (const locale of GUIDANCE_LOCALES) {
      for (const key of NO_ANSWER_PAGE_KEYS) {
        expect(guidanceAnswers[locale][key], `${locale}/${key} must have no answer`).toBeUndefined();
      }
    }
  });

  it('keeps every answer inside its length window', () => {
    for (const { locale, key, entry } of entries) {
      const answer = entry?.answer ?? '';
      if (locale === 'th' || locale === 'my' || locale === 'km') {
        const chars = [...answer].length;
        expect(chars, `${locale}/${key} chars=${chars}`).toBeGreaterThanOrEqual(MIN_THAI_CHARS);
        expect(chars, `${locale}/${key} chars=${chars}`).toBeLessThanOrEqual(locale === 'th' ? MAX_THAI_CHARS : MAX_STACKED_SCRIPT_CHARS);
      } else if (locale === 'zh-hans') {
        const chars = [...answer].length;
        expect(chars, `${locale}/${key} chars=${chars}`).toBeGreaterThanOrEqual(MIN_ZH_HANS_CHARS);
        expect(chars, `${locale}/${key} chars=${chars}`).toBeLessThanOrEqual(MAX_ZH_HANS_CHARS);
      } else {
        const words = wordCount(answer);
        expect(words, `${locale}/${key} words=${words}`).toBeGreaterThanOrEqual(MIN_WORDS);
        expect(words, `${locale}/${key} words=${words}`).toBeLessThanOrEqual(MAX_WORDS);
      }
    }
  });

  it('answers services with its own scope sentence, not the FAQ acceptance sentence', () => {
    for (const locale of GUIDANCE_LOCALES) {
      const answer = guidanceAnswers[locale].services?.answer ?? '';
      expect(answer.length, `${locale}/services answer missing`).toBeGreaterThan(0);

      const [scopeLabel, scopePattern] = SERVICES_SCOPE_TERMS[locale];
      expect(
        scopePattern.test(answer),
        `${locale}/services must confirm the scope of each matter ("${scopeLabel}")`,
      ).toBe(true);

      for (const [label, pattern] of SERVICES_ACCEPTANCE_PATTERNS[locale]) {
        expect(
          pattern.test(answer),
          `${locale}/services must not carry the FAQ acceptance wording "${label}"`,
        ).toBe(false);
      }
    }
  });

  it('names the four consultation languages in every answer', () => {
    for (const { locale, key, entry } of entries) {
      const answer = entry?.answer ?? '';
      for (const term of CONSULTATION_LANGUAGE_TERMS[locale] ?? []) {
        expect(answer, `${locale}/${key} is missing "${term}"`).toContain(term);
      }
    }
  });

  it('never names a guidance language', () => {
    for (const { locale, key, entry } of entries) {
      const answer = entry?.answer ?? '';
      for (const [label, pattern] of GUIDANCE_LANGUAGE_TOKENS) {
        expect(
          pattern.test(answer),
          `${locale}/${key} contains the guidance-language token "${label}"`,
        ).toBe(false);
      }
    }
  });

  it('has zero forbidden language/consultation combinations in any sentence', () => {
    for (const { locale, key, entry } of entries) {
      const answer = entry?.answer ?? '';
      for (const sentence of sentencesOf(locale, answer)) {
        for (const [label, languagePattern, consultationPattern] of FORBIDDEN_COMBINATIONS) {
          const hit = languagePattern.test(sentence) && consultationPattern.test(sentence);
          expect(hit, `${locale}/${key} matched forbidden combination "${label}"`).toBe(false);
        }
      }
    }
  });

  it('cites only existing site-internal paths', () => {
    for (const { locale, key, entry } of entries) {
      const sources = entry?.sources ?? [];
      expect(sources.length, `${locale}/${key} source count`).toBeGreaterThanOrEqual(1);
      expect(sources.length, `${locale}/${key} source count`).toBeLessThanOrEqual(2);
      expect(new Set(sources).size, `${locale}/${key} duplicate source`).toBe(sources.length);

      for (const href of sources) {
        expect(href.startsWith('/'), `${locale}/${key} source "${href}" must start with /`).toBe(true);
        expect(ALLOWED_SOURCES.has(href), `${locale}/${key} source "${href}" is not a known path`).toBe(true);
        const isSameLocaleGuidance = GUIDANCE_PAGE_KEYS.some(
          (pageKey) => guidancePathFor(locale, pageKey) === href,
        );
        const isEnglishLanding = intentPageSlugs.some((slug) => href === `/en/${slug}`);
        expect(
          isSameLocaleGuidance || isEnglishLanding,
          `${locale}/${key} source "${href}" is neither a same-locale guidance page nor an /en landing`,
        ).toBe(true);
        expect(href, `${locale}/${key} must not cite itself`).not.toBe(
          guidancePathFor(locale, key),
        );
      }
    }
  });
});
