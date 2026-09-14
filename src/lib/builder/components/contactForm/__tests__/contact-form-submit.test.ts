import { afterEach, describe, expect, it, vi } from 'vitest';
import { CONTACT_FORM_LEGACY_DEFAULTS } from '../../conversion-widgets-copy';
import {
  isDefaultConsultationAction,
  planContactFormSubmit,
} from '../submit-adapter';
import { submitContactForm, type FetchLike } from '../submit-client';

const defaultFields = [...CONTACT_FORM_LEGACY_DEFAULTS.fields];
const sessionId = 'contact-form-11111111-2222-4333-8444-555555555555';

function values(overrides: Record<string, string> = {}) {
  return {
    name: 'Kim',
    email: 'kim@example.com',
    phone: '010-0000-0000',
    message: 'Need company setup advice',
    ...overrides,
  };
}

describe('contact form default-action adapter', () => {
  it('treats the legacy action as the consultation API', () => {
    expect(isDefaultConsultationAction(CONTACT_FORM_LEGACY_DEFAULTS.action)).toBe(true);
    expect(isDefaultConsultationAction('/api/forms/submit')).toBe(false);
  });

  it('maps default fields into the consultation schema and sends consent only when checked', () => {
    const planned = planContactFormSubmit({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'ko',
      sessionId,
      enabledFields: defaultFields,
      values: values({ company: 'Acme', subject: 'Setup', address: 'Taipei', preference: 'email' }),
      consentChecked: true,
    });

    expect(planned.kind).toBe('consultation');
    if (planned.kind !== 'consultation') return;
    expect(planned.body.sessionId).toBe(sessionId);
    expect(planned.body.locale).toBe('ko');
    expect(planned.body.collectedFields).toEqual({
      name: 'Kim',
      email: 'kim@example.com',
      phoneOrMessenger: '010-0000-0000',
      companyOrOrganization: 'Acme',
      preferredContact: 'email',
      summary: 'Need company setup advice\n\n제목: Setup\n\n주소: Taipei',
      consent: true,
    });
    expect(planned.body).not.toHaveProperty('transcript');
    expect(planned.body).not.toHaveProperty('referencedColumns');
    expect(planned.body.collectedFields).not.toHaveProperty('countryOrResidence');
  });

  it('omits empty optional keys instead of sending blanks', () => {
    const planned = planContactFormSubmit({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'en',
      sessionId,
      enabledFields: defaultFields,
      values: values({ phone: '  ' }),
      consentChecked: true,
    });
    expect(planned.kind).toBe('consultation');
    if (planned.kind !== 'consultation') return;
    expect(planned.body.collectedFields).not.toHaveProperty('phoneOrMessenger');
    expect(planned.body.locale).toBe('en');
  });

  it('blocks default submit without explicit consent', () => {
    const planned = planContactFormSubmit({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'ko',
      sessionId,
      enabledFields: defaultFields,
      values: values(),
      consentChecked: false,
    });
    expect(planned.kind).toBe('blocked');
    if (planned.kind !== 'blocked') return;
    expect(planned.reason).toBe('consent_required');
  });

  it('does not submit default action when runtime locale is ja', () => {
    const planned = planContactFormSubmit({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'ja',
      sessionId,
      enabledFields: defaultFields,
      values: values(),
      consentChecked: true,
    });
    expect(planned.kind).toBe('blocked');
    if (planned.kind !== 'blocked') return;
    expect(planned.reason).toBe('ja_unsupported');
    expect('body' in planned).toBe(false);
  });

  it('keeps custom actions as flat JSON without a consent key', () => {
    const planned = planContactFormSubmit({
      action: 'https://example.test/hook',
      locale: 'ko',
      sessionId,
      enabledFields: defaultFields,
      values: values({ consent: 'on' }),
      consentChecked: true,
    });
    expect(planned.kind).toBe('custom');
    if (planned.kind !== 'custom') return;
    expect(planned.body).toEqual({
      name: 'Kim',
      email: 'kim@example.com',
      phone: '010-0000-0000',
      message: 'Need company setup advice',
    });
  });

  it('rejects overlong summary instead of truncating', () => {
    const planned = planContactFormSubmit({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'ko',
      sessionId,
      enabledFields: defaultFields,
      values: values({ message: 'x'.repeat(10_001) }),
      consentChecked: true,
    });
    expect(planned.kind).toBe('blocked');
    if (planned.kind !== 'blocked') return;
    expect(planned.reason).toBe('validation');
  });
});

