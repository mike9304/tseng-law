/**
 * Columns written by AI models (drafted, cross-reviewed and revised by AI
 * lanes; see the commit history of 019–040). They must not be bylined or
 * marked up as written or reviewed by the attorney. Keep this internal
 * provenance even though public author attribution is omitted.
 *
 * 001–017 are the attorney's own columns imported from the original site, and
 * 018 was published as an attorney-reviewed text. Since 2026-10-20 no column
 * displays a public author, regardless of its internal provenance.
 */
export const AI_AUTHORED_COLUMN_SLUGS: ReadonlySet<string> = new Set([
  'taiwan-accident-police-records',
  // 019–023: family columns (2026-09-27)
  'taiwanese-spouse-divorce-agreement-registration',
  'taiwanese-spouse-divorce-from-abroad',
  'taiwanese-spouse-divorce-cross-border-parenting',
  'marrying-taiwanese-national-registration-checklist',
  'baby-taiwan-nationality-birth-registration',
  // 024–031: overseas-reader set (2026-09-29)
  'taiwan-income-tax-residency',
  'taiwan-estate-tax-foreign-decedent',
  'foreign-heir-taiwan-succession-law-land',
  'taiwan-employment-gold-card',
  'taiwan-foreign-spouse-residence',
  'taiwan-permanent-residence-aprc',
  'enforce-foreign-judgment-in-taiwan',
  'hire-taiwan-lawyer-from-abroad',
  // 032–040: native en/ja/vi columns (2026-09-29)
  'taiwan-exit-ban-foreigners',
  'taiwan-police-questioning-foreigner-rights',
  'foreign-professional-dismissed-taiwan',
  'taiwan-unpaid-invoice-debt-collection',
  'taiwan-subsidiary-responsible-person-liability',
  'taiwan-subsidiary-employee-dismissal',
  'taiwan-bank-account-lending-fraud-money-laundering',
  'taiwan-migrant-worker-occupational-injury-compensation',
  'vietnamese-spouse-taiwan-residence-after-divorce-domestic-violence',
]);

/**
 * True for AI-written columns: frontmatter `author: legal-ai-assistant`
 * (posts carry `aiAuthored`), or a slug in the list above.
 */
export function isAiAuthoredColumn(
  slugOrPost: string | { slug: string; aiAuthored?: boolean } | undefined | null,
): boolean {
  if (!slugOrPost) return false;
  if (typeof slugOrPost === 'string') return AI_AUTHORED_COLUMN_SLUGS.has(slugOrPost);
  return slugOrPost.aiAuthored === true || AI_AUTHORED_COLUMN_SLUGS.has(slugOrPost.slug);
}

