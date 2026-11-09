import { describe, expect, it } from 'vitest';
import {
  INQUIRY_URL_TOPIC_WHITELIST,
  inquiryTopicOriginalTextPrefill,
  parseInquiryUrlTopic,
} from '@/lib/international-inquiry-topic-prefill';

describe('international inquiry URL topic prefill', () => {
  it('whitelists semiconductor only', () => {
    expect(INQUIRY_URL_TOPIC_WHITELIST).toEqual(['semiconductor']);
    expect(parseInquiryUrlTopic('semiconductor')).toBe('semiconductor');
    expect(parseInquiryUrlTopic('traffic_accident')).toBeNull();
    expect(parseInquiryUrlTopic('')).toBeNull();
  });

  it('returns locale-specific semiconductor prefixes', () => {
    expect(inquiryTopicOriginalTextPrefill('ko', 'semiconductor')).toBe('[반도체 산업 상담] ');
    expect(inquiryTopicOriginalTextPrefill('zh-hant', 'semiconductor')).toBe('[半導體產業諮詢] ');
    expect(inquiryTopicOriginalTextPrefill('en', 'semiconductor')).toBe('[Semiconductor industry inquiry] ');
    expect(inquiryTopicOriginalTextPrefill('ja', 'semiconductor')).toBe('[半導体産業のご相談] ');
    expect(inquiryTopicOriginalTextPrefill('vi', 'semiconductor')).toBe('[Semiconductor industry inquiry] ');
    expect(inquiryTopicOriginalTextPrefill('ko', null)).toBe('');
  });
});
