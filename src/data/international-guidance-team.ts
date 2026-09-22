import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import type { GuidanceLocale } from '@/data/international-guidance-content';

/**
 * Display copy AND localized biographies for the team roster rendered on the
 * guidance-locale `lawyers` and `about` pages (vi/id/th/fil/ar).
 *
 * WHY THIS FILE NOW CARRIES BIOGRAPHY SENTENCES (WO-O33)
 * -----------------------------------------------------
 * It used to say the opposite: the intro / education / experience lines were
 * read verbatim from `teamContent.en` and introduced by a `sourceLanguageNote`
 * telling the reader those lines were the English original. The site's own
 * precedent overturned that rule. `src/data/team-members.ts` already
 * translates the very same lines — degree names and institution names included
 * ("国立台湾大学財務金融研究所 修士号取得") — for ko, zh-hant and ja. Only `en`
 * is the original. So the four guidance languages were the one exception that
 * left a reader looking at English, which is exactly the defect reported:
 * "the attorney profiles read differently in the Southeast Asian languages".
 *
 * WHAT MAY BE TRANSLATED
 *   Sentence frames, common nouns and role descriptions ("senior paralegal",
 *   "exchange student", "double major", "first-instance ruling"), and degree
 *   words (master's / bachelor's) in each language's usual wording.
 *
 * WHAT STAYS BYTE-IDENTICAL TO THE ENGLISH CANONICAL RECORD
 *   Roman personal names; the official English names of institutions and
 *   firms ({@link GUIDANCE_BIO_PRESERVED_TERMS}); figures and currency codes
 *   ("TWD 1.57M"); e-mail addresses. Degree abbreviations keep the original in
 *   brackets once, after the local degree word — "Magister (M.S.), Institute
 *   of Finance, National Taiwan University".
 *
 * WHAT MAY NOT HAPPEN HERE
 *   No new fact. No qualification, case, year, institution or language
 *   capability that `teamContent.en` and `attorney-profiles.ts` do not already
 *   publish. `src/data/__tests__/guidance-team-bios.test.ts` enforces the line
 *   counts, the preserved terms, the figures and the language purity rules
 *   against `teamContent.en` on every run.
 *
 * CONSULTATION LANGUAGES
 *   The roster still makes no claim about which languages a consultation
 *   happens in. That statement stays where it already is: the roster's single
 *   `consultationNotice` line and the closing contact band, which name
 *   English, Chinese, Japanese and Korean only. A member's own languages are
 *   rendered under a neutral noun label.
 */

/** Member ids from `teamContent`, in the order the English page renders them. */
export type GuidanceTeamMemberId =
  | 'tseng-junwei'
  | 'chang-rongxuan'
  | 'chang-fangyu'
  | 'son-jungmin'
  | 'huang-shengping';

export interface GuidanceTeamCopy {
  /** Eyebrow above the roster, matching the English `teamContent.en.label`. */
  label: string;
  /** Roster heading. Also the `lawyers` page `h1`, matching `/en` and `/ja`. */
  title: string;
  /** One sentence describing who is listed — same scope as the English one. */
  description: string;
  /** Group headings: lead attorney / lawyers and staff / partner accountant. */
  representativeTitle: string;
  teamTitle: string;
  partnerTitle: string;
  /** Field labels inside each card. */
  introLabel: string;
  educationLabel: string;
  experienceLabel: string;
  /** Leading word of a portrait `alt`: "<prefix>: <name>, <role>". */
  photoAltPrefix: string;
  /** Neutral label above a member's language list. Never a verb. */
  workingLanguagesLabel: string;
  /** Link label for the English-only full profile page. */
  fullProfileLabel: string;
  /**
   * Key-facts block, the localized equivalent of the `AttorneyFactSummary`
   * section `/en/lawyers` renders under the roster. `keyFactsHeading` carries
   * the Roman name exactly as the canonical record spells it;
   * `qualificationSentence` is a template over `{name}` and `{firm}`, both
   * supplied from canonical data at render time.
   */
  keyFactsHeading: string;
  qualificationLabel: string;
  qualificationSentence: string;
  practiceLabel: string;
  consultationLanguagesLabel: string;
  /**
   * Job titles. Each is a plain translation of the title the firm already
   * publishes in English, followed by that English title in brackets so the
   * canonical wording travels with it. Exception: where the borrowed English
   * word IS that language's own standard term for the role — "Paralegal" in
   * Filipino and in Indonesian — the bracket is omitted, because a gloss
   * repeating the same word is noise and a coined descriptive phrase would
   * read as less native, not more.
   *
   * The two exceptions rest on SEPARATE grounds; do not merge them into one
   * rule, because the fil ground does not exist in Indonesian:
   *
   *   fil — Philippine legal and administrative writing is conducted in
   *     English, so the English term is itself the professional register and
   *     no Filipino equivalent is established (IBP / PAO usage).
   *
   *   id — Indonesian statutes are NOT written in English, so the register
   *     argument above must not be carried over. The ground here is that
   *     `paralegal` is a loanword absorbed into Indonesian and a defined term
   *     of Indonesian law — Permenkumham 3/2021 art. 1(5), which replaced the
   *     repealed Permenkumham 1/2018. The same loanword rule is already
   *     applied to id elsewhere in this project (the Latin `mutatis mutandis`
   *     is kept, not paraphrased), and the existing-language precedent ja
   *     「パラリーガル」 (`src/data/team-members.ts`) is likewise a loanword
   *     job title.
   *
   * Neither ground reaches vi or th: both have an established native term
   * for the role, so those two keep translation + English bracket. Do not
   * extend the bare-English form to them.
   *
   * The two attorney titles carry an explicit "in Taiwan" qualifier because
   * the only qualification claimed anywhere on this site is a Taiwan one; the
   * paralegal, operations manager and CPA titles are NOT raised into attorney
   * vocabulary.
   */
  roles: Record<GuidanceTeamMemberId, string>;
}

