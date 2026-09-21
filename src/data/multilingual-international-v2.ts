/**
 * MULTILINGUAL-INTERNATIONAL-v2 unpublished candidate constants.
 * New/substantive copy is review-gated. Consultation languages stay four.
 */

import type { GuidanceLocale } from '@/data/international-guidance-content';
import {
  EN_COMPANY_GUIDE_PATH,
  EN_COMPANY_SETUP_PATH,
  EN_LITIGATION_PATH,
  EN_PATH_LABELS,
} from '@/data/en-international-paths';
import type { SiteLocale } from '@/lib/locales';

export const ML_INTERNATIONAL_REVIEW = {
  review_status: 'NEEDS_LAWYER_REVIEW',
  human_review_required: true,
  publish: false,
} as const;

export const CONSULTATION_LANGUAGE_CODES = ['en', 'zh-hant', 'ja', 'ko'] as const;

export const DEBT_RECOVERY_SITUATION_IDS = [
  'unpaid-invoices',
  'advance-undelivered',
  'defective-inspection',
  'delay-breach',
  'no-response',
] as const;

export type CoreHomePaths = {
  companySetup: { label: string; href: string };
  dispute: { label: string; href: string };
  guide: { label: string; href: string };
  ariaLabel: string;
};

export const CORE_HOME_PATHS: Record<SiteLocale, CoreHomePaths> = {
  en: {
    companySetup: { label: EN_PATH_LABELS.companySetup, href: EN_COMPANY_SETUP_PATH },
    dispute: { label: EN_PATH_LABELS.dispute, href: EN_LITIGATION_PATH },
    guide: { label: EN_PATH_LABELS.companyGuide, href: EN_COMPANY_GUIDE_PATH },
    ariaLabel: 'Company setup and dispute paths',
  },
  ja: {
    companySetup: {
      label: '台湾での会社設立を相談する',
      href: '/ja/taiwan-company-setup-lawyer',
    },
    dispute: {
      label: '台湾でのトラブルを相談する',
      href: '/ja/taiwan-litigation-lawyer',
    },
    guide: {
      label: '台湾会社設立ガイドを読む',
      href: '/ja/guides/taiwan-company-setup',
    },
    ariaLabel: '会社設立と紛争の案内',
  },
  ko: {
    companySetup: {
      label: '대만 회사설립 상담하기',
      href: '/ko/taiwan-company-setup-lawyer',
    },
    dispute: {
      label: '대만 분쟁 상담하기',
      href: '/ko/taiwan-litigation-lawyer',
    },
    guide: {
      label: '대만 회사설립 가이드 읽기',
      href: '/ko/guides/taiwan-company-setup',
    },
    ariaLabel: '회사설립과 분쟁 경로',
  },
  'zh-hant': {
    companySetup: {
      label: '諮詢台灣公司設立',
      href: '/zh-hant/taiwan-company-setup-lawyer',
    },
    dispute: {
      label: '諮詢台灣商業爭議',
      href: '/zh-hant/taiwan-litigation-lawyer',
    },
    guide: {
      label: '閱讀台灣公司設立指南',
      href: '/zh-hant/guides/taiwan-company-setup',
    },
    ariaLabel: '公司設立與爭議路徑',
  },
};

export type GuidanceHomePaths = {
  setup: { label: string; href: string };
  legal: { label: string; href: string };
  ariaLabel: string;
};

