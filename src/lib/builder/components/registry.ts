/**
 * Phase 3 — Component registry.
 *
 * Import this file to auto-register all built-in components.
 * New components: add a folder under src/lib/builder/components/<kind>/
 * with an index.ts that calls defineComponent(), then import it here.
 */

// Re-export the registry API
export { defineComponent, getComponent, listComponents, listComponentsByCategory } from './define';
export type {
  BuilderComponentDefinition,
  BuilderComponentCategory,
  BuilderComponentRenderProps,
  BuilderComponentInspectorProps,
} from './define';

// Auto-register built-in components by importing their side-effectful modules
import './text';
import './image';
import './button';
import './heading';
import './container';
import './section';

// Phase 7 components
import './gallery';
import './video';
import './videoEmbed';
import './audio';
import './lottie';
import './map';
import './customEmbed';
import './icon';
import './spacer';
import './divider';
import './columnCard';
import './columnList';
import './attorneyCard';
import './faqList';
import './contactForm';
import './ctaBanner';
import './bookingWidget';
import './composite';

// Phase 4 — Forms widgets
import './form';
import './formInput';
import './formTextarea';
import './formSubmit';
import './formSelect';
import './formCheckbox';
import './formRadio';
import './formFile';
import './formDate';

// Phase 14 — Blog widgets
import './blogFeed';
import './blogPostCard';
import './blogCategories';
import './blogArchive';
import './featuredPosts';

// Phase 15 — Interactive widgets
import './countdown';
import './progress';
import './rating';
import './notificationBar';
import './backToTop';

// Phase 16 — Navigation widgets
import './menuBar';
import './anchorMenu';
import './breadcrumbs';

// Phase 17 — Social widgets
import './socialBar';
import './shareButtons';
import './socialEmbed';
import './floatingChat';

// Phase 18 — Maps & Location
import './addressBlock';
import './businessHours';
import './multiLocationMap';