export const guidanceTeamCopy: Record<GuidanceLocale, GuidanceTeamCopy> = {
  vi: {
    label: 'ĐỘI NGŨ CỦA CHÚNG TÔI',
    title: 'Đội ngũ quốc tế Hovering',
    description:
      'Hồ sơ của các luật sư, quản lý nghiệp vụ và kế toán sư hợp tác của Hovering.',
    representativeTitle: 'Luật sư điều hành',
    teamTitle: 'Luật sư và nhân viên',
    partnerTitle: 'Kế toán sư hợp tác',
    introLabel: 'Giới thiệu',
    educationLabel: 'Học vấn',
    experienceLabel: 'Kinh nghiệm',
    photoAltPrefix: 'Ảnh',
    workingLanguagesLabel: 'Ngôn ngữ làm việc',
    fullProfileLabel: 'Hồ sơ đầy đủ (tiếng Anh)',
    keyFactsHeading: 'Luật sư Wei Tseng — Thông tin cơ bản',
    qualificationLabel: 'Tư cách và nơi công tác',
    qualificationSentence:
      '{name} là luật sư có tư cách hành nghề tại Đài Loan và là luật sư điều hành của {firm}.',
    practiceLabel: 'Lĩnh vực chính',
    consultationLanguagesLabel: 'Ngôn ngữ tư vấn',
    roles: {
      'tseng-junwei': 'Luật sư điều hành tại Đài Loan',
      'chang-rongxuan': 'Luật sư tại Đài Loan',
      'chang-fangyu': 'Trợ lý pháp lý',
      'son-jungmin': 'Quản lý nghiệp vụ Hàn Quốc',
      'huang-shengping': 'Kế toán sư hợp tác (會計師, CPA)',
    },
  },
  id: {
    label: 'TIM KAMI',
    title: 'Tim Internasional Hovering',
    description:
      'Profil para advokat, manajer operasional, dan akuntan mitra Hovering.',
    representativeTitle: 'Advokat pengelola',
    teamTitle: 'Advokat dan staf',
    partnerTitle: 'Akuntan mitra',
    introLabel: 'Perkenalan',
    educationLabel: 'Pendidikan',
    experienceLabel: 'Pengalaman',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Bahasa kerja',
    fullProfileLabel: 'Profil lengkap (bahasa Inggris)',
    keyFactsHeading: 'Advokat Wei Tseng — Fakta utama',
    qualificationLabel: 'Kualifikasi dan kantor',
    qualificationSentence:
      '{name} adalah advokat berizin praktik di Taiwan dan advokat pengelola di {firm}.',
    practiceLabel: 'Bidang utama',
    consultationLanguagesLabel: 'Bahasa konsultasi',
    roles: {
      'tseng-junwei': 'Advokat pengelola di Taiwan',
      'chang-rongxuan': 'Advokat di Taiwan',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Manajer operasional Korea',
      'huang-shengping': 'Akuntan mitra',
    },
  },
  th: {
    label: 'ทีมงานของเรา',
    title: 'ทีมงานระหว่างประเทศ Hovering',
    description:
      'ประวัติของทนายความ ผู้จัดการฝ่ายปฏิบัติการ และหุ้นส่วนผู้สอบบัญชีของ Hovering',
    representativeTitle: 'ทนายความผู้จัดการสำนักงาน',
    teamTitle: 'ทนายความและเจ้าหน้าที่',
    partnerTitle: 'หุ้นส่วนผู้สอบบัญชี',
    introLabel: 'แนะนำ',
    educationLabel: 'การศึกษา',
    experienceLabel: 'ประสบการณ์',
    photoAltPrefix: 'ภาพ',
    workingLanguagesLabel: 'ภาษาที่ใช้ทำงาน',
    fullProfileLabel: 'ประวัติฉบับเต็ม (ภาษาอังกฤษ)',
    keyFactsHeading: 'ทนายความ Wei Tseng — ข้อมูลพื้นฐาน',
    qualificationLabel: 'คุณสมบัติและสังกัด',
    qualificationSentence:
      '{name} เป็นทนายความที่มีคุณสมบัติประกอบวิชาชีพในไต้หวัน และเป็นทนายความผู้จัดการสำนักงานของ {firm}',
    practiceLabel: 'สาขาที่รับดำเนินการหลัก',
    consultationLanguagesLabel: 'ภาษาที่ใช้ให้คำปรึกษา',
    roles: {
      'tseng-junwei': 'ทนายความผู้จัดการสำนักงานในไต้หวัน',
      'chang-rongxuan': 'ทนายความในไต้หวัน',
      'chang-fangyu': 'ผู้ช่วยงานกฎหมาย',
      'son-jungmin': 'ผู้จัดการฝ่ายปฏิบัติการเกาหลี',
      'huang-shengping': 'หุ้นส่วนผู้สอบบัญชี',
    },
  },
  fil: {
    label: 'ANG AMING PANGKAT',
    title: 'Pandaigdigang pangkat ng Hovering',
    description:
      'Mga profile ng mga abogado, tagapamahala ng operasyon, at kasosyong CPA ng Hovering.',
    representativeTitle: 'Punong abogada',
    teamTitle: 'Mga abogado at kawani',
    partnerTitle: 'Kasosyong CPA',
    introLabel: 'Panimula',
    educationLabel: 'Edukasyon',
    experienceLabel: 'Karanasan',
    photoAltPrefix: 'Larawan',
    workingLanguagesLabel: 'Mga wikang ginagamit sa trabaho',
    fullProfileLabel: 'Buong profile (sa Ingles)',
    keyFactsHeading: 'Abogada Wei Tseng — Mahahalagang impormasyon',
    qualificationLabel: 'Kwalipikasyon at tanggapan',
    qualificationSentence:
      'Si {name} ay abogadang kwalipikado sa Taiwan at ang punong abogada ng {firm}.',
    practiceLabel: 'Pangunahing larangan',
    consultationLanguagesLabel: 'Wika ng konsultasyon',
    roles: {
      'tseng-junwei': 'Punong abogada sa Taiwan',
      'chang-rongxuan': 'Abogado sa Taiwan',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Tagapamahala ng operasyon para sa Korea',
      'huang-shengping': 'Kasosyong CPA',
    },
  },
  ar: {
    label: 'فريقنا',
    title: 'فريق Hovering الدولي',
    description:
      'ملفات المحامين ومديري الأعمال والمحاسب الشريك في Hovering.',
    representativeTitle: 'المحامية المديرة',
    teamTitle: 'المحامون والموظفون',
    partnerTitle: 'المحاسب الشريك',
    introLabel: 'تعريف',
    educationLabel: 'التعليم',
    experienceLabel: 'الخبرة',
    photoAltPrefix: 'صورة',
    workingLanguagesLabel: 'لغات العمل',
    fullProfileLabel: 'الملف الكامل (بالإنجليزية)',
    keyFactsHeading: 'المحامية Wei Tseng — معلومات أساسية',
    qualificationLabel: 'المؤهل وجهة العمل',
    qualificationSentence:
      '{name} محامية مؤهَّلة لمزاولة المهنة في تايوان والمحامية المديرة في {firm}.',
    practiceLabel: 'المجالات الرئيسية',
    consultationLanguagesLabel: 'لغات الاستشارة',
    roles: {
      'tseng-junwei': 'المحامية المديرة في تايوان (Managing Attorney)',
      'chang-rongxuan': 'محامٍ في تايوان (Taiwan Attorney)',
      'chang-fangyu': 'مساعد قانوني (Paralegal)',
      'son-jungmin': 'مدير عمليات كوريا (Korea Operations Manager)',
      'huang-shengping': 'محاسب قانوني شريك (Partner CPA)',
    },
  },
  de: {
    label: 'UNSER TEAM',
    title: 'Internationales Team von Hovering',
    description:
      'Profile der Anwältinnen und Anwälte, der Leitung Korea und der Wirtschaftsprüfungspartner von Hovering.',
    representativeTitle: 'Geschäftsführende Anwältin',
    teamTitle: 'Anwältinnen, Anwälte und Mitarbeitende',
    partnerTitle: 'Wirtschaftsprüfungspartner',
    introLabel: 'Vorstellung',
    educationLabel: 'Ausbildung',
    experienceLabel: 'Berufserfahrung',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Arbeitssprachen',
    fullProfileLabel: 'Vollständiges Profil (auf Englisch)',
    keyFactsHeading: 'Rechtsanwältin Wei Tseng — Wesentliche Angaben',
    qualificationLabel: 'Qualifikation und Kanzlei',
    qualificationSentence:
      '{name} ist in Taiwan zur anwaltlichen Tätigkeit zugelassen und geschäftsführende Anwältin von {firm}.',
    practiceLabel: 'Schwerpunkte',
    consultationLanguagesLabel: 'Beratungssprachen',
    roles: {
      'tseng-junwei': 'Leitende Anwältin in Taiwan',
      'chang-rongxuan': 'Anwalt in Taiwan',
      'chang-fangyu': 'Juristische Fachkraft',
      'son-jungmin': 'Leitung Korea',
      'huang-shengping': 'Wirtschaftsprüfungspartner',
    },
  },
  es: {
    label: 'NUESTRO EQUIPO',
    title: 'Equipo internacional de Hovering',
    description:
      'Perfiles de los abogados, de la dirección de operaciones y del socio auditor, Partner CPA, de Hovering.',
    representativeTitle: 'Abogada directora',
    teamTitle: 'Abogados y personal',
    partnerTitle: 'Socio auditor (Partner CPA)',
    introLabel: 'Presentación',
    educationLabel: 'Formación',
    experienceLabel: 'Experiencia',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Idiomas de trabajo',
    fullProfileLabel: 'Perfil completo (en inglés)',
    keyFactsHeading: 'Abogada Wei Tseng — Datos esenciales',
    qualificationLabel: 'Cualificación y despacho',
    qualificationSentence:
      '{name} es abogada habilitada para ejercer en Taiwán y la abogada directora de {firm}.',
    practiceLabel: 'Áreas principales',
    consultationLanguagesLabel: 'Idiomas de consulta',
    roles: {
      'tseng-junwei': 'Abogada directora en Taiwán',
      'chang-rongxuan': 'Abogado en Taiwán',
      'chang-fangyu': 'Asistente jurídico (Paralegal)',
      'son-jungmin': 'Dirección de operaciones de Corea',
      'huang-shengping': 'Socio auditor (Partner CPA)',
    },
  },
  fr: {
    label: 'NOTRE ÉQUIPE',
    title: 'Équipe internationale de Hovering',
    description:
      'Profils des avocates et avocats, de la direction des opérations et de l’expert-comptable associé de Hovering.',
    representativeTitle: 'Avocate dirigeante',
    teamTitle: 'Avocates, avocats et collaborateurs',
    partnerTitle: 'Expert-comptable associé',
    introLabel: 'Présentation',
    educationLabel: 'Formation',
    experienceLabel: 'Expérience',
    photoAltPrefix: 'Photo',
    workingLanguagesLabel: 'Langues de travail',
    fullProfileLabel: 'Profil complet (en anglais)',
    keyFactsHeading: 'Avocate Wei Tseng — L’essentiel',
    qualificationLabel: 'Qualification et cabinet',
    qualificationSentence:
      '{name} est avocate habilitée à exercer à Taïwan et avocate dirigeante de {firm}.',
    practiceLabel: 'Domaines principaux',
    consultationLanguagesLabel: 'Langues de consultation',
    roles: {
      'tseng-junwei': 'Avocate dirigeante à Taïwan',
      'chang-rongxuan': 'Avocat à Taïwan',
      'chang-fangyu': 'Collaborateur juridique',
      'son-jungmin': 'Direction des opérations Corée',
      'huang-shengping': 'Expert-comptable associé',
    },
  },
  pt: {
    label: 'A NOSSA EQUIPA',
    title: 'Equipa internacional de Hovering',
    description:
      'Perfis das advogadas e dos advogados, da direção de operações e do contabilista sócio de Hovering.',
    representativeTitle: 'Advogada diretora',
    teamTitle: 'Advogadas, advogados e pessoal',
    partnerTitle: 'Contabilista sócio',
    introLabel: 'Apresentação',
    educationLabel: 'Formação',
    experienceLabel: 'Experiência',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Línguas de trabalho',
    fullProfileLabel: 'Perfil completo (em inglês)',
    keyFactsHeading: 'Advogada Wei Tseng — Dados essenciais',
    qualificationLabel: 'Qualificação e escritório',
    qualificationSentence:
      '{name} é advogada habilitada a exercer em Taiwan e a advogada diretora de {firm}.',
    practiceLabel: 'Áreas principais',
    consultationLanguagesLabel: 'Línguas de consulta',
    roles: {
      'tseng-junwei': 'Advogada diretora em Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Advogado em Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Assistente jurídico (Paralegal)',
      'son-jungmin': 'Direção de operações da Coreia (Korea Operations Manager)',
      'huang-shengping': 'Contabilista sócio (Partner CPA)',
    },
  },
  'zh-hans': {
    label: '我们的团队',
    title: 'Hovering 国际团队',
    description:
      'Hovering 律师、运营主管与合作会计师的简介。',
    representativeTitle: '主任律师（主持律師）',
    teamTitle: '律师与同事',
    partnerTitle: '合作会计师',
    introLabel: '简介',
    educationLabel: '学历',
    experienceLabel: '经历',
    photoAltPrefix: '照片',
    workingLanguagesLabel: '工作语言',
    fullProfileLabel: '完整简介（英文）',
    keyFactsHeading: '律师曾雋崴 — 要点',
    qualificationLabel: '资格与事务所',
    qualificationSentence:
      '{name} 具有台湾执业资格，为 {firm} 的主任律师。',
    practiceLabel: '主要领域',
    consultationLanguagesLabel: '咨询语言',
    roles: {
      'tseng-junwei': '台湾主任律师（Managing Attorney）',
      'chang-rongxuan': '台湾律师（Taiwan Attorney）',
      'chang-fangyu': '律师助理',
      'son-jungmin': '韩国运营主管（Korea Operations Manager）',
      'huang-shengping': '合作会计师（Partner CPA）',
    },
  },
  ms: {
    label: 'PASUKAN KAMI',
    title: 'Pasukan antarabangsa Hovering',
    description:
      'Profil peguam, pengurusan operasi dan akauntan rakan kongsi Hovering.',
    representativeTitle: 'Peguam pengarah',
    teamTitle: 'Peguam dan rakan sekerja',
    partnerTitle: 'Akauntan rakan kongsi',
    introLabel: 'Pengenalan',
    educationLabel: 'Pendidikan',
    experienceLabel: 'Pengalaman',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Bahasa kerja',
    fullProfileLabel: 'Profil penuh (bahasa Inggeris)',
    keyFactsHeading: 'Peguam Wei Tseng — Petunjuk utama',
    qualificationLabel: 'Kelayakan dan firma',
    qualificationSentence:
      '{name} ialah peguam yang layak beramal di Taiwan dan peguam pengarah {firm}.',
    practiceLabel: 'Bidang utama',
    consultationLanguagesLabel: 'Bahasa perundingan',
    roles: {
      'tseng-junwei': 'Peguam pengarah di Taiwan',
      'chang-rongxuan': 'Peguam di Taiwan',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Pengurus operasi Korea',
      'huang-shengping': 'Akauntan rakan kongsi',
    },
  },
  ru: {
    label: 'НАША КОМАНДА',
    title: 'Международная команда Hovering',
    description:
      'Профили адвокатов, операционного менеджера и партнёра-бухгалтера Hovering.',
    representativeTitle: 'Управляющий адвокат',
    teamTitle: 'Адвокаты и сотрудники',
    partnerTitle: 'Партнёр-бухгалтер (CPA)',
    introLabel: 'О себе',
    educationLabel: 'Образование',
    experienceLabel: 'Опыт',
    photoAltPrefix: 'Фото',
    workingLanguagesLabel: 'Рабочие языки',
    fullProfileLabel: 'Полный профиль (на английском)',
    keyFactsHeading: 'Адвокат Wei Tseng (曾雋崴) — основные сведения',
    qualificationLabel: 'Квалификация и фирма',
    qualificationSentence:
      '{name} уполномочена вести адвокатскую деятельность на Тайване и возглавляет {firm}.',
    practiceLabel: 'Основные направления',
    consultationLanguagesLabel: 'Языки консультации',
    roles: {
      'tseng-junwei': 'Управляющий адвокат на Тайване (Managing Attorney)',
      'chang-rongxuan': 'Адвокат на Тайване (Taiwan Attorney)',
      'chang-fangyu': 'Помощник адвоката',
      'son-jungmin': 'Операционный менеджер по Корее (Korea Operations Manager)',
      'huang-shengping': 'Партнёр-бухгалтер (Partner CPA)',
    },
  },
  tr: {
    label: 'EKİBİMİZ',
    title: 'Hovering’in uluslararası ekibi',
    description:
      'Hovering avukatlarının, operasyon yönetiminin ve bağlı muhasebe bürosunun profilleri.',
    representativeTitle: 'Yönetici avukat',
    teamTitle: 'Avukatlar ve çalışanlar',
    partnerTitle: 'Bağlı muhasebe bürosu',
    introLabel: 'Tanıtım',
    educationLabel: 'Eğitim',
    experienceLabel: 'Deneyim',
    photoAltPrefix: 'Fotoğraf',
    workingLanguagesLabel: 'Çalışma dilleri',
    fullProfileLabel: 'Tam profil (İngilizce olarak)',
    keyFactsHeading: 'Avukat Wei Tseng — Temel bilgiler',
    qualificationLabel: 'Yetki ve büro',
    qualificationSentence:
      '{name}, Tayvan’da meslek yürütmeye yetkilidir ve {firm}’in yönetici avukatıdır.',
    practiceLabel: 'Başlıca alanlar',
    consultationLanguagesLabel: 'Görüşme dilleri',
    roles: {
      'tseng-junwei': 'Tayvan’da yönetici avukat',
      'chang-rongxuan': 'Tayvan avukatı',
      'chang-fangyu': 'Hukuk asistanı (Paralegal)',
      'son-jungmin': 'Kore operasyonları yöneticisi',
      'huang-shengping': 'Ortak mali müşavir (Partner CPA)',
    },
  },
  it: {
    label: 'IL NOSTRO TEAM',
    title: 'Team internazionale di Hovering',
    description:
      'Profili delle avvocate e degli avvocati, del responsabile operativo e del commercialista partner di Hovering.',
    representativeTitle: 'Avvocata responsabile',
    teamTitle: 'Avvocate, avvocati e collaboratori',
    partnerTitle: 'Commercialista partner',
    introLabel: 'Presentazione',
    educationLabel: 'Formazione',
    experienceLabel: 'Esperienza',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Lingue di lavoro',
    fullProfileLabel: 'Profilo completo (in inglese)',
    keyFactsHeading: 'Avvocata Wei Tseng — Dati essenziali',
    qualificationLabel: 'Qualifica e studio',
    qualificationSentence:
      '{name} è abilitata all’esercizio della professione a Taiwan ed è l’avvocata responsabile di {firm}.',
    practiceLabel: 'Ambiti principali',
    consultationLanguagesLabel: 'Lingue di consulenza',
    roles: {
      'tseng-junwei': 'Avvocata responsabile a Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Avvocato a Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Collaboratore legale (paralegal)',
      'son-jungmin': 'Responsabile operativo Corea (Korea Operations Manager)',
      'huang-shengping': 'Commercialista partner a Taiwan (Partner CPA)',
    },
  },
  nl: {
    label: 'ONS TEAM',
    title: 'Internationaal team van Hovering',
    description:
      'Profielen van de advocaten, de bedrijfsleiding en het aangesloten accountantskantoor van Hovering.',
    representativeTitle: 'Leidinggevend advocaat',
    teamTitle: 'Advocaten en medewerkers',
    partnerTitle: 'Aangesloten accountantskantoor',
    introLabel: 'Kennismaking',
    educationLabel: 'Opleiding',
    experienceLabel: 'Ervaring',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Werktalen',
    fullProfileLabel: 'Volledig profiel (in het Engels)',
    keyFactsHeading: 'Advocaat Wei Tseng — Kerngegevens',
    qualificationLabel: 'Bevoegdheid en kantoor',
    qualificationSentence:
      '{name} is bevoegd tot de advocatuur in Taiwan en is leidinggevend advocaat van {firm}.',
    practiceLabel: 'Hoofdgebieden',
    consultationLanguagesLabel: 'Consultatietalen',
    roles: {
      'tseng-junwei': 'Leidinggevend advocaat in Taiwan',
      'chang-rongxuan': 'Advocaat in Taiwan',
      'chang-fangyu': 'Juridisch medewerker (paralegal)',
      'son-jungmin': 'Operationeel manager Korea',
      'huang-shengping': 'Accountant-partner (CPA)',
    },
  },
  pl: {
    label: 'NASZ ZESPÓŁ',
    title: 'Międzynarodowy zespół Hovering',
    description:
      'Profile adwokatów, kierownictwa operacyjnego i partnerskiego biura rachunkowego Hovering.',
    representativeTitle: 'Adwokatka kierująca kancelarią',
    teamTitle: 'Adwokaci i współpracownicy',
    partnerTitle: 'Partnerskie biuro rachunkowe',
    introLabel: 'Przedstawienie',
    educationLabel: 'Wykształcenie',
    experienceLabel: 'Doświadczenie',
    photoAltPrefix: 'Zdjęcie',
    workingLanguagesLabel: 'Języki pracy',
    fullProfileLabel: 'Pełny profil (w języku angielskim)',
    keyFactsHeading: 'Adwokatka Wei Tseng — dane zasadnicze',
    qualificationLabel: 'Uprawnienie i kancelaria',
    qualificationSentence:
      '{name} jest uprawniona do wykonywania zawodu adwokata na Tajwanie i kieruje kancelarią {firm}.',
    practiceLabel: 'Główne dziedziny',
    consultationLanguagesLabel: 'Języki konsultacji',
    roles: {
      'tseng-junwei': 'Adwokatka kierująca kancelarią na Tajwanie (Managing Attorney)',
      'chang-rongxuan': 'Adwokat na Tajwanie (Taiwan Attorney)',
      'chang-fangyu': 'Asystent prawny (paralegal)',
      'son-jungmin': 'Kierownictwo ds. operacji w Korei (Korea Operations Manager)',
      'huang-shengping': 'Wspólnik biura rachunkowego (Partner CPA)',
    },
  },
  hi: {
    label: 'हमारी टीम',
    title: 'Hovering की अंतरराष्ट्रीय टीम',
    description:
      'Hovering के अधिवक्ताओं, कोरिया संचालन के नेतृत्व और साझेदार लेखाकार की प्रोफ़ाइलें।',
    representativeTitle: 'प्रबंध अधिवक्ता',
    teamTitle: 'अधिवक्ता और सहयोगी',
    partnerTitle: 'साझेदार लेखाकार',
    introLabel: 'परिचय',
    educationLabel: 'शिक्षा',
    experienceLabel: 'अनुभव',
    photoAltPrefix: 'फ़ोटो',
    workingLanguagesLabel: 'कार्य भाषाएँ',
    fullProfileLabel: 'पूर्ण प्रोफ़ाइल (अंग्रेज़ी में)',
    keyFactsHeading: 'अधिवक्ता Wei Tseng — मुख्य तथ्य',
    qualificationLabel: 'योग्यता और कार्यालय',
    qualificationSentence:
      '{name} ताइवान में व्यवसाय करने के लिए अधिकृत हैं और {firm} की प्रबंध अधिवक्ता हैं।',
    practiceLabel: 'मुख्य क्षेत्र',
    consultationLanguagesLabel: 'परामर्श भाषाएँ',
    roles: {
      'tseng-junwei': 'ताइवान में प्रबंध अधिवक्ता (Managing Attorney)',
      'chang-rongxuan': 'ताइवान अधिवक्ता (Taiwan Attorney)',
      'chang-fangyu': 'विधि सहायक (Paralegal)',
      'son-jungmin': 'कोरिया संचालन का नेतृत्व (Korea Operations Manager)',
      'huang-shengping': 'साझेदार लेखाकार (Partner CPA)',
    },
  },
  sv: {
    label: 'VÅRT TEAM',
    title: 'Hoverings internationella team',
    description:
      'Profiler för Hoverings advokater, operativ ledning för Korea och anknuten revisionsbyrå.',
    representativeTitle: 'Ledande advokat',
    teamTitle: 'Advokater och medarbetare',
    partnerTitle: 'Anknuten revisionsbyrå',
    introLabel: 'Presentation',
    educationLabel: 'Utbildning',
    experienceLabel: 'Erfarenhet',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Arbetsspråk',
    fullProfileLabel: 'Fullständig profil (på engelska)',
    keyFactsHeading: 'Advokat Wei Tseng — Kärnuppgifter',
    qualificationLabel: 'Behörighet och byrå',
    qualificationSentence:
      '{name} är behörig att utöva advokatyrket i Taiwan och är ledande advokat vid {firm}.',
    practiceLabel: 'Huvudområden',
    consultationLanguagesLabel: 'Rådgivningsspråk',
    roles: {
      'tseng-junwei': 'Ledande advokat i Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Advokat i Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Juristassistent',
      'son-jungmin': 'Operativ ledning Korea (Korea Operations Manager)',
      'huang-shengping': 'Anknuten revisor (Partner CPA)',
    },
  },
  da: {
    label: 'VORES TEAM',
    title: 'Hoverings internationale team',
    description:
      'Profiler for Hoverings advokater, den operative ledelse og det tilknyttede revisionskontor.',
    representativeTitle: 'Ledende advokat',
    teamTitle: 'Advokater og medarbejdere',
    partnerTitle: 'Tilknyttet revisionskontor',
    introLabel: 'Præsentation',
    educationLabel: 'Uddannelse',
    experienceLabel: 'Erfaring',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Arbejdssprog',
    fullProfileLabel: 'Fuld profil (på engelsk)',
    keyFactsHeading: 'Advokat Wei Tseng — Kerneoplysninger',
    qualificationLabel: 'Beskikkelse og kontor',
    qualificationSentence:
      '{name} er berettiget til at udøve advokaterhvervet i Taiwan og er ledende advokat ved {firm}.',
    practiceLabel: 'Hovedområder',
    consultationLanguagesLabel: 'Rådgivningssprog',
    roles: {
      'tseng-junwei': 'Ledende advokat i Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Advokat i Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Leder af Korea-forretningen (Korea Operations Manager)',
      'huang-shengping': 'Tilknyttet revisor (Partner CPA)',
    },
  },
  nb: {
    label: 'VÅRT TEAM',
    title: 'Hoverings internasjonale team',
    description:
      'Profiler for Hoverings advokater, den operative ledelsen og revisjonspartneren.',
    representativeTitle: 'Ledende advokat',
    teamTitle: 'Advokater og medarbeidere',
    partnerTitle: 'Revisjonspartner',
    introLabel: 'Presentasjon',
    educationLabel: 'Utdanning',
    experienceLabel: 'Erfaring',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Arbeidsspråk',
    fullProfileLabel: 'Fullstendig profil (på engelsk)',
    keyFactsHeading: 'Advokat Wei Tseng — Kjerneopplysninger',
    qualificationLabel: 'Bevilling og kontor',
    qualificationSentence:
      '{name} har advokatbevilling i Taiwan og er ledende advokat ved {firm}.',
    practiceLabel: 'Hovedområder',
    consultationLanguagesLabel: 'Rådgivningsspråk',
    roles: {
      'tseng-junwei': 'Ledende advokat i Taiwan',
      'chang-rongxuan': 'Advokat i Taiwan',
      'chang-fangyu': 'Juridisk assistent',
      'son-jungmin': 'Operativ leder, Korea',
      'huang-shengping': 'Revisjonspartner (CPA)',
    },
  },
  fi: {
    label: 'TIIMIMME',
    title: 'Hoveringin kansainvälinen tiimi',
    description:
      'Hoveringin asianajajien, Korean toimintojen johdon ja tilintarkastajaosakkaan profiilit.',
    representativeTitle: 'Johtava asianajaja',
    teamTitle: 'Asianajajat ja työntekijät',
    partnerTitle: 'Tilintarkastajaosakas',
    introLabel: 'Esittely',
    educationLabel: 'Koulutus',
    experienceLabel: 'Kokemus',
    photoAltPrefix: 'Valokuva',
    workingLanguagesLabel: 'Työkielet',
    fullProfileLabel: 'Koko profiili (englanniksi)',
    keyFactsHeading: 'Asianajaja Wei Tseng — Keskeiset tiedot',
    qualificationLabel: 'Kelpoisuus ja toimisto',
    qualificationSentence:
      '{name} on kelpoinen harjoittamaan asianajajan ammattia Taiwanissa ja on toimiston {firm} johtava asianajaja.',
    practiceLabel: 'Pääalueet',
    consultationLanguagesLabel: 'Neuvontakielet',
    roles: {
      'tseng-junwei': 'Johtava asianajaja Taiwanissa',
      'chang-rongxuan': 'Asianajaja Taiwanissa',
      'chang-fangyu': 'Lakimiesavustaja',
      'son-jungmin': 'Korean toimintojen johtaja',
      'huang-shengping': 'Osakkaana toimiva tilintarkastaja',
    },
  },
  cs: {
    label: 'NÁŠ TÝM',
    title: 'Mezinárodní tým Hovering',
    description:
      'Profily advokátek a advokátů, provozního vedení a přidruženého účetnictví a auditu Hovering.',
    representativeTitle: 'Řídící advokátka',
    teamTitle: 'Advokáti a spolupracovníci',
    partnerTitle: 'Přidružené účetnictví',
    introLabel: 'Představení',
    educationLabel: 'Vzdělání',
    experienceLabel: 'Praxe',
    photoAltPrefix: 'Fotografie',
    workingLanguagesLabel: 'Pracovní jazyky',
    fullProfileLabel: 'Úplný profil (v angličtině)',
    keyFactsHeading: 'Advokátka Wei Tseng — Základní údaje',
    qualificationLabel: 'Oprávnění a kancelář',
    qualificationSentence:
      '{name} je oprávněna vykonávat advokacii na Tchaj-wanu a je řídící advokátkou {firm}.',
    practiceLabel: 'Hlavní oblasti',
    consultationLanguagesLabel: 'Jazyky konzultace',
    roles: {
      'tseng-junwei': 'Řídící advokátka na Tchaj-wanu (Managing Attorney)',
      'chang-rongxuan': 'Advokát na Tchaj-wanu (Taiwan Attorney)',
      'chang-fangyu': 'Právní asistent',
      'son-jungmin': 'Vedení provozu v Koreji (Korea Operations Manager)',
      'huang-shengping': 'Partner účetní kanceláře (Partner CPA)',
    },
  },
  hu: {
    label: 'CSAPATUNK',
    title: 'A Hovering nemzetközi csapata',
    description:
      'A Hovering ügyvédeinek, a működési vezetőnek és a társult könyvvizsgálónak a profilja.',
    representativeTitle: 'Vezető ügyvédnő',
    teamTitle: 'Ügyvédek és munkatársak',
    partnerTitle: 'Társult könyvvizsgáló',
    introLabel: 'Bemutatkozás',
    educationLabel: 'Tanulmányok',
    experienceLabel: 'Tapasztalat',
    photoAltPrefix: 'Fénykép',
    workingLanguagesLabel: 'Munkanyelvek',
    fullProfileLabel: 'Teljes profil (angolul)',
    keyFactsHeading: 'Wei Tseng ügyvédnő — Fő adatok',
    qualificationLabel: 'Képesítés és iroda',
    qualificationSentence:
      '{name} jogosult Tajvanon ügyvédi tevékenységet folytatni, és a {firm} vezető ügyvédnője.',
    practiceLabel: 'Fő területek',
    consultationLanguagesLabel: 'Tanácsadási nyelvek',
    roles: {
      'tseng-junwei': 'Vezető ügyvédnő Tajvanon (Managing Attorney)',
      'chang-rongxuan': 'Ügyvéd Tajvanon (Taiwan Attorney)',
      'chang-fangyu': 'Jogi asszisztens',
      'son-jungmin': 'Koreai működési vezető (Korea Operations Manager)',
      'huang-shengping': 'Társult könyvvizsgáló (Partner CPA)',
    },
  },
  ro: {
    label: 'ECHIPA NOASTRĂ',
    title: 'Echipa internațională Hovering',
    description:
      'Profilurile avocaților, ale conducerii operaționale și ale cabinetului de contabilitate asociat Hovering.',
    representativeTitle: 'Avocată coordonatoare',
    teamTitle: 'Avocați și colaboratori',
    partnerTitle: 'Contabilitate asociată',
    introLabel: 'Prezentare',
    educationLabel: 'Studii',
    experienceLabel: 'Experiență',
    photoAltPrefix: 'Fotografie',
    workingLanguagesLabel: 'Limbi de lucru',
    fullProfileLabel: 'Profil complet (în engleză)',
    keyFactsHeading: 'Avocata Wei Tseng — Date esențiale',
    qualificationLabel: 'Calificare și cabinet',
    qualificationSentence:
      '{name} este autorizată să profeseze în Taiwan și este avocata coordonatoare a {firm}.',
    practiceLabel: 'Domenii principale',
    consultationLanguagesLabel: 'Limbi de consultanță',
    roles: {
      'tseng-junwei': 'Avocată coordonatoare în Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Avocat în Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Asistent juridic',
      'son-jungmin': 'Conducerea operațiunilor din Coreea (Korea Operations Manager)',
      'huang-shengping': 'Contabil asociat (Partner CPA)',
    },
  },
  uk: {
    label: 'НАША КОМАНДА',
    title: 'Міжнародна команда Hovering',
    description:
      'Профілі адвокатів, операційного керівництва та бухгалтера-партнера Hovering.',
    representativeTitle: 'Керівна адвокатка',
    teamTitle: 'Адвокати та співробітники',
    partnerTitle: 'Бухгалтер-партнер',
    introLabel: 'Ознайомлення',
    educationLabel: 'Освіта',
    experienceLabel: 'Досвід',
    photoAltPrefix: 'Світлина',
    workingLanguagesLabel: 'Робочі мови',
    fullProfileLabel: 'Повний профіль (англійською)',
    keyFactsHeading: 'Адвокатка Wei Tseng — основні відомості',
    qualificationLabel: 'Кваліфікація та фірма',
    qualificationSentence:
      '{name} уповноважена провадити адвокатську діяльність на Тайвані та є керівною адвокаткою {firm}.',
    practiceLabel: 'Основні напрями',
    consultationLanguagesLabel: 'Мови консультації',
    roles: {
      'tseng-junwei': 'Керівна адвокатка на Тайвані (Managing Attorney)',
      'chang-rongxuan': 'Адвокат на Тайвані (Taiwan Attorney)',
      'chang-fangyu': 'Помічник адвоката (paralegal)',
      'son-jungmin': 'Керівництво операціями в Кореї (Korea Operations Manager)',
      'huang-shengping': 'Партнер бухгалтерської фірми (Partner CPA)',
    },
  },
  el: {
    label: 'Η ΟΜΑΔΑ ΜΑΣ',
    title: 'Η διεθνής ομάδα της Hovering',
    description:
      'Προφίλ των δικηγόρων, του νομικού συνεργάτη, του υπευθύνου λειτουργιών και του συνεργαζόμενου λογιστή της Hovering.',
    representativeTitle: 'Διευθύνουσα δικηγόρος',
    teamTitle: 'Δικηγόροι και συνεργάτες',
    partnerTitle: 'Συνεργαζόμενο λογιστικό γραφείο',
    introLabel: 'Παρουσίαση',
    educationLabel: 'Σπουδές',
    experienceLabel: 'Εμπειρία',
    photoAltPrefix: 'Φωτογραφία',
    workingLanguagesLabel: 'Γλώσσες εργασίας',
    fullProfileLabel: 'Πλήρες προφίλ (στα αγγλικά)',
    keyFactsHeading: 'Η δικηγόρος Wei Tseng — Βασικά στοιχεία',
    qualificationLabel: 'Προσόντα και γραφείο',
    qualificationSentence:
      'Η {name} έχει άδεια άσκησης δικηγορίας στην Ταϊβάν και είναι η διευθύνουσα δικηγόρος της {firm}.',
    practiceLabel: 'Κύριοι τομείς',
    consultationLanguagesLabel: 'Γλώσσες συμβουλευτικής',
    roles: {
      'tseng-junwei': 'Διευθύνουσα δικηγόρος στην Ταϊβάν (Managing Attorney)',
      'chang-rongxuan': 'Δικηγόρος στην Ταϊβάν (Taiwan Attorney)',
      'chang-fangyu': 'Δικηγορικός συνεργάτης (Paralegal)',
      'son-jungmin': 'Επικεφαλής λειτουργιών για την Κορέα (Korea Operations Manager)',
      'huang-shengping': 'Συνεργαζόμενος λογιστής (Partner CPA)',
    },
  },
  he: {
    label: 'הצוות שלנו',
    title: 'הצוות הבין־לאומי של Hovering',
    description:
      'פרופילים של עורכות ועורכי הדין, של ההנהלה התפעולית ושל רואה החשבון השותף של Hovering.',
    representativeTitle: 'עורכת הדין המנהלת',
    teamTitle: 'עורכי דין ועובדים',
    partnerTitle: 'רואה חשבון שותף',
    introLabel: 'הצגה',
    educationLabel: 'השכלה',
    experienceLabel: 'ניסיון',
    photoAltPrefix: 'תצלום',
    workingLanguagesLabel: 'שפות עבודה',
    fullProfileLabel: 'פרופיל מלא (באנגלית)',
    keyFactsHeading: 'עורכת הדין Wei Tseng — נתונים עיקריים',
    qualificationLabel: 'הסמכה ומשרד',
    qualificationSentence:
      '{name} מוסמכת לעסוק בעריכת דין בטאיוואן והיא עורכת הדין המנהלת של {firm}.',
    practiceLabel: 'תחומים עיקריים',
    consultationLanguagesLabel: 'שפות הייעוץ',
    roles: {
      'tseng-junwei': 'עורכת הדין המנהלת בטאיוואן (Managing Attorney)',
      'chang-rongxuan': 'עורך דין בטאיוואן (Taiwan Attorney)',
      'chang-fangyu': 'עוזר משפטי (Paralegal)',
      'son-jungmin': 'ניהול הפעילות בקוריאה (Korea Operations Manager)',
      'huang-shengping': 'רואה חשבון שותף (Partner CPA)',
    },
  },
  bn: {
    label: 'দল',
    title: 'Hovering-এর আন্তর্জাতিক দল',
    description:
      'Hovering-এর আইনজীবী, পরিচালনা ব্যবস্থাপনা ও অংশীদার চার্টার্ড অ্যাকাউন্ট্যান্টের পরিচিতি।',
    representativeTitle: 'প্রধান আইনজীবী',
    teamTitle: 'আইনজীবী ও সহকর্মী',
    partnerTitle: 'অংশীদার চার্টার্ড অ্যাকাউন্ট্যান্ট',
    introLabel: 'পরিচিতি',
    educationLabel: 'শিক্ষা',
    experienceLabel: 'অভিজ্ঞতা',
    photoAltPrefix: 'ছবি',
    workingLanguagesLabel: 'কর্ম ভাষা',
    fullProfileLabel: 'পূর্ণ পরিচিতি (ইংরেজিতে)',
    keyFactsHeading: 'আইনজীবী Wei Tseng — মূল তথ্য',
    qualificationLabel: 'যোগ্যতা ও কার্যালয়',
    qualificationSentence:
      '{name} তাইওয়ানে আইনপেশা চর্চার অনুমতিপ্রাপ্ত এবং {firm}-এর প্রধান আইনজীবী।',
    practiceLabel: 'প্রধান ক্ষেত্র',
    consultationLanguagesLabel: 'পরামর্শের ভাষা',
    roles: {
      'tseng-junwei': 'তাইওয়ানে প্রধান আইনজীবী',
      'chang-rongxuan': 'তাইওয়ানের আইনজীবী',
      'chang-fangyu': 'আইনি সহকারী',
      'son-jungmin': 'কোরিয়া পরিচালনা ব্যবস্থাপক',
      'huang-shengping': 'অংশীদার চার্টার্ড অ্যাকাউন্ট্যান্ট',
    },
  },
  ur: {
    label: 'ٹیم',
    title: 'Hovering کی بین الاقوامی ٹیم',
    description:
      'Hovering کے وکلا، کوریا کے امور کی قیادت اور شراکت دار سرٹیفائیڈ پبلک اکاؤنٹنٹ کی پروفائلز۔',
    representativeTitle: 'منتظمہ وکیلہ',
    teamTitle: 'وکلا اور عملہ',
    partnerTitle: 'شراکت دار، سرٹیفائیڈ پبلک اکاؤنٹنٹ',
    introLabel: 'تعارف',
    educationLabel: 'تعلیم',
    experienceLabel: 'تجربہ',
    photoAltPrefix: 'تصویر',
    workingLanguagesLabel: 'کام کی زبانیں',
    fullProfileLabel: 'مکمل پروفائل (انگریزی میں)',
    keyFactsHeading: 'وکیلہ Wei Tseng — بنیادی حقائق',
    qualificationLabel: 'اہلیت اور دفتر',
    qualificationSentence:
      '{name} تائیوان میں وکالت کی مجاز ہیں اور {firm} کی منتظمہ وکیلہ ہیں۔',
    practiceLabel: 'اہم شعبے',
    consultationLanguagesLabel: 'مشورے کی زبانیں',
    roles: {
      'tseng-junwei': 'تائیوان میں منتظمہ وکیلہ',
      'chang-rongxuan': 'تائیوان کے وکیل',
      'chang-fangyu': 'قانونی معاون',
      'son-jungmin': 'کوریا کے امور کے منتظم',
      'huang-shengping': 'شراکت دار، سرٹیفائیڈ پبلک اکاؤنٹنٹ',
    },
  },
  fa: {
    label: 'تیم',
    title: 'تیم بین‌المللی Hovering',
    description:
      'نمایهٔ وکلا، مدیریت عملیات و حسابدار شریک Hovering.',
    representativeTitle: 'وکیلِ مدیر',
    teamTitle: 'وکلا و همکاران',
    partnerTitle: 'حسابدار شریک',
    introLabel: 'معرفی',
    educationLabel: 'تحصیلات',
    experienceLabel: 'سابقه',
    photoAltPrefix: 'تصویر',
    workingLanguagesLabel: 'زبان‌های کار',
    fullProfileLabel: 'نمایهٔ کامل (به انگلیسی)',
    keyFactsHeading: 'وکیل Wei Tseng — اطلاعات اصلی',
    qualificationLabel: 'صلاحیت و دفتر',
    qualificationSentence:
      '{name} مجاز به وکالت در تایوان است و وکیلِ مدیر {firm} است.',
    practiceLabel: 'زمینه‌های اصلی',
    consultationLanguagesLabel: 'زبان‌های مشاوره',
    roles: {
      'tseng-junwei': 'وکیلِ مدیر در تایوان',
      'chang-rongxuan': 'وکیل در تایوان',
      'chang-fangyu': 'دستیار حقوقی',
      'son-jungmin': 'مدیر عملیات کره',
      'huang-shengping': 'حسابدار رسمی شریک',
    },
  },
  my: {
    label: 'အဖွဲ့',
    title: 'Hovering ၏ နိုင်ငံတကာအဖွဲ့',
    description:
      'Hovering ၏ ရှေ့နေများ၊ လုပ်ငန်းစီမံခန့်ခွဲမှုနှင့် မိတ်ဖက် လက်မှတ်ရစာရင်းကိုင်၏ ကိုယ်ရေးအချက်အလက်များ။',
    representativeTitle: 'ဦးဆောင်ရှေ့နေ',
    teamTitle: 'ရှေ့နေများနှင့် ဝန်ထမ်းများ',
    partnerTitle: 'မိတ်ဖက် လက်မှတ်ရစာရင်းကိုင်',
    introLabel: 'မိတ်ဆက်',
    educationLabel: 'ပညာရေး',
    experienceLabel: 'အတွေ့အကြုံ',
    photoAltPrefix: 'ဓာတ်ပုံ',
    workingLanguagesLabel: 'လုပ်ငန်းသုံး ဘာသာစကားများ',
    fullProfileLabel: 'ကိုယ်ရေးအပြည့်အစုံ (အင်္ဂလိပ်ဘာသာဖြင့်)',
    keyFactsHeading: 'ရှေ့နေ ဒေါ် Wei Tseng — အခြေခံအချက်များ',
    qualificationLabel: 'အရည်အချင်းနှင့် ရုံး',
    qualificationSentence:
      '{name} သည် ထိုင်ဝမ်တွင် ရှေ့နေအဖြစ် လုပ်ကိုင်ခွင့်ရှိပြီး {firm} ၏ ဦးဆောင်ရှေ့နေဖြစ်သည်။',
    practiceLabel: 'အဓိကနယ်ပယ်များ',
    consultationLanguagesLabel: 'တိုင်ပင်ဆွေးနွေးသည့် ဘာသာစကားများ',
    roles: {
      'tseng-junwei': 'ထိုင်ဝမ်ရှိ ဦးဆောင်ရှေ့နေ',
      'chang-rongxuan': 'ထိုင်ဝမ်ရှိ ရှေ့နေ',
      'chang-fangyu': 'ဥပဒေအကူ',
      'son-jungmin': 'ကိုရီးယားလုပ်ငန်း စီမံခန့်ခွဲသူ',
      'huang-shengping': 'မိတ်ဖက် လက်မှတ်ရစာရင်းကိုင်',
    },
  },
  ta: {
    label: 'குழு',
    title: 'Hovering-இன் பன்னாட்டுக் குழு',
    description:
      'Hovering வழக்கறிஞர்கள், செயல்பாட்டு நிர்வாகம் மற்றும் கூட்டாளர் பட்டயக் கணக்காளரின் சுயவிவரங்கள்.',
    representativeTitle: 'நிர்வாக வழக்கறிஞர்',
    teamTitle: 'வழக்கறிஞர்கள் மற்றும் உதவியாளர்கள்',
    partnerTitle: 'கூட்டாளர் பட்டயக் கணக்காளர்',
    introLabel: 'அறிமுகம்',
    educationLabel: 'கல்வி',
    experienceLabel: 'அனுபவம்',
    photoAltPrefix: 'புகைப்படம்',
    workingLanguagesLabel: 'பணி மொழிகள்',
    fullProfileLabel: 'முழு சுயவிவரம் (ஆங்கிலத்தில்)',
    keyFactsHeading: 'வழக்கறிஞர் Wei Tseng — முதன்மைத் தகவல்',
    qualificationLabel: 'தகுதியும் அலுவலகமும்',
    qualificationSentence:
      '{name} தைவானில் வழக்கறிஞர் தொழில் செய்யத் தகுதி பெற்றவர்; {firm}-இன் நிர்வாக வழக்கறிஞர் ஆவார்.',
    practiceLabel: 'முதன்மைத் துறைகள்',
    consultationLanguagesLabel: 'ஆலோசனை மொழிகள்',
    roles: {
      'tseng-junwei': 'தைவானில் நிர்வாக வழக்கறிஞர்',
      'chang-rongxuan': 'தைவான் வழக்கறிஞர்',
      'chang-fangyu': 'சட்ட உதவியாளர்',
      'son-jungmin': 'கொரியா செயல்பாட்டு நிர்வாகி',
      'huang-shengping': 'கூட்டாளர் பட்டயக் கணக்காளர்',
    },
  },
  ne: {
    label: 'टोली',
    title: 'Hovering को अन्तर्राष्ट्रिय टोली',
    description:
      'Hovering का अधिवक्ता, सञ्चालन नेतृत्व र साझेदार चार्टर्ड एकाउन्टेन्टका प्रोफाइल।',
    representativeTitle: 'प्रबन्ध अधिवक्ता',
    teamTitle: 'अधिवक्ता र सहयोगी',
    partnerTitle: 'साझेदार चार्टर्ड एकाउन्टेन्ट',
    introLabel: 'परिचय',
    educationLabel: 'शिक्षा',
    experienceLabel: 'अनुभव',
    photoAltPrefix: 'तस्बिर',
    workingLanguagesLabel: 'कामका भाषा',
    fullProfileLabel: 'पूर्ण प्रोफाइल (अङ्ग्रेजीमा)',
    keyFactsHeading: 'अधिवक्ता Wei Tseng — मुख्य तथ्य',
    qualificationLabel: 'योग्यता र फर्म',
    qualificationSentence:
      '{name} ताइवानमा व्यवसाय गर्न अधिकृत हुनुहुन्छ र {firm} की प्रबन्ध अधिवक्ता हुनुहुन्छ।',
    practiceLabel: 'मुख्य क्षेत्र',
    consultationLanguagesLabel: 'परामर्श भाषा',
    roles: {
      'tseng-junwei': 'ताइवानकी प्रबन्ध अधिवक्ता',
      'chang-rongxuan': 'ताइवान अधिवक्ता',
      'chang-fangyu': 'कानुनी सहायक',
      'son-jungmin': 'कोरिया सञ्चालन व्यवस्थापक',
      'huang-shengping': 'साझेदार चार्टर्ड एकाउन्टेन्ट',
    },
  },
  km: {
    label: 'ក្រុម',
    title: 'ក្រុមអន្ដរជាតិ Hovering',
    description:
      'ប្រវត្ដិមេធាវី អ្នកគ្រប់គ្រងប្រតិបត្ដិ និងគណនេយ្យករសាធារណៈដៃគូនៃ Hovering',
    representativeTitle: 'មេធាវីគ្រប់គ្រង',
    teamTitle: 'មេធាវី និងបុគ្គលិក',
    partnerTitle: 'គណនេយ្យករសាធារណៈដៃគូ',
    introLabel: 'សេចក្ដីណែនាំ',
    educationLabel: 'ការសិក្សា',
    experienceLabel: 'បទពិសោធន៍',
    photoAltPrefix: 'រូប',
    workingLanguagesLabel: 'ភាសាធ្វើការ',
    fullProfileLabel: 'ប្រវត្ដិពេញ (ជាភាសាអង់គ្លេស)',
    keyFactsHeading: 'មេធាវីស្ដ្រី Wei Tseng — ព័ត៌មានមូលដ្ឋាន',
    qualificationLabel: 'គុណវុឌ្ឍិ និងស្ថាប័ន',
    qualificationSentence:
      '{name} ជាមេធាវីស្ដ្រីមានសិទ្ធិអនុវត្ដវិជ្ជាជីវៈនៅតៃវ៉ាន់ និងជាមេធាវីគ្រប់គ្រងនៃ {firm}',
    practiceLabel: 'វិស័យទទួលធ្វើសំខាន់',
    consultationLanguagesLabel: 'ភាសានៃការពិគ្រោះយោបល់',
    roles: {
      'tseng-junwei': 'មេធាវីគ្រប់គ្រងនៅតៃវ៉ាន់',
      'chang-rongxuan': 'មេធាវីនៅតៃវ៉ាន់',
      'chang-fangyu': 'ជំនួយការផ្លូវច្បាប់',
      'son-jungmin': 'អ្នកគ្រប់គ្រងប្រតិបត្ដិសម្រាប់កូរ៉េ',
      'huang-shengping': 'គណនេយ្យករសាធារណៈដៃគូ',
    },
  },
  mn: {
    label: 'БАГ',
    title: 'Hovering-ийн олон улсын баг',
    description:
      'Hovering-ийн өмгөөлөгч, үйл ажиллагаа хариуцсан менежер, түнш нягтлан бодогчийн танилцуулга.',
    representativeTitle: 'Удирдах өмгөөлөгч',
    teamTitle: 'Өмгөөлөгч ба ажилтан',
    partnerTitle: 'Түнш нягтлан бодогч',
    introLabel: 'Танилцуулга',
    educationLabel: 'Боловсрол',
    experienceLabel: 'Туршлага',
    photoAltPrefix: 'Зураг',
    workingLanguagesLabel: 'Ажлын хэл',
    fullProfileLabel: 'Бүрэн танилцуулга (англи хэлээр)',
    keyFactsHeading: 'Өмгөөлөгч Wei Tseng (曾雋崴) — үндсэн мэдээлэл',
    qualificationLabel: 'Эрх ба фирм',
    qualificationSentence:
      '{name} Тайваньд өмгөөлөгчөөр ажиллах эрхтэй бөгөөд {firm}-ийн удирдах өмгөөлөгч юм.',
    practiceLabel: 'Үндсэн чиглэл',
    consultationLanguagesLabel: 'Зөвлөгөөний хэл',
    roles: {
      'tseng-junwei': 'Тайвань дахь удирдах өмгөөлөгч',
      'chang-rongxuan': 'Тайвань дахь өмгөөлөгч',
      'chang-fangyu': 'Хуулийн туслах',
      'son-jungmin': 'Солонгосын үйл ажиллагаа хариуцсан менежер',
      'huang-shengping': 'Түнш нягтлан бодогч',
    },
  },
  sk: {
    label: 'NÁŠ TÍM',
    title: 'Medzinárodný tím Hovering',
    description:
      'Profily advokátok a advokátov, prevádzkového vedenia a pridruženého účtovníctva a auditu Hovering.',
    representativeTitle: 'Riadiaca advokátka',
    teamTitle: 'Právnici a spolupracovníci',
    partnerTitle: 'Partner (audítor)',
    introLabel: 'Predstavenie',
    educationLabel: 'Vzdelanie',
    experienceLabel: 'Prax',
    photoAltPrefix: 'Portrét',
    workingLanguagesLabel: 'Pracovné jazyky',
    fullProfileLabel: 'Úplný profil (v angličtine)',
    keyFactsHeading: 'Advokátka Wei Tseng — Základné údaje',
    qualificationLabel: 'Oprávnenie a kancelária',
    qualificationSentence:
      '{name} je oprávnená vykonávať advokáciu na Taiwane a je riadiacou advokátkou {firm}.',
    practiceLabel: 'Hlavné oblasti',
    consultationLanguagesLabel: 'Jazyky konzultácie',
    roles: {
      'tseng-junwei': 'Riadiaca advokátka na Taiwane',
      'chang-rongxuan': 'Advokát na Taiwane',
      'chang-fangyu': 'Právna asistentka',
      'son-jungmin': 'Vedenie prevádzky pre Kóreu',
      'huang-shengping': 'Partner (audítor)',
    },
  },
  bg: {
    label: 'ЕКИПЪТ',
    title: 'Международен екип Hovering',
    description:
      'Профили на адвокатките и адвокатите, на оперативното ръководство и на партньора — експерт-счетоводител на Hovering.',
    representativeTitle: 'Ръководна адвокатка',
    teamTitle: 'Адвокатки, адвокати и сътрудници',
    partnerTitle: 'Партньор — експерт-счетоводител',
    introLabel: 'Представяне',
    educationLabel: 'Образование',
    experienceLabel: 'Практика',
    photoAltPrefix: 'Снимка',
    workingLanguagesLabel: 'Работни езици',
    fullProfileLabel: 'Пълен профил (на английски)',
    keyFactsHeading: 'Адвокатка Wei Tseng (曾雋崴) — основни данни',
    qualificationLabel: 'Правоспособност и кантора',
    qualificationSentence:
      '{name} е оправомощена да упражнява адвокатска дейност в Тайван и е ръководна адвокатка на {firm}.',
    practiceLabel: 'Основни направления',
    consultationLanguagesLabel: 'Езици за консултация',
    roles: {
      'tseng-junwei': 'Ръководна адвокатка в Тайван',
      'chang-rongxuan': 'Адвокат в Тайван',
      'chang-fangyu': 'Правен сътрудник',
      'son-jungmin': 'Ръководител на дейността за Корея',
      'huang-shengping': 'Партньор, дипломиран експерт-счетоводител',
    },
  },
  hr: {
    label: 'NAŠ TIM',
    title: 'Međunarodni tim Hovering',
    description:
      'Profili odvjetnica i odvjetnika, operativnog vodstva te pridruženog računovodstva i revizije Hovering.',
    representativeTitle: 'Vodeća odvjetnica',
    teamTitle: 'Odvjetnici i suradnici',
    partnerTitle: 'Pridruženo računovodstvo',
    introLabel: 'Predstavljanje',
    educationLabel: 'Obrazovanje',
    experienceLabel: 'Iskustvo',
    photoAltPrefix: 'Fotografija',
    workingLanguagesLabel: 'Radni jezici',
    fullProfileLabel: 'Cjeloviti profil (na engleskom)',
    keyFactsHeading: 'Odvjetnica Wei Tseng — Osnovni podaci',
    qualificationLabel: 'Ovlaštenje i ured',
    qualificationSentence:
      '{name} ovlaštena je obavljati odvjetništvo na Tajvanu i vodeća je odvjetnica {firm}.',
    practiceLabel: 'Glavna područja',
    consultationLanguagesLabel: 'Jezici savjetovanja',
    roles: {
      'tseng-junwei': 'Vodeća odvjetnica na Tajvanu',
      'chang-rongxuan': 'Odvjetnik na Tajvanu',
      'chang-fangyu': 'Pravni asistent',
      'son-jungmin': 'Operativno vodstvo za Koreju',
      'huang-shengping': 'Partner, ovlašteni revizor',
    },
  },
  sr: {
    label: 'TIM',
    title: 'Međunarodni tim Hovering',
    description:
      'Profili advokatkinja i advokata, operativnog rukovodstva i pridruženog računovodstva i revizije Hovering.',
    representativeTitle: 'Rukovodeća advokatkinja',
    teamTitle: 'Advokati i saradnici',
    partnerTitle: 'Pridruženo računovodstvo',
    introLabel: 'Predstavljanje',
    educationLabel: 'Obrazovanje',
    experienceLabel: 'Iskustvo',
    photoAltPrefix: 'Fotografija',
    workingLanguagesLabel: 'Radni jezici',
    fullProfileLabel: 'Pun profil (na engleskom)',
    keyFactsHeading: 'Advokatkinja Wei Tseng — Osnovni podaci',
    qualificationLabel: 'Ovlašćenje i kancelarija',
    qualificationSentence:
      '{name} je ovlašćena da obavlja advokatsku delatnost na Tajvanu i rukovodeća je advokatkinja kancelarije {firm}.',
    practiceLabel: 'Glavne oblasti',
    consultationLanguagesLabel: 'Jezici konsultacije',
    roles: {
      'tseng-junwei': 'Rukovodeća advokatkinja na Tajvanu',
      'chang-rongxuan': 'Advokat na Tajvanu',
      'chang-fangyu': 'Pravni asistent',
      'son-jungmin': 'Rukovodilac poslovanja za Koreju',
      'huang-shengping': 'Partner, ovlašćeni računovođa',
    },
  },
  sl: {
    label: 'EKIPA',
    title: 'Mednarodna ekipa Hovering',
    description:
      'Profili odvetnic in odvetnikov, osebja za poslovanje in pridruženega računovodstva Hovering.',
    representativeTitle: 'Vodilna odvetnica',
    teamTitle: 'Odvetniki in sodelavci',
    partnerTitle: 'Pridruženo računovodstvo',
    introLabel: 'Predstavitev',
    educationLabel: 'Izobrazba',
    experienceLabel: 'Delovne izkušnje',
    photoAltPrefix: 'Fotografija',
    workingLanguagesLabel: 'Delovni jeziki',
    fullProfileLabel: 'Celoten profil (v angleščini)',
    keyFactsHeading: 'Odvetnica Wei Tseng — Osnovni podatki',
    qualificationLabel: 'Pooblastilo in pisarna',
    qualificationSentence:
      '{name} je pooblaščena za opravljanje odvetništva na Tajvanu in je vodilna odvetnica pri {firm}.',
    practiceLabel: 'Glavna področja',
    consultationLanguagesLabel: 'Jeziki posveta',
    roles: {
      'tseng-junwei': 'Vodilna odvetnica na Tajvanu',
      'chang-rongxuan': 'Odvetnik na Tajvanu',
      'chang-fangyu': 'Pravna asistentka',
      'son-jungmin': 'Vodja poslovanja za Korejo',
      'huang-shengping': 'Družbenik, pooblaščeni računovodja',
    },
  },
  lt: {
    label: 'KOMANDA',
    title: 'Tarptautinė Hovering komanda',
    description:
      'Hovering advokačių ir advokatų, Korėjos operacijų vadovo ir susijusios apskaitos bei audito profiliai.',
    representativeTitle: 'Vadovaujančioji advokatė',
    teamTitle: 'Advokatai ir bendradarbiai',
    partnerTitle: 'Susijusi apskaita',
    introLabel: 'Pristatymas',
    educationLabel: 'Išsilavinimas',
    experienceLabel: 'Patirtis',
    photoAltPrefix: 'Nuotrauka',
    workingLanguagesLabel: 'Darbo kalbos',
    fullProfileLabel: 'Visas profilis (anglų kalba)',
    keyFactsHeading: 'Advokatė Wei Tseng — pagrindiniai duomenys',
    qualificationLabel: 'Kvalifikacija ir kontora',
    qualificationSentence:
      '{name} turi teisę verstis advokatės praktika Taivane ir yra vadovaujančioji advokatė kontoroje {firm}.',
    practiceLabel: 'Pagrindinės sritys',
    consultationLanguagesLabel: 'Konsultacijos kalbos',
    roles: {
      'tseng-junwei': 'Vadovaujančioji advokatė Taivane',
      'chang-rongxuan': 'Advokatas Taivane',
      'chang-fangyu': 'Teisininko padėjėjas',
      'son-jungmin': 'Korėjos operacijų vadovas',
      'huang-shengping': 'Partneris, atestuotas buhalteris',
    },
  },
  lv: {
    label: 'KOMANDA',
    title: 'Hovering starptautiskā komanda',
    description:
      'Hovering advokātu un līdzstrādnieku, kā arī revīzijas partnera profili.',
    representativeTitle: 'Vadošā advokāte',
    teamTitle: 'Advokāti un līdzstrādnieki',
    partnerTitle: 'Revīzijas partneris',
    introLabel: 'Iepazīstināšana',
    educationLabel: 'Izglītība',
    experienceLabel: 'Prakse',
    photoAltPrefix: 'Fotogrāfija',
    workingLanguagesLabel: 'Darba valodas',
    fullProfileLabel: 'Pilns profils (angļu valodā)',
    keyFactsHeading: 'Advokāte Wei Tseng — pamatfakti',
    qualificationLabel: 'Kvalifikācija un birojs',
    qualificationSentence:
      '{name} ir tiesīga praktizēt advokatūru Taivānā un ir {firm} vadošā advokāte.',
    practiceLabel: 'Galvenās jomas',
    consultationLanguagesLabel: 'Konsultācijas valodas',
    roles: {
      'tseng-junwei': 'Vadošā advokāte Taivānā',
      'chang-rongxuan': 'Advokāts Taivānā',
      'chang-fangyu': 'Jurista palīdze',
      'son-jungmin': 'Korejas darba virziena vadītājs',
      'huang-shengping': 'Partneris, zvērināts revidents',
    },
  },
  et: {
    label: 'MEESKOND',
    title: 'Hoveringi rahvusvaheline meeskond',
    description:
      'Hoveringi advokaatide, Korea tegevuse juhi ja seotud audiitorbüroo profiilid.',
    representativeTitle: 'Juhtiv advokaat',
    teamTitle: 'Advokaadid ja töötajad',
    partnerTitle: 'Seotud audiitorbüroo',
    introLabel: 'Tutvustus',
    educationLabel: 'Haridus',
    experienceLabel: 'Kogemus',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Töökeeled',
    fullProfileLabel: 'Täielik profiil (inglise keeles)',
    keyFactsHeading: 'Advokaat Wei Tseng — Põhiandmed',
    qualificationLabel: 'Kvalifikatsioon ja büroo',
    qualificationSentence:
      '{name} on Taiwani advokatuuri liige ja {firm} juhtiv advokaat.',
    practiceLabel: 'Põhivaldkonnad',
    consultationLanguagesLabel: 'Nõustamiskeeled',
    roles: {
      'tseng-junwei': 'Juhtiv advokaat Taiwanis',
      'chang-rongxuan': 'Advokaat Taiwanis',
      'chang-fangyu': 'Jurist-assistent',
      'son-jungmin': 'Korea tegevuse juht',
      'huang-shengping': 'Partner ja audiitor',
    },
  },
  ca: {
    label: 'EL NOSTRE EQUIP',
    title: 'Equip internacional de Hovering',
    description:
      'Perfils dels advocats, de la direcció d’operacions i del soci auditor de Hovering.',
    representativeTitle: 'Advocada directora',
    teamTitle: 'Advocats i personal',
    partnerTitle: 'Soci auditor',
    introLabel: 'Presentació',
    educationLabel: 'Formació',
    experienceLabel: 'Experiència',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Idiomes de treball',
    fullProfileLabel: 'Perfil complet (en anglès)',
    keyFactsHeading: 'Advocada Wei Tseng — Dades essencials',
    qualificationLabel: 'Qualificació i despatx',
    qualificationSentence:
      '{name} és advocada habilitada per exercir a Taiwan i l’advocada directora de {firm}.',
    practiceLabel: 'Àrees principals',
    consultationLanguagesLabel: 'Idiomes de consulta',
    roles: {
      'tseng-junwei': 'Advocada directora a Taiwan',
      'chang-rongxuan': 'Advocat a Taiwan',
      'chang-fangyu': 'Ajudant jurídic',
      'son-jungmin': 'Responsable d’operacions de Corea',
      'huang-shengping': 'Soci auditor',
    },
  },
  is: {
    label: 'TEYMIÐ',
    title: 'Alþjóðlegt teymi Hovering',
    description:
      'Prófílar lögmanna Hovering, rekstrarstjórnarinnar og tengds endurskoðunarfyrirtækis.',
    representativeTitle: 'Yfirlögmaður',
    teamTitle: 'Lögmenn og starfsfólk',
    partnerTitle: 'Tengt endurskoðunarfyrirtæki',
    introLabel: 'Kynning',
    educationLabel: 'Menntun',
    experienceLabel: 'Starfsreynsla',
    photoAltPrefix: 'Ljósmynd',
    workingLanguagesLabel: 'Vinnutungumál',
    fullProfileLabel: 'Heildarprófíll (á ensku)',
    keyFactsHeading: 'Lögmaðurinn Wei Tseng — Lykilstaðreyndir',
    qualificationLabel: 'Réttindi og skrifstofa',
    qualificationSentence:
      '{name} hefur lögmannsréttindi á Taívan og er yfirlögmaður hjá {firm}.',
    practiceLabel: 'Aðalsvið',
    consultationLanguagesLabel: 'Tungumál ráðgjafar',
    roles: {
      'tseng-junwei': 'Yfirlögmaður á Taívan',
      'chang-rongxuan': 'Lögmaður á Taívan',
      'chang-fangyu': 'Lögfræðiaðstoðarmaður',
      'son-jungmin': 'Rekstrarstjóri Kóreureksturs',
      'huang-shengping': 'Meðeigandi löggiltur endurskoðandi',
    },
  },
};

