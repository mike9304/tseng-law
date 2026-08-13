import { describe, expect, it } from 'vitest';
import { generateMetadata } from '../page';

describe('builder workspace metadata', () => {
  it('localizes the document title by locale', async () => {
    expect((await generateMetadata({ params: Promise.resolve({ locale: 'ko' }) })).title).toBe('빌더 작업 공간');
    expect((await generateMetadata({ params: Promise.resolve({ locale: 'zh-hant' }) })).title).toBe('建構器工作區');
    expect((await generateMetadata({ params: Promise.resolve({ locale: 'en' }) })).title).toBe('Builder Workspace');
  });

  it('localizes the document description by locale', async () => {
    expect((await generateMetadata({ params: Promise.resolve({ locale: 'ko' }) })).description).toContain('호정 빌더 작업 공간');
    expect((await generateMetadata({ params: Promise.resolve({ locale: 'zh-hant' }) })).description).toContain('工作區儀表板');
    expect((await generateMetadata({ params: Promise.resolve({ locale: 'en' }) })).description).toContain('Tseng Law builder');
  });
});
