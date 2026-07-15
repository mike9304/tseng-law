import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { createHmac } from 'node:crypto';

const ORIGINAL_CWD = process.cwd();
let tmpRoot = '';

beforeEach(async () => {
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'crm-auto-'));
  process.chdir(tmpRoot);
  delete process.env.BLOB_READ_WRITE_TOKEN;
  process.env.CRM_BACKEND = 'local';
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  await fs.rm(tmpRoot, { recursive: true, force: true });
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  delete process.env.CRM_WEBHOOK_SECRET;
});

describe('CRM automation engine', () => {
  it('add-tag action chains into tag-added trigger but stops after one chain', async () => {
    const { mutateAutomations } = await import('@/lib/builder/crm/automation-model');
    const { runAutomationsForEvent } = await import('@/lib/builder/crm/automation-engine');
    const { createContact, getContact } = await import('@/lib/builder/crm/contact-store');

    await mutateAutomations((current) => ({
      next: [
        ...current,
        {
          id: 'a1',
          name: 'On create add lead',
          trigger: { kind: 'contact-created' },
          action: { kind: 'add-tag', addTag: 'lead' },
          enabled: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'a2',
          name: 'On lead tag add nurture',
          trigger: { kind: 'tag-added', matchTag: 'lead' },
          action: { kind: 'add-tag', addTag: 'nurture' },
          enabled: true,
          createdAt: new Date().toISOString(),
        },
      ],
      result: null,
    }));

    const contact = await createContact({ email: 'chain@example.com' });
    await runAutomationsForEvent({ kind: 'contact-created', contact });

    const reloaded = await getContact(contact.id);
    expect(reloaded?.tags.sort()).toEqual(['lead', 'nurture'].sort());
  });

  it('simulate-email explicitly appends a non-production simulation to the outbox file', async () => {
    const { mutateAutomations, readOutbox } = await import('@/lib/builder/crm/automation-model');
    const { runAutomationsForEvent } = await import('@/lib/builder/crm/automation-engine');
    const { createContact } = await import('@/lib/builder/crm/contact-store');

    await mutateAutomations((current) => ({
      next: [
        ...current,
        {
          id: 'email-1',
          name: 'Welcome email',
          trigger: { kind: 'contact-created' },
          action: { kind: 'simulate-email', templateId: 'welcome' },
          enabled: true,
          createdAt: new Date().toISOString(),
        },
      ],
      result: null,
    }));

    const contact = await createContact({ email: 'mail@example.com' });
    await runAutomationsForEvent({ kind: 'contact-created', contact });

    const outbox = await readOutbox();
    expect(outbox).toHaveLength(1);
    expect(outbox[0].contactEmail).toBe('mail@example.com');
    expect(outbox[0].templateId).toBe('welcome');
  });

  it('matchTag filter on tag-added only fires for that tag', async () => {
    const { mutateAutomations, readOutbox } = await import('@/lib/builder/crm/automation-model');
    const { runAutomationsForEvent } = await import('@/lib/builder/crm/automation-engine');

    await mutateAutomations((current) => ({
      next: [
        ...current,
        {
          id: 'vip-only',
          name: 'VIP notice',
          trigger: { kind: 'tag-added', matchTag: 'vip' },
          action: { kind: 'simulate-email', templateId: 'vip-welcome' },
          enabled: true,
          createdAt: new Date().toISOString(),
        },
      ],
      result: null,
    }));

    const contact = {
      id: 'ct_x',
      email: 'x@example.com',
      source: 'manual' as const,
      tags: ['lead'],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    await runAutomationsForEvent({ kind: 'tag-added', contact, payload: { addedTag: 'lead' } });
    expect(await readOutbox()).toHaveLength(0);

    const vipContact = { ...contact, tags: ['lead', 'vip'] };
    await runAutomationsForEvent({ kind: 'tag-added', contact: vipContact, payload: { addedTag: 'vip' } });
    expect(await readOutbox()).toHaveLength(1);
  });

  it('webhook action signs the body with HMAC-SHA256', async () => {
    const { mutateAutomations } = await import('@/lib/builder/crm/automation-model');
    const { runAutomationsForEvent, signCrmWebhookBody } = await import('@/lib/builder/crm/automation-engine');

    process.env.CRM_WEBHOOK_SECRET = 'test-secret-123';

    await mutateAutomations((current) => ({
      next: [
        ...current,
        {
          id: 'wh-1',
          name: 'Webhook out',
          trigger: { kind: 'form-submitted', matchFormName: 'contact-us' },
          action: { kind: 'webhook', webhookUrl: 'https://example.test/hook' },
          enabled: true,
          createdAt: new Date().toISOString(),
        },
      ],
      result: null,
    }));

    const captured: { url: string; init?: RequestInit }[] = [];
    const fetchImpl = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      captured.push({ url: String(url), init });
      return new Response('ok', { status: 200 });
    });

    const contact = {
      id: 'ct_hook',
      email: 'hook@example.com',
      source: 'form' as const,
      tags: ['form:contact-us'],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    await runAutomationsForEvent(
      { kind: 'form-submitted', contact, payload: { formName: 'contact-us' } },
      { fetchImpl: fetchImpl as unknown as typeof fetch },
    );

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const sentBody = String(captured[0].init?.body ?? '');
    const sentHeaders = captured[0].init?.headers as Record<string, string> | undefined;
    const expected = signCrmWebhookBody(sentBody, 'test-secret-123');
    const independent = createHmac('sha256', 'test-secret-123').update(sentBody).digest('hex');
    expect(sentHeaders?.['x-crm-signature']).toBe(expected);
    expect(expected).toBe(independent);
  });

  it('matchFormName trigger rejects mismatched form name', async () => {
    const { mutateAutomations, readOutbox } = await import('@/lib/builder/crm/automation-model');
    const { runAutomationsForEvent } = await import('@/lib/builder/crm/automation-engine');

    await mutateAutomations((current) => ({
      next: [
        ...current,
        {
          id: 'only-contact-us',
          name: 'Contact-us-only',
          trigger: { kind: 'form-submitted', matchFormName: 'contact-us' },
          action: { kind: 'simulate-email', templateId: 'thanks' },
          enabled: true,
          createdAt: new Date().toISOString(),
        },
      ],
      result: null,
    }));

    const contact = {
      id: 'ct_form',
      email: 'form@example.com',
      source: 'form' as const,
      tags: [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    await runAutomationsForEvent({ kind: 'form-submitted', contact, payload: { formName: 'newsletter' } });
    expect(await readOutbox()).toHaveLength(0);

    await runAutomationsForEvent({ kind: 'form-submitted', contact, payload: { formName: 'contact-us' } });
    expect(await readOutbox()).toHaveLength(1);
  });

  it('disabled automations do not fire', async () => {
    const { mutateAutomations, readOutbox } = await import('@/lib/builder/crm/automation-model');
    const { runAutomationsForEvent } = await import('@/lib/builder/crm/automation-engine');

    await mutateAutomations((current) => ({
      next: [
        ...current,
        {
          id: 'off',
          name: 'Off',
          trigger: { kind: 'contact-created' },
          action: { kind: 'simulate-email', templateId: 'unused' },
          enabled: false,
          createdAt: new Date().toISOString(),
        },
      ],
      result: null,
    }));

    const contact = {
      id: 'ct_off',
      email: 'off@example.com',
      source: 'manual' as const,
      tags: [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    await runAutomationsForEvent({ kind: 'contact-created', contact });
    expect(await readOutbox()).toHaveLength(0);
  });

  it('blocks email simulation in production regardless of legacy allow flags without outbox mutation or secret leakage', async () => {
    const { mutateAutomations, readOutbox } = await import('@/lib/builder/crm/automation-model');
    const {
      CRM_EMAIL_SIMULATION_UNAVAILABLE,
      runAutomationsForEvent,
    } = await import('@/lib/builder/crm/automation-engine');

    await mutateAutomations(() => ({
      next: [{
        id: 'production-email-simulation',
        name: 'Must not deliver',
        trigger: { kind: 'contact-created' },
        action: { kind: 'simulate-email', templateId: 'private-template' },
        enabled: true,
        createdAt: new Date().toISOString(),
      }],
      result: null,
    }));

    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ALLOW_CRM_EMAIL_STUB', '1');
    vi.stubEnv('ALLOW_STUB_EMAILS', '1');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const contact = {
      id: 'ct_prod',
      email: 'private-contact@example.com',
      source: 'manual' as const,
      tags: [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };

    await runAutomationsForEvent({
      kind: 'contact-created',
      contact,
      payload: { secret: 'must-not-appear-in-log-or-outbox' },
    });

    expect(await readOutbox()).toEqual([]);
    await expect(fs.stat(path.join(tmpRoot, 'runtime-data', 'crm', 'outbox.json'))).rejects.toMatchObject({
      code: 'ENOENT',
    });
    expect(consoleError).toHaveBeenCalledWith('[crm/automation] action unavailable', {
      automationId: 'production-email-simulation',
      actionKind: 'simulate-email',
      errorCode: CRM_EMAIL_SIMULATION_UNAVAILABLE,
    });
    const logged = JSON.stringify(consoleError.mock.calls);
    expect(logged).not.toContain('private-contact@example.com');
    expect(logged).not.toContain('must-not-appear-in-log-or-outbox');
    expect(logged).not.toContain('private-template');
  });

  it('normalizes legacy send-email-stub records on read and persists the honest kind on the next write', async () => {
    const crmDir = path.join(tmpRoot, 'runtime-data', 'crm');
    const automationsPath = path.join(crmDir, 'automations.json');
    await fs.mkdir(crmDir, { recursive: true });
    await fs.writeFile(automationsPath, JSON.stringify({
      version: 1,
      updatedAt: '2026-01-01T00:00:00.000Z',
      automations: [{
        id: 'legacy-email-stub',
        name: 'Legacy simulation',
        trigger: { kind: 'contact-created' },
        action: { kind: 'send-email-stub', templateId: 'legacy-template' },
        enabled: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      }],
    }), 'utf8');

    const { mutateAutomations, readAutomations } = await import('@/lib/builder/crm/automation-model');
    const normalized = await readAutomations();
    expect(normalized[0].action).toEqual({ kind: 'simulate-email', templateId: 'legacy-template' });

    await mutateAutomations((current) => ({ next: current, result: null }));
    const persisted = await fs.readFile(automationsPath, 'utf8');
    expect(persisted).toContain('simulate-email');
    expect(persisted).not.toContain('send-email-stub');
  });
});