/**
 * Localized names for the languages the canonical record lists for a member.
 *
 * Keyed by the exact English value in `attorney-profiles.en.languages`, so the
 * unit test can assert the key set equals that record: adding a language to
 * the canonical profile fails the build until it is named in all four
 * guidance languages, and a language that is not in the canonical record
 * cannot be rendered at all.
 */
export const guidanceLanguageNames: Record<GuidanceLocale, Record<string, string>> = {
  vi: { Korean: 'tiếng Hàn', Chinese: 'tiếng Trung', Japanese: 'tiếng Nhật' },
  id: { Korean: 'bahasa Korea', Chinese: 'bahasa Mandarin', Japanese: 'bahasa Jepang' },
  th: { Korean: 'ภาษาเกาหลี', Chinese: 'ภาษาจีน', Japanese: 'ภาษาญี่ปุ่น' },
  fil: { Korean: 'Koreano', Chinese: 'Tsino', Japanese: 'Hapon' },
  ar: { Korean: 'الكورية', Chinese: 'الصينية', Japanese: 'اليابانية' },
  de: { Korean: 'Koreanisch', Chinese: 'Chinesisch', Japanese: 'Japanisch' },
  es: { Korean: 'coreano', Chinese: 'chino', Japanese: 'japonés' },
  fr: { Korean: 'coréen', Chinese: 'chinois', Japanese: 'japonais' },
  pt: { Korean: 'coreano', Chinese: 'chinês', Japanese: 'japonês' },
  'zh-hans': { Korean: '韩语', Chinese: '中文', Japanese: '日语' },
  ms: { Korean: 'bahasa Korea', Chinese: 'bahasa Cina', Japanese: 'bahasa Jepun' },
  ru: { Korean: 'корейский', Chinese: 'китайский', Japanese: 'японский' },
  tr: { Korean: 'Korece', Chinese: 'Çince', Japanese: 'Japonca' },
  it: { Korean: 'coreano', Chinese: 'cinese', Japanese: 'giapponese' },
  nl: { Korean: 'Koreaans', Chinese: 'Chinees', Japanese: 'Japans' },
  pl: { Korean: 'koreański', Chinese: 'chiński', Japanese: 'japoński' },
  hi: { Korean: 'कोरियाई', Chinese: 'चीनी', Japanese: 'जापानी' },
  sv: { Korean: 'koreanska', Chinese: 'kinesiska', Japanese: 'japanska' },
  da: { Korean: 'koreansk', Chinese: 'kinesisk', Japanese: 'japansk' },
  nb: { Korean: 'koreansk', Chinese: 'kinesisk', Japanese: 'japansk' },
  fi: { Korean: 'korea', Chinese: 'kiina', Japanese: 'japani' },
  cs: { Korean: 'korejština', Chinese: 'čínština', Japanese: 'japonština' },
  hu: { Korean: 'koreai', Chinese: 'kínai', Japanese: 'japán' },
  ro: { Korean: 'coreeană', Chinese: 'chineză', Japanese: 'japoneză' },
  uk: { Korean: 'корейська', Chinese: 'китайська', Japanese: 'японська' },
  el: { Korean: 'κορεατικά', Chinese: 'κινεζικά', Japanese: 'ιαπωνικά' },
  he: { Korean: 'קוריאנית', Chinese: 'סינית', Japanese: 'יפנית' },
  bn: { Korean: 'কোরীয়', Chinese: 'চীনা', Japanese: 'জাপানি' },
  ur: { Korean: 'کوریائی', Chinese: 'چینی', Japanese: 'جاپانی' },
  fa: { Korean: 'کره‌ای', Chinese: 'چینی', Japanese: 'ژاپنی' },
  my: { Korean: 'ကိုရီးယား', Chinese: 'တရုတ်', Japanese: 'ဂျပန်' },
  ta: { Korean: 'கொரிய மொழி', Chinese: 'சீனம்', Japanese: 'ஜப்பானியம்' },
  ne: { Korean: 'कोरियाली', Chinese: 'चिनियाँ', Japanese: 'जापानी' },
  km: { Korean: 'ភាសាកូរ៉េ', Chinese: 'ភាសាចិន', Japanese: 'ភាសាជប៉ុន' },
  mn: { Korean: 'солонгос', Chinese: 'хятад', Japanese: 'япон' },
  sk: { Korean: 'kórejčina', Chinese: 'čínština', Japanese: 'japončina' },
  bg: { Korean: 'корейски', Chinese: 'китайски', Japanese: 'японски' },
  hr: { Korean: 'korejski', Chinese: 'kineski', Japanese: 'japanski' },
  sr: { Korean: 'korejski', Chinese: 'kineski', Japanese: 'japanski' },
  sl: { Korean: 'korejščina', Chinese: 'kitajščina', Japanese: 'japonščina' },
  lt: { Korean: 'korėjiečių', Chinese: 'kinų', Japanese: 'japonų' },
  lv: { Korean: 'korejiešu', Chinese: 'ķīniešu', Japanese: 'japāņu' },
  et: { Korean: 'korea', Chinese: 'hiina', Japanese: 'jaapani' },
  ca: { Korean: 'coreà', Chinese: 'xinès', Japanese: 'japonès' },
  is: { Korean: 'kóreska', Chinese: 'kínverska', Japanese: 'japanska' },
};

/**
 * Localized names for the canonical practice areas (WO-O34, task 1).
 *
 * `/en/lawyers` publishes `attorney-profiles.en.practiceAreas` under "CORE
 * PRACTICE AREAS", and ko/zh-hant/ja each publish the same six areas in the
 * same order. WO-O33 built the guidance key-facts block out of the services
 * page's own section headings instead, which is a different taxonomy: it
 * drops "Visa and residency" and splits family and labour into two rows. The
 * key-facts block now uses this table, so the six areas are the same
 * classification in every language.
 *
 * Keyed by the exact English value in `attorney-profiles.en.practiceAreas`,
 * for the same reason `guidanceLanguageNames` is: the unit test asserts the
 * key set equals that record, so an area added to or renamed in the canonical
 * profile fails the build until it is named in all four guidance languages,
 * and an area that is not canonical cannot be rendered at all. Each value is
 * a translation of the canonical area — no new classification is invented,
 * and the services page keeps its own section headings unchanged.
 */