/** General-information notice retained independently of author attribution. */
const COLUMN_DISCLAIMER: Record<string, string> = {
  ko: '이 글은 일반적인 정보 제공을 위한 것이며, 개별 사안에 대한 법률 자문이 아닙니다.',
  en: 'This article provides general information and is not legal advice on any individual matter.',
  ja: 'この記事は一般的な情報提供を目的としたもので、個別の事案についての法的助言ではありません。',
  'zh-hant': '本文僅供一般資訊參考，並非針對個別案件的法律意見。',
  'zh-hans': '本文仅供一般信息参考，并非针对个案的法律意见。',
  vi: 'Bài viết này cung cấp thông tin chung, không phải là tư vấn pháp lý cho trường hợp cụ thể.',
  id: 'Artikel ini memberikan informasi umum dan bukan nasihat hukum untuk kasus tertentu.',
  th: 'บทความนี้ให้ข้อมูลทั่วไป และไม่ใช่คำแนะนำทางกฎหมายสำหรับกรณีเฉพาะ',
  es: 'Este artículo ofrece información general y no constituye asesoramiento jurídico sobre ningún caso concreto.',
  fr: 'Cet article donne des informations générales et ne constitue pas un conseil juridique sur une situation particulière.',
  fil: 'Ang artikulong ito ay nagbibigay ng pangkalahatang impormasyon at hindi ito legal na payo para sa isang partikular na kaso.',
  "ar": "توفّر هذه المقالة معلومات عامة، وليست استشارة قانونية بشأن أي مسألة محددة.",
  "bg": "Настоящата статия предоставя обща информация и не представлява правен съвет по конкретен случай.",
  "bn": "এই নিবন্ধটি সাধারণ তথ্য প্রদান করে এবং কোনো নির্দিষ্ট বিষয়ে আইনি পরামর্শ নয়।",
  "ca": "Aquest article ofereix informació general i no constitueix assessorament jurídic sobre cap assumpte concret.",
  "cs": "Tento článek poskytuje obecné informace a nepředstavuje právní poradenství k žádné konkrétní věci.",
  "da": "Artiklen giver generel information og udgør ikke juridisk rådgivning i enkeltsager.",
  "de": "Dieser Artikel enthält allgemeine Informationen und stellt keine Rechtsberatung zu einzelnen Sachverhalten dar.",
  "el": "Το παρόν άρθρο παρέχει γενικές πληροφορίες και δεν συνιστά νομική συμβουλή για οποιοδήποτε μεμονωμένο ζήτημα.",
  "et": "See artikkel annab üldist teavet ega ole ühegi üksiku juhtumi kohta õigusalane nõustamine.",
  "fa": "این مقاله اطلاعات عمومی ارائه می‌دهد و مشاوره حقوقی در خصوص هیچ موضوع خاصی محسوب نمی‌شود.",
  "fi": "Tämä artikkeli tarjoaa yleistä tietoa eikä ole oikeudellista neuvontaa missään yksittäisessä asiassa.",
  "he": "מאמר זה מספק מידע כללי ואינו מהווה ייעוץ משפטי בנוגע לעניין פרטני כלשהו.",
  "hi": "यह लेख सामान्य जानकारी प्रदान करता है और किसी भी विशिष्ट मामले पर कानूनी सलाह नहीं है।",
  "hr": "Ovaj članak pruža opće informacije i ne predstavlja pravni savjet o bilo kojem pojedinačnom slučaju.",
  "hu": "Ez a cikk általános tájékoztatást nyújt, és egyetlen egyedi ügy vonatkozásában sem minősül jogi tanácsadásnak.",
  "is": "Þessi grein veitir almennar upplýsingar og er ekki lögfræðiráðgjöf varðandi neitt tiltekið mál.",
  "it": "Il presente articolo fornisce informazioni di carattere generale e non costituisce consulenza legale su singole questioni.",
  "km": "អត្ថបទនេះផ្តល់ជូនព័ត៌មានទូទៅ ហើយមិនមែនជាយោបល់ផ្នែកច្បាប់ចំពោះរឿងជាក់លាក់ណាមួយទេ។",
  "lt": "Šis straipsnis pateikia bendrą informaciją ir nėra teisinė konsultacija dėl jokio konkretaus atvejo.",
  "lv": "Šis raksts sniedz vispārīgu informāciju un nav juridiska konsultācija par nevienu konkrētu lietu.",
  "mn": "Энэ нийтлэл нь ерөнхий мэдээлэл өгдөг бөгөөд ямар ч тодорхой асуудлын хувьд хуулийн зөвлөгөө биш юм.",
  "ms": "Artikel ini memberikan maklumat am dan bukan nasihat undang-undang bagi mana-mana perkara tertentu.",
  "my": "ဤဆောင်းပါးသည် အထွေထွေသတင်းအချက်အလက်ကို ပေးအပ်ပြီး မည်သည့်သီးခြားကိစ္စရပ်နှင့်ပတ်သက်၍ ဥပဒေရေးရာအကြံဉာဏ် မဟုတ်ပါ။",
  "nb": "Artikkelen gir generell informasjon og er ikke juridisk rådgivning i enkeltsaker.",
  "ne": "यो लेखले सामान्य जानकारी प्रदान गर्दछ र कुनै पनि विशेष मामिलाको लागि कानूनी सल्लाह होइन।",
  "nl": "Dit artikel bevat algemene informatie en is geen juridisch advies over een specifieke zaak.",
  "pl": "Niniejszy artykuł ma charakter wyłącznie informacji ogólnej i nie stanowi porady prawnej w odniesieniu do jakiejkolwiek indywidualnej sprawy.",
  "pt": "Este artigo fornece informações de carácter geral e não constitui aconselhamento jurídico sobre qualquer caso concreto.",
  "ro": "Prezentul articol oferă informații de natură generală și nu constituie consultanță juridică pentru nicio chestiune concretă.",
  "ru": "Данная статья содержит общую информацию и не является юридической консультацией по какому-либо конкретному делу.",
  "sk": "Tento článok poskytuje všeobecné informácie a nepredstavuje právne poradenstvo k žiadnej konkrétnej veci.",
  "sl": "Ta članek vsebuje splošne informacije in ne predstavlja pravnega nasveta glede posameznih zadev.",
  "sr": "Ovaj članak pruža opšte informacije i ne predstavlja pravni savet u vezi sa bilo kojim pojedinačnim predmetom.",
  "sv": "Artikeln tillhandahåller allmän information och utgör inte juridisk rådgivning i något enskilt ärende.",
  "ta": "இந்த கட்டுரை பொதுவான தகவலை வழங்குகிறது; எந்தவொரு குறிப்பிட்ட சட்ட விஷயத்திற்கும் இது சட்ட ஆலோசனை அல்ல.",
  "tr": "Bu makale genel bilgi sunar ve herhangi bir somut hukuki konu bakımından hukuki tavsiye niteliğinde değildir.",
  "uk": "Ця стаття містить загальну інформацію й не є правовою консультацією щодо будь-якої конкретної справи.",
  "ur": "یہ مضمون عمومی معلومات فراہم کرتا ہے اور کسی بھی انفرادی معاملے کے بارے میں قانونی مشورہ نہیں ہے۔",
};

export function getColumnDisclaimer(locale: string): string {
  return COLUMN_DISCLAIMER[locale] ?? COLUMN_DISCLAIMER.en;
}

/** Consultation sidebar heading for all columns; never an authorship/review claim. */
export const AI_COLUMN_ATTORNEY_HEADING: Record<string, string> = {
  ko: '상담 변호사',
  'zh-hant': '諮詢律師',
  en: 'Consulting Attorney',
  ja: 'ご相談いただける弁護士',
};
