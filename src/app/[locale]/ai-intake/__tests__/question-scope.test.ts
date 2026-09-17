import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { buildRequirementsPayload } from '@/lib/ai-intake/copy';
import type { AiIntakeFieldKey } from '@/lib/ai-intake/copy';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import AiIntakeHelpPage from '../page';

const PROTOCOL_SYSTEM = new Set<AiIntakeFieldKey>([
  'locale',
  'idempotencyKey',
  'confirmationToken',
  'userApprovedExactPreview',
]);
const FLOW_CONSENT: AiIntakeFieldKey = 'privacyConsent';

const EXPECTED_REQUIRED: AiIntakeFieldKey[] = ['name', 'email', 'summary'];
const EXPECTED_OPTIONAL: AiIntakeFieldKey[] = [
  'category',
  'phoneOrMessenger',
  'urgency',
  'preferredContact',
  'companyOrOrganization',
  'countryOrResidence',
  'preferredTime',
  'documentsAvailable',
];

const CANONICAL_SUMMARY_FACTS: Record<SiteLocale, RegExp> = {
  ko: /핵심 사실과 지금까지의 일정/,
  'zh-hant': /關鍵事實與目前時程/,
  en: /key facts and timeline/,
  ja: /重要な事実とこれまでの経緯/,
};

const REQUIRED_PUBLIC: Record<SiteLocale, Record<string, RegExp>> = {
  ko: {
    name: /성함/,
    email: /회신 이메일/,
    summary: /짧은 사실 개요/,
  },
  'zh-hant': {
    name: /姓名/,
    email: /回覆電子郵件/,
    summary: /簡短事實摘要/,
  },
  en: {
    name: /\bname\b/i,
    email: /reply email/i,
    summary: /short factual summary/i,
  },
  ja: {
    name: /氏名/,
    email: /返信メール/,
    summary: /短い事実の概要/,
  },
};

const OPTIONAL_PUBLIC: Record<SiteLocale, Record<string, RegExp>> = {
  ko: {
    category: /문의 유형/,
    phoneOrMessenger: /전화 또는 메신저/,
    urgency: /긴급도나 기한/,
    preferredContact: /선호 언어·연락 방식·시간대/,
    companyOrOrganization: /회사·소속/,
    countryOrResidence: /국가·거주지/,
    preferredTime: /선호 언어·연락 방식·시간대/,
    documentsAvailable: /자료의 종류/,
  },
  'zh-hant': {
    category: /諮詢類型/,
    phoneOrMessenger: /電話或即時通訊/,
    urgency: /急迫程度或期限/,
    preferredContact: /偏好語言／聯絡方式／時間/,
    companyOrOrganization: /公司或所屬機構/,
    countryOrResidence: /國家或居住地/,
    preferredTime: /偏好語言／聯絡方式／時間/,
    documentsAvailable: /文件的種類/,
  },
  en: {
    category: /matter category/i,
    phoneOrMessenger: /phone or messenger/i,
    urgency: /urgency or deadline/i,
    preferredContact: /preferred language, contact method, or time/i,
    companyOrOrganization: /company or organization/i,
    countryOrResidence: /country or residence/i,
    preferredTime: /preferred language, contact method, or time/i,
    documentsAvailable: /types of documents/i,
  },
  ja: {
    category: /相談分野/,
    phoneOrMessenger: /電話またはメッセンジャー/,
    urgency: /緊急度や期限/,
    preferredContact: /希望する言語・連絡方法・時間帯/,
    companyOrOrganization: /会社・所属/,
    countryOrResidence: /国・居住地/,
    preferredTime: /希望する言語・連絡方法・時間帯/,
    documentsAvailable: /資料の種類/,
  },
};

const OPTIONAL_CUE: Record<SiteLocale, RegExp> = {
  ko: /선택 질문/,
  'zh-hant': /可選問題/,
  en: /optional questions/i,
  ja: /任意の質問/,
};

const FACTS_AS_OPTIONAL: Record<SiteLocale, RegExp> = {
  ko: /선택 질문[\s\S]*핵심 사실과 지금까지의 일정/,
  'zh-hant': /可選問題[\s\S]*關鍵事實與目前時程/,
  en: /optional questions[\s\S]*key facts and timeline/i,
  ja: /任意の質問[\s\S]*重要な事実とこれまでの経緯/,
};

const LOCALE_VS_PREFERRED: Record<SiteLocale, RegExp> = {
  ko: /화면 언어\(로케일\)[\s\S]*선호 언어는 화면 언어와 다른/,
  'zh-hant': /介面語系[\s\S]*偏好語言是另一項可選聯絡偏好，不是介面語系/,
  en: /interface locale[\s\S]*preferred language is a separate optional contact preference, not the interface locale/i,
  ja: /画面のロケール[\s\S]*希望する言語は画面ロケールとは別の任意の連絡希望/,
};

const PREVIEW_AND_CONSENT: Record<SiteLocale, RegExp> = {
  ko: /제목과 본문[\s\S]*개인정보 처리에 반드시 명시적으로 동의/,
  'zh-hant': /主旨與本文[\s\S]*同意隱私處理/,
  en: /exact returned subject and body[\s\S]*privacy consent/i,
  ja: /件名と本文[\s\S]*プライバシー処理に必ず明示的に同意/,
};