export const guidancePracticeAreaNames: Record<GuidanceLocale, Record<string, string>> = {
  vi: {
    'Taiwan company setup': 'Thành lập công ty tại Đài Loan',
    'Taiwan investment counsel': 'Tư vấn pháp lý đầu tư vào Đài Loan',
    'Civil litigation and damages': 'Tố tụng dân sự và bồi thường thiệt hại',
    'Trademark and patent filings': 'Đăng ký nhãn hiệu và sáng chế',
    'Visa and residency': 'Thị thực và cư trú',
    'Family and labor disputes': 'Tranh chấp gia đình và lao động',
  },
  id: {
    'Taiwan company setup': 'Pendirian perusahaan di Taiwan',
    'Taiwan investment counsel': 'Konsultasi hukum investasi di Taiwan',
    'Civil litigation and damages': 'Litigasi perdata dan ganti rugi',
    'Trademark and patent filings': 'Pendaftaran merek dan paten',
    'Visa and residency': 'Visa dan izin tinggal',
    'Family and labor disputes': 'Sengketa keluarga dan ketenagakerjaan',
  },
  th: {
    'Taiwan company setup': 'การจัดตั้งบริษัทในไต้หวัน',
    'Taiwan investment counsel': 'ที่ปรึกษากฎหมายด้านการลงทุนในไต้หวัน',
    'Civil litigation and damages': 'คดีแพ่งและค่าสินไหมทดแทน',
    'Trademark and patent filings': 'การยื่นจดทะเบียนเครื่องหมายการค้าและสิทธิบัตร',
    'Visa and residency': 'วีซ่าและการพำนัก',
    'Family and labor disputes': 'ข้อพิพาทครอบครัวและแรงงาน',
  },
  fil: {
    'Taiwan company setup': 'Pagtatatag ng kompanya sa Taiwan',
    'Taiwan investment counsel': 'Payong legal sa pamumuhunan sa Taiwan',
    'Civil litigation and damages': 'Sibil na paglilitis at danyos',
    'Trademark and patent filings': 'Paghahain ng trademark at patente',
    'Visa and residency': 'Visa at paninirahan',
    'Family and labor disputes': 'Alitan sa pamilya at paggawa',
  },
  ar: {
    'Taiwan company setup': 'تأسيس الشركات في تايوان',
    'Taiwan investment counsel': 'الاستشارات القانونية للاستثمار في تايوان',
    'Civil litigation and damages': 'التقاضي المدني ودعاوى التعويض',
    'Trademark and patent filings': 'تسجيل العلامات التجارية وبراءات الاختراع',
    'Visa and residency': 'التأشيرات والإقامة',
    'Family and labor disputes': 'منازعات الأسرة والعمل',
  },
  de: {
    'Taiwan company setup': 'Gesellschaftsgründung in Taiwan',
    'Taiwan investment counsel': 'Rechtsberatung zu Investitionen in Taiwan',
    'Civil litigation and damages': 'Zivilsachen und Schadensersatz',
    'Trademark and patent filings': 'Marken- und Patentanmeldungen',
    'Visa and residency': 'Visum und Aufenthalt',
    'Family and labor disputes': 'Familien- und Arbeitsstreitigkeiten',
  },
  es: {
    'Taiwan company setup': 'Constitución de sociedades en Taiwán',
    'Taiwan investment counsel': 'Asesoramiento jurídico para invertir en Taiwán',
    'Civil litigation and damages': 'Litigios civiles y daños',
    'Trademark and patent filings': 'Solicitudes de marcas y patentes',
    'Visa and residency': 'Visado y residencia',
    'Family and labor disputes': 'Conflictos familiares y laborales',
  },
  fr: {
    'Taiwan company setup': 'Constitution de sociétés à Taïwan',
    'Taiwan investment counsel': 'Conseil juridique pour investir à Taïwan',
    'Civil litigation and damages': 'Affaires civiles et dommages-intérêts',
    'Trademark and patent filings': 'Dépôts de marques et de brevets',
    'Visa and residency': 'Visa et séjour',
    'Family and labor disputes': 'Litiges familiaux et du travail',
  },
  pt: {
    'Taiwan company setup': 'Constituição de sociedades em Taiwan',
    'Taiwan investment counsel': 'Aconselhamento jurídico para investir em Taiwan',
    'Civil litigation and damages': 'Litígios civis e indemnizações',
    'Trademark and patent filings': 'Pedidos de registo de marcas e patentes',
    'Visa and residency': 'Visto e residência',
    'Family and labor disputes': 'Conflitos familiares e laborais',
  },
  'zh-hans': {
    'Taiwan company setup': '在台湾设立公司',
    'Taiwan investment counsel': '台湾投资法律咨询',
    'Civil litigation and damages': '民事诉讼与损害赔偿',
    'Trademark and patent filings': '商标与专利申请',
    'Visa and residency': '签证与居留',
    'Family and labor disputes': '家事与劳动争议',
  },
  ms: {
    'Taiwan company setup': 'Penubuhan syarikat di Taiwan',
    'Taiwan investment counsel': 'Nasihat undang-undang pelaburan di Taiwan',
    'Civil litigation and damages': 'Litigasi sivil dan ganti rugi',
    'Trademark and patent filings': 'Pemfailan tanda dagangan dan paten',
    'Visa and residency': 'Visa dan permit tinggal',
    'Family and labor disputes': 'Pertikaian keluarga dan buruh',
  },
  ru: {
    'Taiwan company setup': 'Учреждение компании на Тайване',
    'Taiwan investment counsel': 'Правовая консультация по инвестициям на Тайване',
    'Civil litigation and damages': 'Гражданские дела и возмещение вреда',
    'Trademark and patent filings': 'Подача заявок на товарные знаки и патенты',
    'Visa and residency': 'Виза и пребывание',
    'Family and labor disputes': 'Семейные и трудовые споры',
  },
  tr: {
    'Taiwan company setup': 'Tayvan’da şirket kuruluşu',
    'Taiwan investment counsel': 'Tayvan yatırımı için hukuki danışmanlık',
    'Civil litigation and damages': 'Hukuk davaları ve tazminat',
    'Trademark and patent filings': 'Marka ve patent başvuruları',
    'Visa and residency': 'Vize ve oturma',
    'Family and labor disputes': 'Aile ve iş uyuşmazlıkları',
  },
  it: {
    'Taiwan company setup': 'Costituzione di società a Taiwan',
    'Taiwan investment counsel': 'Consulenza giuridica per investire a Taiwan',
    'Civil litigation and damages': 'Controversie civili e risarcimento',
    'Trademark and patent filings': 'Depositi di marchi e brevetti',
    'Visa and residency': 'Visto e soggiorno',
    'Family and labor disputes': 'Controversie familiari e di lavoro',
  },
  nl: {
    'Taiwan company setup': 'Oprichting van een vennootschap in Taiwan',
    'Taiwan investment counsel': 'Juridisch advies voor investeren in Taiwan',
    'Civil litigation and damages': 'Civiele zaken en schadevergoeding',
    'Trademark and patent filings': 'Merken- en octrooiaanvragen',
    'Visa and residency': 'Visum en verblijf',
    'Family and labor disputes': 'Familie- en arbeidsgeschillen',
  },
  pl: {
    'Taiwan company setup': 'Zakładanie spółki na Tajwanie',
    'Taiwan investment counsel': 'Doradztwo prawne przy inwestycjach na Tajwanie',
    'Civil litigation and damages': 'Sprawy cywilne i odszkodowania',
    'Trademark and patent filings': 'Zgłoszenia znaków towarowych i patentów',
    'Visa and residency': 'Wiza i pobyt',
    'Family and labor disputes': 'Spory rodzinne i ze stosunku pracy',
  },
  hi: {
    'Taiwan company setup': 'ताइवान में कंपनी स्थापना',
    'Taiwan investment counsel': 'ताइवान निवेश के लिए कानूनी सलाह',
    'Civil litigation and damages': 'दीवानी मुकदमे और हर्जाना',
    'Trademark and patent filings': 'व्यापार चिह्न और पेटेंट आवेदन',
    'Visa and residency': 'वीज़ा और निवास',
    'Family and labor disputes': 'परिवार और श्रम विवाद',
  },
  sv: {
    'Taiwan company setup': 'Bolagsbildning i Taiwan',
    'Taiwan investment counsel': 'Juridisk rådgivning för investering i Taiwan',
    'Civil litigation and damages': 'Civilmål och skadestånd',
    'Trademark and patent filings': 'Varumärkes- och patentansökningar',
    'Visa and residency': 'Visum och uppehållstillstånd',
    'Family and labor disputes': 'Familje- och arbetstvister',
  },
  da: {
    'Taiwan company setup': 'Selskabsstiftelse i Taiwan',
    'Taiwan investment counsel': 'Juridisk rådgivning om investering i Taiwan',
    'Civil litigation and damages': 'Civile sager og erstatning',
    'Trademark and patent filings': 'Varemærke- og patentansøgninger',
    'Visa and residency': 'Visum og ophold',
    'Family and labor disputes': 'Familie- og arbejdssager',
  },
  nb: {
    'Taiwan company setup': 'Selskapsstiftelse i Taiwan',
    'Taiwan investment counsel': 'Juridisk rådgivning om investering i Taiwan',
    'Civil litigation and damages': 'Sivile saker og erstatning',
    'Trademark and patent filings': 'Varemerke- og patentsøknader',
    'Visa and residency': 'Visum og opphold',
    'Family and labor disputes': 'Familie- og arbeidssaker',
  },
  fi: {
    'Taiwan company setup': 'Yhtiön perustaminen Taiwanissa',
    'Taiwan investment counsel': 'Oikeudellinen neuvonta Taiwanin investoinneissa',
    'Civil litigation and damages': 'Siviiliasiat ja vahingonkorvaus',
    'Trademark and patent filings': 'Tavaramerkki- ja patenttihakemukset',
    'Visa and residency': 'Viisumi ja oleskelu',
    'Family and labor disputes': 'Perhe- ja työriidat',
  },
  cs: {
    'Taiwan company setup': 'Zakládání společností na Tchaj-wanu',
    'Taiwan investment counsel': 'Poradenství k investicím na Tchaj-wanu',
    'Civil litigation and damages': 'Občanskoprávní spory a náhrada škody',
    'Trademark and patent filings': 'Přihlášky ochranných známek a patentů',
    'Visa and residency': 'Vízum a pobyt',
    'Family and labor disputes': 'Rodinné a pracovněprávní spory',
  },
  hu: {
    'Taiwan company setup': 'Cégalapítás Tajvanon',
    'Taiwan investment counsel': 'Tajvani befektetési tanácsadás',
    'Civil litigation and damages': 'Polgári perek és kártérítés',
    'Trademark and patent filings': 'Védjegy- és szabadalmi bejelentések',
    'Visa and residency': 'Vízum és tartózkodás',
    'Family and labor disputes': 'Családi és munkaügyi jogviták',
  },
  ro: {
    'Taiwan company setup': 'Înființare de societăți în Taiwan',
    'Taiwan investment counsel': 'Consultanță pentru investiții în Taiwan',
    'Civil litigation and damages': 'Litigii civile și despăgubiri',
    'Trademark and patent filings': 'Depuneri de mărci și brevete',
    'Visa and residency': 'Viză și ședere',
    'Family and labor disputes': 'Litigii de familie și de muncă',
  },
  uk: {
    'Taiwan company setup': 'Створення товариств на Тайвані',
    'Taiwan investment counsel': 'Консультування щодо інвестицій на Тайвані',
    'Civil litigation and damages': 'Цивільні спори та відшкодування шкоди',
    'Trademark and patent filings': 'Заявки на торговельні марки та патенти',
    'Visa and residency': 'Віза та проживання',
    'Family and labor disputes': 'Сімейні та трудові спори',
  },
  el: {
    'Taiwan company setup': 'Σύσταση εταιρειών στην Ταϊβάν',
    'Taiwan investment counsel': 'Συμβουλευτική επενδύσεων στην Ταϊβάν',
    'Civil litigation and damages': 'Αστικές δίκες και αποζημίωση',
    'Trademark and patent filings': 'Καταθέσεις σημάτων και διπλωμάτων ευρεσιτεχνίας',
    'Visa and residency': 'Θεώρηση εισόδου και διαμονή',
    'Family and labor disputes': 'Οικογενειακές και εργατικές διαφορές',
  },
  he: {
    'Taiwan company setup': 'הקמת חברות בטאיוואן',
    'Taiwan investment counsel': 'ייעוץ להשקעות בטאיוואן',
    'Civil litigation and damages': 'תביעות אזרחיות ופיצויים',
    'Trademark and patent filings': 'רישום סימני מסחר ופטנטים',
    'Visa and residency': 'אשרה ושהייה',
    'Family and labor disputes': 'סכסוכי משפחה ועבודה',
  },
  bn: {
    'Taiwan company setup': 'তাইওয়ানে কোম্পানি গঠন',
    'Taiwan investment counsel': 'তাইওয়ান বিনিয়োগের আইনি পরামর্শ',
    'Civil litigation and damages': 'দেওয়ানি মামলা ও ক্ষতিপূরণ',
    'Trademark and patent filings': 'ট্রেডমার্ক ও পেটেন্ট আবেদন',
    'Visa and residency': 'ভিসা ও আবাস',
    'Family and labor disputes': 'পরিবার ও শ্রম বিরোধ',
  },
  ur: {
    'Taiwan company setup': 'تائیوان میں کمپنی کا قیام',
    'Taiwan investment counsel': 'تائیوان میں سرمایہ کاری کی قانونی صلاح',
    'Civil litigation and damages': 'دیوانی مقدمے اور تلافی',
    'Trademark and patent filings': 'تجارتی علامت اور پیٹنٹ کی درخواستیں',
    'Visa and residency': 'ویزا اور رہائش',
    'Family and labor disputes': 'خاندان اور ملازمت کے تنازعات',
  },
  fa: {
    'Taiwan company setup': 'تأسیس شرکت در تایوان',
    'Taiwan investment counsel': 'مشاورهٔ سرمایه‌گذاری در تایوان',
    'Civil litigation and damages': 'دعاوی مدنی و خسارت',
    'Trademark and patent filings': 'ثبت علامت تجاری و اختراع',
    'Visa and residency': 'روادید و اقامت',
    'Family and labor disputes': 'اختلافات خانوادگی و کار',
  },
  my: {
    'Taiwan company setup': 'ထိုင်ဝမ်တွင် ကုမ္ပဏီတည်ထောင်ခြင်း',
    'Taiwan investment counsel': 'ထိုင်ဝမ် ရင်းနှီးမြှုပ်နှံမှု ဥပဒေအကြံပေးခြင်း',
    'Civil litigation and damages': 'တရားမမှုနှင့် လျော်ကြေး',
    'Trademark and patent filings': 'ကုန်အမှတ်တံဆိပ်နှင့် တီထွင်မှုမူပိုင်ခွင့် လျှောက်ထားခြင်း',
    'Visa and residency': 'ဗီဇာနှင့် နေထိုင်ခွင့်',
    'Family and labor disputes': 'မိသားစုနှင့် အလုပ်သမားအငြင်းပွားမှု',
  },
  ta: {
    'Taiwan company setup': 'தைவானில் நிறுவனம் அமைத்தல்',
    'Taiwan investment counsel': 'தைவான் முதலீட்டுச் சட்ட ஆலோசனை',
    'Civil litigation and damages': 'உரிமையியல் வழக்குகளும் இழப்பீடும்',
    'Trademark and patent filings': 'வணிகச் சின்னம் மற்றும் காப்புரிமை விண்ணப்பங்கள்',
    'Visa and residency': 'விசா மற்றும் தங்கல்',
    'Family and labor disputes': 'குடும்ப மற்றும் தொழிலாளர் தகராறுகள்',
  },
  ne: {
    'Taiwan company setup': 'ताइवानमा कम्पनी स्थापना',
    'Taiwan investment counsel': 'ताइवान लगानीसम्बन्धी कानुनी सल्लाह',
    'Civil litigation and damages': 'देवानी मुद्दा र क्षतिपूर्ति',
    'Trademark and patent filings': 'ट्रेडमार्क र पेटेन्ट आवेदन',
    'Visa and residency': 'भिसा र बसोबास',
    'Family and labor disputes': 'परिवार र श्रम विवाद',
  },
  km: {
    'Taiwan company setup': 'ការបង្កើតក្រុមហ៊ុននៅតៃវ៉ាន់',
    'Taiwan investment counsel': 'យោបល់វិនិយោគនៅតៃវ៉ាន់',
    'Civil litigation and damages': 'វិវាទរដ្ឋប្បវេណី និងសំណង',
    'Trademark and patent filings': 'ការដាក់សញ្ញាពាណិជ្ជ និងប៉ាតង់',
    'Visa and residency': 'ទិដ្ឋាការ និងការស្នាក់នៅ',
    'Family and labor disputes': 'វិវាទគ្រួសារ និងពលកម្ម',
  },
  mn: {
    'Taiwan company setup': 'Тайваньд компани байгуулах',
    'Taiwan investment counsel': 'Тайванийн хөрөнгө оруулалтын эрх зүйн зөвлөгөө',
    'Civil litigation and damages': 'Иргэний хэрэг ба хохирол нөхөн төлүүлэх',
    'Trademark and patent filings': 'Барааны тэмдэг, патентын бүртгэл',
    'Visa and residency': 'Виз ба оршин суух',
    'Family and labor disputes': 'Гэр бүлийн болон хөдөлмөрийн маргаан',
  },
  sk: {
    'Taiwan company setup': 'Zakladanie spoločností na Taiwane',
    'Taiwan investment counsel': 'Poradenstvo k investíciám na Taiwane',
    'Civil litigation and damages': 'Občianskoprávne spory a náhrada škody',
    'Trademark and patent filings': 'Prihlášky ochranných známok a patentov',
    'Visa and residency': 'Vízum a pobyt',
    'Family and labor disputes': 'Rodinné a pracovnoprávne spory',
  },
  bg: {
    'Taiwan company setup': 'Учредяване на дружество в Тайван',
    'Taiwan investment counsel': 'Правна консултация по инвестиции в Тайван',
    'Civil litigation and damages': 'Граждански дела и обезщетение за вреди',
    'Trademark and patent filings': 'Подаване на заявки за търговски марки и патенти',
    'Visa and residency': 'Виза и пребиваване',
    'Family and labor disputes': 'Семейни и трудови спорове',
  },
  hr: {
    'Taiwan company setup': 'Osnivanje društava na Tajvanu',
    'Taiwan investment counsel': 'Savjetovanje o ulaganjima na Tajvanu',
    'Civil litigation and damages': 'Građanskopravni sporovi i naknada štete',
    'Trademark and patent filings': 'Prijave žigova i patenata',
    'Visa and residency': 'Viza i boravak',
    'Family and labor disputes': 'Obiteljski i radnopravni sporovi',
  },
  sr: {
    'Taiwan company setup': 'Osnivanje društava na Tajvanu',
    'Taiwan investment counsel': 'Savetovanje o investicijama na Tajvanu',
    'Civil litigation and damages': 'Građanski sporovi i naknada štete',
    'Trademark and patent filings': 'Prijave žigova i patenata',
    'Visa and residency': 'Viza i boravak',
    'Family and labor disputes': 'Porodični i radnopravni sporovi',
  },
  sl: {
    'Taiwan company setup': 'Ustanavljanje družb na Tajvanu',
    'Taiwan investment counsel': 'Svetovanje o naložbah na Tajvanu',
    'Civil litigation and damages': 'Civilni spori in odškodnina',
    'Trademark and patent filings': 'Prijave znamk in patentov',
    'Visa and residency': 'Vizum in prebivanje',
    'Family and labor disputes': 'Družinski in delovnopravni spori',
  },
  lt: {
    'Taiwan company setup': 'Įmonių steigimas Taivane',
    'Taiwan investment counsel': 'Investicijų į Taivaną konsultacijos',
    'Civil litigation and damages': 'Civiliniai ginčai ir žalos atlyginimas',
    'Trademark and patent filings': 'Prekių ženklų ir patentų paraiškos',
    'Visa and residency': 'Vizos ir gyvenamoji vieta',
    'Family and labor disputes': 'Šeimos ir darbo ginčai',
  },
  lv: {
    'Taiwan company setup': 'Sabiedrību dibināšana Taivānā',
    'Taiwan investment counsel': 'Ieguldījumu konsultācijas Taivānā',
    'Civil litigation and damages': 'Civillietas un zaudējumu atlīdzība',
    'Trademark and patent filings': 'Preču zīmju un patentu pieteikumi',
    'Visa and residency': 'Vīza un uzturēšanās',
    'Family and labor disputes': 'Ģimenes un darba strīdi',
  },
  et: {
    'Taiwan company setup': 'Ettevõtte asutamine Taiwanis',
    'Taiwan investment counsel': 'Nõustamine Taiwani investeeringute asjus',
    'Civil litigation and damages': 'Tsiviilvaidlused ja kahjuhüvitis',
    'Trademark and patent filings': 'Kaubamärgi- ja patenditaotlused',
    'Visa and residency': 'Viisa ja elamisluba',
    'Family and labor disputes': 'Perekonna- ja töövaidlused',
  },
  ca: {
    'Taiwan company setup': 'Constitució de societats a Taiwan',
    'Taiwan investment counsel': 'Assessorament jurídic per invertir a Taiwan',
    'Civil litigation and damages': 'Litigis civils i danys',
    'Trademark and patent filings': 'Sol·licituds de marques i patents',
    'Visa and residency': 'Visat i residència',
    'Family and labor disputes': 'Conflictes familiars i laborals',
  },
  is: {
    'Taiwan company setup': 'Félagastofnun á Taívan',
    'Taiwan investment counsel': 'Lögfræðiráðgjöf um fjárfestingu á Taívan',
    'Civil litigation and damages': 'Einkamál og skaðabætur',
    'Trademark and patent filings': 'Vörumerkja- og einkaleyfisumsóknir',
    'Visa and residency': 'Vegabréfsáritun og dvöl',
    'Family and labor disputes': 'Fjölskyldu- og vinnuréttarmál',
  },
};

/** One member's biography, line for line with `teamContent.en`. */
export interface GuidanceTeamBio {
  intro: string[];
  education: string[];
  experience: string[];
}

/**
 * Terms that must survive translation byte-for-byte.
 *
 * Every entry is asserted to be a substring of `teamContent.en`, so this list
 * cannot drift away from the canonical record or introduce a name the firm
 * does not publish. Personal names are covered separately: the roster renders
 * `teamContent.en` names directly.
 */
export const GUIDANCE_BIO_PRESERVED_TERMS: readonly string[] = [
  'Institute of Finance, National Taiwan University',
  'National Chengchi University',
  'Kobe University',
  'Waseda University',
  'National Chung Hsing University',
  'Tunghai University',
  'National Cheng Kung University',
  'Trend Law Office',
  'Hovering International Law Firm',
  'Legal Aid Foundation, Taichung Branch',
  'Ministry of Education, Legal Affairs Division',
  'Boyin Law Firm',
  'Muyang International Law Firm',
  'Chinshin CPA Firm',
  'TWD 1.57M',
];

/**
 * Abbreviations the English canonical record uses that the translated line
 * writes out in full instead.
 *
 * The only entry is "NCCU". The canonical intro for the partner CPA says
 * "accounting B.A. and M.A. programs at NCCU" while the education lines
 * directly beneath it spell the same institution "National Chengchi
 * University" — so the expansion is the record's own wording, not a new fact,
 * and a reader who has never seen the abbreviation can follow the line. The
 * unit test asserts both halves appear in `teamContent.en`, so this cannot
 * become a back door for a name the firm does not publish.
 */
export const GUIDANCE_BIO_CODE_EXPANSIONS: Readonly<Record<string, string>> = {
  NCCU: 'National Chengchi University',
};

/**
 * Biographies for the five guidance languages, one entry per member id and one
 * line per canonical line.
 */
export const guidanceTeamBios: Record<
  GuidanceLocale,
  Record<GuidanceTeamMemberId, GuidanceTeamBio>
