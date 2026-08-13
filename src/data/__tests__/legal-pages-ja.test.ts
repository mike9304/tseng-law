import { describe, expect, it } from 'vitest';

import { legalPageContent, type LegalPageKey } from '@/data/legal-pages';

const japanese = legalPageContent.ja;
const pageKeys: LegalPageKey[] = ['privacy', 'disclaimer', 'accessibility'];
const comparisonLocales = ['ko', 'zh-hant', 'en'] as const;

describe('Japanese legal-page content', () => {
  it('provides all three pages with the reviewed titles and section titles', () => {
    expect(Object.keys(japanese).sort()).toEqual([...pageKeys].sort());

    expect(japanese.privacy.title).toBe('プライバシーポリシー');
    expect(japanese.privacy.sections.map((section) => section.title)).toEqual([
      '収集する情報',
      '利用目的',
      '保管期間および削除',
      '委託先および国外での処理',
      'Cookieおよびブラウザストレージ',
      'ご本人の権利およびお問い合わせ',
      '機微な案件資料、未成年者およびマーケティング',
      '個人情報事故への対応',
    ]);
    expect(japanese.privacy.description).toBe(
      'お問い合わせ、相談予約および本ウェブサイトのご利用に際して収集することのある情報と、その利用方法について説明します。',
    );

    expect(japanese.disclaimer.title).toBe('免責事項');
    expect(japanese.disclaimer.sections.map((section) => section.title)).toEqual([
      '一般情報について',
      'ご相談および委任関係',
      '外部リンクおよび結果の非保証',
    ]);

    expect(japanese.accessibility.title).toBe('アクセシビリティについて');
    expect(japanese.accessibility.sections.map((section) => section.title)).toEqual([
      'アクセシビリティへの取り組み',
      '改善のご要望',
    ]);
  });

  it('preserves the exact labels, reviewed dates, operational facts, and contact email', () => {
    expect(pageKeys.map((key) => japanese[key].label)).toEqual([
      'PRIVACY',
      'DISCLAIMER',
      'ACCESSIBILITY',
    ]);

    for (const key of pageKeys) {
      expect(japanese[key].effectiveDateLabel).toBe('施行日');
    }
    expect(japanese.privacy.effectiveDate).toBe('2026-07-30');
    expect(japanese.disclaimer.effectiveDate).toBe('2026-03-10');
    expect(japanese.accessibility.effectiveDate).toBe('2026-03-10');

    expect(japanese.privacy.sections[0]?.paragraphs[0]).toBe(
      '相談フォームでは、氏名または会社名、返信用メールアドレス、ご相談分野、概要および個人情報処理への同意を取得します。電話番号は任意です。AI相談を利用した場合、会話内容、セッション識別子、分類結果およびフィードバックを処理することがあります。',
    );
    expect(japanese.privacy.sections[0]?.paragraphs[1]).toBe(
      'セキュリティおよびサービス運営のため、IPアドレス、ユーザーエージェント、リクエスト時刻などの基本的な技術記録が生成されることがあります。',
    );
    expect(japanese.privacy.sections[1]?.paragraphs[0]).toBe(
      '収集した情報は、お問い合わせへの回答、相談日程の調整、案件に関するご要望の確認、ウェブサイトのセキュリティ維持およびサービス品質の改善に限って利用します。',
    );
    expect(japanese.privacy.sections[1]?.items).toEqual([
      'お問い合わせおよび相談予約への回答',
      '対面またはビデオ通話による相談日程の調整',
      'ウェブサイトの安全性、運営および利用体験の改善',
    ]);
    expect(japanese.privacy.sections[2]?.paragraphs[0]).toBe(
      '相談イベントおよびフィードバックログの削除用コードには、標準で90日間の保管基準が実装されています。ただし、本番環境での実行スケジュールならびに相談メールおよびデータベース上の複製の保管期間は、コードのみでは確認できないため、運営者による確認が必要です。',
    );
    expect(japanese.privacy.sections[3]?.paragraphs[0]).toBe(
      'コードから確認できる外部サービスは、ウェブサイトのホスティングおよび非公開オブジェクトストレージを提供するVercelと、設定されている場合にAI相談の回答生成に使用するOpenAIです。メールはサーバーに設定されたSMTP経路で送信されますが、実際のSMTP事業者名は運営者による確認が必要です。',
    );
    expect(japanese.privacy.sections[5]?.paragraphs[0]).toBe(
      'ご本人の情報の開示、訂正、削除または同意の撤回をご希望の場合は、公式相談メール wei@hoveringlaw.com.tw までご連絡ください。法令上の保管義務または進行中の法律業務により対応範囲が制限される場合は、その理由をご案内します。',
    );
    expect(japanese.privacy.sections[6]?.paragraphs[0]).toBe(
      '初回のお問い合わせでは、案件または業務の概要と連絡先のみをお送りください。旅券番号、身分証番号、銀行口座情報、身分証明書の原本または証拠資料一式は、メールや一般のお問い合わせフォームで送信せず、担当弁護士からの案内後に安全な方法でご提出ください。',
    );
    expect(japanese.privacy.sections[7]?.paragraphs[0]).toContain(
      '事故対応責任者、通知基準および連絡網は運営者による確認が必要です。',
    );
    expect(japanese.accessibility.sections[0]?.paragraphs[0]).toBe(
      '昊鼎国際法律事務所は、主要な情報をより理解しやすく、利用しやすくするため、キーボード操作、見出し構造、文字と背景のコントラストおよびページの読みやすさの改善に継続して取り組んでいます。',
    );
    expect(japanese.disclaimer.sections[1]?.paragraphs[1]).toBe(
      '正式な法律サービスは、案件の確認を経て、当事務所とご依頼者の双方が委任関係の成立を確認した場合に限り開始されます。',
    );
    expect(japanese.accessibility.sections[0]?.items?.[2]).toBe(
      '画像、ボタンおよびリンクの意味が伝わる表現の強化',
    );
  });

  it('matches every other locale section, paragraph, and item count without omissions', () => {
    for (const locale of comparisonLocales) {
      const comparison = legalPageContent[locale];
      for (const key of pageKeys) {
        expect(japanese[key].sections).toHaveLength(comparison[key].sections.length);
        expect(japanese[key].effectiveDate).toBe(comparison[key].effectiveDate);

        for (const [index, section] of japanese[key].sections.entries()) {
          const sourceSection = comparison[key].sections[index];

          expect(section.paragraphs).toHaveLength(sourceSection.paragraphs.length);
          expect(section.items ?? []).toHaveLength(sourceSection.items?.length ?? 0);
        }
      }
    }
  });

  it('contains no Korean, legacy identity, or body-copy fallback', () => {
    const serializedJapanese = JSON.stringify(japanese);

    expect(serializedJapanese).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
    expect(serializedJapanese).not.toMatch(/법무법인 호정|曾俊瑋|Tseng Jun-Wei|Tseng Junwei/i);
    expect(serializedJapanese).not.toMatch(
      /Privacy Policy|Accessibility Statement|개인정보 처리방침|면책 고지|웹 접근성 안내|수집하는 정보|시행일/,
    );
  });

  it('keeps reviewed privacy facts aligned across Korean, Traditional Chinese, and English', () => {
    expect(legalPageContent.ko.privacy.sections[0]?.paragraphs[0]).toBe(
      '상담 폼에서는 이름 또는 회사명, 회신 이메일, 문의 분야, 문의 개요, 개인정보 처리 동의를 받고 전화번호는 선택 사항입니다. AI 상담을 이용하면 대화 내용, 세션 식별자, 분류 결과와 피드백도 처리될 수 있습니다.',
    );
    expect(legalPageContent.ko.privacy.sections[3]?.paragraphs[0]).toContain(
      'Vercel과, 설정된 경우 AI 상담 답변 생성에 사용하는 OpenAI',
    );

    expect(legalPageContent['zh-hant'].privacy.sections[2]?.paragraphs[0]).toContain(
      '預設以 90 日為保存基準',
    );
    expect(legalPageContent['zh-hant'].privacy.sections[6]?.paragraphs[0]).toContain(
      '請勿透過電子郵件或一般諮詢表單傳送身分證字號、護照號碼、銀行帳戶資料',
    );

    expect(legalPageContent.en.privacy.sections[3]?.paragraphs[0]).toBe(
      'Services confirmed in the code include Vercel for website hosting and private object storage, and OpenAI for AI consultation responses when that provider is configured. Email is sent through a server-configured SMTP transport; the actual SMTP provider name requires operator confirmation.',
    );
    expect(legalPageContent.en.privacy.sections[7]?.paragraphs[0]).toContain(
      'The assigned incident owner, notification thresholds, and contact plan require operator confirmation.',
    );
  });
});
