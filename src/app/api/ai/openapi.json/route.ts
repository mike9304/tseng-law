import { NextRequest } from 'next/server';
import { serializeAiIntakeOpenApiDocument } from '@/lib/ai-intake/openapi/document';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(_request: NextRequest): Response {
  return new Response(serializeAiIntakeOpenApiDocument(), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    },
  });
}
