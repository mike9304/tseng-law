import {
  LLMS_TXT_CACHE_CONTROL,
  buildRootLlmsTxt,
} from '@/lib/llms-txt';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildRootLlmsTxt(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': LLMS_TXT_CACHE_CONTROL,
      'x-content-type-options': 'nosniff',
    },
  });
}
