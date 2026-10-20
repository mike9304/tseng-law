/**
 * Legacy manuscript signatures and self-introductions, reviewed across the 49
 * locale corpus. Exact lines only: named consultation contacts, court roles,
 * quotations and substantive legal prose are not generic author labels.
 * Keep raw editorial records; remove attribution at every public read boundary.
 */
const LEGACY_ATTRIBUTION_LINES = new Set([
  'By Legal AI Assistant',
  'By 법률 AI 어시스턴트 (Legal AI Assistant)',
  '법률 AI 어시스턴트 작성',
  '法律AI助理撰文',
  'Written by Legal AI Assistant',
  '法律AIアシスタント執筆',
  "A advogada Wei Tseng (曾雋崴)",
  "A cikk szerzője Wei Tseng (曾雋崴) tajvani ügyvédnő.",
  "Abogada Wei Tseng (曾雋崴)",
  "Advocaat Wei Tseng (曾雋崴)",
  "Advocada Wei Tseng (曾雋崴)",
  "Advogada Wei Tseng (曾雋崴)",
  "Advokaat Wei Tseng (曾雋崴)",
  "Advokat Wei Tseng (曾雋崴)",
  "Advokat Wei Tseng (曾雋崴) er advokat i Taiwan.",
  "Advokat Wei Tseng (曾雋崴) gjennomgår her reglene om sluttvederlag (資遣費) i Taiwan.",
  "Advokat Wei Tseng (曾雋崴) är verksam i Taiwan.",
  "Advokatkinja Wei Tseng (曾雋崴)",
  "Advokatkinja Wei Tseng (曾雋崴) u nastavku sažima pravila otpremnine (資遣費) po tajvanskom pravu.",
  "Advokatė Wei Tseng (曾雋崴)",
  "Advokátka Wei Tseng (曾雋崴)",
  "Advokátka Wei Tseng (曾雋崴) nižšie zhŕňa pravidlá odstupného (資遣費) na Taiwane.",
  "Advokátka Wei Tseng (曾雋崴) níže shrnuje pravidla odstupného (資遣費) na Tchaj-wanu.",
  "Advokāte Wei Tseng (曾雋崴)",
  "Adwokatka Wei Tseng (曾雋崴)",
  "Ako si Wei Tseng (曾雋崴), abogada sa Taiwan.",
  "Asianajaja Wei Tseng (曾雋崴)",
  "Avocata Wei Tseng (曾雋崴)",
  "Avocate Wei Tseng (曾雋崴)",
  "Avukat Wei Tseng (曾雋崴)",
  "Avvocata Wei Tseng (曾雋崴)",
  "Demikian dari saya, Wei Tseng (曾雋崴), advokat di Taiwan.",
  "Esu Wei Tseng (曾雋崴), Taivano advokatė.",
  "Hello, I am Wei Tseng (曾雋崴), Taiwan Attorney.",
  "Le domande e risposte seguenti, preparate dall’avvocata Wei Tseng (曾雋崴), mirano ad aiutare le persone che valutano la costituzione di una società (公司設立) a Taiwan.",
  "Les questions et réponses suivantes, préparées par l’avocate Wei Tseng (曾雋崴), visent à aider les personnes qui envisagent une création de société (公司設立) à Taïwan.",
  "Luật sư Wei Tseng (曾雋崴)",
  "Lögmaður Wei Tseng (曾雋崴)",
  "L’avocate Wei Tseng (曾雋崴)",
  "L’avvocata Wei Tseng (曾雋崴)",
  "Navedena pitanja i odgovore pripremila je advokatkinja Wei Tseng (曾雋崴); nadamo se da će pomoći onima koji razmatraju osnivanje društva (公司設立) na Tajvanu.",
  "Nazywam się Wei Tseng (曾雋崴) i jestem adwokatką na Tajwanie.",
  "Nižšie uvedené otázky a odpovede pripravila advokátka Wei Tseng (曾雋崴); majú pomôcť osobám, ktoré zvažujú založenie spoločnosti (公司設立) na Taiwane.",
  "Níže uvedené otázky a odpovědi připravila advokátka Wei Tseng (曾雋崴); mají pomoci osobám, které zvažují založení společnosti (公司設立) na Tchaj-wanu.",
  "Odvetnica Wei Tseng (曾雋崴)",
  "Odvetnica Wei Tseng (曾雋崴) v nadaljevanju povzema pravila odpravnine (資遣費) na Tajvanu.",
  "Odvjetnica Wei Tseng (曾雋崴)",
  "Odvjetnica Wei Tseng (曾雋崴) u nastavku iznosi pravila zakonske otpremnine prema tajvanskom pravu (資遣費).",
  "Peguam Wei Tseng (曾雋崴)",
  "Questo testo è dell’avvocata Wei Tseng (曾雋崴), avvocata a Taiwan.",
  "Rechtsanwältin Wei Tseng (曾雋崴)",
  "Saya Wei Tseng (曾雋崴), advokat di Taiwan.",
  "Saya Wei Tseng (曾雋崴), peguam di Taiwan.",
  "Sou Wei Tseng (曾雋崴), advogada em Taiwan.",
  "Spodnja vprašanja in odgovore je pripravila odvetnica Wei Tseng (曾雋崴); naj pomagajo osebam, ki razmišljajo o ustanovitvi družbe (公司設立) na Tajvanu.",
  "Sunt Wei Tseng (曾雋崴), avocată în Taiwan.",
  "The Q&A below, prepared by Wei Tseng (曾雋崴), Taiwan Attorney, may also be helpful to those considering establishing a company in Taiwan.",
  "Toliau pateikiami advokatės Wei Tseng (曾雋崴) parengti klausimai ir atsakymai asmenims, kurie svarsto įmonės steigimą (公司設立) Taivane.",
  "Turpmākos jautājumus un atbildes sagatavojusi advokāte Wei Tseng (曾雋崴); tās palīdzēs personām, kuras apsver sabiedrības dibināšanu (公司設立) Taivānā.",
  "Verfasserin ist Rechtsanwältin Wei Tseng (曾雋崴) in Taiwan.",
  "Wei Tseng (曾雋崴) er löggiltur lögmaður á Taívan.",
  "Wei Tseng (曾雋崴), Advokat di Taiwan",
  "Wei Tseng (曾雋崴), Rechtsanwältin in Taiwan.",
  "Wei Tseng (曾雋崴), Taiwan Attorney",
  "Wei Tseng (曾雋崴), Tayvan avukatı.",
  "Wei Tseng (曾雋崴), abogada de Taiwán",
  "Wei Tseng (曾雋崴), abogada de Taiwán.",
  "Wei Tseng (曾雋崴), abogada sa Taiwan.",
  "Wei Tseng (曾雋崴), advocaat in Taiwan",
  "Wei Tseng (曾雋崴), advocada de Taiwan.",
  "Wei Tseng (曾雋崴), advogada de Taiwan.",
  "Wei Tseng (曾雋崴), advogada em Taiwan",
  "Wei Tseng (曾雋崴), advokat i Taiwan.",
  "Wei Tseng (曾雋崴), advokatkinja na Tajvanu.",
  "Wei Tseng (曾雋崴), advokátka na Taiwane.",
  "Wei Tseng (曾雋崴), advokátka na Tchaj-wanu.",
  "Wei Tseng (曾雋崴), adwokatka na Tajwanie.",
  "Wei Tseng (曾雋崴), asianajaja Taiwanissa.",
  "Wei Tseng (曾雋崴), avocate de Taïwan.",
  "Wei Tseng (曾雋崴), avocate à Taïwan",
  "Wei Tseng (曾雋崴), avocate à Taïwan.",
  "Wei Tseng (曾雋崴), avocată din Taiwan.",
  "Wei Tseng (曾雋崴), avocată în Taiwan",
  "Wei Tseng (曾雋崴), avvocata a Taiwan",
  "Wei Tseng (曾雋崴), avvocata a Taiwan.",
  "Wei Tseng (曾雋崴), luật sư Đài Loan.",
  "Wei Tseng (曾雋崴), lögmaður á Taívan.",
  "Wei Tseng (曾雋崴), peguam Taiwan.",
  "Wei Tseng (曾雋崴), peguam di Taiwan",
  "Wei Tseng (曾雋崴), ügyvédnő Tajvanon.",
  "Wei Tseng (曾雋崴), δικηγόρος στην Ταϊβάν.",
  "Wei Tseng (曾雋崴), адвокат на Тайване",
  "Wei Tseng (曾雋崴), ताइवान अधिवक्ता।",
  "Wei Tseng (曾雋崴), ताइवानकी अधिवक्ता।",
  "Wei Tseng (曾雋崴), তাইওয়ানের আইনজীবী।",
  "Wei Tseng ügyvédnő (曾雋崴)",
  "Întrebările și răspunsurile de mai jos, pregătite de avocata Wei Tseng (曾雋崴), urmăresc să ajute persoanele care au în vedere o înființare de societate (公司設立) în Taiwan.",
  "Šo skaidrojumu sagatavojusi advokāte Wei Tseng (曾雋崴), Taivānas advokāte.",
  "Δικηγόρος Wei Tseng (曾雋崴)",
  "Είμαι η δικηγόρος Wei Tseng (曾雋崴) στην Ταϊβάν.",
  "Адвокат Wei Tseng (曾雋崴)",
  "Адвокатка Wei Tseng (曾雋崴)",
  "Наведені нижче запитання й відповіді підготувала адвокатка Wei Tseng (曾雋崴); вони мають допомогти особам, які розглядають заснування товариства (公司設立) на Тайвані.",
  "Пиша като адвокатка Wei Tseng (曾雋崴) в Тайван.",
  "Сайн байна уу, би Wei Tseng (曾雋崴), Тайванийн өмгөөлөгч.",
  "Цю статтю написала адвокатка Wei Tseng (曾雋崴), яка практикує на Тайвані.",
  "Эту заметку написала Wei Tseng (曾雋崴), адвокат на Тайване.",
  "Я — Wei Tseng (曾雋崴), адвокат на Тайване.",
  "Өмгөөлөгч Wei Tseng (曾雋崴)",
  "Өмгөөлөгч Wei Tseng (曾雋崴), Тайванийн өмгөөлөгч.",
  "עורכת הדין Wei Tseng (曾雋崴)",
  "עורכת הדין Wei Tseng (曾雋崴), מוסמכת בטאיוואן.",
  "שלום, אני עורכת הדין Wei Tseng (曾雋崴) בטאיוואן.",
  "السلام علیکم، میں تائیوان کی وکیلہ Wei Tseng (曾雋崴) ہوں۔",
  "المحامية Wei Tseng (曾雋崴)",
  "المحامية Wei Tseng (曾雋崴)، محامية مؤهَّلة في تايوان.",
  "این نوشتار را وکیل تایوانی Wei Tseng (曾雋崴) نوشته است.",
  "نیچے سوال و جواب وکیلہ Wei Tseng (曾雋崴) نے تیار کیے ہیں، ان کے لیے جو تائیوان میں کمپنی قائم کرنے پر غور کر رہے ہیں۔",
  "وکیل Wei Tseng (曾雋崴)",
  "وکیلہ Wei Tseng (曾雋崴)",
  "وکیلہ Wei Tseng (曾雋崴)، تائیوان میں اہل وکیلہ۔",
  "अधिवक्ता Wei Tseng (曾雋崴)",
  "तलका प्रश्न र उत्तर ताइवानकी अधिवक्ता Wei Tseng (曾雋崴) ले तयार पार्नुभएको हो; ताइवानमा कम्पनी स्थापना (公司設立) विचार गरिरहेकाहरूलाई सहयोगी हुन सक्छन्।",
  "नमस्ते, म ताइवानकी अधिवक्ता Wei Tseng (曾雋崴) हुँ।",
  "नमस्ते, मैं ताइवान अधिवक्ता Wei Tseng (曾雋崴) हूँ।",
  "আইনজীবী Wei Tseng (曾雋崴)",
  "নমস্কার, আমি তাইওয়ানের আইনজীবী Wei Tseng (曾雋崴)।",
  "নিচের প্রশ্নোত্তর তৈরি করেছেন তাইওয়ানের আইনজীবী Wei Tseng (曾雋崴); তাইওয়ানে কোম্পানি গঠন (公司設立) বিবেচনা করছেন এমন পাঠকের কাজে লাগতে পারে।",
  "வணக்கம், நான் தைவான் வழக்கறிஞர் Wei Tseng (曾雋崴).",
  "வழக்கறிஞர் Wei Tseng (曾雋崴)",
  "ทนายความ Wei Tseng (曾雋崴)",
  "ที่กล่าวมาข้างต้นคือข้อมูลจากทนายความ Wei Tseng",
  "เรียนท่านผู้อ่าน ดิฉันคือ Wei Tseng (曾雋崴) ทนายความไต้หวัน",
  "မင်္ဂလာပါ။ ကျွန်မသည် ထိုင်ဝမ်ရှေ့နေ Wei Tseng (曾雋崴) ဖြစ်ပါသည်။",
  "ရှေ့နေ ဒေါ် Wei Tseng (曾雋崴)",
  "មេធាវីស្ដ្រី Wei Tseng (曾雋崴)",
  "សួស្ដីលោកអ្នក នាងខ្ញុំគឺជាមេធាវីស្ដ្រី Wei Tseng (曾雋崴) នៅតៃវ៉ាន់។",
  "សំណួរនិងចម្លើយខាងក្រោម រៀបចំដោយមេធាវីស្ដ្រី Wei Tseng (曾雋崴) ក៏អាចមានប្រយោជន៍ដល់លោកអ្នកដែលកំពុងពិចារណាបង្កើតក្រុមហ៊ុននៅតៃវ៉ាន់ដែរ។",
  "以上由曾雋崴律師（Wei Tseng）說明。",
  "台湾律师曾雋崴",
  "台湾律师曾雋崴。",
  "律师曾雋崴",
  "您好，我是台灣律師曾雋崴。",
  "曾雋崴弁護士（Wei Tseng）",
  "曾雋崴律師（Wei Tseng）",
  "안녕하세요, 저는 증준외 대만 변호사입니다.",
  "증준외 변호사(Wei Tseng)",
  "증준외 변호사(曾雋崴, Wei Tseng)",
]);

