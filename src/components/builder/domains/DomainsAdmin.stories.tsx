import type { Meta, StoryObj } from '@storybook/react';
import DomainsAdmin from './DomainsAdmin';
import type { DomainBinding } from '@/lib/builder/domains/types';

const make = (overrides: Partial<DomainBinding>): DomainBinding => ({
  domainId: 'dom_example.com',
  domain: 'example.com',
  verificationToken: 'vercel-verify=demo123',
  cnameTarget: 'cname.vercel-dns.com',
  status: 'pending-dns',
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-01T00:00:00Z',
  ...overrides,
});

const meta: Meta<typeof DomainsAdmin> = {
  title: 'Domains / Admin',
  component: DomainsAdmin,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof DomainsAdmin>;

export const Empty: Story = { args: { initialDomains: [] } };

export const Mixed: Story = {
  args: {
    initialDomains: [
      make({ domainId: 'd1', domain: 'tseng-law.com', status: 'active', lastVerifiedAt: '2026-05-10T03:00:00Z' }),
      make({ domainId: 'd2', domain: 'pending.example.com', status: 'pending-dns' }),
      make({ domainId: 'd3', domain: 'broken.example.com', status: 'error', lastError: 'TXT record missing' }),
    ],
  },
};
