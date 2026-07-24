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
    expect(body).toContain('/ko/services');
    expect(body).toContain('/ko/contact');
    expect(body).toContain('/ko/columns');
  });

  it('includes the languages and contact sections', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('## 언어');
    expect(body).toContain('## 연락처');
    expect(body).toContain('wei@hoveringlaw.com.tw');
  });

  it('uses the canonical attorney identity', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('曾雋崴律師');
    expect(body).toContain('증준외(曾雋崴)');
    expect(body).not.toContain('曾俊瑋');
  });
});
