import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { recordFailedWebhook } from '@/lib/builder/forms/webhook-retry';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';

vi.mock('@/lib/builder/forms/form-engine', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/forms/form-engine')>(
    '@/lib/builder/forms/form-engine',
  );
  return {
    ...actual,
    loadFormSchema: vi.fn(),
    saveSubmission: vi.fn(),
  };
});

vi.mock('@/lib/builder/forms/uploads', () => ({
  saveFormUpload: vi.fn(async ({ fieldId, file }: { fieldId: string; file: File }) => ({
    fieldId,
    name: file.name,
    size: file.size,
    type: file.type,
    pathname: `builder-forms/uploads/ko/${file.name}`,
    url: `/api/forms/uploads/ko/${file.name}`,
    uploadedAt: '2026-05-11T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({
  emitEvent: vi.fn(),
}));

vi.mock('@/lib/builder/forms/webhook-retry', () => ({
  recordFailedWebhook: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 4, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/cms-editable', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/cms-editable')>(
    '@/lib/builder/cms-editable',
  );
  return {
    ...actual,
    createEditableBuilderCmsRecord: vi.fn(),
    readEditableBuilderCmsCollection: vi.fn(),
  };
});

describe('/api/forms/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 4, retryAfterMs: 0 });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('validates against stored form schema and rejects invalid fields', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [
        {
          id: 'amount',
          type: 'number',
          label: 'Amount',
          required: true,
          validation: { min: 10, max: 20 },
        },
      ],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'lead-form',
      formName: 'Lead form',
      submitTo: 'storage',
      fields: { amount: '50' },
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.validationErrors).toEqual(
      expect.arrayContaining([expect.objectContaining({ fieldId: 'amount' })]),
    );
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('materializes signature data URLs and stores submission files', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue(null);
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'signature-form',
      formName: 'Signature form',
      submitTo: 'storage',
      fields: { signature: 'data:image/png;base64,aGVsbG8=' },
      locale: 'ko',
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(engine.saveSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        formId: 'signature-form',
        data: expect.objectContaining({ signature: '/api/forms/uploads/ko/signature-signature.png' }),
        files: expect.arrayContaining([expect.objectContaining({ fieldId: 'signature' })]),
      }),
    );
  });

  it('writes mapped submissions to a configured CMS collection as pending records by default', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    const cms = await import('@/lib/builder/cms-editable');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [
        { id: 'name', type: 'text', label: 'Name', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
        { id: 'budget', type: 'number', label: 'Budget', required: false },
        { id: 'consent', type: 'checkbox', label: 'Consent', required: true },
      ],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      storeInCms: true,
      cmsMapping: {
        enabled: true,
        collectionId: 'lead-requests',
        fields: [
          { formFieldId: 'name', cmsFieldKey: 'name' },
          { formFieldId: 'email', cmsFieldKey: 'email' },
          { formFieldId: 'budget', cmsFieldKey: 'budget' },
          { formFieldId: 'consent', cmsFieldKey: 'consent' },
        ],
      },
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    vi.mocked(cms.createEditableBuilderCmsRecord).mockResolvedValue({
      recordId: 'record_1',
      status: 'pending',
      fields: {},
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'lead-form',
      formName: 'Lead form',
      submitTo: 'storage',
      fields: {
        name: 'Jane Client',
        email: 'jane@example.test',
        budget: '300',
        consent: 'on',
      },
      locale: 'ko',
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.cmsRecordId).toBe('record_1');
    expect(cms.createEditableBuilderCmsRecord).toHaveBeenCalledWith(
      'tseng-law-main-site',
      'ko',
      'lead-requests',
      {
        status: 'pending',
        locale: 'ko',
        fields: {
          name: 'Jane Client',
          email: 'jane@example.test',
          budget: 300,
          consent: 'true',
        },
      },
      { actor: 'public', actorLabel: 'Public form visitor' },
    );
  });

  it('does not write to CMS for legacy storeInCms forms without an enabled mapping', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    const cms = await import('@/lib/builder/cms-editable');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'legacy-form',
      name: 'Legacy form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      storeInCms: true,
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'legacy-form',
      formName: 'Legacy form',
      submitTo: 'storage',
      fields: { email: 'client@example.test' },
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);

    expect(response.status).toBe(200);
    expect(cms.createEditableBuilderCmsRecord).not.toHaveBeenCalled();
  });

  it('returns clear CMS field errors when mapped record validation fails', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    const cms = await import('@/lib/builder/cms-editable');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      storeInCms: true,
      cmsMapping: {
        enabled: true,
        collectionId: 'lead-requests',
        fields: [{ formFieldId: 'email', cmsFieldKey: 'email' }],
      },
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    vi.mocked(cms.createEditableBuilderCmsRecord).mockRejectedValue(
      new cms.BuilderCmsValidationError('CMS record validation failed.', ['Email must be unique.']),
    );
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'lead-form',
      formName: 'Lead form',
      submitTo: 'storage',
      fields: { email: 'client@example.test' },
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toContain('CMS 레코드 검증');
    expect(payload.cmsIssues).toEqual(['Email must be unique.']);
  });

  it('passes visitor upload files to CMS image fields as media references', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    const cms = await import('@/lib/builder/cms-editable');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [
        { id: 'name', type: 'text', label: 'Name', required: true },
        { id: 'photo', type: 'file', label: 'Photo', required: true, validation: { accept: 'image/*' } },
      ],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      storeInCms: true,
      cmsMapping: {
        enabled: true,
        collectionId: 'lead-requests',
        fields: [
          { formFieldId: 'name', cmsFieldKey: 'title' },
          { formFieldId: 'photo', cmsFieldKey: 'photo' },
        ],
      },
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    vi.mocked(cms.readEditableBuilderCmsCollection).mockResolvedValue({
      collectionId: 'lead-requests',
      name: 'Lead requests',
      slug: 'lead-requests',
      description: '',
      localized: false,
      fieldCount: 2,
      indexCount: 0,
      recordCount: 0,
      permissions: { read: ['admin'], create: ['public', 'admin'], update: ['admin'], delete: ['admin'] },
      fields: [
        { fieldId: 'field-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
        { fieldId: 'field-photo', key: 'photo', label: 'Photo', type: 'image', localized: false, repeated: false, required: true },
      ],
      indexes: [],
      records: [],
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    vi.mocked(cms.createEditableBuilderCmsRecord).mockResolvedValue({
      recordId: 'record_media',
      status: 'pending',
      fields: {},
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'lead-form',
      formName: 'Lead form',
      submitTo: 'storage',
      fields: { name: 'Jane Client' },
      files: [
        {
          fieldId: 'photo',
          name: 'case-photo.png',
          size: 128,
          type: 'image/png',
          url: '/api/forms/uploads/ko/case-photo.png',
          scan: {
            status: 'passed',
            provider: 'local-upload-scan',
            scannedAt: '2026-05-11T00:00:00Z',
          },
        },
      ],
      locale: 'ko',
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.cmsRecordId).toBe('record_media');
    expect(cms.createEditableBuilderCmsRecord).toHaveBeenCalledWith(
      'tseng-law-main-site',
      'ko',
      'lead-requests',
      expect.objectContaining({
        fields: {
          title: 'Jane Client',
          photo: {
            url: '/api/forms/uploads/ko/case-photo.png',
            filename: 'case-photo.png',
            altText: 'case-photo',
          },
        },
      }),
      { actor: 'public', actorLabel: 'Public form visitor' },
    );
  });

  it('rejects multiple visitor upload files mapped to one CMS image field', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    const cms = await import('@/lib/builder/cms-editable');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [
        { id: 'photo', type: 'file', label: 'Photo', required: true, validation: { accept: 'image/*' } },
      ],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      storeInCms: true,
      cmsMapping: {
        enabled: true,
        collectionId: 'lead-requests',
        fields: [{ formFieldId: 'photo', cmsFieldKey: 'photo' }],
      },
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    vi.mocked(cms.readEditableBuilderCmsCollection).mockResolvedValue({
      collectionId: 'lead-requests',
      name: 'Lead requests',
      slug: 'lead-requests',
      description: '',
      localized: false,
      fieldCount: 1,
      indexCount: 0,
      recordCount: 0,
      permissions: { read: ['admin'], create: ['public', 'admin'], update: ['admin'], delete: ['admin'] },
      fields: [
        { fieldId: 'field-photo', key: 'photo', label: 'Photo', type: 'image', localized: false, repeated: false, required: true },
      ],
      indexes: [],
      records: [],
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'lead-form',
      formName: 'Lead form',
      submitTo: 'storage',
      fields: {},
      files: [
        { fieldId: 'photo', name: 'one.png', size: 128, type: 'image/png', url: '/api/forms/uploads/ko/one.png' },
        { fieldId: 'photo', name: 'two.png', size: 128, type: 'image/png', url: '/api/forms/uploads/ko/two.png' },
      ],
      locale: 'ko',
      loadedAt: 0,
      submittedAt: 4000,
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.cmsIssues).toEqual(['이미지 CMS 필드에는 하나의 업로드 파일만 매핑할 수 있습니다.']);
    expect(cms.createEditableBuilderCmsRecord).not.toHaveBeenCalled();
  });

  it('returns Retry-After when the submit rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 2500 });
    const engine = await import('@/lib/builder/forms/form-engine');
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({}));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('3');
    expect(payload.error).toContain('요청이 너무 많습니다');
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('rejects configured honeypot field submissions without saving', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      antiSpam: { honeypotFieldName: 'companyUrl' },
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'lead-form',
      formName: 'Lead form',
      submitTo: 'storage',
      fields: { email: 'client@example.test', companyUrl: 'https://spam.example' },
      loadedAt: 0,
      submittedAt: 4000,
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toContain('잠시 후');
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('rejects duplicate submissions using configured form fields', async () => {
    vi.mocked(checkRateLimit)
      .mockResolvedValueOnce({ allowed: true, remaining: 4, retryAfterMs: 0 })
      .mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 5000 });
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      antiSpam: {
        duplicateWindowMs: 60_000,
        duplicateFields: ['email'],
      },
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'lead-form',
      formName: 'Lead form',
      submitTo: 'storage',
      fields: { email: 'client@example.test' },
      loadedAt: 0,
      submittedAt: 4000,
    }));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(response.headers.get('retry-after')).toBe('5');
    expect(payload.error).toContain('이미 접수된 내용');
    expect(engine.saveSubmission).not.toHaveBeenCalled();
    expect(checkRateLimit).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/^forms-duplicate:lead-form:/),
      1,
      60_000,
    );
  });

  it('rejects file entries whose URL uses an unsafe scheme', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue(null);
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'attachment-form',
      formName: 'Attachment form',
      submitTo: 'storage',
      fields: { email: 'client@example.test' },
      files: [
        {
          fieldId: 'doc',
          name: 'evil.txt',
          size: 12,
          url: 'javascript:alert(document.domain)',
        },
      ],
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBeDefined();
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('refuses SSRF-targeting webhookUrl without fetching or recording', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue(null);
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'webhook-form',
      formName: 'Webhook form',
      submitTo: 'webhook',
      webhookUrl: 'http://169.254.169.254/latest/meta-data/',
      fields: { email: 'client@example.test' },
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(recordFailedWebhook).not.toHaveBeenCalled();
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('webhook forward refused'),
      expect.any(String),
    );
    consoleWarn.mockRestore();
  });

  it('records failed webhook deliveries without failing the form response', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue(null);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fetchMock = vi.fn(async () => new Response('downstream unavailable', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'webhook-form',
      formName: 'Webhook form',
      submitTo: 'webhook',
      webhookUrl: 'https://hooks.example.test/form',
      fields: { email: 'client@example.test' },
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://hooks.example.test/form',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(recordFailedWebhook).toHaveBeenCalledWith(
      'https://hooks.example.test/form',
      expect.objectContaining({
        formName: 'Webhook form',
        fields: { email: 'client@example.test' },
      }),
      expect.any(Error),
    );
    consoleError.mockRestore();
  });
});

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/forms/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': randomIp() },
    body: JSON.stringify(body),
  });
}

function randomIp(): string {
  return `127.0.0.${Math.floor(Math.random() * 200) + 1}`;
}