describe('contact form submit client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts one consultation payload when consent is checked', async () => {
    const fetchImpl = vi.fn<FetchLike>(async () => new Response(JSON.stringify({
      success: true,
      intakeId: 'HC-TEST1234',
      message: 'Consultation intake submitted.',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

    const outcome = await submitContactForm({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'ko',
      sessionId,
      enabledFields: defaultFields,
      values: values(),
      consentChecked: true,
    }, fetchImpl);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [, init] = fetchImpl.mock.calls[0];
    expect(init?.credentials).toBe('same-origin');
    const posted = JSON.parse(String(init?.body));
    expect(posted.collectedFields.consent).toBe(true);
    expect(posted.collectedFields.summary).toBe('Need company setup advice');
    expect(outcome).toMatchObject({ status: 'success', intakeId: 'HC-TEST1234' });
    expect(outcome.status === 'success' ? outcome.message : '').toContain('HC-TEST1234');
    expect(outcome.status === 'success' ? outcome.message : '').not.toMatch(/메일함|inbox|데이터베이스|database/i);
  });

  it('does not fetch when consent is missing', async () => {
    const fetchImpl = vi.fn<FetchLike>();
    const outcome = await submitContactForm({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'ko',
      sessionId,
      enabledFields: defaultFields,
      values: values(),
      consentChecked: false,
    }, fetchImpl);
    expect(fetchImpl).toHaveBeenCalledTimes(0);
    expect(outcome.status).toBe('blocked');
  });

  it('does not treat HTTP ok plus success false as success', async () => {
    const fetchImpl = vi.fn<FetchLike>(async () => new Response(JSON.stringify({
      success: false,
      error: 'Automatic intake is unavailable right now. Please email wei@hoveringlaw.com.tw directly.',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

    const outcome = await submitContactForm({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'en',
      sessionId,
      enabledFields: defaultFields,
      values: values(),
      consentChecked: true,
    }, fetchImpl);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(outcome.status).toBe('error');
    if (outcome.status !== 'error') return;
    expect(outcome.message).toContain('wei@hoveringlaw.com.tw');
  });

  it('does not auto-retry unknown network failure', async () => {
    const fetchImpl = vi.fn<FetchLike>(async () => {
      throw new Error('network down');
    });
    const outcome = await submitContactForm({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'ko',
      sessionId,
      enabledFields: defaultFields,
      values: values(),
      consentChecked: true,
    }, fetchImpl);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(outcome.status).toBe('error');
  });

  it('treats duplicate true with intakeId as already-received success', async () => {
    const fetchImpl = vi.fn<FetchLike>(async () => new Response(JSON.stringify({
      success: true,
      intakeId: 'HC-DUP1',
      duplicate: true,
      message: 'This consultation was already submitted.',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    const outcome = await submitContactForm({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'en',
      sessionId,
      enabledFields: defaultFields,
      values: values(),
      consentChecked: true,
    }, fetchImpl);
    expect(outcome).toMatchObject({ status: 'success', intakeId: 'HC-DUP1' });
    if (outcome.status !== 'success') return;
    expect(outcome.message).toContain('already received');
    expect(outcome.message).toContain('HC-DUP1');
    expect(outcome.message).not.toContain('This consultation was already submitted.');
  });

  it('requires nonempty intakeId even when success is true', async () => {
    const fetchImpl = vi.fn<FetchLike>(async () => new Response(JSON.stringify({
      success: true,
      intakeId: '   ',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    const outcome = await submitContactForm({
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      locale: 'ko',
      sessionId,
      enabledFields: defaultFields,
      values: values(),
      consentChecked: true,
    }, fetchImpl);
    expect(outcome.status).toBe('error');
  });

  it('preserves custom-action flat JSON and HTTP ok success', async () => {
    const fetchImpl = vi.fn<FetchLike>(async () => new Response('ok', { status: 200 }));
    const outcome = await submitContactForm({
      action: 'https://example.test/hook',
      locale: 'ko',
      sessionId,
      enabledFields: defaultFields,
      values: values(),
      consentChecked: false,
    }, fetchImpl);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [, init] = fetchImpl.mock.calls[0];
    expect(JSON.parse(String(init?.body))).toEqual({
      name: 'Kim',
      email: 'kim@example.com',
      phone: '010-0000-0000',
      message: 'Need company setup advice',
    });
    expect(outcome.status).toBe('success');
  });
});
