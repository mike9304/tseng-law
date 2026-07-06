import { describe, expect, it } from 'vitest';
import type { ComponentLibraryEntry } from '../component-library-panel.helpers';
import { getComponentLibraryEntryPreview } from '../component-library-preview';
import { containerNode, textNode } from './component-library-panel-test-fixtures';

describe('component library preview', () => {
  it('builds a text-led visual preview from a saved canvas selection', () => {
    const entry: ComponentLibraryEntry = {
      id: 'text-preview',
      name: 'Hero headline',
      createdAt: '2026-06-18T00:00:00.000Z',
      nodeJson: JSON.stringify(textNode({
        id: 'headline',
        content: {
          text: 'Reusable legal headline',
          fontSize: 32,
          color: '#1d4ed8',
          fontWeight: 'bold',
          align: 'left',
        },
      })),
    };

    const preview = getComponentLibraryEntryPreview(entry);

    expect(preview).toEqual({
      accentColor: '#1d4ed8',
      backgroundColor: '#eef6ff',
      isValid: true,
      nodeCount: 1,
      sampleText: 'Reusable legal headline',
      tone: 'text',
    });
  });

  it('summarizes grouped layout selections using their child content', () => {
    const entry: ComponentLibraryEntry = {
      id: 'layout-preview',
      name: 'Hero group',
      createdAt: '2026-06-18T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'container',
        nodes: [
          containerNode({
            id: 'container',
            content: {
              label: 'Hero frame',
              background: '#f8fafc',
              borderColor: '#cbd5e1',
              borderStyle: 'solid',
              borderWidth: 0,
              borderRadius: 14,
              padding: 0,
            },
          }),
          textNode({
            id: 'headline',
            parentId: 'container',
            content: {
              text: 'Nested headline',
              fontSize: 24,
              color: '#0f172a',
              fontWeight: 'bold',
              align: 'left',
            },
          }),
        ],
      }),
    };

    const preview = getComponentLibraryEntryPreview(entry);

    expect(preview).toMatchObject({
      backgroundColor: '#f8fafc',
      isValid: true,
      nodeCount: 2,
      sampleText: 'Nested headline',
      tone: 'layout',
    });
  });

  it('returns an invalid preview for corrupt stored payloads', () => {
    const entry: ComponentLibraryEntry = {
      id: 'broken',
      name: 'Broken stored payload',
      createdAt: '2026-06-18T00:00:00.000Z',
      nodeJson: '{"id":"missing-kind"}',
    };

    const preview = getComponentLibraryEntryPreview(entry);

    expect(preview).toEqual({
      accentColor: '#ef4444',
      backgroundColor: '#fef2f2',
      isValid: false,
      nodeCount: 0,
      sampleText: 'Broken stored payload',
      tone: 'invalid',
    });
  });
});