// These introductions share a paragraph with legal conditions. Remove only the
// authorship sentence and preserve every following condition verbatim.
const ATTRIBUTION_PREFIXES = [
  "Artikli koostas advokaat Wei Tseng (曾雋崴). ",
  "您好，我是曾雋崴律師（Wei Tseng）。",
];

function unstyle(text: string): string {
  return text.replace(/<[^>]*>/g, '').replace(/(?:\*\*|__)/g, '').trim().replace(/^#{1,6}\s+/, '');
}

function stripAttributionLine(line: string): string {
  const plain = unstyle(line);
  if (LEGACY_ATTRIBUTION_LINES.has(plain)) return '';
  // Explicit byline labels are never public column content. Do not match quotes,
  // narrative mentions of authors, or heading text without a label separator.
  if (/^(?:作者|著者|執筆者|작성자|글쓴이|저자|author|written by|authored by|byline|tác giả|auteur|auteure|autor|autora|autore|verfasser(?:in)?|автор|yazar)\s*[:：]\s*\S/i.test(plain)) return '';
  for (const prefix of ATTRIBUTION_PREFIXES) {
    if (plain.startsWith(prefix)) return line.replace(prefix, '');
  }
  // Retain the source basis and check date in legacy endnotes, without naming
  // the AI writer. These replacements do not match generated-media notices.
  return line
    .replace('이 글은 법률 AI 어시스턴트가 공개 판결문과 법령을 바탕으로 작성했습니다.', '이 글은 공개 판결문과 법령을 바탕으로 작성했습니다.')
    .replace(/本文由法律\s*AI\s*助理(?=依)/g, '本文')
    .replace(/(This (?:article|column)) was written by (?:the )?Legal AI Assistant (?:from|using) public/g, '$1 is based on public');
}

export function stripColumnAttribution(markdown: string): string {
  let fence: string | undefined;
  return markdown.split('\n').map((line) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1][0];
      else if (fence === marker[1][0]) fence = undefined;
      return line;
    }
    if (fence || /^\s*>/.test(line)) return line;
    return stripAttributionLine(line);
  }).join('\n');
}

/** CMS rich-text paragraphs keep their markup unless they are an author line. */
export function stripColumnHtmlAttribution(html: string): string {
  return html.replace(/<(p|div|span|h[1-6]|blockquote|pre)\b[^>]*>([\s\S]*?)<\/\1>/gi, (block, tag: string, inner: string) => {
    if (/^(?:blockquote|pre)$/i.test(tag)) return block;
    if (/<(?:p|div|h[1-6]|img|video|blockquote|pre)\b/i.test(inner)) {
      return block.replace(inner, () => stripColumnHtmlAttribution(inner));
    }
    const clean = stripAttributionLine(inner);
    return clean ? block.replace(inner, () => clean) : '';
  });
}
