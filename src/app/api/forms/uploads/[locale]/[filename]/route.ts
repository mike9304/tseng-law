import { NextRequest, NextResponse } from 'next/server';
import { readFormUpload } from '@/lib/builder/forms/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { locale: string; filename: string } },
) {
  const upload = await readFormUpload(params);
  if (!upload) return NextResponse.json({ error: 'File not found.' }, { status: 404 });

  return new NextResponse(bufferToArrayBuffer(upload.content), {
    headers: {
      'Content-Type': upload.contentType,
      'Cache-Control': 'private, max-age=300',
    },
  });
}

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}
