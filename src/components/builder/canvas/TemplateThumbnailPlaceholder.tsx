import type { PageTemplate } from '@/lib/builder/templates/types';
import TemplateThumbnailRenderer from './TemplateThumbnailRenderer';

export default function TemplateThumbnailPlaceholder({
  template,
  width = 240,
  height = 160,
}: {
  template: PageTemplate;
  width?: number;
  height?: number;
}) {
  return <TemplateThumbnailRenderer template={template} width={width} height={height} eager />;
}
