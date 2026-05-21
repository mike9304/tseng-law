import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createNotificationTemplate,
  isNotificationEventType,
  listNotificationTemplates,
  notificationTemplateInputSchema,
  type NotificationEventType,
} from '@/lib/builder/bookings/notification-template-store';
import { isLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const eventTypeRaw = request.nextUrl.searchParams.get('eventType');
  const localeRaw = request.nextUrl.searchParams.get('locale');

  let eventType: NotificationEventType | undefined;
  if (eventTypeRaw) {
    if (!isNotificationEventType(eventTypeRaw)) {
      return NextResponse.json({ error: 'Unknown eventType' }, { status: 400 });
    }
    eventType = eventTypeRaw;
  }

  let locale: Locale | undefined;
  if (localeRaw) {
    if (!isLocale(localeRaw)) {
      return NextResponse.json({ error: 'Unknown locale' }, { status: 400 });
    }
    locale = localeRaw;
  }

  const templates = await listNotificationTemplates({ eventType, locale });
  return NextResponse.json({ templates });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const parsed = notificationTemplateInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid template payload', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  const result = await createNotificationTemplate(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }
  return NextResponse.json({ template: result.template }, { status: 201 });
}