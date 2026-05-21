import type { Locale } from '@/lib/locales';
import { listColumnBundles } from '@/lib/builder/columns/storage';
import { buildNativeBlogAdminModel, type NativeBlogAdminModel } from '@/lib/builder/blog/admin-model';

export async function readNativeBlogAdminModel(
  locale: Locale,
  now = new Date(),
): Promise<NativeBlogAdminModel> {
  const bundles = await listColumnBundles(locale);
  return buildNativeBlogAdminModel(locale, bundles, now);
}