> = {
  vi: {
    'tseng-junwei': {
      intro: [
        'Văn phòng nhận các vụ việc doanh nghiệp và cá nhân tại Đài Loan, làm việc bằng tiếng Anh, tiếng Nhật, tiếng Hàn và tiếng Trung.',
        'Đã đại diện một sinh viên Hàn Quốc trong vụ việc bồi thường thương tích tại phòng tập và đạt được bản án sơ thẩm buộc bồi thường 1,57 triệu TWD (TWD 1.57M).',
      ],
      education: [
        'Thạc sĩ (M.S.), Viện Tài chính (Institute of Finance, National Taiwan University)',
        'Cử nhân (B.A.) song ngành Luật và Tài chính, National Chengchi University',
        'Sinh viên trao đổi, Kobe University và Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Quỹ Trợ giúp Pháp lý, chi nhánh Đài Trung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Từng công tác tại Vụ Pháp chế, Bộ Giáo dục, tập trung vào tranh chấp hành chính và dân sự.',
        'Có kinh nghiệm với các vụ việc về trường đại học, quyền của giảng viên và khiếu nại hành chính.',
      ],
      education: ['Cử nhân Luật (LL.B.), National Chung Hsing University'],
      experience: [
        'Vụ Pháp chế, Bộ Giáo dục (Ministry of Education, Legal Affairs Division)',
        'Luật sư, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Trợ lý pháp lý cao cấp, nhiều năm hỗ trợ tố tụng, pháp chế doanh nghiệp và các vụ việc đầu tư nước ngoài tại nhiều văn phòng luật.',
        'Hỗ trợ tố tụng, thành lập công ty, thủ tục chấp thuận đầu tư nước ngoài, xin giấy phép và việc trao đổi giữa Hàn Quốc và Đài Loan.',
      ],
      education: ['Cử nhân Luật (LL.B.), Tunghai University'],
      experience: [
        'Trợ lý pháp lý cao cấp, Boyin Law Firm',
        'Trợ lý pháp lý cao cấp, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Điều phối lịch tư vấn và việc liên lạc cho khách hàng Hàn Quốc.',
        'Hỗ trợ trao đổi giữa các bộ phận bằng hệ thống tài liệu và quy trình công việc, với nền tảng khoa học máy tính.',
      ],
      education: ['Cử nhân (B.S.) Khoa học máy tính, National Cheng Kung University'],
      experience: ['Bộ phận nghiệp vụ Hàn Quốc, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Đã hoàn thành chương trình cử nhân và thạc sĩ kế toán tại National Chengchi University và hiện điều hành một văn phòng kế toán.',
        'Hỗ trợ phân tích tổng hợp rủi ro pháp lý, thuế và tài chính cho khách hàng doanh nghiệp.',
      ],
      education: [
        'Thạc sĩ (M.A.) Kế toán, National Chengchi University',
        'Cử nhân (B.A.) Kế toán, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  id: {
    'tseng-junwei': {
      intro: [
        'Kantor menangani perkara korporasi dan perorangan di Taiwan dalam bahasa Inggris, bahasa Jepang, bahasa Korea, dan bahasa Mandarin.',
        'Mewakili seorang mahasiswa asal Korea dalam perkara cedera di pusat kebugaran dan memperoleh putusan ganti rugi tingkat pertama sebesar TWD 1.57M (1,57 juta dolar Taiwan baru).',
      ],
      education: [
        'Magister (M.S.), Institute of Finance, National Taiwan University',
        'Sarjana (B.A.) program ganda Hukum dan Keuangan, National Chengchi University',
        'Mahasiswa pertukaran, Kobe University dan Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Yayasan Bantuan Hukum, Cabang Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Sebelumnya bertugas di Kementerian Pendidikan, Bagian Urusan Hukum (Ministry of Education, Legal Affairs Division), dengan fokus pada sengketa administrasi dan perdata.',
        'Berpengalaman dalam perkara perguruan tinggi, hak dosen, dan keberatan administratif.',
      ],
      education: ['Sarjana Hukum (LL.B.), National Chung Hsing University'],
      experience: [
        'Kementerian Pendidikan, Bagian Urusan Hukum (Ministry of Education, Legal Affairs Division)',
        'Advokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal senior di beberapa kantor advokat, yang bertahun-tahun menangani dukungan litigasi, hukum korporasi, dan perkara penanaman modal asing.',
        'Mendukung litigasi, pendirian perusahaan, persetujuan penanaman modal asing, permohonan izin, serta komunikasi Korea-Taiwan.',
      ],
      education: ['Sarjana Hukum (LL.B.), Tunghai University'],
      experience: [
        'Paralegal senior, Boyin Law Firm',
        'Paralegal senior, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Mengoordinasikan penjadwalan konsultasi dan komunikasi untuk klien asal Korea.',
        'Mendukung komunikasi lintas tim melalui sistem dokumen dan alur kerja, berbekal latar belakang ilmu komputer.',
      ],
      education: ['Sarjana (B.S.) Ilmu Komputer, National Cheng Kung University'],
      experience: ['Tim Bisnis Korea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Menyelesaikan program sarjana dan magister akuntansi di National Chengchi University dan kini memimpin sebuah kantor akuntan.',
        'Mendukung analisis terpadu atas risiko hukum, pajak, dan keuangan bagi klien korporasi.',
      ],
      education: [
        'Magister (M.A.) Akuntansi, National Chengchi University',
        'Sarjana (B.A.) Akuntansi, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  th: {
    'tseng-junwei': {
      intro: [
        'สำนักงานรับดำเนินการเรื่องของบริษัทและบุคคลในไต้หวัน โดยใช้ภาษาอังกฤษ ภาษาญี่ปุ่น ภาษาเกาหลี และภาษาจีน',
        'เคยเป็นทนายความให้แก่นักศึกษาชาวเกาหลีในคดีเรียกค่าเสียหายจากการบาดเจ็บที่ฟิตเนส และศาลชั้นต้นพิพากษาให้นักศึกษาผู้นั้นได้รับค่าเสียหาย TWD 1.57M',
      ],
      education: [
        'ปริญญาโท (M.S.), Institute of Finance, National Taiwan University',
        'ปริญญาตรี (B.A.) สองสาขาวิชา ด้านกฎหมายและการเงิน, National Chengchi University',
        'นักศึกษาแลกเปลี่ยน, Kobe University และ Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'มูลนิธิช่วยเหลือทางกฎหมาย สาขาไถจง (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'เคยปฏิบัติงานที่กระทรวงศึกษาธิการ ฝ่ายนิติการ (Ministry of Education, Legal Affairs Division) โดยเน้นข้อพิพาททางปกครองและทางแพ่ง',
        'มีประสบการณ์ในเรื่องที่เกี่ยวกับมหาวิทยาลัย สิทธิของอาจารย์ และการร้องทุกข์ทางปกครอง',
      ],
      education: ['นิติศาสตรบัณฑิต (LL.B.), National Chung Hsing University'],
      experience: [
        'กระทรวงศึกษาธิการ ฝ่ายนิติการ (Ministry of Education, Legal Affairs Division)',
        'ทนายความ, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'ผู้ช่วยงานกฎหมายอาวุโสที่มีประสบการณ์ยาวนานจากสำนักงานกฎหมายหลายแห่ง ครอบคลุมงานสนับสนุนคดี งานกฎหมายบริษัท และเรื่องการลงทุนจากต่างประเทศ',
        'สนับสนุนงานคดี การจัดตั้งบริษัท การขออนุมัติการลงทุนจากต่างประเทศ การยื่นขอใบอนุญาต และการติดต่อสื่อสารระหว่างเกาหลีกับไต้หวัน',
      ],
      education: ['นิติศาสตรบัณฑิต (LL.B.), Tunghai University'],
      experience: [
        'ผู้ช่วยงานกฎหมายอาวุโส, Boyin Law Firm',
        'ผู้ช่วยงานกฎหมายอาวุโส, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'ประสานการนัดหมายให้คำปรึกษาและการติดต่อสื่อสารสำหรับลูกความชาวเกาหลี',
        'สนับสนุนการสื่อสารระหว่างทีมด้วยระบบเอกสารและระบบงาน โดยอาศัยพื้นฐานด้านวิทยาการคอมพิวเตอร์',
      ],
      education: ['วิทยาศาสตรบัณฑิต (B.S.) สาขาวิทยาการคอมพิวเตอร์, National Cheng Kung University'],
      experience: ['ทีมงานธุรกิจเกาหลี, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'สำเร็จการศึกษาระดับปริญญาตรีและปริญญาโทด้านการบัญชีจาก National Chengchi University และปัจจุบันบริหารสำนักงานบัญชีแห่งหนึ่ง',
        'สนับสนุนการวิเคราะห์ความเสี่ยงด้านกฎหมาย ภาษี และการเงินอย่างครบวงจรให้แก่ลูกความที่เป็นองค์กรธุรกิจ',
      ],
      education: [
        'ปริญญาโท (M.A.) การบัญชี, National Chengchi University',
        'ปริญญาตรี (B.A.) การบัญชี, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  fil: {
    'tseng-junwei': {
      intro: [
        'Tinatanggap ng tanggapan ang mga usaping pangkorporasyon at pang-indibidwal sa Taiwan, sa Ingles, Hapon, Koreano, at Tsino.',
        'Kinatawan niya ang isang mag-aaral mula sa Korea sa usapin ng pinsalang natamo sa gym, na nagbunga ng hatol sa unang hukuman para sa danyos na TWD 1.57M.',
      ],
      education: [
        'Masterado (M.S.), Institute of Finance, National Taiwan University',
        'Batsilyer (B.A.) na may dobleng major sa Batas at Pananalapi, National Chengchi University',
        'Palitang mag-aaral, Kobe University at Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch (Sangay ng Taichung)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Dating naglingkod sa Ministri ng Edukasyon, Dibisyon ng Usaping Legal (Ministry of Education, Legal Affairs Division), nakatuon sa mga alitang administratibo at sibil.',
        'May karanasan sa mga usaping may kinalaman sa unibersidad, karapatan ng guro, at reklamong administratibo.',
      ],
      education: ['Batsilyer sa Batas (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministri ng Edukasyon, Dibisyon ng Usaping Legal (Ministry of Education, Legal Affairs Division)',
        'Abogado, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Senior paralegal na may mahabang karanasan sa ilang tanggapan ng abogado, sa suporta sa paglilitis, sa gawaing legal na pangkorporasyon, at sa usapin ng dayuhang pamumuhunan.',
        'Sumusuporta sa paglilitis, pagtatatag ng kompanya, pag-apruba ng dayuhang pamumuhunan, aplikasyon ng permiso, at komunikasyong Korea-Taiwan.',
      ],
      education: ['Batsilyer sa Batas (LL.B.), Tunghai University'],
      experience: [
        'Senior na paralegal, Boyin Law Firm',
        'Senior na paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Inaayos ang iskedyul ng konsultasyon at ang pakikipag-ugnayan para sa mga kliyenteng Koreano.',
        'Sinusuportahan ang komunikasyon sa pagitan ng mga bahagi sa pamamagitan ng sistema ng dokumento at daloy ng trabaho, batay sa pinag-aralang agham pangkompyuter.',
      ],
      education: ['Batsilyer (B.S.) sa Agham Pangkompyuter, National Cheng Kung University'],
      experience: ['Bahaging pangnegosyo para sa Korea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Natapos ang mga programang batsilyer at masterado sa accounting sa National Chengchi University, at kasalukuyang namumuno sa isang tanggapan ng CPA.',
        'Sumusuporta sa pinagsanib na pagsusuri ng panganib na legal, pambuwis, at pampinansiya para sa mga kliyenteng korporasyon.',
      ],
      education: [
        'Masterado (M.A.) sa accounting, National Chengchi University',
        'Batsilyer (B.A.) sa accounting, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  ar: {
    'tseng-junwei': {
      intro: [
        'يتولّى المكتب قضايا الشركات والأفراد في تايوان، ويعمل بالإنجليزية واليابانية والكورية والصينية.',
        'مثَّلت طالبًا كوريًا في دعوى تعويض عن إصابة في صالة رياضية، وصدر حكم ابتدائي بالتعويض بمبلغ TWD 1.57M (1.57 مليون دولار تايواني جديد).',
      ],
      education: [
        'ماجستير (M.S.)، Institute of Finance, National Taiwan University',
        'بكالوريوس (B.A.) بتخصص مزدوج في القانون والتمويل، National Chengchi University',
        'طالبة تبادل في Kobe University و Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'مؤسسة المساعدة القانونية، فرع تايتشونغ (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'عمل سابقًا في وزارة التعليم، قسم الشؤون القانونية (Ministry of Education, Legal Affairs Division)، وركّز على المنازعات الإدارية والمدنية.',
        'لديه خبرة في القضايا المتعلقة بالجامعات وبحقوق أعضاء هيئة التدريس وبالتظلمات الإدارية.',
      ],
      education: ['بكالوريوس في القانون (LL.B.)، National Chung Hsing University'],
      experience: [
        'وزارة التعليم، قسم الشؤون القانونية (Ministry of Education, Legal Affairs Division)',
        'محامٍ، Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'خبرة تمتد سنوات طويلة في وظيفة مساعد قانوني أول في عدة مكاتب محاماة، تشمل دعم التقاضي والشؤون القانونية للشركات وقضايا الاستثمار الأجنبي.',
        'يشمل نطاق العمل دعم التقاضي وتأسيس الشركات وإجراءات الموافقة على الاستثمار الأجنبي وطلبات التراخيص والتواصل بين كوريا وتايوان.',
      ],
      education: ['بكالوريوس في القانون (LL.B.)، Tunghai University'],
      experience: [
        'مساعد قانوني أول، Boyin Law Firm',
        'مساعد قانوني أول، Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'ينسّق مواعيد الجلسات والتواصل للعملاء من كوريا.',
        'يدعم التواصل بين الفرق عبر أنظمة التوثيق وسير العمل، انطلاقًا من خلفية في علوم الحاسب.',
      ],
      education: ['بكالوريوس (B.S.) في علوم الحاسب، National Cheng Kung University'],
      experience: ['قسم الأعمال الكورية، Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'أنهى برنامجَي البكالوريوس والماجستير في المحاسبة في National Chengchi University، ويدير حاليًا مكتب محاسبة.',
        'يدعم التحليل المتكامل للمخاطر القانونية والضريبية والمالية للعملاء من الشركات.',
      ],
      education: [
        'ماجستير (M.A.) في المحاسبة، National Chengchi University',
        'بكالوريوس (B.A.) في المحاسبة، National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  de: {
    'tseng-junwei': {
      intro: [
        'Die Kanzlei bearbeitet Unternehmens- und Individualangelegenheiten in Taiwan auf Englisch, Japanisch, Koreanisch und Chinesisch.',
        'Sie vertrat einen koreanischen Studenten in einem Schadensersatzverfahren wegen einer Verletzung im Fitnessstudio und erwirkte ein erstinstanzliches Urteil über 1,57 Millionen TWD.',
      ],
      education: [
        'Masterabschluss (M.S.) am Institute of Finance der National Taiwan University',
        'Bachelorabschluss (B.A.) im Doppelstudium Recht und Finanzen, National Chengchi University',
        'Austauschstudierende an der Kobe University und der Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Stiftung für Prozesskostenhilfe, Zweigstelle Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Zuvor tätig im Bildungsministerium, Abteilung Rechtsangelegenheiten (Ministry of Education, Legal Affairs Division), mit Schwerpunkt auf Verwaltungs- und Zivilsachen.',
        'Erfahrung mit Angelegenheiten zu Hochschulen, Rechten von Lehrkräften und Verwaltungsbeschwerden.',
      ],
      education: ['Bachelor der Rechtswissenschaft (LL.B.), National Chung Hsing University'],
      experience: [
        'Bildungsministerium, Abteilung Rechtsangelegenheiten (Ministry of Education, Legal Affairs Division)',
        'Anwalt, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Juristische Fachkraft mit langjähriger Tätigkeit als leitende juristische Fachkraft in mehreren Kanzleien, zuständig für Prozessunterstützung, Unternehmensrecht und ausländische Investitionen.',
        'Unterstützung bei Verfahren, Gesellschaftsgründung, Genehmigungen ausländischer Investitionen, Lizenzanträgen und dem Austausch zwischen Korea und Taiwan.',
      ],
      education: ['Bachelor der Rechtswissenschaft (LL.B.), Tunghai University'],
      experience: [
        'Leitende juristische Fachkraft, Boyin Law Firm',
        'Leitende juristische Fachkraft, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordiniert Beratungstermine und die Kommunikation für Mandanten aus Korea.',
        'Unterstützt die Abstimmung zwischen den Bereichen mithilfe von Dokumenten- und Ablaufsystemen; der Hintergrund ist ein Informatikstudium.',
      ],
      education: ['Bachelorabschluss (B.S.) in Informatik, National Cheng Kung University'],
      experience: ['Leitung Korea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Hat an der National Chengchi University ein Bachelor- und ein Masterstudium im Rechnungswesen abgeschlossen und leitet derzeit eine Wirtschaftsprüfungskanzlei.',
        'Unterstützt die integrierte Analyse rechtlicher, steuerlicher und finanzieller Risiken für Unternehmenskunden.',
      ],
      education: [
        'Masterabschluss (M.A.) im Rechnungswesen, National Chengchi University',
        'Bachelorabschluss (B.A.) im Rechnungswesen, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  es: {
    'tseng-junwei': {
      intro: [
        'El despacho atiende asuntos de empresas y de particulares en Taiwán en inglés, japonés, coreano y chino.',
        'Representó a un estudiante coreano en una reclamación de daños por una lesión en un gimnasio y obtuvo una sentencia de primera instancia de TWD 1.57M (1,57 millones de dólares taiwaneses).',
      ],
      education: [
        'Máster (M.S.), Institute of Finance, National Taiwan University',
        'Grado (B.A.) con doble titulación en Derecho y Finanzas, National Chengchi University',
        'Estudiante de intercambio en Kobe University y Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Fundación de Asistencia Jurídica, sede de Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Trabajó antes en el Ministerio de Educación, División de Asuntos Jurídicos (Ministry of Education, Legal Affairs Division), centrado en conflictos administrativos y civiles.',
        'Tiene experiencia en asuntos de universidades, derechos del profesorado y reclamaciones administrativas.',
      ],
      education: ['Grado en Derecho (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministerio de Educación, División de Asuntos Jurídicos (Ministry of Education, Legal Affairs Division)',
        'Abogado, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Asistente jurídico sénior (Paralegal), con años de experiencia en varios despachos, a cargo del apoyo procesal, del derecho societario y de la inversión extranjera.',
        'Apoya litigios, constitución de sociedades, trámites de aprobación de inversión extranjera, solicitudes de licencia y el intercambio entre Corea y Taiwán.',
      ],
      education: ['Grado en Derecho (LL.B.), Tunghai University'],
      experience: [
        'Asistente jurídico sénior (Paralegal), Boyin Law Firm',
        'Asistente jurídico sénior (Paralegal), Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Coordina las citas de consulta y la comunicación para clientes de Corea.',
        'Apoya el intercambio entre equipos mediante sistemas de documentación y flujos de trabajo, con formación en informática.',
      ],
      education: ['Grado (B.S.) en Informática, National Cheng Kung University'],
      experience: ['Área de operaciones de Corea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Cursó el grado y el máster en Contabilidad en la National Chengchi University y dirige actualmente un despacho de contabilidad.',
        'Apoya el análisis integrado de riesgos jurídicos, fiscales y financieros para clientes empresariales.',
      ],
      education: [
        'Máster (M.A.) en Contabilidad, National Chengchi University',
        'Grado (B.A.) en Contabilidad, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  fr: {
    'tseng-junwei': {
      intro: [
        'Le cabinet traite des affaires d’entreprises et de particuliers à Taïwan en anglais, en japonais, en coréen et en chinois.',
        'Elle a représenté un étudiant coréen dans une demande de dommages-intérêts pour une blessure en salle de sport. Un jugement de première instance a fixé le montant à 1,57 million de dollars taïwanais (TWD 1.57M). Ce n’est pas un résultat promis.',
      ],
      education: [
        'Master (M.S.), Institute of Finance, National Taiwan University',
        'Licence (B.A.) avec double cursus droit et finance, National Chengchi University',
        'Étudiante d’échange à Kobe University et Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Fondation d’aide juridique, antenne de Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Auparavant au ministère de l’Éducation, division des affaires juridiques (Ministry of Education, Legal Affairs Division), principalement en matière administrative et civile.',
        'Expérience des affaires d’universités, des droits du personnel enseignant et des recours administratifs.',
      ],
      education: ['Licence en droit (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministère de l’Éducation, division des affaires juridiques (Ministry of Education, Legal Affairs Division)',
        'Avocat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Collaborateur juridique, fort d’une longue expérience comme collaborateur senior dans plusieurs cabinets, en charge de l’appui procédural, du droit des sociétés et de l’investissement étranger.',
        'Appui aux procédures, à la constitution de sociétés, aux autorisations d’investissement étranger, aux demandes de licence et aux échanges entre la Corée et Taïwan.',
      ],
      education: ['Licence en droit (LL.B.), Tunghai University'],
      experience: [
        'Collaborateur juridique senior, Boyin Law Firm',
        'Collaborateur juridique senior, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Coordonne les rendez-vous de consultation et la communication pour les clients de Corée.',
        'Appuie les échanges entre équipes par des systèmes documentaires et des flux de travail, avec une formation en informatique.',
      ],
      education: ['Licence (B.S.) informatique, National Cheng Kung University'],
      experience: ['Pôle opérations Corée, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Titulaire d’une licence et d’un master en comptabilité de la National Chengchi University, il dirige actuellement un cabinet d’expertise comptable.',
        'Accompagne l’analyse intégrée des risques juridiques, fiscaux et financiers pour les clients d’entreprise.',
      ],
      education: [
        'Master (M.A.) comptabilité, National Chengchi University',
        'Licence (B.A.) comptabilité, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  pt: {
    'tseng-junwei': {
      intro: [
        'O escritório trata assuntos de empresas e de particulares em Taiwan em inglês, japonês, coreano e chinês.',
        'Representou um estudante coreano numa pretensão de indemnização por uma lesão num ginásio e obteve uma sentença de primeira instância de 1,57 milhão de TWD.',
      ],
      education: [
        'Mestrado (M.S.), Institute of Finance, National Taiwan University',
        'Licenciatura (B.A.) em dupla formação de Direito e Finanças, National Chengchi University',
        'Aluna de intercâmbio na Kobe University e na Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Fundação de Assistência Jurídica, Delegação de Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Trabalhou antes no Ministério da Educação, Divisão de Assuntos Jurídicos (Ministry of Education, Legal Affairs Division), centrado em conflitos administrativos e civis.',
        'Tem experiência em assuntos de universidades, direitos do pessoal docente e reclamações administrativas.',
      ],
      education: ['Licenciatura em Direito (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministério da Educação, Divisão de Assuntos Jurídicos (Ministry of Education, Legal Affairs Division)',
        'Advogado, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Assistente jurídico sénior (Paralegal), com anos de experiência em vários escritórios, a cargo do apoio processual, do direito das sociedades e do investimento estrangeiro.',
        'Apoia litígios, constituição de sociedades, trâmites de aprovação de investimento estrangeiro, pedidos de licença e o intercâmbio entre a Coreia e Taiwan.',
      ],
      education: ['Licenciatura em Direito (LL.B.), Tunghai University'],
      experience: [
        'Assistente jurídico sénior (Paralegal), Boyin Law Firm',
        'Assistente jurídico sénior (Paralegal), Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Coordena as marcações de consulta e a comunicação para clientes da Coreia.',
        'Apoia o intercâmbio entre equipas mediante sistemas de documentação e fluxos de trabalho, com formação em informática.',
      ],
      education: ['Licenciatura (B.S.) em Informática, National Cheng Kung University'],
      experience: ['Área de operações da Coreia, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Licenciou-se e concluiu o mestrado em Contabilidade na National Chengchi University e dirige atualmente um escritório de contabilidade.',
        'Apoia a análise integrada de riscos jurídicos, fiscais e financeiros para clientes empresariais.',
      ],
      education: [
        'Mestrado (M.A.) em Contabilidade, National Chengchi University',
        'Licenciatura (B.A.) em Contabilidade, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  'zh-hans': {
    'tseng-junwei': {
      intro: [
        '事务所在台湾以英语、日语、韩语和中文处理企业与个人事项。',
        '曾代理一名韩国学生因健身房受伤提出的损害赔偿，并取得新台币157万元的一审判决。',
      ],
      education: [
        '硕士（M.S.），国立台湾大学财务金融研究所（Institute of Finance, National Taiwan University）',
        '学士（B.A.），国立政治大学法律与金融双主修',
        '神户大学、早稻田大学交换学生',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        '法律扶助基金会台中分会（Legal Aid Foundation, Taichung Branch）',
      ],
    },
    'chang-rongxuan': {
      intro: [
        '此前任职于教育部法制单位，侧重行政与民事事项。',
        '具有高校、教师权利与行政救济方面的经验。',
      ],
      education: ['法学学士（LL.B.），国立中兴大学（National Chung Hsing University）'],
      experience: [
        '教育部法制处（Ministry of Education, Legal Affairs Division）',
        '律师，Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        '任律师助理多年，曾在多家事务所担任资深律师助理，负责诉讼辅助、公司法与外资事务。',
        '协助程序、公司设立、外资核准、证照申请以及韩国与台湾之间的往来。',
      ],
      education: ['法学学士（LL.B.），东海大学（Tunghai University）'],
      experience: [
        '资深律师助理，Boyin Law Firm',
        '资深律师助理，Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        '协调韩国委托人的咨询行程与沟通。',
        '具备信息科学背景，借助文档系统与工作流程，支持部门之间的协作。',
      ],
      education: ['信息科学学士（B.S.），国立成功大学（National Cheng Kung University）'],
      experience: ['韩国运营部门，Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        '国立政治大学会计学学士、硕士，现主持一家会计师事务所。',
        '协助企业客户进行法律、税务与财务风险的综合分析。',
      ],
      education: [
        '会计学硕士（M.A.），国立政治大学（National Chengchi University）',
        '会计学学士（B.A.），国立政治大学（National Chengchi University）',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  ms: {
    'tseng-junwei': {
      intro: [
        'Firma mengendalikan hal syarikat dan individu di Taiwan dalam bahasa Inggeris, Jepun, Korea dan Cina.',
        'Mewakili seorang pelajar Korea dalam tuntutan ganti rugi kerana kecederaan di pusat kecergasan dan memperoleh penghakiman peringkat pertama sebanyak TWD 1,570,000.',
      ],
      education: [
        'Sarjana (M.S.), Institut Kewangan (Institute of Finance), National Taiwan University',
        'Ijazah Sarjana Muda (B.A.) dengan dua pengkhususan, undang-undang dan kewangan, National Chengchi University',
        'Pelajar pertukaran di Kobe University dan Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Yayasan Bantuan Guaman, Cawangan Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Sebelum ini di Kementerian Pendidikan, Bahagian Hal Ehwal Undang-undang (Ministry of Education, Legal Affairs Division), dengan tumpuan pada hal pentadbiran dan sivil.',
        'Pengalaman dalam hal universiti, hak tenaga pengajar dan rayuan pentadbiran.',
      ],
      education: ['Ijazah Sarjana Muda Undang-undang (LL.B.), National Chung Hsing University'],
      experience: [
        'Kementerian Pendidikan, Bahagian Hal Ehwal Undang-undang (Ministry of Education, Legal Affairs Division)',
        'Peguam, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal kanan dengan pengalaman bertahun-tahun di beberapa firma, bertanggungjawab atas sokongan prosedur, undang-undang syarikat dan pelaburan asing.',
        'Sokongan bagi prosedur, penubuhan syarikat, kelulusan pelaburan asing, permohonan lesen dan pertukaran antara Korea dan Taiwan.',
      ],
      education: ['Ijazah Sarjana Muda Undang-undang (LL.B.), Tunghai University'],
      experience: [
        'Paralegal kanan, Boyin Law Firm',
        'Paralegal kanan, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Menyelaras janji temu perundingan dan komunikasi untuk klien dari Korea.',
        'Menyokong pertukaran antara pasukan melalui sistem dokumen dan aliran kerja, berasaskan sains komputer.',
      ],
      education: ['Ijazah Sarjana Muda (B.S.) sains komputer, National Cheng Kung University'],
      experience: ['Bahagian operasi Korea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Telah menamatkan program ijazah sarjana muda dan sarjana perakaunan di National Chengchi University dan kini mengetuai sebuah firma perakaunan.',
        'Menyokong analisis bersepadu risiko undang-undang, cukai dan kewangan untuk klien syarikat.',
      ],
      education: [
        'Sarjana (M.A.) perakaunan, National Chengchi University',
        'Ijazah Sarjana Muda (B.A.) perakaunan, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  ru: {
    'tseng-junwei': {
      intro: [
        'Фирма ведёт дела компаний и частных лиц на Тайване на английском, японском, корейском и китайском языках.',
        'Она представляла студента из Кореи в требовании о возмещении вреда из-за травмы в спортивном зале и добилась решения первой инстанции на 1,57 млн TWD.',
      ],
      education: [
        'Магистр (M.S.), Institute of Finance, National Taiwan University',
        'Бакалавр (B.A.) по двум специальностям — право и финансы, National Chengchi University',
        'Студентка по обмену в Kobe University и Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Ранее — Министерство образования, отдел правовых вопросов (Ministry of Education, Legal Affairs Division), с упором на административные и гражданские дела.',
        'Опыт в делах вузов, правах преподавателей и административных жалобах.',
      ],
      education: ['Бакалавр права (LL.B.), National Chung Hsing University'],
      experience: [
        'Министерство образования, отдел правовых вопросов (Ministry of Education, Legal Affairs Division)',
        'Адвокат, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Помощник адвоката, много лет проработавший старшим помощником в нескольких фирмах; отвечает за процессуальную поддержку, корпоративное право и иностранные инвестиции.',
        'Поддержка процедур, учреждения компаний, разрешений на иностранные инвестиции, заявок на лицензии и обмена между Кореей и Тайванем.',
      ],
      education: ['Бакалавр права (LL.B.), Tunghai University'],
      experience: [
        'Старший помощник адвоката, Boyin Law Firm',
        'Старший помощник адвоката, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Координирует записи на консультацию и общение для доверителей из Кореи.',
        'Поддерживает обмен между подразделениями через системы документов и рабочие процессы, опираясь на образование в области информатики.',
      ],
      education: ['Бакалавр (B.S.) информатики, National Cheng Kung University'],
      experience: ['Операционное направление по Корее, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Окончил бакалавриат и магистратуру по бухгалтерскому учёту в National Chengchi University и в настоящее время руководит бухгалтерской фирмой.',
        'Поддерживает комплексный анализ правовых, налоговых и финансовых рисков для корпоративных клиентов.',
      ],
      education: [
        'Магистр (M.A.) бухгалтерского учёта, National Chengchi University',
        'Бакалавр (B.A.) бухгалтерского учёта, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  tr: {
    'tseng-junwei': {
      intro: [
        'Büro, Tayvan’da şirket ve kişi işlerini İngilizce, Japonca, Korece ve Çince yürütür.',
        'Spor salonunda yaralanma nedeniyle bir Koreli öğrenciyi tazminat isteminde temsil etti ve TWD 1.57M tutarında ilk derece tazminat kararı elde etti.',
      ],
      education: [
        'National Taiwan University Institute of Finance’de yüksek lisans (M.S.)',
        'National Chengchi University’de hukuk ve finans çift lisans programı (B.A.)',
        'Kobe University ve Waseda University’de değişim öğrencisi',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Hukuki Yardım Vakfı, Taichung şubesi (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Daha önce Millî Eğitim Bakanlığının hukuk işleri biriminde (Ministry of Education, Legal Affairs Division), idari uyuşmazlıklar ile hukuk davalarına odaklanarak çalıştı.',
        'Üniversiteler, öğretim elemanı hakları ve idari başvurular konusunda deneyimi vardır.',
      ],
      education: ['National Chung Hsing University’de hukuk lisansı (LL.B.)'],
      experience: [
        'Millî Eğitim Bakanlığı, hukuk işleri birimi (Ministry of Education, Legal Affairs Division)',
        'Avukat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Birden fazla büroda uzun yıllar kıdemli hukuk asistanı olarak çalıştı; usul desteği, şirket hukuku ve yabancı yatırımdan sorumluydu.',
        'Usullere, şirket kuruluşuna, yabancı yatırım onaylarına, ruhsat başvurularına ve Kore ile Tayvan arasındaki iletişime destek verir.',
      ],
      education: ['Tunghai University’de hukuk lisansı (LL.B.)'],
      experience: [
        'Kıdemli hukuk asistanı, Boyin Law Firm',
        'Kıdemli hukuk asistanı, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Kore’den gelen müvekkiller için görüşme randevularını ve iletişimi koordine eder.',
        'Bilgisayar bilimi eğitimiyle belge sistemleri ve iş akışları üzerinden ekipler arası iletişimi destekler.',
      ],
      education: ['National Cheng Kung University’de bilgisayar bilimi lisansı (B.S.)'],
      experience: ['Kore operasyonları, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'National Chengchi University’de muhasebe lisansını ve yüksek lisansını tamamladı ve şu anda bir muhasebe bürosu yönetmektedir.',
        'Kurumsal müvekkiller için hukuki, vergi ve mali risklerin bütünleşik analizini destekler.',
      ],
      education: [
        'National Chengchi University’de muhasebe yüksek lisansı (M.A.)',
        'National Chengchi University’de muhasebe lisansı (B.A.)',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  it: {
    'tseng-junwei': {
      intro: [
        'Lo studio tratta questioni di imprese e di privati a Taiwan in inglese, giapponese, coreano e cinese.',
        'Ha seguito in primo grado la domanda di risarcimento di uno studente coreano per una lesione in palestra, definita con una sentenza di 1,57 milioni di TWD.',
      ],
      education: [
        'Master (M.S.) in finanza, Institute of Finance, National Taiwan University',
        'Laurea (B.A.) con doppia laurea in diritto e finanza, National Chengchi University',
        'Studentessa in scambio alla Kobe University e alla Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Fondazione di assistenza legale, sede di Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'In precedenza ha lavorato presso il Ministero dell’Istruzione, Divisione affari giuridici (Ministry of Education, Legal Affairs Division), con particolare riguardo alle controversie amministrative e civili.',
        'Esperienza in questioni relative alle università, ai diritti del personale docente e ai ricorsi amministrativi.',
      ],
      education: ['Laurea in giurisprudenza (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministero dell’Istruzione, Divisione affari giuridici (Ministry of Education, Legal Affairs Division)',
        'Avvocato, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Collaboratore legale (paralegal), con lunga attività come collaboratore legale senior in più studi, responsabile del supporto processuale, del diritto societario e degli investimenti esteri.',
        'Supporto nei procedimenti, nella costituzione di società, nelle autorizzazioni di investimenti esteri, nelle domande di licenza e nello scambio tra Corea e Taiwan.',
      ],
      education: ['Laurea in giurisprudenza (LL.B.), Tunghai University'],
      experience: [
        'Collaboratore legale senior, Boyin Law Firm',
        'Collaboratore legale senior, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Coordina gli appuntamenti di consulenza e la comunicazione per i clienti dalla Corea.',
        'Agevola la comunicazione tra i team tramite sistemi documentali e flussi di lavoro, sulla base di una formazione in informatica.',
      ],
      education: ['Laurea (B.S.) in informatica, National Cheng Kung University'],
      experience: ['Area operazioni Corea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Ha conseguito la laurea e il master in contabilità alla National Chengchi University e dirige attualmente uno studio di commercialisti a Taiwan.',
        'Contribuisce all’analisi integrata dei rischi giuridici, fiscali e finanziari per i clienti d’impresa.',
      ],
      education: [
        'Master (M.A.) in contabilità, National Chengchi University',
        'Laurea (B.A.) in contabilità, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  nl: {
    'tseng-junwei': {
      intro: [
        'Het kantoor behandelt ondernemings- en individuele zaken in Taiwan in het Engels, Japans, Koreaans en Chinees.',
        'Zij vertegenwoordigde een Koreaanse student in een schadevergoedingsvordering wegens een letsel in een fitnesszaal en verkreeg een vonnis in eerste aanleg van 1,57 miljoen TWD.',
      ],
      education: [
        'Masterdiploma (M.S.) financiën, Institute of Finance, National Taiwan University',
        'Bachelordiploma (B.A.) in de dubbele opleiding rechten en financiën, National Chengchi University',
        'Uitwisselingsstudente aan de Kobe University en de Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Stichting voor rechtsbijstand, vestiging Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Eerder werkzaam bij het ministerie van Onderwijs, afdeling Juridische Zaken (Ministry of Education, Legal Affairs Division), met nadruk op bestuurs- en civiele zaken.',
        'Ervaring met zaken over hogescholen, rechten van onderwijspersoneel en bestuursrechtelijke klachten.',
      ],
      education: ['Bachelordiploma rechten (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministerie van Onderwijs, afdeling Juridische Zaken (Ministry of Education, Legal Affairs Division)',
        'Advocaat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Senior juridisch medewerker met jarenlange ervaring bij meerdere kantoren, verantwoordelijk voor procesondersteuning, vennootschapsrecht en buitenlandse investeringen.',
        'Ondersteuning bij procedures, oprichting van vennootschappen, vergunningen voor buitenlandse investeringen, licentieaanvragen en de uitwisseling tussen Korea en Taiwan.',
      ],
      education: ['Bachelordiploma rechten (LL.B.), Tunghai University'],
      experience: [
        'Senior juridisch medewerker, Boyin Law Firm',
        'Senior juridisch medewerker, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Coördineert consultatieafspraken en de communicatie voor cliënten uit Korea.',
        'Ondersteunt de afstemming tussen afdelingen met document- en werkprocessen, op grond van een opleiding informatica.',
      ],
      education: ['Bachelordiploma (B.S.) informatica, National Cheng Kung University'],
      experience: ['Werkzaamheden Korea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Heeft aan de National Chengchi University een bachelor- en een masteropleiding accountancy afgerond en leidt thans een accountantskantoor.',
        'Ondersteunt de geïntegreerde analyse van juridische, fiscale en financiële risico’s voor ondernemingscliënten.',
      ],
      education: [
        'Masterdiploma (M.A.) accountancy, National Chengchi University',
        'Bachelordiploma (B.A.) accountancy, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  pl: {
    'tseng-junwei': {
      intro: [
        'Kancelaria prowadzi sprawy przedsiębiorstw i osób prywatnych na Tajwanie po angielsku, japońsku, koreańsku i chińsku.',
        'Reprezentowała koreańskiego studenta w żądaniu odszkodowania z powodu urazu na siłowni i uzyskała wyrok pierwszej instancji zasądzający 1,57 mln TWD.',
      ],
      education: [
        'Magister (M.S.), Institute of Finance, National Taiwan University',
        'Licencjat (B.A.), podwójny kierunek: prawo i finanse, National Chengchi University',
        'Studentka wymiany na Kobe University i Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Fundacja pomocy prawnej, oddział w Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Wcześniej w Ministerstwie Edukacji, w departamencie spraw prawnych (Ministry of Education, Legal Affairs Division), ze szczególnym uwzględnieniem spraw administracyjnych i cywilnych.',
        'Doświadczenie w sprawach uczelni, praw nauczycieli i skarg administracyjnych.',
      ],
      education: ['Licencjat prawa (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministerstwo Edukacji, departament spraw prawnych (Ministry of Education, Legal Affairs Division)',
        'Adwokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Asystent prawny (paralegal) z wieloletnią pracą na stanowisku starszego asystenta prawnego w kilku kancelariach, odpowiedzialny za wsparcie procesowe, prawo spółek i inwestycje zagraniczne.',
        'Wsparcie postępowań, zakładania spółek, zezwoleń na inwestycje zagraniczne, wniosków o licencje oraz wymiany między Koreą a Tajwanem.',
      ],
      education: ['Licencjat prawa (LL.B.), Tunghai University'],
      experience: [
        'Starszy asystent prawny, Boyin Law Firm',
        'Starszy asystent prawny, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordynuje terminy konsultacji i komunikację dla klientów z Korei.',
        'Wspiera wymianę między działami przez systemy dokumentów i tok pracy, na podstawie wykształcenia informatycznego.',
      ],
      education: ['Licencjat (B.S.) informatyki, National Cheng Kung University'],
      experience: ['Kierownictwo ds. operacji w Korei, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Ukończył studia licencjackie i magisterskie z rachunkowości na National Chengchi University i obecnie kieruje biurem rachunkowym.',
        'Wspiera zintegrowaną analizę ryzyka prawnego, podatkowego i finansowego dla klientów korporacyjnych.',
      ],
      education: [
        'Magister (M.A.) rachunkowości, National Chengchi University',
        'Licencjat (B.A.) rachunkowości, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  hi: {
    'tseng-junwei': {
      intro: [
        'कार्यालय ताइवान में उद्यमों और व्यक्तियों के मामलों का अंग्रेज़ी, जापानी, कोरियाई और चीनी में कार्य करता है।',
        'उन्होंने जिम में लगी चोट के हर्जाने के एक दावे में कोरियाई छात्र का प्रतिनिधित्व किया और निचली अदालत (प्रथम न्यायालय) से TWD 1,570,000 का निर्णय दिलाया।',
      ],
      education: [
        'स्नातकोत्तर (M.S.), वित्त संस्थान (Institute of Finance, National Taiwan University)',
        'विधि और वित्त, दोनों विषयों में स्नातक (B.A.), National Chengchi University',
        'Kobe University और Waseda University में विनिमय छात्रा',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'ताइचुंग शाखा, विधिक सहायता प्रतिष्ठान (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'इससे पहले शिक्षा मंत्रालय, विधि प्रभाग (Ministry of Education, Legal Affairs Division) में कार्य किया, प्रशासनिक और दीवानी मामलों पर ध्यान के साथ।',
        'विश्वविद्यालयों, शिक्षण कर्मचारियों के अधिकारों और प्रशासनिक अपीलों से जुड़े मामलों का अनुभव।',
      ],
      education: ['विधि स्नातक (LL.B.), National Chung Hsing University'],
      experience: [
        'शिक्षा मंत्रालय, विधि प्रभाग (Ministry of Education, Legal Affairs Division)',
        'अधिवक्ता, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'विधि सहायक (पैरालीगल) जिन्होंने कई कार्यालयों में वरिष्ठ विधि सहायक के रूप में लंबे समय तक कार्य किया, मुकदमे की सहायता, कंपनी विधि और विदेशी निवेश के लिए उत्तरदायी।',
        'कार्यवाही, कंपनी स्थापना, विदेशी निवेश अनुमति, लाइसेंस आवेदन तथा कोरिया और ताइवान के बीच आदान-प्रदान में सहायता।',
      ],
      education: ['विधि स्नातक (LL.B.), Tunghai University'],
      experience: [
        'वरिष्ठ विधि सहायक (Senior Paralegal), Boyin Law Firm',
        'वरिष्ठ विधि सहायक (Senior Paralegal), Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'कोरिया से आए मुवक्किलों के परामर्श समय और संचार का समन्वय करते हैं।',
        'सूचना विज्ञान की पढ़ाई के आधार पर दस्तावेज़ प्रणालियों और कार्यप्रवाह के जरिए विभागों के बीच आदान-प्रदान में सहायता करते हैं।',
      ],
      education: ['स्नातक (B.S.) सूचना विज्ञान, National Cheng Kung University'],
      experience: ['कोरिया संचालन का नेतृत्व, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'National Chengchi University से लेखा में स्नातक और स्नातकोत्तर कार्यक्रम पूरे किए और वर्तमान में एक लेखा कार्यालय का नेतृत्व करते हैं।',
        'उद्यमी मुवक्किलों के लिए कानूनी, कर और वित्तीय जोखिमों के एकीकृत विश्लेषण में सहायता करते हैं।',
      ],
      education: [
        'स्नातकोत्तर (M.A.) लेखा, National Chengchi University',
        'स्नातक (B.A.) लेखा, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  sv: {
    'tseng-junwei': {
      intro: [
        'Byrån behandlar företags- och enskilda ärenden i Taiwan på engelska, japanska, koreanska och kinesiska.',
        'Hon företrädde en koreansk student i ett skadeståndsanspråk efter en skada på ett gym och fick i första instans en dom på 1,57 miljoner TWD.',
      ],
      education: [
        'Masterexamen (M.S.) vid Institute of Finance, National Taiwan University',
        'Kandidatexamen (B.A.) med dubbla huvudämnen i juridik och finans, National Chengchi University',
        'Utbytesstudent vid Kobe University och Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Stiftelsen för rättshjälp, filialen i Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Tidigare vid utbildningsministeriet, avdelningen för juridiska frågor (Ministry of Education, Legal Affairs Division), med tonvikt på förvaltnings- och civilrättsliga ärenden.',
        'Erfarenhet av ärenden om högskolor, lärares rättigheter och förvaltningsrättsliga klagomål.',
      ],
      education: ['Juridisk kandidatexamen (LL.B.), National Chung Hsing University'],
      experience: [
        'Utbildningsministeriet, avdelningen för juridiska frågor (Ministry of Education, Legal Affairs Division)',
        'Advokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Juristassistent med lång erfarenhet som senior juristassistent vid flera byråer, ansvarig för processstöd, bolagsrätt och utländska investeringar.',
        'Stöd vid förfaranden, bolagsbildning, tillstånd för utländska investeringar, licensansökningar och kontakterna mellan Korea och Taiwan.',
      ],
      education: ['Juridisk kandidatexamen (LL.B.), Tunghai University'],
      experience: [
        'Senior juristassistent, Boyin Law Firm',
        'Senior juristassistent, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Samordnar rådgivningstider och kommunikationen för klienter från Korea.',
        'Stödjer samarbetet mellan verksamhetsområdena genom dokumentsystem och arbetsflöden, med bakgrund i datavetenskap.',
      ],
      education: ['Kandidatexamen (B.S.) i datavetenskap, National Cheng Kung University'],
      experience: ['Ansvarig för Korea-verksamheten, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Har avlagt kandidatexamen och masterexamen i redovisning vid National Chengchi University och leder nu en revisionsbyrå.',
        'Stödjer den integrerade analysen av juridiska, skattemässiga och finansiella risker för företagsklienter.',
      ],
      education: [
        'Master (M.A.) i redovisning, National Chengchi University',
        'Kandidatexamen (B.A.) i redovisning, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  da: {
    'tseng-junwei': {
      intro: [
        'Kontoret behandler virksomheds- og individuelle sager i Taiwan på engelsk, japansk, koreansk og kinesisk.',
        'Hun repræsenterede en koreansk studerende i et erstatningskrav efter en skade i et fitnesscenter og fik i første instans en dom på TWD 1.57M (1,57 mio. TWD).',
      ],
      education: [
        'Kandidat (M.S.), Institute of Finance, National Taiwan University',
        'Bachelor (B.A.) med to hovedfag, jura og finans, National Chengchi University',
        'Udvekslingsstuderende ved Kobe University og Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Tidligere ved undervisningsministeriet i Taiwan, afdelingen for juridiske anliggender (Ministry of Education, Legal Affairs Division), med vægt på forvaltnings- og civilretlige sager.',
        'Erfaring med sager om universiteter, undervisningspersonalets rettigheder og forvaltningsretlige klager.',
      ],
      education: ['Juridisk bachelor (LL.B.), National Chung Hsing University'],
      experience: [
        'Undervisningsministeriet i Taiwan, afdelingen for juridiske anliggender (Ministry of Education, Legal Affairs Division)',
        'Advokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal med lang erfaring som senior paralegal ved flere kontorer, ansvarlig for processuel støtte, selskabsret og udenlandske investeringer.',
        'Støtte ved procedurer, selskabsstiftelse, tilladelser til udenlandske investeringer, licensansøgninger og udvekslingen mellem Korea og Taiwan.',
      ],
      education: ['Juridisk bachelor (LL.B.), Tunghai University'],
      experience: [
        'Senior paralegal, Boyin Law Firm',
        'Senior paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinerer rådgivningstider og kommunikationen for klienter fra Korea.',
        'Støtter kommunikationen på tværs af teamene med dokumentsystemer og arbejdsgange og har en baggrund i datalogi.',
      ],
      education: ['Bachelor (B.S.) i datalogi, National Cheng Kung University'],
      experience: ['Korea-forretningen, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Har en bachelorgrad og en kandidatgrad i regnskab ved National Chengchi University og leder nu et revisionskontor.',
        'Støtter den integrerede analyse af juridiske, skattemæssige og finansielle risici for virksomhedsklienter.',
      ],
      education: [
        'Kandidat (M.A.) i regnskab, National Chengchi University',
        'Bachelor (B.A.) i regnskab, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  nb: {
    'tseng-junwei': {
      intro: [
        'Kontoret behandler saker for virksomheter og privatpersoner i Taiwan på engelsk, japansk, koreansk og kinesisk.',
        'Hun representerte en koreansk student i et erstatningskrav etter en skade på et treningssenter; saken endte med dom i første instans på 1 570 000 TWD.',
      ],
      education: [
        'Master (M.S.), Institute of Finance, National Taiwan University',
        'Bachelor (B.A.) med to fag, jus og finans, National Chengchi University',
        'Utvekslingsstudent ved Kobe University og Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Stiftelsen for rettshjelp, avdelingen i Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Tidligere ved utdanningsdepartementet, avdelingen for juridiske saker (Ministry of Education, Legal Affairs Division), med vekt på forvaltnings- og sivilrettslige saker.',
        'Erfaring med saker om universiteter, undervisningspersonalets rettigheter og forvaltningsrettslige klager.',
      ],
      education: ['Juridisk bachelor (LL.B.), National Chung Hsing University'],
      experience: [
        'Utdanningsdepartementet, avdelingen for juridiske saker (Ministry of Education, Legal Affairs Division)',
        'Advokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Juridisk assistent med lang erfaring som senior juridisk assistent ved flere kontorer, med ansvar for prosesstøtte, selskapsrett og utenlandske investeringer.',
        'Bistand ved prosedyre, selskapsstiftelse, godkjenning av utenlandske investeringer, lisenssøknader og kontakten mellom Korea og Taiwan.',
      ],
      education: ['Juridisk bachelor (LL.B.), Tunghai University'],
      experience: [
        'Senior juridisk assistent, Boyin Law Firm',
        'Senior juridisk assistent, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinerer rådgivningstider og kommunikasjonen for klienter fra Korea.',
        'Støtter kommunikasjonen på tvers av teamene ved hjelp av dokumentsystemer og arbeidsprosesser, og har bakgrunn i informatikk.',
      ],
      education: ['Bachelor (B.S.) i informatikk, National Cheng Kung University'],
      experience: ['Korea-forretningsteamet, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Har avlagt bachelorgrad og mastergrad i regnskap ved National Chengchi University og leder nå et revisjonskontor.',
        'Bidrar til en samlet analyse av juridisk, skattemessig og finansiell risiko for virksomhetsklienter.',
      ],
      education: [
        'Master (M.A.) i regnskap, National Chengchi University',
        'Bachelor (B.A.) i regnskap, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  fi: {
    'tseng-junwei': {
      intro: [
        'Toimisto käsittelee yritysten ja yksityishenkilöiden asioita Taiwanissa englanniksi, japaniksi, koreaksi ja kiinaksi.',
        'Hän ajoi korealaisen opiskelijan vahingonkorvausasian kuntosalilla sattuneesta vammasta, ja ensimmäinen oikeusaste tuomitsi päämiehen hyväksi 1,57 miljoonan TWD:n korvauksen.',
      ],
      education: [
        'Maisterintutkinto (M.S.) National Taiwan Universityn Institute of Financesta',
        'Oikeustieteen ja rahoituksen kaksoistutkinto (B.A.) National Chengchi Universitystä',
        'Vaihto-opiskelija Kobe Universityssä ja Waseda Universityssä',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Oikeusapusäätiö, Taichungin toimipiste (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Aiemmin opetusministeriössä, oikeudellisten asioiden yksikössä (Ministry of Education, Legal Affairs Division), painopisteenä hallinto- ja siviiliasiat.',
        'Kokemusta yliopistoja, opetushenkilöstön oikeuksia ja hallintovalituksia koskevista asioista.',
      ],
      education: ['Oikeustieteen kandidaatin tutkinto (LL.B.) National Chung Hsing Universitystä'],
      experience: [
        'Opetusministeriö, oikeudellisten asioiden yksikkö (Ministry of Education, Legal Affairs Division)',
        'Asianajaja, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Lakimiesavustaja, jolla on pitkä kokemus vanhempana lakimiesavustajana useissa toimistoissa, vastuualueinaan prosessituki, yhtiöoikeus ja ulkomaiset investoinnit.',
        'Tukee menettelyissä, yhtiön perustamisessa, ulkomaisten investointien luvissa, lupahakemuksissa sekä Korean ja Taiwanin vaihdossa.',
      ],
      education: ['Oikeustieteen kandidaatin tutkinto (LL.B.) Tunghai Universitystä'],
      experience: [
        'Vanhempi lakimiesavustaja, Boyin Law Firm',
        'Vanhempi lakimiesavustaja, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinoi neuvonta-aikoja ja viestintää Koreasta tuleville päämiehille.',
        'Tukee toimintojen välistä tiedonvaihtoa asiakirjajärjestelmien ja työnkulkujen avulla, tietojenkäsittelytieteen pohjalta.',
      ],
      education: ['Kandidaatintutkinto (B.S.) tietojenkäsittelytieteessä National Cheng Kung Universityssä'],
      experience: ['Korean toiminnot, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'On suorittanut kirjanpidon kandidaatin ja maisterin tutkinnot National Chengchi Universityssä ja johtaa nyt tilintarkastustoimistoa.',
        'Tukee yritysasiakkaiden oikeudellisten, verotuksellisten ja taloudellisten riskien kokonaisarviointia.',
      ],
      education: [
        'Maisterintutkinto (M.A.) kirjanpidossa National Chengchi Universityssä',
        'Kandidaatintutkinto (B.A.) kirjanpidossa National Chengchi Universityssä',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  cs: {
    'tseng-junwei': {
      intro: [
        'Kancelář vede věci podniků a soukromých osob na Tchaj-wanu v angličtině, japonštině, korejštině a čínštině.',
        'Zastupovala korejského studenta v řízení o náhradu škody za úraz v posilovně a dosáhla rozsudku prvního stupně ve výši 1,57 mil. TWD.',
      ],
      education: [
        'Magistr (M.S.), Institute of Finance, National Taiwan University',
        'Bakalář (B.A.) dvouoborového studia práva a financí, National Chengchi University',
        'Výměnné studium na Kobe University a Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Nadace právní pomoci, pobočka Tchaj-čung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Dříve v Ministerstvu školství, v odboru právních záležitostí (Ministry of Education, Legal Affairs Division), se zaměřením na správní a občanskoprávní věci.',
        'Zkušenost s věcmi univerzit, práv pedagogů a správních odvolání.',
      ],
      education: [
        'Bakalář práv (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Ministerstvo školství, odbor právních záležitostí (Ministry of Education, Legal Affairs Division)',
        'Advokát, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Právní asistent s dlouholetou praxí; dříve starší právní asistent ve více advokátních kancelářích, se zaměřením na procesní podporu, korporátní agendu a zahraniční investice.',
        'Podpora v soudních řízeních, při zakládání společností, u povolení zahraničních investic, u žádostí o licence a při komunikaci mezi Koreou a Tchaj-wanem.',
      ],
      education: [
        'Bakalář práv (LL.B.), Tunghai University',
      ],
      experience: [
        'Starší právní asistent, Boyin Law Firm',
        'Starší právní asistent, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinuje termíny porad a komunikaci pro klienty z Koreje.',
        'Podporuje meziregionální výměnu prostřednictvím systémů dokumentů a pracovních postupů, na základě vzdělání v informatice.',
      ],
      education: [
        'Bakalář (B.S.) v informatice, National Cheng Kung University',
      ],
      experience: [
        'Vedení provozu v Koreji, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Vystudoval bakalářský a magisterský obor účetnictví na National Chengchi University a nyní vede účetní kancelář.',
        'Podporuje integrovanou analýzu právních, daňových a finančních rizik pro firemní klienty.',
      ],
      education: [
        'Magistr (M.A.) v účetnictví, National Chengchi University',
        'Bakalář (B.A.) v účetnictví, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  hu: {
    'tseng-junwei': {
      intro: [
        'Az iroda vállalatok és magánszemélyek tajvani ügyeiben jár el angolul, japánul, koreaiul és kínaiul.',
        'Koreai hallgatót képviselt edzőtermi sérülés miatti kártérítési igényben, és első fokon 1,57 millió TWD megítélését érte el.',
      ],
      education: [
        'Mesterfokozat (M.S.), Institute of Finance, National Taiwan University',
        'Alapfokozat (B.A.) jogi és pénzügyi kettős képzésben, National Chengchi University',
        'Cserehallgató a Kobe University-n és a Waseda University-n',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Jogi Segítségnyújtási Alapítvány, tajcsungi kirendeltség (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Korábban az Oktatási Minisztérium jogi osztályának (Ministry of Education, Legal Affairs Division) munkatársa, közigazgatási és polgári ügyekre összpontosítva.',
        'Tapasztalat egyetemeket, oktatói jogokat és közigazgatási fellebbezéseket érintő ügyekben.',
      ],
      education: [
        'Jogi alapfokozat (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Oktatási Minisztérium, jogi osztály (Ministry of Education, Legal Affairs Division)',
        'Ügyvéd, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Jogi asszisztens; több irodában vezető jogi asszisztensként eljárási, társasági jogi és külföldi befektetési ügyeket támogatott.',
        'Támogatás eljárásokban, cégalapításban, külföldi befektetési engedélyekben, engedélykérelmekben, valamint a koreai–tajvani kapcsolatokban.',
      ],
      education: [
        'Jogi alapfokozat (LL.B.), Tunghai University',
      ],
      experience: [
        'Vezető jogi asszisztens, Boyin Law Firm',
        'Vezető jogi asszisztens, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Egyezteti a tanácsadási időpontokat és a kommunikációt a koreai ügyfelek számára.',
        'Dokumentumrendszerekkel és munkafolyamatokkal támogatja a csapatok közötti egyeztetést; a háttere informatikai végzettség.',
      ],
      education: [
        'Alapfokozat (B.S.) informatikából, National Cheng Kung University',
      ],
      experience: [
        'Koreai üzleti csapat, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'A National Chengchi University számviteli alap- és mesterképzését végezte el, jelenleg könyvelőirodát vezet.',
        'Vállalati ügyfeleket a jogi, adózási és pénzügyi kockázatok együttes elemzésében támogatja.',
      ],
      education: [
        'Mesterfokozat (M.A.) számvitelből, National Chengchi University',
        'Alapfokozat (B.A.) számvitelből, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  ro: {
    'tseng-junwei': {
      intro: [
        'Cabinetul tratează cauze ale întreprinderilor și ale persoanelor fizice în Taiwan în engleză, japoneză, coreeană și chineză.',
        'A reprezentat un student coreean într-o cerere de despăgubire pentru o vătămare la sala de sport, iar instanța de fond a pronunțat o hotărâre de 1,57 mil. TWD.',
      ],
      education: [
        'Master (M.S.) în finanțe, Institute of Finance, National Taiwan University',
        'Licență (B.A.), dublă specializare în drept și finanțe, National Chengchi University',
        'Studentă în program de schimb la Kobe University și Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Fundația de asistență juridică, filiala Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'A lucrat anterior la Ministerul Educației, Direcția juridică (Ministry of Education, Legal Affairs Division), cu accent pe cauze administrative și civile.',
        'Experiență în cauze privind universități, drepturile cadrelor didactice și contestații administrative.',
      ],
      education: [
        'Licență în drept (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Ministerul Educației, Direcția juridică (Ministry of Education, Legal Affairs Division)',
        'Avocat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Asistent juridic (paralegal), cu o activitate îndelungată ca asistent juridic senior în mai multe cabinete, cu atribuții de sprijin procedural, drept societar și investiții străine.',
        'Sprijin în proceduri, la înființarea de societăți, la aprobările pentru investiții străine, la cererile de licență și în schimburile dintre Coreea și Taiwan.',
      ],
      education: [
        'Licență în drept (LL.B.), Tunghai University',
      ],
      experience: [
        'Asistent juridic senior (paralegal), Boyin Law Firm',
        'Asistent juridic senior (paralegal), Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Coordonează programările pentru consultanță și comunicarea pentru clienții din Coreea.',
        'Sprijină schimbul dintre echipe prin sisteme de documente și fluxuri de lucru, având formare în informatică.',
      ],
      education: [
        'Licență (B.S.) în informatică, National Cheng Kung University',
      ],
      experience: [
        'Operațiunile pentru Coreea, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'A absolvit licența și masteratul în contabilitate la National Chengchi University și conduce acum un cabinet de contabilitate.',
        'Sprijină analiza integrată a riscurilor juridice, fiscale și financiare pentru clienții persoane juridice.',
      ],
      education: [
        'Master (M.A.) în contabilitate, National Chengchi University',
        'Licență (B.A.) în contabilitate, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  uk: {
    'tseng-junwei': {
      intro: [
        'Фірма веде справи підприємств і приватних осіб на Тайвані англійською, японською, корейською та китайською.',
        'Представляла корейського студента у вимозі про відшкодування шкоди через травму в спортзалі та здобула рішення першої інстанції на TWD 1.57M.',
      ],
      education: [
        'Магістр (M.S.), Institute of Finance, National Taiwan University',
        'Бакалавр (B.A.) права та фінансів (дві спеціальності), National Chengchi University',
        'Навчання за обміном у Kobe University та Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Фонд правової допомоги, відділення в Тайчжуні (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Раніше — у Міністерстві освіти, у відділі правових питань (Ministry of Education, Legal Affairs Division), з акцентом на адміністративні та цивільні справи.',
        'Досвід у справах щодо університетів, прав викладачів та адміністративних оскаржень.',
      ],
      education: [
        'Бакалавр права (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Міністерство освіти, відділ правових питань (Ministry of Education, Legal Affairs Division)',
        'Адвокат, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Помічник адвоката з багаторічним досвідом роботи старшим помічником у кількох фірмах; відповідає за процесуальну підтримку, корпоративне право та іноземні інвестиції.',
        'Підтримка в провадженнях, у створенні товариств, у погодженнях іноземних інвестицій, у заявах на ліцензії та в обміні між Кореєю і Тайванем.',
      ],
      education: [
        'Бакалавр права (LL.B.), Tunghai University',
      ],
      experience: [
        'Старший помічник адвоката (Senior Paralegal), Boyin Law Firm',
        'Старший помічник адвоката (Senior Paralegal), Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Узгоджує час консультацій і спілкування для клієнтів із Кореї.',
        'Підтримує обмін між напрямами через системи документів і робочі процеси, маючи підготовку з інформатики.',
      ],
      education: [
        'Бакалавр (B.S.) з інформатики, National Cheng Kung University',
      ],
      experience: [
        'Напрям корейських операцій, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Закінчив бакалаврську та магістерську програми з бухгалтерського обліку в National Chengchi University і нині керує бухгалтерською фірмою.',
        'Підтримує цілісний аналіз правових, податкових і фінансових ризиків для корпоративних клієнтів.',
      ],
      education: [
        'Магістр (M.A.) з бухгалтерського обліку, National Chengchi University',
        'Бакалавр (B.A.) з бухгалтерського обліку, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  el: {
    'tseng-junwei': {
      intro: [
        'Το γραφείο χειρίζεται υποθέσεις επιχειρήσεων και ιδιωτών στην Ταϊβάν στα αγγλικά, ιαπωνικά, κορεατικά και κινεζικά.',
        'Εκπροσώπησε Κορεάτη φοιτητή σε αξίωση αποζημίωσης για τραυματισμό σε γυμναστήριο και πέτυχε πρωτόδικη απόφαση ύψους 1,57 εκατ. TWD.',
      ],
      education: [
        'Μεταπτυχιακό (M.S.), Institute of Finance, National Taiwan University',
        'Πτυχίο (B.A.) με δύο κύριες κατευθύνσεις, νομική και χρηματοοικονομικά, National Chengchi University',
        'Φοιτήτρια ανταλλαγής στο Kobe University και στο Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Ίδρυμα Νομικής Αρωγής, παράρτημα Ταϊτσούνγκ (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Παλαιότερα στο Υπουργείο Παιδείας, Τμήμα Νομικών Υποθέσεων (Ministry of Education, Legal Affairs Division), με έμφαση σε διοικητικές και αστικές υποθέσεις.',
        'Εμπειρία σε υποθέσεις πανεπιστημίων, δικαιωμάτων διδακτικού προσωπικού και διοικητικών προσφυγών.',
      ],
      education: [
        'Πτυχίο νομικής (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Υπουργείο Παιδείας, Τμήμα Νομικών Υποθέσεων (Ministry of Education, Legal Affairs Division)',
        'Δικηγόρος, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Νομικός συνεργάτης (paralegal) με μακρά θητεία ως ανώτερος νομικός συνεργάτης (senior paralegal) σε διάφορα γραφεία, με ευθύνη για δικονομική υποστήριξη, εταιρικό δίκαιο και ξένες επενδύσεις.',
        'Υποστήριξη σε διαδικασίες, στη σύσταση εταιρειών, σε εγκρίσεις ξένων επενδύσεων, σε αιτήσεις αδειών και στην επικοινωνία Κορέας–Ταϊβάν.',
      ],
      education: [
        'Πτυχίο νομικής (LL.B.), Tunghai University',
      ],
      experience: [
        'Ανώτερος νομικός συνεργάτης, Boyin Law Firm',
        'Ανώτερος νομικός συνεργάτης, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Συντονίζει τα ραντεβού συμβουλευτικής και την επικοινωνία για εντολείς από την Κορέα.',
        'Υποστηρίζει την επικοινωνία μεταξύ των ομάδων μέσω συστημάτων εγγράφων και ροών εργασίας, με σπουδές πληροφορικής.',
      ],
      education: [
        'Πτυχίο (B.S.) πληροφορικής, National Cheng Kung University',
      ],
      experience: [
        'Τομέας λειτουργιών Κορέας, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Είναι πτυχιούχος και κάτοχος μεταπτυχιακού στη λογιστική από το National Chengchi University και διευθύνει τώρα λογιστικό γραφείο.',
        'Υποστηρίζει την ενιαία ανάλυση νομικών, φορολογικών και χρηματοοικονομικών κινδύνων για εταιρικούς πελάτες.',
      ],
      education: [
        'Μεταπτυχιακό (M.A.) λογιστικής, National Chengchi University',
        'Πτυχίο (B.A.) λογιστικής, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  he: {
    'tseng-junwei': {
      intro: [
        'המשרד מטפל בעניינים של עסקים ושל יחידים בטאיוואן באנגלית, ביפנית, בקוריאנית ובסינית.',
        'ייצגה סטודנט קוריאני בתביעת פיצויים בשל פגיעה במכון כושר והשיגה פסק דין בערכאה ראשונה בסך TWD 1.57M.',
      ],
      education: [
        'מוסמכת (M.S.), Institute of Finance, National Taiwan University',
        'בוגרת (B.A.) במסלול כפול של משפטים ומימון, National Chengchi University',
        'לימודי חילופין ב־Kobe University וב־Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'הקרן לסיוע משפטי, סניף טאיצ׳ונג (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'בעבר במשרד החינוך, האגף לעניינים משפטיים (Ministry of Education, Legal Affairs Division), בדגש על עניינים מנהליים ואזרחיים.',
        'ניסיון בעניינים הנוגעים לאוניברסיטאות, לזכויות סגל ההוראה ולעררים מנהליים.',
      ],
      education: [
        'בוגר משפטים (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'משרד החינוך, האגף לעניינים משפטיים (Ministry of Education, Legal Affairs Division)',
        'עורך דין, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'עוזר משפטי (paralegal) בעל ותק רב, ששימש עוזר משפטי בכיר בכמה משרדים והיה אחראי לתמיכה דיונית, לדיני חברות ולהשקעות זרות.',
        'תמיכה בהליכים, בהקמת חברות, באישורי השקעות זרות, בבקשות לרישיונות ובקשרים שבין קוריאה לטאיוואן.',
      ],
      education: [
        'בוגר משפטים (LL.B.), Tunghai University',
      ],
      experience: [
        'עוזר משפטי בכיר (Senior Paralegal), Boyin Law Firm',
        'עוזר משפטי בכיר (Senior Paralegal), Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'מתאם מועדי ייעוץ ותקשורת עבור לקוחות מקוריאה.',
        'תומך בקשרים בין־אזוריים באמצעות מערכות מסמכים ותהליכי עבודה, על רקע מדעי המחשב.',
      ],
      education: [
        'בוגר (B.S.) במדעי המחשב, National Cheng Kung University',
      ],
      experience: [
        'תחום הפעילות בקוריאה, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'סיים תואר ראשון ותואר שני בחשבונאות ב־National Chengchi University וכיום מנהל משרד ראיית חשבון.',
        'תומך בניתוח משולב של סיכונים משפטיים, מיסויים ופיננסיים עבור לקוחות עסקיים.',
      ],
      education: [
        'מוסמך (M.A.) בחשבונאות, National Chengchi University',
        'בוגר (B.A.) בחשבונאות, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  bn: {
    'tseng-junwei': {
      intro: [
        'কার্যালয় তাইওয়ানে ব্যবসা ও ব্যক্তিগত বিষয়ে ইংরেজি, জাপানি, কোরীয় ও চীনায় কাজ করে।',
        'তিনি জিমে আঘাতজনিত ক্ষতিপূরণের দাবিতে একজন কোরীয় শিক্ষার্থীর প্রতিনিধিত্ব করেছেন এবং প্রথম আদালত থেকে TWD 1.57M রায় আদায় করেছেন।',
      ],
      education: [
        'স্নাতকোত্তর (M.S.), ফিন্যান্স ইনস্টিটিউট, ন্যাশনাল তাইওয়ান বিশ্ববিদ্যালয় (Institute of Finance, National Taiwan University)',
        'আইন ও অর্থায়নে দ্বৈত স্নাতক (B.A.), National Chengchi University',
        'Kobe University ও Waseda University-এ বিনিময় ছাত্রী',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'আইনি সহায়তা ফাউন্ডেশন, তাইচুং শাখা (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'আগে শিক্ষা মন্ত্রণালয়ের আইন বিভাগে (Ministry of Education, Legal Affairs Division) কাজ করেছেন, প্রশাসনিক ও দেওয়ানি বিষয়ে মনোযোগ দিয়ে।',
        'বিশ্ববিদ্যালয়, শিক্ষকদের অধিকার এবং প্রশাসনিক আপিল-সংক্রান্ত বিষয়ের অভিজ্ঞতা।',
      ],
      education: ['আইন স্নাতক (LL.B.), National Chung Hsing University'],
      experience: [
        'শিক্ষা মন্ত্রণালয়, আইন বিভাগ (Ministry of Education, Legal Affairs Division)',
        'আইনজীবী, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'আইনি সহকারী, যিনি বেশ কয়েকটি কার্যালয়ে সিনিয়র আইনি সহকারী হিসেবে দীর্ঘদিন কাজ করেছেন, কার্যক্রম সহায়তা, কোম্পানি আইন ও বিদেশি বিনিয়োগের দায়িত্বে।',
        'মামলা, কোম্পানি গঠন, বিদেশি বিনিয়োগ অনুমতি, লাইসেন্স আবেদন এবং কোরিয়া ও তাইওয়ানের মধ্যে আদান-প্রদানে সহায়তা।',
      ],
      education: ['আইন স্নাতক (LL.B.), Tunghai University'],
      experience: [
        'সিনিয়র আইনি সহকারী, Boyin Law Firm',
        'সিনিয়র আইনি সহকারী, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'কোরিয়া থেকে আসা মক্কেলদের পরামর্শের সময় ও যোগাযোগ সমন্বয় করেন।',
        'তথ্যবিজ্ঞানের পড়াশোনার ভিত্তিতে নথি-ব্যবস্থা ও কাজের ধারা দিয়ে বিভাগগুলোর মধ্যে আদান-প্রদানে সহায়তা করেন।',
      ],
      education: ['স্নাতক (B.S.) তথ্যবিজ্ঞান, National Cheng Kung University'],
      experience: ['কোরিয়া পরিচালনা, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'National Chengchi University-এ হিসাবে স্নাতক ও স্নাতকোত্তর কর্মসূচি শেষ করেছেন এবং বর্তমানে একটি চার্টার্ড অ্যাকাউন্ট্যান্টের কার্যালয় পরিচালনা করেন।',
        'উদ্যোক্তা মক্কেলদের জন্য আইনি, কর ও আর্থিক ঝুঁকির সমন্বিত বিশ্লেষণ সমর্থন করেন।',
      ],
      education: [
        'স্নাতকোত্তর (M.A.) হিসাব, National Chengchi University',
        'স্নাতক (B.A.) হিসাব, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  ur: {
    'tseng-junwei': {
      intro: [
        'دفتر تائیوان میں کاروباروں اور افراد کے معاملات کا انگریزی، جاپانی، کوریائی اور چینی میں کام کرتا ہے۔',
        'انہوں نے جم میں لگی چوٹ کے ہرجانے کے ایک دعوے میں کوریائی طالب علم کی نمائندگی کی اور ابتدائی عدالت (پہلے درجے کی عدالت) سے TWD 1.57M کا فیصلہ دلایا۔',
      ],
      education: [
        'ماسٹر (M.S.)، Institute of Finance, National Taiwan University',
        'بیچلر (B.A.) قانون اور مالیات کی دوہری تعلیم کے ساتھ، National Chengchi University',
        'Kobe University اور Waseda University میں تبادلے کی طالبہ',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'قانونی امداد فاؤنڈیشن، تائچونگ شاخ (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'اس سے پہلے وزارتِ تعلیم کے قانونی امور کے شعبے (Ministry of Education, Legal Affairs Division) میں کام کیا، انتظامی اور دیوانی معاملات پر توجہ کے ساتھ۔',
        'یونیورسٹیوں، تدریسی عملے کے حقوق اور انتظامی اپیلوں سے جڑے معاملات کا تجربہ۔',
      ],
      education: ['قانون میں بیچلر (LL.B.)، National Chung Hsing University'],
      experience: [
        'وزارتِ تعلیم، قانونی امور کا شعبہ (Ministry of Education, Legal Affairs Division)',
        'وکیل، Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'قانونی معاون جنہوں نے کئی دفاتر میں سینئر قانونی معاون کے طور پر طویل عرصہ کام کیا، طریقہ کار کی معاونت، کمپنی قانون اور غیر ملکی سرمایہ کاری کے لیے ذمہ دار۔',
        'کارروائی، کمپنی کا قیام، غیر ملکی سرمایہ کاری کی اجازت، لائسنس کی درخواستیں اور کوریا و تائیوان کے درمیان تبادلے میں مدد۔',
      ],
      education: ['قانون میں بیچلر (LL.B.)، Tunghai University'],
      experience: [
        'سینئر قانونی معاون، Boyin Law Firm',
        'سینئر قانونی معاون، Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'کوریا سے آئے موکلوں کے مشورے کے اوقات اور رابطے کو مربوط کرتے ہیں۔',
        'کمپیوٹر سائنس کی بنیاد پر دستاویزی نظاموں اور کام کے طریقوں کے ذریعے شعبوں کے درمیان ربط میں مدد کرتے ہیں۔',
      ],
      education: ['بیچلر (B.S.) کمپیوٹر سائنس، National Cheng Kung University'],
      experience: ['کوریا کے امور کا شعبہ، Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'National Chengchi University سے اکاؤنٹنگ میں بیچلر اور ماسٹر پروگرام پورے کیے اور اس وقت ایک اکاؤنٹنگ دفتر کی قیادت کرتے ہیں۔',
        'کاروباری موکلوں کے لیے قانونی، ٹیکس اور مالی خطرات کے متحد تجزیے میں مدد کرتے ہیں۔',
      ],
      education: [
        'ماسٹر (M.A.) اکاؤنٹنگ، National Chengchi University',
        'بیچلر (B.A.) اکاؤنٹنگ، National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  fa: {
    'tseng-junwei': {
      intro: [
        'دفتر پرونده‌های شرکت‌ها و اشخاص را در تایوان می‌پذیرد و به انگلیسی، ژاپنی، کره‌ای و چینی کار می‌کند.',
        'او نمایندگی یک دانشجوی کره‌ای را در دعوای خسارت ناشی از آسیب در باشگاه ورزشی بر عهده داشت و حکم بدوی به پرداخت TWD 1.57M صادر شد.',
      ],
      education: [
        'کارشناسی ارشد (M.S.)، Institute of Finance, National Taiwan University',
        'کارشناسی (B.A.) با دو رشتهٔ حقوق و مالی، National Chengchi University',
        'دانشجوی تبادل در Kobe University و Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'بنیاد کمک حقوقی، شعبهٔ تایچونگ (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'پیش‌تر در وزارت آموزش، بخش امور حقوقی (Ministry of Education, Legal Affairs Division) کار کرده و بر اختلافات اداری و مدنی متمرکز بوده است.',
        'در پرونده‌های مربوط به دانشگاه‌ها، حقوق اعضای هیئت علمی و شکایت اداری سابقه دارد.',
      ],
      education: ['کارشناسی حقوق (LL.B.)، National Chung Hsing University'],
      experience: [
        'وزارت آموزش، بخش امور حقوقی (Ministry of Education, Legal Affairs Division)',
        'وکیل، Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'سال‌ها در چند دفتر وکالت به‌عنوان دستیار حقوقی ارشد کار کرده است، از جمله پشتیبانی دادرسی، امور حقوقی شرکت‌ها و سرمایه‌گذاری خارجی.',
        'محدودهٔ کار شامل پشتیبانی دادرسی، تأسیس شرکت، آیین تصویب سرمایه‌گذاری خارجی، درخواست پروانه و ارتباط میان کره و تایوان است.',
      ],
      education: ['کارشناسی حقوق (LL.B.)، Tunghai University'],
      experience: [
        'دستیار حقوقی ارشد، Boyin Law Firm',
        'دستیار حقوقی ارشد، Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'وقت ملاقات موکلان کره و ارتباط با آنان را هماهنگ می‌کند.',
        'با پشتوانهٔ علوم رایانه، ارتباط میان گروه‌ها را از راه سامانه‌های مستندسازی و گردش کار پشتیبانی می‌کند.',
      ],
      education: ['کارشناسی (B.S.) علوم رایانه، National Cheng Kung University'],
      experience: ['بخش امور کره، Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'دوره‌های کارشناسی و کارشناسی ارشد حسابداری را در National Chengchi University به پایان رسانده و اکنون دفتر حسابداری اداره می‌کند.',
        'تحلیل یکپارچهٔ خطر حقوقی، مالیاتی و مالی را برای موکلان شرکتی پشتیبانی می‌کند.',
      ],
      education: [
        'کارشناسی ارشد (M.A.) حسابداری، National Chengchi University',
        'کارشناسی (B.A.) حسابداری، National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  my: {
    'tseng-junwei': {
      intro: [
        'ရုံးသည် ထိုင်ဝမ်တွင် ကုမ္ပဏီနှင့် ပုဂ္ဂိုလ်ရေးကိစ္စများကို အင်္ဂလိပ်၊ ဂျပန်၊ ကိုရီးယားနှင့် တရုတ်ဘာသာဖြင့် ဆောင်ရွက်သည်။',
        'သူမသည် ကြံ့ခိုင်ရေးရုံတွင် ထိခိုက်ဒဏ်ရာရမှု လျော်ကြေးအမှုတွင် ကိုရီးယားကျောင်းသားတစ်ဦးကို ကိုယ်စားပြုခဲ့ပြီး၊ ထိုကျောင်းသားအတွက် ပထမအဆင့်တရားရုံးက လျော်ကြေး 1.57 သန်း ထိုင်ဝမ်ဒေါ်လာအသစ် (TWD 1.57M) ပေးရန် စီရင်ချက် ရယူခဲ့သည်။',
      ],
      education: [
        'မဟာသိပ္ပံဘွဲ့ (M.S.), Institute of Finance, National Taiwan University',
        'ဘွဲ့ (B.A.) ဥပဒေနှင့် ဘဏ္ဍာရေး နှစ်ဘာသာတွဲ, National Chengchi University',
        'Kobe University နှင့် Waseda University တွင် ဖလှယ်ကျောင်းသူ',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'ဥပဒေအကူအညီပေးရေးဖောင်ဒေးရှင်း၊ ထိုင်ချုံရုံးခွဲ',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'ယခင်က ပညာရေးဝန်ကြီးဌာန ဥပဒေရေးရာဌာနတွင် အုပ်ချုပ်ရေးနှင့် တရားမအငြင်းပွားမှုကို အလေးထား၍ တာဝန်ထမ်းဆောင်ခဲ့သည်။',
        'တက္ကသိုလ်များ၊ ဆရာအခွင့်အရေးနှင့် အုပ်ချုပ်ရေးတိုင်ကြားမှုများနှင့် ပတ်သက်သော ကိစ္စများတွင် အတွေ့အကြုံ ရှိသည်။',
      ],
      education: ['ဥပဒေဘွဲ့ (LL.B.), National Chung Hsing University'],
      experience: [
        'ပညာရေးဝန်ကြီးဌာန ဥပဒေရေးရာဌာန',
        'ရှေ့နေ, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'ဥပဒေရုံး အများအပြားတွင် အကြီးတန်း ဥပဒေအကူအဖြစ် နှစ်ပေါင်းများစွာ လုပ်ကိုင်ခဲ့ပြီး အမှုလိုက်ကူညီခြင်း၊ ကုမ္ပဏီဥပဒေနှင့် နိုင်ငံခြားရင်းနှီးမြှုပ်နှံမှုတို့ကို လွှမ်းခြုံသည်။',
        'အမှုလိုက်ကူညီခြင်း၊ ကုမ္ပဏီတည်ထောင်ခြင်း၊ နိုင်ငံခြားရင်းနှီးမြှုပ်နှံမှု ခွင့်ပြုချက်၊ လိုင်စင်လျှောက်ထားခြင်းနှင့် ကိုရီးယား–ထိုင်ဝမ် ဆက်သွယ်ရေးကို ကူညီသည်။',
      ],
      education: ['ဥပဒေဘွဲ့ (LL.B.), Tunghai University'],
      experience: [
        'အကြီးတန်း ဥပဒေအကူ, Boyin Law Firm',
        'အကြီးတန်း ဥပဒေအကူ, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'ကိုရီးယားအမှုသည်များအတွက် တိုင်ပင်ချိန်းဆိုမှုနှင့် ဆက်သွယ်ရေးကို ညှိနှိုင်းသည်။',
        'ကွန်ပျူတာသိပ္ပံ နောက်ခံအပေါ် အခြေခံ၍ စာရွက်စာတမ်းစနစ်နှင့် လုပ်ငန်းစဉ်များဖြင့် အဖွဲ့များအကြား ဆက်သွယ်ရေးကို ကူညီသည်။',
      ],
      education: ['သိပ္ပံဘွဲ့ (B.S.) ကွန်ပျူတာသိပ္ပံ, National Cheng Kung University'],
      experience: ['ကိုရီးယားလုပ်ငန်းဌာန, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'National Chengchi University တွင် စာရင်းကိုင် ဘွဲ့နှင့် မဟာဘွဲ့ အစီအစဉ်များကို ပြီးဆုံးခဲ့ပြီး လက်ရှိတွင် စာရင်းကိုင်ရုံးတစ်ခုကို ဦးဆောင်သည်။',
        'ကုမ္ပဏီအမှုသည်များအတွက် ဥပဒေ၊ အခွန်နှင့် ငွေကြေးအန္တရာယ်ကို ပေါင်းစပ် သုံးသပ်ရန် ကူညီသည်။',
      ],
      education: [
        'မဟာဝိဇ္ဇာဘွဲ့ (M.A.) စာရင်းကိုင်, National Chengchi University',
        'ဘွဲ့ (B.A.) စာရင်းကိုင်, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  ta: {
    'tseng-junwei': {
      intro: [
        'அலுவலகம் தைவானில் நிறுவனங்கள் மற்றும் தனிநபர்களின் வழக்குகளை ஆங்கிலம், ஜப்பானியம், கொரிய மொழி மற்றும் சீனம் ஆகியவற்றில் கையாள்கிறது.',
        'உடற்பயிற்சிக் கூடத்தில் ஏற்பட்ட காயத்திற்கான இழப்பீட்டு வழக்கில் ஒரு கொரிய மாணவரை அவர் பிரதிநிதித்துவப்படுத்தி, முதல் நிலை நீதிமன்றத்தில் TWD 1.57M வழங்கும் தீர்ப்பைப் பெற்றார்.',
      ],
      education: [
        'முதுகலை (M.S.), Institute of Finance, National Taiwan University',
        'இளங்கலை (B.A.) சட்டமும் நிதியும் இரட்டை முதன்மைப் பாடமாக, National Chengchi University',
        'Kobe University மற்றும் Waseda University-இல் பரிமாற்ற மாணவி',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'சட்ட உதவி அறக்கட்டளை, தைச்சுங் கிளை',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'முன்பு கல்வி அமைச்சகத்தின் சட்ட விவகாரப் பிரிவில் பணி செய்தார்; கவனம் நிர்வாக மற்றும் உரிமையியல் வழக்குகளில்.',
        'பல்கலைக்கழகங்கள், கற்பித்தல் பணியாளர்களின் உரிமைகள் மற்றும் நிர்வாக மேல்முறையீடுகள் தொடர்பான வழக்குகளில் அனுபவம்.',
      ],
      education: ['சட்ட இளங்கலை (LL.B.), National Chung Hsing University'],
      experience: [
        'கல்வி அமைச்சகம், சட்ட விவகாரப் பிரிவு',
        'வழக்கறிஞர், Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'பல அலுவலகங்களில் மூத்த சட்ட உதவியாளராக நீண்ட காலம் பணி செய்தவர்; நடைமுறை உதவி, நிறுவனச் சட்டம் மற்றும் வெளிநாட்டு முதலீட்டுக்குப் பொறுப்பு.',
        'நடவடிக்கைகள், நிறுவனம் அமைத்தல், வெளிநாட்டு முதலீட்டு அனுமதி, உரிம விண்ணப்பங்கள் மற்றும் கொரியா–தைவான் பரிமாற்றத்தில் உதவி.',
      ],
      education: ['சட்ட இளங்கலை (LL.B.), Tunghai University'],
      experience: [
        'மூத்த சட்ட உதவியாளர், Boyin Law Firm',
        'மூத்த சட்ட உதவியாளர், Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'கொரியாவிலிருந்து வரும் வாடிக்கையாளர்களின் ஆலோசனை நேரத்தையும் தகவல் தொடர்பையும் ஒருங்கிணைக்கிறார்.',
        'கணினி அறிவியல் அடிப்படையில் ஆவண அமைப்புகள் மற்றும் பணி ஓட்டம் மூலம் பிரிவுகளுக்கு இடையே பரிமாற்றத்தை ஆதரிக்கிறார்.',
      ],
      education: ['இளங்கலை (B.S.) கணினி அறிவியல், National Cheng Kung University'],
      experience: ['கொரியா செயல்பாட்டுப் பிரிவு, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'National Chengchi University-இல் கணக்கியல் இளங்கலை மற்றும் முதுகலைத் திட்டங்களை முடித்து, தற்போது ஒரு கணக்கியல் அலுவலகத்தை நடத்துகிறார்.',
        'நிறுவன வாடிக்கையாளர்களுக்குச் சட்ட, வரி மற்றும் நிதி அபாயங்களின் ஒருங்கிணைந்த பகுப்பாய்வை ஆதரிக்கிறார்.',
      ],
      education: [
        'முதுகலை (M.A.) கணக்கியல், National Chengchi University',
        'இளங்கலை (B.A.) கணக்கியல், National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  ne: {
    'tseng-junwei': {
      intro: [
        'फर्म ताइवानमा उद्यम र व्यक्तिका मुद्दा अङ्ग्रेजी, जापानी, कोरियाली र चिनियाँमा हेर्छ।',
        'उहाँले जिममा लागेको चोटको क्षतिपूर्ति दाबीमा कोरियाली विद्यार्थीको प्रतिनिधित्व गर्नुभयो र प्रथम तहको अदालतबाट TWD 1.57M को फैसला दिलाउनुभयो।',
      ],
      education: [
        'स्नातकोत्तर (M.S.), Institute of Finance, National Taiwan University',
        'स्नातक (B.A.) कानुन र वित्तको दोहोरो अध्ययनसहित, National Chengchi University',
        'Kobe University र Waseda University मा विनिमय छात्रा',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'कानुनी सहायता प्रतिष्ठान, ताइचुङ शाखा',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'पहिले शिक्षा मन्त्रालयको कानुनी मामिला विभागमा काम गर्नुभयो, प्रशासनिक र देवानी मुद्दामा केन्द्रित रहेर।',
        'विश्वविद्यालय, शिक्षण कर्मचारीका अधिकार र प्रशासनिक पुनरावेदनसँग जोडिएका मुद्दाको अनुभव।',
      ],
      education: ['कानुन स्नातक (LL.B.), National Chung Hsing University'],
      experience: [
        'शिक्षा मन्त्रालय, कानुनी मामिला विभाग',
        'अधिवक्ता, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'धेरै फर्ममा वरिष्ठ कानुनी सहायकका रूपमा लामो अनुभव छ; काम प्रक्रिया सहयोग, कम्पनी कानुन र विदेशी लगानीमा केन्द्रित छ।',
        'कार्यवाही, कम्पनी स्थापना, विदेशी लगानी अनुमति, इजाजत आवेदन तथा कोरिया र ताइवानबीचको आदानप्रदानमा सहयोग।',
      ],
      education: ['कानुन स्नातक (LL.B.), Tunghai University'],
      experience: [
        'वरिष्ठ कानुनी सहायक, Boyin Law Firm',
        'वरिष्ठ कानुनी सहायक, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'कोरियाबाट आएका पक्षकारको परामर्श समय र सञ्चार समन्वय गर्छन्।',
        'कम्प्युटर विज्ञान पढेका आधारमा कागजात प्रणाली र कार्यप्रवाहमार्फत विभागहरूबीचको आदानप्रदानमा सहयोग गर्छन्।',
      ],
      education: ['स्नातक (B.S.) कम्प्युटर विज्ञान, National Cheng Kung University'],
      experience: ['कोरिया सञ्चालन विभाग, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'National Chengchi University बाट लेखामा स्नातक र स्नातकोत्तर कार्यक्रम पूरा गरी हाल एउटा चार्टर्ड एकाउन्टेन्ट फर्मको नेतृत्व गर्छन्।',
        'उद्यमी पक्षकारका लागि कानुनी, कर र वित्तीय जोखिमको एकीकृत विश्लेषणमा सहयोग गर्छन्।',
      ],
      education: [
        'स्नातकोत्तर (M.A.) लेखा, National Chengchi University',
        'स्नातक (B.A.) लेखा, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  km: {
    'tseng-junwei': {
      intro: [
        'ការិយាល័យទទួលរឿងរបស់សហគ្រាស និងបុគ្គលនៅតៃវ៉ាន់ ជាភាសាអង់គ្លេស ភាសាជប៉ុន ភាសាកូរ៉េ និងភាសាចិន',
        'លោកស្រីធ្លាប់តំណាងឱ្យនិស្សិតជនជាតិកូរ៉េក្នុងរឿងសំណងពីរបួសនៅកន្លែងហាត់ប្រាណ ហើយសាលាដំបូងបានកាត់ឱ្យនិស្សិតនោះទទួលបានសំណង TWD 1.57M',
      ],
      education: [
        'បរិញ្ញាបត្រជាន់ខ្ពស់ (M.S.) វិទ្យាស្ថានហិរញ្ញវត្ថុ សាកលវិទ្យាល័យជាតិតៃវ៉ាន់ (Institute of Finance, National Taiwan University)',
        'បរិញ្ញាបត្រ (B.A.) ពីរសាខា ច្បាប់ និងហិរញ្ញវត្ថុ, National Chengchi University',
        'និស្សិតស្រីផ្លាស់ប្ដូរ នៅ Kobe University និង Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'មូលនិធិជំនួយផ្លូវច្បាប់ សាខាតៃជុង (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'ធ្លាប់ធ្វើការនៅនាយកដ្ឋានកិច្ចការផ្លូវច្បាប់ ក្រសួងអប់រំ (Ministry of Education, Legal Affairs Division) ផ្ដោតលើវិវាទរដ្ឋបាល និងរដ្ឋប្បវេណី',
        'មានបទពិសោធន៍ក្នុងរឿងសាកលវិទ្យាល័យ សិទ្ធិគ្រូបង្រៀន និងពាក្យបណ្ដឹងរដ្ឋបាល',
      ],
      education: ['បរិញ្ញាបត្រច្បាប់ (LL.B.), National Chung Hsing University'],
      experience: [
        'នាយកដ្ឋានកិច្ចការផ្លូវច្បាប់ ក្រសួងអប់រំ (Ministry of Education, Legal Affairs Division)',
        'មេធាវី, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'ជំនួយការផ្លូវច្បាប់ជាន់ខ្ពស់នៅការិយាល័យមេធាវីច្រើនកន្លែង ទទួលបន្ទុកជួយសំណុំរឿង ច្បាប់សហគ្រាស និងវិនិយោគបរទេស',
        'ទទួលបន្ទុកជួយសំណុំរឿង ការបង្កើតក្រុមហ៊ុន ការអនុម័តវិនិយោគបរទេស ការដាក់ពាក្យអាជ្ញាប័ណ្ណ និងការទំនាក់ទំនងរវាងកូរ៉េ និងតៃវ៉ាន់',
      ],
      education: ['បរិញ្ញាបត្រច្បាប់ (LL.B.), Tunghai University'],
      experience: [
        'ជំនួយការផ្លូវច្បាប់ជាន់ខ្ពស់, Boyin Law Firm',
        'ជំនួយការផ្លូវច្បាប់ជាន់ខ្ពស់, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'សម្របសម្រួលការណាត់ពិគ្រោះយោបល់ និងការទំនាក់ទំនងសម្រាប់អតិថិជនពីកូរ៉េ',
        'ជួយសម្របសម្រួលការទំនាក់ទំនងរវាងក្រុមតាមប្រព័ន្ធឯកសារ និងលំហូរការងារ ដោយផ្អែកលើមូលដ្ឋានវិទ្យាសាស្ដ្រកុំព្យូទ័រ',
      ],
      education: ['បរិញ្ញាបត្រវិទ្យាសាស្ដ្រ (B.S.) វិទ្យាសាស្ដ្រកុំព្យូទ័រ, National Cheng Kung University'],
      experience: ['ក្រុមប្រតិបត្ដិកូរ៉េ, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'បានបញ្ចប់កម្មវិធីបរិញ្ញាបត្រ និងបរិញ្ញាបត្រជាន់ខ្ពស់ផ្នែកគណនេយ្យនៅ National Chengchi University ហើយបច្ចុប្បន្នដឹកនាំការិយាល័យគណនេយ្យករសាធារណៈមួយ',
        'ជួយការវិភាគហានិភ័យផ្លូវច្បាប់ ពន្ធ និងហិរញ្ញវត្ថុជារួមសម្រាប់អតិថិជនសហគ្រាស',
      ],
      education: [
        'បរិញ្ញាបត្រជាន់ខ្ពស់ (M.A.) គណនេយ្យ, National Chengchi University',
        'បរិញ្ញាបត្រ (B.A.) គណនេយ្យ, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  mn: {
    'tseng-junwei': {
      intro: [
        'Фирм Тайвань дахь компани болон хувь хүний хэргийг англи, япон, солонгос, хятад хэлээр хөтөлнө.',
        'Тэрбээр спорт зааланд бэртсэн Солонгосын оюутныг төлөөлж, хохирол нөхөн төлүүлэх нэхэмжлэлээр TWD 1.57M-ийн нэгдүгээр шатны шийдвэр гаргуулсан.',
      ],
      education: [
        'Магистр (M.S.), Institute of Finance, National Taiwan University (Санхүүгийн хүрээлэн)',
        'Хууль, санхүүгийн хоёр мэргэжлээр бакалавр (B.A.), National Chengchi University',
        'Kobe University болон Waseda University-д солилцооны суралцагч',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Хууль зүйн туслалцааны сангийн Тайжун салбар (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Өмнө нь Боловсролын яамны хуулийн асуудал эрхэлсэн хэлтэст (Ministry of Education, Legal Affairs Division) захиргааны болон иргэний хэрэгт төвлөрч ажилласан.',
        'Их сургуулийн хэрэг, багш нарын эрх, захиргааны гомдолд туршлагатай.',
      ],
      education: ['Хуулийн бакалавр (LL.B.), National Chung Hsing University'],
      experience: [
        'Боловсролын яамны хуулийн асуудал эрхэлсэн хэлтэс (Ministry of Education, Legal Affairs Division)',
        'Өмгөөлөгч, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Олон жил хэд хэдэн фирмд ахлах хуулийн туслахаар ажилласан хуулийн туслах; шүүхийн дэмжлэг, корпорацийн эрх зүй, гадаадын хөрөнгө оруулалтыг хариуцна.',
        'Шүүхийн журам, компани байгуулах, гадаадын хөрөнгө оруулалтын зөвшөөрөл, лицензийн өргөдөл, Солонгос–Тайванийн харилцааг дэмжинэ.',
      ],
      education: ['Хуулийн бакалавр (LL.B.), Tunghai University'],
      experience: [
        'Ахлах хуулийн туслах, Boyin Law Firm',
        'Ахлах хуулийн туслах, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Солонгосоос ирсэн үйлчлүүлэгчдийн зөвлөгөөний цаг, харилцааг зохицуулна.',
        'Мэдээллийн технологийн мэдлэгтээ тулгуурлан баримтын систем, ажлын урсгалаар нэгж хоорондын харилцааг дэмжинэ.',
      ],
      education: ['Мэдээллийн технологийн бакалавр (B.S.), National Cheng Kung University'],
      experience: ['Солонгосын үйл ажиллагаа хариуцсан менежер, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'National Chengchi University-д нягтлан бодох бүртгэлийн бакалавр, магистрын хөтөлбөрийг төгсөж, одоо нягтлан бодох бүртгэлийн фирм удирдана.',
        'Корпорацийн үйлчлүүлэгчдэд эрх зүй, татвар, санхүүгийн эрсдэлийн цогц шинжилгээг дэмжинэ.',
      ],
      education: [
        'Нягтлан бодох бүртгэлийн магистр (M.A.), National Chengchi University',
        'Нягтлан бодох бүртгэлийн бакалавр (B.A.), National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  sk: {
    'tseng-junwei': {
      intro: [
        'Kancelária vedie veci podnikov a súkromných osôb na Taiwane v angličtine, japončine, kórejčine a čínštine.',
        'Zastupovala kórejského študenta v nároku na náhradu škody za úraz v posilňovni a dosiahla rozsudok prvého stupňa vo výške TWD 1.57M.',
      ],
      education: [
        'Magisterský titul (M.S.), Institute of Finance, National Taiwan University',
        'Bakalársky titul (B.A.) v dvojodborovom programe práva a financií, National Chengchi University',
        'Výmenné štúdium na Kobe University a Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Nadácia právnej pomoci, pobočka v Taichungu',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Predtým pôsobil na ministerstve školstva, v odbore právnych vecí, so zameraním na správne a občianskoprávne veci.',
        'Skúsenosť s vecami univerzít, práv pedagógov a správnych odvolaní.',
      ],
      education: [
        'Bakalár práv (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Ministerstvo školstva, odbor právnych vecí',
        'Advokát, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Právna asistentka s dlhoročnou praxou; predtým vedúca právna asistentka vo viacerých advokátskych kanceláriách, so zameraním na procesnú podporu, korporátnu agendu a zahraničné investície.',
        'Podpora v súdnych konaniach, pri zakladaní spoločností, pri povoleniach zahraničných investícií, pri žiadostiach o licencie a pri komunikácii medzi Kóreou a Taiwanom.',
      ],
      education: [
        'Bakalár práv (LL.B.), Tunghai University',
      ],
      experience: [
        'Vedúca právna asistentka, Boyin Law Firm',
        'Vedúca právna asistentka, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinuje termíny porád a komunikáciu pre klientov z Kórey.',
        'Na základe vzdelania v informatike podporuje výmenu medzi regiónmi pomocou systémov dokumentov a pracovných postupov.',
      ],
      education: [
        'Bakalársky titul (B.S.) v informatike, National Cheng Kung University',
      ],
      experience: [
        'Úsek prevádzky pre Kóreu, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Absolvoval bakalársky a magisterský program účtovníctva na National Chengchi University a teraz vedie audítorskú kanceláriu.',
        'Podporuje integrovanú analýzu právnych, daňových a finančných rizík pre firemných klientov.',
      ],
      education: [
        'Magister (M.A.) v účtovníctve, National Chengchi University',
        'Bakalár (B.A.) v účtovníctve, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  bg: {
    'tseng-junwei': {
      intro: [
        'Кантората води дела на дружества и частни лица в Тайван на английски, японски, корейски и китайски.',
        'Представлявала е корейски студент в иск за обезщетение поради травма във фитнес зала и е постигнала първоинстанционно решение за TWD 1.57M.',
      ],
      education: [
        'Магистър (M.S.), Институт по финанси, Национален тайвански университет (National Taiwan University)',
        'Бакалавър (B.A.) с две специалности — право и финанси, National Chengchi University',
        'Студентка по обмен в Kobe University и Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Фондация за правна помощ, клон Тайджун',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Преди това в Министерството на образованието, отдел „Правни въпроси“, с акцент върху административни и граждански дела.',
        'Опит в дела на висши училища, права на преподаватели и административни жалби.',
      ],
      education: ['Бакалавър по право (LL.B.), National Chung Hsing University'],
      experience: [
        'Министерство на образованието, отдел „Правни въпроси“',
        'Адвокат, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Правен сътрудник с дългогодишна работа като старши правен сътрудник в няколко кантори, който отговаря за процесуална подкрепа, дружествено право и чуждестранни инвестиции.',
        'Подкрепа при процедури, учредяване на дружества, разрешения за чуждестранни инвестиции, заявки за лицензи и обмена между Корея и Тайван.',
      ],
      education: ['Бакалавър по право (LL.B.), Tunghai University'],
      experience: [
        'Старши правен сътрудник, Boyin Law Firm',
        'Старши правен сътрудник, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Координира часовете за консултация и общуването за клиенти от Корея.',
        'Подпомага обмена между звената чрез системи за документи и работни процеси, въз основа на образованието си по информатика.',
      ],
      education: ['Бакалавър (B.S.) по информатика, National Cheng Kung University'],
      experience: ['Ръководство на дейността за Корея, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Завършил е бакалавърска и магистърска степен по счетоводство в National Chengchi University и понастоящем ръководи счетоводна кантора.',
        'Подпомага комплексен анализ на правни, данъчни и финансови рискове за корпоративни клиенти.',
      ],
      education: [
        'Магистър (M.A.) по счетоводство, National Chengchi University',
        'Бакалавър (B.A.) по счетоводство, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  hr: {
    'tseng-junwei': {
      intro: [
        'Ured vodi predmete poduzeća i privatnih osoba na Tajvanu na engleskom, japanskom, korejskom i kineskom.',
        'Zastupala je korejskog studenta u zahtjevu za naknadu štete zbog ozljede u teretani i ishodila je presudu prvog stupnja u iznosu TWD 1.57M.',
      ],
      education: [
        'Magistra (M.S.), Institute of Finance, National Taiwan University',
        'Prvostupnica (B.A.) u dvojnom programu prava i financija, National Chengchi University',
        'Razmjenska studentica na Kobe University i Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Zaklada za pravnu pomoć, podružnica u Taichungu (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Ranije u odjelu za pravne poslove Ministarstva obrazovanja (Ministry of Education, Legal Affairs Division), s naglaskom na upravne i građanskopravne predmete.',
        'Iskustvo s predmetima sveučilišta, prava nastavnika i upravnih žalbi.',
      ],
      education: [
        'Prvostupnik prava (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Odjel za pravne poslove Ministarstva obrazovanja (Ministry of Education, Legal Affairs Division)',
        'Odvjetnik, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Pravni asistent s dugogodišnjim iskustvom; ranije viši pravni asistent u više odvjetničkih ureda, s naglaskom na postupovnu potporu, korporativne predmete i strana ulaganja.',
        'Potpora u sudskim postupcima, pri osnivanju društava, kod dozvola za strana ulaganja, kod zahtjeva za licence i u komunikaciji između Koreje i Tajvana.',
      ],
      education: [
        'Prvostupnik prava (LL.B.), Tunghai University',
      ],
      experience: [
        'Viši pravni asistent, Boyin Law Firm',
        'Viši pravni asistent, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinira termine savjetovanja i komunikaciju za klijente iz Koreje.',
        'Na temelju obrazovanja iz informatike podržava razmjenu među područjima putem sustava dokumenata i radnih postupaka.',
      ],
      education: [
        'Prvostupnik (B.S.) informatike, National Cheng Kung University',
      ],
      experience: [
        'Područje korejskog poslovanja, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Završio je preddiplomski i diplomski program računovodstva na National Chengchi University i sada vodi računovodstveni ured.',
        'Podržava integriranu analizu pravnih, poreznih i financijskih rizika za korporativne klijente.',
      ],
      education: [
        'Magistar (M.A.) računovodstva, National Chengchi University',
        'Prvostupnik (B.A.) računovodstva, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  sr: {
    'tseng-junwei': {
      intro: [
        'Kancelarija vodi stvari preduzeća i privatnih lica na Tajvanu na engleskom, japanskom, korejskom i kineskom.',
        'Zastupala je korejskog studenta u zahtevu za naknadu štete zbog povrede u teretani i postigla presudu prvog stepena u iznosu TWD 1.57M.',
      ],
      education: [
        'Magistarka nauka (M.S.), Institut za finansije, National Taiwan University',
        'Diplomirala (B.A.) na dvostrukom programu prava i finansija, National Chengchi University',
        'Studentkinja na razmeni na Kobe University i Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Fondacija pravne pomoći, podružnica u Taichungu',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Ranije u Ministarstvu prosvete, odeljenju za pravne poslove, sa težištem na upravnim i građanskim stvarima.',
        'Iskustvo u stvarima univerziteta, prava nastavnika i upravnih žalbi.',
      ],
      education: [
        'Diploma prava (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Ministarstvo prosvete, odeljenje za pravne poslove',
        'Advokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Pravni asistent sa dugogodišnjim radom; ranije stariji pravni asistent u više advokatskih kancelarija, sa težištem na procesnoj podršci, korporativnoj oblasti i stranim investicijama.',
        'Podrška u sudskim postupcima, pri osnivanju društava, kod dozvola za strane investicije, kod zahteva za licence i u komunikaciji između Koreje i Tajvana.',
      ],
      education: [
        'Diploma prava (LL.B.), Tunghai University',
      ],
      experience: [
        'Stariji pravni asistent, Boyin Law Firm',
        'Stariji pravni asistent, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinira termine konsultacija i komunikaciju za klijente iz Koreje.',
        'Podržava međuregionalnu razmenu preko sistema dokumenata i tokova rada, na osnovu studija informatike.',
      ],
      education: [
        'Diploma (B.S.) informatike, National Cheng Kung University',
      ],
      experience: [
        'Odeljenje korejskog poslovanja, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Završio je osnovne i master programe računovodstva na National Chengchi University i sada vodi računovodstvenu kancelariju.',
        'Podržava integrisanu analizu pravnih, poreskih i finansijskih rizika za korporativne klijente.',
      ],
      education: [
        'Master (M.A.) računovodstva, National Chengchi University',
        'Diploma (B.A.) računovodstva, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  sl: {
    'tseng-junwei': {
      intro: [
        'Pisarna vodi zadeve podjetij in zasebnih oseb na Tajvanu v angleščini, japonščini, korejščini in kitajščini.',
        'Zastopala je korejskega študenta v odškodninskem zahtevku zaradi poškodbe v fitnesu in dosegla sodbo prve stopnje v višini TWD 1.57M.',
      ],
      education: [
        'Magistrica znanosti (M.S.), Institute of Finance, National Taiwan University',
        'Univerzitetna diploma (B.A.) dvopredmetnega študija prava in financ, National Chengchi University',
        'Izmenjava na Kobe University in Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Fundacija za pravno pomoč, podružnica Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Prej v oddelku za pravne zadeve Ministrstva za izobraževanje, s poudarkom na upravnih in civilnih zadevah.',
        'Izkušnje z zadevami univerz, pravicami pedagoškega osebja in upravnimi pritožbami.',
      ],
      education: [
        'Diplomirani pravnik (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Oddelek za pravne zadeve, Ministrstvo za izobraževanje (Ministry of Education, Legal Affairs Division)',
        'Odvetnik, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Pravna asistentka z dolgoletno prakso; prej višja pravna asistentka v več odvetniških pisarnah, s poudarkom na procesni podpori, korporativnem področju in tujih naložbah.',
        'Podpora v sodnih postopkih, pri ustanavljanju družb, pri dovoljenjih tujih naložb, pri prošnjah za dovoljenja in pri sporazumevanju med Korejo in Tajvanom.',
      ],
      education: [
        'Diplomirana pravnica (LL.B.), Tunghai University',
      ],
      experience: [
        'Višja pravna asistentka, Boyin Law Firm',
        'Višja pravna asistentka, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Usklajuje termine posvetov in sporazumevanje za stranke iz Koreje.',
        'Podpira izmenjavo med ekipami s sistemi za dokumente in potek dela; izhodišče je izobrazba iz informatike.',
      ],
      education: [
        'Univerzitetna diploma (B.S.) iz informatike, National Cheng Kung University',
      ],
      experience: [
        'Oddelek korejskega poslovanja, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Diplomiral je iz računovodstva in magistriral na National Chengchi University ter zdaj vodi računovodsko pisarno.',
        'Podpira celostno analizo pravnih, davčnih in finančnih tveganj za poslovne stranke.',
      ],
      education: [
        'Magister (M.A.) iz računovodstva, National Chengchi University',
        'Univerzitetna diploma (B.A.) iz računovodstva, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  lt: {
    'tseng-junwei': {
      intro: [
        'Kontora veda įmonių ir privačių asmenų bylas Taivane anglų, japonų, korėjiečių ir kinų kalbomis.',
        'Atstovavo korėjiečių studentui ieškinyje dėl žalos atlyginimo už traumą sporto salėje ir pasiekė pirmosios instancijos sprendimą priteisti TWD 1.57M.',
      ],
      education: [
        'Magistrė (M.S.), Institute of Finance, National Taiwan University',
        'Teisės ir finansų dvigubos specialybės bakalaurė (B.A.), National Chengchi University',
        'Mainų studijos Kobe University ir Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Teisinės pagalbos fondas, Taidžongo skyrius (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Anksčiau dirbo Švietimo ministerijos Teisės skyriuje (Ministry of Education, Legal Affairs Division), daugiausia administracinėse ir civilinėse bylose.',
        'Patirtis universitetų bylose, pedagogų teisėse ir administraciniuose skunduose.',
      ],
      education: [
        'Teisės bakalauras (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Švietimo ministerijos Teisės skyrius (Ministry of Education, Legal Affairs Division)',
        'Advokatas, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Teisininko padėjėjas su ilgamete patirtimi; anksčiau vyresnysis teisininko padėjėjas keliose advokatų kontorose, daugiausia procesinei pagalbai, bendrovių teisės klausimams ir užsienio investicijoms.',
        'Pagalba teismo procesuose, steigiant įmones, užsienio investicijų leidimuose, licencijų prašymuose ir komunikacijoje tarp Korėjos ir Taivano.',
      ],
      education: [
        'Teisės bakalauras (LL.B.), Tunghai University',
      ],
      experience: [
        'Vyresnysis teisininko padėjėjas, Boyin Law Firm',
        'Vyresnysis teisininko padėjėjas, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinuoja konsultacijų terminus ir komunikaciją klientams iš Korėjos.',
        'Koordinuoja dokumentų ir darbo eigų mainus tarp padalinių, remdamasis informatikos išsilavinimu.',
      ],
      education: [
        'Bakalauras (B.S.) informatikoje, National Cheng Kung University',
      ],
      experience: [
        'Korėjos operacijų padalinys, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Baigė bakalauro ir magistro apskaitos studijas National Chengchi University ir dabar vadovauja apskaitos kontorai.',
        'Rengia integruotą teisinės, mokestinės ir finansinės rizikos analizę įmonių klientams.',
      ],
      education: [
        'Magistras (M.A.) apskaitoje, National Chengchi University',
        'Bakalauras (B.A.) apskaitoje, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  lv: {
    'tseng-junwei': {
      intro: [
        'Birojs ved uzņēmumu un privātpersonu lietas Taivānā angļu, japāņu, korejiešu un ķīniešu valodā.',
        'Viņa pārstāvēja korejiešu studentu zaudējumu atlīdzības prasībā par traumu sporta zālē un ieguva pirmās instances spriedumu TWD 1.57M apmērā.',
      ],
      education: [
        'Maģistre (M.S.), Institute of Finance, National Taiwan University',
        'Bakalaura grāds (B.A.) tiesību un finanšu dubultstudijās, National Chengchi University',
        'Apmaiņas studijas Kobe University un Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Juridiskās palīdzības fonda Taidžunas filiāle',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Iepriekš Izglītības ministrijas Juridisko lietu nodaļā, ar uzsvaru uz administratīvajām un civillietām.',
        'Pieredze lietās par universitātēm, pedagogu tiesībām un administratīvajām sūdzībām.',
      ],
      education: [
        'Tiesību bakalaurs (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Izglītības ministrijas Juridisko lietu nodaļa',
        'Advokāts, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Jurista palīdze ar ilggadēju praksi; iepriekš vecākā jurista palīdze vairākos advokātu birojos, ar uzsvaru uz procesuālo atbalstu, sabiedrību tiesībām un ārvalstu ieguldījumiem.',
        'Atbalsts tiesvedībā, sabiedrību dibināšanā, ārvalstu ieguldījumu atļaujās, licences pieteikumos un saziņā starp Koreju un Taivānu.',
      ],
      education: [
        'Tiesību bakalaura grāds (LL.B.), Tunghai University',
      ],
      experience: [
        'Vecākā jurista palīdze, Boyin Law Firm',
        'Vecākā jurista palīdze, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinē konsultāciju laikus un saziņu klientiem no Korejas.',
        'Atbalsta apmaiņu starp darbības jomām, izmantojot dokumentu sistēmas un darba procesus, un balstās uz informātikas izglītību.',
      ],
      education: [
        'Bakalaurs (B.S.) informātikā, National Cheng Kung University',
      ],
      experience: [
        'Korejas darba virziens, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Ieguvis bakalaura un maģistra grādu grāmatvedībā National Chengchi University un tagad vada revīzijas biroju.',
        'Palīdz uzņēmumu klientiem kopā izvērtēt tiesiskos, nodokļu un finanšu riskus.',
      ],
      education: [
        'Maģistrs (M.A.) grāmatvedībā, National Chengchi University',
        'Bakalaurs (B.A.) grāmatvedībā, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  et: {
    'tseng-junwei': {
      intro: [
        'Büroo tegeleb Taiwanis ettevõtete ja eraisikute asjadega inglise, jaapani, korea ja hiina keeles.',
        'Ta esindas korea üliõpilast treeningsaalis saadud vigastuse kahjuhüvitisnõudes ja esimese astme kohus mõistis välja TWD 1.57M.',
      ],
      education: [
        'Magistrikraad (M.S.), National Taiwan University rahanduse instituut',
        'Bakalaureusekraad (B.A.), õigusteaduse ja rahanduse topelteriala, National Chengchi University',
        'Vahetusüliõpilane Kobe University’s ja Waseda University’s',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Õigusabi sihtasutus, Taichungi filiaal',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Varem Haridusministeeriumi õigusosakonnas, rõhuasetusega haldus- ja tsiviilasjadele.',
        'Kogemus ülikoole, õppejõudude õigusi ja halduskaebusi puudutavates asjades.',
      ],
      education: [
        'Õigusteaduse bakalaureus (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Haridusministeeriumi õigusosakond',
        'Advokaat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Jurist-assistent pikaajalise kogemusega; varem vanemjurist-assistent mitmes advokaadibüroos, rõhuasetusega protsessitoele, ühinguõigusele ja välisinvesteeringutele.',
        'Tugi kohtumenetlustes, äriühingu asutamisel, välisinvesteeringute lubades, loataotlustes ning Korea ja Taiwani suhtluses.',
      ],
      education: [
        'Õigusteaduse bakalaureus (LL.B.), Tunghai University',
      ],
      experience: [
        'Vanemjurist-assistent, Boyin Law Firm',
        'Vanemjurist-assistent, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordineerib nõustamisaegu ja suhtlust Koreast tulevatele klientidele.',
        'Toetab üksustevahelist koostööd dokumendisüsteemide ja töövoogude kaudu; taust on arvutiteadus.',
      ],
      education: [
        'Bakalaureus (B.S.) arvutiteaduses, National Cheng Kung University',
      ],
      experience: [
        'Korea tegevuse üksus, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Lõpetas bakalaureuse- ja magistriprogrammi raamatupidamises National Chengchi University’s ja juhib nüüd audiitorbürood.',
        'Toetab ettevõtteklientide õiguslike, maksu- ja finantsriskide koondhindamist.',
      ],
      education: [
        'Magister (M.A.) raamatupidamises, National Chengchi University',
        'Bakalaureus (B.A.) raamatupidamises, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
  ca: {
    'tseng-junwei': {
      intro: [
        'El despatx atén assumptes d’empreses i de particulars a Taiwan en anglès, japonès, coreà i xinès.',
        'Va representar un estudiant coreà en una reclamació de danys per una lesió en un gimnàs i va obtenir una sentència de primera instància de TWD 1.57M (1,57 milions de dòlars taiwanesos).',
      ],
      education: [
        'Màster (M.S.), Institute of Finance, National Taiwan University',
        'Grau (B.A.), doble grau en Dret i Finances, National Chengchi University',
        'Estudiant d’intercanvi a Kobe University i Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Fundació d’Assistència Jurídica, sucursal de Taichung (Legal Aid Foundation, Taichung Branch)',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Va treballar abans a la Divisió d’Afers Jurídics del Ministeri d’Educació (Ministry of Education, Legal Affairs Division), centrat en conflictes administratius i civils.',
        'Té experiència en assumptes d’universitats, drets del professorat i reclamacions administratives.',
      ],
      education: ['Grau en Dret (LL.B.), National Chung Hsing University'],
      experience: [
        'Divisió d’Afers Jurídics del Ministeri d’Educació (Ministry of Education, Legal Affairs Division)',
        'Advocat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Ajudant jurídic sènior, amb anys d’experiència en diversos despatxos, a càrrec del suport processal, del dret d’empresa i de la inversió estrangera.',
        'Dona suport a litigis, constitució de societats, tràmits d’aprovació d’inversió estrangera, sol·licituds de llicència i l’intercanvi entre Corea i Taiwan.',
      ],
      education: ['Grau en Dret (LL.B.), Tunghai University'],
      experience: [
        'Ajudant jurídic sènior, Boyin Law Firm',
        'Ajudant jurídic sènior, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Coordina les cites de consulta i la comunicació per a clients de Corea.',
        'Dona suport a l’intercanvi entre equips mitjançant sistemes de documentació i fluxos de treball, amb formació en informàtica.',
      ],
      education: ['Grau (B.S.) en Informàtica, National Cheng Kung University'],
      experience: ['Àrea d’operacions de Corea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Va cursar el grau i el màster en Comptabilitat a la National Chengchi University i dirigeix actualment un despatx de comptabilitat.',
        'Dona suport a l’anàlisi integrada de riscos jurídics, fiscals i financers per a clients empresarials.',
      ],
      education: [
        'Màster (M.A.) en Comptabilitat, National Chengchi University',
        'Grau (B.A.) en Comptabilitat, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  is: {
    'tseng-junwei': {
      intro: [
        'Skrifstofan vinnur mál fyrirtækja og einstaklinga á Taívan á ensku, japönsku, kóresku og kínversku.',
        'Hún fór með mál kóresks námsmanns um skaðabætur vegna meiðsla í líkamsræktarstöð og fékk dóm í fyrsta dómsstigi um TWD 1.57M.',
      ],
      education: [
        'Meistarapróf (M.S.), Institute of Finance, National Taiwan University',
        'Bakkalárpróf (B.A.) í tvöföldu námi í lögfræði og fjármálum, National Chengchi University',
        'Skiptinemi við Kobe University og Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Lögfræðiaðstoðarsjóðurinn, útibú í Taichung',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Áður í lagadeild menntamálaráðuneytisins, með áherslu á stjórnsýslu- og einkamál.',
        'Reynsla af málum háskóla, réttindum kennara og stjórnsýslukærum.',
      ],
      education: [
        'Bakkalárpróf í lögfræði (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Lagadeild menntamálaráðuneytisins',
        'Lögmaður, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Lögfræðiaðstoðarmaður með langa reynslu; áður yfirlögfræðiaðstoðarmaður á nokkrum lögmannsstofum, með ábyrgð á málflutningsstuðningi, félagarétti og erlendum fjárfestingum.',
        'Aðstoð við málflutning, félagastofnun, samþykki erlendra fjárfestinga, leyfisumsóknir og samskipti milli Kóreu og Taívan.',
      ],
      education: [
        'Bakkalárpróf í lögfræði (LL.B.), Tunghai University',
      ],
      experience: [
        'Yfirlögfræðiaðstoðarmaður, Boyin Law Firm',
        'Yfirlögfræðiaðstoðarmaður, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Samræmir ráðgjafartíma og samskipti fyrir skjólstæðinga frá Kóreu.',
        'Styður samskipti yfir landamæri með skjalakerfum og vinnuferlum, á grundvelli tölvunarfræði.',
      ],
      education: [
        'Bakkalárpróf (B.S.) í tölvunarfræði, National Cheng Kung University',
      ],
      experience: [
        'Kóreurekstur, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Hann lauk bakkalár- og meistaranámi í reikningshaldi við National Chengchi University og stýrir nú endurskoðunarskrifstofu.',
        'Styður samþætta greiningu á laga-, skatta- og fjárhagsáhættu fyrir fyrirtækjaskjólstæðinga.',
      ],
      education: [
        'Meistarapróf (M.A.) í reikningshaldi, National Chengchi University',
        'Bakkalárpróf (B.A.) í reikningshaldi, National Chengchi University',
      ],
      experience: [
        'Chinshin CPA Firm',
      ],
    },
  },
};

/** Ids the roster knows a localized job title for. */
export const GUIDANCE_TEAM_MEMBER_IDS: readonly GuidanceTeamMemberId[] = [
  'tseng-junwei',
  'chang-rongxuan',
  'chang-fangyu',
  'son-jungmin',
  'huang-shengping',
];

export function isGuidanceTeamMemberId(id: string): id is GuidanceTeamMemberId {
  return (GUIDANCE_TEAM_MEMBER_IDS as readonly string[]).includes(id);
}

/**
 * Qualification sentence for the key-facts block — the guidance equivalent of
 * `buildAttorneyQualificationSentence` in the legacy page bodies. Both values
 * are supplied by the caller from canonical data.
 */
export function buildGuidanceQualificationSentence(
  locale: GuidanceLocale,
  name: string,
  firm: string,
): string {
  return guidanceTeamCopy[locale].qualificationSentence
    .replace('{name}', name)
    .replace('{firm}', firm);
}

/**
 * A member's languages, named in the page language.
 *
 * The list itself is canonical (`attorney-profiles.en`); only the names are
 * localized, exactly as `/ja` renders 韓国語・中国語・日本語 for the same record.
 * A language with no localized name is dropped rather than shown in English.
 */
export function guidanceMemberLanguages(
  locale: GuidanceLocale,
  profileSlug: string | undefined,
): string[] {
  if (!profileSlug || profileSlug !== primaryAttorneySlug) return [];
  const canonical = getAttorneyProfile('en', profileSlug)?.languages ?? [];
  const names = guidanceLanguageNames[locale];
  return canonical.map((language) => names[language]).filter((name): name is string => Boolean(name));
}
