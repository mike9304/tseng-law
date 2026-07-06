import { describe, expect, it } from 'vitest';
import { generateMetadata } from '../page';

describe('builder workspace metadata', () => {
  it('localizes the document title by locale', () => {
    expect(generateMetadata({ params: { locale: 'ko' } }).title).toBe('빌더 작업 공간');
    expect(generateMetadata({ params: { locale: 'zh-hant' } }).title).toBe('建構器工作區');
    expect(generateMetadata({ params: { locale: 'en' } }).title).toBe('Builder Workspace');
  });

  it('localizes the document description by locale', () => {
    expect(generateMetadata({ params: { locale: 'ko' } }).description).toContain('호정 빌더 작업 공간');
    expect(generateMetadata({ params: { locale: 'zh-hant' } }).description).toContain('工作區儀表板');
    expect(generateMetadata({ params: { locale: 'en' } }).description).toContain('Tseng Law builder');
  });
});
