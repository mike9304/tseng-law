import { describe, expect, it } from 'vitest';

import { faqContent } from '@/data/faq-content';

const divorceFaqCases = [
  {
    locale: 'ko',
    question: '한국인이 대만에서 이혼하려면 어떤 절차가 필요한가요?',
    prohibitedWording: '법원 공증',
    article1050Elements: ['서면 합의', '2명 이상의 증인 서명', '호정기관(戶政機關)에 이혼등기'],
    crossBorderGuidance: ['국제이혼', '준거법', '관할 법원', '재산 분할', '양육권'],
  },
  {
    locale: 'zh-hant',
    question: '韓國人在台灣離婚需要什麼程序？',
    prohibitedWording: '法院公證',
    article1050Elements: ['書面', '二人以上證人簽名', '向戶政機關辦理離婚登記'],
    crossBorderGuidance: ['跨國離婚', '準據法', '管轄法院', '財產分割', '親權'],
  },
  {
    locale: 'en',
    question: 'What procedures does a Korean national need for divorce in Taiwan?',
    prohibitedWording: 'court notarization',
    article1050Elements: [
      'in writing',
      'signed by at least two witnesses',
      'registered with the household administration authority',
    ],
    crossBorderGuidance: [
      'International divorce',
      'applicable law',
      'jurisdiction',
      'property division',
      'custody',
    ],
  },
  {
    locale: 'ja',
    question: '韓国人が台湾で離婚するには、どのような手続きが必要ですか？',
    prohibitedWording: '裁判所の公証',
    article1050Elements: ['書面による合意', '2名以上の証人の署名', '戸政機関への離婚登記'],
    crossBorderGuidance: ['国際離婚', '準拠法', '管轄裁判所', '財産分与', '養育権'],
  },
] as const;

describe('mutual-consent divorce FAQ legal consistency', () => {
  for (const faqCase of divorceFaqCases) {
    it(`${faqCase.locale} states the Article 1050 requirements and retains cross-border guidance`, () => {
      const divorceFaq = faqContent[faqCase.locale].find(
        ({ question }) => question === faqCase.question,
      );

      expect(divorceFaq, `Missing divorce FAQ for ${faqCase.locale}`).toBeDefined();
      expect(divorceFaq?.answer).not.toContain(faqCase.prohibitedWording);

      for (const element of faqCase.article1050Elements) {
        expect(divorceFaq?.answer).toContain(element);
      }

      for (const guidance of faqCase.crossBorderGuidance) {
        expect(divorceFaq?.answer).toContain(guidance);
      }
    });
  }
});
