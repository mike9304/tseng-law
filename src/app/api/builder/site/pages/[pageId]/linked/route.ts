import { NextRequest, NextResponse } from 'next/server';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface LinkedPageInfo {
  pageId: string;
  locale: Locale;
  slug: string;
  title: string;
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function GET(request: NextRequest, props: { params: Promise<{ pageId: string }> }) {
  const params = await props.params;
  const auth = await guardBuilderReadWithPermission(request, 'edit-pages');
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const siteId = resolveBuilderSiteIdFromRequest(request);
    const site = await readSiteDocument(siteId, locale);
    const page = site.pages.find((candidate) => candidate.pageId === params.pageId);
    if (!page) {
      return errorResponse(locale, 'page_not_found', 404);
    }

    const linkedPages: Record<string, LinkedPageInfo | null> = {};
    for (const targetLocale of locales) {
      if (targetLocale === page.locale) {
        linkedPages[targetLocale] = {
          pageId: page.pageId,
          locale: page.locale,
          slug: page.slug,
          title: page.title[targetLocale] || page.title[page.locale] || page.slug || 'Home',
        };
        continue;
      }
      const linkedId = page.linkedPageIds?.[targetLocale];
      const linked = linkedId
        ? site.pages.find((candidate) => candidate.pageId === linkedId)
        : site.pages.find((candidate) => candidate.locale === targetLocale && candidate.slug === page.slug);
      linkedPages[targetLocale] = linked
        ? {
            pageId: linked.pageId,
            locale: linked.locale,
            slug: linked.slug,
            title: linked.title[targetLocale] || linked.title[linked.locale] || linked.slug || 'Page',
          }
        : null;
    }

    return NextResponse.json({ ok: true, linkedPages });
  } catch {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    return errorResponse(locale, 'linked_pages_load_failed', 500);
  }
}
