import { describe, expect, it } from 'vitest';

import { legalPageContent, type LegalPageKey } from '@/data/legal-pages';

const japanese = legalPageContent.ja;
const traditionalChinese = legalPageContent['zh-hant'];
const pageKeys: LegalPageKey[] = ['privacy', 'disclaimer', 'accessibility'];

describe('Japanese legal-page content', () => {
  it('provides all three pages with the reviewed titles and section titles', () => {
    expect(Object.keys(japanese).sort()).toEqual([...pageKeys].sort());

    expect(japanese.privacy.title).toBe('プライバシーポリシー');
    expect(japanese.privacy.sections.map((section) => section.title)).toEqual([
      '収集する情報',
      '利用目的',
      '保管および第三者への提供',
      'お問い合わせ',
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

  it('preserves the exact labels, effective date, firm name, and contact email', () => {
    expect(pageKeys.map((key) => japanese[key].label)).toEqual([
      'PRIVACY',
      'DISCLAIMER',
      'ACCESSIBILITY',
    ]);

    for (const key of pageKeys) {
      expect(japanese[key].effectiveDateLabel).toBe('施行日');
      expect(japanese[key].effectiveDate).toBe('2026-03-10');
    }

    expect(japanese.privacy.sections[0]?.paragraphs[0]).toBe(
      '昊鼎国際法律事務所は、お問い合わせ・ご相談の際に、氏名、連絡先、メールアドレス、会社名、案件の概要および関連する添付資料を収集することがあります。',
    );
    expect(japanese.privacy.sections[0]?.paragraphs[1]).toBe(
      '本ウェブサイトの運営にあたり、セキュリティの維持およびサービスの改善を目的として、アクセスログ、ブラウザ情報、検索語句、参照元などの基本的な技術情報を収集することがあります。',
    );
    expect(japanese.privacy.sections[1]?.paragraphs[0]).toBe(
      '収集した情報は、お問い合わせへの回答、相談日程の調整、案件に関するご要望の確認、ウェブサイトのセキュリティ維持およびサービス品質の改善に限って利用します。',
    );
    expect(japanese.privacy.sections[1]?.items).toEqual([
      'お問い合わせおよび相談予約への回答',
      '対面またはビデオ通話による相談日程の調整',
      'ウェブサイトの安全性、運営および利用体験の改善',
    ]);
    expect(japanese.accessibility.sections[0]?.paragraphs[0]).toBe(
      '昊鼎国際法律事務所は、主要な情報をより理解しやすく、利用しやすくするため、キーボード操作、見出し構造、文字と背景のコントラストおよびページの読みやすさの改善に継続して取り組んでいます。',
    );
    expect(japanese.privacy.sections[3]?.paragraphs[0]).toBe(
      'プライバシーに関するお問い合わせは、wei@hoveringlaw.com.twまたはお問い合わせページからご連絡ください。',
    );
    expect(japanese.disclaimer.sections[1]?.paragraphs[1]).toBe(
      '正式な法律サービスは、案件の確認を経て、当事務所とご依頼者の双方が委任関係の成立を確認した場合に限り開始されます。',
    );
    expect(japanese.accessibility.sections[0]?.items?.[2]).toBe(
      '画像、ボタンおよびリンクの意味が伝わる表現の強化',
    );
  });

  it('matches the Traditional Chinese section, paragraph, and item counts without omissions', () => {
    for (const key of pageKeys) {
      expect(japanese[key].sections).toHaveLength(traditionalChinese[key].sections.length);

      for (const [index, section] of japanese[key].sections.entries()) {
        const sourceSection = traditionalChinese[key].sections[index];

        expect(section.paragraphs).toHaveLength(sourceSection.paragraphs.length);
        expect(section.items ?? []).toHaveLength(sourceSection.items?.length ?? 0);
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

  it('keeps representative Korean, Traditional Chinese, and English source copy unchanged', () => {
    expect(legalPageContent.ko.privacy.sections[0]?.paragraphs[0]).toBe(
      '법무법인 호정은 문의 및 상담 과정에서 이름, 연락처, 이메일, 회사명, 사건 개요, 첨부 자료와 같은 정보를 받을 수 있습니다.',
    );
    expect(legalPageContent.ko.accessibility.sections[1]?.title).toBe('개선 요청');

    expect(legalPageContent['zh-hant'].disclaimer.sections[1]?.paragraphs[0]).toBe(
      '僅因瀏覽網站、寄送電子郵件或傳送即時訊息，並不會當然成立律師與當事人之委任關係。',
    );
    expect(legalPageContent['zh-hant'].privacy.sections[2]?.title).toBe('保存與提供');

    expect(legalPageContent.en.accessibility.sections[0]?.paragraphs[0]).toBe(
      'We continue to improve keyboard navigation, heading structure, readable contrast, and page clarity so visitors can understand important information more easily.',
    );
    expect(legalPageContent.en.disclaimer.sections[2]?.title).toBe(
      'External links and past results',
    );
  });
});
