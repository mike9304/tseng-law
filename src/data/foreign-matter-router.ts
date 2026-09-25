import type { SiteLocale } from '@/lib/locales';

type Matter = {
  href: string;
  title: string;
  description: string;
};

type RouterCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  matters: Matter[];
  inquiryTitle: string;
  inquiryText: string;
  inquiryAction: string;
  process: string;
  languageNote: string;
};

const routerCopy: Record<SiteLocale, RouterCopy> = {
  en: {
    eyebrow: 'FIND YOUR NEXT STEP',
    title: 'What is your Taiwan matter about?',
    intro: 'Start with the closest topic. Each link explains the related service; an inquiry lets us assess whether we can assist with your specific matter.',
    matters: [
      { href: 'services/investment', title: 'Business and investment', description: 'Company setup, investment, and ongoing business matters.' },
      { href: 'services/labor', title: 'Employment', description: 'Work contracts, dismissal, and workplace disputes.' },
      { href: 'services/civil', title: 'Contracts and civil disputes', description: 'Contract, payment, and other civil claims.' },
      { href: 'services/family', title: 'Family', description: 'Marriage, divorce, and cross-border family issues.' },
      { href: 'services/criminal', title: 'Criminal matters', description: 'An investigation, accusation, or complaint in Taiwan.' },
      { href: 'contact', title: 'Residence or immigration', description: 'Tell us your Taiwan-related issue so we can confirm whether we can assist.' },
    ],
    inquiryTitle: 'Tell us the essentials first',
    inquiryText: 'Send a brief summary, your connection to Taiwan, any deadline, and a way to contact you. We then check suitability and possible conflicts; scope, fees, and any consultation are confirmed separately. Send sensitive documents only after attorney instructions.',
    inquiryAction: 'Send an inquiry',
    process: 'Inquiry → suitability and conflict check → scope and fees confirmation → consultation if agreed',
    languageNote: 'Direct consultations are available in English, Chinese, Korean, and Japanese.',
  },
  ja: {
    eyebrow: '台湾の法律問題',
    title: 'ご相談の分野をお選びください',
    intro: '最も近い分野からご覧ください。各リンクでサービス内容を確認でき、個別案件の対応可否はお問い合わせ後に確認します。',
    matters: [
      { href: 'services/investment', title: '事業・投資', description: '会社設立、投資、台湾での事業運営。' },
      { href: 'services/labor', title: '雇用・労働', description: '雇用契約、解雇、職場での紛争。' },
      { href: 'services/civil', title: '契約・民事紛争', description: '契約、支払い、その他の民事請求。' },
      { href: 'services/family', title: '家事', description: '婚姻、離婚、国境をまたぐ家族の問題。' },
      { href: 'services/criminal', title: '刑事事件', description: '台湾での捜査、告訴、刑事手続き。' },
      { href: 'contact', title: '居留・移民', description: '台湾に関する状況をお知らせください。対応可能か確認します。' },
    ],
    inquiryTitle: 'まずは概要をお知らせください',
    inquiryText: '案件の簡潔な概要、台湾との関係、期限、連絡先をお送りください。対応可否と利益相反を確認し、業務範囲・費用・相談の実施は別途確定します。機微な書類は弁護士の指示後にお送りください。',
    inquiryAction: 'お問い合わせを送る',
    process: 'お問い合わせ → 対応可否・利益相反の確認 → 業務範囲・費用の確定 → 合意後に相談実施',
    languageNote: '弁護士への直接相談は日本語・中国語・韓国語・英語に対応しています。',
  },
  ko: {
    eyebrow: '대만 법률 문제',
    title: '어떤 일로 도움이 필요하신가요?',
    intro: '가장 가까운 분야를 선택해 안내를 확인하세요. 개별 사건의 수임 가능 여부는 문의 내용을 검토한 뒤 확인합니다.',
    matters: [
      { href: 'services/investment', title: '사업·투자', description: '회사 설립, 투자, 대만 사업 운영.' },
      { href: 'services/labor', title: '고용·노동', description: '근로계약, 해고, 직장 내 분쟁.' },
      { href: 'services/civil', title: '계약·민사 분쟁', description: '계약, 대금, 그 밖의 민사 청구.' },
      { href: 'services/family', title: '가족 문제', description: '혼인, 이혼, 국경을 넘는 가족 사건.' },
      { href: 'services/criminal', title: '형사 사건', description: '대만에서의 수사, 고소, 형사 절차.' },
      { href: 'contact', title: '체류·이민', description: '대만 관련 상황을 알려 주시면 도움 가능 여부를 확인하겠습니다.' },
    ],
    inquiryTitle: '먼저 핵심 내용만 알려 주세요',
    inquiryText: '사건 개요, 대만과의 관련성, 기한, 연락처를 간단히 보내 주세요. 적합성과 이해충돌을 확인한 뒤 업무 범위·비용·상담 진행 여부를 별도로 확정합니다. 민감한 서류는 변호사의 안내 후 보내 주세요.',
    inquiryAction: '문의 보내기',
    process: '문의 → 적합성·이해충돌 확인 → 업무 범위·비용 확정 → 합의 후 상담 진행',
    languageNote: '변호사와 직접 상담 가능한 언어는 한국어·중국어·영어·일본어입니다.',
  },
  'zh-hant': {
    eyebrow: '台灣法律問題',
    title: '您需要哪一方面的協助？',
    intro: '請先選擇最接近的主題，了解相關服務。個案是否承接，仍須在收到詢問後評估。',
    matters: [
      { href: 'services/investment', title: '企業與投資', description: '公司設立、投資及在台營運。' },
      { href: 'services/labor', title: '勞動與雇用', description: '勞動契約、解僱及職場爭議。' },
      { href: 'services/civil', title: '契約與民事爭議', description: '契約、款項及其他民事請求。' },
      { href: 'services/family', title: '家事', description: '婚姻、離婚及跨境家庭問題。' },
      { href: 'services/criminal', title: '刑事案件', description: '在台灣涉及偵查、告訴或刑事程序。' },
      { href: 'contact', title: '居留與移民', description: '請簡述與台灣相關的情況，以便確認是否能協助。' },
    ],
    inquiryTitle: '先告訴我們必要資訊',
    inquiryText: '請簡述事項、與台灣的關聯、期限及聯絡方式。我們將確認是否適合承接及有無利益衝突；服務範圍、費用與諮詢安排須另行確認。敏感文件請待律師指示後再提供。',
    inquiryAction: '送出詢問',
    process: '詢問 → 承接適合性及利益衝突確認 → 服務範圍與費用確認 → 雙方同意後進行諮詢',
    languageNote: '律師可直接以中文、英文、韓文及日文諮詢。',
  },
};

export function getForeignMatterRouter(locale: SiteLocale): RouterCopy {
  return routerCopy[locale];
}
