import { describe, expect, it } from 'vitest';
import {
  analyzeBrandVoice,
  applyBrandVoiceToPrompt,
  describeBrandVoice,
  FORMALITIES,
  TECHNICALITIES,
  VOCABULARY_BANDS,
  WARMTHS,
} from '@/lib/builder/ai-generator/brand-voice';

describe('brand-voice analyzer', () => {
  it('exposes enum constants', () => {
    expect(FORMALITIES).toEqual(['casual', 'neutral', 'formal']);
    expect(WARMTHS).toEqual(['cool', 'balanced', 'warm']);
    expect(TECHNICALITIES).toEqual(['plain', 'mixed', 'technical']);
    expect(VOCABULARY_BANDS).toEqual(['basic', 'everyday', 'advanced', 'specialized']);
  });

  it.skip('detects formal Korean register from -습니다 markers', () => {
    const profile = analyzeBrandVoice({
      locale: 'ko',
      samples: [
        '저희는 신뢰할 수 있는 법률 자문을 제공합니다.',
        '상담은 영업일 기준 24시간 내에 진행됩니다.',
        '계약서 검토는 명확한 일정으로 안내드립니다.',
        '귀하의 요청은 신속히 처리됩니다.',
      ],
    });
    expect(profile.formality).toBe('formal');
    expect(profile.locale).toBe('ko');
  });

  it.skip('detects casual Korean register from -요 endings', () => {
    const profile = analyzeBrandVoice({
      locale: 'ko',
      samples: [
        '저희랑 같이 가요!',
        '오늘 메뉴 정말 맛있어요!',
        '오시면 진짜 좋아하실거에요!',
      ],
    });
    expect(profile.formality).toBe('casual');
  });

  it('detects formal English register from formal markers', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: [
        'Furthermore, our team will kindly notify you of any updates.',
        'Therefore, please be advised of the revised timeline.',
        'Accordingly, the agreement supersedes prior arrangements.',
      ],
    });
    expect(profile.formality).toBe('formal');
  });

  it('detects warm tone from caring keywords', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: [
        'Welcome to our family. We care about every guest.',
        'Together we will craft something gentle and warm.',
        'Thank you for trusting us with your loved ones.',
      ],
    });
    expect(profile.warmth).toBe('warm');
  });

  it('detects technical band from domain keywords', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: [
        'Our SaaS API exposes throughput and latency telemetry via the SDK.',
        'The jurisdiction clause governs the liability provision under the statute.',
        'KPI tracking and SLA enforcement is built into the workflow orchestration.',
      ],
    });
    expect(profile.technicality).toBe('technical');
  });

  it('falls back to plain technicality when no jargon present', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: ['We bake fresh bread every morning. Stop by anytime.'],
    });
    expect(profile.technicality).toBe('plain');
  });

  it('respects override fields when provided', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: ['Hi there friend!'],
      overrides: { formality: 'formal', warmth: 'cool', technicality: 'technical' },
    });
    expect(profile.formality).toBe('formal');
    expect(profile.warmth).toBe('cool');
    expect(profile.technicality).toBe('technical');
  });

  it('dedupes taboos and signaturePhrases case-insensitively', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: ['placeholder'],
      taboos: ['Cheap', 'cheap', 'Discount', '   '],
      signaturePhrases: ['We deliver clarity', 'we deliver clarity'],
    });
    expect(profile.taboos).toEqual(['Cheap', 'Discount']);
    expect(profile.signaturePhrases).toEqual(['We deliver clarity']);
  });

  it('produces a stable fingerprint for identical analysis input', () => {
    const a = analyzeBrandVoice({
      locale: 'en',
      samples: ['Our team helps founders launch quickly.'],
      taboos: ['cheap'],
      signaturePhrases: ['Launch with us'],
    });
    const b = analyzeBrandVoice({
      locale: 'en',
      samples: ['Our team helps founders launch quickly.'],
      taboos: ['cheap'],
      signaturePhrases: ['Launch with us'],
    });
    expect(a.fingerprint).toBe(b.fingerprint);
    expect(a.fingerprint.startsWith('bv_')).toBe(true);
  });

  it('describeBrandVoice returns a slash-separated summary', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: ['Furthermore please consider our offering.'],
    });
    const label = describeBrandVoice(profile);
    expect(label).toContain(profile.formality);
    expect(label).toContain(profile.warmth);
    expect(label.split(' / ')).toHaveLength(4);
  });

  it('applyBrandVoiceToPrompt is a no-op when profile is null', () => {
    expect(applyBrandVoiceToPrompt('base prompt', null)).toBe('base prompt');
    expect(applyBrandVoiceToPrompt('base prompt', undefined)).toBe('base prompt');
  });

  it('applyBrandVoiceToPrompt appends voice guidance and taboos', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: ['Furthermore please review the agreement.'],
      taboos: ['cheap', 'guaranteed win'],
      signaturePhrases: ['Built for clarity'],
    });
    const expanded = applyBrandVoiceToPrompt('You write copy.', profile);
    expect(expanded).toContain('You write copy.');
    expect(expanded).toContain('Brand voice profile to respect');
    expect(expanded).toContain('Never use these words');
    expect(expanded).toContain('cheap');
    expect(expanded).toContain('Built for clarity');
  });

  it('applyBrandVoiceToPrompt omits taboo/signature lines when none provided', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: ['Hello.'],
    });
    const expanded = applyBrandVoiceToPrompt('Base.', profile);
    expect(expanded).not.toContain('Never use');
    expect(expanded).not.toContain('Signature phrases');
  });

  it('vocabulary band reflects average sentence length', () => {
    const short = analyzeBrandVoice({
      locale: 'en',
      samples: ['Buy now. Save big. Be happy.'],
    });
    const long = analyzeBrandVoice({
      locale: 'en',
      samples: [
        'Our firm has represented multinational corporations across complex cross-border transactional disputes for the past two decades, leveraging deep institutional expertise.',
      ],
    });
    expect(VOCABULARY_BANDS.indexOf(short.vocabularyBand)).toBeLessThan(
      VOCABULARY_BANDS.indexOf(long.vocabularyBand),
    );
  });
});