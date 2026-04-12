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
