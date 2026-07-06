import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AutomationsAdmin from '../AutomationsAdmin';
import ContactsAdmin from '../ContactsAdmin';
import IntegrationsAdmin from '../IntegrationsAdmin';
import OutboxAdmin from '../OutboxAdmin';

const HANGUL = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

describe('CRM admin localization', () => {
  it('renders localized contacts admin chrome in zh-hant', () => {
    const html = renderToStaticMarkup(
      <ContactsAdmin
        locale="zh-hant"
        initialContacts={[
          {
            id: 'ct_1',
            email: 'lead@example.test',
            name: 'Lead',
            phone: '555-0100',
            source: 'manual',
            tags: ['vip'],
            createdAt: '2026-06-03T00:00:00.000Z',
            lastActivityAt: '2026-06-03T00:00:00.000Z',
          },
        ]}
      />,
    );

    expect(html).toContain('搜尋 Email、姓名、電話');
    expect(html).toContain('所有標籤');
    expect(html).toContain('所有來源');
    expect(html).toContain('+ 新增聯絡人');
    expect(html).toContain('最近活動');
    expect(html).toContain('手動');
    expect(html).not.toMatch(HANGUL);
  });

  it('renders localized automations admin chrome in zh-hant', () => {
    const html = renderToStaticMarkup(
      <AutomationsAdmin
        locale="zh-hant"
        initialAutomations={[
          {
            id: 'auto_1',
            name: 'Welcome lead',
            trigger: { kind: 'contact-created', matchTag: 'vip' },
            action: { kind: 'add-tag', addTag: 'customer' },
            enabled: true,
            createdAt: '2026-06-03T00:00:00.000Z',
          },
        ]}
      />,
    );

    expect(html).toContain('+ 新增自動化');
    expect(html).toContain('觸發條件');
    expect(html).toContain('聯絡人建立');
    expect(html).toContain('標籤=vip');
    expect(html).toContain('新增標籤');
    expect(html).not.toMatch(HANGUL);
  });

  it('renders localized integrations admin chrome in zh-hant', () => {
    const html = renderToStaticMarkup(
      <IntegrationsAdmin
        locale="zh-hant"
        initialIntegrations={[
          {
            id: 'int_1',
            kind: 'generic-webhook',
            webhookUrl: 'https://hooks.example.test/crm',
            enabled: true,
            createdAt: '2026-06-03T00:00:00.000Z',
          },
        ]}
      />,
    );

    expect(html).toContain('+ 新增整合');
    expect(html).toContain('渠道');
    expect(html).toContain('目標');
    expect(html).toContain('一般 Webhook');
    expect(html).not.toMatch(HANGUL);
  });

  it('renders localized outbox admin chrome in zh-hant', () => {
    const html = renderToStaticMarkup(
      <OutboxAdmin
        locale="zh-hant"
        initialEntries={[
          {
            entryId: 'out_1',
            automationId: 'auto_1',
            contactId: 'ct_1',
            contactEmail: 'lead@example.test',
            templateId: 'welcome',
            triggeredAt: '2026-06-18T00:00:00.000Z',
          },
        ]}
      />,
    );

    expect(html).toContain('寄送紀錄');
    expect(html).toContain('自動化');
    expect(html).toContain('範本');
    expect(html).toContain('lead@example.test');
    expect(html).not.toMatch(HANGUL);
  });
});