export const GUIDANCE_HOME_PATHS: Record<GuidanceLocale, GuidanceHomePaths> = {
  vi: {
    setup: {
      label: 'Thông tin thành lập công ty tại Đài Loan',
      href: '/vi/services',
    },
    legal: {
      label: 'Thông tin về vấn đề pháp lý tại Đài Loan',
      href: '/vi/faq',
    },
    ariaLabel: 'Hai đường dẫn thông tin',
  },
  id: {
    setup: {
      label: 'Informasi pendirian perusahaan di Taiwan',
      href: '/id/services',
    },
    legal: {
      label: 'Informasi masalah hukum di Taiwan',
      href: '/id/faq',
    },
    ariaLabel: 'Dua jalur informasi',
  },
  th: {
    setup: {
      label: 'ข้อมูลการจัดตั้งบริษัทในไต้หวัน',
      href: '/th/services',
    },
    legal: {
      label: 'ข้อมูลปัญหาทางกฎหมายในไต้หวัน',
      href: '/th/faq',
    },
    ariaLabel: 'สองเส้นทางข้อมูล',
  },
  fil: {
    setup: {
      label: 'Impormasyon sa pagtatayo ng kumpanya sa Taiwan',
      href: '/fil/services',
    },
    legal: {
      label: 'Impormasyon sa usaping legal sa Taiwan',
      href: '/fil/faq',
    },
    ariaLabel: 'Dalawang landas ng impormasyon',
  },
  /**
   * Arabic labels follow the existing published `/ar` guidance pack
   * (`src/data/international-guidance-content.ts` `ar` block, WO-M3B) and the
   * same two information destinations as vi/id/th/fil. They add no MENA
   * country, remittance, or religious-law rules.
   */
  ar: {
    setup: {
      label: 'معلومات تأسيس شركة في تايوان',
      href: '/ar/services',
    },
    legal: {
      label: 'معلومات عن مسألة قانونية في تايوان',
      href: '/ar/faq',
    },
    ariaLabel: 'مساران للمعلومات',
  },
  de: {
    setup: {
      label: 'Informationen zur Gesellschaftsgründung in Taiwan',
      href: '/de/services',
    },
    legal: {
      label: 'Rechtliche Informationen zu Taiwan',
      href: '/de/faq',
    },
    ariaLabel: 'Zwei Informationswege',
  },
  es: {
    setup: {
      label: 'Información sobre la constitución de sociedades en Taiwán',
      href: '/es/services',
    },
    legal: {
      label: 'Información jurídica de Taiwán',
      href: '/es/faq',
    },
    ariaLabel: 'Dos rutas de información',
  },
  /**
   * The remaining guidance locales (WO-G2-1 ~ WO-G2-3) reuse the same two
   * information destinations and the wording of their own guidance pack nav.
   * They stay informational: no consultation, interpreting, or reply promise.
   */
  fr: {
    setup: {
      label: 'Informations sur la création de société à Taïwan',
      href: '/fr/services',
    },
    legal: {
      label: 'Informations juridiques sur Taïwan',
      href: '/fr/faq',
    },
    ariaLabel: 'Deux parcours d’information',
  },
  pt: {
    setup: {
      label: 'Informações sobre a constituição de sociedades em Taiwan',
      href: '/pt/services',
    },
    legal: {
      label: 'Informações jurídicas sobre Taiwan',
      href: '/pt/faq',
    },
    ariaLabel: 'Dois percursos de informação',
  },
  'zh-hans': {
    setup: {
      label: '台湾公司设立相关信息',
      href: '/zh-hans/services',
    },
    legal: {
      label: '台湾法律事务相关信息',
      href: '/zh-hans/faq',
    },
    ariaLabel: '两条信息路径',
  },
  ms: {
    setup: {
      label: 'Maklumat penubuhan syarikat di Taiwan',
      href: '/ms/services',
    },
    legal: {
      label: 'Maklumat isu undang-undang di Taiwan',
      href: '/ms/faq',
    },
    ariaLabel: 'Dua laluan maklumat',
  },
  ru: {
    setup: {
      label: 'Информация о регистрации компании на Тайване',
      href: '/ru/services',
    },
    legal: {
      label: 'Информация по правовым вопросам Тайваня',
      href: '/ru/faq',
    },
    ariaLabel: 'Два пути к информации',
  },
  tr: {
    setup: {
      label: 'Tayvan’da şirket kuruluşu hakkında bilgi',
      href: '/tr/services',
    },
    legal: {
      label: 'Tayvan’daki hukuki konular hakkında bilgi',
      href: '/tr/faq',
    },
    ariaLabel: 'İki bilgi yolu',
  },
  it: {
    setup: {
      label: 'Informazioni sulla costituzione di società a Taiwan',
      href: '/it/services',
    },
    legal: {
      label: 'Informazioni giuridiche su Taiwan',
      href: '/it/faq',
    },
    ariaLabel: 'Due percorsi informativi',
  },
  nl: {
    setup: {
      label: 'Informatie over het oprichten van een vennootschap in Taiwan',
      href: '/nl/services',
    },
    legal: {
      label: 'Juridische informatie over Taiwan',
      href: '/nl/faq',
    },
    ariaLabel: 'Twee informatiepaden',
  },
  pl: {
    setup: {
      label: 'Informacje o zakładaniu spółki na Tajwanie',
      href: '/pl/services',
    },
    legal: {
      label: 'Informacje prawne dotyczące Tajwanu',
      href: '/pl/faq',
    },
    ariaLabel: 'Dwie ścieżki informacyjne',
  },
  hi: {
    setup: {
      label: 'ताइवान में कंपनी स्थापना की जानकारी',
      href: '/hi/services',
    },
    legal: {
      label: 'ताइवान कानूनी जानकारी',
      href: '/hi/faq',
    },
    ariaLabel: 'जानकारी के दो मार्ग',
  },
  sv: {
    setup: {
      label: 'Information om bolagsbildning i Taiwan',
      href: '/sv/services',
    },
    legal: {
      label: 'Juridisk information om Taiwan',
      href: '/sv/faq',
    },
    ariaLabel: 'Två informationsvägar',
  },
  da: {
    setup: {
      label: 'Information om selskabsstiftelse i Taiwan',
      href: '/da/services',
    },
    legal: {
      label: 'Juridisk information om Taiwan',
      href: '/da/faq',
    },
    ariaLabel: 'To informationsveje',
  },
  nb: {
    setup: {
      label: 'Informasjon om selskapsstiftelse i Taiwan',
      href: '/nb/services',
    },
    legal: {
      label: 'Juridisk informasjon om Taiwan',
      href: '/nb/faq',
    },
    ariaLabel: 'To informasjonsveier',
  },
  fi: {
    setup: {
      label: 'Tietoa yhtiön perustamisesta Taiwanissa',
      href: '/fi/services',
    },
    legal: {
      label: 'Oikeudellista tietoa Taiwanista',
      href: '/fi/faq',
    },
    ariaLabel: 'Kaksi tietopolkua',
  },
  cs: {
    setup: {
      label: 'Informace o zakládání společností na Tchaj-wanu',
      href: '/cs/services',
    },
    legal: {
      label: 'Právní informace o Tchaj-wanu',
      href: '/cs/faq',
    },
    ariaLabel: 'Dvě informační cesty',
  },
  hu: {
    setup: {
      label: 'Tájékoztatás a tajvani cégalapításról',
      href: '/hu/services',
    },
    legal: {
      label: 'Tajvani jogi tájékoztatás',
      href: '/hu/faq',
    },
    ariaLabel: 'Két tájékoztatási útvonal',
  },
  ro: {
    setup: {
      label: 'Informații despre înființarea de societăți în Taiwan',
      href: '/ro/services',
    },
    legal: {
      label: 'Informații juridice despre Taiwan',
      href: '/ro/faq',
    },
    ariaLabel: 'Două căi de informare',
  },
  uk: {
    setup: {
      label: 'Відомості про створення товариства на Тайвані',
      href: '/uk/services',
    },
    legal: {
      label: 'Правова інформація про Тайвань',
      href: '/uk/faq',
    },
    ariaLabel: 'Два шляхи до відомостей',
  },
  el: {
    setup: {
      label: 'Πληροφορίες για τη σύσταση εταιρείας στην Ταϊβάν',
      href: '/el/services',
    },
    legal: {
      label: 'Νομικές πληροφορίες για την Ταϊβάν',
      href: '/el/faq',
    },
    ariaLabel: 'Δύο διαδρομές πληροφόρησης',
  },
  he: {
    setup: {
      label: 'מידע על הקמת חברה בטאיוואן',
      href: '/he/services',
    },
    legal: {
      label: 'מידע משפטי על טאיוואן',
      href: '/he/faq',
    },
    ariaLabel: 'שני מסלולי מידע',
  },
  bn: { // SCAFFOLD(hi)
    setup: {
      label: 'ताइवान में कंपनी स्थापना की जानकारी',
      href: '/hi/services',
    },
    legal: {
      label: 'ताइवान कानूनी जानकारी',
      href: '/hi/faq',
    },
    ariaLabel: 'जानकारी के दो मार्ग',
  },
  ur: { // SCAFFOLD(ar)
    setup: {
      label: 'معلومات تأسيس شركة في تايوان',
      href: '/ar/services',
    },
    legal: {
      label: 'معلومات عن مسألة قانونية في تايوان',
      href: '/ar/faq',
    },
    ariaLabel: 'مساران للمعلومات',
  },
  fa: {
    setup: {
      label: 'اطلاعات تأسیس شرکت در تایوان',
      href: '/fa/services',
    },
    legal: {
      label: 'اطلاعات دربارهٔ موضوع حقوقی در تایوان',
      href: '/fa/faq',
    },
    ariaLabel: 'دو مسیر اطلاعات',
  },
  my: { // SCAFFOLD(th)
    setup: {
      label: 'ข้อมูลการจัดตั้งบริษัทในไต้หวัน',
      href: '/th/services',
    },
    legal: {
      label: 'ข้อมูลปัญหาทางกฎหมายในไต้หวัน',
      href: '/th/faq',
    },
    ariaLabel: 'สองเส้นทางข้อมูล',
  },
  ta: { // SCAFFOLD(hi)
    setup: {
      label: 'ताइवान में कंपनी स्थापना की जानकारी',
      href: '/hi/services',
    },
    legal: {
      label: 'ताइवान कानूनी जानकारी',
      href: '/hi/faq',
    },
    ariaLabel: 'जानकारी के दो मार्ग',
  },
  ne: { // SCAFFOLD(hi)
    setup: {
      label: 'ताइवान में कंपनी स्थापना की जानकारी',
      href: '/hi/services',
    },
    legal: {
      label: 'ताइवान कानूनी जानकारी',
      href: '/hi/faq',
    },
    ariaLabel: 'जानकारी के दो मार्ग',
  },
  km: { // SCAFFOLD(th)
    setup: {
      label: 'ข้อมูลการจัดตั้งบริษัทในไต้หวัน',
      href: '/th/services',
    },
    legal: {
      label: 'ข้อมูลปัญหาทางกฎหมายในไต้หวัน',
      href: '/th/faq',
    },
    ariaLabel: 'สองเส้นทางข้อมูล',
  },
  mn: { // SCAFFOLD(ru)
    setup: {
      label: 'Информация о регистрации компании на Тайване',
      href: '/ru/services',
    },
    legal: {
      label: 'Информация по правовым вопросам Тайваня',
      href: '/ru/faq',
    },
    ariaLabel: 'Два пути к информации',
  },
  sk: { // SCAFFOLD(cs)
    setup: {
      label: 'Informace o zakládání společností na Tchaj-wanu',
      href: '/cs/services',
    },
    legal: {
      label: 'Právní informace o Tchaj-wanu',
      href: '/cs/faq',
    },
    ariaLabel: 'Dvě informační cesty',
  },
  bg: { // SCAFFOLD(ru)
    setup: {
      label: 'Информация о регистрации компании на Тайване',
      href: '/ru/services',
    },
    legal: {
      label: 'Информация по правовым вопросам Тайваня',
      href: '/ru/faq',
    },
    ariaLabel: 'Два пути к информации',
  },
  hr: {
    setup: {
      label: 'Informacije o osnivanju društava na Tajvanu',
      href: '/hr/services',
    },
    legal: {
      label: 'Pravne informacije o Tajvanu',
      href: '/hr/faq',
    },
    ariaLabel: 'Dva puta do informacija',
  },
  sr: { // SCAFFOLD(cs)
    setup: {
      label: 'Informace o zakládání společností na Tchaj-wanu',
      href: '/cs/services',
    },
    legal: {
      label: 'Právní informace o Tchaj-wanu',
      href: '/cs/faq',
    },
    ariaLabel: 'Dvě informační cesty',
  },
  sl: {
    setup: {
      label: 'Informacije o ustanavljanju družb na Tajvanu',
      href: '/sl/services',
    },
    legal: {
      label: 'Pravne informacije o Tajvanu',
      href: '/sl/faq',
    },
    ariaLabel: 'Dve informacijski poti',
  },
  lt: {
    setup: {
      label: 'Informacija apie įmonių steigimą Taivane',
      href: '/lt/services',
    },
    legal: {
      label: 'Teisinė informacija apie Taivaną',
      href: '/lt/faq',
    },
    ariaLabel: 'Du informacijos keliai',
  },
  lv: { // SCAFFOLD(cs)
    setup: {
      label: 'Informace o zakládání společností na Tchaj-wanu',
      href: '/cs/services',
    },
    legal: {
      label: 'Právní informace o Tchaj-wanu',
      href: '/cs/faq',
    },
    ariaLabel: 'Dvě informační cesty',
  },
  et: { // SCAFFOLD(cs)
    setup: {
      label: 'Informace o zakládání společností na Tchaj-wanu',
      href: '/cs/services',
    },
    legal: {
      label: 'Právní informace o Tchaj-wanu',
      href: '/cs/faq',
    },
    ariaLabel: 'Dvě informační cesty',
  },
  ca: { // SCAFFOLD(cs)
    setup: {
      label: 'Informace o zakládání společností na Tchaj-wanu',
      href: '/cs/services',
    },
    legal: {
      label: 'Právní informace o Tchaj-wanu',
      href: '/cs/faq',
    },
    ariaLabel: 'Dvě informační cesty',
  },
  is: { // SCAFFOLD(cs)
    setup: {
      label: 'Informace o zakládání společností na Tchaj-wanu',
      href: '/cs/services',
    },
    legal: {
      label: 'Právní informace o Tchaj-wanu',
      href: '/cs/faq',
    },
    ariaLabel: 'Dvě informační cesty',
  },
};

