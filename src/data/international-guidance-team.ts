import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import type { GuidanceLocale } from '@/data/international-guidance-content';

/**
 * Display copy AND localized biographies for the team roster rendered on the
 * guidance-locale `lawyers` and `about` pages (vi/id/th/fil).
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
   * Indonesian (Permenkumham 1/2018) and in Filipino (IBP/PAO usage) — the
   * bracket is omitted, because a gloss repeating the same word is noise and
   * a coined descriptive phrase would read as less native, not more.
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
    label: 'OUR TEAM',
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
    label: 'OUR TEAM',
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
    label: 'OUR TEAM',
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
    label: 'OUR TEAM',
    title: 'Pandaigdigang koponan ng Hovering',
    description:
      'Mga profile ng mga abogado, tagapamahala ng operasyon, at kasosyong akawntant ng Hovering.',
    representativeTitle: 'Namamahalang abogado',
    teamTitle: 'Mga abogado at kawani',
    partnerTitle: 'Kasosyong akawntant',
    introLabel: 'Panimula',
    educationLabel: 'Edukasyon',
    experienceLabel: 'Karanasan',
    photoAltPrefix: 'Larawan',
    workingLanguagesLabel: 'Mga wikang ginagamit sa trabaho',
    fullProfileLabel: 'Buong profile (English)',
    keyFactsHeading: 'Abogadong Wei Tseng — Mahahalagang impormasyon',
    qualificationLabel: 'Kwalipikasyon at tanggapan',
    qualificationSentence:
      'Si {name} ay abogadong kwalipikado sa Taiwan at ang namamahalang abogado ng {firm}.',
    practiceLabel: 'Pangunahing larangan',
    consultationLanguagesLabel: 'Wika ng konsultasyon',
    roles: {
      'tseng-junwei': 'Namamahalang abogado sa Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Abogado sa Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal',
      'son-jungmin': 'Tagapamahala ng operasyong Korea (Korea Operations Manager)',
      'huang-shengping': 'Kasosyong akawntant (Partner CPA)',
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
 * Biographies for the four guidance languages, one entry per member id and one
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
