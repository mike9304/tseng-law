import {
  parseBuilderAppManifest,
  type BuilderAppCategory,
  type BuilderAppManifest,
} from '@/lib/builder/apps/types';
import type { Locale } from '@/lib/locales';
import type { TranslationEntry } from '@/lib/builder/translations/types';

const RAW_LOCAL_APP_MANIFESTS = [
  {
    appId: 'site-search',
    name: 'Site Search',
    summary: 'Search box, results route, and searchable content index.',
    description: 'Adds a configurable search experience for pages, columns, services, and CMS records.',
    version: '1.0.0',
    category: 'utility',
    developer: 'Hojeong Builder',
    icon: 'SEARCH',
    permissions: ['site:read', 'cms:read'],
    widgets: [
      {
        widgetId: 'search-box',
        name: 'Search Box',
        area: 'section',
        component: 'SiteSearchBox',
        description: 'Inline search box that links to the configured search route.',
        defaultSize: { width: 620, height: 64 },
        defaultContent: {
          placeholder: '어떻게 도와드릴까요?',
          submitLabel: '검색',
          showResultsInline: true,
          kinds: [],
          locale: '',
          maxResults: 8,
        },
      },
    ],
    settingsPanels: [
      {
        panelId: 'search-settings',
        name: 'Search Settings',
        fields: [
          {
            fieldId: 'placeholder',
            label: 'Placeholder',
            type: 'text',
            defaultValue: 'Search articles and services',
          },
          {
            fieldId: 'include-cms',
            label: 'Include CMS records',
            type: 'boolean',
            defaultValue: true,
          },
          {
            fieldId: 'include-portfolio',
            label: 'Include portfolio projects',
            type: 'boolean',
            defaultValue: true,
          },
          {
            fieldId: 'default-result-limit',
            label: 'Default result limit',
            type: 'number',
            defaultValue: 12,
          },
        ],
      },
    ],
    routes: [
      { routeId: 'search-results', area: 'public', path: '/search', label: 'Search results' },
      { routeId: 'search-admin', area: 'admin', path: '/admin-builder/search', label: 'Search admin' },
      { routeId: 'search-api', area: 'api', path: '/api/search', label: 'Public search API' },
      { routeId: 'search-rebuild-api', area: 'api', path: '/api/builder/search/rebuild', label: 'Search rebuild API' },
    ],
    migrations: [
      { id: 'search-install-v1', toVersion: '1.0.0', description: 'Create initial search app settings.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  {
    appId: 'faq-manager',
    name: 'FAQ Manager',
    summary: 'Reusable FAQ content blocks with schema.org support.',
    description: 'Manages categorized FAQ content, public filters/search, FAQPage schema, and searchable FAQ records.',
    version: '1.0.0',
    category: 'content',
    developer: 'Hojeong Builder',
    icon: 'FAQ',
    permissions: ['site:read', 'cms:read', 'cms:write'],
    widgets: [
      {
        widgetId: 'faq-list',
        name: 'FAQ List',
        area: 'section',
        component: 'FaqListWidget',
        description: 'App-backed accordion FAQ list with category chips, search, and structured data hooks.',
        defaultSize: { width: 960, height: 520 },
        defaultContent: {
          source: 'app',
          categoryId: 'all',
          showSearch: true,
          showCategoryFilter: true,
          expandFirst: true,
          schemaEnabled: true,
          limit: 50,
        },
      },
      {
        widgetId: 'faq-search',
        name: 'FAQ Search',
        area: 'section',
        component: 'BlogSearchWidget',
        description: 'Search box restricted to FAQ records in the site search index.',
        defaultSize: { width: 620, height: 64 },
        defaultContent: {
          placeholder: 'FAQ 검색',
          submitLabel: '검색',
          showResultsInline: true,
          kinds: ['faq'],
          locale: '',
          maxResults: 8,
        },
      },
    ],
    settingsPanels: [
      {
        panelId: 'faq-display',
        name: 'Display',
        fields: [
          { fieldId: 'expand-first', label: 'Expand first question', type: 'boolean', defaultValue: true },
          { fieldId: 'schema-enabled', label: 'Enable FAQ schema', type: 'boolean', defaultValue: true },
        ],
      },
    ],
    routes: [
      { routeId: 'faq-public', area: 'public', path: '/faq', label: 'FAQ page' },
      { routeId: 'faq-admin', area: 'admin', path: '/admin-builder/faq', label: 'FAQ admin' },
    ],
    migrations: [
      { id: 'faq-install-v1', toVersion: '1.0.0', description: 'Prepare FAQ app storage.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  {
    appId: 'native-blog',
    name: 'Blog',
    summary: 'Native blog widgets for published posts, authors, categories, recent posts, and search.',
    description: 'Adds Wix-style public blog widgets backed by the column CMS and native Blog admin data.',
    version: '1.0.0',
    category: 'content',
    developer: 'Hojeong Builder',
    icon: 'BLOG',
    permissions: ['site:read', 'cms:read', 'cms:write'],
    widgets: [
      {
        widgetId: 'blog-list',
        name: 'Blog List',
        area: 'section',
        component: 'BlogListWidget',
        description: 'Published blog feed with category, tag, and newest-first display.',
        defaultSize: { width: 1120, height: 760 },
        defaultContent: {
          layout: 'grid',
          postsPerPage: 9,
          sortBy: 'newest',
          columns: 3,
          gap: 24,
        },
      },
      {
        widgetId: 'blog-post-card',
        name: 'Blog Post Card',
        area: 'section',
        component: 'BlogPostWidget',
        description: 'Selected published blog post teaser card.',
        defaultSize: { width: 360, height: 380 },
      },
      {
        widgetId: 'blog-categories',
        name: 'Blog Categories',
        area: 'section',
        component: 'BlogCategoriesWidget',
        description: 'Category navigation with live published post counts.',
        defaultSize: { width: 920, height: 96 },
      },
      {
        widgetId: 'blog-author',
        name: 'Blog Author',
        area: 'section',
        component: 'BlogAuthorWidget',
        description: 'Author card or author list with recent post links.',
        defaultSize: { width: 420, height: 360 },
      },
      {
        widgetId: 'recent-posts',
        name: 'Recent Posts',
        area: 'section',
        component: 'BlogRecentPostsWidget',
        description: 'Newest published blog posts list or cards.',
        defaultSize: { width: 520, height: 420 },
      },
      {
        widgetId: 'blog-search',
        name: 'Blog Search',
        area: 'section',
        component: 'BlogSearchWidget',
        description: 'Search box restricted to indexed blog posts.',
        defaultSize: { width: 620, height: 64 },
        defaultContent: {
          placeholder: '블로그 검색',
          submitLabel: '검색',
          showResultsInline: true,
          kinds: ['blog'],
          locale: '',
          maxResults: 8,
        },
      },
    ],
    settingsPanels: [
      {
        panelId: 'blog-display',
        name: 'Display',
        fields: [
          { fieldId: 'default-list-size', label: 'Default list size', type: 'number', defaultValue: 9 },
          { fieldId: 'show-author', label: 'Show author metadata', type: 'boolean', defaultValue: true },
        ],
      },
    ],
    routes: [
      { routeId: 'blog-list', area: 'public', path: '/columns', label: 'Blog list' },
      { routeId: 'blog-admin', area: 'admin', path: '/admin-builder/columns', label: 'Blog admin' },
    ],
    migrations: [
      { id: 'native-blog-install-v1', toVersion: '1.0.0', description: 'Connect native blog widgets to column CMS data.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  {
    appId: 'live-chat',
    name: 'Live Chat',
    summary: 'Public chat launcher, visitor conversations, and admin inbox.',
    description: 'Adds a Wix-style live chat app with app-backed launcher settings, visitor conversation APIs, and an admin inbox for replying and closing chats.',
    version: '1.0.0',
    category: 'support',
    developer: 'Hojeong Builder',
    icon: 'CHAT',
    permissions: ['site:read', 'site:write', 'forms:read', 'forms:write'],
    widgets: [
      {
        widgetId: 'chat-launcher',
        name: 'Chat Launcher',
        area: 'overlay',
        component: 'LiveChatLauncherWidget',
        description: 'Floating live chat launcher connected to the site chat inbox.',
        defaultSize: { width: 64, height: 64 },
        defaultContent: {
          provider: 'live-chat',
          label: '실시간 상담',
          placement: 'bottom-right',
          showLabel: false,
          color: '#0f172a',
        },
      },
    ],
    settingsPanels: [
      {
        panelId: 'chat-launcher',
        name: 'Launcher',
        fields: [
          { fieldId: 'launcher-enabled', label: 'Show public launcher', type: 'boolean', defaultValue: true },
          { fieldId: 'launcher-label', label: 'Launcher label', type: 'text', defaultValue: '실시간 상담' },
          { fieldId: 'title', label: 'Panel title', type: 'text', defaultValue: '호정국제 상담' },
          { fieldId: 'intro-text', label: 'Intro text', type: 'textarea', defaultValue: '이름과 이메일은 선택 사항입니다.' },
          { fieldId: 'offline-message', label: 'Offline message', type: 'textarea', defaultValue: '지금은 답변이 지연될 수 있습니다. 메시지를 남겨주시면 확인 후 연락드리겠습니다.' },
          { fieldId: 'accent-color', label: 'Accent color', type: 'text', defaultValue: '#0f172a' },
          { fieldId: 'placement', label: 'Launcher position', type: 'select', defaultValue: 'bottom-right', options: [
            { label: 'Bottom right', value: 'bottom-right' },
            { label: 'Bottom left', value: 'bottom-left' },
            { label: 'Bottom center', value: 'bottom-center' },
          ] },
          { fieldId: 'email-required', label: 'Require visitor email', type: 'boolean', defaultValue: false },
          { fieldId: 'notify-email', label: 'Notification email', type: 'text' },
        ],
      },
    ],
    routes: [
      { routeId: 'chat-inbox', area: 'admin', path: '/admin-builder/inbox', label: 'Live chat inbox' },
      { routeId: 'chat-public-api', area: 'api', path: '/api/live-chat', label: 'Live chat public API' },
      { routeId: 'chat-admin-api', area: 'api', path: '/api/builder/live-chat', label: 'Live chat admin API' },
    ],
    migrations: [
      { id: 'live-chat-install-v1', toVersion: '1.0.0', description: 'Connect live chat launcher settings to the public runtime.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  {
    appId: 'visitor-inbox',
    name: 'Visitor Inbox',
    summary: 'Collect form leads and route them into a review queue.',
    description: 'Connects public forms to an admin inbox with submission status, notes, and lightweight assignment.',
    version: '1.0.0',
    category: 'support',
    developer: 'Hojeong Builder',
    icon: 'INBOX',
    permissions: ['forms:read', 'forms:write', 'cms:read', 'cms:write'],
    widgets: [],
    settingsPanels: [
      {
        panelId: 'inbox-routing',
        name: 'Routing',
        fields: [
          { fieldId: 'notify-email', label: 'Notification email', type: 'text' },
          {
            fieldId: 'default-status',
            label: 'Default status',
            type: 'select',
            defaultValue: 'pending',
            options: [
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
            ],
          },
        ],
      },
    ],
    routes: [
      { routeId: 'inbox-admin', area: 'admin', path: '/admin-builder/inbox', label: 'Inbox' },
    ],
    migrations: [
      { id: 'inbox-install-v1', toVersion: '1.0.0', description: 'Create inbox routing settings.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  {
    appId: 'native-members',
    name: 'Members Area',
    summary: 'Member signup, login, protected account pages, profile, and role-aware navigation.',
    description: 'Adds Wix-style member accounts with session cookies, profile editing, role gates, and account navigation.',
    version: '1.0.0',
    category: 'utility',
    developer: 'Hojeong Builder',
    icon: 'USER',
    permissions: ['site:read', 'site:write', 'members:read', 'members:write'],
    widgets: [],
    settingsPanels: [
      {
        panelId: 'members-access',
        name: 'Access',
        fields: [
          { fieldId: 'allow-signup', label: 'Allow public signup', type: 'boolean', defaultValue: true },
          { fieldId: 'default-role', label: 'Default role', type: 'select', defaultValue: 'free', options: [
            { label: 'Free', value: 'free' },
            { label: 'Premium', value: 'premium' },
          ] },
        ],
      },
    ],
    routes: [
      { routeId: 'members-admin', area: 'admin', path: '/admin-builder/members', label: 'Members admin' },
      { routeId: 'members-login', area: 'public', path: '/login', label: 'Member login' },
      { routeId: 'members-account', area: 'public', path: '/account', label: 'Member account' },
      { routeId: 'members-profile', area: 'public', path: '/account/profile', label: 'Member profile' },
      { routeId: 'members-premium', area: 'public', path: '/account/premium', label: 'Role-gated premium page' },
      { routeId: 'members-api', area: 'api', path: '/api/members', label: 'Members API' },
    ],
    migrations: [
      { id: 'native-members-install-v1', toVersion: '1.0.0', description: 'Prepare member account routes and role gates.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  {
    appId: 'native-events',
    name: 'Events',
    summary: 'Native event admin, public event pages, RSVP, list, and calendar widgets.',
    description: 'Adds Wix-style event management with RSVP/ticket basics and public calendar/list widgets.',
    version: '1.0.0',
    category: 'content',
    developer: 'Hojeong Builder',
    icon: 'CAL',
    permissions: ['site:read', 'site:write', 'forms:read', 'forms:write'],
    widgets: [
      {
        widgetId: 'events-list',
        name: 'Events List',
        area: 'section',
        component: 'EventsListWidget',
        description: 'Upcoming or past events as cards or a compact list.',
        defaultSize: { width: 1120, height: 620 },
        defaultContent: {
          layout: 'cards',
          limit: 6,
          timeFilter: 'upcoming',
          showDescription: true,
          showCapacity: true,
          showRsvp: true,
          columns: 3,
        },
      },
      {
        widgetId: 'events-calendar',
        name: 'Events Calendar',
        area: 'section',
        component: 'EventsCalendarWidget',
        description: 'Month-grouped public events calendar.',
        defaultSize: { width: 980, height: 560 },
        defaultContent: {
          months: 3,
          showPast: false,
          showCapacity: true,
        },
      },
      {
        widgetId: 'event-rsvp',
        name: 'Event RSVP',
        area: 'section',
        component: 'EventsRsvpWidget',
        description: 'RSVP form with free/paid ticket summary and capacity checks.',
        defaultSize: { width: 520, height: 560 },
        defaultContent: {
          title: '이벤트 신청',
          showTicketInfo: true,
          successMessage: '신청이 접수되었습니다. 확인 메일을 기다려 주세요.',
        },
      },
    ],
    settingsPanels: [
      {
        panelId: 'events-display',
        name: 'Display',
        fields: [
          { fieldId: 'default-list-size', label: 'Default list size', type: 'number', defaultValue: 6 },
          { fieldId: 'show-capacity', label: 'Show capacity', type: 'boolean', defaultValue: true },
        ],
      },
    ],
    routes: [
      { routeId: 'events-admin', area: 'admin', path: '/admin-builder/events', label: 'Events admin' },
      { routeId: 'events-list', area: 'public', path: '/events', label: 'Events list' },
      { routeId: 'events-detail', area: 'public', path: '/events/:slug', label: 'Event detail' },
      { routeId: 'events-api', area: 'api', path: '/api/builder/events', label: 'Events API' },
    ],
    migrations: [
      { id: 'native-events-install-v1', toVersion: '1.0.0', description: 'Prepare native events app storage and widgets.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  {
    appId: 'appointments-lite',
    name: 'Appointments Lite',
    summary: 'Simple booking widgets and request forms.',
    description: 'Adds lightweight appointment request widgets for consultation and intake workflows.',
    version: '1.0.0',
    category: 'booking',
    developer: 'Hojeong Builder',
    icon: 'BOOK',
    permissions: ['bookings:read', 'bookings:write', 'forms:read', 'forms:write'],
    widgets: [
      {
        widgetId: 'appointment-request',
        name: 'Appointment Request',
        area: 'section',
        component: 'AppointmentRequestWidget',
        defaultSize: { width: 760, height: 560 },
      },
    ],
    settingsPanels: [
      {
        panelId: 'appointment-rules',
        name: 'Rules',
        fields: [
          { fieldId: 'lead-time-hours', label: 'Lead time hours', type: 'number', defaultValue: 24 },
          { fieldId: 'allow-weekend', label: 'Allow weekend requests', type: 'boolean', defaultValue: false },
        ],
      },
    ],
    routes: [
      { routeId: 'appointments-dashboard', area: 'admin', path: '/admin-builder/bookings/dashboard', label: 'Booking dashboard' },
      { routeId: 'appointments-services', area: 'admin', path: '/admin-builder/bookings/services', label: 'Booking services' },
      { routeId: 'appointments-calendar', area: 'admin', path: '/admin-builder/bookings/calendar', label: 'Booking calendar' },
    ],
    migrations: [
      { id: 'appointments-install-v1', toVersion: '1.0.0', description: 'Create appointment app settings.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  {
    appId: 'native-portfolio',
    name: 'Portfolio',
    summary: 'Native project portfolio with categories, galleries, and detail pages.',
    description: 'Adds Wix-style portfolio management for case studies, image galleries, public archive/detail pages, and app-backed project list widgets.',
    version: '1.0.0',
    category: 'content',
    developer: 'Hojeong Builder',
    icon: 'PF',
    permissions: ['site:read', 'site:write', 'cms:read', 'cms:write'],
    widgets: [
      {
        widgetId: 'portfolio-list',
        name: 'Portfolio List',
        area: 'section',
        component: 'PortfolioListWidget',
        description: 'Project cards with category filtering and responsive gallery previews.',
        defaultSize: { width: 1120, height: 620 },
        defaultContent: {
          layout: 'cards',
          limit: 6,
          featuredOnly: false,
          showSummary: true,
          showDate: true,
          showCategoryFilter: true,
          columns: 3,
          sortBy: 'order-asc',
        },
      },
    ],
    settingsPanels: [
      {
        panelId: 'portfolio-display',
        name: 'Display',
        fields: [
          { fieldId: 'default-list-size', label: 'Default list size', type: 'number', defaultValue: 6 },
          { fieldId: 'show-category-filter', label: 'Show category filter', type: 'boolean', defaultValue: true },
          { fieldId: 'default-layout', label: 'Default layout', type: 'select', defaultValue: 'cards', options: [
            { label: 'Cards', value: 'cards' },
            { label: 'List', value: 'list' },
            { label: 'Masonry', value: 'masonry' },
          ] },
        ],
      },
    ],
    routes: [
      { routeId: 'portfolio-admin', area: 'admin', path: '/admin-builder/portfolio', label: 'Portfolio admin' },
      { routeId: 'portfolio-list', area: 'public', path: '/portfolio', label: 'Portfolio list' },
      { routeId: 'portfolio-detail', area: 'public', path: '/portfolio/:slug', label: 'Portfolio detail' },
      { routeId: 'portfolio-api', area: 'api', path: '/api/builder/portfolio', label: 'Portfolio API' },
    ],
    migrations: [
      { id: 'native-portfolio-install-v1', toVersion: '1.0.0', description: 'Prepare native portfolio app storage and widgets.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  {
    appId: 'native-store',
    name: 'Store',
    summary: 'Native products, collections, public store pages, and gallery widgets.',
    description: 'Adds Wix-style product management, public category pages, and app-backed product gallery widgets.',
    version: '1.0.0',
    category: 'commerce',
    developer: 'Hojeong Builder',
    icon: 'SHOP',
    permissions: ['site:read', 'site:write', 'commerce:read', 'commerce:write', 'media:read'],
    widgets: [
      {
        widgetId: 'product-gallery',
        name: 'Product Gallery',
        area: 'section',
        component: 'ProductGalleryWidget',
        description: 'Responsive product cards with collection filters, sorting, pagination, and quick view.',
        defaultSize: { width: 1120, height: 680 },
        defaultContent: {
          layout: 'grid',
          category: '',
          showCategoryFilter: true,
          showSort: true,
          showQuickView: true,
          columns: 3,
          pageSize: 6,
          sortBy: 'updated-desc',
        },
      },
    ],
    settingsPanels: [
      {
        panelId: 'store-display',
        name: 'Display',
        fields: [
          { fieldId: 'default-page-size', label: 'Default page size', type: 'number', defaultValue: 6 },
          { fieldId: 'show-category-filter', label: 'Show category filter', type: 'boolean', defaultValue: true },
          { fieldId: 'show-quick-view', label: 'Show quick view', type: 'boolean', defaultValue: true },
          { fieldId: 'default-sort', label: 'Default sort', type: 'select', defaultValue: 'updated-desc', options: [
            { label: 'Newest', value: 'updated-desc' },
            { label: 'Name', value: 'title-asc' },
            { label: 'Lowest price', value: 'price-asc' },
            { label: 'Highest price', value: 'price-desc' },
          ] },
        ],
      },
    ],
    routes: [
      { routeId: 'store-admin-products', area: 'admin', path: '/admin-builder/commerce/products', label: 'Products admin' },
      { routeId: 'store-front', area: 'public', path: '/store', label: 'Store front' },
      { routeId: 'store-category', area: 'public', path: '/store/categories/:slug', label: 'Store category' },
      { routeId: 'store-products-api', area: 'api', path: '/api/builder/commerce/products', label: 'Products API' },
      { routeId: 'store-categories-api', area: 'api', path: '/api/builder/commerce/categories', label: 'Categories API' },
    ],
    migrations: [
      { id: 'native-store-install-v1', toVersion: '1.0.0', description: 'Prepare native store products, collections, and widgets.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  {
    appId: 'newsletter-lite',
    name: 'Newsletter Lite',
    summary: 'Subscriber capture and campaign-ready segments.',
    description: 'Adds subscription forms, consent capture, and subscriber segment metadata for marketing flows.',
    version: '1.0.0',
    category: 'marketing',
    developer: 'Hojeong Builder',
    icon: 'MAIL',
    permissions: ['forms:read', 'forms:write', 'cms:read', 'cms:write'],
    widgets: [
      {
        widgetId: 'newsletter-signup',
        name: 'Newsletter Signup',
        area: 'section',
        component: 'NewsletterSignupWidget',
        defaultSize: { width: 720, height: 320 },
      },
    ],
    settingsPanels: [
      {
        panelId: 'newsletter-consent',
        name: 'Consent',
        fields: [
          { fieldId: 'consent-text', label: 'Consent text', type: 'textarea' },
          { fieldId: 'double-opt-in', label: 'Require double opt-in', type: 'boolean', defaultValue: false },
        ],
      },
    ],
    routes: [
      { routeId: 'newsletter-forms', area: 'admin', path: '/admin-builder/forms', label: 'Forms admin' },
      { routeId: 'newsletter-submissions', area: 'admin', path: '/admin-builder/forms/submissions', label: 'Form submissions' },
    ],
    migrations: [
      { id: 'newsletter-install-v1', toVersion: '1.0.0', description: 'Create newsletter settings.' },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
] satisfies unknown[];

const LOCAL_APP_MANIFESTS = RAW_LOCAL_APP_MANIFESTS.map(parseBuilderAppManifest);

export function listLocalBuilderAppManifests(): BuilderAppManifest[] {
  return LOCAL_APP_MANIFESTS.map((manifest) => ({ ...manifest }));
}

export function findLocalBuilderAppManifest(appId: string): BuilderAppManifest | null {
  return LOCAL_APP_MANIFESTS.find((manifest) => manifest.appId === appId) ?? null;
}

function cloneManifest(manifest: BuilderAppManifest): BuilderAppManifest {
  return {
    ...manifest,
    widgets: manifest.widgets.map((widget) => ({
      ...widget,
      defaultContent: widget.defaultContent ? { ...widget.defaultContent } : undefined,
      defaultSize: widget.defaultSize ? { ...widget.defaultSize } : undefined,
    })),
    settingsPanels: manifest.settingsPanels.map((panel) => ({
      ...panel,
      fields: panel.fields.map((field) => ({
        ...field,
        options: field.options?.map((option) => ({ ...option })),
      })),
    })),
    routes: manifest.routes.map((route) => ({ ...route })),
    migrations: manifest.migrations.map((migration) => ({ ...migration })),
    translations: Object.fromEntries(
      Object.entries(manifest.translations).map(([key, value]) => [key, { ...value }]),
    ),
    compatibility: { ...manifest.compatibility },
  };
}

function usableTranslatedText(entry: TranslationEntry, locale: Locale): string | null {
  const value = entry.translations[locale];
  if (!value || value.status === 'outdated') return null;
  const text = value.text.trim();
  return text ? text : null;
}

function setManifestLocalizedText(manifest: BuilderAppManifest, path: string | undefined, text: string): void {
  if (!path) return;
  const parts = path.split('.');
  if (parts.length === 1 && (parts[0] === 'name' || parts[0] === 'summary' || parts[0] === 'description')) {
    manifest[parts[0]] = text;
    return;
  }

  if (parts[0] === 'widgets' && parts.length >= 3) {
    const widget = manifest.widgets.find((item) => item.widgetId === parts[1]);
    if (!widget) return;
    if (parts[2] === 'name') widget.name = text;
    if (parts[2] === 'description') widget.description = text;
    if (parts[2] === 'defaultContent' && parts[3]) {
      widget.defaultContent = {
        ...(widget.defaultContent ?? {}),
        [parts[3]]: text,
      };
    }
    return;
  }

  if (parts[0] === 'settingsPanels' && parts.length >= 3) {
    const panel = manifest.settingsPanels.find((item) => item.panelId === parts[1]);
    if (!panel) return;
    if (parts[2] === 'name') {
      panel.name = text;
      return;
    }
    if (parts[2] === 'fields' && parts[3]) {
      const field = panel.fields.find((item) => item.fieldId === parts[3]);
      if (!field) return;
      if (parts[4] === 'label') field.label = text;
      if (parts[4] === 'description') field.description = text;
      if (parts[4] === 'options' && parts[5] && parts[6] === 'label') {
        const option = field.options?.find((item) => item.value === parts[5]);
        if (option) option.label = text;
      }
    }
    return;
  }

  if (parts[0] === 'routes' && parts.length >= 3) {
    const route = manifest.routes.find((item) => item.routeId === parts[1]);
    if (route && parts[2] === 'label') route.label = text;
  }
}

export function localizeBuilderAppManifest(
  manifest: BuilderAppManifest,
  translations: TranslationEntry[] | undefined,
  locale: Locale,
): BuilderAppManifest {
  const localized = cloneManifest(manifest);
  for (const entry of translations ?? []) {
    if (entry.content.category !== 'apps') continue;
    if (entry.content.contentType !== 'app-manifest') continue;
    if (entry.content.appId !== manifest.appId) continue;
    const translated = usableTranslatedText(entry, locale);
    if (translated) setManifestLocalizedText(localized, entry.content.contentPath, translated);
  }
  return localized;
}

export interface BuilderAppCatalogFilter {
  search?: string;
  category?: BuilderAppCategory | 'all';
}

export function filterLocalBuilderAppManifests(filter: BuilderAppCatalogFilter = {}): BuilderAppManifest[] {
  const query = filter.search?.trim().toLowerCase() ?? '';
  return listLocalBuilderAppManifests().filter((manifest) => {
    if (filter.category && filter.category !== 'all' && manifest.category !== filter.category) return false;
    if (!query) return true;
    return [
      manifest.name,
      manifest.summary,
      manifest.description,
      manifest.category,
      manifest.developer,
      ...manifest.permissions,
    ].some((value) => value.toLowerCase().includes(query));
  });
}
