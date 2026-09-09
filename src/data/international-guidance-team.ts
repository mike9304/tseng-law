import type { GuidanceLocale } from '@/data/international-guidance-content';

/**
 * Display copy for the team roster rendered on the guidance-locale
 * `lawyers` and `about` pages (vi/id/th/fil).
 *
 * WHAT THIS FILE MAY CONTAIN
 * --------------------------
 * Only *display* strings: section headings, group headings, field labels,
 * image alt-text patterns, and the job titles the firm already publishes in
 * `src/data/team-members.ts`. Nothing here is a new fact about the firm, an
 * attorney, a qualification, a case, a year, or a language capability.
 *
 * WHAT THIS FILE MUST NOT CONTAIN
 * -------------------------------
 * Biographical sentences. The intro / education / experience lines are read
 * verbatim from `teamContent.en` — the firm's canonical record — and rendered
 * unchanged, with `sourceLanguageNote` telling the reader in their own
 * language that those lines are the English original. That mirrors the
 * `columnsOriginalLanguageBadge` convention the guidance home already uses for
 * untranslated columns, and it keeps credentials from drifting through a
 * translation nobody on the team can proof-read.
 *
 * CONSULTATION LANGUAGES
 * ----------------------
 * The roster makes no claim about which languages a consultation happens in.
 * That statement stays where it already is: `pages.lawyers.sections` and the
 * closing contact band, which name English, Chinese, Japanese and Korean only.
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
  /** Roster heading. */
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
  /** Told to the reader before the English-original biography lines. */
  sourceLanguageNote: string;
  /** Leading word of a portrait `alt`: "<prefix>: <name>, <role>". */
  photoAltPrefix: string;
  /** Neutral label above a member's language list. Never a verb. */
  workingLanguagesLabel: string;
  /** Link label for the English-only full profile page. */
  fullProfileLabel: string;
  /**
   * Job titles. Each is a plain translation of the title the firm already
   * publishes in English, followed by that English title in brackets so the
   * canonical wording travels with it. The two attorney titles carry an
   * explicit "in Taiwan" qualifier because the only qualification claimed
   * anywhere on this site is a Taiwan one; the paralegal, operations manager
   * and CPA titles are NOT raised into attorney vocabulary.
   */
  roles: Record<GuidanceTeamMemberId, string>;
}

export const guidanceTeamCopy: Record<GuidanceLocale, GuidanceTeamCopy> = {
  vi: {
    label: 'OUR TEAM',
    title: 'Đội ngũ quốc tế Hovering',
    description:
      'Hồ sơ của các luật sư, quản lý nghiệp vụ và kế toán viên hợp tác của Hovering.',
    representativeTitle: 'Luật sư đại diện',
    teamTitle: 'Luật sư và nhân viên',
    partnerTitle: 'Kế toán viên hợp tác',
    introLabel: 'Giới thiệu',
    educationLabel: 'Học vấn',
    experienceLabel: 'Kinh nghiệm',
    sourceLanguageNote:
      'Phần giới thiệu, học vấn và kinh nghiệm dưới đây được giữ nguyên bằng tiếng Anh theo hồ sơ chính thức của văn phòng.',
    photoAltPrefix: 'Ảnh',
    workingLanguagesLabel: 'Ngôn ngữ làm việc',
    fullProfileLabel: 'Hồ sơ đầy đủ (English)',
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
    sourceLanguageNote:
      'Bagian perkenalan, pendidikan, dan pengalaman di bawah ini ditampilkan dalam bahasa Inggris sesuai catatan resmi kantor.',
    photoAltPrefix: 'Foto',
    workingLanguagesLabel: 'Bahasa kerja',
    fullProfileLabel: 'Profil lengkap (English)',
    roles: {
      'tseng-junwei': 'Advokat pengelola di Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Advokat di Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal (Paralegal)',
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
    sourceLanguageNote:
      'ส่วนแนะนำ การศึกษา และประสบการณ์ด้านล่างแสดงเป็นภาษาอังกฤษตามข้อมูลทางการของสำนักงาน',
    photoAltPrefix: 'ภาพ',
    workingLanguagesLabel: 'ภาษาที่ใช้ทำงาน',
    fullProfileLabel: 'ประวัติฉบับเต็ม (English)',
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
    sourceLanguageNote:
      'Ang panimula, edukasyon, at karanasan sa ibaba ay ipinapakita sa Ingles ayon sa opisyal na tala ng tanggapan.',
    photoAltPrefix: 'Larawan',
    workingLanguagesLabel: 'Mga wikang ginagamit sa trabaho',
    fullProfileLabel: 'Buong profile (English)',
    roles: {
      'tseng-junwei': 'Namamahalang abogado sa Taiwan (Managing Attorney)',
      'chang-rongxuan': 'Abogado sa Taiwan (Taiwan Attorney)',
      'chang-fangyu': 'Paralegal (Paralegal)',
      'son-jungmin': 'Tagapamahala ng operasyon sa Korea (Korea Operations Manager)',
      'huang-shengping': 'Kasosyong akawntant (Partner CPA)',
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
