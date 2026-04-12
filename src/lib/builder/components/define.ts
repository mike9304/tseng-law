import type { ComponentType } from 'react';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

export type BuilderComponentCategory = 'basic' | 'layout' | 'media' | 'domain' | 'advanced';

export interface BuilderComponentRenderProps {
  node: BuilderCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

export interface BuilderComponentInspectorProps {
  node: BuilderCanvasNode;
  onUpdate: (props: Record<string, unknown>) => void;
  disabled?: boolean;
}

export interface BuilderComponentDefinition {
  kind: string;
  displayName: string;
  category: BuilderComponentCategory;
  icon: string;
  defaultContent: Record<string, unknown>;
  defaultStyle: Record<string, unknown>;
  defaultRect: { width: number; height: number };
  Render: AnyComponent;
  Inspector?: AnyComponent;
}

const registry = new Map<string, BuilderComponentDefinition>();

export function defineComponent(def: BuilderComponentDefinition): BuilderComponentDefinition {
  registry.set(def.kind, def);
  return def;
}

export function getComponent(kind: string): BuilderComponentDefinition | undefined {
  return registry.get(kind);
}

export function listComponents(): BuilderComponentDefinition[] {
  return Array.from(registry.values());
}

export function listComponentsByCategory(category: BuilderComponentCategory): BuilderComponentDefinition[] {
  return Array.from(registry.values()).filter((c) => c.category === category);
}