export const LITIGATION_SITUATION_NAV: Record<
  SiteLocale,
  {
    aria: string;
    lead: string;
    unpaid: string;
    civil: string;
    criminal: string;
    family: string;
  }
> = {
  en: {
    aria: 'Start with the situation closest to yours',
    lead: 'Start with the situation closest to yours',
    unpaid: 'Unpaid Invoices or Missing Supplier Deliveries',
    civil: 'Contract Disputes and Civil Claims',
    criminal: 'Police or Criminal Matters',
    family: 'Family Matters',
  },
  ja: {
    aria: '近い状況から確認する',
    lead: '近い状況から確認する',
    unpaid: '未払い・取引先の未納品',
    civil: '契約紛争とその他の民事',
    criminal: '警察・刑事手続',
    family: '家事事件',
  },
  ko: {
    aria: '가까운 상황부터 확인하기',
    lead: '가까운 상황부터 확인하기',
    unpaid: '미수금·미납품',
    civil: '계약 분쟁과 그 밖의 민사',
    criminal: '수사·형사',
    family: '가사 사건',
  },
  'zh-hant': {
    aria: '從最接近的情況開始',
    lead: '從最接近的情況開始',
    unpaid: '未付款或供應商未交貨',
    civil: '契約爭議及其他民事',
    criminal: '警察或刑事案件',
    family: '家事事件',
  },
};

