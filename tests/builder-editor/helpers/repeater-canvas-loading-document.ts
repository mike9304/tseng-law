export type RepeaterLoadingDocument = {
  readonly version: 1;
  readonly locale: 'ko';
  readonly updatedAt: string;
  readonly updatedBy: string;
  readonly stageWidth: number;
  readonly stageHeight: number;
  readonly nodes: readonly Record<string, unknown>[];
};

const baseStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
} as const;

export function makeRepeaterLoadingDocument(token: string): RepeaterLoadingDocument {
  const rootId = `repeater-loading-root-${token}`;
  const repeaterId = `repeater-loading-${token}`;
  const targetId = 'home.insights.feed';
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: `repeater-loading-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 720 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Root',
          background: '#f8fafc',
          borderColor: '#e5e7eb',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 56,
          layoutMode: 'absolute',
        },
      },
      {
        id: repeaterId,
        kind: 'container',
        parentId: rootId,
        rect: { x: 72, y: 84, width: 760, height: 360 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Loading repeater',
          background: '#ffffff',
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 18,
          padding: 20,
          layoutMode: 'repeater',
        },
        dataBinding: {
          targetId,
          recordIndex: 0,
          fields: { title: 'title' },
        },
      },
      {
        id: `repeater-loading-title-${token}`,
        kind: 'text',
        parentId: repeaterId,
        rect: { x: 0, y: 0, width: 240, height: 64 },
        style: baseStyle,
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: 'Template title while loading',
          fontSize: 18,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
        },
        dataBinding: {
          targetId,
          recordIndex: 0,
          fields: { text: 'title' },
        },
      },
    ],
  };
}
