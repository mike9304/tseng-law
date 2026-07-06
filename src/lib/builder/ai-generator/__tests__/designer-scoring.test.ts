import { describe, expect, it } from 'vitest';
import {
  scoreDesignerStyleCandidates,
  serializeDesignerScorePayload,
} from '@/lib/builder/ai-generator/designer-scoring';

describe('scoreDesignerStyleCandidates', () => {
  it('ranks editorial trust first for a professional law brief', () => {
    const scores = scoreDesignerStyleCandidates({
      industry: 'law',
      tone: 'professional',
      colorPreference: 'cool',
      goals: ['상담 문의 증가', '칼럼 검색 유입 확보'],
      brandKeywords: ['대만 법률', '한국어 상담'],
      constraints: '모바일 CTA를 우선 노출',
      audience: '대만 내 한국 기업과 교민',
    });

    expect(scores[0]).toMatchObject({
      id: 'editorial-trust',
      rank: 1,
      score: 94,
      layoutFit: 96,
      paletteFit: 92,
      fitPreview: 'Credential rail + proof rhythm',
      designPoolProfile: 'law-editorial-credential',
      designPoolFit: 96,
    });
    expect(scores[0]?.reasons).toContain('industry fit');
    expect(scores[0]?.designPoolSignals).toContain('credential rhythm');
    expect(serializeDesignerScorePayload(scores)).toMatch(/^editorial-trust:1:94:96:92/);
  });

  it('prioritizes conversion clarity for high-contrast conversion goals', () => {
    const scores = scoreDesignerStyleCandidates({
      industry: 'fitness',
      tone: 'friendly',
      colorPreference: 'high-contrast',
      goals: ['booking conversion', 'contact lead capture'],
    });

    expect(scores[0]).toMatchObject({
      id: 'conversion-clarity',
      rank: 1,
      score: 91,
      layoutFit: 92,
      paletteFit: 92,
      designPoolProfile: 'cta-dock-service-grid',
      designPoolFit: 95,
    });
    expect(scores[0]?.reasons).toContain('conversion goal');
  });
});