const CONSENT_NOT_UNASKED: Record<SiteLocale, RegExp> = {
  ko: /이 동의는 필수이며, 사람에게 묻지 않는 항목이 아닙니다/,
  'zh-hant': /這項同意是必要的，不是不問使用者的項目/,
  en: /that privacy decision is mandatory[\s\S]*not a field that is never asked of the person/i,
  ja: /この同意は必須であり、人に聞かない項目ではありません/,
};

const REQUIRED_CUE: Record<SiteLocale, RegExp> = {
  ko: /필수 질문/,
  'zh-hant': /必填問題/,
  en: /required questions/i,
  ja: /必須の質問/,
};

const OPTIONAL_NOT_MANDATORY: Record<SiteLocale, RegExp> = {
  ko: /선택 질문을 매번 전부 묻지는 않습니다/,
  'zh-hant': /並非每次都會問完全部可選問題/,
  en: /not every optional question is asked every time/i,
  ja: /任意の質問を毎回すべて聞くわけではありません/,
};

const CATEGORY_FOLLOW_UP: Record<SiteLocale, RegExp> = {
  ko: /문의 유형을 고르면[\s\S]*후속 질문/,
  'zh-hant': /選擇諮詢類型後[\s\S]*追問/,
  en: /selecting a matter category may add one narrow follow-up/i,
  ja: /相談分野を選ぶと[\s\S]*追加質問/,
};

const DOCUMENTS_TYPES_ONLY: Record<SiteLocale, RegExp> = {
  ko: /자료는 종류만/,
  'zh-hant': /文件只說明種類/,
  en: /describe types only/i,
  ja: /資料は種類だけ/,
};

const NAMES_ONLY: Record<SiteLocale, RegExp> = {
  ko: /이름만/,
  'zh-hant': /只收姓名|僅限姓名/,
  en: /names only/i,
  ja: /氏名だけ/,
};

const NO_IDENTITY: Record<SiteLocale, RegExp> = {
  ko: /식별번호는 받지 않습니다/,
  'zh-hant': /不收集身分證字號/,
  en: /identity numbers are not collected/i,
  ja: /識別番号は集めません/,
};

describe('AI-intake help page question scope vs canonical contract', () => {
  it.each(siteLocales)('discloses required, optional, protocol, and consent scope for %s', async (locale) => {
    const canonical = buildRequirementsPayload(locale);
    const withCategory = buildRequirementsPayload(locale, 'labor');
    const requiredNames = canonical.fields.required.map((field) => field.name);
    const optionalNames = canonical.fields.optional.map((field) => field.name);

    expect(requiredNames).toEqual(expect.arrayContaining(['locale', 'idempotencyKey', ...EXPECTED_REQUIRED]));
    expect(optionalNames).toEqual(expect.arrayContaining([
      'confirmationToken',
      FLOW_CONSENT,
      'userApprovedExactPreview',
      ...EXPECTED_OPTIONAL,
    ]));

    const requiredHuman = requiredNames.filter(
      (name) => !PROTOCOL_SYSTEM.has(name) && name !== FLOW_CONSENT,
    );
    const optionalHuman = optionalNames.filter(
      (name) => !PROTOCOL_SYSTEM.has(name) && name !== FLOW_CONSENT,
    );
    expect(requiredHuman).toEqual(EXPECTED_REQUIRED);
    expect([...optionalHuman].sort()).toEqual([...EXPECTED_OPTIONAL].sort());
    expect(withCategory.questions.length).toBeGreaterThan(canonical.questions.length);

    const factsQuestion = canonical.questions.find((question) => CANONICAL_SUMMARY_FACTS[locale].test(question));
    expect(factsQuestion, `${locale} canonical key-facts/timeline question`).toBeTruthy();

    const html = renderToStaticMarkup(
      await AiIntakeHelpPage({ params: Promise.resolve({ locale }) }),
    );

    expect(html).toMatch(REQUIRED_CUE[locale]);
    expect(html).toMatch(OPTIONAL_CUE[locale]);
    expect(html).toMatch(OPTIONAL_NOT_MANDATORY[locale]);
    expect(html).toMatch(CANONICAL_SUMMARY_FACTS[locale]);
    expect(html).not.toMatch(FACTS_AS_OPTIONAL[locale]);
    expect(html).toMatch(LOCALE_VS_PREFERRED[locale]);
    expect(html).toMatch(PREVIEW_AND_CONSENT[locale]);
    expect(html).toMatch(CONSENT_NOT_UNASKED[locale]);
    expect(html).toMatch(CATEGORY_FOLLOW_UP[locale]);
    expect(html).toMatch(DOCUMENTS_TYPES_ONLY[locale]);
    expect(html).toMatch(NAMES_ONLY[locale]);
    expect(html).toMatch(NO_IDENTITY[locale]);
    expect(html).not.toMatch(/may submit run/i);
    expect(html).not.toMatch(/idempotencyKey|confirmationToken|privacyConsent|userApprovedExactPreview|AI_INTAKE_/);

    for (const field of requiredHuman) {
      expect(html, `${locale} required ${field}`).toMatch(REQUIRED_PUBLIC[locale][field]);
    }
    for (const field of optionalHuman) {
      expect(html, `${locale} optional ${field}`).toMatch(OPTIONAL_PUBLIC[locale][field]);
    }
  });
});
