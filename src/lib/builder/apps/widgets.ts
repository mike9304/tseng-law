import { findLocalBuilderAppManifest } from '@/lib/builder/apps/catalog';
import {
  normalizeBuilderInstalledApps,
  type BuilderAppWidget,
  type BuilderInstalledApp,
} from '@/lib/builder/apps/types';
import type { BuilderCanvasNode, BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';

const BUILDER_APP_WIDGET_KIND_BY_COMPONENT: Partial<Record<string, BuilderCanvasNodeKind>> = {
  SiteSearchBox: 'site-search',
  FaqListWidget: 'faqList',
  AppointmentRequestWidget: 'booking-widget',
  BlogListWidget: 'blog-feed',
  BlogPostWidget: 'blog-post-card',
  BlogCategoriesWidget: 'blog-categories',
  BlogAuthorWidget: 'blog-author',
  BlogRecentPostsWidget: 'blog-recent-posts',
  BlogSearchWidget: 'site-search',
  LiveChatLauncherWidget: 'floating-chat',
  EventsListWidget: 'event-list',
  EventsCalendarWidget: 'event-calendar',
  EventsRsvpWidget: 'event-rsvp',
  PortfolioListWidget: 'portfolio-list',
  ProductGalleryWidget: 'product-gallery',
};

export interface BuilderRegisteredAppWidget {
  id: string;
  appId: string;
  widgetId: string;
  appName: string;
  appIcon: string;
  name: string;
  area: BuilderAppWidget['area'];
  component: string;
  description?: string;
  defaultSize?: BuilderAppWidget['defaultSize'];
  defaultContent?: Record<string, unknown>;
  canvasKind?: BuilderCanvasNodeKind;
  insertable: boolean;
  unavailableReason?: string;
}

export type BuilderAppWidgetRuntimeStatus =
  | 'enabled'
  | 'disabled'
  | 'not-installed'
  | 'unknown-widget'
  | 'unmapped-kind';

export interface BuilderAppWidgetRuntimeResolution {
  id: string;
  appId: string;
  widgetId: string;
  component?: string;
  canvasKind?: BuilderCanvasNodeKind;
  status: BuilderAppWidgetRuntimeStatus;
  widget?: BuilderRegisteredAppWidget;
}

export function resolveBuilderAppWidgetCanvasKind(component: string): BuilderCanvasNodeKind | undefined {
  return BUILDER_APP_WIDGET_KIND_BY_COMPONENT[component];
}

function projectBuilderAppWidget(
  manifest: NonNullable<ReturnType<typeof findLocalBuilderAppManifest>>,
  widget: BuilderAppWidget,
): BuilderRegisteredAppWidget {
  const canvasKind = resolveBuilderAppWidgetCanvasKind(widget.component);
  return {
    id: `app:${manifest.appId}:${widget.widgetId}`,
    appId: manifest.appId,
    widgetId: widget.widgetId,
    appName: manifest.name,
    appIcon: manifest.icon,
    name: widget.name,
    area: widget.area,
    component: widget.component,
    ...(widget.description ? { description: widget.description } : {}),
    ...(widget.defaultSize ? { defaultSize: widget.defaultSize } : {}),
    ...(widget.defaultContent ? { defaultContent: widget.defaultContent } : {}),
    ...(canvasKind ? { canvasKind } : {}),
    insertable: Boolean(canvasKind),
    ...(canvasKind ? {} : { unavailableReason: 'Widget runtime is not available yet.' }),
  };
}

export function listEnabledBuilderAppWidgetsFromInstalled(
  installedApps: BuilderInstalledApp[],
): BuilderRegisteredAppWidget[] {
  return normalizeBuilderInstalledApps(installedApps)
    .filter((installation) => installation.status === 'enabled')
    .flatMap((installation) => {
      const manifest = findLocalBuilderAppManifest(installation.appId);
      if (!manifest) return [];
      return manifest.widgets.map((widget) => projectBuilderAppWidget(manifest, widget));
    });
}

export function resolveBuilderAppWidgetRuntimeForNode(
  node: BuilderCanvasNode,
  installedApps: BuilderInstalledApp[],
): BuilderAppWidgetRuntimeResolution | null {
  if (!node.appWidget) return null;

  const { appId, widgetId } = node.appWidget;
  const id = `app:${appId}:${widgetId}`;
  const manifest = findLocalBuilderAppManifest(appId);
  const manifestWidget = manifest?.widgets.find((widget) => widget.widgetId === widgetId);

  if (!manifest || !manifestWidget) {
    return {
      id,
      appId,
      widgetId,
      status: 'unknown-widget',
    };
  }

  const widget = projectBuilderAppWidget(manifest, manifestWidget);
  const installation = normalizeBuilderInstalledApps(installedApps)
    .find((installedApp) => installedApp.appId === appId);
  const runtimeBase = {
    id,
    appId,
    widgetId,
    component: widget.component,
    ...(widget.canvasKind ? { canvasKind: widget.canvasKind } : {}),
    widget,
  };

  if (!installation) {
    return {
      ...runtimeBase,
      status: 'not-installed',
    };
  }

  if (installation.status !== 'enabled') {
    return {
      ...runtimeBase,
      status: 'disabled',
    };
  }

  if (!widget.canvasKind || widget.canvasKind !== node.kind) {
    return {
      ...runtimeBase,
      status: 'unmapped-kind',
    };
  }

  return {
    ...runtimeBase,
    status: 'enabled',
  };
}

export function builderAppWidgetMatchesSearch(
  widget: BuilderRegisteredAppWidget,
  normalizedQuery: string,
): boolean {
  if (!normalizedQuery) return true;
  return [
    widget.id,
    widget.appId,
    widget.widgetId,
    widget.appName,
    widget.name,
    widget.area,
    widget.component,
    widget.description ?? '',
    widget.canvasKind ?? '',
  ].some((value) => value.toLowerCase().includes(normalizedQuery));
}
