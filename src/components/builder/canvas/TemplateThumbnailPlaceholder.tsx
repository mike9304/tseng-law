import type { PageTemplate } from '@/lib/builder/templates/types';
import type { Locale } from '@/lib/locales';
import TemplateThumbnailRenderer from './TemplateThumbnailRenderer';

export default function TemplateThumbnailPlaceholder({
  template,
  width = 240,
  height = 160,
  locale = 'ko',
}: {
  template: PageTemplate;
  width?: number;
  height?: number;
  locale?: Locale;
}) {
  return <TemplateThumbnailRenderer template={template} width={width} height={height} eager locale={locale} />;
}