export const CIVIL_COMMERCIAL_COPY: Record<
  SiteLocale,
  {
    heading: string;
    body: string;
    debtLinkLabel: string;
    injuryHeading: string;
    injuryBody: string;
  }
> = {
  en: {
    heading: 'Business Contracts and Payment Disputes',
    body: 'Commercial disputes can involve unpaid invoices, undelivered orders, inspection disagreements, and a counterparty that stops responding. Those situations are reviewed as contract and payment problems, not as injury claims.',
    debtLinkLabel: 'Taiwan debt recovery and supplier disputes',
    injuryHeading: 'Injury, Accident and Other Damages Claims',
    injuryBody:
      'Personal-injury and accident materials remain on this page and in the related columns.',
  },
  ja: {
    heading: '企業の契約紛争・売掛金',
    body: '未払い、前払い後の未納品、検収・品質の争い、納期や契約条件の違反、取引先の連絡途絶は、契約と代金の問題として整理します。傷害・交通事故の請求とは別の出発点です。',
    debtLinkLabel: '台湾企業との取引トラブル・売掛金回収の相談',
    injuryHeading: '傷害・交通事故その他の損害賠償',
    injuryBody:
      '傷害・交通事故・消費者被害の案内は、このページと関連コラムで引き続き確認できます。',
  },
  ko: {
    heading: '기업 계약 분쟁·미수금',
    body: '미지급, 선금 후 미납품, 검수·품질 다툼, 납기·계약 위반, 거래처 연락 단절은 계약과 대금 문제로 검토합니다. 상해·교통사고 청구와는 출발점이 다릅니다.',
    debtLinkLabel: '대만 기업 거래 분쟁·미수금 상담',
    injuryHeading: '상해·교통사고 등 손해배상',
    injuryBody:
      '상해·교통사고·소비자 피해 안내는 이 페이지와 관련 칼럼에서 계속 볼 수 있습니다.',
  },
  'zh-hant': {
    heading: '企業契約與貨款爭議',
    body: '未付款、預付款後未交貨、驗收與品質爭議、交期或契約違反、以及對方停止聯絡，均依契約與貨款問題整理，與人身傷害請求分開。',
    debtLinkLabel: '台灣企業交易糾紛與應收帳款諮詢',
    injuryHeading: '傷害、交通事故及其他損害賠償',
    injuryBody:
      '傷害、交通事故與消費者權益說明仍可於本頁及相關專欄查閱。',
  },
};

