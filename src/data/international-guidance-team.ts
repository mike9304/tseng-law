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
      'Hồ sơ của các luật sư, quản lý nghiệp vụ và kế toán viên hợp tác của Hovering.',
    representativeTitle: 'Luật sư điều hành',
    teamTitle: 'Luật sư và nhân viên',
    partnerTitle: 'Kế toán viên hợp tác',
    introLabel: 'Giới thiệu',
    educationLabel: 'Học vấn',
    experienceLabel: 'Kinh nghiệm',
    photoAltPrefix: 'Ảnh',
    workingLanguagesLabel: 'Ngôn ngữ làm việc',
    fullProfileLabel: 'Hồ sơ đầy đủ (English)',
    keyFactsHeading: 'Luật sư Wei Tseng — Thông tin cơ bản',
    qualificationLabel: 'Tư cách và nơi công tác',
    qualificationSentence:
      '{name} là luật sư có tư cách hành nghề tại Đài Loan và là luật sư điều hành của {firm}.',
    practiceLabel: 'Lĩnh vực chính',
    consultationLanguagesLabel: 'Ngôn ngữ tư vấn',
    roles: {
      'tseng-junwei': 'Luật sư điều hành tại Đài Loan (Managing Attorney)',
      'chang-rongxuan': 'Luật sư tại Đài Loan (Taiwan Attorney)',
      'chang-fangyu': 'Trợ lý pháp lý (Paralegal)',
      'son-jungmin': 'Quản lý nghiệp vụ Hàn Quốc (Korea Operations Manager)',
      'huang-shengping': 'Kế toán viên hợp tác (Partner CPA)',
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
    fullProfileLabel: 'Profil lengkap (English)',
    keyFactsHeading: 'Advokat Wei Tseng — Fakta utama',
    qualificationLabel: 'Kualifikasi dan kantor',
    qualificationSentence:
      '{name} adalah advokat berizin praktik di Taiwan dan advokat pengelola di {firm}.',
    practiceLabel: 'Bidang utama',
    consultationLanguagesLabel: 'Bahasa konsultasi',
    roles: {
      'tseng-junwei': 'Advokat pengelola di Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Advokat di Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Manajer operasional Korea (Korea Operations Manager)',
      'huang-shengping': 'Akuntan mitra (Partner CPA)',
    },
  },
  th: {
    label: 'ทีมงานของเรา',
    title: 'ทีมงานระหว่างประเทศ Hovering',
    description:
      'ประวัติของทนายความ ผู้จัดการงาน และผู้สอบบัญชีพันธมิตรของ Hovering',
    representativeTitle: 'ทนายความผู้บริหาร',
    teamTitle: 'ทนายความและเจ้าหน้าที่',
    partnerTitle: 'ผู้สอบบัญชีพันธมิตร',
    introLabel: 'แนะนำ',
    educationLabel: 'การศึกษา',
    experienceLabel: 'ประสบการณ์',
    photoAltPrefix: 'ภาพ',
    workingLanguagesLabel: 'ภาษาที่ใช้ทำงาน',
    fullProfileLabel: 'ประวัติฉบับเต็ม (English)',
    keyFactsHeading: 'ทนายความ Wei Tseng — ข้อมูลพื้นฐาน',
    qualificationLabel: 'คุณสมบัติและสังกัด',
    qualificationSentence:
      '{name} เป็นทนายความที่มีคุณสมบัติประกอบวิชาชีพในไต้หวัน และเป็นทนายความผู้บริหารของ {firm}',
    practiceLabel: 'สาขาที่รับดำเนินการหลัก',
    consultationLanguagesLabel: 'ภาษาที่ใช้ให้คำปรึกษา',
    roles: {
      'tseng-junwei': 'ทนายความผู้บริหารในไต้หวัน (Managing Attorney)',
      'chang-rongxuan': 'ทนายความในไต้หวัน (Taiwan Attorney)',
      'chang-fangyu': 'ผู้ช่วยงานกฎหมาย (Paralegal)',
      'son-jungmin': 'ผู้จัดการงานประเทศเกาหลี (Korea Operations Manager)',
      'huang-shengping': 'ผู้สอบบัญชีพันธมิตร (Partner CPA)',
    },
  },
  fil: {
    label: 'ANG AMING KOPONAN',
    title: 'Pandaigdigang koponan ng Hovering',
    description:
      'Mga profile ng mga abogado, tagapamahala ng operasyon, at kasosyong akawntant ng Hovering.',
    representativeTitle: 'Namamahalang abogada',
    teamTitle: 'Mga abogado at kawani',
    partnerTitle: 'Kasosyong akawntant',
    introLabel: 'Panimula',
    educationLabel: 'Edukasyon',
    experienceLabel: 'Karanasan',
    photoAltPrefix: 'Larawan',
    workingLanguagesLabel: 'Mga wikang ginagamit sa trabaho',
    fullProfileLabel: 'Buong profile (English)',
    keyFactsHeading: 'Abogadang Wei Tseng — Mahahalagang impormasyon',
    qualificationLabel: 'Kwalipikasyon at tanggapan',
    qualificationSentence:
      'Si {name} ay abogadang kwalipikado sa Taiwan at ang namamahalang abogada ng {firm}.',
    practiceLabel: 'Pangunahing larangan',
    consultationLanguagesLabel: 'Wika ng konsultasyon',
    roles: {
      'tseng-junwei': 'Namamahalang abogada sa Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Abogado sa Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Tagapamahala ng operasyong Korea (Korea Operations Manager)',
      'huang-shengping': 'Kasosyong akawntant (Partner CPA)',
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
    fullProfileLabel: 'الملف الكامل (English)',
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
      'Profile der Anwältinnen und Anwälte, der Betriebsleitung und der Partner-Wirtschaftsprüfung von Hovering.',
    representativeTitle: 'Geschäftsführende Anwältin',
    teamTitle: 'Anwältinnen, Anwälte und Mitarbeitende',
    partnerTitle: 'Partner-Wirtschaftsprüfung',
    introLabel: 'Vorstellung',
    educationLabel: 'Ausbildung',
    experienceLabel: 'Berufserfahrung',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Arbeitssprachen',
    fullProfileLabel: 'Vollständiges Profil (English)',
    keyFactsHeading: 'Rechtsanwältin Wei Tseng — Wesentliche Angaben',
    qualificationLabel: 'Qualifikation und Kanzlei',
    qualificationSentence:
      '{name} ist in Taiwan zur anwaltlichen Tätigkeit zugelassen und geschäftsführende Anwältin von {firm}.',
    practiceLabel: 'Schwerpunkte',
    consultationLanguagesLabel: 'Beratungssprachen',
    roles: {
      'tseng-junwei': 'Geschäftsführende Anwältin in Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Anwalt in Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Betriebsleitung Korea (Korea Operations Manager)',
      'huang-shengping': 'Partner-Wirtschaftsprüfer (Partner CPA)',
    },
  },
  es: {
    label: 'NUESTRO EQUIPO',
    title: 'Equipo internacional de Hovering',
    description:
      'Perfiles de los abogados, de la dirección de operaciones y del contador asociado de Hovering.',
    representativeTitle: 'Abogada directora',
    teamTitle: 'Abogados y personal',
    partnerTitle: 'Contador asociado',
    introLabel: 'Presentación',
    educationLabel: 'Formación',
    experienceLabel: 'Experiencia',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Idiomas de trabajo',
    fullProfileLabel: 'Perfil completo (English)',
    keyFactsHeading: 'Abogada Wei Tseng — Datos esenciales',
    qualificationLabel: 'Cualificación y despacho',
    qualificationSentence:
      '{name} es abogada habilitada para ejercer en Taiwán y la abogada directora de {firm}.',
    practiceLabel: 'Áreas principales',
    consultationLanguagesLabel: 'Idiomas de consulta',
    roles: {
      'tseng-junwei': 'Abogada directora en Taiwán (Managing Attorney)',
      'chang-rongxuan': 'Abogado en Taiwán (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Dirección de operaciones de Corea (Korea Operations Manager)',
      'huang-shengping': 'Contador asociado (Partner CPA)',
    },
  },
  fr: {
    label: 'NOTRE ÉQUIPE',
    title: 'Équipe internationale de Hovering',
    description:
      'Profils des avocates et avocats, de la direction des opérations et de l’expertise-comptable associée de Hovering.',
    representativeTitle: 'Avocate dirigeante',
    teamTitle: 'Avocates, avocats et collaborateurs',
    partnerTitle: 'Expertise-comptable associée',
    introLabel: 'Présentation',
    educationLabel: 'Formation',
    experienceLabel: 'Expérience',
    photoAltPrefix: 'Photo',
    workingLanguagesLabel: 'Langues de travail',
    fullProfileLabel: 'Profil complet (English)',
    keyFactsHeading: 'Avocate Wei Tseng — Indications essentielles',
    qualificationLabel: 'Qualification et cabinet',
    qualificationSentence:
      '{name} est avocate habilitée à exercer à Taïwan et avocate dirigeante de {firm}.',
    practiceLabel: 'Domaines principaux',
    consultationLanguagesLabel: 'Langues de consultation',
    roles: {
      'tseng-junwei': 'Avocate dirigeante à Taïwan (Managing Attorney)',
      'chang-rongxuan': 'Avocat à Taïwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Direction des opérations Corée (Korea Operations Manager)',
      'huang-shengping': 'Expert-comptable associé (Partner CPA)',
    },
  },
  pt: {
    label: 'A NOSSA EQUIPA',
    title: 'Equipa internacional de Hovering',
    description:
      'Perfis das advogadas e dos advogados, da direção de operações e da contabilidade associada de Hovering.',
    representativeTitle: 'Advogada diretora',
    teamTitle: 'Advogadas, advogados e pessoal',
    partnerTitle: 'Contabilista associado',
    introLabel: 'Apresentação',
    educationLabel: 'Formação',
    experienceLabel: 'Experiência',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Línguas de trabalho',
    fullProfileLabel: 'Perfil completo (English)',
    keyFactsHeading: 'Advogada Wei Tseng — Dados essenciais',
    qualificationLabel: 'Qualificação e escritório',
    qualificationSentence:
      '{name} é advogada habilitada a exercer em Taiwan e a advogada diretora de {firm}.',
    practiceLabel: 'Áreas principais',
    consultationLanguagesLabel: 'Línguas de consulta',
    roles: {
      'tseng-junwei': 'Advogada diretora em Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Advogado em Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Direção de operações da Coreia (Korea Operations Manager)',
      'huang-shengping': 'Contabilista associado (Partner CPA)',
    },
  },
  'zh-hans': {
    label: '我们的团队',
    title: 'Hovering 国际团队',
    description:
      'Hovering 律师、运营主管与合作会计师的简介。',
    representativeTitle: '主持律师',
    teamTitle: '律师与同事',
    partnerTitle: '合作会计师',
    introLabel: '简介',
    educationLabel: '学历',
    experienceLabel: '经历',
    photoAltPrefix: '照片',
    workingLanguagesLabel: '工作语言',
    fullProfileLabel: '完整简介 (English)',
    keyFactsHeading: '律师曾雋崴 — 要点',
    qualificationLabel: '资格与事务所',
    qualificationSentence:
      '{name} 具有台湾执业资格，为 {firm} 的主持律师。',
    practiceLabel: '主要领域',
    consultationLanguagesLabel: '咨询语言',
    roles: {
      'tseng-junwei': '台湾主持律师 (Managing Attorney)',
      'chang-rongxuan': '台湾律师 (Taiwan Attorney)',
      'chang-fangyu': '律师助理',
      'son-jungmin': '韩国运营主管 (Korea Operations Manager)',
      'huang-shengping': '合作会计师 (Partner CPA)',
    },
  },
  ms: {
    label: 'PASUKAN KAMI',
    title: 'Pasukan antarabangsa Hovering',
    description:
      'Profil peguam, pengurusan operasi dan perakaunan rakan kongsi Hovering.',
    representativeTitle: 'Peguam pengarah',
    teamTitle: 'Peguam dan rakan sekerja',
    partnerTitle: 'Perakaunan rakan kongsi',
    introLabel: 'Pengenalan',
    educationLabel: 'Pendidikan',
    experienceLabel: 'Pengalaman',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Bahasa kerja',
    fullProfileLabel: 'Profil penuh (English)',
    keyFactsHeading: 'Peguam Wei Tseng — Petunjuk utama',
    qualificationLabel: 'Kelayakan dan firma',
    qualificationSentence:
      '{name} ialah peguam yang layak beramal di Taiwan dan peguam pengarah {firm}.',
    practiceLabel: 'Bidang utama',
    consultationLanguagesLabel: 'Bahasa perundingan',
    roles: {
      'tseng-junwei': 'Peguam pengarah di Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Peguam di Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Pengurusan operasi Korea (Korea Operations Manager)',
      'huang-shengping': 'Perakaunan rakan kongsi (Partner CPA)',
    },
  },
  ru: {
    label: 'НАША КОМАНДА',
    title: 'Международная команда Hovering',
    description:
      'Профили адвокатов, руководства по операциям и партнёрской бухгалтерии Hovering.',
    representativeTitle: 'Руководящий адвокат',
    teamTitle: 'Адвокаты и сотрудники',
    partnerTitle: 'Партнёрская бухгалтерия',
    introLabel: 'Представление',
    educationLabel: 'Образование',
    experienceLabel: 'Опыт',
    photoAltPrefix: 'Фото',
    workingLanguagesLabel: 'Рабочие языки',
    fullProfileLabel: 'Полный профиль (English)',
    keyFactsHeading: 'Адвокат Вэй Цзэн — Основные сведения',
    qualificationLabel: 'Квалификация и фирма',
    qualificationSentence:
      '{name} уполномочена практиковать на Тайване и является руководящим адвокатом {firm}.',
    practiceLabel: 'Основные направления',
    consultationLanguagesLabel: 'Языки консультации',
    roles: {
      'tseng-junwei': 'Руководящий адвокат на Тайване (Managing Attorney)',
      'chang-rongxuan': 'Адвокат на Тайване (Taiwan Attorney)',
      'chang-fangyu': 'Помощник адвоката',
      'son-jungmin': 'Руководство операциями Кореи (Korea Operations Manager)',
      'huang-shengping': 'Партнёр-бухгалтер (Partner CPA)',
    },
  },
  tr: {
    label: 'EKİBİMİZ',
    title: 'Hovering uluslararası ekibi',
    description:
      'Hovering avukatlarının, operasyon yönetiminin ve ortak muhasebenin profilleri.',
    representativeTitle: 'Yönetici avukat',
    teamTitle: 'Avukatlar ve çalışanlar',
    partnerTitle: 'Ortak muhasebe',
    introLabel: 'Tanıtım',
    educationLabel: 'Eğitim',
    experienceLabel: 'Deneyim',
    photoAltPrefix: 'Fotoğraf',
    workingLanguagesLabel: 'Çalışma dilleri',
    fullProfileLabel: 'Tam profil (English)',
    keyFactsHeading: 'Avukat Wei Tseng — Temel bilgiler',
    qualificationLabel: 'Yetki ve büro',
    qualificationSentence:
      '{name}, Tayvan’da meslek yürütmeye yetkilidir ve {firm} yönetici avukatıdır.',
    practiceLabel: 'Başlıca alanlar',
    consultationLanguagesLabel: 'Görüşme dilleri',
    roles: {
      'tseng-junwei': 'Tayvan’da yönetici avukat (Managing Attorney)',
      'chang-rongxuan': 'Tayvan avukatı (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Kore operasyon yönetimi (Korea Operations Manager)',
      'huang-shengping': 'Ortak muhasebeci (Partner CPA)',
    },
  },
  it: {
    label: 'IL NOSTRO TEAM',
    title: 'Team internazionale di Hovering',
    description:
      'Profili delle avvocate e degli avvocati, della direzione operativa e della revisione associata di Hovering.',
    representativeTitle: 'Avvocata dirigente',
    teamTitle: 'Avvocate, avvocati e collaboratori',
    partnerTitle: 'Revisione associata',
    introLabel: 'Presentazione',
    educationLabel: 'Formazione',
    experienceLabel: 'Esperienza',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Lingue di lavoro',
    fullProfileLabel: 'Profilo completo (English)',
    keyFactsHeading: 'Avvocata Wei Tseng — Dati essenziali',
    qualificationLabel: 'Qualifica e studio',
    qualificationSentence:
      '{name} è abilitata all’esercizio della professione a Taiwan ed è l’avvocata dirigente di {firm}.',
    practiceLabel: 'Ambiti principali',
    consultationLanguagesLabel: 'Lingue di consulenza',
    roles: {
      'tseng-junwei': 'Avvocata dirigente a Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Avvocato a Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Direzione operativa Corea (Korea Operations Manager)',
      'huang-shengping': 'Revisore associato (Partner CPA)',
    },
  },
  nl: {
    label: 'ONS TEAM',
    title: 'Internationaal team van Hovering',
    description:
      'Profielen van de advocaten, de operationele leiding en de partneraccountancy van Hovering.',
    representativeTitle: 'Leidinggevend advocaat',
    teamTitle: 'Advocaten en medewerkers',
    partnerTitle: 'Partneraccountancy',
    introLabel: 'Voorstelling',
    educationLabel: 'Opleiding',
    experienceLabel: 'Ervaring',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Werktalen',
    fullProfileLabel: 'Volledig profiel (English)',
    keyFactsHeading: 'Advocaat Wei Tseng — Kerngegevens',
    qualificationLabel: 'Bevoegdheid en kantoor',
    qualificationSentence:
      '{name} is bevoegd tot de advocatuur in Taiwan en is leidinggevend advocaat van {firm}.',
    practiceLabel: 'Hoofdgebieden',
    consultationLanguagesLabel: 'Consultatietalen',
    roles: {
      'tseng-junwei': 'Leidinggevend advocaat in Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Advocaat in Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Operationele leiding Korea (Korea Operations Manager)',
      'huang-shengping': 'Partneraccountant (Partner CPA)',
    },
  },
  pl: {
    label: 'NASZ ZESPÓŁ',
    title: 'Międzynarodowy zespół Hovering',
    description:
      'Profile adwokatów, kierownictwa operacyjnego i partnerskiego biura rachunkowego Hovering.',
    representativeTitle: 'Adwokat kierujący',
    teamTitle: 'Adwokaci i współpracownicy',
    partnerTitle: 'Partnerskie biuro rachunkowe',
    introLabel: 'Przedstawienie',
    educationLabel: 'Wykształcenie',
    experienceLabel: 'Doświadczenie',
    photoAltPrefix: 'Zdjęcie',
    workingLanguagesLabel: 'Języki pracy',
    fullProfileLabel: 'Pełny profil (English)',
    keyFactsHeading: 'Adwokat Wei Tseng — Dane zasadnicze',
    qualificationLabel: 'Uprawnienie i kancelaria',
    qualificationSentence:
      '{name} jest uprawniona do wykonywania zawodu adwokata na Tajwanie i jest adwokatem kierującym {firm}.',
    practiceLabel: 'Główne dziedziny',
    consultationLanguagesLabel: 'Języki konsultacji',
    roles: {
      'tseng-junwei': 'Adwokat kierujący na Tajwanie (Managing Attorney)',
      'chang-rongxuan': 'Adwokat na Tajwanie (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Kierownictwo operacyjne Korei (Korea Operations Manager)',
      'huang-shengping': 'Partner-księgowy (Partner CPA)',
    },
  },
  hi: {
    label: 'हमारी टीम',
    title: 'Hovering की अंतरराष्ट्रीय टीम',
    description:
      'Hovering के अधिवक्ताओं, संचालन प्रबंधन और सहभागी लेखा परीक्षा की प्रोफ़ाइलें।',
    representativeTitle: 'प्रबंध अधिवक्ता',
    teamTitle: 'अधिवक्ता और सहयोगी',
    partnerTitle: 'सहभागी लेखा परीक्षा',
    introLabel: 'परिचय',
    educationLabel: 'शिक्षा',
    experienceLabel: 'अनुभव',
    photoAltPrefix: 'फ़ोटो',
    workingLanguagesLabel: 'कार्य भाषाएँ',
    fullProfileLabel: 'पूर्ण प्रोफ़ाइल (English)',
    keyFactsHeading: 'अधिवक्ता Wei Tseng — मुख्य तथ्य',
    qualificationLabel: 'योग्यता और कार्यालय',
    qualificationSentence:
      '{name} ताइवान में व्यवसाय करने के लिए अधिकृत हैं और {firm} की प्रबंध अधिवक्ता हैं।',
    practiceLabel: 'मुख्य क्षेत्र',
    consultationLanguagesLabel: 'परामर्श भाषाएँ',
    roles: {
      'tseng-junwei': 'ताइवान में प्रबंध अधिवक्ता (Managing Attorney)',
      'chang-rongxuan': 'ताइवान अधिवक्ता (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'कोरिया संचालन प्रबंधन (Korea Operations Manager)',
      'huang-shengping': 'सहभागी लेखाकार (Partner CPA)',
    },
  },
  sv: {
    label: 'VÅRT TEAM',
    title: 'Hoverings internationella team',
    description:
      'Profiler för Hoverings advokater, operativa ledning och anknutna revision.',
    representativeTitle: 'Ledande advokat',
    teamTitle: 'Advokater och medarbetare',
    partnerTitle: 'Anknuten revision',
    introLabel: 'Presentation',
    educationLabel: 'Utbildning',
    experienceLabel: 'Erfarenhet',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Arbetsspråk',
    fullProfileLabel: 'Fullständig profil (English)',
    keyFactsHeading: 'Advokat Wei Tseng — Kärnuppgifter',
    qualificationLabel: 'Behörighet och byrå',
    qualificationSentence:
      '{name} är behörig att utöva advokatyrket i Taiwan och är ledande advokat vid {firm}.',
    practiceLabel: 'Huvudområden',
    consultationLanguagesLabel: 'Rådgivningsspråk',
    roles: {
      'tseng-junwei': 'Ledande advokat i Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Advokat i Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Operativ ledning Korea (Korea Operations Manager)',
      'huang-shengping': 'Anknuten revisor (Partner CPA)',
    },
  },
  da: {
    label: 'VORES TEAM',
    title: 'Hoverings internationale team',
    description:
      'Profiler for Hoverings advokater, operative ledelse og tilknyttede revision.',
    representativeTitle: 'Ledende advokat',
    teamTitle: 'Advokater og medarbejdere',
    partnerTitle: 'Tilknyttet revision',
    introLabel: 'Præsentation',
    educationLabel: 'Uddannelse',
    experienceLabel: 'Erfaring',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Arbejdssprog',
    fullProfileLabel: 'Fuld profil (English)',
    keyFactsHeading: 'Advokat Wei Tseng — Kerneoplysninger',
    qualificationLabel: 'Bevilling og kontor',
    qualificationSentence:
      '{name} er berettiget til at udøve advokaterhvervet i Taiwan og er ledende advokat ved {firm}.',
    practiceLabel: 'Hovedområder',
    consultationLanguagesLabel: 'Rådgivningssprog',
    roles: {
      'tseng-junwei': 'Ledende advokat i Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Advokat i Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Operativ ledelse Korea (Korea Operations Manager)',
      'huang-shengping': 'Tilknyttet revisor (Partner CPA)',
    },
  },
  nb: {
    label: 'VÅRT TEAM',
    title: 'Hoverings internasjonale team',
    description:
      'Profiler for Hoverings advokater, operative ledelse og tilknyttede revisjon.',
    representativeTitle: 'Ledende advokat',
    teamTitle: 'Advokater og medarbeidere',
    partnerTitle: 'Tilknyttet revisjon',
    introLabel: 'Presentasjon',
    educationLabel: 'Utdanning',
    experienceLabel: 'Erfaring',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Arbeidsspråk',
    fullProfileLabel: 'Fullstendig profil (English)',
    keyFactsHeading: 'Advokat Wei Tseng — Kjerneopplysninger',
    qualificationLabel: 'Bevilling og kontor',
    qualificationSentence:
      '{name} er berettiget til å utøve advokatyrket i Taiwan og er ledende advokat ved {firm}.',
    practiceLabel: 'Hovedområder',
    consultationLanguagesLabel: 'Rådgivningsspråk',
    roles: {
      'tseng-junwei': 'Ledende advokat i Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Advokat i Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Operativ ledelse Korea (Korea Operations Manager)',
      'huang-shengping': 'Tilknyttet revisor (Partner CPA)',
    },
  },
  fi: {
    label: 'TIIMIMME',
    title: 'Hoveringin kansainvälinen tiimi',
    description:
      'Hoveringin asianajajien, operatiivisen johdon ja yhteistyökumppanina toimivan tilitoimiston profiilit.',
    representativeTitle: 'Johtava asianajaja',
    teamTitle: 'Asianajajat ja työntekijät',
    partnerTitle: 'Yhteistyökumppanina toimiva tilitoimisto',
    introLabel: 'Esittely',
    educationLabel: 'Koulutus',
    experienceLabel: 'Kokemus',
    photoAltPrefix: 'Valokuva',
    workingLanguagesLabel: 'Työkielet',
    fullProfileLabel: 'Koko profiili (englanniksi)',
    keyFactsHeading: 'Asianajaja Wei Tseng — Keskeiset tiedot',
    qualificationLabel: 'Kelpoisuus ja toimisto',
    qualificationSentence:
      '{name} on kelpoinen harjoittamaan asianajajan ammattia Taiwanissa ja on {firm}in johtava asianajaja.',
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
      'Profily advokátek a advokátů, provozního vedení a přidružené účetní revize Hovering.',
    representativeTitle: 'Kierující advokátka',
    teamTitle: 'Advokáti a spolupracovníci',
    partnerTitle: 'Přidružené účetnictví',
    introLabel: 'Představení',
    educationLabel: 'Vzdělání',
    experienceLabel: 'Praxe',
    photoAltPrefix: 'Fotografie',
    workingLanguagesLabel: 'Pracovní jazyky',
    fullProfileLabel: 'Úplný profil (English)',
    keyFactsHeading: 'Advokátka Wei Tseng — Základní údaje',
    qualificationLabel: 'Oprávnění a kancelář',
    qualificationSentence:
      '{name} je oprávněna vykonávat advokacii na Tchaj-wanu a je řídící advokátkou {firm}.',
    practiceLabel: 'Hlavní oblasti',
    consultationLanguagesLabel: 'Jazyky porady',
    roles: {
      'tseng-junwei': 'Řídící advokátka na Tchaj-wanu (Managing Attorney)',
      'chang-rongxuan': 'Advokát na Tchaj-wanu (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Vedení provozu v Koreji (Korea Operations Manager)',
      'huang-shengping': 'Partnerský účetní (Partner CPA)',
    },
  },
  hu: {
    label: 'CSAPATUNK',
    title: 'A Hovering nemzetközi csapata',
    description:
      'A Hovering ügyvédeinek, működési vezetésének és társult könyvvizsgálatának profiljai.',
    representativeTitle: 'Vezető ügyvéd',
    teamTitle: 'Ügyvédek és munkatársak',
    partnerTitle: 'Társult könyvvizsgálat',
    introLabel: 'Bemutatkozás',
    educationLabel: 'Tanulmányok',
    experienceLabel: 'Tapasztalat',
    photoAltPrefix: 'Fénykép',
    workingLanguagesLabel: 'Munkanyelvek',
    fullProfileLabel: 'Teljes profil (English)',
    keyFactsHeading: 'Wei Tseng ügyvéd — Fő adatok',
    qualificationLabel: 'Képesítés és iroda',
    qualificationSentence:
      '{name} jogosult Tajvanon ügyvédi tevékenységet folytatni, és a(z) {firm} vezető ügyvédje.',
    practiceLabel: 'Fő területek',
    consultationLanguagesLabel: 'Tanácsadási nyelvek',
    roles: {
      'tseng-junwei': 'Vezető ügyvéd Tajvanon (Managing Attorney)',
      'chang-rongxuan': 'Ügyvéd Tajvanon (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Koreai működésvezetés (Korea Operations Manager)',
      'huang-shengping': 'Társult könyvvizsgáló (Partner CPA)',
    },
  },
  ro: {
    label: 'ECHIPA NOASTRĂ',
    title: 'Echipa internațională Hovering',
    description:
      'Profilurile avocatelor și avocaților, ale conducerii operative și ale revizuirii contabile asociate Hovering.',
    representativeTitle: 'Avocată coordonatoare',
    teamTitle: 'Avocați și colaboratori',
    partnerTitle: 'Contabilitate asociată',
    introLabel: 'Prezentare',
    educationLabel: 'Studii',
    experienceLabel: 'Experiență',
    photoAltPrefix: 'Fotografie',
    workingLanguagesLabel: 'Limbi de lucru',
    fullProfileLabel: 'Profil complet (English)',
    keyFactsHeading: 'Avocata Wei Tseng — Date esențiale',
    qualificationLabel: 'Calificare și cabinet',
    qualificationSentence:
      '{name} este autorizată să profeseze în Taiwan și este avocata coordonatoare a {firm}.',
    practiceLabel: 'Domenii principale',
    consultationLanguagesLabel: 'Limbi de consultanță',
    roles: {
      'tseng-junwei': 'Avocată coordonatoare în Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Avocat în Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Conducerea operațiunilor din Coreea (Korea Operations Manager)',
      'huang-shengping': 'Contabil asociat (Partner CPA)',
    },
  },
  uk: {
    label: 'НАША КОМАНДА',
    title: 'Міжнародна команда Hovering',
    description:
      'Профілі адвокатів, операційного керівництва та партнерської бухгалтерії Hovering.',
    representativeTitle: 'Керівний адвокат',
    teamTitle: 'Адвокати та співробітники',
    partnerTitle: 'Партнерська бухгалтерія',
    introLabel: 'Представлення',
    educationLabel: 'Освіта',
    experienceLabel: 'Досвід',
    photoAltPrefix: 'Світлина',
    workingLanguagesLabel: 'Робочі мови',
    fullProfileLabel: 'Повний профіль (English)',
    keyFactsHeading: 'Адвокат Wei Tseng — Основні відомості',
    qualificationLabel: 'Кваліфікація та фірма',
    qualificationSentence:
      '{name} уповноважена провадити адвокатську діяльність на Тайвані та є керівним адвокатом {firm}.',
    practiceLabel: 'Основні напрями',
    consultationLanguagesLabel: 'Мови консультації',
    roles: {
      'tseng-junwei': 'Керівний адвокат на Тайвані (Managing Attorney)',
      'chang-rongxuan': 'Адвокат на Тайвані (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Керівництво операціями в Кореї (Korea Operations Manager)',
      'huang-shengping': 'Партнерський бухгалтер (Partner CPA)',
    },
  },
  el: {
    label: 'Η ΟΜΑΔΑ ΜΑΣ',
    title: 'Η διεθνής ομάδα της Hovering',
    description:
      'Προφίλ των δικηγόρων, της λειτουργικής διεύθυνσης και του συνεργαζόμενου λογιστικού ελέγχου της Hovering.',
    representativeTitle: 'Διευθύνουσα δικηγόρος',
    teamTitle: 'Δικηγόροι και συνεργάτες',
    partnerTitle: 'Συνεργαζόμενη λογιστική',
    introLabel: 'Παρουσίαση',
    educationLabel: 'Σπουδές',
    experienceLabel: 'Εμπειρία',
    photoAltPrefix: 'Φωτογραφία',
    workingLanguagesLabel: 'Γλώσσες εργασίας',
    fullProfileLabel: 'Πλήρες προφίλ (English)',
    keyFactsHeading: 'Η δικηγόρος Wei Tseng — Βασικά στοιχεία',
    qualificationLabel: 'Προσόντα και γραφείο',
    qualificationSentence:
      'Η {name} έχει άδεια άσκησης δικηγορίας στην Ταϊβάν και είναι η διευθύνουσα δικηγόρος της {firm}.',
    practiceLabel: 'Κύριοι τομείς',
    consultationLanguagesLabel: 'Γλώσσες συμβουλευτικής',
    roles: {
      'tseng-junwei': 'Διευθύνουσα δικηγόρος στην Ταϊβάν (Managing Attorney)',
      'chang-rongxuan': 'Δικηγόρος στην Ταϊβάν (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Διεύθυνση λειτουργιών Κορέας (Korea Operations Manager)',
      'huang-shengping': 'Συνεργαζόμενος ορκωτός λογιστής (Partner CPA)',
    },
  },
  he: {
    label: 'הצוות שלנו',
    title: 'הצוות הבין־לאומי של Hovering',
    description:
      'פרופילים של עורכות ועורכי הדין, של ההנהלה התפעולית ושל ביקורת החשבונות השותפה של Hovering.',
    representativeTitle: 'עורכת הדין המנהלת',
    teamTitle: 'עורכי דין ועובדים',
    partnerTitle: 'ביקורת חשבונות שותפה',
    introLabel: 'הצגה',
    educationLabel: 'השכלה',
    experienceLabel: 'ניסיון',
    photoAltPrefix: 'תצלום',
    workingLanguagesLabel: 'שפות עבודה',
    fullProfileLabel: 'פרופיל מלא (English)',
    keyFactsHeading: 'עורכת הדין Wei Tseng — נתונים עיקריים',
    qualificationLabel: 'הסמכה ומשרד',
    qualificationSentence:
      '{name} מוסמכת לעסוק בעריכת דין בטאיוואן והיא עורכת הדין המנהלת של {firm}.',
    practiceLabel: 'תחומים עיקריים',
    consultationLanguagesLabel: 'שפות הייעוץ',
    roles: {
      'tseng-junwei': 'עורכת הדין המנהלת בטאיוואן (Managing Attorney)',
      'chang-rongxuan': 'עורך דין בטאיוואן (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'ניהול הפעילות בקוריאה (Korea Operations Manager)',
      'huang-shengping': 'רואה חשבון שותף (Partner CPA)',
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
  id: { Korean: 'bahasa Korea', Chinese: 'bahasa Tionghoa', Japanese: 'bahasa Jepang' },
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
    'Visa and residency': 'วีซ่าและการมีถิ่นที่อยู่',
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
    'Trademark and patent filings': 'Presentación de marcas y patentes',
    'Visa and residency': 'Visado y residencia',
    'Family and labor disputes': 'Conflictos de familia y laborales',
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
    'Trademark and patent filings': 'Apresentação de marcas e patentes',
    'Visa and residency': 'Visto e residência',
    'Family and labor disputes': 'Conflitos de família e laborais',
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
    'Trademark and patent filings': 'Pemfailan cap dagangan dan paten',
    'Visa and residency': 'Visa dan residensi',
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
    'Trademark and patent filings': 'चिह्न और पेटेंट आवेदन',
    'Visa and residency': 'वीज़ा और निवास',
    'Family and labor disputes': 'परिवार और श्रम विवाद',
  },
  sv: {
    'Taiwan company setup': 'Bolagsbildning i Taiwan',
    'Taiwan investment counsel': 'Juridisk rådgivning för investering i Taiwan',
    'Civil litigation and damages': 'Civilmål och skadestånd',
    'Trademark and patent filings': 'Varumärkes- och patentansökningar',
    'Visa and residency': 'Visum och vistelse',
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
    'Trademark and patent filings': 'Заявки на марки та патенти',
    'Visa and residency': 'Віза та проживання',
    'Family and labor disputes': 'Сімейні та трудові спори',
  },
  el: {
    'Taiwan company setup': 'Σύσταση εταιρειών στην Ταϊβάν',
    'Taiwan investment counsel': 'Συμβουλευτική επενδύσεων στην Ταϊβάν',
    'Civil litigation and damages': 'Αστικές δίκες και αποζημίωση',
    'Trademark and patent filings': 'Καταθέσεις σημάτων και διπλωμάτων ευρεσιτεχνίας',
    'Visa and residency': 'Θεώρηση και διαμονή',
    'Family and labor disputes': 'Οικογενειακές και εργατικές διαφορές',
  },
  he: {
    'Taiwan company setup': 'הקמת חברות בטאיוואן',
    'Taiwan investment counsel': 'ייעוץ להשקעות בטאיוואן',
    'Civil litigation and damages': 'תביעות אזרחיות ופיצויים',
    'Trademark and patent filings': 'הגשות של סימני מסחר ופטנטים',
    'Visa and residency': 'אשרה ושהייה',
    'Family and labor disputes': 'סכסוכי משפחה ועבודה',
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
        'Đã đại diện một sinh viên Hàn Quốc trong vụ việc bồi thường thương tích tại phòng tập và đạt được bản án sơ thẩm buộc bồi thường TWD 1.57M.',
      ],
      education: [
        'Thạc sĩ (M.S.), Institute of Finance, National Taiwan University',
        'Cử nhân (B.A.) song ngành Luật và Tài chính, National Chengchi University',
        'Sinh viên trao đổi, Kobe University và Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Từng công tác tại Ministry of Education, Legal Affairs Division, tập trung vào tranh chấp hành chính và dân sự.',
        'Có kinh nghiệm với các vụ việc về trường đại học, quyền của giảng viên và khiếu nại hành chính.',
      ],
      education: ['Cử nhân Luật (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Luật sư, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Trợ lý pháp lý kỳ cựu với nhiều năm ở vị trí trợ lý pháp lý cao cấp tại nhiều văn phòng luật, phụ trách hỗ trợ tố tụng, pháp chế doanh nghiệp và các vụ việc đầu tư nước ngoài.',
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
        'Hỗ trợ trao đổi giữa các bộ phận bằng hệ thống tài liệu và quy trình công việc, trên nền tảng khoa học máy tính.',
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
        'Kantor menangani perkara korporasi dan perorangan di Taiwan dalam bahasa Inggris, bahasa Jepang, bahasa Korea, dan bahasa Tionghoa.',
        'Mewakili seorang mahasiswa asal Korea dalam perkara cedera di pusat kebugaran dan memperoleh putusan ganti rugi tingkat pertama sebesar TWD 1.57M.',
      ],
      education: [
        'Magister (M.S.), Institute of Finance, National Taiwan University',
        'Sarjana (B.A.) program ganda Hukum dan Keuangan, National Chengchi University',
        'Mahasiswa pertukaran, Kobe University dan Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Sebelumnya bertugas di Ministry of Education, Legal Affairs Division, dengan fokus pada sengketa administrasi dan perdata.',
        'Berpengalaman dalam perkara perguruan tinggi, hak dosen, dan keberatan administratif.',
      ],
      education: ['Sarjana Hukum (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Advokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal berpengalaman yang bertahun-tahun menjabat paralegal senior di beberapa kantor advokat, meliputi dukungan litigasi, hukum korporasi, dan perkara penanaman modal asing.',
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
        'เคยเป็นผู้แทนนักศึกษาชาวเกาหลีในคดีเรียกค่าเสียหายจากการบาดเจ็บในฟิตเนส และได้รับคำพิพากษาศาลชั้นต้นให้ชดใช้ค่าเสียหาย TWD 1.57M',
      ],
      education: [
        'ปริญญาโท (M.S.), Institute of Finance, National Taiwan University',
        'ปริญญาตรี (B.A.) สองสาขาวิชา ด้านกฎหมายและการเงิน, National Chengchi University',
        'นักศึกษาแลกเปลี่ยน, Kobe University และ Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'เคยปฏิบัติงานที่ Ministry of Education, Legal Affairs Division โดยเน้นข้อพิพาททางปกครองและทางแพ่ง',
        'มีประสบการณ์ในเรื่องที่เกี่ยวกับมหาวิทยาลัย สิทธิของอาจารย์ และการร้องทุกข์ทางปกครอง',
      ],
      education: ['นิติศาสตรบัณฑิต (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'ทนายความ, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'ผู้ช่วยงานกฎหมายที่มีประสบการณ์ยาวนานในตำแหน่งผู้ช่วยงานกฎหมายอาวุโสของสำนักงานกฎหมายหลายแห่ง ครอบคลุมงานสนับสนุนคดี งานกฎหมายบริษัท และเรื่องการลงทุนจากต่างประเทศ',
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
        'Kinatawan nito ang isang mag-aaral mula sa Korea sa usapin ng pinsalang natamo sa gym, na nagbunga ng hatol sa unang hukuman para sa danyos na TWD 1.57M.',
      ],
      education: [
        'Masterado (M.S.), Institute of Finance, National Taiwan University',
        'Batsilyer (B.A.) na doble ang medyor sa Batas at Pananalapi, National Chengchi University',
        'Palitang mag-aaral, Kobe University at Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Dating naglingkod sa Ministry of Education, Legal Affairs Division, nakatuon sa mga hidwaang administratibo at sibil.',
        'May karanasan sa mga usaping may kinalaman sa unibersidad, karapatan ng guro, at reklamong administratibo.',
      ],
      education: ['Batsilyer sa Batas (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Abogado, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Beteranong paralegal na may maraming taóng karanasan bilang senior na paralegal sa ilang tanggapan ng abogado, sumasaklaw sa suporta sa litigasyon, gawaing legal na pangkorporasyon, at usapin ng dayuhang pamumuhunan.',
        'Sumusuporta sa litigasyon, pagtatatag ng kompanya, pag-apruba ng dayuhang pamumuhunan, aplikasyon ng permiso, at komunikasyong Korea-Taiwan.',
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
        'Sinusuportahan ang komunikasyon sa pagitan ng mga koponan sa pamamagitan ng sistema ng dokumento at daloy ng trabaho, batay sa pinag-aralang agham pangkompyuter.',
      ],
      education: ['Batsilyer (B.S.) sa Agham Pangkompyuter, National Cheng Kung University'],
      experience: ['Koponang Pangnegosyo sa Korea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Natapos ang mga programang batsilyer at masterado sa akawnting sa National Chengchi University, at kasalukuyang namumuno sa isang tanggapan ng akawntant.',
        'Sumusuporta sa pinagsanib na pagsusuri ng panganib na legal, pambuwis, at pampinansiya para sa mga kliyenteng korporasyon.',
      ],
      education: [
        'Masterado (M.A.) sa Akawnting, National Chengchi University',
        'Batsilyer (B.A.) sa Akawnting, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  ar: {
    'tseng-junwei': {
      intro: [
        'يتولّى المكتب قضايا الشركات والأفراد في تايوان، ويعمل بالإنجليزية واليابانية والكورية والصينية.',
        'مثَّلت طالبًا كوريًا في دعوى تعويض عن إصابة في ناد رياضي، وصدر حكم ابتدائي بالتعويض بمبلغ TWD 1.57M.',
      ],
      education: [
        'ماجستير (M.S.)، Institute of Finance, National Taiwan University',
        'بكالوريوس (B.A.) بتخصص مزدوج في القانون والتمويل، National Chengchi University',
        'طالب تبادل في Kobe University و Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'عمل سابقًا في Ministry of Education, Legal Affairs Division، وركّز على المنازعات الإدارية والمدنية.',
        'لديه خبرة في القضايا المتعلقة بالجامعات وبحقوق أعضاء هيئة التدريس وبالتظلمات الإدارية.',
      ],
      education: ['بكالوريوس في القانون (LL.B.)، National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
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
        'Sie vertrat einen koreanischen Studenten in einem Schadensersatzverfahren wegen einer Verletzung im Fitnessstudio und erwirkte ein erstinstanzliches Urteil über TWD 1.57M.',
      ],
      education: [
        'Magister (M.S.), Institute of Finance, National Taiwan University',
        'Bachelor (B.A.) mit Doppelstudium Recht und Finanzen, National Chengchi University',
        'Austauschstudierende an der Kobe University und der Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Tätig zuvor im Ministry of Education, Legal Affairs Division, mit Schwerpunkt auf Verwaltungs- und Zivilsachen.',
        'Erfahrung mit Angelegenheiten zu Hochschulen, Rechten von Lehrkräften und Verwaltungsbeschwerden.',
      ],
      education: ['Bachelor of Laws (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Anwalt, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal mit langjähriger Tätigkeit als Senior Paralegal in mehreren Kanzleien, zuständig für Prozessunterstützung, Unternehmensrecht und ausländische Investitionen.',
        'Unterstützung bei Verfahren, Gesellschaftsgründung, Genehmigungen ausländischer Investitionen, Lizenzanträgen und dem Austausch zwischen Korea und Taiwan.',
      ],
      education: ['Bachelor of Laws (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordiniert Beratungstermine und die Kommunikation für Mandanten aus Korea.',
        'Unterstützt den Austausch zwischen den Bereichen über Dokumentensysteme und Arbeitsabläufe, auf Grundlage der Informatik.',
      ],
      education: ['Bachelor (B.S.) Informatik, National Cheng Kung University'],
      experience: ['Bereich Korea-Betrieb, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Hat Bachelor- und Masterprogramme in Rechnungswesen an der National Chengchi University abgeschlossen und leitet derzeit eine Wirtschaftsprüfungskanzlei.',
        'Unterstützt die integrierte Analyse rechtlicher, steuerlicher und finanzieller Risiken für Unternehmenskunden.',
      ],
      education: [
        'Magister (M.A.) Rechnungswesen, National Chengchi University',
        'Bachelor (B.A.) Rechnungswesen, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  es: {
    'tseng-junwei': {
      intro: [
        'El despacho atiende asuntos de empresas y de particulares en Taiwán en inglés, japonés, coreano y chino.',
        'Representó a un estudiante coreano en una reclamación de daños por una lesión en un gimnasio y obtuvo una sentencia de primera instancia de TWD 1.57M.',
      ],
      education: [
        'Máster (M.S.), Institute of Finance, National Taiwan University',
        'Grado (B.A.) con doble especialidad en Derecho y Finanzas, National Chengchi University',
        'Estudiante de intercambio en Kobe University y Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Trabajó antes en el Ministry of Education, Legal Affairs Division, centrado en conflictos administrativos y civiles.',
        'Tiene experiencia en asuntos de universidades, derechos del profesorado y reclamaciones administrativas.',
      ],
      education: ['Grado en Derecho (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Abogado, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal con años de trabajo como paralegal sénior en varios despachos, a cargo del apoyo procesal, del derecho de empresa y de la inversión extranjera.',
        'Apoya litigios, constitución de sociedades, trámites de aprobación de inversión extranjera, solicitudes de licencia y el intercambio entre Corea y Taiwán.',
      ],
      education: ['Grado en Derecho (LL.B.), Tunghai University'],
      experience: [
        'Paralegal sénior, Boyin Law Firm',
        'Paralegal sénior, Muyang International Law Firm',
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
        'Completó los programas de grado y máster en contabilidad en National Chengchi University y dirige actualmente un despacho de contabilidad.',
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
        'Elle a représenté un étudiant coréen dans une demande de dommages-intérêts pour une blessure en salle de sport et a obtenu un jugement de première instance de TWD 1.57M.',
      ],
      education: [
        'Master (M.S.), Institute of Finance, National Taiwan University',
        'Licence (B.A.) avec double cursus droit et finance, National Chengchi University',
        'Étudiante d’échange à Kobe University et Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Auparavant au Ministry of Education, Legal Affairs Division, avec un accent sur les affaires administratives et civiles.',
        'Expérience des affaires d’universités, des droits du personnel enseignant et des recours administratifs.',
      ],
      education: ['Licence en droit (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Avocat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal comptant de longues années d’expérience comme paralegal senior dans plusieurs cabinets, en charge de l’appui procédural, du droit des sociétés et de l’investissement étranger.',
        'Appui aux procédures, à la constitution de sociétés, aux autorisations d’investissement étranger, aux demandes de licence et aux échanges entre la Corée et Taïwan.',
      ],
      education: ['Licence en droit (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
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
        'A achevé les programmes de licence et de master en comptabilité à National Chengchi University et dirige actuellement un cabinet d’expertise comptable.',
        'Appuie l’analyse intégrée des risques juridiques, fiscaux et financiers pour les clients d’entreprise.',
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
        'Representou um estudante coreano numa pretensão de indemnização por uma lesão num ginásio e obteve uma sentença de primeira instância de TWD 1.57M.',
      ],
      education: [
        'Mestrado (M.S.), Institute of Finance, National Taiwan University',
        'Licenciatura (B.A.) com dupla especialização em Direito e Finanças, National Chengchi University',
        'Aluna de intercâmbio na Kobe University e na Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Trabalhou antes no Ministry of Education, Legal Affairs Division, centrado em conflitos administrativos e civis.',
        'Tem experiência em assuntos de universidades, direitos do pessoal docente e reclamações administrativas.',
      ],
      education: ['Licenciatura em Direito (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Advogado, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal com anos de trabalho como paralegal sénior em vários escritórios, a cargo do apoio processual, do direito de empresa e do investimento estrangeiro.',
        'Apoia litígios, constituição de sociedades, trâmites de aprovação de investimento estrangeiro, pedidos de licença e o intercâmbio entre a Coreia e Taiwan.',
      ],
      education: ['Licenciatura em Direito (LL.B.), Tunghai University'],
      experience: [
        'Paralegal sénior, Boyin Law Firm',
        'Paralegal sénior, Muyang International Law Firm',
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
        'Concluiu os programas de licenciatura e mestrado em contabilidade na National Chengchi University e dirige atualmente um escritório de contabilidade.',
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
        '曾代理一名韩国学生因健身房受伤提出的损害赔偿，并取得新台币 157 万元的一审判决。',
      ],
      education: [
        '硕士（M.S.），Institute of Finance, National Taiwan University',
        '学士（B.A.），政治大学法律与金融双主修',
        '神户大学与早稻田大学交换学生',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        '此前任职于教育部法制单位，侧重行政与民事事项。',
        '具有高校、教师权利与行政救济方面的经验。',
      ],
      education: ['法学学士（LL.B.），National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        '律师，Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        '律师助理，多年在多家事务所担任资深律师助理，负责诉讼支持、公司法与外资。',
        '协助程序、公司设立、外资核准、证照申请以及韩国与台湾之间的往来。',
      ],
      education: ['法学学士（LL.B.），Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        '协调韩国委托人的咨询行程与沟通。',
        '以信息科学为背景，通过文件系统与工作流程支持部门之间的往来。',
      ],
      education: ['学士（B.S.）信息科学，National Cheng Kung University'],
      experience: ['韩国运营部门，Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        '完成政治大学会计学学士与硕士课程，目前主持一家会计师事务所。',
        '协助企业客户进行法律、税务与财务风险的综合分析。',
      ],
      education: [
        '硕士（M.A.）会计，National Chengchi University',
        '学士（B.A.）会计，National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  ms: {
    'tseng-junwei': {
      intro: [
        'Firma mengendalikan hal syarikat dan individu di Taiwan dalam bahasa Inggeris, Jepun, Korea dan Cina.',
        'Mewakili seorang pelajar Korea dalam tuntutan ganti rugi kerana kecederaan di gimnasium dan memperoleh penghakiman peringkat pertama sebanyak TWD 1.57M.',
      ],
      education: [
        'Sarjana (M.S.), Institute of Finance, National Taiwan University',
        'Ijazah (B.A.) dengan pengajian berganda undang-undang dan kewangan, National Chengchi University',
        'Pelajar pertukaran di Kobe University dan Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Sebelum ini di Ministry of Education, Legal Affairs Division, dengan tumpuan pada hal pentadbiran dan sivil.',
        'Pengalaman dalam hal universiti, hak tenaga pengajar dan rayuan pentadbiran.',
      ],
      education: ['Ijazah Undang-undang (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Peguam, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal dengan bertahun-tahun sebagai paralegal kanan di beberapa firma, bertanggungjawab atas sokongan prosedur, undang-undang syarikat dan pelaburan asing.',
        'Sokongan bagi prosedur, penubuhan syarikat, kelulusan pelaburan asing, permohonan lesen dan pertukaran antara Korea dan Taiwan.',
      ],
      education: ['Ijazah Undang-undang (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Menyelaras janji temu perundingan dan komunikasi untuk klien dari Korea.',
        'Menyokong pertukaran antara pasukan melalui sistem dokumen dan aliran kerja, berasaskan sains komputer.',
      ],
      education: ['Ijazah (B.S.) sains komputer, National Cheng Kung University'],
      experience: ['Bahagian operasi Korea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Telah menamatkan program ijazah dan sarjana perakaunan di National Chengchi University dan kini mengetuai sebuah firma perakaunan.',
        'Menyokong analisis bersepadu risiko undang-undang, cukai dan kewangan untuk klien syarikat.',
      ],
      education: [
        'Sarjana (M.A.) perakaunan, National Chengchi University',
        'Ijazah (B.A.) perakaunan, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  ru: {
    'tseng-junwei': {
      intro: [
        'Фирма ведёт дела компаний и частных лиц на Тайване на английском, японском, корейском и китайском языках.',
        'Она представляла корейского студента в требовании о возмещении вреда из-за травмы в спортивном зале и добилась решения первой инстанции на TWD 1.57M.',
      ],
      education: [
        'Магистр (M.S.), Institute of Finance, National Taiwan University',
        'Бакалавр (B.A.) с двойным обучением по праву и финансам, National Chengchi University',
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
        'Ранее в Ministry of Education, Legal Affairs Division, с упором на административные и гражданские дела.',
        'Опыт в делах вузов, правах преподавателей и административных жалобах.',
      ],
      education: ['Бакалавр права (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Адвокат, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Помощник адвоката с многолетней работой старшим помощником в нескольких фирмах, отвечает за процессуальную поддержку, корпоративное право и иностранные инвестиции.',
        'Поддержка процедур, учреждения компаний, разрешений на иностранные инвестиции, заявок на лицензии и обмена между Кореей и Тайванем.',
      ],
      education: ['Бакалавр права (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Координирует записи на консультацию и общение для доверителей из Кореи.',
        'Поддерживает обмен между подразделениями через системы документов и рабочие процессы, на основе информатики.',
      ],
      education: ['Бакалавр (B.S.) информатики, National Cheng Kung University'],
      experience: ['Направление операций Кореи, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Завершил программы бакалавриата и магистратуры по бухгалтерскому учёту в National Chengchi University и в настоящее время руководит бухгалтерской фирмой.',
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
        'Spor salonunda yaralanma nedeniyle bir Koreli öğrenciyi tazminat isteminde temsil etti ve TWD 1.57M tutarında ilk derece kararı aldı.',
      ],
      education: [
        'Yüksek lisans (M.S.), Institute of Finance, National Taiwan University',
        'Lisans (B.A.), National Chengchi University’de hukuk ve finans çift programı',
        'Kobe University ve Waseda University’de değişim öğrencisi',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Daha önce Ministry of Education, Legal Affairs Division’da, idare ve hukuk işlerine odaklanarak çalıştı.',
        'Üniversiteler, öğretim elemanı hakları ve idari başvurular konusunda deneyimi vardır.',
      ],
      education: ['Hukuk lisansı (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Avukat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Birden fazla büroda kıdemli paralegal olarak uzun yıllar çalışmış, usul desteği, şirket hukuku ve yabancı yatırımından sorumlu paralegal.',
        'Usullere, şirket kuruluşuna, yabancı yatırım onaylarına, ruhsat başvurularına ve Kore ile Tayvan arasındaki alışverişe destek verir.',
      ],
      education: ['Hukuk lisansı (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Kore’den gelen müvekkiller için görüşme randevularını ve iletişimi koordine eder.',
        'Bilgisayar bilimine dayalı olarak, belge sistemleri ve iş akışları üzerinden ekipler arası alışverişi destekler.',
      ],
      education: ['Lisans (B.S.) bilgisayar bilimi, National Cheng Kung University'],
      experience: ['Kore operasyonları alanı, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'National Chengchi University’de muhasebe lisans ve yüksek lisans programlarını tamamladı ve şu anda bir muhasebe bürosu yönetmektedir.',
        'Kurumsal müvekkiller için hukuki, vergi ve mali risklerin bütünleşik analizini destekler.',
      ],
      education: [
        'Yüksek lisans (M.A.) muhasebe, National Chengchi University',
        'Lisans (B.A.) muhasebe, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  it: {
    'tseng-junwei': {
      intro: [
        'Lo studio tratta questioni di imprese e di privati a Taiwan in inglese, giapponese, coreano e cinese.',
        'Ha rappresentato uno studente coreano in una domanda di risarcimento per una lesione in una palestra e ha ottenuto una sentenza di primo grado di TWD 1.57M.',
      ],
      education: [
        'Master (M.S.), Institute of Finance, National Taiwan University',
        'Laurea (B.A.) con doppio percorso in diritto e finanza, National Chengchi University',
        'Studentessa in scambio alla Kobe University e alla Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Precedentemente al Ministry of Education, Legal Affairs Division, con attenzione a questioni amministrative e civili.',
        'Esperienza in questioni relative alle università, ai diritti del personale docente e ai ricorsi amministrativi.',
      ],
      education: ['Laurea in giurisprudenza (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Avvocato, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal con lunga attività come senior paralegal in più studi, responsabile del supporto processuale, del diritto societario e degli investimenti esteri.',
        'Supporto a procedimenti, costituzione di società, autorizzazioni di investimenti esteri, domande di licenza e allo scambio tra Corea e Taiwan.',
      ],
      education: ['Laurea in giurisprudenza (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Coordina gli appuntamenti di consulenza e la comunicazione per i clienti dalla Corea.',
        'Sostiene lo scambio tra le aree tramite sistemi documentali e flussi di lavoro, sulla base dell’informatica.',
      ],
      education: ['Laurea (B.S.) in informatica, National Cheng Kung University'],
      experience: ['Area operazioni Corea, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Ha concluso i programmi di laurea e master in contabilità alla National Chengchi University e dirige attualmente uno studio di revisione.',
        'Sostiene l’analisi integrata dei rischi giuridici, fiscali e finanziari per i clienti d’impresa.',
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
        'Zij vertegenwoordigde een Koreaanse student in een schadevergoedingsvordering wegens een letsel in een fitnesszaal en verkreeg een vonnis in eerste aanleg van TWD 1.57M.',
      ],
      education: [
        'Master (M.S.), Institute of Finance, National Taiwan University',
        'Bachelor (B.A.) met dubbel traject recht en financiën, National Chengchi University',
        'Uitwisselingsstudente aan de Kobe University en de Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Eerder werkzaam bij het Ministry of Education, Legal Affairs Division, met nadruk op bestuurs- en civiele zaken.',
        'Ervaring met zaken over hogescholen, rechten van onderwijspersoneel en bestuursrechtelijke klachten.',
      ],
      education: ['Bachelor of Laws (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Advocaat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal met langdurige werkzaamheid als senior paralegal in meerdere kantoren, verantwoordelijk voor procedurele ondersteuning, vennootschapsrecht en buitenlandse investeringen.',
        'Ondersteuning bij procedures, oprichting van vennootschappen, vergunningen voor buitenlandse investeringen, licentieaanvragen en de uitwisseling tussen Korea en Taiwan.',
      ],
      education: ['Bachelor of Laws (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Coördineert consultatieafspraken en de communicatie voor cliënten uit Korea.',
        'Ondersteunt de uitwisseling tussen afdelingen via documentsystemen en werkstromen, op basis van informatica.',
      ],
      education: ['Bachelor (B.S.) informatica, National Cheng Kung University'],
      experience: ['Gebied Korea-operaties, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Heeft bachelor- en masterprogramma’s in accountancy aan de National Chengchi University afgerond en leidt thans een accountantskantoor.',
        'Ondersteunt de geïntegreerde analyse van juridische, fiscale en financiële risico’s voor ondernemingscliënten.',
      ],
      education: [
        'Master (M.A.) accountancy, National Chengchi University',
        'Bachelor (B.A.) accountancy, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  pl: {
    'tseng-junwei': {
      intro: [
        'Kancelaria prowadzi sprawy przedsiębiorstw i osób prywatnych na Tajwanie po angielsku, japońsku, koreańsku i chińsku.',
        'Reprezentowała koreańskiego studenta w żądaniu odszkodowania z powodu urazu na siłowni i uzyskała wyrok pierwszej instancji na TWD 1.57M.',
      ],
      education: [
        'Magister (M.S.), Institute of Finance, National Taiwan University',
        'Licencjat (B.A.) z podwójnym tokiem prawo i finanse, National Chengchi University',
        'Studentka wymiany na Kobe University i Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Wcześniej w Ministry of Education, Legal Affairs Division, ze szczególnym uwzględnieniem spraw administracyjnych i cywilnych.',
        'Doświadczenie w sprawach uczelni, praw nauczycieli i skarg administracyjnych.',
      ],
      education: ['Licencjat prawa (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Adwokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal z wieloletnią pracą jako starszy paralegal w kilku kancelariach, odpowiedzialny za wsparcie procesowe, prawo spółek i inwestycje zagraniczne.',
        'Wsparcie postępowań, zakładania spółek, zezwoleń na inwestycje zagraniczne, wniosków o licencje oraz wymiany między Koreą a Tajwanem.',
      ],
      education: ['Licencjat prawa (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordynuje terminy konsultacji i komunikację dla klientów z Korei.',
        'Wspiera wymianę między działami przez systemy dokumentów i tok pracy, na podstawie informatyki.',
      ],
      education: ['Licencjat (B.S.) informatyki, National Cheng Kung University'],
      experience: ['Obszar operacji Korei, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Ukończył programy licencjackie i magisterskie z rachunkowości na National Chengchi University i obecnie kieruje biurem rachunkowym.',
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
        'उन्होंने एक कोरियाई छात्र का व्यायामशाला में चोट के हर्जाने के दावे में प्रतिनिधित्व किया और प्रथम न्यायाधीश में TWD 1.57M का निर्णय प्राप्त किया।',
      ],
      education: [
        'स्नातकोत्तर (M.S.), Institute of Finance, National Taiwan University',
        'स्नातक (B.A.) विधि और वित्त के दोहरे पथ के साथ, National Chengchi University',
        'Kobe University और Waseda University में विनिमय छात्रा',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'पहले Ministry of Education, Legal Affairs Division में, प्रशासनिक और दीवानी मामलों पर ध्यान के साथ।',
        'विश्वविद्यालयों, शिक्षण कर्मचारियों के अधिकारों और प्रशासनिक अपीलों से जुड़े मामलों का अनुभव।',
      ],
      education: ['विधि स्नातक (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'अधिवक्ता, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal जिन्होंने कई कार्यालयों में वरिष्ठ paralegal के रूप में लंबे समय तक कार्य किया, प्रक्रिया सहायता, कंपनी विधि और विदेशी निवेश के लिए उत्तरदायी।',
        'कार्यवाही, कंपनी स्थापना, विदेशी निवेश अनुमति, लाइसेंस आवेदन तथा कोरिया और ताइवान के बीच आदान-प्रदान में सहायता।',
      ],
      education: ['विधि स्नातक (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'कोरिया से आए मुवक्किलों के परामर्श समय और संचार का समन्वय करते हैं।',
        'सूचना विज्ञान के आधार पर दस्तावेज़ प्रणालियों और कार्य प्रवाह से क्षेत्रों के बीच आदान-प्रदान का समर्थन करते हैं।',
      ],
      education: ['स्नातक (B.S.) सूचना विज्ञान, National Cheng Kung University'],
      experience: ['कोरिया संचालन क्षेत्र, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'National Chengchi University से लेखा में स्नातक और स्नातकोत्तर कार्यक्रम पूरे किए और वर्तमान में एक लेखा कार्यालय का नेतृत्व करते हैं।',
        'उद्यमी मुवक्किलों के लिए कानूनी, कर और वित्तीय जोखिमों का एकीकृत विश्लेषण समर्थन करते हैं।',
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
        'Hon företrädde en koreansk student i ett skadeståndsanspråk efter en skada i ett gym och erhöll en dom i första instans på TWD 1.57M.',
      ],
      education: [
        'Master (M.S.), Institute of Finance, National Taiwan University',
        'Kandidatexamen (B.A.) med dubbel inriktning rätt och finans, National Chengchi University',
        'Utbytesstudent vid Kobe University och Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Tidigare vid Ministry of Education, Legal Affairs Division, med tonvikt på förvaltnings- och civilrättsliga ärenden.',
        'Erfarenhet av ärenden om högskolor, lärares rättigheter och förvaltningsrättsliga klagomål.',
      ],
      education: ['Juridisk kandidatexamen (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Advokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal med lång verksamhet som senior paralegal vid flera byråer, ansvarig för processstöd, bolagsrätt och utländska investeringar.',
        'Stöd vid förfaranden, bolagsbildning, tillstånd för utländska investeringar, licensansökningar och utbytet mellan Korea och Taiwan.',
      ],
      education: ['Juridisk kandidatexamen (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Samordnar rådgivningstider och kommunikationen för klienter från Korea.',
        'Stödjer utbytet mellan områden via dokumentsystem och arbetsflöden, utifrån datavetenskap.',
      ],
      education: ['Kandidatexamen (B.S.) i datavetenskap, National Cheng Kung University'],
      experience: ['Område Korea-verksamhet, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Har slutfört kandidat- och masterprogram i redovisning vid National Chengchi University och leder nu en revisionsbyrå.',
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
        'Hun repræsenterede en koreansk studerende i et erstatningskrav efter en skade i et fitnesscenter og opnåede en dom i første instans på TWD 1.57M.',
      ],
      education: [
        'Kandidat (M.S.), Institute of Finance, National Taiwan University',
        'Bachelor (B.A.) med dobbelt spor ret og finans, National Chengchi University',
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
        'Tidligere ved Ministry of Education, Legal Affairs Division, med vægt på forvaltnings- og civilretlige sager.',
        'Erfaring med sager om universiteter, undervisningspersonalets rettigheder og forvaltningsretlige klager.',
      ],
      education: ['Juridisk bachelor (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Advokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal med lang virksomhed som senior paralegal ved flere kontorer, ansvarlig for processuel støtte, selskabsret og udenlandske investeringer.',
        'Støtte ved procedurer, selskabsstiftelse, tilladelser til udenlandske investeringer, licensansøgninger og udvekslingen mellem Korea og Taiwan.',
      ],
      education: ['Juridisk bachelor (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinerer rådgivningstider og kommunikationen for klienter fra Korea.',
        'Støtter udvekslingen mellem områder via dokumentsystemer og arbejdsgange, på grundlag af datalogi.',
      ],
      education: ['Bachelor (B.S.) i datalogi, National Cheng Kung University'],
      experience: ['Område Korea-drift, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Har afsluttet bachelor- og kandidatprogrammer i regnskab ved National Chengchi University og leder nu et revisionskontor.',
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
        'Kontoret behandler virksomhets- og individuelle saker i Taiwan på engelsk, japansk, koreansk og kinesisk.',
        'Hun representerte en koreansk student i et erstatningskrav etter en skade i et treningssenter og oppnådde en dom i første instans på TWD 1.57M.',
      ],
      education: [
        'Master (M.S.), Institute of Finance, National Taiwan University',
        'Bachelor (B.A.) med dobbelt løp rett og finans, National Chengchi University',
        'Utvekslingsstudent ved Kobe University og Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Tidligere ved Ministry of Education, Legal Affairs Division, med vekt på forvaltnings- og sivilrettslige saker.',
        'Erfaring med saker om universiteter, undervisningspersonalets rettigheter og forvaltningsrettslige klager.',
      ],
      education: ['Juridisk bachelor (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Advokat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal med lang virksomhet som senior paralegal ved flere kontorer, ansvarlig for prosessuell støtte, selskapsrett og utenlandske investeringer.',
        'Støtte ved prosedyrer, selskapsstiftelse, tillatelser til utenlandske investeringer, lisenssøknader og utvekslingen mellom Korea og Taiwan.',
      ],
      education: ['Juridisk bachelor (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinerer rådgivningstider og kommunikasjonen for klienter fra Korea.',
        'Støtter utvekslingen mellom områder via dokumentsystemer og arbeidsflyter, på grunnlag av informatikk.',
      ],
      education: ['Bachelor (B.S.) i informatikk, National Cheng Kung University'],
      experience: ['Område Korea-drift, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'Har fullført bachelor- og masterprogrammer i regnskap ved National Chengchi University og leder nå et revisjonskontor.',
        'Støtter den integrerte analysen av juridiske, skattemessige og finansielle risikoer for virksomhetsklienter.',
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
        'Hän edusti korealaista opiskelijaa kuntosalilla sattunutta vammaa koskevassa vahingonkorvausasiassa ja sai päämiehelleen ensimmäisen asteen tuomion, jossa korvaukseksi määrättiin 1,57 miljoonaa TWD.',
      ],
      education: [
        'Maisteri (M.S.), Institute of Finance, National Taiwan University',
        'Oikeustieteen ja rahoituksen kaksoistutkinto (B.A.), National Chengchi University',
        'Vaihto-opiskelija Kobe Universityssä ja Waseda Universityssä',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Aiemmin Ministry of Education, Legal Affairs Divisionissa, painotuksena hallinto- ja siviiliasiat.',
        'Kokemusta yliopistoja, opetushenkilöstön oikeuksia ja hallintovalituksia koskevista asioista.',
      ],
      education: ['Oikeustieteen kandidaatti (LL.B.), National Chung Hsing University'],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Asianajaja, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal, jolla on pitkä toiminta vanhempana paralegalina useissa toimistoissa, vastuussa prosessituesta, yhtiöoikeudesta ja ulkomaisista investoinneista.',
        'Tuki menettelyissä, yhtiön perustamisessa, ulkomaisten investointien luvissa, lupahakemuksissa sekä Korean ja Taiwanin vaihdossa.',
      ],
      education: ['Oikeustieteen kandidaatti (LL.B.), Tunghai University'],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinoi neuvonta-aikoja ja viestintää Koreasta tuleville päämiehille.',
        'Tukee alueiden välistä vaihtoa asiakirjajärjestelmien ja työnkulkujen kautta, tietojenkäsittelytieteen pohjalta.',
      ],
      education: ['Kandidaatti (B.S.) tietojenkäsittelytieteessä, National Cheng Kung University'],
      experience: ['Korean toimintojen alue, Hovering International Law Firm'],
    },
    'huang-shengping': {
      intro: [
        'On suorittanut kandidaatti- ja maisteriohjelmat kirjanpidossa National Chengchi Universityssä ja johtaa nyt tilitoimistoa.',
        'Tukee oikeudellisten, verotuksellisten ja taloudellisten riskien integroitua analyysia yritysasiakkaille.',
      ],
      education: [
        'Maisteri (M.A.) kirjanpidossa, National Chengchi University',
        'Kandidaatti (B.A.) kirjanpidossa, National Chengchi University',
      ],
      experience: ['Chinshin CPA Firm'],
    },
  },
  cs: {
    'tseng-junwei': {
      intro: [
        'Kancelář vede věci podniků a soukromých osob na Tchaj-wanu v angličtině, japonštině, korejštině a čínštině.',
        'Zastupovala korejského studenta v nároku na náhradu škody za úraz v posilovně a dosáhla rozsudku prvního stupně ve výši TWD 1.57M.',
      ],
      education: [
        'Magistr (M.S.), Institute of Finance, National Taiwan University',
        'Bakalář (B.A.) v dvojím programu práva a financí, National Chengchi University',
        'Výměnné studium na Kobe University a Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Dříve na Ministry of Education, Legal Affairs Division, se zaměřením na správní a občanskoprávní věci.',
        'Zkušenost s věcmi univerzit, práv pedagogů a správních odvolání.',
      ],
      education: [
        'Bakalář práv (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Advokát, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal s dlouhou praxí jako senior paralegal ve více kancelářích, odpovědný za procesní podporu, právo obchodních společností a zahraniční investice.',
        'Podpora v řízeních, při zakládání společností, u povolení zahraničních investic, u žádostí o licence a při výměně mezi Koreou a Tchaj-wanem.',
      ],
      education: [
        'Bakalář práv (LL.B.), Tunghai University',
      ],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Koordinuje termíny porad a komunikaci pro klienty z Koreje.',
        'Podporuje meziregionální výměnu prostřednictvím systémů dokumentů a pracovních postupů, na základě informatiky.',
      ],
      education: [
        'Bakalář (B.S.) v informatice, National Cheng Kung University',
      ],
      experience: [
        'Úsek korejských operací, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'Absolvoval bakalářský a magisterský program účetnictví na National Chengchi University a nyní vede účetní kancelář.',
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
        'Az iroda vállalatok és magánszemélyek tajvani ügyeit viszi angolul, japánul, koreaiul és kínaiul.',
        'Koreai hallgatót képviselt edzőtermi sérülés miatti kártérítési igényben, és első fokon TWD 1.57M összegű ítéletet ért el.',
      ],
      education: [
        'Mesterfokozat (M.S.), Institute of Finance, National Taiwan University',
        'Alapfokozat (B.A.) jogi és pénzügyi kettős képzésben, National Chengchi University',
        'Csereösztöndíj a Kobe Universityn és a Waseda Universityn',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Korábban a Ministry of Education, Legal Affairs Division munkatársa, közigazgatási és polgári ügyekre összpontosítva.',
        'Tapasztalat egyetemeket, oktatói jogokat és közigazgatási fellebbezéseket érintő ügyekben.',
      ],
      education: [
        'Jogi alapfokozat (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Ügyvéd, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal, aki több irodában dolgozott vezető paralegalként, eljárási támogatásért, társasági jogért és külföldi befektetésekért felelve.',
        'Támogatás eljárásokban, cégalapításban, külföldi befektetési engedélyekben, engedélykérelmekben, valamint a koreai–tajvani kapcsolatokban.',
      ],
      education: [
        'Jogi alapfokozat (LL.B.), Tunghai University',
      ],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Egyezteti a tanácsadási időpontokat és a kommunikációt a koreai ügyfelek számára.',
        'Dokumentumrendszerekkel és munkafolyamatokkal támogatja a régiók közötti együttműködést, informatikai háttérrel.',
      ],
      education: [
        'Alapfokozat (B.S.) informatikából, National Cheng Kung University',
      ],
      experience: [
        'Koreai működési terület, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'A National Chengchi University számviteli alap- és mesterképzését végezte el, jelenleg könyvelőirodát vezet.',
        'Vállalati ügyfeleknek jogi, adózási és pénzügyi kockázatok együttes elemzését támogatja.',
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
        'A reprezentat un student coreean într-o cerere de despăgubire pentru o vătămare la sală și a obținut o hotărâre în primă instanță de TWD 1.57M.',
      ],
      education: [
        'Master (M.S.), Institute of Finance, National Taiwan University',
        'Licență (B.A.) în dublu program de drept și finanțe, National Chengchi University',
        'Studii de schimb la Kobe University și Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Anterior la Ministry of Education, Legal Affairs Division, cu accent pe cauze administrative și civile.',
        'Experiență în cauze privind universități, drepturile cadrelor didactice și contestații administrative.',
      ],
      education: [
        'Licență în drept (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Avocat, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal cu activitate îndelungată ca paralegal senior în mai multe cabinete, responsabil de sprijin procedural, drept societar și investiții străine.',
        'Sprijin în proceduri, la înființarea de societăți, la aprobările pentru investiții străine, la cererile de licență și în schimburile dintre Coreea și Taiwan.',
      ],
      education: [
        'Licență în drept (LL.B.), Tunghai University',
      ],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Coordonează programările pentru consultanță și comunicarea pentru clienții din Coreea.',
        'Sprijină schimbul interregional prin sisteme de documente și fluxuri de lucru, pe fond de informatică.',
      ],
      education: [
        'Licență (B.S.) în informatică, National Cheng Kung University',
      ],
      experience: [
        'Zona de operațiuni din Coreea, Hovering International Law Firm',
      ],
    },
    'huang-shengping': {
      intro: [
        'A absolvit programele de licență și de master în contabilitate la National Chengchi University și conduce acum un cabinet de contabilitate.',
        'Sprijină analiza integrată a riscurilor juridice, fiscale și financiare pentru clienții companii.',
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
        'Бакалавр (B.A.) подвійної програми права та фінансів, National Chengchi University',
        'Навчання за обміном у Kobe University та Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Раніше в Ministry of Education, Legal Affairs Division, з акцентом на адміністративні та цивільні справи.',
        'Досвід у справах щодо університетів, прав викладачів та адміністративних оскаржень.',
      ],
      education: [
        'Бакалавр права (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Адвокат, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal із тривалою працею старшим paralegal у кількох фірмах, відповідальний за процесуальну підтримку, корпоративне право та іноземні інвестиції.',
        'Підтримка в провадженнях, у створенні товариств, у погодженнях іноземних інвестицій, у заявах на ліцензії та в обміні між Кореєю і Тайванем.',
      ],
      education: [
        'Бакалавр права (LL.B.), Tunghai University',
      ],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Узгоджує час консультацій і спілкування для клієнтів із Кореї.',
        'Підтримує міжрегіональний обмін через системи документів і робочі процеси, маючи підготовку з інформатики.',
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
        'Εκπροσώπησε Κορεάτη φοιτητή σε αξίωση αποζημίωσης για τραυματισμό σε γυμναστήριο και πέτυχε πρωτόδικη απόφαση TWD 1.57M.',
      ],
      education: [
        'Μεταπτυχιακό (M.S.), Institute of Finance, National Taiwan University',
        'Πτυχίο (B.A.) σε διπλό πρόγραμμα νομικής και χρηματοοικονομικών, National Chengchi University',
        'Ανταλλαγή σπουδών στο Kobe University και στο Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'Παλαιότερα στο Ministry of Education, Legal Affairs Division, με έμφαση σε διοικητικές και αστικές υποθέσεις.',
        'Εμπειρία σε υποθέσεις πανεπιστημίων, δικαιωμάτων διδακτικού προσωπικού και διοικητικών προσφυγών.',
      ],
      education: [
        'Πτυχίο νομικής (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'Δικηγόρος, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal με μακρά θητεία ως ανώτερος paralegal σε περισσότερα γραφεία, με ευθύνη για δικονομική υποστήριξη, εταιρικό δίκαιο και ξένες επενδύσεις.',
        'Υποστήριξη σε διαδικασίες, στη σύσταση εταιρειών, σε εγκρίσεις ξένων επενδύσεων, σε αιτήσεις αδειών και στην ανταλλαγή Κορέας–Ταϊβάν.',
      ],
      education: [
        'Πτυχίο νομικής (LL.B.), Tunghai University',
      ],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
      ],
    },
    'son-jungmin': {
      intro: [
        'Συντονίζει τα ραντεβού συμβουλευτικής και την επικοινωνία για εντολείς από την Κορέα.',
        'Υποστηρίζει τη διαπεριφερειακή ανταλλαγή μέσω συστημάτων εγγράφων και ροών εργασίας, με υπόβαθρο πληροφορικής.',
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
        'Ολοκλήρωσε προπτυχιακό και μεταπτυχιακό πρόγραμμα λογιστικής στο National Chengchi University και διευθύνει τώρα λογιστικό γραφείο.',
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
        'מוסמך (M.S.), Institute of Finance, National Taiwan University',
        'בוגר (B.A.) במסלול כפול של משפטים ומימון, National Chengchi University',
        'לימודי חילופין ב־Kobe University וב־Waseda University',
      ],
      experience: [
        'Trend Law Office',
        'Hovering International Law Firm',
        'Legal Aid Foundation, Taichung Branch',
      ],
    },
    'chang-rongxuan': {
      intro: [
        'בעבר ב־Ministry of Education, Legal Affairs Division, בדגש על עניינים מנהליים ואזרחיים.',
        'ניסיון בעניינים הנוגעים לאוניברסיטאות, לזכויות סגל ההוראה ולעררים מנהליים.',
      ],
      education: [
        'בוגר משפטים (LL.B.), National Chung Hsing University',
      ],
      experience: [
        'Ministry of Education, Legal Affairs Division',
        'עורך דין, Hovering International Law Firm',
      ],
    },
    'chang-fangyu': {
      intro: [
        'Paralegal בעל ותק רב כ־paralegal בכיר בכמה משרדים, האחראי לתמיכה דיונית, לדיני חברות ולהשקעות זרות.',
        'תמיכה בהליכים, בהקמת חברות, באישורי השקעות זרות, בבקשות לרישיונות ובקשרים שבין קוריאה לטאיוואן.',
      ],
      education: [
        'בוגר משפטים (LL.B.), Tunghai University',
      ],
      experience: [
        'Senior Paralegal, Boyin Law Firm',
        'Senior Paralegal, Muyang International Law Firm',
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
        'סיים תוכניות בוגר ומוסמך בחשבונאות ב־National Chengchi University וכיום מנהל משרד ראיית חשבון.',
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
