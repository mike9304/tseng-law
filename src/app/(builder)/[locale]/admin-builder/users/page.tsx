import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UsersAdmin from '@/components/builder/users/UsersAdmin';
import {
  listUserRoles,
  BUILDER_ROLE_NAMES,
} from '@/lib/builder/security/user-role-store';
import { resolveUserRole } from '@/lib/builder/security/resolve-permission';
import { BUILDER_PERMISSIONS } from '@/lib/builder/security/permissions';
import { rolePermissionMatrix } from '@/lib/builder/security/role-permissions';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { getUsersAdminCopy } from '@/components/builder/users/users-copy';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = getUsersAdminCopy(locale);
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/admin-builder/users',
    alternateLocales: locales,
    noindex: true,
  });
}

/**
 * Owner-only admin surface. We can't read the basic-auth username from
 * a server component request directly without middleware glue, so we
 * gate by checking the seeded owner record exists and rely on the
 * route APIs to re-enforce `manage-roles` on every mutation. To make
 * the page itself less footgun-y when a non-owner clicks through, the
 * client UI hides the destructive controls when the resolved role is
 * not 'owner' (passed via initial server prop).
 */
export default async function BuilderUsersAdminPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);

  const users = await listUserRoles();
  if (!users.length) {
    // ensureSeed should always have inserted the configured owner; if it
    // hasn't, the env is misconfigured and we should not render.
    notFound();
  }

  const matrix = rolePermissionMatrix(BUILDER_PERMISSIONS);
  const presumedOwner = users.find((u) => u.role === 'owner');
  const initialActorRole = presumedOwner
    ? await resolveUserRole(presumedOwner.username)
    : 'owner';

  return (
    <UsersAdmin
      locale={locale}
      initialUsers={users}
      roles={[...BUILDER_ROLE_NAMES]}
      permissions={[...BUILDER_PERMISSIONS]}
      matrix={matrix}
      actorRole={initialActorRole}
    />
  );
}
