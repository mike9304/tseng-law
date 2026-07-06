import type { ServiceArea } from '@/data/service-details';
import type { ColumnPost } from '@/lib/columns';
import type { Locale } from '@/lib/locales';
import type { BuilderAttorneyProfileItem, BuilderServiceItem } from '@/lib/builder/types';

export function readColumnDatasetField(post: ColumnPost, fieldId: string): string {
  switch (fieldId) {
    case 'slug':
      return post.slug;
    case 'title':
      return post.title;
    case 'category':
      return post.category;
    case 'categoryLabel':
      return post.categoryLabel;
    case 'date':
      return post.date;
    default:
      return '';
  }
}

export function readServiceItemDatasetField(item: BuilderServiceItem, fieldId: string): string {
  switch (fieldId) {
    case 'slug':
      return item.href.split('/').filter(Boolean).slice(-1)[0] ?? item.href;
    case 'title':
      return item.title;
    case 'description':
      return item.description;
    case 'href':
      return item.href;
    default:
      return '';
  }
}

export function readServiceAreaDatasetField(
  service: ServiceArea,
  fieldId: string,
  locale: Locale,
): string {
  switch (fieldId) {
    case 'slug':
      return service.slug;
    case 'title':
      return service.title[locale];
    case 'description':
      return service.subtitle[locale];
    case 'href':
      return service.slug;
    default:
      return '';
  }
}

export function readAttorneyProfileDatasetField(item: BuilderAttorneyProfileItem, fieldId: string): string {
  switch (fieldId) {
    case 'slug':
      return item.slug;
    case 'name':
    case 'label':
      return item.name;
    case 'role':
      return item.role;
    case 'title':
      return item.title;
    case 'description':
      return item.description;
    case 'summary':
      return item.summary.join('\n');
    case 'email':
      return item.email;
    case 'image':
    case 'src':
      return item.image;
    case 'imageAltText':
    case 'imageAlt':
    case 'alt':
      return item.imageAltText;
    case 'imageFocalX':
    case 'focalX':
      return String(item.imageFocalPoint.x);
    case 'imageFocalY':
    case 'focalY':
      return String(item.imageFocalPoint.y);
    case 'href':
    case 'url':
      return item.href;
    default:
      return '';
  }
}
