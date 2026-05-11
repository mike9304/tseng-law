import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
  ],
  staticDirs: ['../public'],
  typescript: {
    check: false,
    reactDocgen: false,
  },
  docs: {
    autodocs: false,
  },
};

export default config;
