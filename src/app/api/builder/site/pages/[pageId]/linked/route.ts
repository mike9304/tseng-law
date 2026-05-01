import { NextRequest, NextResponse } from 'next/server';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument } from '@/lib/builder/site/persistence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface LinkedPageInfo {
  pageId: string;
  locale: Locale;
  slug: string;
  title: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const page = site.pages.find((candidate) => candidate.pageId === params.pageId);
    if (!page) {
      return NextResponse.json({ ok: false, error: 'Page not found' }, { status: 404 });
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