export const INVESTMENT_PATH_COPY: Record<
  SiteLocale,
  { heading: string; lawyerLabel: string; guideLabel: string }
> = {
  en: {
    heading: 'Read the process or discuss legal support',
    lawyerLabel: 'Discuss Company Formation Legal Support',
    guideLabel: 'Understand the Setup Process',
  },
  ja: {
    heading: '設立の情報を読む／法律相談をする',
    lawyerLabel: '台湾の会社設立・進出に関する法律相談',
    guideLabel: '台湾会社設立ガイド：進出形態・準備資料・手続の確認',
  },
  ko: {
    heading: '설립 정보를 읽거나 법률 상담하기',
    lawyerLabel: '대만 회사설립 법률 상담',
    guideLabel: '대만 회사설립 정보 가이드',
  },
  'zh-hant': {
    heading: '閱讀設立說明或提出法律諮詢',
    lawyerLabel: '台灣公司設立法律諮詢',
    guideLabel: '台灣公司設立資訊指南',
  },
};

export const FORBIDDEN_GUARANTEE_PATTERNS: readonly RegExp[] = [
  /guaranteed win/i,
  /will recover the money/i,
  /always recoverable/i,
  /% recovered/i,
  /必ず勝訴/,
  /勝訴を保証/,
  /回収率を保証/,
  /すべて遠隔で完了/,
  /自動で詐欺/,
  /승소 보장/,
  /회수율을 보장/,
  /전 절차 무방문을 보장/,
  /保證勝訴/,
  /保證回收率/,
  /保證全程遠端完成/,
];
