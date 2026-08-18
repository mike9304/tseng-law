import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { recordFailedWebhook } from '@/lib/builder/forms/webhook-retry';
import {
  readFormUpload,
  saveFormUpload,
  verifyFormUploadSignature,
} from '@/lib/builder/forms/uploads';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';

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

vi.mock('@/lib/builder/forms/uploads', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/forms/uploads')>(
    '@/lib/builder/forms/uploads',
  );
  return {
    ...actual,
    saveFormUpload: vi.fn(async ({ fieldId, file }: { fieldId: string; file: File }) => ({
      fieldId,
      name: file.name,
      size: file.size,
      type: file.type,
      pathname: `builder-forms/uploads/ko/${file.name}`,
      url: `/api/forms/uploads/ko/${file.name}?expires=2000000000&signature=test`,
      uploadedAt: '2026-05-11T00:00:00.000Z',
    })),
    readFormUpload: vi.fn(),
    verifyFormUploadSignature: vi.fn(),
  };
});

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
    vi.mocked(verifyFormUploadSignature).mockReturnValue(true);
    vi.mocked(readFormUpload).mockImplementation(async ({ filename }) => {
      const content = Buffer.alloc(128);
      content.set(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
      return {
        content,
        contentType: filename.endsWith('.png') ? 'image/png' : 'application/octet-stream',
      };
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('requires a safe formId before attempting schema lookup or persistence', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    const route = await import('../submit/route');

    const missingResponse = await route.POST(makeRequest({
      formName: 'Client-only form',
      fields: {},
    }));
    const unsafeResponse = await route.POST(makeRequest({
      formId: '../lead-form',
      fields: {},
    }));

    expect(missingResponse.status).toBe(400);
    expect(unsafeResponse.status).toBe(400);
    expect(engine.loadFormSchema).not.toHaveBeenCalled();
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('rejects an unknown stored form before storage, events, or delivery', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue(null);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'unknown-form',
      formName: 'Client form',
      submitTo: 'email',
      targetEmail: 'attacker@example.test',
      fields: {},
    }));

    expect(response.status).toBe(404);
    expect(engine.saveSubmission).not.toHaveBeenCalled();
    expect(emitEvent).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects undeclared fields before storage or delivery', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      notifyEmail: 'enabled@example.test',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'lead-form',
      fields: {
        email: 'client@example.test',
        adminNotes: 'attacker-controlled',
      },
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.validationErrors).toContainEqual(expect.objectContaining({ fieldId: 'adminNotes' }));
    expect(engine.saveSubmission).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('allows only the configured honeypot as an undeclared server-side field', async () => {
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
      fields: {
        email: 'client@example.test',
        companyUrl: '',
      },
    }));

    expect(response.status).toBe(200);
    expect(engine.saveSubmission).toHaveBeenCalled();
  });

  it('rejects excessive submitted field counts', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    const fields = Array.from({ length: 65 }, (_, index) => ({
      id: `field-${index}`,
      type: 'text' as const,
      label: `Field ${index}`,
      required: false,
    }));
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'large-form',
      name: 'Large form',
      fields,
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'large-form',
      fields: Object.fromEntries(fields.map((field) => [field.id, 'x'])),
    }));

    expect(response.status).toBe(400);
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('rejects excessive aggregate field content even when each value is under its limit', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'large-form',
      name: 'Large form',
      fields: [
        { id: 'partOne', type: 'textarea', label: 'Part one', required: false },
        { id: 'partTwo', type: 'textarea', label: 'Part two', required: false },
      ],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'large-form',
      fields: {
        partOne: 'a'.repeat(80_001),
        partTwo: 'b'.repeat(80_001),
      },
    }));

    expect(response.status).toBe(400);
    expect(engine.saveSubmission).not.toHaveBeenCalled();
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
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'signature-form',
      name: 'Signature form',
      fields: [{
        id: 'signature',
        type: 'file',
        label: 'Signature',
        required: true,
        validation: { accept: 'image/png', maxFileSize: 200_000 },
      }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
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
        data: expect.objectContaining({
          signature: '/api/forms/uploads/ko/signature-signature.png?expires=2000000000&signature=test',
        }),
        files: expect.arrayContaining([expect.objectContaining({ fieldId: 'signature' })]),
      }),
    );
  });

  it('rejects arbitrary client file URLs without reading or persisting them', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'file-form',
      name: 'File form',
      fields: [{
        id: 'attachment',
        type: 'file',
        label: 'Attachment',
        required: false,
        validation: { accept: 'image/png', maxFileSize: 1024 },
      }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'file-form',
      formName: 'File form',
      submitTo: 'storage',
      fields: {},
      files: [{
        fieldId: 'attachment',
        name: 'payload.png',
        size: 12,
        type: 'image/png',
        url: 'https://evil.example/payload.png',
      }],
      loadedAt: 0,
      submittedAt: 4000,
    }));

    expect(response.status).toBe(400);
    expect(readFormUpload).not.toHaveBeenCalled();
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('rejects image data URLs that are not bound to a stored file or signature field', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'text-form',
      name: 'Text form',
      fields: [{ id: 'message', type: 'textarea', label: 'Message', required: false }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'text-form',
      formName: 'Text form',
      submitTo: 'storage',
      fields: { message: 'data:image/png;base64,aGVsbG8=' },
      loadedAt: 0,
      submittedAt: 4000,
    }));

    expect(response.status).toBe(400);
    expect(saveFormUpload).not.toHaveBeenCalled();
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('uses the stored captcha provider even when the client submits provider none', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.stubEnv('HCAPTCHA_SECRET', 'server-hcaptcha-secret');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'captcha-form',
      name: 'Captcha form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      captcha: 'hcaptcha',
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: false }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'captcha-form',
      formName: 'Captcha form',
      submitTo: 'storage',
      fields: { email: 'client@example.test' },
      captchaProvider: 'none',
      captchaToken: 'attacker-token',
      loadedAt: 0,
      submittedAt: 4000,
    }));

    expect(response.status).toBe(400);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://hcaptcha.com/siteverify',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('fails closed when a stored captcha provider has no server secret', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.stubEnv('HCAPTCHA_SECRET', '');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'captcha-form',
      name: 'Captcha form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      captcha: 'hcaptcha',
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'captcha-form',
      formName: 'Captcha form',
      submitTo: 'storage',
      fields: { email: 'client@example.test' },
      captchaProvider: 'none',
      captchaToken: 'token',
      loadedAt: 0,
      submittedAt: 4000,
    }));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(engine.saveSubmission).not.toHaveBeenCalled();
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
          name: 'client-controlled-name.exe',
          size: 1,
          type: 'text/html',
          url: '/api/forms/uploads/ko/case-photo.png?expires=2000000000&signature=test',
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
            url: '/api/forms/uploads/ko/case-photo.png?expires=2000000000&signature=test',
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
        { fieldId: 'photo', name: 'one.png', size: 128, type: 'image/png', url: '/api/forms/uploads/ko/one.png?expires=2000000000&signature=test' },
        { fieldId: 'photo', name: 'two.png', size: 128, type: 'image/png', url: '/api/forms/uploads/ko/two.png?expires=2000000000&signature=test' },
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

  it('rejects cross-origin submissions before rate limiting or storage', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest(
      {
        formName: 'Lead form',
        submitTo: 'storage',
        fields: { email: 'client@example.test' },
      },
      {
        url: 'https://tseng-law.com/api/forms/submit',
        origin: 'https://attacker.example',
      },
    ));

    expect(response.status).toBe(403);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('rejects production submissions that omit both Origin and Referer', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest(
      {
        formName: 'Lead form',
        submitTo: 'storage',
        fields: { email: 'client@example.test' },
      },
      { url: 'https://tseng-law.com/api/forms/submit' },
    ));

    expect(response.status).toBe(403);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('treats stored notifyEmail only as an enable flag and fixes the recipient to Attorney Tseng', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-only-key');
    vi.stubEnv('CONSULTATION_NOTIFY_EMAIL', 'env-attacker@example.test');
    vi.stubEnv('NOTIFY_EMAIL', 'generic-attacker@example.test');
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Stored lead form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      notifyEmail: 'schema-attacker@example.test',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'lead-form',
      formName: 'Client forged form\r\nBcc: victim@example.test',
      submitTo: 'storage',
      targetEmail: 'attacker@example.test',
      fields: { email: 'client@example.test' },
      loadedAt: 0,
      submittedAt: 4000,
    }));

    expect(response.status).toBe(200);
    const fetchCalls = fetchMock.mock.calls as unknown as Array<[RequestInfo | URL, RequestInit]>;
    const resendRequest = fetchCalls[0]![1];
    expect(JSON.parse(String(resendRequest.body))).toEqual(expect.objectContaining({
      to: 'wei@hoveringlaw.com.tw',
      reply_to: 'client@example.test',
      subject: '[Form] Stored lead form',
    }));
    expect(String(resendRequest.body)).not.toContain('attacker@example.test');
    expect(engine.saveSubmission).toHaveBeenCalledWith(expect.objectContaining({
      formId: 'lead-form',
      formName: 'Stored lead form',
    }));
    expect(emitEvent).toHaveBeenCalledWith('form.submitted', expect.objectContaining({
      formId: 'lead-form',
      formName: 'Stored lead form',
    }));
  });

  it('does not send auto-reply email when only the anonymous client enables it', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-only-key');
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'lead-form',
      formName: 'Lead form',
      submitTo: 'storage',
      fields: { email: 'attacker@example.test' },
      autoReplyEnabled: true,
      autoReplyTemplate: 'Attacker-controlled email content',
      loadedAt: 0,
      submittedAt: 4000,
    }));

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects CRLF in a declared reply email before notification delivery', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-only-key');
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      notifyEmail: 'enabled@example.test',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'lead-form',
      fields: { email: 'client@example.test\r\nBcc: victim@example.test' },
    }));

    expect(response.status).toBe(400);
    expect(engine.saveSubmission).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not infer auto-reply recipients from text fields whose ids contain email', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-only-key');
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [
        { id: 'attacker_email', type: 'text', label: 'Reference', required: false },
      ],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      autoReplyEnabled: true,
      autoReplyTemplate: 'Stored reply',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'lead-form',
      autoReplyEnabled: true,
      fields: { attacker_email: 'attacker@example.test' },
    }));

    expect(response.status).toBe(200);
    expect(engine.saveSubmission).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an undeclared attacker_email before it can trigger auto-reply', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-only-key');
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [{ id: 'message', type: 'textarea', label: 'Message', required: false }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      autoReplyEnabled: true,
      autoReplyTemplate: 'Stored reply',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'lead-form',
      fields: {
        message: 'hello',
        attacker_email: 'attacker@example.test',
      },
    }));

    expect(response.status).toBe(400);
    expect(engine.saveSubmission).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uses only the stored form auto-reply setting and template', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-only-key');
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      autoReplyEnabled: true,
      autoReplyTemplate: 'Server-configured reply',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    } as never);
    const fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'lead-form',
      formName: 'Lead form',
      submitTo: 'storage',
      fields: { email: 'client@example.test' },
      autoReplyEnabled: false,
      autoReplyTemplate: 'Attacker-controlled email content',
      loadedAt: 0,
      submittedAt: 4000,
    }));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const fetchCalls = fetchMock.mock.calls as unknown as Array<[RequestInfo | URL, RequestInit]>;
    const resendBody = JSON.parse(String(fetchCalls[0]![1].body));
    expect(resendBody).toEqual(expect.objectContaining({
      to: 'client@example.test',
      html: '<p>Server-configured reply</p>',
    }));
    expect(String(fetchCalls[0]![1].body)).not.toContain('Attacker-controlled email content');
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

  it('ignores a client webhook routing request when no stored webhook is configured', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'webhook-form',
      name: 'Stored webhook form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'webhook-form',
      formName: 'Webhook form',
      submitTo: 'storage',
      webhookUrl: 'http://169.254.169.254/latest/meta-data/',
      fields: { email: 'client@example.test' },
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(engine.saveSubmission).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(recordFailedWebhook).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
    consoleWarn.mockRestore();
  });

  it('fails closed on an unsafe stored webhook before storage or network delivery', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'webhook-form',
      name: 'Webhook form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      webhookUrl: 'http://169.254.169.254/latest/meta-data/',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({
      formId: 'webhook-form',
      fields: { email: 'client@example.test' },
    }));

    expect(response.status).toBe(500);
    expect(engine.saveSubmission).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(recordFailedWebhook).not.toHaveBeenCalled();
  });

  it('records failed webhook deliveries without failing the form response', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'webhook-form',
      name: 'Stored webhook form',
      fields: [{ id: 'email', type: 'email', label: 'Email', required: true }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      webhookUrl: 'https://hooks.example.test/form',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    } as never);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fetchMock = vi.fn(async () => new Response('downstream unavailable', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'webhook-form',
      formName: 'Client forged webhook form',
      submitTo: 'storage',
      webhookUrl: 'https://attacker.example/form',
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
    expect(fetchMock).not.toHaveBeenCalledWith(
      'https://attacker.example/form',
      expect.anything(),
    );
    expect(recordFailedWebhook).toHaveBeenCalledWith(
      'https://hooks.example.test/form',
      expect.objectContaining({
        formName: 'Stored webhook form',
        fields: { email: 'client@example.test' },
      }),
      expect.any(Error),
    );
    consoleError.mockRestore();
  });
});

function makeRequest(
  body: unknown,
  options: { url?: string; origin?: string } = {},
): NextRequest {
  const headers = new Headers({
    'content-type': 'application/json',
    'x-forwarded-for': randomIp(),
  });
  if (options.origin) headers.set('origin', options.origin);
  return new NextRequest(options.url ?? 'http://localhost/api/forms/submit', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

function randomIp(): string {
  return `127.0.0.${Math.floor(Math.random() * 200) + 1}`;
}
