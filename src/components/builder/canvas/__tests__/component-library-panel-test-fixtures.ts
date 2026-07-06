import {
  builderCanvasNodeSchema,
  type BuilderContainerCanvasNode,
  type BuilderTextCanvasNode,
} from '@/lib/builder/canvas/types';

const defaultNodeStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 14,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
} as const;

type TextNodeFixtureOverrides = Omit<Partial<BuilderTextCanvasNode>, 'content' | 'kind'> & {
  readonly content?: Partial<BuilderTextCanvasNode['content']>;
};

type ContainerNodeFixtureOverrides = Omit<Partial<BuilderContainerCanvasNode>, 'content' | 'kind'> & {
  readonly content?: Partial<BuilderContainerCanvasNode['content']>;
};

const defaultTextContent: BuilderTextCanvasNode['content'] = {
  text: 'Node',
  fontSize: 20,
  color: '#0f172a',
  fontWeight: 'bold',
  align: 'left',
  lineHeight: 1.25,
  letterSpacing: 0,
};

const defaultContainerContent: BuilderContainerCanvasNode['content'] = {
  label: 'Container',
  background: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 14,
  padding: 0,
  layoutMode: 'absolute',
};

export function textNode(overrides: TextNodeFixtureOverrides = {}): BuilderTextCanvasNode {
  const node = builderCanvasNodeSchema.parse({
    id: 'node',
    kind: 'text',
    rect: { x: 0, y: 0, width: 120, height: 80 },
    style: defaultNodeStyle,
    zIndex: 0,
    visible: true,
    ...overrides,
    content: { ...defaultTextContent, ...overrides.content },
  });
  if (node.kind !== 'text') {
    throw new Error(`Expected text fixture node, received ${node.kind}`);
  }
  return node;
}

export function containerNode(overrides: ContainerNodeFixtureOverrides = {}): BuilderContainerCanvasNode {
  const node = builderCanvasNodeSchema.parse({
    id: 'container',
    kind: 'container',
    rect: { x: 0, y: 0, width: 320, height: 240 },
    style: defaultNodeStyle,
    zIndex: 0,
    visible: true,
    ...overrides,
    content: { ...defaultContainerContent, ...overrides.content },
  });
  if (node.kind !== 'container') {
    throw new Error(`Expected container fixture node, received ${node.kind}`);
  }
  return node;
}
