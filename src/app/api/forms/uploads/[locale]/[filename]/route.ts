import { NextRequest, NextResponse } from 'next/server';
import {
  normalizeFormUploadAddress,
  readFormUpload,
  verifyFormUploadSignature,
} from '@/lib/builder/forms/uploads';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ locale: string; filename: string }> }
) {
  const params = await props.params;
  const address = normalizeFormUploadAddress(params.locale, params.filename);
  if (!address) {
    return privateJson({ error: 'Invalid upload path.' }, 400);
  }

  const signatureIsValid = verifyFormUploadSignature({
    ...address,
    expires: request.nextUrl.searchParams.get('expires'),
    signature: request.nextUrl.searchParams.get('signature'),
  });
  if (!signatureIsValid) {
    const admin = await guardBuilderReadWithPermission(request, 'manage-forms');
    if (admin instanceof NextResponse) {
      return privateJson({ error: 'Invalid or expired upload link.' }, 403);
    }
  }

  const upload = await readFormUpload(address);
  if (!upload) return privateJson({ error: 'File not found.' }, 404);

  return new NextResponse(bufferToArrayBuffer(upload.content), {
    headers: {
      'Content-Type': upload.contentType,
      'Content-Disposition': attachmentDisposition(address.filename),
      'Cache-Control': 'private, no-store, max-age=0',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, noarchive',
    },
  });
}

function privateJson(body: { error: string }, status: number): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, noarchive',
    },
  });
}

function attachmentDisposition(filename: string): string {
  return `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}
