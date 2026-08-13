import { describe, expect, it } from 'vitest';
import { GET } from '../route';

describe('/llms.txt', () => {
  it('responds with 200 and a text/plain body', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/plain');
  });

  it('contains the site overview header', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('# 법무법인 호정');
    expect(body).toContain('Hovering International Law Firm');
  });

  it('contains the firm overview description', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('다국어 법률사무소');
  });

  it('includes absolute Korean column URLs', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('columns/taiwan-company-establishment-basics');
    expect(body).toMatch(/https:\/\/[^/\s]+\/ko\/columns\//);
  });

  it('lists the main pages section with key navigation URLs', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('## 주요 페이지');
    for (const locale of ['ko', 'zh-hant', 'en', 'ja']) {
      expect(body).toContain(`/${locale}/services`);
      expect(body).toContain(`/${locale}/lawyers/wei-tseng`);
      expect(body).toContain(`/${locale}/columns`);
      expect(body).toContain(`/${locale}/contact`);
    }
  });

  it('includes the languages and contact sections', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('## 언어');
    expect(body).toContain('## 연락처');
    for (const locale of ['ko', 'zh-hant', 'en', 'ja']) {
      expect(body).toMatch(new RegExp(`https://[^/\\s]+/${locale}(?:\\s|\\))`));
    }
    expect(body).toContain('공식 상담 이메일: wei@hoveringlaw.com.tw');
    expect(body).toContain(
      '상담 신청: [증준외 대만 변호사 이메일 상담](mailto:wei@hoveringlaw.com.tw?subject=',
    );
    expect(body).toContain(
      encodeURIComponent('[tseng-law.com 상담문의] 대만 법률 및 기업 업무 상담'),
    );
    expect(body).not.toContain('+82-10-2992-9304');
    expect(body).not.toContain('- 전화:');
    expect(body).not.toMatch(/kakao|line\.me|lin\.ee/i);
  });

  it('uses the canonical attorney identity', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('曾雋崴律師');
    expect(body).toContain('증준외(曾雋崴)');
    expect(body).not.toContain('曾俊瑋');
  });
});
