import { NextRequest } from 'next/server';
import { serveAiIntakeMcp } from '@/lib/ai-intake/mcp/handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<Response> {
  return serveAiIntakeMcp(request);
}

export async function GET(request: NextRequest): Promise<Response> {
  return serveAiIntakeMcp(request);
}

export async function DELETE(request: NextRequest): Promise<Response> {
  return serveAiIntakeMcp(request);
}
